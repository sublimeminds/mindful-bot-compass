import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRealTimeTranslation } from '@/hooks/useRealTimeTranslation';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { Send, Languages, RotateCcw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealTimeTranslationChatProps {
  sessionId: string;
  sessionType: 'therapy' | 'chat' | 'crisis';
  onMessageTranslated?: (originalText: string, translatedText: string) => void;
}

export function RealTimeTranslationChat({
  sessionId,
  sessionType,
  onMessageTranslated
}: RealTimeTranslationChatProps) {
  const { supportedLanguages, currentLanguage } = useEnhancedLanguage();
  const [targetLanguage, setTargetLanguage] = useState(currentLanguage.code);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    addMessage,
    retranslateAll,
    isTranslating,
    getStats,
    startTranslationSession,
    translationSession
  } = useRealTimeTranslation({
    sessionId,
    sessionType,
    targetLanguage,
    autoTranslate: true,
    preserveEmotionalContext: sessionType === 'therapy' || sessionType === 'crisis'
  });

  const stats = getStats();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!translationSession) {
      startTranslationSession();
    }
  }, [translationSession, startTranslationSession]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const originalText = newMessage;
    setNewMessage('');

    const translatedText = await addMessage(originalText, true, {
      therapyApproach: sessionType === 'therapy' ? 'supportive' : undefined
    });

    onMessageTranslated?.(originalText, translatedText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setTargetLanguage(newLanguage);
    if (messages.length > 0) {
      await retranslateAll(newLanguage);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Real-Time Translation
            <Badge variant="secondary" className="capitalize">
              {sessionType}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={targetLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => retranslateAll()}
                disabled={isTranslating}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats.totalMessages > 0 && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Messages: {stats.totalMessages}</span>
            <span>Translated: {stats.translatedMessages}</span>
            <span>Quality: {(stats.averageQuality * 100).toFixed(0)}%</span>
            {stats.errorMessages > 0 && (
              <span className="text-destructive">Errors: {stats.errorMessages}</span>
            )}
          </div>
        )}
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start typing to see real-time translations
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col space-y-1 p-3 rounded-lg",
                "bg-muted/50 border"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.isTranslating && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  {message.quality && (
                    <Badge variant="outline" className="text-xs">
                      {(message.quality * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">
                    {message.sourceLanguage} → {message.targetLanguage}
                  </span>
                </div>
              </div>

              {/* Original Text */}
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Original: </span>
                {message.originalText}
              </div>

              {/* Translated Text */}
              <div className="text-sm">
                <span className="font-medium">Translation: </span>
                {message.isTranslating ? (
                  <span className="text-muted-foreground italic">Translating...</span>
                ) : message.error ? (
                  <span className="text-destructive">{message.error}</span>
                ) : (
                  message.translatedText
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Type a message... (will be translated to ${
              supportedLanguages.find(l => l.code === targetLanguage)?.nativeName
            })`}
            disabled={isTranslating}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTranslating}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}