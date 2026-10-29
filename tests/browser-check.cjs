/* Optional real-browser QA. Install Playwright in your dev environment, serve the project,
   then CADALOG_URL=http://localhost:8000/ node tests/browser-check.cjs.
   This is deliberately separate from the dependency-free unit test command. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const base=process.env.CADALOG_URL||'http://localhost:8000/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage(); const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 fs.mkdirSync('qa/screenshots',{recursive:true});
 try {
  for(const lang of ['ru','en'])for(const width of [1440,1100,768,620,390,320]){
   await page.setViewportSize({width,height:900});
   await page.goto(base+(lang==='en'?'?lang=en':''));
   await page.locator('.company-card').first().waitFor();
   assert.equal(await page.locator('.company-card').count(),12);
   assert.equal(await page.locator('html').getAttribute('lang'),lang);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${lang} ${width} horizontal overflow`);
   await page.screenshot({path:`qa/screenshots/${lang}-${width}.png`,fullPage:true});
  }
  await page.goto(base);
  await page.locator('#tag-controls input[value="Architecture"]').check();
  await page.locator('#service-select').selectOption('Paper & sketch');
  assert.equal(await page.locator('.company-card').count(),2);
  assert.match(page.url(),/tag=Architecture/);
  await page.locator('.profile-link').first().click();
  await page.locator('#profile-title').waitFor();
  assert.equal(await page.locator('#profile-title').textContent(),'Morava Modern');
  await page.locator('#language-switch').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.match(page.url(),/tag=Architecture/);
  await page.locator('.back-link').click();
  assert.equal(await page.locator('.company-card').count(),2);
  await page.locator('#clear-filters').click();
  assert.equal(await page.locator('.company-card').count(),12);
  await page.locator('#search-input').fill('NOT-A-COMPANY');
  assert.equal(await page.locator('#empty-state').isVisible(),true);
  await page.locator('#empty-reset').click();
  assert.equal(await page.locator('.company-card').count(),12);
  await page.goto(base+'?saved=1&discipline=Engineering');
  assert.equal(await page.locator('.company-card').count(),12);
  await page.goto(base+'?company=missing&lang=en');
  assert.equal(await page.locator('#profile-title').textContent(),'Company not found');
  for (const lang of ['ru','en']) {
   const suffix = lang === 'en' ? '&lang=en' : '';
   for (const company of ['powerkh','missing']) {
    await page.goto(base + '?company=' + company + '&tag=Architecture' + suffix);
    await page.locator('footer [data-sources-link]').click();
    assert.equal(await page.locator('#sources-view').isVisible(),true);
    assert.equal(await page.locator('#home-view').isVisible(),false);
    assert.equal(await page.locator('#sources-list > li').count(),12);
    assert.match(page.url(),/page=sources/);
    assert.match(page.url(),/tag=Architecture/);
    assert.equal(await page.locator('html').getAttribute('lang'),lang);
    assert.equal(await page.locator('#suggest').isVisible(),true);
    const listedSources=await page.locator('#sources-list a').evaluateAll(links=>links.map(link=>link.href));
    const actualSources=await page.evaluate(()=>window.CADALOG_COMPANIES.map(company=>company.source));
    assert.deepEqual(listedSources.sort(),actualSources.sort());
    await page.locator('#language-switch').click();
    assert.equal(await page.locator('#sources-view').isVisible(),true);
    assert.equal(await page.locator('html').getAttribute('lang'),lang==='ru'?'en':'ru');
    await page.locator('#sources-view .back-link').click();
    assert.equal(await page.locator('#home-view').isVisible(),true);
    assert.equal(await page.locator('#tag-controls input').count(),4);
    assert.equal(await page.locator('#sort-select').count(),0);
    assert.equal(await page.locator('[data-tag="DWG"],[data-tag="DXF"],[data-tag="DGN"],[data-tag="Layered CAD"]').count(),0);
   }
  }
  await page.goto(base+'?tag=DWG&tag=DXF&sort=reverse');
  assert.equal(await page.locator('.company-card').count(),12);
  assert.equal(await page.locator('.company-body h3').first().textContent(),'CAD/CAM Services');
  await page.locator('#suggestion-draft').fill('Company: Example\nService page: https://example.com/');
  // A rejected Clipboard API must expose a manual-copy path, never false success.
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Clipboard blocked for QA')}}}));
  await page.locator('#copy-suggestion').click();
  await page.waitForFunction(()=>document.querySelector('#suggestion-status').textContent.includes('Ctrl/Cmd+C'));
  assert.equal(await page.locator('#suggestion-draft').evaluate(el=>el.selectionEnd-el.selectionStart),await page.locator('#suggestion-draft').inputValue().then(value=>value.length));
  await page.locator('#suggestion-draft').fill('');
  assert.equal(await page.locator('#copy-suggestion').isDisabled(),true);
  await page.goto(base);
  const brokenSrc=await page.locator('.company-logo').first().getAttribute('src');
  await page.route(brokenSrc,route=>route.abort());
  await page.reload();
  assert.equal(await page.locator('.company-logo').first().isVisible(),false);
  assert.equal(await page.locator('.brand-fallback').first().isVisible(),true);
  assert.equal(await page.locator('a[href*="github.com"]').count(),0);
  assert.equal(await page.locator('[data-save],#saved-toggle').count(),0);
  assert.deepEqual(errors,[]);
  console.log('Browser checks passed; screenshots still need visual review.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
