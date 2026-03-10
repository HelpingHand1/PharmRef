# Use PharmRef At Work

## Goal

Use PharmRef on your phone at work without bringing a laptop or running code on the work network.

## Recommended Path

Host the app as a static site, install it to your phone as a PWA, and let it cache for offline/reliable access.

This repo now includes:

- GitHub Pages deployment workflow at `.github/workflows/deploy-pages.yml`
- PWA icons in `public/`
- iPhone home-screen metadata in `index.html`

## One-Time Setup From Home

1. Push the repo to `main`.
2. In GitHub, open:
   `Settings` -> `Pages`
3. Set source to `GitHub Actions`.
4. Wait for the `Deploy Pages` workflow to finish.
5. Open:
   `https://helpinghand1.github.io/PharmRef/`
6. On your phone:
   - iPhone: Share -> `Add to Home Screen`
   - Android: browser menu -> `Install app` / `Add to Home screen`
7. Open the installed app once on a normal connection so the service worker can cache the shell and content.

## Before First Real Work Shift

- Open the installed app on your phone.
- Visit the disease areas and monographs you expect to use most often.
- Confirm search, calculators, bookmarks, and patient-context features work as expected.
- Turn on airplane mode once and confirm the app still opens.

## Important Constraint

PharmRef stores state locally in the browser on the device. That is good for offline use, but it means you should avoid entering patient-identifiable information on a personal device or any non-approved system.

Safe use:

- weights
- serum creatinine
- dialysis status
- pregnancy flag
- non-identifying allergy notes

Avoid:

- patient names
- MRNs
- DOBs
- room numbers
- anything that would make the device a PHI store

## Release Command

Before pushing a work-use build:

```bash
npm run release:check
```

## If GitHub Pages Is Not Acceptable

The app is a static Vite build, so `dist/` can also be deployed to any static host that serves SPA assets over HTTPS.
