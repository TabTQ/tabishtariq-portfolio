# Portfolio — Interactive System Map

A modern portfolio webapp for **Tabish Tariq** (Data Engineer). The interface is
diagram-first: a central system map branches into clickable nodes, each routing to
a detail page that can hold deeper sub-diagrams. Styled as a dark-mode "trading
dashboard" (warm espresso palette, terracotta / sage / gold accents, serif display).

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (theme tokens in `src/app/globals.css` via `@theme inline`)
- **React Flow** (`@xyflow/react`) + **dagre** for auto-laid-out interactive diagrams
- **lucide-react** icons, **Inter** / **Fraunces** / **JetBrains Mono** fonts

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (type-check + prerender all routes)
npm run start    # serve the production build
```

## Project structure

```
src/
├─ app/                 # routes (dashboard, about, experience, projects, homelab, skills, research, contact)
├─ components/
│  ├─ layout/           # AppShell, Sidebar, TopBar, Footer (the dashboard chrome)
│  ├─ diagram/          # SystemMap (React Flow wrapper), custom nodes, DiagramPanel
│  └─ ui/               # Card, StatCard, MetricBar, Chip, Icon, BrandIcons, PageHeader
├─ data/                # ← single source of truth for ALL content
│  ├─ profile / experience / projects / homelab / skills / research
│  └─ diagrams.ts       # node/edge specs for every interactive map
└─ lib/cn.ts
```

## Editing content

All copy lives in `src/data/*.ts` — edit those typed modules, no component changes
needed. To add or rewire a diagram, edit the relevant spec in `src/data/diagrams.ts`
(each routed node has a `route`; `#anchor` routes scroll to an in-page element, other
routes navigate). The theme palette lives in the `:root` block of
`src/app/globals.css`.
