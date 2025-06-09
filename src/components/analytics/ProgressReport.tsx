
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subMonths } from 'date-fns';

interface ProgressReportProps {
  timeRange: string;
}

interface WeeklyData {
  week: string;
  sessions: number;
  messages: number;
  avgImprovement: number;
}

const ProgressReport = ({ timeRange }: ProgressReportProps) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const now = new Date();
        const startDate = subMonths(now, timeRange === 'year' ? 12 : timeRange === 'quarter' ? 3 : 1);
        
        const { data: sessions, error } = await supabase
          .from('therapy_sessions')
          .select(`
            start_time,
            mood_before,
            mood_after,
            session_messages(*)
          `)
          .eq('user_id', user.id)
          .not('end_time', 'is', null)
          .gte('start_time', startDate.toISOString())
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching progress data:', error);
          return;
        }

        // Group sessions by week
        const weeks = eachWeekOfInterval({ start: startDate, end: now });
        const weeklyStats: WeeklyData[] = weeks.map(weekStart => {
          const weekEnd = endOfWeek(weekStart);
          const weekSessions = sessions?.filter(session => {
            const sessionDate = new Date(session.start_time);
            return sessionDate >= weekStart && sessionDate <= weekEnd;
          }) || [];

          const totalMessages = weekSessions.reduce((sum, session) => 
            sum + (session.session_messages?.length || 0), 0);

          const improvements = weekSessions
            .filter(s => s.mood_before && s.mood_after)
            .map(s => s.mood_after - s.mood_before);
          
          const avgImprovement = improvements.length > 0
            ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length
            : 0;

          return {
            week: format(weekStart, 'MMM dd'),
            sessions: weekSessions.length,
            messages: totalMessages,
            avgImprovement: Number(avgImprovement.toFixed(1))
          };
        });

        setWeeklyData(weeklyStats);
      } catch (error) {
        console.error('Error processing progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [user, timeRange]);

  const chartConfig = {
    sessions: {
      label: "Sessions",
      color: "hsl(var(--chart-1))",
    },
    messages: {
      label: "Messages",
      color: "hsl(var(--chart-2))",
    },
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading progress data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {weeklyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No activity data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={weeklyData}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressReport;
