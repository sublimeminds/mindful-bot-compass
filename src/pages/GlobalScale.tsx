import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlobalScaleDashboard from '@/components/global/GlobalScaleDashboard';

const GlobalScale = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-global-50 to-scale-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-global-600 mx-auto mb-4"></div>
          <p className="text-global-600 font-medium">Loading Global Scale Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <GlobalScaleDashboard />;
};

export default GlobalScale;