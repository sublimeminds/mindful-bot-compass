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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SessionProvider>
            <TherapistProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/mood" element={<MoodTracking />} />
                <Route path="/techniques" element={<Techniques />} />
                <Route path="/session-history" element={<SessionHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<NotificationAnalytics />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </TherapistProvider>
          </SessionProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
