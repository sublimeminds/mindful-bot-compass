
import React, { useState, useEffect } from 'react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import EnhancedCommunityHubCore from '@/components/community/EnhancedCommunityHubCore';
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

const CommunityHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <EnhancedCommunityHubCore />
    </DashboardLayoutWithSidebar>
  );
};

export default CommunityHub;
