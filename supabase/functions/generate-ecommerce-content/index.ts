
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, storeName, categoryName, language } = await req.json();
    console.log('Generating content for:', { type, storeName, categoryName, language });

    let prompt = '';
    if (type === 'keywords') {
      prompt = `Generate 5-7 relevant SEO keywords for an e-commerce ${categoryName} category in ${storeName} store. The keywords should be in ${language} language. Return only the keywords separated by commas, no explanations.`;
    } else if (type === 'keyFeatures') {
      prompt = `Write 4-5 key features and a brief description for the ${categoryName} category in ${storeName} e-commerce store. The content should be in ${language} language. Focus on what makes this category special and what customers should know. Format with bullet points using "-" at the start of each line.`;
    }

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
            content: type === 'keywords' 
              ? 'You are an SEO expert that generates relevant keywords for e-commerce categories.'
              : 'You are an e-commerce expert that writes compelling category descriptions.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-ecommerce-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
