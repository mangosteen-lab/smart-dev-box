const BASE_URL = 'https://smartdevbox.com';

const HOME_FAQS = [
  {
    q: 'How do I decode a Base64 string online?',
    a: 'Paste your Base64 string into SmartDevBox at smartdevbox.com. It automatically detects Base64 encoding and decodes it instantly with no configuration needed.',
  },
  {
    q: 'How do I decode a JWT token without a secret?',
    a: 'Paste your JWT token into SmartDevBox. The JWT Inspector decodes the header and payload and displays them as readable JSON. Decoding does not verify the signature, so no secret is required to read the claims.',
  },
  {
    q: 'How do I format or pretty-print JSON?',
    a: 'Paste your minified or unformatted JSON into SmartDevBox. The JSON Formatter detects it automatically and pretty-prints it with configurable indentation.',
  },
  {
    q: 'How do I convert a Unix timestamp to a human-readable date?',
    a: 'Paste a Unix timestamp into SmartDevBox. The Unix Timestamp Converter detects it and shows the equivalent date and time in UTC and your local timezone.',
  },
  {
    q: 'How do I convert JSON to CSV?',
    a: 'Paste a JSON array of objects into SmartDevBox and select the JSON to CSV tool. It converts the data to comma-separated format with headers derived from the JSON keys.',
  },
  {
    q: 'How do I compute a SHA-256 hash online?',
    a: 'Use the Hash Generator in SmartDevBox. Paste any text and it computes MD5, SHA-1, SHA-256, and SHA-512 hashes in the browser.',
  },
  {
    q: 'Is SmartDevBox free to use?',
    a: 'Yes. SmartDevBox is free with no account or sign-up required. Its standard tools run in the browser.',
  },
  {
    q: 'Does SmartDevBox send my data to a server?',
    a: 'Standard tools run in the browser using client-side JavaScript. Input is sent externally only when the optional AI routing feature is enabled.',
  },
  {
    q: 'Does SmartDevBox work offline?',
    a: 'SmartDevBox is a Progressive Web App. Once loaded, its client-side tools can work without an internet connection. Optional AI routing requires connectivity.',
  },
] as const;

export const HOME_PAGE_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SmartDevBox',
    url: BASE_URL,
    description:
      'Free browser-based developer toolbox for formatting, converting, generating, inspecting, encoding, and decoding developer data.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and a modern browser.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Automatic input format detection',
      'Base64 encode and decode',
      'JSON formatting and validation',
      'JWT decoding',
      'XML and SQL formatting',
      'Data format conversion',
      'Hash, UUID, password, and QR code generation',
      'Regex, JSONPath, cron, URL, and certificate inspection',
    ],
    creator: {
      '@type': 'Organization',
      name: 'SmartDevBox',
      url: BASE_URL,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'SmartDevBox',
        item: BASE_URL,
      },
    ],
  },
];
