
import LandingPage from '@/components/LandingPage';
import PublicPageWrapper from '@/components/PublicPageWrapper';

const Index = () => {
  console.log('🔍 Index: Component rendering');
  
  return (
    <PublicPageWrapper>
      <LandingPage />
    </PublicPageWrapper>
  );
};

export default Index;
