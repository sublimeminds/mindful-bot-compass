import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import SafeErrorBoundary from "@/components/SafeErrorBoundary";

// Import components to test
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';

interface ComponentTest {
  name: string;
  component: React.ComponentType;
  status: 'untested' | 'success' | 'error';
  error?: string;
}

const ComponentHealthCheck = () => {
  const [tests, setTests] = useState<ComponentTest[]>([
    { name: 'Header', component: Header, status: 'untested' },
    { name: 'HeroSection', component: HeroSection, status: 'untested' },
    { name: 'FeaturesSection', component: FeaturesSection, status: 'untested' },
    { name: 'PricingSection', component: PricingSection, status: 'untested' },
    { name: 'Footer', component: Footer, status: 'untested' },
  ]);

  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const testComponent = (testName: string, Component: React.ComponentType) => {
    setCurrentTest(testName);
    
    try {
      // Try to render the component
      const element = React.createElement(Component);
      
      setTests(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'success' }
          : test
      ));
    } catch (error) {
      console.error(`Component ${testName} failed:`, error);
      setTests(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'error', error: (error as Error).message }
          : test
      ));
    }
    
    setCurrentTest(null);
  };

  const testAllComponents = () => {
    tests.forEach(test => {
      setTimeout(() => testComponent(test.name, test.component), 100);
    });
  };

  const getStatusIcon = (status: ComponentTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: ComponentTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Untested</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Component Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={testAllComponents} className="w-full">
                Test All Components
              </Button>
              
              <div className="grid gap-4">
                {tests.map((test) => (
                  <Card key={test.name} className="border">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                          {getStatusBadge(test.status)}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testComponent(test.name, test.component)}
                          disabled={currentTest === test.name}
                        >
                          {currentTest === test.name ? 'Testing...' : 'Test'}
                        </Button>
                      </div>
                      
                      {test.error && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-700">{test.error}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Component Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Live Component Rendering Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tests.map((test) => (
                <div key={`live-${test.name}`}>
                  <h3 className="font-medium mb-2">{test.name} Component:</h3>
                  <SafeErrorBoundary 
                    name={`Live-${test.name}`}
                    fallback={
                      <div className="p-4 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-700">❌ {test.name} failed to render</p>
                      </div>
                    }
                  >
                    <div className="border p-4 rounded">
                      <test.component />
                    </div>
                  </SafeErrorBoundary>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentHealthCheck;