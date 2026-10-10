# NETEST --- Project Plan and AI Coding-Agent Brief

## 1. Project overview

**Project name:** NETEST\
**Purpose:** A local-first personal study application for learning CCNA
networking concepts and practicing IT/network troubleshooting.\
**Primary user:** The developer, a student preparing for CCNA and
exploring network engineering / IT troubleshooting.\
**Deployment target:** Local development only. Do not deploy or add
hosting requirements unless explicitly requested later.

NETEST should help the user understand networking, not merely memorize
answers. Every question should include a clear explanation of why the
answer is correct and, where useful, why common alternatives are
incorrect.

## 2. Goals

-   Organize CCNA study notes by topic and exam objective.
-   Practice multiple-choice questions and review explanations.
-   Track quiz results, completion, bookmarks, and weak topics locally.
-   Practice IPv4 subnetting and common Cisco IOS troubleshooting
    commands.
-   Use automated tests throughout development, especially Playwright
    end-to-end tests.
-   Keep the project understandable to a student developer who is still
    learning.

## 3. Non-goals for the first version

Do NOT build these in the MVP unless explicitly requested: - Public
hosting, deployment, cloud database, or multi-user accounts. - Paid
services or required API keys. - AI-generated answers or AI API
integration. - Real router/switch configuration or live network
scanning. - A full Packet Tracer replacement or full network
simulator. - Complex gamification, social features, subscriptions, or
admin portals.

NETEST should work locally and should not need internet access for its
normal study workflows after dependencies are installed. Coding
assistants themselves may still require internet.

## 4. Recommended technology stack

-   **Language:** TypeScript
-   **Application:** Next.js with React and App Router
-   **Styling:** Tailwind CSS
-   **UI components:** shadcn/ui where useful; avoid unnecessary
    component dependencies
-   **Local database:** SQLite
-   **Database access:** Prisma ORM, using a Prisma/SQLite setup
    compatible with the installed Prisma version
-   **Validation:** Zod for input and data validation
-   **Unit tests:** Vitest
-   **Browser/end-to-end tests:** Playwright with TypeScript
-   **Linting / type checking:** ESLint and TypeScript compiler
-   **Version control:** Git; GitHub optional
-   **Package manager:** npm

Keep the first architecture in one Next.js project. Do not add Express,
FastAPI, Supabase, Docker, or other infrastructure unless a real
requirement appears and the user approves it.

## 5. MVP features

### A. Dashboard

-   Welcome / continue-studying area.
-   Topic progress summary.
-   Recent quiz result.
-   Bookmarked questions shortcut.
-   Weak topics based on incorrect answers.
-   Simple, responsive layout.

### B. Topic reviewer

-   Browse topics and subtopics.
-   Read concise notes, definitions, examples, and command references.
-   Mark a topic as reviewed/completed.
-   Link topics to related quizzes and practice exercises.
-   Display the content source/version or review date where appropriate.

Suggested topic categories (organize against the current official Cisco
CCNA exam objectives): - Network fundamentals - Network access
(including VLANs and trunking) - IP connectivity and routing - IP
services (including DHCP, DNS, NAT, and NTP) - Security fundamentals -
Automation and programmability - IPv4/IPv6 addressing and subnetting
practice

Do not claim the content is an official Cisco product. Do not use leaked
exam dumps or reproduce copyrighted question banks. Write original
practice questions and explanations.

### C. Quiz engine

-   Multiple-choice questions, including single-answer questions in the
    MVP.
-   Optional topic selection and question count.
-   Immediate or end-of-quiz feedback; use a consistent approach and
    document it.
-   Score summary.
-   Explanation for each answer.
-   Review incorrect answers.
-   Store quiz attempts locally.

### D. Bookmarks and progress

-   Bookmark/unbookmark a question.
-   Save attempts, scores, timestamps, and selected answers.
-   Store topic completion and user progress locally.
-   Progress must remain after restarting the development server or
    reloading the page.
-   Include sensible empty states for new users.

### E. Subnetting practice

-   Practice network address, prefix/mask, total addresses, usable host
    range, broadcast address, and related calculations.
-   Start with a few well-tested IPv4 exercises.
-   Keep calculation logic separate from UI components.
-   Add unit tests for edge cases, including /31 and /32 behavior, and
    explicitly document the chosen conventions.
