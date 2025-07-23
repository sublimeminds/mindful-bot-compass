
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  console.log('🔍 PageLayout: Component rendering');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
