/**
 * GET /api/plugins
 * Public — no auth required.
 * Returns all published plugins from the SmartDevBox Plugin Hub (index.json).
 *
 * Resolution order:
 *   1. Fetch PLUGIN_HUB_INDEX_URL remotely (set in .dev.vars or wrangler vars).
 *   2. If the remote fetch fails (network error, non-2xx), fall back to the
 *      on-disk index.json in the sibling smart-dev-box-plugin repo.
 *   3. If neither is available, return an empty list.
 *
 * Optional query param: ?q=<search>  (filters id, name, description, keywords)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { StorePlugin } from '@/lib/tools/types';

/** Shape of the index.json produced by generate-index.js in the hub repo */
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
    // process.cwd() is the project root in both `next dev` and `next build`
    const indexPath = path.join(process.cwd(), '..', 'smart-dev-box-plugin', 'index.json');
    if (!fs.existsSync(indexPath)) return [];
    const raw: HubIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    return raw.plugins ?? [];
  } catch {
    return [];
  }
}

async function loadHubIndex(): Promise<StorePlugin[]> {
  const remoteUrl = process.env.PLUGIN_HUB_INDEX_URL?.trim();

  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl, {
        // Revalidate at most every 5 minutes in production
        next: { revalidate: 300 },
      } as RequestInit);

      if (res.ok) {
        const data: HubIndex = await res.json();
        return data.plugins ?? [];
      }
      // Non-2xx (e.g. 404 while hub repo is not yet public) → fall through to disk
      console.warn(`[plugins] Remote hub returned ${res.status} — falling back to disk index`);
    } catch (err) {
      console.warn(`[plugins] Remote hub fetch failed — falling back to disk index`, err);
    }
  }

  return loadDiskIndex();
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
    const all = await loadHubIndex();

    const plugins = q
      ? all.filter(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q) ||
            (p.keywords ?? []).some((k) => k.toLowerCase().includes(q))
        )
      : all;

    return NextResponse.json({ plugins });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch plugins';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
