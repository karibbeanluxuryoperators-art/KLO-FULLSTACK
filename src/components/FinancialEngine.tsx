import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, ShieldCheck, Loader2, Users, Target } from 'lucide-react';
import { FinancialDeepDive, Language } from '../types';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface FinancialEngineProps {
  financials: FinancialDeepDive;
  lang: Language;
}

export const FinancialEngine: React.FC<FinancialEngineProps> = ({ financials, lang }) => {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/leads')
        ]);
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();
        
        setAdminStats(statsData);
        setLeadsCount(Array.isArray(leadsData) ? leadsData.length : 0);
      } catch (error) {
        console.error('Failed to fetch financial data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      costDistribution: 'Cost Distribution',
      gmv: 'GMV (Gross Merchandise Value)',
      commission: 'KLO Commission (20%)',
      avgBooking: 'Avg. Booking Value',
      totalBookings: 'Total Bookings',
      clientProgress: 'First 20 Clients Progress',
      revenueBreakdown: 'Revenue Breakdown'
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
      costDistribution: 'Distribución de Costos',
      gmv: 'GMV (Valor Bruto de Mercancía)',
      commission: 'Comisión KLO (20%)',
      avgBooking: 'Valor Promedio de Reserva',
      totalBookings: 'Total de Reservas',
      clientProgress: 'Progreso de los Primeros 20 Clientes',
      revenueBreakdown: 'Desglose de Ingresos'
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
      costDistribution: 'Distribuição de Custos',
      gmv: 'GMV (Valor Bruto de Mercadoria)',
      commission: 'Comissão KLO (20%)',
      avgBooking: 'Valor Médio de Reserva',
      totalBookings: 'Total de Reservas',
      clientProgress: 'Progresso dos Primeiros 20 Clientes',
      revenueBreakdown: 'Detalhamento de Receita'
    }
  }[lang];

  const COLORS = ['#D4AF37', '#ffffff20', '#ffffff10', '#ffffff05'];
  const REVENUE_COLORS = ['#D4AF37', '#C5A028', '#B69119', '#A7820A'];

  const revenueBreakdownData = [
    { name: 'Aviation', value: 35 },
    { name: 'Villas', value: 30 },
    { name: 'Services', value: 20 },
    { name: 'Events', value: 15 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  // Parse GMV from totalRevenue (e.g., "$2.4M" -> 2400000)
  const gmvValue = adminStats?.totalRevenue ? parseFloat(adminStats.totalRevenue.replace(/[^0-9.]/g, '')) * 1000000 : 2400000;
  const commissionValue = gmvValue * 0.20;
  const totalBookingsCount = adminStats?.activeBookings || 42;
  const avgBookingValue = gmvValue / totalBookingsCount;

  return (
    <div className="space-y-8">
      {/* KLO Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.gmv, value: `$${(gmvValue / 1000000).toFixed(1)}M`, icon: Wallet, color: 'text-gold' },
          { label: t.commission, value: `$${(commissionValue / 1000).toFixed(0)}K`, icon: CreditCard, color: 'text-emerald-400' },
          { label: t.avgBooking, value: `$${(avgBookingValue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'text-white' },
          { label: t.totalBookings, value: totalBookingsCount, icon: Target, color: 'text-white' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40 block mb-1">{stat.label}</span>
            <span className={`text-2xl font-serif italic tracking-wide ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-panel p-8 rounded-[40px] border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h4 className="text-xl font-serif italic mb-1">{t.clientProgress}</h4>
            <p className="text-[11px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight">Target: 20 High-Net-Worth Clients Acquired</p>
          </div>
          <span className="text-2xl font-serif italic text-gold">{leadsCount} / 20</span>
        </div>
        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((leadsCount / 20) * 100, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          />
        </div>
      </div>

      {/* Monthly Revenue Performance */}
      <div className="glass-panel p-8 rounded-[40px] border-white/5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-serif italic tracking-wide">Monthly Revenue Performance</h3>
            <p className="text-[11px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight">Real-time GMV Tracking</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-sans font-semibold">
            <TrendingUp size={16} />
            +24% vs Last Period
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adminStats?.revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff40', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff40', fontSize: 10 }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ 
                  backgroundColor: '#1C1C1C', 
                  border: '1px solid #ffffff10',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#D4AF37" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] border-gold/20">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-serif italic tracking-wide">{t.title}</h3>
              <p className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight">{t.subtitle}</p>
            </div>
            <div className="p-4 bg-gold/10 text-gold rounded-3xl">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <span className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight block mb-2">{t.netMargin}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif italic text-gold">${financials.netMargin.toLocaleString()}</span>
                <span className="text-[10px] font-sans font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                  <ArrowUpRight size={10} /> 12%
                </span>
              </div>
            </div>
            <div>
              <span className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight block mb-2">{t.partnerPayouts}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif italic">${financials.partnerPayouts.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <span className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight block mb-2">{t.opLeakage}</span>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-serif italic text-red-400">${financials.operationalLeakage.toLocaleString()}</span>
                <span className="text-[10px] font-sans font-semibold text-red-400 mb-1 flex items-center gap-1">
                  <ArrowDownRight size={10} /> 4%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40">{t.automatedSettlements}</h4>
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
                      <span className="text-sm font-sans font-medium block">{partner.name}</span>
                      <span className="text-[10px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight">{partner.status}</span>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-medium">{partner.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Breakdown & Revenue Breakdown */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-[40px] border-white/10">
            <h3 className="text-xl font-serif mb-8">{t.costDistribution}</h3>
            <div className="h-[200px]">
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
            <div className="mt-6 space-y-3">
              {financials.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/60">{item.category}</span>
                  </div>
                  <span className="text-xs font-sans font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[40px] border-white/10">
            <h3 className="text-xl font-serif mb-8">{t.revenueBreakdown}</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={REVENUE_COLORS[index % REVENUE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1C1C1C', border: '1px solid #ffffff10' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
