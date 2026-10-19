const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
const W=+process.argv[2]||1440,H=+process.argv[3]||900,mob=W<=1024;
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:W,height:H},isMobile:mob,hasTouch:mob}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(3000);
  const g=await p.evaluate(()=>{const s=document.querySelector('[data-welcome-scene]');return {top:s.getBoundingClientRect().top+scrollY,h:s.offsetHeight,docH:document.documentElement.scrollHeight}});
  console.log(JSON.stringify(g));
  const rect=()=>p.evaluate(()=>{const els=[...document.querySelectorAll('[data-ws-img]')];const l=els[els.length-1];const mobile=innerWidth<=1024;const t=mobile?document.querySelector('[data-ws-stack]'):l;const r=t.getBoundingClientRect();return [r.left,r.top,r.width,r.height].map(Math.round).join(',')+' | scrollY '+Math.round(scrollY)});
  const lk=await p.evaluate(()=>document.querySelector('.lk').getBoundingClientRect().top+scrollY);
  const step=H*0.25; let n=0;
  for(let y=g.top+H*0.3;y<lk+H*0.2;y+=step){ await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(900); const r=await rect(); console.log(n,Math.round(y),r); if(n%2===0||true) await p.screenshot({path:`shots/zoom-${W}-${String(n).padStart(2,'0')}.png`}); n++; }
  console.log('lk top',Math.round(lk),'Fehler',errs,'hs',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
  await b.close();
})();
