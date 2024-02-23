import { PrismaClient } from '@prisma/client';

export async function ArticleSeeder(prisma: PrismaClient) {
  const articles = [
    {
      title: 'Article 1',
      content: 'Content 1',
      published: true,
    },
    {
      title: 'Article 2',
      content: 'Content 2',
      published: false,
    },
    {
      title: 'Article 3',
      content: 'Content 3',
      published: true,
    },
  ];

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."articles" RESTART IDENTITY CASCADE;`,
    );
  } catch (error) {
    console.log({ error });
  }

  for (const article of articles) {
    await prisma.article.create({
      data: article,
    });
  }
}