-   Do not present a result without explaining the calculation.

### F. Troubleshooting practice

-   Present a scenario, symptoms, and relevant simulated device output.
-   Ask the learner to select the next diagnostic command or identify
    the likely issue.
-   Begin with simple, authored cases such as wrong default gateway,
    incorrect VLAN assignment, interface down, DHCP issue, and missing
    route.
-   Clearly label command output as simulated.
-   Explain the reasoning and the next diagnostic step.
-   This is a learning simulator only; it must not claim to configure
    real equipment.

## 6. Suggested data model

Design a small, normalized schema. Exact Prisma syntax should follow the
installed version.

-   **Topic:** id, title, slug, description, sort order, optional exam
    objective/version.
-   **StudyNote:** id, topic relation, title, content, sort order,
    updated timestamp.
-   **Question:** id, topic relation, prompt, type, explanation,
    difficulty, optional objective/version, created/updated timestamps.
-   **AnswerOption:** id, question relation, text, isCorrect,
    explanation (optional), sort order.
-   **QuizAttempt:** id, started/completed timestamps, score, total
    questions, optional topic filter.
-   **QuizResponse:** id, attempt relation, question relation, selected
    option relation (nullable if skipped), isCorrect.
-   **Bookmark:** id, question relation, created timestamp.
-   **TopicProgress:** id, topic relation, status or completion flag,
    last reviewed timestamp.

Use stable IDs and appropriate unique constraints. Avoid storing
duplicated computed data unless there is a clear reason. If a simpler
schema is sufficient for the MVP, prefer the simpler design and document
the trade-off.

## 7. Architecture and code organization

Use a clear, conventional structure similar to:

-   `src/app/` --- routes and page layouts
-   `src/components/` --- reusable UI components
-   `src/features/` --- feature-specific UI and logic (reviewer,
    quizzes, subnetting, troubleshooting)
-   `src/lib/` --- database client, shared utilities, validation
-   `src/server/` --- server-only data access and application services,
    if needed
-   `prisma/` --- schema, migrations, seed script
-   `tests/unit/` --- Vitest tests
-   `tests/e2e/` --- Playwright tests
-   `docs/` --- architecture decisions and content notes

Adapt to the current Next.js conventions and avoid creating empty
folders just to match this example. Keep database access out of
presentational components. Do not expose server-only database code to
the browser.

## 8. Development phases and acceptance criteria

### Phase 0 --- Inspect and plan

-   Inspect the existing repository before changing files.
-   If the repository is empty, scaffold the app.
-   Confirm Node/npm versions and package manager.
-   Create or update `README.md` and `AGENTS.md`.
-   Explain the planned folder structure and dependencies before large
    changes.
-   Do not overwrite existing work without inspecting it.

**Done when:** the plan and project instructions match the actual
repository setup.

### Phase 1 --- App foundation

-   Set up Next.js, TypeScript, Tailwind, ESLint, and base layout.
-   Establish a consistent visual system and navigation.
-   Add scripts for dev, lint, typecheck, unit tests, and Playwright.
-   Add a minimal Playwright smoke test.

**Done when:** app starts locally, homepage renders, lint/typecheck
pass, and the smoke test passes.

### Phase 2 --- Static reviewer prototype

-   Create topic navigation and study-note pages using a small amount of
    original sample content.
-   Add loading, empty, and error states where relevant.
-   Add responsive layout.

**Done when:** user can navigate topics and read notes; Playwright
verifies the main navigation.

### Phase 3 --- Database and seed content

-   Add SQLite and Prisma with migrations.
-   Add a seed script for a small set of original sample
    topics/questions.
-   Keep seed content clearly marked as sample content.
-   Add data-access functions and Zod validation where useful.

**Done when:** database can be initialized from documented commands,
seeded, and queried locally.

### Phase 4 --- Quiz engine

-   Add quiz setup, answering, submission, scoring, explanations, and
    result review.
-   Persist attempts and responses.
-   Add unit tests for scoring and answer evaluation.

**Done when:** user can finish a quiz and view the persisted result
after reloading.

### Phase 5 --- Bookmarks and progress

-   Add bookmark management, topic completion, recent attempts, and
    weak-topic summaries.

