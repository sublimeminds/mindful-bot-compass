
import React from 'react';

const Footer = () => {
  console.log('🔍 Footer: Component rendering - SHOULD BE VISIBLE AT BOTTOM');
  
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              TherapySync
            </h3>
            <p className="text-gray-600 mb-4">
              AI-powered mental health support designed to help you on your wellness journey.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#features" className="text-gray-600 hover:text-gray-900 text-sm">Features</a>
              </li>
              <li>
                <a href="/#pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</a>
              </li>
              <li>
                <a href="/security" className="text-gray-600 hover:text-gray-900 text-sm">Security</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-gray-900">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">Privacy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 TherapySync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
