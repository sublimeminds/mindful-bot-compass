import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Integration {
  id: string;
  user_id: string;
  platform_type: string;
  platform_user_id: string;
  is_active: boolean;
  integration_settings: any;
  access_tokens: any;
  crisis_escalation_enabled: boolean;
  last_sync: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationConfig {
  api_key?: string;
  webhook_url?: string;
  phone_number?: string;
  business_account_id?: string;
  bot_token?: string;
  channel_id?: string;
  calendar_url?: string;
  health_permissions?: string[];
  platform_user_id?: string;
  access_tokens?: any;
  crisis_escalation_enabled?: boolean;
  [key: string]: any;
}

export const useIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (platform: string, config: IntegrationConfig) => {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .insert({
          user_id: user?.id,
          platform_type: platform,
          platform_user_id: config.platform_user_id || '',
          integration_settings: config,
          access_tokens: config.access_tokens || {},
          is_active: true,
          crisis_escalation_enabled: config.crisis_escalation_enabled || false
        })
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => [data, ...prev]);
      
      toast({
        title: "Integration Created",
        description: `${platform} integration has been set up successfully.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Setup Failed",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<Integration>) => {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setIntegrations(prev => 
        prev.map(integration => 
          integration.id === id ? data : integration
        )
      );

      return data;
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setIntegrations(prev => prev.filter(integration => integration.id !== id));
      
      toast({
        title: "Integration Removed",
        description: "Integration has been disconnected.",
      });
    } catch (err: any) {
      toast({
        title: "Removal Failed",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const testIntegration = async (id: string) => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) throw new Error('Integration not found');

      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { 
          integration_id: id,
          platform_type: integration.platform_type,
          configuration: integration.integration_settings
        }
      });

      if (error) throw error;

      toast({
        title: "Test Successful",
        description: `${integration.platform_type} integration is working correctly.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Test Failed",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const syncIntegration = async (id: string) => {
    try {
      const integration = integrations.find(i => i.id === id);
      if (!integration) throw new Error('Integration not found');

      const { data, error } = await supabase.functions.invoke('sync-integration', {
        body: { 
          integration_id: id,
          platform_type: integration.platform_type
        }
      });

      if (error) throw error;

    // Update last sync time
      await updateIntegration(id, { last_sync: new Date().toISOString() });

      toast({
        title: "Sync Complete",
        description: `${integration.platform_type} data has been synchronized.`,
      });

      return data;
    } catch (err: any) {
      toast({
        title: "Sync Failed",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const getIntegrationByPlatform = (platform: string) => {
    return integrations.find(i => i.platform_type === platform);
  };

  const getActiveIntegrations = () => {
    return integrations.filter(i => i.is_active);
  };

  return {
    integrations,
    loading,
    error,
    loadIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    testIntegration,
    syncIntegration,
    getIntegrationByPlatform,
    getActiveIntegrations
  };
};