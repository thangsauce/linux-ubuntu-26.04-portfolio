# Linux Ubuntu 26.04 Portfolio

A portfolio website that recreates a Linux desktop experience, letting visitors explore your work through app windows, dock interactions, and Ubuntu-inspired UI.

![LinuxLongThumbnailGif](https://github.com/user-attachments/assets/4204f7da-10b0-4785-9c3c-e614d35d7f06)

Live site: [https://thangsauce.github.io/linux-ubuntu-26.04-portfolio](https://thangsauce.github.io/linux-ubuntu-26.04-portfolio)

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
