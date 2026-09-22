# Architecture

This document describes the current design of the MatrixRonny portfolio website, including folder structure, shared page patterns, and architectural decisions.

## Project Overview

**matrixronny.codeberg.page** is a career presentation / portfolio website for Ronny (Razvan Chisa), a Solution Architect. It is built as a **static multi-page site** using Vite, TypeScript, and vanilla JavaScript — no framework.

## Folder Structure

```
├── index.html                    # Main page (splash intro + parallax sections)
├── projects/index.html           # Projects page (standalone)
├── contact/index.html            # Contact page (standalone)
├── under-construction/index.html # Placeholder / redirect page
├── dist/                         # Build output (copied to repo root for Codeberg Pages)
│
├── src/                          # Source code (compiled by Vite)
│   ├── main.ts                   # Entry point — bootstraps typewriters, shared sections, forms
│   ├── style.css                 # Global styles, CSS variables, all component CSS
│   ├── typewriter.ts             # Typewriter text animation utility
│   ├── shared-sections.ts        # Dynamic section loading system
│   └── assets/                   # Images, videos, PDFs (imported via Vite)
│       ├── splash-screen.png
│       ├── Architecture Diagram - Razvan Chisa v3.jpg
│       ├── UrbanRecycling.png
│       ├── Ronny 2026 v5 - public.pdf
│       └── stock-footage-*.webm / *.png   # Background video + poster images
│
├── public/                       # Static assets (copied as-is to dist)
│   ├── src/shared-sections/      # HTML templates loaded by shared-sections.ts
│   │   ├── resume.html
│   │   ├── projects.html
│   │   ├── contact.html
│   │   └── under-construction.html
│   ├── favicon.png
│   ├── Meta-Thumbnail.png        # Social media og:image
│   ├── StarCraft2-Meta.png
│   ├── sc2-daily.html            # Embedded StarCraft 2 daily content
│   └── serve.json                # Cloudflare Pages / hosting config
│
├── node_modules/
├── package.json                  # npm scripts: dev, build, preview
├── vite.config.js                # Multi-page build configuration
├── tsconfig.json                 # TypeScript: ES2022, ESNext, strict mode
├── publish.sh                    # Build + deploy script for Codeberg Pages
└── .gitignore
```

## Page Model

The site uses a **multi-page architecture** with four entry points defined in `vite.config.js`:

| Entry Point | Route | Description |
|---|---|---|
| `index.html` | `/` | Main page with splash intro, parallax sections, shared sections |
| `projects/index.html` | `/projects/` | Standalone projects page (only contains shared section mount point) |
| `contact/index.html` | `/contact/` | Standalone contact page (only contains shared section mount point) |
| `under-construction/index.html` | `/under-construction/` | Placeholder page with inline styles |

### Shared Pages

The `projects/` and `contact/` pages are **delegates** — they contain minimal HTML (a `<div data-shared-section="...">` mount point and a script import). All actual content is loaded dynamically from HTML templates in `public/src/shared-sections/`.

The main `index.html` page is **self-contained** but also uses shared sections via `data-shared-section` markers:

```html
<div data-shared-section="resume"></div>
<div data-shared-section="projects"></div>
<div data-shared-section="contact"></div>
```

## Shared Sections System

The shared sections system enables **content reuse** across pages without duplication.

### How It Works

1. HTML templates live in `public/src/shared-sections/` (served as static files).
2. On the client, `shared-sections.ts` scans the DOM for `[data-shared-section]` elements.
3. Each matching element is replaced with the fetched HTML template content.
4. This happens **before** other JavaScript initializes, so shared sections are in the DOM when `main.ts` runs.

```
public/src/shared-sections/
├── resume.html       → mounted where data-shared-section="resume"
├── projects.html     → mounted where data-shared-section="projects"
├── contact.html      → mounted where data-shared-section="contact"
└── under-construction.html
```

### Adding a New Shared Section

1. Create `public/src/shared-sections/<name>.html` with a `<section>` element.
2. Add the name to the `SharedSectionName` type and `sectionFileMap` in `src/shared-sections.ts`.
3. Add `<div data-shared-section="<name>"></div>` markers in the desired HTML pages.

## Entry Point (`src/main.ts`)

