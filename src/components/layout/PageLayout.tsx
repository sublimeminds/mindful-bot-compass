
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeaderErrorBoundary from '@/components/HeaderErrorBoundary';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  console.log('🔍 PageLayout: Component rendering');
  
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderErrorBoundary componentName="PageLayout-Header">
        <Header />
      </HeaderErrorBoundary>
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <HeaderErrorBoundary componentName="PageLayout-Footer">
        <Footer />
      </HeaderErrorBoundary>
    </div>
  );
};

export default PageLayout;
