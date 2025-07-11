import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  content_type: 'article' | 'video' | 'audio' | 'exercise' | 'worksheet';
  category: string;
  tags: string[];
  content_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
  target_audience: string[];
  therapeutic_approach: string | null;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useContentLibrary = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('content_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContent((data as ContentItem[]) || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load content library",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData: Omit<ContentItem, 'id' | 'created_at' | 'updated_at' | 'published_at' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('content_library')
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;

      setContent(prev => [data as ContentItem, ...prev]);
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    try {
      const { data, error } = await supabase
        .from('content_library')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setContent(prev => prev.map(item => item.id === id ? data as ContentItem : item));
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
      return false;
    }
  };

  const publishContent = async (id: string) => {
    return updateContent(id, { 
      is_published: true, 
      published_at: new Date().toISOString() 
    });
  };

  const unpublishContent = async (id: string) => {
    return updateContent(id, { 
      is_published: false, 
      published_at: null 
    });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    loading,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    unpublishContent
  };
};