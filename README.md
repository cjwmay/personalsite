# May’s portfolio

The current watercolor portfolio is in `portfolio-watercolor/dist/`. It includes the animated portrait, petals, bichon companion, resume, and light/dark artwork. No build or package installation is required.

## Deploy to Vercel

Import this repository, use the `main` production branch, and leave Root Directory at the repository root. Choose the Other framework preset. The root `vercel.json` skips the build and publishes `portfolio-watercolor/dist/`.

If an existing Vercel project points to `portfolio-notebook/dist`, change its Root Directory back to the repository root and redeploy. Clear any dashboard output-directory override that conflicts with `vercel.json`.

The earlier notebook version remains in `portfolio-notebook/`.
