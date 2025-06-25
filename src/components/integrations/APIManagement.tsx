
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key_hash: string;
  created_at: string;
  is_active: boolean;
  user_id: string;
  expires_at: string;
  last_used_at: string;
  permissions: any;
  rate_limit: number;
  updated_at: string;
}

const APIManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user) {
      loadAPIKeys();
    }
  }, [user]);

  const loadAPIKeys = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAPIKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Warning",
        description: "Please enter a name for the API key",
      });
      return;
    }

    try {
      if (!user) return;

      // Generate a random API key
      const apiKey = generateRandomKey(32);

      const { error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName,
          key_hash: apiKey,
          user_id: user.id,
          is_active: true,
        });

      if (error) throw error;

      setNewKeyName('');
      loadAPIKeys();
      toast({
        title: "API Key Generated",
        description: "New API key created successfully.",
      });
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: "Error",
        description: "Failed to generate API key.",
        variant: "destructive",
      });
    }
  };

  const revokeAPIKey = async (apiKey: APIKey) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', apiKey.id);

      if (error) throw error;

      loadAPIKeys();
      toast({
        title: "API Key Revoked",
        description: `API key ${apiKey.name} has been revoked.`,
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key.",
        variant: "destructive",
      });
    }
  };

  const copyAPIKey = (apiKey: APIKey) => {
    navigator.clipboard.writeText(apiKey.key_hash);
    toast({
      title: "API Key Copied",
      description: "API key copied to clipboard.",
    });
  };

  const generateRandomKey = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  if (loading) {
    return <p>Loading API keys...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>API Management</span>
          <Button onClick={generateAPIKey}>
            <Plus className="h-4 w-4 mr-2" />
            Generate API Key
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="key-name">Key Name:</Label>
            <Input
              id="key-name"
              type="text"
              placeholder="Enter key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          {apiKeys.length === 0 ? (
            <p>No API keys generated yet. Add one to start using the API!</p>
          ) : (
            apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{apiKey.name}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(apiKey.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Key: {showKey ? apiKey.key_hash : '********************************'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyAPIKey(apiKey)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeAPIKey(apiKey)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Revoke
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showKey ? 'Hide' : 'Show'}
                  </Button>
                  <Badge variant={apiKey.is_active ? "default" : "destructive"}>
                    {apiKey.is_active ? 'Active' : 'Revoked'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default APIManagement;
