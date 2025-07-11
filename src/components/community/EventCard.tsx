import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Video, Calendar } from 'lucide-react';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  category: string;
  start_time: string;
  end_time: string;
  max_participants: number | null;
  is_virtual: boolean;
  meeting_link: string | null;
  location: string | null;
  participant_count: number | null;
  organizer_id: string;
  is_active: boolean;
}

interface EventCardProps {
  event: CommunityEvent;
  onJoin: (eventId: string) => void;
  isJoined?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onJoin, isJoined = false }) => {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const startDateTime = formatDateTime(event.start_time);
  const endDateTime = formatDateTime(event.end_time);

  const getEventTypeIcon = () => {
    if (event.is_virtual) return Video;
    return MapPin;
  };

  const getEventTypeColor = () => {
    switch (event.event_type) {
      case 'group_therapy': return 'bg-blue-100 text-blue-700';
      case 'support_group': return 'bg-green-100 text-green-700';
      case 'workshop': return 'bg-purple-100 text-purple-700';
      case 'social': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const EventIcon = getEventTypeIcon();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <EventIcon className="h-5 w-5 text-gray-600" />
              <Badge className={getEventTypeColor()}>
                {event.event_type.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{startDateTime.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{startDateTime.time} - {endDateTime.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {event.participant_count || 0}
              {event.max_participants && ` / ${event.max_participants}`} participants
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">{event.category}</Badge>
          <Button 
            onClick={() => onJoin(event.id)}
            disabled={isJoined}
            className={isJoined ? 'bg-green-600 hover:bg-green-700' : 'bg-therapy-600 hover:bg-therapy-700'}
          >
            {isJoined ? 'Joined' : 'Join Event'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;