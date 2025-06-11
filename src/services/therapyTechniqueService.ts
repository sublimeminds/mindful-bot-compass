
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
        { id: '2', instruction: 'Exhale completely through your mouth', type: 'breathing', duration: 4 },
        { id: '3', instruction: 'Inhale slowly through your nose for 4 counts', type: 'breathing', duration: 4 },
        { id: '4', instruction: 'Hold your breath for 7 counts', type: 'breathing', duration: 7 },
        { id: '5', instruction: 'Exhale slowly through your mouth for 8 counts', type: 'breathing', duration: 8 },
        { id: '6', instruction: 'Repeat this cycle 3 more times', type: 'breathing', duration: 60 }
      ]
    },
    {
      id: 'square-breathing',
      title: 'Box Breathing',
      category: 'breathing',
      description: 'A military-grade breathing technique used by Navy SEALs to stay calm under pressure.',
      difficulty: 'beginner',
      duration: 8,
      instructions: [
        'Sit up straight or lie down',
        'Exhale all air from your lungs',
        'Inhale for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Hold empty for 4 counts'
      ],
      benefits: ['Reduces stress', 'Improves concentration', 'Calms nervous system'],
      whenToUse: ['Before important meetings', 'During high stress', 'When overwhelmed'],
      steps: [
        { id: '1', instruction: 'Find a comfortable seated position', type: 'instruction' },
        { id: '2', instruction: 'Inhale slowly for 4 counts', type: 'breathing', duration: 4 },
        { id: '3', instruction: 'Hold your breath for 4 counts', type: 'breathing', duration: 4 },
        { id: '4', instruction: 'Exhale slowly for 4 counts', type: 'breathing', duration: 4 },
        { id: '5', instruction: 'Hold empty for 4 counts', type: 'breathing', duration: 4 },
        { id: '6', instruction: 'Continue this pattern for several more cycles', type: 'breathing', duration: 80 }
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
        { id: '1', instruction: 'Lie down comfortably and close your eyes', type: 'instruction' },
        { id: '2', instruction: 'Focus on your toes and feet - notice any sensations', type: 'visualization', duration: 90 },
        { id: '3', instruction: 'Move attention to your calves and shins', type: 'visualization', duration: 60 },
        { id: '4', instruction: 'Notice your thighs and hips', type: 'visualization', duration: 60 },
        { id: '5', instruction: 'Focus on your abdomen and lower back', type: 'visualization', duration: 60 },
        { id: '6', instruction: 'Notice your chest and upper back', type: 'visualization', duration: 60 },
        { id: '7', instruction: 'Focus on your arms and hands', type: 'visualization', duration: 60 },
        { id: '8', instruction: 'Notice sensations in your neck and head', type: 'visualization', duration: 90 }
      ]
    },
    {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      category: 'mindfulness',
      description: 'Cultivate compassion and reduce negative emotions toward yourself and others.',
      difficulty: 'intermediate',
      duration: 12,
      instructions: [
        'Sit comfortably and close your eyes',
        'Start by sending love to yourself',
        'Extend love to someone you care about',
        'Include someone neutral',
        'Send love to someone difficult',
        'Extend to all beings everywhere'
      ],
      benefits: ['Increases self-compassion', 'Reduces anger', 'Improves relationships'],
      whenToUse: ['When feeling angry', 'After conflicts', 'For self-criticism'],
      steps: [
        { id: '1', instruction: 'Sit comfortably and close your eyes', type: 'instruction' },
        { id: '2', instruction: 'Place your hand on your heart and repeat: "May I be happy, may I be healthy, may I be at peace"', type: 'visualization', duration: 120 },
        { id: '3', instruction: 'Think of someone you love and send them the same wishes', type: 'visualization', duration: 120 },
        { id: '4', instruction: 'Think of someone neutral and extend these wishes to them', type: 'visualization', duration: 120 },
        { id: '5', instruction: 'Think of someone you have difficulty with and try to send them these wishes', type: 'visualization', duration: 120 },
        { id: '6', instruction: 'Extend these wishes to all beings everywhere', type: 'visualization', duration: 120 }
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
        { id: '1', instruction: 'Write down the negative thought that\'s bothering you', type: 'reflection' },
        { id: '2', instruction: 'Rate how much you believe this thought from 1-10', type: 'reflection' },
        { id: '3', instruction: 'List evidence that supports this thought', type: 'reflection' },
        { id: '4', instruction: 'List evidence that contradicts this thought', type: 'reflection' },
        { id: '5', instruction: 'Create a more balanced, realistic thought', type: 'reflection' },
        { id: '6', instruction: 'Rate how much you believe the new thought from 1-10', type: 'reflection' }
      ]
    },
    {
      id: 'cognitive-restructuring',
      title: 'Cognitive Restructuring',
      category: 'cbt',
      description: 'Advanced technique to identify and change distorted thinking patterns.',
      difficulty: 'advanced',
      duration: 15,
      instructions: [
        'Identify the triggering situation',
        'Notice your emotional response',
        'Identify automatic thoughts',
        'Examine thinking errors',
        'Generate alternative thoughts',
        'Choose the most helpful perspective'
      ],
      benefits: ['Reduces depression', 'Improves problem-solving', 'Increases emotional regulation'],
      whenToUse: ['During depressive episodes', 'When ruminating', 'For persistent worries'],
      steps: [
        { id: '1', instruction: 'Describe the situation that triggered negative emotions', type: 'reflection' },
        { id: '2', instruction: 'Identify what emotions you\'re feeling and rate their intensity', type: 'reflection' },
        { id: '3', instruction: 'Write down the automatic thoughts that came up', type: 'reflection' },
        { id: '4', instruction: 'Identify any thinking errors (catastrophizing, all-or-nothing, etc.)', type: 'reflection' },
        { id: '5', instruction: 'Generate 3 alternative ways to view this situation', type: 'reflection' },
        { id: '6', instruction: 'Choose the most balanced and helpful perspective', type: 'reflection' }
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
        { id: '1', instruction: 'Look around and name 5 things you can see out loud', type: 'instruction', duration: 45 },
        { id: '2', instruction: 'Touch 4 different textures and describe how they feel', type: 'instruction', duration: 45 },
        { id: '3', instruction: 'Listen carefully and identify 3 sounds around you', type: 'instruction', duration: 45 },
        { id: '4', instruction: 'Notice 2 different scents in your environment', type: 'instruction', duration: 45 },
        { id: '5', instruction: 'Identify 1 taste you can notice right now', type: 'instruction', duration: 30 }
      ]
    },
    {
      id: 'safe-place-visualization',
      title: 'Safe Place Visualization',
      category: 'grounding',
      description: 'Create a mental safe haven for times of distress.',
      difficulty: 'intermediate',
      duration: 10,
      instructions: [
        'Close your eyes and breathe deeply',
        'Imagine a place where you feel completely safe',
        'Notice all the details - sights, sounds, smells',
        'Feel the safety and peace in your body',
        'Create a cue word to return here',
        'Practice accessing this place regularly'
      ],
      benefits: ['Provides emotional regulation', 'Reduces trauma responses', 'Creates sense of safety'],
      whenToUse: ['During flashbacks', 'When triggered', 'Before difficult situations'],
      steps: [
        { id: '1', instruction: 'Close your eyes and take three deep breaths', type: 'instruction' },
        { id: '2', instruction: 'Imagine a place where you feel completely safe and peaceful', type: 'visualization', duration: 120 },
        { id: '3', instruction: 'Notice what you can see in this safe place - colors, objects, scenery', type: 'visualization', duration: 60 },
        { id: '4', instruction: 'Listen to the sounds in your safe place', type: 'visualization', duration: 60 },
        { id: '5', instruction: 'Notice any smells or physical sensations', type: 'visualization', duration: 60 },
        { id: '6', instruction: 'Choose a cue word that represents this safe place', type: 'reflection', duration: 30 }
      ]
    },
    {
      id: 'progressive-muscle-relaxation',
      title: 'Progressive Muscle Relaxation',
      category: 'relaxation',
      description: 'Systematically tense and relax muscle groups to reduce physical stress.',
      difficulty: 'beginner',
      duration: 20,
      instructions: [
        'Lie down in a comfortable position',
        'Start with your toes and feet',
        'Tense each muscle group for 5 seconds',
        'Release and notice the relaxation',
        'Move systematically up your body',
        'End with your face and scalp'
      ],
      benefits: ['Reduces muscle tension', 'Improves sleep', 'Lowers blood pressure'],
      whenToUse: ['When physically tense', 'Before sleep', 'After stressful days'],
      steps: [
        { id: '1', instruction: 'Lie down comfortably and close your eyes', type: 'instruction' },
        { id: '2', instruction: 'Tense your feet and toes for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '3', instruction: 'Tense your calves for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '4', instruction: 'Tense your thighs and glutes for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '5', instruction: 'Tense your abdomen for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '6', instruction: 'Tense your arms and hands for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '7', instruction: 'Tense your shoulders for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '8', instruction: 'Tense your face and scalp for 5 seconds, then release', type: 'instruction', duration: 60 },
        { id: '9', instruction: 'Notice the relaxation throughout your entire body', type: 'visualization', duration: 120 }
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
        { id: '1', instruction: 'Get comfortable with your journal or device', type: 'instruction' },
        { id: '2', instruction: 'Write the first thing you\'re grateful for today and why', type: 'reflection' },
        { id: '3', instruction: 'Write the second thing you\'re grateful for and why', type: 'reflection' },
        { id: '4', instruction: 'Write the third thing you\'re grateful for and why', type: 'reflection' },
        { id: '5', instruction: 'Read through your list and notice how it makes you feel', type: 'reflection' }
      ]
    },
    {
      id: 'emotion-journaling',
      title: 'Emotion Processing Journal',
      category: 'journaling',
      description: 'Structured journaling to process and understand your emotions.',
      difficulty: 'intermediate',
      duration: 15,
      instructions: [
        'Write about a recent emotional experience',
        'Identify the specific emotions felt',
        'Explore what triggered these emotions',
        'Consider what the emotions are telling you',
        'Reflect on how you want to respond',
        'Note any insights or patterns'
      ],
      benefits: ['Improves emotional intelligence', 'Reduces emotional overwhelm', 'Increases self-awareness'],
      whenToUse: ['After intense emotions', 'When confused about feelings', 'For emotional processing'],
      steps: [
        { id: '1', instruction: 'Describe a recent situation that brought up strong emotions', type: 'reflection' },
        { id: '2', instruction: 'Name the specific emotions you felt (sad, angry, anxious, etc.)', type: 'reflection' },
        { id: '3', instruction: 'Explore what specifically triggered these emotions', type: 'reflection' },
        { id: '4', instruction: 'Consider what these emotions might be trying to tell you', type: 'reflection' },
        { id: '5', instruction: 'Reflect on how you want to respond to this situation', type: 'reflection' },
        { id: '6', instruction: 'Note any insights or patterns you notice about your emotions', type: 'reflection' }
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
