
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, Phone, Heart, Users, MapPin, Clock, AlertTriangle
} from 'lucide-react';

const CrisisResourcesPublic = () => {
  return (
    <div className="space-y-6">
      {/* Emergency Resources */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Phone className="h-5 w-5 mr-2" />
            Emergency Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="destructive" 
              className="h-16 flex flex-col bg-red-600 hover:bg-red-700"
              onClick={() => window.open('tel:988', '_blank')}
            >
              <Phone className="h-6 w-6 mb-1" />
              <span>Crisis Lifeline: 988</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => window.open('tel:911', '_blank')}
            >
              <Shield className="h-6 w-6 mb-1" />
              <span>Emergency: 911</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://suicidepreventionlifeline.org/chat/', '_blank')}
            >
              <Heart className="h-6 w-6 mb-1" />
              <span>Crisis Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Assessment */}
      <Alert className="border-l-4 border-l-orange-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Need Immediate Help?</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">If you're having thoughts of self-harm or suicide, please reach out for help immediately:</p>
          <div className="space-y-2">
            <p>• Call 988 (Suicide & Crisis Lifeline) - Available 24/7</p>
            <p>• Text "HELLO" to 741741 (Crisis Text Line)</p>
            <p>• Call 911 if you're in immediate danger</p>
            <p>• Go to your nearest emergency room</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Self-Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Crisis Prevention Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Safety Planning Tools
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Emergency Contacts Setup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Coping Strategies
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Support Groups
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Local Resources
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Helplines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Mental Health Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">National Alliance on Mental Illness</h3>
              <p className="text-sm text-muted-foreground mb-2">1-800-950-NAMI (6264)</p>
              <p className="text-sm">Mental health information and support</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">SAMHSA National Helpline</h3>
              <p className="text-sm text-muted-foreground mb-2">1-800-662-HELP (4357)</p>
              <p className="text-sm">Treatment referral and information service</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Crisis Text Line</h3>
              <p className="text-sm text-muted-foreground mb-2">Text HOME to 741741</p>
              <p className="text-sm">Free, 24/7 crisis support via text</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisResourcesPublic;
