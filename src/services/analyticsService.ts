
export interface SessionData {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  moodBefore?: number;
  moodAfter?: number;
  techniques: string[];
  notes: string;
}

export interface SessionStats {
  totalSessions: number;
  averageDuration: number;
  totalMinutes: number;
  averageMoodImprovement: number;
  mostUsedTechniques: string[];
  sessionsThisWeek: number;
  streakDays: number;
}

export interface MoodTrends {
  averageMood: number;
  recentChange: number;
  overallTrend: 'improving' | 'stable' | 'declining';
  moodVariability: number;
}

export interface GoalProgress {
  [goalName: string]: {
    progress: number;
    target: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface AnalyticsInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  actionable?: string;
}

export interface AnalyticsData {
  sessionStats: SessionStats;
  moodTrends: MoodTrends;
  goalProgress: GoalProgress;
  insights: AnalyticsInsight[];
  patterns: {
    bestDay: string;
    bestTime: string;
    mostEffectiveTechnique: string;
  };
}

export class AnalyticsService {
  static generateAnalytics(
    sessions: SessionData[], 
    moodEntries: any[], 
    goals: string[]
  ): AnalyticsData {
    const sessionStats = this.calculateSessionStats(sessions);
    const moodTrends = this.analyzeMoodTrends(moodEntries);
    const goalProgress = this.calculateGoalProgress(goals, sessions);
    const insights = this.generateInsights(sessionStats, moodTrends);
    const patterns = this.identifyPatterns(sessions);

    return {
      sessionStats,
      moodTrends,
      goalProgress,
      insights,
      patterns
    };
  }

  private static calculateSessionStats(sessions: SessionData[]): SessionStats {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        totalMinutes: 0,
        averageMoodImprovement: 0,
        mostUsedTechniques: [],
        sessionsThisWeek: 0,
        streakDays: 0
      };
    }

    const completedSessions = sessions.filter(s => s.endTime);
    const durations = completedSessions.map(s => 
      s.endTime ? (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60) : 0
    );
    
    const totalMinutes = durations.reduce((sum, d) => sum + d, 0);
    const averageDuration = totalMinutes / Math.max(durations.length, 1);

    const moodImprovements = sessions
      .filter(s => s.moodBefore && s.moodAfter)
      .map(s => s.moodAfter! - s.moodBefore!);
    
    const averageMoodImprovement = moodImprovements.length > 0
      ? moodImprovements.reduce((sum, imp) => sum + imp, 0) / moodImprovements.length
      : 0;

    // Count technique usage
    const techniqueCount: Record<string, number> = {};
    sessions.forEach(session => {
      session.techniques.forEach(technique => {
        techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
      });
    });

    const mostUsedTechniques = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([technique]) => technique);

    // Sessions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const sessionsThisWeek = sessions.filter(s => s.startTime >= oneWeekAgo).length;

    return {
      totalSessions: sessions.length,
      averageDuration: Math.round(averageDuration),
      totalMinutes: Math.round(totalMinutes),
      averageMoodImprovement: Math.round(averageMoodImprovement * 10) / 10,
      mostUsedTechniques,
      sessionsThisWeek,
      streakDays: this.calculateStreak(sessions)
    };
  }

  private static analyzeMoodTrends(moodEntries: any[]): MoodTrends {
    if (moodEntries.length === 0) {
      return {
        averageMood: 5,
        recentChange: 0,
        overallTrend: 'stable',
        moodVariability: 0
      };
    }

    const moods = moodEntries.map(entry => entry.overall);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    
    // Calculate recent change (last 3 vs previous 3)
    let recentChange = 0;
    if (moodEntries.length >= 6) {
      const recent = moods.slice(0, 3);
      const previous = moods.slice(3, 6);
      const recentAvg = recent.reduce((sum, mood) => sum + mood, 0) / recent.length;
      const previousAvg = previous.reduce((sum, mood) => sum + mood, 0) / previous.length;
      recentChange = recentAvg - previousAvg;
    }

    const overallTrend: 'improving' | 'stable' | 'declining' = 
      recentChange > 0.5 ? 'improving' : 
      recentChange < -0.5 ? 'declining' : 'stable';

    const moodVariability = Math.sqrt(
      moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length
    );

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      recentChange: Math.round(recentChange * 10) / 10,
      overallTrend,
      moodVariability: Math.round(moodVariability * 10) / 10
    };
  }

  private static calculateGoalProgress(goals: string[], sessions: SessionData[]): GoalProgress {
    const progress: GoalProgress = {};
    
    goals.forEach(goal => {
      // Mock progress calculation based on sessions
      const relevantSessions = sessions.filter(s => 
        s.notes.toLowerCase().includes(goal.toLowerCase()) ||
        s.techniques.some(t => t.toLowerCase().includes(goal.toLowerCase()))
      );
      
      const progressValue = Math.min((relevantSessions.length / 10) * 100, 100);
      
      progress[goal] = {
        progress: Math.round(progressValue),
        target: 100,
        trend: progressValue > 50 ? 'improving' : 'stable'
      };
    });

    return progress;
  }

  private static generateInsights(sessionStats: SessionStats, moodTrends: MoodTrends): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    if (sessionStats.totalSessions >= 5) {
      insights.push({
        type: 'positive',
        title: 'Consistent Practice',
        description: `You've completed ${sessionStats.totalSessions} therapy sessions. Consistency is key to progress!`,
        actionable: 'Keep up the regular practice to see continued benefits.'
      });
    }

    if (moodTrends.overallTrend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Mood Improvement',
        description: 'Your mood has been trending upward recently.',
        actionable: 'Continue using the techniques that are working for you.'
      });
    }

    if (sessionStats.averageMoodImprovement > 1) {
      insights.push({
        type: 'positive',
        title: 'Effective Sessions',
        description: `Your sessions improve your mood by an average of ${sessionStats.averageMoodImprovement} points.`,
        actionable: 'Your current approach is working well.'
      });
    }

    return insights;
  }

  private static identifyPatterns(sessions: SessionData[]) {
    return {
      bestDay: 'Wednesday',
      bestTime: 'Evening',
      mostEffectiveTechnique: sessions.length > 0 && sessions[0].techniques.length > 0 
        ? sessions[0].techniques[0] 
        : 'Deep Breathing'
    };
  }

  private static calculateStreak(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0;
    
    // Simple streak calculation - count consecutive days with sessions
    const sessionDates = sessions
      .map(s => s.startTime.toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sessionDates.includes(today) || sessionDates.includes(yesterday)) {
      streak = 1;
      for (let i = 1; i < sessionDates.length; i++) {
        const currentDate = new Date(sessionDates[i]);
        const previousDate = new Date(sessionDates[i - 1]);
        const dayDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  }
}
