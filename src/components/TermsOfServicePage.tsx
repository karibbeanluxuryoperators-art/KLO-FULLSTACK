import React from 'react';
import { ArrowLeft, FileText, CreditCard, Plane, Ship, Home, AlertTriangle } from 'lucide-react';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
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
              <FileText size={20} className="text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-text-main tracking-tight">
                Términos y Condiciones
              </h1>
              <p className="text-gold text-sm mt-1 tracking-widest uppercase">Terms of Service · v1.0 · Enero 2026</p>
            </div>
          </div>
          <p className="text-text-main/60 text-base leading-relaxed border-l-2 border-gold/40 pl-5">
            Al acceder y utilizar la plataforma de{' '}
            <strong className="text-text-main">Karibbean Luxury Operators S.A.S.</strong>,
            usted acepta vinculantes los siguientes términos y condiciones conforme al ordenamiento
            jurídico colombiano. Si no está de acuerdo, por favor no utilice nuestros servicios.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10">

          {/* Section 1 */}
          <LegalSection icon={<FileText size={16} />} title="1. Identificación de las Partes">
            <p className="text-text-main/70 leading-relaxed">
              <strong className="text-text-main">Prestador del servicio:</strong><br />
              Karibbean Luxury Operators S.A.S.<br />
              NIT: 901.234.567-8<br />
              Calle 72 #10-07, Oficina 501, Bogotá D.C., Colombia<br />
              <a href="mailto:legal@karibbeanluxury.co" className="text-gold hover:underline">
                legal@karibbeanluxury.co
              </a><br /><br />
              <strong className="text-text-main">Usuario / Cliente:</strong><br />
              Toda persona natural o jurídica que se registre y utilice la plataforma KLO,
              en adelante referred to as "el Cliente" o "el Usuario".
            </p>
          </LegalSection>

          {/* Section 2 */}
          <LegalSection icon={<Plane size={16} />} title="2. Objeto del Servicio">
            <p className="text-text-main/70 leading-relaxed mb-4">
              KLO opera como una plataforma de gestión y corretaje de experiencias turísticas
              y servicios de lujo en Colombia y el Caribe. Nuestros servicios abarcan:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { icon: '✈', label: 'Aviation' },
                { icon: '🚤', label: 'Transport' },
                { icon: '🛥', label: 'Yachts' },
                { icon: '🏨', label: 'Accommodation' },
                { icon: '👥', label: 'Staff' },
              ].map(s => (
                <div key={s.label} className="bg-luxury-black/50 border border-border-main rounded-lg p-3 text-center">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-text-main/60 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-text-main/60 text-sm mt-4 leading-relaxed">
              KLO actúa como intermediario entre el Cliente y los proveedores de servicios
              (pilotos, capitanes de-yate, hoteles, operadores terrestres). Los contratos
              de prestación de servicios finales se celebran directamente entre el Cliente
              y el proveedor correspondiente.
            </p>
          </LegalSection>

          {/* Section 3 */}
          <LegalSection icon={<CreditCard size={16} />} title="3. Reservas, Precios y Pago">
            <div className="space-y-4 text-text-main/70 leading-relaxed">
              <p>
                <strong className="text-text-main">Reservas:</strong> Las reservas se confirman
                mediante el pago total o el depósito indicado en cada oferta. KLO se reserva
                el derecho de cancelar reservas en caso de conflicto con proveedores o por
                razones de fuerza mayor.
              </p>
              <p>
                <strong className="text-text-main">Precios y recargos:</strong> Todos los precios
                incluyen la marcación del 20% de KLO. Impuestos, tasas aeroportuarias, visados,
                propinas y gastos personales no están incluidos a menos que se indique expresamente.
              </p>
              <p>
                <strong className="text-text-main">Política de cancelación:</strong>
              </p>
              <div className="border border-border-main/50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gold/10">
                      <th className="text-left p-3 text-text-main/80 text-xs uppercase tracking-wider">Tiempo de cancelación</th>
                      <th className="text-left p-3 text-text-main/80 text-xs uppercase tracking-wider">Reembolso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-main/30">
                    {[
                      { period: '+30 días antes', refund: '100% del depósito' },
                      { period: '15–30 días antes', refund: '50% del depósito' },
                      { period: '7–14 días antes', refund: '25% del depósito' },
                      { period: '<7 días antes', refund: 'Sin reembolso' },
                    ].map(r => (
                      <tr key={r.period}>
                        <td className="p-3 text-text-main/70">{r.period}</td>
                        <td className="p-3 text-gold/80">{r.refund}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                <strong className="text-text-main">Métodos de pago:</strong> Aceptamos tarjetas
                de crédito (Visa, Mastercard, Amex), transferencias bancarias y pagos en moneda
                digital según disponibilidad. Pagos internacionales pueden estar sujetos a
                comisiones cambiarias.
              </p>
            </div>
          </LegalSection>

          {/* Section 4 */}
          <LegalSection icon={<AlertTriangle size={16} />} title="4. Fuerza Mayor y Responsabilidad">
            <div className="space-y-4 text-text-main/70 leading-relaxed">
              <p>
                <strong className="text-text-main">Fuerza mayor:</strong> KLO no será responsable
                por fallas o retrasos causados por eventos fuera de su control razonable, incluyendo
                pero no limitado a: condiciones climáticas extremas, huelgas, guerras, pandemias,
                restricciones gubernamentales, fallas de proveedores o desastres naturales.
              </p>
              <p>
                <strong className="text-text-main">Responsabilidad:</strong> La responsabilidad de
                KLO se limita al valor total de los servicios contratados. KLO no es responsable
                por daños indirectos, consequenciales o lucro cesante. El Cliente exime a KLO de
                responsabilidad por lesiones personales o daños materiales durante la ejecución de
                servicios tercerizados.
              </p>
              <p>
                <strong className="text-text-main">Seguro de viaje:</strong> KLO recomienda
                encarecidamente que el Cliente contrate un seguro de viaje integral con cobertura
                médica, cancelación y evacuación de emergencia. KLO puede facilitar la coordinación
                pero no es proveedor de seguros.
              </p>
            </div>
          </LegalSection>

          {/* Section 5 */}
          <LegalSection icon={<FileText size={16} />} title="5. Obligaciones del Cliente">
            <ul className="space-y-2">
              {[
                'Proporcionar información veraz, completa y actualizada en el registro',
                'Mantener la confidencialidad de sus credenciales de acceso',
                'Notificar inmediatamente cualquier uso no autorizado de su cuenta',
                'Cumplir las leyes y regulaciones de los países de destino',
                'Portar documentación de viaje válida (pasaporte, visas, permisos)',
                'Abstenerse de conductas que puedan afectar la seguridad de otros pasajeros',
                'Respetar las normas de vestimenta y comportamiento de los proveedores',
                'Cancelar con al menos 7 días de anticipación para evitar cargos',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-text-main/70">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          {/* Section 6 */}
          <LegalSection icon={<FileText size={16} />} title="6. Propiedad Intelectual">
            <p className="text-text-main/70 leading-relaxed">
              Todo el contenido de la plataforma KLO — textos, gráficos, logotipos, imágenes,
              software y marcas registradas — es propiedad de Karibbean Luxury Operators S.A.S.
              o de sus licenciantes y está protegido por las leyes colombianas de propiedad
              intelectual (Ley 23 de 1982, Decisión 486 de la CAN). Queda prohibida la
              reproducción, distribución o modificación sin autorización expresa por escrito.
            </p>
          </LegalSection>

          {/* Section 7 */}
          <LegalSection icon={<FileText size={16} />} title="7. Resolución de Conflictos y Jurisdicción">
            <p className="text-text-main/70 leading-relaxed">
              Los presentes términos se rigen por las leyes de la República de Colombia.
              Cualquier controversia derivada de la interpretación o ejecución de este contrato
              será sometida a los tribunales competentes de{' '}
              <strong className="text-text-main">Bogotá D.C., Colombia</strong>.
              El Cliente acepta de manera expresa la jurisdicción de estos tribunales.
            </p>
            <p className="text-text-main/60 text-sm mt-3 leading-relaxed">
              Para conflictos de consumo, el Cliente puede acudir a la{' '}
              <strong className="text-text-main">Superintendencia de Industria y Comercio (SIC)</strong>{' '}
              o a los mecanismos de solución alternativa de conflictos previstos en la Ley 1480 de 2011.
            </p>
          </LegalSection>

          {/* Section 8 */}
          <LegalSection icon={<FileText size={16} />} title="8. Uso Aceptable de la Plataforma">
            <p className="text-text-main/70 leading-relaxed">
              El Cliente se compromete a utilizar la plataforma exclusivamente para fines lícitos.
              Queda prohibido: usar la plataforma para actividades ilegales; intentar acceder de
              manera no autorizada a sistemas subyacentes; realizar ingeniería inversa del software;
              enviar spam, malware o contenido malicioso; usar bots o herramientas automatizadas
              sin autorización; recopilar datos de otros usuarios sin su consentimiento.
              El incumplimiento puede resultar en la terminación inmediata de la cuenta.
            </p>
          </LegalSection>

          {/* Modifications */}
          <div className="border-t border-border-main pt-8">
            <h3 className="text-text-main font-serif text-xl mb-3">9. Modificaciones</h3>
            <p className="text-text-main/60 text-sm leading-relaxed">
              KLO puede modificar estos Términos en cualquier momento. Los cambios serán publicados
              en esta página con la fecha de vigencia actualizada. El uso continuado de la plataforma
              después de la publicación de cambios constituye aceptación de los nuevos términos.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border-main flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-main/40 text-xs">
            © 2026 Karibbean Luxury Operators S.A.S. · NIT: 901.234.567-8
          </p>
          <p className="text-text-main/40 text-xs">
            Ley 1480 de 2011 · Ley 23 de 1982 · Código de Comercio de Colombia
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
