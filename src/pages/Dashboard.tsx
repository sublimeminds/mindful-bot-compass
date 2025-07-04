import React, { useEffect, useState } from 'react';
import SafeDashboardSidebar from '@/components/dashboard/SafeDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safe auth check without hooks
    const checkAuth = async () => {
      try {
        const session = localStorage.getItem('sb-dbwrbjmraodegffupnx-auth-token');
        if (!session) {
          window.location.href = '/auth';
          return;
        }
        setUser({ id: 'user' }); // Mock user for now
      } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/auth';
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-therapy-50 to-calm-50 w-full">
        <SafeDashboardSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold therapy-text-gradient mb-8">Welcome to your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Begin your mental wellness journey with AI-powered therapy sessions.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mood Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Track your emotional well-being with advanced analytics.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">View your therapy progress and achievements over time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;