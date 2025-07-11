import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image, 
  Camera,
  FileImage
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of files) {
        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `Please upload only ${acceptedTypes.join(', ')} files.`,
            variant: "destructive"
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. Please upload files under 5MB.`,
            variant: "destructive"
          });
          continue;
        }

        // Convert to base64 for preview (in real app, upload to storage)
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
      
      if (newImages.length > 0) {
        toast({
          title: "Images uploaded",
          description: `${newImages.length} image(s) uploaded successfully.`
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {canUploadMore && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="relative"
          >
            <input
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          
          <div className="text-xs text-gray-500">
            {images.length}/{maxImages} images • Max 5MB each
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                <div className="flex items-center justify-center">
                  <FileImage className="h-3 w-3 mr-1" />
                  Image {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">
            Add images to your discussion
          </p>
          <p className="text-xs text-gray-400">
            Supports JPEG, PNG, GIF, WebP • Max {maxImages} images • 5MB each
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;