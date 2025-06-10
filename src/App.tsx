
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
import TherapistMatching from "@/pages/TherapistMatching";
import { TherapistProvider } from './contexts/TherapistContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
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
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/register" element={<Navigate to="/auth" replace />} />
              </Routes>
              <Toaster />
            </SessionProvider>
          </TherapistProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
