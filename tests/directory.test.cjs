const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const file = path.join(__dirname, '../directory.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
const companies = context.window.CADALOG_COMPANIES;

test('directory state implementation exists', () => assert.ok(fs.existsSync(file), 'directory.js must implement the directory state contract'));
if (fs.existsSync(file)) {
 const d = require(file);
 const base = { query: '', service: '', discipline: '', sort: 'name', savedOnly: false, lang: 'ru' };
 test('all twelve companies remain and sort alphabetically', () => {
   const result=d.filterCompanies(companies, base, new Set());
   assert.equal(result.length,12); assert.equal(result[0].name,'CAD/CAM Services');
   assert.equal(result.at(-1).name,'UR CAD Services');
 });
 test('search is trimmed, case-insensitive and includes file formats', () => {
   assert.equal(d.filterCompanies(companies,{...base,query:'  dXf  '},new Set()).length,3);
 });
 test('filters are combined rather than replacing each other', () => {
   const found=d.filterCompanies(companies,{...base,service:'Paper & sketch',discipline:'Architecture'},new Set());
   assert.deepEqual(Array.from(found,c=>c.slug),['morava-modern','praxis-drawings']);
 });
 test('saved filter only includes saved companies', () => {
   assert.deepEqual(Array.from(d.filterCompanies(companies,{...base,savedOnly:true},new Set(['powerkh'])),c=>c.slug),['powerkh']);
 });
 test('zero results and reverse sorting are correct', () => {
   assert.equal(d.filterCompanies(companies,{...base,query:'not-a-company'},new Set()).length,0);
   assert.equal(d.filterCompanies(companies,{...base,sort:'reverse'},new Set())[0].slug,'ur-cad-services');
 });
 test('query state is parsed and unknown values ignored', () => {
   assert.deepEqual(d.readState('?q=DWG&service=PDF+to+CAD&discipline=Architecture&sort=reverse&saved=1'),{query:'DWG',service:'PDF to CAD',discipline:'Architecture',sort:'reverse',savedOnly:true,lang:'ru'});
   assert.deepEqual(d.readState('?service=unknown&sort=nonsense&saved=no'),base);
 });
 test('state URLs round-trip and remain relative for GitHub Pages', () => {
   const state={...base,query:'DWG & DGN',service:'Paper & sketch',savedOnly:true};
   const query=d.stateQuery(state);
   assert.deepEqual(d.readState(query),state);
   const profile=d.profileUrl('cad-cam-services',state);
   assert.ok(profile.startsWith('./?')); assert.ok(profile.includes('company=cad-cam-services'));
   assert.deepEqual(d.readState(profile.slice(2)),state);
   assert.ok(d.directoryUrl(state).endsWith('#directory'));
 });
 test('empty state makes a clean root link', () => assert.equal(d.directoryUrl(base),'./#directory'));
 test('saved data discards unknown slugs, malformed JSON and non-arrays', () => {
   assert.deepEqual(d.parseSaved('["powerkh","deleted",null,7,"powerkh"]',companies),['powerkh']);
   assert.deepEqual(d.parseSaved('broken',companies),[]);
   assert.deepEqual(d.parseSaved('{}',companies),[]);
 });
 test('suggestion rejects blank company and non-web URLs with actionable errors', () => {
   assert.ok(d.validateSuggestion('   ','https://example.com').name);
   assert.ok(d.validateSuggestion('Firm','javascript:alert(1)').website);
   assert.ok(d.validateSuggestion('Firm','ftp://example.com').website);
   assert.deepEqual(d.validateSuggestion('Firm','https://example.com'),{});
 });
 test('suggestion URL honestly opens a prefilled issue, preserving submitted text', () => {
   const url = new URL(d.suggestionUrl('Firm & Co','https://example.com','DWG\nDXF'));
   assert.equal(url.hostname,'github.com');
   assert.equal(url.pathname,'/Grand-Code40/CADalog/issues/new');
   assert.equal(url.searchParams.get('title'),'Directory suggestion: Firm & Co');
   assert.ok(url.searchParams.get('body').includes('DWG\nDXF'));
 });
 test('company source data is complete and does not contain duplicates', () => {
   assert.equal(new Set(companies.map(c=>c.slug)).size,12);
   for(const c of companies){assert.ok(c.services.length);assert.ok(c.formats.length);assert.equal(new URL(c.source).protocol,'https:');assert.equal(new URL(c.website).protocol,'https:');}
 });
}

if (fs.existsSync(file)) {
 const d = require(file);
 test('Russian is default, English is explicit and persists in profile URLs', () => {
   assert.equal(d.readState('').lang,'ru');
   const state=d.readState('?lang=en&service=PDF+to+CAD');
   assert.equal(state.lang,'en');
   assert.ok(d.profileUrl('powerkh',state).includes('lang=en'));
 });
 test('search includes localized capabilities', () => {
   const localized=[{...companies[0],searchTerms:'оцифровка инженерия'}];
   assert.equal(d.filterCompanies(localized,{...d.readState(''),query:'ОЦИФРОВКА'},new Set()).length,1);
 });
 const ctx={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../locales.js'),'utf8'),ctx);
 const locales=ctx.window.CADALOG_LOCALES;
 test('all twelve companies have full Russian profile translations',()=>{
   for(const c of companies){assert.ok(locales.ru.companies[c.slug].line.length>20);assert.ok(locales.ru.companies[c.slug].detail.length>50);}
 });
 test('both languages have all the same interface keys',()=>{
   assert.deepEqual(Object.keys(locales.ru).sort(),Object.keys(locales.en).sort());
   for(const lang of ['ru','en'])for(const c of companies)for(const value of [...c.services,c.focus])assert.ok(locales[lang].labels[value]);
 });
 test('every static translation hook resolves in both languages',()=>{
   const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
   assert.ok(html.includes('<html lang="ru">'));
   for(const match of html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g))for(const lang of ['ru','en'])assert.equal(typeof locales[lang][match[1]],'string',lang+':'+match[1]);
 });
}

if (fs.existsSync(file)) {
 const d = require(file);
 const ctx={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../locales.js'),'utf8'),ctx);
 const locales=ctx.window.CADALOG_LOCALES;
 test('localized file-format names are searchable in either interface language',()=>{
   assert.equal(typeof d.localizeCompanies,'function','localizeCompanies provides localized searchable company records');
   for(const lang of ['ru','en']) {
     const localized=d.localizeCompanies(companies,locales,lang);
     for(const query of ['Редактируемый CAD','Архитектурные планы','CAD со слоями']) {
       assert.ok(d.filterCompanies(localized,{...d.readState(''),query},new Set()).length>0,lang+': '+query);
     }
   }
 });
 test('a new company without a Russian translation safely uses its source text',()=>{
   assert.equal(typeof d.localizeCompanies,'function');
   const newCompany={...companies[0],slug:'new-provider',line:'Original line',detail:'Original detailed description',formats:['DWG']};
   const [result]=d.localizeCompanies([newCompany],locales,'ru');
   assert.equal(result.line,'Original line');assert.equal(result.detail,'Original detailed description');
   assert.equal(result.slug,'new-provider');assert.equal(result.source,newCompany.source);
   assert.equal(d.filterCompanies([result],{...d.readState(''),query:'Original'},new Set()).length,1);
 });
}
