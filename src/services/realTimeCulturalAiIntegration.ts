/**
 * Real-Time Cultural-AI Integration Service
 * Merges cultural context directly into AI routing decisions with dynamic adaptation
 */

import { supabase } from '@/integrations/supabase/client';
import { EnhancedCulturalContextService, UserCulturalProfile } from './enhancedCulturalContextService';
import { IntelligentRouterHub } from './intelligentRouterHub';

interface CulturalAIContext {
  userId: string;
  culturalProfile: UserCulturalProfile | null;
  aiModelPreferences: string[];
  culturalPromptModifications: any[];
  biasDetectionFlags: string[];
  communicationAdaptations: any;
  dynamicPersonalization: any;
}

interface CulturalAIResponse {
  originalResponse: string;
  culturallyAdaptedResponse: string;
  adaptationsApplied: string[];
  biasDetectionResults: any;
  culturalSensitivityScore: number;
  recommendedFollowUp: string[];
}

export class RealTimeCulturalAIIntegration {
  private static culturalContextCache: Map<string, CulturalAIContext> = new Map();
  private static biasDetectionPatterns: Map<string, RegExp[]> = new Map();

  /**
   * Initialize cultural-AI integration for a user session
   */
  static async initializeCulturalAIContext(userId: string): Promise<CulturalAIContext> {
    console.log('🌍 Initializing Cultural-AI Context for user:', userId);

    try {
      // Check cache first
      if (this.culturalContextCache.has(userId)) {
        const cached = this.culturalContextCache.get(userId)!;
        // Refresh if older than 1 hour
        if (Date.now() - (cached as any).lastUpdated < 60 * 60 * 1000) {
          return cached;
        }
      }

      // Load cultural profile
      const culturalProfile = await EnhancedCulturalContextService.getCulturalProfile(userId);
      
      // Generate AI model preferences based on cultural context
      const aiModelPreferences = this.generateCulturalAIModelPreferences(culturalProfile);
      
      // Generate prompt modifications
      const culturalPromptModifications = this.generateCulturalPromptModifications(culturalProfile);
      
      // Initialize bias detection flags
      const biasDetectionFlags = this.initializeBiasDetection(culturalProfile);
      
      // Generate communication adaptations
      const communicationAdaptations = this.generateCommunicationAdaptations(culturalProfile);
      
      // Generate dynamic personalization rules
      const dynamicPersonalization = await this.generateDynamicPersonalization(userId, culturalProfile);

      const context: CulturalAIContext = {
        userId,
        culturalProfile,
        aiModelPreferences,
        culturalPromptModifications,
        biasDetectionFlags,
        communicationAdaptations,
        dynamicPersonalization
      };

      // Cache with timestamp
      (context as any).lastUpdated = Date.now();
      this.culturalContextCache.set(userId, context);

      return context;

    } catch (error) {
      console.error('Error initializing cultural-AI context:', error);
      return this.getDefaultCulturalContext(userId);
    }
  }

  /**
   * Process AI response with real-time cultural integration
   */
  static async processCulturalAIResponse(
    originalResponse: string,
    userId: string,
    sessionContext: any
  ): Promise<CulturalAIResponse> {
    try {
      const context = await this.initializeCulturalAIContext(userId);
      
      // Step 1: Bias Detection and Flagging
      const biasDetectionResults = this.performBiasDetection(originalResponse, context);
      
      // Step 2: Cultural Sensitivity Analysis
      const culturalSensitivityScore = this.calculateCulturalSensitivity(originalResponse, context);
      
      // Step 3: Apply Cultural Adaptations
      let culturallyAdaptedResponse = await this.applyCulturalAdaptations(
        originalResponse, 
        context,
        sessionContext
      );
      
      // Step 4: Apply Communication Style Adaptations
      culturallyAdaptedResponse = this.applyCommunicationStyleAdaptations(
        culturallyAdaptedResponse,
        context
      );
      
      // Step 5: Apply Language and Regional Adaptations
      culturallyAdaptedResponse = this.applyLanguageAdaptations(
        culturallyAdaptedResponse,
        context
      );
      
      // Step 6: Generate culturally-appropriate follow-up suggestions
      const recommendedFollowUp = this.generateCulturalFollowUp(context, sessionContext);
      
      // Step 7: Track cultural interaction for learning
      await this.trackCulturalInteraction(userId, {
        originalResponse,
        adaptedResponse: culturallyAdaptedResponse,
        adaptationsApplied: this.getAppliedAdaptations(originalResponse, culturallyAdaptedResponse),
        biasFlags: biasDetectionResults.flaggedIssues,
        sensitivityScore: culturalSensitivityScore
      });

      const result: CulturalAIResponse = {
        originalResponse,
        culturallyAdaptedResponse,
        adaptationsApplied: this.getAppliedAdaptations(originalResponse, culturallyAdaptedResponse),
        biasDetectionResults,
        culturalSensitivityScore,
        recommendedFollowUp
      };

      return result;

    } catch (error) {
      console.error('Error processing cultural AI response:', error);
      return {
        originalResponse,
        culturallyAdaptedResponse: originalResponse,
        adaptationsApplied: [],
        biasDetectionResults: { flaggedIssues: [], confidence: 0 },
        culturalSensitivityScore: 0.5,
        recommendedFollowUp: []
      };
    }
  }

