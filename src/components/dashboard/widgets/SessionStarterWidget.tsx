
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SessionStarterWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate('/chat');
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Welcome back, {user?.user_metadata?.name || 'there'}!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Ready to continue your mental wellness journey?
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-therapy-500" />
            <span>15-45 min sessions</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Brain className="h-4 w-4 text-therapy-500" />
            <span>Personalized therapy</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4 text-therapy-500" />
            <span>Safe & confidential</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleStartSession}
            className="flex-1 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-therapy-500/30 transition-all duration-300"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Start Therapy Session
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/chat')}
            className="px-6 border-therapy-200 hover:bg-therapy-50"
          >
            Quick Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionStarterWidget;
