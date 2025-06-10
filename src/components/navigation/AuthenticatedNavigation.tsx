
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageCircle, 
  TrendingUp, 
  Target, 
  Heart, 
  Brain,
  Activity
} from 'lucide-react';

const AuthenticatedNavigation = () => {
  const navItems = [
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/mood-tracking', icon: Heart, label: 'Mood' },
    { to: '/techniques', icon: Brain, label: 'Techniques' },
    { to: '/performance', icon: Activity, label: 'Performance' },
  ];

  return (
    <div className="flex items-center space-x-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`
          }
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default AuthenticatedNavigation;
