// Cloudflare Access Authentication
// Cloudflare Access provides JWT tokens through request headers

interface CloudflareAccessUser {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  iat: number;
  exp: number;
}

// Extract user information from Cloudflare Access headers
export function extractUserFromHeaders(request: Request): CloudflareAccessUser | null {
  // Cloudflare Access adds these headers when a user is authenticated
  const cfAccessJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const userEmail = request.headers.get('Cf-Access-Authenticated-User-Email');
  
  if (!cfAccessJwt || !userEmail) {
    return null;
  }

  try {
    // For simplicity, we'll use the email from headers
    // In production, you should verify the JWT signature
    const payload = parseJwtPayload(cfAccessJwt);
    
    return {
      sub: payload.sub || userEmail,
      email: userEmail,
      name: payload.name,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
      iat: payload.iat || Math.floor(Date.now() / 1000),
      exp: payload.exp || Math.floor(Date.now() / 1000) + 3600,
    };
  } catch (error) {
    console.error('Error parsing Cloudflare Access JWT:', error);
    return null;
  }
}

// Simple JWT payload parser (without signature verification)
// In production, you should verify the signature with Cloudflare's public keys
function parseJwtPayload(jwt: string): any {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error parsing JWT payload:', error);
    return {};
  }
}

// Check if a request is authenticated via Cloudflare Access
export function isAuthenticated(request: Request): boolean {
  const user = extractUserFromHeaders(request);
  return user !== null && user.exp > Math.floor(Date.now() / 1000);
}

// Middleware function for API routes
export function requireAuth(handler: (request: Request, user: CloudflareAccessUser, env: any) => Promise<Response>) {
  return async (request: Request, env: any): Promise<Response> => {
    const user = extractUserFromHeaders(request);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (user.exp <= Math.floor(Date.now() / 1000)) {
      return new Response(JSON.stringify({ error: 'Token expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return handler(request, user, env);
  };
}

// For development/testing when Cloudflare Access is not available
export function createMockUser(email: string = 'dev@example.com'): CloudflareAccessUser {
  const now = Math.floor(Date.now() / 1000);
  return {
    sub: email,
    email,
    name: 'Development User',
    given_name: 'Development',
    family_name: 'User',
    iat: now,
    exp: now + 3600, // 1 hour
  };
}

// Check if we're in development mode
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.CLOUDFLARE_ACCOUNT_ID;
}

// Get user for development or production
export function getUserFromRequest(request: Request): CloudflareAccessUser | null {
  if (isDevelopment()) {
    // In development, create a mock user
    return createMockUser();
  }
  
  return extractUserFromHeaders(request);
}
