/* CADalog: static directory. No accounts, storage, tracking or submission endpoint. */
(() => {
  'use strict';
  const directory = window.CADALOG;
  let state = directory.readState(location.search);
  const lang = state.lang;
  const copy = window.CADALOG_LOCALES[lang];
  const label = value => copy.labels[value] || value;
  const $ = (selector, root = document) => root.querySelector(selector);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const companies = directory.localizeCompanies(window.CADALOG_COMPANIES || [], window.CADALOG_LOCALES, lang);
  const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg>';
  const homeUrl = lang === 'en' ? './?lang=en' : './';
  const isProfile = new URLSearchParams(location.search).has('company');
  const domain = url => new URL(url).hostname.replace(/^www\./, '');

  document.documentElement.lang = lang;
  document.title = copy.title;
  $('meta[name="description"]').content = copy.description;
  $('meta[property="og:title"]').content = copy.title;
  $('meta[property="og:description"]').content = copy.description;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = copy[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', copy[el.dataset.i18nAria]); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = copy[el.dataset.i18nPlaceholder]; });
  document.querySelectorAll('[data-label]').forEach(el => { el.textContent = label(el.dataset.label); });
  $('.wordmark').href = homeUrl;
  $('.header-inner nav a[href$="#about"]').href = homeUrl + '#about';
  $('.site-footer > a').href = homeUrl + '#about';

  function externalLink(url, text, className = '') {
    return '<a class="' + className + '" href="' + safe(url) + '" target="_blank" rel="noopener noreferrer">' + safe(text) + external + '<span class="sr-only"> ' + copy.newTab + '</span></a>';
  }
  function brandHTML(company) {
    const media = company.media;
    return '<div class="company-brand' + (media?.surface === 'dark' ? ' brand-dark' : '') + '">' + (media?.src ? '<img class="company-logo' + (media.kind === 'icon' ? ' logo-icon' : '') + '" src="' + safe(media.src) + '" alt="' + safe(copy.logoAlt.replace('{name}', company.name)) + '" width="192" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') + '<span class="brand-fallback"' + (media?.src && media.kind !== 'icon' ? ' hidden' : '') + '>' + safe(company.name) + '</span></div>';
  }
  function initImageFallbacks(root = document) {
    root.querySelectorAll('.company-logo').forEach(img => {
      function fallback() { img.hidden = true; img.nextElementSibling.hidden = false; }
      img.addEventListener('error', fallback, { once: true });
      if (img.complete && !img.naturalWidth) fallback();
    });
  }
  function tagHTML(company) {
    return '<ul class="company-tags" aria-label="' + copy.tags + '">' + company.tags.map(tag => '<li><a href="' + safe(directory.directoryUrl({...state,tags:[tag]})) + '" data-tag="' + safe(tag) + '" aria-label="' + safe(copy.filterByTag.replace('{tag}', label(tag))) + '">' + safe(label(tag)) + '</a></li>').join('') + '</ul>';
  }
  function noteHTML(company) {
    return company.notice ? '<p class="company-notice">' + safe(copy[company.notice]) + '</p>' : '';
  }
  function listingHTML(company) {
    return '<article class="company-card" aria-labelledby="company-' + safe(company.slug) + '">' +
      brandHTML(company) + '<div class="company-body"><h3 id="company-' + safe(company.slug) + '"><a href="' + safe(directory.profileUrl(company.slug,state)) + '">' + safe(company.name) + '</a></h3><p class="company-summary">' + safe(company.line) + '</p>' + tagHTML(company) +
      '<dl class="company-details"><div><dt>' + copy.services + '</dt><dd>' + company.services.map(value => safe(label(value))).join(' · ') + '</dd></div><div><dt>' + copy.formats + '</dt><dd>' + company.formats.map(value => safe(label(value))).join(' / ') + '</dd></div></dl>' + noteHTML(company) + '</div>' +
      '<div class="company-links"><a class="profile-link" href="' + safe(directory.profileUrl(company.slug,state)) + '">' + copy.profile + '<span aria-hidden="true"> →</span></a>' + externalLink(company.source, copy.officialMaterials) + '</div></article>';
  }
  function updateNavigation() {
    document.querySelectorAll('[data-directory-link]').forEach(link => { link.href = directory.directoryUrl(state); });
    const params = new URLSearchParams(directory.stateQuery(state));
    const company = new URLSearchParams(location.search).get('company');
    if (company !== null) params.set('company',company);
    if (lang === 'ru') params.set('lang','en'); else params.delete('lang');
    const toggle = $('#language-switch');
    toggle.href = './' + (params.size ? '?' + params.toString() : '') + location.hash;
    toggle.textContent = lang === 'ru' ? 'EN' : 'РУ';
    toggle.lang = lang === 'ru' ? 'en' : 'ru'; toggle.hreflang = toggle.lang;
    toggle.setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  }
  function updateURL() {
    const query = directory.stateQuery(state);
    try { history.replaceState(null,'',location.pathname + (query ? '?' + query : '') + location.hash); } catch (_) { /* File previews retain usable filters. */ }
    updateNavigation();
  }
  function companyCount(number) {
    if (lang === 'en') return number + (number === 1 ? ' company' : ' companies');
    const mod100 = number % 100, mod10 = number % 10;
    return number + ' ' + (mod100 >= 11 && mod100 <= 14 ? 'компаний' : mod10 === 1 ? 'компания' : mod10 >= 2 && mod10 <= 4 ? 'компании' : 'компаний');
  }
  function initDirectory() {
    const search = $('#search-input'), service = $('#service-select'), sort = $('#sort-select'), results = $('#results');
    $('#tag-controls').innerHTML = directory.tags.map(tag => '<label class="tag-option"><input type="checkbox" name="tag" value="' + safe(tag) + '"><span>' + safe(label(tag)) + '</span></label>').join('');
    const tagInputs = [...document.querySelectorAll('#tag-controls input')];
    function syncControls() {
      search.value = state.query; service.value = state.service; sort.value = state.sort;
      tagInputs.forEach(input => { input.checked = state.tags.includes(input.value); });
    }
    function render() {
      const matches = directory.filterCompanies(companies,state);
      results.innerHTML = matches.map(listingHTML).join('');
      results.hidden = !matches.length; $('#empty-state').hidden = Boolean(matches.length);
      $('#result-count').textContent = companyCount(matches.length) + (matches.length !== companies.length ? ' ' + copy.of + ' ' + companies.length : '');
      $('#clear-filters').hidden = !(state.query.trim() || state.service || state.tags.length || state.sort !== 'name');
      initImageFallbacks(results); updateNavigation();
    }
    function clearFilters() {
      state = {query:'',service:'',tags:[],sort:'name',lang};
      syncControls(); render(); updateURL(); search.focus({preventScroll:true});
    }
    function readControls() {
      state = {...state,query:search.value,service:service.value,sort:sort.value,tags:tagInputs.filter(input=>input.checked).map(input=>input.value)};
      render(); updateURL();
    }
    $('#filters').addEventListener('submit',event=>{event.preventDefault();readControls();});
    [search,service,sort,...tagInputs].forEach(control=>control.addEventListener(control===search?'input':'change',readControls));
    $('#clear-filters').addEventListener('click',clearFilters); $('#empty-reset').addEventListener('click',clearFilters);
    results.addEventListener('click',event=>{
      const link=event.target.closest('[data-tag]');
      if(!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); state.tags=[link.dataset.tag]; syncControls();render();updateURL();
      tagInputs.find(input=>input.value===state.tags[0])?.focus({preventScroll:true});
    });
    window.addEventListener('popstate',()=>{state=directory.readState(location.search);syncControls();render();});
    syncControls();render();
  }
  function initProfile() {
    const slug=new URLSearchParams(location.search).get('company');
    const company=companies.find(item=>item.slug===slug);
    $('#home-view').hidden=true;$('#profile-view').hidden=false;
    if(!company){document.title=copy.companyMissing+' — CADalog';$('#profile-content').innerHTML='<div class="profile-missing"><h1 id="profile-title">'+copy.companyMissing+'</h1><p>'+copy.companyMissingHint+'</p><a href="'+safe(directory.directoryUrl(state))+'">'+copy.returnDirectory+'</a></div>';return;}
    document.title=company.name+' — CADalog';$('meta[name="description"]').content=company.line;$('meta[property="og:title"]').content=document.title;$('meta[property="og:description"]').content=company.line;
    const related=companies.filter(item=>item.slug!==slug&&item.tags.some(tag=>company.tags.includes(tag))).sort((a,b)=>a.name.localeCompare(b.name,'en')).slice(0,3);
    $('#profile-content').innerHTML='<div class="profile-heading">'+brandHTML(company)+'<div><h1 id="profile-title">'+safe(company.name)+'</h1><p>'+safe(company.line)+'</p>'+tagHTML(company)+'</div></div>'+noteHTML(company)+
      '<div class="profile-layout"><div class="profile-main"><h2>'+copy.offer+'</h2><p>'+safe(company.detail)+'</p><p class="profile-source">'+copy.source+' '+externalLink(company.source,copy.sourceLink)+'</p>'+externalLink(company.website,copy.visitWebsite,'button-primary')+'</div><aside class="profile-facts" aria-label="'+copy.capabilities+'"><h2>'+copy.facts+'</h2><dl><div><dt>'+copy.services+'</dt><dd><ul>'+company.services.map(service=>'<li>'+safe(label(service))+'</li>').join('')+'</ul></dd></div><div><dt>'+copy.formatsLabel+'</dt><dd>'+company.formats.map(value=>safe(label(value))).join(' / ')+'</dd></div><div><dt>'+copy.officialWebsite+'</dt><dd><a href="'+safe(company.website)+'" target="_blank" rel="noopener noreferrer">'+safe(domain(company.website))+'</a></dd></div></dl><p class="form-note">'+copy.confirmDetails+'</p></aside></div><div class="profile-notice"><h2>'+copy.listingAbout+'</h2><p>'+copy.listingNotice+'</p></div><section class="related" aria-labelledby="related-heading"><h2 id="related-heading">'+copy.related+'</h2><ul>'+related.map(item=>'<li><a href="'+safe(directory.profileUrl(item.slug,state))+'">'+safe(item.name)+'</a></li>').join('')+'</ul></section>';
    initImageFallbacks();
  }
  updateNavigation();
  if(isProfile)initProfile();else initDirectory();
})();
