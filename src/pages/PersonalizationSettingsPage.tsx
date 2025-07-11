import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Users, 
  Settings, 
  Zap,
  Target,
  BarChart3,
  Clock,
  Heart
} from 'lucide-react';

const PersonalizationSettingsPage = () => {
  const personalizations = [
    {
      category: 'Communication Style',
      current: 'Supportive & Encouraging',
      options: ['Direct & Structured', 'Supportive & Encouraging', 'Gentle & Patient', 'Analytical & Detailed'],
      description: 'How your AI therapist communicates with you'
    },
    {
      category: 'Session Pacing',
      current: 'Moderate',
      options: ['Slow & Reflective', 'Moderate', 'Fast & Dynamic'],
      description: 'The speed and intensity of your therapy sessions'
    },
    {
      category: 'Focus Areas',
      current: 'Anxiety & Stress',
      options: ['Anxiety & Stress', 'Depression & Mood', 'ADHD & Focus', 'Trauma & PTSD', 'Relationships'],
      description: 'Primary areas of therapeutic focus'
    }
  ];

  const aiPreferences = [
    { setting: 'Proactive Suggestions', enabled: true, description: 'AI offers coping strategies during conversations' },
    { setting: 'Mood Pattern Recognition', enabled: true, description: 'Automatically detect mood patterns and triggers' },
    { setting: 'Crisis Detection', enabled: true, description: 'Enhanced monitoring for crisis situations' },
    { setting: 'Progress Celebrations', enabled: false, description: 'Acknowledge achievements and milestones' },
    { setting: 'Weekly Insights', enabled: true, description: 'Receive weekly personalized insights' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
          Personalization Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your AI therapy experience to match your preferences and needs
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-therapy-200 bg-gradient-to-r from-therapy-25 to-therapy-50">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
            <p className="text-sm font-medium text-therapy-700">AI Adaptation</p>
            <p className="text-xl font-bold text-therapy-800">87%</p>
          </CardContent>
        </Card>
        
        <Card className="border-harmony-200 bg-gradient-to-r from-harmony-25 to-harmony-50">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-harmony-600" />
            <p className="text-sm font-medium text-harmony-700">Personalization</p>
            <p className="text-xl font-bold text-harmony-800">92%</p>
          </CardContent>
        </Card>
        
        <Card className="border-flow-200 bg-gradient-to-r from-flow-25 to-flow-50">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-flow-600" />
            <p className="text-sm font-medium text-flow-700">Learning Time</p>
            <p className="text-xl font-bold text-flow-800">12 days</p>
          </CardContent>
        </Card>
        
        <Card className="border-calm-200 bg-gradient-to-r from-calm-25 to-calm-50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-calm-600" />
            <p className="text-sm font-medium text-calm-700">Satisfaction</p>
            <p className="text-xl font-bold text-calm-800">94%</p>
          </CardContent>
        </Card>
      </div>

      {/* Therapy Style Personalization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-therapy-600" />
            Therapy Style Personalization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {personalizations.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{item.category}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant="outline">{item.current}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.options.map((option) => (
                    <Button
                      key={option}
                      variant={option === item.current ? 'default' : 'outline'}
                      size="sm"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Behavior Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-therapy-600" />
            AI Behavior Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiPreferences.map((pref, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{pref.setting}</h3>
                  <p className="text-sm text-muted-foreground">{pref.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{pref.enabled ? 'On' : 'Off'}</span>
                  <Button
                    variant={pref.enabled ? 'default' : 'outline'}
                    size="sm"
                  >
                    {pref.enabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-therapy-600" />
            Advanced Personalization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Data Learning</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session transcript analysis</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mood pattern recognition</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Goal progress tracking</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Privacy Controls</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Share insights with therapist team</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anonymous analytics</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data export available</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600">
          <Zap className="h-4 w-4 mr-2" />
          Apply Changes
        </Button>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
        <Button variant="outline">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationSettingsPage;