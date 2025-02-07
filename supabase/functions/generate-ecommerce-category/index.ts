
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
    const { storeName, categoryName, keywords, keyFeatures } = await req.json();

    const prompt = `Write a detailed and SEO-optimized description for the ${categoryName} category in the ${storeName} e-commerce store. Include the following keywords: ${keywords}. Also incorporate these key features: ${keyFeatures}. The description should:
    1. Have a compelling introduction
    2. Highlight key features and benefits
    3. Include relevant product types
    4. Target both beginners and experienced users
    5. End with a call to action
    Format with proper headings and paragraphs.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert e-commerce copywriter who creates compelling and SEO-optimized category descriptions.'
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

    // Count words and characters
    const words = generatedContent.trim().split(/\s+/).length;
    const characters = generatedContent.length;

    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        wordCount: words,
        characterCount: characters
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in generate-ecommerce-category function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
