import { supabase } from "@/integrations/supabase/client";

export const createProject = async (projectName: string, userId: string) => {
  const { error } = await supabase
    .from('seo_content')
    .insert([
      { 
        page_url: projectName,
        title: projectName,
        user_id: userId,
        description: null,
        keywords: [],
        meta_tags: {}
      }
    ]);

  if (error) {
    throw error;
  }
};