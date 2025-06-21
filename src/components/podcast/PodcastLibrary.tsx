
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Podcast, 
  Play, 
  Pause, 
  Download, 
  Search,
  Filter,
  Clock,
  User,
  Star,
  TrendingUp
} from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  therapistId: string;
  therapistName: string;
  content: string;
  publishDate: string;
  rating: number;
  downloads: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const PodcastLibrary = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'all',
    'anxiety',
    'depression', 
    'trauma',
    'mindfulness',
    'relationships',
    'stress',
    'sleep',
    'addiction',
    'grief'
  ];

  const sampleEpisodes: PodcastEpisode[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: Your Brain on Worry',
      description: 'Learn how anxiety works in your brain and discover practical techniques to manage worried thoughts.',
      category: 'anxiety',
      duration: 25,
      therapistId: 'dr-sarah-chen',
      therapistName: 'Dr. Sarah Chen',
      content: `Welcome to today's episode about understanding anxiety. Anxiety is your brain's natural alarm system, designed to protect you from danger. However, sometimes this system becomes overactive, triggering fear responses even when there's no real threat.

Let's explore how anxiety manifests in your brain. When you perceive a threat, your amygdala - the brain's alarm center - sends signals that release stress hormones like cortisol and adrenaline. This creates the physical sensations you feel: rapid heartbeat, sweating, muscle tension.

Understanding that anxiety is a normal brain function can help reduce the fear of anxiety itself. You're not broken or weak - your brain is simply doing what it thinks is necessary to keep you safe.

Here are three techniques you can use right now: First, the 5-4-3-2-1 grounding technique. Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.

Second, practice deep belly breathing. Place one hand on your chest, one on your belly. Breathe so that only the bottom hand moves.

Third, remind yourself that feelings are temporary. Anxiety, no matter how intense, will pass.

Remember, you have more control over your anxiety than you might think. With practice and patience, you can learn to work with your brain rather than against it.`,
      publishDate: '2024-01-15',
      rating: 4.8,
      downloads: 1250,
      tags: ['anxiety', 'cbt', 'practical'],
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Trauma Recovery: Healing Your Inner Child',
      description: 'Gentle exploration of inner child work and trauma-informed healing approaches.',
      category: 'trauma',
      duration: 35,
      therapistId: 'dr-michael-rodriguez',
      therapistName: 'Dr. Michael Rodriguez',
      content: `Today we're going to talk about one of the most powerful aspects of trauma recovery: healing your inner child. This concept might sound abstract, but it's actually quite practical and can be deeply healing.

Your inner child represents the part of you that holds your earliest experiences, emotions, and needs. When trauma occurs, especially in childhood, parts of our emotional development can become frozen in time.

Trauma isn't just about the big, obvious events. It can also be subtle - feeling emotionally neglected, being criticized harshly, or growing up in an unpredictable environment. These experiences can leave your inner child feeling scared, abandoned, or unworthy.

The beautiful thing about inner child work is that you have the power now, as an adult, to give your inner child what they needed then. This isn't about changing the past - it's about changing your relationship with the past.

Start by imagining yourself at a younger age. What did that child need to hear? What did they need to feel safe? You might tell them: "You are worthy of love. You didn't deserve what happened to you. I'm here now, and I will protect you."

Remember, healing isn't linear. Some days will be harder than others. Be patient with yourself. Your inner child has been waiting a long time to be seen and heard. Give them the compassion they've always deserved.`,
      publishDate: '2024-01-12',
      rating: 4.9,
      downloads: 890,
      tags: ['trauma', 'inner-child', 'healing'],
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Mindful Relationships: Communication That Connects',
      description: 'Transform your relationships through mindful communication and emotional awareness.',
      category: 'relationships',
      duration: 30,
      therapistId: 'dr-emily-johnson',
      therapistName: 'Dr. Emily Johnson',
      content: `Relationships are the heart of human experience, yet many of us never learned how to communicate in ways that truly connect us with others. Today, we'll explore mindful communication - a practice that can transform every relationship in your life.

Mindful communication starts with presence. Before you speak, take a breath. Before you react, pause. This simple practice creates space between stimulus and response, allowing you to choose your words rather than simply reacting from emotion.

Listen with your whole being. Most of us listen while preparing our response, but true listening means receiving another person's words, emotions, and energy without immediately jumping to solutions or judgments.

Use "I" statements to express your feelings. Instead of "You always interrupt me," try "I feel unheard when I'm cut off mid-sentence." This approach focuses on your experience rather than attacking the other person's character.

Practice emotional regulation. When conversations get heated, it's okay to say, "I need a moment to process this. Can we continue in a few minutes?" Your nervous system needs time to settle before you can communicate clearly.

Remember, the goal isn't to win arguments or be right. The goal is to understand and be understood. Every conversation is an opportunity to deepen connection or create distance - the choice is yours.

Approach your relationships with curiosity rather than judgment. Ask questions like "Help me understand your perspective" instead of making assumptions about others' intentions.`,
      publishDate: '2024-01-10',
      rating: 4.7,
      downloads: 1100,
      tags: ['relationships', 'communication', 'mindfulness'],
      difficulty: 'beginner'
    }
  ];

  useEffect(() => {
    setEpisodes(sampleEpisodes);
  }, []);

  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const playEpisode = async (episode: PodcastEpisode) => {
    if (playingEpisode === episode.id) {
      // Pause current episode
      enhancedVoiceService.stop();
      setPlayingEpisode(null);
      return;
    }

    setIsLoading(true);
    setPlayingEpisode(episode.id);

    try {
      await enhancedVoiceService.playTherapistMessage(
        episode.content,
        episode.therapistId
      );
    } catch (error) {
      console.error('Error playing episode:', error);
    } finally {
      setIsLoading(false);
      setPlayingEpisode(null);
    }
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Podcast className="h-6 w-6 text-therapy-500" />
          <span>Therapy Podcast Library</span>
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredEpisodes.map((episode) => (
              <Card key={episode.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{episode.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">
                        {episode.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          {episode.therapistName}
                        </Badge>
                        
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(episode.duration)}
                        </Badge>
                        
                        <Badge className={`text-xs ${getDifficultyColor(episode.difficulty)}`}>
                          {episode.difficulty}
                        </Badge>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {episode.rating}
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {episode.downloads} plays
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {episode.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => playEpisode(episode)}
                        disabled={isLoading}
                        variant={playingEpisode === episode.id ? "secondary" : "default"}
                      >
                        {playingEpisode === episode.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {filteredEpisodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Podcast className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No episodes found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PodcastLibrary;
