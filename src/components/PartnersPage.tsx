import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Home, Ship, Plane, Car, Users, ArrowLeft, Send,
  Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { KLOUser } from '../firebase';

interface PartnersPageProps {
  lang: Language;
  onApply: () => void;
  onBack: () => void;
  user?: KLOUser | null;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ lang, onApply, onBack, user }) => {
  const t = {
    EN: {
      hero: {
        eyebrow: "KLO Partner Programme · Cartagena",
        title: "We are building something rare. We would like you in it.",
        sub: "KLO is assembling Cartagena's most exclusive portfolio of luxury assets. We are selective. We are small on purpose. And we look after our partners.",
        apply: "Apply to join",
        whatsapp: "WhatsApp us first"
      },
      categories: {
        eyebrow: "Who we work with",
        title: "Five pillars. One platform.",
        sub: "We accept partners across five categories. Each is vetted personally before listing.",
        villas: { name: "Villas", desc: "Private estates & residences" },
        yachts: { name: "Yachts", desc: "Vessels & maritime charters" },
        aviation: { name: "Aviation", desc: "Private jets & helicopters" },
        ground: { name: "Ground", desc: "Luxury & armored transport" },
        staff: { name: "Staff", desc: "Chefs, security, concierge" }
      },
      howItWorks: {
        eyebrow: "How it works",
        title: "Simple. Transparent. Fair.",
        sub: "From application to first booking in as little as 48 hours.",
        step1: { title: "Apply", body: "Submit your asset details. Our team reviews every application personally - no automated approvals." },
        step2: { title: "Verification", body: "A KLO representative visits or video-calls to verify your asset. We confirm quality, safety, and presentation standards." },
        step3: { title: "Listing", body: "Your asset goes live on the KLO platform. Manage availability through our partner portal or Google Calendar sync." },
        step4: { title: "Payout", body: "You receive 80% of every booking within 48 hours of guest check-in, processed automatically via Stripe." }
      },
      commercial: {
        eyebrow: "Commercial terms",
        title: "What you keep.",
        sub: "No hidden fees. No upfront costs. No lock-in contracts.",
        card1: { label: "Your share", value: "80%", body: "KLO's 20% management fee covers client acquisition, payment processing, and dedicated concierge support." },
        card2: { label: "Payout timeline", value: "48 hrs", body: "Payouts processed within 48 hours of guest check-in via Stripe. No manual invoicing." },
        card3: { label: "Upfront cost", value: "Zero", body: "No listing fees, no subscription, no setup cost. We only earn when you earn." },
        card4: { label: "Contract commitment", value: "None", body: "Pause or remove your listing at any time. We keep partners because we're good, not because they're locked in." }
      },

      cta: {
        title: "Ready to join?",
        sub: "Applications take less than 10 minutes. Our team responds within 24 hours."
      },
      back: "← Back to KLO"
    },
    ES: {
      hero: {
        eyebrow: "Programa de Socios KLO · Cartagena",
        title: "Estamos construyendo algo único. Nos gustaría que formara parte de ello.",
        sub: "KLO está reuniendo el portafolio más exclusivo de activos de lujo de Cartagena. Somos selectivos. Somos pequeños a propósito. Y cuidamos a nuestros socios.",
        apply: "Solicitar unirse",
        whatsapp: "WhatsApp primero"
      },
      categories: {
        eyebrow: "Con quiénes trabajamos",
        title: "Cinco pilares. Una plataforma.",
        sub: "Aceptamos socios en cinco categorías. Cada uno es verificado personalmente antes de listar.",
        villas: { name: "Villas", desc: "Fincas y residencias privadas" },
        yachts: { name: "Yates", desc: "Embarcaciones y chárteres marítimos" },
        aviation: { name: "Aviación", desc: "Jets privados y helicópteros" },
        ground: { name: "Terrestre", desc: "Transporte de lujo y blindado" },
        staff: { name: "Personal", desc: "Chefs, seguridad, conserjería" }
      },
      howItWorks: {
        eyebrow: "Cómo funciona",
        title: "Simple. Transparente. Justo.",
        sub: "Desde la solicitud hasta la primera reserva en tan solo 48 horas.",
        step1: { title: "Solicitar", body: "Envíe los detalles de su activo. Nuestro equipo revisa cada solicitud personalmente; sin aprobaciones automáticas." },
        step2: { title: "Verificación", body: "Un representante de KLO visita o realiza una videollamada para verificar su activo. Confirmamos los estándares de calidad, seguridad y presentación." },
        step3: { title: "Listado", body: "Su activo se publica en la plataforma KLO. Gestione la disponibilidad a través de nuestro portal de socios o la sincronización con Google Calendar." },
        step4: { title: "Pago", body: "Usted recibe el 80% de cada reserva dentro de las 48 horas posteriores al check-in del huésped, procesado automáticamente a través de Stripe." }
      },
      commercial: {
        eyebrow: "Términos comerciales",
        title: "Lo que usted conserva.",
        sub: "Sin tarifas ocultas. Sin costos iniciales. Sin contratos de permanencia.",
        card1: { label: "Su parte", value: "80%", body: "La tarifa de gestión del 20% de KLO cubre la adquisición de clientes, el procesamiento de pagos y el soporte de conserjería dedicado." },
        card2: { label: "Plazo de pago", value: "48 hrs", body: "Pagos procesados dentro de las 48 horas posteriores al check-in del huésped a través de Stripe. Sin facturación manual." },
        card3: { label: "Costo inicial", value: "Cero", body: "Sin tarifas de listado, sin suscripción, sin costo de configuración. Solo ganamos cuando usted gana." },
        card4: { label: "Compromiso contractual", value: "Ninguno", body: "Pause o elimine su listado en cualquier momento. Mantenemos a nuestros socios porque somos buenos, no porque estén atrapados." }
      },

      cta: {
        title: "¿Listo para unirse?",
        sub: "Las solicitudes tardan menos de 10 minutos. Nuestro equipo responde en 24 horas."
      },
      back: "← Volver a KLO"
    },
    PT: {
      hero: {
        eyebrow: "Programa de Parceiros KLO · Cartagena",
        title: "Estamos construindo algo raro. Gostaríamos que você fizesse parte.",
        sub: "KLO está montando o portfólio mais exclusivo de ativos de luxo de Cartagena. Somos seletivos. Somos pequenos de propósito. E cuidamos dos nossos parceiros.",
        apply: "Candidatar-se",
        whatsapp: "WhatsApp primeiro"
      },
      categories: {
        eyebrow: "Com quem trabalhamos",
        title: "Cinco pilares. Uma plataforma.",
        sub: "Aceitamos parceiros em cinco categorias. Cada um é verificado pessoalmente antes de listar.",
        villas: { name: "Vilas", desc: "Propriedades e residências privadas" },
        yachts: { name: "Iates", desc: "Embarcações e fretamentos marítimos" },
        aviation: { name: "Aviação", desc: "Jatos particulares e helicópteros" },
        ground: { name: "Terrestre", desc: "Transporte de luxo e blindado" },
        staff: { name: "Equipe", desc: "Chefs, segurança, concierge" }
      },
      howItWorks: {
        eyebrow: "Como funciona",
        title: "Simples. Transparente. Justo.",
        sub: "Da candidatura à primeira reserva em apenas 48 horas.",
        step1: { title: "Candidatar-se", body: "Envie os detalhes do seu ativo. Nossa equipe revisa cada candidatura pessoalmente - sem aprovações automáticas." },
        step2: { title: "Verificação", body: "Um representante da KLO visita ou faz uma chamada de vídeo para verificar seu ativo. Confirmamos os padrões de qualidade, segurança e apresentação." },
        step3: { title: "Listagem", body: "Seu ativo entra no ar na plataforma KLO. Gerencie a disponibilidade através do nosso portal de parceiros ou sincronização com o Google Calendar." },
        step4: { title: "Pagamento", body: "Você recebe 80% de cada reserva em até 48 horas após o check-in do hóspede, processado automaticamente via Stripe." }
      },
      commercial: {
        eyebrow: "Termos comerciais",
        title: "O que você mantém.",
        sub: "Sem taxas ocultas. Sem custos iniciais. Sem contratos de fidelidade.",
        card1: { label: "Sua parte", value: "80%", body: "A taxa de gestão de 20% da KLO cobre a aquisição de clientes, o processamento de pagamentos e o suporte de concierge dedicado." },
        card2: { label: "Prazo de pagamento", value: "48 hrs", body: "Pagamentos processados em até 48 horas após o check-in do hóspede via Stripe. Sem faturamento manual." },
        card3: { label: "Custo inicial", value: "Zero", body: "Sem taxas de listagem, sem assinatura, sem custo de configuração. Só ganhamos quando você ganha." },
        card4: { label: "Compromisso contratual", value: "Nenhum", body: "Pause ou remova sua listagem a qualquer momento. Mantemos parceiros porque somos bons, não porque eles estão presos." }
      },

      cta: {
        title: "Pronto para se juntar?",
        sub: "As candidaturas levam menos de 10 minutos. Nossa equipe responde em 24 horas."
      },
      back: "← Voltar para KLO"
    }
  }[lang];

  // ── Partner detection: if a signed-in PARTNER/ADMIN lands here, look up
  //    whether they already have a supplier record and route accordingly.
  const isPartner = user?.role === 'PARTNER' || user?.role === 'ADMIN';
  const [supplierExists, setSupplierExists] = useState<boolean | null>(null); // null = loading
  const [supplierData, setSupplierData] = useState<{ id: string; business_name?: string; status?: string } | null>(null);

  useEffect(() => {
    if (!isPartner || !user) {
      setSupplierExists(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/suppliers/lookup?uid=${encodeURIComponent(user.uid)}&email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data?.supplier) {
          setSupplierExists(true);
          setSupplierData({
            id: data.supplier.id,
            business_name: data.supplier.business_name,
            status: data.supplier.status,
          });
        } else {
          setSupplierExists(false);
        }
      } catch {
        if (!cancelled) setSupplierExists(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isPartner, user?.uid, user?.email]);

  // Override the "Apply" CTA for partners based on lookup state
  const partnerCta = {
    EN: {
      welcome: 'Welcome back, partner.',
      loading: 'Checking your application...',
      noRecord: 'No partner profile yet - apply below to get started.',
      hasRecord: 'You are already a KLO partner.',
      goDashboard: 'Go to My Dashboard',
      apply: 'Apply to join',
    },
    ES: {
      welcome: 'Bienvenido, socio.',
      loading: 'Verificando tu solicitud...',
      noRecord: 'Aún no tienes perfil de socio - solicita a continuación.',
      hasRecord: 'Ya eres socio de KLO.',
      goDashboard: 'Ir a Mi Panel',
      apply: 'Solicitar unirse',
    },
    PT: {
      welcome: 'Bem-vindo, parceiro.',
      loading: 'Verificando sua candidatura...',
      noRecord: 'Sem perfil de parceiro ainda - candidate-se abaixo.',
      hasRecord: 'Você já é parceiro KLO.',
      goDashboard: 'Ir para Meu Painel',
      apply: 'Candidatar-se',
    },
  }[lang];

  const handleApplyClick = () => {
    if (isPartner && supplierExists === false) {
      // Route to the supplier portal — match existing app navigation pattern
      window.history.pushState({}, '', '/partner');
      window.location.reload();
      return;
    }
    onApply();
  };

  const handleGoDashboard = () => {
    window.history.pushState({}, '', '/supplier/dashboard');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-luxury-black text-text-main font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 font-semibold"
          >
            {t.hero.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif italic font-light leading-tight mb-8"
          >
            {isPartner ? partnerCta.welcome : t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-main/60 font-light leading-relaxed max-w-2xl mb-12"
          >
            {isPartner
              ? (supplierExists === null ? partnerCta.loading
                 : supplierExists ? partnerCta.hasRecord
                 : partnerCta.noRecord)
              : t.hero.sub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            {isPartner && supplierExists === true ? (
              <button
                onClick={handleGoDashboard}
                className="px-8 py-4 bg-gold text-luxury-black rounded-xl font-medium text-xs tracking-wide hover:bg-text-main transition-all duration-300 flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> {partnerCta.goDashboard}
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-8 py-4 bg-gold text-luxury-black rounded-xl font-medium text-xs tracking-wide hover:bg-text-main transition-all duration-300 flex items-center gap-2"
              >
                {supplierExists === null && isPartner ? <Loader2 size={14} className="animate-spin" /> : null}
                {isPartner ? partnerCta.apply : t.hero.apply}
              </button>
            )}
            <button
              onClick={() => window.open('https://wa.me/573243132500', '_blank')}
              className="px-8 py-4 border border-border-main text-text-main rounded-xl font-medium text-xs tracking-wide hover:bg-luxury-slate/50 transition-all duration-300"
            >
              {t.hero.whatsapp}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Asset Categories Section */}
      <section className="py-20 px-6 bg-luxury-slate text-text-main">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-main/40 mb-4 font-bold">
            {t.categories.eyebrow}
          </p>
          <h2 className="text-4xl font-serif italic mb-4">{t.categories.title}</h2>
          <p className="text-sm text-text-main/60 font-light mb-12 max-w-xl">
            {t.categories.sub}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Home, ...t.categories.villas },
              { icon: Ship, ...t.categories.yachts },
              { icon: Plane, ...t.categories.aviation },
              { icon: Car, ...t.categories.ground, badge: true },
              { icon: Users, ...t.categories.staff }
            ].map((cat, i) => (
              <div key={i} className="p-6 bg-luxury-black border border-border-main rounded-xl relative group hover:border-gold/30 transition-all">
                {cat.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-gold text-[8px] uppercase font-bold rounded-md">New</span>
                )}
                <cat.icon size={24} className="text-gold mb-4" />
                <h3 className="text-sm font-serif italic mb-1">{cat.name}</h3>
                <p className="text-[10px] text-text-main/40 leading-tight">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-luxury-black">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4 font-bold">
            {t.howItWorks.eyebrow}
          </p>
          <h2 className="text-4xl font-serif italic mb-4">{t.howItWorks.title}</h2>
          <p className="text-sm text-text-main/40 font-light mb-16 max-w-xl">
            {t.howItWorks.sub}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[t.howItWorks.step1, t.howItWorks.step2, t.howItWorks.step3, t.howItWorks.step4].map((step, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-serif italic font-light text-gold/20 block mb-6">0{i+1}</span>
                <h3 className="text-lg font-serif italic mb-3">{step.title}</h3>
                <p className="text-xs text-text-main/40 leading-relaxed font-light">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Terms Section */}
      <section className="py-20 px-6 bg-luxury-slate text-text-main">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-main/40 mb-4 font-bold">
            {t.commercial.eyebrow}
          </p>
          <h2 className="text-4xl font-serif italic mb-4">{t.commercial.title}</h2>
          <p className="text-sm text-text-main/60 font-light mb-16 max-w-xl">
            {t.commercial.sub}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[t.commercial.card1, t.commercial.card2, t.commercial.card3, t.commercial.card4].map((card, i) => (
              <div key={i} className="p-8 bg-luxury-black border border-border-main rounded-xl">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-text-main/40 font-bold">{card.label}</span>
                  <span className="text-4xl font-serif italic text-gold">{card.value}</span>
                </div>
                <p className="text-xs text-text-main/60 leading-relaxed font-light">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 bg-luxury-black text-center border-t border-border-main">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-serif italic font-light mb-6">{t.cta.title}</h2>
          <p className="text-text-main/40 font-light mb-12">
            {t.cta.sub}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onApply}
              className="px-12 py-5 bg-gold text-luxury-black rounded-xl font-medium text-xs tracking-wide hover:bg-text-main transition-all duration-300"
            >
              {t.hero.apply}
            </button>
            <button
              onClick={() => window.open('https://wa.me/573243132500', '_blank')}
              className="px-12 py-5 border border-border-main text-text-main rounded-xl font-medium text-xs tracking-wide hover:bg-luxury-slate/50 transition-all duration-300"
            >
              {t.hero.whatsapp}
            </button>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="py-8 px-6 border-t border-border-main bg-luxury-black">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-[10px] text-text-main/20 uppercase tracking-widest">
            © 2026 KLO · Karibbean Luxury Operators
          </p>
          <button
            onClick={onBack}
            className="text-[10px] text-gold uppercase tracking-widest hover:text-text-main transition-colors"
          >
            {t.back}
          </button>
        </div>
      </footer>
    </div>
  );
};
