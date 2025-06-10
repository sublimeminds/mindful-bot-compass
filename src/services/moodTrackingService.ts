
export interface DetailedMood {
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleep_quality?: number;
  social_connection?: number;
}

export interface MoodEntry {
  id: string;
  userId: string;
  timestamp: Date;
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleep_quality?: number;
  social_connection?: number;
  activities?: string[];
  triggers?: string[];
  notes?: string;
  weather?: string;
}

export interface MoodPattern {
  averageMood: number;
  moodVariability: number;
  bestTimeOfDay: string;
  worstTimeOfDay: string;
  streak: number;
}

export interface MoodInsight {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  confidence: number;
}

export class MoodTrackingService {
  static getMoodCategories() {
    return [
      { key: 'overall', label: 'Overall Mood', description: 'How do you feel in general?' },
      { key: 'anxiety', label: 'Anxiety Level', description: 'How anxious or worried do you feel?' },
      { key: 'depression', label: 'Depression Level', description: 'How sad or down do you feel?' },
      { key: 'stress', label: 'Stress Level', description: 'How stressed or overwhelmed do you feel?' },
      { key: 'energy', label: 'Energy Level', description: 'How energetic do you feel?' },
      { key: 'sleep_quality', label: 'Sleep Quality', description: 'How well did you sleep last night?' },
      { key: 'social_connection', label: 'Social Connection', description: 'How connected to others do you feel?' }
    ];
  }

  static getCommonActivities() {
    return [
      'Exercise', 'Meditation', 'Reading', 'Socializing', 'Work', 'Hobbies',
      'Outdoor time', 'Music', 'Cooking', 'Gaming', 'Learning', 'Relaxing'
    ];
  }

  static getCommonTriggers() {
    return [
      'Work stress', 'Relationship issues', 'Financial worry', 'Health concerns',
      'Social situations', 'Weather', 'Sleep issues', 'News/media', 'Family',
      'Technology', 'Travel', 'Deadlines'
    ];
  }

  static async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    // Mock data - in real implementation, this would fetch from Supabase
    const mockEntries: MoodEntry[] = [
      {
        id: '1',
        userId,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        overall: 7,
        anxiety: 3,
        depression: 2,
        stress: 4,
        energy: 8,
        activities: ['Exercise', 'Work'],
        notes: 'Had a good day overall'
      },
      {
        id: '2',
        userId,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        overall: 5,
        anxiety: 6,
        depression: 4,
        stress: 7,
        energy: 4,
        activities: ['Work'],
        triggers: ['Work stress'],
        notes: 'Stressful day at work'
      }
    ];

    return mockEntries;
  }

  static analyzeMoodPatterns(entries: MoodEntry[]): MoodPattern {
    if (entries.length === 0) {
      return {
        averageMood: 5,
        moodVariability: 0,
        bestTimeOfDay: 'Morning',
        worstTimeOfDay: 'Evening',
        streak: 0
      };
    }

    const moods = entries.map(e => e.overall);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const moodVariability = Math.sqrt(moods.reduce((sum, mood) => sum + Math.pow(mood - averageMood, 2), 0) / moods.length);

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      moodVariability: Math.round(moodVariability * 10) / 10,
      bestTimeOfDay: 'Morning',
      worstTimeOfDay: 'Evening',
      streak: entries.length
    };
  }

  static generateMoodInsights(entries: MoodEntry[]): MoodInsight[] {
    const insights: MoodInsight[] = [];

    if (entries.length >= 3) {
      const recentEntries = entries.slice(0, 3);
      const averageRecent = recentEntries.reduce((sum, e) => sum + e.overall, 0) / recentEntries.length;

      if (averageRecent >= 7) {
        insights.push({
          type: 'positive',
          title: 'Positive Trend',
          description: 'Your mood has been consistently good over the past few days.',
          confidence: 0.8
        });
      } else if (averageRecent <= 4) {
        insights.push({
          type: 'warning',
          title: 'Low Mood Pattern',
          description: 'Your mood has been lower than usual. Consider reaching out for support.',
          confidence: 0.75
        });
      }
    }

    return insights;
  }
}
