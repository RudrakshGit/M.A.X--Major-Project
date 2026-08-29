# 014 — Real migrations, and make env validation actually run

- **Status:** ready
- **Phase:** PH-01
- **Branch:** `fix/db-env-hygiene`
- **Read before starting:** `docs/architecture.md`

## Outcome

Deploys apply reviewed migrations instead of force-pushing schema, and a missing
environment variable fails the build loudly instead of at request time.

## The three problems

1. `package.json` build runs `drizzle-kit push --force` on every deploy. That
   pushes whatever the schema file says straight at the production database,
   with no review and no migration history. A wrong edit silently drops a column.
2. `src/db/migrations/` and `migrate.ts` are untracked — the migration history
   is not in git at all.
3. `src/env.ts` is never imported, so the Zod validation in it never runs. It is
   dead code today.

## Files

| File | Action |
| --- | --- |
| `src/db/migrations/**` | commit to git |
| `migrate.ts` | commit, or delete if `drizzle-kit migrate` replaces it |
| `package.json` | build becomes `next build`; add a separate `db:migrate` script |
| `src/db/index.ts` | import `@/env` so validation runs at boot |
| `.env.example` | keep in sync with `src/env.ts` |

## Steps

1. Generate a migration for the current schema state, review the SQL, commit it.
2. Change `build` to just `next build --webpack`. Add `"db:migrate":
   "drizzle-kit migrate"` and run it as a deliberate step before deploying a
   schema change, not automatically during build.
3. Import `env` in `src/db/index.ts` so a missing variable throws at startup.
4. Confirm `.env.example` lists exactly the keys `src/env.ts` validates.

## Acceptance

- [ ] `git status --short` shows no untracked files under `src/db/`
- [ ] `package.json` build script contains no `drizzle-kit push`
- [ ] Removing a required variable from `.env.local` makes `npm run build` fail with a clear Zod error
- [ ] `npm run check` exits 0

## Verify

```bash
npm run check
```

## Do not touch

`src/db/schema.ts` table definitions — the `account` table was fixed for Better
Auth 1.7 and must keep its `issuer` column and both indexes.

## Notes

The Neon free tier has no automatic backups. Before running a destructive
migration, take a manual dump.
