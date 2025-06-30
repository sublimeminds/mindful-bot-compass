
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Brain, 
  Heart, 
  Users, 
  MessageSquare, 
  Headphones,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Shield,
  Globe,
  Calculator,
  Crown,
  Phone,
  FileText,
  Mail
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GradientButton from '@/components/ui/GradientButton';
import GradientLogo from '@/components/ui/GradientLogo';

const EnhancedHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const platformFeatures = [
    {
      icon: Brain,
      title: "AI Therapy Sessions",
      description: "Advanced AI-powered therapy conversations with personalized treatment approaches",
      href: "/therapy-chat",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Users,
      title: "Family Plans",
      description: "Comprehensive family mental health support with adaptive pricing and parental controls",
      href: "/family-dashboard",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your emotional journey with AI-powered insights and progress analytics",
      href: "/mood-tracking",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Headphones,
      title: "Voice Therapy",
      description: "Natural voice conversations in 29 languages with emotion detection technology",
      href: "/voice-technology",
      gradient: "from-flow-500 to-balance-500"
    },
    {
      icon: Shield,
      title: "Crisis Support",
      description: "24/7 crisis intervention with automated detection and emergency resources",
      href: "/crisis-support",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI trained to understand diverse backgrounds and contexts",
      href: "/cultural-ai-features",
      gradient: "from-balance-500 to-flow-500"
    }
  ];

  const helpResources = [
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions and quick answers",
      href: "/help",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support and crisis assistance",
      href: "/support",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete guides and documentation for all features",
      href: "/help",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Get in touch with our support team directly",
      href: "/support",
      gradient: "from-flow-500 to-balance-500"
    }
  ];

  const IconWrapper = ({ icon: Icon, gradient, isHovered }: { icon: any, gradient: string, isHovered: boolean }) => (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
      isHovered ? `bg-gradient-to-r ${gradient} shadow-lg scale-110` : 'bg-gray-100'
    }`}>
      <Icon className={`h-5 w-5 transition-all duration-300 ${
        isHovered ? 'text-white animate-pulse' : 'text-gray-600'
      }`} />
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Platform Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
                  <span>Platform</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 p-4 bg-white shadow-xl border-0">
                <DropdownMenuLabel className="text-lg font-semibold mb-4">Platform Features</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-3">
                  {platformFeatures.map((feature, index) => (
                    <Link
                      key={feature.title}
                      to={feature.href}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-all duration-200 group"
                      onMouseEnter={() => setHoveredIcon(feature.title)}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <IconWrapper 
                        icon={feature.icon} 
                        gradient={feature.gradient}
                        isHovered={hoveredIcon === feature.title}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 group-hover:text-therapy-700">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-tight">
                          {feature.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing */}
            <Link 
              to="/pricing" 
              className="text-gray-700 hover:text-therapy-600 font-medium transition-colors"
            >
              Pricing
            </Link>

            {/* Help Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
                  <span>Help</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4 bg-white shadow-xl border-0">
                <DropdownMenuLabel className="text-lg font-semibold mb-4">Help & Support</DropdownMenuLabel>
                <div className="space-y-2">
                  {helpResources.map((resource, index) => (
                    <Link
                      key={resource.title}
                      to={resource.href}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-all duration-200 group"
                      onMouseEnter={() => setHoveredIcon(resource.title)}
                      onMouseLeave={() => setHoveredIcon(null)}
                    >
                      <IconWrapper 
                        icon={resource.icon} 
                        gradient={resource.gradient}
                        isHovered={hoveredIcon === resource.title}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 group-hover:text-therapy-700">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-tight">
                          {resource.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                  className="hover:bg-therapy-50"
                >
                  Dashboard
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hover:bg-therapy-50"
                >
                  Sign In
                </Button>
                <GradientButton onClick={() => navigate('/auth')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started
                </GradientButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;
