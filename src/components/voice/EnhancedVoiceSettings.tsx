import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  Play,
  Pause,
  Key,
  TestTube,
  Globe,
  Mic,
  Speaker
} from 'lucide-react';
import { personalizedTherapistVoiceService } from '@/services/personalizedTherapistVoiceService';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';
import { useToast } from '@/hooks/use-toast';

interface VoicePreferences {
  enabled: boolean;
  volume: number;
  speed: number;
  autoPlay: boolean;
  preferredLanguage: string;
  emotionalAdaptation: boolean;
}

const EnhancedVoiceSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [preferences, setPreferences] = useState<VoicePreferences>({
    enabled: true,
    volume: 80,
    speed: 1.0,
    autoPlay: true,
    preferredLanguage: 'en',
    emotionalAdaptation: true
  });
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = localStorage.getItem('voice_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    // Check if API key is set
    setIsApiKeySet(personalizedTherapistVoiceService.hasApiKey());
    
    // Load API key for display (masked)
    const savedKey = localStorage.getItem('elevenlabs_api_key');
    if (savedKey) {
      setApiKey('••••••••••••••••••••••••••••••••');
    }
  }, []);

  const savePreferences = (newPreferences: VoicePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('voice_preferences', JSON.stringify(newPreferences));
  };

  const handleSetApiKey = () => {
    if (apiKey && !apiKey.includes('•')) {
      personalizedTherapistVoiceService.setApiKey(apiKey);
      setIsApiKeySet(true);
      setApiKey('••••••••••••••••••••••••••••••••');
      toast({
        title: "API Key Saved",
        description: "ElevenLabs API key has been configured successfully.",
      });
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('elevenlabs_api_key');
    setIsApiKeySet(false);
    setApiKey('');
    toast({
      title: "API Key Removed",
      description: "ElevenLabs API key has been cleared.",
      variant: "destructive"
    });
  };

  const testTherapistVoice = async (therapistId: string) => {
    if (!isApiKeySet) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key first.",
        variant: "destructive"
      });
      return;
    }

    setIsTestingVoice(therapistId);
    setCurrentlyPlaying(therapistId);

    try {
      const persona = therapistPersonas[therapistId];
      const testText = `Hello! I'm ${persona.name}. I specialize in ${persona.personality.approachStyle} therapy and I'm here to support you on your journey to better mental health.`;
      
      const audioUrl = await personalizedTherapistVoiceService.testTherapistVoice(therapistId, testText);
      
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.volume = preferences.volume / 100;
        
        audio.onended = () => {
          setCurrentlyPlaying(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
        
        toast({
          title: "Voice Test Playing",
          description: `Testing ${persona.name}'s voice...`,
        });
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error testing voice:', error);
      toast({
        title: "Voice Test Failed",
        description: "Could not generate voice sample. Please check your API key.",
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

  const availableTherapists = Object.values(therapistPersonas);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Speaker className="h-5 w-5" />
            Enhanced Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api-key" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api-key">API Key</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="therapists">Therapist Voices</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* API Key Configuration */}
            <TabsContent value="api-key" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">ElevenLabs API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your ElevenLabs API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSetApiKey}
                      disabled={!apiKey || apiKey.includes('•')}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Set Key
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get your API key from{' '}
                    <a 
                      href="https://elevenlabs.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      elevenlabs.io
                    </a>
                  </p>
                </div>

                {isApiKeySet && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">API Key Configured</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearApiKey}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear Key
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Voice Preferences */}
            <TabsContent value="preferences" className="space-y-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Voice Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow therapists to speak their responses
                    </p>
                  </div>
                  <Switch
                    checked={preferences.enabled}
                    onCheckedChange={(enabled) => 
                      savePreferences({ ...preferences, enabled })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Voice Volume: {preferences.volume}%</Label>
                  <Slider
                    value={[preferences.volume]}
                    onValueChange={([volume]) => 
                      savePreferences({ ...preferences, volume })
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Speech Speed: {preferences.speed}x</Label>
                  <Slider
                    value={[preferences.speed]}
                    onValueChange={([speed]) => 
                      savePreferences({ ...preferences, speed })
                    }
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-play Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play voice responses
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoPlay}
                    onCheckedChange={(autoPlay) => 
                      savePreferences({ ...preferences, autoPlay })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emotional Adaptation</Label>
                    <p className="text-sm text-muted-foreground">
                      Adapt voice tone based on your emotions
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emotionalAdaptation}
                    onCheckedChange={(emotionalAdaptation) => 
                      savePreferences({ ...preferences, emotionalAdaptation })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* Therapist Voices */}
            <TabsContent value="therapists" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test different therapist voices to find your preferred therapeutic experience.
                </p>
                
                <div className="grid gap-4">
                  {availableTherapists.map((persona) => (
                    <div
                      key={persona.therapistId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{persona.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {persona.personality.approachStyle.charAt(0).toUpperCase() + 
                           persona.personality.approachStyle.slice(1)} Therapy
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {personalizedTherapistVoiceService.getAvailableTherapistVoices()
                            .find(v => v.therapistId === persona.therapistId)?.voiceName || 'Custom'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentlyPlaying === persona.therapistId ? (
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
                            onClick={() => testTherapistVoice(persona.therapistId)}
                            disabled={!isApiKeySet || isTestingVoice === persona.therapistId}
                            className="gap-2"
                          >
                            {isTestingVoice === persona.therapistId ? (
                              <>
                                <TestTube className="h-4 w-4 animate-pulse" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Test Voice
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <Select
                    value={preferences.preferredLanguage}
                    onValueChange={(preferredLanguage) => 
                      savePreferences({ ...preferences, preferredLanguage })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="pl">Polish</SelectItem>
                      <SelectItem value="tr">Turkish</SelectItem>
                      <SelectItem value="ru">Russian</SelectItem>
                      <SelectItem value="nl">Dutch</SelectItem>
                      <SelectItem value="cs">Czech</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ko">Korean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Voice Features</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Real-time emotional adaptation</li>
                    <li>• Crisis-aware voice modulation</li>
                    <li>• Therapeutic approach-specific tones</li>
                    <li>• Multi-language support</li>
                    <li>• Lip-sync with 3D avatars</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">Privacy Note</h4>
                  <p className="text-sm text-amber-800">
                    Your API key is stored locally and never transmitted to our servers. 
                    Voice generation happens directly with ElevenLabs.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVoiceSettings;