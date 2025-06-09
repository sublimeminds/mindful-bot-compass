
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";
import { TherapistProvider } from "./contexts/TherapistContext";
import IntelligentNotificationProvider from "./components/IntelligentNotificationProvider";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import SessionHistory from "./pages/SessionHistory";
import Analytics from "./pages/Analytics";
import MoodTracking from "./pages/MoodTracking";
import Techniques from "./pages/Techniques";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionProvider>
        <TherapistProvider>
          <IntelligentNotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/sessions" element={<SessionHistory />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/mood" element={<MoodTracking />} />
                  <Route path="/techniques" element={<Techniques />} />
                  <Route path="/techniques/:techniqueId" element={<Techniques />} />
                  <Route path="/goals" element={<Goals />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </IntelligentNotificationProvider>
        </TherapistProvider>
      </SessionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
