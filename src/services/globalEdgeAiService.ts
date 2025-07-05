import { supabase } from '@/integrations/supabase/client';

interface EdgeRegion {
  id: string;
  name: string;
  location: string;
  latency: number;
  available: boolean;
  capacity: number;
  models: string[];
}

interface CacheEntry {
  key: string;
  response: any;
  timestamp: number;
  ttl: number;
  region: string;
}

export class GlobalEdgeAIService {
  private static regions: EdgeRegion[] = [
    {
      id: 'us-east',
      name: 'US East',
      location: 'Virginia',
      latency: 50,
      available: true,
      capacity: 0.8,
      models: ['gpt-4.1', 'claude-sonnet-4']
    },
    {
      id: 'us-west',
      name: 'US West',
      location: 'California',
      latency: 45,
      available: true,
      capacity: 0.7,
      models: ['gpt-4.1', 'claude-sonnet-4']
    },
    {
      id: 'eu-central',
      name: 'EU Central',
      location: 'Frankfurt',
      latency: 60,
      available: true,
      capacity: 0.9,
      models: ['claude-sonnet-4']
    },
    {
      id: 'asia-pacific',
      name: 'Asia Pacific',
      location: 'Singapore',
      latency: 80,
      available: true,
      capacity: 0.6,
      models: ['gpt-4.1']
    }
  ];

  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Intelligent region selection based on user location and model availability
  static async selectOptimalRegion(userLocation?: string, requiredModel?: string): Promise<EdgeRegion> {
    let availableRegions = this.regions.filter(region => 
      region.available && region.capacity < 0.95
    );

    if (requiredModel) {
      availableRegions = availableRegions.filter(region => 
        region.models.includes(requiredModel)
      );
    }

    if (userLocation) {
      // Simple geo-routing logic
      const locationMap: Record<string, string> = {
        'US': 'us-east',
        'CA': 'us-west',
        'EU': 'eu-central',
        'AS': 'asia-pacific'
      };
      
      const preferredRegionId = locationMap[userLocation];
      const preferredRegion = availableRegions.find(r => r.id === preferredRegionId);
      
      if (preferredRegion) {
        return preferredRegion;
      }
    }

    // Default: select region with lowest latency and capacity
    return availableRegions.reduce((best, current) => {
      const bestScore = best.latency * (1 + best.capacity);
      const currentScore = current.latency * (1 + current.capacity);
      return currentScore < bestScore ? current : best;
    });
  }

  // Process AI request with intelligent routing and caching
  static async processRequest(
    message: string,
    context: any,
    options: {
      model?: string;
      priority?: 'low' | 'normal' | 'high';
      cacheable?: boolean;
      userLocation?: string;
    } = {}
  ): Promise<any> {
    const startTime = Date.now();
    
    // Check cache first for cacheable requests
    if (options.cacheable !== false) {
      const cacheKey = this.generateCacheKey(message, context, options.model);
      const cached = this.getFromCache(cacheKey);
      
      if (cached) {
        return {
          ...cached.response,
          cached: true,
          cacheRegion: cached.region,
          responseTime: Date.now() - startTime
        };
      }
    }

    // Select optimal edge region
    const region = await this.selectOptimalRegion(options.userLocation, options.model);
    
    try {
      // Route to edge function in selected region
      const response = await this.callEdgeRegion(region, {
        message,
        context,
        model: options.model,
        priority: options.priority
      });

      const responseTime = Date.now() - startTime;

      // Cache successful responses
      if (options.cacheable !== false && response.confidence > 0.8) {
        this.cacheResponse(
          this.generateCacheKey(message, context, options.model),
          response,
          region.id
        );
      }

      // Record analytics
      await this.recordEdgeAnalytics({
        regionId: region.id,
        responseTime,
        model: options.model,
        success: true,
        cached: false,
        userId: context.userId
      });

      return {
        ...response,
        region: region.name,
        responseTime,
        cached: false
      };

    } catch (error) {
      console.error(`Error in region ${region.name}:`, error);
      
      // Try fallback region
      const fallbackRegion = this.regions.find(r => 
        r.id !== region.id && 
        r.available && 
        (!options.model || r.models.includes(options.model))
      );

      if (fallbackRegion) {
        return this.callEdgeRegion(fallbackRegion, {
          message,
          context,
          model: options.model,
          priority: options.priority
        });
      }

      throw error;
    }
  }

  private static async callEdgeRegion(region: EdgeRegion, payload: any) {
    // In a real implementation, this would route to actual edge regions
    // For now, we'll simulate with the main Supabase function
    const { data, error } = await supabase.functions.invoke('enhanced-api', {
      body: {
        ...payload,
        edgeRegion: region.id,
        timestamp: new Date().toISOString()
      }
    });

    if (error) throw error;
    return data;
  }

  private static generateCacheKey(message: string, context: any, model?: string): string {
    const keyData = {
      message: message.toLowerCase().trim(),
      userId: context.userId,
      model: model || 'default',
      sessionType: context.sessionType || 'general'
    };
    
    return btoa(JSON.stringify(keyData)).substring(0, 32);
  }

  private static getFromCache(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry;
  }

  private static cacheResponse(key: string, response: any, region: string) {
    const entry: CacheEntry = {
      key,
      response,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL,
      region
    };
    
    this.cache.set(key, entry);
    
    // Clean up old cache entries
    if (this.cache.size > 1000) {
      this.cleanupCache();
    }
  }

  private static cleanupCache() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private static async recordEdgeAnalytics(metrics: {
    regionId: string;
    responseTime: number;
    model?: string;
    success: boolean;
    cached: boolean;
    userId: string;
  }) {
    try {
      // Log to console for now - will create proper table later
      console.log('Edge analytics:', metrics);
    } catch (error) {
      console.error('Error recording edge analytics:', error);
    }
  }

  // Get edge performance analytics - return mock data for now
  static async getEdgeAnalytics(timeRange: { from: Date; to: Date }) {
    try {
      // Return mock data until proper table is created
      return {
        totalRequests: 36620,
        averageLatency: 1100,
        cacheHitRate: 35.2,
        successRate: 98.1,
        regionBreakdown: {
          'us-east': { requests: 15200, averageLatency: 950 },
          'us-west': { requests: 12400, averageLatency: 1050 },
          'eu-central': { requests: 6800, averageLatency: 1200 },
          'asia-pacific': { requests: 2220, averageLatency: 1450 }
        }
      };
    } catch (error) {
      console.error('Error fetching edge analytics:', error);
      return null;
    }
  }

  // Preload models in regions based on usage patterns
  static async optimizeRegionalModels() {
    try {
      const analytics = await this.getEdgeAnalytics({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date()
      });

      if (!analytics) return;

      // Logic to determine which models should be deployed to which regions
      // This would typically involve ML-based predictions of usage patterns
      console.log('Regional optimization analytics:', analytics);
      
      // For now, just log the recommendation
      Object.keys(analytics.regionBreakdown).forEach(regionId => {
        const regionStats = analytics.regionBreakdown[regionId];
        console.log(`Region ${regionId}: ${regionStats.requests} requests, ${regionStats.averageLatency}ms avg latency`);
      });

    } catch (error) {
      console.error('Error optimizing regional models:', error);
    }
  }
}