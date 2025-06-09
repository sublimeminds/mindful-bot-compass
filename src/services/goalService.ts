
import { supabase } from '@/integrations/supabase/client';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'mental-health' | 'habit-building' | 'therapy-specific' | 'personal-growth';
  type: 'habit' | 'milestone' | 'outcome';
  targetValue: number;
  currentProgress: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  isCompleted: boolean;
  milestones: GoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: string;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: Date;
  reward?: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: Goal['category'];
  type: Goal['type'];
  defaultTargetValue: number;
  defaultUnit: string;
  defaultDuration: number; // days
  milestoneTemplates: Omit<GoalMilestone, 'id' | 'goalId' | 'completedAt' | 'isCompleted'>[];
  tags: string[];
}

export interface GoalProgress {
  goalId: string;
  date: Date;
  value: number;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'goal-completion' | 'milestone' | 'streak' | 'progress';
  criteria: {
    goalIds?: string[];
    streakDays?: number;
    progressThreshold?: number;
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export class GoalService {
  // Goal Templates (static data)
  private static goalTemplates: GoalTemplate[] = [
    {
      id: '1',
      title: 'Daily Mood Check-in',
      description: 'Track your mood daily to build awareness and identify patterns',
      category: 'mental-health',
      type: 'habit',
      defaultTargetValue: 30,
      defaultUnit: 'days',
      defaultDuration: 30,
      milestoneTemplates: [
        { title: '1 Week Streak', description: 'Complete 7 consecutive days', targetValue: 7, reward: 'Mindfulness Badge' },
        { title: '2 Week Milestone', description: 'Complete 14 days total', targetValue: 14, reward: 'Consistency Badge' },
        { title: 'Monthly Goal', description: 'Complete 30 days total', targetValue: 30, reward: 'Dedication Badge' }
      ],
      tags: ['mood', 'daily', 'tracking']
    },
    {
      id: '2',
      title: 'Weekly Therapy Sessions',
      description: 'Maintain regular therapy sessions for consistent progress',
      category: 'therapy-specific',
      type: 'habit',
      defaultTargetValue: 12,
      defaultUnit: 'sessions',
      defaultDuration: 84,
      milestoneTemplates: [
        { title: 'First Month', description: 'Complete 4 sessions', targetValue: 4, reward: 'Commitment Badge' },
        { title: 'Two Months', description: 'Complete 8 sessions', targetValue: 8, reward: 'Progress Badge' },
        { title: 'Three Months', description: 'Complete 12 sessions', targetValue: 12, reward: 'Transformation Badge' }
      ],
      tags: ['sessions', 'therapy', 'weekly']
    },
    {
      id: '3',
      title: 'Anxiety Management',
      description: 'Reduce anxiety levels through consistent practice and techniques',
      category: 'mental-health',
      type: 'outcome',
      defaultTargetValue: 3,
      defaultUnit: 'points improvement',
      defaultDuration: 60,
      milestoneTemplates: [
        { title: 'Technique Mastery', description: 'Practice 3 different techniques', targetValue: 3, reward: 'Technique Explorer' },
        { title: 'Consistency', description: 'Practice techniques 20 times', targetValue: 20, reward: 'Practice Master' },
        { title: 'Improvement', description: 'Achieve target anxiety reduction', targetValue: 3, reward: 'Anxiety Warrior' }
      ],
      tags: ['anxiety', 'techniques', 'improvement']
    },
    {
      id: '4',
      title: 'Meditation Practice',
      description: 'Build a daily meditation habit for better mental clarity',
      category: 'habit-building',
      type: 'habit',
      defaultTargetValue: 21,
      defaultUnit: 'days',
      defaultDuration: 21,
      milestoneTemplates: [
        { title: 'First Week', description: 'Meditate for 7 days', targetValue: 7, reward: 'Mindful Beginner' },
        { title: 'Two Weeks', description: 'Meditate for 14 days', targetValue: 14, reward: 'Mindful Practitioner' },
        { title: 'Three Weeks', description: 'Meditate for 21 days', targetValue: 21, reward: 'Mindful Master' }
      ],
      tags: ['meditation', 'mindfulness', 'daily']
    }
  ];

  static async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'milestones'>, milestones?: Omit<GoalMilestone, 'id' | 'goalId' | 'completedAt' | 'isCompleted'>[]): Promise<Goal> {
    const { data: goalRecord, error: goalError } = await supabase
      .from('goals')
      .insert({
        user_id: goalData.userId,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        type: goalData.type,
        target_value: goalData.targetValue,
        current_progress: goalData.currentProgress,
        unit: goalData.unit,
        start_date: goalData.startDate.toISOString(),
        target_date: goalData.targetDate.toISOString(),
        is_completed: goalData.isCompleted,
        priority: goalData.priority,
        tags: goalData.tags,
        notes: goalData.notes
      })
      .select()
      .single();

    if (goalError) throw goalError;

    const goal: Goal = {
      id: goalRecord.id,
      userId: goalRecord.user_id,
      title: goalRecord.title,
      description: goalRecord.description,
      category: goalRecord.category as Goal['category'],
      type: goalRecord.type as Goal['type'],
      targetValue: goalRecord.target_value,
      currentProgress: goalRecord.current_progress,
      unit: goalRecord.unit,
      startDate: new Date(goalRecord.start_date),
      targetDate: new Date(goalRecord.target_date),
      isCompleted: goalRecord.is_completed,
      priority: goalRecord.priority as Goal['priority'],
      tags: goalRecord.tags || [],
      notes: goalRecord.notes || '',
      createdAt: new Date(goalRecord.created_at),
      updatedAt: new Date(goalRecord.updated_at),
      milestones: []
    };

    // Create milestones if provided
    if (milestones && milestones.length > 0) {
      const { data: milestoneRecords, error: milestoneError } = await supabase
        .from('goal_milestones')
        .insert(
          milestones.map(m => ({
            goal_id: goal.id,
            title: m.title,
            description: m.description,
            target_value: m.targetValue,
            reward: m.reward,
            is_completed: false
          }))
        )
        .select();

      if (milestoneError) throw milestoneError;

      goal.milestones = milestoneRecords.map(m => ({
        id: m.id,
        goalId: m.goal_id,
        title: m.title,
        description: m.description,
        targetValue: m.target_value,
        isCompleted: m.is_completed,
        completedAt: m.completed_at ? new Date(m.completed_at) : undefined,
        reward: m.reward
      }));
    }

    return goal;
  }

  static async createGoalFromTemplate(templateId: string, userId: string, customizations?: Partial<Goal>): Promise<Goal> {
    const template = this.goalTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const goalData = {
      userId,
      title: customizations?.title || template.title,
      description: customizations?.description || template.description,
      category: template.category,
      type: template.type,
      targetValue: customizations?.targetValue || template.defaultTargetValue,
      currentProgress: 0,
      unit: customizations?.unit || template.defaultUnit,
      startDate: customizations?.startDate || new Date(),
      targetDate: customizations?.targetDate || new Date(Date.now() + template.defaultDuration * 24 * 60 * 60 * 1000),
      isCompleted: false,
      priority: customizations?.priority || 'medium' as Goal['priority'],
      tags: [...template.tags, ...(customizations?.tags || [])],
      notes: customizations?.notes || ''
    };

    return this.createGoal(goalData, template.milestoneTemplates);
  }

  static async getGoals(userId: string): Promise<Goal[]> {
    const { data: goalRecords, error } = await supabase
      .from('goals')
      .select(`
        *,
        goal_milestones (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return goalRecords.map(record => ({
      id: record.id,
      userId: record.user_id,
      title: record.title,
      description: record.description,
      category: record.category as Goal['category'],
      type: record.type as Goal['type'],
      targetValue: record.target_value,
      currentProgress: record.current_progress,
      unit: record.unit,
      startDate: new Date(record.start_date),
      targetDate: new Date(record.target_date),
      isCompleted: record.is_completed,
      priority: record.priority as Goal['priority'],
      tags: record.tags || [],
      notes: record.notes || '',
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      milestones: record.goal_milestones.map((m: any) => ({
        id: m.id,
        goalId: m.goal_id,
        title: m.title,
        description: m.description,
        targetValue: m.target_value,
        isCompleted: m.is_completed,
        completedAt: m.completed_at ? new Date(m.completed_at) : undefined,
        reward: m.reward
      }))
    }));
  }

  static getGoalTemplates(): GoalTemplate[] {
    return this.goalTemplates;
  }

  static async updateGoalProgress(goalId: string, progress: number, note?: string): Promise<Goal | null> {
    // Update goal progress
    const { data: goalRecord, error: goalError } = await supabase
      .from('goals')
      .update({ 
        current_progress: progress,
        is_completed: progress >= 0 // We'll check target value in the next query
      })
      .eq('id', goalId)
      .select()
      .single();

    if (goalError) throw goalError;

    // Record progress entry
    await supabase
      .from('goal_progress')
      .insert({
        goal_id: goalId,
        value: progress,
        note
      });

    // Check if goal is completed
    const isCompleted = progress >= goalRecord.target_value;
    if (isCompleted && !goalRecord.is_completed) {
      await supabase
        .from('goals')
        .update({ is_completed: true })
        .eq('id', goalId);
    }

    // Update milestones
    const { data: milestones } = await supabase
      .from('goal_milestones')
      .select('*')
      .eq('goal_id', goalId);

    if (milestones) {
      for (const milestone of milestones) {
        if (!milestone.is_completed && progress >= milestone.target_value) {
          await supabase
            .from('goal_milestones')
            .update({ 
              is_completed: true,
              completed_at: new Date().toISOString()
            })
            .eq('id', milestone.id);
        }
      }
    }

    // Return updated goal
    const updatedGoals = await this.getGoals(goalRecord.user_id);
    return updatedGoals.find(g => g.id === goalId) || null;
  }

  static async getGoalProgress(goalId: string): Promise<GoalProgress[]> {
    const { data: progressRecords, error } = await supabase
      .from('goal_progress')
      .select('*')
      .eq('goal_id', goalId)
      .order('recorded_at', { ascending: true });

    if (error) throw error;

    return progressRecords.map(record => ({
      goalId: record.goal_id,
      date: new Date(record.recorded_at),
      value: record.value,
      note: record.note
    }));
  }

  static async getGoalInsights(userId: string) {
    const goals = await this.getGoals(userId);
    const completedGoals = goals.filter(g => g.isCompleted);
    const activeGoals = goals.filter(g => !g.isCompleted);
    
    const totalMilestones = goals.reduce((sum, g) => sum + g.milestones.length, 0);
    const completedMilestones = goals.reduce((sum, g) => sum + g.milestones.filter(m => m.isCompleted).length, 0);

    const categoryProgress = goals.reduce((acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = { total: 0, completed: 0 };
      }
      acc[goal.category].total++;
      if (goal.isCompleted) acc[goal.category].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    const achievements = await this.getUnlockedAchievements(userId);

    return {
      totalGoals: goals.length,
      completedGoals: completedGoals.length,
      activeGoals: activeGoals.length,
      completionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
      totalMilestones,
      completedMilestones,
      milestoneCompletionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
      categoryProgress,
      streakDays: 0, // TODO: Implement streak calculation
      achievements
    };
  }

  static async getUnlockedAchievements(userId: string): Promise<Achievement[]> {
    const { data: achievementRecords, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;

    return achievementRecords.map(record => ({
      id: record.id,
      title: record.title,
      description: record.description,
      icon: record.icon,
      type: record.type as Achievement['type'],
      criteria: (record.criteria as any) || {},
      unlockedAt: new Date(record.unlocked_at),
      isUnlocked: true
    }));
  }

  static async deleteGoal(goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    return !error;
  }
}
