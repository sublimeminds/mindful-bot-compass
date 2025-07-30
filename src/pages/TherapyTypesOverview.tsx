import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Brain, Heart, Users, Sparkles, Target, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import TherapyDetailsModal from '@/components/therapy/TherapyDetailsModal';
import heroImage from '@/assets/therapy-types-overview-hero.jpg';

// Import therapy approach icons
import therapyCBTIcon from '@/assets/icons/therapy-cbt.png';
import therapyDBTIcon from '@/assets/icons/therapy-dbt.png';
import therapyMindfulnessIcon from '@/assets/icons/therapy-mindfulness.png';
import therapyTraumaIcon from '@/assets/icons/therapy-trauma.png';
import therapyCouplesIcon from '@/assets/icons/therapy-couples.png';
import therapyLGBTQIcon from '@/assets/icons/therapy-lgbtq.png';
import therapyAddictionIcon from '@/assets/icons/therapy-addiction.png';
import therapyAdolescentIcon from '@/assets/icons/therapy-adolescent.png';

interface TherapyType {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  conditions: string[];
  icon: string;
  gradient: string;
  isPremium?: boolean;
  isNew?: boolean;
}

const therapyTypes: TherapyType[] = [
  // Core Approaches
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy',
    category: 'Core Approaches',
    description: 'Evidence-based therapy focusing on changing negative thought patterns and behaviors.',
    benefits: ['Anxiety reduction', 'Depression management', 'Behavioral change'],
    conditions: ['Anxiety', 'Depression', 'PTSD', 'OCD'],
    icon: therapyCBTIcon,
    gradient: 'from-therapy-400 via-therapy-500 to-harmony-600',
    isPremium: true
  },
  {
    id: 'dbt',
    name: 'Dialectical Behavior Therapy',
    category: 'Core Approaches', 
    description: 'Skills-based therapy for emotional regulation and interpersonal effectiveness.',
    benefits: ['Emotional regulation', 'Distress tolerance', 'Interpersonal skills'],
    conditions: ['BPD', 'Self-harm', 'Emotional dysregulation'],
    icon: therapyDBTIcon,
    gradient: 'from-balance-400 via-harmony-500 to-therapy-600',
    isPremium: true
  },
  {
    id: 'act',
    name: 'Acceptance and Commitment Therapy',
    category: 'Core Approaches',
    description: 'Mindfulness-based therapy focusing on psychological flexibility and values.',
    benefits: ['Psychological flexibility', 'Values clarity', 'Mindful awareness'],
    conditions: ['Chronic pain', 'Anxiety', 'Substance abuse'],
    icon: '🎯',
    gradient: 'from-mindful-400 via-flow-500 to-calm-600'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness-Based Therapy',
    category: 'Core Approaches',
    description: 'Present-moment awareness techniques for stress reduction and emotional regulation.',
    benefits: ['Stress reduction', 'Emotional balance', 'Present-moment awareness'],
    conditions: ['Stress', 'Anxiety', 'Depression', 'Chronic pain'],
    icon: therapyMindfulnessIcon,
    gradient: 'from-calm-400 via-mindful-500 to-flow-600'
  },
  {
    id: 'psychodynamic',
    name: 'Psychodynamic Therapy',
    category: 'Core Approaches',
    description: 'Explores unconscious thoughts and past experiences affecting current behavior.',
    benefits: ['Self-awareness', 'Pattern recognition', 'Insight development'],
    conditions: ['Depression', 'Relationship issues', 'Personality disorders'],
    icon: '🔍',
    gradient: 'from-therapy-400 via-balance-500 to-harmony-600'
  },
  {
    id: 'humanistic',
    name: 'Humanistic Therapy',
    category: 'Core Approaches',
    description: 'Person-centered approach emphasizing self-acceptance and personal growth.',
    benefits: ['Self-acceptance', 'Personal growth', 'Authenticity'],
    conditions: ['Low self-esteem', 'Identity issues', 'Life transitions'],
    icon: '🌟',
    gradient: 'from-harmony-400 via-therapy-500 to-healing-600'
  },
  {
    id: 'gestalt',
    name: 'Gestalt Therapy',
    category: 'Core Approaches',
    description: 'Focus on present-moment awareness and personal responsibility.',
    benefits: ['Present awareness', 'Emotional expression', 'Self-responsibility'],
    conditions: ['Anxiety', 'Depression', 'Relationship issues'],
    icon: '🎭',
    gradient: 'from-flow-400 via-harmony-500 to-therapy-600'
  },
  {
    id: 'existential',
    name: 'Existential Therapy',
    category: 'Core Approaches',
    description: 'Explores meaning, purpose, and existential concerns in life.',
    benefits: ['Life meaning', 'Purpose clarity', 'Existential awareness'],
    conditions: ['Existential crisis', 'Depression', 'Life transitions'],
    icon: '🌌',
    gradient: 'from-mindful-400 via-calm-500 to-balance-600'
  },

  // Specialized Therapies
  {
    id: 'trauma-focused',
    name: 'Trauma-Focused Therapy',
    category: 'Specialized Therapies',
    description: 'Specialized approaches for processing and healing from traumatic experiences.',
    benefits: ['Trauma processing', 'PTSD recovery', 'Emotional healing'],
    conditions: ['PTSD', 'Trauma', 'Abuse survivors'],
    icon: therapyTraumaIcon,
    gradient: 'from-healing-400 via-therapy-500 to-calm-600',
    isPremium: true
  },
  {
    id: 'emdr',
    name: 'EMDR Therapy',
    category: 'Specialized Therapies',
    description: 'Eye Movement Desensitization and Reprocessing for trauma recovery.',
    benefits: ['Trauma reprocessing', 'Memory integration', 'Symptom relief'],
    conditions: ['PTSD', 'Trauma', 'Phobias'],
    icon: '👁️',
    gradient: 'from-therapy-500 via-healing-400 to-balance-600',
    isPremium: true
  },
  {
    id: 'somatic',
    name: 'Somatic Therapy',
    category: 'Specialized Therapies',
    description: 'Body-based therapy for trauma and nervous system regulation.',
    benefits: ['Nervous system regulation', 'Body awareness', 'Trauma release'],
    conditions: ['Trauma', 'Chronic stress', 'Anxiety'],
    icon: '🌱',
    gradient: 'from-flow-400 via-calm-500 to-healing-600'
  },
  {
    id: 'ifs',
    name: 'Internal Family Systems',
    category: 'Specialized Therapies',
    description: 'Working with different parts of the self for internal harmony.',
    benefits: ['Self-compassion', 'Internal integration', 'Part work'],
    conditions: ['Complex trauma', 'Identity issues', 'Relationship difficulties'],
    icon: '👥',
    gradient: 'from-harmony-400 via-balance-500 to-therapy-600'
  },
  {
    id: 'cpt',
    name: 'Cognitive Processing Therapy',
    category: 'Specialized Therapies',
    description: 'Specific treatment for PTSD focusing on trauma-related thoughts.',
    benefits: ['PTSD symptom reduction', 'Cognitive restructuring', 'Trauma integration'],
    conditions: ['PTSD', 'Sexual assault', 'Combat trauma'],
    icon: '⚙️',
    gradient: 'from-therapy-400 via-healing-500 to-balance-600',
    isPremium: true
  },
  {
    id: 'pe',
    name: 'Prolonged Exposure Therapy',
    category: 'Specialized Therapies',
    description: 'Gradual exposure to trauma memories to reduce avoidance and fear.',
    benefits: ['Fear reduction', 'Avoidance elimination', 'Memory processing'],
    conditions: ['PTSD', 'Phobias', 'Trauma-related avoidance'],
    icon: '🔓',
    gradient: 'from-healing-400 via-therapy-500 to-calm-600',
    isPremium: true
  },
  {
    id: 'brainspotting',
    name: 'Brainspotting',
    category: 'Specialized Therapies',
    description: 'Eye position-based therapy for accessing and processing trauma.',
    benefits: ['Deep trauma access', 'Nervous system healing', 'Emotional release'],
    conditions: ['Trauma', 'PTSD', 'Performance anxiety'],
    icon: '👀',
    gradient: 'from-mindful-400 via-flow-500 to-healing-600'
  },
  {
    id: 'tf-cbt',
    name: 'Trauma-Focused CBT',
    category: 'Specialized Therapies',
    description: 'CBT specifically adapted for trauma survivors, especially children.',
    benefits: ['Trauma-specific skills', 'Safety building', 'Coping strategies'],
    conditions: ['Childhood trauma', 'PTSD in youth', 'Complex trauma'],
    icon: '🧸',
    gradient: 'from-therapy-400 via-healing-500 to-harmony-600'
  },

  // Relationship & Family
  {
    id: 'couples',
    name: 'Couples Therapy',
    category: 'Relationship & Family',
    description: 'Relationship counseling for couples to improve communication and connection.',
    benefits: ['Communication skills', 'Conflict resolution', 'Intimacy building'],
    conditions: ['Relationship issues', 'Communication problems', 'Infidelity'],
    icon: therapyCouplesIcon,
    gradient: 'from-therapy-400 via-harmony-500 to-healing-600',
    isPremium: true
  },
  {
    id: 'family-systems',
    name: 'Family Systems Therapy',
    category: 'Relationship & Family',
    description: 'Addressing family dynamics and improving family relationships.',
    benefits: ['Family communication', 'System understanding', 'Boundary setting'],
    conditions: ['Family conflict', 'Parenting issues', 'Adolescent problems'],
    icon: '🏠',
    gradient: 'from-balance-400 via-harmony-500 to-therapy-600',
    isPremium: true
  },
  {
    id: 'eft',
    name: 'Emotionally Focused Therapy',
    category: 'Relationship & Family',
    description: 'Attachment-based therapy for couples and families.',
    benefits: ['Emotional connection', 'Secure attachment', 'Relationship repair'],
    conditions: ['Attachment issues', 'Relationship distress', 'Emotional disconnection'],
    icon: '💖',
    gradient: 'from-healing-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'gottman',
    name: 'Gottman Method',
    category: 'Relationship & Family',
    description: 'Research-based approach to couple therapy focusing on friendship and conflict resolution.',
    benefits: ['Relationship stability', 'Conflict management', 'Intimacy enhancement'],
    conditions: ['Marital problems', 'Communication issues', 'Relationship maintenance'],
    icon: '🤝',
    gradient: 'from-harmony-400 via-balance-500 to-therapy-600'
  },
  {
    id: 'structural-family',
    name: 'Structural Family Therapy',
    category: 'Relationship & Family',
    description: 'Focus on family structure, boundaries, and hierarchies.',
    benefits: ['Healthy boundaries', 'Clear roles', 'Family organization'],
    conditions: ['Family dysfunction', 'Behavioral problems', 'Authority issues'],
    icon: '🏗️',
    gradient: 'from-balance-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'narrative-family',
    name: 'Narrative Family Therapy',
    category: 'Relationship & Family',
    description: 'Helps families re-author their stories and identities.',
    benefits: ['Story restructuring', 'Identity clarity', 'Problem externalization'],
    conditions: ['Family identity issues', 'Negative narratives', 'Life transitions'],
    icon: '📖',
    gradient: 'from-therapy-400 via-harmony-500 to-mindful-600'
  },
  {
    id: 'solution-focused-family',
    name: 'Solution-Focused Family Therapy',
    category: 'Relationship & Family',
    description: 'Brief therapy focusing on solutions rather than problems.',
    benefits: ['Quick solutions', 'Strength focus', 'Goal achievement'],
    conditions: ['Specific family issues', 'Crisis situations', 'Behavioral changes'],
    icon: '💡',
    gradient: 'from-flow-400 via-therapy-500 to-balance-600'
  },

  // Population-Specific
  {
    id: 'lgbtq',
    name: 'LGBTQ+ Affirmative Therapy',
    category: 'Population-Specific',
    description: 'Culturally competent therapy for LGBTQ+ individuals and relationships.',
    benefits: ['Identity affirmation', 'Coming out support', 'Minority stress'],
    conditions: ['Identity exploration', 'Discrimination stress', 'Coming out'],
    icon: therapyLGBTQIcon,
    gradient: 'from-therapy-400 via-harmony-500 to-flow-600',
    isPremium: true
  },
  {
    id: 'cultural',
    name: 'Cultural Therapy',
    category: 'Population-Specific',
    description: 'Culturally adapted therapy approaches for diverse backgrounds.',
    benefits: ['Cultural integration', 'Identity exploration', 'Bicultural stress'],
    conditions: ['Cultural adjustment', 'Immigration stress', 'Identity conflicts'],
    icon: '🌍',
    gradient: 'from-harmony-400 via-balance-500 to-mindful-600',
    isPremium: true
  },
  {
    id: 'geriatric',
    name: 'Geriatric Therapy',
    category: 'Population-Specific',
    description: 'Specialized therapy for older adults and aging-related challenges.',
    benefits: ['Aging adjustment', 'Loss processing', 'Cognitive support'],
    conditions: ['Late-life depression', 'Grief', 'Cognitive decline'],
    icon: '🌿',
    gradient: 'from-calm-400 via-healing-500 to-therapy-600'
  },
  {
    id: 'adolescent',
    name: 'Adolescent Therapy',
    category: 'Population-Specific',
    description: 'Age-appropriate therapy for teenagers and young adults.',
    benefits: ['Identity development', 'Peer relationships', 'Academic stress'],
    conditions: ['Teen depression', 'Anxiety', 'Behavioral issues'],
    icon: therapyAdolescentIcon,
    gradient: 'from-flow-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'children',
    name: 'Child Therapy',
    category: 'Population-Specific',
    description: 'Play-based and developmentally appropriate therapy for children.',
    benefits: ['Emotional expression', 'Behavioral improvement', 'Coping skills'],
    conditions: ['Childhood anxiety', 'ADHD', 'Behavioral problems'],
    icon: '🧸',
    gradient: 'from-healing-400 via-flow-500 to-calm-600'
  },
  {
    id: 'mens-therapy',
    name: "Men's Therapy",
    category: 'Population-Specific',
    description: 'Gender-specific therapy addressing unique challenges faced by men.',
    benefits: ['Emotional expression', 'Masculine identity', 'Relationship skills'],
    conditions: ['Depression in men', 'Anger management', 'Work stress'],
    icon: '👨',
    gradient: 'from-therapy-400 via-balance-500 to-healing-600'
  },
  {
    id: 'womens-therapy',
    name: "Women's Therapy", 
    category: 'Population-Specific',
    description: 'Gender-specific therapy for women addressing unique life experiences.',
    benefits: ['Empowerment', 'Body image', 'Work-life balance'],
    conditions: ['Postpartum depression', 'Body image issues', 'Career stress'],
    icon: '👩',
    gradient: 'from-harmony-400 via-therapy-500 to-flow-600'
  },
  {
    id: 'veteran-therapy',
    name: 'Veteran Therapy',
    category: 'Population-Specific',
    description: 'Specialized therapy for military veterans and service members.',
    benefits: ['Combat trauma healing', 'Transition support', 'Identity adjustment'],
    conditions: ['PTSD', 'Military trauma', 'Adjustment disorders'],
    icon: '🎖️',
    gradient: 'from-healing-400 via-therapy-500 to-balance-600',
    isPremium: true
  },
  {
    id: 'first-responder',
    name: 'First Responder Therapy',
    category: 'Population-Specific',
    description: 'Therapy for police, firefighters, EMTs, and other first responders.',
    benefits: ['Trauma processing', 'Stress management', 'Career resilience'],
    conditions: ['Secondary trauma', 'Burnout', 'Critical incident stress'],
    icon: '🚑',
    gradient: 'from-therapy-400 via-healing-500 to-calm-600'
  },

  // Condition-Specific
  {
    id: 'adhd',
    name: 'ADHD Therapy',
    category: 'Condition-Specific',
    description: 'Specialized approaches for attention and focus challenges.',
    benefits: ['Focus improvement', 'Executive functioning', 'Coping strategies'],
    conditions: ['ADHD', 'Attention problems', 'Executive dysfunction'],
    icon: '⚡',
    gradient: 'from-therapy-400 via-flow-500 to-balance-600'
  },
  {
    id: 'autism',
    name: 'Autism Spectrum Support',
    category: 'Condition-Specific',
    description: 'Neurodiversity-affirming support for autistic individuals.',
    benefits: ['Sensory regulation', 'Social skills', 'Self-advocacy'],
    conditions: ['Autism', 'Sensory issues', 'Social challenges'],
    icon: '🧩',
    gradient: 'from-mindful-400 via-calm-500 to-therapy-600'
  },
  {
    id: 'addiction',
    name: 'Addiction Therapy',
    category: 'Condition-Specific',
    description: 'Evidence-based treatment for substance use and behavioral addictions.',
    benefits: ['Recovery support', 'Relapse prevention', 'Coping skills'],
    conditions: ['Substance abuse', 'Behavioral addiction', 'Dual diagnosis'],
    icon: therapyAddictionIcon,
    gradient: 'from-healing-400 via-therapy-500 to-balance-600',
    isPremium: true
  },
  {
    id: 'eating-disorders',
    name: 'Eating Disorder Therapy',
    category: 'Condition-Specific',
    description: 'Specialized treatment for eating disorders and body image issues.',
    benefits: ['Body acceptance', 'Nutrition relationship', 'Recovery support'],
    conditions: ['Anorexia', 'Bulimia', 'Binge eating', 'Body dysmorphia'],
    icon: '🌸',
    gradient: 'from-therapy-400 via-healing-500 to-harmony-600',
    isPremium: true
  },
  {
    id: 'ocd',
    name: 'OCD Therapy',
    category: 'Condition-Specific',
    description: 'Exposure and Response Prevention and other OCD-specific treatments.',
    benefits: ['Compulsion reduction', 'Anxiety management', 'Functional improvement'],
    conditions: ['OCD', 'Obsessive thoughts', 'Compulsive behaviors'],
    icon: '🔄',
    gradient: 'from-balance-400 via-therapy-500 to-calm-600'
  },
  {
    id: 'bipolar-therapy',
    name: 'Bipolar Disorder Therapy',
    category: 'Condition-Specific',
    description: 'Specialized therapy for managing bipolar disorder and mood swings.',
    benefits: ['Mood stabilization', 'Episode prevention', 'Medication compliance'],
    conditions: ['Bipolar disorder', 'Mood swings', 'Manic episodes'],
    icon: '🌓',
    gradient: 'from-balance-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'chronic-pain',
    name: 'Chronic Pain Therapy',
    category: 'Condition-Specific',
    description: 'Psychological support for chronic pain management and adaptation.',
    benefits: ['Pain coping', 'Quality of life', 'Activity pacing'],
    conditions: ['Chronic pain', 'Fibromyalgia', 'Pain-related depression'],
    icon: '⚕️',
    gradient: 'from-healing-400 via-calm-500 to-therapy-600'
  },
  {
    id: 'chronic-illness',
    name: 'Chronic Illness Therapy',
    category: 'Condition-Specific',
    description: 'Support for adapting to and coping with chronic medical conditions.',
    benefits: ['Adaptation skills', 'Medical anxiety', 'Life restructuring'],
    conditions: ['Chronic illness', 'Medical trauma', 'Health anxiety'],
    icon: '🏥',
    gradient: 'from-calm-400 via-healing-500 to-balance-600'
  },
  {
    id: 'grief-therapy',
    name: 'Grief & Loss Therapy',
    category: 'Condition-Specific',
    description: 'Specialized support for processing grief and significant losses.',
    benefits: ['Grief processing', 'Meaning making', 'Adjustment support'],
    conditions: ['Bereavement', 'Complicated grief', 'Loss trauma'],
    icon: '🕊️',
    gradient: 'from-healing-400 via-therapy-500 to-calm-600'
  },
  {
    id: 'sleep-therapy',
    name: 'Sleep Therapy',
    category: 'Condition-Specific',
    description: 'Cognitive behavioral therapy specifically for sleep disorders.',
    benefits: ['Sleep quality', 'Sleep hygiene', 'Insomnia relief'],
    conditions: ['Insomnia', 'Sleep anxiety', 'Sleep disorders'],
    icon: '🌙',
    gradient: 'from-calm-400 via-mindful-500 to-therapy-600'
  },
  {
    id: 'social-anxiety',
    name: 'Social Anxiety Therapy',
    category: 'Condition-Specific',
    description: 'Specialized treatment for social anxiety and social phobia.',
    benefits: ['Social confidence', 'Exposure techniques', 'Communication skills'],
    conditions: ['Social anxiety', 'Social phobia', 'Performance anxiety'],
    icon: '🎭',
    gradient: 'from-therapy-400 via-flow-500 to-harmony-600'
  },

  // Modern Approaches
  {
    id: 'art-therapy',
    name: 'Art & Creative Therapy',
    category: 'Modern Approaches',
    description: 'Creative expression as a pathway to healing and self-discovery.',
    benefits: ['Creative expression', 'Non-verbal processing', 'Self-discovery'],
    conditions: ['Trauma', 'Depression', 'Communication difficulties'],
    icon: '🎨',
    gradient: 'from-flow-400 via-harmony-500 to-therapy-600'
  },
  {
    id: 'music-therapy',
    name: 'Music Therapy',
    category: 'Modern Approaches',
    description: 'Using music and sound for therapeutic healing and expression.',
    benefits: ['Emotional expression', 'Stress relief', 'Memory enhancement'],
    conditions: ['Depression', 'Anxiety', 'Dementia', 'ADHD'],
    icon: '🎵',
    gradient: 'from-healing-400 via-flow-500 to-mindful-600'
  },
  {
    id: 'vr-therapy',
    name: 'Virtual Reality Therapy',
    category: 'Modern Approaches',
    description: 'Immersive VR environments for exposure therapy and skill building.',
    benefits: ['Safe exposure', 'Immersive experience', 'Skill practice'],
    conditions: ['Phobias', 'PTSD', 'Social anxiety', 'Pain management'],
    icon: '🥽',
    gradient: 'from-therapy-400 via-balance-500 to-flow-600',
    isPremium: true,
    isNew: true
  },
  {
    id: 'biofeedback',
    name: 'Biofeedback Therapy',
    category: 'Modern Approaches',
    description: 'Real-time physiological monitoring for self-regulation training.',
    benefits: ['Self-regulation', 'Stress management', 'Body awareness'],
    conditions: ['Anxiety', 'Chronic pain', 'Hypertension', 'ADHD'],
    icon: '📊',
    gradient: 'from-calm-400 via-therapy-500 to-balance-600'
  },
  {
    id: 'online-therapy',
    name: 'Online Therapy',
    category: 'Modern Approaches',
    description: 'Professional therapy delivered through secure digital platforms.',
    benefits: ['Accessibility', 'Convenience', 'Comfort'],
    conditions: ['Any condition', 'Geographic barriers', 'Mobility issues'],
    icon: '💻',
    gradient: 'from-flow-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'ai-assisted',
    name: 'AI-Assisted Therapy',
    category: 'Modern Approaches',
    description: 'Therapy enhanced with artificial intelligence for personalized treatment.',
    benefits: ['Personalization', 'Data insights', 'Treatment optimization'],
    conditions: ['Various conditions', 'Data-driven care', 'Personalized treatment'],
    icon: '🤖',
    gradient: 'from-therapy-400 via-balance-500 to-mindful-600',
    isNew: true
  },
  {
    id: 'dance-movement',
    name: 'Dance/Movement Therapy',
    category: 'Modern Approaches',
    description: 'Using body movement as a medium for healing and self-expression.',
    benefits: ['Body awareness', 'Emotional expression', 'Physical integration'],
    conditions: ['Trauma', 'Body image issues', 'Depression'],
    icon: '💃',
    gradient: 'from-flow-400 via-healing-500 to-harmony-600'
  },
  {
    id: 'drama-therapy',
    name: 'Drama Therapy',
    category: 'Modern Approaches',
    description: 'Therapeutic use of drama and theater techniques for healing.',
    benefits: ['Role exploration', 'Emotional expression', 'Social skills'],
    conditions: ['Social anxiety', 'Trauma', 'Identity issues'],
    icon: '🎪',
    gradient: 'from-harmony-400 via-therapy-500 to-flow-600'
  },
  {
    id: 'ecotherapy',
    name: 'Ecotherapy',
    category: 'Modern Approaches',
    description: 'Nature-based therapy conducted in outdoor natural environments.',
    benefits: ['Nature connection', 'Stress reduction', 'Physical activity'],
    conditions: ['Depression', 'Anxiety', 'ADHD', 'Stress'],
    icon: '🌲',
    gradient: 'from-healing-400 via-calm-500 to-mindful-600'
  },
  {
    id: 'pet-assisted',
    name: 'Pet-Assisted Therapy',
    category: 'Modern Approaches',
    description: 'Therapy incorporating trained animals to facilitate healing.',
    benefits: ['Emotional support', 'Social connection', 'Stress relief'],
    conditions: ['Depression', 'Anxiety', 'PTSD', 'Autism'],
    icon: '🐕',
    gradient: 'from-healing-400 via-harmony-500 to-calm-600'
  },
  {
    id: 'mindful-eating',
    name: 'Mindful Eating Therapy',
    category: 'Modern Approaches',
    description: 'Mindfulness-based approach to healing relationship with food.',
    benefits: ['Healthy eating habits', 'Body awareness', 'Emotional regulation'],
    conditions: ['Eating disorders', 'Emotional eating', 'Body image issues'],
    icon: '🍎',
    gradient: 'from-mindful-400 via-healing-500 to-balance-600'
  },

  // Integrative Approaches
  {
    id: 'holistic-therapy',
    name: 'Holistic Therapy',
    category: 'Integrative Approaches',
    description: 'Integrating mind, body, and spirit for comprehensive healing.',
    benefits: ['Whole-person healing', 'Multiple modalities', 'Comprehensive care'],
    conditions: ['Complex conditions', 'Chronic illness', 'Life transitions'],
    icon: '🔮',
    gradient: 'from-mindful-400 via-healing-500 to-harmony-600'
  },
  {
    id: 'transpersonal',
    name: 'Transpersonal Therapy',
    category: 'Integrative Approaches',
    description: 'Therapy that includes spiritual and transcendent aspects of human experience.',
    benefits: ['Spiritual growth', 'Meaning making', 'Transcendent awareness'],
    conditions: ['Spiritual crisis', 'Existential issues', 'Life purpose'],
    icon: '✨',
    gradient: 'from-harmony-400 via-mindful-500 to-flow-600'
  },
  {
    id: 'positive-psychology',
    name: 'Positive Psychology',
    category: 'Integrative Approaches',
    description: 'Focus on strengths, well-being, and human flourishing.',
    benefits: ['Strength building', 'Well-being focus', 'Resilience development'],
    conditions: ['Depression prevention', 'Life enhancement', 'Goal achievement'],
    icon: '🌈',
    gradient: 'from-harmony-400 via-therapy-500 to-healing-600'
  },
  {
    id: 'integrative-body-mind',
    name: 'Integrative Body-Mind Therapy',
    category: 'Integrative Approaches',
    description: 'Combining body-based and cognitive approaches for comprehensive healing.',
    benefits: ['Mind-body integration', 'Holistic healing', 'Comprehensive treatment'],
    conditions: ['Trauma', 'Chronic stress', 'Psychosomatic issues'],
    icon: '🧘‍♀️',
    gradient: 'from-calm-400 via-mindful-500 to-healing-600'
  },
  {
    id: 'energy-therapy',
    name: 'Energy Therapy',
    category: 'Integrative Approaches',
    description: 'Working with energy systems and chakras for emotional healing.',
    benefits: ['Energy balance', 'Chakra alignment', 'Emotional clearing'],
    conditions: ['Energy blocks', 'Emotional imbalance', 'Spiritual issues'],
    icon: '⚡',
    gradient: 'from-mindful-400 via-flow-500 to-harmony-600'
  },

  // Brief & Solution-Focused
  {
    id: 'solution-focused',
    name: 'Solution-Focused Brief Therapy',
    category: 'Brief & Solution-Focused',
    description: 'Short-term therapy focusing on solutions rather than problems.',
    benefits: ['Quick results', 'Goal-oriented', 'Strength-based'],
    conditions: ['Specific problems', 'Goal achievement', 'Life transitions'],
    icon: '🎯',
    gradient: 'from-therapy-400 via-flow-500 to-balance-600'
  },
  {
    id: 'strategic-therapy',
    name: 'Strategic Therapy',
    category: 'Brief & Solution-Focused',
    description: 'Problem-solving approach with specific interventions and directives.',
    benefits: ['Problem solving', 'Strategic interventions', 'Behavioral change'],
    conditions: ['Specific behaviors', 'Family problems', 'Resistance to change'],
    icon: '♟️',
    gradient: 'from-balance-400 via-therapy-500 to-harmony-600'
  },
  {
    id: 'single-session',
    name: 'Single Session Therapy',
    category: 'Brief & Solution-Focused',
    description: 'Comprehensive therapy designed to be effective in just one session.',
    benefits: ['Immediate help', 'Crisis intervention', 'Focused solutions'],
    conditions: ['Crisis situations', 'Specific issues', 'One-time consultation'],
    icon: '⏱️',
    gradient: 'from-therapy-400 via-healing-500 to-flow-600'
  },
  {
    id: 'motivational-interviewing',
    name: 'Motivational Interviewing',
    category: 'Brief & Solution-Focused',
    description: 'Collaborative approach to strengthen motivation for change.',
    benefits: ['Motivation enhancement', 'Change readiness', 'Ambivalence resolution'],
    conditions: ['Addiction', 'Behavioral change', 'Health behaviors'],
    icon: '🎤',
    gradient: 'from-flow-400 via-therapy-500 to-balance-600'
  },

  // Group & Community Approaches
  {
    id: 'group-therapy',
    name: 'Group Therapy',
    category: 'Group & Community',
    description: 'Therapy conducted in a group setting with peer support and interaction.',
    benefits: ['Peer support', 'Social learning', 'Cost-effective'],
    conditions: ['Social anxiety', 'Addiction', 'Depression', 'Grief'],
    icon: '👥',
    gradient: 'from-harmony-400 via-therapy-500 to-healing-600'
  },
  {
    id: 'support-groups',
    name: 'Support Groups',
    category: 'Group & Community',
    description: 'Peer-led groups for mutual support and shared experiences.',
    benefits: ['Peer connection', 'Shared experiences', 'Mutual support'],
    conditions: ['Addiction recovery', 'Grief', 'Chronic illness', 'Life transitions'],
    icon: '🤝',
    gradient: 'from-healing-400 via-harmony-500 to-therapy-600'
  },
  {
    id: 'therapeutic-community',
    name: 'Therapeutic Community',
    category: 'Group & Community',
    description: 'Residential treatment approach using community as the method of treatment.',
    benefits: ['Peer influence', 'Social learning', 'Comprehensive support'],
    conditions: ['Addiction', 'Personality disorders', 'Severe mental illness'],
    icon: '🏘️',
    gradient: 'from-therapy-400 via-healing-500 to-harmony-600'
  },
  {
    id: 'psychoeducation',
    name: 'Psychoeducational Groups',
    category: 'Group & Community',
    description: 'Educational groups providing information about mental health conditions.',
    benefits: ['Knowledge building', 'Skill learning', 'Peer education'],
    conditions: ['Bipolar disorder', 'Depression', 'Anxiety', 'Family education'],
    icon: '📚',
    gradient: 'from-mindful-400 via-therapy-500 to-balance-600'
  }
];

const categories = Array.from(new Set(therapyTypes.map(t => t.category)));

const TherapyTypesOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isComplete, hasActiveTherapyPlan, isLoading } = useOnboardingStatus();

  const filteredTherapyTypes = therapyTypes.filter(therapy => {
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.conditions.some(condition => condition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || therapy.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || therapy.isPremium;
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  const handleLearnMore = (therapy: TherapyType) => {
    setSelectedTherapy(therapy);
    setIsModalOpen(true);
  };

  const handleStartAssessment = () => {
    setIsModalOpen(false);
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isComplete || !hasActiveTherapyPlan) {
      navigate('/onboarding');
      return;
    }
    
    // For users who have completed onboarding, go to dashboard
    navigate('/dashboard');
  };

  const getSmartButtonText = () => {
    if (isLoading) return 'Loading...';
    if (!user) return 'Start Free Assessment';
    if (!isComplete || !hasActiveTherapyPlan) return 'Complete Your Assessment';
    return 'View My Therapy Plan';
  };

  const getSmartButtonAction = () => {
    if (!user) {
      return () => navigate('/auth');
    }
    
    if (!isComplete || !hasActiveTherapyPlan) {
      return () => navigate('/onboarding');
    }
    
    return () => navigate('/dashboard');
  };

  const getSecondaryButtonText = () => {
    if (!user) return 'Learn About Our Process';
    if (!isComplete || !hasActiveTherapyPlan) return 'Why AI Assessment?';
    return 'Reassess My Profile';
  };

  const getSecondaryButtonAction = () => {
    if (!user || !isComplete || !hasActiveTherapyPlan) {
      return () => {
        // Scroll to explanation section or show info modal
        const explanationSection = document.getElementById('ai-explanation');
        explanationSection?.scrollIntoView({ behavior: 'smooth' });
      };
    }
    
    return () => navigate('/chat?reassess=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-therapy-500 to-harmony-600 mb-6">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-therapy-600 via-harmony-600 to-balance-600 bg-clip-text text-transparent mb-6">
              Comprehensive Therapy Types
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover over 70 evidence-based therapy approaches. Our AI assessment system analyzes your unique needs, 
              preferences, and goals to recommend the most effective therapeutic approaches for your situation.
            </p>
            
            {/* User Status Indicator */}
            {user && (
              <div className="mb-6">
                {isLoading ? (
                  <Badge variant="secondary" className="px-4 py-2">
                    <div className="animate-pulse">Checking your status...</div>
                  </Badge>
                ) : isComplete && hasActiveTherapyPlan ? (
                  <Badge className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Assessment Complete - View Your Plan
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-4 py-2 border-therapy-300 text-therapy-700">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Ready for Assessment
                  </Badge>
                )}
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                70+ Therapy Types
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Evidence-Based
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Personalized
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search therapy types, conditions, or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('All')}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="hidden md:inline-flex"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Button
              variant={showPremiumOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Premium Only
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTherapyTypes.length} of {therapyTypes.length} therapy types
          </p>
        </div>

        {/* Therapy Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapyTypes.map((therapy) => (
            <Card key={therapy.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
              <CardContent className="p-6">
                 <div className="flex items-start gap-4 mb-4">
                   <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${therapy.gradient} flex items-center justify-center text-2xl`}>
                     {typeof therapy.icon === 'string' && therapy.icon.startsWith('/') ? (
                       <img 
                         src={therapy.icon} 
                         alt={therapy.name} 
                         className="w-8 h-8 object-contain"
                       />
                     ) : (
                       <span className="text-2xl">{therapy.icon}</span>
                     )}
                   </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-therapy-700 transition-colors leading-tight">
                        {therapy.name}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {therapy.isPremium && (
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                            Premium
                          </Badge>
                        )}
                        {therapy.isNew && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs mb-3">
                      {therapy.category}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {therapy.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Key Benefits</h4>
                    <div className="flex flex-wrap gap-1">
                      {therapy.benefits.slice(0, 3).map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs px-2 py-0.5">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Helpful For</h4>
                    <div className="flex flex-wrap gap-1">
                      {therapy.conditions.slice(0, 3).map((condition) => (
                        <Badge key={condition} variant="outline" className="text-xs px-2 py-0.5">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleLearnMore(therapy)}
                    className="flex-1"
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTherapyTypes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No therapy types found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setShowPremiumOnly(false); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* AI Explanation Section */}
        <div id="ai-explanation" className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-therapy-50 via-harmony-50 to-balance-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-therapy-500 to-harmony-600 mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Why Choose AI-Powered Therapy Matching?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-therapy-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-therapy-600" />
                </div>
                <h3 className="font-semibold mb-2">Precision Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes 50+ factors to recommend approaches with 85% higher success rates
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-harmony-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-harmony-600" />
                </div>
                <h3 className="font-semibold mb-2">Personalized Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Each therapy plan is uniquely crafted based on your goals, preferences, and cultural background
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-balance-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-balance-600" />
                </div>
                <h3 className="font-semibold mb-2">Evidence-Based</h3>
                <p className="text-sm text-muted-foreground">
                  All recommendations are grounded in clinical research and continuously improved
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                {!user ? (
                  "Start with our comprehensive assessment to discover the therapy approaches that will work best for you."
                ) : !isComplete || !hasActiveTherapyPlan ? (
                  "Complete your personalized assessment to unlock your custom therapy recommendations."
                ) : (
                  "Your AI-powered therapy plan is ready. Review your recommendations and track your progress."
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg" 
                  onClick={getSmartButtonAction()}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700"
                >
                  {getSmartButtonText()}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={getSecondaryButtonAction()}
                >
                  {getSecondaryButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Therapy Details Modal */}
        <TherapyDetailsModal
          therapy={selectedTherapy}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStartAssessment={handleStartAssessment}
        />
      </div>
    </div>
  );
};

export default TherapyTypesOverview;