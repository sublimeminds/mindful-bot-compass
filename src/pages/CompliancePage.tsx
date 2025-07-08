import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, FileText, Heart } from 'lucide-react';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import RiskAssessmentForm from '@/components/compliance/RiskAssessmentForm';
import DigitalConsentForm from '@/components/compliance/DigitalConsentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompliancePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-therapy-900 mb-2">
            Safety & Compliance
          </h1>
          <p className="text-therapy-600">
            Complete required assessments and manage your consent preferences
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            
            <TabsTrigger value="consent" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Consent</span>
            </TabsTrigger>
            
            <TabsTrigger value="assessment" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Assessment</span>
            </TabsTrigger>
            
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Consent Status */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setActiveTab('consent')}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Digital Consent</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Review and manage your consent preferences for data processing and therapy services.
                  </p>
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
                      ✓ Completed
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setActiveTab('assessment')}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Risk Assessment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete a confidential mental health risk assessment to ensure appropriate care.
                  </p>
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      ⏳ Pending
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Crisis Resources */}
              <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setActiveTab('support')}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <span>Crisis Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Access immediate crisis support resources and emergency contacts.
                  </p>
                  <div className="text-sm">
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded">
                      🚨 Always Available
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Important Notice */}
            <Card className="border-therapy-200 bg-therapy-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-therapy-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-therapy-900 mb-2">Your Safety is Our Priority</h3>
                    <p className="text-sm text-therapy-700 mb-3">
                      We are committed to providing safe, ethical, and effective AI therapy services. 
                      Our compliance measures ensure that you receive appropriate care while maintaining 
                      your privacy and security.
                    </p>
                    <ul className="text-sm text-therapy-600 space-y-1">
                      <li>• All data is encrypted and securely stored</li>
                      <li>• Regular safety assessments help us provide better care</li>
                      <li>• Crisis intervention protocols are always active</li>
                      <li>• You can withdraw consent at any time</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consent Tab */}
          <TabsContent value="consent">
            <DigitalConsentForm />
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment">
            <RiskAssessmentForm />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency Contacts */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-900">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Emergency Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-900">Immediate Danger</h4>
                    <p className="text-sm text-red-800">Call 911</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-900">National Suicide Prevention Lifeline</h4>
                    <p className="text-sm text-red-800">Call or Text 988</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-900">Crisis Text Line</h4>
                    <p className="text-sm text-red-800">Text HOME to 741741</p>
                  </div>
                </CardContent>
              </Card>

              {/* Support Resources */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-900">
                    <Heart className="h-5 w-5" />
                    <span>Additional Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-blue-900">SAMHSA National Helpline</h4>
                    <p className="text-sm text-blue-800">1-800-662-4357</p>
                    <p className="text-xs text-blue-700">Treatment and referral service</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Crisis Text Line</h4>
                    <p className="text-sm text-blue-800">Text HOME to 741741</p>
                    <p className="text-xs text-blue-700">24/7 crisis support</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">NAMI HelpLine</h4>
                    <p className="text-sm text-blue-800">1-800-950-6264</p>
                    <p className="text-xs text-blue-700">Mental health information and support</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Self-Care Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Self-Care & Coping Strategies</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-therapy-900 mb-2">Immediate Coping Techniques</h4>
                  <ul className="text-sm space-y-1 text-therapy-700">
                    <li>• Deep breathing exercises (4-7-8 technique)</li>
                    <li>• Progressive muscle relaxation</li>
                    <li>• Grounding techniques (5-4-3-2-1 method)</li>
                    <li>• Cold water on face or hands</li>
                    <li>• Call a trusted friend or family member</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-therapy-900 mb-2">Long-term Support</h4>
                  <ul className="text-sm space-y-1 text-therapy-700">
                    <li>• Regular therapy sessions</li>
                    <li>• Support group participation</li>
                    <li>• Medication compliance (if prescribed)</li>
                    <li>• Regular exercise and healthy eating</li>
                    <li>• Consistent sleep schedule</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default CompliancePage;