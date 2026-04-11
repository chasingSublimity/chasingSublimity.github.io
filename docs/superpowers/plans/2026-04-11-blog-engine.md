# Blog Engine (Astro Migration) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the personal site from hand-coded HTML to Astro and add a markdown-powered blog at `/blog/` with Obsidian authoring and automatic GitHub Actions deployment.

**Architecture:** The existing `index.html`/`styles.css`/`script.js` port directly into Astro — CSS and JS are unchanged, the HTML becomes `.astro` templates. A content collection serves blog posts as static HTML from markdown files. GitHub Actions builds on every push to `main` and deploys to GitHub Pages.

**Tech Stack:** Astro 4.x, vanilla JS (existing), GitHub Actions `actions/deploy-pages`

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `package.json` | Astro scripts and deps |
| Create | `astro.config.mjs` | Site URL, Astro config |
| Create | `tsconfig.json` | TypeScript config for Astro |
| Rename | `styles.css` → `src/styles/global.css` | Global styles (unchanged) |
| Move | `script.js` → `public/script.js` | Static JS asset |
| Create | `src/layouts/Base.astro` | Shared head, nav, footer |
| Create | `src/layouts/Post.astro` | Blog post wrapper |
| Create | `src/pages/index.astro` | Home page (migrated index.html) |
| Create | `src/pages/blog/index.astro` | Blog listing |
| Create | `src/pages/blog/[...slug].astro` | Individual post renderer |
| Create | `src/content/config.ts` | Blog collection schema |
| Create | `src/content/blog/hello-world.md` | Sample post for testing |
| Update | `src/styles/global.css` | Add blog + prose styles |
| Delete | `index.html`, `styles.css`, `script.js` (root) | Replaced by Astro |
| Create | `.github/workflows/deploy.yml` | GitHub Actions deploy |

---

### Task 1: Initialize Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Update: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "personal-site",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.16.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chasingSublimity.github.io',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/base"
}
```

- [ ] **Step 4: Add `.gitignore`**

Create `.gitignore` in the repo root:

```
node_modules/
dist/
.env
.DS_Store
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` appears, `package-lock.json` created. No errors.

- [ ] **Step 6: Create the src directory structure**

```bash
mkdir -p src/layouts src/pages/blog src/content/blog src/styles public
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: initialize Astro project"
```

---

### Task 2: Move static assets

**Files:**
- Move: `styles.css` → `src/styles/global.css`
- Move: `script.js` → `public/script.js`

- [ ] **Step 1: Move CSS**

```bash
cp styles.css src/styles/global.css
```

- [ ] **Step 2: Move JS**

```bash
cp script.js public/script.js
```

Do not delete the originals yet — the old `index.html` still references them. They'll be removed in Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css public/script.js
git commit -m "chore: copy static assets into Astro structure"
```

---

### Task 3: Create Base layout

**Files:**
- Create: `src/layouts/Base.astro`

This layout contains everything outside `<body>`'s main content: `<head>`, nav, footer, and both script tags. The nav links use absolute paths (`/#about`) so they work from any page.

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
}
const { title = 'Blake Sager | Principal Engineer' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script is:inline>
      (function () {
        var t = localStorage.getItem("theme");
        if (t) document.documentElement.setAttribute("data-theme", t);
      })();
    </script>
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <nav class="nav" aria-label="Primary">
      <div class="nav-container">
        <a href="/" class="nav-logo">~/blake</a>
        <ul class="nav-links">
          <li><a href="/#about">about</a></li>
          <li><a href="/#experience">experience</a></li>
          <li><a href="/#expertise">expertise</a></li>
          <li><a href="/blog/">blog</a></li>
          <li><a href="/#contact">contact</a></li>
        </ul>
        <button class="theme-toggle" aria-label="Toggle light/dark mode">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
    </nav>

    <main id="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer-bar">
        <span class="footer-mode">NORMAL</span>
        <span class="footer-info">blake sager &middot; principal engineer</span>
        <span class="footer-meta">utf-8 &middot; unix &middot; &copy; 2026</span>
      </div>
    </footer>

    <script src="/script.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify structure**

```bash
cat src/layouts/Base.astro | head -5
```

Expected: `---` frontmatter delimiter on line 1.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add Base layout"
```

---

### Task 4: Migrate index page

**Files:**
- Create: `src/pages/index.astro`

This is the content between `<body>` and `</body>` in the original `index.html`, minus the nav and footer (now in Base.astro), wrapped in `<Base>`.

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <header class="hero">
    <div class="hero-content">
      <p class="hero-greeting">
        <span class="prompt" aria-hidden="true">$</span> whoami
      </p>
      <h1 class="hero-name">Blake Sager</h1>
      <p class="hero-title">Principal Engineer</p>
      <p class="hero-subtitle">
        Building AI-native devloops @
        <a href="https://trello.com" target="_blank" rel="noopener" aria-label="trello.com (opens in new tab)">trello.com</a>.<br />
        Building software for my neighbors @
        <a href="https://local.tech" target="_blank" rel="noopener" aria-label="local.tech (opens in new tab)">local.tech</a>.
      </p>
      <div class="hero-cta">
        <a href="#contact" class="btn btn-primary">get in touch</a>
        <a href="#experience" class="btn btn-secondary">view my work</a>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="code-block">
        <div class="code-header">
          <span class="prompt" aria-hidden="true">$</span>
          <span class="code-title">./blake --help</span>
        </div>
        <pre><code><span class="keyword">usage:</span> <span class="function">blake</span> [--build | --mentor | --automate]

<span class="keyword">options:</span>
  <span class="string">--build</span>      design and implement
  <span class="string">--mentor</span>     shepherd and grow
  <span class="string">--automate</span>   scale and optimize

<span class="keyword">requires:</span> coffee</code></pre>
      </div>
    </div>
  </header>

  <section id="about" class="section about">
    <div class="container">
      <h2 class="section-title">
        <a href="#about" aria-label="About">cat about.md</a>
      </h2>
      <div class="about-content">
        <div class="about-text">
          <p>I love building tools.</p>
          <p>
            As tech lead for <span class="highlight">Trello</span>'s Dev
            Lifecycle team, I own the inner and outer dev loops for our core
            repositories, ensuring our engineers can quickly and safely write,
            test, and ship code. Increasingly this looks like building
            AI-native tooling, though I still spend a good chunk of my time on
            the "classics" — build systems, CI/CD pipelines, and deployment
            infrastructure.
          </p>
          <p>
            As a technical cofounder of
            <a href="https://local.tech" target="_blank" rel="noopener" aria-label="local.tech (opens in new tab)">local.tech</a>,
            I build custom software for small and medium businesses in my
            community, helping local companies ditch bloated, legacy SaaS
            products in favor of tailored solutions that meet their unique needs.
          </p>
          <p>
            When I'm not optimizing build times or shipping agentic pipelines,
            you'll find me mentoring engineers, contributing to open source,
            and making indie games.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="experience" class="section experience">
    <div class="container">
      <h2 class="section-title">
        <a href="#experience" aria-label="Experience">git log --author=blake</a>
      </h2>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>Principal Engineer, Dev Lifecycle</h3>
              <span class="company">Trello (Atlassian)</span>
            </div>
            <span class="timeline-date">2025 — present</span>
            <p>
              Leading the Dev Lifecycle team responsible for CI, deployments,
              and developer tooling across Trello's core repositories. Own
              both inner loop (local dev experience) and outer loop (CI/CD
              pipelines, staging, production deploys) for the engineering
              organization.
            </p>
            <div class="tech-tags">
              <span class="tag">Node.js</span>
              <span class="tag">MongoDB</span>
              <span class="tag">React</span>
              <span class="tag">AWS</span>
              <span class="tag">CI/CD</span>
            </div>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>Sr Backend Engineer, Backend Platform</h3>
              <span class="company">Trello (Atlassian)</span>
            </div>
            <span class="timeline-date">2023 — 2025</span>
            <p>
              Worked on the performance, reliability, and scalability of
              Trello's primary backend monolith.
            </p>
            <div class="tech-tags">
              <span class="tag">Node.js</span>
              <span class="tag">MongoDB</span>
              <span class="tag">AWS</span>
            </div>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>Backend Engineer</h3>
              <span class="company">Trello (Atlassian)</span>
            </div>
            <span class="timeline-date">2021 — 2023</span>
            <p>
              Contributed to the reliability and scalability of Trello's core
              backend, working across API development, data modeling, and
              performance improvements on one of Atlassian's flagship products.
            </p>
            <div class="tech-tags">
              <span class="tag">Node.js</span>
              <span class="tag">MongoDB</span>
              <span class="tag">AWS</span>
            </div>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>Software Engineer</h3>
              <span class="company">ActiveProspect</span>
            </div>
            <span class="timeline-date">2017 — 2021</span>
            <p>
              Built and extended API integrations with third-party platforms.
              Improved product resiliency through spooling and circuit breaker
              patterns, and contributed to API endpoint development across the
              core platform.
            </p>
            <div class="tech-tags">
              <span class="tag">Node.js</span>
              <span class="tag">Angular</span>
              <span class="tag">MongoDB</span>
              <span class="tag">AWS</span>
            </div>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>Jr Backend Engineer</h3>
              <span class="company">Ryder</span>
            </div>
            <span class="timeline-date">2016 — 2017</span>
            <p>
              Developed core file synchronization services and storage
              optimization algorithms. Contributed to systems serving over 500
              million users with petabytes of data.
            </p>
            <div class="tech-tags">
              <span class="tag">Node.js</span>
              <span class="tag">Angular</span>
              <span class="tag">OracleDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="expertise" class="section expertise">
    <div class="container">
      <h2 class="section-title">
        <a href="#expertise" aria-label="Expertise">ls expertise/</a>
      </h2>
      <div class="expertise-grid">
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          </div>
          <h3>CI/CD Pipelines</h3>
          <p>Designing and optimizing continuous integration and deployment pipelines. Building reliable, fast feedback loops that help teams ship with confidence.</p>
        </div>
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="0" ry="0" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          </div>
          <h3>Developer Tooling</h3>
          <p>Creating tools that improve developer productivity and experience. Building CLIs, automation, and integrations that make engineers' lives easier.</p>
        </div>
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
          </div>
          <h3>Build Systems</h3>
          <p>Optimizing build performance and reliability across monorepos and polyglot codebases. Experience with caching, parallelization, and incremental builds.</p>
        </div>
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
          </div>
          <h3>Cloud Infrastructure</h3>
          <p>Building and managing cloud-native applications on AWS, GCP, and Azure. Deep expertise in containerization and orchestration.</p>
        </div>
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
          </div>
          <h3>Deploy Infrastructure</h3>
          <p>Building reliable deployment systems with rollback capabilities, canary releases, and progressive delivery. Ensuring safe and fast paths to production.</p>
        </div>
        <div class="expertise-card">
          <div class="expertise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <h3>Technical Leadership</h3>
          <p>Mentoring engineers, driving architectural decisions, and fostering a culture of technical excellence and continuous improvement.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="section contact">
    <div class="container">
      <h2 class="section-title">
        <a href="#contact" aria-label="Contact">contact --list</a>
      </h2>
      <p class="contact-intro">
        Interested in discussing developer experience, CI/CD, or dev tooling?
        I'd love to hear from you.
      </p>
      <div class="contact-links">
        <a href="mailto:blakemsager@gmail.com" class="contact-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          <span>Email</span>
        </a>
        <a href="https://www.linkedin.com/in/adfontes/" class="contact-link" target="_blank" rel="noopener" aria-label="LinkedIn (opens in new tab)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/chasingSublimity" class="contact-link" target="_blank" rel="noopener" aria-label="GitHub (opens in new tab)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
          <span>GitHub</span>
        </a>
        <a href="https://bsky.app/profile/adfontes.bsky.social" class="contact-link" target="_blank" rel="noopener" aria-label="Bluesky (opens in new tab)">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" /></svg>
          <span>Bluesky</span>
        </a>
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Start dev server and verify home page looks identical**

```bash
npm run dev
```

Open `http://localhost:4321` in a browser. Verify:
- Hero section with typewriter effect
- All four sections (about, experience, expertise, contact)
- Nav links work
- Theme toggle works
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: migrate index page to Astro"
```

---

### Task 5: Remove old root files

**Files:**
- Delete: `index.html`
- Delete: `styles.css`
- Delete: `script.js`

- [ ] **Step 1: Delete old files**

```bash
git rm index.html styles.css script.js
```

- [ ] **Step 2: Verify dev server still works**

```bash
npm run dev
```

Open `http://localhost:4321` — site should look identical. CSS and JS now served from `src/styles/global.css` and `public/script.js`.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove hand-coded HTML/CSS/JS (replaced by Astro)"
```

---

### Task 6: Set up blog content collection

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/hello-world.md`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Create sample post `src/content/blog/hello-world.md`**

```markdown
---
title: Hello World
date: 2026-04-11
description: First post — the blog is live.
---

The blog is live.

## Why a Blog

I've been meaning to write publicly for a while. This is the minimal viable version: Obsidian for writing, one command to publish.

## How It Works

Write in Obsidian. Push. Done.

```bash
git add -A && git commit -m "publish posts" && git push
```

No CMS, no database, no surprises.
```

- [ ] **Step 3: Verify the build finds the collection**

```bash
npm run build 2>&1 | tail -20
```

Expected: build completes without errors. You'll see output like `✓ Completed in Xs`.

- [ ] **Step 4: Commit**

```bash
git add src/content/config.ts src/content/blog/hello-world.md
git commit -m "feat: add blog content collection with sample post"
```

---

### Task 7: Add blog styles

**Files:**
- Modify: `src/styles/global.css`

Append these styles to the end of `src/styles/global.css`. They add the blog listing and blog post prose styles.

- [ ] **Step 1: Append blog styles to `src/styles/global.css`**

```css
/* ── Blog Listing ───────────────────────────────────────── */

.blog-section {
    background: var(--color-bg);
}

.blog-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.blog-post-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 0 30px;
    padding: 25px 30px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-left: 2px solid var(--color-prompt);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}

.blog-post-row:hover {
    border-color: var(--color-border);
    border-left-color: var(--color-accent);
    background: var(--color-bg-tertiary);
}

.post-meta {
    color: var(--color-text-tertiary);
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    padding-top: 4px;
    white-space: nowrap;
}

.post-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.post-title-text {
    color: var(--color-text);
    font-size: 1rem;
    font-weight: 500;
}

.post-description {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

/* ── Blog Post Prose ────────────────────────────────────── */

.post-container {
    padding-top: 160px;
    padding-bottom: 120px;
    background: var(--color-bg);
}

.post-header {
    margin-bottom: 60px;
}

.post-title {
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
}

.post-date {
    display: block;
    font-size: 0.82rem;
    color: var(--color-text-tertiary);
    letter-spacing: 0.05em;
}

.post-content {
    max-width: 720px;
}

.post-content p {
    color: var(--color-text-secondary);
    margin-bottom: 25px;
    font-size: 0.975rem;
    line-height: 1.85;
}

.post-content h2 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 50px 0 20px;
    padding-left: 16px;
    border-left: 2px solid var(--color-prompt);
}

.post-content h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 35px 0 15px;
}

.post-content a {
    color: var(--color-prompt);
    text-decoration: none;
    transition: var(--transition);
}

.post-content a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.post-content code {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-syntax-string);
    background: var(--color-bg-tertiary);
    padding: 2px 6px;
    border: 1px solid var(--color-border);
}

.post-content pre {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-left: 2px solid var(--color-prompt);
    padding: 25px 30px;
    overflow-x: auto;
    margin: 30px 0;
}

.post-content pre code {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.post-content blockquote {
    border-left: 2px solid var(--color-accent);
    padding: 15px 25px;
    margin: 30px 0;
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
}

.post-content ul,
.post-content ol {
    color: var(--color-text-secondary);
    padding-left: 25px;
    margin-bottom: 25px;
    font-size: 0.975rem;
    line-height: 1.85;
}

.post-content li {
    margin-bottom: 8px;
}

.back-link {
    display: inline-block;
    margin-top: 60px;
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: var(--transition);
    border-left: 2px solid var(--color-prompt);
    padding: 8px 16px;
}

.back-link:hover {
    color: var(--color-text);
    border-left-color: var(--color-accent);
    background: var(--color-bg-secondary);
}

@media (max-width: 768px) {
    .blog-post-row {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .post-container {
        padding-top: 120px;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add blog listing and prose styles"
```

---

### Task 8: Create blog listing page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
---
<Base title="Blog | Blake Sager">
  <section class="section blog-section">
    <div class="container">
      <h2 class="section-title">
        <a href="/blog/" aria-label="Blog">ls blog/</a>
      </h2>
      <div class="blog-list">
        {posts.map(post => {
          const dateStr = post.data.date.toISOString().split('T')[0];
          return (
            <a href={`/blog/${post.slug}/`} class="blog-post-row">
              <span class="post-meta">{dateStr}</span>
              <span class="post-info">
                <span class="post-title-text">{post.data.title}</span>
                <span class="post-description">{post.data.description}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Verify listing page**

```bash
npm run dev
```

Open `http://localhost:4321/blog/` — should see the "Hello World" post listed with its date and description. Hover the row to confirm border/background hover pattern fires.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog listing page"
```

---

### Task 9: Create Post layout and post page

**Files:**
- Create: `src/layouts/Post.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create `src/layouts/Post.astro`**

```astro
---
import Base from './Base.astro';

interface Props {
  title: string;
  date: Date;
}

const { title, date } = Astro.props;
const dateStr = date.toISOString().split('T')[0];
---
<Base title={`${title} | Blake Sager`}>
  <article class="post-container">
    <div class="container">
      <header class="post-header">
        <h1 class="post-title">{title}</h1>
        <time class="post-date" datetime={dateStr}>{dateStr}</time>
      </header>
      <div class="post-content">
        <slot />
      </div>
      <a href="/blog/" class="back-link">← back to blog</a>
    </div>
  </article>
</Base>
```

- [ ] **Step 2: Create `src/pages/blog/[...slug].astro`**

```astro
---
import { getCollection } from 'astro:content';
import Post from '../../layouts/Post.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<Post title={post.data.title} date={post.data.date}>
  <Content />
</Post>
```

- [ ] **Step 3: Verify post page**

```bash
npm run dev
```

Open `http://localhost:4321/blog/hello-world/` — should see the post title, date, body content, and "← back to blog" link. Verify code block has left prompt-green border.

- [ ] **Step 4: Run a full build to confirm static generation**

```bash
npm run build
```

Expected output includes lines like:
```
▶ src/pages/blog/hello-world.md
  └─ /blog/hello-world/index.html
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Post.astro src/pages/blog/[...slug].astro
git commit -m "feat: add blog post layout and dynamic route"
```

---

### Task 10: Set up GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

**Prerequisite (manual):** In the GitHub repo settings, go to **Settings → Pages → Source** and change it from "Deploy from a branch" to **"GitHub Actions"**. This only needs to be done once.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```bash
mkdir -p .github/workflows
```

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify the workflow file is valid YAML**

```bash
cat .github/workflows/deploy.yml | grep "name:"
```

Expected:
```
name: Deploy to GitHub Pages
      - name: Checkout
      - name: Setup Node
      - name: Install dependencies
      - name: Build
      - name: Upload artifact
      - name: Deploy to GitHub Pages
```

- [ ] **Step 3: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
git push
```

- [ ] **Step 4: Verify deploy**

Go to the GitHub repo → **Actions** tab. The "Deploy to GitHub Pages" workflow should be running. After it completes (~1-2 min), visit `https://chasingSublimity.github.io` and `https://chasingSublimity.github.io/blog/` to confirm the live site.

---

### Task 11: Configure Obsidian authoring workflow

This is a one-time local setup, not a code change.

- [ ] **Step 1: Point Obsidian at the blog folder**

Option A (recommended) — Open the repo as a vault:
1. In Obsidian: **Open another vault → Open folder as vault**
2. Select `/path/to/personal-site/src/content/blog/`
3. Write posts directly here. Files are already in the right place.

Option B — Symlink from an existing vault:
```bash
ln -s /path/to/personal-site/src/content/blog ~/path/to/obsidian-vault/blog
```

Then access the `blog` folder from within your existing Obsidian vault.

- [ ] **Step 2: Confirm the publish workflow**

To publish a post:
1. Write the post in Obsidian with frontmatter:
   ```markdown
   ---
   title: My Post
   date: 2026-04-15
   description: One-line summary.
   ---
   ```
2. Run:
   ```bash
   git add -A && git commit -m "publish: My Post" && git push
   ```
3. GitHub Actions builds and deploys automatically in ~60 seconds.

---

## Done

The site is now Astro-powered with a working blog at `/blog/`. Future posts: write in Obsidian, commit, push.
