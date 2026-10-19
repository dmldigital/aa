const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440, H=+process.argv[3]||900, MOB=process.argv[4]==='m';
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:MOB,hasTouch:MOB}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2800);
  const geo=await p.evaluate(()=>{const w=document.querySelector('[data-mz]');const r=w.getBoundingClientRect();return {on:w.classList.contains('mz--on'),top:r.top+scrollY,h:w.offsetHeight,stageH:w.querySelector('.mz-stage').offsetHeight,vh:innerHeight,vw:document.documentElement.clientWidth}});
  console.log(JSON.stringify(geo),errs);
  const vh=geo.vh,Hs=geo.stageH,D=2.15*vh;
  const steps=[['pin',0],['cta-halb',.2*vh],['cta-voll',.4*vh],['form-halb',.7*vh],['form-voll',1.0*vh],['stopp',1.15*vh],['form-raus-halb',1.5*vh],['form-raus',1.75*vh],['cta-raus-halb',1.95*vh],['cta-raus',D],['cover-halb',D+.5*Hs],['cover-voll',D+Hs],['danach',D+Hs+.6*vh]];
  for(const [name,off] of steps){
    await p.evaluate(y=>scrollTo(0,y),geo.top+off); await p.waitForTimeout(1800);
    const s=await p.evaluate(()=>{const w=document.querySelector('[data-mz]');const c=document.querySelector('[data-mz-cover]');const col=w.querySelectorAll('.mz-col')[1].getBoundingClientRect();const k=w.querySelector('[data-mz-contact]');const kr=k.getBoundingClientRect();const st=w.querySelector('.mz-stage');return {stageTop:Math.round(st.getBoundingClientRect().top),coverTop:Math.round(c.getBoundingClientRect().top),ctaL:Math.round(col.left),ctaR:Math.round(col.right),formL:Math.round(kr.left),formR:Math.round(kr.right),formH:Math.round(kr.height),inert:k.inert,clip:getComputedStyle(st).clipPath.replace(/px/g,'').slice(0,26),locked:document.documentElement.hasAttribute('data-header-locked')}});
    console.log(name.padEnd(15),JSON.stringify(s));
    await p.screenshot({path:`shots/cta2-${W}-${name}.png`});
  }
  await b.close();
})();
