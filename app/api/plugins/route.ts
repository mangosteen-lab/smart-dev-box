/**
 * GET /api/plugins
 * Public — no auth required.
 * Returns all published plugins from a plugin hub index.json.
 *
 * Source resolution (first wins):
 *   1. ?url=<encoded>  — any custom index.json URL supplied by the client
 *   2. PLUGIN_HUB_INDEX_URL env var — official hub (set in .dev.vars / wrangler vars)
 *   3. On-disk sibling repo — dev fallback when the remote is unreachable
 *
 * Remote fetches fall back to the on-disk index on non-2xx or network error so
 * development works without a live GitHub URL.
 *
 * Optional query param: ?q=<search>  (filters id, name, description, keywords)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { StorePlugin } from '@/lib/tools/types';

interface HubIndex {
  schemaVersion: string;
  plugins: StorePlugin[];
}

function loadDiskIndex(): StorePlugin[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs   = require('fs')   as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const indexPath = path.join(process.cwd(), '..', 'smart-dev-box-plugin', 'index.json');
    if (!fs.existsSync(indexPath)) return [];
    const raw: HubIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    return raw.plugins ?? [];
  } catch {
    return [];
  }
}

async function fetchRemoteIndex(url: string): Promise<StorePlugin[] | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
    if (!res.ok) {
      console.warn(`[plugins] ${url} returned ${res.status}`);
      return null;
    }
    const data: HubIndex = await res.json();
    return data.plugins ?? [];
  } catch (err) {
    console.warn(`[plugins] fetch failed for ${url}`, err);
    return null;
  }
}

async function loadHubIndex(customUrl?: string): Promise<StorePlugin[]> {
  // 1. Custom URL supplied by the client
  if (customUrl) {
    const plugins = await fetchRemoteIndex(customUrl);
    if (plugins !== null) return plugins;
    // Custom URL failed — return empty rather than leaking the official hub into a
    // custom-source context; the UI will show its own error.
    return [];
  }

  // 2. Official hub URL from env
  const officialUrl = process.env.PLUGIN_HUB_INDEX_URL?.trim();
  if (officialUrl) {
    const plugins = await fetchRemoteIndex(officialUrl);
    if (plugins !== null) return plugins;
    console.warn('[plugins] Official hub unreachable — falling back to disk index');
  }

  // 3. On-disk fallback (local dev)
  return loadDiskIndex();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q         = searchParams.get('q')?.toLowerCase().trim() ?? '';
    const customUrl = searchParams.get('url')?.trim() || undefined;

    const all = await loadHubIndex(customUrl);

    const plugins = q
      ? all.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q) ||
            ('keywords' in p ? (p.keywords ?? []) : []).some((k: string) => k.toLowerCase().includes(q))
        )
      : all;

    return NextResponse.json({ plugins });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch plugins';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
