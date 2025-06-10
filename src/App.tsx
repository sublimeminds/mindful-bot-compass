
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import { TherapistProvider } from './contexts/TherapistContext';
import { AdminProvider } from './contexts/AdminContext';
import NotificationToastHandler from './components/NotificationToastHandler';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracking';
import Goals from './pages/Goals';
import Notifications from './pages/NotificationSettings';
import Settings from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/dashboard/AdminOverview';
import AdminNotificationDebugPanel from './components/admin/system/AdminNotificationDebugPanel';
import AdminSystemManagement from './components/admin/system/AdminSystemManagement';
import AdminUserManagement from './components/admin/users/AdminUserManagement';
import AdminContentManagement from './components/admin/content/AdminContentManagement';
import AdminAnalyticsDashboard from './components/admin/analytics/AdminAnalyticsDashboard';
import TherapistMatching from "@/pages/TherapistMatching";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <TherapistProvider>
              <SessionProvider>
                <NotificationToastHandler />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Index />} />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } />
                  <Route path="/mood-tracker" element={
                    <ProtectedRoute>
                      <MoodTracker />
                    </ProtectedRoute>
                  } />
                  <Route path="/goals" element={
                    <ProtectedRoute>
                      <Goals />
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } />
                  <Route path="/therapist-matching" element={
                    <ProtectedRoute>
                      <TherapistMatching />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminLayout />
                    </AdminProtectedRoute>
                  }>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={
                      <AdminProtectedRoute requiredPermission={{ name: 'view_users', resource: 'users' }}>
                        <AdminUserManagement />
                      </AdminProtectedRoute>
                    } />
                    <Route path="content" element={
                      <AdminProtectedRoute requiredPermission={{ name: 'manage_content', resource: 'content' }}>
                        <AdminContentManagement />
                      </AdminProtectedRoute>
                    } />
                    <Route path="analytics" element={
                      <AdminProtectedRoute requiredPermission={{ name: 'view_analytics', resource: 'analytics' }}>
                        <AdminAnalyticsDashboard />
                      </AdminProtectedRoute>
                    } />
                    <Route path="system" element={
                      <AdminProtectedRoute requiredPermission={{ name: 'manage_system', resource: 'system' }}>
                        <AdminSystemManagement />
                      </AdminProtectedRoute>
                    } />
                    <Route path="system/debug" element={
                      <AdminProtectedRoute requiredPermission={{ name: 'manage_system', resource: 'system' }}>
                        <AdminNotificationDebugPanel />
                      </AdminProtectedRoute>
                    } />
                  </Route>
                  
                  <Route path="/login" element={<Navigate to="/auth" replace />} />
                  <Route path="/register" element={<Navigate to="/auth" replace />} />
                </Routes>
                <Toaster />
              </SessionProvider>
            </TherapistProvider>
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
