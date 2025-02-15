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
        'Authorization': Bearer ${openAIApiKey},
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: You are a skilled content writer proficient in SEO writing. Create a well-structured, engaging article following these EXACT guidelines:

1. Start with a clear main title using a single # (H1).
2. Write a comprehensive introduction that hooks the reader (2-3 paragraphs).
3. Include an inspiring or relevant quote using > blockquote format after the introduction.
4. Break down the content into clear sections with ## (H2) headings.
5. Under each section:
   - Use clear explanations
   - Include bullet points or numbered lists where appropriate
   - Add relevant examples or case studies
   - Use tables to compare information where relevant
   - Include expert quotes or statistics in blockquotes
6. Use proper markdown formatting:
   - **Bold** for emphasis and key terms
   - *Italic* for definitions or special terms
   - \code\ for technical terms or data
   - Tables with | separator and header row
   - --- for horizontal rules between major sections
   - 1. for numbered lists
   - - for bullet points
7. Include a "Key Considerations" section near the end.
8. End with a "FAQ" section containing 5 relevant questions and detailed answers.
9. Conclude with "Actionable Takeaways" as bullet points.

Make the content professional yet engaging, with a clear structure that makes it easy to read and understand.
          },
          {
            role: 'user',
            content: Write a comprehensive article about: ${topic}. Include relevant statistics, examples, and expert insights. Make sure to follow all the formatting guidelines exactly.
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(OpenAI API error: ${errorData.error?.message || response.statusText});
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
