# CADalog — QA handoff

Artifact: `/workspace/shared/cadalog-refine-oct29`
Status: implemented locally; non-browser checks passed. Not published. Final-site browser QA remains open.

## Verified 29 October 2026
- `node --check` for app.js, directory.js, locales.js, data.js: passed.
- `node --test tests/*.test.cjs`: **14 passed, 0 failed**. The new tag/state tests first failed against the old implementation, then passed after changes.
- Twelve unique companies retained, with original names/service source URLs and complete RU descriptions.
- Multiple tags use AND; combine with service/search; format tags exclude incompatible entries. Unknown/duplicate tags are removed. Old saved/discipline URLs do not restrict results.
- Profile/directory URL state preserves tags/search/English; default is Russian. Translated formats/tags searchable in both interface languages; missing-translation fallback uses original text.
- RU/EN translation keys and static translation hooks complete.
- HTML has 24 unique IDs, valid explicit label targets, valid aria reference targets (profile-title generated), existing local scripts/styles.
- No live GitHub links, issue submission, bookmark controls, saved view or localStorage code remains.
- Refined-token contrasts: ink/white 15.52:1, supporting ink/white 6.79:1, white/accent 7.14:1, selected text 9.79:1, control boundaries/white 3.69:1; supporting ink/hover 6.12:1.
- Ten real official identity assets confirmed decoded: seven logos on official pages, three site icons by direct image navigation. Details and URLs in SOURCES.md. No third-party project imagery copied.
- All twelve service source pages accessed through retrieval or browser. Morava succeeded in browser after retrieval failed. Global CAD Services source now displays DraftPoint CAD; visible caution added without assuming identity.

## Blocked / not established
- No final-site screenshot or visual pass. Local Chromium exits with `socket() failed: Operation not permitted`. The cloud browser permits only HTTP(S), rejects local/data URLs, and cannot reach the isolated local server. No publication/tunnel or security workaround was attempted.
- The official assets load on their own pages/URLs; cross-origin loading inside the actual CADalog layout remains unverified. Hotlink restrictions or future asset changes can trigger the implemented company-name fallback.
- Full keyboard traversal, screen-reader experience, reflow/zoom, image error events and rendered profile navigation are not claimed passed.
- No automated Impeccable detector/reviewer ran: the snapshot has references, not its executable/tooling.

## Reproducible browser checks
Start a local server and run `CADALOG_URL=http://localhost:8000/ node tests/browser-check.cjs` in an environment with Playwright/Chromium. This optional script is separate from the dependency-free unit tests. It has been syntax-checked but not completed here.

It checks RU/EN at 1440, 1100, 768, 620, 390, 320px; no horizontal overflow; 12 initial cards; tag + service filtering; profile/language/back state; reset; empty state; obsolete saved URL behavior; unknown profile; image error fallback; no live GitHub/save controls; no page errors. Captures go to `qa/screenshots` and still require visual inspection.

Manual additions before shipping:
- Review every screenshot; unboxed logo sizing, long Russian checkbox labels, card footer wrapping, rectangular dark Praxis identity band, 320px header. Check 0px result/identity/tag corners, 2px form controls, no card shadow.
- Test Tab/Shift+Tab, native checkbox space toggle, card-tag click focus, modifier-click opening, guide disclosures, skip link.
- 200% / 400% zoom, reduced motion, blocked fonts, no-JavaScript provider links.
- Test direct links under `/CADalog/` as well as domain root; browser Back/Forward; EN/RU switches in filtered and missing-profile states.
- Test outbound service links and the visible Global CAD/DraftPoint caution.

## Delivery
Only three production files changed: `styles.css`, `index.html`, `favicon.svg`. Four runtime/data/locale JS files are byte-identical to the provided baseline. Documentation updated; test files unchanged. No build dependencies or deployment changes. The copy is not a full Git checkout; preserve the real repository workflows. Confirm a real contact address before adding it to the footer; do not invent or enable an unconfigured form.

## Refinement-specific verification
- Existing 14 tests passed before and after refinement. All four JS syntax checks passed; no runtime logic changed.
- HTMLParser validation: 24 unique IDs; explicit labels, ARIA references and local resource references valid.
- Pure-white/graphite/blue token calculations above passed their 4.5:1 text and 3:1 control thresholds. This is not full WCAG certification.
- Published baseline visually inspected in cloud browser, together with Thomasnet, DirectIndustry and TraceParts. No claim is made that the new local CSS has been rendered.
- Normal Chromium launch still fails with `socket() failed: Operation not permitted`. A standard escalation request also could not start the environment (`bwrap` read-only setup failure); no permissions/security workaround attempted.
- Python optional CSS/HTML packages were unavailable, so HTML was checked with the standard-library parser. No CSS-parser or screenshot pass is claimed.
- Still required: refined-site browser checks at 1440, 1100, 768, 620, 390 and 320px in both RU/EN, keyboard/checkbox focus, image fallback, filtering/reset/profile-language-back flow. Existing `tests/browser-check.cjs` is ready for an environment where Chromium launches.
- No publication, deployment, repository push or Codex task was performed.
