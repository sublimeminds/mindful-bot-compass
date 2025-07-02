interface AREnvironment {
  id: string;
  name: string;
  type: 'therapeutic' | 'exposure' | 'meditation' | 'social';
  assets: string[];
  spatialAnchors: SpatialAnchor[];
  interactionPoints: InteractionPoint[];
}

interface SpatialAnchor {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  persistent: boolean;
}

interface InteractionPoint {
  id: string;
  type: 'trigger' | 'object' | 'portal' | 'tool';
  position: { x: number; y: number; z: number };
  action: string;
  metadata: any;
}

interface ARSession {
  id: string;
  userId: string;
  environmentId: string;
  startTime: Date;
  endTime?: Date;
  interactions: ARInteraction[];
  biometricData: BiometricReading[];
  therapeuticGoals: string[];
  metadata?: any;
}

interface ARInteraction {
  timestamp: Date;
  type: 'gaze' | 'touch' | 'gesture' | 'voice' | 'trigger';
  target: string;
  duration: number;
  metadata: any;
}

interface BiometricReading {
  timestamp: Date;
  heartRate?: number;
  skinConductance?: number;
  eyeMovement?: { x: number; y: number };
  stressLevel?: number;
}

class AugmentedRealityService {
  private environments: Map<string, AREnvironment> = new Map();
  private activeSessions: Map<string, ARSession> = new Map();
  private isARSupported: boolean = false;

  constructor() {
    this.initializeAR();
    this.createDefaultEnvironments();
  }

  // AR Environment Setup
  private async initializeAR(): Promise<void> {
    try {
      // Check for WebXR support
      if ('xr' in navigator) {
        const xr = (navigator as any).xr;
        this.isARSupported = await xr.isSessionSupported('immersive-ar');
      }
      
      if (!this.isARSupported) {
        console.log('AR not supported, falling back to 3D simulation');
      }
    } catch (error) {
      console.error('AR initialization failed:', error);
      this.isARSupported = false;
    }
  }

  private createDefaultEnvironments(): void {
    const therapeuticRoom: AREnvironment = {
      id: 'therapeutic_room',
      name: 'Calm Therapeutic Space',
      type: 'therapeutic',
      assets: [
        'models/comfortable_chair.glb',
        'models/calming_plants.glb',
        'textures/wood_floor.jpg',
        'audio/nature_sounds.mp3'
      ],
      spatialAnchors: [
        {
          id: 'therapist_chair',
          position: { x: 0, y: 0, z: -2 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          scale: { x: 1, y: 1, z: 1 },
          persistent: true
        },
        {
          id: 'patient_chair',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 180, z: 0, w: 1 },
          scale: { x: 1, y: 1, z: 1 },
          persistent: true
        }
      ],
      interactionPoints: [
        {
          id: 'comfort_adjustment',
          type: 'trigger',
          position: { x: 0.5, y: 1, z: 0 },
          action: 'adjust_environment_comfort',
          metadata: { adjustable: ['lighting', 'temperature', 'sounds'] }
        }
      ]
    };

    const exposureEnvironment: AREnvironment = {
      id: 'exposure_therapy',
      name: 'Controlled Exposure Space',
      type: 'exposure',
      assets: [
        'models/exposure_scenarios.glb',
        'audio/graduated_exposure.mp3'
      ],
      spatialAnchors: [
        {
          id: 'safe_zone',
          position: { x: 0, y: 0, z: 1 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          scale: { x: 2, y: 2, z: 2 },
          persistent: true
        }
      ],
      interactionPoints: [
        {
          id: 'intensity_control',
          type: 'object',
          position: { x: -1, y: 1, z: 0 },
          action: 'adjust_exposure_intensity',
          metadata: { range: [0, 10], current: 1 }
        }
      ]
    };

    this.environments.set(therapeuticRoom.id, therapeuticRoom);
    this.environments.set(exposureEnvironment.id, exposureEnvironment);
  }

  // Immersive Therapy Session Management
  async startImmersiveSession(userId: string, environmentId: string, goals: string[]): Promise<ARSession> {
    try {
      const environment = this.environments.get(environmentId);
      if (!environment) {
        throw new Error('Environment not found');
      }

      const session: ARSession = {
        id: `ar_session_${Date.now()}`,
        userId,
        environmentId,
        startTime: new Date(),
        interactions: [],
        biometricData: [],
        therapeuticGoals: goals
      };

      this.activeSessions.set(session.id, session);

      // Initialize AR tracking
      await this.setupARTracking(session);
      
      // Load environment assets
      await this.loadEnvironmentAssets(environment);
      
      // Begin biometric monitoring
      this.startBiometricMonitoring(session.id);

      return session;
    } catch (error) {
      console.error('Failed to start AR session:', error);
      throw error;
    }
  }

  async endImmersiveSession(sessionId: string): Promise<ARSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.endTime = new Date();
    this.stopBiometricMonitoring(sessionId);
    
    // Analyze session data
    const analysis = await this.analyzeSessionData(session);
    session.metadata = analysis;

    this.activeSessions.delete(sessionId);
    return session;
  }

