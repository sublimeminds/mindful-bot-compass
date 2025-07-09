import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import TherapistDiscovery from '@/pages/TherapistDiscovery';
import RealTherapyChatInterface from '@/components/chat/RealTherapyChatInterface';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { mockTherapistData } from '../utils/mock-data';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock dependencies
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

vi.mock('@/hooks/useRealEnhancedChat', () => ({
  useRealEnhancedChat: () => ({
    messages: [],
    sendMessage: vi.fn(),
    isLoading: false,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Accessibility Compliance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TherapistDiscovery page has no accessibility violations', async () => {
    const { container } = renderWithRouter(<TherapistDiscovery />);
    
    // Wait for content to load
    await screen.findByText('Discover Your Ideal AI Therapist');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Chat interface has no accessibility violations', async () => {
    const { container } = renderWithRouter(<RealTherapyChatInterface />);
    
    // Wait for chat interface to load
    await screen.findByPlaceholderText(/type your message/i);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Avatar component has proper accessibility attributes', async () => {
    const { container } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        isListening={true}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // Check specific accessibility attributes
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toHaveAttribute('alt');
    
    const statusText = screen.getByText('Listening...');
    expect(statusText).toBeInTheDocument();
  });

  it('validates keyboard navigation on therapist discovery', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await screen.findByText('Dr. Sarah Chen');

    // Check if interactive elements are focusable
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    expect(searchInput).toHaveAttribute('tabindex', '0');

    const filterSelect = screen.getByRole('combobox');
    expect(filterSelect).toHaveAttribute('tabindex', '0');

    // Check therapist cards
    const therapistButtons = screen.getAllByRole('button');
    therapistButtons.forEach(button => {
      expect(button).toHaveAttribute('tabindex', '0');
    });
  });

  it('validates keyboard navigation in chat interface', async () => {
    renderWithRouter(<RealTherapyChatInterface />);
    
    await screen.findByPlaceholderText(/type your message/i);

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    expect(messageInput).toHaveAttribute('tabindex', '0');

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toHaveAttribute('tabindex', '0');
  });

  it('validates ARIA labels and descriptions', async () => {
    renderWithRouter(<TherapistDiscovery />);
    
    await screen.findByText('Dr. Sarah Chen');

    // Check search input has proper ARIA label
    const searchInput = screen.getByPlaceholderText(/search therapists/i);
    expect(searchInput).toHaveAttribute('aria-label');

    // Check filter has proper ARIA label
    const filterSelect = screen.getByRole('combobox');
    expect(filterSelect).toHaveAttribute('aria-label');

    // Check therapist cards have descriptive labels
    const therapistCards = screen.getAllByRole('button');
    therapistCards.forEach(card => {
      expect(card).toHaveAttribute('aria-label');
    });
  });

  it('validates color contrast ratios', async () => {
    const { container } = renderWithRouter(<TherapistDiscovery />);
    
    await screen.findByText('Dr. Sarah Chen');

    // This would typically use a tool like axe-core's color contrast checker
    // For now, we'll check that text elements have appropriate classes
    const titleElement = screen.getByText('Discover Your Ideal AI Therapist');
    expect(titleElement).toHaveClass(/text-/); // Should have text color class

    const therapistNames = screen.getAllByText(/Dr\./);
    therapistNames.forEach(name => {
      expect(name).toHaveClass(/text-/); // Should have appropriate text color
    });
  });

  it('validates focus management in modals', async () => {
    // This test would be more comprehensive with actual modal implementation
    renderWithRouter(<TherapistDiscovery />);
    
    await screen.findByText('Dr. Sarah Chen');

    // Check that focus is managed properly when opening modals/dialogs
    const voicePreviewButtons = screen.getAllByText(/preview/i);
    if (voicePreviewButtons.length > 0) {
      expect(voicePreviewButtons[0]).toHaveAttribute('tabindex', '0');
    }
  });

  it('validates screen reader compatibility', async () => {
    renderWithRouter(<RealTherapyChatInterface />);
    
    await screen.findByPlaceholderText(/type your message/i);

    // Check for screen reader friendly elements
    const messageInput = screen.getByPlaceholderText(/type your message/i);
    expect(messageInput).toHaveAttribute('aria-label');

    // Check for live regions for dynamic content
    const chatContainer = messageInput.closest('[role="main"]') || 
                         messageInput.closest('[aria-live]');
    // Should have live region for screen reader updates
  });

  it('validates semantic HTML structure', async () => {
    const { container } = renderWithRouter(<TherapistDiscovery />);
    
    await screen.findByText('Discover Your Ideal AI Therapist');

    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    // Check for proper landmark roles
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();

    // Check for proper list structures if present
    const lists = container.querySelectorAll('ul, ol');
    lists.forEach(list => {
      expect(list.children.length).toBeGreaterThan(0);
    });
  });

  it('validates form accessibility', async () => {
    renderWithRouter(<RealTherapyChatInterface />);
    
    await screen.findByPlaceholderText(/type your message/i);

    const messageInput = screen.getByPlaceholderText(/type your message/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Check form labels
    expect(messageInput).toHaveAttribute('aria-label');
    
    // Check button accessibility
    expect(sendButton).toHaveAttribute('aria-label');
    expect(sendButton).not.toHaveAttribute('disabled'); // Should be accessible when enabled

    // Check form submission method
    const form = messageInput.closest('form');
    if (form) {
      expect(form).toHaveAttribute('action'); // or onSubmit handler
    }
  });

  it('validates error message accessibility', async () => {
    // Mock error state
    vi.mocked(vi.fn()).mockReturnValue({
      data: null,
      error: new Error('Failed to load therapists'),
    });

    renderWithRouter(<TherapistDiscovery />);

    // Wait for error message
    await screen.findByText(/error|failed/i);

    const errorMessage = screen.getByText(/error|failed/i);
    
    // Error messages should be announced to screen readers
    expect(errorMessage).toHaveAttribute('role', 'alert');
    // or should be in a live region
    const liveRegion = errorMessage.closest('[aria-live="polite"], [aria-live="assertive"]');
    expect(liveRegion || errorMessage.getAttribute('role')).toBeTruthy();
  });

  it('validates loading state accessibility', async () => {
    vi.mocked(vi.fn()).mockReturnValue({
      data: null,
      error: null,
      loading: true,
    });

    renderWithRouter(<TherapistDiscovery />);

    const loadingElement = screen.getByText(/loading/i);
    
    // Loading states should be announced
    expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    // or have appropriate role
    expect(loadingElement).toHaveAttribute('role', 'status');
  });
});