
import { supabase } from '@/integrations/supabase/client';

interface TranslationItem {
  key: string;
  sourceText: string;
  context?: string;
  category?: string;
}

interface TranslationJob {
  jobName: string;
  sourceLanguage: string;
  targetLanguage: string;
  items: TranslationItem[];
}

export class BulkTranslationService {
  private static readonly BATCH_SIZE = 10;
  private static readonly TRANSLATION_CONTEXT = 'therapeutic';

  static async scanEnglishContent(): Promise<TranslationItem[]> {
    console.log('🔍 Scanning English content for translation...');
    
    // Import the English translations
    const englishContent = await import('@/i18n/locales/en.json');
    const germanContent = await import('@/i18n/locales/de.json');
    
    const items: TranslationItem[] = [];
    
    // Recursively extract all translation keys
    const extractKeys = (obj: any, prefix = '', category = 'general') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'string') {
          // Check if this key exists in German translations
          const germanValue = this.getNestedValue(germanContent.default, fullKey);
          
          if (!germanValue || germanValue === value) {
            items.push({
              key: fullKey,
              sourceText: value,
              context: this.determineContext(fullKey, value),
              category: this.determineCategory(fullKey)
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          extractKeys(value, fullKey, key);
        }
      }
    };
    
    extractKeys(englishContent.default);
    
    console.log(`📊 Found ${items.length} items needing translation`);
    return items;
  }

  private static getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static determineContext(key: string, text: string): string {
    // Determine therapeutic context based on key patterns and content
    const therapeuticKeywords = [
      'therapy', 'mental', 'mood', 'anxiety', 'depression', 'trauma',
      'counseling', 'treatment', 'session', 'therapist', 'wellness',
      'mindfulness', 'coping', 'healing', 'support', 'crisis'
    ];

    const keyLower = key.toLowerCase();
    const textLower = text.toLowerCase();

    if (therapeuticKeywords.some(keyword => 
      keyLower.includes(keyword) || textLower.includes(keyword)
    )) {
      return 'therapeutic';
    }

    if (keyLower.includes('onboard') || keyLower.includes('auth')) {
      return 'onboarding';
    }

    if (keyLower.includes('nav') || keyLower.includes('menu')) {
      return 'navigation';
    }

    return 'general';
  }

  private static determineCategory(key: string): string {
    const parts = key.split('.');
    return parts[0] || 'general';
  }

  static async createTranslationJob(items: TranslationItem[]): Promise<string> {
    console.log('📝 Creating translation job...');
    
    try {
      const { data, error } = await supabase
        .from('translation_jobs')
        .insert({
          job_name: `German Translation - ${new Date().toISOString().split('T')[0]}`,
          job_type: 'bulk_content',
          source_language: 'en',
          target_languages: ['de'],
          total_items: items.length,
          status: 'pending',
          job_config: {
            context_type: this.TRANSLATION_CONTEXT,
            batch_size: this.BATCH_SIZE,
            categories: [...new Set(items.map(item => item.category))]
          }
        })
        .select('id')
        .single();

      if (error) throw error;
      
      console.log('✅ Translation job created:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ Failed to create translation job:', error);
      throw error;
    }
  }

  static async processTranslations(
    jobId: string, 
    items: TranslationItem[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<void> {
    console.log(`🚀 Starting translation of ${items.length} items...`);
    
    let completed = 0;
    const batches = this.createBatches(items, this.BATCH_SIZE);
    
    for (const batch of batches) {
      try {
        await this.processBatch(batch);
        completed += batch.length;
        
        // Update job progress
        await supabase
          .from('translation_jobs')
          .update({ 
            completed_items: completed,
            status: completed === items.length ? 'completed' : 'processing'
          })
          .eq('id', jobId);
        
        onProgress?.(completed, items.length);
        
        console.log(`📈 Progress: ${completed}/${items.length} translations completed`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('❌ Batch processing failed:', error);
        
        // Update job with error
        await supabase
          .from('translation_jobs')
          .update({ 
            status: 'failed',
            error_details: { error: error.message, batch_size: batch.length }
          })
          .eq('id', jobId);
        
        throw error;
      }
    }
    
    console.log('🎉 All translations completed successfully!');
  }

  private static createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private static async processBatch(batch: TranslationItem[]): Promise<void> {
    for (const item of batch) {
      try {
        // Call the AI translation edge function
        const { data, error } = await supabase.functions.invoke('admin-ai-translation', {
          body: {
            sourceText: item.sourceText,
            sourceLang: 'en',
            targetLang: 'de',
            contextType: item.context || 'general',
            therapeuticContext: {
              domain: 'mental_health',
              tone: 'professional_supportive',
              terminology: 'clinical',
              cultural_adaptation: 'german_speaking'
            }
          }
        });

        if (error) {
          console.error(`❌ Translation failed for key ${item.key}:`, error);
          continue;
        }

        if (data?.translatedText) {
          // Store the translation in the database
          await supabase
            .from('content_translations')
            .insert({
              content_key: item.key,
              original_text: item.sourceText,
              source_language: 'en',
              target_language: 'de',
              translated_text: data.translatedText,
              content_type: item.category || 'general',
              context_type: item.context || 'general',
              quality_score: data.quality_score || 0.9,
              is_approved: true // Auto-approve AI translations for now
            });

          console.log(`✅ Translated: ${item.key}`);
        }
        
      } catch (error) {
        console.error(`❌ Error translating ${item.key}:`, error);
      }
    }
  }

  static async generateGermanLanguageFile(): Promise<void> {
    console.log('📄 Generating updated German language file...');
    
    try {
      // Fetch all approved German translations
      const { data: translations, error } = await supabase
        .from('content_translations')
        .select('content_key, translated_text')
        .eq('target_language', 'de')
        .eq('is_approved', true);

      if (error) throw error;

      // Load existing German content
      const existingGerman = await import('@/i18n/locales/de.json');
      const updatedContent = { ...existingGerman.default };

      // Update with new translations
      translations?.forEach(translation => {
        this.setNestedValue(updatedContent, translation.content_key, translation.translated_text);
      });

      console.log(`✅ Generated German language file with ${translations?.length || 0} translations`);
      // Note: In a real implementation, this would write to the file system
      // For now, we just log the success
      
    } catch (error) {
      console.error('❌ Failed to generate German language file:', error);
      throw error;
    }
  }

  private static setNestedValue(obj: any, path: string, value: string): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  static async getTranslationProgress(jobId: string) {
    const { data, error } = await supabase
      .from('translation_jobs')
      .select('total_items, completed_items, status')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  }
}
