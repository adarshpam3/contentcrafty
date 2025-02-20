
const cleanHtml = (html: string): string => {
  // Remove DOCTYPE, html, head, and body tags
  let cleaned = html.replace(/<\!DOCTYPE[^>]*>/i, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .replace(/<title[^>]*>.*?<\/title>/gi, "")
    .replace(/<meta[^>]*>/gi, "");
  
  // Fix common HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
  
  // Remove extra whitespace and line breaks while preserving intentional breaks
  cleaned = cleaned
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
  
  return cleaned;
};

const processText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
};

const convertNode = (node: Node): string => {
  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue || "";
    return processText(text);
  }

  // Skip non-element nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  
  // Process child nodes
  const childNodes = Array.from(element.childNodes);
  const childContent = childNodes
    .map(child => convertNode(child))
    .join("")
    .trim();

  // Convert based on tag type
  switch (element.tagName.toLowerCase()) {
    case "h1":
      return `# ${childContent}\n\n`;
    case "h2":
      return `## ${childContent}\n\n`;
    case "h3":
      return `### ${childContent}\n\n`;
    case "p":
      return childContent ? `${childContent}\n\n` : "";
    case "strong":
    case "b":
      return childContent ? `**${childContent}**` : "";
    case "em":
    case "i":
      return childContent ? `_${childContent}_` : "";
    case "ul":
      if (!childContent) return "";
      return `${Array.from(element.children)
        .map(li => `* ${convertNode(li)}`)
        .filter(item => item.trim() !== "* ")
        .join("\n")}\n\n`;
    case "ol":
      if (!childContent) return "";
      return `${Array.from(element.children)
        .map((li, i) => `${i + 1}. ${convertNode(li)}`)
        .filter(item => !item.endsWith(". "))
        .join("\n")}\n\n`;
    case "li":
      return childContent;
    case "br":
      return "\n";
    case "a":
      const href = element.getAttribute("href");
      return href ? `[${childContent}](${href})` : childContent;
    case "code":
      return childContent ? `\`${childContent}\`` : "";
    case "pre":
      return childContent ? `\n\`\`\`\n${childContent}\n\`\`\`\n\n` : "";
    case "blockquote":
      return childContent ? `> ${childContent}\n\n` : "";
    case "img":
      const alt = element.getAttribute("alt") || "";
      const src = element.getAttribute("src") || "";
      return `![${alt}](${src})\n\n`;
    default:
      return childContent;
  }
};

export const convertHtmlToOriginal = (html: string): string => {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanHtml(html);
  
  // Convert all nodes and clean up the output
  let converted = convertNode(tempDiv)
    // Fix multiple consecutive blank lines
    .replace(/\n{3,}/g, "\n\n")
    // Remove trailing whitespace from each line
    .replace(/[ \t]+$/gm, "")
    // Ensure proper spacing around markdown elements
    .replace(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Ensure proper line breaks between sections
  converted = converted
    .split("\n\n")
    .filter(line => line.trim() !== "")
    .join("\n\n");
  
  return converted;
};
