
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Authorization required', { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user.user) {
      return new Response('Invalid token', { status: 401, headers: corsHeaders });
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseClient
      .rpc('is_admin', { _user_id: user.user.id });

    if (adminError || !isAdmin) {
      return new Response('Admin access required', { status: 403, headers: corsHeaders });
    }

    const { action, data } = await req.json();

    let result;
    switch (action) {
      case 'update_global_config':
        result = await updateGlobalConfig(supabaseClient, data, user.user.id);
        break;
      case 'create_template':
        result = await createTemplate(supabaseClient, data, user.user.id);
        break;
      case 'update_template':
        result = await updateTemplate(supabaseClient, data, user.user.id);
        break;
      case 'create_prompt':
        result = await createPrompt(supabaseClient, data, user.user.id);
        break;
      case 'update_prompt':
        result = await updatePrompt(supabaseClient, data, user.user.id);
        break;
      case 'get_analytics':
        result = await getAnalytics(supabaseClient);
        break;
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in admin config:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function updateGlobalConfig(supabaseClient: any, configData: any, adminId: string) {
  const { error } = await supabaseClient
    .from('whatsapp_global_config')
    .upsert({
      ...configData,
      created_by: adminId,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;

  return { success: true, message: 'Global configuration updated' };
}

async function createTemplate(supabaseClient: any, templateData: any, adminId: string) {
  const { error } = await supabaseClient
    .from('whatsapp_response_templates')
    .insert({
      ...templateData,
      created_by: adminId
    });

  if (error) throw error;

  return { success: true, message: 'Template created' };
}

async function updateTemplate(supabaseClient: any, templateData: any, adminId: string) {
  const { error } = await supabaseClient
    .from('whatsapp_response_templates')
    .update({
      ...templateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', templateData.id);

  if (error) throw error;

  return { success: true, message: 'Template updated' };
}

async function createPrompt(supabaseClient: any, promptData: any, adminId: string) {
  const { error } = await supabaseClient
    .from('whatsapp_system_prompts')
    .insert({
      ...promptData,
      created_by: adminId
    });

  if (error) throw error;

  return { success: true, message: 'System prompt created' };
}

async function updatePrompt(supabaseClient: any, promptData: any, adminId: string) {
  const { error } = await supabaseClient
    .from('whatsapp_system_prompts')
    .update({
      ...promptData,
      updated_at: new Date().toISOString()
    })
    .eq('id', promptData.id);

  if (error) throw error;

  return { success: true, message: 'System prompt updated' };
}

async function getAnalytics(supabaseClient: any) {
  const { data, error } = await supabaseClient
    .from('whatsapp_usage_analytics')
    .select('*')
    .order('date', { ascending: false })
    .limit(30);

  if (error) throw error;

  return { success: true, data };
}
