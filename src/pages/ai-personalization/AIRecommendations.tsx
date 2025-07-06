import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Star, Clock, CheckCircle } from 'lucide-react';

const AIRecommendations = () => {
  const recommendations = [
    {
      id: 1,
      title: "Optimize Morning Session Times",
      description: "Based on your patterns, scheduling sessions between 9-10 AM could improve effectiveness by 25%.",
      priority: "high",
      category: "Scheduling",
      estimatedImpact: "High",
      actionSteps: ["Review current schedule", "Block 9-10 AM time slots", "Test for 2 weeks"]
    },
    {
      id: 2,
      title: "Integrate Breathing Exercises",
      description: "Adding 5-minute breathing exercises before mindfulness sessions shows 40% better outcomes.",
      priority: "medium",
      category: "Technique",
      estimatedImpact: "Medium",
      actionSteps: ["Learn basic breathing techniques", "Practice 5 minutes daily", "Track mood changes"]
    },
    {
      id: 3,
      title: "Sleep Quality Focus",
      description: "Your therapy effectiveness correlates strongly with sleep quality. Consider sleep hygiene improvements.",
      priority: "high",
      category: "Lifestyle",
      estimatedImpact: "High",
      actionSteps: ["Set consistent bedtime", "Limit screens before bed", "Track sleep patterns"]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">AI Recommendations</h1>
          <p className="text-muted-foreground">Personalized suggestions to enhance your therapy experience</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <Lightbulb className="w-4 h-4 mr-1" />
          Intelligent Suggestions
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-therapy-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-therapy-600">3</p>
            <p className="text-sm text-muted-foreground">Priority Recommendations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-calm-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-calm-600">2.5h</p>
            <p className="text-sm text-muted-foreground">Est. Implementation Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-harmony-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-harmony-600">85%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Lightbulb className="w-8 h-8 text-balance-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-balance-600">12</p>
            <p className="text-sm text-muted-foreground">Total Insights</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="border-l-4 border-therapy-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{rec.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{rec.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-therapy-500" />
                  <span className="text-sm font-medium">Impact: {rec.estimatedImpact}</span>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Recommended Steps:</p>
                <ul className="space-y-1">
                  {rec.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full"></div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  Apply Recommendation
                </Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;