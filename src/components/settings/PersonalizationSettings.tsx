
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Heart, Target, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PersonalizationSettings = () => {
  const { toast } = useToast();
  const [adaptiveLearning, setAdaptiveLearning] = useState(true);
  const [personalizedContent, setPersonalizedContent] = useState(true);
  const [contextualReminders, setContextualReminders] = useState(true);
  const [emotionalTone, setEmotionalTone] = useState('balanced');
  const [responseLength, setResponseLength] = useState([3]);
  const [personalityMatch, setPersonalityMatch] = useState('adaptive');
  const [userInterests, setUserInterests] = useState(['mindfulness', 'stress-management']);
  const [customTriggers, setCustomTriggers] = useState(['work stress', 'family conflicts']);
  const [learningStyle, setLearningStyle] = useState('visual');
  const [motivationStyle, setMotivationStyle] = useState('achievement');
  const [newInterest, setNewInterest] = useState('');
  const [newTrigger, setNewTrigger] = useState('');

  const emotionalTones = [
    { value: 'warm', label: 'Warm & Nurturing' },
    { value: 'professional', label: 'Professional & Clinical' },
    { value: 'balanced', label: 'Balanced & Supportive' },
    { value: 'energetic', label: 'Energetic & Motivating' },
    { value: 'calm', label: 'Calm & Soothing' }
  ];

  const personalityMatches = [
    { value: 'adaptive', label: 'Adaptive (Changes based on mood)' },
    { value: 'consistent', label: 'Consistent (Same approach)' },
    { value: 'mirroring', label: 'Mirroring (Matches your energy)' },
    { value: 'complementary', label: 'Complementary (Balances your style)' }
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual (Images, charts, diagrams)' },
    { value: 'auditory', label: 'Auditory (Spoken explanations)' },
    { value: 'kinesthetic', label: 'Kinesthetic (Hands-on activities)' },
    { value: 'reading', label: 'Reading/Writing (Text-based)' }
  ];

  const motivationStyles = [
    { value: 'achievement', label: 'Achievement-focused' },
    { value: 'progress', label: 'Progress-focused' },
    { value: 'social', label: 'Social connection' },
    { value: 'autonomy', label: 'Independence-focused' },
    { value: 'mastery', label: 'Skill mastery' }
  ];

  const commonInterests = [
    'mindfulness', 'stress-management', 'relationships', 'career',
    'parenting', 'anxiety', 'depression', 'self-esteem', 'sleep',
    'exercise', 'nutrition', 'creativity', 'spirituality'
  ];

  const addInterest = () => {
    if (newInterest.trim() && !userInterests.includes(newInterest.trim())) {
      setUserInterests([...userInterests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setUserInterests(userInterests.filter(i => i !== interest));
  };

  const addTrigger = () => {
    if (newTrigger.trim() && !customTriggers.includes(newTrigger.trim())) {
      setCustomTriggers([...customTriggers, newTrigger.trim()]);
      setNewTrigger('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setCustomTriggers(customTriggers.filter(t => t !== trigger));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('personalizationSettings', JSON.stringify({
      adaptiveLearning,
      personalizedContent,
      contextualReminders,
      emotionalTone,
      responseLength: responseLength[0],
      personalityMatch,
      userInterests,
      customTriggers,
      learningStyle,
      motivationStyle
    }));

    toast({
      title: "Personalization Settings Saved",
      description: "Your AI therapy experience has been customized to your preferences.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Personalization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Adaptive Learning */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Adaptive Learning</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to learn from your responses and adapt its approach
              </p>
            </div>
            <Switch
              checked={adaptiveLearning}
              onCheckedChange={setAdaptiveLearning}
            />
          </div>

          {/* Personalized Content */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Personalized Content Recommendations</Label>
              <p className="text-sm text-muted-foreground">
                Receive content suggestions based on your progress and interests
              </p>
            </div>
            <Switch
              checked={personalizedContent}
              onCheckedChange={setPersonalizedContent}
            />
          </div>

          {/* Contextual Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Contextual Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Smart reminders based on your patterns and triggers
              </p>
            </div>
            <Switch
              checked={contextualReminders}
              onCheckedChange={setContextualReminders}
            />
          </div>

          {/* Emotional Tone */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>AI Emotional Tone</span>
            </Label>
            <Select value={emotionalTone} onValueChange={setEmotionalTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emotionalTones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Response Length */}
          <div className="space-y-3">
            <Label>Response Length Preference</Label>
            <div className="space-y-2">
              <Slider
                value={responseLength}
                onValueChange={setResponseLength}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Brief</span>
                <span>Current: {['Very Brief', 'Brief', 'Moderate', 'Detailed', 'Comprehensive'][responseLength[0] - 1]}</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </div>

          {/* Personality Match */}
          <div className="space-y-2">
            <Label>AI Personality Matching</Label>
            <Select value={personalityMatch} onValueChange={setPersonalityMatch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {personalityMatches.map(match => (
                  <SelectItem key={match.value} value={match.value}>
                    {match.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning & Motivation Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Style */}
          <div className="space-y-2">
            <Label>Preferred Learning Style</Label>
            <Select value={learningStyle} onValueChange={setLearningStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {learningStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivation Style */}
          <div className="space-y-2">
            <Label>Motivation Style</Label>
            <Select value={motivationStyle} onValueChange={setMotivationStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {motivationStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Interests & Focus Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Interests */}
          <div className="space-y-3">
            <Label>Your Current Interests</Label>
            <div className="flex flex-wrap gap-2">
              {userInterests.map(interest => (
                <Badge key={interest} variant="secondary" className="flex items-center space-x-1">
                  <span>{interest}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Add New Interest */}
          <div className="space-y-2">
            <Label>Add New Interest</Label>
            <div className="flex space-x-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Enter an interest or focus area"
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button onClick={addInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonInterests.filter(interest => !userInterests.includes(interest)).map(interest => (
                <Badge 
                  key={interest} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-therapy-50"
                  onClick={() => setUserInterests([...userInterests, interest])}
                >
                  + {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Custom Triggers */}
          <div className="space-y-3">
            <Label>Personal Stress Triggers</Label>
            <p className="text-sm text-muted-foreground">
              Help the AI recognize and respond to your specific stress triggers
            </p>
            <div className="flex flex-wrap gap-2">
              {customTriggers.map(trigger => (
                <Badge key={trigger} variant="destructive" className="flex items-center space-x-1">
                  <span>{trigger}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTrigger(trigger)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="Enter a stress trigger"
                onKeyPress={(e) => e.key === 'Enter' && addTrigger()}
              />
              <Button onClick={addTrigger} variant="outline">Add Trigger</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Personalization Settings
      </Button>
    </div>
  );
};

export default PersonalizationSettings;
