/**
 * Attempt to convert a Python-style single-quoted JSON string to valid JSON.
 * Returns null if the input doesn't look like single-quoted JSON.
 */
export function normalizeSingleQuoteJson(input: string): string | null {
  const t = input.trim();
  // Must start/end with { } or [ ]
  if (!((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']')))) {
    return null;
  }
  // Already valid JSON — no need to convert
  try { JSON.parse(t); return null; } catch { /* fall through */ }

  // Replace single-quoted strings with double-quoted ones.
  // Strategy: tokenize character-by-character, replacing single-quoted tokens.
  let result = '';
  let i = 0;
  while (i < t.length) {
    const ch = t[i];
    if (ch === "'") {
      // Collect single-quoted string content
      let str = '';
      i++; // skip opening quote
      while (i < t.length) {
        const c = t[i];
        if (c === '\\' && i + 1 < t.length) {
          const next = t[i + 1];
          if (next === "'") {
            str += "'";  // unescape \'  → '
            i += 2;
          } else if (next === '"') {
            str += '\\"'; // keep escaped double quote
            i += 2;
          } else {
            str += c + next;
            i += 2;
          }
        } else if (c === '"') {
          str += '\\"'; // escape any bare double quotes inside the value
          i++;
        } else if (c === "'") {
          break; // closing quote
        } else {
          str += c;
          i++;
        }
      }
      i++; // skip closing quote
      result += '"' + str + '"';
    } else {
      result += ch;
      i++;
    }
  }

  // Validate the result is now parseable
  try { JSON.parse(result); return result; } catch { return null; }
}
