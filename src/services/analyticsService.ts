
import { MoodEntry } from '@/services/moodTrackingService';

// Define SessionData locally since it's not exported from SessionContext
export interface SessionData {
  id: string;
  startTime: Date;
  endTime?: Date;
  notes: string;
  techniques: string[];
}

export interface AnalyticsData {
  sessionStats: {
    totalSessions: number;
    averageDuration: number;
    longestStreak: number;
    currentStreak: number;
    weeklyAverage: number;
  };
  moodTrends: {
    overallTrend: 'improving' | 'stable' | 'declining';
    averageMood: number;
    moodVariability: number;
    recentChange: number;
  };
  goalProgress: {
    [goalName: string]: {
      progress: number;
      target: number;
      trend: 'improving' | 'stable' | 'declining';
      lastUpdated: Date;
    };
  };
  insights: {
    type: 'achievement' | 'suggestion' | 'concern' | 'milestone';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionable?: string;
  }[];
  patterns: {
    bestDayOfWeek: string;
    bestTimeOfDay: string;
    mostEffectiveTechniques: string[];
    commonTriggers: string[];
  };
}

export class AnalyticsService {
  static generateAnalytics(
    sessions: SessionData[],
    moodEntries: MoodEntry[],
    goals: string[]
  ): AnalyticsData {
    const sessionStats = this.calculateSessionStats(sessions);
    const moodTrends = this.calculateMoodTrends(moodEntries);
    const goalProgress = this.calculateGoalProgress(sessions, goals);
    const insights = this.generateInsights(sessions, moodEntries, sessionStats, moodTrends);
    const patterns = this.identifyPatterns(sessions, moodEntries);

    return {
      sessionStats,
      moodTrends,
      goalProgress,
      insights,
      patterns
    };
  }

  private static calculateSessionStats(sessions: SessionData[]) {
    const completedSessions = sessions.filter(s => s.endTime);
    const totalSessions = completedSessions.length;

    const durations = completedSessions.map(s => {
      if (!s.endTime) return 0;
      return (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60); // minutes
    });

    const averageDuration = durations.length > 0 
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length 
      : 0;

    const { longestStreak, currentStreak } = this.calculateStreaks(completedSessions);
    const weeklyAverage = this.calculateWeeklyAverage(completedSessions);

    return {
      totalSessions,
      averageDuration,
      longestStreak,
      currentStreak,
      weeklyAverage
    };
  }

  private static calculateMoodTrends(moodEntries: MoodEntry[]) {
    if (moodEntries.length === 0) {
      return {
        overallTrend: 'stable' as const,
        averageMood: 5,
        moodVariability: 0,
        recentChange: 0
      };
    }

    const recentEntries = moodEntries.slice(-30); // Last 30 entries
    const moods = recentEntries.map(entry => entry.overall);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;

    // Calculate trend
    const firstHalf = moods.slice(0, Math.floor(moods.length / 2));
    const secondHalf = moods.slice(Math.floor(moods.length / 2));
    const firstAvg = firstHalf.reduce((sum, mood) => sum + mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, mood) => sum + mood, 0) / secondHalf.length;
    const recentChange = secondAvg - firstAvg;

