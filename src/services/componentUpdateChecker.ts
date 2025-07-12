import { supabase } from '@/integrations/supabase/client';

export interface ComponentVersion {
  id: string;
  name: string;
  version: string;
  lastUpdated: Date;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  category: 'therapy' | 'ui' | 'core' | 'integration';
  status: 'active' | 'deprecated' | 'outdated' | 'updated';
  dependencies: string[];
  features: string[];
  changelog?: string;
}

export interface UpdateStatus {
  componentId: string;
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  updateType: 'major' | 'minor' | 'patch' | 'security';
  criticality: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  releaseDate: Date;
  breakingChanges: boolean;
  affectedFeatures: string[];
}

export interface QualityMetrics {
  componentId: string;
  performanceScore: number;
  reliabilityScore: number;
  userSatisfactionScore: number;
  errorRate: number;
  responseTime: number;
  lastChecked: Date;
}

export class ComponentUpdateChecker {
  private static THERAPY_COMPONENTS = [
    'StructuredSessionInterface',
    'AISessionConductor',
    'TherapyPlaybook',
    'TherapyChatInterface',
    'EnhancedSessionFlow',
    'RealTimeSessionManager',
    'SessionService',
    'CrisisDetection',
    'MoodTracking',
    'TherapistSelection'
  ];

  private static CORE_COMPONENTS = [
    'AuthSystem',
    'DatabaseClient',
    'EdgeFunctions',
    'NotificationSystem',
    'PaymentSystem',
    'AnalyticsSystem'
  ];

  private static UI_COMPONENTS = [
    'Button',
    'Card',
    'Input',
    'Dialog',
    'Toast',
    'Progress',
    'Badge',
    'ScrollArea'
  ];

  // Initialize component registry
  static async initializeRegistry(): Promise<void> {
    try {
      const allComponents = [
        ...this.THERAPY_COMPONENTS.map(name => ({ name, category: 'therapy' as const })),
        ...this.CORE_COMPONENTS.map(name => ({ name, category: 'core' as const })),
        ...this.UI_COMPONENTS.map(name => ({ name, category: 'ui' as const }))
      ];

      for (const component of allComponents) {
        await this.registerComponent({
          id: component.name.toLowerCase(),
          name: component.name,
          version: '1.0.0',
          lastUpdated: new Date(),
          criticality: component.category === 'therapy' ? 'high' : 
                      component.category === 'core' ? 'medium' : 'low',
          category: component.category,
          status: 'active',
          dependencies: [],
          features: [],
          changelog: 'Initial registration'
        });
      }

      console.log('Component registry initialized');
    } catch (error) {
      console.error('Error initializing component registry:', error);
    }
  }

  // Register a component in the system
  static async registerComponent(component: ComponentVersion): Promise<void> {
    try {
      await supabase
        .from('component_registry')
        .upsert({
          id: component.id,
          name: component.name,
          version: component.version,
          last_updated: component.lastUpdated.toISOString(),
          criticality: component.criticality,
          category: component.category,
          status: component.status,
          dependencies: component.dependencies,
          features: component.features,
          changelog: component.changelog
        });
    } catch (error) {
      console.error('Error registering component:', error);
    }
  }

  // Check for updates across all components
  static async checkAllUpdates(): Promise<UpdateStatus[]> {
    try {
      const { data: components, error } = await supabase
        .from('component_registry')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      const updateStatuses: UpdateStatus[] = [];

      for (const component of components || []) {
        const updateStatus = await this.checkComponentUpdate(component.id);
        if (updateStatus && updateStatus.updateAvailable) {
          updateStatuses.push(updateStatus);
        }
      }

      // Sort by criticality and update type
      return updateStatuses.sort((a, b) => {
        const criticalityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return criticalityOrder[b.criticality] - criticalityOrder[a.criticality];
      });

    } catch (error) {
      console.error('Error checking all updates:', error);
      return [];
    }
  }

