
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import RealTherapyChatInterface from '@/components/chat/RealTherapyChatInterface';

const Chat = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="h-full">
        <RealTherapyChatInterface />
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Chat;
