/**
 * Elite Intelligent Router Hub
 * Central intelligence layer that coordinates all AI, cultural, and therapy systems
 */

import { supabase } from '@/integrations/supabase/client';
import { EnhancedCulturalContextService, UserCulturalProfile } from './enhancedCulturalContextService';
import { ConfiguredAIService } from './configuredAiService';
import { Message } from '@/types';

interface RouterContext {
  userId: string;
  sessionId: string;
  messageHistory: Message[];
  currentMessage: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
  sessionType: 'therapy' | 'assessment' | 'crisis' | 'goal_tracking';
}

interface IntelligentRouting {
  selectedModel: string;
  culturalAdaptations: any;
  therapyApproach: string;
  responseStrategy: string;
  priorityLevel: number;
  reasoning: string;
}

interface UserIntelligenceProfile {
  userId: string;
  culturalProfile: UserCulturalProfile | null;
  therapyPreferences: any;
  sessionHistory: any[];
  riskAssessment: any;
  effectivenessMetrics: any;
  adaptiveLearning: any;
}

export class IntelligentRouterHub {
  private static userProfiles: Map<string, UserIntelligenceProfile> = new Map();
  private static systemMetrics = {
    totalSessions: 0,
    culturalAdaptations: 0,
    crisisInterventions: 0,
    averageResponseTime: 0
  };

  /**
   * Main routing intelligence - determines optimal AI configuration
   */
  static async routeRequest(context: RouterContext): Promise<IntelligentRouting> {
    console.log('🧠 Intelligent Router Hub: Processing request', { 
      userId: context.userId, 
      urgency: context.urgencyLevel 
    });

    try {
      // 1. Load or create user intelligence profile
      const userProfile = await this.loadUserIntelligenceProfile(context.userId);
      
      // 2. Real-time crisis detection
      const crisisAssessment = await this.assessCrisisRisk(context);
      
      // 3. Cultural context integration
      const culturalAdaptations = await this.generateCulturalAdaptations(userProfile);
      
      // 4. Dynamic therapy approach selection
      const therapyApproach = await this.selectOptimalTherapyApproach(context, userProfile);
      
      // 5. AI model selection with performance optimization
      const selectedModel = await this.selectOptimalAIModel(context, userProfile);
      
      // 6. Response strategy determination
      const responseStrategy = await this.determineResponseStrategy(context, crisisAssessment);
      
      // 7. Calculate priority level
      const priorityLevel = this.calculatePriorityLevel(context, crisisAssessment);

      const routing: IntelligentRouting = {
        selectedModel,
        culturalAdaptations,
        therapyApproach,
        responseStrategy,
        priorityLevel,
        reasoning: `Selected ${selectedModel} with ${therapyApproach} approach for ${context.urgencyLevel} urgency session`
      };

      // 8. Update system metrics
      this.updateSystemMetrics(routing);
      
      // 9. Store routing decision for learning
      await this.storeRoutingDecision(context, routing);

      return routing;

    } catch (error) {
      console.error('❌ Intelligent Router Hub Error:', error);
      return this.getFailsafeRouting(context);
    }
  }

  /**
   * Process AI response with cultural and therapeutic intelligence
   */
  static async processAIResponse(
    response: string,
    context: RouterContext,
    routing: IntelligentRouting
  ): Promise<string> {
    try {
      // 1. Cultural adaptation of response
      let adaptedResponse = await this.applyCulturalAdaptations(
        response, 
        routing.culturalAdaptations
      );

      // 2. Therapeutic technique integration
      adaptedResponse = await this.applyTherapeuticTechniques(
        adaptedResponse,
        routing.therapyApproach,
        context
      );

      // 3. Crisis response handling
      if (context.urgencyLevel === 'crisis') {
        adaptedResponse = await this.enhanceCrisisResponse(adaptedResponse, context);
      }

      // 4. Personalization based on user learning
      const userProfile = this.userProfiles.get(context.userId);
      if (userProfile?.adaptiveLearning) {
        adaptedResponse = await this.personalizeResponse(adaptedResponse, userProfile);
      }

      // 5. Quality assurance and bias detection
      const qualityCheck = await this.performQualityAssurance(adaptedResponse, context);
      if (!qualityCheck.passed) {
        adaptedResponse = qualityCheck.correctedResponse || adaptedResponse;
      }

      return adaptedResponse;

    } catch (error) {
      console.error('❌ Response Processing Error:', error);
      return response; // Return original if processing fails
    }
  }

