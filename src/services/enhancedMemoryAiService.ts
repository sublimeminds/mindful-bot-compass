
import { MemoryService, ConversationMemory, EmotionalPattern, SessionContext } from './memoryService';
import { DebugLogger } from '@/utils/debugLogger';

export interface MemoryEnhancedContext {
  recentMemories: ConversationMemory[];
  emotionalPatterns: EmotionalPattern[];
  sessionContext: SessionContext[];
  relationshipData: any;
  conversationHistory: any[];
}

export class EnhancedMemoryAiService {
  static async prepareSessionContext(userId: string): Promise<MemoryEnhancedContext> {
    try {
      DebugLogger.debug('EnhancedMemoryAiService: Preparing session context', { 
        component: 'EnhancedMemoryAiService', 
        method: 'prepareSessionContext',
        userId 
      });

      // Fetch recent important memories
      const recentMemories = await MemoryService.getRecentMemories(userId, 15);
      
      // Get emotional patterns
      const emotionalPatterns = await MemoryService.getEmotionalPatterns(userId);
      
      // Get pending session context
      const sessionContext = await MemoryService.getPendingSessionContext(userId);
      
      // Get therapeutic relationship data
      const relationshipData = await MemoryService.getTherapeuticRelationship(userId);

      const context: MemoryEnhancedContext = {
        recentMemories,
        emotionalPatterns,
        sessionContext,
        relationshipData,
        conversationHistory: []
      };

      DebugLogger.info('EnhancedMemoryAiService: Session context prepared', { 
        component: 'EnhancedMemoryAiService', 
        method: 'prepareSessionContext',
        memoriesCount: recentMemories.length,
        patternsCount: emotionalPatterns.length,
        contextCount: sessionContext.length
      });

      return context;
    } catch (error) {
      DebugLogger.error('EnhancedMemoryAiService: Error preparing session context', error as Error, { 
        component: 'EnhancedMemoryAiService', 
        method: 'prepareSessionContext'
      });
      return {
        recentMemories: [],
        emotionalPatterns: [],
        sessionContext: [],
        relationshipData: null,
        conversationHistory: []
      };
    }
  }

  static buildEnhancedSystemPrompt(
    basePrompt: string, 
    context: MemoryEnhancedContext,
    therapistPersonality?: any
  ): string {
    let enhancedPrompt = basePrompt;

    // Add memory context
    if (context.recentMemories.length > 0) {
      enhancedPrompt += '\n\n## Previous Session Insights and Memory:\n';
      context.recentMemories.forEach(memory => {
        enhancedPrompt += `- ${memory.memoryType.toUpperCase()}: ${memory.title} - ${memory.content}\n`;
        if (memory.tags.length > 0) {
          enhancedPrompt += `  Tags: ${memory.tags.join(', ')}\n`;
        }
      });
    }

    // Add emotional patterns
    if (context.emotionalPatterns.length > 0) {
      enhancedPrompt += '\n\n## Known Emotional Patterns:\n';
      context.emotionalPatterns.forEach(pattern => {
        enhancedPrompt += `- ${pattern.patternType}: `;
        if (pattern.patternData.description) {
          enhancedPrompt += pattern.patternData.description;
        }
        enhancedPrompt += ` (Frequency: ${pattern.frequencyScore.toFixed(2)}, Effectiveness: ${pattern.effectivenessScore.toFixed(2)})\n`;
      });
    }

    // Add session context items
    if (context.sessionContext.length > 0) {
      enhancedPrompt += '\n\n## Important Items to Address This Session:\n';
      context.sessionContext.forEach(ctx => {
        enhancedPrompt += `- ${ctx.contextType.toUpperCase()} (Priority ${ctx.priorityLevel}/10): `;
        if (ctx.contextData.description) {
          enhancedPrompt += ctx.contextData.description;
        }
        enhancedPrompt += '\n';
      });
    }

    // Add relationship data
    if (context.relationshipData) {
      enhancedPrompt += '\n\n## Therapeutic Relationship Context:\n';
      enhancedPrompt += `- Trust Level: ${(context.relationshipData.trustLevel * 100).toFixed(0)}%\n`;
      enhancedPrompt += `- Rapport Score: ${(context.relationshipData.rapportScore * 100).toFixed(0)}%\n`;
      
      if (context.relationshipData.effectiveTechniques.length > 0) {
        enhancedPrompt += `- Effective Techniques: ${context.relationshipData.effectiveTechniques.join(', ')}\n`;
      }
      
      if (context.relationshipData.ineffectiveTechniques.length > 0) {
        enhancedPrompt += `- Avoid These Techniques: ${context.relationshipData.ineffectiveTechniques.join(', ')}\n`;
      }
    }

    // Add memory-based instructions
    enhancedPrompt += '\n\n## Memory-Enhanced Instructions:\n';
    enhancedPrompt += '- Reference previous conversations naturally when relevant\n';
    enhancedPrompt += '- Ask specific follow-up questions about previously mentioned concerns\n';
    enhancedPrompt += '- Check on progress of goals and techniques discussed before\n';
    enhancedPrompt += '- Be aware of emotional patterns and triggers\n';
    enhancedPrompt += '- Build on previous breakthroughs and insights\n';
    enhancedPrompt += '- Remember the user\'s preferred communication style and boundaries\n';

    return enhancedPrompt;
  }

