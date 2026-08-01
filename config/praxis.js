/* ════════════════════════════════════════════════════════════════════
   praxis.js — PRAXIS-BRANDING (optional)
   Name, Logo und Farben im Dashboard. Jede Praxis trägt hier ihr eigenes
   ein. Fällt diese Datei weg, nutzt das Framework neutrale Defaults.
   ════════════════════════════════════════════════════════════════════ */
PCM.setPraxis({
  name: 'Praxis Dr. Florian Rasche',
  untertitel: 'Facharzt für Allgemeinmedizin · Würzburg',

  // Logo: Pfad zu einer Bilddatei im Ordner (PNG/JPG/SVG) ODER ein
  // data:-URL. Leer lassen für ein neutrales Symbol.
  logo: 'config/logo.png',

  // Praxis-CI-Farben (optional). primaer steuert Kopfzeilen & Buttons.
  farben: {
    primaer: '#025669',        // Petrolblau
    primaerDunkel: '#013D4B',  // dunkles Petrol (Dashboard-Kopf)
    akzent: '#BB4E26'          // Kupfer-Orange
  },

  // optionale Fußzeile im Dashboard
  footerBrand: 'Asklaion',
  footerLink: 'https://www.asklaion.de',
  footer: 'Die dargestellten SOPs dienen lediglich der Präsentation. Jede Praxis muss eigene SOPs einzeln hinzufügen, fachlich validieren und vor dem Einsatz freigeben.'
});
