export interface KLOExperience {
  title: string;
  description: string;
  pillars: {
    air?: string;
    sea?: string;
    stay?: string;
    land?: string;
    staff?: string;
  };
  estimatedTotal: string;
  managementFee: string;
  legalRequirements: string[];
  securityBrief: {
    level: 'STANDARD' | 'HIGH' | 'ELITE';
    riskAssessment: string;
    protocols: string[];
    emergencyContacts: { name: string; phone: string; role: string }[];
  };
  itinerary: {
    time: string;
    activity: string;
    pillar: 'AIR' | 'SEA' | 'STAY' | 'LAND' | 'STAFF';
    status: 'Confirmed' | 'Pending' | 'Auto-Scheduled';
    tte: string; // Time To Execute
    location: string;
  }[];
}
