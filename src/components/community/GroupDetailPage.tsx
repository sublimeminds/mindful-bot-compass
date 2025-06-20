
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Settings, UserPlus, Globe, Lock, ShieldCheck, Calendar, FileText } from 'lucide-react';
import { CommunityService, SupportGroup, GroupDiscussion } from '@/services/communityService';
import { useToast } from '@/hooks/use-toast';
import CreateDiscussionDialog from './CreateDiscussionDialog';
import DiscussionCard from './DiscussionCard';
import EnhancedCreateDiscussionDialog from './EnhancedCreateDiscussionDialog';
import EnhancedDiscussionCard from './EnhancedDiscussionCard';
import GroupEventsTab from './GroupEventsTab';
import GroupResourcesTab from './GroupResourcesTab';

interface GroupDetailPageProps {
  group: SupportGroup;
  onBack: () => void;
  isJoined: boolean;
  onJoin: (groupId: string) => void;
}

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ 
  group, 
  onBack, 
  isJoined, 
  onJoin 
}) => {
  const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscussion, setSelectedDiscussion] = useState<GroupDiscussion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDiscussions();
  }, [group.id]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const discussionsData = await CommunityService.getGroupDiscussions(group.id);
      setDiscussions(discussionsData);
    } catch (error) {
      console.error('Error loading discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load group discussions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleViewDiscussion = (discussion: GroupDiscussion) => {
    setSelectedDiscussion(discussion);
  };

  if (selectedDiscussion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedDiscussion(null)}>
            ← Back to Discussions
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{selectedDiscussion.title}</CardTitle>
            <CardDescription>
              Discussion in {group.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{selectedDiscussion.content}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Community
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{group.name}</CardTitle>
                <Badge className={getGroupTypeColor()}>
                  <div className="flex items-center gap-1">
                    {getGroupTypeIcon()}
                    <span className="capitalize">{group.group_type}</span>
                  </div>
                </Badge>
              </div>
              <CardDescription className="text-base">
                {group.description}
              </CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{group.current_members}/{group.max_members} members</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {group.category}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {!isJoined ? (
                <Button 
                  onClick={() => onJoin(group.id)}
                  disabled={group.current_members >= group.max_members}
                  className="bg-therapy-600 hover:bg-therapy-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {group.current_members >= group.max_members ? 'Full' : 'Join Group'}
                </Button>
              ) : (
                <Badge variant="secondary" className="px-3 py-1">
                  Member
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="discussions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discussions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Group Discussions</h3>
            {isJoined && (
              <EnhancedCreateDiscussionDialog 
                groupId={group.id} 
                onDiscussionCreated={loadDiscussions}
              />
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading discussions...</p>
            </div>
          ) : discussions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                <p className="text-gray-600">
                  {isJoined 
                    ? 'Be the first to start a discussion in this group!' 
                    : 'Join the group to see and participate in discussions.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {discussions.map(discussion => (
                <EnhancedDiscussionCard 
                  key={discussion.id} 
                  discussion={discussion}
                  canInteract={isJoined}
                  canModerate={false}
                  onViewDiscussion={handleViewDiscussion}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events">
          <GroupEventsTab 
            groupId={group.id} 
            isJoined={isJoined}
            canModerate={false}
          />
        </TabsContent>

        <TabsContent value="resources">
          <GroupResourcesTab 
            groupId={group.id} 
            isJoined={isJoined}
            canModerate={false}
          />
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Members List</h3>
              <p className="text-gray-600">
                Member directory coming soon. Connect with other group members.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About {group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{group.description || 'No description provided.'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Group Guidelines</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Be respectful and supportive to all members</li>
                    <li>Share experiences, not advice unless asked</li>
                    <li>Maintain confidentiality of shared information</li>
                    <li>Report any concerning behavior to moderators</li>
                    <li>Focus on support and understanding</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Group Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {group.group_type}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {group.category}
                    </div>
                    <div>
                      <span className="font-medium">Members:</span> {group.current_members}/{group.max_members}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(group.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetailPage;
