(function () {
  function num(s, id) { return parseInt(s[id] || '0', 10) || 0; }
  function sum(s, ids) {
    var n = 0;
    for (var i = 0; i < ids.length; i++) n += num(s, ids[i]);
    return n;
  }
  function ipssOptions() {
    return [
      { wert: '0', text: '0 = nie' },
      { wert: '1', text: '1 = selten' },
      { wert: '2', text: '2 = gelegentlich' },
      { wert: '3', text: '3 = etwa jedes zweite Mal' },
      { wert: '4', text: '4 = meistens' },
      { wert: '5', text: '5 = fast immer' }
    ];
  }

  PCM.registerSOP({
    id: 'score-ipss',
    titel: '💧 IPSS - Prostata',
    untertitel: 'BPS-Symptome · Barry 1992 · AUA',
    icon: '💧',
    farbe: '#2874A6',
    version: '0.1',
    stand: '13.06.2026',
    bereich: 'Scores',
    kategorie: 'Scores',
  unterbereich: 'Urologie',
    delegationshinweis: 'Symptomscore für LUTS/BPS. Harnverhalt, Infektzeichen, Hämaturie oder Nierenstau ärztlich abklären.',

    schritte: [
      {
        nr: 1, titel: 'Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
        elemente: [
          { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
            'Akuter Harnverhalt oder schmerzhafte Blasenüberdehnung',
            'Fieber/Flankenschmerz oder Pyelonephritisverdacht',
            'Makrohämaturie, Gewichtsverlust oder Tumorverdacht',
            'Neurologische Ausfälle oder Cauda-equina-Verdacht'
          ] }
        ]
      },
      {
        nr: 2, titel: 'IPSS: letzte 4 Wochen', rolle: 'Score', farbe: '#2874A6', offen: true,
        elemente: [
          { typ: 'auswahl', id: 'i1', label: 'Restharngefühl:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i2', label: 'Wieder Wasserlassen < 2 Stunden:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i3', label: 'Harnstrahl unterbrochen:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i4', label: 'Harndrang schlecht aufzuschieben:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i5', label: 'Schwacher Harnstrahl:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i6', label: 'Pressen zum Wasserlassen:', optionen: ipssOptions() },
          { typ: 'auswahl', id: 'i7', label: 'Nykturie:', optionen: [
            { wert: '0', text: '0x/Nacht (0)' },
            { wert: '1', text: '1x/Nacht (1)' },
            { wert: '2', text: '2x/Nacht (2)' },
            { wert: '3', text: '3x/Nacht (3)' },
            { wert: '4', text: '4x/Nacht (4)' },
            { wert: '5', text: '5x oder mehr/Nacht (5)' }
          ] },
          { typ: 'auswahl', id: 'qol', label: 'Lebensqualität dadurch:', optionen: [
            { wert: '0', text: 'Sehr zufrieden (0)' },
            { wert: '1', text: 'Zufrieden (1)' },
            { wert: '2', text: 'Überwiegend zufrieden (2)' },
            { wert: '3', text: 'Gemischt (3)' },
            { wert: '4', text: 'Überwiegend unzufrieden (4)' },
            { wert: '5', text: 'Unglücklich (5)' },
            { wert: '6', text: 'Sehr schlecht (6)' }
          ] }
        ]
      }
    ],

    auswertung: function (s) {
      var score = sum(s, ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7']);
      var text = score >= 20 ? 'Schwere LUTS/BPS-Symptomatik.' :
        score >= 8 ? 'Moderate LUTS/BPS-Symptomatik.' :
        'Leichte LUTS/BPS-Symptomatik.';
      return {
        redflag: (s.redflags || []).length > 0,
        bannerText: 'Urologisches Warnzeichen: zeitnahe ärztliche Abklärung.',
        meldungen: [{ stil: score >= 8 ? 'orange' : 'blau', titel: 'IPSS: ' + score + '/35', text: text + ' QoL: ' + num(s, 'qol') + '/6.' }]
      };
    },

    baustein: function (s) {
      var score = sum(s, ['i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7']);
      var be = 'IPSS: ' + score + '/35, QoL: ' + num(s, 'qol') + '/6. ';
      if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '.';
      return { AN: 'LUTS/BPS-Symptomscore mittels IPSS.', BE: be.trim(), TH: '', LD: '' };
    }
  });
})();
