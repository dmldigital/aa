# DNS-Einträge von IONOS für meisterwerk-lb.de

Stand 16.11.2026. Quelle: Screenshot der IONOS-DNS-Verwaltung (16 Einträge, sortiert nach „Service“, die Liste endet unten mit dem Tabellenrand).
Aus dieser Liste legt die lokale Sitzung die Zone in Cloudflare an. **Alle Mail-Einträge in Cloudflare auf „Nur DNS“ (graue Wolke).**

## Noch offen, bevor Cloudflare angelegt wird
1. **Vier Werte waren im Screenshot abgeschnitten** (in der Tabelle als ABGESCHNITTEN markiert). Sie dürfen nicht geraten werden. Vollständig ablesen:
   in IONOS auf das Stift-Symbol der Zeile klicken (zeigt den ganzen Wert), oder die lokale Sitzung fragt sie ab:
   ```bash
   dig +short MX meisterwerk-lb.de
   dig +short TXT meisterwerk-lb.de
   dig +short TXT _dep_ws_mutex.meisterwerk-lb.de
   dig +short SRV _sip._tls.meisterwerk-lb.de
   dig +short SRV _sipfederationtls._tcp.meisterwerk-lb.de
   ```
2. **Spalten, die der Screenshot nicht zeigt:** Priorität des MX, Priorität der beiden SRV-Einträge, TTL. Ebenfalls aus dem Stift-Dialog oder aus `dig` übernehmen.
3. **Nameserver bei IONOS und DNSSEC-Status:** stehen nicht in dieser Liste (IONOS, Domains, Nameserver bzw. DNSSEC). Vor dem Wechsel prüfen,
   ist DNSSEC aktiv, muss es vorher bei IONOS aus (siehe Anleitung, Phase 0).

## Einträge
| # | Typ | Name (Host) | Wert | IONOS-Service | In Cloudflare |
|---|---|---|---|---|---|
| 1 | CNAME | `_domainconnect` | `_domainconnect.ionos.com` | Domain Connect | optional (IONOS-Einrichtungshilfe, ohne Funktion nach dem Wechsel), Nur DNS |
| 2 | MX | `@` | `meisterwerklb-de02i.mail.protection.outlook.` ABGESCHNITTEN (Ende vermutlich `com`), Priorität unbekannt (bei Microsoft meist 0) | Microsoft Office | **Pflicht**, Nur DNS |
| 3 | TXT | `@` | `"v=spf1 include:_spf-eu.ionos.com include:spf.protec` ABGESCHNITTEN (Rest und Schlussregel ablesen) | Microsoft Office | **Pflicht**, Nur DNS, 1:1 übernehmen, genau ein SPF-Eintrag |
| 4 | SRV | `_sipfederationtls._tcp` | Gewicht 1, Port 5061, Ziel `sipfed.online.lync.com` (Priorität nicht sichtbar, bei Microsoft üblich 100) | Microsoft Office | **Pflicht**, Nur DNS |
| 5 | SRV | `_sip._tls` | Gewicht 1, Port 443, Ziel `sipdir.online.lync.com` (Priorität nicht sichtbar, bei Microsoft üblich 100) | Microsoft Office | **Pflicht**, Nur DNS |
| 6 | CNAME | `autodiscover` | `autodiscover.outlook.com` | Microsoft Office | **Pflicht**, Nur DNS |
| 7 | CNAME | `enterpriseenrollment` | `enterpriseenrollment-s.manage.microsoft.com` | Microsoft Office | Pflicht, Nur DNS |
| 8 | CNAME | `enterpriseregistration` | `enterpriseregistration.windows.net` | Microsoft Office | Pflicht, Nur DNS |
| 9 | CNAME | `lyncdiscover` | `webdir.online.lync.com` | Microsoft Office | Pflicht, Nur DNS |
| 10 | CNAME | `sip` | `sipdir.online.lync.com` | Microsoft Office | Pflicht, Nur DNS |
| 11 | A | `@` | `217.160.0.71` | WordPress | vorerst Nur DNS, beim Livegang ersetzt Pages diesen Eintrag |
| 12 | AAAA | `@` | `2001:8d8:100f:f000:0:0:0:200` | WordPress | vorerst Nur DNS, beim Livegang ersetzt Pages diesen Eintrag |
| 13 | A | `www` | `217.160.0.71` | WordPress | vorerst Nur DNS, beim Livegang ersetzt Pages diesen Eintrag |
| 14 | AAAA | `www` | `2001:8d8:100f:f000:0:0:0:200` | WordPress | vorerst Nur DNS, beim Livegang ersetzt Pages diesen Eintrag |
| 15 | TXT | `_dep_ws_mutex` | `"e1324301cb21fc959e09362a6987a07bcc567` ABGESCHNITTEN | WordPress (IONOS Webspace) | übernehmen, solange WordPress bei IONOS läuft, Nur DNS |
| 16 | TXT | `@` | `"google-site-verification=hFYHuV7iX8jEllGMa` ABGESCHNITTEN | ohne Service | **übernehmen** (Nachweis für die Google Search Console, sonst geht der Zugang verloren), Nur DNS |

Zeilen 2 bis 10 sind Microsoft 365 (Exchange Online, Teams/Skype, Geräteverwaltung). Alles davon wird 1:1 übernommen, auch Teams und Geräteverwaltung.

## Was an dieser Liste auffällt
- **Es gibt keinen DKIM-Eintrag (`selector1._domainkey`, `selector2._domainkey`), keinen DMARC-Eintrag (`_dmarc`) und keinen `MS=`-Nachweis.**
  Die Mail läuft also ohne eigene DKIM-Signatur der Domain. Für den Umzug heißt das: Da ist nichts zu übernehmen und nichts zu verlieren.
  Später sinnvoll: DKIM für die Domain bei Microsoft aktivieren und einen DMARC-Eintrag anlegen (verbessert Zustellung und Schutz vor Fälschung).
  Das ist ein eigener Schritt nach dem Umzug, nicht jetzt.
- **Der SPF-Eintrag enthält IONOS und Microsoft.** Der alte WordPress-Versand lief über den IONOS-Webserver (`_spf-eu.ionos.com`). Bei der neuen
  Website verschickt Resend die Formular-Mails, dessen SPF liegt auf der Unterdomain `send`. Der SPF auf `@` bleibt unverändert.
- **Die Formular-Mails bekommen durch Resend erstmals eine DKIM-Signatur mit `d=meisterwerk-lb.de`.** Beim Test in Outlook steht dann `dkim=pass`.
  Ein `dmarc`-Ergebnis erscheint erst, wenn es einen `_dmarc`-Eintrag gibt.
- **Die Cloudflare-Standardregel ist hier wichtig:** Alle diese Einträge sind Nur DNS. Nur `@` und `www` werden beim Livegang durch Pages ersetzt.
