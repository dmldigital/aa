// Kontaktbox ("Jede Oberfläche ist einzigartig"), nur der Inhalt der weißen Box: drei Varianten zum Vergleichen
// (A: Schwebende Beschriftungen, B: Kontaktspalte plus Formular, C: Formular als Satz), jeweils mit neuem Auswahlfeld
// (eigene Liste statt Browser-Auswahl). Umschalter unten rechts, solange die Sektion im Bild ist (nur Vorschau).
// Aufruf mit ?kontakt=a, ?kontakt=b oder ?kontakt=c. Das Formular bleibt das Element mit data-menu-form,
// dessen Absenden-Meldung das Menü-Skript steuert.
const wrap = document.querySelector("[data-mz]");
const box = document.querySelector("[data-mz-contact]");
const form = box && box.querySelector("form[data-menu-form]");

const SERVICES = [
  "Malerarbeiten",
  "Tapezierarbeiten",
  "Lackierarbeiten",
  "Verputzarbeiten",
  "Glatte Oberflächen",
  "Fugenlose Bäder",
  "Fugenlose Böden",
  "Spachteltechniken",
  "Stuckleisten",
  "Etwas anderes",
];
const CHEVRON = '<svg class="cv-chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>';
const MESSAGE =
  "Das Formular wird in Kürze freigeschaltet. Bis dahin erreichen Sie uns gern telefonisch oder per E-Mail.";
const DIRECT =
  'Direkt erreichen Sie uns unter <a href="tel:+4971412398290">07141 / 23982 90</a> oder <a href="mailto:info@meisterwerk-lb.de">info@meisterwerk-lb.de</a>';

let uid = 0;

// ---------- Bausteine ----------
const dropdown = (labelId, placeholder = "") => {
  const id = "cv-sel-" + ++uid;
  const options = SERVICES.map(
    (s, i) => `<li role="option" id="${id}-o${i}" data-value="${s}" aria-selected="false">${s}</li>`
  ).join("");
  return `<div class="cv-sel" data-cv-sel>
    <button type="button" class="cv-sel-btn" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-labelledby="${labelId}">
      <span class="cv-sel-val" data-ph="${placeholder}">${placeholder}</span>${CHEVRON}
    </button>
    <ul class="cv-sel-list" id="${id}-list" role="listbox" aria-labelledby="${labelId}" tabindex="-1" data-lenis-prevent>${options}</ul>
    <input type="hidden" name="leistung" value="">
  </div>`;
};

const actions = (direct = true) => `<div class="cv-actions">
    <button type="submit" class="cv-btn"><span>Nachricht senden</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 10L10 2M4 2h6v6"/></svg></button>
    <p class="cv-msg" role="status" aria-live="polite" data-form-message hidden>${MESSAGE}</p>
  </div>${direct ? `<p class="cv-direct">${DIRECT}</p>` : ""}`;

// Schwebendes Feld (Beschriftung steht im Feld und rückt beim Ausfüllen nach oben)
const floating = (type, name, label, extra = "") => {
  const id = "cv-" + name + "-" + ++uid;
  const tag =
    type === "textarea"
      ? `<textarea id="${id}" name="${name}" rows="2" placeholder=" " ${extra}></textarea>`
      : `<input id="${id}" type="text" name="${name}" placeholder=" " ${extra}>`;
  return `<div class="cv-f">${tag}<label class="cv-lab" for="${id}">${label}</label></div>`;
};

// Feld mit Beschriftung darüber
const labelled = (type, name, label, extra = "") => {
  const id = "cv-" + name + "-" + ++uid;
  const tag =
    type === "textarea"
      ? `<textarea id="${id}" name="${name}" rows="3" ${extra}></textarea>`
      : `<input id="${id}" type="text" name="${name}" ${extra}>`;
  return `<div class="cv-f"><label class="cv-lab" for="${id}">${label}</label>${tag}</div>`;
};

