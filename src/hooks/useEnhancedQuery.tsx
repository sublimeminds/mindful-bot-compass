
import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useNetworkResilience } from './useNetworkResilience';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

interface EnhancedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  queryFn: () => Promise<T>;
  cacheKey?: string;
  cacheTTL?: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  fallbackData?: T;
  optimisticUpdate?: boolean;
}

interface EnhancedMutationOptions<T, TVariables> extends UseMutationOptions<T, Error, TVariables> {
  optimisticUpdate?: (variables: TVariables) => any;
  rollbackUpdate?: (context: any) => void;
  invalidateTags?: string[];
  successMessage?: string;
  errorMessage?: string;
}

export const useEnhancedQuery = <T,>(options: EnhancedQueryOptions<T>) => {
  const { withRetry, networkState } = useNetworkResilience();
  const { toast } = useToast();
  
  const {
    queryFn,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    priority = 'medium',
    tags = [],
    fallbackData,
    optimisticUpdate,
    ...queryOptions
  } = options;

  const enhancedQueryFn = useCallback(async (): Promise<T> => {
    // Network request with retry logic
    return withRetry(queryFn, {
      maxAttempts: networkState.isSlowConnection ? 2 : 3,
      baseDelay: networkState.isSlowConnection ? 2000 : 1000
    });
  }, [queryFn, withRetry, networkState]);

  const query = useQuery({
    ...queryOptions,
    queryFn: enhancedQueryFn,
    staleTime: cacheTTL * 0.8, // Consider stale at 80% of TTL
    gcTime: cacheTTL * 2, // Keep in memory for 2x TTL
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        return false;
      }
      
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: !networkState.isSlowConnection,
    refetchOnReconnect: true
  });

  return query;
};

export const useEnhancedMutation = <T, TVariables = void>(
  options: EnhancedMutationOptions<T, TVariables>
) => {
  const queryClient = useQueryClient();
  const { withRetry, networkState } = useNetworkResilience();
  const { toast } = useToast();
  
  const {
    optimisticUpdate,
    rollbackUpdate,
    invalidateTags = [],
    successMessage,
    errorMessage,
    ...mutationOptions
  } = options;

  const mutation = useMutation({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      if (!networkState.isOnline) {
        // Queue for later when online
        throw new Error('Offline - queued for sync');
      }
      
      return withRetry(
        () => mutationOptions.mutationFn!(variables),
        { maxAttempts: 2 } // Fewer retries for mutations
      );
    },
    onMutate: async (variables: TVariables) => {
      let context: any = {};
      
      if (optimisticUpdate) {
        // Cancel outgoing refetches
        await queryClient.cancelQueries();
        
        // Snapshot current state
        context = optimisticUpdate(variables);
      }
      
      return { ...context, ...(await mutationOptions.onMutate?.(variables) || {}) };
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update
      if (rollbackUpdate && context) {
        rollbackUpdate(context);
      }
      
      // Show error message
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      mutationOptions.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate related queries
      invalidateTags.forEach(tag => {
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey.some(key => 
            typeof key === 'string' && key.includes(tag)
          )
        });
      });
      
      // Show success message
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "default"
        });
      }
      
      mutationOptions.onSuccess?.(data, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch related queries
      queryClient.refetchQueries({ type: 'active' });
      
      mutationOptions.onSettled?.(data, error, variables, context);
    }
  });

  return mutation;
};

// Hook for cache management
export const useCacheManager = () => {
  const queryClient = useQueryClient();
  
  const invalidateByTag = useCallback(async (tag: string) => {
    // Invalidate React Query cache
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.some(key => 
        typeof key === 'string' && key.includes(tag)
      )
    });
  }, [queryClient]);
  
  const cleanup = useCallback(async () => {
    queryClient.clear();
  }, [queryClient]);
  
  return {
    invalidateByTag,
    cleanup
  };
};
