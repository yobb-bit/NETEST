import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { topics } from "../src/features/reviewer/topics.ts";

const questions = [
  {
    slug: "remote-destination-default-gateway",
    topicSlug: "network-fundamentals",
    prompt: "A computer needs to send data to an IP address outside its local subnet. Which device does it send the local Ethernet frame to first?",
    explanation: "The computer sends the frame to its configured default gateway. That router can forward the IP packet toward the remote network. The remote IP address remains the packet destination; the gateway's MAC address is used for the local Ethernet delivery.",
    options: [
      { text: "Its configured default gateway", isCorrect: true },
      { text: "The destination computer's MAC address across the internet", isCorrect: false },
      { text: "Every switch on the local network", isCorrect: false },
      { text: "Its DNS resolver", isCorrect: false },
    ],
  },
  {
    slug: "switch-known-unicast-forwarding",
    topicSlug: "network-access",
    prompt: "A switch knows which port leads to a frame's destination MAC address. How does it normally forward that known unicast frame?",
    explanation: "The switch checks its MAC address table and sends the frame out the associated port within the same VLAN, rather than flooding it to every port.",
    options: [
      { text: "Out the table's matching port in that VLAN", isCorrect: true },
      { text: "Out every port, including the incoming port", isCorrect: false },
      { text: "To the router for every destination", isCorrect: false },
      { text: "Only to ports in the management VLAN", isCorrect: false },
    ],
  },
  {
    slug: "longest-prefix-route-selection",
    topicSlug: "ip-connectivity",
    prompt: "Two routing-table entries match a packet's destination. Which matching route does a router prefer?",
    explanation: "Routers use longest-prefix matching: the matching route with the greatest prefix length describes the most specific destination range and is selected over a less specific route.",
    options: [
      { text: "The route with the longest matching prefix", isCorrect: true },
      { text: "The route with the shortest matching prefix", isCorrect: false },
      { text: "The route learned most recently", isCorrect: false },
      { text: "The route with the largest next-hop address", isCorrect: false },
    ],
  },
  {
    slug: "dhcp-relay-remote-server",
    topicSlug: "ip-services",
    prompt: "DHCP clients and their DHCP server are on different IP networks. What can help the client's broadcast request reach the server?",
    explanation: "A DHCP relay receives the local client broadcast and forwards the request toward a DHCP server on another IP network. The relay allows a centrally located server to serve multiple subnets.",
    options: [
      { text: "A DHCP relay on the client's network gateway", isCorrect: true },
      { text: "A DNS record for the server", isCorrect: false },
      { text: "A switch MAC address-table entry", isCorrect: false },
      { text: "A second default gateway on the client", isCorrect: false },
    ],
  },
  {
    slug: "least-privilege-access",
    topicSlug: "security-fundamentals",
    prompt: "Which practice best reflects the principle of least privilege?",
    explanation: "Least privilege means granting a user or system only the access needed for its task. It limits unnecessary exposure if an account is misused or compromised.",
    options: [
      { text: "Grant only the access needed to perform assigned work", isCorrect: true },
      { text: "Give every user administrator access for convenience", isCorrect: false },
      { text: "Share one administrator password with the whole team", isCorrect: false },
      { text: "Disable logging to keep credentials private", isCorrect: false },
    ],
  },
  {
    slug: "purpose-of-network-api",
    topicSlug: "automation-and-programmability",
    prompt: "What is the main purpose of an API in a network automation workflow?",
    explanation: "An API defines a structured way for one software system to request information or actions from another. Automation tools can use it to repeat operations consistently instead of relying only on manual interaction.",
    options: [
      { text: "Define how software requests data or actions from another system", isCorrect: true },
      { text: "Replace IP addressing on network devices", isCorrect: false },
      { text: "Physically connect a host to a switch", isCorrect: false },
      { text: "Encrypt every packet without configuration", isCorrect: false },
    ],
  },
];

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function seed() {
  for (const [topicIndex, topic] of topics.entries()) {
    const savedTopic = await prisma.topic.upsert({
      where: { slug: topic.slug },
      create: {
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        examObjective: topic.objective,
        sortOrder: topicIndex + 1,
      },
      update: {
        title: topic.title,
        description: topic.description,
        examObjective: topic.objective,
        sortOrder: topicIndex + 1,
      },
    });

    for (const [noteIndex, note] of topic.notes.entries()) {
      const content = `${note.body}\n\nKey ideas:\n${note.takeaways.map((item) => `- ${item}`).join("\n")}`;
      await prisma.studyNote.upsert({
        where: { slug: `${topic.slug}-note-${noteIndex + 1}` },
        create: {
          slug: `${topic.slug}-note-${noteIndex + 1}`,
          title: note.title,
          content,
          sortOrder: noteIndex + 1,
          topicId: savedTopic.id,
        },
        update: { title: note.title, content, sortOrder: noteIndex + 1 },
      });
    }
  }

  for (const [questionIndex, question] of questions.entries()) {
    const savedQuestion = await prisma.question.upsert({
      where: { slug: question.slug },
      create: {
        slug: question.slug,
        prompt: question.prompt,
        explanation: question.explanation,
        sortOrder: questionIndex + 1,
        topic: { connect: { slug: question.topicSlug } },
      },
      update: {
        prompt: question.prompt,
        explanation: question.explanation,
        sortOrder: questionIndex + 1,
        topic: { connect: { slug: question.topicSlug } },
      },
    });

    for (const [optionIndex, option] of question.options.entries()) {
      const seedKey = `${question.slug}-option-${optionIndex + 1}`;
      await prisma.answerOption.upsert({
        where: { seedKey },
        create: {
          seedKey,
          text: option.text,
          isCorrect: option.isCorrect,
          sortOrder: optionIndex + 1,
          questionId: savedQuestion.id,
        },
        update: { text: option.text, isCorrect: option.isCorrect, sortOrder: optionIndex + 1 },
      });
    }
  }

  const [topicCount, noteCount, questionCount] = await Promise.all([
    prisma.topic.count(),
    prisma.studyNote.count(),
    prisma.question.count(),
  ]);
  console.log(`Seeded sample content: ${topicCount} topics, ${noteCount} notes, ${questionCount} questions.`);
}

seed()
  .catch((error: unknown) => {
    console.error("Could not seed NETEST sample content:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
