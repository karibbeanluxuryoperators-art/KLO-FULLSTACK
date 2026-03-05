import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, Ship, Home, Car, UserCheck, Shield, Sparkles, 
  MapPin, Calendar, Clock, ChevronRight, MessageSquare, 
  Send, Loader2, Menu, X, ArrowRight, Star, Quote,
  LayoutDashboard, Users, Briefcase, CreditCard, Settings,
  TrendingUp, Activity, Package, ExternalLink, Timer, AlertTriangle,
  Zap, DollarSign
} from 'lucide-react';
import { KLOBrain, KLOExperience } from './services/kloBrain';
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
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [plannedExperience, setPlannedExperience] = useState<KLOExperience | null>(null);
  const [activePillar, setActivePillar] = useState(0);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('OCC');
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [isMissionControl, setIsMissionControl] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [agentialRules, setAgentialRules] = useState<AgentialRule[]>(MOCK_RULES);
  const [guestProfiles, setGuestProfiles] = useState<GuestProfile[]>(MOCK_GUEST_PROFILES);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const brain = useRef<KLOBrain | null>(null);

  useEffect(() => {
    brain.current = new KLOBrain();
    // Initial greeting
    setChatHistory([{
      role: 'assistant',
      content: lang === 'EN' 
        ? 'Welcome to KLO. I am your Orchestration Core. How can I curate your next 360° ultra-luxury experience?'
        : lang === 'ES'
        ? 'Bienvenido a KLO. Soy su Núcleo de Orquestación. ¿Cómo puedo organizar su próxima experiencia de ultra-lujo 360°?'
        : 'Bem-vindo à KLO. Sou o seu Núcleo de Orquestração. Como posso organizar sua próxima experiência de ultra-luxo 360°?'
    }]);

    // Fetch Admin Stats if in admin mode and logged in
    if (viewMode === 'ADMIN' && user?.role === 'ADMIN') {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => setAdminStats(data));
    }
  }, [viewMode, lang, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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
    <div className="min-h-screen flex items-center justify-center bg-luxury-black px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src={LUXURY_IMAGES[4]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black via-transparent to-luxury-black" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 rounded-[40px] w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-luxury-black font-bold text-3xl">K</span>
          </div>
          <h2 className="text-3xl font-serif mb-2 uppercase tracking-widest">
            {lang === 'EN' ? 'Access KLO' : lang === 'ES' ? 'Acceder a KLO' : 'Acessar KLO'}
          </h2>
          <p className="text-luxury-cream/40 text-sm font-light">
            {lang === 'EN' 
              ? 'Enter your credentials to access the orchestration core' 
              : lang === 'ES' 
              ? 'Ingrese sus credenciales para acceder al núcleo de orquestación'
              : 'Insira suas credenciais para acessar o núcleo de orquestração'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold mb-2 block">
              {lang === 'EN' ? 'Email Address' : lang === 'ES' ? 'Correo Electrónico' : 'Endereço de E-mail'}
            </label>
            <input 
              type="email" 
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light"
              placeholder="admin@klo.com"
              required
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gold mb-2 block">
              {lang === 'EN' ? 'Password' : lang === 'ES' ? 'Contraseña' : 'Senha'}
            </label>
            <input 
              type="password" 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light"
              placeholder="••••••••"
              required
            />
          </div>
          {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-gold text-luxury-black rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all duration-300"
          >
            {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Iniciar Sesión' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-luxury-cream/20 uppercase tracking-widest">
            {lang === 'EN' ? 'Demo Credentials' : lang === 'ES' ? 'Credenciales de Demostración' : 'Credenciais de Demonstração'}:<br />
            admin@klo.com | provider@klo.com | client@klo.com
          </p>
        </div>
      </motion.div>
    </div>
  );

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !brain.current) return;

    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsPlanning(true);

    try {
      if (userMsg.toLowerCase().includes('plan') || userMsg.toLowerCase().includes('quiero') || userMsg.toLowerCase().includes('necesito')) {
        const plan = await brain.current.planExperience(userMsg, lang);
        setPlannedExperience(plan);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: lang === 'EN' 
            ? `I have orchestrated a bespoke 360° experience: "${plan.title}". Management fee of ${plan.managementFee} has been calculated to protect unit economics.`
            : lang === 'ES'
            ? `He orquestado una experiencia 360° a medida: "${plan.title}". Se ha calculado una tarifa de gestión de ${plan.managementFee} para proteger la economía de la unidad.`
            : `Orquestrei uma experiência 360° sob medida: "${plan.title}". A taxa de gerenciamento de ${plan.managementFee} foi calculada para proteger a economia da unidade.`
        }]);
      } else {
        const response = await brain.current.chat(userMsg, lang);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: response.text || (lang === 'EN' ? "I'm processing your request." : lang === 'ES' ? "Estoy procesando su solicitud." : "Estou processando sua solicitação.") 
        }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'EN' 
          ? "I apologize, but I encountered an error while orchestrating your request." 
          : lang === 'ES'
          ? "Lo siento, pero encontré un error al orquestar su solicitud."
          : "Sinto muito, mas encontrei um erro ao orquestrar sua solicitação."
      }]);
    } finally {
      setIsPlanning(false);
    }
  };

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
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: lang === 'EN'
            ? `Payment tokenized successfully via Stripe. Your CGP (Central Guest Profile) has been updated. Status: ${data.status}`
            : lang === 'ES'
            ? `Pago tokenizado con éxito a través de Stripe. Su CGP (Perfil Central del Huésped) ha sido actualizado. Estado: ${data.status}`
            : `Pagamento tokenizado com sucesso via Stripe. Seu CGP (Perfil Central do Hóspede) foi atualizado. Status: ${data.status}`
        }]);
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
          onBookAssets={(selectedAssets) => {
            setChatOpen(true);
            const assetNames = selectedAssets.map(a => a.name).join(', ');
            const locations = [...new Set(selectedAssets.map(a => a.location))].join(' & ');
            setMessage(lang === 'EN' 
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

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold uppercase tracking-[0.5em] text-xs mb-6 block">
              {lang === 'EN' ? 'Tech-Enabled Lifestyle Brokerage' : lang === 'ES' ? 'Corretaje de Estilo de Vida Basado en Tecnología' : 'Corretagem de Estilo de Vida Baseada em Tecnologia'}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight uppercase">
              Karibbean Luxury <br />
              <span className="italic font-light">Operators</span>
            </h1>
            <p className="text-luxury-cream/60 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              {lang === 'EN' 
                ? 'Agential AI Middleware for UHNWI. Zero friction journeys across Aviation, Maritime, Stay, and Ground.'
                : lang === 'ES'
                ? 'Middleware de IA Agéntica para UHNWI. Viajes sin fricción a través de Aviación, Marítimo, Estancia y Tierra.'
                : 'Middleware de IA Agêntica para UHNWI. Viagens sem fricção através de Aviação, Marítimo, Estadia e Terra.'}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
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
                <span className="text-gold uppercase tracking-widest text-xs mb-2 block">
                  {lang === 'EN' ? 'Central Guest Profile' : lang === 'ES' ? 'Perfil Central del Huésped' : 'Perfil Central do Hóspede'}: UHNWI_001
                </span>
                <h2 className="text-4xl md:text-5xl font-serif">{plannedExperience.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-luxury-cream/40 text-sm block mb-1">
                  {lang === 'EN' ? 'Total Investment' : lang === 'ES' ? 'Inversión Total' : 'Investimento Total'} (incl. {plannedExperience.managementFee} {lang === 'EN' ? 'fee' : lang === 'ES' ? 'tarifa' : 'taxa'})
                </span>
                <span className="text-3xl font-light text-gold">{plannedExperience.estimatedTotal}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(plannedExperience.pillars).map(([key, value]) => {
                  const pillarInfo = PILLARS.find(p => p.id === key.toUpperCase());
                  if (!value) return null;
                  return (
                    <motion.div key={key} whileHover={{ y: -5 }} className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {pillarInfo && <pillarInfo.icon size={80} />}
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl bg-white/5 ${pillarInfo?.color}`}>
                          {pillarInfo && <pillarInfo.icon size={24} />}
                        </div>
                        <h3 className="text-xl font-serif capitalize">
                          {lang === 'EN' ? key : lang === 'ES' ? (key === 'stay' ? 'estancia' : key === 'ground' ? 'tierra' : key) : (key === 'stay' ? 'estadia' : key === 'ground' ? 'terra' : key)}
                        </h3>
                      </div>
                      <p className="text-luxury-cream/70 font-light leading-relaxed">{value}</p>
                    </motion.div>
                  );
                })}
                
                {/* Legal & Security */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-3xl border-gold/20">
                    <h3 className="text-xl font-serif mb-4 flex items-center gap-3">
                      <Shield size={20} className="text-gold" /> {lang === 'EN' ? 'Security Brief' : 'Resumen de Seguridad'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest">Level</span>
                        <span className="text-xs font-bold text-gold">{plannedExperience.securityBrief.level}</span>
                      </div>
                      <p className="text-xs text-luxury-cream/60 italic leading-relaxed">
                        "{plannedExperience.securityBrief.riskAssessment}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plannedExperience.securityBrief.protocols.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[8px] uppercase tracking-widest border border-white/10">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl border-white/10">
                    <h3 className="text-xl font-serif mb-4 flex items-center gap-3">
                      <UserCheck size={20} className="text-gold" /> {lang === 'EN' ? 'Compliance' : 'Cumplimiento'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {plannedExperience.legalRequirements.map((req, i) => (
                        <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-xs font-light border border-white/10">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-3xl">
                <h3 className="text-xl font-serif mb-8 flex items-center gap-3">
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
                          <span className="text-xs text-gold font-mono uppercase tracking-widest block mb-1">{item.time}</span>
                          <span className="text-[8px] text-emerald-400 font-mono">TTE: {item.tte}</span>
                        </div>
                        <span className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          item.status === 'Auto-Scheduled' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-gold/10 text-gold'
                        }`}>
                          {lang === 'EN' ? item.status : lang === 'ES' ? (item.status === 'Auto-Scheduled' ? 'Auto-Programado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendiente') : (item.status === 'Auto-Scheduled' ? 'Auto-Agendado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendente')}
                        </span>
                      </div>
                      <p className="text-sm font-light text-luxury-cream/90">{item.activity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-luxury-cream/30 uppercase tracking-tighter">{item.pillar}</span>
                        <span className="text-[10px] text-luxury-cream/20">•</span>
                        <span className="text-[10px] text-luxury-cream/30 uppercase tracking-tighter">{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full mt-10 py-4 bg-white text-luxury-black rounded-full font-medium hover:bg-gold transition-colors flex items-center justify-center gap-3"
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                  {lang === 'EN' ? 'Confirm Invisible Payment' : lang === 'ES' ? 'Confirmar Pago Invisible' : 'Confirmar Pagamento Invisível'}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
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
    ];

    return (
      <div className={`pt-20 flex min-h-screen ${isMissionControl ? 'bg-luxury-black' : ''}`}>
        {/* Admin Sidebar */}
        {!isMissionControl && (
          <aside className="w-64 border-r border-white/5 bg-luxury-slate/50 backdrop-blur-md hidden lg:block">
            <div className="p-8">
              <div className="space-y-2">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setAdminActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      adminActiveTab === tab.id ? 'bg-gold text-luxury-black font-bold' : 'text-luxury-cream/40 hover:bg-white/5'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/5">
                <button 
                  onClick={() => setIsMissionControl(true)}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <Zap size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
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
            <div className="fixed inset-0 z-[200] bg-luxury-black p-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-red-500/10 text-red-500 rounded-3xl border border-red-500/20">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-serif text-white uppercase tracking-tighter">
                      {lang === 'EN' ? 'Mission Control Mode' : lang === 'ES' ? 'Modo Control de Misión' : 'Modo Controle de Missão'}
                    </h2>
                    <p className="text-red-500/60 font-mono text-xs uppercase tracking-[0.5em]">
                      {lang === 'EN' ? 'High-Density Orchestration Active' : lang === 'ES' ? 'Orquestación de Alta Densidad Activa' : 'Orquestração de Alta Densidade Ativa'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMissionControl(false)}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold"
                >
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
                  onAddAsset={(newAsset) => setAssets(prev => [newAsset, ...prev])}
                />
              )}
              
              {adminActiveTab === 'Clients' && (
                <ClientManagement 
                  clients={guestProfiles} 
                  lang={lang} 
                  onAddClient={(newClient) => setGuestProfiles(prev => [newClient, ...prev])}
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
      <AssetManagement assets={MOCK_ASSETS.filter(a => a.providerId === 'P1')} lang={lang} />
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-black selection:bg-gold/30">
      {!user ? renderAuth() : (
        <>
          {/* Navigation */}
          <nav className="fixed top-0 w-full z-50 glass-panel border-none bg-black/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
                  <span className="text-luxury-black font-bold text-xl">K</span>
                </div>
                <span className="font-serif text-xl md:text-2xl tracking-widest uppercase font-light">
                  <span className="hidden lg:inline">Karibbean Luxury Operators</span>
                  <span className="lg:hidden">KLO</span>
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-light">
                {user.role === 'ADMIN' && (
                  <button onClick={() => setViewMode('ADMIN')} className={`hover:text-gold transition-colors ${viewMode === 'ADMIN' ? 'text-gold' : ''}`}>
                    {lang === 'EN' ? 'Admin Portal' : lang === 'ES' ? 'Portal Admin' : 'Portal Admin'}
                  </button>
                )}
                {user.role === 'PROVIDER' && (
                  <button onClick={() => setViewMode('PROVIDER')} className={`hover:text-gold transition-colors ${viewMode === 'PROVIDER' ? 'text-gold' : ''}`}>
                    {lang === 'EN' ? 'Provider Portal' : lang === 'ES' ? 'Portal Proveedor' : 'Portal do Provedor'}
                  </button>
                )}
                <button onClick={() => {
                  setViewMode('CLIENT');
                  setShowMarketplace(false);
                }} className={`hover:text-gold transition-colors ${viewMode === 'CLIENT' && !showMarketplace ? 'text-gold' : ''}`}>
                  {lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge'}
                </button>
                <button onClick={() => {
                  setViewMode('CLIENT');
                  setShowMarketplace(true);
                }} className={`hover:text-gold transition-colors ${viewMode === 'CLIENT' && showMarketplace ? 'text-gold' : ''}`}>
                  {lang === 'EN' ? 'Marketplace' : lang === 'ES' ? 'Mercado' : 'Mercado'}
                </button>
                
                <div className="w-[1px] h-4 bg-white/20 mx-2" />
                <button 
                  onClick={() => {
                    if (lang === 'EN') setLang('ES');
                    else if (lang === 'ES') setLang('PT');
                    else setLang('EN');
                  }}
                  className="px-3 py-1 border border-white/10 rounded-md hover:border-gold/50 transition-colors text-[10px] font-bold"
                >
                  {lang}
                </button>
                <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
                  {lang === 'EN' ? 'Sign Out' : lang === 'ES' ? 'Cerrar Sesión' : 'Sair'}
                </button>
                <button onClick={() => setChatOpen(true)} className="px-6 py-2 border border-gold/50 rounded-full hover:bg-gold hover:text-luxury-black transition-all duration-300">
                  {lang === 'EN' ? 'Concierge' : lang === 'ES' ? 'Conserje' : 'Concierge'}
                </button>
              </div>

              <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            {viewMode === 'CLIENT' && renderClientView()}
            {viewMode === 'ADMIN' && renderAdminView()}
            {viewMode === 'PROVIDER' && renderProviderView()}
          </main>
        </>
      )}

      {/* AI Concierge Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setChatOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-slate z-[70] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-luxury-black">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl uppercase tracking-wider">Karibbean Luxury Operators</h3>
                    <span className="text-[10px] text-gold uppercase tracking-[0.2em]">
                      {lang === 'EN' ? 'Agentic Middleware' : lang === 'ES' ? 'Middleware Agéntico' : 'Middleware Agêntico'}
                    </span>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-light leading-relaxed ${
                      msg.role === 'user' ? 'bg-gold text-luxury-black rounded-tr-none' : 'glass-panel rounded-tl-none'
                    }`}>{msg.content}</div>
                  </div>
                ))}
                {isPlanning && (
                  <div className="flex justify-start">
                    <div className="glass-panel p-5 rounded-3xl rounded-tl-none flex items-center gap-3">
                      <Loader2 size={16} className="animate-spin text-gold" />
                      <span className="text-xs text-luxury-cream/50 italic">
                        {lang === 'EN' ? 'Orchestrating 360° pillars...' : lang === 'ES' ? 'Orquestando pilares 360°...' : 'Orquestrando pilares 360°...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-8 border-t border-white/10">
                <div className="relative">
                  <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder={lang === 'EN' ? 'Plan a 360° experience...' : lang === 'ES' ? 'Planifica una experiencia 360°...' : 'Planeje uma experiência 360°...'} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-gold/50 transition-colors font-light" 
                  />
                  <button type="submit" disabled={isPlanning} className="absolute right-2 top-2 bottom-2 w-10 bg-gold text-luxury-black rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"><Send size={18} /></button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      {!chatOpen && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-gold text-luxury-black rounded-full shadow-2xl flex items-center justify-center z-50 group">
          <MessageSquare className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-luxury-black animate-pulse" />
        </motion.button>
      )}

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center shrink-0">
                <span className="text-luxury-black font-bold text-sm">K</span>
              </div>
              <span className="font-serif text-xl tracking-widest uppercase">Karibbean Luxury Operators</span>
            </div>
            <p className="text-luxury-cream/40 font-light max-w-sm leading-relaxed">
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
            <ul className="space-y-4 text-sm text-luxury-cream/40 font-light">
              <li><button onClick={() => setViewMode('CLIENT')} className="hover:text-gold">
                {lang === 'EN' ? 'Client Panel' : lang === 'ES' ? 'Panel de Cliente' : 'Painel do Cliente'}
              </button></li>
              <li><button onClick={() => setViewMode('ADMIN')} className="hover:text-gold">
                {lang === 'EN' ? 'Admin Portal' : lang === 'ES' ? 'Portal Admin' : 'Portal Admin'}
              </button></li>
              <li><button onClick={() => setViewMode('PROVIDER')} className="hover:text-gold">
                {lang === 'EN' ? 'Partner Portal' : lang === 'ES' ? 'Portal de Socios' : 'Portal de Parceiros'}
              </button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6">
              {lang === 'EN' ? 'Legal' : lang === 'ES' ? 'Legal' : 'Legal'}
            </h4>
            <ul className="space-y-4 text-sm text-luxury-cream/40 font-light">
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
          <span className="text-xs text-luxury-cream/20 uppercase tracking-widest">
            © 2026 Karibbean Luxury Operators. {lang === 'EN' ? 'All rights reserved.' : lang === 'ES' ? 'Todos los derechos reservados.' : 'Todos os direitos reservados.'}
          </span>
        </div>
      </footer>
    </div>
  );
}
