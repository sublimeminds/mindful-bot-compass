
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Network, 
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { digitalOceanService } from '@/services/digitalOceanService';

const AdminDigitalOceanDashboard = () => {
  const [droplets, setDroplets] = useState([]);
  const [loadBalancers, setLoadBalancers] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dropletsData, loadBalancersData, databasesData] = await Promise.all([
        digitalOceanService.listDroplets(),
        digitalOceanService.listLoadBalancers(),
        digitalOceanService.listDatabases()
      ]);
      
      setDroplets(dropletsData);
      setLoadBalancers(loadBalancersData);
      setDatabases(databasesData);
    } catch (error) {
      console.error('Failed to load DigitalOcean data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'off':
        return 'bg-red-100 text-red-800';
      case 'new':
      case 'creating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">DigitalOcean Infrastructure</h2>
          <p className="text-gray-400 mt-1">Manage your cloud resources and infrastructure</p>
        </div>
        <Button onClick={loadData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Server className="h-4 w-4 mr-2 text-blue-600" />
              Droplets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{droplets.length}</div>
            <p className="text-xs text-gray-400">
              {droplets.filter(d => d.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Network className="h-4 w-4 mr-2 text-purple-600" />
              Load Balancers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{loadBalancers.length}</div>
            <p className="text-xs text-gray-400">
              {loadBalancers.filter(lb => lb.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Database className="h-4 w-4 mr-2 text-green-600" />
              Databases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{databases.length}</div>
            <p className="text-xs text-gray-400">
              {databases.filter(db => db.status === 'online').length} online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Droplets List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Droplets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {droplets.map((droplet) => (
              <div key={droplet.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-white">{droplet.name}</h4>
                    <Badge className={getStatusColor(droplet.status)}>
                      {droplet.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {droplet.status === 'off' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {droplet.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    IP: {droplet.ip} • Region: {droplet.region} • Size: {droplet.size}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" className="text-white border-gray-600">
                    <Activity className="h-4 w-4 mr-1" />
                    Monitor
                  </Button>
                </div>
              </div>
            ))}

            {droplets.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No droplets found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Load Balancers */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Network className="h-5 w-5 mr-2" />
            Load Balancers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loadBalancers.map((lb) => (
              <div key={lb.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-white">{lb.name}</h4>
                    <Badge className={getStatusColor(lb.status)}>
                      {lb.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {lb.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    IP: {lb.ip} • Droplets: {lb.droplet_ids.length}
                  </div>
                </div>
              </div>
            ))}

            {loadBalancers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No load balancers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Databases */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Databases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {databases.map((db) => (
              <div key={db.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-white">{db.name}</h4>
                    <Badge className={getStatusColor(db.status)}>
                      {db.status === 'online' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {db.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    Engine: {db.engine} • Size: {db.size} • Region: {db.region}
                  </div>
                </div>
              </div>
            ))}

            {databases.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No databases found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDigitalOceanDashboard;
