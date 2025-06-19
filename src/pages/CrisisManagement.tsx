
import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrisisInterventionDashboard from '@/components/safety/CrisisInterventionDashboard';
import CrisisAssessmentForm from '@/components/safety/CrisisAssessmentForm';
import EmergencyContactsManager from '@/components/safety/EmergencyContactsManager';
import SafetyPlanManager from '@/components/safety/SafetyPlanManager';
import { Shield, AlertTriangle, Heart, Users, Phone, FileText } from 'lucide-react';

const CrisisManagement = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Crisis Management Center</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced crisis intervention, real-time monitoring, and immediate support resources 
              to ensure user safety and provide immediate assistance when needed.
            </p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="assessment" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Assessment</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Contacts</span>
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Safety Plans</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Support</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <CrisisInterventionDashboard />
            </TabsContent>

            <TabsContent value="assessment">
              <CrisisAssessmentForm />
            </TabsContent>

            <TabsContent value="contacts">
              <EmergencyContactsManager />
            </TabsContent>

            <TabsContent value="safety">
              <SafetyPlanManager />
            </TabsContent>

            <TabsContent value="support">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Support network features will be implemented here */}
                <div className="text-center py-12 col-span-full">
                  <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Support Network features coming soon...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CrisisManagement;
