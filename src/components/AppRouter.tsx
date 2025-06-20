
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DashboardPage from '@/pages/DashboardPage';
import CrisisResources from '@/pages/CrisisResources';
import AdminCrisisManagement from '@/pages/AdminCrisisManagement';
import Community from '@/pages/Community';
import NotebookPage from '@/pages/NotebookPage';
import SmartScheduling from '@/pages/SmartScheduling';
import Help from '@/pages/Help';
import Plans from '@/pages/Plans';
import TherapySyncAI from '@/pages/TherapySyncAI';
import FeaturesOverview from '@/pages/FeaturesOverview';
import EnhancedMonitoringPage from '@/pages/EnhancedMonitoringPage';
import NotFound from '@/pages/NotFound';
import HelpArticles from '@/pages/HelpArticles';
import HelpArticleDetail from '@/pages/HelpArticleDetail';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/crisis-resources" element={<CrisisResources />} />
      <Route path="/admin/crisis-management" element={<AdminCrisisManagement />} />
      <Route path="/community" element={<Community />} />
      <Route path="/notebook" element={<NotebookPage />} />
      <Route path="/smart-scheduling" element={<SmartScheduling />} />
      <Route path="/help" element={<Help />} />
      <Route path="/help/articles" element={<HelpArticles />} />
      <Route path="/help/articles/:id" element={<HelpArticleDetail />} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/therapysync-ai" element={<TherapySyncAI />} />
      <Route path="/features-overview" element={<FeaturesOverview />} />
      <Route path="/enhanced-monitoring" element={<EnhancedMonitoringPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
