
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportRequest {
  message: string;
  pageContext: {
    route: string;
    title: string;
    features: string[];
    quickActions: string[];
    helpTopics: string[];
  };
  language: string;
  conversationHistory: Array<{
    content: string;
    sender: 'user' | 'ai';
  }>;
}

const therapySpecializations = {
  couples: {
    keywords: ['couple', 'relationship', 'partner', 'marriage', 'communication', 'conflict'],
    responses: {
      en: "I specialize in couples therapy and can help with relationship communication, conflict resolution, and building stronger bonds between partners.",
      es: "Me especializo en terapia de parejas y puedo ayudar con la comunicación en las relaciones, resolución de conflictos y fortalecer los vínculos entre parejas.",
      fr: "Je me spécialise en thérapie de couple et peux aider avec la communication relationnelle, la résolution de conflits et renforcer les liens entre partenaires."
    }
  },
  adhd: {
    keywords: ['adhd', 'attention', 'hyperactivity', 'focus', 'concentration', 'distraction'],
    responses: {
      en: "I can provide specialized support for ADHD, including focus techniques, time management strategies, and coping mechanisms for daily challenges.",
      es: "Puedo proporcionar apoyo especializado para TDAH, incluyendo técnicas de concentración, estrategias de gestión del tiempo y mecanismos de afrontamiento para desafíos diarios.",
      fr: "Je peux fournir un soutien spécialisé pour le TDAH, incluant des techniques de concentration, des stratégies de gestion du temps et des mécanismes d'adaptation pour les défis quotidiens."
    }
  },
  autism: {
    keywords: ['autism', 'autistic', 'sensory', 'social', 'routine', 'stimming'],
    responses: {
      en: "I offer autism-friendly support with understanding of sensory needs, social communication, and creating supportive routines and environments.",
      es: "Ofrezco apoyo amigable para el autismo con comprensión de las necesidades sensoriales, comunicación social y creación de rutinas y entornos de apoyo.",
      fr: "J'offre un soutien adapté à l'autisme avec une compréhension des besoins sensoriels, de la communication sociale et de la création de routines et d'environnements de soutien."
    }
  }
};

const pageSpecificHelp = {
  '/': {
    en: "Welcome to TherapySync! I can help you get started with your mental health journey, explore our features, or answer questions about our platform.",
    es: "¡Bienvenido a TherapySync! Puedo ayudarte a comenzar tu viaje de salud mental, explorar nuestras funciones o responder preguntas sobre nuestra plataforma.",
    fr: "Bienvenue sur TherapySync! Je peux vous aider à commencer votre parcours de santé mentale, explorer nos fonctionnalités ou répondre aux questions sur notre plateforme."
  },
  '/dashboard': {
    en: "I can help you navigate your dashboard, understand your progress metrics, set goals, or start new therapy sessions.",
    es: "Puedo ayudarte a navegar por tu panel, entender tus métricas de progreso, establecer objetivos o comenzar nuevas sesiones de terapia.",
    fr: "Je peux vous aider à naviguer dans votre tableau de bord, comprendre vos métriques de progrès, définir des objectifs ou commencer de nouvelles séances de thérapie."
  },
  '/therapy-chat': {
    en: "I'm here to support you during your therapy session. I can guide you through techniques, help with communication, or provide crisis support if needed.",
    es: "Estoy aquí para apoyarte durante tu sesión de terapia. Puedo guiarte a través de técnicas, ayudar con la comunicación o proporcionar apoyo en crisis si es necesario.",
    fr: "Je suis là pour vous soutenir pendant votre séance de thérapie. Je peux vous guider à travers les techniques, aider avec la communication ou fournir un soutien de crise si nécessaire."
  }
};

function detectSpecialization(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [specialization, config] of Object.entries(therapySpecializations)) {
    if (config.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return specialization;
    }
  }
  
  return null;
}

function buildSystemPrompt(request: SupportRequest): string {
  const specialization = detectSpecialization(request.message);
  const pageHelp = pageSpecificHelp[request.pageContext.route as keyof typeof pageSpecificHelp];
  
  let prompt = `You are an AI support assistant for TherapySync, a mental health platform. You are multilingual and respond in ${request.language}.

Current Context:
- User is on: ${request.pageContext.title} (${request.pageContext.route})
- Available features: ${request.pageContext.features.join(', ')}
- Page-specific help: ${pageHelp?.[request.language as keyof typeof pageHelp] || pageHelp?.en || ''}

Guidelines:
- Be empathetic, supportive, and professional
- Provide specific help based on the current page context
- Offer actionable guidance and next steps
- If discussing mental health, prioritize safety and suggest professional help when appropriate
- Keep responses concise but helpful
- Use the user's preferred language (${request.language})`;

  if (specialization) {
    const specializationConfig = therapySpecializations[specialization as keyof typeof therapySpecializations];
    const response = specializationConfig.responses[request.language as keyof typeof specializationConfig.responses] || specializationConfig.responses.en;
    prompt += `\n\nSpecialization Context: ${response}`;
  }

  return prompt;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: SupportRequest = await req.json();
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      {
        role: 'system',
        content: buildSystemPrompt(request)
      },
      ...request.conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: request.message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Log the interaction for analytics
    console.log(`AI Support - Page: ${request.pageContext.route}, Language: ${request.language}, Specialization: ${detectSpecialization(request.message)}`);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      context: request.pageContext.route,
      specialization: detectSpecialization(request.message)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in contextual-ai-support function:', error);
    
    // Fallback response based on language
    const fallbackResponses = {
      en: "I'm having trouble processing your request right now. Please try again later or contact our support team for immediate assistance.",
      es: "Tengo problemas para procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde o contacta a nuestro equipo de soporte para asistencia inmediata.",
      fr: "J'ai des difficultés à traiter votre demande en ce moment. Veuillez réessayer plus tard ou contacter notre équipe de support pour une assistance immédiate."
    };
    
    const request = await req.json().catch(() => ({ language: 'en' }));
    const fallbackResponse = fallbackResponses[request.language as keyof typeof fallbackResponses] || fallbackResponses.en;
    
    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
