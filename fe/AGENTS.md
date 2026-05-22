# AGENTS.md

This repository is QuPilot — a quest platform with two roles: **Provider** (quest creator) and **User** (quest performer). Tech stack: Next.js (App Router), TypeScript.

The goal is not to maximize raw code output. The goal is to leave the repo in a state where the next session can continue without guessing.

## App Structure

```
app/
├── (auth)/
│   ├── login/page.tsx              # Provider login (User ID + Password)
│   └── layout.tsx                  # Centered auth layout
│
├── (provider)/
│   ├── dashboard/page.tsx          # Provider quest list (title + agent count)
│   ├── quests/new/page.tsx         # Create new quest (title, description, reward)
│   ├── quests/[questId]/page.tsx   # Provider quest detail (submit button)
│   └── layout.tsx                  # Provider layout (header: Dashboard, user menu)
│
├── (user)/
│   ├── explore/page.tsx            # User discovery feed (providers + quests)
│   ├── profile/page.tsx            # My Achievements + Quest list + Leaderboard button
│   ├── quests/[questId]/page.tsx  # User quest detail (copy quest ID, join button)
│   ├── leaderboard/page.tsx        # Ranked by reward + success rate
│   └── layout.tsx                  # User layout (header: My Profile, Leaderboard, wallet)
│
├── register-provider/page.tsx       # Register new provider
│
└── page.tsx                        # Landing page (unauthenticated) — list providers + quests
```

## Startup Workflow

Before writing code:

1. Confirm the working directory with `pwd`.
2. Review recent commits with `git log --oneline -5`.
3. Run `npm install` then `npm run dev`.
4. Verify dev server starts at `http://localhost:3000` before starting new work.

If baseline verification fails (build error, dev server not starting), fix that first. Do not stack new feature work on top of a broken starting state.

## Route Group Conventions

- `(auth)` — public routes, no auth required
- `(provider)` — routes for providers, requires provider auth
- `(user)` — routes for users, requires user auth

Each route group has its own `layout.tsx`:
- Provider layout: header with "Dashboard" link + user menu
- User layout: header with "My Profile", "Leaderboard", + wallet address display

## Working Rules

- Work on one feature at a time.
- Do not mark a feature complete just because code was added.
- Keep changes within the selected feature scope unless a blocker forces a narrow supporting fix.
- Do not silently change verification rules during implementation.
- Prefer durable repo artifacts over chat summaries.
- For UI components: tailwind classes must match project conventions, import from `@/lib/...` or `@/components/...`.
- Always read the docs before planning, you can use `context7` or other MCP tools
- Prioritise utilise components from @heroui instead of use HTML component, unless there's none that match.

## Code Conventions (Non-negotiable)
- **Naming**:
  - Components: `PascalCase`
  - Component file: `ComponentName.tsx`
  - Hook: `useCamelCase.ts`
  - Store slice: `camelCaseSlice.ts`
  - Type/interface: `IPascalCase` or `TPascalCase`
- **Export**: Prefer named exports over default exports.
- **CSS**: Tailwind utility classes, avoid `!important`. Use `cn()` from `@heroui/react`.

## API Services

One service folder per module (`src/service/quests/api.ts`, `src/service/auth/api.ts`, etc.). Each exports functions that call `apiClient`.

## TanStack Query Hooks

- Custom hooks per module: `useGetQuestsQuery`, `useGetQuestDetailQuery`, `useCreatePatientMutation`, etc.
- Query keys follow pattern: `['module', 'list', filters]` or `['module', 'detail', id]`
- `staleTime`: 5 min for master data, 30 sec for real-time (queue, booking)
- Mutations invalidate relevant queries on `onSuccess`
- Hooks located on `src/service/[module_name]/index.ts` e.g `src/service/quest/index.ts`

## Error Handling

- Mutations: show toast with `error.response?.data?.message` or generic fallback
- GETs: retry on network error or 5xx (max 2 retries); do not retry mutations

## Definition Of Done

A feature is done only when all of the following are true:

- the target behavior is implemented
- the required verification actually ran (build passes, dev server starts, manual test for the specific case)
- the repository remains restartable from the standard startup path (`npm run dev`)

## End Of Session

Before ending a session:

1. Commit with a descriptive message once the work is in a safe state.
2. Leave the repo clean enough for the next session to run `npm run dev` immediately.
