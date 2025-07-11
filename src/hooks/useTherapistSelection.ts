import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TherapistSelectionService, TherapistSelection } from '@/services/therapistSelectionService';
import { useSimpleApp } from './useSimpleApp';
import { useToast } from './use-toast';

export const useTherapistSelection = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: currentSelection,
    isLoading: isLoadingSelection,
    error: selectionError
  } = useQuery({
    queryKey: ['therapist-selection', user?.id],
    queryFn: () => user ? TherapistSelectionService.getCurrentSelection(user.id) : null,
    enabled: !!user
  });

  const {
    data: selectionHistory,
    isLoading: isLoadingHistory
  } = useQuery({
    queryKey: ['therapist-selection-history', user?.id],
    queryFn: () => user ? TherapistSelectionService.getSelectionHistory(user.id) : [],
    enabled: !!user
  });

  const selectTherapistMutation = useMutation({
    mutationFn: ({ 
      therapistId, 
      assessmentId, 
      selectionReason 
    }: { 
      therapistId: string; 
      assessmentId?: string; 
      selectionReason?: string; 
    }) => {
      if (!user) throw new Error('User not authenticated');
      return TherapistSelectionService.selectTherapist(user.id, therapistId, assessmentId, selectionReason);
    },
    onSuccess: (selectionId) => {
      if (selectionId) {
        queryClient.invalidateQueries({ queryKey: ['therapist-selection'] });
        toast({
          title: "Therapist Selected",
          description: "Your therapist selection has been updated successfully."
        });
      }
    },
    onError: (error) => {
      console.error('Error selecting therapist:', error);
      toast({
        title: "Selection Failed",
        description: "Failed to update therapist selection. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateSelectionReasonMutation = useMutation({
    mutationFn: ({ selectionId, reason }: { selectionId: string; reason: string }) =>
      TherapistSelectionService.updateSelectionReason(selectionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapist-selection'] });
      toast({
        title: "Reason Updated",
        description: "Selection reason has been updated."
      });
    }
  });

  const deactivateSelectionMutation = useMutation({
    mutationFn: ({ therapistId }: { therapistId: string }) => {
      if (!user) throw new Error('User not authenticated');
      return TherapistSelectionService.deactivateSelection(user.id, therapistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapist-selection'] });
      toast({
        title: "Selection Deactivated",
        description: "Therapist selection has been deactivated."
      });
    }
  });

  return {
    currentSelection,
    selectionHistory,
    isLoadingSelection,
    isLoadingHistory,
    selectionError,
    selectTherapist: selectTherapistMutation.mutate,
    updateSelectionReason: updateSelectionReasonMutation.mutate,
    deactivateSelection: deactivateSelectionMutation.mutate,
    isSelectingTherapist: selectTherapistMutation.isPending,
    isUpdatingReason: updateSelectionReasonMutation.isPending,
    isDeactivating: deactivateSelectionMutation.isPending
  };
};