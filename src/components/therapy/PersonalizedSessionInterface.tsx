import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacteristicTherapistAvatar } from './CharacteristicTherapistAvatar';
import { useTherapistPersonality } from '@/hooks/useTherapistCharacter';
import { Heart, MessageCircle, Brain, Lightbulb, Clock } from 'lucide-react';

interface PersonalizedSessionInterfaceProps {
  therapistId: string;
  userId: string;
  sessionId: string;
  onSessionComplete?: (sessionData: any) => void;
}

export const PersonalizedSessionInterface: React.FC<PersonalizedSessionInterfaceProps> = ({
  therapistId,
  userId,
  sessionId,
  onSessionComplete,
}) => {
  const {
    characterProfile,
    relationship,
    updateContext,
    generatePersonalizedResponse,
    getCurrentSignaturePhrase,
    getCommunicationStyle,
    rapportLevel,
    relationshipStage,
    totalSessions,
  } = useTherapistPersonality(therapistId, userId);

  const [sessionPhase, setSessionPhase] = useState<'opening' | 'exploration' | 'intervention' | 'integration' | 'closing'>('opening');
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'therapist' | 'user';
    content: string;
    timestamp: Date;
    emotion?: string;
    technique?: string;
  }>>([]);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isTherapistSpeaking, setIsTherapistSpeaking] = useState(false);
  const [sessionInsights, setSessionInsights] = useState<{
    keyMoments: string[];
    therapeuticTechniques: string[];
    emotionalJourney: string[];
  }>({
    keyMoments: [],
    therapeuticTechniques: [],
    emotionalJourney: [],
  });

  // Initialize session with personalized opening
  useEffect(() => {
    if (characterProfile && conversation.length === 0) {
      const openingMessage = generateOpeningMessage();
      setConversation([{
        type: 'therapist',
        content: openingMessage,
        timestamp: new Date(),
        emotion: 'welcoming',
        technique: 'rapport_building'
      }]);
    }
  }, [characterProfile]);

  // Update session progress based on phase
  useEffect(() => {
    const progressMap = {
      opening: 10,
      exploration: 35,
      intervention: 65,
      integration: 85,
      closing: 100
    };
    setSessionProgress(progressMap[sessionPhase]);
    updateContext({ sessionPhase, emotionalState: currentEmotion });
  }, [sessionPhase, currentEmotion, updateContext]);

  const generateOpeningMessage = (): string => {
    if (!characterProfile) return "Welcome to our session today.";

    const style = getCommunicationStyle();
    const phrase = getCurrentSignaturePhrase();
    
    // Personalize based on relationship stage and total sessions
    if (relationshipStage === 'initial') {
      return `${phrase} I'm glad you're here today. This is a space where you can feel safe to explore and grow.`;
    } else if (totalSessions > 0) {
      return `${phrase} It's good to see you again. How have you been since our last session?`;
    }

    return phrase;
  };

  const handleSendMessage = useCallback(async () => {
    if (!userMessage.trim()) return;

    // Add user message to conversation
    const newUserMessage = {
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date(),
      emotion: currentEmotion
    };

    setConversation(prev => [...prev, newUserMessage]);

    // Detect emotional state from message (simplified)
    const detectedEmotion = detectEmotionFromMessage(userMessage);
    setCurrentEmotion(detectedEmotion);

    // Generate personalized response
    setIsTherapistSpeaking(true);
    try {
      const response = await generatePersonalizedResponse({
        sessionPhase,
        userMessage,
        emotionalState: detectedEmotion,
        sessionHistory: conversation
      });

      setTimeout(() => {
        setConversation(prev => [...prev, {
          type: 'therapist',
          content: response.content,
          timestamp: new Date(),
          emotion: 'responsive',
          technique: response.therapeutic_technique
        }]);

        // Update session insights
        setSessionInsights(prev => ({
          ...prev,
          therapeuticTechniques: [...new Set([...prev.therapeuticTechniques, response.therapeutic_technique])],
          emotionalJourney: [...prev.emotionalJourney, `${detectedEmotion} → responsive`]
        }));

        setIsTherapistSpeaking(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTherapistSpeaking(false);
    }

    setUserMessage('');
  }, [userMessage, currentEmotion, sessionPhase, conversation, generatePersonalizedResponse]);

  const detectEmotionFromMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      return 'anxious';
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return 'sad';
    }
    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated') || lowerMessage.includes('mad')) {
      return 'angry';
    }
    if (lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('great')) {
      return 'happy';
    }
    if (lowerMessage.includes('confused') || lowerMessage.includes('unsure') || lowerMessage.includes('lost')) {
      return 'confused';
    }
    
    return 'neutral';
  };

  const advancePhase = () => {
    const phases: Array<typeof sessionPhase> = ['opening', 'exploration', 'intervention', 'integration', 'closing'];
    const currentIndex = phases.indexOf(sessionPhase);
    if (currentIndex < phases.length - 1) {
      setSessionPhase(phases[currentIndex + 1]);
    }
  };

  const completeSession = () => {
    const sessionData = {
      sessionId,
      therapistId,
      userId,
      conversation,
      insights: sessionInsights,
      finalRapportLevel: rapportLevel,
      sessionPhase,
      totalDuration: 45, // This would be calculated in real implementation
      effectiveness: Math.random() * 0.3 + 0.7, // Placeholder
    };

    onSessionComplete?.(sessionData);
  };

  if (!characterProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading your therapist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Session with {characterProfile.therapist_id.replace('dr-', 'Dr. ').replace('-', ' ')}</span>
                <Badge variant="outline" className="capitalize">{sessionPhase}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {characterProfile.therapy_philosophy}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Rapport Level</div>
              <div className="flex items-center space-x-2">
                <Progress value={rapportLevel * 100} className="w-20" />
                <span className="text-sm font-medium">{Math.round(rapportLevel * 100)}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Session Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <CharacteristicTherapistAvatar
              therapistId={therapistId}
              userId={userId}
              currentEmotion={currentEmotion}
              sessionPhase={sessionPhase}
              isListening={!isTherapistSpeaking}
              isSpeaking={isTherapistSpeaking}
              size="lg"
              showPersonalityIndicators={true}
              className="w-32 h-32"
            />
          </div>

          {/* Conversation */}
          <Card className="h-96 overflow-hidden">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {conversation.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.technique && (
                          <div className="text-xs opacity-70 mt-1">
                            {message.technique.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="flex-1 min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!userMessage.trim() || isTherapistSpeaking}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Controls */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={advancePhase} disabled={sessionPhase === 'closing'}>
              <Clock className="h-4 w-4 mr-2" />
              Next Phase
            </Button>
            <Button onClick={completeSession} disabled={sessionPhase !== 'closing'}>
              Complete Session
            </Button>
          </div>
        </div>

        {/* Session Insights Sidebar */}
        <div className="space-y-4">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Session Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={sessionProgress} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                Phase: {sessionPhase.charAt(0).toUpperCase() + sessionPhase.slice(1)}
              </p>
            </CardContent>
          </Card>

          {/* Techniques Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Techniques Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessionInsights.therapeuticTechniques.map((technique, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {technique.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emotional Journey */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Emotional Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {sessionInsights.emotionalJourney.slice(-3).map((journey, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    {journey}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Character Traits Active */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Character Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs">
                  <span className="font-medium">Communication:</span> {getCommunicationStyle().tone}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Approach:</span> {characterProfile.professional_background?.specializations?.[0] || 'General'}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Cultural Adaptation:</span> {getCommunicationStyle().usesMetaphors ? 'Active' : 'Standard'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};