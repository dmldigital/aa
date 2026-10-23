// Inhalte der Seite /urlaubsservice/ (Texte wie im Original)
import image from '../../assets/img/urlaubsservice.jpeg';
import palm from '../../assets/img/black-white-palm-landscape-scaled.jpg';
import concrete from '../../assets/img/249-mw-20241125-scaled.jpg';

export const meta = {
  title: 'Maler Urlaubsservice',
  description:
    'Renovieren ohne Stress: Unser exklusiver Urlaubsservice für Ludwigsburg & Stuttgart. Während Sie entspannen, verschönern wir Ihr Zuhause.',
};

export const intro = {
  heading: 'Unser Urlaubsservice für Sie',
  text: 'Perfekt getimed: Während Sie entspannen, arbeiten wir! Unser exklusiver Urlaubsservice bietet Ihnen genau das: Während Ihrer Abwesenheit führen wir alle vereinbarten Renovierungsarbeiten durch. So kehren Sie in ein frisch renoviertes Zuhause zurück – ganz ohne Schmutz, Lärm oder Einschränkungen',
  image,
  alt: '',
};

export const background = concrete;

// Auf dem Desktop zeigt das Original in der zweiten Spalte versehentlich noch einmal den Ablauf;
// hier steht dort wie auf Tablet und Handy „Warum unser Urlaubsservice?“.
export const columns = [
  {
    title: 'Ihr Ablauf in 4 einfachen Schritten:',
    items: [
      '<strong>Vorbesprechung &amp; Planung</strong><br />Wir klären gemeinsam, welche Arbeiten wann ausgeführt werden sollen.',
      '<strong>Ihr Urlaub – unser Startschuss</strong><br />Sobald Sie verreist sind, beginnen wir mit den Arbeiten.',
      '<strong>Tägliche Updates (optional)</strong><br />Auf Wunsch informieren wir Sie jeden Abend per E‑Mail über den Fortschritt.',
      '<strong>Zurück am Ziel – alles ist fertig</strong><br />Sie kommen nach Hause und finden Ihr renoviertes Zuhause in perfektem Zustand vor.',
    ],
  },
  {
    title: 'Warum unser Urlaubsservice?',
    items: [
      '<strong>Maximale Entspannung</strong> – kein Lärm, kein Dreck, keine Einschränkungen.',
      '<strong>Rundum-sorglos</strong> – Sie genießen Ihren Urlaub, während wir Ihr Zuhause verschönern.',
      '<strong>Volle Transparenz</strong> – mit täglichem Update, klarer Kommunikation und einem Ansprechpartner.',
    ],
  },
];

// Teil-Website Exklusive (/meisterwerk-exklusive/urlaub/): Überzeile, anderes Bild, gleicher Text und Ablauf
export const exklusiveMeta = {
  title: 'Urlaubsservice',
  description:
    'Renovieren, während Sie verreist sind: der Urlaubsservice von Meisterwerke Exklusive für Ludwigsburg und Stuttgart. Zurück im renovierten Zuhause.',
};
export const exklusiveIntro = { ...intro, eyebrow: 'Meisterwerk Exklusive', image: palm };
