
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BulletproofAuthProvider } from '@/components/bulletproof/BulletproofAuthProvider';
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';
import SuperAdminRouter from '@/components/SuperAdminRouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const SimpleLandingPage = lazy(() => import('./components/SimpleLandingPage'));

const queryClient = new QueryClient();

function App() {
  console.log('🔍 App: Component rendering - ROOT LEVEL');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BulletproofAuthProvider>
        <SuperAdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
                <Suspense fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                  </div>
                }>
                  <Routes>
                    {/* Main routes with header/footer */}
                    <Route path="/" element={
                      <>
                        <Header />
                        <main style={{ flex: 1, minHeight: 0 }}>
                          <Index />
                        </main>
                        <Footer />
                      </>
                    } />
                    
                    {/* Simple landing page with header/footer */}
                    <Route path="/simple" element={
                      <>
                        <Header />
                        <main style={{ flex: 1, minHeight: 0 }}>
                          <SimpleLandingPage />
                        </main>
                        <Footer />
                      </>
                    } />
                    
                    {/* Super Admin Routes - no header/footer */}
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
