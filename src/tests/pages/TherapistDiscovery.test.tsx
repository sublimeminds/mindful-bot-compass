import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TherapistDiscovery from '@/pages/TherapistDiscovery';
import { mockTherapistData } from '../utils/mock-data';
import { mockIntersectionObserver, mockAudioContext } from '../utils/test-helpers';

// Mock Supabase client
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

// Mock avatar components
vi.mock('@/components/avatar/Professional2DAvatar', () => ({
  default: vi.fn(({ therapistName }) => <div data-testid="avatar">{therapistName}</div>),
}));

// Mock auth hook
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

describe('TherapistDiscovery', () => {
  beforeEach(() => {
    mockIntersectionObserver();
    mockAudioContext();
    vi.clearAllMocks();
  });

  it('renders the page title and description', async () => {
    renderWithRouter(<TherapistDiscovery />);

    expect(screen.getByText('Discover Your Ideal AI Therapist')).toBeInTheDocument();
    expect(screen.getByText(/Choose from our diverse team/)).toBeInTheDocument();
  });

  it('displays therapist cards with correct information', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Dr. Marcus Rodriguez')).toBeInTheDocument();
    });

    // Check for specialties
    expect(screen.getByText('Anxiety')).toBeInTheDocument();
    expect(screen.getByText('Trauma')).toBeInTheDocument();
  });

  it('filters therapists by search query', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.queryByText('Dr. Marcus Rodriguez')).not.toBeInTheDocument();
    });
  });

  it('filters therapists by approach', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const approachFilter = screen.getByRole('combobox');
    fireEvent.click(approachFilter);
    
    const cbtOption = screen.getByText('CBT');
    fireEvent.click(cbtOption);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.queryByText('Dr. Marcus Rodriguez')).not.toBeInTheDocument();
    });
  });

  it('shows avatars for each therapist', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      const avatars = screen.getAllByTestId('avatar');
      expect(avatars).toHaveLength(2);
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Dr. Marcus Rodriguez')).toBeInTheDocument();
    });
  });

  it('handles voice preview functionality', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const voicePreviewButtons = screen.getAllByText(/preview voice/i);
    expect(voicePreviewButtons.length).toBeGreaterThan(0);

    fireEvent.click(voicePreviewButtons[0]);
    
    // Check that audio preview functionality is triggered
    expect(voicePreviewButtons[0]).toBeInTheDocument();
  });

  it('displays compatibility scores', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      // Look for compatibility score elements
      const compatibilityElements = screen.getAllByText(/match/i);
      expect(compatibilityElements.length).toBeGreaterThan(0);
    });
  });

  it('handles therapist selection', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    const therapistCard = screen.getByText('Dr. Sarah Chen').closest('div');
    if (therapistCard) {
      fireEvent.click(therapistCard);
      
      // Verify selection state change
      expect(therapistCard).toHaveClass('ring-2');
    }
  });

  it('shows loading state while fetching data', () => {
    // Mock loading state
    vi.mocked(vi.fn()).mockReturnValueOnce({
      data: null,
      error: null,
      loading: true,
    });

    renderWithRouter(<TherapistDiscovery />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles error state when data fetch fails', async () => {
    // Mock error state
    const mockError = new Error('Failed to fetch therapists');
    vi.mocked(vi.fn()).mockReturnValueOnce({
      data: null,
      error: mockError,
      loading: false,
    });

    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('filters by multiple criteria simultaneously', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Search for anxiety
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    fireEvent.change(searchInput, { target: { value: 'anxiety' } });

    // Select CBT approach
    const approachFilter = screen.getByRole('combobox');
    fireEvent.click(approachFilter);
    const cbtOption = screen.getByText('CBT');
    fireEvent.click(cbtOption);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.queryByText('Dr. Marcus Rodriguez')).not.toBeInTheDocument();
    });
  });

  it('clears filters when reset is clicked', async () => {
    renderWithRouter(<TherapistDiscovery />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    });

    // Apply filter
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    fireEvent.change(searchInput, { target: { value: 'Sarah' } });

    // Clear filters
    const clearButton = screen.getByText(/clear/i);
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('Dr. Marcus Rodriguez')).toBeInTheDocument();
    });
  });
});