import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ConversationMemory {
  id: string;
  memory_type: 'personal_detail' | 'concern' | 'goal' | 'milestone' | 'preference' | 'relationship' | 'trigger' | 'strength';
  title: string;
  content: string;
  emotional_context: any;
  importance_score: number;
  tags: string[];
  is_active: boolean;
  last_referenced_at?: string;
  created_at: string;
}

export const useConversationMemory = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<ConversationMemory[]>([]);
  const [loading, setLoading] = useState(false);

  const addMemory = async (
    type: ConversationMemory['memory_type'],
    title: string,
    content: string,
    emotionalContext = {},
    importanceScore = 0.5,
    tags: string[] = []
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .insert({
          user_id: user.id,
          memory_type: type,
          title,
          content,
          emotional_context: emotionalContext,
          importance_score: importanceScore,
          tags
        })
        .select()
        .single();

      if (error) throw error;
      
      // Map the response to our interface
      const mappedData: ConversationMemory = {
        id: data.id,
        memory_type: data.memory_type as ConversationMemory['memory_type'],
        title: data.title,
        content: data.content,
        emotional_context: data.emotional_context,
        importance_score: data.importance_score,
        tags: data.tags,
        is_active: data.is_active,
        last_referenced_at: data.last_referenced_at || undefined,
        created_at: data.created_at
      };
      
      setMemories(prev => [mappedData, ...prev]);
      return mappedData;
    } catch (error) {
      console.error('Error adding memory:', error);
      return null;
    }
  };

  const getRelevantMemories = async (context: string, limit = 5) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('importance_score', { ascending: false })
        .order('last_referenced_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Map the response to our interface
      return (data || []).map(item => ({
        id: item.id,
        memory_type: item.memory_type as ConversationMemory['memory_type'],
        title: item.title,
        content: item.content,
        emotional_context: item.emotional_context,
        importance_score: item.importance_score,
        tags: item.tags,
        is_active: item.is_active,
        last_referenced_at: item.last_referenced_at || undefined,
        created_at: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
  };

  const updateMemoryReference = async (memoryId: string) => {
    try {
      await supabase
        .from('conversation_memory')
        .update({ 
          last_referenced_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId);
    } catch (error) {
      console.error('Error updating memory reference:', error);
    }
  };

  const getMemoriesByType = (type: ConversationMemory['memory_type']) => {
    return memories.filter(memory => memory.memory_type === type && memory.is_active);
  };

  const generateCallbacks = (previousMemories: ConversationMemory[]) => {
    const callbacks: string[] = [];
    
    previousMemories.forEach(memory => {
      switch (memory.memory_type) {
        case 'concern':
          callbacks.push(`How are you feeling about ${memory.title} that we discussed?`);
          break;
        case 'goal':
          callbacks.push(`I remember you wanted to work on ${memory.title}. How's that going?`);
          break;
        case 'milestone':
          callbacks.push(`Last time you achieved ${memory.title}. That was wonderful!`);
          break;
        case 'personal_detail':
          callbacks.push(`I remember you mentioned ${memory.title}.`);
          break;
      }
    });

    return callbacks;
  };

  useEffect(() => {
    if (user) {
      getRelevantMemories('').then(memories => {
        setMemories(memories);
      });
    }
  }, [user]);

  return {
    memories,
    loading,
    addMemory,
    getRelevantMemories,
    updateMemoryReference,
    getMemoriesByType,
    generateCallbacks
  };
};