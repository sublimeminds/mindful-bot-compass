import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, 
  Square, 
  Play, 
  Upload, 
  Trash2, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { voiceCloneService, VoiceCloneProfile, VoiceSample } from '@/services/voiceCloneService';
import { useToast } from '@/hooks/use-toast';

const VoiceCloneManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<VoiceCloneProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<VoiceCloneProfile | null>(null);
  const [newVoiceName, setNewVoiceName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSamples, setRecordedSamples] = useState<VoiceSample[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const trainingTexts = [
    "Hello, I'm here to support you through your mental health journey. You're taking an important step by seeking help.",
    "Let's explore your feelings together. Remember that it's completely normal to experience a wide range of emotions.",
    "I want you to know that this is a safe space where you can share anything that's on your mind without judgment.",
    "Take a deep breath with me. Sometimes slowing down and focusing on our breathing can help us feel more grounded.",
    "Your mental health matters, and I'm committed to helping you develop the tools and strategies you need to thrive."
  ];

  useEffect(() => {
    if (user) {
      loadUserProfiles();
    }
  }, [user]);

  const loadUserProfiles = async () => {
    try {
      const userProfiles = await voiceCloneService.getUserVoiceProfiles(user!.id);
      setProfiles(userProfiles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load voice profiles",
        variant: "destructive"
      });
    }
  };

  const createNewProfile = async () => {
    if (!newVoiceName.trim() || !user) return;

    try {
      const profile = await voiceCloneService.createVoiceCloneProfile(user.id, newVoiceName);
      setProfiles([profile, ...profiles]);
      setCurrentProfile(profile);
      setNewVoiceName('');
      toast({
        title: "Success",
        description: "Voice profile created! Start recording samples."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create voice profile",
        variant: "destructive"
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access microphone",
        variant: "destructive"
      });
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !currentProfile) return;

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      try {
        const sample = await voiceCloneService.uploadVoiceSample(
          currentProfile.id,
          audioBlob,
          currentTranscript
        );
        
        setRecordedSamples([...recordedSamples, sample]);
        setCurrentTranscript('');
        
        toast({
          title: "Sample Recorded",
          description: `Quality score: ${(sample.qualityScore * 100).toFixed(0)}%`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save voice sample",
          variant: "destructive"
        });
      }
    };
  };

  const startTraining = async () => {
    if (!currentProfile || recordedSamples.length < 3) {
      toast({
        title: "Insufficient Samples",
        description: "At least 3 high-quality samples are required",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 2000);

    try {
      await voiceCloneService.trainVoiceClone(currentProfile.id);
      setTrainingProgress(100);
      
      toast({
        title: "Training Complete!",
        description: "Your custom voice is ready to use"
      });

      // Reload profiles to get updated status
      await loadUserProfiles();
    } catch (error) {
      toast({
        title: "Training Failed",
        description: "Please try again with different samples",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
      clearInterval(progressInterval);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'training': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-therapy-600" />
            Voice Cloning (Premium Feature)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="voiceName">Create New Voice Profile</Label>
              <Input
                id="voiceName"
                value={newVoiceName}
                onChange={(e) => setNewVoiceName(e.target.value)}
                placeholder="My Therapeutic Voice"
              />
            </div>
            <Button 
              onClick={createNewProfile}
              disabled={!newVoiceName.trim()}
            >
              Create Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Profiles */}
      {profiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Voice Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <div 
                  key={profile.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentProfile?.id === profile.id 
                      ? 'border-therapy-300 bg-therapy-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentProfile(profile)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{profile.voiceName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.sampleCount} samples • Quality: {(profile.qualityScore * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(profile.trainingStatus)}>
                        {getStatusIcon(profile.trainingStatus)}
                        {profile.trainingStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Recording */}
      {currentProfile && currentProfile.trainingStatus === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Record Training Samples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Training Text {recordedSamples.length + 1} of {trainingTexts.length}:
              </p>
              <p className="text-blue-700">
                {trainingTexts[recordedSamples.length] || "All samples recorded!"}
              </p>
            </div>

            {recordedSamples.length < trainingTexts.length && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transcript">Read the text above, then record:</Label>
                  <Input
                    id="transcript"
                    value={currentTranscript}
                    onChange={(e) => setCurrentTranscript(e.target.value)}
                    placeholder="Type what you'll say (for accuracy verification)"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    disabled={!currentTranscript.trim()}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Sample Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{recordedSamples.length}/{trainingTexts.length} samples</span>
              </div>
              <Progress value={(recordedSamples.length / trainingTexts.length) * 100} />
            </div>

            {/* Start Training */}
            {recordedSamples.length >= 3 && (
              <Separator className="my-4" />
            )}
            
            {recordedSamples.length >= 3 && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Ready to train your custom voice!
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    This will take 5-10 minutes. You can close this page and check back later.
                  </p>
                </div>

                {isTraining && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training AI Model...</span>
                      <span>{trainingProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={trainingProgress} />
                  </div>
                )}

                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="w-full"
                >
                  {isTraining ? 'Training in Progress...' : 'Start Voice Training'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceCloneManager;
