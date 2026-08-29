# 004 — Auth UI & Pseudonymous Sign Up

- **Status:** ready
- **Phase:** PH-01
- **Branch:** `feat/auth-ui`
- **Read before starting:** `docs/design-system.md`

## Outcome

Students can sign up or sign in pseudonymously. A non-clinical, warm editorial UI welcomes them, and Better Auth issues the session securely using a hidden `@max.local` dummy email domain to preserve privacy.

## Files

| File | Action |
| --- | --- |
| `components.json` | create via `shadcn init` |
| `src/ui/*` | create via `shadcn add` |
| `src/lib/auth-client.ts` | create |
| `src/features/auth/schemas.ts` | create |
| `src/features/auth/components/sign-in-form.tsx` | create |
| `src/features/auth/components/sign-up-form.tsx` | create |
| `src/app/(auth)/layout.tsx` | create |
| `src/app/(auth)/sign-in/page.tsx` | create |
| `src/app/(auth)/sign-up/page.tsx` | create |

## Contract

```ts
import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/, "Alphanumeric and underscores only"),
  password: z.string().min(8),
});

export const SignInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
```

## Steps

1. **Initialize shadcn/ui**: Run `npx shadcn@latest init -y` and `npx shadcn@latest add button input label card form -y`.
2. **Auth Client**: Create `src/lib/auth-client.ts` using `createAuthClient` from `better-auth/react`.
3. **Schemas**: Implement the Zod contract in `src/features/auth/schemas.ts`.
4. **Forms**: Create sign-up and sign-in forms using React Hook Form + Zod resolver + shadcn components. In the submission handlers, suffix the `username` with `@max.local` and use it as the `email` for Better Auth's `signUp.email` and `signIn.email`.
5. **Layout & Routes**: Create `src/app/(auth)/layout.tsx` with a warm, non-clinical design (no generic SaaS styling). Map `/sign-in` and `/sign-up` to their respective forms.

## Acceptance

- [ ] `shadcn/ui` is installed in `src/ui/`.
- [ ] Sign Up and Sign In pages render correctly.
- [ ] Users can authenticate via Better Auth (using the `@max.local` email trick).
- [ ] UI relies only on `@theme` tokens defined in `globals.css` without arbitrary hex values.
- [ ] `npm run check` passes with exit code 0.

## Verify

```bash
npm run check
```

## Do not touch

- Existing DB schema (`src/db/*`)
- `src/safety/*`
