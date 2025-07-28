import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdaptationTrigger {
  type: 'mood_decline' | 'low_engagement' | 'crisis_indicators' | 'technique_ineffective' | 'breakthrough';
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  confidence: number;
}

interface SessionAdaptation {
  session_id: string;
  user_id: string;
  adaptations: {
    technique_changes: string[];
    approach_adjustments: string[];
    intensity_modifications: string[];
    crisis_protocols: string[];
  };
  reasoning: string;
  effectiveness_prediction: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, session_id, session_data, current_metrics } = await req.json();
    console.log('Real-time therapy adaptation request:', { user_id, session_id });

    // Analyze current session state and determine if adaptation is needed
    const adaptationTriggers = await analyzeAdaptationTriggers(
      supabaseClient, 
      user_id, 
      session_id, 
      session_data, 
      current_metrics
    );

    console.log('Adaptation triggers detected:', adaptationTriggers);

    // If high-priority triggers exist, generate adaptive recommendations
    let adaptations: SessionAdaptation | null = null;
    
    const criticalTriggers = adaptationTriggers.filter(t => 
      t.severity === 'high' || t.severity === 'critical'
    );

    if (criticalTriggers.length > 0) {
      adaptations = await generateRealtimeAdaptations(
        supabaseClient,
        user_id,
        session_id,
        adaptationTriggers,
        session_data
      );

      // Log adaptation for analytics
      await logAdaptationDecision(supabaseClient, adaptations, adaptationTriggers);
    }

    const response = {
      success: true,
      adaptation_needed: adaptations !== null,
      adaptations: adaptations,
      triggers: adaptationTriggers,
      recommendations: {
        immediate_actions: generateImmediateActions(adaptationTriggers),
        session_adjustments: adaptations?.adaptations || null,
        follow_up_required: criticalTriggers.some(t => t.type === 'crisis_indicators')
      }
    };

    console.log('Real-time adaptation response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Real-time therapy adaptation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to perform real-time adaptation',
      adaptation_needed: false,
      adaptations: null,
      triggers: [],
      recommendations: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeAdaptationTriggers(
  supabase: any,
  userId: string,
  sessionId: string,
  sessionData: any,
  currentMetrics: any
): Promise<AdaptationTrigger[]> {
  const triggers: AdaptationTrigger[] = [];

  try {
    // 1. Analyze mood decline patterns
    const moodTrigger = await analyzeMoodDecline(supabase, userId, sessionData);
    if (moodTrigger) triggers.push(moodTrigger);

    // 2. Check engagement levels
    const engagementTrigger = analyzeEngagement(sessionData, currentMetrics);
    if (engagementTrigger) triggers.push(engagementTrigger);

    // 3. Detect crisis indicators
    const crisisTrigger = await detectCrisisIndicators(supabase, userId, sessionData);
    if (crisisTrigger) triggers.push(crisisTrigger);

    // 4. Evaluate technique effectiveness
    const techniqueeTrigger = await analyzeTechniqueEffectiveness(supabase, userId, sessionData);
    if (techniqueeTrigger) triggers.push(techniqueeTrigger);

    // 5. Identify breakthrough moments
    const breakthroughTrigger = analyzeBreakthrough(sessionData, currentMetrics);
    if (breakthroughTrigger) triggers.push(breakthroughTrigger);

  } catch (error) {
    console.error('Error analyzing adaptation triggers:', error);
  }

  return triggers;
}

async function analyzeMoodDecline(supabase: any, userId: string, sessionData: any): Promise<AdaptationTrigger | null> {
  try {
    // Get recent mood entries
    const { data: moodEntries } = await supabase
      .from('mood_entries')
      .select('overall, created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    if (!moodEntries || moodEntries.length < 2) return null;

    const recentMoods = moodEntries.map(entry => entry.overall);
    const trend = calculateTrend(recentMoods);
    
    // Check current session mood if available
    let currentMood = sessionData?.currentMood;
    let sessionDecline = 0;
    
    if (currentMood && sessionData?.initialMood) {
      sessionDecline = sessionData.initialMood - currentMood;
    }

    // Determine severity
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (trend < -2 || sessionDecline > 3) {
      severity = 'critical';
    } else if (trend < -1 || sessionDecline > 2) {
      severity = 'high';
    } else if (trend < -0.5 || sessionDecline > 1) {
      severity = 'medium';
    }

    if (severity !== 'low') {
      return {
        type: 'mood_decline',
        severity,
        data: {
          weeklyTrend: trend,
          sessionDecline,
          recentMoods: recentMoods.slice(0, 3)
        },
        confidence: Math.min(recentMoods.length / 5, 1)
      };
    }

  } catch (error) {
    console.error('Error analyzing mood decline:', error);
  }

  return null;
}

function analyzeEngagement(sessionData: any, currentMetrics: any): AdaptationTrigger | null {
  const engagementScore = calculateEngagementScore(sessionData, currentMetrics);
  
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  
  if (engagementScore < 0.3) {
    severity = 'high';
  } else if (engagementScore < 0.5) {
    severity = 'medium';
  }

  if (severity !== 'low') {
    return {
      type: 'low_engagement',
      severity,
      data: {
        engagementScore,
        responseTime: currentMetrics?.averageResponseTime || 0,
        interactionDepth: sessionData?.interactionDepth || 0
      },
      confidence: 0.8
    };
  }

  return null;
}

async function detectCrisisIndicators(supabase: any, userId: string, sessionData: any): Promise<AdaptationTrigger | null> {
  try {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm',
      'hopeless', 'no point', 'give up', 'can\'t go on', 'worthless'
    ];

    const messages = sessionData?.messages || [];
    let crisisScore = 0;
    const detectedIndicators: string[] = [];

    for (const message of messages) {
      if (message.isUser && message.content) {
        const content = message.content.toLowerCase();
        for (const keyword of crisisKeywords) {
          if (content.includes(keyword)) {
            crisisScore += 1;
            detectedIndicators.push(keyword);
          }
        }
      }
    }

    // Also check recent crisis alerts
    const { data: recentAlerts } = await supabase
      .from('crisis_alerts')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (recentAlerts && recentAlerts.length > 0) {
      crisisScore += recentAlerts.length * 2;
    }

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (crisisScore >= 3) {
      severity = 'critical';
    } else if (crisisScore >= 2) {
      severity = 'high';
    } else if (crisisScore >= 1) {
      severity = 'medium';
    }

    if (severity !== 'low') {
      return {
        type: 'crisis_indicators',
        severity,
        data: {
          crisisScore,
          detectedIndicators: detectedIndicators.slice(0, 3),
          recentAlerts: recentAlerts?.length || 0
        },
        confidence: 0.9
      };
    }

  } catch (error) {
    console.error('Error detecting crisis indicators:', error);
  }

  return null;
}

async function analyzeTechniqueEffectiveness(supabase: any, userId: string, sessionData: any): Promise<AdaptationTrigger | null> {
  try {
    const currentTechnique = sessionData?.currentTechnique || sessionData?.lastUsedTechnique;
    if (!currentTechnique) return null;

    // Get recent effectiveness data for this technique
    const { data: techniqueData } = await supabase
      .from('session_technique_tracking')
      .select('user_response_score, effectiveness_metrics')
      .eq('user_id', userId)
      .eq('technique_name', currentTechnique)
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    if (!techniqueData || techniqueData.length === 0) return null;

    const avgEffectiveness = techniqueData.reduce((sum, item) => 
      sum + (item.user_response_score || 0), 0) / techniqueData.length;

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (avgEffectiveness < 3) {
      severity = 'high';
    } else if (avgEffectiveness < 5) {
      severity = 'medium';
    }

    if (severity !== 'low') {
      return {
        type: 'technique_ineffective',
        severity,
        data: {
          technique: currentTechnique,
          avgEffectiveness,
          recentScores: techniqueData.map(d => d.user_response_score).slice(0, 3)
        },
        confidence: Math.min(techniqueData.length / 5, 1)
      };
    }

  } catch (error) {
    console.error('Error analyzing technique effectiveness:', error);
  }

  return null;
}

function analyzeBreakthrough(sessionData: any, currentMetrics: any): AdaptationTrigger | null {
  const breakthroughIndicators = [
    'breakthrough', 'insight', 'understand now', 'makes sense',
    'revelation', 'clarity', 'click', 'aha moment'
  ];

  const messages = sessionData?.messages || [];
  let breakthroughScore = 0;

  for (const message of messages) {
    if (message.isUser && message.content) {
      const content = message.content.toLowerCase();
      for (const indicator of breakthroughIndicators) {
        if (content.includes(indicator)) {
          breakthroughScore += 1;
        }
      }
    }
  }

  // Check for mood improvement
  if (sessionData?.currentMood && sessionData?.initialMood) {
    const moodImprovement = sessionData.currentMood - sessionData.initialMood;
    if (moodImprovement >= 2) {
      breakthroughScore += 2;
    }
  }

  if (breakthroughScore >= 2) {
    return {
      type: 'breakthrough',
      severity: 'medium',
      data: {
        breakthroughScore,
        moodImprovement: sessionData?.currentMood - sessionData?.initialMood || 0
      },
      confidence: 0.7
    };
  }

  return null;
}

async function generateRealtimeAdaptations(
  supabase: any,
  userId: string,
  sessionId: string,
  triggers: AdaptationTrigger[],
  sessionData: any
): Promise<SessionAdaptation> {
  const adaptations = {
    technique_changes: [] as string[],
    approach_adjustments: [] as string[],
    intensity_modifications: [] as string[],
    crisis_protocols: [] as string[]
  };

  let reasoning = '';

  for (const trigger of triggers) {
    switch (trigger.type) {
      case 'mood_decline':
        adaptations.technique_changes.push('Switch to cognitive restructuring');
        adaptations.approach_adjustments.push('Focus on immediate mood stabilization');
        reasoning += 'Mood decline detected, implementing stabilization techniques. ';
        break;

      case 'low_engagement':
        adaptations.technique_changes.push('Use more interactive exercises');
        adaptations.intensity_modifications.push('Reduce session complexity');
        reasoning += 'Low engagement observed, simplifying approach. ';
        break;

      case 'crisis_indicators':
        adaptations.crisis_protocols.push('Implement safety planning');
        adaptations.crisis_protocols.push('Assess immediate risk');
        adaptations.approach_adjustments.push('Switch to crisis intervention mode');
        reasoning += 'Crisis indicators present, activating safety protocols. ';
        break;

      case 'technique_ineffective':
        adaptations.technique_changes.push('Try alternative therapeutic approach');
        reasoning += 'Current technique showing low effectiveness, switching approach. ';
        break;

      case 'breakthrough':
        adaptations.intensity_modifications.push('Deepen current exploration');
        adaptations.technique_changes.push('Capitalize on insight moment');
        reasoning += 'Breakthrough detected, amplifying therapeutic momentum. ';
        break;
    }
  }

  // Calculate effectiveness prediction
  const effectivenessPrediction = calculateEffectivenessPrediction(triggers, adaptations);

  return {
    session_id: sessionId,
    user_id: userId,
    adaptations,
    reasoning: reasoning.trim(),
    effectiveness_prediction: effectivenessPrediction
  };
}

async function logAdaptationDecision(
  supabase: any,
  adaptation: SessionAdaptation,
  triggers: AdaptationTrigger[]
): Promise<void> {
  try {
    await supabase.from('ai_routing_decisions').insert({
      user_id: adaptation.user_id,
      session_id: adaptation.session_id,
      selected_model: 'real-time-adaptation',
      therapy_approach: 'adaptive',
      reasoning: adaptation.reasoning,
      priority_level: triggers.some(t => t.severity === 'critical') ? 5 : 
                     triggers.some(t => t.severity === 'high') ? 4 : 3,
      cultural_adaptations: {},
      effectiveness_score: adaptation.effectiveness_prediction
    });
  } catch (error) {
    console.error('Error logging adaptation decision:', error);
  }
}

function generateImmediateActions(triggers: AdaptationTrigger[]): string[] {
  const actions: string[] = [];

  for (const trigger of triggers) {
    switch (trigger.type) {
      case 'crisis_indicators':
        if (trigger.severity === 'critical') {
          actions.push('IMMEDIATE: Conduct crisis assessment and safety planning');
          actions.push('ALERT: Consider professional intervention escalation');
        } else {
          actions.push('Check in on safety and coping resources');
        }
        break;

      case 'mood_decline':
        actions.push('Implement mood stabilization techniques');
        actions.push('Focus on immediate relief strategies');
        break;

      case 'low_engagement':
        actions.push('Switch to more interactive format');
        actions.push('Check for user preferences and barriers');
        break;

      case 'technique_ineffective':
        actions.push('Transition to alternative approach');
        break;

      case 'breakthrough':
        actions.push('Explore insight deeper');
        actions.push('Reinforce positive momentum');
        break;
    }
  }

  return actions.slice(0, 5); // Limit to 5 most important actions
}

// Helper functions
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  let sum = 0;
  for (let i = 1; i < values.length; i++) {
    sum += values[i] - values[i - 1];
  }
  
  return sum / (values.length - 1);
}

