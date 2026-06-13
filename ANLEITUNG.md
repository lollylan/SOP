# Fantasy-SOP-Demo-Framework

Dieses Repository enthaelt ein lokal laufendes Demo-Framework fuer strukturierte SOP-Oberflaechen, Checklisten, fiktive Scores und Textbausteine.

Die Inhalte sind als inoffizielle High-Fantasy-Demo gestaltet. Alle Erkrankungen, Situationen, Stoppzeichen, Scores, Werte und Codes sind frei erfunden. Sie dienen nur dazu, die technische Struktur zu zeigen. Es besteht keine Verbindung zu bestehenden Fantasy-Franchises und keine medizinische, rechtliche oder organisatorische Aussagekraft.

## Start

Datei zum Oeffnen:

```text
pcm-framework.html
```

Die App kann lokal im Browser geoeffnet werden. Die Add-ons werden aus `addons.js` geladen.

## Ordnerstruktur

```text
.
|-- pcm-framework.html          # App-Framework
|-- addons.js                   # Liste der geladenen Add-ons
|-- config/
|   |-- praxis.js               # Fantasy-Demo-Branding
|   |-- pvs-template.js         # Format des Demo-Textbausteins
|   `-- logo.png                # Logo
`-- sops/
    |-- sop-torwache.js         # Erstkontakt / Empfang
    |-- akut-*.js               # je eine akute Fantasy-SOP pro Datei
    |-- chronisch-*.js          # je eine chronische Fantasy-SOP pro Datei
    `-- score-*.js              # je ein fiktiver Score pro Datei
```

## Bereiche

- Torwache: erster fiktiver Kontakt und Demo-Stoppzeichen
- Heiler-Helfer-Sprechstunde: akute und chronische Fantasy-Faelle, in der Themenliste getrennt
- Fantasy-Scores: frei erfundene Rechner

## Eigene SOP erstellen

1. Eine Datei aus `sops/` kopieren.
2. ID, Titel, Schritte, Auswertung und Textbaustein ersetzen.
3. Die neue Datei in `addons.js` unter `sops` ergaenzen.
4. Inhalte fachlich pruefen und vor einem echten Einsatz freigeben lassen.

Beispiel in `addons.js`:

```js
window.PCM_ADDONS = {
  praxis: 'config/praxis.js',
  pvsTemplate: 'config/pvs-template.js',
  sops: [
    'sops/sop-torwache.js',
    'sops/meine-eigene-sop.js',
    'sops/mein-eigener-score.js'
  ]
};
```

Jede SOP und jeder Score liegt bewusst in einer eigenen JS-Datei. Dadurch kann ein Modul einzeln geloescht, ersetzt, versioniert oder in ein anderes Projekt uebernommen werden.

## SOP-Aufbau

Eine SOP wird mit `PCM.registerSOP({...})` registriert.

```js
PCM.registerSOP({
  id: 'eindeutige-id',
  titel: 'Titel',
  untertitel: 'Kurzbeschreibung',
  bereich: 'Heiler-Helfer-Sprechstunde',
  kategorie: 'Eigene Kategorie',
  schritte: [],
  auswertung: function (state) { return { redflag: false, meldungen: [] }; },
  baustein: function (state) { return { AN: '', BE: '', TH: '', LD: '' }; }
});
```

## Elementtypen

```js
{ typ: 'info', stil: 'rot|blau|gruen|orange|grau', titel: '...', text: '...' }
{ typ: 'sec', text: 'Zwischenueberschrift' }
{ typ: 'checkliste', id: 'redflags', stil: 'rot|gruen', items: ['...'] }
{ typ: 'auswahl', id: 'auswahl1', label: '...', optionen: [{ wert: 'a', text: 'A' }] }
{ typ: 'zahl', id: 'wert1', label: '...', einheiten: ['Demo-Einheit'], min: 0, max: 100 }
{ typ: 'textarea', id: 'notiz', label: '...', platzhalter: '...', hoehe: '70px' }
{ typ: 'tabelle', stil: 'blau|gruen', kopf: ['A', 'B'], zeilen: [{ zellen: ['...', '...'] }] }
{ typ: 'liste', items: ['...'] }
{ typ: 'split', zellen: [{ stil: 'rot', titel: '...', text: '...' }] }
{ typ: 'icd', id: 'diagnosen', items: [{ code: 'FH-A01', text: 'Fiktiver Code' }] }
```

Der Elementtyp `icd` heisst aus historischen Gruenden noch so. In dieser Demo enthaelt er nur frei erfundene Fantasy-Heilhaus-Codes.

## Live-Auswertung

`auswertung(state)` kann Hinweise und Banner zurueckgeben:

```js
return {
  redflag: true,
  bannerText: 'Stoppzeichen: Beispiel pausieren.',
  meldungen: [
    { stil: 'orange', titel: 'Hinweis', text: 'Fiktiver Demo-Hinweis.' }
  ]
};
```

Das Feld `redflag` ist nur ein technischer Schalter fuer das rote Banner. In dieser Demo bedeutet es "Stoppzeichen im Beispiel" und nicht echte medizinische Red-Flag-Logik.

## Textbaustein

`baustein(state)` erzeugt die Abschnitte fuer den Kopiertext:

```js
return {
  AN: 'Demo-Anamnese oder Eingangsbeschreibung',
  BE: 'Demo-Befund oder strukturierte Beobachtung',
  TH: 'Demo-Vorgehen',
  LD: 'FH-A01'
};
```

Format und Reihenfolge stehen in `config/pvs-template.js`.

## GitHub-Hinweis

Diese Version ist bewusst so vorbereitet, dass keine echten medizinischen SOPs, Triagefragen, Scores, Grenzwerte oder ICD-Codes enthalten sind. Wer das Framework produktiv nutzen moechte, muss die fiktiven Inhalte vollstaendig durch eigene, fachlich validierte und freigegebene Inhalte ersetzen.

Es werden keine Daten gespeichert oder versendet. Die App laeuft lokal im Browser.
