
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Brain, TrendingUp, Target } from 'lucide-react';

const PersonalizationEngine = () => {
  const [userSegments] = useState([
    {
      id: 'high-anxiety',
      name: 'High Anxiety Users',
      count: 847,
      effectiveness: 89,
      characteristics: ['Frequent worry', 'Physical symptoms', 'Avoidance behaviors'],
      preferredTechniques: ['Breathing exercises', 'Grounding', 'Progressive relaxation']
    },
    {
      id: 'depression-focused',
      name: 'Depression-Focused Users',
      count: 623,
      effectiveness: 84,
      characteristics: ['Low mood', 'Energy depletion', 'Negative thinking'],
      preferredTechniques: ['Cognitive restructuring', 'Behavioral activation', 'Self-compassion']
    }
  ]);

  const [adaptationSettings, setAdaptationSettings] = useState({
    realTimeAdaptation: true,
    culturalPersonalization: true,
    learningFromFeedback: true,
    predictiveRecommendations: false
  });

  return (
    <div className="space-y-6">
      {/* Personalization Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-400" />
            Personalization Engine Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(adaptationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
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

      {/* User Segments */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Segments & Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userSegments.map((segment) => (
              <div key={segment.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-medium">{segment.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {segment.count} users
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Effectiveness</span>
                        <span className="text-xs font-medium text-green-400">{segment.effectiveness}%</span>
                      </div>
                      <Progress value={segment.effectiveness} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Characteristics</h4>
                        <div className="flex flex-wrap gap-1">
                          {segment.characteristics.map((char) => (
                            <Badge key={char} variant="secondary" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Preferred Techniques</h4>
                        <div className="flex flex-wrap gap-1">
                          {segment.preferredTechniques.map((technique) => (
                            <Badge key={technique} className="text-xs bg-purple-600">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationEngine;
