import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../utils';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@/components/AppRouter';

// Mock all the lazy-loaded components
vi.mock('@/pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>
}));

vi.mock('@/pages/MinimalIndex', () => ({
  default: () => <div data-testid="minimal-index-page">Minimal Index Page</div>
}));

vi.mock('@/pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>
}));

vi.mock('@/pages/EnhancedAuth', () => ({
  default: () => <div data-testid="auth-page">Auth Page</div>
}));

// Mock error boundaries
vi.mock('@/components/SafeErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('@/components/BulletproofErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const renderWithRouter = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

describe('AppRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render index page by default', async () => {
    renderWithRouter('/');
    
    // Should show loading first, then content
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for lazy loading
    await screen.findByTestId('index-page');
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  it('should render minimal index page', async () => {
    renderWithRouter('/minimal');
    
    await screen.findByTestId('minimal-index-page');
    expect(screen.getByTestId('minimal-index-page')).toBeInTheDocument();
  });

  it('should render dashboard page', async () => {
    renderWithRouter('/dashboard');
    
    await screen.findByTestId('dashboard-page');
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('should render auth page', async () => {
    renderWithRouter('/auth');
    
    await screen.findByTestId('auth-page');
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('should handle lazy loading errors gracefully', async () => {
    // Mock a component that fails to load
    vi.doMock('@/pages/TestPage', () => {
      throw new Error('Failed to load component');
    });

    renderWithRouter('/test');
    
    // Should show fallback instead of crashing
    await screen.findByText(/page loading error/i);
    expect(screen.getByText(/page loading error/i)).toBeInTheDocument();
  });

  it('should show loading fallback during lazy loading', () => {
    renderWithRouter('/dashboard');
    
    // Should show loading state while lazy component loads
    expect(screen.getByText(/loading page/i)).toBeInTheDocument();
  });

  it('should wrap routes with error boundaries', async () => {
    renderWithRouter('/');
    
    // Should load successfully with error boundaries in place
    await screen.findByTestId('index-page');
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });
});