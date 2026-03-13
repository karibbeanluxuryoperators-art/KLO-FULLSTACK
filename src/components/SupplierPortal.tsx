import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Ship, Plane, Users, ChevronLeft, ChevronRight, 
  Check, Calendar, Globe, Shield, DollarSign, Camera, 
  MapPin, Clock, Star, Info, MessageSquare, ExternalLink,
  Loader2, CheckCircle2, ArrowRight
} from 'lucide-react';

const STEPS = [
  "Welcome",
  "Profile",
  "Availability",
  "Review",
  "Success"
];

const LOCATIONS = ["Cartagena", "Santa Marta", "Bogotá", "Barranquilla", "San Andrés", "Other"];
const AIRCRAFT_TYPES = ["Turboprop", "Light Jet", "Midsize Jet", "Heavy Jet", "Ultra Long Range", "Helicopter"];
const STAFF_ROLES = ["Private Chef", "Security", "DJ", "Driver", "Butler", "Medical", "Photographer", "Other"];
const LANGUAGES = ["ES", "EN", "PT", "FR", "IT"];

const VILLA_AMENITIES = ["Pool", "Beach Access", "Chef's Kitchen", "Gym", "Helipad", "Security Room", "Private Dock", "Cinema Room"];
const YACHT_FEATURES = ["Water toys", "Jet ski", "Dive equipment", "Fishing gear", "Tender"];

