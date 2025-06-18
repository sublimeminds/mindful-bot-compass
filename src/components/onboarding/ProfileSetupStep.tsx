
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Sparkles } from "lucide-react";

interface ProfileSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ProfileSetupStep: React.FC<ProfileSetupStepProps> = ({ onNext, onBack }) => {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-full">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Personalize Your Profile</h2>
        <p className="text-muted-foreground">
          Help us create a more personal experience for you.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-harmony-100 text-harmony-600 text-xl">
                  {name ? getInitials(name) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-harmony-500 hover:bg-harmony-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Upload a photo or we'll use your initials
            </p>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              What should we call you?
            </Label>
            <Input
              id="name"
              placeholder="Enter your preferred name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              This helps your AI therapist address you personally
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-flow-50 p-4 rounded-lg border border-flow-200">
        <p className="text-sm text-flow-800">
          🔒 <strong>Your privacy matters:</strong> Your profile information is secure and only used to personalize your TherapySync experience.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!name.trim()}
          className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetupStep;
