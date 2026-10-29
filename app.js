/* CADalog. Purpose-built static directory; no backend, advertising or tracking. */
(() => {
  'use strict';
  const companies = Array.isArray(window.CADALOG_COMPANIES) ? window.CADALOG_COMPANIES : [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const profileUrl = slug => './?company=' + encodeURIComponent(slug);
  const storageKey = 'cadalog:saved:v1';
  let saved = new Set();
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(value)) saved = new Set(value.filter(x => typeof x === 'string'));
  } catch (_) { /* The directory remains usable when local storage is blocked. */ }
  let savedOnly = false;

  function listingHTML(company, index) {
    const liked = saved.has(company.slug);
    const twoServices = company.services.slice(0, 2).map(safe).join(' · ');
    return '<article class="listing-row">' +
      '<span class="listing-number">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<div class="listing-primary"><h3><a href="' + profileUrl(company.slug) + '">' + safe(company.name) + '</a></h3><p>' + safe(company.line) + '</p></div>' +
      '<div class="listing-services">' + twoServices + '</div>' +
      '<div class="listing-discipline">' + safe(company.focus) + '</div>' +
      '<div class="listing-buttons"><button type="button" class="save-button' + (liked ? ' is-saved' : '') + '" data-save="' + safe(company.slug) + '" aria-pressed="' + liked + '" aria-label="' + (liked ? 'Remove ' : 'Save ') + safe(company.name) + (liked ? ' from saved' : ' to saved') + '">' + (liked ? 'Saved' : 'Save') + '</button><a class="listing-open" href="' + profileUrl(company.slug) + '" aria-label="View ' + safe(company.name) + '">↗</a></div>' +
      '</article>';
  }

  function initDirectory() {
    const results = $('#results');
    if (!results) return;
    const search = $('#search-input');
    const service = $('#service-select');
    const discipline = $('#focus-select');
    const sort = $('#sort-select');
    const resetButton = $('#clear-filters');
    const savedButton = $('#saved-toggle');

    function render() {
      const query = search.value.trim().toLocaleLowerCase();
      const matches = companies.filter(item => {
        const searchable = [item.name, item.focus, item.line, item.detail, ...item.services, ...item.formats].join(' ').toLocaleLowerCase();
        return (!query || searchable.includes(query)) && (!service.value || item.services.includes(service.value)) && (!discipline.value || item.focus === discipline.value) && (!savedOnly || saved.has(item.slug));
      }).sort((a, b) => sort.value === 'reverse' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
      results.innerHTML = matches.map(listingHTML).join('');
      results.hidden = matches.length === 0;
      $('#empty-state').hidden = matches.length !== 0;
      $('#result-count').textContent = matches.length + (matches.length === 1 ? ' company' : ' companies');
      $('#saved-count').textContent = String(saved.size);
      savedButton.setAttribute('aria-pressed', String(savedOnly));
      resetButton.hidden = !(query || service.value || discipline.value || savedOnly || sort.value !== 'name');
    }
    function reset() {
      search.value = ''; service.value = ''; discipline.value = ''; sort.value = 'name'; savedOnly = false;
      render(); search.focus();
    }
    [search, service, discipline, sort].forEach(control => control.addEventListener(control === search ? 'input' : 'change', render));
    resetButton.addEventListener('click', reset);
    $('#empty-reset').addEventListener('click', reset);
    savedButton.addEventListener('click', () => { savedOnly = !savedOnly; render(); });
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-save]');
      if (!button) return;
      const slug = button.getAttribute('data-save');
      if (saved.has(slug)) saved.delete(slug); else saved.add(slug);
      try { localStorage.setItem(storageKey, JSON.stringify([...saved])); } catch (_) { /* Non-persistent session */ }
      render();
      const newButton = results.querySelector('[data-save="' + CSS.escape(slug) + '"]');
      if (newButton) newButton.focus({ preventScroll: true });
    });
    render();
  }

  function initProfile() {
    const params = new URLSearchParams(location.search);
    if (!params.has('company')) return;
    $('#home-view').hidden = true;
    $('#profile-view').hidden = false;
    const slug = params.get('company');
    const company = companies.find(item => item.slug === slug);
    if (!company) {
      document.title = 'Company not found — CADalog';
      $('#profile-content').innerHTML = '<div class="profile-missing"><h1>Company not found.</h1><p>This entry may have moved or been removed.</p><a href="./#directory">Return to the directory ↗</a></div>';
      return;
    }
    document.title = company.name + ' — CADalog';
    const related = companies.filter(item => item.slug !== slug).sort((a, b) => Number(b.focus === company.focus) - Number(a.focus === company.focus)).slice(0, 3);
    $('#profile-content').innerHTML = '<div class="profile-identity"><div><p class="profile-category">Company profile / ' + safe(company.focus) + '</p><h1 id="profile-title">' + safe(company.name) + '</h1></div><p class="profile-deck">' + safe(company.line) + '</p></div>' +
      '<div class="profile-columns"><div class="profile-main"><h2>About the company</h2><p>' + safe(company.detail) + '</p><p class="profile-source">Description based on <a href="' + safe(company.source) + '" rel="noopener noreferrer" target="_blank">the company’s published service page ↗</a>.</p></div>' +
      '<aside class="profile-aside"><h2>Listed services</h2><dl><div><dt>Discipline</dt><dd>' + safe(company.focus) + '</dd></div><div><dt>Services</dt><dd>' + company.services.map(safe).join('<br>') + '</dd></div><div><dt>File formats</dt><dd>' + company.formats.map(safe).join(' · ') + '</dd></div></dl><a class="external-link" href="' + safe(company.website) + '" target="_blank" rel="noopener noreferrer">Company website ↗</a></aside></div>' +
      '<div class="profile-notice"><strong>About this listing</strong><p>Based on public information. CADalog has not independently verified service quality, availability or pricing. Please confirm project details with the provider.</p></div>' +
      '<section class="related" aria-labelledby="related-heading"><h2 id="related-heading">Other companies in the index</h2><div>' + related.map(item => '<a href="' + profileUrl(item.slug) + '"><span>' + safe(item.name) + '</span><span aria-hidden="true">↗</span></a>').join('') + '</div></section>';
  }

  function initSubmit() {
    const dialog = $('#submit-dialog');
    document.querySelectorAll('[data-open-submit]').forEach(button => button.addEventListener('click', () => {
      const menu = $('#mobile-menu');
      menu.hidden = true;
      $('#mobile-menu-button').setAttribute('aria-expanded', 'false');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
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
      const body = '### Company\n' + name + '\n\n### Website\n' + website + '\n\n### Services / notes\n' + (notes || '(Not provided)') + '\n\n---\nSubmitted through the CADalog form. Inclusion is editorial and not guaranteed.';
      location.href = 'https://github.com/Grand-Code40/CADalog/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
    });
  }

  function initNavigation() {
    const button = $('#mobile-menu-button');
    const menu = $('#mobile-menu');
    button.addEventListener('click', () => {
      menu.hidden = !menu.hidden;
      button.setAttribute('aria-expanded', String(!menu.hidden));
      button.setAttribute('aria-label', menu.hidden ? 'Open navigation' : 'Close navigation');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    }));
  }

  $('#footer-year').textContent = String(new Date().getFullYear());
  initNavigation();
  initSubmit();
  initProfile();
  if (!$('#home-view').hidden) initDirectory();
})();
