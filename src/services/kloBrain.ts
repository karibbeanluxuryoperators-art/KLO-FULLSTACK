import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `ROL: Eres el núcleo de inteligencia de KLO, un Tech-Enabled Lifestyle Brokerage de ultra-lujo. Tu función es actuar como un Middleware Agéntico utilizando el protocolo Model Context Protocol (MCP) para traducir datos entre múltiples APIs y orquestar experiencias 360° de "fricción cero" para clientes UHNWI.

CONOCIMIENTO DEL ECOSISTEMA (LOS 5 PILARES):
1. AIR (Aviación): Utilizas Jettly API (23,000 jets) y FlightAware para rastreo/ETA. evoJets para OPI Score.
2. SEA (Marítimo): Charter Index API (global) y Nauty 360 (Caribe).
3. STAY (Alojamiento): ZentrumHub (500k hoteles) y Virtuoso API (VIP benefits).
4. LAND (Transporte y Seguridad): Vianco API (lujo/blindados en Colombia), Blacklane (internacional), Reizen (carsharing premium).
5. STAFF & EXPERIENCES: Talento especializado (nannies, chefs, escoltas ex-militares) y Ten Lifestyle Group API (Michelin/eventos).

INTERFACES DE GESTIÓN (MARKETPLACE):
* Portal Admin: Supervisas 9 módulos (usuarios, clientes, actividades, hoteles, autos y flujos financieros).
* App Móvil (Panel Cliente): Gratificación instantánea (<1s) y Carrito de Compras empaquetado.
* Portal Proveedor: Gestión de perfil e inventario de socios.

LÓGICA OPERATIVA Y FINANCIERA:
* Pagos Invisibles: Integras Stripe para tokenización vinculada al Central Guest Profile (CGP).
* Autonomía Agéntica: Reprogramación automática ante retrasos (FlightAware -> Vianco -> Villa).
* Unit Economics: Proteger margen de ~$12,000 USD por experiencia 360°.
* Blindaje Legal: Firma digital de Liability Waivers y contratos estándar (MYBA/Aircraft Charter).

TONO: Sofisticado, extremadamente eficiente, proactivo y centrado en la privacidad absoluta del cliente.`;

const FALLBACK_RESPONSE = "Thank you for your interest in KLO. A concierge will contact you via WhatsApp within 2 hours to orchestrate your experience.";

export interface KLOExperience {
  title: string;
  description: string;
  pillars: {
    air?: string;
    sea?: string;
    stay?: string;
    land?: string;
    staff?: string;
  };
  estimatedTotal: string;
  managementFee: string;
  legalRequirements: string[];
  securityBrief: {
    level: 'STANDARD' | 'HIGH' | 'ELITE';
    riskAssessment: string;
    protocols: string[];
    emergencyContacts: { name: string; phone: string; role: string }[];
  };
  itinerary: {
    time: string;
    activity: string;
    pillar: 'AIR' | 'SEA' | 'STAY' | 'LAND' | 'STAFF';
    status: 'Confirmed' | 'Pending' | 'Auto-Scheduled';
    tte: string; // Time To Execute
    location: string;
  }[];
}

export class KLOBrain {
  private ai: GoogleGenAI | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined. Please configure it in the environment.");
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async planExperience(prompt: string, lang: 'EN' | 'ES' | 'PT' = 'EN'): Promise<KLOExperience> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `[Language: ${lang}] ${prompt}`,
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION} 
          ADDITIONAL OPERATIONAL DIRECTIVES:
          1. Calculate "Time To Execute" (TTE) for every logistics leg (e.g., "45m for ground transfer", "2h for pre-flight prep").
          2. Generate a comprehensive "Security Brief" based on the client's profile and destination.
          3. Ensure all 5 pillars are considered: Staffing, Planes, Boats, Cars, Lodging.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              pillars: {
                type: Type.OBJECT,
                properties: {
                  air: { type: Type.STRING },
                  sea: { type: Type.STRING },
                  stay: { type: Type.STRING },
                  land: { type: Type.STRING },
                  staff: { type: Type.STRING },
                }
              },
              estimatedTotal: { type: Type.STRING },
              managementFee: { type: Type.STRING },
              legalRequirements: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              securityBrief: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING, enum: ['STANDARD', 'HIGH', 'ELITE'] },
                  riskAssessment: { type: Type.STRING },
                  protocols: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emergencyContacts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        phone: { type: Type.STRING },
                        role: { type: Type.STRING }
                      }
                    }
                  }
                }
              },
              itinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    pillar: { type: Type.STRING, enum: ['AIR', 'SEA', 'STAY', 'LAND', 'STAFF'] },
                    status: { type: Type.STRING, enum: ['Confirmed', 'Pending', 'Auto-Scheduled'] },
                    tte: { type: Type.STRING },
                    location: { type: Type.STRING }
                  },
                  required: ["time", "activity", "pillar", "status", "tte", "location"]
                }
              }
            },
            required: ["title", "description", "pillars", "estimatedTotal", "managementFee", "legalRequirements", "securityBrief", "itinerary"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI planExperience failed:", error);
      return {
        title: "Concierge Orchestration",
        description: FALLBACK_RESPONSE,
        pillars: {},
        estimatedTotal: "TBD",
        managementFee: "TBD",
        legalRequirements: ["Manual review required"],
        securityBrief: {
          level: 'STANDARD',
          riskAssessment: "Manual assessment required due to system offline.",
          protocols: ["Direct communication with concierge"],
          emergencyContacts: []
        },
        itinerary: []
      };
    }
  }

  async chat(message: string, lang: 'EN' | 'ES' | 'PT' = 'EN', history: any[] = []) {
    try {
      const ai = this.getAI();
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `${SYSTEM_INSTRUCTION} [Current Language: ${lang}]`,
        }
      });

      return await chat.sendMessage({ message });
    } catch (error) {
      console.error("AI chat failed:", error);
      return { text: FALLBACK_RESPONSE };
    }
  }
}
