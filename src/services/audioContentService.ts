
export interface AudioContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  script?: string;
  tier?: 'free' | 'premium' | 'pro';
  voiceName: string;
  tags: string[];
}

export interface GuidedTechnique {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  instructions: string[];
  audioScript?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description: string;
  category: string;
  audioContent: AudioContent[];
  totalDuration: string;
  isPersonalized?: boolean;
}

class AudioContentServiceClass {
  private audioContent: AudioContent[] = [
    {
      id: '1',
      title: 'Deep Breathing Exercise',
      description: 'A calming breathing technique to reduce anxiety',
      duration: '5 min',
      category: 'meditation',
      difficulty: 'beginner',
      tier: 'free',
      voiceName: 'Dr. Sarah Chen',
      tags: ['breathing', 'anxiety', 'relaxation'],
      script: 'Find a comfortable position and close your eyes. Take a slow, deep breath in through your nose for 4 counts...'
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic relaxation of muscle groups',
      duration: '10 min',
      category: 'technique',
      difficulty: 'intermediate',
      tier: 'premium',
      voiceName: 'Dr. Michael Thompson',
      tags: ['relaxation', 'muscle', 'stress'],
      script: 'Start by tensing the muscles in your toes for 5 seconds, then release...'
    },
    {
      id: '3',
      title: 'Mindfulness Meditation',
      description: 'Present moment awareness practice',
      duration: '12 min',
      category: 'meditation',
      difficulty: 'beginner',
      tier: 'free',
      voiceName: 'Dr. Elena Rodriguez',
      tags: ['mindfulness', 'awareness', 'meditation'],
      script: 'Sit comfortably and focus on your breath. Notice each inhale and exhale...'
    },
    {
      id: '4',
      title: 'Sleep Stories - Forest Journey',
      description: 'A peaceful journey through an enchanted forest',
      duration: '25 min',
      category: 'sleep',
      difficulty: 'beginner',
      tier: 'premium',
      voiceName: 'Dr. Sarah Chen',
      tags: ['sleep', 'story', 'relaxation']
    },
    {
      id: '5',
      title: 'Anxiety Management Podcast',
      description: 'Expert insights on managing daily anxiety',
      duration: '18 min',
      category: 'podcast',
      difficulty: 'intermediate',
      tier: 'pro',
      voiceName: 'Dr. Michael Thompson',
      tags: ['anxiety', 'education', 'coping']
    }
  ];

  private guidedTechniques: GuidedTechnique[] = [
    {
      id: 'breathing-4-7-8',
      name: '4-7-8 Breathing',
      description: 'A powerful breathing technique for relaxation',
      category: 'Breathing',
      duration: 240,
      instructions: [
        'Sit comfortably with your back straight',
        'Place your tongue against the roof of your mouth behind your teeth',
        'Exhale completely through your mouth',
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 3-4 times'
      ],
      audioScript: 'Welcome to the 4-7-8 breathing technique. This ancient practice will help calm your nervous system...'
    },
    {
      id: 'body-scan',
      name: 'Body Scan Meditation',
      description: 'Systematic awareness of body sensations',
      category: 'Mindfulness',
      duration: 900,
      instructions: [
        'Lie down comfortably on your back',
        'Close your eyes and take three deep breaths',
        'Start by focusing on your toes',
        'Slowly move your attention up through each part of your body',
        'Notice any sensations without judgment',
        'Spend 30 seconds on each body part',
        'End by taking three deep breaths'
      ],
      audioScript: 'Let\'s begin with a body scan meditation. Find a comfortable position lying down...'
    }
  ];

  private playlists: AudioPlaylist[] = [
    {
      id: 'daily-meditation',
      name: 'Daily Meditation Pack',
      description: 'Essential meditations for daily practice',
      category: 'meditation',
      audioContent: [],
      totalDuration: '45 min',
      isPersonalized: false
    }
  ];

  async getAudioContent(): Promise<AudioContent[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.audioContent;
  }

  async getGuidedTechniques(): Promise<GuidedTechnique[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.guidedTechniques;
  }

  async getContentById(id: string): Promise<AudioContent | null> {
    const content = this.audioContent.find(item => item.id === id);
    return content || null;
  }

  async getTechniqueById(id: string): Promise<GuidedTechnique | null> {
    const technique = this.guidedTechniques.find(item => item.id === id);
    return technique || null;
  }

  getContentByCategory(category: string): AudioContent[] {
    if (category === 'all') return this.audioContent;
    return this.audioContent.filter(item => item.category === category);
  }

  getContentByTier(tier: string): AudioContent[] {
    if (tier === 'pro') return this.audioContent;
    if (tier === 'premium') return this.audioContent.filter(item => item.tier !== 'pro');
    return this.audioContent.filter(item => item.tier === 'free');
  }

  searchContent(query: string): AudioContent[] {
    const lowercaseQuery = query.toLowerCase();
    return this.audioContent.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getAllPlaylists(): AudioPlaylist[] {
    return this.playlists;
  }

  async playAudioContent(contentId: string): Promise<void> {
    const content = await this.getContentById(contentId);
    if (content && content.script) {
      const { enhancedVoiceService } = await import('./voiceService');
      await enhancedVoiceService.playText(content.script);
    }
  }

  async playGuidedTechnique(techniqueId: string): Promise<void> {
    const technique = await this.getTechniqueById(techniqueId);
    if (technique && technique.audioScript) {
      const { enhancedVoiceService } = await import('./voiceService');
      await enhancedVoiceService.playText(technique.audioScript);
    }
  }

  async generateAudioContent(content: AudioContent): Promise<void> {
    // Simulate audio generation
    console.log('Generating audio for:', content.title);
  }

  hasApiKey(): boolean {
    return true; // Simplified for demo
  }

  setApiKey(key: string): void {
    console.log('API key set:', key);
  }
}

export const audioContentService = new AudioContentServiceClass();
export default audioContentService;
