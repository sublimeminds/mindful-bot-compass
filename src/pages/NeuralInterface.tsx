import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Activity, Zap, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NeuralInterface = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

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
        .from('neural_interface_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching neural sessions:', error);
    }
  };

  const startNeuralSession = async () => {
    if (!user) return;
    
    setIsRecording(true);
    try {
      const sessionData = {
        user_id: user.id,
        interface_type: 'EEG_ENHANCED',
        neural_patterns: {
          alpha_waves: Math.random() * 100,
          beta_waves: Math.random() * 100,
          gamma_waves: Math.random() * 100,
          theta_waves: Math.random() * 100
        },
        biometric_feedback: {
          heart_rate: 72 + Math.random() * 20,
          skin_conductance: Math.random() * 10,
          breathing_rate: 12 + Math.random() * 8
        },
        start_time: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('neural_interface_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSession(data);
      toast({
        title: "Neural Session Started",
        description: "Brain-computer interface is now monitoring your neural patterns",
      });

      // Simulate session for 30 seconds
      setTimeout(() => {
        endNeuralSession(data.id);
      }, 30000);

    } catch (error) {
      console.error('Error starting neural session:', error);
      toast({
        title: "Session Error",
        description: "Failed to start neural interface session",
        variant: "destructive"
      });
      setIsRecording(false);
    }
  };

  const endNeuralSession = async (sessionId) => {
    try {
      const effectiveness = 0.5 + Math.random() * 0.5; // 50-100% effectiveness
      
      const { error } = await supabase
        .from('neural_interface_sessions')
        .update({
          end_time: new Date().toISOString(),
          session_effectiveness: effectiveness,
          therapy_adjustments: {
            recommended_frequency: Math.floor(Math.random() * 7) + 1,
            intensity_level: Math.floor(Math.random() * 10) + 1,
            focus_areas: ['cognitive_enhancement', 'emotional_regulation', 'stress_reduction']
          }
        })
        .eq('id', sessionId);

      if (error) throw error;
      
      setIsRecording(false);
      setCurrentSession(null);
      fetchSessions();
      
      toast({
        title: "Session Complete",
        description: `Neural session completed with ${(effectiveness * 100).toFixed(1)}% effectiveness`,
      });
    } catch (error) {
      console.error('Error ending neural session:', error);
      setIsRecording(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neural-50 to-interface-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neural-600 mx-auto mb-4"></div>
          <p className="text-neural-600 font-medium">Loading Neural Interface...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-50 to-interface-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neural-900 mb-2">Neural Interface Therapy</h1>
          <p className="text-neural-600 text-lg">Brain-computer interface for enhanced therapeutic outcomes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Neural Control Panel */}
          <Card className="border-neural-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neural-700">
                <Brain className="h-5 w-5" />
                Neural Interface Control
              </CardTitle>
              <CardDescription>
                Start a brain-computer interface session for real-time therapy optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!isRecording ? (
                  <Button 
                    onClick={startNeuralSession} 
                    className="w-full"
                    size="lg"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Start Neural Session
                  </Button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <Waves className="h-8 w-8 mx-auto text-neural-600 mb-2" />
                      <p className="text-neural-700 font-medium">Recording Neural Patterns...</p>
                    </div>
                    <Progress value={65} className="w-full" />
                    <p className="text-sm text-neural-500">Session will auto-complete in 30 seconds</p>
                  </div>
                )}

                {currentSession && (
                  <div className="bg-neural-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-neural-800">Current Session Data</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neural-600">Alpha Waves:</span>
                        <span className="ml-1 font-medium">{currentSession.neural_patterns?.alpha_waves?.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-neural-600">Heart Rate:</span>
                        <span className="ml-1 font-medium">{currentSession.biometric_feedback?.heart_rate?.toFixed(0)} BPM</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card className="border-neural-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-neural-700">
                <Zap className="h-5 w-5" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-neural-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline">{session.interface_type}</Badge>
                        <span className="text-sm text-neural-600">
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {session.session_effectiveness && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-neural-600">Effectiveness</span>
                            <span className="font-medium">{(session.session_effectiveness * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={session.session_effectiveness * 100} />
                        </div>
                      )}
                      
                      <div className="text-xs text-neural-500 mt-2">
                        Duration: {session.end_time ? 
                          `${Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))} min` : 
                          'In progress'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neural-500 text-center py-8">No neural sessions yet. Start your first session!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NeuralInterface;