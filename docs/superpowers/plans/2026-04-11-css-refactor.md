# CSS Refactor: Break Up global.css Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the monolithic 1033-line `src/styles/global.css` with scoped `<style>` blocks in individual Astro components, leaving only truly global rules in `global.css`.

**Architecture:** Extract each page section into its own `src/components/*.astro` file with co-located styles. `global.css` retains reset, CSS custom properties, html/body, and shared layout primitives. `Base.astro` delegates to `Nav` and `Footer` components. `index.astro` composes five section components. `Post.astro` and `blog/index.astro` get their own scoped styles. Post prose styles use `.post-content :global(tag)` because the content comes from a `<slot />` (Markdown) and won't carry Astro's scope attribute.

**Tech Stack:** Astro 4, scoped CSS `<style>` blocks, no external CSS tooling.

---

## File Map

**Created:**
- `src/components/Nav.astro` — nav bar, skip link, theme toggle + their styles
- `src/components/Footer.astro` — footer status bar + styles
- `src/components/Hero.astro` — hero section + code block visual + styles
- `src/components/About.astro` — about text content + styles
- `src/components/Experience.astro` — timeline + styles + scroll-reveal animation
- `src/components/Expertise.astro` — expertise grid + styles + scroll-reveal animation
- `src/components/Contact.astro` — contact links + styles + scroll-reveal animation

**Modified:**
- `src/styles/global.css` — slim to ~110 lines (reset, tokens, html/body, shared layout primitives)
- `src/layouts/Base.astro` — import Nav/Footer, remove nav/footer markup
- `src/layouts/Post.astro` — add scoped prose styles
- `src/pages/index.astro` — import section components, keep section wrappers + bg overrides
- `src/pages/blog/index.astro` — add scoped blog listing styles

---

### Task 1: Create `src/components/Nav.astro`

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
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

<style>
  /* Skip link */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .skip-link:focus {
    position: fixed;
    top: 1rem;
    left: 1rem;
    width: auto;
    height: auto;
    overflow: visible;
    padding: 0.5rem 1rem;
    background: var(--color-accent);
    color: var(--color-on-accent);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    z-index: 10000;
    outline: none;
  }

  /* Navigation */
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--color-nav-bg);
    transition: background 0.3s ease;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-border);
  }

  .nav.scrolled {
    background: var(--color-nav-bg-scrolled);
  }

  .nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
  }

  .nav-logo {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-prompt);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: var(--transition);
  }

  .nav-logo:hover {
    color: var(--color-text);
  }

  .nav-links {
    display: flex;
    list-style: none;
  }

  .nav-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: 12px 22px;
    font-size: 0.9rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    transition: var(--transition);
    display: block;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: 22px;
    right: 22px;
    height: 1px;
    background: var(--color-prompt);
    transform: scaleX(0);
    transition: transform 0.2s ease;
    transform-origin: left;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--color-text);
  }

  .nav-links a:hover::after,
  .nav-links a.active::after {
    transform: scaleX(1);
  }

  /* Theme Toggle */
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 8px;
    display: flex;
    align-items: center;
    transition: var(--transition);
    margin-left: 8px;
  }

  .theme-toggle:hover {
    color: var(--color-text);
  }

  .theme-toggle svg {
    width: 18px;
    height: 18px;
  }

  .theme-toggle .icon-sun  { display: block; }
  .theme-toggle .icon-moon { display: none; }

  :global([data-theme="light"]) .theme-toggle .icon-sun  { display: none; }
  :global([data-theme="light"]) .theme-toggle .icon-moon { display: block; }

  @media (prefers-color-scheme: light) {
    :global(:root:not([data-theme="dark"])) .theme-toggle .icon-sun  { display: none; }
    :global(:root:not([data-theme="dark"])) .theme-toggle .icon-moon { display: block; }
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Nav.astro
```
Expected: file path printed, no error.

---

### Task 2: Create `src/components/Footer.astro`

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
<footer class="footer">
  <div class="footer-bar">
    <span class="footer-mode">NORMAL</span>
    <span class="footer-info">blake sager &middot; principal engineer</span>
    <span class="footer-meta">utf-8 &middot; unix &middot; &copy; 2026</span>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--color-border);
  }

  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    height: 48px;
    background: var(--color-accent);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: rgba(255, 255, 255, 0.9);
  }

  .footer-mode {
    background: rgba(0, 0, 0, 0.25);
    padding: 2px 12px;
    color: var(--color-on-accent);
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .footer-info {
    color: rgba(255, 255, 255, 0.75);
  }

  .footer-meta {
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 768px) {
    .footer-bar {
      padding: 0 20px;
    }

    .footer-info {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Footer.astro
```
Expected: file path printed, no error.

---

### Task 3: Update `src/layouts/Base.astro`

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Replace Base.astro content**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

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
    <Nav />
    <main id="main">
      <slot />
    </main>
    <Footer />
    <script is:inline src="/script.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/layouts/Base.astro
git commit -m "feat: extract Nav and Footer components from Base.astro"
```

---

### Task 4: Create `src/components/Hero.astro`

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
<header class="hero">
  <div class="hero-content">
    <p class="hero-greeting">
      <span class="prompt" aria-hidden="true">$</span> whoami
    </p>
    <h1 class="hero-name">Blake Sager</h1>
    <p class="hero-title">Principal Engineer</p>
    <p class="hero-subtitle">
      Building AI-native devloops @
      <a
        href="https://trello.com"
        target="_blank"
        rel="noopener"
        aria-label="trello.com (opens in new tab)"
        >trello.com</a
      >.<br />
      Building software for my neighbors @
      <a
        href="https://local.tech"
        target="_blank"
        rel="noopener"
        aria-label="local.tech (opens in new tab)"
        >local.tech</a
      >.
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

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 75px;
    padding: 175px 30px 100px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .hero-content {
    flex: 1;
    max-width: 750px;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .hero-greeting {
    font-size: 1rem;
    color: var(--color-prompt);
    font-weight: 400;
    letter-spacing: 0.02em;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .prompt {
    color: var(--color-prompt);
  }

  .hero-name {
    font-size: clamp(2.6rem, 5.5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 25px;
    color: var(--color-text);
    letter-spacing: -0.03em;
  }

  .hero-title {
    font-size: clamp(1rem, 2.2vw, 1.2rem);
    color: var(--color-text-secondary);
    margin-bottom: 17px;
    font-weight: 400;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    color: var(--color-text-tertiary);
    margin-bottom: 50px;
    max-width: 600px;
    line-height: 1.9;
  }

  .hero-subtitle a {
    text-decoration: none;
    transition: var(--transition);
  }

  .hero-subtitle a[href*="trello"] {
    color: var(--color-accent);
  }

  a[href*="local.tech"] {
    color: var(--color-prompt);
  }

  .hero-subtitle a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .hero-cta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* Code Block Visual */
  .hero-visual {
    flex: 1;
    max-width: 575px;
    display: none;
    animation: fadeInUp 0.6s 0.15s ease-out both;
  }

  @media (min-width: 900px) {
    .hero-visual {
      display: block;
    }
  }

  .code-block {
    background: var(--color-bg-secondary);
    border-radius: 0;
    border: 1px solid var(--color-border);
    overflow: hidden;
    box-shadow: 0 24px 48px var(--color-code-shadow),
                inset 0 1px 0 rgba(255,255,255,0.03);
  }

  .code-header {
    display: flex;
    gap: 8px;
    padding: 15px 20px;
    background: var(--color-bg-tertiary);
    border-bottom: 1px solid var(--color-border);
    align-items: center;
  }

  .code-header .prompt {
    color: var(--color-prompt);
    font-size: 0.82rem;
    user-select: none;
  }

  .code-title {
    font-size: 0.82rem;
    color: var(--color-text-tertiary);
    margin-left: 4px;
    letter-spacing: 0.02em;
  }

  .code-block pre {
    padding: 30px;
    margin: 0;
    overflow-x: hidden;
  }

  .code-block code {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--color-text-secondary);
  }

  .code-block .keyword  { color: var(--color-syntax-keyword); }
  .code-block .function { color: var(--color-syntax-function); }
  .code-block .string   { color: var(--color-syntax-string); }

  .code-cursor {
    display: inline-block;
    width: 2px;
    height: 1.1em;
    background: var(--color-accent);
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
    margin-left: 1px;
  }

  @media (max-width: 768px) {
    .hero {
      padding-top: 130px;
      min-height: auto;
    }
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Hero.astro
```
Expected: file path printed, no error.

---

### Task 5: Create `src/components/About.astro`

**Files:**
- Create: `src/components/About.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
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
      <a
        href="https://local.tech"
        target="_blank"
        rel="noopener"
        aria-label="local.tech (opens in new tab)"
        >local.tech</a
      >, I build custom software for small and medium businesses in my
      community, helping local companies ditch bloated, legacy SaaS
      products in favor of tailored solutions that meet their unique
      needs.
    </p>
    <p>
      When I'm not optimizing build times or shipping agentic pipelines,
      you'll find me mentoring engineers, contributing to open source,
      and making indie games.
    </p>
  </div>
</div>

<style>
  .about-text p {
    color: var(--color-text-secondary);
    margin-bottom: 25px;
    font-size: 1rem;
    line-height: 1.9;
  }

  .about-text p:last-child {
    margin-bottom: 0;
  }

  .about-text a {
    color: var(--color-prompt);
    text-decoration: none;
    transition: var(--transition);
  }

  .about-text a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/About.astro
```
Expected: file path printed, no error.

---

### Task 6: Create `src/components/Experience.astro`

**Files:**
- Create: `src/components/Experience.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
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
        performance improvements on one of Atlassian's flagship
        products.
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

<style>
  .timeline {
    position: relative;
    padding-left: 35px;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: var(--color-border);
  }

  .timeline-item {
    position: relative;
    padding-bottom: 50px;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline-marker {
    position: absolute;
    left: -40px;
    top: 11px;
    width: 10px;
    height: 10px;
    background: var(--color-prompt);
    border-radius: 0;
  }

  .timeline-content {
    background: var(--color-bg-secondary);
    padding: 35px 40px;
    border: 1px solid var(--color-border);
    transition: box-shadow 0.2s ease, background 0.2s ease;
  }

  .timeline-content:hover {
    box-shadow: inset 3px 0 0 var(--color-accent);
    background: var(--color-bg-tertiary);
  }

  .timeline-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px 18px;
    margin-bottom: 5px;
  }

  .timeline-header h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .company {
    color: var(--color-accent);
    font-weight: 400;
    font-size: 0.9rem;
  }

  .timeline-date {
    display: block;
    font-size: 0.82rem;
    color: var(--color-text-tertiary);
    margin-bottom: 18px;
    letter-spacing: 0.05em;
  }

  .timeline-content p {
    color: var(--color-text-secondary);
    margin-bottom: 22px;
    font-size: 0.975rem;
    line-height: 1.85;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    padding: 4px 12px;
    background: transparent;
    color: var(--color-text-tertiary);
    border: 1px solid var(--color-border);
    font-size: 0.8rem;
    font-family: var(--font-mono);
    letter-spacing: 0.04em;
    transition: var(--transition);
  }

  .tag:hover {
    color: var(--color-text-secondary);
    border-color: var(--color-text-tertiary);
  }

  @media (max-width: 768px) {
    .timeline {
      padding-left: 25px;
    }

    .timeline-marker {
      left: -30px;
    }
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Experience.astro
```
Expected: file path printed, no error.

---

### Task 7: Create `src/components/Expertise.astro`

**Files:**
- Create: `src/components/Expertise.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
<div class="expertise-grid">
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </div>
    <h3>CI/CD Pipelines</h3>
    <p>
      Designing and optimizing continuous integration and deployment
      pipelines. Building reliable, fast feedback loops that help teams
      ship with confidence.
    </p>
  </div>
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="0" ry="0" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </div>
    <h3>Developer Tooling</h3>
    <p>
      Creating tools that improve developer productivity and experience.
      Building CLIs, automation, and integrations that make engineers'
      lives easier.
    </p>
  </div>
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    </div>
    <h3>Build Systems</h3>
    <p>
      Optimizing build performance and reliability across monorepos and
      polyglot codebases. Experience with caching, parallelization, and
      incremental builds.
    </p>
  </div>
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
    <h3>Cloud Infrastructure</h3>
    <p>
      Building and managing cloud-native applications on AWS, GCP, and
      Azure. Deep expertise in containerization and orchestration.
    </p>
  </div>
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    </div>
    <h3>Deploy Infrastructure</h3>
    <p>
      Building reliable deployment systems with rollback capabilities,
      canary releases, and progressive delivery. Ensuring safe and fast
      paths to production.
    </p>
  </div>
  <div class="expertise-card">
    <div class="expertise-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
    <h3>Technical Leadership</h3>
    <p>
      Mentoring engineers, driving architectural decisions, and
      fostering a culture of technical excellence and continuous
      improvement.
    </p>
  </div>
</div>

<style>
  .expertise-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(375px, 1fr));
    gap: 1px;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }

  .expertise-card {
    padding: 45px;
    background: var(--color-bg-secondary);
    transition: box-shadow 0.2s ease, background 0.2s ease;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .expertise-card:hover {
    box-shadow: inset 3px 0 0 var(--color-accent);
    background: var(--color-bg-tertiary);
  }

  .expertise-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .expertise-icon {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    color: var(--color-prompt);
  }

  .expertise-icon svg {
    width: 28px;
    height: 28px;
  }

  .expertise-card h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--color-text);
  }

  .expertise-card p {
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    line-height: 1.85;
  }

  @media (max-width: 768px) {
    .expertise-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Expertise.astro
```
Expected: file path printed, no error.

---

### Task 8: Create `src/components/Contact.astro`

**Files:**
- Create: `src/components/Contact.astro`

- [ ] **Step 1: Create the file**

```astro
---
---
<p class="contact-intro">
  Interested in discussing developer experience, CI/CD, or dev tooling?
  I'd love to hear from you.
</p>
<div class="contact-links">
  <a href="mailto:blakemsager@gmail.com" class="contact-link">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
    <span>Email</span>
  </a>
  <a href="https://www.linkedin.com/in/adfontes/" class="contact-link" target="_blank" rel="noopener" aria-label="LinkedIn (opens in new tab)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
    <span>LinkedIn</span>
  </a>
  <a href="https://github.com/chasingSublimity" class="contact-link" target="_blank" rel="noopener" aria-label="GitHub (opens in new tab)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
    <span>GitHub</span>
  </a>
  <a href="https://bsky.app/profile/adfontes.bsky.social" class="contact-link" target="_blank" rel="noopener" aria-label="Bluesky (opens in new tab)">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
    <span>Bluesky</span>
  </a>
</div>

<style>
  .contact-intro {
    color: var(--color-text-secondary);
    max-width: 700px;
    margin-bottom: 50px;
    font-size: 1rem;
    line-height: 1.85;
  }

  .contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px 30px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    font-family: var(--font-mono);
    transition: var(--transition);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .contact-link:hover {
    box-shadow: inset 3px 0 0 var(--color-accent);
    color: var(--color-text);
    background: var(--color-bg-tertiary);
  }

  .contact-link.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .contact-link svg {
    width: 22px;
    height: 22px;
    color: var(--color-prompt);
    flex-shrink: 0;
  }
</style>
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/Contact.astro
```
Expected: file path printed, no error.

---

### Task 9: Update `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace index.astro content**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import About from '../components/About.astro';
import Experience from '../components/Experience.astro';
import Expertise from '../components/Expertise.astro';
import Contact from '../components/Contact.astro';
---
<Base>
  <Hero />

  <section id="about" class="section about">
    <div class="container">
      <h2 class="section-title">
        <a href="#about" aria-label="About">cat about.md</a>
      </h2>
      <About />
    </div>
  </section>

  <section id="experience" class="section experience">
    <div class="container">
      <h2 class="section-title">
        <a href="#experience" aria-label="Experience">git log --author=blake</a>
      </h2>
      <Experience />
    </div>
  </section>

  <section id="expertise" class="section expertise">
    <div class="container">
      <h2 class="section-title">
        <a href="#expertise" aria-label="Expertise">ls expertise/</a>
      </h2>
      <Expertise />
    </div>
  </section>

  <section id="contact" class="section contact">
    <div class="container">
      <h2 class="section-title">
        <a href="#contact" aria-label="Contact">contact --list</a>
      </h2>
      <Contact />
    </div>
  </section>
</Base>

<style>
  .about    { background: var(--color-bg-secondary); }
  .expertise { background: var(--color-bg-secondary); }
  .contact  { background: var(--color-bg); }
</style>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro src/components/About.astro src/components/Experience.astro src/components/Expertise.astro src/components/Contact.astro src/pages/index.astro
git commit -m "feat: extract home page sections into scoped Astro components"
```

---

### Task 10: Update `src/layouts/Post.astro`

**Files:**
- Modify: `src/layouts/Post.astro`

Note: `.post-content` descendants target Markdown-rendered HTML which comes through `<slot />` and won't carry the component's scope attribute. Use `.post-content :global(tag)` for those selectors.

- [ ] **Step 1: Replace Post.astro content**

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

<style>
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

  /* Prose styles target slot/markdown content — use :global() */
  .post-content :global(p) {
    color: var(--color-text-secondary);
    margin-bottom: 25px;
    font-size: 0.975rem;
    line-height: 1.85;
  }

  .post-content :global(h2) {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 50px 0 20px;
    padding-left: 16px;
    border-left: 2px solid var(--color-prompt);
  }

  .post-content :global(h3) {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 35px 0 15px;
  }

  .post-content :global(a) {
    color: var(--color-prompt);
    text-decoration: none;
    transition: var(--transition);
  }

  .post-content :global(a:hover) {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .post-content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--color-syntax-string);
    background: var(--color-bg-tertiary);
    padding: 2px 6px;
    border: 1px solid var(--color-border);
  }

  .post-content :global(pre) {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-left: 2px solid var(--color-prompt);
    padding: 25px 30px;
    overflow-x: auto;
    margin: 30px 0;
  }

  .post-content :global(pre code) {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .post-content :global(blockquote) {
    border-left: 2px solid var(--color-accent);
    padding: 15px 25px;
    margin: 30px 0;
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    color: var(--color-text-secondary);
    padding-left: 25px;
    margin-bottom: 25px;
    font-size: 0.975rem;
    line-height: 1.85;
  }

  .post-content :global(li) {
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
    .post-container {
      padding-top: 120px;
    }
  }
</style>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Post.astro
git commit -m "feat: move blog post prose styles into Post.astro"
```

---

### Task 11: Update `src/pages/blog/index.astro`

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace blog/index.astro content**

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

<style>
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

  @media (max-width: 768px) {
    .blog-post-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
</style>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: move blog listing styles into blog/index.astro"
```

---

### Task 12: Slim `src/styles/global.css`

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace global.css with only truly global rules**

```css
/* Reset and Base */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --color-bg: #0d0d0d;
    --color-bg-secondary: #111111;
    --color-bg-tertiary: #181818;
    --color-text: #cccccc;
    --color-text-secondary: #808080;
    --color-text-tertiary: #444444;
    --color-accent: #0079bf;
    --color-accent-light: #298fca;
    --color-accent-glow: rgba(0, 121, 191, 0.15);
    --color-prompt: #3dc9a0;
    --color-border: #222222;
    --color-nav-bg: rgba(13, 13, 13, 0.92);
    --color-nav-bg-scrolled: rgba(13, 13, 13, 0.97);
    --color-on-accent: #fff;
    --color-syntax-keyword: #c678dd;
    --color-syntax-function: #61afef;
    --color-syntax-string: #98c379;
    --color-code-shadow: rgba(0, 0, 0, 0.5);
    --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', monospace;
    --transition: all 0.2s ease;
}

@media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) {
        --color-bg: #f5f5f5;
        --color-bg-secondary: #ebebeb;
        --color-bg-tertiary: #e0e0e0;
        --color-text: #1a1a1a;
        --color-text-secondary: #555555;
        --color-text-tertiary: #888888;
        --color-accent: #0079bf;
        --color-accent-light: #298fca;
        --color-accent-glow: rgba(0, 121, 191, 0.12);
        --color-prompt: #1a8a6a;
        --color-border: #d0d0d0;
        --color-nav-bg: rgba(245, 245, 245, 0.92);
        --color-nav-bg-scrolled: rgba(245, 245, 245, 0.97);
        --color-code-shadow: rgba(0, 0, 0, 0.12);
        --color-syntax-keyword: #a626a4;
        --color-syntax-function: #4078f2;
        --color-syntax-string: #50a14f;
    }
}

