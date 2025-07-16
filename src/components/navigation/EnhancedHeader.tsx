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
  CircuitBoard,
  Database,
  Code,
  Smartphone,
  Cloud,
  Lock,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Building,
  GraduationCap
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import CompactRegionalSelector from '@/components/regional/CompactRegionalSelector';
import EnhancedUserMenu from './EnhancedUserMenu';
import EnhancedNotificationCenter from '@/components/notifications/EnhancedNotificationCenter';
import EnhancedButton from '@/components/ui/EnhancedButton';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import MobileNavigation from './MobileNavigation';
import { useIsMobile, useScreenSize } from '@/hooks/useResponsive';

const EnhancedHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isTablet, isLaptop, isDesktop } = useScreenSize();

  // Therapy AI Features - Core AI capabilities and therapy approaches
  const therapyAiFeatures = [
    {
      icon: Brain,
      title: "TherapySync AI Core",
      description: "Advanced multi-model AI system powered by OpenAI and Anthropic with real-time insights",
      href: "/therapysync-ai",
      gradient: "from-purple-500 to-indigo-600",
      badge: "Core",
      category: "AI Technology"
    },
    {
      icon: MessageSquare,
      title: "AI Therapy Chat",
      description: "Personalized therapy conversations with evidence-based treatment approaches",
      href: "/therapy-sync-ai",
      gradient: "from-therapy-500 to-calm-500",
      badge: "Popular",
      category: "AI Technology"
    },
    {
      icon: Mic,
      title: "Voice AI Technology",
      description: "Natural voice conversations in 29 languages with emotion detection and analysis",
      href: "/voice-technology",
      gradient: "from-flow-500 to-balance-500",
      badge: "New",
      category: "AI Technology"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI trained to understand diverse backgrounds and contexts",
      href: "/cultural-ai-features",
      gradient: "from-balance-500 to-flow-500",
      category: "AI Technology"
    },
    {
      icon: Target,
      title: "AI Personalization",
      description: "Adaptive therapy approaches that learn and evolve with your unique needs",
      href: "/ai-personalization",
      gradient: "from-harmony-500 to-therapy-500",
      category: "AI Technology"
    },
    {
      icon: Brain,
      title: "Cognitive Behavioral Therapy (CBT)",
      description: "Evidence-based approach focusing on thought patterns and behavioral changes",
      href: "/therapy-approaches/cbt",
      gradient: "from-blue-500 to-cyan-500",
      category: "Therapy Approaches"
    },
    {
      icon: Heart,
      title: "Dialectical Behavior Therapy (DBT)",
      description: "Skills-based therapy for emotional regulation and interpersonal effectiveness",
      href: "/therapy-approaches/dbt", 
      gradient: "from-green-500 to-emerald-500",
      category: "Therapy Approaches"
    },
    {
      icon: Lightbulb,
      title: "Mindfulness-Based Therapy",
      description: "Present-moment awareness and acceptance-based therapeutic interventions",
      href: "/therapy-approaches/mindfulness",
      gradient: "from-purple-500 to-pink-500",
      category: "Therapy Approaches"
    },
    {
      icon: Shield,
      title: "Trauma-Focused Therapy",
      description: "Specialized approaches for processing and healing from traumatic experiences",
      href: "/therapy-approaches/trauma",
      gradient: "from-orange-500 to-red-500",
      category: "Therapy Approaches"
    },
    {
      icon: Zap,
      title: "Adaptive Systems",
      description: "AI that automatically updates therapy plans based on your progress and responses",
      href: "/adaptive-systems",
      gradient: "from-indigo-500 to-purple-500",
      badge: "Advanced",
      category: "AI Technology"
    }
  ];

  // Platform Features - Core therapy features and capabilities
  const platformFeatures = [
    {
      icon: Users,
      title: "AI Therapist Team",
      description: "Meet our 9 specialized AI therapists with unique approaches and 3D avatars",
      href: "/therapist-discovery", 
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Heart,
      title: "Mood & Progress Tracking",
      description: "Track your emotional journey with AI-powered insights and comprehensive analytics",
      href: "/mood-tracking",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Shield,
      title: "Crisis Support System",
      description: "24/7 crisis intervention with automated detection and emergency resources",
      href: "/crisis-support",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Users,
      title: "Family Account Sharing",
      description: "Comprehensive family mental health support with shared accounts and parental controls",
      href: "/family-features",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: UserPlus,
      title: "Community & Groups",
      description: "Connect with peers and join supportive communities for shared healing journeys",
      href: "/community-features",
      gradient: "from-flow-500 to-balance-500",
      badge: "Pro"
    },
    {
      icon: LinkIcon,
      title: "Integrations Hub",
      description: "Connect with your favorite health and wellness apps for seamless care coordination",
      href: "/integrations",
      gradient: "from-harmony-500 to-calm-500"
    }
  ];

  // Tools & Data - Analytics, APIs, and data management
  const toolsDataFeatures = [
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Advanced analytics with custom reporting, data visualization, and progress insights",
      href: "/analytics",
      gradient: "from-orange-500 to-red-500",
      badge: "Premium"
    },
    {
      icon: Code,
      title: "API Access",
      description: "Comprehensive REST API and webhooks for integration with your systems and workflows",
      href: "/api-docs",
      gradient: "from-blue-500 to-cyan-500",
      badge: "Pro"
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description: "Native iOS and Android apps with full feature parity and offline capabilities",
      href: "/mobile-apps",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: TrendingUp,
      title: "Progress Reports",
      description: "Detailed progress reports and insights for you, families, and healthcare providers",
      href: "/reports",
      gradient: "from-green-500 to-emerald-500",
      badge: "Premium"
    },
    {
      icon: FileSpreadsheet,
      title: "Data Export",
      description: "Export your therapy data in multiple formats for personal records or provider sharing",
      href: "/data-export",
      gradient: "from-purple-500 to-indigo-500",
      badge: "Pro"
    },
    {
      icon: LinkIcon,
      title: "Custom Integrations",
      description: "Build custom integrations with our SDK and connect to enterprise health systems",
      href: "/custom-integrations",
      gradient: "from-cyan-500 to-blue-500",
      badge: "Enterprise"
    }
  ];

  // Solutions - Different use cases and approaches
  const solutionsFeatures = [
    {
      icon: Users,
      title: "For Individuals",
      description: "Personal therapy journey with AI-powered insights and personalized treatment plans",
      href: "/solutions/individuals",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Heart,
      title: "For Families",
      description: "Family mental health support with shared accounts, parental controls, and family therapy",
      href: "/solutions/families",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: Stethoscope,
      title: "For Healthcare Providers",
      description: "Professional tools for therapists, clinicians, and healthcare organizations",
      href: "/solutions/providers",
      gradient: "from-balance-500 to-therapy-500"
    },
    {
      icon: Building,
      title: "For Organizations",
      description: "Employee mental health programs with analytics, compliance, and enterprise features",
      href: "/solutions/organizations",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Calculator,
      title: "Pricing Plans",
      description: "Flexible pricing for individuals, families, providers, and organizations",
      href: "/pricing",
      gradient: "from-therapy-500 to-calm-500"
    }
  ];

  // Resources - Help, support, and learning materials
  const resourcesFeatures = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Step-by-step guides to help you begin your therapy journey with confidence",
      href: "/getting-started",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Lightbulb,
      title: "How It Works",
      description: "Learn about our AI therapy technology and how it supports your mental health",
      href: "/how-it-works",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "HIPAA, GDPR compliance and enterprise-grade security standards for your peace of mind",
      href: "/security",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Phone,
      title: "Support Center",
      description: "24/7 customer support, technical help, and crisis assistance when you need it",
      href: "/support",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: GraduationCap,
      title: "Learning Hub",
      description: "Educational resources, therapy guides, and mental health best practices",
      href: "/learning",
      gradient: "from-flow-500 to-balance-500"
    },
  ];


  return (
    <SafeComponentWrapper name="EnhancedHeader">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Navigation */}
            <MobileNavigation
              therapyAiFeatures={therapyAiFeatures}
              platformFeatures={platformFeatures}
              toolsDataFeatures={toolsDataFeatures}
              solutionsFeatures={solutionsFeatures}
              resourcesFeatures={resourcesFeatures}
            />
            
            {/* Logo */}
            <Link
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <GradientLogo size="sm" />
            <span className="text-lg md:text-xl font-bold therapy-text-gradient">
                TherapySync
              </span>
            </Link>
          </div>

          {/* Navigation - Progressive disclosure based on screen size */}
          {!isMobile && (
            <nav className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-6 therapy-brand-override">
              
              {/* Compact features dropdown for tablet */}
              {isTablet && (
                <>
                  <div className="relative group">
                    <HeaderDropdownTrigger icon={Heart} label="Features" />
                    <HeaderDropdownCard className="dropdown-left w-64">
                      <div className="space-y-3">
                        {platformFeatures.slice(0, 3).map((feature) => (
                          <HeaderDropdownItem
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            href={feature.href}
                            gradient={feature.gradient}
                            compact={true}
                          />
                        ))}
                      </div>
                    </HeaderDropdownCard>
                  </div>
                  <Link 
                    to="/pricing" 
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-therapy-50 hover:text-therapy-700 transition-all duration-200"
                  >
                    <span>Pricing</span>
                  </Link>
                </>
              )}
              
              {/* Quick Access dropdown for laptop+ */}
              {isLaptop && (
                <>
                  <div className="relative group">
                    <HeaderDropdownTrigger icon={Sparkles} label="Quick Access" />
                    <HeaderDropdownCard className="dropdown-left w-80">
                      <div className="space-y-3">
                        <HeaderDropdownItem
                          icon={BookOpen}
                          title="Getting Started"
                          description="Step-by-step guides to begin your therapy journey"
                          href="/getting-started"
                          gradient="from-therapy-500 to-calm-500"
                          compact={true}
                        />
                        <HeaderDropdownItem
                          icon={Lightbulb}
                          title="How It Works"
                          description="Learn about our AI therapy technology"
                          href="/how-it-works"
                          gradient="from-calm-500 to-therapy-500"
                          compact={true}
                        />
                        <HeaderDropdownItem
                          icon={Phone}
                          title="Support Center"
                          description="24/7 customer support and crisis assistance"
                          href="/support"
                          gradient="from-harmony-500 to-balance-500"
                          compact={true}
                        />
                      </div>
                    </HeaderDropdownCard>
                  </div>
                  <Link 
                    to="/pricing" 
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-therapy-50 hover:text-therapy-700 transition-all duration-200"
                  >
                    <span>Pricing</span>
                  </Link>
                </>
              )}
              
              {/* Full dropdown navigation for desktop */}
              {isDesktop && (
                <>
            {/* Therapy AI Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Brain} label="Therapy AI" />
              <HeaderDropdownCard className="dropdown-left">
                <div className="space-y-6">
                  {/* AI Technology Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      AI Technology
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {therapyAiFeatures.filter(f => f.category === "AI Technology").map((feature) => (
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
                  </div>
                  
                  {/* Therapy Approaches Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      Therapy Approaches
                    </h3>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {therapyAiFeatures.filter(f => f.category === "Therapy Approaches").map((feature) => (
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
                  </div>
                </div>
              </HeaderDropdownCard>
            </div>

            {/* Features Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Settings} label="Features" />
              <HeaderDropdownCard>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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

            {/* Tools & Data Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Database} label="Tools & Data" />
              <HeaderDropdownCard>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {toolsDataFeatures.map((feature) => (
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

            {/* Solutions Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={Star} label="Solutions" />
              <HeaderDropdownCard>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {solutionsFeatures.map((feature) => (
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

            {/* Resources Dropdown */}
            <div className="relative group">
              <HeaderDropdownTrigger icon={BookOpen} label="Resources" />
              <HeaderDropdownCard className="dropdown-right">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {resourcesFeatures.map((feature) => (
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
                </>
              )}
            </nav>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Quick actions for larger screens */}
            {(isLaptop || isDesktop) && !user && (
              <div className="hidden lg:flex items-center space-x-3 mr-4">
              </div>
            )}
            
            <div className="hidden sm:block">
              <CompactRegionalSelector />
            </div>
            
            {user ? (
              <>
                <EnhancedNotificationCenter />
                <EnhancedUserMenu />
              </>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="hidden sm:inline-flex text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 text-sm px-3 py-2"
                >
                  Sign In
                </Button>
                <EnhancedButton 
                  onClick={() => navigate('/onboarding')}
                  className="px-3 py-2 text-sm bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
