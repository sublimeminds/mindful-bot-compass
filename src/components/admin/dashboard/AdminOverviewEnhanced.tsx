
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
import RealTimeMetrics from './RealTimeMetrics';
import QuickActionsGrid from './QuickActionsGrid';
import SystemHealthOverview from './SystemHealthOverview';
import RecentActivityFeed from './RecentActivityFeed';

const AdminOverviewEnhanced = () => {
  const dashboardStats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-therapy-600'
    },
    {
      title: 'Active Sessions',
      value: '1,423',
      change: '+8.2%',
      trend: 'up' as const,
      icon: MessageCircle,
      color: 'text-harmony-600'
    },
    {
      title: 'Crisis Interventions',
      value: '23',
      change: '-15.3%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-balance-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-flow-600'
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
        return 'text-flow-600';
      case 'down':
        return 'text-balance-600';
      default:
        return 'text-therapy-600';
    }
  };

  return (
    <div className="space-y-6 therapy-gradient-bg min-h-screen p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient-animated flex items-center space-x-3">
            <LayoutDashboard className="h-8 w-8 text-therapy-600" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-therapy-600 mt-1">
            Overview of platform performance and user activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-flow-400 text-flow-600 bg-flow-50">
            <Activity className="h-3 w-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
        {dashboardStats.map((stat, index) => {
          const TrendIcon = getTrendIcon(stat.trend);
          return (
            <Card key={index} className="therapy-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-therapy-600">{stat.title}</p>
                    <p className="text-2xl font-bold therapy-text-gradient">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendIcon className={`h-4 w-4 mr-1 ${getTrendColor(stat.trend)}`} />
                      <span className={`text-sm ${getTrendColor(stat.trend)}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-therapy-500 ml-1">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-3 bg-therapy-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
