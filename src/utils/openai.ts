import { supabase } from "@/integrations/supabase/client";

export async function generateTopicsFromKeywords(keywords: string[], language: string = 'english') {
  try {
    const { data, error } = await supabase.functions.invoke('generate-topics', {
      body: { keywords, language },
    });

    if (error) throw error;
    return data.topics;
  } catch (error) {
    console.error('Error generating topics:', error);
    throw error;
  }
}