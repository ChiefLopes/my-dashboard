import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Add this line: Runs your seed script with Bun (matches your runtime)
    seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
