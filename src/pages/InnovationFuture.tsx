import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import InnovationDashboard from '@/components/innovation/InnovationDashboard';

const InnovationFuture = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-innovation-50 to-future-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-innovation-600 mx-auto mb-4"></div>
          <p className="text-innovation-600 font-medium">Loading Innovation Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <InnovationDashboard />;
};

export default InnovationFuture;