  static async analyzeAndStoreConversation(
    userId: string,
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    emotion?: string
  ): Promise<void> {
    try {
      DebugLogger.debug('EnhancedMemoryAiService: Analyzing conversation for memory storage', { 
        component: 'EnhancedMemoryAiService', 
        method: 'analyzeAndStoreConversation',
        userId,
        sessionId
      });

      // Analyze for insights
      const insights = this.extractInsights(userMessage, aiResponse);
      
      // Store memories based on analysis
      for (const insight of insights) {
        await MemoryService.createMemory({
          userId,
          sessionId,
          memoryType: insight.type,
          title: insight.title,
          content: insight.content,
          emotionalContext: { emotion, userMessage: userMessage.substring(0, 100) },
          importanceScore: insight.importance,
          tags: insight.tags,
          isActive: true
        });
      }

      // Update emotional patterns
      if (emotion) {
        await this.updateEmotionalPatterns(userId, emotion, userMessage);
      }

      // Create follow-up context for next session
      await this.createFollowUpContext(userId, userMessage, aiResponse);

    } catch (error) {
      DebugLogger.error('EnhancedMemoryAiService: Error analyzing conversation', error as Error, { 
        component: 'EnhancedMemoryAiService', 
        method: 'analyzeAndStoreConversation'
      });
    }
  }

  private static extractInsights(userMessage: string, aiResponse: string): Array<{
    type: any;
    title: string;
    content: string;
    importance: number;
    tags: string[];
  }> {
    const insights = [];
    const lowerUser = userMessage.toLowerCase();
    const lowerAi = aiResponse.toLowerCase();

    // Detect breakthroughs
    if (lowerUser.includes('realize') || lowerUser.includes('understand now') || lowerUser.includes('makes sense')) {
      insights.push({
        type: 'breakthrough',
        title: 'User Breakthrough Moment',
        content: userMessage.substring(0, 200),
        importance: 0.9,
        tags: ['breakthrough', 'insight']
      });
    }

    // Detect concerns
    if (lowerUser.includes('worried') || lowerUser.includes('anxious') || lowerUser.includes('scared')) {
      insights.push({
        type: 'concern',
        title: 'User Expressed Concern',
        content: userMessage.substring(0, 200),
        importance: 0.8,
        tags: ['concern', 'anxiety']
      });
    }

    // Detect goals
    if (lowerUser.includes('want to') || lowerUser.includes('goal') || lowerUser.includes('hope to')) {
      insights.push({
        type: 'goal',
        title: 'User Goal Mentioned',
        content: userMessage.substring(0, 200),
        importance: 0.7,
        tags: ['goal', 'intention']
      });
    }

    // Detect techniques mentioned
    if (lowerAi.includes('technique') || lowerAi.includes('exercise') || lowerAi.includes('practice')) {
      insights.push({
        type: 'technique',
        title: 'Therapeutic Technique Suggested',
        content: aiResponse.substring(0, 200),
        importance: 0.6,
        tags: ['technique', 'practice']
      });
    }

    // Detect triggers
    if (lowerUser.includes('triggered') || lowerUser.includes('upset') || lowerUser.includes('bothers me')) {
      insights.push({
        type: 'trigger',
        title: 'Potential Trigger Identified',
        content: userMessage.substring(0, 200),
        importance: 0.8,
        tags: ['trigger', 'emotional']
      });
    }

    return insights;
  }

