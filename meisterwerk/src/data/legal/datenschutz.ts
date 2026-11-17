/**
 * Datenschutzerklärung (Haupt- und Teil-Website Exklusive). Neu geschrieben am 16.11.2026 für die Astro-Seite auf
 * Cloudflare Pages: beschreibt nur, was die Seite tatsächlich tut (keine Cookies, keine Analyse, Schriften lokal,
 * Formulare über Cloudflare Functions, D1, R2, Turnstile und Resend, keine Bestätigungsmail an Kunden).
 * Kommt ein neuer Dienst hinzu (z. B. Google Ads Conversion Tracking), muss hier ein Abschnitt ergänzt und in
 * `data/consent.ts` die Kategorie aktiviert werden.
 * Darstellung: `components/legal/LegalPage.astro` (Inhaltsverzeichnis aus `title`, Anker aus `id`).
 */
import { site } from '../site';

export interface LegalSection {
  id: string;
  title: string;
  /** HTML des Abschnitts (p, ul, li, a, strong, h3) */
  html: string;
}

export const privacyUpdated = 'November 2026';

const adresse = `${site.name}<br>Inhaber: ${site.owner}<br>${site.street}<br>${site.postalCode} ${site.city}<br>Deutschland`;
const mail = `<a href="mailto:${site.email}">${site.email}</a>`;
const tel = `<a href="tel:${site.phoneHref}">${site.phone}</a>`;

