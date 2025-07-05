
import React from 'react';
import StaticAuthForm from '@/components/auth/StaticAuthForm';
import { ProgressiveEnhancer } from '@/components/progressive/ProgressiveEnhancer';
import { updateSEO } from '@/utils/simpleNavigation';

const EnhancedAuthForm = React.lazy(() => import('@/components/auth/EnhancedAuthForm'));

const EnhancedAuth = () => {
  // Set SEO without hooks
  React.useEffect(() => {
    updateSEO({
      title: 'Sign In to TherapySync - AI-Powered Mental Health Support',
      description: 'Sign in to your TherapySync account and continue your personalized mental health journey with AI-powered therapy support.',
      keywords: 'therapy, mental health, sign in, login, AI therapy, wellness'
    });
  }, []);

  return (
    <div>
      {/* Static version loads immediately */}
      <StaticAuthForm />
      
      {/* Progressive enhancement after 3 seconds */}
      <ProgressiveEnhancer fallback={null} delay={3000} name="AuthEnhancement">
        <React.Suspense fallback={null}>
          <div style={{ display: 'none' }}>
            <EnhancedAuthForm />
          </div>
        </React.Suspense>
      </ProgressiveEnhancer>
    </div>
  );
};

export default EnhancedAuth;
