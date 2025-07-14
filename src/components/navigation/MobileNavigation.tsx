import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Brain, 
  Settings, 
  Database, 
  Star, 
  BookOpen,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import GradientLogo from '@/components/ui/GradientLogo';

interface MobileNavigationProps {
  therapyAiFeatures: any[];
  platformFeatures: any[];
  toolsDataFeatures: any[];
  solutionsFeatures: any[];
  resourcesFeatures: any[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  therapyAiFeatures,
  platformFeatures,
  toolsDataFeatures,
  solutionsFeatures,
  resourcesFeatures
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const sections = [
    {
      id: 'therapy-ai',
      icon: Brain,
      title: 'Therapy AI',
      features: therapyAiFeatures
    },
    {
      id: 'features',
      icon: Settings,
      title: 'Features',
      features: platformFeatures
    },
    {
      id: 'tools-data',
      icon: Database,
      title: 'Tools & Data',
      features: toolsDataFeatures
    },
    {
      id: 'solutions',
      icon: Star,
      title: 'Solutions',
      features: solutionsFeatures
    },
    {
      id: 'resources',
      icon: BookOpen,
      title: 'Resources',
      features: resourcesFeatures
    }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden p-2 hover:bg-therapy-50"
        >
          <Menu className="h-6 w-6 text-therapy-600" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-80 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GradientLogo size="sm" />
                <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <X className="h-5 w-5" />
                </Button>
              </Dialog.Close>
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpenSection = openSections[section.id];
                
                return (
                  <div key={section.id}>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSection(section.id)}
                      className="w-full justify-between p-3 h-auto hover:bg-therapy-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-therapy-600" />
                        <span className="font-medium text-gray-900">{section.title}</span>
                      </div>
                      {isOpenSection ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                    {isOpenSection && (
                      <div className="space-y-1 mt-2">
                        {section.features.map((feature) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <Link
                              key={feature.title}
                              to={feature.href}
                              onClick={handleLinkClick}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="mt-0.5">
                                <FeatureIcon className="h-4 w-4 text-therapy-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {feature.title}
                                  </h4>
                                  {feature.badge && (
                                    <span className={`
                                      px-2 py-1 text-xs font-medium rounded-full
                                      ${feature.badge === 'New' ? 'bg-therapy-100 text-therapy-700' : ''}
                                      ${feature.badge === 'Popular' ? 'bg-calm-100 text-calm-700' : ''}
                                      ${feature.badge === 'Pro' ? 'bg-harmony-100 text-harmony-700' : ''}
                                      ${feature.badge === 'Premium' ? 'bg-balance-100 text-balance-700' : ''}
                                      ${feature.badge === 'Enterprise' ? 'bg-gray-100 text-gray-700' : ''}
                                    `}>
                                      {feature.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {feature.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MobileNavigation;