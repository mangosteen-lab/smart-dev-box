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