  /**
   * Generate AI model preferences based on cultural context
   */
  private static generateCulturalAIModelPreferences(profile: UserCulturalProfile | null): string[] {
    if (!profile) return ['gpt-4o-mini'];

    const preferences = [];

    // For non-English speakers, prefer models with better multilingual support
    if (profile.primaryLanguage !== 'en') {
      preferences.push('gpt-4o'); // Better multilingual capabilities
    }

    // For high-context cultures, prefer more nuanced models
    if (profile.communicationStyle === 'high-context' || profile.communicationStyle === 'indirect') {
      preferences.push('gpt-4o'); // Better at understanding nuance
    }

    // For collective cultures, prefer models good at family/community context
    if (profile.familyStructure === 'family-centered' || profile.familyStructure === 'collective') {
      preferences.push('gpt-4o');
    }

    // Default fallback
    if (preferences.length === 0) {
      preferences.push('gpt-4o-mini');
    }

    return preferences;
  }

  /**
   * Generate cultural prompt modifications
   */
  private static generateCulturalPromptModifications(profile: UserCulturalProfile | null): any[] {
    if (!profile) return [];

    const modifications = [];

    // Language-specific modifications
    if (profile.primaryLanguage !== 'en') {
      modifications.push({
        type: 'language_sensitivity',
        modification: `Remember that the user's primary language is ${profile.primaryLanguage}. Use clear, simple English and avoid idioms or culturally-specific references that may not translate well.`,
        priority: 'high'
      });
    }

    // Communication style modifications
    if (profile.communicationStyle === 'indirect') {
      modifications.push({
        type: 'communication_style',
        modification: 'Use indirect communication patterns. Avoid direct confrontation or commands. Phrase suggestions as gentle possibilities rather than directives.',
        priority: 'high'
      });
    }

    if (profile.communicationStyle === 'high-context') {
      modifications.push({
        type: 'context_sensitivity',
        modification: 'Be sensitive to implicit meanings and non-verbal context. The user may communicate important information indirectly.',
        priority: 'medium'
      });
    }

    // Family structure modifications
    if (profile.familyStructure === 'family-centered' || profile.familyStructure === 'collective') {
      modifications.push({
        type: 'family_inclusion',
        modification: 'Consider the importance of family and community in decision-making. Suggestions should acknowledge the role of family support and collective responsibility.',
        priority: 'high'
      });
    }

    // Religious considerations
    if (profile.religiousConsiderations && profile.religiousDetails) {
      modifications.push({
        type: 'spiritual_sensitivity',
        modification: `Be respectful of the user's ${profile.religiousDetails} beliefs. Integrate spiritual perspectives when appropriate and avoid conflicting advice.`,
        priority: 'high'
      });
    }

    // Cultural background specific modifications
    if (profile.culturalBackground) {
      modifications.push({
        type: 'cultural_context',
        modification: `Consider ${profile.culturalBackground} cultural values and practices in your responses. Be aware of potential cultural differences in mental health perception and treatment approaches.`,
        priority: 'medium'
      });
    }

    return modifications;
  }

  /**
   * Initialize bias detection patterns for cultural context
   */
  private static initializeBiasDetection(profile: UserCulturalProfile | null): string[] {
    const flags = [];

    if (!profile) return flags;

    // Cultural stereotype flags
    if (profile.culturalBackground) {
      flags.push(`cultural_stereotypes_${profile.culturalBackground}`);
    }

    // Language bias flags
    if (profile.primaryLanguage !== 'en') {
      flags.push('language_bias');
      flags.push('western_centrism');
    }

    // Religious bias flags
    if (profile.religiousConsiderations) {
      flags.push('religious_bias');
      flags.push('secular_assumptions');
    }

    // Communication style bias
    if (profile.communicationStyle === 'indirect' || profile.communicationStyle === 'high-context') {
      flags.push('direct_communication_bias');
    }

    return flags;
  }

