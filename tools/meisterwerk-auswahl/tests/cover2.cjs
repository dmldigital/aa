const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const g=await p.evaluate(()=>{const ep=document.querySelector('[data-ep]'),sh=document.querySelector('[data-ep-sheet]'),f=document.querySelector('[data-faq]'),ft=document.querySelector('footer');const T=e=>Math.round(e.getBoundingClientRect().top+scrollY);return {epTop:T(ep),epH:ep.offsetHeight,sheetH:sh.offsetHeight,faqTop:T(f),faqH:f.offsetHeight,footTop:T(ft),docH:document.documentElement.scrollHeight}});
  console.log(JSON.stringify(g));
  const start=g.epTop+g.sheetH-H*0.2, end=g.docH-H;
  const pts=[start,g.faqTop-H*0.6,g.faqTop-H*0.3,g.faqTop,g.faqTop+g.faqH-H,end];
  let i=0;
  for(const y of pts){ await p.evaluate(y=>scrollTo(0,y),Math.max(0,y)); await p.waitForTimeout(1400);
    const st=await p.evaluate(()=>({sheetTop:Math.round(document.querySelector('[data-ep-sheet]').getBoundingClientRect().top),faqTop:Math.round(document.querySelector('[data-faq]').getBoundingClientRect().top),locked:document.documentElement.hasAttribute('data-header-locked'),hscroll:document.documentElement.scrollWidth>innerWidth}));
    console.log(i,Math.round(y),JSON.stringify(st)); await p.screenshot({path:`shots/cover2-${W}-${i}.png`}); i++; }
  console.log('Fehler',errs);
  await b.close();
})();
