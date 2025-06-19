
import { CrisisDetectionService } from './crisisDetectionService';
import { CrisisManagementService } from './crisisManagementService';

export interface EnhancedCrisisIndicator {
  type: 'severe' | 'moderate' | 'mild';
  keywords: string[];
  score: number;
  confidence: number;
  riskFactors: string[];
  recommendations: string[];
  urgencyLevel: 'immediate' | 'within_24h' | 'within_week' | 'monitor';
}

export class EnhancedCrisisDetectionService extends CrisisDetectionService {
  private static contextualKeywords = {
    severe: {
      immediate: ['tonight', 'today', 'right now', 'immediately', 'this moment'],
      methods: ['pills', 'bridge', 'gun', 'rope', 'knife', 'overdose'],
      finality: ['goodbye', 'last time', 'final message', 'won\'t see you again'],
      isolation: ['nobody cares', 'all alone', 'no one understands', 'burden'],
      hopelessness: ['no future', 'never get better', 'no point', 'give up']
    },
    moderate: {
      planning: ['thinking about', 'considering', 'wondering if', 'what if'],
      distress: ['can\'t handle', 'too much', 'breaking point', 'falling apart'],
      help_seeking: ['need help', 'don\'t know what to do', 'scared', 'confused']
    },
    mild: {
      emotional: ['feeling down', 'bit sad', 'struggling lately', 'having a hard time'],
      temporary: ['today has been', 'this week', 'lately', 'recently']
    }
  };

  static analyzeEnhancedCrisisLevel(message: string, context?: {
    recentMessages?: string[];
    userHistory?: any;
    timeOfDay?: string;
  }): EnhancedCrisisIndicator | null {
    const lowerMessage = message.toLowerCase();
    const basicAnalysis = this.analyzeCrisisLevel(message);
    
    if (!basicAnalysis) return null;

    let enhancedScore = basicAnalysis.score;
    let confidence = 0.7;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Contextual analysis
    if (this.hasImmediateTimeReference(lowerMessage)) {
      enhancedScore += 15;
      riskFactors.push('immediate_time_reference');
      confidence += 0.2;
    }

    if (this.hasSpecificMethod(lowerMessage)) {
      enhancedScore += 20;
      riskFactors.push('specific_method_mentioned');
      confidence += 0.3;
    }

    if (this.hasFinalityIndicators(lowerMessage)) {
      enhancedScore += 15;
      riskFactors.push('finality_indicators');
      confidence += 0.2;
    }

    if (this.hasIsolationThemes(lowerMessage)) {
      enhancedScore += 10;
      riskFactors.push('isolation_themes');
      confidence += 0.1;
    }

    // Context-based adjustments
    if (context?.timeOfDay && this.isHighRiskTime(context.timeOfDay)) {
      enhancedScore += 5;
      riskFactors.push('high_risk_time_period');
    }

    if (context?.recentMessages && this.hasEscalatingPattern(context.recentMessages)) {
      enhancedScore += 10;
      riskFactors.push('escalating_pattern');
      confidence += 0.15;
    }

    // Cap the score and confidence
    enhancedScore = Math.min(enhancedScore, 100);
    confidence = Math.min(confidence, 1.0);

    // Determine urgency level
    const urgencyLevel = this.determineUrgencyLevel(enhancedScore, riskFactors);

    // Generate recommendations
    const generatedRecommendations = this.generateRecommendations(enhancedScore, riskFactors, urgencyLevel);

    return {
      type: basicAnalysis.type,
      keywords: basicAnalysis.keywords,
      score: enhancedScore,
      confidence,
      riskFactors,
      recommendations: generatedRecommendations,
      urgencyLevel
    };
  }

  private static hasImmediateTimeReference(message: string): boolean {
    return this.contextualKeywords.severe.immediate.some(keyword => 
      message.includes(keyword)
    );
  }

  private static hasSpecificMethod(message: string): boolean {
    return this.contextualKeywords.severe.methods.some(keyword => 
      message.includes(keyword)
    );
  }

  private static hasFinalityIndicators(message: string): boolean {
    return this.contextualKeywords.severe.finality.some(keyword => 
      message.includes(keyword)
    );
  }

  private static hasIsolationThemes(message: string): boolean {
    return this.contextualKeywords.severe.isolation.some(keyword => 
      message.includes(keyword)
    );
  }

  private static isHighRiskTime(timeOfDay: string): boolean {
    // Late night/early morning hours are higher risk
    const hour = parseInt(timeOfDay.split(':')[0]);
    return (hour >= 22 || hour <= 6);
  }

  private static hasEscalatingPattern(recentMessages: string[]): boolean {
    if (recentMessages.length < 2) return false;
    
    let escalationScore = 0;
    for (const message of recentMessages) {
      const analysis = this.analyzeCrisisLevel(message);
      if (analysis) {
        escalationScore += analysis.score;
      }
    }
    
    return escalationScore > 30; // Threshold for escalating pattern
  }

