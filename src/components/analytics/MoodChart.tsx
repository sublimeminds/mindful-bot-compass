
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain } from "lucide-react";
import { AnalyticsData } from "@/services/analyticsService";

interface MoodEntry {
  id: string;
  user_id: string;
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  created_at: string;
  timestamp: string;
}

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

  const chartData = moodEntries.slice(0, 14).reverse().map((entry, index) => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    mood: entry.overall,
    energy: entry.energy || 5,
    index
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Mood Trends
          </CardTitle>
          <Badge className={getTrendColor(moodTrends.overallTrend)}>
            {getTrendIcon(moodTrends.overallTrend)}
            <span className="ml-1 capitalize">{moodTrends.overallTrend}</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Average mood: {moodTrends.averageMood}/10
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 10]} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="hsl(var(--therapy-500))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--therapy-500))', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="hsl(var(--calm-500))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--calm-500))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
