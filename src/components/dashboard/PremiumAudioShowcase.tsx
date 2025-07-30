
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  Crown, 
  Volume2, 
  Brain, 
  Heart,
  Star,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@/types/user';

const PremiumAudioShowcase = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const userPlan = (user as UserType)?.subscription_plan || 'free';
  const isPremium = userPlan === 'premium' || userPlan === 'pro';

  const featuredContent = [
    {
      title: "Morning Mindfulness Complete",
      duration: "15:00",
      category: "Meditation",
      description: "Full guided meditation with body scan",
      tier: "premium",
      popular: true
    },
    {
      title: "Anxiety Deep Dive Podcast",
      duration: "35:00",
      category: "Education",
      description: "Comprehensive anxiety understanding",
      tier: "premium",
      popular: false
    },
    {
      title: "Advanced DBT Skills",
      duration: "45:00",
      category: "Technique",
      description: "Master-level emotional regulation",
      tier: "pro",
      popular: false
    }
  ];

  const stats = [
    { label: "Therapeutic Podcasts", value: "150+", icon: Volume2 },
    { label: "Guided Meditations", value: "200+", icon: Heart },
    { label: "Technique Exercises", value: "100+", icon: Brain },
    { label: "Languages Supported", value: "29", icon: Star }
  ];

  return (
    <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">Premium Audio Library</CardTitle>
              <p className="text-therapy-100 text-sm">Therapeutic content powered by AI</p>
            </div>
          </div>
          <Crown className="h-6 w-6 text-therapy-200" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-therapy-100">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Featured Content */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white text-sm">Featured Content</h4>
          {featuredContent.slice(0, 2).map((content, index) => (
            <div key={index} className="bg-card/50 rounded-lg p-3 border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h5 className="font-semibold text-white text-sm">{content.title}</h5>
                    {content.popular && (
                      <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-therapy-100">{content.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs border-white/30 text-therapy-100">
                      {content.category}
                    </Badge>
                    <span className="text-xs text-therapy-100">{content.duration}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-2"
                  disabled={!isPremium}
                >
                  {isPremium ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-white text-therapy-600 hover:bg-therapy-50 font-semibold"
            onClick={() => navigate('/audio-library')}
          >
            <Headphones className="h-4 w-4 mr-2" />
            {isPremium ? 'Browse Library' : 'View Library'}
          </Button>
          {!isPremium && (
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate('/pricing')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumAudioShowcase;
