const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const info=await p.evaluate(()=>{const s=document.querySelector('[data-tb]:not([data-faq])');return {pin:s.classList.contains('tb--pin'),top:s.getBoundingClientRect().top+scrollY,h:s.offsetHeight}});
  console.log(JSON.stringify(info),errs);
  const range=info.h-H;
  for(const f of [0.02,0.12,0.17,0.2,0.24,0.3,0.4,0.45,0.5,0.54,0.6,0.7,0.78,0.84,0.9,0.99]){
    await p.evaluate(y=>scrollTo(0,y),info.top+f*range); await p.waitForTimeout(1500);
    const st=await p.evaluate(()=>{const s=document.querySelector('[data-tb]:not([data-faq])');const v=s.querySelector('.tb-view').getBoundingClientRect();
      const rel=e=>{const r=e.getBoundingClientRect();return `x${Math.round(r.left-v.left)} y${Math.round(r.top-v.top)}`};
      return 'media '+rel(s.querySelector('[data-tb-media]'))+' | p1 '+rel(s.querySelector('#tb-p1'))+' | p2 '+rel(s.querySelector('#tb-p2'))+' | p3 '+rel(s.querySelector('#tb-p3'))+' | view h'+Math.round(v.height)});
    console.log(f,st);
    if([0.17,0.2,0.45,0.5,0.54,0.78,0.84].includes(f)) await p.screenshot({path:`shots/slide-${W}-${String(Math.round(f*100)).padStart(3,'0')}.png`});
  }
  await b.close();
})();
