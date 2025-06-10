import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TherapyProvider } from './contexts/TherapyContext';
import { SessionProvider } from './contexts/SessionContext';
import { NotificationToastHandler } from './components/NotificationToastHandler';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import MoodTracker from './pages/MoodTracker';
import Goals from './pages/Goals';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import { ProtectedRoute } from './components/ProtectedRoute';
import TherapistMatching from "@/pages/TherapistMatching";
import { TherapistProvider } from './contexts/TherapistContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TherapyProvider>
          <AuthProvider>
            <TherapistProvider>
              <SessionProvider>
                <NotificationToastHandler />
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
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
                  <Route path="/login" element={<Navigate to="/" />} />
                  <Route path="/register" element={<Navigate to="/" />} />
                  <Route path="/therapist-matching" element={
                    <ProtectedRoute>
                      <TherapistMatching />
                    </ProtectedRoute>
                  } />
                </Routes>
              </SessionProvider>
            </TherapistProvider>
          </AuthProvider>
        </TherapyProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