  // Check for updates for a specific component
  static async checkComponentUpdate(componentId: string): Promise<UpdateStatus | null> {
    try {
      const { data: component, error } = await supabase
        .from('component_registry')
        .select('*')
        .eq('id', componentId)
        .single();

      if (error) throw error;

      // Simulate update checking logic
      const latestVersion = await this.getLatestVersion(componentId);
      const updateAvailable = this.compareVersions(component.version, latestVersion) < 0;

      if (!updateAvailable) return null;

      return {
        componentId,
        currentVersion: component.version,
        latestVersion,
        updateAvailable,
        updateType: this.getUpdateType(component.version, latestVersion),
        criticality: component.criticality,
        description: await this.getUpdateDescription(componentId, latestVersion),
        releaseDate: new Date(),
        breakingChanges: this.hasBreakingChanges(component.version, latestVersion),
        affectedFeatures: await this.getAffectedFeatures(componentId, latestVersion)
      };

    } catch (error) {
      console.error('Error checking component update:', error);
      return null;
    }
  }

  // Check quality metrics for all therapy components
  static async checkQualityMetrics(): Promise<QualityMetrics[]> {
    try {
      const therapyComponents = this.THERAPY_COMPONENTS;
      const metrics: QualityMetrics[] = [];

      for (const componentName of therapyComponents) {
        const componentId = componentName.toLowerCase();
        const qualityMetrics = await this.getComponentQualityMetrics(componentId);
        if (qualityMetrics) {
          metrics.push(qualityMetrics);
        }
      }

      return metrics;
    } catch (error) {
      console.error('Error checking quality metrics:', error);
      return [];
    }
  }

  // Get quality metrics for a specific component
  static async getComponentQualityMetrics(componentId: string): Promise<QualityMetrics | null> {
    try {
      // Simulate quality metrics checking
      const performanceScore = Math.random() * 40 + 60; // 60-100
      const reliabilityScore = Math.random() * 30 + 70; // 70-100
      const userSatisfactionScore = Math.random() * 20 + 80; // 80-100
      const errorRate = Math.random() * 0.05; // 0-5%
      const responseTime = Math.random() * 500 + 100; // 100-600ms

      return {
        componentId,
        performanceScore,
        reliabilityScore,
        userSatisfactionScore,
        errorRate,
        responseTime,
        lastChecked: new Date()
      };
    } catch (error) {
      console.error('Error getting quality metrics:', error);
      return null;
    }
  }

