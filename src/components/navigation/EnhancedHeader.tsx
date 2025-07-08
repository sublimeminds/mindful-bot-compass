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

const EnhancedHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const aiFeatures = [
    {
      icon: CircuitBoard,
      title: "AI Architecture",
      description: "Discover our advanced multi-model AI system powered by ChatGPT and Anthropic",
      href: "/ai-architecture",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Brain,
      title: "AI Therapy Chat",
      description: "Advanced AI-powered therapy conversations with personalized treatment approaches",
      href: "/therapy-sync-ai",
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

  const IconWrapper = ({ icon: Icon, gradient, isHovered }: { icon: any, gradient: string, isHovered: boolean }) => (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform ${
      isHovered 
        ? `bg-gradient-to-r ${gradient} shadow-lg scale-110 animate-pulse` 
        : `bg-gradient-to-r ${gradient} opacity-70 hover:opacity-100`
    }`}>
      <Icon className={`h-5 w-5 transition-all duration-300 ${
        isHovered ? 'text-white scale-110' : 'text-white'
      }`} />
    </div>
  );

  return (
    <SafeComponentWrapper name="EnhancedHeader">
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
            {/* AI Features Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
                <Brain className="h-4 w-4 text-therapy-500" />
                <span>AI</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-0 w-[480px] p-4 bg-white shadow-xl border-0 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-lg font-semibold mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-therapy-500" />
                  AI Features
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {aiFeatures.map((feature, index) => (
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
              </div>
            </div>

            {/* Platform Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
                <Settings className="h-4 w-4 text-therapy-500" />
                <span>Platform</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-0 w-[480px] p-4 bg-white shadow-xl border-0 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-lg font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-therapy-500" />
                  Platform Features
                </div>
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
              </div>
            </div>

            {/* Help Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="flex items-center space-x-1 hover:bg-therapy-50">
                <HelpCircle className="h-4 w-4 text-therapy-500" />
                <span>Help</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-0 w-[480px] p-4 bg-white shadow-xl border-0 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-therapy-500" />
                  Help & Support
                </div>
                <div className="grid grid-cols-2 gap-3">
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
              </div>
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
