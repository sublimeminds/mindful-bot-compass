import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"

import Index from './pages/Index';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
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

// Admin Routes
import AdminLayout from './pages/admin/AdminLayout';
import AdminPerformance from './pages/admin/AdminPerformance';

import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import { NotificationProvider, IntelligentNotificationProvider } from './contexts/NotificationContext';
import { NotificationToastHandler, NotificationCenter } from './components/notifications/NotificationUI';
import { ScrollProgressIndicator } from './components/ui/scroll-progress-indicator';
import { AdminProtectedRoute } from './contexts/AdminContext';
import SessionAnalytics from "@/pages/SessionAnalytics";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  });

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <SessionProvider>
              <NotificationProvider>
                <IntelligentNotificationProvider>
                  <NotificationToastHandler />
                  <NotificationCenter />
                  <ScrollProgressIndicator />
                  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                    <div className="relative flex min-h-screen flex-col">
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/chat" element={
                            <ProtectedRoute>
                              <Chat />
                            </ProtectedRoute>
                          } />
                          <Route path="/onboarding" element={
                            <ProtectedRoute>
                              <Onboarding />
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
                          <Route path="/session-history" element={
                            <ProtectedRoute>
                              <SessionHistory />
                            </ProtectedRoute>
                          } />
                          <Route path="/analytics" element={
                            <ProtectedRoute>
                              <SessionAnalytics />
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
                          <Route path="/profile" element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } />
                          <Route path="/live-session/:sessionId" element={
                            <ProtectedRoute>
                              <LiveSession />
                            </ProtectedRoute>
                          } />
                          <Route path="/notification-settings" element={
                            <ProtectedRoute>
                              <NotificationSettings />
                            </ProtectedRoute>
                          } />
                          <Route path="/notification-dashboard" element={
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
                            <ProtectedRoute requiresAuth>
                              <AdminProtectedRoute>
                                <AdminLayout />
                              </AdminProtectedRoute>
                            </ProtectedRoute>
                          } />
                          <Route path="/admin/performance" element={
                            <ProtectedRoute requiresAuth>
                              <AdminProtectedRoute>
                                <AdminPerformance />
                              </AdminProtectedRoute>
                            </ProtectedRoute>
                          } />

                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                    <Toaster />
                  </ThemeProvider>
                </IntelligentNotificationProvider>
              </NotificationProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
