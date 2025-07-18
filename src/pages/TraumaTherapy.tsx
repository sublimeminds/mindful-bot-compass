import React from 'react';
import { Shield, Heart, Users, Star, Lightbulb, Target, ArrowRight, CheckCircle, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TraumaTherapy = () => {
  const features = [
    {
      icon: Heart,
      title: "Trauma Processing",
      description: "Safe, structured approach to processing traumatic memories and experiences",
      gradient: "from-red-500/10 to-pink-500/10",
      iconColor: "text-red-600"
    },
    {
      icon: Shield,
      title: "Safety Building",
      description: "Establish emotional safety and stability before processing trauma",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600"
    },
    {
      icon: Target,
      title: "EMDR Integration",
      description: "Eye Movement Desensitization and Reprocessing techniques for trauma healing",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Somatic Approaches",
      description: "Body-based interventions to address trauma stored in the nervous system",
      gradient: "from-purple-500/10 to-violet-500/10",
      iconColor: "text-purple-600"
    },
    {
      icon: Star,
      title: "Resilience Building",
      description: "Develop strength and coping skills to thrive beyond trauma",
      gradient: "from-yellow-500/10 to-orange-500/10",
      iconColor: "text-yellow-600"
    },
    {
      icon: Lightbulb,
      title: "Post-Traumatic Growth",
      description: "Transform trauma into wisdom, strength, and personal growth",
      gradient: "from-indigo-500/10 to-blue-500/10",
      iconColor: "text-indigo-600"
    }
  ];

  const benefits = [
    "Evidence-based trauma therapies",
    "Specialized PTSD treatment",
    "Safe processing environment",
    "Personalized healing plans",
    "Crisis support available",
    "Long-term recovery focus"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4 mr-2" />
                Trauma-Focused Therapy
              </Badge>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                Healing from
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Trauma
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Specialized approaches for processing and healing from traumatic experiences. 
                We provide a safe, supportive environment for your recovery journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                Begin Healing Journey
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Trauma Care
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our evidence-based approaches provide multiple pathways to healing and recovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`group hover-scale border-0 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-300 hover:shadow-lg animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-background/80 ${feature.iconColor}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Brain className="h-4 w-4 mr-2" />
                  Evidence-Based Treatment
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose Our Trauma Therapy?
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our trauma-focused therapy combines the latest research with compassionate care, 
                  providing you with the tools and support needed for lasting healing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8 text-primary" />
                      <h3 className="text-xl font-semibold">Immediate Support</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Crisis support and immediate intervention available 24/7 for those in need.
                    </p>
                    <Button variant="outline" className="w-full">
                      Get Crisis Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="p-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20 animate-fade-in">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Begin Your Healing Journey?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Take the first step towards recovery with our specialized trauma-focused therapy. 
                  You don't have to face this alone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  Start Trauma Therapy
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Schedule Consultation
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Confidential and secure. Your privacy is our priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TraumaTherapy;