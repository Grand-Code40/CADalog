# CADalog

An independent, editorial directory of specialists who convert scans, sketches, flat PDFs, and legacy drawings into editable CAD files. Designed as a lightweight, zero-cost static website inspired by the clarity of professional architectural directories.

## Features

- Responsive, accessible landing page with original line-drawing illustrations.
- Search by company or specialty, filter by service and discipline, sort A–Z / Z–A.
- Individual company profiles (`?company=slug`) with direct source and website links.
- Saved companies (stored only in the visitor's browser).
- Listing suggestion form that opens a pre-filled GitHub issue. A GitHub account is required to finish a submission.
- No frameworks, cookies, analytics, third-party fonts, or runtime back end.
- 12 real, publicly listed services; descriptions paraphrase each provider's own linked service page. **Inclusion is not verification or endorsement.**

## Run locally

You can open `index.html` directly. For reliable navigation and testing, serve the folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Publish for free with GitHub Pages

1. In GitHub, open **Settings → Pages** for this repository.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. The `.github/workflows/deploy.yml` workflow will deploy the static files on each push to `main`. If this is the first time enabling Pages, use the **Actions** tab to re-run the workflow or make a new commit.
4. Expected public address: `https://grand-code40.github.io/CADalog/` after GitHub reports deployment success.

GitHub Pages must be enabled once by an account administrator; committing a workflow alone does not always enable hosting.

## Update companies

Edit `data.js`. Add or remove objects from `window.CADALOG_COMPANIES`. Each entry needs a unique `slug`, truthful service descriptions, and a working `source` URL. Do not invent testimonials, ratings, locations or unsupported qualifications.

## Feedback and submissions

The suggestion form uses GitHub Issues as a free moderation inbox; visitors need a GitHub account. To accept forms from users without GitHub, replace that handler in `app.js` with a separately configured form service (Tally, Formspree, etc.). Do not publish a personal email address without permission.

## Technical notes

- All URLs are relative, so GitHub Pages' `/CADalog/` base path works.
- All illustrations are original decorative SVGs, not provider portfolio images.
- Profile URLs use query parameters in this MVP; static, per-company HTML pages would improve independent indexing once the dataset expands.
- Content last assembled: October 2026. Provider facts can change; check directly before contracting.
