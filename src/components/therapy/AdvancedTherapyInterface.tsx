import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdvancedTherapySession } from '@/hooks/useAdvancedTherapySession';
import { useAuth } from '@/hooks/useAuth';
import { 
  Brain, 
  Heart, 
  Shield, 
  TrendingUp, 
  Clock, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Lightbulb,
  Users,
  MessageSquare,
  Pause,
  Play,
  SkipForward,
  Plus
} from 'lucide-react';

interface AdvancedTherapyInterfaceProps {
  therapistId: string;
  therapyApproach: string;
  initialMood: number;
  culturalContext?: any;
}

const AdvancedTherapyInterface: React.FC<AdvancedTherapyInterfaceProps> = ({
  therapistId,
  therapyApproach,
  initialMood,
  culturalContext
}) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessionState,
    messages,
    isLoading,
    timeRemaining,
    currentTechnique,
    sessionExtensions,
    realTimeAnalysis,
    sendMessage,
    transitionToNextPhase,
    extendSession,
    endSession,
    getSessionProgress,
    getPhaseProgress,
    getCurrentPhaseInfo,
    getAdvancedSessionStats
  } = useAdvancedTherapySession({
    userId: user?.id || '',
    therapistId,
    therapyApproach,
    initialMood,
    culturalContext,
    onSessionComplete: (summary) => {
      console.log('Session completed:', summary);
    },
    onCrisisDetected: (crisis) => {
      console.log('Crisis detected:', crisis);
    },
    onBreakthroughDetected: (breakthrough) => {
      console.log('Breakthrough detected:', breakthrough);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const success = await sendMessage(inputValue);
      if (success) {
        setInputValue('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentPhase = getCurrentPhaseInfo();
  const sessionStats = getAdvancedSessionStats();
  const sessionProgress = getSessionProgress();
  const phaseProgress = getPhaseProgress();

  // Crisis level color mapping
  const getCrisisLevelColor = (level: string) => {
    switch (level) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Engagement level color mapping
  const getEngagementColor = (level: number) => {
    if (level >= 0.8) return 'text-green-600';
    if (level >= 0.6) return 'text-blue-600';
    if (level >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!sessionState.isActive) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Initializing Advanced Therapy Session...</p>
          <p className="text-sm text-muted-foreground">Setting up AI orchestration and quality monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Session Header with Real-time Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Advanced Therapy Session
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge className={getCrisisLevelColor(sessionState.crisisLevel)}>
                <Shield className="w-3 h-3 mr-1" />
                {sessionState.crisisLevel === 'none' ? 'Safe' : sessionState.crisisLevel}
              </Badge>
              <Badge variant="outline" className="bg-white">
                <Clock className="w-3 h-3 mr-1" />
                {timeRemaining}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Session Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Session Progress</span>
                <span>{Math.round(sessionProgress)}%</span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>
            
            {/* Engagement Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Engagement</span>
                <span className={getEngagementColor(sessionState.engagementLevel)}>
                  {Math.round(sessionState.engagementLevel * 100)}%
                </span>
              </div>
              <Progress value={sessionState.engagementLevel * 100} className="h-2" />
            </div>
            
            {/* Therapeutic Alliance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Therapeutic Alliance</span>
                <span className="text-primary">{Math.round(sessionState.therapeuticAlliance * 100)}%</span>
              </div>
              <Progress value={sessionState.therapeuticAlliance * 100} className="h-2" />
            </div>
            
            {/* Breakthrough Probability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Breakthrough Potential</span>
                <span className="text-yellow-600">{Math.round(sessionState.breakthroughProbability * 100)}%</span>
              </div>
              <Progress value={sessionState.breakthroughProbability * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">Therapy Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    <Target className="w-3 h-3 mr-1" />
                    {currentTechnique || 'Active Listening'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Current Phase Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-900">{currentPhase?.name}</span>
                  <span className="text-sm text-blue-700">{Math.round(phaseProgress)}% complete</span>
                </div>
                <p className="text-sm text-blue-700 mb-2">{currentPhase?.description}</p>
                <Progress value={phaseProgress} className="h-1" />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap">{message.content}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              {message.technique && (
                                <Badge variant="outline" className="text-xs">
                                  {message.technique}
                                </Badge>
                              )}
                              {message.crisisLevel && message.crisisLevel !== 'none' && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {message.crisisLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Quality Alerts */}
              {sessionState.qualityAlerts.length > 0 && (
                <div className="mb-4">
                  {sessionState.qualityAlerts.map((alert: any, index: number) => (
                    <Alert key={index} className="mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
              
              {/* Message Input */}
              <div className="mt-4 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts..."
                  disabled={isLoading || isPaused}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || isPaused}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Controls & Analytics */}
        <div className="space-y-4">
          {/* Phase Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                Session Phases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionState.phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`p-2 rounded-lg border ${
                      phase.status === 'active' ? 'bg-blue-50 border-blue-200' :
                      phase.status === 'completed' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{phase.name}</span>
                      {phase.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {phase.status === 'active' && (
                        <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {Math.floor(phase.expectedDuration / 60)}m • {phase.techniques.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                Real-time Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emotional State</span>
                  <Heart className="w-4 h-4 text-pink-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messages Exchanged</span>
                  <span className="text-sm font-medium">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session Extensions</span>
                  <span className="text-sm font-medium">{sessionExtensions.length}</span>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  AI Model: {realTimeAnalysis.model || 'Claude Sonnet 4'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Quality Score: {Math.round((sessionState.therapeuticAlliance * 100))}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Session Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={transitionToNextPhase}
                  className="w-full"
                  disabled={sessionState.currentPhaseIndex >= sessionState.phases.length - 1}
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Next Phase
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExtensionDialog(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Extend Session
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={endSession}
                  className="w-full"
                >
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Breakthrough Insights */}
          {sessionState.breakthroughProbability > 0.5 && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-yellow-800">
                  <Lightbulb className="w-4 h-4" />
                  Breakthrough Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700">
                  High breakthrough probability detected. Consider extending this session 
                  to fully explore this therapeutic moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Extension Dialog */}
      {showExtensionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Extend Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                How many additional minutes would you like to add to this session?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((minutes) => (
                  <Button
                    key={minutes}
                    variant="outline"
                    onClick={() => {
                      extendSession(minutes);
                      setShowExtensionDialog(false);
                    }}
                  >
                    {minutes}m
                  </Button>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowExtensionDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedTherapyInterface;