# Prompt Producer

A React-based prompt generation tool with a Node.js backend, designed for creating and managing AI prompts.

## Features

- **Interactive Prompt Builder**: Create prompts with customizable elements
- **User Authentication**: Secure login via Replit OIDC
- **Persistent Storage**: Save and manage prompts with PostgreSQL
- **News Integration**: Fetch current news for prompt inspiration
- **Responsive Design**: Mobile-friendly interface with dark theme

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OIDC with express-session
- **UI Components**: Radix UI, Lucide React icons

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Replit OIDC configuration (for authentication)

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file with:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/prompt_producer
   SESSION_SECRET=your-session-secret
   NEWS_API_KEY=your-news-api-key
   ISSUER_URL=https://replit.com/oidc
   REPL_ID=your-repl-id
   REPLIT_DOMAINS=your-replit-domains
   ```

3. **Database setup**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run check
```

## Deployment

### Replit (Default)

The application is configured for Replit Autoscale deployment. See `replit.md` for detailed configuration.

### Cloudflare Workers

Deploy to Cloudflare Workers for global edge distribution:

1. **Install Wrangler**:
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Configure secrets**:
   ```bash
   wrangler secret put DATABASE_URL
   wrangler secret put SESSION_SECRET
   wrangler secret put NEWS_API_KEY
   # Add other secrets as needed
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

For detailed Cloudflare setup instructions, see [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md).

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── index.html
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Database operations
│   ├── replitAuth.ts # Authentication
│   └── index.ts     # Server entry point
├── shared/          # Shared types and schemas
├── worker.ts        # Cloudflare Workers entry point
└── wrangler.toml    # Cloudflare configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (Replit)
- `npm run build:worker` - Build for Cloudflare Workers
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf:dev` - Local Cloudflare Workers development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

MIT License - see LICENSE file for details.