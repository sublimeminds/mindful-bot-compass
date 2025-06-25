
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MinimalDashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please sign in to access the dashboard.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-therapy-900">Dashboard</h1>
          <Button onClick={logout} variant="outline">
            Sign Out
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You're signed in as: {user.email}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimalDashboard;
