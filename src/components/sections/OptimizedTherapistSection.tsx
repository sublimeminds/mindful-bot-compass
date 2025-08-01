import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Heart, 
  Shield, 
  MessageCircle, 
  Star, 
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Clock,
  Award,
  Globe
} from "lucide-react";
import { cn } from '@/lib/utils';
import { useTherapist } from '@/contexts/TherapistContext';
import { getProfessionalAvatarImage } from '@/utils/professionalAvatarImages';

const OptimizedTherapistSection = () => {
  const { therapists, selectTherapist, selectedTherapist } = useTherapist();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [hoveredTherapist, setHoveredTherapist] = useState<string | null>(null);
  
  const itemsPerPage = 6;
  const specialties = ['Anxiety', 'Depression', 'Trauma', 'Relationships', 'Grief', 'Stress'];
  
  // Filter therapists based on selected specialty
  const filteredTherapists = selectedSpecialty 
    ? therapists.filter(t => t.specialties.includes(selectedSpecialty))
    : therapists;
  
  const totalPages = Math.ceil(filteredTherapists.length / itemsPerPage);
  const currentTherapists = filteredTherapists.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getTherapistIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return Brain;
      case 'Heart': return Heart;
      case 'Shield': return Shield;
      default: return Brain;
    }
  };

  const stats = [
    { icon: Users, value: "25,000+", label: "Users Helped", description: "Lives transformed through AI therapy" },
    { icon: MessageCircle, value: "150,000+", label: "Sessions", description: "Therapeutic conversations completed" },
    { icon: Star, value: "4.9/5", label: "Rating", description: "Average satisfaction score" },
    { icon: Heart, value: "98%", label: "Success Rate", description: "Users reporting improvement" }
  ];

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSpecialtyFilter = (specialty: string | null) => {
    setSelectedSpecialty(specialty);
    setCurrentPage(0);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-white via-therapy-25 to-harmony-25">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-2">
            <Users className="w-4 h-4 mr-2" />
            AI Therapist Network
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent mb-6">
            Meet Your AI Therapists
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our diverse network of AI therapists, each trained in different therapeutic approaches 
            and specialized for unique mental health needs.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant={selectedSpecialty === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleSpecialtyFilter(null)}
            className="rounded-full"
          >
            All Therapists
          </Button>
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              size="sm"
              onClick={() => handleSpecialtyFilter(specialty)}
              className="rounded-full"
            >
              {specialty}
            </Button>
          ))}
        </motion.div>

        {/* Therapist Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 min-h-[600px]"
          layout
        >
          {currentTherapists.map((therapist, index) => {
            const IconComponent = getTherapistIcon(therapist.icon);
            const isSelected = selectedTherapist?.id === therapist.id;
            const isHovered = hoveredTherapist === therapist.id;
            const avatarImage = getProfessionalAvatarImage(therapist.id);
            
            return (
              <motion.div
                key={therapist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card 
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all duration-500 group h-full",
                    "bg-white hover:shadow-2xl border-2",
                    isSelected 
                      ? "border-therapy-500 shadow-therapy-glow ring-2 ring-therapy-200" 
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
                  
                  <CardContent className="relative p-6">
                    {/* Professional Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={avatarImage || undefined} 
                            alt={therapist.name}
                            className="object-cover"
                          />
                          <AvatarFallback className={cn("text-white text-lg font-bold", therapist.colorScheme)}>
                            <IconComponent className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Online indicator */}
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Therapist Info */}
                    <div className="text-center space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-therapy-700 mb-1">
                          {therapist.name}
                        </h3>
                        <p className="text-sm font-medium text-therapy-600">
                          {therapist.title}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {therapist.description}
                      </p>

                      {/* Approach Badge */}
                      <Badge variant="secondary" className="bg-therapy-100 text-therapy-700 border-therapy-200">
                        {therapist.approach}
                      </Badge>

                      {/* Top Specialties */}
                      <div className="flex flex-wrap justify-center gap-1">
                        {therapist.specialties.slice(0, 2).map((specialty) => (
                          <Badge 
                            key={specialty} 
                            variant="outline" 
                            className="text-xs border-therapy-200 text-therapy-600 px-2 py-1"
                          >
                            {specialty}
                          </Badge>
                        ))}
                        {therapist.specialties.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs border-therapy-200 text-therapy-600 px-2 py-1"
                          >
                            +{therapist.specialties.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-therapy-100">
                        <div className="text-center">
                          <div className="text-xs font-semibold text-therapy-600">Rating</div>
                          <div className="text-sm flex items-center justify-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            4.9
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-semibold text-therapy-600">Response</div>
                          <div className="text-sm">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Instant
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-semibold text-therapy-600">Languages</div>
                          <div className="text-sm">
                            <Globe className="w-3 h-3 inline mr-1" />
                            3+
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <motion.div 
                          className="absolute top-3 right-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <div className="w-6 h-6 bg-therapy-500 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mb-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                  className="w-8 h-8 rounded-full p-0"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages - 1}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Platform Statistics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div 
                key={index} 
                className="text-center group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-therapy-100"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-therapy-700 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Facts */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-therapy-100 to-harmony-100 rounded-2xl p-8 border border-therapy-200">
            <h3 className="text-xl font-bold text-therapy-700 mb-4">Why Choose Our AI Therapists?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span>Available 24/7 without appointments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-harmony-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>Complete privacy and confidentiality</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-calm-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span>Evidence-based therapeutic approaches</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedTherapistSection;