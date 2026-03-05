import React from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import { FinancialDeepDive, Language } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';

interface FinancialEngineProps {
  financials: FinancialDeepDive;
  lang: Language;
}

export const FinancialEngine: React.FC<FinancialEngineProps> = ({ financials, lang }) => {
  const t = {
    EN: {
      title: 'Financial Orchestration',
      subtitle: 'Unit Economics & Margin Protection',
      netMargin: 'Net Margin',
      partnerPayouts: 'Partner Payouts',
      opLeakage: 'Op. Leakage',
      automatedSettlements: 'Automated Partner Settlements',
      settled: 'SETTLED',
      pending: 'PENDING',
      costDistribution: 'Cost Distribution'
    },
    ES: {
      title: 'Orquestación Financiera',
      subtitle: 'Economía de la Unidad y Protección de Margen',
      netMargin: 'Margen Neto',
      partnerPayouts: 'Pagos a Socios',
      opLeakage: 'Fuga Operativa',
      automatedSettlements: 'Liquidaciones Automatizadas de Socios',
      settled: 'LIQUIDADO',
      pending: 'PENDIENTE',
      costDistribution: 'Distribución de Costos'
    },
    PT: {
      title: 'Orquestração Financeira',
      subtitle: 'Economia da Unidade e Proteção de Margem',
      netMargin: 'Margem Líquida',
      partnerPayouts: 'Pagamentos a Parceiros',
      opLeakage: 'Vazamento Operacional',
      automatedSettlements: 'Liquidações Automatizadas de Parceiros',
      settled: 'LIQUIDADO',
      pending: 'PENDENTE',
      costDistribution: 'Distribuição de Custos'
    }
  }[lang];

  const COLORS = ['#D4AF37', '#ffffff20', '#ffffff10', '#ffffff05'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] border-gold/20">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-serif">{t.title}</h3>
              <p className="text-luxury-cream/40 text-[10px] uppercase tracking-widest">{t.subtitle}</p>
            </div>
            <div className="p-4 bg-gold/10 text-gold rounded-3xl">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-2">{t.netMargin}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif text-gold">${financials.netMargin.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 mb-1 flex items-center gap-1">
                  <ArrowUpRight size={10} /> 12%
                </span>
              </div>
            </div>
            <div>
              <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-2">{t.partnerPayouts}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif">${financials.partnerPayouts.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <span className="text-luxury-cream/40 text-[10px] uppercase tracking-widest block mb-2">{t.opLeakage}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif text-red-400">${financials.operationalLeakage.toLocaleString()}</span>
                <span className="text-[10px] text-red-400 mb-1 flex items-center gap-1">
                  <ArrowDownRight size={10} /> 4%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-cream/40">{t.automatedSettlements}</h4>
            <div className="space-y-4">
              {[
                { name: 'Jettly Aviation', amount: '$45,000', status: t.settled, icon: ShieldCheck },
                { name: 'Vianco Ground', amount: '$12,400', status: t.pending, icon: Wallet },
                { name: 'ZentrumHub', amount: '$8,900', status: t.settled, icon: ShieldCheck },
              ].map((partner, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white/5 ${partner.status === t.settled ? 'text-emerald-400' : 'text-amber-400'}`}>
                      <partner.icon size={16} />
                    </div>
                    <div>
                      <span className="text-sm font-bold block">{partner.name}</span>
                      <span className="text-[8px] text-luxury-cream/40 uppercase tracking-widest">{partner.status}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold">{partner.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="glass-panel p-8 rounded-[40px] border-white/10">
          <h3 className="text-xl font-serif mb-8">{t.costDistribution}</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={financials.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {financials.breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1C1C1C', border: '1px solid #ffffff10' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {financials.breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cream/60">{item.category}</span>
                </div>
                <span className="text-xs font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
