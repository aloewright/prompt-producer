import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Declare the Cloudflare Workers global that's injected at runtime
declare const __STATIC_CONTENT_MANIFEST: string;

const assetManifest = __STATIC_CONTENT_MANIFEST ? JSON.parse(__STATIC_CONTENT_MANIFEST) : {};

export default {
  async fetch(request, env, ctx) {
    try {
      // Serve static assets from the KV namespace
      return await getAssetFromKV(
        {
          request,
          waitUntil: (promise) => ctx.waitUntil(promise),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      // For any path that doesn't match a static file, serve the index.html.
      // This is the core of a Single Page Application (SPA).
      try {
        const url = new URL(request.url);
        const spaRequest = new Request(`${url.origin}/index.html`, request);
        return await getAssetFromKV(
          {
            request: spaRequest,
            waitUntil: (promise) => ctx.waitUntil(promise),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch (err) {
        return new Response('Not Found', { status: 404 });
      }
    }
  },
}; 