
import { supabase } from '@/integrations/supabase/client';

export interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communication_style: string;
  experience_level: string;
  color_scheme: string;
  icon: string;
  effectiveness_areas: Record<string, number>;
  personality_traits: Record<string, number>;
  is_active: boolean;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'scale' | 'multiple_choice' | 'multi_select';
  options?: string[];
  category: string;
  weight: number;
}

export interface AssessmentResponse {
  questionId: string;
  value: number | string | string[];
}

export interface TherapistMatch {
  therapist: TherapistPersonality;
  compatibility_score: number;
  reasoning: string[];
  strengths: string[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'primary_concern',
    question: 'What is your primary concern or area you\'d like to work on?',
    type: 'multiple_choice',
    options: ['Anxiety', 'Depression', 'Stress', 'Relationships', 'Trauma Recovery', 'Personal Growth', 'Life Transitions', 'Mindfulness'],
    category: 'concerns',
    weight: 3
  },
  {
    id: 'communication_preference',
    question: 'How do you prefer your therapist to communicate with you?',
    type: 'multiple_choice',
    options: ['Direct and structured', 'Gentle and supportive', 'Encouraging and optimistic', 'Analytical and insightful', 'Exploratory and open-ended'],
    category: 'communication',
    weight: 2.5
  },
  {
    id: 'therapy_experience',
    question: 'What is your experience with therapy?',
    type: 'multiple_choice',
    options: ['New to therapy', 'Some experience', 'Experienced with therapy', 'Prefer not to say'],
    category: 'experience',
    weight: 1.5
  },
  {
    id: 'stress_level',
    question: 'How would you rate your current stress level?',
    type: 'scale',
    category: 'current_state',
    weight: 2
  },
  {
    id: 'support_style',
    question: 'What type of therapeutic approach appeals to you most?',
    type: 'multiple_choice',
    options: ['Practical problem-solving', 'Mindfulness and meditation', 'Strength-based focus', 'Trauma-sensitive care', 'Relationship-focused', 'Holistic wellness'],
    category: 'approach',
    weight: 3
  },
  {
    id: 'session_goals',
    question: 'What would you like to achieve from therapy sessions?',
    type: 'multi_select',
    options: ['Reduce anxiety', 'Improve mood', 'Better relationships', 'Stress management', 'Personal growth', 'Heal from trauma', 'Build confidence', 'Find life balance'],
    category: 'goals',
    weight: 2.5
  },
  {
    id: 'motivation_level',
    question: 'How motivated are you to make changes in your life?',
    type: 'scale',
    category: 'readiness',
    weight: 1.5
  }
];

export class TherapistMatchingService {
  static async getAllTherapists(): Promise<TherapistPersonality[]> {
    const { data, error } = await supabase
      .from('therapist_personalities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching therapists:', error);
      return [];
    }

    // Transform the data to ensure proper typing
    return (data || []).map(therapist => ({
      ...therapist,
      effectiveness_areas: therapist.effectiveness_areas as Record<string, number> || {},
      personality_traits: therapist.personality_traits as Record<string, number> || {}
    }));
  }

  static async calculateMatches(responses: AssessmentResponse[]): Promise<TherapistMatch[]> {
    const therapists = await this.getAllTherapists();
    const matches: TherapistMatch[] = [];

    for (const therapist of therapists) {
      const score = this.calculateCompatibilityScore(therapist, responses);
      const reasoning = this.generateReasoning(therapist, responses);
      const strengths = this.identifyStrengths(therapist, responses);

      matches.push({
        therapist,
        compatibility_score: score,
        reasoning,
        strengths
      });
    }

    return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }

  private static calculateCompatibilityScore(
    therapist: TherapistPersonality, 
    responses: AssessmentResponse[]
  ): number {
    let totalScore = 0;
    let totalWeight = 0;
    let baselineScore = 0.6; // Base compatibility score

    for (const response of responses) {
      const question = assessmentQuestions.find(q => q.id === response.questionId);
      if (!question) continue;

      const questionScore = this.getQuestionScore(therapist, question, response);
      totalScore += questionScore * question.weight;
      totalWeight += question.weight;
    }

    // Calculate weighted score with baseline
    const weightedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0.5;
    
    // Add personality bonus (0-0.15 bonus based on therapist personality traits)
    const personalityBonus = this.calculatePersonalityBonus(therapist);
    
    // Add random variation for more realistic scores (±0.05)
    const variation = (Math.random() - 0.5) * 0.1;
    
    // Final score calculation: baseline + weighted + personality + variation
    const finalScore = Math.min(0.98, Math.max(0.65, baselineScore + (weightedScore * 0.3) + personalityBonus + variation));
    
    return Math.round(finalScore * 100) / 100;
  }
  
  private static calculatePersonalityBonus(therapist: TherapistPersonality): number {
    const traits = therapist.personality_traits || {};
    const traitValues = Object.values(traits) as number[];
    const avgTrait = traitValues.length > 0 ? traitValues.reduce((a, b) => a + b, 0) / traitValues.length : 0.8;
    
    // Convert to bonus: high trait scores give 0.1-0.15 bonus
    return Math.min(0.15, Math.max(0.1, (avgTrait - 0.7) * 0.5));
  }

  private static getQuestionScore(
    therapist: TherapistPersonality,
    question: AssessmentQuestion,
    response: AssessmentResponse
  ): number {
    switch (question.id) {
      case 'primary_concern':
        return therapist.specialties.includes(response.value as string) ? 1 : 0.3;
      
      case 'communication_preference':
        const styleMap: Record<string, string> = {
          'Direct and structured': 'direct',
          'Gentle and supportive': 'supportive',
          'Encouraging and optimistic': 'encouraging',
          'Analytical and insightful': 'analytical',
          'Exploratory and open-ended': 'exploratory'
        };
        return therapist.communication_style === styleMap[response.value as string] ? 1 : 0.2;
      
      case 'therapy_experience':
        const expMap: Record<string, number> = {
          'New to therapy': therapist.experience_level === 'beginner' ? 1 : 0.7,
          'Some experience': therapist.experience_level === 'intermediate' ? 1 : 0.8,
          'Experienced with therapy': therapist.experience_level === 'advanced' ? 1 : 0.8,
          'Prefer not to say': 0.8
        };
        return expMap[response.value as string] || 0.5;
      
      case 'support_style':
        const approachMap: Record<string, string[]> = {
          'Practical problem-solving': ['CBT Specialist', 'Solution-Focused Therapist'],
          'Mindfulness and meditation': ['Mindfulness Coach'],
          'Strength-based focus': ['Solution-Focused Therapist'],
          'Trauma-sensitive care': ['Trauma-Informed Therapist'],
          'Relationship-focused': ['Relationship Counselor'],
          'Holistic wellness': ['Holistic Wellness Guide']
        };
        const matchingTitles = approachMap[response.value as string] || [];
        return matchingTitles.includes(therapist.title) ? 1 : 0.3;
      
      case 'session_goals':
        const goals = response.value as string[];
        const relevantAreas = Object.keys(therapist.effectiveness_areas);
        const matches = goals.filter(goal => 
          relevantAreas.some(area => 
            area.toLowerCase().includes(goal.toLowerCase().split(' ')[0])
          )
        );
        return matches.length / goals.length;
      
      case 'stress_level':
      case 'motivation_level':
        // Scale questions (1-10), higher stress = better match for stress specialists
        const scaleValue = response.value as number;
        if (question.id === 'stress_level') {
          return therapist.specialties.includes('Stress') && scaleValue > 6 ? 1 : 0.7;
        }
        return scaleValue > 5 ? 0.8 : 0.6; // Higher motivation generally better
      
      default:
        return 0.5;
    }
  }

  private static generateReasoning(
    therapist: TherapistPersonality,
    responses: AssessmentResponse[]
  ): string[] {
    const reasoning: string[] = [];
    
    const primaryConcern = responses.find(r => r.questionId === 'primary_concern')?.value as string;
    if (primaryConcern && therapist.specialties.includes(primaryConcern)) {
      reasoning.push(`Specializes in ${primaryConcern.toLowerCase()}`);
    }

    const communication = responses.find(r => r.questionId === 'communication_preference')?.value as string;
    if (communication) {
      reasoning.push(`Matches your preference for ${communication.toLowerCase()}`);
    }

    const goals = responses.find(r => r.questionId === 'session_goals')?.value as string[];
    if (goals && goals.length > 0) {
      const relevantGoals = goals.filter(goal => 
        Object.keys(therapist.effectiveness_areas).some(area => 
          area.toLowerCase().includes(goal.toLowerCase().split(' ')[0])
        )
      );
      if (relevantGoals.length > 0) {
        reasoning.push(`Effective with ${relevantGoals.join(', ').toLowerCase()}`);
      }
    }

    return reasoning;
  }

  private static identifyStrengths(
    therapist: TherapistPersonality,
    responses: AssessmentResponse[]
  ): string[] {
    const strengths: string[] = [];
    
    // Add top personality traits
    const topTraits = Object.entries(therapist.personality_traits)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => trait);
    
    strengths.push(...topTraits.map(trait => trait.charAt(0).toUpperCase() + trait.slice(1)));

    // Add top effectiveness areas
    const topAreas = Object.entries(therapist.effectiveness_areas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([area]) => area.replace('_', ' '));
    
    strengths.push(...topAreas.map(area => 
      area.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ));

    return [...new Set(strengths)]; // Remove duplicates
  }

  static async saveAssessment(
    userId: string,
    responses: AssessmentResponse[],
    matches: TherapistMatch[],
    selectedTherapistId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('therapist_assessments')
      .upsert({
        user_id: userId,
        responses: Object.fromEntries(responses.map(r => [r.questionId, r.value])),
        recommended_therapists: matches.slice(0, 3).map(m => ({
          therapist_id: m.therapist.id,
          compatibility_score: m.compatibility_score,
          reasoning: m.reasoning
        })),
        selected_therapist_id: selectedTherapistId,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving assessment:', error);
      throw error;
    }
  }

  static async getLatestAssessment(userId: string) {
    const { data, error } = await supabase
      .from('therapist_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching assessment:', error);
      return null;
    }

    return data;
  }
}
