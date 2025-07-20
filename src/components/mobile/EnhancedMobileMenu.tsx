
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, MessageSquare, BarChart3, Users, Settings, LogOut,
  Heart, Brain, Target, Book, Shield, HelpCircle, Calendar,
  Zap, Bell, CreditCard, Languages, Sparkles, Activity,
  ChevronRight, X
} from 'lucide-react';

interface EnhancedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedMobileMenu: React.FC<EnhancedMobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const mainNavItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, description: 'Your therapy overview' },
    { to: '/chat', label: 'AI Therapy', icon: MessageSquare, description: 'Chat with your AI therapist', badge: 2 },
    { to: '/mood', label: 'Mood Tracking', icon: Heart, description: 'Track your emotional wellbeing' },
    { to: '/goals', label: 'Goals', icon: Target, description: 'Manage your therapy goals' },
    { to: '/analytics', label: 'Progress', icon: BarChart3, description: 'View your therapy progress' },
    { to: '/calendar', label: 'Calendar', icon: Calendar, description: 'Schedule and appointments' },
  ];

  const toolsNavItems = [
    { to: '/journal', label: 'Journal', icon: Book, description: 'Digital therapy journal' },
    { to: '/techniques', label: 'Techniques', icon: Brain, description: 'Coping strategies & exercises' },
    { to: '/community', label: 'Community', icon: Users, description: 'Connect with others' },
    { to: '/achievements', label: 'Achievements', icon: Sparkles, description: 'Your therapy milestones' },
    { to: '/wellness', label: 'Wellness Hub', icon: Activity, description: 'Holistic wellness tools' },
  ];

  const supportNavItems = [
    { to: '/help', label: 'Help Center', icon: HelpCircle, description: 'Get support & answers' },
    { to: '/crisis-resources', label: 'Crisis Support', icon: Shield, description: 'Emergency resources', urgent: true },
    { to: '/notifications', label: 'Notifications', icon: Bell, description: 'Manage your alerts' },
    { to: '/billing', label: 'Billing', icon: CreditCard, description: 'Manage subscription' },
  ];

  const NavSection = ({ 
    title, 
    items 
  }: { 
    title: string; 
    items: Array<{ 
      to: string; 
      label: string; 
      icon: any; 
      description?: string; 
      badge?: number; 
      urgent?: boolean; 
    }> 
  }) => (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
        {title}
      </h3>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.to}
            onClick={() => handleNavigation(item.to)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
              item.urgent ? 'bg-red-50 hover:bg-red-100' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <Icon className={`h-5 w-5 ${item.urgent ? 'text-red-600' : 'text-gray-600'}`} />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${item.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="bg-white h-full w-80 max-w-[85vw] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-therapy-50 to-calm-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-therapy-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Menu</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handleNavigation('/therapy-session')}
              className="flex items-center justify-center space-x-2 bg-therapy-600 hover:bg-therapy-700"
              size="sm"
            >
              <Brain className="h-4 w-4" />
              <span>New Session</span>
            </Button>
            <Button 
              onClick={() => handleNavigation('/mood')}
              variant="outline"
              className="flex items-center justify-center space-x-2"
              size="sm"
            >
              <Heart className="h-4 w-4" />
              <span>Mood Check</span>
            </Button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="py-2">
          <NavSection title="Main" items={mainNavItems} />
          <Separator className="my-2" />
          <NavSection title="Tools" items={toolsNavItems} />
          <Separator className="my-2" />
          <NavSection title="Support" items={supportNavItems} />
          
          {/* Settings & Account */}
          <Separator className="my-2" />
          <div className="space-y-1 pb-4">
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Settings</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button
              onClick={() => handleNavigation('/integrations')}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-900">Integrations</span>
                  <p className="text-xs text-gray-500">Connect external apps</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button
              onClick={() => handleNavigation('/languages')}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Languages className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Language & Region</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t bg-gray-50">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </Button>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">TherapySync v2.1.0</p>
            <p className="text-xs text-gray-400">Made with ❤️ for your wellness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMobileMenu;
