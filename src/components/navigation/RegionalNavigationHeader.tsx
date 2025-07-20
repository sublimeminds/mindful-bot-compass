
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Globe, 
  Users, 
  Brain, 
  Shield, 
  Briefcase, 
  GraduationCap,
  Menu,
  X,
  Heart,
  Settings,
  Database,
  Star,
  BookOpen,
  Mic,
  Target,
  Lightbulb,
  UserPlus,
  Stethoscope,
  Building,
  Calculator,
  BarChart3,
  Code,
  Smartphone,
  TrendingUp,
  FileSpreadsheet,
  LinkIcon,
  Phone,
  Sparkles
} from 'lucide-react';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import Logo from './Logo';

const RegionalNavigationHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  // Therapy AI Features - Core AI capabilities and therapy approaches
  const therapyAiFeatures = [
    // AI Technology
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
      icon: Users,
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
      description: "Natural voice conversations in 29 languages with emotion detection",
      href: "/voice-technology",
      gradient: "from-flow-500 to-balance-500",
      badge: "New",
      category: "AI Technology"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI trained to understand diverse backgrounds",
      href: "/cultural-ai-features",
      gradient: "from-balance-500 to-flow-500",
      category: "AI Technology"
    },
    {
      icon: Target,
      title: "AI Personalization",
      description: "Adaptive therapy approaches that learn and evolve with your needs",
      href: "/ai-personalization",
      gradient: "from-harmony-500 to-therapy-500",
      category: "AI Technology"
    },
    {
      icon: Sparkles,
      title: "Adaptive Systems",
      description: "AI that automatically updates therapy plans based on your progress",
      href: "/adaptive-systems",
      gradient: "from-indigo-500 to-purple-500",
      badge: "Advanced",
      category: "AI Technology"
    },
    // Therapy Approaches
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
      description: "Comprehensive REST API and webhooks for integration with your systems",
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
      description: "Export your therapy data in multiple formats for personal records",
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
      href: "/for-individuals",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Heart,
      title: "For Families",
      description: "Family mental health support with shared accounts, parental controls, and family therapy",
      href: "/family-features",
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
      href: "/for-organizations",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: GraduationCap,
      title: "For Schools",
      description: "Student mental health support and resources",
      href: "/for-schools",
      gradient: "from-flow-500 to-flow-600"
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
      description: "HIPAA, GDPR compliance and enterprise-grade security standards",
      href: "/security",
      gradient: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Phone,
      title: "Support Center",
      description: "24/7 customer support, technical help, and crisis assistance",
      href: "/support",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: GraduationCap,
      title: "Learning Hub",
      description: "Educational resources, therapy guides, and mental health best practices",
      href: "/learning",
      gradient: "from-flow-500 to-balance-500"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation - Large screens with full dropdowns */}
        <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
          {/* Therapy AI Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Brain} 
              label="Therapy AI" 
              className="px-2 2xl:px-3"
            />
            <HeaderDropdownCard width="xl" className="dropdown-left">
              <div className="space-y-6">
                {/* AI Technology Section */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                    AI Technology
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
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
                  <div className="grid grid-cols-2 gap-3">
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
            <HeaderDropdownTrigger 
              icon={Settings} 
              label="Features" 
              className="px-2 2xl:px-3"
            />
            <HeaderDropdownCard width="xl">
              <div className="grid grid-cols-2 gap-4">
                {platformFeatures.map((feature) => (
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

          {/* Tools & Data Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Database} 
              label="Tools & Data" 
              className="px-2 2xl:px-3"
            />
            <HeaderDropdownCard width="xl">
              <div className="grid grid-cols-2 gap-4">
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
            <HeaderDropdownTrigger 
              icon={Star} 
              label="Solutions" 
              className="px-2 2xl:px-3"
            />
            <HeaderDropdownCard width="lg">
              <div className="grid grid-cols-2 gap-3">
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
            <HeaderDropdownTrigger 
              icon={BookOpen} 
              label="Resources" 
              className="px-2 2xl:px-3"
            />
            <HeaderDropdownCard width="lg" className="dropdown-right">
              <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Medium Screen Navigation - MacBook Air, tablets with compact dropdowns */}
        <div className="hidden lg:flex xl:hidden items-center space-x-1">
          {/* Therapy AI Compact */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Brain} 
              label="Therapy AI" 
              className="px-2"
            />
            <HeaderDropdownCard width="md" className="dropdown-left">
              <div className="space-y-2">
                {therapyAiFeatures.slice(0, 4).map((feature) => (
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

          {/* Features Compact */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Settings} 
              label="Features" 
              className="px-2"
            />
            <HeaderDropdownCard width="md">
              <div className="space-y-2">
                {platformFeatures.slice(0, 4).map((feature) => (
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

          {/* Solutions Compact */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Star} 
              label="Solutions" 
              className="px-2"
            />
            <HeaderDropdownCard width="sm">
              <div className="space-y-2">
                {solutionsFeatures.slice(0, 3).map((feature) => (
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

          {/* About & Pricing Links */}
          <Link 
            to="/about" 
            className="px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link 
            to="/pricing" 
            className="px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
          {user ? (
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="sm"
              className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white px-3 lg:px-4"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')} 
                size="sm"
                className="text-sm px-3 lg:px-4"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/get-started')} 
                size="sm"
                className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white text-sm px-3 lg:px-4"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Mobile Therapy AI */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Therapy AI</h3>
              {therapyAiFeatures.slice(0, 6).map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Features */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Features</h3>
              {platformFeatures.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Tools & Data */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Tools & Data</h3>
              {toolsDataFeatures.slice(0, 4).map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Solutions */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Solutions</h3>
              {solutionsFeatures.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Resources */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Resources</h3>
              {resourcesFeatures.map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <feature.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Links */}
            <div className="space-y-1 pt-2 border-t border-border/40">
              <Link
                to="/about"
                className="block py-2 px-3 text-sm font-medium hover:bg-therapy-50/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="block py-2 px-3 text-sm font-medium hover:bg-therapy-50/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-border/40">
              {user ? (
                <Button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="w-full bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/get-started');
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default RegionalNavigationHeader;
