import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EliteSystemDashboard } from '../../components/elite-ai-hub/EliteSystemDashboard';
import { BulletproofAuthContext } from '../../contexts/BulletproofAuthContext';
import { useEliteSystemIntegration } from '../../hooks/useEliteSystemIntegration';
import { useRealTimeEliteIntegration } from '../../hooks/useRealTimeEliteIntegration';

// Mock the hooks
vi.mock('../../hooks/useEliteSystemIntegration');
vi.mock('../../hooks/useRealTimeEliteIntegration');

const mockUseEliteSystemIntegration = vi.mocked(useEliteSystemIntegration);
const mockUseRealTimeEliteIntegration = vi.mocked(useRealTimeEliteIntegration);

describe('EliteSystemDashboard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2023-01-01T00:00:00.000Z'
  };

  const mockAuthContext = {
    user: mockUser,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    signUp: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock default successful responses
    mockUseEliteSystemIntegration.mockReturnValue({
      systemStatus: {
        isActivated: false,
        systemHealth: 'optimal',
        culturalAiActive: true,
        adaptiveLearningActive: true,
        cronJobsActive: true,
        lastActivation: null
      },
      isActivating: false,
      activateEliteSystem: vi.fn(),
      deactivateEliteSystem: vi.fn(),
      checkSystemStatus: vi.fn(),
      getSystemMetrics: vi.fn()
    });

    mockUseRealTimeEliteIntegration.mockReturnValue({
      initializeRealTimeMonitoring: vi.fn().mockResolvedValue(vi.fn()),
      getEliteSystemStatus: vi.fn().mockResolvedValue({
        isActive: true,
        lastRouting: null,
        adaptiveLearningActive: true,
        systemHealth: 'optimal'
      }),
      handleSessionEnd: vi.fn()
    });
  });

  describe('System Status Display', () => {
    it('renders system status correctly when activated', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText('OPTIMAL')).toBeInTheDocument();
    });

    it('renders system status as degraded when health is poor', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText('DEGRADED')).toBeInTheDocument();
    });

    it('displays activation button when system is not activated', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'optimal',
          culturalAiActive: true,
          adaptiveLearningActive: true,
          cronJobsActive: true,
          lastActivation: null
        },
        isActivating: false,
        activateEliteSystem: vi.fn(),
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByRole('button', { name: /activate/i })).toBeInTheDocument();
    });

    it('shows loading state during activation', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText(/activating/i)).toBeInTheDocument();
    });

    it('displays active status when system is activated', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    });
  });

  describe('System Metrics', () => {
    it('displays system metrics correctly', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText('Cultural AI')).toBeInTheDocument();
      expect(screen.getByText('Adaptive Learning')).toBeInTheDocument();
      expect(screen.getByText('Cron Jobs')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles activation errors gracefully', async () => {
      const mockActivateEliteSystem = vi.fn().mockRejectedValue(new Error('Activation failed'));

      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      const activateButton = screen.getByRole('button', { name: /activate/i });
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockActivateEliteSystem).toHaveBeenCalled();
      });
    });

    it('handles unauthenticated users gracefully', () => {
      const unauthenticatedContext = {
        user: null,
        loading: false,
        signIn: vi.fn(),
        signOut: vi.fn(),
        signUp: vi.fn(),
        register: vi.fn(),
        login: vi.fn(),
        logout: vi.fn()
      };

      render(
        <BulletproofAuthContext.Provider value={unauthenticatedContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText(/authentication required/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls activateEliteSystem when activate button is clicked', async () => {
      const mockActivateEliteSystem = vi.fn().mockResolvedValue(undefined);

      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      const activateButton = screen.getByRole('button', { name: /activate/i });
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockActivateEliteSystem).toHaveBeenCalled();
      });
    });

    it('refreshes status when refresh button is clicked', async () => {
      const mockCheckSystemStatus = vi.fn().mockResolvedValue(undefined);

      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: mockCheckSystemStatus,
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(mockCheckSystemStatus).toHaveBeenCalled();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('initializes real-time monitoring on mount', () => {
      const mockInitializeRealTimeMonitoring = vi.fn();

      mockUseRealTimeEliteIntegration.mockReturnValue({
        initializeRealTimeMonitoring: mockInitializeRealTimeMonitoring,
        getEliteSystemStatus: vi.fn().mockResolvedValue({
          isActive: true,
          lastRouting: null,
          adaptiveLearningActive: true,
          systemHealth: 'optimal'
        }),
        handleSessionEnd: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(mockInitializeRealTimeMonitoring).toHaveBeenCalled();
    });

    it('cleans up on unmount', () => {
      const mockCleanup = vi.fn();
      
      mockUseRealTimeEliteIntegration.mockReturnValue({
        initializeRealTimeMonitoring: vi.fn().mockResolvedValue(mockCleanup),
        getEliteSystemStatus: vi.fn().mockResolvedValue({
          isActive: true,
          lastRouting: null,
          adaptiveLearningActive: true,
          systemHealth: 'optimal'
        }),
        handleSessionEnd: vi.fn()
      });

      const { unmount } = render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      unmount();
      
      // The cleanup function should be called on unmount
      expect(mockCleanup).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for system status', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByLabelText(/system status/i)).toBeInTheDocument();
    });

    it('has proper button labeling for activation', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
        systemStatus: {
          isActivated: false,
          systemHealth: 'optimal',
          culturalAiActive: true,
          adaptiveLearningActive: true,
          cronJobsActive: true,
          lastActivation: null
        },
        isActivating: false,
        activateEliteSystem: vi.fn(),
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      const activateButton = screen.getByRole('button', { name: /activate elite system/i });
      expect(activateButton).toBeInTheDocument();
    });

    it('provides proper loading state announcements', () => {
      mockUseEliteSystemIntegration.mockReturnValue({
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
        deactivateEliteSystem: vi.fn(),
        checkSystemStatus: vi.fn(),
        getSystemMetrics: vi.fn()
      });

      render(
        <BulletproofAuthContext.Provider value={mockAuthContext}>
          <EliteSystemDashboard />
        </BulletproofAuthContext.Provider>
      );
      
      expect(screen.getByText(/activating elite system/i)).toBeInTheDocument();
    });
  });
});