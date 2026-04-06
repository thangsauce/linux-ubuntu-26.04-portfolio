# Linux Ubuntu 26.04 Portfolio

An interactive portfolio experience that looks and feels like a Linux desktop environment.  
Instead of a typical scrolling resume page, this project lets visitors explore your profile through desktop apps, windows, and system UI inspired by Ubuntu 26.04 (Yaru style).

Live site: [https://thangsauce.github.io/linux-ubuntu-26.04-portfolio](https://thangsauce.github.io/linux-ubuntu-26.04-portfolio)

## Description

This project is a portfolio-as-an-OS concept built with Next.js and TypeScript.  
Visitors can open apps, switch between windows, use the dock, browse content sections, and interact with a simulated desktop workflow that showcases projects, skills, and personality in a memorable way.

## Highlights

- Ubuntu-inspired desktop interface and theme
- App-style navigation (About, Projects, Resume, Terminal, Settings, Trash, and more)
- Window lifecycle controls: open, focus, minimize, close
- Context menus and dock interactions
- Mobile-friendly behavior improvements
- Static export for GitHub Pages deployment

## Tech Stack

- [Next.js](https://nextjs.org/) (Pages Router, static export)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/) for package management

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

This generates a static export in `out/` for production hosting.

## Deployment

The project is configured for GitHub Pages via GitHub Actions.

1. Push changes to `main`
2. GitHub Actions builds and deploys automatically
3. Pages serves the site at the live URL above

## Project Structure

```text
components/      Reusable UI, app windows, desktop, navbar, status controls
pages/           Next.js routes
public/          Icons, wallpapers, theme assets, favicon
styles/          Global styles and Tailwind layers
apps.config.ts   App registry and desktop app metadata
```

## Customizing Apps

To add or update desktop apps:

1. Edit app entries in `apps.config.ts`
2. Add or update app UI in `components/apps/`
3. Wire icons/assets in `public/themes/` or `public/images/`
