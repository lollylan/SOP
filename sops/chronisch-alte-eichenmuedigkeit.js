PCM.registerSOP({
  id: 'alte-eichenmuedigkeit',
  titel: 'Alte-Eichen-Muedigkeit',
  untertitel: 'Chronisch - langsamer Kraftverlust der Waldhueter',
  icon: 'EIC',
  farbe: '#1E8449',
  version: '1.0-fantasy',
  stand: '13.06.2026',
  bereich: 'Heiler-Helfer-Sprechstunde',
  unterbereich: 'Chronisch',
  kategorie: 'Chronische Fantasy-Erkrankungen',
  delegationshinweis: 'Fiktiver High-Fantasy-Verlaufsfall. Keine medizinische Anleitung und keine reale Verlaufskontrolle.',
  schritte: [
    { nr: 1, titel: 'Stoppzeichen und Datenschutz', rolle: 'Heilhaus-Team', rolleStil: 'red', farbe: '#C0392B', offen: true, elemente: [
      { typ: 'checkliste', id: 'redflags', stil: 'rot', items: ['Der Verlauf ist nicht als Fantasy-Demo gekennzeichnet', 'Echte personenbezogene Daten wurden eingetragen', 'Die Fallkarte enthaelt echte Diagnosen oder echte Therapiefragen', 'Die Demo-Person fordert eine reale Entscheidung'] }
    ] },
    { nr: 2, titel: 'Verlauf erfassen', rolle: 'Schreiber/in', farbe: '#2471A3', offen: true, elemente: [
      { typ: 'zahl', id: 'wochen', label: 'Dauer im Demo-Verlauf:', einheiten: ['Wochen', 'Mondlaeufe'], min: 1, max: 52 },
      { typ: 'auswahl', id: 'stabilitaet', label: 'Verlauf:', optionen: [{ wert: 'stabil', text: 'stabil im Demo-Sinn' }, { wert: 'schwankend', text: 'schwankend' }, { wert: 'zunehmend', text: 'zunehmend auffaellig' }] },
      { typ: 'checkliste', id: 'verlauf', stil: 'gruen', items: ['Morgendliche Traegheit im Rollenspiel', 'lange Rast nach kurzen Wegen', 'Eichenblatt-Marker wirkt blass', 'Waldlied wird langsamer vorgetragen'] }
    ] },
    { nr: 3, titel: 'Verlaufsplan', rolle: 'Heilhaus-Team', rolleStil: 'green', farbe: '#1E8449', elemente: [
      { typ: 'checkliste', id: 'massnahmen', stil: 'gruen', items: ['Rastplan im Szenario angepasst', 'Waldhueter-Aufgabe vereinfacht', 'Eichenblatt-Marker erneuert', 'Verlaufsrunde geplant', 'Demo-Verlaufsziel festgelegt', 'Hinweis: echte Inhalte muessen selbst validiert werden'] },
      { typ: 'icd', id: 'diagnosen', items: [{ code: 'FH-C01', text: 'Alte-Eichen-Muedigkeit Basisverlauf' }, { code: 'FH-C01V', text: 'Alte-Eichen-Muedigkeit Verlaufskontrolle' }] }
    ] }
  ],
  auswertung: function (s) {
    var stopp = (s.redflags || []).length > 0;
    var meldungen = [];
    if (s.stabilitaet === 'schwankend') meldungen.push({ stil: 'blau', titel: 'Schwankender Verlauf', text: 'Naechste Verlaufsrunde im Demo-Plan vormerken.' });
    if (s.stabilitaet === 'zunehmend') meldungen.push({ stil: 'orange', titel: 'Zunehmend auffaellig', text: 'Aeltestenrat im Fantasy-Demo einbeziehen.' });
    return { redflag: stopp, bannerText: 'Alte-Eichen-Muedigkeit: Stoppzeichen im Verlauf - Demo-Fall pausieren.', meldungen: meldungen };
  },
  baustein: function (s) {
    var w = s.wochen || {};
    var an = 'Fantasy-Demo-Verlaufskontrolle wegen Alte-Eichen-Muedigkeit. ';
    if (w.wert) an += 'Dauer: ' + w.wert + ' ' + w.einheit + '. ';
    if (s.stabilitaet) an += 'Verlauf: ' + s.stabilitaet + '. ';
    if ((s.verlauf || []).length) an += 'Verlaufsmarker: ' + s.verlauf.join('; ') + '. ';
    if ((s.redflags || []).length) an += 'Stoppzeichen: ' + s.redflags.join('; ') + '. ';
    else an += 'Keine Stoppzeichen markiert. ';
    var th = 'Fiktiver Verlaufsplan zu Alte-Eichen-Muedigkeit. ';
    if ((s.massnahmen || []).length) th += 'Dokumentiert: ' + s.massnahmen.join('; ') + '. ';
    th += 'Keine reale Handlungsempfehlung.';
    return { AN: an.trim(), TH: th.trim(), LD: (s.diagnosen || []).join('\n') };
  }
});
