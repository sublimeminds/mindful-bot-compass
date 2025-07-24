
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PublicPageWrapper from '@/components/PublicPageWrapper';
import PrivateRoute from '@/components/PrivateRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const Help = lazy(() => import('@/pages/Help'));
const GettingStarted = lazy(() => import('@/pages/GettingStarted'));
const ForIndividuals = lazy(() => import('@/pages/ForIndividuals'));
const ForFamilies = lazy(() => import('@/pages/ForFamilies'));
const ForOrganizations = lazy(() => import('@/pages/ForOrganizations'));
const ForHealthcareProviders = lazy(() => import('@/pages/ForHealthcareProviders'));
const TherapyAI = lazy(() => import('@/pages/TherapyAI'));
const AIChat = lazy(() => import('@/pages/AIChat'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const Personalization = lazy(() => import('@/pages/Personalization'));
const AdaptiveAI = lazy(() => import('@/pages/AdaptiveAI'));
const API = lazy(() => import('@/pages/API'));
const Learn = lazy(() => import('@/pages/Learn'));

const AppRouter: React.FC = () => {
  console.log('🔍 AppRouter: Rendering routes');
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes with Header/Footer */}
        <Route path="/" element={
          <PublicPageWrapper>
            <Index />
          </PublicPageWrapper>
        } />
        
        <Route path="/login" element={
          <PublicPageWrapper>
            <Login />
          </PublicPageWrapper>
        } />
        
        <Route path="/register" element={
          <PublicPageWrapper>
            <Register />
          </PublicPageWrapper>
        } />
        
        <Route path="/help" element={
          <PublicPageWrapper>
            <Help />
          </PublicPageWrapper>
        } />
        
        <Route path="/getting-started" element={
          <PublicPageWrapper>
            <GettingStarted />
          </PublicPageWrapper>
        } />
        
        <Route path="/for-individuals" element={
          <PublicPageWrapper>
            <ForIndividuals />
          </PublicPageWrapper>
        } />
        
        <Route path="/for-families" element={
          <PublicPageWrapper>
            <ForFamilies />
          </PublicPageWrapper>
        } />
        
        <Route path="/for-organizations" element={
          <PublicPageWrapper>
            <ForOrganizations />
          </PublicPageWrapper>
        } />
        
        <Route path="/for-healthcare-providers" element={
          <PublicPageWrapper>
            <ForHealthcareProviders />
          </PublicPageWrapper>
        } />
        
        <Route path="/therapy-ai" element={
          <PublicPageWrapper>
            <TherapyAI />
          </PublicPageWrapper>
        } />
        
        <Route path="/ai-chat" element={
          <PublicPageWrapper>
            <AIChat />
          </PublicPageWrapper>
        } />
        
        <Route path="/how-it-works" element={
          <PublicPageWrapper>
            <HowItWorks />
          </PublicPageWrapper>
        } />
        
        <Route path="/individual" element={
          <PublicPageWrapper>
            <ForIndividuals />
          </PublicPageWrapper>
        } />
        
        <Route path="/families" element={
          <PublicPageWrapper>
            <ForFamilies />
          </PublicPageWrapper>
        } />
        
        <Route path="/organizations" element={
          <PublicPageWrapper>
            <ForOrganizations />
          </PublicPageWrapper>
        } />

        {/* Analytics route - requires authentication */}
        <Route path="/analytics" element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        } />
        
        <Route path="/personalization" element={
          <PublicPageWrapper>
            <Personalization />
          </PublicPageWrapper>
        } />
        
        <Route path="/adaptive-ai" element={
          <PublicPageWrapper>
            <AdaptiveAI />
          </PublicPageWrapper>
        } />
        
        <Route path="/goals" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/mood-tracker" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/reports" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/api" element={
          <PublicPageWrapper>
            <API />
          </PublicPageWrapper>
        } />
        
        <Route path="/learn" element={
          <PublicPageWrapper>
            <Learn />
          </PublicPageWrapper>
        } />
        
        <Route path="/support" element={
          <PublicPageWrapper>
            <Help />
          </PublicPageWrapper>
        } />
        
        <Route path="/pricing" element={
          <PublicPageWrapper>
            <Index />
          </PublicPageWrapper>
        } />
        
        <Route path="/mobile" element={
          <PublicPageWrapper>
            <Index />
          </PublicPageWrapper>
        } />
        
        <Route path="/cbt" element={
          <PublicPageWrapper>
            <AIChat />
          </PublicPageWrapper>
        } />
        
        <Route path="/family" element={
          <PublicPageWrapper>
            <ForFamilies />
          </PublicPageWrapper>
        } />
        
        <Route path="/blog" element={
          <PublicPageWrapper>
            <Learn />
          </PublicPageWrapper>
        } />

        {/* Private routes without Header/Footer (they have their own layout) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
