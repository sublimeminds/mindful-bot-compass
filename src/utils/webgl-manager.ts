// WebGL Context Management and Error Recovery
export interface WebGLCapabilities {
  webgl: boolean;
  webgl2: boolean;
  extensions: string[];
  maxTextureSize: number;
  maxVertexAttributes: number;
  vendor: string;
  renderer: string;
}

export interface WebGLContextOptions {
  preserveDrawingBuffer?: boolean;
  antialias?: boolean;
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  failIfMajorPerformanceCaveat?: boolean;
  desynchronized?: boolean;
}

export class WebGLManager {
  private contexts = new Map<HTMLCanvasElement, WebGLRenderingContext | WebGL2RenderingContext>();
  private contextLossHandlers = new Map<HTMLCanvasElement, (event: Event) => void>();
  private contextRestoreHandlers = new Map<HTMLCanvasElement, (event: Event) => void>();
  private capabilities: WebGLCapabilities | null = null;
  private performanceMetrics = {
    contextLosses: 0,
    contextRestores: 0,
    creationFailures: 0,
    lastLossTime: 0,
    averageCreationTime: 0
  };
  
  // Single-context strategy to prevent exhaustion
  private activeContexts = 0;
  private maxActiveContexts = 1; // Only allow one 3D avatar at a time
  private contextQueue: Array<{ canvas: HTMLCanvasElement; resolve: (gl: WebGLRenderingContext | WebGL2RenderingContext | null) => void }> = [];

  // Detect WebGL capabilities
  detectCapabilities(): WebGLCapabilities {
    if (this.capabilities) return this.capabilities;

    const canvas = document.createElement('canvas');
    const webgl = this.createContext(canvas, { failIfMajorPerformanceCaveat: true });
    
    if (!webgl) {
      this.capabilities = {
        webgl: false,
        webgl2: false,
        extensions: [],
        maxTextureSize: 0,
        maxVertexAttributes: 0,
        vendor: 'unknown',
        renderer: 'unknown'
      };
      return this.capabilities;
    }

    const webgl2 = canvas.getContext('webgl2') !== null;
    const extensions = webgl.getSupportedExtensions() || [];
    
    this.capabilities = {
      webgl: true,
      webgl2,
      extensions,
      maxTextureSize: webgl.getParameter(webgl.MAX_TEXTURE_SIZE),
      maxVertexAttributes: webgl.getParameter(webgl.MAX_VERTEX_ATTRIBS),
      vendor: webgl.getParameter(webgl.VENDOR),
      renderer: webgl.getParameter(webgl.RENDERER)
    };

    this.cleanupContext(canvas);
    return this.capabilities;
  }

  // Queue-based context creation to prevent exhaustion
  async createContextQueued(
    canvas: HTMLCanvasElement,
    options: WebGLContextOptions = {}
  ): Promise<WebGLRenderingContext | WebGL2RenderingContext | null> {
    return new Promise((resolve) => {
      if (this.activeContexts < this.maxActiveContexts) {
        this.activeContexts++;
        const context = this.createContext(canvas, options);
        resolve(context);
      } else {
        console.log('🔄 WebGL: Context queued - max active contexts reached');
        this.contextQueue.push({ canvas, resolve });
      }
    });
  }

  // Create WebGL context with comprehensive error handling
  createContext(
    canvas: HTMLCanvasElement, 
    options: WebGLContextOptions = {}
  ): WebGLRenderingContext | WebGL2RenderingContext | null {
    const startTime = performance.now();
    
    try {
      const defaultOptions: WebGLContextOptions = {
        preserveDrawingBuffer: false,
        antialias: true,
        alpha: true,
        depth: true,
        stencil: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
        desynchronized: false
      };

      const contextOptions = { ...defaultOptions, ...options };

      // Try WebGL2 first, then fallback to WebGL
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      gl = canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext;
      if (!gl) {
        gl = canvas.getContext('webgl', contextOptions) as WebGLRenderingContext;
      }
      if (!gl) {
        gl = canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext;
      }

      if (!gl) {
        this.performanceMetrics.creationFailures++;
        return null;
      }

      // Store context reference
      this.contexts.set(canvas, gl);

      // Set up context loss/restore handlers
      this.setupContextHandlers(canvas, gl);

      // Record performance metrics
      const creationTime = performance.now() - startTime;
      this.performanceMetrics.averageCreationTime = 
        (this.performanceMetrics.averageCreationTime + creationTime) / 2;

      return gl;
    } catch (error) {
      console.error('WebGL context creation failed:', error);
      this.performanceMetrics.creationFailures++;
      return null;
    }
  }

  // Setup context loss and restore event handlers
  private setupContextHandlers(
    canvas: HTMLCanvasElement, 
    gl: WebGLRenderingContext | WebGL2RenderingContext
  ): void {
    const lossHandler = (event: Event) => {
      event.preventDefault();
      this.performanceMetrics.contextLosses++;
      this.performanceMetrics.lastLossTime = Date.now();
      console.warn('WebGL context lost for canvas');
      
      // Emit custom event for components to handle
      canvas.dispatchEvent(new CustomEvent('webgl-context-lost', {
        detail: { canvas, gl }
      }));
    };

    const restoreHandler = (event: Event) => {
      this.performanceMetrics.contextRestores++;
      console.log('WebGL context restored for canvas');
      
      // Attempt to restore WebGL context
      const newGl = this.createContext(canvas);
      if (newGl) {
        this.contexts.set(canvas, newGl);
        
        // Emit custom event for components to handle restoration
        canvas.dispatchEvent(new CustomEvent('webgl-context-restored', {
          detail: { canvas, gl: newGl }
        }));
      }
    };

    canvas.addEventListener('webglcontextlost', lossHandler);
    canvas.addEventListener('webglcontextrestored', restoreHandler);

    this.contextLossHandlers.set(canvas, lossHandler);
    this.contextRestoreHandlers.set(canvas, restoreHandler);
  }

