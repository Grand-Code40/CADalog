# CADalog — interface rules

## Direction
Operate mode: a useful, approachable service directory, not a SaaS landing page. Cards are grounded in real company identities and comparable facts. Preserve the twelve entries and the direct path from searching to an official source. No decorative project mockups, fabricated ratings, huge hero, glow, gradients or entrance choreography.

## Color and type
- Canvas `#f5f7f6`; surfaces `#ffffff`.
- Main ink `#24332f`; supporting ink `#596963`.
- Dividers `#d5dfd9`; control boundaries `#81928a`.
- Functional green-slate accent `#365e50`; active/darker `#244639`; selected `#e3ede7`; hover `#edf2ee`.
- Selection background `#cbded2`; caret and 3px focus rings use the accent.
- The UI contains no orange/terracotta accent. Official logos retain their original colors rather than being recolored to match.
- Golos Text 400/500/600/700, Helvetica/Arial fallback, for Cyrillic and Latin. Headline 36px desktop, 30–32px mobile; company name 19px; summary 14px. Fixed rem/px hierarchy, no display serif or technical-monospace costume.
- Calculated token contrasts: primary ink/canvas 12.28:1; supporting ink/canvas 5.38:1 and white 5.79:1; white/accent 7.31:1; selected text/surface 8.72:1; control/white 3.28:1. These token checks are not full WCAG conformance.

## Layout
1180px maximum content width, 40px desktop / 24px tablet / 16px phone outer margins. Compact two-column introduction; search and service controls directly precede visible multi-select tags. Result count/reset and native sort share a wrapping toolbar.

Cards use three columns above 1100px, two through tablet, one at 620px and below. A real logo band leads into name, description, clickable tags and complete service/format facts. Source and profile actions are separated by a fine rule. 9px card corners; no nested content cards. Card hover changes only the border and a subtle offset shadow; no moving/scaling content.

Three real site icons sit alongside company-name text. Seven official logos stand alone. Global CAD Services and SurveysMaps use plain actual names, not invented logos. Logo failures reveal the same name. Praxis has a dark band to support its original light logo. See SOURCES.md for provenance.

Header navigation wraps below 380px rather than disappearing. Profile has a modest identity panel and readable text/facts columns, stacking on narrow screens. The service guide uses native details/summary disclosures; footer has no placeholder contact link.

## Behavior and accessibility
- RU default; EN explicit. Search includes both languages and translated tags/formats.
- Tags are actual native labeled checkboxes, multi-select AND. Card tags are links with a working URL; unmodified clicks filter in place and focus the corresponding checkbox. Modified clicks keep native new-tab behavior.
- Input, checkbox-label, sort and main actions are at least 44px high. Compact inline tag links are at least 28px high. Keyboard focus is visible, no hover-only content, polite result count, useful empty/reset state.
- Native search/select/disclosure behavior retained. No saved state, localStorage, account, GitHub submission or false success feedback.
- Source links open a new tab, use `noopener noreferrer`; logos have descriptive alt text, lazy decoding and `referrerpolicy="no-referrer"`. Fallback text is the company name, not a false portfolio image.
- Reduced motion removes the brief hover transitions. No scroll-triggered animations.

## Impeccable and verification
Read installed Impeccable 4.8.0 SKILL and new-work/operate/craft-floor references, plus existing PRODUCT/DESIGN context. The local snapshot contains no launcher/binary, detector or finish-reviewer definition, so direct-reading fallback was used. No automated Impeccable pass or independent reviewer verdict is claimed.

Syntax, 14 pure-logic/locale tests, HTML references and contrast calculations pass. Official asset loading was checked separately in the cloud browser. Final-site browser rendering and screenshots remain blocked by the execution environment; see QA.md.
