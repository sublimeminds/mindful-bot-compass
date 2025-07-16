import React from 'react';
import { FileText, Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TherapySync Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and updates from the world of AI-powered therapy
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-16">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4" />
            <span>December 15, 2024</span>
            <User className="h-4 w-4 ml-4" />
            <span>Dr. Sarah Johnson</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Future of AI in Mental Health: What to Expect in 2025
          </h2>
          <p className="text-gray-600 mb-6">
            Explore the latest developments in AI-powered therapy and how they're transforming mental healthcare accessibility and effectiveness.
          </p>
          <button className="bg-therapy-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-therapy-700 transition-colors">
            Read Full Article
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              <span>December 10, 2024</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              5 Benefits of Voice AI in Therapy
            </h3>
            <p className="text-gray-600 mb-4">
              Discover how voice AI technology is enhancing the therapeutic experience and improving outcomes.
            </p>
            <button className="text-therapy-600 font-semibold hover:text-therapy-700 flex items-center">
              Read More <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              <span>December 5, 2024</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Understanding Cultural AI in Therapy
            </h3>
            <p className="text-gray-600 mb-4">
              Learn how AI can be adapted to respect and understand diverse cultural backgrounds in therapy.
            </p>
            <button className="text-therapy-600 font-semibold hover:text-therapy-700 flex items-center">
              Read More <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
              <span>November 28, 2024</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Family Therapy in the Digital Age
            </h3>
            <p className="text-gray-600 mb-4">
              Explore how digital platforms are making family therapy more accessible and effective.
            </p>
            <button className="text-therapy-600 font-semibold hover:text-therapy-700 flex items-center">
              Read More <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-6">
            Subscribe to our newsletter for the latest insights and updates from TherapySync
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900 flex-1"
            />
            <button className="bg-white text-therapy-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;