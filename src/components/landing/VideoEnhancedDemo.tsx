
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, CheckCircle } from 'lucide-react';

const demoVideos = [
  {
    id: 'therapy-session',
    title: 'AI Therapy Session',
    description: 'Experience a real conversation with our empathetic AI therapist',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop',
    duration: '2:30',
    features: ['Natural conversation', 'Emotion recognition', 'Personalized responses']
  },
  {
    id: 'mood-tracking',
    title: 'Mood Analytics',
    description: 'See how our AI tracks and analyzes your emotional patterns',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=450&fit=crop',
    duration: '1:45',
    features: ['Visual insights', 'Pattern recognition', 'Progress tracking']
  },
  {
    id: 'voice-interaction',
    title: 'Voice Conversations',
    description: 'Talk naturally with AI using advanced voice recognition',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop',
    duration: '2:15',
    features: ['Voice-to-text', 'Emotion detection', 'Natural responses']
  }
];

const VideoEnhancedDemo = () => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();

  const currentVideo = demoVideos[activeVideo];

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 150); // Simulate 15 second videos
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index: number) => {
    setActiveVideo(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-therapy-50 to-calm-50" id="video-demo">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-therapy-100 text-therapy-700">
            Interactive Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See MindfulAI in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Watch real demonstrations of how our AI-powered therapy platform works. 
            Experience the natural conversations, advanced analytics, and personalized support.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-2xl">
                <div className="relative bg-black aspect-video">
                  {/* Video Thumbnail/Player */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${currentVideo.thumbnail})`,
                      filter: isPlaying ? 'brightness(0.7)' : 'brightness(0.9)'
                    }}
                  >
                    {/* Play Overlay */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Button
                          onClick={handlePlayPause}
                          size="lg"
                          className="w-20 h-20 rounded-full bg-white/90 text-therapy-600 hover:bg-white hover:scale-110 transition-all duration-300"
                        >
                          <Play className="h-8 w-8 ml-1" />
                        </Button>
                      </div>
                    )}

                    {/* Progress Overlay */}
                    {isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-16 h-16 mx-auto mb-4 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                            <div 
                              className="absolute inset-0 rounded-full border-4 border-white border-t-transparent transition-transform duration-300"
                              style={{ transform: `rotate(${progress * 3.6}deg)` }}
                            ></div>
                            <Pause className="absolute inset-0 m-auto h-6 w-6" />
                          </div>
                          <p className="text-sm opacity-90">Playing: {currentVideo.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={handlePlayPause}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <div className="flex-1 bg-white/30 rounded-full h-1">
                        <div 
                          className="bg-therapy-400 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <Button
                        onClick={handleRestart}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={toggleMute}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      
                      <span className="text-white text-sm">{currentVideo.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Video Info */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">{currentVideo.title}</h3>
                <p className="text-muted-foreground mb-4">{currentVideo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {currentVideo.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-therapy-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Selection Sidebar */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-4">Choose Demo</h4>
              <div className="space-y-4">
                {demoVideos.map((video, index) => (
                  <Card 
                    key={video.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      index === activeVideo ? 'ring-2 ring-therapy-500 bg-therapy-50' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleVideoSelect(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <div 
                          className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                          style={{ backgroundImage: `url(${video.thumbnail})` }}
                        >
                          {index === activeVideo && isPlaying && (
                            <div className="w-full h-full bg-black/50 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-therapy-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm mb-1 truncate">{video.title}</h5>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{video.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{video.duration}</span>
                            {index === activeVideo && (
                              <Badge variant="secondary" className="text-xs">
                                {isPlaying ? 'Playing' : 'Selected'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="mt-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                <CardContent className="p-6 text-center">
                  <h5 className="font-semibold mb-2">Ready to Try It?</h5>
                  <p className="text-sm mb-4 opacity-90">
                    Start your free assessment and experience MindfulAI yourself
                  </p>
                  <Button 
                    className="bg-white text-therapy-600 hover:bg-gray-100 w-full"
                    size="sm"
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Natural Conversations",
              description: "Experience human-like interactions with advanced AI",
              icon: "💬"
            },
            {
              title: "Real-time Analytics",
              description: "Track your progress with intelligent insights",
              icon: "📊"
            },
            {
              title: "Voice & Text Support",
              description: "Communicate however feels most comfortable",
              icon: "🎙️"
            }
          ].map((highlight, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">{highlight.icon}</div>
                <h6 className="font-semibold mb-2">{highlight.title}</h6>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoEnhancedDemo;
