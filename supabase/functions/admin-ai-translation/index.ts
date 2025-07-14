import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkTranslationRequest {
  jobType: 'bulk_content' | 'url_generation' | 'seo_optimization' | 'full_website';
  sourceLanguage: string;
  targetLanguages: string[];
  contentType?: string;
  contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general';
  userId: string;
  jobName: string;
  items?: Array<{
    key: string;
    text: string;
    type: string;
  }>;
  pageKeys?: string[];
}

interface URLTranslationRequest {
  pageKey: string;
  originalPath: string;
  targetLanguage: string;
  contextType?: string;
}

interface SEOTranslationRequest {
  pageKey: string;
  targetLanguage: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...requestData } = await req.json();
    console.log(`Processing admin translation action: ${action}`);

    switch (action) {
      case 'bulk_translate':
        return await handleBulkTranslation(requestData as BulkTranslationRequest);
      
      case 'translate_url':
        return await handleURLTranslation(requestData as URLTranslationRequest);
      
      case 'translate_seo':
        return await handleSEOTranslation(requestData as SEOTranslationRequest);
      
      case 'scan_content':
        return await handleContentScan(requestData);
      
      case 'get_job_status':
        return await handleJobStatus(requestData.jobId);
      
      case 'approve_translation':
        return await handleTranslationApproval(requestData);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Admin translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleBulkTranslation(request: BulkTranslationRequest) {
  console.log(`Starting bulk translation job: ${request.jobName}`);
  
  // Create translation job
  const { data: job, error: jobError } = await supabase
    .from('translation_jobs')
    .insert({
      job_name: request.jobName,
      job_type: request.jobType,
      source_language: request.sourceLanguage,
      target_languages: request.targetLanguages,
      total_items: request.items?.length || 0,
      status: 'running',
      job_config: {
        contentType: request.contentType,
        contextType: request.contextType
      },
      created_by: request.userId
    })
    .select()
    .single();

  if (jobError || !job) {
    throw new Error(`Failed to create translation job: ${jobError?.message}`);
  }

  // Process translations in the background
  EdgeRuntime.waitUntil(processBulkTranslations(job.id, request));

  return new Response(
    JSON.stringify({ 
      jobId: job.id, 
      status: 'started',
      message: 'Bulk translation job started successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function processBulkTranslations(jobId: string, request: BulkTranslationRequest) {
  let completedItems = 0;
  let failedItems = 0;
  const results: any[] = [];

  try {
    if (request.items) {
      for (const item of request.items) {
        for (const targetLang of request.targetLanguages) {
          try {
            const translatedText = await translateWithOpenAI(
              item.text,
              request.sourceLanguage,
              targetLang,
              request.contextType || 'general'
            );

            // Store translation
            const { error } = await supabase
              .from('content_translations')
              .upsert({
                content_key: item.key,
                content_type: item.type,
                source_language: request.sourceLanguage,
                target_language: targetLang,
                original_text: item.text,
                translated_text: translatedText,
                context_type: request.contextType || 'general',
                quality_score: 0.85, // AI quality estimation
                translation_method: 'ai',
                is_approved: false,
                is_active: true
              });

            if (!error) {
              completedItems++;
              results.push({
                key: item.key,
                language: targetLang,
                status: 'success'
              });
            } else {
              failedItems++;
              results.push({
                key: item.key,
                language: targetLang,
                status: 'failed',
                error: error.message
              });
            }
          } catch (error) {
            failedItems++;
            console.error(`Translation failed for ${item.key} -> ${targetLang}:`, error);
            results.push({
              key: item.key,
              language: targetLang,
              status: 'failed',
              error: error.message
            });
          }
        }
      }
    }

    // Update job status
    await supabase
      .from('translation_jobs')
      .update({
        status: 'completed',
        completed_items: completedItems,
        failed_items: failedItems,
        completed_at: new Date().toISOString(),
        results_summary: { results }
      })
      .eq('id', jobId);

  } catch (error) {
    console.error('Bulk translation processing failed:', error);
    
    await supabase
      .from('translation_jobs')
      .update({
        status: 'failed',
        completed_items: completedItems,
        failed_items: failedItems,
        error_details: { error: error.message }
      })
      .eq('id', jobId);
  }
}

async function handleURLTranslation(request: URLTranslationRequest) {
  console.log(`Translating URL for page: ${request.pageKey}`);
  
  // Generate culturally appropriate URL
  const translatedPath = await translateURLPath(
    request.originalPath,
    request.targetLanguage,
    request.contextType
  );

  // Store URL translation
  const { data, error } = await supabase
    .from('url_translations')
    .upsert({
      page_key: request.pageKey,
      language_code: request.targetLanguage,
      original_path: request.originalPath,
      translated_path: translatedPath,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store URL translation: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      translatedPath,
      data
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSEOTranslation(request: SEOTranslationRequest) {
  console.log(`Translating SEO for page: ${request.pageKey}`);
  
  // Translate SEO elements
  const [translatedTitle, translatedDescription] = await Promise.all([
    translateWithOpenAI(request.metaTitle, 'en', request.targetLanguage, 'ui'),
    translateWithOpenAI(request.metaDescription, 'en', request.targetLanguage, 'ui')
  ]);

  let translatedKeywords: string[] = [];
  if (request.keywords && request.keywords.length > 0) {
    const keywordPromises = request.keywords.map(keyword => 
      translateWithOpenAI(keyword, 'en', request.targetLanguage, 'ui')
    );
    translatedKeywords = await Promise.all(keywordPromises);
  }

  // Store SEO translation
  const { data, error } = await supabase
    .from('seo_translations')
    .upsert({
      page_key: request.pageKey,
      language_code: request.targetLanguage,
      meta_title: translatedTitle,
      meta_description: translatedDescription,
      meta_keywords: translatedKeywords,
      og_title: translatedTitle,
      og_description: translatedDescription,
      twitter_title: translatedTitle,
      twitter_description: translatedDescription,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store SEO translation: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      translatedTitle,
      translatedDescription,
      translatedKeywords,
      data
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleContentScan(request: any) {
  // This would scan the website for translatable content
  // For now, return mock data
  const mockContent = [
    { key: 'navbar.home', text: 'Home', type: 'ui' },
    { key: 'navbar.pricing', text: 'Pricing', type: 'ui' },
    { key: 'hero.title', text: 'Transform Your Mental Health Journey', type: 'page_content' },
    { key: 'pricing.title', text: 'Choose Your Plan', type: 'page_content' }
  ];

  return new Response(
    JSON.stringify({ content: mockContent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleJobStatus(jobId: string) {
  const { data, error } = await supabase
    .from('translation_jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) {
    throw new Error(`Failed to get job status: ${error.message}`);
  }

  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTranslationApproval(request: any) {
  const { translationId, approved, reviewerNotes } = request;
  
  const { error } = await supabase
    .from('content_translations')
    .update({
      is_approved: approved,
      approved_at: approved ? new Date().toISOString() : null,
      approved_by: request.userId
    })
    .eq('id', translationId);

  if (error) {
    throw new Error(`Failed to update translation approval: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function translateWithOpenAI(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  contextType: string
): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const contextPrompts = {
    therapeutic: `You are translating therapeutic content for a mental health platform. Maintain emotional nuance and professional tone.`,
    ui: `You are translating user interface elements. Keep translations concise and culturally appropriate.`,
    crisis: `You are translating crisis intervention content. Maintain urgency and clarity while being culturally sensitive.`,
    cultural: `You are translating content with cultural context. Adapt appropriately for the target culture.`,
    general: `You are a professional translator. Maintain meaning and tone.`
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${contextPrompts[contextType as keyof typeof contextPrompts]} Translate from ${sourceLanguage} to ${targetLanguage}. Return only the translation without explanations.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }

  return data.choices[0].message.content.trim();
}

async function translateURLPath(
  originalPath: string,
  targetLanguage: string,
  contextType?: string
): Promise<string> {
  // Extract the path components
  const pathParts = originalPath.split('/').filter(part => part.length > 0);
  
  if (pathParts.length === 0) {
    return `/${targetLanguage}`;
  }

  // Translate each meaningful path component
  const translatedParts = await Promise.all(
    pathParts.map(async (part) => {
      // Don't translate UUIDs, numbers, or very short parts
      if (part.match(/^[0-9a-f-]{36}$/i) || part.match(/^\d+$/) || part.length < 3) {
        return part;
      }
      
      try {
        return await translateWithOpenAI(
          part.replace(/-/g, ' '),
          'en',
          targetLanguage,
          'ui'
        );
      } catch (error) {
        console.warn(`Failed to translate path part: ${part}`, error);
        return part;
      }
    })
  );

  // Convert back to URL format
  const translatedPath = translatedParts
    .map(part => part.toLowerCase().replace(/\s+/g, '-'))
    .join('/');

  return `/${targetLanguage}/${translatedPath}`;
}