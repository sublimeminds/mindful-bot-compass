
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Calendar, Plus, Brain, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek } from 'date-fns';

const EnhancedMoodWidget = () => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();
  const { toast } = useToast();

  // Get today's mood
  const { data: todayMood } = useQuery({
    queryKey: ['today-mood', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data } = await supabase
        .from('mood_entries')
        .select('overall, anxiety, energy, activities')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return data;
    },
    enabled: !!user?.id,
  });

  // Get week's mood trend
  const { data: weekTrend } = useQuery({
    queryKey: ['week-mood-trend', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());

      const { data } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString())
        .order('created_at', { ascending: true });

      return data || [];
    },
    enabled: !!user?.id,
  });

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const handleQuickMoodLog = async (mood: number) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          overall: mood,
          anxiety: mood,
          depression: mood,
          stress: mood,
          energy: mood
        });

      if (error) throw error;

      toast({
        title: "Mood Logged",
        description: "Your mood has been recorded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  const averageWeekMood = weekTrend && weekTrend.length > 0 
    ? weekTrend.reduce((sum, entry) => sum + entry.overall, 0) / weekTrend.length
    : 0;

  const moodTrend = weekTrend && weekTrend.length >= 2 
    ? weekTrend[weekTrend.length - 1].overall - weekTrend[0].overall
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-therapy-600" />
            Mood Tracker
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-tracking')}
            className="text-therapy-600 hover:text-therapy-700"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Mood */}
        {todayMood ? (
          <div className="text-center p-4 bg-therapy-50 rounded-lg">
            <div className="text-3xl mb-2">{moodEmojis[todayMood.overall - 1]}</div>
            <div className="text-sm font-medium text-therapy-700">
              Today: {moodLabels[todayMood.overall - 1]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Energy: {todayMood.energy}/10 • Anxiety: {todayMood.anxiety}/10
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
            <div className="flex justify-between">
              {moodEmojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickMoodLog(index + 1)}
                  className="text-2xl hover:bg-therapy-50 hover:scale-110 transition-all"
                  title={moodLabels[index]}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Week Summary */}
        {weekTrend && weekTrend.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>This Week's Average</span>
              <span className="font-medium">{averageWeekMood.toFixed(1)}/10</span>
            </div>
            <Progress value={averageWeekMood * 10} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Trend: {moodTrend > 0 ? '↗️ Improving' : moodTrend < 0 ? '↘️ Declining' : '➡️ Stable'}</span>
              <span>{weekTrend.length} entries</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/mood-tracking')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Detailed Mood Entry
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-tracking')}
            className="w-full text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Patterns & Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMoodWidget;
