
import React from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConversationAnalyticsDashboard from '@/components/ai/ConversationAnalyticsDashboard';
import PredictiveInterventionEngine from '@/components/ai/PredictiveInterventionEngine';

const AIAnalytics = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analytics">Conversation Analytics</TabsTrigger>
              <TabsTrigger value="predictions">Predictive Interventions</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <ConversationAnalyticsDashboard />
            </TabsContent>

            <TabsContent value="predictions">
              <PredictiveInterventionEngine />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AIAnalytics;
