import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { keywords } = await req.json()
    console.log('Received keywords:', keywords)

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    if (!configuration.apiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Generate 10 unique article topics related to these keywords: ${keywords.join(', ')}. 
    Format each topic as a simple string. Topics should be engaging and SEO-friendly.`

    console.log('Sending request to OpenAI')
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates article topics based on keywords.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    const topics = completion.data.choices[0].message?.content
      ?.split('\n')
      .filter(Boolean)
      .map(topic => topic.replace(/^\d+\.\s*/, '').trim()) || []

    console.log('Generated topics:', topics)

    // Log the API usage
    const { error: logError } = await supabaseClient
      .from('api_logs')
      .insert({
        feature: 'topic_generation',
        api_name: 'openai',
        tokens_used: completion.data.usage?.total_tokens || 0,
      })

    if (logError) {
      console.error('Error logging API usage:', logError)
    }

    return new Response(
      JSON.stringify({ topics }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})