  /**
   * Perform bias detection on AI response
   */
  private static performBiasDetection(response: string, context: CulturalAIContext): any {
    const flaggedIssues = [];
    let confidence = 0;

    // Check for western-centric assumptions
    if (context.biasDetectionFlags.includes('western_centrism')) {
      const westernBiasPatterns = [
        /individual(ism|ity)/gi,
        /independent/gi,
        /self-reliant/gi
      ];
      
      for (const pattern of westernBiasPatterns) {
        if (pattern.test(response)) {
          flaggedIssues.push({
            type: 'western_centrism',
            pattern: pattern.source,
            suggestion: 'Consider collective and family-oriented approaches'
          });
          confidence += 0.2;
        }
      }
    }

    // Check for direct communication bias
    if (context.biasDetectionFlags.includes('direct_communication_bias')) {
      const directBiasPatterns = [
        /you should/gi,
        /you must/gi,
        /you need to/gi
      ];
      
      for (const pattern of directBiasPatterns) {
        if (pattern.test(response)) {
          flaggedIssues.push({
            type: 'direct_communication_bias',
            pattern: pattern.source,
            suggestion: 'Use more indirect, gentle language'
          });
          confidence += 0.3;
        }
      }
    }

    // Check for religious/secular assumptions
    if (context.biasDetectionFlags.includes('secular_assumptions')) {
      const secularBiasPatterns = [
        /scientific approach/gi,
        /rational thinking/gi,
        /evidence-based only/gi
      ];
      
      for (const pattern of secularBiasPatterns) {
        if (pattern.test(response)) {
          flaggedIssues.push({
            type: 'secular_assumptions',
            pattern: pattern.source,
            suggestion: 'Acknowledge spiritual perspectives and beliefs'
          });
          confidence += 0.25;
        }
      }
    }

    return {
      flaggedIssues,
      confidence: Math.min(confidence, 1.0),
      totalChecks: context.biasDetectionFlags.length
    };
  }