export const SupplierPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [type, setType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    // Common
    business_name: '',
    contact_name: '',
    email: '',
    whatsapp: '+57 ',
    location: 'Cartagena',
    experience: '',
    description: '',
    photo_url: '',
    // Villa
    bedrooms: '',
    max_guests: '',
    price_per_night: '',
    amenities: [],
    // Yacht
    vessel_length: '',
    crew_included: 'no',
    price_per_day: '',
    home_port: '',
    features: [],
    // Aviation
    aircraft_type: 'Light Jet',
    tail_number: '',
    max_passengers: '',
    price_per_hour: '',
    home_base: '',
    range: '',
    // Staff
    role: 'Private Chef',
    languages: [],
    daily_rate: '',
    certifications: '',
    // Calendar
    seasonal_pricing: false,
    high_season_price: '',
    low_season_price: '',
    manual_availability: []
  });

  const nextStep = () => {
    setDirection(1);
    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleTypeSelect = (selectedType: string) => {
    setType(selectedType);
    nextStep();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[name] || [];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v: string) => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const toggleDate = (dateStr: string) => {
    setFormData((prev: any) => {
      const current = prev.manual_availability || [];
      if (current.includes(dateStr)) {
        return { ...prev, manual_availability: current.filter((d: string) => d !== dateStr) };
      } else {
        return { ...prev, manual_availability: [...current, dateStr] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Register Supplier
      const supplierRes = await fetch('/api/suppliers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.business_name,
          contact_name: formData.contact_name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          location: formData.location,
          asset_type: type,
          description: formData.description
        })
      });
      const supplierData = await supplierRes.json();
      
      if (!supplierData.success) {
        throw new Error(supplierData.error || 'Failed to register supplier');
      }

      const sid = supplierData.supplier_id;
      setSupplierId(sid);

      // Map asset type
      const mappedType = type === 'VILLA' ? 'LODGING' : 
                         type === 'YACHT' ? 'VESSEL' :
                         type === 'AVIATION' ? 'AIRCRAFT' :
                         'STAFF';

      // 2. Create Asset
      const assetPayload = {
        supplier_id: sid,
        name: formData.business_name,
        type: mappedType,
        location: formData.location,
        description: formData.description,
        price_per_unit: type === 'VILLA' ? formData.price_per_night : 
                        type === 'YACHT' ? formData.price_per_day :
                        type === 'AVIATION' ? formData.price_per_hour :
                        formData.daily_rate,
        price_type: type === 'VILLA' ? 'PER_NIGHT' : 
                    type === 'YACHT' ? 'PER_DAY' :
                    type === 'AVIATION' ? 'PER_HOUR' :
                    'PER_DAY',
        capacity: parseInt(formData.max_guests || formData.max_passengers || '0'),
        amenities: type === 'VILLA' ? formData.amenities : 
                   type === 'YACHT' ? formData.features : 
                   [],
        images: formData.photo_url ? [formData.photo_url] : [],
        status: 'PENDING'
      };

      const assetRes = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assetPayload)
      });
      const assetData = await assetRes.json();

      if (!assetData.success) {
        throw new Error(assetData.error || 'Failed to create asset');
      }

      if (formData.manual_availability.length > 0) {
        // 3. Save Availability
        await fetch(`/api/assets/${assetData.asset_id}/availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dates: formData.manual_availability,
            status: 'BLOCKED'
          })
        });
      }

      // WhatsApp notification
      window.open('https://wa.me/573243132500?text=' +
      encodeURIComponent(
        `New KLO supplier application:\n` +
        `Business: ${formData.business_name}\n` +
        `Type: ${type}\n` +
        `Location: ${formData.location}\n` +
        `WhatsApp: ${formData.whatsapp}`
      ), '_blank');

      nextStep();
    } catch (error: any) {
      console.error("Submission failed", error);
      setSubmitError(error.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const renderStep1 = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gold/20">
          <span className="text-luxury-black font-bold text-3xl">K</span>
        </div>
        <h1 className="text-5xl font-serif text-luxury-black uppercase tracking-tight">Become a KLO Verified Partner</h1>
        <p className="text-luxury-black/60 font-light text-xl max-w-2xl mx-auto">
          Join the Caribbean's premier ultra-luxury network. Reach UHNW clients worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 'VILLA', label: 'Villa Owner', icon: Home, color: 'bg-emerald-500/10 text-emerald-500' },
          { id: 'YACHT', label: 'Yacht / Boat Operator', icon: Ship, color: 'bg-blue-500/10 text-blue-500' },
          { id: 'AVIATION', label: 'Private Aviation', icon: Plane, color: 'bg-purple-500/10 text-purple-500' },
          { id: 'STAFF', label: 'Staffing & Services', icon: Users, color: 'bg-amber-500/10 text-amber-500' },
        ].map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTypeSelect(item.id)}
            className="glass-panel p-8 rounded-[40px] text-center space-y-6 group border-white/10 hover:border-gold/50 transition-all duration-500"
          >
            <div className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
              <item.icon size={40} />
            </div>
            <h3 className="text-xl font-serif uppercase tracking-wider">{item.label}</h3>
            <div className="w-10 h-1 bg-gold/20 mx-auto group-hover:w-20 transition-all" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif uppercase">Business Profile</h2>
        <div className="px-4 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
          {type} Partner
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-10">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Business / Asset Name</label>
            <input name="business_name" value={formData.business_name} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="e.g. Villa Serenity" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Contact Name</label>
            <input name="contact_name" value={formData.contact_name} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="Full Name" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">WhatsApp Number</label>
            <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="+57 300..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Location</label>
            <select name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light appearance-none">
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Years of Experience</label>
            <input name="experience" type="number" value={formData.experience} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="5" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Description (Max 500 chars)</label>
          <textarea name="description" maxLength={500} value={formData.description} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light h-32 resize-none" placeholder="Describe your luxury offering..." />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Primary Photo URL</label>
          <div className="relative">
            <input name="photo_url" value={formData.photo_url} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 pl-14 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="https://..." />
            <Camera className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-black/20" size={20} />
          </div>
          <p className="text-[10px] text-luxury-black/30 italic">Full photo upload coming soon</p>
        </div>

        <div className="h-[1px] bg-black/5 w-full" />

        {/* Type Specific Fields */}
        {type === 'VILLA' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Bedrooms</label>
                <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Max Guests</label>
                <input name="max_guests" type="number" value={formData.max_guests} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Price per Night (USD)</label>
                <input name="price_per_night" type="number" value={formData.price_per_night} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VILLA_AMENITIES.map(a => (
                  <button key={a} onClick={() => handleCheckboxChange('amenities', a)} className={`p-4 rounded-2xl border text-xs transition-all ${formData.amenities.includes(a) ? 'bg-gold border-gold text-luxury-black font-bold' : 'border-black/5 hover:border-gold/30'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {type === 'YACHT' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Vessel Length (ft)</label>
                <input name="vessel_length" type="number" value={formData.vessel_length} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Max Guests</label>
                <input name="max_guests" type="number" value={formData.max_guests} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Price per Day (USD)</label>
                <input name="price_per_day" type="number" value={formData.price_per_day} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Home Port</label>
                <input name="home_port" value={formData.home_port} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Crew Included?</label>
                <div className="flex gap-4">
                  {['yes', 'no'].map(o => (
                    <button key={o} onClick={() => setFormData((prev: any) => ({ ...prev, crew_included: o }))} className={`flex-1 py-4 rounded-2xl border text-xs uppercase tracking-widest transition-all ${formData.crew_included === o ? 'bg-gold border-gold text-luxury-black font-bold' : 'border-black/5'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {YACHT_FEATURES.map(f => (
                  <button key={f} onClick={() => handleCheckboxChange('features', f)} className={`p-4 rounded-2xl border text-xs transition-all ${formData.features.includes(f) ? 'bg-gold border-gold text-luxury-black font-bold' : 'border-black/5 hover:border-gold/30'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {type === 'AVIATION' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Aircraft Type</label>
                <select name="aircraft_type" value={formData.aircraft_type} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light appearance-none">
                  {AIRCRAFT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Tail Number</label>
                <input name="tail_number" value={formData.tail_number} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Max Passengers</label>
                <input name="max_passengers" type="number" value={formData.max_passengers} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Price per Hour (USD)</label>
                <input name="price_per_hour" type="number" value={formData.price_per_hour} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Home Base (IATA)</label>
                <input name="home_base" value={formData.home_base} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="CTG" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Range (nm)</label>
                <input name="range" type="number" value={formData.range} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
            </div>
          </div>
        )}

        {type === 'STAFF' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light appearance-none">
                  {STAFF_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Daily Rate (USD)</label>
                <input name="daily_rate" type="number" value={formData.daily_rate} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Languages Spoken</label>
              <div className="flex flex-wrap gap-4">
                {LANGUAGES.map(l => (
                  <button key={l} onClick={() => handleCheckboxChange('languages', l)} className={`w-16 h-16 rounded-2xl border text-xs font-bold transition-all ${formData.languages.includes(l) ? 'bg-gold border-gold text-luxury-black' : 'border-black/5 hover:border-gold/30'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Certifications</label>
              <input name="certifications" value={formData.certifications} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="e.g. Michelin Star, PADI Instructor..." />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={prevStep} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-black/40 hover:text-luxury-black transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={nextStep} className="px-12 py-4 bg-gold text-luxury-black rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white transition-all">
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const renderCalendarGrid = (month: number, year: number) => {
      const days = getDaysInMonth(month, year);
      const firstDay = new Date(year, month, 1).getDay();
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      
      return (
        <div className="space-y-4">
          <h4 className="text-sm font-serif uppercase tracking-wider text-center">{monthName} {year}</h4>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[8px] text-center text-luxury-black/20 font-bold">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isBlocked = formData.manual_availability.includes(dateStr);
              return (
                <button
                  key={day}
                  onClick={() => toggleDate(dateStr)}
                  className={`aspect-square rounded-lg text-[10px] flex items-center justify-center transition-all ${isBlocked ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-serif uppercase">Connect Your Availability</h2>
          <p className="text-luxury-black/40 font-light">Choose how you want to manage your bookings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center">
              <Globe size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif uppercase">Connect Google Calendar</h3>
              <p className="text-xs text-luxury-black/40 font-light leading-relaxed">
                Your bookings and blocked dates will sync automatically every 24 hours.
              </p>
            </div>
            <button 
              onClick={() => window.location.href = `/api/calendar/auth/new_supplier`}
              className="w-full py-4 border border-blue-500/30 text-blue-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <ExternalLink size={16} /> Connect Google
            </button>
          </div>

          <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-serif uppercase">Set Manually</h3>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {renderCalendarGrid(currentMonth, currentYear)}
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> Available</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> Blocked</div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-serif uppercase">Seasonal Pricing</h3>
              <p className="text-xs text-luxury-black/40 font-light">Do you have different pricing by season?</p>
            </div>
            <button 
              onClick={() => setFormData((prev: any) => ({ ...prev, seasonal_pricing: !prev.seasonal_pricing }))}
              className={`w-16 h-8 rounded-full transition-all relative ${formData.seasonal_pricing ? 'bg-gold' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.seasonal_pricing ? 'left-9' : 'left-1'}`} />
            </button>
          </div>

          <AnimatePresence>
            {formData.seasonal_pricing && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">High Season (Dec-Apr)</label>
                  <div className="relative">
                    <input name="high_season_price" type="number" value={formData.high_season_price} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 pl-12 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="0" />
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-black/20" size={16} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-luxury-black/40 font-bold">Low Season (May-Nov)</label>
                  <div className="relative">
                    <input name="low_season_price" type="number" value={formData.low_season_price} onChange={handleInputChange} className="w-full bg-black/5 border border-black/5 rounded-2xl py-4 px-6 pl-12 focus:outline-none focus:border-gold/50 transition-all font-light" placeholder="0" />
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-black/20" size={16} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between pt-8">
          <button onClick={prevStep} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-black/40 hover:text-luxury-black transition-colors">
            <ChevronLeft size={16} /> Back
          </button>
          <button onClick={nextStep} className="px-12 py-4 bg-gold text-luxury-black rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-white transition-all">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif uppercase">Review & Submit</h2>
        <p className="text-luxury-black/40 font-light">Please verify all information before submitting for verification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-8">
          <h3 className="text-xl font-serif uppercase border-b border-black/5 pb-4">Business Details</h3>
          <div className="space-y-4">
            {[
              { label: 'Business', value: formData.business_name },
              { label: 'Contact', value: formData.contact_name },
              { label: 'Email', value: formData.email },
              { label: 'WhatsApp', value: formData.whatsapp },
              { label: 'Location', value: formData.location },
              { label: 'Type', value: type },
            ].map(i => (
              <div key={i.label} className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-luxury-black/40">{i.label}</span>
                <span className="text-sm font-medium">{i.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[48px] border-white/10 space-y-8">
          <h3 className="text-xl font-serif uppercase border-b border-black/5 pb-4">Asset Details</h3>
          <div className="space-y-4">
            {type === 'VILLA' && (
              <>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Bedrooms</span><span className="text-sm font-medium">{formData.bedrooms}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Guests</span><span className="text-sm font-medium">{formData.max_guests}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Price</span><span className="text-sm font-medium">${formData.price_per_night}/night</span></div>
              </>
            )}
            {type === 'YACHT' && (
              <>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Length</span><span className="text-sm font-medium">{formData.vessel_length}ft</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Guests</span><span className="text-sm font-medium">{formData.max_guests}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Price</span><span className="text-sm font-medium">${formData.price_per_day}/day</span></div>
              </>
            )}
            {type === 'AVIATION' && (
              <>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Type</span><span className="text-sm font-medium">{formData.aircraft_type}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Tail #</span><span className="text-sm font-medium">{formData.tail_number}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Price</span><span className="text-sm font-medium">${formData.price_per_hour}/hour</span></div>
              </>
            )}
            {type === 'STAFF' && (
              <>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Role</span><span className="text-sm font-medium">{formData.role}</span></div>
                <div className="flex justify-between items-center"><span className="text-[10px] uppercase tracking-widest text-luxury-black/40">Rate</span><span className="text-sm font-medium">${formData.daily_rate}/day</span></div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-[48px] border-gold/20 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-serif uppercase">KLO Partnership Terms</h3>
        </div>
        <p className="text-sm text-luxury-black/60 font-light leading-relaxed">
          KLO charges a 20% commission on all bookings. You receive 80% of the booking value. Payment is processed within 48 hours of check-in.
        </p>
        <label className="flex items-center gap-4 cursor-pointer group">
          <div 
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${agreedToTerms ? 'bg-gold border-gold' : 'border-black/10 group-hover:border-gold/50'}`}
          >
            {agreedToTerms && <Check size={16} className="text-luxury-black" />}
          </div>
          <span className="text-xs uppercase tracking-widest font-bold">I agree to KLO Partnership Terms</span>
        </label>
      </div>

      {submitError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs text-center">
          {submitError}
        </div>
      )}

      <div className="flex justify-between pt-8">
        <button onClick={prevStep} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-black/40 hover:text-luxury-black transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className="px-16 py-6 bg-gold text-luxury-black rounded-3xl font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-gold/20"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Star size={18} />}
          Submit for Verification
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="w-32 h-32 bg-gold rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-gold/30">
        <CheckCircle2 size={64} className="text-luxury-black" />
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-serif uppercase tracking-tight">Application Received</h1>
        <p className="text-luxury-black/60 font-light text-xl leading-relaxed">
          Our team will verify your assets within 48 hours. You will receive a WhatsApp confirmation at <span className="text-gold font-bold">{formData.whatsapp}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-12">
        <a 
          href="https://wa.me/573243132500" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
        >
          <MessageSquare size={18} /> Contact via WhatsApp
        </a>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full py-6 glass-panel border-white/10 text-luxury-black rounded-3xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white transition-all"
        >
          Explore KLO Marketplace <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-paper pb-40">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-black/5 z-[60]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
            className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          />
        </div>
      )}

      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
