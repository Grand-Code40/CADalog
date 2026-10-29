const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const directory = require('../directory.js');
const context = {window: {}};
for (const file of ['data.js', 'locales.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
}
const base = {query: '', service: '', tags: [], sort: 'name', lang: 'ru'};
const slugList = (companies, query, overrides = {}) => Array.from(
  directory.filterCompanies(companies, {...base, query, ...overrides}), company => company.slug
);
const fixture = (slug, name, extra = {}) => ({slug, name, line: '', detail: '', services: [], tags: [], formats: [], ...extra});

for (const lang of ['ru', 'en']) {
  const companies = directory.localizeCompanies(context.window.CADALOG_COMPANIES, context.window.CADALOG_LOCALES, lang);
  test(`${lang}: spaced, reordered and digit-boundary company queries find Convert2CAD`, () => {
    for (const query of ['Convert2CAD', 'convert 2 cad', 'CAD 2', '2 CAD', 'CAD2', '  CAD\t 2 ', 'convert-2-CAD', 'ＣＡＤ ２']) {
      assert.deepEqual(slugList(companies, query), ['convert2cad'], query);
    }
  });
  test(`${lang}: compact and camel-case company names remain searchable`, () => {
    for (const query of ['RasterTech', 'rastertech', 'Raster Tech']) {
      assert.deepEqual(slugList(companies, query), ['rastertech'], query);
    }
    assert.deepEqual(slugList(companies, 'cad cam'), ['cad-cam-services']);
    assert.deepEqual(slugList(companies, 'cadcam'), ['cad-cam-services']);
  });
  test(`${lang}: all terms match across name, services, tags and formats`, () => {
    assert.deepEqual(slugList(companies, 'PDF DXF truetech'), ['truetechcad']);
    assert.deepEqual(slugList(companies, 'инженерия ДХФ PDF'), ['truetechcad']);
    assert.deepEqual(slugList(companies, 'слоями CAD архитектура'), ['morava-modern', 'powerkh', 'praxis-drawings']);
    assert.deepEqual(slugList(companies, 'DGN DWG 2'), ['convert2cad']);
    assert.deepEqual(slugList(companies, 'presentation design'), ['design-presentation']);
  });
  test(`${lang}: limited Russian brand and acronym aliases work without fuzzy matching`, () => {
    for (const query of ['КАД 2', 'конверт2кад', 'конверт 2 кад', 'конверт ту кад', 'ПДФ двг 2']) {
      assert.deepEqual(slugList(companies, query), ['convert2cad'], query);
    }
  });
  test(`${lang}: only complete Cat 2 typo gets the zero-result fallback`, () => {
    for (const query of ['Cat 2', 'cat2', 'CAT-2']) assert.deepEqual(slugList(companies, query), ['convert2cad'], query);
    for (const query of ['Cat', 'Cat 3', 'Cat 2 drawings', 'Cat2CAD', 'cat cat 2', 'CAD20', 'CAD 3', 'CAD 2 DXF', 'unknowncompany', 'NOT-A-COMPANY']) {
      assert.deepEqual(slugList(companies, query), [], query);
    }
  });
  test(`${lang}: search still combines with service and discipline filters`, () => {
    assert.deepEqual(slugList(companies, 'CAD 2', {service: 'Paper & sketch', tags: ['Multi-disciplinary']}), ['convert2cad']);
    assert.deepEqual(slugList(companies, 'Cat 2', {tags: ['Architecture']}), []);
  });
  test(`${lang}: blank search resets but punctuation-only search does not return everything`, () => {
    assert.equal(slugList(companies, ' \t\n ').length, 12);
    assert.deepEqual(slugList(companies, '---'), []);
  });
}

test('Cat 2 exact results take priority over fallback, even when a filter hides them', () => {
  const convert = fixture('convert2cad', 'Convert2CAD', {tags: ['Architecture']});
  const cat = fixture('cat2', 'Cat 2', {tags: ['Engineering']});
  assert.deepEqual(slugList([convert, cat], 'Cat2'), ['cat2']);
  assert.deepEqual(slugList([convert, cat], 'Cat2', {tags: ['Architecture']}), []);
});
test('matching is on words and prefixes, not arbitrary substrings or similar numbers', () => {
  const companies = [fixture('decoy', 'Education Caddy 20', {detail: 'cathedral specification', formats: ['DXFake']})];
  for (const query of ['cad', 'cat 2', '2', 'dxf', 'cation', 'thedral']) assert.deepEqual(slugList(companies, query), [], query);
});
test('Russian ё and е are equivalent; Russian word prefixes remain useful', () => {
  const companies = [fixture('sample', 'Пример', {detail: 'Подчёркивает оцифровку чертежей'})];
  for (const query of ['подчеркивает', 'чертеж', 'оцифровк чертеж']) assert.deepEqual(slugList(companies, query), ['sample'], query);
});
test('format text stays searchable while removed URL controls cannot restrict results', () => {
  const companies = context.window.CADALOG_COMPANIES;
  const state = directory.readState('?tag=DXF&tag=Engineering&sort=reverse');
  assert.deepEqual(state, {...base, tags: ['Engineering']});
  assert.deepEqual(slugList(companies, 'DXF'), ['design-presentation', 'gsource-technologies', 'truetechcad']);
  assert.equal(directory.stateQuery({...base, tags: ['DXF', 'Engineering'], sort: 'reverse'}), 'tag=Engineering');
  assert.deepEqual(Array.from(directory.tags), ['Architecture', 'Engineering', 'Survey & civil', 'Multi-disciplinary']);
});

test('different query terms may match separate company fields regardless of order', () => {
  const companies = [
    fixture('match', 'Acme', {services: ['Drawing digitization'], tags: ['Engineering'], formats: ['DXF']}),
    fixture('missing-format', 'Acme Other', {services: ['Drawing digitization'], tags: ['Engineering'], formats: ['DWG']})
  ];
  assert.deepEqual(slugList(companies, 'DXF engineering acme digitization'), ['match']);
});
test('an exact complete company name wins over unrelated descriptive keyword matches', () => {
  const companies = [fixture('rastertech', 'RasterTech'), fixture('other', 'Other', {detail: 'Raster tech services'})];
  for (const query of ['RasterTech', 'rastertech', 'Raster Tech']) assert.deepEqual(slugList(companies, query), ['rastertech']);
});

test('case changes do not split acronyms or names into accidental words', () => {
  const companies = context.window.CADALOG_COMPANIES;
  for (const query of ['dXf', 'DxF', 'dxF']) assert.deepEqual(slugList(companies, query), ['design-presentation', 'gsource-technologies', 'truetechcad']);
  assert.deepEqual(slugList(companies, 'cOnVeRt2cAd'), ['convert2cad']);
});
test('ordinary object-property names are not interpreted as search aliases', () => {
  const companies = [fixture('constructor', 'Constructor Services')];
  assert.deepEqual(slugList(companies, 'constructor'), ['constructor']);
  assert.deepEqual(slugList(companies, 'toString'), []);
});
