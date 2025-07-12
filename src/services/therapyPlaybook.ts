export interface SessionPhase {
  id: string;
  name: string;
  duration: number; // in minutes
  description: string;
  objectives: string[];
  techniques: string[];
  prompts: string[];
  transitionCriteria: string[];
}

export interface TherapyPlaybook {
  id: string;
  name: string;
  totalDuration: number;
  phases: SessionPhase[];
  approach: string;
  targetConditions: string[];
}

export const STANDARD_THERAPY_PLAYBOOK: TherapyPlaybook = {
  id: 'standard-therapy-session',
  name: 'Standard Therapy Session',
  totalDuration: 50, // 50 minutes
  approach: 'Integrative',
  targetConditions: ['anxiety', 'depression', 'stress', 'general wellness'],
  phases: [
    {
      id: 'check-in',
      name: 'Check-in & Mood Assessment',
      duration: 7,
      description: 'Opening connection and current state assessment',
      objectives: [
        'Establish therapeutic connection',
        'Assess current emotional state',
        'Identify session priorities',
        'Check homework from previous session'
      ],
      techniques: [
        'Active listening',
        'Empathetic reflection',
        'Mood scaling (1-10)',
        'Open-ended questioning'
      ],
      prompts: [
        "Hello! I'm glad you're here today. How are you feeling right now?",
        "On a scale of 1-10, how would you rate your mood today?",
        "What's been on your mind since our last session?",
        "Is there anything specific you'd like to focus on today?"
      ],
      transitionCriteria: [
        'Current mood assessed',
        'Session goals identified',
        'Therapeutic rapport established'
      ]
    },
    {
      id: 'review',
      name: 'Session Review & Continuity',
      duration: 5,
      description: 'Connecting with previous work and progress',
      objectives: [
        'Review homework assignments',
        'Assess progress on goals',
        'Identify patterns and insights',
        'Build session continuity'
      ],
      techniques: [
        'Progress review',
        'Pattern identification',
        'Strength reinforcement',
        'Gentle accountability'
      ],
      prompts: [
        "Let's check in on the techniques we discussed last time. How did they work for you?",
        "What insights have you gained since our last session?",
        "Which coping strategies have been most helpful this week?",
        "What challenges did you encounter with the homework exercises?"
      ],
      transitionCriteria: [
        'Previous session reviewed',
        'Progress acknowledged',
        'Current challenges identified'
      ]
    },
    {
      id: 'working',
      name: 'Core Therapeutic Work',
      duration: 30,
      description: 'Main therapeutic intervention and skill building',
      objectives: [
        'Address primary concerns',
        'Teach new coping skills',
        'Process emotions and thoughts',
        'Practice therapeutic techniques'
      ],
      techniques: [
        'Cognitive restructuring',
        'Mindfulness exercises',
        'Behavioral interventions',
        'Emotional processing',
        'Problem-solving strategies'
      ],
      prompts: [
        "Let's explore that feeling more deeply. What thoughts come up when you feel anxious?",
        "I'd like to teach you a technique that can help with this situation.",
        "Let's practice this together. Can you think of a recent situation where this might apply?",
        "What would you tell a friend who was experiencing something similar?"
      ],
      transitionCriteria: [
        'Key issues addressed',
        'New skills introduced',
        'Emotional processing completed',
        'Understanding demonstrated'
      ]
    },
    {
      id: 'integration',
      name: 'Integration & Insight Development',
      duration: 5,
      description: 'Processing insights and connecting learnings',
      objectives: [
        'Synthesize session learnings',
        'Identify key insights',
        'Connect to personal goals',
        'Reinforce progress'
      ],
      techniques: [
        'Insight facilitation',
        'Connection making',
        'Strength identification',
        'Progress celebration'
      ],
      prompts: [
        "What stands out to you most from what we've discussed today?",
        "How does this connect to your overall goals?",
        "What insights are you taking away from this session?",
        "I notice you've shown real strength in..."
      ],
      transitionCriteria: [
        'Key insights identified',
        'Learning synthesized',
        'Progress acknowledged'
      ]
    },
    {
      id: 'closure',
      name: 'Session Closure & Planning',
      duration: 3,
      description: 'Wrapping up and setting intentions',
      objectives: [
        'Summarize session highlights',
        'Assign homework/practice',
        'Schedule next session',
        'Ensure emotional stability'
      ],
      techniques: [
        'Session summarization',
        'Homework assignment',
        'Resource provision',
        'Safety check'
      ],
      prompts: [
        "Let's wrap up today's session. What are the main things you want to remember?",
        "I'd like you to practice this technique between now and our next session.",
        "Here are some resources that might be helpful for you this week.",
        "How are you feeling as we end today? Do you feel ready to go about your day?"
      ],
      transitionCriteria: [
        'Session summarized',
        'Homework assigned',
        'Next steps clear',
        'Emotional stability confirmed'
      ]
    }
  ]
};

export const CBT_PLAYBOOK: TherapyPlaybook = {
  id: 'cbt-therapy-session',
  name: 'Cognitive Behavioral Therapy Session',
  totalDuration: 50,
  approach: 'CBT',
  targetConditions: ['anxiety', 'depression', 'panic disorder', 'social anxiety'],
  phases: [
    {
      id: 'check-in-cbt',
      name: 'Mood Check & Agenda Setting',
      duration: 5,
      description: 'CBT-focused opening and agenda setting',
      objectives: [
        'Assess current mood and symptoms',
        'Review homework assignments',
        'Set session agenda collaboratively',
        'Check for crisis issues'
      ],
      techniques: [
        'Mood monitoring',
        'Homework review',
        'Collaborative agenda setting',
        'Symptom tracking'
      ],
      prompts: [
        "Let's start by checking your mood rating for today compared to last week.",
        "How did the thought record homework go? What did you discover?",
        "What would you like to focus on in today's session?",
        "On a scale of 1-10, how has your anxiety been this week?"
      ],
      transitionCriteria: [
        'Mood assessed',
        'Homework reviewed',
        'Session agenda set'
      ]
    },
    {
      id: 'skill-review-cbt',
      name: 'Skill Review & Application',
      duration: 10,
      description: 'Review previous CBT skills and assess application',
      objectives: [
        'Review CBT techniques learned',
        'Assess real-world application',
        'Identify barriers to implementation',
        'Reinforce successful strategies'
      ],
      techniques: [
        'Technique review',
        'Application assessment',
        'Barrier identification',
        'Success reinforcement'
      ],
      prompts: [
        "Let's review the cognitive restructuring technique. How has it been working for you?",
        "Can you walk me through how you used the breathing exercise this week?",
        "What made it difficult to use these techniques in certain situations?",
        "I'm impressed by how you handled that situation using the skills we practiced."
      ],
      transitionCriteria: [
        'Skills reviewed',
        'Application assessed',
        'Barriers identified'
      ]
    },
    {
      id: 'core-cbt-work',
      name: 'Core CBT Intervention',
      duration: 25,
      description: 'Primary CBT work on thoughts, feelings, and behaviors',
      objectives: [
        'Identify negative thought patterns',
        'Challenge cognitive distortions',
        'Practice behavioral experiments',
        'Develop coping strategies'
      ],
      techniques: [
        'Thought challenging',
        'Cognitive restructuring',
        'Behavioral experiments',
        'Exposure exercises',
        'Activity scheduling'
      ],
      prompts: [
        "Let's examine that thought. What evidence supports it? What evidence challenges it?",
        "What thinking trap might you be falling into here?",
        "Let's design an experiment to test this belief.",
        "How could you approach this situation differently next time?"
      ],
      transitionCriteria: [
        'Thought patterns identified',
        'Cognitive work completed',
        'New strategies developed'
      ]
    },
    {
      id: 'practice-cbt',
      name: 'Skill Practice & Consolidation',
      duration: 7,
      description: 'Practice new skills and consolidate learning',
      objectives: [
        'Practice new CBT techniques',
        'Role-play challenging situations',
        'Consolidate session learning',
        'Build confidence in skill use'
      ],
      techniques: [
        'Skill practice',
        'Role-playing',
        'Guided practice',
        'Confidence building'
      ],
      prompts: [
        "Let's practice using this technique with the situation you mentioned.",
        "If this situation came up again, how would you handle it now?",
        "Can you try using the new thought challenging technique on this worry?",
        "How confident do you feel about using this skill on your own?"
      ],
      transitionCriteria: [
        'Skills practiced',
        'Confidence built',
        'Learning consolidated'
      ]
    },
    {
      id: 'homework-cbt',
      name: 'Homework Assignment & Planning',
      duration: 3,
      description: 'Assign specific CBT homework and plan next session',
      objectives: [
        'Assign specific homework tasks',
        'Plan skill practice',
        'Set measurable goals',
        'Schedule next session'
      ],
      techniques: [
        'Homework assignment',
        'Goal setting',
        'Progress planning',
        'Resource provision'
      ],
      prompts: [
        "For homework, I'd like you to complete a thought record when you notice anxiety.",
        "Let's plan specific times when you'll practice the breathing technique.",
        "What goal would you like to work toward before our next session?",
        "I'll send you the worksheet we discussed to help with this practice."
      ],
      transitionCriteria: [
        'Homework assigned',
        'Practice planned',
        'Goals set'
      ]
    }
  ]
};

