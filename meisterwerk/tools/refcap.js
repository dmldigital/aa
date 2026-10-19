// Nutzung: PW=... node refcap.js <originalPfad z.B. /services/tapezieren/> <name>
// Schreibt nach $S/pages/<name>/ : sections-<w>.json, spec-<ID>-<w>.txt (Computed-Style-Baum je Wurzel-Sektion),
// ref-<ID>-<w>.png (Screenshot je Sektion), full-<w>.png. w = d(1440) | t(1024) | m(390)
const { chromium } = require(process.env.PW);
const fs = require('fs');
const [path, name] = process.argv.slice(2);
const dir = `${__dirname}/pages/${name}`; fs.mkdirSync(dir, { recursive: true });
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [w, h, n] of [[1440, 900, 'd'], [1024, 768, 't'], [390, 844, 'm']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, ignoreHTTPSErrors: true, locale: 'de-DE' });
    const p = await ctx.newPage();
    await p.goto('https://meisterwerk-lb.de' + path, { waitUntil: 'networkidle', timeout: 90000 });
    await p.evaluate(() => { document.querySelector('#cc--main')?.remove(); });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 250) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(80); }
    await p.waitForTimeout(2500); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600);
    await p.screenshot({ path: `${dir}/full-${n}.png`, fullPage: true });
    const res = await p.evaluate(() => {
      const PROPS = ['display','position','top','left','right','bottom','z-index','flex-direction','flex-wrap','justify-content','align-items','align-self','flex-grow','flex-basis','gap','grid-template-columns','max-width','min-height','padding','margin','font-family','font-size','font-weight','line-height','letter-spacing','text-transform','text-align','text-decoration-line','color','background-color','background-image','background-size','background-position','border-top','border-right','border-bottom','border-left','border-radius','box-shadow','opacity','transform','overflow','object-fit','object-position','aspect-ratio','white-space','cursor','transition','clip-path','filter'];
      const DEF = {display:'block',position:'static',top:'auto',left:'auto',right:'auto',bottom:'auto','z-index':'auto','flex-direction':'row','flex-wrap':'nowrap','justify-content':'normal','align-items':'normal','align-self':'auto','flex-grow':'0','flex-basis':'auto',gap:'normal','grid-template-columns':'none','max-width':'none','min-height':'0px',padding:'0px',margin:'0px','text-align':'start','text-decoration-line':'none','background-color':'rgba(0, 0, 0, 0)','background-image':'none','background-size':'auto','background-position':'0% 0%','border-radius':'0px','box-shadow':'none',opacity:'1',transform:'none',overflow:'visible','object-fit':'fill','object-position':'50% 50%','aspect-ratio':'auto','white-space':'normal',cursor:'auto',transition:'all 0s ease 0s','clip-path':'none',filter:'none','letter-spacing':'normal','text-transform':'none'};
      const INH = ['font-family','font-size','font-weight','line-height','letter-spacing','text-transform','text-align','color','white-space','cursor'];
      const root = document.querySelector('[data-elementor-type="wp-page"]') || document.querySelector('[data-elementor-type]');
      const secs = []; const specs = {};
      [...root.children].forEach((c) => {
        const R = c.getBoundingClientRect(); if (R.height < 2 || !c.dataset.id) return;
        const id = c.dataset.id; const lines = [];
        const walk = (el, depth, pcs) => {
          const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
          if (cs.display === 'none') return; if (r.width === 0 && r.height === 0 && el.children.length === 0) return;
          const d = {};
          for (const k of PROPS) { let v = cs.getPropertyValue(k);
            if (k.startsWith('border-') && !k.endsWith('radius') && v.startsWith('0px')) continue;
            if (INH.includes(k)) { if (pcs && pcs.getPropertyValue(k) === v) continue; } else if (DEF[k] === v) continue;
            d[k] = v; }
          let t = ''; for (const n of el.childNodes) if (n.nodeType === 3) t += n.textContent; t = t.replace(/\s+/g, ' ').trim();
          const cls = (typeof el.className === 'string' ? el.className : '').split(' ').filter(x => /^(e-con|elementor-widget-|swiper|e-n-|vamtam|elementor-heading|elementor-button|e-loop|gallery)/.test(x)).slice(0, 3).join('.');
          let extra = ''; if (el.tagName === 'IMG') extra = ' src=' + (el.currentSrc || el.src).split('/').pop().split('?')[0]; if (el.tagName === 'A') extra += ' href=' + el.getAttribute('href');
          lines.push(`${'  '.repeat(depth)}${el.tagName.toLowerCase()}${el.dataset.id ? '#' + el.dataset.id : ''}${el.dataset.widget_type ? '[' + el.dataset.widget_type + ']' : ''}${cls ? '.' + cls : ''} [${Math.round(r.left - R.left)},${Math.round(r.top - R.top)} ${Math.round(r.width)}x${Math.round(r.height)}]${extra}${t ? ' "' + t.slice(0, 90) + '"' : ''} ${JSON.stringify(d)}`);
          if (el.tagName.toLowerCase() === 'svg') return;
          for (const ch of el.children) walk(ch, depth + 1, cs);
        };
        walk(c, 0, null);
        specs[id] = `ROOT ${id} y=${Math.round(R.top + scrollY)} h=${Math.round(R.height)}\n` + lines.join('\n');
        secs.push({ id, y: Math.round(R.top + scrollY), h: Math.round(R.height) });
      });
      return { secs, specs };
    });
    fs.writeFileSync(`${dir}/sections-${n}.json`, JSON.stringify(res.secs));
    for (const [id, txt] of Object.entries(res.specs)) fs.writeFileSync(`${dir}/spec-${id}-${n}.txt`, txt);
    const { Image } = { Image: null };
    const py = `from PIL import Image\nim=Image.open("${dir}/full-${n}.png")\nimport json\nfor s in json.load(open("${dir}/sections-${n}.json")):\n    im.crop((0,s["y"],${w},min(im.size[1],s["y"]+s["h"]))).save("${dir}/ref-%s-${n}.png"%s["id"])\n`;
    require('child_process').execSync('python3 -', { input: py });
    console.log(name, n, JSON.stringify(res.secs.map(s => s.id + ':' + s.y + '+' + s.h)));
    await ctx.close();
  }
  await b.close();
})();
