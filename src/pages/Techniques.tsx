
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TechniqueLibrary from "@/components/techniques/TechniqueLibrary";
import GuidedTechnique from "@/components/techniques/GuidedTechnique";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Techniques = () => {
  const navigate = useNavigate();
  const { techniqueId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showLibrary, setShowLibrary] = useState(!techniqueId);

  const handleTechniqueComplete = async (
    rating: number, 
    notes: string, 
    moodBefore: number, 
    moodAfter: number
  ) => {
    if (!user) return;

    try {
      // In a real app, you would save this to Supabase
      console.log('Technique session completed:', {
        userId: user.id,
        techniqueId,
        rating,
        notes,
        moodBefore,
        moodAfter,
        completed: true,
        timestamp: new Date()
      });

      toast({
        title: "Great Job! 🎉",
        description: "Your technique session has been recorded successfully. Keep up the excellent work!",
      });

      setShowLibrary(true);
      navigate('/techniques');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExitTechnique = () => {
    setShowLibrary(true);
    navigate('/techniques');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')} className="hover:bg-therapy-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center text-therapy-700">
                  <BookOpen className="h-8 w-8 mr-3" />
                  Therapy Techniques
                </h1>
                <p className="text-muted-foreground text-lg">
                  {techniqueId && !showLibrary 
                    ? "Follow the guided technique to practice therapeutic exercises"
                    : "Interactive guided exercises to support your mental health journey"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {showLibrary ? (
            <TechniqueLibrary />
          ) : techniqueId ? (
            <GuidedTechnique
              techniqueId={techniqueId}
              onComplete={handleTechniqueComplete}
              onExit={handleExitTechnique}
            />
          ) : (
            <TechniqueLibrary />
          )}
        </div>
      </div>
    </>
  );
};

export default Techniques;
