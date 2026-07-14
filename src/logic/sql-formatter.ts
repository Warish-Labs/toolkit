export function formatSql(sqlStr: string, indentSize = 2): string {
  if (!sqlStr.trim()) {
    throw new Error('Input is empty');
  }

  const keywords = [
    'select', 'from', 'where', 'and', 'or', 'group by', 'order by',
    'limit', 'join', 'left join', 'right join', 'inner join', 'on',
    'insert into', 'values', 'update', 'set', 'delete from', 'create table',
    'having', 'union', 'as', 'into', 'alter table', 'drop table'
  ];

  // Clean up extra spaces
  let clean = sqlStr.replace(/\s+/g, ' ').trim();

  // Uppercase key SQL commands
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    clean = clean.replace(regex, kw.toUpperCase());
  }

  // Inject line breaks on major keywords
  const splitKeywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT',
    'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'JOIN', 'INSERT INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'HAVING',
    'UNION'
  ];

  let prepared = clean;
  for (const kw of splitKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    prepared = prepared.replace(regex, `\n${kw}`);
  }

  // Format line margins and indents
  const lines = prepared.split('\n').map((l) => l.trim()).filter((l) => l !== '');
  let indent = 0;
  const pad = (n: number) => ' '.repeat(n * indentSize);

  const formattedLines = lines.map((line) => {
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    if (line.startsWith(')')) {
      indent = Math.max(0, indent - 1);
    }

    const output = pad(indent) + line;
    indent += openParens - closeParens;
    indent = Math.max(0, indent);

    return output;
  });

  return formattedLines.join('\n');
}

export function minifySql(sqlStr: string): string {
  if (!sqlStr.trim()) {
    throw new Error('Input is empty');
  }

  // 1. Remove single-line comments
  let minified = sqlStr.replace(/--.*$/gm, '');

  // 2. Remove multi-line comments
  minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');

  // 3. Collapse whitespace
  minified = minified.replace(/\s+/g, ' ');

  // 4. Remove space around commas, parens, and operators
  minified = minified.replace(/\s*([,()=<>!+*/-])\s*/g, '$1');

  return minified.trim();
}
