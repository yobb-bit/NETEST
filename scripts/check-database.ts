import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function checkDatabase() {
  const topics = await prisma.topic.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      notes: true,
      questions: { include: { options: true } },
    },
  });

  if (topics.length === 0) {
    throw new Error("The database has no topics. Run npm run db:seed first.");
  }

  for (const topic of topics) {
    console.log(`${topic.title}: ${topic.notes.length} notes, ${topic.questions.length} questions`);
    for (const question of topic.questions) {
      const correctOptionCount = question.options.filter((option) => option.isCorrect).length;
      if (correctOptionCount !== 1) {
        throw new Error(`Question "${question.slug}" should have exactly one correct option.`);
      }
    }
  }

  console.log(`Database query succeeded for ${topics.length} topics.`);
}

checkDatabase()
  .catch((error: unknown) => {
    console.error("Could not query the NETEST database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
