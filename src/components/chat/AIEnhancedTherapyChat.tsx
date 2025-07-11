import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  Bot,
  User,
  Brain,
  Heart,
  Activity,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Target,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
// Mock services for AI integration demonstration
const mockAiService = {
  getCurrentTherapyPhase: async (userId: string) => ({ currentPhase: 'Building Coping Skills' }),
  generateTherapeuticResponse: async (options: any) => ({
    content: `I understand what you're sharing. Based on our previous conversations and your current therapy phase, let me help you work through this.`,
    approach: 'supportive',
    confidence: 0.85,
    memoryReferences: ['memory-1', 'memory-2'],
    importance: 0.8,
    shouldGenerateAssignment: Math.random() > 0.7,
    insights: ['pattern-recognition', 'emotional-growth']
  })
};

const mockMemoryService = {
  getRecentMemories: async (userId: string, limit: number) => [
    { id: 'memory-1', content: 'Previous anxiety discussion', importance: 0.9 },
    { id: 'memory-2', content: 'Coping strategies progress', importance: 0.8 }
  ],
  getRelevantMemories: async (userId: string, content: string) => [
    { id: 'memory-1', content: 'Related therapeutic memory', relevance: 0.85 }
  ],
  storeMemory: async (data: any) => ({ success: true })
};

const mockAssignmentService = {
  generateContextualAssignment: async (options: any) => ({
    title: 'Mindful Breathing Exercise',
    description: 'Practice deep breathing for 5 minutes, focusing on the rhythm and sensation of each breath.'
  })
};
import { crisisDetectionService } from '@/services/crisisDetectionService';

interface TherapeuticMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
  aiMetadata?: {
    therapistPersonality?: string;
    therapeuticApproach?: string;
    memoryReferences?: string[];
    crisisLevel?: string;
    confidence?: number;
    planPhase?: string;
  };
  memoryStored?: boolean;
  assignmentGenerated?: boolean;
}

interface AIEnhancedTherapyChatProps {
  className?: string;
}

