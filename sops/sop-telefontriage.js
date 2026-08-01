PCM.registerSOP({
  id: 'telefontriage-basis',
  titel: 'Telefontriage',
  untertitel: 'Erstkontakt am Telefon · Red Flags · kurze PVS-Dokumentation',
  icon: '☎',
  farbe: '#C0392B',
  version: '0.1',
  stand: '13.06.2026',
  bereich: 'Telefontriage',
  kategorie: 'Telefontriage',
  delegationshinweis: 'Dieses Beispiel dient als Strukturvorlage. Notfall- und Delegationsregeln muessen praxisintern ärztlich freigegeben werden.',

  schritte: [
    {
      nr: 1, titel: 'Anliegen kurz erfassen', rolle: 'MFA/PCM · Telefon', rolleStil: 'blue', farbe: '#025669', offen: true,
      elemente: [
        { typ: 'textarea', id: 'anliegen', label: 'Freitext zum Anruf:', platzhalter: 'Was ist das Hauptproblem Seit wann Wer ruft an Rückrufnummer', hoehe: '95px' },
        { typ: 'auswahl', id: 'dringlichkeit', label: 'Eindruck am Telefon:', optionen: [
          { wert: 'stabil', text: 'stabil / sprechfähig' },
          { wert: 'unklar', text: 'unklar / braucht Rückfrage' },
          { wert: 'kritisch', text: 'kritisch / sehr krank' }
        ] }
      ]
    },
    {
      nr: 2, titel: 'Red Flags am Telefon', rolle: 'Pflicht', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'info', stil: 'rot', titel: 'Sicherheitsregel',
          text: 'Jede Red Flag bedeutet: nicht weiter selbst triagieren. Je nach Situation 112 empfehlen und/oder sofort Arzt hinzuziehen.' },
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Akute Atemnot, Zyanose, Stridor oder Sättigung < 94 % bekannt',
          'Akuter Brustschmerz, Druck/Enge, Ausstrahlung in Arm/Kiefer/Rücken oder Kaltschweißigkeit',
          'Neurologische Ausfälle: FAST positiv, Lähmung, Sprach-/Sehstörung, akute Verwirrtheit',
          'Bewusstlosigkeit, Kollaps, Krampfanfall oder nicht erweckbar',
          'Starke Blutung, schwere Verletzung, relevante Verbrennung oder Unfallmechanismus',
          'Sepsisverdacht: Fieber/Untertemperatur plus sehr krank, Schüttelfrost, Verwirrtheit oder Kreislaufprobleme',
          'Akuter starker Bauchschmerz, brettharter Bauch, Bluterbrechen oder Teerstuhl',
          'Anaphylaxiezeichen: Atemnot, Schwellung von Lippen/Zunge, Kreislaufprobleme nach Kontakt/Medikament',
          'Suizidgedanken, akute Eigen- oder Fremdgefährdung'
        ] },
        { typ: 'split', zellen: [
          { stil: 'rot', titel: 'Red Flag bejaht', text: 'Sofort Arzt hinzuziehen. Bei vitaler Bedrohung 112.' },
          { stil: 'gruen', titel: 'Keine Red Flag', text: 'Weiter nach praxisinterner Termin- und Rückrufregel.' }
        ] }
      ]
    },
    {
      nr: 3, titel: 'Vereinbartes Vorgehen', rolle: 'Dokumentation', rolleStil: 'green', farbe: '#1E8449',
      elemente: [
        { typ: 'checkliste', id: 'vorgehen', stil: 'gruen', items: [
          'Arzt sofort informiert',
          '112 / Rettungsdienst empfohlen',
          'Rückruf durch Arzt/PCM vereinbart',
          'Akuttermin heute vergeben',
          'Regulärer Termin / Selbsthilfemaßnahmen vereinbart',
          'Sicherheitsnetz erklrt: bei Verschlechterung sofort erneut melden bzw. 112'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Ergänzende Notiz:', platzhalter: 'z. B. Uhrzeit, Rückrufnummer, Name der Kontaktperson', hoehe: '70px' }
      ]
    }
  ],

  auswertung: function (s) {
    var red = (s.redflags || []).length > 0 || s.dringlichkeit === 'kritisch';
    var meldungen = [];
    if (red) {
      meldungen.push({ stil: 'rot', titel: 'Red Flag / kritischer Eindruck',
        text: 'Sofort Arzt hinzuziehen. Bei akuter vitaler Bedrohung 112 veranlassen.' });
    } else if (s.dringlichkeit === 'unklar') {
      meldungen.push({ stil: 'orange', titel: 'Unklarer Verlauf',
        text: 'Rücksprache mit Arzt oder erfahrener PCM einplanen, bevor beruhigt oder terminiert wird.' });
    }
    return {
      redflag: red,
      bannerText: 'Telefonische Red Flag oder kritischer Eindruck: Arzt hinzuziehen, ggf. 112.',
      meldungen: meldungen
    };
  },

  baustein: function (s) {
    var an = 'Telefonkontakt / Triage. ';
    if (s.anliegen) an += 'Anliegen: ' + s.anliegen.trim() + '. ';
    if (s.dringlichkeit === 'stabil') an += 'Patient am Telefon stabil und sprechfähig. ';
    if (s.dringlichkeit === 'unklar') an += 'Telefonischer Eindruck unklar, Rücksprache erforderlich. ';
    if (s.dringlichkeit === 'kritisch') an += 'Telefonischer Eindruck kritisch. ';

    var rf = s.redflags || [];
    if (rf.length) an += 'Red Flags bejaht: ' + rf.join('; ') + '. ';
    else an += 'Red-Flag-Screening am Telefon ohne bejahte Warnzeichen. ';

    var th = '';
    var vorgehen = s.vorgehen || [];
    if (vorgehen.length) th += 'Vorgehen: ' + vorgehen.join('; ') + '. ';
    if (s.notiz) th += 'Notiz: ' + s.notiz.trim() + '.';
    return { AN: an.trim(), TH: th.trim(), LD: '' };
  }
});
