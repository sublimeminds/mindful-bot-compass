import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../utils';
import { BrowserRouter } from 'react-router-dom';

// Test each wrapper component in isolation
describe('Component Isolation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MinimalErrorBoundary', () => {
    it('should render children when no error occurs', async () => {
      const MinimalErrorBoundary = await import('@/components/MinimalErrorBoundary');
      const Component = MinimalErrorBoundary.default;
      
      render(
        <Component>
          <div data-testid="child">Child content</div>
        </Component>
      );
      
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should catch and display errors', async () => {
      const MinimalErrorBoundary = await import('@/components/MinimalErrorBoundary');
      const Component = MinimalErrorBoundary.default;
      
      const ThrowError = () => {
        throw new Error('Test error');
      };
      
      render(
        <Component>
          <ThrowError />
        </Component>
      );
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('SafeReactWrapper', () => {
    it('should validate React availability', async () => {
      const SafeReactWrapper = await import('@/components/SafeReactWrapper');
      const Component = SafeReactWrapper.default;
      
      render(
        <Component>
          <div data-testid="safe-child">Safe content</div>
        </Component>
      );
      
      expect(screen.getByTestId('safe-child')).toBeInTheDocument();
    });
  });

  describe('RouterSafeWrapper', () => {
    it('should handle router context safely', async () => {
      const RouterSafeWrapper = await import('@/components/RouterSafeWrapper');
      const { RouterSafeWrapper: Component } = RouterSafeWrapper;
      
      render(
        <BrowserRouter>
          <Component>
            <div data-testid="router-child">Router content</div>
          </Component>
        </BrowserRouter>
      );
      
      expect(screen.getByTestId('router-child')).toBeInTheDocument();
    });
  });

  describe('SafeErrorBoundary', () => {
    it('should provide comprehensive error handling', async () => {
      const SafeErrorBoundary = await import('@/components/SafeErrorBoundary');
      const Component = SafeErrorBoundary.default;
      
      render(
        <Component name="TestComponent">
          <div data-testid="boundary-child">Boundary content</div>
        </Component>
      );
      
      expect(screen.getByTestId('boundary-child')).toBeInTheDocument();
    });
  });
});