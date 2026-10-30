# Isobar — Decisions

**Isobar** is a portfolio project: a polished React weather dashboard aimed at front-end hiring managers. Last updated 2026-10-30. Wireframes live in the "Weather Dashboard Wireframes" design canvas; **Option C** is the desktop direction.

Naming: directory and repo `isobar`; the design system is "Isobar UI" in Storybook. Domain: try `isobar.dev`, then `isobar.app`, then `getisobar.dev`.

---

## 1. Purpose and principles

- Showcase for front-end roles: clean architecture, tasteful UI, a small design system used and partly built well, sensible full-stack patterns in a supporting role.
- Scope is deliberately small. Simpler is better; building a beautiful chart is not the exercise. Showing taste in design and web architecture is.
- Prefer choices an interviewer will recognise, unless there's a reason to show something newer.

## 2. Stack

**Front end**
- Vite + React SPA (TypeScript, strict).
- TanStack Router — active location lives in the URL (`/location/:id`).
- TanStack Query for all server state. Refresh button = `invalidateQueries` with stale-while-revalidate (old data stays on screen, spinner on the button).
- `SettingsContext` for units (°C/°F display) and theme — low-frequency, app-wide, read-mostly values; persisted to `localStorage`. No Zustand or other store.
- shadcn/ui on **Base UI** (the default since July 2026), Tailwind v4.
- Own token layer first (`tokens.css`), consumed by every shadcn component; components edited so they don't read as stock shadcn. Never hard-code a colour.
- Recharts through shadcn's chart wrapper so chart theming comes from the same tokens. Hand-rolled SVG only where Recharts is awkward (range bar, compass).
- TanStack Table for the hourly grid.
- Hand-written components where craft shows: `DashboardCard` shell (label / action / body / caption), `StatTile`, `RangeBar`, `WindCompass`.
- Lucide icons plus a small hand-drawn weather glyph set.
- Dates and times via `Intl.DateTimeFormat` with the location's IANA timezone from Open-Meteo. No date library unless formatting needs outgrow `Intl`.

**Back end**
- Hono on Node, in `server/`. Every route is under `/api` so the dashboard calls it same-origin: Vite proxies `/api` in development, and a single server can serve `dist` alongside the API if the app is ever deployed. Routes: `GET /api/geocode?q=`, `GET /api/locations/:id/forecast`, `GET /api/locations/:id/air-quality`, and `GET/POST/PATCH/DELETE /api/locations` for saved locations and their order.
- SQLite via Drizzle. Tables: `locations` (id, name, country, lat, lon, timezone, sort_order) and `forecast_cache` (location_id, kind, payload, fetched_at).
- Data source: Open-Meteo forecast, air-quality and geocoding endpoints.
- Everything stored and fetched in Celsius; °F is a client-side display conversion.
- Two snapshot kinds per location: `forecast` (current, hourly and daily from one provider call) with a 10 min TTL, and `air-quality` with a 60 min TTL. The header's "updated X min ago" is the forecast snapshot's `fetchedAt`. A `?refresh=1` flag bypasses the TTL but is itself rate-limited to one provider call per location per 60 s; within that window the cached snapshot is returned with its real `fetchedAt`.
- **Fixtures are test and tooling data, never served to real users.** One bundled location with a geocode result, a forecast snapshot and an air-quality snapshot. They feed Storybook stories and Vitest, and an explicit offline mode of the API (an environment flag) that answers geocode, forecast and air-quality from the fixtures. Playwright and CI run against that mode, so the smoke test never touches the network.
- **Provider failures fail hard.** If Open-Meteo is unreachable or returns an error, the API returns an error and the UI shows the error banner. Stale snapshots are never served past their TTL; there is no "showing cached data" state.
- Zod schemas at the API boundary; Hono's typed client so the front end infers response types.
- No SSE / WebSockets (considered, rejected as overkill for hourly-changing data).

**Repo and tooling**
- **One repo, one package, npm.** No workspaces, no pnpm, no Turborepo. The dashboard lives in `src/`, the design system in `src/ui/`, the API in `server/`. A clean clone is `npm install` then `npm run dev`, with nothing else to install; npm ships with Node. A monorepo was considered and rejected: three packages for one consumer is structure for its own sake.
- The design system is extracted from the dashboard's needs, not built ahead of it. If a second consumer ever appears, lift `src/ui` into its own package then — not before.
- Node 24 or later. The server runs its TypeScript directly under Node; no build step or runner in development.
- Biome for lint + format.
- Vitest + Testing Library for components; one Playwright smoke test (load, add a location, switch chart mode).
- Storybook for `src/ui` with the a11y addon (axe) and interaction tests; target WCAG 2.2 AA; axe checks in CI.
- GitHub Actions: lint, type-check, test, build on every push/PR; deploy Storybook on merge to `main`.
- **Repo is public from day one.** Commit history is part of the showcase; keep commits small and well-described.
- Dark mode from day one.
- A `CLAUDE.md` at the root points to this doc and names which of Daniel's own skills to use for implementation, tests and commits.

**Hosting**
- **Storybook deploys to GitHub Pages from CI.** That is the only hosted surface; it is static, free and shows the part a front-end reviewer cares about most.
- **The dashboard and API run locally.** The README is the front door: screenshots in both themes, the Storybook link, and a two-line run block. A clean clone must run first time. The SQLite file lives in a gitignored data directory and migrations run on `npm run dev`.
- **Single user.** Because the app is not shared, `locations` has no owner and there is no auth, cookie or per-visitor scoping.
- **A live dashboard is deferred, not rejected.** Nothing in the database needs to survive a redeploy (the cache refills itself and a demo location list may reset), so if a live link matters later the options are Railway Hobby (about $5/month, persistent volume, no stack change) or a free host with ephemeral SQLite and boot-time seeding. Decide at the end, once the local build is finished.

## 3. Visual direction

Quiet and editorial — a well-set financial dashboard, not a consumer weather app. Override this if it doesn't match your taste; it is a `tokens.css` change.

- **Typeface:** IBM Plex Sans, two weights (400, 600), `font-variant-numeric: tabular-nums` on every numeric element. One family only; no display face.
- **Neutrals:** a warm stone scale (not pure grey) for ground, borders and text. Light mode ground is off-white, not `#fff`; dark mode ground is warm near-black, not `#000`.
- **Accent:** one cool blue, used sparingly — active states, the selected location, the temperature line. Rain uses a lighter tint of the same blue; wind uses a neutral. No second hue.
- **Semantic colours:** air-quality bands and error states only; otherwise none.
- **Shape:** 6px radius on controls, 8px on cards. Hairline 1px borders; no drop shadows except on popovers.
- **Density:** tighter than shadcn defaults — 32px controls, 16px card padding, 12/14px type for labels and body, 28px for KPI values.
- **Motion:** 150ms ease on state changes only. No entrance animations.

## 4. Layout — Option C

- Left sidebar: logo, "add a location" search, saved-locations list (active highlighted, drag to reorder, hover to remove), theme toggle pinned at bottom.
- Page header: location name, country, local time, "updated X min ago"; °C/°F display toggle; Refresh.
- KPI row: four stat tiles — Temperature, Chance of rain, Wind, Air quality. **No sparklines** on tiles (the chart below tells that story).
- "Next 48 hours" chart with Temp / Rain / Wind mode pills: temp = line + hi/lo band + dashed "yesterday" reference + "now" marker; rain = bars; wind = line + gust band.
- "Conditions, next 7 days" donut — build it, then judge whether it earns its place; candidate to cut.
- Hourly detail table (sortable, sticky header).
- 7-day outlook strip.
- States: card skeletons, empty-locations onboarding, error banner for an unreachable backend or provider.
- **First run is the empty state.** A fresh clone starts with no saved locations; nothing is seeded. The reviewer adds a city via search and sees the full dashboard within seconds.
- **Empty state, defined:** the sidebar renders as normal with the search input autofocused and a single quiet line of helper text where the saved-locations list would be. The main area shows no header, cards or skeletons: one short centred block with a heading ("Add a location to get started"), one sentence beneath it, and one button that focuses the search input. No illustration, no glyph, no sample data. Saving the first location replaces it with the full dashboard.
- Mobile deferred until desktop is settled.

## 5. Component inventory (this is only a proposal for now)

Layout: `AppShell`, `Sidebar`, `PageHeader`.
Sidebar: `LocationSearch`, `SavedLocationList`, `SavedLocationItem`, `ThemeToggle`.
Header: `UnitToggle`, `RefreshButton`, `UpdatedAgo`.
Cards: `DashboardCard`, `StatTile`.
Charts: `ForecastChart` (modes: temp / rain / wind), `ConditionsDonut`, `RangeBar`, `WindCompass` (optional).
Tables: `HourlyTable`, `DayOutlookStrip`, `DayOutlookCard`.
States: `CardSkeleton`, `EmptyLocations`, `ErrorBanner`.
