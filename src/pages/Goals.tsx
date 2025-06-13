
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EnhancedGoalTracker from "@/components/goals/EnhancedGoalTracker";
import Header from "@/components/Header";
import TreeLogo from "@/components/ui/TreeLogo";

const Goals = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Enhanced Header with Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-therapy-100/50 rounded-full flex items-center justify-center">
                  <TreeLogo 
                    size="md"
                    animated={true}
                    variant="breathing"
                    className="drop-shadow-sm"
                  />
                </div>
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
            
            {/* Motivational logo element */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Growing with</span>
              <TreeLogo 
                size="sm"
                animated={true}
                variant="hovering"
                className="opacity-70"
              />
              <span className="font-medium text-therapy-600">TherapySync</span>
            </div>
          </div>

          {/* Goal Tracker */}
          <EnhancedGoalTracker />
          
          {/* Footer encouragement with logo */}
          <div className="mt-12 text-center py-8 border-t border-therapy-200/30">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <TreeLogo 
                size="lg"
                animated={true}
                variant="celebration"
                className="drop-shadow-sm"
              />
            </div>
            <p className="text-therapy-700 font-medium text-lg">
              Every goal achieved is a step towards growth
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Your journey matters, and we're here to support your progress
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Goals;
