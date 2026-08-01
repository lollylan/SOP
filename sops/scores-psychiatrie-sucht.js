(function () {
  function num(s, id) { return parseInt(s[id] || '0', 10) || 0; }
  function sum(s, ids) {
    var n = 0;
    for (var i = 0; i < ids.length; i++) n += num(s, ids[i]);
    return n;
  }
  function phqOptions() {
    return [
      { wert: '0', text: '0 = überhaupt nicht' },
      { wert: '1', text: '1 = an einzelnen Tagen' },
      { wert: '2', text: '2 = an mehr als der Hälfte der Tage' },
      { wert: '3', text: '3 = beinahe jeden Tag' }
    ];
  }

  PCM.registerSOP({
    id: 'score-phq-9',
    titel: '🧠 PHQ-9',
    untertitel: 'Depression · Spitzer 1999',
    icon: '🧠',
    farbe: '#5D6D7E',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Psychiatrie / Sucht',
    delegationshinweis: 'Screening und Verlaufsdokumentation. Suizidalität oder akute Krise immer sofort ärztlich/psychiatrisch klären.',

    schritte: [
      {
        nr: 1, titel: 'Sicherheitsfrage', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
        elemente: [
          { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
            'Suizidgedanken, Selbstverletzungsdruck oder konkrete Pläne',
            'Psychotische Symptome, Manieverdacht oder akute Fremdgefährdung',
            'Schwere Vernachlässigung, Intoxikation oder fehlende Absprachefähigkeit'
          ] }
        ]
      },
      {
        nr: 2, titel: 'PHQ-9: letzte 2 Wochen', rolle: 'Score', farbe: '#5D6D7E', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'phq1', label: 'Wenig Interesse oder Freude:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq2', label: 'Niedergeschlagen/deprimiert/hopeless:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq3', label: 'Schlafprobleme:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq4', label: 'Müdigkeit / wenig Energie:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq5', label: 'Appetit verändert:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq6', label: 'Negatives Selbstwertgefühl:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq7', label: 'Konzentrationsprobleme:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq8', label: 'Verlangsamung oder Unruhe:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq9', label: 'Gedanken, lieber tot zu sein / Selbstverletzung:', optionen: phqOptions() }
        ]
      }
    ],

    auswertung: function (s) {
      var ids = ['phq1', 'phq2', 'phq3', 'phq4', 'phq5', 'phq6', 'phq7', 'phq8', 'phq9'];
      var score = sum(s, ids);
      var text = score >= 20 ? 'Schwere depressive Symptomatik.' :
        score >= 15 ? 'Mittelgradig bis schwere depressive Symptomatik.' :
        score >= 10 ? 'Mittelgradige depressive Symptomatik.' :
        score >= 5 ? 'Leichte depressive Symptomatik.' :
        'Minimaler Summenwert.';
      var red = (s.redflags || []).length > 0 || num(s, 'phq9') > 0;
      return {
        redflag: red,
        bannerText: 'Hinweis auf Suizidalität/Krise: sofort ärztlich klären und nicht allein lassen.',
        meldungen: [{ stil: score >= 10 || red ? 'orange' : 'blau', titel: 'PHQ-9: ' + score + '/27', text: text }]
      };
    },

    baustein: function (s) {
      var ids = ['phq1', 'phq2', 'phq3', 'phq4', 'phq5', 'phq6', 'phq7', 'phq8', 'phq9'];
      var score = sum(s, ids);
      var be = 'PHQ-9: ' + score + '/27. Item 9: ' + num(s, 'phq9') + '/3. ';
      if ((s.redflags || []).length) be += 'Akute Warnhinweise: ' + s.redflags.join('; ') + '.';
      return { AN: 'Depressionsscreening mittels PHQ-9.', BE: be.trim(), TH: '', LD: '' };
    }
  });

  PCM.registerSOP({
    id: 'score-phq-2',
    titel: '🔎 PHQ-2',
    untertitel: 'Depression Schnell · Kroenke 2003',
    icon: '🔎',
    farbe: '#566573',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Psychiatrie / Sucht',
    delegationshinweis: 'Kurzscreening; bei positivem Ergebnis vollständige Diagnostik, z. B. PHQ-9, ärztlich veranlassen.',

    schritte: [
      {
        nr: 1, titel: 'PHQ-2: letzte 2 Wochen', rolle: 'Score', farbe: '#566573', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'phq2a', label: 'Wenig Interesse oder Freude:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'phq2b', label: 'Niedergeschlagen/deprimiert/hopeless:', optionen: phqOptions() }
        ]
      }
    ],

    auswertung: function (s) {
      var score = sum(s, ['phq2a', 'phq2b']);
      return { redflag: false, meldungen: [{ stil: score >= 3 ? 'orange' : 'blau', titel: 'PHQ-2: ' + score + '/6', text: score >= 3 ? 'Positives Kurzscreening; PHQ-9/Diagnostik anschließen.' : 'Kurzscreening nicht positiv.' }] };
    },

    baustein: function (s) {
      var score = sum(s, ['phq2a', 'phq2b']);
      return { AN: 'Depressions-Kurzscreening mittels PHQ-2.', BE: 'PHQ-2: ' + score + '/6.', TH: '', LD: '' };
    }
  });

  PCM.registerSOP({
    id: 'score-gad-7',
    titel: '😰 GAD-7',
    untertitel: 'Angststörung · Spitzer 2006',
    icon: '😰',
    farbe: '#7D6608',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Psychiatrie / Sucht',
    delegationshinweis: 'Screening und Verlaufsdokumentation. Akute Krise, Suizidalität oder schwere Panik-/Somatik-Symptome ärztlich klären.',

    schritte: [
      {
        nr: 1, titel: 'GAD-7: letzte 2 Wochen', rolle: 'Score', farbe: '#7D6608', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'gad1', label: 'Nervosität/Anspannung:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad2', label: 'Sorgen nicht kontrollierbar:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad3', label: 'Zu viele Sorgen:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad4', label: 'Schwierigkeiten zu entspannen:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad5', label: 'Unruhe, nicht still sitzen können:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad6', label: 'Schnell gereizt:', optionen: phqOptions() },
          { typ: 'auswahl', id: 'gad7', label: 'Angst, etwas Schlimmes passiert:', optionen: phqOptions() }
        ]
      }
    ],

    auswertung: function (s) {
      var score = sum(s, ['gad1', 'gad2', 'gad3', 'gad4', 'gad5', 'gad6', 'gad7']);
      var text = score >= 15 ? 'Schwere Angstsymptomatik.' :
        score >= 10 ? 'Moderate Angstsymptomatik.' :
        score >= 5 ? 'Leichte Angstsymptomatik.' :
        'Minimaler Summenwert.';
      return { redflag: false, meldungen: [{ stil: score >= 10 ? 'orange' : 'blau', titel: 'GAD-7: ' + score + '/21', text: text }] };
    },

    baustein: function (s) {
      var score = sum(s, ['gad1', 'gad2', 'gad3', 'gad4', 'gad5', 'gad6', 'gad7']);
      return { AN: 'Angstscreening mittels GAD-7.', BE: 'GAD-7: ' + score + '/21.', TH: '', LD: '' };
    }
  });

  PCM.registerSOP({
    id: 'score-audit-c',
    titel: '🍷 AUDIT-C',
    untertitel: 'Riskanter Alkohol · WHO 1992',
    icon: '🍷',
    farbe: '#7E5109',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Psychiatrie / Sucht',
    delegationshinweis: 'Kurzscreening auf riskanten Alkoholkonsum. Entzug, Intoxikation und Abhängigkeit ärztlich/suchtmedizinisch klären.',

    schritte: [
      {
        nr: 1, titel: 'AUDIT-C', rolle: 'Score', farbe: '#7E5109', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'a1', label: 'Wie oft Alkohol', optionen: [
            { wert: '0', text: 'Nie (0)' },
            { wert: '1', text: 'Monatlich oder seltener (1)' },
            { wert: '2', text: '2-4x pro Monat (2)' },
            { wert: '3', text: '2-3x pro Woche (3)' },
            { wert: '4', text: '4x/Woche oder öfter (4)' }
          ] },
          { typ: 'auswahl', id: 'a2', label: 'Typische Trinkmenge:', optionen: [
            { wert: '0', text: '1-2 Standardgetrnke (0)' },
            { wert: '1', text: '3-4 (1)' },
            { wert: '2', text: '5-6 (2)' },
            { wert: '3', text: '7-9 (3)' },
            { wert: '4', text: '10 oder mehr (4)' }
          ] },
          { typ: 'auswahl', id: 'a3', label: 'Binge-Trinken:', optionen: [
            { wert: '0', text: 'Nie (0)' },
            { wert: '1', text: 'Seltener als monatlich (1)' },
            { wert: '2', text: 'Monatlich (2)' },
            { wert: '3', text: 'Wchentlich (3)' },
            { wert: '4', text: 'Tglich/fast tglich (4)' }
          ] }
        ]
      }
    ],

    auswertung: function (s) {
      var score = sum(s, ['a1', 'a2', 'a3']);
      return { redflag: false, meldungen: [{ stil: score >= 4 ? 'orange' : 'blau', titel: 'AUDIT-C: ' + score + '/12', text: score >= 4 ? 'Hinweis auf riskanten Alkoholkonsum; Kontext/Geschlecht/Schwellenwert ärztlich einordnen.' : 'Kein auffälliger Summenwert nach allgemeinem Cutoff.' }] };
    },

    baustein: function (s) {
      var score = sum(s, ['a1', 'a2', 'a3']);
      return { AN: 'Alkohol-Kurzscreening mittels AUDIT-C.', BE: 'AUDIT-C: ' + score + '/12.', TH: '', LD: '' };
    }
  });
})();
