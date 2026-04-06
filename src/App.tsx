import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane, Ship, Home, Car, UserCheck, Shield, Sparkles,
  MapPin, Clock, ArrowRight, MessageSquare,
  Loader2, Menu, X, Star, Lock,
  Users, Briefcase, CreditCard,
  TrendingUp, Activity, Package,
  Zap, DollarSign, CheckCircle2, Sun, Moon,
  LogOut, ChevronDown
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
  Asset, Booking, Language,
  Incident, GuestProfile, AgentialRule, MaintenanceAlert,
  FinancialDeepDive, ChatMessage
} from './types';
import { signInWithGoogle, signOutUser, onKLOAuthChange, KLOUser } from './firebase';

// ── 20% Markup — only applied AFTER login ────────────────────────────────────
export function applyKLOMarkup(priceStr: string): string {
  if (!priceStr) return priceStr;
  const match = priceStr.match(/[\d,]+(\.\d+)?/);
  if (!match) return priceStr;
  const base = parseFloat(match[0].replace(/,/g, ''));
  const marked = Math.ceil(base * 1.2);
  return priceStr.replace(match[0], marked.toLocaleString('en-US'));
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_INCIDENTS: Incident[] = [
  { id: 'I1', bookingId: 'B1', type: 'DELAY', severity: 'HIGH', description: 'Flight JTY-992 Delayed (ETA +15m)', status: 'RESOLVING', timestamp: '2m ago' },
  { id: 'I2', bookingId: 'B1', type: 'WEATHER', severity: 'MEDIUM', description: 'Sea Swell +1.5m at Anguilla', status: 'OPEN', timestamp: '15m ago' },
  { id: 'I3', bookingId: 'B1', type: 'SECURITY', severity: 'LOW', description: 'Perimeter Breach (False Alarm)', status: 'RESOLVED', timestamp: '1h ago' },
];
const MOCK_GUEST_PROFILES: GuestProfile[] = [
  { id: 'G1', name: 'John Doe', tier: 'UHNWI', preferences: { dietary: ['Gluten-Free'], beverages: ['Dom Pérignon 2012'], temperature: '21°C', interests: ['Art', 'Fishing'] }, pastExperiences: 12, totalSpend: '$1.2M', loyaltyPoints: 45000, status: 'ACTIVE' },
  { id: 'G2', name: 'Jane Smith', tier: 'VVIP', preferences: { dietary: ['Vegan'], beverages: ['Green Tea'], temperature: '22°C', interests: ['Yoga', 'Architecture'] }, pastExperiences: 4, totalSpend: '$450K', loyaltyPoints: 12000, status: 'ACTIVE' },
];
const MOCK_RULES: AgentialRule[] = [
  { id: 'R1', trigger: 'DELAY', condition: 'Flight Delay > 20m', action: 'Re-route secure ground team', status: 'ACTIVE', lastTriggered: '2m ago' },
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
  { id: 'MSG1', senderId: 'S1', senderName: 'Capt. Marco', senderRole: 'STAFF', content: 'Yacht Serenity is ready for boarding.', timestamp: '10:30', isEncrypted: true },
  { id: 'MSG2', senderId: 'ADMIN', senderName: 'Admin', senderRole: 'ADMIN', content: 'Confirmed. Client is 5 mins away.', timestamp: '10:32', isEncrypted: true },
];
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B1', clientId: 'G1', title: 'The Caribbean Apex Journey',
    startDate: '2026-03-10', endDate: '2026-03-15', status: 'IN_PROGRESS',
    totalInvestment: '$145,000', assets: ['A1', 'V1', 'L1', 'S1'], tte: '12m',
    securityBrief: { id: 'SB1', level: 'ELITE', riskAssessment: 'Low risk, high visibility.', protocols: ['24/7 Armed Escort', 'Secure Comms Channel'], emergencyContacts: [], lastUpdated: '2026-03-04' },
    itinerary: [
      { time: '09:00', activity: 'Private Jet Arrival', pillar: 'AIR', status: 'COMPLETED', location: 'St. Maarten', tte: '5m' },
      { time: '10:30', activity: 'Yacht Boarding', pillar: 'SEA', status: 'EXECUTING', location: 'Simpson Bay', tte: '15m' },
      { time: '18:00', activity: 'Villa Check-in', pillar: 'STAY', status: 'PENDING', location: 'Anguilla', tte: '20m' },
    ]
  }
];

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState<KLOUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [lang, setLang] = useState<Language>('EN');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroNav, setIsHeroNav] = useState(true);

  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatPreload, setChatPreload] = useState<string | null>(null);
  const [plannedExperience, setPlannedExperience] = useState<KLOExperience | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [adminActiveTab, setAdminActiveTab] = useState('OCC');
  const [isMissionControl, setIsMissionControl] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [agentialRules, setAgentialRules] = useState<AgentialRule[]>(MOCK_RULES);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>(MOCK_GUEST_PROFILES);

  // ── Firebase listener ──
  useEffect(() => {
    const unsub = onKLOAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, []);

  // ── Theme ──
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // ── Scroll nav ──
  useEffect(() => {
    const fn = () => setIsHeroNav(window.scrollY < 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Data ──
  useEffect(() => {
    fetch('/api/assets').then(r => r.json())
      .then(d => { if (Array.isArray(d) && d.length > 0) setAssets(d); })
      .catch(() => {});
    const p = new URLSearchParams(window.location.search);
    if (p.get('booking') === 'success') {
      setBookingSuccess(true); setShowMarketplace(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // ── Pillar cycling ──
  useEffect(() => {
    const t = setInterval(() => setActivePillar(p => (p + 1) % LUXURY_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // ── Auth ──
  const handleSignIn = async () => {
    setSigningIn(true); setAuthError('');
    try { const u = await signInWithGoogle(); setUser(u); }
    catch { setAuthError('Sign-in failed. Please try again.'); }
    finally { setSigningIn(false); }
  };

  const handleSignOut = async () => {
    await signOutUser(); setUser(null);
    setShowMarketplace(false); setShowPartners(false);
  };

  // ── Google button SVG ──
  const GoogleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  // ─── NAV ──────────────────────────────────────────────────────────────────
  const renderNav = () => (
    <nav className="fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md"
      style={{
        background: isHeroNav ? 'rgba(5,5,5,0.20)' : 'rgba(8,8,8,0.97)',
        borderBottom: isHeroNav ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)',
      }}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => { setShowMarketplace(false); setShowPartners(false); }}
          className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-luxury-black font-serif font-bold text-lg">K</span>
          </div>
          <span className="font-serif text-xl tracking-wide text-text-main hidden sm:block">Karibbean Luxury Operators</span>
          <span className="font-serif text-xl text-text-main sm:hidden">KLO</span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => { setShowMarketplace(false); setShowPartners(false); }}
            className="text-[10px] uppercase tracking-widest text-text-main/60 hover:text-gold transition-colors">
            {lang === 'EN' ? 'Home' : 'Inicio'}
          </button>

          {user && (
            <button onClick={() => { setShowMarketplace(true); setShowPartners(false); }}
              className={`text-[10px] uppercase tracking-widest transition-colors ${showMarketplace ? 'text-gold' : 'text-text-main/60 hover:text-gold'}`}>
              {lang === 'EN' ? 'Marketplace' : 'Mercado'}
            </button>
          )}

          <button onClick={() => setChatOpen(true)}
            className="text-[10px] uppercase tracking-widest text-text-main/60 hover:text-gold transition-colors">
            {lang === 'EN' ? 'Concierge' : 'Conserje'}
          </button>

          {!user && (
            <button onClick={() => setShowPartners(true)}
              className="px-5 py-2 border border-gold/40 rounded-full text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-luxury-black transition-all duration-300">
              {lang === 'EN' ? 'List with KLO' : 'Unirse a KLO'}
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button onClick={() => { setShowMarketplace(false); window.history.pushState({}, '', '/admin'); window.location.reload(); }}
              className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-luxury-black transition-all">
              Admin
            </button>
          )}
          {(user?.role === 'PARTNER' || user?.role === 'ADMIN') && (
            <button onClick={() => { window.history.pushState({}, '', '/partner'); window.location.reload(); }}
              className="px-4 py-2 border border-border-main rounded-full text-[10px] uppercase tracking-widest text-text-main/60 hover:text-gold hover:border-gold/40 transition-all">
              {lang === 'EN' ? 'Partner Portal' : 'Portal Socio'}
            </button>
          )}

          <div className="w-px h-4 bg-border-main" />

          <button onClick={() => setLang(l => l === 'EN' ? 'ES' : 'EN')}
            className="text-[9px] uppercase tracking-widest text-text-main/40 hover:text-text-main border border-border-main px-2 py-1 rounded">
            {lang}
          </button>

          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="text-text-main/40 hover:text-gold transition-colors">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {authLoading ? (
            <Loader2 size={15} className="animate-spin text-gold/40" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.photo && <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full border border-gold/30 object-cover" />}
              <span className="text-[10px] text-text-main/50 max-w-[90px] truncate">{user.name}</span>
              <button onClick={handleSignOut} className="text-text-main/30 hover:text-red-400 transition-colors" title="Sign out">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} disabled={signingIn}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-luxury-black rounded-full text-[10px] uppercase tracking-widest font-semibold hover:bg-gold transition-all duration-300 disabled:opacity-50">
              {signingIn ? <Loader2 size={13} className="animate-spin" /> : <GoogleIcon />}
              {lang === 'EN' ? 'Sign in' : 'Entrar'}
            </button>
          )}
        </div>

        <button className="md:hidden text-text-main" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[60] bg-luxury-black flex flex-col p-8 pt-6">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-luxury-black font-serif font-bold text-lg">K</span>
                </div>
                <span className="font-serif text-xl text-text-main">KLO</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)}><X size={24} className="text-text-main" /></button>
            </div>
            <div className="flex flex-col gap-7 text-base uppercase tracking-widest font-light">
              {[
                { label: lang === 'EN' ? 'Home' : 'Inicio', action: () => { setShowMarketplace(false); setShowPartners(false); } },
                ...(user ? [{ label: lang === 'EN' ? 'Marketplace' : 'Mercado', action: () => setShowMarketplace(true) }] : []),
                { label: lang === 'EN' ? 'Concierge' : 'Conserje', action: () => setChatOpen(true) },
                { label: lang === 'EN' ? 'List with KLO' : 'Unirse a KLO', action: () => setShowPartners(true) },
              ].map(item => (
                <button key={item.label} onClick={() => { item.action(); setIsMenuOpen(false); }}
                  className="text-left text-text-main/70 hover:text-gold transition-colors">{item.label}</button>
              ))}
              <div className="h-px bg-border-main" />
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {user.photo && <img src={user.photo} className="w-9 h-9 rounded-full border border-gold/30" />}
                    <div>
                      <p className="text-text-main text-sm font-medium">{user.name}</p>
                      <p className="text-gold text-[10px] uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="text-left text-red-400 text-sm flex items-center gap-2">
                    <LogOut size={15} /> {lang === 'EN' ? 'Sign Out' : 'Cerrar Sesión'}
                  </button>
                </div>
              ) : (
                <button onClick={() => { handleSignIn(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-text-main/70 hover:text-gold">
                  <GoogleIcon /> {lang === 'EN' ? 'Sign in with Google' : 'Entrar con Google'}
                </button>
              )}
              <div className="flex gap-4 items-center">
                <button onClick={() => setLang(l => l === 'EN' ? 'ES' : 'EN')}
                  className="border border-border-main px-4 py-2 rounded text-text-main text-xs">{lang}</button>
                <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-text-main/50">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // ─── VIP TEASER (not logged in) ───────────────────────────────────────────
  const renderVIPTeaser = () => (
    <>
      {/* Cinematic Hero */}
      <section className="relative h-screen flex items-end justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={activePillar}
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0">
            <img src={LUXURY_IMAGES[activePillar]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-luxury-black/15" />
          </motion.div>
        </AnimatePresence>

        {/* Pillar tabs — right side */}
        <div className="absolute top-28 right-8 flex flex-col gap-3 z-10">
          {PILLARS.map((p, i) => (
            <button key={p.id} onClick={() => setActivePillar(i)}
              className={`flex items-center gap-2 transition-all duration-500 ${activePillar === i ? 'opacity-100' : 'opacity-25 hover:opacity-55'}`}>
              <span className={`text-[9px] uppercase tracking-widest font-semibold hidden lg:block text-text-main transition-all ${activePillar === i ? 'translate-x-0' : 'translate-x-2'}`}>
                {p.name}
              </span>
              <div className={`h-px transition-all duration-500 ${activePillar === i ? 'w-8 bg-gold' : 'w-4 bg-text-main/30'}`} />
            </button>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <span className="section-label block mb-5">
              {lang === 'EN' ? 'Caribbean Ultra-Luxury · By Invitation Only' : 'Ultra-Lujo del Caribe · Solo por Invitación'}
            </span>
            <h1 className="hero-title mb-7 max-w-3xl">
              {lang === 'EN'
                ? <><span>Some experiences</span><br /><span>cannot be discovered.</span><br /><span className="text-gold">They find you.</span></>
                : <><span>Algunas experiencias</span><br /><span>no se descubren.</span><br /><span className="text-gold">Ellas te encuentran.</span></>
              }
            </h1>
            <p className="hero-subtitle mb-10">
              {lang === 'EN'
                ? "KLO is the Caribbean's most discreet ultra-luxury platform. Private aviation, superyachts, off-market estates, and elite staffing — curated for those who require the absolute best."
                : 'KLO es la plataforma de ultra-lujo más discreta del Caribe. Aviación privada, superyates, propiedades exclusivas y personal de élite — para quienes exigen lo absoluto.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleSignIn} disabled={signingIn}
                className="group flex items-center gap-3 px-8 py-4 bg-gold text-luxury-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-xl shadow-gold/20 disabled:opacity-60">
                {signingIn ? <Loader2 size={15} className="animate-spin" /> : <GoogleIcon />}
                {lang === 'EN' ? 'Request Access' : 'Solicitar Acceso'}
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setChatOpen(true)}
                className="flex items-center gap-3 px-8 py-4 border border-text-main/20 rounded-lg text-xs uppercase tracking-widest text-text-main/70 hover:border-gold/40 hover:text-gold transition-all">
                <MessageSquare size={13} />
                {lang === 'EN' ? 'Speak to a Concierge' : 'Hablar con un Conserje'}
              </button>
            </div>
            {authError && <p className="text-red-400 text-xs mt-4">{authError}</p>}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={20} className="text-text-main/30" />
        </motion.div>
      </section>

      {/* Five Pillars — no prices */}
      <section className="py-28 px-6 bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <span className="section-label block mb-4">{lang === 'EN' ? 'Five Pillars of Excellence' : 'Cinco Pilares de Excelencia'}</span>
            <h2 className="section-title mb-4">{lang === 'EN' ? 'Everything orchestrated.' : 'Todo orquestado.'}</h2>
            <div className="gold-line" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div key={pillar.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: idx * 0.08 }}
                  className="portal-card p-8 group cursor-pointer" onClick={handleSignIn}>
                  <Icon size={26} className={`mb-5 ${pillar.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-text-main font-semibold text-base mb-2">{pillar.name}</h3>
                  <p className="body-text text-xs leading-relaxed">{pillar.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-gold/40 group-hover:text-gold transition-colors">
                    <Lock size={10} />
                    <span className="text-[9px] uppercase tracking-widest">{lang === 'EN' ? 'Members only' : 'Solo miembros'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mystique cards */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/4 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/3 blur-[140px] rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: lang === 'EN' ? 'Vetted by our team' : 'Verificado por nuestro equipo', desc: lang === 'EN' ? 'Every villa, yacht, aircraft and staff member is physically inspected before joining our platform. We accept fewer than 1 in 5 applicants.' : 'Cada villa, yate, aeronave y miembro del personal es inspeccionado físicamente. Aceptamos menos de 1 de cada 5 solicitantes.' },
              { icon: Sparkles, title: lang === 'EN' ? 'One conversation' : 'Una conversación', desc: lang === 'EN' ? 'Tell Maria — our AI concierge — what you envision. She orchestrates every detail across all five pillars and presents your bespoke journey in minutes.' : 'Dígale a Maria — nuestra conserjería IA — lo que imagina. Ella orquesta cada detalle en los cinco pilares en minutos.' },
              { icon: Star, title: lang === 'EN' ? 'Absolute discretion' : 'Discreción absoluta', desc: lang === 'EN' ? 'Your privacy is not a feature — it is the foundation. No public listings, no shared data, no exceptions.' : 'Su privacidad no es una característica — es el fundamento. Sin listados públicos, sin datos compartidos.' },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="portal-card p-10">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-7">
                  <card.icon size={22} />
                </div>
                <h3 className="text-text-main font-semibold text-lg mb-3">{card.title}</h3>
                <p className="body-text text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations — images only, no prices */}
      <section className="py-20 px-6 bg-luxury-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="section-label block mb-4">{lang === 'EN' ? 'Where We Operate' : 'Dónde Operamos'}</span>
            <h2 className="section-title">{lang === 'EN' ? 'Cartagena & Beyond' : 'Cartagena y Más Allá'}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Cartagena', img: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=600', tag: lang === 'EN' ? 'Hub' : 'Base' },
              { name: 'Santa Marta', img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600', tag: lang === 'EN' ? 'Emerging' : 'Emergente' },
              { name: 'San Andrés', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600', tag: lang === 'EN' ? 'Island' : 'Isla' },
              { name: lang === 'EN' ? 'Greater Caribbean' : 'Gran Caribe', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', tag: lang === 'EN' ? 'Expanding' : 'Expandiendo' },
            ].map((dest, i) => (
              <motion.div key={dest.name}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative rounded-xl overflow-hidden group cursor-pointer aspect-[3/4]" onClick={handleSignIn}>
                <img src={dest.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <span className="section-label block mb-1">{dest.tag}</span>
                  <p className="text-text-main font-serif italic text-lg">{dest.name}</p>
                </div>
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-luxury-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock size={11} className="text-gold" />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-14">
            <button onClick={handleSignIn} disabled={signingIn}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-luxury-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-lg shadow-gold/15 disabled:opacity-60">
              {signingIn ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={15} />}
              {lang === 'EN' ? 'Access the Full Platform' : 'Acceder a la Plataforma Completa'}
            </button>
            <p className="meta-text mt-5">{lang === 'EN' ? 'Google account required · Access reviewed within 24h' : 'Cuenta Google requerida · Acceso revisado en 24h'}</p>
          </motion.div>
        </div>
      </section>

      {renderFooter()}
    </>
  );

  // ─── CLIENT PORTAL (logged in) ────────────────────────────────────────────
  const renderClientPortal = () => {
    if (showPartners) return <PartnersPage lang={lang} onApply={() => setShowPartners(false)} onBack={() => setShowPartners(false)} />;
    if (showMarketplace) return (
      <Marketplace
        assets={assets.map(a => ({ ...a, pricePerUnit: applyKLOMarkup(a.pricePerUnit) }))}
        lang={lang} initialSuccess={bookingSuccess}
        setChatOpen={setChatOpen} setChatPreload={setChatPreload}
        onBack={() => setShowMarketplace(false)}
        onBookAssets={(sel: Asset[]) => {
          setChatOpen(true);
          const names = sel.map(a => a.name).join(', ');
          const locs = [...new Set(sel.map(a => a.location))].join(' & ');
          setChatPreload(`I'd like to orchestrate a journey involving: ${names} in ${locs}.`);
        }} />
    );

    return (
      <>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <motion.img initial={{ scale: 1.06 }} animate={{ scale: 1 }}
              transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
              src={LUXURY_IMAGES[activePillar]} className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/40 to-luxury-black" />
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="section-label block mb-5">
                {lang === 'EN' ? `Welcome back, ${user?.name?.split(' ')[0] ?? ''}` : `Bienvenido, ${user?.name?.split(' ')[0] ?? ''}`}
              </span>
              <h1 className="hero-title mb-6">
                {lang === 'EN' ? <><span>Your next journey</span><br /><span className="text-gold">awaits.</span></> : <><span>Tu próximo viaje</span><br /><span className="text-gold">te espera.</span></>}
              </h1>
              <p className="hero-subtitle mx-auto mb-10">
                {lang === 'EN' ? 'Tell Maria what you have in mind, or browse our curated marketplace.' : 'Dígale a Maria lo que tiene en mente, o explore nuestro mercado curado.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <button onClick={() => setChatOpen(true)}
                  className="group px-10 py-4 bg-gold text-luxury-black rounded-lg font-semibold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all shadow-lg shadow-gold/20">
                  <Sparkles size={15} />
                  {lang === 'EN' ? 'Plan with Maria' : 'Planear con Maria'}
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => setShowMarketplace(true)}
                  className="px-10 py-4 border border-border-main rounded-lg text-xs uppercase tracking-widest hover:border-gold/40 hover:text-gold transition-all text-text-main/70">
                  {lang === 'EN' ? 'Browse Marketplace' : 'Explorar Mercado'}
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <AnimatePresence>
          {plannedExperience && (
            <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="py-24 px-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <span className="section-label block mb-2">{lang === 'EN' ? 'Your KLO Journey' : 'Su Viaje KLO'}</span>
                  <h2 className="section-title">{plannedExperience.title}</h2>
                </div>
                <div className="text-right">
                  <span className="meta-text block mb-1">{lang === 'EN' ? 'Total Investment' : 'Inversión Total'}</span>
                  <span className="text-3xl font-serif italic text-gold">{plannedExperience.estimatedTotal}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(plannedExperience.pillars).map(([key, value]) => {
                    const p = PILLARS.find(p => p.id === key.toUpperCase());
                    const Icon = p?.icon || Sparkles;
                    if (!value) return null;
                    return (
                      <motion.div key={key} whileHover={{ y: -3 }} className="portal-card p-8">
                        <div className="flex items-center gap-3 mb-5">
                          <div className={`p-3 rounded-lg bg-text-main/5 ${p?.color}`}><Icon size={18} /></div>
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-main">{key}</h3>
                        </div>
                        <p className="body-text text-sm">{value}</p>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="portal-card p-8">
                  <h3 className="text-base font-semibold text-text-main mb-8 flex items-center gap-3">
                    <Clock size={15} className="text-gold" /> {lang === 'EN' ? 'Itinerary' : 'Itinerario'}
                  </h3>
                  <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-border-main">
                    {plannedExperience.itinerary.map((item, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full bg-luxury-black border-2 border-gold flex items-center justify-center z-10">
                          <div className="w-1 h-1 rounded-full bg-gold" />
                        </div>
                        <span className="section-label block mb-0.5">{item.time}</span>
                        <p className="text-text-main text-sm">{item.activity}</p>
                        <p className="meta-text mt-0.5">{item.pillar} · {item.location}</p>
                      </div>
                    ))}
                  </div>
                  {paymentConfirmed ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                      <CheckCircle2 className="text-emerald-400 mx-auto mb-3" size={26} />
                      <p className="text-emerald-400 text-sm">{lang === 'EN' ? 'Confirmed — your concierge will contact you within 2 hours.' : 'Confirmado — su conserje le contactará en 2 horas.'}</p>
                    </motion.div>
                  ) : (
                    <button onClick={async () => {
                      setIsProcessingPayment(true);
                      try {
                        await fetch('/api/payments/create-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: plannedExperience.estimatedTotal }) });
                        setTimeout(() => { setIsProcessingPayment(false); setPaymentConfirmed(true); }, 2000);
                      } catch { setIsProcessingPayment(false); }
                    }} disabled={isProcessingPayment}
                      className="w-full mt-10 py-4 bg-white text-luxury-black rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-3">
                      {isProcessingPayment ? <Loader2 className="animate-spin" size={15} /> : <CreditCard size={15} />}
                      {lang === 'EN' ? 'Confirm & Pay' : 'Confirmar y Pagar'}
                    </button>
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {renderFooter()}
      </>
    );
  };

  // ─── ADMIN PORTAL ─────────────────────────────────────────────────────────
  const renderAdminPortal = () => {
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
        <aside className="w-56 hidden lg:block shrink-0">
          <div className="p-5 pt-8">
            <p className="section-label mb-6 px-3">KLO Admin</p>
            <div className="space-y-0.5">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setAdminActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left border-l-2 ${adminActiveTab === tab.id ? 'border-gold bg-gold/5 text-text-main' : 'border-transparent text-text-main/40 hover:text-text-main/70 hover:bg-luxury-slate/30'}`}>
                  <tab.icon size={14} /><span className="text-[11px]">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-border-main">
              <button onClick={() => setIsMissionControl(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/5 text-red-400/60 border border-red-500/10 hover:bg-red-500/10 hover:text-red-400 transition-all">
                <Zap size={14} /><span className="text-[11px]">{lang === 'EN' ? 'Mission Control' : 'Control Misión'}</span>
              </button>
            </div>
          </div>
        </aside>
        <div className="flex-1 overflow-y-auto p-8 bg-luxury-black custom-scrollbar">
          <div className="border-b border-border-main pb-5 mb-8">
            <p className="section-label mb-1">KLO Operations</p>
            <h1 className="text-3xl font-serif italic text-text-main">{tabs.find(t => t.id === adminActiveTab)?.label}</h1>
          </div>
          {adminActiveTab === 'OCC' && <OperationalCommandCenter bookings={MOCK_BOOKINGS} incidents={MOCK_INCIDENTS} lang={lang} />}
          {adminActiveTab === 'Map' && <GeospatialTracker assets={assets} lang={lang} />}
          {adminActiveTab === 'Rules' && <AgentialRuleEngine rules={agentialRules} lang={lang} onUpdateRules={setAgentialRules} />}
          {adminActiveTab === 'Analytics' && <PredictiveAnalytics alerts={MOCK_MAINTENANCE} lang={lang} />}
          {adminActiveTab === 'Finance' && <FinancialEngine financials={MOCK_FINANCIALS} lang={lang} />}
          {adminActiveTab === 'Comms' && <CommunicationHub messages={MOCK_MESSAGES} lang={lang} />}
          {adminActiveTab === 'Assets' && <AssetManagement assets={assets} lang={lang} onSaveAsset={u => setAssets(p => p.find(a => a.id === u.id) ? p.map(a => a.id === u.id ? u : a) : [u, ...p])} />}
          {adminActiveTab === 'Clients' && <ClientManagement clients={guestProfiles} lang={lang} onAddClient={c => setGuestProfiles(p => [c, ...p])} />}
          {adminActiveTab === 'Leads' && <LeadsManagement lang={lang} />}
          {adminActiveTab === 'Partners' && <SuppliersManagement lang={lang} onViewAssets={() => setAdminActiveTab('Assets')} />}
        </div>
        <AnimatePresence>
          {isMissionControl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-luxury-black p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-gold/10 text-gold rounded-xl border border-gold/20"><Zap size={24} /></div>
                  <div>
                    <h2 className="text-4xl font-serif italic text-text-main">Mission Control</h2>
                    <p className="section-label mt-1">High-Density Orchestration Active</p>
                  </div>
                </div>
                <button onClick={() => setIsMissionControl(false)}
                  className="px-8 py-3 bg-gold text-luxury-black rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
                  <X size={13} /> Exit
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
  const renderPartnerPortal = () => (
    <SupplierPortal onBack={() => window.history.pushState({}, '', '/')} lang={lang} />
  );

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  const renderFooter = () => (
    <footer className="py-20 px-6 border-t border-border-main bg-luxury-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-luxury-black font-serif font-bold">K</span>
            </div>
            <span className="font-serif text-lg text-text-main">Karibbean Luxury Operators</span>
          </div>
          <p className="body-text text-sm max-w-sm">{lang === 'EN' ? 'Ultra-luxury travel, curated in Cartagena. Expanding across Colombia and the Caribbean.' : 'Viajes de ultra-lujo, diseñados en Cartagena. En expansión por Colombia y el Caribe.'}</p>
        </div>
        <div>
          <h4 className="font-serif italic text-base mb-5 text-text-main">{lang === 'EN' ? 'Platform' : 'Plataforma'}</h4>
          <ul className="space-y-3">
            {[
              { label: lang === 'EN' ? 'Request Access' : 'Solicitar Acceso', action: handleSignIn },
              { label: lang === 'EN' ? 'AI Concierge' : 'Conserje IA', action: () => setChatOpen(true) },
              { label: lang === 'EN' ? 'Become a Partner' : 'Ser Socio', action: () => setShowPartners(true) },
            ].map(l => <li key={l.label}><button onClick={l.action} className="body-text text-sm hover:text-gold transition-colors">{l.label}</button></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-serif italic text-base mb-5 text-text-main">Legal</h4>
          <ul className="space-y-3">
            {['Privacy Policy', 'Terms of Service', 'GDPR Compliance'].map(s => <li key={s}><a href="#" className="body-text text-sm hover:text-gold transition-colors">{s}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-border-main">
        <span className="meta-text">© 2026 Karibbean Luxury Operators · {lang === 'EN' ? 'All rights reserved.' : 'Todos los derechos reservados.'}</span>
      </div>
    </footer>
  );

  // ─── ROOT ─────────────────────────────────────────────────────────────────
  const getPortal = () => {
    if (!user) return 'teaser';
    const path = window.location.pathname;
    if (path === '/admin' && user.role === 'ADMIN') return 'admin';
    if (path === '/partner' && (user.role === 'PARTNER' || user.role === 'ADMIN')) return 'partner';
    return 'client';
  };

  const portal = authLoading ? null : getPortal();

  return (
    <div className="min-h-screen bg-luxury-black text-text-main selection:bg-gold/30">
      {renderNav()}
      <main>
        {authLoading && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
                <span className="text-luxury-black font-serif font-bold text-2xl">K</span>
              </div>
              <Loader2 size={20} className="animate-spin text-gold/40" />
            </div>
          </div>
        )}
        {portal === 'teaser'  && renderVIPTeaser()}
        {portal === 'client'  && renderClientPortal()}
        {portal === 'admin'   && renderAdminPortal()}
        {portal === 'partner' && renderPartnerPortal()}
      </main>

      <LeadCaptureForm lang={lang} />
      <ChatDrawer isOpen={chatOpen} onClose={() => { setChatOpen(false); setChatPreload(null); }}
        initialMessage={chatPreload} lang={lang} onPlanGenerated={setPlannedExperience} />

      {/* Speed Dial FAB */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isSpeedDialOpen && (
            <>
              <motion.div initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.8 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`, '_blank'); setIsSpeedDialOpen(false); }}>
                <span className="px-3 py-1.5 bg-luxury-black text-text-main text-[10px] font-semibold rounded-full shadow-xl uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"><MessageSquare size={18} /></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.8 }} transition={{ delay: 0.05 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => { setChatOpen(true); setIsSpeedDialOpen(false); }}>
                <span className="px-3 py-1.5 bg-luxury-black text-text-main text-[10px] font-semibold rounded-full shadow-xl uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">AI Concierge</span>
                <div className="w-12 h-12 bg-gold text-luxury-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"><Sparkles size={18} /></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.08 }}
          onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
          className="w-16 h-16 bg-gold text-luxury-black rounded-full shadow-2xl shadow-gold/25 flex items-center justify-center relative">
          <motion.div animate={{ rotate: isSpeedDialOpen ? 45 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <MessageSquare size={22} />
          </motion.div>
          {!isSpeedDialOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-luxury-black animate-pulse" />}
        </motion.button>
      </div>
    </div>
  );
}
