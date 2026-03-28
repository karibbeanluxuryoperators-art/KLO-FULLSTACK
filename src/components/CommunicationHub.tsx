import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Shield, Send, Users, User, Lock, Search, MoreVertical, Paperclip } from 'lucide-react';
import { ChatMessage, Language } from '../types';

interface CommunicationHubProps {
  messages: ChatMessage[];
  lang: Language;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ messages, lang }) => {
  const [activeChat, setActiveChat] = useState(messages[0]?.senderId || '');
  const [newMessage, setNewMessage] = useState('');

  const t = {
    EN: {
      search: 'Search conversations...',
      activeNow: 'Active Now • End-to-End Encrypted',
      typeMessage: 'Type an encrypted message...'
    },
    ES: {
      search: 'Buscar conversaciones...',
      activeNow: 'Activo Ahora • Cifrado de Extremo a Extremo',
      typeMessage: 'Escribe un mensaje cifrado...'
    },
    PT: {
      search: 'Pesquisar conversas...',
      activeNow: 'Ativo Agora • Criptografado de Ponta a Ponta',
      typeMessage: 'Digite uma mensagem criptografada...'
    }
  }[lang];

  const chatList = Array.from(new Set(messages.map(m => m.senderId))).map(id => {
    return messages.find(m => m.senderId === id)!;
  });

  const activeMessages = messages.filter(m => m.senderId === activeChat);

  return (
    <div className="glass-panel rounded-2xl border-white/10 overflow-hidden flex h-[600px]">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/5 bg-white/[0.02] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-cream/30" size={14} />
            <input 
              type="text" 
              placeholder={t.search}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chatList.map((chat) => (
            <button 
              key={chat.senderId}
              onClick={() => setActiveChat(chat.senderId)}
              className={`w-full p-6 flex gap-4 transition-all border-b border-white/5 ${
                activeChat === chat.senderId ? 'bg-gold/5 border-r-2 border-r-gold' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-luxury-cream/40">
                <User size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">{chat.senderName}</span>
                  <span className="text-[8px] text-luxury-cream/30 uppercase">{chat.timestamp}</span>
                </div>
                <p className="text-[10px] text-luxury-cream/40 truncate">{chat.content}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[8px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10 uppercase tracking-widest">
                    {chat.senderRole}
                  </span>
                  {chat.isEncrypted && <Lock size={8} className="text-emerald-400" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-luxury-black/20">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gold/10 text-gold rounded-xl flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold">{messages.find(m => m.senderId === activeChat)?.senderName}</h4>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[8px] text-luxury-cream/40 uppercase tracking-widest">{t.activeNow}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-luxury-cream/40 hover:text-gold transition-all"><Shield size={18} /></button>
            <button className="p-2 text-luxury-cream/40 hover:text-gold transition-all"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.senderRole === 'ADMIN' 
                  ? 'bg-gold text-luxury-black rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className="mt-2 flex items-center justify-end gap-2 opacity-40">
                  <span className="text-[8px] uppercase tracking-widest">{msg.timestamp}</span>
                  {msg.isEncrypted && <Lock size={8} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5">
          <div className="relative">
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-cream/30 hover:text-gold transition-all">
              <Paperclip size={18} />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t.typeMessage}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-16 text-sm focus:outline-none focus:border-gold/50"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gold text-luxury-black rounded-xl hover:bg-white transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
