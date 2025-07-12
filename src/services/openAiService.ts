
export interface TherapyResponse {
  message: string;
  emotion?: string;
  techniques?: string[];
  insights?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class OpenAIServiceClass {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = 'demo-key';
  }

  async sendTherapyMessage(
    userMessage: string,
    conversationHistory: ChatMessage[],
    therapist?: any,
    userId?: string
  ): Promise<TherapyResponse> {
    console.log('Sending therapy message:', userMessage);
    console.log('Therapist context:', therapist);
    console.log('Conversation history:', conversationHistory);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate contextually aware response
    const response = this.generateContextualTherapyResponse(userMessage, conversationHistory, therapist);
    
    return {
      message: response.message,
      emotion: response.emotion,
      techniques: response.techniques || [],
      insights: response.insights || []
    };
  }

  private generateContextualTherapyResponse(
    userMessage: string, 
    conversationHistory: ChatMessage[], 
    therapist?: any
  ): TherapyResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    let emotion = 'neutral';
    let techniques: string[] = [];
    let insights: string[] = [];

    // Get therapist personality context
    const therapistStyle = this.getTherapistStyle(therapist);
    
    // Analyze conversation context
    const conversationContext = this.analyzeConversationContext(conversationHistory);
    
    // Generate context-aware emotion and techniques

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      emotion = 'empathetic';
      techniques = ['Active Listening', 'Cognitive Restructuring'];
      insights = ['Recognizing emotional patterns'];
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      emotion = 'calming';
      techniques = ['Breathing Exercises', 'Mindfulness'];
      insights = ['Managing anger responses'];
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      emotion = 'reassuring';
      techniques = ['Grounding Techniques', 'Progressive Relaxation'];
      insights = ['Understanding anxiety triggers'];
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      emotion = 'encouraging';
      techniques = ['Positive Reinforcement', 'Gratitude Practice'];
      insights = ['Building on positive experiences'];
    }

    const responses = {
      empathetic: [
        "I can hear that you're going through a difficult time. It's completely normal to feel this way, and I want you to know that your feelings are valid.",
        "Thank you for sharing that with me. It takes courage to express when we're struggling. Can you tell me more about what's been weighing on you?",
        "I'm here to support you through this. Sometimes when we're feeling down, it can help to talk about what's contributing to these feelings."
      ],
      calming: [
        "It sounds like you're feeling quite frustrated right now. Let's take a moment to breathe together. What's been triggering these feelings of anger?",
        "I can sense your frustration, and that's okay. Anger is a natural emotion. What do you think might help you feel more at peace right now?",
        "It's understandable that you're feeling this way. Let's explore what's behind these feelings and find some healthy ways to process them."
      ],
      reassuring: [
        "I understand you're feeling anxious. Remember that anxiety is your mind's way of trying to protect you, even when it feels overwhelming. You're safe here.",
        "It's completely natural to feel worried sometimes. Let's work together to identify what's causing this anxiety and develop some coping strategies.",
        "Thank you for trusting me with your worries. Anxiety can feel very intense, but remember that you've overcome challenges before."
      ],
      encouraging: [
        "I'm so glad to hear you're feeling positive! It's wonderful that you can recognize and appreciate the good moments in your life.",
        "That's fantastic! It sounds like you're making real progress. What do you think has been helping you feel this way?",
        "I love hearing about the positive changes you're experiencing. How can we build on this momentum?"
      ],
      neutral: [
        "Thank you for sharing that with me. I'm here to listen and support you. What would you like to explore together today?",
        "I appreciate you opening up. How are you feeling about everything that's been going on in your life lately?",
        "It's good that you're taking time to reflect on your thoughts and feelings. What's been on your mind recently?"
      ]
    };

    const responseArray = responses[emotion as keyof typeof responses] || responses.neutral;
    let selectedResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    // Personalize response based on therapist style and conversation context
    selectedResponse = this.personalizeResponse(selectedResponse, therapistStyle, conversationContext, userMessage);

    return {
      message: selectedResponse,
      emotion,
      techniques,
      insights
    };
  }

  private getTherapistStyle(therapist?: any) {
    if (!therapist || !therapist.systemPrompt) {
      // Default style if no therapist selected
      return {
        approach: 'supportive',
        style: 'warm',
        communication: 'direct'
      };
    }

    // Extract style from therapist data
    return {
      approach: therapist.approach || 'supportive',
      style: therapist.communicationStyle || 'warm',
      communication: therapist.style || 'direct'
    };
  }

  private analyzeConversationContext(conversationHistory: ChatMessage[]) {
    const recentMessages = conversationHistory.slice(-3);
    
    return {
      length: conversationHistory.length,
      recentTopics: this.extractTopics(recentMessages),
      emotionalTrend: this.analyzeEmotionalTrend(recentMessages),
      isFirstMessage: conversationHistory.length === 0
    };
  }

  private extractTopics(messages: ChatMessage[]): string[] {
    const topics: string[] = [];
    const topicKeywords = {
      'work': ['work', 'job', 'career', 'boss', 'colleague'],
      'relationship': ['relationship', 'partner', 'family', 'friend'],
      'anxiety': ['anxious', 'worried', 'nervous', 'panic'],
      'depression': ['sad', 'depressed', 'down', 'hopeless'],
      'stress': ['stress', 'overwhelmed', 'pressure', 'burnout']
    };

    messages.forEach(msg => {
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => msg.content.toLowerCase().includes(keyword))) {
          if (!topics.includes(topic)) topics.push(topic);
        }
      });
    });

    return topics;
  }

  private analyzeEmotionalTrend(messages: ChatMessage[]): string {
    if (messages.length === 0) return 'neutral';
    
    const emotions = messages.map(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('better') || content.includes('good') || content.includes('happy')) return 'positive';
      if (content.includes('worse') || content.includes('bad') || content.includes('sad')) return 'negative';
      return 'neutral';
    });

    const positiveCount = emotions.filter(e => e === 'positive').length;
    const negativeCount = emotions.filter(e => e === 'negative').length;

    if (positiveCount > negativeCount) return 'improving';
    if (negativeCount > positiveCount) return 'declining';
    return 'stable';
  }

  private personalizeResponse(
    baseResponse: string, 
    therapistStyle: any, 
    context: any, 
    userMessage: string
  ): string {
    let personalizedResponse = baseResponse;

    // Add context-aware elements
    if (context.isFirstMessage) {
      personalizedResponse = `Hello! I'm here to support you. ${personalizedResponse}`;
    } else if (context.recentTopics.length > 0) {
      const topic = context.recentTopics[0];
      personalizedResponse = personalizedResponse.replace(
        'What would you like to explore together today?',
        `I notice we've been discussing ${topic}. How are you feeling about that now?`
      );
    }

    // Add therapist style
    if (therapistStyle.approach === 'CBT' || therapistStyle.approach === 'Cognitive Behavioral Therapy') {
      if (userMessage.toLowerCase().includes('think') || userMessage.toLowerCase().includes('thought')) {
        personalizedResponse += " Let's explore the thoughts behind these feelings.";
      }
    }

    // Add emotional trend awareness
    if (context.emotionalTrend === 'improving') {
      personalizedResponse += " I'm glad to hear you're making progress.";
    } else if (context.emotionalTrend === 'declining') {
      personalizedResponse += " I want you to know that it's okay to have difficult moments.";
    }

    return personalizedResponse;
  }

  private generateTherapyResponse(userMessage: string, therapist?: any): TherapyResponse {
    // Fallback to original method for backward compatibility
    return this.generateContextualTherapyResponse(userMessage, [], therapist);
  }

  hasApiKey(): boolean {
    return this.apiKey !== null;
  }
}

export const OpenAIService = new OpenAIServiceClass();
