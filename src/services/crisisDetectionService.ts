
import { supabase } from '@/integrations/supabase/client';

export interface CrisisIndicator {
  type: 'severe' | 'moderate' | 'mild';
  keywords: string[];
  score: number;
}

export interface CrisisResource {
  name: string;
  phone: string;
  description: string;
  availability: string;
  priority: number;
}

export class CrisisDetectionService {
  private static crisisKeywords = {
    severe: [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
      'harm myself', 'hurt myself', 'no way out', 'better off dead', 'end my life'
    ],
    moderate: [
      'hopeless', 'helpless', 'worthless', 'trapped', 'overwhelming',
      'can\'t cope', 'give up', 'pointless', 'desperate', 'unbearable'
    ],
    mild: [
      'stressed', 'anxious', 'depressed', 'worried', 'scared',
      'sad', 'overwhelmed', 'tired', 'exhausted', 'struggling'
    ]
  };

  private static crisisResources: CrisisResource[] = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      description: '24/7 free and confidential support for people in distress',
      availability: '24/7',
      priority: 1
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text message',
      availability: '24/7',
      priority: 2
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      description: 'Treatment referral and information service',
      availability: '24/7',
      priority: 3
    },
    {
      name: 'Emergency Services',
      phone: '911',
      description: 'For immediate medical or psychiatric emergencies',
      availability: '24/7',
      priority: 4
    }
  ];

  static analyzeCrisisLevel(message: string): CrisisIndicator | null {
    const lowerMessage = message.toLowerCase();
    let highestScore = 0;
    let detectedType: 'severe' | 'moderate' | 'mild' | null = null;
    const detectedKeywords: string[] = [];

    // Check severe indicators first
    for (const keyword of this.crisisKeywords.severe) {
      if (lowerMessage.includes(keyword)) {
        highestScore = Math.max(highestScore, 10);
        detectedType = 'severe';
        detectedKeywords.push(keyword);
      }
    }

    // Check moderate indicators
    if (highestScore < 6) {
      for (const keyword of this.crisisKeywords.moderate) {
        if (lowerMessage.includes(keyword)) {
          highestScore = Math.max(highestScore, 6);
          detectedType = 'moderate';
          detectedKeywords.push(keyword);
        }
      }
    }

    // Check mild indicators
    if (highestScore < 3) {
      for (const keyword of this.crisisKeywords.mild) {
        if (lowerMessage.includes(keyword)) {
          highestScore = Math.max(highestScore, 3);
          detectedType = 'mild';
          detectedKeywords.push(keyword);
        }
      }
    }

    if (detectedType && highestScore > 0) {
      return {
        type: detectedType,
        keywords: detectedKeywords,
        score: highestScore
      };
    }

    return null;
  }

  static getCrisisResources(priorityLevel: 'severe' | 'moderate' | 'mild'): CrisisResource[] {
    return this.crisisResources
      .filter(resource => {
        if (priorityLevel === 'severe') return resource.priority <= 2;
        if (priorityLevel === 'moderate') return resource.priority <= 3;
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  static generateCrisisResponse(indicator: CrisisIndicator): string {
    switch (indicator.type) {
      case 'severe':
        return "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please reach out to a crisis counselor immediately or call 988 (Suicide & Crisis Lifeline). If you're in immediate danger, please call 911. You don't have to go through this alone - there are people who want to help.";
      
      case 'moderate':
        return "I can hear that you're going through a really difficult time right now. These feelings can be overwhelming, but there is support available. Please consider reaching out to a crisis helpline like 988 or text HOME to 741741. It might also be helpful to talk to a mental health professional, family member, or trusted friend.";
      
      case 'mild':
        return "It sounds like you're dealing with some challenging feelings. Remember that it's okay to ask for help when you need it. If these feelings persist or get worse, please don't hesitate to reach out to a mental health professional or a support hotline.";
      
      default:
        return "Thank you for sharing your feelings with me. Remember that support is always available if you need it.";
    }
  }

  async getCrisisAnalytics(dateRange?: { start: Date; end: Date }) {
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = dateRange?.end || new Date();

    const { data: interventions } = await supabase
      .from('crisis_interventions')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    return {
      totalInterventions: interventions?.length || 0,
      byStatus: this.groupBy(interventions || [], 'status'),
      byType: this.groupBy(interventions || [], 'intervention_type'),
      recentInterventions: interventions?.slice(0, 10) || []
    };
  }

  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const crisisDetectionService = new CrisisDetectionService();
