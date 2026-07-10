import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a developer tools routing assistant.
Given a text input and a user's natural language command, identify:
1. The best tool to apply (from the list below)
2. If the input has fixable syntax errors, provide a corrected version
3. A brief one-line explanation

Available tool IDs:
- base64-encode, base64-decode
- base32-encode, base32-decode
- lz-string-compress, lz-string-decompress
- url-encode, url-decode, url-parser
- rot13, rot47
- jwt-inspector
- html-encode, html-decode
- backslash-escape, backslash-unescape
- json-formatter, json-validate
- json-escape, json-unescape
- xml-formatter, xml-minify, xml-to-json, json-to-xml
- sql-formatter
- css-beautifier, css-minify
- html-beautifier
- js-beautifier, js-minifier, js-validate
- markdown-preview, markdown-to-html
- html-to-text
- unix-timestamp
- color-converter
- number-base-converter
- uuid-generator
- hash-generator
- lorem-ipsum
- random-number, random-password, random-ip, random-mac
- regex-tester, regex-generator
- jsonpath-evaluator
- word-count, text-reverse, text-trim
- remove-empty-lines, number-lines, prefix-lines, suffix-lines
- join-lines, extract-emails, extract-urls, extract-numbers

- invert-case
- line-sort, line-dedupe, line-reverse
- lowercase, uppercase, title-case
- camel-case, pascal-case, snake-case, kebab-case, constant-case
- json-to-csv, json-to-tsv, json-to-yaml, yaml-to-json, csv-to-json
- decimal-to-roman, roman-to-decimal
- seconds-to-hms, hms-to-seconds
- html-to-jsx, uuid-hex-converter

Respond ONLY with a JSON object in this exact format:
{
  "toolId": "<tool-id>",
  "correctedInput": null or "<corrected input string>",
  "explanation": "<one line>"
}`;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  const { input, userCommand } = await req.json();

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  const userMessage = `Input (first 500 chars): ${String(input).slice(0, 500)}\n\nUser command: ${userCommand}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 512,
    });

    const content = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI request failed' },
      { status: 500 }
    );
  }
}
