interface RegionConfig {
  id: string;
  name: string;
  code: string;
  apiEndpoint: string;
  cdnEndpoint: string;
  latency: number;
  dataCenter: string;
  compliance: string[];
}

interface CDNConfig {
  enabled: boolean;
  regions: string[];
  cacheRules: {
    static: number;
    api: number;
    dynamic: number;
  };
}

class GlobalInfrastructureService {
  private regions: RegionConfig[] = [
    {
      id: 'us-east',
      name: 'North America East',
      code: 'us-east-1',
      apiEndpoint: 'https://api-us-east.therapysync.ai',
      cdnEndpoint: 'https://cdn-us-east.therapysync.ai',
      latency: 0,
      dataCenter: 'Virginia, USA',
      compliance: ['HIPAA', 'SOC2', 'FDA']
    },
    {
      id: 'eu-west',
      name: 'Europe West',
      code: 'eu-west-1',
      apiEndpoint: 'https://api-eu-west.therapysync.ai',
      cdnEndpoint: 'https://cdn-eu-west.therapysync.ai',
      latency: 0,
      dataCenter: 'Frankfurt, Germany',
      compliance: ['GDPR', 'ISO27001', 'MDR']
    },
    {
      id: 'asia-pacific',
      name: 'Asia Pacific',
      code: 'ap-southeast-1',
      apiEndpoint: 'https://api-ap.therapysync.ai',
      cdnEndpoint: 'https://cdn-ap.therapysync.ai',
      latency: 0,
      dataCenter: 'Singapore',
      compliance: ['PDPA', 'ISO27001']
    },
    {
      id: 'canada',
      name: 'Canada',
      code: 'ca-central-1',
      apiEndpoint: 'https://api-ca.therapysync.ai',
      cdnEndpoint: 'https://cdn-ca.therapysync.ai',
      latency: 0,
      dataCenter: 'Toronto, Canada',
      compliance: ['PIPEDA', 'PHIPA']
    }
  ];

  private cdnConfig: CDNConfig = {
    enabled: true,
    regions: ['us-east', 'eu-west', 'asia-pacific', 'canada'],
    cacheRules: {
      static: 86400, // 24 hours
      api: 300,     // 5 minutes
      dynamic: 60   // 1 minute
    }
  };

  // Auto-detect optimal region
  async detectOptimalRegion(): Promise<RegionConfig> {
    try {
      const latencyTests = await Promise.allSettled(
        this.regions.map(region => this.measureLatency(region))
      );

      const results = latencyTests
        .map((result, index) => ({
          region: this.regions[index],
          latency: result.status === 'fulfilled' ? result.value : Infinity
        }))
        .sort((a, b) => a.latency - b.latency);

      return results[0]?.region || this.regions[0];
    } catch (error) {
      console.warn('Failed to detect optimal region:', error);
      return this.regions[0]; // Fallback to US East
    }
  }

