import React from 'react';
import { BarChart3, TrendingUp, Activity, Target, Brain, Calendar } from 'lucide-react';

const AnalyticsDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced analytics with custom reporting, data visualization, and progress insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <TrendingUp className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Trends</h3>
            <p className="text-gray-600">
              Track your therapy progress with detailed trend analysis
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Activity className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Activity Insights</h3>
            <p className="text-gray-600">
              Comprehensive insights into your therapy activities and engagement
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Target className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Tracking</h3>
            <p className="text-gray-600">
              Monitor progress toward your therapy goals with visual dashboards
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Unlock Advanced Analytics</h2>
          <p className="text-xl mb-6">
            Get deeper insights into your therapy journey with our premium analytics dashboard
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;