  // Clean up WebGL context and handlers
  cleanupContext(canvas: HTMLCanvasElement): void {
    const gl = this.contexts.get(canvas);
    if (gl) {
      // Clean up WebGL resources
      const extension = gl.getExtension('WEBGL_lose_context');
      if (extension) {
        extension.loseContext();
      }
      this.contexts.delete(canvas);
      this.activeContexts = Math.max(0, this.activeContexts - 1);
      
      // Process next item in queue
      this.processContextQueue();
    }

    // Remove event handlers
    const lossHandler = this.contextLossHandlers.get(canvas);
    const restoreHandler = this.contextRestoreHandlers.get(canvas);
    
    if (lossHandler) {
      canvas.removeEventListener('webglcontextlost', lossHandler);
      this.contextLossHandlers.delete(canvas);
    }
    
    if (restoreHandler) {
      canvas.removeEventListener('webglcontextrestored', restoreHandler);
      this.contextRestoreHandlers.delete(canvas);
    }
  }

  // Process queued context requests
  private processContextQueue(): void {
    if (this.contextQueue.length > 0 && this.activeContexts < this.maxActiveContexts) {
      const { canvas, resolve } = this.contextQueue.shift()!;
      this.activeContexts++;
      const context = this.createContext(canvas);
      resolve(context);
    }
  }

  // Get context with automatic recreation if lost
  getContext(canvas: HTMLCanvasElement): WebGLRenderingContext | WebGL2RenderingContext | null {
    let gl = this.contexts.get(canvas);
    
    if (!gl || gl.isContextLost()) {
      gl = this.createContext(canvas);
    }
    
    return gl;
  }

  // Force context loss for testing
  loseContext(canvas: HTMLCanvasElement): void {
    const gl = this.contexts.get(canvas);
    if (gl) {
      const extension = gl.getExtension('WEBGL_lose_context');
      if (extension) {
        extension.loseContext();
      }
    }
  }

  // Force context restore for testing
  restoreContext(canvas: HTMLCanvasElement): void {
    const gl = this.contexts.get(canvas);
    if (gl) {
      const extension = gl.getExtension('WEBGL_lose_context');
      if (extension) {
        extension.restoreContext();
      }
    }
  }

  // Get performance metrics
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  // Check if WebGL is available and performant
  isWebGLViable(): boolean {
    const caps = this.detectCapabilities();
    return caps.webgl && 
           caps.maxTextureSize >= 512 && 
           caps.maxVertexAttributes >= 8 &&
           this.performanceMetrics.creationFailures < 3;
  }

  // Get recommended quality settings based on capabilities
  getRecommendedSettings(): {
    antialias: boolean;
    shadowQuality: 'low' | 'medium' | 'high';
    textureQuality: 'low' | 'medium' | 'high';
    particleCount: number;
    animationFPS: number;
  } {
    const caps = this.detectCapabilities();
    
    if (!caps.webgl) {
      return {
        antialias: false,
        shadowQuality: 'low',
        textureQuality: 'low',
        particleCount: 0,
        animationFPS: 30
      };
    }

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHighEnd = caps.maxTextureSize >= 4096 && caps.extensions.includes('EXT_texture_filter_anisotropic');

    if (isMobile) {
      return {
        antialias: false,
        shadowQuality: 'low',
        textureQuality: 'medium',
        particleCount: 50,
        animationFPS: 30
      };
    }

    if (isHighEnd) {
      return {
        antialias: true,
        shadowQuality: 'high',
        textureQuality: 'high',
        particleCount: 200,
        animationFPS: 60
      };
    }

    return {
      antialias: true,
      shadowQuality: 'medium',
      textureQuality: 'medium',
      particleCount: 100,
      animationFPS: 45
    };
  }

  // Memory management utilities
  monitorMemoryUsage(): {
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
    jsHeapSizeLimit?: number;
    webglContexts: number;
  } {
    const memory = (performance as any).memory;
    
    return {
      totalJSHeapSize: memory?.totalJSHeapSize,
      usedJSHeapSize: memory?.usedJSHeapSize,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit,
      webglContexts: this.contexts.size
    };
  }

  // Clean up all contexts (call on app unmount)
  dispose(): void {
    for (const canvas of this.contexts.keys()) {
      this.cleanupContext(canvas);
    }
    this.contexts.clear();
    this.contextLossHandlers.clear();
    this.contextRestoreHandlers.clear();
    this.contextQueue.length = 0;
    this.activeContexts = 0;
  }

  // Get queue status for debugging
  getQueueStatus(): { active: number; queued: number; max: number } {
    return {
      active: this.activeContexts,
      queued: this.contextQueue.length,
      max: this.maxActiveContexts
    };
  }
}

// Singleton instance
export const webglManager = new WebGLManager();