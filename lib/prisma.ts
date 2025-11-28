// lib/prisma.ts (or src/lib/prisma.ts)
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; // For PostgreSQL; install via `bun add @prisma/adapter-pg pg`

declare global {
  // Allow global `var` to keep the PrismaClient instance across hot reloads in development
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create the adapter instance (shared across clients)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!, // Ensure .env has DATABASE_URL
});

// Instantiate with adapter (empty options otherwise for Bun/Next.js compatibility)
const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
