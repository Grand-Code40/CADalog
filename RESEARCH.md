# Design research used for CADalog

Read 29 October 2026. These sources inform choices; they do not prove whether a site was made by AI. No aesthetic pattern is a reliable authorship detector.

## Primary / authoritative guidance
1. [Y Combinator — Common Mistakes With Vibe Coded Websites](https://www.youtube.com/watch?v=DNSXlBmukck), published 6 March 2026. The official video description names repetitive purple gradients, disruptive hover effects and sections fading on scroll. Applied: no ornamental motion, no generic hero mechanics; make the task and controls explicit. This research used the official description, not a claim to have watched the entire video.
2. [Nielsen Norman Group — Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/). Minimalism is about preserving utility while reducing noise, not imposing an empty visual style. Applied: keep all comparison facts and source links, remove duplicate/decorative structures.
3. [Nielsen Norman Group — Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/). Scale, contrast and proximity should reflect information importance. Applied: search and real company entries outrank promotional headings; consistent fact columns on desktop and labeled continuation on mobile.
4. [W3C — WCAG 2.2, Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). The relevant check is use without two-dimensional scrolling at 320 CSS px. Applied: stacked narrow layouts; browser verification still required.
5. [W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Applied: contrast calculations, visible focus, native form controls and 44px-high compact buttons. These are implementation targets, not a claim of full WCAG conformance.
6. [Impeccable official project](https://github.com/pbakaus/impeccable), via the repository's installed [Impeccable skill](https://github.com/Grand-Code40/CADalog/blob/main/.agents/skills/impeccable/SKILL.md), plus `reference/new-work.md`, `operate.md`, `craft-floor.md`. In Operate mode, precision, familiar controls and task clarity are more useful than expressive decoration. Used the documented direct-reading fallback; did not run its binary or claim an automated detector/reviewer pass.

## Community discussion — qualitative, not consensus
7. [r/webdesign — So many websites look like this now](https://www.reddit.com/r/webdesign/comments/1u1579w/so_many_websites_look_like_this_now/). Participants discuss both generic hero/card layouts and the newer cream/serif “newspaper” template. Some find these patterns attractive; others find the repetition alienating. Applied: do not solve “AI look” by switching blindly to beige, italic serif or a faux magazine. The actual directory data determines the structure.

## Resulting design decisions
- Use one Cyrillic-capable sans family, a restrained cool-white canvas and small functional accent. Real official company marks now identify entries; no fake project imagery or ornamental illustrations.
- Give the actual directory more space than the introduction. Cards combine genuine visual identity with every service and file-format field; visible tags support meaningful exploration.
- Do not use made-up reviews, ratings, metrics or portfolios as visual filler.
- Use Russian by default, including errors, empty states and source summaries. Keep the English alternative explicit and complete.
- Test edge cases rather than relying on a polished screenshot. The local checks are documented separately from the outstanding browser QA.


## Card and tag refinement — 29 October 2026
- Impeccable’s Operate guidance favors familiar controls and precision over decoration. Applied: native checkbox tags with AND filtering, compact stable cards, no moving hover effects or entrance sequences.
- Visual interest is earned by original company marks, clear typography, useful tags and source actions. Logos are identity markers, not proof of project quality. Seven logos and three site icons were checked against their official origins; URLs and limitations are in `SOURCES.md`.
- The service guide adds context at the point of comparison without another hero or marketing block. Its practical questions follow providers’ own descriptions: [CAD/CAM Services](https://www.cadcam.org/2d-cad-services/raster-to-vector), [Praxis Drawings](https://drawings.3dpraxisstudio.com/services/pdf-to-cad-conversion/) and [Morava Modern](https://moravamodern.com/outsourcing/pdf-to-cad). Advice is summarized, not copied.
- Public access to an image is not an open license. Project photographs/drawing samples are linked in their original context rather than republished; external official marks have documented provenance and a text fallback.
- Remove false affordances: no saved collection requested, no GitHub submission, no unconfirmed contact address. These removals make the directory smaller and more coherent rather than merely more decorative.

## Neutral, less-rounded refinement — 29 October 2026
Primary pages read and their live layouts inspected with the cloud browser:
- [Thomasnet](https://www.thomasnet.com/): supplier search is the clear entry point; navy/blue is a familiar functional industrial-directory palette. Its large rounded hero was **not** copied because the user explicitly wants fewer rounded surfaces.
- [DirectIndustry](https://www.directindustry.com/): broad taxonomy, recognizable company/product identity and neutral information surfaces support comparison. Its orange brand accent and marketing blocks were not copied.
- [TraceParts](https://www.traceparts.com/en): CAD search, category navigation and manufacturer identity remain central. Its teal palette and pill controls were not copied.

The references are examples, not proof of a universal industry color. The exact `#005a9c` accent is our accessible conventional-blue choice, not claimed as an extracted brand color. Applied: pure-white base, graphite text, compact checkbox labels, underlined tag links, flat result entries and 0–2px radii. The published CADalog baseline at [GitHub Pages](https://grand-code40.github.io/CADalog/) was inspected before changes.
