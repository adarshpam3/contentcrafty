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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Act as a skilled content writer who is proficient in SEO writing and has excellent ${language} skills. To get started, please create two tables.
             The first table should contain an outline of the article, and the second table should contain the article itself. 
             Please use Markdown language to bold the heading of the second table.
             Before writing the article, please compose an outline that includes at least 15 headings and subheadings (including H1, H2, H3, and H4 headings). 
             Then, proceed to write the article based on the outline step-by-step. The article should be 2,000 words long, unique, SEO-optimized, and human-written in English.
             It should cover the given topic and include at least 15 headings and subheadings (including H1, H2, H3, and H4 headings). 
             Please compose the article in your own words, avoiding copying and pasting from other sources.
             When producing content, please consider complexity and burstiness, striving to achieve high levels of both without sacrificing specificity or context. 
             Use paragraphs that fully engage the reader, and write in a conversational style that is human-like.
             This means employing an informal tone, utilizing personal pronouns, keeping it simple, engaging the reader, utilizing the active voice, keeping it brief, asking rhetorical questions, and incorporating analogies and metaphors. 
             Please end the article with a conclusion paragraph and 5 unique FAQs after the conclusion. Additionally, remember to bold the title and all headings of the article and use appropriate headings for H tags.`
          },
          {
            role: 'user',
            content: `Write a comprehensive article about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
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