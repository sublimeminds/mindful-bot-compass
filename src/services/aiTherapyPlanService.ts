import { supabase } from '@/integrations/supabase/client';

export interface TherapyGoal {
  id: string;
  title: string;
  description: string;
  target_metric?: string;
  target_value?: number;
  current_value?: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface TherapyPhase {
  phase_number: number;
  title: string;
  description: string;
  estimated_duration_weeks: number;
  key_objectives: string[];
  techniques: string[];
  assignments: string[];
}

export interface AITherapyPlan {
  id: string;
  user_id: string;
  therapist_id: string;
  title: string;
  description: string;
  goals: TherapyGoal[];
  phases: TherapyPhase[];
  current_phase: string;
  total_phases: number;
  progress_percentage: number;
  is_active: boolean;
  ai_rationale: string;
  adaptation_history: any[];
  created_at: string;
  updated_at: string;
}

export class AITherapyPlanService {
  /**
   * Generate a personalized AI therapy plan based on user assessment and clinical data
   */
  static async generatePersonalizedPlan(
    userId: string,
    therapistId: string,
    assessmentData: any
  ): Promise<AITherapyPlan> {
    try {
      // Get user's comprehensive profile
      const userProfile = await this.getUserComprehensiveProfile(userId);
      
      // Generate AI-powered plan
      const aiPlan = await this.createAIPlan(userProfile, therapistId, assessmentData);
      
      // Save to database
      const savedPlan = await this.savePlanToDatabase(aiPlan);
      
      // Generate initial assignments
      await this.generateInitialAssignments(savedPlan.id, aiPlan);
      
      return savedPlan;
    } catch (error) {
      console.error('Error generating therapy plan:', error);
      throw error;
    }
  }

  private static async getUserComprehensiveProfile(userId: string) {
    const [profile, moodHistory, goals, traumaHistory, culturalProfile, sessionHistory] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
      supabase.from('goals').select('*').eq('user_id', userId),
      supabase.from('trauma_history').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_cultural_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('therapy_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10)
    ]);

    return {
      profile: profile.data,
      moodHistory: moodHistory.data || [],
      goals: goals.data || [],
      traumaHistory: traumaHistory.data,
      culturalProfile: culturalProfile.data,
      sessionHistory: sessionHistory.data || []
    };
  }

  private static async createAIPlan(userProfile: any, therapistId: string, assessmentData: any): Promise<Partial<AITherapyPlan>> {
    // Get therapist specialties
    const { data: therapist } = await supabase
      .from('therapist_personalities')
      .select('*')
      .eq('id', therapistId)
      .single();

    // AI-powered plan generation logic
    const planType = this.determinePlanType(assessmentData, userProfile);
    const phases = this.generatePhases(planType, therapist, assessmentData);
    const goals = this.generateSmartGoals(assessmentData, userProfile);
    
    return {
      user_id: userProfile.profile.id,
      therapist_id: therapistId,
      title: `Personalized ${planType} Therapy Plan`,
      description: this.generatePlanDescription(planType, assessmentData),
      goals,
      phases,
      current_phase: 'Phase 1: Assessment & Foundation',
      total_phases: phases.length,
      progress_percentage: 0,
      is_active: true,
      ai_rationale: this.generateAIRationale(planType, assessmentData, userProfile),
      adaptation_history: []
    };
  }

  private static determinePlanType(assessmentData: any, userProfile: any): string {
    const { anxiety_severity = 0, depression_severity = 0, trauma_history = false } = assessmentData;
    
    if (trauma_history || userProfile.traumaHistory) {
      return 'Trauma-Informed Recovery';
    } else if (anxiety_severity > 7 || depression_severity > 7) {
      return 'Intensive CBT';
    } else if (anxiety_severity > 4 || depression_severity > 4) {
      return 'Cognitive Behavioral Therapy';
    } else {
      return 'Personal Growth & Wellness';
    }
  }

  private static generatePhases(planType: string, therapist: any, assessmentData: any): TherapyPhase[] {
    const basePhases: Record<string, TherapyPhase[]> = {
      'Trauma-Informed Recovery': [
        {
          phase_number: 1,
          title: 'Safety & Stabilization',
          description: 'Establish safety, stabilize symptoms, and build coping skills',
          estimated_duration_weeks: 4,
          key_objectives: ['Build safety skills', 'Stabilize emotions', 'Establish therapeutic alliance'],
          techniques: ['Grounding techniques', 'Breathing exercises', 'Safety planning'],
          assignments: ['Daily grounding practice', 'Safety plan creation', 'Mood tracking']
        },
        {
          phase_number: 2,
          title: 'Processing & Integration',
          description: 'Process traumatic memories in a safe therapeutic environment',
          estimated_duration_weeks: 8,
          key_objectives: ['Process trauma memories', 'Develop new narratives', 'Build resilience'],
          techniques: ['EMDR techniques', 'Narrative therapy', 'Cognitive processing'],
          assignments: ['Trauma journal', 'Strength identification', 'Support network mapping']
        },
        {
          phase_number: 3,
          title: 'Integration & Growth',
          description: 'Integrate learnings and focus on post-traumatic growth',
          estimated_duration_weeks: 6,
          key_objectives: ['Integrate new insights', 'Plan for future', 'Prevent relapse'],
          techniques: ['Future planning', 'Relapse prevention', 'Meaning-making'],
          assignments: ['Future visioning', 'Relapse prevention plan', 'Gratitude practice']
        }
      ],
      'Intensive CBT': [
        {
          phase_number: 1,
          title: 'Assessment & Psychoeducation',
          description: 'Understand symptoms and learn CBT principles',
          estimated_duration_weeks: 3,
          key_objectives: ['Symptom assessment', 'CBT education', 'Goal setting'],
          techniques: ['Thought monitoring', 'Psychoeducation', 'Goal setting'],
          assignments: ['Thought record', 'CBT reading', 'Daily mood tracking']
        },
        {
          phase_number: 2,
          title: 'Skill Building & Practice',
          description: 'Develop and practice cognitive behavioral skills',
          estimated_duration_weeks: 8,
          key_objectives: ['Challenge negative thoughts', 'Behavioral experiments', 'Skill practice'],
          techniques: ['Cognitive restructuring', 'Behavioral activation', 'Exposure therapy'],
          assignments: ['Daily thought challenging', 'Activity scheduling', 'Exposure exercises']
        },
        {
          phase_number: 3,
          title: 'Consolidation & Maintenance',
          description: 'Consolidate skills and plan for long-term maintenance',
          estimated_duration_weeks: 4,
          key_objectives: ['Consolidate learning', 'Relapse prevention', 'Independent practice'],
          techniques: ['Skill review', 'Relapse prevention', 'Self-therapy'],
          assignments: ['Self-therapy sessions', 'Maintenance plan', 'Support network activation']
        }
      ],
      'Personal Growth & Wellness': [
        {
          phase_number: 1,
          title: 'Self-Discovery & Awareness',
          description: 'Develop self-awareness and identify growth areas',
          estimated_duration_weeks: 4,
          key_objectives: ['Self-assessment', 'Value clarification', 'Goal setting'],
          techniques: ['Mindfulness', 'Value exploration', 'Strength assessment'],
          assignments: ['Daily mindfulness', 'Values worksheet', 'Strength inventory']
        },
        {
          phase_number: 2,
          title: 'Skill Development & Practice',
          description: 'Develop new skills and practice personal growth techniques',
          estimated_duration_weeks: 6,
          key_objectives: ['Skill building', 'Habit formation', 'Relationship improvement'],
          techniques: ['Skill training', 'Habit stacking', 'Communication skills'],
          assignments: ['Daily practice', 'Habit tracker', 'Communication exercises']
        },
        {
          phase_number: 3,
          title: 'Integration & Future Planning',
          description: 'Integrate learnings and plan for continued growth',
          estimated_duration_weeks: 4,
          key_objectives: ['Integration', 'Future visioning', 'Sustainable practices'],
          techniques: ['Life planning', 'Vision boarding', 'Sustainable practice'],
          assignments: ['Life plan creation', 'Vision board', 'Sustainability audit']
        }
      ]
    };

    return basePhases[planType] || basePhases['Personal Growth & Wellness'];
  }

  private static generateSmartGoals(assessmentData: any, userProfile: any): TherapyGoal[] {
    const goals: TherapyGoal[] = [];
    
    if (assessmentData.anxiety_severity > 5) {
      goals.push({
        id: 'anxiety-reduction',
        title: 'Reduce Anxiety Levels',
        description: 'Decrease overall anxiety from current level to manageable range',
        target_metric: 'anxiety_scale',
        target_value: 4,
        current_value: assessmentData.anxiety_severity,
        deadline: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 12 weeks
        priority: 'high',
        status: 'not_started'
      });
    }

    if (assessmentData.depression_severity > 5) {
      goals.push({
        id: 'mood-improvement',
        title: 'Improve Mood Stability',
        description: 'Achieve more consistent positive mood patterns',
        target_metric: 'mood_average',
        target_value: 7,
        current_value: userProfile.moodHistory.length > 0 ? 
          userProfile.moodHistory.reduce((sum: number, entry: any) => sum + entry.overall, 0) / userProfile.moodHistory.length : 5,
        deadline: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 16 weeks
        priority: 'high',
        status: 'not_started'
      });
    }

    goals.push({
      id: 'coping-skills',
      title: 'Develop Effective Coping Skills',
      description: 'Master at least 5 healthy coping strategies',
      target_metric: 'coping_skills_count',
      target_value: 5,
      current_value: 0,
      deadline: new Date(Date.now() + 8 * 7 * 24 * 60 * 60 * 1000).toISOString(), // 8 weeks
      priority: 'medium',
      status: 'not_started'
    });

    return goals;
  }

  private static generatePlanDescription(planType: string, assessmentData: any): string {
    const descriptions: Record<string, string> = {
      'Trauma-Informed Recovery': 'A specialized recovery plan focusing on safety, processing, and post-traumatic growth using evidence-based trauma-informed approaches.',
      'Intensive CBT': 'An intensive cognitive behavioral therapy plan targeting negative thought patterns and behaviors through structured skill-building and practice.',
      'Cognitive Behavioral Therapy': 'A structured CBT approach focusing on identifying and changing unhelpful thought patterns and behaviors.',
      'Personal Growth & Wellness': 'A holistic personal development plan emphasizing self-discovery, skill building, and sustainable wellness practices.'
    };

    return descriptions[planType] || descriptions['Personal Growth & Wellness'];
  }

  private static generateAIRationale(planType: string, assessmentData: any, userProfile: any): string {
    const factors = [];
    
    if (assessmentData.anxiety_severity > 6) factors.push('high anxiety levels');
    if (assessmentData.depression_severity > 6) factors.push('significant depression symptoms');
    if (assessmentData.trauma_history) factors.push('trauma history');
    if (userProfile.moodHistory.length > 10) factors.push('mood pattern analysis');
    if (userProfile.sessionHistory.length > 0) factors.push('previous therapy experience');

    return `This ${planType} plan was recommended based on: ${factors.join(', ')}. The AI analysis indicates this approach will be most effective for your specific presentation and goals.`;
  }

  private static async savePlanToDatabase(plan: Partial<AITherapyPlan>) {
    const { data, error } = await supabase
      .from('therapy_plans')
      .insert({
        user_id: plan.user_id!,
        therapist_id: plan.therapist_id!,
        title: plan.title!,
        description: plan.description!,
        goals: plan.goals as any,
        current_phase: plan.current_phase!,
        total_phases: plan.total_phases!,
        progress_percentage: plan.progress_percentage!,
        is_active: plan.is_active!
      })
      .select()
      .single();

    if (error) throw error;
      return {
        ...data,
        goals: plan.goals || [],
        phases: plan.phases || [],
        ai_rationale: plan.ai_rationale || '',
        adaptation_history: plan.adaptation_history || []
      } as any;
  }

  private static async generateInitialAssignments(planId: string, plan: Partial<AITherapyPlan>) {
    const phase1 = plan.phases?.[0];
    if (!phase1) return;

    const assignments = phase1.assignments.map((assignment, index) => ({
      user_id: plan.user_id!,
      therapy_plan_id: planId,
      title: assignment,
      description: this.getAssignmentDescription(assignment),
      assignment_type: this.getAssignmentType(assignment),
      difficulty_level: 'medium',
      estimated_duration_minutes: 15,
      due_date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString() // Weekly deadlines
    }));

    const { error } = await supabase
      .from('therapy_assignments')
      .insert(assignments);

    if (error) console.error('Error creating initial assignments:', error);
  }

