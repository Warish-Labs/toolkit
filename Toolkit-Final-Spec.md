# 🧰 Toolkit — Final Project Specification

> **Product name:** **Toolkit**
> **Brand lockup:** `Toolkit` (large) — `by WarishLabs` (small, subtle — same pattern as "Docs by Google")
> **Domain:** `tools.warishlabs.in`
> **Launch scope:** Basic Utilities + Calculators + Developer Tools (Phase 1), architected for 500+ tools long-term

This is the final, decision-locked spec. Every "Option A / Option B" from the draft has been resolved below — no more open choices, just build.

---

## 1. 🎯 Positioning

Toolkit is a fast, private, browser-first utility platform. WarishLabs is the studio behind it — visible in the footer, About page, and a small subtitle under the logo — but it never competes with the product name for attention. Think **"Docs by Google," "Raycast by Raycast Inc.," "Linear"** — the product is the brand people remember; the company is the credibility layer underneath.

**Logo lockup:**
```
🧰 Toolkit
   by WarishLabs
```

---

## 2. 🧱 Tech Stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Server Components default) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide React |
| Animation | Framer Motion (micro-interactions only) |
| Theme | next-themes (Light / Dark / System) |
| Search | Fuse.js (fuzzy, client-side) |
| Validation | Zod |
| Testing | Vitest + RTL + Playwright |
| Quality | ESLint + Prettier + Husky + lint-staged |
| Hosting | Vercel |
| Analytics | Vercel Analytics + GA4 |

**Execution model:** every tool runs 100% client-side in Phase 1. No backend, no DB, no auth. This keeps it free to host, instant to use, and privacy-first ("your data never leaves your browser"). Server-powered tools (e.g. AI-based ones) come later, plugged into the same registry pattern — no rewrite needed.

---

## 3. 🎨 UI / UX Direction (locked)

**Reference bar:** Vercel, Linear, Raycast, Stripe — not Canva-template, not glassmorphism-heavy, not gradient-soup.

**Non-negotiables:**
- Light / Dark / System theme toggle, persisted (localStorage or cookie via next-themes), instant switch with no flash-of-wrong-theme (use `suppressHydrationWarning` + theme script in `<head>`)
- Generous whitespace, max-width content containers, 8pt spacing scale
- One accent color, used sparingly (buttons, active states, focus rings) — not everywhere
- Typography: one variable font (e.g. Inter or Geist), tight heading tracking, comfortable body line-height (1.6–1.7)
- Rounded-lg cards, 1px hairline borders instead of heavy shadows, shadow only on hover/elevation
- Every interactive element has a visible focus state (accessibility, not optional)

**Motion (Framer Motion, kept subtle):**
- Hero: fade+slight-rise on load
- Cards: gentle lift on hover (translateY -2px, shadow increase), no scale-bounce
- Command palette (⌘K): scale+fade in/out
- Theme toggle: icon morph (sun↔moon), not a jarring instant swap
- Page transitions: none or very minimal fade — never block perceived speed
- Respect `prefers-reduced-motion`

---

## 4. 🗂️ Information Architecture (locked)

```
/                     → Homepage
/tools                → All tools (search + filter + sort) — the primary hub
/tools/[slug]         → Individual tool page
/categories           → All categories grid
/categories/[slug]    → Category landing page
/about
/contact              → links to warishlabs.in contact, no separate form
/privacy-policy
/terms
/disclaimer
/sitemap.xml
/robots.txt
```

**Navigation decision:** dedicated `/tools` and `/categories` pages (not a mega-dropdown). A mega-dropdown breaks down past ~30 tools; a searchable, filterable `/tools` page scales to 500+ without redesign. Header nav stays minimal:

```
Toolkit          Tools   Categories   About        [🔍 Search]  [☀️/🌙]
```

---

## 5. 🧩 Folder Structure (locked)

```
src/
  app/            → routing only, near-zero logic in page.tsx
  data/           → tools.ts, categories.ts, nav.ts, faq.ts — pure data, no JSX
  registry/       → maps tool slug → logic module → React component
  logic/          → pure TS functions per tool (json.ts, emi.ts, age.ts, uuid.ts...)
  ui/             → layout/, tool/, category/, search/, shared/ — presentation only
  hooks/
  lib/            → seo helpers, schema builders, formatters
  types/
  constants/
  styles/
public/
tests/
```

**Rule of thumb:** if you're editing `page.tsx` and writing calculation logic, you're doing it wrong — logic lives in `logic/`, metadata lives in `data/`, wiring lives in `registry/`, rendering lives in `ui/`.

**Adding tool #501 should only ever require:**
1. One entry in `data/tools.ts`
2. One file in `logic/`
3. One component in `ui/tool/`
4. One line in `registry/`

No routing changes, no layout changes, no SEO changes — those are generated automatically from the registry.

---

## 6. 🔍 SEO (locked — non-negotiable baseline)

Every tool and category page auto-generates:
- Title, meta description, keywords from `data/tools.ts`
- Canonical URL
- OpenGraph + Twitter Card
- JSON-LD: `SoftwareApplication` or `WebApplication` schema per tool, `BreadcrumbList`, `FAQPage` where FAQs exist, `ItemList` on category/tools pages
- Auto-generated `sitemap.xml` (rebuilds as tools are added) and `robots.txt`
- Semantic HTML, single `<h1>` per page, proper heading hierarchy
- Target Lighthouse: **100 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO)

---

## 7. 🔎 Global Search (locked)

- `⌘K` / `Ctrl+K` command palette (shadcn `Command` component)
- Fuse.js fuzzy search across tool name, description, tags, category, keywords
- Debounced input, keyboard nav (↑↓ Enter Esc), highlighted match text
- Empty state + no-results state with a "browse categories" fallback
- Mobile: search icon opens full-screen search sheet

---

## 8. 🏠 Homepage Sections (locked, in order)

1. Hero — product name, one-line pitch, search bar front and center
2. Featured categories (Dev Tools, Calculators, Text, PDF...)
3. Popular tools (grid of cards, icon + name + one-line description)
4. Newly added tools
5. "Runs in your browser" privacy callout
6. Stats strip (tools count, categories count) — only real numbers, no fake social proof
7. FAQ (drives FAQ schema)
8. Footer — this is where `WarishLabs` branding lives properly (logo, link to warishlabs.in, other WarishLabs products)

---

## 9. 🛠️ Tool Page Template (locked, applies to all 500+ tools)

```
Breadcrumb: Home / Category / Tool Name
H1: Tool Name
1-line description
─────────────────────────
[ Interactive Tool Component ]
[ Copy | Download | Share | Reset actions ]
─────────────────────────
Privacy note (if client-side): "Processed locally — nothing uploaded"
How to use (short steps)
FAQ (drives schema)
Related tools (3-4 cards)
Category link
```

This exact skeleton is reused via `<ToolLayout>` for every tool — never rebuilt per tool.

---

## 10. 🚀 Phase 1 Launch Tool List (your actual starting scope)

**Calculators**
- Age Calculator
- EMI Calculator
- Loan Calculator
- Percentage Calculator
- BMI Calculator
- GST Calculator

**Developer Tools**
- JSON Formatter / Validator
- Base64 Encoder / Decoder
- UUID Generator
- JWT Decoder
- URL Encoder / Decoder
- Hash Generator (MD5/SHA)
- Regex Tester
- Color Converter

**Text Tools**
- Word / Character Counter
- Case Converter
- Lorem Ipsum Generator

That's ~17 tools across 3 categories — enough to launch with a real, useful product and validate the architecture before scaling to hundreds.

---

## 11. ✅ Definition of Done for v1 Launch

- [ ] Light/Dark/System theme toggle, no flash-of-unstyled-theme
- [ ] `/`, `/tools`, `/categories`, `/tools/[slug]`, `/categories/[slug]` all live
- [ ] ⌘K search working across all Phase 1 tools
- [ ] All 17 tools functional, client-side, no console errors
- [ ] Lighthouse 90+ on all four metrics (100 is the long-term target, 90+ gates launch)
- [ ] Sitemap + robots.txt auto-generating
- [ ] JSON-LD present on every tool/category page
- [ ] Mobile-first responsive, tested at 375px / 768px / 1440px
- [ ] Vercel deployment green, env vars documented in README
- [ ] README with badges, architecture overview, and "how to add a new tool" guide

---

## 12. 🗺️ Roadmap (post-launch)

- **Phase 2:** PDF tools (merge, split, compress — likely via `pdf-lib`)
- **Phase 3:** Image tools (compress, resize, convert — via `browser-image-compression` / canvas)
- **Phase 4:** Server-powered tools (AI text utilities) — registry already supports this, add an `executionType: 'server'` variant
- **Ongoing:** category expansion, blog/SEO content targeting each tool's search intent

---

This is the version to hand to your AI coding agent (Antigravity) as the master spec — scope it per branch (e.g. "Phase 1: scaffold + theme + homepage", then "Phase 1: 3 calculator tools", then "Phase 1: search") rather than one mega-prompt, matching how you've been shipping warishlabs.in.
