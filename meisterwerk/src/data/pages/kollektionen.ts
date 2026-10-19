/**
 * Kollektionsseiten der Teil-Website /meisterwerk-exklusive/ (live von meisterwerk-lb.de gelesen):
 * `fugenlos` und `spachteltechnik-oberflaechen`. Je Kollektion eine Titelzeile und Zeilen mit benannten Karten
 * (Name, Bild, aufklappbare Beschreibung). Bilder: Dateinamen in `src/assets/img`. Beschreibung und Details sind HTML.
 * `id` = Elementor-Kennung der Sektion im Original.
 */
export interface KollektionKarte {
  title: string;
  /** Beschreibung (HTML) */
  text: string;
  /** Eigenschaften, Einsatzbereich, Charakter (HTML: strong und ul) */
  details: string;
  image: string;
}
export interface KollektionZeile {
  id: string;
  cards: KollektionKarte[];
}
export interface Kollektion {
  id: string;
  title: string;
  rows: KollektionZeile[];
}
export interface KollektionenSeite {
  slug: string;
  /** Seitentitel (im Original ohne Meta-Beschreibung) */
  title: string;
  headline: string;
  headlineId: string;
  /** Spalten je Zeile ab Tablet (Karten stehen links, auch bei weniger Karten) */
  columns: 3 | 4;
  collections: Kollektion[];
}

