import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Search, 
  Download, 
  Filter,
  Clock,
  User,
  Bot,
  Star
} from 'lucide-react';
import { SessionTranscriptionService, TranscriptSegment, KeyMoment } from '@/services/sessionTranscriptionService';

interface SessionTranscriptViewerProps {
  sessionId: string;
}

const SessionTranscriptViewer: React.FC<SessionTranscriptViewerProps> = ({ sessionId }) => {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('all');
  const [showKeyMomentsOnly, setShowKeyMomentsOnly] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTranscriptData();
  }, [sessionId]);

  const loadTranscriptData = async () => {
    try {
      const [transcriptData, momentsData] = await Promise.all([
        SessionTranscriptionService.getTranscript(sessionId),
        SessionTranscriptionService.getKeyMoments(sessionId)
      ]);

      if (transcriptData?.transcript_data) {
        setTranscript(transcriptData.transcript_data);
      }
      setKeyMoments(momentsData);
    } catch (error) {
      console.error('Error loading transcript data:', error);
    }
  };

  const filteredTranscript = transcript.filter(segment => {
    const matchesSearch = segment.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeaker = selectedSpeaker === 'all' || segment.speaker === selectedSpeaker;
    const isKeyMoment = keyMoments.some(moment => 
      segment.timestamp >= moment.timestamp_start && 
      segment.timestamp <= moment.timestamp_end
    );
    
    return matchesSearch && matchesSpeaker && (!showKeyMomentsOnly || isKeyMoment);
  });

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'user': return <User className="h-4 w-4" />;
      case 'ai': 
      case 'therapist': return <Bot className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'user': return 'bg-blue-50 border-blue-200';
      case 'ai': 
      case 'therapist': return 'bg-therapy-50 border-therapy-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const isKeyMomentTimestamp = (timestamp: number) => {
    return keyMoments.some(moment => 
      timestamp >= moment.timestamp_start && 
      timestamp <= moment.timestamp_end
    );
  };

  const getKeyMomentForTimestamp = (timestamp: number) => {
    return keyMoments.find(moment => 
      timestamp >= moment.timestamp_start && 
      timestamp <= moment.timestamp_end
    );
  };

  const jumpToKeyMoment = (moment: KeyMoment) => {
    setCurrentTime(moment.timestamp_start);
    // Scroll to the relevant transcript segment
    const element = document.getElementById(`segment-${moment.timestamp_start}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-therapy-600" />
              Session Transcript
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
            </div>

            {/* Speaker Filter */}
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Speakers</option>
              <option value="user">User</option>
              <option value="therapist">Therapist</option>
              <option value="ai">AI</option>
            </select>

            {/* Key Moments Filter */}
            <Button
              size="sm"
              variant={showKeyMomentsOnly ? "default" : "outline"}
              onClick={() => setShowKeyMomentsOnly(!showKeyMomentsOnly)}
            >
              <Star className="h-4 w-4 mr-2" />
              Key Moments
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Key Moments Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Key Moments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {keyMoments.map((moment, index) => (
                  <div
                    key={moment.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => jumpToKeyMoment(moment)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {SessionTranscriptionService.getMomentTypeIcon(moment.moment_type)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {SessionTranscriptionService.formatTimestamp(moment.timestamp_start)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1 capitalize">
                      {moment.moment_type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {moment.content_summary}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Conversation ({filteredTranscript.length} segments)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]" ref={scrollRef}>
              <div className="space-y-4">
                {filteredTranscript.map((segment, index) => {
                  const isKeyMoment = isKeyMomentTimestamp(segment.timestamp);
                  const keyMoment = getKeyMomentForTimestamp(segment.timestamp);
                  
                  return (
                    <div key={index} id={`segment-${segment.timestamp}`}>
                      {isKeyMoment && keyMoment && (
                        <div className="bg-gradient-to-r from-therapy-100 to-calm-100 p-3 rounded-lg mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {SessionTranscriptionService.getMomentTypeIcon(keyMoment.moment_type)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              Key Moment: {keyMoment.moment_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {keyMoment.content_summary}
                          </p>
                        </div>
                      )}
                      
                      <div className={`flex gap-3 p-4 rounded-lg border ${getSpeakerColor(segment.speaker)} ${isKeyMoment ? 'ring-2 ring-therapy-200' : ''}`}>
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                          {getSpeakerIcon(segment.speaker)}
                          <Badge variant="outline" className="text-xs">
                            {SessionTranscriptionService.formatTimestamp(segment.timestamp)}
                          </Badge>
                          {segment.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(segment.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium capitalize">
                              {segment.speaker}
                            </span>
                            {segment.emotions && segment.emotions.length > 0 && (
                              <div className="flex gap-1">
                                {segment.emotions.slice(0, 3).map((emotion, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className={`text-xs ${SessionTranscriptionService.getEmotionColor(emotion)}`}
                                  >
                                    {emotion}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">
                            {segment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionTranscriptViewer;