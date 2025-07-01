import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Brain, 
  Zap,
  Heart,
  Clock,
  Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIBehaviorSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    responseStyle: 'balanced', // formal, casual, balanced
    empathyLevel: [7],
    directnessLevel: [5],
    questioningStyle: 'moderate', // minimal, moderate, extensive
    sessionPacing: 'adaptive', // slow, adaptive, fast
    proactiveSupport: true,
    personalizedInsights: true,
    contextAwareness: true,
    emotionalTone: 'warm', // professional, warm, friendly
    responseLength: 'medium', // short, medium, detailed
    followUpFrequency: [3], // 1-7 scale
    customInstructions: ''
  });

  const handleSliderChange = (key: string, value: number[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Save to localStorage for now (will be moved to database)
    localStorage.setItem('ai_behavior_settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your AI behavior preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Behavior Settings</h2>
        <p className="text-muted-foreground">
          Customize how your AI therapist communicates and responds to you.
        </p>
      </div>

      {/* Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Communication Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Response Style</Label>
            <Select value={settings.responseStyle} onValueChange={(value) => handleSelectChange('responseStyle', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal & Professional</SelectItem>
                <SelectItem value="balanced">Balanced & Supportive</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Emotional Tone</Label>
            <Select value={settings.emotionalTone} onValueChange={(value) => handleSelectChange('emotionalTone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="warm">Warm & Caring</SelectItem>
                <SelectItem value="friendly">Friendly & Upbeat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Response Length</Label>
            <Select value={settings.responseLength} onValueChange={(value) => handleSelectChange('responseLength', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short & Concise</SelectItem>
                <SelectItem value="medium">Medium Length</SelectItem>
                <SelectItem value="detailed">Detailed & Thorough</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Personality Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Personality Traits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Empathy Level: {settings.empathyLevel[0]}/10</Label>
            <Slider
              value={settings.empathyLevel}
              onValueChange={(value) => handleSliderChange('empathyLevel', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How emotionally responsive and understanding the AI should be
            </p>
          </div>

          <div className="space-y-2">
            <Label>Directness Level: {settings.directnessLevel[0]}/10</Label>
            <Slider
              value={settings.directnessLevel}
              onValueChange={(value) => handleSliderChange('directnessLevel', value)}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How direct vs gentle the AI should be with feedback and suggestions
            </p>
          </div>

          <div className="space-y-2">
            <Label>Follow-up Frequency: {settings.followUpFrequency[0]}/7</Label>
            <Slider
              value={settings.followUpFrequency}
              onValueChange={(value) => handleSliderChange('followUpFrequency', value)}
              max={7}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How often the AI should ask follow-up questions during sessions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interaction Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Interaction Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Questioning Style</Label>
            <Select value={settings.questioningStyle} onValueChange={(value) => handleSelectChange('questioningStyle', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal Questions</SelectItem>
                <SelectItem value="moderate">Moderate Questioning</SelectItem>
                <SelectItem value="extensive">Extensive Exploration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Session Pacing</Label>
            <Select value={settings.sessionPacing} onValueChange={(value) => handleSelectChange('sessionPacing', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow & Deliberate</SelectItem>
                <SelectItem value="adaptive">Adaptive to My Pace</SelectItem>
                <SelectItem value="fast">Fast & Efficient</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Proactive Support</Label>
              <p className="text-sm text-muted-foreground">AI offers suggestions without being asked</p>
            </div>
            <Switch
              checked={settings.proactiveSupport}
              onCheckedChange={(checked) => handleToggle('proactiveSupport', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Personalized Insights</Label>
              <p className="text-sm text-muted-foreground">AI provides insights based on your history</p>
            </div>
            <Switch
              checked={settings.personalizedInsights}
              onCheckedChange={(checked) => handleToggle('personalizedInsights', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Context Awareness</Label>
              <p className="text-sm text-muted-foreground">AI remembers previous conversations</p>
            </div>
            <Switch
              checked={settings.contextAwareness}
              onCheckedChange={(checked) => handleToggle('contextAwareness', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Additional Instructions for Your AI Therapist</Label>
            <Textarea
              value={settings.customInstructions}
              onChange={(e) => setSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
              placeholder="e.g., Please use simple language, avoid medical jargon, focus on practical solutions..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Provide specific guidance on how you'd like your AI therapist to interact with you
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full">
        Save AI Behavior Settings
      </Button>
    </div>
  );
};

export default AIBehaviorSettings;