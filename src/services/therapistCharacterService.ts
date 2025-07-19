import { supabase } from "@/integrations/supabase/client";
import { 
  TherapistCharacterProfile, 
  TherapistClientRelationship, 
  TherapistNoteStyle, 
  TherapistExpression,
  PersonalizedResponse,
  SessionNote
} from "@/types/therapist-character";

export class TherapistCharacterService {
  // Get enhanced character profile for a therapist
  static async getCharacterProfile(therapistId: string): Promise<TherapistCharacterProfile | null> {
    const { data, error } = await supabase
      .from('therapist_character_profiles')
      .select('*')
      .eq('therapist_id', therapistId)
      .single();

    if (error || !data) return null;
    return data as TherapistCharacterProfile;
  }

  // Get or create therapist-client relationship
  static async getTherapistClientRelationship(
    userId: string, 
    therapistId: string
  ): Promise<TherapistClientRelationship | null> {
    const { data, error } = await supabase
      .from('therapist_client_relationships')
      .select('*')
      .eq('user_id', userId)
      .eq('therapist_id', therapistId)
      .single();

    if (error && error.code !== 'PGRST116') return null;
    
    // If no relationship exists, create one
    if (!data) {
      return await this.createTherapistClientRelationship(userId, therapistId);
    }
    
    return data as TherapistClientRelationship;
  }

  // Create new therapist-client relationship
  static async createTherapistClientRelationship(
    userId: string, 
    therapistId: string
  ): Promise<TherapistClientRelationship | null> {
    const { data, error } = await supabase
      .from('therapist_client_relationships')
      .insert({
        user_id: userId,
        therapist_id: therapistId,
        relationship_stage: 'initial',
        rapport_level: 0.1,
        communication_preferences: {},
        shared_memories: [],
        therapeutic_progress: {
          key_breakthroughs: [],
          current_focus_areas: [],
          client_growth_observations: [],
          therapeutic_alliance_strength: 0.1
        },
        last_interaction: new Date().toISOString(),
        total_sessions: 0
      })
      .select()
      .single();

    if (error) return null;
    return data as TherapistClientRelationship;
  }

  // Update relationship after session
  static async updateRelationshipAfterSession(
    userId: string, 
    therapistId: string, 
    sessionData: {
      newMemories?: Array<any>;
      progressUpdates?: Record<string, any>;
      rapportChange?: number;
    }
  ): Promise<void> {
    const relationship = await this.getTherapistClientRelationship(userId, therapistId);
    if (!relationship) return;

    const updatedData: Partial<TherapistClientRelationship> = {
      last_interaction: new Date().toISOString(),
      total_sessions: relationship.total_sessions + 1,
      rapport_level: Math.min(1.0, relationship.rapport_level + (sessionData.rapportChange || 0.1))
    };

    if (sessionData.newMemories?.length) {
      updatedData.shared_memories = [
        ...relationship.shared_memories,
        ...sessionData.newMemories
      ];
    }

    if (sessionData.progressUpdates) {
      updatedData.therapeutic_progress = {
        ...relationship.therapeutic_progress,
        ...sessionData.progressUpdates
      };
    }

    await supabase
      .from('therapist_client_relationships')
      .update(updatedData)
      .eq('user_id', userId)
      .eq('therapist_id', therapistId);
  }

  // Get therapist note style
  static async getTherapistNoteStyle(therapistId: string): Promise<TherapistNoteStyle | null> {
    const { data, error } = await supabase
      .from('therapist_note_styles')
      .select('*')
      .eq('therapist_id', therapistId)
      .single();

    if (error || !data) return null;
    return data as TherapistNoteStyle;
  }

