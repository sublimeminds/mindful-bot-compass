import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, ArrowRight, CheckCircle, Star, Compass, Sun, Waves } from 'lucide-react';

const MindfulnessPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 via-background/80 to-harmony-100/30">
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 bg-harmony-100 text-harmony-700 border-harmony-200">
                Present-Moment Awareness
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-harmony-600 via-harmony-500 to-harmony-700 bg-clip-text text-transparent mb-6">
                Mindfulness-Based Therapy
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Cultivate present-moment awareness and inner peace with our comprehensive mindfulness program. 
                Reduce stress, increase emotional balance, and discover lasting well-being through ancient wisdom and modern science.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-harmony-600 hover:bg-harmony-700 shadow-lg">
                  Begin Mindfulness Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Try Guided Meditation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Mindfulness */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Mindfulness-Based Therapy?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Mindfulness-based therapy combines traditional therapeutic approaches with mindfulness meditation and 
                  awareness practices. It teaches you to observe your thoughts and feelings without judgment, 
                  creating space for healing and growth.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Our AI-guided mindfulness program offers personalized meditation experiences, breathing exercises, 
                  and mindful living practices tailored to your unique needs and lifestyle.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-harmony-600 flex-shrink-0" />
                    <span>Reduces stress and anxiety naturally</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-harmony-600 flex-shrink-0" />
                    <span>Improves emotional regulation and resilience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-harmony-600 flex-shrink-0" />
                    <span>Enhances focus and mental clarity</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-harmony-50 to-harmony-100 p-8 rounded-2xl border border-harmony-200">
                <h3 className="text-xl font-semibold mb-4 text-harmony-800">Core Mindfulness Principles</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Compass className="h-6 w-6 text-harmony-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-harmony-700">Present-Moment Awareness</h4>
                      <p className="text-sm text-muted-foreground">Focus attention on the here and now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-harmony-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-harmony-700">Non-Judgmental Acceptance</h4>
                      <p className="text-sm text-muted-foreground">Observe without criticism or evaluation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Waves className="h-6 w-6 text-harmony-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-harmony-700">Gentle Curiosity</h4>
                      <p className="text-sm text-muted-foreground">Approach experiences with openness</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mindfulness Practices */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Guided Mindfulness Practices</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover a variety of mindfulness techniques personalized to your preferences, schedule, and therapeutic goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Waves className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Breathing Meditations</h3>
                <p className="text-muted-foreground text-sm">
                  Guided breathing exercises to calm the nervous system and anchor attention in the present moment.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Body Scan Practice</h3>
                <p className="text-muted-foreground text-sm">
                  Progressive awareness of physical sensations to develop body-mind connection and release tension.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mindful Awareness</h3>
                <p className="text-muted-foreground text-sm">
                  Observe thoughts and emotions without attachment, developing clarity and emotional balance.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Walking Meditation</h3>
                <p className="text-muted-foreground text-sm">
                  Bring mindfulness to movement and daily activities, integrating practice into everyday life.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Loving-Kindness</h3>
                <p className="text-muted-foreground text-sm">
                  Cultivate compassion and self-acceptance through loving-kindness meditation practices.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Mindful Daily Life</h3>
                <p className="text-muted-foreground text-sm">
                  Apply mindfulness to eating, working, and relationships for greater presence and joy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Mindfulness Practice</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Research shows mindfulness practice creates lasting positive changes in the brain and overall well-being.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Stress Reduction</h3>
                <p className="text-sm text-muted-foreground">Lower cortisol levels, reduced anxiety, improved stress resilience</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Emotional Balance</h3>
                <p className="text-sm text-muted-foreground">Better emotion regulation, increased self-awareness, emotional stability</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Mental Clarity</h3>
                <p className="text-sm text-muted-foreground">Improved focus, better decision-making, enhanced creativity</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border">
                <h3 className="font-semibold mb-2">Physical Health</h3>
                <p className="text-sm text-muted-foreground">Lower blood pressure, improved sleep, stronger immune system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mindfulness Programs */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Structured Mindfulness Programs</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose from evidence-based programs designed for specific needs and experience levels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Mindfulness-Based Stress Reduction (MBSR)</h3>
                <p className="text-muted-foreground mb-6">
                  8-week program focusing on stress reduction through mindfulness meditation and body awareness.
                </p>
                <Badge variant="outline" className="mb-4">8 Weeks</Badge>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Daily guided meditations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Body scan practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Mindful movement</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Mindfulness-Based Cognitive Therapy (MBCT)</h3>
                <p className="text-muted-foreground mb-6">
                  Combines mindfulness with cognitive therapy to prevent depression relapse and manage difficult emotions.
                </p>
                <Badge variant="outline" className="mb-4">8 Weeks</Badge>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Thought observation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Emotion regulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Relapse prevention</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Mindful Self-Compassion (MSC)</h3>
                <p className="text-muted-foreground mb-6">
                  Learn to treat yourself with kindness and understanding, especially during difficult times.
                </p>
                <Badge variant="outline" className="mb-4">8 Weeks</Badge>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Self-kindness practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Common humanity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Mindful awareness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mindfulness Success Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "Mindfulness meditation helped me break free from chronic anxiety. I now have tools 
                  to stay calm and centered even in stressful situations."
                </p>
                <div>
                  <p className="font-semibold">David K.</p>
                  <p className="text-muted-foreground">Anxiety & Stress Management</p>
                </div>
              </div>
              
              <div className="bg-card p-8 rounded-xl border">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6">
                  "The loving-kindness practice transformed my relationship with myself. I'm much more 
                  compassionate and less self-critical than before."
                </p>
                <div>
                  <p className="font-semibold">Maria S.</p>
                  <p className="text-muted-foreground">Self-Compassion & Self-Esteem</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Mindfulness Journey Today</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the peace and clarity that comes with mindful living. Start with just a few minutes a day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Free Meditation <CheckCircle className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Programs
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default MindfulnessPage;