  private static determineUrgencyLevel(score: number, riskFactors: string[]): 'immediate' | 'within_24h' | 'within_week' | 'monitor' {
    const highRiskFactors = ['immediate_time_reference', 'specific_method_mentioned', 'finality_indicators'];
    const hasHighRiskFactor = riskFactors.some(factor => highRiskFactors.includes(factor));

    if (score >= 80 || hasHighRiskFactor) return 'immediate';
    if (score >= 60) return 'within_24h';
    if (score >= 40) return 'within_week';
    return 'monitor';
  }

  private static generateRecommendations(score: number, riskFactors: string[], urgencyLevel: string): string[] {
    const recommendations: string[] = [];

    switch (urgencyLevel) {
      case 'immediate':
        recommendations.push('Contact emergency services (911) immediately');
        recommendations.push('Do not leave the person alone');
        recommendations.push('Call National Suicide Prevention Lifeline (988)');
        recommendations.push('Remove any means of self-harm from immediate vicinity');
        break;
      
      case 'within_24h':
        recommendations.push('Contact crisis counselor or mental health professional within 24 hours');
        recommendations.push('Activate safety plan if available');
        recommendations.push('Contact trusted friend or family member');
        recommendations.push('Call National Suicide Prevention Lifeline (988)');
        break;
      
      case 'within_week':
        recommendations.push('Schedule appointment with mental health professional');
        recommendations.push('Implement coping strategies');
        recommendations.push('Increase social support and check-ins');
        recommendations.push('Monitor for any escalation in symptoms');
        break;
      
      case 'monitor':
        recommendations.push('Continue regular therapy sessions');
        recommendations.push('Practice self-care and stress management');
        recommendations.push('Monitor mood and triggers');
        recommendations.push('Reach out for support if symptoms worsen');
        break;
    }

    // Additional specific recommendations based on risk factors
    if (riskFactors.includes('isolation_themes')) {
      recommendations.push('Prioritize social connection and support');
    }
    
    if (riskFactors.includes('escalating_pattern')) {
      recommendations.push('Consider intensive therapy or hospitalization');
    }

    return recommendations;
  }

  static async createAutomatedIntervention(
    userId: string, 
    crisisIndicator: EnhancedCrisisIndicator, 
    message: string
  ): Promise<boolean> {
    try {
      // Create crisis assessment
      const assessment = await CrisisManagementService.createCrisisAssessment({
        assessment_type: 'automated_detection',
        risk_level: crisisIndicator.type === 'severe' ? 'high' : crisisIndicator.type === 'moderate' ? 'medium' : 'low',
        responses: {
          detected_message: message,
          analysis: crisisIndicator,
          automated: true
        },
        total_score: crisisIndicator.score,
        severity_indicators: crisisIndicator.riskFactors,
        status: 'active'
      });

      if (!assessment) return false;

      // Create appropriate intervention
      const interventionType = crisisIndicator.urgencyLevel === 'immediate' 
        ? 'emergency_contact' 
        : 'automated_response';

      await CrisisManagementService.createCrisisIntervention({
        crisis_assessment_id: assessment.id,
        intervention_type: interventionType,
        intervention_data: {
          urgency_level: crisisIndicator.urgencyLevel,
          recommendations: crisisIndicator.recommendations,
          confidence: crisisIndicator.confidence,
          automated: true
        },
        status: 'pending',
        follow_up_required: crisisIndicator.urgencyLevel !== 'monitor'
      });

      return true;
    } catch (error) {
      console.error('Error creating automated intervention:', error);
      return false;
    }
  }

  static generateEnhancedResponse(indicator: EnhancedCrisisIndicator): string {
    const baseResponse = this.generateCrisisResponse(indicator);
    
    let enhancedResponse = baseResponse;
    
    if (indicator.urgencyLevel === 'immediate') {
      enhancedResponse += '\n\n🚨 IMMEDIATE ACTION REQUIRED:\n';
      enhancedResponse += '• Call 911 if in immediate danger\n';
      enhancedResponse += '• Call 988 (Suicide & Crisis Lifeline) now\n';
      enhancedResponse += '• Do not wait - seek help immediately\n';
    } else if (indicator.urgencyLevel === 'within_24h') {
      enhancedResponse += '\n\n⚠️ URGENT - Please take action within 24 hours:\n';
      enhancedResponse += '• Contact a mental health professional\n';
      enhancedResponse += '• Call 988 for immediate support\n';
      enhancedResponse += '• Reach out to a trusted friend or family member\n';
    }

    if (indicator.recommendations.length > 0) {
      enhancedResponse += '\n\nRecommended actions:\n';
      indicator.recommendations.forEach(rec => {
        enhancedResponse += `• ${rec}\n`;
      });
    }

    return enhancedResponse;
  }
}
