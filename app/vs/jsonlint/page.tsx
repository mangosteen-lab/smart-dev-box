import type { Metadata } from 'next';
import { ComparisonPage } from '@/components/features/ComparisonPage';

export const metadata: Metadata = {
  title: 'SmartDevBox vs JSONLint — JSON Validator Comparison',
  description: 'Compare SmartDevBox and JSONLint for JSON validation, formatting, conversion, privacy, and broader developer workflows.',
  alternates: { canonical: 'https://smartdevbox.com/vs/jsonlint' },
};

export default function VsJsonLintPage() {
  return (
    <ComparisonPage
      canonicalPath="/vs/jsonlint"
      eyebrow="Comparison"
      title="SmartDevBox vs JSONLint"
      lead="JSONLint is a focused JSON validation and transformation suite. SmartDevBox adds automatic format detection and a broader toolbox for the data surrounding JSON."
      shortAnswer="Use JSONLint when your work stays entirely inside its deep JSON-focused suite. Use SmartDevBox when a pasted value might be JSON, JWT, YAML, XML, Base64, SQL, a URL, or another developer format and you want the relevant tool immediately."
      competitorName="JSONLint"
      competitorHeading="What Is JSONLint?"
      competitorDescription={[
        'JSONLint started as a JSON validator and reformatter. Its current web suite also includes dedicated tools for repairing, minifying, sorting, querying, comparing, viewing, and converting JSON.',
        'That JSON-first focus is useful when you know the input is JSON and want a specialized workflow such as schema validation, tree viewing, or error analysis.',
      ]}
      smartDevBoxHeading="What SmartDevBox Does Differently"
      smartDevBoxDescription={[
        'SmartDevBox treats JSON as one part of a broader debugging workflow. Paste JSON and it can validate or format it, then use the same interface to inspect a JWT, convert YAML, decode Base64, parse a URL, test a regex, or generate a hash.',
        'Automatic detection reduces the tool-selection step for common pasted inputs. Standard processing remains client-side, with optional AI routing kept separate.',
      ]}
      rows={[
        { feature: 'Primary focus', smartdevbox: 'General developer toolbox', competitor: 'JSON-specific toolkit' },
        { feature: 'JSON validation', smartdevbox: 'Yes, with syntax error details', competitor: 'Yes, core workflow' },
        { feature: 'JSON formatting and minifying', smartdevbox: 'Yes', competitor: 'Yes' },
        { feature: 'Automatic format detection', smartdevbox: 'Yes, across many developer formats', competitor: 'JSON-oriented tools are selected explicitly' },
        { feature: 'Non-JSON formats', smartdevbox: 'JWT, YAML, XML, SQL, Base64, URLs, certificates, and more', competitor: 'Primarily JSON and JSON-adjacent transformations' },
        { feature: 'JSON schema validation', smartdevbox: 'Not currently included', competitor: 'Included' },
        { feature: 'JSON tree viewer and repair', smartdevbox: 'Not currently included', competitor: 'Included' },
        { feature: 'Client-side standard tools', smartdevbox: 'Yes', competitor: 'Browser-based editor and tools' },
      ]}
      smartDevBoxCards={[
        { title: 'Mixed API debugging', description: 'Move between JSON, JWT claims, timestamps, URLs, Base64 values, and hashes without changing sites.' },
        { title: 'Unknown pasted input', description: 'Let automatic detection suggest the likely format and relevant tool.' },
        { title: 'One toolbox tab', description: 'Keep common formatting, conversion, generation, inspection, and text utilities together.' },
      ]}
      competitorCards={[
        { title: 'Deep JSON work', description: 'Use specialized JSON repair, schema validation, tree viewing, sorting, and error-analysis tools.' },
        { title: 'JSON-only workflow', description: 'Stay in a focused interface when every input and output is JSON.' },
        { title: 'Schema validation', description: 'Validate JSON documents against a JSON Schema directly.' },
      ]}
      faqs={[
        { q: 'Is SmartDevBox a JSONLint alternative?', a: 'Yes for JSON validation, formatting, and common developer workflows. JSONLint remains the better fit when you need its specialized JSON repair, tree viewer, or JSON Schema validation features.' },
        { q: 'Can SmartDevBox validate JSON?', a: 'Yes. SmartDevBox validates JSON syntax, formats valid JSON, and reports errors for invalid input.' },
        { q: 'Which tool is better for mixed API responses?', a: 'SmartDevBox is designed for mixed workflows because it also handles JWTs, timestamps, URLs, Base64, YAML, XML, SQL, and many other developer formats.' },
        { q: 'Do I need an account?', a: 'No. SmartDevBox can be used without creating an account.' },
      ]}
      relatedLinks={[
        { href: '/tools/json-validator', label: 'JSON Validator', description: 'Validate JSON syntax in SmartDevBox.' },
        { href: '/tools/json-formatter', label: 'JSON Formatter', description: 'Pretty-print and inspect JSON.' },
        { href: '/tools/jsonpath-evaluator', label: 'JSONPath Evaluator', description: 'Query values from JSON documents.' },
        { href: '/vs/transform-tools', label: 'SmartDevBox vs Transform.tools', description: 'Compare general utilities with a conversion-focused site.' },
      ]}
    />
  );
}
