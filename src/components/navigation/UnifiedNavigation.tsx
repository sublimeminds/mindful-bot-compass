
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Brain, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Shield, 
  Sparkles,
  Target,
  MessageSquare,
  PenTool,
  TrendingUp
} from 'lucide-react';

const UnifiedNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('#')) return false;
    return location.pathname.startsWith(path);
  };

  const therapyFeatures = [
    {
      title: "AI Therapy Sessions",
      href: "/therapysync-ai",
      description: "Personalized AI-powered therapy conversations",
      icon: Brain,
    },
    {
      title: "Digital Notebook",
      href: "/notebook",
      description: "Journal your thoughts and track progress",
      icon: PenTool,
    },
    {
      title: "Mood Tracking",
      href: "/dashboard",
      description: "Monitor your emotional well-being",
      icon: Heart,
    },
    {
      title: "Goal Setting",
      href: "/dashboard",
      description: "Set and achieve personal wellness goals",
      icon: Target,
    },
  ];

  const communityFeatures = [
    {
      title: "Support Groups",
      href: "/community",
      description: "Connect with others on similar journeys",
      icon: Users,
    },
    {
      title: "Group Discussions",
      href: "/community",
      description: "Share experiences and get support",
      icon: MessageSquare,
    },
    {
      title: "Community Events",
      href: "/community",
      description: "Join virtual wellness events",
      icon: Calendar,
    },
  ];

  const analyticsFeatures = [
    {
      title: "Progress Reports",
      href: "/enhanced-monitoring",
      description: "Detailed insights into your wellness journey",
      icon: BarChart3,
    },
    {
      title: "Mood Analytics",
      href: "/enhanced-monitoring",
      description: "Track patterns in your emotional health",
      icon: TrendingUp,
    },
    {
      title: "Session Insights",
      href: "/enhanced-monitoring",
      description: "Understand your therapy progress",
      icon: Sparkles,
    },
  ];

  const publicNavigation = [
    {
      title: "Features",
      items: [
        {
          title: "Therapy Sessions",
          href: "#features",
          description: "AI-powered personalized therapy",
          icon: Brain,
        },
        {
          title: "Community Support",
          href: "#features",
          description: "Connect with supportive communities",
          icon: Users,
        },
        {
          title: "Progress Tracking",
          href: "#features",
          description: "Monitor your wellness journey",
          icon: BarChart3,
        },
        {
          title: "Crisis Resources",
          href: "/crisis-resources",
          description: "24/7 emergency support and resources",
          icon: Shield,
        },
      ],
    },
    {
      title: "Pricing",
      href: "#pricing",
    },
    {
      title: "Help",
      href: "/help",
    },
  ];

  const authenticatedNavigation = [
    {
      title: "Therapy",
      items: therapyFeatures,
    },
    {
      title: "Community",
      items: communityFeatures,
    },
    {
      title: "Analytics",
      items: analyticsFeatures,
    },
    {
      title: "Crisis Support",
      href: "/crisis-resources",
    },
  ];

  const navigationItems = user ? authenticatedNavigation : publicNavigation;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items ? (
              <>
                <NavigationMenuTrigger 
                  className={cn(
                    "h-10 px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    item.items.some(subItem => isActive(subItem.href)) && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[500px] gap-3 p-6 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                    {item.items.map((subItem) => (
                      <NavigationMenuLink
                        key={subItem.title}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                          isActive(subItem.href) && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleNavigation(subItem.href)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <subItem.icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">{subItem.title}</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 cursor-pointer",
                  isActive(item.href || '') && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleNavigation(item.href || '')}
              >
                {item.title}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UnifiedNavigation;
