// Test der Cloudflare Function functions/api/anfrage.ts mit simuliertem Turnstile und Resend (kein Netzwerk, kein Konto nötig).
// Aufruf: npm run test:functions   (bündelt die Function mit esbuild nach /tmp und führt diese Prüfungen aus)
import { onRequestPost } from '/tmp/meisterwerk-anfrage-test/anfrage.mjs';
const calls = []; let resendOk = true, tsOk = true;
globalThis.fetch = async (url, init) => {
  if (String(url).includes('turnstile')) return new Response(JSON.stringify({ success: tsOk }));
  if (String(url).includes('resend')) { calls.push({ url, body: JSON.parse(init.body) }); return new Response('{}', { status: resendOk ? 200 : 500 }); }
  throw new Error('unerwartet ' + url);
};
const puts = [], rows = [];
const env = { RESEND_API_KEY: 'k', MAIL_FROM: 'Meisterwerk <formular@meisterwerk-lb.de>', MAIL_TEAM: 'info@meisterwerk-lb.de', TURNSTILE_SECRET: 's',
  UPLOADS: { put: async (k, v) => puts.push([k, v.length]) },
  DB: { prepare: () => ({ bind: (...a) => ({ run: async () => rows.push(a) }) }) } };
const fd = (o, files = []) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.append(k, v); files.forEach((x) => f.append('bilder', x)); return f; };
const run = async (f, e = env) => { const r = await onRequestPost({ request: new Request('https://meisterwerk.pages.dev/api/anfrage', { method: 'POST', body: f }), env: e }); return [r.status, await r.json()]; };
const zeilen = JSON.stringify([{ label: 'Leistungen', value: 'Tapezieren, Lackieren' }, { label: 'Fläche in m²', value: '45' }, { label: 'Nachricht', value: 'Wohnzimmer <b>und</b> Flur' }]);
const base = { art: 'projekt', name: 'Erika Mustermann', email: 'Erika@Example.de', telefon: '0711 123', seite: '/kontakt/', daten: zeilen, 'cf-turnstile-response': 'tok' };
const ok = (c, m) => { console.log((c ? 'OK     ' : 'FEHLER ') + m); if (!c) process.exitCode = 1; };

let [s, j] = await run(fd({ ...base, website: 'http://spam' })); ok(s === 200 && j.ok && !calls.length, 'Honeypot: Antwort ok, nichts gesendet');
[s, j] = await run(fd({ ...base, name: '' })); ok(s === 422, 'Name fehlt: 422 (' + j.error + ')');
[s, j] = await run(fd({ ...base, email: 'kaputt' })); ok(s === 422, 'E-Mail ungültig: 422');
[s, j] = await run(fd({ ...base, daten: '[]' })); ok(s === 422, 'Keine Angaben: 422');
tsOk = false; [s, j] = await run(fd(base)); ok(s === 403 && !calls.length, 'Turnstile gescheitert: 403, nichts gesendet'); tsOk = true;
[s, j] = await run(fd({ ...base, 'cf-turnstile-response': '' })); ok(s === 403, 'Ohne Turnstile-Token: 403');
const bild = (n, kb) => new File([new Uint8Array(kb * 1024)], n, { type: 'image/jpeg' });
[s, j] = await run(fd(base, Array.from({ length: 13 }, (_, i) => bild(`b${i}.jpg`, 1)))); ok(s === 422, '13 Bilder: 422');
[s, j] = await run(fd(base, [new File(['x'], 'a.exe', { type: 'application/octet-stream' })])); ok(s === 422, 'Kein Bild: 422');

calls.length = 0; puts.length = 0; rows.length = 0;
[s, j] = await run(fd(base, [bild('Küche Foto 1.JPG', 300), bild('flur.jpg', 200)]));
ok(s === 200 && j.ok && /^MW-\d{6}-[0-9A-F]{6}$/.test(j.ref), 'Projektanfrage: ok, Referenz ' + j.ref);
ok(calls.length === 2, 'zwei Mails an Resend (' + calls.length + ')');
const [team, kunde] = calls.map((c) => c.body);
ok(team.to[0] === 'info@meisterwerk-lb.de' && team.reply_to === 'erika@example.de', 'Mail an Betrieb, Antwort an Kunden (klein geschrieben)');
ok(team.attachments?.length === 2, 'Betrieb: 2 Bilder im Anhang (' + team.attachments?.map((a) => a.filename).join(', ') + ')');
ok(kunde.to[0] === 'erika@example.de' && kunde.reply_to === 'info@meisterwerk-lb.de' && !kunde.attachments, 'Kunde: Bestätigung, Antwort an Betrieb, ohne Anhang');
ok(puts.length === 2 && rows.length === 1, 'R2: 2 Bilder abgelegt, D1: 1 Zeile (' + puts.map((p) => p[0]).join(', ') + ')');
ok(!/<b>und<\/b>/.test(team.html) && team.html.includes('&lt;b&gt;und&lt;/b&gt;'), 'HTML in der Nachricht wird maskiert');
const alles = [team.subject, team.html, team.text, kunde.subject, kunde.html, kunde.text].join('\n');
ok(!/[–—\u{1F300}-\u{1FAFF}☀-➿]/u.test(alles), 'Mails ohne Gedankenstrich und ohne Emoji');
ok(team.subject.includes('Erika Mustermann') && kunde.subject === 'Ihre Anfrage bei Meisterwerk Malermanufaktur', 'Betreffzeilen: "' + team.subject + '" / "' + kunde.subject + '"');
ok(kunde.html.includes('cal.com/meisterwerk') && kunde.html.includes('Guten Tag Erika Mustermann'), 'Kunden-Mail: Terminlink und Anrede');

calls.length = 0; [s, j] = await run(fd({ art: 'kurz', name: 'Hans', email: '', telefon: '0171 555', seite: '/meisterwerk-exklusive/', daten: JSON.stringify([{ label: 'Nachricht', value: 'Rückruf bitte' }]), 'cf-turnstile-response': 'tok' }));
ok(s === 200 && calls.length === 1 && !calls[0].body.reply_to && calls[0].body.subject.startsWith('Exklusive:'), 'Kurznachricht nur mit Telefon: 1 Mail, kein Reply-To, Exklusive erkannt ("' + calls[0].body.subject + '")');

calls.length = 0; resendOk = false; [s, j] = await run(fd(base)); ok(s === 502 && /rufen Sie uns an/.test(j.error), 'Resend fällt aus: 502 mit Hinweis'); resendOk = true;
calls.length = 0; const big = [bild('a.jpg', 20000), bild('b.jpg', 10000)]; [s, j] = await run(fd(base, big));
ok(s === 200 && !calls[0].body.attachments && /zu groß für den Anhang/.test(calls[0].body.html), 'Über 25 MB: Mail ohne Anhang mit Hinweis auf die Ablage');
[s, j] = await run(fd(base), { ...env, TURNSTILE_SECRET: undefined, RESEND_API_KEY: undefined, UPLOADS: undefined, DB: undefined }); ok(s === 200 && j.ok, 'Ohne Konfiguration (lokale Tests): ok, nichts gesendet');
