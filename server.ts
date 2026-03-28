import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Stripe from "stripe";
import crypto from "crypto";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Setup
const _supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

const supabase = new Proxy({}, {
  get: (target, prop) => {
    if (!_supabase) {
      throw new Error("Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in the Secrets panel.");
    }
    return (_supabase as any)[prop];
  }
}) as any;

if (!_supabase) {
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_KEY is missing. Supabase features will be disabled.");
}

let stripe: Stripe | null = null;

const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// Mock Users (Keep for logic, but enforce password)
const MOCK_USERS = {
  'admin@klo.com': { id: 'admin_1', email: 'admin@klo.com', role: 'ADMIN', name: 'KLO Administrator' },
  'provider@klo.com': { id: 'prov_1', email: 'provider@klo.com', role: 'PROVIDER', name: 'Nauty 360 Partner' },
  'client@klo.com': { id: 'client_1', email: 'client@klo.com', role: 'CLIENT', name: 'UHNWI Client' },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    // Enforce password "123456" for all users as requested
    if (password !== "123456") {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    const user = MOCK_USERS[email as keyof typeof MOCK_USERS];
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Leads API
  app.get("/api/leads", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/leads", async (req, res) => {
    const { name, email, phone, whatsapp, experience_type, budget, travel_dates, special_requests, message, source } = req.body;
    const id = 'L' + Date.now();
    const timestamp = new Date().toISOString();
    const status = 'NEW';
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ 
          id, name, email, phone, whatsapp, experience_type, 
          budget: budget || null, 
          travel_dates: travel_dates || null, 
          special_requests: special_requests || null, 
          message, status, timestamp, source 
        }])
        .select();
      
      if (error) throw error;
      res.json({ success: true, lead: data[0] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          assets (
            name,
            type
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to match previous response format
      const transformed = data.map((b: any) => ({
        ...b,
        asset_name: b.assets?.name,
        asset_type: b.assets?.type
      }));
      
      res.json(transformed);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    const { asset_id, guest_name, guest_email, start_date, end_date, total_price, notes } = req.body;
    const id = crypto.randomUUID();
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{ id, asset_id, guest_name, guest_email, start_date, end_date, total_price, notes }]);
      
      if (error) throw error;
      res.json({ success: true, booking_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    try {
      const updates: any = {};
      if (status) updates.status = status;
      if (notes !== undefined) updates.notes = notes;
      
      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Supplier API
  app.post("/api/suppliers/register", async (req, res) => {
    const { id: providedId, business_name, contact_name, email, whatsapp, location, asset_type, description, google_calendar_id } = req.body;
    const id = providedId || crypto.randomUUID();
    
    try {
      const { error } = await supabase
        .from('suppliers')
        .upsert({
          id, business_name, contact_name, email, whatsapp, location, asset_type, description, 
          google_calendar_id: google_calendar_id || null
        });
      
      if (error) throw error;
      res.json({ success: true, supplier_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/suppliers", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { data: supplier, error: sError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (sError) throw sError;
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });
      
      const { data: assets, error: aError } = await supabase
        .from('assets')
        .select('*')
        .eq('supplier_id', id);
      
      if (aError) throw aError;
      
      res.json({ ...supplier, assets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/suppliers/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const { error: sError } = await supabase
        .from('suppliers')
        .update({ status })
        .eq('id', id);
      
      if (sError) throw sError;
      
      if (status === 'APPROVED') {
        await supabase.from('assets').update({ status: 'ACTIVE' }).eq('supplier_id', id);
        console.log(`Supplier ${id} APPROVED. Assets activated.`);
      } else if (status === 'REJECTED') {
        await supabase.from('assets').update({ status: 'REJECTED' }).eq('supplier_id', id);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Assets API
  app.post("/api/assets", async (req, res) => {
    const asset = req.body;
    const id = crypto.randomUUID();
    try {
      const { error } = await supabase
        .from('assets')
        .insert([{
          id, 
          supplier_id: asset.supplier_id, 
          name: asset.name, 
          type: asset.type, 
          location: asset.location, 
          description: asset.description, 
          price_per_unit: asset.price_per_unit, 
          price_type: asset.price_type, 
          capacity: asset.capacity, 
          amenities: asset.amenities || [], 
          images: asset.images || [], 
          status: asset.status || 'ACTIVE', 
          google_calendar_id: asset.google_calendar_id
        }]);
      
      if (error) throw error;
      res.json({ success: true, asset_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets", async (req, res) => {
    const { type, status, location } = req.query;
    try {
      let query = supabase.from('assets').select('*');

      if (type) query = query.eq('type', type);
      if (status) query = query.eq('status', status);
      if (location) query = query.ilike('location', `%${location}%`);

      const { data, error } = await query;
      if (error) throw error;
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets/:id/availability", async (req, res) => {
    const { id } = req.params;
    const { month, year } = req.query;
    const prefix = `${year}-${month}`;
    
    try {
      const { data, error } = await supabase
        .from('asset_availability')
        .select('*')
        .eq('asset_id', id)
        .ilike('date', `${prefix}%`);
      
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assets/:id/availability", async (req, res) => {
    const { id } = req.params;
    const { dates, status, price_override } = req.body;
    
    try {
      const upserts = dates.map((date: string) => ({
        id: crypto.randomUUID(),
        asset_id: id,
        date,
        status,
        price_override
      }));
      
      const { error } = await supabase
        .from('asset_availability')
        .upsert(upserts);
        
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Google Calendar Sync
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
  const GOOGLE_REDIRECT_URI = `${APP_URL}/api/calendar/callback`;

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  app.get("/api/calendar/auth-url", (req, res) => {
    const { supplier_id } = req.query;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.json({ url: null, mock: true });
    }

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar.readonly"],
      prompt: "consent",
      state: supplier_id as string
    });

    res.json({ url });
  });

  app.get("/api/calendar/callback", async (req, res) => {
    const { code, state: supplier_id } = req.query;
    if (!code) return res.status(400).send("No code provided");

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      const expiry = tokens.expiry_date || (Date.now() + 3600000);
      
      // Ensure supplier exists
      await supabase.from('suppliers').upsert({ id: supplier_id, status: 'PENDING' });
      
      await supabase
        .from('suppliers')
        .update({
          google_access_token: tokens.access_token,
          google_refresh_token: tokens.refresh_token,
          google_token_expiry: expiry
        })
        .eq('id', supplier_id);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_CALENDAR_AUTH_SUCCESS', supplier_id: '${supplier_id}' }, '*');
                window.close();
              } else {
                window.location.href = '/supplier?connected=true';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      res.status(500).send(`Auth failed: ${error.message}`);
    }
  });

  async function getValidAccessToken(supplier: any) {
    if (Date.now() < supplier.google_token_expiry - 60000) {
      return supplier.google_access_token;
    }

    if (!supplier.google_refresh_token) {
      throw new Error("No refresh token available");
    }

    const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
    client.setCredentials({ refresh_token: supplier.google_refresh_token });
    
    const { credentials } = await client.refreshAccessToken();
    const expiry = credentials.expiry_date || (Date.now() + 3600000);
    
    await supabase
      .from('suppliers')
      .update({
        google_access_token: credentials.access_token,
        google_token_expiry: expiry
      })
      .eq('id', supplier.id);

    return credentials.access_token;
  }

  async function syncSupplierCalendar(supplier_id: string) {
    const { data: supplier, error: sError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplier_id)
      .single();
      
    if (sError || !supplier) return 0;

    const { data: assets, error: aError } = await supabase
      .from('assets')
      .select('*')
      .eq('supplier_id', supplier_id);
      
    if (aError || !assets) return 0;

    let totalSynced = 0;
    for (const asset of assets) {
      totalSynced += await syncAssetCalendar(asset, supplier);
    }
    return totalSynced;
  }

  async function syncAssetCalendar(asset: any, supplier: any) {
    const calendarId = asset.google_calendar_id || supplier.google_calendar_id || 'primary';
    let events = [];

    if (!GOOGLE_CLIENT_ID || !supplier.google_access_token) {
      // Mock Sync
      const today = new Date();
      for (let i = 0; i < 5; i++) {
        const randomDay = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(today.getDate() + randomDay);
        events.push({
          start: { date: date.toISOString().split('T')[0] },
          end: { date: date.toISOString().split('T')[0] }
        });
      }
    } else {
      try {
        const accessToken = await getValidAccessToken(supplier);
        const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
        client.setCredentials({ access_token: accessToken });
        
        const calendar = google.calendar({ version: 'v3', auth: client });
        const timeMin = new Date().toISOString();
        const timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
        
        const res = await calendar.events.list({
          calendarId: calendarId,
          timeMin: timeMin,
          timeMax: timeMax,
          singleEvents: true,
          orderBy: 'startTime',
        });
        
        events = res.data.items || [];
      } catch (error: any) {
        console.error(`Failed to sync calendar for asset ${asset.id}:`, error.message);
        return 0;
      }
    }

    const availabilityUpserts = [];
    for (const event of events) {
      const startStr = event.start?.date || event.start?.dateTime?.split('T')[0];
      const endStr = event.end?.date || event.end?.dateTime?.split('T')[0];
      
      if (!startStr || !endStr) continue;

      let current = new Date(startStr);
      const endDate = new Date(endStr);

      while (current < endDate) {
        const dateStr = current.toISOString().split('T')[0];
        availabilityUpserts.push({
          id: crypto.randomUUID(),
          asset_id: asset.id,
          date: dateStr,
          status: 'BLOCKED',
          source: 'GOOGLE_CALENDAR'
        });
        current.setDate(current.getDate() + 1);
      }
      
      if (startStr === endStr) {
        availabilityUpserts.push({
          id: crypto.randomUUID(),
          asset_id: asset.id,
          date: startStr,
          status: 'BLOCKED',
          source: 'GOOGLE_CALENDAR'
        });
      }
    }

    if (availabilityUpserts.length > 0) {
      await supabase.from('asset_availability').upsert(availabilityUpserts);
    }

    return availabilityUpserts.length;
  }

  app.get("/api/calendar/sync/:asset_id", async (req, res) => {
    const { asset_id } = req.params;
    try {
      const { data: asset, error: aError } = await supabase.from('assets').select('*').eq('id', asset_id).single();
      if (aError || !asset) return res.status(404).json({ error: "Asset not found" });
      
      const { data: supplier, error: sError } = await supabase.from('suppliers').select('*').eq('id', asset.supplier_id).single();
      if (sError || !supplier) return res.status(404).json({ error: "Supplier not found" });
      
      const synced = await syncAssetCalendar(asset, supplier);
      res.json({ synced });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calendar/sync-all", async (req, res) => {
    try {
      const { data: suppliers, error } = await supabase.from('suppliers').select('id').not('google_refresh_token', 'is', null);
      if (error) throw error;
      
      let total = 0;
      for (const s of suppliers) {
        total += await syncSupplierCalendar(s.id);
      }
      res.json({ success: true, total_synced: total });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
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

  // Simulated Stripe Payment Intent
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
      res.json({
        clientSecret: "pi_simulated_secret_" + Math.random().toString(36).substring(7),
        status: "requires_confirmation"
      });
    }
  });

  // Stripe Connect
  app.post("/api/stripe/connect", async (req, res) => {
    const stripeClient = getStripe();
    if (!stripeClient) {
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

  // Stripe Checkout
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    const stripeClient = getStripe();
    if (!stripeClient) {
      return res.json({ id: "cs_simulated_" + Math.random().toString(36).substring(7), url: `${req.headers.origin}?booking=success` });
    }

    const { items, successUrl, cancelUrl, paymentMethod } = req.body;

    try {
      const sessionParams: any = {
        payment_method_types: paymentMethod === 'usdc' ? ['card', 'us_bank_account'] : ['card'],
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
      };

      if (paymentMethod === 'usdc') {
        sessionParams.crypto = { enabled: true };
      }

      const session = await stripeClient.checkout.sessions.create(sessionParams);
      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    const { message, lang, mode } = req.body;
    const systemPrompt = `You are Maria Fernanda,
      the AI orchestration engine for KLO (Karibbean Luxury Operators),
      an ultra-luxury travel brokerage in the Caribbean.
      You help UHNW clients plan extraordinary experiences across 5 pillars:
      AIR: Private aviation (jets, helicopters)
      SEA: Yachts and maritime experiences
      STAY: Ultra-luxury villas and residences
      LAND: Armored transport via Vianco VIP
      STAFF: Private chefs, security, DJs, butlers
      KLO charges 20% management fee on all bookings.
      Always respond in ${lang} language.
      Be concise, elegant, ultra-luxury in tone.
      When user asks to plan a journey respond ONLY
      with valid raw JSON no markdown no extra text:
      {title, estimatedTotal, managementFee,
       pillars:{air,sea,stay,land,staff},
       itinerary:[{time,activity,pillar,location,status,tte}],
       securityBrief:{level,riskAssessment,protocols},
       legalRequirements:[]}`;

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        { method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://karibbeanluxuryoperators.lat',
            'X-Title': 'KLO Karibbean Luxury Operators'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1500
          })
        }
      );
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (mode === 'plan') {
        try {
          const clean = text.replace(/```json|```/g,'').trim();
          const plan = JSON.parse(clean);
          res.json({ success: true, plan });
        } catch {
          res.json({ success: true, plan: null, text });
        }
      } else {
        res.json({ success: true, text });
      }
    } catch (error) {
      res.json({ success: true,
        text: 'A KLO concierge will contact you via WhatsApp within 2 hours.',
        plan: null });
    }
  });

  app.post("/api/calendar/disconnect/:supplier_id", async (req, res) => {
    const { supplier_id } = req.params;
    try {
      await supabase
        .from('suppliers')
        .update({
          google_access_token: null,
          google_refresh_token: null,
          google_token_expiry: null,
          google_calendar_id: null
        })
        .eq('id', supplier_id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Periodic Calendar Sync
  setInterval(async () => {
    console.log('Starting periodic calendar sync...');
    const { data: suppliers } = await supabase.from('suppliers').select('id').not('google_refresh_token', 'is', null);
    if (suppliers) {
      for (const supplier of suppliers) {
        try {
          await syncSupplierCalendar(supplier.id);
        } catch (error: any) {
          console.error(`Periodic sync failed for supplier ${supplier.id}:`, error.message);
        }
      }
    }
  }, 6 * 60 * 60 * 1000);

  // Vite middleware
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
