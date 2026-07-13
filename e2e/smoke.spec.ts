import { expect, test } from '@playwright/test';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/');
});

test('loads the main app shell', async ({ page }) => {
  await expect(page.getByTestId('universal-input')).toBeVisible();
  await expect(page.getByTestId('plugin-manager-button')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Generate/ })).toBeVisible();
  await expect(page.getByTestId('smart-regex-button')).toBeVisible();
  await expect(page.getByText('Output will appear here')).toBeVisible();
});

test('detects and formats JSON from the universal input', async ({ page }) => {
  await page.getByTestId('universal-input').fill('{"b":2,"a":1}');

  const jsonFormatter = page.getByRole('button', { name: /JSON Formatter/ }).first();
  await expect(jsonFormatter).toBeVisible();
  await jsonFormatter.click();

  await expect(page.getByTestId('output-panel')).toContainText('JSON Formatter');
  await expect(page.getByTestId('output-content')).toContainText('"a": 1');
  await expect(page.getByTestId('output-content')).toContainText('"b": 2');
});

test('runs a searched tool from the command palette', async ({ page }) => {
  await page.getByTestId('universal-input').fill('SGVsbG8gV29ybGQ=');

  await page.getByTestId('command-palette-trigger').click();
  await page.getByTestId('command-palette-search').fill('base64 decode');
  await page.getByTestId('command-palette').getByText('Base64 Decode').first().click();

  await expect(page.getByTestId('output-panel')).toContainText('Base64 Decode');
  await expect(page.getByTestId('output-content')).toContainText('Hello World');
});

test('runs focused actions from the Base64 decoder article', async ({ page }) => {
  await page.goto('/tools/base64-decoder');

  const panel = page.getByTestId('article-tool-panel');
  await expect(panel).toBeVisible();
  const panelBox = await panel.boundingBox();
  const inputBox = await panel.getByTestId('article-tool-input').boundingBox();
  expect(panelBox).not.toBeNull();
  expect(inputBox).not.toBeNull();
  expect(inputBox!.width).toBeGreaterThan(panelBox!.width * 0.9);
  await expect(panel.getByRole('button', { name: /^run$/i })).toHaveCount(0);
  await expect(panel.getByRole('button', { name: 'Base64 Decode' })).toHaveAttribute('aria-pressed', 'true');

  const bodyParagraph = page.locator('#bs-how-base64-encoding-works + p').first();
  const paragraphBox = await bodyParagraph.boundingBox();
  expect(paragraphBox).not.toBeNull();
  expect(paragraphBox!.width).toBeGreaterThan(panelBox!.width * 0.9);

  await panel.getByTestId('article-tool-input').fill('SGVsbG8gV29ybGQ=');
  await expect(panel.getByRole('button', { name: 'Base64 Decode' })).toHaveAttribute('aria-pressed', 'true');
  await panel.getByRole('button', { name: 'Base64 Decode' }).click();
  await expect(panel.getByTestId('article-tool-output')).toContainText('Hello World');

  await panel.getByTestId('article-tool-input').fill('Hello World');
  await expect(panel.getByRole('button', { name: 'Base64 Encode' })).toHaveAttribute('aria-pressed', 'true');
  await panel.getByRole('button', { name: 'Base64 Encode' }).click();
  await expect(panel.getByRole('button', { name: 'Base64 Encode' })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByTestId('article-tool-output')).toContainText('SGVsbG8gV29ybGQ=');
});

test('shows the focused runner on the JWT encoder article', async ({ page }) => {
  await page.goto('/tools/jwt-encoder');

  const panel = page.getByTestId('article-tool-panel');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'JWT Encoder' })).toHaveAttribute('aria-pressed', 'true');

  await panel.getByTestId('article-tool-input').fill('{"sub":"user-123"}');
  await panel.getByRole('button', { name: 'JWT Encoder' }).click();
  await expect(panel.getByTestId('article-tool-output')).toContainText('Algorithm: HS256');
  await expect(panel.getByTestId('article-tool-output')).toContainText(/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
});

test('header brand link returns to the homepage', async ({ page }) => {
  await page.goto('/tools/base64-decoder');

  await page.getByTestId('navbar-home-link').click();

  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('universal-input')).toBeVisible();
});

test('generates a UUID and sends it back to the universal input', async ({ page }) => {
  await page.getByRole('button', { name: /^Generate/ }).click();
  await expect(page.getByTestId('generator-hub')).toBeVisible();

  await page.getByPlaceholder(/Search generators/).fill('uuid');
  await page.getByTestId('generator-hub').getByRole('button', { name: /UUID v4/ }).click();
  await page.getByTestId('generator-hub').getByRole('button', { name: 'Generate' }).click();

  await expect(page.getByTestId('generator-result-value')).toHaveText(uuidPattern);
  await page.getByRole('button', { name: /Use as input/ }).click();
  await expect(page.getByTestId('universal-input')).toHaveValue(uuidPattern);
});

test('opens a custom QR code panel from the command palette', async ({ page }) => {
  await page.getByTestId('command-palette-trigger').click();
  await page.getByTestId('command-palette-search').fill('qr code');
  await page.getByTestId('command-palette').getByText('QR Code Generator').first().click();

  await expect(page.getByTestId('custom-panel')).toContainText('QR CODE GENERATOR');
  await expect(page.getByAltText('QR Code')).toBeVisible();
});

test('builds a regex from selected sample text in the generator hub', async ({ page }) => {
  await page.getByTestId('universal-input').fill('user-123');

  await page.getByRole('button', { name: /^Generate/ }).click();
  await page.getByPlaceholder(/Search generators/).fill('smart regex');
  await page.getByTestId('generator-hub').getByRole('button', { name: /Smart Regex Builder/ }).first().click();

  const sample = page.getByTestId('regex-builder-sample');
  await sample.evaluate((el) => {
    const input = el as HTMLTextAreaElement;
    input.focus();
    input.setSelectionRange(0, 4);
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  });
  await page.getByTestId('generator-hub').getByRole('button', { name: 'Alpha' }).first().click();

  await sample.evaluate((el) => {
    const input = el as HTMLTextAreaElement;
    input.focus();
    input.setSelectionRange(5, 8);
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  });
  await page.getByTestId('generator-hub').getByRole('button', { name: 'Number' }).first().click();

  await expect(page.getByTestId('regex-builder-output-card')).toContainText('PCRE2 regex');
  await expect(page.getByTestId('regex-builder-output-card').getByRole('button')).toHaveText('Copy PCRE2');
  await expect(page.getByTestId('regex-builder-output')).toContainText(/\^\(\?<(?:text|user)>\[A-Za-z\]\+\)-\(\?<number>\\d\+\)\$/);
  await page.getByRole('button', { name: /Use regex as input/ }).click();
  await expect(page.getByTestId('universal-input')).toHaveValue(/^\^\(\?<(?:text|user)>\[A-Za-z\]\+\)-\(\?<number>\\d\+\)\$$/);
});

test('opens smart regex as a full panel and suggests by selected text', async ({ page }) => {
  await page.getByTestId('universal-input').fill('192.168.1.10 2020-03-12');
  await page.getByTestId('smart-regex-button').click();

  await expect(page.getByTestId('custom-panel')).toContainText('SMART REGEX BUILDER');
  await expect(page.getByTestId('smart-regex-panel')).toBeVisible();
  await expect(page.getByTestId('split-strategy-toggle-structure')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('split-strategy-toggle-details')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('split-strategy-toggle-semantic')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('split-strategy-toggle-clause')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('split-strategy-toggle-token')).toHaveCount(0);

  const sample = page.getByTestId('regex-builder-sample');
  await expect(page.getByTestId('custom-panel')).toContainText('IPv4 address');
  await page.getByTestId('split-strategy-semantic').getByRole('button', { name: /IPv4 address/ }).click();
  await expect(page.getByTestId('regex-selected-segments')).toContainText('IPv4 address');
  await expect(page.getByTestId('regex-highlighted-source')).toContainText('192.168.1.10');
  await expect(page.getByTestId('regex-builder-output')).toContainText('(?<ip>(?:\\d{1,3}\\.){3}\\d{1,3})');
  await page.getByRole('button', { name: 'Remove IPv4 address selection' }).click();
  await expect(page.getByTestId('regex-selected-segments')).not.toContainText('IPv4 address');

  await sample.fill(' INFO ');
  await sample.evaluate((el) => {
    const input = el as HTMLTextAreaElement;
    input.focus();
    input.setSelectionRange(0, 6);
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  });

  await expect(page.getByTestId('custom-panel')).toContainText('Whitespace + Log level + Whitespace');
  await page.getByTestId('custom-panel').getByRole('button', { name: /Whitespace \+ Log level \+ Whitespace/ }).first().click();
  await expect(page.getByTestId('regex-builder-output')).toContainText('^\\s+(?:TRACE|Trace|trace|DEBUG|Debug|debug|INFO|Info|info|WARN|Warn|warn|WARNING|Warning|warning|ERROR|Error|error|FATAL|Fatal|fatal|CRITICAL|Critical|critical|NOTICE|Notice|notice)\\s+$');

  await sample.fill('2025-10-15 00:07:04.741-04:00 [HOST:tec-w-1320748][SERVER:T978_tec-w-1320748_251015000422223_11412_0001_xasero][PID:8712][THR:5744][Object Server][Error][0x80044B2D][UID:0][SID:0][OID:0][CDSSPropertySet.cpp:394] Item with index 16 is out of range [1, 6] in object id 03EC6B029B7D4FC260A147C8110965A3, type: Property Set, in function: CDSSPropertySet::Item');
  await expect(page.getByTestId('custom-panel')).toContainText('Structured log detected');

  const structure = page.getByTestId('split-strategy-structure');
  await expect(structure.getByRole('button', { name: /Intent structure: Timestamp:/ })).toBeVisible();
  await expect(structure.getByRole('button', { name: /Intent structure: Metadata:/ })).toBeVisible();
  await expect(structure.getByRole('button', { name: /Intent structure: Message:/ })).toBeVisible();

  const details = page.getByTestId('split-strategy-details');
  await expect(details.getByRole('button', { name: /Fields & details: Metadata HOST:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Metadata SERVER:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Severity:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Error code:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Source location:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Numeric range:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Object ID:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Property type:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Function:/ })).toBeVisible();

  await sample.fill('GET /api/items?id=42 HTTP/1.1\nHost: api.example.com\nTrace-Id: abc123');
  await expect(page.getByTestId('custom-panel')).toContainText('HTTP exchange detected');
  await expect(structure.getByRole('button', { name: /Intent structure: Method: GET/ })).toBeVisible();
  await expect(structure.getByRole('button', { name: /Intent structure: Request target: \/api\/items\?id=42/ })).toBeVisible();
  await expect(structure.getByRole('button', { name: /Intent structure: Protocol: HTTP\/1.1/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Header Host:/ })).toBeVisible();
  await expect(details.getByRole('button', { name: /Fields & details: Header Trace-Id:/ })).toBeVisible();
});