[data-theme="light"] {
    --color-bg: #f5f5f5;
    --color-bg-secondary: #ebebeb;
    --color-bg-tertiary: #e0e0e0;
    --color-text: #1a1a1a;
    --color-text-secondary: #555555;
    --color-text-tertiary: #888888;
    --color-accent: #0079bf;
    --color-accent-light: #298fca;
    --color-accent-glow: rgba(0, 121, 191, 0.12);
    --color-prompt: #1a8a6a;
    --color-border: #d0d0d0;
    --color-nav-bg: rgba(245, 245, 245, 0.92);
    --color-nav-bg-scrolled: rgba(245, 245, 245, 0.97);
    --color-code-shadow: rgba(0, 0, 0, 0.12);
    --color-syntax-keyword: #a626a4;
    --color-syntax-function: #4078f2;
    --color-syntax-string: #50a14f;
}

html {
    font-size: 20px;
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-mono);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
}

/* ── Shared Section Layout ──────────────────────────────── */

.section {
    padding: 120px 0;
}

.section-title {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 70px;
    font-family: var(--font-mono);
    color: var(--color-text-secondary);
    letter-spacing: 0.02em;
    display: block;
    width: fit-content;
    border: 1px solid transparent;
    border-left: 2px solid var(--color-prompt);
    line-height: 1.4;
    transition: border-color 0.15s ease, background-color 0.15s ease;
}

