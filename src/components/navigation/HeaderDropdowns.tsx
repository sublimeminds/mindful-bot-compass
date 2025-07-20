
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useEnhancedScreenSize } from '@/hooks/useEnhancedScreenSize';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import {
  Brain,
  Heart,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Target,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Settings,
  HelpCircle,
  FileText,
  Compass,
  ThumbsUp,
  Building,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Star,
  Eye,
  Lock,
  Archive
} from 'lucide-react';

// Original menu structure from EnhancedHeader.tsx
const therapyAIFeatures = [
  {
    icon: Brain,
    title: "AI Therapy Sessions",
    description: "One-on-one conversations with specialized AI therapists",
    href: "/dashboard",
    gradient: "from-blue-500 to-purple-600",
    badge: "Popular"
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Daily emotional check-ins with intelligent insights",
    href: "/dashboard/mood",
    gradient: "from-pink-500 to-red-500"
  },
  {
    icon: Users,
    title: "Group Therapy",
    description: "Connect with others in guided AI-facilitated sessions",
    href: "/community",
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: MessageSquare,
    title: "Crisis Support",
    description: "24/7 immediate help when you need it most",
    href: "/crisis-management",
    gradient: "from-red-500 to-orange-500",
    badge: "24/7"
  },
  {
    icon: BookOpen,
    title: "Therapeutic Techniques",
    description: "Learn CBT, DBT, and mindfulness practices",
    href: "/dashboard/techniques",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-optimized therapy session timing",
    href: "/smart-scheduling",
    gradient: "from-cyan-500 to-blue-500"
  }
];

const platformFeatures = [
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set and track your mental health goals",
    href: "/dashboard/goals",
    gradient: "from-emerald-500 to-green-600"
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visualize your mental health journey",
    href: "/dashboard/analytics",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "End-to-end encrypted conversations",
    href: "/privacy",
    gradient: "from-gray-500 to-slate-600"
  },
  {
    icon: Zap,
    title: "Quick Check-ins",
    description: "Fast mood and wellness assessments",
    href: "/dashboard/check-in",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Therapy in your preferred language",
    href: "/dashboard/settings",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Settings,
    title: "Personalization",
    description: "Customize your therapy experience",
    href: "/dashboard/settings",
    gradient: "from-teal-500 to-cyan-500"
  }
];

const toolsDataFeatures = [
  {
    icon: FileText,
    title: "Journal Insights",
    description: "AI-powered analysis of your thoughts",
    href: "/notebook",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: BarChart3,
    title: "Wellness Reports",
    description: "Comprehensive mental health summaries",
    href: "/dashboard/reports",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Brain,
    title: "Cognitive Assessments",
    description: "Track cognitive patterns and improvements",
    href: "/dashboard/assessments",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Long-term mental health trend tracking",
    href: "/dashboard/trends",
    gradient: "from-blue-500 to-cyan-500"
  }
];

const solutionsFeatures = [
  {
    icon: Building,
    title: "For Organizations",
    description: "Employee mental health and wellness programs",
    href: "/enterprise",
    gradient: "from-slate-600 to-gray-700"
  },
  {
    icon: GraduationCap,
    title: "For Educators",
    description: "Student mental health support tools",
    href: "/education",
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    icon: Users,
    title: "For Families",
    description: "Family therapy and support solutions",
    href: "/family",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Heart,
    title: "For Healthcare",
    description: "Integration with healthcare providers",
    href: "/healthcare",
    gradient: "from-teal-500 to-green-500"
  }
];

const resourcesFeatures = [
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "Get answers to common questions",
    href: "/help",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    icon: BookOpen,
    title: "Mental Health Library",
    description: "Educational content and resources",
    href: "/resources",
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: Users,
    title: "Community Forums",
    description: "Connect with peers and share experiences",
    href: "/community/forums",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "Research & Studies",
    description: "Latest findings in digital mental health",
    href: "/research",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Star,
    title: "Success Stories",
    description: "Read inspiring recovery journeys",
    href: "/stories",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Compass,
    title: "Getting Started Guide",
    description: "Your path to better mental health",
    href: "/guide",
    gradient: "from-cyan-500 to-blue-500"
  }
];

