export function convertJsonToYaml(jsonStr: string): string {
  if (!jsonStr.trim()) {
    throw new Error('Input is empty');
  }
  const obj = JSON.parse(jsonStr);
  return jsonToYaml(obj, 0).trim();
}

function jsonToYaml(obj: any, indent: number): string {
  const spaces = ' '.repeat(indent);

  if (obj === null) return 'null\n';
  if (typeof obj === 'undefined') return 'null\n';

  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Escape and wrap strings if they contain special YAML characters or newlines
      if (obj.includes('\n') || /[:#\-[\]{}|>&*!@%`']/.test(obj)) {
        return `"${obj.replace(/"/g, '\\"')}"\n`;
      }
      return `${obj}\n`;
    }
    return `${obj}\n`;
  }

  let yaml = '';
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]\n';
    for (const val of obj) {
      if (typeof val === 'object' && val !== null) {
        const childYaml = jsonToYaml(val, indent + 2).trimStart();
        yaml += `${spaces}- ${childYaml}`;
      } else {
        yaml += `${spaces}- ${jsonToYaml(val, 0)}`;
      }
    }
  } else {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}\n';
    for (const key of keys) {
      const val = obj[key];
      if (typeof val === 'object' && val !== null) {
        yaml += `${spaces}${key}:\n${jsonToYaml(val, indent + 2)}`;
      } else {
        yaml += `${spaces}${key}: ${jsonToYaml(val, 0)}`;
      }
    }
  }
  return yaml;
}

export function convertYamlToJson(yamlStr: string): string {
  if (!yamlStr.trim()) {
    throw new Error('Input is empty');
  }

  // Simple, robust YAML parser for standard key-value structures and lists
  const lines = yamlStr.split('\n');
  const result: any = {};
  const stack: { indent: number; obj: any; key?: string; isArray: boolean }[] = [
    { indent: -1, obj: result, isArray: false },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Check indentation pop
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (trimmed.startsWith('-')) {
      // Array item
      const valStr = trimmed.substring(1).trim();
      
      if (!current.isArray) {
        // Convert current container to array if it is not already
        if (current.key) {
          const parent = stack[stack.length - 2].obj;
          parent[current.key] = [];
          current.obj = parent[current.key];
          current.isArray = true;
        }
      }

      if (valStr.endsWith(':')) {
        // Array of object item
        const key = valStr.slice(0, -1).trim();
        const newObj = {};
        current.obj.push(newObj);
        stack.push({ indent, obj: newObj, key, isArray: false });
      } else {
        current.obj.push(parseYamlValue(valStr));
      }
    } else if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIdx).trim();
      const valStr = trimmed.substring(colonIdx + 1).trim();

      if (valStr === '') {
        // Nested object
        const newObj = {};
        if (current.isArray) {
          current.obj.push({ [key]: newObj });
        } else {
          current.obj[key] = newObj;
        }
        stack.push({ indent, obj: newObj, key, isArray: false });
      } else {
        const val = parseYamlValue(valStr);
        if (current.isArray) {
          current.obj.push({ [key]: val });
        } else {
          current.obj[key] = val;
        }
      }
    }
  }

  return JSON.stringify(result, null, 2);
}

function parseYamlValue(valStr: string): any {
  const clean = valStr.trim();
  if (clean === 'true') return true;
  if (clean === 'false') return false;
  if (clean === 'null') return null;
  
  // Check if string literal
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    return clean.slice(1, -1);
  }

  // Check if number
  const num = Number(clean);
  if (!isNaN(num) && clean !== '') {
    return num;
  }

  return clean;
}
