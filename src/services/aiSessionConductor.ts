import { supabase } from '@/integrations/supabase/client';
import { TherapyPlaybook, SessionPhase, TherapyPlaybookService } from './therapyPlaybook';

export interface SessionState {
  id: string;
  userId: string;
  playbook: TherapyPlaybook;
  currentPhase: SessionPhase;
  startTime: Date;
  phaseStartTime: Date;
  elapsedMinutes: number;
  phaseElapsedMinutes: number;
  messageCount: number;
  userEngagement: 'low' | 'medium' | 'high';
  criteriaMet: string[];
  isTransitioning: boolean;
  sessionNotes: string[];
  mood: {
    initial?: number;
    current?: number;
    progression: number[];
  };
}

export interface SessionMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  phaseId: string;
  emotion?: string;
  engagement?: number;
}

export interface TherapeuticResponse {
  content: string;
  techniques: string[];
  phase: string;
  nextAction?: 'continue' | 'transition' | 'extend_phase';
  engagementBoost?: boolean;
  criteriaMet?: string[];
}

export class AISessionConductor {
  private sessionState: SessionState | null = null;
  private responseDelay = 2000; // 2 second delay to simulate human thinking
  private messages: SessionMessage[] = [];

  async startSession(
    userId: string, 
    therapyApproach: string,
    initialMood?: number
  ): Promise<SessionState> {
    const playbook = TherapyPlaybookService.getPlaybookForApproach(therapyApproach);
    const now = new Date();
    
    this.sessionState = {
      id: crypto.randomUUID(),
      userId,
      playbook,
      currentPhase: playbook.phases[0],
      startTime: now,
      phaseStartTime: now,
      elapsedMinutes: 0,
      phaseElapsedMinutes: 0,
      messageCount: 0,
      userEngagement: 'medium',
      criteriaMet: [],
      isTransitioning: false,
      sessionNotes: [],
      mood: {
        initial: initialMood,
        current: initialMood,
        progression: initialMood ? [initialMood] : []
      }
    };

    // Store session in database
    await this.saveSessionState();
    
    return this.sessionState;
  }

  async sendMessage(content: string): Promise<TherapeuticResponse> {
    if (!this.sessionState) {
      throw new Error('No active session');
    }

    // Update session timing
    this.updateSessionTiming();
    
    // Store user message
    const userMessage: SessionMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date(),
      phaseId: this.sessionState.currentPhase.id,
      engagement: this.analyzeUserEngagement(content)
    };
    
    this.messages.push(userMessage);
    this.sessionState.messageCount++;

    // Analyze user engagement and mood
    await this.analyzeUserState(content);
    
    // Check if phase transition is needed
    if (this.shouldTransitionPhase()) {
      await this.transitionToNextPhase();
    }

    // Generate therapeutic response
    const response = await this.generateTherapeuticResponse(content);
    
    // Add natural delay to simulate human therapist
    await this.addTherapeuticDelay();
    
    // Store AI response
    const aiMessage: SessionMessage = {
      id: crypto.randomUUID(),
      content: response.content,
      sender: 'assistant',
      timestamp: new Date(),
      phaseId: this.sessionState.currentPhase.id
    };
    
    this.messages.push(aiMessage);
    
    // Update session state
    await this.saveSessionState();
    
