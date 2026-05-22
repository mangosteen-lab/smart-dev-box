import { registerTool } from '../registry';

// ── HMAC Generator ────────────────────────────────────────────────────────────

registerTool({
  id: 'hmac-generator',
  name: 'HMAC Generator',
  category: 'Generation',
  description: 'Generate HMAC signatures using SHA-256 or SHA-512 for API request signing and webhook verification',
  keywords: [
    'hmac', 'sha256', 'sha512', 'hash', 'sign', 'signature', 'webhook', 'api',
    'aws', 'stripe', 'secret', 'mac', 'message authentication', 'hmac sha256',
    'hmac generator', 'generate hmac', 'request signing', 'webhook signature',
  ],
  outputExtension: 'txt',
  detect: () => 0,
  execute: async (input, options) => {
    try {
      const secret = (options?.secret as string) || '';
      const algorithm = (options?.algorithm as string) || 'SHA-256';
      if (!secret) {
        return { output: '', error: 'A secret key is required. Set it via the options panel.' };
      }
      if (!input.trim()) {
        return { output: '', error: 'No message provided.' };
      }

      const algoName = algorithm === 'SHA-512' ? 'SHA-512'
        : algorithm === 'SHA-384' ? 'SHA-384'
        : 'SHA-256';

      const keyData = new TextEncoder().encode(secret);
      const msgData = new TextEncoder().encode(input);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algoName },
        false,
        ['sign']
      );

      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
      const bytes = new Uint8Array(signatureBuffer);

      const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
      const b64 = btoa(String.fromCharCode(...bytes));

      const lines = [
        `Algorithm:  HMAC-${algoName}`,
        `Message:    ${input.slice(0, 80)}${input.length > 80 ? '...' : ''}`,
        `Secret:     ${'*'.repeat(Math.min(secret.length, 8))}`,
        '',
        `Hex:        ${hex}`,
        `Base64:     ${b64}`,
        `Base64URL:  ${b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`,
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'HMAC generation failed' };
    }
  },
});

// ── TOTP / OTP Generator ──────────────────────────────────────────────────────

registerTool({
  id: 'totp-generator',
  name: 'TOTP Generator (RFC 6238)',
  category: 'Generation',
  description: 'Generate Time-based One-Time Passwords (TOTP) for debugging 2FA implementations',
  keywords: [
    'totp', 'otp', '2fa', 'mfa', 'authenticator', 'rfc6238', 'one-time password',
    'two-factor', 'hotp', 'google authenticator', 'time-based', 'totp generator',
    'otp generator', 'generate otp', 'debug 2fa',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    // Base32 secret commonly used for TOTP
    const clean = input.trim().replace(/\s/g, '').toUpperCase();
    return /^[A-Z2-7]{16,}$/.test(clean) && clean.length >= 16 ? 0.6 : 0;
  },
  execute: async (input, options) => {
    try {
      const secret = input.trim().replace(/\s/g, '').toUpperCase();
      if (!secret) return { output: '', error: 'Enter a Base32-encoded TOTP secret.' };

      const digits = typeof options?.digits === 'number' ? options.digits : 6;
      const period = typeof options?.period === 'number' ? options.period : 30;

      // Decode Base32
      const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const bytes: number[] = [];
      let bits = 0, value = 0;
      for (const ch of secret) {
        const idx = BASE32_CHARS.indexOf(ch);
        if (idx === -1) continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
      }
      const keyBytes = new Uint8Array(bytes);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );

      const now = Math.floor(Date.now() / 1000);
      const counter = Math.floor(now / period);

      async function generateOtp(count: number): Promise<string> {
        const counterBuf = new Uint8Array(8);
        let c = count;
        for (let i = 7; i >= 0; i--) {
          counterBuf[i] = c & 0xff;
          c = Math.floor(c / 256);
        }
        const sig = await crypto.subtle.sign('HMAC', cryptoKey, counterBuf);
        const hash = new Uint8Array(sig);
        const offset = hash[hash.length - 1] & 0x0f;
        const code =
          ((hash[offset] & 0x7f) << 24) |
          (hash[offset + 1] << 16) |
          (hash[offset + 2] << 8) |
          hash[offset + 3];
        return String(code % Math.pow(10, digits)).padStart(digits, '0');
      }

      const current = await generateOtp(counter);
      const previous = await generateOtp(counter - 1);
      const next = await generateOtp(counter + 1);

      const remaining = period - (now % period);

      const lines = [
        `Secret:     ${secret}`,
        `Algorithm:  TOTP / HMAC-SHA1 (RFC 6238)`,
        `Period:     ${period}s`,
        `Digits:     ${digits}`,
        '',
        `Current:    ${current}  (valid for ${remaining}s more)`,
        `Previous:   ${previous}`,
        `Next:       ${next}`,
        '',
        `Timestamp:  ${now} (${new Date(now * 1000).toISOString()})`,
        `Counter:    ${counter}`,
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'TOTP generation failed' };
    }
  },
});