// ---------- Varianten ----------
const templates = {
  // A: Überschrift, Felder mit schwebender Beschriftung, Linie läuft beim Fokus gold durch
  a: () => {
    const lab = "cv-lab-" + ++uid;
    return `<header class="cv-head">
        <span class="cv-eyebrow">Kontakt</span>
        <h3 class="cv-title">Wie können wir Ihnen helfen?</h3>
        <p class="cv-lead">Beschreiben Sie kurz Ihr Vorhaben, wir melden uns persönlich bei Ihnen.</p>
      </header>
      <div class="cv-grid">
        ${floating("text", "name", "Name", 'autocomplete="name" required')}
        ${floating("text", "kontakt", "Telefon oder E-Mail", 'autocomplete="email" required')}
        ${floating("text", "ort", "Ort", 'autocomplete="address-level2"')}
        <div class="cv-f cv-f--sel" data-cv-field>${dropdown(lab)}<span class="cv-lab" id="${lab}">Leistung</span></div>
        <div class="cv-wide">${floating("textarea", "nachricht", "Ihre Nachricht", "required")}</div>
      </div>
      ${actions()}`;
  },

  // B: Links Kontaktspalte auf hellem Grund, rechts das Formular mit umrandeten Feldern
  b: () => {
    const lab = "cv-lab-" + ++uid;
    return `<aside class="cv-aside">
        <div>
          <span class="cv-eyebrow">Kontakt</span>
          <h3 class="cv-title">Wie können wir Ihnen helfen?</h3>
          <p class="cv-lead">Beschreiben Sie kurz Ihr Vorhaben, wir melden uns persönlich bei Ihnen.</p>
        </div>
        <ul class="cv-facts">
          <li><span>Telefon</span><a href="tel:+4971412398290">07141 / 23982 90</a></li>
          <li><span>E-Mail</span><a href="mailto:info@meisterwerk-lb.de">info@meisterwerk-lb.de</a></li>
          <li><span>Showroom</span><em>Einsteinstr. 10, 71691 Freiberg</em></li>
        </ul>
      </aside>
      <div class="cv-main">
        <h3 class="cv-title cv-title--mobile">Wie können wir Ihnen helfen?</h3>
        <div class="cv-grid">
          ${labelled("text", "name", "Name", 'autocomplete="name" required')}
          ${labelled("text", "kontakt", "Telefon oder E-Mail", 'autocomplete="email" required')}
          ${labelled("text", "ort", "Ort", 'autocomplete="address-level2"')}
          <div class="cv-f cv-f--sel"><span class="cv-lab" id="${lab}">Leistung</span>${dropdown(lab, "Bitte wählen")}</div>
          <div class="cv-wide">${labelled("textarea", "nachricht", "Ihre Nachricht", "required")}</div>
        </div>
        ${actions(false)}
        <p class="cv-direct cv-direct--mobile">${DIRECT}</p>
      </div>`;
  },

  // C: Das Formular liest sich als Satz, die Lücken werden ausgefüllt
  c: () => {
    const lab = "cv-lab-" + ++uid;
    return `<span class="cv-eyebrow">Kontakt</span>
      <div class="cv-sentence">
        <span class="cv-hi">Wie können wir Ihnen helfen?</span>
        Ich interessiere mich für <span class="cv-blank cv-blank--sel"><span class="cv-sr" id="${lab}">Leistung</span>${dropdown(lab, "Leistung wählen")}</span>
        in <span class="cv-nb"><span class="cv-blank cv-grow" data-v="Ort" data-p="Ort"><input type="text" size="1" name="ort" placeholder="Ort" autocomplete="address-level2" aria-label="Ort"></span>.</span>
        Mein Name ist <span class="cv-blank cv-grow" data-v="Vor- und Nachname" data-p="Vor- und Nachname"><input type="text" size="1" name="name" placeholder="Vor- und Nachname" autocomplete="name" aria-label="Name" required></span>
        und Sie erreichen mich unter <span class="cv-nb"><span class="cv-blank cv-grow" data-v="Telefon oder E-Mail" data-p="Telefon oder E-Mail"><input type="text" size="1" name="kontakt" placeholder="Telefon oder E-Mail" autocomplete="email" aria-label="Telefon oder E-Mail" required></span>.</span>
      </div>
      ${floating("textarea", "nachricht", "Das möchte ich noch mitteilen")}
      ${actions()}`;
  },
};

