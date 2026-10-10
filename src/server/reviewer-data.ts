import { prisma } from "@/lib/prisma";

export function getTopicsFromDatabase() {
  return prisma.topic.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      notes: { orderBy: { sortOrder: "asc" } },
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
}

export function getTopicFromDatabase(slug: string) {
  return prisma.topic.findUnique({
    where: { slug },
    include: {
      notes: { orderBy: { sortOrder: "asc" } },
      questions: {
        orderBy: { sortOrder: "asc" },
        include: { options: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
}
