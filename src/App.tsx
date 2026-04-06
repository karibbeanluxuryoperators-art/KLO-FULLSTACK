import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane, Ship, Home, Car, UserCheck, Shield, Sparkles,
  MapPin, Clock, ChevronRight, MessageSquare,
  Send, Loader2, Menu, X, ArrowRight, Star,
  LayoutDashboard, Users, Briefcase, CreditCard,
  TrendingUp, Activity, Package, Timer,
  Zap, DollarSign, CheckCircle2, Sun, Moon, LogIn, LogOut, Lock
} from 'lucide-react';
import { KLOExperience } from './services/kloBrain';
import { PILLARS, LUXURY_IMAGES } from './constants';
import { OperationalCommandCenter } from './components/OperationalCommandCenter';
import { AssetManagement } from './components/AssetManagement';
import { Marketplace } from './components/Marketplace';
import { GeospatialTracker } from './components/GeospatialTracker';
import { ClientManagement } from './components/ClientManagement';
import { AgentialRuleEngine } from './components/AgentialRuleEngine';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { FinancialEngine } from './components/FinancialEngine';
import { CommunicationHub } from './components/CommunicationHub';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { LeadsManagement } from './components/LeadsManagement';
import { SuppliersManagement } from './components/SuppliersManagement';
import { SupplierPortal } from './components/SupplierPortal';
import { ChatDrawer } from './components/ChatDrawer';
import { PartnersPage } from './components/PartnersPage';
import {
  Asset, Booking, AdminStats, Language,
  Incident, GuestProfile, AgentialRule, MaintenanceAlert,
  FinancialDeepDive, ChatMessage
} from './types';

// ─── 20% KLO Markup Engine ───────────────────────────────────────────────────
export function applyKLOMarkup(priceStr: string): string {
  if (!priceStr) return priceStr;
  const match = priceStr.match(/[\d,]+(\.\d+)?/);
  if (!match) return priceStr;
  const base = parseFloat(match[0].replace(/,/g, ''));
  const marked = Math.ceil(base * 1.2);
  const formatted = marked.toLocaleString('en-US');
  return priceStr.replace(match[0], formatted);
}

// ─── Portal Modes ─────────────────────────────────────────────────────────────
type PortalMode = 'CLIENT' | 'ADMIN' | 'PARTNER';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_INCIDENTS: Incident[] = [
  { id: 'I1', bookingId: 'B1', type: 'DELAY', severity: 'HIGH', description: 'Flight JTY-992 Delayed (ETA +15m)', status: 'RESOLVING', timestamp: '2m ago' },
  { id: 'I2', bookingId: 'B1', type: 'WEATHER', severity: 'MEDIUM', description: 'Sea Swell +1.5m at Anguilla', status: 'OPEN', timestamp: '15m ago', resolution: 'Monitoring tender operations.' },
  { id: 'I3', bookingId: 'B1', type: 'SECURITY', severity: 'LOW', description: 'Perimeter Breach (False Alarm)', status: 'RESOLVED', timestamp: '1h ago', resolution: 'Verified as local wildlife.' },
];

const MOCK_GUEST_PROFILES: GuestProfile[] = [
  {
    id: 'UHNWI_001', name: 'John Doe', tier: 'UHNWI',
    preferences: { dietary: ['Gluten-Free', 'Organic Only'], beverages: ['Dom Pérignon 2012'], temperature: '21°C', interests: ['Contemporary Art', 'Deep Sea Fishing'] },
    pastExperiences: 12, totalSpend: '$1.2M', loyaltyPoints: 45000, status: 'ACTIVE'
  },
  {
    id: 'UHNWI_002', name: 'Jane Smith', tier: 'VVIP',
    preferences: { dietary: ['Vegan', 'Nut Allergy'], beverages: ['Green Tea'], temperature: '22°C', interests: ['Yoga', 'Architecture'] },
    pastExperiences: 4, totalSpend: '$450K', loyaltyPoints: 12000, status: 'ACTIVE'
  }
];

const MOCK_RULES: AgentialRule[] = [
  { id: 'R1', trigger: 'DELAY', condition: 'Flight Delay > 20m', action: 'Re-route Vianco ground team', status: 'ACTIVE', lastTriggered: '2m ago' },
  { id: 'R2', trigger: 'SECURITY', condition: 'Perimeter Breach', action: 'Deploy Elite Security Response', status: 'ACTIVE' },
  { id: 'R3', trigger: 'WEATHER', condition: 'Swell > 2m', action: 'Suspend Tender Operations', status: 'PAUSED' },
];

const MOCK_MAINTENANCE: MaintenanceAlert[] = [
  { id: 'M1', assetId: 'A1', type: 'PREDICTIVE', description: 'Engine #2 Turbine Wear (85%)', urgency: 'HIGH', estimatedCost: '$12,500' },
  { id: 'M2', assetId: 'V1', type: 'SCHEDULED', description: 'Hull Cleaning & Inspection', urgency: 'LOW', estimatedCost: '$4,200' },
];

