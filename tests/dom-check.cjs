/* Optional DOM integration checks (no layout engine and no network).
   npm install --prefix /tmp/cadalog-dom-runtime happy-dom@21.0.4 --ignore-scripts
   CADALOG_DOM_MODULE=/tmp/cadalog-dom-runtime/node_modules/happy-dom node --disallow-code-generation-from-strings --frozen-intrinsics --test tests/dom-check.cjs
   Does not claim real-browser rendering, OS clipboard permissions or accessibility certification. */
const {test,afterEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {Window}=require(process.env.CADALOG_DOM_MODULE||'happy-dom');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=['data.js','directory.js','locales.js','app.js'].map(file=>fs.readFileSync(path.join(root,file),'utf8'));
const windows=[];
function open(url='https://cadalog.test/CADalog/') {
 const window=new Window({url,settings:{
  enableJavaScriptEvaluation:true,
  disableJavaScriptFileLoading:true,
  enableCSSFileLoading:false,
  enableImageFileLoading:false,
  navigation:{disableMainFrameNavigation:true,disableChildFrameNavigation:true,disableChildPageNavigation:true}
 }});
 windows.push(window);
 window.document.write(html);window.document.close();
 for(const script of scripts)window.eval(script);
 return window;
}
function visible(el){return Boolean(el)&&!el.closest('[hidden]');}
function follow(window,selector){return open(window.document.querySelector(selector).href);}
function change(window,selector,value,event='input'){
 const el=window.document.querySelector(selector);el.value=value;el.dispatchEvent(new window.Event(event,{bubbles:true}));return el;
}
afterEach(async()=>{await Promise.all(windows.splice(0).map(window=>window.happyDOM.close()));});

for(const prefix of ['/','/CADalog/'])for(const lang of ['ru','en']){
 test(`${prefix} ${lang}: home, profile, sources and language links resolve to visible destinations`,()=>{
  const base='https://cadalog.test'+prefix;
  const home=open(base+(lang==='en'?'?lang=en':''));
  assert.equal(home.document.querySelectorAll('.company-card').length,12);
  assert.equal(home.document.querySelectorAll('#tag-controls input').length,4);
  assert.equal(home.document.querySelector('#sort-select'),null);
  assert.equal(home.document.querySelector('[data-i18n="tagHint"]'),null);
  assert.equal(home.document.querySelector('[data-tag="DWG"],[data-tag="DXF"],[data-tag="DGN"],[data-tag="Layered CAD"]'),null);
  assert.match(home.document.querySelector('.company-details').textContent,/DWG/);
  for(const query of ['', '?company=powerkh','?company=missing','?page=sources']) {
   const start=open(base+query+(lang==='en'?(query?'&':'?')+'lang=en':''));
   const sources=follow(start,'footer [data-sources-link]');
   assert.equal(sources.document.documentElement.lang,lang);
   assert.equal(visible(sources.document.querySelector('#sources-view')),true);
   assert.equal(visible(sources.document.querySelector('#home-view')),false);
   assert.equal(visible(sources.document.querySelector('#profile-view')),false);
   assert.equal(sources.document.querySelectorAll('#sources-list > li').length,12);
   assert.deepEqual([...sources.document.querySelectorAll('#sources-list a')].map(link=>link.href).sort(),Array.from(sources.CADALOG_COMPANIES,c=>c.source).sort());
   const switched=follow(sources,'#language-switch');
   assert.equal(visible(switched.document.querySelector('#sources-view')),true);
   assert.equal(switched.document.documentElement.lang,lang==='ru'?'en':'ru');
   assert.equal(visible(follow(start,'.header-inner nav [data-sources-link]').document.querySelector('#sources-view')),true);
   assert.equal(visible(follow(start,'[data-directory-link]').document.querySelector('#home-view')),true);
   assert.equal(visible(follow(start,'.wordmark').document.querySelector('#home-view')),true);
   assert.equal(visible(start.document.querySelector(start.document.querySelector('.skip-link').hash)),true);
  }
 });
}

test('filters, language and URL state survive profile → sources → directory navigation',()=>{
 const home=open('https://cadalog.test/CADalog/?lang=en&tag=Architecture&service=Paper+%26+sketch');
 assert.equal(home.document.querySelectorAll('.company-card').length,2);
 const profile=follow(home,'.profile-link');
 assert.equal(profile.document.querySelector('#profile-title').textContent,'Morava Modern');
 const sources=follow(profile,'footer [data-sources-link]');
 assert.equal(new URL(sources.location.href).searchParams.get('tag'),'Architecture');
 const back=follow(sources,'#sources-view .back-link');
 assert.equal(back.document.querySelectorAll('.company-card').length,2);
 assert.equal(back.document.querySelector('#service-select').value,'Paper & sketch');
 assert.equal(back.document.querySelector('#tag-controls [value="Architecture"]').checked,true);
 assert.equal(back.document.documentElement.lang,'en');
});

test('obsolete format and sort URLs cannot hide results or reintroduce controls',()=>{
 const window=open('https://cadalog.test/CADalog/?tag=DWG&tag=DXF&tag=DGN&tag=Layered+CAD&sort=reverse');
 assert.equal(window.document.querySelectorAll('.company-card').length,12);
 assert.equal(window.document.querySelector('.company-body h3').textContent,'CAD/CAM Services');
 assert.equal(window.document.querySelectorAll('#tag-controls input:checked').length,0);
 const sourceURL=new URL(window.document.querySelector('footer a').href);
 assert.equal(sourceURL.searchParams.has('tag'),false);
 assert.equal(sourceURL.searchParams.has('sort'),false);
});

test('the remaining card tags filter in place and move focus to a visible checkbox',()=>{
 const window=open();
 const link=window.document.querySelector('[data-tag="Architecture"]');
 link.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0}));
 const checkbox=window.document.querySelector('#tag-controls [value="Architecture"]');
 assert.equal(checkbox.checked,true);
 assert.equal(window.document.activeElement,checkbox);
 assert.ok(window.document.querySelectorAll('.company-card').length<12);
 assert.equal(new URL(window.location.href).searchParams.get('tag'),'Architecture');
 window.document.querySelector('#clear-filters').click();
 assert.equal(window.document.querySelectorAll('.company-card').length,12);
});

