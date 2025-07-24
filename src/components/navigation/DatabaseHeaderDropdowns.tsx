
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { ChevronDown } from 'lucide-react';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import { getItemIcon } from '@/utils/iconUtils';

const DatabaseHeaderDropdowns: React.FC = () => {
  console.log('🚀 DatabaseHeaderDropdowns component started rendering...');
  
  // Simple test first with React Router Link
  return (
    <div className="flex space-x-4">
      <div className="text-sm text-gray-600">Test Navigation</div>
      <Link to="/test-link" className="text-sm text-blue-600 hover:text-blue-800">
        Test Link (Router)
      </Link>
    </div>
  );
};

export default DatabaseHeaderDropdowns;
