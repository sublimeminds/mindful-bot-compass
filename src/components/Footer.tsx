
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Globe, 
  Users, 
  Brain, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  HelpCircle, 
  Settings, 
  Calendar, 
  BookOpen, 
  Zap, 
  MessageCircle, 
  Star, 
  HeartHandshake,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const Footer = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const footerSections = [
    {
      id: 'product',
      title: 'Product',
      links: [
        { label: 'TherapySync AI', href: '/therapysync-ai', icon: Brain },
        { label: 'AI Therapy Chat', href: '/therapy', icon: MessageCircle },
        { label: 'Features', href: '/#features', icon: Sparkles },
        { label: 'Dashboard', href: '/dashboard', icon: Zap },
        { label: 'Smart Scheduling', href: '/smart-scheduling', icon: Calendar },
        { label: 'Techniques', href: '/techniques', icon: BookOpen },
      ]
    },
    {
      id: 'therapists',
      title: 'Therapists & Voices',
      links: [
        { label: 'AI Therapist Profiles', href: '/therapists', icon: Users },
        { label: 'Voice Technology', href: '/voice-features', icon: Sparkles },
        { label: 'Therapist Matching', href: '/therapist-matching', icon: HeartHandshake },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help', icon: HelpCircle },
        { label: 'Community', href: '/community', icon: Users },
        { label: 'Crisis Support', href: '/crisis-resources', icon: Shield },
        { label: 'Contact Us', href: '/contact', icon: Mail },
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about', icon: Users },
        { label: 'Pricing', href: '/plans', icon: Star },
        { label: 'Compare Plans', href: '/compare-plans', icon: FileText },
        { label: 'Privacy Policy', href: '/privacy', icon: Shield },
        { label: 'Terms of Service', href: '/terms', icon: FileText },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-therapy-700 to-harmony-700 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Collapsible Design */}
        <div className="block md:hidden space-y-4">
          {/* Brand Section - Always Visible on Mobile */}
          <div className="text-center pb-6 border-b border-white/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <GradientLogo size="sm" />
              <h3 className="text-lg font-bold">TherapySync</h3>
            </div>
            <p className="text-white/80 text-sm">
              AI-powered mental health platform with advanced voice technology.
            </p>
          </div>

          {/* Collapsible Sections */}
          {footerSections.map((section) => (
            <Collapsible key={section.id}>
              <CollapsibleTrigger 
                className="flex items-center justify-between w-full py-3 text-left font-medium hover:text-white/80"
                onClick={() => toggleSection(section.id)}
              >
                {section.title}
                {openSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pb-4">
                <div className="space-y-2 pl-4">
                  {section.links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="link" 
                      className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center w-full"
                      onClick={() => navigate(link.href)}
                    >
                      <link.icon className="h-3 w-3 mr-2" />
                      {link.label}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Desktop Design */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-3">
                <GradientLogo size="sm" />
                <h3 className="text-lg font-bold">TherapySync</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Advanced AI-powered mental health platform with enterprise-grade security.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-white/70" />
                  <span className="text-xs text-white/70">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-3 w-3 text-white/70" />
                  <span className="text-xs text-white/70">29 Languages</span>
                </div>
              </div>
            </div>
            
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.id} className="space-y-3">
                <h4 className="font-semibold text-white text-sm">{section.title}</h4>
                <div className="space-y-2">
                  {section.links.map((link, index) => (
                    <Button 
                      key={index}
                      variant="link" 
                      className="p-0 h-auto text-white/80 hover:text-white justify-start text-xs flex items-center"
                      onClick={() => navigate(link.href)}
                    >
                      <link.icon className="h-3 w-3 mr-2" />
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <p className="text-white/70 text-xs text-center md:text-left">
            © 2024 TherapySync. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-white/70 text-xs">Made with</span>
            <Heart className="h-3 w-3 text-white/80" />
            <span className="text-white/70 text-xs">for mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
