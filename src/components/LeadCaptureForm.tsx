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
    phone: '',
    message: ''
  });

  const t = {
    EN: {
      cta: 'Chat with Concierge',
      title: 'WhatsApp Concierge',
      subtitle: 'Instant orchestration for your next journey.',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'WhatsApp Number',
      message: 'How can we help?',
      submit: 'Start Chat',
      success: 'Request Received',
      successSub: 'A concierge will contact you via WhatsApp shortly.'
    },
    ES: {
      cta: 'Hablar con Conserje',
      title: 'Conserje WhatsApp',
      subtitle: 'Orquestación instantánea para su próximo viaje.',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de WhatsApp',
      message: '¿Cómo podemos ayudar?',
      submit: 'Iniciar Chat',
      success: 'Solicitud Recibida',
      successSub: 'Un conserje se pondrá en contacto con usted por WhatsApp en breve.'
    },
    PT: {
      cta: 'Falar com Concierge',
      title: 'Concierge WhatsApp',
      subtitle: 'Orquestração instantânea para sua próxima jornada.',
      name: 'Nome Completo',
      email: 'E-mail',
      phone: 'Número do WhatsApp',
      message: 'Como podemos ajudar?',
      submit: 'Iniciar Chat',
      success: 'Solicitação Recebida',
      successSub: 'Um concierge entrará em contato com você via WhatsApp em breve.'
    }
  }[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        const message = `Hello KLO Concierge, my name is ${formData.name}. I am interested in your luxury services.
Email: ${formData.email}
Phone: ${formData.phone}
Message: ${formData.message}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/573243132500?text=${encodedMessage}`, '_blank');

        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
          setFormData({ name: '', email: '', phone: '', message: '' });
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
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
      >
        <MessageSquare className="group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-white text-luxury-black text-[10px] font-bold rounded-full shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
          {t.cta}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-32 right-8 w-full max-w-sm bg-luxury-paper rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-white/10"
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
                <h3 className="text-2xl font-serif mb-2">{t.title}</h3>
                <p className="text-xs text-white/80 font-light">{t.subtitle}</p>
              </div>

              <div className="p-8">
                {isSuccess ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-serif">{t.success}</h4>
                    <p className="text-xs text-luxury-black/40 font-light">{t.successSub}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-luxury-black/40">{t.name}</label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-luxury-black/40">{t.email}</label>
                        <input 
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light"
                          placeholder="john@klo.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-luxury-black/40">{t.phone}</label>
                        <input 
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light"
                          placeholder="+1..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-luxury-black/40">{t.message}</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-black/5 border border-black/5 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light h-24 resize-none"
                        placeholder="I'm interested in..."
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
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
