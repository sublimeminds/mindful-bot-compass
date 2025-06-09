
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VoiceInteractionProps {
  text?: string;
  onVoiceSettingsChange?: (settings: any) => void;
  className?: string;
}

const VoiceInteraction = ({ text, onVoiceSettingsChange, className }: VoiceInteractionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setHasApiKey(voiceService.hasApiKey());
    if (voiceService.hasApiKey()) {
      loadVoices();
    }
  }, []);

  const loadVoices = async () => {
    const availableVoices = await voiceService.getAvailableVoices();
    setVoices(availableVoices);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      voiceService.setApiKey(apiKey.trim());
      setHasApiKey(true);
      loadVoices();
      setApiKey('');
    }
  };

  const handlePlayText = async () => {
    if (!text || !hasApiKey) return;

    try {
      setIsPlaying(true);
      await voiceService.playText(text, { voiceId: selectedVoice });
    } catch (error) {
      console.error('Error playing text:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStopPlayback = () => {
    voiceService.stop();
    setIsPlaying(false);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        // Handle speech-to-text result
        console.log('Speech recognized:', transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      console.warn('Speech recognition not supported');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!hasApiKey) {
    return (
      <Card className={className}>
        <CardContent className="p-4 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-medium">Enable Voice Features</h3>
            <p className="text-sm text-muted-foreground">
              Add your ElevenLabs API key to use voice interaction
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">ElevenLabs API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleApiKeySubmit}>Save</Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Get your API key from{' '}
            <a 
              href="https://elevenlabs.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-therapy-600 hover:underline"
            >
              ElevenLabs
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            {text && (
              <>
                {isPlaying ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStopPlayback}
                  >
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayText}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                )}
              </>
            )}

            {isListening ? (
              <Button
                variant="default"
                size="sm"
                onClick={stopListening}
                className="bg-red-500 hover:bg-red-600"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={startListening}
              >
                <Mic className="h-4 w-4 mr-2" />
                Listen
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {isPlaying && <Badge variant="secondary">Playing...</Badge>}
            {isListening && <Badge variant="secondary">Listening...</Badge>}
            
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Voice Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="voice-select">Voice</Label>
                    <select
                      id="voice-select"
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      {voices.map((voice) => (
                        <option key={voice.voice_id} value={voice.voice_id}>
                          {voice.name} - {voice.labels?.gender || 'Unknown'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInteraction;
