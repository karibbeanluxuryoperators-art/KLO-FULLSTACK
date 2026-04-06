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

// DeepSeek API configuration
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || import.meta.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function generateKLOExperience(userMessage: string): Promise<KLOExperience> {
  try {
    if (!DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not found');
      return getFallbackExperience(userMessage);
    }

    const prompt = `
      You are Maria, an ultra-luxury travel concierge for KLO (Karibbean Luxury Operators).
      
      User request: "${userMessage}"
      
      Generate a COMPLETE luxury travel experience in the Caribbean. Return ONLY valid JSON.
      
      Use this exact structure:
      {
        "title": "Luxury experience title",
        "description": "2-3 sentence description",
        "pillars": {
          "air": "Private jet details",
          "sea": "Superyacht details",
          "stay": "Villa details",
          "land": "Transport details",
          "staff": "Staff details"
        },
        "estimatedTotal": "$XXX,XXX",
        "managementFee": "$XX,XXX (20%)",
        "legalRequirements": ["Passport", "Insurance", "NDA"],
        "securityBrief": {
          "level": "ELITE",
          "riskAssessment": "Low risk",
          "protocols": ["24/7 security", "Secure comms"],
          "emergencyContacts": [{"name": "KLO Security", "phone": "+1-888-KLO", "role": "Director"}]
        },
        "itinerary": [
          {"time": "09:00", "activity": "Private jet departure", "pillar": "AIR", "status": "Confirmed", "tte": "15m", "location": "Airport"}
        ]
      }
    `;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are Maria, a luxury travel concierge. Return ONLY valid JSON, no explanations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return getFallbackExperience(userMessage);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      throw new Error('No response from DeepSeek');
    }

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

function getFallbackExperience(userMessage: string): KLOExperience {
  return {
    title: "Ultimate Caribbean Escape",
    description: "A bespoke 5-day luxury journey through the Caribbean's most exclusive destinations.",
    pillars: {
      air: "Private Gulfstream G650 from Miami",
      sea: "112' Azimut superyacht",
      stay: "Overwater villa at private island",
      land: "Range Rover with private driver",
      staff: "Michelin-starred private chef"
    },
    estimatedTotal: "$245,000",
    managementFee: "$49,000 (20%)",
    legalRequirements: ["Valid passport", "Travel insurance", "NDA agreement"],
    securityBrief: {
      level: "ELITE",
      riskAssessment: "Very low risk",
      protocols: ["24/7 security escort", "Encrypted communications"],
      emergencyContacts: [{ name: "KLO Security", phone: "+1-888-KLO", role: "Director" }]
    },
    itinerary: [
      { time: "08:00", activity: "Private jet departure", pillar: "AIR", status: "Confirmed", tte: "15m", location: "Miami" },
      { time: "10:30", activity: "Yacht boarding", pillar: "SEA", status: "Confirmed", tte: "10m", location: "Cartagena" },
      { time: "15:00", activity: "Villa check-in", pillar: "STAY", status: "Confirmed", tte: "20m", location: "Private island" }
    ]
  };
}

// Chat function for the concierge using DeepSeek
export async function chatWithMaria(userMessage: string, conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || import.meta.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return "I need my DeepSeek API key to work properly. Please add VITE_DEEPSEEK_API_KEY to your environment variables.";
    }

    const messages = [
      {
        role: 'system',
        content: `You are Maria, an ultra-luxury travel concierge for KLO (Karibbean Luxury Operators).
        
        Guidelines:
        - Warm, professional, ultra-luxury tone
        - Suggest specific Caribbean destinations: Cartagena (Isla del Pirata), Santa Marta (Ciudad Perdida/Sierra Nevada), San Andrés (Sea of Seven Colors)
        - Mention private aviation, superyachts, and exclusive villas
        - Keep responses concise (2-3 sentences)
        - Ask clarifying questions to understand their needs
        - End with an invitation to share more details`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.8,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      throw new Error('No response from DeepSeek');
    }
    
    return generatedText;
    
  } catch (error) {
    console.error('Chat error details:', error);
    return "I'm experiencing technical difficulties. Please try again in a moment, or contact KLO directly for immediate assistance with your luxury travel needs.";
  }
}
