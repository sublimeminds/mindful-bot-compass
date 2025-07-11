import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, MessageSquare, Target, Brain, 
  BarChart3, Settings, Calendar, Users, Bell,
  Zap, Shield, Heart, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/therapist', label: 'Therapist', icon: Brain },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/smart-triggers', label: 'Smart Triggers', icon: Zap },
  { to: '/security', label: 'Security', icon: Shield },
  { to: '/compliance', label: 'Compliance', icon: Shield },
  { to: '/privacy', label: 'Privacy', icon: Shield },
  { to: '/mood-tracking', label: 'Mood Tracking', icon: Heart },
  { to: '/achievements', label: 'Achievements', icon: Sparkles },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="w-64 bg-gray-900 text-gray-300 min-h-screen p-4 flex flex-col">
      <div className="mb-8 text-white font-bold text-xl px-2">
        TherapySync
      </div>
      <ul className="flex flex-col space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md transition-colors duration-200',
                  isActive
                    ? 'bg-therapy-600 text-white'
                    : 'hover:bg-gray-700 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DashboardSidebar;