  private static async updateEmotionalPatterns(userId: string, emotion: string, message: string): Promise<void> {
    try {
      const existingPatterns = await MemoryService.getEmotionalPatterns(userId);
      const emotionPattern = existingPatterns.find(p => p.patternData.emotion === emotion);

      if (emotionPattern) {
        // Update frequency score
        const newFrequency = emotionPattern.frequencyScore + 1;
        await MemoryService.createEmotionalPattern({
          userId,
          patternType: 'emotional_regulation',
          patternData: {
            emotion,
            context: message.substring(0, 100),
            frequency: newFrequency
          },
          frequencyScore: newFrequency,
          effectivenessScore: emotionPattern.effectivenessScore,
          lastOccurred: new Date()
        });
      } else {
        // Create new pattern
        await MemoryService.createEmotionalPattern({
          userId,
          patternType: 'emotional_regulation',
          patternData: {
            emotion,
            context: message.substring(0, 100)
          },
          frequencyScore: 1,
          effectivenessScore: 0.5,
          lastOccurred: new Date()
        });
      }
    } catch (error) {
      DebugLogger.error('EnhancedMemoryAiService: Error updating emotional patterns', error as Error, { 
        component: 'EnhancedMemoryAiService', 
        method: 'updateEmotionalPatterns'
      });
    }
  }

  private static async createFollowUpContext(userId: string, userMessage: string, aiResponse: string): Promise<void> {
    try {
      const lowerUser = userMessage.toLowerCase();
      const lowerAi = aiResponse.toLowerCase();

      // Create follow-up for techniques
      if (lowerAi.includes('try') || lowerAi.includes('practice') || lowerAi.includes('homework')) {
        await MemoryService.createSessionContext({
          userId,
          contextType: 'follow_up',
          priorityLevel: 7,
          contextData: {
            type: 'technique_check',
            description: `Follow up on suggested technique: ${aiResponse.substring(0, 100)}`,
            originalMessage: userMessage.substring(0, 100)
          },
          requiresAttention: true,
          addressed: false
        });
      }

      // Create concern check for emotional expressions
      if (lowerUser.includes('difficult') || lowerUser.includes('struggle') || lowerUser.includes('hard')) {
        await MemoryService.createSessionContext({
          userId,
          contextType: 'concern_check',
          priorityLevel: 8,
          contextData: {
            type: 'emotional_check',
            description: `Check on user's struggle with: ${userMessage.substring(0, 100)}`,
            emotion: 'concern'
          },
          requiresAttention: true,
          addressed: false
        });
      }
    } catch (error) {
      DebugLogger.error('EnhancedMemoryAiService: Error creating follow-up context', error as Error, { 
        component: 'EnhancedMemoryAiService', 
        method: 'createFollowUpContext'
      });
    }
  }

  static async generatePersonalizedQuestions(userId: string): Promise<string[]> {
    try {
      const recentMemories = await MemoryService.getRecentMemories(userId, 5);
      const pendingContext = await MemoryService.getPendingSessionContext(userId);
      const questions = [];

      // Questions based on memories
      for (const memory of recentMemories) {
        if (memory.memoryType === 'goal') {
          questions.push(`How has your progress been with ${memory.title.toLowerCase()}?`);
        } else if (memory.memoryType === 'concern') {
          questions.push(`I remember you mentioned concerns about ${memory.title.toLowerCase()}. How are you feeling about that now?`);
        } else if (memory.memoryType === 'technique') {
          questions.push(`Have you had a chance to try the ${memory.title.toLowerCase()} we discussed?`);
        }
      }

      // Questions based on pending context
      for (const context of pendingContext) {
        if (context.contextType === 'follow_up' && context.contextData.type === 'technique_check') {
          questions.push(`How did the practice we discussed last time work out for you?`);
        } else if (context.contextType === 'concern_check') {
          questions.push(`I wanted to check in on how you've been managing since our last conversation.`);
        }
      }

      return questions.slice(0, 3); // Return top 3 most relevant questions
    } catch (error) {
      DebugLogger.error('EnhancedMemoryAiService: Error generating personalized questions', error as Error, { 
        component: 'EnhancedMemoryAiService', 
        method: 'generatePersonalizedQuestions'
      });
      return [];
    }
  }
}
