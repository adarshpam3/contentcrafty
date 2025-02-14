import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, language } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    console.log('Starting article generation for topic:', topic, 'in language:', language);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',  // Use a more powerful model
        messages: [
          {
            role: 'system',
            content: `You are a skilled content writer proficient in SEO writing. Write a well-structured, engaging, and SEO-optimized article on a given topic. 
            - First, generate an **outline** with at least 15 headings and subheadings (H1, H2, H3, H4).
            - Then, write a **2000-word article** based on the outline.
            - Use **Markdown** formatting and bold all headings.
            - Use a conversational and engaging tone.
            - End with a **Conclusion** and **5 unique FAQs**.`
          },
          {
            role: 'user',
            content: `Write a detailed article on the topic: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,  // Increased token limit for full article generation
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;
    const wordCount = generatedContent.split(/\s+/).length;
    const characterCount = generatedContent.length;

    console.log('Article generated successfully:', {
      wordCount,
      characterCount,
    });

    return new Response(
      JSON.stringify({
        content: generatedContent,
        wordCount,
        characterCount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-article function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
