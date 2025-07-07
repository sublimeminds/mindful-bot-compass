import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Mic, User, Zap, Settings, Volume2, Eye, Heart } from 'lucide-react';

interface VoiceConfig {
  id: string;
  name: string;
  voiceId: string;
  gender: 'male' | 'female';
  accent: string;
  emotionalRange: number;
  aiModelCompatibility: string[];
  culturalSuitability: string[];
  isActive: boolean;
}

interface AvatarConfig {
  id: string;
  name: string;
  personality: string;
  appearance: string;
  culturalBackground: string;
  emotionalExpressions: string[];
  aiModelSync: boolean;
  voiceSync: boolean;
  isActive: boolean;
}

const VoiceAvatarSyncConfig = () => {
  const [voiceConfigs, setVoiceConfigs] = useState<VoiceConfig[]>([
    {
      id: '1',
      name: 'Professional Therapist',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
      gender: 'female',
      accent: 'American',
      emotionalRange: 85,
      aiModelCompatibility: ['claude-opus-4-20250514', 'claude-sonnet-4-20250514'],
      culturalSuitability: ['North America', 'Europe'],
      isActive: true
    },
    {
      id: '2',
      name: 'Calm Counselor',
      voiceId: 'TX3LPaxmHKxFdv7VOQHJ', // Liam
      gender: 'male',
      accent: 'British',
      emotionalRange: 75,
      aiModelCompatibility: ['claude-sonnet-4-20250514'],
      culturalSuitability: ['Europe', 'North America'],
      isActive: true
    },
    {
      id: '3',
      name: 'Compassionate Guide',
      voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte
      gender: 'female',
      accent: 'Neutral',
      emotionalRange: 90,
      aiModelCompatibility: ['claude-opus-4-20250514'],
      culturalSuitability: ['Global'],
      isActive: true
    }
  ]);

  const [avatarConfigs, setAvatarConfigs] = useState<AvatarConfig[]>([
    {
      id: '1',
      name: 'Dr. Sarah Mitchell',
      personality: 'Empathetic Professional',
      appearance: 'Middle-aged, Professional',
      culturalBackground: 'Western',
      emotionalExpressions: ['Calm', 'Encouraging', 'Concerned', 'Pleased'],
      aiModelSync: true,
      voiceSync: true,
      isActive: true
    },
    {
      id: '2',
      name: 'Dr. Kenji Tanaka',
      personality: 'Wise Mentor',
      appearance: 'Senior, Gentle',
      culturalBackground: 'East Asian',
      emotionalExpressions: ['Peaceful', 'Thoughtful', 'Compassionate', 'Respectful'],
      aiModelSync: true,
      voiceSync: true,
      isActive: true
    },
    {
      id: '3',
      name: 'Dr. Amara Johnson',
      personality: 'Warm Supporter',
      appearance: 'Young Adult, Friendly',
      culturalBackground: 'Diverse',
      emotionalExpressions: ['Enthusiastic', 'Understanding', 'Optimistic', 'Caring'],
      aiModelSync: true,
      voiceSync: true,
      isActive: true
    }
  ]);

  const [syncSettings, setSyncSettings] = useState({
    realTimeEmotionSync: true,
    culturalAdaptation: true,
    voiceEmotionMatching: true,
    avatarGestureSync: true,
    contextualExpressions: true,
    multiModalCoherence: true,
    responseTimeOptimization: true,
    emergencyModeSync: true
  });

  const [performanceSettings, setPerformanceSettings] = useState({
    voiceQuality: [85],
    avatarQuality: [80], 
    syncLatency: [200],
    emotionalAccuracy: [90]
  });

  const toggleVoiceStatus = (voiceId: string) => {
    setVoiceConfigs(prev => prev.map(voice => 
      voice.id === voiceId ? { ...voice, isActive: !voice.isActive } : voice
    ));
  };

  const toggleAvatarStatus = (avatarId: string) => {
    setAvatarConfigs(prev => prev.map(avatar => 
      avatar.id === avatarId ? { ...avatar, isActive: !avatar.isActive } : avatar
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Voice & Avatar Synchronization</h2>
          <p className="text-gray-400">Configure multi-modal AI, voice, and avatar coordination</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          Save Sync Settings
        </Button>
      </div>

      {/* Global Sync Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Multi-Modal Synchronization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(syncSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <label className="text-white text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <Switch 
                  checked={value}
                  onCheckedChange={(checked) => 
                    setSyncSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Configurations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Mic className="h-5 w-5 mr-2" />
            ElevenLabs Voice Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {voiceConfigs.map((voice) => (
              <div key={voice.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{voice.name}</h3>
                  <Switch 
                    checked={voice.isActive}
                    onCheckedChange={() => toggleVoiceStatus(voice.id)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-600 rounded">
                      <p className="text-blue-400 font-bold">{voice.gender}</p>
                      <p className="text-gray-400">Gender</p>
                    </div>
                    <div className="text-center p-2 bg-gray-600 rounded">
                      <p className="text-green-400 font-bold">{voice.accent}</p>
                      <p className="text-gray-400">Accent</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Emotional Range</label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[voice.emotionalRange]}
                        max={100}
                        step={1}
                        className="flex-1"
                        disabled
                      />
                      <span className="text-xs text-white w-8">{voice.emotionalRange}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">AI Model Compatibility</label>
                    <div className="flex flex-wrap gap-1">
                      {voice.aiModelCompatibility.map(model => (
                        <Badge key={model} variant="outline" className="text-xs">
                          {model.split('-')[1]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Cultural Suitability</label>
                    <div className="flex flex-wrap gap-1">
                      {voice.culturalSuitability.map(culture => (
                        <Badge key={culture} className="bg-purple-100 text-purple-800 text-xs">
                          {culture}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Avatar Configurations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            3D Avatar Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {avatarConfigs.map((avatar) => (
              <div key={avatar.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{avatar.name}</h3>
                  <Switch 
                    checked={avatar.isActive}
                    onCheckedChange={() => toggleAvatarStatus(avatar.id)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Personality</label>
                    <p className="text-sm text-white">{avatar.personality}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Appearance</label>
                    <p className="text-sm text-white">{avatar.appearance}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Cultural Background</label>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {avatar.culturalBackground}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Emotional Expressions</label>
                    <div className="flex flex-wrap gap-1">
                      {avatar.emotionalExpressions.map(expression => (
                        <Badge key={expression} variant="outline" className="text-xs">
                          {expression}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">AI Sync</span>
                      <Switch checked={avatar.aiModelSync} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Voice Sync</span>
                      <Switch checked={avatar.voiceSync} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Performance & Quality Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-3 block flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice Quality: {performanceSettings.voiceQuality[0]}%
                </label>
                <Slider
                  value={performanceSettings.voiceQuality}
                  onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, voiceQuality: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-3 block flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Avatar Quality: {performanceSettings.avatarQuality[0]}%
                </label>
                <Slider
                  value={performanceSettings.avatarQuality}
                  onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, avatarQuality: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-3 block flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Sync Latency: {performanceSettings.syncLatency[0]}ms
                </label>
                <Slider
                  value={performanceSettings.syncLatency}
                  onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, syncLatency: value }))}
                  min={50}
                  max={500}
                  step={25}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-3 block flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Emotional Accuracy: {performanceSettings.emotionalAccuracy[0]}%
                </label>
                <Slider
                  value={performanceSettings.emotionalAccuracy}
                  onValueChange={(value) => setPerformanceSettings(prev => ({ ...prev, emotionalAccuracy: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Sync Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Multi-Modal Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-sm text-green-200">AI-Voice Sync</div>
            </div>
            <div className="text-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">94%</div>
              <div className="text-sm text-blue-200">Voice-Avatar Sync</div>
            </div>
            <div className="text-center p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">156ms</div>
              <div className="text-sm text-purple-200">Avg Latency</div>
            </div>
            <div className="text-center p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">92%</div>
              <div className="text-sm text-yellow-200">Cultural Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAvatarSyncConfig;