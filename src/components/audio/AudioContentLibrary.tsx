
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, Pause, Download, Search, Filter, Star, Heart, Brain,
  Headphones, Volume2, Clock, User, Bookmark, Share2, MoreVertical,
  Shuffle, Repeat, SkipBack, SkipForward, Volume, List
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import audioContentService, { AudioContent, AudioPlaylist } from '@/services/audioContentService';

interface AudioContentLibraryProps {
  userId?: string;
  onContentSelect?: (content: AudioContent) => void;
  showApiKeyPrompt?: boolean;
}

const AudioContentLibrary: React.FC<AudioContentLibraryProps> = ({ 
  userId, 
  onContentSelect,
  showApiKeyPrompt = true 
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [content, setContent] = useState<AudioContent[]>([]);
  const [playlists, setPlaylists] = useState<AudioPlaylist[]>([]);
  const [filteredContent, setFilteredContent] = useState<AudioContent[]>([]);

  useEffect(() => {
    loadContent();
    loadPlaylists();
    checkApiKey();
  }, []);

  useEffect(() => {
    filterContent();
  }, [content, searchQuery, selectedCategory, selectedDifficulty, activeTab]);

  const loadContent = () => {
    setContent(audioContentService.getContentByCategory('all'));
  };

  const loadPlaylists = () => {
    setPlaylists(audioContentService.getAllPlaylists());
  };

  const checkApiKey = () => {
    const hasKey = audioContentService.hasApiKey();
    if (!hasKey && showApiKeyPrompt) {
      setShowKeyInput(true);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      audioContentService.setApiKey(apiKey.trim());
      setShowKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "ElevenLabs API key has been saved successfully.",
      });
    }
  };

  const filterContent = () => {
    let filtered = content;

    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.category === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = audioContentService.searchContent(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }

    setFilteredContent(filtered);
  };

  const handlePlayContent = async (contentItem: AudioContent) => {
    try {
      if (currentlyPlaying === contentItem.id && isPlaying) {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      } else {
        setCurrentlyPlaying(contentItem.id);
        setIsPlaying(true);
        await audioContentService.playAudioContent(contentItem.id);
        
        if (onContentSelect) {
          onContentSelect(contentItem);
        }
      }
    } catch (error) {
      console.error('Error playing content:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play audio content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadContent = async (contentItem: AudioContent) => {
    try {
      if (!contentItem.audioUrl) {
        toast({
          title: "Generating Audio",
          description: "Please wait while we generate the audio content...",
        });
        await audioContentService.generateAudioContent(contentItem);
      }
      
      if (contentItem.audioUrl) {
        const link = document.createElement('a');
        link.href = contentItem.audioUrl;
        link.download = `${contentItem.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: "Audio content download has started.",
        });
      }
    } catch (error) {
      console.error('Error downloading content:', error);
      toast({
        title: "Download Error",
        description: "Unable to download audio content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderContentCard = (contentItem: AudioContent) => (
    <Card key={contentItem.id} className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-therapy-600 transition-colors">
              {contentItem.title}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">{contentItem.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {contentItem.category}
            </Badge>
            {contentItem.difficulty && (
              <Badge variant="outline" className="text-xs">
                {contentItem.difficulty}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {contentItem.duration}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {contentItem.voiceName}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {contentItem.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => handlePlayContent(contentItem)}
            className="flex-1"
            disabled={currentlyPlaying === contentItem.id && isPlaying}
          >
            {currentlyPlaying === contentItem.id && isPlaying ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {currentlyPlaying === contentItem.id && isPlaying ? 'Playing' : 'Play'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownloadContent(contentItem)}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="outline">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPlaylistCard = (playlist: AudioPlaylist) => (
    <Card key={playlist.id} className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{playlist.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{playlist.description}</p>
          </div>
          <Badge variant="secondary">{playlist.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <span>{playlist.audioContent.length} tracks</span>
          <span>{playlist.totalDuration}</span>
          {playlist.isPersonalized && <Badge variant="outline">Personalized</Badge>}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>
          <Button size="sm" variant="outline">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (showKeyInput) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle>ElevenLabs API Key Required</CardTitle>
            <p className="text-sm text-slate-600">
              To access premium audio content, please enter your ElevenLabs API key.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter your ElevenLabs API key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleApiKeySubmit} className="flex-1">
                Save API Key
              </Button>
              <Button variant="outline" onClick={() => setShowKeyInput(false)}>
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Audio Content Library</h2>
          <p className="text-slate-600">Premium therapeutic audio content powered by AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <List className="h-4 w-4 mr-2" />
            My Lists
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search audio content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="meditation">Meditation</SelectItem>
            <SelectItem value="podcast">Podcast</SelectItem>
            <SelectItem value="technique">Technique</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            All Content
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="podcast" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Podcasts
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Playlists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map(renderContentCard)}
          </div>
        </TabsContent>

        <TabsContent value="meditation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.filter(item => item.category === 'meditation').map(renderContentCard)}
          </div>
        </TabsContent>

        <TabsContent value="podcast" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.filter(item => item.category === 'podcast').map(renderContentCard)}
          </div>
        </TabsContent>

        <TabsContent value="playlists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map(renderPlaylistCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredContent.length === 0 && activeTab !== 'playlists' && (
        <div className="text-center py-12">
          <Headphones className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No content found</h3>
          <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default AudioContentLibrary;
