import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

interface ComponentLoadState {
  component: string;
  status: 'waiting' | 'loading' | 'ready' | 'error';
  error?: string;
  loadTime?: number;
  retryCount: number;
}

interface StagedComponentLoaderProps {
  components: Array<{
    name: string;
    loader: () => Promise<React.ComponentType<any>>;
    fallback?: React.ComponentType<any>;
    dependencies?: string[];
  }>;
  onStageComplete?: (stage: number, component: string) => void;
  onAllReady?: () => void;
  onError?: (error: string, component: string) => void;
}

interface StagedComponentLoaderState {
  currentStage: number;
  componentStates: ComponentLoadState[];
  allReady: boolean;
  criticalError?: string;
}

class StagedComponentLoader extends React.Component<StagedComponentLoaderProps, StagedComponentLoaderState> {
  private loadedComponents: Map<string, React.ComponentType<any>> = new Map();
  private loadStartTimes: Map<string, number> = new Map();

  constructor(props: StagedComponentLoaderProps) {
    super(props);
    
    this.state = {
      currentStage: 0,
      componentStates: props.components.map(comp => ({
        component: comp.name,
        status: 'waiting',
        retryCount: 0
      })),
      allReady: false
    };
  }

  componentDidMount() {
    console.log('StagedComponentLoader: Starting staged component loading...');
    this.loadNextStage();
  }

  private loadNextStage = async () => {
    const { currentStage, componentStates } = this.state;
    
    if (currentStage >= this.props.components.length) {
      this.setState({ allReady: true });
      if (this.props.onAllReady) {
        this.props.onAllReady();
      }
      return;
    }

    const component = this.props.components[currentStage];
    
    console.log(`StagedComponentLoader: Loading stage ${currentStage + 1}: ${component.name}`);
    
    // Update component state to loading
    const newStates = [...componentStates];
    newStates[currentStage] = {
      ...newStates[currentStage],
      status: 'loading'
    };
    this.setState({ componentStates: newStates });

    try {
      // Check React health before loading
      const validation = reactHookValidator.validateReactContext();
      if (!validation.isValid) {
        throw new Error(`React validation failed: ${validation.error}`);
      }

      // Check dependencies
      if (component.dependencies) {
        for (const dep of component.dependencies) {
          if (!(window as any)[dep]) {
            throw new Error(`Dependency ${dep} not available for ${component.name}`);
          }
        }
      }

      const startTime = Date.now();
      this.loadStartTimes.set(component.name, startTime);

      // Load the component
      const LoadedComponent = await component.loader();
      const loadTime = Date.now() - startTime;

      this.loadedComponents.set(component.name, LoadedComponent);

      // Update state to ready
      const updatedStates = [...this.state.componentStates];
      updatedStates[currentStage] = {
        ...updatedStates[currentStage],
        status: 'ready',
        loadTime
      };
      
      this.setState({ 
        componentStates: updatedStates,
        currentStage: currentStage + 1
      });

      if (this.props.onStageComplete) {
        this.props.onStageComplete(currentStage, component.name);
      }

      console.log(`StagedComponentLoader: ${component.name} loaded successfully in ${loadTime}ms`);

      // Wait a bit for stability then load next stage
      setTimeout(() => {
        this.loadNextStage();
      }, 100);

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`StagedComponentLoader: Failed to load ${component.name}:`, errorMessage);

      const updatedStates = [...this.state.componentStates];
      const currentState = updatedStates[currentStage];
      
      if (currentState.retryCount < 3) {
        // Retry loading
        updatedStates[currentStage] = {
          ...currentState,
          retryCount: currentState.retryCount + 1,
          status: 'waiting'
        };
        
        this.setState({ componentStates: updatedStates });
        
        console.log(`StagedComponentLoader: Retrying ${component.name} (attempt ${currentState.retryCount + 1})`);
        
        setTimeout(() => {
          this.loadNextStage();
        }, 1000 * (currentState.retryCount + 1)); // Exponential backoff
        
      } else {
        // Use fallback or mark as error
        if (component.fallback) {
          console.log(`StagedComponentLoader: Using fallback for ${component.name}`);
          this.loadedComponents.set(component.name, component.fallback);
          
          updatedStates[currentStage] = {
            ...currentState,
            status: 'ready',
            error: `Using fallback: ${errorMessage}`
          };
          
          this.setState({ 
            componentStates: updatedStates,
            currentStage: currentStage + 1
          });
          
          setTimeout(() => {
            this.loadNextStage();
          }, 100);
          
        } else {
          updatedStates[currentStage] = {
            ...currentState,
            status: 'error',
            error: errorMessage
          };
          
          this.setState({ 
            componentStates: updatedStates,
            criticalError: `Critical component ${component.name} failed to load: ${errorMessage}`
          });
          
          if (this.props.onError) {
            this.props.onError(errorMessage, component.name);
          }
        }
      }
    }
  };

  public getLoadedComponent = (name: string): React.ComponentType<any> | undefined => {
    return this.loadedComponents.get(name);
  };

  public getComponentState = (name: string): ComponentLoadState | undefined => {
    return this.state.componentStates.find(state => state.component === name);
  };

  render() {
    const { componentStates, allReady, criticalError, currentStage } = this.state;

    if (criticalError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Critical Loading Error</h3>
              <p className="text-sm text-gray-600 mb-4">{criticalError}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {componentStates.map((state, index) => (
                <div key={state.component} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{state.component}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    state.status === 'ready' ? 'bg-green-100 text-green-800' :
                    state.status === 'error' ? 'bg-red-100 text-red-800' :
                    state.status === 'loading' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {state.status}
                  </span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    if (!allReady) {
      const progress = (currentStage / this.props.components.length) * 100;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center max-w-md w-full">
            <div className="relative mb-6">
              <div className="w-24 h-24 border-4 border-therapy-200 rounded-full animate-spin">
                <div className="w-6 h-6 bg-therapy-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold therapy-text-gradient mb-4">
              Loading Application
            </h2>
            
            <div className="w-full bg-therapy-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-therapy-600 mb-4">
              Stage {currentStage + 1} of {this.props.components.length}
            </p>
            
            <div className="space-y-2">
              {componentStates.map((state, index) => (
                <div key={state.component} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{state.component}</span>
                  <div className="flex items-center space-x-2">
                    {state.loadTime && (
                      <span className="text-xs text-gray-500">{state.loadTime}ms</span>
                    )}
                    <span className={`w-2 h-2 rounded-full ${
                      state.status === 'ready' ? 'bg-green-500' :
                      state.status === 'error' ? 'bg-red-500' :
                      state.status === 'loading' ? 'bg-blue-500 animate-pulse' :
                      'bg-gray-300'
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null; // All components loaded, parent can render normally
  }
}

export default StagedComponentLoader;