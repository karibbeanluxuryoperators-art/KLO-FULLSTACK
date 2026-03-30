import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Ship, Home, Car, UserCheck, Shield, Sparkles, 
  MapPin, Calendar, Clock, ChevronRight, MessageSquare, 
  Send, Loader2, Menu, X, ArrowRight, ArrowLeft, Star, Quote,
  LayoutDashboard, Users, Briefcase, CreditCard, Settings,
  TrendingUp, Activity, Package, ExternalLink, Timer, AlertTriangle,
  Zap, DollarSign, CheckCircle2
} from 'lucide-react';
import { KLOExperience } from './services/kloBrain';
import { PILLARS, LUXURY_IMAGES } from './constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
import { Asset, Booking, AdminStats, ViewMode, Language, Incident, GuestProfile, AgentialRule, MaintenanceAlert, FinancialDeepDive, ChatMessage } from './types';

// Mock Data for expanded operations
const MOCK_INCIDENTS: Incident[] = [
  { id: 'I1', bookingId: 'B1', type: 'DELAY', severity: 'HIGH', description: 'Flight JTY-992 Delayed (ETA +15m)', status: 'RESOLVING', timestamp: '2m ago' },
  { id: 'I2', bookingId: 'B1', type: 'WEATHER', severity: 'MEDIUM', description: 'Sea Swell +1.5m at Anguilla', status: 'OPEN', timestamp: '15m ago', resolution: 'Monitoring tender operations.' },
  { id: 'I3', bookingId: 'B1', type: 'SECURITY', severity: 'LOW', description: 'Perimeter Breach (False Alarm)', status: 'RESOLVED', timestamp: '1h ago', resolution: 'Verified as local wildlife.' },
];

const MOCK_GUEST_PROFILES: GuestProfile[] = [
  {
    id: 'UHNWI_001',
    name: 'John Doe',
    tier: 'UHNWI',
    preferences: {
      dietary: ['Gluten-Free', 'Organic Only', 'No Shellfish'],
      beverages: ['Dom Pérignon 2012', 'Fiji Water (Room Temp)'],
      temperature: '21°C',
      interests: ['Contemporary Art', 'Deep Sea Fishing', 'Philanthropy']
    },
    pastExperiences: 12,
    totalSpend: '$1.2M',
    loyaltyPoints: 45000,
    status: 'ACTIVE'
  },
  {
    id: 'UHNWI_002',
    name: 'Jane Smith',
    tier: 'VVIP',
    preferences: {
      dietary: ['Vegan', 'Nut Allergy'],
      beverages: ['Green Tea', 'Alkaline Water'],
      temperature: '22°C',
      interests: ['Yoga', 'Sustainable Fashion', 'Architecture']
    },
    pastExperiences: 4,
    totalSpend: '$450K',
    loyaltyPoints: 12000,
    status: 'ACTIVE'
  }
];

const MOCK_RULES: AgentialRule[] = [
  { id: 'R1', trigger: 'DELAY', condition: 'Flight Delay > 20m', action: 'Re-route Vianco ground team', status: 'ACTIVE', lastTriggered: '2m ago' },
  { id: 'R2', trigger: 'SECURITY', condition: 'Perimeter Breach', status: 'ACTIVE', action: 'Deploy Elite Security Response' },
  { id: 'R3', trigger: 'WEATHER', condition: 'Swell > 2m', status: 'PAUSED', action: 'Suspend Tender Operations' },
];

const MOCK_MAINTENANCE: MaintenanceAlert[] = [
  { id: 'M1', assetId: 'A1', type: 'PREDICTIVE', description: 'Engine #2 Turbine Wear (85%)', urgency: 'HIGH', estimatedCost: '$12,500' },
  { id: 'M2', assetId: 'V1', type: 'SCHEDULED', description: 'Hull Cleaning & Inspection', urgency: 'LOW', estimatedCost: '$4,200' },
];

const MOCK_FINANCIALS: FinancialDeepDive = {
  revenue: 1250000,
  costOfGoods: 850000,
  partnerPayouts: 250000,
  operationalLeakage: 25000,
  netMargin: 125000,
  breakdown: [
    { category: 'Aviation', value: 450000 },
    { category: 'Maritime', value: 320000 },
    { category: 'Lodging', value: 280000 },
    { category: 'Staffing', value: 120000 },
  ]
};

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'MSG1', senderId: 'S1', senderName: 'Capt. Marco', senderRole: 'STAFF', content: 'Yacht Serenity is ready for boarding at Simpson Bay.', timestamp: '10:30', isEncrypted: true },
  { id: 'MSG2', senderId: 'ADMIN', senderName: 'Admin', senderRole: 'ADMIN', content: 'Confirmed. Client is 5 mins away via Vianco.', timestamp: '10:32', isEncrypted: true },
  { id: 'MSG3', senderId: 'UHNWI_001', senderName: 'John Doe', senderRole: 'CLIENT', content: 'Can we add a deep sea fishing session tomorrow?', timestamp: '11:05', isEncrypted: true },
];

