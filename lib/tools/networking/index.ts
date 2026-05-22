import { registerTool } from '../registry';

// ── CIDR / Subnet Calculator ──────────────────────────────────────────────────

function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    throw new Error(`Invalid IP address: ${ip}`);
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join('.');
}

registerTool({
  id: 'cidr-calculator',
  name: 'CIDR / Subnet Calculator',
  category: 'Inspection',
  description: 'Calculate subnet details from a CIDR notation (e.g. 192.168.1.0/24): network address, broadcast, host range, mask',
  keywords: [
    'cidr', 'subnet', 'network', 'ip', 'mask', 'netmask', 'broadcast', 'host',
    'devops', 'infra', 'ipv4', 'routing', 'subnet calculator', 'cidr calculator',
    'ip calculator', 'network calculator', 'subnet mask calculator', 'ip range',
    'subnet range', 'ip subnet', 'cidr range', 'calculate subnet',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    // CIDR notation: a.b.c.d/prefix
    if (/^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(t)) return 0.97;
    // Plain IP address — may want subnet info
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(t)) return 0.3;
    return 0;
  },
  execute: (input) => {
    try {
      let cidr = input.trim();
      // If no prefix given, default to /32
      if (!cidr.includes('/')) cidr += '/32';

      const [ipPart, prefixStr] = cidr.split('/');
      const prefix = parseInt(prefixStr);

      if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        return { output: '', error: 'Prefix length must be between 0 and 32.' };
      }

      const ipInt = ipToInt(ipPart);
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const network = (ipInt & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;

      const totalHosts = Math.pow(2, 32 - prefix);
      const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
      const firstHost = prefix >= 31 ? network : network + 1;
      const lastHost = prefix >= 31 ? broadcast : broadcast - 1;

      // Wildcard mask
      const wildcard = (~mask) >>> 0;

      // IP class
      const firstOctet = (ipInt >>> 24) & 255;
      const ipClass =
        firstOctet < 128 ? 'A' :
        firstOctet < 192 ? 'B' :
        firstOctet < 224 ? 'C' :
        firstOctet < 240 ? 'D (Multicast)' : 'E (Reserved)';

      // Private range check
      const isPrivate =
        (firstOctet === 10) ||
        (firstOctet === 172 && ((ipInt >>> 16) & 255) >= 16 && ((ipInt >>> 16) & 255) <= 31) ||
        (firstOctet === 192 && ((ipInt >>> 16) & 255) === 168);

      // Binary representation of mask
      const maskBin = mask.toString(2).padStart(32, '0').replace(/(.{8})/g, '$1.').slice(0, -1);

      const lines = [
        `Input:         ${cidr}`,
        '',
        `Network:       ${intToIp(network)}/${prefix}`,
        `Subnet Mask:   ${intToIp(mask)}`,
        `Wildcard Mask: ${intToIp(wildcard)}`,
        `Broadcast:     ${intToIp(broadcast)}`,
        '',
        `Host Range:    ${intToIp(firstHost)} – ${intToIp(lastHost)}`,
        `Usable Hosts:  ${usableHosts.toLocaleString()}`,
        `Total IPs:     ${totalHosts.toLocaleString()}`,
        '',
        `IP Class:      ${ipClass}`,
        `Private:       ${isPrivate ? 'Yes (RFC 1918)' : 'No'}`,
        '',
        `Binary Mask:   ${maskBin}`,
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'CIDR calculation failed' };
    }
  },
});

// ── IP Address Inspector ──────────────────────────────────────────────────────

registerTool({
  id: 'ip-inspector',
  name: 'IP Address Inspector',
  category: 'Inspection',
  description: 'Inspect an IPv4 or IPv6 address: class, type, range membership, binary representation',
  keywords: [
    'ip', 'ipv4', 'ipv6', 'address', 'inspect', 'network', 'private', 'public',
    'loopback', 'multicast', 'binary', 'ip address inspector', 'ip lookup', 'ip info',
    'ip address info', 'check ip', 'what is my ip class',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(t)) return 0.85;
    if (/^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i.test(t)) return 0.85;
    return 0;
  },
  execute: (input) => {
    try {
      const t = input.trim();

      // IPv4
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(t)) {
        const ipInt = ipToInt(t);
        const octets = t.split('.').map(Number);
        const firstOctet = octets[0];
        const second = octets[1];

        const ipClass =
          firstOctet < 128 ? 'A' :
          firstOctet < 192 ? 'B' :
          firstOctet < 224 ? 'C' :
          firstOctet < 240 ? 'D (Multicast)' : 'E (Reserved)';

        const isPrivate =
          firstOctet === 10 ||
          (firstOctet === 172 && second >= 16 && second <= 31) ||
          (firstOctet === 192 && second === 168);

        const isLoopback = firstOctet === 127;
        const isLinkLocal = firstOctet === 169 && second === 254;
        const isMulticast = firstOctet >= 224 && firstOctet <= 239;
        const isBroadcast = t === '255.255.255.255';

        const binaryGroups = octets.map((o) => o.toString(2).padStart(8, '0'));

        const lines = [
          `Address:     ${t}`,
          `Version:     IPv4`,
          `Class:       ${ipClass}`,
          '',
          `Private:     ${isPrivate ? 'Yes (RFC 1918)' : 'No'}`,
          `Loopback:    ${isLoopback ? 'Yes' : 'No'}`,
          `Link-local:  ${isLinkLocal ? 'Yes (APIPA)' : 'No'}`,
          `Multicast:   ${isMulticast ? 'Yes' : 'No'}`,
          `Broadcast:   ${isBroadcast ? 'Yes' : 'No'}`,
          '',
          `Integer:     ${ipInt}`,
          `Hex:         0x${ipInt.toString(16).toUpperCase().padStart(8, '0')}`,
          `Binary:      ${binaryGroups.join('.')}`,
        ];
        return { output: lines.join('\n'), outputLanguage: 'text' };
      }

      // IPv6 (basic)
      if (/^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i.test(t)) {
        const isLoopback = t === '::1';
        const isLinkLocal = /^fe[89ab]/i.test(t.replace(/:/g, '').padStart(32, '0'));
        const isMulticast = /^ff/i.test(t.replace(/^:+/, ''));
        const isUnspecified = t === '::';

        const lines = [
          `Address:     ${t}`,
          `Version:     IPv6`,
          '',
          `Loopback:    ${isLoopback ? 'Yes' : 'No'}`,
          `Link-local:  ${isLinkLocal ? 'Yes (fe80::/10)' : 'No'}`,
          `Multicast:   ${isMulticast ? 'Yes (ff00::/8)' : 'No'}`,
          `Unspecified: ${isUnspecified ? 'Yes' : 'No'}`,
        ];
        return { output: lines.join('\n'), outputLanguage: 'text' };
      }

      return { output: '', error: 'Input must be a valid IPv4 or IPv6 address.' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'IP inspection failed' };
    }
  },
});

// ── HTTP Status Code Reference ────────────────────────────────────────────────

const HTTP_CODES: Record<string, { phrase: string; description: string; category: string }> = {
  '100': { phrase: 'Continue', category: '1xx Informational', description: 'The server has received the request headers; the client should proceed to send the request body.' },
  '101': { phrase: 'Switching Protocols', category: '1xx Informational', description: 'The server agrees to switch protocols as requested by the client (e.g., HTTP → WebSocket).' },
  '103': { phrase: 'Early Hints', category: '1xx Informational', description: 'Used with the Link header to allow preloading of resources while the server prepares the response.' },
  '200': { phrase: 'OK', category: '2xx Success', description: 'The request succeeded. The response body contains the result.' },
  '201': { phrase: 'Created', category: '2xx Success', description: 'The request succeeded and a new resource was created. The Location header often points to the new resource.' },
  '202': { phrase: 'Accepted', category: '2xx Success', description: 'The request has been accepted for processing but processing has not completed (async operations).' },
  '204': { phrase: 'No Content', category: '2xx Success', description: 'The request succeeded but there is no content to send in the response body (e.g., DELETE).' },
  '206': { phrase: 'Partial Content', category: '2xx Success', description: 'The server is delivering only part of the resource due to a Range header in the request (resumable downloads).' },
  '301': { phrase: 'Moved Permanently', category: '3xx Redirection', description: 'The resource has permanently moved to a new URL. Browsers and search engines update the URL.' },
  '302': { phrase: 'Found', category: '3xx Redirection', description: 'The resource is temporarily at a different URL. The original URL should be used for future requests.' },
  '304': { phrase: 'Not Modified', category: '3xx Redirection', description: 'The resource has not changed since the last request (ETag/Last-Modified). The client can use its cached version.' },
  '307': { phrase: 'Temporary Redirect', category: '3xx Redirection', description: 'Same as 302 but the method and body must not change. Introduced to fix ambiguity with POST redirects.' },
  '308': { phrase: 'Permanent Redirect', category: '3xx Redirection', description: 'Same as 301 but the method and body must not change. The permanent version of 307.' },
  '400': { phrase: 'Bad Request', category: '4xx Client Error', description: 'The server cannot process the request due to a client error (malformed syntax, invalid parameters).' },
  '401': { phrase: 'Unauthorized', category: '4xx Client Error', description: 'Authentication is required and has failed or has not been provided. Use WWW-Authenticate header.' },
  '403': { phrase: 'Forbidden', category: '4xx Client Error', description: 'The server understood the request but refuses to authorize it. Different from 401: identity is known but lacks permission.' },
  '404': { phrase: 'Not Found', category: '4xx Client Error', description: 'The requested resource could not be found. May also be used to hide existence of a resource (security).' },
  '405': { phrase: 'Method Not Allowed', category: '4xx Client Error', description: 'The HTTP method used is not supported for this endpoint. The Allow header lists valid methods.' },
  '408': { phrase: 'Request Timeout', category: '4xx Client Error', description: 'The server timed out waiting for the request. The client may repeat the request.' },
  '409': { phrase: 'Conflict', category: '4xx Client Error', description: 'The request conflicts with the current state of the resource (e.g., duplicate key, version mismatch).' },
  '410': { phrase: 'Gone', category: '4xx Client Error', description: 'The resource is permanently gone. Unlike 404, this signals intentional removal. Useful for SEO.' },
  '411': { phrase: 'Length Required', category: '4xx Client Error', description: 'The server requires a Content-Length header which the client did not provide.' },
  '413': { phrase: 'Content Too Large', category: '4xx Client Error', description: 'The request body exceeds the server\'s configured limit.' },
  '415': { phrase: 'Unsupported Media Type', category: '4xx Client Error', description: 'The Content-Type of the request is not supported by the server for this endpoint.' },
  '422': { phrase: 'Unprocessable Entity', category: '4xx Client Error', description: 'The request was well-formed but failed semantic validation (common in REST APIs for validation errors).' },
  '429': { phrase: 'Too Many Requests', category: '4xx Client Error', description: 'The client has sent too many requests in a given time window (rate limiting). Retry-After header may be present.' },
  '500': { phrase: 'Internal Server Error', category: '5xx Server Error', description: 'The server encountered an unexpected condition that prevented it from fulfilling the request.' },
  '501': { phrase: 'Not Implemented', category: '5xx Server Error', description: 'The server does not support the functionality required to fulfill the request.' },
  '502': { phrase: 'Bad Gateway', category: '5xx Server Error', description: 'The server, while acting as a gateway, received an invalid response from an upstream server.' },
  '503': { phrase: 'Service Unavailable', category: '5xx Server Error', description: 'The server is temporarily unable to handle the request (overloaded, maintenance). Retry-After header may be present.' },
  '504': { phrase: 'Gateway Timeout', category: '5xx Server Error', description: 'The server, acting as a gateway, did not receive a timely response from an upstream server.' },
  '507': { phrase: 'Insufficient Storage', category: '5xx Server Error', description: 'The server cannot store the representation needed to complete the request (WebDAV).' },
};

