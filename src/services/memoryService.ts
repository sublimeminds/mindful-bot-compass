
import { supabase } from '@/integrations/supabase/client';
import { DebugLogger } from '@/utils/debugLogger';

export interface ConversationMemory {
  id: string;
  userId: string;
  sessionId?: string;
  memoryType: 'insight' | 'breakthrough' | 'concern' | 'goal' | 'pattern' | 'trigger' | 'technique' | 'relationship' | 'crisis';
  title: string;
  content: string;
  emotionalContext: any;
  importanceScore: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmotionalPattern {
  id: string;
  userId: string;
  patternType: 'trigger' | 'coping_strategy' | 'mood_cycle' | 'stress_response' | 'emotional_regulation';
  patternData: any;
  frequencyScore: number;
  effectivenessScore: number;
  lastOccurred?: Date;
  firstIdentified: Date;
}

export interface SessionContext {
  id: string;
  userId: string;
  sessionId?: string;
  contextType: 'agenda' | 'follow_up' | 'concern_check' | 'technique_review' | 'crisis_assessment';
  priorityLevel: number;
  contextData: any;
  requiresAttention: boolean;
  addressed: boolean;
}

export interface TherapeuticRelationship {
  id: string;
  userId: string;
  therapistId?: string;
  trustLevel: number;
  rapportScore: number;
  communicationPreferences: any;
  effectiveTechniques: string[];
  ineffectiveTechniques: string[];
  boundaryPreferences: any;
  lastInteraction?: Date;
  relationshipMilestones: any[];
}

export class MemoryService {
  static async createMemory(memory: Omit<ConversationMemory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConversationMemory | null> {
    try {
      DebugLogger.debug('MemoryService: Creating memory', { 
        component: 'MemoryService', 
        method: 'createMemory',
        memoryType: memory.memoryType,
        title: memory.title
      });

      const { data, error } = await supabase
        .from('conversation_memory')
        .insert({
          user_id: memory.userId,
          session_id: memory.sessionId,
          memory_type: memory.memoryType,
          title: memory.title,
          content: memory.content,
          emotional_context: memory.emotionalContext,
          importance_score: memory.importanceScore,
          tags: memory.tags,
          is_active: memory.isActive
        })
        .select()
        .single();

      if (error) {
        DebugLogger.error('MemoryService: Error creating memory', error, { 
          component: 'MemoryService', 
          method: 'createMemory'
        });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        sessionId: data.session_id,
        memoryType: data.memory_type,
        title: data.title,
        content: data.content,
        emotionalContext: data.emotional_context,
        importanceScore: data.importance_score,
        tags: data.tags,
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      DebugLogger.error('MemoryService: Exception creating memory', error as Error, { 
        component: 'MemoryService', 
        method: 'createMemory'
      });
      return null;
    }
  }

  static async getRecentMemories(userId: string, limit: number = 10): Promise<ConversationMemory[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('importance_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        DebugLogger.error('MemoryService: Error fetching recent memories', error, { 
          component: 'MemoryService', 
          method: 'getRecentMemories'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        sessionId: item.session_id,
        memoryType: item.memory_type,
        title: item.title,
        content: item.content,
        emotionalContext: item.emotional_context,
        importanceScore: item.importance_score,
        tags: item.tags,
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('MemoryService: Exception fetching recent memories', error as Error, { 
        component: 'MemoryService', 
        method: 'getRecentMemories'
      });
      return [];
    }
  }

  static async getMemoriesByType(userId: string, memoryType: string): Promise<ConversationMemory[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', userId)
        .eq('memory_type', memoryType)
        .eq('is_active', true)
        .order('importance_score', { ascending: false });

      if (error) {
        DebugLogger.error('MemoryService: Error fetching memories by type', error, { 
          component: 'MemoryService', 
          method: 'getMemoriesByType',
          memoryType
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        sessionId: item.session_id,
        memoryType: item.memory_type,
        title: item.title,
        content: item.content,
        emotionalContext: item.emotional_context,
        importanceScore: item.importance_score,
        tags: item.tags,
        isActive: item.is_active,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
      }));
    } catch (error) {
      DebugLogger.error('MemoryService: Exception fetching memories by type', error as Error, { 
        component: 'MemoryService', 
        method: 'getMemoriesByType'
      });
      return [];
    }
  }

  static async updateMemoryImportance(memoryId: string, importanceScore: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversation_memory')
        .update({ importance_score: importanceScore })
        .eq('id', memoryId);

      if (error) {
        DebugLogger.error('MemoryService: Error updating memory importance', error, { 
          component: 'MemoryService', 
          method: 'updateMemoryImportance'
        });
        return false;
      }

      return true;
    } catch (error) {
      DebugLogger.error('MemoryService: Exception updating memory importance', error as Error, { 
        component: 'MemoryService', 
        method: 'updateMemoryImportance'
      });
      return false;
    }
  }

