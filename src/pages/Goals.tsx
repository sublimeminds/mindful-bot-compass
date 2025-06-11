
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EnhancedGoalTracker from "@/components/goals/EnhancedGoalTracker";
import Header from "@/components/Header";

const Goals = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Target className="h-6 w-6 mr-2" />
                  Goals & Progress
                </h1>
                <p className="text-muted-foreground">
                  Set, track, and achieve your mental health goals
                </p>
              </div>
            </div>
          </div>

          {/* Goal Tracker */}
          <EnhancedGoalTracker />
        </div>
      </div>
    </>
  );
};

export default Goals;