  private static getAssignmentDescription(assignment: string): string {
    const descriptions: Record<string, string> = {
      'Daily grounding practice': 'Practice grounding techniques for 10 minutes each day to build emotional stability.',
      'Safety plan creation': 'Develop a comprehensive safety plan with coping strategies and support contacts.',
      'Mood tracking': 'Track your daily mood, energy, and stress levels to identify patterns.',
      'Thought record': 'Record and analyze negative thoughts using the CBT thought record format.',
      'Daily mindfulness': 'Practice mindfulness meditation for 10-15 minutes daily.',
      'Values worksheet': 'Complete exercises to identify and clarify your core personal values.',
      'Strength inventory': 'Identify and document your personal strengths and past successes.'
    };

    return descriptions[assignment] || `Complete the ${assignment.toLowerCase()} as discussed in therapy.`;
  }

  private static getAssignmentType(assignment: string): string {
    if (assignment.includes('practice') || assignment.includes('tracking')) return 'practice';
    if (assignment.includes('plan') || assignment.includes('creation')) return 'exercise';
    if (assignment.includes('worksheet') || assignment.includes('inventory')) return 'homework';
    return 'reflection';
  }

  /**
   * Adapt therapy plan based on progress and outcomes
   */
  static async adaptPlan(userId: string, planId: string, progressData: any) {
    try {
      // Analyze progress
      const analysis = await this.analyzeProgress(userId, progressData);
      
      // Generate adaptations
      const adaptations = await this.generateAdaptations(analysis);
      
      // Update plan
      await this.updatePlanWithAdaptations(planId, adaptations);
      
      return adaptations;
    } catch (error) {
      console.error('Error adapting therapy plan:', error);
      throw error;
    }
  }

  private static async analyzeProgress(userId: string, progressData: any) {
    // Get recent mood trends, assignment completion, session feedback
    const [moodTrends, assignments, sessions] = await Promise.all([
      supabase.from('mood_entries').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(7),
      supabase.from('therapy_assignments').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      supabase.from('therapy_sessions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(3)
    ]);

    const completionRate = assignments.data ? 
      assignments.data.filter(a => a.completed_at).length / assignments.data.length : 0;
    
    const moodImprovement = moodTrends.data && moodTrends.data.length > 3 ?
      moodTrends.data[0].overall - moodTrends.data[moodTrends.data.length - 1].overall : 0;

    return {
      completionRate,
      moodImprovement,
      recentMoods: moodTrends.data || [],
      assignmentData: assignments.data || [],
      sessionData: sessions.data || []
    };
  }

  private static async generateAdaptations(analysis: any) {
    const adaptations = [];

    // If completion rate is low, suggest easier assignments
    if (analysis.completionRate < 0.6) {
      adaptations.push({
        type: 'assignment_difficulty',
        change: 'reduce',
        reason: 'Low completion rate suggests assignments may be too challenging'
      });
    }

    // If mood is declining, suggest phase adjustment
    if (analysis.moodImprovement < -1) {
      adaptations.push({
        type: 'phase_pacing',
        change: 'slow_down',
        reason: 'Mood decline suggests need for more stabilization before progression'
      });
    }

    // If very high completion and good mood, suggest advancement
    if (analysis.completionRate > 0.9 && analysis.moodImprovement > 1) {
      adaptations.push({
        type: 'phase_progression',
        change: 'advance',
        reason: 'Excellent progress indicates readiness for next phase'
      });
    }

    return adaptations;
  }

  private static async updatePlanWithAdaptations(planId: string, adaptations: any[]) {
    // Implementation would update the therapy plan based on adaptations
    // This could include changing phase timing, assignment difficulty, etc.
    
    const { error } = await supabase
      .from('therapy_plans')
      .update({
        updated_at: new Date().toISOString()
        // Additional updates based on adaptations
      })
      .eq('id', planId);

    if (error) throw error;
  }
}