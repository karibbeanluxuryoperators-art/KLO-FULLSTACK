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
    tte: string;
    location: string;
  }[];
}

// Initialize Gemini API
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function generateKLOExperience(userMessage: string): Promise<KLOExperience> {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not found. Add VITE_GEMINI_API_KEY to your environment variables.');
      return getFallbackExperience(userMessage);
    }

    const prompt = `
      You are Maria, an ultra-luxury travel concierge for KLO (Karibbean Luxury Operators).
      
      User request: "${userMessage}"
      
      Generate a COMPLETE luxury travel experience in the Caribbean with these EXACT requirements:
      
      1. Return ONLY valid JSON (no markdown, no explanations)
      2. Use this exact structure:
      {
        "title": "Luxury experience title",
        "description": "2-3 sentence description of the journey",
        "pillars": {
          "air": "Private jet from [origin] to [destination] on [aircraft type]",
          "sea": "Superyacht charter details with vessel name and amenities",
          "stay": "Ultra-luxury villa or estate details with location",
          "land": "Armored vehicle or luxury transport arrangements",
          "staff": "Private chef, butler, security team details"
        },
        "estimatedTotal": "$XXX,XXX",
        "managementFee": "$XX,XXX (20% of total)",
        "legalRequirements": ["Passport with 6+ months validity", "Travel insurance", "NDA agreement"],
        "securityBrief": {
          "level": "ELITE",
          "riskAssessment": "Low risk assessment",
          "protocols": ["24/7 security detail", "Secure comms", "Emergency evacuation plan"],
          "emergencyContacts": [
            {"name": "KLO Security", "phone": "+1-XXX-XXX-XXXX", "role": "Security Director"}
          ]
        },
        "itinerary": [
          {"time": "09:00", "activity": "Private jet departure", "pillar": "AIR", "status": "Confirmed", "tte": "15m", "location": "Departure airport"},
          {"time": "11:30", "activity": "Arrival & yacht boarding", "pillar": "SEA", "status": "Confirmed", "tte": "30m", "location": "Caribbean destination"},
          {"time": "15:00", "activity": "Villa check-in", "pillar": "STAY", "status": "Confirmed", "tte": "20m", "location": "Beachfront villa"}
        ]
      }
      
      Make it realistic for the Caribbean (Cartagena, San Andrés, Santa Marta, Bahamas, St. Barts, etc.).
      Total should be between $50,000 and $500,000 based on complexity.
      Create 4-6 itinerary items.
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return getFallbackExperience(userMessage);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini');
    }

    // Clean the response (remove markdown code blocks if present)
    let jsonText = generatedText;
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0];
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1];
    }
    
    const experience = JSON.parse(jsonText) as KLOExperience;
    return experience;
    
  } catch (error) {
    console.error('Error generating experience:', error);
    return getFallbackExperience(userMessage);
  }
}

// Fallback experience if API fails
function getFallbackExperience(userMessage: string): KLOExperience {
  return {
    title: "Ultimate Caribbean Escape",
    description: "A bespoke 5-day luxury journey through the Caribbean's most exclusive destinations, curated by KLO's elite concierge team.",
    pillars: {
      air: "Private Gulfstream G650 from Miami to Cartagena",
      sea: "112' Azimut superyacht with 6 crew members",
      stay: "Overwater villa at a private island resort",
      land: "Range Rover Autobiography with private driver",
      staff: "Michelin-starred private chef & security detail"
    },
    estimatedTotal: "$245,000",
    managementFee: "$49,000 (20% of total)",
    legalRequirements: [
      "Valid passport (6+ months)",
      "Travel insurance with medical evacuation",
      "Signed KLO confidentiality agreement"
    ],
    securityBrief: {
      level: "ELITE",
      riskAssessment: "Very low risk - vetted destination",
      protocols: [
        "24/7 personal security escort",
        "Encrypted communication devices",
        "Medical evacuation insurance verified"
      ],
      emergencyContacts: [
        { name: "Maria (AI Concierge)", phone: "+1-888-KLO-CARIB", role: "Primary Contact" }
      ]
    },
    itinerary: [
      { time: "08:00", activity: "Private jet departure from home city", pillar: "AIR", status: "Confirmed", tte: "15m", location: "Private terminal" },
      { time: "10:30", activity: "Arrival & champagne welcome", pillar: "SEA", status: "Confirmed", tte: "10m", location: "Cartagena" },
      { time: "12:00", activity: "Yacht cruise to private island", pillar: "SEA", status: "Confirmed", tte: "45m", location: "Rosario Islands" },
      { time: "15:00", activity: "Villa check-in & spa treatment", pillar: "STAY", status: "Confirmed", tte: "20m", location: "Overwater villa" },
      { time: "19:30", activity: "Private chef dinner", pillar: "STAFF", status: "Confirmed", tte: "5m", location: "Beachfront dining" }
    ]
  };
}

// Simple chat function for the concierge
export async function chatWithMaria(userMessage: string, conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      return "I need my Gemini API key to work properly. Please add VITE_GEMINI_API_KEY to your environment variables. Once configured, I can help plan your luxury Caribbean journey!";
    }

    const prompt = `
      You are Maria, an ultra-luxury travel concierge for KLO (Karibbean Luxury Operators).
      
      Previous conversation:
      ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
      
      User: ${userMessage}
      
      Respond as Maria with:
      - Warm, professional, ultra-luxury tone
      - Suggest specific Caribbean destinations (Cartagena, San Andrés, Santa Marta, Bahamas, St. Barths)
      - Mention private aviation, superyachts, and exclusive villas
      - Keep responses concise (2-3 sentences)
      - Ask clarifying questions to understand their needs
      - End with an invitation to share more details
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'd be delighted to help plan your Caribbean luxury experience. Could you share more about what you have in mind?";
    
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm experiencing technical difficulties. Please try again in a moment, or contact KLO directly for immediate assistance with your luxury travel needs.";
  }
}
