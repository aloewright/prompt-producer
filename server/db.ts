import { drizzle } from 'drizzle-orm/d1';
import * as schema from "@shared/schema";

// D1Database type from Cloudflare Workers runtime
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  }
  
  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T>;
    run(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }
  
  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    error?: string;
    meta: any;
  }
  
  interface D1ExecResult {
    results: D1Result[];
    count: number;
    duration: number;
  }
}

// D1 database will be available in the Cloudflare Workers environment
// For local development, we'll handle this differently
export function createDb(d1Database: D1Database) {
  return drizzle(d1Database, { schema });
}

// For Workers environment usage
export function getDb(env: { DB: D1Database }) {
  return createDb(env.DB);
}

// For local development (using a different approach)
export async function createLocalDb() {
  // This will be used for local development with wrangler dev
  // The D1 database will be available through the env parameter
  throw new Error("Local D1 database should be accessed through wrangler dev environment");
}