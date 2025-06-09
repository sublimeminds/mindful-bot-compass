
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "@/contexts/SessionContext";
import { useOnboardingData } from "@/hooks/useOnboardingData";

interface SessionRecommendation {
  id: string;
  title: string;
  description: string;
  prompt: string;
  techniques: string[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'mood' | 'anxiety' | 'stress' | 'depression' | 'general';
}

interface PersonalizedPrompt {
  greeting: string;
  focusQuestion: string;
  followUpQuestions: string[];
  suggestedTechniques: string[];
}

export class SessionRecommendationService {
  private static recommendations: SessionRecommendation[] = [
    {
      id: 'mood-check-in',
      title: 'Mood Check-in',
      description: 'Start with understanding your current emotional state',
      prompt: 'Let\'s begin by checking in with how you\'re feeling right now. Can you describe your mood and what might be contributing to it?',
      techniques: ['Mindful awareness', 'Emotion labeling'],
      estimatedDuration: 15,
      difficulty: 'beginner',
      category: 'mood'
    },
    {
      id: 'anxiety-management',
      title: 'Anxiety Management',
      description: 'Work through anxious thoughts with proven techniques',
      prompt: 'I notice you\'ve been dealing with anxiety. Let\'s explore what\'s been triggering these feelings and work on some coping strategies together.',
      techniques: ['Breathing exercises', 'Cognitive restructuring', '5-4-3-2-1 grounding'],
      estimatedDuration: 25,
      difficulty: 'intermediate',
      category: 'anxiety'
    },
    {
      id: 'stress-relief',
      title: 'Stress Relief Session',
      description: 'Focus on reducing stress and finding balance',
      prompt: 'Stress can feel overwhelming. Let\'s identify your current stressors and develop practical strategies to manage them more effectively.',
      techniques: ['Progressive muscle relaxation', 'Time management', 'Boundary setting'],
      estimatedDuration: 20,
      difficulty: 'beginner',
      category: 'stress'
    },
    {
      id: 'thought-challenging',
      title: 'Thought Challenging',
      description: 'Examine and reframe negative thought patterns',
      prompt: 'Sometimes our thoughts can become our biggest obstacles. Let\'s examine some thoughts that might be holding you back and work on reframing them.',
      techniques: ['CBT thought records', 'Evidence examination', 'Alternative perspectives'],
      estimatedDuration: 30,
      difficulty: 'advanced',
      category: 'general'
    },
    {
      id: 'self-compassion',
      title: 'Self-Compassion Practice',
      description: 'Develop a kinder relationship with yourself',
      prompt: 'We can often be our harshest critics. Today, let\'s focus on developing more self-compassion and treating yourself with the kindness you deserve.',
      techniques: ['Self-compassion meditation', 'Kind self-talk', 'Self-forgiveness'],
      estimatedDuration: 20,
      difficulty: 'intermediate',
      category: 'general'
    }
  ];

  static getPersonalizedRecommendations(
    sessionHistory: any[],
    onboardingData: any,
    currentMood?: number
  ): SessionRecommendation[] {
    const recentSessions = sessionHistory.slice(0, 5);
    const recentTechniques = recentSessions.flatMap(s => s.techniques || []);
    const userGoals = onboardingData?.goals || [];
    const userConcerns = onboardingData?.concerns || [];

    // Filter recommendations based on user data
    let filteredRecommendations = this.recommendations.filter(rec => {
      // Match recommendations to user concerns
      if (userConcerns.includes('anxiety') && rec.category === 'anxiety') return true;
      if (userConcerns.includes('stress') && rec.category === 'stress') return true;
      if (userConcerns.includes('depression') && rec.category === 'mood') return true;
      
      // Always include general recommendations
      if (rec.category === 'general') return true;
      
      // Include mood check-ins for new users or if mood is low
      if (rec.category === 'mood' && (sessionHistory.length < 3 || (currentMood && currentMood < 5))) return true;
      
      return false;
    });

    // Avoid recently used techniques
    if (recentTechniques.length > 0) {
      filteredRecommendations = filteredRecommendations.filter(rec => 
        !rec.techniques.some(tech => recentTechniques.includes(tech))
      );
    }

    // Sort by relevance and difficulty
    return filteredRecommendations.slice(0, 3);
  }

  static generatePersonalizedPrompt(
    recommendation: SessionRecommendation,
    userName: string,
    sessionHistory: any[],
    currentMood?: number
  ): PersonalizedPrompt {
    const greeting = this.generateGreeting(userName, sessionHistory.length);
    const focusQuestion = this.generateFocusQuestion(recommendation, currentMood);
    const followUpQuestions = this.generateFollowUpQuestions(recommendation);
    const suggestedTechniques = recommendation.techniques;

    return {
      greeting,
      focusQuestion,
      followUpQuestions,
      suggestedTechniques
    };
  }

  private static generateGreeting(userName: string, sessionCount: number): string {
    const greetings = [
      `Hello ${userName}, it's good to see you again.`,
      `Welcome back, ${userName}. I'm glad you're here.`,
      `Hi ${userName}, thank you for taking time for yourself today.`,
      `Good to see you, ${userName}. How are you feeling about being here today?`
    ];

    if (sessionCount === 0) {
      return `Welcome, ${userName}. I'm excited to begin this therapeutic journey with you.`;
    }

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private static generateFocusQuestion(recommendation: SessionRecommendation, currentMood?: number): string {
    let basePrompt = recommendation.prompt;

    if (currentMood) {
      if (currentMood < 4) {
        basePrompt += " I notice you might be having a challenging day - that's completely okay and we'll work through this together.";
      } else if (currentMood > 7) {
        basePrompt += " It seems like you're in a positive space today, which is wonderful. Let's build on that energy.";
      }
    }

    return basePrompt;
  }

  private static generateFollowUpQuestions(recommendation: SessionRecommendation): string[] {
    const questionMap: Record<string, string[]> = {
      'mood': [
        "What emotions are you experiencing most strongly right now?",
        "Can you tell me more about what's been affecting your mood lately?",
        "How long have you been feeling this way?"
      ],
      'anxiety': [
        "What situations tend to trigger your anxiety the most?",
        "How does anxiety typically show up in your body?",
        "What thoughts go through your mind when you feel anxious?"
      ],
      'stress': [
        "What are the main sources of stress in your life right now?",
        "How has this stress been affecting your daily routine?",
        "What coping strategies have you tried before?"
      ],
      'general': [
        "What would you like to focus on in today's session?",
        "How have you been taking care of yourself lately?",
        "What patterns have you noticed in your thoughts or feelings?"
      ]
    };

    return questionMap[recommendation.category] || questionMap['general'];
  }

  static getSmartFollowUpQuestions(conversationContext: string[], userResponse: string): string[] {
    // Analyze user response for emotional content and provide appropriate follow-ups
    const emotionalKeywords = {
      anxiety: ['worried', 'nervous', 'anxious', 'panic', 'overwhelmed'],
      sadness: ['sad', 'depressed', 'down', 'hopeless', 'empty'],
      anger: ['angry', 'frustrated', 'mad', 'irritated', 'furious'],
      positive: ['happy', 'good', 'better', 'excited', 'grateful']
    };

    const detectedEmotions = Object.entries(emotionalKeywords).filter(([emotion, keywords]) =>
      keywords.some(keyword => userResponse.toLowerCase().includes(keyword))
    );

    if (detectedEmotions.length === 0) {
      return [
        "Can you tell me more about that?",
        "How does that make you feel?",
        "What thoughts come up when you think about this?"
      ];
    }

    const [primaryEmotion] = detectedEmotions[0];
    
    const followUpMap: Record<string, string[]> = {
      anxiety: [
        "When did you first notice these anxious feelings?",
        "What physical sensations do you experience with this anxiety?",
        "Have you found anything that helps calm these feelings?"
      ],
      sadness: [
        "How long have you been feeling this way?",
        "What do you think might be contributing to these feelings?",
        "Are there moments when you feel a little lighter?"
      ],
      anger: [
        "What do you think is underneath this anger?",
        "How do you typically express or manage these feelings?",
        "What would help you feel more in control right now?"
      ],
      positive: [
        "That's wonderful to hear. What's contributing to these positive feelings?",
        "How can we build on this positive momentum?",
        "What's different about today compared to more difficult days?"
      ]
    };

    return followUpMap[primaryEmotion] || followUpMap['positive'];
  }
}
