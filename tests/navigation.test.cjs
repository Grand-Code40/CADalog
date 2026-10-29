const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const html=read('index.html'),css=read('styles.css'),app=read('app.js');
const context={window:{}};vm.runInNewContext(read('locales.js'),context);
const locales=context.window.CADALOG_LOCALES;

test('company cards have a full border and nearly square corners',()=>{
 const rule=css.match(/\.company-card\s*\{([^}]+)\}/)[1];
 assert.match(rule,/(?:^|;)\s*border:\s*1px solid var\(--rule\)/);
 assert.match(rule,/border-radius:\s*2px/);
 assert.doesNotMatch(rule,/box-shadow/);
});
test('footer and about navigation have an independent sources destination before JavaScript',()=>{
 const links=[...html.matchAll(/<a\b[^>]*data-sources-link[^>]*>/g)].map(match=>match[0]);
 assert.equal(links.length,2);
 for(const link of links)assert.match(link,/href="\.\/\?page=sources"/);
 assert.match(html,/id="sources-view"/);
 assert.match(html,/id="sources-list"/);
});
test('the sources page uses actual company URLs rather than invented source links',()=>{
 assert.match(app,/externalLink\(company\.source/);
 assert.match(app,/sources-list/);
 assert.match(html,/data-i18n="sourcesPrinciplesHeading"/);
});
test('the requested source disclaimer is absent in Russian and English UI copy',()=>{
 for(const source of [html,locales.ru.aboutLimits||'',locales.ru.listingNotice||'',locales.ru.directoryNote||'',locales.en.aboutLimits||'',locales.en.listingNotice||'',locales.en.directoryNote||''])
  assert.doesNotMatch(source,/Сведения\s+(?:собраны\s+)?по открытым материалам|(?:Based on|Information comes from).*public materials/i);
});
test('tag explanation and sorting controls are absent from the markup',()=>{
 assert.doesNotMatch(html,/data-i18n="tagHint"|id="sort-select"|class="sort-control"/);
});
test('company suggestion is an editable draft with honest unavailable-delivery copy',()=>{
 assert.match(html,/<textarea\b[^>]*id="suggestion-draft"/);
 assert.match(html,/<button\b[^>]*id="copy-suggestion"[^>]*disabled/);
 assert.match(html,/id="suggestion-status"[^>]*role="status"/);
 for(const lang of ['ru','en']){
  for(const key of ['suggestHeading','suggestUnavailable','suggestDraftLabel','suggestTemplate','suggestCopy','suggestCopied','suggestCopyFallback'])assert.equal(typeof locales[lang][key],'string',lang+':'+key);
 }
 assert.match(locales.ru.suggestUnavailable,/не подключена/);
 assert.match(locales.en.suggestUnavailable,/not connected/);
 assert.doesNotMatch(html,/mailto:|https?:\/\/github\.com/i);
});
