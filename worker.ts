import express from "express";
import { registerRoutes } from "./server/routes";
import { serveStatic } from "./server/vite";

// Cloudflare Workers compatibility
declare global {
  const PROMPT_PRODUCER_KV: KVNamespace;
}

// Create and configure Express app
async function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        console.log(logLine);
      }
    });

    next();
  });

  // Setup routes
  await registerRoutes(app);

  // Serve static files in production
  serveStatic(app);

  // Error handling
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  return app;
}

// Convert Express app to Cloudflare Workers handler
function expressToWorker(app: express.Express) {
  return async (request: Request, env: any, ctx: ExecutionContext): Promise<Response> => {
    // Add Cloudflare environment variables to process.env
    if (env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL;
    if (env.SESSION_SECRET) process.env.SESSION_SECRET = env.SESSION_SECRET;
    if (env.NEWS_API_KEY) process.env.NEWS_API_KEY = env.NEWS_API_KEY;
    if (env.ISSUER_URL) process.env.ISSUER_URL = env.ISSUER_URL;
    if (env.REPL_ID) process.env.REPL_ID = env.REPL_ID;
    if (env.REPLIT_DOMAINS) process.env.REPLIT_DOMAINS = env.REPLIT_DOMAINS;

    const url = new URL(request.url);
    
    return new Promise((resolve, reject) => {
      // Create Node.js compatible request/response objects
      const req = {
        method: request.method,
        url: url.pathname + url.search,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: Object.fromEntries(request.headers.entries()),
        body: undefined as any,
        params: {},
        originalUrl: url.pathname + url.search,
        get: function(header: string) {
          return this.headers[header.toLowerCase()];
        },
        user: undefined,
        isAuthenticated: () => false,
        session: {}
      };

      const res = {
        statusCode: 200,
        headers: {} as Record<string, string>,
        body: '',
        finished: false,
        json: function(data: any) {
          this.headers['content-type'] = 'application/json';
          this.body = JSON.stringify(data);
          return this;
        },
        status: function(code: number) {
          this.statusCode = code;
          return this;
        },
        sendFile: function(path: string) {
          this.headers['content-type'] = 'text/html';
          this.body = '<!DOCTYPE html><html><head><title>Prompt Producer</title></head><body><div id="root"></div></body></html>';
          this.end();
          return this;
        },
        send: function(data: any) {
          this.body = typeof data === 'string' ? data : JSON.stringify(data);
          this.end();
          return this;
        },
        end: function(data?: any) {
          if (data) this.body = data;
          this.finished = true;
          const response = new Response(this.body, {
            status: this.statusCode,
            headers: this.headers
          });
          resolve(response);
        },
        on: function(event: string, callback: Function) {
          if (event === 'finish') {
            // Schedule callback to run after response is sent
            setTimeout(() => callback(), 0);
          }
        },
        set: function(key: string, value: string) {
          this.headers[key.toLowerCase()] = value;
        }
      };

      // Handle request body for POST/PUT/PATCH requests
      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        request.text().then(body => {
          try {
            req.body = JSON.parse(body);
          } catch {
            req.body = body;
          }
          processRequest();
        }).catch(reject);
      } else {
        processRequest();
      }

      function processRequest() {
        try {
          app(req as any, res as any, (err: any) => {
            if (err) {
              reject(err);
            } else if (!res.finished) {
              // If response hasn't been sent yet, send a 404
              res.status(404).send('Not Found');
            }
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  };
}

// Initialize the app and export the worker
const app = await createApp();

export default {
  fetch: expressToWorker(app)
};