function calculateEngagementScore(sessionData: any, currentMetrics: any): number {
  let score = 0.5; // Base score
  
  // Response length and frequency
  const avgResponseLength = sessionData?.avgResponseLength || 0;
  if (avgResponseLength > 50) score += 0.2;
  else if (avgResponseLength < 20) score -= 0.2;
  
  // Response time
  const avgResponseTime = currentMetrics?.averageResponseTime || 30;
  if (avgResponseTime < 60) score += 0.2;
  else if (avgResponseTime > 180) score -= 0.3;
  
  // Interaction quality
  const interactionDepth = sessionData?.interactionDepth || 0;
  score += Math.min(interactionDepth / 10, 0.3);
  
  return Math.max(0, Math.min(score, 1));
}

function calculateEffectivenessPrediction(triggers: AdaptationTrigger[], adaptations: any): number {
  let prediction = 0.7; // Base prediction
  
  // Adjust based on trigger severity
  const criticalTriggers = triggers.filter(t => t.severity === 'critical').length;
  const highTriggers = triggers.filter(t => t.severity === 'high').length;
  
  prediction -= (criticalTriggers * 0.2 + highTriggers * 0.1);
  
  // Boost for appropriate adaptations
  const totalAdaptations = Object.values(adaptations).reduce((sum: number, arr: any) => 
    sum + (Array.isArray(arr) ? arr.length : 0), 0);
  
  if (totalAdaptations > 0) {
    prediction += Math.min(totalAdaptations / 10, 0.2);
  }
  
  return Math.max(0.1, Math.min(prediction, 1.0));
}