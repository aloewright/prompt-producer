/// <reference types="@cloudflare/workers-types" />

// Simplified Cloudflare Workers implementation
// This approach avoids bundling the entire Express server
import { getAssetFromKV, NotFoundError, MethodNotAllowedError } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

import { createStorage } from "./server/storage";
import { getUserFromRequest, requireAuth } from "./server/cloudflareAuth";

// Cloudflare Workers types
interface Env {
  DB: D1Database;
  NEWS_API_KEY?: string;
  __STATIC_CONTENT: KVNamespace;
}

declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }
}

// Simple request router
async function handleRequest(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Serve API routes
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, env);
  }

  // Serve static assets
  try {
    return await getAssetFromKV(
      {
        request,
        waitUntil: (promise) => ctx.waitUntil(promise),
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: assetManifest,
        mapRequestToAsset: (req) => {
            const url = new URL(req.url);
            // for SPA, we want to serve index.html for non-file paths
            if (!url.pathname.includes('.')) {
                return new Request(`${url.origin}/index.html`, req);
            }
            return new Request(req.url, req);
        }
      },
    );
  } catch (e) {
    if (e instanceof NotFoundError) {
        // serve index.html for not found assets
        return getAssetFromKV(
            {
                request: new Request(new URL('/index.html', request.url).toString(), request),
                waitUntil: (promise) => ctx.waitUntil(promise),
            },
            {
                ASSET_NAMESPACE: env.__STATIC_CONTENT,
                ASSET_MANIFEST: assetManifest,
            },
        );
    } else if (e instanceof MethodNotAllowedError) {
        return new Response('Method not allowed', { status: 405 });
    } else {
        return new Response('An unexpected error occurred', { status: 500 });
    }
  }
}

// API request handler
async function handleApiRequest(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Initialize D1 storage
  const storage = createStorage(env);

  // Set environment variables from bindings
  if (env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL;
  if (env.SESSION_SECRET) process.env.SESSION_SECRET = env.SESSION_SECRET;
  if (env.NEWS_API_KEY) process.env.NEWS_API_KEY = env.NEWS_API_KEY;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // API routing
  if (pathname === '/api/auth/user') {
    const user = getUserFromRequest(request);
    if (user) {
      return new Response(JSON.stringify(user), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: corsHeaders });
  }

  if (pathname.startsWith('/api/prompts')) {
    const PUBLIC_USER_ID = 'public'; // Use a fixed public user ID
    // This is now a public route
    if (pathname === '/api/prompts' && request.method === 'GET') {
      const prompts = await storage.getSavedPrompts(PUBLIC_USER_ID);
      return new Response(JSON.stringify(prompts), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (pathname === '/api/prompts' && request.method === 'POST') {
      const newPrompt = await request.json() as { text: string, elements: any };
      const created = await storage.savePrompt(PUBLIC_USER_ID, newPrompt.text, newPrompt.elements);
      return new Response(JSON.stringify(created), { status: 201, headers: corsHeaders });
    }
    const promptIdMatch = pathname.match(/^\/api\/prompts\/(\d+)$/);
    if (promptIdMatch && request.method === 'DELETE') {
        const promptId = parseInt(promptIdMatch[1], 10);
        const success = await storage.deletePrompt(PUBLIC_USER_ID, promptId);
        if (success) {
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        } else {
            return new Response(JSON.stringify({ error: 'Prompt not found' }), { status: 404, headers: corsHeaders });
        }
    }
    return new Response('Not found', { status: 404, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

// API handlers
async function handleGetUser(request: Request, user: any, env: any): Promise<Response> {
  try {
    const storage = createStorage(env);
    
    // Upsert user in database (create or update)
    const dbUser = await storage.upsertUser({
      id: user.sub,
      email: user.email,
      firstName: user.given_name || user.name?.split(' ')[0],
      lastName: user.family_name || user.name?.split(' ').slice(1).join(' '),
      profileImageUrl: user.picture,
    });

    return new Response(JSON.stringify(dbUser), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return new Response(JSON.stringify({ error: 'Failed to get user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetPrompts(request: Request, user: any, env: any): Promise<Response> {
  try {
    const storage = createStorage(env);
    const prompts = await storage.getSavedPrompts(user.sub);
    
    // Transform database prompts to frontend format
    const transformedPrompts = prompts.map((prompt: any) => ({
      id: prompt.id.toString(),
      text: prompt.text,
      elements: {
        subject: prompt.subject,
        customSubject: prompt.customSubject,
        subjectAge: prompt.subjectAge,
        subjectGender: prompt.subjectGender,
        subjectAppearance: prompt.subjectAppearance,
        subjectClothing: prompt.subjectClothing,
        context: prompt.context,
        action: prompt.action,
        customAction: prompt.customAction,
        style: prompt.style,
        cameraMotion: prompt.cameraMotion,
        ambiance: prompt.ambiance,
        audio: prompt.audio,
        closing: prompt.closing,
      },
      createdAt: prompt.createdAt.toISOString ? prompt.createdAt.toISOString() : new Date(prompt.createdAt).toISOString(),
    }));

    return new Response(JSON.stringify(transformedPrompts), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error getting prompts:', error);
    return new Response(JSON.stringify({ error: 'Failed to get prompts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleSavePrompt(request: Request, user: any, env: any): Promise<Response> {
  try {
    const body: { text: string, elements: any } = await request.json();
    const storage = createStorage(env);
    
    const savedPrompt = await storage.savePrompt(user.sub, body.text, body.elements);
    
    // Transform to frontend format
    const transformedPrompt = {
      id: savedPrompt.id.toString(),
      text: savedPrompt.text,
      elements: {
        subject: savedPrompt.subject,
        customSubject: savedPrompt.customSubject,
        subjectAge: savedPrompt.subjectAge,
        subjectGender: savedPrompt.subjectGender,
        subjectAppearance: savedPrompt.subjectAppearance,
        subjectClothing: savedPrompt.subjectClothing,
        context: savedPrompt.context,
        action: savedPrompt.action,
        customAction: savedPrompt.customAction,
        style: savedPrompt.style,
        cameraMotion: savedPrompt.cameraMotion,
        ambiance: savedPrompt.ambiance,
        audio: savedPrompt.audio,
        closing: savedPrompt.closing,
      },
      createdAt: savedPrompt.createdAt.toISOString ? savedPrompt.createdAt.toISOString() : new Date(savedPrompt.createdAt).toISOString(),
    };

    return new Response(JSON.stringify(transformedPrompt), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving prompt:', error);
    return new Response(JSON.stringify({ error: 'Failed to save prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDeletePrompt(request: Request, user: any, env: any): Promise<Response> {
  try {
    const url = new URL(request.url);
    const promptId = url.pathname.split('/').pop();
    const storage = createStorage(env);
    
    if (!promptId) {
      return new Response(JSON.stringify({ error: 'Invalid prompt ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await storage.deletePrompt(user.sub, parseInt(promptId, 10));
    
    return new Response(JSON.stringify({ success }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleGetNews(request: Request, env: any): Promise<Response> {
  const newsApiKey = env.NEWS_API_KEY;
  
  if (!newsApiKey) {
    return new Response(JSON.stringify({ message: "News API key not configured" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=10&apiKey=${newsApiKey}`);
    
    if (!response.ok) {
      throw new Error(`News API error: ${response.status}`);
    }

    const data: any = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`News API error: ${data.message || 'Unknown error'}`);
    }

    // Filter out articles with null titles and format the response
    const articles = data.articles
      .filter((article: any) => article.title && article.title !== '[Removed]')
      .map((article: any) => ({
        title: article.title,
        url: article.url,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name
        }
      }));

    return new Response(JSON.stringify(articles), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch news" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Static file serving
async function handleStaticFiles(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Default to index.html for SPA routing
  let filePath = pathname === '/' ? '/index.html' : pathname;
  
  // Remove leading slash for asset lookup
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }
  
  // Try to serve the file from built assets
  // For now, return a basic HTML page
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prompt Producer</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: #e5e5e5;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #3b82f6;
            text-align: center;
            margin-bottom: 30px;
        }
        .status {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .success {
            border-left: 4px solid #10b981;
        }
        .info {
            border-left: 4px solid #3b82f6;
        }
        .code {
            background: #111;
            padding: 15px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
        }
        .button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 10px 10px 10px 0;
        }
        .button:hover {
            background: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Prompt Producer</h1>
        
        <div class="status success">
            <h2>✅ Cloudflare Workers Deployment Active</h2>
            <p>Your application is successfully running on Cloudflare Workers!</p>
        </div>
        
        <div class="status info">
            <h2>📋 Available Endpoints</h2>
            <ul>
                <li><strong>GET /api/prompts</strong> - Get saved prompts</li>
                <li><strong>POST /api/prompts</strong> - Save a new prompt</li>
                <li><strong>DELETE /api/prompts/:id</strong> - Delete a prompt</li>
                <li><strong>GET /api/news</strong> - Get latest news</li>
            </ul>
        </div>
        
        <div class="status info">
            <h2>🔧 Next Steps</h2>
            <p>To complete your deployment:</p>
            <ol>
                <li>Set up your environment variables (DATABASE_URL, SESSION_SECRET, etc.)</li>
                <li>Configure your KV namespace in wrangler.toml</li>
                <li>Deploy your built frontend assets</li>
                <li>Set up authentication</li>
            </ol>
        </div>
        
        <div class="status">
            <h2>🧪 Test the API</h2>
            <p>Try these endpoints:</p>
            <a href="/api/prompts" class="button">Get Prompts</a>
            <a href="/api/news" class="button">Get News</a>
        </div>
        
        <div class="status">
            <h2>📚 Documentation</h2>
            <p>For detailed setup instructions, see:</p>
            <div class="code">CLOUDFLARE_DEPLOYMENT.md</div>
        </div>
    </div>
    
    <script>
        // Test API connectivity
        fetch('/api/prompts')
            .then(response => response.json())
            .then(data => {
                console.log('API Test Success:', data);
            })
            .catch(error => {
                console.error('API Test Error:', error);
            });
    </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Export the worker
export default {
  fetch: handleRequest,
};