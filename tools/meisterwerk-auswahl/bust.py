#!/usr/bin/env python3
"""Cache-Busting für die eigenen CSS/JS-Dateien der Vorschau Meisterwerk (Auswahl).

GitHub Pages liefert mit max-age=600, Browser behalten alte Fassungen. Darum hängt dieses Skript an jede
Referenz ?v=<sha1[:8]> des Dateiinhalts. NACH JEDER ÄNDERUNG an einer der Dateien unten ausführen,
bevor committet wird:  python3 tools/meisterwerk-auswahl/bust.py
"""
import hashlib, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "website/public/meisterwerk-preview-auswahl"
FILES = [
    "LeistungenStack.css", "LeistungenStack.js",
    "TabsFade.css", "TabsFade.js",
    "HeaderLock.css", "HeaderLock.js",
    "CtaReveal.css", "CtaReveal.js",
    "ContactVariants.css", "ContactVariants.js",
    "FaqCover.js",
    "WelcomeChain.css", "WelcomeChain.js",
    "WelcomeZoom.css", "WelcomeZoom.js",
    "WelcomeScroll.astro_astro_type_script_index_0_lang.n8bjhO38.js",  # Original-Skript, von uns verändert
]

html = (ROOT / "index.html").read_text(encoding="utf-8")
for name in FILES:
    v = hashlib.sha1((ROOT / "_astro" / name).read_bytes()).hexdigest()[:8]
    html, n = re.subn(r"(_astro/" + re.escape(name) + r")(\?v=[0-9a-f]+)?\"", r"\1?v=" + v + '"', html)
    print(f"{name:70s} {v}  Verweise: {n}")
(ROOT / "index.html").write_text(html, encoding="utf-8")
