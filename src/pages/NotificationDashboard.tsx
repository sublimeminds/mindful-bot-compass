
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '@/components/NotificationCenter';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const NotificationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Please sign in to view your notifications</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your mental health journey</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/notification-settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/notification-analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Notification Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Your Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <NotificationCenter />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Click the bell icon above to view all your notifications
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/notification-settings')}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Settings className="h-8 w-8 mx-auto text-blue-500" />
                <h3 className="font-medium">Notification Settings</h3>
                <p className="text-sm text-muted-foreground">Customize when and how you receive notifications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/notification-analytics')}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <BarChart3 className="h-8 w-8 mx-auto text-green-500" />
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-muted-foreground">View insights about your notification engagement</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/smart-triggers')}>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Bell className="h-8 w-8 mx-auto text-purple-500" />
                <h3 className="font-medium">Smart Triggers</h3>
                <p className="text-sm text-muted-foreground">Set up intelligent notification triggers</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NotificationDashboard;
