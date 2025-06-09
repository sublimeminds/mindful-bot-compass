
export interface DetailedMood {
  overall: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  depression: number; // 1-10 scale
  stress: number; // 1-10 scale
  energy: number; // 1-10 scale
  sleep_quality?: number; // 1-10 scale
  social_connection?: number; // 1-10 scale
}

export interface MoodEntry {
  id: string;
  userId: string;
  timestamp: Date;
  mood: DetailedMood;
  overall: number; // Add this for backward compatibility
  anxiety: number; // Add this for backward compatibility
  energy: number; // Add this for backward compatibility
  activities?: string[];
  notes?: string;
  weather?: string;
  triggers?: string[];
}

export interface MoodPattern {
  trend: 'improving' | 'declining' | 'stable';
  averageChange: number;
  bestTime: string;
  worstTime: string;
  topTriggers: string[];
  helpfulActivities: string[];
}

export interface MoodCorrelation {
  activity: string;
  impact: number; // -1 to 1, negative means worsens mood
  confidence: number; // 0 to 1
  occurrences: number;
}

export class MoodTrackingService {
  static getMoodCategories() {
    return [
      { key: 'overall', label: 'Overall Mood', color: 'blue' },
      { key: 'anxiety', label: 'Anxiety Level', color: 'red' },
      { key: 'depression', label: 'Depression', color: 'purple' },
      { key: 'stress', label: 'Stress Level', color: 'orange' },
      { key: 'energy', label: 'Energy Level', color: 'green' },
      { key: 'sleep_quality', label: 'Sleep Quality', color: 'indigo' },
      { key: 'social_connection', label: 'Social Connection', color: 'pink' }
    ];
  }

  static getCommonActivities() {
    return [
      'Exercise', 'Meditation', 'Work', 'Socializing', 'Reading',
      'Watching TV', 'Gaming', 'Cooking', 'Walking', 'Music',
      'Art/Crafts', 'Learning', 'Cleaning', 'Shopping', 'Sleep'
    ];
  }

  static getCommonTriggers() {
    return [
      'Work Stress', 'Relationship Issues', 'Financial Concerns', 'Health Issues',
      'Family Problems', 'Social Situations', 'Weather', 'News/Media',
      'Lack of Sleep', 'Poor Diet', 'Isolation', 'Overwhelm'
    ];
  }

  static async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    // Mock implementation for now - in real app this would query Supabase
    const mockEntries: MoodEntry[] = [
      {
        id: '1',
        userId,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        mood: { overall: 6, anxiety: 4, depression: 3, stress: 5, energy: 7, sleep_quality: 6, social_connection: 5 },
        overall: 6,
        anxiety: 4,
        energy: 7,
        activities: ['Exercise', 'Work', 'Reading'],
        triggers: ['Work Stress'],
        notes: 'Had a good workout in the morning'
      },
      {
        id: '2',
        userId,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mood: { overall: 8, anxiety: 2, depression: 2, stress: 3, energy: 8, sleep_quality: 8, social_connection: 7 },
        overall: 8,
        anxiety: 2,
        energy: 8,
        activities: ['Socializing', 'Meditation', 'Cooking'],
        triggers: [],
        notes: 'Great day with friends, felt very connected'
      },
      {
        id: '3',
        userId,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        mood: { overall: 4, anxiety: 7, depression: 5, stress: 8, energy: 3, sleep_quality: 4, social_connection: 3 },
        overall: 4,
        anxiety: 7,
        energy: 3,
        activities: ['Work'],
        triggers: ['Work Stress', 'Lack of Sleep'],
        notes: 'Difficult day at work, stayed up too late'
      }
    ];
    
    return mockEntries;
  }

  static analyzeMoodPatterns(moodEntries: MoodEntry[]): MoodPattern {
    if (moodEntries.length < 2) {
      return {
        trend: 'stable',
        averageChange: 0,
        bestTime: 'morning',
        worstTime: 'evening',
        topTriggers: [],
        helpfulActivities: []
      };
    }

    // Sort by timestamp
    const sortedEntries = [...moodEntries].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Calculate trend
    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const overallChange = lastEntry.overall - firstEntry.overall;
    const averageChange = overallChange / sortedEntries.length;

    let trend: 'improving' | 'declining' | 'stable';
    if (averageChange > 0.5) trend = 'improving';
    else if (averageChange < -0.5) trend = 'declining';
    else trend = 'stable';

    // Analyze time patterns
    const timeAnalysis = this.analyzeTimePatterns(sortedEntries);
    
    // Analyze triggers and activities
    const triggerAnalysis = this.analyzeTriggers(sortedEntries);
    const activityAnalysis = this.analyzeActivities(sortedEntries);

    return {
      trend,
      averageChange,
      bestTime: timeAnalysis.bestTime,
      worstTime: timeAnalysis.worstTime,
      topTriggers: triggerAnalysis.slice(0, 3),
      helpfulActivities: activityAnalysis.slice(0, 3)
    };
  }

  private static analyzeTimePatterns(entries: MoodEntry[]) {
    const timeGroups: Record<string, number[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: []
    };

    entries.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      let timeOfDay: string;
      
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';
      
      timeGroups[timeOfDay].push(entry.overall);
    });

    const averages = Object.entries(timeGroups).map(([time, moods]) => ({
      time,
      average: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0
    }));

    const bestTime = averages.reduce((a, b) => a.average > b.average ? a : b).time;
    const worstTime = averages.reduce((a, b) => a.average < b.average ? a : b).time;

    return { bestTime, worstTime };
  }

  private static analyzeTriggers(entries: MoodEntry[]) {
    const triggerImpact: Record<string, { total: number; count: number }> = {};

    entries.forEach(entry => {
      if (entry.triggers) {
        entry.triggers.forEach(trigger => {
          if (!triggerImpact[trigger]) {
            triggerImpact[trigger] = { total: 0, count: 0 };
          }
          triggerImpact[trigger].total += entry.overall;
          triggerImpact[trigger].count += 1;
        });
      }
    });

    return Object.entries(triggerImpact)
      .map(([trigger, data]) => ({
        trigger,
        averageImpact: data.total / data.count,
        count: data.count
      }))
      .sort((a, b) => a.averageImpact - b.averageImpact)
      .map(item => item.trigger);
  }

  private static analyzeActivities(entries: MoodEntry[]) {
    const activityImpact: Record<string, { total: number; count: number }> = {};

    entries.forEach(entry => {
      if (entry.activities) {
        entry.activities.forEach(activity => {
          if (!activityImpact[activity]) {
            activityImpact[activity] = { total: 0, count: 0 };
          }
          activityImpact[activity].total += entry.overall;
          activityImpact[activity].count += 1;
        });
      }
    });

    return Object.entries(activityImpact)
      .map(([activity, data]) => ({
        activity,
        averageImpact: data.total / data.count,
        count: data.count
      }))
      .sort((a, b) => b.averageImpact - a.averageImpact)
      .map(item => item.activity);
  }

  static getMoodCorrelations(moodEntries: MoodEntry[]): MoodCorrelation[] {
    const activities = this.getCommonActivities();
    const correlations: MoodCorrelation[] = [];

    activities.forEach(activity => {
      const withActivity = moodEntries.filter(entry => 
        entry.activities?.includes(activity)
      );
      const withoutActivity = moodEntries.filter(entry => 
        !entry.activities?.includes(activity)
      );

      if (withActivity.length > 0 && withoutActivity.length > 0) {
        const avgWith = withActivity.reduce((sum, entry) => 
          sum + entry.overall, 0) / withActivity.length;
        const avgWithout = withoutActivity.reduce((sum, entry) => 
          sum + entry.overall, 0) / withoutActivity.length;

        const impact = (avgWith - avgWithout) / 10; // Normalize to -1 to 1
        const confidence = Math.min(withActivity.length / 10, 1); // More data = higher confidence

        correlations.push({
          activity,
          impact,
          confidence,
          occurrences: withActivity.length
        });
      }
    });

    return correlations.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  }

  static getMoodInsights(moodEntries: MoodEntry[]) {
    const patterns = this.analyzeMoodPatterns(moodEntries);
    const correlations = this.getMoodCorrelations(moodEntries);
    
    const insights = [];

    // Trend insights
    if (patterns.trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Positive Trend',
        message: `Your mood has been improving over time with an average increase of ${patterns.averageChange.toFixed(1)} points.`
      });
    } else if (patterns.trend === 'declining') {
      insights.push({
        type: 'warning',
        title: 'Declining Trend',
        message: `Your mood has been declining. Consider focusing on activities that typically improve your mood.`
      });
    }

    // Time insights
    insights.push({
      type: 'info',
      title: 'Best Time of Day',
      message: `You tend to feel best during the ${patterns.bestTime}. Try scheduling important activities during this time.`
    });

    // Activity insights
    const topActivity = correlations.find(c => c.impact > 0);
    if (topActivity) {
      insights.push({
        type: 'positive',
        title: 'Mood Booster',
        message: `${topActivity.activity} seems to have a positive impact on your mood. Consider incorporating it more regularly.`
      });
    }

    return insights;
  }
}
