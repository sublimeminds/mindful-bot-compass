import React from 'react';
import { Heart, BarChart3, Calendar, Target, TrendingUp, Clock } from 'lucide-react';

const MoodProgressTracking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mood & Progress Tracking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your emotional journey with AI-powered insights and comprehensive analytics
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <BarChart3 className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Analytics</h3>
            <p className="text-gray-600">
              Detailed insights into your mood patterns, triggers, and progress over time
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Calendar className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Mood Logging</h3>
            <p className="text-gray-600">
              Simple, intuitive mood tracking with customizable scales and categories
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Tracking</h3>
            <p className="text-gray-600">
              Set and monitor therapeutic goals with progress indicators and milestones
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <TrendingUp className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trend Analysis</h3>
            <p className="text-gray-600">
              Identify patterns and trends in your emotional well-being and therapeutic progress
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Clock className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Insights</h3>
            <p className="text-gray-600">
              Immediate feedback and insights based on your current emotional state
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Reports</h3>
            <p className="text-gray-600">
              Detailed reports for you and your healthcare providers to track progress
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Start Tracking Your Progress</h2>
          <p className="text-xl mb-6">
            Begin your journey of self-awareness and therapeutic growth
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Begin Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodProgressTracking;