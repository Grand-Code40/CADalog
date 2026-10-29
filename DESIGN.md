# CADalog — interface rules

## Direction
Operate mode: a useful, approachable service directory, not a SaaS landing page. Cards are grounded in real company identities and comparable facts. Preserve the twelve entries and the direct path from searching to an official source. No decorative project mockups, fabricated ratings, huge hero, glow, gradients or entrance choreography.

## Color and type
- Canvas and surfaces `#ffffff`; no tinted green neutrals.
- Main ink `#242424`; supporting ink `#5b5b5b`.
- Dividers `#d6d6d6`; control boundaries `#858585`.
- Functional blue accent `#005a9c`; active/darker `#003d6b`; selected `#e9f1f8`; neutral hover `#f3f3f3`. Blue marks actions, selection and focus, not decorative panels.
- Selection background `#d6e6f3`; caret and 3px focus rings use the accent.
- The UI contains no green, orange or terracotta accent. Official logos retain their original colors rather than being recolored to match.
- Golos Text 400/500/600/700, Helvetica/Arial fallback, for Cyrillic and Latin. Headline 36px desktop, 30–32px mobile; company name 19px; summary 14px. Fixed rem/px hierarchy, no display serif or technical-monospace costume.
- Calculated token contrasts: primary ink/white 15.52:1; supporting ink/white 6.79:1; white/accent 7.14:1; selected text/surface 9.79:1; control/white 3.69:1. These token checks are not full WCAG conformance.

## Layout
1180px maximum content width, 40px desktop / 24px tablet / 16px phone outer margins. Compact two-column introduction; full-width search and service controls directly precede visible multi-select tags. The redundant visible directory heading is screen-reader-only; its semantics remain. Result count and reset share a wrapping toolbar; no sort selector or explanatory tag sentence is shown.

Cards use three columns above 1100px, two through tablet, one at 620px and below. Each entry has a real logo, name, description, clickable tags and complete service/format facts. Cards have a full 1px neutral frame, 2px nearly square corners and 20px horizontal inset. No shadow or hover elevation. Logo-area, tag and disclosure corners remain square (the inset dark logo band follows the frame with a 1px top corner); form controls and main buttons are 2px. Unselected filter tags are conventional checkbox labels without an outer box. The four thematic card tags are plain underlined text links rather than colored badges. DWG, DXF, DGN and layered-CAD tags are not shown as filters or tag links; file formats remain in the facts.

Three real site icons sit alongside company-name text. Seven official logos stand alone. Global CAD Services and SurveysMaps use plain actual names, not invented logos. Logo failures reveal the same name. Praxis has a dark band to support its original light logo. See SOURCES.md for provenance.

Header navigation wraps below 380px rather than disappearing. Profile has an unboxed identity area and readable text/facts columns, stacking on narrow screens. The service guide uses native details/summary disclosures. About/header and source/footer navigation lead to a standalone `?page=sources` view with actual company service URLs, not a hidden-home anchor. The common suggestion block has an editable textarea, copy button and explicit unavailable-delivery message. There is no placeholder email or submit action.

## Behavior and accessibility
- RU default; EN explicit. Search includes both languages and translated tags/formats.
- Thematic tags are actual native labeled checkboxes, multi-select AND. Card tags are links with a working URL; unmodified clicks filter in place and focus the corresponding checkbox. Modified clicks keep native new-tab behavior.
- Input, checkbox-label, sort and main actions are at least 44px high. Compact inline tag links are at least 28px high. Keyboard focus is visible, no hover-only content, polite result count, useful empty/reset state.
- Native search/select/disclosure behavior retained. No saved state, localStorage, account, GitHub submission or false success feedback.
- Source links open a new tab, use `noopener noreferrer`; logos have descriptive alt text, lazy decoding and `referrerpolicy="no-referrer"`. Fallback text is the company name, not a false portfolio image.
- No decorative transitions or scroll-triggered animations. Reduced-motion protection remains.

## Impeccable and verification
Read installed Impeccable 4.8.0 SKILL and new-work/operate/craft-floor references, plus existing PRODUCT/DESIGN context. The local snapshot contains no launcher/binary, detector or finish-reviewer definition, so direct-reading fallback was used. No automated Impeccable pass or independent reviewer verdict is claimed.

Current integration: syntax, 42 unit/static tests and 15 Happy DOM checks pass. DOM coverage includes both languages, root/subdirectory links, all twelve profiles, the source page, search events and clipboard success/fallback. Company data, source URLs, logos and favicon remain unchanged. Final-site browser rendering remains blocked by the execution environment; see QA.md.

## Refinement scope — 29 October 2026
User explicitly rejected the green tint and excessive rounding/noise. The selected direction is neutral white/graphite with conventional blue actions, not another muted green. Restored framed cards at the user’s request. Removed the repeated source disclaimer and visible multi-tag explanation. Directory principles and actual source links have a dedicated page; practical provider-confirmation guidance remains without the rejected wording. The service guide, quote checklist, all filters, navigation and 12 entries remain.
