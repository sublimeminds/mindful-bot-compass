
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Brain, 
  Target, 
  TrendingUp, 
  Heart, 
  Download,
  Star,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionSummaryData {
  sessionId: string;
  duration: number;
  messageCount: number;
  moodBefore?: number;
  moodAfter?: number;
  keyTopics: string[];
  insights: string[];
  techniques: string[];
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high';
  effectivenessScore: number;
}

interface SessionSummaryGeneratorProps {
  sessionId: string;
  userId: string;
  onSummaryGenerated?: (summary: SessionSummaryData) => void;
}

const SessionSummaryGenerator = ({ sessionId, userId, onSummaryGenerated }: SessionSummaryGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<SessionSummaryData | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    // Check if summary already exists
    loadExistingSummary();
  }, [sessionId]);

  const loadExistingSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (data && !error) {
        // Convert database format to component format
        const summaryData: SessionSummaryData = {
          sessionId,
          duration: 0, // Would need to calculate from session start/end times
          messageCount: 0, // Would need to count from session_messages
          keyTopics: [],
          insights: [],
          techniques: [],
          recommendations: [],
          riskLevel: 'low',
          effectivenessScore: data.effectiveness_score || 0
        };
        setSummary(summaryData);
      }
    } catch (error) {
      console.error('Error loading existing summary:', error);
    }
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Get session messages
      const { data: messages, error: messagesError } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (messagesError) throw messagesError;

      // Get session data
      const { data: session, error: sessionError } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Generate AI-powered summary
      const summaryData = await generateAISummary(messages || [], session);

      // Save summary to database
      await saveSummaryToDatabase(summaryData);

      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      setSummary(summaryData);
      onSummaryGenerated?.(summaryData);

      toast({
        title: "Session Summary Generated",
        description: "Your session insights are ready to review.",
      });

    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate session summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAISummary = async (messages: any[], session: any): Promise<SessionSummaryData> => {
    // This would typically call an AI service to analyze the conversation
    // For now, we'll create a mock summary based on message analysis
    
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const aiMessages = messages.filter(msg => msg.sender === 'assistant');
    
    const mockSummary: SessionSummaryData = {
      sessionId,
      duration: session.end_time ? 
        Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 60000) : 0,
      messageCount: messages.length,
      moodBefore: session.mood_before,
      moodAfter: session.mood_after,
      keyTopics: extractKeyTopics(userMessages),
      insights: generateInsights(messages),
      techniques: ['Active Listening', 'Cognitive Reframing', 'Mindfulness'],
      recommendations: generateRecommendations(userMessages),
      riskLevel: assessRiskLevel(userMessages),
      effectivenessScore: calculateEffectiveness(session)
    };

    return mockSummary;
  };

  const extractKeyTopics = (userMessages: any[]): string[] => {
    // Simple keyword extraction - in production this would use NLP
    const keywords = ['anxiety', 'stress', 'work', 'family', 'sleep', 'depression', 'relationships'];
    const topics: string[] = [];
    
    userMessages.forEach(msg => {
      keywords.forEach(keyword => {
        if (msg.content.toLowerCase().includes(keyword) && !topics.includes(keyword)) {
          topics.push(keyword);
        }
      });
    });
    
    return topics.slice(0, 5);
  };

  const generateInsights = (messages: any[]): string[] => {
    const insights = [
      "You showed strong self-awareness during this session",
      "Your communication style suggests good emotional regulation",
      "You're making progress in identifying thought patterns"
    ];
    return insights;
  };

  const generateRecommendations = (userMessages: any[]): string[] => {
    return [
      "Continue practicing the breathing exercises we discussed",
      "Consider journaling about today's topics before bed",
      "Schedule a follow-up session within the next week"
    ];
  };

  const assessRiskLevel = (userMessages: any[]): 'low' | 'moderate' | 'high' => {
    // Simple risk assessment - in production this would be more sophisticated
    const riskKeywords = ['harm', 'hurt', 'suicide', 'hopeless'];
    const hasRiskIndicators = userMessages.some(msg => 
      riskKeywords.some(keyword => msg.content.toLowerCase().includes(keyword))
    );
    return hasRiskIndicators ? 'moderate' : 'low';
  };

  const calculateEffectiveness = (session: any): number => {
    let score = 70; // Base score
    
    if (session.mood_after && session.mood_before) {
      const improvement = session.mood_after - session.mood_before;
      score += improvement * 10;
    }
    
    return Math.min(Math.max(score, 0), 100);
  };

  const saveSummaryToDatabase = async (summaryData: SessionSummaryData) => {
    const { error } = await supabase
      .from('session_analytics')
      .upsert({
        session_id: sessionId,
        effectiveness_score: summaryData.effectivenessScore,
        mood_improvement: summaryData.moodAfter && summaryData.moodBefore ? 
          summaryData.moodAfter - summaryData.moodBefore : null,
        techniques_effectiveness: summaryData.techniques.reduce((acc, technique, index) => {
          acc[technique] = Math.random() * 100; // Mock effectiveness scores
          return acc;
        }, {} as Record<string, number>)
      });

    if (error) throw error;

    // Save insights
    for (const insight of summaryData.insights) {
      await supabase.from('session_insights').insert({
        session_id: sessionId,
        title: 'Session Insight',
        description: insight,
        insight_type: 'general',
        priority: 'medium'
      });
    }
  };

  const downloadSummary = () => {
    if (!summary) return;

    const summaryText = `
Session Summary - ${new Date().toLocaleDateString()}

Duration: ${summary.duration} minutes
Messages: ${summary.messageCount}
Effectiveness Score: ${summary.effectivenessScore}%

Key Topics:
${summary.keyTopics.map(topic => `- ${topic}`).join('\n')}

Insights:
${summary.insights.map(insight => `- ${insight}`).join('\n')}

Recommendations:
${summary.recommendations.map(rec => `- ${rec}`).join('\n')}
    `;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-summary-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!summary && !isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Generate Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Get AI-powered insights and recommendations from your therapy session.
          </p>
          <Button onClick={generateSummary} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 animate-pulse" />
            Generating Summary...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={generationProgress} className="mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Analyzing your session and generating insights...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Session Summary
            </div>
            <Button variant="outline" size="sm" onClick={downloadSummary}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{summary!.duration}m</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{summary!.messageCount}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{summary!.effectivenessScore}%</div>
              <div className="text-xs text-muted-foreground">Effectiveness</div>
            </div>
            <div className="text-center">
              <Badge variant={summary!.riskLevel === 'low' ? 'secondary' : 'destructive'}>
                {summary!.riskLevel} risk
              </Badge>
            </div>
          </div>

          {/* Key Topics */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Key Topics Discussed
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary!.keyTopics.map((topic, index) => (
                <Badge key={index} variant="outline">{topic}</Badge>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Key Insights
            </h4>
            <ul className="space-y-2">
              {summary!.insights.map((insight, index) => (
                <li key={index} className="text-sm flex items-start">
                  <Star className="h-3 w-3 mr-2 mt-0.5 text-therapy-500" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {summary!.recommendations.map((rec, index) => (
                <li key={index} className="text-sm flex items-start">
                  <Heart className="h-3 w-3 mr-2 mt-0.5 text-therapy-500" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionSummaryGenerator;
