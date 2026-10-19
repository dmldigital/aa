const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  for (const [W,H] of [[2560,1440],[1920,1080],[1536,864],[1440,900],[1366,768],[1280,720],[1366,650],[1200,700],[1100,800]]){
    const ctx=await b.newContext({viewport:{width:W,height:H}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2200);
    const r=await p.evaluate(()=>{const s=document.querySelector('[data-tb]');const view=s.querySelector('.tb-view');const h=[...s.querySelectorAll('.tb-inner')].map(i=>Math.round(i.offsetHeight));return {pin:s.classList.contains('tb--pin'),scale:getComputedStyle(s).getPropertyValue('--tb-s').trim()||'-',viewH:Math.round(view.clientHeight),panels:h,fits:h.every(x=>x<=view.clientHeight)}});
    console.log(`${W}x${H}`,JSON.stringify(r),errs.length?errs:'');
    await ctx.close();
  }
  await b.close();
})();
