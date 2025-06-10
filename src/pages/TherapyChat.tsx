
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useTherapist } from "@/contexts/TherapistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TherapyChatInterface from "@/components/chat/TherapyChatInterface";
import SessionEndModal from "@/components/SessionEndModal";

const TherapyChat = () => {
  const [showEndModal, setShowEndModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    currentSession, 
    startSession, 
    endSession, 
    addBreakthrough 
  } = useSession();
  const { currentTherapist, isLoading: therapistLoading } = useTherapist();

  // Redirect if no therapist selected
  useEffect(() => {
    if (!therapistLoading && !currentTherapist) {
      toast({
        title: "Select a Therapist",
        description: "Please select an AI therapist before starting a session.",
        variant: "destructive",
      });
      navigate('/therapist-matching');
    }
  }, [therapistLoading, currentTherapist, navigate, toast]);

  const handleStartSession = async () => {
    if (!currentTherapist) {
      toast({
        title: "No Therapist Selected",
        description: "Please select a therapist first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await startSession(7); // Default mood before
      toast({
        title: "Session Started",
        description: `Your therapy session with ${currentTherapist.name} has begun.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const handleSessionEndSubmit = async (data: {
    moodAfter: number;
    notes: string;
    rating: number;
    breakthroughs: string[];
  }) => {
    if (!currentSession) return;

    try {
      // Add breakthroughs to session
      data.breakthroughs.forEach(breakthrough => {
        addBreakthrough(breakthrough);
      });

      await endSession(data.moodAfter, data.notes, data.rating);
      
      toast({
        title: "Session Completed",
        description: "Thank you for your feedback. Your progress has been saved.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (therapistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-therapy-600 mx-auto mb-4 animate-pulse" />
          <p className="text-therapy-600">Loading your therapist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-therapy-900">
                  AI Therapy Session
                </h1>
                {currentTherapist && (
                  <p className="text-therapy-600">
                    with {currentTherapist.name} • {currentTherapist.title}
                  </p>
                )}
              </div>
            </div>
            
            {currentSession ? (
              <Button 
                variant="outline" 
                onClick={handleEndSession}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                End Session
              </Button>
            ) : (
              <Button 
                onClick={handleStartSession}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                disabled={!currentTherapist}
              >
                Start Session
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentSession ? (
          <TherapyChatInterface onEndSession={handleEndSession} />
        ) : (
          <div className="text-center py-16">
            <Brain className="h-20 w-20 text-therapy-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-therapy-800 mb-4">
              Ready to Begin Your Therapy Session?
            </h2>
            <p className="text-therapy-600 mb-8 max-w-md mx-auto">
              Start a personalized AI therapy session with {currentTherapist?.name || 'your selected therapist'} 
              to explore your thoughts and feelings in a safe, supportive environment.
            </p>
            <Button 
              onClick={handleStartSession}
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
              disabled={!currentTherapist}
            >
              <Brain className="h-5 w-5 mr-2" />
              Start Therapy Session
            </Button>
          </div>
        )}
      </div>

      <SessionEndModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onSubmit={handleSessionEndSubmit}
      />
    </div>
  );
};

export default TherapyChat;
