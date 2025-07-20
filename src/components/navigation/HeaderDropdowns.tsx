
import React from 'react';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { 
  Brain, 
  Heart, 
  Users, 
  BarChart3, 
  Shield, 
  Calendar,
  MessageSquare,
  Target,
  Lightbulb,
  Sparkles,
  Globe,
  Zap,
  TrendingUp,
  Star,
  Eye,
  Lock,
  Archive,
  FileText,
  Compass,
  ThumbsUp
} from 'lucide-react';

// Comprehensive feature data for all dropdown categories
const therapyAiFeatures = [
  {
    icon: Brain,
    title: "Advanced AI Conversations",
    description: "Engage with our sophisticated AI trained in therapeutic techniques and evidence-based practices for meaningful mental health support.",
    href: "/therapy-session",
    gradient: "from-purple-500 to-indigo-600",
    badge: "Core"
  },
  {
    icon: Heart,
    title: "Personalized Therapy Plans",
    description: "Receive customized therapy approaches tailored to your unique needs, preferences, and mental health goals.",
    href: "/goals",
    gradient: "from-pink-500 to-rose-600",
    badge: "Popular"
  },
  {
    icon: Lightbulb,
    title: "Cognitive Behavioral Therapy",
    description: "Access CBT techniques and exercises designed to help identify and change negative thought patterns effectively.",
    href: "/therapy/cbt",
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    icon: Sparkles,
    title: "Mindfulness & Meditation",
    description: "Guided mindfulness exercises and meditation practices to reduce stress and improve emotional regulation.",
    href: "/therapy/mindfulness",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: Target,
    title: "Goal-Oriented Sessions",
    description: "Set and track therapeutic goals with structured sessions focused on achieving measurable progress.",
    href: "/goals",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    icon: Globe,
    title: "24/7 Crisis Support",
    description: "Access immediate support during mental health crises with specialized AI trained in crisis intervention.",
    href: "/crisis-support",
    gradient: "from-red-500 to-pink-600",
    badge: "Critical"
  }
];

const platformFeatures = [
  {
    icon: BarChart3,
    title: "Mood & Progress Tracking",
    description: "Monitor your emotional patterns and therapy progress with detailed analytics and insights over time.",
    href: "/mood-tracking",
    gradient: "from-blue-500 to-indigo-600",
    badge: "Popular"
  },
  {
    icon: Calendar,
    title: "Session Scheduling",
    description: "Schedule and manage your therapy sessions with flexible timing and automated reminders.",
    href: "/calendar",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    icon: Users,
    title: "Family & Couples Therapy",
    description: "Specialized AI modules for relationship counseling and family therapy sessions with multiple participants.",
    href: "/therapy/family",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "End-to-end encryption and HIPAA-compliant data protection ensuring your therapy sessions remain confidential.",
    href: "/privacy",
    gradient: "from-green-500 to-teal-600",
    badge: "Secure"
  },
  {
    icon: MessageSquare,
    title: "Multi-Modal Communication",
    description: "Communicate through text, voice, or video with AI that adapts to your preferred interaction style.",
    href: "/chat",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    icon: TrendingUp,
    title: "Progress Insights",
    description: "Receive detailed reports on your mental health journey with personalized recommendations for continued growth.",
    href: "/analytics",
    gradient: "from-indigo-500 to-purple-600"
  }
];

const toolsDataFeatures = [
  {
    icon: BarChart3,
    title: "Advanced Analytics Dashboard",
    description: "Comprehensive analytics suite with detailed insights into your therapy progress, mood patterns, and breakthrough moments.",
    href: "/analytics",
    gradient: "from-blue-500 to-indigo-600",
    badge: "Pro"
  },
  {
    icon: FileText,
    title: "Session Transcripts & Notes",
    description: "Access complete transcripts of your therapy sessions with AI-generated summaries and key takeaways.",
    href: "/sessions",
    gradient: "from-gray-500 to-slate-600"
  },
  {
    icon: Archive,
    title: "Data Export & Backup",
    description: "Export your therapy data in multiple formats and maintain secure backups of your mental health journey.",
    href: "/data-export",
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Connect with other health apps and wearables to provide holistic insights into your mental and physical wellbeing.",
    href: "/integrations",
    gradient: "from-yellow-500 to-orange-600",
    badge: "Developer"
  },
  {
    icon: Eye,
    title: "Real-time Monitoring",
    description: "Monitor your mental health status in real-time with AI-powered early warning systems for mood changes.",
    href: "/monitoring",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: Star,
    title: "Quality Assurance",
    description: "Continuous quality monitoring of AI responses with human oversight and regular model improvements.",
    href: "/quality",
    gradient: "from-amber-500 to-yellow-600"
  }
];

