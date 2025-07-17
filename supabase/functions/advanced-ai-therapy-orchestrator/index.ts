import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enhanced AI model selection based on context
function selectOptimalModel(context: any) {
  // Crisis situations - use most capable model
  if (context.crisisLevel && context.crisisLevel !== 'none') {
    return { model: 'claude-opus-4-20250514', provider: 'anthropic' };
  }

  // Cultural sensitivity requirements
  if (context.culturalContext && Object.keys(context.culturalContext).length > 0) {
    return { model: 'claude-sonnet-4-20250514', provider: 'anthropic' };
  }

  // High engagement sessions - use advanced model
  if (context.engagementLevel && context.engagementLevel > 0.8) {
    return { model: 'claude-sonnet-4-20250514', provider: 'anthropic' };
  }

  // Breakthrough moments - use most capable model
  if (context.breakthroughProbability && context.breakthroughProbability > 0.6) {
    return { model: 'claude-opus-4-20250514', provider: 'anthropic' };
  }

  // Default to efficient model
  return { model: 'gpt-4.1-2025-04-14', provider: 'openai' };
}

// Enhanced crisis detection with multiple validation layers
function detectCrisisIndicators(message: string, sessionHistory: any[]): any {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
    'no point living', 'better off dead', 'cant take it anymore',
    'worthless', 'hopeless', 'trapped', 'burden'
  ];

  const indicators = [];
  let riskScore = 0;
  let urgencyLevel = 'none';

  // Direct crisis language detection
  const directCrisisWords = crisisKeywords.filter(keyword => 
    message.toLowerCase().includes(keyword)
  );

  if (directCrisisWords.length > 0) {
    indicators.push('direct_crisis_language');
    riskScore += 0.8;
  }

  // Emotional intensity analysis
  const emotionalWords = ['overwhelmed', 'desperate', 'alone', 'scared', 'panic'];
  const emotionalMatches = emotionalWords.filter(word => 
    message.toLowerCase().includes(word)
  );

  if (emotionalMatches.length >= 2) {
    indicators.push('high_emotional_intensity');
    riskScore += 0.3;
  }

  // Historical pattern analysis
  const recentMessages = sessionHistory.slice(-5);
  const negativePattern = recentMessages.filter(msg => 
    msg.content && (msg.content.includes('cant') || msg.content.includes('never'))
  );

  if (negativePattern.length >= 3) {
    indicators.push('negative_pattern_detected');
    riskScore += 0.4;
  }

  // Determine urgency level
  if (riskScore >= 0.8) urgencyLevel = 'immediate';
  else if (riskScore >= 0.6) urgencyLevel = 'high';
  else if (riskScore >= 0.4) urgencyLevel = 'medium';
  else if (riskScore >= 0.2) urgencyLevel = 'low';

  return {
    detected: riskScore > 0,
    urgencyLevel,
    riskScore,
    indicators,
    recommendedActions: generateCrisisRecommendations(urgencyLevel)
  };
}

function generateCrisisRecommendations(urgencyLevel: string): string[] {
  switch (urgencyLevel) {
    case 'immediate':
      return [
        'Immediate professional intervention required',
        'Contact emergency services',
        'Activate safety plan',
        'Notify emergency contacts'
      ];
    case 'high':
      return [
        'Schedule urgent professional consultation',
        'Activate safety monitoring',
        'Provide crisis hotline numbers',
        'Increase session frequency'
      ];
    case 'medium':
      return [
        'Schedule earlier follow-up',
        'Provide coping strategies',
        'Monitor closely',
        'Offer additional support resources'
      ];
    case 'low':
      return [
        'Continue regular monitoring',
        'Provide preventive coping strategies',
        'Note for future reference'
      ];
    default:
      return [];
  }
}

