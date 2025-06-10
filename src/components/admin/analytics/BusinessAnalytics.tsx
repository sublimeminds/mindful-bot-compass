
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  CreditCard,
  UserPlus,
  UserMinus,
  Target
} from 'lucide-react';

interface BusinessAnalyticsProps {
  dateRange: { from: Date; to: Date };
}

const BusinessAnalytics = ({ dateRange }: BusinessAnalyticsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'retention' | 'forecasting'>('revenue');

  const revenueMetrics = {
    totalRevenue: 145780,
    monthlyGrowth: 12.5,
    arr: 1749360,
    ltv: 489.50,
    cac: 67.30,
    churnRate: 3.2
  };

  const revenueData = [
    { month: 'Jan', revenue: 98420, subscriptions: 1247, churn: 2.8 },
    { month: 'Feb', revenue: 105680, subscriptions: 1334, churn: 3.1 },
    { month: 'Mar', revenue: 112340, subscriptions: 1423, churn: 2.9 },
    { month: 'Apr', revenue: 118790, subscriptions: 1502, churn: 3.4 },
    { month: 'May', revenue: 125450, subscriptions: 1587, churn: 3.0 },
    { month: 'Jun', revenue: 132860, subscriptions: 1678, churn: 2.7 },
    { month: 'Jul', revenue: 140230, subscriptions: 1769, churn: 3.2 },
    { month: 'Aug', revenue: 145780, subscriptions: 1847, churn: 3.1 },
  ];

  const subscriptionTiers = [
    { plan: 'Basic', users: 1247, revenue: 37410, color: '#3B82F6' },
    { plan: 'Premium', users: 523, revenue: 52300, color: '#10B981' },
    { plan: 'Pro', users: 189, revenue: 56700, color: '#8B5CF6' },
  ];

  const cohortData = [
    { cohort: 'Jan 2024', month0: 100, month1: 85, month2: 76, month3: 68, month4: 62, month5: 58 },
    { cohort: 'Feb 2024', month0: 100, month1: 87, month2: 78, month3: 70, month4: 64, month5: 0 },
    { cohort: 'Mar 2024', month0: 100, month1: 89, month2: 80, month3: 72, month4: 0, month5: 0 },
    { cohort: 'Apr 2024', month0: 100, month1: 91, month2: 82, month3: 0, month4: 0, month5: 0 },
    { cohort: 'May 2024', month0: 100, month1: 88, month2: 0, month3: 0, month4: 0, month5: 0 },
    { cohort: 'Jun 2024', month0: 100, month1: 0, month2: 0, month3: 0, month4: 0, month5: 0 },
  ];

  const forecastData = [
    { month: 'Sep', actual: 145780, forecast: 152000, optimistic: 158000, pessimistic: 148000 },
    { month: 'Oct', actual: null, forecast: 159000, optimistic: 167000, pessimistic: 154000 },
    { month: 'Nov', actual: null, forecast: 166000, optimistic: 176000, pessimistic: 160000 },
    { month: 'Dec', actual: null, forecast: 173000, optimistic: 185000, pessimistic: 167000 },
  ];

  const userAcquisitionData = [
    { channel: 'Organic Search', users: 456, cost: 12340, cac: 27.06 },
    { channel: 'Social Media', users: 287, cost: 15680, cac: 54.63 },
    { channel: 'Referrals', users: 198, cost: 3450, cac: 17.42 },
    { channel: 'Email Marketing', users: 123, cost: 2890, cac: 23.50 },
    { channel: 'Paid Ads', users: 89, cost: 8920, cac: 100.22 },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selection */}
      <div className="flex space-x-4">
        <Button
          variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('revenue')}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Revenue
        </Button>
        <Button
          variant={selectedMetric === 'users' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('users')}
        >
          <Users className="h-4 w-4 mr-2" />
          Users
        </Button>
        <Button
          variant={selectedMetric === 'retention' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('retention')}
        >
          <Target className="h-4 w-4 mr-2" />
          Retention
        </Button>
        <Button
          variant={selectedMetric === 'forecasting' ? 'default' : 'outline'}
          onClick={() => setSelectedMetric('forecasting')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Forecasting
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${revenueMetrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">
                +{revenueMetrics.monthlyGrowth}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ARR</p>
                <p className="text-2xl font-bold text-white">
                  ${(revenueMetrics.arr / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-blue-400">
                Annual Recurring Revenue
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">LTV / CAC</p>
                <p className="text-2xl font-bold text-white">
                  {(revenueMetrics.ltv / revenueMetrics.cac).toFixed(1)}:1
                </p>
              </div>
              <Target className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">
                Healthy Ratio
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Churn Rate</p>
                <p className="text-2xl font-bold text-white">
                  {revenueMetrics.churnRate}%
                </p>
              </div>
              <UserMinus className="h-5 w-5 text-red-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-green-400">
                Below Target
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMetric === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Tiers */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionTiers.map((tier, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{tier.plan}</span>
                      <div className="text-right">
                        <div className="text-white">${tier.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{tier.users} users</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(tier.revenue / 146410) * 100}%`,
                          backgroundColor: tier.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Acquisition */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Acquisition by Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userAcquisitionData.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{channel.channel}</h4>
                      <p className="text-sm text-gray-400">{channel.users} users</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white">${channel.cac.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">CAC</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Growth */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subscriptions" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Active Subscriptions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'retention' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cohort Retention Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-xs text-gray-400">
                <div>Cohort</div>
                <div className="text-center">Month 0</div>
                <div className="text-center">Month 1</div>
                <div className="text-center">Month 2</div>
                <div className="text-center">Month 3</div>
                <div className="text-center">Month 4</div>
                <div className="text-center">Month 5</div>
              </div>
              
              {cohortData.map((cohort, index) => (
                <div key={index} className="grid grid-cols-7 gap-2 text-sm">
                  <div className="text-white font-medium">{cohort.cohort}</div>
                  <div className="text-center py-1 bg-green-500 text-white rounded">
                    {cohort.month0}%
                  </div>
                  <div 
                    className={`text-center py-1 rounded ${
                      cohort.month1 > 0 
                        ? `bg-opacity-${Math.floor(cohort.month1 / 10) * 10} bg-blue-500 text-white`
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {cohort.month1 > 0 ? `${cohort.month1}%` : '-'}
                  </div>
                  <div 
                    className={`text-center py-1 rounded ${
                      cohort.month2 > 0 
                        ? `bg-opacity-${Math.floor(cohort.month2 / 10) * 10} bg-blue-500 text-white`
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {cohort.month2 > 0 ? `${cohort.month2}%` : '-'}
                  </div>
                  <div 
                    className={`text-center py-1 rounded ${
                      cohort.month3 > 0 
                        ? `bg-opacity-${Math.floor(cohort.month3 / 10) * 10} bg-blue-500 text-white`
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {cohort.month3 > 0 ? `${cohort.month3}%` : '-'}
                  </div>
                  <div 
                    className={`text-center py-1 rounded ${
                      cohort.month4 > 0 
                        ? `bg-opacity-${Math.floor(cohort.month4 / 10) * 10} bg-blue-500 text-white`
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {cohort.month4 > 0 ? `${cohort.month4}%` : '-'}
                  </div>
                  <div 
                    className={`text-center py-1 rounded ${
                      cohort.month5 > 0 
                        ? `bg-opacity-${Math.floor(cohort.month5 / 10) * 10} bg-blue-500 text-white`
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {cohort.month5 > 0 ? `${cohort.month5}%` : '-'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMetric === 'forecasting' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue Forecasting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Actual Revenue"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Forecast"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimistic" 
                    stroke="#8B5CF6" 
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    name="Optimistic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pessimistic" 
                    stroke="#EF4444" 
                    strokeWidth={1}
                    strokeDasharray="2 2"
                    name="Pessimistic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessAnalytics;
