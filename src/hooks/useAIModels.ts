import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model: string;
  is_active: boolean;
  temperature: number;
  max_tokens: number;
  cost_per_token: number;
  capabilities: string[];
  system_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface AIPerformanceData {
  modelId: string;
  responseTime: number;
  tokenUsage: number;
  cost: number;
  userRating?: number;
  timestamp: string;
}

export const useAIModels = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all AI model configurations
  const { data: aiModels, isLoading: isLoadingModels } = useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AIModel[];
    }
  });

  // Get AI performance statistics
  const { data: performanceStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['ai-performance-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_performance_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data?.map(stat => ({
        modelId: stat.model_id || '',
        responseTime: stat.response_time,
        tokenUsage: stat.token_usage,
        cost: stat.cost,
        userRating: stat.user_rating,
        timestamp: stat.created_at
      })) || [];
    }
  });

  // Get AI model performance metrics
  const { data: modelPerformance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ['ai-model-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_model_performance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  // Create new AI model configuration
  const createModelMutation = useMutation({
    mutationFn: async (modelData: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .insert(modelData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Model Created",
        description: "AI model configuration has been created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create AI model configuration.",
        variant: "destructive"
      });
    }
  });

  // Update AI model configuration
  const updateModelMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<AIModel> & { id: string }) => {
      const { data, error } = await supabase
        .from('ai_model_configs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Model Updated",
        description: "AI model configuration has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update AI model configuration.",
        variant: "destructive"
      });
    }
  });

  // Delete AI model configuration
  const deleteModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from('ai_model_configs')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast({
        title: "Model Deleted",
        description: "AI model configuration has been deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete AI model configuration.",
        variant: "destructive"
      });
    }
  });

  return {
    aiModels,
    performanceStats,
    modelPerformance,
    isLoadingModels,
    isLoadingStats,
    isLoadingPerformance,
    createModel: createModelMutation.mutate,
    updateModel: updateModelMutation.mutate,
    deleteModel: deleteModelMutation.mutate,
    isCreating: createModelMutation.isPending,
    isUpdating: updateModelMutation.isPending,
    isDeleting: deleteModelMutation.isPending
  };
};