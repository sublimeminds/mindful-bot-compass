import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Users, BarChart3, Shield, Brain, FileText, CheckCircle, Star, ArrowRight, Clock } from 'lucide-react';

const ProviderSolutions = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Healthcare Provider Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6">
                Transform Patient Care with AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive tools for healthcare providers to enhance patient outcomes, streamline workflows, 
                and integrate seamlessly with existing practice management systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Request Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Clinical Integration</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate with EMR systems, practice management software, and clinical workflows.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Real-time patient insights, outcome predictions, and evidence-based treatment recommendations.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">HIPAA Compliance</h3>
                <p className="text-muted-foreground">
                  Bank-level security with full HIPAA compliance and enterprise-grade data protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Provider Toolkit</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything healthcare providers need to deliver exceptional mental health care.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Patient Management</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive patient dashboards with progress tracking, session notes, and care coordination.
                </p>
                <Badge variant="outline">Enterprise</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">AI-Powered Insights</h3>
                <p className="text-muted-foreground mb-4">
                  Clinical decision support with risk assessment, treatment predictions, and outcome modeling.
                </p>
                <Badge variant="outline">Professional</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Documentation Tools</h3>
                <p className="text-muted-foreground mb-4">
                  Automated session transcription, clinical note generation, and billing code suggestions.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Scheduling Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Smart scheduling with automated reminders, cancellation management, and waitlist optimization.
                </p>
                <Badge variant="outline">Professional</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Compliance Monitoring</h3>
                <p className="text-muted-foreground mb-4">
                  Automated compliance checks, audit trails, and regulatory reporting for mental health standards.
                </p>
                <Badge variant="outline">Enterprise</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <BarChart3 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Outcome Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Practice-wide analytics, patient outcome tracking, and evidence-based treatment optimization.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Integration</h2>
              <p className="text-xl text-muted-foreground">
                Connect with your existing systems in minutes, not months.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {['Epic', 'Cerner', 'athenahealth', 'SimplePractice'].map((system) => (
                <div key={system} className="text-center p-6 bg-card rounded-xl border">
                  <div className="h-16 w-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{system}</h3>
                  <p className="text-sm text-muted-foreground">Certified Integration</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Healthcare Providers</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "TherapySync has transformed our practice. The AI insights help us provide better care 
                  while reducing documentation time by 60%."
                </p>
                <div>
                  <p className="font-semibold">Dr. Jennifer Chen</p>
                  <p className="text-muted-foreground">Clinical Director, Wellness Medical Group</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The seamless EMR integration and HIPAA compliance gave us confidence to adopt 
                  AI-powered mental health tools for our patients."
                </p>
                <div>
                  <p className="font-semibold">Dr. Michael Rodriguez</p>
                  <p className="text-muted-foreground">Psychiatrist, Regional Health Network</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of healthcare providers delivering better patient outcomes with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule Live Demo <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Download ROI Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProviderSolutions;