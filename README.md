# NETEST

NETEST is a local-first personal study app for CCNA networking concepts and troubleshooting practice. The current prototype includes a homepage, original introductory topic notes, and a local SQLite database containing sample questions. Quiz workflows and saved learner progress come in later phases.

## Architecture

The first version is one Next.js App Router application:

- `src/app/` contains the shared page layout, styling, homepage, and reviewer routes.
- `src/features/reviewer/` contains the sample topic and note data used by the reviewer.
- `src/components/` contains shared navigation and application layout.
- `tests/unit/` contains Vitest tests for small logic as it is added.
- `tests/e2e/` contains Playwright browser tests.
- `src/lib/prisma.ts` creates the local Prisma client; `src/server/` contains server-side database queries.
- `prisma/` contains the SQLite schema, checked-in migration, and idempotent sample seed script. The local database file is ignored by Git.

Tailwind CSS provides the styling foundation. The homepage uses plain CSS for its small visual system, so it does not need extra component or icon packages.

## Quiz practice

Use **Quiz practice** in the side navigation to start a quiz. You can use all topics or choose one topic, then pick 3 or 6 questions. If a selected topic has fewer questions than requested, the quiz includes all available questions. Feedback is shown after submission: the results page gives the score, selected and correct answers, and an explanation for each question. Attempts and responses are saved in SQLite and remain available at the attempt URL after reloading.

Scoring lives in `src/features/quizzes/scoring.ts`, separate from the page and database code. The server checks that each selected answer belongs to its question before saving it, and writes the response scores and attempt total together in a database transaction.

## Local setup

Requires Node.js 20.9 or newer and npm. From the project directory:

```sh
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

`db:setup` applies the checked-in migration, generates Prisma Client types, and seeds the sample topics, notes, and questions. `npm install` also updates `package-lock.json` with the Prisma dependencies. The SQLite database is stored in `prisma/dev.db` and stays on this computer. Open <http://localhost:3000>.

To inspect the seeded database from the terminal, run `npm run db:check`. To reseed after editing the sample content, run `npm run db:seed`; stable slugs let the seed update existing sample rows instead of adding duplicates.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium # one-time browser setup, if needed
npm run test:e2e
```

Playwright starts the local development server automatically. Nothing is deployed and no API keys or external services are needed.

## Project direction

The detailed phased scope is in [`NETEST_PROJECT_PLAN.md`](NETEST_PROJECT_PLAN.md). The sample reviewer notes are original summaries organized around Cisco's 200-301 CCNA v1.1 exam domains; they are not official Cisco material. Cisco currently lists the v1.1 exam through February 2, 2027 and v2.0 beginning February 3, 2027. See the [Cisco CCNA exam page](https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html) for current details. Do not introduce cloud services, paid APIs, authentication, or a database before a planned requirement calls for them. Clearly label simulated device output.
