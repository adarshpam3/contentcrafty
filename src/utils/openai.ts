export async function generateTopicsFromKeywords(keywords: string[], apiKey: string) {
  try {
    const prompt = `Generate 10 unique article topics related to these keywords: ${keywords.join(', ')}. 
    Format each topic as a simple string. Topics should be engaging and SEO-friendly.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates article topics based on keywords.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate topics');
    }

    const topics = data.choices[0].message.content
      .split('\n')
      .filter(Boolean)
      .map(topic => topic.replace(/^\d+\.\s*/, '').trim());

    return topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
}