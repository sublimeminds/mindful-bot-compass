import React from 'react';
import { safeNavigate, SafeNavigationButton } from '@/components/SafeNavigation';
import { Button } from '@/components/ui/button';
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
  LifeBuoy
} from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import LanguageSelector from '@/components/ui/LanguageSelector';
import PureDropdownMenu from './PureDropdownMenu';

// Context-independent header that doesn't use React hooks
const StableHeader = () => {
  // Use browser-native detection instead of React context
  const checkAuthState = () => {
    try {
      // Check localStorage for session without using Supabase hooks
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
      description: "Advanced AI-powered therapy conversations with personalized treatment approaches",
      href: "/therapy-chat",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Mic,
      title: "Voice AI Technology",
      description: "Natural voice conversations in 29 languages with emotion detection",
      href: "/voice-technology",
      gradient: "from-flow-500 to-balance-500"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI trained to understand diverse backgrounds and contexts",
      href: "/cultural-ai-features",
      gradient: "from-balance-500 to-flow-500"
    },
    {
      icon: Target,
      title: "AI Personalization",
      description: "Personalized therapy approaches adapted to your unique needs and preferences",
      href: "/features-overview",
      gradient: "from-harmony-500 to-therapy-500"
    },
    {
      icon: Lightbulb,
      title: "How It Works",
      description: "Discover how our AI therapy technology works and helps you heal",
      href: "/how-it-works",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Star,
      title: "Features Showcase",
      description: "Explore all the powerful features that make TherapySync unique",
      href: "/features-showcase",
      gradient: "from-calm-500 to-harmony-500"
    }
  ];

  const platformFeatures = [
    {
      icon: Users,
      title: "Family & Account Sharing",
      description: "Comprehensive family mental health support with account sharing and parental controls",
      href: "/family-features",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: Shield,
      title: "Crisis Support",
      description: "24/7 crisis intervention with automated detection and emergency resources",
      href: "/crisis-support",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your emotional journey with AI-powered insights and progress analytics",
      href: "/mood-tracking",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Calculator,
      title: "Pricing",
      description: "Flexible pricing plans designed for individuals, families, and organizations",
      href: "/pricing",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: UserPlus,
      title: "Community Features",
      description: "Connect with peers and join supportive communities for shared healing",
      href: "/community-features",
      gradient: "from-flow-500 to-balance-500"
    },
    {
      icon: Stethoscope,
      title: "Therapy Types",
      description: "Explore different therapeutic approaches including CBT, DBT, and mindfulness",
      href: "/therapy-types",
      gradient: "from-balance-500 to-therapy-500"
    },
    {
      icon: LinkIcon,
      title: "Integrations",
      description: "Connect with your favorite health and wellness apps for seamless care",
      href: "/integrations",
      gradient: "from-harmony-500 to-calm-500"
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
    },
    {
      icon: LifeBuoy,
      title: "Crisis Resources",
      description: "Emergency mental health resources and immediate crisis support",
      href: "/crisis-resources",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our supportive community and connect with others on similar journeys",
      href: "/community",
      gradient: "from-balance-500 to-calm-500"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <SafeNavigationButton href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </SafeNavigationButton>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <PureDropdownMenu
              trigger={{ icon: Brain, label: "AI" }}
              title="AI Features"
              items={aiFeatures}
              onItemClick={(href) => safeNavigate(href)}
            />
            
            <PureDropdownMenu
              trigger={{ icon: Settings, label: "Platform" }}
              title="Platform Features"
              items={platformFeatures}
              onItemClick={(href) => safeNavigate(href)}
            />
            
            <PureDropdownMenu
              trigger={{ icon: HelpCircle, label: "Help" }}
              title="Help & Support"
              items={helpResources}
              onItemClick={(href) => safeNavigate(href)}
            />
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
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

export default StableHeader;