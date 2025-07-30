import React from 'react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const LandingPage = () => {
  console.log('🔍 LandingPage: Component rendering');
  console.log('🔍 LandingPage: Current components that will render:', {
    ParallaxContainer: 'DISABLED',
    AppleProgressBar: 'DISABLED',
    Hero: 'DISABLED', 
    AlexCompanion: 'DISABLED'
  });
  
  return (
    <SafeComponentWrapper name="LandingPage">
      <div className="min-h-screen bg-gradient-to-br from-therapy-600/90 via-harmony-500/80 to-calm-600/90 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">MINIMAL TEST PAGE</h1>
          <p className="text-xl mb-2">If you see ONLY this content with NO duplicate headers,</p>
          <p className="text-xl">then the issue was in one of the removed components.</p>
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="text-sm">Check: Do you still see duplicate headers?</p>
            <p className="text-sm">This page has NO header components at all.</p>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default LandingPage;