
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MoodData {
  date: string;
  mood: number;
  day: string;
}

const MoodTrendWidget = () => {
  // Mock data for the last 7 days
  const moodData: MoodData[] = [
    { date: '12/15', mood: 6.5, day: 'Mon' },
    { date: '12/16', mood: 7.2, day: 'Tue' },
    { date: '12/17', mood: 6.8, day: 'Wed' },
    { date: '12/18', mood: 8.1, day: 'Thu' },
    { date: '12/19', mood: 7.9, day: 'Fri' },
    { date: '12/20', mood: 8.5, day: 'Sat' },
    { date: '12/21', mood: 8.2, day: 'Sun' }
  ];

  const currentMood = moodData[moodData.length - 1]?.mood || 0;
  const previousMood = moodData[moodData.length - 2]?.mood || 0;
  const trend = currentMood - previousMood;
  const trendPercentage = ((trend / previousMood) * 100).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="text-sm font-medium">{`${label}: ${payload[0].value}/10`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Mood Trend</CardTitle>
          <div className="flex items-center space-x-2">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '+' : ''}{trendPercentage}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentMood}/10</p>
              <p className="text-sm text-muted-foreground">Current mood</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">7.3</p>
              <p className="text-sm text-muted-foreground">7-day avg</p>
            </div>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide domain={[0, 10]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--therapy-500))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--therapy-500))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--therapy-500))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrendWidget;
