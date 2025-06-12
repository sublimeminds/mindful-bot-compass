
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Lightbulb, 
  Heart, 
  Target, 
  TrendingUp,
  Calendar,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MemoryService, ConversationMemory, EmotionalPattern } from '@/services/memoryService';
import { useToast } from '@/hooks/use-toast';

const MemoryInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [memories, setMemories] = useState<ConversationMemory[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMemoryData();
    }
  }, [user?.id]);

  const loadMemoryData = async () => {
    try {
      setLoading(true);
      const [memoriesData, patternsData] = await Promise.all([
        MemoryService.getRecentMemories(user!.id, 10),
        MemoryService.getEmotionalPatterns(user!.id)
      ]);
      
      setMemories(memoriesData);
      setPatterns(patternsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load memory insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'breakthrough': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'insight': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'concern': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'goal': return <Target className="h-4 w-4 text-green-500" />;
      case 'pattern': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'technique': return <MessageCircle className="h-4 w-4 text-indigo-500" />;
      default: return <Heart className="h-4 w-4 text-therapy-500" />;
    }
  };

  const getPatternColor = (effectiveness: number) => {
    if (effectiveness >= 0.8) return 'text-green-600';
    if (effectiveness >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading memory insights...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Memories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-therapy-600" />
            Recent Therapy Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {memories.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No insights recorded yet. Continue your therapy sessions to build your personal memory bank.
            </div>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getMemoryIcon(memory.memoryType)}
                    <span className="font-medium">{memory.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {memory.memoryType}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {new Date(memory.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{memory.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Importance:</span>
                    <Progress 
                      value={memory.importanceScore * 100} 
                      className="w-16 h-2" 
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Emotional Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-therapy-600" />
            Emotional Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {patterns.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Emotional patterns will appear as you continue your therapy journey.
            </div>
          ) : (
            patterns.map((pattern) => (
              <div key={pattern.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-therapy-500" />
                    <span className="font-medium capitalize">
                      {pattern.patternType.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {pattern.patternData?.emotion || 'General'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Frequency:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={Math.min(pattern.frequencyScore * 10, 100)} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{pattern.frequencyScore}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Effectiveness:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={pattern.effectivenessScore * 100} className="flex-1 h-2" />
                      <span className={`text-sm font-medium ${getPatternColor(pattern.effectivenessScore)}`}>
                        {(pattern.effectivenessScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {pattern.lastOccurred && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Last occurred: {new Date(pattern.lastOccurred).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Memory Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Memory Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{memories.length}</div>
              <div className="text-xs text-muted-foreground">Total Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">
                {memories.filter(m => m.memoryType === 'breakthrough').length}
              </div>
              <div className="text-xs text-muted-foreground">Breakthroughs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{patterns.length}</div>
              <div className="text-xs text-muted-foreground">Patterns Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">
                {memories.filter(m => m.importanceScore > 0.8).length}
              </div>
              <div className="text-xs text-muted-foreground">High Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={loadMemoryData} variant="outline">
          <Brain className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>
    </div>
  );
};

export default MemoryInsights;
