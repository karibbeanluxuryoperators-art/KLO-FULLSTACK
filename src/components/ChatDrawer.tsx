import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage: string | null;
  lang: Language;
  onPlanGenerated?: (plan: any) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, initialMessage, lang, onPlanGenerated }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isPlanning]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setIsPlanning(true);

    try {
      const isPlanRequest = text.toLowerCase().includes('plan') || 
                           text.toLowerCase().includes('quiero') || 
                           text.toLowerCase().includes('necesito') ||
                           text.toLowerCase().includes('interested');
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          lang, 
          mode: isPlanRequest ? 'plan' : 'chat' 
        })
      });
      const data = await res.json();

      if (isPlanRequest && data.plan) {
        if (onPlanGenerated) onPlanGenerated(data.plan);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: lang === 'EN' 
            ? `I have orchestrated a bespoke 360° experience: "${data.plan.title}". Management fee of ${data.plan.managementFee} has been calculated to protect unit economics.`
            : lang === 'ES'
            ? `He orquestado una experiencia 360° a medida: "${data.plan.title}". Se ha calculado una tarifa de gestión de ${data.plan.managementFee} para proteger la economía de la unidad.`
            : `Orquestrei uma experiência 360° sob medida: "${data.plan.title}". A taxa de gerenciamento de ${data.plan.managementFee} foi calculada para proteger a economia da unidade.`
        }]);
      } else {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.text || (lang === 'EN' ? "I'm processing your request." : lang === 'ES' ? "Estoy procesando su solicitud." : "Estou processando sua solicitação.") 
        }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'EN' 
          ? "I apologize, but I encountered an error while orchestrating your request." 
          : lang === 'ES'
          ? "Lo siento, pero encontré un error al orquestar su solicitud."
          : "Sinto muito, mas encontrei um erro ao orquestrar sua solicitação."
      }]);
    } finally {
      setIsPlanning(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = message;
    setMessage('');
    handleSendMessage(text);
  };

  // STEP 5: Inside ChatDrawer / AI chat component
  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
      setMessage('');
    }
  }, [initialMessage, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed top-0 right-0 h-full w-full md:max-w-md bg-luxury-slate z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-border-main flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-luxury-black">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl">Karibbean Luxury Operators</h3>
                  <span className="text-[10px] text-gold uppercase tracking-[0.2em]">
                    {lang === 'EN' ? 'Agentic Middleware' : lang === 'ES' ? 'Middleware Agéntico' : 'Middleware Agêntico'}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-xl text-sm font-light leading-relaxed ${
                    msg.role === 'user' ? 'bg-gold text-luxury-black rounded-tr-none' : 'bg-luxury-black border border-border-main rounded-xl rounded-tl-none'
                  }`}>{msg.content}</div>
                </div>
              ))}
              {isPlanning && (
                <div className="flex justify-start">
                  <div className="bg-luxury-black border border-border-main rounded-xl p-5 rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-gold" />
                    <span className="text-xs text-text-main/50 italic">
                      {lang === 'EN' ? 'Orchestrating 360° pillars...' : lang === 'ES' ? 'Orquestando pilares 360°...' : 'Orquestrando pilares 360°...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={onSubmit} className="p-8 border-t border-border-main">
              <div className="relative">
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder={lang === 'EN' ? 'Plan a 360° experience...' : lang === 'ES' ? 'Planifica una experiencia 360°...' : 'Planeje uma experiência 360°...'} 
                  className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-5 pl-6 pr-14 focus:outline-none focus:border-gold/50 transition-colors font-light text-text-main" 
                />
                <button type="submit" disabled={isPlanning} className="absolute right-2 top-2 bottom-2 w-10 bg-gold text-luxury-black rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"><Send size={18} /></button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