    let overallTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentChange > 0.5) overallTrend = 'improving';
    else if (recentChange < -0.5) overallTrend = 'declining';

    // Calculate variability (standard deviation)
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length;
    const moodVariability = Math.sqrt(variance);

    return {
      overallTrend,
      averageMood,
      moodVariability,
      recentChange
    };
  }

  private static calculateGoalProgress(sessions: SessionData[], goals: string[]) {
    const goalProgress: AnalyticsData['goalProgress'] = {};

    goals.forEach(goal => {
      // Mock progress calculation - in real app, this would be based on actual goal tracking
      const relatedSessions = sessions.filter(s => 
        s.notes.toLowerCase().includes(goal.toLowerCase()) ||
        s.techniques.some(t => t.toLowerCase().includes(goal.toLowerCase()))
      );

      const progress = Math.min(relatedSessions.length * 10, 100); // Mock calculation
      const target = 100;
      const trend = progress > 50 ? 'improving' : 'stable';

      goalProgress[goal] = {
        progress,
        target,
        trend,
        lastUpdated: new Date()
      };
    });

    return goalProgress;
  }

  private static generateInsights(
    sessions: SessionData[],
    moodEntries: MoodEntry[],
    sessionStats: any,
    moodTrends: any
  ) {
    const insights: AnalyticsData['insights'] = [];

    // Session frequency insights
    if (sessionStats.currentStreak >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Consistency Champion',
        description: `You've maintained a ${sessionStats.currentStreak}-day therapy streak!`,
        priority: 'high'
      });
    } else if (sessionStats.weeklyAverage < 2) {
      insights.push({
        type: 'suggestion',
        title: 'Increase Session Frequency',
        description: 'Consider scheduling more regular therapy sessions for better progress.',
        priority: 'medium',
        actionable: 'Try to aim for 3-4 sessions per week'
      });
    }

    // Mood insights
    if (moodTrends.overallTrend === 'improving') {
      insights.push({
        type: 'achievement',
        title: 'Mood Improvement',
        description: 'Your mood has been steadily improving over the past month.',
        priority: 'high'
      });
    } else if (moodTrends.overallTrend === 'declining') {
      insights.push({
        type: 'concern',
        title: 'Mood Decline Detected',
        description: 'Your mood has been declining recently. Consider reaching out for support.',
        priority: 'high',
        actionable: 'Schedule a session to discuss recent challenges'
      });
    }

    // Technique effectiveness
    const allTechniques = sessions.flatMap(s => s.techniques);
    const techniqueCount = allTechniques.reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedTechnique = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostUsedTechnique && mostUsedTechnique[1] >= 3) {
      insights.push({
        type: 'milestone',
        title: 'Technique Mastery',
        description: `You've practiced ${mostUsedTechnique[0]} multiple times. Great consistency!`,
        priority: 'medium'
      });
    }

    return insights.slice(0, 5); // Return top 5 insights
  }

  private static identifyPatterns(sessions: SessionData[], moodEntries: MoodEntry[]) {
    // Calculate best day of week
    const dayCount = Array(7).fill(0);
    sessions.forEach(session => {
      dayCount[session.startTime.getDay()]++;
    });
    const bestDayIndex = dayCount.indexOf(Math.max(...dayCount));
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bestDayOfWeek = days[bestDayIndex];

    // Calculate best time of day
    const hourCount = Array(24).fill(0);
    sessions.forEach(session => {
      hourCount[session.startTime.getHours()]++;
    });
    const bestHourIndex = hourCount.indexOf(Math.max(...hourCount));
    const bestTimeOfDay = `${bestHourIndex}:00`;

    // Most effective techniques
    const allTechniques = sessions.flatMap(s => s.techniques);
    const techniqueCount = allTechniques.reduce((acc, tech) => {
      acc[tech] = (acc[tech] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostEffectiveTechniques = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tech]) => tech);

    // Common triggers (mock data)
    const commonTriggers = ['Work stress', 'Social anxiety', 'Sleep issues'];

    return {
      bestDayOfWeek,
      bestTimeOfDay,
      mostEffectiveTechniques,
      commonTriggers
    };
  }

  private static calculateStreaks(sessions: SessionData[]) {
    const sortedSessions = sessions
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    let longestStreak = 0;
    let currentStreak = 0;
    let lastSessionDate: Date | null = null;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startTime.toDateString());
      
      if (!lastSessionDate) {
        currentStreak = 1;
      } else {
        const dayDiff = (sessionDate.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          currentStreak++;
        } else if (dayDiff > 1) {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
      
      lastSessionDate = sessionDate;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // Check if current streak is still active (session within last 2 days)
    const today = new Date();
    if (lastSessionDate) {
      const daysSinceLastSession = (today.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSession > 2) {
        currentStreak = 0;
      }
    }

    return { longestStreak, currentStreak };
  }

  private static calculateWeeklyAverage(sessions: SessionData[]) {
    if (sessions.length === 0) return 0;

    const weeks = 4; // Last 4 weeks
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - (weeks * 7));

    const recentSessions = sessions.filter(s => s.startTime >= weeksAgo);
    return recentSessions.length / weeks;
  }
}
