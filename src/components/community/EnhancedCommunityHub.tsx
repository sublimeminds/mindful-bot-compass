import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { culturalAIService } from '@/services/culturalAiService';
import { 
  CulturalContentLibraryService, 
  CulturalSupportGroupService, 
  CulturalPeerMatchingService,
  FamilyIntegrationService 
} from '@/services/culturalEnhancedServices';
import { CommunityService } from '@/services/communityService';

interface CulturalCommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    culturalBackground?: string;
    badges: string[];
  };
  content: string;
  culturalContext?: string;
  translations?: { [language: string]: string };
  culturalRelevance: number;
  type: 'story' | 'milestone' | 'question' | 'celebration' | 'resource';
  timestamp: string;
  likes: number;
  comments: number;
  culturalEngagement: number;
  isLiked: boolean;
  tags: string[];
}

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  culturalOrigin: string;
  type: 'celebration' | 'workshop' | 'support_group' | 'storytelling';
  date: string;
  time: string;
  duration: number;
  facilitator: string;
  participants: number;
  maxParticipants: number;
  languages: string[];
  culturalSignificance: string;
  isJoined: boolean;
}

interface CulturalPeer {
  id: string;
  name: string;
  avatar?: string;
  culturalBackground: string;
  languages: string[];
  sharedInterests: string[];
  compatibilityScore: number;
  connectionType: 'cultural_buddy' | 'language_exchange' | 'family_support' | 'mentor';
  status: 'online' | 'offline' | 'in_session';
}

const EnhancedCommunityHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('feed');
  const [culturalPosts, setCulturalPosts] = useState<CulturalCommunityPost[]>([]);
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [culturalPeers, setCulturalPeers] = useState<CulturalPeer[]>([]);
  const [userCulturalContext, setUserCulturalContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [culturalFilter, setCulturalFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadCulturalCommunityData();
    }
  }, [user]);

  const loadCulturalCommunityData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load user's cultural context
      const culturalContext = await culturalAIService.getEnhancedCulturalContext(user.id);
      setUserCulturalContext(culturalContext);

      // Load culturally relevant content
      const [posts, events, peers] = await Promise.all([
        loadCulturalPosts(),
        loadCulturalEvents(),
        loadCulturalPeers()
      ]);

      setCulturalPosts(posts);
      setCulturalEvents(events);
      setCulturalPeers(peers);
    } catch (error) {
      console.error('Error loading cultural community data:', error);
      toast({
        title: "Error loading community",
        description: "Failed to load cultural community data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCulturalPosts = async (): Promise<CulturalCommunityPost[]> => {
    // Mock culturally enhanced posts
    return [
      {
        id: '1',
        author: {
          id: '1',
          name: 'Maria Santos',
          avatar: '',
          culturalBackground: 'Mexican',
          badges: ['Cultural Ambassador', 'Family Healer']
        },
        content: 'Today I shared my family\'s Day of the Dead traditions with my therapy group. It was beautiful to see how honoring our ancestors can be part of healing. ¡Día de los Muertos nos conecta con la sanación! 🌺',
        culturalContext: 'Mexican tradition of honoring ancestors for healing',
        translations: {
          'es': 'Hoy compartí las tradiciones del Día de los Muertos de mi familia con mi grupo de terapia...',
          'en': 'Today I shared my family\'s Day of the Dead traditions with my therapy group...'
        },
        culturalRelevance: 0.95,
        type: 'celebration',
        timestamp: '2 hours ago',
        likes: 34,
        comments: 12,
        culturalEngagement: 0.89,
        isLiked: false,
        tags: ['cultural_healing', 'family_traditions', 'día_de_muertos']
      },
      {
        id: '2',
        author: {
          id: '2',
          name: 'Kenji Tanaka',
          avatar: '',
          culturalBackground: 'Japanese',
          badges: ['Mindfulness Guide', 'Cultural Bridge']
        },
        content: 'The concept of "ikigai" has transformed my therapy journey. Finding my reason for being through cultural wisdom and modern psychology. Would love to share this practice with others interested in Japanese approaches to mental wellness.',
        culturalContext: 'Japanese philosophy of life purpose and wellbeing',
        culturalRelevance: 0.92,
        type: 'resource',
        timestamp: '4 hours ago',
        likes: 28,
        comments: 8,
        culturalEngagement: 0.85,
        isLiked: true,
        tags: ['ikigai', 'japanese_wisdom', 'life_purpose', 'mindfulness']
      },
      {
        id: '3',
        author: {
          id: '3',
          name: 'Amara Okafor',
          avatar: '',
          culturalBackground: 'Nigerian',
          badges: ['Ubuntu Practitioner', 'Community Elder']
        },
        content: 'Ubuntu philosophy: "I am because we are." This African wisdom guides my healing journey. In our culture, mental health is community health. Building support circles where everyone\'s wellbeing matters.',
        culturalContext: 'Ubuntu philosophy emphasizing interconnectedness',
        culturalRelevance: 0.94,
        type: 'story',
        timestamp: '6 hours ago',
        likes: 45,
        comments: 15,
        culturalEngagement: 0.91,
        isLiked: false,
        tags: ['ubuntu', 'african_wisdom', 'community_healing', 'interconnectedness']
      }
    ];
  };

  const loadCulturalEvents = async (): Promise<CulturalEvent[]> => {
    // Mock cultural events
    return [
      {
        id: '1',
        title: 'Circle of Stories: Indigenous Healing Traditions',
        description: 'Share and learn from indigenous healing practices through storytelling',
        culturalOrigin: 'Native American',
        type: 'storytelling',
        date: '2024-12-16',
        time: '19:00',
        duration: 90,
        facilitator: 'Elder Sarah Whitehorse',
        participants: 23,
        maxParticipants: 30,
        languages: ['English', 'Navajo'],
        culturalSignificance: 'Traditional healing through ancestral wisdom',
        isJoined: false
      },
      {
        id: '2',
        title: 'Lunar New Year Wellness Celebration',
        description: 'Community gathering to celebrate new beginnings and mental wellness',
        culturalOrigin: 'Chinese',
        type: 'celebration',
        date: '2024-12-18',
        time: '15:00',
        duration: 120,
        facilitator: 'Dr. Li Wei',
        participants: 67,
        maxParticipants: 100,
        languages: ['English', 'Mandarin', 'Cantonese'],
        culturalSignificance: 'Traditional renewal and family harmony practices',
        isJoined: true
      },
      {
        id: '3',
        title: 'Sufi Meditation & Poetry Workshop',
        description: 'Experience healing through mystical poetry and meditation',
        culturalOrigin: 'Persian/Sufi',
        type: 'workshop',
        date: '2024-12-17',
        time: '18:00',
        duration: 75,
        facilitator: 'Rumi Teacher Hassan Ali',
        participants: 15,
        maxParticipants: 25,
        languages: ['English', 'Farsi', 'Arabic'],
        culturalSignificance: 'Mystical poetry as pathway to inner peace',
        isJoined: false
      }
    ];
  };

  const loadCulturalPeers = async (): Promise<CulturalPeer[]> => {
    if (!user) return [];
    
    try {
      // Get cultural peer matches
      const matches = await CulturalPeerMatchingService.findCulturalPeers(user.id);
      
      // Convert to CulturalPeer format with mock data
      return [
        {
          id: '1',
          name: 'Priya Sharma',
          avatar: '',
          culturalBackground: 'Indian',
          languages: ['Hindi', 'English', 'Gujarati'],
          sharedInterests: ['Ayurveda', 'Family therapy', 'Meditation'],
          compatibilityScore: 0.94,
          connectionType: 'cultural_buddy',
          status: 'online'
        },
        {
          id: '2',
          name: 'Carlos Rodriguez',
          avatar: '',
          culturalBackground: 'Colombian',
          languages: ['Spanish', 'English'],
          sharedInterests: ['Family healing', 'Music therapy', 'Community support'],
          compatibilityScore: 0.88,
          connectionType: 'family_support',
          status: 'in_session'
        },
        {
          id: '3',
          name: 'Dr. Fatima Al-Zahra',
          avatar: '',
          culturalBackground: 'Lebanese',
          languages: ['Arabic', 'French', 'English'],
          sharedInterests: ['Islamic psychology', 'Interfaith dialogue', 'Trauma healing'],
          compatibilityScore: 0.91,
          connectionType: 'mentor',
          status: 'online'
        }
      ];
    } catch (error) {
      console.error('Error loading cultural peers:', error);
      return [];
    }
  };

  const getCulturalBadgeColor = (culturalBackground: string) => {
    const colors: { [key: string]: string } = {
      'Mexican': 'bg-red-100 text-red-800',
      'Japanese': 'bg-pink-100 text-pink-800',
      'Nigerian': 'bg-green-100 text-green-800',
      'Indian': 'bg-orange-100 text-orange-800',
      'Colombian': 'bg-yellow-100 text-yellow-800',
      'Lebanese': 'bg-purple-100 text-purple-800',
      'Default': 'bg-blue-100 text-blue-800'
    };
    return colors[culturalBackground] || colors['Default'];
  };

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'cultural_buddy': return Users;
      case 'language_exchange': return Languages;
      case 'family_support': return HandHeart;
      case 'mentor': return Award;
      default: return Users;
    }
  };

  const handleCulturalPostLike = async (postId: string) => {
    setCulturalPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleJoinCulturalEvent = async (eventId: string) => {
    setCulturalEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isJoined: !event.isJoined, participants: event.isJoined ? event.participants - 1 : event.participants + 1 }
        : event
    ));

    toast({
      title: "Event Updated",
      description: "Your event participation has been updated.",
    });
  };

  const handleConnectWithPeer = async (peerId: string) => {
    toast({
      title: "Connection Request Sent",
      description: "Your cultural peer connection request has been sent.",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Header with Cultural Context */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Globe className="h-8 w-8 mr-3 text-primary" />
              Cultural Community Hub
            </h1>
            <p className="text-muted-foreground mt-2">Connect across cultures, heal together</p>
            {userCulturalContext && (
              <div className="flex items-center gap-2 mt-3">
                <Badge className={getCulturalBadgeColor(userCulturalContext.culturalBackground)}>
                  {userCulturalContext.culturalBackground}
                </Badge>
                <Badge variant="outline">
                  {userCulturalContext.primaryLanguage}
                </Badge>
                <Badge variant="secondary">
                  Cultural Match Score: {Math.round((userCulturalContext.culturalAdaptationScore || 0.8) * 100)}%
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Cultural Insights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Cultural Backgrounds</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-muted-foreground">Cultural Satisfaction</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">234</div>
              <div className="text-sm text-muted-foreground">Cross-Cultural Connections</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-muted-foreground">Cultural Events This Week</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Enhanced Tabs with Cultural Features */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="feed">Cultural Feed</TabsTrigger>
          <TabsTrigger value="events">Cultural Events</TabsTrigger>
          <TabsTrigger value="peers">Cultural Peers</TabsTrigger>
          <TabsTrigger value="content">Cultural Content</TabsTrigger>
          <TabsTrigger value="family">Family Integration</TabsTrigger>
          <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
        </TabsList>

        {/* Cultural Feed */}
        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Cultural Posts */}
              <div className="space-y-4">
                {culturalPosts.map((post) => (
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
                              <Badge className={getCulturalBadgeColor(post.author.culturalBackground || '')}>
                                {post.author.culturalBackground}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{post.timestamp}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1" />
                                {Math.round(post.culturalRelevance * 100)}% Cultural Match
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{post.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{post.content}</p>
                      {post.culturalContext && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm">
                            <Lightbulb className="h-4 w-4 inline mr-2" />
                            Cultural Context: {post.culturalContext}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCulturalPostLike(post.id)}
                            className={post.isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {Math.round(post.culturalEngagement * 100)}% Engagement
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cultural Sidebar */}
            <div className="space-y-6">
              {/* Cultural Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Cultural Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Family Healing Circle</p>
                    <p className="text-xs text-muted-foreground">Based on your cultural preferences</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Mindfulness in Your Language</p>
                    <p className="text-xs text-muted-foreground">Content available in your native language</p>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Peer Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Suggested Cultural Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {culturalPeers.slice(0, 3).map((peer) => (
                    <div key={peer.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{peer.name}</p>
                          <p className="text-xs text-muted-foreground">{peer.culturalBackground}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Connect</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Cultural Events */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getCulturalBadgeColor(event.culturalOrigin)}>
                      {event.culturalOrigin}
                    </Badge>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.duration} minutes
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants}/{event.maxParticipants} participants
                    </div>
                    <div className="flex items-center">
                      <Languages className="h-4 w-4 mr-2" />
                      {event.languages.join(', ')}
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Cultural Significance:</p>
                    <p className="text-sm">{event.culturalSignificance}</p>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={event.isJoined ? "outline" : "default"}
                    onClick={() => handleJoinCulturalEvent(event.id)}
                  >
                    {event.isJoined ? 'Leave Event' : 'Join Event'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cultural Peers */}
        <TabsContent value="peers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalPeers.map((peer) => {
              const ConnectionIcon = getConnectionTypeIcon(peer.connectionType);
              return (
                <Card key={peer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>{peer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{peer.name}</span>
                          <div className={`h-2 w-2 rounded-full ${
                            peer.status === 'online' ? 'bg-green-500' : 
                            peer.status === 'in_session' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <Badge className={getCulturalBadgeColor(peer.culturalBackground)}>
                          {peer.culturalBackground}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {peer.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Shared Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {peer.sharedInterests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ConnectionIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">{peer.connectionType.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline">
                        {Math.round(peer.compatibilityScore * 100)}% Match
                      </Badge>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleConnectWithPeer(peer.id)}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Placeholder for other tabs */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Culturally adapted therapeutic content and resources coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Integration Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Family therapy integration and cultural decision-making support coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="celebrations">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Celebrations</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Cultural milestone celebrations and community events coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCommunityHub;