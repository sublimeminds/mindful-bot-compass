import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Pause, Download, Search, Filter, Star, Heart, Timer, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useSafeSEO } from '@/hooks/useSafeSEO';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'mindfulness' | 'sleep' | 'stress' | 'focus' | 'healing' | 'spiritual';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  rating: number;
  plays: number;
  premium: boolean;
  tags: string[];
  audioUrl?: string;
}

const MEDITATIONS: Meditation[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    description: 'Start your day with intention and awareness',
    duration: 10,
    category: 'mindfulness',
    difficulty: 'beginner',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    plays: 15420,
    premium: false,
    tags: ['morning', 'awareness', 'intention']
  },
  {
    id: '2',
    title: 'Deep Sleep Meditation',
    description: 'Gentle guidance into peaceful sleep',
    duration: 25,
    category: 'sleep',
    difficulty: 'beginner',
    instructor: 'Michael Chen',
    rating: 4.9,
    plays: 23150,
    premium: true,
    tags: ['sleep', 'relaxation', 'bedtime']
  },
  {
    id: '3',
    title: 'Stress Release Visualization',
    description: 'Let go of tension and find inner calm',
    duration: 15,
    category: 'stress',
    difficulty: 'intermediate',
    instructor: 'Dr. Emily Rodriguez',
    rating: 4.7,
    plays: 18300,
    premium: true,
    tags: ['stress relief', 'visualization', 'calm']
  },
  {
    id: '4',
    title: 'Focus Enhancement',
    description: 'Sharpen your concentration and mental clarity',
    duration: 12,
    category: 'focus',
    difficulty: 'intermediate',
    instructor: 'David Kim',
    rating: 4.6,
    plays: 12800,
    premium: true,
    tags: ['concentration', 'clarity', 'productivity']
  },
  {
    id: '5',
    title: 'Body Scan Healing',
    description: 'Connect with your body for healing and awareness',
    duration: 20,
    category: 'healing',
    difficulty: 'beginner',
    instructor: 'Lisa Thompson',
    rating: 4.8,
    plays: 16750,
    premium: false,
    tags: ['body scan', 'healing', 'awareness']
  },
  {
    id: '6',
    title: 'Loving-Kindness Practice',
    description: 'Cultivate compassion for yourself and others',
    duration: 18,
    category: 'spiritual',
    difficulty: 'intermediate',
    instructor: 'Rev. James Wilson',
    rating: 4.9,
    plays: 14200,
    premium: true,
    tags: ['compassion', 'love', 'kindness']
  }
];

const MeditationLibraryPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useSafeSEO({
    title: 'Meditation Library - Guided Meditations & Mindfulness | TherapySync',
    description: 'Access our premium meditation library with guided meditations for sleep, stress relief, mindfulness, and spiritual growth. Led by expert instructors.',
    keywords: 'meditation library, guided meditation, mindfulness, sleep meditation, stress relief, spiritual practice'
  });

  const filteredMeditations = MEDITATIONS.filter(meditation => {
    const matchesSearch = meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meditation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || meditation.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || meditation.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mindfulness': return 'bg-blue-100 text-blue-700';
      case 'sleep': return 'bg-purple-100 text-purple-700';
      case 'stress': return 'bg-red-100 text-red-700';
      case 'focus': return 'bg-orange-100 text-orange-700';
      case 'healing': return 'bg-green-100 text-green-700';
      case 'spiritual': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePlay = (meditationId: string) => {
    setCurrentlyPlaying(currentlyPlaying === meditationId ? null : meditationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Meditation Library
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover guided meditations led by expert instructors. Find peace, reduce stress, and enhance your well-being.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search meditations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="stress">Stress Relief</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="healing">Healing</SelectItem>
                  <SelectItem value="spiritual">Spiritual</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
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
          </div>

          {/* Meditation Grid */}
          {filteredMeditations.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No meditations found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeditations.map((meditation) => (
                <Card key={meditation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-therapy-600" />
                        <CardTitle className="text-lg line-clamp-2">{meditation.title}</CardTitle>
                      </div>
                      {meditation.premium && (
                        <Badge className="bg-gradient-to-r from-therapy-500 to-therapy-600 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(meditation.category)}>
                        {meditation.category}
                      </Badge>
                      <Badge className={getDifficultyColor(meditation.difficulty)}>
                        {meditation.difficulty}
                      </Badge>
                    </div>
                    
                    <CardDescription className="line-clamp-2">
                      {meditation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{meditation.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{meditation.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{meditation.plays.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Instructor: </span>
                      {meditation.instructor}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {meditation.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => handlePlay(meditation.id)}
                        className="flex-1 bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
                        disabled={meditation.premium}
                      >
                        {currentlyPlaying === meditation.id ? (
                          <Pause className="h-4 w-4 mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {currentlyPlaying === meditation.id ? 'Pause' : 'Play'}
                      </Button>
                      
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="outline" size="icon" disabled={meditation.premium}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {meditation.premium && (
                      <div className="text-center p-3 bg-therapy-50 rounded-lg">
                        <p className="text-sm text-therapy-700 font-medium">
                          Premium meditation - Upgrade to access
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-therapy-600">{MEDITATIONS.length}</div>
                <div className="text-sm text-gray-600">Total Meditations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-therapy-600">{MEDITATIONS.filter(m => !m.premium).length}</div>
                <div className="text-sm text-gray-600">Free Meditations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-therapy-600">{MEDITATIONS.filter(m => m.premium).length}</div>
                <div className="text-sm text-gray-600">Premium Meditations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-therapy-600">6</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationLibraryPage;