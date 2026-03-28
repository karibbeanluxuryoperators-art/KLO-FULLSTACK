import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, UserPlus, Search, Filter, 
  MoreVertical, Mail, Phone, MapPin,
  Star, Activity, CreditCard, Shield,
  X, Plus, Check
} from 'lucide-react';
import { GuestProfile, Language } from '../types';

interface ClientManagementProps {
  clients: GuestProfile[];
  lang: Language;
  onAddClient: (client: GuestProfile) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ clients, lang, onAddClient }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState<Partial<GuestProfile>>({
    tier: 'UHNWI',
    status: 'ACTIVE',
    preferences: {
      dietary: [],
      beverages: [],
      temperature: '22°C',
      interests: []
    },
    pastExperiences: 0,
    totalSpend: '$0',
    loyaltyPoints: 0
  });

  const t = {
    EN: {
      title: 'Client Management',
      subtitle: 'UHNWI & VVIP Guest Relations',
      search: 'Search clients by name or tier...',
      addClient: 'Add New Client',
      name: 'Full Name',
      tier: 'Client Tier',
      status: 'Status',
      preferences: 'Preferences',
      dietary: 'Dietary Requirements',
      beverages: 'Preferred Beverages',
      interests: 'Interests',
      save: 'Register Client',
      cancel: 'Cancel',
      totalSpend: 'Total Lifetime Spend',
      loyalty: 'Loyalty Points',
      experiences: 'Experiences'
    },
    ES: {
      title: 'Gestión de Clientes',
      subtitle: 'Relaciones con Huéspedes UHNWI y VVIP',
      search: 'Buscar clientes por nombre o nivel...',
      addClient: 'Añadir Nuevo Cliente',
      name: 'Nombre Completo',
      tier: 'Nivel de Cliente',
      status: 'Estado',
      preferences: 'Preferencias',
      dietary: 'Requisitos Dietéticos',
      beverages: 'Bebidas Preferidas',
      interests: 'Intereses',
      save: 'Registrar Cliente',
      cancel: 'Cancelar',
      totalSpend: 'Gasto Total de por Vida',
      loyalty: 'Puntos de Lealtad',
      experiences: 'Experiencias'
    },
    PT: {
      title: 'Gestão de Clientes',
      subtitle: 'Relações com Hóspedes UHNWI e VVIP',
      search: 'Pesquisar clientes por nome ou nível...',
      addClient: 'Adicionar Novo Cliente',
      name: 'Nome Completo',
      tier: 'Nível do Cliente',
      status: 'Status',
      preferences: 'Preferências',
      dietary: 'Requisitos Dietéticos',
      beverages: 'Bebidas Preferidas',
      interests: 'Interesses',
      save: 'Registrar Cliente',
      cancel: 'Cancelar',
      totalSpend: 'Gasto Total Vitalício',
      loyalty: 'Pontos de Fidelidade',
      experiences: 'Experiências'
    }
  }[lang];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const client: GuestProfile = {
      ...newClient as GuestProfile,
      id: `CLIENT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    onAddClient(client);
    setIsAddModalOpen(false);
    setNewClient({
      tier: 'UHNWI',
      status: 'ACTIVE',
      preferences: {
        dietary: [],
        beverages: [],
        temperature: '22°C',
        interests: []
      },
      pastExperiences: 0,
      totalSpend: '$0',
      loyaltyPoints: 0
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-serif italic tracking-wide mb-2">{t.title}</h2>
          <p className="text-luxury-cream/40 font-sans text-[11px] uppercase tracking-tight font-semibold">{t.subtitle}</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-cream/30" size={18} />
            <input 
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all text-sm font-light"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-4 bg-gold text-luxury-black rounded-2xl font-sans font-semibold uppercase tracking-tight text-[11px] flex items-center gap-3 hover:bg-white transition-all shrink-0"
          >
            <UserPlus size={16} /> {t.addClient}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredClients.map((profile, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={profile.id} 
            className="glass-panel p-8 rounded-[40px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gold rounded-3xl flex items-center justify-center text-luxury-black">
                  <span className="text-3xl font-bold">{profile.name[0]}</span>
                </div>
                <div>
                  <h4 className="text-3xl font-serif italic mb-1">{profile.name}</h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-gold/10 text-gold text-[11px] font-sans font-semibold uppercase tracking-tight rounded-full border border-gold/20">
                      {profile.tier}
                    </span>
                    <span className={`px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-tight rounded-full border ${
                      profile.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {profile.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-1">
                  {t.totalSpend}
                </span>
                <span className="text-2xl font-serif italic text-gold">{profile.totalSpend}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h5 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-gold flex items-center gap-2">
                  <Star size={12} /> {t.preferences}
                </h5>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-1">{t.dietary}</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.dietary.map((d, j) => (
                        <span key={j} className="text-[11px] font-sans px-2 py-1 bg-white/5 rounded-md border border-white/10">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-1">{t.beverages}</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.beverages.map((b, j) => (
                        <span key={j} className="text-[11px] font-sans px-2 py-1 bg-white/5 rounded-md border border-white/10">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-gold flex items-center gap-2">
                  <Activity size={12} /> Intelligence
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block">{t.experiences}</span>
                    <span className="text-xl font-serif italic">{profile.pastExperiences}</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block">{t.loyalty}</span>
                    <span className="text-xl font-serif italic">{profile.loyaltyPoints}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight block mb-2">{t.interests}</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferences.interests.map((interest, j) => (
                      <span key={j} className="text-[10px] font-sans font-semibold uppercase tracking-tight px-3 py-1 bg-gold/5 text-gold rounded-full border border-gold/10">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-luxury-slate rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gold/10 text-gold rounded-2xl">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif italic">{t.addClient}</h3>
                    <p className="text-[11px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight">New Guest Registration</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-luxury-cream/40" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40 ml-4">{t.name}</label>
                    <input 
                      type="text" 
                      required
                      value={newClient.name || ''}
                      onChange={e => setNewClient({...newClient, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans"
                      placeholder="e.g. Alexander Vianco"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40 ml-4">{t.tier}</label>
                    <select 
                      value={newClient.tier}
                      onChange={e => setNewClient({...newClient, tier: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans appearance-none"
                    >
                      <option value="UHNWI">UHNWI</option>
                      <option value="VVIP">VVIP</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-sans font-semibold uppercase tracking-tight text-gold ml-4">{t.preferences}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40 ml-4">{t.dietary}</label>
                      <input 
                        type="text" 
                        placeholder="Comma separated..."
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setNewClient({
                                ...newClient, 
                                preferences: {
                                  ...newClient.preferences!,
                                  dietary: [...newClient.preferences!.dietary, val]
                                }
                              });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newClient.preferences?.dietary.map((d, i) => (
                          <span key={i} className="text-[11px] font-sans px-2 py-1 bg-gold/10 text-gold rounded-md border border-gold/20 flex items-center gap-2">
                            {d} <X size={10} className="cursor-pointer" onClick={() => {
                              setNewClient({
                                ...newClient,
                                preferences: {
                                  ...newClient.preferences!,
                                  dietary: newClient.preferences!.dietary.filter((_, idx) => idx !== i)
                                }
                              });
                            }} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/40 ml-4">{t.beverages}</label>
                      <input 
                        type="text" 
                        placeholder="Comma separated..."
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setNewClient({
                                ...newClient, 
                                preferences: {
                                  ...newClient.preferences!,
                                  beverages: [...newClient.preferences!.beverages, val]
                                }
                              });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newClient.preferences?.beverages.map((b, i) => (
                          <span key={i} className="text-[11px] font-sans px-2 py-1 bg-gold/10 text-gold rounded-md border border-gold/20 flex items-center gap-2">
                            {b} <X size={10} className="cursor-pointer" onClick={() => {
                              setNewClient({
                                ...newClient,
                                preferences: {
                                  ...newClient.preferences!,
                                  beverages: newClient.preferences!.beverages.filter((_, idx) => idx !== i)
                                }
                              });
                            }} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 border border-white/10 rounded-2xl text-luxury-cream/40 font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-white/5 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gold text-luxury-black rounded-2xl font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-white transition-all flex items-center justify-center gap-3"
                  >
                    <Check size={16} /> {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