  // Get contextual expressions for therapist
  static async getTherapistExpressions(
    therapistId: string, 
    contextType: string, 
    emotionalContext?: string
  ): Promise<TherapistExpression[]> {
    let query = supabase
      .from('therapist_expressions')
      .select('*')
      .eq('therapist_id', therapistId)
      .eq('context_type', contextType);

    if (emotionalContext) {
      query = query.eq('emotional_context', emotionalContext);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as TherapistExpression[];
  }

  // Generate personalized response based on character and relationship
  static async generatePersonalizedResponse(
    therapistId: string,
    userId: string,
    context: {
      sessionPhase: string;
      userMessage: string;
      emotionalState: string;
      sessionHistory?: Array<any>;
    }
  ): Promise<PersonalizedResponse> {
    const [character, relationship, expressions] = await Promise.all([
      this.getCharacterProfile(therapistId),
      this.getTherapistClientRelationship(userId, therapistId),
      this.getTherapistExpressions(therapistId, context.sessionPhase, context.emotionalState)
    ]);

    // Build personalized response based on character traits
    const response = this.buildCharacterResponse(
      character,
      relationship,
      expressions,
      context
    );

    return response;
  }

  // Create personalized session notes
  static async createPersonalizedSessionNote(
    sessionId: string,
    therapistId: string,
    userId: string,
    sessionData: {
      observations: string[];
      keyMoments: string[];
      interventions: string[];
      clientResponses: string[];
      effectiveness: number;
      engagement: number;
    }
  ): Promise<SessionNote | null> {
    const noteStyle = await this.getTherapistNoteStyle(therapistId);
    if (!noteStyle) return null;

    const personalizedNote = this.formatNotesInTherapistStyle(noteStyle, sessionData);

    // In a real implementation, this would be stored in a session_notes table
    // For now, we'll return the formatted note
    const note: SessionNote = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      therapist_id: therapistId,
      user_id: userId,
      note_content: {
        observations: personalizedNote.observations,
        key_moments: personalizedNote.keyMoments,
        therapeutic_interventions: personalizedNote.interventions,
        client_responses: personalizedNote.clientResponses,
        homework_assigned: personalizedNote.homework,
        next_session_focus: personalizedNote.nextFocus
      },
      therapist_reflections: personalizedNote.reflections,
      progress_assessment: {
        session_effectiveness: sessionData.effectiveness,
        client_engagement: sessionData.engagement,
        therapeutic_alliance: 0.8, // This would be calculated
        goal_progress: {} // This would be based on specific goals
      },
      documentation_style: noteStyle.note_taking_style,
      created_at: new Date().toISOString()
    };

    return note;
  }

  // Private helper methods
  private static buildCharacterResponse(
    character: TherapistCharacterProfile | null,
    relationship: TherapistClientRelationship | null,
    expressions: TherapistExpression[],
    context: any
  ): PersonalizedResponse {
    if (!character) {
      return {
        content: "I'm here to support you through this.",
        tone: "supportive",
        therapeutic_technique: "active_listening"
      };
    }

    // Select appropriate signature phrase
    const phrase = character.signature_phrases[
      Math.floor(Math.random() * character.signature_phrases.length)
    ];

    // Adapt response based on relationship stage
    let adaptedContent = phrase;
    if (relationship) {
      if (relationship.relationship_stage === 'initial') {
        adaptedContent = `As we're getting to know each other, ${phrase.toLowerCase()}`;
      } else if (relationship.shared_memories.length > 0) {
        adaptedContent = `Remembering our previous conversations, ${phrase.toLowerCase()}`;
      }
    }

    return {
      content: adaptedContent,
      tone: character.speech_patterns.tone || "warm_professional",
      therapeutic_technique: this.selectTherapeuticTechnique(character, context),
      cultural_adaptation: this.applyCulturalAdaptation(character, relationship),
      relationship_context: this.buildRelationshipContext(relationship)
    };
  }

  private static selectTherapeuticTechnique(
    character: TherapistCharacterProfile,
    context: any
  ): string {
    // Select technique based on character's approach and context
    const philosophy = character.therapy_philosophy.toLowerCase();
    
    if (philosophy.includes('cbt')) return 'cognitive_restructuring';
    if (philosophy.includes('mindfulness')) return 'mindfulness_based';
    if (philosophy.includes('strength')) return 'strength_based';
    if (philosophy.includes('validation')) return 'validation_therapy';
    
    return 'active_listening';
  }

