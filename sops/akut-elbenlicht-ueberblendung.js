PCM.registerSOP({
  id: 'elbenlicht-ueberblendung',
  titel: 'Elbenlicht-Ueberblendung',
  untertitel: 'Akut - zu viel Licht aus der Waldlaterne',
  icon: 'ELB',
  farbe: '#1F7A6D',
  version: '1.0-fantasy',
  stand: '13.06.2026',
  bereich: 'Heiler-Helfer-Sprechstunde',
  unterbereich: 'Akut',
  kategorie: 'Akute Fantasy-Erkrankungen',
  delegationshinweis: 'Fiktiver High-Fantasy-Demofall. Keine reale Handlungsempfehlung.',
  schritte: [
    { nr: 1, titel: 'Stoppzeichen pruefen', rolle: 'Heilhaus-Team', rolleStil: 'red', farbe: '#C0392B', offen: true, elemente: [
      { typ: 'checkliste', id: 'redflags', stil: 'rot', items: ['Der Fall ist nicht eindeutig als Fantasy-Demo gekennzeichnet', 'Echte personenbezogene Daten wurden eingetragen', 'Die Uebungsperson bittet um eine reale Entscheidung', 'echte Seheinschraenkung wird genannt', 'Lichtquelle ist real zu hell statt Demo-Marker'] }
    ] },
    { nr: 2, titel: 'Fallmarker erfassen', rolle: 'Schreiber/in', farbe: '#2471A3', offen: true, elemente: [
      { typ: 'zahl', id: 'dauer', label: 'Dauer im Rollenspiel:', einheiten: ['Stunden', 'Tage'], min: 1, max: 30 },
      { typ: 'auswahl', id: 'intensitaet', label: 'Ausgestaltung:', optionen: [{ wert: 'leicht', text: 'leicht - Randnotiz' }, { wert: 'mittel', text: 'mittel - Szene praegt den Fall' }, { wert: 'stark', text: 'stark - Freigabe ratsam' }] },
      { typ: 'checkliste', id: 'signale', stil: 'gruen', items: ['silberner Lichtmarker aktiv', 'Fallkarte beschreibt helle Waldlaterne', 'Uebungsperson kneift im Rollenspiel die Augen zusammen', 'Sternenstaub-Feld angekreuzt'] }
    ] },
    { nr: 3, titel: 'Beobachtung und Demo-Vorgehen', rolle: 'Heilhaus-Team', rolleStil: 'green', farbe: '#1E8449', elemente: [
      { typ: 'checkliste', id: 'massnahmen', stil: 'gruen', items: ['Lichtmarker auf Demo gesetzt', 'Waldlaterne symbolisch gedimmt', 'Ruhebank im Rollenspiel angeboten', 'Kontrollkarte fuer naechste Runde ausgegeben', 'Demo-Charakter erklaert', 'Hinweis: reale Inhalte muessen durch eigene SOPs ersetzt werden'] },
      { typ: 'icd', id: 'diagnosen', items: [{ code: 'FH-A04', text: 'Elbenlicht-Ueberblendung Basisfall' }, { code: 'FH-A04B', text: 'Elbenlicht-Ueberblendung mit Ratsfreigabe' }] }
    ] }
  ],
  auswertung: function (s) {
    var stopp = (s.redflags || []).length > 0;
    var meldungen = [];
    if ((s.signale || []).length < 2 && !stopp) meldungen.push({ stil: 'blau', titel: 'Wenige Fallmarker', text: 'Fallkarte ergaenzen oder Szenario nachfragen.' });
    if (s.intensitaet === 'stark') meldungen.push({ stil: 'orange', titel: 'Starke Ausgestaltung', text: 'Ratsfreigabe im Demo-Ablauf einplanen.' });
    return { redflag: stopp, bannerText: 'Elbenlicht-Ueberblendung: Stoppzeichen markiert - Demo-Fall pausieren.', meldungen: meldungen };
  },
  baustein: function (s) {
    var d = s.dauer || {};
    var an = 'Fantasy-Demo-Akutkontakt wegen Elbenlicht-Ueberblendung. ';
    if (d.wert) an += 'Dauer im Rollenspiel: ' + d.wert + ' ' + d.einheit + '. ';
    if (s.intensitaet) an += 'Ausgestaltung: ' + s.intensitaet + '. ';
    if ((s.signale || []).length) an += 'Fallmarker: ' + s.signale.join('; ') + '. ';
    if ((s.redflags || []).length) an += 'Stoppzeichen: ' + s.redflags.join('; ') + '. ';
    else an += 'Keine Stoppzeichen markiert. ';
    var th = 'Demo-Vorgehen zu Elbenlicht-Ueberblendung. ';
    if ((s.massnahmen || []).length) th += 'Dokumentiert: ' + s.massnahmen.join('; ') + '. ';
    th += 'Keine reale Handlungsempfehlung.';
    return { AN: an.trim(), TH: th.trim(), LD: (s.diagnosen || []).join('\n') };
  }
});
