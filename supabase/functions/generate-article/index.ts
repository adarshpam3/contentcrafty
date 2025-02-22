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
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a skilled content writer proficient in SEO writing. Create a well-structured, engaging article following these EXACT guidelines:
1. **Title**: Start with a clear, SEO-friendly main title using a single # (H1). Include the primary keyword naturally.
2. **Introduction**: Write a comprehensive introduction (2-3 paragraphs) that hooks the reader, explains the importance of the topic, and includes the primary keyword.
3. **Quote**: Include an inspiring or relevant quote using > blockquote format after the introduction.
4. **Sections**: Break down the content into clear sections with ## (H2) headings. Each section should focus on a specific aspect of the topic.
5. **Content Under Each Section**:
   - Use clear explanations and include relevant examples or case studies.
   - Use bullet points or numbered lists where appropriate.
   - Add tables to compare information where relevant (use markdown tables with | separator and header row).
   - Include expert quotes or statistics in blockquotes.
6. **Formatting**:
   - Use **bold** for emphasis and key terms.
   - Use *italic* for definitions or special terms.
   - Use \`code\` for technical terms or data.
   - Use --- for horizontal rules between major sections.
7. **Key Considerations**: Include a "Key Considerations" section near the end, summarizing the most important points. Use bullet points for clarity.
8. **FAQ**: End with a "FAQ" section containing 5 relevant questions and detailed answers. Use **bold** for questions and normal text for answers.
9. **Conclusion**: Conclude with "Actionable Takeaways" as bullet points, summarizing practical steps the reader can take.
10. **SEO Optimization**:
   - Ensure the primary keyword is used naturally throughout the article (title, headings, and body).
   - Use secondary keywords where relevant.
   - Write a meta description at the end that summarizes the article and includes the primary keyword.

Make the content professional yet engaging, with a clear structure that makes it easy to read and understand. Follow all formatting guidelines exactly for maximum readability and SEO impact.`
          },
          {
            role: 'user',
            content: `Write a comprehensive, SEO-friendly article about: ${topic}.  
- Ensure it includes **relevant statistics, real-world examples, and expert insights**.  
- Make it highly structured, engaging, and easy to read.  
- Use proper **bold formatting, bullet points, tables, and clear sectioning**.  
- Follow all formatting guidelines exactly for **maximum readability and SEO impact**.`
          }
        ],
        temperature: 0.5, // Lower temperature for more structured output
        max_tokens: 3500, // Slightly reduce max_tokens to avoid truncation
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
