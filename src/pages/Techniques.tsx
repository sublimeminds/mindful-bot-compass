
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { Heart, Brain, Zap, Clock, Star } from 'lucide-react';

const Techniques = () => {
  const { user } = useSimpleApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const techniques = [
    {
      id: '1',
      title: 'Deep Breathing Exercise',
      category: 'anxiety',
      duration: 5,
      difficulty: 'beginner',
      rating: 4.8,
      description: 'A simple breathing technique to reduce anxiety and stress.',
      icon: Heart
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      category: 'stress',
      duration: 15,
      difficulty: 'intermediate',
      rating: 4.6,
      description: 'Systematically tense and relax muscle groups to reduce physical tension.',
      icon: Brain
    },
    {
      id: '3',
      title: 'Mindfulness Meditation',
      category: 'mindfulness',
      duration: 10,
      difficulty: 'beginner',
      rating: 4.9,
      description: 'Focus on the present moment to cultivate awareness and calm.',
      icon: Zap
    }
  ];

  const categories = [
    { id: 'all', label: 'All Techniques' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'stress', label: 'Stress' },
    { id: 'mindfulness', label: 'Mindfulness' }
  ];

  const filteredTechniques = selectedCategory === 'all' 
    ? techniques 
    : techniques.filter(technique => technique.category === selectedCategory);

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Please log in to access therapeutic techniques.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Therapeutic Techniques</h1>
        <p className="text-muted-foreground">
          Discover evidence-based techniques to support your mental wellness journey.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="rounded-full"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechniques.map((technique) => (
          <Card key={technique.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <technique.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{technique.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {technique.category}
                      </Badge>
                      <Badge variant="outline">
                        {technique.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {technique.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{technique.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{technique.rating}</span>
                </div>
              </div>

              <Button className="w-full">
                Start Technique
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTechniques.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No techniques found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Techniques;
