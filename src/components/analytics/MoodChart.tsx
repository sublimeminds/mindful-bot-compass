
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";
import { AnalyticsData } from "@/services/analyticsService";
import { MoodEntry } from "@/services/moodTrackingService";

interface MoodChartProps {
  moodTrends: AnalyticsData['moodTrends'];
  moodEntries: MoodEntry[];
}

const MoodChart = ({ moodTrends, moodEntries }: MoodChartProps) => {
  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'declining':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Prepare chart data from recent mood entries
  const chartData = moodEntries.slice(-14).map((entry, index) => ({
    day: `Day ${index + 1}`,
    mood: entry.overall,
    anxiety: 10 - entry.anxiety, // Invert anxiety so higher is better
    energy: entry.energy,
    date: entry.timestamp.toLocaleDateString()
  }));

  if (moodEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Mood Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No mood data yet. Start tracking your mood to see trends.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Mood Trends
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Last 14 days mood tracking
          </p>
          <Badge className={getTrendColor(moodTrends.overallTrend)}>
            {getTrendIcon(moodTrends.overallTrend)}
            <span className="ml-1 capitalize">{moodTrends.overallTrend}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{moodTrends.averageMood.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Average Mood</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">
                {moodTrends.recentChange > 0 ? '+' : ''}{moodTrends.recentChange.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Recent Change</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{moodTrends.moodVariability.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Variability</p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">{data.date}</p>
                            <div className="space-y-1 mt-2">
                              <p className="text-sm">
                                <span className="text-blue-600">Overall: {data.mood}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-green-600">Energy: {data.energy}</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-purple-600">Calm: {data.anxiety}</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
