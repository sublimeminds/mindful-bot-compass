import React, { Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import SimpleAvatarFallback from './SimpleAvatarFallback';

interface Canvas3DWrapperProps {
  children: ReactNode;
  therapistId: string;
  therapistName: string;
  canvasProps?: any;
}

interface Canvas3DWrapperState {
  hasError: boolean;
  error: Error | null;
}

export class Canvas3DWrapper extends Component<Canvas3DWrapperProps, Canvas3DWrapperState> {
  constructor(props: Canvas3DWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<Canvas3DWrapperState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 Canvas3DWrapper: Canvas error boundary caught:', error);
    console.error('🔥 Canvas3DWrapper: Error info:', errorInfo);
  }

  render() {
    const { children, therapistId, therapistName, canvasProps } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      console.log('🔄 Canvas3DWrapper: Falling back to 2D due to Canvas error');
      return (
        <SimpleAvatarFallback 
          name={therapistName}
          therapistId={therapistId}
          className="w-full h-full"
          showName={false}
        />
      );
    }

    return (
      <Canvas {...canvasProps}>
        {children}
      </Canvas>
    );
  }
}

export default Canvas3DWrapper;