import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { keywords } = await req.json()
    console.log('Received keywords:', keywords)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    if (!openai.apiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Generate 10 unique article topics related to these keywords: ${keywords.join(', ')}. 
    For each topic, also generate 3-5 H2 subheadings that would structure the article well.
    Make the topics and headings engaging and SEO-friendly.
    
    Return the response in this exact format:
    [
      {
        "title": "Topic Title",
        "h2Headings": ["H2 Heading 1", "H2 Heading 2", "H2 Heading 3"]
      }
    ]`

    console.log('Sending request to OpenAI')
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates article topics and their subheadings in a specific JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })

    const content = completion.choices[0].message.content;
    console.log('Raw OpenAI response:', content);
    
    try {
      const topics = JSON.parse(content);
      console.log('Parsed topics:', topics);

      const { error: logError } = await supabaseClient
        .from('api_logs')
        .insert({
          feature: 'topic_generation',
          api_name: 'openai',
          tokens_used: completion.usage?.total_tokens || 0,
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
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      throw new Error('Invalid response format from OpenAI')
    }
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