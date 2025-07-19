import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ContextualData {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  dayOfWeek: string;
  isWeekend: boolean;
  timezone: string;
}

export const useContextualAwareness = () => {
  const { user } = useAuth();
  const [contextualData, setContextualData] = useState<ContextualData | null>(null);

  const getCurrentContext = (): ContextualData => {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';

    let timeOfDay: ContextualData['timeOfDay'];
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    let season: ContextualData['season'];
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'fall';
    else season = 'winter';

    return {
      timeOfDay,
      season,
      dayOfWeek,
      isWeekend,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };

  const getContextualGreeting = (context: ContextualData) => {
    const greetings = {
      morning: [
        "Good morning! How are you starting your day?",
        "I hope you're having a peaceful morning.",
        "Good morning! I'm here if you need someone to talk to."
      ],
      afternoon: [
        "Good afternoon! How has your day been so far?",
        "I hope your afternoon is going well.",
        "Good afternoon! What's on your mind today?"
      ],
      evening: [
        "Good evening! How are you winding down today?",
        "I hope you're having a relaxing evening.",
        "Good evening! How are you feeling as the day comes to a close?"
      ],
      night: [
        "I'm here if you need someone to talk to tonight.",
        "Sometimes nighttime can bring up difficult thoughts. I'm here to listen.",
        "Good evening! I hope you're finding some peace tonight."
      ]
    };

    const timeGreetings = greetings[context.timeOfDay];
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  };

  const getSeasonalAdaptation = (context: ContextualData) => {
    const adaptations = {
      spring: {
        theme: "renewal and growth",
        suggestions: ["spending time in nature", "setting new goals", "embracing fresh starts"],
        moodConsiderations: "Spring can bring hope but also pressure to feel 'renewed'"
      },
      summer: {
        theme: "energy and connection",
        suggestions: ["outdoor activities", "social connections", "enjoying longer days"],
        moodConsiderations: "Summer energy can be overwhelming for some; it's okay to take it slow"
      },
      fall: {
        theme: "reflection and transition",
        suggestions: ["cozy activities", "reflection practices", "preparing for change"],
        moodConsiderations: "Seasonal changes can affect mood; be gentle with yourself"
      },
      winter: {
        theme: "introspection and warmth",
        suggestions: ["indoor comfort activities", "light therapy", "staying connected"],
        moodConsiderations: "Winter can be challenging; remember that seeking light and warmth is important"
      }
    };

    return adaptations[context.season];
  };

  const getTimeBasedTechniques = (context: ContextualData) => {
    const techniques = {
      morning: ["mindful breathing", "intention setting", "gratitude practice"],
      afternoon: ["progressive muscle relaxation", "cognitive reframing", "energy check-in"],
      evening: ["reflection journaling", "unwinding techniques", "tomorrow preparation"],
      night: ["sleep hygiene", "calming visualization", "worry time boundaries"]
    };

    return techniques[context.timeOfDay];
  };

  const adaptResponseToContext = (baseResponse: string, context: ContextualData) => {
    let adaptedResponse = baseResponse;

    // Add time-sensitive elements
    if (context.timeOfDay === 'night' && baseResponse.includes('today')) {
      adaptedResponse = adaptedResponse.replace('today', 'tonight');
    }

    // Add weekend/weekday context
    if (context.isWeekend && Math.random() > 0.7) {
      adaptedResponse += " I hope you're able to take some time for yourself this weekend.";
    }

    return adaptedResponse;
  };

  const storeContextualAdaptation = async (
    contextType: string,
    contextData: any,
    adaptationRules: any
  ) => {
    if (!user) return;

    try {
      // Note: This would use a different table or approach since contextual_awareness
      // table doesn't exist in the current schema
      console.log('Storing contextual adaptation:', { contextType, contextData, adaptationRules });
    } catch (error) {
      console.error('Error storing contextual adaptation:', error);
    }
  };

  useEffect(() => {
    const context = getCurrentContext();
    setContextualData(context);

    // Update context every hour
    const interval = setInterval(() => {
      const newContext = getCurrentContext();
      setContextualData(newContext);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    contextualData,
    getCurrentContext,
    getContextualGreeting,
    getSeasonalAdaptation,
    getTimeBasedTechniques,
    adaptResponseToContext,
    storeContextualAdaptation
  };
};