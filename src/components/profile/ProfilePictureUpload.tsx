
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

const ProfilePictureUpload = ({ currentAvatarUrl, onAvatarUpdate }: ProfilePictureUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      let { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(data.publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setPreview(null);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user?.id);

      if (error) throw error;

      onAvatarUpdate('');
      toast({
        title: "Success",
        description: "Profile picture removed successfully!",
      });

    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview || currentAvatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-therapy-500 to-calm-500 text-white text-xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2">
          <label htmlFor="avatar-upload">
            <Button
              size="sm"
              className="rounded-full h-8 w-8 p-0"
              disabled={uploading}
              asChild
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="hidden"
      />

      <div className="flex space-x-2">
        <label htmlFor="avatar-upload">
          <Button variant="outline" size="sm" disabled={uploading} asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </span>
          </Button>
        </label>
        
        {currentAvatarUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeAvatar}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
