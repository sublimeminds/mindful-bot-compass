
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                MindfulAI
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              Providing accessible, AI-powered therapy support to help you heal, grow, and thrive. 
              Your mental health matters, and we're here to support your journey.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-slate-300 hover:text-therapy-400 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-therapy-400 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">Crisis Resources</a></li>
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">Community</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="text-slate-300 hover:text-therapy-400 transition-colors">Ethics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              © 2024 MindfulAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-slate-400 text-sm">for mental wellness</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
