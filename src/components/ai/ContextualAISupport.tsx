import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  MessageSquare, 
  User, 
  Zap, 
  Settings,
  Sparkles,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedPersonalizationService } from '@/services/enhancedPersonalizationService';

const ContextualAISupport = () => {
  const { user } = useAuth();
  const [aiSettings, setAISettings] = useState({
    adaptiveResponses: true,
    emotionalAwareness: 8,
    proactiveSupport: true,
    learningFromFeedback: true,
    memoryRetention: 7
  });

  const [conversationContext, setConversationContext] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (user) {
      loadAIContext();
    }
  }, [user]);

  const loadAIContext = async () => {
    if (!user) return;
    
    try {
      const memories = await EnhancedPersonalizationService.getConversationMemories(user.id, 5);
      if (memories.length > 0) {
        setConversationContext({
          currentEmotionalState: memories[0].emotionalContext?.dominantEmotion || 'neutral',
          lastEngagement: memories[0].conversationFlow?.engagement || 5,
          preferredTechniques: memories[0].learnings?.effectiveTechniques || []
        });
      }
    } catch (error) {
      console.error('Error loading AI context:', error);
    }
  };

  const optimizeAI = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Contextual AI Support</h2>
        </div>
        <Button onClick={optimizeAI} disabled={isOptimizing} className="bg-therapy-600 hover:bg-therapy-700">
          {isOptimizing ? <Activity className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {isOptimizing ? 'Optimizing...' : 'Optimize AI'}
        </Button>
      </div>

      {conversationContext && (
        <Card className="bg-gradient-to-r from-therapy-50 to-calm-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Current AI Context</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Emotional State</p>
                <Badge className="mt-1">{conversationContext.currentEmotionalState}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Engagement</p>
                <Badge className="mt-1">{conversationContext.lastEngagement}/10</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Techniques</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {conversationContext.preferredTechniques.slice(0, 2).map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI Behavior Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Adaptive Responses</span>
            <Switch
              checked={aiSettings.adaptiveResponses}
              onCheckedChange={(checked) => 
                setAISettings(prev => ({ ...prev, adaptiveResponses: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Emotional Awareness</span>
              <span className="text-sm text-gray-600">{aiSettings.emotionalAwareness}/10</span>
            </div>
            <Slider
              value={[aiSettings.emotionalAwareness]}
              onValueChange={(value) => 
                setAISettings(prev => ({ ...prev, emotionalAwareness: value[0] }))
              }
              max={10}
              min={1}
              step={1}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Proactive Support</span>
            <Switch
              checked={aiSettings.proactiveSupport}
              onCheckedChange={(checked) => 
                setAISettings(prev => ({ ...prev, proactiveSupport: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Learning from Feedback</span>
            <Switch
              checked={aiSettings.learningFromFeedback}
              onCheckedChange={(checked) => 
                setAISettings(prev => ({ ...prev, learningFromFeedback: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextualAISupport;