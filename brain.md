# 🧠 Toolkit — Brain File (Context & Architecture)

**Read this file first. Only fall back to scanning the full codebase or Toolkit-Final-Spec.md if something here is missing or seems out of date — and if you update the architecture, add tools, or change conventions, update this file too.**

---

## 1. Project Summary
Toolkit is a fast, private, browser-first utility platform built by WarishLabs. It is designed for developers, writers, and general users who need quick utilities without uploading sensitive data to external servers. All operations run 100% client-side inside the visitor's web browser, ensuring zero server latency and absolute privacy.

---

## 2. Locked Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (base-nova preset) |
| Icons | Lucide React |
| Animation | Framer Motion (micro-interactions only) |
| Theme | next-themes (Light / Dark / System) |
| Search | Fuse.js (fuzzy, client-side) |
| Validation | Zod |
| Quality | ESLint + Prettier |
| Hosting | Vercel |

---

## 3. Folder Structure

```
src/
  app/            → routing only, near-zero logic in page.tsx files
  data/           → tools.ts, categories.ts, nav.ts, faq.ts — pure data, no JSX
  registry/       → maps tool slug → React component (single import source)
  logic/          → pure TS modules per tool containing calculation logic (no React/JSX)
  ui/             → presentation components (layout/, tool/, category/, search/, shared/)
  hooks/          → shared custom hooks
  lib/            → formatters, SEO and JSON-LD schema builders
  types/          → central TypeScript type definitions
  constants/      → site config and search settings
  styles/         → styling configurations
public/
  brand/          → lockup logos and PWA assets
```

### "Where does X go?" Rule of Thumb
- **Raw computation or algorithms?** Goes to `src/logic/`.
- **Text content, FAQs, or metadata fields?** Goes to `src/data/`.
- **React elements or UI layouts?** Goes to `src/ui/`.
- **New tool path registration?** Add it in `src/registry/index.ts`.
- **Routing?** Handled automatically in `src/app/` using dynamic slug routers. Never write custom page files for tools.

---

## 4. Logo Usage Rules (Verbatim)
- **Rounded assets** (`public/brand/logo-rounded.*`) are used for header/footer/chrome contexts.
- **Tight asset** (`public/brand/logo-tight.png`) is used for favicon/manifest/icon contexts only.

---

## 5. Adding a New Tool (4-Step Pattern)
To add a new tool (e.g. `New Utility`), execute exactly these 4 steps:
1. **data/tools.ts**: Add metadata object for the tool under `tools` array (name, slug, description, category, tags, keywords, icon, howToUse, faqs).
2. **logic/[slug].ts**: Create a pure TS calculation module exporting standard functions.
3. **ui/tool/[slug].tsx**: Build the presentational React UI component wrapping state and outputs.
4. **registry/index.ts**: Map the tool slug to the presentation component in `toolRegistry`.

No routing adjustments, no custom SEO tagging, and no layout rewrites are ever required.

---

## 6. Theme System & Styling
- Configured using `next-themes` with the `class` strategy.
- Prevent theme flash by including an inline script inside the `<head>` of `src/app/layout.tsx` and adding `suppressHydrationWarning` on `<html>`.
- Design tokens defined as native CSS variables inside `src/app/globals.css`.
- **Light Theme**: Inspired by Vercel/Linear (soft off-white backgrounds, thin borders).
- **Dark Theme**: Inspired by Linear (near-black, slightly lifted card surface color).
- Single accent color used sparingly for primary actions, focus states, and indicators.

---

## 7. Current Status
- **Categories implemented**: Calculators, Developer Tools, Text Tools.
- **Tools implemented**:
  - *Calculators*: Age Calculator, BMI Calculator, Percentage Calculator
  - *Developer Tools*: JSON Formatter / Validator, UUID Generator, Base64 Encoder / Decoder, Hash Generator (MD5/SHA)
  - *Text Tools*: Word / Character Counter, Case Converter
- **Live Routes**: `/`, `/tools`, `/categories`, `/tools/[slug]`, `/categories/[slug]`, `/about`, `/privacy-policy`, `/terms`, `/disclaimer`.
- **Sitemap & Robots**: Auto-generating at runtime.

---

## 8. Roadmap
- **Phase 1 Remaining**: EMI Calculator, Loan Calculator, GST Calculator, JWT Decoder, URL Encoder/Decoder, Regex Tester, Color Converter, Lorem Ipsum Generator.
- **Phase 2**: PDF utilities (split, merge, compress via `pdf-lib`).
- **Phase 3**: Image processing (resize, compress via client-side canvas).
- **Phase 4**: Server-powered AI tools (using `executionType: 'server'`).

---

## 9. Known Conventions
- **Running Development**: `npm run dev`
- **Building Project**: `npm run build`
- **Type Checking**: `npm run typecheck`
- **Formatting Code**: `npm run format`
- **Check All Checks**: `npm run check-all`
- **Git Commit Style**: Conventional Commit style (e.g. `feat: ...`, `fix: ...`, `chore: ...`).