const solutionsFeatures = [
  {
    icon: Heart,
    title: "Individual Therapy",
    description: "Personalized one-on-one therapy sessions designed for your unique mental health needs and goals.",
    href: "/solutions/individual",
    gradient: "from-pink-500 to-rose-600",
    badge: "Most Popular"
  },
  {
    icon: Users,
    title: "Family & Couples",
    description: "Specialized therapy modules for relationship counseling, family dynamics, and couples communication.",
    href: "/solutions/family",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Shield,
    title: "Healthcare Providers",
    description: "Enterprise solutions for healthcare organizations to integrate AI therapy into their mental health services.",
    href: "/solutions/healthcare",
    gradient: "from-blue-500 to-indigo-600",
    badge: "Enterprise"
  },
  {
    icon: Building,
    title: "Corporate Wellness",
    description: "Workplace mental health programs with AI-powered therapy accessible to all employees.",
    href: "/solutions/corporate",
    gradient: "from-green-500 to-emerald-600",
    badge: "B2B"
  },
  {
    icon: GraduationCap,
    title: "Educational Institutions",
    description: "Mental health support systems designed specifically for students and educational environments.",
    href: "/solutions/education",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    icon: Globe,
    title: "Community Programs",
    description: "Large-scale community mental health initiatives powered by accessible AI therapy technology.",
    href: "/solutions/community",
    gradient: "from-teal-500 to-cyan-600"
  }
];

const resourcesFeatures = [
  {
    icon: Compass,
    title: "Getting Started Guide",
    description: "Comprehensive onboarding resources to help you begin your mental health journey with confidence.",
    href: "/getting-started",
    gradient: "from-blue-500 to-indigo-600",
    badge: "New User"
  },
  {
    icon: Lightbulb,
    title: "Mental Health Learning Hub",
    description: "Educational content, articles, and resources about mental health, therapy techniques, and self-care.",
    href: "/learning-hub",
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    icon: MessageSquare,
    title: "Community Support",
    description: "Connect with others on similar mental health journeys in our supportive, moderated community spaces.",
    href: "/community",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: ThumbsUp,
    title: "Success Stories",
    description: "Read inspiring stories from users who have transformed their mental health through AI-powered therapy.",
    href: "/success-stories",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    icon: Shield,
    title: "Privacy & Security Info",
    description: "Detailed information about our security measures, data protection, and commitment to your privacy.",
    href: "/security",
    gradient: "from-gray-600 to-slate-700"
  },
  {
    icon: FileText,
    title: "Help Center & FAQ",
    description: "Find answers to common questions and get technical support for using our therapy platform.",
    href: "/help",
    gradient: "from-cyan-500 to-blue-600"
  }
];

const HeaderDropdowns = () => {
  const { isDesktop, isLaptop, isTablet } = useEnhancedScreenSize();
  const isLargeScreen = isDesktop; // 1280px+
  const isMediumScreen = isLaptop; // 1024-1279px
  const isSmallScreen = isTablet; // 768-1023px

  // Render grid layout for large screens
  const renderGridLayout = (features: typeof therapyAiFeatures, title?: string) => (
    <div className="space-y-6">
      {title && (
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <HeaderDropdownItem
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            href={feature.href}
            gradient={feature.gradient}
            badge={feature.badge}
            compact={false}
          />
        ))}
      </div>
    </div>
  );

  // Render compact layout for medium/small screens
  const renderCompactLayout = (features: typeof therapyAiFeatures) => (
    <div className="space-y-3">
      {features.slice(0, 4).map((feature, index) => (
        <HeaderDropdownItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description.slice(0, 80) + "..."}
          href={feature.href}
          gradient={feature.gradient}
          badge={feature.badge}
          compact={true}
        />
      ))}
    </div>
  );

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {/* Therapy AI Dropdown */}
      <div className="relative group">
        <HeaderDropdownTrigger
          icon={Brain}
          label="Therapy AI"
        />
        <HeaderDropdownCard 
          width={isLargeScreen ? "xl" : "lg"}
          className="dropdown-left"
        >
          {isLargeScreen ? renderGridLayout(therapyAiFeatures) : renderCompactLayout(therapyAiFeatures)}
        </HeaderDropdownCard>
      </div>

      {/* Platform Dropdown */}
      <div className="relative group">
        <HeaderDropdownTrigger
          icon={Heart}
          label="Platform"
        />
        <HeaderDropdownCard 
          width={isLargeScreen ? "xl" : "lg"}
        >
          {isLargeScreen ? renderGridLayout(platformFeatures) : renderCompactLayout(platformFeatures)}
        </HeaderDropdownCard>
      </div>

      {/* Tools & Data Dropdown */}
      <div className="relative group">
        <HeaderDropdownTrigger
          icon={BarChart3}
          label="Tools & Data"
        />
        <HeaderDropdownCard 
          width={isLargeScreen ? "xl" : "lg"}
        >
          {isLargeScreen ? renderGridLayout(toolsDataFeatures) : renderCompactLayout(toolsDataFeatures)}
        </HeaderDropdownCard>
      </div>

      {/* Solutions Dropdown */}
      <div className="relative group">
        <HeaderDropdownTrigger
          icon={Users}
          label="Solutions"
        />
        <HeaderDropdownCard 
          width={isLargeScreen ? "xl" : "lg"}
        >
          {isLargeScreen ? renderGridLayout(solutionsFeatures) : renderCompactLayout(solutionsFeatures)}
        </HeaderDropdownCard>
      </div>

      {/* Resources Dropdown */}
      <div className="relative group">
        <HeaderDropdownTrigger
          icon={Compass}
          label="Resources"
        />
        <HeaderDropdownCard 
          width={isLargeScreen ? "xl" : "lg"}
          className="dropdown-right"
        >
          {isLargeScreen ? renderGridLayout(resourcesFeatures) : renderCompactLayout(resourcesFeatures)}
        </HeaderDropdownCard>
      </div>
    </nav>
  );
};

export default HeaderDropdowns;