**Done when:** these features persist in SQLite and tests cover the main
workflows.

### Phase 6 --- Subnetting drills

-   Implement tested IPv4 calculation functions independently from the
    UI.
-   Add exercises and explanatory results.

**Done when:** unit tests cover normal cases and documented edge cases,
and Playwright covers one complete drill.

### Phase 7 --- Troubleshooting scenarios

-   Add authored scenarios and simulated CLI output.
-   Add reasoning-based feedback.

**Done when:** user can complete a scenario and understand the
diagnosis.

### Phase 8 --- Quality pass

-   Run lint, typecheck, unit tests, and Playwright.
-   Fix failures rather than skipping or weakening tests.
-   Check keyboard usability, responsive behavior, accessibility labels,
    and persistence.
-   Update README commands and known limitations.

**Done when:** all configured checks pass and setup instructions have
been verified.

Build incrementally. Do not attempt all phases in one large
code-generation step.

## 9. Testing policy

Use a test pyramid:

-   **Vitest:** subnetting math, score calculation, answer checking,
    validation, and other pure functions.
-   **Playwright:** critical browser journeys such as opening a topic,
    taking a quiz, submitting answers, bookmarking a question, and
    reloading to verify persistence.
-   **Manual checks:** visual design, keyboard navigation, content
    correctness, and responsive layout.

Playwright guidance: - Prefer role-based locators and accessible
names. - Avoid brittle CSS selectors and arbitrary sleeps. - Use
deterministic seeded test data. - Isolate tests from one another. - Do
not depend on a production deployment or external services. - Ensure the
local web server is started by Playwright configuration or document the
required server command. - Never claim tests passed unless the commands
were actually run and their results inspected.

Required checks before a feature is considered done: 1. Relevant Vitest
tests. 2. Relevant Playwright tests, where UI/workflow behavior changed.
3. TypeScript typecheck. 4. ESLint. 5. Review of the Git diff.

## 10. Working rules for Codex and OpenCode

Both agents must follow these rules:

1.  Read `README.md`, `AGENTS.md`, and relevant project docs before
    making changes.
2.  Inspect the repository and current Git status first.
3.  Work on one clearly scoped feature at a time.
4.  Make small, understandable changes; prefer clarity over clever
    abstractions.
5.  Do not edit the same files concurrently in separate agent sessions.
6.  Do not change the tech stack or introduce dependencies without
    explaining the reason.
7.  Do not delete files, reset Git history, overwrite user work, or run
    destructive database commands without explicit approval.
8.  Never put secrets or API keys in source control. No API key should
    be needed for the MVP.
9.  Keep SQLite data and local environment files out of Git where
    appropriate; commit Prisma schema and migrations.
10. Do not disable, delete, or weaken tests just to make a build pass.
11. Explain important changes in beginner-friendly language.
12. If a requirement is ambiguous, choose the simplest reversible option
    and state the assumption. Ask before consequential or destructive
    changes.
13. At the end of each task, report files changed, commands run, test
    outcomes, known issues, and the recommended next step.
14. Do not implement future phases early unless requested.
15. Treat this as a learning project: help the user understand the code,
    not just produce it.

## 11. Definition of done for any feature

A feature is complete only when: - Acceptance criteria are met. - UI and
business logic are separated appropriately. - Relevant validation and
error/empty states exist. - Tests cover important success and failure
cases. - Typecheck and lint pass. - Relevant tests have been run and
results accurately reported. - Documentation is updated when setup,
behavior, or architecture changes. - The user can explain the feature at
a high level.

## 12. First task for an AI coding agent

Start with Phase 0 and Phase 1 only.

1.  Inspect the repository and Git status.
2.  Read this plan and `README.md` if present.
3.  Report the current state and any existing work.
4.  Propose the smallest setup plan.
5.  Scaffold only what is necessary for a working local Next.js app with
    TypeScript, Tailwind, linting, Vitest, and Playwright.
6.  Add or update `AGENTS.md` with the working rules in this document.
7.  Add a simple homepage and one Playwright smoke test.
8.  Run the configured checks and report the actual results.
9.  Stop after Phase 1; do not build the quiz, database, or later
    features yet.

The user is a student learning full-stack development and networking.
Prefer clear explanations and incremental implementation over massive
code dumps.
