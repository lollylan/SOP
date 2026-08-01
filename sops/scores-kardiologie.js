PCM.registerSOP({
  id: 'score-cha2ds2-vasc',
  titel: '❤️ CHA2DS2-VASc',
  untertitel: 'OAK bei VHF · Lip 2010 · ESC',
  icon: '❤️',
  farbe: '#025669',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Kardiologie',
  delegationshinweis: 'Klassischer CHA2DS2-VASc inkl. Geschlechtskategorie. Antikoagulationsentscheidungen erfolgen ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'Akute Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
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
      score === 1 ? 'Grenzbereich: individuelle ärztliche Bewertung.' :
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
    var pos = [];
    if (s.alter === '65-74') pos.push('Alter 65-74 Jahre');
    if (s.alter === '75') pos.push('Alter >=75 Jahre');
    pos = pos.concat(s.einfach || []).concat(s.zweifach || []);
    var be = 'CHA2DS2-VASc: ' + score + ' Punkt(e). ';
    if (pos.length) be += 'Positive Kriterien: ' + pos.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'Score-Dokumentation bei Vorhofflimmern/Schlaganfallrisiko.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-has-bled',
  titel: '🩸 HAS-BLED',
  untertitel: 'Blutungsrisiko OAK · Lip 2011 · ESC',
  icon: '🩸',
  farbe: '#8E1B1B',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Kardiologie',
  delegationshinweis: 'HAS-BLED dient zur Risikostratifizierung und zum Erkennen modifizierbarer Blutungsrisiken; kein automatischer OAK-Stopp.',

  schritte: [
    {
      nr: 1, titel: 'Akute Blutungszeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Aktive relevante Blutung, Teerstuhl, Hämatemesis oder Makrohämaturie',
          'Neurologische Symptome / Sturz mit Kopftrauma unter Antikoagulation',
          'Kreislaufinstabilität, Synkope oder deutliche Anämiezeichen'
        ] }
      ]
    },
    {
      nr: 2, titel: 'HAS-BLED-Kriterien', rolle: 'Score', farbe: '#8E1B1B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'kriterien', stil: 'gruen', items: [
          'H: Hypertonie unkontrolliert, systolisch > 160 mmHg (+1)',
          'A: Abnorme Nierenfunktion (+1)',
          'A: Abnorme Leberfunktion (+1)',
          'S: Schlaganfall in der Vorgeschichte (+1)',
          'B: Blutung oder Blutungsneigung in der Vorgeschichte (+1)',
          'L: Labile INR / instabile Einstellung unter VKA (+1)',
          'E: Alter > 65 Jahre (+1)',
          'D: Medikamente mit Blutungsrisiko, z. B. NSAR/Thrombozytenhemmer (+1)',
          'D: Alkohol, relevant/regelmäßig erhöht (+1)'
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.kriterien || []).length;
    var text = score >= 3 ? 'Erhöhtes Blutungsrisiko: modifizierbare Faktoren prüfen und ärztlich kontrollieren.' :
      'Kein hoher HAS-BLED nach dokumentierten Kriterien.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'Akute Blutungs-/Traumakonstellation unter OAK: sofort ärztlich klären.',
      meldungen: [{ stil: score >= 3 ? 'orange' : 'blau', titel: 'HAS-BLED: ' + score + ' Punkt(e)', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.kriterien || []).length;
    var be = 'HAS-BLED: ' + score + ' Punkt(e). ';
    if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Akute Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'Blutungsrisiko-Screening unter/geplanter OAK.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-framingham',
  titel: '📊 Framingham',
  untertitel: '10-J.-KV-Risiko · Wilson 1998',
  icon: '📊',
  farbe: '#21618C',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Kardiologie',
  delegationshinweis: 'Strukturierte Dokumentationshilfe für kardiovaskuläre Risikofaktoren. Exakte Risikoquantifizierung bitte mit validiertem Rechner/Leitlinienmodul.',

  schritte: [
    {
      nr: 1, titel: 'Risikoprofil dokumentieren', rolle: 'Score', farbe: '#21618C', offen: true,
      elemente: [
        { typ: 'auswahl', id: 'alter', label: 'Alter:', optionen: [
          { wert: 'niedrig', text: '< 45 Jahre' },
          { wert: 'mittel', text: '45-64 Jahre' },
          { wert: 'hoch', text: '65 Jahre oder älter' }
        ] },
        { typ: 'checkliste', id: 'risiko', stil: 'gruen', items: [
          'Rauchen aktuell',
          'Arterielle Hypertonie oder antihypertensive Therapie',
          'Diabetes mellitus',
          'Gesamtcholesterin erhöht',
          'HDL niedrig',
          'Positive Familienanamnese für frühe kardiovaskuläre Ereignisse'
        ] },
        { typ: 'textarea', id: 'werte', label: 'Werte / Rechnerergebnis:', platzhalter: 'RR, Cholesterin, HDL, Diabetes, Rauchen, Framingham-Risiko in % falls extern berechnet', hoehe: '75px' }
      ]
    }
  ],

  auswertung: function (s) {
    var n = (s.risiko || []).length + (s.alter === 'hoch' ? 1 : 0);
    var text = n >= 3 ? 'Mehrere Risikofaktoren dokumentiert; formale Risikoberechnung und ärztliche Präventionsplanung sinnvoll.' :
      'Risikofaktoren dokumentiert; bitte Labor-/RR-Werte vervollständigen.';
    return { redflag: false, meldungen: [{ stil: n >= 3 ? 'orange' : 'blau', titel: 'KV-Risikoprofil', text: text }] };
  },

  baustein: function (s) {
    var be = 'Framingham/KV-Risikoprofil dokumentiert. ';
    if (s.alter) be += 'Altersgruppe: ' + s.alter + '. ';
    if ((s.risiko || []).length) be += 'Risikofaktoren: ' + s.risiko.join('; ') + '. ';
    if (s.werte) be += 'Werte/Rechnerergebnis: ' + s.werte.trim() + '.';
    return { AN: 'Kardiovaskuläre Risikoerfassung.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-marburger-herz',
  titel: '💗 Marburger Herz-Score',
  untertitel: 'KHK Hausarzt · Bösner 2010 · DEGAM',
  icon: '💗',
  farbe: '#BB4E26',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Kardiologie',
  delegationshinweis: 'Bei Verdacht auf ACS immer Arzt/Notfallpfad, unabhängig vom Score.',

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
