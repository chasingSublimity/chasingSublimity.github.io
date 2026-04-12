# Blake Sager | Personal Site

A high-performance, terminal-inspired personal website and blog engine built with [Astro](https://astro.build/).

## 🚀 Overview

This project serves as a professional portfolio and technical blog, featuring a clean, command-line interface (CLI) aesthetic. It showcases the expertise of Blake Sager, a Principal Engineer specializing in Developer Experience, CI/CD, and Build Systems.

## ✨ Features

- **Terminal Aesthetic**: A sleek, developer-centric design using JetBrains Mono and terminal-inspired UI elements.
- **Content Driven**: Powered by Astro Content Collections for easy Markdown-based blogging.

- **Dark/Light Mode**: Seamless theme switching with persistent preference via `localStorage`.
- **Responsive Design**: Fully optimized for all devices, from mobile to desktop.
- **Automated Deployment**: Ready-to-use GitHub Actions workflow for seamless deployment.

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: CSS (Global styles)
- **Font**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Deployment**: GitHub Pages via GitHub Actions

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chasingSublimity/chasingSublimity.git
   ```

2. Navigate to the project directory:
   ```bash
   cd chasingSublimity
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the local development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321/`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📂 Project Structure

- `src/pages/`: Main application routes and dynamic blog pages.
- `src/content/`: Markdown blog posts and content configuration.
- `src/layouts/`: Reusable page layouts.
- `src/styles/`: Global CSS and theme definitions.
- `public/`: Static assets.
- `docs/`: Technical design documents and plans.

## 🤖 Deployment

The project is configured to deploy automatically via GitHub Actions whenever changes are pushed to the main branch.

---

*Built with ❤️ by Blake Sager.*
