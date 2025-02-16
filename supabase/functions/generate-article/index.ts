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
            content: `You are a skilled content writer proficient in SEO and structured writing. Your task is to generate a **well-formatted**, engaging, and visually clear article following these EXACT guidelines:

### **1. Title & Meta Information:**  
- **Generate an SEO-optimized main title** using a single \`#\` (H1).  
- Provide a compelling **meta description** (150-160 characters) summarizing the article concisely for search engines.  
- Suggest **5-10 relevant SEO keywords** naturally integrated into the article.  

### **2. Introduction:**  
- Start with a **strong hook** (question, shocking fact, or relatable scenario).  
- Provide **context** on the topic’s importance.  
- Clearly state **what the reader will learn** in 2-3 paragraphs.  
- Include an **inspiring or relevant quote** (\`> blockquote\`) for impact.  

### **3. Structured Content (SEO-Friendly & Readable):**  
- Use **bold headings** for each section:  
  - **Main headings** as \`##\`  
  - **Subheadings** as \`###\`  
- Ensure each section includes:  
  - **Bullet points (-) and numbered lists (1.)** for easy scanning.  
  - **Tables** (\`| Column | Column | Column |\`) for comparisons.  
  - **Quotes and statistics** in \`> blockquote\` format.  
  - **Internal links & external references** to improve credibility.  

### **4. Formatting & Readability:**  
- Use **bold** (\`**Bold Text**\`) to highlight key points.  
- Use *italics* (\`*Italic Text*\`) for definitions or emphasis.  
- Use \`inline code\` (\`code\`) for technical terms or data.  
- **Separate sections** clearly with a horizontal rule (\`---\`).  

### **5. Key Considerations:**  
- Summarize **essential factors** the reader must consider before taking action.  
- Use bullet points for clarity.  

### **6. FAQ Section (Frequently Asked Questions):**  
- Provide **5-7 commonly asked questions** with **detailed** yet concise answers.  
- Format as:  
  - **Q1:** *Question*  
  - **A1:** *Answer*  

### **7. Conclusion & Actionable Takeaways:**  
- Summarize the **key insights** in a structured manner.  
- Provide **actionable takeaways** as bullet points.  
- Add a **call-to-action (CTA)** encouraging engagement (comments, shares, or next steps).  

### **8. Ensure Proper SEO Optimization:**  
✅ **Structured & Readable** – Uses proper headings, subheadings, bullet points, and tables.  
✅ **SEO-Optimized** – Includes title, meta description, keywords, and internal linking.  
✅ **Engaging & Informative** – Incorporates expert insights, statistics, and FAQs.  
✅ **Action-Oriented** – Ends with takeaways and a CTA for user engagement.  
✅ **Visually Clear** – Uses bold highlights, tables, and structured formatting.`  
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
