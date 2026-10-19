const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:W<=768,hasTouch:W<=768}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const top=await p.evaluate(()=>document.querySelector('[data-welcome-scene]').getBoundingClientRect().top+scrollY);
  await p.evaluate(y=>scrollTo(0,y),top-H*1.05); await p.waitForTimeout(600);
  await p.evaluate(async()=>{const m=await import('/aa/meisterwerk-preview-auswahl/_astro/gsap.CvDoa17S.js'); m.t.globalTimeline.timeScale(0.12)});
  await p.evaluate(y=>scrollTo(0,y),top-H*(W>1024?0.5:0.35));
  for(let i=0;i<6;i++){ await p.waitForTimeout(700); await p.screenshot({path:`shots/chain3-${W}-${i}.png`}); }
  console.log('Fehler',errs); await b.close();
})();
