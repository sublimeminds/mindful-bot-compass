
import { Link } from "react-router-dom";
import GradientLogo from "@/components/ui/GradientLogo";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <GradientLogo 
                size="md"
                className="opacity-90"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-harmony-400 to-flow-400 bg-clip-text text-transparent">
                TherapySync
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              Sync your mind with AI-powered therapy support to help you heal, harmonize, and thrive. 
              Your mental health matters, and we're here to support your wellbeing journey.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-slate-300 hover:text-harmony-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-harmony-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">Crisis Resources</a></li>
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="text-slate-300 hover:text-harmony-400 transition-colors">Ethics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              © 2024 TherapySync. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">Made with</span>
              <GradientLogo 
                size="sm"
                className="opacity-60"
              />
              <span className="text-slate-400 text-sm">for mental wellness</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
