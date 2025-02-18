
const cleanHtml = (html: string): string => {
  // Remove DOCTYPE, html, head, and body tags
  let cleaned = html.replace(/<\!DOCTYPE[^>]*>/i, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?head[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .replace(/<title[^>]*>.*?<\/title>/gi, "")
    .replace(/<meta[^>]*>/gi, "");
  
  // Remove extra whitespace and line breaks
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  
  return cleaned;
};

const convertNode = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    // Clean up text nodes by removing extra whitespace
    return (node.nodeValue || "").replace(/\s+/g, " ").trim();
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const childContent = Array.from(element.childNodes)
    .map(child => convertNode(child))
    .join("");

  switch (element.tagName.toLowerCase()) {
    case "h1":
      return `# ${childContent}\n\n`;
    case "h2":
      return `## ${childContent}\n\n`;
    case "h3":
      return `### ${childContent}\n\n`;
    case "p":
      return `${childContent}\n\n`;
    case "strong":
      return `**${childContent}**`;
    case "em":
      return `_${childContent}_`;
    case "ul":
      return `${Array.from(element.children)
        .map(li => `* ${convertNode(li)}`)
        .join("\n")}\n\n`;
    case "ol":
      return `${Array.from(element.children)
        .map((li, i) => `${i + 1}. ${convertNode(li)}`)
        .join("\n")}\n\n`;
    case "li":
      return childContent;
    case "br":
      return "\n";
    case "a":
      return `[${childContent}](${element.getAttribute("href")})`;
    case "code":
      return `\`${childContent}\``;
    case "pre":
      return `\n\`\`\`\n${childContent}\n\`\`\`\n\n`;
    default:
      return childContent;
  }
};

export const convertHtmlToOriginal = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanHtml(html);
  
  // Convert all nodes and clean up extra whitespace
  const converted = convertNode(tempDiv)
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Replace multiple blank lines with double line breaks
    .replace(/\s+$/gm, "") // Remove trailing whitespace from each line
    .trim();
  
  return converted;
};