  /**
   * Calculate cultural sensitivity score
   */
  private static calculateCulturalSensitivity(response: string, context: CulturalAIContext): number {
    let score = 0.5; // Base score

    if (!context.culturalProfile) return score;

    // Check for cultural awareness indicators
    const culturalAwarenessIndicators = [
      /family/gi,
      /community/gi,
      /cultural/gi,
      /tradition/gi,
      /belief/gi,
      /values/gi
    ];

    let awarenes­sIndicators = 0;
    for (const indicator of culturalAwarenessIndicators) {
      if (indicator.test(response)) {
        awarenessIndicators++;
      }
    }

    score += (awarenessIndicators * 0.1);

    // Check for respectful language
    const respectfulLanguage = [
      /understand/gi,
      /respect/gi,
      /appreciate/gi,
      /acknowledge/gi
    ];

    let respectfulCount = 0;
    for (const pattern of respectfulLanguage) {
      if (pattern.test(response)) {
        respectfulCount++;
      }
    }

    score += (respectfulCount * 0.05);

    // Penalty for potentially insensitive content
    const insensitivePatterns = [
      /weird/gi,
      /strange/gi,
      /backwards/gi,
      /primitive/gi
    ];

    for (const pattern of insensitivePatterns) {
      if (pattern.test(response)) {
        score -= 0.2;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Apply cultural adaptations to response
   */
  private static async applyCulturalAdaptations(
    response: string, 
    context: CulturalAIContext,
    sessionContext: any
  ): Promise<string> {
    let adaptedResponse = response;

    if (!context.culturalProfile) return adaptedResponse;

    // Apply prompt modifications
    for (const modification of context.culturalPromptModifications) {
      switch (modification.type) {
        case 'family_inclusion':
          adaptedResponse = this.addFamilyContext(adaptedResponse);
          break;
        case 'spiritual_sensitivity':
          adaptedResponse = this.addSpiritualSensitivity(adaptedResponse, context.culturalProfile);
          break;
        case 'cultural_context':
          adaptedResponse = this.addCulturalContext(adaptedResponse, context.culturalProfile);
          break;
      }
    }

    return adaptedResponse;
  }

  /**
   * Apply communication style adaptations
   */
  private static applyCommunicationStyleAdaptations(
    response: string,
    context: CulturalAIContext
  ): string {
    if (!context.culturalProfile) return response;

    let adaptedResponse = response;

    switch (context.culturalProfile.communicationStyle) {
      case 'indirect':
        adaptedResponse = this.makeIndirect(adaptedResponse);
        break;
      case 'high-context':
        adaptedResponse = this.addContextualSensitivity(adaptedResponse);
        break;
    }

    return adaptedResponse;
  }

  /**
   * Apply language adaptations
   */
  private static applyLanguageAdaptations(
    response: string,
    context: CulturalAIContext
  ): string {
    if (!context.culturalProfile || context.culturalProfile.primaryLanguage === 'en') {
      return response;
    }

    // Simplify language for non-native speakers
    let adaptedResponse = response;
    
    // Replace complex words with simpler alternatives
    const simplifications = {
      'utilize': 'use',
      'implement': 'do',
      'facilitate': 'help',
      'predominantly': 'mostly',
      'subsequently': 'then',
      'endeavor': 'try'
    };

    for (const [complex, simple] of Object.entries(simplifications)) {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      adaptedResponse = adaptedResponse.replace(regex, simple);
    }

    // Add clarifying language
    if (adaptedResponse.includes('(')) {
      // Already has clarifications
    } else {
      // Add simple explanations for potentially confusing terms
      adaptedResponse = adaptedResponse.replace(/\bcoping strategies\b/gi, 'coping strategies (ways to manage stress)');
      adaptedResponse = adaptedResponse.replace(/\bcognitive\b/gi, 'cognitive (thinking-related)');
    }

    return adaptedResponse;
  }

  // Helper methods for adaptations
  private static addFamilyContext(response: string): string {
    if (response.includes('decision') && !response.includes('family')) {
      return response.replace(/your decision/g, 'your and your family\'s decision');
    }
    return response;
  }

  private static addSpiritualSensitivity(response: string, profile: UserCulturalProfile): string {
    if (profile.religiousDetails && !response.toLowerCase().includes('spiritual')) {
      return response + `\n\nI understand that your ${profile.religiousDetails} faith may provide additional guidance and strength in this journey.`;
    }
    return response;
  }

  private static addCulturalContext(response: string, profile: UserCulturalProfile): string {
    if (profile.culturalBackground && !response.toLowerCase().includes('cultur')) {
      return response + `\n\nI want to be mindful of your ${profile.culturalBackground} cultural background as we work together.`;
    }
    return response;
  }

  private static makeIndirect(response: string): string {
    return response
      .replace(/You should/g, 'You might consider')
      .replace(/You must/g, 'It could be helpful to')
      .replace(/You need to/g, 'Perhaps you could')
      .replace(/Do this/g, 'One approach might be to');
  }

  private static addContextualSensitivity(response: string): string {
    if (!response.includes('I sense') && !response.includes('I understand')) {
      return `I sense there might be more to what you're sharing. ${response}`;
    }
    return response;
  }

  private static generateCommunicationAdaptations(profile: UserCulturalProfile | null): any {
    if (!profile) return {};

    return {
      directness: profile.communicationStyle === 'direct' ? 'high' : 'low',
      contextSensitivity: profile.communicationStyle === 'high-context' ? 'high' : 'medium',
      formalityLevel: profile.culturalBackground === 'east-asian' ? 'high' : 'medium'
    };
  }

  private static async generateDynamicPersonalization(userId: string, profile: UserCulturalProfile | null): Promise<any> {
    try {
      // Get user's recent interactions to learn preferences
      const { data: recentInteractions } = await supabase
        .from('cultural_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);

      return {
        preferredResponseLength: 'medium',
        preferredTone: profile?.communicationStyle || 'balanced',
        culturalReferences: profile?.culturalBackground || 'universal',
        adaptationHistory: recentInteractions || []
      };
    } catch (error) {
      console.error('Error generating dynamic personalization:', error);
      return {};
    }
  }

  private static generateCulturalFollowUp(context: CulturalAIContext, sessionContext: any): string[] {
    const followUps = [];

    if (context.culturalProfile?.familyStructure === 'family-centered') {
      followUps.push("How does your family view this situation?");
      followUps.push("Would it be helpful to discuss this with your family?");
    }

    if (context.culturalProfile?.religiousConsiderations) {
      followUps.push("How do your spiritual beliefs guide you in this situation?");
      followUps.push("Would prayer or spiritual practices be helpful here?");
    }

    if (context.culturalProfile?.communicationStyle === 'indirect') {
      followUps.push("Is there something else you'd like to share about this?");
      followUps.push("How are you feeling about all of this?");
    }

    return followUps;
  }

  private static getAppliedAdaptations(original: string, adapted: string): string[] {
    const adaptations = [];
    
    if (original !== adapted) {
      if (adapted.includes('family')) adaptations.push('family_context_added');
      if (adapted.includes('spiritual') || adapted.includes('faith')) adaptations.push('spiritual_sensitivity_added');
      if (adapted.includes('might') || adapted.includes('perhaps')) adaptations.push('indirect_communication_applied');
      if (adapted.includes('cultural')) adaptations.push('cultural_awareness_added');
    }
    
    return adaptations;
  }

  private static async trackCulturalInteraction(userId: string, interactionData: any): Promise<void> {
    try {
      await EnhancedCulturalContextService.trackCulturalInteraction(
        userId,
        'ai_response_adaptation',
        interactionData
      );
    } catch (error) {
      console.error('Error tracking cultural interaction:', error);
    }
  }

  private static getDefaultCulturalContext(userId: string): CulturalAIContext {
    return {
      userId,
      culturalProfile: null,
      aiModelPreferences: ['gpt-4o-mini'],
      culturalPromptModifications: [],
      biasDetectionFlags: [],
      communicationAdaptations: {},
      dynamicPersonalization: {}
    };
  }
}