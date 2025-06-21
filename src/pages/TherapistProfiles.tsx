
import React, { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import MobileOptimizedLayout from '@/components/mobile/MobileOptimizedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  User, 
  Heart, 
  Brain, 
  Users, 
  Star,
  Volume2,
  Languages,
  Clock,
  Shield,
  Award
} from 'lucide-react';
import { enhancedVoiceService } from '@/services/voiceService';

interface TherapistProfile {
  id: string;
  name: string;
  voiceId: string;
  voiceName: string;
  avatar: string;
  specializations: string[];
  approach: string;
  personality: string[];
  languages: string[];
  experience: string;
  rating: number;
  sampleText: string;
  background: string;
  techniques: string[];
  culturalBackground: string;
}

const TherapistProfiles = () => {
  useSEO({
    title: 'AI Therapist Profiles - TherapySync',
    description: 'Meet our AI therapists with unique personalities, specializations, and voice profiles powered by ElevenLabs technology.',
    keywords: 'AI therapists, therapy voices, mental health professionals, AI personalities'
  });

  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const therapists: TherapistProfile[] = [
    {
      id: 'dr-sarah-chen',
      name: 'Dr. Sarah Chen',
      voiceId: '9BWtsMINqrJLrRacOk9x',
      voiceName: 'Aria',
      avatar: '👩‍⚕️',
      specializations: ['Anxiety Disorders', 'Cognitive Behavioral Therapy', 'Stress Management'],
      approach: 'Evidence-based CBT with mindfulness integration',
      personality: ['Empathetic', 'Direct', 'Supportive', 'Professional'],
      languages: ['English', 'Mandarin', 'Spanish'],
      experience: '15+ years in clinical psychology',
      rating: 4.9,
      sampleText: "Hello, I'm Dr. Sarah Chen. I specialize in helping people overcome anxiety and develop practical coping strategies. My approach combines evidence-based cognitive behavioral therapy with mindfulness techniques to create lasting positive change.",
      background: "Dr. Chen brings over 15 years of experience in clinical psychology, specializing in anxiety disorders and stress management. She combines traditional CBT approaches with modern mindfulness techniques.",
      techniques: ['CBT', 'Mindfulness', 'Exposure Therapy', 'Stress Reduction'],
      culturalBackground: 'Chinese-American, culturally sensitive to Asian mental health perspectives'
    },
    {
      id: 'dr-michael-rodriguez',
      name: 'Dr. Michael Rodriguez',
      voiceId: 'N2lVS1w4EtoT3dr4eOWO',
      voiceName: 'Callum',
      avatar: '👨‍⚕️',
      specializations: ['Trauma Recovery', 'EMDR', 'Post-Traumatic Stress'],
      approach: 'Trauma-informed care with somatic awareness',
      personality: ['Gentle', 'Patient', 'Trauma-informed', 'Calming'],
      languages: ['English', 'Spanish', 'Portuguese'],
      experience: '12+ years in trauma therapy',
      rating: 4.8,
      sampleText: "I'm Dr. Michael Rodriguez, and I specialize in trauma recovery and EMDR therapy. My gentle, trauma-informed approach helps you process difficult experiences at your own pace, creating a safe space for healing.",
      background: "Dr. Rodriguez is a trauma specialist with expertise in EMDR and somatic therapies. He creates safe, supportive environments for healing from traumatic experiences.",
      techniques: ['EMDR', 'Somatic Therapy', 'Trauma-Informed Care', 'Body Awareness'],
      culturalBackground: 'Latino background with bilingual therapy expertise'
    },
    {
      id: 'dr-emily-johnson',
      name: 'Dr. Emily Johnson',
      voiceId: 'XB0fDUnXU5powFXDhCwa',
      voiceName: 'Charlotte',
      avatar: '👩‍🏫',
      specializations: ['Mindfulness', 'Meditation', 'Wellness Coaching'],
      approach: 'Holistic wellness with mindfulness practices',
      personality: ['Soothing', 'Wise', 'Mindful', 'Peaceful'],
      languages: ['English', 'French', 'German'],
      experience: '10+ years in mindfulness therapy',
      rating: 4.9,
      sampleText: "Welcome, I'm Dr. Emily Johnson. I guide people toward inner peace through mindfulness and meditation practices. Together, we'll explore techniques that bring calm and clarity to your daily life.",
      background: "Dr. Johnson is a mindfulness expert who integrates meditation practices with traditional therapy to promote holistic well-being and emotional balance.",
      techniques: ['Mindfulness-Based Therapy', 'Meditation', 'Breathwork', 'Body Scan'],
      culturalBackground: 'European training in mindfulness and meditation practices'
    },
    {
      id: 'dr-maria-santos',
      name: 'Dr. Maria Santos',
      voiceId: 'cgSgspJ2msm6clMCkdW9',
      voiceName: 'Jessica',
      avatar: '👩‍👧‍👦',
      specializations: ['Family Therapy', 'Couples Counseling', 'Relationship Issues'],
      approach: 'Systemic family therapy with cultural sensitivity',
      personality: ['Warm', 'Understanding', 'Family-focused', 'Culturally-aware'],
      languages: ['English', 'Spanish', 'Portuguese'],
      experience: '14+ years in family systems therapy',
      rating: 4.8,
      sampleText: "Hello, I'm Dr. Maria Santos. I help families and couples strengthen their relationships through understanding, communication, and cultural awareness. Every family has unique strengths we can build upon.",
      background: "Dr. Santos specializes in family dynamics and couples therapy, with particular expertise in multicultural families and relationship challenges.",
      techniques: ['Family Systems Therapy', 'Couples Counseling', 'Communication Skills', 'Cultural Integration'],
      culturalBackground: 'Latin American heritage with expertise in multicultural family dynamics'
    },
    {
      id: 'dr-james-wilson',
      name: 'Dr. James Wilson',
      voiceId: 'nPczCjzI2devNBz1zQrb',
      voiceName: 'Brian',
      avatar: '👨‍🎓',
      specializations: ['ADHD', 'Autism Spectrum', 'Neurodevelopmental Disorders'],
      approach: 'Neurodiversity-affirming therapy with practical strategies',
      personality: ['Patient', 'Understanding', 'Structured', 'Neurodiverse-affirming'],
      languages: ['English', 'Sign Language', 'German'],
      experience: '11+ years in neurodevelopmental therapy',
      rating: 4.9,
      sampleText: "I'm Dr. James Wilson, and I specialize in supporting individuals with ADHD, autism, and other neurodevelopmental differences. My approach celebrates neurodiversity while providing practical tools for success.",
      background: "Dr. Wilson is a neurodiversity specialist who works with individuals across the autism spectrum and those with ADHD, focusing on strength-based interventions.",
      techniques: ['Applied Behavior Analysis', 'Social Skills Training', 'Executive Function Coaching', 'Sensory Integration'],
      culturalBackground: 'Neurodiversity advocate with specialized training in autism and ADHD'
    },
    {
      id: 'dr-aisha-patel',
      name: 'Dr. Aisha Patel',
      voiceId: 'pFZP5JQG7iQjIQuC4Bku',
      voiceName: 'Lily',
      avatar: '👩‍💼',
      specializations: ['Cultural Identity', 'Immigration Stress', 'Intergenerational Trauma'],
      approach: 'Culturally-responsive therapy with identity integration',
      personality: ['Culturally-sensitive', 'Empowering', 'Identity-focused', 'Inclusive'],
      languages: ['English', 'Hindi', 'Gujarati', 'French'],
      experience: '9+ years in cultural psychology',
      rating: 4.7,
      sampleText: "I'm Dr. Aisha Patel, and I help individuals navigate cultural identity, immigration challenges, and intergenerational differences. Together, we'll honor your cultural heritage while building resilience.",
      background: "Dr. Patel specializes in cultural identity therapy, helping individuals balance multiple cultural identities and overcome immigration-related stress.",
      techniques: ['Cultural Identity Therapy', 'Narrative Therapy', 'Community-Based Intervention', 'Identity Integration'],
      culturalBackground: 'South Asian heritage with expertise in multicultural identity development'
    },
    {
      id: 'dr-robert-kim',
      name: 'Dr. Robert Kim',
      voiceId: 'onwK4e9ZLuTAKqWW03F9',
      voiceName: 'Daniel',
      avatar: '🧑‍⚕️',
      specializations: ['Addiction Recovery', 'Substance Abuse', 'Behavioral Addictions'],
      approach: 'Integrated addiction treatment with harm reduction',
      personality: ['Non-judgmental', 'Recovery-focused', 'Compassionate', 'Realistic'],
      languages: ['English', 'Korean', 'Japanese'],
      experience: '13+ years in addiction medicine',
      rating: 4.8,
      sampleText: "I'm Dr. Robert Kim, specializing in addiction recovery and substance abuse treatment. My approach is non-judgmental and focuses on sustainable recovery strategies tailored to your unique situation.",
      background: "Dr. Kim is an addiction specialist who combines medical knowledge with therapeutic interventions to support individuals in their recovery journey.",
      techniques: ['Motivational Interviewing', 'Cognitive Behavioral Therapy', 'Harm Reduction', 'Relapse Prevention'],
      culturalBackground: 'Korean-American with understanding of cultural stigma around addiction'
    },
    {
      id: 'dr-sofia-andersson',
      name: 'Dr. Sofia Andersson',
      voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
      voiceName: 'Alice',
      avatar: '👩‍❤️‍👨',
      specializations: ['Couples Therapy', 'Sexual Health', 'Relationship Dynamics'],
      approach: 'Emotionally-focused therapy with communication enhancement',
      personality: ['Open-minded', 'Relationship-focused', 'Communicative', 'Accepting'],
      languages: ['English', 'Swedish', 'Norwegian', 'Danish'],
      experience: '8+ years in couples and sexual therapy',
      rating: 4.9,
      sampleText: "Hello, I'm Dr. Sofia Andersson. I help couples strengthen their emotional and physical connections through improved communication and understanding. Every relationship has the potential for deeper intimacy.",
      background: "Dr. Andersson specializes in couples therapy and sexual health, helping partners develop stronger emotional and physical connections.",
      techniques: ['Emotionally Focused Therapy', 'Gottman Method', 'Sexual Therapy', 'Communication Training'],
      culturalBackground: 'Scandinavian background with progressive views on relationships and sexuality'
    }
  ];

  const playVoiceSample = async (therapist: TherapistProfile) => {
    if (playingVoice === therapist.id) {
      enhancedVoiceService.stop();
      setPlayingVoice(null);
      return;
    }

    setIsLoading(true);
    setPlayingVoice(therapist.id);

    try {
      await enhancedVoiceService.playTherapistMessage(
        therapist.sampleText,
        therapist.id
      );
    } catch (error) {
      console.error('Error playing voice sample:', error);
    } finally {
      setIsLoading(false);
      setPlayingVoice(null);
    }
  };

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent mb-6">
              Meet Your AI Therapists
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Each AI therapist has a unique personality, specialization, and voice powered by 
              ElevenLabs technology. Find the perfect match for your therapy journey.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <span>High-Quality AI Voices</span>
              </div>
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <span>29 Languages Supported</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Therapist Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {therapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{therapist.avatar}</div>
                      <div>
                        <CardTitle className="text-xl font-bold">{therapist.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Volume2 className="h-3 w-3 mr-1" />
                            {therapist.voiceName}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{therapist.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => playVoiceSample(therapist)}
                      disabled={isLoading}
                      variant={playingVoice === therapist.id ? "secondary" : "default"}
                      size="sm"
                    >
                      {playingVoice === therapist.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Background */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-harmony-600" />
                      Background
                    </h4>
                    <p className="text-sm text-muted-foreground">{therapist.background}</p>
                  </div>

                  {/* Cultural Background */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Languages className="h-4 w-4 mr-2 text-flow-600" />
                      Cultural Background
                    </h4>
                    <p className="text-sm text-muted-foreground">{therapist.culturalBackground}</p>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-therapy-600" />
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-flow-600" />
                      Personality
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.personality.map((trait, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Techniques */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-calm-600" />
                      Therapeutic Techniques
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.techniques.map((technique, index) => (
                        <Badge key={index} className="text-xs bg-calm-100 text-calm-800">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages & Experience */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Languages</span>
                      </div>
                      <div className="space-y-1">
                        {therapist.languages.map((lang, index) => (
                          <div key={index} className="text-xs text-muted-foreground">{lang}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Experience</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{therapist.experience}</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                      onClick={() => window.location.href = `/therapy?therapist=${therapist.id}`}
                    >
                      Start Session with {therapist.name.split(' ')[1]}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Voice Technology Info */}
          <Card className="mt-16 border-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
            <CardContent className="p-8 text-center">
              <Volume2 className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Powered by ElevenLabs AI Voice Technology</h2>
              <p className="text-therapy-100 mb-6 max-w-2xl mx-auto">
                Our AI therapists use state-of-the-art voice synthesis to create natural, 
                emotionally aware conversations that adapt to your needs and cultural preferences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">29 Languages</h3>
                  <p className="text-sm text-therapy-100">Multi-language support</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Emotion Detection</h3>
                  <p className="text-sm text-therapy-100">Real-time voice analysis</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cultural Adaptation</h3>
                  <p className="text-sm text-therapy-100">Culturally sensitive responses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default TherapistProfiles;
