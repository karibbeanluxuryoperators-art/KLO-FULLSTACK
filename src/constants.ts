import { Plane, Ship, Home, Car, UserCheck, Shield, Sparkles, MapPin, Calendar, Clock, ChevronRight, MessageSquare, Send, Loader2 } from 'lucide-react';

export const PILLARS = [
  { id: 'AIR', name: 'Aviation', icon: Plane, color: 'text-blue-400', description: 'Private jets & helicopters via Jettly' },
  { id: 'SEA', name: 'Maritime', icon: Ship, color: 'text-cyan-400', description: 'Megayachts & luxury charters via Nauty 360' },
  { id: 'STAY', name: 'Accommodation', icon: Home, color: 'text-amber-400', description: 'Ultra-luxury villas & Virtuoso suites' },
  { id: 'LAND', name: 'Ground', icon: Car, color: 'text-emerald-400', description: 'Armored vehicles & luxury fleets via Vianco' },
  { id: 'STAFF', name: 'Concierge', icon: UserCheck, color: 'text-purple-400', description: 'Personalized staff & exclusive access' },
];

export const LUXURY_IMAGES = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600', // Caribbean
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600', // Private jet
  'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600', // Yacht
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600', // Villa
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600', // Luxury resort
];
