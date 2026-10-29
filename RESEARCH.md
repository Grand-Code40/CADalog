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
- Use one Cyrillic-capable sans family, a restrained cool-white canvas and small functional accent. No decorative imagery needed for this task.
- Give the service comparison more space than the introduction; show every service and file-format field already in the dataset.
- Do not use made-up reviews, ratings, metrics or portfolios as visual filler.
- Use Russian by default, including errors, empty states and source summaries. Keep the English alternative explicit and complete.
- Test edge cases rather than relying on a polished screenshot. The local checks are documented separately from the outstanding browser QA.
