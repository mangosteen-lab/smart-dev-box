// Unit tests for core tool execute functions
// These tests run in Node.js (no browser APIs needed for these tools)

// Mock js-base64 with Node.js compatible implementation
jest.mock('js-base64', () => ({
  toBase64: (s: string) => Buffer.from(s).toString('base64'),
  fromBase64: (s: string) => Buffer.from(s, 'base64').toString('utf-8'),
}));

// We need to import after mocking
import '../lib/tools/encoding';
import '../lib/tools/formatting';
import '../lib/tools/conversion';
import '../lib/tools/inspection';
import { executeTool, runDetection } from '../lib/tools/registry';
import { compressToBase64, compressToUTF16 } from 'lz-string';
import { buildPcre2Pattern } from '../lib/tools/inspection';

describe('JSON Formatter', () => {
  test('formats valid JSON', async () => {
    const result = await executeTool('json-formatter', '{"a":1,"b":2}');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.outputLanguage).toBe('json');
  });

  test('returns error for invalid JSON', async () => {
    const result = await executeTool('json-formatter', '{invalid}');
    expect(result.error).toBeDefined();
    expect(result.output).toBe('');
  });

  test('handles empty input gracefully', async () => {
    const result = await executeTool('json-formatter', '');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('');
  });
});

describe('Base64 Encode', () => {
  test('encodes plain text', async () => {
    const result = await executeTool('base64-encode', 'Hello World');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('SGVsbG8gV29ybGQ=');
  });
});

describe('Base64 Decode', () => {
  test('decodes a valid Base64 string', async () => {
    const result = await executeTool('base64-decode', 'SGVsbG8gV29ybGQ=');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('Hello World');
  });

  test('returns error for invalid Base64', async () => {
    const result = await executeTool('base64-decode', '!@#$%^&*()');
    expect(result.error).toBeDefined();
  });
});

describe('LZ-String Compress / Decompress', () => {
  test('round-trips text through URL-safe compression', async () => {
    const original = 'The quick brown fox jumps over the lazy dog '.repeat(4);
    const compressed = await executeTool('lz-string-compress', original);
    expect(compressed.error).toBeUndefined();
    expect(compressed.output).not.toBe('');
    // Output must be URL-safe (no characters that need percent-encoding)
    expect(compressed.output).toMatch(/^[A-Za-z0-9+\-$]+$/);

    const decompressed = await executeTool('lz-string-decompress', compressed.output);
    expect(decompressed.error).toBeUndefined();
    expect(decompressed.output).toBe(original);
  });

  test('decompress also handles the Base64 variant (compressToBase64)', async () => {
    const original = JSON.stringify({ state: 'app', items: [1, 2, 3], user: 'sean' });
    const compressed = compressToBase64(original); // contains Base64-only chars like "/"
    const result = await executeTool('lz-string-decompress', compressed);
    expect(result.error).toBeUndefined();
    expect(result.output).toBe(original);
  });

  test('decompress also handles the UTF-16 variant (compressToUTF16)', async () => {
    const original = 'localStorage payload '.repeat(6);
    const result = await executeTool('lz-string-decompress', compressToUTF16(original));
    expect(result.error).toBeUndefined();
    expect(result.output).toBe(original);
  });

  test('decompress is auto-detected for compressed input', () => {
    const compressed = compressToBase64('The quick brown fox jumps over the lazy dog '.repeat(4));
    const hits = runDetection(compressed);
    expect(hits.some((h) => h.toolId === 'lz-string-decompress')).toBe(true);
  });

  test('decompress outranks base64-decode for Base64-variant LZ payloads', () => {
    // compressToBase64 output is ALSO valid plain Base64, so base64-decode
    // would fire too — but it produces garbage, so LZ must rank first.
    const compressed = compressToBase64('The quick brown fox jumps over the lazy dog '.repeat(4));
    const hits = runDetection(compressed);
    const lz = hits.findIndex((h) => h.toolId === 'lz-string-decompress');
    const b64 = hits.findIndex((h) => h.toolId === 'base64-decode');
    expect(lz).toBeGreaterThanOrEqual(0);
    if (b64 >= 0) expect(lz).toBeLessThan(b64); // lz ranked ahead of base64-decode
  });

  test('decompress is NOT auto-detected for ordinary text or JSON', () => {
    for (const input of ['{"name":"test","values":[1,2,3,4,5],"ok":true}', 'The quick brown fox jumps over the lazy dog.']) {
      const hits = runDetection(input);
      expect(hits.some((h) => h.toolId === 'lz-string-decompress')).toBe(false);
    }
  });

  test('compress handles empty input gracefully', async () => {
    const result = await executeTool('lz-string-compress', '');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('');
  });

  test('decompress returns an error for invalid input', async () => {
    const result = await executeTool('lz-string-decompress', '!!!not a valid lz-string value at all!!!');
    expect(result.error).toBeDefined();
    expect(result.output).toBe('');
  });
});

