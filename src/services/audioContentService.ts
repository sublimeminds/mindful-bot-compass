
interface AudioContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
  script?: string;
}

interface GuidedTechnique {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  instructions: string[];
  audioScript?: string;
}

class AudioContentServiceClass {
  private audioContent: AudioContent[] = [
    {
      id: '1',
      title: 'Deep Breathing Exercise',
      description: 'A calming breathing technique to reduce anxiety',
      duration: 300, // 5 minutes
      category: 'Breathing',
      difficulty: 'beginner',
      script: 'Find a comfortable position and close your eyes. Take a slow, deep breath in through your nose for 4 counts...'
    },
    {
      id: '2',
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic relaxation of muscle groups',
      duration: 600, // 10 minutes
      category: 'Relaxation',
      difficulty: 'intermediate',
      script: 'Start by tensing the muscles in your toes for 5 seconds, then release...'
    },
    {
      id: '3',
      title: 'Mindfulness Meditation',
      description: 'Present moment awareness practice',
      duration: 720, // 12 minutes
      category: 'Mindfulness',
      difficulty: 'beginner',
      script: 'Sit comfortably and focus on your breath. Notice each inhale and exhale...'
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

  async getAudioContent(): Promise<AudioContent[]> {
    // Simulate API delay
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

  async getContentByCategory(category: string): Promise<AudioContent[]> {
    return this.audioContent.filter(item => item.category === category);
  }

  async searchContent(query: string): Promise<AudioContent[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.audioContent.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async playAudioContent(contentId: string): Promise<void> {
    const content = await this.getContentById(contentId);
    if (content && content.script) {
      // Use voice service to play the script
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
}

export const audioContentService = new AudioContentServiceClass();
