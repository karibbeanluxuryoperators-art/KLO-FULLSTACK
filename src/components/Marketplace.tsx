import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Plane, Ship, Car, Home, 
  Search, Filter, Star, MapPin, 
  ChevronRight, ArrowRight, Shield, Sparkles,
  Calendar, Clock, DollarSign, ShoppingBag, Trash2, X, Loader2, MessageSquare,
  CreditCard, Hexagon
} from 'lucide-react';
import { Asset, AssetType, Language } from '../types';
import { MiniCalendar } from './MiniCalendar';

interface MarketplaceProps {
  assets: Asset[];
  lang: Language;
  initialSuccess?: boolean;
  onBack?: () => void;
  onBookAssets: (assets: Asset[]) => void;
  setChatOpen: (open: boolean) => void;
  setChatPreload: (msg: string | null) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  assets: initialAssets, 
  lang, 
  initialSuccess, 
  onBack,
  onBookAssets,
  setChatOpen,
  setChatPreload
}) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AssetType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetAvailability, setAssetAvailability] = useState<string[]>([]);
  const [cart, setCart] = useState<Asset[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [chatPreloadLocal, setChatPreloadLocal] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    startDate: '',
    endDate: '',
    specialRequests: '',
    pax: 1
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'usdc'>('card');

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/assets?status=ACTIVE')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const parsedAssets = data.map(a => ({
            ...a,
            amenities: typeof a.amenities === 'string'
              ? JSON.parse(a.amenities || '[]') : a.amenities,
            images: typeof a.images === 'string'
              ? JSON.parse(a.images || '[]') : a.images,
            image: typeof a.images === 'string'
              ? JSON.parse(a.images || '[]')[0] : a.images?.[0]
          }));
          setAssets(parsedAssets);
        } else {
          setAssets(initialAssets);
        }
      })
      .catch(err => {
        console.error('Failed to fetch active assets', err);
        setAssets(initialAssets);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialAssets]);

  React.useEffect(() => {
    if (selectedAsset) {
      fetch(`/api/assets/${selectedAsset.id}/availability`)
        .then(res => res.json())
        .then(data => {
          const blockedDates = data
            .filter((a: any) => a.status === 'BLOCKED')
            .map((a: any) => a.date);
          setAssetAvailability(blockedDates);
        })
        .catch(err => console.error('Failed to fetch availability', err));
    } else {
      setAssetAvailability([]);
    }
  }, [selectedAsset]);

  React.useEffect(() => {
    if (initialSuccess) {
      setIsBookingModalOpen(true);
      setBookingStep(3);
    }
  }, [initialSuccess]);

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
      total: 'Est. Total',
      guestInfo: 'Guest Information',
      confirmBooking: 'Confirm Booking',
      next: 'Next Step',
      prev: 'Previous Step',
      fullName: 'Full Name',
      email: 'Email Address',
      dates: 'Journey Dates',
      requests: 'Special Requests',
      pax: 'Number of Guests',
      success: 'Booking Confirmed',
      successSub: 'Your luxury journey is being orchestrated.'
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
      total: 'Total Est.',
      guestInfo: 'Información del Huésped',
      confirmBooking: 'Confirmar Reserva',
      next: 'Siguiente Paso',
      prev: 'Paso Anterior',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      dates: 'Fechas del Viaje',
      requests: 'Solicitudes Especiales',
      pax: 'Número de Huéspedes',
      success: 'Reserva Confirmada',
      successSub: 'Su viaje de lujo está siendo orquestado.'
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
      total: 'Total Est.',
      guestInfo: 'Informações do Hóspede',
      confirmBooking: 'Confirmar Reserva',
      next: 'Próximo Passo',
      prev: 'Passo Anterior',
      fullName: 'Nome Completo',
      email: 'E-mail',
      dates: 'Datas da Jornada',
      requests: 'Pedidos Especiais',
      pax: 'Número de Hóspedes',
      success: 'Reserva Confirmada',
      successSub: 'Sua jornada de luxo está sendo orquestrada.'
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

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsBookingModalOpen(true);
    setBookingStep(1);
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      // Save booking to DB first
      for (const item of cart) {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asset_id: item.id,
            guest_name: bookingData.guestName,
            guest_email: bookingData.guestEmail,
            start_date: bookingData.startDate,
            end_date: bookingData.endDate,
            total_price: item.pricePerUnit,
            notes: bookingData.specialRequests
          })
        });
      }

      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          successUrl: `${window.location.origin}?booking=success`,
          cancelUrl: `${window.location.origin}?booking=cancel`,
          paymentMethod: paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback for mock/no-key
        onBookAssets(cart);
        setBookingStep(3);
        setCart([]);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback
      onBookAssets(cart);
      setBookingStep(3);
      setCart([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsAppRequest = (asset: Asset) => {
    const message = `Hello KLO Concierge, I am interested in requesting a booking for:
Asset: ${asset.name}
Location: ${asset.location}
Rate: ${asset.pricePerUnit}

Please let me know the availability and next steps.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const renderBookingModal = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => bookingStep !== 3 && setIsBookingModalOpen(false)}
        className="absolute inset-0 bg-luxury-black/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full h-full md:h-auto md:max-w-2xl bg-luxury-black border border-white/[0.07] rounded-none md:rounded-2xl p-6 md:p-10 shadow-2xl overflow-y-auto custom-scrollbar"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
          <Shield size={160} />
        </div>

        {bookingStep === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-sans font-medium text-white mb-2">{t.guestInfo}</h3>
              <p className="text-[11px] text-white/40 font-sans uppercase tracking-tight">Step 1 of 2: Personal Details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">{t.fullName}</label>
                <input 
                  type="text"
                  value={bookingData.guestName}
                  onChange={(e) => setBookingData({...bookingData, guestName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all text-sm text-white font-light"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">{t.email}</label>
                <input 
                  type="email"
                  value={bookingData.guestEmail}
                  onChange={(e) => setBookingData({...bookingData, guestEmail: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all text-sm text-white font-light"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">{t.pax}</label>
                <input 
                  type="number"
                  value={bookingData.pax}
                  onChange={(e) => setBookingData({...bookingData, pax: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all text-sm text-white font-light"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">{t.dates}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-gold/50 transition-all text-[10px] text-white font-light"
                  />
                  <input 
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-gold/50 transition-all text-[10px] text-white font-light"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">{t.requests}</label>
              <textarea 
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all text-sm text-white font-light h-32 resize-none"
                placeholder="Any special preferences or security requirements..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-5 border border-white/10 rounded-xl font-medium text-xs tracking-wide text-white/40 hover:bg-white/5 transition-all"
              >
                {t.back}
              </button>
              <button 
                onClick={() => setBookingStep(2)}
                disabled={!bookingData.guestName || !bookingData.guestEmail}
                className="flex-1 py-5 bg-gold text-luxury-black rounded-full font-medium text-xs tracking-wide hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-gold"
              >
                {t.next}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-sans font-medium text-white mb-2">{t.confirmBooking}</h3>
              <p className="text-[11px] text-white/40 font-sans uppercase tracking-tight">Step 2 of 2: Review Journey</p>
            </div>

            <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight">Guest</span>
                <span className="text-sm text-white font-medium">{bookingData.guestName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight">Journey</span>
                <span className="text-sm text-white font-medium">{cart.length} {t.items}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight">Investment</span>
                <span className="text-xl text-gold font-light">{calculateTotal()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-sans uppercase tracking-tight text-white/40">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'card' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-gold text-luxury-black' : 'bg-white/10 text-white'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Pay by card</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tight">Visa, Mastercard, Amex</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('usdc')}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    paymentMethod === 'usdc' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${paymentMethod === 'usdc' ? 'bg-gold text-luxury-black' : 'bg-white/10 text-white'}`}>
                    <Hexagon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Pay with USDC</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tight">Digital dollar · instant settlement</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setBookingStep(1)}
                className="flex-1 py-5 border border-white/10 rounded-xl font-medium text-xs tracking-wide text-white/40 hover:bg-white/5 transition-all"
              >
                {t.prev}
              </button>
              <button 
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="flex-1 py-5 bg-gold text-luxury-black rounded-full font-medium text-xs tracking-wide hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : t.confirmBooking}
              </button>
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="text-center py-12 space-y-8">
            <div className="w-24 h-24 bg-gold/20 text-gold rounded flex items-center justify-center mx-auto mb-8">
              <Shield size={48} />
            </div>
            <div>
              <h3 className="text-4xl font-serif italic tracking-wide text-white mb-4">{t.success}</h3>
              <p className="text-sm text-white/60 font-light max-w-md mx-auto">{t.successSub}</p>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 py-5 bg-gold text-luxury-black rounded-full font-medium text-xs tracking-wide hover:bg-white transition-all"
              >
                Return to Marketplace
              </button>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi KLO, I just completed a booking.\nGuest: ${bookingData.guestName}
\nEmail: ${bookingData.guestEmail}\nDates: ${bookingData.startDate} to
${bookingData.endDate}\nAssets: ${cart.map(a => a.name).join(', ')}
\nRequests: ${bookingData.specialRequests}`
                )}`}
                target='_blank' rel='noopener noreferrer'
                className="px-12 py-5 bg-[#25D366] text-white rounded-xl font-medium
                text-xs tracking-wide hover:bg-[#20bd5a] transition-all
                flex items-center justify-center gap-2 mt-4"
              >
                <MessageSquare size={16} /> Confirm with Concierge
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderCart = () => (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed top-0 right-0 h-full w-full md:max-w-md bg-luxury-black z-[150] shadow-2xl flex flex-col border-l border-white/10"
      >
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-luxury-black">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-sans font-medium text-white">{t.cart}</h2>
            <p className="text-[11px] text-gold font-sans uppercase tracking-tight font-semibold">{cart.length} {t.items}</p>
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
            <div key={item.id} className="bg-[#111109] border border-white/[0.07] rounded-xl p-4 flex gap-4 group">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={`https://picsum.photos/seed/${item.id}/200/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-sans font-medium text-white truncate">{item.name}</h4>
                <p className="text-[11px] text-white/40 font-sans uppercase tracking-tight mb-2">{item.location}</p>
                <span className="text-xs font-bold text-gold">{item.pricePerUnit}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 self-start text-white/20 hover:text-gold transition-colors"
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
            <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight">{t.total}</span>
            <span className="text-2xl font-light text-gold">{calculateTotal()}</span>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full py-5 bg-gold text-luxury-black rounded-full font-medium text-xs tracking-wide hover:bg-white transition-all flex items-center justify-center gap-3"
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        <button 
          onClick={() => setSelectedAsset(null)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-medium text-xs tracking-wide text-white hover:bg-white/10 transition-all shadow-sm group mb-8 md:mb-12"
        >
          <ChevronRight className="rotate-180 group-hover:text-gold transition-colors" size={14} /> {t.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8 group">
              <img 
                src={asset.image || `https://picsum.photos/seed/${asset.id}/1200/800`} 
                alt={asset.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8">
                <span className="px-4 py-2 bg-gold text-luxury-black rounded-full text-[11px] font-semibold font-sans uppercase tracking-tight mb-4 inline-block">
                  {asset.type}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif italic tracking-wide text-white">{asset.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-6 text-center">
                <MapPin size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight block mb-1">{t.location}</span>
                <span className="text-sm font-medium text-white">{asset.location}</span>
              </div>
              <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-6 text-center">
                <Users size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight block mb-1">{t.capacity}</span>
                <span className="text-sm font-medium text-white">{asset.capacity} PAX</span>
              </div>
              <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-6 text-center">
                <DollarSign size={20} className="text-gold mx-auto mb-2" />
                <span className="text-[11px] font-sans text-white/40 uppercase tracking-tight block mb-1">{t.rate}</span>
                <span className="text-sm font-bold text-gold">{asset.pricePerUnit}</span>
              </div>
            </div>

            <div className="space-y-8">
              {asset.description && (
                <div>
                  <h3 className="text-xl font-sans font-medium mb-4 text-white">{t.description}</h3>
                  <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
                    {asset.description}
                  </p>
                </div>
              )}

              {asset.gallery && asset.gallery.length > 0 && (
                <div>
                  <h3 className="text-xl font-sans font-medium mb-4 text-white">{t.gallery}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {asset.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {asset.videoUrl && (
                <div>
                  <h3 className="text-xl font-sans font-medium mb-4 text-white">{t.video}</h3>
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                    <video 
                      src={asset.videoUrl} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-sans font-medium mb-4 text-white">{t.features}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {asset.type === 'STAFF' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Star size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Rating: {(asset as any).rating}/5.0</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Users size={16} className="text-gold" />
                        <span className="text-sm text-white/70">{(asset as any).languages.join(', ')}</span>
                      </div>
                    </>
                  )}
                  {asset.type === 'AIRCRAFT' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Plane size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Range: {(asset as any).range}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Shield size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Tail: {(asset as any).tailNumber}</span>
                      </div>
                    </>
                  )}
                  {asset.type === 'VESSEL' && (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Ship size={16} className="text-gold" />
                        <span className="text-sm text-white/70">Length: {(asset as any).length}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
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
            <div className="bg-[#111109] border border-gold/20 rounded-xl p-8">
              <h3 className="text-2xl font-sans font-medium mb-6 flex items-center gap-3 text-white">
                <Calendar size={24} className="text-gold" /> {t.availability}
              </h3>
              <MiniCalendar bookedDates={assetAvailability.length > 0 ? assetAvailability : (asset.bookedDates || [])} lang={lang} />
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={() => {
                    addToCart(asset);
                    setSelectedAsset(null);
                  }}
                  className="w-full sm:flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-xl font-medium text-xs tracking-wide hover:bg-white/10 transition-all flex items-center justify-center gap-3 min-h-[44px]"
                >
                  {t.addToJourney} <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => {
                    const msg = `I am interested in the ${asset.name} in ${asset.location}. It is a ${asset.type} at ${asset.pricePerUnit}. Can you help me plan an experience with this?`;
                    setChatPreload(msg);
                    setChatOpen(true);
                  }}
                  className="w-full sm:flex-1 py-5 bg-gold text-luxury-black rounded-full font-medium text-xs tracking-wide hover:bg-white transition-all flex items-center justify-center gap-3 min-h-[44px]"
                >
                  <Sparkles size={18} />
                  {lang === 'EN' ? 'Plan this Experience' : lang === 'ES' ? 'Planificar esta Experiencia' : 'Planejar esta Experiência'}
                </button>
              </div>
            </div>

            <div className="bg-[#111109] border border-white/[0.07] rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold/10 text-gold rounded-xl">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-lg text-white">{t.managedBy}</h4>
                  <p className="text-[11px] text-white/40 font-sans uppercase tracking-tight">{asset.contactName || 'Elite Operations Team'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gold/10 text-gold rounded-xl">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-lg text-white">Elite Protection</h4>
                  <p className="text-[11px] text-white/40 font-sans uppercase tracking-tight">Standard Protocol Active</p>
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
      {/* Home Button */}
      {onBack && (
        <div className="fixed top-8 left-8 z-[140]">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-sans uppercase tracking-tight font-semibold text-white hover:bg-white/10 transition-all shadow-sm group"
          >
            <Home size={14} className="group-hover:text-gold transition-colors" /> 
            {lang === 'EN' ? 'Back to Home' : lang === 'ES' ? 'Volver al Inicio' : 'Voltar ao Início'}
          </button>
        </div>
      )}

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

      <AnimatePresence>
        {isBookingModalOpen && renderBookingModal()}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-end gap-8"
          >
            <div>
              {onBack && (
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-gold hover:text-white transition-colors mb-4 uppercase tracking-tight text-[10px] font-bold"
                >
                  <ChevronRight className="rotate-180" size={14} />
                  {lang === 'EN' ? 'Back to Home' : lang === 'ES' ? 'Volver al Inicio' : 'Voltar ao Início'}
                </button>
              )}
              <span className="text-gold font-sans uppercase tracking-tight text-[11px] mb-2 block font-semibold">{t.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-serif italic tracking-wide text-white">{t.title}</h1>
            </div>
            
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-gold/50 transition-all text-sm font-light text-white"
              />
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto flex-nowrap gap-4 mb-12 pb-4 custom-scrollbar">
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
              className={`flex items-center gap-2 px-8 py-4 rounded-full text-[11px] font-sans uppercase tracking-tight transition-all border shrink-0 min-h-[44px] ${
                activeTab === tab.id ? 'bg-gold text-luxury-black font-semibold border-gold shadow-lg shadow-gold/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-gold/50" size={32} />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Refining Inventory...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                <Search size={40} />
              </div>
              <div>
                <p className="text-xl font-sans font-medium text-white mb-2">New assets being verified. Check back soon.</p>
                <p className="text-sm text-white/40 font-light">Our concierge team is currently onboarding new exclusive inventory.</p>
              </div>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hello%20KLO%2C%20I%20am%20looking%20for%20specific%20luxury%20assets%20not%20listed%20in%20the%20marketplace.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gold text-luxury-black rounded-full font-semibold uppercase tracking-tight text-[11px] hover:bg-white transition-all flex items-center gap-2"
              >
                <MessageSquare size={16} /> Contact Concierge via WhatsApp
              </a>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={asset.id}
                  className="bg-[#111109] border border-white/[0.07] rounded-xl overflow-hidden group cursor-pointer hover:border-gold/30 transition-all"
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
                    <div className="absolute top-4 right-4 px-3 py-1 bg-luxury-black/60 backdrop-blur-md rounded-full text-[9px] font-sans uppercase tracking-tight border border-white/10 text-white">
                      {asset.type}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-sans font-medium text-white mb-1">{asset.name}</h3>
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin size={12} />
                        <span className="text-[11px] font-sans uppercase tracking-tight">{asset.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/30 font-sans uppercase tracking-tight mb-1">{t.capacity}</span>
                          <span className="text-xs font-sans font-medium text-white">{asset.capacity} PAX</span>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/30 font-sans uppercase tracking-tight mb-1">{t.rate}</span>
                          <span className="text-xs font-sans font-semibold text-gold">{asset.pricePerUnit}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-gold group-hover:text-luxury-black transition-all text-white">
                        <ArrowRight size={18} />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const msg = `I am interested in the ${asset.name} in ${asset.location}. It is a ${asset.type} at ${asset.pricePerUnit}. Can you help me plan an experience with this?`;
                        setChatPreload(msg);
                        setChatOpen(true);
                      }}
                      className="w-full mt-4 py-3 bg-gold text-luxury-black rounded-full font-semibold uppercase tracking-tight text-[11px] hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={14} />
                      {lang === 'EN' ? 'Plan this Experience' : lang === 'ES' ? 'Planificar esta Experiencia' : 'Planejar esta Experiência'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedAsset && renderAssetDetails(selectedAsset)}
      </AnimatePresence>
    </div>
  );
};
