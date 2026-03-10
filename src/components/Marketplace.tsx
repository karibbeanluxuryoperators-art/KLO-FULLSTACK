import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plane, Ship, Car, Home, 
  Search, Filter, Star, MapPin, 
  ChevronRight, ArrowRight, Shield,
  Calendar, Clock, DollarSign, ShoppingBag, Trash2, X
} from 'lucide-react';
import { Asset, AssetType, Language } from '../types';
import { MiniCalendar } from './MiniCalendar';

interface MarketplaceProps {
  assets: Asset[];
  lang: Language;
  onBookAssets: (assets: Asset[]) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ assets, lang, onBookAssets }) => {
  const [activeTab, setActiveTab] = useState<AssetType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [cart, setCart] = useState<Asset[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const t = {
    EN: {
      title: 'Luxury Marketplace',
      subtitle: 'Direct Access to the World\'s Most Exclusive Assets',
      search: 'Search assets, locations, or providers...',
      all: 'All',
      staff: 'Staff',
      aircraft: 'Aircraft',
      vessels: 'Vessels',
      vehicles: 'Vehicles',
      lodging: 'Lodging',
      bookNow: 'Request Booking',
      addToJourney: 'Add to Journey',
      viewDetails: 'View Details',
      availability: 'Availability',
      capacity: 'Capacity',
      location: 'Location',
      rate: 'Rate',
      back: 'Back to Marketplace',
      features: 'Key Features',
      description: 'Description',
      video: 'Asset Video',
      gallery: 'Gallery',
      managedBy: 'Managed By',
      cart: 'Your Journey',
      emptyCart: 'Your journey is currently empty.',
      checkout: 'Orchestrate Journey',
      items: 'Items',
      total: 'Est. Total'
    },
    ES: {
      title: 'Mercado de Lujo',
      subtitle: 'Acceso Directo a los Activos más Exclusivos del Mundo',
      search: 'Buscar activos, ubicaciones o proveedores...',
      all: 'Todos',
      staff: 'Personal',
      aircraft: 'Aeronaves',
      vessels: 'Embarcaciones',
      vehicles: 'Vehículos',
      lodging: 'Alojamiento',
      bookNow: 'Solicitar Reserva',
      addToJourney: 'Añadir al Viaje',
      viewDetails: 'Ver Detalles',
      availability: 'Disponibilidad',
      capacity: 'Capacidad',
      location: 'Ubicación',
      rate: 'Tarifa',
      back: 'Volver al Mercado',
      features: 'Características Clave',
      description: 'Descripción',
      video: 'Video del Activo',
      gallery: 'Galería',
      managedBy: 'Gestionado Por',
      cart: 'Tu Viaje',
      emptyCart: 'Tu viaje está vacío actualmente.',
      checkout: 'Orquestar Viaje',
      items: 'Artículos',
      total: 'Total Est.'
    },
    PT: {
      title: 'Mercado de Luxo',
      subtitle: 'Acesso Direto aos Ativos mais Exclusivos do Mundo',
      search: 'Pesquisar ativos, locais ou provedores...',
      all: 'Todos',
      staff: 'Equipe',
      aircraft: 'Aeronaves',
      vessels: 'Embarcações',
      vehicles: 'Veículos',
      lodging: 'Hospedagem',
      bookNow: 'Solicitar Reserva',
      addToJourney: 'Adicionar à Jornada',
      viewDetails: 'Ver Detalhes',
      availability: 'Disponibilidade',
      capacity: 'Capacidade',
      location: 'Localização',
      rate: 'Taxa',
      back: 'Voltar ao Mercado',
      features: 'Principais Características',
      description: 'Descrição',
      video: 'Vídeo do Ativo',
      gallery: 'Galeria',
      managedBy: 'Gerenciado Por',
      cart: 'Sua Jornada',
      emptyCart: 'Sua jornada está vazia no momento.',
      checkout: 'Orquestrar Jornada',
      items: 'Itens',
      total: 'Total Est.'
    }
  }[lang];

  const filteredAssets = assets.filter(asset => {
    const matchesTab = activeTab === 'ALL' || asset.type === activeTab;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'STAFF': return <Users size={20} />;
      case 'AIRCRAFT': return <Plane size={20} />;
      case 'VESSEL': return <Ship size={20} />;
      case 'VEHICLE': return <Car size={20} />;
      case 'LODGING': return <Home size={20} />;
    }
  };

  const addToCart = (asset: Asset) => {
    if (!cart.find(item => item.id === asset.id)) {
      setCart([...cart, asset]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = parseFloat(item.pricePerUnit.replace(/[^0-9.]/g, '')) || 0;
      return acc + price;
    }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const renderCart = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-black z-[150] shadow-2xl flex flex-col border-l border-white/10"
    >
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-luxury-black">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-white uppercase tracking-widest">{t.cart}</h2>
            <p className="text-[10px] text-gold uppercase tracking-widest font-bold">{cart.length} {t.items}</p>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X size={24} className="text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 text-white">
            <ShoppingBag size={64} className="mb-6" />
            <p className="text-sm font-light">{t.emptyCart}</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="glass-panel p-4 rounded-2xl flex gap-4 group">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={`https://picsum.photos/seed/${item.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-serif text-white truncate">{item.name}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">{item.location}</p>
                <span className="text-xs font-bold text-gold">{item.pricePerUnit}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 self-start text-white/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-8 border-t border-white/10 bg-white/5">
          <div className="flex justify-between items-end mb-8">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">{t.total}</span>
            <span className="text-2xl font-light text-gold">{calculateTotal()}</span>
          </div>
          <button 
            onClick={() => {
              onBookAssets(cart);
              setIsCartOpen(false);
            }}
            className="w-full py-5 bg-gold text-luxury-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-3"
          >
            {t.checkout} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderAssetDetails = (asset: Asset) => (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 z-[100] bg-luxury-black overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <button 
          onClick={() => setSelectedAsset(null)}
          className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors mb-12 uppercase tracking-widest text-xs font-bold"
        >
          <ChevronRight className="rotate-180" size={16} /> {t.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="relative aspect-video rounded-[40px] overflow-hidden mb-8 group">
              <img 
                src={asset.image || `https://picsum.photos/seed/${asset.id}/1200/800`} 
                alt={asset.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8">
                <span className="px-4 py-2 bg-gold text-luxury-black rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                  {asset.type}
                </span>
                <h2 className="text-5xl font-serif text-white">{asset.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="glass-panel p-6 rounded-3xl text-center">
                <MapPin size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[10px] text-white/40 uppercase block mb-1">{t.location}</span>
                <span className="text-sm font-medium text-white">{asset.location}</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl text-center">
                <Users size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[10px] text-white/40 uppercase block mb-1">{t.capacity}</span>
                <span className="text-sm font-medium text-white">{asset.capacity} PAX</span>
              </div>
              <div className="glass-panel p-6 rounded-3xl text-center">
                <DollarSign size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[10px] text-white/40 uppercase block mb-1">{t.rate}</span>
                <span className="text-sm font-bold text-gold">{asset.pricePerUnit}</span>
              </div>
            </div>

            <div className="space-y-8">
              {asset.description && (
                <div>
                  <h3 className="text-xl font-serif mb-4 text-white">{t.description}</h3>
                  <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/10">
                    {asset.description}
                  </p>
                </div>
              )}

              {asset.gallery && asset.gallery.length > 0 && (
                <div>
                  <h3 className="text-xl font-serif mb-4 text-white">{t.gallery}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {asset.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-3xl overflow-hidden border border-white/10">
                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {asset.videoUrl && (
                <div>
                  <h3 className="text-xl font-serif mb-4 text-white">{t.video}</h3>
                  <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black">
                    <video 
                      src={asset.videoUrl} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-serif mb-4 text-white">{t.features}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {asset.type === 'STAFF' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Star size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Rating: {(asset as any).rating}/5.0</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Users size={16} className="text-gold" />
                        <span className="text-sm text-white/70">{(asset as any).languages.join(', ')}</span>
                      </div>
                    </>
                  )}
                  {asset.type === 'AIRCRAFT' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Plane size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Range: {(asset as any).range}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Shield size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Tail: {(asset as any).tailNumber}</span>
                      </div>
                    </>
                  )}
                  {asset.type === 'VESSEL' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Ship size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Length: {(asset as any).length}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <Users size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Crew: {(asset as any).crewCount}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[40px] border-gold/20">
              <h3 className="text-2xl font-serif mb-6 flex items-center gap-3 text-white">
                <Calendar size={24} className="text-gold" /> {t.availability}
              </h3>
              <MiniCalendar bookedDates={asset.bookedDates || []} lang={lang} />
              
              <button 
                onClick={() => {
                  addToCart(asset);
                  setSelectedAsset(null);
                }}
                className="w-full mt-8 py-5 bg-gold text-luxury-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-3"
              >
                {t.addToJourney} <ArrowRight size={16} />
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[40px] border-white/5">
                <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold/10 text-gold rounded-2xl">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-white">{t.managedBy}</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">{asset.contactName || 'Elite Operations Team'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold/10 text-gold rounded-2xl">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-white">Elite Protection</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Standard Protocol Active</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                All marketplace transactions are secured via agential middleware. Real-time background checks and insurance verification are performed automatically for every request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20 px-6">
      {/* Floating Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-[140] w-16 h-16 bg-gold text-luxury-black rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-luxury-black text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-luxury-black">
            {cart.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[145]"
            />
            {renderCart()}
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-8"
          >
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-[10px] mb-4 block font-bold">{t.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-serif uppercase leading-tight text-white">{t.title}</h1>
            </div>
            
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all text-sm font-light text-white"
              />
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { id: 'ALL', label: t.all, icon: <Filter size={16} /> },
            { id: 'STAFF', label: t.staff, icon: <Users size={16} /> },
            { id: 'AIRCRAFT', label: t.aircraft, icon: <Plane size={16} /> },
            { id: 'VESSEL', label: t.vessels, icon: <Ship size={16} /> },
            { id: 'VEHICLE', label: t.vehicles, icon: <Car size={16} /> },
            { id: 'LODGING', label: t.lodging, icon: <Home size={16} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-4 rounded-full text-[10px] uppercase tracking-widest transition-all border ${
                activeTab === tab.id ? 'bg-gold text-luxury-black font-bold border-gold shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={asset.id}
                className="glass-panel rounded-[40px] overflow-hidden group cursor-pointer hover:border-gold/30 transition-all"
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={asset.image || `https://picsum.photos/seed/${asset.id}/800/600`} 
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-luxury-black/60 backdrop-blur-md rounded-full text-[8px] uppercase tracking-widest border border-white/10 text-white">
                    {asset.type}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-serif text-white mb-1">{asset.name}</h3>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin size={12} />
                      <span className="text-[10px] uppercase tracking-widest">{asset.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{t.capacity}</span>
                        <span className="text-xs font-medium text-white">{asset.capacity} PAX</span>
                      </div>
                      <div className="w-[1px] h-6 bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase tracking-widest mb-1">{t.rate}</span>
                        <span className="text-xs font-bold text-gold">{asset.pricePerUnit}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-gold group-hover:text-luxury-black transition-all text-white">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAsset && renderAssetDetails(selectedAsset)}
      </AnimatePresence>
    </div>
  );
};