  static async createEmotionalPattern(pattern: Omit<EmotionalPattern, 'id' | 'firstIdentified'>): Promise<EmotionalPattern | null> {
    try {
      const { data, error } = await supabase
        .from('emotional_patterns')
        .insert({
          user_id: pattern.userId,
          pattern_type: pattern.patternType,
          pattern_data: pattern.patternData,
          frequency_score: pattern.frequencyScore,
          effectiveness_score: pattern.effectivenessScore,
          last_occurred: pattern.lastOccurred
        })
        .select()
        .single();

      if (error) {
        DebugLogger.error('MemoryService: Error creating emotional pattern', error, { 
          component: 'MemoryService', 
          method: 'createEmotionalPattern'
        });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        patternType: data.pattern_type,
        patternData: data.pattern_data,
        frequencyScore: data.frequency_score,
        effectivenessScore: data.effectiveness_score,
        lastOccurred: data.last_occurred ? new Date(data.last_occurred) : undefined,
        firstIdentified: new Date(data.first_identified)
      };
    } catch (error) {
      DebugLogger.error('MemoryService: Exception creating emotional pattern', error as Error, { 
        component: 'MemoryService', 
        method: 'createEmotionalPattern'
      });
      return null;
    }
  }

  static async getEmotionalPatterns(userId: string): Promise<EmotionalPattern[]> {
    try {
      const { data, error } = await supabase
        .from('emotional_patterns')
        .select('*')
        .eq('user_id', userId)
        .order('frequency_score', { ascending: false });

      if (error) {
        DebugLogger.error('MemoryService: Error fetching emotional patterns', error, { 
          component: 'MemoryService', 
          method: 'getEmotionalPatterns'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        patternType: item.pattern_type,
        patternData: item.pattern_data,
        frequencyScore: item.frequency_score,
        effectivenessScore: item.effectiveness_score,
        lastOccurred: item.last_occurred ? new Date(item.last_occurred) : undefined,
        firstIdentified: new Date(item.first_identified)
      }));
    } catch (error) {
      DebugLogger.error('MemoryService: Exception fetching emotional patterns', error as Error, { 
        component: 'MemoryService', 
        method: 'getEmotionalPatterns'
      });
      return [];
    }
  }

  static async createSessionContext(context: Omit<SessionContext, 'id'>): Promise<SessionContext | null> {
    try {
      const { data, error } = await supabase
        .from('session_context')
        .insert({
          user_id: context.userId,
          session_id: context.sessionId,
          context_type: context.contextType,
          priority_level: context.priorityLevel,
          context_data: context.contextData,
          requires_attention: context.requiresAttention,
          addressed: context.addressed
        })
        .select()
        .single();

      if (error) {
        DebugLogger.error('MemoryService: Error creating session context', error, { 
          component: 'MemoryService', 
          method: 'createSessionContext'
        });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        sessionId: data.session_id,
        contextType: data.context_type,
        priorityLevel: data.priority_level,
        contextData: data.context_data,
        requiresAttention: data.requires_attention,
        addressed: data.addressed
      };
    } catch (error) {
      DebugLogger.error('MemoryService: Exception creating session context', error as Error, { 
        component: 'MemoryService', 
        method: 'createSessionContext'
      });
      return null;
    }
  }