const MOCK_ASSETS: Asset[] = [
  { 
    id: 'S1', 
    name: 'Capt. Marco Rossi', 
    type: 'STAFF', 
    status: 'AVAILABLE', 
    location: 'Cartagena', 
    providerId: 'P1', 
    pricePerUnit: '$1,200/day', 
    capacity: 1, 
    role: 'CAPTAIN', 
    rating: 4.9, 
    languages: ['EN', 'IT', 'ES'], 
    bookedDates: ['2026-03-10', '2026-03-11', '2026-03-12'],
    description: 'Expert maritime captain with over 20 years of experience navigating the Caribbean and Mediterranean. Specialized in luxury yacht management and guest safety.',
    contactName: 'Marco Rossi'
  },
  { 
    id: 'S2', 
    name: 'Chef Elena Vance', 
    type: 'STAFF', 
    status: 'BOOKED', 
    location: 'St. Barths', 
    providerId: 'P1', 
    pricePerUnit: '$800/day', 
    capacity: 1, 
    role: 'CHEF', 
    rating: 5.0, 
    languages: ['EN', 'FR'], 
    bookedDates: ['2026-03-05', '2026-03-06'],
    description: 'Michelin-starred chef specializing in fusion cuisine. Expert in sourcing local Caribbean ingredients to create bespoke dining experiences.',
    contactName: 'Elena Vance'
  },
  { 
    id: 'A1', 
    name: 'Gulfstream G650', 
    type: 'AIRCRAFT', 
    status: 'AVAILABLE', 
    location: 'Miami', 
    providerId: 'P2', 
    pricePerUnit: '$8,500/hr', 
    capacity: 14, 
    model: 'G650ER', 
    range: '7,500nm', 
    tailNumber: 'N123KL', 
    bookedDates: ['2026-03-15', '2026-03-16'],
    description: 'The pinnacle of business aviation. This G650ER offers unmatched range and speed, paired with a bespoke interior designed for ultimate comfort.',
    contactName: 'Aviation Ops Team'
  },
  { 
    id: 'V1', 
    name: 'Serenity Yacht', 
    type: 'VESSEL', 
    status: 'BOOKED', 
    location: 'Antigua', 
    providerId: 'P3', 
    pricePerUnit: '$15,000/day', 
    capacity: 12, 
    length: '150ft', 
    crewCount: 8, 
    vesselType: 'YACHT', 
    bookedDates: ['2026-03-05', '2026-03-06', '2026-03-07'],
    description: 'A masterpiece of maritime engineering. Serenity features a beach club, infinity pool, and a dedicated crew of 8 to cater to your every whim.',
    contactName: 'Maritime Concierge'
  },
  { 
    id: 'C1', 
    name: 'Escalade ESV (Armored)', 
    type: 'VEHICLE', 
    status: 'AVAILABLE', 
    location: 'Bogotá', 
    providerId: 'P4', 
    pricePerUnit: '$950/day', 
    capacity: 6, 
    model: '2024 Platinum', 
    isArmored: true, 
    bookedDates: ['2026-03-20'],
    description: 'B6 level armored protection combined with the luxury of the Platinum trim. Features secure comms and a professional security driver.',
    contactName: 'Vianco Security'
  },
  { 
    id: 'L1', 
    name: 'Villa del Mar', 
    type: 'LODGING', 
    status: 'AVAILABLE', 
    location: 'Anguilla', 
    providerId: 'P5', 
    pricePerUnit: '$5,500/nt', 
    capacity: 10, 
    rooms: 5, 
    amenities: ['Infinity Pool', 'Private Beach', 'Gym'], 
    bookedDates: ['2026-03-25', '2026-03-26', '2026-03-27'],
    description: 'An architectural marvel on the shores of Anguilla. This 5-bedroom villa offers total privacy, a private beach, and 24/7 butler service.',
    contactName: 'Estate Manager'
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B1',
    clientId: 'UHNWI_001',
    title: 'The Caribbean Apex Journey',
    startDate: '2026-03-10',
    endDate: '2026-03-15',
    status: 'IN_PROGRESS',
    totalInvestment: '$145,000',
    assets: ['A1', 'V1', 'L1', 'S1'],
    tte: '12m',
    securityBrief: {
      id: 'SB1',
      level: 'ELITE',
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

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('CLIENT');
  const [lang, setLang] = useState<Language>('EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sectionConfirmation, setSectionConfirmation] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPreload, setChatPreload] = useState<string | null>(null);
  const [plannedExperience, setPlannedExperience] = useState<KLOExperience | null>(null);
  const [activePillar, setActivePillar] = useState(0);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('OCC');
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [isMissionControl, setIsMissionControl] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [agentialRules, setAgentialRules] = useState<AgentialRule[]>(MOCK_RULES);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>(MOCK_GUEST_PROFILES);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [isHeroNav, setIsHeroNav] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsHeroNav(window.scrollY < 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (window.location.pathname === '/supplier') {
      setViewMode('SUPPLIER');
    }
    // Fetch Assets from API
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAssets(data);
        }
      })
      .catch(err => console.error('Failed to fetch assets', err));

    // Fetch Admin Stats if in admin mode and logged in
    if (viewMode === 'ADMIN' && user?.role === 'ADMIN') {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => setAdminStats(data));
    }

    // Check for booking success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking') === 'success') {
      setBookingSuccess(true);
      setShowMarketplace(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [viewMode, lang, user]);

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
        setViewMode(data.user.role);
        setShowAuth(false);
      } else {
        setAuthError(data.message);
      }
    } catch (err) {
      setAuthError('Connection error');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setViewMode('CLIENT');
  };

  const renderAuth = () => (
    <div className="min-h-screen flex items-center justify-center bg-luxury-paper px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src={LUXURY_IMAGES[4]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 rounded-3xl w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-luxury-black font-bold text-3xl">K</span>
          </div>
          <h2 className="text-2xl font-sans font-medium mb-2 tracking-tight">
            {lang === 'EN' ? 'Access KLO' : lang === 'ES' ? 'Acceder a KLO' : 'Acessar KLO'}
          </h2>
          <p className="text-luxury-black/40 text-sm font-light">
            {lang === 'EN' 
              ? 'Enter your credentials to access the orchestration core' 
              : lang === 'ES' 
              ? 'Ingrese sus credenciales para acceder al núcleo de orquestación'
              : 'Insira suas credenciais para acessar o núcleo de orquestração'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] font-sans uppercase tracking-tight text-gold/60 mb-1 block">
              {lang === 'EN' ? 'Email Address' : lang === 'ES' ? 'Correo Electrónico' : 'Endereço de E-mail'}
            </label>
            <input 
              type="email" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light"
              placeholder="admin@klo.com"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-sans uppercase tracking-tight text-gold/60 mb-1 block">
              {lang === 'EN' ? 'Password' : lang === 'ES' ? 'Contraseña' : 'Senha'}
            </label>
            <input 
              type="password" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light"
              placeholder="••••••••"
              required
            />
          </div>
          {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-gold text-luxury-black rounded-full font-semibold uppercase tracking-tight hover:bg-white transition-all duration-300"
          >
            {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Iniciar Sesión' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-sans uppercase tracking-tight text-luxury-black/40">
            {lang === 'EN' ? 'Demo Credentials' : lang === 'ES' ? 'Credenciales de Demostración' : 'Credenciais de Demonstração'}:<br />
            admin@klo.com | provider@klo.com | client@klo.com
          </p>
        </div>
      </motion.div>
    </div>
  );

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: plannedExperience?.estimatedTotal, customerId: 'UHNWI_001' })
      });
      const data = await res.json();
      setTimeout(() => {
        setIsProcessingPayment(false);
        setPaymentConfirmed(true);
      }, 2000);
    } catch (error) {
      setIsProcessingPayment(false);
    }
  };

  const renderClientView = () => {
    if (showMarketplace) {
      return (
        <Marketplace 
          assets={assets} 
          lang={lang} 
          initialSuccess={bookingSuccess}
          setChatOpen={setChatOpen}
          setChatPreload={setChatPreload}
          onBack={() => setShowMarketplace(false)}
          onBookAssets={(selectedAssets) => {
            setChatOpen(true);
            const assetNames = selectedAssets.map(a => a.name).join(', ');
            const locations = [...new Set(selectedAssets.map(a => a.location))].join(' & ');
            setChatPreload(lang === 'EN' 
              ? `I'd like to orchestrate a journey involving: ${assetNames} in ${locations}.` 
              : lang === 'ES' 
              ? `Me gustaría orquestar un viaje que incluya: ${assetNames} en ${locations}.` 
              : `Eu gostaria de orquestrar uma jornada envolvendo: ${assetNames} em ${locations}.`);
          }} 
        />
      );
    }

    return (
      <>
        {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            src={LUXURY_IMAGES[activePillar % LUXURY_IMAGES.length]} 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/80 via-transparent to-luxury-black" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold font-sans uppercase tracking-tight text-[11px] font-semibold mb-4 block">
              {lang === 'EN' ? 'Caribbean Ultra-Luxury · AI-Orchestrated' : lang === 'ES' ? 'Ultra-Lujo del Caribe · Orquestado por IA' : 'Ultra-Luxo do Caribe · Orquestrado por IA'}
            </span>
            <h1 className="text-5xl md:text-8xl font-serif italic mb-8 leading-tight tracking-wide">
              {lang === 'EN' ? 'One conversation. Jet to yacht to villa.' : lang === 'ES' ? 'Una conversación. Del jet al yate a la villa.' : 'Uma conversa. Do jato ao iate à vila.'}
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-sans font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === 'EN' 
                ? 'The only platform that moves you from private jet to superyacht to ultra-luxury villa — with your entire Caribbean journey orchestrated in seconds.'
                : lang === 'ES'
                ? 'La única plataforma que lo traslada de un jet privado a un superyate y a una villa de ultra-lujo, con todo su viaje por el Caribe orquestado en segundos.'
                : 'A única plataforma que o leva de um jato particular a um superiate e a uma vila de ultra-luxo — com toda a sua jornada pelo Caribe orquestrada em segundos.'}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4">
              <button 
                onClick={() => setChatOpen(true)}
                className="group px-10 py-4 bg-gold text-luxury-black rounded-full font-medium flex items-center gap-3 hover:bg-white transition-all duration-300"
              >
                {lang === 'EN' ? 'Curate My Journey' : lang === 'ES' ? 'Organizar mi Viaje' : 'Curar Minha Jornada'} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowMarketplace(true)}
                className="px-10 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all"
              >
                {lang === 'EN' ? 'Explore Marketplace' : lang === 'ES' ? 'Explorar Mercado' : 'Explorar Mercado'}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          {PILLARS.map((pillar, idx) => (
            <button 
              key={pillar.id}
              onClick={() => setActivePillar(idx)}
              className={`w-12 h-1 flex transition-all duration-500 ${activePillar === idx ? 'bg-gold w-24' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-luxury-black py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-6 tracking-wide">
              {lang === 'EN' ? 'The Standard for' : lang === 'ES' ? 'El Estándar para' : 'O Padrão para'} <br />
              <span className="text-gold italic">{lang === 'EN' ? 'Caribbean Ultra-Luxury' : lang === 'ES' ? 'Ultra-Lujo del Caribe' : 'Ultra-Luxo do Caribe'}</span>
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto" />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { label: '$7,500 avg booking', icon: DollarSign },
              { label: '<0.5s response time', icon: Timer },
              { label: '5 pillars covered', icon: LayoutDashboard },
              { label: '100% vetted assets', icon: Shield },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-2xl text-center border border-white/5 hover:border-gold/30 transition-all group"
              >
                <stat.icon className="mx-auto mb-4 text-gold/50 group-hover:text-gold transition-colors" size={32} />
                <p className="text-white font-sans font-medium text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: lang === 'EN' ? 'Military-Grade Vetting' : lang === 'ES' ? 'Veteo de Grado Militar' : 'Vetting de Grau Militar',
                desc: lang === 'EN' 
                  ? 'Every asset physically verified by CEO/COO. Ex-Military Intelligence security protocols.'
                  : lang === 'ES'
                  ? 'Cada activo verificado físicamente por el CEO/COO. Protocolos de seguridad de Inteligencia Ex-Militar.'
                  : 'Cada ativo verificado fisicamente pelo CEO/COO. Protocolos de segurança de Inteligência Ex-Militar.'
              },
              {
                icon: Zap,
                title: lang === 'EN' ? 'Instant Orchestration' : lang === 'ES' ? 'Orquestación Instantánea' : 'Orquestração Instantânea',
                desc: lang === 'EN'
                  ? 'Maria Fernanda AI plans your complete 360 experience in under 1 second.'
                  : lang === 'ES'
                  ? 'La IA Maria Fernanda planifica su experiencia 360 completa en menos de 1 segundo.'
                  : 'A IA Maria Fernanda planeja sua experiência 360 completa em menos de 1 segundo.'
              },
              {
                icon: Users,
                title: lang === 'EN' ? 'B2B2C Network' : lang === 'ES' ? 'Red B2B2C' : 'Rede B2B2C',
                desc: lang === 'EN'
                  ? 'On-site staff become your sales force. Zero acquisition cost after month 6.'
                  : lang === 'ES'
                  ? 'El personal en el sitio se convierte en su fuerza de ventas. Costo de adquisición cero después del mes 6.'
                  : 'A equipe no local torna-se sua força de vendas. Custo de aquisição zero após o mês 6.'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -50 : idx === 2 ? 50 : 0, y: idx === 1 ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="glass-panel p-10 rounded-2xl border border-white/5 hover:border-gold/20 transition-all"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-8">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-sans font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 font-sans font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gold/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gold/5 blur-[120px] rounded-full" />
        </div>
      </section>

      {/* Planned Experience Dashboard */}
      <AnimatePresence>
        {plannedExperience && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="py-24 px-6 max-w-7xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <span className="text-gold font-sans uppercase tracking-tight text-[11px] font-semibold mb-1 block">
                  {lang === 'EN' ? 'Central Guest Profile' : lang === 'ES' ? 'Perfil Central del Huésped' : 'Perfil Central do Hóspede'}: UHNWI_001
                </span>
                <h2 className="text-4xl md:text-5xl font-serif italic tracking-wide">{plannedExperience.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-luxury-black/40 text-sm font-sans block mb-1">
                  {lang === 'EN' ? 'Total Investment' : lang === 'ES' ? 'Inversión Total' : 'Investimento Total'} (incl. {plannedExperience.managementFee} {lang === 'EN' ? 'fee' : lang === 'ES' ? 'tarifa' : 'taxa'})
                </span>
                <span className="text-3xl font-sans font-light text-gold">{plannedExperience.estimatedTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(plannedExperience.pillars).map(([key, value]) => {
                  const pillarInfo = PILLARS.find(p => p.id === key.toUpperCase());
                  if (!value) return null;
                  return (
                    <motion.div key={key} whileHover={{ y: -5 }} className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {pillarInfo && <pillarInfo.icon size={80} />}
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl bg-white/5 ${pillarInfo?.color}`}>
                          {pillarInfo && <pillarInfo.icon size={24} />}
                        </div>
                        <h3 className="text-lg font-sans font-medium">
                          {lang === 'EN' ? key : lang === 'ES' ? (key === 'stay' ? 'estancia' : key === 'ground' ? 'tierra' : key) : (key === 'stay' ? 'estadia' : key === 'ground' ? 'terra' : key)}
                        </h3>
                      </div>
                      <p className="text-luxury-black/70 font-sans font-light leading-relaxed">{value}</p>
                    </motion.div>
                  );
                })}
                
                {/* Legal & Security */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-2xl border-gold/20">
                    <h3 className="text-lg font-sans font-medium mb-4 flex items-center gap-3">
                      <Shield size={20} className="text-gold" /> {lang === 'EN' ? 'Security Brief' : 'Resumen de Seguridad'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-sans uppercase tracking-tight text-luxury-black/40 font-semibold">Level</span>
                        <span className="text-xs font-sans font-semibold text-gold">{plannedExperience.securityBrief.level}</span>
                      </div>
                      <p className="text-xs font-sans text-luxury-black/60 italic leading-relaxed">
                        "{plannedExperience.securityBrief.riskAssessment}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plannedExperience.securityBrief.protocols.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-tight border border-white/10">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-2xl border-white/10">
                    <h3 className="text-lg font-sans font-medium mb-4 flex items-center gap-3">
                      <UserCheck size={20} className="text-gold" /> {lang === 'EN' ? 'Compliance' : 'Cumplimiento'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {plannedExperience.legalRequirements.map((req, i) => (
                        <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-xs font-sans font-light border border-white/10">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-lg font-sans font-medium mb-8 flex items-center gap-3">
                  <Clock size={20} className="text-gold" /> {lang === 'EN' ? 'Agential Timeline' : 'Cronograma Agéntico'}
                </h3>
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                  {plannedExperience.itinerary.map((item, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className={`absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full bg-luxury-black border-2 flex items-center justify-center z-10 ${
                        item.status === 'Auto-Scheduled' ? 'border-cyan-400' : 'border-gold'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Auto-Scheduled' ? 'bg-cyan-400' : 'bg-gold'}`} />
                      </div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gold font-sans font-semibold uppercase tracking-tight block mb-1">{item.time}</span>
                          <span className="text-[9px] text-emerald-400 font-sans">TTE: {item.tte}</span>
                        </div>
                        <span className={`text-[10px] font-sans font-semibold uppercase tracking-tight px-2 py-0.5 rounded-full ${
                          item.status === 'Auto-Scheduled' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-gold/10 text-gold'
                        }`}>
                          {lang === 'EN' ? item.status : lang === 'ES' ? (item.status === 'Auto-Scheduled' ? 'Auto-Programado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendiente') : (item.status === 'Auto-Scheduled' ? 'Auto-Agendado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendente')}
                        </span>
                      </div>
                      <p className="text-sm font-sans font-light text-luxury-black/90">{item.activity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-sans font-semibold text-luxury-black/30 uppercase tracking-tight">{item.pillar}</span>
                        <span className="text-[11px] text-luxury-black/20">•</span>
                        <span className="text-[11px] font-sans font-semibold text-luxury-black/30 uppercase tracking-tight">{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {paymentConfirmed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full mt-10 py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col items-center justify-center gap-3 text-center"
                  >
                    <CheckCircle2 className="text-emerald-500" size={32} />
                    <p className="text-emerald-500 font-sans font-medium px-4">
                      {lang === 'EN' 
                        ? 'Payment confirmed — your KLO concierge will contact you within 2 hours' 
                        : lang === 'ES' 
                        ? 'Pago confirmado — su conserje de KLO lo contactará en 2 horas' 
                        : 'Pagamento confirmado — seu concierge KLO entrará em contato em 2 horas'}
                    </p>
                  </motion.div>
                ) : (
                  <button 
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full mt-10 py-4 bg-white text-luxury-black rounded-full font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-gold transition-colors flex items-center justify-center gap-3"
                  >
                    {isProcessingPayment ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                    {lang === 'EN' ? 'Confirm Invisible Payment' : lang === 'ES' ? 'Confirmar Pago Invisible' : 'Confirmar Pagamento Invisível'}
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {/* Become a Partner Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gold via-gold/80 to-gold/60 text-luxury-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif italic mb-8 tracking-wide">
              {lang === 'EN' ? 'Join the KLO Partner Network' : lang === 'ES' ? 'Únase a la Red de Socios de KLO' : 'Junte-se à Rede de Parceiros KLO'}
            </h2>
            <p className="text-luxury-black/70 text-lg font-sans font-light mb-12 leading-relaxed">
              {lang === 'EN' 
                ? "List your villa, yacht, aircraft, or services with the Caribbean's premier ultra-luxury platform. Reach UHNW clients globally with zero upfront cost."
                : lang === 'ES'
                ? "Anuncie su villa, yate, avión o servicios en la plataforma de ultra-lujo líder del Caribe. Llegue a clientes UHNW a nivel mundial sin costo inicial."
                : "Liste sua vila, iate, aeronave ou serviços na principal plataforma de ultra-luxo do Caribe. Alcance clientes UHNW globalmente com custo inicial zero."}
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                { en: '20% commission — you keep 80%', es: '20% de comisión — usted se queda con el 80%', pt: '20% de comissão — você fica com 80%' },
                { en: 'Verified UHNW client base', es: 'Base de clientes UHNW verificada', pt: 'Base de clientes UHNW verificada' },
                { en: '48-hour payment after check-in', es: 'Pago en 48 horas después del check-in', pt: 'Pagamento em 48 horas após o check-in' }
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-luxury-black/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-luxury-black" />
                  </div>
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-tight">
                    {lang === 'EN' ? point.en : lang === 'ES' ? point.es : point.pt}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => {
                  window.history.pushState({}, '', '/supplier');
                  setViewMode('SUPPLIER');
                }}
                className="w-full sm:w-auto px-10 py-4 bg-luxury-black text-gold rounded-full font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-white hover:text-luxury-black transition-all shadow-2xl"
              >
                {lang === 'EN' ? 'Apply to Become a Partner' : lang === 'ES' ? 'Solicitar ser Socio' : 'Candidatar-se a Parceiro'}
              </button>
              <a 
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-luxury-black font-sans font-semibold uppercase tracking-tight text-[11px] hover:underline"
              >
                <MessageSquare size={18} />
                {lang === 'EN' ? 'WhatsApp Us First' : lang === 'ES' ? 'WhatsApp Primero' : 'WhatsApp Primeiro'}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Partner"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-2xl border-white/20 text-luxury-black shadow-2xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gold bg-luxury-paper overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Partner" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-sans uppercase tracking-tight font-semibold">500+ Active Partners</span>
              </div>
              <p className="text-xs italic font-light">"KLO changed our business model."</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

  const renderAdminView = () => {
    const tabs = [
      { id: 'OCC', icon: Activity, label: lang === 'EN' ? 'Command Center' : lang === 'ES' ? 'Centro Comando' : 'Centro de Comando' },
      { id: 'Map', icon: MapPin, label: lang === 'EN' ? 'Geospatial' : 'Geospatial' },
      { id: 'Rules', icon: Zap, label: lang === 'EN' ? 'Agential Logic' : 'Lógica Agéntica' },
      { id: 'Analytics', icon: TrendingUp, label: lang === 'EN' ? 'Predictive' : 'Predictivo' },
      { id: 'Finance', icon: DollarSign, label: lang === 'EN' ? 'Unit Economics' : 'Economía' },
      { id: 'Comms', icon: MessageSquare, label: lang === 'EN' ? 'Secure Hub' : 'Hub Seguro' },
      { id: 'Assets', icon: Package, label: lang === 'EN' ? 'Assets' : lang === 'ES' ? 'Activos' : 'Ativos' },
      { id: 'Clients', icon: Briefcase, label: lang === 'EN' ? 'Clients' : lang === 'ES' ? 'Clientes' : 'Clientes' },
      { id: 'Leads', icon: Users, label: lang === 'EN' ? 'Leads' : lang === 'ES' ? 'Leads' : 'Leads' },
      { id: 'Suppliers', icon: UserCheck, label: lang === 'EN' ? 'Suppliers' : lang === 'ES' ? 'Proveedores' : 'Fornecedores' },
    ];

    return (
      <div className={`pt-20 flex min-h-screen ${isMissionControl ? 'bg-luxury-paper' : ''}`}>
        {/* Admin Sidebar */}
        {!isMissionControl && (
          <aside className="w-64 border-r border-white/5 bg-luxury-slate/50 backdrop-blur-md hidden lg:block">
            <div className="p-8">
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setAdminActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                      adminActiveTab === tab.id ? 'bg-gold text-luxury-black font-bold' : 'text-luxury-black/40 hover:bg-black/5'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="text-[11px] font-sans uppercase tracking-tight font-semibold">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/5">
                <button 
                  onClick={() => setIsMissionControl(true)}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all"
                >
                  <Zap size={18} />
                  <span className="text-[11px] font-sans uppercase tracking-tight font-semibold">
                    {lang === 'EN' ? 'Mission Control' : lang === 'ES' ? 'Control de Misión' : 'Controle de Missão'}
                  </span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Admin Content */}
        <div className={`flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar ${isMissionControl ? 'max-w-none' : ''}`}>
          {isMissionControl && (
            <div className="fixed inset-0 z-[200] bg-luxury-paper p-8 overflow-y-auto custom-scrollbar text-luxury-black">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => {
                      setIsMissionControl(false);
                      setViewMode('CLIENT');
                      setShowMarketplace(false);
                    }}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
                    title="Back to Home"
                  >
                    <Home size={24} />
                  </button>
                  <div className="p-4 bg-gold/10 text-gold rounded-2xl border border-gold/20">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-serif italic tracking-wide text-white">
                      {lang === 'EN' ? 'Mission Control Mode' : lang === 'ES' ? 'Modo Control de Misión' : 'Modo Controle de Missão'}
                    </h2>
                    <p className="text-gold/60 font-sans text-[11px] uppercase tracking-tight font-semibold">
                      {lang === 'EN' ? 'High-Density Orchestration Active' : lang === 'ES' ? 'Orquestación de Alta Densidad Activa' : 'Orquestração de Alta Densidade Ativa'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMissionControl(false)}
                  className="px-8 py-4 bg-gold text-luxury-black rounded-xl hover:bg-white transition-all font-sans uppercase tracking-tight text-[11px] font-bold shadow-lg shadow-gold/20 flex items-center gap-2"
                >
                  <X size={16} />
                  {lang === 'EN' ? 'Exit Control Mode' : lang === 'ES' ? 'Salir del Modo Control' : 'Sair do Modo Controle'}
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
            </div>
          )}

          {!isMissionControl && (
            <>
              {adminActiveTab === 'OCC' && <OperationalCommandCenter bookings={MOCK_BOOKINGS} incidents={MOCK_INCIDENTS} lang={lang} />}
              {adminActiveTab === 'Map' && <GeospatialTracker assets={assets} lang={lang} />}
              {adminActiveTab === 'Rules' && <AgentialRuleEngine rules={agentialRules} lang={lang} onUpdateRules={setAgentialRules} />}
              {adminActiveTab === 'Analytics' && <PredictiveAnalytics alerts={MOCK_MAINTENANCE} lang={lang} />}
              {adminActiveTab === 'Finance' && <FinancialEngine financials={MOCK_FINANCIALS} lang={lang} />}
              {adminActiveTab === 'Comms' && <CommunicationHub messages={MOCK_MESSAGES} lang={lang} />}
              {adminActiveTab === 'Assets' && (
                <AssetManagement 
                  assets={assets} 
                  lang={lang} 
                  onSaveAsset={(updatedAsset) => {
                    setAssets(prev => {
                      const exists = prev.find(a => a.id === updatedAsset.id);
                      if (exists) {
                        return prev.map(a => a.id === updatedAsset.id ? updatedAsset : a);
                      }
                      return [updatedAsset, ...prev];
                    });
                  }}
                />
              )}
              
              {adminActiveTab === 'Clients' && (
                <ClientManagement 
                  clients={guestProfiles} 
                  lang={lang} 
                  onAddClient={(newClient) => setGuestProfiles(prev => [newClient, ...prev])}
                />
              )}

              {adminActiveTab === 'Leads' && (
                <LeadsManagement lang={lang} />
              )}

              {adminActiveTab === 'Suppliers' && (
                <SuppliersManagement 
                  lang={lang} 
                  onViewAssets={(supplierId) => {
                    setAdminActiveTab('Assets');
                    // We could filter assets here if AssetManagement supported it
                  }} 
                />
              )}

            </>
          )}
        </div>
      </div>
    );
  };

  const renderProviderView = () => (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <button 
          onClick={() => setViewMode('CLIENT')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-sans uppercase tracking-tight font-semibold text-luxury-black hover:bg-black/5 transition-all group"
        >
          <ChevronRight className="rotate-180 group-hover:text-gold transition-colors" size={14} /> 
          {lang === 'EN' ? 'Back to Client View' : lang === 'ES' ? 'Volver a Vista Cliente' : 'Voltar à Vista do Cliente'}
        </button>
      </div>
      <AssetManagement 
        assets={assets.filter(a => a.providerId === 'P1')} 
        lang={lang} 
        onSaveAsset={(updatedAsset) => {
          setAssets(prev => {
            const exists = prev.find(a => a.id === updatedAsset.id);
            if (exists) {
              return prev.map(a => a.id === updatedAsset.id ? updatedAsset : a);
            }
            return [updatedAsset, ...prev];
          });
        }}
        isProvider={true}
      />
    </div>
  );

  const renderSupplierView = () => (
    <SupplierPortal onBack={() => {
      window.history.pushState({}, '', '/');
      setViewMode('CLIENT');
    }} />
  );

  return (
    <div className="min-h-screen bg-luxury-paper text-luxury-black selection:bg-gold/30">
      {viewMode === 'SUPPLIER' ? renderSupplierView() : (showAuth && !user) ? renderAuth() : (
        <>
          {/* Navigation */}
          <nav 
            className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md"
            style={{
              background: isHeroNav ? 'rgba(0,0,0,0.3)' : 'rgba(250,248,244,0.95)',
              borderBottom: isHeroNav ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
              color: isHeroNav ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
            }}
          >
            {/* Section Confirmation Toast */}
            <AnimatePresence>
              {sectionConfirmation && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-gold text-luxury-black rounded-full shadow-2xl font-sans font-bold uppercase tracking-tight text-[10px] z-[100]"
                >
                  {lang === 'EN' ? 'Entering' : lang === 'ES' ? 'Entrando a' : 'Entrando em'} {sectionConfirmation}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setViewMode('CLIENT'); setShowMarketplace(false); }}>
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
                  <Home size={20} className="text-luxury-black" />
                </div>
                <span className={`font-serif text-xl md:text-2xl tracking-wide uppercase font-light ${isHeroNav ? 'text-white' : 'text-luxury-black'}`}>
                  <span className="hidden lg:inline">Karibbean Luxury Operators</span>
                  <span className="lg:hidden">KLO</span>
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-light">
                <button 
                  onClick={() => {
                    setViewMode('CLIENT');
                    setShowMarketplace(false);
                  }} 
                  style={{ color: (viewMode === 'CLIENT' && !showMarketplace) ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: (viewMode === 'CLIENT' && !showMarketplace) ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors flex items-center gap-1"
                >
                  <Home size={12} /> {lang === 'EN' ? 'Home' : lang === 'ES' ? 'Inicio' : 'Início'}
                </button>
                <button 
                  onClick={() => {
                    setViewMode('CLIENT');
                    setShowMarketplace(false);
                  }} 
                  style={{ color: (viewMode === 'CLIENT' && !showMarketplace) ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: (viewMode === 'CLIENT' && !showMarketplace) ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge'}
                </button>
                <button 
                  onClick={() => {
                    setViewMode('CLIENT');
                    setShowMarketplace(true);
                  }} 
                  style={{ color: (viewMode === 'CLIENT' && showMarketplace) ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: (viewMode === 'CLIENT' && showMarketplace) ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Marketplace' : lang === 'ES' ? 'Mercado' : 'Mercado'}
                </button>
                <button 
                  onClick={() => {
                    window.history.pushState({}, '', '/supplier');
                    setViewMode('SUPPLIER');
                  }} 
                  style={{ color: viewMode === 'SUPPLIER' ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: viewMode === 'SUPPLIER' ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Become a Partner' : lang === 'ES' ? 'Ser Socio' : 'Ser Parceiro'}
                </button>

                <div className="w-[1px] h-4 bg-current opacity-10 mx-1" />
                
                <button 
                  onClick={() => setViewMode('ADMIN')} 
                  style={{ color: viewMode === 'ADMIN' ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: viewMode === 'ADMIN' ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Admin' : 'Admin'}
                </button>
                <button 
                  onClick={() => {
                    setViewMode('CLIENT');
                    setShowMarketplace(false);
                  }} 
                  style={{ color: (viewMode === 'CLIENT' && !showMarketplace) ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: (viewMode === 'CLIENT' && !showMarketplace) ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Client' : 'Client'}
                </button>
                <button 
                  onClick={() => {
                    window.history.pushState({}, '', '/supplier');
                    setViewMode('SUPPLIER');
                  }} 
                  style={{ color: viewMode === 'SUPPLIER' ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: viewMode === 'SUPPLIER' ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Supplier' : 'Supplier'}
                </button>
                <button 
                  onClick={() => setViewMode('PROVIDER')} 
                  style={{ color: viewMode === 'PROVIDER' ? (isHeroNav ? '#D4AF37' : '#B8941F') : undefined, opacity: viewMode === 'PROVIDER' ? 1 : 0.6 }}
                  className="hover:text-gold transition-colors"
                >
                  {lang === 'EN' ? 'Provider' : 'Provider'}
                </button>

                <div className="w-[1px] h-4 bg-current opacity-10 mx-1" />
                
                <button 
                  onClick={() => {
                    if (lang === 'EN') setLang('ES');
                    else if (lang === 'ES') setLang('PT');
                    else setLang('EN');
                  }}
                  className="px-2 py-1 border border-current opacity-40 rounded hover:opacity-100 transition-colors text-[9px] font-bold"
                >
                  {lang}
                </button>

                <div className="flex items-center gap-4">
                  {user ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] opacity-50 lowercase tracking-normal">{user.name}</span>
                      <button onClick={handleLogout} className="hover:text-gold transition-colors opacity-60 hover:opacity-100">
                        {lang === 'EN' ? 'Sign Out' : lang === 'ES' ? 'Cerrar Sesión' : 'Sair'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setShowAuth(true)} className="hover:text-gold transition-colors opacity-60 hover:opacity-100">
                      {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Iniciar Sesión' : 'Entrar'}
                    </button>
                  )}
                </div>

                <button onClick={() => setChatOpen(true)} className="px-5 py-2 border border-gold/50 rounded-full hover:bg-gold hover:text-luxury-black transition-all duration-300 text-gold">
                  {lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge'}
                </button>
              </div>

              <button className={`md:hidden ${isHeroNav ? 'text-white' : 'text-luxury-black'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-[60] bg-luxury-paper flex flex-col p-8"
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
                        <span className="text-luxury-black font-bold text-xl">K</span>
                      </div>
                      <span className="font-serif text-xl tracking-wide uppercase font-light">KLO</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-6 text-lg uppercase tracking-[0.2em] font-light">
                    <button onClick={() => {
                      setViewMode('CLIENT');
                      setShowMarketplace(false);
                      setIsMenuOpen(false);
                      setSectionConfirmation(lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'CLIENT' && !showMarketplace ? 'text-gold' : 'text-luxury-black/60'}`}>
                      {lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge'}
                    </button>
                    <button onClick={() => {
                      setViewMode('CLIENT');
                      setShowMarketplace(true);
                      setIsMenuOpen(false);
                      setSectionConfirmation(lang === 'EN' ? 'Marketplace' : lang === 'ES' ? 'Mercado' : 'Mercado');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'CLIENT' && showMarketplace ? 'text-gold' : 'text-luxury-black/60'}`}>
                      {lang === 'EN' ? 'Marketplace' : lang === 'ES' ? 'Mercado' : 'Mercado'}
                    </button>
                    <button onClick={() => {
                      window.history.pushState({}, '', '/supplier');
                      setViewMode('SUPPLIER');
                      setIsMenuOpen(false);
                      setSectionConfirmation(lang === 'EN' ? 'Partner Portal' : lang === 'ES' ? 'Portal de Socios' : 'Portal de Parceiros');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'SUPPLIER' ? 'text-gold' : 'text-luxury-black/60'}`}>
                      {lang === 'EN' ? 'Become a Partner' : lang === 'ES' ? 'Ser Socio' : 'Ser Parceiro'}
                    </button>

                    <div className="h-[1px] w-full bg-black/5 my-2" />

                    <button onClick={() => { 
                      setViewMode('ADMIN'); 
                      setIsMenuOpen(false); 
                      setSectionConfirmation('Admin');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'ADMIN' ? 'text-gold' : 'text-luxury-black/60'}`}>
                      Admin
                    </button>
                    <button onClick={() => { 
                      setViewMode('CLIENT'); 
                      setShowMarketplace(false); 
                      setIsMenuOpen(false); 
                      setSectionConfirmation('Client');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'CLIENT' && !showMarketplace ? 'text-gold' : 'text-luxury-black/60'}`}>
                      Client
                    </button>
                    <button onClick={() => { 
                      window.history.pushState({}, '', '/supplier'); 
                      setViewMode('SUPPLIER'); 
                      setIsMenuOpen(false); 
                      setSectionConfirmation('Supplier');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'SUPPLIER' ? 'text-gold' : 'text-luxury-black/60'}`}>
                      Supplier
                    </button>
                    <button onClick={() => { 
                      setViewMode('PROVIDER'); 
                      setIsMenuOpen(false); 
                      setSectionConfirmation('Provider');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${viewMode === 'PROVIDER' ? 'text-gold' : 'text-luxury-black/60'}`}>
                      Provider
                    </button>

                    <div className="h-[1px] w-full bg-black/5 my-2" />

                    {user ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] opacity-40 lowercase">{user.name}</span>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left text-red-500 font-bold">
                          {lang === 'EN' ? 'Sign Out' : lang === 'ES' ? 'Cerrar Sesión' : 'Sair'}
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => {
                        setShowAuth(true);
                        setIsMenuOpen(false);
                      }} className="text-left hover:text-gold transition-colors">
                        {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Iniciar Sesión' : 'Entrar'}
                      </button>
                    )}
                    <a 
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-emerald-600 font-bold"
                    >
                      <MessageSquare size={20} />
                      WHATSAPP
                    </a>
                  </div>

                  <div className="mt-auto pt-8 border-t border-black/5 flex items-center justify-between">
                    <button 
                      onClick={() => {
                        if (lang === 'EN') setLang('ES');
                        else if (lang === 'ES') setLang('PT');
                        else setLang('EN');
                      }}
                      className="px-6 py-3 border border-black/10 rounded-xl font-bold"
                    >
                      LANGUAGE: {lang}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Main Content */}
          <main>
            {viewMode === 'CLIENT' && renderClientView()}
            {viewMode === 'ADMIN' && renderAdminView()}
            {viewMode === 'PROVIDER' && renderProviderView()}
            {viewMode === 'SUPPLIER' && renderSupplierView()}
          </main>
        </>
      )}

      {/* AI Concierge Drawer */}
      <LeadCaptureForm lang={lang} />
      <ChatDrawer 
        isOpen={chatOpen} 
        onClose={() => {
          setChatOpen(false);
          setChatPreload(null);
        }} 
        initialMessage={chatPreload}
        lang={lang}
        onPlanGenerated={setPlannedExperience}
      />

      {/* Speed Dial FAB */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isSpeedDialOpen && (
            <>
              {/* WhatsApp Sub-button */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => {
                  window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`, '_blank');
                  setIsSpeedDialOpen(false);
                }}
              >
                <span className="px-3 py-1.5 bg-luxury-black text-white text-[10px] font-sans font-semibold rounded-full shadow-xl uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  WhatsApp
                </span>
                <div className="w-12 h-12 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
              </motion.div>

              {/* AI Concierge Sub-button */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => {
                  setChatOpen(true);
                  setIsSpeedDialOpen(false);
                }}
              >
                <span className="px-3 py-1.5 bg-luxury-black text-white text-[10px] font-sans font-semibold rounded-full shadow-xl uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                  AI Concierge
                </span>
                <div className="w-12 h-12 bg-gold text-luxury-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Sparkles size={20} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
          className="w-16 h-16 bg-gold text-luxury-black rounded-full shadow-2xl flex items-center justify-center relative group"
        >
          <motion.div
            animate={{ rotate: isSpeedDialOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <MessageSquare className="group-hover:rotate-12 transition-transform" />
          </motion.div>
          
          {!isSpeedDialOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-luxury-black animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shrink-0">
                <span className="text-luxury-black font-bold text-sm">K</span>
              </div>
              <span className="font-serif text-xl tracking-wide uppercase">Karibbean Luxury Operators</span>
            </div>
            <p className="text-luxury-black/40 font-light max-w-sm leading-relaxed">
              {lang === 'EN' 
                ? "The world's first AI-driven marketplace for UHNWI. Redefining luxury through agential orchestration."
                : lang === 'ES'
                ? "El primer mercado del mundo impulsado por IA para UHNWI. Redefiniendo el lujo a través de la orquestación agéntica."
                : "O primeiro marketplace do mundo impulsionado por IA para UHNWI. Redefinindo o luxo através da orquestração agêntica."}
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">
              {lang === 'EN' ? 'Marketplace' : lang === 'ES' ? 'Mercado' : 'Mercado'}
            </h4>
            <ul className="space-y-4 text-sm text-luxury-black/40 font-light">
              <li><button onClick={() => setViewMode('CLIENT')} className="hover:text-gold">
                {lang === 'EN' ? 'Client Panel' : lang === 'ES' ? 'Panel de Cliente' : 'Painel do Cliente'}
              </button></li>
              <li><button onClick={() => setViewMode('ADMIN')} className="hover:text-gold">
                {lang === 'EN' ? 'Admin Portal' : lang === 'ES' ? 'Portal Admin' : 'Portal Admin'}
              </button></li>
              <li><button onClick={() => setViewMode('PROVIDER')} className="hover:text-gold">
                {lang === 'EN' ? 'Partner Portal' : lang === 'ES' ? 'Portal de Socios' : 'Portal de Parceiros'}
              </button></li>
              <li><button onClick={() => {
                window.history.pushState({}, '', '/supplier');
                setViewMode('SUPPLIER');
              }} className="hover:text-gold">
                {lang === 'EN' ? 'Supplier Portal' : lang === 'ES' ? 'Portal de Proveedores' : 'Portal do Fornecedor'}
              </button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">
              {lang === 'EN' ? 'Legal' : lang === 'ES' ? 'Legal' : 'Legal'}
            </h4>
            <ul className="space-y-4 text-sm text-luxury-black/40 font-light">
              <li><a href="#" className="hover:text-gold">
                {lang === 'EN' ? 'Privacy Policy' : lang === 'ES' ? 'Política de Privacidad' : 'Política de Privacidade'}
              </a></li>
              <li><a href="#" className="hover:text-gold">
                {lang === 'EN' ? 'Terms of Service' : lang === 'ES' ? 'Términos de Servicio' : 'Termos de Serviço'}
              </a></li>
              <li><a href="#" className="hover:text-gold">
                {lang === 'EN' ? 'GDPR Compliance' : lang === 'ES' ? 'Cumplimiento GDPR' : 'Conformidade GDPR'}
              </a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-sans text-luxury-black/20 uppercase tracking-tight">
            © 2026 Karibbean Luxury Operators. {lang === 'EN' ? 'All rights reserved.' : lang === 'ES' ? 'Todos los derechos reservados.' : 'Todos os direitos reservados.'}
          </span>
        </div>
      </footer>
    </div>
  );
}
