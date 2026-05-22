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
  /**
   * Optional long-form body sections rendered as <h2> + paragraphs below the
   * intro. Use this to add educational content (explainers, field guides,
   * worked examples) without bloating the intro string.
   */
  bodySections?: { heading: string; paragraphs: string[] }[];
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
    bodySections: [
      {
        heading: 'How Base64 Encoding Works',
        paragraphs: [
          'Base64 represents arbitrary binary data using only 64 printable ASCII characters: A–Z, a–z, 0–9, plus (+) and slash (/), with equals (=) used as a padding character. The algorithm groups the input bytes into sets of three (24 bits) and re-encodes each group as four 6-bit Base64 characters. Because every possible byte value maps to a printable character, Base64 output can travel safely through any text-based channel — HTTP headers, JSON strings, email bodies, or XML attributes — without corruption.',
          'The encoding increases size by roughly 33 %: 3 bytes of binary become 4 characters of text. If the input length is not a multiple of three, one or two = padding characters are appended so the total output length is a multiple of four. Some systems strip padding (common in JWTs and many APIs), which is why SmartDevBox accepts both padded and unpadded input.',
          'URL-safe Base64 is a variant defined in RFC 4648 §5 that substitutes + with - and / with _ so the encoded string can appear in a URL path or query parameter without percent-encoding. JWTs always use URL-safe Base64 without padding for all three of their sections.',
        ],
      },
      {
        heading: 'Decoding Step by Step',
        paragraphs: [
          'To decode Base64 manually, each character is looked up in the 64-character alphabet to get its 6-bit value. Four characters produce 24 bits, which are split back into three 8-bit bytes. Trailing = padding characters are ignored during the bit-split phase. In JavaScript the built-in atob() function handles standard Base64; URL-safe variants require replacing - with + and _ with / before calling atob().',
          'A common pitfall is line breaks. Some Base64 generators insert a newline every 76 characters (MIME standard). Decoders must strip whitespace before processing, otherwise the line-break characters (ASCII 10 or 13) will cause an "invalid character" error. SmartDevBox strips all whitespace from the input automatically.',
          'Another source of errors is Unicode: Base64 decodes to raw bytes, not JavaScript strings. If the original data was UTF-8 text, you must decode those bytes as UTF-8 after Base64-decoding. SmartDevBox applies TextDecoder with UTF-8 so multi-byte characters (emoji, CJK, accented letters) are displayed correctly.',
        ],
      },
      {
        heading: 'Real-World Examples',
        paragraphs: [
          'HTTP Basic Authentication encodes credentials as Base64: the string username:password is Base64-encoded and sent in the Authorization header as "Basic dXNlcm5hbWU6cGFzc3dvcmQ=". Decoding that value reveals the credentials in plain text — a reminder that Basic Auth should only be used over HTTPS.',
          'Email attachments use Base64 via MIME (Multipurpose Internet Mail Extensions). The raw bytes of a PDF or image are Base64-encoded and embedded in the email body. Your email client decodes them transparently when you open the attachment.',
          'JSON Web Tokens consist of three dot-separated Base64url-encoded sections: header, payload, and signature. The payload section contains the claims — user ID, roles, expiry — encoded as Base64url. Pasting a JWT into this decoder (or into the dedicated JWT Decoder) reveals those claims immediately.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'Why Base64-Encode Text?',
        paragraphs: [
          'Many protocols are designed to carry text, not arbitrary binary data. HTTP headers, JSON values, XML attributes, and email bodies all use ASCII or UTF-8 text. When you need to embed binary content — a file, an image, a cryptographic key — inside one of these text containers, you must encode the binary as text first. Base64 is the standard way to do this: it maps every possible byte value to a printable ASCII character, producing output that is safe to paste into any text field without escaping.',
          'A practical everyday example is HTTP Basic Authentication. The standard requires sending credentials in the form "Authorization: Basic <credentials>" where <credentials> is the Base64 encoding of "username:password". The server Base64-decodes the value to recover the credentials. Another example is embedding images in HTML or CSS using data URIs: "src=\\"data:image/png;base64,iVBOR...\\"".',
        ],
      },
      {
        heading: 'The Encoding Algorithm',
        paragraphs: [
          'Base64 processes input in blocks of three bytes (24 bits). Each block is divided into four 6-bit groups, and each group is mapped to a character in the Base64 alphabet (A–Z = 0–25, a–z = 26–51, 0–9 = 52–61, + = 62, / = 63). If the input is not divisible by three, one or two = padding characters are added to bring the output length to a multiple of four. The result is always exactly 4/3 the size of the input, rounded up to the nearest four characters.',
          'URL-safe Base64 (used in JWTs, OAuth tokens, and many modern APIs) swaps + for - and / for _ so the encoded string does not need percent-encoding when placed in a URL. Padding is often omitted in URL-safe contexts. SmartDevBox encodes to standard Base64 by default; you can strip the trailing = padding manually if the target system requires it.',
        ],
      },
      {
        heading: 'Common Encoding Mistakes',
        paragraphs: [
          'The most frequent mistake is treating Base64 as encryption. It is not. Any Base64 string can be decoded in seconds by anyone. Do not use Base64 to hide passwords, API keys, or sensitive data — use proper encryption (AES-256-GCM) or hashing (bcrypt, Argon2) for that purpose.',
          'A subtler mistake is double-encoding. If your text already contains a Base64 string and you encode the whole thing again, the result is valid Base64 of Base64, which requires two rounds of decoding to read. Check whether the system you are sending to expects raw text or Base64 before encoding.',
          'Unicode handling is important: JavaScript strings are UTF-16, but Base64 encodes bytes. SmartDevBox converts the input text to UTF-8 bytes before encoding, so multi-byte characters (emoji, accented letters, CJK) are encoded correctly. If you are encoding in another language, make sure to specify UTF-8 encoding explicitly to get consistent results.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'Anatomy of a JSON Web Token',
        paragraphs: [
          'A JWT is a compact, URL-safe string composed of three Base64url-encoded sections separated by dots: HEADER.PAYLOAD.SIGNATURE. The header is a JSON object declaring the token type ("JWT") and the signing algorithm (e.g. "alg": "HS256"). The payload is a JSON object containing claims — statements about the user or session. The signature is computed from the header and payload using the chosen algorithm and a secret or private key.',
          'Because the header and payload are only Base64url-encoded, not encrypted, anyone who possesses the token can read its contents without knowing the secret. This is by design: JWTs are transparent containers for claims. The signature proves the token was created by a trusted party and has not been tampered with, but it does not hide the data inside.',
          'The three sections always decode to the same structure. A typical header looks like: {"alg":"HS256","typ":"JWT"}. A typical payload might contain: {"sub":"user_123","iat":1700000000,"exp":1700003600,"roles":["admin"]}.',
        ],
      },
      {
        heading: 'Standard JWT Claims Explained',
        paragraphs: [
          '"iss" (Issuer) identifies who created the token — usually your authorization server URL. "sub" (Subject) is the principal identifier, typically a user ID. "aud" (Audience) specifies the intended recipient(s) of the token; a resource server should reject a token if it is not listed in aud. "exp" (Expiration Time) is a Unix timestamp after which the token is invalid. "iat" (Issued At) is the Unix timestamp when the token was created. "jti" (JWT ID) is an optional unique identifier for the token, useful for revocation.',
          'Tokens commonly also carry custom claims beyond these registered ones: "email", "name", "roles", "permissions", "org_id", and so on. These are application-specific and not standardised by the JWT specification. When debugging an auth issue, the first step is to decode the token and check that the expected custom claims are present and correct.',
          'A frequent debugging scenario: a user receives a 401 from an API. Decode the token and check "exp" — is it in the past? Check "aud" — does it match the API\'s expected audience? Check "roles" or "permissions" — does the user have the right scope? Ninety percent of JWT auth bugs are answered by reading the payload.',
        ],
      },
      {
        heading: 'Security Considerations',
        paragraphs: [
          'Never trust the "alg" header blindly. The infamous "alg: none" attack involves an attacker sending a JWT with no signature and the algorithm set to "none". Servers that accept this will skip signature verification entirely. Always hard-code the accepted algorithm on the server side.',
          'JWT payloads are visible to anyone who has the token. Never put passwords, credit card numbers, or other secrets in the payload. Treat a JWT like a signed, readable ID badge — it proves identity but should not carry classified information.',
          'Short expiry times reduce the damage window if a token is stolen. For access tokens, 15 minutes is a common default. Use refresh tokens (which should be rotated and stored server-side) to obtain new access tokens without re-authenticating the user.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'JWT Signing Algorithms',
        paragraphs: [
          'JWTs can be signed with symmetric algorithms (HMAC) or asymmetric algorithms (RSA, ECDSA). SmartDevBox supports the three HMAC variants: HS256 uses HMAC-SHA256, HS384 uses HMAC-SHA384, and HS512 uses HMAC-SHA512. HMAC signing uses a single shared secret — the same key is used to sign and verify. This is appropriate for tokens consumed by the same service that issued them, or by services that securely share the secret.',
          'Asymmetric algorithms (RS256, ES256) use a private key for signing and a public key for verification. They are preferred for tokens distributed to third parties: the issuer keeps the private key secret but publishes the public key (via a JWKS endpoint), allowing any consumer to verify tokens without being able to create them. SmartDevBox currently supports HMAC algorithms only.',
        ],
      },
      {
        heading: 'Building a Test Token',
        paragraphs: [
          'For API testing, build the minimum viable payload: {"sub":"test-user","iat":<current Unix timestamp>,"exp":<current + 3600>}. The iat claim tells the server when the token was issued; the exp claim sets the one-hour expiry. Add any custom claims your API expects (e.g. "role":"admin", "org_id":"acme"). Use a test secret (e.g. "test-secret-do-not-use-in-production") and sign with HS256.',
          'Paste the resulting token into the JWT Decoder to verify the header and payload look correct before using it in your API client. Check the exp timestamp using the Unix Timestamp Converter to confirm the expiry is what you intended.',
        ],
      },
    ],
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
    keywords: ['url encode', 'url encoder online', 'percent encode string', 'uri encode', 'encode url online', 'percent encoding', 'percent encoding javascript', 'encodeuricomponent online', 'encode url component', 'url percent encoding'],
    bodySections: [
      {
        heading: 'How Percent-Encoding Works',
        paragraphs: [
          'A URL can only contain a defined set of "safe" characters: unreserved characters (A–Z, a–z, 0–9, hyphen, underscore, period, tilde) and reserved characters that have specific structural meaning (/, ?, #, &, =, :, @, etc.). Any other character — spaces, accented letters, emoji, angle brackets — must be percent-encoded: replaced by a % followed by two hexadecimal digits representing the byte value. A space becomes %20, an ampersand becomes %26, a euro sign (€, U+20AC) becomes %E2%82%AC (its three-byte UTF-8 representation).',
          'The RFC 3986 specification distinguishes two functions: encodeURI() leaves structural URL characters intact (so a complete URL remains a valid URL) while encodeURIComponent() encodes everything except unreserved characters. SmartDevBox uses encodeURIComponent(), which is the correct choice for encoding individual values like query parameter values, OAuth state tokens, or path segments containing dynamic user input.',
        ],
      },
      {
        heading: 'Common Encoding Scenarios',
        paragraphs: [
          'Query string values are the most frequent use case. If a user searches for "C++ tutorial" and you append that directly to a URL as ?q=C++ tutorial, the + signs become a literal word separator in classic form encoding, and the space breaks the URL entirely. After encoding: ?q=C%2B%2B%20tutorial. Even better, use the URLSearchParams API in JavaScript, which handles encoding automatically.',
          'OAuth redirect_uri parameters must be encoded when used as a query value within a larger authorization URL. Forgetting to encode them is a common bug that results in an "invalid redirect_uri" error from the authorization server, because the unencoded & in the redirect URI prematurely terminates the outer URL\'s query string.',
          'Path segments containing slashes need special treatment. encodeURIComponent() encodes / as %2F. If your path segment contains a literal slash that should be treated as part of the segment value (not as a path separator), encode it. If you want it to act as a separator, leave it unencoded.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'Reading Percent-Encoded URLs',
        paragraphs: [
          'Log files, browser developer tools, and API error messages frequently contain percent-encoded URLs. A redirect URL that looks like https://example.com/callback?code=abc&state=eyJ0eXAiOiJKV1QifQ%3D%3D&redirect_uri=https%3A%2F%2Fapp.example.com%2Fauth becomes immediately readable once decoded: the state value is a Base64-encoded JSON string, and the redirect_uri is a clean URL.',
          'decodeURIComponent() is the inverse of encodeURIComponent(). It converts each %XX sequence back to the original character, including %2F back to /, %3D back to =, and %20 back to a space. A different function, decodeURI(), only decodes non-structural sequences, leaving characters like %2F encoded so they do not accidentally split the URL path.',
        ],
      },
      {
        heading: 'Double-Encoding Pitfalls',
        paragraphs: [
          'Double-encoding happens when a string that is already percent-encoded gets encoded again. A % character is itself encoded as %25, so %20 (a space) double-encoded becomes %2520. When decoded once you get %20, not a space. This is a frequent source of bugs in proxy servers, URL-rewriting middleware, and OAuth flows where the redirect_uri is passed through multiple encoding layers.',
          'To diagnose a double-encoding issue, decode the string once and see whether the output still contains %XX sequences. If it does, the original string was double-encoded. Decode once more to get the final value. SmartDevBox shows the decoded output immediately, making it easy to spot whether further decoding passes are needed.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'URL Component Breakdown',
        paragraphs: [
          'A URL (Uniform Resource Locator) has up to six distinct components: scheme (https:), authority (//user:password@host:port), path (/some/path), query (?key=value&key2=value2), and fragment (#section). The URL Parser extracts all of these and additionally splits the query string into individual key–value pairs, decoding each percent-encoded value.',
          'The scheme defines the protocol: https for encrypted HTTP, http for plain HTTP, ftp for file transfer, mailto for email, ws/wss for WebSockets. The host is the domain name or IP address. The port is optional — if omitted, the default port for the scheme is used (443 for https, 80 for http). The path identifies the resource on the server. The query string carries parameters. The fragment (#) is processed only by the browser and is never sent to the server.',
        ],
      },
      {
        heading: 'Debugging OAuth and Redirect URLs',
        paragraphs: [
          'OAuth authorization URLs pack a lot of information into the query string: client_id, redirect_uri, response_type, scope, state, nonce, and sometimes code_challenge. When an OAuth flow fails, the first debugging step is to paste the full authorization URL into the parser and inspect each parameter individually. Is the redirect_uri correct and properly encoded? Is the scope correct? Is the state parameter present?',
          'Redirect chains in analytics and affiliate marketing also benefit from URL parsing. A tracked link may contain a destination parameter that is itself a fully percent-encoded URL. The parser shows the outer URL structure; decoding the destination parameter value with the URL Decoder reveals the inner URL. This is the "URL within a URL" pattern common in tracking pixels and ad click attribution.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'Why HTML Encoding Prevents XSS',
        paragraphs: [
          'Cross-site scripting (XSS) is one of the most common web vulnerabilities. It occurs when a web application includes user-supplied data in an HTML page without properly escaping it. If a user submits the string <script>alert(document.cookie)</script> and your application outputs it verbatim into the page HTML, the browser executes it as JavaScript — potentially stealing session cookies or performing actions as the user.',
          'HTML encoding neutralises this by converting the < character to &lt; and > to &gt;. The browser then displays the literal text "<script>alert(document.cookie)</script>" rather than executing it. The five characters that must always be encoded in HTML context are: & → &amp;, < → &lt;, > → &gt;, " → &quot;, and \' → &#39;. Every web framework\'s template engine (React, Django, Rails, Laravel, Go\'s html/template) applies this encoding automatically when you use the standard interpolation syntax.',
          'The vulnerability arises when developers bypass the auto-encoding — for example, by using dangerouslySetInnerHTML in React, or marking a variable as "safe" in Django templates without actually validating it. Always apply HTML encoding as the last transformation before inserting dynamic text into HTML.',
        ],
      },
      {
        heading: 'Named vs Numeric HTML Entities',
        paragraphs: [
          'HTML entities come in two forms: named entities like &amp; and &copy;, and numeric entities like &#38; (decimal) or &#x26; (hexadecimal). Named entities are more readable; numeric entities work for any Unicode code point even if no named entity exists. Both forms decode to the same character. SmartDevBox encodes to named entities for the five critical characters and passes all other characters through unchanged, which is the correct approach for UTF-8 HTML documents.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'When HTML Entities Appear Unexpectedly',
        paragraphs: [
          'HTML entities most commonly appear as a problem in two scenarios. First, double-encoding: a server encodes a string to HTML entities, then the output is fed to another layer that encodes it again, resulting in &amp;amp; in the final HTML. The user sees "&amp;" literally instead of "&". Pasting the string into this decoder reveals whether single or double encoding occurred.',
          'Second, RSS/Atom feeds and XML-based APIs often HTML-encode text content inside CDATA sections or use HTML entities in strings. When you process these programmatically you get the raw entity strings, not the decoded characters. Decoding them before display or further processing is essential.',
          'Email clients and HTML email template systems frequently double-encode special characters. A template may encode an ampersand for safe HTML, then an email service\'s WYSIWYG editor encodes the & in &amp; again, turning it into &amp;amp;. The recipient sees "&amp;" in the rendered email. Use this decoder to diagnose and fix such issues.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'Why JSON Formatting Matters',
        paragraphs: [
          'JSON (JavaScript Object Notation) is the dominant data interchange format for web APIs, configuration files, and NoSQL databases. Production systems often transmit minified JSON — all whitespace removed — to reduce payload size. While this is efficient for machines, it is nearly unreadable to humans. A single-line API response with dozens of nested objects and arrays becomes immediately comprehensible once it is pretty-printed with consistent indentation.',
          'Formatting also reveals structural problems. A missing comma, an extra bracket, or a misplaced colon is nearly impossible to spot in minified JSON but obvious once the data is indented. Well-formatted JSON is also much easier to diff in version control: adding a single key to a formatted JSON object produces a clean one-line diff, whereas the same change in minified JSON shows the entire file as modified.',
        ],
      },
      {
        heading: 'JSON Syntax Rules',
        paragraphs: [
          'JSON is stricter than JavaScript object literal syntax. Keys must be double-quoted strings — single quotes are not valid JSON. Trailing commas after the last item in an array or object are illegal. The value types are: string (double-quoted), number (integer or float, no quotes), boolean (true/false lowercase), null, object ({...}), and array ([...]). Comments are not part of the JSON specification.',
          'Common mistakes: using undefined as a value (not valid JSON), including NaN or Infinity as numbers (not valid JSON — use null or a sentinel string instead), and forgetting to escape special characters in strings (backslash, double quote, and control characters like newline must be escaped as \\\\, \\", and \\n respectively).',
          'SmartDevBox\'s formatter normalises single-quoted JSON (common output from Python\'s repr() and some shell scripts) to standard double-quoted JSON before pretty-printing. It also strips JavaScript-style // and /* */ comments from JSONC (JSON with Comments) files used by TypeScript, VS Code, and many build tools.',
        ],
      },
      {
        heading: 'Worked Formatting Example',
        paragraphs: [
          'Minified input: {"user":{"id":1,"name":"Alice","roles":["admin","editor"]},"active":true,"score":9.5}',
          'After formatting with 2-space indentation, the same data becomes 12 readable lines with clear nesting structure. The roles array items each appear on their own line, the user object\'s properties are vertically aligned, and the boolean and number values are clearly visible.',
          'For deeply nested API responses it helps to collapse sections you are not currently interested in. SmartDevBox\'s split-pane view lets you format in the output pane and then use the JSONPath Evaluator tool to extract a specific sub-object without manually scrolling through the full document.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'What Makes JSON Invalid?',
        paragraphs: [
          'The JSON specification (ECMA-404 / RFC 8259) is unambiguous: there is exactly one correct way to write each value. The most common sources of invalid JSON in practice are: trailing commas after the last element of an array or object, single-quoted strings instead of double-quoted strings, unquoted keys, JavaScript comments (// or /* */), undefined values, NaN, Infinity, and unescaped control characters inside strings.',
          'JavaScript developers often write "JSON-like" object literals in their code and are surprised when the same syntax fails JSON.parse(). The difference: JavaScript allows single quotes, trailing commas, and unquoted identifiers as keys. JSON does not. If you are copying an object literal from JS code into a JSON file, you need to apply the stricter rules.',
          'SmartDevBox\'s validator uses the native JSON.parse() function, which provides a descriptive error message that includes the position of the first syntax error. Position means character offset from the start of the string; the validator converts this to a line and column number to make it easy to find the offending character in a large document.',
        ],
      },
      {
        heading: 'Validating JSON in CI/CD Pipelines',
        paragraphs: [
          'Beyond the browser, JSON validation belongs in automated workflows. Configuration files (package.json, tsconfig.json, .eslintrc.json), API contract fixtures, and seed data files should all be validated before deployment. A malformed config file that reaches production can cause silent failures or full service outages.',
          'For command-line validation, the built-in Python tool works well: python3 -m json.tool input.json > /dev/null exits with code 0 for valid JSON and prints the error with line number for invalid JSON. Node.js users can run node -e "require(\'./file.json\')" for a quick sanity check. Both approaches can be wired into a pre-commit hook or CI step.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'XML Structure and Indentation',
        paragraphs: [
          'XML (eXtensible Markup Language) represents data as a tree of nested elements. Unlike JSON, it supports attributes on elements, mixed content (text and child elements in the same node), and namespace declarations. A well-formed XML document must have exactly one root element, all tags must be properly closed or self-closed, attribute values must be quoted, and special characters in text content must be escaped as entities (&amp;, &lt;, &gt;, &quot;, &apos;).',
          'Minified XML collapses all whitespace, producing a single long line that is unreadable. Formatted XML applies consistent indentation — typically 2 spaces per nesting level — so the tree structure is immediately visible. The formatter does not add or remove any data; it only adjusts whitespace in inter-element positions (whitespace inside text nodes is preserved exactly).',
        ],
      },
      {
        heading: 'Common XML Formats You Will Encounter',
        paragraphs: [
          'SOAP (Simple Object Access Protocol) wraps XML request and response bodies in an Envelope/Body structure. SOAP APIs were the dominant web service style before REST, and many enterprise systems still use them. When debugging a SOAP integration, paste the raw XML body into this formatter to make the structure readable.',
          'SVG (Scalable Vector Graphics) is XML describing vector graphics. Design tools like Figma and Illustrator export SVG; developers often need to paste SVG into HTML or React. Formatting the SVG first makes it easier to remove unnecessary attributes, add accessibility labels, or optimize the path data.',
          'Maven pom.xml and Spring application.xml are Java project configuration formats. They use deeply nested XML with attributes, namespaces, and sometimes hundreds of lines. The formatter collapses redundant whitespace and shows the dependency/plugin structure clearly.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'SQL Formatting Conventions',
        paragraphs: [
          'Formatted SQL capitalises reserved keywords (SELECT, FROM, WHERE, JOIN, GROUP BY, ORDER BY, HAVING, LIMIT) and places each major clause on its own line. Joined tables and WHERE conditions are indented below their parent clause. Subqueries are indented one level deeper than the outer query. This structure makes the query\'s logic immediately readable: you can scan vertically to see which tables are joined, which conditions filter rows, and in what order results are sorted.',
          'SmartDevBox uses the sql-formatter library, which supports standard ANSI SQL and the most common dialects: PostgreSQL, MySQL/MariaDB, SQLite, T-SQL (SQL Server), and PL/SQL (Oracle). Keywords specific to each dialect (e.g. ILIKE in PostgreSQL, LIMIT in MySQL) are recognised and formatted correctly.',
        ],
      },
      {
        heading: 'Formatting ORM-Generated SQL',
        paragraphs: [
          'Object-Relational Mappers (ORMs) like Hibernate, SQLAlchemy, ActiveRecord, and Prisma generate SQL at runtime. When you enable SQL logging in development, the output is usually a single minified line with no indentation. Paste that query here to make it readable, then paste it into your database client (pgAdmin, DBeaver, TablePlus) to analyse the execution plan with EXPLAIN.',
          'Stored procedures and triggers in legacy databases are often hundreds of lines of dense, unformatted SQL. Formatting them before a code review reveals the structure — nested CASE statements, correlated subqueries, cursor loops — and makes it much easier to identify performance bottlenecks or logic errors.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'CSS Formatting Rules',
        paragraphs: [
          'Formatted CSS places each declaration on its own line with consistent indentation, puts the opening brace on the same line as the selector, and adds a blank line between rule sets. This style is enforced by Prettier — the same formatter used by millions of JavaScript projects — ensuring the output is compatible with any CSS linter or style guide.',
          'Minified CSS from production builds collapses all whitespace, making debugging nearly impossible. Pasting minified CSS into this formatter restores the full indented structure without changing any property values or selector specificity. The formatted output is functionally identical to the minified original.',
        ],
      },
      {
        heading: 'Media Queries and Nesting',
        paragraphs: [
          'The formatter correctly handles @media, @keyframes, @supports, and @layer blocks, applying extra indentation to the rules inside the at-rule block. CSS custom properties (--my-variable: value) are preserved exactly. CSS nesting (the new native CSS nesting specification, now supported in all major browsers) is also supported through the Prettier Babel CSS parser.',
          'For very large stylesheets (hundreds of rules), the formatted output is easier to read in a code editor than in a browser text area. Copy the formatted output and paste into VS Code, which applies syntax highlighting. Use Ctrl+F to search for specific selectors or properties.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'HTML Document Structure and Indentation',
        paragraphs: [
          'Well-formatted HTML mirrors the document\'s visual hierarchy through indentation. Block elements (div, section, article, header, nav, main, footer, p, ul, ol, table) are placed on their own lines with child elements indented one level. Inline elements (span, a, strong, em, code) stay on the same line as surrounding text unless they are the sole content of a block.',
          'Prettier\'s HTML formatter (used by SmartDevBox) respects the distinction between block and inline elements and handles edge cases like void elements (br, hr, img, input, meta, link) which do not have closing tags in HTML5. It also formats HTML attributes consistently — one attribute per line when there are many attributes on an element.',
        ],
      },
      {
        heading: 'Formatting HTML Email Templates',
        paragraphs: [
          'HTML emails use table-based layouts for compatibility with email clients. The resulting markup is notoriously nested and verbose. Formatting the template makes it easier to find a specific row or cell, verify alt text on images, and check that all inline styles are correct. Since email templates are rarely served from a web server, all processing here is local — no corporate email content leaves your browser.',
          'After formatting, use the HTML Preview tool to render the template side-by-side with the source, then use the HTML to Text tool to verify the plain-text fallback version looks correct for email clients that do not render HTML.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'What Prettier Fixes in Your JavaScript',
        paragraphs: [
          'Prettier is an opinionated code formatter that enforces a consistent style by reprinting code from scratch according to its rules. It normalises: indentation (2 spaces by default), semicolons (added), quote style (double quotes by default), trailing commas in multi-line expressions (where valid in ES5+), line length (80 characters, wrapping long expressions), and object/array brace spacing.',
          'Prettier does not change your logic — it only changes whitespace and punctuation. A function that works before formatting works identically after. This makes it safe to apply to any JavaScript or TypeScript code without introducing bugs. The Babel parser used here supports the full ES2024 syntax plus TypeScript, JSX, and decorators.',
        ],
      },
      {
        heading: 'Reading Minified JavaScript',
        paragraphs: [
          'Production JavaScript bundles are minified: variable names shortened to single letters, all whitespace removed, multiple statements collapsed onto one line. Formatting a minified bundle restores the whitespace and line breaks, making the code structure readable. The variable names remain shortened (renaming them is a separate deobfuscation step), but the control flow — if/else branches, loops, function calls — becomes clear.',
          'This is useful when debugging a third-party script, understanding a bundled library, or auditing code for security. Paste the minified code, format it, then search for specific function names or string literals. For deeper analysis, follow the source map to the original unminified source if it is available.',
        ],
      },
    ],
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
    keywords: ['javascript validator', 'js syntax checker online', 'validate javascript online', 'js validator', 'validate javascript syntax', 'js checker', 'javascript code checker', 'syntax checker js', 'check javascript online', 'verify javascript online', 'javascript mistake finder', 'javascript validation online', 'syntax validator'],
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
    bodySections: [
      {
        heading: 'Markdown Syntax Cheat Sheet',
        paragraphs: [
          'Headings: prefix a line with # for H1, ## for H2, up to ###### for H6. Bold: **text** or __text__. Italic: *text* or _text_. Inline code: `code`. Code block: wrap in triple backticks (```), optionally followed by the language name for syntax highlighting. Links: [label](url). Images: ![alt text](url). Blockquote: prefix a line with >. Unordered list: prefix lines with - or *. Ordered list: prefix lines with 1. 2. 3. Horizontal rule: --- on its own line.',
          'The live preview in SmartDevBox updates as you type, so you can see the rendered result in real time. This is useful for writing README files, documentation, blog posts, or any content where you want to see the formatted output before publishing.',
        ],
      },
      {
        heading: 'Markdown in Developer Workflows',
        paragraphs: [
          'GitHub, GitLab, and Bitbucket render README.md, CONTRIBUTING.md, and other Markdown files automatically. The preview here matches how GitHub renders standard CommonMark Markdown, making it useful for drafting and checking README content before committing. GitHub-specific extensions like task checkboxes (- [ ]) and emoji shortcodes (:rocket:) are not rendered here.',
          'Markdown is also the native format for static site generators (Jekyll, Hugo, Astro, Docusaurus) and documentation tools (MkDocs, Docz, GitBook). Use this preview to check your content renders correctly before running the full build pipeline.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'JSON Array Structure Requirements',
        paragraphs: [
          'The JSON to CSV converter expects a JSON array where every element is an object with the same keys. The keys of the first object become the CSV column headers. If subsequent objects have different keys, the extra keys are ignored and missing keys produce empty cells. This mirrors how most relational data is structured: rows are records, columns are fields.',
          'If your JSON is a single object rather than an array, wrap it in an array: [...]. If it is a deeply nested document, use the JSONPath Evaluator first to extract the array you want to export. For example, if your API response has shape { "data": { "users": [...] } }, use the JSONPath expression $.data.users to extract the users array before converting.',
        ],
      },
      {
        heading: 'Using the Output in Spreadsheet Applications',
        paragraphs: [
          'The CSV output uses double-quote escaping per RFC 4180. It is compatible with Excel, Google Sheets, LibreOffice Calc, and any tool that imports standard CSV. Copy the output and paste directly into a blank Google Sheet, or save it as a .csv file and import with File → Import.',
          'Excel on Windows may misinterpret UTF-8 CSV if you open it directly by double-clicking. To avoid this, use Excel\'s Data → From Text/CSV import wizard and explicitly select UTF-8 encoding. Google Sheets handles UTF-8 CSV correctly without any extra steps.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'YAML Syntax Overview',
        paragraphs: [
          'YAML (YAML Ain\'t Markup Language) uses indentation to express structure, making it more readable than JSON for configuration files. A JSON object becomes a YAML mapping with key: value pairs on separate lines. A JSON array becomes a YAML sequence where each item is preceded by a dash (- ). Strings do not need quotes unless they contain special characters. Booleans are true/false; null is null or ~. Numbers are unquoted.',
          'YAML is a strict superset of JSON — any valid JSON document is also valid YAML. The reverse is not true: YAML supports features JSON does not, including comments (#), multi-line strings (| for literal block, > for folded block), anchors (&) and aliases (*) for reusing values, and multiple documents in a single file (separated by ---).',
        ],
      },
      {
        heading: 'Real-World Migration Examples',
        paragraphs: [
          'Kubernetes manifests are YAML. When the kubectl CLI outputs resource definitions as JSON (kubectl get pod my-pod -o json), you may want to convert them to YAML to commit to a GitOps repository. Paste the JSON output here and the YAML is ready to save as a .yaml manifest.',
          'GitHub Actions workflows use YAML. If you have a workflow definition in JSON (perhaps generated by a tool), converting to YAML makes it compatible with GitHub Actions. The reverse — YAML to JSON — is useful when you need to process the workflow programmatically with a JSON-only tool.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'CSV Format and Parsing Rules',
        paragraphs: [
          'CSV (Comma-Separated Values) is the most widely-supported tabular data format: every spreadsheet application, database, and data analysis tool can import and export it. The de-facto standard is RFC 4180: the first row is the header (column names), subsequent rows are data records, fields are separated by commas, and fields containing commas or newlines are wrapped in double quotes. A literal double-quote within a quoted field is escaped as two double-quotes ("").',
          'The conversion treats the first CSV row as keys for the JSON objects. Each subsequent row becomes one object in the output array. If a row has fewer fields than the header, the missing keys are set to an empty string. SmartDevBox\'s parser handles RFC 4180 quoting correctly, including multi-line field values enclosed in double quotes.',
        ],
      },
      {
        heading: 'Working with Spreadsheet Exports',
        paragraphs: [
          'When exporting from Google Sheets or Excel, always choose "CSV UTF-8" to preserve special characters. The default Windows Excel CSV format (CSV) uses a system-specific encoding that may corrupt accented letters and emoji. After exporting, paste the contents directly into SmartDevBox — no file upload needed.',
          'Some CSV exports use semicolons (;) as separators instead of commas. This is common in European Excel configurations where the comma is used as the decimal separator. If the converter produces unexpected results, check whether your CSV uses semicolons and replace them with commas first (use the Find & Replace tool in your text editor).',
          'After conversion, use the JSON Formatter to pretty-print the result and the JSONPath Evaluator to extract specific fields. For the reverse operation — JSON back to CSV — use the JSON to CSV tool.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'XML to JSON Mapping Rules',
        paragraphs: [
          'Converting XML to JSON requires decisions about how to represent XML-specific constructs that have no direct JSON equivalent. Attributes are represented as keys prefixed with @ (so the XML element <user id="42"> becomes {"@id":"42",...}). Text content of an element that also has attributes or child elements uses the key #text. An element with only text content becomes a simple string value. An element that repeats at the same level becomes a JSON array.',
          'These conventions are widely used but not standardised — different libraries use different prefixes. SmartDevBox uses the common @/# convention from the fast-xml-parser library. If the consuming code expects a different convention, adjust the output accordingly.',
        ],
      },
      {
        heading: 'Processing SOAP and RSS Feeds',
        paragraphs: [
          'SOAP API responses are the most common reason developers need XML-to-JSON conversion. A SOAP envelope wraps the actual response in layers of namespace-qualified XML: <soap:Envelope><soap:Body><GetUserResponse xmlns="..."><User><Id>42</Id></User></GetUserResponse></soap:Body></soap:Envelope>. Converting to JSON first, then using the JSONPath Evaluator to navigate to the data you need, is far easier than traversing the XML directly.',
          'RSS and Atom feeds are XML documents listing article titles, links, and descriptions. Converting to JSON makes them easy to process in JavaScript: iterate the items array, extract the title and link fields, and display or store the results. The channel element in RSS becomes a JSON object with item as an array of article objects.',
        ],
      },
    ],
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
    keywords: ['json unescape', 'json decode string', 'unescape json online', 'unescape json', 'json unescape online', 'json remove escape', 'escape unescape'],
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
    bodySections: [
      {
        heading: 'What Is a Unix Timestamp?',
        paragraphs: [
          'A Unix timestamp (also called a POSIX timestamp or epoch time) is the number of seconds that have elapsed since 00:00:00 UTC on Thursday, 1 January 1970 — the Unix epoch. It is the most portable way to represent an absolute point in time because it is timezone-independent: the same integer value means the same instant everywhere on Earth, regardless of local timezone or daylight-saving rules.',
          'Unix timestamps are used pervasively in software: database columns storing creation or modification times, JWT "exp" and "iat" claims, HTTP response headers (Last-Modified, Expires), log timestamps, AWS event times, and API rate limit reset times. The value 0 represents 1970-01-01T00:00:00Z; 1700000000 represents 2023-11-14T22:13:20Z.',
          'A 10-digit Unix timestamp counts whole seconds. A 13-digit timestamp counts milliseconds (multiply by 1000). JavaScript\'s Date.now() returns milliseconds; Python\'s time.time() and most Unix system calls return seconds. SmartDevBox auto-detects the scale from the number of digits.',
        ],
      },
      {
        heading: 'Timezone Gotchas',
        paragraphs: [
          'Unix timestamps are absolute — they represent a single moment in time. The ambiguity only arises when converting to a human-readable date, because that conversion depends on which timezone you apply. "1700000000 in UTC" is 2023-11-14 22:13:20. "1700000000 in US Eastern Time" is 2023-11-14 17:13:20 (UTC−5). SmartDevBox displays both UTC and your browser\'s local timezone so you can see both representations.',
          'A common mistake is storing dates as local time strings instead of Unix timestamps. If a user in Berlin books an event "for 10:00 AM on 2024-03-31", and you store the string "2024-03-31T10:00:00", a server in New York will interpret that as 10:00 AM EST — two events on the same day at different times. The correct approach: convert to a Unix timestamp at the moment of input (using the user\'s timezone offset), store the integer, and convert back to local time for display in any timezone.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'What Is a UUID and When Should You Use One?',
        paragraphs: [
          'A UUID (Universally Unique Identifier) is a 128-bit identifier standardised by RFC 4122. UUIDs are formatted as 32 hex digits grouped by hyphens: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx, where M encodes the version and N encodes the variant. UUID v4 is the most commonly used version: 122 of the 128 bits are randomly generated, making collisions essentially impossible in practice (the probability of generating one duplicate among a billion UUIDs is about 1 in a billion billion).',
          'UUIDs are used as primary keys in distributed databases, file names for uploaded assets, correlation IDs in distributed tracing, idempotency keys in payment APIs, and identifiers in any system where you need a unique ID without a central coordinator. They are preferred over auto-incrementing integers when: records are created on multiple machines simultaneously, the ID must not reveal the number of records, or records are merged from multiple databases.',
        ],
      },
      {
        heading: 'UUID Versions Explained',
        paragraphs: [
          'v1 UUIDs embed a timestamp and the generating machine\'s MAC address, making them sortable by creation time. However, embedding the MAC address raises privacy concerns — it identifies the machine. v3 and v5 are namespace-based deterministic UUIDs generated by hashing a namespace UUID and a name (MD5 for v3, SHA-1 for v5) — the same namespace+name always produces the same UUID, useful for creating stable identifiers for known entities. v4 is purely random. The newest v6, v7, and v8 (RFC 9562) bring sortability back without the MAC address: v7 uses a Unix timestamp milliseconds prefix, making UUIDs database-index-friendly like ULIDs.',
          'If you need sortable IDs for a database, consider the ULID Generator instead of UUID v4. ULIDs sort lexicographically by creation time, which keeps database B-tree indexes efficient and avoids index fragmentation — a significant performance issue with random UUID v4 primary keys at scale.',
        ],
      },
    ],
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
    bodySections: [
      {
        heading: 'How Cryptographic Hash Functions Work',
        paragraphs: [
          'A cryptographic hash function takes an input of any length and produces a fixed-length output (the hash or digest) that appears random. The function has three critical properties: it is deterministic (the same input always produces the same hash), it is one-way (you cannot reverse-engineer the input from the hash), and it is collision-resistant (it is computationally infeasible to find two different inputs that produce the same hash). These properties make hashes the foundation of data integrity checks, digital signatures, and password storage.',
          'SHA-256 produces a 256-bit (32-byte, 64 hex character) digest. SHA-512 produces a 512-bit (64-byte, 128 hex character) digest — the larger output makes brute-force attacks twice as expensive per bit. MD5 and SHA-1 are legacy algorithms with known collision vulnerabilities; they should not be used for security-sensitive purposes but remain common for non-security checksums and legacy system compatibility.',
          'Even a single character change in the input produces a completely different hash — this is called the avalanche effect. "Hello" and "hello" produce entirely different SHA-256 hashes. This property is what makes hashes useful for detecting any tampering: if you compare the SHA-256 of a downloaded file against the published checksum and they match, you know the file has not been modified in transit.',
        ],
      },
      {
        heading: 'Common Use Cases',
        paragraphs: [
          'File integrity verification: software download pages publish SHA-256 checksums alongside their downloads. After downloading, compute the SHA-256 of the file locally and compare it to the published value. A mismatch means the file was corrupted in transit or tampered with. Linux package managers (apt, yum, brew) do this check automatically.',
          'Password hashing: web applications must never store passwords in plain text. Instead, they hash the password combined with a random salt value and store the hash. When a user logs in, the same operation is performed and the hashes are compared. A database breach exposes only hashes, not passwords. Note: SHA-256 alone is too fast for password hashing — use bcrypt, scrypt, or Argon2, which are designed to be slow and memory-intensive.',
          'API request signing: some APIs (AWS Signature Version 4, for example) require you to include a SHA-256 HMAC signature of the request body in the request headers. The server recomputes the same signature with its copy of your secret key and rejects the request if the signatures do not match. This prevents both tampering and replay attacks.',
        ],
      },
    ],
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
    keywords: ['random string generator', 'generate random string online', 'random token generator', 'random alphanumeric string', 'get random string', 'random string gen', 'create random string', 'random generator string', 'string generator'],
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
    keywords: ['regex tester online', 'regular expression tester', 'regex checker online', 'test regex javascript', 'javascript test regex online', 'online regex tester', 'regex check', 'check regex online', 'regular expressions test online', 'validate regular expression', 'regex interpreter', 'online regex'],
    bodySections: [
      {
        heading: 'Regular Expression Syntax Quick Reference',
        paragraphs: [
          'A regular expression is a pattern that describes a set of strings. The most fundamental building blocks: a literal character (a) matches itself; a dot (.) matches any character except newline; brackets ([abc]) match any one of the listed characters; a caret inside brackets ([^abc]) matches any character NOT listed. Quantifiers control repetition: ? means zero or one, + means one or more, * means zero or more, {n,m} means between n and m times.',
          'Anchors constrain position rather than matching characters: ^ matches the start of a string (or line with the m flag), $ matches the end. \\b matches a word boundary (the transition between \\w and \\W). Groups ((...)) capture matched substrings for extraction; non-capturing groups (?:...) group without capturing. Alternation (|) matches either the left or right pattern.',
          'Named capture groups (?<name>...) are supported in modern JavaScript and are particularly useful for extracting structured data: the regex (?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2}) extracts the year, month, and day of a date string into named properties of the match object, making the code self-documenting.',
        ],
      },
      {
        heading: 'Flags and Modes',
        paragraphs: [
          'The g (global) flag finds all matches in the input rather than stopping at the first. Without g, only the first match is returned. The i flag makes the pattern case-insensitive. The m flag makes ^ and $ match at the start and end of each line, not just the entire string — essential for processing multi-line text. The s flag (dotAll) makes . match newlines as well as other characters.',
          'The u flag enables full Unicode support: patterns like \\p{Script=Greek} match all Greek Unicode characters, and surrogate pairs (emoji represented as two UTF-16 code units) are treated as a single character. Without u, a regex sees emoji as two separate characters and quantifiers may produce unexpected results.',
        ],
      },
      {
        heading: 'Practical Examples',
        paragraphs: [
          'Email validation (simplified): /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/. This is intentionally simplified — fully RFC 5321-compliant email validation via regex is notoriously complex. For production use, send a confirmation email instead.',
          'Extracting version numbers: /v?(\\d+)\\.(\\d+)\\.(\\d+)/ matches "v1.2.3" and captures "1", "2", "3" as groups. With named groups: /v?(?<major>\\d+)\\.(?<minor>\\d+)\\.(?<patch>\\d+)/.',
          'Finding all URLs in a block of text (basic): /https?:\\/\\/[^\\s]+/g. Paste a block of log output or HTML source into the tester with this pattern and the g flag to extract every URL at once.',
        ],
      },
    ],
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
    relatedToolIds: ['cron-parser', 'unix-timestamp', 'regex-tester'],
    keywords: ['cron expression parser', 'cron job parser online', 'decode cron expression', 'cron schedule explainer'],
    bodySections: [
      {
        heading: 'Cron Expression Field Reference',
        paragraphs: [
          'A standard cron expression has five space-separated fields: minute (0–59), hour (0–23), day-of-month (1–31), month (1–12 or JAN–DEC), and day-of-week (0–6, where 0 and 7 both mean Sunday, or SUN–SAT). Each field accepts: a specific value (30), a wildcard (*), a step value (*/15 means every 15 units), a range (9-17), a list (1,3,5), or combinations of these.',
          'Examples: "0 9 * * 1-5" runs at 09:00 every weekday. "*/15 * * * *" runs every 15 minutes. "0 0 1 * *" runs at midnight on the first day of every month. "0 0 * * 0" runs at midnight every Sunday. The parser shows all of these in plain English and lists the next five run times so you can verify the schedule is correct before deploying.',
        ],
      },
      {
        heading: 'Common Cron Pitfalls',
        paragraphs: [
          'Time zones: cron runs in the server\'s local timezone. If your server is in UTC and you want a job at 9 AM New York time (UTC−5), schedule it at "0 14 * * *" in winter and "0 13 * * *" in summer (UTC−4 during Daylight Saving Time). Alternatively, use a modern scheduler (Kubernetes CronJob, AWS EventBridge) that accepts a timezone parameter and handles DST automatically.',
          'Day-of-month AND day-of-week: when both fields are set (neither is *), most cron implementations run the job when EITHER condition is true (OR logic), not when both are true (AND logic). "0 9 1 * 1" runs at 9 AM on the 1st of every month AND at 9 AM every Monday — not only on Mondays that fall on the 1st. This surprises many developers. To get AND logic, use a script that checks the date programmatically.',
        ],
      },
    ],
  },

  {
    id: 'cert-decoder',
    slug: 'certificate-decoder',
    heading: 'Certificate Decoder — Decode SSL/TLS X.509 Certs Online',
    primaryKeyword: 'certificate decoder',
    metaDescription:
      'Decode SSL/TLS certificates online. Paste a PEM certificate to inspect subject, issuer, validity dates, serial, and algorithm. Free, no sign-up, 100% client-side.',
    intro:
      'Certificate Decoder parses PEM-encoded X.509 certificates (SSL/TLS certificates starting with -----BEGIN CERTIFICATE-----) and extracts the subject, issuer, validity period, serial number, and signature algorithm. ' +
      'You can also paste a raw Base64-encoded certificate (without the PEM headers) — the decoder wraps it automatically. ' +
      'All parsing runs via a pure-JavaScript ASN.1 DER decoder entirely in the browser. ' +
      'No certificate data is sent to a server.',
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
      {
        q: 'What are Subject Alternative Names (SANs) in an SSL certificate?',
        a: 'Subject Alternative Names (SANs) are the list of domain names and IP addresses a certificate is valid for. Modern browsers ignore the Subject CN field for hostname validation and rely entirely on SANs. A certificate for example.com will typically include SANs for both example.com and www.example.com.',
      },
      {
        q: 'How do I get the PEM certificate from a live website?',
        a: 'Run: openssl s_client -connect example.com:443 </dev/null 2>/dev/null | openssl x509 -outform PEM. This prints the server certificate in PEM format, which you can paste directly into the decoder.',
      },
    ],
    relatedToolIds: ['base64-decode', 'jwt-inspector'],
    keywords: ['x509 certificate decoder', 'ssl certificate decoder online', 'pem certificate decoder', 'tls cert inspector', 'certificate decoder', 'ssl decoder', 'ssl certificate decode', 'cert decoder', 'x509 decoder', 'ssl decode', 'decoding certificate', 'decode ssl online', 'tls cert decoder', 'decode base64 certificate', 'online certificate decoder', 'cert decode', 'decode cert', 'decode ssl', 'ssl cert decoder', 'cer decode', 'crt decoder', 'decode certificate', 'certificate viewer', 'read cert', 'ssl certificate decrypt'],
    bodySections: [
      {
        heading: 'What Is an X.509 Certificate?',
        paragraphs: [
          'An X.509 certificate is the standard data structure that proves ownership of a public key. Every HTTPS website, code-signing package, and S/MIME email uses X.509 certificates defined by RFC 5280. The certificate binds a public key to an identity (a domain name, organisation, or individual) using a digital signature from a trusted Certificate Authority (CA).',
          'When you see the padlock in your browser, the server has presented an X.509 certificate. Your browser checks that the certificate was signed by a CA it trusts, that the hostname matches a Subject Alternative Name in the certificate, and that the current date falls within the validity window. If any of those checks fail, the browser shows a warning.',
          'On disk, certificates are usually stored in PEM format — a Base64-encoded DER structure wrapped in -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- headers. DER is the binary ASN.1 encoding of the certificate\'s fields. This decoder converts that Base64 text back to human-readable field values without sending anything to a server.',
        ],
      },
      {
        heading: 'Understanding the Output Fields',
        paragraphs: [
          'Version: X.509 v3 (value 2) is the current standard. v3 added the extensions mechanism, which carries SANs, key usage constraints, and CA path length limits. You will rarely see v1 certificates outside of self-signed root CAs.',
          'Serial Number: A unique integer assigned by the CA. Certificate Transparency logs use the serial number to track issuance. If you are investigating a specific certificate in a CT log or revocation list, this is the field to match on.',
          'Issuer: The Distinguished Name (DN) of the CA that signed the certificate. It is composed of sub-fields: Country (C), State (ST), Locality (L), Organisation (O), Organisational Unit (OU), and Common Name (CN). For a Let\'s Encrypt certificate the issuer CN is typically "R10" or "R11"; for DigiCert it may be "DigiCert TLS RSA SHA256 2020 CA1".',
          'Subject: The DN of the entity the certificate was issued to. For domain certificates the CN is often the primary hostname, though browsers now require SANs for all hostname validation. For EV (Extended Validation) certificates the O field contains the verified legal organisation name.',
          'Validity: Not Before and Not After timestamps define the certificate\'s lifetime. Domain Validation (DV) certificates from public CAs are currently capped at 398 days. Check this field when troubleshooting an expired certificate error.',
          'Subject Alternative Names (SANs): A comma-separated list of DNS names and IP addresses the certificate covers. This is the definitive field for hostname matching. A wildcard SAN such as *.example.com covers one level of subdomain (api.example.com) but not two levels (v1.api.example.com).',
          'Signature Algorithm: The algorithm the CA used to sign the certificate — typically sha256WithRSAEncryption or ecdsa-with-SHA256. SHA-1 signatures were deprecated in 2017; any certificate still showing sha1WithRSAEncryption should be replaced immediately.',
        ],
      },
      {
        heading: 'Worked Example',
        paragraphs: [
          'Below is a minimal self-signed certificate. Paste it into the decoder to follow along:',
          '-----BEGIN CERTIFICATE-----\nMIICpDCCAYwCCQDU9pQ4pHgSpDANBgkqhkiG9w0BAQsFADAUMRIwEAYDVQQDDAls\nb2NhbGhvc3QwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjAUMRIwEAYD\nVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7\n-----END CERTIFICATE-----',
          'The decoder will show: Version v3, a serial number, Issuer CN=localhost, Subject CN=localhost, a one-year validity window, and a 2048-bit RSA public key. Because this is self-signed, the issuer and subject DNs are identical — a pattern that immediately identifies root CAs and development certificates.',
          'For a real production certificate you would typically see a multi-level issuer chain (root CA → intermediate CA → end-entity cert), an O field in the subject for OV/EV certificates, and a SANs extension listing every hostname the certificate is valid for.',
        ],
      },
    ],
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
