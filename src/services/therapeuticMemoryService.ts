import { supabase } from '@/integrations/supabase/client';

export interface ConversationMemory {
  id: string;
  user_id: string;
  session_id?: string;
  memory_type: 'personal_detail' | 'emotional_pattern' | 'goal_progress' | 'trigger' | 'coping_strategy' | 'relationship' | 'breakthrough' | 'concern';
  title: string;
  content: string;
  emotional_context: {
    primary_emotion: string;
    intensity: number;
    context: string;
  };
  importance_score: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemoryInsight {
  type: 'pattern' | 'progress' | 'concern' | 'opportunity';
  title: string;
  description: string;
  supporting_memories: string[];
  confidence_score: number;
  actionable_suggestions: string[];
}

export class TherapeuticMemoryService {
  /**
   * Store a new memory from conversation
   */
  static async storeMemory(
    userId: string,
    sessionId: string,
    memoryData: {
      type: ConversationMemory['memory_type'];
      title: string;
      content: string;
      emotion: string;
      intensity: number;
      context: string;
      tags?: string[];
    }
  ): Promise<ConversationMemory> {
    try {
      // Calculate importance score
      const importanceScore = this.calculateImportanceScore(memoryData);
      
      const { data, error } = await supabase
        .from('conversation_memory')
        .insert({
          user_id: userId,
          session_id: sessionId,
          memory_type: memoryData.type,
          title: memoryData.title,
          content: memoryData.content,
          emotional_context: {
            primary_emotion: memoryData.emotion,
            intensity: memoryData.intensity,
            context: memoryData.context
          },
          importance_score: importanceScore,
          tags: memoryData.tags || [],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data as ConversationMemory;
    } catch (error) {
      console.error('Error storing memory:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant memories for session context
   */
  static async getSessionContext(userId: string, sessionType?: string): Promise<ConversationMemory[]> {
    try {
      let query = supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('importance_score', { ascending: false })
        .order('updated_at', { ascending: false });

      // Apply session-specific filters
      if (sessionType === 'crisis') {
        query = query.in('memory_type', ['trigger', 'coping_strategy', 'concern']);
      } else if (sessionType === 'progress') {
        query = query.in('memory_type', ['goal_progress', 'breakthrough', 'emotional_pattern']);
      }

      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('importance_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as ConversationMemory[];
    } catch (error) {
      console.error('Error retrieving session context:', error);
      return [];
    }
  }

  /**
   * Update memory importance based on new interactions
   */
  static async updateMemoryRelevance(memoryId: string, relevanceBoost: number) {
    try {
      const { data: memory } = await supabase
        .from('conversation_memory')
        .select('importance_score')
        .eq('id', memoryId)
        .single();

      if (memory) {
        const newScore = Math.min(1.0, memory.importance_score + relevanceBoost);
        
        await supabase
          .from('conversation_memory')
          .update({
            importance_score: newScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', memoryId);
      }
    } catch (error) {
      console.error('Error updating memory relevance:', error);
    }
  }

  /**
   * Generate insights from memory patterns
   */
  static async generateMemoryInsights(userId: string): Promise<MemoryInsight[]> {
    try {
      const memories = await this.getAllUserMemories(userId);
      const insights: MemoryInsight[] = [];

      // Pattern recognition
      insights.push(...this.detectEmotionalPatterns(memories));
      insights.push(...this.detectProgressPatterns(memories));
      insights.push(...this.detectConcerns(memories));
      insights.push(...this.detectOpportunities(memories));

      return insights.sort((a, b) => b.confidence_score - a.confidence_score);
    } catch (error) {
      console.error('Error generating memory insights:', error);
      return [];
    }
  }

  private static async getAllUserMemories(userId: string): Promise<ConversationMemory[]> {
    const { data, error } = await supabase
      .from('conversation_memory')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ConversationMemory[];
  }

  private static calculateImportanceScore(memoryData: any): number {
    let score = 0.5; // Base score

    // Memory type importance
    const typeWeights: Record<string, number> = {
      'breakthrough': 0.4,
      'trigger': 0.3,
      'goal_progress': 0.3,
      'concern': 0.25,
      'emotional_pattern': 0.2,
      'coping_strategy': 0.2,
      'relationship': 0.15,
      'personal_detail': 0.1
    };

    score += typeWeights[memoryData.type] || 0.1;

    // Emotional intensity impact
    score += (memoryData.intensity / 10) * 0.2;

    // Content significance (simple keyword analysis)
    const significantKeywords = ['breakthrough', 'trauma', 'crisis', 'success', 'fear', 'anxiety', 'depression', 'goal', 'family'];
    const keywordCount = significantKeywords.filter(keyword => 
      memoryData.content.toLowerCase().includes(keyword) || 
      memoryData.title.toLowerCase().includes(keyword)
    ).length;
    
    score += (keywordCount / significantKeywords.length) * 0.2;

    return Math.min(1.0, Math.max(0.1, score));
  }

  private static detectEmotionalPatterns(memories: ConversationMemory[]): MemoryInsight[] {
    const patterns: MemoryInsight[] = [];
    
    // Group by primary emotion
    const emotionGroups = memories.reduce((groups, memory) => {
      const emotion = memory.emotional_context.primary_emotion;
      if (!groups[emotion]) groups[emotion] = [];
      groups[emotion].push(memory);
      return groups;
    }, {} as Record<string, ConversationMemory[]>);

    // Detect recurring emotional patterns
    Object.entries(emotionGroups).forEach(([emotion, emotionMemories]) => {
      if (emotionMemories.length >= 3) {
        const avgIntensity = emotionMemories.reduce((sum, m) => sum + m.emotional_context.intensity, 0) / emotionMemories.length;
        
        if (avgIntensity > 7) {
          patterns.push({
            type: 'pattern',
            title: `Recurring High ${emotion} Pattern`,
            description: `Detected ${emotionMemories.length} instances of intense ${emotion} (avg intensity: ${avgIntensity.toFixed(1)}/10)`,
            supporting_memories: emotionMemories.map(m => m.id),
            confidence_score: Math.min(0.95, 0.6 + (emotionMemories.length * 0.1)),
            actionable_suggestions: [
              `Develop specific coping strategies for managing ${emotion}`,
              `Explore triggers that lead to intense ${emotion}`,
              `Practice grounding techniques when ${emotion} arises`
            ]
          });
        }
      }
    });

    return patterns;
  }

  private static detectProgressPatterns(memories: ConversationMemory[]): MemoryInsight[] {
    const progressMemories = memories.filter(m => m.memory_type === 'goal_progress' || m.memory_type === 'breakthrough');
    const patterns: MemoryInsight[] = [];

    if (progressMemories.length >= 2) {
      // Analyze temporal progress
      const recentProgress = progressMemories.slice(0, 3);
      const hasPositiveProgress = recentProgress.some(m => 
        m.content.toLowerCase().includes('better') || 
        m.content.toLowerCase().includes('improved') ||
        m.content.toLowerCase().includes('success')
      );

      if (hasPositiveProgress) {
        patterns.push({
          type: 'progress',
          title: 'Positive Progress Momentum',
          description: `Recent sessions show consistent progress with ${recentProgress.length} positive developments`,
          supporting_memories: recentProgress.map(m => m.id),
          confidence_score: 0.8,
          actionable_suggestions: [
            'Continue current therapeutic approaches',
            'Consider advancing to next therapy phase',
            'Document successful strategies for future reference'
          ]
        });
      }
    }

    return patterns;
  }

  private static detectConcerns(memories: ConversationMemory[]): MemoryInsight[] {
    const concernMemories = memories.filter(m => 
      m.memory_type === 'concern' || 
      m.memory_type === 'trigger' ||
      m.emotional_context.intensity > 8
    );
    
    const patterns: MemoryInsight[] = [];

    if (concernMemories.length >= 2) {
      const recentConcerns = concernMemories.slice(0, 2);
      patterns.push({
        type: 'concern',
        title: 'Elevated Risk Factors',
        description: `Multiple high-intensity concerns identified requiring attention`,
        supporting_memories: recentConcerns.map(m => m.id),
        confidence_score: 0.85,
        actionable_suggestions: [
          'Consider crisis intervention strategies',
          'Increase session frequency if needed',
          'Review safety plan and coping resources',
          'Consider professional oversight evaluation'
        ]
      });
    }

    return patterns;
  }

  private static detectOpportunities(memories: ConversationMemory[]): MemoryInsight[] {
    const strengthMemories = memories.filter(m => 
      m.memory_type === 'coping_strategy' || 
      m.content.toLowerCase().includes('strength') ||
      m.content.toLowerCase().includes('success')
    );
    
    const patterns: MemoryInsight[] = [];

    if (strengthMemories.length >= 3) {
      patterns.push({
        type: 'opportunity',
        title: 'Untapped Strengths & Resources',
        description: `Identified ${strengthMemories.length} strengths and successful coping strategies to leverage`,
        supporting_memories: strengthMemories.map(m => m.id),
        confidence_score: 0.75,
        actionable_suggestions: [
          'Build therapy plan around identified strengths',
          'Expand successful coping strategies to new situations',
          'Use strengths to address current challenges',
          'Consider peer mentoring or support roles'
        ]
      });
    }

    return patterns;
  }

  /**
   * Get relevant memories for specific topics or emotions
   */
  static async searchMemories(
    userId: string, 
    query: string, 
    memoryTypes?: ConversationMemory['memory_type'][]
  ): Promise<ConversationMemory[]> {
    try {
      let supabaseQuery = supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (memoryTypes) {
        supabaseQuery = supabaseQuery.in('memory_type', memoryTypes);
      }

      // Simple text search (in production, use full-text search)
      supabaseQuery = supabaseQuery.or(`content.ilike.%${query}%,title.ilike.%${query}%`);

      const { data, error } = await supabaseQuery
        .order('importance_score', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as ConversationMemory[];
    } catch (error) {
      console.error('Error searching memories:', error);
      return [];
    }
  }

  /**
   * Update memory based on new relevance or context
   */
  static async updateMemoryContext(
    memoryId: string, 
    updates: {
      content?: string;
      emotional_context?: any;
      tags?: string[];
      importance_score?: number;
    }
  ) {
    try {
      const { error } = await supabase
        .from('conversation_memory')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating memory context:', error);
      throw error;
    }
  }

  /**
   * Generate contextual memory summary for therapist AI
   */
  static async generateContextSummary(userId: string, sessionType?: string): Promise<string> {
    try {
      const memories = await this.getSessionContext(userId, sessionType);
      const insights = await this.generateMemoryInsights(userId);

      const keyMemories = memories.slice(0, 5);
      const keyInsights = insights.slice(0, 3);

      let summary = "## Session Context\n\n";

      if (keyMemories.length > 0) {
        summary += "### Key Memories:\n";
        keyMemories.forEach(memory => {
          summary += `- **${memory.title}**: ${memory.content.substring(0, 100)}...\n`;
          summary += `  *Emotion: ${memory.emotional_context.primary_emotion} (${memory.emotional_context.intensity}/10)*\n\n`;
        });
      }

      if (keyInsights.length > 0) {
        summary += "### Recent Insights:\n";
        keyInsights.forEach(insight => {
          summary += `- **${insight.title}**: ${insight.description}\n`;
          summary += `  *Confidence: ${(insight.confidence_score * 100).toFixed(0)}%*\n\n`;
        });
      }

      return summary;
    } catch (error) {
      console.error('Error generating context summary:', error);
      return "Context unavailable";
    }
  }
}