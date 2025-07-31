import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Shield, MessageCircle, Star, Users } from "lucide-react";
import { cn } from '@/lib/utils';
import { useTherapist } from '@/contexts/TherapistContext';

const TherapistProfilesSection = () => {
  const { therapists, selectTherapist, selectedTherapist } = useTherapist();
  const [hoveredTherapist, setHoveredTherapist] = useState<string | null>(null);

  const getTherapistIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return Brain;
      case 'Heart': return Heart;
      case 'Shield': return Shield;
      default: return Brain;
    }
  };

  const stats = [
    { icon: Users, value: "25,000+", label: "Users Helped" },
    { icon: MessageCircle, value: "150,000+", label: "Sessions Completed" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: Heart, value: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-6">
            Meet Your AI Therapists
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI therapists are trained in different therapeutic approaches, each with unique specialties 
            and communication styles to match your needs perfectly.
          </p>
        </div>

        {/* Therapist Profiles Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {therapists.map((therapist) => {
            const IconComponent = getTherapistIcon(therapist.icon);
            const isSelected = selectedTherapist?.id === therapist.id;
            const isHovered = hoveredTherapist === therapist.id;
            
            return (
              <Card 
                key={therapist.id}
                className={cn(
                  "relative overflow-hidden cursor-pointer transition-all duration-300 group",
                  "bg-white hover:shadow-2xl border-2",
                  isSelected 
                    ? "border-therapy-500 shadow-therapy-glow" 
                    : "border-therapy-100 hover:border-therapy-300"
                )}
                onMouseEnter={() => setHoveredTherapist(therapist.id)}
                onMouseLeave={() => setHoveredTherapist(null)}
                onClick={() => selectTherapist(therapist.id)}
              >
                {/* Background Gradient Effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-300",
                  therapist.colorScheme,
                  isHovered ? "opacity-10" : ""
                )} />
                
                <CardContent className="relative p-8 text-center">
                  {/* Therapist Avatar */}
                  <div className={cn(
                    "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto mb-6 transition-all duration-300",
                    therapist.colorScheme,
                    isHovered ? "scale-110 shadow-lg" : ""
                  )}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>

                  {/* Therapist Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-therapy-700 mb-1">
                        {therapist.name}
                      </h3>
                      <p className="text-sm font-medium text-therapy-600">
                        {therapist.title}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {therapist.description}
                    </p>

                    {/* Approach */}
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700">
                        {therapist.approach}
                      </Badge>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {therapist.specialties.slice(0, 3).map((specialty) => (
                        <Badge 
                          key={specialty} 
                          variant="outline" 
                          className="text-xs border-therapy-200 text-therapy-600"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Communication Style */}
                    <div className="border-t border-therapy-100 pt-4">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Communication:</span> {therapist.communicationStyle}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <div className="w-3 h-3 bg-therapy-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-therapy-100">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-therapy-700 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your First Session
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Choose your therapist and begin your mental health journey today
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfilesSection;