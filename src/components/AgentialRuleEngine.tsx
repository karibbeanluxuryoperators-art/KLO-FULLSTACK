import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Play, Pause, Plus, Trash2, Settings, AlertTriangle, Shield, Wind, Clock } from 'lucide-react';
import { AgentialRule, Language } from '../types';

interface RuleEngineProps {
  rules: AgentialRule[];
  lang: Language;
  onUpdateRules: (rules: AgentialRule[]) => void;
}

export const AgentialRuleEngine: React.FC<RuleEngineProps> = ({ rules, lang, onUpdateRules }) => {
  const [isAdding, setIsAdding] = useState(false);

  const t = {
    EN: {
      title: 'Agential Rule Engine',
      subtitle: 'Autonomous Logic Orchestration',
      trigger: 'Trigger',
      action: 'Action',
      lastTriggered: 'Last Triggered'
    },
    ES: {
      title: 'Motor de Reglas Agénticas',
      subtitle: 'Orquestación de Lógica Autónoma',
      trigger: 'Disparador',
      action: 'Acción',
      lastTriggered: 'Última Activación'
    },
    PT: {
      title: 'Motor de Regras Agênticas',
      subtitle: 'Orquestração de Lógica Autônoma',
      trigger: 'Gatilho',
      action: 'Ação',
      lastTriggered: 'Última Ativação'
    }
  }[lang];

  const toggleRule = (id: string) => {
    onUpdateRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r));
  };

  const deleteRule = (id: string) => {
    onUpdateRules(rules.filter(r => r.id !== id));
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'DELAY': return <Clock size={16} className="text-amber-400" />;
      case 'SECURITY': return <Shield size={16} className="text-red-400" />;
      case 'WEATHER': return <Wind size={16} className="text-blue-400" />;
      case 'TTE_CRITICAL': return <AlertTriangle size={16} className="text-orange-400" />;
      default: return <Zap size={16} className="text-gold" />;
    }
  };

  return (
    <div className="glass-panel p-8 rounded-[40px] border-purple-500/20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-serif italic tracking-wide">{t.title}</h3>
          <p className="text-luxury-cream/40 text-[11px] font-sans font-semibold uppercase tracking-tight">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-3 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className={`p-6 rounded-3xl border transition-all ${
            rule.status === 'ACTIVE' ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  {getTriggerIcon(rule.trigger)}
                </div>
                <div>
                  <span className="text-[11px] font-sans font-semibold text-luxury-cream/40 uppercase tracking-tight block">{t.trigger}: {rule.trigger}</span>
                  <span className="text-sm font-sans font-medium">{rule.condition}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-lg transition-all ${
                    rule.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-400/10' : 'text-luxury-cream/40 bg-white/5'
                  }`}
                >
                  {rule.status === 'ACTIVE' ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button 
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-luxury-black/30 rounded-2xl border border-white/5">
              <Zap size={12} className="text-gold" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-tight text-luxury-cream/60">{t.action}: {rule.action}</span>
            </div>

            {rule.lastTriggered && (
              <div className="mt-4 flex items-center gap-2 text-[10px] font-sans font-semibold text-luxury-cream/30 uppercase tracking-tight">
                <Clock size={10} />
                {t.lastTriggered}: {rule.lastTriggered}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
