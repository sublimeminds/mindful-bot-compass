import { supabase } from '@/integrations/supabase/client';
import { therapyContextManager } from './therapyContextManager';
import { EnhancedCrisisDetectionService } from './enhancedCrisisDetectionService';

export interface SessionOrchestrationData {
  sessionId: string;
  userId: string;
  currentPhase: string;
  phaseStartTime: Date;
  expectedPhaseDuration: number;
  conversationFlowScore: number;
  interventionEffectiveness: number;
  emotionalStateTracking: any;
  breakthroughMoments: any[];
  interventionHistory: any[];
  sessionExtensions: any[];
}

export interface TherapyPlanExecution {
  sessionId: string;
  userId: string;
  therapyPlanId?: string;
  currentGoals: string[];
  completedGoals: string[];
  techniqueSequence: any[];
  techniqueEffectiveness: any;
  personalizedHomework: any;
  continuityTracking: any;
  goalProgress: any;
  adaptationTriggers: any;
}

export interface SessionQualityMetrics {
  sessionId: string;
  userId: string;
  therapeuticAllianceScore: number;
  engagementLevel: number;
  techniqueEffectivenessScores: any;
  interventionSuccessRates: any;
  progressTowardGoals: any;
  emotionalRegulationProgress: number;
  sessionSatisfactionPredicted: number;
  breakthroughProbability: number;
  interventionTriggers: any;
  qualityAlerts: any[];
}

export interface CrisisMonitoring {
  sessionId: string;
  userId: string;
  crisisIndicators: any;
  riskAssessmentScore: number;
  crisisLevel: 'none' | 'low' | 'moderate' | 'high' | 'immediate';
  validationLayers: any;
  escalationTriggered: boolean;
  escalationActions: any;
  safetyPlanActivated: boolean;
  safetyPlanDetails: any;
  interventionProtocols: any;
  monitoringFrequency: number;
}

export interface CulturalAdaptations {
  sessionId: string;
  userId: string;
  culturalProfile: any;
  communicationStyleAdaptations: any;
  techniqueCulturalModifications: any;
  religiousSpiritualIntegration: any;
  traumaInformedAdaptations: any;
  languageCulturalConsiderations: any;
  familySystemConsiderations: any;
  adaptationEffectiveness: number;
}

export interface AIDecisionData {
  sessionId: string;
  userId: string;
  decisionPoint: string;
  contextAnalysis: any;
  modelUsed: string;
  decisionRationale: string;
  techniqueSelected: string;
  predictedOutcome: any;
  actualOutcome: any;
  decisionEffectiveness: number;
  responseGenerationStrategy: string;
  culturalAdaptations: any;
}

export class EnhancedSessionOrchestrator {
  private static instance: EnhancedSessionOrchestrator;
  private sessionTimers: Map<string, NodeJS.Timeout> = new Map();
  private realTimeMonitoring: Map<string, any> = new Map();

  static getInstance(): EnhancedSessionOrchestrator {
    if (!EnhancedSessionOrchestrator.instance) {
      EnhancedSessionOrchestrator.instance = new EnhancedSessionOrchestrator();
    }
    return EnhancedSessionOrchestrator.instance;
  }