export class TherapyPlaybookService {
  static getPlaybookForApproach(approach: string): TherapyPlaybook {
    switch (approach.toLowerCase()) {
      case 'cbt':
      case 'cognitive behavioral therapy':
        return CBT_PLAYBOOK;
      default:
        return STANDARD_THERAPY_PLAYBOOK;
    }
  }

  static getCurrentPhase(playbook: TherapyPlaybook, elapsedMinutes: number): SessionPhase {
    let cumulativeTime = 0;
    
    for (const phase of playbook.phases) {
      cumulativeTime += phase.duration;
      if (elapsedMinutes < cumulativeTime) {
        return phase;
      }
    }
    
    // Return last phase if we're beyond the planned duration
    return playbook.phases[playbook.phases.length - 1];
  }

  static getPhaseProgress(playbook: TherapyPlaybook, elapsedMinutes: number): number {
    let cumulativeTime = 0;
    let phaseStartTime = 0;
    
    for (const phase of playbook.phases) {
      if (elapsedMinutes <= cumulativeTime + phase.duration) {
        const phaseElapsed = elapsedMinutes - phaseStartTime;
        return Math.min(100, (phaseElapsed / phase.duration) * 100);
      }
      phaseStartTime = cumulativeTime;
      cumulativeTime += phase.duration;
    }
    
    return 100; // Session complete
  }

  static getNextPhase(playbook: TherapyPlaybook, currentPhaseId: string): SessionPhase | null {
    const currentIndex = playbook.phases.findIndex(p => p.id === currentPhaseId);
    if (currentIndex < playbook.phases.length - 1) {
      return playbook.phases[currentIndex + 1];
    }
    return null;
  }

  static shouldTransitionPhase(
    currentPhase: SessionPhase,
    elapsedMinutes: number,
    phaseStartTime: number,
    userEngagement: 'low' | 'medium' | 'high',
    criteriaMet: string[]
  ): boolean {
    const phaseElapsed = elapsedMinutes - phaseStartTime;
    const minDuration = currentPhase.duration * 0.7; // At least 70% of planned duration
    const maxDuration = currentPhase.duration * 1.3; // At most 130% of planned duration
    
    // Check minimum time requirement
    if (phaseElapsed < minDuration) {
      return false;
    }
    
    // Force transition if we're way over time
    if (phaseElapsed > maxDuration) {
      return true;
    }
    
    // Check if transition criteria are met
    const requiredCriteria = currentPhase.transitionCriteria.length;
    const metCriteria = criteriaMet.length;
    const criteriaRatio = metCriteria / requiredCriteria;
    
    // Transition if most criteria are met and we're past minimum time
    return criteriaRatio >= 0.7 && phaseElapsed >= minDuration;
  }
}