import { Plane, Ship, Home, Car, UserCheck } from 'lucide-react';

export const PILLARS = [
  {
    id: 'AIR',
    name: 'Aviation',
    icon: Plane,
    color: 'text-blue-400',
    description: 'Private jets & helicopters — door to runway in under an hour'
  },
  {
    id: 'SEA',
    name: 'Maritime',
    icon: Ship,
    color: 'text-cyan-400',
    description: 'Megayachts, luxury catamarans & bespoke Caribbean charters'
  },
  {
    id: 'STAY',
    name: 'Residences',
    icon: Home,
    color: 'text-amber-400',
    description: 'Ultra-luxury private villas, penthouses & off-market estates'
  },
  {
    id: 'LAND',
    name: 'Ground',
    icon: Car,
    color: 'text-emerald-400',
    description: 'Armored and luxury ground transport with vetted professional drivers'
  },
  {
    id: 'STAFF',
    name: 'Staffing',
    icon: UserCheck,
    color: 'text-purple-400',
    description: 'Private chefs, security personnel, butlers & elite concierge staff'
  },
];

export const LUXURY_IMAGES = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600', // Caribbean coast
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1600', // Private jet interior
  'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1600', // Superyacht
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600', // Luxury villa
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600', // Luxury resort pool
];
