PCM.registerSOP({
  id: 'score-frax-osteoporose',
  titel: '🦴 FRAX Osteoporose',
  untertitel: '10-J.-Frakturrisiko · WHO/FRAX fraxplus.org',
  icon: '🦴',
  farbe: '#7B7D7D',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Osteologie',
  delegationshinweis: 'FRAX nutzt länder- und altersabhängige Modelle. Bitte das validierte FRAX/FRAXplus-Ergebnis extern berechnen und hier dokumentieren.',

  schritte: [
    {
      nr: 1, titel: 'FRAX-Risikofaktoren', rolle: 'Score', farbe: '#7B7D7D', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'risiko', stil: 'gruen', items: [
          'Vorherige Fragilitätsfraktur',
          'Hüftfraktur bei Elternteil',
          'Aktuelles Rauchen',
          'Glukokortikoide aktuell/chronisch',
          'Rheumatoide Arthritis',
          'Sekundäre Osteoporose',
          'Alkohol >= 3 Einheiten/Tag',
          'Femurhals-BMD/T-Score liegt vor'
        ] },
        { typ: 'textarea', id: 'extern', label: 'FRAX/FRAXplus-Ergebnis:', platzhalter: '10-Jahres-Risiko major osteoporotic fracture %, Hüftfraktur %, Land/Modell, BMD/T-Score', hoehe: '80px' }
      ]
    }
  ],

  auswertung: function (s) {
    var n = (s.risiko || []).length;
    var text = n >= 3 ? 'Mehrere FRAX-Risikofaktoren dokumentiert; formale FRAX-Berechnung und ärztliche Bewertung sinnvoll.' :
      'Risikofaktoren dokumentiert; externes FRAX-Ergebnis ergänzen.';
    return { redflag: false, meldungen: [{ stil: n >= 3 ? 'orange' : 'blau', titel: 'FRAX-Dokumentation', text: text }] };
  },

  baustein: function (s) {
    var be = 'FRAX/Osteoporose-Risiko dokumentiert. ';
    if ((s.risiko || []).length) be += 'Risikofaktoren: ' + s.risiko.join('; ') + '. ';
    if (s.extern) be += 'Externes Ergebnis: ' + s.extern.trim() + '.';
    return { AN: '10-Jahres-Frakturrisiko strukturiert erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});