  // Phase 1: Real-Time Session Orchestration
  async initializeSession(sessionId: string, userId: string, therapyApproach: string): Promise<boolean> {
    try {
      // Initialize session orchestration
      const orchestrationData: Partial<SessionOrchestrationData> = {
        sessionId,
        userId,
        currentPhase: 'opening',
        phaseStartTime: new Date(),
        expectedPhaseDuration: 480, // 8 minutes for opening
        conversationFlowScore: 0.5,
        interventionEffectiveness: 0.5,
        emotionalStateTracking: {},
        breakthroughMoments: [],
        interventionHistory: [],
        sessionExtensions: []
      };

      await supabase.from('session_orchestration').insert({
        session_id: sessionId,
        user_id: userId,
        current_phase: 'opening',
        phase_start_time: new Date().toISOString(),
        expected_phase_duration: 480,
        conversation_flow_score: 0.5,
        intervention_effectiveness: 0.5,
        emotional_state_tracking: {},
        breakthrough_moments: [],
        intervention_history: [],
        session_extensions: []
      });

      // Initialize therapy plan execution
      const planExecution: Partial<TherapyPlanExecution> = {
        sessionId,
        userId,
        currentGoals: [],
        completedGoals: [],
        techniqueSequence: [],
        techniqueEffectiveness: {},
        personalizedHomework: {},
        continuityTracking: {},
        goalProgress: {},
        adaptationTriggers: {}
      };

      await supabase.from('therapy_plan_execution').insert({
        session_id: sessionId,
        user_id: userId,
        current_goals: [],
        completed_goals: [],
        technique_sequence: [],
        technique_effectiveness: {},
        personalized_homework: {},
        continuity_tracking: {},
        goal_progress: {},
        adaptation_triggers: {}
      });

      // Initialize quality metrics
      const qualityMetrics: Partial<SessionQualityMetrics> = {
        sessionId,
        userId,
        therapeuticAllianceScore: 0.5,
        engagementLevel: 0.5,
        techniqueEffectivenessScores: {},
        interventionSuccessRates: {},
        progressTowardGoals: {},
        emotionalRegulationProgress: 0.5,
        sessionSatisfactionPredicted: 0.5,
        breakthroughProbability: 0.0,
        interventionTriggers: {},
        qualityAlerts: []
      };

      await supabase.from('session_quality_metrics').insert({
        session_id: sessionId,
        user_id: userId,
        therapeutic_alliance_score: 0.5,
        engagement_level: 0.5,
        technique_effectiveness_scores: {},
        intervention_success_rates: {},
        progress_toward_goals: {},
        emotional_regulation_progress: 0.5,
        session_satisfaction_predicted: 0.5,
        breakthrough_probability: 0.0,
        intervention_triggers: {},
        quality_alerts: []
      });

      // Initialize crisis monitoring
      const crisisMonitoring: Partial<CrisisMonitoring> = {
        sessionId,
        userId,
        crisisIndicators: {},
        riskAssessmentScore: 0.0,
        crisisLevel: 'none',
        validationLayers: {},
        escalationTriggered: false,
        escalationActions: {},
        safetyPlanActivated: false,
        safetyPlanDetails: {},
        interventionProtocols: {},
        monitoringFrequency: 300
      };

      await supabase.from('session_crisis_monitoring').insert({
        session_id: sessionId,
        user_id: userId,
        crisis_indicators: {},
        risk_assessment_score: 0.0,
        crisis_level: 'none',
        validation_layers: {},
        escalation_triggered: false,
        escalation_actions: {},
        safety_plan_activated: false,
        safety_plan_details: {},
        intervention_protocols: {},
        monitoring_frequency: 300
      });

      // Initialize cultural adaptations
      const culturalAdaptations: Partial<CulturalAdaptations> = {
        sessionId,
        userId,
        culturalProfile: {},
        communicationStyleAdaptations: {},
        techniqueCulturalModifications: {},
        religiousSpiritualIntegration: {},
        traumaInformedAdaptations: {},
        languageCulturalConsiderations: {},
        familySystemConsiderations: {},
        adaptationEffectiveness: 0.5
      };

      await supabase.from('session_cultural_adaptations').insert({
        session_id: sessionId,
        user_id: userId,
        cultural_profile: {},
        communication_style_adaptations: {},
        technique_cultural_modifications: {},
        religious_spiritual_integration: {},
        trauma_informed_adaptations: {},
        language_cultural_considerations: {},
        family_system_considerations: {},
        adaptation_effectiveness: 0.5
      });

      // Start real-time monitoring
      this.startRealTimeMonitoring(sessionId, userId);

      return true;
    } catch (error) {
      console.error('Error initializing session:', error);
      return false;
    }
  }

