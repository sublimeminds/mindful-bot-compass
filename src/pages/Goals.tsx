
import React from 'react';
import { Target, Trophy, Sparkles } from "lucide-react";
import EnhancedGoalTracker from "@/components/goals/EnhancedGoalTracker";
import Header from "@/components/Header";

const Goals = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center text-therapy-700">
                  Goals & Progress
                </h1>
                <p className="text-muted-foreground text-lg">
                  Set, track, and achieve your mental health goals
                </p>
              </div>
            </div>
            
            {/* Motivational element */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Growing with</span>
              <Sparkles className="h-4 w-4 text-therapy-500" />
              <span className="font-medium text-therapy-600">TherapySync</span>
            </div>
          </div>

          {/* Goal Tracker */}
          <EnhancedGoalTracker />
          
          {/* Footer encouragement */}
          <div className="mt-12 text-center py-8 border-t border-therapy-200/30">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Trophy className="h-8 w-8 text-therapy-500" />
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
