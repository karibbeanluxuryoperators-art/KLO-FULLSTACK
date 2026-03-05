import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Shield, Clock, MapPin, AlertTriangle, 
  CheckCircle2, Timer, Users, Plane, Ship, Car, Home,
  Wind, Droplets, Thermometer, TrendingUp, DollarSign,
  Zap, MessageSquare, AlertCircle
} from 'lucide-react';
import { Booking, Language, AssetType, Incident } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface OCCProps {
  bookings: Booking[];
  incidents: Incident[];
  lang: Language;
}

export const OperationalCommandCenter: React.FC<OCCProps> = ({ bookings, incidents, lang }) => {
  const t = {
    EN: {
      title: 'Operational Command Center',
      subtitle: 'Real-time Orchestration & Security Monitoring',
      activeMissions: 'Active Missions',
      tteAlerts: 'TTE Critical Alerts',
      securityStatus: 'Security Status',
      globalHealth: 'Operational Health',
      executing: 'Executing',
      delayed: 'Delayed',
      secured: 'Secured',
      riskLevel: 'Risk Level',
      timeToExecute: 'Time to Execute',
      location: 'Location',
      protocol: 'Protocol',
      incidentFeed: 'Incident Feed',
      environmentalIntel: 'Environmental Intel',
      unitEconomics: 'Unit Economics',
      marginProtection: 'Margin Protection',
      weather: 'Weather',
      tides: 'Tides',
      traffic: 'Traffic',
      autoResolutions: 'Auto-Resolutions',
      agentialCore: 'Agential Core resolving...',
      optimized: 'OPTIMIZED'
    },
    ES: {
      title: 'Centro de Comando Operacional',
      subtitle: 'Orquestación en Tiempo Real y Monitoreo de Seguridad',
      activeMissions: 'Misiones Activas',
      tteAlerts: 'Alertas Críticas de TTE',
      securityStatus: 'Estado de Seguridad',
      globalHealth: 'Salud Operacional',
      executing: 'Ejecutando',
      delayed: 'Retrasado',
      secured: 'Asegurado',
      riskLevel: 'Nivel de Riesgo',
      timeToExecute: 'Tiempo de Ejecución',
      location: 'Ubicación',
      protocol: 'Protocolo',
      incidentFeed: 'Registro de Incidentes',
      environmentalIntel: 'Inteligencia Ambiental',
      unitEconomics: 'Economía de la Unidad',
      marginProtection: 'Protección de Margen',
      weather: 'Clima',
      tides: 'Mareas',
      traffic: 'Tráfico',
      autoResolutions: 'Auto-Resoluciones',
      agentialCore: 'Núcleo Agéntico resolviendo...',
      optimized: 'OPTIMIZADO'
    },
    PT: {
      title: 'Centro de Comando Operacional',
      subtitle: 'Orquestração em Tempo Real e Monitoramento de Segurança',
      activeMissions: 'Missões Ativas',
      tteAlerts: 'Alertas Críticos de TTE',
      securityStatus: 'Status de Segurança',
      globalHealth: 'Saúde Operacional',
      executing: 'Executando',
      delayed: 'Atrasado',
      secured: 'Seguro',
      riskLevel: 'Nível de Risco',
      timeToExecute: 'Tempo de Execução',
      location: 'Localização',
      protocol: 'Protocolo',
      incidentFeed: 'Feed de Incidentes',
      environmentalIntel: 'Inteligência Ambiental',
      unitEconomics: 'Economia da Unidade',
      marginProtection: 'Proteção de Margen',
      weather: 'Clima',
      tides: 'Marés',
      traffic: 'Tráfego',
      autoResolutions: 'Auto-Resoluções',
      agentialCore: 'Núcleo Agêntico resolvendo...',
      optimized: 'OTIMIZADO'
    }
  }[lang];

  const getPillarIcon = (pillar: string) => {
    switch (pillar.toUpperCase()) {
      case 'AIR': return <Plane size={14} />;
      case 'SEA': return <Ship size={14} />;
      case 'LAND': return <Car size={14} />;
      case 'STAY': return <Home size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border-emerald-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Activity size={20} />
            </div>
            <span className="text-[10px] text-emerald-400 font-mono animate-pulse">LIVE</span>
          </div>
          <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-1">{t.globalHealth}</span>
          <span className="text-3xl font-serif">98.4%</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-gold/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-gold/10 text-gold">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] text-gold font-mono">AVG MARGIN</span>
          </div>
          <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-1">{t.unitEconomics}</span>
          <span className="text-3xl font-serif">$12,450</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <Shield size={20} />
            </div>
            <span className="text-[10px] text-blue-400 font-mono">{t.secured}</span>
          </div>
          <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-1">{t.securityStatus}</span>
          <span className="text-3xl font-serif">ELITE</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-purple-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
              <Zap size={20} />
            </div>
            <span className="text-[10px] text-purple-400 font-mono">AGENTIAL</span>
          </div>
          <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-1">{t.autoResolutions}</span>
          <span className="text-3xl font-serif">14</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Missions Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-[40px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-serif">{t.activeMissions}</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] uppercase tracking-widest rounded-full border border-emerald-400/20">
                  {bookings.length} {t.executing}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-gold/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-serif group-hover:text-gold transition-colors">{booking.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={10} /> {booking.itinerary[0]?.location || 'N/A'}
                        </span>
                        <span className="text-[10px] text-gold uppercase tracking-widest flex items-center gap-1">
                          <Shield size={10} /> {booking.securityBrief.level}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-luxury-cream/40 uppercase block mb-1">{t.timeToExecute}</span>
                      <span className="text-sm font-mono text-emerald-400">{booking.tte}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {booking.itinerary.slice(0, 4).map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`h-1 rounded-full mb-2 ${
                          step.status === 'COMPLETED' ? 'bg-emerald-400' : 
                          step.status === 'EXECUTING' ? 'bg-gold animate-pulse' : 'bg-white/10'
                        }`} />
                        <div className="flex items-center gap-1 text-[8px] uppercase tracking-tighter text-luxury-cream/40">
                          {getPillarIcon(step.pillar)}
                          <span className="truncate">{step.activity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Intel */}
          <div className="glass-panel p-8 rounded-[40px]">
            <h3 className="text-2xl font-serif mb-8">{t.environmentalIntel}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-400/10 text-blue-400 rounded-xl">
                    <Wind size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cream/40">{t.weather}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-serif">28°C</span>
                  <span className="text-[10px] text-emerald-400 mb-1">Optimal</span>
                </div>
                <p className="text-[10px] text-luxury-cream/30 mt-2 uppercase tracking-tighter">Wind: 12kts NE</p>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-cyan-400/10 text-cyan-400 rounded-xl">
                    <Droplets size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cream/40">{t.tides}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-serif">HIGH</span>
                  <span className="text-[10px] text-gold mb-1">+1.2m</span>
                </div>
                <p className="text-[10px] text-luxury-cream/30 mt-2 uppercase tracking-tighter">Next Low: 18:45</p>
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl">
                    <Car size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cream/40">{t.traffic}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-serif">LIGHT</span>
                  <span className="text-[10px] text-emerald-400 mb-1">Optimal</span>
                </div>
                <p className="text-[10px] text-luxury-cream/30 mt-2 uppercase tracking-tighter">Route: CTG {'->'} Villa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Feed & Security Monitor */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-[40px] border-red-500/20">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" /> {t.incidentFeed}
            </h3>
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    incident.severity === 'CRITICAL' ? 'bg-red-500' : 
                    incident.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] px-2 py-0.5 rounded-full border uppercase tracking-widest font-bold ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className="text-[8px] text-luxury-cream/30">{incident.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold mb-1">{incident.type}: {incident.description}</h4>
                  <p className="text-[10px] text-luxury-cream/50 leading-relaxed">
                    {incident.status === 'RESOLVING' ? (
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Loader2 size={10} className="animate-spin" /> {t.agentialCore}
                      </span>
                    ) : incident.resolution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border-gold/20">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-3">
              <DollarSign size={20} className="text-gold" /> {t.unitEconomics}
            </h3>
            <div className="space-y-6">
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Air', value: 4500 },
                    { name: 'Sea', value: 3200 },
                    { name: 'Stay', value: 2800 },
                    { name: 'Land', value: 1200 },
                    { name: 'Margin', value: 12450 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff30" fontSize={8} />
                    <YAxis stroke="#ffffff30" fontSize={8} />
                    <Tooltip contentStyle={{ backgroundColor: '#1C1C1C', border: '1px solid #ffffff10' }} />
                    <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-luxury-cream/40 uppercase tracking-widest">{t.marginProtection}</span>
                  <span className="text-xs font-bold text-emerald-400">{t.optimized}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[92%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