  // Monitor therapy system health
  static async monitorTherapySystemHealth(): Promise<{
    overallHealth: number;
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  }> {
    try {
      const qualityMetrics = await this.checkQualityMetrics();
      const updateStatuses = await this.checkAllUpdates();
      
      const criticalIssues: string[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      // Check for critical issues
      const criticalUpdates = updateStatuses.filter(u => u.criticality === 'critical');
      if (criticalUpdates.length > 0) {
        criticalIssues.push(`${criticalUpdates.length} critical security updates available`);
      }

      const lowPerformanceComponents = qualityMetrics.filter(m => m.performanceScore < 70);
      if (lowPerformanceComponents.length > 0) {
        criticalIssues.push(`${lowPerformanceComponents.length} components have performance issues`);
      }

      const highErrorRateComponents = qualityMetrics.filter(m => m.errorRate > 0.02);
      if (highErrorRateComponents.length > 0) {
        criticalIssues.push(`${highErrorRateComponents.length} components have high error rates`);
      }

      // Check for warnings
      const highPriorityUpdates = updateStatuses.filter(u => u.criticality === 'high');
      if (highPriorityUpdates.length > 0) {
        warnings.push(`${highPriorityUpdates.length} high-priority updates available`);
      }

      const slowResponseComponents = qualityMetrics.filter(m => m.responseTime > 300);
      if (slowResponseComponents.length > 0) {
        warnings.push(`${slowResponseComponents.length} components have slow response times`);
      }

      // Generate recommendations
      if (updateStatuses.length > 0) {
        recommendations.push('Schedule maintenance window to apply available updates');
      }

      if (qualityMetrics.some(m => m.userSatisfactionScore < 85)) {
        recommendations.push('Review user feedback for therapy session improvements');
      }

      // Calculate overall health score
      const avgPerformance = qualityMetrics.reduce((sum, m) => sum + m.performanceScore, 0) / Math.max(1, qualityMetrics.length);
      const avgReliability = qualityMetrics.reduce((sum, m) => sum + m.reliabilityScore, 0) / Math.max(1, qualityMetrics.length);
      const avgSatisfaction = qualityMetrics.reduce((sum, m) => sum + m.userSatisfactionScore, 0) / Math.max(1, qualityMetrics.length);
      
      const updatePenalty = criticalUpdates.length * 10 + highPriorityUpdates.length * 5;
      const errorPenalty = qualityMetrics.reduce((sum, m) => sum + (m.errorRate * 1000), 0);
      
      const overallHealth = Math.max(0, Math.min(100, 
        (avgPerformance + avgReliability + avgSatisfaction) / 3 - updatePenalty - errorPenalty
      ));

      return {
        overallHealth,
        criticalIssues,
        warnings,
        recommendations
      };

    } catch (error) {
      console.error('Error monitoring therapy system health:', error);
      return {
        overallHealth: 0,
        criticalIssues: ['Error monitoring system health'],
        warnings: [],
        recommendations: ['Check system monitoring service']
      };
    }
  }

  // Schedule automatic health checks
  static startHealthMonitoring(intervalMinutes: number = 60): void {
    setInterval(async () => {
      try {
        const health = await this.monitorTherapySystemHealth();
        
        if (health.overallHealth < 80) {
          console.warn('Therapy system health below threshold:', health);
          // Could trigger notifications here
        }
        
        if (health.criticalIssues.length > 0) {
          console.error('Critical therapy system issues detected:', health.criticalIssues);
          // Could trigger emergency notifications here
        }

        // Log health status
        await supabase
          .from('system_health_logs')
          .insert({
            overall_health: health.overallHealth,
            critical_issues: health.criticalIssues,
            warnings: health.warnings,
            recommendations: health.recommendations,
            checked_at: new Date().toISOString()
          });

      } catch (error) {
        console.error('Error in health monitoring cycle:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // Utility methods
  private static async getLatestVersion(componentId: string): Promise<string> {
    // Simulate version checking - in real implementation, 
    // this would check npm registry, GitHub releases, etc.
    return '1.1.0';
  }

  private static compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (v1Parts[i] < v2Parts[i]) return -1;
      if (v1Parts[i] > v2Parts[i]) return 1;
    }
    return 0;
  }

  private static getUpdateType(currentVersion: string, latestVersion: string): 'major' | 'minor' | 'patch' | 'security' {
    const current = currentVersion.split('.').map(Number);
    const latest = latestVersion.split('.').map(Number);
    
    if (latest[0] > current[0]) return 'major';
    if (latest[1] > current[1]) return 'minor';
    if (latest[2] > current[2]) return 'patch';
    return 'security';
  }

  private static async getUpdateDescription(componentId: string, version: string): Promise<string> {
    // Simulate getting update description
    return `Update ${componentId} to version ${version} with improved therapy features and bug fixes.`;
  }

  private static hasBreakingChanges(currentVersion: string, latestVersion: string): boolean {
    const current = currentVersion.split('.').map(Number);
    const latest = latestVersion.split('.').map(Number);
    return latest[0] > current[0]; // Major version change indicates breaking changes
  }

  private static async getAffectedFeatures(componentId: string, version: string): Promise<string[]> {
    // Simulate getting affected features
    return ['Session Management', 'AI Integration', 'User Interface'];
  }
}