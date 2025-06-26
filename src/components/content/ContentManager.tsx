
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Video, 
  Music, 
  FileText, 
  Search,
  Filter,
  Star,
  Download,
  Play,
  Bookmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'exercise';
  category: string;
  duration: string;
  rating: number;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isBookmarked: boolean;
}

const ContentManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Understanding Anxiety: A Complete Guide',
      type: 'article',
      category: 'anxiety',
      duration: '15 min read',
      rating: 4.8,
      description: 'Comprehensive guide to understanding and managing anxiety disorders.',
      tags: ['anxiety', 'coping', 'mental-health'],
      difficulty: 'beginner',
      isBookmarked: false
    },
    {
      id: '2',
      title: 'Guided Meditation for Sleep',
      type: 'audio',
      category: 'sleep',
      duration: '20 min',
      rating: 4.9,
      description: 'Relaxing guided meditation to help you fall asleep peacefully.',
      tags: ['meditation', 'sleep', 'relaxation'],
      difficulty: 'beginner',
      isBookmarked: true
    },
    {
      id: '3',
      title: 'Cognitive Behavioral Therapy Techniques',
      type: 'video',
      category: 'therapy',
      duration: '45 min',
      rating: 4.7,
      description: 'Learn practical CBT techniques for managing thoughts and emotions.',
      tags: ['cbt', 'therapy', 'techniques'],
      difficulty: 'intermediate',
      isBookmarked: false
    },
    {
      id: '4',
      title: 'Progressive Muscle Relaxation Exercise',
      type: 'exercise',
      category: 'relaxation',
      duration: '12 min',
      rating: 4.6,
      description: 'Step-by-step guide to progressive muscle relaxation.',
      tags: ['relaxation', 'exercise', 'stress-relief'],
      difficulty: 'beginner',
      isBookmarked: false
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Content', count: content.length },
    { id: 'anxiety', name: 'Anxiety', count: content.filter(c => c.category === 'anxiety').length },
    { id: 'sleep', name: 'Sleep', count: content.filter(c => c.category === 'sleep').length },
    { id: 'therapy', name: 'Therapy', count: content.filter(c => c.category === 'therapy').length },
    { id: 'relaxation', name: 'Relaxation', count: content.filter(c => c.category === 'relaxation').length }
  ];

  const contentTypes = [
    { type: 'article', icon: FileText, color: 'text-blue-500' },
    { type: 'video', icon: Video, color: 'text-red-500' },
    { type: 'audio', icon: Music, color: 'text-green-500' },
    { type: 'exercise', icon: BookOpen, color: 'text-purple-500' }
  ];

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
    toast({
      title: "Bookmark Updated",
      description: "Content bookmark status has been updated.",
    });
  };

  const getContentIcon = (type: string) => {
    const contentType = contentTypes.find(ct => ct.type === type);
    return contentType ? contentType.icon : FileText;
  };

  const getContentColor = (type: string) => {
    const contentType = contentTypes.find(ct => ct.type === type);
    return contentType ? contentType.color : 'text-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-therapy-600" />
            <span>Content & Resource Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Access curated mental health resources, guided exercises, and educational content.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Content</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search articles, videos, exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Filter by Category</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => {
          const IconComponent = getContentIcon(item.type);
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-5 w-5 ${getContentColor(item.type)}`} />
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(item.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${item.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(item.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.duration}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(item.difficulty)}>
                    {item.difficulty}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Content Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManager;
