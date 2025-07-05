import { supabase } from '@/integrations/supabase/client';

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  audioLatency: number;
  framerate: number;
  avatarComplexity: number;
}

export interface OptimizationRecommendations {
  avatarLOD: 'high' | 'medium' | 'low';
  audioQuality: 'high' | 'medium' | 'low';
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
  networkOptimization: string[];
  renderOptimization: string[];
}

class RealTimePerformanceOptimizer {
  private performanceHistory: Map<string, PerformanceMetrics[]> = new Map();
  private optimizationCache: Map<string, OptimizationRecommendations> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  startPerformanceMonitoring(userId: string): void {
    // Clear existing monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceMetrics(userId);
    }, 2000); // Collect metrics every 2 seconds
  }

  stopPerformanceMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async collectPerformanceMetrics(userId: string): Promise<void> {
    try {
      const metrics: PerformanceMetrics = {
        renderTime: performance.now() - (performance.getEntriesByType('navigation')[0] as any)?.loadEventEnd || 0,
        memoryUsage: this.getMemoryUsage(),
        networkLatency: await this.measureNetworkLatency(),
        audioLatency: await this.measureAudioLatency(),
        framerate: await this.measureFramerate(),
        avatarComplexity: this.getAvatarComplexity()
      };

      // Store metrics
      this.storeMetrics(userId, metrics);

      // Generate optimization recommendations if needed
      if (this.shouldOptimize(metrics)) {
        const recommendations = this.generateOptimizationRecommendations(metrics);
        this.optimizationCache.set(userId, recommendations);
        await this.applyOptimizations(recommendations);
      }

    } catch (error) {
      console.error('Error collecting performance metrics:', error);
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / (performance as any).memory.jsHeapSizeLimit;
    }
    return 0;
  }

  private async measureNetworkLatency(): Promise<number> {
    const start = performance.now();
    try {
      await fetch('/api/ping', { method: 'HEAD' });
      return performance.now() - start;
    } catch {
      return 1000; // Default high latency if ping fails
    }
  }

  private async measureAudioLatency(): Promise<number> {
    return new Promise((resolve) => {
      const audioContext = new AudioContext();
      const startTime = audioContext.currentTime;
      
      const oscillator = audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(440, startTime);
      oscillator.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(startTime + 0.01);
      
      oscillator.onended = () => {
        const latency = (audioContext.currentTime - startTime) * 1000;
        resolve(latency);
      };
      
      // Fallback timeout
      setTimeout(() => resolve(50), 100);
    });
  }

  private async measureFramerate(): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frames++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          resolve(frames);
        }
      };
      
      requestAnimationFrame(countFrame);
    });
  }

  private getAvatarComplexity(): number {
    // Estimate avatar complexity based on visible elements
    const canvasElements = document.querySelectorAll('canvas');
    let complexity = 0;
    
    canvasElements.forEach(canvas => {
      const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (context) {
        const debugInfo = context.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          complexity += 1; // Base complexity for 3D rendering
        }
      }
    });
    
    return complexity;
  }

  private storeMetrics(userId: string, metrics: PerformanceMetrics): void {
    if (!this.performanceHistory.has(userId)) {
      this.performanceHistory.set(userId, []);
    }
    
    const history = this.performanceHistory.get(userId)!;
    history.push(metrics);
    
    // Keep only last 100 metrics
    if (history.length > 100) {
      history.shift();
    }
  }

  private shouldOptimize(metrics: PerformanceMetrics): boolean {
    return (
      metrics.renderTime > 100 || // > 100ms render time
      metrics.memoryUsage > 0.8 || // > 80% memory usage
      metrics.networkLatency > 500 || // > 500ms network latency
      metrics.audioLatency > 50 || // > 50ms audio latency
      metrics.framerate < 30 // < 30 FPS
    );
  }

  private generateOptimizationRecommendations(metrics: PerformanceMetrics): OptimizationRecommendations {
    const recommendations: OptimizationRecommendations = {
      avatarLOD: 'high',
      audioQuality: 'high',
      cacheStrategy: 'moderate',
      networkOptimization: [],
      renderOptimization: []
    };

    // Avatar Level of Detail optimization
    if (metrics.renderTime > 200 || metrics.framerate < 20) {
      recommendations.avatarLOD = 'low';
      recommendations.renderOptimization.push('reduce_avatar_complexity');
    } else if (metrics.renderTime > 100 || metrics.framerate < 30) {
      recommendations.avatarLOD = 'medium';
      recommendations.renderOptimization.push('optimize_avatar_textures');
    }

    // Audio quality optimization
    if (metrics.audioLatency > 100 || metrics.networkLatency > 1000) {
      recommendations.audioQuality = 'low';
      recommendations.networkOptimization.push('compress_audio');
    } else if (metrics.audioLatency > 50 || metrics.networkLatency > 500) {
      recommendations.audioQuality = 'medium';
      recommendations.networkOptimization.push('optimize_audio_streaming');
    }

    // Memory usage optimization
    if (metrics.memoryUsage > 0.9) {
      recommendations.cacheStrategy = 'minimal';
      recommendations.renderOptimization.push('clear_unused_textures');
    } else if (metrics.memoryUsage > 0.8) {
      recommendations.cacheStrategy = 'moderate';
      recommendations.renderOptimization.push('optimize_memory_usage');
    } else {
      recommendations.cacheStrategy = 'aggressive';
    }

    // Network optimization
    if (metrics.networkLatency > 500) {
      recommendations.networkOptimization.push('enable_compression');
      recommendations.networkOptimization.push('use_cdn');
    }

    return recommendations;
  }

  private async applyOptimizations(recommendations: OptimizationRecommendations): Promise<void> {
    try {
      // Apply avatar LOD optimizations
      await this.optimizeAvatarLOD(recommendations.avatarLOD);
      
      // Apply audio quality optimizations
      await this.optimizeAudioQuality(recommendations.audioQuality);
      
      // Apply caching strategy
      await this.applyCachingStrategy(recommendations.cacheStrategy);
      
      // Log optimization actions
      console.log('Applied performance optimizations:', recommendations);
      
    } catch (error) {
      console.error('Error applying optimizations:', error);
    }
  }

  private async optimizeAvatarLOD(level: 'high' | 'medium' | 'low'): Promise<void> {
    const avatarSettings = {
      high: { detail: 1.0, textures: 'high', animations: 'full' },
      medium: { detail: 0.7, textures: 'medium', animations: 'reduced' },
      low: { detail: 0.4, textures: 'low', animations: 'minimal' }
    };
    
    const settings = avatarSettings[level];
    
    // Apply to global avatar configuration
    window.dispatchEvent(new CustomEvent('avatar-lod-change', {
      detail: settings
    }));
  }

  private async optimizeAudioQuality(quality: 'high' | 'medium' | 'low'): Promise<void> {
    const audioSettings = {
      high: { bitrate: 128, compression: 'none' },
      medium: { bitrate: 64, compression: 'moderate' },
      low: { bitrate: 32, compression: 'aggressive' }
    };
    
    const settings = audioSettings[quality];
    
    // Apply to audio configuration
    window.dispatchEvent(new CustomEvent('audio-quality-change', {
      detail: settings
    }));
  }

  private async applyCachingStrategy(strategy: 'aggressive' | 'moderate' | 'minimal'): Promise<void> {
    const cacheSettings = {
      aggressive: { audioCache: 50, textureCache: 100, preload: true },
      moderate: { audioCache: 25, textureCache: 50, preload: false },
      minimal: { audioCache: 10, textureCache: 20, preload: false }
    };
    
    const settings = cacheSettings[strategy];
    
    // Apply caching configuration
    window.dispatchEvent(new CustomEvent('cache-strategy-change', {
      detail: settings
    }));
  }

  // Performance analytics and reporting
  async generatePerformanceReport(userId: string): Promise<any> {
    const history = this.performanceHistory.get(userId) || [];
    
    if (history.length === 0) {
      return { message: 'No performance data available' };
    }

    const averages = this.calculateAverages(history);
    const trends = this.calculateTrends(history);
    const recommendations = this.optimizationCache.get(userId);

    return {
      userId,
      period: {
        start: new Date(Date.now() - history.length * 2000).toISOString(),
        end: new Date().toISOString(),
        dataPoints: history.length
      },
      averages,
      trends,
      currentOptimizations: recommendations,
      performanceScore: this.calculatePerformanceScore(averages),
      recommendations: this.generateRecommendationsSummary(averages)
    };
  }

  private calculateAverages(history: PerformanceMetrics[]): Record<string, number> {
    const totals = history.reduce((acc, metrics) => {
      Object.keys(metrics).forEach(key => {
        acc[key] = (acc[key] || 0) + metrics[key as keyof PerformanceMetrics];
      });
      return acc;
    }, {} as Record<string, number>);

    const averages: Record<string, number> = {};
    Object.keys(totals).forEach(key => {
      averages[key] = Math.round((totals[key] / history.length) * 100) / 100;
    });

    return averages;
  }

  private calculateTrends(history: PerformanceMetrics[]): Record<string, 'improving' | 'degrading' | 'stable'> {
    if (history.length < 10) return {};

    const recent = history.slice(-5);
    const previous = history.slice(-10, -5);

    const trends: Record<string, 'improving' | 'degrading' | 'stable'> = {};

    Object.keys(recent[0]).forEach(key => {
      const recentAvg = recent.reduce((sum, m) => sum + m[key as keyof PerformanceMetrics], 0) / recent.length;
      const previousAvg = previous.reduce((sum, m) => sum + m[key as keyof PerformanceMetrics], 0) / previous.length;
      
      const difference = Math.abs(recentAvg - previousAvg);
      const threshold = previousAvg * 0.1; // 10% threshold

      if (difference < threshold) {
        trends[key] = 'stable';
      } else if (key === 'memoryUsage' || key === 'renderTime' || key === 'networkLatency' || key === 'audioLatency') {
        // Lower is better for these metrics
        trends[key] = recentAvg < previousAvg ? 'improving' : 'degrading';
      } else {
        // Higher is better for framerate
        trends[key] = recentAvg > previousAvg ? 'improving' : 'degrading';
      }
    });

    return trends;
  }

  private calculatePerformanceScore(averages: Record<string, number>): number {
    const weights = {
      renderTime: -0.3, // Lower is better
      memoryUsage: -0.2, // Lower is better
      networkLatency: -0.2, // Lower is better
      audioLatency: -0.1, // Lower is better
      framerate: 0.2 // Higher is better
    };

    let score = 50; // Base score

    Object.keys(weights).forEach(key => {
      if (averages[key] !== undefined) {
        const normalizedValue = this.normalizeMetric(key, averages[key]);
        score += normalizedValue * weights[key as keyof typeof weights] * 50;
      }
    });

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private normalizeMetric(key: string, value: number): number {
    // Normalize metrics to 0-1 scale
    const ranges = {
      renderTime: { min: 0, max: 500 },
      memoryUsage: { min: 0, max: 1 },
      networkLatency: { min: 0, max: 2000 },
      audioLatency: { min: 0, max: 200 },
      framerate: { min: 0, max: 60 }
    };

    const range = ranges[key as keyof typeof ranges];
    if (!range) return 0.5;

    return Math.max(0, Math.min(1, (value - range.min) / (range.max - range.min)));
  }

  private generateRecommendationsSummary(averages: Record<string, number>): string[] {
    const recommendations: string[] = [];

    if (averages.renderTime > 100) {
      recommendations.push('Consider reducing avatar complexity for better performance');
    }
    if (averages.memoryUsage > 0.8) {
      recommendations.push('Clear browser cache and close unnecessary tabs');
    }
    if (averages.networkLatency > 500) {
      recommendations.push('Check your internet connection or try a different network');
    }
    if (averages.audioLatency > 50) {
      recommendations.push('Consider using wired headphones for better audio performance');
    }
    if (averages.framerate < 30) {
      recommendations.push('Reduce visual effects or use a more powerful device');
    }

    return recommendations;
  }

  // Cleanup
  cleanup(): void {
    this.stopPerformanceMonitoring();
    this.performanceHistory.clear();
    this.optimizationCache.clear();
  }
}

export const realTimePerformanceOptimizer = new RealTimePerformanceOptimizer();