registerTool({
  id: 'http-status-reference',
  name: 'HTTP Status Code Reference',
  category: 'Inspection',
  description: 'Look up any HTTP status code: phrase, meaning, and usage notes',
  keywords: [
    'http', 'status', 'code', 'response', '200', '201', '204', '301', '302', '400',
    '401', '403', '404', '422', '429', '500', '502', '503', '504', 'rest', 'api',
    'http status', 'status code', 'http codes', 'http status codes', 'http error codes',
    'http response codes', '4xx', '5xx', '3xx', 'http status lookup',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^[1-5]\d{2}$/.test(t)) return 0.95;
    // Detect status codes embedded in HTTP responses (e.g. "HTTP/1.1 404 Not Found")
    if (/HTTP\/[\d.]+ [1-5]\d{2}/.test(t)) return 0.9;
    return 0;
  },
  execute: (input) => {
    try {
      const t = input.trim();
      // Extract code from "HTTP/1.1 404 Not Found" format
      const httpMatch = t.match(/HTTP\/[\d.]+ ([1-5]\d{2})/);
      const code = httpMatch ? httpMatch[1] : t.match(/^[1-5]\d{2}$/)?.[0];

      if (!code) {
        // Show all codes grouped
        const groups: Record<string, string[]> = {};
        for (const [c, info] of Object.entries(HTTP_CODES)) {
          if (!groups[info.category]) groups[info.category] = [];
          groups[info.category].push(`  ${c}  ${info.phrase}`);
        }
        const lines: string[] = ['HTTP Status Codes Reference', ''];
        for (const [cat, codes] of Object.entries(groups)) {
          lines.push(cat, ...codes, '');
        }
        return { output: lines.join('\n'), outputLanguage: 'text' };
      }

      const info = HTTP_CODES[code];
      if (!info) {
        // Code not in our reference but valid format
        const catNum = parseInt(code[0]);
        const category =
          catNum === 1 ? '1xx Informational' :
          catNum === 2 ? '2xx Success' :
          catNum === 3 ? '3xx Redirection' :
          catNum === 4 ? '4xx Client Error' : '5xx Server Error';
        return {
          output: `${code} — Unknown status code\nCategory: ${category}\n\nThis code is not in the standard reference.`,
          outputLanguage: 'text',
        };
      }

      const lines = [
        `${code} ${info.phrase}`,
        `${'─'.repeat(40)}`,
        `Category:    ${info.category}`,
        '',
        `Description: ${info.description}`,
      ];
      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Lookup failed' };
    }
  },
});
