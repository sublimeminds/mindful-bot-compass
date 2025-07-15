import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IntelligentPersonalizationDashboard from '@/components/ai/IntelligentPersonalizationDashboard';

// Mock dependencies
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

vi.mock('@/services/enhancedPersonalizationService', () => ({
  EnhancedPersonalizationService: {
    analyzeUserPatterns: vi.fn(),
    generateContextualRecommendations: vi.fn(),
    predictMoodRisk: vi.fn()
  }
}));

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;
const mockEnhancedPersonalizationService = vi.mocked(await import('@/services/enhancedPersonalizationService')).EnhancedPersonalizationService;

describe('IntelligentPersonalizationDashboard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' }
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
      signUp: vi.fn()
    });

    mockEnhancedPersonalizationService.analyzeUserPatterns.mockResolvedValue(mockUserPatterns);
    mockEnhancedPersonalizationService.generateContextualRecommendations.mockResolvedValue(mockRecommendations);
    mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue(mockRiskAssessment);
  });

  describe('Component Rendering', () => {
    it('renders loading state initially', () => {
      render(<IntelligentPersonalizationDashboard />);
      
      expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      expect(screen.getByText('AI Personalization Dashboard').previousElementSibling).toHaveClass('animate-pulse');
    });

    it('renders dashboard after loading', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Refresh Insights')).toBeInTheDocument();
      });
    });

    it('renders without user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
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
        expect(screen.getByText('Proactive Support Recommended')).toBeInTheDocument();
        expect(screen.getByText('medium risk')).toBeInTheDocument();
        expect(screen.getByText('Consider scheduling additional sessions')).toBeInTheDocument();
      });
    });

    it('displays high risk alert with proper styling', async () => {
      const highRiskAssessment = {
        riskLevel: 'high',
        confidence: 0.91,
        suggestedActions: ['Immediate professional consultation recommended']
      };

      mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue(highRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('high risk')).toBeInTheDocument();
        expect(screen.getByText('Immediate professional consultation recommended')).toBeInTheDocument();
      });
    });

    it('does not display alert for low risk', async () => {
      const lowRiskAssessment = {
        riskLevel: 'low',
        confidence: 0.75,
        suggestedActions: ['Continue current approach']
      };

      mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue(lowRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.queryByText('Proactive Support Recommended')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    it('switches between tabs correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument();
      });

      // Click on Patterns tab
      fireEvent.click(screen.getByText('Patterns'));
      expect(screen.getByText('Mood Patterns')).toBeInTheDocument();

      // Click on Recommendations tab
      fireEvent.click(screen.getByText('Recommendations'));
      expect(screen.getByText('Recommended Breathing Exercise')).toBeInTheDocument();

      // Click on Predictions tab
      fireEvent.click(screen.getByText('Predictions'));
      // Predictions tab content should be visible
    });

    it('maintains tab state correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Insights')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Patterns'));
      expect(screen.getByText('Mood Patterns')).toBeInTheDocument();
      
      // Tab should remain active
      expect(screen.getByRole('tab', { name: /Patterns/i })).toHaveAttribute('data-state', 'active');
    });
  });

  describe('AI Insights Tab', () => {
    it('displays generated insights', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/Strong.*Pattern Detected/)).toBeInTheDocument();
        expect(screen.getByText(/Medium Risk Detected/)).toBeInTheDocument();
        expect(screen.getByText('Personalized Recommendations Available')).toBeInTheDocument();
      });
    });

    it('shows insights with correct priority badges', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('pattern')).toBeInTheDocument();
        expect(screen.getByText('prediction')).toBeInTheDocument();
        expect(screen.getByText('recommendation')).toBeInTheDocument();
      });
    });

    it('displays confidence scores correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('85% confidence')).toBeInTheDocument();
        expect(screen.getByText('82% confidence')).toBeInTheDocument();
      });
    });

    it('shows empty state when no insights', async () => {
      mockEnhancedPersonalizationService.analyzeUserPatterns.mockResolvedValue([]);
      mockEnhancedPersonalizationService.generateContextualRecommendations.mockResolvedValue([]);
      mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue({ riskLevel: 'low', confidence: 0.5, suggestedActions: [] });

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Learning About You')).toBeInTheDocument();
        expect(screen.getByText(/Keep using the app and I'll start generating/)).toBeInTheDocument();
      });
    });
  });

  describe('Patterns Tab', () => {
    it('displays mood patterns correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Patterns'));
        expect(screen.getByText('Mood Patterns')).toBeInTheDocument();
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.getByText('Tuesday')).toBeInTheDocument();
        expect(screen.getByText('Wednesday')).toBeInTheDocument();
      });
    });

    it('displays session timing patterns', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Patterns'));
        expect(screen.getByText('Optimal Timing')).toBeInTheDocument();
        expect(screen.getByText('9:00')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('15:00')).toBeInTheDocument();
      });
    });

    it('displays technique preferences', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Patterns'));
        expect(screen.getByText('Effective Techniques')).toBeInTheDocument();
        expect(screen.getByText('CBT')).toBeInTheDocument();
        expect(screen.getByText('Mindfulness')).toBeInTheDocument();
        expect(screen.getByText('Breathing')).toBeInTheDocument();
      });
    });

    it('shows confidence levels for each pattern', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Patterns'));
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('78%')).toBeInTheDocument();
        expect(screen.getByText('92%')).toBeInTheDocument();
      });
    });
  });

  describe('Recommendations Tab', () => {
    it('displays recommendations list', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Recommendations'));
        expect(screen.getByText('Recommended Breathing Exercise')).toBeInTheDocument();
        expect(screen.getByText('Optimal Session Time')).toBeInTheDocument();
      });
    });

    it('shows recommendation confidence scores', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Recommendations'));
        expect(screen.getByText('89% confidence')).toBeInTheDocument();
        expect(screen.getByText('95% confidence')).toBeInTheDocument();
      });
    });

    it('displays empty state when no recommendations', async () => {
      mockEnhancedPersonalizationService.generateContextualRecommendations.mockResolvedValue([]);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Recommendations'));
        expect(screen.getByText('No Recommendations Available')).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    it('refreshes insights when refresh button is clicked', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Refresh Insights')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Refresh Insights'));

      await waitFor(() => {
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalledTimes(2);
        expect(mockEnhancedPersonalizationService.generateContextualRecommendations).toHaveBeenCalledTimes(2);
        expect(mockEnhancedPersonalizationService.predictMoodRisk).toHaveBeenCalledTimes(2);
      });
    });

    it('handles refresh errors gracefully', async () => {
      mockEnhancedPersonalizationService.analyzeUserPatterns.mockRejectedValueOnce(new Error('Service error'));

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Refresh Insights')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Refresh Insights'));

      // Should not crash the component
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing', () => {
    it('processes user patterns correctly', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalledWith('user-123');
        expect(mockEnhancedPersonalizationService.generateContextualRecommendations).toHaveBeenCalledWith('user-123');
        expect(mockEnhancedPersonalizationService.predictMoodRisk).toHaveBeenCalledWith('user-123');
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

      mockEnhancedPersonalizationService.analyzeUserPatterns.mockResolvedValue(incompletePatterns);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });

      // Should not crash when processing incomplete data
      fireEvent.click(screen.getByText('Patterns'));
      expect(screen.getByText('Mood Patterns')).toBeInTheDocument();
    });
  });

  describe('Insight Generation', () => {
    it('generates insights based on patterns', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        // High confidence pattern should generate insight
        expect(screen.getByText(/Strong technique_preference Pattern Detected/)).toBeInTheDocument();
        expect(screen.getByText(/92% confidence/)).toBeInTheDocument();
      });
    });

    it('prioritizes insights correctly', async () => {
      const highRiskAssessment = {
        riskLevel: 'high',
        confidence: 0.95,
        suggestedActions: ['Immediate action required']
      };

      mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue(highRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('High Risk Detected')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles service errors gracefully', async () => {
      mockEnhancedPersonalizationService.analyzeUserPatterns.mockRejectedValue(new Error('Service unavailable'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('handles partial service failures', async () => {
      mockEnhancedPersonalizationService.analyzeUserPatterns.mockResolvedValue(mockUserPatterns);
      mockEnhancedPersonalizationService.generateContextualRecommendations.mockRejectedValue(new Error('Recommendations failed'));
      mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue(mockRiskAssessment);

      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        // Should still display available data
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Patterns'));
        expect(screen.getByText('Mood Patterns')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Refresh Insights/i })).toBeInTheDocument();
        expect(screen.getByRole('tablist')).toBeInTheDocument();
      });
    });

    it('supports keyboard navigation', async () => {
      render(<IntelligentPersonalizationDashboard />);
      
      await waitFor(() => {
        const tabButtons = screen.getAllByRole('tab');
        tabButtons[0].focus();
        expect(document.activeElement).toBe(tabButtons[0]);
      });
    });
  });
});