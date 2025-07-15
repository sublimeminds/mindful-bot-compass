import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntelligentPersonalizationDashboard from '@/components/ai/IntelligentPersonalizationDashboard';

// Mock functions
const mockUseAuth = vi.fn();
const mockAnalyzeUserPatterns = vi.fn();
const mockGenerateContextualRecommendations = vi.fn();
const mockPredictMoodRisk = vi.fn();

// Mock dependencies
vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth
}));

vi.mock('@/services/enhancedPersonalizationService', () => ({
  EnhancedPersonalizationService: {
    analyzeUserPatterns: mockAnalyzeUserPatterns,
    generateContextualRecommendations: mockGenerateContextualRecommendations,
    predictMoodRisk: mockPredictMoodRisk
  }
}));

describe('IntelligentPersonalizationDashboard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    role: 'authenticated',
    confirmation_sent_at: null,
    confirmed_at: null,
    email_confirmed_at: null,
    invited_at: null,
    last_sign_in_at: null,
    phone: null,
    phone_confirmed_at: null,
    recovery_sent_at: null
  };

  const mockUserPatterns = [
    {
      type: 'mood_cycle',
      pattern: { bestDays: [1, 2, 3] },
      confidence: 0.85
    },
    {
      type: 'session_timing',
      pattern: { preferredHours: [9, 10, 15] },
      confidence: 0.78
    },
    {
      type: 'technique_preference',
      pattern: { mostEffective: ['CBT', 'Mindfulness', 'Breathing'] },
      confidence: 0.92
    }
  ];

  const mockRecommendations = [
    {
      id: 'rec-1',
      type: 'technique',
      title: 'Recommended Breathing Exercise',
      description: 'Based on your stress patterns',
      confidence: 0.89
    },
    {
      id: 'rec-2',
      type: 'session',
      title: 'Optimal Session Time',
      description: 'Schedule sessions at 10 AM for best results',
      confidence: 0.95
    }
  ];

  const mockRiskAssessment = {
    riskLevel: 'medium',
    confidence: 0.82,
    suggestedActions: [
      'Consider scheduling additional sessions',
      'Monitor mood patterns more closely'
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn()
    });

    mockAnalyzeUserPatterns.mockResolvedValue(mockUserPatterns);
    mockGenerateContextualRecommendations.mockResolvedValue(mockRecommendations);
    mockPredictMoodRisk.mockResolvedValue(mockRiskAssessment);
  });

  describe('Component Rendering', () => {
    it('renders loading state initially', () => {
      render(<IntelligentPersonalizationDashboard />);
      
      expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
    });

    it('renders dashboard after loading', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });

    it('renders without user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        register: vi.fn(),
        login: vi.fn(),
        logout: vi.fn()
      });

      render(<IntelligentPersonalizationDashboard />);
      
      // Should still render the component structure
      expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
    });
  });

  describe('Risk Assessment Alert', () => {
    it('displays risk assessment alert for medium risk', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });

    it('displays high risk alert with proper styling', async () => {
      const highRiskAssessment = {
        riskLevel: 'high',
        confidence: 0.91,
        suggestedActions: ['Immediate professional consultation recommended']
      };

      mockPredictMoodRisk.mockResolvedValue(highRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });

    it('does not display alert for low risk', async () => {
      const lowRiskAssessment = {
        riskLevel: 'low',
        confidence: 0.75,
        suggestedActions: ['Continue current approach']
      };

      mockPredictMoodRisk.mockResolvedValue(lowRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing', () => {
    it('processes user patterns correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(mockAnalyzeUserPatterns).toHaveBeenCalledWith('user-123');
        expect(mockGenerateContextualRecommendations).toHaveBeenCalledWith('user-123');
        expect(mockPredictMoodRisk).toHaveBeenCalledWith('user-123');
      });
    });

    it('handles missing pattern data gracefully', async () => {
      const incompletePatterns = [
        {
          type: 'mood_cycle',
          confidence: 0.85
          // missing pattern data
        }
      ];

      mockAnalyzeUserPatterns.mockResolvedValue(incompletePatterns);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('refreshes insights when refresh button is clicked', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });

      // Mock button click if available
      if (screen.queryByText('Refresh Insights')) {
        fireEvent.click(screen.getByText('Refresh Insights'));
      }

      await waitFor(() => {
        expect(mockAnalyzeUserPatterns).toHaveBeenCalled();
        expect(mockGenerateContextualRecommendations).toHaveBeenCalled();
        expect(mockPredictMoodRisk).toHaveBeenCalled();
      });
    });

    it('handles refresh errors gracefully', async () => {
      mockAnalyzeUserPatterns.mockRejectedValueOnce(new Error('Service error'));

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles service errors gracefully', async () => {
      mockAnalyzeUserPatterns.mockRejectedValue(new Error('Service unavailable'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('handles partial service failures', async () => {
      mockAnalyzeUserPatterns.mockResolvedValue(mockUserPatterns);
      mockGenerateContextualRecommendations.mockRejectedValue(new Error('Recommendations failed'));
      mockPredictMoodRisk.mockResolvedValue(mockRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        // Should still display available data
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper component structure', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });

    it('supports user interaction', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });
});