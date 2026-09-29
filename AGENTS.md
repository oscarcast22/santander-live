# Repository Guidelines

## Project Structure & Module Organization

This repository builds the Santander Live educational website with Astro and strict TypeScript. Routes live in `src/pages/`, including the shared program route `[nivel]/[slug].astro`. Reusable UI belongs in `src/components/`, page shells in `src/layouts/`, and shared design tokens in `src/styles/global.css`.

Program records are Markdown files in `src/content/programas/`; shared educational-model content lives in `src/content/modelos/`. Their schemas are defined in `src/content.config.ts`. Store optimized image sources in `src/assets/` or program images in `src/content/programas/imagenes/`. Use `public/` for files served unchanged. The desktop design reference is `reference/mockup-escritorio.pdf`.

## Build, Test, and Development Commands

Use Node.js 22.12+ and npm 9.6.5+.

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start development at `http://localhost:4321`, accessible on the local network.
- `npm run check`: run Astro and TypeScript diagnostics.
- `npm run build`: generate the production site in `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions

Use two-space indentation and follow surrounding quote and formatting conventions. Keep TypeScript strict and type component props explicitly. Name Astro components in PascalCase, such as `ProgramTabs.astro`; use lowercase kebab-case for content filenames and slugs, such as `maestria-finanzas.md`.

Reuse global CSS tokens and existing components such as `BrandLogo` and `SiteIcon`. Keep Spanish site copy in content collections where applicable and satisfy the collection schemas. No dedicated formatter or lint script is configured.

## Testing Guidelines

There is no automated test framework or coverage threshold configured. Run `npm run check` and `npm run build` before submitting changes. For UI changes, inspect desktop and mobile layouts, navigation menus, accordions, program tabs, and keyboard interaction. Compare desktop changes with the reference PDF.

## Commit & Pull Request Guidelines

History uses Conventional Commit prefixes with Spanish descriptions, for example `feat(programas): renderizar overview y perfil de egreso como listas semánticas`. Use `feat`, `refactor`, or `docs`, with a relevant scope when useful.

Pull requests should describe the affected routes and behavior, report validation commands, link relevant issues when available, and include desktop/mobile screenshots for visual changes. Exclude generated `dist/`, `.astro/`, and dependency files from commits.
