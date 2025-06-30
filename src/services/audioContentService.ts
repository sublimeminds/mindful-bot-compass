import { enhancedVoiceService } from './voiceService';

export interface AudioContent {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  duration: string;
  voiceId: string;
  voiceName: string;
  model: string;
  script: string;
  audioUrl?: string;
  isGenerated: boolean;
  tags: string[];
  therapyType?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tier?: 'free' | 'premium' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description: string;
  category: string;
  audioContent: AudioContent[];
  totalDuration: string;
  isPersonalized: boolean;
  userId?: string;
}

class AudioContentService {
  private apiKey: string | null = null;
  private contentLibrary: AudioContent[] = [];
  private playlists: AudioPlaylist[] = [];

  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
    this.initializeDefaultContent();
  }

  // Set ElevenLabs API key
  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
    enhancedVoiceService.setApiKey(key);
  }

  // Check if API key is available
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Initialize default content library with tier restrictions
  private initializeDefaultContent(): void {
    this.contentLibrary = [
      // Free Content (limited)
      {
        id: 'meditation-daily-mindfulness-01',
        title: 'Morning Mindfulness (Free Sample)',
        description: 'Start your day with intention and calm awareness - 5 minute sample',
        category: 'meditation',
        subcategory: 'mindfulness',
        duration: '5:00',
        voiceId: '9BWtsMINqrJLrRacOk9x',
        voiceName: 'Aria',
        model: 'eleven_multilingual_v2',
        script: 'Welcome to your morning mindfulness practice sample. Find a comfortable position and close your eyes gently. Take a deep breath in through your nose...',
        isGenerated: false,
        tags: ['morning', 'mindfulness', 'breathing', 'free'],
        difficulty: 'beginner',
        tier: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Premium Content
      {
        id: 'meditation-daily-mindfulness-full',
        title: 'Complete Morning Mindfulness',
        description: 'Full 15-minute morning mindfulness practice with body scan and intention setting',
        category: 'meditation',
        subcategory: 'mindfulness',
        duration: '15:00',
        voiceId: '9BWtsMINqrJLrRacOk9x',
        voiceName: 'Aria',
        model: 'eleven_multilingual_v2',
        script: 'Welcome to your complete morning mindfulness practice. Find a comfortable position and close your eyes gently. We will begin with breath awareness, move through a gentle body scan, and conclude with intention setting for your day...',
        isGenerated: false,
        tags: ['morning', 'mindfulness', 'body scan', 'intention', 'premium'],
        difficulty: 'intermediate',
        tier: 'premium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
        id: 'podcast-anxiety-deep-dive',
        title: 'Understanding Anxiety: Complete Guide',
        description: 'Comprehensive exploration of anxiety causes, symptoms, and evidence-based treatments',
        category: 'podcast',
        subcategory: 'education',
        duration: '35:00',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        voiceName: 'Sarah',
        model: 'eleven_multilingual_v2',
        script: 'Welcome to a comprehensive exploration of anxiety. Today we will dive deep into the neuroscience of anxiety, explore various types of anxiety disorders, and discuss evidence-based treatment approaches...',
        isGenerated: false,
        tags: ['anxiety', 'education', 'neuroscience', 'treatment', 'premium'],
        therapyType: 'general',
        difficulty: 'advanced',
        tier: 'premium',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Pro Content
      {
        id: 'technique-advanced-dbt-skills',
        title: 'Advanced DBT Skills Masterclass',
        description: 'Master-level dialectical behavior therapy techniques for emotional regulation',
        category: 'technique',
        subcategory: 'dbt',
        duration: '45:00',
        voiceId: 'FGY2WhTYpPnrIDTdsKH5',
        voiceName: 'Laura',
        model: 'eleven_multilingual_v2',
        script: 'Welcome to advanced DBT skills training. Today we will explore complex distress tolerance techniques, advanced interpersonal effectiveness strategies, and sophisticated emotional regulation skills...',
        isGenerated: false,
        tags: ['dbt', 'advanced', 'emotional regulation', 'distress tolerance', 'pro'],
        therapyType: 'dbt',
        difficulty: 'advanced',
        tier: 'pro',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.initializeDefaultPlaylists();
  }

  // Filter content by user's subscription tier
  getContentByTier(userTier: string = 'free'): AudioContent[] {
    const accessibleTiers = this.getAccessibleTiers(userTier);
    return this.contentLibrary.filter(content => 
      accessibleTiers.includes(content.tier || 'free')
    );
  }

  private getAccessibleTiers(userTier: string): string[] {
    switch (userTier) {
      case 'pro':
        return ['free', 'premium', 'pro'];
      case 'premium':
        return ['free', 'premium'];
      case 'free':
      default:
        return ['free'];
    }
  }

  // Initialize default playlists
  private initializeDefaultPlaylists(): void {
    this.playlists = [
      {
        id: 'playlist-morning-routine',
        name: 'Morning Mental Health Routine',
        description: 'Start your day with mindfulness and positive intention',
        category: 'morning',
        audioContent: this.contentLibrary.filter(content => 
          content.tags.includes('morning') || content.subcategory === 'mindfulness'
        ),
        totalDuration: '30:00',
        isPersonalized: false
      },
      {
        id: 'playlist-anxiety-relief',
        name: 'Anxiety Relief Toolkit',
        description: 'Immediate and long-term strategies for managing anxiety',
        category: 'anxiety',
        audioContent: this.contentLibrary.filter(content => 
          content.tags.includes('anxiety') || content.tags.includes('grounding')
        ),
        totalDuration: '45:00',
        isPersonalized: false
      },
      {
        id: 'playlist-adhd-support',
        name: 'ADHD Focus & Support',
        description: 'Specialized content for ADHD brains',
        category: 'adhd',
        audioContent: this.contentLibrary.filter(content => 
          content.therapyType === 'adhd' || content.tags.includes('focus')
        ),
        totalDuration: '35:00',
        isPersonalized: false
      },
      {
        id: 'playlist-sleep-preparation',
        name: 'Sleep & Relaxation',
        description: 'Wind down and prepare for restful sleep',
        category: 'sleep',
        audioContent: this.contentLibrary.filter(content => 
          content.subcategory === 'sleep' || content.tags.includes('relaxation')
        ),
        totalDuration: '50:00',
        isPersonalized: false
      }
    ];
  }

  // Generate audio content using ElevenLabs
  async generateAudioContent(content: AudioContent): Promise<string | null> {
    if (!this.hasApiKey()) {
      console.warn('ElevenLabs API key not available');
      return null;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${content.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!
        },
        body: JSON.stringify({
          text: content.script,
          model_id: content.model,
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Update content with generated audio URL
      content.audioUrl = audioUrl;
      content.isGenerated = true;
      content.updatedAt = new Date();
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio content:', error);
      return null;
    }
  }

  // Play audio content
  async playAudioContent(contentId: string): Promise<void> {
    const content = this.getContentById(contentId);
    if (!content) {
      throw new Error('Content not found');
    }

    if (content.audioUrl) {
      // Play generated audio
      const audio = new Audio(content.audioUrl);
      await audio.play();
    } else if (this.hasApiKey()) {
      // Generate and play audio
      const audioUrl = await this.generateAudioContent(content);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } else {
      // Fallback to text-to-speech
      await enhancedVoiceService.playWithWebSpeech(content.script, content.voiceId);
    }
  }

  // Get content by ID
  getContentById(id: string): AudioContent | null {
    return this.contentLibrary.find(content => content.id === id) || null;
  }

  // Get content by category
  getContentByCategory(category: string, userTier: string = 'free'): AudioContent[] {
    const accessibleContent = this.getContentByTier(userTier);
    return category === 'all' 
      ? accessibleContent 
      : accessibleContent.filter(content => content.category === category);
  }

  // Get content by therapy type
  getContentByTherapyType(therapyType: string): AudioContent[] {
    return this.contentLibrary.filter(content => content.therapyType === therapyType);
  }

  // Get personalized recommendations
  getPersonalizedRecommendations(userId: string, preferences: any): AudioContent[] {
    // Simple recommendation based on preferences
    // In a real app, this would use ML algorithms
    const recommended = this.contentLibrary.filter(content => {
      if (preferences.categories && preferences.categories.length > 0) {
        return preferences.categories.includes(content.category);
      }
      if (preferences.therapyTypes && preferences.therapyTypes.length > 0) {
        return preferences.therapyTypes.includes(content.therapyType);
      }
      return true;
    });

    return recommended.slice(0, 10); // Return top 10 recommendations
  }

  // Create custom playlist
  createPlaylist(name: string, description: string, contentIds: string[], userId?: string): AudioPlaylist {
    const audioContent = contentIds.map(id => this.getContentById(id)).filter(Boolean) as AudioContent[];
    const totalMinutes = audioContent.reduce((total, content) => {
      const [minutes, seconds] = content.duration.split(':').map(Number);
      return total + minutes + (seconds / 60);
    }, 0);
    
    const playlist: AudioPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      category: 'custom',
      audioContent,
      totalDuration: `${Math.floor(totalMinutes)}:${String(Math.floor((totalMinutes % 1) * 60)).padStart(2, '0')}`,
      isPersonalized: true,
      userId
    };

    this.playlists.push(playlist);
    return playlist;
  }

  // Get all playlists
  getAllPlaylists(): AudioPlaylist[] {
    return this.playlists;
  }

  // Get playlist by ID
  getPlaylistById(id: string): AudioPlaylist | null {
    return this.playlists.find(playlist => playlist.id === id) || null;
  }

  // Get user playlists
  getUserPlaylists(userId: string): AudioPlaylist[] {
    return this.playlists.filter(playlist => playlist.userId === userId);
  }

  // Search content
  searchContent(query: string): AudioContent[] {
    const searchTerms = query.toLowerCase().split(' ');
    return this.contentLibrary.filter(content => {
      const searchableText = `${content.title} ${content.description} ${content.tags.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  }

  // Get content statistics
  getContentStats(): any {
    const stats = {
      totalContent: this.contentLibrary.length,
      byCategory: {} as Record<string, number>,
      byTherapyType: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      totalPlaylists: this.playlists.length
    };

    this.contentLibrary.forEach(content => {
      stats.byCategory[content.category] = (stats.byCategory[content.category] || 0) + 1;
      if (content.therapyType) {
        stats.byTherapyType[content.therapyType] = (stats.byTherapyType[content.therapyType] || 0) + 1;
      }
      if (content.difficulty) {
        stats.byDifficulty[content.difficulty] = (stats.byDifficulty[content.difficulty] || 0) + 1;
      }
    });

    return stats;
  }

  // Batch generate audio for multiple content items
  async batchGenerateAudio(contentIds: string[]): Promise<{ success: string[], failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const contentId of contentIds) {
      try {
        const content = this.getContentById(contentId);
        if (content && !content.isGenerated) {
          const audioUrl = await this.generateAudioContent(content);
          if (audioUrl) {
            results.success.push(contentId);
          } else {
            results.failed.push(contentId);
          }
        }
      } catch (error) {
        console.error(`Failed to generate audio for ${contentId}:`, error);
        results.failed.push(contentId);
      }
    }
    
    return results;
  }
}

// Create and export the service instance
const audioContentService = new AudioContentService();
export default audioContentService;
