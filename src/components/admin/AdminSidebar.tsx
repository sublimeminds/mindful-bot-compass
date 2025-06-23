
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  BarChart3, 
  FileText, 
  Settings, 
  Activity, 
  Shield,
  MessageSquare
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Brain, label: 'AI Management', path: '/admin/ai' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Content', path: '/admin/content' },
    { icon: MessageSquare, label: 'Integrations', path: '/admin/integrations' },
    { icon: Settings, label: 'System', path: '/admin/system' },
    { icon: Activity, label: 'Performance', path: '/admin/performance' },
    { icon: Shield, label: 'Crisis Mgmt', path: '/admin/crisis' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
