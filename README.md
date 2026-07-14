<p align="center">
  <img src="public/brand/logo-rounded.svg" alt="Toolkit Logo" width="96" height="96" />
</p>

# 🧰 Toolkit — Browser-First Utilities

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Hosting-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

A fast, private, browser-first utility platform by **WarishLabs** containing over 150+ professional tools across 17 specialized batches (Calculators, Converters, Developer Utilities, SEO Studios, Productivity suites, AI Prompt Builders, and Browser API demos). 100% of calculations run client-side in the user's browser — no data is ever uploaded or stored on servers.

---

> [!IMPORTANT]
> **Contributors**: Please read [brain.md](file:///home/md-warish-ansari/Projects/toolkit/brain.md) first before adding features, modifying tools, or restructuring files. It contains full architecture context, design system details, and development guidelines.

---

## 🚀 Features

- **Privacy-First**: Zero server uploads, zero storage, zero cookies. Inputs are processed entirely in the local browser context.
- **Snappy Performance**: Compiled statically with Next.js 16 App Router and React 19 using Turbopack for ultra-fast, sub-millisecond execution.
- **Premium Aesthetics**: Harmonious light and dark modes tailored to Vercel/Linear palettes, smooth morphing Framer Motion animations, and clean hairline layout grids.
- **⌘K Command Palette**: Global search powered by Fuse.js fuzzy matching across names, descriptions, keywords, categories, and tags.
- **Optimized SEO**: Fully semantic HTML, automated JSON-LD schemas (`WebApplication`, `BreadcrumbList`, `FAQPage`, `ItemList`), dynamic sitemaps, and full metadata headers.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, static HTML export capability)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & custom HSL design tokens
- **Components**: shadcn/ui (base-nova preset)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Search**: Fuse.js (fuzzy client-side matching)
- **Validation**: Zod

---

## 📂 Folder Structure

```
src/
  app/            → Routing endpoints (layouts, dynamic sitemap/robots, page routing)
  data/           → Database configurations (tools.ts, categories.ts, nav.ts, faq.ts)
  registry/       → Maps tool slugs to presentational React components
  logic/          → Pure TypeScript calculation functions per tool (no JSX/React)
  ui/             → Presentational folders (layout/, tool/, category/, search/, shared/)
  lib/            → Formatters, icon resolution, and SEO schema builders
  types/          → Shared TypeScript type definitions
```

---

## 🧩 How to Add a New Tool (4-Step Pattern)

Adding a new tool is fully modular and does not require editing layout, sitemap, SEO, or route folders:

1. **Add Metadata**: Insert the tool metadata in [tools.ts](file:///home/md-warish-ansari/Projects/toolkit/src/data/tools.ts):
   ```typescript
   {
     name: 'My Tool',
     slug: 'my-tool',
     description: 'Utility description.',
     category: 'developer-tools',
     tags: ['my', 'tag'],
     keywords: ['keyword'],
     icon: 'code',
     executionType: 'client',
     dateAdded: '2026-07-10'
   }
   ```
2. **Implement Logic**: Create `src/logic/my-tool.ts` exporting pure functions for the calculation.
3. **Build UI Component**: Create `src/ui/tool/my-tool.tsx` rendering input fields, managing state, and triggering calculations.
4. **Register Slug**: Add a single mapping inside [registry/index.ts](file:///home/md-warish-ansari/Projects/toolkit/src/registry/index.ts):
   ```typescript
   "my-tool": MyToolComponent,
   ```

---

## 💻 Development Commands

### Run Local Dev Server
```bash
npm run dev
```

### Run Static Build Verification
```bash
npm run build
```

### Run Linter Checks
```bash
npm run lint
```

### Run Type Checks
```bash
npm run typecheck
```

### Auto-Format Files
```bash
npm run format
```

### Run Complete Quality Check (Typecheck, Lint & Build)
```bash
npm run check-all
```

---

## ⚡ Vercel Deployment Guide

To deploy this Next.js 16 application to Vercel:

1. **Push Changes to GitHub**: Ensure all changes are committed and pushed to your repository.
2. **Import Project to Vercel**:
   - Go to your Vercel Dashboard and click **Add New** → **Project**.
   - Import your GitHub repository.
3. **Configure Environment Variables**:
   - Add the following environment variable in the Vercel project configuration settings under **Environment Variables**:
     - Key: `NEXT_PUBLIC_SITE_URL`
     - Value: `https://your-custom-domain.com` (or your Vercel generated preview URL)
4. **Deploy**: Click **Deploy**. Vercel will automatically build the project using its built-in Next.js configuration.

