/* Pure directory logic: shared by the browser and dependency-free Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CADALOG = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const services = ['Raster to vector', 'PDF to CAD', 'Paper & sketch', 'Drawing digitization'];
  const tags = ['Architecture', 'Engineering', 'Survey & civil', 'Multi-disciplinary', 'DWG', 'DXF', 'DGN', 'Layered CAD'];

  function readState(search) {
    const params = new URLSearchParams(search);
    return {
      query: params.get('q') || '',
      service: services.includes(params.get('service')) ? params.get('service') : '',
      tags: [...new Set(params.getAll('tag').filter(tag => tags.includes(tag)))],
      sort: params.get('sort') === 'reverse' ? 'reverse' : 'name',
      lang: params.get('lang') === 'en' ? 'en' : 'ru'
    };
  }
  function stateQuery(state) {
    const params = new URLSearchParams();
    if (state.lang === 'en') params.set('lang', 'en');
    if (state.query.trim()) params.set('q', state.query.trim());
    if (state.service) params.set('service', state.service);
    state.tags.forEach(tag => params.append('tag', tag));
    if (state.sort === 'reverse') params.set('sort', 'reverse');
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
        [...company.services, ...company.formats, ...company.tags].forEach(value => {
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
  function filterCompanies(companies, state) {
    const query = state.query.trim().toLocaleLowerCase('en');
    return companies.filter(company => {
      const text = [company.name, company.line, company.detail, ...company.tags, company.searchTerms || '', ...company.services, ...company.formats].join(' ').toLocaleLowerCase('en');
      return (!query || text.includes(query)) &&
        (!state.service || company.services.includes(state.service)) &&
        state.tags.every(tag => company.tags.includes(tag));
    }).sort((a, b) => state.sort === 'reverse' ? b.name.localeCompare(a.name, 'en') : a.name.localeCompare(b.name, 'en'));
  }
  return { tags, localizeCompanies, readState, stateQuery, directoryUrl, profileUrl, filterCompanies };
});
