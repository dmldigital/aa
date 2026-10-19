const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440, H=+process.argv[3]||900;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const info=await p.evaluate(()=>{const s=document.querySelector('[data-tb]');return {pin:s.classList.contains('tb--pin'),top:s.getBoundingClientRect().top+scrollY,h:s.offsetHeight,vh:innerHeight}});
  console.log(JSON.stringify(info),'Fehler:',errs);
  if(!info.pin){ await p.evaluate(y=>scrollTo(0,y),info.top); await p.waitForTimeout(800); await p.screenshot({path:`shots/tb-${W}-fallback.png`,fullPage:false}); await b.close(); return; }
  const range=info.h-info.vh;
  for (const f of [0.02,0.12,0.2,0.3,0.42,0.55,0.68,0.8,0.9,0.99]){
    await p.evaluate(y=>scrollTo(0,y),info.top+f*range); await p.waitForTimeout(1700);
    const st=await p.evaluate(()=>{const s=document.querySelector('[data-tb]');const op=e=>+getComputedStyle(e).opacity;return {media:op(s.querySelector('[data-tb-media]')).toFixed(2),panels:[...s.querySelectorAll('[data-tb-panel]')].map(x=>op(x).toFixed(2)),on:[...s.querySelectorAll('[data-tb-tab]')].map(x=>x.classList.contains('is-on')?1:0).join(''),more:[...s.querySelectorAll('[data-tb-panel]')].map(x=>x.classList.contains('has-more')?1:0).join('')}});
    console.log(f,JSON.stringify(st));
    if([0.02,0.3,0.55,0.8,0.99].includes(f)) await p.screenshot({path:`shots/tb-${W}-${String(Math.round(f*100)).padStart(3,'0')}.png`});
  }
  await b.close();
})();
