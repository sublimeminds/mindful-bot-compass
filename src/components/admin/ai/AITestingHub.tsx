import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TestTube, 
  MessageSquare, 
  Brain, 
  Shield, 
  Users, 
  Mic, 
  Heart, 
  Cog, 
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AITestingService, TestResult, MockUser } from '@/services/aiTestingService';

const AITestingHub = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedPersona, setSelectedPersona] = useState('empathetic');
  const [testMessage, setTestMessage] = useState('');
  const [selectedCulture, setSelectedCulture] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [emotionText, setEmotionText] = useState('');
  const [crisisText, setCrisisText] = useState('');

  const mockUsers = AITestingService.generateMockUsers();

  const runTest = async (testFunction: () => Promise<TestResult | TestResult[]>) => {
    setLoading(true);
    try {
      const result = await testFunction();
      const results = Array.isArray(result) ? result : [result];
      setTestResults(prev => [...results, ...prev]);
      
      const passedCount = results.filter(r => r.status === 'passed').length;
      toast({
        title: "Test Complete",
        description: `${passedCount}/${results.length} tests passed`,
        variant: passedCount === results.length ? "default" : "destructive"
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

  const runChatTest = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test message",
        variant: "destructive"
      });
      return;
    }
    
    await runTest(() => AITestingService.testTherapyChatAI(selectedPersona, testMessage));
  };

  const runAdaptiveTest = async (user: MockUser) => {
    await runTest(() => AITestingService.testAdaptiveTherapyGeneration(user));
  };

  const runCrisisTest = async () => {
    if (!crisisText.trim()) {
      toast({
        title: "Error",
        description: "Please enter crisis text to test",
        variant: "destructive"
      });
      return;
    }
    
    await runTest(() => AITestingService.testCrisisDetection(crisisText));
  };

  const runCulturalTest = async () => {
    if (!testMessage.trim() || !selectedCulture) {
      toast({
        title: "Error",
        description: "Please enter a message and select a culture",
        variant: "destructive"
      });
      return;
    }

    const culturalContext = {
      primary_language: selectedCulture,
      cultural_background: selectedCulture === 'es' ? 'hispanic' : selectedCulture === 'zh' ? 'chinese' : 'general',
      family_structure: 'nuclear',
      religious_considerations: false
    };
    
    await runTest(() => AITestingService.testCulturalAdaptation(testMessage, culturalContext));
  };

  const runVoiceTest = async () => {
    if (!voiceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text for voice synthesis",
        variant: "destructive"
      });
      return;
    }
    
    await runTest(() => AITestingService.testVoiceAndAvatar(voiceText));
  };

  const runEmotionTest = async () => {
    if (!emotionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text for emotion analysis",
        variant: "destructive"
      });
      return;
    }
    
    await runTest(() => AITestingService.testEmotionDetection(emotionText));
  };

  const runBackgroundTest = async () => {
    await runTest(() => AITestingService.testBackgroundAI());
  };

  const runCompleteFlowTest = async (user: MockUser) => {
    await runTest(() => AITestingService.testCompleteTherapyFlow(user));
  };

  const clearResults = () => {
    setTestResults([]);
    AITestingService.clearTestResults();
    toast({
      title: "Results Cleared",
      description: "All test results have been cleared"
    });
  };

  const exportResults = () => {
    const data = JSON.stringify(testResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          <h2 className="text-xl font-semibold">AI Testing Hub</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults} disabled={testResults.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" onClick={clearResults} disabled={testResults.length === 0}>
            Clear Results
          </Button>
        </div>
      </div>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Tests</TabsTrigger>
          <TabsTrigger value="flows">User Flow Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chat AI Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat AI Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select therapist persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empathetic">Empathetic Therapist</SelectItem>
                    <SelectItem value="solution-focused">Solution-Focused</SelectItem>
                    <SelectItem value="cognitive-behavioral">CBT Specialist</SelectItem>
                    <SelectItem value="mindfulness">Mindfulness Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter test message..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
                <Button onClick={runChatTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Chat AI
                </Button>
              </CardContent>
            </Card>

            {/* Crisis Detection Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Crisis Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter crisis-related text to test detection..."
                  value={crisisText}
                  onChange={(e) => setCrisisText(e.target.value)}
                />
                <Button onClick={runCrisisTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Crisis Detection
                </Button>
              </CardContent>
            </Card>

            {/* Cultural AI Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cultural AI Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedCulture} onValueChange={setSelectedCulture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cultural context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (General)</SelectItem>
                    <SelectItem value="es">Spanish (Hispanic)</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter message for cultural adaptation test..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
                <Button onClick={runCulturalTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Cultural AI
                </Button>
              </CardContent>
            </Card>

            {/* Voice & Avatar Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice & Avatar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text for voice synthesis..."
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                />
                <Button onClick={runVoiceTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Voice & Avatar
                </Button>
              </CardContent>
            </Card>

            {/* Emotion Detection Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Emotion Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter text for emotion analysis..."
                  value={emotionText}
                  onChange={(e) => setEmotionText(e.target.value)}
                />
                <Button onClick={runEmotionTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Emotion Detection
                </Button>
              </CardContent>
            </Card>

            {/* Background AI Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5" />
                  Background AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Tests background AI functions like recommendations and session analysis.
                </p>
                <Button onClick={runBackgroundTest} disabled={loading} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Background AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mockUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{user.type.toUpperCase()} User</span>
                    <Badge variant="outline">{user.type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Mood: {user.currentMood}/10</p>
                    <p>Goals: {user.therapyGoals?.join(', ')}</p>
                    {user.culturalProfile && (
                      <p>Culture: {user.culturalProfile.cultural_background}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => runAdaptiveTest(user)} 
                      disabled={loading} 
                      className="w-full"
                      variant="outline"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Test Adaptive Therapy
                    </Button>
                    <Button 
                      onClick={() => runCompleteFlowTest(user)} 
                      disabled={loading} 
                      className="w-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Complete Flow Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                      <div>
                        <p className="font-medium">{result.testName}</p>
                        <p className="text-sm text-muted-foreground">{result.testType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.metrics.responseTime}ms
                      </span>
                    </div>
                  </div>
                  {result.error && (
                    <p className="text-sm text-red-400 mt-2">{result.error}</p>
                  )}
                  {result.metrics.quality && (
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Quality: {result.metrics.quality}%</span>
                      {result.metrics.safety && <span>Safety: {result.metrics.safety}%</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITestingHub;