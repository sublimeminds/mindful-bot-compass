import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import { mockIntersectionObserver } from '../utils/test-helpers';

// Mock avatar image imports
vi.mock('@/utils/avatarImageImports', () => ({
  getAvatarImage: vi.fn((id: string) => `mock-image-${id}.jpg`),
  hasAnyAvatarImages: vi.fn(() => true),
}));

describe('Professional2DAvatar', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  it('renders with basic required props', () => {
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
      />
    );

    expect(screen.getByText('Dr. Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('AI Therapist')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        size="sm"
      />
    );

    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar.parentElement).toHaveClass('w-12', 'h-12');

    rerender(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        size="xl"
      />
    );

    expect(avatar.parentElement).toHaveClass('w-32', 'h-32');
  });

  it('shows status indicators for listening state', () => {
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        isListening={true}
      />
    );

    expect(screen.getByText('Listening...')).toBeInTheDocument();
    const statusIndicator = document.querySelector('.bg-blue-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('shows status indicators for speaking state', () => {
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        isSpeaking={true}
      />
    );

    expect(screen.getByText('Speaking...')).toBeInTheDocument();
    const statusIndicator = document.querySelector('.bg-green-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('applies emotion-based styling', () => {
    const { rerender } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        emotion="happy"
      />
    );

    let avatarContainer = document.querySelector('.brightness-110');
    expect(avatarContainer).toBeInTheDocument();

    rerender(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        emotion="concerned"
      />
    );

    avatarContainer = document.querySelector('.brightness-90');
    expect(avatarContainer).toBeInTheDocument();
  });

  it('handles missing props gracefully', () => {
    render(
      <Professional2DAvatar
        therapistId=""
        therapistName=""
      />
    );

    expect(screen.getByText('AI Therapist')).toBeInTheDocument();
    const fallbackAvatar = screen.getByText('AI');
    expect(fallbackAvatar).toBeInTheDocument();
  });

  it('hides name when showName is false', () => {
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        showName={false}
      />
    );

    expect(screen.queryByText('Dr. Sarah Chen')).not.toBeInTheDocument();
  });

  it('calls onLoad when image loads successfully', () => {
    const onLoadMock = vi.fn();
    
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        onLoad={onLoadMock}
      />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.load(img);

    expect(onLoadMock).toHaveBeenCalled();
  });

  it('calls onError when image fails to load', () => {
    const onErrorMock = vi.fn();
    
    render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
        onError={onErrorMock}
      />
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.error(img);

    expect(onErrorMock).toHaveBeenCalled();
  });

  it('generates consistent colors for same therapist ID', () => {
    const { rerender } = render(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
      />
    );

    const firstRender = document.querySelector('[class*="from-"]');
    const firstColorClass = Array.from(firstRender?.classList || []).find(cls => cls.startsWith('from-'));

    rerender(
      <Professional2DAvatar
        therapistId="dr-sarah-chen"
        therapistName="Dr. Sarah Chen"
      />
    );

    const secondRender = document.querySelector('[class*="from-"]');
    const secondColorClass = Array.from(secondRender?.classList || []).find(cls => cls.startsWith('from-'));

    expect(firstColorClass).toBe(secondColorClass);
  });
});