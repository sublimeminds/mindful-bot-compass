
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Brain, Calendar, Shield, Users, BookOpen, BarChart3, Settings, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/SimpleAuthProvider';

const UnifiedNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigationItems = [
    {
      trigger: 'Features',
      items: [
        {
          title: 'Features Overview',
          description: 'Comprehensive feature showcase and system capabilities',
          icon: Star,
          href: '/features-overview'
        },
        {
          title: 'TherapySync AI',
          description: 'Advanced AI-powered therapeutic conversations',
          icon: Brain,
          href: '/therapysync-ai'
        },
        {
          title: 'Smart Scheduling',
          description: 'AI-optimized appointment and reminder system',
          icon: Calendar,
          href: '/smart-scheduling'
        },
        {
          title: 'Crisis Resources',
          description: 'Emergency support and safety planning tools',
          icon: Shield,
          href: '/crisis-resources'
        }
      ]
    },
    {
      trigger: 'Tools',
      items: [
        {
          title: 'Digital Notebook',
          description: 'Personal journaling and reflection space',
          icon: BookOpen,
          href: '/notebook'
        },
        {
          title: 'Analytics',
          description: 'Track your progress and insights',
          icon: BarChart3,
          href: '/analytics'
        },
        {
          title: 'Community',
          description: 'Connect with supportive peer groups',
          icon: Users,
          href: '/community'
        }
      ]
    },
    {
      trigger: 'Support',
      items: [
        {
          title: 'Help Center',
          description: 'Comprehensive support and documentation',
          icon: Settings,
          href: '/help'
        },
        {
          title: 'Plans & Pricing',
          description: 'Choose the right plan for your needs',
          icon: Zap,
          href: '/plans'
        }
      ]
    }
  ];

  if (!user) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button variant="ghost" onClick={() => navigate('/features-overview')}>
              Features
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" onClick={() => navigate('/therapysync-ai')}>
              AI Therapy
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" onClick={() => navigate('/plans')}>
              Pricing
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant="ghost" onClick={() => navigate('/help')}>
              Help
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-2">
        {navigationItems.map((section, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger className="text-therapy-700 hover:text-therapy-900">
              {section.trigger}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-96">
                {section.items.map((item, itemIndex) => (
                  <NavigationMenuLink key={itemIndex} asChild>
                    <Button
                      variant="ghost"
                      className="flex items-start space-x-3 p-3 h-auto justify-start"
                      onClick={() => navigate(item.href)}
                    >
                      <item.icon className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <div className="font-medium text-therapy-900 mb-1">{item.title}</div>
                        <div className="text-sm text-therapy-600">{item.description}</div>
                      </div>
                    </Button>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default UnifiedNavigation;
