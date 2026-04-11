# Blog Engine Design

**Date:** 2026-04-11
**Status:** Approved

## Overview

Add a blog to the existing personal site at `chasingSublimity.github.io/blog/`. Posts are authored in Obsidian (markdown), built locally with a one-liner, and deployed automatically via GitHub Actions. The site migrates from hand-coded HTML to Astro, which compiles to static HTML — no runtime JS, no framework overhead, same terminal aesthetic.

## Architecture

The current three-file site (`index.html`, `styles.css`, `script.js`) migrates into an Astro project. Existing CSS and JS carry over unchanged as global assets. The index page becomes `src/pages/index.astro`.

```
src/
  content/
    blog/              ← Obsidian exports land here (.md files)
  layouts/
    Base.astro         ← shared <head>, global CSS/JS imports
    Post.astro         ← blog post wrapper (extends Base)
  pages/
    index.astro        ← current index.html, migrated
    blog/
      index.astro      ← post listing page
      [...slug].astro  ← individual post renderer (build-time template)
  styles/
    global.css         ← current styles.css, unchanged
```

Astro builds to `dist/` at build time:
```
dist/
  index.html
  blog/
    index.html
    my-post-slug/
      index.html
```

Navigation is plain `<a>` anchor tags. No client-side router. Full page loads. Identical to hand-coded HTML at runtime.

## Authoring Workflow

1. Write post in Obsidian as normal
2. Obsidian export path (or symlink) points directly at `src/content/blog/` in the repo
3. Posts use standard frontmatter:

```markdown
---
title: Post Title
date: 2026-04-11
description: One-line summary used in listing and meta tags
---

Body content here...
```

4. When ready to publish: `git add -A && git commit -m 'publish posts' && git push`
5. GitHub Actions builds and deploys automatically

## Blog Page Design

All pages inherit the existing terminal aesthetic — same font, CSS variables, no new design language.

**Listing page (`/blog/`):**
- Section heading: `$ blog` in `--color-prompt` green, matching existing section pattern
- Each post: `YYYY-MM-DD  Post Title` with description on the next line in `--color-text-secondary`
- Posts sorted newest-first
- Row hover state: left border shifts green → blue, frame fades in, background shifts to `--color-bg-tertiary` (matches existing card hover pattern)

**Individual post page (`/blog/[slug]/`):**
- `h1`: post title
- Date below title in `--color-text-secondary`
- Prose styled via `global.css`: `h2`/`h3`, inline `code`, `blockquote`, `pre` blocks all get terminal-appropriate styles
- `pre`/code blocks: `--color-bg-tertiary` background, left border in `--color-prompt` green
- Footer: `← back to blog` link
- No comments, tags, or search

**Site nav:** `blog` link added to existing nav pointing to `/blog/`.

## Build & Deploy

- **Build:** `astro build` — outputs static HTML to `dist/`
- **Deploy:** GitHub Actions workflow triggers on push to `main`, runs `astro build`, deploys `dist/` to GitHub Pages
- No manual build step required — push to main and the site updates automatically
- Astro's official GitHub Pages workflow (~15 lines of YAML) is the starting point

## Out of Scope

- Comments
- Tags / categories
- Search
- RSS (can be added later with one Astro integration)
- Dark/light mode toggle for blog (inherits site toggle)
