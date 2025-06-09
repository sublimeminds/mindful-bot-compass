
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, subWeeks, subMonths, startOfDay } from 'date-fns';

interface MoodChartProps {
  timeRange: string;
}

interface MoodData {
  date: string;
  moodBefore: number;
  moodAfter: number;
  improvement: number;
}

const MoodChart = ({ timeRange }: MoodChartProps) => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subMonths(now, 1);
      case 'quarter':
        return subMonths(now, 3);
      case 'year':
        return subMonths(now, 12);
      default:
        return subMonths(now, 1);
    }
  };

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const startDate = getDateRange();
        
        const { data: sessions, error } = await supabase
          .from('therapy_sessions')
          .select('start_time, mood_before, mood_after')
          .eq('user_id', user.id)
          .not('end_time', 'is', null)
          .not('mood_before', 'is', null)
          .not('mood_after', 'is', null)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching mood data:', error);
          return;
        }

        const processedData: MoodData[] = sessions?.map(session => ({
          date: format(new Date(session.start_time), 'MMM dd'),
          moodBefore: session.mood_before,
          moodAfter: session.mood_after,
          improvement: session.mood_after - session.mood_before
        })) || [];

        setMoodData(processedData);
      } catch (error) {
        console.error('Error processing mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodData();
  }, [user, timeRange]);

  const chartConfig = {
    moodBefore: {
      label: "Mood Before",
      color: "hsl(var(--chart-1))",
    },
    moodAfter: {
      label: "Mood After",
      color: "hsl(var(--chart-2))",
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading mood data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Mood Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moodData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No mood data available for this period</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={moodData}>
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="moodBefore" 
                stroke="var(--color-moodBefore)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="moodAfter" 
                stroke="var(--color-moodAfter)" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodChart;
