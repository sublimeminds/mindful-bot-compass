import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Globe, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Award,
  Search,
  Filter,
  Zap,
  Sparkles,
  Target,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Languages,
  HandHeart,
  Lightbulb,
  Plus,
  Video,
  BookOpen,
  Play,
  Coffee,
  Compass,
  TreePine,
  Music,
  Palette,
  Brain,
  Phone,
  MessageCircle,
  Share2,
  ThumbsUp,
  UserPlus,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EnhancedCommunityService, type ExtendedSupportGroup, type CommunityChallenge, type LiveEvent, type PeerConnection, type CommunityResource } from '@/services/enhancedCommunityService';

const EnhancedCommunityHubCore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [supportGroups, setSupportGroups] = useState<ExtendedSupportGroup[]>([]);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [peerConnections, setPeerConnections] = useState<PeerConnection[]>([]);
  const [resources, setResources] = useState<CommunityResource[]>([]);
  const [communityStats, setCommunityStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadCommunityData();
    }
  }, [user]);

  const loadCommunityData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [
        groupsData,
        challengesData,
        eventsData,
        peerData,
        resourcesData,
        statsData
      ] = await Promise.all([
        EnhancedCommunityService.getSupportGroups(),
        EnhancedCommunityService.getCommunityBuilders(),
        EnhancedCommunityService.getLiveEvents(),
        EnhancedCommunityService.findPeerMatches(user.id),
        EnhancedCommunityService.getCommunityResources(),
        EnhancedCommunityService.getCommunityStats()
      ]);

      setSupportGroups(groupsData);
      setChallenges(challengesData);
      setLiveEvents(eventsData);
      setPeerConnections(peerData);
      setResources(resourcesData);
      setCommunityStats(statsData);
    } catch (error) {
      console.error('Error loading community data:', error);
      toast({
        title: "Error loading community",
        description: "Failed to load community data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await EnhancedCommunityService.searchCommunityContent(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    // This would need a group membership table
    toast({
      title: "Joined Group",
      description: "You've successfully joined the support group!",
    });
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await EnhancedCommunityService.joinChallenge(challengeId, user?.id || '');
      toast({
        title: "Challenge Joined",
        description: "You've successfully joined the wellness challenge!",
      });
      loadCommunityData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      await EnhancedCommunityService.joinLiveEvent(eventId, user?.id || '');
      toast({
        title: "Event Joined",
        description: "You've successfully registered for the event!",
      });
      loadCommunityData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ComponentType } = {
      'anxiety': Zap,
      'depression': Heart,
      'family': Users,
      'cultural': Globe,
      'wellness': Sparkles,
      'mindfulness': Brain,
      'support': HandHeart,
      'workshop': BookOpen,
      'celebration': Calendar,
      'meditation': TreePine
    };
    
    return iconMap[category.toLowerCase()] || Users;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'anxiety': 'bg-blue-100 text-blue-700',
      'depression': 'bg-purple-100 text-purple-700',
      'family': 'bg-green-100 text-green-700',
      'cultural': 'bg-orange-100 text-orange-700',
      'wellness': 'bg-pink-100 text-pink-700',
      'mindfulness': 'bg-indigo-100 text-indigo-700',
      'support': 'bg-yellow-100 text-yellow-700',
      'workshop': 'bg-red-100 text-red-700',
      'celebration': 'bg-teal-100 text-teal-700',
      'meditation': 'bg-gray-100 text-gray-700'
    };
    
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  const getEventTypeIcon = (type: string) => {
    const iconMap: { [key: string]: React.ComponentType } = {
      'support_group': Users,
      'workshop': BookOpen,
      'cultural_celebration': Globe,
      'peer_session': MessageCircle,
      'meditation': Brain,
      'storytelling': MessageSquare
    };
    
    return iconMap[type] || Calendar;
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading community...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Globe className="h-8 w-8 mr-3 text-primary" />
              Enhanced Community Hub
            </h1>
            <p className="text-muted-foreground mt-2">Connect, support, and grow together</p>
          </div>
          
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search community..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={handleSearch} size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{communityStats.supportGroups || 0}</div>
              <div className="text-sm text-muted-foreground">Support Groups</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{communityStats.activeChallenges || 0}</div>
              <div className="text-sm text-muted-foreground">Active Challenges</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{communityStats.peerConnections || 0}</div>
              <div className="text-sm text-muted-foreground">Peer Connections</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{communityStats.liveEvents || 0}</div>
              <div className="text-sm text-muted-foreground">Live Events</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{communityStats.resources || 0}</div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                  </div>
                  <Badge variant="outline">{result.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
          <TabsTrigger value="peers">Peer Network</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Community Feed */}
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">John D. joined "Anxiety Support Circle"</div>
                        <div className="text-sm text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Avatar>
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Sarah M. completed "30-Day Mindfulness Challenge"</div>
                        <div className="text-sm text-muted-foreground">4 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Avatar>
                        <AvatarFallback>ML</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Maria L. shared a new cultural healing resource</div>
                        <div className="text-sm text-muted-foreground">6 hours ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Support Group
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Event
                  </Button>
                  <Button className="w-full" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Peer Buddy
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Support Groups */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportGroups.map((group) => {
              const IconComponent = getCategoryIcon(group.category);
              return (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(group.category)}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {group.category}
                      </Badge>
                      <Badge variant="outline">{group.privacy_level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{group.member_count}/{group.max_members} members</span>
                      <div className="flex items-center space-x-2">
                        {group.languages?.map((lang, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const IconComponent = getCategoryIcon(challenge.challenge_type);
              return (
                <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(challenge.challenge_type)}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {challenge.challenge_type}
                      </Badge>
                      <Badge variant="outline">{challenge.difficulty_level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {challenge.description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center justify-between">
                        <span>Participants:</span>
                        <span>{challenge.participant_count}{challenge.max_participants ? `/${challenge.max_participants}` : ''}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reward:</span>
                        <span>{challenge.reward_points} points</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Duration:</span>
                        <span>{challenge.start_date} - {challenge.end_date}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Live Events */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.map((event) => {
              const IconComponent = getEventTypeIcon(event.event_type);
              const startTime = new Date(event.start_time);
              const endTime = new Date(event.end_time);
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(event.event_type)}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {event.is_virtual ? 'Virtual' : 'In-Person'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{startTime.toLocaleDateString()} {startTime.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.participant_count}/{event.max_participants} participants</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.languages?.map((lang, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      {event.registration_required ? 'Register' : 'Join Event'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Peer Network */}
        <TabsContent value="peers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peerConnections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>PC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Peer Connection</div>
                      <Badge variant="outline">{connection.connection_type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Compatibility:</span>
                      <span>{Math.round((connection.compatibility_score || 0) * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">{connection.status}</Badge>
                    </div>
                    {connection.shared_goals && connection.shared_goals.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Shared Goals:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {connection.shared_goals.map((goal, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const IconComponent = getCategoryIcon(resource.category);
              return (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(resource.category)}>
                        <IconComponent className="h-3 w-3 mr-1" />
                        {resource.category}
                      </Badge>
                      <Badge variant="outline">{resource.content_type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{resource.upvotes}</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="secondary">{resource.difficulty_level}</Badge>
                      </div>
                    </div>
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Play className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommunityHubCore;