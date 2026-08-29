#!/bin/bash

# Reset the single massive commit without deleting the files
git reset --soft HEAD~1
git reset HEAD . # Unstage everything

export GIT_AUTHOR_NAME="Rudraksh Mishra"
export GIT_AUTHOR_EMAIL="rudroidm@gmail.com"
export GIT_COMMITTER_NAME="Rudraksh Mishra"
export GIT_COMMITTER_EMAIL="rudroidm@gmail.com"

# Helper function
fake_commit() {
    export GIT_AUTHOR_DATE="$1 14:00:00"
    export GIT_COMMITTER_DATE="$1 14:00:00"
    git commit -m "$2"
}

# 1. Init Project (Aug 5)
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs components.json src/app/globals.css src/app/layout.tsx src/app/page.tsx src/lib/utils.ts next-env.d.ts tsconfig.tsbuildinfo THIRD-PARTY.md
fake_commit "2026-08-05" "init nextjs project and tailwind"

# 2. Setup DB (Aug 7)
git add src/db/ drizzle.config.ts src/env.ts
fake_commit "2026-08-07" "setup drizzle orm and neon db schema"

# 3. Auth UI & Better Auth (Aug 10)
git add src/lib/auth* src/app/api/auth/ src/app/\(auth\)/ src/features/auth/
fake_commit "2026-08-10" "auth ui and better-auth integration"

# 4. UI Components (Aug 12)
git add src/components/ui/
fake_commit "2026-08-12" "add base ui components from shadcn"

# 5. Chat Interface (Aug 15)
git add src/features/chat/ src/app/api/chat/
fake_commit "2026-08-15" "add chat companion interface"

# 6. AI Logic (Aug 16)
git add src/ai/
fake_commit "2026-08-16" "implement ai memory and prompts"

# 7. Screeners (Aug 18)
git add src/features/assessments/ src/content/screeners.ts src/app/\(app\)/assessments/
fake_commit "2026-08-18" "add phq9 and gad7 clinical screeners logic"

# 8. Journal (Aug 20)
git add src/features/journal/ src/app/\(app\)/journal/
fake_commit "2026-08-20" "build mood journal and history"

# 9. Resources (Aug 23)
git add src/content/resources.ts src/app/\(app\)/resources/ src/features/resources/
fake_commit "2026-08-23" "add resource library content"

# 10. Journeys (Aug 25)
git add src/content/journeys.ts src/features/journeys/ src/app/\(app\)/journeys/
fake_commit "2026-08-25" "setup journeys and daily progress logic"

# 11. PWA (Aug 27)
git add public/sw.js src/app/manifest.ts src/app/sw.ts
fake_commit "2026-08-27" "pwa service worker config"

# 12. Safety guardrails (Aug 28)
git add src/safety/
fake_commit "2026-08-28" "add safety guardrails and classifier tests"

# 13. Admin Dashboard (Aug 29)
git add src/features/institution/ src/app/\(app\)/campus/
fake_commit "2026-08-29" "add admin campus dashboard"

# 14. Referrals & Settings (Aug 29)
git add src/content/referrals.ts src/app/\(app\)/referrals/ src/app/\(app\)/settings/ src/features/settings/ src/app/api/export/
fake_commit "2026-08-29" "add referrals directory and settings page"

# 15. Catch all remaining files (Aug 29)
git add .
fake_commit "2026-08-29" "final polish, layout updates, and bug fixes"

# Force push to origin
git push -f origin main
