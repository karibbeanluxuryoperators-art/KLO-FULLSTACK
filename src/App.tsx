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
import { PartnersPage } from './components/PartnersPage';
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
    contactName: 'Marco Rossi',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
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
    contactName: 'Elena Vance',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S3',
    name: 'Sofia Martinez',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'St. Maarten',
    providerId: 'P1',
    pricePerUnit: '$650/day',
    capacity: 1,
    role: 'CONCIERGE',
    rating: 4.9,
    languages: ['EN', 'ES', 'FR'],
    description: 'Chief Stewardess with a background in 5-star hospitality. Expert in event coordination and guest relations.',
    contactName: 'Sofia Martinez',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S4',
    name: 'Jack Thorne',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Panama City',
    providerId: 'P1',
    pricePerUnit: '$1,500/day',
    capacity: 1,
    role: 'SECURITY',
    rating: 5.0,
    languages: ['EN', 'RU'],
    description: 'Former elite special forces. Specialized in close protection and secure logistics for high-profile individuals.',
    contactName: 'Jack Thorne',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S5',
    name: 'Yuki Tanaka',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Anguilla',
    providerId: 'P1',
    pricePerUnit: '$500/session',
    capacity: 1,
    role: 'CONCIERGE',
    rating: 4.8,
    languages: ['EN', 'JP'],
    description: 'Licensed wellness therapist specializing in traditional Japanese massage and holistic healing.',
    contactName: 'Yuki Tanaka',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S6',
    name: 'Andre Dubois',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'St. Barths',
    providerId: 'P1',
    pricePerUnit: '$750/day',
    capacity: 1,
    role: 'CHEF',
    rating: 4.9,
    languages: ['EN', 'FR'],
    description: 'Award-winning mixologist and culinary artist. Expert in crafting bespoke cocktails and gourmet appetizers.',
    contactName: 'Andre Dubois',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S7',
    name: 'Isabella Rossi',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Cartagena',
    providerId: 'P1',
    pricePerUnit: '$600/day',
    capacity: 1,
    role: 'CONCIERGE',
    rating: 5.0,
    languages: ['EN', 'IT', 'ES'],
    description: 'Personal concierge with deep local knowledge of the Caribbean\'s most exclusive venues.',
    contactName: 'Isabella Rossi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S8',
    name: 'Carlos Mendez',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Roatan',
    providerId: 'P1',
    pricePerUnit: '$450/day',
    capacity: 1,
    role: 'CAPTAIN',
    rating: 4.7,
    languages: ['EN', 'ES'],
    description: 'Certified PADI Dive Master and maritime navigator. Expert in underwater exploration and marine safety.',
    contactName: 'Carlos Mendez',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S9',
    name: 'Emma Wilson',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Turks & Caicos',
    providerId: 'P1',
    pricePerUnit: '$400/day',
    capacity: 1,
    role: 'CONCIERGE',
    rating: 4.9,
    languages: ['EN', 'DE'],
    description: 'Professional childcare specialist with experience in high-net-worth households. CPR and First Aid certified.',
    contactName: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S10',
    name: 'Sarah Jenkins',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Antigua',
    providerId: 'P1',
    pricePerUnit: '$350/session',
    capacity: 1,
    role: 'CONCIERGE',
    rating: 4.8,
    languages: ['EN'],
    description: 'Yoga and Pilates instructor specializing in private sessions for relaxation and core strength.',
    contactName: 'Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'S11',
    name: 'James Harrington',
    type: 'STAFF',
    status: 'AVAILABLE',
    location: 'Barbados',
    providerId: 'P1',
    pricePerUnit: '$1,200/day',
    capacity: 1,
    role: 'BUTLER',
    rating: 5.0,
    languages: ['EN'],
    description: 'Traditional British butler with over 15 years of experience in royal and high-profile estates.',
    contactName: 'James Harrington',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
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
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A2',
    name: 'Bombardier Global 7500',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'New York',
    providerId: 'P2',
    pricePerUnit: '$9,200/hr',
    capacity: 19,
    model: 'Global 7500',
    range: '7,700nm',
    tailNumber: 'N750GL',
    description: 'The largest and longest-range business jet. Featuring four true living spaces and a full-size kitchen.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A3',
    name: 'Embraer Lineage 1000E',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'London',
    providerId: 'P2',
    pricePerUnit: '$11,000/hr',
    capacity: 19,
    model: 'Lineage 1000E',
    range: '4,600nm',
    tailNumber: 'N1000E',
    description: 'An ultra-large business jet with five cabin zones, including a master suite with a queen-size bed and walk-in shower.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A4',
    name: 'Dassault Falcon 8X',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Paris',
    providerId: 'P2',
    pricePerUnit: '$7,800/hr',
    capacity: 14,
    model: 'Falcon 8X',
    range: '6,450nm',
    tailNumber: 'N8XFAL',
    description: 'The flagship of the Falcon family. Exceptional short-field performance and ultra-quiet cabin.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A5',
    name: 'Cessna Citation Longitude',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Miami',
    providerId: 'P2',
    pricePerUnit: '$5,500/hr',
    capacity: 12,
    model: 'Longitude',
    range: '3,500nm',
    tailNumber: 'N350CL',
    description: 'The quietest cabin in its class. Perfect for transcontinental missions with superior comfort.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A6',
    name: 'Airbus ACJ319neo',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Dubai',
    providerId: 'P2',
    pricePerUnit: '$15,000/hr',
    capacity: 19,
    model: 'ACJ319neo',
    range: '6,750nm',
    tailNumber: 'N319AC',
    description: 'A corporate version of the A319neo. Offering the widest and tallest cabin of any business jet.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A7',
    name: 'Boeing BBJ 737 MAX',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Singapore',
    providerId: 'P2',
    pricePerUnit: '$18,000/hr',
    capacity: 19,
    model: 'BBJ 737-8',
    range: '6,600nm',
    tailNumber: 'N737BB',
    description: 'The ultimate in space and luxury. A flying palace with a master bedroom, dining room, and lounge.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1559627814-4d0c75748d2b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A8',
    name: 'Bell 429 GlobalRanger',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'St. Barths',
    providerId: 'P2',
    pricePerUnit: '$3,500/hr',
    capacity: 7,
    model: 'Bell 429',
    range: '411nm',
    tailNumber: 'N429BR',
    description: 'The most advanced light twin-engine helicopter. Perfect for island hopping in style.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A9',
    name: 'Sikorsky S-76D',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Miami',
    providerId: 'P2',
    pricePerUnit: '$4,500/hr',
    capacity: 8,
    model: 'S-76D',
    range: '441nm',
    tailNumber: 'N76DSK',
    description: 'The standard for executive helicopter transport. Smooth, quiet, and exceptionally safe.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'A10',
    name: 'Pilatus PC-24',
    type: 'AIRCRAFT',
    status: 'AVAILABLE',
    location: 'Aspen',
    providerId: 'P2',
    pricePerUnit: '$4,200/hr',
    capacity: 10,
    model: 'PC-24',
    range: '2,000nm',
    tailNumber: 'N24PC',
    description: 'The world\'s first Super Versatile Jet. Capable of landing on short and even unpaved runways.',
    contactName: 'Aviation Ops Team',
    image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&q=80&w=800'
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
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V2',
    name: 'Azure Sky',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Monaco',
    providerId: 'P3',
    pricePerUnit: '$25,000/day',
    capacity: 12,
    length: '180ft',
    crewCount: 12,
    vesselType: 'YACHT',
    description: 'A stunning superyacht with a helipad, cinema, and a full spa. The ultimate Mediterranean experience.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V3',
    name: 'Ocean Pearl',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'British Virgin Islands',
    providerId: 'P3',
    pricePerUnit: '$4,500/day',
    capacity: 10,
    length: '65ft',
    crewCount: 4,
    vesselType: 'CATAMARAN',
    description: 'A spacious and stable luxury catamaran. Perfect for exploring the shallow waters of the BVI.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V4',
    name: 'Midnight Sun',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'St. Tropez',
    providerId: 'P3',
    pricePerUnit: '$2,800/day',
    capacity: 8,
    length: '45ft',
    crewCount: 2,
    vesselType: 'SPEEDBOAT',
    description: 'A sleek and powerful day cruiser. Ideal for quick trips to beach clubs and coastal exploration.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1544413647-ad67cd76709b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V5',
    name: 'Golden Horizon',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Grenadines',
    providerId: 'P3',
    pricePerUnit: '$8,500/day',
    capacity: 10,
    length: '120ft',
    crewCount: 6,
    vesselType: 'YACHT',
    description: 'A classic motor yacht with timeless elegance. Features a large sun deck and premium water toys.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V6',
    name: 'Silver Wave',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Ibiza',
    providerId: 'P3',
    pricePerUnit: '$6,200/day',
    capacity: 12,
    length: '90ft',
    crewCount: 5,
    vesselType: 'YACHT',
    description: 'Modern design meets high performance. A favorite for sunset cruises and island hopping in the Balearics.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V7',
    name: 'Emerald Sea',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Exumas',
    providerId: 'P3',
    pricePerUnit: '$12,000/day',
    capacity: 10,
    length: '140ft',
    crewCount: 8,
    vesselType: 'YACHT',
    description: 'An explorer yacht built for adventure. Equipped with a deep-sea submersible and long-range capabilities.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1563299208-f3d36f7e8c33?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V8',
    name: 'Crystal Water',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Seychelles',
    providerId: 'P3',
    pricePerUnit: '$5,200/day',
    capacity: 8,
    length: '55ft',
    crewCount: 3,
    vesselType: 'CATAMARAN',
    description: 'Eco-friendly luxury catamaran with solar power. Experience the pristine waters of the Seychelles in silence.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V9',
    name: 'Royal Voyager',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Caribbean',
    providerId: 'P3',
    pricePerUnit: '$45,000/day',
    capacity: 12,
    length: '210ft',
    crewCount: 15,
    vesselType: 'YACHT',
    description: 'One of the world\'s most exclusive superyachts. Features a glass-bottom pool and a private owner\'s deck.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'V10',
    name: 'Island Hopper',
    type: 'VESSEL',
    status: 'AVAILABLE',
    location: 'Nassau',
    providerId: 'P3',
    pricePerUnit: '$1,500/day',
    capacity: 6,
    length: '38ft',
    crewCount: 1,
    vesselType: 'SPEEDBOAT',
    description: 'Fast and agile day boat. Perfect for fishing trips or exploring hidden coves.',
    contactName: 'Maritime Concierge',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800'
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
    contactName: 'Vianco Security',
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C2',
    name: 'Rolls-Royce Phantom VIII',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'London',
    providerId: 'P4',
    pricePerUnit: '$2,500/day',
    capacity: 4,
    model: 'Phantom VIII',
    isArmored: false,
    description: 'The quietest motor car in the world. Experience the ultimate in luxury and presence.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1631214524020-5e1839765c71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C3',
    name: 'Bentley Mulsanne',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Miami',
    providerId: 'P4',
    pricePerUnit: '$1,800/day',
    capacity: 4,
    model: 'Mulsanne Speed',
    isArmored: false,
    description: 'A fusion of performance and luxury. Handcrafted in Crewe, England.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C4',
    name: 'Mercedes-Maybach S-Class',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Berlin',
    providerId: 'P4',
    pricePerUnit: '$1,200/day',
    capacity: 4,
    model: 'S680',
    isArmored: true,
    description: 'The pinnacle of the S-Class. Features VR10 level ballistic protection and a V12 engine.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C5',
    name: 'Range Rover Autobiography',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Mexico City',
    providerId: 'P4',
    pricePerUnit: '$1,100/day',
    capacity: 4,
    model: 'Autobiography LWB',
    isArmored: true,
    description: 'Luxury meets security. B6 armored protection with the comfort of a long-wheelbase Range Rover.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C6',
    name: 'Lamborghini Urus',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Dubai',
    providerId: 'P4',
    pricePerUnit: '$1,500/day',
    capacity: 4,
    model: 'Urus Performante',
    isArmored: false,
    description: 'The world\'s first Super SUV. Unmatched performance and aggressive styling.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C7',
    name: 'Ferrari Purosangue',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Milan',
    providerId: 'P4',
    pricePerUnit: '$2,200/day',
    capacity: 4,
    model: 'Purosangue V12',
    isArmored: false,
    description: 'Ferrari\'s first four-door, four-seater. A true sports car with the versatility of an SUV.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C8',
    name: 'Porsche Taycan Turbo S',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Los Angeles',
    providerId: 'P4',
    pricePerUnit: '$900/day',
    capacity: 4,
    model: 'Taycan Turbo S',
    isArmored: false,
    description: 'The soul of a Porsche, powered by electricity. Breathtaking acceleration and handling.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C9',
    name: 'BMW i7 Protection',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Geneva',
    providerId: 'P4',
    pricePerUnit: '$1,400/day',
    capacity: 4,
    model: 'i7 xDrive60 Protection',
    isArmored: true,
    description: 'The first all-electric protection sedan. VR9 level security with zero emissions.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'C10',
    name: 'Audi A8 L Security',
    type: 'VEHICLE',
    status: 'AVAILABLE',
    location: 'Vienna',
    providerId: 'P4',
    pricePerUnit: '$1,300/day',
    capacity: 4,
    model: 'A8 L Security',
    isArmored: true,
    description: 'Understated luxury with maximum protection. Certified to VR9 ballistic standards.',
    contactName: 'Vianco VIP',
    image: 'https://images.unsplash.com/photo-1606152421643-059966107386?auto=format&fit=crop&q=80&w=800'
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
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L2',
    name: 'Azure Penthouse',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Miami',
    providerId: 'P5',
    pricePerUnit: '$3,200/nt',
    capacity: 6,
    rooms: 3,
    amenities: ['Roof Pool', 'Ocean View', 'Private Elevator'],
    description: 'A stunning penthouse in the heart of Miami Beach with panoramic ocean views and ultra-modern finishes.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L3',
    name: 'Emerald Mansion',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'St. Barths',
    providerId: 'P5',
    pricePerUnit: '$12,000/nt',
    capacity: 12,
    rooms: 6,
    amenities: ['Helipad', 'Private Dock', 'Wine Cellar'],
    description: 'An ultra-exclusive mansion on the heights of St. Barths overlooking the crystal clear waters of the Caribbean.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L4',
    name: 'Sapphire Retreat',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Turks & Caicos',
    providerId: 'P5',
    pricePerUnit: '$7,500/nt',
    capacity: 8,
    rooms: 4,
    amenities: ['Private Chef', 'Beachfront', 'Spa'],
    description: 'A serene beachfront villa in Grace Bay, offering ultimate relaxation and luxury with direct beach access.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L5',
    name: 'Diamond Sky Penthouse',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Dubai',
    providerId: 'P5',
    pricePerUnit: '$5,000/nt',
    capacity: 4,
    rooms: 2,
    amenities: ['Butler Service', 'Sky Garden', 'Smart Home'],
    description: 'A futuristic penthouse in Dubai Marina with breathtaking views of the Palm Jumeirah and the Arabian Gulf.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L6',
    name: 'Coral Reef Estate',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Bahamas',
    providerId: 'P5',
    pricePerUnit: '$9,000/nt',
    capacity: 14,
    rooms: 7,
    amenities: ['Private Island Access', 'Cinema', 'Tennis Court'],
    description: 'A sprawling estate in the Exumas with direct access to a private coral reef and pristine white sand beaches.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L7',
    name: 'Pearl Waterfront Mansion',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Monaco',
    providerId: 'P5',
    pricePerUnit: '$15,000/nt',
    capacity: 10,
    rooms: 5,
    amenities: ['Yacht Mooring', 'Security Team', 'Infinity Pool'],
    description: 'A prestigious waterfront mansion in Monaco, offering unparalleled views and absolute privacy for the world\'s elite.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L8',
    name: 'Azure Bay Villa',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Ibiza',
    providerId: 'P5',
    pricePerUnit: '$6,800/nt',
    capacity: 10,
    rooms: 5,
    amenities: ['DJ Booth', 'Sunset View', 'Outdoor Kitchen'],
    description: 'A modern villa in Ibiza with stunning sunset views over the Mediterranean and state-of-the-art entertainment systems.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'L9',
    name: 'Ocean Mist Penthouse',
    type: 'LODGING',
    status: 'AVAILABLE',
    location: 'Rio de Janeiro',
    providerId: 'P5',
    pricePerUnit: '$2,500/nt',
    capacity: 6,
    rooms: 3,
    amenities: ['Copacabana View', 'Sauna', 'Concierge'],
    description: 'A luxurious penthouse overlooking Copacabana beach, blending modern comfort with iconic Carioca style.',
    contactName: 'Estate Manager',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
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
  const [showPartners, setShowPartners] = useState(false);
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
        className="bg-[#111109] border border-white/[0.07] rounded-xl p-12 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-luxury-black font-bold text-3xl">K</span>
          </div>
          <h2 className="text-2xl font-sans font-medium mb-2 tracking-tight">
            {lang === 'EN' ? 'Access KLO' : lang === 'ES' ? 'Acceder a KLO' : 'Acessar KLO'}
          </h2>
          <p className="text-white/40 text-sm font-light">
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light text-white"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-colors font-light text-white"
              placeholder="••••••••"
              required
            />
          </div>
          {authError && <p className="text-red-400 text-xs text-center">{authError}</p>}
          <button 
            type="submit"
            className="w-full py-4 bg-gold text-luxury-black rounded-xl font-medium text-xs tracking-wide hover:bg-white transition-all duration-300"
          >
            {lang === 'EN' ? 'Sign In' : lang === 'ES' ? 'Iniciar Sesión' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-sans uppercase tracking-tight text-white/40">
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
    if (showPartners) {
      return (
        <PartnersPage 
          lang={lang}
          onApply={() => {
            setShowPartners(false);
            window.history.pushState({}, '', '/supplier');
            setViewMode('SUPPLIER');
          }}
          onBack={() => setShowPartners(false)}
        />
      );
    }

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
                ? "Cartagena's most exclusive travel experience. Private aviation, superyachts, and ultra-luxury villas — curated for those who accept nothing less."
                : lang === 'ES'
                ? "La experiencia de viaje más exclusiva de Cartagena. Aviación privada, superyates y villas de ultra-lujo — para quienes no aceptan nada menos que lo mejor."
                : "A experiência de viagem mais exclusiva de Cartagena. Aviação privada, superates e vilas de ultra-luxo — para quem não aceita nada menos que o melhor."}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 px-4">
              <button 
                onClick={() => setChatOpen(true)}
                className="group px-10 py-4 bg-gold text-luxury-black rounded-xl font-medium text-xs tracking-wide flex items-center gap-3 hover:bg-white transition-all duration-300"
              >
                {lang === 'EN' ? 'Curate My Journey' : lang === 'ES' ? 'Organizar mi Viaje' : 'Curar Minha Jornada'} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowMarketplace(true)}
                className="px-10 py-4 border border-white/20 rounded-xl font-medium text-xs tracking-wide hover:bg-white/5 transition-all text-white"
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
              { 
                label: lang === 'EN' ? "Cartagena, Colombia" : lang === 'ES' ? "Cartagena, Colombia" : "Cartagena, Colômbia", 
                icon: MapPin 
              },
              { 
                label: lang === 'EN' ? "Every asset personally vetted" : lang === 'ES' ? "Cada activo verificado personalmente" : "Cada ativo verificado pessoalmente", 
                icon: Shield 
              },
              { 
                label: "Air · Sea · Stay · Ground · Staff", 
                icon: LayoutDashboard 
              },
              { 
                label: lang === 'EN' ? "By invitation only" : lang === 'ES' ? "Solo por invitación" : "Somente por convite", 
                icon: Star 
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111109] border border-white/[0.07] rounded-xl p-8 text-center hover:border-gold/30 transition-all group"
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
                title: lang === 'EN' ? 'Absolute discretion' : lang === 'ES' ? 'Discreción absoluta' : 'Discrição absoluta',
                desc: lang === 'EN' 
                  ? 'Every asset physically verified by our security team. Ex-military intelligence protocols. Your privacy is non-negotiable.'
                  : lang === 'ES'
                  ? 'Cada activo verificado físicamente por nuestro equipo de seguridad. Protocolos de inteligencia ex-militar. Su privacidad no es negociable.'
                  : 'Cada ativo verificado fisicamente por nossa equipe de segurança. Protocolos de inteligência ex-militar. Sua privacidade é inegociável.'
              },
              {
                icon: Zap,
                title: lang === 'EN' ? 'Your journey, orchestrated' : lang === 'ES' ? 'Su viaje, orquestado' : 'Sua jornada, orquestrada',
                desc: lang === 'EN'
                  ? 'Tell us what you have in mind. Our concierge team — backed by AI — assembles your complete Cartagena itinerary and presents it for your approval. One conversation is all it takes.'
                  : lang === 'ES'
                  ? 'Cuéntenos qué tiene en mente. Nuestro equipo de conserjería, respaldado por IA, organiza su itinerario completo en Cartagena y se lo presenta para su aprobación. Una conversación es todo lo que se necesita.'
                  : 'Conte-nos o que você tem em mente. Nossa equipe de concierge — apoiada por IA — monta seu itinerário completo em Cartagena e o apresenta para sua aprovação. Uma conversa é tudo o que basta.'
              },
              {
                icon: Users,
                title: lang === 'EN' ? 'White-glove from first contact' : lang === 'ES' ? 'Guante blanco desde el primer contacto' : 'Luva branca desde o primeiro contato',
                desc: lang === 'EN'
                  ? 'From your first message to your final transfer, a dedicated KLO concierge manages every detail. No call centres. No waiting. No exceptions.'
                  : lang === 'ES'
                  ? 'Desde su primer mensaje hasta su traslado final, un conserje dedicado de KLO gestiona cada detalle. Sin centros de llamadas. Sin esperas. Sin excepciones.'
                  : 'Luva branca desde o primeiro contato. Desde a sua primeira mensagem até a sua transferência final, um concierge dedicado da KLO gerencia cada detalhe. Sem centros de chamadas. Sem espera. Sem exceções.'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx === 0 ? -50 : idx === 2 ? 50 : 0, y: idx === 1 ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className="bg-[#111109] border border-white/[0.07] rounded-xl p-10 hover:border-gold/20 transition-all"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-8">
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
                    <motion.div key={key} whileHover={{ y: -5 }} className="bg-[#111109] border border-white/[0.07] rounded-xl p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {pillarInfo && <pillarInfo.icon size={80} />}
                      </div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-lg bg-white/5 ${pillarInfo?.color}`}>
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
                  <div className="bg-[#111109] border border-gold/20 rounded-xl p-8">
                    <h3 className="text-lg font-sans font-medium mb-4 flex items-center gap-3">
                      <Shield size={20} className="text-gold" /> {lang === 'EN' ? 'Security Brief' : 'Resumen de Seguridad'}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-sans uppercase tracking-tight text-white/40 font-semibold">Level</span>
                        <span className="text-xs font-sans font-semibold text-gold">{plannedExperience.securityBrief.level}</span>
                      </div>
                      <p className="text-xs font-sans text-white/60 italic leading-relaxed">
                        "{plannedExperience.securityBrief.riskAssessment}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plannedExperience.securityBrief.protocols.map((p, i) => (
                          <span key={i} className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-sans font-semibold uppercase tracking-tight border border-white/10 text-white/70">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-8">
                    <h3 className="text-lg font-sans font-medium mb-4 flex items-center gap-3">
                      <UserCheck size={20} className="text-gold" /> {lang === 'EN' ? 'Compliance' : 'Cumplimiento'}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {plannedExperience.legalRequirements.map((req, i) => (
                        <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-sans font-light border border-white/10 text-white/70">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-8">
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
                        <span className={`text-[10px] font-sans font-semibold uppercase tracking-tight px-2 py-0.5 rounded-md ${
                          item.status === 'Auto-Scheduled' ? 'bg-cyan-400/10 text-cyan-400' : 'bg-gold/10 text-gold'
                        }`}>
                          {lang === 'EN' ? item.status : lang === 'ES' ? (item.status === 'Auto-Scheduled' ? 'Auto-Programado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendiente') : (item.status === 'Auto-Scheduled' ? 'Auto-Agendado' : item.status === 'Confirmed' ? 'Confirmado' : 'Pendente')}
                        </span>
                      </div>
                      <p className="text-sm font-sans font-light text-white/90">{item.activity}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">{item.pillar}</span>
                        <span className="text-[11px] text-white/20">•</span>
                        <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {paymentConfirmed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full mt-10 py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center gap-3 text-center"
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
                    className="w-full mt-10 py-4 bg-white text-luxury-black rounded-xl font-medium text-xs tracking-wide hover:bg-gold transition-colors flex items-center justify-center gap-3"
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
                    className={adminActiveTab === tab.id 
                      ? "w-full flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all text-white border-l-2 border-gold bg-white/[0.06]"
                      : "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-white/40 hover:text-white/70 hover:bg-white/[0.04] border-l-2 border-transparent"
                    }
                  >
                    <tab.icon size={18} />
                    <span className="text-[11px] tracking-normal">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-12 pt-12 border-t border-white/5">
                <button 
                  onClick={() => setIsMissionControl(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/5 text-red-400/70 border border-red-500/10 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <Zap size={18} />
                  <span className="text-[11px] tracking-normal">
                    {lang === 'EN' ? 'Mission Control' : lang === 'ES' ? 'Control de Misión' : 'Controle de Missão'}
                  </span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Admin Content */}
        <div className={`flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar bg-[#0d0d0b] ${isMissionControl ? 'max-w-none' : ''}`}>
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
            <div className="space-y-8">
              <div className="border-b border-white/[0.06] pb-6">
                <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">KLO Operations</p>
                <h1 className="text-3xl font-serif">{tabs.find(t => t.id === adminActiveTab)?.label}</h1>
              </div>
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
            </div>
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
    }} lang={lang} />
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
                    setViewMode('CLIENT'); 
                    setShowMarketplace(false);
                    setShowPartners(true); 
                  }} 
                  className="px-4 py-1.5 border border-gold/40 rounded-full text-gold hover:bg-gold hover:text-luxury-black transition-all duration-300 text-[10px] uppercase tracking-widest"
                >
                  {lang === 'EN' ? 'List with KLO' : lang === 'ES' ? 'Unirse a KLO' : 'Listar com KLO'}
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
                      setShowPartners(true);
                      setIsMenuOpen(false);
                      setSectionConfirmation(lang === 'EN' ? 'Partner Portal' : lang === 'ES' ? 'Portal de Socios' : 'Portal de Parceiros');
                      setTimeout(() => setSectionConfirmation(null), 2000);
                    }} className={`text-left transition-colors ${showPartners ? 'text-gold' : 'text-luxury-black/60'}`}>
                      {lang === 'EN' ? 'List with KLO' : lang === 'ES' ? 'Unirse a KLO' : 'Listar com KLO'}
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

      <section className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-black/40 mb-1">
              {lang === 'EN' ? 'For villa, yacht & aviation partners' 
              : lang === 'ES' ? 'Para socios de villas, yates y aviación' 
              : 'Para parceiros de vilas, iates e aviação'}
            </p>
            <p className="text-lg font-serif text-luxury-black">
              {lang === 'EN' ? 'List your asset with KLO' 
              : lang === 'ES' ? 'Liste su activo con KLO'
              : 'Liste seu ativo com KLO'}
            </p>
          </div>
          <button
            onClick={() => setShowPartners(true)}
            className="px-8 py-3 border border-luxury-black/20 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-luxury-black hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            {lang === 'EN' ? 'Learn More' : lang === 'ES' ? 'Saber más' : 'Saiba mais'}
          </button>
        </div>
      </section>

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
                ? "Ultra-luxury travel, curated in Cartagena. Expanding across Colombia and the Caribbean."
                : lang === 'ES'
                ? "Viajes de ultra-lujo, diseñados en Cartagena. En expansión por Colombia y el Caribe."
                : "Viagens de ultra-luxo, com curadoria em Cartagena. Em expansão pela Colômbia e o Caribe."}
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
