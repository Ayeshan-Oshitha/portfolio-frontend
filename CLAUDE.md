# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b (typecheck, project references) then vite build
npm run lint      # eslint .
npm run preview   # serve the production build
```

There is no test setup in this repo. `npm run build` is the only typecheck — run it after non-trivial changes.

`node refactor-imports.js` is a one-off codemod that rewrites every relative import under `src/` to the `@/` alias. It edits files in place; only run it when asked.

## Architecture

Vite + React 19 + TypeScript + Tailwind CSS v4, no backend. All content is static and lives in TypeScript modules — there is no CMS, no data fetching, and no global state library.

**Content/presentation split.** This is the central convention. `src/portfolio/data/*.ts` exports frozen, `readonly`-typed constants (`HERO_DATA`, `ALL_PROJECTS`, `TECHNOLOGY_CATEGORIES`, …); components in `src/portfolio/components/**` import those constants directly rather than receiving them as props. Every content shape is declared as an interface in `src/portfolio/types.ts`. To change copy, edit the data file. To add a content type, add the interface to `types.ts` first, then a data module, then components.

**Routing.** `src/main.tsx` mounts `RouterProvider` with the router in `src/routes/routes.tsx`. All routes are children of `PortfolioLayout` (`Header` / `<Outlet/>` / `Footer`). `src/App.tsx` is vestigial — it renders `Home` but is not in the route tree; do not add anything to it.

**Component directory naming.** Two parallel groups under `src/portfolio/components/`:

- Singular names (`hero/`, `services/`, `about/`, `projects/`, `pricing/`, `technologies/`) are the sections composed by `pages/Home.tsx`.
- `-page` suffixed names (`about-page/`, `services-page/`, `work-page/`, `blog-page/`) belong to the corresponding standalone route page.

So `components/about/` and `components/about-page/` are different things and both are current. `components/ui/` holds the shared primitives (`Button`, `Badge`, `SectionHeader`).

Pages own interactive state (e.g. `WorkPage` holds search/filter/sort state and passes it down to `WorkFilters`/`WorkGrid`); section components below them are otherwise presentational.

**Icons come from two sources with different types.** Lucide/react-icons *components* (typed `LucideIcon | IconType` in data files) for services, values, social links; and SVG *files* imported as URL strings via the barrel `src/portfolio/assets/icons/index.ts` for the technology grid (`Technology.icon` is a `string` rendered into `<img src>`). New tech icons go in the matching `assets/icons/<category>/` folder and must be re-exported from that barrel.

**Styling.** Tailwind v4 via `@tailwindcss/vite` — no `tailwind.config.js`. The design system is defined as `@theme` tokens in `src/index.css` (oklch `primary-*`, `accent-*`, `surface-*`, `text-*`, `border-*` scales plus `animate-fade-in-up` etc.), so use `bg-surface-900`, `text-text-secondary`, `border-border-subtle` and friends rather than raw palette colors. The site is dark-only; `body` is pinned to `surface-950`. Variant/size class maps are `Record<>` constants at the top of the component file (see `ui/Button.tsx`) — follow that pattern instead of inline conditionals.

**Imports.** Use the `@/` alias for `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`). Some older files still use relative paths; prefer `@/` in new code.