    return response;
  }

  async endSession(): Promise<{
    summary: string;
    insights: string[];
    progress: string[];
    homework: string[];
  }> {
    if (!this.sessionState) {
      throw new Error('No active session');
    }

    // Generate session summary
    const summary = await this.generateSessionSummary();
    
    // Mark session as complete
    await this.saveSessionCompletion(summary);
    
    return summary;
  }

  private updateSessionTiming(): void {
    if (!this.sessionState) return;
    
    const now = new Date();
    this.sessionState.elapsedMinutes = Math.floor(
      (now.getTime() - this.sessionState.startTime.getTime()) / (1000 * 60)
    );
    this.sessionState.phaseElapsedMinutes = Math.floor(
      (now.getTime() - this.sessionState.phaseStartTime.getTime()) / (1000 * 60)
    );
  }

  private analyzeUserEngagement(content: string): number {
    // Simple engagement analysis based on message characteristics
    const wordCount = content.split(' ').length;
    const hasEmotionalWords = /feel|feeling|emotion|sad|happy|angry|worried|anxious|excited/i.test(content);
    const hasPersonalReflection = /i think|i believe|i realize|i understand|makes sense/i.test(content);
    
    let engagement = 0.5; // Base engagement
    
    if (wordCount > 10) engagement += 0.2;
    if (wordCount > 20) engagement += 0.1;
    if (hasEmotionalWords) engagement += 0.2;
    if (hasPersonalReflection) engagement += 0.3;
    
    return Math.min(1.0, engagement);
  }

  private async analyzeUserState(content: string): Promise<void> {
    if (!this.sessionState) return;

    // Analyze mood indicators in the message
    const moodIndicators = this.extractMoodIndicators(content);
    if (moodIndicators.score !== null) {
      this.sessionState.mood.current = moodIndicators.score;
      this.sessionState.mood.progression.push(moodIndicators.score);
    }

    // Update engagement level
    const avgEngagement = this.messages
      .filter(m => m.sender === 'user' && m.engagement)
      .reduce((sum, m) => sum + (m.engagement || 0), 0) / 
      Math.max(1, this.messages.filter(m => m.sender === 'user').length);
    
    if (avgEngagement > 0.7) this.sessionState.userEngagement = 'high';
    else if (avgEngagement > 0.4) this.sessionState.userEngagement = 'medium';
    else this.sessionState.userEngagement = 'low';

    // Check for phase completion criteria
    await this.checkPhaseCompletionCriteria(content);
  }

  private extractMoodIndicators(content: string): { score: number | null; indicators: string[] } {
    const positiveWords = ['good', 'better', 'happy', 'calm', 'peaceful', 'confident', 'hopeful'];
    const negativeWords = ['bad', 'worse', 'sad', 'anxious', 'worried', 'stressed', 'overwhelmed'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    const indicators: string[] = [];
    
    const lowerContent = content.toLowerCase();
    
    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) {
        positiveCount++;
        indicators.push(word);
      }
    });
    
    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) {
        negativeCount++;
        indicators.push(word);
      }
    });
    
    if (positiveCount === 0 && negativeCount === 0) {
      return { score: null, indicators };
    }
    
    // Calculate mood score (1-10 scale)
    const ratio = positiveCount / Math.max(1, positiveCount + negativeCount);
    const score = Math.round(1 + (ratio * 9));
    
    return { score, indicators };
  }

  private async checkPhaseCompletionCriteria(content: string): Promise<void> {
    if (!this.sessionState) return;

    const phase = this.sessionState.currentPhase;
    const newCriteriaMet: string[] = [];

    // Check criteria based on phase objectives and user responses
    phase.transitionCriteria.forEach(criteria => {
      if (this.evaluateCriteria(criteria, content)) {
        if (!this.sessionState!.criteriaMet.includes(criteria)) {
          newCriteriaMet.push(criteria);
        }
      }
    });

    this.sessionState.criteriaMet.push(...newCriteriaMet);
  }

  private evaluateCriteria(criteria: string, content: string): boolean {
    const lowerCriteria = criteria.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Simple criteria evaluation - can be enhanced with AI
    if (lowerCriteria.includes('mood assessed')) {
      return /feel|mood|emotion/i.test(content) && content.length > 20;
    }
    if (lowerCriteria.includes('goals identified')) {
      return /want|goal|hope|work on|focus/i.test(content);
    }
    if (lowerCriteria.includes('rapport established')) {
      return this.sessionState!.messageCount >= 3;
    }
    if (lowerCriteria.includes('progress acknowledged')) {
      return /better|progress|improved|helped/i.test(content);
    }

    return false;
  }

  private shouldTransitionPhase(): boolean {
    if (!this.sessionState) return false;

    return TherapyPlaybookService.shouldTransitionPhase(
      this.sessionState.currentPhase,
      this.sessionState.elapsedMinutes,
      Math.floor((this.sessionState.phaseStartTime.getTime() - this.sessionState.startTime.getTime()) / (1000 * 60)),
      this.sessionState.userEngagement,
      this.sessionState.criteriaMet
    );
  }

  private async transitionToNextPhase(): Promise<void> {
    if (!this.sessionState) return;

    const nextPhase = TherapyPlaybookService.getNextPhase(
      this.sessionState.playbook, 
      this.sessionState.currentPhase.id
    );

    if (nextPhase) {
      this.sessionState.currentPhase = nextPhase;
      this.sessionState.phaseStartTime = new Date();
      this.sessionState.criteriaMet = [];
      this.sessionState.isTransitioning = true;
      
      // Add transition note
      this.sessionState.sessionNotes.push(
        `Transitioned to ${nextPhase.name} phase at ${this.sessionState.elapsedMinutes} minutes`
      );
    }
  }

  private async generateTherapeuticResponse(userMessage: string): Promise<TherapeuticResponse> {
    if (!this.sessionState) {
      throw new Error('No active session');
    }

    const phase = this.sessionState.currentPhase;
    const context = this.buildTherapeuticContext();

    try {
      const response = await supabase.functions.invoke('ai-therapy-chat-enhanced', {
        body: {
          message: userMessage,
          userId: this.sessionState.userId,
          sessionId: this.sessionState.id,
          therapistId: 'ai-conductor',
          phase: phase.name,
          phaseObjectives: phase.objectives,
          sessionContext: context,
          elapsedMinutes: this.sessionState.elapsedMinutes,
          userEngagement: this.sessionState.userEngagement,
          currentMood: this.sessionState.mood.current
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return {
        content: response.data.response,
        techniques: phase.techniques,
        phase: phase.name,
        nextAction: this.determineNextAction(),
        criteriaMet: this.sessionState.criteriaMet
      };
    } catch (error) {
      console.error('Error generating therapeutic response:', error);
      
      // Fallback response using phase prompts
      const fallbackPrompt = phase.prompts[Math.floor(Math.random() * phase.prompts.length)];
      return {
        content: fallbackPrompt,
        techniques: phase.techniques,
        phase: phase.name,
        nextAction: 'continue'
      };
    }
  }

  private buildTherapeuticContext(): string {
    if (!this.sessionState) return '';

    const recentMessages = this.messages.slice(-6); // Last 6 messages for context
    const context = recentMessages.map(m => 
      `${m.sender}: ${m.content}`
    ).join('\n');

    return `Session Phase: ${this.sessionState.currentPhase.name}
Session Duration: ${this.sessionState.elapsedMinutes} minutes
User Engagement: ${this.sessionState.userEngagement}
Current Mood: ${this.sessionState.mood.current || 'Unknown'}
Recent Conversation:
${context}`;
  }

  private determineNextAction(): 'continue' | 'transition' | 'extend_phase' {
    if (!this.sessionState) return 'continue';

    if (this.sessionState.isTransitioning) {
      this.sessionState.isTransitioning = false;
      return 'transition';
    }

    if (this.shouldTransitionPhase()) {
      return 'transition';
    }

    // Extend phase if user engagement is high and we're making progress
    if (this.sessionState.userEngagement === 'high' && 
        this.sessionState.criteriaMet.length < this.sessionState.currentPhase.transitionCriteria.length) {
      return 'extend_phase';
    }

    return 'continue';
  }

  private async addTherapeuticDelay(): Promise<void> {
    // Vary delay based on response complexity and phase
    const baseDelay = this.responseDelay;
    const variability = Math.random() * 1000; // 0-1 second variation
    const totalDelay = baseDelay + variability;
    
    await new Promise(resolve => setTimeout(resolve, totalDelay));
  }

  private async generateSessionSummary(): Promise<{
    summary: string;
    insights: string[];
    progress: string[];
    homework: string[];
  }> {
    if (!this.sessionState) {
      throw new Error('No active session');
    }

    // Generate AI-powered session summary
    try {
      const response = await supabase.functions.invoke('generate-session-analysis', {
        body: {
          sessionId: this.sessionState.id,
          messages: this.messages,
          playbook: this.sessionState.playbook.name,
          sessionDuration: this.sessionState.elapsedMinutes,
          moodProgression: this.sessionState.mood.progression,
          phases: this.sessionState.playbook.phases.map(p => p.name),
          notes: this.sessionState.sessionNotes
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error generating session summary:', error);
      
      // Fallback summary
      return {
        summary: `Completed ${this.sessionState.playbook.name} session lasting ${this.sessionState.elapsedMinutes} minutes.`,
        insights: ['Session completed successfully with good engagement.'],
        progress: ['Participated actively in therapy session.'],
        homework: ['Continue practicing techniques discussed in session.']
      };
    }
  }

  private async saveSessionState(): Promise<void> {
    if (!this.sessionState) return;

    try {
      await supabase
        .from('therapy_sessions')
        .upsert({
          id: this.sessionState.id,
          user_id: this.sessionState.userId,
          start_time: this.sessionState.startTime.toISOString(),
          current_phase: this.sessionState.currentPhase.id,
          elapsed_minutes: this.sessionState.elapsedMinutes,
          message_count: this.sessionState.messageCount,
          user_engagement: this.sessionState.userEngagement,
          current_mood: this.sessionState.mood.current,
          session_notes: this.sessionState.sessionNotes,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving session state:', error);
    }
  }

  private async saveSessionCompletion(summary: any): Promise<void> {
    if (!this.sessionState) return;

    try {
      await supabase
        .from('therapy_sessions')
        .update({
          end_time: new Date().toISOString(),
          notes: summary.summary,
          insights: summary.insights,
          homework_assigned: summary.homework,
          mood_after: this.sessionState.mood.current,
          session_status: 'completed'
        })
        .eq('id', this.sessionState.id);
    } catch (error) {
      console.error('Error saving session completion:', error);
    }
  }

  // Getters for current session state
  getCurrentSession(): SessionState | null {
    return this.sessionState;
  }

  getMessages(): SessionMessage[] {
    return this.messages;
  }

  getSessionProgress(): number {
    if (!this.sessionState) return 0;
    return Math.min(100, (this.sessionState.elapsedMinutes / this.sessionState.playbook.totalDuration) * 100);
  }

  getPhaseProgress(): number {
    if (!this.sessionState) return 0;
    return TherapyPlaybookService.getPhaseProgress(
      this.sessionState.playbook, 
      this.sessionState.elapsedMinutes
    );
  }
}