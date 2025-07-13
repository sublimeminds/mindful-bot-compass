import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Mail,
  Mic,
  Target,
  Zap,
  Settings,
  Lightbulb,
  Star,
  UserPlus,
  Activity,
  Stethoscope,
  Link as LinkIcon,
  LifeBuoy,
  CircuitBoard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import EnhancedLanguageSelector from '@/components/ui/EnhancedLanguageSelector';
import EnhancedUserMenu from './EnhancedUserMenu';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedButton from '@/components/ui/EnhancedButton';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';

const EnhancedHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const aiFeatures = [
    {
      icon: CircuitBoard,
      title: "TherapySync AI",
      description: "Discover our advanced multi-model AI system powered by OpenAI and Anthropic",
      href: "/therapysync-ai",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Brain,
      title: "AI Therapy Chat",
      description: "Advanced AI-powered therapy conversations with personalized treatment approaches",
      href: "/therapy-sync-ai",
      gradient: "from-therapy-500 to-calm-500",
      badge: "Popular"
    },
    {
      icon: Mic,
      title: "Voice AI Technology",
      description: "Natural voice conversations in 29 languages with emotion detection",
      href: "/voice-technology",
      gradient: "from-flow-500 to-balance-500",
      badge: "New"
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
      title: "AI Therapist Team",
      description: "Meet our 9 specialized AI therapists with unique approaches and 3D avatars",
      href: "/therapist-discovery", 
      gradient: "from-therapy-500 to-calm-500"
    },
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
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "HIPAA, GDPR compliance and enterprise-grade security standards",
      href: "/compliance",
      gradient: "from-therapy-600 to-harmony-600"
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
    <SafeComponentWrapper name="EnhancedHeader">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </Link>

          {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6 therapy-brand-override">
            {/* AI Features Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Brain} label="AI" />
              <HeaderDropdownCard title="AI Features" titleIcon={Brain} width="lg">
                <div className="grid grid-cols-2 gap-3">
                  {aiFeatures.map((feature) => (
                    <HeaderDropdownItem
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      href={feature.href}
                      gradient={feature.gradient}
                      badge={feature.badge}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>

            {/* Platform Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Settings} label="Platform" />
              <HeaderDropdownCard title="Platform Features" titleIcon={Settings} width="lg">
                <div className="grid grid-cols-2 gap-3">
                  {platformFeatures.map((feature) => (
                    <HeaderDropdownItem
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      href={feature.href}
                      gradient={feature.gradient}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>

            {/* Help Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={HelpCircle} label="Help" />
              <HeaderDropdownCard title="Help & Support" titleIcon={HelpCircle} width="md">
                <div className="grid grid-cols-2 gap-3">
                  {helpResources.map((resource) => (
                    <HeaderDropdownItem
                      key={resource.title}
                      icon={resource.icon}
                      title={resource.title}
                      description={resource.description}
                      href={resource.href}
                      gradient={resource.gradient}
                    />
                  ))}
                </div>
              </HeaderDropdownCard>
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <EnhancedLanguageSelector />
            
            {user ? (
              <>
                <EnhancedNotificationCenter />
                <EnhancedUserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
                >
                  Sign In
                </Button>
                <EnhancedButton 
                  onClick={() => navigate('/onboarding')}
                  className="px-6 py-2"
                >
                  Get Started
                </EnhancedButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </SafeComponentWrapper>
  );
};

export default EnhancedHeader;
