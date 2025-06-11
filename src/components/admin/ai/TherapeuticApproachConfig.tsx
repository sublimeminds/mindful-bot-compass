
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Heart, TrendingUp, Target, AlertTriangle, Settings, Save } from 'lucide-react';

interface TherapyTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  effectivenessScore: number;
  usageCount: number;
  isActive: boolean;
  conditions: string[];
  avgSessionImprovement: number;
}

const TherapeuticApproachConfig = () => {
  const [techniques, setTechniques] = useState<TherapyTechnique[]>([
    {
      id: 'cbt-thought-challenging',
      name: 'Cognitive Restructuring',
      category: 'CBT',
      description: 'Help users identify and challenge negative thought patterns',
      effectivenessScore: 87,
      usageCount: 1247,
      isActive: true,
      conditions: ['anxiety', 'depression', 'stress'],
      avgSessionImprovement: 23
    },
    {
      id: 'mindfulness-breathing',
      name: 'Mindful Breathing',
      category: 'Mindfulness',
      description: 'Guided breathing exercises for immediate stress relief',
      effectivenessScore: 92,
      usageCount: 2156,
      isActive: true,
      conditions: ['anxiety', 'stress', 'panic'],
      avgSessionImprovement: 31
    },
    {
      id: 'grounding-5-4-3-2-1',
      name: '5-4-3-2-1 Grounding',
      category: 'Grounding',
      description: 'Sensory grounding technique for anxiety and panic',
      effectivenessScore: 89,
      usageCount: 834,
      isActive: true,
      conditions: ['anxiety', 'panic', 'trauma'],
      avgSessionImprovement: 28
    }
  ]);

  const [approachSettings, setApproachSettings] = useState({
    adaptivePersonalization: [0.8],
    interventionSensitivity: [0.7],
    progressTrackingFrequency: [0.6],
    motivationalIntensity: [0.7],
    culturalAdaptation: true,
    evidenceBasedOnly: true,
    realTimeAdaptation: true
  });

  const [sessionFlow, setSessionFlow] = useState({
    checkInDuration: [5],
    mainSessionDuration: [20],
    wrapUpDuration: [5],
    enableDynamicTiming: true,
    enableProgressCelebration: true,
    enableCrisisInterruption: true
  });

  const handleTechniqueToggle = (techniqueId: string) => {
    setTechniques(prev => prev.map(technique => 
      technique.id === techniqueId 
        ? { ...technique, isActive: !technique.isActive }
        : technique
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CBT': return 'bg-blue-500/20 text-blue-400';
      case 'Mindfulness': return 'bg-green-500/20 text-green-400';
      case 'Grounding': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Therapy Approach Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-400" />
            Therapeutic Approach Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Adaptive Personalization: {approachSettings.adaptivePersonalization[0]}
                </label>
                <Slider
                  value={approachSettings.adaptivePersonalization}
                  onValueChange={(value) => setApproachSettings(prev => ({ ...prev, adaptivePersonalization: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">How much AI adapts to individual user patterns</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Intervention Sensitivity: {approachSettings.interventionSensitivity[0]}
                </label>
                <Slider
                  value={approachSettings.interventionSensitivity}
                  onValueChange={(value) => setApproachSettings(prev => ({ ...prev, interventionSensitivity: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-gray-400 mt-1">Sensitivity to when interventions are needed</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white">Cultural Adaptation</span>
                  <Switch
                    checked={approachSettings.culturalAdaptation}
                    onCheckedChange={(checked) => setApproachSettings(prev => ({ ...prev, culturalAdaptation: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Evidence-Based Only</span>
                  <Switch
                    checked={approachSettings.evidenceBasedOnly}
                    onCheckedChange={(checked) => setApproachSettings(prev => ({ ...prev, evidenceBasedOnly: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white">Real-Time Adaptation</span>
                  <Switch
                    checked={approachSettings.realTimeAdaptation}
                    onCheckedChange={(checked) => setApproachSettings(prev => ({ ...prev, realTimeAdaptation: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Flow Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-400" />
            Session Flow Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Check-in Duration: {sessionFlow.checkInDuration[0]} min
              </label>
              <Slider
                value={sessionFlow.checkInDuration}
                onValueChange={(value) => setSessionFlow(prev => ({ ...prev, checkInDuration: value }))}
                max={15}
                min={2}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Main Session: {sessionFlow.mainSessionDuration[0]} min
              </label>
              <Slider
                value={sessionFlow.mainSessionDuration}
                onValueChange={(value) => setSessionFlow(prev => ({ ...prev, mainSessionDuration: value }))}
                max={60}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Wrap-up Duration: {sessionFlow.wrapUpDuration[0]} min
              </label>
              <Slider
                value={sessionFlow.wrapUpDuration}
                onValueChange={(value) => setSessionFlow(prev => ({ ...prev, wrapUpDuration: value }))}
                max={15}
                min={2}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapy Techniques Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Therapy Techniques Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {techniques.map((technique) => (
              <div key={technique.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-medium">{technique.name}</h3>
                      <Badge className={`text-xs ${getCategoryColor(technique.category)}`}>
                        {technique.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {technique.usageCount} uses
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{technique.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Effectiveness Score</span>
                          <span className={`text-xs font-medium ${getEffectivenessColor(technique.effectivenessScore)}`}>
                            {technique.effectivenessScore}%
                          </span>
                        </div>
                        <Progress value={technique.effectivenessScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Avg Session Improvement</span>
                          <span className="text-xs font-medium text-green-400">
                            +{technique.avgSessionImprovement}%
                          </span>
                        </div>
                        <Progress value={technique.avgSessionImprovement} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {technique.conditions.map((condition) => (
                        <Badge key={condition} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-white">Active</span>
                    <Switch
                      checked={technique.isActive}
                      onCheckedChange={() => handleTechniqueToggle(technique.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="bg-purple-600 hover:bg-purple-700">
        <Save className="h-4 w-4 mr-2" />
        Save Therapeutic Configuration
      </Button>
    </div>
  );
};

export default TherapeuticApproachConfig;
