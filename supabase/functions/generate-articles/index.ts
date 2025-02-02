import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topics, projectId, language } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Generating articles for user:', user.id);
    console.log('Topics:', topics);

    // Process each topic and create articles
    const articles = await Promise.all(topics.map(async (topic: any) => {
      const article = {
        user_id: user.id,
        project_id: projectId,
        topic: topic.title,
        language,
        h2_headings: topic.h2Headings,
        has_faq: topic.options.faq,
        has_toc: topic.options.tableOfContents,
        has_image: topic.options.generateImage,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('articles')
        .insert(article)
        .select()
        .single();

      if (error) {
        console.error('Error inserting article:', error);
        throw error;
      }
      
      console.log('Created article:', data.id);
      return data;
    }));

    // Here you would typically trigger your AI content generation
    // For now, we'll just update the status to 'completed'
    await Promise.all(articles.map(article => {
      console.log('Updating article status:', article.id);
      return supabase
        .from('articles')
        .update({ 
          status: 'completed', 
          content: `Generated content for ${article.topic}` 
        })
        .eq('id', article.id);
    }));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});