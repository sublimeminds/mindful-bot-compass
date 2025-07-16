import React from 'react';
import { GraduationCap, BookOpen, Play, FileText, Users, Award } from 'lucide-react';

const LearningHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Educational resources and training materials to enhance your therapy experience
          </p>
        </div>

        {/* Learning Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <BookOpen className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational Articles</h3>
            <p className="text-gray-600">
              In-depth articles about mental health topics and therapy techniques
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <Play className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Tutorials</h3>
            <p className="text-gray-600">
              Step-by-step video guides for using the platform effectively
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <FileText className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Worksheets</h3>
            <p className="text-gray-600">
              Downloadable worksheets for therapy exercises and self-reflection
            </p>
          </div>
        </div>

        {/* Featured Content */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Understanding CBT</h4>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of Cognitive Behavioral Therapy and how it can help you
              </p>
              <button className="text-therapy-600 font-semibold hover:text-therapy-700">
                Read More →
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Mindfulness Basics</h4>
              <p className="text-gray-600 mb-4">
                Discover mindfulness techniques to reduce stress and improve mental well-being
              </p>
              <button className="text-therapy-600 font-semibold hover:text-therapy-700">
                Read More →
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Expand Your Knowledge</h2>
          <p className="text-xl mb-6">
            Access comprehensive learning resources to enhance your therapy journey
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Browse Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;