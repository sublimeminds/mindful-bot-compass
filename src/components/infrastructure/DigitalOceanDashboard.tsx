
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  Server, 
  Database, 
  Shield, 
  Activity, 
  Plus, 
  Trash2, 
  RefreshCw,
  HardDrive,
  Network,
  Container,
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { digitalOceanService } from '@/services/digitalOceanService';
import { enhancedBackupService } from '@/services/enhancedBackupService';

const DigitalOceanDashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [loadBalancers, setLoadBalancers] = useState([]);
  const [crossCloudBackups, setCrossCloudBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  
  const [config, setConfig] = useState({
    apiToken: '',
    spacesAccessKey: '',
    spacesSecretKey: '',
    defaultRegion: 'nyc3'
  });

  const [newResource, setNewResource] = useState({
    type: 'droplet',
    name: '',
    region: 'nyc3',
    size: 's-1vcpu-1gb'
  });

  useEffect(() => {
    loadData();
  }, [isConfigured]);

  const loadData = async () => {
    if (!isConfigured) return;
    
    setLoading(true);
    try {
      const [spacesData, dropletsData, databasesData, backupsData] = await Promise.all([
        digitalOceanService.listSpaces().catch(() => []),
        digitalOceanService.listDroplets().catch(() => []),
        digitalOceanService.listDatabases().catch(() => []),
        enhancedBackupService.getCrossCloudBackups()
      ]);

      setSpaces(spacesData);
      setDroplets(dropletsData);
      setDatabases(databasesData);
      setCrossCloudBackups(backupsData);
    } catch (error) {
      console.error('Failed to load DigitalOcean data:', error);
    } finally {
      setLoading(false);
    }
  };

  const configureService = () => {
    try {
      digitalOceanService.configure(config);
      setIsConfigured(true);
      alert('DigitalOcean service configured successfully!');
    } catch (error) {
      console.error('Configuration failed:', error);
      alert('Configuration failed. Please check your credentials.');
    }
  };

  const createResource = async () => {
    setLoading(true);
    try {
      switch (newResource.type) {
        case 'droplet':
          await digitalOceanService.createDroplet(
            newResource.name,
            newResource.region,
            newResource.size,
            'ubuntu-20-04-x64'
          );
          break;
        case 'space':
          await digitalOceanService.createSpace(newResource.name, newResource.region);
          break;
        case 'database':
          await digitalOceanService.createDatabase(newResource.name, 'pg', newResource.size);
          break;
      }
      
      setNewResource({ type: 'droplet', name: '', region: 'nyc3', size: 's-1vcpu-1gb' });
      await loadData();
      alert(`${newResource.type} created successfully!`);
    } catch (error) {
      console.error('Failed to create resource:', error);
      alert(`Failed to create ${newResource.type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const deleteDroplet = async (dropletId) => {
    const confirmed = window.confirm('Are you sure you want to delete this droplet?');
    if (!confirmed) return;

    setLoading(true);
    try {
      await digitalOceanService.deleteDroplet(dropletId);
      await loadData();
      alert('Droplet deleted successfully!');
    } catch (error) {
      console.error('Failed to delete droplet:', error);
      alert('Failed to delete droplet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testDisasterRecovery = async () => {
    setLoading(true);
    try {
      const success = await enhancedBackupService.testDisasterRecovery();
      alert(success ? 'Disaster recovery test PASSED!' : 'Disaster recovery test FAILED!');
    } catch (error) {
      console.error('Disaster recovery test failed:', error);
      alert('Disaster recovery test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': 
      case 'completed':
      case 'online': return 'bg-green-100 text-green-800';
      case 'new':
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'archive':
      case 'off': return 'bg-gray-100 text-gray-800';
      case 'failed':
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">DigitalOcean Integration</h2>
          <p className="text-therapy-600 mt-1">Configure your DigitalOcean credentials to get started</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="h-5 w-5 mr-2" />
              DigitalOcean Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-token">API Token</Label>
              <Input
                id="api-token"
                type="password"
                value={config.apiToken}
                onChange={(e) => setConfig({...config, apiToken: e.target.value})}
                placeholder="Enter your DigitalOcean API token"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spaces-key">Spaces Access Key</Label>
                <Input
                  id="spaces-key"
                  value={config.spacesAccessKey}
                  onChange={(e) => setConfig({...config, spacesAccessKey: e.target.value})}
                  placeholder="Spaces access key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaces-secret">Spaces Secret Key</Label>
                <Input
                  id="spaces-secret"
                  type="password"
                  value={config.spacesSecretKey}
                  onChange={(e) => setConfig({...config, spacesSecretKey: e.target.value})}
                  placeholder="Spaces secret key"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-region">Default Region</Label>
              <Select value={config.defaultRegion} onValueChange={(value) => setConfig({...config, defaultRegion: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nyc3">New York 3</SelectItem>
                  <SelectItem value="sfo3">San Francisco 3</SelectItem>
                  <SelectItem value="fra1">Frankfurt 1</SelectItem>
                  <SelectItem value="lon1">London 1</SelectItem>
                  <SelectItem value="sgp1">Singapore 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your credentials are stored locally and used only for API communication with DigitalOcean.
                For production use, consider using environment variables or secure storage.
              </AlertDescription>
            </Alert>

            <Button onClick={configureService} className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure DigitalOcean Integration
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">DigitalOcean Infrastructure</h2>
          <p className="text-therapy-600 mt-1">Manage your cloud infrastructure and backup systems</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={testDisasterRecovery} variant="outline" disabled={loading}>
            <Zap className="h-4 w-4 mr-2" />
            Test DR
          </Button>
          <Button onClick={loadData} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Resource Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New Resource
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-type">Resource Type</Label>
              <Select value={newResource.type} onValueChange={(value) => setNewResource({...newResource, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="droplet">Droplet</SelectItem>
                  <SelectItem value="space">Space</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-name">Name</Label>
              <Input
                id="resource-name"
                value={newResource.name}
                onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                placeholder="Resource name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-region">Region</Label>
              <Select value={newResource.region} onValueChange={(value) => setNewResource({...newResource, region: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nyc3">New York 3</SelectItem>
                  <SelectItem value="sfo3">San Francisco 3</SelectItem>
                  <SelectItem value="fra1">Frankfurt 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-size">Size</Label>
              <Select value={newResource.size} onValueChange={(value) => setNewResource({...newResource, size: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="s-1vcpu-1gb">1 vCPU, 1GB RAM</SelectItem>
                  <SelectItem value="s-2vcpu-2gb">2 vCPU, 2GB RAM</SelectItem>
                  <SelectItem value="s-4vcpu-8gb">4 vCPU, 8GB RAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={createResource} disabled={!newResource.name || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Create {newResource.type}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compute">Compute</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="databases">Databases</TabsTrigger>
          <TabsTrigger value="backups">Cross-Cloud Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Droplets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{droplets.length}</div>
                <p className="text-xs text-muted-foreground">
                  {droplets.filter(d => d.status === 'active').length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{spaces.length}</div>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(spaces.reduce((sum, s) => sum + s.sizeBytes, 0))} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Databases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{databases.length}</div>
                <p className="text-xs text-muted-foreground">
                  {databases.filter(d => d.status === 'online').length} online
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cross-Cloud Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{crossCloudBackups.length}</div>
                <p className="text-xs text-muted-foreground">
                  {crossCloudBackups.filter(b => b.status === 'completed').length} successful
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compute">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Droplets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {droplets.map((droplet) => (
                  <div key={droplet.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{droplet.name}</h4>
                          <Badge className={getStatusColor(droplet.status)}>
                            {droplet.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">IP Address</p>
                            <p className="font-medium">{droplet.ip || 'Pending'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Region</p>
                            <p className="font-medium">{droplet.region}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{droplet.size}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                              {new Date(droplet.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteDroplet(droplet.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {droplets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No droplets found. Create your first droplet above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Spaces (Object Storage)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spaces.map((space) => (
                  <div key={space.name} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{space.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Region</p>
                            <p className="font-medium">{space.region}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{formatBytes(space.sizeBytes)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Access</p>
                            <Badge className={space.isPublic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                              {space.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {spaces.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No spaces found. Create your first space above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="databases">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Managed Databases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {databases.map((database) => (
                  <div key={database.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{database.name}</h4>
                          <Badge className={getStatusColor(database.status)}>
                            {database.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Engine</p>
                            <p className="font-medium">{database.engine} {database.version}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Region</p>
                            <p className="font-medium">{database.region}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{database.size}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Connection</p>
                            <p className="font-medium">{database.connection.host}:{database.connection.port}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {databases.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No databases found. Create your first database above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="h-5 w-5 mr-2" />
                Cross-Cloud Backup System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossCloudBackups.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">Backup {backup.id.slice(0, 8)}</h4>
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                              {new Date(backup.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total Size</p>
                            <p className="font-medium">{formatBytes(backup.totalSize)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Destinations</p>
                            <p className="font-medium">{backup.destinations.length} locations</p>
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Verification Results:</p>
                          <div className="flex flex-wrap gap-1">
                            {backup.verificationResults.map((result, index) => (
                              <Badge 
                                key={index}
                                className={result.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {result.verified ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                                {result.destination}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {crossCloudBackups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No cross-cloud backups found. Create backups through the backup system.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalOceanDashboard;