  private static applyCulturalAdaptation(
    character: TherapistCharacterProfile,
    relationship: TherapistClientRelationship | null
  ): Record<string, any> {
    const adaptations: Record<string, any> = {};
    
    if (character.speech_patterns.cultural_references) {
      adaptations.cultural_references = character.speech_patterns.cultural_references;
    }
    
    if (relationship?.communication_preferences) {
      adaptations.communication_style = relationship.communication_preferences;
    }

    return adaptations;
  }

  private static buildRelationshipContext(
    relationship: TherapistClientRelationship | null
  ): Record<string, any> {
    if (!relationship) return {};

    return {
      rapport_level: relationship.rapport_level,
      relationship_stage: relationship.relationship_stage,
      total_sessions: relationship.total_sessions,
      recent_memories: relationship.shared_memories.slice(-3)
    };
  }

  private static formatNotesInTherapistStyle(
    noteStyle: TherapistNoteStyle,
    sessionData: any
  ): any {
    const formatted: any = {
      observations: sessionData.observations,
      keyMoments: sessionData.keyMoments,
      interventions: sessionData.interventions,
      clientResponses: sessionData.clientResponses
    };

    // Format based on therapist's note-taking style
    switch (noteStyle.note_taking_style) {
      case 'holistic_narrative':
        formatted.reflections = this.createHolisticNarrative(sessionData, noteStyle);
        formatted.homework = this.createMindfulnessHomework(sessionData);
        break;
      case 'strength_based_structured':
        formatted.reflections = this.createStrengthBasedReflection(sessionData, noteStyle);
        formatted.homework = this.createActionOrientedHomework(sessionData);
        break;
      default:
        formatted.reflections = this.createStandardReflection(sessionData);
        formatted.homework = this.createGeneralHomework(sessionData);
    }

    formatted.nextFocus = this.determineNextSessionFocus(noteStyle, sessionData);
    return formatted;
  }

  private static createHolisticNarrative(sessionData: any, noteStyle: TherapistNoteStyle): string {
    return `Today's session revealed ${sessionData.keyMoments[0] || 'important insights'} about the client's emotional landscape. The client demonstrated ${sessionData.clientResponses[0] || 'openness'} when exploring mindfulness practices. Body awareness and cultural context were integrated throughout our exploration.`;
  }

  private static createStrengthBasedReflection(sessionData: any, noteStyle: TherapistNoteStyle): string {
    return `Client showed remarkable resilience in ${sessionData.keyMoments[0] || 'challenging areas'}. Strengths observed include ${sessionData.clientResponses[0] || 'willingness to engage'}. Social connections and practical coping skills were emphasized.`;
  }

  private static createStandardReflection(sessionData: any): string {
    return `Session progressed well with ${sessionData.effectiveness * 100}% effectiveness. Client engagement was ${sessionData.engagement * 100}%. Key therapeutic interventions focused on ${sessionData.interventions[0] || 'support and validation'}.`;
  }

  private static createMindfulnessHomework(sessionData: any): string[] {
    return [
      "Practice 10 minutes of daily mindfulness meditation",
      "Complete mood tracking with body awareness notes",
      "Reflect on cultural values that support wellbeing"
    ];
  }

  private static createActionOrientedHomework(sessionData: any): string[] {
    return [
      "Identify three personal strengths to leverage this week",
      "Connect with one supportive person in your social network",
      "Practice one practical coping skill daily"
    ];
  }

  private static createGeneralHomework(sessionData: any): string[] {
    return [
      "Continue practicing techniques discussed in session",
      "Journal about insights and observations",
      "Prepare topics for next session"
    ];
  }

  private static determineNextSessionFocus(noteStyle: TherapistNoteStyle, sessionData: any): string[] {
    const focusAreas = noteStyle.focus_areas;
    return focusAreas.slice(0, 3); // Return top 3 focus areas
  }
}