  private async measureLatency(region: RegionConfig): Promise<number> {
    const start = performance.now();
    try {
      const response = await fetch(`${region.apiEndpoint}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const latency = performance.now() - start;
        region.latency = latency;
        return latency;
      }
      return Infinity;
    } catch (error) {
      return Infinity;
    }
  }

  // Get user's geographic location
  async getUserLocation(): Promise<{ country: string; region: string; compliance: string[] }> {
    try {
      // Use IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const region = this.getRegionForCountry(data.country_code);
      return {
        country: data.country_name,
        region: region.name,
        compliance: region.compliance
      };
    } catch (error) {
      console.warn('Failed to get user location:', error);
      return {
        country: 'Unknown',
        region: 'North America East',
        compliance: ['HIPAA']
      };
    }
  }

  private getRegionForCountry(countryCode: string): RegionConfig {
    const regionMap: Record<string, string> = {
      // North America
      'US': 'us-east',
      'CA': 'canada',
      'MX': 'us-east',
      
      // Europe
      'DE': 'eu-west',
      'FR': 'eu-west',
      'GB': 'eu-west',
      'IT': 'eu-west',
      'ES': 'eu-west',
      'NL': 'eu-west',
      'SE': 'eu-west',
      'NO': 'eu-west',
      'DK': 'eu-west',
      'FI': 'eu-west',
      
      // Asia Pacific
      'JP': 'asia-pacific',
      'KR': 'asia-pacific',
      'CN': 'asia-pacific',
      'SG': 'asia-pacific',
      'AU': 'asia-pacific',
      'NZ': 'asia-pacific',
      'IN': 'asia-pacific',
      'TH': 'asia-pacific',
      'VN': 'asia-pacific',
      'MY': 'asia-pacific'
    };

    const regionId = regionMap[countryCode] || 'us-east';
    return this.regions.find(r => r.id === regionId) || this.regions[0];
  }

  // CDN Management
  async optimizeCDN(): Promise<void> {
    if (!this.cdnConfig.enabled) return;

    try {
      // Preload critical resources
      await this.preloadCriticalResources();
      
      // Configure cache headers
      this.configureCacheHeaders();
      
      // Enable compression
      this.enableCompression();
    } catch (error) {
      console.warn('CDN optimization failed:', error);
    }
  }

  private async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      '/assets/fonts/primary.woff2',
      '/assets/icons/sprite.svg',
      '/assets/css/critical.css'
    ];

    const preloadPromises = criticalResources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = this.getResourceType(resource);
      document.head.appendChild(link);
      
      return new Promise(resolve => {
        link.onload = resolve;
        link.onerror = resolve;
      });
    });

    await Promise.allSettled(preloadPromises);
  }

  private getResourceType(resource: string): string {
    if (resource.includes('.woff2') || resource.includes('.woff')) return 'font';
    if (resource.includes('.css')) return 'style';
    if (resource.includes('.js')) return 'script';
    if (resource.includes('.svg')) return 'image';
    return 'fetch';
  }

  private configureCacheHeaders(): void {
    // This would typically be done at the server level
    // but we can set some client-side cache preferences
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        // Cache optimization would be handled by service worker
        console.log('Service worker ready for cache optimization');
      });
    }
  }

  private enableCompression(): void {
    // Configure compression preferences
    const compressionPrefs = {
      gzip: true,
      brotli: true,
      minSize: 1024 // 1KB minimum
    };
    
    // Store preferences for service worker
    localStorage.setItem('compression_prefs', JSON.stringify(compressionPrefs));
  }

  // Data replication management
  async syncRegionalData(userId: string): Promise<void> {
    try {
      const userRegion = await this.detectOptimalRegion();
      const syncData = {
        userId,
        primaryRegion: userRegion.id,
        backupRegions: this.getBackupRegions(userRegion.id),
        syncStrategy: 'eventual_consistency',
        timestamp: new Date().toISOString()
      };

      // This would typically sync with backend systems
      console.log('Regional data sync configured:', syncData);
    } catch (error) {
      console.error('Failed to sync regional data:', error);
    }
  }

  private getBackupRegions(primaryRegionId: string): string[] {
    return this.regions
      .filter(r => r.id !== primaryRegionId)
      .map(r => r.id)
      .slice(0, 2); // Keep 2 backup regions
  }

  // Performance monitoring across regions
  async monitorGlobalPerformance(): Promise<{
    regions: { id: string; latency: number; status: string }[];
    globalAverage: number;
  }> {
    const regionStats = await Promise.allSettled(
      this.regions.map(async region => ({
        id: region.id,
        latency: await this.measureLatency(region),
        status: region.latency < 500 ? 'healthy' : 'degraded'
      }))
    );

    const validStats = regionStats
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value);

    const globalAverage = validStats.reduce((sum, stat) => sum + stat.latency, 0) / validStats.length;

    return {
      regions: validStats,
      globalAverage
    };
  }

  getRegions(): RegionConfig[] {
    return [...this.regions];
  }

  getCDNConfig(): CDNConfig {
    return { ...this.cdnConfig };
  }
}

export const globalInfrastructureService = new GlobalInfrastructureService();