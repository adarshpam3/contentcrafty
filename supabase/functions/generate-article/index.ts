import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const structuredPrompt = `Act as a skilled content writer who is proficient in SEO writing and has excellent English language skills. 

To get started, please create two tables. The first table should contain an outline of the article, and the second table should contain the article itself. Please use Markdown language to bold the heading of the second table.

Before writing the article, please compose an outline that includes at least 15 headings and subheadings (including H1, H2, H3, and H4 headings). Then, proceed to write the article based on the outline step-by-step. The article should be 2,000 words long, unique, SEO-optimized, and human-written in English. It should cover the given topic and include at least 15 headings and subheadings (including H1, H2, H3, and H4 headings). Please compose the article in your own words, avoiding copying and pasting from other sources.

When producing content, please consider complexity and burstiness, striving to achieve high levels of both without sacrificing specificity or context. Use paragraphs that fully engage the reader, and write in a conversational style that is human-like. This means employing an informal tone, utilizing personal pronouns, keeping it simple, engaging the reader, utilizing the active voice, keeping it brief, asking rhetorical questions, and incorporating analogies and metaphors.

Please end the article with a conclusion paragraph and 5 unique FAQs after the conclusion. Additionally, remember to bold the title and all headings of the article and use appropriate headings for H tags.

Now, please write an article on the topic: ${prompt}`;

  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "system", content: structuredPrompt }],
    stream: true,
    temperature: 0.7,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
