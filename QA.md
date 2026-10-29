# CADalog — local integration QA, 29 October 2026

Artifact: `/workspace/shared/cadalog-navigation-oct29`.
Base: the supplied `/workspace/shared/cadalog-refine-oct29` snapshot. Search logic/tests integrated from `/workspace/shared/cadalog-search-oct29`.
Status: local implementation complete; unit/static and DOM checks pass. Not published. Real-browser visual QA remains open.

## Verified
- `node --check` for the four runtime JS files and all five test runners/files: passed.
- `node --test tests/*.test.cjs`: **42 passed, 0 failed**.
- `CADALOG_DOM_MODULE=/tmp/cadalog-dom-runtime/node_modules/happy-dom node --disallow-code-generation-from-strings --frozen-intrinsics --test tests/dom-check.cjs`: **15 passed, 0 failed**. Happy DOM 21.0.4 is installed only in a temporary dev directory, not added to the site. Node prints its experimental `frozen-intrinsics` warning.
- Six UI regression checks failed for the expected missing behavior before UI changes, then passed.
- Full neutral 1px card borders, 2px nearly square corners, no shadow added (CSS/static assertions; not a screenshot claim).
- Removed the requested source-disclaimer wording and visible multi-tag explanatory sentence in both languages.
- Dedicated `?page=sources` state: title, principles and exactly twelve service-source links, equal to the existing `data.js` values. Header/footer links work from home, all twelve profiles, missing profiles and the sources state. This checks URL integrity, not a new external uptime crawl.
- RU/EN, root and `/CADalog/` URL bases; profile → sources → directory round-trip preserves service, thematic tag and language; source-state language switching remains on sources. More than 250 visible internal links across all profiles are validated for route/anchor visibility.
- Four thematic checkboxes; no format-tag links in cards/profiles and no sort control. Formats remain in facts/search. Obsolete format-tag/sort URLs do not silently restrict or reverse results.
- Actual DOM input/click/change events cover refined search, empty/reset, thematic card-tag filtering and focus handoff.
- Suggestion template edits/copy succeed in the DOM engine’s clipboard. Missing/rejected clipboard cases select text for manual copy. Empty draft disables copy. All messages explicitly avoid claiming submission; no email or delivery endpoint invented.
- All translation hooks resolve; source/provider links remain HTTPS. Original company/source/logo data and favicon are byte-identical to the supplied baseline.
- `tests/browser-check.cjs` updated for thematic-only filters, dedicated sources navigation, old URLs and manual-copy fallback; syntax passes.

## Not established / blocked
- Chromium launch still fails before page creation with `socket() failed: Operation not permitted`. No browser render or screenshot from this copy is claimed. The ordinary escalation environment also failed to start (`bwrap` read-only setup error); no security workaround was attempted.
- Happy DOM has no layout engine: horizontal overflow, rendered spacing/fonts/logos, actual screen-reader behavior, browser Back/Forward and native OS clipboard permission behavior remain browser-QA items.
- No claim of a new external service-source uptime/content crawl; existing provenance is retained in `SOURCES.md`.
- Impeccable 4.8.0 SKILL, operate and craft-floor references were read, plus PRODUCT/DESIGN. Its local launcher `scripts/impeccable` is absent; context direct-reading fallback was used. No automated detector or reviewer verdict is claimed.

## Browser verification still required
Serve locally, then run `CADALOG_URL=http://localhost:8000/ node tests/browser-check.cjs` in an environment that permits Chromium. Review RU/EN at 1440, 1100, 768, 620, 390 and 320px. Repeat under `/CADalog/`.

Visually inspect full card frames/insets, the real dark Praxis identity band, long Russian labels, footer/source-page wrapping, editable suggestion template, and keyboard focus. Exercise all profile/source/back/language paths, browser history, 200%/400% zoom, blocked fonts/images, and actual clipboard success/failure. Screenshots go to `qa/screenshots` and require human/visual review.

## Changed files versus supplied refinement
Production: `app.js`, `directory.js`, `index.html`, `locales.js`, `styles.css`.
Tests: `tests/browser-check.cjs`, `tests/directory.test.cjs`, `tests/search.test.cjs` (new), `tests/navigation.test.cjs` (new), `tests/dom-check.cjs` (new).
Documentation: `README.md`, `PRODUCT.md`, `DESIGN.md`, `QA.md`.

No changes to `data.js`, `favicon.svg`, `.github`, SOURCES/RESEARCH or installed skill references. No repository push, deployment or external publication.
