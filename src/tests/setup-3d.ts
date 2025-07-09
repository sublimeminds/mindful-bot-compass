// 3D Testing Setup and Mocks
import { vi } from 'vitest';

// Mock WebGL context for testing
export const mockWebGLContext = {
  getExtension: vi.fn(),
  createShader: vi.fn(),
  createProgram: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  useProgram: vi.fn(),
  createBuffer: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  getAttribLocation: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  drawArrays: vi.fn(),
  clear: vi.fn(),
  clearColor: vi.fn(),
  enable: vi.fn(),
  depthFunc: vi.fn(),
  clearDepth: vi.fn(),
  viewport: vi.fn(),
};

// Mock Canvas for WebGL context
export const mockCanvas = {
  getContext: vi.fn((type: string) => {
    if (type === 'webgl' || type === 'experimental-webgl') {
      return mockWebGLContext;
    }
    return null;
  }),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  width: 800,
  height: 600,
};

// Mock Three.js components
export const mockThreeJS = {
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
  })),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: mockCanvas,
  })),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn() },
    rotation: { set: vi.fn() },
  })),
};

// Mock Audio Context for voice testing
export const mockAudioContext = {
  createAnalyser: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    getFloatFrequencyData: vi.fn(),
    getFloatTimeDomainData: vi.fn(),
    fftSize: 2048,
    frequencyBinCount: 1024,
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 1 },
  })),
  destination: {},
  sampleRate: 44100,
  currentTime: 0,
  state: 'running',
  resume: vi.fn(),
  suspend: vi.fn(),
  close: vi.fn(),
};

// Mock getUserMedia for voice testing
export const mockGetUserMedia = vi.fn(() =>
  Promise.resolve({
    getTracks: vi.fn(() => []),
    getAudioTracks: vi.fn(() => []),
    getVideoTracks: vi.fn(() => []),
  })
);

// Setup global mocks
export const setupGlobalMocks = () => {
  // Mock document methods
  Object.defineProperty(document, 'createElement', {
    value: vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }
      return {};
    }),
  });

  // Mock WebGL context creation
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: mockCanvas.getContext,
  });

  // Mock navigator.mediaDevices
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: mockGetUserMedia,
    },
  });

  // Mock window.AudioContext
  (global as any).AudioContext = vi.fn(() => mockAudioContext);
  (global as any).webkitAudioContext = vi.fn(() => mockAudioContext);

  // Mock performance.now
  Object.defineProperty(window, 'performance', {
    value: {
      now: vi.fn(() => Date.now()),
    },
  });

  // Mock requestAnimationFrame
  Object.defineProperty(window, 'requestAnimationFrame', {
    value: vi.fn((callback: FrameRequestCallback) => {
      setTimeout(callback, 16);
      return 1;
    }),
  });

  // Mock cancelAnimationFrame
  Object.defineProperty(window, 'cancelAnimationFrame', {
    value: vi.fn(),
  });
};

// Test utilities for 3D components
export const create3DTestEnvironment = () => {
  setupGlobalMocks();
  
  return {
    mockWebGL: mockWebGLContext,
    mockCanvas,
    mockAudio: mockAudioContext,
    mockMedia: mockGetUserMedia,
  };
};

// Emotion test data
export const emotionTestData = {
  happy: [
    "I'm feeling great today!",
    "This is wonderful news!",
    "I'm so excited about this!",
    "Joy fills my heart",
    "Amazing progress!"
  ],
  sad: [
    "I feel so down today",
    "Everything seems hopeless",
    "I'm feeling depressed",
    "Life feels empty",
    "I'm so lonely"
  ],
  anxious: [
    "I'm really worried about this",
    "This makes me so nervous",
    "I'm feeling anxious",
    "I'm scared about what might happen",
    "Panic is setting in"
  ],
  angry: [
    "This makes me so mad!",
    "I'm furious about this situation",
    "I feel irritated and frustrated",
    "This is making me angry",
    "I'm so mad I could scream"
  ],
  calm: [
    "I feel peaceful and relaxed",
    "Everything is serene",
    "I'm in a tranquil state",
    "Feeling calm and centered",
    "Perfect peace surrounds me"
  ],
  neutral: [
    "The weather is nice today",
    "I need to go to the store",
    "The meeting is at 3pm",
    "Please review this document",
    "What time should we meet?"
  ]
};

// Performance test utilities
export const performanceTestUtils = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    await renderFn();
    const end = performance.now();
    return end - start;
  },
  
  measureMemoryUsage: () => {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },
  
  simulateWebGLContextLoss: () => {
    const event = new Event('webglcontextlost');
    mockCanvas.dispatchEvent?.(event);
  },
  
  simulateWebGLContextRestore: () => {
    const event = new Event('webglcontextrestored');
    mockCanvas.dispatchEvent?.(event);
  }
};