// ---------- Auswahlfeld ----------
const wireDropdown = (root) => {
  const btn = root.querySelector(".cv-sel-btn");
  const val = root.querySelector(".cv-sel-val");
  const list = root.querySelector(".cv-sel-list");
  const hidden = root.querySelector('input[type="hidden"]');
  const opts = [...list.querySelectorAll("[role=option]")];
  const field = root.closest("[data-cv-field]");
  let active = -1;
  let typed = "";
  let typedTimer = null;

  const isOpen = () => root.classList.contains("is-open");
  const float = () => field && field.classList.toggle("is-float", isOpen() || !!hidden.value);

  const setActive = (i) => {
    active = Math.max(0, Math.min(opts.length - 1, i));
    opts.forEach((o, k) => o.classList.toggle("is-active", k === active));
    btn.setAttribute("aria-activedescendant", opts[active].id);
    opts[active].scrollIntoView({ block: "nearest" });
  };

  const place = () => {
    // Liste öffnet nach unten, bei zu wenig Platz in der Box nach oben und passt ihre Höhe an
    const area = box.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const below = area.bottom - b.bottom - 14;
    const above = b.top - area.top - 14;
    const need = Math.min(list.scrollHeight + 2, 264);
    const up = below < need && above > below;
    root.classList.toggle("is-up", up);
    list.style.setProperty("--cv-mh", Math.max(120, Math.min(264, up ? above : below)) + "px");
  };

  const close = (focus = false) => {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    btn.removeAttribute("aria-activedescendant");
    document.removeEventListener("pointerdown", outside, true);
    float();
    if (focus) btn.focus();
  };

  const open = () => {
    if (isOpen()) return;
    place();
    root.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    const sel = opts.findIndex((o) => o.getAttribute("aria-selected") === "true");
    setActive(sel < 0 ? 0 : sel);
    document.addEventListener("pointerdown", outside, true);
    float();
  };

  const choose = (i) => {
    opts.forEach((o, k) => o.setAttribute("aria-selected", String(k === i)));
    hidden.value = opts[i].dataset.value;
    val.textContent = hidden.value;
    root.classList.add("has-value");
    close(true);
  };

  function outside(e) {
    if (!root.contains(e.target)) close();
  }

  btn.addEventListener("click", () => (isOpen() ? close() : open()));
  opts.forEach((o, i) => {
    o.addEventListener("pointerdown", (e) => e.preventDefault()); // Fokus bleibt am Knopf
    o.addEventListener("click", () => choose(i));
    o.addEventListener("pointermove", () => active !== i && setActive(i));
  });
  btn.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault();
      if (!isOpen()) open();
      else setActive(active + (k === "ArrowDown" ? 1 : -1));
    } else if (k === "Home" || k === "End") {
      if (isOpen()) {
        e.preventDefault();
        setActive(k === "Home" ? 0 : opts.length - 1);
      }
    } else if (k === "Enter" || k === " ") {
      e.preventDefault();
      if (isOpen()) choose(active);
      else open();
    } else if (k === "Escape") {
      if (isOpen()) {
        e.preventDefault();
        close(true);
      }
    } else if (k === "Tab") {
      close();
    } else if (k.length === 1 && !e.ctrlKey && !e.metaKey) {
      // Tippen springt zum passenden Eintrag
      typed += k.toLowerCase();
      clearTimeout(typedTimer);
      typedTimer = setTimeout(() => (typed = ""), 600);
      const hit = opts.findIndex((o) => o.textContent.toLowerCase().startsWith(typed));
      if (hit >= 0) {
        if (!isOpen()) open();
        setActive(hit);
      }
    }
  });

  return {
    set(value) {
      const i = opts.findIndex((o) => o.dataset.value === value);
      if (i < 0) return;
      opts.forEach((o, k) => o.setAttribute("aria-selected", String(k === i)));
      hidden.value = value;
      val.textContent = value;
      root.classList.add("has-value");
      float();
    },
  };
};

// Felder im Satz wachsen mit dem Text
const wireGrow = (root) => {
  root.querySelectorAll(".cv-grow").forEach((g) => {
    const input = g.querySelector("input");
    const sync = () => (g.dataset.v = input.value || g.dataset.p);
    input.addEventListener("input", sync);
    sync();
  });
};

// ---------- Darstellung und Umschalter ----------
let current = "";
let dropdowns = [];

const render = (variant) => {
  const saved = new FormData(form);
  current = variant;
  uid = 0;
  form.className = "mz-form cv-form cv-" + variant;
  box.dataset.cv = variant;
  wrap.dataset.cv = variant;
  form.innerHTML = templates[variant]();
  dropdowns = [...form.querySelectorAll("[data-cv-sel]")].map(wireDropdown);
  wireGrow(form);
  // bereits Eingetipptes in die neue Variante übernehmen
  for (const [name, value] of saved.entries()) {
    if (!value) continue;
    if (name === "leistung") dropdowns[0]?.set(value);
    else {
      const el = form.elements[name];
      if (el && "value" in el) el.value = value;
    }
  }
  wireGrow(form);
  switcher.querySelectorAll("button").forEach((b) => {
    const on = b.dataset.v === variant;
    b.classList.toggle("is-on", on);
    b.setAttribute("aria-pressed", String(on));
  });
  try {
    const url = new URL(location.href);
    url.searchParams.set("kontakt", variant);
    history.replaceState(null, "", url);
  } catch (e) {}
};

const switcher = document.createElement("div");
if (form && wrap) {
  switcher.className = "cv-switch";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Variante der Kontaktbox");
  switcher.innerHTML =
    '<span>Kontaktbox</span>' + ["a", "b", "c"].map((v) => `<button type="button" data-v="${v}">${v.toUpperCase()}</button>`).join("");
  switcher.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-v]");
    if (b && b.dataset.v !== current) render(b.dataset.v);
  });
  document.body.appendChild(switcher);
  new IntersectionObserver(([entry]) => switcher.classList.toggle("is-shown", entry.isIntersecting), {
    threshold: 0,
  }).observe(wrap);

  const wanted = new URLSearchParams(location.search).get("kontakt");
  render(templates[wanted] ? wanted : "a");
}