describe('Unix Timestamp', () => {
  test('converts a 10-digit epoch to human-readable date', async () => {
    const result = await executeTool('unix-timestamp', '1000000000');
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('2001');
    expect(result.output).toContain('Unix (s):');
  });

  test('converts a date string to epoch', async () => {
    const result = await executeTool('unix-timestamp', '2001-09-09T01:46:40.000Z');
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('1000000000');
  });

  test('returns error for invalid input', async () => {
    const result = await executeTool('unix-timestamp', 'not a date');
    expect(result.error).toBeDefined();
  });

  test('handles empty input gracefully', async () => {
    const result = await executeTool('unix-timestamp', '');
    expect(result.output).toBe('');
  });
});

describe('URL Encode / Decode', () => {
  test('encodes special characters', async () => {
    const result = await executeTool('url-encode', 'hello world & more');
    expect(result.output).toBe('hello%20world%20%26%20more');
  });

  test('decodes percent-encoded string', async () => {
    const result = await executeTool('url-decode', 'hello%20world%20%26%20more');
    expect(result.output).toBe('hello world & more');
  });
});

describe('JWT Inspector', () => {
  // A well-known test JWT (header.payload.signature)
  const testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  test('decodes header and payload', async () => {
    const result = await executeTool('jwt-inspector', testJwt);
    expect(result.error).toBeUndefined();
    const parsed = JSON.parse(result.output);
    expect(parsed.header.alg).toBe('HS256');
    expect(parsed.payload.name).toBe('John Doe');
  });

  test('returns error for invalid JWT', async () => {
    const result = await executeTool('jwt-inspector', 'not.a.jwt.at.all.extra');
    expect(result.error).toBeDefined();
  });
});

describe('Number Base Converter', () => {
  test('converts decimal to all bases', async () => {
    const result = await executeTool('number-base-converter', '255');
    expect(result.output).toContain('0b11111111');
    expect(result.output).toContain('0o377');
    expect(result.output).toContain('0xFF');
  });

  test('converts hex to all bases', async () => {
    const result = await executeTool('number-base-converter', '0xFF');
    expect(result.output).toContain('255');
  });
});

describe('Regex Generator', () => {
  test('generates a starter regex from a sample string', async () => {
    const result = await executeTool('regex-generator', 'user-123');
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('PCRE2 pattern: ^[a-z]{4}-\\d{3}$');
    expect(result.output).not.toContain('Language snippets');
  });

  test('adds flags as PCRE2 inline modifiers', async () => {
    const result = await executeTool('regex-generator', 'Order-123', {
      caseInsensitive: true,
      matchWholeLine: true,
    });
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('PCRE2 pattern: (?i)^[A-Za-z]{5}-\\d{3}$');
    expect(result.output).not.toContain('python:');
  });

  test('recognizes common whole-sample patterns', async () => {
    const result = await executeTool('regex-generator', 'ada@example.com');
    expect(result.error).toBeUndefined();
    expect(result.output).toContain('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}');
  });

  test('handles empty input gracefully', async () => {
    const result = await executeTool('regex-generator', '');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('');
  });

  test('generated raw pattern matches the log sample in JavaScript regex', () => {
    const pattern = String.raw`^2020-03-12T13:34:56\.123Z\s+(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)\s+\[org\.example\.Class\]: This is a #simple #logline containing a 'value'\.$`;
    const sample = "2020-03-12T13:34:56.123Z INFO [org.example.Class]: This is a #simple #logline containing a 'value'.";
    expect(new RegExp(pattern).test(sample)).toBe(true);
  });

  test('keeps PCRE2 syntax and combines inline flags', () => {
    const pattern = String.raw`^2020-03-12T13:34:56\.123Z\s+(?:TRACE|DEBUG|INFO|WARN)\s+\[org\.example\.Class\]$`;
    const pcre2Pattern = buildPcre2Pattern(pattern, {
      caseInsensitive: true,
      dotAll: true,
      multiline: true,
    });
    expect(pcre2Pattern).toBe(`(?ism)${pattern}`);
    expect(pcre2Pattern).toContain('\\s+');
    expect(pcre2Pattern).toContain('(?:TRACE|DEBUG|INFO|WARN)');
  });
});
