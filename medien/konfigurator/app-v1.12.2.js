/* Pool-Konfigurator – Poolbau Koch GmbH */
(function () {
  'use strict';

  var CFG = JSON.parse(document.getElementById('pk-config').textContent);
  var CAT = CFG.catalog;
  var API = CFG.base + '/api.php';
  var MODELS_PAGE = 12;

  var STEP_DEFS = {
    manufacturer: { id: 'manufacturer', short: 'Hersteller', title: 'Welcher Pool-Hersteller passt zu Ihnen?', intro: 'Wählen Sie zuerst die gewünschte Bauweise und Designsprache. Danach zeigen wir ausschließlich passende Beckenmodelle.' },
    model:        { id: 'model', short: 'Becken', title: 'Wählen Sie Ihr Beckenmodell', intro: 'Alle Modellnamen und Maße stammen aus den Herstellerkatalogen 2026.' },
    color:        { id: 'color', short: 'Farbe', title: 'Welche Beckenfarbe gefällt Ihnen?', intro: 'Wählen Sie die Oberfläche, die am besten zu Garten, Architektur und gewünschter Wasserwirkung passt.' },
    led:          { id: 'led', short: 'LED-Streifen', title: 'LED-Streifen am Beckenrand', intro: 'Die integrierte Lichtlinie setzt die klare Beckengeometrie auch am Abend in Szene.' },
    cover:        { id: 'cover', short: 'Abdeckung', title: 'Wie soll Ihr Pool abgedeckt werden?', intro: 'Eine passende Abdeckung erhöht Komfort, Sicherheit und Energieeffizienz.' },
    technology:   { id: 'technology', short: 'Technik', title: 'Wo soll die Pooltechnik untergebracht werden?', intro: 'Wählen Sie eine kompakte Technikbox oder eine flexible Technikwand für Gartenhaus und Garage.' },
    iwash:        { id: 'iwash', short: 'iWash', title: 'Automatische Rückspülfunktion', intro: 'iWash automatisiert den Rückspülvorgang und reduziert den manuellen Pflegeaufwand.' },
    heatpump:     { id: 'heatpump', short: 'Wärmepumpe', title: 'Ihre gewünschte Beckenbeheizung', intro: 'Verlängern Sie die Poolsaison mit einer effizienten Wärmepumpe – oder planen Sie zunächst ohne Beheizung.' },
    lighting:     { id: 'lighting', short: 'Licht', title: 'Welche Scheinwerfer wünschen Sie?', intro: 'Wählen Sie stimmungsvolles RGB-Licht mit komfortabler Steuerung oder eine klassische weiße Beleuchtung.' },
    contact:      { id: 'contact', short: 'Kontakt', title: 'Wie dürfen wir Sie erreichen?', intro: 'Damit wir Ihre Konfiguration persönlich besprechen können, benötigen wir Ihre Kontaktdaten und ein passendes Zeitfenster.' }
  };

  var LED_LABELS = {
    'not-applicable': 'Nicht verfügbar',
    'none': 'Ohne LED-Streifen',
    'yes': 'Mit LED-Streifen',
    'one-side': 'LED-Streifen einseitig',
    'both-sides': 'LED-Streifen beidseitig'
  };

  var state = {
    manufacturerId: '', modelId: '', colorId: '', ledOption: '',
    coverId: '', technologyId: '', iwashId: '', heatpumpId: '', lightingId: '',
    name: '', street: '', postalCode: '', city: '', email: '', phone: '',
    reachabilitySlot: '', budgetRange: '', customerWishes: '', privacyAccepted: false
  };
  var ui = { index: 0, error: '', fieldErrors: {}, search: '', family: 'Alle', visible: MODELS_PAGE, sending: false, done: null, started: false };

  var $panel = document.getElementById('stepPanel');
  var $stepper = document.getElementById('stepper');
  var $summary = document.getElementById('summaryList');
  var $bar = document.getElementById('progressBar');
  var $ptext = document.getElementById('progressText');
  var $ppct = document.getElementById('progressPct');

  /* ---------------- helpers ---------------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function byId(list, id) { for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; } return null; }

  /** Ausstattung einer Kategorie – ohne die für das gewählte Becken gesperrten Optionen. */
  function equip(cat) {
    var all = CAT.equipment.filter(function (e) { return e.category === cat; });
    var m = currentModel();
    var ex = (m && m.excluded) || [];
    if (!ex.length) return all;
    var allowed = all.filter(function (e) { return ex.indexOf(e.id) === -1; });
    return allowed.length ? allowed : all;
  }

  /** Für das gewählte Becken gesperrte Optionen einer Kategorie. */
  function equipBlocked(cat) {
    var m = currentModel();
    var ex = (m && m.excluded) || [];
    if (!ex.length) return [];
    var all = CAT.equipment.filter(function (e) { return e.category === cat; });
    var blocked = all.filter(function (e) { return ex.indexOf(e.id) !== -1; });
    return blocked.length < all.length ? blocked : [];
  }

  /**
   * Beschreibungstexte: mehrere Zeilen werden als Stichpunkt-Liste dargestellt,
   * eine einzelne Zeile bleibt normaler Fließtext.
   */
  function descHtml(text, cls) {
    if (!text) return '';
    var lines = String(text).split(/\r?\n/)
      .map(function (l) { return l.replace(/^\s*[-–•*]\s*/, '').trim(); })
      .filter(function (l) { return l.length > 0; });
    if (!lines.length) return '';
    if (lines.length === 1) {
      return '<span class="' + cls + '">' + esc(lines[0]) + '</span>';
    }
    return '<ul class="' + cls + ' bullets">'
      + lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('')
      + '</ul>';
  }
  function ledSelected() { return ['yes', 'one-side', 'both-sides'].indexOf(state.ledOption) !== -1; }
  function currentModel() { return byId(CAT.models, state.modelId); }
  function imgStyle(img) {
    if (!img) return '';
    return 'object-position:' + (img.x != null ? img.x : 50) + '% ' + (img.y != null ? img.y : 50) + '%;' +
           '--zoom:' + ((img.zoom || 100) / 100) + ';';
  }

  function stepIds() {
    var ids = ['manufacturer', 'model', 'color'];
    var m = currentModel();
    if (m && m.ledCapability && m.ledCapability !== 'none') ids.push('led');
    ids.push('cover', 'technology', 'iwash', 'heatpump');
    if (!ledSelected()) ids.push('lighting');
    ids.push('contact');
    return ids;
  }
  function steps() { return stepIds().map(function (id) { return STEP_DEFS[id]; }); }
  function currentStep() { var s = steps(); return s[Math.min(ui.index, s.length - 1)]; }

  /* ---------------- Zwischenstand sichern ---------------- */

  /**
   * Die getroffene Auswahl wird im Browser des Besuchers gesichert, damit ein
   * versehentliches Neuladen oder ein Tabwechsel nicht neun Schritte Arbeit kostet.
   * Bewusst NICHT gespeichert werden Kontaktdaten – die könnten auf einem
   * gemeinsam genutzten Gerät sonst der nächsten Person angezeigt werden.
   */
  var DRAFT_KEY = 'pk_draft_v1';
  var DRAFT_TAGE = 7;
  var DRAFT_FELDER = ['manufacturerId', 'modelId', 'colorId', 'ledOption',
                      'coverId', 'technologyId', 'iwashId', 'heatpumpId', 'lightingId'];

  function draftSpeichern() {
    if (ui.done) return;
    try {
      var daten = {};
      var etwasGewaehlt = false;
      DRAFT_FELDER.forEach(function (k) {
        daten[k] = state[k];
        if (state[k]) etwasGewaehlt = true;
      });
      if (!etwasGewaehlt) { localStorage.removeItem(DRAFT_KEY); return; }
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ v: 1, t: Date.now(), i: ui.index, s: daten }));
    } catch (e) { /* z. B. privater Modus – dann eben ohne Sicherung */ }
  }

  function draftLoeschen() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  }

  /** Gibt true zurück, wenn ein Zwischenstand wiederhergestellt wurde. */
  function draftLaden() {
    var roh;
    try { roh = localStorage.getItem(DRAFT_KEY); } catch (e) { return false; }
    if (!roh) return false;

    var d;
    try { d = JSON.parse(roh); } catch (e) { draftLoeschen(); return false; }
    if (!d || d.v !== 1 || !d.s) { draftLoeschen(); return false; }
    if (Date.now() - (d.t || 0) > DRAFT_TAGE * 86400000) { draftLoeschen(); return false; }

    // Nur übernehmen, was es im aktuellen Katalog noch gibt.
    var mf = byId(CAT.manufacturers, d.s.manufacturerId);
    if (!mf) { draftLoeschen(); return false; }
    state.manufacturerId = mf.id;

    var m = byId(CAT.models, d.s.modelId);
    if (m && m.manufacturerId === mf.id) state.modelId = m.id;

    var c = byId(CAT.colors, d.s.colorId);
    if (c && c.manufacturerId === mf.id && (!c.modelId || c.modelId === state.modelId)) state.colorId = c.id;

    if (state.modelId) {
      var mm = currentModel();
      if (mm && mm.ledCapability !== 'none' && ['none', 'yes', 'one-side', 'both-sides'].indexOf(d.s.ledOption) !== -1) {
        state.ledOption = d.s.ledOption;
      }
    }
    [['cover', 'coverId'], ['technology', 'technologyId'], ['iwash', 'iwashId'],
     ['heatpump', 'heatpumpId'], ['lighting', 'lightingId']].forEach(function (t) {
      var e = byId(CAT.equipment, d.s[t[1]]);
      if (e && e.category === t[0] && equip(t[0]).some(function (x) { return x.id === e.id; })) {
        state[t[1]] = e.id;
      }
    });
    if (ledSelected()) state.lightingId = '';

    var maxIndex = stepIds().indexOf('contact');
    ui.index = Math.max(0, Math.min(parseInt(d.i, 10) || 0, maxIndex));
    ui.started = true;
    draftDatum = d.t;
    return true;
  }

  var draftDatum = 0;
  var draftWiederhergestellt = false;

  function draftHinweis() {
    if (!draftWiederhergestellt) return '';
    var wann = '';
    try {
      var dt = new Date(draftDatum);
      var heute = new Date();
      wann = (dt.toDateString() === heute.toDateString())
        ? 'von vorhin'
        : 'vom ' + dt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {}
    return '<div class="restore-note"><svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/></svg>'
      + '<div><strong>Willkommen zurück</strong>'
      + 'Wir haben Ihre Auswahl ' + esc(wann) + ' wiederhergestellt. Sie können direkt weitermachen.</div>'
      + '<button type="button" class="btn btn-ghost btn-sm" id="draftReset">Neu beginnen</button></div>';
  }

  /* ---------------- analytics ---------------- */

  var sid = null;
  function sessionId() {
    if (sid) return sid;
    try {
      sid = sessionStorage.getItem('pk_sid');
      if (!sid || !/^[a-f0-9]{32}$/.test(sid)) {
        var b = new Uint8Array(16);
        (window.crypto || window.msCrypto).getRandomValues(b);
        sid = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
        sessionStorage.setItem('pk_sid', sid);
      }
    } catch (e) { sid = null; }
    return sid;
  }

  var params = new URLSearchParams(location.search);
  function track(type, extra) {
    if (!CFG.analytics) return;
    var id = sessionId();
    if (!id) return;
    var body = Object.assign({
      sid: id, type: type, path: location.pathname, referrer: document.referrer || '',
      utmSource: params.get('utm_source') || '', utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || ''
    }, extra || {});
    var payload = JSON.stringify(body);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API + '?a=track', new Blob([payload], { type: 'application/json' }));
        return;
      }
    } catch (e) { /* fall through */ }
    fetch(API + '?a=track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(function () {});
  }
  /**
   * Meldet, welche Kontaktfelder tatsächlich ausgefüllt wurden.
   * Daraus entsteht im Dashboard die Auswertung, an welchem Feld Schluss war.
   * Übertragen wird nur der Feldname – niemals der eingegebene Inhalt.
   */
  var gemeldeteFelder = {};
  function trackFeld(feld) {
    if (gemeldeteFelder[feld]) return;
    gemeldeteFelder[feld] = true;
    track('form_field', { stepId: feld, stepIndex: ui.index, stepsTotal: steps().length });
  }

  var FELD_PRUEFUNG = {
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { return v.trim().length >= 6; },
    email: function (v) { return /^\S+@\S+\.\S+$/.test(v.trim()); },
    street: function (v) { return v.trim().length >= 3; },
    postalCode: function (v) { return /^\d{5}$/.test(v.trim()); },
    city: function (v) { return v.trim().length >= 2; },
    customerWishes: function (v) { return v.trim().length > 0; }
  };

  function trackStep() {
    var all = stepIds(), s = currentStep();
    if (!s) return;
    track('step_view', { stepId: s.id, stepIndex: ui.index, stepsTotal: all.length });
  }

  /* ---------------- card renderers ---------------- */

  function card(o) {
    var media = '';
    if (o.image && o.image.thumb) {
      media = '<span class="option-media' + (o.contain ? ' contain' : '') + '">'
        + (o.badge ? '<span class="option-badge">' + esc(o.badge) + '</span>' : '')
        + '<img src="' + esc(o.image.thumb) + '" alt="' + esc(o.title) + '" loading="lazy" decoding="async" style="' + imgStyle(o.image) + '">'
        + '</span>';
    } else if (o.forceMedia) {
      media = '<span class="option-media option-media-empty">'
        + (o.badge ? '<span class="option-badge">' + esc(o.badge) + '</span>' : '')
        + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8c2.5-2 4.5-2 7 0s4.5 2 7 0M3 13c2.5-2 4.5-2 7 0s4.5 2 7 0M3 18c2.5-2 4.5-2 7 0s4.5 2 7 0"/></svg>'
        + '</span>';
    }
    return '<button type="button" class="option' + (o.selected ? ' is-selected' : '') + (o.compact ? ' option-compact' : '') + '" '
      + 'data-pick="' + esc(o.pick) + '" data-value="' + esc(o.value) + '" aria-pressed="' + (o.selected ? 'true' : 'false') + '">'
      + '<span class="option-check"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>'
      + media
      + '<span class="option-body">'
      + (o.kicker ? '<span class="option-kicker">' + esc(o.kicker) + '</span>' : '')
      + '<span class="option-title">' + esc(o.title) + '</span>'
      + (o.sub ? '<span class="option-sub">' + esc(o.sub) + '</span>' : '')
      + (o.meta ? '<span class="option-meta"><svg viewBox="0 0 24 24"><path d="M3 7h18M3 17h18M7 3v18M17 3v18"/></svg>' + esc(o.meta) + '</span>' : '')
      + descHtml(o.desc, 'option-desc')
      + descHtml(o.desc2, 'option-desc')
      + (o.badgeInline ? '<span class="badge-inline">' + esc(o.badgeInline) + '</span>' : '')
      + '</span></button>';
  }

  /* ---------------- steps ---------------- */

  function renderManufacturer() {
    return '<div class="grid grid-2">' + CAT.manufacturers.map(function (m) {
      return card({
        pick: 'manufacturerId', value: m.id, selected: state.manufacturerId === m.id,
        kicker: m.technology, title: m.name, sub: m.tagline, desc: m.description,
        image: m.image, contain: true
      });
    }).join('') + '</div>';
  }

  /** Form und Treppe zusammenfassen, ohne Dopplungen. */
  function modelDesc(m) {
    var parts = [];
    [m.shape, m.stairs].forEach(function (p) {
      if (!p) return;
      p = String(p).trim();
      if (!p) return;
      for (var i = 0; i < parts.length; i++) {
        var a = parts[i].toLowerCase(), b = p.toLowerCase();
        if (a === b || a.indexOf(b) !== -1) return;
        if (b.indexOf(a) !== -1) { parts[i] = p; return; }
      }
      parts.push(p);
    });
    return parts.join(' · ');
  }

  function modelsForManufacturer() {
    return CAT.models.filter(function (m) { return m.manufacturerId === state.manufacturerId; });
  }

  function renderModel() {
    var all = modelsForManufacturer();
    var families = ['Alle'].concat(all.map(function (m) { return m.family; })
      .filter(function (f, i, a) { return f && a.indexOf(f) === i; }).sort());
    var term = ui.search.trim().toLowerCase();
    var list = all.filter(function (m) {
      var okFam = ui.family === 'Alle' || m.family === ui.family;
      var okTerm = !term || (m.name + ' ' + (m.dimensions || '') + ' ' + (m.family || '')).toLowerCase().indexOf(term) !== -1;
      return okFam && okTerm;
    });
    var shown = list.slice(0, ui.visible);

    var html = '<div class="filter-bar">'
      + '<div class="search-field"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>'
      + '<input type="search" id="modelSearch" placeholder="Modell oder Maß suchen" value="' + esc(ui.search) + '" autocomplete="off"></div>'
      + '<span class="result-count">' + list.length + ' Modell' + (list.length === 1 ? '' : 'e') + '</span></div>';

    if (families.length > 2) {
      html += '<div class="chips">' + families.map(function (f) {
        return '<button type="button" class="chip' + (ui.family === f ? ' is-active' : '') + '" data-family="' + esc(f) + '">' + esc(f) + '</button>';
      }).join('') + '</div>';
    }

    if (!shown.length) {
      html += '<p class="summary-empty">Keine Modelle gefunden. Bitte Suche oder Filter anpassen.</p>';
      return html;
    }

    html += '<div class="grid grid-3">' + shown.map(function (m) {
      return card({
        pick: 'modelId', value: m.id, selected: state.modelId === m.id,
        badge: m.family || '', title: m.name, meta: m.dimensions,
        desc: modelDesc(m), desc2: m.description,
        image: m.image, forceMedia: true
      });
    }).join('') + '</div>';

    if (list.length > shown.length) {
      var rest = list.length - shown.length;
      var naechste = Math.min(MODELS_PAGE, rest);
      html += '<div class="load-more"><button type="button" class="btn btn-primary btn-lg" id="loadMore">'
        + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m0 0-5-5m5 5 5-5"/></svg> '
        + (naechste === 1 ? 'Weiteres Modell anzeigen' : 'Weitere ' + naechste + ' Modelle anzeigen')
        + (rest > naechste ? '<span class="load-more-rest">noch ' + rest + '</span>' : '')
        + '</button></div>';
    }
    return html;
  }

  function renderColor() {
    var list = CAT.colors.filter(function (c) {
      return c.manufacturerId === state.manufacturerId && (!c.modelId || c.modelId === state.modelId);
    });
    if (!list.length) return '<p class="summary-empty">Für diesen Hersteller sind aktuell keine Farben hinterlegt.</p>';
    return '<div class="grid grid-3">' + list.map(function (c) {
      return card({
        pick: 'colorId', value: c.id, selected: state.colorId === c.id,
        title: c.name, desc: c.description, image: c.image, forceMedia: true
      });
    }).join('') + '</div>';
  }

  function renderLed() {
    var m = currentModel();
    if (!m) return '';
    var side = m.ledCapability === 'side-selectable';
    var html = '<div class="info-box"><svg viewBox="0 0 24 24"><path d="M12 3v2m0 14v2M5.6 5.6 7 7m10 10 1.4 1.4M3 12h2m14 0h2M5.6 18.4 7 17m10-10 1.4-1.4"/><circle cx="12" cy="12" r="3.5"/></svg>'
      + '<div><strong>Für ' + esc(m.name) + '</strong>'
      + (side ? 'Bei diesem Double-Modell kann die LED-Lichtlinie einseitig oder beidseitig geplant werden.'
              : 'Für dieses Modell können Sie den integrierten LED-Streifen optional hinzufügen.')
      + (m.ledPreview ? '<img src="' + esc(m.ledPreview) + '" alt="LED-Beispiel" loading="lazy">' : '')
      + '</div></div>';

    var opts = [{ v: 'none', t: 'Ohne LED-Streifen', d: 'Klassische Beckenausführung ohne umlaufende Lichtlinie.' }];
    if (side) {
      opts.push({ v: 'one-side', t: 'LED einseitig', d: 'Lichtlinie auf einer Beckenseite.', b: 'Double-Serie' });
      opts.push({ v: 'both-sides', t: 'LED beidseitig', d: 'Lichtlinien auf beiden Beckenseiten.', b: 'Double-Serie' });
    } else {
      opts.push({ v: 'yes', t: 'Mit LED-Streifen', d: 'Umlaufende Lichtlinie am Beckenrand.' });
    }

    html += '<div class="grid grid-3">' + opts.map(function (o) {
      return card({ pick: 'ledOption', value: o.v, selected: state.ledOption === o.v, title: o.t, desc: o.d, badgeInline: o.b, compact: true });
    }).join('') + '</div>';
    return html;
  }

  function renderEquipment(cat, key) {
    var list = equip(cat);
    if (!list.length) return '<p class="summary-empty">Für diesen Bereich sind aktuell keine Optionen hinterlegt.</p>';

    var html = '';
    var blocked = equipBlocked(cat);
    if (blocked.length) {
      var m = currentModel();
      html += '<div class="info-box"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>'
        + '<div><strong>Hinweis zu ' + esc(m ? m.name : 'diesem Becken') + '</strong>'
        + (blocked.length === 1
            ? esc(blocked[0].name) + ' ist für dieses Beckenmodell bauartbedingt nicht verfügbar und wird deshalb nicht angezeigt.'
            : 'Folgende Optionen sind für dieses Beckenmodell nicht verfügbar: '
              + esc(blocked.map(function (b) { return b.name; }).join(', ')) + '.')
        + '</div></div>';
    }

    html += '<div class="grid grid-2">' + list.map(function (o) {
      return card({
        pick: key, value: o.id, selected: state[key] === o.id,
        title: o.name, desc: o.description, image: o.image, badgeInline: o.badge, forceMedia: true
      });
    }).join('') + '</div>';
    return html;
  }

  function renderContact() {
    var fe = ui.fieldErrors;

    // Zusammenklappbare Kurzübersicht: eine Zeile im geschlossenen Zustand,
    // damit das Formular nicht länger wird, der Kunde aber nachsehen kann.
    var zeilen = summaryRows().filter(function (r) { return r.v; });
    var m0 = currentModel();
    var recap = zeilen.length
      ? '<details class="recap"><summary><span class="recap-label">Ihre Auswahl</span>'
        + '<span class="recap-kurz">' + esc(m0 ? m0.name : '') + (m0 && m0.dimensions ? ' · ' + esc(m0.dimensions) : '') + '</span>'
        + '<span class="recap-mehr">anzeigen</span></summary>'
        + '<div class="recap-liste">' + zeilen.map(function (r) {
            return '<div><span>' + esc(r.k) + '</span><strong>' + esc(r.v) + '</strong></div>';
          }).join('') + '</div></details>'
      : '';
    function f(key, label, attrs, extra) {
      return '<div class="field' + (fe[key] ? ' has-error' : '') + (extra && extra.full ? ' field-full' : '') + '">'
        + '<label for="f_' + key + '">' + esc(label) + ' <span class="req">*</span></label>'
        + '<input id="f_' + key + '" name="' + key + '" value="' + esc(state[key]) + '" ' + attrs + '>'
        + (fe[key] ? '<span class="field-error">' + esc(fe[key]) + '</span>' : '') + '</div>';
    }

    var html = recap + '<div class="form-grid">'
      + f('name', 'Vor- und Nachname', 'type="text" autocomplete="name" placeholder="Max Mustermann"', { full: false })
      + f('phone', 'Telefonnummer', 'type="tel" autocomplete="tel" placeholder="0170 1234567"')
      + f('email', 'E-Mail-Adresse', 'type="email" autocomplete="email" placeholder="name@beispiel.de"', { full: true })
      + f('street', 'Straße und Hausnummer', 'type="text" autocomplete="street-address" placeholder="Musterweg 12"', { full: true })
      + f('postalCode', 'Postleitzahl', 'type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" placeholder="34117"')
      + f('city', 'Ort', 'type="text" autocomplete="address-level2" placeholder="Kassel"')
      + '</div>';

    html += '<div class="field field-full' + (fe.reachabilitySlot ? ' has-error' : '') + '" style="margin-top:1.1rem">'
      + '<label>Wann dürfen wir Sie erreichen? <span class="req">*</span></label>'
      + '<div class="slot-grid">' + CFG.slots.map(function (s) {
        return '<button type="button" class="slot' + (state.reachabilitySlot === s ? ' is-selected' : '') + '" data-slot="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('') + '</div>'
      + (fe.reachabilitySlot ? '<span class="field-error">' + esc(fe.reachabilitySlot) + '</span>' : '') + '</div>';

    if (CFG.budgets && CFG.budgets.length) {
      html += '<div class="field field-full' + (fe.budgetRange ? ' has-error' : '') + '" style="margin-top:1.1rem">'
        + '<label>Welcher Budgetrahmen ist für Sie realistisch? <span class="req">*</span></label>'
        + '<div class="slot-grid">' + CFG.budgets.map(function (b) {
          return '<button type="button" class="slot' + (state.budgetRange === b ? ' is-selected' : '') + '" data-budget="' + esc(b) + '">' + esc(b) + '</button>';
        }).join('') + '</div>'
        + (fe.budgetRange ? '<span class="field-error">' + esc(fe.budgetRange) + '</span>' : '') + '</div>';
    }

    html += '<div class="field field-full" style="margin-top:1.1rem">'
      + '<label for="f_customerWishes">Ihre individuellen Wünsche (optional)</label>'
      + '<textarea id="f_customerWishes" name="customerWishes" maxlength="2000" placeholder="Gartensituation, Wunschtermin, Besonderheiten …">' + esc(state.customerWishes) + '</textarea></div>';

    html += '<div class="consent' + (fe.privacyAccepted ? ' has-error' : '') + '">'
      + '<input type="checkbox" id="f_privacy" ' + (state.privacyAccepted ? 'checked' : '') + '>'
      + '<label for="f_privacy">Ich habe die <a href="' + esc(CFG.privacyUrl) + '" target="_blank" rel="noopener">Datenschutzhinweise</a> gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert und verarbeitet werden. <span class="req">*</span></label></div>'
      + (fe.privacyAccepted ? '<span class="field-error">' + esc(fe.privacyAccepted) + '</span>' : '');

    html += '<div class="hp"><label>Website<input type="text" id="f_website" tabindex="-1" autocomplete="off"></label></div>';
    return html;
  }

  function summaryRows() {
    var m = currentModel();
    var rows = [
      { k: 'Hersteller', v: (byId(CAT.manufacturers, state.manufacturerId) || {}).name, step: 'manufacturer' },
      { k: 'Beckenmodell', v: m ? m.name : null, m: m ? m.dimensions : '', step: 'model' },
      { k: 'Beckenfarbe', v: (byId(CAT.colors, state.colorId) || {}).name, step: 'color' }
    ];
    if (state.ledOption && state.ledOption !== 'not-applicable') {
      rows.push({ k: 'LED-Streifen', v: LED_LABELS[state.ledOption], step: 'led' });
    }
    [['Abdeckung', 'coverId', 'cover'], ['Technik', 'technologyId', 'technology'],
     ['iWash', 'iwashId', 'iwash'], ['Wärmepumpe', 'heatpumpId', 'heatpump']].forEach(function (t) {
      var o = byId(CAT.equipment, state[t[1]]);
      rows.push({ k: t[0], v: o ? o.name : null, m: o ? o.badge : '', step: t[2] });
    });
    if (!ledSelected()) {
      var l = byId(CAT.equipment, state.lightingId);
      rows.push({ k: 'Beleuchtung', v: l ? l.name : null, m: l ? l.badge : '', step: 'lighting' });
    }
    return rows;
  }

  function renderSuccess() {
    return '<div class="success">'
      + '<div class="success-icon"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>'
      + '<h3>Vielen Dank für Ihre Konfiguration.</h3>'
      + '<p>Unser Planungsteam hat Ihre Auswahl erhalten und meldet sich in Ihrem gewünschten Zeitfenster bei Ihnen.</p>'
      + '<div class="success-ref"><span>Ihre Referenz</span><strong>' + esc(ui.done) + '</strong></div>'
      + '<p style="margin-top:1.4rem;font-size:.9rem">Eine Bestätigung ist an <strong>' + esc(state.email) + '</strong> unterwegs.</p>'
      + '<div style="margin-top:1.8rem"><button type="button" class="btn btn-ghost" id="restart">Neue Konfiguration starten</button></div>'
      + '</div>';
  }

  /* ---------------- validation ---------------- */

  function validateStep() {
    var s = currentStep();
    if (!s) return true;
    ui.error = ''; ui.fieldErrors = {};
    switch (s.id) {
      case 'manufacturer': if (!state.manufacturerId) ui.error = 'Bitte wählen Sie einen Hersteller aus.'; break;
      case 'model':        if (!state.modelId) ui.error = 'Bitte wählen Sie ein Beckenmodell aus.'; break;
      case 'color':        if (!state.colorId) ui.error = 'Bitte wählen Sie eine Beckenfarbe aus.'; break;
      case 'led':          if (!state.ledOption) ui.error = 'Bitte wählen Sie eine LED-Streifen-Ausführung.'; break;
      case 'cover':        if (!state.coverId) ui.error = 'Bitte wählen Sie eine Abdeckung.'; break;
      case 'technology':   if (!state.technologyId) ui.error = 'Bitte wählen Sie eine Techniklösung.'; break;
      case 'iwash':        if (!state.iwashId) ui.error = 'Bitte wählen Sie eine iWash-Option.'; break;
      case 'heatpump':     if (!state.heatpumpId) ui.error = 'Bitte wählen Sie eine Wärmepumpen-Option.'; break;
      case 'lighting':     if (!state.lightingId) ui.error = 'Bitte wählen Sie eine Scheinwerfer-Ausführung.'; break;
      case 'contact':      validateContact(); break;
    }
    if (ui.error) track('validation_error', { stepId: s.id, stepIndex: ui.index, meta: ui.error.slice(0, 200) });
    return !ui.error;
  }

  function validateContact() {
    var fe = {};
    if (state.name.trim().length < 2) fe.name = 'Bitte geben Sie Ihren Namen ein.';
    if (state.street.trim().length < 3) fe.street = 'Bitte geben Sie Straße und Hausnummer ein.';
    if (!/^\d{5}$/.test(state.postalCode.trim())) fe.postalCode = 'Bitte fünfstellige Postleitzahl.';
    if (state.city.trim().length < 2) fe.city = 'Bitte geben Sie Ihren Ort ein.';
    if (!/^\S+@\S+\.\S+$/.test(state.email.trim())) fe.email = 'Bitte gültige E-Mail-Adresse.';
    if (state.phone.trim().length < 6 || !/^[+()\d\s./-]+$/.test(state.phone.trim())) fe.phone = 'Bitte gültige Telefonnummer.';
    if (!state.reachabilitySlot) fe.reachabilitySlot = 'Bitte wählen Sie ein Zeitfenster.';
    if (CFG.budgets && CFG.budgets.length && !state.budgetRange) fe.budgetRange = 'Bitte wählen Sie einen Budgetrahmen.';
    if (!state.privacyAccepted) fe.privacyAccepted = 'Bitte bestätigen Sie die Datenschutzhinweise.';
    ui.fieldErrors = fe;
    if (Object.keys(fe).length) ui.error = 'Bitte prüfen Sie die markierten Felder.';
  }

  /* ---------------- render ---------------- */

  function render() {
    if (ui.done) {
      $panel.innerHTML = renderSuccess();
      $panel.classList.add('step-enter');
      renderStepper(); renderSummaryCard(); setProgress(1, 1, true);
      return;
    }

    var all = steps();
    if (ui.index >= all.length) ui.index = all.length - 1;
    var s = all[ui.index];

    var body = '';
    switch (s.id) {
      case 'manufacturer': body = renderManufacturer(); break;
      case 'model':        body = renderModel(); break;
      case 'color':        body = renderColor(); break;
      case 'led':          body = renderLed(); break;
      case 'cover':        body = renderEquipment('cover', 'coverId'); break;
      case 'technology':   body = renderEquipment('technology', 'technologyId'); break;
      case 'iwash':        body = renderEquipment('iwash', 'iwashId'); break;
      case 'heatpump':     body = renderEquipment('heatpump', 'heatpumpId'); break;
      case 'lighting':     body = renderEquipment('lighting', 'lightingId'); break;
      case 'contact':      body = renderContact(); break;
    }

    var last = ui.index === all.length - 1;
    $panel.innerHTML =
      '<div class="panel-head"><p class="eyebrow">' + esc(s.short) + '</p><h3>' + esc(s.title) + '</h3><p>' + esc(s.intro) + '</p></div>'
      + draftHinweis()
      + (ui.error ? '<div class="form-alert">' + esc(ui.error) + '</div>' : '')
      + body
      + '<div class="panel-nav">'
      + '<button type="button" class="btn btn-ghost" id="btnBack"' + (ui.index === 0 ? ' disabled' : '') + '>'
      + '<svg viewBox="0 0 24 24"><path d="M20 12H6m0 0 5-5m-5 5 5 5"/></svg> Zurück</button>'
      + (last
        ? '<button type="button" class="btn btn-primary btn-lg" id="btnSubmit"' + (ui.sending ? ' disabled' : '') + '>'
          + (ui.sending ? 'Wird gesendet …' : 'Anfrage jetzt absenden')
          + '<svg viewBox="0 0 24 24"><path d="m4 12 16-8-6 16-2-6z"/></svg></button>'
        : '<button type="button" class="btn btn-secondary" id="btnNext">Weiter '
          + '<svg viewBox="0 0 24 24"><path d="M4 12h14m0 0-5-5m5 5-5 5"/></svg></button>')
      + '</div>';

    $panel.classList.remove('step-enter');
    void $panel.offsetWidth;
    $panel.classList.add('step-enter');

    renderStepper();
    renderSummaryCard();
    setProgress(ui.index + 1, all.length, false);
    trackStep();
    draftSpeichern();
  }

  function renderStepper() {
    var all = steps();
    $stepper.innerHTML = all.map(function (s, i) {
      var cls = i === ui.index && !ui.done ? 'is-current' : (i < ui.index || ui.done ? 'is-done' : '');
      return '<button type="button" class="step-chip ' + cls + '" data-step="' + i + '"' + (i > ui.index ? ' disabled' : '') + '>'
        + '<span class="num">' + (i < ui.index || ui.done ? '✓' : (i + 1)) + '</span>' + esc(s.short) + '</button>';
    }).join('');

    var active = $stepper.querySelector('.is-current') || $stepper.lastElementChild;
    if (active && $stepper.scrollWidth > $stepper.clientWidth) {
      var target = active.offsetLeft - ($stepper.clientWidth - active.offsetWidth) / 2;
      $stepper.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }
  }

  function renderSummaryCard() {
    var rows = summaryRows().filter(function (r) { return r.v; });
    if (!rows.length) {
      $summary.innerHTML = '<p class="summary-empty">Ihre gewählten Komponenten erscheinen hier Schritt für Schritt.</p>';
      return;
    }
    $summary.innerHTML = rows.map(function (r) {
      return '<div class="summary-item"><span class="k">' + esc(r.k) + '</span><span class="v">' + esc(r.v) + '</span>'
        + (r.m ? '<span class="m">' + esc(r.m) + '</span>' : '') + '</div>';
    }).join('');
  }

  function setProgress(cur, total, done) {
    var pct = done ? 100 : Math.round(cur / total * 100);
    $bar.style.width = pct + '%';
    $ptext.textContent = done ? 'Abgeschlossen' : ('Schritt ' + cur + ' von ' + total);
    $ppct.textContent = pct + ' %';
  }

  /**
   * Springt zur ersten fehlerhaften Stelle.
   * Ohne das bleibt auf dem Handy die Fehlermeldung weit oberhalb des sichtbaren
   * Bereichs stehen – der Tipp auf „Weiter" wirkt dann folgenlos.
   */
  function zeigeErstenFehler() {
    setTimeout(function () {
      var ziel = $panel.querySelector('.field.has-error, .consent.has-error') || $panel.querySelector('.form-alert');
      if (!ziel) { scrollToPanel(); return; }
      var y = ziel.getBoundingClientRect().top + window.pageYOffset - Math.round(window.innerHeight / 3);
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      var eingabe = ziel.querySelector('input:not([type=hidden]), textarea, select, .slot');
      if (eingabe && typeof eingabe.focus === 'function') {
        setTimeout(function () { try { eingabe.focus({ preventScroll: true }); } catch (e) {} }, 420);
      }
    }, 30);
  }

  function scrollToPanel() {
    var y = document.getElementById('konfigurator').getBoundingClientRect().top + window.pageYOffset - 84;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /* ---------------- navigation ---------------- */

  function goNext() {
    if (!validateStep()) { render(); zeigeErstenFehler(); return; }
    var s = currentStep();
    track('step_complete', { stepId: s.id, stepIndex: ui.index, stepsTotal: steps().length });
    if (ui.index < steps().length - 1) { ui.index++; ui.error = ''; render(); scrollToPanel(); }
  }
  function goBack() {
    if (ui.index > 0) { ui.index--; ui.error = ''; ui.fieldErrors = {}; render(); scrollToPanel(); }
  }
  function goTo(stepId) {
    var i = stepIds().indexOf(stepId);
    if (i >= 0) { ui.index = i; ui.error = ''; render(); scrollToPanel(); }
  }

  /** Nach einem Beckenwechsel Auswahlen verwerfen, die dort nicht möglich sind. */
  function dropBlockedSelections() {
    [['cover', 'coverId'], ['technology', 'technologyId'], ['iwash', 'iwashId'],
     ['heatpump', 'heatpumpId'], ['lighting', 'lightingId']].forEach(function (t) {
      if (!state[t[1]]) return;
      var stillThere = equip(t[0]).some(function (e) { return e.id === state[t[1]]; });
      if (!stillThere) state[t[1]] = '';
    });
  }

  function pick(key, value) {
    if (key === 'manufacturerId' && state.manufacturerId !== value) {
      state.manufacturerId = value; state.modelId = ''; state.colorId = ''; state.ledOption = ''; state.lightingId = '';
      ui.search = ''; ui.family = 'Alle'; ui.visible = MODELS_PAGE;
    } else if (key === 'modelId' && state.modelId !== value) {
      state.modelId = value; state.colorId = ''; state.ledOption = ''; state.lightingId = '';
      dropBlockedSelections();
    } else if (key === 'ledOption') {
      state.ledOption = value;
      if (ledSelected()) state.lightingId = '';
    } else {
      state[key] = value;
    }
    if (!ui.started) { ui.started = true; track('start', { stepId: currentStep().id, stepIndex: ui.index, stepsTotal: steps().length }); }
    ui.error = '';
    render();
  }

  /* ---------------- submit ---------------- */

  function submit() {
    if (ui.sending) return;
    // Der Übersichtsschritt entfällt – deshalb hier prüfen, bevor gesendet wird.
    if (!validateStep()) { render(); zeigeErstenFehler(); return; }
    ui.sending = true; render();

    var payload = Object.assign({}, state, {
      sid: sessionId(),
      website: (document.getElementById('f_website') || {}).value || '',
      referrer: document.referrer || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || ''
    });

    fetch(API + '?a=submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        ui.sending = false;
        if (res.ok && res.body.ok) {
          ui.done = res.body.reference;
          draftLoeschen();
          track('submit', { stepId: 'contact', stepIndex: ui.index, stepsTotal: steps().length });
          render(); scrollToPanel();
          return;
        }
        ui.error = res.body.error || 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.';
        if (res.body.fields) {
          ui.fieldErrors = res.body.fields;
          var contactKeys = ['name', 'street', 'postalCode', 'city', 'email', 'phone', 'reachabilitySlot', 'privacyAccepted', 'budgetRange'];
          for (var k in res.body.fields) {
            if (contactKeys.indexOf(k) !== -1) { ui.index = stepIds().indexOf('contact'); break; }
          }
        }
        render();
        zeigeErstenFehler();
      })
      .catch(function () {
        ui.sending = false;
        ui.error = 'Verbindung fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.';
        render();
      });
  }

  function restart() {
    draftLoeschen();
    draftWiederhergestellt = false;
    Object.keys(state).forEach(function (k) { state[k] = (k === 'privacyAccepted') ? false : ''; });
    ui = { index: 0, error: '', fieldErrors: {}, search: '', family: 'Alle', visible: MODELS_PAGE, sending: false, done: null, started: false };
    try { sessionStorage.removeItem('pk_sid'); } catch (e) {}
    sid = null;
    render(); scrollToPanel(); track('pageview', {});
  }

  /* ---------------- events ---------------- */

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-scroll-to]');
    if (t) { scrollToPanel(); return; }

    var opt = ev.target.closest('.option');
    if (opt && $panel.contains(opt)) { pick(opt.dataset.pick, opt.dataset.value); return; }

    var chip = ev.target.closest('.chip[data-family]');
    if (chip) { ui.family = chip.dataset.family; ui.visible = MODELS_PAGE; render(); return; }

    var slot = ev.target.closest('.slot[data-slot]');
    if (slot) { state.reachabilitySlot = slot.dataset.slot; delete ui.fieldErrors.reachabilitySlot; trackFeld('reachabilitySlot'); render(); return; }

    var bud = ev.target.closest('.slot[data-budget]');
    if (bud) { state.budgetRange = bud.dataset.budget; delete ui.fieldErrors.budgetRange; trackFeld('budgetRange'); render(); return; }

    var goto = ev.target.closest('[data-goto]');
    if (goto) { goTo(goto.dataset.goto); return; }

    var chipStep = ev.target.closest('.step-chip[data-step]');
    if (chipStep && !chipStep.disabled) { ui.index = parseInt(chipStep.dataset.step, 10); ui.error = ''; render(); scrollToPanel(); return; }

    if (ev.target.closest('#btnNext')) { goNext(); return; }
    if (ev.target.closest('#btnBack')) { goBack(); return; }
    if (ev.target.closest('#btnSubmit')) { submit(); return; }
    if (ev.target.closest('#loadMore')) { ui.visible += MODELS_PAGE; render(); return; }
    if (ev.target.closest('#restart')) { restart(); return; }
    if (ev.target.closest('#draftReset')) { restart(); return; }
  });

  var searchTimer = null;
  document.addEventListener('input', function (ev) {
    var el = ev.target;
    if (el.id === 'modelSearch') {
      clearTimeout(searchTimer);
      var v = el.value;
      searchTimer = setTimeout(function () {
        ui.search = v; ui.visible = MODELS_PAGE;
        render();
        var again = document.getElementById('modelSearch');
        if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
      }, 260);
      return;
    }
    if (el.name && Object.prototype.hasOwnProperty.call(state, el.name)) {
      state[el.name] = el.value;
      if (ui.fieldErrors[el.name]) { delete ui.fieldErrors[el.name]; el.closest('.field').classList.remove('has-error'); }
      var pruef = FELD_PRUEFUNG[el.name];
      if (pruef && pruef(el.value)) trackFeld(el.name);
    }
  });

  document.addEventListener('change', function (ev) {
    if (ev.target.id === 'f_privacy') {
      state.privacyAccepted = ev.target.checked;
      if (state.privacyAccepted) { delete ui.fieldErrors.privacyAccepted; trackFeld('privacyAccepted'); }
    }
  });

  window.addEventListener('beforeunload', function () {
    if (!ui.done && ui.started) {
      track('step_view', { stepId: currentStep().id, stepIndex: ui.index, stepsTotal: steps().length });
    }
  });

  track('pageview', {});
  draftWiederhergestellt = draftLaden();
  render();
  if (draftWiederhergestellt) {
    setTimeout(function () {
      var y = document.getElementById('konfigurator').getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 350);
  }
})();
