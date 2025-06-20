
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const MoodTrackerWidget = () => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todayMood } = useQuery({
    queryKey: ['today-mood', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('overall')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching today mood:', error);
        return null;
      }

      return data?.overall || null;
    },
    enabled: !!user?.id,
  });

  const logMoodMutation = useMutation({
    mutationFn: async (mood: number) => {
      if (!user?.id) throw new Error('User not authenticated');

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-mood', user?.id] });
      toast({
        title: "Mood Logged",
        description: "Your mood has been recorded successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
      console.error('Error logging mood:', error);
    },
  });

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const handleQuickMoodLog = (mood: number) => {
    logMoodMutation.mutate(mood);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-therapy-600" />
          Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayMood ? (
          <div className="text-center p-4 bg-therapy-50 rounded-lg">
            <div className="text-3xl mb-2">{moodEmojis[todayMood - 1]}</div>
            <div className="text-sm font-medium text-therapy-700">
              Today: {moodLabels[todayMood - 1]}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Logged successfully!
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
                  disabled={logMoodMutation.isPending}
                  className="text-2xl hover:bg-therapy-50 hover:scale-110 transition-all"
                  title={moodLabels[index]}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/mood-tracking')}
            className="w-full"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Mood Trends
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mood-tracking')}
            className="w-full text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Detailed Mood Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTrackerWidget;
