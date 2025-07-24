import React from 'react';
import { GraduationCap, BookOpen, Video } from 'lucide-react';

const Learn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-flow-500 to-flow-600 rounded-xl p-4">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Educational resources and mental health articles
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <BookOpen className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Articles & Guides</h3>
            <p className="text-gray-600">Comprehensive articles on mental health topics and techniques</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Video className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
            <p className="text-gray-600">Video content explaining therapeutic techniques and concepts</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <GraduationCap className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Courses</h3>
            <p className="text-gray-600">Self-paced courses on mental health and wellness topics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;