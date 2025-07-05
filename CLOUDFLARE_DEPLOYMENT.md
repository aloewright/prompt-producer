# Cloudflare Workers Deployment Guide

This guide explains how to deploy the Prompt Producer application to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally with `npm install -g wrangler`
3. **Domain**: Have a domain configured with Cloudflare (optional but recommended)

## Setup Steps

### 1. Authentication

Login to Cloudflare via Wrangler:
```bash
wrangler login
```

### 2. Environment Variables

Set up the required environment variables as secrets:

```bash
# Database connection
wrangler secret put DATABASE_URL

# Session secret for authentication
wrangler secret put SESSION_SECRET

# News API key (optional)
wrangler secret put NEWS_API_KEY

# Replit OIDC configuration (if using Replit auth)
wrangler secret put ISSUER_URL
wrangler secret put REPL_ID
wrangler secret put REPLIT_DOMAINS
```

### 3. KV Namespace Setup

Create a KV namespace for caching/session storage:

```bash
# Create production KV namespace
wrangler kv:namespace create "PROMPT_PRODUCER_KV"

# Create preview KV namespace  
wrangler kv:namespace create "PROMPT_PRODUCER_KV" --preview
```

Update the `wrangler.toml` file with the returned namespace IDs.

### 4. Database Setup

Ensure your PostgreSQL database is accessible from Cloudflare Workers:

- **Neon Database**: Works well with Cloudflare Workers
- **Supabase**: Requires REST API or connection pooling
- **PlanetScale**: Requires HTTP API
- **Self-hosted**: Must be publicly accessible

### 5. Build and Deploy

Build the worker:
```bash
npm run build:worker
```

Deploy to development environment:
```bash
npm run deploy:dev
```

Deploy to production:
```bash
npm run deploy:prod
```

## Configuration

### wrangler.toml

The `wrangler.toml` file contains the Cloudflare Workers configuration:

- **name**: Your worker name
- **main**: Entry point (dist/worker.js)
- **compatibility_date**: Cloudflare Workers API compatibility date
- **compatibility_flags**: Enable Node.js compatibility
- **vars**: Environment variables
- **kv_namespaces**: KV storage bindings

### Environment-specific Deployments

- **Development**: `wrangler deploy --env dev`
- **Production**: `wrangler deploy --env production`

## Local Development

Test the worker locally:
```bash
npm run cf:dev
```

This starts a local development server that mimics the Cloudflare Workers environment.

## Custom Domain

To use a custom domain:

1. Add your domain to Cloudflare
2. Create a route in the Cloudflare dashboard
3. Point the route to your worker

## Monitoring

Monitor your worker in the Cloudflare dashboard:
- **Analytics**: Request metrics and performance
- **Logs**: Real-time logs (with `wrangler tail`)
- **Errors**: Error tracking and debugging

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure your database is accessible from Cloudflare Workers
2. **Authentication Issues**: Check that all secrets are properly set
3. **Build Errors**: Verify all dependencies are compatible with Cloudflare Workers
4. **Route Conflicts**: Ensure your routes don't conflict with Cloudflare's reserved paths

### Debugging

View live logs:
```bash
wrangler tail
```

Check worker status:
```bash
wrangler dev
```

## Scaling

Cloudflare Workers automatically scale based on demand. Monitor usage in the dashboard and adjust limits as needed.

## Security

- All secrets are encrypted at rest
- HTTPS is enforced by default
- Consider implementing rate limiting for API endpoints
- Use Cloudflare's security features (DDoS protection, WAF, etc.)

## Cost Optimization

- Monitor request volume in the dashboard
- Optimize database queries to reduce latency
- Use KV storage for caching to reduce database load
- Consider using Cloudflare's caching features for static assets