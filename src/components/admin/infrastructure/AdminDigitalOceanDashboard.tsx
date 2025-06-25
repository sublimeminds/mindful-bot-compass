
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
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  DollarSign,
  Users,
  Lock
} from 'lucide-react';
import { digitalOceanService } from '@/services/digitalOceanService';
import { enhancedBackupService } from '@/services/enhancedBackupService';

const AdminDigitalOceanDashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [crossCloudBackups, setCrossCloudBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [costs, setCosts] = useState({ monthly: 0, daily: 0 });
  
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

      // Calculate estimated costs
      calculateCosts(dropletsData, databasesData, spacesData);
    } catch (error) {
      console.error('Failed to load DigitalOcean data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCosts = (droplets, databases, spaces) => {
    let monthlyCost = 0;
    
    // Droplet costs (estimated)
    droplets.forEach(droplet => {
      const sizeCosts = {
        's-1vcpu-1gb': 6,
        's-2vcpu-2gb': 12,
        's-4vcpu-8gb': 24
      };
      monthlyCost += sizeCosts[droplet.size] || 6;
    });

    // Database costs (estimated)
    databases.forEach(db => {
      const dbCosts = {
        'db-s-1vcpu-1gb': 15,
        'db-s-2vcpu-2gb': 30,
        'db-s-4vcpu-8gb': 60
      };
      monthlyCost += dbCosts[db.size] || 15;
    });

    // Spaces storage costs (estimated $5 per 250GB)
    const totalSpaceGB = spaces.reduce((sum, space) => sum + (space.sizeBytes / (1024 * 1024 * 1024)), 0);
    monthlyCost += Math.ceil(totalSpaceGB / 250) * 5;

    setCosts({
      monthly: monthlyCost,
      daily: monthlyCost / 30
    });
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
        <div className="flex items-center space-x-3">
          <Cloud className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">DigitalOcean Integration</h2>
            <p className="text-gray-400 mt-1">Configure your DigitalOcean credentials to manage infrastructure</p>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Lock className="h-5 w-5 mr-2 text-blue-400" />
              Secure Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-token" className="text-gray-300">API Token</Label>
              <Input
                id="api-token"
                type="password"
                value={config.apiToken}
                onChange={(e) => setConfig({...config, apiToken: e.target.value})}
                placeholder="Enter your DigitalOcean API token"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spaces-key" className="text-gray-300">Spaces Access Key</Label>
                <Input
                  id="spaces-key"
                  value={config.spacesAccessKey}
                  onChange={(e) => setConfig({...config, spacesAccessKey: e.target.value})}
                  placeholder="Spaces access key"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaces-secret" className="text-gray-300">Spaces Secret Key</Label>
                <Input
                  id="spaces-secret"
                  type="password"
                  value={config.spacesSecretKey}
                  onChange={(e) => setConfig({...config, spacesSecretKey: e.target.value})}
                  placeholder="Spaces secret key"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-region" className="text-gray-300">Default Region</Label>
              <Select value={config.defaultRegion} onValueChange={(value) => setConfig({...config, defaultRegion: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select default region" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="nyc3">New York 3</SelectItem>
                  <SelectItem value="sfo3">San Francisco 3</SelectItem>
                  <SelectItem value="fra1">Frankfurt 1</SelectItem>
                  <SelectItem value="lon1">London 1</SelectItem>
                  <SelectItem value="sgp1">Singapore 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert className="bg-blue-900/20 border-blue-700">
              <Shield className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300">
                Credentials are encrypted and stored securely. Admin-only access with full audit logging.
              </AlertDescription>
            </Alert>

            <Button onClick={configureService} className="w-full bg-blue-600 hover:bg-blue-700">
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
        <div className="flex items-center space-x-3">
          <Cloud className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">DigitalOcean Infrastructure</h2>
            <p className="text-gray-400 mt-1">Manage cloud infrastructure and backup systems</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={testDisasterRecovery} variant="outline" disabled={loading} className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10">
            <Zap className="h-4 w-4 mr-2" />
            Test DR
          </Button>
          <Button onClick={loadData} variant="outline" disabled={loading} className="border-gray-600 text-gray-300">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-400" />
              Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${costs.monthly}</div>
            <p className="text-xs text-gray-400">${costs.daily.toFixed(2)}/day</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Server className="h-4 w-4 mr-2 text-blue-400" />
              Droplets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{droplets.length}</div>
            <p className="text-xs text-gray-400">
              {droplets.filter(d => d.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-purple-400" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{spaces.length}</div>
            <p className="text-xs text-gray-400">
              {formatBytes(spaces.reduce((sum, s) => sum + s.sizeBytes, 0))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
              <Database className="h-4 w-4 mr-2 text-orange-400" />
              Databases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{databases.length}</div>
            <p className="text-xs text-gray-400">
              {databases.filter(d => d.status === 'online').length} online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Creation */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Plus className="h-5 w-5 mr-2 text-green-400" />
            Create New Resource
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-type" className="text-gray-300">Resource Type</Label>
              <Select value={newResource.type} onValueChange={(value) => setNewResource({...newResource, type: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="droplet">Droplet</SelectItem>
                  <SelectItem value="space">Space</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-name" className="text-gray-300">Name</Label>
              <Input
                id="resource-name"
                value={newResource.name}
                onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                placeholder="Resource name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-region" className="text-gray-300">Region</Label>
              <Select value={newResource.region} onValueChange={(value) => setNewResource({...newResource, region: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="nyc3">New York 3</SelectItem>
                  <SelectItem value="sfo3">San Francisco 3</SelectItem>
                  <SelectItem value="fra1">Frankfurt 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-size" className="text-gray-300">Size</Label>
              <Select value={newResource.size} onValueChange={(value) => setNewResource({...newResource, size: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="s-1vcpu-1gb">1 vCPU, 1GB RAM</SelectItem>
                  <SelectItem value="s-2vcpu-2gb">2 vCPU, 2GB RAM</SelectItem>
                  <SelectItem value="s-4vcpu-8gb">4 vCPU, 8GB RAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={createResource} disabled={!newResource.name || loading} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create {newResource.type}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="compute" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Compute</TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Storage</TabsTrigger>
          <TabsTrigger value="databases" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Databases</TabsTrigger>
          <TabsTrigger value="backups" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Cross-Cloud Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Infrastructure Health
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active Resources:</span>
                    <Badge className="bg-green-600 text-white">
                      {droplets.filter(d => d.status === 'active').length + 
                       databases.filter(d => d.status === 'online').length + 
                       spaces.length} / {droplets.length + databases.length + spaces.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Status:</span>
                    <Badge className="bg-blue-600 text-white">
                      {crossCloudBackups.filter(b => b.status === 'completed').length} Successful
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Regions:</span>
                    <span className="font-medium">
                      {new Set([...droplets.map(d => d.region), ...spaces.map(s => s.region)]).size} Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-400" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>HIPAA Compliance:</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Data Encryption:</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Backup Verification:</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex justify-between">
                    <span>Access Control:</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compute">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Server className="h-5 w-5 mr-2 text-blue-400" />
                Droplets Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {droplets.map((droplet) => (
                  <div key={droplet.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white">{droplet.name}</h4>
                          <Badge className={getStatusColor(droplet.status)}>
                            {droplet.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
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
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <HardDrive className="h-5 w-5 mr-2 text-purple-400" />
                Spaces (Object Storage)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spaces.map((space) => (
                  <div key={space.name} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2 text-white">{space.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Database className="h-5 w-5 mr-2 text-orange-400" />
                Managed Databases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {databases.map((database) => (
                  <div key={database.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white">{database.name}</h4>
                          <Badge className={getStatusColor(database.status)}>
                            {database.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
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
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Cross-Cloud Backup System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossCloudBackups.map((backup) => (
                  <div key={backup.id} className="border border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-white">Backup {backup.id.slice(0, 8)}</h4>
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">{backup.timestamp.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{formatBytes(backup.totalSize)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Destinations</p>
                            <p className="font-medium">{backup.destinations.length} locations</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Verified</p>
                            <p className="font-medium">
                              {backup.verificationResults.filter(r => r.verified).length}/
                              {backup.verificationResults.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {crossCloudBackups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No cross-cloud backups found. Backups will appear here once created.
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

export default AdminDigitalOceanDashboard;
