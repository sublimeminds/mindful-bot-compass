
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Target, TrendingUp, Calendar, Brain, Heart } from 'lucide-react';
import ProgressStats from '@/components/ProgressStats';
import QuickActions from '@/components/QuickActions';
import SessionRecommendations from '@/components/SessionRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { useTherapist } from '@/contexts/TherapistContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { currentTherapist } = useTherapist();
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate('/chat');
  };

  const handleChangeTherapist = () => {
    navigate('/therapist-matching');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Therapist Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-therapy-600" />
              <span>Welcome back, {user?.user_metadata?.name || 'there'}!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Ready to continue your mental wellness journey?
            </p>
            <Button 
              onClick={handleStartSession}
              className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Therapy Session
            </Button>
          </CardContent>
        </Card>

        {/* Current Therapist Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-therapy-600" />
              <span>Your AI Therapist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTherapist ? (
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">{currentTherapist.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentTherapist.title}</p>
                </div>
                <p className="text-sm">{currentTherapist.description}</p>
                <div className="flex flex-wrap gap-1">
                  {currentTherapist.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleChangeTherapist}
                  className="w-full"
                >
                  Change Therapist
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No therapist selected yet. Take our assessment to find your perfect match.
                </p>
                <Button 
                  onClick={handleChangeTherapist}
                  className="w-full"
                  variant="outline"
                >
                  Find My Therapist
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressStats />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Session Recommendations */}
      <SessionRecommendations />
    </div>
  );
};

export default UserDashboard;
