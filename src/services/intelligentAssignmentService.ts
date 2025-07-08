import { supabase } from '@/integrations/supabase/client';

export interface SmartAssignment {
  id: string;
  user_id: string;
  therapy_plan_id: string;
  title: string;
  description: string;
  assignment_type: 'homework' | 'exercise' | 'reflection' | 'practice' | 'skill_building';
  difficulty_level: 'easy' | 'medium' | 'hard';
  estimated_duration_minutes: number;
  due_date: string;
  completion_criteria: string[];
  adaptive_hints: string[];
  success_metrics: {
    completion_threshold: number;
    quality_indicators: string[];
  };
  ai_rationale: string;
  created_at: string;
  updated_at: string;
}

export interface AssignmentProgress {
  assignment_id: string;
  completion_percentage: number;
  time_spent_minutes: number;
  quality_score: number;
  struggles: string[];
  successes: string[];
  user_feedback: string;
}

export class IntelligentAssignmentService {
  /**
   * Generate personalized assignments based on user progress and capabilities
   */
  static async generateAdaptiveAssignments(
    userId: string,
    therapyPlanId: string,
    currentPhase: string,
    userCapabilities: any
  ): Promise<SmartAssignment[]> {
    try {
      // Analyze user's current state and progress
      const userState = await this.analyzeUserState(userId);
      
      // Get therapy plan context
      const planContext = await this.getTherapyPlanContext(therapyPlanId);
      
      // Generate AI-powered assignments
      const assignments = await this.createIntelligentAssignments(
        userId,
        therapyPlanId,
        currentPhase,
        userState,
        planContext,
        userCapabilities
      );
      
      // Save to database
      const savedAssignments = await this.saveAssignments(assignments);
      
      return savedAssignments;
    } catch (error) {
      console.error('Error generating adaptive assignments:', error);
      throw error;
    }
  }

