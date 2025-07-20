
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type ConversationMemory = Database['public']['Tables']['conversation_memory']['Row'];
type ConversationMemoryInsert = Database['public']['Tables']['conversation_memory']['Insert'];

export const useConversationMemory = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<ConversationMemory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = async (sessionId?: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('importance_score', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setMemories(data || []);
    } catch (error) {
      console.error('Error fetching conversation memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (memory: Omit<ConversationMemoryInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .insert({
          ...memory,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setMemories(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding conversation memory:', error);
      return null;
    }
  };

  const updateMemoryReference = async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('conversation_memory')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', memoryId);

      if (error) throw error;
      
      // Update local state
      setMemories(prev => 
        prev.map(memory => 
          memory.id === memoryId 
            ? { ...memory, updated_at: new Date().toISOString() }
            : memory
        )
      );
    } catch (error) {
      console.error('Error updating memory reference:', error);
    }
  };

  const searchMemories = async (query: string, limit = 10) => {
    if (!user || !query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('conversation_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('importance_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Update references for searched memories
      data?.forEach(memory => updateMemoryReference(memory.id));
      
      return data || [];
    } catch (error) {
      console.error('Error searching memories:', error);
      return [];
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
        .or(`tags.cs.{${context}},content.ilike.%${context}%`)
        .order('importance_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting relevant memories:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchMemories();
    }
  }, [user]);

  const generateCallbacks = (memories: ConversationMemory[]) => {
    return memories.map(memory => ({
      id: memory.id,
      title: memory.title,
      content: memory.content.substring(0, 100),
      importance: memory.importance_score
    }));
  };

  return {
    memories,
    loading,
    fetchMemories,
    addMemory,
    updateMemoryReference,
    searchMemories,
    getRelevantMemories,
    generateCallbacks,
  };
};
