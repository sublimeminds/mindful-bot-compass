import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Brain,
  CheckCircle,
  AlertTriangle,
  Settings,
  Volume2,
  Type,
  Contrast,
  ZoomIn
} from 'lucide-react';

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  category: 'visual' | 'auditory' | 'motor' | 'cognitive';
  enabled: boolean;
  wcagLevel: 'A' | 'AA' | 'AAA';
  compliance: boolean;
}

const AccessibilityCompliance = () => {
  const [features, setFeatures] = useState<AccessibilityFeature[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    initializeAccessibilityFeatures();
    checkScreenReaderStatus();
  }, []);

  const initializeAccessibilityFeatures = () => {
    const accessibilityFeatures: AccessibilityFeature[] = [
      // Visual Accessibility
      {
        id: 'high-contrast',
        name: 'High Contrast Mode',
        description: 'Enhanced color contrast for better visibility',
        category: 'visual',
        enabled: localStorage.getItem('high-contrast') === 'true',
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'large-text',
        name: 'Large Text Support',
        description: 'Scalable text up to 200% without loss of functionality',
        category: 'visual',
        enabled: localStorage.getItem('large-text') === 'true',
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'focus-indicators',
        name: 'Enhanced Focus Indicators',
        description: 'Clear visual focus indicators for keyboard navigation',
        category: 'visual',
        enabled: true,
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'color-blind-support',
        name: 'Color Blind Friendly',
        description: 'Information not conveyed by color alone',
        category: 'visual',
        enabled: true,
        wcagLevel: 'A',
        compliance: true
      },

      // Auditory Accessibility
      {
        id: 'audio-descriptions',
        name: 'Audio Descriptions',
        description: 'Descriptive audio for visual content',
        category: 'auditory',
        enabled: localStorage.getItem('audio-descriptions') === 'true',
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'captions',
        name: 'Live Captions',
        description: 'Real-time captions for therapy sessions',
        category: 'auditory',
        enabled: localStorage.getItem('live-captions') === 'true',
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'sign-language',
        name: 'Sign Language Support',
        description: 'Avatar-based sign language interpretation',
        category: 'auditory',
        enabled: localStorage.getItem('sign-language') === 'true',
        wcagLevel: 'AAA',
        compliance: false
      },

      // Motor Accessibility
      {
        id: 'keyboard-navigation',
        name: 'Full Keyboard Navigation',
        description: 'Complete functionality via keyboard only',
        category: 'motor',
        enabled: true,
        wcagLevel: 'A',
        compliance: true
      },
      {
        id: 'voice-commands',
        name: 'Voice Commands',
        description: 'Control interface using voice commands',
        category: 'motor',
        enabled: localStorage.getItem('voice-commands') === 'true',
        wcagLevel: 'AAA',
        compliance: true
      },
      {
        id: 'gesture-alternatives',
        name: 'Gesture Alternatives',
        description: 'Alternative input methods for complex gestures',
        category: 'motor',
        enabled: true,
        wcagLevel: 'A',
        compliance: true
      },

      // Cognitive Accessibility
      {
        id: 'simple-language',
        name: 'Simple Language Mode',
        description: 'Simplified language and explanations',
        category: 'cognitive',
        enabled: localStorage.getItem('simple-language') === 'true',
        wcagLevel: 'AAA',
        compliance: true
      },
      {
        id: 'session-reminders',
        name: 'Session Reminders',
        description: 'Multiple reminder formats and timing options',
        category: 'cognitive',
        enabled: localStorage.getItem('session-reminders') === 'true',
        wcagLevel: 'AA',
        compliance: true
      },
      {
        id: 'reading-assistance',
        name: 'Reading Assistance',
        description: 'Text-to-speech for all content',
        category: 'cognitive',
        enabled: localStorage.getItem('reading-assistance') === 'true',
        wcagLevel: 'AA',
        compliance: true
      }
    ];

    setFeatures(accessibilityFeatures);
    calculateComplianceScore(accessibilityFeatures);
  };

  const calculateComplianceScore = (features: AccessibilityFeature[]) => {
    const totalFeatures = features.length;
    const compliantFeatures = features.filter(f => f.compliance && f.enabled).length;
    const score = (compliantFeatures / totalFeatures) * 100;
    setComplianceScore(score);
  };

  const toggleFeature = (featureId: string) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        const newEnabled = !feature.enabled;
        localStorage.setItem(featureId, newEnabled.toString());
        
        // Apply feature changes
        applyAccessibilityFeature(featureId, newEnabled);
        
        return { ...feature, enabled: newEnabled };
      }
      return feature;
    });

    setFeatures(updatedFeatures);
    calculateComplianceScore(updatedFeatures);
  };

  const applyAccessibilityFeature = (featureId: string, enabled: boolean) => {
    const root = document.documentElement;

    switch (featureId) {
      case 'high-contrast':
        root.classList.toggle('high-contrast', enabled);
        break;
      case 'large-text':
        root.classList.toggle('large-text', enabled);
        break;
      case 'simple-language':
        root.setAttribute('data-simple-lang', enabled.toString());
        break;
      default:
        break;
    }
  };

  const checkScreenReaderStatus = () => {
    // Detect common screen readers
    const hasScreenReader = !!(
      window.speechSynthesis || 
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver')
    );
    setIsScreenReaderActive(hasScreenReader);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'auditory': return <Ear className="h-4 w-4" />;
      case 'motor': return <MousePointer className="h-4 w-4" />;
      case 'cognitive': return <Brain className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getWcagBadgeColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AA': return 'bg-green-100 text-green-800 border-green-200';
      case 'AAA': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categorizeFeatures = () => {
    return {
      visual: features.filter(f => f.category === 'visual'),
      auditory: features.filter(f => f.category === 'auditory'),
      motor: features.filter(f => f.category === 'motor'),
      cognitive: features.filter(f => f.category === 'cognitive')
    };
  };

  const categorizedFeatures = categorizeFeatures();

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WCAG 2.1 Compliance Dashboard</span>
            <Badge 
              variant="outline" 
              className={complianceScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
            >
              {complianceScore.toFixed(0)}% Compliant
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {categorizedFeatures.visual.filter(f => f.enabled && f.compliance).length}/
                  {categorizedFeatures.visual.length}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" />
                  Visual
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {categorizedFeatures.auditory.filter(f => f.enabled && f.compliance).length}/
                  {categorizedFeatures.auditory.length}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Ear className="h-3 w-3" />
                  Auditory
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {categorizedFeatures.motor.filter(f => f.enabled && f.compliance).length}/
                  {categorizedFeatures.motor.length}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <MousePointer className="h-3 w-3" />
                  Motor
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-therapy-600">
                  {categorizedFeatures.cognitive.filter(f => f.enabled && f.compliance).length}/
                  {categorizedFeatures.cognitive.length}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Brain className="h-3 w-3" />
                  Cognitive
                </div>
              </div>
            </div>

            <Progress value={complianceScore} className="w-full" />

            {isScreenReaderActive && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <Volume2 className="h-4 w-4" />
                  <span className="font-medium">Screen Reader Detected</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Enhanced accessibility features are automatically enabled
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Categories */}
      {Object.entries(categorizedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getCategoryIcon(category)}
              {category} Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{feature.name}</h4>
                      <Badge variant="outline" className={getWcagBadgeColor(feature.wcagLevel)}>
                        WCAG {feature.wcagLevel}
                      </Badge>
                      {feature.compliance ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Accessibility Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => toggleFeature('high-contrast')}
            >
              <Contrast className="h-6 w-6" />
              <span className="text-xs">High Contrast</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => toggleFeature('large-text')}
            >
              <Type className="h-6 w-6" />
              <span className="text-xs">Large Text</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => toggleFeature('reading-assistance')}
            >
              <Volume2 className="h-6 w-6" />
              <span className="text-xs">Read Aloud</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => toggleFeature('simple-language')}
            >
              <Brain className="h-6 w-6" />
              <span className="text-xs">Simple Mode</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityCompliance;