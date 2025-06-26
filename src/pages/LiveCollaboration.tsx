
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollaborativeWhiteboard from '@/components/collaboration/CollaborativeWhiteboard';
import LiveSessionManager from '@/components/collaboration/LiveSessionManager';
import RealTimeChat from '@/components/collaboration/RealTimeChat';
import { Users, Video, MessageSquare, Paintbrush } from 'lucide-react';

const LiveCollaboration = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Live Collaboration...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Live Collaboration</h1>
          <p className="text-gray-600 mt-2">
            Real-time collaboration tools for enhanced therapy sessions and interactive communication
          </p>
        </div>

        <Tabs defaultValue="session" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="session" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Live Session</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Real-time Chat</span>
            </TabsTrigger>
            <TabsTrigger value="whiteboard" className="flex items-center space-x-2">
              <Paintbrush className="h-4 w-4" />
              <span>Whiteboard</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Participants</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="session">
            <LiveSessionManager />
          </TabsContent>

          <TabsContent value="chat">
            <RealTimeChat />
          </TabsContent>

          <TabsContent value="whiteboard">
            <CollaborativeWhiteboard />
          </TabsContent>

          <TabsContent value="participants" className="space-y-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-therapy-600" />
              <h3 className="text-xl font-semibold mb-2">Participant Management</h3>
              <p className="text-muted-foreground">
                Advanced participant management and collaboration tools
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default LiveCollaboration;
