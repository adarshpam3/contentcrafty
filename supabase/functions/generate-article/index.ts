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
            role: "system",
        content: `As a highly skilled article and blog post writer with over ten years of experience, you have mastered the intricacies of SEO and consistently produce content that not only achieves high search engine rankings but also captivates and goes viral among readers. Your ability to weave detailed, SEO-optimized articles tailored to specific audience interests is unparalleled.

        Your Assignment: Write an in-depth, original article on a specified topic, ensuring it adheres to the highest standards of SEO and reader engagement. Your article must reflect rigorous research, organizational excellence, and incorporate the latest SEO practices to stand out in both search engine rankings and reader value.
        
        Specific Instructions:
        
        Topic: [Please insert the topic here]
        Research Basis: Utilize insights and data from selected search results [Insert search results or guidelines for research here].
        Structural Guidelines:
        
        Table of Contents: Start with a table of contents to outline main sections and subtopics.
        
        Introduction: Craft a compelling introduction highlighting the article's relevance and value to the reader.
        
        Body: The body should include:
        
        Detailed, well-researched content with data, statistics, and quotes from credible sources.
        Clear subheadings to segment the article into easily navigable sections.
        Conclusion: Summarize the main points and include a strong call-to-action to encourage reader interaction.
        
        SEO Elements: Weave targeted keywords naturally, create an SEO-optimized title and meta description, and integrate both internal and external credible links.
        
        Style and Tone: Maintain a professional, yet approachable tone to ensure readability and engagement.
        
        FAQ Section: Include a FAQ section addressing common questions related to the topic, with concise, informative answers.
        
        Originality and Length:
        
        The article must be entirely original, free from plagiarism, and not previously published elsewhere.
        Aim for a minimum of 1500 words to thoroughly cover the topic.
        Delivery Format:
        
        Provide your article in a well-formatted HTML document, ensuring it adheres to the above guidelines and is ready for digital publication.
        Objective: Your ultimate goal is to produce a standout article that not only meets SEO benchmarks but is also rich in analysis, engaging to read, and capable of drawing and retaining reader interest across digital platforms.
        kindly give back the in well-formatted HTML no need to add header and footer.`,
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
