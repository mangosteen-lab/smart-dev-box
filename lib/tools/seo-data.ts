/**
 * SEO content for individual tool landing pages.
 * Each entry corresponds to a tool `id` in the registry and provides
 * rich content for the /tools/[slug] route: heading, long description,
 * use cases, FAQs, related tool IDs, and target keywords.
 */

export interface ToolSeoData {
  /** Tool registry id — must match ToolDefinition.id */
  id: string;
  /** URL slug — used as /tools/[slug] */
  slug: string;
  /** H1 heading for the page */
  heading: string;
  /** Target SEO keyword (primary) */
  primaryKeyword: string;
  /** Meta description (150–160 chars) */
  metaDescription: string;
  /** 2–4 sentence intro / long description shown on the page */
  intro: string;
  /** Bullet list of common use cases */
  useCases: string[];
  /** FAQ pairs for FAQ schema + People Also Ask */
  faqs: { q: string; a: string }[];
  /** IDs of related tools to link to */
  relatedToolIds: string[];
  /** Additional keywords for <meta keywords> */
  keywords: string[];
}

export const TOOL_SEO_DATA: ToolSeoData[] = [
  // ── Encoding / Decoding ────────────────────────────────────────────────────

  {
    id: 'base64-decode',
    slug: 'base64-decoder',
    heading: 'Base64 Decoder — Decode Base64 Online, Free',
    primaryKeyword: 'base64 decode online',
    metaDescription:
      'Decode any Base64 string back to plain text instantly in your browser. Free, no sign-up, 100% client-side. Supports standard and URL-safe Base64.',
    intro:
      'Base64 Decoder converts Base64-encoded strings back into readable plain text entirely in your browser. ' +
      'Paste any Base64 string — with or without padding — and the decoded result appears instantly. ' +
      'Both standard Base64 (RFC 4648) and URL-safe Base64 variants are supported. ' +
      'No data is sent to a server; all decoding runs locally via JavaScript.',
    useCases: [
      'Decoding Base64-encoded API response payloads',
      'Reading Base64-encoded email attachments (MIME)',
      'Decoding embedded Base64 data URIs in HTML or CSS',
      'Inspecting Base64-encoded secrets or tokens in config files',
      'Converting Base64-encoded binary data back to text',
    ],
    faqs: [
      {
        q: 'What is Base64 encoding?',
        a: 'Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is widely used to transmit binary data over text-based protocols like HTTP, email (MIME), and JSON.',
      },
      {
        q: 'How do I decode a Base64 string online?',
        a: 'Paste your Base64 string into SmartDevBox. The tool automatically detects Base64 encoding and decodes it to plain text — no manual tool selection needed.',
      },
      {
        q: 'What is the difference between standard Base64 and URL-safe Base64?',
        a: 'Standard Base64 uses + and / as the 62nd and 63rd characters. URL-safe Base64 replaces them with - and _ so the encoded string can be used safely in URLs and file names without percent-encoding.',
      },
      {
        q: 'Can I decode a Base64 image data URI?',
        a: 'Yes. Paste a Base64 data URI (e.g. data:image/png;base64,...) and use the Base64 Image Decode tool to see the MIME type and byte size. To decode generic Base64, use this Base64 Decoder.',
      },
    ],
    relatedToolIds: ['base64-encode', 'base64-image-decode', 'url-decode', 'jwt-inspector'],
    keywords: ['base64 decode', 'base64 decoder online', 'decode base64 string', 'base64 to text', 'b64 decode'],
  },

  {
    id: 'base64-encode',
    slug: 'base64-encoder',
    heading: 'Base64 Encoder — Encode Text to Base64 Online',
    primaryKeyword: 'base64 encode online',
    metaDescription:
      'Encode any text or string to Base64 instantly in your browser. Free, no sign-up, 100% client-side. Results copy with one click.',
    intro:
      'Base64 Encoder converts any plain text string into its Base64 representation in your browser. ' +
      'Paste your text and the encoded result appears immediately — no button to click. ' +
      'Standard RFC 4648 Base64 encoding is used, with = padding applied automatically. ' +
      'All encoding runs client-side; your data never leaves your machine.',
    useCases: [
      'Encoding credentials for HTTP Basic Authentication headers',
      'Embedding binary data inside JSON or XML payloads',
      'Creating Base64 data URIs for inline images in HTML or CSS',
      'Encoding configuration secrets for environment variables',
      'Preparing binary payloads for text-only transmission protocols',
    ],
    faqs: [
      {
        q: 'How do I encode text to Base64?',
        a: 'Paste your text into SmartDevBox. The Base64 Encoder converts it instantly. You can also type directly into the input field and the encoded output updates in real time.',
      },
      {
        q: 'Does Base64 encoding encrypt my data?',
        a: 'No. Base64 is an encoding scheme, not encryption. It is trivially reversible by anyone. Do not use Base64 to protect sensitive data — use proper encryption for that.',
      },
      {
        q: 'Why does Base64 output always end with = or ==?',
        a: 'Base64 encodes 3 bytes at a time into 4 characters. If the input length is not divisible by 3, padding characters (=) are added to make the output length a multiple of 4.',
      },
    ],
    relatedToolIds: ['base64-decode', 'base64-image-decode', 'url-encode', 'html-encode'],
    keywords: ['base64 encode', 'base64 encoder online', 'text to base64', 'encode base64 string', 'b64 encode'],
  },

  {
    id: 'jwt-inspector',
    slug: 'jwt-decoder',
    heading: 'JWT Decoder — Decode & Inspect JWT Tokens Online',
    primaryKeyword: 'jwt decoder online',
    metaDescription:
      'Decode JWT tokens and inspect header, payload, and signature instantly. Free, no sign-up. Works without the signing secret. 100% client-side.',
    intro:
      'JWT Inspector decodes JSON Web Tokens (JWTs) and displays the header and payload as formatted JSON. ' +
      'You do not need the signing secret to read the claims — the tool simply decodes the Base64url-encoded parts. ' +
      'It shows all standard claims (iss, sub, aud, exp, iat, jti) along with any custom claims. ' +
      'All decoding runs in the browser; your token never leaves your machine.',
    useCases: [
      'Inspecting the claims inside an access token or ID token',
      'Checking token expiry (exp) and issued-at (iat) timestamps',
      'Debugging authentication issues with JWT-based APIs',
      'Reading the algorithm (alg) and key ID (kid) from the header',
      'Verifying that your server generates the expected payload claims',
    ],
    faqs: [
      {
        q: 'How do I decode a JWT token without a secret?',
        a: 'Paste your JWT into SmartDevBox. The JWT Inspector decodes the header and payload and displays them as formatted JSON. You do not need the signing secret to read the claims — only to verify the signature.',
      },
      {
        q: 'Is it safe to paste a JWT into an online decoder?',
        a: 'SmartDevBox decodes entirely in your browser with no server communication. Your token never leaves your machine. For maximum safety, avoid pasting production tokens with long expiry into any online tool.',
      },
      {
        q: 'What is the structure of a JWT?',
        a: 'A JWT consists of three Base64url-encoded parts separated by dots: header.payload.signature. The header specifies the algorithm; the payload contains the claims; the signature verifies the token was not tampered with.',
      },
      {
        q: 'Can SmartDevBox verify the JWT signature?',
        a: 'The JWT Inspector shows the signature string but marks it as "not verified" because signature verification requires the secret key. Use the JWT Encoder tool on SmartDevBox to sign tokens with HS256/HS384/HS512.',
      },
    ],
    relatedToolIds: ['jwt-encoder', 'base64-decode', 'url-decode', 'json-formatter'],
    keywords: ['jwt decoder', 'jwt decode online', 'decode jwt token', 'jwt inspector', 'jwt parser online', 'json web token decoder'],
  },

  {
    id: 'jwt-encoder',
    slug: 'jwt-encoder',
    heading: 'JWT Encoder — Create & Sign JWT Tokens Online',
    primaryKeyword: 'jwt encoder online',
    metaDescription:
      'Create and sign JWT tokens using HMAC HS256, HS384, or HS512 in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'JWT Encoder lets you build and sign JSON Web Tokens directly in your browser. ' +
      'Provide a JSON payload and a secret key, choose your HMAC algorithm (HS256, HS384, or HS512), and receive a signed JWT. ' +
      'The Web Crypto API handles all signing locally — your payload and secret are never transmitted to a server. ' +
      'The output panel shows the full token alongside the decoded header and payload for easy verification.',
    useCases: [
      'Generating test tokens for JWT-protected API endpoints',
      'Creating tokens for development and staging environments',
      'Testing how your application handles different claims (exp, iss, sub)',
      'Learning and experimenting with JWT structure and signing',
    ],
    faqs: [
      {
        q: 'Which JWT signing algorithms does SmartDevBox support?',
        a: 'SmartDevBox supports HMAC-based symmetric algorithms: HS256 (HMAC-SHA256), HS384 (HMAC-SHA384), and HS512 (HMAC-SHA512). Asymmetric algorithms (RS256, ES256) are not yet supported.',
      },
      {
        q: 'What payload format does the JWT Encoder expect?',
        a: 'The payload must be a valid JSON object. For example: { "sub": "user123", "iat": 1700000000, "exp": 1700003600 }. The iat (issued-at) claim is added automatically if not included.',
      },
    ],
    relatedToolIds: ['jwt-inspector', 'base64-decode', 'hash-generator', 'json-formatter'],
    keywords: ['jwt encoder', 'jwt sign online', 'create jwt token', 'sign jwt hs256', 'generate jwt online'],
  },

  {
    id: 'url-encode',
    slug: 'url-encoder',
    heading: 'URL Encoder — Percent-Encode Strings for URLs Online',
    primaryKeyword: 'url encode online',
    metaDescription:
      'Percent-encode any string for safe use in URLs instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'URL Encoder applies percent-encoding (also called URI encoding) to any string, converting special characters to their %XX equivalents. ' +
      'This is required whenever arbitrary text needs to appear in a URL query parameter or path segment. ' +
      'SmartDevBox uses the standard encodeURIComponent() encoding, which encodes all characters except A–Z, a–z, 0–9, -, _, ., and ~.',
    useCases: [
      'Encoding query parameter values containing spaces or special characters',
      'Building URLs programmatically with dynamic user input',
      'Encoding OAuth redirect_uri and state parameters',
      'Preparing strings for inclusion in HTML href attributes',
    ],
    faqs: [
      {
        q: 'What is URL encoding?',
        a: 'URL encoding (percent-encoding) converts characters that are not allowed in URLs into a % followed by two hexadecimal digits. For example, a space becomes %20, and & becomes %26.',
      },
      {
        q: 'What is the difference between encodeURI and encodeURIComponent?',
        a: 'encodeURI encodes a full URL and leaves characters like /, :, and ? intact. encodeURIComponent encodes a URL component (like a query value) and encodes those structural characters too. SmartDevBox uses encodeURIComponent.',
      },
    ],
    relatedToolIds: ['url-decode', 'url-parser', 'base64-encode', 'html-encode'],
    keywords: ['url encode', 'url encoder online', 'percent encode string', 'uri encode', 'encode url online'],
  },

  {
    id: 'url-decode',
    slug: 'url-decoder',
    heading: 'URL Decoder — Decode Percent-Encoded URLs Online',
    primaryKeyword: 'url decode online',
    metaDescription:
      'Decode any percent-encoded URL string back to readable text instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'URL Decoder converts percent-encoded strings (e.g. %20, %26) back to their original characters. ' +
      'Paste a URL-encoded string and the decoded output appears immediately. ' +
      'SmartDevBox uses decodeURIComponent() for full component decoding.',
    useCases: [
      'Reading encoded query strings in browser developer tools',
      'Decoding redirect_uri values in OAuth flows',
      'Understanding encoded log entries from web servers',
      'Debugging URL construction in API integrations',
    ],
    faqs: [
      {
        q: 'How do I decode a URL-encoded string?',
        a: 'Paste the percent-encoded string (e.g. hello%20world) into SmartDevBox. The URL Decoder converts it back to the original text (hello world) automatically on paste.',
      },
    ],
    relatedToolIds: ['url-encode', 'url-parser', 'base64-decode'],
    keywords: ['url decode', 'url decoder online', 'percent decode', 'uri decode online', 'decode url string'],
  },

  {
    id: 'url-parser',
    slug: 'url-parser',
    heading: 'URL Parser — Break Down URLs into Components Online',
    primaryKeyword: 'url parser online',
    metaDescription:
      'Parse any URL into its protocol, host, path, query parameters, and hash fragment instantly. Free, no sign-up, 100% client-side.',
    intro:
      'URL Parser dissects any HTTP, HTTPS, FTP, or other URL into its individual components: protocol, hostname, port, pathname, search string, and hash. ' +
      'Query parameters are listed individually as key–value pairs. ' +
      'Useful for debugging redirect chains, understanding API endpoints, and inspecting authentication callback URLs.',
    useCases: [
      'Extracting query parameters from a complex URL',
      'Checking the origin and pathname of a redirect URL',
      'Understanding OAuth callback URLs with multiple parameters',
      'Debugging webhook URLs in API integrations',
    ],
    faqs: [
      {
        q: 'What does a URL parser do?',
        a: 'A URL parser splits a URL into its structural components: protocol (https:), host (example.com), port (443), pathname (/path), search (?foo=bar), and hash (#section). It also decodes individual query parameters.',
      },
    ],
    relatedToolIds: ['url-decode', 'url-encode', 'base64-decode'],
    keywords: ['url parser', 'parse url online', 'url components', 'url analyzer', 'query string parser'],
  },

  {
    id: 'html-encode',
    slug: 'html-encoder',
    heading: 'HTML Encoder — Convert Special Characters to HTML Entities',
    primaryKeyword: 'html encode online',
    metaDescription:
      'Convert special characters like < > & " to HTML entities instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'HTML Encoder converts special characters (&, <, >, ", \') to their HTML entity equivalents (&amp;, &lt;, &gt;, &quot;, &#39;). ' +
      'This is essential when embedding user-generated text inside HTML markup to prevent XSS injection. ',
    useCases: [
      'Escaping user input before inserting it into HTML templates',
      'Preparing code snippets for display inside <pre> or <code> blocks',
      'Preventing XSS vulnerabilities in web applications',
    ],
    faqs: [
      {
        q: 'Why do I need to HTML-encode strings?',
        a: 'HTML-encoding prevents the browser from interpreting special characters as HTML markup. Without encoding, text containing < or & can break your HTML structure or enable cross-site scripting (XSS) attacks.',
      },
    ],
    relatedToolIds: ['html-decode', 'html-beautifier', 'url-encode'],
    keywords: ['html encode', 'html escape online', 'html entities encoder', 'escape html characters'],
  },

  {
    id: 'html-decode',
    slug: 'html-decoder',
    heading: 'HTML Decoder — Convert HTML Entities Back to Characters',
    primaryKeyword: 'html decode online',
    metaDescription:
      'Convert HTML entities like &amp; &lt; &gt; back to their original characters instantly. Free, no sign-up, 100% client-side.',
    intro:
      'HTML Decoder converts HTML entities back to their original characters. ' +
      'It handles the most common entities: &amp;, &lt;, &gt;, &quot;, &#39;, and &apos;. ' +
      'Useful when copying HTML-encoded text from a web page or API response that double-encoded special characters.',
    useCases: [
      'Cleaning up HTML-encoded text copied from web pages',
      'Decoding escaped characters in API responses',
      'Reading HTML-encoded content in RSS or Atom feeds',
    ],
    faqs: [
      {
        q: 'What are HTML entities?',
        a: 'HTML entities are special character sequences like &amp; (for &), &lt; (for <), and &gt; (for >). They allow special characters to appear in HTML without being interpreted as markup.',
      },
    ],
    relatedToolIds: ['html-encode', 'html-beautifier', 'url-decode'],
    keywords: ['html decode', 'html unescape', 'html entities decoder', 'decode html entities online'],
  },

  {
    id: 'hex-to-ascii',
    slug: 'hex-to-ascii',
    heading: 'Hex to ASCII Converter — Convert Hex Bytes to Text Online',
    primaryKeyword: 'hex to ascii converter',
    metaDescription:
      'Convert hexadecimal byte strings to ASCII text instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'Hex to ASCII Converter takes a hexadecimal string (e.g. 48656c6c6f) and converts each byte pair to its ASCII character equivalent. ' +
      'Supports hex strings with or without spaces between bytes.',
    useCases: [
      'Decoding hex-encoded network packets',
      'Converting hex output from debugging tools to readable text',
      'Reading hex-encoded strings in log files',
    ],
    faqs: [
      {
        q: 'How do I convert hex to text?',
        a: 'Paste your hexadecimal string (even-length, e.g. 48656c6c6f) into SmartDevBox. The Hex to ASCII tool converts each pair of hex digits to its corresponding ASCII character.',
      },
    ],
    relatedToolIds: ['ascii-to-hex', 'base64-decode', 'url-decode'],
    keywords: ['hex to ascii', 'hex to text', 'hexadecimal to ascii converter', 'convert hex string to text'],
  },

  {
    id: 'ascii-to-hex',
    slug: 'ascii-to-hex',
    heading: 'ASCII to Hex Converter — Convert Text to Hexadecimal Online',
    primaryKeyword: 'ascii to hex converter',
    metaDescription:
      'Convert ASCII text to hexadecimal representation instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'ASCII to Hex Converter encodes any text string as space-separated hexadecimal byte values. ' +
      'Each character is converted to its ASCII code and represented as a two-digit hex value.',
    useCases: [
      'Creating hex representations for protocol debugging',
      'Encoding text for low-level network or hardware communication',
      'Generating hex literals for use in code or configuration',
    ],
    faqs: [
      {
        q: 'What does ASCII to hex conversion do?',
        a: 'It converts each character in your text to its hexadecimal ASCII code. For example, "A" becomes 41, "B" becomes 42, and a space becomes 20.',
      },
    ],
    relatedToolIds: ['hex-to-ascii', 'base64-encode'],
    keywords: ['ascii to hex', 'text to hex', 'ascii to hexadecimal', 'convert text to hex online'],
  },

  {
    id: 'base32-encode',
    slug: 'base32-encoder',
    heading: 'Base32 Encoder — Encode Text to Base32 Online',
    primaryKeyword: 'base32 encode online',
    metaDescription:
      'Encode any text to Base32 (RFC 4648) in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'Base32 Encoder converts text to Base32 encoding using the standard RFC 4648 alphabet (A–Z, 2–7). ' +
      'Base32 produces longer output than Base64 but uses only uppercase letters and digits 2–7, making it safe for case-insensitive systems.',
    useCases: [
      'Generating Base32-encoded TOTP secrets for 2FA/MFA apps',
      'Encoding data for case-insensitive storage or transmission',
      'Creating Base32 identifiers compatible with DNS labels',
    ],
    faqs: [
      {
        q: 'What is Base32 used for?',
        a: 'Base32 is used in TOTP (Time-based One-Time Passwords) for two-factor authentication, in Tor .onion addresses, and anywhere that requires an encoding safe for case-insensitive environments.',
      },
    ],
    relatedToolIds: ['base32-decode', 'base64-encode', 'base64-decode'],
    keywords: ['base32 encode', 'base32 encoder online', 'text to base32', 'rfc 4648 base32'],
  },

  {
    id: 'base32-decode',
    slug: 'base32-decoder',
    heading: 'Base32 Decoder — Decode Base32 Strings Online',
    primaryKeyword: 'base32 decode online',
    metaDescription:
      'Decode Base32-encoded strings back to plain text instantly. Free, no sign-up, 100% client-side.',
    intro:
      'Base32 Decoder converts Base32-encoded strings (using the A–Z, 2–7 alphabet) back to their original text. ' +
      'Supports padded and unpadded Base32 strings.',
    useCases: [
      'Decoding TOTP shared secrets stored in Base32',
      'Reading Base32-encoded identifiers from authentication apps',
    ],
    faqs: [
      {
        q: 'How do I decode a Base32 string?',
        a: 'Paste your Base32 string (consisting of A–Z and 2–7, optionally with = padding) into SmartDevBox. The Base32 Decoder converts it back to the original text.',
      },
    ],
    relatedToolIds: ['base32-encode', 'base64-decode'],
    keywords: ['base32 decode', 'base32 decoder online', 'base32 to text', 'decode base32 string'],
  },

  {
    id: 'backslash-escape',
    slug: 'backslash-escape',
    heading: 'Backslash Escape — Escape Special Characters in Strings',
    primaryKeyword: 'backslash escape online',
    metaDescription:
      'Escape newlines, tabs, and special characters with backslash sequences in your browser. Free, no sign-up.',
    intro:
      'Backslash Escape converts raw special characters (newlines, tabs, quotes) to their backslash-escaped equivalents (\\n, \\t, \\"). ' +
      'Useful when you need to embed multi-line text inside a string literal in source code.',
    useCases: [
      'Preparing multi-line text for embedding in JSON string values',
      'Escaping strings for use inside JavaScript or Python string literals',
      'Formatting log messages that contain special characters',
    ],
    faqs: [
      {
        q: 'What characters does backslash escape convert?',
        a: "It escapes newlines (\\n), carriage returns (\\r), tabs (\\t), double quotes (\\\"), single quotes (\\'), and backslashes itself (\\\\).",
      },
    ],
    relatedToolIds: ['backslash-unescape', 'json-escape', 'url-encode'],
    keywords: ['backslash escape', 'escape special characters online', 'escape newlines string', 'string escape tool'],
  },

  {
    id: 'backslash-unescape',
    slug: 'backslash-unescape',
    heading: 'Backslash Unescape — Remove Backslash Escapes from Strings',
    primaryKeyword: 'backslash unescape online',
    metaDescription:
      'Convert backslash-escaped sequences like \\n and \\t back to actual characters. Free, no sign-up, 100% client-side.',
    intro:
      'Backslash Unescape converts escape sequences like \\n, \\t, \\r back to the actual characters they represent. ' +
      'Useful when you receive a string literal from a language parser or log file and need to see the raw content.',
    useCases: [
      'Converting escaped strings from JSON or YAML configuration to readable form',
      'Reading backslash-escaped log entries',
      'Debugging string serialization issues in APIs',
    ],
    faqs: [
      {
        q: 'What is backslash unescaping?',
        a: 'Backslash unescaping converts escape sequences (like \\n for newline, \\t for tab) back into their actual characters. It is the reverse of backslash escaping.',
      },
    ],
    relatedToolIds: ['backslash-escape', 'json-unescape', 'url-decode'],
    keywords: ['backslash unescape', 'unescape string online', 'convert \\n to newline', 'string unescape tool'],
  },

  {
    id: 'rot13',
    slug: 'rot13',
    heading: 'ROT13 Encoder/Decoder — Apply ROT13 Cipher Online',
    primaryKeyword: 'rot13 online',
    metaDescription:
      'Encode or decode text using the ROT13 cipher instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'ROT13 is a simple letter-substitution cipher that replaces each letter with the letter 13 positions after it in the alphabet. ' +
      'Because the alphabet has 26 letters, applying ROT13 twice returns the original text — encoding and decoding use the same operation.',
    useCases: [
      'Obscuring spoilers or puzzle answers in forum posts',
      'Learning about basic substitution ciphers',
      'Obfuscating text in a reversible, low-security way',
    ],
    faqs: [
      {
        q: 'What is ROT13?',
        a: 'ROT13 (Rotate 13) replaces each letter with the one 13 positions later in the alphabet. A becomes N, B becomes O, etc. Numbers and symbols are unchanged. Applying ROT13 twice gives back the original text.',
      },
      {
        q: 'Is ROT13 a secure encryption method?',
        a: 'No. ROT13 is not encryption — it provides zero security and is trivially reversible. It is used for light text obfuscation only, such as hiding spoilers.',
      },
    ],
    relatedToolIds: ['rot47', 'base64-encode'],
    keywords: ['rot13 online', 'rot13 encoder', 'rot13 decoder', 'rot13 cipher tool'],
  },

  {
    id: 'rot47',
    slug: 'rot47',
    heading: 'ROT47 Encoder/Decoder — Apply ROT47 Cipher Online',
    primaryKeyword: 'rot47 online',
    metaDescription:
      'Encode or decode text using the ROT47 cipher (full printable ASCII range) in your browser. Free, no sign-up.',
    intro:
      'ROT47 extends the ROT13 idea to all 94 printable ASCII characters (! through ~), rotating each character by 47 positions. ' +
      'Like ROT13, applying ROT47 twice recovers the original text.',
    useCases: [
      'Obfuscating text including punctuation and digits',
      'Creating simple reversible text transformations',
    ],
    faqs: [
      {
        q: 'How is ROT47 different from ROT13?',
        a: 'ROT13 only rotates letters (A–Z, a–z) by 13. ROT47 rotates all printable ASCII characters (!, ", #, ... ~) by 47, so it also transforms digits and punctuation.',
      },
    ],
    relatedToolIds: ['rot13', 'base64-encode'],
    keywords: ['rot47 online', 'rot47 encoder decoder', 'rot47 cipher tool'],
  },

  {
    id: 'base64-image-decode',
    slug: 'base64-image-decoder',
    heading: 'Base64 Image Decoder — Inspect Base64 Data URIs Online',
    primaryKeyword: 'base64 image decode online',
    metaDescription:
      'Decode a Base64 image data URI and view MIME type, byte size, and HTML/CSS usage examples. Free, no sign-up.',
    intro:
      'Base64 Image Decoder parses a Base64 data URI (e.g. data:image/png;base64,...) and extracts the MIME type, approximate byte size, and usage examples for HTML img tags and CSS backgrounds. ' +
      'Useful for understanding embedded images in HTML or CSS source.',
    useCases: [
      'Checking the size and type of a Base64-embedded image',
      'Getting the correct HTML <img> or CSS background-image syntax for a data URI',
      'Auditing inline images in HTML emails',
    ],
    faqs: [
      {
        q: 'What is a Base64 data URI?',
        a: 'A Base64 data URI embeds a file (like an image) directly in HTML or CSS as a Base64-encoded string, in the format: data:[MIME type];base64,[data]. This avoids a separate HTTP request for the file.',
      },
    ],
    relatedToolIds: ['base64-decode', 'base64-encode', 'html-beautifier'],
    keywords: ['base64 image decode', 'data uri decoder', 'base64 image viewer', 'decode base64 image online'],
  },

  // ── Formatting ─────────────────────────────────────────────────────────────

  {
    id: 'json-formatter',
    slug: 'json-formatter',
    heading: 'JSON Formatter — Pretty-Print & Validate JSON Online',
    primaryKeyword: 'json formatter online',
    metaDescription:
      'Format and pretty-print JSON instantly in your browser. Validates syntax and shows error location. Free, no sign-up, 100% client-side.',
    intro:
      'JSON Formatter pretty-prints any JSON with configurable indentation (2 or 4 spaces). ' +
      'It validates syntax on the fly and reports errors with the exact line and column number. ' +
      'Minified, single-quoted, or malformed JSON is normalized automatically. ' +
      'All processing runs client-side — your JSON data never leaves the browser.',
    useCases: [
      'Formatting minified API responses for easier reading',
      'Validating JSON configuration files before deployment',
      'Prettifying JSON logs from server applications',
      'Debugging JSON payloads in REST API calls',
      'Reformatting single-quoted JSON from Python repr() output',
    ],
    faqs: [
      {
        q: 'How do I format JSON online?',
        a: 'Paste any JSON — minified or malformed — into SmartDevBox. The JSON Formatter detects it automatically and pretty-prints it with configurable indentation. No button click required.',
      },
      {
        q: 'What indentation options does the JSON Formatter support?',
        a: 'SmartDevBox supports 2-space and 4-space indentation. The default is 2 spaces.',
      },
      {
        q: 'Can the formatter handle single-quoted JSON?',
        a: 'Yes. SmartDevBox normalizes single-quoted JSON (common in Python) to standard double-quoted JSON before formatting.',
      },
      {
        q: 'What is the best free JSON formatter online?',
        a: 'SmartDevBox automatically detects JSON when you paste it and formats it with configurable indentation. It also validates JSON and reports syntax errors with precise line and column numbers — all in the browser, free, with no account required.',
      },
    ],
    relatedToolIds: ['json-validate', 'json-to-csv', 'json-to-yaml', 'jsonpath-evaluator'],
    keywords: ['json formatter', 'json formatter online', 'pretty print json', 'json beautifier', 'format json online', 'json validator'],
  },

  {
    id: 'json-validate',
    slug: 'json-validator',
    heading: 'JSON Validator — Validate JSON Syntax Online',
    primaryKeyword: 'json validator online',
    metaDescription:
      'Validate JSON and get exact error location (line and column) instantly. Free, no sign-up, 100% client-side.',
    intro:
      'JSON Validator checks whether your input is valid JSON and reports the precise error location if not. ' +
      'It also shows the total character and byte count for valid JSON.',
    useCases: [
      'Verifying that a config file is valid JSON before use',
      'Debugging malformed API responses',
      'Checking JSON in CI/CD pipeline validation steps',
    ],
    faqs: [
      {
        q: 'How does the JSON validator report errors?',
        a: 'If the JSON is invalid, the validator shows the error message from the JavaScript JSON.parse() engine, which includes the position information.',
      },
    ],
    relatedToolIds: ['json-formatter', 'json-to-yaml', 'json-to-csv'],
    keywords: ['json validator', 'validate json online', 'json lint', 'json syntax check', 'check json valid'],
  },

  {
    id: 'xml-formatter',
    slug: 'xml-formatter',
    heading: 'XML Formatter — Pretty-Print & Validate XML Online',
    primaryKeyword: 'xml formatter online',
    metaDescription:
      'Format and indent XML markup instantly in your browser. Validates structure. Free, no sign-up, 100% client-side.',
    intro:
      'XML Formatter re-indents XML markup for readability, collapsing empty elements and applying consistent 2-space indentation. ' +
      'Both well-formed XML and HTML are supported.',
    useCases: [
      'Formatting SOAP API request/response bodies',
      'Beautifying SVG markup',
      'Indenting configuration files in XML format (Maven, Spring, etc.)',
      'Cleaning up XML exported from databases or legacy systems',
    ],
    faqs: [
      {
        q: 'How do I format XML online?',
        a: 'Paste your XML into SmartDevBox. The XML Formatter detects it automatically (XML starts with < or <?xml) and applies consistent indentation.',
      },
    ],
    relatedToolIds: ['xml-minify', 'xml-to-json', 'json-to-xml', 'html-beautifier'],
    keywords: ['xml formatter', 'xml formatter online', 'pretty print xml', 'xml beautifier online', 'format xml online'],
  },

  {
    id: 'xml-minify',
    slug: 'xml-minifier',
    heading: 'XML Minifier — Remove Whitespace from XML Online',
    primaryKeyword: 'xml minifier online',
    metaDescription:
      'Minify XML by removing all unnecessary whitespace. Free, no sign-up, 100% client-side.',
    intro:
      'XML Minifier strips all whitespace between XML tags, producing the most compact representation of your XML. ' +
      'Useful for reducing payload size when transmitting XML over a network.',
    useCases: [
      'Reducing SOAP payload size for network transmission',
      'Minifying XML configuration for production deployment',
    ],
    faqs: [
      {
        q: 'Does minifying XML change the data?',
        a: 'No. XML minification only removes insignificant whitespace between tags. Text content within elements is preserved exactly.',
      },
    ],
    relatedToolIds: ['xml-formatter', 'xml-to-json'],
    keywords: ['xml minifier', 'xml minify online', 'compress xml', 'remove whitespace xml'],
  },

  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    heading: 'SQL Formatter — Beautify SQL Queries Online',
    primaryKeyword: 'sql formatter online',
    metaDescription:
      'Format and beautify SQL queries with proper indentation and keyword casing. Free, no sign-up, 100% client-side.',
    intro:
      'SQL Formatter applies consistent indentation and keyword capitalization to any SQL query, making complex joins, subqueries, and CTEs readable. ' +
      'It supports standard SQL, PostgreSQL, MySQL, and most common dialects.',
    useCases: [
      'Formatting minified SQL from ORM query logs',
      'Beautifying stored procedures for code review',
      'Cleaning up SQL exported from database GUI tools',
      'Making complex multi-join queries readable',
    ],
    faqs: [
      {
        q: 'How do I format a SQL query online?',
        a: 'Paste your SQL query into SmartDevBox. The SQL Formatter auto-detects SQL keywords and applies formatting. It supports SELECT, INSERT, UPDATE, DELETE, CREATE, and most standard SQL statements.',
      },
    ],
    relatedToolIds: ['json-formatter', 'xml-formatter'],
    keywords: ['sql formatter', 'sql formatter online', 'format sql query', 'sql beautifier', 'pretty print sql'],
  },

  {
    id: 'css-beautifier',
    slug: 'css-formatter',
    heading: 'CSS Formatter — Beautify CSS Stylesheets Online',
    primaryKeyword: 'css formatter online',
    metaDescription:
      'Format and beautify CSS stylesheets with consistent indentation. Powered by Prettier. Free, no sign-up, 100% client-side.',
    intro:
      'CSS Formatter uses Prettier to apply consistent formatting to your CSS stylesheets. ' +
      'It handles standard CSS, multi-selector rules, media queries, and pseudo-classes.',
    useCases: [
      'Formatting minified CSS copied from production assets',
      'Standardizing CSS formatting across a team',
      'Beautifying CSS before adding to version control',
    ],
    faqs: [
      {
        q: 'Does CSS formatting change the visual output?',
        a: 'No. CSS formatting only changes whitespace and indentation. The resulting CSS applies the same styles as the original.',
      },
    ],
    relatedToolIds: ['css-minify', 'html-beautifier', 'js-beautifier'],
    keywords: ['css formatter', 'css formatter online', 'css beautifier', 'format css online', 'pretty print css'],
  },

  {
    id: 'css-minify',
    slug: 'css-minifier',
    heading: 'CSS Minifier — Remove Whitespace from CSS Online',
    primaryKeyword: 'css minifier online',
    metaDescription:
      'Minify CSS by removing comments, whitespace, and redundant semicolons. Free, no sign-up, 100% client-side.',
    intro:
      'CSS Minifier compresses your CSS by stripping comments, collapsing whitespace, and removing trailing semicolons before closing braces. ' +
      'Reduces CSS file size for faster page loads.',
    useCases: [
      'Minifying CSS for production web applications',
      'Reducing stylesheet payload size for mobile networks',
    ],
    faqs: [
      {
        q: 'Does minifying CSS break anything?',
        a: 'No. CSS minification only removes insignificant whitespace and comments. The styles remain functionally identical.',
      },
    ],
    relatedToolIds: ['css-beautifier', 'js-minifier'],
    keywords: ['css minifier', 'css minify online', 'compress css', 'minify stylesheet online'],
  },

  {
    id: 'html-beautifier',
    slug: 'html-formatter',
    heading: 'HTML Formatter — Beautify HTML Markup Online',
    primaryKeyword: 'html formatter online',
    metaDescription:
      'Format and indent HTML markup with consistent indentation. Powered by Prettier. Free, no sign-up, 100% client-side.',
    intro:
      'HTML Formatter uses Prettier to apply consistent indentation and formatting to HTML markup. ' +
      'It handles nested elements, attributes, and inline content correctly.',
    useCases: [
      'Formatting HTML templates copied from minified sources',
      'Beautifying HTML email templates',
      'Standardizing HTML formatting before code review',
    ],
    faqs: [
      {
        q: 'How do I format HTML online?',
        a: 'Paste your HTML into SmartDevBox. The HTML Formatter detects HTML (looks for <!DOCTYPE, <html, <div, <p, or <span) and applies Prettier formatting automatically.',
      },
    ],
    relatedToolIds: ['html-to-jsx', 'css-beautifier', 'xml-formatter', 'html-preview'],
    keywords: ['html formatter', 'html beautifier online', 'format html online', 'pretty print html', 'html indenter'],
  },

  {
    id: 'js-beautifier',
    slug: 'javascript-formatter',
    heading: 'JavaScript Formatter — Beautify JS & TypeScript Code Online',
    primaryKeyword: 'javascript formatter online',
    metaDescription:
      'Format JavaScript and TypeScript code with Prettier. Consistent style in one paste. Free, no sign-up, 100% client-side.',
    intro:
      'JavaScript Formatter uses Prettier with Babel parsing to reformat JavaScript and TypeScript code. ' +
      'It applies consistent indentation, semicolons, and quote style.',
    useCases: [
      'Formatting minified JavaScript for readability',
      'Standardizing code style before committing to version control',
      'Beautifying TypeScript code snippets from documentation',
    ],
    faqs: [
      {
        q: 'Does the JavaScript formatter support TypeScript?',
        a: 'Yes. SmartDevBox uses Prettier with the Babel parser, which supports modern JavaScript and TypeScript syntax including JSX, async/await, decorators, and optional chaining.',
      },
    ],
    relatedToolIds: ['js-minifier', 'js-validate', 'css-beautifier'],
    keywords: ['javascript formatter', 'js formatter online', 'format javascript online', 'typescript formatter', 'prettier online'],
  },

  {
    id: 'js-minifier',
    slug: 'javascript-minifier',
    heading: 'JavaScript Minifier — Minify JS Code Online',
    primaryKeyword: 'javascript minifier online',
    metaDescription:
      'Minify JavaScript by removing comments and whitespace. Free, no sign-up, 100% client-side.',
    intro:
      'JavaScript Minifier strips single-line comments, multi-line comments, and unnecessary whitespace from JavaScript code. ' +
      'It applies simple regex-based minification suitable for quick size reduction.',
    useCases: [
      'Quickly reducing JavaScript snippet size for embedding',
      'Removing comments from code before distribution',
    ],
    faqs: [
      {
        q: 'Does this minifier mangle variable names?',
        a: 'No. SmartDevBox uses lightweight whitespace-only minification. It does not rename variables or use dead code elimination. For production minification, use a dedicated bundler like esbuild or Terser.',
      },
    ],
    relatedToolIds: ['js-beautifier', 'js-validate', 'css-minify'],
    keywords: ['javascript minifier', 'js minifier online', 'minify javascript online', 'compress js'],
  },

  {
    id: 'js-validate',
    slug: 'javascript-validator',
    heading: 'JavaScript Validator — Check JS Syntax Online',
    primaryKeyword: 'javascript syntax validator',
    metaDescription:
      'Validate JavaScript syntax and report errors instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'JavaScript Validator uses the browser\'s built-in Function constructor as a lightweight syntax checker. ' +
      'It reports syntax errors for invalid JavaScript code.',
    useCases: [
      'Quick syntax check before running JavaScript in Node.js',
      'Validating small JavaScript snippets from scripts or configs',
    ],
    faqs: [
      {
        q: 'What kind of errors does the JS validator catch?',
        a: 'The validator catches syntax errors (invalid tokens, missing brackets, etc.). It does not perform type checking or runtime error detection.',
      },
    ],
    relatedToolIds: ['js-beautifier', 'js-minifier'],
    keywords: ['javascript validator', 'js syntax checker online', 'validate javascript online'],
  },

  {
    id: 'markdown-preview',
    slug: 'markdown-preview',
    heading: 'Markdown Preview — Live Markdown Editor & Renderer Online',
    primaryKeyword: 'markdown preview online',
    metaDescription:
      'Live split-pane Markdown editor with side-by-side rendered HTML preview. Free, no sign-up, 100% client-side.',
    intro:
      'Markdown Preview renders Markdown in real time in a split-pane view alongside your source. ' +
      'It supports headings, bold, italic, links, images, code blocks, blockquotes, and lists.',
    useCases: [
      'Previewing README.md files before committing to GitHub',
      'Drafting blog posts or documentation in Markdown',
      'Learning Markdown syntax with instant visual feedback',
    ],
    faqs: [
      {
        q: 'What Markdown syntax does SmartDevBox support?',
        a: 'SmartDevBox supports standard CommonMark-compatible Markdown: headings (#), bold (**), italic (*), links, images, code blocks (```), inline code, blockquotes (>), and unordered/ordered lists.',
      },
    ],
    relatedToolIds: ['markdown-to-html', 'html-beautifier'],
    keywords: ['markdown preview online', 'markdown editor online', 'markdown renderer', 'live markdown preview'],
  },

  // ── Conversion ─────────────────────────────────────────────────────────────

  {
    id: 'json-to-csv',
    slug: 'json-to-csv',
    heading: 'JSON to CSV Converter — Convert JSON Arrays to CSV Online',
    primaryKeyword: 'json to csv converter',
    metaDescription:
      'Convert JSON arrays of objects to CSV format instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'JSON to CSV Converter flattens a JSON array of objects into comma-separated values with column headers derived from the JSON keys. ' +
      'Nested objects are serialized as JSON strings within the CSV cell.',
    useCases: [
      'Exporting API response data to Excel or Google Sheets',
      'Converting database query results from JSON to CSV',
      'Preparing data for CSV-based reporting tools',
    ],
    faqs: [
      {
        q: 'How do I convert JSON to CSV?',
        a: 'Paste a JSON array of objects into SmartDevBox and select the JSON → CSV tool. It produces comma-separated output with column headers derived from the JSON keys.',
      },
      {
        q: 'What happens to nested objects in the JSON?',
        a: 'Nested objects and arrays are serialized as JSON strings within the CSV cell. Flat primitives (strings, numbers, booleans) are written as plain values.',
      },
    ],
    relatedToolIds: ['json-to-tsv', 'csv-to-json', 'json-formatter', 'json-to-yaml'],
    keywords: ['json to csv', 'json to csv converter online', 'convert json to csv', 'json array to csv'],
  },

  {
    id: 'json-to-tsv',
    slug: 'json-to-tsv',
    heading: 'JSON to TSV Converter — Convert JSON to Tab-Separated Values',
    primaryKeyword: 'json to tsv converter',
    metaDescription:
      'Convert JSON arrays to TSV (tab-separated values) format instantly. Free, no sign-up, 100% client-side.',
    intro:
      'JSON to TSV Converter transforms a JSON array of objects into tab-separated values, ideal for pasting directly into spreadsheets.',
    useCases: [
      'Pasting data directly into Excel or Google Sheets',
      'Exporting JSON data in a tab-delimited format',
    ],
    faqs: [
      {
        q: 'What is the difference between CSV and TSV?',
        a: 'CSV uses commas as delimiters; TSV uses tab characters. TSV is often easier to paste into spreadsheet applications without quoting issues.',
      },
    ],
    relatedToolIds: ['json-to-csv', 'csv-to-json', 'json-formatter'],
    keywords: ['json to tsv', 'json to tab separated', 'convert json to tsv', 'json tsv converter'],
  },

  {
    id: 'json-to-yaml',
    slug: 'json-to-yaml',
    heading: 'JSON to YAML Converter — Convert JSON to YAML Online',
    primaryKeyword: 'json to yaml converter',
    metaDescription:
      'Convert JSON to YAML format instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'JSON to YAML Converter transforms valid JSON into equivalent YAML format. ' +
      'YAML is more human-readable than JSON — no brackets, no commas, and indentation shows structure.',
    useCases: [
      'Converting JSON config files to YAML for Kubernetes or Docker Compose',
      'Preparing data for YAML-based CI/CD pipelines (GitHub Actions, CircleCI)',
      'Migrating JSON configuration to YAML-based tools',
    ],
    faqs: [
      {
        q: 'How do I convert JSON to YAML?',
        a: 'Paste valid JSON into SmartDevBox and select JSON → YAML. The converter handles objects, arrays, strings, numbers, booleans, and null values.',
      },
      {
        q: 'What are the main differences between JSON and YAML?',
        a: 'YAML uses indentation instead of braces and brackets, omits commas between items, and does not require quotes around most strings. YAML is a superset of JSON — all valid JSON is also valid YAML.',
      },
    ],
    relatedToolIds: ['yaml-to-json', 'json-formatter', 'json-to-csv'],
    keywords: ['json to yaml', 'json to yaml converter', 'convert json yaml online', 'json yaml tool'],
  },

  {
    id: 'yaml-to-json',
    slug: 'yaml-to-json',
    heading: 'YAML to JSON Converter — Convert YAML to JSON Online',
    primaryKeyword: 'yaml to json converter',
    metaDescription:
      'Convert YAML to JSON format instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'YAML to JSON Converter parses YAML input and produces equivalent JSON output. ' +
      'Supports mappings, sequences, scalars, booleans, and null values.',
    useCases: [
      'Converting Kubernetes manifests to JSON for API inspection',
      'Transforming GitHub Actions workflow YAML to JSON for processing',
      'Converting YAML config files to JSON for tools that require it',
    ],
    faqs: [
      {
        q: 'How do I convert YAML to JSON?',
        a: 'Paste your YAML into SmartDevBox and select YAML → JSON. The converter handles common YAML structures including nested mappings and sequences.',
      },
    ],
    relatedToolIds: ['json-to-yaml', 'json-formatter'],
    keywords: ['yaml to json', 'yaml to json converter online', 'convert yaml to json', 'yaml json tool'],
  },

  {
    id: 'csv-to-json',
    slug: 'csv-to-json',
    heading: 'CSV to JSON Converter — Convert CSV Data to JSON Online',
    primaryKeyword: 'csv to json converter',
    metaDescription:
      'Convert CSV data to a JSON array of objects instantly. Headers become keys. Free, no sign-up, 100% client-side.',
    intro:
      'CSV to JSON Converter parses CSV input (with a header row) and produces a JSON array of objects where each row becomes an object with keys taken from the header.',
    useCases: [
      'Converting spreadsheet exports to JSON for API consumption',
      'Transforming database CSV exports for use in JavaScript applications',
      'Converting configuration CSVs to JSON for tooling',
    ],
    faqs: [
      {
        q: 'Does the CSV converter handle quoted fields?',
        a: 'Yes. The CSV parser handles RFC 4180 quoting: fields containing commas, quotes, or newlines are quoted with double quotes, and double quotes within fields are escaped as "".',
      },
    ],
    relatedToolIds: ['json-to-csv', 'json-to-tsv', 'json-formatter'],
    keywords: ['csv to json', 'csv to json converter online', 'convert csv to json', 'csv json transformer'],
  },

  {
    id: 'xml-to-json',
    slug: 'xml-to-json',
    heading: 'XML to JSON Converter — Convert XML to JSON Online',
    primaryKeyword: 'xml to json converter',
    metaDescription:
      'Convert XML to JSON format instantly in your browser. Preserves attributes and nesting. Free, no sign-up.',
    intro:
      'XML to JSON Converter parses XML markup and produces a JSON representation. ' +
      'Attributes are prefixed with @ and text content uses the #text key.',
    useCases: [
      'Converting SOAP API XML responses to JSON for JavaScript processing',
      'Transforming XML configuration files to JSON',
      'Parsing RSS or Atom feeds into JSON',
    ],
    faqs: [
      {
        q: 'How are XML attributes represented in the JSON output?',
        a: 'Attributes are included as keys prefixed with @ (e.g. @id, @class). Text content is represented with the key #text.',
      },
    ],
    relatedToolIds: ['json-to-xml', 'xml-formatter', 'json-formatter'],
    keywords: ['xml to json', 'xml to json converter', 'convert xml to json online', 'xml json tool'],
  },

  {
    id: 'json-to-xml',
    slug: 'json-to-xml',
    heading: 'JSON to XML Converter — Convert JSON to XML Online',
    primaryKeyword: 'json to xml converter',
    metaDescription:
      'Convert JSON to XML format instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'JSON to XML Converter serializes JSON objects and arrays as XML markup. ' +
      'Object keys become tag names; arrays produce repeated elements with the same tag name.',
    useCases: [
      'Generating XML for SOAP API requests from JSON data',
      'Converting JSON configuration to XML format',
    ],
    faqs: [
      {
        q: 'What happens to JSON arrays in the XML output?',
        a: 'Each item in a JSON array produces a separate XML element with the same tag name as the array key.',
      },
    ],
    relatedToolIds: ['xml-to-json', 'xml-formatter', 'json-formatter'],
    keywords: ['json to xml', 'json to xml converter online', 'convert json to xml'],
  },

  {
    id: 'markdown-to-html',
    slug: 'markdown-to-html',
    heading: 'Markdown to HTML Converter — Convert Markdown to HTML Online',
    primaryKeyword: 'markdown to html converter',
    metaDescription:
      'Convert Markdown text to HTML instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'Markdown to HTML Converter transforms Markdown source into HTML markup. ' +
      'It handles headings, bold, italic, links, images, code blocks, blockquotes, and lists.',
    useCases: [
      'Converting Markdown documentation to HTML for embedding in web pages',
      'Generating HTML email body from Markdown drafts',
      'Transforming README.md content to HTML for display',
    ],
    faqs: [
      {
        q: 'Does the Markdown to HTML converter support GitHub Flavored Markdown?',
        a: 'The converter supports the most common Markdown features: headings, bold, italic, links, images, fenced code blocks, lists, and horizontal rules. GitHub-specific extensions like task lists are not supported.',
      },
    ],
    relatedToolIds: ['markdown-preview', 'html-beautifier', 'html-to-text'],
    keywords: ['markdown to html', 'markdown to html converter online', 'convert markdown html'],
  },

  {
    id: 'html-to-text',
    slug: 'html-to-text',
    heading: 'HTML to Text — Strip HTML Tags & Extract Plain Text Online',
    primaryKeyword: 'html to text converter',
    metaDescription:
      'Strip HTML tags and extract plain readable text from HTML. Free, no sign-up, 100% client-side.',
    intro:
      'HTML to Text removes all HTML tags and decodes common HTML entities, extracting only the readable text content. ' +
      'Block elements (p, div, h1–h6, li) are converted to newlines.',
    useCases: [
      'Extracting text content from HTML emails',
      'Getting plain text from scraped web page HTML',
      'Converting HTML documentation to plain text for search indexing',
    ],
    faqs: [
      {
        q: 'Does HTML to text preserve formatting?',
        a: 'Block elements like paragraphs and headings produce newlines. Inline styles and fonts are removed. The result is plain readable text with basic paragraph structure.',
      },
    ],
    relatedToolIds: ['html-beautifier', 'markdown-to-html'],
    keywords: ['html to text', 'strip html tags online', 'html to plain text converter', 'remove html tags'],
  },

  {
    id: 'html-to-jsx',
    slug: 'html-to-jsx',
    heading: 'HTML to JSX Converter — Convert HTML to React JSX Online',
    primaryKeyword: 'html to jsx converter',
    metaDescription:
      'Convert HTML markup to React-compatible JSX syntax instantly. Handles className, inline styles, and void elements. Free, no sign-up.',
    intro:
      'HTML to JSX Converter transforms standard HTML markup into React JSX syntax. ' +
      'It renames class to className, for to htmlFor, converts inline style strings to JS objects, and adds self-closing slashes to void elements.',
    useCases: [
      'Migrating existing HTML templates to React components',
      'Converting static HTML mockups to JSX for React development',
      'Copying HTML snippets from design tools into React code',
    ],
    faqs: [
      {
        q: 'What transformations does the HTML to JSX converter apply?',
        a: 'It converts class → className, for → htmlFor, tabindex → tabIndex, readonly → readOnly, inline style strings to JS objects, HTML comments to JSX comments {/* */}, and adds self-closing slashes to void elements like <br />, <img />, <input />.',
      },
    ],
    relatedToolIds: ['html-beautifier', 'markdown-to-html'],
    keywords: ['html to jsx', 'html to jsx converter online', 'convert html react jsx', 'html jsx transformer'],
  },

  {
    id: 'json-escape',
    slug: 'json-escape',
    heading: 'JSON Escape — Escape Strings for JSON Values Online',
    primaryKeyword: 'json escape string online',
    metaDescription:
      'Escape a string for safe embedding inside a JSON value. Handles quotes, newlines, and backslashes. Free, no sign-up.',
    intro:
      'JSON Escape converts a raw string to a JSON-safe string by escaping double quotes, backslashes, newlines, tabs, and other control characters. ' +
      'Use this to safely embed arbitrary text inside a JSON string value.',
    useCases: [
      'Escaping user-supplied text before inserting it into a JSON payload',
      'Preparing string values for JSON serialization',
    ],
    faqs: [
      {
        q: 'Why do I need to escape strings for JSON?',
        a: 'JSON string values must not contain unescaped double quotes or backslashes. Newlines and control characters must also be escaped as \\n, \\t, etc.',
      },
    ],
    relatedToolIds: ['json-unescape', 'json-formatter', 'backslash-escape'],
    keywords: ['json escape string', 'escape json value', 'json string escape online'],
  },

  {
    id: 'json-unescape',
    slug: 'json-unescape',
    heading: 'JSON Unescape — Decode JSON-Escaped Strings Online',
    primaryKeyword: 'json unescape online',
    metaDescription:
      'Convert JSON-escaped strings back to normal text. Free, no sign-up, 100% client-side.',
    intro:
      'JSON Unescape converts JSON escape sequences (\\n, \\t, \\\\, \\u00XX) back to the actual characters they represent.',
    useCases: [
      'Decoding doubly-encoded JSON string values',
      'Reading escaped string literals from API responses',
    ],
    faqs: [],
    relatedToolIds: ['json-escape', 'json-formatter', 'backslash-unescape'],
    keywords: ['json unescape', 'json decode string', 'unescape json online'],
  },

  {
    id: 'color-converter',
    slug: 'color-converter',
    heading: 'Color Converter — Convert HEX, RGB, HSL, HSV Online',
    primaryKeyword: 'color converter online',
    metaDescription:
      'Convert colors between HEX, RGB, HSL, and HSV instantly in your browser. Free, no sign-up, 100% client-side.',
    intro:
      'Color Converter translates color values between HEX (#ff6b35), RGB (rgb(255,107,53)), HSL (hsl(18,100%,60%)), and HSV formats. ' +
      'Auto-detects the input format from the pasted color value.',
    useCases: [
      'Converting design tool color values to CSS color functions',
      'Getting the HSL representation of a HEX color code',
      'Translating RGB values from image editors to CSS',
    ],
    faqs: [
      {
        q: 'What color formats does the Color Converter support?',
        a: 'SmartDevBox supports HEX (#rrggbb and #rgb), RGB (rgb(r,g,b)), and HSL (hsl(h,s%,l%)) as input formats, and converts to all four: HEX, RGB, HSL, and HSV.',
      },
    ],
    relatedToolIds: ['number-base-converter'],
    keywords: ['color converter online', 'hex to rgb', 'rgb to hex', 'hex to hsl', 'color format converter'],
  },

  {
    id: 'number-base-converter',
    slug: 'number-base-converter',
    heading: 'Number Base Converter — Binary, Octal, Decimal, Hex Online',
    primaryKeyword: 'number base converter online',
    metaDescription:
      'Convert integers between binary, octal, decimal, and hexadecimal instantly. Free, no sign-up, 100% client-side.',
    intro:
      'Number Base Converter converts integers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). ' +
      'Supports 0b, 0o, and 0x prefixes for unambiguous input.',
    useCases: [
      'Converting decimal values to hexadecimal for memory addresses',
      'Converting binary bitmasks to decimal or hex',
      'Understanding permission modes (e.g. chmod 755 in octal)',
    ],
    faqs: [
      {
        q: 'How do I convert a number between bases?',
        a: 'Paste your number (e.g. 255, 0xFF, 0b11111111, or 0o377) into SmartDevBox. The Number Base Converter auto-detects the base from the prefix and converts to all four bases simultaneously.',
      },
    ],
    relatedToolIds: ['color-converter', 'hex-to-ascii'],
    keywords: ['number base converter', 'binary to decimal', 'decimal to hex', 'hex to binary online', 'base converter'],
  },

  {
    id: 'unix-timestamp',
    slug: 'unix-timestamp-converter',
    heading: 'Unix Timestamp Converter — Convert Timestamps to Dates Online',
    primaryKeyword: 'unix timestamp converter',
    metaDescription:
      'Convert Unix timestamps to human-readable dates and times, and vice versa. Free, no sign-up, 100% client-side.',
    intro:
      'Unix Timestamp Converter converts Unix epoch timestamps (10-digit seconds or 13-digit milliseconds) to UTC and local date/time strings, and also converts date strings back to Unix timestamps. ' +
      'Auto-detects whether the input is a timestamp or a date string.',
    useCases: [
      'Reading Unix timestamps from server logs or API responses',
      'Converting a specific date/time to a Unix timestamp for queries',
      'Checking when a token or session expires from its timestamp claim',
    ],
    faqs: [
      {
        q: 'How do I convert a Unix timestamp to a readable date?',
        a: 'Paste a Unix timestamp (e.g. 1700000000) into SmartDevBox. The Unix Timestamp tool detects it and shows the equivalent date and time in UTC and your local timezone.',
      },
      {
        q: 'What is the difference between a 10-digit and 13-digit Unix timestamp?',
        a: 'A 10-digit Unix timestamp counts whole seconds since January 1, 1970 UTC. A 13-digit timestamp counts milliseconds. SmartDevBox automatically distinguishes between the two.',
      },
    ],
    relatedToolIds: ['date-formatter', 'seconds-to-hms'],
    keywords: ['unix timestamp converter', 'epoch converter online', 'timestamp to date', 'unix time converter', 'epoch to datetime'],
  },

  {
    id: 'date-formatter',
    slug: 'date-formatter',
    heading: 'Date Formatter — Format Dates in Multiple Locales Online',
    primaryKeyword: 'date formatter online',
    metaDescription:
      'Format any date or timestamp across 12 locales and 4 date styles. Free, no sign-up, 100% client-side.',
    intro:
      'Date Formatter parses any date string or Unix timestamp and renders it in 12 locale formats (English US/UK, Chinese, Japanese, Korean, German, French, Spanish, Portuguese, Arabic, Hindi, Russian) at four date styles (full, long, medium, short).',
    useCases: [
      'Checking how a date looks in different internationalized formats',
      'Formatting dates for inclusion in localized user interfaces',
      'Converting timestamps for documentation across regions',
    ],
    faqs: [],
    relatedToolIds: ['unix-timestamp', 'seconds-to-hms'],
    keywords: ['date formatter online', 'format date online', 'date locale converter', 'internationalized date format'],
  },

  {
    id: 'seconds-to-hms',
    slug: 'seconds-to-hms',
    heading: 'Seconds to H:M:S Converter — Convert Seconds to Time Online',
    primaryKeyword: 'seconds to hours minutes seconds',
    metaDescription:
      'Convert a total number of seconds to hours:minutes:seconds format. Free, no sign-up, 100% client-side.',
    intro:
      'Seconds to H:M:S Converter takes a number of seconds and converts it to the hours:minutes:seconds notation. ' +
      'Also shows the human-readable breakdown and total days.',
    useCases: [
      'Converting video duration from seconds to a readable time format',
      'Displaying API rate limit reset times from epoch seconds',
      'Converting database duration columns for human display',
    ],
    faqs: [],
    relatedToolIds: ['hms-to-seconds', 'unix-timestamp', 'date-formatter'],
    keywords: ['seconds to hours minutes seconds', 'convert seconds to time', 'seconds to hms converter'],
  },

  {
    id: 'hms-to-seconds',
    slug: 'hms-to-seconds',
    heading: 'H:M:S to Seconds Converter — Convert Time to Seconds Online',
    primaryKeyword: 'hours minutes seconds to seconds',
    metaDescription:
      'Convert H:M:S time format to total seconds. Free, no sign-up, 100% client-side.',
    intro:
      'H:M:S to Seconds Converter takes a time in hours:minutes:seconds format (e.g. 1:30:00) and returns the total number of seconds (5400).',
    useCases: [
      'Converting video timestamps to seconds for API parameters',
      'Calculating total elapsed time from H:M:S notation',
    ],
    faqs: [],
    relatedToolIds: ['seconds-to-hms', 'unix-timestamp'],
    keywords: ['hms to seconds', 'hours minutes seconds to seconds converter', 'time to seconds'],
  },

  {
    id: 'decimal-to-roman',
    slug: 'decimal-to-roman',
    heading: 'Decimal to Roman Numeral Converter — Convert Numbers Online',
    primaryKeyword: 'decimal to roman numeral converter',
    metaDescription:
      'Convert any integer between 1 and 3999 to Roman numerals. Free, no sign-up, 100% client-side.',
    intro:
      'Decimal to Roman Converter transforms integers (1–3999) to their Roman numeral equivalent using standard notation (I, V, X, L, C, D, M).',
    useCases: [
      'Generating Roman numerals for book chapter numbering',
      'Creating numbered lists in Roman numeral format',
    ],
    faqs: [
      {
        q: 'What is the largest number that can be converted to Roman numerals?',
        a: 'Standard Roman numeral notation supports numbers from 1 to 3999. The number 3999 is MMMCMXCIX.',
      },
    ],
    relatedToolIds: ['roman-to-decimal', 'number-base-converter'],
    keywords: ['decimal to roman numeral', 'convert number to roman numerals online', 'roman numeral generator'],
  },

  {
    id: 'roman-to-decimal',
    slug: 'roman-to-decimal',
    heading: 'Roman Numeral to Decimal Converter — Convert Numerals Online',
    primaryKeyword: 'roman numeral to decimal converter',
    metaDescription:
      'Convert Roman numerals to decimal integers. Free, no sign-up, 100% client-side.',
    intro:
      'Roman to Decimal Converter parses Roman numeral strings (I, V, X, L, C, D, M) and returns the equivalent decimal integer.',
    useCases: [
      'Converting Roman numerals in historical texts to numbers',
      'Parsing Roman-numeral chapter or section numbers',
    ],
    faqs: [],
    relatedToolIds: ['decimal-to-roman', 'number-base-converter'],
    keywords: ['roman numeral to decimal', 'convert roman numerals to numbers online', 'roman decimal converter'],
  },

  {
    id: 'uuid-hex-converter',
    slug: 'uuid-hex-converter',
    heading: 'UUID to Hex Converter — Convert Between UUID and Hex Online',
    primaryKeyword: 'uuid to hex converter',
    metaDescription:
      'Convert between standard UUID format and 32-character hex strings instantly. Free, no sign-up, 100% client-side.',
    intro:
      'UUID to Hex Converter converts standard UUIDs (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) to their 32-character hex equivalents and vice versa. ' +
      'Useful when working with databases that store UUIDs as binary or hex strings.',
    useCases: [
      'Converting UUIDs to raw hex for compact database storage',
      'Reconstructing UUIDs from hex strings in database queries',
    ],
    faqs: [],
    relatedToolIds: ['uuid-generator', 'base64-decode'],
    keywords: ['uuid to hex', 'uuid hex converter', 'convert uuid to hex', 'guid to hex online'],
  },

  // ── Generation ─────────────────────────────────────────────────────────────

  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    heading: 'UUID Generator — Generate UUID v4 Online, Free',
    primaryKeyword: 'uuid generator online',
    metaDescription:
      'Generate cryptographically random UUID v4 identifiers instantly. Bulk generation supported. Free, no sign-up, 100% client-side.',
    intro:
      'UUID Generator creates cryptographically random UUID version 4 identifiers using the browser\'s crypto.randomUUID() API. ' +
      'You can generate a single UUID or up to 1000 at once.',
    useCases: [
      'Generating unique identifiers for database records',
      'Creating correlation IDs for distributed system tracing',
      'Generating UUIDs for test data fixtures',
      'Creating unique IDs for feature flags or A/B test variants',
    ],
    faqs: [
      {
        q: 'What is a UUID v4?',
        a: 'A UUID (Universally Unique Identifier) version 4 is a 128-bit number generated using random or pseudo-random numbers, formatted as xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. The v4 variant has extremely low collision probability.',
      },
      {
        q: 'How is a UUID different from a ULID?',
        a: 'UUIDs are random and do not sort chronologically. ULIDs (Universally Unique Lexicographically Sortable Identifiers) embed a millisecond timestamp prefix, so they sort by creation time and are database-index-friendly.',
      },
    ],
    relatedToolIds: ['ulid-generator', 'random-string', 'hash-generator', 'uuid-hex-converter'],
    keywords: ['uuid generator', 'uuid generator online', 'generate uuid v4', 'uuid v4 online', 'guid generator'],
  },

  {
    id: 'ulid-generator',
    slug: 'ulid-generator',
    heading: 'ULID Generator — Generate Sortable Unique IDs Online',
    primaryKeyword: 'ulid generator online',
    metaDescription:
      'Generate Universally Unique Lexicographically Sortable Identifiers (ULIDs). Free, no sign-up, 100% client-side.',
    intro:
      'ULID Generator creates ULIDs — 26-character base32 identifiers that encode a millisecond-precision timestamp in the first 10 characters followed by 16 random characters. ' +
      'ULIDs sort lexicographically by creation time, making them ideal for use as primary keys in databases.',
    useCases: [
      'Generating time-sortable primary keys for database tables',
      'Creating identifiers for event sourcing systems',
      'Replacing UUIDs where chronological ordering matters',
    ],
    faqs: [
      {
        q: 'Why use ULIDs instead of UUIDs?',
        a: 'ULIDs are lexicographically sortable (newer IDs sort after older ones), which improves database index performance and makes debugging easier. They are also slightly shorter (26 vs 36 characters).',
      },
    ],
    relatedToolIds: ['uuid-generator', 'random-string'],
    keywords: ['ulid generator', 'ulid online', 'generate ulid', 'sortable unique id generator'],
  },

  {
    id: 'hash-generator',
    slug: 'hash-generator',
    heading: 'Hash Generator — Compute SHA-256, MD5, SHA-512 Online',
    primaryKeyword: 'hash generator online',
    metaDescription:
      'Compute MD5, SHA-1, SHA-256, and SHA-512 hashes for any text. Free, no sign-up, 100% client-side.',
    intro:
      'Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes for any input text simultaneously. ' +
      'SHA hashes are computed via the Web Crypto API; MD5 uses a pure-JavaScript implementation. ' +
      'All hashing runs in the browser — your data never leaves your machine.',
    useCases: [
      'Verifying file integrity by comparing SHA-256 checksums',
      'Generating SHA-256 hashes for API request signing',
      'Computing MD5 checksums for legacy system compatibility',
      'Learning about hash functions and collision resistance',
    ],
    faqs: [
      {
        q: 'How do I compute a SHA-256 hash online?',
        a: 'Use the Hash Generator tool on SmartDevBox. Paste any input text and it computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously, entirely in the browser.',
      },
      {
        q: 'Is SHA-256 the same as SHA-2?',
        a: 'SHA-256 is one variant of the SHA-2 family, which also includes SHA-224, SHA-384, and SHA-512. SHA-256 produces a 256-bit (64 hex character) digest.',
      },
      {
        q: 'Should I use MD5 or SHA-256 for checksums?',
        a: 'SHA-256 is strongly preferred. MD5 is cryptographically broken — collisions can be engineered. Use MD5 only for legacy compatibility where SHA-256 is not accepted.',
      },
    ],
    relatedToolIds: ['uuid-generator', 'random-string', 'random-password'],
    keywords: ['hash generator online', 'sha256 hash online', 'md5 generator online', 'sha512 hash generator', 'checksum generator'],
  },

  {
    id: 'random-string',
    slug: 'random-string-generator',
    heading: 'Random String Generator — Generate Random Strings Online',
    primaryKeyword: 'random string generator online',
    metaDescription:
      'Generate random strings with configurable length and character set. Free, no sign-up, 100% client-side.',
    intro:
      'Random String Generator creates cryptographically random strings using the browser\'s crypto.getRandomValues() API. ' +
      'Choose from alphanumeric, alphabetic, numeric, lowercase, uppercase, hex, or symbol character sets, and configure the length and count.',
    useCases: [
      'Generating random API keys for development',
      'Creating random tokens for session management',
      'Generating test data strings',
    ],
    faqs: [
      {
        q: 'Is the random string generator cryptographically secure?',
        a: 'Yes. SmartDevBox uses crypto.getRandomValues() from the Web Crypto API, which provides cryptographically strong random values suitable for security-sensitive use.',
      },
    ],
    relatedToolIds: ['random-password', 'uuid-generator', 'hash-generator'],
    keywords: ['random string generator', 'generate random string online', 'random token generator', 'random alphanumeric string'],
  },

  {
    id: 'random-password',
    slug: 'random-password-generator',
    heading: 'Password Generator — Generate Strong Random Passwords Online',
    primaryKeyword: 'random password generator online',
    metaDescription:
      'Generate strong random passwords with configurable length, uppercase, digits, and symbols. Free, no sign-up.',
    intro:
      'Random Password Generator creates cryptographically strong passwords using the Web Crypto API. ' +
      'Configure length (4–256 characters), character classes (uppercase, lowercase, digits, symbols), and count.',
    useCases: [
      'Generating strong passwords for new account registrations',
      'Creating secure API secrets and service credentials',
      'Generating master passwords for password managers',
    ],
    faqs: [
      {
        q: 'How long should a secure password be?',
        a: 'Security experts generally recommend at least 16 characters for important accounts. For passwords stored in password managers (not typed manually), 32+ characters with all character classes is ideal.',
      },
    ],
    relatedToolIds: ['random-string', 'uuid-generator', 'hash-generator'],
    keywords: ['random password generator', 'strong password generator online', 'secure password generator', 'password creator online'],
  },

  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum-generator',
    heading: 'Lorem Ipsum Generator — Generate Placeholder Text Online',
    primaryKeyword: 'lorem ipsum generator online',
    metaDescription:
      'Generate Lorem Ipsum placeholder text by word, sentence, or paragraph count. Free, no sign-up, 100% client-side.',
    intro:
      'Lorem Ipsum Generator produces placeholder Latin text for mockups, prototypes, and layout testing. ' +
      'Choose between word, sentence, or paragraph mode and set the desired count.',
    useCases: [
      'Filling wireframes and mockups with realistic text',
      'Testing text rendering at different lengths',
      'Creating placeholder content for UI component development',
    ],
    faqs: [
      {
        q: 'What is Lorem Ipsum text?',
        a: 'Lorem Ipsum is dummy Latin text derived from Cicero\'s "de Finibus Bonorum et Malorum" (45 BC). It has been used as placeholder text in typesetting and design since the 1500s.',
      },
    ],
    relatedToolIds: ['random-string'],
    keywords: ['lorem ipsum generator', 'lorem ipsum online', 'placeholder text generator', 'dummy text generator'],
  },

  {
    id: 'qr-code',
    slug: 'qr-code-generator',
    heading: 'QR Code Generator — Create QR Codes Online, Free',
    primaryKeyword: 'qr code generator online',
    metaDescription:
      'Generate QR codes from any URL or text. Download as PNG. Free, no sign-up, 100% client-side.',
    intro:
      'QR Code Generator creates QR codes from any URL or text string and allows downloading the result as a PNG image. ' +
      'Rendering uses the qrcode.js library, entirely in the browser.',
    useCases: [
      'Creating QR codes for URLs on printed materials',
      'Generating QR codes for Wi-Fi credentials',
      'Embedding QR codes in presentations or documents',
      'Creating QR codes linking to contact information or vCards',
    ],
    faqs: [
      {
        q: 'How do I create a QR code online?',
        a: 'Type or paste any text or URL into SmartDevBox and select the QR Code Generator. The QR code renders immediately. Click Download PNG to save it.',
      },
    ],
    relatedToolIds: ['uuid-generator', 'url-encode'],
    keywords: ['qr code generator online', 'create qr code free', 'qr code maker', 'generate qr code url'],
  },

  {
    id: 'random-number',
    slug: 'random-number-generator',
    heading: 'Random Number Generator — Generate Random Numbers Online',
    primaryKeyword: 'random number generator online',
    metaDescription:
      'Generate random integers or decimals within a custom range. Free, no sign-up, 100% client-side.',
    intro:
      'Random Number Generator produces random integers or decimal numbers within a configurable min–max range. ' +
      'Generate up to 1000 numbers at once.',
    useCases: [
      'Generating random numbers for simulations or sampling',
      'Creating random test values for applications',
      'Picking random winners in contests',
    ],
    faqs: [],
    relatedToolIds: ['random-string', 'uuid-generator'],
    keywords: ['random number generator', 'random number online', 'generate random integer', 'random number picker'],
  },

  {
    id: 'random-ip',
    slug: 'random-ip-generator',
    heading: 'Random IP Generator — Generate Random IPv4 Addresses Online',
    primaryKeyword: 'random ip generator',
    metaDescription:
      'Generate random IPv4 addresses for testing and development. Free, no sign-up, 100% client-side.',
    intro:
      'Random IP Generator creates random IPv4 addresses using cryptographically random bytes. ' +
      'Generate up to 1000 addresses at once for use in testing, mock data, or documentation.',
    useCases: [
      'Creating test data with realistic IP addresses',
      'Generating mock network logs for development',
    ],
    faqs: [],
    relatedToolIds: ['random-mac', 'random-string'],
    keywords: ['random ip generator', 'generate random ipv4 address', 'random ip address online'],
  },

  {
    id: 'random-mac',
    slug: 'random-mac-generator',
    heading: 'Random MAC Address Generator — Generate MAC Addresses Online',
    primaryKeyword: 'random mac address generator',
    metaDescription:
      'Generate random locally-administered MAC addresses for testing. Free, no sign-up, 100% client-side.',
    intro:
      'Random MAC Generator creates random MAC addresses with the locally-administered and unicast bits set correctly. ' +
      'Generate up to 1000 addresses at once.',
    useCases: [
      'Creating mock network interface data for testing',
      'Generating unique hardware address identifiers for simulation',
    ],
    faqs: [],
    relatedToolIds: ['random-ip', 'random-string'],
    keywords: ['random mac address generator', 'generate mac address online', 'fake mac address generator'],
  },

  // ── Inspection ─────────────────────────────────────────────────────────────

  {
    id: 'regex-tester',
    slug: 'regex-tester',
    heading: 'Regex Tester — Test Regular Expressions Online',
    primaryKeyword: 'regex tester online',
    metaDescription:
      'Test regular expressions against any input text. See matches and positions. Free, no sign-up, 100% client-side.',
    intro:
      'Regex Tester evaluates a regular expression pattern against input text and lists all matches with their start positions. ' +
      'Supports all JavaScript regex flags (g, i, m, s, u, y) and named capture groups.',
    useCases: [
      'Testing and debugging regex patterns for form validation',
      'Extracting data with regex from log files or API responses',
      'Learning regex syntax with immediate visual feedback',
      'Verifying that a regex matches all expected inputs',
    ],
    faqs: [
      {
        q: 'What regex syntax does the SmartDevBox Regex Tester support?',
        a: 'SmartDevBox uses the JavaScript RegExp engine, which supports most standard regex syntax including lookahead, lookbehind (ES2018+), named capture groups, character classes, quantifiers, and all standard flags.',
      },
    ],
    relatedToolIds: ['jsonpath-evaluator', 'string-inspector'],
    keywords: ['regex tester online', 'regular expression tester', 'regex checker online', 'test regex javascript'],
  },

  {
    id: 'jsonpath-evaluator',
    slug: 'jsonpath-evaluator',
    heading: 'JSONPath Evaluator — Query JSON with JSONPath Online',
    primaryKeyword: 'jsonpath evaluator online',
    metaDescription:
      'Evaluate JSONPath expressions against JSON input and view matching nodes. Free, no sign-up, 100% client-side.',
    intro:
      'JSONPath Evaluator applies a JSONPath expression to JSON input and returns the matching nodes as a JSON array. ' +
      'Uses the jsonpath-plus library for full JSONPath support including recursive descent (..), filters, and wildcards.',
    useCases: [
      'Querying specific fields from deep API response JSON',
      'Extracting values from complex nested JSON structures',
      'Testing JSONPath expressions before using them in code',
    ],
    faqs: [
      {
        q: 'What JSONPath syntax does SmartDevBox support?',
        a: 'SmartDevBox uses the jsonpath-plus library, which supports the full JSONPath specification including $, ., .., *, [], ?(), and script expressions.',
      },
    ],
    relatedToolIds: ['json-formatter', 'regex-tester'],
    keywords: ['jsonpath evaluator', 'jsonpath online', 'test jsonpath expression', 'query json online'],
  },

  {
    id: 'string-inspector',
    slug: 'string-inspector',
    heading: 'String Inspector — Analyze Text Statistics Online',
    primaryKeyword: 'string inspector online',
    metaDescription:
      'View character, word, line, sentence, byte, and Unicode statistics for any text. Free, no sign-up, 100% client-side.',
    intro:
      'String Inspector provides detailed statistics for any text: character count (with and without spaces), word count, line count, sentence count, paragraph count, UTF-8 byte size, ASCII vs non-ASCII character counts, unique characters, and top 5 most frequent words.',
    useCases: [
      'Checking character count for social media post limits',
      'Counting words in a draft article or essay',
      'Analysing byte size of a string for database column sizing',
      'Checking for non-ASCII characters in international text',
    ],
    faqs: [
      {
        q: 'How is the byte count different from the character count?',
        a: 'Characters are counted as Unicode code points. Byte count (UTF-8) counts the number of bytes needed to encode the string in UTF-8. Non-ASCII characters (emoji, accented letters, CJK characters) use 2–4 bytes each.',
      },
    ],
    relatedToolIds: ['regex-tester', 'json-formatter'],
    keywords: ['string inspector', 'text statistics online', 'character counter', 'word counter online', 'text analyzer'],
  },

  {
    id: 'cron-parser',
    slug: 'cron-parser',
    heading: 'Cron Job Parser — Decode Cron Expressions Online',
    primaryKeyword: 'cron expression parser online',
    metaDescription:
      'Parse and explain cron expressions in plain English with next scheduled run times. Free, no sign-up, 100% client-side.',
    intro:
      'Cron Job Parser decodes 5-field cron expressions (minute, hour, day-of-month, month, day-of-week) into plain English descriptions and calculates the next 5 scheduled run times.',
    useCases: [
      'Understanding cron schedules in CI/CD pipelines',
      'Debugging unexpected job scheduling in cron-based systems',
      'Verifying that a cron expression runs at the intended times',
      'Learning cron syntax with human-readable explanations',
    ],
    faqs: [
      {
        q: 'How do I parse a cron expression?',
        a: 'Paste your cron expression (e.g. "0 9 * * 1-5") into SmartDevBox. The Cron Job Parser explains it in plain English and lists the next scheduled run times.',
      },
      {
        q: 'What cron expression format does SmartDevBox support?',
        a: 'SmartDevBox supports the standard 5-field cron format: minute (0–59), hour (0–23), day of month (1–31), month (1–12), day of week (0–6, where 0 is Sunday). It supports *, */n, ranges (a-b), and lists (a,b,c).',
      },
    ],
    relatedToolIds: ['unix-timestamp', 'regex-tester'],
    keywords: ['cron expression parser', 'cron job parser online', 'decode cron expression', 'cron schedule explainer'],
  },

  {
    id: 'cert-decoder',
    slug: 'certificate-decoder',
    heading: 'X.509 Certificate Decoder — Inspect SSL/TLS Certs Online',
    primaryKeyword: 'x509 certificate decoder online',
    metaDescription:
      'Decode PEM-encoded X.509 certificates: subject, issuer, validity dates, serial, and signature algorithm. Free, no sign-up, 100% client-side.',
    intro:
      'Certificate Decoder parses PEM-encoded X.509 certificates (SSL/TLS certificates starting with -----BEGIN CERTIFICATE-----) and extracts the subject, issuer, validity period, serial number, and signature algorithm. ' +
      'All parsing runs via a pure-JavaScript ASN.1 DER decoder entirely in the browser.',
    useCases: [
      'Checking certificate expiry dates before renewal',
      'Verifying the Subject CN and SAN fields of a certificate',
      'Inspecting issuer chain information for SSL debugging',
      'Auditing certificate serial numbers and algorithms',
    ],
    faqs: [
      {
        q: 'How do I decode an X.509 certificate?',
        a: 'Paste a PEM-encoded certificate (starting with -----BEGIN CERTIFICATE-----) into SmartDevBox. The Certificate Decoder extracts the subject, issuer, validity period, public key algorithm, and all certificate extensions.',
      },
      {
        q: 'Is it safe to paste a certificate into an online decoder?',
        a: 'X.509 public certificates are designed to be public — they contain no private key material. It is safe to decode them in any online tool. Never paste a private key into an online service.',
      },
    ],
    relatedToolIds: ['base64-decode', 'jwt-inspector'],
    keywords: ['x509 certificate decoder', 'ssl certificate decoder online', 'pem certificate decoder', 'tls cert inspector'],
  },

  {
    id: 'html-preview',
    slug: 'html-preview',
    heading: 'HTML Preview — Live HTML Rendering in Sandboxed Iframe Online',
    primaryKeyword: 'html preview online',
    metaDescription:
      'Live preview HTML markup in a sandboxed iframe alongside the source editor. Free, no sign-up, 100% client-side.',
    intro:
      'HTML Preview renders HTML markup in a sandboxed iframe in real time. ' +
      'A split-pane view shows source and rendered output side by side, updating as you type.',
    useCases: [
      'Previewing HTML email templates',
      'Prototyping HTML snippets without a local development environment',
      'Testing HTML/CSS combinations for quick layout checks',
    ],
    faqs: [
      {
        q: 'Is the HTML Preview sandboxed?',
        a: 'Yes. The preview renders in a sandboxed iframe that restricts scripts, same-origin access, and form submission to prevent unintended side effects.',
      },
    ],
    relatedToolIds: ['html-beautifier', 'css-beautifier', 'markdown-preview'],
    keywords: ['html preview online', 'live html preview', 'html renderer online', 'html editor preview'],
  },
];

/**
 * Map from tool id → SEO data for O(1) lookup.
 */
export const TOOL_SEO_MAP = new Map<string, ToolSeoData>(
  TOOL_SEO_DATA.map((d) => [d.id, d])
);

/**
 * Map from slug → SEO data for route lookup.
 */
export const TOOL_SLUG_MAP = new Map<string, ToolSeoData>(
  TOOL_SEO_DATA.map((d) => [d.slug, d])
);
