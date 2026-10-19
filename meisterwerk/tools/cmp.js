// Nutzung: PW=... node cmp.js <unsere Seite z.B. /leistungen/malerarbeiten/> <name> <ID> <w: d|t|m>
// Vergleicht [data-section="<ID>"] unserer Seite (Dev-Server auf Port $PORT, Standard 4500) mit pages/<name>/ref-<ID>-<w>.png.
// Gibt Höhe/Breite und den Anteil abweichender Pixel aus, speichert $S/out/<name>-<ID>-<w>-sbs.png (links Original, Mitte Nachbau, rechts Differenz).
const { chromium } = require(process.env.PW);
const { execSync } = require('child_process'); const fs = require('fs');
const [ourPath, name, id, wk] = process.argv.slice(2);
const W = { d: [1440, 900], t: [1024, 768], m: [390, 844] }[wk];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W[0], height: W[1] }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(`http://127.0.0.1:${process.env.PORT || 4500}${ourPath}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(40); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const el = p.locator(`[data-section="${id}"]`).first();
  if (!(await el.count())) { console.log('FEHLER: kein Element mit data-section=' + id); process.exit(1); }
  fs.mkdirSync(`${__dirname}/out`, { recursive: true });
  const ours = `${__dirname}/out/${name}-${id}-${wk}.png`;
  await el.screenshot({ path: ours });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(execSync(`python3 ${__dirname}/sbs.py ${__dirname}/pages/${name}/ref-${id}-${wk}.png ${ours} ${__dirname}/out/${name}-${id}-${wk}-sbs.png`).toString().trim(), '| Überlauf', ov, '| JS-Fehler', errs.join('|') || 'keine');
  await b.close();
})();
