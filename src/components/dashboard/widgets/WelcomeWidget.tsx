import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Sparkles, Heart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-therapy-50/70 to-calm-50/70 border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>Welcome!</span>
        </CardTitle>
        <Badge variant="secondary">
          {user ? 'Authenticated' : 'Guest'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            {user ? `Welcome back, ${user.email}!` : 'Welcome to TherapySync'}
          </h2>
          <p className="text-muted-foreground">
            {user ? 'Ready for your next session?' : 'Start your journey to better mental health.'}
          </p>
          <div className="flex items-center space-x-4 mt-4">
            {user ? (
              <>
                <Button onClick={() => navigate('/session')} className="bg-therapy-500 hover:bg-therapy-600 text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
                <Button variant="outline" onClick={() => navigate('/goals')}>
                  <Target className="h-4 w-4 mr-2" />
                  Track Goals
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-therapy-500 hover:bg-therapy-600 text-white">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeWidget;