  private static async analyzeUserState(userId: string) {
    const [recentMoods, completionHistory, sessionData, assignmentHistory] = await Promise.all([
      // Recent mood patterns
      supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7),
      
      // Assignment completion patterns
      supabase
        .from('therapy_assignments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20),
      
      // Recent session outcomes
      supabase
        .from('therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Historical assignment performance
      supabase
        .from('therapy_assignments')
        .select('difficulty_level, completed_at, completion_notes')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .limit(10)
    ]);

    // Calculate user capabilities
    const completionRate = this.calculateCompletionRate(completionHistory.data || []);
    const avgMood = this.calculateAverageMood(recentMoods.data || []);
    const preferredDifficulty = this.inferPreferredDifficulty(assignmentHistory.data || []);
    const stressLevel = this.calculateCurrentStressLevel(recentMoods.data || []);
    const motivationLevel = this.inferMotivationLevel(completionHistory.data || [], sessionData.data || []);

    return {
      completionRate,
      avgMood,
      preferredDifficulty,
      stressLevel,
      motivationLevel,
      recentMoods: recentMoods.data || [],
      sessionOutcomes: sessionData.data || []
    };
  }

  private static async getTherapyPlanContext(therapyPlanId: string) {
    const { data: plan } = await supabase
      .from('therapy_plans')
      .select('*')
      .eq('id', therapyPlanId)
      .single();

    return plan;
  }

  private static async createIntelligentAssignments(
    userId: string,
    therapyPlanId: string,
    currentPhase: string,
    userState: any,
    planContext: any,
    userCapabilities: any
  ): Promise<Partial<SmartAssignment>[]> {
    const assignments: Partial<SmartAssignment>[] = [];

    // Determine optimal assignment characteristics
    const optimalDifficulty = this.determineOptimalDifficulty(userState);
    const optimalDuration = this.determineOptimalDuration(userState);
    const assignmentTypes = this.selectOptimalTypes(currentPhase, userState);

    // Generate phase-specific assignments
    for (const type of assignmentTypes) {
      const assignment = await this.generateSpecificAssignment(
        userId,
        therapyPlanId,
        type,
        optimalDifficulty,
        optimalDuration,
        userState,
        planContext
      );
      
      if (assignment) assignments.push(assignment);
    }

    return assignments;
  }

  private static determineOptimalDifficulty(userState: any): 'easy' | 'medium' | 'hard' {
    // AI logic for difficulty adaptation
    if (userState.completionRate < 0.4 || userState.stressLevel > 7) {
      return 'easy';
    } else if (userState.completionRate > 0.8 && userState.motivationLevel > 7) {
      return 'hard';
    }
    return 'medium';
  }

  private static determineOptimalDuration(userState: any): number {
    // Adaptive duration based on completion patterns and stress
    const baseDuration = 15; // minutes
    
    if (userState.stressLevel > 7) return Math.max(5, baseDuration - 5);
    if (userState.motivationLevel > 8) return baseDuration + 10;
    if (userState.completionRate < 0.5) return Math.max(5, baseDuration - 5);
    
    return baseDuration;
  }

  private static selectOptimalTypes(currentPhase: string, userState: any): string[] {
    const phaseTypeMap: Record<string, string[]> = {
      'Phase 1: Assessment': ['reflection', 'homework'],
      'Phase 2: Skill Building': ['practice', 'skill_building', 'exercise'],
      'Phase 3: Integration': ['exercise', 'reflection', 'practice']
    };

    let types = phaseTypeMap[currentPhase] || ['practice', 'reflection'];

    // Adapt based on user state
    if (userState.stressLevel > 7) {
      types = types.filter(t => t !== 'skill_building'); // Remove challenging types
      types.push('reflection'); // Add calming activities
    }

    if (userState.motivationLevel < 5) {
      types = ['exercise', 'practice']; // Focus on engaging activities
    }

    return [...new Set(types)].slice(0, 3); // Max 3 assignments
  }

  private static async generateSpecificAssignment(
    userId: string,
    therapyPlanId: string,
    type: string,
    difficulty: string,
    duration: number,
    userState: any,
    planContext: any
  ): Promise<Partial<SmartAssignment> | null> {
    const assignmentTemplates = this.getAssignmentTemplates();
    const template = assignmentTemplates[type]?.[difficulty];
    
    if (!template) return null;

    // Personalize the assignment
    const personalizedAssignment = this.personalizeAssignment(template, userState, planContext);

    return {
      user_id: userId,
      therapy_plan_id: therapyPlanId,
      title: personalizedAssignment.title,
      description: personalizedAssignment.description,
      assignment_type: type as any,
      difficulty_level: difficulty as any,
      estimated_duration_minutes: duration,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
      completion_criteria: personalizedAssignment.criteria,
      adaptive_hints: personalizedAssignment.hints,
      success_metrics: {
        completion_threshold: 0.8,
        quality_indicators: personalizedAssignment.qualityIndicators
      },
      ai_rationale: personalizedAssignment.rationale
    };
  }

  private static getAssignmentTemplates() {
    return {
      reflection: {
        easy: {
          title: "Daily Mood Check-in",
          description: "Spend 5 minutes each day reflecting on your emotions and writing them down.",
          criteria: ["Complete for at least 5 days", "Include emotion and intensity"],
          hints: ["Set a daily reminder", "Keep it simple - just a few words"],
          qualityIndicators: ["Consistency", "Emotional awareness"],
          rationale: "Building emotional awareness through simple reflection"
        },
        medium: {
          title: "Weekly Progress Reflection",
          description: "Reflect on your week's challenges, successes, and learnings.",
          criteria: ["Identify 3 challenges", "Identify 3 successes", "Note key learnings"],
          hints: ["Use the challenge-success-learning format", "Be specific with examples"],
          qualityIndicators: ["Depth of insight", "Balanced perspective"],
          rationale: "Developing metacognitive awareness and balanced thinking"
        },
        hard: {
          title: "Values-Based Life Review",
          description: "Conduct a deep reflection on how your recent actions align with your core values.",
          criteria: ["Identify top 5 values", "Analyze alignment in 3 life areas", "Create action plan"],
          hints: ["Use values clarification exercises", "Consider work, relationships, personal growth"],
          qualityIndicators: ["Values clarity", "Insight depth", "Action orientation"],
          rationale: "Promoting values-based living and authentic self-direction"
        }
      },
      practice: {
        easy: {
          title: "Basic Breathing Exercise",
          description: "Practice 4-7-8 breathing for 5 minutes daily.",
          criteria: ["Practice for 5 consecutive days", "Track comfort level"],
          hints: ["Start with 3 cycles", "Practice same time daily"],
          qualityIndicators: ["Consistency", "Relaxation level"],
          rationale: "Building foundational stress management skills"
        },
        medium: {
          title: "Progressive Muscle Relaxation",
          description: "Complete 15-minute PMR sessions focusing on muscle tension release.",
          criteria: ["Complete 3 sessions", "Notice tension differences", "Rate relaxation level"],
          hints: ["Follow guided audio", "Focus on tension-release contrast"],
          qualityIndicators: ["Body awareness", "Relaxation improvement"],
          rationale: "Developing body awareness and stress reduction techniques"
        },
        hard: {
          title: "Mindful Problem-Solving Practice",
          description: "Apply mindfulness techniques to a current life challenge.",
          criteria: ["Choose specific problem", "Apply 6-step mindful process", "Implement solution"],
          hints: ["Define problem clearly", "Generate multiple solutions mindfully"],
          qualityIndicators: ["Problem clarity", "Solution creativity", "Implementation follow-through"],
          rationale: "Integrating mindfulness with practical problem-solving skills"
        }
      },
      skill_building: {
        easy: {
          title: "Positive Self-Talk Practice",
          description: "Replace one negative thought daily with a balanced, realistic alternative.",
          criteria: ["Identify 5 negative thoughts", "Create balanced alternatives", "Practice daily"],
          hints: ["Use thought record format", "Focus on realistic, not just positive"],
          qualityIndicators: ["Thought awareness", "Reframing quality"],
          rationale: "Building cognitive flexibility and self-compassion"
        },
        medium: {
          title: "Social Connection Building",
          description: "Initiate meaningful conversations with 3 different people this week.",
          criteria: ["3 conversations", "Ask follow-up questions", "Share something personal"],
          hints: ["Start with open-ended questions", "Listen actively"],
          qualityIndicators: ["Conversation depth", "Connection quality"],
          rationale: "Enhancing social skills and building support networks"
        },
        hard: {
          title: "Conflict Resolution Skills",
          description: "Practice assertive communication in a challenging relationship situation.",
          criteria: ["Identify specific situation", "Use I-statements", "Seek win-win solution"],
          hints: ["Prepare key points beforehand", "Stay calm and respectful"],
          qualityIndicators: ["Communication clarity", "Mutual understanding", "Relationship improvement"],
          rationale: "Developing advanced interpersonal skills and emotional regulation"
        }
      }
    };
  }

  private static personalizeAssignment(template: any, userState: any, planContext: any) {
    // Add personalization based on user's recent moods, preferences, and plan goals
    let personalizedTitle = template.title;
    let personalizedDescription = template.description;
    let personalizedRationale = template.rationale;

    // Adapt based on stress level
    if (userState.stressLevel > 7) {
      personalizedDescription += " Take breaks as needed and be gentle with yourself.";
      personalizedRationale += " Modified for current stress level.";
    }

    // Adapt based on recent mood patterns
    if (userState.avgMood < 5) {
      personalizedDescription += " Focus on small wins and celebrate progress.";
    }

    return {
      title: personalizedTitle,
      description: personalizedDescription,
      criteria: template.criteria,
      hints: template.hints,
      qualityIndicators: template.qualityIndicators,
      rationale: personalizedRationale
    };
  }

  private static async saveAssignments(assignments: Partial<SmartAssignment>[]): Promise<SmartAssignment[]> {
    const { data, error } = await supabase
      .from('therapy_assignments')
      .insert(assignments.map(a => ({
        user_id: a.user_id!,
        therapy_plan_id: a.therapy_plan_id!,
        title: a.title!,
        description: a.description!,
        assignment_type: a.assignment_type!,
        difficulty_level: a.difficulty_level!,
        estimated_duration_minutes: a.estimated_duration_minutes!,
        due_date: a.due_date!
      })))
      .select();

    if (error) throw error;
    return data as any;
  }

  private static calculateCompletionRate(assignments: any[]): number {
    if (assignments.length === 0) return 0.5; // Default
    const completed = assignments.filter(a => a.completed_at).length;
    return completed / assignments.length;
  }

  private static calculateAverageMood(moods: any[]): number {
    if (moods.length === 0) return 5; // Default
    return moods.reduce((sum, mood) => sum + mood.overall, 0) / moods.length;
  }

  private static inferPreferredDifficulty(completedAssignments: any[]): 'easy' | 'medium' | 'hard' {
    const difficultyCount = completedAssignments.reduce((acc, assignment) => {
      acc[assignment.difficulty_level] = (acc[assignment.difficulty_level] || 0) + 1;
      return acc;
    }, {});

    const maxDifficulty = Object.entries(difficultyCount).reduce((a, b) => 
      difficultyCount[a[0]] > difficultyCount[b[0]] ? a : b
    );

    return maxDifficulty?.[0] as any || 'medium';
  }

  private static calculateCurrentStressLevel(recentMoods: any[]): number {
    if (recentMoods.length === 0) return 5;
    
    // Use energy levels as stress indicator (inverse relationship)
    const avgEnergy = recentMoods.reduce((sum, mood) => sum + (mood.energy || 5), 0) / recentMoods.length;
    return Math.max(1, Math.min(10, 11 - avgEnergy)); // Invert energy to get stress
  }

  private static inferMotivationLevel(assignments: any[], sessions: any[]): number {
    let motivationScore = 5; // Base

    // Recent completion rate affects motivation
    const recentCompletions = assignments.slice(0, 5);
    const recentCompletionRate = this.calculateCompletionRate(recentCompletions);
    motivationScore += (recentCompletionRate - 0.5) * 4; // -2 to +2 adjustment

    // Session attendance affects motivation
    if (sessions.length > 0) {
      motivationScore += 1; // Active in therapy
    }

    return Math.max(1, Math.min(10, motivationScore));
  }

  /**
   * Track assignment progress and provide adaptive feedback
   */
  static async trackAssignmentProgress(
    assignmentId: string,
    progressData: AssignmentProgress
  ): Promise<{ adaptations: string[]; encouragement: string; nextSteps: string[] }> {
    try {
      // Store progress data
      // Note: In full implementation, you'd have a progress tracking table
      
      // Generate adaptive feedback
      const adaptations = [];
      let encouragement = "You're making progress! ";
      const nextSteps = [];

      if (progressData.completion_percentage < 0.3) {
        adaptations.push("Consider breaking the assignment into smaller steps");
        adaptations.push("Try shorter practice sessions");
        encouragement = "Every small step counts! ";
      } else if (progressData.completion_percentage > 0.8) {
        encouragement = "Excellent progress! ";
        nextSteps.push("Consider advancing to a more challenging variation");
        nextSteps.push("Reflect on what made this successful");
      }

      if (progressData.struggles.length > 2) {
        adaptations.push("Focus on one struggle at a time");
        nextSteps.push("Discuss challenges in next therapy session");
      }

      if (progressData.quality_score > 8) {
        encouragement += "Your commitment is really showing!";
        nextSteps.push("Share your successful strategies with others");
      }

      return { adaptations, encouragement, nextSteps };
    } catch (error) {
      console.error('Error tracking assignment progress:', error);
      throw error;
    }
  }

  /**
   * Generate next set of assignments based on current progress
   */
  static async generateNextAssignments(
    userId: string,
    completedAssignmentId: string
  ): Promise<SmartAssignment[]> {
    try {
      // Analyze completed assignment
      const { data: completedAssignment } = await supabase
        .from('therapy_assignments')
        .select('*')
        .eq('id', completedAssignmentId)
        .single();

      if (!completedAssignment) throw new Error('Assignment not found');

      // Get updated user state
      const userState = await this.analyzeUserState(userId);
      
      // Generate evolved assignments
      const nextAssignments = await this.generateAdaptiveAssignments(
        userId,
        completedAssignment.therapy_plan_id,
        'continuing', // Phase continuation
        userState
      );

      return nextAssignments;
    } catch (error) {
      console.error('Error generating next assignments:', error);
      throw error;
    }
  }
}