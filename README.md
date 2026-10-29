# CADalog

A concise, independent directory of businesses converting paper drawings, scanned images, PDFs and sketches into editable CAD files.

## Design and product

The site uses a restrained, content-first editorial direction inspired by print trade directories and architect practice indices, not a SaaS landing page. No generated illustration or fabricated provider imagery is used. Read `PRODUCT.md` for product facts and `DESIGN.md` for visual rules. The official [Impeccable](https://github.com/pbakaus/impeccable) design skill is installed at `.agents/skills/impeccable/` for follow-up work.

## Features

- Search over provider name, description, services, formats and specialization.
- Filter by service and discipline, sort alphabetically.
- Save entries locally; view only saved entries.
- Dedicated profile view linked to provider's original public source and company website.
- New listing suggestions via prefilled GitHub Issues (GitHub sign-in required).
- Keyboard-friendly controls, meaningful focus states, mobile layout, reduced-motion support.
- No framework, cookies, analytics or paid services.

## Run locally

Serve the folder with any local static server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. All pages are rendered from `index.html`, `styles.css`, `app.js` and `data.js`. Profiles use `?company=<slug>` for compatibility with free static hosting.

## Publish for free with GitHub Pages

In repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**. The `Publish CADalog` workflow is already present at `.github/workflows/deploy.yml` and publishes from `main`. This setting is a one-time manual action if Pages is not yet enabled. URL after a successful deploy: `https://grand-code40.github.io/CADalog/`.

## Edit or add companies

All records live in `data.js`. A record has a unique `slug`, display `name`, `focus`, `services`, `formats`, short `line`, longer `detail`, public `website`, and primary published `source`. Some preexisting fields `art` and `tone` are retained only for data compatibility and **no longer rendered**.

Entries are starting points based on provider service pages, not independent audits or recommendations. Verify external links and facts before treating the directory as an authoritative resource. The suggestion form opens a GitHub issue and does not pretend to collect submissions server-side.
