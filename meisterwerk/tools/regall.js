// node regall.js <ordner> ; Vollseiten-Screenshots aller Seiten bei 3 Breiten (reduzierte Bewegung) vom Preview-Server 4600
const { chromium } = require(process.env.PW); const fs=require('fs');
const pages=fs.readFileSync(`${__dirname}/pages.txt`,'utf8').split('\n').filter(Boolean).filter(p=>p!=='/404/');
const out=process.argv[2]; fs.mkdirSync(out,{recursive:true});
(async()=>{
  const b=await chromium.launch(); const errs=[];
  for(const [w,h,n] of [[1440,900,'d'],[1024,768,'t'],[390,844,'m']]){
    const ctx=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});
    for(const path of pages){
      const p=await ctx.newPage(); p.on('pageerror',e=>errs.push(n+path+' '+e.message));
      await p.goto('http://127.0.0.1:4600/aa/meisterwerk-preview'+path,{waitUntil:'networkidle'});
      await p.evaluate(()=>document.fonts.ready);
      const H=await p.evaluate(()=>document.documentElement.scrollHeight);
      for(let y=0;y<H;y+=600){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(30);}
      await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(250);
      await p.screenshot({path:`${out}/${n}${path.replace(/\//g,'_')}.png`,fullPage:true});
      await p.close();
    }
    await ctx.close();
  }
  console.log('fertig',pages.length*3,'Screenshots; JS-Fehler:',errs.join('|')||'keine'); await b.close();
})();
