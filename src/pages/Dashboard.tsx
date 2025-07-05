import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SafeDashboardSidebar from '@/components/dashboard/SafeDashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MessageCircle, TrendingUp, Target, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Proper auth check with Supabase
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (!session) {
          window.location.href = '/auth';
          return;
        }
        
        setUser(session.user);
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

  const quickActions = [
    {
      title: 'Start Therapy Session',
      description: 'Begin a new AI-powered therapy conversation',
      icon: MessageCircle,
      href: '/therapy-chat',
      color: 'from-therapy-500 to-therapy-600'
    },
    {
      title: 'Track Your Mood',
      description: 'Log your current emotional state',
      icon: TrendingUp,
      href: '/mood-tracker',
      color: 'from-calm-500 to-calm-600'
    },
    {
      title: 'View Goals',
      description: 'Check your mental health goals progress',
      icon: Target,
      href: '/goals',
      color: 'from-balance-500 to-balance-600'
    },
    {
      title: 'Schedule Session',
      description: 'Plan your next therapy appointment',
      icon: Calendar,
      href: '/sessions',
      color: 'from-harmony-500 to-harmony-600'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-therapy-50 to-calm-50 w-full">
        <SafeDashboardSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold therapy-text-gradient mb-2">
                Welcome back, {user.email?.split('@')[0] || 'there'}!
              </h1>
              <p className="text-slate-600">Ready to continue your mental wellness journey?</p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2">{action.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{action.description}</p>
                      <Button 
                        className={`w-full bg-gradient-to-r ${action.color} text-white border-0 hover:shadow-md transition-all`}
                        onClick={() => window.location.href = action.href}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-therapy-600">Recent Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-therapy-600 mb-2">7</div>
                    <p className="text-slate-600">Sessions completed this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-calm-600">Mood Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-calm-600 mb-2">8.2</div>
                    <p className="text-slate-600">Average mood score this week</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-balance-600">Goal Achievement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-balance-600 mb-2">75%</div>
                    <p className="text-slate-600">Goals completed this month</p>
                  </div>
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