`main.ts` is the **single entry point** loaded by every page. It orchestrates:

1. **Mounting shared sections** — calls `mountSharedSections()` to populate `<div data-shared-section="...">` markers.
2. **Typewriter animations** — initializes typewriter effects on splash copy, section titles, and parallax content.
3. **Parallax reveal logic** — uses `IntersectionObserver` to trigger animations when sections scroll into view.
4. **Video playback** — starts background videos on reveal.
5. **Collaboration forms** — toggles contact/feedback form cards.
6. **Hashtag editors** — tag management UI for project cards.

### Initialization Order

```
main.ts init()
  └── mountSharedSections()     // 1. Populate shared sections first
  └── setupParallaxTypewriterReveal()  // 2. Set up scroll-triggered animations
  └── setupCollaborationForms() // 3. Form toggle logic
  └── setupHashtagEditors()     // 4. Tag management
```

## CSS Architecture

### CSS Custom Properties (Design Tokens)

All colors, spacing, and layout values are defined as CSS custom properties on `:root`:

```css
:root {
  --bg: #05070d;
  --bg-elevated: #0b1120;
  --fg: #e7ecf5;
  --fg-muted: #9aa4b8;
  --accent: #38bdf8;
  --accent-soft: #7dd3fc;
  --accent-glow: rgba(56, 189, 248, 0.55);
  --nav-height: 4rem;
  --max-width: 72rem;
}
```

### Naming Convention

Classes follow a **BEM-like** pattern: `block__element--modifier`

| Pattern | Example | Purpose |
|---|---|---|
| `block` | `.splash` | Top-level section |
| `block__element` | `.splash__title` | Child of a block |
| `block__element--modifier` | `.smart-form__field--hidden` | Variant of an element |

### Responsive Design

- Fluid typography via `clamp()`.
- Mobile-first media queries.
- `prefers-reduced-motion` support disables animations.

## Typewriter System (`src/typewriter.ts`)

A lightweight typewriter animation utility:

- `typeInto(el, text, options)` — types text into a single element with randomized character delays.
- `runTypewriters(container, options)` — types out all `[data-text]` elements within a container with staggered start times.

Options: `charDelay` (ms per character), `jitter` (random variance), `staggerMs` (delay between lines), `onDone` callback.

## Build & Deploy

### Build Configuration (`vite.config.js`)

```js
build: {
  outDir: 'dist',
  rollupOptions: {
    input: {
      main: 'index.html',
      'projects/index': 'projects/index.html',
      'contact/index': 'contact/index.html',
      'under-construction/index': 'under-construction/index.html',
    },
  },
}
```

Vite produces four independent HTML pages, each with its own JavaScript bundle. Assets (images, videos) are hashed and optimized.

### Deployment (`publish.sh`)

The `publish.sh` script automates deployment to Codeberg Pages:

```bash
# 1. Ensure clean working tree
# 2. Create/rebase a 'pages' branch from main
# 3. Run npm run build
# 4. Copy dist/ contents to repo root (Codeberg Pages root)
# 5. Commit and push
```

### npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Local dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview build output locally |

## Technology Stack

| Layer | Technology |
|---|---|
| Build tool | Vite v8 |
| Language | TypeScript (ES2022 target, strict mode) |
| Styling | Vanilla CSS with custom properties |
| Scripting | Vanilla JavaScript (ES modules) |
| Hosting | Codeberg Pages (Git-based) |
| Forms | FormSubmit.co (external form endpoint) |

## Design Patterns

### 1. Content-Logic Separation
HTML content lives in static HTML files (`public/src/shared-sections/`), while all logic is in TypeScript. This enables content changes without touching code.

### 2. Progressive Enhancement
The site works without JavaScript (static HTML). JavaScript enhances with animations, dynamic section loading, and interactive forms.

### 3. Scroll-Triggered Animations
`IntersectionObserver` drives reveal animations — typewriter text, video playback, and parallax effects all trigger when sections enter the viewport.

### 4. Asset URL Imports
Vite handles assets via ES module imports. Use `?url` suffix to get a URL string instead of an inline blob:

```ts
import imgUrl from './assets/photo.jpg';       // inline blob URL
import imgUrl from './assets/photo.jpg?url';   // hash-based URL string
```
