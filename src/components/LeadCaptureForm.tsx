import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface LeadCaptureFormProps {
  lang: Language;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    experience_type: 'VILLA',
    budget: '',
    travel_dates: '',
    special_requests: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = {
    EN: {
      cta: 'Chat with Concierge',
      title: 'WhatsApp Concierge',
      subtitle: 'Instant orchestration for your next journey.',
      name: 'Full Name *',
      email: 'Email Address',
      whatsapp: 'WhatsApp Number *',
      experience: 'Experience Type',
      budget: 'Estimated Budget',
      dates: 'Travel Dates',
      requests: 'Special Requests',
      submit: 'Start Chat',
      success: 'Your request has been received.',
      successSub: 'A KLO concierge will contact you via WhatsApp within 2 hours.',
      required: 'This field is required'
    },
    ES: {
      cta: 'Hablar con Conserje',
      title: 'Conserje WhatsApp',
      subtitle: 'Orquestación instantánea para su próximo viaje.',
      name: 'Nombre Completo *',
      email: 'Correo Electrónico',
      whatsapp: 'Número de WhatsApp *',
      experience: 'Tipo de Experiencia',
      budget: 'Presupuesto Estimado',
      dates: 'Fechas de Viaje',
      requests: 'Solicitudes Especiales',
      submit: 'Iniciar Chat',
      success: 'Su solicitud ha sido recibida.',
      successSub: 'Un conserje de KLO se pondrá en contacto con usted por WhatsApp en menos de 2 horas.',
      required: 'Este campo es obligatorio'
    },
    PT: {
      cta: 'Falar com Concierge',
      title: 'Concierge WhatsApp',
      subtitle: 'Orquestração instantânea para sua próxima jornada.',
      name: 'Nome Completo *',
      email: 'E-mail',
      whatsapp: 'Número do WhatsApp *',
      experience: 'Tipo de Experiência',
      budget: 'Orçamento Estimado',
      dates: 'Datas de Viagem',
      requests: 'Pedidos Especiais',
      submit: 'Iniciar Chat',
      success: 'Sua solicitação foi recebida.',
      successSub: 'Um concierge da KLO entrará em contato com você via WhatsApp em até 2 horas.',
      required: 'Este campo é obrigatório'
    }
  }[lang];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.whatsapp.trim()) newErrors.whatsapp = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'WHATSAPP' })
      });
      if (res.ok) {
        setIsSuccess(true);
        
        // Open WhatsApp with pre-filled message
        const message = `Hi KLO, I submitted an inquiry:
Name: ${formData.name}
WhatsApp: ${formData.whatsapp}
Experience: ${formData.experience_type}
Budget: ${formData.budget}
Dates: ${formData.travel_dates}
Notes: ${formData.special_requests}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
          setFormData({ 
            name: '', 
            email: '', 
            whatsapp: '', 
            experience_type: 'VILLA',
            budget: '',
            travel_dates: '',
            special_requests: ''
          });
          setErrors({});
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-32 right-8 w-full max-w-sm bg-luxury-slate rounded-3xl shadow-2xl z-[101] overflow-hidden border border-border-main"
            >
              <div className="bg-emerald-500 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <MessageSquare size={120} />
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <h3 className="text-2xl font-serif italic mb-2 text-white">{t.title}</h3>
                <p className="text-[11px] font-sans font-semibold text-white/80 uppercase tracking-tight">{t.subtitle}</p>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {isSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-serif italic text-text-main">{t.success}</h4>
                    <p className="text-[11px] font-sans font-semibold text-text-main/40 uppercase tracking-tight">{t.successSub}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.name}</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({...formData, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: ''});
                        }}
                        className={`w-full bg-luxury-slate/50 border ${errors.name ? 'border-red-500' : 'border-border-main'} rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light text-text-main`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-[10px] font-sans font-semibold text-red-500 uppercase tracking-tight">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.whatsapp}</label>
                        <input 
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) => {
                            setFormData({...formData, whatsapp: e.target.value});
                            if (errors.whatsapp) setErrors({...errors, whatsapp: ''});
                          }}
                          className={`w-full bg-luxury-slate/50 border ${errors.whatsapp ? 'border-red-500' : 'border-border-main'} rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light text-text-main`}
                          placeholder="+1..."
                        />
                        {errors.whatsapp && <p className="text-[10px] font-sans font-semibold text-red-500 uppercase tracking-tight">{errors.whatsapp}</p>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.email}</label>
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light text-text-main"
                          placeholder="john@klo.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.experience}</label>
                        <select 
                          value={formData.experience_type}
                          onChange={(e) => setFormData({...formData, experience_type: e.target.value})}
                          className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light appearance-none text-text-main"
                        >
                          <option value="VILLA">Villa</option>
                          <option value="YACHT">Yacht</option>
                          <option value="JET">Private Jet</option>
                          <option value="EVENT">Event</option>
                          <option value="CONCIERGE">Full Concierge</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.budget}</label>
                        <input 
                          type="text"
                          value={formData.budget}
                          onChange={(e) => setFormData({...formData, budget: e.target.value})}
                          className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light text-text-main"
                          placeholder="$10k+"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.dates}</label>
                      <input 
                        type="text"
                        value={formData.travel_dates}
                        onChange={(e) => setFormData({...formData, travel_dates: e.target.value})}
                        className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light text-text-main"
                        placeholder="Dec 20 - Jan 5"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/40">{t.requests}</label>
                      <textarea 
                        value={formData.special_requests}
                        onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                        className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-sans font-light h-20 resize-none text-text-main"
                        placeholder="I'm interested in..."
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-emerald-500 text-white rounded-xl font-sans font-semibold uppercase tracking-tight text-[11px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> {t.submit}</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
