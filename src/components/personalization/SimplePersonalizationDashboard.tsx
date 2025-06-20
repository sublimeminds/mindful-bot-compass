
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Simplified personalization dashboard without complex dependencies
const SimplePersonalizationDashboard = () => {
  const [preferences, setPreferences] = useState({
    communication_style: 'balanced',
    learning_style: 'visual',
    therapy_approach: 'cognitive_behavioral'
  });

  const communicationStyles = [
    { id: 'direct', label: 'Direct & Clear', description: 'Straight to the point' },
    { id: 'empathetic', label: 'Warm & Empathetic', description: 'Caring and understanding' },
    { id: 'balanced', label: 'Balanced', description: 'Mix of both approaches' }
  ];

  const learningStyles = [
    { id: 'visual', label: 'Visual', description: 'Charts, diagrams, and visual aids' },
    { id: 'auditory', label: 'Auditory', description: 'Spoken explanations and discussions' },
    { id: 'kinesthetic', label: 'Hands-on', description: 'Interactive exercises and activities' }
  ];

  const handleStyleChange = (category: string, value: string) => {
    setPreferences(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalization Settings</CardTitle>
          <p className="text-muted-foreground">
            Customize your therapy experience to match your preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Communication Style */}
          <div className="space-y-3">
            <h3 className="font-medium">Communication Style</h3>
            <div className="grid gap-3">
              {communicationStyles.map((style) => (
                <div
                  key={style.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.communication_style === style.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleStyleChange('communication_style', style.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                    {preferences.communication_style === style.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Style */}
          <div className="space-y-3">
            <h3 className="font-medium">Learning Style</h3>
            <div className="grid gap-3">
              {learningStyles.map((style) => (
                <div
                  key={style.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.learning_style === style.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleStyleChange('learning_style', style.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-muted-foreground">{style.description}</div>
                    </div>
                    {preferences.learning_style === style.id && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplePersonalizationDashboard;
