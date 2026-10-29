# CADalog redesign — QA handoff

Local artifact: `/workspace/shared/cadalog-redesign-20261029`
Status: implementation and non-browser checks completed; browser QA required before publication.

## Verified
- `node --check app.js`, `directory.js`, `locales.js`, `data.js`: passed.
- `node --test tests/*.test.cjs`: 20 passed, 0 failed after review fixes. Rerun after edits.
- All 12 original records and source URLs unchanged (`data.js` byte-identical to supplied copy).
- HTML: unique IDs, all explicit label targets present, aria references present (profile-title is generated), all script files present.
- Calculated contrast: primary text 14.56:1, secondary text 5.77:1 on the canvas / 6.03:1 on white, action text 6.96:1, white primary-button text 7.28:1, selected-control text 8.06:1, field boundaries 3.22:1.
- RU/EN key completeness; complete Russian descriptions for every company; stable canonical filter values; explicit English state round-trips through profile URLs; Russian search terms match.
- Translated format searches (including «Редактируемый CAD», «Архитектурные планы», «CAD со слоями») and missing-Russian-record fallback are covered by regression tests.
- Search/filter combinations, reverse order, zero results, saved filtering, malformed storage, suggestion validation and encoded GitHub issue URLs tested with Node.

## Not yet verified in a real browser
No screenshots were produced. Local Chromium launch failed because Unix sockets are prohibited by the sandbox. The approved escalation attempt failed at the infrastructure layer (`bwrap: Can't create file at /home/agent/.codex/sessions: Read-only file system`); no attempt was made to read or alter that denied path. The CUA browser cannot open file URLs and cannot reach the isolated local HTTP server. This is a rendering-environment blocker, not a passed visual check.

## Browser checks to close before publication
Test root and `?lang=en` at 1440, 768, 620, 530, 480, 390 and 320 CSS px, plus 200% and 400% zoom.
- Header navigation deliberately reflows to a second row at 620px and below, covering the 461–530px gap found in review. Confirm in the browser.
- No horizontal document overflow, collisions or truncated important labels. Russian profile facts need particular attention; terms have 112–120px allocated.
- Font finishes loading and both Cyrillic/Latin are readable. Fallback fonts should remain usable when Google Fonts is blocked.
- Search in both languages, service + discipline combination, A–Z/Z–A, clear filters.
- Save/unsave from a row and from each language's profile; reload persistence; shared saved count after switching language.
- Saved-empty state, filtered saved-empty state, remove the final saved company, focus restoration.
- Search → profile → back preserves filters; EN↔RU preserves profile/query; unknown `?company=missing` has a working localized return link.
- Keyboard tab order, skip link, native selects, bookmark buttons, source links, suggestion disclosure and validation errors.
- Suggestion: blank name, invalid/FTP URL, valid URL; intercept the navigation before GitHub submission. It should only prepare an issue, never submit it.
- No-JavaScript provider-link fallback; blocked/corrupt localStorage; cross-tab storage events.
- Browser console errors and missing resources; direct links under `/CADalog/` (not only a domain root).
- Main/profile metadata and document language switch appropriately. No English UI leakage in the Russian version beyond company names, file formats, CAD/BIM and GitHub.

## Shipping files
`index.html`, `styles.css`, `app.js`, `directory.js`, `locales.js`, `data.js`, `favicon.svg`.
No packages, bundler, paid integration or runtime server is required.

## Repository maintenance
Preserve the actual repository's deployment/workflow files. The supplied local snapshot had `.github/workflows/design-audit.yml` but no `deploy.yml`; this work did not change workflows. It is not a complete Git clone, and pushing or replacing the remote tree from this directory would be inappropriate.
