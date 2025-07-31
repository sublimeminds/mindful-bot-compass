import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, Languages, Users, Heart, Accessibility, ArrowRight } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import GlobalReachIcon from '@/components/icons/custom/GlobalReachIcon';

const GlobalReachSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });
  const globalStats = [
    { icon: <Globe className="h-6 w-6" />, label: "Countries", value: "50+", description: "Available worldwide" },
    { icon: <Languages className="h-6 w-6" />, label: "Languages", value: "25+", description: "Multilingual support" },
    { icon: <Clock className="h-6 w-6" />, label: "Timezones", value: "24/7", description: "Always available" },
    { icon: <Users className="h-6 w-6" />, label: "Active Users", value: "100K+", description: "Growing community" }
  ];

  const regions = [
    {
      name: "North America",
      languages: ["English", "Spanish", "French"],
      compliance: ["HIPAA", "PIPEDA"],
      users: "45,000+"
    },
    {
      name: "Europe",
      languages: ["English", "German", "French", "Italian", "Spanish"],
      compliance: ["GDPR", "Medical Device Regulation"],
      users: "35,000+"
    },
    {
      name: "Asia Pacific",
      languages: ["English", "Mandarin", "Japanese", "Korean"],
      compliance: ["Local Data Protection Laws"],
      users: "15,000+"
    },
    {
      name: "Latin America",
      languages: ["Spanish", "Portuguese", "English"],
      compliance: ["LGPD", "Local Privacy Laws"],
      users: "8,000+"
    }
  ];

  const accessibilityFeatures = [
    {
      icon: <Accessibility className="h-6 w-6" />,
      title: "Universal Accessibility",
      description: "Screen reader compatible, keyboard navigation, high contrast mode"
    },
    {
      icon: <Languages className="h-6 w-6" />,
      title: "Cultural Sensitivity",
      description: "AI trained on diverse cultural contexts and therapeutic approaches"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Inclusive Design",
      description: "Built for all backgrounds, orientations, and mental health needs"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Global Reach
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Mental Health Support Without Borders
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Breaking down barriers to mental health care with 24/7 availability, 
            multilingual support, and culturally-sensitive AI therapy worldwide.
          </p>
        </div>

        {/* Global Statistics - Mobile: 2x2 grid, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {globalStats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-lg text-center">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-center mb-2 sm:mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regional Coverage - Mobile: Single column, Desktop: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {regions.map((region, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4">{region.name}</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Languages Supported</div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {region.languages.map((lang, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Compliance</div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {region.compliance.map((comp, idx) => (
                        <Badge key={idx} className="bg-green-100 text-green-700 border-green-200 text-xs">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-600">
                      Active Users: <span className="font-semibold text-gray-900">{region.users}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accessibility Features - Mobile: Single column, Desktop: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {accessibilityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-lg text-center">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-center mb-3 sm:mb-4 text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalReachSection;