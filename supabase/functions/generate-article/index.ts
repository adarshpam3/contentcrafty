
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a skilled content writer proficient in SEO writing. Create a well-structured, engaging article following these guidelines:

1. Start with an introduction that hooks the reader and provides an overview.
2. Create clear section headings using # for H1 and ## for H2 headings.
3. Include practical examples, data, and statistics where relevant.
4. Use tables to present comparative information (using markdown table syntax).
5. Include bullet points and numbered lists for better readability.
6. Add relevant quotes or expert opinions (using > for blockquotes).
7. Conclude with a strong summary and actionable takeaways.
8. Include a FAQ section at the end with 5 common questions and detailed answers.
9. Use markdown formatting:
   - **bold** for emphasis
   - *italic* for terms
   - \`code\` for technical terms
   - > for quotes
   - Tables with | separator
   - --- for horizontal rules
   - 1. for numbered lists
   - - for bullet points

Make the content engaging, informative, and easy to read. Aim for a conversational yet professional tone.`
          },
          {
            role: 'user',
            content: `Write a comprehensive article about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
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
