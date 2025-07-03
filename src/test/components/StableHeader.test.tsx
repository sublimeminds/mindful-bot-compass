import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StableHeader from '@/components/navigation/StableHeader';

const mockNavigate = vi.fn();
const mockUser = { id: '1', email: 'test@example.com' };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false
  })
}));

vi.mock('@/components/ui/GradientLogo', () => ({
  default: ({ size }: { size: string }) => <div data-testid="gradient-logo" data-size={size} />
}));

vi.mock('@/components/ui/LanguageSelector', () => ({
  default: () => <div data-testid="language-selector" />
}));

vi.mock('@/components/navigation/SafeDropdownMenu', () => ({
  default: ({ trigger, title, onItemClick }: any) => (
    <button
      data-testid={`dropdown-${trigger.label.toLowerCase()}`}
      onClick={() => onItemClick('/test')}
    >
      {trigger.label}
    </button>
  )
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('StableHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with logo and brand name', () => {
    renderWithRouter(<StableHeader />);
    
    expect(screen.getByTestId('gradient-logo')).toBeInTheDocument();
    expect(screen.getByText('TherapySync')).toBeInTheDocument();
  });

  it('renders all three dropdown menus', () => {
    renderWithRouter(<StableHeader />);
    
    expect(screen.getByTestId('dropdown-ai')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-platform')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-help')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    renderWithRouter(<StableHeader />);
    
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('renders sign in and get started buttons when user is not authenticated', () => {
    renderWithRouter(<StableHeader />);
    
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('handles sign in button click', () => {
    renderWithRouter(<StableHeader />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('handles get started button click', () => {
    renderWithRouter(<StableHeader />);
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding');
  });

  it('handles dropdown navigation', () => {
    renderWithRouter(<StableHeader />);
    
    const aiDropdown = screen.getByTestId('dropdown-ai');
    fireEvent.click(aiDropdown);
    
    expect(mockNavigate).toHaveBeenCalledWith('/test');
  });

  it('applies correct CSS classes', () => {
    renderWithRouter(<StableHeader />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50');
  });

  it('renders responsive navigation classes', () => {
    renderWithRouter(<StableHeader />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden', 'md:flex');
  });
});