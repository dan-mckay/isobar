# PRD: Isobar weather dashboard

Status: draft, 2026-10-30. Source of truth for stack, layout and visual direction is `decisions.md`; this document describes the product and the implementation shape derived from it. Filed as https://github.com/dan-mckay/isobar/issues/1.

## Problem Statement

A front-end hiring manager reviewing a candidate has a few minutes and a lot of repositories. Most portfolio projects are either feature-heavy and sloppy or so small that nothing about the candidate's judgement shows through. What a reviewer actually wants to see is taste: a small product built with restraint, a design system that is used rather than merely present, accessible and polished in both themes, with sensible full-stack patterns in a supporting role and a commit history that reads like someone who works carefully.

Daniel needs a project that demonstrates exactly that, can be understood from the README in two minutes, can be clicked through in Storybook without installing anything, and runs flawlessly from a clean clone for anyone who wants to go deeper.

## Solution

Isobar is a quiet, editorial weather dashboard. The user saves a handful of locations, picks one, and sees current conditions, a 48-hour chart that can be switched between temperature, rain and wind, an hourly detail table and a seven-day outlook. Units and theme are the only settings. Everything else is deliberately absent.

The product ships as a single npm package: a small design system in Storybook (the hosted, clickable surface), a Vite and React dashboard, and a Hono API over SQLite that fronts Open-Meteo with a short-lived cache. The dashboard and API run locally; Storybook deploys to GitHub Pages from CI. A live deployment of the dashboard is deferred to the end and may never be needed.

## User Stories

### Reviewing the project

1. As a hiring manager, I want the README to show the dashboard in light and dark mode and link to Storybook, so that I can judge the work without installing anything.
2. As a hiring manager, I want to open Storybook and click through every component in both themes, so that I can see the design system rather than read about it.
3. As a hiring manager, I want each Storybook story to pass the accessibility panel, so that I can see accessibility was treated as part of done.
4. As a hiring manager, I want the commit history to be small, well-described commits, so that I can see how the candidate works and not just what they produced.
5. As a hiring manager who wants to go deeper, I want to clone the repo and run one command, so that the full app is on screen without configuration, API keys or a database to set up.
6. As a hiring manager, I want a short decisions document, so that I can see the reasoning behind the stack and the scope.

### First run and locations

7. As a user opening the app for the first time, I want a clear empty state that tells me to add a location, so that I know what to do without a tutorial.
8. As a user in the empty state, I want the search input already focused and a visible button that focuses it, so that I can start typing or click, whichever I notice first.
9. As a user, I want to type a city name and see matching places with their country, so that I can pick the right one when names collide.
10. As a user, I want choosing a search result to add it to my saved locations and show its dashboard immediately, so that adding a location is one gesture.
11. As a user, I want my saved locations listed in the sidebar with the active one highlighted, so that I can see where I am and switch quickly.
12. As a user, I want each saved location to show a glanceable current temperature and condition glyph, so that I can compare locations without opening each.
13. As a user, I want to remove a location by hovering and clicking a remove control, so that mistakes are cheap to fix.
14. As a keyboard user, I want the remove control reachable and operable without a mouse, so that hover is not the only way in.
15. As a user, I want to drag saved locations into my preferred order and have that order persist, so that my most-used location is at the top.
16. As a keyboard or screen-reader user, I want to reorder locations without dragging, so that reordering is not a pointer-only feature.
17. As a user, I want my saved locations and their order to survive restarting the app, so that I set them up once.
18. As a user, I want the active location to be part of the URL, so that refreshing, going back and bookmarking all behave as I expect.
19. As a user visiting a URL for a location that no longer exists, I want a clear message and a way back, so that a stale bookmark does not look like a crash.

### Page header

20. As a user, I want the header to show the location name, country, local time and how long ago the data was fetched, so that I can trust what I am looking at.
21. As a user, I want local time shown in the location's own timezone, so that a location on the other side of the world reads correctly.
22. As a user, I want a Refresh button that fetches fresh data while the old data stays on screen, so that refreshing never flashes to empty.
23. As a user, I want the Refresh button to show it is working, so that I know my click registered.
24. As a user who refreshes repeatedly, I want the app to stay calm and simply show the latest data it has, so that hammering the button cannot break anything.

### Units and theme

25. As a user, I want a °C/°F toggle in the header, so that I can read temperatures in the scale I think in.
26. As a user, I want my unit choice to persist across sessions, so that I set it once.
27. As a user, I want a theme toggle in the sidebar, so that I can switch between light and dark.
28. As a user, I want the app to look finished in both themes, so that dark mode is not an afterthought.
29. As a user, I want my theme choice to persist across sessions, so that I set it once.

### KPI tiles

30. As a user, I want a Temperature tile with the current temperature and a feels-like figure, so that I get the headline at a glance.
31. As a user, I want a Chance of rain tile with a percentage and the expected amount, so that I can decide whether to carry an umbrella.
32. As a user, I want a Wind tile with speed, gust and direction, so that I can see how blustery it is.
33. As a user, I want an Air quality tile with the index value and a band shown on a range bar, so that I can read it without knowing the scale.
34. As a user, I want every number on every tile set in tabular numerals, so that values line up and do not jitter when they change.

### 48-hour chart

35. As a user, I want a chart of the next 48 hours with Temp, Rain and Wind mode pills, so that I can see the shape of the coming two days.
36. As a user in Temp mode, I want the forecast line with a hi/lo band, a dashed yesterday reference and a "now" marker, so that I can see both the trend and how it compares to yesterday.
37. As a user in Rain mode, I want hourly bars, so that I can see when it will rain and how hard.
38. As a user in Wind mode, I want a wind line with a gust band, so that I can see both steady and peak wind.
39. As a user, I want the chart to use the same colours and type as the rest of the app, so that it reads as part of one system.
40. As a user, I want to hover or focus a point and read the exact values, so that the chart is not decoration.
41. As a screen-reader user, I want a text alternative for the chart's key points, so that the chart is not a silent image.

### Conditions donut

42. As a user, I want a donut showing the share of forecast hours by condition over the next seven days, so that I get a feel for the week in one glance.
43. As the author, I want to build the donut and then judge whether it earns its place, so that it is kept only if it adds something the chart does not.

### Hourly detail table

44. As a user, I want an hourly table with time, condition, temperature, rain, wind and humidity, so that I can look up a specific hour.
45. As a user, I want to sort the table by any numeric column, so that I can find the warmest or windiest hour.
46. As a user, I want the table header to stay visible while scrolling, so that I never lose track of which column is which.
47. As a keyboard user, I want sortable headers to be real buttons with announced sort state, so that sorting is operable and understandable without a mouse.

### Seven-day outlook

48. As a user, I want a strip of seven day cards with day name, condition glyph, high and low, so that I can plan the week.
49. As a user, I want the high and low shown on a small range bar, so that I can compare days visually.

### Loading, error and offline

50. As a user, I want skeleton placeholders in each card while data loads, so that the layout does not jump.
51. As a user, I want a clear error banner if the local API is not running or the weather provider is unreachable, so that I know what is wrong and that it is not my fault.
52. As a user, I want the app to never show data for a different place than the one named in the header, so that an error is always preferable to a plausible lie.

### Development and quality

53. As the author, I want every colour, size, radius and shadow to come from one token file, so that the visual system is coherent and themes are a token change.
54. As the author, I want the shadcn components restyled to the tokens, so that the app does not read as stock shadcn.
55. As the author, I want each component to have stories covering default and edge cases and tests covering behaviour, so that the design system is demonstrably used and maintained.
56. As the author, I want lint, typecheck, tests and build to run on every push, so that the public history never contains a broken main.
57. As the author, I want Storybook to deploy on merge to main, so that the hosted surface is always current.
58. As the author, I want a single Playwright smoke test that runs against a fixture-backed API, so that CI never depends on the network.
59. As the author, I want the API to validate everything it returns with Zod and the dashboard to infer those types, so that no response type is hand-written on the front end.
60. As the author, I want all stored and transported temperatures in Celsius with conversion at render time, so that there is one source of truth for every value.

## Implementation Decisions

### Repository and tooling

- One repository, `isobar`, one npm package, no workspaces. The dashboard, the design system folder inside it, and the server folder share one `package.json`. npm ships with Node, so a clean clone needs nothing installed beyond Node 24. A monorepo was considered and rejected as structure for its own sake with a single consumer.
- Biome for lint and format. Vitest and Testing Library for unit and component tests. Storybook with the a11y addon and interaction tests. One Playwright smoke test. GitHub Actions runs lint, typecheck, test and build on every push and pull request, and deploys Storybook to GitHub Pages on merge to main.
- Strict TypeScript everywhere.
- Work proceeds one slice at a time from the tickets derived from this PRD. A slice is done when lint, typecheck, tests and build pass, and leaves no TODOs, dead code or commented-out blocks.

### Hosting

- Storybook on GitHub Pages is the only hosted surface. The dashboard and API run locally. The README is the front door: screenshots in both themes, the Storybook link, a two-line run block.
- A clean clone must run first time with no configuration. Open-Meteo needs no key. The SQLite file lives in a gitignored data directory and migrations run as part of starting the dev server.
- Single user: locations have no owner, there is no auth, cookie or per-visitor scoping.
- A live dashboard is deferred, not rejected. Nothing in the database must survive a redeploy, so if a live link is wanted later the options are Railway Hobby with a volume, or a free host with ephemeral SQLite and boot-time seeding. Decide at the end.

### Design system

- A token layer defines every colour, font, size, radius and shadow with light and dark values. Tailwind v4 reads the tokens; no arbitrary values in components.
- shadcn components on Base UI primitives, copied into the package and restyled to the tokens; unused variants deleted. The `render` prop pattern, not `asChild`.
- Hand-written where craft shows: the dashboard card shell with label, action, body and caption slots; the stat tile; the range bar; the wind compass.
- Charts go through the shadcn chart wrapper so Recharts inherits the tokens. Hand-rolled SVG only for the range bar and the compass.
- Visual direction per `decisions.md`: IBM Plex Sans in two weights, tabular numerals on every numeric value, warm stone neutrals, one cool blue accent, semantic colour only for air-quality bands and errors, 6px and 8px radii, hairline borders, 150ms transitions on state changes only.
- Every component takes data as props and knows nothing about the query layer, the router or the API.
- Every component ships with stories (default plus empty, loading, error and long-text where applicable) and behavioural tests. Every story passes axe.
- Accessibility baseline: real buttons and links, labelled inputs, labels on icon-only controls, visible focus, keyboard operability throughout, WCAG 2.2 AA.

### API

- Hono on Node. Routes: geocode by query; forecast and air quality by saved location; list, create, reorder and delete saved locations.
- SQLite via Drizzle with two tables: locations (id, name, country, latitude, longitude, timezone, sort order) and a snapshot cache (location, kind, payload, fetched-at).
- **Provider module.** One interface with two implementations: live Open-Meteo, and a fixture-backed offline mode selected by an environment flag. The provider validates upstream JSON with Zod and normalises it into Isobar's own forecast and air-quality shapes. Everything is Celsius, km/h and millimetres. Nothing downstream knows Open-Meteo's field names.
- **Snapshot cache module.** Given a location, a kind, a TTL and a fetcher, returns a snapshot. Two kinds per location: forecast (current, hourly and daily from one provider call) with a ten-minute TTL, and air quality with a sixty-minute TTL. A refresh flag bypasses the TTL but is rate-limited to one provider call per location per sixty seconds; inside that window the cached snapshot is returned with its real fetched-at time. The header's "updated" time is the forecast snapshot's fetched-at.
- **Provider failures fail hard.** If the provider is unreachable or returns an error, the API returns an error and the dashboard shows the error banner. Stale snapshots are never served past their TTL. There is no "showing cached data" state.
- **Fixtures are tooling data, never served to real users.** One bundled location with a geocode result, a forecast snapshot and an air-quality snapshot. They feed stories, unit tests and the offline mode that Playwright and CI run against.
- Every response is validated with Zod at the boundary and the route types are exported so the dashboard's client infers them.

### Dashboard

- Vite and React single-page app. TanStack Router with the active location in the URL. TanStack Query for all server state, with query keys defined once and reused. Refresh invalidates queries; old data stays on screen with a spinner on the button.
- A settings context holds units and theme, persisted to localStorage. Nothing else is global.
- **Display formatting module.** Pure functions from Celsius, km/h and millimetres to display strings in the chosen unit system, and from instants to local time strings via Intl with the location's IANA timezone. No date library unless Intl proves insufficient.
- **Forecast derivations module.** Pure functions from a normalised forecast to what the components render: the 48-hour series for each chart mode, the now marker, the yesterday reference series, KPI values, the air-quality band, and the weather-code to condition bucket for the donut. The behavioural questions still open (below) are each answered by one function here, with a test.
- Pages compose the query hooks, the derivation and formatting modules, and the design-system components. No data fetching inside components.

### Layout

- Option C per the wireframe: left sidebar with logo, search, saved-locations list and theme toggle pinned at the bottom; page header; four KPI tiles; 48-hour chart beside the conditions donut; hourly table; seven-day strip.
- First run is the empty state: sidebar as normal with the search autofocused and a quiet helper line where the list would be; main area shows one centred block with a heading, one sentence and one button that focuses the search. No illustration, no sample data.
- Mobile is deferred until desktop is settled.

## Testing Decisions

A good test exercises behaviour through the module's public interface and would survive a rewrite of the internals. Component tests render the component, interact as a user would, and assert on what the user can see or hear. No snapshot tests. No tests of implementation details such as internal state or private helpers.

Modules tested directly:

- **Provider.** Fixture-driven contract tests: given recorded upstream JSON, the normalised output has the expected shape and values, and malformed upstream JSON is rejected at the boundary. The offline implementation returns the fixtures.
- **Snapshot cache.** Fake-clock tests covering a cold fetch, a warm hit inside TTL, expiry, the refresh flag, the sixty-second refresh rate limit, and a failing fetcher propagating as an error with nothing stale served.
- **Display formatting.** Table-driven tests for each unit conversion and for time formatting across timezones, including a location across the date line and a half-hour offset.
- **Forecast derivations.** Table-driven tests over fixture forecasts for each series, the now marker position, the yesterday series, KPI values, air-quality bands at band boundaries, and the condition bucket mapping.
- **Every design-system component.** Behavioural tests per the component rules, plus Storybook interaction tests and axe on every story.
- **Playwright smoke test.** Against the API in offline mode: load, add a location, switch chart mode.

Covered indirectly, not tested directly: route handlers and the locations repository, which the smoke test exercises end to end.

There is no prior art in the repository; these tests establish the patterns.

## Out of Scope

- Mobile layout. Deferred until desktop is settled.
- Authentication, multi-user or per-visitor saved locations.
- A hosted dashboard. Decide at the end.
- Real-time updates via SSE or WebSockets.
- Serving stale data when the provider fails.
- Sparklines on KPI tiles.
- Any second accent hue, display typeface or entrance animation.
- A date library, a global store, workspaces or a monorepo.
- Historical or climatological data beyond the yesterday reference line.

## Further Notes

The following behavioural details are intentionally unsettled here and should each be decided in the ticket that implements them, with the decision recorded as a test:

- What the temperature hi/lo band is computed from, given that a single deterministic forecast has no per-hour range.
- How the yesterday reference is aligned on a 48-hour axis, and whether it stops at the 24-hour mark.
- The window and aggregation behind the Chance of rain tile's percentage and expected amount.
- Which air-quality index (European or US) the tile uses and its band boundaries.
- Whether the unit toggle switches temperature only or a whole unit system (wind, precipitation).
- Whether theme is a two-state toggle or follows the system by default.
- The mapping from WMO weather codes to the donut's condition buckets, and whether the donut survives.
- Location identity and de-duplication when the same place is added twice.
- Row count for the hourly table and whether virtualisation is needed.
- The drag-and-drop library, subject to the ask-before-adding-a-dependency rule.

The donut is a candidate to cut. Build it, then judge.