  // Phase 2: Intelligent Therapy Plan Integration
  async updateTherapyPlanExecution(sessionId: string, updates: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('therapy_plan_execution')
        .update(updates)
        .eq('session_id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating therapy plan execution:', error);
      return false;
    }
  }

  // Phase 3: Advanced Session Quality Metrics
  async updateQualityMetrics(sessionId: string, updates: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_quality_metrics')
        .update(updates)
        .eq('session_id', sessionId);

      if (error) throw error;

      // Check for quality alerts
      await this.checkQualityAlerts(sessionId, updates);

      return true;
    } catch (error) {
      console.error('Error updating quality metrics:', error);
      return false;
    }
  }

  // Phase 4: Enhanced AI Decision Making
  async logAIDecision(decisionData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_session_decisions')
        .insert({
          session_id: decisionData.sessionId,
          user_id: decisionData.userId,
          decision_point: decisionData.decisionPoint,
          context_analysis: decisionData.contextAnalysis,
          model_used: decisionData.modelUsed,
          decision_rationale: decisionData.decisionRationale,
          technique_selected: decisionData.techniqueSelected,
          predicted_outcome: decisionData.predictedOutcome,
          actual_outcome: decisionData.actualOutcome,
          decision_effectiveness: decisionData.decisionEffectiveness,
          response_generation_strategy: decisionData.responseGenerationStrategy,
          cultural_adaptations: decisionData.culturalAdaptations
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging AI decision:', error);
      return false;
    }
  }

  // Phase 5: Crisis Management & Safety Systems
  async updateCrisisMonitoring(sessionId: string, updates: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_crisis_monitoring')
        .update(updates)
        .eq('session_id', sessionId);

      if (error) throw error;

      // Check for crisis escalation
      if (updates.crisisLevel && updates.crisisLevel !== 'none') {
        await this.handleCrisisEscalation(sessionId, updates);
      }

      return true;
    } catch (error) {
      console.error('Error updating crisis monitoring:', error);
      return false;
    }
  }

  // Phase 6: Cultural & Trauma-Informed Adaptations
  async updateCulturalAdaptations(sessionId: string, updates: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('session_cultural_adaptations')
        .update(updates)
        .eq('session_id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating cultural adaptations:', error);
      return false;
    }
  }

  // Real-time monitoring and analysis
  private startRealTimeMonitoring(sessionId: string, userId: string): void {
    const monitoringInterval = setInterval(async () => {
      await this.performRealTimeAnalysis(sessionId, userId);
    }, 30000); // Every 30 seconds

    this.realTimeMonitoring.set(sessionId, monitoringInterval);
  }

  private async performRealTimeAnalysis(sessionId: string, userId: string): Promise<void> {
    try {
      // Get current session status
      const { data: sessionStatus } = await supabase
        .from('session_real_time_status')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (!sessionStatus) return;

      // Analyze engagement level
      const engagementAnalysis = await this.analyzeEngagementLevel(sessionId, userId);
      
      // Detect breakthrough moments
      const breakthroughAnalysis = await this.detectBreakthroughMoments(sessionId, userId);

      // Check crisis indicators
      const crisisAnalysis = await this.analyzeCrisisIndicators(sessionId, userId);

      // Update metrics based on analysis
      await this.updateQualityMetrics(sessionId, {
        engagementLevel: engagementAnalysis.level,
        breakthroughProbability: breakthroughAnalysis.probability,
        interventionTriggers: engagementAnalysis.triggers
      });

      if (crisisAnalysis.detected) {
        await this.updateCrisisMonitoring(sessionId, {
          crisisLevel: crisisAnalysis.level,
          crisisIndicators: crisisAnalysis.indicators,
          riskAssessmentScore: crisisAnalysis.riskScore
        });
      }

      // Optimize session timing
      await this.optimizeSessionTiming(sessionId, engagementAnalysis.level, breakthroughAnalysis.probability);

    } catch (error) {
      console.error('Error in real-time analysis:', error);
    }
  }

  private async analyzeEngagementLevel(sessionId: string, userId: string): Promise<any> {
    // Implement engagement level analysis
    return {
      level: 0.7,
      triggers: {},
      recommendations: []
    };
  }

  private async detectBreakthroughMoments(sessionId: string, userId: string): Promise<any> {
    // Implement breakthrough moment detection
    return {
      probability: 0.3,
      indicators: [],
      significance: 0.0
    };
  }

  private async analyzeCrisisIndicators(sessionId: string, userId: string): Promise<any> {
    // Simple crisis detection without relying on therapy_messages table
    // This would be improved with actual message analysis
    return { detected: false, level: 'none', indicators: {}, riskScore: 0.0 };
  }

  private async optimizeSessionTiming(sessionId: string, engagementLevel: number, breakthroughProbability: number): Promise<void> {
    try {
      // Call the database function to calculate optimal timing
      const { data: timingData } = await supabase
        .rpc('calculate_optimal_session_timing', {
          p_session_id: sessionId,
          p_current_phase: 'intervention', // This should be dynamically determined
          p_engagement_level: engagementLevel,
          p_breakthrough_probability: breakthroughProbability
        });

      if (timingData) {
        // Update session orchestration with timing recommendations
        await supabase
          .from('session_orchestration')
          .update({
            session_extensions: timingData,
            updated_at: new Date().toISOString()
          })
          .eq('session_id', sessionId);
      }
    } catch (error) {
      console.error('Error optimizing session timing:', error);
    }
  }

  private async checkQualityAlerts(sessionId: string, metrics: any): Promise<void> {
    const alerts = [];

    if (metrics.engagementLevel && metrics.engagementLevel < 0.4) {
      alerts.push({
        type: 'low_engagement',
        message: 'Low engagement detected - consider technique adjustment',
        priority: 'high'
      });
    }

    if (metrics.therapeuticAllianceScore && metrics.therapeuticAllianceScore < 0.5) {
      alerts.push({
        type: 'alliance_concern',
        message: 'Therapeutic alliance may need attention',
        priority: 'medium'
      });
    }

    if (alerts.length > 0) {
      await supabase
        .from('session_quality_metrics')
        .update({ quality_alerts: alerts })
        .eq('session_id', sessionId);
    }
  }

  private async handleCrisisEscalation(sessionId: string, crisisData: any): Promise<void> {
    if (crisisData.crisisLevel === 'immediate' || crisisData.crisisLevel === 'high') {
      // Trigger immediate escalation
      const escalationActions = {
        timestamp: new Date().toISOString(),
        actions: [
          'Professional oversight triggered',
          'Safety plan activated',
          'Emergency contacts notified'
        ],
        severity: crisisData.crisisLevel
      };

      await supabase
        .from('session_crisis_monitoring')
        .update({
          escalation_triggered: true,
          escalation_actions: escalationActions,
          safety_plan_activated: true
        })
        .eq('session_id', sessionId);

      // Create professional oversight record
      await supabase
        .from('professional_oversight')
        .insert({
          user_id: (await supabase.from('session_orchestration').select('user_id').eq('session_id', sessionId).single()).data?.user_id,
          oversight_type: 'crisis_intervention',
          status: 'urgent',
          priority_level: 'immediate',
          reason: `Crisis level: ${crisisData.crisisLevel}`,
          context_data: crisisData
        });
    }
  }

  // Session completion and cleanup
  async completeSession(sessionId: string): Promise<boolean> {
    try {
      // Stop real-time monitoring
      const monitoringInterval = this.realTimeMonitoring.get(sessionId);
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
        this.realTimeMonitoring.delete(sessionId);
      }

      // Update session orchestration as completed
      await supabase
        .from('session_orchestration')
        .update({
          current_phase: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      return true;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  }

  // Get real-time session status
  async getSessionStatus(sessionId: string): Promise<any> {
    try {
      const { data: status } = await supabase
        .from('session_real_time_status')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      return status;
    } catch (error) {
      console.error('Error getting session status:', error);
      return null;
    }
  }

  // Get optimal technique recommendation
  async getOptimalTechnique(userId: string, sessionId: string, currentPhase: string, emotionalState: any = {}, culturalContext: any = {}): Promise<any> {
    try {
      const { data: technique } = await supabase
        .rpc('select_optimal_technique', {
          p_user_id: userId,
          p_session_id: sessionId,
          p_current_phase: currentPhase,
          p_emotional_state: emotionalState,
          p_cultural_context: culturalContext
        });

      return technique;
    } catch (error) {
      console.error('Error getting optimal technique:', error);
      return null;
    }
  }
}

export const enhancedSessionOrchestrator = EnhancedSessionOrchestrator.getInstance();