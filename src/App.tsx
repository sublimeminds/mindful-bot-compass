
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { TherapistProvider } from '@/contexts/TherapistContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { Toaster } from '@/components/ui/sonner';
import IntelligentNotificationProvider from '@/components/IntelligentNotificationProvider';
import NotificationToastHandler from '@/components/NotificationToastHandler';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Chat from '@/pages/Chat';
import LiveSession from '@/pages/LiveSession';
import SessionHistory from '@/pages/SessionHistory';
import Analytics from '@/pages/Analytics';
import Goals from '@/pages/Goals';
import MoodTracking from '@/pages/MoodTracking';
import Techniques from '@/pages/Techniques';
import TherapistMatching from '@/pages/TherapistMatching';
import Onboarding from '@/pages/Onboarding';
import NotificationSettings from '@/pages/NotificationSettings';
import NotificationDashboard from '@/pages/NotificationDashboard';
import NotificationAnalytics from '@/pages/NotificationAnalytics';
import SmartTriggers from '@/pages/SmartTriggers';
import PerformanceDashboard from '@/pages/PerformanceDashboard';
import AdminPerformance from '@/pages/AdminPerformance';
import NotFound from '@/pages/NotFound';

// Admin Components
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/dashboard/AdminOverview';
import AdminUserManagement from '@/components/admin/users/AdminUserManagement';
import AdminAnalyticsDashboard from '@/components/admin/analytics/AdminAnalyticsDashboard';
import AdminContentManagement from '@/components/admin/content/AdminContentManagement';
import AdminSystemManagement from '@/components/admin/system/AdminSystemManagement';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminProvider>
          <TherapistProvider>
            <SessionProvider>
              <IntelligentNotificationProvider>
                <Router>
                  <div className="min-h-screen bg-background flex flex-col">
                    <Header />
                    <main className="flex-1">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Protected Routes */}
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/chat" element={
                          <ProtectedRoute>
                            <Chat />
                          </ProtectedRoute>
                        } />
                        <Route path="/live-session" element={
                          <ProtectedRoute>
                            <LiveSession />
                          </ProtectedRoute>
                        } />
                        <Route path="/session-history" element={
                          <ProtectedRoute>
                            <SessionHistory />
                          </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                          <ProtectedRoute>
                            <Analytics />
                          </ProtectedRoute>
                        } />
                        <Route path="/goals" element={
                          <ProtectedRoute>
                            <Goals />
                          </ProtectedRoute>
                        } />
                        <Route path="/mood-tracking" element={
                          <ProtectedRoute>
                            <MoodTracking />
                          </ProtectedRoute>
                        } />
                        <Route path="/techniques" element={
                          <ProtectedRoute>
                            <Techniques />
                          </ProtectedRoute>
                        } />
                        <Route path="/therapist-matching" element={
                          <ProtectedRoute>
                            <TherapistMatching />
                          </ProtectedRoute>
                        } />
                        <Route path="/onboarding" element={
                          <ProtectedRoute>
                            <Onboarding />
                          </ProtectedRoute>
                        } />
                        <Route path="/notification-settings" element={
                          <ProtectedRoute>
                            <NotificationSettings />
                          </ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <NotificationDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/notification-analytics" element={
                          <ProtectedRoute>
                            <NotificationAnalytics />
                          </ProtectedRoute>
                        } />
                        <Route path="/smart-triggers" element={
                          <ProtectedRoute>
                            <SmartTriggers />
                          </ProtectedRoute>
                        } />
                        <Route path="/performance" element={
                          <ProtectedRoute>
                            <PerformanceDashboard />
                          </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin" element={
                          <AdminProtectedRoute>
                            <AdminLayout />
                          </AdminProtectedRoute>
                        }>
                          <Route index element={<AdminOverview />} />
                          <Route path="users" element={<AdminUserManagement />} />
                          <Route path="analytics" element={<AdminAnalyticsDashboard />} />
                          <Route path="content" element={<AdminContentManagement />} />
                          <Route path="system" element={<AdminSystemManagement />} />
                        </Route>
                        
                        <Route path="/admin/performance" element={
                          <AdminProtectedRoute>
                            <AdminPerformance />
                          </AdminProtectedRoute>
                        } />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <Toaster />
                  <NotificationToastHandler />
                </Router>
              </IntelligentNotificationProvider>
            </SessionProvider>
          </TherapistProvider>
        </AdminProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
