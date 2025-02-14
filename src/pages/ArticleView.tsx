"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function EditArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [content, setContent] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch article data
  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, projects(name)")
        .eq("id", articleId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  // Sync fetched content to state
  useEffect(() => {
    if (article) {
      setContent(article.content || "");
    }
  }, [articleId, article]);

  // Insert markdown syntax at cursor position
  const insertText = (before: string, after = "") => {
    if (!textAreaRef.current) return;
    const textarea = textAreaRef.current;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Save changes
  const handleSave = async () => {
    if (article?.content === content) {
      toast({
        title: "No changes",
        description: "No modifications detected",
        variant: "default",
      });
      return;
    }

    const { error } = await supabase
      .from("articles")
      .update({ content })
      .eq("id", articleId);

    if (error) {
      toast({
        title: "Error saving article",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Article saved",
      description: "Your changes have been saved successfully",
    });
  };

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;
  if (error) return <p className="text-red-500 text-center">Error loading article</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{article?.title || "Edit Article"}</h1>

      <Tabs defaultValue="edit">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="mb-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => insertText("**", "**")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText("_", "_")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText("~~", "~~")}>
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:left;">', "</div>")}>
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:center;">', "</div>")}>
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertText('<div style="text-align:right;">', "</div>")}>
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <textarea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 border rounded-lg p-2"
            placeholder="Write your article..."
          />
        </TabsContent>

        <TabsContent value="preview">
          <div className="p-4 border rounded-lg">
            <ReactMarkdown>{content || "_Nothing to preview_"}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} className="mt-4">
        Save
      </Button>
    </div>
  );
}
