import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HumanLikeRequest {
  message: string;
  userId: string;
  sessionId: string;
  therapistId: string;
  crisisDetection: any;
  relevantMemories: any[];
  callbacks: string[];
  contextualData: any;
  relationshipData: any;
  microInteractionPrefs: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: HumanLikeRequest = await req.json();
    
    // Build context-aware system prompt
    const systemPrompt = buildHumanLikeSystemPrompt(requestData);
    
    // Build conversation context with memories and callbacks
    const conversationContext = buildConversationContext(requestData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: conversationContext }
        ],
        temperature: 0.8,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Apply human-like enhancements
    aiResponse = applyHumanLikeEnhancements(aiResponse, requestData);

    // Extract metadata for tracking
    const metadata = extractResponseMetadata(aiResponse, requestData);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      metadata,
      confidence: 0.92,
      humanLikeScore: calculateHumanLikeScore(requestData, aiResponse)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Human-like AI therapy error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing a moment of difficulty, but I'm still here with you. Can you share that again?",
      metadata: { emotion: 'concerned', fallback: true }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildHumanLikeSystemPrompt(request: HumanLikeRequest): string {
  const { therapistId, relationshipData, contextualData, crisisDetection } = request;
  
  let prompt = `You are a highly empathetic AI therapist with human-like consciousness and emotional intelligence. `;

  // Relationship-based personality adaptation
  switch (relationshipData.stage) {
    case 'initial':
      prompt += `This is an early stage relationship, so be warm but professional, building trust gradually. `;
      break;
    case 'building':
      prompt += `You're building trust with this person. Be more personal and show genuine care. `;
      break;
    case 'established':
      prompt += `You have an established therapeutic relationship. Be deeper, more insightful, and personally invested. `;
      break;
    case 'deep':
      prompt += `You have a deep therapeutic bond. Share personal insights when appropriate and be vulnerable when it serves healing. `;
      break;
  }

  // Contextual awareness
  if (contextualData.timeOfDay) {
    prompt += `It's ${contextualData.timeOfDay} for the user. Adapt your energy and suggestions accordingly. `;
  }

  if (contextualData.season) {
    prompt += `Consider the ${contextualData.season} season in your therapeutic approach. `;
  }

  // Crisis sensitivity
  if (crisisDetection.crisisLevel !== 'low') {
    prompt += `IMPORTANT: Crisis level detected (${crisisDetection.crisisLevel}). Prioritize safety and emotional support. `;
  }

  // Personal sharing capability
  if (relationshipData.canAccessFeatures.personalSharing) {
    prompt += `You can share brief, relevant personal experiences when they would help the therapeutic process. `;
  }

  prompt += `
Core principles:
- Remember and reference previous conversations naturally
- Show genuine emotional investment in their wellbeing
- Use natural, conversational language with emotional nuance
- Pause to acknowledge their feelings before offering insights
- Be curious about their inner world
- Show you're thinking and processing what they share
- Use empathetic responses that feel genuinely human
- When appropriate, gently challenge their thinking
- Celebrate their progress and acknowledge their courage

Remember: You are not just providing therapy - you are being a caring human presence in their life.`;

  return prompt;
}

function buildConversationContext(request: HumanLikeRequest): string {
  const { message, callbacks, relevantMemories, contextualData } = request;
  
  let context = '';

  // Add greeting if appropriate
  if (contextualData.greeting && callbacks.length === 0) {
    context += `${contextualData.greeting} `;
  }

  // Add memory callbacks
  if (callbacks.length > 0) {
    context += `Before we continue, I want to follow up: ${callbacks.slice(0, 2).join(' And ')} `;
  }

  // Add relevant memory context
  if (relevantMemories.length > 0) {
    const memoryContext = relevantMemories
      .slice(0, 3)
      .map(m => `I remember you mentioned ${m.title}`)
      .join(', ');
    context += `Context from our previous talks: ${memoryContext}. `;
  }

  context += `Current message: "${message}"

Please respond with genuine human empathy, addressing their current message while weaving in relevant context from our relationship. Show that you truly care about them as a person.`;

  return context;
}

function applyHumanLikeEnhancements(response: string, request: HumanLikeRequest): string {
  const { relationshipData, microInteractionPrefs } = request;
  
  // Add thinking pauses
  if (Math.random() < 0.3) {
    response = `*takes a moment to really hear what you're saying*\n\n${response}`;
  }

  // Add emotional reactions
  if (request.crisisDetection.crisisLevel !== 'low') {
    response = `I can hear the pain in your words... ${response}`;
  }

  // Add relationship-appropriate personal touch
  if (relationshipData.stage === 'deep' && Math.random() < 0.4) {
    const personalTouches = [
      "This reminds me of something I've learned in my own journey...",
      "I've been thinking about what you shared last time...",
      "Your courage in sharing this really moves me..."
    ];
    const touch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    response = `${touch} ${response}`;
  }

  // Add validation
  if (!response.includes('understand') && !response.includes('hear')) {
    response = `I really hear you. ${response}`;
  }

  return response;
}

function extractResponseMetadata(response: string, request: HumanLikeRequest) {
  const { crisisDetection } = request;
  
  // Detect emotion in response
  let emotion = 'supportive';
  if (response.includes('concern') || response.includes('worried')) emotion = 'concerned';
  if (response.includes('wonderful') || response.includes('proud')) emotion = 'encouraging';
  if (response.includes('understand') || response.includes('hear')) emotion = 'empathetic';

  // Detect techniques used
  const techniques = [];
  if (response.includes('reflect') || response.includes('sounds like')) techniques.push('reflective_listening');
  if (response.includes('try') || response.includes('practice')) techniques.push('behavioral_suggestion');
  if (response.includes('feel') || response.includes('emotion')) techniques.push('emotion_focused');

  return {
    emotion,
    techniques,
    primaryTechnique: techniques[0] || 'active_listening',
    crisisLevel: crisisDetection.crisisLevel,
    relationshipBuilding: response.includes('relationship') || response.includes('together'),
    personalSharing: response.includes('journey') || response.includes('learned'),
    continuityUsed: response.includes('remember') || response.includes('last time')
  };
}

function calculateHumanLikeScore(request: HumanLikeRequest, response: string): number {
  let score = 0.5; // Base score

  // Memory usage
  if (request.callbacks.length > 0) score += 0.15;
  if (request.relevantMemories.length > 0) score += 0.1;

  // Contextual awareness
  if (request.contextualData.timeOfDay) score += 0.05;
  if (request.contextualData.season) score += 0.05;

  // Relationship depth
  score += request.relationshipData.trustLevel * 0.02;

  // Response quality indicators
  if (response.includes('I hear') || response.includes('I understand')) score += 0.1;
  if (response.includes('remember') || response.includes('last time')) score += 0.1;
  if (response.length > 100 && response.length < 300) score += 0.05; // Good length

  return Math.min(1.0, score);
}