import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const { 
      userId, 
      onboardingData,
      culturalProfile, 
      traumaHistory,
      therapistSelection,
      assessmentResults,
      mentalHealthAssessments,
      clinicalData,
      riskAssessment,
      preferences
    } = requestBody;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'UserId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating therapy plan for user:', userId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the attempt
    await supabase
      .from('therapy_plan_creation_logs')
      .insert({
        user_id: userId,
        status: 'started',
        plan_data: { onboardingData }
      });

    // Get comprehensive user data for enhanced analysis
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: existingCulturalProfile } = await supabase
      .from('user_cultural_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: existingTraumaHistory } = await supabase
      .from('trauma_history')
      .select('*')
      .eq('user_id', userId)
      .single();

    console.log('User data retrieved:', {
      userProfile: !!userProfile,
      culturalProfile: !!existingCulturalProfile,
      traumaHistory: !!existingTraumaHistory
    });

    // Create a comprehensive therapy plan using Claude
    const planningPrompt = `
    You are an advanced AI therapy planning system. Create a comprehensive, evidence-based therapy plan for a user based on their onboarding data.

    USER DATA:
    User Profile: ${JSON.stringify(userProfile, null, 2)}
    Onboarding Data: ${JSON.stringify(onboardingData, null, 2)}
    Cultural Profile: ${JSON.stringify(culturalProfile || existingCulturalProfile, null, 2)}
    Trauma History: ${JSON.stringify(traumaHistory || existingTraumaHistory, null, 2)}
    Assessment Results: ${JSON.stringify(assessmentResults, null, 2)}
    Mental Health Assessments: ${JSON.stringify(mentalHealthAssessments, null, 2)}
    Clinical Data: ${JSON.stringify(clinicalData, null, 2)}
    Risk Assessment: ${JSON.stringify(riskAssessment, null, 2)}
    Preferences: ${JSON.stringify(preferences, null, 2)}
    Therapist Selection: ${JSON.stringify(therapistSelection, null, 2)}

    Create a personalized therapy plan with the following JSON structure:
    {
      "primaryApproach": "Primary therapy approach name",
      "primaryDescription": "Detailed description of primary approach",
      "primaryReasoning": "Why this approach was selected",
      "secondaryApproach": "Secondary/supportive approach name",
      "secondaryDescription": "Description of secondary approach",
      "secondaryReasoning": "How it complements the primary approach",
      "goals": ["Goal 1", "Goal 2", "Goal 3"],
      "expectedOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
      "techniques": ["Technique 1", "Technique 2", "Technique 3"],
      "sessionFrequency": "Weekly/Biweekly/etc",
      "sessionDuration": "50 minutes",
      "sessionFormat": "Individual/Group/etc",
      "treatmentDuration": "12-16 weeks",
      "culturalAdaptations": {
        "communicationStyle": "Adapted communication approach",
        "considerations": "Cultural considerations integrated"
      },
      "riskLevel": "low|medium|high",
      "effectivenessScore": 0.85,
      "adaptations": {
        "needed": true,
        "frequency": "session_based",
        "triggers": ["Progress stall", "User feedback"]
      }
    }

    REQUIREMENTS:
    1. Base recommendations on evidence-based practices
    2. Consider cultural background and communication preferences
    3. Integrate trauma-informed care if applicable
    4. Provide specific, actionable goals
    5. Ensure cultural sensitivity and appropriateness
    6. Consider user's preferred therapy approaches and therapist selection
    `;

    let planData;
    
    if (anthropicApiKey) {
      console.log('Using Anthropic API for plan generation');
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 3000,
          temperature: 0.3,
          system: 'You are a professional therapy planning AI. Respond only with valid JSON.',
          messages: [
            { role: 'user', content: planningPrompt }
          ]
        }),
      });

      if (!anthropicResponse.ok) {
        console.error('Anthropic API error:', anthropicResponse.status);
        throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
      }

      const anthropicData = await anthropicResponse.json();
      planData = JSON.parse(anthropicData.content[0].text);
    } else {
      console.log('Using fallback plan generation');
      // Fallback therapy plan based on onboarding data
      planData = {
        primaryApproach: "Cognitive Behavioral Therapy (CBT)",
        primaryDescription: "Evidence-based approach focusing on identifying and changing negative thought patterns and behaviors that contribute to emotional distress.",
        primaryReasoning: "CBT is highly effective for anxiety, depression, and stress-related concerns identified in your assessment.",
        secondaryApproach: "Mindfulness-Based Therapy",
        secondaryDescription: "Complementary techniques to enhance present-moment awareness and emotional regulation skills.",
        secondaryReasoning: "Mindfulness practices support CBT by developing emotional awareness and stress management capabilities.",
        goals: [
          "Develop effective coping strategies for stress and anxiety",
          "Improve emotional regulation and self-awareness",
          "Build resilience and long-term mental wellness habits"
        ],
        expectedOutcomes: [
          "Reduced anxiety and stress levels",
          "Improved mood and emotional stability",
          "Enhanced quality of life and daily functioning"
        ],
        techniques: [
          "Cognitive Restructuring",
          "Behavioral Activation",
          "Mindfulness Meditation",
          "Progressive Muscle Relaxation",
          "Thought Record Exercises",
          "Grounding Techniques"
        ],
        sessionFrequency: "Weekly",
        sessionDuration: "50 minutes",
        sessionFormat: "Individual",
        treatmentDuration: "12-16 weeks",
        culturalAdaptations: {
          communicationStyle: culturalProfile?.communicationStyle || "Adapted to your communication preferences",
          considerations: culturalProfile?.culturalBackground ? 
            `Therapy approaches modified to respect your ${culturalProfile.culturalBackground} cultural background` :
            "Culturally sensitive approach tailored to your values and beliefs"
        },
        riskLevel: "low",
        effectivenessScore: 0.85,
        adaptations: {
          needed: true,
          frequency: "session_based",
          triggers: ["Progress evaluation", "User feedback", "Goal reassessment"]
        }
      };
    }

    console.log('Generated plan data:', planData);

    // Save the therapy plan to the database
    const therapyPlanData = {
      user_id: userId,
      primary_approach: planData.primaryApproach,
      secondary_approach: planData.secondaryApproach,
      techniques: planData.techniques,
      goals: planData.goals,
      adaptations: planData.adaptations,
      next_session_recommendations: {
        frequency: planData.sessionFrequency,
        duration: planData.sessionDuration,
        format: planData.sessionFormat,
        focus_areas: planData.goals.slice(0, 3)
      },
      effectiveness_score: planData.effectivenessScore,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creation_method: 'edge_function',
      api_used: anthropicApiKey ? 'anthropic' : 'fallback',
      fallback_used: !anthropicApiKey
    };

    console.log('Saving therapy plan to database:', therapyPlanData);

    const { data: savedPlan, error: saveError } = await supabase
      .from('adaptive_therapy_plans')
      .upsert(therapyPlanData, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving therapy plan:', saveError);
      throw new Error(`Failed to save therapy plan: ${saveError.message}`);
    }

    console.log('Therapy plan saved successfully:', savedPlan);

    // Log success
    await supabase
      .from('therapy_plan_creation_logs')
      .insert({
        user_id: userId,
        status: 'completed',
        plan_data: planData
      });

    // Create an AI therapy analysis record
    const analysisData = {
      user_id: userId,
      analysis_version: '1.0',
      personality_profile: {
        communication_style: culturalProfile?.communicationStyle || 'adaptive',
        therapy_preferences: preferences?.therapy || {},
        cultural_background: culturalProfile?.culturalBackground || 'general'
      },
      treatment_recommendations: {
        primary_approach: planData.primaryApproach,
        secondary_approach: planData.secondaryApproach,
        session_structure: {
          frequency: planData.sessionFrequency,
          duration: planData.sessionDuration,
          format: planData.sessionFormat
        }
      },
      risk_factors: riskAssessment?.risk_factors || [],
      protective_factors: riskAssessment?.protective_factors || [],
      intervention_priorities: planData.goals,
      confidence_score: planData.effectivenessScore,
      computed_risk_level: planData.riskLevel,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: analysisError } = await supabase
      .from('ai_therapy_analysis')
      .upsert(analysisData, {
        onConflict: 'user_id'
      });

    if (analysisError) {
      console.warn('Warning: Could not save AI therapy analysis:', analysisError);
    }

    console.log(`Therapy plan created successfully for user ${userId}`);

    return new Response(JSON.stringify(planData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in adaptive therapy planner:', error);
    
    // Log the error
    try {
      const { userId } = await req.json();
      if (userId) {
        await supabase
          .from('therapy_plan_creation_logs')
          .insert({
            user_id: userId,
            status: 'failed',
            error_message: error.message
          });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Therapy plan creation failed', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});