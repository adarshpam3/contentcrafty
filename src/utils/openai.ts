import { supabase } from "@/integrations/supabase/client";

export async function generateTopicsFromKeywords(keywords: string[]) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-topics', {
      body: { keywords },
    });

    if (error) {
      console.error('Error generating topics:', error);
      throw new Error('Failed to generate topics');
    }

    return data.topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
}