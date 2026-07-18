// Vercel serverless entry point.
// @vercel/node compiles this TypeScript file and its imports (server.ts).
// The exported handler is the Express app from server.ts.
import app from '../server';
export default app;
