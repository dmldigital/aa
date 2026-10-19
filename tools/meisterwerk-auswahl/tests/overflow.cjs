const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const sizes=[[2560,1440],[1920,1080],[1600,900],[1440,900],[1366,768],[1280,720],[1366,650],[1200,700],[1199,800],[1100,800],[1025,768],[1024,768],[900,1100],[768,1024],[600,900],[414,896],[390,844],[360,740],[320,640]];
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  let bad=0;
  for (const [W,H] of sizes){
    const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:W<=768,hasTouch:W<=768}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2200);
    const r=await p.evaluate(()=>{
      const out={issues:[]};
      const de=document.documentElement; if(de.scrollWidth>de.clientWidth) out.issues.push('Seite horizontal: '+(de.scrollWidth-de.clientWidth));
      const tb=document.querySelector('[data-tb]:not([data-faq])'), fq=document.querySelector('[data-faq]');
      out.mode={tb:tb.classList.contains('tb--pin')?'pin':'ui',faq:fq.classList.contains('tb--sel')?'sel':'ui'};
      const vr=document.documentElement.clientWidth;
      // Texte, die über ihr Feld laufen (horizontal)
      for(const sec of [tb,fq]){
        sec.querySelectorAll('.tb-inner, .tb-inner *, .tb-tab, .tb-lead, h2').forEach(e=>{
          if(e.closest('[inert]')&&!e.closest('.tb--pin'))return;
          const r=e.getBoundingClientRect(); if(r.width===0)return;
          if(r.right>vr+0.5||r.left<-0.5) out.issues.push(`${sec.dataset.faq!==undefined?'faq':'tb'} ragt aus Fenster: ${e.tagName}.${e.className} ${Math.round(r.left)}..${Math.round(r.right)}`);
        });
        sec.querySelectorAll('td,th,li,p,button').forEach(e=>{ if(e.scrollWidth>e.clientWidth+1 && getComputedStyle(e).display!=='inline') out.issues.push(`${e.tagName} scrollWidth ${e.scrollWidth}>${e.clientWidth}: ${e.textContent.slice(0,30)}`)});
      }
      // Pin: jedes Panel in der Bühne
      if(tb.classList.contains('tb--pin')){
        const v=tb.querySelector('.tb-view').getBoundingClientRect();
        tb.querySelectorAll('.tb-inner').forEach((i,k)=>{const r=i.getBoundingClientRect(); if(r.height>v.height+1) out.issues.push(`Panel ${k+1} höher (${Math.round(r.height)}) als Bühne (${Math.round(v.height)})`)});
        const st=tb.querySelector('.tb-sticky').getBoundingClientRect();
        const left=tb.querySelector('.tb-left'); const lr=left.getBoundingClientRect(); if(lr.height>st.height) out.issues.push(`Links höher (${Math.round(lr.height)}) als Bühne (${Math.round(st.height)})`);
      }
      return out;});
    const flag=r.issues.length?'  <-- '+r.issues.slice(0,6).join(' | '):'';
    if(r.issues.length) bad++;
    console.log(`${W}x${H}`,JSON.stringify(r.mode),flag,errs.length?errs:'');
    await ctx.close();
  }
  console.log('Größen mit Auffälligkeiten:',bad);
  await b.close();
})();
