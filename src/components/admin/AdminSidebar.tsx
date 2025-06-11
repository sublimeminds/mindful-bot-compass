import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart3, Users, FileText, Settings, Activity, Brain, TrendingUp } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { 
      icon: BarChart3, 
      label: 'Dashboard', 
      path: '/admin',
      color: 'text-blue-400'
    },
    { 
      icon: Users, 
      label: 'User Management', 
      path: '/admin/users',
      color: 'text-green-400'
    },
    { 
      icon: FileText, 
      label: 'Content Management', 
      path: '/admin/content',
      color: 'text-purple-400'
    },
    { 
      icon: Brain, 
      label: 'AI Configuration', 
      path: '/admin/ai',
      color: 'text-purple-400'
    },
    { 
      icon: TrendingUp, 
      label: 'Analytics', 
      path: '/admin/analytics',
      color: 'text-orange-400'
    },
    { 
      icon: Settings, 
      label: 'System Management', 
      path: '/admin/system',
      color: 'text-red-400'
    },
    { 
      icon: Activity, 
      label: 'Performance', 
      path: '/admin/performance',
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed top-0 left-0 py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-800 font-semibold' : 'text-gray-400'}`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
