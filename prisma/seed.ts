import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Instantiate the adapter correctly for v7 (PostgreSQL in Bun)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Pass the adapter to PrismaClient (empty options otherwise for Bun compatibility)
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const demoUserId = "345caea3-b360-4990-a2c6-0087826bd1bf";

  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
      userId: demoUserId,
      name: `Product ${i + 1}`,
      price: (Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 100),
      lowStock: 5,
      createdAt: new Date(
        Date.now() - Math.random() * 1000 * 60 * 60 * 24 * (i * 5)
      ),
    })),
  });

  console.log("seed data created successfully!");
  console.log(`created 25 products for user ${demoUserId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
