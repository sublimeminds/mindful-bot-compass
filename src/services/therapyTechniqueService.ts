
export interface TherapyTechnique {
  id: string;
  title: string;
  category: 'breathing' | 'mindfulness' | 'cbt' | 'grounding' | 'relaxation' | 'journaling';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  instructions: string[];
  audioGuidance?: string;
  benefits: string[];
  whenToUse: string[];
  steps: TechniqueStep[];
}

export interface TechniqueStep {
  id: string;
  instruction: string;
  duration?: number; // in seconds
  type: 'instruction' | 'breathing' | 'visualization' | 'reflection';
  audio?: string;
}

export interface TechniqueSession {
  id: string;
  userId: string;
  techniqueId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  rating?: number; // 1-5 how helpful it was
  notes?: string;
  moodBefore?: number;
  moodAfter?: number;
}

export class TherapyTechniqueService {
  private static techniques: TherapyTechnique[] = [
    {
      id: 'box-breathing',
      title: '4-7-8 Breathing',
      category: 'breathing',
      description: 'A simple yet powerful breathing technique to reduce anxiety and promote relaxation.',
      difficulty: 'beginner',
      duration: 5,
      instructions: [
        'Sit comfortably with your back straight',
        'Exhale completely through your mouth',
        'Inhale through nose for 4 counts',
        'Hold breath for 7 counts',
        'Exhale through mouth for 8 counts',
        'Repeat 3-4 cycles'
      ],
      benefits: ['Reduces anxiety', 'Promotes relaxation', 'Improves focus'],
      whenToUse: ['Before stressful situations', 'When feeling anxious', 'Before sleep'],
      steps: [
        { id: '1', instruction: 'Get comfortable and close your eyes', type: 'instruction' },
        { id: '2', instruction: 'Exhale completely', type: 'breathing', duration: 4 },
        { id: '3', instruction: 'Inhale through your nose', type: 'breathing', duration: 4 },
        { id: '4', instruction: 'Hold your breath', type: 'breathing', duration: 7 },
        { id: '5', instruction: 'Exhale through your mouth', type: 'breathing', duration: 8 }
      ]
    },
    {
      id: 'body-scan',
      title: 'Progressive Body Scan',
      category: 'mindfulness',
      description: 'A mindfulness technique to release tension and increase body awareness.',
      difficulty: 'beginner',
      duration: 15,
      instructions: [
        'Lie down comfortably',
        'Close your eyes and breathe naturally',
        'Start with your toes, notice any sensations',
        'Slowly move attention up through your body',
        'Notice tension without trying to change it',
        'Continue until you reach the top of your head'
      ],
      benefits: ['Reduces physical tension', 'Increases mindfulness', 'Improves sleep'],
      whenToUse: ['When feeling tense', 'Before sleep', 'During stress'],
      steps: [
        { id: '1', instruction: 'Find a comfortable position lying down', type: 'instruction' },
        { id: '2', instruction: 'Focus on your toes and feet', type: 'visualization', duration: 60 },
        { id: '3', instruction: 'Move attention to your legs', type: 'visualization', duration: 60 },
        { id: '4', instruction: 'Focus on your torso and arms', type: 'visualization', duration: 60 },
        { id: '5', instruction: 'Notice sensations in your head and neck', type: 'visualization', duration: 60 }
      ]
    },
    {
      id: 'thought-challenging',
      title: 'Thought Challenging',
      category: 'cbt',
      description: 'Cognitive technique to identify and challenge negative thought patterns.',
      difficulty: 'intermediate',
      duration: 10,
      instructions: [
        'Identify the negative thought',
        'Ask: Is this thought realistic?',
        'Look for evidence for and against',
        'Consider alternative perspectives',
        'Develop a balanced thought',
        'Notice how you feel with the new thought'
      ],
      benefits: ['Reduces negative thinking', 'Improves mood', 'Builds resilience'],
      whenToUse: ['When caught in negative thinking', 'During low mood', 'When catastrophizing'],
      steps: [
        { id: '1', instruction: 'Write down the negative thought', type: 'reflection' },
        { id: '2', instruction: 'Rate how much you believe it (1-10)', type: 'reflection' },
        { id: '3', instruction: 'List evidence that supports this thought', type: 'reflection' },
        { id: '4', instruction: 'List evidence that contradicts this thought', type: 'reflection' },
        { id: '5', instruction: 'Create a more balanced thought', type: 'reflection' }
      ]
    },
    {
      id: '54321-grounding',
      title: '5-4-3-2-1 Grounding',
      category: 'grounding',
      description: 'Sensory grounding technique to manage anxiety and panic.',
      difficulty: 'beginner',
      duration: 5,
      instructions: [
        'Look around and name 5 things you can see',
        'Notice 4 things you can touch',
        'Listen for 3 things you can hear',
        'Identify 2 things you can smell',
        'Name 1 thing you can taste'
      ],
      benefits: ['Reduces anxiety', 'Stops panic attacks', 'Increases present awareness'],
      whenToUse: ['During panic attacks', 'When overwhelmed', 'When dissociating'],
      steps: [
        { id: '1', instruction: 'Name 5 things you can see', type: 'instruction', duration: 30 },
        { id: '2', instruction: 'Touch 4 different textures', type: 'instruction', duration: 30 },
        { id: '3', instruction: 'Listen for 3 sounds', type: 'instruction', duration: 30 },
        { id: '4', instruction: 'Notice 2 scents', type: 'instruction', duration: 30 },
        { id: '5', instruction: 'Identify 1 taste', type: 'instruction', duration: 30 }
      ]
    },
    {
      id: 'gratitude-journal',
      title: 'Gratitude Journaling',
      category: 'journaling',
      description: 'Daily practice to focus on positive aspects of life.',
      difficulty: 'beginner',
      duration: 10,
      instructions: [
        'Find a quiet space with pen and paper',
        'Think about your day',
        'Write 3 things you\'re grateful for',
        'For each item, write why you\'re grateful',
        'Notice how this makes you feel'
      ],
      benefits: ['Improves mood', 'Increases life satisfaction', 'Builds resilience'],
      whenToUse: ['Daily practice', 'When feeling down', 'Before sleep'],
      steps: [
        { id: '1', instruction: 'Get comfortable with your journal', type: 'instruction' },
        { id: '2', instruction: 'Write your first gratitude item', type: 'reflection' },
        { id: '3', instruction: 'Write your second gratitude item', type: 'reflection' },
        { id: '4', instruction: 'Write your third gratitude item', type: 'reflection' },
        { id: '5', instruction: 'Reflect on how this makes you feel', type: 'reflection' }
      ]
    }
  ];

