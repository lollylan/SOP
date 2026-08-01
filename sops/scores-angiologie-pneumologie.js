PCM.registerSOP({
  id: 'score-wells-dvt',
  titel: '🦵 Wells DVT',
  untertitel: 'Tiefe Venenthrombose · Wells 1997 · MDCalc',
  icon: '🦵',
  farbe: '#154360',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Angiologie / Pneumologie',
  delegationshinweis: 'Klinische Vortestwahrscheinlichkeit. Diagnostik mit D-Dimer/Sonographie und Antikoagulation nur ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'Akute Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Dyspnoe, Thoraxschmerz, Hämoptysen oder Synkope',
          'Kreislaufinstabilität oder SpO2 erniedrigt',
          'Massive Beinschwellung, Ischämiezeichen oder starke Schmerzen'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Wells-DVT-Kriterien', rolle: 'Score', farbe: '#154360', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'plus', stil: 'gruen', items: [
          'Aktiver Krebs / Therapie in letzten 6 Monaten / palliativ (+1)',
          'Lähmung/Parese oder Immobilisation der unteren Extremität (+1)',
          'Bettruhe > 3 Tage oder grosse OP in den letzten 12 Wochen (+1)',
          'Druckschmerz entlang tiefer Venen (+1)',
          'Ganzes Bein geschwollen (+1)',
          'Wadendifferenz > 3 cm (+1)',
          'Eindrückbares Ödem nur am symptomatischen Bein (+1)',
          'Kollateralvenen, nicht varikös (+1)',
          'Frühere dokumentierte TVT (+1)'
        ] },
        { typ: 'checkliste', id: 'minus', stil: 'gruen', items: [
          'Alternative Diagnose mindestens ebenso wahrscheinlich (-2)'
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.plus || []).length - 2 * (s.minus || []).length;
    var text = score >= 2 ? 'TVT wahrscheinlich nach 2-Stufen-Modell.' : 'TVT unwahrscheinlich nach 2-Stufen-Modell.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'PE-/Ischämie-/Instabilitätszeichen: sofort ärztlich/notfallmedizinisch klären.',
      meldungen: [{ stil: score >= 2 ? 'orange' : 'blau', titel: 'Wells DVT: ' + score + ' Punkt(e)', text: text }]
    };
  },

  baustein: function (s) {
    var score = (s.plus || []).length - 2 * (s.minus || []).length;
    var be = 'Wells DVT: ' + score + ' Punkt(e). ';
    if ((s.plus || []).length) be += 'Positive Kriterien: ' + s.plus.join('; ') + '. ';
    if ((s.minus || []).length) be += 'Alternative Diagnose: ' + s.minus.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'TVT-Vortestwahrscheinlichkeit mittels Wells DVT erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-wells-pe',
  titel: '🫁 Wells PE',
  untertitel: 'Lungenembolie · Wells 2000 · MDCalc',
  icon: '🫁',
  farbe: '#1B4F72',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Angiologie / Pneumologie',
  delegationshinweis: 'Klinische Vortestwahrscheinlichkeit. Notfallzeichen, D-Dimer/CTPA und Therapie ärztlich entscheiden.',

  schritte: [
    {
      nr: 1, titel: 'Instabilität / Notfallzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Synkope, Schock, Hypotonie oder schwere Dyspnoe',
          'SpO2 erniedrigt, Zyanose oder Tachypnoe in Ruhe',
          'Thoraxschmerz mit Instabilität oder Hämoptysen'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Wells-PE-Kriterien', rolle: 'Score', farbe: '#1B4F72', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'plus3', stil: 'gruen', items: [
          'Klinische Zeichen einer TVT (+3)',
          'Andere Diagnose weniger wahrscheinlich als PE (+3)'
        ] },
        { typ: 'checkliste', id: 'plus15', stil: 'gruen', items: [
          'Herzfrequenz > 100/min (+1,5)',
          'Immobilisation oder OP in den letzten 4 Wochen (+1,5)',
          'Frühere TVT/PE (+1,5)'
        ] },
        { typ: 'checkliste', id: 'plus1', stil: 'gruen', items: [
          'Hämoptysen (+1)',
          'Malignom aktiv/letzte 6 Monate/palliativ (+1)'
        ] }
      ]
    }
  ],

  auswertung: function (s) {
    var score = 3 * (s.plus3 || []).length + 1.5 * (s.plus15 || []).length + (s.plus1 || []).length;
    var text = score > 4 ? 'PE wahrscheinlich nach 2-Stufen-Modell.' : 'PE unwahrscheinlich nach 2-Stufen-Modell.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'Instabile mögliche PE: sofortiger Notfallpfad.',
      meldungen: [{ stil: score > 4 ? 'orange' : 'blau', titel: 'Wells PE: ' + score + ' Punkt(e)', text: text }]
    };
  },

  baustein: function (s) {
    var score = 3 * (s.plus3 || []).length + 1.5 * (s.plus15 || []).length + (s.plus1 || []).length;
    var pos = (s.plus3 || []).concat(s.plus15 || []).concat(s.plus1 || []);
    var be = 'Wells PE: ' + score + ' Punkt(e). ';
    if (pos.length) be += 'Positive Kriterien: ' + pos.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Warnzeichen: ' + s.redflags.join('; ') + '.';
    return { AN: 'PE-Vortestwahrscheinlichkeit mittels Wells PE erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});
