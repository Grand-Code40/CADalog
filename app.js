/* CADalog: static directory, with no backend or tracking. */
(() => {
  'use strict';
  const sourceCompanies = Array.isArray(window.CADALOG_COMPANIES) ? window.CADALOG_COMPANIES : [];
  const directory = window.CADALOG;
  let state = directory.readState(location.search);
  const lang = state.lang;
  const copy = window.CADALOG_LOCALES[lang];
  const label = value => copy.labels[value] || value;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const companies = directory.localizeCompanies(sourceCompanies, window.CADALOG_LOCALES, lang);
  const bookmark = '<svg viewBox="0 0 20 22" aria-hidden="true"><path d="M4 3h12v16l-6-4-6 4V3Z"></path></svg>';
  const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg>';
  const storageKey = 'cadalog:saved:v1';
  const homeUrl = lang === 'en' ? './?lang=en' : './';
  let saved = new Set();
  let storageAvailable = true;
  let renderDirectory = null;
  const isProfile = new URLSearchParams(location.search).has('company');

  document.documentElement.lang = lang;
  document.title = copy.title;
  $('meta[name="description"]').content = copy.description;
  $('meta[property="og:title"]').content = copy.title;
  $('meta[property="og:description"]').content = copy.description;
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = copy[element.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', copy[element.dataset.i18nAria]); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = copy[element.dataset.i18nPlaceholder]; });
  document.querySelectorAll('[data-label]').forEach(element => { element.textContent = label(element.dataset.label); });
  $('.wordmark').href = homeUrl;
  $('.header-inner nav a[href$="#about"]').href = homeUrl + '#about';
  $('[data-suggest-link]').href = homeUrl + '#suggest';

  try { saved = new Set(directory.parseSaved(localStorage.getItem(storageKey), companies)); }
  catch (_) { storageAvailable = false; }

  function saveButton(company) {
    const active = saved.has(company.slug);
    return '<button class="save-button" type="button" data-save="' + safe(company.slug) + '" aria-pressed="' + active + '" aria-label="' + safe((active ? copy.removeAria : copy.saveAria).replace('{name}', company.name)) + '">' + bookmark + '<span>' + (active ? copy.saved : copy.save) + '</span></button>';
  }

  function listingHTML(company) {
    return '<article class="listing-row" aria-labelledby="company-' + safe(company.slug) + '">' +
      '<div class="listing-primary"><h3 id="company-' + safe(company.slug) + '"><a href="' + safe(directory.profileUrl(company.slug, state)) + '">' + safe(company.name) + '</a></h3><p>' + safe(company.line) + '</p><p class="listing-formats"><span>' + copy.formats + '</span>' + company.formats.map(value => safe(label(value))).join(' / ') + '</p></div>' +
      '<ul class="listing-services" aria-label="' + copy.services + '">' + company.services.map(service => '<li>' + safe(label(service)) + '</li>').join('') + '</ul>' +
      '<p class="listing-discipline"><span class="mobile-field-label">' + copy.discipline + ':</span>' + safe(label(company.focus)) + '</p>' + saveButton(company) + '</article>';
  }

  function updateNavigation() {
    document.querySelectorAll('[data-directory-link]').forEach(link => { link.href = directory.directoryUrl(state); });
    const params = new URLSearchParams(directory.stateQuery(state));
    const company = new URLSearchParams(location.search).get('company');
    if (company !== null) params.set('company', company);
    if (lang === 'ru') params.set('lang', 'en'); else params.delete('lang');
    const toggle = $('#language-switch');
    toggle.href = './' + (params.size ? '?' + params.toString() : '') + location.hash;
    toggle.textContent = lang === 'ru' ? 'EN' : 'РУ';
    toggle.lang = lang === 'ru' ? 'en' : 'ru';
    toggle.hreflang = toggle.lang;
    toggle.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  }

  function updateSavedFeedback() {
    $('#saved-count').textContent = String(saved.size);
    $('#storage-warning').hidden = storageAvailable;
    $('#saved-note').hidden = !state.savedOnly || !storageAvailable;
  }

  function updateURL() {
    const query = directory.stateQuery(state);
    try { history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash); }
    catch (_) { /* Directory remains usable in restricted file previews. */ }
    updateNavigation();
  }

  function companyCount(number) {
    if (lang === 'en') return number + (number === 1 ? ' company' : ' companies');
    const mod100 = number % 100;
    const mod10 = number % 10;
    const word = mod100 >= 11 && mod100 <= 14 ? 'компаний' : mod10 === 1 ? 'компания' : mod10 >= 2 && mod10 <= 4 ? 'компании' : 'компаний';
    return number + ' ' + word;
  }

  function initDirectory() {
    const search = $('#search-input');
    const service = $('#service-select');
    const discipline = $('#focus-select');
    const sort = $('#sort-select');
    const results = $('#results');

    function syncControls() {
      search.value = state.query; service.value = state.service; discipline.value = state.discipline; sort.value = state.sort;
    }
    function render() {
      const matches = directory.filterCompanies(companies, state, saved);
      results.innerHTML = matches.map(listingHTML).join('');
      results.hidden = matches.length === 0;
      $('.listing-head').hidden = matches.length === 0;
      $('#empty-state').hidden = matches.length !== 0;
      const filtered = Boolean(state.query.trim() || state.service || state.discipline || state.sort !== 'name');
      const total = state.savedOnly ? saved.size : companies.length;
      $('#result-count').textContent = companyCount(matches.length) + (matches.length !== total ? ' ' + copy.of + ' ' + total : '') + (state.savedOnly ? ' ' + copy.savedSuffix : '');
      $('#all-toggle').setAttribute('aria-pressed', String(!state.savedOnly));
      $('#saved-toggle').setAttribute('aria-pressed', String(state.savedOnly));
      $('#clear-filters').hidden = !filtered;
      const emptySaved = state.savedOnly && saved.size === 0;
      $('#empty-title').textContent = emptySaved ? copy.noSaved : (state.savedOnly ? copy.noSavedMatches : copy.noMatches);
      $('#empty-description').textContent = emptySaved ? copy.noSavedHint : copy.noMatchesHint;
      $('#empty-reset').textContent = emptySaved ? copy.browseAll : copy.clearFilters;
      updateSavedFeedback(); updateNavigation();
    }
    function clearFilters(browseAll = false) {
      state = { query: '', service: '', discipline: '', sort: 'name', savedOnly: browseAll ? false : state.savedOnly, lang };
      syncControls(); render(); updateURL(); search.focus({ preventScroll: true });
    }
    function readControls() {
      state.query = search.value; state.service = service.value; state.discipline = discipline.value; state.sort = sort.value;
      render(); updateURL();
    }
    $('#filters').addEventListener('submit', event => { event.preventDefault(); readControls(); });
    [search, service, discipline, sort].forEach(control => control.addEventListener(control === search ? 'input' : 'change', readControls));
    $('#all-toggle').addEventListener('click', () => { state.savedOnly = false; render(); updateURL(); });
    $('#saved-toggle').addEventListener('click', () => { state.savedOnly = true; render(); updateURL(); });
    $('#clear-filters').addEventListener('click', () => clearFilters());
    $('#empty-reset').addEventListener('click', () => clearFilters(state.savedOnly && saved.size === 0));
    window.addEventListener('popstate', () => { state = directory.readState(location.search); syncControls(); render(); });
    renderDirectory = render;
    syncControls(); render();
  }

  function initProfile() {
    const slug = new URLSearchParams(location.search).get('company');
    const company = companies.find(item => item.slug === slug);
    $('#home-view').hidden = true;
    $('#profile-view').hidden = false;
    if (!company) {
      document.title = copy.companyMissing + ' — CADalog';
      $('#profile-content').innerHTML = '<div class="profile-missing"><h1 id="profile-title">' + copy.companyMissing + '</h1><p>' + copy.companyMissingHint + '</p><a href="' + safe(directory.directoryUrl(state)) + '">' + copy.returnDirectory + '</a></div>';
      return;
    }
    document.title = company.name + ' — CADalog';
    $('meta[name="description"]').content = company.line;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = company.line;
    const related = companies.filter(item => item.slug !== slug && item.focus === company.focus).sort((a, b) => a.name.localeCompare(b.name, 'en')).slice(0, 3);
    const nearby = related.length ? related : companies.filter(item => item.slug !== slug).sort((a, b) => a.name.localeCompare(b.name, 'en')).slice(0, 3);
    $('#profile-content').innerHTML =
      '<div class="profile-heading"><div><h1 id="profile-title">' + safe(company.name) + '</h1><p>' + safe(company.line) + '</p></div>' + saveButton(company) + '</div>' +
      '<div class="profile-layout"><div class="profile-main"><h2>' + copy.offer + '</h2><p>' + safe(company.detail) + '</p><p class="profile-source">' + copy.source + ' <a href="' + safe(company.source) + '" rel="noopener noreferrer" target="_blank">' + copy.sourceLink + '<span class="sr-only"> ' + copy.newTab + '</span></a></p><a class="button-primary" href="' + safe(company.website) + '" rel="noopener noreferrer" target="_blank">' + copy.visitWebsite + external + '<span class="sr-only">' + copy.newTab + '</span></a></div>' +
      '<aside class="profile-facts" aria-label="' + copy.capabilities + '"><h2>' + copy.facts + '</h2><dl><div><dt>' + copy.discipline + '</dt><dd>' + safe(label(company.focus)) + '</dd></div><div><dt>' + copy.services + '</dt><dd><ul>' + company.services.map(service => '<li>' + safe(label(service)) + '</li>').join('') + '</ul></dd></div><div><dt>' + copy.formatsLabel + '</dt><dd>' + company.formats.map(value => safe(label(value))).join(' / ') + '</dd></div></dl><p class="form-note">' + copy.confirmDetails + '</p></aside></div>' +
      '<div class="profile-notice"><h2>' + copy.listingAbout + '</h2><p>' + copy.listingNotice + '</p><p><a href="' + homeUrl + '#suggest">' + copy.correction + '</a></p></div>' +
      '<section class="related" aria-labelledby="related-heading"><h2 id="related-heading">' + (related.length ? copy.related : copy.otherCompanies) + '</h2><ul>' + nearby.map(item => '<li><a href="' + safe(directory.profileUrl(item.slug, state)) + '">' + safe(item.name) + '</a></li>').join('') + '</ul></section>';
  }

  function initSaving() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-save]');
      if (!button) return;
      const company = companies.find(item => item.slug === button.dataset.save);
      if (!company) return;
      const oldButtons = Array.from(document.querySelectorAll('[data-save]'));
      const position = oldButtons.indexOf(button);
      if (saved.has(company.slug)) saved.delete(company.slug); else saved.add(company.slug);
      try { localStorage.setItem(storageKey, JSON.stringify([...saved])); }
      catch (_) { storageAvailable = false; }
      $('#save-status').textContent = (saved.has(company.slug) ? copy.savedStatus : copy.removedStatus).replace('{name}', company.name) + (storageAvailable ? '' : ' ' + copy.storageWarning);
      if (renderDirectory) renderDirectory();
      else {
        button.outerHTML = saveButton(company);
        if (!storageAvailable && !$('#profile-storage-warning')) {
          const notice = document.createElement('p');
          notice.id = 'profile-storage-warning'; notice.className = 'storage-warning'; notice.textContent = copy.storageWarning;
          $('.profile-heading').after(notice);
        }
      }
      const buttons = Array.from(document.querySelectorAll('[data-save]'));
      const next = buttons.find(item => item.dataset.save === company.slug) || buttons[Math.min(position, buttons.length - 1)] || $('#empty-reset');
      if (next && !next.hidden) next.focus({ preventScroll: true });
      updateSavedFeedback();
    });
    window.addEventListener('storage', event => {
      if (event.key !== storageKey && event.key !== null) return;
      saved = new Set(directory.parseSaved(event.newValue, companies));
      if (renderDirectory) renderDirectory();
      else document.querySelectorAll('[data-save]').forEach(button => {
        const company = companies.find(item => item.slug === button.dataset.save);
        if (company) button.outerHTML = saveButton(company);
      });
      updateSavedFeedback();
    });
  }

  function initSuggest() {
    const details = $('#suggest-details');
    function openSuggestion() { details.open = true; }
    if (location.hash === '#suggest') openSuggestion();
    window.addEventListener('hashchange', () => { if (location.hash === '#suggest') openSuggestion(); });
    if (!isProfile) document.querySelectorAll('[data-suggest-link]').forEach(link => link.addEventListener('click', openSuggestion));
    $('#submit-form').addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      const fields = { name: $('#company-name'), website: $('#company-website') };
      const errors = directory.validateSuggestion(fields.name.value, fields.website.value);
      const messages = { name: copy.invalidName, website: copy.invalidWebsite };
      Object.keys(fields).forEach(key => {
        const error = $('#' + key + '-error');
        error.hidden = !errors[key]; error.textContent = errors[key] ? messages[key] : '';
        fields[key].setAttribute('aria-invalid', String(Boolean(errors[key])));
      });
      const invalid = Object.keys(fields).find(key => errors[key]);
      if (invalid) { fields[invalid].focus(); return; }
      if (!form.reportValidity()) return;
      location.href = directory.suggestionUrl(fields.name.value, fields.website.value, $('#company-notes').value, lang);
    });
  }

  updateNavigation();
  initSaving();
  initSuggest();
  if (isProfile) initProfile(); else initDirectory();
})();
