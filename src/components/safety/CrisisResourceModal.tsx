
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, AlertTriangle } from 'lucide-react';
import { SafetyResource, CrisisIndicator } from '@/services/crisisDetectionService';

interface CrisisResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  crisisIndicator: CrisisIndicator;
  resources: SafetyResource[];
}

const CrisisResourceModal: React.FC<CrisisResourceModalProps> = ({
  isOpen,
  onClose,
  crisisIndicator,
  resources
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCallResource = (phone: string) => {
    if (phone.includes('911')) {
      window.location.href = `tel:${phone}`;
    } else if (phone.includes('988')) {
      window.location.href = 'tel:988';
    } else if (phone.includes('741741')) {
      // Text functionality - this would typically open the messaging app
      alert('Please text HOME to 741741 from your messaging app');
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Crisis Support Resources</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Crisis Level Indicator */}
          <Card className={`border-2 ${getSeverityColor(crisisIndicator.severity)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Support Level Detected</h3>
                  <p className="text-sm">
                    {crisisIndicator.severity === 'critical' 
                      ? 'Immediate professional support recommended'
                      : crisisIndicator.severity === 'high'
                      ? 'Professional support strongly recommended'
                      : 'Support resources available if needed'
                    }
                  </p>
                </div>
                <Badge variant="outline" className={getSeverityColor(crisisIndicator.severity)}>
                  {crisisIndicator.severity.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Important Message */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>You are not alone.</strong> These resources are available 24/7 and staffed by trained professionals who understand what you're going through.
            </p>
          </div>

          {/* Crisis Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold">Immediate Support Resources</h3>
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{resource.contact_info?.phone || resource.phone_number}</span>
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {resource.availability}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleCallResource(resource.contact_info?.phone || resource.phone_number || '')}
                    className="ml-4"
                    variant={resource.immediate_access ? 'default' : 'outline'}
                  >
                    {(resource.contact_info?.phone || resource.phone_number || '').includes('741741') ? (
                      <MessageCircle className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                  </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Safety Planning */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">While you wait for help:</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Stay with someone you trust or go to a public place</li>
              <li>Remove any means of self-harm from your immediate area</li>
              <li>Practice deep breathing or grounding techniques</li>
              <li>Remember that these feelings will pass</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => handleCallResource('988')} 
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Call 988 Now
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisResourceModal;
