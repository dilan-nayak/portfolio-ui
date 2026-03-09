# Dilan Nayak Portfolio

A frontend-only, JSON-driven developer portfolio built with React + TypeScript + Vite.

This project is designed so content updates are easy and fast: you can update most text, links, status, skills, learning courses, projects, and contact details from one JSON file without touching component code.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Current Features

- Dark theme default on reload
- JSON-based content management from `public/portfolio-content.json`
- Hero section with social links and resume button
- About section with multi-image gallery
- Skills section:
  - Technology stack categories
  - Learning tabs (overview / in-progress / completed)
  - `More` / `Show Less` behavior for in-progress and completed
- Work experience section with company switcher and role timeline
- Status section (JSON-controlled active/inactive cards)
- Projects grid
- Contact form integrated with EmailJS
- Footer message and quick info

## Content Management (Main File)

All primary editable content lives in:

- `public/portfolio-content.json`

You should update this file for:

- Header navigation labels/order
- Hero text/social links
- About paragraphs and images
- Skills and learning courses
- Experience companies and roles
- Projects
- Contact info + EmailJS keys
- Status card state and order

## Learning Section Rules (Implemented)

- Overview tab (first icon tab) shows up to 4 selected courses.
- Use `featuredInOverview: true` in a course object to include it in overview.
- `In Progress` and `Completed` tabs:
  - show first 4 cards by default,
  - show `More` button only if items > 4,
  - after clicking `More`, scrolling is enabled,
  - `Show Less` returns to first 4 view.

## Project Structure

```text
src/
  components/
  types/
  App.tsx
  main.tsx
public/
  images/
  resume/
  portfolio-content.json
```

## Run Locally

### 1) Clone

```bash
git clone <your-repo-url>
cd developer-portfolio
```

### 2) Install

Use npm (recommended for this repo because `package-lock.json` exists):

```bash
npm install
```

### 3) Start dev server

```bash
npm run dev
```

Open:

- `http://localhost:5173`

### 4) Production build check

```bash
npm run build
```

## If Someone Pulls This Repo

After `git pull`, always run:

```bash
npm install
npm run dev
```

If dependency versions changed, run:

```bash
npm ci
```

## Git Safety Before Push

This repo now ignores:

- `node_modules/`
- `dist/`
- `.env*`
- `.vite*`
- logs and editor/system files

So only source files/configs/content should be pushed.

Recommended pre-push checks:

```bash
npm run build
```

## Deployment and Custom Domain

Best flow: GitHub + Vercel.

1. Push this repo to GitHub.
2. Import repo into Vercel.
3. Framework: Vite (auto-detected).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add your custom domain in Vercel project settings.
7. Add DNS records from Vercel in your domain provider.

After that, every push to your main branch auto-deploys.

## Resume File

Current resume path used by UI:

- `public/resume/dilan-nayak-cv.pdf`

Replace this file to update CV while keeping the same path.

## Contact / EmailJS

Email form configuration is in:

- `public/portfolio-content.json` -> `contact.form.emailJs`

Use your valid EmailJS:

- `serviceId`
- `templateId`
- `publicKey`

## Future Plan / TODO

- Revisit LeetCode and Dev.to social icon setup with stable custom icon assets
- Continue UI polish for section spacing and card density
- Add more portfolio projects gradually
- Keep improving work experience visual style
- Optional: add analytics and basic SEO enhancements

## Notes

- This is a static frontend project; backend is not required.
- Keep image assets under `public/images` and reference them in JSON.
- For stable dependency installs, prefer one package manager (npm for this repo).
