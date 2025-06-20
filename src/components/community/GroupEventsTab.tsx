
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Video } from 'lucide-react';
import CreateEventDialog from './CreateEventDialog';

interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'virtual' | 'in_person';
  location?: string;
  max_attendees?: number;
  current_attendees: number;
  host_name: string;
  is_recurring: boolean;
}

interface GroupEventsTabProps {
  groupId: string;
  isJoined: boolean;
  canModerate?: boolean;
}

const GroupEventsTab: React.FC<GroupEventsTabProps> = ({ 
  groupId, 
  isJoined, 
  canModerate = false 
}) => {
  const [events] = useState<GroupEvent[]>([
    {
      id: '1',
      title: 'Weekly Check-in Circle',
      description: 'A safe space to share how your week has been and connect with others.',
      date: '2025-06-25',
      time: '19:00',
      type: 'virtual',
      max_attendees: 12,
      current_attendees: 8,
      host_name: 'Sarah M.',
      is_recurring: true
    },
    {
      id: '2',
      title: 'Mindfulness Meditation Session',
      description: 'Guided meditation and mindfulness exercises for stress relief.',
      date: '2025-06-22',
      time: '10:00',
      type: 'virtual',
      max_attendees: 20,
      current_attendees: 15,
      host_name: 'Dr. Johnson',
      is_recurring: false
    }
  ]);

  const formatEventDate = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return {
      date: eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const handleJoinEvent = (eventId: string) => {
    console.log('Joining event:', eventId);
    // TODO: Implement join event functionality
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        {(isJoined || canModerate) && (
          <CreateEventDialog groupId={groupId} onEventCreated={() => {}} />
        )}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
            <p className="text-gray-600">
              {isJoined 
                ? 'Be the first to organize an event for this group!' 
                : 'Join the group to see and participate in events.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map(event => {
            const formattedDate = formatEventDate(event.date, event.time);
            const isUpcoming = new Date(`${event.date}T${event.time}`) > new Date();
            
            return (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {event.is_recurring && (
                          <Badge variant="outline">Recurring</Badge>
                        )}
                        <Badge 
                          variant={event.type === 'virtual' ? 'default' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {event.type === 'virtual' ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {event.type === 'virtual' ? 'Virtual' : 'In Person'}
                        </Badge>
                      </div>
                      <CardDescription className="mb-3">
                        {event.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formattedDate.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formattedDate.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.current_attendees}
                            {event.max_attendees && `/${event.max_attendees}`} attendees
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Hosted by {event.host_name}
                      </p>
                    </div>
                    {isJoined && isUpcoming && (
                      <Button 
                        onClick={() => handleJoinEvent(event.id)}
                        disabled={event.max_attendees ? event.current_attendees >= event.max_attendees : false}
                        className="bg-therapy-600 hover:bg-therapy-700"
                      >
                        {event.max_attendees && event.current_attendees >= event.max_attendees 
                          ? 'Full' 
                          : 'Join Event'
                        }
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupEventsTab;
