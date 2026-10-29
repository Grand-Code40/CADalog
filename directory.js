/* Pure directory logic: shared by the browser and dependency-free Node tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CADALOG = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const services = ['Raster to vector', 'PDF to CAD', 'Paper & sketch', 'Drawing digitization'];
  const tags = ['Architecture', 'Engineering', 'Survey & civil', 'Multi-disciplinary'];

  function readState(search) {
    const params = new URLSearchParams(search);
    return {
      query: params.get('q') || '',
      service: services.includes(params.get('service')) ? params.get('service') : '',
      tags: [...new Set(params.getAll('tag').filter(tag => tags.includes(tag)))],
      sort: 'name', // Legacy sort parameters are deliberately ignored.
      lang: params.get('lang') === 'en' ? 'en' : 'ru'
    };
  }
  function stateQuery(state) {
    const params = new URLSearchParams();
    if (state.lang === 'en') params.set('lang', 'en');
    if (state.query.trim()) params.set('q', state.query.trim());
    if (state.service) params.set('service', state.service);
    [...new Set(state.tags.filter(tag => tags.includes(tag)))].forEach(tag => params.append('tag', tag));
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
  // Deliberately small aliases, not general transliteration or fuzzy matching.
  const wordAliases = {кад: 'cad', пдф: 'pdf', двг: 'dwg', дхф: 'dxf', дгн: 'dgn', двф: 'dwf'};
  const exactWords = new Set(['cad', 'cam', 'pdf', 'dwg', 'dxf', 'dgn', 'dwf', 'bim']);
  const nameAliases = {'convert2cad': ['конверт 2 кад', 'конверт ту кад']};

  function searchWords(value, splitCamel = false) {
    let text = String(value || '').normalize('NFKC');
    if (splitCamel) text = text.replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2')
      .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2');
    return (text.replace(/(\p{L})(\p{N})/gu, '$1 $2')
      .replace(/(\p{N})(\p{L})/gu, '$1 $2')
      .toLocaleLowerCase('en').replace(/ё/g, 'е')
      .match(/[\p{L}\p{N}]+/gu) || []).map(word => Object.hasOwn(wordAliases, word) ? wordAliases[word] : word);
  }
  function searchCompanies(companies, query) {
    const queryWords = searchWords(query);
    const terms = [...new Set(queryWords)];
    if (!query.trim()) return companies;
    if (!terms.length) return []; // Punctuation alone is not an empty/reset query.
    const index = companies.map(company => {
      const names = [company.name, ...(Object.hasOwn(nameAliases, company.slug) ? nameAliases[company.slug] : [])];
      const fields = [...names, company.line, company.detail, ...company.tags, company.searchTerms || '', ...company.services, ...company.formats];
      return {company, names: names.map(name => searchWords(name).join('')), words: new Set([
        ...fields.flatMap(value => searchWords(value, true)), ...names.map(name => searchWords(name).join(''))
      ])};
    });
    // A complete brand name should not be diluted by words in another description.
    const exactName = index.filter(entry => entry.names.includes(terms.join('')));
    if (exactName.length) return exactName.map(entry => entry.company);
    const matches = index.filter(entry => terms.every(term => entry.words.has(term) ||
      (term.length >= 3 && !exactWords.has(term) && !/\p{N}/u.test(term) &&
        [...entry.words].some(word => word.startsWith(term)))));
    if (matches.length) return matches.map(entry => entry.company);
    // Only this complete observed typo gets a fallback, and only after zero normal matches.
    // A real Cat 2 company always wins; cat, cat 3 and longer Cat queries are untouched.
    return queryWords.join(' ') === 'cat 2' ? companies.filter(company => company.slug === 'convert2cad') : [];
  }
  function filterCompanies(companies, state) {
    return searchCompanies(companies, state.query).filter(company =>
      (!state.service || company.services.includes(state.service)) &&
      state.tags.filter(tag => tags.includes(tag)).every(tag => company.tags.includes(tag))
    ).sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }
  return { tags, localizeCompanies, readState, stateQuery, directoryUrl, profileUrl, filterCompanies };
});
