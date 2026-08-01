PCM.registerSOP({
  id: 'score-centor-mcisaac',
  titel: '🦷 Centor / McIsaac',
  untertitel: 'AB bei Halsschmerzen · McIsaac 1998',
  icon: '🦷',
  farbe: '#7D3C98',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'HNO',
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
        ] },
        { typ: 'textarea', id: 'kontext', label: 'Klinischer Kontext / Notiz:', platzhalter: 'z. B. Halsschmerzen seit 2 Tagen, kein Dyspnoezeichen', hoehe: '70px' }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.kriterien || []).length;
    if (s.alter === 'kind') score += 1;
    if (s.alter === 'older') score -= 1;
    var text = score <= 1 ? 'Niedrige Wahrscheinlichkeit; meist symptomatisches Vorgehen.' :
      score === 2 ? 'Mittlere Wahrscheinlichkeit; Test/CRP ärztlich erwägen.' :
      score === 3 ? 'Erhöhte Wahrscheinlichkeit; ärztliche Bewertung/Test sinnvoll.' :
      'Hohe Wahrscheinlichkeit; ärztliche Bewertung erforderlich.';
    return { redflag: false, meldungen: [{ stil: score >= 3 ? 'orange' : 'blau', titel: 'Centor/McIsaac: ' + score + ' Punkt(e)', text: text }] };
  },

  baustein: function (s) {
    var score = (s.kriterien || []).length;
    if (s.alter === 'kind') score += 1;
    if (s.alter === 'older') score -= 1;
    var be = 'Centor/McIsaac: ' + score + ' Punkt(e). ';
    if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
    if (s.alter) be += 'Altersgruppe: ' + (s.alter === 'kind' ? '3-14 Jahre' : s.alter === 'older' ? '45 Jahre oder älter' : '15-44 Jahre') + '. ';
    if (s.kontext) be += 'Kontext: ' + s.kontext.trim() + '.';
    return { AN: 'Score-Dokumentation bei Halsschmerzen.', BE: be.trim(), TH: '', LD: '' };
  }
});

PCM.registerSOP({
  id: 'score-feverpain',
  titel: '🌡️ FeverPAIN',
  untertitel: 'AB bei Pharyngitis · Little 2013',
  icon: '🌡️',
  farbe: '#9A7D0A',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Scores',
  kategorie: 'Scores',
  unterbereich: 'HNO',
  delegationshinweis: 'Score-Rechner als Dokumentationshilfe. Antibiotika- und Testentscheidungen erfolgen ärztlich.',

  schritte: [
    {
      nr: 1, titel: 'FeverPAIN-Kriterien', rolle: 'Score', farbe: '#9A7D0A', offen: true,
      elemente: [
        { typ: 'checkliste', id: 'kriterien', stil: 'gruen', items: [
          'Fever: Fieber in den letzten 24 Stunden',
          'Purulence: Eitrige Tonsillenbeläge',
          'Attend rapidly: Vorstellung innerhalb von 3 Tagen nach Symptombeginn',
          'Inflamed tonsils: Stark entzündete Tonsillen',
          'No cough/coryza: Kein Husten oder Schnupfen'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Kontext:', platzhalter: 'Symptombeginn, Red Flags, Allergien, Vorbehandlung', hoehe: '70px' }
      ]
    }
  ],

  auswertung: function (s) {
    var score = (s.kriterien || []).length;
    var text = score <= 1 ? 'Niedrige Streptokokkenwahrscheinlichkeit.' :
      score <= 3 ? 'Intermediärer Bereich; Test/Verlauf ärztlich abwägen.' :
      'Höhere Wahrscheinlichkeit; ärztliche Bewertung sinnvoll.';
    return { redflag: false, meldungen: [{ stil: score >= 4 ? 'orange' : 'blau', titel: 'FeverPAIN: ' + score + '/5', text: text }] };
  },

  baustein: function (s) {
    var score = (s.kriterien || []).length;
    var be = 'FeverPAIN: ' + score + '/5. ';
    if ((s.kriterien || []).length) be += 'Positive Kriterien: ' + s.kriterien.join('; ') + '. ';
    if (s.notiz) be += 'Kontext: ' + s.notiz.trim() + '.';
    return { AN: 'Pharyngitis-Score FeverPAIN dokumentiert.', BE: be.trim(), TH: '', LD: '' };
  }
});
