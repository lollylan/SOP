PCM.registerSOP({
  id: 'score-sirs-sepsis',
  titel: '🦠 SIRS / Sepsis-Kriterien',
  untertitel: 'Sepsis-Screening · Bone et al. 1992 · MDCalc',
  icon: '🦠',
  farbe: '#A93226',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Infektiologie',
  delegationshinweis: 'Screening-Hilfe. Bei Sepsisverdacht zählt die klinische Einschätzung; ärztliche Sofortbewertung erforderlich.',

  schritte: [
    {
      nr: 1, titel: 'Infekt- und Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Akute Verwirrtheit, Somnolenz oder neuer Vigilanzabfall',
          'Systolischer Blutdruck <= 100 mmHg oder Kreislaufinstabilität',
          'Atemfrequenz >= 22/min oder relevante Dyspnoe',
          'Marmorierte/kalte Haut, Zyanose oder deutlich reduzierter Allgemeinzustand',
          'Oligurie, Petechien oder rasche klinische Verschlechterung'
        ] },
        { typ: 'auswahl', id: 'infekt', label: 'Infekt klinisch vermutet:', optionen: [
          { wert: 'ja', text: 'Ja' },
          { wert: 'unklar', text: 'Unklar' },
          { wert: 'nein', text: 'Nein' }
        ] }
      ]
    },
    {
      nr: 2, titel: 'SIRS-Kriterien', rolle: 'Score', farbe: '#A93226', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'sirs', stil: 'gruen', items: [
          'Temperatur > 38 Grad oder < 36 Grad',
          'Herzfrequenz > 90/min',
          'Atemfrequenz > 20/min oder PaCO2 < 32 mmHg',
          'Leukozyten > 12/nl, < 4/nl oder > 10% unreife Formen'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Kontext / Vitalwerte:', platzhalter: 'z. B. RR, Puls, AF, Temp., SpO2, Infektfokus', hoehe: '75px' }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.sirs || []).length;
    var red = (s.redflags || []).length > 0;
    var sepsisHinweis = (s.infekt === 'ja' || s.infekt === 'unklar') && (score >= 2 || red);
    var text = score >= 2 ? 'SIRS positiv. Bei Infektverdacht Sepsis/Organdysfunktion aktiv ausschließen.' :
      'SIRS nicht erfüllt; klinische Warnzeichen bleiben entscheidend.';
    return {
      redflag: red || sepsisHinweis,
      bannerText: 'Sepsisverdacht oder akutes Warnzeichen: sofort ärztlich priorisieren.',
      meldungen: [{ stil: sepsisHinweis ? 'orange' : 'blau', titel: 'SIRS: ' + score + ' von 4 Kriterien', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.sirs || []).length;
    var be = 'SIRS/Sepsis-Screening: ' + score + '/4 SIRS-Kriterien. ';
    if (s.infekt) be += 'Infektverdacht: ' + s.infekt + '. ';
    if ((s.sirs || []).length) be += 'Positive SIRS-Kriterien: ' + s.sirs.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '. ';
    if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
    return { AN: 'Screening bei möglichem Infekt/Sepsis.', BE: be.trim(), TH: '', LD: '' };
  }
});
