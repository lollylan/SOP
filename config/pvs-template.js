/* ════════════════════════════════════════════════════════════════════
   pvs-template.js — FORMAT DES PVS-TEXTBAUSTEINS
   Bestimmt, WIE der fertige Baustein aussieht. Das unterscheidet sich von
   PVS zu PVS — deshalb ist es eine eigene Datei, die jede Praxis anpasst.
   Die SOPs liefern nur die INHALTE der Abschnitte (AN/BE/SN/EK/TH/LD); dieses
   Template bestimmt Überschriften, Reihenfolge und Formatierung.
   SN = Sonographie (Ultraschallbefund) — eigener Abschnitt, wird von den
   Sono-Modulen (sops/sop-sono-*.js) befüllt.
   EK = EKG-Befundung — eigener Abschnitt, wird von sops/sop-ekg.js befüllt.

   Default unten: Format der Praxis Dr. Rasche (Pegamed) —
   Überschrift auf eigener Zeile, darunter der Text, leere Abschnitte
   werden weggelassen. LD enthält nur die ICD-10-Codes (einer pro Zeile).
   ════════════════════════════════════════════════════════════════════ */
PCM.setPvsTemplate({
  name: 'Standard (AN / BE / SN / EK / TH / LD)',

  // Reihenfolge + Überschrift (label) der Abschnitte.
  // key  = wird von der SOP in baustein() befüllt (AN/BE/SN/EK/TH/LD)
  // label= Überschrift, die im Baustein erscheint
  abschnitte: [
    { key: 'AN', label: 'AN' },               // Anamnese
    { key: 'BE', label: 'BE' },               // Befund
    { key: 'SN', label: 'SN' },               // Sonographie (Ultraschallbefund)
    { key: 'EK', label: 'EK' },               // EKG-Befundung
    { key: 'TH', label: 'TH' },               // Therapie
    { key: 'LD', label: 'LD', nurIcdCode: true } // Laufende Diagnosen (nur ICD-Codes)
  ],

  trennzeichen: '\n',     // zwischen Überschrift, Text und nächstem Abschnitt
  leereWeglassen: true    // Abschnitte ohne Inhalt komplett auslassen

  /* Beispiel für ein anderes PVS (Überschrift mit Doppelpunkt):
     abschnitte: [
       { key:'AN', label:'Anamnese:' },
       { key:'BE', label:'Befund:' },
       { key:'TH', label:'Therapie/Procedere:' },
       { key:'LD', label:'Diagnosen:' }
     ]
  */
});
