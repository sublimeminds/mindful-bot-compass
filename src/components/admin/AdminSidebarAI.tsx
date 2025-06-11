
import React from 'react';
import { Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebarAI = () => {
  const location = useLocation();
  
  const isActive = location.pathname === '/admin/ai';
  
  return (
    <Link
      to="/admin/ai"
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <Brain className="mr-3 h-5 w-5" />
      AI Configuration
    </Link>
  );
};

export default AdminSidebarAI;
