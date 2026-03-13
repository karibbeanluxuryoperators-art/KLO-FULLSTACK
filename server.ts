import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Stripe from "stripe";
import Database from "better-sqlite3";
import crypto from "crypto";

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

  // Database Setup
  const db = new Database("klo.db");
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      business_name TEXT,
      contact_name TEXT,
      email TEXT,
      whatsapp TEXT,
      location TEXT,
      asset_type TEXT,
      description TEXT,
      status TEXT DEFAULT 'PENDING',
      google_calendar_id TEXT,
      google_access_token TEXT,
      google_refresh_token TEXT,
      google_token_expiry INTEGER,
      created_at TEXT DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      supplier_id TEXT,
      name TEXT,
      type TEXT,
      location TEXT,
      description TEXT,
      price_per_unit TEXT,
      price_type TEXT,
      capacity INTEGER,
      amenities TEXT,
      images TEXT,
      status TEXT DEFAULT 'ACTIVE',
      google_calendar_id TEXT,
      created_at TEXT DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS asset_availability (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      date TEXT,
      status TEXT,
      price_override TEXT,
      source TEXT DEFAULT 'MANUAL'
    );

    CREATE TABLE IF NOT EXISTS supplier_media (
      id TEXT PRIMARY KEY,
      supplier_id TEXT,
      asset_id TEXT,
      url TEXT,
      type TEXT,
      is_primary BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT current_timestamp
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      guest_name TEXT,
      guest_email TEXT,
      start_date TEXT,
      end_date TEXT,
      total_price TEXT,
      status TEXT DEFAULT 'PENDING',
      notes TEXT,
      created_at TEXT DEFAULT current_timestamp
    );
  `);

  const seedAssets = () => {
    const count = db.prepare('SELECT COUNT(*) as c FROM assets').get() as any;
    if (count.c > 0) return;

    const insert = db.prepare(`
      INSERT INTO assets (id, supplier_id, name, type, location,
      description, price_per_unit, price_type, capacity,
      amenities, images, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const assets = [
      { id: 'villa-001', supplier_id: 'klo-direct',
        name: 'Villa Casa de Lujo', type: 'LODGING',
        location: 'Cartagena', price_per_unit: '$5,500/night',
        price_type: 'PER_NIGHT', capacity: 12,
        description: 'Spectacular 6-bedroom oceanfront villa in Cartagena with private pool, beach access, and 24/7 security. Perfect for UHNW families and corporate retreats.',
        amenities: JSON.stringify(['Pool','Beach Access','Chef Kitchen','Gym','Security Room','Private Dock']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'])
      },
      { id: 'villa-002', supplier_id: 'klo-direct',
        name: 'Villa Punta Norte', type: 'LODGING',
        location: 'Santa Marta', price_per_unit: '$3,800/night',
        price_type: 'PER_NIGHT', capacity: 8,
        description: 'Breathtaking 4-bedroom villa with panoramic mountain and sea views. Private chef available. Helipad access.',
        amenities: JSON.stringify(['Pool','Mountain View','Chef Kitchen','Helipad','Gym']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'])
      },
      { id: 'yacht-001', supplier_id: 'klo-direct',
        name: 'Serenity 150', type: 'VESSEL',
        location: 'Cartagena', price_per_unit: '$15,000/day',
        price_type: 'PER_DAY', capacity: 12,
        description: '150ft superyacht with crew of 8. Beach club, infinity pool, water toys, Michelin-level dining. Available for day charters and multi-day voyages across the Caribbean.',
        amenities: JSON.stringify(['Crew of 8','Water Toys','Jet Ski','Dive Equipment','Tender','Fine Dining']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800'])
      },
      { id: 'yacht-002', supplier_id: 'klo-direct',
        name: 'Azul Express 85', type: 'VESSEL',
        location: 'Cartagena', price_per_unit: '$6,500/day',
        price_type: 'PER_DAY', capacity: 8,
        description: '85ft luxury motor yacht. Perfect for day trips to the Rosario Islands. Crew of 4, fully equipped with water sports gear.',
        amenities: JSON.stringify(['Crew of 4','Water Toys','Fishing Gear','Snorkeling','BBQ']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'])
      },
      { id: 'jet-001', supplier_id: 'klo-direct',
        name: 'Gulfstream G450', type: 'AIRCRAFT',
        location: 'Bogota', price_per_unit: '$12,000/hr',
        price_type: 'PER_HOUR', capacity: 12,
        description: 'Ultra long range heavy jet. Direct flights from Bogota to Miami, New York, or London. Bespoke interior with full galley and sleeping capacity.',
        amenities: JSON.stringify(['Sleeping Cabin','Full Galley','WiFi','Entertainment','Baggage Hold']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800'])
      },
      { id: 'jet-002', supplier_id: 'klo-direct',
        name: 'King Air 350', type: 'AIRCRAFT',
        location: 'Cartagena', price_per_unit: '$3,500/hr',
        price_type: 'PER_HOUR', capacity: 8,
        description: 'Premium turboprop for inter-Caribbean routes. Ideal for Cartagena to San Andres, Santa Marta, or Medellin. Fast, comfortable, economical.',
        amenities: JSON.stringify(['WiFi','Leather Seating','Climate Control','Baggage Hold']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'])
      },
      { id: 'vehicle-001', supplier_id: 'klo-direct',
        name: 'Escalade ESV Armored', type: 'VEHICLE',
        location: 'Bogota', price_per_unit: '$950/day',
        price_type: 'PER_DAY', capacity: 6,
        description: 'B6 level armored Escalade ESV Platinum. Professional security driver, secure comms, pre-vetted routes. Available for airport transfers and full-day security detail.',
        amenities: JSON.stringify(['B6 Armor','Secure Comms','Professional Driver','GPS Tracking','Privacy Glass']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800'])
      },
      { id: 'staff-001', supplier_id: 'klo-direct',
        name: 'Private Chef — Mediterranean', type: 'STAFF',
        location: 'Cartagena', price_per_unit: '$800/day',
        price_type: 'PER_DAY', capacity: 1,
        description: 'Michelin-trained private chef specializing in Mediterranean and Caribbean fusion. Sources local ingredients daily. Available for villa, yacht, and event catering.',
        amenities: JSON.stringify(['Michelin Trained','Menu Planning','Dietary Accommodations','Wine Pairing','Event Catering']),
        images: JSON.stringify(['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800'])
      },
    ];

    for (const a of assets) {
      insert.run(a.id, a.supplier_id, a.name, a.type,
        a.location, a.description, a.price_per_unit,
        a.price_type, a.capacity, a.amenities,
        a.images, 'ACTIVE');
    }
    console.log('KLO: Seeded', assets.length, 'real assets');
  };

  seedAssets();

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
    { id: 'L1', name: 'Julian Casablancas', email: 'julian@thestrokes.com', phone: '+1 212 555 0192', message: 'Interested in a private villa in Anguilla for April.', status: 'NEW', timestamp: new Date(Date.now() - 3600000).toISOString(), source: 'WHATSAPP' },
    { id: 'L2', name: 'Sofia Coppola', email: 'sofia@lostintranslation.com', phone: '+1 310 555 0183', message: 'Need a Gulfstream G650 for a trip to Tokyo.', status: 'CONTACTED', timestamp: new Date(Date.now() - 10800000).toISOString(), source: 'CONCIERGE' },
  ];

  // Leads API
  app.get("/api/leads", (req, res) => {
    res.json(MOCK_LEADS);
  });

  app.post("/api/leads", (req, res) => {
    const lead = {
      ...req.body,
      id: 'L' + (MOCK_LEADS.length + 1),
      timestamp: new Date().toISOString(),
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

  // Bookings API
  app.get("/api/bookings", (req, res) => {
    try {
      const bookings = db.prepare(`
        SELECT b.*, a.name as asset_name, a.type as asset_type 
        FROM bookings b
        LEFT JOIN assets a ON b.asset_id = a.id
        ORDER BY b.created_at DESC
      `).all();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const { asset_id, guest_name, guest_email, start_date, end_date, total_price, notes } = req.body;
    const id = crypto.randomUUID();
    try {
      const stmt = db.prepare(`
        INSERT INTO bookings (id, asset_id, guest_name, guest_email, start_date, end_date, total_price, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, asset_id, guest_name, guest_email, start_date, end_date, total_price, notes);
      res.json({ success: true, booking_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    try {
      if (status && notes !== undefined) {
        db.prepare("UPDATE bookings SET status = ?, notes = ? WHERE id = ?").run(status, notes, id);
      } else if (status) {
        db.prepare("UPDATE bookings SET status = ? WHERE id = ?").run(status, id);
      } else if (notes !== undefined) {
        db.prepare("UPDATE bookings SET notes = ? WHERE id = ?").run(notes, id);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Supplier API
  app.post("/api/suppliers/register", (req, res) => {
    const { business_name, contact_name, email, whatsapp, location, asset_type, description, google_calendar_id } = req.body;
    const id = crypto.randomUUID();
    
    try {
      const stmt = db.prepare(`
        INSERT INTO suppliers (id, business_name, contact_name, email, whatsapp, location, asset_type, description, google_calendar_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(id, business_name, contact_name, email, whatsapp, location, asset_type, description, google_calendar_id);
      res.json({ success: true, supplier_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/suppliers", (req, res) => {
    try {
      const suppliers = db.prepare("SELECT * FROM suppliers ORDER BY created_at DESC").all();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/suppliers/:id", (req, res) => {
    const { id } = req.params;
    try {
      const supplier = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(id) as any;
      if (!supplier) return res.status(404).json({ error: "Supplier not found" });
      
      const assets = db.prepare("SELECT * FROM assets WHERE supplier_id = ?").all(id);
      res.json({ ...supplier, assets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/suppliers/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      db.prepare("UPDATE suppliers SET status = ? WHERE id = ?").run(status, id);
      if (status === 'APPROVED') {
        console.log(`Supplier ${id} APPROVED. Sending confirmation to ${+573243132500} via WhatsApp.`);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Assets API
  app.post("/api/assets", (req, res) => {
    const asset = req.body;
    const id = crypto.randomUUID();
    try {
      const stmt = db.prepare(`
        INSERT INTO assets (id, supplier_id, name, type, location, description, price_per_unit, price_type, capacity, amenities, images, status, google_calendar_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        id, 
        asset.supplier_id, 
        asset.name, 
        asset.type, 
        asset.location, 
        asset.description, 
        asset.price_per_unit, 
        asset.price_type, 
        asset.capacity, 
        JSON.stringify(asset.amenities || []), 
        JSON.stringify(asset.images || []), 
        asset.status || 'ACTIVE', 
        asset.google_calendar_id
      );
      res.json({ success: true, asset_id: id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets", (req, res) => {
    const { type, status, location } = req.query;
    let query = "SELECT * FROM assets WHERE 1=1";
    const params: any[] = [];

    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (location) {
      query += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    try {
      const assets = db.prepare(query).all(params);
      res.json(assets.map((a: any) => ({
        ...a,
        amenities: JSON.parse(a.amenities || '[]'),
        images: JSON.parse(a.images || '[]')
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/assets/:id/availability", (req, res) => {
    const { id } = req.params;
    const { month, year } = req.query;
    const prefix = `${year}-${month}`;
    
    try {
      const availability = db.prepare("SELECT * FROM asset_availability WHERE asset_id = ? AND date LIKE ?").all(id, `${prefix}%`);
      res.json(availability);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/assets/:id/availability", (req, res) => {
    const { id } = req.params;
    const { dates, status, price_override } = req.body;
    
    try {
      const insert = db.prepare("INSERT OR REPLACE INTO asset_availability (id, asset_id, date, status, price_override) VALUES (?, ?, ?, ?, ?)");
      const transaction = db.transaction((datesList) => {
        for (const date of datesList) {
          insert.run(crypto.randomUUID(), id, date, status, price_override);
        }
      });
      transaction(dates);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Google Calendar Sync
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/calendar/callback";

  app.get("/api/calendar/auth/:supplier_id", (req, res) => {
    const { supplier_id } = req.params;
    if (!GOOGLE_CLIENT_ID) {
      return res.redirect(`/supplier?connected=mock&supplier_id=${supplier_id}`);
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      access_type: "offline",
      prompt: "consent",
      state: supplier_id
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });

  app.get("/api/calendar/callback", async (req, res) => {
    const { code, state: supplier_id } = req.query;
    if (!code) return res.status(400).send("No code provided");

    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code"
        })
      });

      const tokens = await tokenRes.json() as any;
      if (tokens.error) throw new Error(tokens.error_description || tokens.error);

      const expiry = Date.now() + (tokens.expires_in * 1000);
      db.prepare(`
        UPDATE suppliers 
        SET google_access_token = ?, google_refresh_token = ?, google_token_expiry = ?
        WHERE id = ?
      `).run(tokens.access_token, tokens.refresh_token, expiry, supplier_id);

      res.redirect("/supplier?connected=true");
    } catch (error: any) {
      res.status(500).send(`Auth failed: ${error.message}`);
    }
  });

  async function getValidAccessToken(supplier: any) {
    if (Date.now() < supplier.google_token_expiry - 60000) {
      return supplier.google_access_token;
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: supplier.google_refresh_token,
        grant_type: "refresh_token"
      })
    });

    const tokens = await tokenRes.json() as any;
    const expiry = Date.now() + (tokens.expires_in * 1000);
    db.prepare(`
      UPDATE suppliers 
      SET google_access_token = ?, google_token_expiry = ?
      WHERE id = ?
    `).run(tokens.access_token, expiry, supplier.id);

    return tokens.access_token;
  }

  async function syncSupplierCalendar(supplier_id: string) {
    const supplier = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(supplier_id) as any;
    if (!supplier || (!supplier.google_access_token && !GOOGLE_CLIENT_ID)) return 0;

    const assets = db.prepare("SELECT * FROM assets WHERE supplier_id = ?").all(supplier_id) as any[];
    let totalSynced = 0;

    for (const asset of assets) {
      const synced = await syncAssetCalendar(asset, supplier);
      totalSynced += synced;
    }

    return totalSynced;
  }

  async function syncAssetCalendar(asset: any, supplier: any) {
    const calendarId = asset.google_calendar_id || supplier.google_calendar_id;
    if (!calendarId) return 0;

    let events = [];

    if (!GOOGLE_CLIENT_ID) {
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
      const accessToken = await getValidAccessToken(supplier);
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      
      const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json() as any;
      events = data.items || [];
    }

    const insert = db.prepare("INSERT OR REPLACE INTO asset_availability (id, asset_id, date, status, source) VALUES (?, ?, ?, ?, ?)");
    let count = 0;

    for (const event of events) {
      const start = event.start.date || event.start.dateTime.split('T')[0];
      const end = event.end.date || event.end.dateTime.split('T')[0];
      
      let current = new Date(start);
      const endDate = new Date(end);

      while (current < endDate || (event.start.date && current <= endDate)) {
        const dateStr = current.toISOString().split('T')[0];
        insert.run(crypto.randomUUID(), asset.id, dateStr, 'BLOCKED', 'GOOGLE_CALENDAR');
        count++;
        current.setDate(current.getDate() + 1);
        if (event.start.dateTime && current >= endDate) break;
      }
    }

    return count;
  }

  app.get("/api/calendar/sync/:asset_id", async (req, res) => {
    const { asset_id } = req.params;
    try {
      const asset = db.prepare("SELECT * FROM assets WHERE id = ?").get(asset_id) as any;
      if (!asset) return res.status(404).json({ error: "Asset not found" });
      const supplier = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(asset.supplier_id) as any;
      const synced = await syncAssetCalendar(asset, supplier);
      res.json({ synced });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/calendar/sync-all", async (req, res) => {
    try {
      const suppliers = db.prepare("SELECT id FROM suppliers WHERE status = 'APPROVED'").all() as any[];
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

app.post('/api/ai/chat', async (req, res) => {
  const { message, lang, mode } = req.body;
  const systemPrompt = `You are Maria Fernanda,
  the AI orchestration engine for KLO
  (Karibbean Luxury Operators), an ultra-luxury
  travel brokerage in the Caribbean.
  You help UHNW clients plan extraordinary
  experiences across 5 pillars:
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
   itinerary:[{time,activity,pillar,location,
   status,tte}],
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