  static async getPendingSessionContext(userId: string): Promise<SessionContext[]> {
    try {
      const { data, error } = await supabase
        .from('session_context')
        .select('*')
        .eq('user_id', userId)
        .eq('addressed', false)
        .order('priority_level', { ascending: false });

      if (error) {
        DebugLogger.error('MemoryService: Error fetching pending session context', error, { 
          component: 'MemoryService', 
          method: 'getPendingSessionContext'
        });
        return [];
      }

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        sessionId: item.session_id,
        contextType: item.context_type,
        priorityLevel: item.priority_level,
        contextData: item.context_data,
        requiresAttention: item.requires_attention,
        addressed: item.addressed
      }));
    } catch (error) {
      DebugLogger.error('MemoryService: Exception fetching pending session context', error as Error, { 
        component: 'MemoryService', 
        method: 'getPendingSessionContext'
      });
      return [];
    }
  }

  static async markContextAddressed(contextId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_context')
        .update({ addressed: true })
        .eq('id', contextId);

      if (error) {
        DebugLogger.error('MemoryService: Error marking context addressed', error, { 
          component: 'MemoryService', 
          method: 'markContextAddressed'
        });
        return false;
      }

      return true;
    } catch (error) {
      DebugLogger.error('MemoryService: Exception marking context addressed', error as Error, { 
        component: 'MemoryService', 
        method: 'markContextAddressed'
      });
      return false;
    }
  }

  static async getTherapeuticRelationship(userId: string, therapistId?: string): Promise<TherapeuticRelationship | null> {
    try {
      let query = supabase
        .from('therapeutic_relationship')
        .select('*')
        .eq('user_id', userId);

      if (therapistId) {
        query = query.eq('therapist_id', therapistId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found, return null
          return null;
        }
        DebugLogger.error('MemoryService: Error fetching therapeutic relationship', error, { 
          component: 'MemoryService', 
          method: 'getTherapeuticRelationship'
        });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        therapistId: data.therapist_id,
        trustLevel: data.trust_level,
        rapportScore: data.rapport_score,
        communicationPreferences: data.communication_preferences,
        effectiveTechniques: data.effective_techniques,
        ineffectiveTechniques: data.ineffective_techniques,
        boundaryPreferences: data.boundary_preferences,
        lastInteraction: data.last_interaction ? new Date(data.last_interaction) : undefined,
        relationshipMilestones: data.relationship_milestones
      };
    } catch (error) {
      DebugLogger.error('MemoryService: Exception fetching therapeutic relationship', error as Error, { 
        component: 'MemoryService', 
        method: 'getTherapeuticRelationship'
      });
      return null;
    }
  }

  static async updateTherapeuticRelationship(
    userId: string, 
    therapistId: string, 
    updates: Partial<TherapeuticRelationship>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapeutic_relationship')
        .upsert({
          user_id: userId,
          therapist_id: therapistId,
          trust_level: updates.trustLevel,
          rapport_score: updates.rapportScore,
          communication_preferences: updates.communicationPreferences,
          effective_techniques: updates.effectiveTechniques,
          ineffective_techniques: updates.ineffectiveTechniques,
          boundary_preferences: updates.boundaryPreferences,
          last_interaction: new Date(),
          relationship_milestones: updates.relationshipMilestones
        });

      if (error) {
        DebugLogger.error('MemoryService: Error updating therapeutic relationship', error, { 
          component: 'MemoryService', 
          method: 'updateTherapeuticRelationship'
        });
        return false;
      }

      return true;
    } catch (error) {
      DebugLogger.error('MemoryService: Exception updating therapeutic relationship', error as Error, { 
        component: 'MemoryService', 
        method: 'updateTherapeuticRelationship'
      });
      return false;
    }
  }
}
