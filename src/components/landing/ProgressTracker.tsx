
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import SafeReactWrapper from '@/components/SafeReactWrapper';

const sections = [
  { id: 'hero', title: 'Welcome', description: 'Introduction to TherapySync' },
  { id: 'stats', title: 'Impact', description: 'Our global reach and success' },
  { id: 'features', title: 'Features', description: 'Advanced AI capabilities' },
  { id: 'demo', title: 'Demo', description: 'See AI therapy in action' },
  { id: 'testimonials', title: 'Reviews', description: 'User experiences' },
  { id: 'pricing', title: 'Pricing', description: 'Choose your plan' },
  { id: 'cta', title: 'Get Started', description: 'Begin your journey' }
];

const ProgressTrackerContent = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          
          // Mark section as completed when it becomes active
          setCompletedSections(prev => {
            if (!prev.includes(sectionId)) {
              return [...prev, sectionId];
            }
            return prev;
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const completionPercentage = Math.round((completedSections.length / sections.length) * 100);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block">
      <Card className="w-64 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Page Progress</h3>
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0"
            >
              {completionPercentage}%
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="space-y-2">
            {sections.map((section, index) => {
              const isActive = activeSection === section.id;
              const isCompleted = completedSections.includes(section.id);
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all duration-200 hover:bg-therapy-50 ${
                    isActive ? 'bg-therapy-50 border-l-2 border-therapy-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-therapy-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        isActive ? 'text-therapy-700' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {section.title}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProgressTracker = () => {
  return (
    <SafeReactWrapper componentName="ProgressTracker">
      <ProgressTrackerContent />
    </SafeReactWrapper>
  );
};

export default ProgressTracker;
