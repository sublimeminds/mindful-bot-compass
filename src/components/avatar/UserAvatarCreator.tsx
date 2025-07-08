import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, User, Shirt, Sparkles, Heart, Settings, Save } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { Skeleton } from '@/components/ui/skeleton';

// Simple 3D Avatar Component
const SimpleAvatar: React.FC<{
  config: any;
  mood: string;
  isAnimating: boolean;
}> = ({ config, mood, isAnimating }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Simple breathing animation
    if (isAnimating) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    
    // Mood-based rotation
    if (mood === 'happy') {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return '#FFD700';
      case 'sad': return '#6B7280';
      case 'excited': return '#FF6B6B';
      case 'calm': return '#4A90E2';
      case 'confident': return '#9333EA';
      default: return '#8B5CF6';
    }
  };

  return (
    <group>
      {/* Body */}
      <mesh ref={meshRef} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 1.5, 8]} />
        <meshPhongMaterial color={config.clothing?.color || '#4A90E2'} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhongMaterial color={config.skin_tone || '#F4C2A1'} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshPhongMaterial color={config.hair_color || '#8B4513'} />
      </mesh>
      
      {/* Mood aura */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshPhongMaterial 
          color={getMoodColor(mood)} 
          transparent 
          opacity={0.1} 
          wireframe 
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 0.9, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
      <mesh position={[0.15, 0.9, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshPhongMaterial color="#000000" />
      </mesh>
    </group>
  );
};

const UserAvatarCreator = () => {
  const { 
    avatarProfile, 
    createAvatar, 
    customizeAvatar, 
    updateMood,
    hasAvatar,
    getMoodEmoji,
    isLoading 
  } = useUserAvatar();

  const [avatarName, setAvatarName] = useState('My Avatar');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [isAnimating, setIsAnimating] = useState(true);
  const [avatarConfig, setAvatarConfig] = useState({
    skin_tone: '#F4C2A1',
    hair_color: '#8B4513',
    hair_style: 'short',
    clothing: {
      color: '#4A90E2',
      style: 'casual'
    }
  });

  const moods = [
    'neutral', 'happy', 'sad', 'excited', 'calm', 'anxious', 
    'confident', 'peaceful', 'thoughtful', 'energetic'
  ];

  const skinTones = [
    '#F4C2A1', '#E8B895', '#D4A574', '#C89162', 
    '#B07D4F', '#9C693C', '#8B5A3C', '#7A4C32'
  ];

  const hairColors = [
    '#8B4513', '#654321', '#D2691E', '#A0522D',
    '#FFD700', '#FF6347', '#9400D3', '#000000'
  ];

  const clothingColors = [
    '#4A90E2', '#50C878', '#FF6B6B', '#9333EA',
    '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
  ];

  const handleCreateAvatar = () => {
    createAvatar({
      avatar_name: avatarName,
      appearance_config: avatarConfig,
      current_mood: selectedMood
    });
  };

  const handleSaveChanges = () => {
    if (hasAvatar) {
      customizeAvatar({
        avatar_name: avatarName,
        appearance_config: avatarConfig
      });
      updateMood({ mood: selectedMood });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-6 w-6 text-therapy-600" />
          <div>
            <h2 className="text-2xl font-bold text-therapy-900">
              {hasAvatar ? 'Customize Your Avatar' : 'Create Your Avatar'}
            </h2>
            <p className="text-therapy-600">
              Design your personal 3D avatar that reflects your mood and personality
            </p>
          </div>
        </div>
        {hasAvatar && (
          <Badge className="bg-green-100 text-green-800">
            Avatar Active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Avatar Preview */}
        <Card className="h-96">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-therapy-600" />
              <span>Avatar Preview</span>
              <Badge variant="outline" className="ml-auto">
                {getMoodEmoji(selectedMood)} {selectedMood}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <div className="w-full h-full bg-gradient-to-br from-therapy-50 to-calm-50 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Suspense fallback={null}>
                  <SimpleAvatar 
                    config={avatarConfig}
                    mood={selectedMood}
                    isAnimating={isAnimating}
                  />
                </Suspense>
                
                <OrbitControls 
                  enableZoom={true}
                  enablePan={false}
                  minDistance={2}
                  maxDistance={5}
                />
              </Canvas>
            </div>
          </CardContent>
        </Card>

        {/* Customization Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-therapy-600" />
              <span>Customization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="mood">Mood</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="animation">Animation</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-therapy-700 mb-2 block">
                    Avatar Name
                  </label>
                  <Input
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter avatar name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-therapy-700 mb-2 block">
                    Skin Tone
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {skinTones.map((tone) => (
                      <button
                        key={tone}
                        onClick={() => setAvatarConfig(prev => ({ ...prev, skin_tone: tone }))}
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${avatarConfig.skin_tone === tone 
                            ? 'border-therapy-600 ring-2 ring-therapy-200' 
                            : 'border-gray-300 hover:border-therapy-400'
                          }
                        `}
                        style={{ backgroundColor: tone }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-therapy-700 mb-2 block">
                    Hair Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {hairColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatarConfig(prev => ({ ...prev, hair_color: color }))}
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${avatarConfig.hair_color === color 
                            ? 'border-therapy-600 ring-2 ring-therapy-200' 
                            : 'border-gray-300 hover:border-therapy-400'
                          }
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mood" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-therapy-700 mb-2 block">
                    Current Mood
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood}
                        variant={selectedMood === mood ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood(mood)}
                        className="justify-start"
                      >
                        <span className="mr-2">{getMoodEmoji(mood)}</span>
                        <span className="capitalize">{mood}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-therapy-700 mb-2 block">
                    Clothing Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {clothingColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatarConfig(prev => ({ 
                          ...prev, 
                          clothing: { ...prev.clothing, color } 
                        }))}
                        className={`
                          w-12 h-12 rounded-full border-2 transition-all
                          ${avatarConfig.clothing.color === color 
                            ? 'border-therapy-600 ring-2 ring-therapy-200' 
                            : 'border-gray-300 hover:border-therapy-400'
                          }
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="animation" className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="animation"
                    checked={isAnimating}
                    onChange={(e) => setIsAnimating(e.target.checked)}
                    className="rounded border-therapy-300"
                  />
                  <label htmlFor="animation" className="text-sm font-medium text-therapy-700">
                    Enable breathing animation
                  </label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-therapy-200">
              {hasAvatar ? (
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full bg-therapy-600 hover:bg-therapy-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button 
                  onClick={handleCreateAvatar}
                  className="w-full bg-therapy-600 hover:bg-therapy-700"
                >
                  <User className="h-4 w-4 mr-2" />
                  Create Avatar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAvatarCreator;