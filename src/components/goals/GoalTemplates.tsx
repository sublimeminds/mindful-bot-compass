
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Award, Brain, Heart, Calendar, TrendingUp } from 'lucide-react';
import { GoalTemplate } from '@/services/goalService';

interface GoalTemplatesProps {
  onCreateFromTemplate: (template: GoalTemplate, customizations: any) => void;
}

const GoalTemplates = ({ onCreateFromTemplate }: GoalTemplatesProps) => {
  // Static templates for now since GoalService.getGoalTemplates() returns a promise
  const templates: GoalTemplate[] = [
    {
      id: '1',
      title: 'Daily Mindfulness Practice',
      description: 'Establish a consistent mindfulness routine',
      category: 'Mental Health',
      targetValue: 30,
      unit: 'days',
      tags: ['mindfulness', 'daily habit'],
      type: 'habit'
    },
    {
      id: '2',
      title: 'Exercise Routine',
      description: 'Complete regular exercise sessions',
      category: 'Physical Health',
      targetValue: 20,
      unit: 'sessions',
      tags: ['exercise', 'health'],
      type: 'habit'
    },
    {
      id: '3',
      title: 'Therapy Sessions',
      description: 'Attend scheduled therapy sessions',
      category: 'Mental Health',
      targetValue: 10,
      unit: 'sessions',
      tags: ['therapy', 'mental health'],
      type: 'treatment'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mental Health':
        return <Brain className="h-5 w-5" />;
      case 'Physical Health':
        return <Calendar className="h-5 w-5" />;
      case 'therapy-specific':
        return <Heart className="h-5 w-5" />;
      case 'personal-growth':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mental Health':
        return 'bg-therapy-100 text-therapy-800';
      case 'Physical Health':
        return 'bg-calm-100 text-calm-800';
      case 'therapy-specific':
        return 'bg-blue-100 text-blue-800';
      case 'personal-growth':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = (template: GoalTemplate) => {
    // For now, use template as-is with minimal customization
    const customizations = {
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    onCreateFromTemplate(template, customizations);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Choose from Goal Templates</h3>
        <p className="text-muted-foreground">
          Get started quickly with pre-designed goals tailored for therapy and personal growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(template.category)}
                    <Badge className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                    <Badge variant="outline">
                      {template.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Template Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{template.targetValue} {template.unit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>30 days</span>
                </div>
              </div>

              {/* Tags */}
              {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button 
                onClick={() => handleUseTemplate(template)}
                className="w-full"
              >
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalTemplates;
