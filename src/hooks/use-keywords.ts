import { useState } from "react";

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    setKeywords([...keywords, keywordInput.trim()]);
    setKeywordInput("");
  };

  const handleDeleteKeyword = (keywordToDelete: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  return {
    keywords,
    setKeywords,
    keywordInput,
    setKeywordInput,
    handleAddKeyword,
    handleDeleteKeyword,
  };
};