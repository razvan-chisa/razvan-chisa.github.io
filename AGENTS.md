# AGENTS.md — Project Organization Guide

This document describes how the project is organized and where new code should be placed. It is intended as a quick reference for developers (and AI agents) navigating the codebase.

## Quick Reference: Key Directories

| Directory | Purpose |
|---|---|
| `src/` | TypeScript source code and styles |
| `src/assets/` | Images, videos, PDFs imported by TypeScript |
| `src/shared-sections/` | **Does not exist at source level** — shared HTML templates are in `public/src/shared-sections/` |
| `public/` | Static files copied to `dist/` as-is |
| `public/src/shared-sections/` | HTML templates for shared sections |
| `dist/` | Build output (never edited directly) |
| `projects/`, `contact/`, `under-construction/` | Standalone page directories |

## Project Structure (Flat View)

```
matrixronny.codeberg.page/
├── index.html                    ← Main page (splash + sections)
├── projects/
│   └── index.html                ← Projects page (delegate)
├── contact/
│   └── index.html                ← Contact page (delegate)
├── under-construction/
│   └── index.html                ← Placeholder page
├── dist/                         ← Build output (generated)
│
├── src/
│   ├── main.ts                   ← JS entry point (all pages load this)
│   ├── style.css                 ← All styles (single file)
│   ├── typewriter.ts             ← Typewriter animation utility
│   ├── shared-sections.ts        ← Section loading system
│   └── assets/                   ← Image/video/PDF assets
│
├── public/
│   ├── src/shared-sections/      ← HTML templates for shared sections
│   │   ├── resume.html
│   │   ├── projects.html
│   │   ├── contact.html
│   │   └── under-construction.html
│   ├── favicon.png
│   ├── sc2-daily.html
│   └── serve.json
│
├── package.json
├── vite.config.js
├── tsconfig.json
├── publish.sh
└── .gitignore
```

## Where to Place New Code

### New TypeScript Logic → `src/main.ts`

`src/main.ts` is the single entry point loaded by every page. All initialization logic goes here:

- Scroll-triggered animations → `setupParallaxTypewriterReveal()` calls
- Form toggle logic → `setupCollaborationForms()`
- Tag editing → `setupHashtagEditors()`
- Any DOM manipulation after shared sections are mounted

### New Shared JavaScript/Utilities → `src/<name>.ts`

If a utility is self-contained (like `typewriter.ts`), create a new file in `src/` and import it from `main.ts`:

```
src/my-feature.ts    ← new utility file
src/main.ts          ← import my-feature.ts here
```

### New Styles → `src/style.css`

All CSS is in a single file. Add new rules at the appropriate section, following the existing patterns:

- Group related rules with section comments (e.g., `/* ---------------- Top navigation ---------------- */`)
- Use existing CSS custom properties from `:root`
- Follow BEM-like naming: `.block__element--modifier`
- Add responsive rules under `@media (min-width: 48rem)`

### New Shared HTML Content → `public/src/shared-sections/<name>.html`

Shared sections are HTML fragments loaded dynamically by `shared-sections.ts`:

1. Create the HTML template in `public/src/shared-sections/<name>.html`.
2. Register it in `src/shared-sections.ts` (add to `SharedSectionName` type and `sectionFileMap`).
3. Add a `<div data-shared-section="<name>"></div>` mount point in any page HTML.

### New Static Assets → `src/assets/` or `public/`

| Use `src/assets/` for: | Use `public/` for: |
|---|---|
| Images/videos imported in TypeScript | Files served as-is (favicons, etc.) |
| Assets that need Vite hashing | Files referenced directly in HTML |

Import assets in TypeScript:

```ts
import imgUrl from './assets/photo.jpg?url';   // hash-based URL string
```

### New Standalone Page → `<name>/index.html` + `vite.config.js`

Each page is a directory with an `index.html`:

1. Create `pages/<name>/index.html` following the existing page template.
2. Include `<script type="module" src="/src/main.ts"></script>`.
3. Register in `vite.config.js`:

```js
input: {
  main: resolve(__dirname, 'index.html'),
  // ...existing entries...
  'pages/<name>/index': resolve(__dirname, 'pages/<name>/index.html'),
}
```

### Configuration Files

| File | Purpose |
|---|---|
| `vite.config.js` | Build configuration (entry points, output dir) |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Dependencies and npm scripts |
| `publish.sh` | Deployment script |
| `.gitignore` | Git ignore rules |

## Shared Sections Pattern (Deep Dive)

The shared sections system is the primary content mechanism. Understanding it is essential:

### Flow

```
1. HTML page has: <div data-shared-section="resume"></div>
2. main.ts calls mountSharedSections()
3. shared-sections.ts fetches public/src/shared-sections/resume.html
4. The fetch response replaces the <div> with the section content
5. main.ts continues initialization (typewriters, forms, etc.)
```

### Key Files

| File | Role |
|---|---|
| `public/src/shared-sections/*.html` | HTML templates (content) |
| `src/shared-sections.ts` | Loader (fetches + mounts templates) |
| `src/main.ts` | Orchestrator (calls mountSharedSections first) |

### Adding Content to Existing Sections

Simply edit the HTML in `public/src/shared-sections/<name>.html`. No TypeScript changes needed.

## Architecture Reference

For a full architectural overview (design patterns, page model, CSS architecture, technology stack), see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing Reference

For development workflows, code conventions, common tasks, and deployment procedures, see [CONTRIBUTING.md](./CONTRIBUTING.md).