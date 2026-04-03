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
      case 'DELAY': return <Clock size={16} className="text-text-main/40" />;
      case 'SECURITY': return <Shield size={16} className="text-red-400" />;
      case 'WEATHER': return <Wind size={16} className="text-text-main/60" />;
      case 'TTE_CRITICAL': return <AlertTriangle size={16} className="text-gold" />;
      default: return <Zap size={16} className="text-gold" />;
    }
  };

  return (
    <div className="admin-card p-8 rounded-2xl border-border-main">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-serif italic tracking-wide text-text-main">{t.title}</h3>
          <p className="text-text-main/40 text-[11px] font-sans font-semibold uppercase tracking-tight">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-3 bg-gold/10 text-gold rounded-full border border-gold/20 hover:bg-gold/20 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className={`p-6 rounded-2xl border transition-all ${
            rule.status === 'ACTIVE' ? 'bg-luxury-slate/50 border-border-main' : 'bg-luxury-slate/20 border-border-main/50 opacity-50'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-luxury-slate/50 rounded-xl">
                  {getTriggerIcon(rule.trigger)}
                </div>
                <div>
                  <span className="text-[11px] font-sans font-semibold text-text-main/40 uppercase tracking-tight block">{t.trigger}: {rule.trigger}</span>
                  <span className="text-sm font-sans font-medium text-text-main">{rule.condition}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-lg transition-all ${
                    rule.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-400/10' : 'text-text-main/40 bg-luxury-slate/50'
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

            <div className="flex items-center gap-3 p-3 bg-luxury-black/50 rounded-xl border border-border-main">
              <Zap size={12} className="text-gold" />
              <span className="text-[11px] font-sans font-semibold uppercase tracking-tight text-text-main/60">{t.action}: {rule.action}</span>
            </div>

            {rule.lastTriggered && (
              <div className="mt-4 flex items-center gap-2 text-[10px] font-sans font-semibold text-text-main/30 uppercase tracking-tight">
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
