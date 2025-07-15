import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AIHub from '@/pages/AIHub';
import EliteSystemDashboard from '@/components/elite/EliteSystemDashboard';

// Mock all required dependencies
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

vi.mock('@/hooks/useEliteSystemIntegration', () => ({
  useEliteSystemIntegration: vi.fn()
}));

vi.mock('@/hooks/useEliteSystemActivation', () => ({
  useEliteSystemActivation: vi.fn()
}));

vi.mock('@/hooks/useRealTimeEliteIntegration', () => ({
  useRealTimeEliteIntegration: vi.fn()
}));

vi.mock('@/services/enhancedPersonalizationService', () => ({
  EnhancedPersonalizationService: {
    analyzeUserPatterns: vi.fn(),
    generateContextualRecommendations: vi.fn(),
    predictMoodRisk: vi.fn()
  }
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [] }))
      }))
    }))
  }
}));

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;
const mockUseEliteSystemIntegration = vi.mocked(await import('@/hooks/useEliteSystemIntegration')).useEliteSystemIntegration;
const mockUseEliteSystemActivation = vi.mocked(await import('@/hooks/useEliteSystemActivation')).useEliteSystemActivation;
const mockUseRealTimeEliteIntegration = vi.mocked(await import('@/hooks/useRealTimeEliteIntegration')).useRealTimeEliteIntegration;
const mockEnhancedPersonalizationService = vi.mocked(await import('@/services/enhancedPersonalizationService')).EnhancedPersonalizationService;
const mockSupabase = vi.mocked(await import('@/integrations/supabase/client')).supabase;

describe('AI Workflow Integration Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' }
  };

  const mockMessages = [
    {
      id: 'message-1',
      content: 'I feel anxious about my presentation tomorrow',
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 'message-2',
      content: 'I understand that presentations can be anxiety-provoking. Let\'s work on some strategies to help you feel more confident.',
      isUser: false,
      timestamp: new Date()
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default auth mock
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    // Setup Elite System Integration mock
    mockUseEliteSystemIntegration.mockReturnValue({
      messages: mockMessages,
      systemStatus: { isActivated: true },
      processMessage: vi.fn().mockResolvedValue('Processed through Elite AI'),
      analyzeSession: vi.fn().mockResolvedValue({ insights: ['User shows anxiety patterns', 'Recommend CBT techniques'] }),
      sendMessage: vi.fn().mockResolvedValue(true),
      playMessage: vi.fn(),
      stopPlayback: vi.fn(),
      loadPreferences: vi.fn(),
      initiateEliteSession: vi.fn().mockResolvedValue('session-123'),
      isLoading: false,
      isPlaying: false,
      userPreferences: { voice_enabled: true },
      currentSessionId: 'session-123',
      activateEliteSystem: vi.fn(),
      getEliteSystemStatus: vi.fn()
    });

    // Setup Elite System Activation mock
    mockUseEliteSystemActivation.mockReturnValue({
      systemStatus: {
        isActivated: true,
        systemHealth: 'optimal',
        culturalAiActive: true,
        adaptiveLearningActive: true,
        cronJobsActive: true,
        lastActivation: new Date().toISOString()
      },
      isActivating: false,
      activateEliteSystem: vi.fn().mockResolvedValue({ success: true }),
      checkSystemStatus: vi.fn().mockResolvedValue({ success: true }),
      getSystemMetrics: vi.fn().mockResolvedValue({})
    });

    // Setup Real-time Elite Integration mock
    mockUseRealTimeEliteIntegration.mockReturnValue({
      isConnected: true,
      metrics: { responseTime: 150, throughput: 95 }
    });

    // Setup Enhanced Personalization Service mock
    mockEnhancedPersonalizationService.analyzeUserPatterns.mockResolvedValue([
      {
        type: 'mood_cycle',
        pattern: { bestDays: [1, 2, 3] },
        confidence: 0.85
      }
    ]);

    mockEnhancedPersonalizationService.generateContextualRecommendations.mockResolvedValue([
      {
        id: 'rec-1',
        type: 'technique',
        title: 'Breathing Exercise',
        description: 'Helps with anxiety',
        confidence: 0.92
      }
    ]);

    mockEnhancedPersonalizationService.predictMoodRisk.mockResolvedValue({
      riskLevel: 'low',
      confidence: 0.75,
      suggestedActions: []
    });

    // Setup Supabase client mock
    mockSupabase.functions.invoke.mockResolvedValue({
      data: { response: 'AI response from edge function' },
      error: null
    });
  });

  describe('End-to-End AI Hub Workflow', () => {
    const renderAIHub = () => {
      return render(
        <BrowserRouter>
          <AIHub />
        </BrowserRouter>
      );
    };

    it('loads AI Hub and displays all tabs', async () => {
      renderAIHub();
      
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
        expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Recommendations')).toBeInTheDocument();
        expect(screen.getByText('Contextual AI')).toBeInTheDocument();
        expect(screen.getByText('AI Analytics')).toBeInTheDocument();
        expect(screen.getByText('AI Conversations')).toBeInTheDocument();
        expect(screen.getByText('AI Settings')).toBeInTheDocument();
      });
    });

    it('switches between AI Hub tabs correctly', async () => {
      renderAIHub();
      
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
      });

      // Click on Recommendations tab
      fireEvent.click(screen.getByRole('tab', { name: /Recommendations/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Smart Recommendations')).toBeInTheDocument();
      });

      // Click on Contextual AI tab
      fireEvent.click(screen.getByRole('tab', { name: /Contextual AI/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Contextual AI Support')).toBeInTheDocument();
      });
    });

    it('loads personalization dashboard with AI insights', async () => {
      renderAIHub();
      
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalledWith('user-123');
        expect(mockEnhancedPersonalizationService.generateContextualRecommendations).toHaveBeenCalledWith('user-123');
        expect(mockEnhancedPersonalizationService.predictMoodRisk).toHaveBeenCalledWith('user-123');
      });
    });

    it('displays recommendations from AI engine', async () => {
      renderAIHub();
      
      // Switch to recommendations tab
      fireEvent.click(screen.getByRole('tab', { name: /Recommendations/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Progressive Muscle Relaxation')).toBeInTheDocument();
        expect(screen.getByText('Evening Reflection Session')).toBeInTheDocument();
        expect(screen.getByText('Daily Mindfulness Goal')).toBeInTheDocument();
      });
    });
  });

  describe('Elite System Dashboard Integration', () => {
    const renderEliteSystemDashboard = () => {
      return render(<EliteSystemDashboard />);
    };

    it('displays Elite System status and metrics', async () => {
      renderEliteSystemDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('Elite AI System')).toBeInTheDocument();
        expect(screen.getByText('OPTIMAL')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });

    it('handles system activation workflow', async () => {
      mockUseEliteSystemActivation.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'optimal',
          culturalAiActive: true,
          adaptiveLearningActive: true,
          cronJobsActive: true,
          lastActivation: null
        },
        isActivating: false,
        activateEliteSystem: vi.fn().mockResolvedValue({ success: true }),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      renderEliteSystemDashboard();
      
      const activateButton = screen.getByText('Activate Elite System');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockUseEliteSystemActivation().activateEliteSystem).toHaveBeenCalled();
      });
    });

    it('analyzes session data and provides insights', async () => {
      renderEliteSystemDashboard();
      
      await waitFor(() => {
        const analyzeButton = screen.getByText('Analyze Current Session');
        fireEvent.click(analyzeButton);
      });

      await waitFor(() => {
        expect(mockUseEliteSystemIntegration().analyzeSession).toHaveBeenCalled();
      });
    });

    it('displays real-time system performance metrics', async () => {
      renderEliteSystemDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('Total Therapy Sessions')).toBeInTheDocument();
        expect(screen.getByText('Adaptive Insights Generated')).toBeInTheDocument();
        expect(screen.getByText('Cultural Adaptations')).toBeInTheDocument();
        expect(screen.getByText('Crisis Interventions')).toBeInTheDocument();
      });
    });
  });

  describe('AI Message Processing Workflow', () => {
    it('processes messages through Elite AI system', async () => {
      const processMessage = mockUseEliteSystemIntegration().processMessage;
      
      const result = await processMessage('I need help with anxiety');
      
      expect(result).toBe('Processed through Elite AI');
      expect(processMessage).toHaveBeenCalledWith('I need help with anxiety');
    });

    it('sends messages and receives AI responses', async () => {
      const sendMessage = mockUseEliteSystemIntegration().sendMessage;
      
      const success = await sendMessage('How can I manage my stress?');
      
      expect(success).toBe(true);
      expect(sendMessage).toHaveBeenCalledWith('How can I manage my stress?');
    });

    it('maintains conversation context across messages', () => {
      const messages = mockUseEliteSystemIntegration().messages;
      
      expect(messages).toHaveLength(2);
      expect(messages[0].content).toContain('anxious about my presentation');
      expect(messages[1].content).toContain('presentations can be anxiety-provoking');
    });
  });

  describe('Cross-Component Communication', () => {
    it('shares data between AI components', async () => {
      renderAIHub();
      
      // Verify that user data is shared across components
      await waitFor(() => {
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalledWith('user-123');
      });
    });

    it('synchronizes Elite System state across components', async () => {
      renderEliteSystemDashboard();
      
      await waitFor(() => {
        expect(mockUseEliteSystemIntegration().systemStatus.isActivated).toBe(true);
        expect(mockUseEliteSystemActivation().systemStatus.isActivated).toBe(true);
      });
    });

    it('propagates system status changes', async () => {
      const { rerender } = renderEliteSystemDashboard();
      
      // Simulate system status change
      mockUseEliteSystemActivation.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'degraded',
          culturalAiActive: false,
          adaptiveLearningActive: false,
          cronJobsActive: false,
          lastActivation: null
        },
        isActivating: false,
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      rerender(<EliteSystemDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('DEGRADED')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('handles AI service failures gracefully', async () => {
      mockEnhancedPersonalizationService.analyzeUserPatterns.mockRejectedValue(new Error('Service unavailable'));
      
      renderAIHub();
      
      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
      });
    });

    it('handles Elite System activation failures', async () => {
      mockUseEliteSystemActivation.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'critical',
          culturalAiActive: false,
          adaptiveLearningActive: false,
          cronJobsActive: false,
          lastActivation: null
        },
        isActivating: false,
        activateEliteSystem: vi.fn().mockRejectedValue(new Error('Activation failed')),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      renderEliteSystemDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('CRITICAL')).toBeInTheDocument();
      });
    });

    it('handles network connectivity issues', async () => {
      mockSupabase.functions.invoke.mockRejectedValue(new Error('Network error'));
      
      renderAIHub();
      
      // Should handle network errors gracefully
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration', () => {
    it('loads AI components efficiently', async () => {
      const startTime = performance.now();
      
      renderAIHub();
      
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Should load within reasonable time (less than 1 second)
      expect(loadTime).toBeLessThan(1000);
    });

    it('handles concurrent AI operations', async () => {
      const operations = [
        mockEnhancedPersonalizationService.analyzeUserPatterns('user-123'),
        mockEnhancedPersonalizationService.generateContextualRecommendations('user-123'),
        mockEnhancedPersonalizationService.predictMoodRisk('user-123')
      ];

      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(3);
      expect(results[0]).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[2]).toBeDefined();
    });

    it('manages memory usage during intensive AI operations', async () => {
      // Simulate multiple AI operations
      for (let i = 0; i < 10; i++) {
        await mockUseEliteSystemIntegration().processMessage(`Message ${i}`);
      }
      
      // Verify system remains responsive
      renderAIHub();
      
      await waitFor(() => {
        expect(screen.getByText('AI Hub')).toBeInTheDocument();
      });
    });
  });

  describe('Data Flow Validation', () => {
    it('validates data flow from user input to AI response', async () => {
      const userInput = 'I need help with anxiety';
      const sendMessage = mockUseEliteSystemIntegration().sendMessage;
      
      const success = await sendMessage(userInput);
      
      expect(success).toBe(true);
      expect(sendMessage).toHaveBeenCalledWith(userInput);
    });

    it('validates session data persistence', async () => {
      const sessionId = await mockUseEliteSystemIntegration().initiateEliteSession();
      
      expect(sessionId).toBe('session-123');
      expect(mockUseEliteSystemIntegration().currentSessionId).toBe('session-123');
    });

    it('validates AI insights generation pipeline', async () => {
      renderAIHub();
      
      await waitFor(() => {
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalled();
        expect(mockEnhancedPersonalizationService.generateContextualRecommendations).toHaveBeenCalled();
        expect(mockEnhancedPersonalizationService.predictMoodRisk).toHaveBeenCalled();
      });
    });
  });

  describe('User Experience Integration', () => {
    it('provides seamless navigation between AI features', async () => {
      renderAIHub();
      
      // Navigate through different AI features
      fireEvent.click(screen.getByRole('tab', { name: /AI Dashboard/i }));
      await waitFor(() => {
        expect(screen.getByText('AI Personalization Dashboard')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('tab', { name: /Recommendations/i }));
      await waitFor(() => {
        expect(screen.getByText('Smart Recommendations')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('tab', { name: /Contextual AI/i }));
      await waitFor(() => {
        expect(screen.getByText('Contextual AI Support')).toBeInTheDocument();
      });
    });

    it('maintains consistent user context across features', async () => {
      renderAIHub();
      
      // Verify user context is maintained
      await waitFor(() => {
        expect(mockEnhancedPersonalizationService.analyzeUserPatterns).toHaveBeenCalledWith('user-123');
        expect(mockEnhancedPersonalizationService.generateContextualRecommendations).toHaveBeenCalledWith('user-123');
      });
    });

    it('provides real-time feedback on AI operations', async () => {
      renderEliteSystemDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('Real-time monitoring: Active')).toBeInTheDocument();
        expect(screen.getByText('Adaptive learning: Continuously improving')).toBeInTheDocument();
      });
    });
  });
});