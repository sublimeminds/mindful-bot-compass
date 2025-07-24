import React from 'react';
import { Code, Book, Settings } from 'lucide-react';

const API = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-flow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-flow-500 to-flow-600 rounded-xl p-4">
              <Code className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Access
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Developer API for integrating TherapySync capabilities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Code className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">REST API</h3>
            <p className="text-gray-600">Comprehensive REST API for all TherapySync features</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Book className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Documentation</h3>
            <p className="text-gray-600">Complete API documentation with examples and SDKs</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Settings className="h-8 w-8 text-flow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Integration Tools</h3>
            <p className="text-gray-600">Easy integration tools and libraries for developers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default API;