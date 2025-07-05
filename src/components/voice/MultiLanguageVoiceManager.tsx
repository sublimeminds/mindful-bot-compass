import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Play, 
  Pause, 
  Volume2, 
  Settings,
  Languages,
  Mic,
  TestTube
} from 'lucide-react';
import { personalizedTherapistVoiceService } from '@/services/personalizedTherapistVoiceService';
import { useToast } from '@/hooks/use-toast';

interface LanguageVoiceConfig {
  language: string;
  languageName: string;
  flag: string;
  voices: {
    [therapistId: string]: {
      voiceId: string;
      voiceName: string;
      culturalAdaptations: {
        formality: number;
        warmth: number;
        pace: number;
        intonation: string;
      };
    };
  };
  culturalContext: {
    communicationStyle: 'direct' | 'indirect' | 'high-context' | 'low-context';
    therapeuticApproaches: string[];
    culturalSensitivities: string[];
  };
}

const MultiLanguageVoiceManager = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isRealTimeTranslation, setIsRealTimeTranslation] = useState(false);
  const [culturalAdaptation, setCulturalAdaptation] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast();

  // Multi-language voice configurations
  const languageConfigs: Record<string, LanguageVoiceConfig> = {
    en: {
      language: 'en',
      languageName: 'English',
      flag: '🇺🇸',
      voices: {
        'dr-sarah-chen': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Aria', culturalAdaptations: { formality: 0.7, warmth: 0.6, pace: 1.0, intonation: 'professional' } },
        'dr-maya-patel': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Charlotte', culturalAdaptations: { formality: 0.5, warmth: 0.9, pace: 0.8, intonation: 'gentle' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Liam', culturalAdaptations: { formality: 0.4, warmth: 0.8, pace: 1.2, intonation: 'energetic' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Laura', culturalAdaptations: { formality: 0.6, warmth: 1.0, pace: 0.7, intonation: 'compassionate' } },
        'dr-taylor-morgan': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sarah', culturalAdaptations: { formality: 0.6, warmth: 0.8, pace: 0.9, intonation: 'balanced' } }
      },
      culturalContext: {
        communicationStyle: 'direct',
        therapeuticApproaches: ['CBT', 'DBT', 'Mindfulness', 'Solution-Focused'],
        culturalSensitivities: ['Individual autonomy', 'Direct communication', 'Goal-oriented']
      }
    },
    es: {
      language: 'es',
      languageName: 'Español',
      flag: '🇪🇸',
      voices: {
        'dr-sarah-chen': { voiceId: 'zcAOhNBS3c14rBihAFp1', voiceName: 'Sofia', culturalAdaptations: { formality: 0.8, warmth: 0.7, pace: 0.9, intonation: 'respectful' } },
        'dr-maya-patel': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Carmen', culturalAdaptations: { formality: 0.6, warmth: 1.0, pace: 0.8, intonation: 'maternal' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Diego', culturalAdaptations: { formality: 0.5, warmth: 0.9, pace: 1.1, intonation: 'encouraging' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Elena', culturalAdaptations: { formality: 0.7, warmth: 1.0, pace: 0.7, intonation: 'nurturing' } },
        'dr-taylor-morgan': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Isabel', culturalAdaptations: { formality: 0.7, warmth: 0.8, pace: 0.9, intonation: 'harmonious' } }
      },
      culturalContext: {
        communicationStyle: 'high-context',
        therapeuticApproaches: ['Family Therapy', 'Narrative Therapy', 'Mindfulness', 'Humanistic'],
        culturalSensitivities: ['Family honor', 'Respeto', 'Personalismo', 'Collectivism']
      }
    },
    fr: {
      language: 'fr',
      languageName: 'Français',
      flag: '🇫🇷',
      voices: {
        'dr-sarah-chen': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Brigitte', culturalAdaptations: { formality: 0.9, warmth: 0.6, pace: 0.8, intonation: 'sophisticated' } },
        'dr-maya-patel': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Camille', culturalAdaptations: { formality: 0.7, warmth: 0.8, pace: 0.8, intonation: 'elegant' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Antoine', culturalAdaptations: { formality: 0.6, warmth: 0.7, pace: 1.0, intonation: 'articulate' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Isabelle', culturalAdaptations: { formality: 0.8, warmth: 0.9, pace: 0.7, intonation: 'empathetic' } },
        'dr-taylor-morgan': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Marie', culturalAdaptations: { formality: 0.8, warmth: 0.7, pace: 0.8, intonation: 'refined' } }
      },
      culturalContext: {
        communicationStyle: 'indirect',
        therapeuticApproaches: ['Psychoanalysis', 'Existential', 'Art Therapy', 'Humanistic'],
        culturalSensitivities: ['Intellectual discourse', 'Privacy', 'Formality', 'Cultural refinement']
      }
    },
    de: {
      language: 'de',
      languageName: 'Deutsch',
      flag: '🇩🇪',
      voices: {
        'dr-sarah-chen': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Ingrid', culturalAdaptations: { formality: 0.9, warmth: 0.5, pace: 0.9, intonation: 'precise' } },
        'dr-maya-patel': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Greta', culturalAdaptations: { formality: 0.7, warmth: 0.7, pace: 0.8, intonation: 'thoughtful' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Klaus', culturalAdaptations: { formality: 0.8, warmth: 0.6, pace: 1.0, intonation: 'structured' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpNrAUiJIH5a9', voiceName: 'Anna', culturalAdaptations: { formality: 0.8, warmth: 0.8, pace: 0.7, intonation: 'caring' } },
        'dr-taylor-morgan': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Eva', culturalAdaptations: { formality: 0.8, warmth: 0.7, pace: 0.8, intonation: 'methodical' } }
      },
      culturalContext: {
        communicationStyle: 'direct',
        therapeuticApproaches: ['CBT', 'Gestalt', 'Systematic', 'Behavioral'],
        culturalSensitivities: ['Punctuality', 'Thoroughness', 'Privacy', 'Professional boundaries']
      }
    },
    ja: {
      language: 'ja',
      languageName: '日本語',
      flag: '🇯🇵',
      voices: {
        'dr-sarah-chen': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Yuki', culturalAdaptations: { formality: 1.0, warmth: 0.6, pace: 0.7, intonation: 'respectful' } },
        'dr-maya-patel': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Sakura', culturalAdaptations: { formality: 0.9, warmth: 0.8, pace: 0.6, intonation: 'gentle' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Hiroshi', culturalAdaptations: { formality: 0.9, warmth: 0.7, pace: 0.8, intonation: 'encouraging' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Midori', culturalAdaptations: { formality: 1.0, warmth: 0.9, pace: 0.6, intonation: 'harmonious' } },
        'dr-taylor-morgan': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Keiko', culturalAdaptations: { formality: 0.9, warmth: 0.8, pace: 0.7, intonation: 'balanced' } }
      },
      culturalContext: {
        communicationStyle: 'high-context',
        therapeuticApproaches: ['Morita Therapy', 'Naikan', 'Mindfulness', 'Group Therapy'],
        culturalSensitivities: ['Harmony', 'Respect', 'Group dynamics', 'Indirect communication']
      }
    },
    ar: {
      language: 'ar',
      languageName: 'العربية',
      flag: '🇸🇦',
      voices: {
        'dr-sarah-chen': { voiceId: '9BWtsMINqrJLrRacOk9x', voiceName: 'Layla', culturalAdaptations: { formality: 0.9, warmth: 0.8, pace: 0.8, intonation: 'respectful' } },
        'dr-maya-patel': { voiceId: 'XB0fDUnXU5powFXDhCwa', voiceName: 'Fatima', culturalAdaptations: { formality: 0.8, warmth: 1.0, pace: 0.7, intonation: 'nurturing' } },
        'dr-alex-rodriguez': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', voiceName: 'Omar', culturalAdaptations: { formality: 0.8, warmth: 0.8, pace: 0.9, intonation: 'supportive' } },
        'dr-jordan-kim': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', voiceName: 'Amina', culturalAdaptations: { formality: 0.9, warmth: 1.0, pace: 0.6, intonation: 'compassionate' } },
        'dr-taylor-morgan': { voiceId: 'EXAVITQu4vr4xnSDxMaL', voiceName: 'Zahra', culturalAdaptations: { formality: 0.8, warmth: 0.9, pace: 0.8, intonation: 'wise' } }
      },
      culturalContext: {
        communicationStyle: 'high-context',
        therapeuticApproaches: ['Family Therapy', 'Religious Integration', 'Community-Based', 'Narrative'],
        culturalSensitivities: ['Religious considerations', 'Family honor', 'Gender roles', 'Community values']
      }
    }
  };

  const testMultiLanguageVoice = async (therapistId: string, language: string) => {
    const testKey = `${therapistId}-${language}`;
    setIsTestingVoice(testKey);
    setCurrentlyPlaying(testKey);

    try {
      const config = languageConfigs[language];
      const voiceConfig = config.voices[therapistId];
      
      if (!voiceConfig) {
        throw new Error(`Voice not available for ${therapistId} in ${language}`);
      }

      // Generate culturally appropriate test text
      const testTexts = {
        en: `Hello, I'm here to support you on your journey to better mental health. How are you feeling today?`,
        es: `Hola, estoy aquí para apoyarte en tu camino hacia una mejor salud mental. ¿Cómo te sientes hoy?`,
        fr: `Bonjour, je suis là pour vous accompagner dans votre parcours vers une meilleure santé mentale. Comment vous sentez-vous aujourd'hui?`,
        de: `Hallo, ich bin hier, um Sie auf Ihrem Weg zu besserer psychischer Gesundheit zu unterstützen. Wie fühlen Sie sich heute?`,
        ja: `こんにちは。より良い精神的健康への道のりをサポートするためにここにいます。今日はいかがお過ごしですか？`,
        ar: `مرحباً، أنا هنا لدعمك في رحلتك نحو صحة نفسية أفضل. كيف تشعر اليوم؟`
      };

      const testText = testTexts[language as keyof typeof testTexts];
      
      // Use the personalized voice service with cultural adaptations
      const emotionalContext = {
        primaryEmotion: 'neutral',
        intensity: 0.5,
        supportLevel: 'medium' as const,
        crisisLevel: false
      };

      // Temporarily set the language and cultural context
      const originalService = personalizedTherapistVoiceService;
      
      // Generate speech with cultural adaptations
      const audioUrl = await originalService.generateTherapeuticSpeech(
        testText,
        emotionalContext,
        therapistId
      );
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setCurrentlyPlaying(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
        
        toast({
          title: `${config.flag} Voice Test`,
          description: `Testing ${voiceConfig.voiceName} in ${config.languageName}`,
        });
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error testing multi-language voice:', error);
      toast({
        title: "Voice Test Failed",
        description: `Could not test voice in ${languageConfigs[language].languageName}`,
        variant: "destructive"
      });
      setCurrentlyPlaying(null);
    } finally {
      setIsTestingVoice(null);
    }
  };

  const stopCurrentAudio = () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setCurrentlyPlaying(null);
  };

  const getCurrentConfig = () => languageConfigs[selectedLanguage];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Multi-Language Voice Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="languages" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Context</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Language Selection */}
            <TabsContent value="languages" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose language" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languageConfigs).map(([code, config]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <span>{config.flag}</span>
                            <span>{config.languageName}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Voice Tests for Selected Language */}
                <div className="space-y-4">
                  <h4 className="font-medium">Test Therapist Voices in {getCurrentConfig().languageName}</h4>
                  <div className="grid gap-3">
                    {Object.entries(getCurrentConfig().voices).map(([therapistId, voiceConfig]) => (
                      <div
                        key={therapistId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{voiceConfig.voiceName}</span>
                            <Badge variant="outline" className="text-xs">
                              {voiceConfig.culturalAdaptations.intonation}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Therapist: {therapistId.replace('dr-', '').replace('-', ' ')}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {currentlyPlaying === `${therapistId}-${selectedLanguage}` ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={stopCurrentAudio}
                              className="gap-2"
                            >
                              <Pause className="h-4 w-4" />
                              Stop
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testMultiLanguageVoice(therapistId, selectedLanguage)}
                              disabled={isTestingVoice === `${therapistId}-${selectedLanguage}`}
                              className="gap-2"
                            >
                              {isTestingVoice === `${therapistId}-${selectedLanguage}` ? (
                                <>
                                  <TestTube className="h-4 w-4 animate-pulse" />
                                  Testing...
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Test
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Cultural Context */}
            <TabsContent value="cultural" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Cultural Context for {getCurrentConfig().languageName}</h4>
                
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Communication Style</h5>
                    <Badge variant="outline" className="mb-2">
                      {getCurrentConfig().culturalContext.communicationStyle}
                    </Badge>
                    <p className="text-sm text-blue-800">
                      Voice delivery and pacing adapted for {getCurrentConfig().culturalContext.communicationStyle} communication patterns.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-900 mb-2">Therapeutic Approaches</h5>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {getCurrentConfig().culturalContext.therapeuticApproaches.map((approach) => (
                        <Badge key={approach} variant="secondary" className="text-xs">
                          {approach}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-green-800">
                      Therapy approaches culturally adapted for {getCurrentConfig().languageName} speakers.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h5 className="font-medium text-purple-900 mb-2">Cultural Sensitivities</h5>
                    <div className="space-y-1">
                      {getCurrentConfig().culturalContext.culturalSensitivities.map((sensitivity) => (
                        <div key={sensitivity} className="text-sm text-purple-800">
                          • {sensitivity}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Translation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically translate therapy sessions between languages
                    </p>
                  </div>
                  <Switch
                    checked={isRealTimeTranslation}
                    onCheckedChange={setIsRealTimeTranslation}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cultural Adaptation</Label>
                    <p className="text-sm text-muted-foreground">
                      Adapt voice tone and approach based on cultural context
                    </p>
                  </div>
                  <Switch
                    checked={culturalAdaptation}
                    onCheckedChange={setCulturalAdaptation}
                  />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Language Features</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Native pronunciation and intonation</li>
                    <li>• Cultural context awareness</li>
                    <li>• Therapeutic approach adaptation</li>
                    <li>• Real-time translation capabilities</li>
                    <li>• Cross-cultural sensitivity training</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiLanguageVoiceManager;