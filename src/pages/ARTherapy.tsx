import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Glasses, MapPin, Target, Play, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ARTherapy = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [environments] = useState([
    { id: 'beach', name: 'Calm Beach', description: 'Peaceful ocean waves for relaxation' },
    { id: 'forest', name: 'Forest Sanctuary', description: 'Tranquil woodland for grounding' },
    { id: 'mountain', name: 'Mountain Peak', description: 'Inspiring heights for confidence' },
    { id: 'garden', name: 'Zen Garden', description: 'Meditative space for mindfulness' }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ar_therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching AR sessions:', error);
    }
  };

  const startARSession = async (environmentId) => {
    if (!user) return;
    
    try {
      const sessionData = {
        user_id: user.id,
        environment_id: environmentId,
        session_data: {
          environment_settings: {
            lighting: 'soft',
            ambience: 'natural',
            interactivity: 'guided'
          },
          user_preferences: {
            comfort_level: 'medium',
            interaction_pace: 'slow'
          }
        },
        interactions: [],
        biometric_data: [],
        therapeutic_goals: ['stress_reduction', 'emotional_regulation'],
        start_time: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('ar_therapy_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      
      setActiveSession(data);
      toast({
        title: "AR Session Started",
        description: `Immersive therapy in ${environments.find(e => e.id === environmentId)?.name}`,
      });

      // Simulate interactions and biometric updates
      simulateARSession(data.id);

    } catch (error) {
      console.error('Error starting AR session:', error);
      toast({
        title: "Session Error",
        description: "Failed to start AR therapy session",
        variant: "destructive"
      });
    }
  };

  const simulateARSession = (sessionId) => {
    let interactionCount = 0;
    const maxInteractions = 5;
    
    const interval = setInterval(async () => {
      if (interactionCount >= maxInteractions) {
        clearInterval(interval);
        await endARSession(sessionId);
        return;
      }

      // Simulate user interactions and biometric data
      const interactions = [
        { type: 'gaze_tracking', data: { focus_duration: Math.random() * 10 } },
        { type: 'hand_gesture', data: { gesture: 'point', confidence: Math.random() } },
        { type: 'voice_command', data: { command: 'continue', volume: Math.random() } }
      ];

      const biometricData = {
        heart_rate: 70 + Math.random() * 20,
        stress_level: Math.random() * 100,
        engagement: 60 + Math.random() * 40,
        timestamp: new Date().toISOString()
      };

      try {
        // Get current session data and append new data
        const { data: currentSession } = await supabase
          .from('ar_therapy_sessions')
          .select('interactions, biometric_data')
          .eq('id', sessionId)
          .single();

        const currentInteractions = Array.isArray(currentSession?.interactions) ? currentSession.interactions : [];
        const currentBiometricData = Array.isArray(currentSession?.biometric_data) ? currentSession.biometric_data : [];
        
        const updatedInteractions = [...currentInteractions, interactions[interactionCount % interactions.length]];
        const updatedBiometricData = [...currentBiometricData, biometricData];

        const { error } = await supabase
          .from('ar_therapy_sessions')
          .update({
            interactions: updatedInteractions,
            biometric_data: updatedBiometricData
          })
          .eq('id', sessionId);

        if (error) console.error('Error updating session:', error);
      } catch (error) {
        console.error('Error in simulation update:', error);
      }

      interactionCount++;
    }, 3000);
  };

  const endARSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('ar_therapy_sessions')
        .update({
          end_time: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      setActiveSession(null);
      fetchSessions();
      
      toast({
        title: "Session Complete",
        description: "AR therapy session completed successfully",
      });
    } catch (error) {
      console.error('Error ending AR session:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ar-50 to-therapy-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ar-600 mx-auto mb-4"></div>
          <p className="text-ar-600 font-medium">Loading AR Therapy...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ar-50 to-therapy-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ar-900 mb-2">Augmented Reality Therapy</h1>
          <p className="text-ar-600 text-lg">Immersive therapeutic environments for enhanced healing</p>
        </div>

        {activeSession ? (
          <Card className="border-ar-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ar-700">
                <Glasses className="h-5 w-5" />
                Active AR Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="default" className="capitalize">
                    {environments.find(e => e.id === activeSession.environment_id)?.name}
                  </Badge>
                  <Button 
                    onClick={() => endARSession(activeSession.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Session
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-ar-600">Duration</p>
                    <p className="text-xl font-bold text-ar-900">
                      {Math.floor((Date.now() - new Date(activeSession.start_time).getTime()) / (1000 * 60))} min
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-ar-600">Engagement</p>
                    <p className="text-xl font-bold text-ar-900">85%</p>
                    <Progress value={85} className="mt-1" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-ar-600">Interactions</p>
                    <p className="text-xl font-bold text-ar-900">{activeSession.interactions?.length || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environments.map((env) => (
              <Card key={env.id} className="border-ar-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-ar-700">
                    <MapPin className="h-5 w-5" />
                    {env.name}
                  </CardTitle>
                  <CardDescription>{env.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => startARSession(env.id)}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Session History */}
        <Card className="border-ar-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ar-700">
              <Target className="h-5 w-5" />
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-ar-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline" className="capitalize">
                        {environments.find(e => e.id === session.environment_id)?.name || session.environment_id}
                      </Badge>
                      <span className="text-sm text-ar-600">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-ar-600">Duration:</span>
                        <span>{session.end_time ? 
                          `${Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))} min` : 
                          'In progress'
                        }</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ar-600">Interactions:</span>
                        <span>{session.interactions?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ar-600">Goals:</span>
                        <span>{session.therapeutic_goals?.join(', ') || 'None'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-ar-500 text-center py-8">No AR sessions yet. Start your first immersive experience!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARTherapy;