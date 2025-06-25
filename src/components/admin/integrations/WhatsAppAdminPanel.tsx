import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Settings, Users, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WhatsAppAdminPanel = () => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadAdminData = useCallback(async () => {
    try {
      setLoading(true);
      // Mock admin data
      setAdminData({
        totalUsers: 1250,
        activeChats: 45,
        messagesProcessed: 15420,
        systemStatus: 'operational'
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
          WhatsApp Business Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : adminData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-green-400 mb-2">Total Users</h3>
                <p className="text-sm text-gray-300">{adminData.totalUsers}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-green-400 mb-2">Active Chats</h3>
                <p className="text-sm text-gray-300">{adminData.activeChats}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-green-400 mb-2">Messages Processed</h3>
                <p className="text-sm text-gray-300">{adminData.messagesProcessed}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-green-400 mb-2">System Status</h3>
                <div className="flex items-center space-x-2">
                  {adminData.systemStatus === 'operational' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <p className="text-sm text-gray-300">{adminData.systemStatus}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Configuration</h4>
              <p className="text-sm text-gray-400">Manage WhatsApp integration settings</p>
              <Button variant="outline" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No data available.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppAdminPanel;
