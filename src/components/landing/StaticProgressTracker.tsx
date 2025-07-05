import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, TrendingUp, Heart } from 'lucide-react';

// Pure static progress tracker - no React hooks, renders immediately
const StaticProgressTracker = () => {
  const progressSteps = [
    {
      icon: CheckCircle,
      title: "Account Created",
      description: "Welcome to TherapySync",
      status: "completed",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "Personality Assessment",
      description: "Understanding your needs",
      status: "current",
      color: "text-therapy-500"
    },
    {
      icon: TrendingUp,
      title: "Personalized Plan",
      description: "Your custom therapy approach",
      status: "pending",
      color: "text-slate-400"
    },
    {
      icon: Clock,
      title: "First Session",
      description: "Begin your healing journey",
      status: "pending", 
      color: "text-slate-400"
    }
  ];

  const stats = [
    { label: "Progress", value: "25%", color: "text-therapy-600" },
    { label: "Sessions", value: "0/∞", color: "text-calm-600" },
    { label: "Streak", value: "1 day", color: "text-balance-600" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold therapy-text-gradient mb-2">
              Your Journey Progress
            </h3>
            <p className="text-slate-600">
              Track your mental health journey and celebrate milestones
            </p>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {progressSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      step.status === 'completed' 
                        ? 'bg-green-100' 
                        : step.status === 'current'
                        ? 'bg-therapy-100'
                        : 'bg-slate-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                  
                  {/* Progress Line */}
                  {index < progressSteps.length - 1 && (
                    <div className="hidden md:block relative mt-4">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-slate-200">
                        {step.status === 'completed' && (
                          <div className="h-full bg-gradient-to-r from-therapy-500 to-calm-500 w-full"></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 border-t pt-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="mt-6 p-4 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg text-center">
            <p className="text-sm text-therapy-700 font-medium mb-2">
              🎯 Next: Complete your personality assessment
            </p>
            <p className="text-xs text-slate-600">
              This helps us create your personalized therapy approach
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticProgressTracker;