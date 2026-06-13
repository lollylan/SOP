/*
   pvs-template.js - FORMAT DES DEMO-TEXTBAUSTEINS
   Bestimmt, wie der fertige Baustein aussieht. Die SOPs liefern die
   Inhalte der Abschnitte (AN/BE/TH/LD); dieses Template bestimmt
   Ueberschriften, Reihenfolge und Formatierung.

   In dieser GitHub-Demo enthaelt LD nur frei erfundene Demo-Codes.
*/
PCM.setPvsTemplate({
  name: 'Demo-Standard (AN / BE / TH / LD)',

  abschnitte: [
    { key: 'AN', label: 'AN' },
    { key: 'BE', label: 'BE' },
    { key: 'TH', label: 'TH' },
    { key: 'LD', label: 'LD', nurIcdCode: true }
  ],

  trennzeichen: '\n',
  leereWeglassen: true
});
