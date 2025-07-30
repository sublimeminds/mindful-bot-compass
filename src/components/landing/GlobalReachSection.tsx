import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Clock, Languages, Users, Heart, Accessibility } from 'lucide-react';

const GlobalReachSection = () => {
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
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            Global Reach
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            Mental Health Support Without Borders
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Breaking down barriers to mental health care with 24/7 availability, 
            multilingual support, and culturally-sensitive AI therapy worldwide.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {globalStats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-white/90 mb-1">{stat.label}</div>
                <div className="text-xs text-white/70">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regional Coverage */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {regions.map((region, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-white mb-4">{region.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-semibold text-white/90 mb-2">Languages Supported</div>
                    <div className="flex flex-wrap gap-2">
                      {region.languages.map((lang, idx) => (
                        <Badge key={idx} className="bg-blue-100/20 text-blue-200 border-blue-200/30">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold text-white/90 mb-2">Compliance</div>
                    <div className="flex flex-wrap gap-2">
                      {region.compliance.map((comp, idx) => (
                        <Badge key={idx} className="bg-green-100/20 text-green-200 border-green-200/30">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-white/20">
                    <div className="text-sm text-white/70">Active Users: <span className="font-semibold text-white">{region.users}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accessibility Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {accessibilityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalReachSection;