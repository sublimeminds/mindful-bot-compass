
import { SessionData } from '@/services/analyticsService';

export interface SessionSummary {
  id: string;
  date: Date;
  duration: number; // in minutes
  moodBefore?: number;
  moodAfter?: number;
  moodChange?: number;
  techniques: string[];
  notes: string;
  keyInsights: string[];
  effectiveness: 'high' | 'medium' | 'low';
}

export interface SessionFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  techniques?: string[];
  moodRange?: {
    min: number;
    max: number;
  };
  effectiveness?: ('high' | 'medium' | 'low')[];
}

export class SessionHistoryService {
  static generateSessionSummaries(sessions: SessionData[]): SessionSummary[] {
    return sessions
      .filter(session => session.endTime)
      .map(session => {
        const duration = session.endTime 
          ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
          : 0;

        // Mock mood data - in real app this would come from actual session data
        const moodBefore = Math.floor(Math.random() * 5) + 3; // 3-7
        const moodAfter = Math.floor(Math.random() * 4) + 6; // 6-9
        const moodChange = moodAfter - moodBefore;

        const keyInsights = this.generateKeyInsights(session, moodChange);
        const effectiveness = this.calculateEffectiveness(duration, moodChange, session.techniques.length);

        return {
          id: session.id,
          date: session.startTime,
          duration,
          moodBefore,
          moodAfter,
          moodChange,
          techniques: session.techniques,
          notes: session.notes,
          keyInsights,
          effectiveness
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private static generateKeyInsights(session: SessionData, moodChange: number): string[] {
    const insights: string[] = [];

    if (moodChange >= 3) {
      insights.push('Significant mood improvement achieved');
    } else if (moodChange >= 1) {
      insights.push('Positive mood shift observed');
    } else if (moodChange < 0) {
      insights.push('Consider exploring different techniques');
    }

    if (session.techniques.length >= 3) {
      insights.push('Multiple techniques practiced effectively');
    }

    if (session.notes.length > 100) {
      insights.push('Detailed self-reflection documented');
    }

    // Technique-specific insights
    if (session.techniques.includes('Deep Breathing')) {
      insights.push('Breathing exercises helped with relaxation');
    }
    if (session.techniques.includes('Cognitive Restructuring')) {
      insights.push('Worked on challenging negative thought patterns');
    }
    if (session.techniques.includes('Mindfulness Meditation')) {
      insights.push('Practiced present-moment awareness');
    }

    return insights.slice(0, 3); // Limit to top 3 insights
  }

  private static calculateEffectiveness(
    duration: number, 
    moodChange: number, 
    techniqueCount: number
  ): 'high' | 'medium' | 'low' {
    let score = 0;

    // Duration scoring (sweet spot is 20-45 minutes)
    if (duration >= 20 && duration <= 45) score += 2;
    else if (duration >= 15 && duration <= 60) score += 1;

    // Mood change scoring
    if (moodChange >= 3) score += 3;
    else if (moodChange >= 1) score += 2;
    else if (moodChange >= 0) score += 1;

    // Technique variety scoring
    if (techniqueCount >= 3) score += 2;
    else if (techniqueCount >= 2) score += 1;

    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  static filterSessions(
    sessions: SessionSummary[], 
    filter: SessionFilter
  ): SessionSummary[] {
    return sessions.filter(session => {
      // Date range filter
      if (filter.dateRange) {
        const sessionDate = session.date;
        if (sessionDate < filter.dateRange.start || sessionDate > filter.dateRange.end) {
          return false;
        }
      }

      // Techniques filter
      if (filter.techniques && filter.techniques.length > 0) {
        const hasMatchingTechnique = filter.techniques.some(technique =>
          session.techniques.includes(technique)
        );
        if (!hasMatchingTechnique) return false;
      }

      // Mood range filter
      if (filter.moodRange && session.moodAfter) {
        if (session.moodAfter < filter.moodRange.min || session.moodAfter > filter.moodRange.max) {
          return false;
        }
      }

      // Effectiveness filter
      if (filter.effectiveness && filter.effectiveness.length > 0) {
        if (!filter.effectiveness.includes(session.effectiveness)) {
          return false;
        }
      }

      return true;
    });
  }

  static getSessionStats(sessions: SessionSummary[]) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        averageMoodImprovement: 0,
        mostUsedTechnique: '',
        effectivenessDistribution: { high: 0, medium: 0, low: 0 }
      };
    }

    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    const moodImprovements = sessions
      .filter(session => session.moodChange !== undefined)
      .map(session => session.moodChange!);
    
    const averageMoodImprovement = moodImprovements.length > 0
      ? moodImprovements.reduce((sum, change) => sum + change, 0) / moodImprovements.length
      : 0;

    // Find most used technique
    const techniqueCount: Record<string, number> = {};
    sessions.forEach(session => {
      session.techniques.forEach(technique => {
        techniqueCount[technique] = (techniqueCount[technique] || 0) + 1;
      });
    });

    const mostUsedTechnique = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Calculate effectiveness distribution
    const effectivenessDistribution = sessions.reduce(
      (acc, session) => {
        acc[session.effectiveness]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    return {
      totalSessions: sessions.length,
      averageDuration: Math.round(totalDuration / sessions.length),
      averageMoodImprovement: Math.round(averageMoodImprovement * 10) / 10,
      mostUsedTechnique,
      effectivenessDistribution
    };
  }

  static exportSessionData(sessions: SessionSummary[]): string {
    const headers = [
      'Date',
      'Duration (min)',
      'Mood Before',
      'Mood After',
      'Mood Change',
      'Techniques',
      'Effectiveness',
      'Key Insights',
      'Notes'
    ];

    const rows = sessions.map(session => [
      session.date.toLocaleDateString(),
      session.duration.toString(),
      session.moodBefore?.toString() || '',
      session.moodAfter?.toString() || '',
      session.moodChange?.toString() || '',
      session.techniques.join('; '),
      session.effectiveness,
      session.keyInsights.join('; '),
      session.notes.replace(/\n/g, ' ').replace(/,/g, ';')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}
