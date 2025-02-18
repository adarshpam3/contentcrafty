
const convertNode = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue || "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  switch (element.tagName.toLowerCase()) {
    case "h1":
      return `# ${element.textContent}\n\n`;
    case "h2":
      return `## ${element.textContent}\n\n`;
    case "h3":
      return `### ${element.textContent}\n\n`;
    case "p":
      return `${element.textContent}\n\n`;
    case "strong":
      return `**${element.textContent}**`;
    case "em":
      return `_${element.textContent}_`;
    case "ul":
      return `\n${Array.from(element.children).map((li) => `* ${convertNode(li)}`).join("\n")}\n`;
    case "ol":
      return `\n${Array.from(element.children).map((li, i) => `${i + 1}. ${convertNode(li)}`).join("\n")}\n`;
    case "br":
      return `\n`;
    case "a":
      return `[${element.textContent}](${element.getAttribute("href")})`;
    case "code":
      return `\`${element.textContent}\``;
    case "pre":
      return `\n\`\`\`\n${element.textContent}\n\`\`\`\n`;
    default:
      return element.textContent || "";
  }
};

export const convertHtmlToOriginal = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return convertNode(tempDiv).trim();
};
