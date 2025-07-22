
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';
import SuperAdminRouter from '@/components/SuperAdminRouter';

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const SimpleLandingPage = lazy(() => import('./components/SimpleLandingPage'));

// Layout wrapper for public pages with header/footer
import PageLayout from '@/components/layout/PageLayout';

const queryClient = new QueryClient();

function App() {
  console.log('🔍 App: Component rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BulletproofAuthProvider>
        <SuperAdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-600"></div>
                  </div>
                }>
                  <Routes>
                    {/* Main landing page with header/footer layout */}
                    <Route path="/" element={
                      <PageLayout>
                        <Index />
                      </PageLayout>
                    } />
                    
                    {/* Simple landing page alternative */}
                    <Route path="/simple" element={
                      <PageLayout>
                        <SimpleLandingPage />
                      </PageLayout>
                    } />
                    
                    {/* Super Admin Routes - handled by SuperAdminRouter */}
                    <Route path="/secure-admin-portal-x9k2/*" element={<SuperAdminRouter />} />
                  </Routes>
                </Suspense>
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </SuperAdminProvider>
      </BulletproofAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
