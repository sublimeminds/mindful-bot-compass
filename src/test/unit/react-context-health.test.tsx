import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../utils';
import { BrowserRouter } from 'react-router-dom';

// Test React context integrity at each loading stage
describe('React Context Health Checks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have React available and functional', () => {
    expect(React).toBeDefined();
    expect(typeof React.useState).toBe('function');
    expect(typeof React.useEffect).toBe('function');
    expect(typeof React.useContext).toBe('function');
    expect(typeof React.createElement).toBe('function');
  });

  it('should be able to create basic React components', () => {
    const TestComponent = () => <div data-testid="test">Test</div>;
    
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should be able to use React hooks', () => {
    const TestHookComponent = () => {
      const [state, setState] = React.useState('initial');
      React.useEffect(() => {
        setState('updated');
      }, []);
      
      return <div data-testid="hook-test">{state}</div>;
    };
    
    render(<TestHookComponent />);
    expect(screen.getByTestId('hook-test')).toHaveTextContent('updated');
  });

  it('should be able to use Router context', () => {
    const RouterTestComponent = () => {
      return <div data-testid="router-test">Router works</div>;
    };
    
    render(
      <BrowserRouter>
        <RouterTestComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('router-test')).toBeInTheDocument();
  });

  it('should handle multiple context providers without corruption', () => {
    const TestContext = React.createContext('test');
    const TestProvider = ({ children }: { children: React.ReactNode }) => (
      <TestContext.Provider value="test-value">
        {children}
      </TestContext.Provider>
    );
    
    const ContextConsumer = () => {
      const value = React.useContext(TestContext);
      return <div data-testid="context-test">{value}</div>;
    };
    
    render(
      <BrowserRouter>
        <TestProvider>
          <ContextConsumer />
        </TestProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('context-test')).toHaveTextContent('test-value');
  });
});