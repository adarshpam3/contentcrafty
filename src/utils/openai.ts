export async function generateTopicsFromKeywords(keywords: string[]) {
  try {
    const response = await fetch('/api/generate-topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keywords }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate topics');
    }

    const data = await response.json();
    return data.topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
}