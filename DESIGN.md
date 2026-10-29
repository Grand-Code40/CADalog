# CADalog — interface rules

## Direction and use
A practical service directory, primarily in Russian, with an explicit English switch. The user needs to compare providers, inspect source material and make contact. The directory is the main interface, not a product concealed below a landing page. Editorial means careful selection and readable information, not newspaper decoration.

The redesign removes the oversized hero, arbitrary row numbering, duplicate profile-arrow links, decorative logo dot, hidden mobile navigation, large marketing sections and unnecessary submission modal. It does not substitute serif/beige magazine styling for a generic SaaS template.

## Typography and color
- `Golos Text` 400/500/600/700, with Helvetica/Arial fallbacks. It supports the site's Cyrillic and Latin text. The existing Libre Franklin family was replaced for Russian coverage.
- Background `#f9faf9`; form surfaces `#ffffff`.
- Main text `#1e272a`; supporting text `#586569`.
- Dividers `#d5ddda`; field boundaries `#87928d`.
- Action color `#923b2b`; active/darker action `#762e21`; saved state `#f3e9e5`.
- Text contrast against used surfaces: supporting text at least 5.77:1; primary CTA 7.28:1. Field boundaries against white: 3.22:1. These are calculated token pairs, not a full accessibility certification.
- One sans-serif family, controlled hierarchy. Desktop introduction 36px, mobile 30–32px. Company names 18–19px, explanatory text 13–16px. No ornamental display face, eyebrow labels or uppercase body copy.

## Layout
Maximum content width 1180px, 40px desktop outer gutters; 24px on intermediate widths and 16px on phones. The navigation wraps to a second row at 620px to avoid an intermediate-width collision between the Russian links, wordmark and language switch. Compact introductory heading and explanatory paragraph form two columns on desktop, one on small screens. Search and refinements lead directly into company rows.

Desktop rows compare company/summary/formats, all services, discipline and a save control. Mobile rows keep the name/description, services, discipline and formats rather than hiding comparison data. Below 460px, save becomes a 44px bookmark control with an accessible label and a pressed state. No fabricated company imagery, diagrams, ratings or testimonials.

Profiles contain a modest heading, description, source, direct website link, capability facts, an evidence notice and related companies. Source content is not silently promoted to an independently verified claim.

## Interaction
- Russian is the default HTML language and content. `?lang=en` selects English. Changing language preserves profile, filters and saved-view state in the URL.
- English company names and factual source records remain in `data.js`. Russian descriptions and interface strings live in `locales.js`. Search includes both source text and translations.
- Filters use canonical data values; visible labels are localized. Query/filter/sort/saved-view state is reflected in the URL. Profiles carry it back to the directory.
- All services are shown, not the first two only. Saved companies work on the directory and profile, use the existing storage key, and remain browser-local.
- Empty saved collection, no matching saved companies, and ordinary no-results states have different explanations.
- Storage failures are disclosed. Corrupt/unknown saved data is ignored safely. Save feedback uses a polite live region.
- The suggestion form is a native inline disclosure. It validates in the current language, opens a prefilled GitHub issue and never implies that an entry was submitted locally.
- Visible 3px focus outline; primary buttons and compact controls are at least 44px high. No hover-only action or entrance animation. Native selects and text fields retain their behavior.

## Validation status
Node pure-logic and locale tests, syntax checks, HTML structure and token-pair contrast calculations were run locally. Browser rendering, keyboard interaction, reflow and screen-reader checks remain pending because this execution sandbox could not run Chromium or expose its local files to the browser. See `QA.md` before publication.

## Impeccable
The repository's Impeccable 4.8.0 SKILL, new-work, operate and craft-floor references were read. Its launcher/binary and independent reviewer were not run. The documented context-loading fallback was used; this is not an Impeccable automated audit pass.
