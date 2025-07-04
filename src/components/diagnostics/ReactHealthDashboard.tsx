import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

interface ReactHealthDashboardState {
  isOpen: boolean;
  currentTab: 'health' | 'diagnostics' | 'components' | 'performance';
  autoRefresh: boolean;
  refreshInterval: number;
  data: {
    health: any;
    diagnostics: any;
    components: Record<string, any>;
    performance: any;
  };
}

class ReactHealthDashboard extends React.Component<{}, ReactHealthDashboardState> {
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      isOpen: false,
      currentTab: 'health',
      autoRefresh: true,
      refreshInterval: 5000,
      data: {
        health: {},
        diagnostics: {},
        components: {},
        performance: {}
      }
    };
  }

  componentDidMount() {
    // Expose dashboard to window for easy access
    (window as any).reactHealthDashboard = {
      open: () => this.setState({ isOpen: true }),
      close: () => this.setState({ isOpen: false }),
      toggle: () => this.setState(prev => ({ isOpen: !prev.isOpen })),
      export: () => this.exportDiagnostics(),
      getState: () => this.state.data
    };

    // Add keyboard shortcut (Ctrl+Shift+D)
    document.addEventListener('keydown', this.handleKeyPress);

    if (this.state.autoRefresh) {
      this.startAutoRefresh();
    }

    this.refreshData();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  private handleKeyPress = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault();
      this.setState(prev => ({ isOpen: !prev.isOpen }));
    }
  };

  private startAutoRefresh = () => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    
    this.refreshTimer = setInterval(() => {
      if (this.state.isOpen && this.state.autoRefresh) {
        this.refreshData();
      }
    }, this.state.refreshInterval);
  };

  private refreshData = () => {
    try {
      const health = reactHookValidator.validateReactContext();
      const diagnostics = reactHookValidator.getDiagnostics();
      
      const components = this.gatherComponentData();
      const performance = this.gatherPerformanceData();

      this.setState({
        data: {
          health,
          diagnostics,
          components,
          performance
        }
      });
    } catch (error) {
      console.error('ReactHealthDashboard: Failed to refresh data:', error);
    }
  };

  private gatherComponentData = () => {
    const components: Record<string, any> = {};
    
    // Get component render counts from validator
    const diagnostics = reactHookValidator.getDiagnostics();
    if (diagnostics.componentRenderCount) {
      Object.entries(diagnostics.componentRenderCount).forEach(([name, count]) => {
        components[name] = {
          renderCount: count,
          lastRender: Date.now(),
          status: 'active'
        };
      });
    }

    return components;
  };

  private gatherPerformanceData = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      pageLoadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : 0,
      domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart) : 0,
      memoryUsage: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
      } : null,
      timestamp: Date.now()
    };
  };

  private exportDiagnostics = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      ...this.state.data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `react-health-diagnostics-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  private renderHealthTab = () => {
    const { health } = this.state.data;
    
    return (
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${health.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${health.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">React Context Status</span>
          </div>
          {!health.isValid && health.error && (
            <p className="text-sm text-red-600 mt-2">{health.error}</p>
          )}
        </div>

        {health.suggestions && health.suggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Suggestions</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {health.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  private renderDiagnosticsTab = () => {
    const { diagnostics } = this.state.data;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">React Available</div>
            <div className={`font-medium ${diagnostics.reactAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.reactAvailable ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Hooks Available</div>
            <div className={`font-medium ${diagnostics.hooksAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {diagnostics.hooksAvailable ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        {diagnostics.dispatcher && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Dispatcher Status</h4>
            <div className="text-sm space-y-1">
              <div>Available: {diagnostics.dispatcher.available ? '✅' : '❌'}</div>
              <div>Type: {diagnostics.dispatcher.type || 'unknown'}</div>
              <div>useState: {diagnostics.dispatcher.hasUseState ? '✅' : '❌'}</div>
              <div>useEffect: {diagnostics.dispatcher.hasUseEffect ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  private renderComponentsTab = () => {
    const { components } = this.state.data;
    
    return (
      <div className="space-y-2">
        {Object.entries(components).map(([name, data]: [string, any]) => (
          <div key={name} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-600">Renders: {data.renderCount}</div>
            </div>
            <div className={`w-2 h-2 rounded-full ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
        ))}
        {Object.keys(components).length === 0 && (
          <div className="text-center text-gray-500 py-8">No component data available</div>
        )}
      </div>
    );
  };

  private renderPerformanceTab = () => {
    const { performance } = this.state.data;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Page Load Time</div>
            <div className="font-medium">{performance.pageLoadTime || 0}ms</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">DOM Content Loaded</div>
            <div className="font-medium">{performance.domContentLoaded || 0}ms</div>
          </div>
        </div>

        {performance.memoryUsage && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Memory Usage</h4>
            <div className="text-sm space-y-1">
              <div>Used: {performance.memoryUsage.used}MB</div>
              <div>Total: {performance.memoryUsage.total}MB</div>
              <div>Limit: {performance.memoryUsage.limit}MB</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    if (!this.state.isOpen) {
      return (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => this.setState({ isOpen: true })}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Open React Health Dashboard (Ctrl+Shift+D)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">React Health Dashboard</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={this.refreshData}
                className="text-gray-600 hover:text-gray-800 p-1"
                title="Refresh"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={this.exportDiagnostics}
                className="text-gray-600 hover:text-gray-800 p-1"
                title="Export Diagnostics"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                onClick={() => this.setState({ isOpen: false })}
                className="text-gray-600 hover:text-gray-800 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex">
            <div className="w-48 bg-gray-50 border-r">
              {(['health', 'diagnostics', 'components', 'performance'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => this.setState({ currentTab: tab })}
                  className={`w-full text-left p-3 capitalize hover:bg-gray-100 ${
                    this.state.currentTab === tab ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : ''
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
              {this.state.currentTab === 'health' && this.renderHealthTab()}
              {this.state.currentTab === 'diagnostics' && this.renderDiagnosticsTab()}
              {this.state.currentTab === 'components' && this.renderComponentsTab()}
              {this.state.currentTab === 'performance' && this.renderPerformanceTab()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReactHealthDashboard;