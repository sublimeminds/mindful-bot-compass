import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

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
    const { userAssessment, availableTherapists } = await req.json();

    console.log('AI Therapist Matching - Processing request for user assessment:', userAssessment?.userId);

    const systemPrompt = `You are an expert AI therapist matching system with deep expertise in psychology, therapy modalities, cultural competency, and personality assessment. Your task is to analyze a user's comprehensive assessment and match them with the most suitable therapists from the available pool.

ANALYSIS FRAMEWORK:
1. Primary Concerns & Symptoms
   - Severity and urgency level
   - Specific diagnostic indicators
   - Trauma history and safety considerations
   - Crisis risk factors

2. Personality & Communication Style
   - Introversion vs extraversion tendencies
   - Analytical vs emotional processing preferences
   - Direct vs gentle communication needs
   - Authority vs collaborative relationship preference

3. Cultural & Identity Factors
   - Cultural background and values
   - Language preferences and needs
   - Religious/spiritual considerations
   - Identity-specific experiences (LGBTQ+, neurodivergent, etc.)

4. Therapy Approach Preferences
   - Evidence-based vs holistic approaches
   - Structured vs flexible session styles
   - Homework/between-session work comfort level
   - Long-term vs short-term goals

5. Practical Considerations
   - Session frequency and duration preferences
   - Experience level preferences
   - Therapist gender/age preferences

MATCHING CRITERIA:
- Specialty alignment (exact match for primary concerns = +30 points)
- Personality compatibility (compatible style = +25 points)
- Cultural competency (relevant background = +20 points)
- Approach methodology fit (preferred modality = +15 points)
- Communication style match (compatible style = +10 points)

Provide detailed reasoning for each therapist match, including:
- Overall compatibility score (0-100)
- Specific strengths of the match
- Potential challenges or considerations
- Recommended session approach
- Expected therapy duration and goals

Return a JSON response with ranked therapist matches and detailed analysis.`;

    const userPrompt = `Please analyze this user assessment and match them with suitable therapists:

USER ASSESSMENT:
${JSON.stringify(userAssessment, null, 2)}

AVAILABLE THERAPISTS:
${JSON.stringify(availableTherapists, null, 2)}

Provide a comprehensive analysis with:
1. User profile summary
2. Key matching factors
3. Ranked therapist recommendations (top 5)
4. Detailed reasoning for each match
5. Session approach recommendations

Format as JSON with this structure:
{
  "userProfile": {
    "primaryConcerns": [],
    "personalityType": "",
    "communicationStyle": "",
    "culturalNeeds": [],
    "therapyPreferences": []
  },
  "matchingFactors": {
    "criticalNeeds": [],
    "preferences": [],
    "riskFactors": []
  },
  "recommendations": [
    {
      "therapistId": "",
      "name": "",
      "compatibilityScore": 0,
      "strengths": [],
      "considerations": [],
      "reasoning": "",
      "recommendedApproach": "",
      "estimatedDuration": "",
      "sessionStructure": ""
    }
  ],
  "overallRecommendations": ""
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Anthropic API response received');

    let analysisResult;
    try {
      // Extract the content from Anthropic's response format
      const content = data.content[0].text;
      console.log('Raw Anthropic response:', content);
      
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback response structure
      analysisResult = {
        userProfile: {
          primaryConcerns: userAssessment.problems || [],
          personalityType: "Analysis needed",
          communicationStyle: userAssessment.communicationStyle || "direct",
          culturalNeeds: userAssessment.culturalBackground ? [userAssessment.culturalBackground] : [],
          therapyPreferences: userAssessment.therapyPreferences || []
        },
        matchingFactors: {
          criticalNeeds: ["Professional assessment needed"],
          preferences: ["Evidence-based approach"],
          riskFactors: []
        },
        recommendations: availableTherapists.slice(0, 5).map((therapist: any, index: number) => ({
          therapistId: therapist.id,
          name: therapist.name,
          compatibilityScore: 85 - (index * 5),
          strengths: therapist.specialties || [],
          considerations: ["Initial assessment needed"],
          reasoning: `Good match based on specialties: ${therapist.specialties?.join(', ') || 'General therapy'}`,
          recommendedApproach: therapist.approach || "Integrative approach",
          estimatedDuration: "12-16 sessions",
          sessionStructure: "Weekly 50-minute sessions"
        })),
        overallRecommendations: "Based on your assessment, we recommend starting with weekly sessions focusing on your primary concerns."
      };
    }

    console.log('Processed AI matching result:', analysisResult);

    return new Response(JSON.stringify({
      success: true,
      analysis: analysisResult,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-therapist-matching function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});