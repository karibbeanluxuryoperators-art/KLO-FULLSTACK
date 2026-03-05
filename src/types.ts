
export type ViewMode = 'CLIENT' | 'ADMIN' | 'PROVIDER';
export type Language = 'EN' | 'ES' | 'PT';

export interface User {
  id: string;
  email: string;
  role: ViewMode;
  name: string;
}

export type AssetType = 'STAFF' | 'AIRCRAFT' | 'VESSEL' | 'VEHICLE' | 'LODGING';

export interface BaseAsset {
  id: string;
  name: string;
  type: AssetType;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'OFFLINE';
  location: string;
  providerId: string;
  pricePerUnit: string;
  capacity: number;
  image?: string;
  videoUrl?: string;
  description?: string;
  contactName?: string;
  bookedDates?: string[]; // YYYY-MM-DD
}

export interface Staff extends BaseAsset {
  type: 'STAFF';
  role: 'PILOT' | 'CAPTAIN' | 'CHEF' | 'SECURITY' | 'BUTLER' | 'CONCIERGE';
  rating: number;
  languages: string[];
}

export interface Aircraft extends BaseAsset {
  type: 'AIRCRAFT';
  model: string;
  range: string;
  tailNumber: string;
}

export interface Vessel extends BaseAsset {
  type: 'VESSEL';
  length: string;
  crewCount: number;
  vesselType: 'YACHT' | 'CATAMARAN' | 'SPEEDBOAT';
}

export interface Vehicle extends BaseAsset {
  type: 'VEHICLE';
  model: string;
  isArmored: boolean;
  driverName?: string;
}

export interface Lodging extends BaseAsset {
  type: 'LODGING';
  rooms: number;
  amenities: string[];
}

export type Asset = Staff | Aircraft | Vessel | Vehicle | Lodging;

export interface SecurityBrief {
  id: string;
  level: 'STANDARD' | 'HIGH' | 'ELITE';
  protocols: string[];
  emergencyContacts: { name: string; phone: string; role: string }[];
  riskAssessment: string;
  lastUpdated: string;
}

export interface Booking {
  id: string;
  clientId: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalInvestment: string;
  assets: string[]; // IDs of assets
  itinerary: ItineraryItem[];
  securityBrief: SecurityBrief;
  tte: string; // Time To Execute (e.g., "45m")
}

export interface ItineraryItem {
  time: string;
  activity: string;
  pillar: string;
  status: 'PENDING' | 'CONFIRMED' | 'AUTO_SCHEDULED' | 'EXECUTING' | 'COMPLETED';
  location?: string;
  tte?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  tier: 'UHNWI' | 'VVIP' | 'VIP';
  preferences: {
    dietary: string[];
    beverages: string[];
    temperature: string;
    interests: string[];
  };
  pastExperiences: number;
  totalSpend: string;
  loyaltyPoints: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Incident {
  id: string;
  bookingId: string;
  type: 'DELAY' | 'SECURITY' | 'WEATHER' | 'HEALTH' | 'LOGISTICS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'RESOLVING' | 'RESOLVED';
  timestamp: string;
  resolution?: string;
}

export interface AgentialRule {
  id: string;
  trigger: 'DELAY' | 'SECURITY' | 'WEATHER' | 'TTE_CRITICAL';
  condition: string; // e.g., "delay > 20m"
  action: string; // e.g., "re-route Vianco ground team"
  status: 'ACTIVE' | 'PAUSED';
  lastTriggered?: string;
}

export interface MaintenanceAlert {
  id: string;
  assetId: string;
  type: 'PREDICTIVE' | 'SCHEDULED';
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedCost: string;
}

export interface FinancialDeepDive {
  revenue: number;
  costOfGoods: number;
  partnerPayouts: number;
  operationalLeakage: number;
  netMargin: number;
  breakdown: { category: string; value: number }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'STAFF' | 'CLIENT' | 'ADMIN';
  content: string;
  timestamp: string;
  isEncrypted: boolean;
}

export interface AdminStats {
  totalRevenue: string;
  activeBookings: number;
  pendingApprovals: number;
  partnerCount: number;
  revenueData: { name: string; value: number }[];
  operationalHealth: number; // 0-100
  assetUtilization: { type: AssetType; value: number }[];
  incidents: Incident[];
  agentialRules: AgentialRule[];
  maintenanceAlerts: MaintenanceAlert[];
  financials: FinancialDeepDive;
}
