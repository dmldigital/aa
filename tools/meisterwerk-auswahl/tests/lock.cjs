const path=require('path');
const {chromium}=require(path.join(require('child_process').execSync('npm root -g').toString().trim(),'playwright'));
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:4399/aa/meisterwerk-preview-auswahl/',{waitUntil:'load'}); await p.waitForTimeout(2500);
  const state=()=>p.evaluate(()=>{const h=document.querySelector('[data-smart-header]');const cs=getComputedStyle(h);return {locked:document.documentElement.hasAttribute('data-header-locked'),wantsVisible:h.hasAttribute('data-visible'),sichtbar:cs.visibility==='visible'&&cs.transform==='matrix(1, 0, 0, 1, 0, 0)'}});
  const pos=async(sel,f)=>p.evaluate(([s,f])=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return r.top+scrollY+f*(r.height-innerHeight)},[sel,f]);
  // Hoch-Scrollen: erst runter an eine Stelle, dann in Schritten nach oben
  const scrollUp=async(y)=>{ await p.evaluate(y=>scrollTo(0,y+240),y); await p.waitForTimeout(600); for(let i=0;i<8;i++){ await p.evaluate(d=>scrollBy(0,-d),30); await p.waitForTimeout(60);} await p.waitForTimeout(700); };
  const cases=[['Willkommen-Szene (Pin)','[data-welcome-scene]',0.5],['Leistungen (Pin)','[data-lk]',0.5],['Maler-Tabs (Pin)','[data-tb]',0.5]];
  for(const [name,sel,f] of cases){ const y=await pos(sel,f); await scrollUp(y); console.log(name.padEnd(26),'beim Hochscrollen:',JSON.stringify(await state())); }
  // Außerhalb: ganz nach unten (Footer-Bereich), dann hochscrollen
  const bottom=await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight-600);
  await scrollUp(bottom-240+240); console.log('Außerhalb (Footer-Bereich)'.padEnd(26),'beim Hochscrollen:',JSON.stringify(await state()));
  // Wieder in eine Pin-Sektion hineinscrollen, solange der Header sichtbar ist: er muss verschwinden
  const y=await pos('[data-tb]',0.3); await p.evaluate(y=>scrollTo(0,y),y); await p.waitForTimeout(900); console.log('Eintritt in Maler-Tabs'.padEnd(26),'                  :',JSON.stringify(await state()),errs);
  await b.close();
})();
