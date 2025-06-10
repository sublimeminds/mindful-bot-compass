import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";
import { TherapistProvider } from "./contexts/TherapistProvider";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import MoodTracking from "./pages/MoodTracking";
import Techniques from "./pages/Techniques";
import SessionHistory from "./pages/SessionHistory";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import NotificationAnalytics from "./pages/NotificationAnalytics";
import NotificationSettings from "./pages/NotificationSettings";
import LiveSession from "./pages/LiveSession";
import SmartTriggers from "./pages/SmartTriggers";
import IntelligentNotificationProvider from "./components/IntelligentNotificationProvider";
import NotificationToastHandler from "./components/NotificationToastHandler";
import IntelligentAssistant from "./components/ai/IntelligentAssistant";
import LiveSessionIndicator from "./components/LiveSessionIndicator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserDashboard from "./components/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationDashboard from "./pages/NotificationDashboard";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
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
          <Route path="/mood" element={
            <ProtectedRoute>
              <MoodTracking />
            </ProtectedRoute>
          } />
          <Route path="/techniques" element={
            <ProtectedRoute>
              <Techniques />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/session-history" element={
            <ProtectedRoute>
              <SessionHistory />
            </ProtectedRoute>
          } />
          <Route path="/smart-triggers" element={
            <ProtectedRoute>
              <SmartTriggers />
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
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
      
      {/* Show components only for authenticated users */}
      {isAuthenticated && (
        <>
          <IntelligentAssistant />
          <LiveSessionIndicator />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SessionProvider>
            <TherapistProvider>
              <IntelligentNotificationProvider>
                <NotificationToastHandler />
                <AppContent />
              </IntelligentNotificationProvider>
            </TherapistProvider>
          </SessionProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
