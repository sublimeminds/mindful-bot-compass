
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, Save, Play, Pause, Volume2, FileAudio,
  Clock, Calendar, Tag, Brain
} from 'lucide-react';
import EnhancedVoiceInteraction from '@/components/EnhancedVoiceInteraction';

interface VoiceJournalProps {
  onSave: (entry: any) => void;
}

const VoiceJournal = ({ onSave }: VoiceJournalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);

  const voicePrompts = [
    "Tell me about your day. What happened that made you feel good?",
    "What's been on your mind lately? Let's talk it through.",
    "Describe how you're feeling right now, both emotionally and physically.",
    "What are you grateful for today? Share what brought you joy.",
    "What challenges are you facing? Let's explore them together.",
    "Reflect on a recent achievement or something you're proud of."
  ];

  const commonTags = [
    'daily-reflection', 'feelings', 'gratitude', 'challenges', 'achievements',
    'relationships', 'work', 'health', 'goals', 'insights', 'breakthroughs'
  ];

  const handleVoiceInput = (text: string, metadata?: any) => {
    setTranscript(text);
    if (metadata?.emotion) {
      setEmotionalAnalysis(metadata.emotion);
    }
  };

  const handleEmotionDetected = (emotion: any) => {
    setEmotionalAnalysis(emotion);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!transcript.trim()) return;

    const entry = {
      type: 'voice',
      title: `Voice Journal - ${new Date().toLocaleDateString()}`,
      content: transcript,
      audioBlob,
      emotionalAnalysis,
      tags: selectedTags,
      duration,
      timestamp: new Date(),
      wordCount: transcript.trim().split(' ').length
    };

    onSave(entry);
    
    // Reset form
    setTranscript('');
    setAudioBlob(null);
    setEmotionalAnalysis(null);
    setSelectedTags([]);
    setDuration(0);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      anxious: 'bg-red-100 text-red-800',
      calm: 'bg-green-100 text-green-800',
      excited: 'bg-orange-100 text-orange-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[emotion] || colors.neutral;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2" />
            Voice Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Prompts */}
          <div className="p-4 bg-therapy-50 border border-therapy-200 rounded-lg">
            <h3 className="font-medium text-therapy-700 mb-3">Suggested Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {voicePrompts.slice(0, 4).map((prompt, index) => (
                <div key={index} className="p-3 bg-white border rounded text-sm">
                  "{prompt}"
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Voice Input */}
          <div className="border rounded-lg p-4">
            <EnhancedVoiceInteraction
              onTextReceived={handleVoiceInput}
              onEmotionDetected={handleEmotionDetected}
              enableOCR={false}
              className="border-0"
            />
          </div>

          {/* Transcript Display */}
          {transcript && (
            <Card className="border-therapy-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Voice Transcript</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{transcript.trim().split(' ').length} words</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{transcript}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emotional Analysis */}
          {emotionalAnalysis && (
            <Card className="border-calm-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Emotional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Primary Emotion</Label>
                    <Badge className={`mt-1 ${getEmotionColor(emotionalAnalysis.primary)}`}>
                      {emotionalAnalysis.primary}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Emotional Tone</Label>
                    <div className="mt-1 text-sm">
                      Valence: {emotionalAnalysis.valence?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Energy Level</Label>
                    <div className="mt-1 text-sm">
                      Arousal: {emotionalAnalysis.arousal?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {emotionalAnalysis.secondary && emotionalAnalysis.secondary.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Secondary Emotions</Label>
                    <div className="flex flex-wrap gap-2">
                      {emotionalAnalysis.secondary.map((emotion: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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

          {/* Audio Controls */}
          {audioBlob && (
            <Card className="border-flow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileAudio className="h-5 w-5 text-flow-600" />
                    <span className="font-medium">Audio Recording</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={!transcript.trim()}
            className="w-full bg-therapy-500 hover:bg-therapy-600"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Voice Journal Entry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceJournal;
