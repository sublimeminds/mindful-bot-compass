import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { webglManager } from '@/utils/webgl-manager';
import { create3DTestEnvironment, performanceTestUtils } from './setup-3d';

describe('WebGLManager', () => {
  let testEnv: ReturnType<typeof create3DTestEnvironment>;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    testEnv = create3DTestEnvironment();
    canvas = document.createElement('canvas') as HTMLCanvasElement;
  });

  afterEach(() => {
    webglManager.dispose();
    vi.clearAllMocks();
  });

  describe('WebGL Detection', () => {
    it('should detect WebGL capabilities', () => {
      const capabilities = webglManager.detectCapabilities();
      
      expect(capabilities).toBeDefined();
      expect(typeof capabilities.webgl).toBe('boolean');
      expect(typeof capabilities.webgl2).toBe('boolean');
      expect(Array.isArray(capabilities.extensions)).toBe(true);
      expect(typeof capabilities.maxTextureSize).toBe('number');
    });

    it('should cache capabilities after first detection', () => {
      const first = webglManager.detectCapabilities();
      const second = webglManager.detectCapabilities();
      
      expect(first).toBe(second); // Should be the same object reference
    });

    it('should handle WebGL unavailable scenario', () => {
      // Mock WebGL as unavailable
      canvas.getContext = vi.fn(() => null);
      
      const capabilities = webglManager.detectCapabilities();
      
      expect(capabilities.webgl).toBe(false);
      expect(capabilities.webgl2).toBe(false);
      expect(capabilities.maxTextureSize).toBe(0);
    });
  });

  describe('Context Creation', () => {
    it('should create WebGL context successfully', () => {
      const gl = webglManager.createContext(canvas);
      
      expect(gl).toBeTruthy();
      expect(typeof gl.getParameter).toBe('function');
    });

    it('should handle context creation failure gracefully', () => {
      canvas.getContext = vi.fn(() => {
        throw new Error('Context creation failed');
      });
      
      const gl = webglManager.createContext(canvas);
      
      expect(gl).toBeNull();
      
      const metrics = webglManager.getPerformanceMetrics();
      expect(metrics.creationFailures).toBeGreaterThan(0);
    });

    it('should apply custom context options', () => {
      const options = {
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance' as const
      };
      
      const getContextSpy = vi.spyOn(canvas, 'getContext');
      webglManager.createContext(canvas, options);
      
      expect(getContextSpy).toHaveBeenCalledWith('webgl2', expect.objectContaining(options));
    });

    it('should fallback from WebGL2 to WebGL', () => {
      const getContextSpy = vi.spyOn(canvas, 'getContext')
        .mockReturnValueOnce(null) // WebGL2 fails
        .mockReturnValueOnce(testEnv.mockWebGL); // WebGL succeeds
      
      const gl = webglManager.createContext(canvas);
      
      expect(gl).toBeTruthy();
      expect(getContextSpy).toHaveBeenCalledWith('webgl2', expect.any(Object));
      expect(getContextSpy).toHaveBeenCalledWith('webgl', expect.any(Object));
    });
  });

  describe('Context Loss and Restore', () => {
    it('should handle context loss events', () => {
      const gl = webglManager.createContext(canvas);
      expect(gl).toBeTruthy();
      
      let contextLostFired = false;
      canvas.addEventListener('webgl-context-lost', () => {
        contextLostFired = true;
      });
      
      // Simulate context loss
      const lossEvent = new Event('webglcontextlost');
      canvas.dispatchEvent(lossEvent);
      
      expect(contextLostFired).toBe(true);
      
      const metrics = webglManager.getPerformanceMetrics();
      expect(metrics.contextLosses).toBeGreaterThan(0);
    });

    it('should handle context restore events', () => {
      const gl = webglManager.createContext(canvas);
      expect(gl).toBeTruthy();
      
      let contextRestoredFired = false;
      canvas.addEventListener('webgl-context-restored', () => {
        contextRestoredFired = true;
      });
      
      // Simulate context restore
      const restoreEvent = new Event('webglcontextrestored');
      canvas.dispatchEvent(restoreEvent);
      
      expect(contextRestoredFired).toBe(true);
      
      const metrics = webglManager.getPerformanceMetrics();
      expect(metrics.contextRestores).toBeGreaterThan(0);
    });

    it('should recreate context after loss', () => {
      const gl = webglManager.createContext(canvas);
      expect(gl).toBeTruthy();
      
      // Simulate context loss
      webglManager.loseContext(canvas);
      
      // Get context should return a new one
      const newGl = webglManager.getContext(canvas);
      expect(newGl).toBeTruthy();
    });
  });

  describe('Context Management', () => {
    it('should track multiple contexts', () => {
      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      
      const gl1 = webglManager.createContext(canvas1);
      const gl2 = webglManager.createContext(canvas2);
      
      expect(gl1).toBeTruthy();
      expect(gl2).toBeTruthy();
      expect(gl1).not.toBe(gl2);
    });

    it('should clean up contexts properly', () => {
      const gl = webglManager.createContext(canvas);
      expect(gl).toBeTruthy();
      
      webglManager.cleanupContext(canvas);
      
      // Context should be removed
      const retrievedGl = webglManager.getContext(canvas);
      expect(retrievedGl).toBeTruthy(); // Should create a new one
      expect(retrievedGl).not.toBe(gl); // Should be different from original
    });

    it('should dispose all contexts', () => {
      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      
      webglManager.createContext(canvas1);
      webglManager.createContext(canvas2);
      
      webglManager.dispose();
      
      // Should be able to create new contexts after dispose
      const newGl = webglManager.createContext(canvas1);
      expect(newGl).toBeTruthy();
    });
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics', () => {
      webglManager.createContext(canvas);
      
      const metrics = webglManager.getPerformanceMetrics();
      
      expect(typeof metrics.contextLosses).toBe('number');
      expect(typeof metrics.contextRestores).toBe('number');
      expect(typeof metrics.creationFailures).toBe('number');
      expect(typeof metrics.averageCreationTime).toBe('number');
    });

    it('should update average creation time', () => {
      const start = performance.now();
      webglManager.createContext(canvas);
      const end = performance.now();
      
      const metrics = webglManager.getPerformanceMetrics();
      expect(metrics.averageCreationTime).toBeGreaterThan(0);
      expect(metrics.averageCreationTime).toBeLessThan(end - start + 100); // Allow some margin
    });

    it('should monitor memory usage', () => {
      webglManager.createContext(canvas);
      
      const memory = webglManager.monitorMemoryUsage();
      
      expect(typeof memory.webglContexts).toBe('number');
      expect(memory.webglContexts).toBeGreaterThan(0);
    });
  });

  describe('Quality Settings', () => {
    it('should provide recommended settings', () => {
      const settings = webglManager.getRecommendedSettings();
      
      expect(settings).toBeDefined();
      expect(typeof settings.antialias).toBe('boolean');
      expect(['low', 'medium', 'high'].includes(settings.shadowQuality)).toBe(true);
      expect(['low', 'medium', 'high'].includes(settings.textureQuality)).toBe(true);
      expect(typeof settings.particleCount).toBe('number');
      expect(typeof settings.animationFPS).toBe('number');
    });

    it('should adjust settings based on capabilities', () => {
      // Mock low-end device
      vi.spyOn(webglManager, 'detectCapabilities').mockReturnValue({
        webgl: true,
        webgl2: false,
        extensions: [],
        maxTextureSize: 512,
        maxVertexAttributes: 8,
        vendor: 'test',
        renderer: 'test'
      });
      
      const settings = webglManager.getRecommendedSettings();
      
      expect(settings.shadowQuality).toBe('low');
      expect(settings.particleCount).toBeLessThan(100);
    });
  });

  describe('WebGL Viability', () => {
    it('should determine WebGL viability correctly', () => {
      const isViable = webglManager.isWebGLViable();
      expect(typeof isViable).toBe('boolean');
    });

    it('should consider WebGL non-viable with too many failures', () => {
      // Force multiple failures
      for (let i = 0; i < 5; i++) {
        const failCanvas = document.createElement('canvas');
        failCanvas.getContext = vi.fn(() => {
          throw new Error('Forced failure');
        });
        webglManager.createContext(failCanvas);
      }
      
      const isViable = webglManager.isWebGLViable();
      expect(isViable).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle null canvas gracefully', () => {
      expect(() => {
        webglManager.createContext(null as any);
      }).not.toThrow();
    });

    it('should handle cleanup of non-existent contexts', () => {
      expect(() => {
        webglManager.cleanupContext(canvas);
      }).not.toThrow();
    });

    it('should handle getContext on invalid canvas', () => {
      const invalidCanvas = {} as HTMLCanvasElement;
      
      expect(() => {
        webglManager.getContext(invalidCanvas);
      }).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    it('should remove event listeners on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(canvas, 'removeEventListener');
      
      webglManager.createContext(canvas);
      webglManager.cleanupContext(canvas);
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('webglcontextlost', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('webglcontextrestored', expect.any(Function));
    });

    it('should prevent default on context loss events', () => {
      webglManager.createContext(canvas);
      
      const event = new Event('webglcontextlost');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      canvas.dispatchEvent(event);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});