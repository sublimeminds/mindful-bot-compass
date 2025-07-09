import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// WebGL context mock
export const mockWebGLContext = () => {
  const mockContext = {
    canvas: document.createElement('canvas'),
    getExtension: () => null,
    getParameter: () => null,
    createShader: () => null,
    shaderSource: () => {},
    compileShader: () => {},
    createProgram: () => null,
    attachShader: () => {},
    linkProgram: () => {},
    useProgram: () => {},
    createBuffer: () => null,
    bindBuffer: () => {},
    bufferData: () => {},
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    drawArrays: () => {},
    clearColor: () => {},
    clear: () => {},
    enable: () => {},
    depthFunc: () => {},
    viewport: () => {},
  };

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: (contextType: string) => {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return mockContext;
      }
      return null;
    },
    writable: true,
  });

  return mockContext;
};

// Audio context mock
export const mockAudioContext = () => {
  const mockAudioContext = {
    createOscillator: () => ({}),
    createGain: () => ({}),
    createAnalyser: () => ({}),
    createBufferSource: () => ({}),
    decodeAudioData: () => Promise.resolve({}),
    resume: () => Promise.resolve(),
    suspend: () => Promise.resolve(),
    close: () => Promise.resolve(),
    destination: {},
    currentTime: 0,
    state: 'running',
  };

  (global as any).AudioContext = function() { return mockAudioContext; };
  (global as any).webkitAudioContext = function() { return mockAudioContext; };

  return mockAudioContext;
};

// Performance measurement utility
export const measurePerformance = async (fn: () => Promise<void> | void, name: string) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  const duration = end - start;
  
  console.log(`${name} took ${duration.toFixed(2)}ms`);
  return duration;
};

// Intersection Observer mock
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  (global as any).IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

// Resize Observer mock
export const mockResizeObserver = () => {
  const mockResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  (global as any).ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Device pixel ratio mock
export const mockDevicePixelRatio = (ratio: number = 2) => {
  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: ratio,
  });
};