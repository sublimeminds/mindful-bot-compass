import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, ArrowRight, CheckCircle, Star, Lock, Compass, Users } from 'lucide-react';

const TraumaPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
                Specialized Trauma Care
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
                Trauma-Focused Therapy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Compassionate, evidence-based treatment for trauma recovery and post-traumatic stress. 
                Our specialized AI approach provides safe, personalized healing support for your unique journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Begin Trauma Therapy <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Crisis Support Resources
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Trauma Therapy */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Trauma-Focused Therapy?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Trauma-focused therapy is specialized treatment designed to help individuals process and heal from 
                  traumatic experiences. It addresses the unique ways trauma affects the mind, body, and spirit, 
                  using evidence-based approaches that promote safety and recovery.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our trauma-informed AI system provides gentle, adaptive support that respects your pace and 
                  creates a safe therapeutic environment for healing and post-traumatic growth.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <span>Trauma-informed and culturally sensitive approach</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <span>Safety-first therapeutic environment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                    <span>Personalized healing at your own pace</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Trauma-Informed Principles</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Safety First</h4>
                      <p className="text-sm text-muted-foreground">Physical and emotional safety are prioritized</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Choice & Control</h4>
                      <p className="text-sm text-muted-foreground">You maintain control over your healing journey</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Compassionate Care</h4>
                      <p className="text-sm text-muted-foreground">Non-judgmental, empathetic support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Approaches */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence-Based Trauma Treatments</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform integrates multiple evidence-based approaches, adapting to your specific needs and trauma type.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Trauma-Focused CBT</h3>
                <p className="text-muted-foreground text-sm">
                  Cognitive-behavioral techniques specifically adapted for trauma survivors to process traumatic memories safely.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">EMDR Preparation</h3>
                <p className="text-muted-foreground text-sm">
                  Eye Movement Desensitization and Reprocessing preparation and integration support.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Somatic Approaches</h3>
                <p className="text-muted-foreground text-sm">
                  Body-based interventions to help process trauma stored in the nervous system.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Narrative Therapy</h3>
                <p className="text-muted-foreground text-sm">
                  Reconstruct your story to reclaim power and identity beyond traumatic experiences.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Grounding Techniques</h3>
                <p className="text-muted-foreground text-sm">
                  Learn practical tools to manage flashbacks, dissociation, and overwhelming emotions.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Post-Traumatic Growth</h3>
                <p className="text-muted-foreground text-sm">
                  Discover meaning, strength, and resilience that can emerge from the healing process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Trauma */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Trauma We Address</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our specialized approach is designed to help with various types of traumatic experiences.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Acute Trauma</h3>
                <p className="text-sm text-muted-foreground">Single traumatic incidents like accidents, attacks, or natural disasters</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Complex Trauma</h3>
                <p className="text-sm text-muted-foreground">Repeated trauma, childhood abuse, neglect, or ongoing domestic violence</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Developmental Trauma</h3>
                <p className="text-sm text-muted-foreground">Early childhood trauma affecting development and attachment</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Historical Trauma</h3>
                <p className="text-sm text-muted-foreground">Intergenerational trauma from historical events and cultural persecution</p>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Safety is Our Priority</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Specialized safety features and crisis support designed specifically for trauma survivors.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <Shield className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Crisis Detection</h3>
                <p className="text-muted-foreground">
                  AI monitors for crisis indicators and provides immediate support resources and professional intervention.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Lock className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Paced Processing</h3>
                <p className="text-muted-foreground">
                  Therapy progresses at your comfort level with built-in breaks and emotional regulation support.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Heart className="h-8 w-8 text-orange-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Around-the-clock access to crisis resources, grounding exercises, and emergency contacts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Healing and Hope</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The trauma-focused therapy helped me reclaim my life after PTSD. I learned to process 
                  my experiences safely and discovered strength I never knew I had."
                </p>
                <div>
                  <p className="font-semibold">Anonymous</p>
                  <p className="text-muted-foreground">PTSD & Acute Trauma Recovery</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "After years of struggling with childhood trauma, I finally found a safe space to heal. 
                  The AI understood my triggers and helped me build coping skills."
                </p>
                <div>
                  <p className="font-semibold">Anonymous</p>
                  <p className="text-muted-foreground">Complex Trauma & Development</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">You Deserve Healing and Hope</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the first step toward recovery in a safe, supportive environment designed specifically for trauma survivors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Begin Trauma Therapy <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Access Crisis Support
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              All conversations are confidential and HIPAA-compliant
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TraumaPage;