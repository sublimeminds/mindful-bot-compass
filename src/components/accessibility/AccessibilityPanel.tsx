
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Eye, 
  Type, 
  Keyboard, 
  Volume2, 
  Focus,
  Palette,
  MousePointer,
  Zap
} from 'lucide-react';
import { useSafeAccessibility } from '@/contexts/SafeAccessibilityContext';

const AccessibilityPanel = () => {
  const { settings, updateSetting } = useSafeAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    updateSetting(key, value);
  };

  const accessibilityOptions = [
    {
      key: 'reduceMotion' as const,
      label: 'Reduce Motion',
      description: 'Minimize animations and transitions',
      icon: <Zap className="h-4 w-4" />,
      category: 'Visual'
    },
    {
      key: 'highContrast' as const,
      label: 'High Contrast',
      description: 'Increase color contrast for better visibility',
      icon: <Palette className="h-4 w-4" />,
      category: 'Visual'
    },
    {
      key: 'largeText' as const,
      label: 'Large Text',
      description: 'Increase font size for easier reading',
      icon: <Type className="h-4 w-4" />,
      category: 'Visual'
    },
    {
      key: 'screenReader' as const,
      label: 'Screen Reader Mode',
      description: 'Optimize interface for screen readers',
      icon: <Volume2 className="h-4 w-4" />,
      category: 'Assistive Technology'
    }
  ];

  const categories = [...new Set(accessibilityOptions.map(option => option.category))];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-4 w-4 mr-2" />
        Accessibility
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Accessibility Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close accessibility settings"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">About Accessibility</h3>
            <p className="text-blue-700 text-sm">
              These settings help customize the interface to meet your specific accessibility needs. 
              Changes are applied immediately and saved to your browser.
            </p>
          </div>

          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                {category === 'Visual' && <Eye className="h-4 w-4 mr-2" />}
                {category === 'Assistive Technology' && <Volume2 className="h-4 w-4 mr-2" />}
                {category === 'Navigation' && <MousePointer className="h-4 w-4 mr-2" />}
                {category}
              </h3>
              
              <div className="grid gap-3">
                {accessibilityOptions
                  .filter(option => option.category === category)
                  .map(option => (
                    <div 
                      key={option.key}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">
                          {option.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{option.label}</h4>
                            {settings[option.key] && (
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      
                      <Switch
                        checked={settings[option.key]}
                        onCheckedChange={(checked) => handleSettingChange(option.key, checked)}
                        aria-label={`Toggle ${option.label}`}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Browser Settings</h3>
            <p className="text-sm text-gray-600 mb-3">
              Some accessibility features are controlled by your browser or operating system:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Zoom level (Ctrl/Cmd + or -)</li>
              <li>• System high contrast mode</li>
              <li>• Screen reader software</li>
              <li>• Voice control features</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPanel;
