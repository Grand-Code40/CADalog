/* CADalog — no framework, no tracking, no third-party scripts. */
(() => {
  'use strict';

  const companies = Array.isArray(window.CADALOG_COMPANIES) ? window.CADALOG_COMPANIES : [];
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const profileUrl = slug => './?company=' + encodeURIComponent(slug);
  const favouriteKey = 'cadalog:saved:v1';
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem(favouriteKey) || '[]')); } catch (_) { /* Storage can be disabled. */ }
  let savedOnly = false;

  function drawingMarkup(kind) {
    const start = '<svg viewBox="0 0 520 365" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><pattern id="grid-' + kind + '" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" stroke="currentColor" stroke-width=".48" opacity=".24"/></pattern><pattern id="h-' + kind + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V7" stroke="currentColor" stroke-width=".8" opacity=".48"/></pattern></defs><rect width="520" height="365" fill="url(#grid-' + kind + ')"/><g stroke="currentColor" stroke-linejoin="round" stroke-linecap="square">';
    const end = '</g><g fill="currentColor" font-size="9" font-family="Arial,sans-serif" letter-spacing="2" opacity=".87"><text x="29" y="340">CADALOG / REFERENCE STUDY</text><text x="487" y="340" text-anchor="end">NTS — 01</text></g></svg>';
    if (kind === 'plan') return start + '<rect x="104" y="65" width="310" height="233" stroke-width="2.2"/><path d="M103 144H260V65M260 144V296M260 217H413M330 217V297" stroke-width="1.7"/><path d="M260 188V142M260 218V245M155 144V175M178 144V175" stroke="#879e89" stroke-width="3"/><path d="M260 145A58 58 0 0 0 318 203M330 217A42 42 0 0 0 288 259M155 144A33 33 0 0 0 188 177" stroke-width="1.1" stroke-dasharray="4 5"/><rect x="120" y="85" width="65" height="32" stroke-width=".9"/><rect x="289" y="90" width="85" height="55" stroke-width="1"/><path d="M306 90V145M344 90V145" stroke-width=".65"/><rect x="135" y="207" width="79" height="56" stroke-width=".9"/><circle cx="175" cy="235" r="17" stroke-width=".8"/><path d="M104 50H414M104 55V38M414 55V38M104 45L111 52M407 38L414 45M430 65H458M430 298H458M444 65V298" stroke-width=".9"/><path d="M76 65V298M78 65H104M78 298H104" stroke-width=".9"/><g stroke-width=".75" stroke-dasharray="3 5"><path d="M260 32V325M77 181H448"/></g><g fill="currentColor" stroke="none" font-family="Arial,sans-serif" font-size="10"><text x="260" y="34" text-anchor="middle">6 800</text><text x="463" y="181" transform="rotate(90 463 181)" text-anchor="middle">5 200</text><text x="166" y="192" text-anchor="middle">A–01</text><text x="337" y="183" text-anchor="middle">A–02</text></g>' + end;
    if (kind === 'survey') return start + '<rect x="93" y="53" width="330" height="259" stroke-width="1.2"/><path d="M87 120C162 25 228 140 290 66S401 80 428 38M82 156C172 62 227 182 303 98S412 108 436 61M85 194C166 108 241 213 314 137S420 143 442 98M83 237C181 149 244 265 324 178S430 179 447 136M83 279C181 202 246 311 339 214S425 223 452 169M97 309C185 264 253 335 350 254S423 265 451 211" stroke-width="1.3"/><path d="M135 78L193 215L346 117L399 271L193 215L137 287" stroke-width="1" stroke-dasharray="6 5"/><circle cx="135" cy="78" r="4.5" fill="currentColor"/><circle cx="193" cy="215" r="4.5" fill="currentColor"/><circle cx="346" cy="117" r="4.5" fill="currentColor"/><circle cx="399" cy="271" r="4.5" fill="currentColor"/><g fill="currentColor" stroke="none" font-size="10" font-family="Arial,sans-serif"><text x="148" y="74">P01</text><text x="209" y="212">P02</text><text x="359" y="111">P03</text><text x="367" y="293">P04</text><text x="110" y="298">42.5</text></g>' + end;
    if (kind === 'technical') return start + '<g transform="translate(42 16)"><path d="M91 202L203 139L360 201L244 272Z" stroke-width="1.5" fill="url(#h-technical)"/><path d="M91 169L203 108L360 169L244 238Z" stroke-width="1.7"/><path d="M91 169V202M203 108V139M360 169V201M244 238V272" stroke-width="1.7"/><path d="M91 169L244 238M203 108L244 238" stroke-width="1"/><path d="M183 141L223 120L261 137L220 159Z" stroke-width="1.5"/><path d="M183 141V165L221 185L261 161V137" stroke-width="1.4"/><path d="M220 159V185" stroke-width="1.2"/><path d="M151 145L176 130M176 130V87L199 73L225 86V120" stroke-width="1.2"/><path d="M199 73V113" stroke-width="1.2"/><path d="M225 86L199 101L176 87" stroke-width="1.1"/><path d="M101 219V265M361 215V265M101 252H361M101 247L108 257M354 247L361 257" stroke-width=".8"/></g><g fill="currentColor" stroke="none" font-family="Arial,sans-serif" font-size="10"><text x="260" y="293" text-anchor="middle">250 ± 0.02</text><text x="50" y="85">ISOMETRIC VIEW</text></g>' + end;
    return start + '<g transform="translate(260 183)" stroke-width="1.3"><circle r="125"/><circle r="100"/><circle r="76"/><circle r="47"/><circle r="26" fill="url(#h-mechanical)"/><circle cy="-100" r="10"/><circle cx="71" cy="-71" r="10"/><circle cx="100" r="10"/><circle cx="71" cy="71" r="10"/><circle cy="100" r="10"/><circle cx="-71" cy="71" r="10"/><circle cx="-100" r="10"/><circle cx="-71" cy="-71" r="10"/><path d="M-165 0H165M0-155V155" stroke-dasharray="9 5 2 5" stroke-width=".9"/><path d="M-125-140V-154M125-140V-154M-125-148H125M-125-152L-117-144M117-152L125-144" stroke-width=".9"/></g><g fill="currentColor" stroke="none" font-size="10" font-family="Arial,sans-serif"><text x="260" y="29" text-anchor="middle">⌀ 250</text><text x="430" y="182">8 × M10</text></g>' + end;
  }

  function cardHTML(company, index) {
    const liked = saved.has(company.slug);
    return '<article class="company-card">' +
      '<div class="card-visual ' + safe(company.tone) + '"><span class="card-figure">' + String(index + 1).padStart(2, '0') + ' / ' + String(companies.length).padStart(2, '0') + '</span>' +
      '<a href="' + profileUrl(company.slug) + '" aria-label="View ' + safe(company.name) + ' profile" class="card-image-link">' + drawingMarkup(company.art) + '</a>' +
      '<span class="card-illustration-label">ILLUSTRATIVE / ' + safe(company.art.toUpperCase()) + '</span></div>' +
      '<button class="save-button' + (liked ? ' is-saved' : '') + '" type="button" data-save="' + safe(company.slug) + '" aria-pressed="' + liked + '" aria-label="' + (liked ? 'Remove ' : 'Save ') + safe(company.name) + (liked ? ' from saved' : ' to saved') + '">' + (liked ? '♥' : '♡') + '</button>' +
      '<div class="card-kicker">' + safe(company.focus) + ' / CAD CONVERSION</div>' +
      '<div class="card-title-line"><a class="card-title" href="' + profileUrl(company.slug) + '">' + safe(company.name) + '</a><span class="card-arrow" aria-hidden="true">↗</span></div>' +
      '<p class="card-description">' + safe(company.line) + '</p>' +
      '<div class="card-tags">' + company.services.slice(0, 2).map(tag => '<span class="card-tag">' + safe(tag) + '</span>').join('') + '</div>' +
      '</article>';
  }

  function initDirectory() {
    const results = $('#results');
    if (!results) return;
    const search = $('#search-input');
    const service = $('#service-select');
    const focus = $('#focus-select');
    const sort = $('#sort-select');
    const clear = $('#clear-filters');
    const savedButton = $('#saved-toggle');

    function updateSavedCount() { $('#saved-count').textContent = String(saved.size); }
    function render() {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = companies.filter(item => {
        const text = [item.name, item.focus, item.line, item.detail, ...item.services, ...item.formats].join(' ').toLocaleLowerCase();
        return (!query || text.includes(query)) && (!service.value || item.services.includes(service.value)) && (!focus.value || item.focus === focus.value) && (!savedOnly || saved.has(item.slug));
      });
      matches.sort((a, b) => sort.value === 'reverse' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      results.innerHTML = matches.map((item, index) => cardHTML(item, index)).join('');
      $('#result-count').textContent = matches.length + (matches.length === 1 ? ' PRACTICE' : ' PRACTICES');
      $('#empty-state').hidden = matches.length !== 0;
      results.hidden = matches.length === 0;
      clear.hidden = !(query || service.value || focus.value || savedOnly);
      savedButton.setAttribute('aria-pressed', String(savedOnly));
      updateSavedCount();
    }
    function reset() { search.value = ''; service.value = ''; focus.value = ''; sort.value = 'name'; savedOnly = false; render(); search.focus(); }
    [search, service, focus, sort].forEach(control => control.addEventListener(control === search ? 'input' : 'change', render));
    clear.addEventListener('click', reset);
    $('#empty-reset').addEventListener('click', reset);
    savedButton.addEventListener('click', () => { savedOnly = !savedOnly; render(); });
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-save]');
      if (!button) return;
      const slug = button.getAttribute('data-save');
      if (saved.has(slug)) saved.delete(slug); else saved.add(slug);
      try { localStorage.setItem(favouriteKey, JSON.stringify([...saved])); } catch (_) { /* Reading remains possible without storage. */ }
      render();
    });
    $('#intro-count').textContent = String(companies.length);
    render();
  }

  function initProfile() {
    const slug = new URLSearchParams(location.search).get('company');
    if (!slug) return;
    const company = companies.find(item => item.slug === slug);
    if (!company) { document.title = 'Listing not found — CADalog'; return; }
    $('#home-view').hidden = true;
    $('#profile-view').hidden = false;
    document.title = company.name + ' — CADalog directory';
    const other = companies.filter(item => item.slug !== slug).sort((a, b) => Number(b.focus === company.focus) - Number(a.focus === company.focus)).slice(0, 3);
    $('#profile-content').innerHTML =
      '<div class="profile-heading"><div><span class="overline">DIRECTORY / ' + safe(company.focus.toUpperCase()) + '</span><h1 id="profile-title">' + safe(company.name) + '<span class="period">.</span></h1></div><p>' + safe(company.line) + '</p></div>' +
      '<div class="profile-hero"><div class="profile-art"><span class="profile-art-caption">TECHNICAL STUDY / ' + safe(company.art.toUpperCase()) + '</span>' + drawingMarkup(company.art) + '</div><aside class="profile-sidebar"><span class="overline">PRACTICE DETAILS</span>' +
      '<dl class="profile-facts"><div><dt>Area of work</dt><dd>' + safe(company.focus) + '</dd></div><div><dt>Services listed</dt><dd>' + company.services.map(safe).join(' · ') + '</dd></div><div><dt>Formats mentioned</dt><dd>' + company.formats.map(safe).join(' · ') + '</dd></div></dl>' +
      '<a class="visit-site" href="' + safe(company.website) + '" target="_blank" rel="noopener noreferrer">Visit company website <span aria-hidden="true">↗</span></a></aside></div>' +
      '<div class="profile-details"><div><span class="overline">ABOUT THE PRACTICE</span><h2>Making existing drawings<br>useful again.</h2><p>' + safe(company.detail) + '</p><p class="profile-source">Information summarized from the provider’s <a href="' + safe(company.source) + '" target="_blank" rel="noopener noreferrer">published service page ↗</a></p></div>' +
      '<aside class="profile-disclaimer"><strong>About this listing</strong><p>This directory entry summarizes public information supplied by the company on its website. CADalog has not independently evaluated the quality, availability or pricing of its services. Confirm project requirements directly with the provider.</p></aside></div>' +
      '<section class="related-block" aria-label="Other practices"><h2>Also in the directory</h2><div class="related-list">' + other.map(item => '<a class="related-link" href="' + profileUrl(item.slug) + '"><span>' + safe(item.name) + '</span><span aria-hidden="true">↗</span></a>').join('') + '</div></section>';
    scrollTo({ top: 0, behavior: 'instant' });
  }

  function initSubmission() {
    const dialog = $('#submit-dialog');
    document.querySelectorAll('[data-open-submit]').forEach(button => button.addEventListener('click', () => {
      $('#mobile-menu').hidden = true;
      $('#mobile-menu-button').setAttribute('aria-expanded', 'false');
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    }));
    $('[data-close-submit]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    $('#submit-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const website = String(data.get('website') || '').trim();
      const notes = String(data.get('notes') || '').trim();
      if (!name || !/^https?:\/\//i.test(website)) return;
      const title = 'Directory suggestion: ' + name;
      const body = '### Company\n' + name + '\n\n### Website\n' + website + '\n\n### Suggested service / context\n' + (notes || '(Not provided)') + '\n\n---\nSubmitted from the CADalog directory form. Inclusion is editorial and not guaranteed.';
      location.href = 'https://github.com/Grand-Code40/CADalog/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
    });
  }

  function initMobile() {
    const button = $('#mobile-menu-button');
    const menu = $('#mobile-menu');
    button.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      button.setAttribute('aria-expanded', String(!menu.hidden));
      button.setAttribute('aria-label', menu.hidden ? 'Open menu' : 'Close menu');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }));
  }

  $('#footer-year').textContent = String(new Date().getFullYear());
  initMobile();
  initSubmission();
  initProfile();
  if (!$('#home-view').hidden) initDirectory();
})();
