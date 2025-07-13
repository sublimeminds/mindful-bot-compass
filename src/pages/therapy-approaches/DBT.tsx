import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, ArrowRight, CheckCircle, Star, Shield, Activity, Target } from 'lucide-react';

const DBTPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-balance-50 via-background/80 to-balance-100/30">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-balance-500 to-balance-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 bg-balance-100 text-balance-700 border-balance-200">
                Skills-Based Therapy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-balance-600 via-balance-500 to-balance-700 bg-clip-text text-transparent mb-6">
                Dialectical Behavior Therapy (DBT)
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Master emotional regulation and interpersonal effectiveness with our comprehensive DBT program. 
                Learn essential life skills for managing intense emotions and building meaningful relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-balance-600 hover:bg-balance-700 shadow-lg">
                  Start DBT Skills Training <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Explore DBT Modules
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is DBT */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Dialectical Behavior Therapy?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  DBT is a comprehensive therapeutic approach that teaches practical skills for managing intense emotions, 
                  improving relationships, and developing a life worth living. It combines cognitive-behavioral techniques 
                  with mindfulness and acceptance strategies.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our AI-powered DBT program delivers personalized skills training through interactive modules, 
                  practice exercises, and real-time coaching to help you apply these life-changing skills.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-balance-600 flex-shrink-0" />
                    <span>Proven effective for emotional dysregulation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-balance-600 flex-shrink-0" />
                    <span>Practical skills for daily life situations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-balance-600 flex-shrink-0" />
                    <span>Focus on building interpersonal effectiveness</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-balance-50 to-balance-100 p-8 rounded-2xl border border-balance-200">
                <h3 className="text-xl font-semibold mb-4 text-balance-800">DBT Core Principles</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-balance-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-balance-700">Radical Acceptance</h4>
                      <p className="text-sm text-muted-foreground">Accept reality while working toward change</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-balance-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-balance-700">Interpersonal Balance</h4>
                      <p className="text-sm text-muted-foreground">Maintain relationships while honoring your needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-balance-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-balance-700">Emotional Regulation</h4>
                      <p className="text-sm text-muted-foreground">Manage intense emotions effectively</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four Modules */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Four DBT Skills Modules</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our comprehensive DBT program covers all four essential skill areas, with AI-guided practice and personalized learning paths.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Mindfulness</h3>
                <p className="text-muted-foreground mb-6">
                  Learn to be present in the moment, observe without judgment, and develop awareness of your thoughts and emotions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Wise mind practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Observe and describe skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Non-judgmental awareness</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Distress Tolerance</h3>
                <p className="text-muted-foreground mb-6">
                  Develop skills to survive crisis situations and tolerate painful emotions without making them worse.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">TIPP crisis survival skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Distraction techniques</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Radical acceptance practice</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Emotion Regulation</h3>
                <p className="text-muted-foreground mb-6">
                  Understand and manage your emotions effectively, reduce emotional suffering, and increase positive experiences.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Emotion identification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Opposite action technique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Building mastery activities</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Interpersonal Effectiveness</h3>
                <p className="text-muted-foreground mb-6">
                  Learn to ask for what you need, say no effectively, and maintain relationships while respecting yourself.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">DEAR MAN technique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Setting boundaries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Conflict resolution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Benefits from DBT?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                DBT is particularly effective for individuals who experience intense emotions and relationship difficulties.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Emotional Dysregulation</h3>
                <p className="text-sm text-muted-foreground">Intense emotions, mood swings, emotional sensitivity</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Relationship Issues</h3>
                <p className="text-sm text-muted-foreground">Interpersonal conflicts, boundary issues, attachment concerns</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Self-Harm Behaviors</h3>
                <p className="text-sm text-muted-foreground">Self-injury, suicidal ideation, impulsive behaviors</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Trauma Recovery</h3>
                <p className="text-sm text-muted-foreground">PTSD, complex trauma, emotional trauma responses</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">DBT Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "DBT skills transformed how I handle my emotions. The distress tolerance techniques 
                  help me get through difficult moments without destructive behaviors."
                </p>
                <div>
                  <p className="font-semibold">Sarah L.</p>
                  <p className="text-muted-foreground">Emotional Regulation & Self-Harm Recovery</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The interpersonal effectiveness skills helped me communicate better with my family. 
                  I can now express my needs without damaging my relationships."
                </p>
                <div>
                  <p className="font-semibold">Marcus R.</p>
                  <p className="text-muted-foreground">Relationship & Communication</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Life-Changing Skills?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your DBT skills training today and learn to manage emotions, improve relationships, and create a life worth living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Begin DBT Skills Training <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Take DBT Assessment
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default DBTPage;