import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, TrendingUp, Shield, Brain, BarChart3, CheckCircle, Star, ArrowRight, Target } from 'lucide-react';

const OrganizationSolutions = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Enterprise Employee Wellness
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6">
                Transform Workplace Mental Health
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive employee mental health programs that reduce burnout, increase productivity, 
                and deliver measurable ROI for organizations of all sizes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Request Enterprise Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Download ROI Calculator
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
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Measurable ROI</h3>
                <p className="text-muted-foreground">
                  Average 3.2x ROI with reduced absenteeism, lower turnover, and increased productivity.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scalable Deployment</h3>
                <p className="text-muted-foreground">
                  From 50 to 50,000+ employees with white-label options and custom integrations.
                </p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  SOC 2 Type II compliance with advanced encryption and audit controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Metrics */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Business Impact</h2>
              <p className="text-xl text-muted-foreground">
                Real metrics from organizations using TherapySync
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="text-3xl font-bold text-primary mb-2">42%</div>
                <p className="text-muted-foreground">Reduction in sick days</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="text-3xl font-bold text-primary mb-2">38%</div>
                <p className="text-muted-foreground">Lower employee turnover</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="text-3xl font-bold text-primary mb-2">$2.4M</div>
                <p className="text-muted-foreground">Average annual savings</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Employee satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to support employee mental health at scale.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <Building className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">White-Label Platform</h3>
                <p className="text-muted-foreground mb-4">
                  Customizable branding, domain, and user experience that aligns with your organization.
                </p>
                <Badge variant="outline">Enterprise</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <BarChart3 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time wellness metrics, utilization rates, and ROI tracking for leadership teams.
                </p>
                <Badge variant="outline">All Plans</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Brain className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Crisis Management</h3>
                <p className="text-muted-foreground mb-4">
                  24/7 crisis support with HR notification protocols and emergency response coordination.
                </p>
                <Badge variant="outline">Professional</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Bulk User Management</h3>
                <p className="text-muted-foreground mb-4">
                  Automated onboarding, SSO integration, and department-based access controls.
                </p>
                <Badge variant="outline">Enterprise</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Wellness Programs</h3>
                <p className="text-muted-foreground mb-4">
                  Customizable wellness challenges, mental health education, and preventive care modules.
                </p>
                <Badge variant="outline">Professional</Badge>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">Compliance Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  Automated compliance reports for OSHA, FMLA, and other regulatory requirements.
                </p>
                <Badge variant="outline">Enterprise</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "TherapySync helped us reduce mental health-related sick days by 45% and saved over 
                  $1.8M in the first year through improved productivity and retention."
                </p>
                <div>
                  <p className="font-semibold">Linda Patterson</p>
                  <p className="text-muted-foreground">Chief People Officer, TechCorp (15,000 employees)</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The real-time analytics and crisis management features have been game-changing 
                  for our employee support initiatives."
                </p>
                <div>
                  <p className="font-semibold">Robert Kim</p>
                  <p className="text-muted-foreground">VP Human Resources, Global Manufacturing Inc</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Implementation</h2>
              <p className="text-xl text-muted-foreground">
                From contract to full deployment in 30 days or less
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Discovery & Configuration (Week 1)</h3>
                  <p className="text-muted-foreground">Requirements gathering, system configuration, and branding setup</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Integration & Testing (Week 2-3)</h3>
                  <p className="text-muted-foreground">SSO setup, HR system integration, and user acceptance testing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Launch & Training (Week 4)</h3>
                  <p className="text-muted-foreground">Employee onboarding, admin training, and go-live support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workplace?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join leading organizations investing in employee mental health and seeing measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Schedule Enterprise Demo <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Download Case Studies
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default OrganizationSolutions;