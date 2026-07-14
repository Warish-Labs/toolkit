export function formatXml(xmlStr: string, indentSize = 2): string {
  if (!xmlStr.trim()) {
    throw new Error('Input is empty');
  }

  // Remove whitespace between tags
  const cleanXml = xmlStr.replace(/>\s*</g, '><').trim();

  let formatted = '';
  let indent = 0;
  const pad = (n: number) => ' '.repeat(n * indentSize);

  // Simple tokenization of tags and texts
  const tokens = cleanXml.split(/(<\/?[^>]+>)/g).filter((t) => t.trim() !== '');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith('</')) {
      // Closing tag
      indent--;
      formatted += pad(indent) + token + '\n';
    } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<?') && !token.startsWith('<!')) {
      // Opening tag (excluding self-closing, processing instructions, or comments)
      formatted += pad(indent) + token;
      
      // Check if next token is a closing tag for this opening tag
      const nextToken = tokens[i + 1];
      const matchClosing = nextToken && nextToken.startsWith('</') && nextToken.substring(2, nextToken.length - 1) === token.substring(1, token.indexOf(' ') > 0 ? token.indexOf(' ') : token.length - 1);
      
      if (matchClosing) {
        // Keep tag content on the same line
        formatted += nextToken + '\n';
        i++; // skip next closing token
      } else {
        formatted += '\n';
        indent++;
      }
    } else {
      // Self-closing tag, processing instruction, comment, or text node
      formatted += pad(indent) + token + '\n';
    }
  }

  return formatted.trim();
}
