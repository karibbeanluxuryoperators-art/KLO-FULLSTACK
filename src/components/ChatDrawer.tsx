import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { chatWithMaria, generateKLOExperience } from '../services/kloBrain';

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

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage = lang === 'EN' 
        ? "✨ Welcome to KLO. I'm Maria, your AI luxury travel concierge. Whether you dream of private jets, superyachts, or exclusive villas across the Caribbean, I'm here to orchestrate every detail. What destination speaks to you today?"
        : lang === 'ES'
        ? "✨ Bienvenido a KLO. Soy Maria, tu conserje de lujo IA. Ya sea que sueñes con jets privados, superyates o villas exclusivas en el Caribe, estoy aquí para orquestar cada detalle. ¿Qué destino te inspira hoy?"
        : "✨ Bem-vindo à KLO. Sou Maria, sua concierge de luxo IA. Estou aqui para orquestrar cada detalhe. Qual destino te inspira hoje?";
      
      setChatHistory([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [isOpen, lang]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setIsPlanning(true);

    try {
      // Check if this is a planning request
      const isPlanRequest = text.toLowerCase().includes('plan') || 
                           text.toLowerCase().includes('quiero') || 
                           text.toLowerCase().includes('necesito') ||
                           text.toLowerCase().includes('interested') ||
                           text.toLowerCase().includes('trip') ||
                           text.toLowerCase().includes('viaje') ||
                           text.toLowerCase().includes('journey');

      if (isPlanRequest) {
        // Generate a full experience using Gemini
        const experience = await generateKLOExperience(text);
        
        if (onPlanGenerated) {
          onPlanGenerated(experience);
        }
        
        // Add assistant response with plan summary
        const planResponse = lang === 'EN' 
          ? `🎉 I've orchestrated a bespoke 360° experience: *"${experience.title}"*\n\n${experience.description}\n\n**Estimated Total:** ${experience.estimatedTotal}\n**Management Fee:** ${experience.managementFee}\n\nI've prepared a complete itinerary for you above. Would you like me to adjust anything or proceed with booking?`
          : lang === 'ES'
          ? `🎉 He orquestrado una experiencia 360° a medida: *"${experience.title}"*\n\n${experience.description}\n\n**Total Estimado:** ${experience.estimatedTotal}\n**Tarifa de Gestión:** ${experience.managementFee}\n\nHe preparado un itinerario completo para ti arriba. ¿Te gustaría ajustar algo o proceder con la reserva?`
          : `🎉 Orquestrei uma experiência 360° sob medida: *"${experience.title}"*\n\n${experience.description}\n\n**Total Estimado:** ${experience.estimatedTotal}\n**Taxa de Gestão:** ${experience.managementFee}\n\nPreparei um itinerário completo para você acima. Gostaria de ajustar algo ou prosseguir com a reserva?`;
        
        setChatHistory(prev => [...prev, { role: 'assistant', content: planResponse }]);
      } else {
        // Regular chat using Maria AI
        const conversationHistory = chatHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));
        
        const response = await chatWithMaria(text, conversationHistory);
        setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = lang === 'EN' 
        ? "I apologize, but I encountered an error while orchestrating your request. Please try again in a moment."
        : lang === 'ES'
        ? "Lo siento, encontré un error al orquestar tu solicitud. Por favor, intenta de nuevo en un momento."
        : "Sinto muito, encontrei um erro ao orquestrar sua solicitação. Por favor, tente novamente em um momento.";
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
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

  // Handle initial message from marketplace
  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
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
                    {lang === 'EN' ? 'AI Concierge · Maria' : lang === 'ES' ? 'Conserje IA · Maria' : 'Concierge IA · Maria'}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-xl text-sm font-light leading-relaxed ${
                    msg.role === 'user' ? 'bg-gold text-luxury-black rounded-tr-none' : 'bg-luxury-black border border-border-main rounded-xl rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isPlanning && (
                <div className="flex justify-start">
                  <div className="bg-luxury-black border border-border-main rounded-xl p-5 rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-gold" />
                    <span className="text-xs text-text-main/50 italic">
                      {lang === 'EN' ? 'Maria is orchestrating your journey...' : lang === 'ES' ? 'Maria está orquestando tu viaje...' : 'Maria está orquestrando sua jornada...'}
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
                  placeholder={lang === 'EN' ? 'Tell Maria what you envision...' : lang === 'ES' ? 'Dile a Maria lo que imaginas...' : 'Diga à Maria o que você imagina...'} 
                  className="w-full bg-luxury-slate/50 border border-border-main rounded-xl py-5 pl-6 pr-14 focus:outline-none focus:border-gold/50 transition-colors font-light text-text-main" 
                />
                <button type="submit" disabled={isPlanning} className="absolute right-2 top-2 bottom-2 w-10 bg-gold text-luxury-black rounded-xl flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