const AIEnhancedTherapyChat = ({ className }: AIEnhancedTherapyChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<TherapeuticMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState('compassionate');
  const [currentTherapyPhase, setCurrentTherapyPhase] = useState('Assessment');
  const [memoryAccuracy, setMemoryAccuracy] = useState(87);
  const [activeInsights, setActiveInsights] = useState(3);
  const [crisisRiskLevel, setCrisisRiskLevel] = useState<'low' | 'moderate' | 'high'>('low');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const therapistPersonalities = [
    { id: 'compassionate', name: 'Dr. Sarah - Compassionate', approach: 'Empathetic and supportive' },
    { id: 'cognitive', name: 'Dr. Mark - Cognitive Focused', approach: 'CBT and structured thinking' },
    { id: 'mindful', name: 'Dr. Luna - Mindfulness Expert', approach: 'Present-moment awareness' },
    { id: 'solution', name: 'Dr. Alex - Solution Oriented', approach: 'Goal-focused and practical' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && user) {
      initializeChat();
    }
  }, [user]);

  const initializeChat = async () => {
    if (!user) return;
    
    try {
      // Load therapeutic memory
      const memories = await mockMemoryService.getRecentMemories(user.id, 5);
      const therapyPlan = await mockAiService.getCurrentTherapyPhase(user.id);
      
      setCurrentTherapyPhase(therapyPlan.currentPhase || 'Assessment');
      
      const welcomeMessage: TherapeuticMessage = {
        id: 'welcome',
        content: `Hello! I'm your AI therapist. I remember our previous conversations and I can see we're currently in the ${therapyPlan.currentPhase} phase of your therapy journey. How are you feeling today?`,
        sender: 'ai',
        timestamp: new Date(),
        aiMetadata: {
          therapistPersonality: selectedTherapist,
          therapeuticApproach: 'welcoming',
          memoryReferences: memories.map(m => m.id),
          planPhase: therapyPlan.currentPhase,
          confidence: 1.0
        }
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleTherapistChange = async (therapistId: string) => {
    setSelectedTherapist(therapistId);
    const personality = therapistPersonalities.find(t => t.id === therapistId);
    
    if (personality) {
      const transitionMessage: TherapeuticMessage = {
        id: Date.now().toString(),
        content: `I've adjusted my approach to be more ${personality.approach.toLowerCase()}. How does this feel for you?`,
        sender: 'ai',
        timestamp: new Date(),
        aiMetadata: {
          therapistPersonality: therapistId,
          therapeuticApproach: 'personality_transition',
          confidence: 0.9
        }
      };
      setMessages(prev => [...prev, transitionMessage]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;

    const userMessage: TherapeuticMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Crisis detection
      const crisisLevel = await crisisDetectionService.analyzeCrisisLevel([content]);
      setCrisisRiskLevel(crisisLevel > 0.8 ? 'high' : crisisLevel > 0.4 ? 'moderate' : 'low');

      // Get therapeutic context
      const memoryContext = await mockMemoryService.getRelevantMemories(user.id, content);
      const therapyPlan = await mockAiService.getCurrentTherapyPhase(user.id);

      // Generate AI response with full context
      const response = await mockAiService.generateTherapeuticResponse({
        message: content,
        userId: user.id,
        therapistPersonality: selectedTherapist,
        memoryContext,
        therapyPhase: therapyPlan.currentPhase,
        conversationHistory: messages.slice(-10),
        crisisLevel
      });

      const aiMessage: TherapeuticMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'ai',
        timestamp: new Date(),
        aiMetadata: {
          therapistPersonality: selectedTherapist,
          therapeuticApproach: response.approach,
          memoryReferences: response.memoryReferences || [],
          crisisLevel: crisisLevel.toString(),
          confidence: response.confidence,
          planPhase: therapyPlan.currentPhase
        }
      };

      setMessages(prev => [...prev, aiMessage]);

      // Store therapeutic memory
      await mockMemoryService.storeMemory({
        userId: user.id,
        content: `User: ${content}\nTherapist: ${response.content}`,
        importance: response.importance || 0.7
      });

      // Check if we should generate intelligent assignment
      if (response.shouldGenerateAssignment) {
        const assignment = await mockAssignmentService.generateContextualAssignment({
          userId: user.id,
          conversationContext: content,
          therapyPhase: therapyPlan.currentPhase,
          therapistPersonality: selectedTherapist
        });

        if (assignment) {
          const assignmentMessage: TherapeuticMessage = {
            id: (Date.now() + 2).toString(),
            content: `I have a personalized exercise for you: ${assignment.title}\n\n${assignment.description}\n\nWould you like to try this now or save it for later?`,
            sender: 'ai',
            timestamp: new Date(),
            aiMetadata: {
              therapeuticApproach: 'assignment_delivery',
              confidence: 0.8
            },
            assignmentGenerated: true
          };
          setMessages(prev => [...prev, assignmentMessage]);
        }
      }

      // Update metrics
      setMemoryAccuracy(prev => Math.min(95, prev + 1));
      setActiveInsights(prev => prev + (response.insights?.length || 0));

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className={`flex flex-col h-full space-y-4 ${className}`}>
      {/* Enhanced Header with AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              <span>AI-Enhanced Therapy Chat</span>
              <Badge variant="outline" className="bg-therapy-100 text-therapy-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Phase: {currentTherapyPhase}
              </Badge>
            </CardTitle>

            <div className="flex items-center space-x-4">
              {/* Crisis Risk Level */}
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-therapy-600" />
                <Badge className={`text-xs ${getRiskLevelColor(crisisRiskLevel)}`}>
                  Risk: {crisisRiskLevel}
                </Badge>
              </div>

              {/* Memory Accuracy */}
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-therapy-600" />
                <span className="text-sm text-gray-600">Memory: {memoryAccuracy}%</span>
              </div>

              {/* Active Insights */}
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-therapy-600" />
                <Badge variant="secondary">{activeInsights} insights</Badge>
              </div>
            </div>
          </div>

          {/* Therapist Selector */}
          <div className="flex items-center space-x-4 mt-3">
            <span className="text-sm font-medium">AI Therapist:</span>
            <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {therapistPersonalities.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{therapist.name}</span>
                      <span className="text-xs text-gray-500">{therapist.approach}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Messages with Memory References */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg space-y-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-therapy-500 to-therapy-600 text-white'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === 'user' ? 'You' : 
                         `AI Therapist ${message.aiMetadata?.therapistPersonality ? 
                         `(${therapistPersonalities.find(t => t.id === message.aiMetadata?.therapistPersonality)?.name.split(' - ')[0] || ''})` : ''}`}
                      </span>
                      
                      {/* AI Metadata Indicators */}
                      {message.aiMetadata && (
                        <div className="flex items-center space-x-1">
                          {message.aiMetadata.memoryReferences && message.aiMetadata.memoryReferences.length > 0 && (
                            <BookOpen className="h-3 w-3 opacity-70" />
                          )}
                          {message.assignmentGenerated && (
                            <Target className="h-3 w-3 opacity-70" />
                          )}
                          {message.aiMetadata.confidence && message.aiMetadata.confidence > 0.8 && (
                            <Sparkles className="h-3 w-3 opacity-70" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Enhanced Message Footer */}
                    <div className="flex items-center justify-between text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      <div className="flex items-center space-x-2">
                        {message.aiMetadata?.planPhase && (
                          <Badge variant="outline" className="text-xs">
                            {message.aiMetadata.planPhase}
                          </Badge>
                        )}
                        {message.aiMetadata?.confidence && (
                          <span className="text-xs">
                            {Math.round(message.aiMetadata.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs text-gray-600">AI Therapist</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Activity className="h-4 w-4 animate-spin text-therapy-600" />
                      <span className="text-sm text-gray-600">Processing with therapeutic memory...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Enhanced Input Area */}
          <div className="border-t pt-4 mt-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Share your thoughts... I'll remember our conversation context"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button
                onClick={() => sendMessage(inputText)}
                disabled={isLoading || !inputText.trim()}
                size="icon"
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIEnhancedTherapyChat;