
interface CrisisIndicator {
  urgencyLevel: 'low' | 'medium' | 'high' | 'immediate';
  riskFactors: string[];
  recommendedActions: string[];
}

class EnhancedCrisisDetectionServiceClass {
  analyzeEnhancedCrisisLevel(message: string): CrisisIndicator | null {
    const lowerMessage = message.toLowerCase();
    
    // Immediate crisis indicators
    const immediateKeywords = [
      'kill myself', 'end it all', 'suicide', 'want to die', 'harm myself',
      'not worth living', 'better off dead', 'end my life'
    ];
    
    // High risk indicators
    const highRiskKeywords = [
      'hopeless', 'no point', 'cant go on', 'give up', 'hurt myself',
      'self harm', 'cutting', 'overdose'
    ];
    
    // Medium risk indicators
    const mediumRiskKeywords = [
      'depressed', 'overwhelmed', 'cant cope', 'breaking point',
      'falling apart', 'lose control'
    ];

    if (immediateKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        urgencyLevel: 'immediate',
        riskFactors: ['Suicidal ideation detected', 'Self-harm intent expressed'],
        recommendedActions: ['Contact emergency services immediately', 'Reach out to crisis hotline']
      };
    }

    if (highRiskKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        urgencyLevel: 'high',
        riskFactors: ['High emotional distress', 'Potential self-harm risk'],
        recommendedActions: ['Contact mental health professional', 'Reach out to support network']
      };
    }

    if (mediumRiskKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        urgencyLevel: 'medium',
        riskFactors: ['Emotional distress', 'Coping difficulties'],
        recommendedActions: ['Continue therapy conversation', 'Practice coping techniques']
      };
    }

    return null;
  }

  generateEnhancedResponse(indicator: CrisisIndicator): string {
    switch (indicator.urgencyLevel) {
      case 'immediate':
        return 'I\'m very concerned about what you\'ve shared. Your safety is the top priority. Please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.';
      case 'high':
        return 'I can hear that you\'re in significant distress. Please consider reaching out to a mental health professional or crisis support service. You don\'t have to go through this alone.';
      case 'medium':
        return 'It sounds like you\'re going through a difficult time. I\'m here to support you, and we can work through these feelings together.';
      default:
        return 'I\'m here to support you through whatever you\'re experiencing.';
    }
  }
}

export const EnhancedCrisisDetectionService = new EnhancedCrisisDetectionServiceClass();
