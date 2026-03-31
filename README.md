# Ubuntu 26.04 Portfolio

A personal portfolio website themed after Ubuntu 26.04, built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

Interact with a fully simulated Ubuntu desktop — open apps, use the terminal, browse files, and more.

## Features

- Ubuntu 26.04 desktop UI (Yaru theme)
- Simulated apps: Firefox, Terminal, VS Code, Calculator, YouTube Music, Settings, Trash
- Desktop shortcuts and taskbar
- About Me section
- GitHub and LinkedIn quick links

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
components/     # UI components (apps, screen, taskbar, etc.)
pages/          # Next.js pages
public/         # Static assets and icons (Yaru theme)
apps.config.ts  # App registry and configuration
styles/         # Global styles
```

## Adding or Editing Apps

Apps are registered in `apps.config.ts`. Each app entry defines its icon, title, and the component that renders its window. Component files live in `components/apps/`.

## Build & Deploy

```bash
# Production build
pnpm build

# Start production server
pnpm start
```
