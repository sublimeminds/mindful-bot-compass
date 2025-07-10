import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  Settings, 
  Key, 
  Mic,
  VolumeX,
  TrendingUp,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';
import { smartVoiceRouter } from '@/services/smartVoiceRouter';
import { enhancedTherapyVoiceService } from '@/services/enhancedTherapyVoiceService';

const SmartVoiceSettings = () => {
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [humeApiKey, setHumeApiKey] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState([0.8]);
  const [qualityPreference, setQualityPreference] = useState<'premium' | 'standard' | 'budget'>('standard');
  const [showElevenLabsInput, setShowElevenLabsInput] = useState(false);
  const [showHumeInput, setShowHumeInput] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);

  useEffect(() => {
    // Load saved API keys
    const savedElevenLabs = localStorage.getItem('elevenlabs_api_key');
    const savedHume = localStorage.getItem('hume_api_key');
    
    if (savedElevenLabs) {
      setElevenLabsApiKey(savedElevenLabs);
      enhancedTherapyVoiceService.setApiKey(savedElevenLabs);
    } else {
      setShowElevenLabsInput(true);
    }

    if (savedHume) {
      setHumeApiKey(savedHume);
    } else {
      setShowHumeInput(true);
    }

    // Load usage stats
    updateUsageStats();
  }, []);

  const updateUsageStats = () => {
    const stats = smartVoiceRouter.getUsageAnalytics();
    setUsageStats(stats);
  };

  const handleSaveElevenLabsKey = () => {
    if (elevenLabsApiKey.trim()) {
      enhancedTherapyVoiceService.setApiKey(elevenLabsApiKey.trim());
      localStorage.setItem('elevenlabs_api_key', elevenLabsApiKey.trim());
      setShowElevenLabsInput(false);
    }
  };

  const handleSaveHumeKey = () => {
    if (humeApiKey.trim()) {
      localStorage.setItem('hume_api_key', humeApiKey.trim());
      setShowHumeInput(false);
    }
  };

  const testSmartVoice = async () => {
    const testTexts = [
      'This is a short test message for premium voice quality.',
      'This is a longer test message that would typically be routed to our cost-efficient voice service because it contains more content and would benefit from the smart routing system that automatically selects the best voice provider based on content length, emotional context, and cost considerations.',
    ];
    
    try {
      for (const text of testTexts) {
        const result = await smartVoiceRouter.routeVoiceRequest(
          text, 
          'dr-sarah-chen',
          undefined,
          qualityPreference
        );
        console.log('Voice routing result:', result);
      }
      updateUsageStats();
    } catch (error) {
      console.error('Voice test failed:', error);
    }
  };

  const getQualityBadgeColor = (preference: string) => {
    switch (preference) {
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'budget': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Smart Voice Settings</span>
            <Badge className={getQualityBadgeColor(qualityPreference)}>
              {qualityPreference}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Keys Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Voice Service Providers</h3>
            
            {/* ElevenLabs API Key */}
            {showElevenLabsInput && (
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-key" className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>ElevenLabs API Key (Premium Voice)</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="elevenlabs-key"
                    type="password"
                    placeholder="Enter ElevenLabs API key"
                    value={elevenLabsApiKey}
                    onChange={(e) => setElevenLabsApiKey(e.target.value)}
                  />
                  <Button onClick={handleSaveElevenLabsKey} size="sm">
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href="https://elevenlabs.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-therapy-600 hover:underline"
                  >
                    ElevenLabs
                  </a>
                </p>
              </div>
            )}

            {/* Hume AI API Key */}
            {showHumeInput && (
              <div className="space-y-2">
                <Label htmlFor="hume-key" className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>Hume AI API Key (Cost-Efficient Voice)</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="hume-key"
                    type="password"
                    placeholder="Enter Hume AI API key"
                    value={humeApiKey}
                    onChange={(e) => setHumeApiKey(e.target.value)}
                  />
                  <Button onClick={handleSaveHumeKey} size="sm">
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a 
                    href="https://beta.hume.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-therapy-600 hover:underline"
                  >
                    Hume AI
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Voice Preferences</h3>
            
            {/* Voice Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-enabled" className="flex items-center space-x-2">
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span>Smart Voice Responses</span>
              </Label>
              <Switch
                id="voice-enabled"
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>

            {/* Quality Preference */}
            <div className="space-y-2">
              <Label>Voice Quality Preference</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['budget', 'standard', 'premium'] as const).map((quality) => (
                  <Button
                    key={quality}
                    variant={qualityPreference === quality ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setQualityPreference(quality)}
                    className="flex items-center space-x-1"
                  >
                    {quality === 'premium' && <Zap className="h-3 w-3" />}
                    {quality === 'standard' && <Shield className="h-3 w-3" />}
                    {quality === 'budget' && <DollarSign className="h-3 w-3" />}
                    <span className="capitalize">{quality}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Smart routing automatically selects the best voice service based on content and context
              </p>
            </div>

            {/* Volume Control */}
            {voiceEnabled && (
              <div className="space-y-2">
                <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Test Voice */}
          <Button 
            onClick={testSmartVoice} 
            variant="outline" 
            className="w-full"
            disabled={!voiceEnabled}
          >
            <Mic className="h-4 w-4 mr-2" />
            Test Smart Voice Routing
          </Button>
        </CardContent>
      </Card>

      {/* Usage Analytics */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Voice Usage Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  ${usageStats.totalDailyCost.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Daily Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${usageStats.costSavings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Saved Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {usageStats.avgQuality.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {usageStats.totalRequests}
                </div>
                <div className="text-xs text-muted-foreground">Requests</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Provider Usage</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>ElevenLabs:</span>
                  <span>{usageStats.dailyUsage.elevenlabs.characters} chars (${usageStats.dailyUsage.elevenlabs.cost.toFixed(2)})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Hume AI:</span>
                  <span>{usageStats.dailyUsage.hume.characters} chars (${usageStats.dailyUsage.hume.cost.toFixed(2)})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Browser TTS:</span>
                  <span>{usageStats.dailyUsage.browser.characters} chars (Free)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartVoiceSettings;