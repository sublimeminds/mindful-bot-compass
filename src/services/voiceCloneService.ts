import { supabase } from '@/integrations/supabase/client';

export interface VoiceCloneProfile {
  id: string;
  userId: string;
  voiceName: string;
  clonedVoiceId: string;
  trainingStatus: 'pending' | 'training' | 'completed' | 'failed';
  sampleCount: number;
  qualityScore: number;
  createdAt: Date;
}

export interface VoiceSample {
  id: string;
  profileId: string;
  audioBlob: Blob;
  transcript: string;
  duration: number;
  qualityScore: number;
}

class VoiceCloneService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('elevenlabs_api_key');
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }

  async createVoiceCloneProfile(userId: string, voiceName: string): Promise<VoiceCloneProfile> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not set');
    }

    const profile: VoiceCloneProfile = {
      id: crypto.randomUUID(),
      userId,
      voiceName,
      clonedVoiceId: '',
      trainingStatus: 'pending',
      sampleCount: 0,
      qualityScore: 0,
      createdAt: new Date()
    };

    // Store in Supabase
    const { error } = await supabase
      .from('voice_clone_profiles')
      .insert([{
        id: profile.id,
        user_id: profile.userId,
        voice_name: profile.voiceName,
        training_status: profile.trainingStatus,
        sample_count: profile.sampleCount,
        quality_score: profile.qualityScore
      }]);

    if (error) throw error;
    return profile;
  }

  async uploadVoiceSample(
    profileId: string, 
    audioBlob: Blob, 
    transcript: string
  ): Promise<VoiceSample> {
    const sample: VoiceSample = {
      id: crypto.randomUUID(),
      profileId,
      audioBlob,
      transcript,
      duration: 0, // Will be calculated
      qualityScore: 0
    };

    // Upload to Supabase Storage
    const fileName = `voice-samples/${profileId}/${sample.id}.wav`;
    const { error: uploadError } = await supabase.storage
      .from('voice-clones')
      .upload(fileName, audioBlob);

    if (uploadError) throw uploadError;

    // Analyze sample quality
    sample.qualityScore = await this.analyzeAudioQuality(audioBlob);
    sample.duration = await this.getAudioDuration(audioBlob);

    // Store sample metadata
    const { error } = await supabase
      .from('voice_samples')
      .insert([{
        id: sample.id,
        profile_id: sample.profileId,
        transcript: sample.transcript,
        duration: sample.duration,
        quality_score: sample.qualityScore,
        file_path: fileName
      }]);

    if (error) throw error;
    return sample;
  }

  async trainVoiceClone(profileId: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not set');
    }

    // Get all samples for this profile
    const { data: samples, error } = await supabase
      .from('voice_samples')
      .select('*')
      .eq('profile_id', profileId);

    if (error) throw error;
    if (!samples || samples.length < 3) {
      throw new Error('At least 3 voice samples required for training');
    }

    // Update status to training
    await supabase
      .from('voice_clone_profiles')
      .update({ training_status: 'training' })
      .eq('id', profileId);

    try {
      // Create voice clone with ElevenLabs
      const formData = new FormData();
      formData.append('name', `Custom Voice ${profileId}`);
      formData.append('description', 'User-trained therapeutic voice');

      // Add audio files
      for (const sample of samples) {
        const { data: audioData } = await supabase.storage
          .from('voice-clones')
          .download(sample.file_path);
        
        if (audioData) {
          formData.append('files', audioData, `sample_${sample.id}.wav`);
        }
      }

      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs training failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Update profile with completed training
      await supabase
        .from('voice_clone_profiles')
        .update({ 
          training_status: 'completed',
          cloned_voice_id: result.voice_id,
          quality_score: this.calculateOverallQuality(samples)
        })
        .eq('id', profileId);

    } catch (error) {
      // Update status to failed
      await supabase
        .from('voice_clone_profiles')
        .update({ training_status: 'failed' })
        .eq('id', profileId);
      
      throw error;
    }
  }

  async generateWithClonedVoice(
    clonedVoiceId: string, 
    text: string,
    emotionalContext: any
  ): Promise<string | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${clonedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: emotionalContext?.crisisLevel ? 0.95 : 0.8,
            similarity_boost: 0.9,
            style: emotionalContext?.intensity > 0.7 ? 0.3 : 0.6,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) throw new Error(`Voice synthesis failed: ${response.status}`);

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating cloned voice:', error);
      return null;
    }
  }

  private async analyzeAudioQuality(audioBlob: Blob): Promise<number> {
    // Placeholder for audio quality analysis
    // In production, this would analyze noise, clarity, etc.
    return Math.random() * 0.3 + 0.7; // 0.7-1.0 range
  }

  private async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
    });
  }

  private calculateOverallQuality(samples: any[]): number {
    const avgQuality = samples.reduce((sum, sample) => sum + sample.quality_score, 0) / samples.length;
    const sampleBonus = Math.min(samples.length / 10, 0.2); // Bonus for more samples
    return Math.min(avgQuality + sampleBonus, 1.0);
  }

  async getUserVoiceProfiles(userId: string): Promise<VoiceCloneProfile[]> {
    const { data, error } = await supabase
      .from('voice_clone_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data?.map(profile => ({
      id: profile.id,
      userId: profile.user_id,
      voiceName: profile.voice_name,
      clonedVoiceId: profile.cloned_voice_id || '',
      trainingStatus: profile.training_status,
      sampleCount: profile.sample_count,
      qualityScore: profile.quality_score,
      createdAt: new Date(profile.created_at)
    })) || [];
  }
}

export const voiceCloneService = new VoiceCloneService();