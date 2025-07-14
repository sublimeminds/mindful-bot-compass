
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
};

export default CommunityHub;
