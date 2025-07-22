
import LandingPage from '@/components/LandingPage';

const Index = () => {
  console.log('🚨 EMERGENCY DEBUG: Index page component rendering - INDEX START');
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-pink-300 p-4 text-center font-bold">
        🚨 EMERGENCY: Index page is rendering - you should see this pink bar
      </div>
      <LandingPage />
    </div>
  );
};

export default Index;
