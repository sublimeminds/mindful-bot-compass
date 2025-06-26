
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Library, 
  BookOpen, 
  Video, 
  Headphones, 
  FileText,
  Clock,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

interface ResourceCollection {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  completedCount: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
}

const ResourceLibrary = () => {
  const [collections] = useState<ResourceCollection[]>([
    {
      id: '1',
      title: 'Anxiety Management Toolkit',
      description: 'Complete collection of resources for understanding and managing anxiety.',
      itemCount: 12,
      completedCount: 5,
      category: 'anxiety',
      difficulty: 'beginner',
      estimatedTime: '3-4 hours',
      popularity: 95
    },
    {
      id: '2',
      title: 'Mindfulness & Meditation Library',
      description: 'Guided meditations and mindfulness exercises for daily practice.',
      itemCount: 20,
      completedCount: 8,
      category: 'mindfulness',
      difficulty: 'beginner',
      estimatedTime: '5-6 hours',
      popularity: 88
    },
    {
      id: '3',
      title: 'CBT Techniques Masterclass',
      description: 'Advanced cognitive behavioral therapy techniques and exercises.',
      itemCount: 15,
      completedCount: 0,
      category: 'therapy',
      difficulty: 'advanced',
      estimatedTime: '8-10 hours',
      popularity: 76
    },
    {
      id: '4',
      title: 'Sleep Optimization Program',
      description: 'Comprehensive resources for improving sleep quality and patterns.',
      itemCount: 18,
      completedCount: 12,
      category: 'sleep',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      popularity: 92
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anxiety': return FileText;
      case 'mindfulness': return Headphones;
      case 'therapy': return Video;
      case 'sleep': return BookOpen;
      default: return Library;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Library className="h-6 w-6 text-therapy-600" />
            <span>Resource Collections</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Curated collections of therapeutic resources organized by topic and difficulty level.
          </p>
        </CardContent>
      </Card>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection) => {
          const IconComponent = getCategoryIcon(collection.category);
          const completionPercentage = (collection.completedCount / collection.itemCount) * 100;
          
          return (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-6 w-6 text-therapy-600" />
                    <div>
                      <CardTitle className="text-lg">{collection.title}</CardTitle>
                      <Badge className={getDifficultyColor(collection.difficulty)}>
                        {collection.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{collection.popularity}% popular</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{collection.description}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{collection.completedCount} / {collection.itemCount} completed</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.itemCount} resources</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1">
                    {collection.completedCount > 0 ? 'Continue' : 'Start Collection'}
                  </Button>
                  <Button variant="outline">
                    Preview
                  </Button>
                </div>

                {completionPercentage === 100 && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-2 rounded">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Collection Completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceLibrary;
