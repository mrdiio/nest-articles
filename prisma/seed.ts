import { PrismaClient } from '@prisma/client';
import { ArticleSeeder } from './seeders/ArticleSeeder';

const prisma = new PrismaClient();

async function main() {
  ArticleSeeder(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
