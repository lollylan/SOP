PCM.registerSOP({
  id: 'score-nierenversagen-risiko',
  titel: '🫘 Nierenversagen-Risiko',
  untertitel: 'CKD-Progression · risiko-nierenversagen.de',
  icon: '🫘',
  farbe: '#117A65',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Nephrologie',
  delegationshinweis: 'Dokumentationshilfe für CKD-Progressionsrisiko. Das validierte 2-/5-Jahres-Risiko bitte mit dem externen Nierenversagen-Risiko-Rechner berechnen.',

  schritte: [
    {
      nr: 1, titel: 'CKD-Risikodaten', rolle: 'Score', farbe: '#117A65', offen: true,
      elemente: [
        { typ: 'zahl', id: 'egfr', label: 'eGFR:', einheiten: ['ml/min/1,73 m2'], min: 1, max: 120 },
        { typ: 'zahl', id: 'albuminurie', label: 'UACR/Albumin-Kreatinin-Ratio:', einheiten: ['mg/g', 'mg/mmol'], min: 0, max: 5000 },
        { typ: 'checkliste', id: 'risiko', stil: 'gruen', items: [
          'Diabetes mellitus',
          'Arterielle Hypertonie',
          'eGFR-Verlust im Verlauf',
          'Albuminurie deutlich erhöht',
          'Bekannte strukturelle Nierenerkrankung'
        ] },
        { typ: 'textarea', id: 'extern', label: 'Externes Rechnerergebnis / Verlauf:', platzhalter: '2-Jahres- und 5-Jahres-Risiko, Kreatinin/eGFR-Verlauf, UACR, Nephrologie-Termin', hoehe: '80px' }
      ]
    }
  ],

  auswertung: function (s) {
    var egfr = parseFloat((s.egfr || {}).wert || '');
    var uacr = parseFloat((s.albuminurie || {}).wert || '');
    var high = (egfr && egfr < 30) || (uacr && uacr >= 300) || (s.risiko || []).length >= 3;
    var text = high ? 'Höheres CKD-Progressionsrisiko möglich; externen Risikorechner und ärztliche/nefrologische Bewertung nutzen.' :
      'Risikodaten dokumentiert; formale Berechnung extern ergänzen.';
    return { redflag: false, meldungen: [{ stil: high ? 'orange' : 'blau', titel: 'CKD-Risiko-Dokumentation', text: text }] };
  },

  baustein: function (s) {
    var egfr = s.egfr || {};
    var alb = s.albuminurie || {};
    var be = 'Nierenversagen-Risiko-Dokumentation. ';
    if (egfr.wert) be += 'eGFR: ' + egfr.wert + ' ' + egfr.einheit + '. ';
    if (alb.wert) be += 'UACR: ' + alb.wert + ' ' + alb.einheit + '. ';
    if ((s.risiko || []).length) be += 'Risikofaktoren: ' + s.risiko.join('; ') + '. ';
    if (s.extern) be += 'Externes Ergebnis/Verlauf: ' + s.extern.trim() + '.';
    return { AN: 'CKD-Progressionsrisiko strukturiert erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});
