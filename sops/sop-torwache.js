PCM.registerSOP({
  id: 'torwache-erstkontakt',
  titel: 'Torwache-Erstkontakt',
  untertitel: 'Fantasy-Demo - erste Einordnung am Empfang des Heilhauses',
  icon: 'TOR',
  farbe: '#7B3F00',
  version: '1.0-fantasy',
  stand: '13.06.2026',
  bereich: 'Torwache',
  kategorie: 'Empfang',
  delegationshinweis: 'Inoffizieller Fantasy-Demoinhalt mit eigenen Begriffen. Keine medizinische Anleitung und keine Verbindung zu bestehenden Fantasy-Franchises.',

  schritte: [
    {
      nr: 1, titel: 'Anliegen an der Torwache erfassen', rolle: 'Schreiber/in', rolleStil: 'blue', farbe: '#025669', offen: true,
      elemente: [
        { typ: 'textarea', id: 'anliegen', label: 'Freitext zum fiktiven Anliegen:', platzhalter: 'Wer kommt ans Tor? Aus welcher Gegend? Welche fantastische Lage wird geschildert?', hoehe: '95px' },
        { typ: 'auswahl', id: 'eindruck', label: 'Eindruck im Demo-Fall:', optionen: [
          { wert: 'ruhig', text: 'ruhig / geordnete Erzaehlung' },
          { wert: 'unklar', text: 'unklar / Fallkarte pruefen' },
          { wert: 'stopp', text: 'Stoppzeichen / Aeltestenrat einschalten' }
        ] }
      ]
    },
    {
      nr: 2, titel: 'Stoppzeichen der Torwache', rolle: 'Pflicht im Demo-Ablauf', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'info', stil: 'rot', titel: 'Demo-Regel',
          text: 'Jedes Stoppzeichen bedeutet nur: Beispiel pausieren, Fallkarte pruefen und Freigabe durch die Demo-Leitung einholen.' },
        { typ: 'checkliste', id: 'redflags', stil: 'rot', items: [
          'Der Fall ist nicht eindeutig als Fantasy-Demo gekennzeichnet',
          'Die Erzaehlung enthaelt echte personenbezogene Daten',
          'Die Person bittet um eine reale medizinische, rechtliche oder finanzielle Entscheidung',
          'Die Fallkarte nennt eine echte Erkrankung oder echte Gefahr',
          'Der Herkunftsort fehlt oder passt nicht zur Uebungsmappe',
          'Die Demo-Gruppe ist sich ueber die Rolle der Torwache uneinig'
        ] },
        { typ: 'split', zellen: [
          { stil: 'rot', titel: 'Stoppzeichen', text: 'Fall pausieren und Demo-Leitung einbeziehen.' },
          { stil: 'gruen', titel: 'Kein Stoppzeichen', text: 'Zur akuten oder chronischen Fantasy-Sprechstunde weiterleiten.' }
        ] }
      ]
    },
    {
      nr: 3, titel: 'Weiterleitung dokumentieren', rolle: 'Schreiber/in', rolleStil: 'green', farbe: '#1E8449',
      elemente: [
        { typ: 'checkliste', id: 'vorgehen', stil: 'gruen', items: [
          'Akute Fantasy-Sprechstunde gewaehlt',
          'Chronische Fantasy-Sprechstunde gewaehlt',
          'Score-Bereich zur Demonstration geoeffnet',
          'Fallkarte neu ausgegeben',
          'Demo-Charakter erklaert',
          'Hinweis dokumentiert: echte Inhalte muessen selbst erstellt und freigegeben werden'
        ] },
        { typ: 'textarea', id: 'notiz', label: 'Torwache-Notiz:', platzhalter: 'z. B. Fallkarte, Runde, Uebungsperson, Rueckfrage', hoehe: '70px' }
      ]
    }
  ],

  auswertung: function (s) {
    var stopp = (s.redflags || []).length > 0 || s.eindruck === 'stopp';
    var meldungen = [];
    if (stopp) {
      meldungen.push({ stil: 'rot', titel: 'Stoppzeichen an der Torwache',
        text: 'Demo-Fall pausieren und Freigabe einholen. Keine reale Empfehlung ableiten.' });
    } else if (s.eindruck === 'unklar') {
      meldungen.push({ stil: 'orange', titel: 'Fallkarte unklar',
        text: 'Herkunft, Kategorie und Uebungsziel im Team pruefen.' });
    }
    return {
      redflag: stopp,
      bannerText: 'Torwache-Stoppzeichen: Beispiel pausieren und Demo-Freigabe einholen.',
      meldungen: meldungen
    };
  },

  baustein: function (s) {
    var an = 'Torwache-Erstkontakt im Fantasy-Demo-Heilhaus. ';
    if (s.anliegen) an += 'Anliegen: ' + s.anliegen.trim() + '. ';
    if (s.eindruck === 'ruhig') an += 'Eindruck ruhig und geordnet. ';
    if (s.eindruck === 'unklar') an += 'Fallkarte unklar, Rueckfrage geplant. ';
    if (s.eindruck === 'stopp') an += 'Stoppzeichen im Ersteindruck. ';
    if ((s.redflags || []).length) an += 'Stoppzeichen: ' + s.redflags.join('; ') + '. ';
    else an += 'Keine Stoppzeichen markiert. ';

    var th = '';
    if ((s.vorgehen || []).length) th += 'Weiterleitung: ' + s.vorgehen.join('; ') + '. ';
    if (s.notiz) th += 'Notiz: ' + s.notiz.trim() + '.';
    return { AN: an.trim(), TH: th.trim(), LD: '' };
  }
});
