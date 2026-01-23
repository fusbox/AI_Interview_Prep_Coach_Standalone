import path from 'path';
import { pathToFileURL } from 'url'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

console.log('✅ VITE CONFIG LOADED - If you see this, the file is active!');

import { IncomingMessage, ServerResponse } from 'node:http';

interface ApiRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string>;
}

const apiPlugin = (): Plugin => ({
  name: 'api-proxy-plugin',
  configureServer(server) {
    server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
      const apiReq = req as ApiRequest;
      if (apiReq.url?.startsWith('/api/')) {
        console.log(`[Vite Middleware] Intercepting: ${apiReq.method} ${apiReq.url}`);

        try {
          // 1. Body Parsing (for POST/PUT)
          if (['POST', 'PUT', 'PATCH'].includes(apiReq.method || '')) {
            const buffers = [];
            for await (const chunk of apiReq) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            try {
              apiReq.body = data ? JSON.parse(data) : {};
            } catch {
              apiReq.body = {};
            }
          }

          // 2. Response Wrapper
          const wrappedRes = {
            status: (code: number) => {
              res.statusCode = code;
              return wrappedRes;
            },
            json: (data: unknown) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return wrappedRes;
            },
            send: (data: unknown) => {
              res.end(data);
              return wrappedRes;
            },
            end: () => {
              res.end();
            },
          };

          // 3. Resolve and Call Handler
          const url = new URL(apiReq.url || '', 'http://localhost');
          const endpoint = url.pathname.replace('/api/', '');

          // Polyfill req.query for Vercel compatibility
          apiReq.query = Object.fromEntries(url.searchParams.entries());

          // Use Vite's module loader which supports TS
          // Path should be root-relative, e.g., /api/endpoint.ts
          let modulePath = `/api/${endpoint}`;
          // Try adding .ts if not present (we assume it's a TS file in api/)
          if (!modulePath.endsWith('.ts') && !modulePath.endsWith('.js')) {
            modulePath += '.ts';
          }

          console.log(`[Vite Middleware] Loading handler via ssrLoadModule: ${modulePath}`);

          const { default: handler } = await server.ssrLoadModule(modulePath);

          if (!handler) {
            throw new Error(`No default exportHandler found for ${modulePath}`);
          }

          await handler(apiReq, wrappedRes);
        } catch (error: unknown) {
          console.error('[Vite Middleware] Error:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          const errorCode = (error as any).code;

          if (errorCode === 'ERR_MODULE_NOT_FOUND') {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `Endpoint not found: ${apiReq.url}` }));
          } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Middleware Error', details: errorMessage }));
          }
        }
      } else {
        next();
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  process.env.GEMINI_API_KEY =
    env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;
  // Inject Supabase keys for API handlers running in SSR context
  process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  process.env.VITE_SUPABASE_ANON_KEY =
    env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL =
    env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const key = process.env.GEMINI_API_KEY;
  if (key) {
    console.log(
      `[Vite Config] GEMINI_API_KEY loaded. Length: ${key?.length}, Starts with: ${key?.substring(0, 5)}...`
    );
  } else {
    console.warn('[Vite Config] GEMINI_API_KEY could not be found in env!');
  }

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