  // Spatial Anchoring for Consistent Sessions
  async createSpatialAnchor(environmentId: string, anchor: Omit<SpatialAnchor, 'id'>): Promise<string> {
    try {
      const environment = this.environments.get(environmentId);
      if (!environment) {
        throw new Error('Environment not found');
      }

      const anchorId = `anchor_${Date.now()}`;
      const newAnchor: SpatialAnchor = {
        id: anchorId,
        ...anchor
      };

      environment.spatialAnchors.push(newAnchor);
      
      // Persist anchor if supported
      if (this.isARSupported && anchor.persistent) {
        await this.persistSpatialAnchor(newAnchor);
      }

      return anchorId;
    } catch (error) {
      console.error('Failed to create spatial anchor:', error);
      throw error;
    }
  }

  async loadSpatialAnchors(environmentId: string): Promise<SpatialAnchor[]> {
    const environment = this.environments.get(environmentId);
    if (!environment) {
      return [];
    }

    try {
      // Load persistent anchors from device storage
      const persistentAnchors = await this.loadPersistedAnchors();
      const environmentAnchors = persistentAnchors.filter(anchor => 
        environment.spatialAnchors.some(envAnchor => envAnchor.id === anchor.id)
      );

      return [...environment.spatialAnchors, ...environmentAnchors];
    } catch (error) {
      console.error('Failed to load spatial anchors:', error);
      return environment.spatialAnchors;
    }
  }

  // AR Interaction Tracking
  recordInteraction(sessionId: string, interaction: Omit<ARInteraction, 'timestamp'>): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.interactions.push({
      timestamp: new Date(),
      ...interaction
    });

    // Trigger real-time analysis
    this.analyzeInteractionPattern(session, interaction);
  }

  // Biometric Integration
  private startBiometricMonitoring(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Simulated biometric monitoring
    const interval = setInterval(() => {
      const reading: BiometricReading = {
        timestamp: new Date(),
        heartRate: 60 + Math.random() * 40,
        skinConductance: Math.random() * 10,
        stressLevel: Math.random() * 10
      };

      session.biometricData.push(reading);

      // Check for stress indicators
      if (reading.stressLevel && reading.stressLevel > 7) {
        this.triggerStressIntervention(sessionId);
      }
    }, 5000);

    // Store interval for cleanup
    (session as any).biometricInterval = interval;
  }

  private stopBiometricMonitoring(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const interval = (session as any).biometricInterval;
    if (interval) {
      clearInterval(interval);
    }
  }

  private triggerStressIntervention(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Add calming intervention
    this.recordInteraction(sessionId, {
      type: 'trigger',
      target: 'stress_intervention',
      duration: 0,
      metadata: { intervention: 'breathing_exercise', triggered_automatically: true }
    });
  }

  // Environment Management
  async createCustomEnvironment(userId: string, config: Omit<AREnvironment, 'id'>): Promise<string> {
    const environmentId = `custom_${userId}_${Date.now()}`;
    const environment: AREnvironment = {
      id: environmentId,
      ...config
    };

    this.environments.set(environmentId, environment);
    return environmentId;
  }

  getAvailableEnvironments(): AREnvironment[] {
    return Array.from(this.environments.values());
  }

  // Helper Methods
  private async setupARTracking(session: ARSession): Promise<void> {
    if (!this.isARSupported) {
      console.log('Using fallback 3D tracking');
      return;
    }

    try {
      // Initialize AR session
      const xrSession = await (navigator as any).xr.requestSession('immersive-ar');
      (session as any).xrSession = xrSession;
    } catch (error) {
      console.error('AR tracking setup failed:', error);
    }
  }

  private async loadEnvironmentAssets(environment: AREnvironment): Promise<void> {
    try {
      // Simulate asset loading
      console.log(`Loading assets for ${environment.name}:`, environment.assets);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Asset loading failed:', error);
    }
  }

  private async persistSpatialAnchor(anchor: SpatialAnchor): Promise<void> {
    try {
      // Use local storage as fallback
      const existingAnchors = JSON.parse(localStorage.getItem('ar_spatial_anchors') || '[]');
      existingAnchors.push(anchor);
      localStorage.setItem('ar_spatial_anchors', JSON.stringify(existingAnchors));
    } catch (error) {
      console.error('Failed to persist spatial anchor:', error);
    }
  }

  private async loadPersistedAnchors(): Promise<SpatialAnchor[]> {
    try {
      return JSON.parse(localStorage.getItem('ar_spatial_anchors') || '[]');
    } catch (error) {
      console.error('Failed to load persisted anchors:', error);
      return [];
    }
  }

  private analyzeInteractionPattern(session: ARSession, interaction: ARInteraction): void {
    const recentInteractions = session.interactions.slice(-10);
    
    // Detect engagement patterns
    const engagementScore = this.calculateEngagementScore(recentInteractions);
    
    // Suggest adjustments
    if (engagementScore < 0.3) {
      this.recordInteraction(session.id, {
        type: 'trigger',
        target: 'engagement_boost',
        duration: 0,
        metadata: { suggestion: 'increase_interactivity' }
      });
    }
  }

  private calculateEngagementScore(interactions: ARInteraction[]): number {
    if (interactions.length === 0) return 0;

    const avgDuration = interactions.reduce((sum, int) => sum + int.duration, 0) / interactions.length;
    const interactionVariety = new Set(interactions.map(int => int.type)).size;
    
    return (avgDuration / 1000 + interactionVariety) / 10; // Normalized score
  }

  private async analyzeSessionData(session: ARSession): Promise<any> {
    const totalDuration = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime() 
      : 0;

    const engagementScore = this.calculateEngagementScore(session.interactions);
    const stressReduction = this.calculateStressReduction(session.biometricData);
    const goalProgress = this.assessGoalProgress(session);

    return {
      duration: totalDuration,
      engagementScore,
      stressReduction,
      goalProgress,
      recommendedFollowUp: this.generateFollowUpRecommendations(session)
    };
  }

  private calculateStressReduction(biometricData: BiometricReading[]): number {
    if (biometricData.length < 2) return 0;

    const initialStress = biometricData.slice(0, 3).reduce((avg, reading) => 
      avg + (reading.stressLevel || 5), 0) / 3;
    
    const finalStress = biometricData.slice(-3).reduce((avg, reading) => 
      avg + (reading.stressLevel || 5), 0) / 3;

    return Math.max(0, (initialStress - finalStress) / initialStress);
  }

  private assessGoalProgress(session: ARSession): Record<string, number> {
    const progress: Record<string, number> = {};
    
    session.therapeuticGoals.forEach(goal => {
      const relevantInteractions = session.interactions.filter(interaction =>
        interaction.metadata?.goal === goal
      );
      
      progress[goal] = Math.min(1, relevantInteractions.length / 5); // Normalized progress
    });

    return progress;
  }

  private generateFollowUpRecommendations(session: ARSession): string[] {
    const recommendations: string[] = [];
    
    if (session.interactions.length < 10) {
      recommendations.push('Increase interaction with AR elements');
    }
    
    if (session.biometricData.some(reading => (reading.stressLevel || 0) > 7)) {
      recommendations.push('Focus on stress reduction techniques');
    }
    
    recommendations.push('Continue AR therapy sessions 2-3 times per week');
    
    return recommendations;
  }

  // Public API methods
  getARCapabilities(): {
    isSupported: boolean;
    features: string[];
    supportedEnvironments: string[];
  } {
    return {
      isSupported: this.isARSupported,
      features: [
        'spatial_anchoring',
        'object_recognition',
        'biometric_integration',
        'real_time_interaction',
        'persistent_environments'
      ],
      supportedEnvironments: Array.from(this.environments.keys())
    };
  }

  getActiveSessionsCount(): number {
    return this.activeSessions.size;
  }

  getSessionAnalytics(sessionId: string): any {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    return {
      duration: Date.now() - session.startTime.getTime(),
      interactionCount: session.interactions.length,
      averageStressLevel: session.biometricData.reduce((avg, reading) => 
        avg + (reading.stressLevel || 0), 0) / session.biometricData.length,
      engagementScore: this.calculateEngagementScore(session.interactions)
    };
  }
}

export const augmentedRealityService = new AugmentedRealityService();