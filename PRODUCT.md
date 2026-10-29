# CADalog — Product context

<!-- impeccable:product-schema 1 -->

## Platform and stack
Web. Static HTML, CSS and vanilla JavaScript. No backend, accounts, database, tracking or submission endpoint. Work is local only; publication is not authorized.

## Purpose and audience
Help engineers, architects, production and procurement staff find providers who convert drawings, scans, sketches and PDFs into editable CAD. Compare publicly described services and formats, inspect official sources and contact providers directly.

## Confirmed behavior
Twelve company entries, Russian default and English alternative. Search covers both languages. Service filter and the four thematic tags (Architecture, Engineering, Survey & civil, Multi-disciplinary) combine with AND. Format tags are not filters; formats remain searchable and visible in company facts. Alphabetical ordering is fixed; obsolete format-tag and sort URL parameters are ignored. Clicking a card tag selects that tag. Search, service, thematic tags and language are reflected in the URL and carried through profile/source-page navigation.

Cards show actual official company logos/site icons where located, names, descriptions, tags, services, formats and source links. Profiles show detailed descriptions and provider websites. A short service guide and quote-preparation checklist explain practical next steps. The dedicated `?page=sources` view lists all twelve company service sources and directory principles. A common “Suggest a company” section offers an editable template and copies it; it explicitly does not send anything because a real delivery address/endpoint has not been provided.

## Explicit removals
No saved/favorite/bookmark feature, localStorage reads/writes, saved collection or associated status copy. No GitHub links or issue form in the live UI. No fabricated contact address or submission success. A working submission route awaits owner confirmation.

## Evidence and boundaries
Descriptions are based on company-published material, not a ranking. Do not invent reviews, ratings, verified-provider status, prices, locations or performance claims. Original twelve names and source URLs retained; the Global CAD Services card discloses that the source domain currently uses DraftPoint CAD, without assuming the brand relationship.

Ten externally hosted official marks serve identification only. No open license or explicit reuse permission is asserted. No copied/generated portfolio imagery. Failed/unavailable marks use actual company-name text. SOURCES.md records provenance and limitations.

## Delivery constraint
Browser QA remains open because this execution sandbox cannot launch Chromium and the cloud browser cannot open isolated local files/data URLs. Pure-logic/static and Happy DOM integration tests pass. DOM emulation is not a visual, native-clipboard or accessibility certification.
