import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plane, Ship, Car, Home, 
  Plus, Search, Filter, MoreVertical,
  Star, MapPin, Shield, CheckCircle2,
  AlertCircle, Settings, Image as ImageIcon,
  Video as VideoIcon, Trash2, Zap, Loader2,
  TrendingUp, X, Sparkles, ArrowRight, DollarSign, Calendar
} from 'lucide-react';
import { Asset, AssetType, Language } from '../types';
import { MiniCalendar } from './MiniCalendar';

interface AssetManagementProps {
  assets: Asset[];
  lang: Language;
  onSaveAsset: (asset: Asset) => void;
  isProvider?: boolean;
}

export const AssetManagement: React.FC<AssetManagementProps> = ({ assets, lang, onSaveAsset, isProvider }) => {
  const [activeType, setActiveType] = useState<AssetType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [showCrossSell, setShowCrossSell] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: 'STAFF',
    status: 'AVAILABLE',
    location: '',
    name: '',
    pricePerUnit: '',
    capacity: 1
  });

  const t = {
    EN: {
      title: 'Asset Orchestration',
      subtitle: 'Manage Staff, Fleet, Vessels & Lodging',
      addAsset: 'Add New Asset',
      search: 'Search assets...',
      filter: 'Filter',
      all: 'All Assets',
      staff: 'Staff',
      aircraft: 'Aircraft',
      vessels: 'Vessels',
      vehicles: 'Vehicles',
      lodging: 'Lodging',
      status: 'Status',
      location: 'Location',
      capacity: 'Capacity',
      available: 'Available',
      booked: 'Booked',
      maintenance: 'Maintenance',
      offline: 'Offline',
      name: 'Name',
      price: 'Price/Rate',
      save: 'Save Asset',
      cancel: 'Cancel',
      type: 'Type',
      role: 'Role',
      armored: 'Armored',
      availability: 'Availability',
      description: 'Full Description',
      contactName: 'Contact Name',
      image: 'Asset Image',
      video: 'Asset Video',
      uploadImage: 'Upload Image',
      uploadVideo: 'Upload Video',
      gallery: 'Photo Gallery',
      addPhoto: 'Add Photo',
      dispatch: 'Autonomous Dispatch',
      crossSell: 'Cross-Sell Services',
      revenueShare: 'Revenue Share',
      providerPortal: 'Provider Portal',
      myAssets: 'My Assets',
      viancoArmor: 'Vianco Armor Protocol',
      edit: 'Edit Asset'
    },
    ES: {
      title: 'Orquestación de Activos',
      subtitle: 'Gestione Personal, Flota, Embarcaciones y Alojamiento',
      addAsset: 'Agregar Nuevo Activo',
      search: 'Buscar activos...',
      filter: 'Filtrar',
      all: 'Todos los Activos',
      staff: 'Personal',
      aircraft: 'Aeronaves',
      vessels: 'Embarcaciones',
      vehicles: 'Vehículos',
      lodging: 'Alojamiento',
      status: 'Estado',
      location: 'Ubicación',
      capacity: 'Capacidad',
      available: 'Disponible',
      booked: 'Reservado',
      maintenance: 'Mantenimiento',
      offline: 'Fuera de Línea',
      name: 'Nombre',
      price: 'Precio/Tarifa',
      save: 'Guardar Activo',
      cancel: 'Cancelar',
      type: 'Tipo',
      role: 'Rol',
      armored: 'Blindado',
      availability: 'Disponibilidad',
      description: 'Descripción Completa',
      contactName: 'Nombre de Contacto',
      image: 'Imagen del Activo',
      video: 'Video del Activo',
      uploadImage: 'Subir Imagen',
      uploadVideo: 'Subir Video',
      gallery: 'Galería de Fotos',
      addPhoto: 'Agregar Foto',
      dispatch: 'Despacho Autónomo',
      crossSell: 'Venta Cruzada',
      revenueShare: 'Participación en Ingresos',
      providerPortal: 'Portal del Proveedor',
      myAssets: 'Mis Activos',
      viancoArmor: 'Protocolo Vianco Armor',
      edit: 'Editar Activo'
    },
    PT: {
      title: 'Orquestração de Ativos',
      subtitle: 'Gerencie Equipe, Frota, Embarcações e Hospedagem',
      addAsset: 'Adicionar Novo Ativo',
      search: 'Pesquisar ativos...',
      filter: 'Filtrar',
      all: 'Todos os Ativos',
      staff: 'Equipe',
      aircraft: 'Aeronaves',
      vessels: 'Embarcações',
      vehicles: 'Veículos',
      lodging: 'Hospedagem',
      status: 'Status',
      location: 'Localização',
      capacity: 'Capacidade',
      available: 'Disponível',
      booked: 'Reservado',
      maintenance: 'Manutenção',
      offline: 'Offline',
      name: 'Nome',
      price: 'Preço/Taxa',
      save: 'Salvar Ativo',
      cancel: 'Cancelar',
      type: 'Tipo',
      role: 'Função',
      armored: 'Blindado',
      availability: 'Disponibilidade',
      description: 'Descrição Completa',
      contactName: 'Nome do Contato',
      image: 'Imagem do Ativo',
      video: 'Vídeo do Ativo',
      uploadImage: 'Carregar Imagem',
      uploadVideo: 'Carregar Vídeo',
      gallery: 'Galeria de Fotos',
      addPhoto: 'Adicionar Foto',
      dispatch: 'Despacho Autônomo',
      crossSell: 'Venda Cruzada',
      revenueShare: 'Participação nos Lucros',
      providerPortal: 'Portal do Fornecedor',
      myAssets: 'Meus Ativos',
      viancoArmor: 'Protocolo Vianco Armor',
      edit: 'Editar Ativo'
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assetToSave = {
      ...newAsset,
      id: selectedAssetId || Math.random().toString(36).substr(2, 9),
      providerId: newAsset.providerId || 'P_NEW'
    } as Asset;
    onSaveAsset(assetToSave);
    closeModal();
  };

  const openModal = (asset?: Asset) => {
    if (asset) {
      setNewAsset(asset);
      setSelectedAssetId(asset.id);
    } else {
      setNewAsset({
        type: 'STAFF',
        status: 'AVAILABLE',
        location: '',
        name: '',
        pricePerUnit: '',
        capacity: 1,
        description: '',
        contactName: '',
        image: '',
        gallery: [],
        videoUrl: ''
      });
      setSelectedAssetId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssetId(null);
    setNewAsset({
      type: 'STAFF',
      status: 'AVAILABLE',
      location: '',
      name: '',
      pricePerUnit: '',
      capacity: 1,
      description: '',
      contactName: '',
      image: '',
      gallery: [],
      videoUrl: ''
    });
  };

  const filteredAssets = assets.filter(asset => {
    const matchesType = activeType === 'ALL' || asset.type === activeType;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || 
                         asset.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
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

  const handleDispatch = (id: string) => {
    setDispatchingId(id);
    setTimeout(() => {
      setDispatchingId(null);
      alert(lang === 'EN' ? 'Vianco Autonomous Dispatch Initiated' : 'Despacho Autónomo Vianco Iniciado');
    }, 2000);
  };

  const handleSyncCalendar = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await fetch(`/api/calendar/sync/${id}`);
      const data = await res.json();
      if (data.success) {
        alert(lang === 'EN' ? `Synced ${data.count} dates from Google Calendar` : `Sincronizadas ${data.count} fechas de Google Calendar`);
      } else {
        alert(lang === 'EN' ? 'Calendar sync failed' : 'Sincronización de calendario fallida');
      }
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setSyncingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'BOOKED': return 'bg-gold/10 text-gold border-gold/20';
      case 'MAINTENANCE': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'OFFLINE': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif italic text-white tracking-wide mb-2">
            {isProvider ? t.providerPortal : t.title}
          </h2>
          <p className="text-white/40 font-sans font-light leading-relaxed">
            {isProvider ? t.myAssets : t.subtitle}
          </p>
        </div>
        {!isProvider && (
          <div className="flex items-center gap-8 mr-auto ml-12 hidden xl:flex">
            <div className="text-center">
              <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight block mb-1">Staff Readiness</span>
              <span className="text-xl font-serif italic text-emerald-400">100%</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight block mb-1">Fleet Status</span>
              <span className="text-xl font-serif italic text-gold">Optimal</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight block mb-1">Maintenance</span>
              <span className="text-xl font-serif italic text-amber-400">2 Units</span>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder={t.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all w-full lg:w-64 text-sm"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/60">
            <Filter size={18} />
          </button>
          {isProvider && (
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/connect', { method: 'POST' });
                  const data = await res.json();
                  if (data.url) window.open(data.url, '_blank');
                } catch (err) {
                  console.error('Stripe Connect error:', err);
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-sans font-semibold uppercase tracking-tight text-xs flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              <DollarSign size={16} /> Connect Stripe
            </button>
          )}
          <button 
            onClick={() => openModal()}
            className="px-6 py-3 bg-gold text-luxury-black rounded-full font-sans font-semibold uppercase tracking-tight text-xs flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-gold/20"
          >
            <Plus size={16} /> {t.addAsset}
          </button>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-luxury-black border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-white">
                {selectedAssetId ? <Settings size={120} /> : <Plus size={120} />}
              </div>

              <h3 className="text-3xl font-serif italic tracking-wide mb-6 text-white">{selectedAssetId ? t.edit : t.addAsset}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.name}</label>
                    <input 
                      required
                      type="text"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.type}</label>
                    <select 
                      value={newAsset.type}
                      onChange={(e) => setNewAsset({...newAsset, type: e.target.value as AssetType})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    >
                      <option value="STAFF">Staff</option>
                      <option value="AIRCRAFT">Aircraft</option>
                      <option value="VESSEL">Vessel</option>
                      <option value="VEHICLE">Vehicle</option>
                      <option value="LODGING">Lodging</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.location}</label>
                    <input 
                      required
                      type="text"
                      value={newAsset.location}
                      onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.price}</label>
                    <input 
                      required
                      type="text"
                      placeholder="$0.00"
                      value={newAsset.pricePerUnit}
                      onChange={(e) => setNewAsset({...newAsset, pricePerUnit: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.capacity}</label>
                    <input 
                      required
                      type="number"
                      value={newAsset.capacity}
                      onChange={(e) => setNewAsset({...newAsset, capacity: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.contactName}</label>
                    <input 
                      required
                      type="text"
                      value={newAsset.contactName || ''}
                      onChange={(e) => setNewAsset({...newAsset, contactName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                      placeholder="Registrar Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.description}</label>
                  <textarea 
                    required
                    rows={4}
                    value={newAsset.description || ''}
                    onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans leading-relaxed resize-none text-white"
                    placeholder="Provide a detailed description of the asset..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.uploadImage}</label>
                    <div className="relative group">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewAsset({...newAsset, image: URL.createObjectURL(file)});
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl py-4 px-4 text-center group-hover:border-gold/50 transition-all">
                        <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">
                          {newAsset.image ? 'Image Selected' : 'Click to Upload'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.uploadVideo}</label>
                    <div className="relative group">
                      <input 
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNewAsset({...newAsset, videoUrl: URL.createObjectURL(file)});
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl py-4 px-4 text-center group-hover:border-gold/50 transition-all">
                        <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">
                          {newAsset.videoUrl ? 'Video Selected' : 'Click to Upload'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.gallery}</label>
                  <div className="grid grid-cols-4 gap-4">
                    {newAsset.gallery?.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="relative aspect-square group">
                      <input 
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files as FileList);
                          const urls = files.map(f => URL.createObjectURL(f));
                          setNewAsset({...newAsset, gallery: [...(newAsset.gallery || []), ...urls]});
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full h-full bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center group-hover:border-gold/50 transition-all">
                        <Plus size={16} className="text-white/40 mb-1" />
                        <span className="text-[10px] font-sans font-semibold text-white/40 uppercase tracking-tight">{t.addPhoto}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.status}</label>
                    <select 
                      value={newAsset.status}
                      onChange={(e) => setNewAsset({...newAsset, status: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="BOOKED">Booked</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                </div>

                {/* Type Specific Fields */}
                {newAsset.type === 'STAFF' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40">{t.role}</label>
                    <select 
                      value={(newAsset as any).role || 'CONCIERGE'}
                      onChange={(e) => setNewAsset({...newAsset, role: e.target.value} as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:border-gold/50 transition-all text-sm font-sans text-white"
                    >
                      <option value="PILOT">Pilot</option>
                      <option value="CAPTAIN">Captain</option>
                      <option value="CHEF">Chef</option>
                      <option value="SECURITY">Security</option>
                      <option value="BUTLER">Butler</option>
                      <option value="CONCIERGE">Concierge</option>
                    </select>
                  </div>
                )}

                {newAsset.type === 'VEHICLE' && (
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <input 
                      type="checkbox"
                      id="isArmored"
                      checked={(newAsset as any).isArmored || false}
                      onChange={(e) => setNewAsset({...newAsset, isArmored: e.target.checked} as any)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
                    />
                    <label htmlFor="isArmored" className="text-[11px] font-sans font-semibold uppercase tracking-tight text-white/40 cursor-pointer">{t.armored}</label>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-white/10 transition-all text-white"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gold text-luxury-black rounded-2xl font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-white transition-all"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-6">
        {[
          { id: 'ALL', label: t.all, icon: <Settings size={16} /> },
          { id: 'STAFF', label: t.staff, icon: <Users size={16} /> },
          { id: 'AIRCRAFT', label: t.aircraft, icon: <Plane size={16} /> },
          { id: 'VESSEL', label: t.vessels, icon: <Ship size={16} /> },
          { id: 'VEHICLE', label: t.vehicles, icon: <Car size={16} /> },
          { id: 'LODGING', label: t.lodging, icon: <Home size={16} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveType(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-semibold uppercase tracking-tight transition-all border ${
              activeType === tab.id ? 'bg-gold text-luxury-black border-gold' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={asset.id}
              className="glass-panel p-6 rounded-3xl group hover:border-gold/30 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                {getAssetIcon(asset.type)}
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-white/5 ${
                  asset.type === 'STAFF' ? 'text-purple-400' : 
                  asset.type === 'AIRCRAFT' ? 'text-blue-400' : 
                  asset.type === 'VESSEL' ? 'text-cyan-400' : 
                  asset.type === 'VEHICLE' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {getAssetIcon(asset.type)}
                </div>
                <button className="p-2 text-white/20 hover:text-gold transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <h3 className="text-xl font-serif italic tracking-wide mb-2 group-hover:text-gold transition-colors text-white">{asset.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={12} className="text-white/30" />
                <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">{asset.location}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">{t.status}</span>
                  <span className={`text-[10px] px-2 py-1 rounded-full border font-sans font-semibold uppercase tracking-tight ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">{t.capacity}</span>
                  <span className="text-xs font-sans font-medium text-white">{asset.capacity} PAX</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">Rate</span>
                  <span className="text-xs font-sans font-semibold text-gold">{asset.pricePerUnit}</span>
                </div>
                {(asset as any).supplier_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight">Partner</span>
                    <span className="text-[11px] font-sans font-medium text-white/60">{(asset as any).supplier_name}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <span className="text-[11px] font-sans font-semibold text-white/30 uppercase tracking-tight block mb-4">{t.availability}</span>
                <MiniCalendar bookedDates={asset.bookedDates || []} lang={lang} />
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {asset.type === 'STAFF' && (
                      <div className="flex items-center gap-1 text-gold">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[11px] font-sans font-semibold">{(asset as any).rating}</span>
                      </div>
                    )}
                    {asset.type === 'VEHICLE' && (asset as any).isArmored && (
                      <div className="flex items-center gap-1 text-blue-400">
                        <Shield size={10} />
                        <span className="text-[11px] font-sans font-semibold uppercase tracking-tight">Armored</span>
                      </div>
                    )}
                    {asset.type === 'VESSEL' && (
                      <span className="text-[11px] font-sans font-semibold text-white/40 uppercase tracking-tight">{(asset as any).length}</span>
                    )}
                  </div>
                </div>

                {asset.type === 'VEHICLE' && (asset as any).isArmored && (
                  <button 
                    onClick={() => handleDispatch(asset.id)}
                    disabled={dispatchingId === asset.id}
                    className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[11px] font-sans font-semibold uppercase tracking-tight hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {dispatchingId === asset.id ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} />}
                    {t.dispatch}
                  </button>
                )}

                <button 
                  onClick={() => openModal(asset)}
                  className="w-full py-3 bg-white/5 text-white border border-white/10 rounded-2xl text-[11px] font-sans font-semibold uppercase tracking-tight hover:bg-white/10 transition-all"
                >
                  {t.edit}
                </button>

                <button 
                  onClick={() => handleSyncCalendar(asset.id)}
                  disabled={syncingId === asset.id}
                  className="w-full py-3 bg-gold/10 text-gold border border-gold/20 rounded-2xl text-[11px] font-sans font-semibold uppercase tracking-tight hover:bg-gold hover:text-luxury-black transition-all flex items-center justify-center gap-2"
                >
                  {syncingId === asset.id ? <Loader2 className="animate-spin" size={12} /> : <Calendar size={12} />}
                  Sync Calendar
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Cross-Sell Modal (Mock) */}
      <AnimatePresence>
        {showCrossSell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCrossSell(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-[40px] relative z-10 flex flex-col"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-sans font-medium text-white uppercase tracking-tight">{t.crossSell}</h2>
                  <p className="text-[10px] text-gold uppercase tracking-tight font-bold">{t.revenueShare}: 15%</p>
                </div>
                <button onClick={() => setShowCrossSell(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} className="text-white/40" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <div className="bg-gold/10 p-6 rounded-3xl border border-gold/20 flex items-center gap-4">
                  <Sparkles className="text-gold" size={24} />
                  <p className="text-xs text-white/70 leading-relaxed">
                    As a certified KLO Provider, you can earn additional revenue by recommending complementary services to your clients. All bookings made through this portal are tracked to your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock Marketplace Items for Cross-Sell */}
                  {[
                    { id: 'CS1', name: 'Private Jet Empty Leg', price: '$4,500', type: 'AIRCRAFT', img: 'https://picsum.photos/seed/jet/400/300' },
                    { id: 'CS2', name: 'Luxury Yacht Day Trip', price: '$2,800', type: 'VESSEL', img: 'https://picsum.photos/seed/yacht/400/300' },
                    { id: 'CS3', name: 'Vianco Armor Transfer', price: '$850', type: 'VEHICLE', img: 'https://picsum.photos/seed/car/400/300' },
                    { id: 'CS4', name: 'Bespoke Villa Stay', price: '$3,200', type: 'LODGING', img: 'https://picsum.photos/seed/villa/400/300' },
                  ].map(item => (
                    <div key={item.id} className="bg-white/5 rounded-3xl p-4 flex gap-4 border border-white/5 group hover:border-gold/30 transition-all">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <img src={item.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <span className="text-[8px] text-gold uppercase tracking-tight font-bold">{item.type}</span>
                          <h4 className="text-sm font-sans font-medium text-white">{item.name}</h4>
                          <p className="text-xs font-bold text-white/60">{item.price}</p>
                        </div>
                        <button className="text-[10px] uppercase tracking-tight font-bold text-gold hover:text-white transition-colors flex items-center gap-1">
                          {lang === 'EN' ? 'Recommend' : 'Recomendar'} <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-white/10 bg-white/5 flex justify-end">
                <button 
                  onClick={() => setShowCrossSell(false)}
                  className="px-8 py-4 bg-gold text-luxury-black rounded-full text-[10px] uppercase tracking-tight font-bold hover:bg-white transition-all"
                >
                  {lang === 'EN' ? 'Close' : 'Cerrar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
