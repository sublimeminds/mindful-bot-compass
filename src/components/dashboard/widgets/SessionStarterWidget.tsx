
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Clock, Brain, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TreeLogo from '@/components/ui/TreeLogo';

const SessionStarterWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStartHovered, setIsStartHovered] = useState(false);

  const handleStartSession = () => {
    navigate('/therapy');
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TreeLogo 
              size="md"
              animated={true}
              variant="breathing"
              className="drop-shadow-sm"
            />
            <div>
              <CardTitle className="text-2xl font-bold">
                Welcome back, {user?.user_metadata?.name || 'there'}!
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Ready to continue your mental wellness journey?
              </p>
            </div>
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
            onMouseEnter={() => setIsStartHovered(true)}
            onMouseLeave={() => setIsStartHovered(false)}
            className="flex-1 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-therapy-500/30 transition-all duration-300 group relative overflow-hidden"
            size="lg"
          >
            <div className="flex items-center justify-center relative z-10">
              <div className={`mr-3 transition-transform duration-500 ${isStartHovered ? 'scale-110' : 'scale-100'}`}>
                <TreeLogo 
                  size="sm"
                  variant={isStartHovered ? 'growing' : 'breathing'}
                  className="text-white filter brightness-0 invert"
                />
              </div>
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Therapy Session
            </div>
            
            {/* Growing tree background effect */}
            {isStartHovered && (
              <div className="absolute inset-0 bg-gradient-to-r from-therapy-600/20 to-calm-600/20 animate-tree-grow" />
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/therapy')}
            className="px-6 border-therapy-200 hover:bg-therapy-50 group"
          >
            <TreeLogo 
              size="sm" 
              className="mr-2 group-hover:animate-tree-breathe opacity-60"
            />
            Quick Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionStarterWidget;
