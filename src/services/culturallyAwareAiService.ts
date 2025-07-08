
import { CrisisDetectionService } from './crisisDetectionService';
import { enhancedCacheService } from './enhancedCachingService';

export interface CulturalContext {
  language: string;
  region: string;
  culturalBackground?: string;
  religiousBeliefs?: string;
  familyStructure?: 'individual' | 'collective';
  communicationStyle?: 'direct' | 'indirect' | 'high-context' | 'low-context';
}

export interface TherapeuticApproach {
  name: string;
  culturallyAdapted: boolean;
  techniques: string[];
  contraindications: string[];
  effectiveness: number;
}

export interface EmotionAnalysis {
  primary: string;
  secondary: string[];
  intensity: number;
  culturalContext: string;
  culturalNuances: string[];
}

const CULTURAL_FRAMEWORKS = {
  'en-US': {
    communicationStyle: 'direct',
    therapyApproaches: ['CBT', 'DBT', 'Mindfulness', 'EMDR'],
    crisisResources: ['988', 'Crisis Text Line'],
    familyInvolvement: 'individual-focused',
    stigmaLevel: 'moderate'
  },
  'es': {
    communicationStyle: 'high-context',
    therapyApproaches: ['Family Therapy', 'Community-based', 'Religious Integration'],
    crisisResources: ['Local mental health services'],
    familyInvolvement: 'family-centered',
    stigmaLevel: 'high'
  },
  'ar': {
    communicationStyle: 'indirect',
    therapyApproaches: ['Islamic Psychology', 'Family Therapy', 'Community Support'],
    crisisResources: ['Religious counselors', 'Family intervention'],
    familyInvolvement: 'extended-family',
    stigmaLevel: 'very-high'
  },
  'zh': {
    communicationStyle: 'high-context',
    therapyApproaches: ['TCM Integration', 'Collective Therapy', 'Harmony-focused'],
    crisisResources: ['Family mediation', 'Community elders'],
    familyInvolvement: 'collective',
    stigmaLevel: 'high'
  }
};

export class CulturallyAwareAIService {
  private static culturalProfiles = new Map<string, CulturalContext>();

  static async analyzeEmotionWithCulture(
    text: string, 
    culturalContext: CulturalContext
  ): Promise<EmotionAnalysis> {
    try {
      const cacheKey = `emotion_${culturalContext.language}_${text.substring(0, 50)}`;
      
      return await enhancedCacheService.get(cacheKey, async () => {
        // Enhanced emotion detection with cultural awareness
        const baseEmotion = await this.detectBaseEmotion(text);
        const culturalNuances = this.applyCulturalEmotionFilter(baseEmotion, culturalContext);
        
        return {
          primary: baseEmotion.primary,
          secondary: baseEmotion.secondary,
          intensity: baseEmotion.intensity,
          culturalContext: this.getCulturalEmotionContext(baseEmotion.primary, culturalContext),
          culturalNuances
        };
      });
    } catch (error) {
      console.error('Error in cultural emotion analysis:', error);
      return {
        primary: 'neutral',
        secondary: [],
        intensity: 0.5,
        culturalContext: 'unknown',
        culturalNuances: []
      };
    }
  }

  static async generateCulturallyAdaptedResponse(
    message: string,
    culturalContext: CulturalContext,
    emotionAnalysis: EmotionAnalysis,
    conversationHistory: any[] = []
  ): Promise<string> {
    try {
      // Check for crisis indicators first
      const crisisLevel = await CrisisDetectionService.analyzeCrisisLevel(message);
      
      if (crisisLevel !== 'low') {
        return await this.generateCulturalCrisisResponse(crisisLevel, culturalContext);
      }

      // Get cultural framework for the user's background
      const framework = CULTURAL_FRAMEWORKS[culturalContext.language] || CULTURAL_FRAMEWORKS['en-US'];
      
      // Build culturally-aware prompt
      const culturalPrompt = this.buildCulturalPrompt(culturalContext, framework, emotionAnalysis);
      
      // Generate response using enhanced AI service
      const response = await this.callEnhancedAI(culturalPrompt, message, conversationHistory);
      
      // Apply cultural adaptation filters
      return this.applyCulturalResponseFilters(response, culturalContext);
      
    } catch (error) {
      console.error('Error generating culturally adapted response:', error);
      return this.getFallbackResponse(culturalContext);
    }
  }

  private static async detectBaseEmotion(text: string): Promise<any> {
    // Implementation would use advanced NLP for emotion detection
    // For now, return mock data
    return {
      primary: 'neutral',
      secondary: ['calm'],
      intensity: 0.5
    };
  }

  private static applyCulturalEmotionFilter(emotion: any, context: CulturalContext): string[] {
    const nuances: string[] = [];
    
    // Apply cultural filters based on context
    if (context.culturalBackground === 'collective') {
      nuances.push('group-harmony-focused');
    }
    
    if (context.communicationStyle === 'indirect') {
      nuances.push('implicit-emotional-expression');
    }
    
    return nuances;
  }

  private static getCulturalEmotionContext(emotion: string, context: CulturalContext): string {
    // Return culturally-appropriate emotion interpretation
    switch (context.language) {
      case 'ar':
        return 'emotion-within-family-context';
      case 'zh':
        return 'emotion-within-harmony-framework';
      case 'es':
        return 'emotion-within-community-context';
      default:
        return 'individual-emotion-focus';
    }
  }

  private static async generateCulturalCrisisResponse(
    indicator: any,
    context: CulturalContext
  ): Promise<string> {
    const framework = CULTURAL_FRAMEWORKS[context.language] || CULTURAL_FRAMEWORKS['en-US'];
    
    let response = await CrisisDetectionService.generateCrisisResponse(indicator);
    
    // Add cultural adaptations
    if (framework.familyInvolvement === 'family-centered') {
      response += " Consider involving trusted family members or community leaders who can provide support.";
    }
    
    if (framework.stigmaLevel === 'high') {
      response += " Remember that seeking help is a sign of strength and wisdom, not weakness.";
    }
    
    return response;
  }

  private static buildCulturalPrompt(
    context: CulturalContext,
    framework: any,
    emotion: EmotionAnalysis
  ): string {
    let prompt = `You are a culturally-aware AI therapist. Context:
    - Language: ${context.language}
    - Cultural Background: ${context.culturalBackground || 'unknown'}
    - Communication Style: ${context.communicationStyle || 'adaptive'}
    - Family Structure: ${context.familyStructure || 'individual'}
    
    Cultural Considerations:
    - Preferred Therapy Approaches: ${framework.therapyApproaches.join(', ')}
    - Family Involvement: ${framework.familyInvolvement}
    - Stigma Level: ${framework.stigmaLevel}
    
    Current Emotional State: ${emotion.primary} (${emotion.culturalContext})
    Cultural Nuances: ${emotion.culturalNuances.join(', ')}
    
    Guidelines:
    - Respect cultural values and beliefs
    - Adapt communication style accordingly
    - Consider family and community dynamics
    - Be sensitive to mental health stigma
    - Use culturally appropriate metaphors and examples`;
    
    return prompt;
  }

  private static async callEnhancedAI(
    prompt: string,
    message: string,
    history: any[]
  ): Promise<string> {
    // This would integrate with the existing AI service
    // For now, return a culturally-aware mock response
    return `I understand you're sharing something important with me. Let me respond in a way that honors your cultural background and current emotional state.`;
  }

  private static applyCulturalResponseFilters(
    response: string,
    context: CulturalContext
  ): string {
    // Apply post-processing filters based on cultural context
    let filteredResponse = response;
    
    // Adjust directness based on communication style
    if (context.communicationStyle === 'indirect') {
      filteredResponse = this.makeResponseMoreIndirect(filteredResponse);
    }
    
    // Add cultural considerations
    if (context.familyStructure === 'collective') {
      filteredResponse = this.addCommunityContext(filteredResponse);
    }
    
    return filteredResponse;
  }

  private static makeResponseMoreIndirect(response: string): string {
    // Transform direct statements to more indirect ones
    return response
      .replace(/You should/g, 'You might consider')
      .replace(/You need to/g, 'It might be helpful to')
      .replace(/This is/g, 'This seems to be');
  }

  private static addCommunityContext(response: string): string {
    // Add references to community and family support
    return response + " Remember that your community and family can be sources of strength and support during this time.";
  }

  private static getFallbackResponse(context: CulturalContext): string {
    const culturalGreeting = this.getCulturalGreeting(context.language);
    return `${culturalGreeting} I want to make sure I understand you correctly. Could you share a bit more about what you're experiencing?`;
  }

  private static getCulturalGreeting(language: string): string {
    const greetings = {
      'en': 'Thank you for sharing with me.',
      'es': 'Gracias por compartir conmigo.',
      'fr': 'Merci de partager avec moi.',
      'ar': 'شكرا لك على المشاركة معي.',
      'zh': '谢谢你与我分享。'
    };
    
    return greetings[language] || greetings['en'];
  }

  // Store and retrieve cultural profiles
  static setCulturalProfile(userId: string, profile: CulturalContext): void {
    this.culturalProfiles.set(userId, profile);
  }

  static getCulturalProfile(userId: string): CulturalContext | null {
    return this.culturalProfiles.get(userId) || null;
  }
}
