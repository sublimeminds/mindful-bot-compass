
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  stage: 'validation' | 'contexts' | 'application';
  onStageComplete?: () => void;
}

interface State {
  isStageReady: boolean;
  error?: Error;
}

// Helper component for staged loading of different app phases
export class StageLoadingProvider extends Component<Props, State> {
  private stageTimer?: NodeJS.Timeout;
  
  public state: State = {
    isStageReady: false
  };

  public componentDidMount() {
    this.initializeStage();
  }

  public componentWillUnmount() {
    if (this.stageTimer) {
      clearTimeout(this.stageTimer);
    }
  }

  private initializeStage = async () => {
    try {
      console.log(`StageLoadingProvider: Initializing ${this.props.stage} stage`);
      
      switch (this.props.stage) {
        case 'validation':
          // React validation already done by SimpleSafeReactProvider
          this.setState({ isStageReady: true });
          break;
          
        case 'contexts':
          // Small delay to ensure providers are ready
          this.stageTimer = setTimeout(() => {
            this.setState({ isStageReady: true });
          }, 100);
          break;
          
        case 'application':
          // Ensure DOM and all contexts are fully ready
          this.stageTimer = setTimeout(() => {
            this.setState({ isStageReady: true });
          }, 150);
          break;
          
        default:
          this.setState({ isStageReady: true });
      }
      
      if (this.props.onStageComplete) {
        this.props.onStageComplete();
      }
    } catch (error) {
      console.error(`StageLoadingProvider: ${this.props.stage} stage failed`, error);
      this.setState({ 
        isStageReady: false, 
        error: error as Error 
      });
    }
  };

  public render() {
    const { children, stage } = this.props;
    const { isStageReady, error } = this.state;

    if (error) {
      return React.createElement('div', {
        style: {
          padding: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#991b1b',
          textAlign: 'center'
        }
      }, [
        React.createElement('h3', { key: 'title' }, `${stage} Stage Failed`),
        React.createElement('p', { key: 'message' }, error.message),
        React.createElement('button', {
          key: 'retry',
          onClick: () => window.location.reload(),
          style: {
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }
        }, 'Reload')
      ]);
    }

    if (!isStageReady) {
      return React.createElement('div', {
        style: {
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280'
        }
      }, `Loading ${stage}...`);
    }

    return children;
  }
}

export default StageLoadingProvider;
