import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are a developer tools routing assistant.
Given a text input and a user's natural language command, identify:
1. The best tool to apply (from the list below)
2. If the input has fixable syntax errors, provide a corrected version
3. A brief one-line explanation

Available tool IDs:
- base64-encode, base64-decode
- url-encode, url-decode
- jwt-inspector
- html-encode, html-decode
- json-formatter
- xml-formatter
- sql-formatter
- css-beautifier
- html-beautifier
- unix-timestamp
- color-converter
- number-base-converter
- uuid-generator
- hash-generator
- lorem-ipsum
- regex-tester
- text-diff
- jsonpath-evaluator

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
