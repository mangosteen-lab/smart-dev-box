export interface RecipeLink {
  href: string;
  label: string;
  desc: string;
}

export interface RecipeStep {
  title: string;
  body: string;
}

export interface RecipeExample {
  title: string;
  body: string;
  code?: string;
}

export interface EngineeringRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'API Debugging' | 'DevOps' | 'Security' | 'Logs' | 'AI';
  targetQuery: string;
  metaDescription: string;
  keywords: string[];
  summary: string;
  problem: string;
  solution: string;
  steps: RecipeStep[];
  examples: RecipeExample[];
  checklist: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: RecipeLink[];
  relatedRecipeSlugs: string[];
}

export const ENGINEERING_RECIPES: EngineeringRecipe[] = [
  {
    slug: 'compare-json-api-responses',
    title: 'How to Compare Two Large JSON API Responses',
    shortTitle: 'Compare JSON responses',
    category: 'API Debugging',
    targetQuery: 'compare two JSON API responses',
    metaDescription:
      'Compare two large JSON API responses by formatting, normalizing, and diffing them locally in the browser with SmartDevBox.',
    keywords: [
      'compare two json api responses',
      'json response diff',
      'api response comparison',
      'large json diff online',
      'compare rest responses',
    ],
    summary:
      'Turn noisy minified API payloads into a readable, line-aligned diff so you can find changed fields, missing objects, renamed keys, and value regressions without uploading data.',
    problem:
      'Raw API responses are usually minified, nested, and too large to compare by eye. A one-field regression can hide inside thousands of characters, and whitespace differences create noisy diffs if the payloads are not formatted first.',
    solution:
      'Format both responses with the JSON Formatter, then compare the formatted output with Split & Diff. If the payload is deeply nested, use JSONPath first to isolate the object or array you actually need to compare.',
    steps: [
      {
        title: 'Format the first response',
        body:
          'Paste the first JSON response into SmartDevBox. The JSON Formatter should be suggested automatically for valid JSON; run it and copy the pretty-printed output.',
      },
      {
        title: 'Format the second response the same way',
        body:
          'Use the same indentation for the second payload. Consistent formatting prevents the diff from treating one-line minified JSON as a complete replacement.',
      },
      {
        title: 'Diff the formatted versions',
        body:
          'Open Split & Diff and paste the older response on the left and the newer response on the right. Review additions, removals, and changed lines.',
      },
      {
        title: 'Narrow the noisy parts',
        body:
          'For very large responses, extract the subtree you care about with JSONPath before diffing. This is usually faster than scanning a full response body.',
      },
    ],
    examples: [
      {
        title: 'Good JSON comparison target',
        body:
          'A useful comparison isolates the same entity or collection from two environments, builds, or API versions.',
        code:
          '{\n  "user": {\n    "id": "u_123",\n    "plan": "pro",\n    "flags": ["export", "audit"]\n  }\n}',
      },
      {
        title: 'What to look for in the diff',
        body:
          'Changed booleans, missing permissions, null values replacing strings, arrays returned in a different order, and IDs that changed unexpectedly are the usual regression signals.',
      },
    ],
    checklist: [
      'Use the same JSON formatter settings for both payloads.',
      'Compare the same endpoint, account, and query parameters.',
      'Normalize volatile fields such as request IDs, timestamps, and trace IDs before deciding a diff is meaningful.',
      'Use JSONPath when the response includes unrelated wrapper metadata.',
    ],
    faqs: [
      {
        q: 'Can I compare minified JSON directly?',
        a: 'You can, but the diff will be noisy because each payload may appear as one very long line. Formatting both responses first produces a useful line-by-line comparison.',
      },
      {
        q: 'Does SmartDevBox upload the API responses?',
        a: 'No. The JSON formatting and Split & Diff workflow runs in the browser. Your pasted response bodies stay in the tab.',
      },
    ],
    relatedLinks: [
      { href: '/tools/json-formatter', label: 'JSON Formatter', desc: 'Pretty-print and validate JSON before comparing.' },
      { href: '/tools/jsonpath-evaluator', label: 'JSONPath Evaluator', desc: 'Extract the specific subtree you want to diff.' },
      { href: '/features/compare', label: 'Split & Diff', desc: 'Compare two formatted payloads side by side.' },
    ],
    relatedRecipeSlugs: ['validate-openapi-json-before-importing', 'compare-llm-prompts-and-responses'],
  },
  {
    slug: 'decode-jwt-token-from-azure-ad',
    title: 'How to Decode a JWT Token from Azure AD or Entra ID',
    shortTitle: 'Decode Azure AD JWTs',
    category: 'Security',
    targetQuery: 'decode JWT token from Azure AD',
    metaDescription:
      'Decode an Azure AD or Microsoft Entra ID JWT locally, inspect claims, check expiry, and debug audience or scope issues without sending the token away.',
    keywords: ['decode jwt token from azure ad', 'entra id jwt decode', 'azure ad access token claims', 'decode id token locally'],
    summary:
      'Inspect an access token or ID token locally so you can confirm issuer, audience, scopes, roles, tenant, and expiry before blaming the API.',
    problem:
      'Azure AD and Entra ID tokens often fail because aud, scp, roles, tid, iss, or exp do not match what the API expects. The token is readable without the signing key, but pasting production tokens into random web tools is risky.',
    solution:
      'Use SmartDevBox JWT Decoder locally in the browser. Decode the header and payload, then use the Unix Timestamp Converter for exp and iat if you want a readable date.',
    steps: [
      {
        title: 'Paste the token into SmartDevBox',
        body:
          'Use only the compact JWT string, not the full Authorization header. If you have a header, remove the Bearer prefix first.',
      },
      {
        title: 'Inspect the header',
        body:
          'Check alg and kid. The kid identifies the signing key used by the identity provider, which matters when your API validates the token against a JWKS endpoint.',
      },
      {
        title: 'Check the payload claims',
        body:
          'Look at iss, aud, tid, exp, scp, roles, preferred_username, and oid. Most integration bugs are an audience mismatch, missing scope, or expired token.',
      },
      {
        title: 'Translate timestamps',
        body:
          'Copy exp or iat into the Unix Timestamp Converter to see the exact UTC and local time represented by the claim.',
      },
    ],
    examples: [
      {
        title: 'Common Azure AD claims to verify',
        body:
          'These claim names are the first place to look when an API rejects a Microsoft identity token.',
        code:
          '{\n  "iss": "https://login.microsoftonline.com/<tenant-id>/v2.0",\n  "aud": "api://your-api-client-id",\n  "scp": "Orders.Read",\n  "tid": "<tenant-id>",\n  "exp": 1735689600\n}',
      },
      {
        title: 'Access token vs ID token',
        body:
          'Use access tokens when calling APIs. ID tokens describe the signed-in user for the client application and often have the wrong audience for your backend.',
      },
    ],
    checklist: [
      'Confirm aud matches the API, not just the frontend app.',
      'Confirm scp or roles contains the permission your endpoint requires.',
      'Check exp before debugging code.',
      'Do not paste long-lived production tokens into server-side tools.',
    ],
    faqs: [
      {
        q: 'Do I need the secret or private key to decode the JWT?',
        a: 'No. The header and payload are Base64url encoded and can be read without the signing key. The key is only required to verify the signature.',
      },
      {
        q: 'Is decoding the token the same as validating it?',
        a: 'No. Decoding shows the claims. Validation also checks the signature, issuer, audience, expiry, and other policy rules on the server.',
      },
    ],
    relatedLinks: [
      { href: '/tools/jwt-decoder', label: 'JWT Decoder', desc: 'Decode header and payload claims locally.' },
      { href: '/tools/unix-timestamp-converter', label: 'Unix Timestamp Converter', desc: 'Turn exp and iat into readable dates.' },
      { href: '/features/privacy', label: 'Privacy & Security', desc: 'Understand the client-side processing model.' },
    ],
    relatedRecipeSlugs: ['find-secrets-before-sharing-logs', 'compare-json-api-responses'],
  },
  {
    slug: 'extract-urls-from-log-file',
    title: 'How to Extract All URLs from a Log File',
    shortTitle: 'Extract URLs from logs',
    category: 'Logs',
    targetQuery: 'extract all URLs from log file',
    metaDescription:
      'Extract URLs from logs, request traces, and pasted terminal output locally in the browser, then parse query strings and compare endpoints.',
    keywords: ['extract all urls from log file', 'extract urls from logs', 'find urls in text', 'url extractor for logs'],
    summary:
      'Pull every URL out of noisy logs, then parse the important ones into scheme, host, path, query parameters, and fragments.',
    problem:
      'Logs mix timestamps, severity labels, request IDs, stack traces, and URLs. Searching manually misses wrapped URLs and makes it hard to inspect query parameters.',
    solution:
      'Use Smart Extract or the URL extraction tool to collect URLs, then feed individual URLs into URL Parser for structured inspection.',
    steps: [
      {
        title: 'Paste the log chunk',
        body:
          'Paste the relevant log section into SmartDevBox. Keep enough surrounding context to understand which request produced each URL.',
      },
      {
        title: 'Extract URLs',
        body:
          'Run Smart Extract or Extract URLs. The output gives you a clean list that is easier to sort, dedupe, or inspect.',
      },
      {
        title: 'Parse suspicious URLs',
        body:
          'Send a selected URL into URL Parser to break out path segments and query parameters. This is useful for signed URLs, redirects, and API calls.',
      },
      {
        title: 'Dedupe and compare',
        body:
          'If the log contains repeated requests, run Line Dedupe before reviewing the list.',
      },
    ],
    examples: [
      {
        title: 'Mixed log input',
        body:
          'This kind of line is easier to process with extraction first and URL parsing second.',
        code:
          '2026-06-03T14:18:22Z INFO redirect target=https://api.example.com/v1/orders?status=open&limit=50 request_id=req_7f3a',
      },
    ],
    checklist: [
      'Preserve a copy of the original log before transforming it.',
      'Dedupe only after extraction so duplicate request volume is not lost accidentally.',
      'Inspect query parameters for tokens before sharing output.',
      'Use URL Decode if query values are percent-encoded.',
    ],
    faqs: [
      {
        q: 'Can this handle URLs inside JSON log fields?',
        a: 'Yes. Extract URLs works over plain text, so it can find URLs inside JSON strings, stack traces, and mixed logs.',
      },
      {
        q: 'Should I upload production logs to a web service?',
        a: 'Avoid uploading sensitive logs. SmartDevBox runs the extraction workflow in your browser so the pasted text is not sent to a server.',
      },
    ],
    relatedLinks: [
      { href: '/features/smart-extract', label: 'Smart Extract', desc: 'Extract URLs with position metadata.' },
      { href: '/tools/url-parser', label: 'URL Parser', desc: 'Break URLs into components and query params.' },
      { href: '/tools/url-decoder', label: 'URL Decoder', desc: 'Decode percent-encoded URL values.' },
    ],
    relatedRecipeSlugs: ['extract-ips-from-nginx-logs', 'find-secrets-before-sharing-logs'],
  },
  {
    slug: 'find-secrets-before-sharing-logs',
    title: 'How to Find Obvious Secrets Before Sharing Logs',
    shortTitle: 'Find secrets in logs',
    category: 'Security',
    targetQuery: 'find leaked secrets in logs',
    metaDescription:
      'Review logs for obvious tokens, JWTs, API keys, URLs, emails, and encoded values locally before pasting them into chats, tickets, or bug reports.',
    keywords: ['find leaked secrets in logs', 'detect api keys in logs', 'redact secrets before sharing logs', 'jwt in logs'],
    summary:
      'Use local extraction and inspection tools to catch common sensitive values before a log leaves your machine.',
    problem:
      'Logs often contain Authorization headers, signed URLs, session IDs, emails, JWTs, Base64 blobs, and API keys. Sharing them unchanged in a ticket or chat can leak access.',
    solution:
      'Run a local review pass with Smart Extract, Regex Tester, JWT Decoder, URL Parser, and Base64 Decoder. Redact anything that looks like a credential before sharing.',
    steps: [
      {
        title: 'Extract structured values first',
        body:
          'Use Smart Extract to list URLs, emails, dates, JSON blocks, and other structured spans. These are the places where secrets are most likely to hide.',
      },
      {
        title: 'Search for common credential labels',
        body:
          'Use Regex Tester or browser search for labels such as authorization, bearer, token, api_key, client_secret, password, cookie, set-cookie, x-api-key, and signature.',
      },
      {
        title: 'Decode tokens before deciding they are safe',
        body:
          'A JWT payload can contain emails, tenant IDs, account IDs, scopes, and roles. Decode it locally and redact the token if it represents a real user or environment.',
      },
      {
        title: 'Redact with context preserved',
        body:
          'Replace only the sensitive value, not the surrounding field name. For example, keep Authorization: Bearer [redacted] so the reader still understands the failure path.',
      },
    ],
    examples: [
      {
        title: 'Suspicious patterns to review',
        body:
          'Use these as starting points, not a complete security scanner. Provider-specific key formats change over time.',
        code:
          'Authorization: Bearer <jwt>\nX-API-Key: <value>\nclient_secret=<value>\nhttps://example.com/download?X-Amz-Signature=<value>',
      },
    ],
    checklist: [
      'Redact Authorization and Cookie headers.',
      'Inspect signed URLs and query strings.',
      'Decode JWTs locally before sharing.',
      'Remove emails and account IDs when they are not needed for debugging.',
      'Rotate credentials if a real secret was already shared.',
    ],
    faqs: [
      {
        q: 'Is this a full secret scanner?',
        a: 'No. This recipe is a practical local review workflow using existing SmartDevBox tools. For CI or repository scanning, use a dedicated scanner in addition to manual review.',
      },
      {
        q: 'Why decode Base64 or JWT values?',
        a: 'Encoded values are not necessarily safe. Base64 and JWT payloads are readable encodings, not encryption.',
      },
    ],
    relatedLinks: [
      { href: '/features/smart-extract', label: 'Smart Extract', desc: 'Surface URLs, emails, JSON, and dates inside logs.' },
      { href: '/tools/jwt-decoder', label: 'JWT Decoder', desc: 'Read token claims before sharing.' },
      { href: '/tools/base64-decoder', label: 'Base64 Decoder', desc: 'Check encoded values locally.' },
      { href: '/tools/regex-tester', label: 'Regex Tester', desc: 'Search logs for credential-like labels.' },
    ],
    relatedRecipeSlugs: ['decode-jwt-token-from-azure-ad', 'extract-urls-from-log-file'],
  },
  {
    slug: 'compare-kubernetes-yaml-files',
    title: 'How to Compare Kubernetes YAML Files Before Deploying',
    shortTitle: 'Compare Kubernetes YAML',
    category: 'DevOps',
    targetQuery: 'compare Kubernetes YAML files',
    metaDescription:
      'Compare Kubernetes YAML manifests by converting to normalized JSON, formatting, and diffing deployment, service, and config changes locally.',
    keywords: ['compare kubernetes yaml files', 'kubernetes yaml diff', 'compare k8s manifests', 'yaml diff deployment'],
    summary:
      'Reduce YAML whitespace noise and focus on real manifest changes before applying a deployment.',
    problem:
      'Kubernetes manifests are sensitive to indentation and often include generated metadata. Plain text diffs mix meaningful spec changes with formatting noise.',
    solution:
      'Convert YAML to JSON, format the output, and diff normalized structures. For a quick text review, use Split & Diff directly on the YAML files.',
    steps: [
      {
        title: 'Strip generated metadata if needed',
        body:
          'Remove fields such as managedFields, resourceVersion, uid, and status when comparing live exports against source manifests.',
      },
      {
        title: 'Convert each manifest to JSON',
        body:
          'Run YAML to JSON on both versions. JSON makes object boundaries explicit and helps catch indentation mistakes.',
      },
      {
        title: 'Format and compare',
        body:
          'Format both JSON outputs, then use Split & Diff to review the actual spec differences.',
      },
      {
        title: 'Check risky fields',
        body:
          'Pay special attention to image tags, env vars, secret references, ports, selectors, replicas, probes, resources, and serviceAccountName.',
      },
    ],
    examples: [
      {
        title: 'Fields that often matter',
        body:
          'Small changes in these paths can change rollout behavior or route traffic incorrectly.',
        code:
          'spec.template.spec.containers[].image\nspec.template.spec.containers[].env\nspec.selector.matchLabels\nspec.ports[]\nspec.template.spec.serviceAccountName',
      },
    ],
    checklist: [
      'Compare source manifests against source manifests when possible.',
      'Remove generated cluster fields before diffing live exports.',
      'Confirm labels and selectors still match.',
      'Check that secret names are references, not raw secret values.',
    ],
    faqs: [
      {
        q: 'Why convert YAML to JSON before diffing?',
        a: 'JSON formatting makes the structure explicit and reduces confusion from YAML indentation, comments, and style differences.',
      },
      {
        q: 'Can SmartDevBox validate Kubernetes schemas?',
        a: 'SmartDevBox can convert and format YAML/JSON, but it is not a Kubernetes schema validator. Use kubectl dry-run or a dedicated policy tool for cluster-specific validation.',
      },
    ],
    relatedLinks: [
      { href: '/tools/yaml-to-json', label: 'YAML to JSON', desc: 'Convert manifests into explicit JSON structures.' },
      { href: '/tools/json-formatter', label: 'JSON Formatter', desc: 'Format converted manifests consistently.' },
      { href: '/features/compare', label: 'Split & Diff', desc: 'Review manifest changes side by side.' },
    ],
    relatedRecipeSlugs: ['validate-openapi-json-before-importing', 'extract-ips-from-nginx-logs'],
  },
  {
    slug: 'extract-ips-from-nginx-logs',
    title: 'How to Extract IP Addresses from nginx Logs',
    shortTitle: 'Extract IPs from nginx',
    category: 'Logs',
    targetQuery: 'extract IPs from nginx logs',
    metaDescription:
      'Extract client IP addresses from nginx logs, dedupe them, inspect ranges, and calculate CIDR blocks locally in the browser.',
    keywords: ['extract ips from nginx logs', 'nginx log ip extractor', 'dedupe ip addresses', 'cidr calculator for logs'],
    summary:
      'Turn noisy access logs into a clean list of client IPs for incident triage, rate-limit analysis, or firewall review.',
    problem:
      'Access logs contain methods, paths, status codes, user agents, and referrers around each IP. During an incident you need the IP list quickly, not the whole log.',
    solution:
      'Use text extraction and line tools to isolate IPs, dedupe repeated addresses, then inspect individual IPs or CIDR ranges.',
    steps: [
      {
        title: 'Paste the relevant access log window',
        body:
          'Use a time window around the event you are investigating. Include enough lines to capture repeated clients and error bursts.',
      },
      {
        title: 'Extract IPv4 values',
        body:
          'Use Regex Tester with an IPv4 pattern or an IP-focused tool if available in your workflow. Keep proxy headers in mind if nginx logs X-Forwarded-For.',
      },
      {
        title: 'Dedupe and sort',
        body:
          'Run Line Dedupe and Line Sort to get a stable list for review.',
      },
      {
        title: 'Inspect ranges',
        body:
          'Use IP Inspector and CIDR Calculator for suspicious addresses or allow/block-list planning.',
      },
    ],
    examples: [
      {
        title: 'Basic IPv4 extraction pattern',
        body:
          'This pattern is useful for quick triage. It does not prove the value is a routable public address.',
        code:
          '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
      },
    ],
    checklist: [
      'Check whether the first field is a proxy IP or the real client IP.',
      'Review X-Forwarded-For if your log format includes it.',
      'Dedupe after extraction, not before.',
      'Validate suspicious addresses before creating firewall rules.',
    ],
    faqs: [
      {
        q: 'Does the basic regex validate every IPv4 octet?',
        a: 'No. It finds IPv4-shaped values quickly. Use IP Inspector to validate and classify addresses after extraction.',
      },
      {
        q: 'What about IPv6?',
        a: 'IPv6 extraction needs a different pattern. For mixed logs, inspect your nginx log format and add an IPv6 pattern before deduping.',
      },
    ],
    relatedLinks: [
      { href: '/tools/regex-tester', label: 'Regex Tester', desc: 'Extract IPv4-shaped values from logs.' },
      { href: '/tools/ip-inspector', label: 'IP Inspector', desc: 'Inspect and classify IP addresses.' },
      { href: '/tools/cidr-calculator', label: 'CIDR Calculator', desc: 'Calculate network ranges for allow/block lists.' },
    ],
    relatedRecipeSlugs: ['extract-urls-from-log-file', 'compare-kubernetes-yaml-files'],
  },
  {
    slug: 'validate-openapi-json-before-importing',
    title: 'How to Validate OpenAPI JSON Before Importing It',
    shortTitle: 'Validate OpenAPI JSON',
    category: 'API Debugging',
    targetQuery: 'validate OpenAPI JSON before importing',
    metaDescription:
      'Clean up OpenAPI JSON or YAML before importing it into API tools by validating syntax, converting YAML to JSON, and inspecting paths locally.',
    keywords: ['validate openapi json', 'openapi json validator', 'convert openapi yaml to json', 'api schema import error'],
    summary:
      'Catch syntax, encoding, and structural mistakes before an OpenAPI document fails in your gateway, docs generator, or API client.',
    problem:
      'OpenAPI import errors are often vague. The root cause may be invalid JSON, YAML indentation, duplicate-looking paths, broken escaping, or an unexpectedly huge field.',
    solution:
      'Use SmartDevBox to validate JSON syntax, convert YAML to JSON, format the document, inspect size, and extract the path or schema section you are debugging.',
    steps: [
      {
        title: 'Normalize the document format',
        body:
          'If the source is YAML, convert it to JSON first. If it is already JSON, run JSON Validate to catch syntax errors with line and column information.',
      },
      {
        title: 'Pretty-print for review',
        body:
          'Run JSON Formatter so paths, components, schemas, and responses are easy to scan.',
      },
      {
        title: 'Inspect specific paths',
        body:
          'Use JSONPath to focus on paths, components.schemas, or a single operation object instead of scrolling the entire document.',
      },
      {
        title: 'Compare against a known-good version',
        body:
          'If a recent change broke import, format both versions and use Split & Diff to isolate the changed section.',
      },
    ],
    examples: [
      {
        title: 'Useful JSONPath targets',
        body:
          'These expressions help isolate common OpenAPI sections.',
        code:
          '$.paths\n$.components.schemas\n$.paths["/users/{id}"].get\n$.info.version',
      },
    ],
    checklist: [
      'Validate syntax before debugging semantic OpenAPI rules.',
      'Convert YAML to JSON when indentation is suspect.',
      'Diff against the last version that imported successfully.',
      'Use an OpenAPI-specific validator after syntax cleanup.',
    ],
    faqs: [
      {
        q: 'Is SmartDevBox an OpenAPI schema validator?',
        a: 'No. It validates and transforms JSON/YAML syntax and helps inspect the document. Use an OpenAPI-specific validator for semantic rules.',
      },
      {
        q: 'Why does YAML import fail when it looks correct?',
        a: 'Indentation, tabs, multiline strings, and implicit values can change the parsed structure. Converting to JSON makes the actual structure visible.',
      },
    ],
    relatedLinks: [
      { href: '/tools/json-validator', label: 'JSON Validator', desc: 'Catch JSON syntax errors with location details.' },
      { href: '/tools/yaml-to-json', label: 'YAML to JSON', desc: 'Reveal the parsed structure of YAML specs.' },
      { href: '/tools/jsonpath-evaluator', label: 'JSONPath Evaluator', desc: 'Inspect specific OpenAPI sections.' },
    ],
    relatedRecipeSlugs: ['compare-json-api-responses', 'compare-kubernetes-yaml-files'],
  },
  {
    slug: 'convert-curl-request-to-markdown',
    title: 'How to Turn a curl Request into Markdown Documentation',
    shortTitle: 'curl to Markdown docs',
    category: 'API Debugging',
    targetQuery: 'convert curl request to markdown',
    metaDescription:
      'Document a curl request by extracting the URL, headers, method, payload, and response into clean Markdown using local browser tools.',
    keywords: ['convert curl request to markdown', 'document curl command', 'api request markdown example', 'curl to docs'],
    summary:
      'Transform a copied terminal command into readable API documentation without leaking headers or tokens.',
    problem:
      'curl commands copied from terminals or browser devtools are hard to read. They often include bearer tokens, cookies, compressed headers, and escaped JSON bodies.',
    solution:
      'Extract and parse the URL, decode query parameters, format the JSON body, redact credentials, then assemble a Markdown section and preview it locally.',
    steps: [
      {
        title: 'Separate the request parts',
        body:
          'Identify the method, URL, headers, and body. Smart Extract can help pull the URL and embedded JSON from a long command.',
      },
      {
        title: 'Parse the URL',
        body:
          'Use URL Parser to split host, path, and query parameters. This makes documentation clearer than leaving everything in one shell line.',
      },
      {
        title: 'Format the body',
        body:
          'If the request contains JSON, unescape it if needed and format it before placing it in a Markdown code fence.',
      },
      {
        title: 'Redact credentials',
        body:
          'Replace Authorization, Cookie, and API key headers with placeholders before previewing or sharing the docs.',
      },
    ],
    examples: [
      {
        title: 'Markdown shape',
        body:
          'A readable API example separates request metadata from payload.',
        code:
          '### Create order\n\nPOST /v1/orders\n\nHeaders:\n- Authorization: Bearer [redacted]\n- Content-Type: application/json\n\n```json\n{\n  "sku": "demo-1",\n  "quantity": 2\n}\n```',
      },
    ],
    checklist: [
      'Redact tokens before writing docs.',
      'Decode query parameters before explaining them.',
      'Format JSON bodies before adding code fences.',
      'Preview Markdown before publishing.',
    ],
    faqs: [
      {
        q: 'Does SmartDevBox directly convert curl to Markdown?',
        a: 'Not as a single dedicated tool today. This recipe uses existing URL, JSON, text, and Markdown preview tools to build clean documentation.',
      },
      {
        q: 'Why not paste the raw curl command into docs?',
        a: 'Raw curl commands are difficult to scan and often include sensitive headers. Structured Markdown is easier to review and safer to share.',
      },
    ],
    relatedLinks: [
      { href: '/features/smart-extract', label: 'Smart Extract', desc: 'Pull URL and JSON sections from a copied curl command.' },
      { href: '/tools/url-parser', label: 'URL Parser', desc: 'Document path and query parameters clearly.' },
      { href: '/tools/markdown-preview', label: 'Markdown Preview', desc: 'Preview the finished API docs.' },
    ],
    relatedRecipeSlugs: ['find-secrets-before-sharing-logs', 'validate-openapi-json-before-importing'],
  },
  {
    slug: 'compare-llm-prompts-and-responses',
    title: 'How to Compare Prompts and LLM Responses',
    shortTitle: 'Compare LLM prompts',
    category: 'AI',
    targetQuery: 'compare prompts and LLM responses',
    metaDescription:
      'Compare two prompts, system messages, or LLM responses locally with formatting, Markdown preview, and side-by-side diff.',
    keywords: ['compare prompts', 'compare llm responses', 'prompt diff tool', 'diff chatgpt outputs'],
    summary:
      'Find exactly what changed between prompt versions or model responses without losing formatting in a chat interface.',
    problem:
      'Prompt edits are often small but consequential. A changed instruction, missing delimiter, or reordered example can change the output, and chat UIs are poor diff tools.',
    solution:
      'Normalize the prompt or response text, preview Markdown if needed, and use Split & Diff to compare versions side by side.',
    steps: [
      {
        title: 'Keep versions separate',
        body:
          'Copy the old prompt or response and the new one as separate blocks. Include system, developer, and user sections if they affect behavior.',
      },
      {
        title: 'Normalize whitespace intentionally',
        body:
          'Use trim, remove empty lines, or formatting tools only when whitespace is not meaningful to the prompt. Otherwise preserve exact text.',
      },
      {
        title: 'Diff the two versions',
        body:
          'Use Split & Diff to review line additions, removals, and edits. This is especially helpful for long few-shot examples.',
      },
      {
        title: 'Preview Markdown output',
        body:
          'If the model response is Markdown, use Markdown Preview to check whether headings, lists, and code fences render correctly.',
      },
    ],
    examples: [
      {
        title: 'Prompt sections worth labeling',
        body:
          'Clear labels make prompt diffs easier to understand later.',
        code:
          'SYSTEM:\nYou are a concise API documentation assistant.\n\nUSER:\nWrite examples for POST /orders.\n\nCONSTRAINTS:\nReturn Markdown only.',
      },
    ],
    checklist: [
      'Keep role labels when comparing multi-message prompts.',
      'Preserve delimiters and code fences.',
      'Compare outputs from the same input when evaluating model changes.',
      'Use Markdown Preview for responses intended for documentation.',
    ],
    faqs: [
      {
        q: 'Should I remove whitespace before comparing prompts?',
        a: 'Only if whitespace is not semantically important. For prompts with code, tables, YAML, or Markdown, preserve formatting.',
      },
      {
        q: 'Can I compare JSON responses from an LLM?',
        a: 'Yes. Format both JSON outputs first, then diff the formatted results for a cleaner comparison.',
      },
    ],
    relatedLinks: [
      { href: '/features/compare', label: 'Split & Diff', desc: 'Compare prompt or response versions.' },
      { href: '/tools/markdown-preview', label: 'Markdown Preview', desc: 'Preview Markdown responses.' },
      { href: '/tools/json-formatter', label: 'JSON Formatter', desc: 'Normalize JSON outputs before diffing.' },
    ],
    relatedRecipeSlugs: ['compare-json-api-responses', 'convert-curl-request-to-markdown'],
  },
  {
    slug: 'inspect-x509-certificate-before-renewal',
    title: 'How to Inspect an X.509 Certificate Before Renewal',
    shortTitle: 'Inspect X.509 renewal',
    category: 'Security',
    targetQuery: 'inspect x509 certificate before renewal',
    metaDescription:
      'Inspect an X.509 certificate before renewal by checking subject, issuer, validity dates, SANs, public key, and extensions locally.',
    keywords: ['inspect x509 certificate before renewal', 'certificate renewal checklist', 'decode pem certificate', 'x509 san check'],
    summary:
      'Decode a PEM certificate locally and verify the fields that can break HTTPS after renewal.',
    problem:
      'Certificate renewals fail when the new certificate has the wrong SAN, issuer chain, key type, validity period, or environment. These issues are easy to miss if you only check that a PEM file exists.',
    solution:
      'Use Certificate Decoder to inspect the certificate fields, compare old and new decoded outputs, and convert validity timestamps if needed.',
    steps: [
      {
        title: 'Decode the current certificate',
        body:
          'Paste the existing PEM certificate into Certificate Decoder and save the decoded output for comparison.',
      },
      {
        title: 'Decode the renewed certificate',
        body:
          'Run the same decoder on the new certificate. Check subject, issuer, notBefore, notAfter, public key algorithm, and Subject Alternative Name values.',
      },
      {
        title: 'Compare old and new outputs',
        body:
          'Use Split & Diff to compare decoded fields. Expected differences include validity dates and serial number; unexpected SAN or issuer changes need review.',
      },
      {
        title: 'Check dependent formats',
        body:
          'If you receive escaped PEM text from a secret store or JSON file, unescape it before decoding.',
      },
    ],
    examples: [
      {
        title: 'Renewal fields to compare',
        body:
          'These fields are commonly responsible for post-renewal breakage.',
        code:
          'Subject\nIssuer\nValidity: Not Before / Not After\nSubject Alternative Name\nPublic Key Algorithm\nKey Usage / Extended Key Usage',
      },
    ],
    checklist: [
      'Confirm every production hostname appears in SAN.',
      'Confirm the renewed certificate is for the right environment.',
      'Compare issuer and chain expectations.',
      'Check expiry in UTC and local time.',
      'Keep private keys out of browser tools; only paste public certificates.',
    ],
    faqs: [
      {
        q: 'Can I paste a private key into Certificate Decoder?',
        a: 'Do not paste private keys. The certificate decoder is meant for public X.509 certificates, not private key material.',
      },
      {
        q: 'Why does SAN matter more than CN?',
        a: 'Modern TLS clients validate hostnames against Subject Alternative Name. A correct common name does not fix a missing SAN entry.',
      },
    ],
    relatedLinks: [
      { href: '/tools/certificate-decoder', label: 'Certificate Decoder', desc: 'Decode PEM-encoded X.509 certificates.' },
      { href: '/features/compare', label: 'Split & Diff', desc: 'Compare old and renewed certificate fields.' },
      { href: '/glossary/what-is-an-x509-certificate', label: 'What is an X.509 certificate?', desc: 'Review certificate concepts and field meanings.' },
    ],
    relatedRecipeSlugs: ['find-secrets-before-sharing-logs', 'decode-jwt-token-from-azure-ad'],
  },
];

export const RECIPE_SLUG_MAP = new Map<string, EngineeringRecipe>(
  ENGINEERING_RECIPES.map((recipe) => [recipe.slug, recipe])
);

export const RECIPE_CATEGORIES = Array.from(
  new Set(ENGINEERING_RECIPES.map((recipe) => recipe.category))
);
