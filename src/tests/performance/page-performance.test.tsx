import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { measurePerformance } from '../utils/test-helpers';
import TherapistDiscovery from '@/pages/TherapistDiscovery';
import { mockTherapistData } from '../utils/mock-data';

// Performance thresholds for page operations
const PAGE_PERFORMANCE_THRESHOLDS = {
  INITIAL_LOAD: 2000, // milliseconds
  FILTER_RESPONSE: 100, // milliseconds
  SEARCH_RESPONSE: 150, // milliseconds
  CARD_RENDER: 50, // milliseconds per card
};

// Mock Supabase with performance data
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: mockTherapistData,
          error: null,
        })),
      })),
    })),
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-123' },
    loading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TherapistDiscovery Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('measures initial page load performance', async () => {
    const loadTime = await measurePerformance(async () => {
      renderWithRouter(<TherapistDiscovery />);
      
      await waitFor(() => {
        expect(screen.getByText('Discover Your Ideal AI Therapist')).toBeInTheDocument();
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      }, { timeout: 3000 });
    }, 'TherapistDiscovery Initial Load');

    expect(loadTime).toBeLessThan(PAGE_PERFORMANCE_THRESHOLDS.INITIAL_LOAD);
  });

  it('measures search filter performance', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    
    const searchTime = await measurePerformance(async () => {
      fireEvent.change(searchInput, { target: { value: 'Sarah' } });
      
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Marcus Rodriguez')).not.toBeInTheDocument();
      });
    }, 'Search Filter Performance');

    expect(searchTime).toBeLessThan(PAGE_PERFORMANCE_THRESHOLDS.SEARCH_RESPONSE);
  });

  it('measures approach filter performance', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const filterTime = await measurePerformance(async () => {
      const approachFilter = screen.getByRole('combobox');
      fireEvent.click(approachFilter);
      
      const cbtOption = screen.getByText('CBT');
      fireEvent.click(cbtOption);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    }, 'Approach Filter Performance');

    expect(filterTime).toBeLessThan(PAGE_PERFORMANCE_THRESHOLDS.FILTER_RESPONSE);
  });

  it('measures multiple filter operations performance', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const multiFilterTime = await measurePerformance(async () => {
      const searchInput = screen.getByPlaceholderText(/search therapists/i);
      
      // Apply search filter
      fireEvent.change(searchInput, { target: { value: 'anxiety' } });
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Apply approach filter
      const approachFilter = screen.getByRole('combobox');
      fireEvent.click(approachFilter);
      const cbtOption = screen.getByText('CBT');
      fireEvent.click(cbtOption);
      
      await waitFor(() => {
        expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      });
    }, 'Multiple Filters Performance');

    expect(multiFilterTime).toBeLessThan(PAGE_PERFORMANCE_THRESHOLDS.FILTER_RESPONSE * 2);
  });

  it('measures therapist card rendering performance', async () => {
    // Create larger dataset for stress testing
    const largeTherapistData = Array.from({ length: 20 }, (_, i) => ({
      ...mockTherapistData[0],
      id: `therapist-${i}`,
      name: `Dr. Therapist ${i}`,
    }));

    vi.mocked(vi.fn()).mockReturnValue({
      data: largeTherapistData,
      error: null,
    });

    const renderTime = await measurePerformance(async () => {
      renderWithRouter(<TherapistDiscovery />);
      
      await waitFor(() => {
        expect(screen.getByText('Discover Your Ideal AI Therapist')).toBeInTheDocument();
        // Wait for multiple cards to render
        const cards = screen.getAllByText(/Dr\. Therapist/);
        expect(cards.length).toBeGreaterThan(5);
      }, { timeout: 3000 });
    }, 'Large Dataset Card Rendering');

    const averageCardRenderTime = renderTime / largeTherapistData.length;
    expect(averageCardRenderTime).toBeLessThan(PAGE_PERFORMANCE_THRESHOLDS.CARD_RENDER);
  });

  it('measures voice preview loading performance', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const voicePreviewTime = await measurePerformance(async () => {
      const voiceButtons = screen.getAllByText(/preview voice/i);
      fireEvent.click(voiceButtons[0]);
      
      // Simulate voice preview loading
      await new Promise(resolve => setTimeout(resolve, 50));
    }, 'Voice Preview Performance');

    expect(voicePreviewTime).toBeLessThan(200); // Should be responsive
  });

  it('measures memory usage during extended browsing', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    const { unmount } = renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Simulate user interactions
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    
    // Multiple search operations
    const searchTerms = ['anxiety', 'depression', 'trauma', 'mindfulness', ''];
    for (const term of searchTerms) {
      fireEvent.change(searchInput, { target: { value: term } });
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const peakMemory = performance.memory?.usedJSHeapSize || 0;
    unmount();
    
    if (global.gc) {
      global.gc();
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = (peakMemory - initialMemory) / 1024 / 1024;
    const memoryLeakage = (finalMemory - initialMemory) / 1024 / 1024;

    console.log(`Page memory increase: ${memoryIncrease.toFixed(2)}MB`);
    console.log(`Memory after cleanup: ${memoryLeakage.toFixed(2)}MB`);

    expect(memoryIncrease).toBeLessThan(50); // Reasonable memory usage
    expect(memoryLeakage).toBeLessThan(5); // Minimal memory leaks
  });

  it('measures scroll performance with many cards', async () => {
    const largeDataset = Array.from({ length: 50 }, (_, i) => ({
      ...mockTherapistData[0],
      id: `therapist-${i}`,
      name: `Dr. Therapist ${i}`,
    }));

    vi.mocked(vi.fn()).mockReturnValue({
      data: largeDataset,
      error: null,
    });

    renderWithRouter(<TherapistDiscovery />);
    
    await waitFor(() => {
      expect(screen.getByText('Discover Your Ideal AI Therapist')).toBeInTheDocument();
    });

    const scrollTime = await measurePerformance(async () => {
      const container = document.querySelector('[data-testid="therapist-grid"]') || document.body;
      
      // Simulate multiple scroll events
      for (let i = 0; i < 10; i++) {
        fireEvent.scroll(container, { target: { scrollY: i * 100 } });
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }, 'Scroll Performance');

    expect(scrollTime).toBeLessThan(500); // Should handle scrolling smoothly
  });
});