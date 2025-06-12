
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import Chat from '@/pages/Chat';
import TherapyChat from '@/pages/TherapyChat';
import LiveSession from '@/pages/LiveSession';
import MoodTracking from '@/pages/MoodTracking';
import Goals from '@/pages/Goals';
import Techniques from '@/pages/Techniques';
import SessionHistory from '@/pages/SessionHistory';
import Analytics from '@/pages/Analytics';
import SessionAnalytics from '@/pages/SessionAnalytics';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/AdminUsers';
import AdminContent from '@/pages/AdminContent';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminSystem from '@/pages/AdminSystem';
import AdminPerformance from '@/pages/AdminPerformance';
import NotFound from '@/pages/NotFound';
import TherapistMatching from '@/pages/TherapistMatching';
import PerformanceDashboard from '@/pages/PerformanceDashboard';
import NotificationDashboard from '@/pages/NotificationDashboard';
import NotificationSettings from '@/pages/NotificationSettings';
import NotificationAnalytics from '@/pages/NotificationAnalytics';
import SmartTriggers from '@/pages/SmartTriggers';
import AdminAI from '@/pages/AdminAI';

// Create a simple UserDashboard component since it's missing
const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Dashboard</h1>
        <p className="text-gray-600">Welcome to your therapy dashboard.</p>
      </div>
    </div>
  );
};

// Create AdminProtectedRoute component since it's missing
interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  // For now, just return the children - in a real app this would check admin permissions
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/therapist-matching" element={<TherapistMatching />} />

      {/* Protected user routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      } />
      <Route path="/therapy" element={
        <ProtectedRoute>
          <TherapyChat />
        </ProtectedRoute>
      } />
      <Route path="/live-session" element={
        <ProtectedRoute>
          <LiveSession />
        </ProtectedRoute>
      } />
      <Route path="/mood-tracking" element={
        <ProtectedRoute>
          <MoodTracking />
        </ProtectedRoute>
      } />
      <Route path="/goals" element={
        <ProtectedRoute>
          <Goals />
        </ProtectedRoute>
      } />
      <Route path="/techniques" element={
        <ProtectedRoute>
          <Techniques />
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
      <Route path="/session-analytics" element={
        <ProtectedRoute>
          <SessionAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/performance" element={
        <ProtectedRoute>
          <PerformanceDashboard />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <NotificationDashboard />
        </ProtectedRoute>
      } />
      <Route path="/notification-settings" element={
        <ProtectedRoute>
          <NotificationSettings />
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

      {/* Admin routes */}
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="performance" element={<AdminPerformance />} />
        <Route path="ai" element={<AdminAI />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