  /**
   * Load comprehensive user intelligence profile
   */
  private static async loadUserIntelligenceProfile(userId: string): Promise<UserIntelligenceProfile> {
    if (this.userProfiles.has(userId)) {
      return this.userProfiles.get(userId)!;
    }

    const profile: UserIntelligenceProfile = {
      userId,
      culturalProfile: await EnhancedCulturalContextService.getCulturalProfile(userId),
      therapyPreferences: await this.loadTherapyPreferences(userId),
      sessionHistory: await this.loadSessionHistory(userId),
      riskAssessment: await this.loadRiskAssessment(userId),
      effectivenessMetrics: await this.loadEffectivenessMetrics(userId),
      adaptiveLearning: await this.loadAdaptiveLearning(userId)
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Advanced crisis risk assessment
   */
  private static async assessCrisisRisk(context: RouterContext): Promise<any> {
    const riskFactors = {
      messageContent: this.analyzeCrisisKeywords(context.currentMessage),
      sessionPattern: this.analyzeSessionPattern(context.messageHistory),
      userHistory: await this.analyzeUserRiskHistory(context.userId),
      urgencyLevel: context.urgencyLevel === 'crisis' ? 1.0 : 0.0
    };

    const riskScore = (
      riskFactors.messageContent * 0.4 +
      riskFactors.sessionPattern * 0.3 +
      riskFactors.userHistory * 0.2 +
      riskFactors.urgencyLevel * 0.1
    );

    return {
      riskScore,
      requiresEscalation: riskScore > 0.7,
      interventionNeeded: riskScore > 0.5,
      factors: riskFactors
    };
  }

  /**
   * Generate cultural adaptations for AI response
   */
  private static async generateCulturalAdaptations(userProfile: UserIntelligenceProfile): Promise<any> {
    if (!userProfile.culturalProfile) {
      return { adaptations: [], culturalContext: 'universal' };
    }

    const adaptations = [];
    const profile = userProfile.culturalProfile;

    // Language adaptations
    if (profile.primaryLanguage !== 'en') {
      adaptations.push({
        type: 'language',
        adaptation: `Use culturally appropriate expressions for ${profile.primaryLanguage} speakers`
      });
    }

    // Communication style adaptations
    if (profile.communicationStyle === 'indirect' || profile.communicationStyle === 'high-context') {
      adaptations.push({
        type: 'communication',
        adaptation: 'Use indirect communication patterns, avoid direct confrontation'
      });
    }

    // Family structure adaptations
    if (profile.familyStructure === 'family-centered' || profile.familyStructure === 'collective') {
      adaptations.push({
        type: 'family',
        adaptation: 'Consider family and community perspectives in therapeutic advice'
      });
    }

    // Religious considerations
    if (profile.religiousConsiderations) {
      adaptations.push({
        type: 'spiritual',
        adaptation: `Respect religious beliefs and integrate spiritual perspectives: ${profile.religiousDetails}`
      });
    }

    return {
      adaptations,
      culturalContext: profile.culturalBackground,
      sensitivityAreas: profile.culturalSensitivities
    };
  }

  /**
   * Select optimal therapy approach based on context and user profile
   */
  private static async selectOptimalTherapyApproach(
    context: RouterContext, 
    userProfile: UserIntelligenceProfile
  ): Promise<string> {
    // Get user preferences
    const preferredApproaches = userProfile.therapyPreferences?.preferred_approaches || [];
    
    // Get effectiveness metrics for user
    const effectiveness = userProfile.effectivenessMetrics || {};
    
    // Context-based approach selection
    let contextualApproach = 'supportive';
    
    switch (context.sessionType) {
      case 'crisis':
        contextualApproach = 'crisis-intervention';
        break;
      case 'assessment':
        contextualApproach = 'assessment-focused';
        break;
      case 'goal_tracking':
        contextualApproach = 'goal-oriented';
        break;
      default:
        contextualApproach = 'integrative';
    }

    // If user has preferences and they've been effective, use them
    if (preferredApproaches.length > 0 && effectiveness[preferredApproaches[0]] > 0.7) {
      return preferredApproaches[0];
    }

    return contextualApproach;
  }

  /**
   * Select optimal AI model based on context and performance
   */
  private static async selectOptimalAIModel(
    context: RouterContext,
    userProfile: UserIntelligenceProfile
  ): Promise<string> {
    // High urgency or crisis situations use most capable model
    if (context.urgencyLevel === 'crisis' || context.urgencyLevel === 'high') {
      return 'gpt-4o';
    }

    // For culturally diverse users, use model with better cultural understanding
    if (userProfile.culturalProfile?.culturalBackground !== 'western') {
      return 'gpt-4o'; // Better for cultural nuances
    }

    // Default to efficient model for standard sessions
    return 'gpt-4o-mini';
  }

  /**
   * Determine response strategy based on context and risk assessment
   */
  private static async determineResponseStrategy(
    context: RouterContext,
    crisisAssessment: any
  ): Promise<string> {
    if (crisisAssessment.requiresEscalation) {
      return 'crisis-intervention';
    }

    if (crisisAssessment.interventionNeeded) {
      return 'supportive-intervention';
    }

    switch (context.sessionType) {
      case 'assessment':
        return 'structured-assessment';
      case 'goal_tracking':
        return 'goal-focused-motivation';
      default:
        return 'therapeutic-conversation';
    }
  }

  /**
   * Apply cultural adaptations to AI response
   */
  private static async applyCulturalAdaptations(
    response: string,
    adaptations: any
  ): Promise<string> {
    let adaptedResponse = response;

    for (const adaptation of adaptations.adaptations || []) {
      switch (adaptation.type) {
        case 'communication':
          adaptedResponse = this.adaptCommunicationStyle(adaptedResponse, adaptation.adaptation);
          break;
        case 'family':
          adaptedResponse = this.adaptForFamilyContext(adaptedResponse);
          break;
        case 'spiritual':
          adaptedResponse = this.adaptForSpiritualContext(adaptedResponse, adaptation.adaptation);
          break;
      }
    }

    return adaptedResponse;
  }

  /**
   * Apply therapeutic techniques to response
   */
  private static async applyTherapeuticTechniques(
    response: string,
    approach: string,
    context: RouterContext
  ): Promise<string> {
    const techniques = {
      'cognitive-behavioral': 'Include cognitive reframing suggestions',
      'mindfulness': 'Incorporate mindfulness and present-moment awareness',
      'psychodynamic': 'Explore underlying patterns and insights',
      'humanistic': 'Use person-centered, empathetic language',
      'crisis-intervention': 'Focus on immediate safety and coping strategies'
    };

    const technique = techniques[approach as keyof typeof techniques] || 'supportive listening';
    return `${response}\n\n[Therapeutic Focus: ${technique}]`;
  }

  // Helper methods for various analyses
  private static analyzeCrisisKeywords(message: string): number {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'hopeless',
      'worthless', 'can\'t go on', 'better off dead', 'self harm'
    ];
    
    const messageWords = message.toLowerCase().split(' ');
    const matches = crisisKeywords.filter(keyword => 
      messageWords.some(word => word.includes(keyword))
    );
    
    return Math.min(matches.length * 0.3, 1.0);
  }

  private static analyzeSessionPattern(history: Message[]): number {
    if (history.length < 3) return 0;
    
    const recentMessages = history.slice(-5);
    const negativityScore = recentMessages.reduce((score, msg) => {
      const negativeWords = ['sad', 'angry', 'hopeless', 'terrible', 'awful', 'hate'];
      const words = msg.content.toLowerCase().split(' ');
      const negativeCount = negativeWords.filter(word => words.includes(word)).length;
      return score + (negativeCount / words.length);
    }, 0) / recentMessages.length;
    
    return Math.min(negativityScore * 2, 1.0);
  }

  private static async analyzeUserRiskHistory(userId: string): Promise<number> {
    try {
      const { data } = await supabase
        .from('crisis_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (!data || data.length === 0) return 0;
      
      const recentRiskScore = data.reduce((avg, assessment) => 
        avg + (assessment.risk_score || 0), 0) / data.length;
      
      return Math.min(recentRiskScore, 1.0);
    } catch (error) {
      console.error('Error analyzing user risk history:', error);
      return 0;
    }
  }

  private static calculatePriorityLevel(context: RouterContext, crisisAssessment: any): number {
    let priority = 1;
    
    if (context.urgencyLevel === 'crisis') priority = 10;
    else if (context.urgencyLevel === 'high') priority = 7;
    else if (context.urgencyLevel === 'medium') priority = 4;
    
    if (crisisAssessment.requiresEscalation) priority = Math.max(priority, 9);
    if (crisisAssessment.interventionNeeded) priority = Math.max(priority, 6);
    
    return priority;
  }

  private static updateSystemMetrics(routing: IntelligentRouting): void {
    this.systemMetrics.totalSessions++;
    if (routing.culturalAdaptations.adaptations?.length > 0) {
      this.systemMetrics.culturalAdaptations++;
    }
    if (routing.priorityLevel >= 8) {
      this.systemMetrics.crisisInterventions++;
    }
  }

  private static async storeRoutingDecision(
    context: RouterContext, 
    routing: IntelligentRouting
  ): Promise<void> {
    try {
      await supabase
        .from('ai_routing_decisions')
        .insert({
          user_id: context.userId,
          session_id: context.sessionId,
          selected_model: routing.selectedModel,
          therapy_approach: routing.therapyApproach,
          priority_level: routing.priorityLevel,
          cultural_adaptations: routing.culturalAdaptations,
          reasoning: routing.reasoning,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error storing routing decision:', error);
    }
  }

  private static getFailsafeRouting(context: RouterContext): IntelligentRouting {
    return {
      selectedModel: 'gpt-4o-mini',
      culturalAdaptations: { adaptations: [], culturalContext: 'universal' },
      therapyApproach: 'supportive',
      responseStrategy: 'therapeutic-conversation',
      priorityLevel: context.urgencyLevel === 'crisis' ? 10 : 3,
      reasoning: 'Failsafe routing due to system error'
    };
  }

  // Placeholder methods for additional functionality
  private static async loadTherapyPreferences(userId: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('enhanced_therapy_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data || {};
    } catch {
      return {};
    }
  }

  private static async loadSessionHistory(userId: string): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    } catch {
      return [];
    }
  }

  private static async loadRiskAssessment(userId: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('crisis_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data || {};
    } catch {
      return {};
    }
  }

  private static async loadEffectivenessMetrics(userId: string): Promise<any> {
    return {}; // Placeholder
  }

  private static async loadAdaptiveLearning(userId: string): Promise<any> {
    return {}; // Placeholder
  }

  private static adaptCommunicationStyle(response: string, style: string): string {
    // Add gentle, indirect phrasing for high-context cultures
    if (style.includes('indirect')) {
      return response.replace(/You should/g, 'You might consider')
                   .replace(/You need to/g, 'Perhaps it would be helpful to')
                   .replace(/Do this/g, 'One approach could be to');
    }
    return response;
  }

  private static adaptForFamilyContext(response: string): string {
    // Add family-inclusive language
    return response.replace(/your decision/g, 'your and your family\'s decision')
                   .replace(/think about/g, 'discuss with your support system and think about');
  }

  private static adaptForSpiritualContext(response: string, context: string): string {
    // Add spiritual sensitivity
    return response + `\n\nI understand that your ${context} may provide additional guidance and strength in this journey.`;
  }

  private static async enhanceCrisisResponse(response: string, context: RouterContext): Promise<string> {
    const crisisResources = `
    
🚨 IMMEDIATE SUPPORT RESOURCES:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

If you are in immediate danger, please contact emergency services or go to your nearest emergency room.`;

    return response + crisisResources;
  }

  private static async personalizeResponse(response: string, userProfile: UserIntelligenceProfile): Promise<string> {
    // Add personalization based on user learning patterns
    return response; // Placeholder for now
  }

  private static async performQualityAssurance(response: string, context: RouterContext): Promise<{passed: boolean, correctedResponse?: string}> {
    // Placeholder for quality assurance and bias detection
    return { passed: true };
  }
}