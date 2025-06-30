
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  Search, 
  Filter, 
  Headphones, 
  Clock, 
  Star,
  Lock,
  Crown
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types/user';
import audioContentService, { AudioContent } from '@/services/audioContentService';
import AudioPlayer from './AudioPlayer';
import PremiumAudioShowcase from '../dashboard/PremiumAudioShowcase';

interface EnhancedAudioLibraryProps {
  userId?: string;
}

const EnhancedAudioLibrary: React.FC<EnhancedAudioLibraryProps> = ({ userId }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTrack, setCurrentTrack] = useState<AudioContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<AudioContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<AudioContent[]>([]);

  const userPlan = (user as UserType)?.subscription_plan || 'free';
  const isPremium = userPlan === 'premium' || userPlan === 'pro';

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'podcast', label: 'Podcasts' },
    { id: 'technique', label: 'Techniques' },
    { id: 'sleep', label: 'Sleep' }
  ];

  useEffect(() => {
    // Load content based on user tier
    const content = audioContentService.getContentByTier(userPlan);
    setPlaylist(content);
    
    // Apply filters
    let filtered = content;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = audioContentService.searchContent(searchTerm).filter(item => 
        audioContentService.getContentByTier(userPlan).includes(item)
      );
    }
    
    setFilteredContent(filtered);
  }, [userPlan, selectedCategory, searchTerm]);

  const handlePlayPause = async () => {
    if (!currentTrack) return;
    
    try {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        await audioContentService.playAudioContent(currentTrack.id);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleTrackSelect = (track: AudioContent) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(item => item.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    if (!currentTrack) return;
    const currentIndex = playlist.findIndex(item => item.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(false);
  };

  const canAccess = (content: AudioContent) => {
    if (!content.tier || content.tier === 'free') return true;
    if (content.tier === 'premium' && isPremium) return true;
    if (content.tier === 'pro' && userPlan === 'pro') return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <Headphones className="h-8 w-8 text-therapy-600" />
            <span>Audio Library</span>
          </h1>
          <p className="text-slate-600 mt-1">
            Therapeutic audio content powered by AI voice technology
          </p>
        </div>
        <Badge className="therapy-gradient-bg text-white px-4 py-2">
          {playlist.length} tracks available
        </Badge>
      </div>

      {/* Premium Showcase for Free Users */}
      {!isPremium && (
        <div className="mb-8">
          <PremiumAudioShowcase />
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search audio content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "therapy-gradient-bg text-white" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Audio Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => {
          const hasAccess = canAccess(content);
          return (
            <Card key={content.id} className={`hover:shadow-lg transition-all duration-300 ${!hasAccess ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{content.title}</span>
                      {!hasAccess && <Lock className="h-4 w-4 text-slate-400" />}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{content.description}</p>
                  </div>
                  {content.tier && content.tier !== 'free' && (
                    <Badge variant="outline" className={
                      content.tier === 'premium' 
                        ? "border-therapy-500 text-therapy-600" 
                        : "border-harmony-500 text-harmony-600"
                    }>
                      <Crown className="h-3 w-3 mr-1" />
                      {content.tier}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {content.duration}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {content.category}
                      </Badge>
                    </div>
                    <span className="text-xs">Voice: {content.voiceName}</span>
                  </div>
                  
                  <Button
                    onClick={() => hasAccess ? handleTrackSelect(content) : null}
                    disabled={!hasAccess}
                    className="w-full therapy-gradient-bg text-white hover:opacity-90"
                  >
                    {hasAccess ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {currentTrack?.id === content.id && isPlaying ? 'Playing' : 'Play'}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Upgrade to Access
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Audio Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t shadow-lg">
          <AudioPlayer
            currentTrack={currentTrack}
            playlist={playlist}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onTrackChange={setCurrentTrack}
            className="max-w-4xl mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedAudioLibrary;
