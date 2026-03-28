import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, Shield, Activity, Plane, Ship, Car, Home, Zap, MapPin } from 'lucide-react';
import { MaintenanceAlert, Language, AssetType } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

interface PredictiveAnalyticsProps {
  alerts: MaintenanceAlert[];
  lang: Language;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ alerts, lang }) => {
  const t = {
    EN: {
      maintenanceTitle: 'Predictive Maintenance',
      maintenanceSubtitle: 'Asset Longevity & Reliability',
      alert: 'ALERT',
      estCost: 'Est. Resolution Cost',
      demandTitle: 'Demand Heatmap',
      demandSubtitle: 'UHNWI Trending Locations',
      topDestination: 'Top Destination',
      growthTrend: 'Growth Trend'
    },
    ES: {
      maintenanceTitle: 'Mantenimiento Predictivo',
      maintenanceSubtitle: 'Longevidad y Confiabilidad de Activos',
      alert: 'ALERTA',
      estCost: 'Costo Est. de Resolución',
      demandTitle: 'Mapa de Calor de Demanda',
      demandSubtitle: 'Ubicaciones de Tendencia UHNWI',
      topDestination: 'Destino Principal',
      growthTrend: 'Tendencia de Crecimiento'
    },
    PT: {
      maintenanceTitle: 'Manutenção Preditiva',
      maintenanceSubtitle: 'Longevidade e Confiabilidade de Ativos',
      alert: 'ALERTA',
      estCost: 'Custo Est. de Resolução',
      demandTitle: 'Mapa de Calor de Demanda',
      demandSubtitle: 'Locais de Tendência UHNWI',
      topDestination: 'Principal Destino',
      growthTrend: 'Tendência de Crescimento'
    }
  }[lang];

  const demandData = [
    { name: 'St. Barths', value: 92 },
    { name: 'Anguilla', value: 85 },
    { name: 'Antigua', value: 78 },
    { name: 'Cartagena', value: 65 },
    { name: 'Miami', value: 45 },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Predictive Maintenance */}
        <div className="glass-panel p-8 rounded-2xl border-amber-500/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-serif italic tracking-wide">{t.maintenanceTitle}</h3>
              <p className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight">{t.maintenanceSubtitle}</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <Activity size={20} />
            </div>
          </div>

          <div className="space-y-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-amber-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight block">{alert.type} {t.alert}</span>
                      <span className="text-sm font-sans font-medium">{alert.description}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-sans font-semibold uppercase tracking-tight ${getUrgencyColor(alert.urgency)}`}>
                    {alert.urgency}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight">{t.estCost}</span>
                  <span className="text-xs font-sans font-medium text-amber-400">{alert.estimatedCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand Heatmap */}
        <div className="glass-panel p-8 rounded-2xl border-gold/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-serif italic tracking-wide">{t.demandTitle}</h3>
              <p className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight">{t.demandSubtitle}</p>
            </div>
            <div className="p-3 bg-gold/10 text-gold rounded-xl">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff30" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1C', border: '1px solid #ffffff10' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {demandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#ffffff10'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-1">{t.topDestination}</span>
              <span className="text-lg font-serif italic text-gold">St. Barths</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-1">{t.growthTrend}</span>
              <span className="text-lg font-serif italic text-emerald-400">+24%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
