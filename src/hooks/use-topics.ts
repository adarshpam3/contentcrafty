import { useState } from "react";

interface Topic {
  title: string;
  h2Headings: string[];
  options: {
    addH2: boolean;
    faq: boolean;
    tableOfContents: boolean;
    generateImage: boolean;
  };
}

export const useTopics = () => {
  const [topic, setTopic] = useState("");
  const [h2Headings, setH2Headings] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [options, setOptions] = useState({
    addH2: false,
    faq: false,
    tableOfContents: false,
    generateImage: false,
  });

  const handleAddTopic = () => {
    if (!topic) return;

    const newTopic: Topic = {
      title: topic,
      h2Headings: h2Headings.split('\n').filter(heading => heading.trim()),
      options: { ...options },
    };

    setTopics([...topics, newTopic]);
    setTopic("");
    setH2Headings("");
    setOptions({
      addH2: false,
      faq: false,
      tableOfContents: false,
      generateImage: false,
    });
  };

  const handleRemoveTopic = (index: number) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleUpdateTopic = (index: number, updatedTopic: Topic) => {
    const newTopics = [...topics];
    newTopics[index] = updatedTopic;
    setTopics(newTopics);
  };

  return {
    topic,
    setTopic,
    h2Headings,
    setH2Headings,
    topics,
    setTopics,
    options,
    setOptions,
    handleAddTopic,
    handleRemoveTopic,
    handleUpdateTopic,
  };
};