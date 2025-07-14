/**
 * Elite System Orchestrator
 * Advanced cron job orchestration for multi-layered background processing
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrchestrationRequest {
  source: 'cron' | 'manual' | 'trigger';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tasks: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: OrchestrationRequest = await req.json();
    console.log('🎯 Elite System Orchestrator activated:', body);

    const results = [];

    // Task 1: Adaptive Learning Analysis
    if (body.tasks.includes('adaptive_learning') || body.source === 'cron') {
      console.log('📊 Running adaptive learning analysis...');
      const learningResult = await runAdaptiveLearningAnalysis(supabaseClient);
      results.push({ task: 'adaptive_learning', ...learningResult });
    }

    // Task 2: Cultural Context Optimization
    if (body.tasks.includes('cultural_optimization') || body.source === 'cron') {
      console.log('🌍 Running cultural context optimization...');
      const culturalResult = await runCulturalOptimization(supabaseClient);
      results.push({ task: 'cultural_optimization', ...culturalResult });
    }

    // Task 3: AI Model Performance Analysis
    if (body.tasks.includes('model_performance') || body.source === 'cron') {
      console.log('🤖 Running AI model performance analysis...');
      const performanceResult = await runModelPerformanceAnalysis(supabaseClient);
      results.push({ task: 'model_performance', ...performanceResult });
    }

    // Task 4: Crisis Pattern Detection
    if (body.tasks.includes('crisis_detection') || body.priority === 'critical') {
      console.log('🚨 Running crisis pattern detection...');
      const crisisResult = await runCrisisPatternDetection(supabaseClient);
      results.push({ task: 'crisis_detection', ...crisisResult });
    }

    // Task 5: Therapy Effectiveness Optimization
    if (body.tasks.includes('therapy_optimization') || body.source === 'cron') {
      console.log('🎯 Running therapy effectiveness optimization...');
      const therapyResult = await runTherapyOptimization(supabaseClient);
      results.push({ task: 'therapy_optimization', ...therapyResult });
    }

    // Task 6: System Intelligence Metrics Update
    if (body.tasks.includes('intelligence_metrics') || body.source === 'cron') {
      console.log('📈 Updating system intelligence metrics...');
      const metricsResult = await updateSystemIntelligenceMetrics(supabaseClient, results);
      results.push({ task: 'intelligence_metrics', ...metricsResult });
    }

    // Task 7: Real-time Data Sync
    if (body.tasks.includes('data_sync') || body.priority === 'high') {
      console.log('🔄 Running real-time data synchronization...');
      const syncResult = await runRealTimeDataSync(supabaseClient);
      results.push({ task: 'data_sync', ...syncResult });
    }

    return new Response(
      JSON.stringify({
        success: true,
        orchestrationId: crypto.randomUUID(),
        completedTasks: results.length,
        results,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Elite System Orchestrator Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function runAdaptiveLearningAnalysis(supabase: any): Promise<any> {
  try {
    // Get all users with recent sessions
    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('user_id, effectiveness_rating, therapy_approach_used, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .not('effectiveness_rating', 'is', null);

    if (!recentSessions?.length) {
      return { success: true, usersAnalyzed: 0, message: 'No recent sessions to analyze' };
    }

    let updatedProfiles = 0;

    // Group by user and analyze patterns
    const userGroups = recentSessions.reduce((acc: any, session: any) => {
      if (!acc[session.user_id]) acc[session.user_id] = [];
      acc[session.user_id].push(session);
      return acc;
    }, {});

    for (const [userId, sessions] of Object.entries(userGroups)) {
      const userSessions = sessions as any[];
      
      // Calculate effectiveness by approach
      const approachEffectiveness: Record<string, number[]> = {};
      userSessions.forEach(session => {
        if (!approachEffectiveness[session.therapy_approach_used]) {
          approachEffectiveness[session.therapy_approach_used] = [];
        }
        approachEffectiveness[session.therapy_approach_used].push(session.effectiveness_rating);
      });

      // Calculate averages
      const learningPatterns = Object.entries(approachEffectiveness).map(([approach, ratings]) => ({
        approach,
        averageEffectiveness: ratings.reduce((a, b) => a + b, 0) / ratings.length,
        sessionCount: ratings.length
      }));

      // Update or create adaptive learning profile
      await supabase
        .from('adaptive_learning_profiles')
        .upsert({
          user_id: userId,
          learning_patterns: { 
            approach_effectiveness: learningPatterns,
            last_analysis: new Date().toISOString()
          },
          effectiveness_metrics: {
            overall_trend: calculateTrend(userSessions.map(s => s.effectiveness_rating)),
            preferred_approaches: learningPatterns
              .sort((a, b) => b.averageEffectiveness - a.averageEffectiveness)
              .slice(0, 3)
          },
          last_updated: new Date().toISOString()
        });

      updatedProfiles++;
    }

    return { 
      success: true, 
      usersAnalyzed: Object.keys(userGroups).length,
      profilesUpdated: updatedProfiles 
    };

  } catch (error) {
    console.error('Adaptive learning analysis error:', error);
    return { success: false, error: error.message };
  }
}

async function runCulturalOptimization(supabase: any): Promise<any> {
  try {
    // Get cultural profiles that need optimization
    const { data: culturalProfiles } = await supabase
      .from('user_cultural_profiles')
      .select('*')
      .not('cultural_background', 'is', null);

    if (!culturalProfiles?.length) {
      return { success: true, profilesOptimized: 0, message: 'No cultural profiles to optimize' };
    }

    let optimizedCount = 0;

    for (const profile of culturalProfiles) {
      // Analyze cultural interaction patterns
      const { data: interactions } = await supabase
        .from('cultural_interactions')
        .select('*')
        .eq('user_id', profile.user_id)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Generate optimization recommendations
      const optimizations = {
        communication_effectiveness: calculateCommunicationEffectiveness(interactions || []),
        cultural_adaptation_score: calculateCulturalAdaptation(profile),
        recommended_adjustments: generateCulturalAdjustments(profile, interactions || []),
        last_optimization: new Date().toISOString()
      };

      // Update cultural content recommendations
      await supabase
        .from('cultural_content_recommendations')
        .upsert({
          user_id: profile.user_id,
          cultural_background: profile.cultural_background,
          optimization_data: optimizations,
          updated_at: new Date().toISOString()
        });

      optimizedCount++;
    }

    return { 
      success: true, 
      profilesOptimized: optimizedCount,
      culturalBackgrounds: [...new Set(culturalProfiles.map(p => p.cultural_background))]
    };

  } catch (error) {
    console.error('Cultural optimization error:', error);
    return { success: false, error: error.message };
  }
}

async function runModelPerformanceAnalysis(supabase: any): Promise<any> {
  try {
    // Get recent AI routing decisions
    const { data: routingDecisions } = await supabase
      .from('ai_routing_decisions')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (!routingDecisions?.length) {
      return { success: true, decisionsAnalyzed: 0, message: 'No routing decisions to analyze' };
    }

    // Group by model and calculate performance metrics
    const modelPerformance: Record<string, any> = {};

    routingDecisions.forEach(decision => {
      if (!modelPerformance[decision.selected_model]) {
        modelPerformance[decision.selected_model] = {
          totalDecisions: 0,
          avgResponseTime: 0,
          avgEffectiveness: 0,
          priorityDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
          culturalAdaptations: 0
        };
      }

      const perf = modelPerformance[decision.selected_model];
      perf.totalDecisions++;
      perf.avgResponseTime += decision.response_time_ms || 0;
      perf.avgEffectiveness += decision.effectiveness_score || 0;
      
      if (decision.priority_level <= 3) perf.priorityDistribution.low++;
      else if (decision.priority_level <= 6) perf.priorityDistribution.medium++;
      else if (decision.priority_level <= 8) perf.priorityDistribution.high++;
      else perf.priorityDistribution.critical++;

      if (decision.cultural_adaptations?.adaptations?.length > 0) {
        perf.culturalAdaptations++;
      }
    });

    // Calculate final averages
    Object.values(modelPerformance).forEach((perf: any) => {
      perf.avgResponseTime = perf.avgResponseTime / perf.totalDecisions;
      perf.avgEffectiveness = perf.avgEffectiveness / perf.totalDecisions;
      perf.culturalAdaptationRate = perf.culturalAdaptations / perf.totalDecisions;
    });

    // Store performance metrics
    for (const [model, metrics] of Object.entries(modelPerformance)) {
      await supabase
        .from('ai_model_performance')
        .insert({
          model_name: model,
          task_type: 'therapy_routing',
          response_time_ms: (metrics as any).avgResponseTime,
          quality_score: (metrics as any).avgEffectiveness,
          success_rate: 1.0, // Will be calculated from actual success metrics
          cultural_context: 'multi_cultural',
          user_satisfaction_score: (metrics as any).avgEffectiveness,
          created_at: new Date().toISOString()
        });
    }

    return { 
      success: true, 
      decisionsAnalyzed: routingDecisions.length,
      modelsAnalyzed: Object.keys(modelPerformance),
      topPerformingModel: Object.entries(modelPerformance)
        .sort(([,a], [,b]) => (b as any).avgEffectiveness - (a as any).avgEffectiveness)[0]?.[0]
    };

  } catch (error) {
    console.error('Model performance analysis error:', error);
    return { success: false, error: error.message };
  }
}

async function runCrisisPatternDetection(supabase: any): Promise<any> {
  try {
    // Get recent crisis assessments and user interactions
    const { data: recentCrises } = await supabase
      .from('crisis_assessments')
      .select('*')
      .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString());

    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('user_id, session_data, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    let patternsDetected = 0;
    let alertsTriggered = 0;

    // Analyze crisis patterns
    if (recentCrises?.length) {
      // Group by user to identify repeat crisis patterns
      const userCrises = recentCrises.reduce((acc: any, crisis: any) => {
        if (!acc[crisis.user_id]) acc[crisis.user_id] = [];
        acc[crisis.user_id].push(crisis);
        return acc;
      }, {});

      for (const [userId, crises] of Object.entries(userCrises)) {
        const userCrises = crises as any[];
        
        // Check for escalating crisis pattern
        if (userCrises.length > 1) {
          const riskTrend = calculateRiskTrend(userCrises);
          
          if (riskTrend > 0.2) { // Escalating risk
            await supabase
              .from('crisis_alerts')
              .insert({
                user_id: userId,
                alert_type: 'escalating_risk',
                severity_level: 'high',
                ai_confidence: riskTrend,
                trigger_data: {
                  pattern: 'escalating_crisis',
                  crisis_count: userCrises.length,
                  trend_score: riskTrend,
                  time_span: '48h'
                }
              });
            
            alertsTriggered++;
          }
          patternsDetected++;
        }
      }
    }

    // Analyze session patterns for early warning signs
    if (recentSessions?.length) {
      const sessionPatterns = await analyzeSessionPatternsForCrisis(recentSessions);
      patternsDetected += sessionPatterns.patterns;
      alertsTriggered += sessionPatterns.alerts;
    }

    return { 
      success: true, 
      patternsDetected,
      alertsTriggered,
      crisesAnalyzed: recentCrises?.length || 0,
      sessionsAnalyzed: recentSessions?.length || 0
    };

  } catch (error) {
    console.error('Crisis pattern detection error:', error);
    return { success: false, error: error.message };
  }
}

async function runTherapyOptimization(supabase: any): Promise<any> {
  try {
    // Get therapy approach effectiveness data
    const { data: sessionFeedback } = await supabase
      .from('session_feedback')
      .select('*')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

    if (!sessionFeedback?.length) {
      return { success: true, optimizationsGenerated: 0, message: 'No session feedback to analyze' };
    }

    // Analyze approach effectiveness
    const approachEffectiveness: Record<string, any> = {};
    
    sessionFeedback.forEach(feedback => {
      // Assuming therapy approach is stored in session data or feedback
      const approach = 'general'; // This would come from actual session data
      
      if (!approachEffectiveness[approach]) {
        approachEffectiveness[approach] = {
          ratings: [],
          moodImprovements: [],
          recommendations: []
        };
      }
      
      approachEffectiveness[approach].ratings.push(feedback.overall_rating);
      if (feedback.mood_before && feedback.mood_after) {
        approachEffectiveness[approach].moodImprovements.push(
          feedback.mood_after - feedback.mood_before
        );
      }
    });

    let optimizationsGenerated = 0;

    // Generate optimizations for each approach
    for (const [approach, data] of Object.entries(approachEffectiveness)) {
      const avgRating = data.ratings.reduce((a: number, b: number) => a + b, 0) / data.ratings.length;
      const avgMoodImprovement = data.moodImprovements.length > 0 
        ? data.moodImprovements.reduce((a: number, b: number) => a + b, 0) / data.moodImprovements.length 
        : 0;

      // Generate recommendations based on effectiveness
      const recommendations = generateTherapyRecommendations(avgRating, avgMoodImprovement, approach);

      await supabase
        .from('therapy_approach_optimizations')
        .upsert({
          approach_name: approach,
          effectiveness_score: avgRating,
          mood_improvement_avg: avgMoodImprovement,
          recommendations,
          last_analysis: new Date().toISOString(),
          sample_size: data.ratings.length
        });

      optimizationsGenerated++;
    }

    return {
      success: true,
      optimizationsGenerated,
      approachesAnalyzed: Object.keys(approachEffectiveness),
      totalFeedbackAnalyzed: sessionFeedback.length
    };

  } catch (error) {
    console.error('Therapy optimization error:', error);
    return { success: false, error: error.message };
  }
}

async function updateSystemIntelligenceMetrics(supabase: any, results: any[]): Promise<any> {
  try {
    const metrics = [
      {
        metric_type: 'orchestration_completion_rate',
        metric_value: results.filter(r => r.success).length / results.length,
        metadata: { total_tasks: results.length, successful_tasks: results.filter(r => r.success).length }
      },
      {
        metric_type: 'adaptive_learning_coverage',
        metric_value: results.find(r => r.task === 'adaptive_learning')?.usersAnalyzed || 0,
        metadata: results.find(r => r.task === 'adaptive_learning') || {}
      },
      {
        metric_type: 'cultural_optimization_coverage',
        metric_value: results.find(r => r.task === 'cultural_optimization')?.profilesOptimized || 0,
        metadata: results.find(r => r.task === 'cultural_optimization') || {}
      },
      {
        metric_type: 'crisis_detection_efficiency',
        metric_value: results.find(r => r.task === 'crisis_detection')?.patternsDetected || 0,
        metadata: results.find(r => r.task === 'crisis_detection') || {}
      }
    ];

    for (const metric of metrics) {
      await supabase
        .from('system_intelligence_metrics')
        .insert({
          ...metric,
          recorded_at: new Date().toISOString()
        });
    }

    return { success: true, metricsRecorded: metrics.length };

  } catch (error) {
    console.error('Intelligence metrics update error:', error);
    return { success: false, error: error.message };
  }
}

async function runRealTimeDataSync(supabase: any): Promise<any> {
  try {
    // Sync user profiles with latest session data
    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('user_id, effectiveness_rating, created_at')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    let syncedUsers = 0;

    if (recentSessions?.length) {
      const userUpdates = recentSessions.reduce((acc: any, session: any) => {
        if (!acc[session.user_id]) {
          acc[session.user_id] = { sessions: 0, totalEffectiveness: 0 };
        }
        acc[session.user_id].sessions++;
        acc[session.user_id].totalEffectiveness += session.effectiveness_rating || 0;
        return acc;
      }, {});

      for (const [userId, data] of Object.entries(userUpdates)) {
        await supabase
          .from('user_stats')
          .upsert({
            user_id: userId,
            last_session_effectiveness: (data as any).totalEffectiveness / (data as any).sessions,
            last_sync: new Date().toISOString()
          });
        syncedUsers++;
      }
    }

    return { success: true, syncedUsers, sessionsProcessed: recentSessions?.length || 0 };

  } catch (error) {
    console.error('Real-time data sync error:', error);
    return { success: false, error: error.message };
  }
}

// Helper functions
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  const midpoint = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
  const secondHalf = values.slice(midpoint).reduce((a, b) => a + b, 0) / (values.length - midpoint);
  return (secondHalf - firstHalf) / firstHalf;
}

function calculateCommunicationEffectiveness(interactions: any[]): number {
  // Placeholder implementation
  return interactions.length > 0 ? 0.8 : 0.5;
}

function calculateCulturalAdaptation(profile: any): number {
  // Scoring based on profile completeness and cultural specificity
  let score = 0.5; // Base score
  if (profile.cultural_background && profile.cultural_background !== 'general') score += 0.2;
  if (profile.communication_style && profile.communication_style !== 'direct') score += 0.1;
  if (profile.family_structure && profile.family_structure !== 'individual') score += 0.1;
  if (profile.religious_considerations) score += 0.1;
  return Math.min(score, 1.0);
}

function generateCulturalAdjustments(profile: any, interactions: any[]): any[] {
  const adjustments = [];
  
  if (profile.communication_style === 'indirect') {
    adjustments.push({
      type: 'communication_style',
      adjustment: 'Use more indirect language patterns and context-sensitive responses'
    });
  }
  
  if (profile.family_structure === 'family-centered') {
    adjustments.push({
      type: 'family_inclusion', 
      adjustment: 'Include family dynamics and collective decision-making in therapeutic guidance'
    });
  }
  
  return adjustments;
}

function calculateRiskTrend(crises: any[]): number {
  if (crises.length < 2) return 0;
  
  const sortedCrises = crises.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const riskScores = sortedCrises.map(c => c.risk_score || 0.5);
  
  return calculateTrend(riskScores);
}

async function analyzeSessionPatternsForCrisis(sessions: any[]): Promise<{ patterns: number; alerts: number }> {
  // Placeholder for session pattern analysis
  return { patterns: 0, alerts: 0 };
}

function generateTherapyRecommendations(avgRating: number, moodImprovement: number, approach: string): any[] {
  const recommendations = [];
  
  if (avgRating < 3.5) {
    recommendations.push({
      type: 'approach_modification',
      priority: 'high',
      recommendation: `Consider modifying ${approach} approach due to low effectiveness rating`
    });
  }
  
  if (moodImprovement < 0.5) {
    recommendations.push({
      type: 'mood_focus',
      priority: 'medium', 
      recommendation: 'Focus on mood improvement techniques and emotional regulation'
    });
  }
  
  return recommendations;
}