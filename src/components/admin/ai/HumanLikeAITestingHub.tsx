import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  Clock, 
  Users, 
  Shield,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { useHumanLikeAIIntegration } from '@/hooks/useHumanLikeAIIntegration';

const HumanLikeAITestingHub = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState('dr-sarah-chen');
  
  // Initialize human-like AI for testing
  const humanLikeAI = useHumanLikeAIIntegration(selectedTherapist);

  const runConversationMemoryTest = async () => {
    setLoading(true);
    try {
      // Start a session and add some memories
      await humanLikeAI.startEnhancedSession();
      
      // Add test memories
      await humanLikeAI.conversationMemory.addMemory(
        'concern',
        'Work stress',
        'User mentioned feeling overwhelmed at work',
        { emotion: 'anxious' },
        0.8
      );

      await humanLikeAI.conversationMemory.addMemory(
        'goal',
        'Better sleep',
        'User wants to improve sleep quality',
        { emotion: 'hopeful' },
        0.7
      );

      // Test memory retrieval
      const relevantMemories = await humanLikeAI.conversationMemory.getRelevantMemories('work');
      const callbacks = humanLikeAI.conversationMemory.generateCallbacks(relevantMemories);

      const result = {
        id: Date.now(),
        testName: 'Conversation Memory',
        status: relevantMemories.length > 0 ? 'passed' : 'failed',
        details: {
          memoriesFound: relevantMemories.length,
          callbacksGenerated: callbacks.length,
          firstCallback: callbacks[0] || 'None'
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Memory Test Complete",
        description: `Found ${relevantMemories.length} relevant memories`,
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runProactiveCareTest = async () => {
    setLoading(true);
    try {
      // Test daily check-in generation
      const checkIn = await humanLikeAI.generateDailyCheckIn();
      
      // Test mood check creation
      await humanLikeAI.proactiveCare.createMoodCheck('daily', 'Test check-in');
      
      const result = {
        id: Date.now(),
        testName: 'Proactive Care',
        status: checkIn ? 'passed' : 'failed',
        details: {
          checkInGenerated: !!checkIn,
          message: checkIn?.message || 'No message generated',
          contextType: checkIn?.context?.timeOfDay || 'unknown'
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Proactive Care Test Complete",
        description: checkIn ? "Check-in generated successfully" : "Failed to generate check-in",
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runContextualAwarenessTest = async () => {
    setLoading(true);
    try {
      const context = humanLikeAI.contextualAwareness.getCurrentContext();
      const greeting = humanLikeAI.contextualAwareness.getContextualGreeting(context!);
      const adaptation = humanLikeAI.contextualAwareness.getSeasonalAdaptation(context!);
      
      const result = {
        id: Date.now(),
        testName: 'Contextual Awareness',
        status: context ? 'passed' : 'failed',
        details: {
          timeOfDay: context?.timeOfDay,
          season: context?.season,
          greeting,
          adaptationTheme: adaptation?.theme
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Contextual Awareness Test Complete",
        description: `Detected ${context?.timeOfDay} time and ${context?.season} season`,
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runTherapeuticRelationshipTest = async () => {
    setLoading(true);
    try {
      await humanLikeAI.therapeuticRelationship.initializeRelationship();
      await humanLikeAI.therapeuticRelationship.updateTrustLevel(1);
      
      const relationship = humanLikeAI.therapeuticRelationship.relationship;
      const canShare = humanLikeAI.therapeuticRelationship.canAccessFeature('personal_sharing');
      
      const result = {
        id: Date.now(),
        testName: 'Therapeutic Relationship',
        status: relationship ? 'passed' : 'failed',
        details: {
          stage: relationship?.relationship_stage,
          trustLevel: relationship?.trust_level,
          canAccessPersonalSharing: canShare,
          unlockedFeatures: relationship?.milestone_unlocks?.length || 0
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Relationship Test Complete",
        description: `Stage: ${relationship?.relationship_stage}, Trust: ${relationship?.trust_level}`,
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runCrisisDetectionTest = async () => {
    setLoading(true);
    try {
      const crisisMessages = [
        "I don't want to live anymore",
        "Everything is hopeless",
        "I'm just feeling a bit down today",
        "I might hurt myself tonight"
      ];

      const results = [];
      
      for (const message of crisisMessages) {
        const detection = humanLikeAI.crisisSupport.detectCrisisIndicators(message);
        results.push({
          message,
          level: detection.crisisLevel,
          requiresImmediate: detection.requiresImmediate
        });
      }

      const result = {
        id: Date.now(),
        testName: 'Crisis Detection',
        status: results.some(r => r.level === 'critical') ? 'passed' : 'warning',
        details: {
          testResults: results,
          criticalDetected: results.filter(r => r.level === 'critical').length,
          immediateRequired: results.filter(r => r.requiresImmediate).length
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Crisis Detection Test Complete",
        description: `Detected ${result.details.criticalDetected} critical situations`,
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runMicroInteractionsTest = async () => {
    setLoading(true);
    try {
      const testText = "This is a test message for human-like typing simulation.";
      
      let typedText = '';
      await humanLikeAI.microInteractions.simulateTyping(testText, (partial) => {
        typedText = partial;
      });

      const reaction = humanLikeAI.microInteractions.getContextualReaction("I'm feeling anxious", "anxious");
      const validation = humanLikeAI.microInteractions.getValidationResponse("feeling");

      const result = {
        id: Date.now(),
        testName: 'Micro Interactions',
        status: typedText === testText ? 'passed' : 'failed',
        details: {
          typingComplete: typedText === testText,
          reactionGenerated: !!reaction,
          validationGenerated: !!validation,
          sampleReaction: reaction,
          sampleValidation: validation
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Micro Interactions Test Complete",
        description: "Typing simulation and reactions tested",
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runFullIntegrationTest = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test message",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await humanLikeAI.startEnhancedSession();
      await humanLikeAI.sendEnhancedMessage(testMessage);
      
      const insights = await humanLikeAI.getSessionInsights();
      
      const result = {
        id: Date.now(),
        testName: 'Full Integration Test',
        status: humanLikeAI.messages.length > 0 ? 'passed' : 'failed',
        details: {
          messagesCount: humanLikeAI.messages.length,
          sessionInsights: insights,
          lastMessage: humanLikeAI.messages[humanLikeAI.messages.length - 1]?.content?.substring(0, 100) + '...'
        }
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Integration Test Complete",
        description: `Generated ${humanLikeAI.messages.length} messages`,
        variant: result.status === 'passed' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Brain className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Human-Like AI Testing Hub</h2>
      </div>

      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="components">Component Tests</TabsTrigger>
          <TabsTrigger value="integration">Integration Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversation Memory Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Conversation Memory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests memory storage, retrieval, and callback generation.
                </p>
                <Button onClick={runConversationMemoryTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Memory System
                </Button>
              </CardContent>
            </Card>

            {/* Proactive Care Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Proactive Care
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests daily check-ins and mood monitoring.
                </p>
                <Button onClick={runProactiveCareTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Proactive Care
                </Button>
              </CardContent>
            </Card>

            {/* Contextual Awareness Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Contextual Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests time, season, and environmental awareness.
                </p>
                <Button onClick={runContextualAwarenessTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Context Awareness
                </Button>
              </CardContent>
            </Card>

            {/* Therapeutic Relationship Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Therapeutic Relationship
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests trust building and relationship progression.
                </p>
                <Button onClick={runTherapeuticRelationshipTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Relationship System
                </Button>
              </CardContent>
            </Card>

            {/* Crisis Detection Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Crisis Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests crisis recognition and response systems.
                </p>
                <Button onClick={runCrisisDetectionTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Crisis Detection
                </Button>
              </CardContent>
            </Card>

            {/* Micro Interactions Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Micro Interactions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests typing patterns and emotional reactions.
                </p>
                <Button onClick={runMicroInteractionsTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Micro Interactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Full Integration Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter a test message to see the full human-like AI response..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={4}
              />
              <Button onClick={runFullIntegrationTest} disabled={loading || !testMessage.trim()} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Run Full Integration Test
              </Button>
              
              {humanLikeAI.messages.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Last AI Response:</h4>
                  <p className="text-sm text-muted-foreground">
                    {humanLikeAI.messages[humanLikeAI.messages.length - 1]?.content}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <div key={result.id} className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.testName}</span>
                    </div>
                    <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HumanLikeAITestingHub;