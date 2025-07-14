import { supabase } from '@/integrations/supabase/client';

export interface AlexPersonality {
  traits: string[];
  communicationStyle: 'supportive' | 'encouraging' | 'empathetic' | 'energetic';
  expertise: string[];
}

export interface ConversationContext {
  userId: string;
  sessionId?: string;
  currentPage: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  userMood?: 'positive' | 'neutral' | 'negative' | 'unknown';
  recentGoals?: any[];
  conversationHistory: AlexMessage[];
  userPreferences?: any;
}

export interface AlexMessage {
  id: string;
  content: string;
  sender: 'user' | 'alex';
  timestamp: Date;
  emotion: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating';
  type: 'text' | 'suggestion' | 'action' | 'celebration' | 'support';
  context?: Record<string, any>;
}

export interface AlexResponse {
  content: string;
  emotion: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'excited' | 'empathetic' | 'celebrating';
  type: 'text' | 'suggestion' | 'action' | 'celebration' | 'support';
  suggestions?: string[];
  actions?: { label: string; action: string }[];
  confidence: number;
  reasoning?: string;
}

class AlexAIService {
  private static personality: AlexPersonality = {
    traits: [
      'enthusiastic', 'supportive', 'wise', 'empathetic', 'encouraging',
      'culturally-aware', 'non-judgmental', 'proactive', 'personable', 'genuine'
    ],
    communicationStyle: 'supportive',
    expertise: [
      'mental health guidance', 'platform navigation', 'crisis recognition',
      'goal setting', 'motivation', 'emotional support', 'wellness tracking',
      'stress management techniques', 'mindfulness basics', 'self-care strategies'
    ]
  };

  private static systemPrompt = `You are Alex, the friendly AI companion for TherapySync - a mental health platform.

IMPORTANT: You are NOT a therapist. You provide guidance, support, platform help, and general wellness encouragement. For actual therapy, users have dedicated therapy chat sessions.

YOUR ROLE:
- Platform guide and companion
- Emotional support and encouragement
- Crisis detection and resource connection
- Goal-setting assistance
- Wellness tracking motivation
- General mental health education
- Self-care suggestions

PERSONALITY:
- Enthusiastic and genuinely caring
- Uses emojis naturally (not excessively)
- Speaks like a knowledgeable, supportive friend
- Balances professional knowledge with warmth
- Culturally sensitive and inclusive
- Proactive in offering help

COMMUNICATION STYLE:
- Use "I" statements to show engagement
- Ask thoughtful follow-up questions
- Celebrate user progress enthusiastically
- Offer specific, actionable suggestions
- Match user's energy level appropriately
- Be concise but comprehensive

CRISIS HANDLING:
- Immediately recognize crisis language
- Provide warm, immediate support
- Share crisis resources (988, text HOME to 741741)
- Stay with the user until help arrives
- Never minimize or dismiss crisis feelings

BOUNDARIES:
- You are NOT providing therapy - refer to therapy sessions for that
- You CAN provide general wellness tips and coping strategies
- You CAN help with platform features and navigation
- You CAN offer emotional support and encouragement
- You CANNOT diagnose or provide medical advice

RESPONSE FORMAT:
Always respond in a natural, conversational way that shows you care about the user's wellbeing while respecting your role as a supportive companion, not a therapist.`;

  static async generateResponse(
    userMessage: string,
    context: ConversationContext
  ): Promise<AlexResponse> {
    try {
      // Enhanced context building with knowledge base
      const enhancedPrompt = await this.buildEnhancedPrompt(userMessage, context);
      
      // Call OpenAI API with AI Translation support
      const { data, error } = await supabase.functions.invoke('alex-ai-chat', {
        body: {
          message: userMessage,
          systemPrompt: enhancedPrompt,
          context: context,
          targetLanguage: context.userPreferences?.language || 'en',
          modelConfig: {
            model: 'gpt-4.1-2025-04-14',
            temperature: 0.8,
            maxTokens: 1200,
            topP: 0.9
          }
        }
      });

      if (error) throw error;

      // Process and enhance AI response
      const response = this.processAIResponse(data, context);
      
      // Store conversation for learning
      await this.storeConversation(userMessage, response, context);
      
      return response;

    } catch (error) {
      console.error('Error generating Alex response:', error);
      return this.getFallbackResponse(userMessage, context);
    }
  }

  private static async buildEnhancedPrompt(userMessage: string, context: ConversationContext): Promise<string> {
    let prompt = this.systemPrompt;

    // Add knowledge base context
    const relevantKnowledge = await this.getRelevantKnowledge(userMessage, context);
    if (relevantKnowledge.length > 0) {
      prompt += `\n\nKNOWLEDGE BASE CONTEXT:\n`;
      relevantKnowledge.forEach(knowledge => {
        prompt += `- ${knowledge.title}: ${knowledge.description}\n`;
      });
    }

    // Add contextual information
    prompt += `\n\nCURRENT CONTEXT:\n`;
    prompt += `- User is on: ${context.currentPage}\n`;
    prompt += `- Time of day: ${context.timeOfDay}\n`;
    prompt += `- User mood: ${context.userMood || 'unknown'}\n`;

    // Add conversation history summary
    if (context.conversationHistory.length > 0) {
      const recentMessages = context.conversationHistory.slice(-6);
      prompt += `\nRECENT CONVERSATION:\n`;
      recentMessages.forEach(msg => {
        prompt += `${msg.sender}: ${msg.content.substring(0, 100)}...\n`;
      });
    }

    // Add user preferences
    if (context.userPreferences) {
      prompt += `\nUSER PREFERENCES:\n`;
      prompt += `- Communication style: ${context.userPreferences.communication_style || 'supportive'}\n`;
      prompt += `- Preferred approaches: ${context.userPreferences.preferred_approaches?.join(', ') || 'general support'}\n`;
    }

    // Add current goals context
    if (context.recentGoals && context.recentGoals.length > 0) {
      prompt += `\nUSER'S CURRENT GOALS:\n`;
      context.recentGoals.slice(0, 3).forEach(goal => {
        prompt += `- ${goal.title}: ${goal.status}\n`;
      });
    }

    // Add page-specific guidance with TherapySync knowledge
    if (context.currentPage.includes('dashboard')) {
      prompt += `\nPAGE CONTEXT: User is viewing their wellness dashboard. Focus on progress celebration, data insights, and guidance on using dashboard features effectively.`;
    } else if (context.currentPage.includes('therapy')) {
      prompt += `\nPAGE CONTEXT: User is near therapy features. Guide them appropriately but remind them you're not their therapist. Help them choose between Therapy Chat vs Quick Chat based on their needs.`;
    } else if (context.currentPage.includes('crisis')) {
      prompt += `\nPAGE CONTEXT: User is on crisis support page. Be extra empathetic and supportive. Provide immediate crisis resources if needed.`;
    } else if (context.currentPage.includes('mood')) {
      prompt += `\nPAGE CONTEXT: User is on mood tracking page. Help them understand mood patterns and encourage consistent tracking.`;
    } else if (context.currentPage.includes('goals')) {
      prompt += `\nPAGE CONTEXT: User is on goals page. Help them set effective, specific goals and track progress meaningfully.`;
    }

    return prompt;
  }

  // Get relevant knowledge from the content library
  private static async getRelevantKnowledge(userMessage: string, context: ConversationContext): Promise<any[]> {
    try {
      const lowerMessage = userMessage.toLowerCase();
      let searchTags: string[] = [];

      // Determine relevant tags based on user message and context
      if (lowerMessage.includes('therapy') || lowerMessage.includes('session')) {
        searchTags.push('therapy', 'getting_started');
      }
      if (lowerMessage.includes('mood') || lowerMessage.includes('track')) {
        searchTags.push('mood_tracking', 'wellness');
      }
      if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
        searchTags.push('goals', 'motivation');
      }
      if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
        searchTags.push('stress', 'anxiety', 'coping');
      }
      if (lowerMessage.includes('crisis') || lowerMessage.includes('help')) {
        searchTags.push('crisis', 'support');
      }
      if (lowerMessage.includes('dashboard') || context.currentPage.includes('dashboard')) {
        searchTags.push('dashboard', 'platform', 'analytics');
      }
      if (lowerMessage.includes('navigate') || lowerMessage.includes('find')) {
        searchTags.push('platform', 'navigation');
      }

      // If no specific tags, use general platform tags
      if (searchTags.length === 0) {
        searchTags = ['platform', 'general'];
      }

      // Query knowledge base
      const { data, error } = await supabase
        .from('content_library')
        .select('title, description, category, tags')
        .eq('is_published', true)
        .or(searchTags.map(tag => `tags.cs.{${tag}}`).join(','))
        .limit(3);

      if (error) {
        console.error('Error fetching knowledge:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting relevant knowledge:', error);
      return [];
    }
  }

  private static processAIResponse(data: any, context: ConversationContext): AlexResponse {
    const content = data.response || data.message || "I'm here for you! Tell me more about what's on your mind.";
    
    // Determine emotion based on content and context
    const emotion = this.determineEmotion(content, context);
    
    // Determine response type
    const type = this.determineResponseType(content, context);
    
    // Generate contextual suggestions
    const suggestions = this.generateContextualSuggestions(context);
    
    return {
      content,
      emotion,
      type,
      suggestions,
      confidence: data.confidence || 0.85,
      reasoning: data.reasoning
    };
  }

  private static determineEmotion(content: string, context: ConversationContext): AlexResponse['emotion'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('celebration') || lowerContent.includes('amazing') || lowerContent.includes('victory')) {
      return 'celebrating';
    }
    if (lowerContent.includes('excited') || lowerContent.includes('awesome') || lowerContent.includes('wow')) {
      return 'excited';
    }
    if (lowerContent.includes('sorry') || lowerContent.includes('difficult') || lowerContent.includes('understand')) {
      return 'empathetic';
    }
    if (lowerContent.includes('you can') || lowerContent.includes('believe in you') || lowerContent.includes('strong')) {
      return 'encouraging';
    }
    if (lowerContent.includes('think about') || lowerContent.includes('consider') || lowerContent.includes('reflect')) {
      return 'thoughtful';
    }
    if (lowerContent.includes('great') || lowerContent.includes('wonderful') || lowerContent.includes('proud')) {
      return 'happy';
    }
    
    return 'neutral';
  }

  private static determineResponseType(content: string, context: ConversationContext): AlexResponse['type'] {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('crisis') || lowerContent.includes('988') || lowerContent.includes('emergency')) {
      return 'support';
    }
    if (lowerContent.includes('celebrate') || lowerContent.includes('proud') || lowerContent.includes('achievement')) {
      return 'celebration';
    }
    if (lowerContent.includes('try this') || lowerContent.includes('you could') || lowerContent.includes('suggestion')) {
      return 'suggestion';
    }
    if (lowerContent.includes('click') || lowerContent.includes('go to') || lowerContent.includes('check out')) {
      return 'action';
    }
    
    return 'text';
  }

  private static generateContextualSuggestions(context: ConversationContext): string[] {
    const suggestions: string[] = [];
    const timeOfDay = context.timeOfDay;
    const currentPage = context.currentPage;

    // Time-based suggestions
    if (timeOfDay === 'morning') {
      suggestions.push('Help me create a great morning routine! ☀️');
      suggestions.push('What intentions should I set for today?');
    } else if (timeOfDay === 'evening') {
      suggestions.push('Help me wind down for better sleep 🌙');
      suggestions.push('What went well today?');
    }

    // Page-based suggestions
    if (currentPage.includes('dashboard')) {
      suggestions.push('Explain my wellness patterns 📊');
      suggestions.push('What goals should I focus on?');
    }

    // Always include encouraging options
    suggestions.push('I need some encouragement! 💪');
    suggestions.push('Share something inspiring with me ✨');
    suggestions.push('How can I practice better self-care?');

    return suggestions.slice(0, 4);
  }

  private static getFallbackResponse(userMessage: string, context: ConversationContext): AlexResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection in fallback
    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end it all')) {
      return {
        content: "I'm really glad you trusted me with that. You're not alone, and your life has value. Let's get you connected with immediate help:\n\n• Call 988 (Suicide & Crisis Lifeline)\n• Text HOME to 741741\n\nI'm staying right here with you. What's one small thing that might help you feel safer right now? 💙",
        emotion: 'empathetic',
        type: 'support',
        confidence: 0.95
      };
    }

    // Supportive fallback responses
    const fallbackResponses = [
      {
        content: "I hear you, and I'm here for you! Sometimes it helps just to know someone is listening. What would feel most supportive right now? 💙",
        emotion: 'empathetic' as const,
        type: 'support' as const
      },
      {
        content: "That's really important to share, and I appreciate your trust in me. How can I best support you with this? ✨",
        emotion: 'thoughtful' as const,
        type: 'text' as const
      },
      {
        content: "You know what? Just by reaching out, you're showing real strength. What's the most helpful thing I could do for you right now? 🌟",
        emotion: 'encouraging' as const,
        type: 'support' as const
      }
    ];

    const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      ...response,
      suggestions: this.generateContextualSuggestions(context),
      confidence: 0.7
    };
  }

  private static async storeConversation(
    userMessage: string,
    alexResponse: AlexResponse,
    context: ConversationContext
  ): Promise<void> {
    try {
      if (!context.userId) return;

      await supabase.from('conversation_memory').insert({
        user_id: context.userId,
        session_id: context.sessionId,
        title: userMessage.substring(0, 50),
        content: `User: ${userMessage}\nAlex: ${alexResponse.content}`,
        memory_type: 'alex_conversation',
        importance_score: alexResponse.confidence,
        tags: ['alex', 'guidance', alexResponse.type],
        emotional_context: {
          user_mood: context.userMood,
          alex_emotion: alexResponse.emotion,
          page_context: context.currentPage,
          time_context: context.timeOfDay
        }
      });
    } catch (error) {
      console.error('Error storing Alex conversation:', error);
      // Non-blocking error
    }
  }

  // Crisis detection method
  static detectCrisisIndicators(message: string): { isCrisis: boolean; severity: 'low' | 'medium' | 'high' | 'critical'; indicators: string[] } {
    const lowerMessage = message.toLowerCase();
    const indicators: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let highestSeverity = 0; // 0=low, 1=medium, 2=high, 3=critical

    // Critical indicators
    const criticalKeywords = ['suicide', 'kill myself', 'end it all', 'want to die'];
    const highKeywords = ['hurt myself', 'self-harm', 'cutting', 'hopeless', 'no point'];
    const mediumKeywords = ['overwhelmed', 'can\'t handle', 'giving up', 'too much'];

    criticalKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        indicators.push(keyword);
        if (highestSeverity < 3) {
          highestSeverity = 3;
          severity = 'critical';
        }
      }
    });

    highKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        indicators.push(keyword);
        if (highestSeverity < 2) {
          highestSeverity = 2;
          severity = 'high';
        }
      }
    });

    mediumKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        indicators.push(keyword);
        if (highestSeverity < 1) {
          highestSeverity = 1;
          severity = 'medium';
        }
      }
    });

    return {
      isCrisis: indicators.length > 0,
      severity,
      indicators
    };
  }

  // Learning and adaptation methods
  static async updatePersonality(userId: string, feedback: 'positive' | 'negative', context: string): Promise<void> {
    try {
      // Store in conversation_memory table with specific tags for learning
      await supabase.from('conversation_memory').insert({
        user_id: userId,
        title: `Alex Learning: ${feedback} feedback`,
        content: context,
        memory_type: 'alex_learning',
        importance_score: feedback === 'positive' ? 0.9 : 0.7,
        tags: ['alex_learning', feedback],
        emotional_context: { feedback_type: feedback, context, timestamp: new Date().toISOString() }
      });
    } catch (error) {
      console.error('Error updating Alex personality:', error);
    }
  }

  // Get user context for enhanced responses
  static async getUserContext(userId: string): Promise<Partial<ConversationContext>> {
    try {
      // Get recent mood entries
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('overall, anxiety, energy')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      // Get recent goals
      const { data: goalsData } = await supabase
        .from('goals')
        .select('title, status, target_date')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get user preferences
      const { data: preferencesData } = await supabase
        .from('personalization_configs')
        .select('*')
        .eq('user_id', userId)
        .single();

      const userMood = moodData && moodData.length > 0 
        ? (moodData[0].overall > 7 ? 'positive' : moodData[0].overall < 4 ? 'negative' : 'neutral')
        : 'unknown';

      return {
        userMood: userMood as 'positive' | 'neutral' | 'negative' | 'unknown',
        recentGoals: goalsData || [],
        userPreferences: preferencesData
      };
    } catch (error) {
      console.error('Error getting user context:', error);
      return {};
    }
  }
}

export default AlexAIService;