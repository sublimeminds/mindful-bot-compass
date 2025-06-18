
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Heart, Save, Clock, MapPin, Users } from 'lucide-react';

interface EmotionLoggerProps {
  onSave: (entry: any) => void;
}

const EmotionLogger = ({ onSave }: EmotionLoggerProps) => {
  const [emotion, setEmotion] = useState('');
  const [mood, setMood] = useState([5]);
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [context, setContext] = useState({
    location: '',
    social: '',
    activity: ''
  });

  const emotions = [
    { name: 'Happy', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', emoji: '😊' },
    { name: 'Sad', color: 'bg-blue-100 text-blue-800 border-blue-200', emoji: '😢' },
    { name: 'Anxious', color: 'bg-red-100 text-red-800 border-red-200', emoji: '😰' },
    { name: 'Calm', color: 'bg-green-100 text-green-800 border-green-200', emoji: '😌' },
    { name: 'Excited', color: 'bg-orange-100 text-orange-800 border-orange-200', emoji: '🤩' },
    { name: 'Frustrated', color: 'bg-purple-100 text-purple-800 border-purple-200', emoji: '😤' },
    { name: 'Grateful', color: 'bg-pink-100 text-pink-800 border-pink-200', emoji: '🙏' },
    { name: 'Confused', color: 'bg-gray-100 text-gray-800 border-gray-200', emoji: '😕' }
  ];

  const commonTags = [
    'work', 'family', 'friends', 'health', 'exercise', 'sleep', 'food',
    'weather', 'social', 'alone', 'stress', 'achievement', 'challenge'
  ];

  const socialContexts = ['Alone', 'With Family', 'With Friends', 'At Work', 'In Public'];
  const locationContexts = ['Home', 'Work', 'Gym', 'Outdoors', 'Transportation', 'Social venue'];

  const handleEmotionSelect = (emotionName: string) => {
    setEmotion(emotionName);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!emotion) return;

    const entry = {
      type: 'emotion',
      title: `${emotion} - Quick Check-in`,
      content: notes || `Feeling ${emotion.toLowerCase()} (${intensity[0]}/10 intensity)`,
      emotion: emotion.toLowerCase(),
      mood: mood[0],
      intensity: intensity[0],
      tags: selectedTags,
      context,
      timestamp: new Date()
    };

    onSave(entry);
    
    // Reset form
    setEmotion('');
    setMood([5]);
    setIntensity([5]);
    setNotes('');
    setSelectedTags([]);
    setContext({ location: '', social: '', activity: '' });
  };

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😔';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Quick Emotion Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Emotion Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">How are you feeling right now?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emotions.map((emo) => (
                <Button
                  key={emo.name}
                  variant={emotion === emo.name ? "default" : "outline"}
                  className={`h-16 flex flex-col items-center space-y-1 ${
                    emotion === emo.name ? 'bg-therapy-500 text-white' : ''
                  }`}
                  onClick={() => handleEmotionSelect(emo.name)}
                >
                  <span className="text-xl">{emo.emoji}</span>
                  <span className="text-xs">{emo.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Mood Scale */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Overall Mood: {mood[0]}/10 {getMoodEmoji(mood[0])}
            </Label>
            <Slider
              value={mood}
              onValueChange={setMood}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Very Low</span>
              <span>Great</span>
            </div>
          </div>

          {/* Intensity Scale */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Intensity: {intensity[0]}/10
            </Label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Mild</span>
              <span>Very Intense</span>
            </div>
          </div>

          {/* Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center text-sm font-medium mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={context.location}
                onChange={(e) => setContext(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="">Select location</option>
                {locationContexts.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="flex items-center text-sm font-medium mb-2">
                <Users className="h-4 w-4 mr-1" />
                Social Context
              </Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={context.social}
                onChange={(e) => setContext(prev => ({ ...prev, social: e.target.value }))}
              >
                <option value="">Select social context</option>
                {socialContexts.map(social => (
                  <option key={social} value={social}>{social}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="flex items-center text-sm font-medium mb-2">
                <Clock className="h-4 w-4 mr-1" />
                Current Activity
              </Label>
              <input 
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="What are you doing?"
                value={context.activity}
                onChange={(e) => setContext(prev => ({ ...prev, activity: e.target.value }))}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-base font-medium mb-3 block">Related Tags</Label>
            <div className="flex flex-wrap gap-2">
              {commonTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedTags.includes(tag) ? 'bg-therapy-500' : ''
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-medium mb-3 block">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="What triggered this emotion? Any thoughts or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={!emotion}
            className="w-full bg-therapy-500 hover:bg-therapy-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Emotion Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionLogger;