export const kollektionenSeiten: KollektionenSeite[] = [
  {
    slug: 'fugenlos',
    title: 'Fugenlos - Meisterwerke Exklusive',
    headline: 'Fugenlose Oberflächen',
    headlineId: 'b2a8513',
    columns: 3,
    collections: [
      {
        id: 'f2b8b86',
        title: 'Colezione Monilito',
        rows: [
          {
            id: 'ce0397d',
            cards: [
              {
                title: 'Essenza 20',
                text: 'Die puristischste und feinste Ausführung des 3-komponentigen Polymer-Betons. In drei Lagen gespachtelt entsteht eine nahezu samtig-glatte, homogene Oberfläche mit minimaler Struktur. Essenza wirkt ruhig, klar und reduziert – modern in seiner reinsten Form.',
                details:
                  '<strong>Eigenschaften:</strong> <ul class="spachtel-list"> <li>3-komponentiges Polymer-Beton-System</li> <li>3-lagiger Spachtelaufbau</li> <li>Sehr feine, nahezu glatte Oberfläche</li> <li>Wasserdicht &amp; fleckenabweisend</li> <li>Hoch widerstandsfähig</li> <li>Für stark beanspruchte Bereiche geeignet</li> <li>Fugenlos &amp; pflegeleicht</li> <li>Auf bestehenden Untergründen realisierbar</li> </ul> <strong>Einsatzbereich:</strong> <ul class="spachtel-list"> <li>Bäder &amp; Duschen</li> <li>Wohn- &amp; Küchenbereiche</li> <li>Treppen &amp; Böden</li> <li>Minimalistische Architektur</li> <li>Gewerbe- &amp; Objektflächen</li> </ul> <strong>Charakter:</strong> <ul class="spachtel-list"> <li>Sehr fein &amp; reduziert</li> <li>Puristisch &amp; klar</li> <li>Ruhig &amp; elegant</li> <li>Zeitlos modern</li> <li>Sanft in der Haptik</li> </ul>',
                image: 'ESSENZA-20-1024x1024.jpg',
              },
              {
                title: 'Equilibrio 21',
                text: 'Fugenlose, fein strukturierte Oberfläche mit ruhigem, modernem Ausdruck. Equilibrio basiert auf einem hochwertigen 3-komponentigen Polymer-Beton-System und verbindet eine lebendige, leicht bewegte Optik mit einer angenehm glatten Haptik. Die Oberfläche wirkt strukturiert im Licht und dennoch harmonisch und ausgewogen im Gesamtbild.',
                details:
                  '<strong>Eigenschaften:</strong> <ul class="spachtel-list"> <li>3-komponentiges Hochleistungssystem</li> <li>Widerstandsfähig bei täglicher und intensiver Nutzung</li> <li>Wasserdicht &amp; fleckenabweisend</li> <li>Für Feuchtbereiche geeignet</li> <li>Für stark beanspruchte Flächen geeignet</li> <li>Auf bestehenden Untergründen applizierbar</li> <li>Farbtöne mischbar (Evidence-Effekt)</li> <li>Fugenlos &amp; pflegeleicht</li> </ul> <strong>Einsatzbereich:</strong> <ul class="spachtel-list"> <li>Bäder &amp; Duschen</li> <li>Wohn- &amp; Küchenbereiche</li> <li>Treppen &amp; Böden</li> <li>Gewerbe- &amp; Objektbereiche</li> <li>Stark frequentierte Zonen</li> </ul> <strong>Charakter:</strong> <ul class="spachtel-list"> <li>Ruhig &amp; ausgewogen</li> <li>Modern &amp; kraftvoll</li> <li>Dezent strukturiert</li> <li>Dynamisch im Licht</li> <li>Elegant in seiner Natürlichkeit</li> </ul>',
                image: 'EQUILIBRIO-21-1024x1024.jpg',
              },
              {
                title: 'Intenso 22',
                text: 'Die kraftvollste Ausführung des 3-komponentigen Polymer-Beton-Systems. Mehrlagig gespachtelt entsteht eine markante, lebendige Oberfläche mit spürbarer Struktur. Durch die gröbere Körnung bietet Intenso im Vergleich zu Essenza und Equilibrio eine höhere Rutschhemmung.',
                details:
                  '<strong>Eigenschaften:</strong> <ul class="spachtel-list"> <li>3-komponentiges Polymer-Beton-System</li> <li>Mehrlagiger Spachtelaufbau</li> <li>Deutlich strukturierte Oberfläche</li> <li>Höhere Rutschhemmung im Vergleich zu Essenza &amp; Equilibrio</li> <li>Wasserdicht &amp; fleckenabweisend</li> <li>Hoch widerstandsfähig</li> <li>Fugenlos &amp; pflegeleicht</li> <li>Für stark beanspruchte Bereiche geeignet</li> </ul> <strong>Einsatzbereich:</strong> <ul class="spachtel-list"> <li>Bäder &amp; Duschen</li> <li>Spa- &amp; Wellnessbereiche</li> <li>Treppen &amp; Böden</li> <li>Gewerbe- &amp; Objektflächen</li> <li>Innen- und geschützte Außenbereiche</li> </ul> <strong>Charakter:</strong> <ul class="spachtel-list"> <li>Kraftvoll</li> <li>Markant</li> <li>Urban</li> <li>Dynamisch</li> <li>Sicher &amp; funktional</li> </ul>',
                image: 'INTENSO-22-1024x1024.jpg',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'spachteltechnik-oberflaechen',
    title: 'Spachteltechnik Oberflächen - Meisterwerke Exklusive',
    headline: 'Spachteltechnik Oberflächen',
    headlineId: 'fe6446d',
    columns: 4,
    collections: [
      {
        id: '0889df6',
        title: 'Collezione Calce',
        rows: [
          {
            id: 'd2bfa27',
            cards: [
              {
                title: 'Puro 01',
                text: 'Fein mineralische Kalkspachteltechnik mit ruhiger, natürlicher Struktur. In mehreren dünnen Lagen von Hand aufgetragen und verdichtet. Die Oberfläche wirkt matt bis seidig, lebendig, jedoch harmonisch – mit typischer Tiefenwirkung von echtem Kalk.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Diffusionsoffen &amp; feuchtigkeitsregulierend</li> <li>Natürlich schimmelhemmend</li> <li>Angenehme, mineralische Haptik</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume und Außenfassaden.</span>',
                image: 'PURO-01-scaled-e1770978413477-1024x1024.jpg',
              },
              {
                title: 'Protetto 02',
                text: 'Technisch identisch mit Puro, jedoch mit zusätzlicher hydrophobierender Schutzbehandlung. Nach dem Verdichten wird eine transparente Schutzschicht eingearbeitet, die die Oberfläche widerstandsfähiger gegen Feuchtigkeit und Verschmutzung macht. Die Struktur bleibt mineralisch, erhält jedoch einen leicht erhöhten Glanzgrad.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Wasserabweisender &amp; pflegeleichter</li> <li>Diffusionsoffen bleibt erhalten</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume, stärker beanspruchte Bereiche sowie Außenflächen.</span>',
                image: 'PROTETTO-02-1024x1024.jpg',
              },
              {
                title: 'Seta 03',
                text: 'Besonders fein gespachtelte Kalktechnik mit intensiver Verdichtung. Durch das mehrfache Glätten entsteht eine sehr geschlossene, seidig wirkende Oberfläche. Die Struktur ist weich im Erscheinungsbild, mit subtiler Lichtreflexion.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Sehr feine, elegante Optik</li> <li>Glatte, fast samtige Haptik</li> <li>Natürlich mineralisch</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume, hochwertige Wohn- und Geschäftsräume sowie geschützte Außenbereiche.</span>',
                image: 'SETA-03-1024x1024.jpg',
              },
              {
                title: 'Imperium 04',
                text: 'Veredelte Kalktechnik mit mineralischem Schutz und feinem Metallic-Effekt. Nach dem Auftrag wird die Fläche verdichtet und mit einer dezenten, schimmernden Nuance versehen. Das Licht erzeugt eine elegante Tiefenwirkung.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Luxuriöse Ausstrahlung</li> <li>Mineralischer Charakter bleibt erhalten</li> <li>Individuelles Lichtspiel</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume, Akzentflächen, repräsentative Bereiche.</span>',
                image: 'IMPERIUM-04-1024x1024.jpg',
              },
            ],
          },
          {
            id: 'ff9a1ef',
            cards: [
              {
                title: 'Levigato 05',
                text: 'Mehrlagig gespachtelte Kalktechnik, anschließend fein geschliffen und intensiv verdichtet. Die Oberfläche erinnert optisch an geschliffenen Muschelkalk – ruhig, mineralisch und natürlich gewachsen. Feine Strukturen und dezente Nuancen erzeugen eine authentische Natursteinwirkung.',
                details:
                  '<strong>Material &amp; Eigenschaften</strong> <ul class="spachtel-list"> <li>Lang gelagerter Sumpfkalk mit Marmormehl</li> <li>Muschelkalk-Optik mit natürlicher Tiefenwirkung</li> <li>Diffusionsoffen &amp; natürlich schimmelhemmend</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume sowie geschützte Außenbereiche. Mit Schutzbehandlung auch in Bädern einsetzbar.</span>',
                image: 'LEVIGATO-05-1024x1024.jpg',
              },
              {
                title: 'Goccia 06',
                text: 'Mineralische Kalkspachteltechnik mit individuell einarbeitbaren Partikeln (Gold, Kupfer oder Silber), um den Charakter von Coccio Antico nachzuempfinden. Nach dem Schleifen und Polieren treten die Einschlüsse sichtbar hervor.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Individuell anpassbare Optik</li> <li>Lebendige Tiefenwirkung mit Lichtspiel</li> <li>Mineralisch und langlebig</li> </ul> <strong>Einsatzbereich</strong> <span>Innenräume sowie geschützte Außenbereiche; auch in stärker beanspruchten Bereichen.</span>',
                image: 'GOCCIA-06.jpg',
              },
              {
                title: 'Il Doge 07',
                text: 'Traditionelle venezianische Spachteltechnik auf Basis von mindestens 24 Monate gelagertem Sumpfkalk. Die Oberfläche ist hochglänzend, nahezu spiegelnd und zeigt eine außergewöhnliche Tiefenwirkung mit klassischem venezianischem Charakter.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Mindestens 24 Monate gereifter Sumpfkalk</li> <li>Hochglänzende, hochverdichtete Oberfläche</li> <li>Sehr edel und absolut hochwertig</li> </ul> <strong>Einsatzbereich</strong> <span>Hochwertige Innenräume – ideal für repräsentative Wohn- und Geschäftsräume.</span>',
                image: 'IL-DOGE-07-1024x1024.jpg',
              },
            ],
          },
        ],
      },
      {
        id: 'a50903a',
        title: 'Collezione Pietra',
        rows: [
          {
            id: '8e64eb4',
            cards: [
              {
                title: 'Roma 08',
                text: 'Mehrlagig gespachtelte Travertin-Oberfläche mit ruhigem, natürlichem Ausdruck. Leicht verdichtet entsteht eine matte, steinartige Fläche mit mineralischer Tiefenwirkung.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Ruhige, leicht verdichtete Oberfläche</li> <li>Natürlich matt mit dezenter Tiefe</li> <li>Diffusionsoffen &amp; schimmelhemmend</li> </ul> <strong>Einsatzbereich</strong> <span>Wohnbereiche, Fassaden, exklusive Objektbereiche.</span> <strong>Charakter</strong> <span>Leicht glatt, dezent strukturiert, steinartig, zeitlos, natürlich.</span>',
                image: 'ROMA-08-scaled-e1770979785283-1024x1024.jpg',
              },
              {
                title: 'Latium 09',
                text: 'Mehrlagig gespachtelte Travertin-Oberfläche mit feiner, ruhiger Struktur. Etwas glatter ausgeführt als Roma 01, wirkt die Fläche geschlossener und eleganter, bleibt jedoch klar mineralisch und steinartig.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Feiner gespachtelt &amp; stärker verdichtet</li> <li>Natürlich matt mit sanfter Tiefenwirkung</li> <li>Diffusionsoffen &amp; schimmelhemmend</li> </ul> <strong>Einsatzbereich</strong> <span>Wohnräume, Treppenhäuser &amp; Eingangsbereiche, Fassaden, hochwertige Objektflächen.</span> <strong>Charakter</strong> <span>Glatter als Roma 01, dezent strukturiert, ruhig &amp; harmonisch, elegant, natürlich mineralisch.</span>',
                image: 'LATIUM-09-1-1024x1024.jpg',
              },
              {
                title: 'Impero 10',
                text: 'Mehrlagig gespachtelte Travertin-Oberfläche mit zusätzlicher Veredelung. Durch Hydrophobierung und dezente metallische Akzentuierung entsteht eine kraftvolle, elegante Steinoptik mit leichter Tiefenreflexion.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Verdichtet &amp; zusätzlich geschützt</li> <li>Leicht metallische Nuancen möglich (Gold / Silber)</li> <li>Hydrophobiert &amp; schmutzabweisend</li> </ul> <strong>Einsatzbereich</strong> <span>Exklusive Wohnräume, Bäder &amp; Spa-Bereiche, Gastronomie &amp; Hotellerie, Fassaden.</span> <strong>Charakter</strong> <span>Kraftvoll, tief &amp; lebendig, elegant mit edlem Schimmer, römisch inspiriert, ausdrucksstark.</span>',
                image: 'IMPERO-10.jpg',
              },
              {
                title: 'Trionfo 11',
                text: 'Mehrlagig gespachtelte Travertin-Oberfläche mit eingearbeiteten mineralischen Partikeln. Goldene Akzente werden nach dem Glätten und Polieren sichtbar und verleihen der Fläche eine monumentale Ausstrahlung.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Metallische Partikel (Silber · Gold · Kupfer möglich)</li> <li>Nach dem Glätten &amp; Polieren sichtbar veredelt</li> <li>Hydrophobiert &amp; widerstandsfähig</li> </ul> <strong>Einsatzbereich</strong> <span>Exklusive Wohnbereiche, Empfangsbereiche, Wellnessbereiche &amp; Relaxzonen, Statementflächen.</span> <strong>Charakter</strong> <span>Monumental, ausdrucksstark, antik-römisch, kraftvoll &amp; edel, tief &amp; lebendig.</span>',
                image: 'TRIONFO-11-scaled-e1770980001460-1024x1024.jpg',
              },
            ],
          },
          {
            id: '1ca67ad',
            cards: [
              {
                title: 'Domus 12',
                text: 'Mehrlagig gespachtelte Travertin-Oberfläche mit fein eingearbeiteten mineralischen Partikeln. Die Fläche wird verdichtet, geschliffen und poliert für eine sehr glatte Steinoptik mit dezentem Schimmer.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Sehr glatt &amp; fein verdichtet</li> <li>Geschliffen &amp; poliert veredelt</li> <li>Hydrophobiert &amp; pflegeleicht</li> </ul> <strong>Einsatzbereich</strong> <span>Wohnräume &amp; Essbereiche, Hotel- &amp; Objektbereiche, Wellnessbereiche, Hochwertige Akzentflächen.</span> <strong>Charakter</strong> <span>Sehr glatt, elegant &amp; ruhig, fein mineralisch, warm &amp; harmonisch.</span>',
                image: 'DOMUS-12-1024x1024.jpg',
              },
              {
                title: 'Fractum 13',
                text: 'Mehrlagig aufgebaute Travertin-Oberfläche mit stark strukturierter Steinwirkung. Durch gezielte Bearbeitung entsteht der Eindruck eines gebrochenen, naturbelassenen Steins mit markanter Tiefe.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Echter Travertin im Material</li> <li>Stark strukturierte Steinoberfläche</li> <li>Eindruck eines gebrochenen Natursteins</li> <li>Mineralisch &amp; diffusionsoffen</li> </ul> <strong>Einsatzbereich</strong> <span>Für Innenräume sowie Außenbereiche geeignet.</span> <strong>Charakter</strong> <span>Kraftvoll, archaisch, markant, natursteinartig, ausdrucksstark.</span>',
                image: 'FRACTUM-13.jpg',
              },
            ],
          },
        ],
      },
      {
        id: 'a5b0240',
        title: 'Collezione Urban',
        rows: [
          {
            id: '2d19cf3',
            cards: [
              {
                title: 'Cemento Calmo 14',
                text: 'Ruhig gespachtelte Betonoptik mit homogener, weicher Oberfläche. Feine Schattierungen und dezente Bewegungen im Farbton verleihen der Fläche eine moderne, urbane Tiefe ohne aufdringliche Struktur.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Mineralisch inspirierte Betonoptik</li> <li>Fein gespachtelte, ruhige Oberfläche</li> <li>Dezente Farbverläufe</li> <li>Modern &amp; zeitlos</li> </ul> <strong>Einsatzbereich</strong> <span>Wohnräume, Büros, Showrooms, Empfangsbereiche, Moderne Architektur.</span> <strong>Charakter</strong> <span>Ruhig, reduziert, urban, minimalistisch, harmonisch.</span>',
                image: 'CEMENTO-CALMO-14-1-1024x1024.jpg',
              },
              {
                title: 'Cemento Mosso 15',
                text: 'Mehrlagig gespachtelte Oberfläche mit bewegtem, wolkigem Verlauf. Durch unterschiedliche Spachtelrichtungen und leichte Verdichtung entsteht eine lebendige Betonoptik mit sanften Schattierungen und natürlicher Tiefenwirkung.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Lebendige, wolkige Betonoptik</li> <li>Mineralisch matt mit feiner Bewegung</li> <li>Diffusionsoffen &amp; langlebig</li> <li>Für Innenbereiche geeignet</li> </ul> <strong>Einsatzbereich</strong> <span>Wohnräume, Loftbereiche, Treppenhäuser, Moderne Wohnkonzepte.</span> <strong>Charakter</strong> <span>Bewegt, urban, weich verlaufend, modern, authentisch.</span>',
                image: 'Cemento-MOSSO-15-1-1024x1024.jpg',
              },
              {
                title: 'Cemento Rilievo 16',
                text: 'Mehrlagig aufgebaute, mineralische Spachteltechnik mit bewusst herausgearbeiteten Strukturen. Durch partielles Abziehen und Modellieren entsteht eine reliefartige Betonoptik mit natürlicher Tiefe und markanter Oberfläche.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Strukturierte, reliefartige Oberfläche</li> <li>Mineralisch matt mit spürbarer Tiefe</li> <li>Ausdrucksstarke Betonoptik</li> </ul> <strong>Einsatzbereich</strong> <span>Akzentwände, Wohn- &amp; Essbereiche, Gewerbeflächen, Moderne Architekturkonzepte.</span> <strong>Charakter</strong> <span>Markant, ausdrucksstark, urban, roh &amp; authentisch, architektonisch.</span>',
                image: 'CEMENTO-RILIEVO-16-1-1024x1024.jpg',
              },
              {
                title: 'Seta 17',
                text: 'Dekorative Metallic-Oberfläche mit samtigem Velluto-Effekt. Inspiriert von klassischer Grandezza verbindet diese Technik zeitlose Eleganz mit modernem Interior-Design. Weiche metallische Schattierungen erzeugen ein lebendiges Lichtspiel.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Hochwertige Acryl-Decor-Spachtelmasse mit Samteffekt</li> <li>Auch in matter Variante (Opaco) erhältlich</li> <li>Umweltfreundlich &amp; emissionsarm (A+ zertifiziert)</li> <li>Seit 1998 bewährtes Original</li> </ul> <strong>Einsatzbereich</strong> <span>Innenbereiche, Wohnräume &amp; Schlafzimmer, Empfangs- &amp; Objektbereiche, Elegante Akzentwände.</span> <strong>Charakter</strong> <span>Warm, edel, weich schimmernd, zeitlos &amp; modern zugleich.</span>',
                image: 'SETA-17-1-1024x1024.jpg',
              },
            ],
          },
          {
            id: '5a3e71a',
            cards: [
              {
                title: 'Encanto 18',
                text: 'Metallisch changierende Effektfarbe mit feiner Struktur. Encanto erzeugt durch unterschiedliche Farbtonalitäten eine lebendige, schimmernde Oberfläche, die Räume in ein besonderes Licht taucht.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Metallisch changierende Effektfarbe</li> <li>Feinstrukturierte Oberfläche</li> <li>Mehrdimensionale Farbwirkung</li> <li>Umweltfreundlich &amp; emissionsarm</li> </ul> <strong>Einsatzbereich</strong> <span>Innenbereiche, Wohnräume &amp; Schlafzimmer, Akzent- und Designwände.</span> <strong>Charakter</strong> <span>Magisch, lebendig, elegant, ausdrucksstark, modern.</span>',
                image: 'Encanto-18-1024x1024.jpeg',
              },
              {
                title: 'Oro 19',
                text: 'Metall-Effekt-Oberfläche mit intensiver Goldwirkung. Basiert auf Imperium und ermöglicht die realistische Nachahmung edler Metallflächen. Durch spezielle Auftragsweisen entsteht eine lebendige, tief schimmernde Oberfläche.',
                details:
                  '<strong>Eigenschaften</strong> <ul class="spachtel-list"> <li>Nachahmung von Gold, Bronze, Kupfer oder Aluminium</li> <li>Glänzend oder matt erhältlich</li> <li>Scheuerbeständig &amp; strapazierfähig</li> <li>Schwer entflammbar &amp; umweltfreundlich</li> </ul> <strong>Einsatzbereich</strong> <span>Innen- und Außenbereiche, Akzentwände, Empfangsbereiche &amp; Gastronomie, Möbel- und Designflächen.</span> <strong>Charakter</strong> <span>Luxuriös, ausdrucksstark, edelmetall-optik, energiegeladen, extravagant.</span>',
                image: 'ORO-19-1024x1024.jpeg',
              },
            ],
          },
        ],
      },
    ],
  },
];
