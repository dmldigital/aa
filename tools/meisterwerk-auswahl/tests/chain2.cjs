const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:W<=768,hasTouch:W<=768}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const top=await p.evaluate(()=>document.querySelector('[data-welcome-scene]').getBoundingClientRect().top+scrollY);
  await p.evaluate(y=>scrollTo(0,y),top-H*1.05); await p.waitForTimeout(600);
  const rows=await p.evaluate(async(y)=>{const els=[...document.querySelectorAll('[data-wc]')];const out=[];const t0=performance.now();scrollTo(0,y);
    await new Promise(res=>{const tick=()=>{const t=performance.now()-t0;out.push([Math.round(t),els.map(e=>(+getComputedStyle(e).opacity).toFixed(2)).join(' ')]);if(t<3200)setTimeout(tick,100);else res()};tick()});return out},top-H*0.45);
  console.log(rows.map(r=>String(r[0]).padStart(5)+'ms  '+r[1]).join('\n'));
  console.log('Fehler',errs); await b.close();
})();
