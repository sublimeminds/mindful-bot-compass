
import { supabase } from '@/integrations/supabase/client';

interface GenerateProfileImageRequest {
  therapistName: string;
  specialization: string;
  culturalBackground: string;
  personality: string[];
  gender: 'male' | 'female' | 'non-binary';
}

interface GenerateProfileImageResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export const profileImageService = {
  async generateProfileImage(request: GenerateProfileImageRequest): Promise<GenerateProfileImageResponse> {
    try {
      // Create a detailed prompt for professional therapist profile picture
      const personalityTraits = request.personality.join(', ');
      const prompt = `Professional headshot portrait of a ${request.gender} therapist specialist in ${request.specialization}. 
        Person should appear ${personalityTraits.toLowerCase()}, warm, and approachable. 
        Background: ${request.culturalBackground}. 
        Style: Professional medical portrait, soft lighting, neutral background, 
        business attire, gentle expression, trustworthy appearance, high quality, photorealistic, 
        studio lighting, professional photography, 4K resolution`;

      const { data, error } = await supabase.functions.invoke('generate-profile-image', {
        body: { prompt }
      });

      if (error) {
        console.error('Error generating profile image:', error);
        return {
          success: false,
          error: error.message,
          imageUrl: '/api/placeholder/300/300'
        };
      }

      return {
        success: true,
        imageUrl: data.image || '/api/placeholder/300/300'
      };
    } catch (error) {
      console.error('Profile image generation error:', error);
      return {
        success: false,
        error: 'Failed to generate profile image',
        imageUrl: '/api/placeholder/300/300'
      };
    }
  },

  async uploadProfileImage(imageData: string, therapistId: string): Promise<string | null> {
    try {
      // Convert base64 to blob
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const fileName = `therapist-profiles/${therapistId}.png`;
      
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: publicData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  }
};
