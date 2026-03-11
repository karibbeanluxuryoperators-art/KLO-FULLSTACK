import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, Search, Filter, ChevronDown, ChevronUp, 
  Check, X, MessageSquare, ExternalLink, Package,
  MapPin, Calendar, Info, Loader2, AlertCircle
} from 'lucide-react';
import { Language } from '../types';

interface Supplier {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  whatsapp: string;
  location: string;
  asset_type: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  google_calendar_id?: string;
  created_at: string;
}

interface SuppliersManagementProps {
  lang: Language;
  onViewAssets: (supplierId: string) => void;
}

export const SuppliersManagement: React.FC<SuppliersManagementProps> = ({ lang, onViewAssets }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/suppliers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSuppliers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch = s.business_name.toLowerCase().includes(search.toLowerCase()) || 
                         s.contact_name.toLowerCase().includes(search.toLowerCase()) ||
                         s.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING': return 'bg-gold/10 text-gold border-gold/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif text-white uppercase tracking-widest mb-2">Supplier Network</h2>
          <p className="text-white/40 font-light">Manage and verify KLO luxury partners</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all w-full lg:w-64 text-sm text-white"
            />
          </div>
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-gold text-luxury-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[40px] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">Business Name</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">Type</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">WhatsApp</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">Status</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">Submitted</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSuppliers.map((supplier) => (
                <React.Fragment key={supplier.id}>
                  <tr className={`hover:bg-white/5 transition-colors cursor-pointer ${expandedId === supplier.id ? 'bg-white/5' : ''}`} onClick={() => setExpandedId(expandedId === supplier.id ? null : supplier.id)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold font-bold">
                          {supplier.business_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{supplier.business_name}</div>
                          <div className="text-[10px] text-white/40">{supplier.contact_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{supplier.asset_type}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <MapPin size={12} className="text-gold" />
                        {supplier.location}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <a 
                        href={`https://wa.me/${supplier.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <MessageSquare size={14} />
                        {supplier.whatsapp}
                      </a>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[8px] px-2 py-1 rounded-full border uppercase tracking-widest font-bold ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-white/40">
                      {new Date(supplier.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {supplier.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(supplier.id, 'APPROVED')}
                              disabled={actionLoading === supplier.id}
                              className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                            >
                              {actionLoading === supplier.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(supplier.id, 'REJECTED')}
                              disabled={actionLoading === supplier.id}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            >
                              {actionLoading === supplier.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                            </button>
                          </>
                        )}
                        <button className="p-2 text-white/20 hover:text-white transition-colors">
                          {expandedId === supplier.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedId === supplier.id && (
                      <tr>
                        <td colSpan={7} className="px-8 py-0 bg-white/5">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/5">
                              <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-2">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold">Partner Description</h4>
                                  <p className="text-sm text-white/70 leading-relaxed font-light">{supplier.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                  <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold">Contact Email</h4>
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                      <ExternalLink size={14} />
                                      {supplier.email}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase tracking-widest text-gold font-bold">Calendar Integration</h4>
                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                      <Calendar size={14} />
                                      {supplier.google_calendar_id ? 'Connected' : 'Not Connected'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-6 flex flex-col justify-center">
                                <button 
                                  onClick={() => onViewAssets(supplier.id)}
                                  className="w-full py-4 bg-gold text-luxury-black rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all"
                                >
                                  <Package size={16} /> View Assets
                                </button>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                                  <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                                    <Info size={20} />
                                  </div>
                                  <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">
                                    All assets from this supplier are currently {supplier.status.toLowerCase()}.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-white/20">
                      <AlertCircle size={48} />
                      <p className="text-sm uppercase tracking-widest">No partners found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
