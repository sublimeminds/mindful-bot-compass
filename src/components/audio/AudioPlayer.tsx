
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Shuffle, Download, Share2, Heart, MoreHorizontal
} from 'lucide-react';
import { AudioContent } from '@/services/audioContentService';

interface AudioPlayerProps {
  currentTrack: AudioContent | null;
  playlist: AudioContent[];
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTrackChange: (track: AudioContent) => void;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  playlist,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onTrackChange,
  className = ""
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentTrack?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.load();
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      onNext();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!currentTrack) {
    return null;
  }

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-0 shadow-xl ${className}`}>
      <CardContent className="p-6">
        <audio ref={audioRef} preload="metadata" />
        
        {/* Track Info */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {currentTrack.category.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 truncate">{currentTrack.title}</h3>
            <p className="text-sm text-slate-600 truncate">{currentTrack.description}</p>
            <p className="text-xs text-slate-500">Voice: {currentTrack.voiceName}</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsShuffle(!isShuffle)}
            className={isShuffle ? "text-therapy-600" : "text-slate-600"}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button size="sm" variant="ghost" onClick={onPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="lg"
            onClick={onPlayPause}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-1" />
            )}
          </Button>
          
          <Button size="sm" variant="ghost" onClick={onNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsRepeat(!isRepeat)}
            className={isRepeat ? "text-therapy-600" : "text-slate-600"}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="ghost" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          
          <Button size="sm" variant="ghost">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
