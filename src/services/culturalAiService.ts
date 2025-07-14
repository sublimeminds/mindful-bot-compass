import { supabase } from '@/integrations/supabase/client';
import { EnhancedCulturalContextService } from './enhancedCulturalContextService';

export interface CulturalAIAdapter {
  adaptPrompt(prompt: string, culturalContext: any): Promise<string>;
  adaptResponse(response: string, culturalContext: any): Promise<string>;
  getCulturalGuidelines(culturalBackground: string): Promise<any>;
  validateCulturalSensitivity(content: string, culturalContext: any): number;
}

export interface CulturalTherapyTechnique {
  id: string;
  name: string;
  culturalOrigin: string;
  applicableCultures: string[];
  technique: string;
  adaptations: {
    [culturalBackground: string]: {
      modifications: string[];
      considerations: string[];
      examples: string[];
    };
  };
}

export interface CulturalCommunicationStyle {
  directness: 'high' | 'medium' | 'low';
  hierarchy: 'egalitarian' | 'moderate' | 'hierarchical';
  emotionalExpression: 'open' | 'moderate' | 'reserved';
  familyInvolvement: 'individual' | 'moderate' | 'collective';
  spirituality: 'secular' | 'moderate' | 'religious';
  timeOrientation: 'monochronic' | 'mixed' | 'polychronic';
}

export class CulturalAIService implements CulturalAIAdapter {
  
  // Core Cultural AI Adaptation
  async adaptPrompt(prompt: string, culturalContext: any): Promise<string> {
    if (!culturalContext) return prompt;

    const culturalGuidelines = await this.getCulturalGuidelines(culturalContext.culturalBackground);
    const communicationStyle = this.getCommunicationStyle(culturalContext);
    
    let adaptedPrompt = prompt;

    // Add cultural context to system prompt
    adaptedPrompt += `\n\nCULTURAL CONTEXT:
- Primary Language: ${culturalContext.primaryLanguage || 'English'}
- Cultural Background: ${culturalContext.culturalBackground}
- Family Structure: ${culturalContext.familyStructure}
- Communication Style: ${this.formatCommunicationStyle(communicationStyle)}
- Religious Considerations: ${culturalContext.religiousConsiderations ? 'Yes' : 'No'}
${culturalContext.religiousDetails ? `- Religious Details: ${culturalContext.religiousDetails}` : ''}

ADAPTATION GUIDELINES:
${culturalGuidelines.communicationGuidelines.join('\n')}
${culturalGuidelines.therapyAdaptations.join('\n')}`;

    return adaptedPrompt;
  }

  async adaptResponse(response: string, culturalContext: any): Promise<string> {
    if (!culturalContext) return response;

    const communicationStyle = this.getCommunicationStyle(culturalContext);
    let adaptedResponse = response;

    // Apply cultural communication adaptations
    adaptedResponse = this.adaptCommunicationStyle(adaptedResponse, communicationStyle);
    
    // Add culturally appropriate metaphors or examples
    adaptedResponse = await this.addCulturalMetaphors(adaptedResponse, culturalContext);
    
    // Adjust formality and directness
    adaptedResponse = this.adjustFormality(adaptedResponse, communicationStyle);
    
    return adaptedResponse;
  }

  async getCulturalGuidelines(culturalBackground: string): Promise<any> {
    const guidelines = {
      'western': {
        communicationGuidelines: [
          'Use direct, clear communication',
          'Encourage individual autonomy and self-determination',
          'Focus on personal goals and achievements',
          'Respect privacy and personal boundaries'
        ],
        therapyAdaptations: [
          'Emphasize individual therapy approaches',
          'Support personal choice and decision-making',
          'Use cognitive-behavioral techniques',
          'Encourage self-advocacy'
        ],
        familyInvolvement: 'moderate',
        preferredTechniques: ['CBT', 'mindfulness', 'goal-setting', 'self-reflection']
      },
      'hispanic': {
        communicationGuidelines: [
          'Show warmth and personalismo in interactions',
          'Respect familismo - family-centered values',
          'Use simpatía - maintain harmony and avoid conflict',
          'Acknowledge spirituality and faith if relevant'
        ],
        therapyAdaptations: [
          'Include family in treatment planning when appropriate',
          'Integrate spiritual and religious elements',
          'Use dichos (sayings) and cultural metaphors',
          'Respect traditional gender roles while promoting growth'
        ],
        familyInvolvement: 'high',
        preferredTechniques: ['family therapy', 'narrative therapy', 'spiritual integration', 'community support']
      },
      'asian': {
        communicationGuidelines: [
          'Show respect for hierarchy and elders',
          'Use indirect communication when addressing sensitive topics',
          'Maintain face and avoid public embarrassment',
          'Emphasize collective harmony over individual needs'
        ],
        therapyAdaptations: [
          'Address shame and stigma around mental health',
          'Integrate traditional healing practices',
          'Respect filial piety and family obligations',
          'Use mind-body approaches'
        ],
        familyInvolvement: 'high',
        preferredTechniques: ['mindfulness', 'meditation', 'tai chi', 'family harmony approaches']
      },
      'african': {
        communicationGuidelines: [
          'Emphasize Ubuntu - interconnectedness and community',
          'Respect oral traditions and storytelling',
          'Acknowledge historical trauma and resilience',
          'Value collective wisdom and elder guidance'
        ],
        therapyAdaptations: [
          'Integrate community and spiritual elements',
          'Use narrative and storytelling approaches',
          'Address systemic and generational trauma',
          'Emphasize strength-based perspectives'
        ],
        familyInvolvement: 'high',
        preferredTechniques: ['narrative therapy', 'community healing', 'ancestral wisdom', 'rhythm and movement']
      },
      'middle_eastern': {
        communicationGuidelines: [
          'Show respect for religious and cultural values',
          'Understand gender roles and family structures',
          'Value honor, dignity, and family reputation',
          'Acknowledge impact of displacement or migration'
        ],
        therapyAdaptations: [
          'Integrate Islamic or other religious principles',
          'Address cultural conflicts and identity issues',
          'Respect modesty and gender preferences',
          'Include family and community support'
        ],
        familyInvolvement: 'high',
        preferredTechniques: ['religious integration', 'family therapy', 'cultural identity work', 'community support']
      },
      'indigenous': {
        communicationGuidelines: [
          'Honor traditional healing practices and ceremonies',
          'Respect connection to land and nature',
          'Acknowledge historical trauma and cultural loss',
          'Value circular time and holistic perspectives'
        ],
        therapyAdaptations: [
          'Integrate traditional healing methods',
          'Address intergenerational trauma',
          'Include spiritual and ceremonial elements',
          'Emphasize connection to community and culture'
        ],
        familyInvolvement: 'high',
        preferredTechniques: ['traditional healing', 'nature-based therapy', 'ritual and ceremony', 'tribal support']
      }
    };

    return guidelines[culturalBackground] || guidelines['western'];
  }

  validateCulturalSensitivity(content: string, culturalContext: any): number {
    if (!culturalContext) return 70; // Neutral score

    let score = 70;
    const culturalGuidelines = this.getCulturalGuidelines(culturalContext.culturalBackground);
    
    // Check for culturally inappropriate language
    const problematicPhrases = this.getProblematicPhrases(culturalContext.culturalBackground);
    const hasProblematicContent = problematicPhrases.some(phrase => 
      content.toLowerCase().includes(phrase.toLowerCase())
    );
    
    if (hasProblematicContent) score -= 30;
    
    // Check for cultural sensitivity indicators
    const sensitivityIndicators = this.getCulturalSensitivityIndicators(culturalContext.culturalBackground);
    const sensitivityScore = sensitivityIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator.toLowerCase())
    ).length;
    
    score += sensitivityScore * 5;
    
    return Math.min(100, Math.max(0, score));
  }

  // Cultural Communication Styles
  private getCommunicationStyle(culturalContext: any): CulturalCommunicationStyle {
    const defaultStyles: { [key: string]: CulturalCommunicationStyle } = {
      'western': {
        directness: 'high',
        hierarchy: 'egalitarian',
        emotionalExpression: 'open',
        familyInvolvement: 'individual',
        spirituality: 'secular',
        timeOrientation: 'monochronic'
      },
      'hispanic': {
        directness: 'medium',
        hierarchy: 'moderate',
        emotionalExpression: 'open',
        familyInvolvement: 'collective',
        spirituality: 'religious',
        timeOrientation: 'polychronic'
      },
      'asian': {
        directness: 'low',
        hierarchy: 'hierarchical',
        emotionalExpression: 'reserved',
        familyInvolvement: 'collective',
        spirituality: 'moderate',
        timeOrientation: 'polychronic'
      },
      'african': {
        directness: 'medium',
        hierarchy: 'moderate',
        emotionalExpression: 'open',
        familyInvolvement: 'collective',
        spirituality: 'religious',
        timeOrientation: 'polychronic'
      }
    };

    return defaultStyles[culturalContext.culturalBackground] || defaultStyles['western'];
  }

  private formatCommunicationStyle(style: CulturalCommunicationStyle): string {
    return `Directness: ${style.directness}, Hierarchy: ${style.hierarchy}, ` +
           `Emotional Expression: ${style.emotionalExpression}, Family: ${style.familyInvolvement}`;
  }

  private adaptCommunicationStyle(response: string, style: CulturalCommunicationStyle): string {
    let adapted = response;

    // Adjust directness
    if (style.directness === 'low') {
      adapted = adapted.replace(/You should/g, 'You might consider');
      adapted = adapted.replace(/You need to/g, 'It could be helpful to');
      adapted = adapted.replace(/You must/g, 'Perhaps you could');
    }

    // Adjust hierarchy respect
    if (style.hierarchy === 'hierarchical') {
      adapted = adapted.replace(/tell your parents/g, 'respectfully discuss with your parents');
      adapted = adapted.replace(/confront/g, 'approach respectfully');
    }

    // Adjust family involvement
    if (style.familyInvolvement === 'collective') {
      adapted = adapted.replace(/your decision/g, 'your family\'s decision');
      adapted = adapted.replace(/what you want/g, 'what would be best for your family');
    }

    return adapted;
  }

  private async addCulturalMetaphors(response: string, culturalContext: any): Promise<string> {
    const metaphors = await this.getCulturalMetaphors(culturalContext.culturalBackground);
    
    // Simple implementation - in practice, this would be more sophisticated
    if (response.includes('strength') && metaphors.strength) {
      return response.replace('strength', `strength (like ${metaphors.strength})`);
    }
    
    if (response.includes('growth') && metaphors.growth) {
      return response.replace('growth', `growth (like ${metaphors.growth})`);
    }
    
    return response;
  }

  private adjustFormality(response: string, style: CulturalCommunicationStyle): string {
    if (style.hierarchy === 'hierarchical') {
      return response.replace(/Hey/g, 'Hello').replace(/Yeah/g, 'Yes');
    }
    return response;
  }

  private async getCulturalMetaphors(culturalBackground: string): Promise<any> {
    const metaphors: { [key: string]: any } = {
      'hispanic': {
        strength: 'the strength of familia bonds',
        growth: 'a plant growing with deep raíces',
        healing: 'the curandera\'s gentle touch'
      },
      'asian': {
        strength: 'bamboo that bends but doesn\'t break',
        growth: 'the lotus rising from muddy waters',
        healing: 'restoring qi and harmony'
      },
      'african': {
        strength: 'the mighty baobab tree',
        growth: 'a community raising a child',
        healing: 'ancestral wisdom guiding the way'
      }
    };

    return metaphors[culturalBackground] || {};
  }

  private getProblematicPhrases(culturalBackground: string): string[] {
    const phrases: { [key: string]: string[] } = {
      'asian': [
        'just get over it',
        'stop being so emotional',
        'ignore your family',
        'be more assertive'
      ],
      'hispanic': [
        'forget your culture',
        'don\'t involve your family',
        'religion is not important',
        'be more independent'
      ],
      'african': [
        'pull yourself up',
        'individual success',
        'forget the past',
        'don\'t trust others'
      ]
    };

    return phrases[culturalBackground] || [];
  }

  private getCulturalSensitivityIndicators(culturalBackground: string): string[] {
    const indicators: { [key: string]: string[] } = {
      'asian': [
        'respect',
        'harmony',
        'family',
        'balance',
        'patience',
        'wisdom'
      ],
      'hispanic': [
        'familia',
        'community',
        'faith',
        'respect',
        'warmth',
        'support'
      ],
      'african': [
        'community',
        'strength',
        'resilience',
        'ancestors',
        'unity',
        'wisdom'
      ]
    };

    return indicators[culturalBackground] || [];
  }

  // Cultural Therapy Techniques
  async getCulturalTherapyTechniques(culturalBackground: string): Promise<CulturalTherapyTechnique[]> {
    // This would typically come from a database, but for now we'll use static data
    const techniques: CulturalTherapyTechnique[] = [
      {
        id: 'familismo-therapy',
        name: 'Familismo-Based Therapy',
        culturalOrigin: 'hispanic',
        applicableCultures: ['hispanic', 'latino'],
        technique: 'Integration of family-centered values in individual therapy',
        adaptations: {
          'hispanic': {
            modifications: [
              'Include family members in treatment planning',
              'Respect traditional gender roles',
              'Integrate religious/spiritual elements'
            ],
            considerations: [
              'Family loyalty vs. individual needs',
              'Machismo and marianismo concepts',
              'Immigration stress factors'
            ],
            examples: [
              'Family genogram with cultural roles',
              'Dichos (sayings) for therapeutic insights',
              'Compadrazgo system support networks'
            ]
          }
        }
      },
      {
        id: 'mindfulness-meditation',
        name: 'Culturally Adapted Mindfulness',
        culturalOrigin: 'asian',
        applicableCultures: ['asian', 'buddhist'],
        technique: 'Traditional mindfulness practices adapted for therapy',
        adaptations: {
          'asian': {
            modifications: [
              'Incorporate traditional meditation practices',
              'Use concepts of qi and energy balance',
              'Respect for ancestors and elders'
            ],
            considerations: [
              'Shame and stigma around mental health',
              'Filial piety obligations',
              'Model minority myth pressure'
            ],
            examples: [
              'Tai chi for anxiety management',
              'Tea ceremony mindfulness',
              'Ancestor honoring practices'
            ]
          }
        }
      },
      {
        id: 'ubuntu-therapy',
        name: 'Ubuntu-Based Healing',
        culturalOrigin: 'african',
        applicableCultures: ['african', 'south_african'],
        technique: 'Community-centered healing emphasizing interconnectedness',
        adaptations: {
          'african': {
            modifications: [
              'Group and community healing circles',
              'Storytelling and oral traditions',
              'Rhythm and movement therapy'
            ],
            considerations: [
              'Historical and intergenerational trauma',
              'Collectivist vs. individualist approaches',
              'Spiritual and ancestral connections'
            ],
            examples: [
              'Circle of support healing',
              'Ancestral wisdom consultation',
              'Community drumming sessions'
            ]
          }
        }
      }
    ];

    return techniques.filter(t => 
      t.applicableCultures.includes(culturalBackground) || 
      t.culturalOrigin === culturalBackground
    );
  }

  // Enhanced Cultural Context Integration
  async getEnhancedCulturalContext(userId: string): Promise<any> {
    try {
      const culturalProfile = await EnhancedCulturalContextService.getCulturalProfile(userId);
      
      if (!culturalProfile) return null;

      const communicationStyle = this.getCommunicationStyle(culturalProfile);
      const techniques = await this.getCulturalTherapyTechniques(culturalProfile.culturalBackground);
      const guidelines = await this.getCulturalGuidelines(culturalProfile.culturalBackground);

      return {
        ...culturalProfile,
        communicationStyle,
        recommendedTechniques: techniques,
        guidelines,
        adaptationLevel: this.calculateAdaptationLevel(culturalProfile)
      };
    } catch (error) {
      console.error('Error getting enhanced cultural context:', error);
      return null;
    }
  }

  private calculateAdaptationLevel(culturalProfile: any): 'minimal' | 'moderate' | 'comprehensive' {
    let score = 0;
    
    if (culturalProfile.primaryLanguage !== 'en') score += 2;
    if (culturalProfile.culturalBackground !== 'western') score += 2;
    if (culturalProfile.religiousConsiderations) score += 1;
    if (culturalProfile.familyStructure === 'extended') score += 1;
    if (culturalProfile.communicationStyle !== 'direct') score += 1;

    if (score >= 5) return 'comprehensive';
    if (score >= 3) return 'moderate';
    return 'minimal';
  }

  // Cultural Effectiveness Tracking
  async trackCulturalEffectiveness(userId: string, sessionId: string, metrics: {
    culturalSensitivityScore: number;
    userSatisfaction: number;
    culturalRelevance: number;
    adaptationSuccess: number;
  }): Promise<void> {
    try {
      // For now, we'll store this as metadata in session feedback
      // In a full implementation, we'd create a dedicated table
      console.log('Cultural effectiveness tracked:', { userId, sessionId, metrics });
    } catch (error) {
      console.error('Error tracking cultural effectiveness:', error);
    }
  }
}

export const culturalAIService = new CulturalAIService();