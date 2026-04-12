# CSS Refactor: Break Up global.css into Scoped Component Styles

**Date:** 2026-04-11
**Branch:** chore/break-up-insane-css-file

## Goal

Replace the monolithic `src/styles/global.css` (1033 lines) with scoped `<style>` blocks inside individual Astro components. Each component owns its styles. `global.css` slims to ~110 lines of truly global rules.

## What Stays in `global.css`

Only things that cannot or should not be scoped:

- CSS reset (`*, *::before, *::after`)
- `:root` custom properties — dark theme defaults
- `@media (prefers-color-scheme: light)` override block
- `[data-theme="light"]` override block
- `html`, `body` base styles
- `.container`
- `.section`, `.section-title` (shared layout primitives used across pages)
- `.btn`, `.btn-primary`, `.btn-secondary`, `.highlight`
- `.sr-only`
- `@keyframes fadeInUp`, `@keyframes blink`

`global.css` continues to be imported in `Base.astro` — one import, applies everywhere.

## New Components

All created under `src/components/`. Each gets a `<style>` block containing its styles and its own responsive overrides (`@media (max-width: 768px)`).

| Component | Styles Owned |
|-----------|-------------|
| `Nav.astro` | `.nav`, `.nav-container`, `.nav-logo`, `.nav-links a`, `.theme-toggle`, `.skip-link` |
| `Footer.astro` | `.footer`, `.footer-bar`, `.footer-mode`, `.footer-info`, `.footer-meta` |
| `Hero.astro` | `.hero`, `.hero-content`, `.hero-greeting`, `.hero-name`, `.hero-title`, `.hero-subtitle`, `.hero-cta`, `.hero-visual`, `.code-block`, `.code-header`, `.code-title`, `.code-cursor`, `.prompt`, `.btn` hover overrides if any |
| `About.astro` | `.about-text` inner styles |
| `Experience.astro` | `.timeline`, `.timeline-item`, `.timeline-marker`, `.timeline-content`, `.timeline-header`, `.timeline-date`, `.company`, `.tech-tags`, `.tag`, scroll-reveal animation for `.timeline-item` |
| `Expertise.astro` | `.expertise-grid`, `.expertise-card`, `.expertise-icon`, scroll-reveal animation for `.expertise-card` |
| `Contact.astro` | `.contact-intro`, `.contact-links`, `.contact-link`, scroll-reveal animation for `.contact-link` |

## Updated Existing Files

**`Base.astro`**
- Remove `import '../styles/global.css'` — move import to a `<style is:global>` block, or keep as-is (both work; keeping the JS import is fine)
- Import and render `<Nav />` and `<Footer />`
- Remove nav and footer markup
- No dedicated `<style>` block needed (Nav and Footer own their styles)

**`index.astro`**
- Import and render `<Hero />`, `<About />`, `<Experience />`, `<Expertise />`, `<Contact />`
- Retain section wrapper markup (`<section id="about" class="section about">`) with a scoped `<style>` block for the `.about` and `.expertise` background-color overrides (these are on the wrapper element, not inside the component)
- No large style block — just wrapper-level styles

**`src/layouts/Post.astro`**
- Add `<style>` block for: `.post-container`, `.post-header`, `.post-title`, `.post-date`, `.post-content` (all descendants), `.back-link`
- Responsive override for `.post-container` padding

**`src/pages/blog/index.astro`**
- Add `<style>` block for: `.blog-section` background, `.blog-list`, `.blog-post-row`, `.post-meta`, `.post-info`, `.post-title-text`, `.post-description`
- Responsive override for `.blog-post-row`

## Scoping Notes

- Astro scopes `<style>` blocks by adding a unique `data-astro-cid-*` attribute to component template elements at build time. No manual `:global()` wrappers needed.
- `html`/`body`/`*` selectors cannot be scoped — they stay in `global.css`.
- Section wrapper backgrounds (`.about { background: var(--color-bg-secondary) }`, `.expertise { background: var(--color-bg-secondary) }`) belong on the `<section>` elements in `index.astro`, not inside the child components. These get a small scoped `<style>` block in `index.astro`.
- `a[href*="local.tech"]` in the hero subtitle scopes cleanly inside `Hero.astro`.
- Scroll-reveal animation properties (`opacity: 0; transform: translateY(16px); transition: ...`) and `.visible` state live in each component that uses them (`Experience`, `Expertise`, `Contact`).

## File Count Delta

- Files removed: 0
- Files modified: `global.css`, `Base.astro`, `index.astro`, `Post.astro`, `blog/index.astro`
- Files created: `Nav.astro`, `Footer.astro`, `Hero.astro`, `About.astro`, `Experience.astro`, `Expertise.astro`, `Contact.astro`

## Success Criteria

- Visual output is pixel-identical before and after
- `global.css` is ~110 lines or fewer
- No styles remain in `global.css` that are only used by one component
- Each component file is self-contained: its markup and styles are co-located
- No `:global()` overrides needed
