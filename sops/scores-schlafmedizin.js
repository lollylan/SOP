(function () {
  function num(s, id) { return parseInt(s[id] || '0', 10) || 0; }
  function sum(s, ids) {
    var n = 0;
    for (var i = 0; i < ids.length; i++) n += num(s, ids[i]);
    return n;
  }
  function freqOptions() {
    return [
      { wert: '0', text: '0 = würde nie einnicken' },
      { wert: '1', text: '1 = geringe Wahrscheinlichkeit' },
      { wert: '2', text: '2 = mittlere Wahrscheinlichkeit' },
      { wert: '3', text: '3 = hohe Wahrscheinlichkeit' }
    ];
  }

  PCM.registerSOP({
    id: 'score-stop-bang',
    titel: '😴 STOP-BANG',
    untertitel: 'Schlafapnoe OSA · Chung 2008 · MDCalc',
    icon: '😴',
    farbe: '#4A3F8C',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Schlafmedizin',
    delegationshinweis: 'Screening-Hilfe für OSA-Risiko. Diagnose und Therapie, z. B. Schlaflabor/CPAP, erfolgen ärztlich.',

    schritte: [
      {
        nr: 1, titel: 'STOP-BANG-Kriterien', rolle: 'Score', farbe: '#4A3F8C', offen: true,
        elemente: [
          { typ: 'checkliste', id: 'kriterien', stil: 'gruen', items: [
            'S: Lautes Schnarchen',
            'T: Tagesmüdigkeit / Fatigue',
            'O: Beobachtete Atempausen',
            'P: Bluthochdruck bekannt oder behandelt',
            'B: BMI > 35 kg/m2',
            'A: Alter > 50 Jahre',
            'N: Halsumfang > 40 cm',
            'G: Männliches Geschlecht'
          ] },
          { typ: 'textarea', id: 'notiz', label: 'Kontext:', platzhalter: 'z. B. Berufskraftfahrer, Einschlafneigung, Partnerbericht, Vorbefunde', hoehe: '70px' }
        ]
      }
    ],

    auswertung: function (s) {
      var score = (s.kriterien || []).length;
      var text = score >= 5 ? 'Hohes OSA-Risiko.' :
        score >= 3 ? 'Intermediäres OSA-Risiko; weitere Abklärung sinnvoll.' :
        'Niedriger dokumentierter STOP-BANG-Score.';
      return { redflag: false, meldungen: [{ stil: score >= 3 ? 'orange' : 'blau', titel: 'STOP-BANG: ' + score + '/8', text: text }] };
    },

    baustein: function (s) {
      var score = (s.kriterien || []).length;
      var be = 'STOP-BANG: ' + score + '/8. ';
      if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
      if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
      return { AN: 'OSA-Screening mittels STOP-BANG.', BE: be.trim(), TH: '', LD: '' };
    }
  });

  PCM.registerSOP({
    id: 'score-epworth-ess',
    titel: '💤 Epworth ESS',
    untertitel: 'Tagesschläfrigkeit · Johns 1991 · MSD',
    icon: '💤',
    farbe: '#6C5B7B',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Schlafmedizin',
    delegationshinweis: 'Selbstauskunft zur Einschlafneigung. Relevante Tagesschläfrigkeit, Fahrtauglichkeit und Ursachen ärztlich klären.',

    schritte: [
      {
        nr: 1, titel: 'Einschlafneigung in Alltagssituationen', rolle: 'Score', farbe: '#6C5B7B', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'ess1', label: 'Sitzen und Lesen:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess2', label: 'Fernsehen:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess3', label: 'Passiv in Öffentlichkeit sitzen:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess4', label: 'Als Mitfahrer im Auto > 1 Stunde:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess5', label: 'Nachmittags hinlegen:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess6', label: 'Sitzen und mit jemandem sprechen:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess7', label: 'Ruhig sitzen nach Mittagessen ohne Alkohol:', optionen: freqOptions() },
          { typ: 'auswahl', id: 'ess8', label: 'Im Auto kurz im Verkehr anhalten:', optionen: freqOptions() }
        ]
      }
    ],

    auswertung: function (s) {
      var ids = ['ess1', 'ess2', 'ess3', 'ess4', 'ess5', 'ess6', 'ess7', 'ess8'];
      var score = sum(s, ids);
      var text = score >= 16 ? 'Ausgeprägte Tagesschläfrigkeit.' :
        score >= 11 ? 'Erhöhte Tagesschläfrigkeit.' :
        'Keine erhöhte Tagesschläfrigkeit nach ESS-Summenwert.';
      return { redflag: false, meldungen: [{ stil: score >= 11 ? 'orange' : 'blau', titel: 'ESS: ' + score + '/24', text: text }] };
    },

    baustein: function (s) {
      var ids = ['ess1', 'ess2', 'ess3', 'ess4', 'ess5', 'ess6', 'ess7', 'ess8'];
      var score = sum(s, ids);
      return { AN: 'Epworth Sleepiness Scale erhoben.', BE: 'ESS-Summenwert: ' + score + '/24.', TH: '', LD: '' };
    }
  });
})();
