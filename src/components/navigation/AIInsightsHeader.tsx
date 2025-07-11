import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Clock,
  MessageSquare,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIInsightsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-medium">AI Therapy Assistant</span>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              Active
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>&lt;500ms response</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>96.7% satisfaction</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>Personalized approach</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/therapysync-ai')}
            className="text-white hover:bg-white/10 text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            TherapySync AI
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/therapy-chat')}
            className="text-white hover:bg-white/10 text-xs"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsHeader;