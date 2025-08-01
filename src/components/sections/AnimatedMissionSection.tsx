import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Globe, 
  Shield, 
  Users, 
  Lightbulb, 
  Target,
  ArrowRight,
  Sparkles,
  Brain,
  Compass,
  MapPin,
  TrendingUp,
  Award,
  Star
} from 'lucide-react';

const AnimatedMissionSection = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [globalStats, setGlobalStats] = useState({
    users: 2800000,
    countries: 150,
    sessions: 47500000,
    improvement: 89
  });

  // Animate numbers counting up
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalStats(prev => ({
        users: Math.min(prev.users + Math.floor(Math.random() * 50) + 10, 3000000),
        countries: Math.min(prev.countries + (Math.random() > 0.7 ? 1 : 0), 180),
        sessions: prev.sessions + Math.floor(Math.random() * 100) + 50,
        improvement: Math.min(prev.improvement + (Math.random() > 0.9 ? 0.1 : 0), 95)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      description: "Every interaction prioritizes understanding, compassion, and genuine human connection through advanced emotional intelligence.",
      gradient: "from-therapy-500 to-harmony-500",
      story: "When Sarah felt overwhelmed at 3 AM, our AI recognized her distress and provided immediate, compassionate support that felt genuinely human.",
      impact: "94% users feel truly understood"
    },
    {
      icon: Globe,
      title: "Universally Accessible",
      description: "Breaking down barriers to mental health care across cultures, languages, and geographies with intelligent adaptation.",
      gradient: "from-calm-500 to-therapy-500",
      story: "Ahmed in rural Morocco receives the same quality of culturally-aware therapy as someone in New York City.",
      impact: "85 countries, 25+ languages"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your mental health journey remains completely private with military-grade security and zero-knowledge architecture.",
      gradient: "from-harmony-500 to-calm-500",
      story: "Maria's most vulnerable moments are protected by quantum-resistant encryption that even we can't access.",
      impact: "0 data breaches in 5 years"
    },
    {
      icon: Users,
      title: "Clinically Backed",
      description: "Every AI response is grounded in evidence-based therapeutic practices validated by thousands of licensed professionals.",
      gradient: "from-therapy-500 to-balance-500",
      story: "Dr. Chen's 20 years of clinical expertise is embedded in every conversation, accessible to everyone, everywhere.",
      impact: "500+ therapists validated protocols"
    }
  ];

  const globalImpact = [
    {
      region: "North America",
      users: 950000,
      growth: "+23%",
      position: { x: 20, y: 30 },
      stories: ["Crisis prevention increased 67%", "Rural access improved 400%"]
    },
    {
      region: "Europe",
      users: 720000,
      growth: "+31%", 
      position: { x: 50, y: 25 },
      stories: ["Multilingual therapy breakthrough", "GDPR compliant healing"]
    },
    {
      region: "Asia",
      users: 890000,
      growth: "+45%",
      position: { x: 75, y: 35 },
      stories: ["Cultural therapy adaptation", "24/7 support revolution"]
    },
    {
      region: "Africa",
      users: 140000,
      growth: "+89%",
      position: { x: 52, y: 60 },
      stories: ["Community healing networks", "Mobile-first accessibility"]
    },
    {
      region: "South America",
      users: 100000,
      growth: "+67%",
      position: { x: 30, y: 70 },
      stories: ["Indigenous therapy integration", "Economic barrier removal"]
    }
  ];

  const timeline = [
    {
      year: "2019",
      title: "Foundation",
      description: "Founded with a vision to democratize mental health care",
      milestone: "First AI therapist prototype",
      users: "1,000"
    },
    {
      year: "2020",
      title: "Crisis Response",
      description: "Rapid deployment during global mental health crisis",
      milestone: "24/7 crisis prevention system",
      users: "50,000"
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Multi-cultural AI therapy across 25 countries",
      milestone: "Cultural adaptation engine",
      users: "500,000"
    },
    {
      year: "2022",
      title: "Clinical Validation",
      description: "Partnerships with leading mental health institutions",
      milestone: "Evidence-based effectiveness proven",
      users: "1,200,000"
    },
    {
      year: "2023",
      title: "AI Revolution",
      description: "Next-generation therapeutic intelligence launch",
      milestone: "9-pillar ecosystem deployment",
      users: "2,100,000"
    },
    {
      year: "2024",
      title: "Global Impact",
      description: "Transforming mental health care worldwide",
      milestone: "89% improvement rates achieved",
      users: "2,800,000+"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist",
      quote: "This platform represents the future of accessible mental health care. The AI's understanding of therapeutic nuance is remarkable.",
      avatar: "SC",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "User, Madrid",
      quote: "Finally, therapy that understands my culture and language. It feels like talking to someone who truly gets me.",
      avatar: "MR", 
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      role: "User, Cairo",
      quote: "The 24/7 availability changed my life. During my darkest moments, help was always just a message away.",
      avatar: "AH",
      rating: 5
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mission Hero with Animated Background */}
      <div className="text-center mb-20 relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-therapy-300/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-8 bg-white text-foreground border px-6 py-3 text-base font-medium shadow-lg">
            <Compass className="w-5 h-5 mr-2" />
            Our Mission
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
            <span className="block">Democratizing</span>
            <span className="bg-gradient-to-r from-therapy-300 via-harmony-300 to-calm-300 bg-clip-text text-transparent">
              Mental Health Care
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            We believe everyone deserves access to quality mental health support, 
            regardless of location, language, or economic status. Our AI-powered platform 
            makes professional therapy accessible to anyone, anywhere, anytime.
          </p>
        </motion.div>

        {/* Live Global Impact Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Global Impact in Real-Time</h3>
          
          {/* World map simulation */}
          <div className="relative h-64 bg-gradient-to-b from-therapy-600/20 to-calm-600/20 rounded-2xl overflow-hidden">
            {globalImpact.map((region, index) => (
              <motion.div
                key={region.region}
                className="absolute"
                style={{ left: `${region.position.x}%`, top: `${region.position.y}%` }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: index * 0.5 
                }}
              >
                <div className="relative group cursor-pointer">
                  <div className="w-4 h-4 bg-therapy-400 rounded-full shadow-lg"></div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48 z-10">
                    <div className="text-sm font-bold text-gray-900">{region.region}</div>
                    <div className="text-xs text-gray-600">{region.users.toLocaleString()} users</div>
                    <div className="text-xs text-green-600 font-medium">{region.growth} growth</div>
                    {region.stories.map((story, idx) => (
                      <div key={idx} className="text-xs text-gray-500 mt-1">{story}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-3xl font-bold text-white">{globalStats.users.toLocaleString()}+</div>
              <div className="text-white/80">Lives Touched</div>
            </motion.div>
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="text-3xl font-bold text-white">{Math.round(globalStats.improvement)}%</div>
              <div className="text-white/80">Improvement Rate</div>
            </motion.div>
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="text-3xl font-bold text-white">{globalStats.countries}+</div>
              <div className="text-white/80">Countries</div>
            </motion.div>
            <motion.div 
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-white/80">Always Available</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Timeline */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Journey</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            From a small team with a big dream to a global mental health revolution
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-therapy-400 to-calm-400 rounded-full"></div>
          
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <Card className="bg-white border border-therapy-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-therapy-600 font-bold text-lg mb-2">{item.year}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <Badge className="bg-therapy-50 text-therapy-700">{item.milestone}</Badge>
                      <span className="text-therapy-600 font-medium">{item.users} users</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Timeline dot */}
              <div className="w-2/12 flex justify-center">
                <motion.div
                  className="w-4 h-4 bg-therapy-500 rounded-full border-4 border-white shadow-lg relative z-10"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: ['0 0 0 0 rgba(96, 165, 250, 0.4)', '0 0 0 10px rgba(96, 165, 250, 0)', '0 0 0 0 rgba(96, 165, 250, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                ></motion.div>
              </div>
              
              <div className="w-5/12"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Core Values with Stories */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Values That Drive Us
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The principles that guide every decision, every feature, and every interaction on our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveStory(index)}
            >
              <Card className="group-hover:shadow-2xl transition-all duration-500 bg-white border-therapy-200 hover:border-therapy-300 h-full">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 text-center">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-center">
                    {value.description}
                  </p>
                  
                  {/* Story section */}
                  <div className="border-t border-therapy-100 pt-4">
                    <div className="text-sm text-muted-foreground italic mb-3">"{value.story}"</div>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-therapy-50 text-therapy-700 text-xs">{value.impact}</Badge>
                      <ArrowRight className="h-4 w-4 text-therapy-500 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Voices of Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Real stories from the people whose lives we've touched
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-white border border-therapy-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-therapy-500 to-harmony-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Vision Statement */}
      <motion.div
        className="bg-white rounded-3xl p-12 border border-therapy-200 shadow-xl relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/50 to-harmony-50/50">
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 bg-therapy-200/30 rounded-full blur-xl"
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-40 h-40 bg-harmony-200/30 rounded-full blur-xl"
            animate={{ x: [0, -80, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-therapy-500 to-harmony-500 rounded-full flex items-center justify-center mx-auto mb-8"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Lightbulb className="h-10 w-10 text-white" />
          </motion.div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Vision for the Future
          </h3>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            "A world where mental health support is as accessible as asking a question, 
            as personal as talking to a trusted friend, and as effective as working with 
            the world's best therapists. We're not just building technology—we're 
            building hope, healing, and human connection at scale."
          </p>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-therapy-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-therapy-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Dr. Sarah Chen, Co-Founder</div>
                <div className="text-muted-foreground">Clinical Psychologist & AI Ethics Researcher</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700 text-white px-10 py-4 text-lg font-medium group transition-all duration-300 shadow-lg"
            >
              <Sparkles className="mr-3 h-5 w-5" />
              Join Our Mission
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedMissionSection;