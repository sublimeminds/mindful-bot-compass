import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface TherapyPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  goals: any;
  milestones: any;
  therapist_id: string;
  current_phase: string;
  focus_areas: string[];
  sessions_per_week: number;
  estimated_duration_weeks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTherapyPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Fetch all therapy plans for the user
  const { 
    data: therapyPlans = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['therapy-plans', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('therapy_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(plan => ({
        ...plan,
        goals: Array.isArray(plan.goals) ? plan.goals : [],
        milestones: Array.isArray(plan.milestones) ? plan.milestones : [],
      })) as TherapyPlan[];
    },
    enabled: !!user?.id,
  });

  // Set initial active plan
  useEffect(() => {
    if (therapyPlans.length > 0 && !activePlanId) {
      const activeOrFirstPlan = therapyPlans.find(plan => plan.is_active) || therapyPlans[0];
      setActivePlanId(activeOrFirstPlan.id);
    }
  }, [therapyPlans, activePlanId]);

  // Get active therapy plan
  const activePlan = therapyPlans.find(plan => plan.id === activePlanId);

  // Create new therapy plan
  const createPlanMutation = useMutation({
    mutationFn: async (planData: {
      title: string;
      description: string;
      therapist_id: string;
      focus_areas: string[];
      sessions_per_week: number;
      estimated_duration_weeks: number;
      goals?: any;
      milestones?: any;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('therapy_plans')
        .insert([{
          ...planData,
          user_id: user.id,
          goals: planData.goals || [],
          milestones: planData.milestones || [],
          current_phase: 'active',
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: ['therapy-plans'] });
      setActivePlanId(newPlan.id);
      toast({
        title: "Therapy Plan Created",
        description: "Your new therapy plan has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create therapy plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update therapy plan
  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TherapyPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('therapy_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-plans'] });
      toast({
        title: "Plan Updated",
        description: "Your therapy plan has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update therapy plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Switch active therapy plan
  const switchActivePlan = (planId: string) => {
    const plan = therapyPlans.find(p => p.id === planId);
    if (plan) {
      setActivePlanId(planId);
      toast({
        title: "Plan Switched",
        description: `Switched to ${plan.title}`,
      });
    }
  };

  return {
    therapyPlans,
    activePlan,
    activePlanId,
    isLoading,
    error,
    createPlan: createPlanMutation.mutate,
    updatePlan: updatePlanMutation.mutate,
    switchActivePlan,
    isCreating: createPlanMutation.isPending,
    isUpdating: updatePlanMutation.isPending,
  };
};