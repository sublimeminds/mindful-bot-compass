
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Ticket, 
  FileText,
  BarChart3,
  Send
} from 'lucide-react';
import UserCommunicationCenter from './UserCommunicationCenter';
import UserConversationManager from './UserConversationManager';
import SupportTicketSystem from './SupportTicketSystem';
import CommunicationTemplates from './CommunicationTemplates';

const EnhancedUserCommunicationCenter = () => {
  const [stats] = useState({
    totalMessages: 1247,
    activeConversations: 23,
    openTickets: 15,
    templates: 12,
    responseRate: 94.2,
    avgResponseTime: '2.3h'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Communication Center</h1>
          <p className="text-gray-400">Comprehensive user communication and support management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                <p className="text-xs text-gray-400">Total Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.activeConversations}</p>
                <p className="text-xs text-gray-400">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Ticket className="h-4 w-4 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.openTickets}</p>
                <p className="text-xs text-gray-400">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.templates}</p>
                <p className="text-xs text-gray-400">Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.responseRate}%</p>
                <p className="text-xs text-gray-400">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.avgResponseTime}</p>
                <p className="text-xs text-gray-400">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Tabs */}
      <Tabs defaultValue="compose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="compose" className="data-[state=active]:bg-blue-600">
            <Send className="h-4 w-4 mr-2" />
            Compose & Send
          </TabsTrigger>
          <TabsTrigger value="conversations" className="data-[state=active]:bg-blue-600">
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-600">
            <Ticket className="h-4 w-4 mr-2" />
            Support Tickets
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <UserCommunicationCenter />
        </TabsContent>

        <TabsContent value="conversations">
          <UserConversationManager />
        </TabsContent>

        <TabsContent value="tickets">
          <SupportTicketSystem />
        </TabsContent>

        <TabsContent value="templates">
          <CommunicationTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedUserCommunicationCenter;
