const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  for(const [W,H,m] of [[1440,900,false],[390,844,true],[820,1180,true]]){
    const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:m,hasTouch:m}); const p=await ctx.newPage();
    await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
    const hh=await p.evaluate(()=>{const s=document.querySelector('[data-hero]');return s.offsetHeight-innerHeight});
    let best=null;
    for(const f of [0.5,0.8,0.97,1]){ await p.evaluate(y=>scrollTo(0,y),hh*f); await p.waitForTimeout(2500);
      const r=await p.evaluate(()=>{let out=[];document.querySelectorAll('[data-hero] *').forEach(e=>{const q=e.getBoundingClientRect();if(q.width>innerWidth*0.8&&q.height>innerHeight*0.4&&q.height<=innerHeight+2){out.push(e.tagName+'.'+(e.className||'').toString().slice(0,30)+' '+[q.left,q.top,q.width,q.height].map(Math.round).join(','))}});return out.slice(0,4)});
      console.log(W,f,JSON.stringify(r)); }
    await ctx.close();
  }
  await b.close();
})();
