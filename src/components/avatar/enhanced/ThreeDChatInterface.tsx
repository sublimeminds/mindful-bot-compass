import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import VoiceEnhancedAvatarV2 from './VoiceEnhancedAvatarV2';
import { EnhancedEmotionAnalyzer, type EmotionResult } from '@/services/enhanced-emotion-analyzer';

interface ConversationMessage {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  emotion?: EmotionResult;
  timestamp: Date;
}

interface ThreeDChatInterfaceProps {
  therapistId: string;
  therapistName: string;
  onMessageSent?: (message: string) => void;
  onAvatarResponse?: (response: string) => void;
  onEmotionDetected?: (emotion: EmotionResult) => void;
  enableVoiceInput?: boolean;
  enableEmotionAnalysis?: boolean;
  className?: string;
}

const ThreeDChatInterface: React.FC<ThreeDChatInterfaceProps> = ({
  therapistId,
  therapistName,
  onMessageSent,
  onAvatarResponse,
  onEmotionDetected,
  enableVoiceInput = true,
  enableEmotionAnalysis = true,
  className = "w-full h-screen"
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  
  const emotionAnalyzer = useRef(new EnhancedEmotionAnalyzer());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle sending messages
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const messageId = Date.now().toString();
    const emotion = enableEmotionAnalysis ? 
      emotionAnalyzer.current.analyze(content, {
        timeOfDay: getTimeOfDay(),
        sessionDuration: Date.now() - (messages[0]?.timestamp.getTime() || Date.now()),
        previousEmotion: currentEmotion?.emotion
      }) : undefined;

    const userMessage: ConversationMessage = {
      id: messageId,
      type: 'user',
      content,
      emotion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    if (emotion) {
      setCurrentEmotion(emotion);
      setEmotionHistory(prev => [...prev.slice(-9), emotion]); // Keep last 10 emotions
      onEmotionDetected?.(emotion);
    }

    onMessageSent?.(content);

    // Simulate avatar processing time
    setTimeout(() => {
      generateAvatarResponse(emotion);
    }, 500 + Math.random() * 1000);
  }, [messages, currentEmotion, enableEmotionAnalysis, onMessageSent, onEmotionDetected]);

  // Generate contextual avatar response
  const generateAvatarResponse = useCallback((userEmotion?: EmotionResult) => {
    setIsSpeaking(true);

    // Simple response generation based on emotion
    let response = "Thank you for sharing that with me. ";
    
    if (userEmotion) {
      switch (userEmotion.emotion) {
        case 'sad':
          response += "I can hear that you're feeling down. It's okay to feel this way, and I'm here to support you through this.";
          break;
        case 'anxious':
          response += "I notice you're feeling anxious. Let's take a moment to breathe together and explore what's causing these feelings.";
          break;
        case 'angry':
          response += "I can sense your frustration. These feelings are valid, and we can work through them together.";
          break;
        case 'happy':
          response += "It's wonderful to hear the positivity in your voice! What's been contributing to these good feelings?";
          break;
        case 'calm':
          response += "I'm glad you're feeling peaceful. This is a great space for us to continue our conversation.";
          break;
        default:
          response += "How are you feeling about what you've shared? I'm here to listen and support you.";
      }
    } else {
      response += "I'm listening and here to support you. Would you like to tell me more about what's on your mind?";
    }

    const avatarMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      type: 'avatar',
      content: response,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, avatarMessage]);
      setIsSpeaking(false);
      onAvatarResponse?.(response);
    }, 1500 + Math.random() * 1000);
  }, [onAvatarResponse]);

  // Voice input handling
  const startVoiceInput = useCallback(async () => {
    if (!enableVoiceInput) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      setAudioStream(stream);
      setIsListening(true);

      // Create audio context for voice detection
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext.current = new AudioContextClass();
        const analyzer = audioContext.current.createAnalyser();
        const source = audioContext.current.createMediaStreamSource(stream);
        source.connect(analyzer);

        // Voice activity detection could be implemented here
        // For now, we'll use a simple timer
        setTimeout(() => {
          stopVoiceInput();
          // Simulate voice-to-text result
          const simulatedText = "This is a simulated voice input message.";
          sendMessage(simulatedText);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to start voice input:', error);
      setIsListening(false);
    }
  }, [enableVoiceInput, sendMessage]);

  const stopVoiceInput = useCallback(() => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
    setIsListening(false);
  }, [audioStream]);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(currentMessage);
    }
  }, [currentMessage, sendMessage]);

  // Helper function to get time of day
  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  };

  // Format emotion for display
  const formatEmotion = (emotion: EmotionResult) => {
    return `${emotion.emotion} (${Math.round(emotion.confidence * 100)}%)`;
  };

  // Get emotion color for badge
  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      anxious: 'bg-orange-100 text-orange-800',
      calm: 'bg-green-100 text-green-800',
      grateful: 'bg-purple-100 text-purple-800',
      confused: 'bg-gray-100 text-gray-800',
      neutral: 'bg-gray-50 text-gray-600'
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  return (
    <div className={`${className} flex flex-col lg:flex-row bg-gradient-to-br from-therapy-50 to-calm-50`}>
      {/* Avatar Section */}
      <div className="lg:w-1/2 h-1/2 lg:h-full">
        <VoiceEnhancedAvatarV2
          therapistId={therapistId}
          therapistName={therapistName}
          audioStream={audioStream || undefined}
          isListening={isListening}
          isSpeaking={isSpeaking}
          userText={currentMessage}
          enableVoiceAnalysis={enableVoiceInput}
          enableEmotionDetection={enableEmotionAnalysis}
          enableLipSync={true}
          onEmotionDetected={(emotion) => {
            setCurrentEmotion(emotion);
            onEmotionDetected?.(emotion);
          }}
          className="w-full h-full"
        />
      </div>

      {/* Chat Section */}
      <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col">
        {/* Emotion History Panel */}
        {enableEmotionAnalysis && emotionHistory.length > 0 && (
          <Card className="m-4 mb-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emotional Journey</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {emotionHistory.slice(-5).map((emotion, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs ${getEmotionColor(emotion.emotion)}`}
                  >
                    {formatEmotion(emotion)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages Area */}
        <div className="flex-1 mx-4 mb-2 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-lg font-medium">Start your conversation with {therapistName}</p>
                <p className="text-sm mt-2">Share your thoughts and feelings. I'm here to listen and support you.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-therapy-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.emotion && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ml-2 ${getEmotionColor(message.emotion.emotion)}`}
                        >
                          {message.emotion.emotion}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="m-4 mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border p-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isListening || isSpeaking}
              className="flex-1 border-0 focus-visible:ring-0"
            />
            
            {enableVoiceInput && (
              <Button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isSpeaking}
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                className="px-3"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              onClick={isAudioEnabled ? () => setIsAudioEnabled(false) : () => setIsAudioEnabled(true)}
              variant="outline"
              size="sm"
              className="px-3"
            >
              {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={() => sendMessage(currentMessage)}
              disabled={!currentMessage.trim() || isListening || isSpeaking}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {(isListening || isSpeaking) && (
            <div className="mt-2 text-center">
              <Badge variant="outline" className={isListening ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}>
                {isListening ? '🎤 Listening...' : '💬 Speaking...'}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeDChatInterface;