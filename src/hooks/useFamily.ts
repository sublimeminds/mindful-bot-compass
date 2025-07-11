import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyService, type Household, type HouseholdMember, type FamilyAlert } from '@/services/familyService';
import { useSimpleApp } from './useSimpleApp';
import { useToast } from './use-toast';

export const useFamily = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's household
  const {
    data: household,
    isLoading: isLoadingHousehold,
    error: householdError
  } = useQuery({
    queryKey: ['household', user?.id],
    queryFn: () => familyService.getUserHousehold(),
    enabled: !!user
  });

  // Get household members
  const {
    data: members,
    isLoading: isLoadingMembers,
    error: membersError
  } = useQuery({
    queryKey: ['household-members', household?.id],
    queryFn: () => household ? familyService.getHouseholdMembers(household.id) : [],
    enabled: !!household
  });

  // Get family alerts
  const {
    data: alerts,
    isLoading: isLoadingAlerts,
    error: alertsError
  } = useQuery({
    queryKey: ['family-alerts', household?.id],
    queryFn: () => household ? familyService.getFamilyAlerts(household.id) : [],
    enabled: !!household
  });

  // Invite family member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: (invitation: {
      household_id: string;
      invited_email: string;
      member_type: 'adult' | 'teen' | 'child';
      relationship?: string;
      age?: number;
      permission_level: 'full' | 'limited' | 'basic' | 'view_only';
    }) => familyService.inviteFamilyMember(invitation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household-members'] });
      toast({
        title: "Invitation Sent",
        description: "Family member invitation has been sent successfully."
      });
    },
    onError: (error) => {
      console.error('Error inviting family member:', error);
      toast({
        title: "Invitation Failed",
        description: "Failed to send family member invitation. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Acknowledge alert mutation
  const acknowledgeAlertMutation = useMutation({
    mutationFn: (alertId: string) => familyService.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-alerts'] });
      toast({
        title: "Alert Acknowledged",
        description: "Family alert has been acknowledged."
      });
    },
    onError: (error) => {
      console.error('Error acknowledging alert:', error);
      toast({
        title: "Failed to Acknowledge",
        description: "Failed to acknowledge alert. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update member permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: ({ memberId, permissions }: {
      memberId: string;
      permissions: {
        can_view_progress?: boolean;
        can_view_mood_data?: boolean;
        can_receive_alerts?: boolean;
        permission_level?: 'full' | 'limited' | 'basic' | 'view_only';
      };
    }) => familyService.updateMemberPermissions(memberId, permissions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household-members'] });
      toast({
        title: "Permissions Updated",
        description: "Family member permissions have been updated."
      });
    },
    onError: (error) => {
      console.error('Error updating permissions:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update member permissions. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Remove family member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => familyService.removeFamilyMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household-members'] });
      toast({
        title: "Member Removed",
        description: "Family member has been removed from the household."
      });
    },
    onError: (error) => {
      console.error('Error removing family member:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove family member. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Upgrade to family plan mutation
  const upgradePlanMutation = useMutation({
    mutationFn: (planId: string) => familyService.upgradeToFamilyPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['household'] });
      toast({
        title: "Plan Upgraded",
        description: "Successfully upgraded to family plan."
      });
    },
    onError: (error) => {
      console.error('Error upgrading plan:', error);
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade to family plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    household,
    members,
    alerts,
    
    // Loading states
    isLoadingHousehold,
    isLoadingMembers,
    isLoadingAlerts,
    
    // Error states
    householdError,
    membersError,
    alertsError,
    
    // Actions
    inviteMember: inviteMemberMutation.mutate,
    acknowledgeAlert: acknowledgeAlertMutation.mutate,
    updatePermissions: updatePermissionsMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    upgradePlan: upgradePlanMutation.mutate,
    
    // Loading states for mutations
    isInviting: inviteMemberMutation.isPending,
    isAcknowledging: acknowledgeAlertMutation.isPending,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
    isRemoving: removeMemberMutation.isPending,
    isUpgrading: upgradePlanMutation.isPending
  };
};