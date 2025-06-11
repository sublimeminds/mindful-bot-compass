
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import TherapyChat from './pages/TherapyChat';
import Onboarding from './pages/Onboarding';
import Goals from './pages/Goals';
import MoodTracking from './pages/MoodTracking';
import SessionHistory from './pages/SessionHistory';
import Techniques from './pages/Techniques';
import TherapistMatching from './pages/TherapistMatching';
import Profile from './pages/Profile';
import LiveSession from './pages/LiveSession';
import NotFound from './pages/NotFound';
import NotificationSettings from './pages/NotificationSettings';
import NotificationDashboard from './pages/NotificationDashboard';
import NotificationAnalytics from './pages/NotificationAnalytics';
import SmartTriggers from './pages/SmartTriggers';
import PerformanceDashboard from './pages/PerformanceDashboard';
import SessionAnalytics from "./pages/SessionAnalytics";

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminContent from './pages/AdminContent';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSystem from './pages/AdminSystem';
import AdminPerformance from './pages/AdminPerformance';

import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { SessionProvider } from './contexts/SessionContext';
import { TherapistProvider } from './contexts/TherapistContext';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Create QueryClient outside component to avoid recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <TherapistProvider>
                <SessionProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/therapy" element={<TherapyChat />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/mood-tracking" element={<MoodTracking />} />
                        <Route path="/session-history" element={<SessionHistory />} />
                        <Route path="/analytics" element={<SessionAnalytics />} />
                        <Route path="/techniques" element={<Techniques />} />
                        <Route path="/techniques/:techniqueId" element={<Techniques />} />
                        <Route path="/therapist-matching" element={<TherapistMatching />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/live-session/:sessionId" element={<LiveSession />} />
                        <Route path="/notification-settings" element={<NotificationSettings />} />
                        <Route path="/notification-dashboard" element={<NotificationDashboard />} />
                        <Route path="/notification-analytics" element={<NotificationAnalytics />} />
                        <Route path="/smart-triggers" element={<SmartTriggers />} />
                        <Route path="/performance" element={<PerformanceDashboard />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={
                          <AdminProtectedRoute>
                            <AdminLayout />
                          </AdminProtectedRoute>
                        }>
                          <Route index element={<AdminDashboard />} />
                          <Route path="users" element={
                            <AdminProtectedRoute requiredPermission={{ name: 'view_users', resource: 'users' }}>
                              <AdminUsers />
                            </AdminProtectedRoute>
                          } />
                          <Route path="content" element={
                            <AdminProtectedRoute requiredPermission={{ name: 'manage_content', resource: 'content' }}>
                              <AdminContent />
                            </AdminProtectedRoute>
                          } />
                          <Route path="analytics" element={
                            <AdminProtectedRoute requiredPermission={{ name: 'view_analytics', resource: 'analytics' }}>
                              <AdminAnalytics />
                            </AdminProtectedRoute>
                          } />
                          <Route path="system" element={
                            <AdminProtectedRoute requiredPermission={{ name: 'manage_system', resource: 'system' }}>
                              <AdminSystem />
                            </AdminProtectedRoute>
                          } />
                          <Route path="performance" element={
                            <AdminProtectedRoute requiredPermission={{ name: 'view_analytics', resource: 'analytics' }}>
                              <AdminPerformance />
                            </AdminProtectedRoute>
                          } />
                        </Route>
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                  <Toaster />
                </SessionProvider>
              </TherapistProvider>
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
