import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Professional2DAvatar from '@/components/avatar/Professional2DAvatar';
import AvatarErrorBoundary from '@/components/avatar/AvatarErrorBoundary';
import { initializeLovableTagger } from '@/utils/lovableTaggerFix';

// Mock the avatar images to prevent loading errors in tests
vi.mock('@/assets/avatars/dr-sarah-chen.jpg', () => ({
  default: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
}));

vi.mock('@/assets/avatars/dr-michael-torres.jpg', () => ({
  default: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
}));

describe('Avatar Integration Tests', () => {
  beforeEach(() => {
    // Initialize lovable-tagger fix before each test
    initializeLovableTagger();
  });

  it('should render Professional2DAvatar without errors', () => {
    expect(() => {
      render(
        React.createElement(Professional2DAvatar, {
          therapistId: "dr-sarah-chen",
          therapistName: "Dr. Sarah Chen",
          size: "md",
          emotion: "neutral"
        })
      );
    }).not.toThrow();
  });

  it('should render Professional2DAvatar with fallback when no image', () => {
    render(
      React.createElement(Professional2DAvatar, {
        therapistId: "unknown-therapist",
        therapistName: "Unknown Therapist",
        size: "md",
        emotion: "neutral"
      })
    );
    
    // Should show initials fallback
    expect(screen.getByText('UT')).toBeInTheDocument();
  });

  it('should handle lovable-tagger initialization in components', () => {
    // Verify the fix works in component context
    expect(() => {
      const lovObj = (window as any).lov;
      expect(lovObj).toBeDefined();
      expect(lovObj.initialized).toBe(true);
      
      // Simulate potential avatar component access patterns
      if (lovObj && lovObj.config) {
        const avatarConfig = lovObj.config.avatar || {};
        console.log('Avatar config access successful');
      }
    }).not.toThrow();
  });

  it('should render components after lovable-tagger fix', () => {
    // Test that components can render normally after the fix
    const component = render(
      React.createElement(Professional2DAvatar, {
        therapistId: "dr-sarah-chen",
        therapistName: "Dr. Sarah Chen",
        size: "lg",
        emotion: "encouraging"
      })
    );
    
    expect(component.container).toBeInTheDocument();
  });
});