  static getAllTechniques(): TherapyTechnique[] {
    return this.techniques;
  }

  static getTechniquesByCategory(category: TherapyTechnique['category']): TherapyTechnique[] {
    return this.techniques.filter(t => t.category === category);
  }

  static getTechniqueById(id: string): TherapyTechnique | undefined {
    return this.techniques.find(t => t.id === id);
  }

  static getRecommendedTechniques(
    userMood: number, 
    recentSessions: any[], 
    preferences: string[]
  ): TherapyTechnique[] {
    // Recommend based on mood and preferences
    let recommended = [...this.techniques];

    // Filter by mood
    if (userMood <= 4) {
      // Low mood - prioritize mood-boosting techniques
      recommended = recommended.filter(t => 
        t.category === 'breathing' || 
        t.category === 'grounding' || 
        t.category === 'journaling'
      );
    } else if (userMood >= 7) {
      // Good mood - maintain with mindfulness
      recommended = recommended.filter(t => 
        t.category === 'mindfulness' || 
        t.category === 'journaling'
      );
    }

    // Prioritize beginner techniques for new users
    if (recentSessions.length < 3) {
      recommended = recommended.filter(t => t.difficulty === 'beginner');
    }

    return recommended.slice(0, 3);
  }

  static getTechniqueProgress(sessions: TechniqueSession[]): {
    totalSessions: number;
    completedSessions: number;
    averageRating: number;
    favoriteCategory: string;
    mostUsedTechnique: string;
  } {
    const completed = sessions.filter(s => s.completed);
    const ratings = completed.filter(s => s.rating).map(s => s.rating!);
    
    const categoryCount: Record<string, number> = {};
    const techniqueCount: Record<string, number> = {};
    
    sessions.forEach(session => {
      const technique = this.getTechniqueById(session.techniqueId);
      if (technique) {
        categoryCount[technique.category] = (categoryCount[technique.category] || 0) + 1;
        techniqueCount[technique.title] = (techniqueCount[technique.title] || 0) + 1;
      }
    });

    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';
    
    const mostUsedTechnique = Object.entries(techniqueCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      favoriteCategory,
      mostUsedTechnique
    };
  }
}
