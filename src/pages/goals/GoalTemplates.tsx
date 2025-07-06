import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, TrendingUp, Heart } from 'lucide-react';

const GoalTemplates = () => {
  const templates = [
    {
      id: 1,
      title: "Daily Mindfulness Practice",
      description: "Establish a consistent mindfulness routine",
      category: "Mindfulness",
      difficulty: "Beginner",
      duration: "30 days",
      icon: Heart,
      color: "therapy"
    },
    {
      id: 2,
      title: "Anxiety Management Program",
      description: "Learn and practice anxiety reduction techniques",
      category: "Mental Health",
      difficulty: "Intermediate", 
      duration: "8 weeks",
      icon: Target,
      color: "calm"
    },
    {
      id: 3,
      title: "Sleep Quality Improvement",
      description: "Develop healthy sleep habits and routines",
      category: "Wellness",
      difficulty: "Beginner",
      duration: "4 weeks",
      icon: Clock,
      color: "harmony"
    },
    {
      id: 4,
      title: "Stress Reduction Journey",
      description: "Comprehensive stress management approach",
      category: "Stress Management",
      difficulty: "Advanced",
      duration: "12 weeks",
      icon: TrendingUp,
      color: "balance"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Goal Templates</h1>
          <p className="text-muted-foreground">Pre-designed goal templates to kickstart your journey</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Target className="w-4 h-4 mr-1" />
          Ready-to-Use Templates
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">24</p>
            <p className="text-sm text-muted-foreground">Templates Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">89%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">6w</p>
            <p className="text-sm text-muted-foreground">Avg Duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">1.2K</p>
            <p className="text-sm text-muted-foreground">Users Helped</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <template.icon className="w-5 h-5 text-therapy-500" />
                  <span>{template.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{template.description}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-therapy-500" />
                  <span className="text-sm">{template.duration}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  Use Template
                </Button>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  Customize
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalTemplates;