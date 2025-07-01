
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
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const response = this.generateTherapyResponse(userMessage, therapist);
    
    return {
      message: response.message,
      emotion: response.emotion,
      techniques: response.techniques || [],
      insights: response.insights || []
    };
  }

  private generateTherapyResponse(userMessage: string, therapist?: any): TherapyResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    let emotion = 'neutral';
    let techniques: string[] = [];
    let insights: string[] = [];

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
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    return {
      message: randomResponse,
      emotion,
      techniques,
      insights
    };
  }

  hasApiKey(): boolean {
    return this.apiKey !== null;
  }
}

export const OpenAIService = new OpenAIServiceClass();
