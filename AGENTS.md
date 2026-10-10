# NETEST contributor instructions

NETEST is a local-first learning project for CCNA study and network troubleshooting. Read `README.md` and `NETEST_PROJECT_PLAN.md` before significant changes.

## Working rules

- Inspect the current files and Git status before editing. Preserve existing work.
- Work in the phase and feature scope requested. Do not implement later phases early.
- Keep the project in one Next.js app unless a concrete requirement justifies a change.
- Use TypeScript, clear names, and small understandable modules. Separate feature logic from presentation as features grow.
- Do not add deployment, cloud services, paid APIs, AI APIs, authentication, Docker, or unrelated frameworks without explicit approval.
- Keep local database files and environment secrets out of version control. Never add secrets or API keys.
- Do not delete files, reset history, overwrite user work, or run destructive database commands without approval.
- Use original study material, explain answers, and label simulated network-device output.
- Do not weaken or remove tests to make a check pass. Only report commands actually run and results actually observed.
- Explain important decisions in beginner-friendly language and update setup documentation when it changes.
- At the end of work, report changed files, checks and outcomes, known limitations, and a recommended next step.

## Project commands

- `npm run dev` starts the local app.
- `npm run lint` checks ESLint rules.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs Vitest once.
- `npm run test:e2e` runs Playwright; its config starts the local dev server.
- `npm run db:setup` applies SQLite migrations, generates Prisma Client, and seeds sample data.
- `npm run db:check` queries the local database and checks sample answer-option integrity.
- `npm test` includes unit coverage for quiz scoring.
- Playwright covers the quiz flow and verifies a submitted result survives a page reload.

SQLite data stays local in `prisma/dev.db`, which is ignored by Git. Never commit a local database file.
