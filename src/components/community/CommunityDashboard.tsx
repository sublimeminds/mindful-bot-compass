
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, MessageSquare, Search, Plus } from 'lucide-react';
import { CommunityService, SupportGroup, SharedMilestone } from '@/services/communityService';
import SupportGroupCard from './SupportGroupCard';
import { useToast } from '@/hooks/use-toast';

const CommunityDashboard: React.FC = () => {
  const [supportGroups, setSupportGroups] = useState<SupportGroup[]>([]);
  const [userGroups, setUserGroups] = useState<SupportGroup[]>([]);
  const [milestones, setMilestones] = useState<SharedMilestone[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      
      const [groupsData, milestonesData] = await Promise.all([
        CommunityService.getSupportGroups(),
        CommunityService.getPublicMilestones()
      ]);

      setSupportGroups(groupsData);
      setMilestones(milestonesData);

      // Load user's groups if authenticated
      // This would require auth context to get current user ID
    } catch (error) {
      console.error('Error loading community data:', error);
      toast({
        title: "Error",
        description: "Failed to load community data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const success = await CommunityService.joinGroup(groupId);
      if (success) {
        toast({
          title: "Success",
          description: "You've successfully joined the support group!"
        });
        loadCommunityData(); // Refresh data
      } else {
        throw new Error('Failed to join group');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the group. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCelebrateMilestone = async (milestoneId: string) => {
    try {
      const success = await CommunityService.celebrateMilestone(milestoneId);
      if (success) {
        toast({
          title: "Celebration sent!",
          description: "Your support has been shared with the community."
        });
        loadCommunityData(); // Refresh data
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to celebrate milestone. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredGroups = supportGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-600 mt-1">
            Connect with others on similar journeys and find support
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Groups</p>
                <p className="text-xl font-semibold">{supportGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Groups</p>
                <p className="text-xl font-semibold">{userGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recent Milestones</p>
                <p className="text-xl font-semibold">{milestones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="groups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="milestones">Community Milestones</TabsTrigger>
          <TabsTrigger value="connections">Peer Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search support groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map(group => (
              <SupportGroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                isJoined={userGroups.some(ug => ug.id === group.id)}
              />
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create a support group!'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="space-y-4">
            {milestones.map(milestone => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {milestone.milestone_type.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(milestone.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-medium mb-1">{milestone.title}</h3>
                      {milestone.description && (
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCelebrateMilestone(milestone.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{milestone.celebration_count}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {milestones.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
              <p className="text-gray-600">
                Community members haven't shared any milestones yet.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peer Connections</CardTitle>
              <CardDescription>
                Connect with others for mutual support and accountability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-600">
                  Peer connection features are being developed to help you find accountability partners and support buddies.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityDashboard;
