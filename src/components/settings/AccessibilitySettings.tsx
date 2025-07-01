
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accessibility, Type, Contrast, MousePointer, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccessibilitySettings = () => {
  const { toast } = useToast();
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);
  const [fontSize, setFontSize] = useState([16]);
  const [colorTheme, setColorTheme] = useState('default');
  const [focusIndicator, setFocusIndicator] = useState('enhanced');

  const handleSaveSettings = () => {
    const settings = {
      highContrast,
      largeText,
      reducedMotion,
      screenReader,
      keyboardNavigation,
      fontSize: fontSize[0],
      colorTheme,
      focusIndicator
    };

    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    // Apply settings to document
    document.documentElement.style.fontSize = `${fontSize[0]}px`;
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    toast({
      title: "Accessibility Settings Saved",
      description: "Your accessibility preferences have been applied successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5" />
            <span>Visual Accessibility</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <span>High Contrast Mode</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Large Text</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase text size throughout the app
              </p>
            </div>
            <Switch
              checked={largeText}
              onCheckedChange={setLargeText}
            />
          </div>

          {/* Font Size Slider */}
          <div className="space-y-3">
            <Label>Font Size: {fontSize[0]}px</Label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
          </div>

          {/* Color Theme */}
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <Select value={colorTheme} onValueChange={setColorTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
                <SelectItem value="dark-mode">Dark Mode</SelectItem>
                <SelectItem value="colorblind-friendly">Colorblind Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Motion & Animation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MousePointer className="h-5 w-5" />
            <span>Navigation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Screen Reader Support */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Screen Reader Support</Label>
              <p className="text-sm text-muted-foreground">
                Enhanced support for screen reading software
              </p>
            </div>
            <Switch
              checked={screenReader}
              onCheckedChange={setScreenReader}
            />
          </div>

          {/* Keyboard Navigation */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">
                Improved keyboard shortcuts and focus management
              </p>
            </div>
            <Switch
              checked={keyboardNavigation}
              onCheckedChange={setKeyboardNavigation}
            />
          </div>

          {/* Focus Indicator */}
          <div className="space-y-2">
            <Label>Focus Indicator Style</Label>
            <Select value={focusIndicator} onValueChange={setFocusIndicator}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="enhanced">Enhanced</SelectItem>
                <SelectItem value="thick-border">Thick Border</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Accessibility Settings
      </Button>
    </div>
  );
};

export default AccessibilitySettings;
