import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Calendar, Target, TrendingUp, MessageCircle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BillingOverview from '@/components/dashboard/BillingOverview';
import UsageAnalytics from '@/components/dashboard/UsageAnalytics';
import PaymentNotifications from '@/components/notifications/PaymentNotifications';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [activeGoals, setActiveGoals] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecentSessions();
      fetchActiveGoals();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchRecentSessions = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('therapy_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(3);

    setRecentSessions(data || []);
  };

  const fetchActiveGoals = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setActiveGoals(data || []);
  };

  const quickActions = [
    {
      title: 'Start Therapy Session',
      description: 'Begin a new therapy session with AI',
      icon: <Brain className="h-6 w-6" />,
      action: () => navigate('/therapy'),
      color: 'bg-therapy-500 hover:bg-therapy-600',
    },
    {
      title: 'Find Therapist',
      description: 'Discover therapists that match your needs',
      icon: <MessageCircle className="h-6 w-6" />,
      action: () => navigate('/therapist-discovery'),
      color: 'bg-primary hover:bg-primary/90',
    },
    {
      title: 'Set Goals',
      description: 'Create and track your therapy goals',
      icon: <Target className="h-6 w-6" />,
      action: () => navigate('/goals'),
      color: 'bg-secondary hover:bg-secondary/90',
    },
    {
      title: 'View Progress',
      description: 'Track your therapy journey',
      icon: <TrendingUp className="h-6 w-6" />,
      action: () => navigate('/analytics'),
      color: 'bg-calm-500 hover:bg-calm-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-therapy-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your therapy journey and account status.
          </p>
        </div>

        {/* Payment Notifications */}
        <div className="mb-6">
          <PaymentNotifications />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentSessions.length > 0 ? (
                    <div className="space-y-3">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">
                              {session.session_type || 'Therapy Session'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.start_time).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {session.duration_minutes ? `${session.duration_minutes}m` : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent sessions</p>
                      <Button className="mt-2" onClick={() => navigate('/therapy')}>
                        Start Your First Session
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Active Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeGoals.length > 0 ? (
                    <div className="space-y-3">
                      {activeGoals.map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{goal.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {goal.target_date ? `Due: ${new Date(goal.target_date).toLocaleDateString()}` : 'No due date'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {goal.progress_percentage || 0}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active goals</p>
                      <Button className="mt-2" onClick={() => navigate('/goals')}>
                        Set Your First Goal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            {user && <BillingOverview userId={user.id} />}
          </TabsContent>

          <TabsContent value="analytics">
            <UsageAnalytics />
          </TabsContent>
        </Tabs>

        {/* Quick Settings Access */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Account & Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account, billing, notifications, and privacy settings
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Open Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;