
import React from 'react';

const Footer = () => {
  console.log('🔍 Footer: Component rendering');
  
  return (
    <footer className="w-full bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">TherapySync</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered mental health support designed to help you on your wellness journey.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground">Features</a></li>
              <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
              <li><a href="/security" className="hover:text-foreground">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
              <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 TherapySync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
