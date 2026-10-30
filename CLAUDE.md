# Isobar

A React weather dashboard built as a portfolio piece for front-end roles. The point is taste and architecture, not feature count. Read `docs/decisions.md` before doing anything; it is the source of truth for stack, layout, visual direction and scope. If a request conflicts with it, say so and ask before proceeding.

## Layout

```
src/           the dashboard: Vite + React SPA
src/ui/        design system: tokens, components, stories
server/        Hono + Drizzle + SQLite, run directly by Node
docs/          decisions.md and any write-ups
```

One package, no workspaces. npm scripts from the root: `npm run dev`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run storybook`.

## Working rules

- **Work one slice at a time.** The build order comes from the spec and tickets, not from this file or `docs/decisions.md`. Finish the slice, make sure lint, typecheck, tests and build pass, then stop and summarise. Do not start the next slice unprompted.
- **Ask before adding a dependency.** Say what it is, what it replaces, and the bundle cost.
- **Small commits with clear messages.** The repo is public and the history is part of the showcase. One logical change per commit. Conventional Commits. One branch per issue named `<issue>-<slug>`, one PR per issue, squash-merged so `main` reads as one commit per issue.
- **No TODOs, no dead code, no commented-out blocks** left in a finished slice.
- **No placeholder copy.** If real content is unknown, use a clearly marked fixture, not lorem ipsum.

## Design rules

- **Tokens only.** Every colour, font, size, radius and shadow comes from `src/ui/tokens.css`. No hard-coded values in components, no arbitrary Tailwind values like `text-[13px]` or `bg-[#…]`. If a token is missing, add it to `tokens.css` with a light and dark value, then use it.
- **shadcn components are ours to edit.** They live in `src/ui/components`. Restyle them to the tokens; delete variants we don't use. They should not read as stock shadcn.
- **Base UI primitives, not Radix.** `render` prop, not `asChild`.
- **Charts through the shadcn chart wrapper** so Recharts inherits the tokens. Hand-rolled SVG only for `RangeBar` and `WindCompass`.
- **Tabular numerals** on every numeric value.
- **Dark mode is not optional.** Every component must look right in both themes before it is done.
- **Accessibility is part of done.** Real `<button>` and `<a>`, labelled inputs, `aria-label` on icon-only controls, visible focus, keyboard-operable everything. Every story passes the axe panel.

## Component rules

- Every component in `src/ui` has: the component file, a `*.stories.tsx` with at least default and edge-case stories (empty, loading, error, long text), and a `*.test.tsx` covering behaviour (not snapshots).
- Components take data as props and know nothing about TanStack Query, the router or the API. Data wiring lives outside `src/ui`.
- Prefer composition (`DashboardCard` with slots) over configuration (a dozen boolean props).
- Name files after the component: `StatTile.tsx`, `StatTile.stories.tsx`, `StatTile.test.tsx`, exported from `src/ui/index.ts`.

## Data rules

- Server state lives in TanStack Query. Query keys are defined once in `src/queries/` and reused.
- The active location lives in the URL. Units and theme live in `SettingsContext`. Nothing else is global.
- All API responses are validated with Zod in `server/` and typed through Hono's client in `src/`. Never hand-write a response type on the front end.
- Everything is Celsius until the moment it is rendered. Conversion is a display concern.

## Skills

Use these for the matching work instead of improvising:

- `/implement` — when picking up a ticket or a slice of the spec
- `/tdd` — when writing tests
- `/git-workflow` — when branching, committing or opening a PR

## When unsure

Check `docs/decisions.md`. If it doesn't answer the question, ask — a short question costs less than an unwanted abstraction.
