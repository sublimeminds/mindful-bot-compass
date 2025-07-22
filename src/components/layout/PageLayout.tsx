
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeaderErrorBoundary from '@/components/HeaderErrorBoundary';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  console.log('🚨 EMERGENCY DEBUG: PageLayout component ENTRY - This should show if PageLayout renders at all');
  console.log('🚨 EMERGENCY DEBUG: PageLayout props:', { hasChildren: !!children, className });
  
  // Add a visible test div to see if PageLayout renders
  return (
    <div className="min-h-screen flex flex-col bg-red-100 border-4 border-red-500">
      <div className="bg-yellow-300 p-4 text-black font-bold text-center">
        🚨 EMERGENCY: PageLayout is rendering - you should see this yellow bar
      </div>
      <HeaderErrorBoundary componentName="PageLayout-Header">
        <Header />
      </HeaderErrorBoundary>
      <main className={`flex-1 bg-blue-100 ${className}`}>
        <div className="bg-green-300 p-4 text-black font-bold text-center">
          🚨 EMERGENCY: Main content area - you should see this green bar
        </div>
        {children}
      </main>
      <HeaderErrorBoundary componentName="PageLayout-Footer">
        <Footer />
      </HeaderErrorBoundary>
    </div>
  );
};

export default PageLayout;
