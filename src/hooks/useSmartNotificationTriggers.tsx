
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { smartNotificationTriggerService } from "@/services/smartNotificationTriggerService";
import { useSimpleApp } from "@/hooks/useSimpleApp";

export const useSmartNotificationTriggers = () => {
  const { user } = useSimpleApp();
  const queryClient = useQueryClient();

  const triggerAnalytics = useQuery({
    queryKey: ['trigger-analytics', user?.id],
    queryFn: () => smartNotificationTriggerService.getTriggerAnalytics(user?.id),
    enabled: !!user?.id,
  });

  const runTriggerCheck = useMutation({
    mutationFn: () => smartNotificationTriggerService.checkAndTriggerNotifications(user?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trigger-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const runDailyCheck = useMutation({
    mutationFn: () => smartNotificationTriggerService.runDailyTriggerCheck(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trigger-analytics'] });
    },
  });

  return {
    triggerAnalytics: triggerAnalytics.data || [],
    isLoading: triggerAnalytics.isLoading,
    runTriggerCheck: runTriggerCheck.mutate,
    runDailyCheck: runDailyCheck.mutate,
    isRunningCheck: runTriggerCheck.isPending || runDailyCheck.isPending,
  };
};