const MOCK_FINANCIALS: FinancialDeepDive = {
  revenue: 1250000, costOfGoods: 850000, partnerPayouts: 250000,
  operationalLeakage: 25000, netMargin: 125000,
  breakdown: [
    { category: 'Aviation', value: 450000 }, { category: 'Maritime', value: 320000 },
    { category: 'Lodging', value: 280000 }, { category: 'Staffing', value: 120000 },
  ]
};

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'MSG1', senderId: 'S1', senderName: 'Capt. Marco', senderRole: 'STAFF', content: 'Yacht Serenity is ready for boarding at Simpson Bay.', timestamp: '10:30', isEncrypted: true },
  { id: 'MSG2', senderId: 'ADMIN', senderName: 'Admin', senderRole: 'ADMIN', content: 'Confirmed. Client is 5 mins away via Vianco.', timestamp: '10:32', isEncrypted: true },
  { id: 'MSG3', senderId: 'UHNWI_001', senderName: 'John Doe', senderRole: 'CLIENT', content: 'Can we add a deep sea fishing session tomorrow?', timestamp: '11:05', isEncrypted: true },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B1', clientId: 'UHNWI_001', title: 'The Caribbean Apex Journey',
    startDate: '2026-03-10', endDate: '2026-03-15', status: 'IN_PROGRESS',
    totalInvestment: '$145,000', assets: ['A1', 'V1', 'L1', 'S1'], tte: '12m',
    securityBrief: {
      id: 'SB1', level: 'ELITE',
      riskAssessment: 'Low risk, high visibility. Focus on privacy and perimeter control.',
      protocols: ['24/7 Armed Escort', 'Secure Comms Channel', 'Pre-vetted Venues'],
      emergencyContacts: [{ name: 'Security Lead', phone: '+1 555 9000', role: 'Commander' }],
      lastUpdated: '2026-03-04'
    },
    itinerary: [
      { time: '09:00', activity: 'Private Jet Arrival', pillar: 'AIR', status: 'COMPLETED', location: 'St. Maarten', tte: '5m' },
      { time: '10:30', activity: 'Yacht Boarding', pillar: 'SEA', status: 'EXECUTING', location: 'Simpson Bay', tte: '15m' },
      { time: '13:00', activity: 'Michelin Lunch on Deck', pillar: 'STAFF', status: 'PENDING', location: 'At Sea', tte: '0m' },
      { time: '18:00', activity: 'Villa Check-in', pillar: 'STAY', status: 'PENDING', location: 'Anguilla', tte: '20m' },
    ]
  }
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authTarget, setAuthTarget] = useState<PortalMode>('ADMIN');

  const [portalMode, setPortalMode] = useState<PortalMode>('CLIENT');
  const [lang, setLang] = useState<Language>('EN');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroNav, setIsHeroNav] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatPreload, setChatPreload] = useState<string | null>(null);
  const [plannedExperience, setPlannedExperience] = useState<KLOExperience | null>(null);
  const [activePillar, setActivePillar] = useState(0);

  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [adminActiveTab, setAdminActiveTab] = useState('OCC');
  const [isMissionControl, setIsMissionControl] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [agentialRules, setAgentialRules] = useState<AgentialRule[]>(MOCK_RULES);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>(MOCK_GUEST_PROFILES);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  // ── Theme ──
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // ── Scroll nav ──
  useEffect(() => {
    const onScroll = () => setIsHeroNav(window.scrollY < 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Route detection & data fetch ──
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/partner') setPortalMode('PARTNER');
    else if (path === '/admin') { setAuthTarget('ADMIN'); setShowAuth(true); }

    fetch('/api/assets')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setAssets(d); })
      .catch(() => {});

    const params = new URLSearchParams(window.location.search);
    if (params.get('booking') === 'success') {
      setBookingSuccess(true);
      setShowMarketplace(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // ── Auth ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setShowAuth(false);
        const role = data.user.role;
        if (role === 'ADMIN') { setPortalMode('ADMIN'); window.history.pushState({}, '', '/admin'); }
        else if (role === 'PROVIDER') { setPortalMode('PARTNER'); window.history.pushState({}, '', '/partner'); }
        else { setPortalMode('CLIENT'); window.history.pushState({}, '', '/'); }
      } else {
        setAuthError(data.message);
      }
    } catch { setAuthError('Connection error. Try again.'); }
  };

  const handleLogout = () => {
    setUser(null);
    setPortalMode('CLIENT');
    window.history.pushState({}, '', '/');
  };

  const requireAuth = (target: PortalMode) => {
    setAuthTarget(target);
    setShowAuth(true);
  };

  // ─── Auth Modal ───────────────────────────────────────────────────────────
  const renderAuthModal = () => (
    <AnimatePresence>
      {showAuth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-luxury-black/80 backdrop-blur-md px-6"
          onClick={() => setShowAuth(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="bg-luxury-slate border border-border-main rounded-2xl p-10 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setShowAuth(false)} className="absolute top-6 right-6 text-text-main/40 hover:text-text-main">
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-5">
                <Lock size={22} className="text-luxury-black" />
              </div>
              <h2 className="text-2xl font-serif italic text-text-main mb-1">
                {authTarget === 'ADMIN'
                  ? (lang === 'EN' ? 'Admin Access' : lang === 'ES' ? 'Acceso Admin' : 'Acesso Admin')
                  : (lang === 'EN' ? 'Partner Access' : lang === 'ES' ? 'Acceso Socio' : 'Acesso Parceiro')}
              </h2>
              <p className="text-text-main/40 text-xs">
                {authTarget === 'ADMIN' ? 'admin@klo.com' : 'partner@klo.com'} · password: 123456
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[10px] font-sans uppercase tracking-widest text-gold/60 mb-1.5 block">
                  {lang === 'EN' ? 'Email' : 'Correo'}
                </label>
                <input
                  type="email" value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full bg-luxury-black/50 border border-border-main rounded-xl py-3.5 px-5 focus:outline-none focus:border-gold/50 transition-colors text-text-main text-sm"
                  placeholder={authTarget === 'ADMIN' ? 'admin@klo.com' : 'partner@klo.com'}
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-sans uppercase tracking-widest text-gold/60 mb-1.5 block">
                  {lang === 'EN' ? 'Password' : 'Contraseña'}
                </label>
                <input
                  type="password" value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  className="w-full bg-luxury-black/50 border border-border-main rounded-xl py-3.5 px-5 focus:outline-none focus:border-gold/50 transition-colors text-text-main text-sm"
                  placeholder="••••••••" required
                />
              </div>
              {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
              <button
                type="submit"
                className="w-full py-4 bg-gold text-luxury-black rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Entrar' : 'Entrar'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ─── Navigation ───────────────────────────────────────────────────────────
  const renderNav = () => (
    <nav
      className="fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md"
      style={{
        background: isHeroNav ? 'rgba(0,0,0,0.2)' : 'var(--bg-luxury-slate)',
        borderBottom: isHeroNav ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--border-border-main)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { setPortalMode('CLIENT'); setShowMarketplace(false); setShowPartners(false); window.history.pushState({}, '', '/'); }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
            <span className="text-luxury-black font-bold text-lg font-serif">K</span>
          </div>
          <span className="font-serif text-xl tracking-wide text-text-main hidden sm:block">
            Karibbean Luxury Operators
          </span>
          <span className="font-serif text-xl tracking-wide text-text-main sm:hidden">KLO</span>
        </button>

        {/* Desktop Nav — PUBLIC ONLY */}
        <div className="hidden md:flex items-center gap-7 text-[10px] uppercase tracking-widest font-light">
          <button
            onClick={() => { setPortalMode('CLIENT'); setShowMarketplace(false); setShowPartners(false); }}
            className={`transition-colors hover:text-gold ${portalMode === 'CLIENT' && !showMarketplace && !showPartners ? 'text-gold' : 'text-text-main/50'}`}
          >
            {lang === 'EN' ? 'Home' : 'Inicio'}
          </button>
          <button
            onClick={() => { setPortalMode('CLIENT'); setShowMarketplace(true); setShowPartners(false); }}
            className={`transition-colors hover:text-gold ${showMarketplace ? 'text-gold' : 'text-text-main/50'}`}
          >
            {lang === 'EN' ? 'Marketplace' : 'Mercado'}
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="text-text-main/50 hover:text-gold transition-colors"
          >
            {lang === 'EN' ? 'Concierge' : 'Conserje'}
          </button>
          <button
            onClick={() => { setPortalMode('CLIENT'); setShowPartners(true); setShowMarketplace(false); }}
            className="px-5 py-2 border border-gold/40 rounded-full text-gold hover:bg-gold hover:text-luxury-black transition-all duration-300"
          >
            {lang === 'EN' ? 'List with KLO' : 'Unirse a KLO'}
          </button>

          <div className="w-px h-4 bg-border-main mx-1" />

          {/* Language */}
          <button
            onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')}
            className="text-text-main/40 hover:text-text-main border border-border-main px-2 py-1 rounded"
          >
            {lang}
          </button>

          {/* Theme */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="text-text-main/40 hover:text-gold transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Auth — user or sign in */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-text-main/30 lowercase tracking-normal">{user.name}</span>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => { setPortalMode('ADMIN'); window.history.pushState({}, '', '/admin'); }}
                  className={`transition-colors hover:text-gold ${portalMode === 'ADMIN' ? 'text-gold' : 'text-text-main/50'}`}
                >
                  Admin
                </button>
              )}
              {(user.role === 'PROVIDER' || user.role === 'ADMIN') && (
                <button
                  onClick={() => { setPortalMode('PARTNER'); window.history.pushState({}, '', '/partner'); }}
                  className={`transition-colors hover:text-gold ${portalMode === 'PARTNER' ? 'text-gold' : 'text-text-main/50'}`}
                >
                  {lang === 'EN' ? 'Partner Portal' : 'Portal Socio'}
                </button>
              )}
              <button onClick={handleLogout} className="text-text-main/40 hover:text-red-400 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => requireAuth('ADMIN')}
              className="text-text-main/40 hover:text-gold transition-colors flex items-center gap-1.5"
            >
              <LogIn size={14} />
              {lang === 'EN' ? 'Sign In' : 'Entrar'}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-text-main" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-luxury-black flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-black font-bold text-xl font-serif">K</span>
                </div>
                <span className="font-serif text-xl text-text-main">KLO</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-text-main">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-8 text-lg uppercase tracking-widest font-light">
              {[
                { label: lang === 'EN' ? 'Home' : 'Inicio', action: () => { setPortalMode('CLIENT'); setShowMarketplace(false); setShowPartners(false); } },
                { label: lang === 'EN' ? 'Marketplace' : 'Mercado', action: () => { setPortalMode('CLIENT'); setShowMarketplace(true); } },
                { label: lang === 'EN' ? 'Concierge' : 'Conserje', action: () => setChatOpen(true) },
                { label: lang === 'EN' ? 'List with KLO' : 'Unirse a KLO', action: () => { setPortalMode('CLIENT'); setShowPartners(true); } },
              ].map(item => (
                <button key={item.label} onClick={() => { item.action(); setIsMenuOpen(false); }}
                  className="text-left text-text-main/70 hover:text-gold transition-colors">
                  {item.label}
                </button>
              ))}

              <div className="h-px w-full bg-border-main" />

              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <button onClick={() => { setPortalMode('ADMIN'); setIsMenuOpen(false); window.history.pushState({}, '', '/admin'); }}
                      className="text-left text-gold">Admin Panel</button>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="text-left text-red-400">
                    {lang === 'EN' ? 'Sign Out' : 'Cerrar Sesión'}
                  </button>
                </>
              ) : (
                <button onClick={() => { requireAuth('ADMIN'); setIsMenuOpen(false); }}
                  className="text-left text-text-main/60 flex items-center gap-2">
                  <LogIn size={18} /> {lang === 'EN' ? 'Sign In' : 'Entrar'}
                </button>
              )}

              <div className="h-px w-full bg-border-main" />

              <div className="flex items-center gap-6">
                <button onClick={() => setLang(l => l === 'EN' ? 'ES' : l === 'ES' ? 'PT' : 'EN')}
                  className="border border-border-main px-4 py-2 rounded-lg text-text-main text-sm">
                  {lang}
                </button>
                <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                  className="text-text-main/60">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // ─── CLIENT PORTAL ────────────────────────────────────────────────────────
  const renderClientPortal = () => {
    if (showPartners) {
      return (
        <PartnersPage
          lang={lang}
          onApply={() => { setShowPartners(false); requireAuth('PARTNER'); }}
          onBack={() => setShowPartners(false)}
        />
      );
    }

    if (showMarketplace) {
      return (
        <Marketplace
          assets={assets.map(a => ({ ...a, pricePerUnit: applyKLOMarkup(a.pricePerUnit) }))}
          lang={lang}
          initialSuccess={bookingSuccess}
          setChatOpen={setChatOpen}
          setChatPreload={setChatPreload}
          onBack={() => setShowMarketplace(false)}
          onBookAssets={(selectedAssets) => {
            setChatOpen(true);
            const names = selectedAssets.map(a => a.name).join(', ');
            const locs = [...new Set(selectedAssets.map(a => a.location))].join(' & ');
            setChatPreload(lang === 'EN'
              ? `I'd like to orchestrate a journey involving: ${names} in ${locs}.`
              : `Me gustaría orquestar un viaje que incluya: ${names} en ${locs}.`);
          }}
        />
      );
    }

    return (
      <>
        {/* ── Hero ── */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <motion.img
              initial={{ scale: 1.08 }} animate={{ scale: 1 }}
              transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
              src={LUXURY_IMAGES[activePillar % LUXURY_IMAGES.length]}
              className="w-full h-full object-cover opacity-45"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-transparent to-luxury-black" />
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <span className="text-gold font-sans uppercase tracking-widest text-[10px] font-semibold mb-5 block">
                {lang === 'EN' ? 'Caribbean Ultra-Luxury · AI-Orchestrated' : 'Ultra-Lujo del Caribe · Orquestado por IA'}
              </span>
              <h1 className="text-5xl md:text-8xl font-serif italic mb-8 leading-tight tracking-wide text-text-main">
                {lang === 'EN' ? <>One conversation.<br /><span className="whitespace-nowrap">Jet to Yacht to Villa.</span></> : <>Una conversación.<br /><span className="whitespace-nowrap">Del jet al yate a la villa.</span></>}
              </h1>
              <p className="text-text-main/55 text-lg md:text-xl font-sans font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                {lang === 'EN'
                  ? "Cartagena's most exclusive travel experience. Private aviation, superyachts, and ultra-luxury villas — curated for those who accept nothing less."
                  : "La experiencia de viaje más exclusiva de Cartagena. Aviación privada, superyates y villas de ultra-lujo — para quienes no aceptan nada menos."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button
                  onClick={() => setChatOpen(true)}
                  className="group px-10 py-4 bg-gold text-luxury-black rounded-xl font-semibold text-xs tracking-widest uppercase flex items-center gap-3 hover:bg-white transition-all duration-300 shadow-lg shadow-gold/20"
                >
                  {lang === 'EN' ? 'Curate My Journey' : 'Organizar mi Viaje'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setShowMarketplace(true)}
                  className="px-10 py-4 border border-border-main rounded-xl font-medium text-xs tracking-widest uppercase hover:bg-text-main/5 transition-all text-text-main"
                >
                  {lang === 'EN' ? 'Explore Marketplace' : 'Explorar Mercado'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Pillar dots */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
            {PILLARS.map((_, idx) => (
              <button key={idx} onClick={() => setActivePillar(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${activePillar === idx ? 'bg-gold w-10' : 'bg-text-main/20 w-5'}`} />
            ))}
          </div>
        </section>

        {/* ── 5 Pillars ── */}
        <section className="py-24 px-6 bg-luxury-black">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <span className="text-gold text-[10px] uppercase tracking-widest font-semibold block mb-3">
                {lang === 'EN' ? 'Five Pillars of Excellence' : 'Cinco Pilares de Excelencia'}
              </span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-text-main">
                {lang === 'EN' ? 'Everything. Orchestrated.' : 'Todo. Orquestado.'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: Plane, label: lang === 'EN' ? 'Private Aviation' : 'Aviación Privada', sub: lang === 'EN' ? 'Jets & Helicopters' : 'Jets y Helicópteros' },
                { icon: Ship, label: lang === 'EN' ? 'Superyachts' : 'Superyates', sub: lang === 'EN' ? 'Yachts & Catamarans' : 'Yates y Catamaranes' },
                { icon: Home, label: lang === 'EN' ? 'Ultra Villas' : 'Ultra Villas', sub: lang === 'EN' ? 'Private Residences' : 'Residencias Privadas' },
                { icon: Car, label: lang === 'EN' ? 'Ground Transport' : 'Transporte Terrestre', sub: 'Vianco Armor VIP' },
                { icon: UserCheck, label: lang === 'EN' ? 'Elite Staffing' : 'Personal de Élite', sub: lang === 'EN' ? 'Chefs · Security · Staff' : 'Chefs · Seguridad · Staff' },
              ].map((pillar, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  className="bg-luxury-slate border border-border-main rounded-xl p-6 text-center hover:border-gold/30 transition-all group cursor-pointer"
                  onClick={() => setShowMarketplace(true)}
                >
                  <pillar.icon size={28} className="mx-auto mb-3 text-gold/50 group-hover:text-gold transition-colors" />
                  <p className="text-text-main font-sans font-medium text-sm">{pillar.label}</p>
                  <p className="text-text-main/30 text-[10px] mt-1">{pillar.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Value Props ── */}
        <section className="py-24 px-6 bg-luxury-black relative overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gold/4 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gold/4 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: lang === 'EN' ? 'Absolute discretion' : 'Discreción absoluta',
                  desc: lang === 'EN'
                    ? 'Every asset physically verified by our security team. Ex-military intelligence protocols. Your privacy is non-negotiable.'
                    : 'Cada activo verificado físicamente por nuestro equipo. Protocolos de inteligencia ex-militar. Su privacidad no es negociable.'
                },
                {
                  icon: Zap,
                  title: lang === 'EN' ? 'Your journey, orchestrated' : 'Su viaje, orquestado',
                  desc: lang === 'EN'
                    ? 'Tell Maria what you have in mind. She assembles your complete itinerary — jet, yacht, villa, staff — in under a minute.'
                    : 'Dígale a Maria lo que tiene en mente. Ella organiza su itinerario completo — jet, yate, villa, personal — en menos de un minuto.'
                },
                {
                  icon: Users,
                  title: lang === 'EN' ? 'White-glove from first contact' : 'Guante blanco desde el primer contacto',
                  desc: lang === 'EN'
                    ? 'From your first message to your final transfer, a dedicated KLO concierge manages every detail. No call centres. No waiting.'
                    : 'Desde su primer mensaje hasta su traslado final, un conserje dedicado gestiona cada detalle. Sin centros de llamadas. Sin esperas.'
                }
              ].map((f, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 * idx }}
                  className="bg-luxury-slate border border-border-main rounded-xl p-10 hover:border-gold/20 transition-all"
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-8">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-xl font-sans font-medium text-text-main mb-3">{f.title}</h3>
                  <p className="text-text-main/45 font-sans font-light leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Planned Experience ── */}
        <AnimatePresence>
          {plannedExperience && (
            <motion.section
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
              className="py-24 px-6 max-w-7xl mx-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <span className="text-gold text-[10px] uppercase tracking-widest block mb-2">
                    {lang === 'EN' ? 'Your KLO Journey' : 'Su Viaje KLO'} · All-Inclusive
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif italic text-text-main">{plannedExperience.title}</h2>
                </div>
                <div className="text-right">
                  <span className="text-text-main/40 text-xs block mb-1">
                    {lang === 'EN' ? 'Total Investment (KLO fee included)' : 'Inversión Total (tarifa KLO incluida)'}
                  </span>
                  <span className="text-3xl font-sans font-light text-gold">{plannedExperience.estimatedTotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(plannedExperience.pillars).map(([key, value]) => {
                    const p = PILLARS.find(p => p.id === key.toUpperCase());
                    if (!value) return null;
                    return (
                      <motion.div key={key} whileHover={{ y: -4 }}
                        className="bg-luxury-slate border border-border-main rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          {p && <p.icon size={80} />}
                        </div>
                        <div className="flex items-center gap-4 mb-5">
                          <div className={`p-3 rounded-lg bg-text-main/5 ${p?.color}`}>
                            {p && <p.icon size={22} />}
                          </div>
                          <h3 className="text-base font-sans font-semibold uppercase tracking-wider text-text-main">{key}</h3>
                        </div>
                        <p className="text-text-main/60 font-sans font-light leading-relaxed text-sm">{value}</p>
                      </motion.div>
                    );
                  })}

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-luxury-slate border border-gold/20 rounded-xl p-8">
                      <h3 className="text-base font-sans font-semibold text-text-main mb-4 flex items-center gap-3">
                        <Shield size={18} className="text-gold" /> {lang === 'EN' ? 'Security Brief' : 'Resumen de Seguridad'}
                      </h3>
                      <span className="text-[10px] font-semibold text-gold uppercase tracking-widest">{plannedExperience.securityBrief.level}</span>
                      <p className="text-text-main/50 text-xs mt-2 italic leading-relaxed">"{plannedExperience.securityBrief.riskAssessment}"</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {plannedExperience.securityBrief.protocols.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-text-main/5 border border-border-main rounded-md text-[10px] text-text-main/60 uppercase tracking-wider">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-luxury-slate border border-border-main rounded-xl p-8">
                      <h3 className="text-base font-sans font-semibold text-text-main mb-4 flex items-center gap-3">
                        <UserCheck size={18} className="text-gold" /> {lang === 'EN' ? 'Compliance' : 'Cumplimiento'}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {plannedExperience.legalRequirements.map((r, i) => (
                          <span key={i} className="px-4 py-2 bg-text-main/5 border border-border-main rounded-xl text-xs text-text-main/60">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline + Payment */}
                <div className="bg-luxury-slate border border-border-main rounded-xl p-8">
                  <h3 className="text-base font-sans font-semibold text-text-main mb-8 flex items-center gap-3">
                    <Clock size={18} className="text-gold" /> {lang === 'EN' ? 'Itinerary' : 'Itinerario'}
                  </h3>
                  <div className="space-y-7 relative before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-px before:bg-border-main">
                    {plannedExperience.itinerary.map((item, idx) => (
                      <div key={idx} className="relative pl-9">
                        <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full bg-luxury-black border-2 border-gold flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] text-gold font-semibold uppercase tracking-wider">{item.time}</span>
                          <span className="text-[9px] text-emerald-400">TTE: {item.tte}</span>
                        </div>
                        <p className="text-sm font-sans text-text-main/80">{item.activity}</p>
                        <p className="text-[10px] text-text-main/30 uppercase tracking-wider mt-0.5">{item.pillar} · {item.location}</p>
                      </div>
                    ))}
                  </div>

                  {paymentConfirmed ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="w-full mt-10 py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center gap-3 text-center">
                      <CheckCircle2 className="text-emerald-500" size={30} />
                      <p className="text-emerald-500 font-sans font-medium text-sm px-4">
                        {lang === 'EN' ? 'Payment confirmed — your KLO concierge will contact you within 2 hours.' : 'Pago confirmado — su conserje KLO lo contactará en 2 horas.'}
                      </p>
                    </motion.div>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsProcessingPayment(true);
                        try {
                          await fetch('/api/payments/create-intent', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount: plannedExperience.estimatedTotal, customerId: 'UHNWI_001' })
                          });
                          setTimeout(() => { setIsProcessingPayment(false); setPaymentConfirmed(true); }, 2000);
                        } catch { setIsProcessingPayment(false); }
                      }}
                      disabled={isProcessingPayment}
                      className="w-full mt-10 py-4 bg-white text-luxury-black rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-gold transition-colors flex items-center justify-center gap-3"
                    >
                      {isProcessingPayment ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                      {lang === 'EN' ? 'Confirm Payment' : 'Confirmar Pago'}
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Partner CTA ── */}
        <section className="py-16 px-6 border-t border-border-main">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-main/40 mb-1">
                {lang === 'EN' ? 'For villa, yacht & aviation partners' : 'Para socios de villas, yates y aviación'}
              </p>
              <p className="text-2xl font-serif italic text-text-main">
                {lang === 'EN' ? 'List your asset with KLO' : 'Liste su activo con KLO'}
              </p>
            </div>
            <button onClick={() => setShowPartners(true)}
              className="px-10 py-4 border border-text-main/20 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-text-main hover:text-luxury-black transition-all duration-300 whitespace-nowrap text-text-main">
              {lang === 'EN' ? 'Become a Partner' : 'Ser Socio'}
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-20 px-6 border-t border-border-main">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-black font-bold font-serif">K</span>
                </div>
                <span className="font-serif text-lg text-text-main">Karibbean Luxury Operators</span>
              </div>
              <p className="text-text-main/40 font-light max-w-sm leading-relaxed text-sm">
                {lang === 'EN' ? 'Ultra-luxury travel, curated in Cartagena. Expanding across Colombia and the Caribbean.' : 'Viajes de ultra-lujo, diseñados en Cartagena. En expansión por Colombia y el Caribe.'}
              </p>
            </div>
            <div>
              <h4 className="font-serif text-base mb-5 text-text-main">{lang === 'EN' ? 'Experiences' : 'Experiencias'}</h4>
              <ul className="space-y-3 text-sm text-text-main/40">
                {['Private Aviation', 'Superyachts', 'Ultra Villas', 'Ground Transport', 'Elite Staffing'].map(s => (
                  <li key={s}><button onClick={() => setShowMarketplace(true)} className="hover:text-gold transition-colors">{s}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-base mb-5 text-text-main">Legal</h4>
              <ul className="space-y-3 text-sm text-text-main/40">
                {['Privacy Policy', 'Terms of Service', 'GDPR Compliance'].map(s => (
                  <li key={s}><a href="#" className="hover:text-gold transition-colors">{s}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border-main">
            <span className="text-[10px] text-text-main/20 uppercase tracking-widest">
              © 2026 Karibbean Luxury Operators. {lang === 'EN' ? 'All rights reserved.' : 'Todos los derechos reservados.'}
            </span>
          </div>
        </footer>
      </>
    );
  };

  // ─── ADMIN PORTAL ─────────────────────────────────────────────────────────
  const renderAdminPortal = () => {
    if (!user || user.role !== 'ADMIN') {
      return (
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <Lock size={48} className="text-gold/40 mx-auto mb-6" />
            <h2 className="text-2xl font-serif italic text-text-main mb-3">
              {lang === 'EN' ? 'Admin Access Required' : 'Acceso Admin Requerido'}
            </h2>
            <p className="text-text-main/40 mb-8 text-sm">
              {lang === 'EN' ? 'Sign in with your admin credentials to continue.' : 'Inicie sesión con sus credenciales de administrador para continuar.'}
            </p>
            <button onClick={() => requireAuth('ADMIN')}
              className="px-8 py-4 bg-gold text-luxury-black rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-white transition-all">
              {lang === 'EN' ? 'Sign In' : 'Iniciar Sesión'}
            </button>
          </div>
        </div>
      );
    }

    const tabs = [
      { id: 'OCC', icon: Activity, label: lang === 'EN' ? 'Command Center' : 'Centro Comando' },
      { id: 'Map', icon: MapPin, label: 'Geospatial' },
      { id: 'Rules', icon: Zap, label: lang === 'EN' ? 'Agential Logic' : 'Lógica Agéntica' },
      { id: 'Analytics', icon: TrendingUp, label: lang === 'EN' ? 'Predictive' : 'Predictivo' },
      { id: 'Finance', icon: DollarSign, label: lang === 'EN' ? 'Unit Economics' : 'Economía' },
      { id: 'Comms', icon: MessageSquare, label: lang === 'EN' ? 'Secure Hub' : 'Hub Seguro' },
      { id: 'Assets', icon: Package, label: lang === 'EN' ? 'Assets' : 'Activos' },
      { id: 'Clients', icon: Briefcase, label: lang === 'EN' ? 'Clients' : 'Clientes' },
      { id: 'Leads', icon: Users, label: 'Leads' },
      { id: 'Partners', icon: UserCheck, label: lang === 'EN' ? 'Partners' : 'Socios' },
    ];

    return (
      <div className="pt-20 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border-main bg-luxury-slate/30 hidden lg:block shrink-0">
          <div className="p-6 pt-8">
            <p className="text-[9px] uppercase tracking-widest text-gold/50 mb-6 px-3">KLO Operations</p>
            <div className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setAdminActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${adminActiveTab === tab.id
                    ? 'bg-luxury-slate border-l-2 border-gold text-text-main'
                    : 'text-text-main/40 hover:text-text-main/70 hover:bg-luxury-slate/30 border-l-2 border-transparent'}`}
                >
                  <tab.icon size={16} />
                  <span className="text-[11px] tracking-wide">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-border-main">
              <button onClick={() => setIsMissionControl(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/5 text-red-400/60 border border-red-500/10 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <Zap size={16} />
                <span className="text-[11px]">{lang === 'EN' ? 'Mission Control' : 'Control de Misión'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-luxury-black">
          <div className="space-y-8">
            <div className="border-b border-border-main pb-5">
              <p className="text-[9px] uppercase tracking-widest text-gold/50 mb-1">KLO Admin</p>
              <h1 className="text-3xl font-serif italic text-text-main">{tabs.find(t => t.id === adminActiveTab)?.label}</h1>
            </div>
            {adminActiveTab === 'OCC' && <OperationalCommandCenter bookings={MOCK_BOOKINGS} incidents={MOCK_INCIDENTS} lang={lang} />}
            {adminActiveTab === 'Map' && <GeospatialTracker assets={assets} lang={lang} />}
            {adminActiveTab === 'Rules' && <AgentialRuleEngine rules={agentialRules} lang={lang} onUpdateRules={setAgentialRules} />}
            {adminActiveTab === 'Analytics' && <PredictiveAnalytics alerts={MOCK_MAINTENANCE} lang={lang} />}
            {adminActiveTab === 'Finance' && <FinancialEngine financials={MOCK_FINANCIALS} lang={lang} />}
            {adminActiveTab === 'Comms' && <CommunicationHub messages={MOCK_MESSAGES} lang={lang} />}
            {adminActiveTab === 'Assets' && (
              <AssetManagement assets={assets} lang={lang}
                onSaveAsset={updated => setAssets(prev => {
                  const exists = prev.find(a => a.id === updated.id);
                  return exists ? prev.map(a => a.id === updated.id ? updated : a) : [updated, ...prev];
                })} />
            )}
            {adminActiveTab === 'Clients' && (
              <ClientManagement clients={guestProfiles} lang={lang}
                onAddClient={c => setGuestProfiles(prev => [c, ...prev])} />
            )}
            {adminActiveTab === 'Leads' && <LeadsManagement lang={lang} />}
            {adminActiveTab === 'Partners' && (
              <SuppliersManagement lang={lang} onViewAssets={() => setAdminActiveTab('Assets')} />
            )}
          </div>
        </div>

        {/* Mission Control Overlay */}
        <AnimatePresence>
          {isMissionControl && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-luxury-black p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-gold/10 text-gold rounded-2xl border border-gold/20">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-serif italic text-text-main">Mission Control</h2>
                    <p className="text-gold/50 text-[10px] uppercase tracking-widest">High-Density Orchestration Active</p>
                  </div>
                </div>
                <button onClick={() => setIsMissionControl(false)}
                  className="px-8 py-4 bg-gold text-luxury-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                  <X size={16} /> Exit
                </button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  <GeospatialTracker assets={assets} lang={lang} />
                  <OperationalCommandCenter bookings={MOCK_BOOKINGS} incidents={MOCK_INCIDENTS} lang={lang} />
                </div>
                <div className="space-y-8">
                  <AgentialRuleEngine rules={agentialRules} lang={lang} onUpdateRules={setAgentialRules} />
                  <PredictiveAnalytics alerts={MOCK_MAINTENANCE} lang={lang} />
                  <FinancialEngine financials={MOCK_FINANCIALS} lang={lang} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // ─── PARTNER PORTAL ───────────────────────────────────────────────────────
  const renderPartnerPortal = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <Lock size={48} className="text-gold/40 mx-auto mb-6" />
            <h2 className="text-2xl font-serif italic text-text-main mb-3">
              {lang === 'EN' ? 'Partner Access Required' : 'Acceso de Socio Requerido'}
            </h2>
            <p className="text-text-main/40 mb-8 text-sm">
              {lang === 'EN' ? 'Sign in to access your partner dashboard.' : 'Inicie sesión para acceder a su panel de socio.'}
            </p>
            <button onClick={() => requireAuth('PARTNER')}
              className="px-8 py-4 bg-gold text-luxury-black rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-white transition-all">
              {lang === 'EN' ? 'Sign In as Partner' : 'Entrar como Socio'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <SupplierPortal
        onBack={() => { setPortalMode('CLIENT'); window.history.pushState({}, '', '/'); }}
        lang={lang}
      />
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-luxury-black text-text-main selection:bg-gold/30">
      {renderNav()}
      {renderAuthModal()}

      <main>
        {portalMode === 'CLIENT' && renderClientPortal()}
        {portalMode === 'ADMIN' && renderAdminPortal()}
        {portalMode === 'PARTNER' && renderPartnerPortal()}
      </main>

      {/* Lead Capture + Chat */}
      <LeadCaptureForm lang={lang} />
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => { setChatOpen(false); setChatPreload(null); }}
        initialMessage={chatPreload}
        lang={lang}
        onPlanGenerated={setPlannedExperience}
      />

      {/* Speed Dial FAB */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isSpeedDialOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => { window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`, '_blank'); setIsSpeedDialOpen(false); }}
              >
                <span className="px-3 py-1.5 bg-luxury-black text-white text-[10px] font-semibold rounded-full shadow-xl uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => { setChatOpen(true); setIsSpeedDialOpen(false); }}
              >
                <span className="px-3 py-1.5 bg-luxury-black text-white text-[10px] font-semibold rounded-full shadow-xl uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">AI Concierge</span>
                <div className="w-12 h-12 bg-gold text-luxury-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.08 }}
          onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
          className="w-16 h-16 bg-gold text-luxury-black rounded-full shadow-2xl shadow-gold/30 flex items-center justify-center relative"
        >
          <motion.div animate={{ rotate: isSpeedDialOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <MessageSquare size={22} />
          </motion.div>
          {!isSpeedDialOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-luxury-black animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
