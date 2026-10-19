const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||390, H=+process.argv[3]||844, MOB=process.argv[4]!=='d', RM=process.argv[5]==='rm';
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:MOB,hasTouch:MOB,reducedMotion:RM?'reduce':'no-preference'}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(3000);
  const state=()=>p.evaluate(()=>['[data-tb]:not([data-faq])','[data-faq]'].map(sel=>{const s=document.querySelector(sel);const bt=[...s.querySelectorAll('.tb-tab')];return {ui:s.classList.contains('tb--ui'),pin:s.classList.contains('tb--pin'),offen:bt.map(x=>x.getAttribute('aria-expanded')==='true'?1:0).join(''),sichtbarePanels:[...s.querySelectorAll('[data-tb-panel]')].filter(x=>x.getBoundingClientRect().height>10&&getComputedStyle(x.closest('.tb-collapse-inner')||x).opacity>0.5).length}}));
  console.log('Start',JSON.stringify(await state()),'Überlauf:',await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),errs);
  // Meisterliche: 3. Tab antippen
  const top1=await p.evaluate(()=>{const e=document.querySelector('[data-tb]:not([data-faq]) .tb-tabs');return e.getBoundingClientRect().top+scrollY-140});
  await p.evaluate(y=>scrollTo(0,y),top1); await p.waitForTimeout(900); await p.screenshot({path:`shots/tabsui-${W}-m1.png`});
  await p.click('#tb-t3'); await p.waitForTimeout(1000);
  console.log('nach Tipp auf Tab 3 (Meisterliche)',JSON.stringify((await state())[0]));
  await p.evaluate(y=>scrollTo(0,y+250),top1); await p.waitForTimeout(700); await p.screenshot({path:`shots/tabsui-${W}-m2.png`});
  // FAQ: 3. Frage antippen, dann nochmals zum Schließen
  const top2=await p.evaluate(()=>{const e=document.querySelector('[data-faq] .tb-tabs');return e.getBoundingClientRect().top+scrollY-120});
  await p.evaluate(y=>scrollTo(0,y),top2); await p.waitForTimeout(900);
  await p.click('#faq-t3'); await p.waitForTimeout(1000);
  console.log('nach Tipp auf Frage 3 (FAQ)',JSON.stringify((await state())[1]));
  await p.screenshot({path:`shots/tabsui-${W}-f1.png`});
  await p.click('#faq-t3'); await p.waitForTimeout(800);
  console.log('nochmal getippt (schließt)',JSON.stringify((await state())[1]),errs);
  await b.close();
})();
