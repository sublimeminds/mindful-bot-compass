import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play,
  Pause,
  Square,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Heart,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Lightbulb,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionProtocol {
  id: string;
  name: string;
  description: string;
  therapy_type: string;
  duration_minutes: number;
  preparation_steps: any;
  session_structure: any;
  post_session_tasks: any;
}

interface ActiveSession {
  id: string;
  protocol_id?: string;
  start_time: string;
  mood_before?: number;
  techniques: string[];
  notes: string;
}

interface SessionAnalytics {
  id: string;
  engagement_score: number;
  emotional_progression: any;
  technique_effectiveness: any;
  ai_insights: any;
  intervention_suggestions: any;
}

const AdvancedSessionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [protocols, setProtocols] = useState<SessionProtocol[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [sessionAnalytics, setSessionAnalytics] = useState<SessionAnalytics | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>('preparation');
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  useEffect(() => {
    if (user) {
      fetchProtocols();
      checkActiveSession();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && activeSession) {
      interval = setInterval(() => {
        setSessionTimer(timer => timer + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, activeSession]);

  const fetchProtocols = async () => {
    try {
      const { data, error } = await supabase
        .from('session_protocols')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProtocols(data || []);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .is('end_time', null)
        .order('start_time', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const session = data[0];
        setActiveSession(session);
        setIsRunning(true);
        
        // Calculate elapsed time
        const startTime = new Date(session.start_time);
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setSessionTimer(elapsed);

        // Fetch session analytics
        fetchSessionAnalytics(session.id);
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    }
  };

  const fetchSessionAnalytics = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('session_analytics_enhanced')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSessionAnalytics(data);
    } catch (error) {
      console.error('Error fetching session analytics:', error);
    }
  };

  const startSession = async () => {
    try {
      const selectedProtocolData = protocols.find(p => p.id === selectedProtocol);
      
      const { data: session, error } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: user?.id,
          start_time: new Date().toISOString(),
          mood_before: moodBefore,
          techniques: selectedProtocolData ? [selectedProtocolData.therapy_type] : []
        })
        .select()
        .single();

      if (error) throw error;

      setActiveSession(session);
      setIsRunning(true);
      setSessionTimer(0);
      setCurrentPhase('opening');

      // Create session analytics record
      await supabase
        .from('session_analytics_enhanced')
        .insert({
          session_id: session.id,
          user_id: user?.id,
          protocol_id: selectedProtocol || null,
          engagement_score: 0.5,
          emotional_progression: { initial_mood: moodBefore },
          technique_effectiveness: {},
          clinical_observations: {},
          ai_insights: {},
          intervention_suggestions: {}
        });

      toast({
        title: "Session Started",
        description: selectedProtocolData 
          ? `${selectedProtocolData.name} session has begun`
          : "Therapy session has started",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive",
      });
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
    toast({
      title: "Session Paused",
      description: "Timer paused. Click resume to continue.",
    });
  };

  const resumeSession = () => {
    setIsRunning(true);
    toast({
      title: "Session Resumed",
      description: "Timer resumed.",
    });
  };

  const endSession = async () => {
    if (!activeSession) return;

    try {
      await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          mood_after: moodAfter,
          notes: sessionNotes
        })
        .eq('id', activeSession.id);

      // Update final analytics
      if (sessionAnalytics) {
        await supabase
          .from('session_analytics_enhanced')
          .update({
            emotional_progression: {
              ...sessionAnalytics.emotional_progression,
              final_mood: moodAfter,
              mood_change: moodAfter - moodBefore
            },
            updated_at: new Date().toISOString()
          })
          .eq('session_id', activeSession.id);
      }

      setActiveSession(null);
      setSessionAnalytics(null);
      setIsRunning(false);
      setSessionTimer(0);
      setCurrentPhase('preparation');
      setSessionNotes('');

      toast({
        title: "Session Completed",
        description: `Session lasted ${formatTime(sessionTimer)}. Your progress has been saved.`,
      });
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session properly",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSessionPhase = (phase: string) => {
    setCurrentPhase(phase);
    toast({
      title: "Session Phase Updated",
      description: `Now in ${phase} phase`,
    });
  };

  const getPhaseProgress = () => {
    const selectedProtocolData = protocols.find(p => p.id === selectedProtocol);
    if (!selectedProtocolData) return 0;
    
    const totalDuration = selectedProtocolData.duration_minutes * 60;
    return Math.min((sessionTimer / totalDuration) * 100, 100);
  };

  const getCurrentProtocol = () => {
    return protocols.find(p => p.id === selectedProtocol);
  };

  if (!activeSession) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-therapy-600" />
            <h2 className="text-2xl font-bold">Session Manager</h2>
          </div>
          <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
            Ready to Start
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Start New Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Session Protocol (Optional)
              </label>
              <Select value={selectedProtocol} onValueChange={setSelectedProtocol}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a therapy protocol or start freestyle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Freestyle Session</SelectItem>
                  {protocols.map((protocol) => (
                    <SelectItem key={protocol.id} value={protocol.id}>
                      {protocol.name} ({protocol.duration_minutes} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProtocol && (
              <Card className="bg-therapy-50">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">{getCurrentProtocol()?.name}</h4>
                    <p className="text-sm text-gray-600">{getCurrentProtocol()?.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span> {getCurrentProtocol()?.duration_minutes} minutes
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {getCurrentProtocol()?.therapy_type.toUpperCase()}
                      </div>
                    </div>

                    {getCurrentProtocol()?.preparation_steps && (
                      <div>
                        <h5 className="font-medium text-sm mb-1">Preparation Steps:</h5>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {getCurrentProtocol()?.preparation_steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                How are you feeling right now? (1-10)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodBefore}
                  onChange={(e) => setMoodBefore(Number(e.target.value))}
                  className="flex-1"
                />
                <Badge variant="outline" className="min-w-8">
                  {moodBefore}
                </Badge>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <Button onClick={startSession} className="w-full" size="lg">
              <Play className="h-5 w-5 mr-2" />
              Start Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Active Session</h2>
        </div>
        <Badge className="bg-green-500 text-white">
          <Clock className="h-3 w-3 mr-1" />
          {formatTime(sessionTimer)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Control Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Session Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-therapy-600 mb-2">
                  {formatTime(sessionTimer)}
                </div>
                <Progress value={getPhaseProgress()} className="mb-4" />
                
                <div className="flex space-x-2">
                  {isRunning ? (
                    <Button variant="outline" onClick={pauseSession}>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={resumeSession}>
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  
                  <Button variant="destructive" onClick={endSession}>
                    <Square className="h-4 w-4 mr-1" />
                    End
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {getCurrentProtocol() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Session Phases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                        {Object.entries(getCurrentProtocol()?.session_structure || {}).map(([phase, duration]) => (
                          <Button
                            key={phase}
                            variant={currentPhase === phase ? "default" : "outline"}
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => updateSessionPhase(phase)}
                          >
                            <span className="capitalize">{phase.replace('_', ' ')}</span>
                            <span>{String(duration)} min</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Session Analytics */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="analytics" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="notes">Session Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Engagement Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {Math.round((sessionAnalytics?.engagement_score || 0.5) * 100)}%
                    </div>
                    <Progress value={(sessionAnalytics?.engagement_score || 0.5) * 100} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Emotional State
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Starting Mood:</span>
                        <Badge variant="outline">{moodBefore}/10</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Phase:</span>
                        <Badge className="capitalize">{currentPhase}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {sessionAnalytics?.technique_effectiveness && (
                <Card>
                  <CardHeader>
                    <CardTitle>Technique Effectiveness</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(sessionAnalytics.technique_effectiveness).map(([technique, effectiveness]) => (
                        <div key={technique} className="flex justify-between items-center">
                          <span className="capitalize">{technique}</span>
                          <Progress value={(effectiveness as number) * 100} className="w-32" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sessionAnalytics?.ai_insights ? (
                    <div className="space-y-3">
                      {Object.entries(sessionAnalytics.ai_insights).map(([category, insights]) => (
                        <div key={category}>
                          <h4 className="font-medium capitalize mb-2">{category}</h4>
                          <div className="space-y-1">
                            {Array.isArray(insights) ? insights.map((insight, index) => (
                              <div key={index} className="text-sm bg-therapy-50 p-2 rounded">
                                {insight}
                              </div>
                            )) : (
                              <div className="text-sm bg-therapy-50 p-2 rounded">
                                {insights as string}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>AI insights will appear as the session progresses</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {sessionAnalytics?.intervention_suggestions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Interventions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(sessionAnalytics.intervention_suggestions).map(([type, suggestions]) => (
                        <div key={type} className="p-3 border rounded-lg">
                          <div className="font-medium capitalize mb-1">{type}</div>
                          <div className="text-sm text-gray-600">
                            {Array.isArray(suggestions) ? suggestions.join(', ') : String(suggestions)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-32 p-3 border rounded-lg resize-none"
                    placeholder="Record thoughts, observations, or key moments from this session..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Post-Session Preparation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      How are you feeling now? (1-10)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={moodAfter}
                        onChange={(e) => setMoodAfter(Number(e.target.value))}
                        className="flex-1"
                      />
                      <Badge variant="outline" className="min-w-8">
                        {moodAfter}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {getCurrentProtocol()?.post_session_tasks && (
                    <div>
                      <h4 className="font-medium mb-2">Recommended Follow-up Tasks:</h4>
                      <div className="space-y-2">
                        {getCurrentProtocol()?.post_session_tasks.map((task, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSessionManager;