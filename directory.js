/* Pure directory logic: shared by the browser and dependency-free Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CADALOG = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const services = ['Raster to vector', 'PDF to CAD', 'Paper & sketch', 'Drawing digitization'];
  const disciplines = ['Architecture', 'Engineering', 'Survey & civil', 'Multi-disciplinary'];

  function readState(search) {
    const params = new URLSearchParams(search);
    return {
      query: params.get('q') || '',
      service: services.includes(params.get('service')) ? params.get('service') : '',
      discipline: disciplines.includes(params.get('discipline')) ? params.get('discipline') : '',
      sort: params.get('sort') === 'reverse' ? 'reverse' : 'name',
      savedOnly: params.get('saved') === '1',
      lang: params.get('lang') === 'en' ? 'en' : 'ru'
    };
  }
  function stateQuery(state) {
    const params = new URLSearchParams();
    if (state.lang === 'en') params.set('lang', 'en');
    if (state.query.trim()) params.set('q', state.query.trim());
    if (state.service) params.set('service', state.service);
    if (state.discipline) params.set('discipline', state.discipline);
    if (state.sort === 'reverse') params.set('sort', 'reverse');
    if (state.savedOnly) params.set('saved', '1');
    return params.toString();
  }
  function directoryUrl(state) {
    const query = stateQuery(state);
    return './' + (query ? '?' + query : '') + '#directory';
  }
  function profileUrl(slug, state) {
    const params = new URLSearchParams(stateQuery(state));
    params.set('company', slug);
    return './?' + params.toString();
  }
  function localizeCompanies(companies, locales, lang) {
    const current = locales[lang] || {};
    return companies.map(company => {
      const translation = current.companies?.[company.slug] || {};
      const searchTerms = [company.line, company.detail, company.searchTerms || ''];
      Object.values(locales).forEach(locale => {
        const text = locale.companies?.[company.slug] || {};
        searchTerms.push(text.line || '', text.detail || '');
        [...company.services, ...company.formats, company.focus].forEach(value => {
          searchTerms.push(locale.labels?.[value] || value);
        });
      });
      return {
        ...company,
        line: translation.line || company.line,
        detail: translation.detail || company.detail,
        searchTerms: searchTerms.join(' ')
      };
    });
  }
  function filterCompanies(companies, state, saved) {
    const query = state.query.trim().toLocaleLowerCase('en');
    return companies.filter(company => {
      const text = [company.name, company.line, company.detail, company.focus, company.searchTerms || '', ...company.services, ...company.formats].join(' ').toLocaleLowerCase('en');
      return (!query || text.includes(query)) &&
        (!state.service || company.services.includes(state.service)) &&
        (!state.discipline || company.focus === state.discipline) &&
        (!state.savedOnly || saved.has(company.slug));
    }).sort((a, b) => state.sort === 'reverse' ? b.name.localeCompare(a.name, 'en') : a.name.localeCompare(b.name, 'en'));
  }
  function parseSaved(raw, companies) {
    try {
      const value = JSON.parse(raw || '[]');
      if (!Array.isArray(value)) return [];
      const valid = new Set(companies.map(company => company.slug));
      return [...new Set(value.filter(slug => typeof slug === 'string' && valid.has(slug)))];
    } catch (_) { return []; }
  }
  function validateSuggestion(name, website) {
    const errors = {};
    if (!name.trim()) errors.name = 'Enter the company name.';
    try {
      const url = new URL(website);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
    } catch (_) { errors.website = 'Enter a full website address beginning with https:// or http://.'; }
    return errors;
  }
  function suggestionUrl(name, website, notes, lang = 'en') {
    const params = new URLSearchParams({
      title: (lang === 'ru' ? 'Предложение для каталога: ' : 'Directory suggestion: ') + name.trim(),
      body: lang === 'ru' ? '### Компания\n' + name.trim() + '\n\n### Сайт\n' + website.trim() + '\n\n### Услуги / комментарий\n' + (notes.trim() || '(Не указано)') + '\n\n---\nПредложено через форму CADalog. Добавление в каталог не гарантируется.' : '### Company\n' + name.trim() + '\n\n### Website\n' + website.trim() + '\n\n### Services / notes\n' + (notes.trim() || '(Not provided)') + '\n\n---\nSubmitted through the CADalog form. Inclusion is editorial and not guaranteed.'
    });
    return 'https://github.com/Grand-Code40/CADalog/issues/new?' + params.toString();
  }
  return { localizeCompanies, readState, stateQuery, directoryUrl, profileUrl, filterCompanies, parseSaved, validateSuggestion, suggestionUrl };
});