.section-title a {
    display: block;
    padding: 9px 16px 9px 23px;
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
}

.section-title:has(a:hover) a {
    color: var(--color-text);
}

.section-title a::before {
    content: '$ ';
    color: var(--color-prompt);
}

.section-title:has(a:hover) {
    border-color: var(--color-border);
    border-left-color: var(--color-accent);
    background: var(--color-bg-tertiary);
}

/* ── Buttons ────────────────────────────────────────────── */

.btn {
    display: inline-flex;
    align-items: center;
    padding: 15px 30px;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: var(--transition);
    cursor: pointer;
    border: none;
    font-family: var(--font-mono);
    letter-spacing: 0.06em;
    text-transform: lowercase;
}

.btn-primary {
    background: var(--color-accent);
    color: var(--color-on-accent);
    border: 1px solid var(--color-accent);
}

.btn-primary:hover {
    background: var(--color-accent-light);
    box-shadow: 0 0 25px var(--color-accent-glow);
}

.btn-secondary {
    background: transparent;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
}

.btn-secondary:hover {
    color: var(--color-text);
    border-color: var(--color-text-tertiary);
    background: var(--color-bg-tertiary);
}

/* ── Utilities ──────────────────────────────────────────── */

.highlight {
    color: var(--color-accent);
    font-weight: 500;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* ── Animations ─────────────────────────────────────────── */

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(25px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes blink {
    50% { opacity: 0; }
}

/* ── Responsive ─────────────────────────────────────────── */

@media (max-width: 768px) {
    .section {
        padding: 80px 0;
    }
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```
Expected: build completes with no errors.

- [ ] **Step 3: Verify line count**

```bash
wc -l src/styles/global.css
```
Expected: ~115 lines or fewer.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "chore: slim global.css to reset, tokens, and shared layout primitives"
```
