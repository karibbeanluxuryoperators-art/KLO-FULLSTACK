// Vercel serverless entry point.
// @vercel/node compiles this TypeScript file and its imports (server.ts).
// The exported handler is the Express app from server.ts.

import express from 'express';

let app: any = null;
let loadError: any = null;
let loadingPromise: Promise<void> | null = null;

function loadServer(): Promise<void> {
  if (loadingPromise) return loadingPromise;
  loadingPromise = import('../server.js')
    .then((mod: any) => {
      app = mod.default || mod;
      console.log('[klo-api] server.ts loaded OK, app type:', typeof app);
    })
    .catch((err: any) => {
      loadError = err;
      console.error('[klo-api] server.ts LOAD FAILED:', err?.message || err);
      console.error('[klo-api] stack:', err?.stack?.split('\n').slice(0, 8).join(' | '));
    });
  return loadingPromise;
}

// Kick off loading immediately (don't await — let the handler queue up)
loadServer();

const fallback = express();
fallback.get('/api/health', (_req: any, res: any) => {
  res.json({
    status: loadError ? 'error' : (app ? 'ok' : 'loading'),
    timestamp: new Date().toISOString(),
    runtime: 'vercel-serverless',
    error: loadError ? {
      message: loadError.message,
      stack: loadError.stack?.split('\n').slice(0, 8).join('\n'),
    } : undefined,
  });
});
fallback.all('/api/(.*)', async (req: any, res: any) => {
  // Wait for the import to complete (cached after first call)
  if (!app && !loadError) await loadServer();
  if (app) return app(req, res);
  res.status(500).json({ error: loadError?.message || 'server.ts not loaded' });
});

export default fallback;
