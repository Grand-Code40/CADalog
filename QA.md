# CADalog — QA handoff

Artifact: `/workspace/shared/cadalog-redesign-20261029`
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
- Token contrasts: ink/canvas 12.28:1, supporting ink/canvas 5.38:1, supporting ink/white 5.79:1, white/accent 7.31:1, selected text 8.72:1, control boundaries/white 3.28:1.
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
- Review every screenshot; logo sizing, long Russian tags, card footer wrapping, dark Praxis identity band, 320px header.
- Test Tab/Shift+Tab, native checkbox space toggle, card-tag click focus, modifier-click opening, guide disclosures, skip link.
- 200% / 400% zoom, reduced motion, blocked fonts, no-JavaScript provider links.
- Test direct links under `/CADalog/` as well as domain root; browser Back/Forward; EN/RU switches in filtered and missing-profile states.
- Test outbound service links and the visible Global CAD/DraftPoint caution.

## Delivery
Seven static site files plus documentation/tests. No build dependencies or deployment changes. The copy is not a full Git checkout; preserve the real repository workflows. Confirm a real contact address before adding it to the footer; do not invent or enable an unconfigured form.