const HeaderDropdowns = () => {
  const { isDesktop, isMd, isTablet } = useEnhancedScreenSize();
  const isLargeScreen = isDesktop; // 1280px+
  const isMediumScreen = isMd; // 1024-1279px
  const isSmallScreen = isTablet; // 768-1023px

  // Render 2-column grid layout for large screens only
  const renderLargeScreenGrid = (items: any[], columns = 2) => (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {items.map((item, index) => (
        <HeaderDropdownItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          href={item.href}
          gradient={item.gradient}
          badge={item.badge}
          compact={false}
        />
      ))}
    </div>
  );

  // Render compact single column for medium screens
  const renderMediumScreenList = (items: any[]) => (
    <div className="space-y-2">
      {items.map((item, index) => (
        <HeaderDropdownItem
          key={index}
          icon={item.icon}
          title={item.title}
          description={item.description}
          href={item.href}
          gradient={item.gradient}
          badge={item.badge}
          compact={true}
        />
      ))}
    </div>
  );

  // Render simple list for small screens
  const renderSmallScreenList = (items: any[]) => (
    <div className="space-y-1">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.href}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-therapy-50 transition-colors"
        >
          <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
            <item.icon className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  );

  const renderContent = (items: any[], columns = 2) => {
    if (isLargeScreen) {
      return renderLargeScreenGrid(items, columns);
    } else if (isMediumScreen) {
      return renderMediumScreenList(items);
    } else {
      return renderSmallScreenList(items);
    }
  };

  return (
    <>
      {/* Therapy AI Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Brain className="h-4 w-4" />
          <span>Therapy AI</span>
        </button>
        <HeaderDropdownCard width="xl" className="dropdown-left">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Therapy</h3>
            <p className="text-sm text-gray-600">
              Experience personalized mental health support with our advanced AI therapists
            </p>
          </div>
          {renderContent(therapyAIFeatures, 2)}
        </HeaderDropdownCard>
      </div>

      {/* Platform Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Platform</span>
        </button>
        <HeaderDropdownCard width="xl">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Platform Features</h3>
            <p className="text-sm text-gray-600">
              Comprehensive tools for your mental wellness journey
            </p>
          </div>
          {renderContent(platformFeatures, 2)}
        </HeaderDropdownCard>
      </div>

      {/* Tools & Data Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <BarChart3 className="h-4 w-4" />
          <span>Tools & Data</span>
        </button>
        <HeaderDropdownCard width="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics & Insights</h3>
            <p className="text-sm text-gray-600">
              Powerful tools to track and understand your mental health
            </p>
          </div>
          {renderContent(toolsDataFeatures, 2)}
        </HeaderDropdownCard>
      </div>

      {/* Solutions Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <Building className="h-4 w-4" />
          <span>Solutions</span>
        </button>
        <HeaderDropdownCard width="lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Specialized Solutions</h3>
            <p className="text-sm text-gray-600">
              Tailored mental health solutions for different needs
            </p>
          </div>
          {renderContent(solutionsFeatures, 2)}
        </HeaderDropdownCard>
      </div>

      {/* Resources Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-therapy-600 transition-colors">
          <BookOpen className="h-4 w-4" />
          <span>Resources</span>
        </button>
        <HeaderDropdownCard width="xl" className="dropdown-right">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Help & Resources</h3>
            <p className="text-sm text-gray-600">
              Educational content, support, and community resources
            </p>
          </div>
          {renderContent(resourcesFeatures, 2)}
        </HeaderDropdownCard>
      </div>
    </>
  );
};

export default HeaderDropdowns;
