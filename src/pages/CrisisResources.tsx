
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CrisisResourcesPublic from '@/components/safety/CrisisResourcesPublic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CrisisAssessmentForm from '@/components/safety/CrisisAssessmentForm';
import EmergencyContactsManager from '@/components/safety/EmergencyContactsManager';
import SafetyPlanManager from '@/components/safety/SafetyPlanManager';
import { Shield, Heart, Users, Phone, FileText } from 'lucide-react';

const CrisisResources = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Crisis Resources & Support</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Access immediate help, safety planning tools, and support resources 
              to help you through difficult times.
            </p>
          </div>

          <Tabs defaultValue="resources" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="resources" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Resources</span>
              </TabsTrigger>
              <TabsTrigger value="assessment" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
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
            </TabsList>

            <TabsContent value="resources">
              <CrisisResourcesPublic />
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
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CrisisResources;
