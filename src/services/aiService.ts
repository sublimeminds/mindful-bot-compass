
interface TherapyContext {
  userGoals: string[];
  concerns: string[];
  experience: string;
  preferences: string[];
  sessionHistory: Array<{
    content: string;
    sender: 'user' | 'ai';
    emotion?: string;
  }>;
}

interface TherapyResponse {
  content: string;
  technique?: string;
  followUpSuggestions?: string[];
  emotion: 'supportive' | 'curious' | 'validating' | 'challenging';
}

class AITherapyService {
  private context: TherapyContext | null = null;

  setContext(context: TherapyContext) {
    this.context = context;
  }

  async generateResponse(userMessage: string, emotion: 'positive' | 'negative' | 'neutral'): Promise<TherapyResponse> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = this.generateTherapeuticResponse(userMessage, emotion);
    return response;
  }

  private generateTherapeuticResponse(message: string, emotion: 'positive' | 'negative' | 'neutral'): TherapyResponse {
    const lowerMessage = message.toLowerCase();
    
    // Crisis keywords detection
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'not worth living', 'hurt myself'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        content: "I'm very concerned about what you're sharing. Your life has value, and there are people who want to help. Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline: 988. Would you like me to help you find local emergency resources?",
        technique: "Crisis Intervention",
        emotion: 'supportive'
      };
    }

    // Anxiety-focused responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('panic')) {
      return {
        content: "It sounds like you're experiencing anxiety right now. That must feel overwhelming. Let's take a moment to ground ourselves. Can you tell me 5 things you can see around you right now? This grounding technique can help bring you back to the present moment.",
        technique: "Grounding Technique (5-4-3-2-1)",
        followUpSuggestions: ["Practice deep breathing", "Try progressive muscle relaxation", "Explore anxiety triggers"],
        emotion: 'supportive'
      };
    }

    // Depression-focused responses
    if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
      return {
        content: "I hear the pain in your words, and I want you to know that your feelings are valid. Depression can make everything feel heavy and hopeless, but you're taking a brave step by reaching out. What's one small thing that brought you even a tiny bit of comfort recently?",
        technique: "Behavioral Activation",
        followUpSuggestions: ["Identify daily activities", "Set small achievable goals", "Explore support systems"],
        emotion: 'validating'
      };
    }

    // Trauma-focused responses
    if (lowerMessage.includes('trauma') || lowerMessage.includes('abuse') || lowerMessage.includes('hurt')) {
      return {
        content: "Thank you for trusting me with something so difficult. Trauma can have lasting effects, and it takes tremendous courage to talk about it. You're safe here. Would you like to explore some coping strategies, or would you prefer to share more about what you're experiencing?",
        technique: "Trauma-Informed Response",
        followUpSuggestions: ["Learn grounding techniques", "Explore safety planning", "Discuss professional resources"],
        emotion: 'validating'
      };
    }

    // Relationship issues
    if (lowerMessage.includes('relationship') || lowerMessage.includes('partner') || lowerMessage.includes('family')) {
      return {
        content: "Relationships can be both our greatest source of joy and our deepest challenge. It sounds like you're navigating something difficult. What aspects of this relationship situation feel most important to you right now?",
        technique: "Relationship Exploration",
        followUpSuggestions: ["Explore communication patterns", "Identify boundaries", "Discuss relationship values"],
        emotion: 'curious'
      };
    }

    // Positive emotion responses
    if (emotion === 'positive') {
      return {
        content: "I'm glad to hear there are positive moments in your experience. It's important to recognize and celebrate these feelings, even small ones. What do you think contributed to this positive feeling? Understanding what works for you can be really valuable.",
        technique: "Positive Psychology",
        followUpSuggestions: ["Explore strengths", "Practice gratitude", "Build on positive experiences"],
        emotion: 'supportive'
      };
    }

    // Default therapeutic response
    return {
      content: "I appreciate you sharing that with me. It takes courage to open up about what you're experiencing. I'm here to listen and support you. What feels most important for you to explore right now, or what would be most helpful?",
      technique: "Active Listening",
      followUpSuggestions: ["Explore feelings deeper", "Identify coping strategies", "Set therapy goals"],
      emotion: 'supportive'
    };
  }

  analyzeEmotion(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'grateful', 'proud', 'accomplished', 'peaceful', 'content'];
    const negativeWords = ['sad', 'angry', 'depressed', 'anxious', 'worried', 'afraid', 'hurt', 'lonely', 'frustrated', 'overwhelmed'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}

export const aiTherapyService = new AITherapyService();
