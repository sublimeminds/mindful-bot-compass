
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Lock, Globe, ShieldCheck } from 'lucide-react';
import { SupportGroup } from '@/services/communityService';

interface SupportGroupCardProps {
  group: SupportGroup;
  onJoin: (groupId: string) => void;
  isJoined?: boolean;
}

const SupportGroupCard: React.FC<SupportGroupCardProps> = ({ 
  group, 
  onJoin, 
  isJoined = false 
}) => {
  const getGroupTypeIcon = () => {
    switch (group.group_type) {
      case 'open':
        return <Globe className="h-4 w-4" />;
      case 'closed':
        return <Lock className="h-4 w-4" />;
      case 'moderated':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getGroupTypeColor = () => {
    switch (group.group_type) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-blue-100 text-blue-800';
      case 'moderated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="mt-1">
              {group.description}
            </CardDescription>
          </div>
          <Badge className={getGroupTypeColor()}>
            <div className="flex items-center gap-1">
              {getGroupTypeIcon()}
              <span className="capitalize">{group.group_type}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{group.current_members}/{group.max_members} members</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {group.category}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span>Active discussions</span>
            </div>
            
            {!isJoined ? (
              <Button 
                onClick={() => onJoin(group.id)}
                disabled={group.current_members >= group.max_members}
                size="sm"
              >
                {group.current_members >= group.max_members ? 'Full' : 'Join Group'}
              </Button>
            ) : (
              <Badge variant="secondary">
                Member
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportGroupCard;
