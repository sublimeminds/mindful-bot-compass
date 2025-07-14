import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAITranslation } from '@/hooks/useAITranslation';
import { useEnhancedLanguage } from '@/hooks/useEnhancedLanguage';
import { Languages, Loader2, RefreshCw, Star, AlertCircle } from 'lucide-react';

interface TranslationWidgetProps {
  initialText?: string;
  contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general';
  onTranslationComplete?: (translatedText: string) => void;
  showFeedback?: boolean;
}

export function TranslationWidget({
  initialText = '',
  contextType = 'general',
  onTranslationComplete,
  showFeedback = true
}: TranslationWidgetProps) {
  const { supportedLanguages, currentLanguage } = useEnhancedLanguage();
  const {
    translateText,
    isTranslating,
    error,
    lastTranslation,
    submitFeedback,
    userPreferences
  } = useAITranslation({ contextType });

  const [sourceText, setSourceText] = useState(initialText);
  const [targetLanguage, setTargetLanguage] = useState(currentLanguage.code);
  const [translatedText, setTranslatedText] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (lastTranslation) {
      setTranslatedText(lastTranslation.translatedText);
      onTranslationComplete?.(lastTranslation.translatedText);
    }
  }, [lastTranslation, onTranslationComplete]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    try {
      const result = await translateText(sourceText, targetLanguage, {
        contextType,
        preserveEmotionalContext: contextType === 'therapeutic' || contextType === 'crisis'
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(`Translated with ${(result.quality * 100).toFixed(0)}% quality confidence`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleFeedback = async (rating: number, feedbackType: 'accuracy' | 'cultural' | 'therapeutic') => {
    if (!lastTranslation) return;

    const success = await submitFeedback(
      'translation-id', // This would come from the translation response
      rating,
      feedbackType,
      `${contextType} translation feedback`
    );

    if (success) {
      toast.success('Thank you for helping improve our translations!');
      setShowFeedbackForm(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          AI Translation
          <Badge variant="secondary" className="capitalize">
            {contextType}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Text to Translate
            </label>
            <Textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="min-h-[120px] resize-none"
              disabled={isTranslating}
            />
          </div>

          {/* Target Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Translate to
            </label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Translation Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
            size="lg"
            className="min-w-[200px]"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Translate
              </>
            )}
          </Button>
        </div>

        {/* Translated Text */}
        {translatedText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground/80">
                Translation Result
              </label>
              {lastTranslation && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {lastTranslation.cached && (
                    <Badge variant="outline" className="text-xs">
                      Cached
                    </Badge>
                  )}
                  <span>Quality: {(lastTranslation.quality * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-sm whitespace-pre-wrap">{translatedText}</p>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && translatedText && !showFeedbackForm && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedbackForm(true)}
            >
              <Star className="mr-2 h-4 w-4" />
              Rate Translation
            </Button>
          </div>
        )}

        {showFeedbackForm && (
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">How was this translation?</h4>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="outline"
                      size="sm"
                      onClick={() => handleFeedback(rating, 'accuracy')}
                      className="flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      {rating}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFeedbackForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cultural Adaptations */}
        {lastTranslation?.culturalAdaptations && lastTranslation.culturalAdaptations.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Cultural Adaptations Applied
            </label>
            <div className="flex gap-1 flex-wrap">
              {lastTranslation.culturalAdaptations.map((adaptation, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {adaptation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}