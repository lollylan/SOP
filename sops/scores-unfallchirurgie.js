PCM.registerSOP({
  id: 'score-ottawa-ankle',
  titel: '🔩 Ottawa Ankle Rules',
  untertitel: 'Röntgen nötig · Stiell 1992 · MDCalc',
  icon: '🔩',
  farbe: '#6E2C00',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'Unfallchirurgie',
  delegationshinweis: 'Entscheidungshilfe für Sprunggelenk-/Mittelfuß-Trauma. Nicht anwenden bei Ausschlusskriterien; Röntgenentscheidung ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'Ausschluss / Warnzeichen', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Offene Fraktur, Fehlstellung, neurovaskuläres Defizit oder Ischämiezeichen',
          'Polytrauma, Kopfverletzung/Intoxikation oder Anamnese nicht sicher',
          'Alter < 6 Jahre, Schwangerschaft oder relevante Sensibilitätsstörung',
          'Wunde/Infektzeichen oder bereits bekannte Fraktur'
        ] }
      ]
    },
    {
      nr: 2, titel: 'Ottawa-Kriterien', rolle: 'Score', farbe: '#6E2C00', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'ankle', stil: 'gruen', items: [
          'Schmerz in Malleolenzone',
          'Druckschmerz hintere Kante/Spitze lateraler Malleolus',
          'Druckschmerz hintere Kante/Spitze medialer Malleolus',
          'Unfähigkeit, direkt nach Trauma und jetzt 4 Schritte zu gehen'
        ] },
        { typ: 'checkliste', id: 'foot', stil: 'gruen', items: [
          'Schmerz in Mittelfußzone',
          'Druckschmerz Basis Os metatarsale V',
          'Druckschmerz Os naviculare',
          'Unfähigkeit, direkt nach Trauma und jetzt 4 Schritte zu gehen'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Kontext:', platzhalter: 'Unfallmechanismus, Schwellung, Belastbarkeit, neurovaskulärer Status', hoehe: '75px' }
      ]
    }
  ],

  auswertung: function (s) {
    var ankle = s.ankle || [];
    var foot = s.foot || [];
    var ankleXray = ankle.indexOf('Schmerz in Malleolenzone') !== -1 && ankle.length >= 2;
    var footXray = foot.indexOf('Schmerz in Mittelfußzone') !== -1 && foot.length >= 2;
    var text = ankleXray || footXray ? 'Röntgen nach Ottawa-Regeln indiziert bzw. ärztlich zu veranlassen.' :
      'Keine Ottawa-Indikation dokumentiert; klinische Bewertung bleibt entscheidend.';
    return {
      redflag: (s.redflags || []).length > 0,
      bannerText: 'Trauma-Warnzeichen/Ausschlusskriterium: sofort ärztlich klären.',
      meldungen: [{ stil: ankleXray || footXray ? 'orange' : 'blau', titel: 'Ottawa Ankle Rules', text: text }]
    };
  },

  baustein: function (s) {
    var ankle = s.ankle || [];
    var foot = s.foot || [];
    var be = 'Ottawa Ankle Rules dokumentiert. ';
    if (ankle.length) be += 'Sprunggelenk: ' + ankle.join('; ') + '. ';
    if (foot.length) be += 'Mittelfuß: ' + foot.join('; ') + '. ';
    if ((s.redflags || []).length) be += 'Ausschluss/Warnzeichen: ' + s.redflags.join('; ') + '. ';
    if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
    return { AN: 'Sprunggelenk-/Mittelfuß-Trauma nach Ottawa-Regeln erfasst.', BE: be.trim(), TH: '', LD: '' };
  }
});
