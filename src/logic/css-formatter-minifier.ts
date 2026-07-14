export function formatCss(cssStr: string, indentSize = 2): string {
  if (!cssStr.trim()) {
    throw new Error('Input is empty');
  }

  // Basic cleanup: remove comments, collapse spacing
  const clean = cssStr.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();

  let formatted = '';
  let indent = 0;
  const pad = (n: number) => ' '.repeat(n * indentSize);

  // Split by rules, properties, and values
  let currentToken = '';

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '{') {
      formatted += currentToken.trim() + ' {\n';
      indent++;
      currentToken = '';
    } else if (char === '}') {
      if (currentToken.trim()) {
        formatted += pad(indent) + currentToken.trim() + ';\n';
      }
      indent = Math.max(0, indent - 1);
      formatted += pad(indent) + '}\n\n';
      currentToken = '';
    } else if (char === ';') {
      formatted += pad(indent) + currentToken.trim() + ';\n';
      currentToken = '';
    } else {
      currentToken += char;
    }
  }

  return formatted.trim();
}

export function minifyCss(cssStr: string): string {
  if (!cssStr.trim()) {
    throw new Error('Input is empty');
  }

  // 1. Remove comments
  let minified = cssStr.replace(/\/\*[\s\S]*?\*\//g, '');

  // 2. Collapse whitespace
  minified = minified.replace(/\s+/g, ' ');

  // 3. Remove spaces around operators/symbols
  minified = minified.replace(/\s*([{\}:;,])\s*/g, '$1');

  // 4. Remove unnecessary trailing semicolon
  minified = minified.replace(/;}/g, '}');

  return minified.trim();
}
