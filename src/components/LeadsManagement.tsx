import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Mail, Phone, MessageSquare, 
  Calendar, Clock, Filter, Search, 
  CheckCircle2, XCircle, MoreVertical, 
  ExternalLink, Loader2, Trash2, Send, ArrowUpRight
} from 'lucide-react';
import { Lead, Language } from '../types';

interface LeadsManagementProps {
  lang: Language;
}

export const LeadsManagement: React.FC<LeadsManagementProps> = ({ lang }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Lead['status'] | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchesFilter = filter === 'ALL' || lead.status === filter;
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'CONTACTED': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'QUALIFIED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'CLOSED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'LOST': return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const getNextStatus = (current: Lead['status']): Lead['status'] | null => {
    switch (current) {
      case 'NEW': return 'CONTACTED';
      case 'CONTACTED': return 'QUALIFIED';
      case 'QUALIFIED': return 'CLOSED';
      default: return null;
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    qualified: leads.filter(l => l.status === 'QUALIFIED').length,
    closed: leads.filter(l => l.status === 'CLOSED').length,
  };

  const t = {
    EN: {
      title: 'Lead Management',
      subtitle: 'Track and orchestrate new inquiries from the ecosystem.',
      search: 'Search leads...',
      all: 'All Leads',
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      closed: 'Closed',
      lost: 'Lost',
      noLeads: 'No leads found matching your criteria.',
      actions: 'Actions',
      markContacted: 'Mark Contacted',
      markQualified: 'Mark Qualified',
      markClosed: 'Mark Closed',
      markLost: 'Mark Lost',
      advance: 'Advance Status',
      whatsappMsg: (name: string, exp: string) => `Hi ${name}, this is KLO. Thank you for your inquiry about ${exp}. I would love to discuss your trip.`
    },
    ES: {
      title: 'Gestión de Leads',
      subtitle: 'Rastree y orqueste nuevas consultas del ecosistema.',
      search: 'Buscar leads...',
      all: 'Todos los Leads',
      new: 'Nuevos',
      contacted: 'Contactados',
      qualified: 'Calificados',
      closed: 'Cerrados',
      lost: 'Perdidos',
      noLeads: 'No se encontraron leads que coincidan con sus criterios.',
      actions: 'Acciones',
      markContacted: 'Marcar como Contactado',
      markQualified: 'Marcar como Calificado',
      markClosed: 'Marcar como Cerrado',
      markLost: 'Marcar como Perdido',
      advance: 'Avanzar Estado',
      whatsappMsg: (name: string, exp: string) => `Hola ${name}, te escribe KLO. Gracias por tu consulta sobre ${exp}. Me encantaría hablar sobre tu viaje.`
    },
    PT: {
      title: 'Gestão de Leads',
      subtitle: 'Rastree e orquestre novas consultas do ecossistema.',
      search: 'Buscar leads...',
      all: 'Todos os Leads',
      new: 'Novos',
      contacted: 'Contatados',
      qualified: 'Qualificados',
      closed: 'Fechados',
      lost: 'Perdidos',
      noLeads: 'Nenhum lead encontrado.',
      actions: 'Ações',
      markContacted: 'Marcar Contatado',
      markQualified: 'Marcar Qualificado',
      markClosed: 'Marcar Fechado',
      markLost: 'Marcar Perdido',
      advance: 'Avançar Status',
      whatsappMsg: (name: string, exp: string) => `Olá ${name}, aqui é a KLO. Obrigado pelo seu interesse em ${exp}. Adoraria conversar sobre sua viagem.`
    }
  }[lang];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-serif italic tracking-wide text-white mb-2">{t.title}</h2>
          <p className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">Total</span>
            <span className="text-lg font-serif italic text-white">{stats.total}</span>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-blue-500 uppercase tracking-tight">{t.new}</span>
            <span className="text-lg font-serif italic text-blue-500">{stats.new}</span>
          </div>
          <div className="px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-amber-500 uppercase tracking-tight">{t.contacted}</span>
            <span className="text-lg font-serif italic text-amber-500">{stats.contacted}</span>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-emerald-500 uppercase tracking-tight">{t.qualified}</span>
            <span className="text-lg font-serif italic text-emerald-500">{stats.qualified}</span>
          </div>
          <div className="px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-purple-500 uppercase tracking-tight">{t.closed}</span>
            <span className="text-lg font-serif italic text-purple-500">{stats.closed}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input 
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all text-xs font-light text-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'LOST'].map(s => (
            <button 
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-3 rounded-xl text-[11px] font-sans uppercase tracking-tight transition-all border ${
                filter === s ? 'bg-gold text-luxury-black font-semibold border-gold' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
              }`}
            >
              {s === 'ALL' ? t.all : t[s.toLowerCase() as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLeads.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-64 glass-panel rounded-[40px] flex flex-col items-center justify-center text-center opacity-40 text-white"
              >
                <Users size={48} className="mb-4" />
                <p className="text-sm font-light">{t.noLeads}</p>
              </motion.div>
            ) : (
              filteredLeads.map((lead) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={lead.id}
                  className="glass-panel p-8 rounded-[40px] flex flex-col lg:flex-row justify-between items-center gap-8 group hover:border-gold/30 transition-all"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-gold relative">
                      <Users size={24} />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full border-2 border-luxury-black flex items-center justify-center">
                        <span className="text-[8px] text-luxury-black font-bold">{lead.source === 'WHATSAPP' ? 'W' : 'C'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-serif italic text-white">{lead.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-sans font-semibold uppercase tracking-tight border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">
                        <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {lead.phone}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {(() => {
                          const date = new Date(lead.timestamp);
                          return isNaN(date.getTime()) ? lead.timestamp : date.toLocaleString();
                        })()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 max-w-md">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 italic text-xs text-white/60 font-light leading-relaxed">
                      "{lead.message}"
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const msg = t.whatsappMsg(lead.name, lead.experience_type || 'luxury services');
                        const phone = lead.whatsapp || lead.phone;
                        // Clean phone number: remove non-digits
                        const cleanPhone = phone.replace(/\D/g, '');
                        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                      title="WhatsApp Quick Reply"
                    >
                      <Send size={18} />
                    </button>

                    {getNextStatus(lead.status) && (
                      <button 
                        onClick={() => updateLeadStatus(lead.id, getNextStatus(lead.status)!)}
                        className="p-4 bg-gold/10 text-gold rounded-2xl border border-gold/20 hover:bg-gold/20 transition-all"
                        title={t.advance}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    )}

                    {lead.status !== 'LOST' && lead.status !== 'CLOSED' && (
                      <button 
                        onClick={() => updateLeadStatus(lead.id, 'LOST')}
                        className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                        title={t.markLost}
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
