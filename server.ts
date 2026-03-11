import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stripe: Stripe | null = null;

const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Users
  const MOCK_USERS = {
    'admin@klo.com': { id: 'admin_1', email: 'admin@klo.com', role: 'ADMIN', name: 'KLO Administrator' },
    'provider@klo.com': { id: 'prov_1', email: 'provider@klo.com', role: 'PROVIDER', name: 'Nauty 360 Partner' },
    'client@klo.com': { id: 'client_1', email: 'client@klo.com', role: 'CLIENT', name: 'UHNWI Client' },
  };

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Simple mock auth - any password works for mock emails
    const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Mock Leads
  let MOCK_LEADS: any[] = [
    { id: 'L1', name: 'Julian Casablancas', email: 'julian@thestrokes.com', phone: '+1 212 555 0192', message: 'Interested in a private villa in Anguilla for April.', status: 'NEW', timestamp: '1h ago', source: 'WHATSAPP' },
    { id: 'L2', name: 'Sofia Coppola', email: 'sofia@lostintranslation.com', phone: '+1 310 555 0183', message: 'Need a Gulfstream G650 for a trip to Tokyo.', status: 'CONTACTED', timestamp: '3h ago', source: 'CONCIERGE' },
  ];

  // Leads API
  app.get("/api/leads", (req, res) => {
    res.json(MOCK_LEADS);
  });

  app.post("/api/leads", (req, res) => {
    const lead = {
      ...req.body,
      id: 'L' + (MOCK_LEADS.length + 1),
      timestamp: 'Just now',
      status: 'NEW'
    };
    MOCK_LEADS = [lead, ...MOCK_LEADS];
    res.json({ success: true, lead });
  });

  app.patch("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    MOCK_LEADS = MOCK_LEADS.map(l => l.id === id ? { ...l, ...updates } : l);
    res.json({ success: true });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Simulated Admin Data
  app.get("/api/admin/stats", (req, res) => {
    res.json({
      totalRevenue: "$2.4M",
      activeBookings: 42,
      pendingApprovals: 7,
      partnerCount: 128,
      revenueData: [
        { name: 'Jan', value: 400000 },
        { name: 'Feb', value: 300000 },
        { name: 'Mar', value: 600000 },
        { name: 'Apr', value: 800000 },
        { name: 'May', value: 500000 },
        { name: 'Jun', value: 900000 },
      ]
    });
  });

  // Simulated Stripe Payment Intent (Invisible Payments)
  app.post("/api/payments/create-intent", async (req, res) => {
    const { amount, customerId } = req.body;
    const stripeClient = getStripe();
    
    if (stripeClient) {
      try {
        const paymentIntent = await stripeClient.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          customer: customerId,
          automatic_payment_methods: { enabled: true },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    } else {
      // Fallback for mock
      console.log(`Creating invisible payment intent for customer ${customerId}: ${amount}`);
      res.json({
        clientSecret: "pi_simulated_secret_" + Math.random().toString(36).substring(7),
        status: "requires_confirmation"
      });
    }
  });

  // Stripe Connect: Create Account
  app.post("/api/stripe/connect", async (req, res) => {
    const stripeClient = getStripe();
    if (!stripeClient) {
      // Simulation mode
      console.log("Stripe not configured. Returning simulated Connect URL.");
      return res.json({ url: `${req.headers.origin}/provider/stripe-return`, accountId: "acct_simulated_" + Math.random().toString(36).substring(7) });
    }

    try {
      const account = await stripeClient.accounts.create({ type: 'express' });
      const accountLink = await stripeClient.accountLinks.create({
        account: account.id,
        refresh_url: `${req.headers.origin}/provider/stripe-refresh`,
        return_url: `${req.headers.origin}/provider/stripe-return`,
        type: 'account_onboarding',
      });
      res.json({ url: accountLink.url, accountId: account.id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stripe Checkout Session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const stripeClient = getStripe();
    if (!stripeClient) {
      // Simulation mode
      console.log("Stripe not configured. Returning simulated Checkout URL.");
      return res.json({ id: "cs_simulated_" + Math.random().toString(36).substring(7), url: `${req.headers.origin}?booking=success` });
    }

    const { items, successUrl, cancelUrl } = req.body;

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(parseFloat(item.pricePerUnit.replace(/[^0-9.]/g, '')) * 100),
          },
          quantity: 1,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KLO Ecosystem Server running on http://localhost:${PORT}`);
  });
}

startServer();
