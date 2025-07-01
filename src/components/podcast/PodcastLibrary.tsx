
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, Headphones, Clock } from 'lucide-react';

const PodcastLibrary = () => {
  const [playingPodcast, setPlayingPodcast] = useState<number | null>(null);

  const podcasts = [
    {
      id: 1,
      title: "Understanding Anxiety",
      description: "Learn about the nature of anxiety and effective coping strategies",
      duration: "25 min",
      category: "Mental Health",
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Building Resilience",
      description: "Discover how to bounce back from life's challenges",
      duration: "18 min",
      category: "Personal Growth",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Mindful Communication",
      description: "Improve your relationships through mindful listening",
      duration: "22 min",
      category: "Relationships",
      difficulty: "Beginner"
    },
    {
      id: 4,
      title: "Managing Depression",
      description: "Professional insights on understanding and managing depression",
      duration: "30 min",
      category: "Mental Health",
      difficulty: "Intermediate"
    }
  ];

  const togglePlayback = (podcastId: number) => {
    setPlayingPodcast(playingPodcast === podcastId ? null : podcastId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Headphones className="h-5 w-5 mr-2" />
          Audio Library
        </h3>
        <Badge variant="outline">{podcasts.length} Episodes</Badge>
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-3">
          {podcasts.map((podcast) => (
            <Card key={podcast.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{podcast.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{podcast.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">{podcast.category}</Badge>
                      <Badge variant="outline" className="text-xs">{podcast.difficulty}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {podcast.duration}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePlayback(podcast.id)}
                    className="ml-2"
                  >
                    {playingPodcast === podcast.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PodcastLibrary;
