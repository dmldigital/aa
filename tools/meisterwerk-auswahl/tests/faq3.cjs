const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900,shot=process.argv[4]==='shot';
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:W<=768,hasTouch:W<=768}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const top=await p.evaluate(()=>document.querySelector('[data-faq]').getBoundingClientRect().top+scrollY);
  await p.evaluate(y=>scrollTo(0,y),top); await p.waitForTimeout(1500);
  const st=()=>p.evaluate(()=>{const s=document.querySelector('[data-faq]');const cols=[...s.querySelectorAll('.tb-faqcols>.tb-tabs')].map(l=>{const r=l.getBoundingClientRect();return [Math.round(r.left),Math.round(r.width)]});
    return {ui:s.classList.contains('tb--ui'),h:Math.round(s.getBoundingClientRect().height),cols,open:[...s.querySelectorAll('.tb-tab')].map(b=>b.getAttribute('aria-expanded')==='true'?1:0).join(''),hs:document.documentElement.scrollWidth>innerWidth,
      clip:[...s.querySelectorAll('.tb-collapse.is-open .tb-collapse-inner')].map(c=>c.scrollHeight>c.clientHeight+1)}});
  console.log(W+'x'+H,JSON.stringify(await st()));
  if(shot) await p.screenshot({path:`shots/faq3-${W}-a.png`});
  await p.click('#faq-t3'); await p.waitForTimeout(150); if(shot) await p.screenshot({path:`shots/faq3-${W}-mid.png`});
  await p.waitForTimeout(1100); console.log('Q3 ->',JSON.stringify(await st())); if(shot) await p.screenshot({path:`shots/faq3-${W}-b.png`});
  await p.click('#faq-t8'); await p.waitForTimeout(1300); console.log('Q8 ->',JSON.stringify(await st())); if(shot) await p.screenshot({path:`shots/faq3-${W}-c.png`});
  await p.click('#faq-t9'); await p.waitForTimeout(1300); console.log('Q9 ->',JSON.stringify(await st())); if(shot) await p.screenshot({path:`shots/faq3-${W}-d.png`});
  await p.click('#faq-t9'); await p.waitForTimeout(900); console.log('Q9 nochmal ->',(await st()).open);
  console.log('Fehler',errs); await b.close();
})();
