
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  Download,
  Filter,
  CalendarIcon,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import RealTimeMetrics from './RealTimeMetrics';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import NotificationAnalytics from './NotificationAnalytics';
import TherapistAnalytics from './TherapistAnalytics';
import BusinessAnalytics from './BusinessAnalytics';
import CustomReportBuilder from './CustomReportBuilder';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

const AdvancedAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: 12.5,
      trend: 'up',
      icon: <Users className="h-4 w-4" />
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: 8.2,
      trend: 'up',
      icon: <Activity className="h-4 w-4" />
    },
    {
      title: 'Avg Session Duration',
      value: '24m 35s',
      change: -2.1,
      trend: 'down',
      icon: <Clock className="h-4 w-4" />
    },
    {
      title: 'Goal Completion Rate',
      value: '87.3%',
      change: 5.7,
      trend: 'up',
      icon: <Target className="h-4 w-4" />
    }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const exportData = (format: 'csv' | 'pdf') => {
    // Implementation would export current dashboard data
    console.log(`Exporting data as ${format}...`);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'stable') return 'text-gray-400';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Advanced Analytics</h1>
            <p className="text-gray-400">Comprehensive insights and performance metrics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-auto">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">To</label>
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Export Options */}
          <Select onValueChange={(value: 'csv' | 'pdf') => exportData(value)}>
            <SelectTrigger className="w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">Export as CSV</SelectItem>
              <SelectItem value="pdf">Export as PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}</span>
        </div>
        <Badge variant="outline" className="text-green-400">
          Live Data
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/10 rounded">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${getTrendColor(metric.trend, metric.change)}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800">
          <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
            Real-time
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            User Behavior
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="therapists" className="data-[state=active]:bg-blue-600">
            Therapists
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-blue-600">
            Business
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <RealTimeMetrics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="users">
          <UserBehaviorAnalytics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationAnalytics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="therapists">
          <TherapistAnalytics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="business">
          <BusinessAnalytics dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="reports">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
