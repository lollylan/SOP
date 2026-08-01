PCM.registerSOP({
  id: 'score-centor',
  titel: 'Centor-/McIsaac-Score',
  untertitel: 'Halsschmerzen · Streptokokken-Wahrscheinlichkeit',
  icon: 'Score',
  farbe: '#7D3C98',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  delegationshinweis: 'Score-Rechner als Dokumentationshilfe. Test- und Therapieentscheidungen erfolgen ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'Kriterien anklicken', rolle: 'Score', farbe: '#7D3C98', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'kriterien', stil: 'gruen', items: [
          'Fieber > 38 Grad anamnestisch oder gemessen',
          'Kein Husten',
          'Tonsillenexsudat / eitrige Beläge',
          'Druckschmerzhafte vordere zervikale Lymphknoten'
        ] },
        { typ: 'auswahl', id: 'alter', label: 'Altersmodifikation:', optionen: [
          { wert: 'kind', text: '3-14 Jahre (+1)' },
          { wert: 'adult', text: '15-44 Jahre (0)' },
          { wert: 'older', text: '45 Jahre oder älter (-1)' }
        ] }
      ]
    },
    {
      nr: 2, titel: 'Dokumentation', rolle: 'PVS', rolleStil: 'green', farbe: '#1E8449',
      elemente: [
        { typ: 'textarea', id: 'kontext', label: 'Klinischer Kontext / Notiz:', platzhalter: 'z. B. Halsschmerzen seit 2 Tagen, kein Dyspnoezeichen', hoehe: '70px' }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.kriterien || []).length;
    if (s.alter === 'kind') score += 1;
    if (s.alter === 'older') score -= 1;
    var text = score <= 1 ? 'niedrige Wahrscheinlichkeit; meist symptomatisches Vorgehen' :
      score === 2 ? 'mittlere Wahrscheinlichkeit; Test/CRP ärztlich erwägen' :
      score === 3 ? 'erhöhte Wahrscheinlichkeit; ärztliche Bewertung/Test sinnvoll' :
      'hohe Wahrscheinlichkeit; ärztliche Bewertung erforderlich';
    return {
      redflag: false,
      meldungen: [{ stil: score >= 3 ? 'orange' : 'blau', titel: 'Score: ' + score + ' Punkt(e)', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.kriterien || []).length;
    if (s.alter === 'kind') score += 1;
    if (s.alter === 'older') score -= 1;
    var be = 'Centor-/McIsaac-Score: ' + score + ' Punkt(e). ';
    if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
    if (s.alter) be += 'Altersgruppe: ' + (s.alter === 'kind' ? '3-14 Jahre' : s.alter === 'older' ? '45 Jahre oder älter' : '15-44 Jahre') + '. ';
    if (s.kontext) be += 'Kontext: ' + s.kontext.trim() + '.';
    return { AN: 'Score-Dokumentation bei Halsschmerzen.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-cha2ds2-vasc',
  titel: 'CHA2DS2-VASc-Score',
  untertitel: 'Vorhofflimmern · Schlaganfallrisiko dokumentieren',
  icon: 'Score',
  farbe: '#025669',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  delegationshinweis: 'Klassischer CHA2DS2-VASc inkl. Geschlechtskategorie. Antikoagulationsentscheidungen sind ärztlich zu treffen.',

  schritte: [
    {
      nr: 1, titel: 'Red Flags vor Score', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Akute neurologische Ausfälle / TIA- oder Schlaganfallverdacht',
          'Synkope, instabiler Kreislauf, akuter Brustschmerz oder akute Dyspnoe',
          'Aktive relevante Blutung'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Risikofaktoren', rolle: 'Score', farbe: '#025669', offen: true,
      elemente: [
        { typ: 'auswahl', id: 'alter', label: 'Alter:', optionen: [
          { wert: 'u65', text: '< 65 Jahre (0)' },
          { wert: '65-74', text: '65-74 Jahre (+1)' },
          { wert: '75', text: '75 Jahre oder älter (+2)' }
        ] },
        { typ: 'checkliste', id: 'einfach', stil: 'gruen', items: [
          'Herzinsuffizienz / LV-Dysfunktion (+1)',
          'Arterielle Hypertonie / antihypertensive Therapie (+1)',
          'Diabetes mellitus (+1)',
          'Vaskuläre Erkrankung: KHK, pAVK, Myokardinfarkt, Aortenplaque (+1)',
          'Weibliches Geschlecht als klassische Sc-Kategorie (+1)'
        ] },
        { typ: 'checkliste', id: 'zweifach', stil: 'gruen', items: [
          'Schlaganfall, TIA oder systemische Embolie in der Vorgeschichte (+2)'
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.einfach || []).length + 2 * (s.zweifach || []).length;
    if (s.alter === '65-74') score += 1;
    if (s.alter === '75') score += 2;
    var meld = score === 0 ? 'Sehr niedriger dokumentierter Risikoscore.' :
      score === 1 ? 'Grenzbereich: ärztliche individuelle Bewertung.' :
      'Erhöhtes Risiko: ärztliche Bewertung der Antikoagulation erforderlich.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'Akutes Warnzeichen: Score nicht fortsetzen, sofort Arzt hinzuziehen.',
      meldungen: [{ stil: score >= 2 ? 'orange' : 'blau', titel: 'CHA2DS2-VASc: ' + score + ' Punkt(e)', text: meld }]
    };
  },

  baustein: function (s) {
    var score = (s.einfach || []).length + 2 * (s.zweifach || []).length;
    if (s.alter === '65-74') score += 1;
    if (s.alter === '75') score += 2;
    var be = 'CHA2DS2-VASc-Score: ' + score + ' Punkt(e). ';
    var pos = [];
    if (s.alter === '65-74') pos.push('Alter 65-74 Jahre');
    if (s.alter === '75') pos.push('Alter >=75 Jahre');
    pos = pos.concat(s.einfach || []).concat(s.zweifach || []);
    if (pos.length) be += 'Positive Kriterien: ' + pos.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '. ';
    return { AN: 'Score-Dokumentation bei Vorhofflimmern/Schlaganfallrisiko.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-marburger-herz',
  titel: 'Marburger Herz-Score',
  untertitel: 'Brustschmerz in der Hausarztpraxis · KHK-Wahrscheinlichkeit',
  icon: 'Score',
  farbe: '#BB4E26',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  delegationshinweis: 'Beispiel für den vom Nutzer gemeinten Herz-Score. Bei Verdacht auf ACS immer Arzt/Notfallpfad, unabhängig vom Score.',

  schritte: [
    {
      nr: 1, titel: 'Akute Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Akuter starker Brustschmerz, Enge/Druck, Ausstrahlung oder Kaltschweißigkeit',
          'Dyspnoe, Synkope, Kreislaufinstabilität oder blasse/kaltschweißige Patientin',
          'Neu aufgetretene Rhythmusstörung oder deutlich reduzierter Allgemeinzustand'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Score-Kriterien', rolle: 'Score', farbe: '#BB4E26', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'kriterien', stil: 'gruen', items: [
          'Frau >=65 Jahre oder Mann >=55 Jahre',
          'Bekannte vaskuläre Erkrankung',
          'Beschwerden werden durch körperliche Belastung schlimmer',
          'Schmerz ist durch Palpation nicht reproduzierbar',
          'Patientin/Patient vermutet selbst eine kardiale Ursache'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Brustschmerz-Kontext:', platzhalter: 'Beginn, Dauer, Lokalisation, Begleitsymptome, Vitalparameter', hoehe: '75px' }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.kriterien || []).length;
    var red = (s.redflags || []).length > 0;
    var text = score >= 3 ? 'KHK wahrscheinlicher: ärztliche Bewertung erforderlich.' :
      'KHK nach Score weniger wahrscheinlich; klinische Bewertung bleibt entscheidend.';
    return {
      redflag: red,
      bannerText: 'Akutes Brustschmerz-Warnzeichen: sofort Arzt/Notfallpfad, Score nachrangig.',
      meldungen: [{ stil: red || score >= 3 ? 'orange' : 'blau', titel: 'Marburger Herz-Score: ' + score + ' Punkt(e)', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.kriterien || []).length;
    var be = 'Marburger Herz-Score: ' + score + ' Punkt(e). ';
    if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Akute Warnzeichen: ' + s.redflags.join('; ') + '. ';
    if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
    return { AN: 'Score-Dokumentation bei Brustschmerz.', BE: be.trim(), TH: '', LD: '' };
  }
});
