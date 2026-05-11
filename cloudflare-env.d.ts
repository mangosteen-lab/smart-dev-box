/**
 * Cloudflare Worker environment bindings.
 * Reflects wrangler.jsonc — regenerate with `npm run cf-typegen` as needed.
 */
interface CloudflareEnv {
  /** Cloudflare asset binding (static files) */
  ASSETS: Fetcher;
  /** Self-referencing service binding for OpenNext caching */
  WORKER_SELF_REFERENCE: Fetcher;
  /** Cloudflare image optimization */
  IMAGES: Fetcher;
  /** Optional: OpenAI API key */
  OPENAI_API_KEY?: string;
  /** Optional: override default OpenAI model */
  OPENAI_MODEL?: string;
  /**
   * Optional: URL to the raw index.json from the SmartDevBox Plugin Hub.
   * e.g. https://raw.githubusercontent.com/mongosteen-lab/smart-dev-box-plugin/main/index.json
   * Leave empty to use the on-disk dev fallback.
   */
  PLUGIN_HUB_INDEX_URL?: string;
}
