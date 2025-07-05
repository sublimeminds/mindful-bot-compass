import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  HelpCircle,
  Brain,
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import UnifiedNavigation from '@/components/navigation/UnifiedNavigation';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Brain },
    { path: '/goals', label: 'Goals', icon: Heart },
    { path: '/auth', label: 'Sign In', icon: HelpCircle }
  ];

  return (
    <SafeComponentWrapper name="NotFoundPage">
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        <UnifiedNavigation />
        
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="max-w-2xl w-full text-center shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="text-8xl mb-4">🤔</div>
              <Badge className="mx-auto mb-4 bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0">
                404 - Page Not Found
              </Badge>
              <CardTitle className="text-3xl bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                This page seems to be taking a mental health break
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 text-lg">
                Don't worry, it happens to the best of us. Let's get you back on track 
                to your mental wellness journey.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Button
                      key={link.path}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(link.path)}
                      className="flex flex-col h-auto py-3 space-y-1 hover:bg-therapy-50 border-therapy-200"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs">{link.label}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Button>
              </div>

              <div className="pt-4 border-t border-therapy-100">
                <p className="text-sm text-slate-500 mb-2">
                  Need help finding something specific?
                </p>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigate('/help')}
                  className="text-therapy-600"
                >
                  <Search className="h-4 w-4 mr-1" />
                  Browse Help Center
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default NotFound;