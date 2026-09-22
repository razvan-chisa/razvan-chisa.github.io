# Contributing

This document describes common development patterns, workflows, and conventions for working on the MatrixRonny portfolio website.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup

```bash
npm install        # Install dependencies
npm run dev        # Start the local dev server (http://localhost:5173)
```

The dev server supports hot module replacement (HMR) for both HTML, CSS, and TypeScript changes.

### Build & Preview

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

## Development Workflow

### 1. Local Development

Always develop with `npm run dev`. The Vite dev server provides:

- Instant HMR for CSS and JS changes
- TypeScript type-checking in the browser
- Fast rebuilds

### 2. Making Changes

1. Edit source files in `src/` (TypeScript) or `public/` (static HTML/assets).
2. Check the browser to see changes reflected immediately.
3. Run `npm run build` to verify the production build succeeds.

### 3. Testing

This is a portfolio site with no automated tests. Manual verification is the standard:

- Check the site in the dev server (`npm run dev`).
- Test on multiple viewport sizes (mobile, tablet, desktop).
- Verify animations and transitions work as expected.
- Test the `prefers-reduced-motion` mode by enabling reduced motion in your OS settings.

## Common Tasks

### Adding Content to Existing Sections

Shared sections in `public/src/shared-sections/` are the primary content source. To modify section content:

1. Edit the relevant HTML file in `public/src/shared-sections/`.
2. No rebuild needed — the dev server serves these as static files.
3. Check the browser to see changes.

### Adding a New Shared Section

1. Create `public/src/shared-sections/<name>.html` with a `<section>` element following the existing pattern (see `projects.html` or `contact.html` as examples).
2. Open `src/shared-sections.ts` and:
   - Add `'name'` to the `SharedSectionName` union type.
   - Add `'name': '/src/shared-sections/<name>.html'` to `sectionFileMap`.
3. Add `<div data-shared-section="<name>"></div>` in any page HTML where the section should appear.

### Adding a New Page

1. Create a directory `pages/<new-page>/` with an `index.html` inside.
2. Follow the existing page structure: `<html>` with `<head>`, `<body>`, `<header>` with nav, `<main>` with mount points.
3. Include `<script type="module" src="/src/main.ts"></script>` at the end of `<body>`.
4. Register the page in `vite.config.js` under `build.rollupOptions.input`.

### Adding Assets (Images, Videos, PDFs)

1. Place files in `src/assets/` for assets imported in TypeScript code, or `public/` for static files served as-is.
2. In TypeScript, import with optional `?url` suffix:

```ts
import imgUrl from './assets/photo.jpg';        // inline blob URL (default)
import imgUrl from './assets/photo.jpg?url';    // hash-based URL string
```

3. For background videos, import both the `.webm` video and the `.png` poster image:

```ts
import videoUrl from './assets/my-video.webm';
import posterUrl from './assets/my-video-poster.png?url';
```

### Modifying Styles

All styles live in `src/style.css`. Follow these conventions:

- Use CSS custom properties from `:root` for colors and spacing.
- Follow the BEM-like naming: `.block__element--modifier`.
- Wrap responsive changes in `@media` queries.
- Add motion-reduced support under `@media (prefers-reduced-motion: reduce)`.

### Adding a Typewriter Animation

The typewriter system is in `src/typewriter.ts`. To animate any text element:

1. Add `class="typewriter-line"` to a container element.
2. Add `data-text="Your text here"` to specify the typed text.
3. Add `<span class="typewriter-line__text"></span><span class="typewriter-line__cursor">&nbsp;</span>` inside.

For scroll-triggered typewriter reveals, use `setupParallaxTypewriterReveal()` in `main.ts`:

```ts
setupParallaxTypewriterReveal({
  titleId: 'my-section-title',
  contentId: 'my-section-content',
});

### Modifying Shared Section Forms

Forms in shared sections submit to [FormSubmit.co](https://formsubmit.co/). To modify a form:

1. Edit the HTML in `public/src/shared-sections/<name>.html`.
2. Keep the `action` and `method="post"` attributes intact.
3. The email recipient is configured at FormSubmit.co (not in code).
4. For conditional fields (e.g., "Other" domain input), see `src/main.ts` for `setupCollaborationForms()` logic.

### Editing Hashtag Editors

Hashtag/tag editing is managed by `setupHashtagEditors()` in `main.ts`. To customize:

- The tag prefix, allowed values, and auto-tag behavior are defined in the function.
- Tags are normalized to lowercase with spaces replaced by hyphens.

## Code Conventions

### TypeScript

- Strict mode is enabled (`tsconfig.json`).
- Use explicit return types on top-level functions: `function foo(): string`.
- Type function options with interfaces:

```ts
type MyOptions = {
  enabled?: boolean;
  timeout?: number;
};
```

- Use type guards for DOM element checks:

```ts
if (!(el instanceof HTMLVideoElement)) return;
```

### CSS

- Use CSS custom properties for all colors and design tokens (defined in `:root`).
- Use `clamp()` for fluid typography and spacing.
- Use `gap` for flexbox/grid spacing instead of margins.
- All interactive elements must have visible focus styles.
- Respect `prefers-reduced-motion` by disabling or simplifying animations.

### HTML

- Use semantic HTML elements (`<section>`, `<article>`, `<nav>`, `<main>`, `<header>`).
- Include `aria-labelledby` on all `<section>` elements with headings.
- Add `aria-hidden="true"` to decorative elements.
- Use `data-*` attributes for JavaScript hooks (e.g., `data-shared-section`, `data-text`).
- Keep HTML accessible: proper labels, alt text, and keyboard navigation.

### Naming

- File names: kebab-case (`shared-sections.ts`, `style.css`).
- CSS classes: BEM-like kebab-case (`.parallax-section__title`).
- JavaScript functions: camelCase (`setupCollaborationForms`).
- HTML IDs: kebab-case (`collaboration-content`).

## Build & Deployment

### publish.sh

The `publish.sh` script handles the full build and deploy cycle:

```bash
./publish.sh    # Build and push to Codeberg Pages
```

**Before running:**
- Ensure all changes are committed (`publish.sh` checks for a clean working tree).
- Run `npm run build` first to verify the build succeeds locally.

**What it does:**
1. Checks for uncommitted changes (aborts if found).
2. Creates/rebases a `pages` branch from `main`.
3. Runs `npm run build`.
4. Copies `dist/` contents to the repository root.
5. Commits and pushes the `pages` branch (Codeberg Pages watches this).

### Deploy Checklist

- [ ] Changes look correct in `npm run dev`.
- [ ] Site works on mobile and desktop viewports.
- [ ] Animations work correctly.
- [ ] `npm run build` succeeds without errors.
- [ ] All new content is reviewed for accuracy.
- [ ] Run `./publish.sh` to deploy.

## File Locations Quick Reference

| What | Where |
|---|---|
| Main page HTML | `index.html` |
| Standalone pages | `projects/index.html`, `contact/index.html`, `under-construction/index.html` |
| Shared HTML sections | `public/src/shared-sections/` |
| TypeScript entry point | `src/main.ts` |
| All styles | `src/style.css` |
| Typewriter utility | `src/typewriter.ts` |
| Shared section loader | `src/shared-sections.ts` |
| Asset imports | `src/assets/` |
| Static assets (copied) | `public/` |
| Build configuration | `vite.config.js` |
| TypeScript config | `tsconfig.json` |
| Deployment script | `publish.sh` |
```