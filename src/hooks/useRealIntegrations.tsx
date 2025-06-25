
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Integration {
  id: string;
  name: string;
  type: string;
  description: string | null;
  configuration: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRealIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integrations')
        .select('*');

      if (error) throw error;

      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isIntegrationEnabled = (integrationId: string): boolean => {
    const integration = integrations.find(i => i.id === integrationId);
    return integration?.is_active || false;
  };

  const enableIntegration = async (integrationId: string, config: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('integrations')
        .upsert({
          id: integrationId,
          name: integrationId,
          type: integrationId,
          description: `${integrationId} integration`,
          configuration: config,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration enabled successfully",
      });

      await loadIntegrations();
      return true;
    } catch (error) {
      console.error('Error enabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to enable integration",
        variant: "destructive",
      });
      return false;
    }
  };

  const disableIntegration = async (integrationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: false })
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration disabled successfully",
      });

      await loadIntegrations();
      return true;
    } catch (error) {
      console.error('Error disabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to disable integration",
        variant: "destructive",
      });
      return false;
    }
  };

  const getIntegrationSettings = (integrationId: string): any => {
    const integration = integrations.find(i => i.id === integrationId);
    return integration?.configuration || {};
  };

  const updateIntegrationSettings = async (integrationId: string, settings: any): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ configuration: settings })
        .eq('id', integrationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Integration settings updated successfully",
      });

      await loadIntegrations();
      return true;
    } catch (error) {
      console.error('Error updating integration settings:', error);
      toast({
        title: "Error",
        description: "Failed to update integration settings",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    integrations,
    loading,
    reloadIntegrations: loadIntegrations,
    isIntegrationEnabled,
    enableIntegration,
    disableIntegration,
    getIntegrationSettings,
    updateIntegrationSettings
  };
};
