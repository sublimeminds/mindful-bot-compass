
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'mental-health' | 'habit-building' | 'therapy-specific' | 'personal-growth';
  type: 'habit' | 'milestone' | 'outcome';
  targetValue: number;
  currentProgress: number;
  unit: string; // e.g., 'sessions', 'days', 'points'
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
  private static goals: Goal[] = [];
  private static goalProgress: GoalProgress[] = [];
  private static achievements: Achievement[] = [];

  // Goal Templates
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

  static async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'milestones'>, milestones?: Omit<GoalMilestone, 'id' | 'goalId'>[]): Promise<Goal> {
    const goal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      milestones: milestones?.map(m => ({
        ...m,
        id: Date.now().toString() + Math.random(),
        goalId: Date.now().toString(),
        isCompleted: false
      })) || []
    };
    
    this.goals.push(goal);
    return goal;
  }

  static async createGoalFromTemplate(templateId: string, userId: string, customizations?: Partial<Goal>): Promise<Goal> {
    const template = this.goalTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const goal: Goal = {
      id: Date.now().toString(),
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
      priority: customizations?.priority || 'medium',
      tags: [...template.tags, ...(customizations?.tags || [])],
      notes: customizations?.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      milestones: template.milestoneTemplates.map(mt => ({
        id: Date.now().toString() + Math.random(),
        goalId: Date.now().toString(),
        title: mt.title,
        description: mt.description,
        targetValue: mt.targetValue,
        isCompleted: false,
        reward: mt.reward
      }))
    };

    this.goals.push(goal);
    return goal;
  }

  static getGoals(userId: string): Goal[] {
    return this.goals.filter(goal => goal.userId === userId);
  }

  static getGoalTemplates(): GoalTemplate[] {
    return this.goalTemplates;
  }

  static async updateGoalProgress(goalId: string, progress: number, note?: string): Promise<Goal | null> {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return null;

    const oldProgress = goal.currentProgress;
    goal.currentProgress = progress;
    goal.updatedAt = new Date();

    // Record progress entry
    this.goalProgress.push({
      goalId,
      date: new Date(),
      value: progress,
      note
    });

    // Check for milestone completions
    goal.milestones.forEach(milestone => {
      if (!milestone.isCompleted && progress >= milestone.targetValue) {
        milestone.isCompleted = true;
        milestone.completedAt = new Date();
        this.checkAchievements(goal.userId);
      }
    });

    // Check if goal is completed
    if (!goal.isCompleted && progress >= goal.targetValue) {
      goal.isCompleted = true;
      this.checkAchievements(goal.userId);
    }

    return goal;
  }

  static getGoalProgress(goalId: string): GoalProgress[] {
    return this.goalProgress.filter(p => p.goalId === goalId).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  static getGoalInsights(userId: string) {
    const userGoals = this.getGoals(userId);
    const completedGoals = userGoals.filter(g => g.isCompleted);
    const activeGoals = userGoals.filter(g => !g.isCompleted);
    
    const totalMilestones = userGoals.reduce((sum, g) => sum + g.milestones.length, 0);
    const completedMilestones = userGoals.reduce((sum, g) => sum + g.milestones.filter(m => m.isCompleted).length, 0);

    const categoryProgress = userGoals.reduce((acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = { total: 0, completed: 0 };
      }
      acc[goal.category].total++;
      if (goal.isCompleted) acc[goal.category].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return {
      totalGoals: userGoals.length,
      completedGoals: completedGoals.length,
      activeGoals: activeGoals.length,
      completionRate: userGoals.length > 0 ? (completedGoals.length / userGoals.length) * 100 : 0,
      totalMilestones,
      completedMilestones,
      milestoneCompletionRate: totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0,
      categoryProgress,
      streakDays: this.calculateStreakDays(userId),
      achievements: this.getUnlockedAchievements(userId)
    };
  }

  private static calculateStreakDays(userId: string): number {
    const userGoals = this.getGoals(userId);
    const dailyGoals = userGoals.filter(g => g.tags.includes('daily') && g.type === 'habit');
    
    if (dailyGoals.length === 0) return 0;

    // Simple streak calculation - in a real app, this would be more sophisticated
    const recentProgress = this.goalProgress
      .filter(p => dailyGoals.some(g => g.id === p.goalId))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasProgressToday = recentProgress.some(p => 
        p.date >= dayStart && p.date <= dayEnd
      );

      if (hasProgressToday) {
        streak++;
      } else if (streak > 0) {
        break; // Streak broken
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private static checkAchievements(userId: string): void {
    const insights = this.getGoalInsights(userId);
    
    // Check for new achievements
    if (insights.completedGoals >= 1 && !this.hasAchievement(userId, 'first-goal')) {
      this.unlockAchievement(userId, {
        id: 'first-goal',
        title: 'Goal Getter',
        description: 'Complete your first goal',
        icon: 'target',
        type: 'goal-completion',
        criteria: {},
        isUnlocked: true,
        unlockedAt: new Date()
      });
    }

    if (insights.streakDays >= 7 && !this.hasAchievement(userId, 'week-streak')) {
      this.unlockAchievement(userId, {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'fire',
        type: 'streak',
        criteria: { streakDays: 7 },
        isUnlocked: true,
        unlockedAt: new Date()
      });
    }
  }

  private static hasAchievement(userId: string, achievementId: string): boolean {
    return this.achievements.some(a => a.id === achievementId && a.isUnlocked);
  }

  private static unlockAchievement(userId: string, achievement: Achievement): void {
    this.achievements.push(achievement);
  }

  static getUnlockedAchievements(userId: string): Achievement[] {
    return this.achievements.filter(a => a.isUnlocked);
  }

  static async deleteGoal(goalId: string): Promise<boolean> {
    const index = this.goals.findIndex(g => g.id === goalId);
    if (index === -1) return false;
    
    this.goals.splice(index, 1);
    this.goalProgress = this.goalProgress.filter(p => p.goalId !== goalId);
    return true;
  }
}
