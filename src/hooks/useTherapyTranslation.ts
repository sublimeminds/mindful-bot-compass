import { useState, useEffect, useCallback } from 'react';
import { useEnhancedI18n } from './useEnhancedI18n';
import { TherapyTranslationService, TherapyTranslationData } from '@/services/therapyTranslationService';
import { CulturalAiTranslationService, CulturalTranslationData } from '@/services/culturalAiTranslationService';

export interface UseTherapyTranslationOptions {
  autoTranslate?: boolean;
  culturalContext?: any;
}

export function useTherapyTranslation(options: UseTherapyTranslationOptions = {}) {
  const { currentLanguage } = useEnhancedI18n();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, any>>(new Map());

  // Translate therapy plan with caching
  const translateTherapyPlan = useCallback(async (
    therapyPlanId: string,
    originalPlan: any,
    targetLanguage?: string
  ): Promise<TherapyTranslationData | null> => {
    const lang = targetLanguage || currentLanguage.code;
    const cacheKey = `therapy_plan_${therapyPlanId}_${lang}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      setIsTranslating(true);
      
      // Check if translation already exists
      let translation = await TherapyTranslationService.getTherapyPlanTranslation(
        therapyPlanId, 
        lang
      );

      // If no translation exists and we should auto-translate
      if (!translation && (options.autoTranslate || lang !== 'en')) {
        translation = await TherapyTranslationService.translateTherapyPlan(
          therapyPlanId,
          originalPlan,
          lang
        );
      }

      if (translation) {
        setTranslationCache(prev => new Map(prev.set(cacheKey, translation)));
      }

      return translation;
    } catch (error) {
      console.error('Error translating therapy plan:', error);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage.code, options.autoTranslate, translationCache]);

  // Translate cultural AI content
  const translateCulturalContent = useCallback(async (
    contentId: string,
    originalContent: any,
    targetLanguage?: string
  ): Promise<CulturalTranslationData | null> => {
    const lang = targetLanguage || currentLanguage.code;
    const cacheKey = `cultural_content_${contentId}_${lang}`;
    
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    try {
      setIsTranslating(true);
      
      let translation = await CulturalAiTranslationService.getCulturalTranslation(
        contentId,
        lang
      );

      if (!translation && (options.autoTranslate || lang !== 'en')) {
        translation = await CulturalAiTranslationService.translateCulturalContent(
          contentId,
          originalContent,
          lang,
          options.culturalContext
        );
      }

      if (translation) {
        setTranslationCache(prev => new Map(prev.set(cacheKey, translation)));
      }

      return translation;
    } catch (error) {
      console.error('Error translating cultural content:', error);
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, [currentLanguage.code, options.autoTranslate, options.culturalContext, translationCache]);

  // Get culturally adapted therapy plan
  const getAdaptedTherapyPlan = useCallback(async (
    therapyPlanId: string,
    originalPlan: any
  ) => {
    if (currentLanguage.code === 'en') {
      return originalPlan;
    }

    const translation = await translateTherapyPlan(therapyPlanId, originalPlan);
    if (!translation) {
      return originalPlan;
    }

    return {
      ...originalPlan,
      title: translation.title || originalPlan.title,
      description: translation.description || originalPlan.description,
      goals: translation.goals || originalPlan.goals,
      milestones: translation.milestones || originalPlan.milestones,
      focus_areas: translation.focus_areas || originalPlan.focus_areas,
      current_phase: translation.current_phase || originalPlan.current_phase,
      cultural_adaptations: translation.cultural_adaptations,
      _isTranslated: true,
      _targetLanguage: currentLanguage.code
    };
  }, [currentLanguage.code, translateTherapyPlan]);

  // Get culturally adapted AI content
  const getAdaptedCulturalContent = useCallback(async (
    contentId: string,
    originalContent: any
  ) => {
    if (currentLanguage.code === 'en') {
      return originalContent;
    }

    const translation = await translateCulturalContent(contentId, originalContent);
    if (!translation) {
      return originalContent;
    }

    return {
      ...originalContent,
      ...translation.translated_content,
      cultural_adaptations: translation.cultural_adaptations,
      regional_variations: translation.regional_variations,
      _isTranslated: true,
      _targetLanguage: currentLanguage.code,
      _qualityScore: translation.quality_score
    };
  }, [currentLanguage.code, translateCulturalContent]);

  // Adapt AI response culturally
  const adaptAiResponse = useCallback(async (
    response: string,
    targetLanguage?: string
  ): Promise<string> => {
    const lang = targetLanguage || currentLanguage.code;
    if (lang === 'en') {
      return response;
    }

    try {
      return await CulturalAiTranslationService.adaptAiResponseCulturally(
        response,
        options.culturalContext,
        lang
      );
    } catch (error) {
      console.error('Error adapting AI response:', error);
      return response;
    }
  }, [currentLanguage.code, options.culturalContext]);

  // Translate therapeutic text with terminology
  const translateTherapeuticText = useCallback(async (
    text: string,
    targetLanguage?: string
  ): Promise<string> => {
    const lang = targetLanguage || currentLanguage.code;
    if (lang === 'en') {
      return text;
    }

    try {
      return await TherapyTranslationService.translateTherapeuticText(text, lang);
    } catch (error) {
      console.error('Error translating therapeutic text:', error);
      return text;
    }
  }, [currentLanguage.code]);

  // Clear translation cache
  const clearTranslationCache = useCallback(() => {
    setTranslationCache(new Map());
  }, []);

  // Effect to clear cache when language changes
  useEffect(() => {
    clearTranslationCache();
  }, [currentLanguage.code, clearTranslationCache]);

  return {
    // State
    isTranslating,
    currentLanguage: currentLanguage.code,
    
    // Translation functions
    translateTherapyPlan,
    translateCulturalContent,
    getAdaptedTherapyPlan,
    getAdaptedCulturalContent,
    adaptAiResponse,
    translateTherapeuticText,
    
    // Utility functions
    clearTranslationCache,
    
    // Status
    hasCachedTranslations: translationCache.size > 0
  };
}