import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Star, Trophy, Target, Calendar } from 'lucide-react';
import { SharedMilestone } from '@/services/communityService';

interface MilestoneCardProps {
  milestone: SharedMilestone;
  onCelebrate: (milestoneId: string) => void;
  onSupport: (milestoneId: string) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ 
  milestone, 
  onCelebrate, 
  onSupport 
}) => {
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'streak': return Star;
      case 'goal_completed': return Target;
      case 'peer_helped': return Heart;
      case 'event_attended': return Calendar;
      default: return Trophy;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'streak': return 'bg-yellow-100 text-yellow-700';
      case 'goal_completed': return 'bg-green-100 text-green-700';
      case 'peer_helped': return 'bg-pink-100 text-pink-700';
      case 'event_attended': return 'bg-blue-100 text-blue-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const MilestoneIcon = getMilestoneIcon(milestone.milestone_type);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getMilestoneColor(milestone.milestone_type)}`}>
              <MilestoneIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{milestone.title}</CardTitle>
              <p className="text-sm text-gray-600">
                Created on {formatDate(milestone.created_at)}
              </p>
            </div>
          </div>
          <Badge className={getMilestoneColor(milestone.milestone_type)}>
            {milestone.milestone_type.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4">
          {milestone.description}
        </p>
        
        {/* Milestone celebration */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{milestone.celebration_count || 0} celebrations</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{milestone.support_count || 0} supports</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onCelebrate(milestone.id)}
            >
              <Heart className="h-4 w-4 mr-1" />
              Celebrate
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSupport(milestone.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneCard;