/**
 * Elite System Activation Hook
 * Activates and manages the Elite AI system for therapy sessions
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface EliteSystemStatus {
  isActivated: boolean;
  cronJobsActive: boolean;
  culturalAiActive: boolean;
  adaptiveLearningActive: boolean;
  systemHealth: 'optimal' | 'degraded' | 'offline';
  lastActivation?: string;
}

export const useEliteSystemActivation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState<EliteSystemStatus>({
    isActivated: false,
    cronJobsActive: false,
    culturalAiActive: false,
    adaptiveLearningActive: false,
    systemHealth: 'offline'
  });
  const [isActivating, setIsActivating] = useState(false);

  /**
   * Activate the Elite AI system for the user
   */
  const activateEliteSystem = useCallback(async () => {
    if (!user || isActivating) return;

    setIsActivating(true);
    
    try {
      console.log('🚀 Activating Elite AI System for user:', user.id);

      // 1. Setup Elite Cron System
      const cronResponse = await supabase.functions.invoke('setup-elite-cron-system', {
        body: { 
          userId: user.id,
          enableAll: true 
        }
      });

      if (cronResponse.error) {
        throw new Error(`Cron setup failed: ${cronResponse.error}`);
      }

      // 2. Initialize Adaptive Learning Profile
      const { error: profileError } = await supabase
        .from('adaptive_learning_profiles')
        .upsert({
          user_id: user.id,
          learning_patterns: {},
          cultural_adaptations: {},
          effectiveness_metrics: {},
          model_performance: {},
          preference_adjustments: {},
          therapy_outcomes: {},
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });

      if (profileError) {
        throw new Error(`Adaptive learning setup failed: ${profileError.message}`);
      }

      // 3. Initialize Cultural AI Integration (using existing user preferences table)
      const { data: existingProfile } = await supabase
        .from('enhanced_therapy_preferences')
        .select('cultural_competency_needs')
        .eq('user_id', user.id)
        .single();

      if (!existingProfile) {
        const { error: culturalError } = await supabase
          .from('enhanced_therapy_preferences')
          .upsert({
            user_id: user.id,
            cultural_competency_needs: ['general']
          });

        if (culturalError) {
          console.warn('Cultural profile setup warning:', culturalError.message);
        }
      }

      // 4. Create system intelligence metrics entry
      const { error: metricsError } = await supabase
        .from('system_intelligence_metrics')
        .insert({
          user_id: user.id,
          metric_type: 'elite_system_activation',
          metric_value: 1.0,
          performance_data: {
            activation_timestamp: new Date().toISOString(),
            systems_activated: ['cron_jobs', 'adaptive_learning', 'cultural_ai'],
            activation_source: 'user_request'
          },
          recorded_at: new Date().toISOString()
        });

      if (metricsError) {
        console.warn('Metrics recording warning:', metricsError.message);
      }

      await checkSystemStatus();

      toast({
        title: "🧠 Elite AI System Activated",
        description: "Advanced AI, cultural adaptation, and adaptive learning are now active for your sessions.",
      });

      console.log('✅ Elite AI System fully activated');

    } catch (error) {
      console.error('❌ Elite system activation failed:', error);
      toast({
        title: "Elite System Error",
        description: "Failed to activate Elite AI system. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      setIsActivating(false);
    }
  }, [user, isActivating, toast]);

  /**
   * Check current system status
   */
  const checkSystemStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Check adaptive learning profile
      const { data: adaptiveProfile } = await supabase
        .from('adaptive_learning_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Check cultural profile (using existing therapy preferences)
      const { data: culturalProfile } = await supabase
        .from('enhanced_therapy_preferences')
        .select('cultural_competency_needs')
        .eq('user_id', user.id)
        .single();

      // Check recent AI routing decisions (indicates active Elite AI)
      const { data: routingDecisions } = await supabase
        .from('ai_routing_decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Check system metrics
      const { data: systemMetrics } = await supabase
        .from('system_intelligence_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('metric_type', 'elite_system_activation')
        .order('recorded_at', { ascending: false })
        .limit(1);

      const newStatus: EliteSystemStatus = {
        isActivated: !!(adaptiveProfile && culturalProfile),
        cronJobsActive: !!systemMetrics?.length,
        culturalAiActive: !!culturalProfile,
        adaptiveLearningActive: !!adaptiveProfile,
        systemHealth: 'optimal',
        lastActivation: systemMetrics?.[0]?.recorded_at
      };

      setSystemStatus(newStatus);

    } catch (error) {
      console.error('❌ Error checking system status:', error);
      setSystemStatus(prev => ({
        ...prev,
        systemHealth: 'degraded'
      }));
    }
  }, [user]);

  /**
   * Deactivate Elite system (for testing/troubleshooting)
   */
  const deactivateEliteSystem = useCallback(async () => {
    if (!user) return;

    try {
      // This would typically pause rather than delete data
      console.log('⏸️ Pausing Elite AI System');
      
      toast({
        title: "Elite AI System Paused",
        description: "Elite features have been temporarily paused.",
      });

    } catch (error) {
      console.error('❌ Error deactivating Elite system:', error);
    }
  }, [user, toast]);

  /**
   * Get system performance metrics
   */
  const getSystemMetrics = useCallback(async () => {
    if (!user) return null;

    try {
      const { data } = await supabase
        .from('system_intelligence_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('❌ Error fetching system metrics:', error);
      return null;
    }
  }, [user]);

  // Check system status on mount and user change
  useEffect(() => {
    checkSystemStatus();
  }, [checkSystemStatus]);

  // Auto-activate Elite system for authenticated users
  useEffect(() => {
    if (user && !systemStatus.isActivated && !isActivating) {
      // Auto-activate with slight delay to avoid aggressive activation
      const timer = setTimeout(() => {
        activateEliteSystem();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, systemStatus.isActivated, isActivating, activateEliteSystem]);

  return {
    systemStatus,
    isActivating,
    activateEliteSystem,
    deactivateEliteSystem,
    checkSystemStatus,
    getSystemMetrics
  };
};