export const privacySections: LegalSection[] = [
  {
    id: 'kurz',
    title: 'Das Wichtigste in Kürze',
    html: `
      <ul>
        <li>Wir setzen <strong>keine Cookies</strong> für Statistik, Werbung oder Profilbildung und nutzen keine Analyse-Werkzeuge.</li>
        <li>Die Schriften liegen auf unserem eigenen Server. Beim Aufruf der Seite wird keine Verbindung zu Google aufgebaut.</li>
        <li>Daten aus unseren Formularen verwenden wir nur, um Ihre Anfrage zu bearbeiten. Wir geben sie nicht für Werbung weiter.</li>
        <li>Links zu WhatsApp, Google Maps, Facebook, Instagram oder unserem Terminkalender übertragen erst dann Daten, wenn Sie sie anklicken.</li>
      </ul>`,
  },
  {
    id: 'verantwortlicher',
    title: 'Verantwortlicher',
    html: `
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
      <p>${adresse}</p>
      <p>Telefon: ${tel}<br>E-Mail: ${mail}</p>
      <p>Einen Datenschutzbeauftragten haben wir nicht bestellt, da wir dazu gesetzlich nicht verpflichtet sind. Bei Fragen zum Datenschutz wenden Sie sich bitte direkt an die oben genannte Adresse.</p>`,
  },
  {
    id: 'hosting',
    title: 'Hosting und Auslieferung der Website',
    html: `
      <p>Diese Website wird über <strong>Cloudflare Pages</strong> bereitgestellt. Anbieter ist die Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. Cloudflare betreibt ein weltweites Netz von Rechenzentren und liefert die Seite über einen Standort in Ihrer Nähe aus.</p>
      <p>Bei jedem Aufruf verarbeitet Cloudflare technisch notwendige Daten, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Referrer, Browser und Betriebssystem. Diese Daten werden benötigt, um die Seite auszuliefern, die Stabilität zu sichern und Angriffe abzuwehren. Wir selbst werten sie nicht aus und führen sie nicht mit anderen Daten zusammen.</p>
      <p>Rechtsgrundlage ist unser berechtigtes Interesse an einer sicheren und zuverlässigen Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO). Mit Cloudflare besteht ein Vertrag zur Auftragsverarbeitung. Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert. Ergänzend gelten die Standardvertragsklauseln der EU-Kommission.</p>
      <p>Weitere Informationen: <a href="https://www.cloudflare.com/de-de/privacypolicy/" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Cloudflare</a>.</p>`,
  },
  {
    id: 'verschluesselung',
    title: 'Verschlüsselung',
    html: `
      <p>Die Website ist ausschließlich über eine verschlüsselte Verbindung (TLS) erreichbar. Sie erkennen das am Schloss-Symbol und an „https://“ in der Adresszeile. Daten, die Sie an uns senden, können dadurch nicht von Dritten mitgelesen werden.</p>`,
  },
  {
    id: 'cookies',
    title: 'Cookies und Speicher im Browser',
    html: `
      <p>Wir verwenden keine Cookies, die Ihr Verhalten auswerten oder Sie für Werbung wiedererkennen.</p>
      <p>Damit der Hinweis zum Datenschutz nicht bei jedem Seitenaufruf erneut erscheint, speichern wir Ihre Auswahl im lokalen Speicher Ihres Browsers (Eintrag <code>mw-consent</code>). Der Eintrag enthält nur Ihre Auswahl und das Datum, er wird nicht an uns übertragen. Diese Speicherung ist technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können sie jederzeit über die Einstellungen Ihres Browsers löschen oder Ihre Auswahl über den Link „Cookie-Einstellungen“ im Fußbereich ändern.</p>`,
  },
  {
    id: 'formulare',
    title: 'Kontaktformular, Kurznachricht und Projektanfrage',
    html: `
      <p>Wenn Sie uns über eines der Formulare schreiben, verarbeiten wir die Angaben, die Sie eintragen: Name, E-Mail-Adresse und Telefonnummer, Ihre Nachricht, die Angaben zu Ihrem Vorhaben und gegebenenfalls Fotos, die Sie hochladen. Pflichtfelder sind gekennzeichnet. Zusätzlich speichern wir, auf welcher Seite Sie das Formular abgeschickt haben, und den Zeitpunkt.</p>
      <h3>So läuft die Übertragung</h3>
      <ul>
        <li>Ihre Angaben gehen verschlüsselt an eine Funktion auf den Servern von Cloudflare (siehe „Hosting“).</li>
        <li>Die Anfrage wird in einer Datenbank bei Cloudflare (Cloudflare D1, Speicherort Westeuropa) abgelegt, Fotos in einem nicht öffentlichen Speicher bei Cloudflare (Cloudflare R2). So geht keine Anfrage verloren, auch wenn der E-Mail-Versand einmal ausfällt.</li>
        <li>Anschließend erhalten wir Ihre Anfrage als E-Mail an unser Postfach. Für den Versand nutzen wir Resend (siehe unten).</li>
        <li>Fotos werden bereits in Ihrem Browser auf höchstens 2000 Pixel verkleinert, bevor sie übertragen werden.</li>
      </ul>
      <p>Haben Sie eine E-Mail-Adresse angegeben, erhalten Sie eine automatische Eingangsbestätigung mit Ihren Angaben und einem Link zu unserem Terminkalender. Weitere Werbung senden wir Ihnen nicht.</p>
      <h3>Rechtsgrundlage und Speicherdauer</h3>
      <p>Geht es um ein Angebot oder einen Auftrag, ist Rechtsgrundlage die Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Bei allgemeinen Anfragen ist es unser berechtigtes Interesse, Anfragen zu beantworten (Art. 6 Abs. 1 lit. f DSGVO).</p>
      <p>Wir löschen die Daten, sobald Ihre Anfrage abschließend bearbeitet ist und kein Auftrag zustande kommt. Kommt ein Auftrag zustande, bewahren wir die Unterlagen so lange auf, wie es handels- und steuerrechtliche Vorschriften verlangen (in der Regel sechs bis zehn Jahre).</p>`,
  },
  {
    id: 'turnstile',
    title: 'Spam-Schutz mit Cloudflare Turnstile',
    html: `
      <p>Um unsere Formulare vor automatisierten Spam-Anfragen zu schützen, nutzen wir Cloudflare Turnstile. Anbieter ist die Cloudflare, Inc. (Adresse siehe „Hosting“). Turnstile wird <strong>erst geladen, wenn Sie ein Formular anklicken</strong> oder mit der Maus darüberfahren, nicht schon beim Aufruf der Seite.</p>
      <p>Turnstile prüft im Hintergrund, ob ein Mensch oder ein Programm das Formular ausfüllt. Dafür werden insbesondere Ihre IP-Adresse, Angaben zu Browser und Gerät sowie Merkmale der Interaktion an Cloudflare übermittelt. In aller Regel bemerken Sie davon nichts, nur bei Verdacht wird eine kurze Prüfung eingeblendet. Turnstile kann dafür technisch notwendige Informationen in Ihrem Browser ablegen.</p>
      <p>Rechtsgrundlage ist unser berechtigtes Interesse, unsere Website und unser Postfach vor Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Zur Datenübermittlung in die USA siehe „Hosting“.</p>
      <p>Weitere Informationen: <a href="https://www.cloudflare.com/de-de/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">Datenschutzhinweise zu Turnstile</a>.</p>`,
  },
  {
    id: 'resend',
    title: 'E-Mail-Versand der Formulare über Resend',
    html: `
      <p>Die E-Mail mit Ihrer Anfrage an unser Postfach und die Eingangsbestätigung an Sie verschicken wir über den Dienst Resend. Anbieter ist die Plus Five Five, Inc., USA. Der Versand läuft über Server in der EU (Irland). Resend verarbeitet den Inhalt der E-Mails, also Ihre Angaben aus dem Formular, Ihre E-Mail-Adresse und gegebenenfalls Fotos als Anhang, ausschließlich für die Zustellung.</p>
      <p>Rechtsgrundlage ist dieselbe wie beim Formular selbst (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Mit Resend besteht ein Vertrag zur Auftragsverarbeitung. Für eine mögliche Übermittlung in die USA gelten die Standardvertragsklauseln der EU-Kommission.</p>
      <p>Weitere Informationen: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Resend</a>.</p>`,
  },
  {
    id: 'email-telefon',
    title: 'Kontakt per E-Mail, Telefon und WhatsApp',
    html: `
      <p>Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben, um Ihr Anliegen zu bearbeiten (Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO). Unser E-Mail-Postfach wird von Microsoft betrieben (Microsoft Ireland Operations Limited, One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland). Für die Speicherdauer gilt dasselbe wie bei den Formularen.</p>
      <p>Über den WhatsApp-Button können Sie uns eine Nachricht schreiben. WhatsApp wird von der WhatsApp Ireland Limited, Merrion Road, Dublin 4, Irland, betrieben. Erst mit dem Klick öffnet sich WhatsApp, und es gelten die Datenschutzbestimmungen von WhatsApp. Bitte nutzen Sie diesen Weg nur, wenn Sie damit einverstanden sind. Alternativ erreichen Sie uns jederzeit per Telefon oder E-Mail.</p>`,
  },
  {
    id: 'links',
    title: 'Links zu anderen Anbietern',
    html: `
      <p>Auf unserer Website verlinken wir auf Angebote anderer Anbieter, unter anderem:</p>
      <ul>
        <li>Google Maps (Wegbeschreibung und Bewertungen), Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland</li>
        <li>Facebook und Instagram, Meta Platforms Ireland Limited, Merrion Road, Dublin 4, Irland</li>
        <li>unseren Online-Terminkalender bei Cal.com, Cal.com, Inc., USA</li>
      </ul>
      <p>Es handelt sich um einfache Links. Beim Besuch unserer Website werden keine Daten an diese Anbieter übertragen. Erst wenn Sie einen Link anklicken, verlassen Sie unsere Seite, und es gilt die Datenschutzerklärung des jeweiligen Anbieters.</p>`,
  },
  {
    id: 'social-media',
    title: 'Unsere Seiten in sozialen Netzwerken',
    html: `
      <p>Wir betreiben eigene Seiten bei <a href="${site.social.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a> und <a href="${site.social.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>. Wenn Sie diese Seiten besuchen, verarbeitet Meta Platforms Ireland Limited Ihre Daten nach den eigenen Bestimmungen. Für die Statistiken, die Meta uns zu unseren Seiten bereitstellt („Insights“), sind wir gemeinsam mit Meta verantwortlich (Art. 26 DSGVO). Meta hat dafür die Hauptverantwortung übernommen und ist Ihr erster Ansprechpartner für Auskunft und andere Rechte.</p>
      <p>Rechtsgrundlage ist unser berechtigtes Interesse, unseren Betrieb und unsere Arbeiten dort zu zeigen (Art. 6 Abs. 1 lit. f DSGVO). Informationen von Meta: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Datenschutzrichtlinie</a> und <a href="https://www.facebook.com/legal/terms/page_controller_addendum" target="_blank" rel="noopener noreferrer">Vereinbarung zur gemeinsamen Verantwortung</a>.</p>`,
  },
  {
    id: 'schriften',
    title: 'Schriftarten',
    html: `
      <p>Die Schriftarten dieser Website (Urbanist und DM Sans) sind auf unserem eigenen Server gespeichert und werden von dort geladen. Es wird dabei keine Verbindung zu Servern von Google oder anderen Anbietern hergestellt.</p>`,
  },
  {
    id: 'rechte',
    title: 'Ihre Rechte',
    html: `
      <p>Sie haben jederzeit das Recht auf</p>
      <ul>
        <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
      </ul>
      <p><strong>Widerspruchsrecht:</strong> Verarbeiten wir Daten auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO), können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO). Wir verarbeiten die Daten dann nicht mehr, es sei denn, es liegen zwingende schutzwürdige Gründe vor.</p>
      <p>Für alle Anliegen genügt eine formlose Nachricht an ${mail}.</p>`,
  },
  {
    id: 'beschwerde',
    title: 'Beschwerde bei der Aufsichtsbehörde',
    html: `
      <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist:</p>
      <p>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br>Lautenschlagerstraße 20<br>70173 Stuttgart<br><a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer">www.baden-wuerttemberg.datenschutz.de</a></p>`,
  },
  {
    id: 'aenderungen',
    title: 'Änderungen dieser Erklärung',
    html: `
      <p>Wir passen diese Datenschutzerklärung an, sobald sich unsere Website oder die eingesetzten Dienste ändern. Es gilt die jeweils hier veröffentlichte Fassung. Stand: ${privacyUpdated}.</p>`,
  },
];