// Enhanced therapy technique selection
function selectTherapyTechnique(context: any): any {
  const { currentPhase, emotionalState, culturalContext, userHistory } = context;

  let technique = 'active_listening';
  let approach = 'supportive';
  let culturalAdaptations = {};

  // Phase-specific technique selection
  switch (currentPhase) {
    case 'opening':
      technique = 'rapport_building';
      approach = 'welcoming';
      break;
    case 'assessment':
      technique = 'reflective_questioning';
      approach = 'exploratory';
      break;
    case 'intervention':
      // Select based on emotional state and effectiveness history
      if (emotionalState?.anxiety > 0.7) {
        technique = 'breathing_exercises';
        approach = 'calming';
      } else if (emotionalState?.depression > 0.7) {
        technique = 'behavioral_activation';
        approach = 'encouraging';
      } else {
        technique = 'cognitive_restructuring';
        approach = 'analytical';
      }
      break;
    case 'practice':
      technique = 'skill_practice';
      approach = 'interactive';
      break;
    case 'closing':
      technique = 'session_summary';
      approach = 'consolidating';
      break;
  }

  // Cultural adaptations
  if (culturalContext?.primaryLanguage !== 'en') {
    culturalAdaptations = {
      ...culturalAdaptations,
      language_considerations: true,
      translation_needed: true
    };
  }

  if (culturalContext?.religiousConsiderations) {
    culturalAdaptations = {
      ...culturalAdaptations,
      religious_integration: true,
      spiritual_techniques: true
    };
  }

  if (culturalContext?.familyOriented) {
    culturalAdaptations = {
      ...culturalAdaptations,
      family_system_focus: true,
      collective_approach: true
    };
  }

  return {
    technique,
    approach,
    culturalAdaptations,
    rationale: `Selected ${technique} with ${approach} approach for ${currentPhase} phase`,
    effectiveness_prediction: 0.75
  };
}

