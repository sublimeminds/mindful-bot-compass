
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  RotateCcw,
  Trash2,
  Shield,
  Activity,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsed: string;
  usageCount: number;
  rateLimit: number;
  expiresAt?: string;
}

const EnhancedAPIManagement = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_1234567890abcdef...',
      permissions: ['read:sessions', 'write:sessions', 'read:users'],
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2 hours ago',
      usageCount: 15420,
      rateLimit: 1000
    },
    {
      id: '2',
      name: 'Mobile App Integration',
      key: 'sk_mobile_abcdef1234567890...',
      permissions: ['read:sessions', 'write:mood', 'read:goals'],
      status: 'active',
      createdAt: '2024-02-01',
      lastUsed: '5 minutes ago',
      usageCount: 8930,
      rateLimit: 500
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      key: 'sk_analytics_fedcba0987654321...',
      permissions: ['read:analytics', 'read:reports'],
      status: 'revoked',
      createdAt: '2024-01-01',
      lastUsed: '2 weeks ago',
      usageCount: 2340,
      rateLimit: 100
    }
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const availablePermissions = [
    'read:users',
    'write:users',
    'read:sessions',
    'write:sessions',
    'read:mood',
    'write:mood',
    'read:goals',
    'write:goals',
    'read:analytics',
    'read:reports',
    'admin:all'
  ];

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied successfully",
    });
  };

  const regenerateKey = (keyId: string) => {
    toast({
      title: "API Key Regenerated",
      description: "New API key generated. Please update your applications.",
    });
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    toast({
      title: "API Key Revoked",
      description: "API key has been revoked and is no longer valid.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-6 w-6 text-therapy-600" />
            <span>API Key Management</span>
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input id="key-name" placeholder="e.g., Mobile App Integration" />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availablePermissions.map((permission) => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="rate-limit">Rate Limit (requests/hour)</Label>
                  <Input id="rate-limit" type="number" placeholder="1000" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage API keys for third-party integrations and external applications.
          </p>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(apiKey.status)}>
                      {apiKey.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Created {apiKey.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => regenerateKey(apiKey.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => revokeKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Last Used</div>
                      <div className="font-medium">{apiKey.lastUsed}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Requests</div>
                      <div className="font-medium">{apiKey.usageCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rate Limit</div>
                      <div className="font-medium">{apiKey.rateLimit}/hour</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium capitalize">{apiKey.status}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions">
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="usage">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Usage</span>
                      <span className="text-sm font-medium">
                        {Math.floor(Math.random() * apiKey.rateLimit)} / {apiKey.rateLimit}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(Math.floor(Math.random() * apiKey.rateLimit) / apiKey.rateLimit) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Usage resets every hour
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedAPIManagement;
