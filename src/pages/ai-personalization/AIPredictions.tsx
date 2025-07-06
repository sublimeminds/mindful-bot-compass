import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar, Target, Brain } from 'lucide-react';

const AIPredictions = () => {
  const predictions = [
    {
      title: "Goal Achievement Forecast",
      description: "Based on current progress patterns",
      prediction: "87% likelihood of achieving monthly wellness goals",
      confidence: 92,
      timeframe: "Next 30 days",
      icon: Target,
      color: "therapy"
    },
    {
      title: "Mood Stability Trend",
      description: "Analyzing mood patterns and interventions",
      prediction: "Mood stability expected to improve by 15% next week",
      confidence: 85,
      timeframe: "Next 7 days",
      icon: Brain,
      color: "calm"
    },
    {
      title: "Session Effectiveness",
      description: "Predicting optimal session outcomes",
      prediction: "Morning sessions will be 23% more effective than evening",
      confidence: 78,
      timeframe: "Ongoing",
      icon: TrendingUp,
      color: "harmony"
    },
    {
      title: "Engagement Forecast",
      description: "User engagement prediction model",
      prediction: "High engagement period expected mid-week (Wed-Thu)",
      confidence: 81,
      timeframe: "Weekly pattern",
      icon: Calendar,
      color: "balance"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      therapy: "border-therapy-200 bg-therapy-50 text-therapy-700",
      calm: "border-calm-200 bg-calm-50 text-calm-700",
      harmony: "border-harmony-200 bg-harmony-50 text-harmony-700",
      balance: "border-balance-200 bg-balance-50 text-balance-700"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.therapy;
  };

  const getProgressColor = (color: string) => {
    const colorMap = {
      therapy: "bg-therapy-500",
      calm: "bg-calm-500",
      harmony: "bg-harmony-500",
      balance: "bg-balance-500"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.therapy;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">AI Predictions</h1>
          <p className="text-muted-foreground">Predictive insights for your therapeutic journey</p>
        </div>
        <Badge variant="outline" className="text-therapy-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          Predictive Analytics
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">7-day predictions</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">30-day predictions</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Behavioral predictions</span>
                <span className="text-sm font-medium">91%</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-therapy-50 rounded-lg">
                <p className="text-2xl font-bold text-therapy-600">2.3K</p>
                <p className="text-xs text-muted-foreground">Data Points Analyzed</p>
              </div>
              <div className="p-3 bg-calm-50 rounded-lg">
                <p className="text-2xl font-bold text-calm-600">98.7%</p>
                <p className="text-xs text-muted-foreground">Model Confidence</p>
              </div>
              <div className="p-3 bg-harmony-50 rounded-lg">
                <p className="text-2xl font-bold text-harmony-600">45</p>
                <p className="text-xs text-muted-foreground">Variables Tracked</p>
              </div>
              <div className="p-3 bg-balance-50 rounded-lg">
                <p className="text-2xl font-bold text-balance-600">24/7</p>
                <p className="text-xs text-muted-foreground">Continuous Learning</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <Card key={index} className={`border-l-4 ${getColorClasses(prediction.color)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <prediction.icon className="w-5 h-5" />
                  <span>{prediction.title}</span>
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {prediction.timeframe}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">{prediction.description}</p>
              
              <div className="p-3 bg-white rounded-lg border">
                <p className="font-medium">{prediction.prediction}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className="text-sm font-bold">{prediction.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(prediction.color)}`}
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIPredictions;