
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, profile, emotionalData, sessionData, progressData } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    const recommendations = generateRecommendations(profile, emotionalData, sessionData, progressData);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateRecommendations(profile: any, emotionalData: any[], sessionData: any[], progressData: any) {
  const recommendations = [];
  const now = new Date();
  const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  // Analyze recent emotional patterns
  if (emotionalData && emotionalData.length > 0) {
    const recentMood = emotionalData.slice(0, 7);
    const avgMood = recentMood.reduce((sum, entry) => sum + (entry.overall || 5), 0) / recentMood.length;
    
    if (avgMood < 4) {
      recommendations.push({
        id: `mood_${Date.now()}`,
        type: 'technique',
        title: 'Mood Boost Session',
        description: 'Your mood has been lower recently. Try this uplifting session.',
        reasoning: 'Your recent mood scores suggest you might benefit from mood enhancement techniques.',
        confidence: 0.8,
        priority: 'high',
        estimatedImpact: 0.7,
        validUntil: validUntil.toISOString(),
        metadata: { technique: 'mood-boost', duration: 15 }
      });
    }

    // Check stress levels
    const avgStress = recentMood.reduce((sum, entry) => sum + (entry.stress || 5), 0) / recentMood.length;
    if (avgStress > 6) {
      recommendations.push({
        id: `stress_${Date.now()}`,
        type: 'technique',
        title: 'Stress Relief Meditation',
        description: 'A guided meditation to help reduce stress levels.',
        reasoning: 'Your stress levels have been elevated. Meditation can help.',
        confidence: 0.75,
        priority: 'medium',
        estimatedImpact: 0.6,
        validUntil: validUntil.toISOString(),
        metadata: { technique: 'meditation', duration: 10 }
      });
    }
  }

  // Session-based recommendations
  if (sessionData && sessionData.length > 0) {
    const recentSessions = sessionData.slice(0, 5);
    const avgDuration = recentSessions.reduce((sum, session) => {
      const start = new Date(session.start_time);
      const end = session.end_time ? new Date(session.end_time) : new Date();
      return sum + (end.getTime() - start.getTime()) / 60000; // minutes
    }, 0) / recentSessions.length;

    if (avgDuration < 10) {
      recommendations.push({
        id: `session_${Date.now()}`,
        type: 'session',
        title: 'Extended Therapy Session',
        description: 'Consider a longer session for deeper therapeutic work.',
        reasoning: 'Your recent sessions have been short. Longer sessions often lead to better outcomes.',
        confidence: 0.65,
        priority: 'medium',
        estimatedImpact: 0.5,
        validUntil: validUntil.toISOString(),
        metadata: { recommendedDuration: 30 }
      });
    }
  }

  // Profile-based recommendations
  if (profile) {
    const currentHour = new Date().getHours();
    const preferredTime = profile.therapyPreferences?.timeOfDay;
    
    if (preferredTime === 'morning' && currentHour >= 6 && currentHour <= 10) {
      recommendations.push({
        id: `timing_${Date.now()}`,
        type: 'timing',
        title: 'Perfect Time for Therapy',
        description: 'Now is your preferred time for therapy sessions.',
        reasoning: 'Based on your preferences, morning sessions work best for you.',
        confidence: 0.9,
        priority: 'medium',
        estimatedImpact: 0.4,
        validUntil: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
        metadata: { optimalTiming: true }
      });
    }

    // Communication style recommendations
    if (profile.communicationStyle === 'gentle') {
      recommendations.push({
        id: `content_${Date.now()}`,
        type: 'content',
        title: 'Gentle Self-Compassion Exercise',
        description: 'A soft approach to building self-compassion.',
        reasoning: 'This aligns with your gentle communication preference.',
        confidence: 0.7,
        priority: 'low',
        estimatedImpact: 0.5,
        validUntil: validUntil.toISOString(),
        metadata: { approach: 'gentle', technique: 'self-compassion' }
      });
    }
  }

  // Progress-based recommendations
  if (progressData?.goals && progressData.goals.length > 0) {
    const incompleteGoals = progressData.goals.filter((goal: any) => !goal.is_completed);
    if (incompleteGoals.length > 0) {
      const oldestGoal = incompleteGoals.sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )[0];

      recommendations.push({
        id: `goal_${Date.now()}`,
        type: 'content',
        title: 'Goal Progress Review',
        description: `Let's work on your goal: ${oldestGoal.title}`,
        reasoning: 'You have goals that could benefit from focused attention.',
        confidence: 0.8,
        priority: 'high',
        estimatedImpact: 0.7,
        validUntil: validUntil.toISOString(),
        metadata: { goalId: oldestGoal.id, goalTitle: oldestGoal.title }
      });
    }
  }

  // Default recommendation if none generated
  if (recommendations.length === 0) {
    recommendations.push({
      id: `default_${Date.now()}`,
      type: 'session',
      title: 'Check-in Session',
      description: 'A gentle check-in to see how you\'re doing today.',
      reasoning: 'Regular check-ins help maintain emotional wellness.',
      confidence: 0.6,
      priority: 'medium',
      estimatedImpact: 0.5,
      validUntil: validUntil.toISOString(),
      metadata: { type: 'check-in' }
    });
  }

  return recommendations;
}
