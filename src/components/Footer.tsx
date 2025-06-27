
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Globe, Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GradientLogo from '@/components/ui/GradientLogo';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-therapy-600 to-calm-600 rounded-2xl p-8 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Stay Connected to Your Wellness Journey</h3>
            <p className="text-therapy-100 mb-6">
              Get weekly mental health tips, guided exercises, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-therapy-600 hover:bg-therapy-50">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GradientLogo size="sm" />
              <span className="text-xl font-bold">TherapySync</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Transform your mental health journey with AI-powered therapy, personalized care, and 24/7 support.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white p-2">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/features" className="text-slate-300 hover:text-therapy-400 transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="text-slate-300 hover:text-therapy-400 transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="text-slate-300 hover:text-therapy-400 transition-colors">Pricing</Link></li>
              <li><Link to="/therapy-chat" className="text-slate-300 hover:text-therapy-400 transition-colors">TherapySync AI</Link></li>
              <li><Link to="/voice-technology" className="text-slate-300 hover:text-therapy-400 transition-colors">Voice Technology</Link></li>
              <li><Link to="/downloads" className="text-slate-300 hover:text-therapy-400 transition-colors">Downloads</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-slate-300 hover:text-therapy-400 transition-colors">Help Center</Link></li>
              <li><Link to="/crisis-resources" className="text-slate-300 hover:text-therapy-400 transition-colors">Crisis Support</Link></li>
              <li><Link to="/community" className="text-slate-300 hover:text-therapy-400 transition-colors">Community</Link></li>
              <li><Link to="/downloads" className="text-slate-300 hover:text-therapy-400 transition-colors">Mobile & Desktop Apps</Link></li>
              <li><Link to="/faq" className="text-slate-300 hover:text-therapy-400 transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-slate-300 hover:text-therapy-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Legal</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span>support@therapysync.com</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <Phone className="h-4 w-4" />
                <span>1-800-THERAPY</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-slate-300 hover:text-therapy-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-slate-300 hover:text-therapy-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-300 hover:text-therapy-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="text-slate-300 hover:text-therapy-400 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Evidence-Based Therapy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>24/7 Crisis Support</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2024 TherapySync, Inc. All rights reserved. Made with ❤️ for mental wellness.
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Status: All Systems Operational</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
