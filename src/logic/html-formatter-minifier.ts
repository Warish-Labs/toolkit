const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export function formatHtml(htmlStr: string, indentSize = 2): string {
  if (!htmlStr.trim()) {
    throw new Error('Input is empty');
  }

  // Clean extra whitespace between tags first
  const clean = htmlStr.replace(/>\s*</g, '><').trim();

  let formatted = '';
  let indent = 0;
  const pad = (n: number) => ' '.repeat(n * indentSize);

  // Split by tags
  const tokens = clean.split(/(<\/?[a-zA-Z0-9\-]+[^>]*>)/g).filter(t => t.trim() !== '');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      formatted += pad(indent) + token + '\n';
    } else if (token.startsWith('<') && !token.startsWith('<!')) {
      const tagNameMatch = token.match(/<([a-zA-Z0-9\-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isVoid = VOID_ELEMENTS.has(tagName) || token.endsWith('/>');

      if (isVoid) {
        formatted += pad(indent) + token + '\n';
      } else {
        formatted += pad(indent) + token;

        // If the next token is a closing tag matching this element, keep them on one line
        const nextToken = tokens[i + 1];
        const closingTag = `</${tagName}>`;
        if (nextToken && nextToken.toLowerCase() === closingTag) {
          formatted += nextToken + '\n';
          i++; // skip closing tag token
        } else {
          formatted += '\n';
          indent++;
        }
      }
    } else {
      // Text nodes or comments
      formatted += pad(indent) + token.trim() + '\n';
    }
  }

  return formatted.trim();
}

export function minifyHtml(htmlStr: string): string {
  if (!htmlStr.trim()) {
    throw new Error('Input is empty');
  }

  // 1. Remove comments
  let minified = htmlStr.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Collapse whitespace
  minified = minified.replace(/\s+/g, ' ');

  // 3. Remove space between tags
  minified = minified.replace(/>\s+</g, '><');

  return minified.trim();
}
