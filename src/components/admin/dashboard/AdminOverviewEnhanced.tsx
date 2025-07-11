
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  LayoutDashboard
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import RealTimeMetrics from './RealTimeMetrics';
import QuickActionsGrid from './QuickActionsGrid';
import SystemHealthOverview from './SystemHealthOverview';
import RecentActivityFeed from './RecentActivityFeed';

const AdminOverviewEnhanced = () => {
  const { platformStats, isLoadingStats } = useAdminAnalytics();

  const dashboardStats = [
    {
      title: 'Total Users',
      value: platformStats?.totalUsers?.toLocaleString() || '0',
      change: '+12.5%', // Would calculate from historical data
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Sessions',
      value: platformStats?.totalSessions?.toLocaleString() || '0',
      change: '+8.2%',
      trend: 'up' as const,
      icon: MessageCircle,
      color: 'text-green-400'
    },
    {
      title: 'Crisis Interventions',
      value: platformStats?.crisisInterventions?.toString() || '0',
      change: '-15.3%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-red-400'
    },
    {
      title: 'System Uptime',
      value: `${platformStats?.systemUptime?.toFixed(1) || 99.9}%`,
      change: '+0.1%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-purple-400'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Activity;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <LayoutDashboard className="h-8 w-8 text-blue-400" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-1">
            Overview of platform performance and user activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-400 text-green-400">
            <Activity className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          dashboardStats.map((stat, index) => {
            const TrendIcon = getTrendIcon(stat.trend);
            return (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendIcon className={`h-4 w-4 mr-1 ${getTrendColor(stat.trend)}`} />
                        <span className={`text-sm ${getTrendColor(stat.trend)}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last week</span>
                      </div>
                    </div>
                    <div className={`p-3 bg-gray-900 rounded-lg`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Metrics */}
        <RealTimeMetrics />
        
        {/* Quick Actions */}
        <QuickActionsGrid />
      </div>

      {/* System Health and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health Overview */}
        <SystemHealthOverview />
        
        {/* Recent Activity Feed */}
        <RecentActivityFeed />
      </div>
    </div>
  );
};

export default AdminOverviewEnhanced;
