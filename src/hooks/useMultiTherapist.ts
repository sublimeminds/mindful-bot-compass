import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MultiTherapistService, EnhancedTherapistSelectionService } from '@/services/multiTherapistService';
import { useSimpleApp } from './useSimpleApp';
import { useToast } from './use-toast';

export const useMultiTherapist = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's therapy team
  const {
    data: therapyTeam,
    isLoading: isLoadingTeam,
    error: teamError
  } = useQuery({
    queryKey: ['therapy-team', user?.id],
    queryFn: () => user ? MultiTherapistService.getUserTherapyTeam(user.id) : null,
    enabled: !!user
  });

  // Get active therapists
  const {
    data: activeTherapists,
    isLoading: isLoadingTherapists,
    error: therapistsError
  } = useQuery({
    queryKey: ['active-therapists', user?.id],
    queryFn: () => user ? MultiTherapistService.getActiveTherapists(user.id) : [],
    enabled: !!user
  });

  // Get context switch history
  const {
    data: contextHistory,
    isLoading: isLoadingHistory
  } = useQuery({
    queryKey: ['context-history', user?.id],
    queryFn: () => user ? MultiTherapistService.getContextSwitchHistory(user.id) : [],
    enabled: !!user
  });

  // Switch therapist context mutation
  const switchContextMutation = useMutation({
    mutationFn: ({ 
      toTherapistId, 
      fromTherapistId, 
      reason, 
      contextData 
    }: { 
      toTherapistId: string; 
      fromTherapistId?: string; 
      reason?: string; 
      contextData?: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return MultiTherapistService.switchTherapistContext(
        user.id, 
        toTherapistId, 
        fromTherapistId, 
        reason, 
        contextData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-therapists'] });
      queryClient.invalidateQueries({ queryKey: ['context-history'] });
      toast({
        title: "Context Switched",
        description: "Successfully switched to new therapist context."
      });
    },
    onError: (error) => {
      console.error('Error switching context:', error);
      toast({
        title: "Switch Failed",
        description: "Failed to switch therapist context. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Add therapist to team mutation
  const addTherapistMutation = useMutation({
    mutationFn: ({ 
      therapistId, 
      specialty, 
      isPrimary, 
      context 
    }: { 
      therapistId: string; 
      specialty: string; 
      isPrimary?: boolean; 
      context?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      return MultiTherapistService.addTherapistToTeam(
        user.id, 
        therapistId, 
        specialty, 
        isPrimary, 
        context
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-team'] });
      queryClient.invalidateQueries({ queryKey: ['active-therapists'] });
      toast({
        title: "Therapist Added",
        description: "Successfully added therapist to your team."
      });
    },
    onError: (error) => {
      console.error('Error adding therapist:', error);
      toast({
        title: "Addition Failed",
        description: "Failed to add therapist to team. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Select multiple therapists mutation
  const selectMultipleTherapistsMutation = useMutation({
    mutationFn: (selections: Array<{
      therapistId: string;
      specialty: string;
      isPrimary?: boolean;
      context?: string;
      reason?: string;
    }>) => {
      if (!user) throw new Error('User not authenticated');
      return EnhancedTherapistSelectionService.selectMultipleTherapists(user.id, selections);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-team'] });
      queryClient.invalidateQueries({ queryKey: ['active-therapists'] });
      toast({
        title: "Team Updated",
        description: "Successfully updated your therapist team."
      });
    },
    onError: (error) => {
      console.error('Error selecting therapists:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update therapist team. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update therapy team mutation
  const updateTeamMutation = useMutation({
    mutationFn: (updates: any) => {
      if (!user) throw new Error('User not authenticated');
      return MultiTherapistService.updateTherapyTeam(user.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapy-team'] });
      toast({
        title: "Team Updated",
        description: "Therapy team configuration updated successfully."
      });
    }
  });

  // Get recommendations
  const getRecommendations = async (specialties: string[]) => {
    if (!user) return null;
    return MultiTherapistService.getTherapistRecommendations(user.id, specialties);
  };

  return {
    // Data
    therapyTeam,
    activeTherapists,
    contextHistory,
    
    // Loading states
    isLoadingTeam,
    isLoadingTherapists,
    isLoadingHistory,
    
    // Error states
    teamError,
    therapistsError,
    
    // Actions
    switchContext: switchContextMutation.mutate,
    addTherapist: addTherapistMutation.mutate,
    selectMultipleTherapists: selectMultipleTherapistsMutation.mutate,
    updateTeam: updateTeamMutation.mutate,
    getRecommendations,
    
    // Loading states for mutations
    isSwitchingContext: switchContextMutation.isPending,
    isAddingTherapist: addTherapistMutation.isPending,
    isSelectingTherapists: selectMultipleTherapistsMutation.isPending,
    isUpdatingTeam: updateTeamMutation.isPending
  };
};