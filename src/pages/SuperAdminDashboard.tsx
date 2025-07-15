import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSuperAdmin } from '@/contexts/SuperAdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Activity, 
  Database, 
  Brain, 
  Globe, 
  AlertTriangle,
  Settings,
  FileText,
  LogOut,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const SuperAdminDashboard = () => {
  const { admin, logout, hasPermission, secureUrlPrefix } = useSuperAdmin();

  if (!admin || !secureUrlPrefix) {
    return <Navigate to={`/${secureUrlPrefix}/login`} replace />;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const adminModules = [
    {
      title: 'User Management',
      description: 'Manage platform users, roles, and access',
      icon: Users,
      permission: 'user_management',
      path: 'users',
      color: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    },
    {
      title: 'AI Management',
      description: 'Configure AI models, routing, and performance',
      icon: Brain,
      permission: 'ai_management',
      path: 'ai',
      color: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
    },
    {
      title: 'Content Management',
      description: 'Manage therapeutic content and resources',
      icon: FileText,
      permission: 'content_management',
      path: 'content',
      color: 'bg-green-500/10 border-green-500/20 text-green-400'
    },
    {
      title: 'Translation System',
      description: 'Manage multilingual content and translations',
      icon: Globe,
      permission: 'translation_management',
      path: 'translations',
      color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
    },
    {
      title: 'Platform Analytics',
      description: 'View system metrics and usage analytics',
      icon: Activity,
      permission: 'platform_analytics',
      path: 'analytics',
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
    },
    {
      title: 'Crisis Management',
      description: 'Monitor and manage crisis interventions',
      icon: AlertTriangle,
      permission: 'crisis_management',
      path: 'crisis',
      color: 'bg-red-500/10 border-red-500/20 text-red-400'
    },
    {
      title: 'System Configuration',
      description: 'Configure system settings and parameters',
      icon: Settings,
      permission: 'system_config',
      path: 'system',
      color: 'bg-gray-500/10 border-gray-500/20 text-gray-400'
    },
    {
      title: 'Security & Audit',
      description: 'View audit logs and security monitoring',
      icon: Shield,
      permission: 'security_management',
      path: 'security',
      color: 'bg-orange-500/10 border-orange-500/20 text-orange-400'
    }
  ];

  const availableModules = adminModules.filter(module => hasPermission(module.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">Super Admin Portal</h1>
                <p className="text-sm text-slate-400">Secure Administrative Interface</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-200">{admin.username}</p>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                  {admin.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-100">1,247</p>
                  <p className="text-sm text-slate-400">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Activity className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-100">98.7%</p>
                  <p className="text-sm text-slate-400">System Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-100">3.2k</p>
                  <p className="text-sm text-slate-400">AI Sessions Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-100">2</p>
                  <p className="text-sm text-slate-400">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <div>
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Administrative Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableModules.map((module) => {
              const Icon = module.icon;
              return (
                <Card
                  key={module.path}
                  className={`${module.color} border cursor-pointer hover:scale-105 transition-all duration-200 bg-slate-800/30 backdrop-blur-sm`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6" />
                      <Eye className="h-4 w-4 opacity-60" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-100">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-slate-400">
                      {module.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <span className="text-slate-300">Database</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <span className="text-slate-300">AI Services</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30">
                  <span className="text-slate-300">CDN</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Degraded
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;