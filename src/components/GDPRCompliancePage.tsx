import React from 'react';
import { ArrowLeft, Shield, CheckCircle2, Scale, FileText, AlertTriangle, Lock, RefreshCw, Trash2, Eye } from 'lucide-react';

interface GDPRCompliancePageProps {
  onBack: () => void;
}

export function GDPRCompliancePage({ onBack }: GDPRCompliancePageProps) {
  return (
    <div className="min-h-screen bg-luxury-black text-text-main pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-2 text-gold/70 hover:text-gold text-sm mb-10 transition-colors">
          <ArrowLeft size={16} />
          <span>Volver al sitio</span>
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-text-main tracking-tight">
                Cumplimiento de Datos
              </h1>
              <p className="text-gold text-sm mt-1 tracking-widest uppercase">
                GDPR & Ley 1581 Compliance · v1.0 · Enero 2026
              </p>
            </div>
          </div>
          <p className="text-text-main/60 text-base leading-relaxed border-l-2 border-gold/40 pl-5">
            Karibbean Luxury Operators S.A.S. opera en cumplimiento con el{' '}
            <strong className="text-text-main">Reglamento General de Protección de Datos (UE) 2016/679 (GDPR)</strong>{' '}
            para ciudadanos de la Unión Europea, y con la{' '}
            <strong className="text-text-main">Ley 1581 de 2012</strong> y el{' '}
            <strong className="text-text-main">Decreto 1377 de 2013</strong> de Colombia.
            Esta página detalla nuestro marco de cumplimiento integral.
          </p>
        </div>

        {/* Notice */}
        <div className="bg-gold/5 border border-gold/30 rounded-xl p-5 mb-10 flex gap-4 items-start">
          <AlertTriangle size={18} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-text-main/80 text-sm leading-relaxed">
              <strong className="text-gold">Nota importante:</strong> Colombia no forma parte de la Unión Europea;
              por tanto, el GDPR no tiene carácter vinculante directo en Colombia. Sin embargo, KLO ha
              adoptado voluntariamente los principios del GDPR como estándar mínimo de protección, y
              aplica las garantías adicionales descritas a continuación a todos los usuarios — tanto
              residentes en la UE como en cualquier otra jurisdicción — que soliciten protección bajo
              estos estándares.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">

          {/* GDPR Principles */}
          <LegalSection icon={<Scale size={16} />} title="1. Principios GDPR Adoptados (Art. 5 GDPR)">
            <div className="space-y-4">
              {[
                {
                  title: 'Licitud, lealtad y transparencia',
                  desc: 'Todo tratamiento de datos se realiza con base en una autorización explícita, informada e inequívoca del titular. La finalidad es comunicada de forma clara antes de la recolección.'
                },
                {
                  title: 'Limitación de la finalidad',
                  desc: 'Los datos se recopilan únicamente para fines específicos, explícitos y legítimos. No se reutilizan para propósitos incompatibles sin nuevo consentimiento.'
                },
                {
                  title: 'Minimización de datos',
                  desc: 'KLO recopila únicamente los datos estrictamente necesarios para cada finalidad. Datos excesivos o no pertinentes son eliminados periódicamente.'
                },
                {
                  title: 'Exactitud',
                  desc: 'Los datos personales se mantienen precisos y actualizados. El titular tiene derecho a rectificar información inexacta en cualquier momento.'
                },
                {
                  title: 'Limitación de la conservación',
                  desc: 'Los datos se conservan únicamente durante el tiempo necesario. Se aplican políticas de retención diferenciadas según la categoría de datos.'
                },
                {
                  title: 'Integridad y confidencialidad',
                  desc: 'Se implementan medidas técnicas y organizativas apropiadas para garantizar la seguridad de los datos contra accesos no autorizados, pérdida o alteración.'
                },
                {
                  title: 'Responsabilidad proactiva (Accountability)',
                  desc: 'KLO mantiene registros de actividades de tratamiento, realiza Evaluaciones de Impacto de Protección de Datos (EIPD/DPIA) cuando es necesario, y puede demostrar cumplimiento ante autoridades.'
                },
              ].map(p => (
                <div key={p.title} className="flex items-start gap-4 p-4 bg-luxury-black/30 rounded-lg border border-border-main/30">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-main font-semibold text-sm">{p.title}</p>
                    <p className="text-text-main/60 text-sm mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </LegalSection>

          {/* Legal Basis */}
          <LegalSection icon={<FileText size={16} />} title="2. Bases Legales para el Tratamiento (Art. 6 GDPR)">
            <div className="space-y-4">
              {[
                {
                  title: 'Artículo 6(1)(a) — Consentimiento',
                  desc: 'Base principal: el usuario otorga consentimiento explícito, libre, informado e inequívoco para el tratamiento de sus datos. El consentimiento puede retirarse en cualquier momento.'
                },
                {
                  title: 'Artículo 6(1)(b) — Ejecución de contrato',
                  desc: 'El tratamiento es necesario para la ejecución de un contrato del que el interesado es parte (reservas, pagos, gestión de experiencias).'
                },
                {
                  title: 'Artículo 6(1)(c) — Obligación legal',
                  desc: 'El tratamiento es necesario para el cumplimiento de obligaciones legales (fiscales, contables, antiterrorismo, UIAF).'
                },
                {
                  title: 'Artículo 6(1)(f) — Interés legítimo',
                  desc: 'Aplicado en casos limitados, como prevención de fraude o seguridad de la plataforma, siempre que no prevalezcan los intereses del titular.'
                },
              ].map(b => (
                <div key={b.title} className="flex items-start gap-4 p-4 bg-luxury-black/30 rounded-lg border border-border-main/30">
                  <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-text-main font-semibold text-sm">{b.title}</p>
                    <p className="text-text-main/60 text-sm mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </LegalSection>

          {/* Data Subject Rights */}
          <LegalSection icon={<Shield size={16} />} title="3. Derechos del Interesado (Arts. 15–22 GDPR)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <Eye size={16} />, title: 'Acceso (Art. 15)', desc: 'Obtener copia de todos sus datos personales en nuestra posesión, incluyendo el propósito del tratamiento y los destinatarios.' },
                { icon: <RefreshCw size={16} />, title: 'Rectificación (Art. 16)', desc: 'Corregir datos inexactos o incompletos sin demora injustificada.' },
                { icon: <Trash2 size={16} />, title: 'Supresión / Derecho al Olvido (Art. 17)', desc: 'Solicitar la eliminación de datos cuando ya no sean necesarios, se retire el consentimiento, o el tratamiento sea ilícito.' },
                { icon: <Lock size={16} />, title: 'Limitación (Art. 18)', desc: 'Obtener la limitación del tratamiento en casos específicos (disputas sobre exactitud, tratamiento ilícito pendiente de supresión, etc.).' },
                { icon: <FileText size={16} />, title: 'Portabilidad (Art. 20)', desc: 'Recibir sus datos en formato estructurado, de lectura automática, y transferirlos a otro responsable sin obstáculos.' },
                { icon: <RefreshCw size={16} />, title: 'Oposición (Art. 21)', desc: 'Oponerse al tratamiento basado en interés legítimo o interés público, incluyendo la elaboración de perfiles.' },
              ].map(r => (
                <div key={r.title} className="bg-luxury-black/50 border border-border-main/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gold">{r.icon}</span>
                    <p className="text-gold text-sm font-semibold">{r.title}</p>
                  </div>
                  <p className="text-text-main/60 text-xs leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-text-main/50 text-sm mt-4">
              Para ejercer cualquiera de estos derechos, contacte:{' '}
              <a href="mailto:privacidad@karibbeanluxury.co" className="text-gold hover:underline">
                privacidad@karibbeanluxury.co
              </a>. Responderemos en un máximo de <strong className="text-text-main">30 días</strong>.
            </p>
          </LegalSection>

          {/* DPO */}
          <LegalSection icon={<Shield size={16} />} title="4. Delegado de Protección de Datos (DPO)">
            <p className="text-text-main/70 leading-relaxed">
              KLO ha designado un Delegado de Protección de Datos conforme al artículo 37 del GDPR
              y las directrices de la Autoridad Colombiana de Protección de Datos.
            </p>
            <div className="mt-4 bg-luxury-black/30 border border-border-main/30 rounded-lg p-5">
              <p className="text-text-main font-semibold text-sm mb-2">Contacto del DPO</p>
              <p className="text-text-main/60 text-sm">
                <strong className="text-text-main">Nombre:</strong> Oficial de Protección de Datos — KLO<br />
                <strong className="text-text-main">Email:</strong>{' '}
                <a href="mailto:dpo@karibbeanluxury.co" className="text-gold hover:underline">
                  dpo@karibbeanluxury.co
                </a><br />
                <strong className="text-text-main">Canal seguro:</strong> Cifrado PGP disponible bajo solicitud
              </p>
            </div>
          </LegalSection>

          {/* Data Protection by Design */}
          <LegalSection icon={<Lock size={16} />} title="5. Protección de Datos desde el Diseño (Art. 25 GDPR)">
            <div className="space-y-4 text-text-main/70 leading-relaxed">
              <p>
                KLO integra la protección de datos desde la fase de diseño de todos sus sistemas
                y servicios (Privacy by Design). Esto incluye:
              </p>
              <ul className="space-y-2">
                {[
                  'Cifrado de datos en tránsito (TLS 1.3) y en reposo (AES-256)',
                  'Pseudonimización de datos sensibles siempre que sea técnicamente posible',
                  'Segregación de datos por rol y principio de menor privilegio',
                  'Revisión de privacidad obligatoria en el desarrollo de nuevas funcionalidades',
                  'Auditorías de seguridad internas y externas al menos dos veces al año',
                  'Capacitación obligatoria en protección de datos para todo el personal',
                  'Registro de procesamiento de actividades mantenido y actualizado (Art. 30 GDPR)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </LegalSection>

          {/* Breach Notification */}
          <LegalSection icon={<AlertTriangle size={16} />} title="6. Notificación de Brechas de Seguridad (Arts. 33–34 GDPR)">
            <div className="space-y-4 text-text-main/70 leading-relaxed">
              <p>
                En caso de una brecha de seguridad que afecte datos personales, KLO notificará a la
                autoridad de control competente (<strong className="text-text-main">Superintendencia de Industria y Comercio</strong>{' '}
                en Colombia; <strong className="text-text-main">autoridad local del interesado</strong> si es residente en la UE)
                dentro de <strong className="text-text-main">72 horas</strong> de tener conocimiento del incidente,
                salvo que sea improbable que la brecha suponga un riesgo para los derechos del interesado.
              </p>
              <p>
                Si la brecha es probable que suponga un <strong className="text-text-main">riesgo alto</strong> para
                los derechos y libertades del interesado, KLO comunicará la brecha también al afectado
                de manera inmediata, describiendo: la naturaleza de la brecha, el tipo de datos afectados,
                consecuencias probables y medidas adoptadas o propuestas.
              </p>
            </div>
          </LegalSection>

          {/* Third Countries */}
          <LegalSection icon={<FileText size={16} />} title="7. Transferencias Internacionales (Arts. 44–49 GDPR)">
            <p className="text-text-main/70 leading-relaxed mb-4">
              KLO puede transferir datos a terceros países (fuera de Colombia y la UE). Tales transferencias
              se realizan únicamente bajo las siguientes garantías:
            </p>
            <ul className="space-y-2">
              {[
                { label: 'Decisión de adecuación', desc: 'Países con nivel de protección adequado reconocido por la Comisión Europea' },
                { label: 'Cláusulas contractuales tipo (SCCs)', desc: 'Contratos basados en los modelos de la Decisión (UE) 2021/914 de la Comisión' },
                { label: 'Reglas corporativas vinculantes (BCRs)', desc: 'Para transferencias intragrupo con aprobación de autoridad competente' },
                { label: 'Consentimiento explícito', desc: 'Con información clara sobre los riesgos, cuando otras garantías no estén disponibles' },
              ].map(t => (
                <li key={t.label} className="flex items-start gap-3 p-3 bg-luxury-black/30 rounded-lg border border-border-main/30">
                  <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-text-main text-sm">{t.label}:</strong>{' '}
                    <span className="text-text-main/60 text-sm">{t.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </LegalSection>

          {/* Evaluations */}
          <LegalSection icon={<FileText size={16} />} title="8. Evaluaciones de Impacto (EIPD / DPIA)">
            <p className="text-text-main/70 leading-relaxed">
              KLO realiza Evaluaciones de Impacto de Protección de Datos (EIPD) conforme al
              artículo 35 del GDPR para todo tratamiento que pueda generar un alto riesgo para
              los derechos y libertades de los interesados. Las EIPD se realizan, como mínimo,
              cuando se trata de: datos biométricos o genéticos; datos de salud; perfilado
              automatizado con efectos jurídicos; vigilancia sistemática de zonas de acceso público;
              y transferencias internacionales a países sin decisión de adecuación.
            </p>
          </LegalSection>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-main/40 text-xs">
            © 2026 Karibbean Luxury Operators S.A.S. · Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-text-main/40 text-xs">
            <span>GDPR (UE) 2016/679</span>
            <span>·</span>
            <span>Ley 1581 de 2012 (Colombia)</span>
            <span>·</span>
            <span>Decreto 1377 de 2013</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border-main/50 rounded-xl p-6 bg-luxury-black/30">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gold">{icon}</span>
        <h2 className="text-text-main font-serif text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}
