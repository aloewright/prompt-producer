// Simplified Cloudflare Workers implementation
// This approach avoids bundling the entire Express server
import { createStorage } from "./server/storage";
import { getUserFromRequest, requireAuth } from "./server/cloudflareAuth";

// Cloudflare Workers types
interface Env {
  DB: D1Database;
  NEWS_API_KEY?: string;
}

declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }
}

// Simple request router
async function handleRequest(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Initialize D1 storage
  const storage = createStorage(env);

  // Set environment variables
  if (env.DATABASE_URL) process.env.DATABASE_URL = env.DATABASE_URL;
  if (env.SESSION_SECRET) process.env.SESSION_SECRET = env.SESSION_SECRET;
  if (env.NEWS_API_KEY) process.env.NEWS_API_KEY = env.NEWS_API_KEY;
  if (env.ISSUER_URL) process.env.ISSUER_URL = env.ISSUER_URL;
  if (env.REPL_ID) process.env.REPL_ID = env.REPL_ID;
  if (env.REPLIT_DOMAINS) process.env.REPLIT_DOMAINS = env.REPLIT_DOMAINS;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    try {
      let response: Response;

      switch (pathname) {
        case '/api/prompts':
          if (method === 'GET') {
            response = await requireAuth(handleGetPrompts)(request, env);
          } else if (method === 'POST') {
            response = await requireAuth(handleSavePrompt)(request, env);
          } else {
            response = new Response('Method not allowed', { status: 405 });
          }
          break;
        
        case '/api/news':
          if (method === 'GET') {
            response = await handleGetNews(request, env);
          } else {
            response = new Response('Method not allowed', { status: 405 });
          }
          break;
        
        default:
          if (pathname.startsWith('/api/prompts/') && method === 'DELETE') {
            response = await requireAuth(handleDeletePrompt)(request, env);
          } else if (pathname === '/api/auth/user' && method === 'GET') {
            response = await requireAuth(handleGetUser)(request, env);
          } else {
            response = new Response('Not found', { status: 404 });
          }
      }

      // Add CORS headers to API responses
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // Serve static files
  return handleStaticFiles(request, env);
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
    const body = await request.json();
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

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`News API error: ${data.message}`);
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
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env);
  }
};