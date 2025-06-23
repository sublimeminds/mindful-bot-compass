
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Activity, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Brain,
  Heart,
  Phone,
  Globe,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';
import RealTimeMetrics from './RealTimeMetrics';
import QuickActionsGrid from './QuickActionsGrid';
import SystemHealthOverview from './SystemHealthOverview';
import RecentActivityFeed from './RecentActivityFeed';

const AdminOverviewEnhanced = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    todaysSessions: 0,
    totalSessions: 0,
    avgSessionDuration: 0,
    completionRate: 0,
    userGrowthRate: 0,
    crisisInterventions: 0,
    aiResponseRate: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'critical',
    revenue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchStats();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      setLastUpdated(new Date());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total sessions
      const { count: sessionsCount } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true });

      // Fetch active users (users with sessions in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: activeSessions } = await supabase
        .from('therapy_sessions')
        .select('user_id')
        .gte('created_at', sevenDaysAgo.toISOString());

      const uniqueActiveUsers = new Set(activeSessions?.map(s => s.user_id)).size;

      // Fetch today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todaysSessionsCount } = await supabase
        .from('therapy_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Fetch crisis interventions
      const { count: crisisCount } = await supabase
        .from('crisis_interventions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      setStats({
        totalUsers: usersCount || 0,
        activeUsers: uniqueActiveUsers,
        todaysSessions: todaysSessionsCount || 0,
        totalSessions: sessionsCount || 0,
        avgSessionDuration: 23, // Mock data
        completionRate: 87, // Mock data
        userGrowthRate: 12.5, // Mock data
        crisisInterventions: crisisCount || 0,
        aiResponseRate: 99.2, // Mock data
        systemHealth: 'healthy',
        revenue: 24750, // Mock data
        conversionRate: 4.8 // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: `+${stats.userGrowthRate}%`,
      trend: 'up' as const,
      description: 'vs last month'
    },
    {
      title: 'Active Users (7d)',
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+8.2%',
      trend: 'up' as const,
      description: 'vs last week'
    },
    {
      title: "Today's Sessions",
      value: stats.todaysSessions.toLocaleString(),
      icon: MessageCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: '+15%',
      trend: 'up' as const,
      description: 'vs yesterday'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions.toLocaleString(),
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      change: '+23%',
      trend: 'up' as const,
      description: 'this month'
    },
    {
      title: 'Avg Session Duration',
      value: `${stats.avgSessionDuration}m`,
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      change: '+2m',
      trend: 'up' as const,
      description: 'vs last week'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      change: '+3%',
      trend: 'up' as const,
      description: 'vs last week'
    },
    {
      title: 'Crisis Interventions',
      value: stats.crisisInterventions.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      change: '0',
      trend: 'neutral' as const,
      description: 'today'
    },
    {
      title: 'AI Response Rate',
      value: `${stats.aiResponseRate}%`,
      icon: Brain,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10',
      change: '+0.1%',
      trend: 'up' as const,
      description: 'system uptime'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      change: '+18%',
      trend: 'up' as const,
      description: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10',
      change: '+0.3%',
      trend: 'up' as const,
      description: 'trial to paid'
    }
  ];

  const systemStatus = {
    overall: 'healthy' as const,
    api: 'healthy' as const,
    database: 'healthy' as const,
    ai: 'healthy' as const,
    integrations: 'warning' as const
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <LayoutDashboard className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Monitor and manage your therapy platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button onClick={fetchStats} variant="outline" size="sm" className="border-gray-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* System Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(systemStatus).map(([system, status]) => {
              const StatusIcon = getStatusIcon(status);
              return (
                <div key={system} className="flex items-center space-x-2">
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(status)}`} />
                  <span className="text-sm text-gray-300 capitalize">{system}</span>
                  <Badge 
                    variant={status === 'healthy' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm font-medium">{kpi.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? '...' : kpi.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs font-medium ${
                      kpi.trend === 'up' ? 'text-green-400' : 
                      kpi.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{kpi.description}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RealTimeMetrics />
          <SystemHealthOverview />
        </div>
        <div className="space-y-6">
          <QuickActionsGrid />
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewEnhanced;
