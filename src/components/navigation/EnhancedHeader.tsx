import React from 'react';
import { Button } from '@/components/ui/button';
import { safeNavigate } from '@/components/SafeNavigation';
import { 
  Brain, 
  Settings, 
  HelpCircle,
  User,
  Bell,
  Mic,
  Globe,
  Target,
  Lightbulb,
  Star,
  Users,
  Shield,
  Heart,
  Calculator,
  UserPlus,
  Stethoscope,
  Link as LinkIcon,
  Phone,
  FileText,
  Mail,
  LifeBuoy,
  ChevronDown
} from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import NativeLanguageSelector from '@/components/ui/NativeLanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EnhancedHeader = () => {
  // Context-independent auth check
  const checkAuthState = () => {
    try {
      const session = localStorage.getItem('sb-dbwrbjmraodegffupnx-auth-token');
      return !!session;
    } catch {
      return false;
    }
  };
  
  const hasAuth = checkAuthState();

  // Dropdown menu data
  const aiFeatures = [
    {
      icon: Brain,
      title: "AI Therapy Chat",
      description: "Advanced AI-powered therapy conversations",
      href: "/therapy-chat"
    },
    {
      icon: Mic,
      title: "Voice AI Technology", 
      description: "Natural voice conversations in 29 languages",
      href: "/voice-technology"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI support",
      href: "/cultural-ai-features"
    },
    {
      icon: Target,
      title: "AI Personalization",
      description: "Personalized therapy approaches",
      href: "/features-overview"
    },
    {
      icon: Lightbulb,
      title: "How It Works",
      description: "Discover how our AI therapy works",
      href: "/how-it-works"
    },
    {
      icon: Star,
      title: "Features Showcase",
      description: "Explore all our powerful features",
      href: "/features-showcase"
    }
  ];

  const platformFeatures = [
    {
      icon: Users,
      title: "Family & Account Sharing",
      description: "Family mental health support",
      href: "/family-features"
    },
    {
      icon: Shield,
      title: "Crisis Support",
      description: "24/7 crisis intervention",
      href: "/crisis-support"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "AI-powered mood insights",
      href: "/mood-tracking"
    },
    {
      icon: Calculator,
      title: "Pricing",
      description: "Flexible pricing plans",
      href: "/pricing"
    },
    {
      icon: UserPlus,
      title: "Community Features",
      description: "Connect with supportive communities",
      href: "/community-features"
    },
    {
      icon: Stethoscope,
      title: "Therapy Types",
      description: "CBT, DBT, and mindfulness approaches",
      href: "/therapy-types"
    },
    {
      icon: LinkIcon,
      title: "Integrations",
      description: "Connect with health apps",
      href: "/integrations"
    }
  ];

  const helpResources = [
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions",
      href: "/help"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock support",
      href: "/support"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete guides and docs",
      href: "/help"
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Get in touch with support",
      href: "/support"
    },
    {
      icon: LifeBuoy,
      title: "Crisis Resources",
      description: "Emergency mental health resources",
      href: "/crisis-resources"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our supportive community",
      href: "/community"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => safeNavigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                  <Brain className="h-4 w-4 mr-2" />
                  AI
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50">
                <DropdownMenuLabel className="text-lg font-semibold">AI Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {aiFeatures.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={index}
                      className="p-3 cursor-pointer hover:bg-therapy-50"
                      onClick={() => safeNavigate(item.href)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-r from-therapy-500 to-calm-500 p-2 rounded-lg">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50">
                <DropdownMenuLabel className="text-lg font-semibold">Platform Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {platformFeatures.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={index}
                      className="p-3 cursor-pointer hover:bg-therapy-50"
                      onClick={() => safeNavigate(item.href)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-r from-harmony-500 to-balance-500 p-2 rounded-lg">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-white border shadow-lg z-50">
                <DropdownMenuLabel className="text-lg font-semibold">Help & Support</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {helpResources.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={index}
                      className="p-3 cursor-pointer hover:bg-therapy-50"
                      onClick={() => safeNavigate(item.href)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="bg-gradient-to-r from-therapy-500 to-calm-500 p-2 rounded-lg">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <NativeLanguageSelector />
            
            {hasAuth ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => safeNavigate('/auth')}
                  className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => safeNavigate('/onboarding')}
                  className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white px-6 py-2"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnhancedHeader;