import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EliteSystemDashboard from '@/components/elite/EliteSystemDashboard';

// Mock all hooks
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

const mockUseAuth = vi.mocked(await import('@/hooks/useAuth')).useAuth;
const mockUseEliteSystemIntegration = vi.mocked(await import('@/hooks/useEliteSystemIntegration')).useEliteSystemIntegration;
const mockUseEliteSystemActivation = vi.mocked(await import('@/hooks/useEliteSystemActivation')).useEliteSystemActivation;
const mockUseRealTimeEliteIntegration = vi.mocked(await import('@/hooks/useRealTimeEliteIntegration')).useRealTimeEliteIntegration;

describe('EliteSystemDashboard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock returns
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    mockUseEliteSystemIntegration.mockReturnValue({
      messages: [],
      systemStatus: { isActivated: false },
      processMessage: vi.fn(),
      analyzeSession: vi.fn().mockResolvedValue({ insights: [] }),
      sendMessage: vi.fn(),
      playMessage: vi.fn(),
      stopPlayback: vi.fn(),
      loadPreferences: vi.fn(),
      initiateEliteSession: vi.fn(),
      isLoading: false,
      isPlaying: false,
      userPreferences: null,
      currentSessionId: null,
      activateEliteSystem: vi.fn(),
      getEliteSystemStatus: vi.fn()
    });

    mockUseEliteSystemActivation.mockReturnValue({
      systemStatus: {
        isActivated: false,
        systemHealth: 'optimal',
        culturalAiActive: true,
        adaptiveLearningActive: true,
        cronJobsActive: true,
        lastActivation: new Date().toISOString()
      },
      isActivating: false,
      activateEliteSystem: vi.fn(),
      checkSystemStatus: vi.fn(),
      getSystemMetrics: vi.fn()
    });

    mockUseRealTimeEliteIntegration.mockReturnValue({
      isConnected: true,
      metrics: {}
    });
  });

  describe('Authentication and Loading States', () => {
    it('renders loading state when user is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
      });

      render(<EliteSystemDashboard />);
      expect(screen.getByText('Loading Elite System...')).toBeInTheDocument();
    });

    it('renders sign-in prompt when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn()
      });

      render(<EliteSystemDashboard />);
      expect(screen.getByText('Please sign in to access Elite System Dashboard')).toBeInTheDocument();
    });
  });

  describe('System Status Display', () => {
    it('displays system status correctly when activated', () => {
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      expect(screen.getByText('OPTIMAL')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('displays system status correctly when not activated', () => {
      render(<EliteSystemDashboard />);
      
      expect(screen.getByText('OPTIMAL')).toBeInTheDocument();
      expect(screen.getByText('Activate Elite System')).toBeInTheDocument();
    });

    it('shows different health status colors', () => {
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

      render(<EliteSystemDashboard />);
      expect(screen.getByText('DEGRADED')).toBeInTheDocument();
    });
  });

  describe('System Activation', () => {
    it('handles system activation successfully', async () => {
      const mockActivateEliteSystem = vi.fn().mockResolvedValue({ success: true });
      
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
        activateEliteSystem: mockActivateEliteSystem,
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const activateButton = screen.getByText('Activate Elite System');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockActivateEliteSystem).toHaveBeenCalled();
      });
    });

    it('shows loading state during activation', () => {
      mockUseEliteSystemActivation.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'optimal',
          culturalAiActive: true,
          adaptiveLearningActive: true,
          cronJobsActive: true,
          lastActivation: null
        },
        isActivating: true,
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      expect(screen.getByText('Activating...')).toBeInTheDocument();
    });

    it('disables activation button when already activated', () => {
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      const activateButton = screen.getByRole('button', { name: /Active/i });
      expect(activateButton).toBeDisabled();
    });
  });

  describe('Dashboard Statistics', () => {
    it('displays dashboard statistics', async () => {
      render(<EliteSystemDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Therapy Sessions')).toBeInTheDocument();
        expect(screen.getByText('Adaptive Insights Generated')).toBeInTheDocument();
        expect(screen.getByText('Cultural Adaptations')).toBeInTheDocument();
        expect(screen.getByText('Crisis Interventions')).toBeInTheDocument();
      });
    });

    it('shows system activity information', () => {
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      expect(screen.getByText(/Last Elite System activation:/)).toBeInTheDocument();
      expect(screen.getByText('Real-time monitoring: Active')).toBeInTheDocument();
    });
  });

  describe('Quick Actions', () => {
    it('handles refresh system status action', async () => {
      const mockCheckSystemStatus = vi.fn().mockResolvedValue({ success: true });
      
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: mockCheckSystemStatus,
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const refreshButton = screen.getByText('Refresh System Status');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockCheckSystemStatus).toHaveBeenCalled();
      });
    });

    it('handles analyze session action', async () => {
      const mockAnalyzeSession = vi.fn().mockResolvedValue({ insights: ['test insight'] });
      
      mockUseEliteSystemIntegration.mockReturnValue({
        messages: [{ id: '1', content: 'test', isUser: true, timestamp: new Date() }],
        systemStatus: { isActivated: true },
        processMessage: vi.fn(),
        analyzeSession: mockAnalyzeSession,
        sendMessage: vi.fn(),
        playMessage: vi.fn(),
        stopPlayback: vi.fn(),
        loadPreferences: vi.fn(),
        initiateEliteSession: vi.fn(),
        isLoading: false,
        isPlaying: false,
        userPreferences: null,
        currentSessionId: null,
        activateEliteSystem: vi.fn(),
        getEliteSystemStatus: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const analyzeButton = screen.getByText('Analyze Current Session');
      fireEvent.click(analyzeButton);

      await waitFor(() => {
        expect(mockAnalyzeSession).toHaveBeenCalled();
      });
    });

    it('disables analyze session when no messages', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
        messages: [],
        systemStatus: { isActivated: true },
        processMessage: vi.fn(),
        analyzeSession: vi.fn(),
        sendMessage: vi.fn(),
        playMessage: vi.fn(),
        stopPlayback: vi.fn(),
        loadPreferences: vi.fn(),
        initiateEliteSession: vi.fn(),
        isLoading: false,
        isPlaying: false,
        userPreferences: null,
        currentSessionId: null,
        activateEliteSystem: vi.fn(),
        getEliteSystemStatus: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const analyzeButton = screen.getByText('Analyze Current Session');
      expect(analyzeButton).toBeDisabled();
    });
  });

  describe('System Alerts', () => {
    it('shows inactive system alert when not activated', () => {
      render(<EliteSystemDashboard />);
      
      expect(screen.getByText('Elite System Inactive')).toBeInTheDocument();
      expect(screen.getByText(/Activate Elite System for enhanced AI therapy/)).toBeInTheDocument();
    });

    it('shows active system status when activated', () => {
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      expect(screen.getByText('Elite System Active')).toBeInTheDocument();
      expect(screen.getByText(/All Elite AI features are operational/)).toBeInTheDocument();
    });
  });

  describe('System Architecture Display', () => {
    it('renders system architecture overview', () => {
      render(<EliteSystemDashboard />);
      
      expect(screen.getByText('Elite System Architecture')).toBeInTheDocument();
      expect(screen.getByText('Intelligent Router Hub')).toBeInTheDocument();
      expect(screen.getByText('Cultural AI Integration')).toBeInTheDocument();
      expect(screen.getByText('Adaptive Feedback Loop')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles activation errors gracefully', async () => {
      const mockActivateEliteSystem = vi.fn().mockRejectedValue(new Error('Activation failed'));
      
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
        activateEliteSystem: mockActivateEliteSystem,
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const activateButton = screen.getByText('Activate Elite System');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockActivateEliteSystem).toHaveBeenCalled();
      });
    });

    it('handles system status check errors', async () => {
      const mockCheckSystemStatus = vi.fn().mockRejectedValue(new Error('Status check failed'));
      
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
        activateEliteSystem: vi.fn(),
        checkSystemStatus: mockCheckSystemStatus,
        getSystemMetrics: vi.fn()
      });

      render(<EliteSystemDashboard />);
      
      const refreshButton = screen.getByText('Refresh System Status');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockCheckSystemStatus).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<EliteSystemDashboard />);
      
      expect(screen.getByRole('button', { name: /Activate Elite System/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Refresh System Status/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<EliteSystemDashboard />);
      
      const activateButton = screen.getByText('Activate Elite System');
      activateButton.focus();
      expect(document.activeElement).toBe(activateButton);
    });
  });
});