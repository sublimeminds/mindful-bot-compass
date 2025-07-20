
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
  Heart
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
    {
      icon: Brain,
      title: "TherapySync AI Core",
      description: "Advanced multi-model AI system powered by OpenAI and Anthropic with real-time insights",
      href: "/therapysync-ai",
      gradient: "from-purple-500 to-indigo-600",
      badge: "Core"
    },
    {
      icon: Users,
      title: "AI Therapy Chat",
      description: "Personalized therapy conversations with evidence-based treatment approaches",
      href: "/therapy-sync-ai",
      gradient: "from-therapy-500 to-calm-500",
      badge: "Popular"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive AI trained to understand diverse backgrounds and contexts",
      href: "/cultural-ai-features",
      gradient: "from-balance-500 to-flow-500"
    },
    {
      icon: Brain,
      title: "Cognitive Behavioral Therapy (CBT)",
      description: "Evidence-based approach focusing on thought patterns and behavioral changes",
      href: "/therapy-approaches/cbt",
      gradient: "from-blue-500 to-cyan-500"
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
      icon: Briefcase,
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
    }
  ];

  // Resources - Help, support, and learning materials
  const resourcesFeatures = [
    {
      icon: Brain,
      title: "Mental Health Guide",
      description: "Comprehensive guide to mental wellness and therapy approaches",
      href: "/resources/mental-health-guide",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar healing journeys",
      href: "/community",
      gradient: "from-harmony-500 to-balance-500"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "HIPAA, GDPR compliance and enterprise-grade security standards",
      href: "/security",
      gradient: "from-therapy-600 to-harmony-600"
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

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {/* Therapy AI Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Brain} 
              label="Therapy AI" 
              className="px-2 xl:px-3"
            />
            <HeaderDropdownCard width="xl" className="dropdown-left">
              <div className="grid grid-cols-2 gap-4">
                {therapyAiFeatures.map((feature) => (
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

          {/* Features Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Heart} 
              label="Features" 
              className="px-2 xl:px-3"
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
                  />
                ))}
              </div>
            </HeaderDropdownCard>
          </div>

          {/* Solutions Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Users} 
              label="Solutions" 
              className="px-2 xl:px-3"
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
              icon={Brain} 
              label="Resources" 
              className="px-2 xl:px-3"
            />
            <HeaderDropdownCard width="lg">
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

          {/* About Link */}
          <Link 
            to="/about" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            About
          </Link>

          {/* Pricing Link */}
          <Link 
            to="/pricing" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
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
              {therapyAiFeatures.map((feature) => (
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
