import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CrisisSession {
  id: string;
  crisis_level: 'low' | 'medium' | 'high' | 'critical';
  recognition_indicators: any;
  ai_response_actions: any;
  human_escalation_triggered: boolean;
  resolution_status: 'active' | 'monitoring' | 'resolved' | 'escalated';
  created_at: string;
}

export const useEnhancedCrisisSupport = () => {
  const { user } = useAuth();
  const [activeCrisis, setActiveCrisis] = useState<CrisisSession | null>(null);
  const [monitoringMode, setMonitoringMode] = useState(false);

  const detectCrisisIndicators = (message: string, previousMessages: string[] = []) => {
    const indicators = {
      selfHarmKeywords: ['hurt myself', 'kill myself', 'end it all', 'suicide', 'don\'t want to live'],
      hopelessnessKeywords: ['no point', 'hopeless', 'nothing matters', 'give up', 'no hope'],
      isolationKeywords: ['alone', 'nobody cares', 'no one understands', 'isolated'],
      intensityKeywords: ['can\'t take it', 'too much', 'overwhelming', 'breaking down'],
      planKeywords: ['plan to', 'going to', 'tonight', 'tomorrow', 'this weekend']
    };

    let crisisScore = 0;
    const foundIndicators: string[] = [];

    // Check for direct self-harm language
    indicators.selfHarmKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        crisisScore += 10;
        foundIndicators.push('self_harm_language');
      }
    });

    // Check for hopelessness
    indicators.hopelessnessKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        crisisScore += 5;
        foundIndicators.push('hopelessness');
      }
    });

    // Check for isolation
    indicators.isolationKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        crisisScore += 3;
        foundIndicators.push('isolation');
      }
    });

    // Check for intensity
    indicators.intensityKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        crisisScore += 4;
        foundIndicators.push('emotional_intensity');
      }
    });

    // Check for planning language
    indicators.planKeywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        crisisScore += 7;
        foundIndicators.push('planning_language');
      }
    });

    // Determine crisis level
    let crisisLevel: CrisisSession['crisis_level'];
    if (crisisScore >= 15) crisisLevel = 'critical';
    else if (crisisScore >= 10) crisisLevel = 'high';
    else if (crisisScore >= 5) crisisLevel = 'medium';
    else crisisLevel = 'low';

    return {
      crisisLevel,
      crisisScore,
      indicators: foundIndicators,
      requiresImmediate: crisisScore >= 10
    };
  };

  const createCrisisSession = async (
    sessionId: string,
    crisisLevel: CrisisSession['crisis_level'],
    indicators: any
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('crisis_support_sessions')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          crisis_level: crisisLevel,
          recognition_indicators: indicators,
          ai_response_actions: {},
          human_escalation_triggered: crisisLevel === 'critical',
          resolution_status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      setActiveCrisis(data);
      setMonitoringMode(true);
      return data;
    } catch (error) {
      console.error('Error creating crisis session:', error);
      return null;
    }
  };

  const generateCrisisResponse = (crisisLevel: CrisisSession['crisis_level'], indicators: string[]) => {
    const responses = {
      critical: {
        immediate: "I'm very concerned about what you just shared. Your safety is the most important thing right now. You don't have to face this alone.",
        resources: "I want to connect you with someone who can provide immediate support. Please consider calling the National Suicide Prevention Lifeline at 988.",
        presence: "I'm staying here with you. You matter, and there are people who want to help."
      },
      high: {
        immediate: "I can hear that you're in a lot of pain right now, and I'm really concerned about you.",
        resources: "Would it help to talk about some coping strategies? I also want you to know about crisis resources available to you.",
        presence: "You're not alone in this. I'm here with you, and we can work through this together."
      },
      medium: {
        immediate: "I notice you're going through a really difficult time right now.",
        resources: "Sometimes it helps to have extra support. Would you like to explore some resources or coping strategies?",
        presence: "I want you to know that I'm here to support you through this."
      },
      low: {
        immediate: "It sounds like you're dealing with some challenging feelings.",
        resources: "Let's explore what might help you feel more supported right now.",
        presence: "I'm here to listen and help you work through this."
      }
    };

    return responses[crisisLevel];
  };

  const updateCrisisSession = async (
    sessionId: string,
    aiActions: any,
    newStatus?: CrisisSession['resolution_status']
  ) => {
    if (!activeCrisis) return;

    try {
      const updateData: any = {
        ai_response_actions: aiActions
      };

      if (newStatus) {
        updateData.resolution_status = newStatus;
      }

      const { data, error } = await supabase
        .from('crisis_support_sessions')
        .update(updateData)
        .eq('id', activeCrisis.id)
        .select()
        .single();

      if (error) throw error;
      setActiveCrisis(data);
    } catch (error) {
      console.error('Error updating crisis session:', error);
    }
  };

  const scheduleFollowup = async (followupTime: Date) => {
    if (!activeCrisis) return;

    try {
      await supabase
        .from('crisis_support_sessions')
        .update({
          followup_scheduled: true,
          resolution_status: 'monitoring'
        })
        .eq('id', activeCrisis.id);

      // Here you would also create a proactive care trigger for follow-up
    } catch (error) {
      console.error('Error scheduling followup:', error);
    }
  };

  const getCrisisResources = () => {
    return {
      immediate: {
        title: "Immediate Crisis Support",
        resources: [
          {
            name: "National Suicide Prevention Lifeline",
            number: "988",
            description: "24/7 crisis support"
          },
          {
            name: "Crisis Text Line",
            number: "Text HOME to 741741",
            description: "24/7 text crisis support"
          },
          {
            name: "Emergency Services",
            number: "911",
            description: "For immediate medical emergencies"
          }
        ]
      },
      ongoing: {
        title: "Ongoing Support",
        resources: [
          {
            name: "NAMI Support Groups",
            description: "Local mental health support groups"
          },
          {
            name: "Therapy Finder",
            description: "Find local mental health professionals"
          }
        ]
      }
    };
  };

  const shouldTriggerHumanEscalation = (crisisLevel: CrisisSession['crisis_level'], indicators: string[]) => {
    return crisisLevel === 'critical' || 
           indicators.includes('self_harm_language') || 
           indicators.includes('planning_language');
  };

  useEffect(() => {
    // Monitor for crisis session resolution
    if (monitoringMode && activeCrisis) {
      const checkResolution = setInterval(() => {
        // Check if crisis has been resolved or needs escalation
        // This would be based on continued conversation patterns
      }, 60000); // Check every minute

      return () => clearInterval(checkResolution);
    }
  }, [monitoringMode, activeCrisis]);

  return {
    activeCrisis,
    monitoringMode,
    detectCrisisIndicators,
    createCrisisSession,
    generateCrisisResponse,
    updateCrisisSession,
    scheduleFollowup,
    getCrisisResources,
    shouldTriggerHumanEscalation
  };
};