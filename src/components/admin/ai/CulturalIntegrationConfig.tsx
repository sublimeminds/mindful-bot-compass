import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Users, Brain, Languages, MapPin, Heart } from 'lucide-react';

interface CulturalConfig {
  region: string;
  languages: string[];
  preferredModel: string;
  culturalAdaptations: string[];
  isActive: boolean;
  qualityScore: number;
}

const CulturalIntegrationConfig = () => {
  const [culturalConfigs, setCulturalConfigs] = useState<CulturalConfig[]>([
    {
      region: 'North America',
      languages: ['English', 'Spanish', 'French'],
      preferredModel: 'claude-sonnet-4-20250514',
      culturalAdaptations: ['Direct Communication', 'Individual Focused', 'Time Conscious'],
      isActive: true,
      qualityScore: 0.92
    },
    {
      region: 'East Asia',
      languages: ['Chinese', 'Japanese', 'Korean'],
      preferredModel: 'claude-opus-4-20250514',
      culturalAdaptations: ['Indirect Communication', 'Collective Harmony', 'Face Saving'],
      isActive: true,
      qualityScore: 0.89
    },
    {
      region: 'Europe',
      languages: ['English', 'German', 'French', 'Italian', 'Spanish'],
      preferredModel: 'claude-sonnet-4-20250514',
      culturalAdaptations: ['Formal Approach', 'Privacy Focused', 'Professional Boundaries'],
      isActive: true,
      qualityScore: 0.94
    },
    {
      region: 'Middle East & North Africa',
      languages: ['Arabic', 'Persian', 'Turkish', 'Hebrew'],
      preferredModel: 'claude-opus-4-20250514',
      culturalAdaptations: ['Family Oriented', 'Religious Sensitivity', 'Honor Based'],
      isActive: true,
      qualityScore: 0.87
    },
    {
      region: 'Sub-Saharan Africa',
      languages: ['English', 'French', 'Swahili', 'Hausa'],
      preferredModel: 'claude-sonnet-4-20250514',
      culturalAdaptations: ['Community Focused', 'Oral Tradition', 'Ubuntu Philosophy'],
      isActive: true,
      qualityScore: 0.85
    },
    {
      region: 'South Asia',
      languages: ['Hindi', 'English', 'Bengali', 'Urdu'],
      preferredModel: 'claude-opus-4-20250514',
      culturalAdaptations: ['Hierarchical Respect', 'Family Involvement', 'Spiritual Integration'],
      isActive: true,
      qualityScore: 0.90
    }
  ]);

  const [adaptationSettings, setAdaptationSettings] = useState({
    autoDetectCulture: true,
    adaptCommunicationStyle: true,
    adaptTherapyApproach: true,
    includeReligiousConsiderations: true,
    adaptScheduling: true,
    enableMultilingual: true
  });

  const availableModels = [
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514', 
    'gpt-4.1-2025-04-14'
  ];

  const communicationStyles = [
    { name: 'Direct', description: 'Clear, straightforward communication' },
    { name: 'Indirect', description: 'Subtle, context-dependent communication' },
    { name: 'High Context', description: 'Relationship-focused, implicit meaning' },
    { name: 'Low Context', description: 'Explicit, detailed information sharing' }
  ];

  const therapyApproaches = [
    { name: 'Individual Focused', description: 'Personal autonomy and self-reliance' },
    { name: 'Family Centered', description: 'Involving family in therapeutic process' },
    { name: 'Community Based', description: 'Social support and collective healing' },
    { name: 'Spiritual Integrated', description: 'Including spiritual and religious elements' }
  ];

  const toggleConfigStatus = (region: string) => {
    setCulturalConfigs(prev => prev.map(config => 
      config.region === region ? { ...config, isActive: !config.isActive } : config
    ));
  };

  const updateModelPreference = (region: string, model: string) => {
    setCulturalConfigs(prev => prev.map(config => 
      config.region === region ? { ...config, preferredModel: model } : config
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Cultural AI Integration</h2>
          <p className="text-gray-400">Configure culturally-adapted AI models and therapy approaches</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Globe className="h-4 w-4 mr-2" />
          Save Cultural Settings
        </Button>
      </div>

      {/* Global Cultural Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Global Cultural Adaptation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(adaptationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <label className="text-white text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <Switch 
                  checked={value}
                  onCheckedChange={(checked) => 
                    setAdaptationSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Configurations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {culturalConfigs.map((config) => (
          <Card key={config.region} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {config.region}
                </CardTitle>
                <Switch 
                  checked={config.isActive}
                  onCheckedChange={() => toggleConfigStatus(config.region)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Languages */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
                  <Languages className="h-4 w-4 mr-1" />
                  Supported Languages
                </label>
                <div className="flex flex-wrap gap-1">
                  {config.languages.map(lang => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Model */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  Preferred AI Model
                </label>
                <Select 
                  value={config.preferredModel} 
                  onValueChange={(value) => updateModelPreference(config.region, value)}
                >
                  <SelectTrigger className="bg-gray-600 border-gray-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cultural Adaptations */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  Cultural Adaptations
                </label>
                <div className="flex flex-wrap gap-1">
                  {config.culturalAdaptations.map(adaptation => (
                    <Badge key={adaptation} className="bg-purple-100 text-purple-800 text-xs">
                      {adaptation}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Quality Score */}
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">Cultural Adaptation Score</span>
                <span className="text-sm font-bold text-green-400">
                  {(config.qualityScore * 100).toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Communication Styles Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Communication Style Adaptations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communicationStyles.map(style => (
              <div key={style.name} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{style.name}</h3>
                  <Switch defaultChecked />
                </div>
                <p className="text-sm text-gray-400">{style.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Therapy Approach Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Culturally-Adapted Therapy Approaches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {therapyApproaches.map(approach => (
              <div key={approach.name} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{approach.name}</h3>
                  <Switch defaultChecked />
                </div>
                <p className="text-sm text-gray-400">{approach.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cultural Adaptation Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">94%</div>
              <div className="text-sm text-gray-400">Cultural Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">89%</div>
              <div className="text-sm text-gray-400">User Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">156</div>
              <div className="text-sm text-gray-400">Cultures Supported</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">47</div>
              <div className="text-sm text-gray-400">Languages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CulturalIntegrationConfig;