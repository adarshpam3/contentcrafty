
interface ArticleStatsProps {
  topic?: string;
  wordCount: number;
  charCount: number;
}

export function ArticleStats({ topic, wordCount, charCount }: ArticleStatsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-medium mb-4 flex items-center gap-2 text-gray-800">
        {topic}
        <span className="text-[#06962c] text-sm font-normal cursor-pointer hover:underline">
          ↗ edit title
        </span>
      </h2>
      <div className="flex gap-4 text-sm bg-[#e6f4ea] p-2 rounded-lg">
        <span className="text-[#06962c]">AI Assistant</span>
        <span>Words: {wordCount}</span>
        <span>Characters: {charCount}</span>
      </div>
    </div>
  );
}