// Generate personalized response based on context
async function generateContextualResponse(
  message: string,
  context: any,
  selectedModel: any,
  techniqueSelection: any
): Promise<string> {
  const { therapistPersonality, sessionHistory, culturalContext, emotionalState } = context;

  // Build comprehensive system prompt
  const systemPrompt = `You are ${therapistPersonality?.name || 'Dr. AI'}, a ${therapistPersonality?.title || 'licensed therapist'}.

THERAPEUTIC APPROACH: ${techniqueSelection.technique} with ${techniqueSelection.approach} style
CURRENT PHASE: ${context.currentPhase}
CULTURAL CONTEXT: ${JSON.stringify(culturalContext)}
EMOTIONAL STATE: ${JSON.stringify(emotionalState)}

TECHNIQUE INSTRUCTIONS:
${getTechniqueInstructions(techniqueSelection.technique)}

CULTURAL ADAPTATIONS:
${JSON.stringify(techniqueSelection.culturalAdaptations)}

SAFETY CONSIDERATIONS:
${context.crisisLevel !== 'none' ? `CRISIS LEVEL: ${context.crisisLevel} - Use appropriate safety protocols` : 'Standard safety protocols'}

THERAPEUTIC GOALS:
- Maintain therapeutic alliance
- Apply evidence-based techniques
- Ensure cultural sensitivity
- Monitor for crisis indicators
- Promote emotional regulation

RESPONSE STYLE:
- ${therapistPersonality?.communication_style || 'Warm and professional'}
- Length: 2-3 paragraphs
- Include specific therapeutic technique
- Ask one thoughtful follow-up question
- Maintain hope and validation

Previous session context: ${sessionHistory?.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}`;

  let response = '';

  if (selectedModel.provider === 'anthropic') {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: selectedModel.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nUser: ${message}`
          }
        ]
      }),
    });

    const data = await anthropicResponse.json();
    response = data.content[0].text;
  } else {
    // OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: selectedModel.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    const data = await openaiResponse.json();
    response = data.choices[0].message.content;
  }

  return response;
}

function getTechniqueInstructions(technique: string): string {
  const instructions = {
    'rapport_building': 'Focus on creating a warm, safe space. Use active listening, validate emotions, and establish trust through empathy and understanding.',
    'reflective_questioning': 'Ask open-ended questions that encourage deeper exploration. Reflect back what you hear to ensure understanding.',
    'cognitive_restructuring': 'Help identify negative thought patterns and guide toward more balanced, realistic thinking. Use Socratic questioning.',
    'behavioral_activation': 'Encourage small, manageable activities that can improve mood and energy. Focus on value-based actions.',
    'breathing_exercises': 'Guide through calming breathing techniques. Provide step-by-step instructions and encourage practice.',
    'mindfulness_practice': 'Introduce present-moment awareness techniques. Guide attention to breath, body sensations, or environment.',
    'skill_practice': 'Practice coping skills learned in session. Provide encouragement and gentle correction as needed.',
    'session_summary': 'Summarize key insights, progress made, and skills learned. Prepare for session end with homework or next steps.',
    'active_listening': 'Demonstrate full attention, reflect emotions, and validate experiences without judgment.'
  };

  return instructions[technique] || 'Use standard therapeutic listening and support techniques.';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      userId, 
      sessionId, 
      currentPhase, 
      sessionHistory, 
      culturalContext, 
      emotionalState,
      therapistId 
    } = await req.json();

    console.log('Advanced AI Therapy Orchestrator - Processing request', {
      sessionId,
      currentPhase,
      userId
    });

    // Get comprehensive session context
    const [sessionStatus, therapistPersonality, userCulturalProfile] = await Promise.all([
      supabase
        .from('session_real_time_status')
        .select('*')
        .eq('session_id', sessionId)
        .single(),
      supabase
        .from('therapist_personalities')
        .select('*')
        .eq('id', therapistId)
        .single(),
      supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
    ]);

    const context = {
      sessionStatus: sessionStatus.data,
      therapistPersonality: therapistPersonality.data,
      culturalContext: userCulturalProfile.data || culturalContext,
      emotionalState,
      currentPhase,
      sessionHistory,
      crisisLevel: sessionStatus.data?.crisis_level || 'none',
      engagementLevel: sessionStatus.data?.engagement_level || 0.5,
      breakthroughProbability: sessionStatus.data?.breakthrough_probability || 0.0
    };

    // Crisis detection with multiple validation layers
    const crisisAnalysis = detectCrisisIndicators(message, sessionHistory);
    
    // Update crisis monitoring if needed
    if (crisisAnalysis.detected) {
      await supabase
        .from('session_crisis_monitoring')
        .update({
          crisis_level: crisisAnalysis.urgencyLevel,
          crisis_indicators: crisisAnalysis.indicators,
          risk_assessment_score: crisisAnalysis.riskScore,
          validation_layers: {
            direct_language: crisisAnalysis.indicators.includes('direct_crisis_language'),
            emotional_intensity: crisisAnalysis.indicators.includes('high_emotional_intensity'),
            pattern_analysis: crisisAnalysis.indicators.includes('negative_pattern_detected'),
            timestamp: new Date().toISOString()
          }
        })
        .eq('session_id', sessionId);

      context.crisisLevel = crisisAnalysis.urgencyLevel;
    }

    // Select optimal AI model based on context
    const selectedModel = selectOptimalModel(context);

    // Select optimal therapy technique
    const techniqueSelection = selectTherapyTechnique(context);

    // Generate contextual response
    const response = await generateContextualResponse(
      message,
      context,
      selectedModel,
      techniqueSelection
    );

    // Log AI decision for learning
    await supabase
      .from('ai_session_decisions')
      .insert({
        session_id: sessionId,
        user_id: userId,
        decision_point: 'response_generation',
        context_analysis: context,
        model_used: selectedModel.model,
        decision_rationale: `Selected ${selectedModel.model} for ${currentPhase} phase with ${techniqueSelection.technique} technique`,
        technique_selected: techniqueSelection.technique,
        predicted_outcome: {
          effectiveness: techniqueSelection.effectiveness_prediction,
          engagement_impact: 0.1,
          therapeutic_value: 0.8
        },
        response_generation_strategy: techniqueSelection.approach,
        cultural_adaptations: techniqueSelection.culturalAdaptations
      });

    // Update session quality metrics
    await supabase
      .from('session_quality_metrics')
      .update({
        technique_effectiveness_scores: {
          [techniqueSelection.technique]: techniqueSelection.effectiveness_prediction
        },
        intervention_triggers: {
          last_intervention: techniqueSelection.technique,
          timestamp: new Date().toISOString()
        }
      })
      .eq('session_id', sessionId);

    // Store conversation memory if significant
    if (message.length > 30) {
      await supabase
        .from('conversation_memory')
        .insert({
          user_id: userId,
          session_id: sessionId,
          memory_type: 'therapeutic_insight',
          title: `${currentPhase} phase discussion`,
          content: message.substring(0, 500),
          emotional_context: {
            primary_emotion: emotionalState?.primary || 'neutral',
            intensity: emotionalState?.intensity || 5,
            context: currentPhase
          },
          importance_score: crisisAnalysis.detected ? 0.9 : 0.6,
          tags: [currentPhase, techniqueSelection.technique, 'conversation'],
          is_active: true
        });
    }

    return new Response(JSON.stringify({
      response,
      metadata: {
        modelUsed: selectedModel.model,
        technique: techniqueSelection.technique,
        approach: techniqueSelection.approach,
        culturalAdaptations: techniqueSelection.culturalAdaptations,
        crisisLevel: context.crisisLevel,
        engagementLevel: context.engagementLevel,
        breakthroughProbability: context.breakthroughProbability,
        crisisAnalysis: crisisAnalysis.detected ? crisisAnalysis : null
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advanced AI therapy orchestrator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing some technical difficulties. Let me try to help you in a different way. How are you feeling right now?"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});