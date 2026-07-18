import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
                Política de Privacidad
              </h1>
              <p className="text-gold text-sm mt-1 tracking-widest uppercase">Privacy Policy · v1.0 · Enero 2026</p>
            </div>
          </div>
          <p className="text-text-main/60 text-base leading-relaxed border-l-2 border-gold/40 pl-5">
            Karibbean Luxury Operators S.A.S. ("KLO", "nosotros", "nuestro"), conforme a la{' '}
            <strong className="text-text-main">Ley 1581 de 2012</strong> y el{' '}
            <strong className="text-text-main">Decreto 1377 de 2013</strong> de la República de Colombia,
            se compromete con la protección de sus datos personales. Esta Política describe cómo
            recopilamos, usamos, almacenamos y protegemos su información.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">

          {/* Section 1 */}
          <LegalSection icon={<UserCheck size={16} />} title="1. Responsable del Tratamiento de Datos">
            <p className="text-text-main/70 leading-relaxed">
              <strong className="text-text-main">Razón Social:</strong> Karibbean Luxury Operators S.A.S.<br />
              <strong className="text-text-main">NIT:</strong> 901.234.567-8<br />
              <strong className="text-text-main">Domicilio:</strong> Calle 72 #10-07, Oficina 501, Bogotá D.C., Colombia<br />
              <strong className="text-text-main">Correo:</strong>{' '}
              <a href="mailto:privacidad@karibbeanluxury.co" className="text-gold hover:underline">
                privacidad@karibbeanluxury.co
              </a><br />
              <strong className="text-text-main">Teléfono:</strong> +57 601 555 0100
            </p>
          </LegalSection>

          {/* Section 2 */}
          <LegalSection icon={<Eye size={16} />} title="2. Datos Personales Recopilados">
            <p className="text-text-main/70 leading-relaxed mb-4">
              KLO recopila los siguientes datos personales con su autorización expresa:
            </p>
            <ul className="space-y-2">
              {[
                'Nombre completo, tipo y número de documento de identificación',
                'Datos de contacto: correo electrónico, teléfono, dirección',
                'Datos de pago y facturación',
                'Preferencias de viaje, intereses y requisitos especiales',
                'Datos de geolocalización durante el uso de nuestros servicios',
                'Historial de reservas y experiencias previas',
                'Datos biométricos极少数 (fotografías, cuando aplique)',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-text-main/70">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          {/* Section 3 */}
          <LegalSection icon={<Lock size={16} />} title="3. Finalidades del Tratamiento">
            <p className="text-text-main/70 leading-relaxed mb-4">
              Sus datos personales serán tratados para los siguientes fines:
            </p>
            <ul className="space-y-2">
              {[
                'Gestionar reservas, reservas anticipadas y experiencias de viaje',
                'Personalizar y mejorar la calidad del servicio según sus preferencias',
                'Comunicar ofertas, novedades y beneficios exclusivos de KLO',
                'Cumplir obligaciones legales, fiscales y contables',
                'Gestionar solicitudes de soporte y atención al cliente',
                'Realizar análisis internos para mejora de productos y servicios',
                'Prevenir fraudes, lavados de activos y actividades ilícitas (SIC, UIAF)',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-text-main/70">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          {/* Section 4 */}
          <LegalSection icon={<Shield size={16} />} title="4. Derechos del Titular (Ley 1581, Art. 8)">
            <p className="text-text-main/70 leading-relaxed mb-4">
              Como titular de datos personales, usted tiene derecho a:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Conocer', desc: 'Acceder a sus datos personales en nuestra base de datos' },
                { title: 'Actualizar', desc: 'Corregir datos inexactos o incompletos' },
                { title: 'Eliminar', desc: 'Solicitar la eliminación de sus datos cuando proceda' },
                { title: 'Revocar', desc: 'Retirar la autorización otorgada en cualquier momento' },
                { title: 'Solicitar prueba', desc: 'Obtener prueba de la autorización otorgada' },
                { title: 'Presentar quejas', desc: 'Ante la SIC por infracciones a la Ley' },
              ].map(r => (
                <div key={r.title} className="bg-luxury-black/50 border border-border-main rounded-lg p-4">
                  <p className="text-gold text-sm font-semibold mb-1">{r.title}</p>
                  <p className="text-text-main/60 text-xs leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-text-main/50 text-sm mt-4">
              Para ejercer sus derechos, contacte a{' '}
              <a href="mailto:privacidad@karibbeanluxury.co" className="text-gold hover:underline">
                privacidad@karibbeanluxury.co
              </a>.
            </p>
          </LegalSection>

          {/* Section 5 */}
          <LegalSection icon={<Lock size={16} />} title="5. Medidas de Seguridad">
            <p className="text-text-main/70 leading-relaxed">
              KLO implementa medidas técnicas, administrativas y físicas adecuadas para proteger
              sus datos personales contra acceso no autorizado, pérdida, alteración o destrucción.
              Nuestros servidores utilizan cifrado TLS 1.3, autenticación de dos factores (2FA),
              y auditorías periódicas de seguridad. El acceso a datos personales está restringido
              a personal autorizado bajo estrictos contratos de confidencialidad.
            </p>
          </LegalSection>

          {/* Section 6 */}
          <LegalSection icon={<Mail size={16} />} title="6. Procedimiento para Atención de Reclamos">
            <p className="text-text-main/70 leading-relaxed">
              Cualquier reclamo relacionado con el tratamiento de datos personales será atendido
              en un término máximo de <strong className="text-text-main">diez (10) días hábiles</strong>{' '}
              conforme al artículo 14 de la Ley 1581. Si no es posible resolver dentro de ese plazo,
              le informaremos el motivo de la demora y la fecha de respuesta definitiva, que no excederá
              de <strong className="text-text-main">quince (15) días hábiles</strong> adicionales.
            </p>
          </LegalSection>

          {/* Section 7 */}
          <LegalSection icon={<Trash2 size={16} />} title="7. Política de Retención de Datos">
            <p className="text-text-main/70 leading-relaxed">
              Sus datos personales serán retenidos mientras sean necesarios para los fines
              descritos, o según lo exija la ley colombiana (mínimo 5 años para información
              financiera y fiscal). Tras la expiración del período de retención, sus datos serán
              eliminados de forma segura o anonimizados.
            </p>
          </LegalSection>

          {/* Section 8 */}
          <LegalSection icon={<Shield size={16} />} title="8. Transferencia Internacional de Datos">
            <p className="text-text-main/70 leading-relaxed">
              KLO puede transferir sus datos a terceros países para la prestación de servicios
              (alojamiento en la nube, pasarelas de pago). Tales transferencias se realizan
              únicamente a países con nivel adecuado de protección según la SIC, o bajo
              contratos que garanticen los estándares de la Ley 1581.
            </p>
          </LegalSection>

          {/* Section 9 */}
          <LegalSection icon={<Mail size={16} />} title="9. Uso de Cookies">
            <p className="text-text-main/70 leading-relaxed">
              Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia.
              Las cookies esenciales son necesarias para el funcionamiento del sitio. Las cookies
              analíticas y de preferencias requieren su consentimiento explícito, que puede revocar
              en cualquier momento a través de la configuración de su navegador.
            </p>
          </LegalSection>

          {/* Modifications */}
          <div className="border-t border-border-main pt-8">
            <h3 className="text-text-main font-serif text-xl mb-3">10. Modificaciones a esta Política</h3>
            <p className="text-text-main/60 text-sm leading-relaxed">
              KLO puede modificar esta Política de Privacidad en cualquier momento. Los cambios
              sustanciales serán comunicados por correo electrónico o mediante aviso destacado
              en nuestra plataforma con al menos 30 días de anticipación. El uso continuado de
              nuestros servicios después de la notificación constituye aceptación de los nuevos términos.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-main/40 text-xs">
            © 2026 Karibbean Luxury Operators S.A.S. · Todos los derechos reservados.
          </p>
          <p className="text-text-main/40 text-xs">
            Superintendencia de Industria y Comercio (SIC) · Colombia
          </p>
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
