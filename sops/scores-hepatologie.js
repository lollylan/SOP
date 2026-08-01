PCM.registerSOP({
  id: 'score-fib-4',
  titel: '🫀 FIB-4-Score',
  untertitel: 'Leberfibrose MASH/NASH · Sterling 2006 · Leberhilfe',
  icon: '🫀',
  farbe: '#884EA0',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Hepatologie',
  delegationshinweis: 'FIB-4 ist ein nicht-invasiver Fibrose-Screening-Score. Laborwerte, Ausschluss anderer Ursachen und weitere Diagnostik ärztlich einordnen.',

  schritte: [
    {
      nr: 1, titel: 'Laborwerte', rolle: 'Score', farbe: '#884EA0', offen: true,
      elemente: [
        { typ: 'zahl', id: 'alter', label: 'Alter:', einheiten: ['Jahre'], min: 1, max: 120 },
        { typ: 'zahl', id: 'ast', label: 'AST/GOT:', einheiten: ['U/l'], min: 1, max: 2000 },
        { typ: 'zahl', id: 'alt', label: 'ALT/GPT:', einheiten: ['U/l'], min: 1, max: 2000 },
        { typ: 'zahl', id: 'plt', label: 'Thrombozyten:', einheiten: ['G/l'], min: 1, max: 1000 },
        { typ: 'textarea', id: 'notiz', label: 'Kontext:', platzhalter: 'z. B. Alkohol, Virushepatitis, MASH/NASH, Sono, Elastographie, Verlauf', hoehe: '75px' }
      ]
    }
  ],

  auswertung: function (s) {
    var age = parseFloat((s.alter || {}).wert || '');
    var ast = parseFloat((s.ast || {}).wert || '');
    var alt = parseFloat((s.alt || {}).wert || '');
    var plt = parseFloat((s.plt || {}).wert || '');
    var score = age && ast && alt && plt ? (age * ast) / (plt * Math.sqrt(alt)) : null;
    var title = score === null ? 'FIB-4: Werte unvollständig' : 'FIB-4: ' + score.toFixed(2);
    var text = score === null ? 'Bitte Alter, AST, ALT und Thrombozyten ergänzen.' :
      score < 1.3 ? 'Niedriger Fibrose-Hinweis nach klassischem Cutoff.' :
      score <= 2.67 ? 'Intermediärer Bereich; weitere Risikostratifizierung sinnvoll.' :
      'Erhöhtes Fibrose-Risiko; ärztliche/hepatologische Bewertung sinnvoll.';
    return { redflag: false, meldungen: [{ stil: score !== null && score >= 1.3 ? 'orange' : 'blau', titel: title, text: text }] };
  },

  baustein: function (s) {
    var age = parseFloat((s.alter || {}).wert || '');
    var ast = parseFloat((s.ast || {}).wert || '');
    var alt = parseFloat((s.alt || {}).wert || '');
    var plt = parseFloat((s.plt || {}).wert || '');
    var score = age && ast && alt && plt ? (age * ast) / (plt * Math.sqrt(alt)) : null;
    var be = score === null ? 'FIB-4 nicht berechenbar, Werte unvollständig. ' : 'FIB-4: ' + score.toFixed(2) + '. ';
    if (age) be += 'Alter ' + age + ' Jahre. ';
    if (ast) be += 'AST ' + ast + ' U/l. ';
    if (alt) be += 'ALT ' + alt + ' U/l. ';
    if (plt) be += 'Thrombozyten ' + plt + ' G/l. ';
    if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
    return { AN: 'Leberfibrose-Screening mittels FIB-4.', BE: be.trim(), TH: '', LD: '' };
  }
});
