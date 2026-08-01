PCM.registerSOP({
  id: 'score-abcd2',
  titel: '⚡ ABCD2',
  untertitel: 'Stroke-Risiko TIA · Johnston 2007 · MDCalc',
  icon: '⚡',
  farbe: '#1F618D',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Neurologie',
  delegationshinweis: 'TIA/Stroke-Verdacht ist zeitkritisch. Score ersetzt keine Notfallentscheidung.',

  schritte: [
    {
      nr: 1, titel: 'Aktuelle neurologische Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Aktuelle oder fluktuierende neurologische Ausfälle',
          'Symptombeginn innerhalb aktueller Notfallzeitfenster',
          'Antikoagulation, Bewusstseinsstörung, starker Kopfschmerz oder Krampfanfall'
        ] }
      ]
    },
    {
      nr: 2, titel: 'ABCD2-Kriterien', rolle: 'Score', farbe: '#1F618D', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'einfach', stil: 'gruen', items: [
          'Alter >= 60 Jahre (+1)',
          'Blutdruck initial >=140 systolisch oder >=90 diastolisch (+1)',
          'Diabetes mellitus (+1)'
        ] },
        { typ: 'auswahl', id: 'clinical', label: 'Klinik:', optionen: [
          { wert: '0', text: 'Andere/keine typische Klinik (0)' },
          { wert: '1', text: 'Sprachstörung ohne einseitige Schwäche (+1)' },
          { wert: '2', text: 'Einseitige Schwäche (+2)' }
        ] },
        { typ: 'auswahl', id: 'dauer', label: 'Dauer:', optionen: [
          { wert: '0', text: '< 10 Minuten (0)' },
          { wert: '1', text: '10-59 Minuten (+1)' },
          { wert: '2', text: '>= 60 Minuten (+2)' }
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.einfach || []).length + (parseInt(s.clinical || '0', 10) || 0) + (parseInt(s.dauer || '0', 10) || 0);
    var text = score >= 6 ? 'Hohes frühes Stroke-Risiko.' :
      score >= 4 ? 'Moderates frühes Stroke-Risiko.' :
      'Niedrigerer ABCD2-Score, aber TIA bleibt zeitkritisch.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'Aktuelle neurologische Symptomatik: sofortiger Stroke-/Notfallpfad.',
      meldungen: [{ stil: score >= 4 ? 'orange' : 'blau', titel: 'ABCD2: ' + score + '/7', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.einfach || []).length + (parseInt(s.clinical || '0', 10) || 0) + (parseInt(s.dauer || '0', 10) || 0);
    var be = 'ABCD2: ' + score + '/7. ';
    if ((s.einfach || []).length) be += 'Kriterien: ' + s.einfach.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'TIA/Stroke-Risiko strukturiert erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-mmse-moca',
  titel: '🧩 MMSE / MoCA',
  untertitel: 'Kognition/Demenz · Folstein 1975',
  icon: '🧩',
  farbe: '#6C3483',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Neurologie',
  delegationshinweis: 'Dokumentationshilfe für Kognitionstests. Vollständige Testdurchführung nach Originalmaterial und Interpretation ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'Testauswahl und Ergebnis', rolle: 'Score', farbe: '#6C3483', offen: true,
      elemente: [
        { typ: 'auswahl', id: 'test', label: 'Test:', optionen: [
          { wert: 'mmse', text: 'MMSE (0-30)' },
          { wert: 'moca', text: 'MoCA (0-30)' },
          { wert: 'beide', text: 'Beide dokumentiert' }
        ] },
        { typ: 'zahl', id: 'punkte', label: 'Punkte:', einheiten: ['von 30'], min: 0, max: 30 },
        { typ: 'checkliste', id: 'kontext', stil: 'gruen', items: [
          'Alltagsrelevante kognitive Beschwerden',
          'Fremdanamnese auffällig',
          'Delir/akute Verschlechterung ausgeschlossen',
          'Hör-/Seh-/Sprachbarriere berücksichtigt',
          'Depression/Medikation/Sucht als Einflussfaktor bedacht'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Auffälligkeiten:', platzhalter: 'Orientierung, Erinnerung, Exekutivfunktionen, Sprache, Uhrentest, Verlauf', hoehe: '80px' }
      ]
    }
  ],

  auswertung: function (s) {
    var p = parseFloat((s.punkte || {}).wert || '');
    var auff = p || p === 0 ? p < 26 : false;
    var text = auff ? 'Auffälliger oder grenzwertiger Kognitionsscreen; klinisch einordnen.' :
      'Testergebnis dokumentiert; Normwerte sind bildungs-/sprach- und testspezifisch.';
    return { redflag: false, meldungen: [{ stil: auff ? 'orange' : 'blau', titel: 'Kognitionstest', text: text }] };
  },

  baustein: function (s) {
    var p = s.punkte || {};
    var be = 'Kognitionstest dokumentiert. ';
    if (s.test) be += 'Test: ' + s.test + '. ';
    if (p.wert) be += 'Punkte: ' + p.wert + '/30. ';
    if ((s.kontext || []).length) be += 'Kontext: ' + s.kontext.join('; ') + '. ';
    if (s.notiz) be += 'Auffälligkeiten: ' + s.notiz.trim() + '.';
    return { AN: 'Kognitionsscreening/Demenzabklärung.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-canadian-ct-head',
  titel: '🧠 Canadian CT Head Rule',
  untertitel: 'CT bei Kopftrauma · Stiell 2001 · MDCalc',
  icon: '🧠',
  farbe: '#922B21',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Neurologie',
  delegationshinweis: 'Entscheidungshilfe für minor head injury. Ausschlusskriterien und lokale Notfallstandards beachten.',

  schritte: [
    {
      nr: 1, titel: 'Ausschluss / Sofortpfad', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'GCS < 13, Krampfanfall, fokal-neurologisches Defizit oder Bewusstseinsverschlechterung',
          'Antikoagulation/Blutungsstörung oder relevante Immunsuppression',
          'Offene/imprimierte Schädelverletzung oder penetrierendes Trauma',
          'Alter < 16 Jahre, Schwangerschaft oder Intoxikation/Anamnese nicht sicher beurteilbar'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Canadian-CT-Head-Kriterien', rolle: 'Score', farbe: '#922B21', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'hoch', stil: 'gruen', items: [
          'GCS < 15 zwei Stunden nach Trauma',
          'Verdacht auf offene oder imprimierte Schädelverletzung',
          'Zeichen basaler Schädelfraktur',
          '>= 2 Episoden Erbrechen',
          'Alter >= 65 Jahre'
        ] },
        { typ: 'checkliste', id: 'mittel', stil: 'gruen', items: [
          'Amnesie vor Ereignis >= 30 Minuten',
          'Gefährlicher Unfallmechanismus'
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var high = (s.hoch || []).length;
    var mid = (s.mittel || []).length;
    var red = (s.redflags || []).length > 0;
    var text = high || mid ? 'CT-Indikation nach Regel bzw. ärztliche Notfallbewertung naheliegend.' :
      'Keine Regelkriterien dokumentiert; klinische Beobachtung/Instruktion nach Standard.';
    return {
      redflag: red || high > 0,
      bannerText: 'Kopftrauma-Warnzeichen oder Hochrisikokriterium: sofort ärztlich/notfallmedizinisch klären.',
      meldungen: [{ stil: high || mid || red ? 'orange' : 'blau', titel: 'Canadian CT Head Rule', text: text }]
    };
  },

  baustein: function (s) {
    var be = 'Canadian CT Head Rule dokumentiert. ';
    if ((s.hoch || []).length) be += 'Hochrisiko: ' + s.hoch.join('; ') + '. ';
    if ((s.mittel || []).length) be += 'Mittleres Risiko: ' + s.mittel.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Ausschluss/Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'Kopftrauma strukturiert nach Canadian CT Head Rule erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});
