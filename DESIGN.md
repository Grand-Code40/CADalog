# CADalog — Design system

<!-- Visual world replaced October 2026 after explicit full redesign request. -->

## Direction
A quiet printed trade directory, translated into a responsive browser index. Cultural reference: architecture and industrial service registers, not an AI startup landing page or ornamental CAD drawing. People come to read a list and evaluate suppliers. An index is the interface.

## Visitor mode
Operate, with supporting Read content. The primary task is finding a specialist; hero drama, decorative media, and marketing persuasion are secondary or inappropriate.

## Palette
- Canvas `#f9faf9` very cool near-white
- White `#ffffff` for document/form surfaces
- Ink `#1e272a` deep slate/blue-black
- Secondary ink `#586569` enough contrast for body/meta
- Rules `#dce1df` separation by line and whitespace
- Accent `#ad4431` oxide-red, used sparingly for links and selected/active states
- Accent dark `#8d3223` for active controls on light ground

No gradients, tinted card grid, decorative brand backgrounds or colored panels as defaults. The accent carries activity, not mood.

## Typography
One humane, editorial sans family: Libre Franklin 400/500/600/700 via Google Fonts, with Helvetica / Arial fallback. No italic display lettering, fake magazine microcopy, exaggerated tracking, brand-as-technical monospace, or multiple decorative font families. Headings use generous but controlled size; listings and detail panels prioritize scanability. Base 16px with 1.55 line-height.

## Layout
Desktop max-width 1180px, content-led whitespace, thin rules, typographic hierarchy. Masthead is text-only, factual rather than promotional, and contains no kicker, metric or image. Filtering is a single horizontal utility band. Results are typographic rows (company, services, discipline) rather than repeated image cards. At narrower viewports, columns compress into legible stacked rows. Profiles use an editorial left article plus facts right, then source notice and related firms.

## Interaction and component rules
- Visible focus states; minimum useful hit targets; links underlined in prose.
- Quiet hover color/underlines, not animations for decoration.
- Form remains an honest GitHub-issue handoff.
- All claims are tied to actual provider data and source URLs.
- No decorative SVG technical drawings or fake portfolio photos.
- Keep static site/Pages compatibility and relative URLs to support /CADalog/ deployment.
