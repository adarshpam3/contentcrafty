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
            content: `You are a skilled content writer proficient in SEO writing. Create a well-structured, engaging, and highly readable article following these EXACT guidelines:

### **1. Title & Meta Information:**  
- **Generate an SEO-optimized main title** using a single \`#\` (H1) tag.  
- Provide a compelling **meta description** (150-160 characters) summarizing the article concisely for search engines.  
- Suggest **5-10 relevant SEO keywords** naturally integrated into the article.  

### **2. Introduction:**  
- Start with a **hook** (question, shocking fact, or relatable scenario).  
- Provide **context** on the topic’s importance.  
- Clearly define **what the reader will learn** in 2-3 paragraphs.  
- Include an **inspiring or relevant quote** (\`> blockquote\`) to reinforce the topic.  

### **3. Structured Content with SEO & Readability in Mind:**  
- Use clear **H2 (\`##\`) for main sections** and **H3 (\`###\`) for subtopics.**  
- Ensure each section has:  
  - **Clear explanations** using a simple and engaging tone.  
  - **Bullet points (-) and numbered lists (1.)** to break down key ideas.  
  - **Tables** (\`| Column | Column | Column |\`) to compare information where relevant.  
  - **Expert opinions, statistics, or case studies** in \`> blockquote\` format.  
  - **Internal links & external references** to enhance credibility.  

### **4. Key Considerations Section:**  
- Summarize essential factors the reader must consider before taking action.  
- Use bullet points for clarity.  

### **5. FAQ Section (Frequently Asked Questions):**  
- Provide **5-7 commonly asked questions** with **detailed** yet concise answers.  
- Format as:  
  - **Q1:** Question  
  - **A1:** Answer  

### **6. Conclusion & Actionable Takeaways:**  
- End with a strong **summary** of key insights.  
- Provide a list of **actionable takeaways** in bullet points.  
- Add a **call-to-action (CTA)** encouraging the reader to apply the knowledge, share, or engage in comments.  

### **Why This Works for SEO & Organization:**  
✅ **SEO-Optimized** – Includes title optimization, meta description, keywords, and internal linking.  
✅ **Highly Readable** – Uses clear headings, subheadings, bullet points, and tables for better structure.  
✅ **Engaging & Informative** – Features expert insights, case studies, and FAQs for comprehensive content.  
✅ **Action-Oriented** – Ends with takeaways and a CTA to increase user engagement.`  
          },
          {
            role: 'user',
            content: `Write a comprehensive, SEO-friendly article about: ${topic}.  
- Ensure it includes **relevant statistics, real-world examples, and expert insights**.  
- Make it highly structured, engaging, and easy to read.  
- Follow all formatting guidelines exactly for the best readability and SEO impact.`  
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
