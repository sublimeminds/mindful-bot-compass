
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Edit3, Save, Camera, Mic, Tag, Calendar, 
  Lightbulb, Target, Heart, Brain
} from 'lucide-react';
import EnhancedVoiceInteraction from '@/components/EnhancedVoiceInteraction';

interface JournalEntryProps {
  onSave: (entry: any) => void;
}

const JournalEntry = ({ onSave }: JournalEntryProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [entryType, setEntryType] = useState('free');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  const entryTypes = [
    { id: 'free', name: 'Free Writing', icon: <Edit3 className="h-4 w-4" /> },
    { id: 'gratitude', name: 'Gratitude', icon: <Heart className="h-4 w-4" /> },
    { id: 'goals', name: 'Goals & Progress', icon: <Target className="h-4 w-4" /> },
    { id: 'reflection', name: 'Daily Reflection', icon: <Brain className="h-4 w-4" /> },
    { id: 'worry', name: 'Worry Log', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  const promptsByType = {
    free: "What's on your mind today?",
    gratitude: "What are you grateful for today? List 3 things that brought you joy or comfort.",
    goals: "Reflect on your progress toward your goals. What did you achieve? What challenges did you face?",
    reflection: "How did today go? What emotions did you experience? What would you do differently?",
    worry: "What's worrying you right now? Let's explore these thoughts and find some perspective."
  };

  const commonTags = [
    'morning', 'evening', 'work', 'family', 'friends', 'health', 'exercise',
    'sleep', 'stress', 'achievement', 'challenge', 'growth', 'gratitude',
    'anxiety', 'happiness', 'reflection', 'goals', 'therapy'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleVoiceInput = (text: string, metadata?: any) => {
    if (metadata?.source === 'voice') {
      setContent(prev => prev + (prev ? ' ' : '') + text);
    }
    setShowVoiceInput(false);
  };

  const generateTitleFromContent = () => {
    if (!content) return '';
    const words = content.split(' ').slice(0, 5).join(' ');
    return words + (content.split(' ').length > 5 ? '...' : '');
  };

  const handleSave = () => {
    if (!content.trim()) return;

    const entry = {
      type: 'journal',
      entryType,
      title: title || generateTitleFromContent(),
      content: content.trim(),
      tags: selectedTags,
      timestamp: new Date(),
      wordCount: content.trim().split(' ').length
    };

    onSave(entry);
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setEntryType('free');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit3 className="h-5 w-5 mr-2" />
            New Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entry Type Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Entry Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {entryTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={entryType === type.id ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    entryType === type.id ? 'bg-therapy-500' : ''
                  }`}
                  onClick={() => setEntryType(type.id)}
                >
                  {type.icon}
                  <span className="text-xs">{type.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Writing Prompt */}
          <div className="p-4 bg-therapy-50 border border-therapy-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-therapy-600" />
              <span className="font-medium text-therapy-700">Writing Prompt</span>
            </div>
            <p className="text-sm text-therapy-600">
              {promptsByType[entryType as keyof typeof promptsByType]}
            </p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-base font-medium mb-2 block">
              Title (Optional)
            </Label>
            <Input
              id="title"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content" className="text-base font-medium">
                Your Thoughts
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceInput(!showVoiceInput)}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Input
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>
            </div>
            
            <Textarea
              id="content"
              placeholder="Start writing your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{content.trim().split(' ').filter(word => word).length} words</span>
              <span>
                <Calendar className="h-3 w-3 inline mr-1" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Voice Input Component */}
          {showVoiceInput && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <EnhancedVoiceInteraction
                onTranscript={handleVoiceInput}
                className="border-0 bg-transparent"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              <Tag className="h-4 w-4 inline mr-1" />
              Tags
            </Label>
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

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={!content.trim()}
            className="w-full bg-therapy-500 hover:bg-therapy-600"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Journal Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalEntry;
