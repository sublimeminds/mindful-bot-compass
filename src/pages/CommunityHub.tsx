
import React, { useState, useEffect } from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import EnhancedCommunityHub from '@/components/community/EnhancedCommunityHub';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Heart, 
  Shield, 
  Star,
  Search,
  Plus,
  MapPin,
  Clock,
  Video,
  Mic,
  Camera,
  BookOpen,
  Award,
  TrendingUp,
  Globe,
  Coffee,
  Lightbulb,
  Target,
  Compass,
  Brain,
  Sparkles,
  Hand,
  TreePine,
  Music,
  Palette,
  Dumbbell,
  Moon,
  Sun,
  UserPlus,
  Settings,
  Filter,
  ChevronRight,
  PlayCircle,
  MessageCircle,
  ThumbsUp,
  Share2,
  Bookmark,
  Bell,
  Activity,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CommunityService, SupportGroup, GroupDiscussion, SharedMilestone } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EventCard from '@/components/community/EventCard';
import MilestoneCard from '@/components/community/MilestoneCard';
import CreateEventDialog from '@/components/community/CreateEventDialog';
import CreateMilestoneDialog from '@/components/community/CreateMilestoneDialog';
import DiscussionCard from '@/components/community/DiscussionCard';
import EnhancedCreateDiscussionDialog from '@/components/community/EnhancedCreateDiscussionDialog';
import CommunityPostCreator from '@/components/community/CommunityPostCreator';
import PostInteractionButtons from '@/components/community/PostInteractionButtons';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'local' | 'workshop' | 'group_therapy';
  date: string;
  time: string;
  duration: number;
  location?: string;
  facilitator: string;
  participants: number;
  maxParticipants: number;
  tags: string[];
  isJoined: boolean;
}

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    badge?: string;
  };
  content: string;
  type: 'discussion' | 'milestone' | 'question' | 'resource';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  group?: string;
  tags: string[];
}

interface PeerConnection {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'in_session';
  compatibility: number;
  sharedGoals: string[];
  connectionType: 'buddy' | 'mentor' | 'peer';
}

const CommunityHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SupportGroup[]>([]);
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [milestones, setMilestones] = useState<SharedMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for demonstration - In real app, fetch from API
  const [communityEvents] = useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Morning Mindfulness Circle',
      description: 'Start your day with guided meditation and community connection',
      type: 'virtual',
      date: '2024-12-15',
      time: '08:00',
      duration: 30,
      facilitator: 'Dr. Sarah Chen',
      participants: 23,
      maxParticipants: 50,
      tags: ['mindfulness', 'meditation', 'morning'],
      isJoined: false
    },
    {
      id: '2',
      title: 'Anxiety Support Group',
      description: 'Safe space to discuss anxiety management strategies',
      type: 'group_therapy',
      date: '2024-12-15',
      time: '18:00',
      duration: 60,
      facilitator: 'Licensed Therapist',
      participants: 8,
      maxParticipants: 12,
      tags: ['anxiety', 'support', 'coping'],
      isJoined: true
    },
    {
      id: '3',
      title: 'DBT Skills Workshop',
      description: 'Learn practical Dialectical Behavior Therapy techniques',
      type: 'workshop',
      date: '2024-12-16',
      time: '14:00',
      duration: 90,
      facilitator: 'Dr. Maya Patel',
      participants: 15,
      maxParticipants: 25,
      tags: ['dbt', 'skills', 'therapy'],
      isJoined: false
    },
    {
      id: '4',
      title: 'Coffee & Connection Meetup',
      description: 'Casual local meetup for peer support',
      type: 'local',
      date: '2024-12-17',
      time: '10:00',
      duration: 120,
      location: 'Central Park Cafe, New York',
      facilitator: 'Community Volunteer',
      participants: 12,
      maxParticipants: 20,
      tags: ['local', 'social', 'coffee'],
      isJoined: false
    }
  ]);

  const [communityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: {
        id: '1',
        name: 'Alex M.',
        avatar: '',
        badge: '30 Days Strong'
      },
      content: 'Just hit my 30-day mindfulness streak! The community support has been incredible. Thank you all for the encouragement. 🧘‍♀️',
      type: 'milestone',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      isLiked: false,
      group: 'Mindfulness Masters',
      tags: ['milestone', 'mindfulness', 'success']
    },
    {
      id: '2',
      author: {
        id: '2',
        name: 'Jordan K.',
        avatar: '',
        badge: 'Peer Mentor'
      },
      content: 'Has anyone tried the new breathing exercise from yesterday\'s session? I found it really helpful for managing panic attacks. Would love to hear your experiences!',
      type: 'question',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 15,
      isLiked: true,
      group: 'Anxiety Warriors',
      tags: ['question', 'anxiety', 'techniques']
    },
    {
      id: '3',
      author: {
        id: '3',
        name: 'Community Team',
        avatar: '',
        badge: 'Official'
      },
      content: 'New research on the benefits of group therapy for depression. Studies show 40% better outcomes when combined with peer support. Link in comments! 📚',
      type: 'resource',
      timestamp: '6 hours ago',
      likes: 31,
      comments: 5,
      isLiked: false,
      tags: ['research', 'depression', 'group-therapy']
    }
  ]);

  const [peerConnections] = useState<PeerConnection[]>([
    {
      id: '1',
      name: 'Sarah T.',
      avatar: '',
      status: 'online',
      compatibility: 94,
      sharedGoals: ['Mindfulness', 'Anxiety Management'],
      connectionType: 'buddy'
    },
    {
      id: '2',
      name: 'Mike R.',
      avatar: '',
      status: 'in_session',
      compatibility: 87,
      sharedGoals: ['Depression Recovery', 'Daily Habits'],
      connectionType: 'peer'
    },
    {
      id: '3',
      name: 'Dr. Lisa Wong',
      avatar: '',
      status: 'online',
      compatibility: 96,
      sharedGoals: ['CBT Techniques', 'Professional Growth'],
      connectionType: 'mentor'
    }
  ]);

  const supportGroupCategories = [
    { name: 'Anxiety & Panic', icon: Shield, color: 'bg-blue-100 text-blue-700', count: 12 },
    { name: 'Depression Support', icon: Heart, color: 'bg-purple-100 text-purple-700', count: 8 },
    { name: 'Trauma Recovery', icon: Award, color: 'bg-green-100 text-green-700', count: 6 },
    { name: 'LGBTQ+ Mental Health', icon: Users, color: 'bg-rainbow-100 text-rainbow-700', count: 4 },
    { name: 'Family Support', icon: Hand, color: 'bg-orange-100 text-orange-700', count: 7 },
    { name: 'Addiction Recovery', icon: Target, color: 'bg-red-100 text-red-700', count: 9 },
    { name: 'Life Transitions', icon: Compass, color: 'bg-teal-100 text-teal-700', count: 5 },
    { name: 'Cultural Wellness', icon: Globe, color: 'bg-indigo-100 text-indigo-700', count: 3 }
  ];

  const wellnessActivities = [
    { name: 'Meditation Sessions', icon: Brain, participants: 156, nextSession: 'Today 8:00 AM' },
    { name: 'Art Therapy', icon: Palette, participants: 89, nextSession: 'Tomorrow 2:00 PM' },
    { name: 'Music Healing', icon: Music, participants: 67, nextSession: 'Today 7:00 PM' },
    { name: 'Nature Walks', icon: TreePine, participants: 234, nextSession: 'Saturday 9:00 AM' },
    { name: 'Fitness for Mental Health', icon: Dumbbell, participants: 145, nextSession: 'Daily 6:00 AM' },
    { name: 'Sleep Wellness', icon: Moon, participants: 198, nextSession: 'Tonight 9:00 PM' }
  ];

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [groupsData, userGroupsData, milestonesData] = await Promise.all([
          CommunityService.getSupportGroups(),
          CommunityService.getUserGroups(user.id),
          CommunityService.getPublicMilestones()
        ]);
        
        setSupportGroups(groupsData);
        setMyGroups(userGroupsData);
        setMilestones(milestonesData);
      } catch (error) {
        console.error('Error fetching community data:', error);
        toast({
          title: "Error loading community",
          description: "Failed to load community data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityData();
  }, [user, toast]);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual': return Video;
      case 'local': return MapPin;
      case 'workshop': return BookOpen;
      case 'group_therapy': return Users;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'virtual': return 'bg-blue-100 text-blue-700';
      case 'local': return 'bg-green-100 text-green-700';
      case 'workshop': return 'bg-purple-100 text-purple-700';
      case 'group_therapy': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'in_session': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'buddy': return Users;
      case 'mentor': return Award;
      case 'peer': return Hand;
      default: return Users;
    }
  };

  const filteredGroups = supportGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <DashboardLayoutWithSidebar>
        <div className="p-6">
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-2">Join the Community</h2>
              <p className="text-gray-600 mb-6">Connect with others on their mental health journey</p>
              <Button onClick={() => navigate('/auth')}>Sign In to Continue</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayoutWithSidebar>
    );
  }

  return (
    <DashboardLayoutWithSidebar>
      <EnhancedCommunityHub />
    </DashboardLayoutWithSidebar>
  );


          {/* Community Feed */}
          <TabsContent value="feed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <CommunityPostCreator onPostCreated={() => {
                  // Refresh feed when post is created
                  toast({
                    title: "Post shared!",
                    description: "Your post has been shared with the community.",
                  });
                }} />

                {/* Posts */}
                <div className="space-y-4">
                  {communityPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold">{post.author.name}</span>
                                {post.author.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {post.author.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{post.timestamp}</span>
                                {post.group && (
                                  <>
                                    <span>•</span>
                                    <span className="text-therapy-600">{post.group}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{post.content}</p>
                        <div className="flex items-center space-x-1 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <PostInteractionButtons
                          postId={post.id}
                          initialLikes={post.likes}
                          initialComments={post.comments}
                          isLiked={post.isLiked}
                          onCommentClick={() => {
                            toast({
                              title: "Comments",
                              description: "Comments feature coming soon!",
                            });
                          }}
                          onLikeChange={(newCount, isLiked) => {
                            console.log(`Post ${post.id} now has ${newCount} likes, user liked: ${isLiked}`);
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Your Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myGroups.slice(0, 3).map((group) => (
                        <div key={group.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{group.name}</div>
                            <div className="text-xs text-gray-500">{group.current_members} members</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        View All Groups
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Online Peers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Online Now</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {peerConnections.filter(p => p.status === 'online').map((peer) => (
                        <div key={peer.id} className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(peer.status)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{peer.name}</div>
                            <div className="text-xs text-gray-500">{peer.compatibility}% compatible</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {communityEvents.slice(0, 2).map((event) => {
                        const EventIcon = getEventTypeIcon(event.type);
                        return (
                          <div key={event.id} className="p-3 border rounded-lg">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                                <EventIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-gray-500">{event.date} at {event.time}</div>
                                <div className="text-xs text-gray-500">{event.participants} participants</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <Button variant="outline" size="sm" className="w-full">
                        View All Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Support Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Support Groups</h2>
                <p className="text-gray-600">Find your community and connect with others who understand</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-therapy-600 hover:bg-therapy-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Support Group</DialogTitle>
                  </DialogHeader>
                  {/* Group creation form would go here */}
                  <div className="space-y-4">
                    <Input placeholder="Group name" />
                    <Textarea placeholder="Description" rows={3} />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportGroupCategories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="w-full">Create Group</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {supportGroupCategories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3`}>
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.count} groups</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search groups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {supportGroupCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {group.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {group.group_type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {group.current_members} / {group.max_members} members
                        </span>
                        <span className="text-green-600 font-medium">Active</span>
                      </div>
                      <Button className="w-full" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Community Events</h2>
                <p className="text-gray-600">Join live sessions, workshops, and local meetups</p>
              </div>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Event Types Filter */}
            <div className="flex gap-2 flex-wrap">
              {['All', 'Virtual', 'Local', 'Workshop', 'Group Therapy'].map((type) => (
                <Button key={type} variant="outline" size="sm">
                  {type}
                </Button>
              ))}
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityEvents.map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={getEventTypeColor(event.type)}>
                          <EventIcon className="h-3 w-3 mr-1" />
                          {event.type.replace('_', ' ')}
                        </Badge>
                        {event.isJoined && (
                          <Badge variant="secondary">Joined</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {event.duration} minutes
                        </div>
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {event.participants} / {event.maxParticipants} participants
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          className="w-full" 
                          variant={event.isJoined ? "outline" : "default"}
                        >
                          {event.isJoined ? 'Joined' : 'Join Event'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Peer Connections</h2>
                <p className="text-gray-600">Build meaningful relationships with your wellness community</p>
              </div>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Find Connections
              </Button>
            </div>

            {/* Connection Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Buddy System</h3>
                <p className="text-sm text-gray-600 mb-4">Get paired with someone on a similar journey for mutual support</p>
                <Button variant="outline" className="w-full">Find a Buddy</Button>
              </Card>
              
              <Card className="text-center p-6">
                <Award className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold mb-2">Mentorship</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with experienced community members for guidance</p>
                <Button variant="outline" className="w-full">Find a Mentor</Button>
              </Card>
              
              <Card className="text-center p-6">
                <Hand className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">Peer Support</h3>
                <p className="text-sm text-gray-600 mb-4">Connect with peers facing similar challenges</p>
                <Button variant="outline" className="w-full">Join Peer Network</Button>
              </Card>
            </div>

            {/* Your Connections */}
            <Card>
              <CardHeader>
                <CardTitle>Your Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {peerConnections.map((peer) => {
                    const ConnectionIcon = getConnectionTypeIcon(peer.connectionType);
                    return (
                      <Card key={peer.id} className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(peer.status)}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{peer.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{peer.connectionType}</div>
                          </div>
                          <ConnectionIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600">Compatibility: </span>
                            <span className="font-medium text-therapy-600">{peer.compatibility}%</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {peer.sharedGoals.slice(0, 2).map((goal) => (
                              <Badge key={goal} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                          <Button size="sm" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Wellness Activities</h2>
                <p className="text-gray-600">Join group activities designed to boost your mental wellness</p>
              </div>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                <Plus className="h-4 w-4 mr-2" />
                Suggest Activity
              </Button>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wellnessActivities.map((activity) => {
                const ActivityIcon = activity.icon;
                return (
                  <Card key={activity.name} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-therapy-100">
                          <ActivityIcon className="h-6 w-6 text-therapy-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{activity.name}</CardTitle>
                          <p className="text-sm text-gray-600">{activity.participants} participants</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          Next session: {activity.nextSession}
                        </div>
                        <Button className="w-full">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Join Activity
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Activity Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="font-medium text-gray-600 p-2">{day}</div>
                  ))}
                  {/* Calendar grid would be implemented here */}
                  {Array.from({ length: 35 }, (_, i) => (
                    <div key={i} className="p-2 border rounded text-xs hover:bg-gray-50">
                      {Math.floor(Math.random() * 3) + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Community Resources</h2>
                <p className="text-gray-600">Helpful tools, guides, and educational content from the community</p>
              </div>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                <Plus className="h-4 w-4 mr-2" />
                Share Resource
              </Button>
            </div>

            {/* Resource Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Self-Help Guides', icon: BookOpen, count: 45 },
                { name: 'Crisis Resources', icon: Shield, count: 12 },
                { name: 'Meditation Audio', icon: Mic, count: 78 },
                { name: 'Exercise Videos', icon: PlayCircle, count: 34 }
              ].map((resource) => {
                const ResourceIcon = resource.icon;
                return (
                  <Card key={resource.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 rounded-lg bg-therapy-100 flex items-center justify-center mx-auto mb-3">
                        <ResourceIcon className="h-6 w-6 text-therapy-600" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{resource.name}</h3>
                      <p className="text-xs text-gray-500">{resource.count} resources</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Featured Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Anxiety Management Toolkit",
                      author: "Community Contributors",
                      type: "Guide",
                      rating: 4.8,
                      downloads: 1234
                    },
                    {
                      title: "Guided Meditation: Inner Peace",
                      author: "Dr. Sarah Chen",
                      type: "Audio",
                      rating: 4.9,
                      downloads: 567
                    },
                    {
                      title: "Crisis Intervention Resources",
                      author: "TherapySync Team",
                      type: "Emergency",
                      rating: 5.0,
                      downloads: 890
                    }
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">By {resource.author} • {resource.type}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{resource.rating}</span>
                            <span>•</span>
                            <span>{resource.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
};
};

export default CommunityHub;
