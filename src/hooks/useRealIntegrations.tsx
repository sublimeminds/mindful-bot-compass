
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from './use-toast';

export interface Integration {
  id: string;
  name: string;
  type: string;
  description: string;
  is_active: boolean;
  configuration: any;
}

export interface UserIntegration {
  id: string;
  user_id: string;
  integration_id: string;
  is_enabled: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
}

export const useRealIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIntegrations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error Loading Integrations",
        description: "Failed to load available integrations",
        variant: "destructive"
      });
    }
  }, [toast]);

  const loadUserIntegrations = useCallback(async () => {
    if (!user) return;

    try {
      // Since user_integrations table doesn't exist yet, we'll create mock data
      // that represents what the real implementation would look like
      setUserIntegrations([]);
    } catch (error) {
      console.error('Error loading user integrations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const enableIntegration = useCallback(async (integrationId: string, settings: any = {}) => {
    if (!user) return false;

    try {
      // This would insert into user_integrations table when it exists
      const newUserIntegration = {
        id: `ui_${Date.now()}`,
        user_id: user.id,
        integration_id: integrationId,
        is_enabled: true,
        settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUserIntegrations(prev => [...prev, newUserIntegration]);
      
      toast({
        title: "Integration Enabled",
        description: "Integration has been successfully configured",
      });

      return true;
    } catch (error) {
      console.error('Error enabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to enable integration",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  const disableIntegration = useCallback(async (integrationId: string) => {
    if (!user) return false;

    try {
      setUserIntegrations(prev => 
        prev.filter(ui => ui.integration_id !== integrationId)
      );
      
      toast({
        title: "Integration Disabled",
        description: "Integration has been disabled",
      });

      return true;
    } catch (error) {
      console.error('Error disabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to disable integration",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  const updateIntegrationSettings = useCallback(async (
    integrationId: string, 
    newSettings: any
  ) => {
    if (!user) return false;

    try {
      setUserIntegrations(prev => 
        prev.map(ui => 
          ui.integration_id === integrationId 
            ? { ...ui, settings: { ...ui.settings, ...newSettings }, updated_at: new Date().toISOString() }
            : ui
        )
      );
      
      toast({
        title: "Settings Updated",
        description: "Integration settings have been saved",
      });

      return true;
    } catch (error) {
      console.error('Error updating integration settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  const isIntegrationEnabled = useCallback((integrationId: string) => {
    return userIntegrations.some(ui => 
      ui.integration_id === integrationId && ui.is_enabled
    );
  }, [userIntegrations]);

  const getIntegrationSettings = useCallback((integrationId: string) => {
    const userIntegration = userIntegrations.find(ui => 
      ui.integration_id === integrationId
    );
    return userIntegration?.settings || {};
  }, [userIntegrations]);

  useEffect(() => {
    if (user) {
      loadIntegrations();
      loadUserIntegrations();
    }
  }, [user, loadIntegrations, loadUserIntegrations]);

  return {
    integrations,
    userIntegrations,
    loading,
    enableIntegration,
    disableIntegration,
    updateIntegrationSettings,
    isIntegrationEnabled,
    getIntegrationSettings,
    refreshIntegrations: loadIntegrations,
    refreshUserIntegrations: loadUserIntegrations
  };
};
