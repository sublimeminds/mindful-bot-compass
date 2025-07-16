import React from 'react';
import { Calculator, Check, Star, Shield, Users, Building2 } from 'lucide-react';

const PricingPlans = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Calculator className="h-16 w-16 text-therapy-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing for individuals, families, providers, and organizations
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-4xl font-bold text-therapy-600">$29<span className="text-lg text-gray-500">/month</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">AI Therapy Chat</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Mood Tracking</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Progress Reports</span>
              </li>
            </ul>
            <button className="w-full bg-therapy-600 text-white py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Choose Plan
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-therapy-200 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-therapy-600 text-white px-3 py-1 rounded-full text-sm">Popular</span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-4xl font-bold text-therapy-600">$59<span className="text-lg text-gray-500">/month</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Everything in Basic</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Voice AI Technology</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Advanced Analytics</span>
              </li>
            </ul>
            <button className="w-full bg-therapy-600 text-white py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Choose Plan
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Family</h3>
              <p className="text-4xl font-bold text-therapy-600">$99<span className="text-lg text-gray-500">/month</span></p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Family Accounts</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Parental Controls</span>
              </li>
            </ul>
            <button className="w-full bg-therapy-600 text-white py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Choose Plan
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-therapy-600">Custom</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Everything in Family</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Custom Integrations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">24/7 Support</span>
              </li>
            </ul>
            <button className="w-full bg-therapy-600 text-white py-2 rounded-lg hover:bg-therapy-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6">
            Choose the plan that best fits your needs and start your therapy journey today
          </p>
          <button className="bg-white text-therapy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;