for(const lang of ['ru','en'])test(`${lang}: search, empty state and reset work through actual input events`,()=>{
 const window=open('https://cadalog.test/CADalog/?lang='+lang);
 for(const query of ['Convert 2 CAD','Cat 2','конверт']) {
  change(window,'#search-input',query);
  assert.equal(window.document.querySelectorAll('.company-card').length,1,query);
  assert.equal(window.document.querySelector('.company-body h3').textContent,'Convert2CAD',query);
 }
 change(window,'#search-input','not-a-real-company-xyz');
 assert.equal(visible(window.document.querySelector('#empty-state')),true);
 window.document.querySelector('#empty-reset').click();
 assert.equal(window.document.querySelectorAll('.company-card').length,12);
});

for(const lang of ['ru','en'])test(`${lang}: copying copies the edited draft and explicitly does not send it`,async()=>{
 const window=open('https://cadalog.test/CADalog/?lang='+lang);
 const draft=change(window,'#suggestion-draft','Company: Example\nService page: https://example.com/');
 const button=window.document.querySelector('#copy-suggestion');
 assert.equal(button.disabled,false);
 button.click();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(await window.navigator.clipboard.readText(),draft.value);
 assert.equal(window.document.querySelector('#suggestion-status').textContent,window.CADALOG_LOCALES[lang].suggestCopied);
 assert.equal(window.document.querySelector('a[href^="mailto:"],a[href*="github.com"]'),null);
 change(window,'#suggestion-draft',' ');
 assert.equal(button.disabled,true);
 assert.equal(window.document.querySelector('#suggestion-status').textContent,window.CADALOG_LOCALES[lang].suggestEmpty);
});

for(const mode of ['rejected','missing'])test(`clipboard ${mode}: manual-copy fallback is selected, with no false success`,async()=>{
 const window=open();
 Object.defineProperty(window.navigator,'clipboard',{value:mode==='missing'?undefined:{writeText:async()=>{throw new Error('Test permission rejection')}},configurable:true});
 const draft=change(window,'#suggestion-draft','Test suggestion');
 window.document.querySelector('#copy-suggestion').click();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(window.document.activeElement,draft);
 assert.equal(draft.selectionStart,0);
 assert.equal(draft.selectionEnd,draft.value.length);
 assert.equal(window.document.querySelector('#suggestion-status').textContent,window.CADALOG_LOCALES.ru.suggestCopyFallback);
});

test('all source and provider links remain HTTPS and translated copy hooks are resolved',()=>{
 for(const suffix of ['', '?company=powerkh','?page=sources&lang=en']){
  const window=open('https://cadalog.test/CADalog/'+suffix);
  for(const link of window.document.querySelectorAll('a[href]')){
   const url=new URL(link.href);
   if(url.origin!==window.location.origin)assert.equal(url.protocol,'https:');
   if(link.target==='_blank')assert.ok(link.rel.includes('noopener')&&link.rel.includes('noreferrer'));
  }
  for(const el of window.document.querySelectorAll('[data-i18n]'))assert.notEqual(el.textContent,'undefined');
  assert.doesNotMatch(window.document.body.textContent,/Сведения\s+(?:собраны\s+)?по открытым материалам|Можно выбрать несколько|public materials/);
 }
});

test('every visible internal link on all 12 profiles has a valid route or visible anchor',()=>{
 const home=open();
 const slugs=Array.from(home.CADALOG_COMPANIES,c=>c.slug);
 let checked=0;
 for(const lang of ['ru','en'])for(const route of ['',...slugs.map(slug=>'company='+slug),'company=missing','page=sources']){
  const window=open('https://cadalog.test/CADalog/?lang='+lang+(route?'&'+route:''));
  for(const link of window.document.querySelectorAll('a[href]')){
   if(!visible(link))continue;
   const url=new URL(link.href);
   if(url.origin!==window.location.origin)continue;
   checked++;
   assert.equal(url.pathname,'/CADalog/',link.outerHTML);
   if(url.searchParams.has('company'))assert.ok(slugs.includes(url.searchParams.get('company'))||url.searchParams.get('company')==='missing');
   if(url.searchParams.has('page'))assert.equal(url.searchParams.get('page'),'sources');
   if(url.hash==='#directory'){assert.equal(url.searchParams.has('company'),false);assert.equal(url.searchParams.has('page'),false);}
   else if(url.hash)assert.equal(visible(window.document.querySelector(url.hash)),true,link.outerHTML);
   if(link.id!=='language-switch')assert.equal(url.searchParams.get('lang')||'ru',lang,link.outerHTML);
  }
 }
 assert.ok(checked>250,'expected to inspect the complete navigation surface');
});
