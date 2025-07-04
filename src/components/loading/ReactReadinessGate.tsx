import React from 'react';
import { reactHookValidator } from '@/utils/reactHookValidator';

interface LoadingGateState {
  isReady: boolean;
  error?: string;
  stage: 'initializing' | 'validating' | 'ready' | 'error';
  stageProgress: number;
}

interface LoadingGateProps {
  children: React.ReactNode;
  componentName: string;
  dependencies?: string[];
  onReady?: () => void;
  onError?: (error: string) => void;
}

class ReactReadinessGate extends React.Component<LoadingGateProps, LoadingGateState> {
  private checkInterval: NodeJS.Timeout | null = null;
  private maxRetries = 5;
  private retryCount = 0;

  constructor(props: LoadingGateProps) {
    super(props);
    this.state = {
      isReady: false,
      stage: 'initializing',
      stageProgress: 0
    };
  }

  componentDidMount() {
    console.log(`ReactReadinessGate: Starting readiness check for ${this.props.componentName}`);
    this.performReadinessCheck();
  }

  componentWillUnmount() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private performReadinessCheck = async () => {
    try {
      this.setState({ stage: 'validating', stageProgress: 20 });

      // Stage 1: React Core Validation
      const reactValidation = reactHookValidator.validateReactContext();
      if (!reactValidation.isValid) {
        throw new Error(`React validation failed: ${reactValidation.error}`);
      }

      this.setState({ stageProgress: 40 });

      // Stage 2: Component Dependencies Check
      if (this.props.dependencies) {
        for (const dep of this.props.dependencies) {
          if (!(window as any)[dep]) {
            throw new Error(`Dependency ${dep} not available`);
          }
        }
      }

      this.setState({ stageProgress: 60 });

      // Stage 3: DOM Readiness Check
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(true);
          } else {
            window.addEventListener('load', () => resolve(true), { once: true });
          }
        });
      }

      this.setState({ stageProgress: 80 });

      // Stage 4: React Dispatcher Stability Check
      await this.verifyDispatcherStability();

      this.setState({ 
        isReady: true, 
        stage: 'ready', 
        stageProgress: 100 
      });

      if (this.props.onReady) {
        this.props.onReady();
      }

      console.log(`ReactReadinessGate: ${this.props.componentName} is ready to render`);

    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(`ReactReadinessGate: Readiness check failed for ${this.props.componentName}:`, errorMessage);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`ReactReadinessGate: Retrying readiness check (${this.retryCount}/${this.maxRetries})`);
        
        setTimeout(() => {
          this.setState({ stage: 'initializing', stageProgress: 0 });
          this.performReadinessCheck();
        }, 1000 * this.retryCount); // Exponential backoff
        
      } else {
        this.setState({ 
          stage: 'error', 
          error: errorMessage,
          stageProgress: 0 
        });
        
        if (this.props.onError) {
          this.props.onError(errorMessage);
        }
      }
    }
  };

  private verifyDispatcherStability = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      let checkCount = 0;
      const maxChecks = 3;
      
      const stabilityCheck = () => {
        const validation = reactHookValidator.validateReactContext();
        checkCount++;
        
        if (validation.isValid) {
          if (checkCount >= maxChecks) {
            resolve();
          } else {
            setTimeout(stabilityCheck, 100);
          }
        } else {
          reject(new Error('React dispatcher unstable'));
        }
      };
      
      stabilityCheck();
    });
  };

  render() {
    const { isReady, stage, error, stageProgress } = this.state;

    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Loading Failed</h3>
            <p className="text-sm text-gray-600 mb-4">{this.props.componentName} failed to initialize</p>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                this.retryCount = 0;
                this.setState({ stage: 'initializing', error: undefined, stageProgress: 0 });
                this.performReadinessCheck();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      );
    }

    if (!isReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-therapy-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-therapy-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
            <h2 className="text-xl font-bold therapy-text-gradient mb-2">
              Initializing {this.props.componentName}
            </h2>
            <p className="text-therapy-600/70 mb-4">
              {stage === 'initializing' && 'Preparing component...'}
              {stage === 'validating' && 'Validating React context...'}
            </p>
            <div className="w-64 bg-therapy-200 rounded-full h-2 mx-auto">
              <div 
                className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stageProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-therapy-500 mt-2">{stageProgress}% complete</p>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ReactReadinessGate;