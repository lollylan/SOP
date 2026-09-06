# Asklaion SOP

Ein **Dokumentations- und Vorlagenwerkzeug** für die hausärztliche Versorgung:
klickbare Erfassungsmasken, Checklisten, strukturierte Dokumentationsmodule und
kopierfertige Textbausteine für das Praxisverwaltungssystem.

Alles läuft als **statische Webseite** – ohne Server, ohne Datenbank, ohne Installation.
Es werden keine Patientendaten gespeichert oder versendet; die Anwendung arbeitet
vollständig lokal im Browser. (Einzige Ausnahme: Die Untersuchungsvideos im
Orthopädie-Modul werden bei Klick von YouTube nachgeladen.)

**→ Zum Ausprobieren: https://lollylan.github.io/SOP/**

> ### ⚠️ Zweckbestimmung
>
> Dieses Programm ist ein **reines Dokumentations- und Vorlagenwerkzeug**. Es trifft
> keine Aussage zu Diagnose, Therapie oder Dringlichkeit, berechnet keine Scores und
> gibt keine Handlungsempfehlungen. **Es ist kein Medizinprodukt** im Sinne der MDR
> (Verordnung (EU) 2017/745) und wird nicht als solches in Verkehr gebracht.
>
> Warum das so ist und wie es technisch sichergestellt wird, steht unten unter
> [Warum das hier kein Medizinprodukt ist](#warum-das-hier-kein-medizinprodukt-ist).
> Die verbindliche Fassung ist **[`ZWECKBESTIMMUNG.md`](ZWECKBESTIMMUNG.md)** –
> bitte vor jeder Änderung lesen.

> **Die Module sind Strukturvorlagen.** Jede Praxis muss sie an ihre eigenen Abläufe,
> Delegationsregeln und Freigaben anpassen, fachlich validieren und vor dem Einsatz
> ärztlich freigeben. Sie sind keine medizinische oder rechtliche Handlungsempfehlung.

---

## Warum das hier kein Medizinprodukt ist

Diese Frage ist für ein Werkzeug, das in einer Arztpraxis benutzt wird, nicht akademisch.
Deshalb hier ausführlich, worauf es ankommt und warum dieses Programm die Grenze bewusst
nicht überschreitet.

### Worauf es rechtlich ankommt

Nach **Art. 2 Nr. 1 MDR** ist Software ein Medizinprodukt, wenn sie vom Hersteller für einen
medizinischen Zweck bestimmt ist – Diagnose, Verhütung, Überwachung, Vorhersage, Prognose,
Behandlung oder Linderung von Krankheiten. Die Auslegungsleitlinie **MDCG 2019-11**
präzisiert, wo die Grenze verläuft:

> Software ist ein Medizinprodukt, wenn sie über Speichern, Archivieren, Kommunizieren,
> einfache Suche und verlustfreie Kompression hinaus eine **Aktion auf Daten ausführt** und
> daraus **für einen einzelnen Patienten neue medizinische Information erzeugt**.

Daraus folgt beides:

- **Kein Medizinprodukt** sind digitale Nachschlagewerke und Lehrbücher, Bildatlanten,
  Formulare und strukturierte Dokumentationsvorlagen sowie Software, die schlicht wiedergibt,
  was ein Mensch eingetragen hat.
- **Medizinprodukt** – und nach **Anhang VIII Regel 11** typischerweise mindestens Klasse IIa –
  ist Software, die Eingaben verrechnet, mit Grenzwerten vergleicht, einstuft, daraus
  Verdachtsdiagnosen oder Dringlichkeiten ableitet oder Handlungsempfehlungen ausgibt.

Wichtig für alle, die dieses Programm weitergeben wollen: Die **Eigenherstellungs-Ausnahme
nach Art. 5 Abs. 5 MDR** gilt nur, solange eine Gesundheitseinrichtung ein Produkt für sich
selbst herstellt und ausschließlich selbst nutzt. Sobald es an andere Praxen weitergegeben
wird, greift sie nicht mehr. **Dass Software kostenlos und quelloffen ist, ändert daran
nichts.**

### Was dieses Programm tut – und was nicht

| Das Programm tut | Das Programm tut ausdrücklich **nicht** |
|---|---|
| Auswahllisten, Messfelder und Freitextfelder anzeigen | Eingaben verrechnen, gewichten oder einstufen |
| Nachschlagetexte und Referenzbilder anzeigen | Messwerte gegen Grenzwerte prüfen |
| festhalten, was die anwendende Person ausgewählt und gemessen hat | Verdachtsdiagnosen oder ICD-Codes ableiten |
| daraus einen Fließtext für die Karteikarte bauen | Scores oder Risikowerte berechnen |
| die selbst geschriebene Beurteilung unverändert übernehmen | Warnungen, Red Flags oder Dringlichkeiten ausgeben |
| | Handlungs- oder Therapieempfehlungen aussprechen |

Ein Beispiel aus dem EKG-Modul. Eingetragen werden Herzfrequenz 42/min, PQ 240 ms, QRS 160 ms,
QTc 530 ms und eine ST-Streckenhebung in II, III und aVF. Heraus kommt genau das:

```text
Normofrequenter Sinusrhythmus, Herzfrequenz 42/min, regelmäßig. Indifferenztyp
(+30° bis +60°). Regelrechte P-Wellen. PQ-Zeit 240 ms. QRS-Breite 160 ms.
Signifikante ST-Streckenhebung in II, III, aVF. Unauffällige T-Wellen.
QTc-Zeit 530 ms. Beurteilung: [was Sie selbst geschrieben haben]
```

Kein Wort zur Bedeutung dieser Konstellation, keine Einstufung der Messwerte, kein
Diagnosecode, kein Procedere. Das Programm hält fest, was Sie gesehen haben. Was es bedeutet,
sagen Sie.

### Technisch durchgesetzt, nicht nur behauptet

Eine Zweckbestimmung, die nur im README steht, ist wenig wert. Diese ist in der Software
verankert:

- **Die Engine hat keine Auswertungsschnittstelle.** Ein Modul *kann* keine Bewertung, keinen
  Score und keine Meldung an die Oberfläche zurückgeben – der Rückgabeweg existiert nicht.
  Das ist kein Versäumnis, sondern der Kern des Konzepts.
- **Es gibt kein Red-Flag-Banner und kein Meldungs-Panel.** Beides wurde vollständig
  ausgebaut.
- **`baustein()` gibt ausschließlich wieder, was eingetragen wurde.** Das Programm ergänzt
  keine Einordnung, keine Bewertung, keinen Code.
- **Die Zweckbestimmung steht in jeder Fußzeile** und ist über die Praxis-Konfiguration
  `config/praxis.js` **nicht überschreibbar**. Sie kann also nicht versehentlich beim
  Umbranden verloren gehen.

### Was dafür entfernt wurde

Frühere Fassungen dieses Programms enthielten Funktionen, die diese Grenze überschritten
haben. Sie wurden am **06.09.2026** entfernt:

| Entfernt | Warum |
|---|---|
| Rund 30 Score-Rechner (CHA₂DS₂-VASc, HAS-BLED, Wells, PHQ-9, CRB-65, Ottawa u. a.) | Risikoberechnung mit Einstufung |
| Telefontriage mit Red-Flag-Abfrage | automatisierte Dringlichkeitsbewertung |
| Dermatoskopie mit ABCD-Score | Melanomverdacht ab einem Punktwert |
| EKG-Beurteilungsmotor | erzeugte automatisch Beurteilungen inklusive Ischämie- und STEMI-Verdacht |
| Grenzwertprüfungen (PQ, QRS, QTc, Aorta 5,5 cm, Schilddrüsenvolumen 25 ml) | Einstufung von Messwerten |
| Ableitung der Infarktlokalisation aus den EKG-Ableitungen | anatomische Schlussfolgerung |
| Automatische ICD-Zuordnung (38 Codes) | abgeleitete, kodierte Diagnose |

Die Module **EKG**, **Sonographie Abdomen** und **Sonographie Schilddrüse** sind erhalten
geblieben, aber auf reine Befunddokumentation zurückgebaut. Score-Rechner, Telefontriage und
der dermatoskopische ABCD-Score sind ganz entfallen.

### Wenn Sie das Programm erweitern

Das Programm ist ausdrücklich dazu gedacht, mit eigenen Inhalten gefüllt zu werden. Dabei gilt
eine Grenze:

> Wer Funktionen ergänzt, die Eingaben **bewerten** – Scores, Grenzwertprüfungen,
> Verdachtsdiagnosen, abgeleitete ICD-Codes, Warnungen, Red Flags oder Handlungsempfehlungen –
> **ändert die Zweckbestimmung**. Das so entstandene Produkt kann ein Medizinprodukt sein, mit
> den vollen Pflichten eines Herstellers: Konformitätsbewertung, technische Dokumentation,
> CE-Kennzeichnung, Marktüberwachung, Vigilanz.
>
> **Diese Verantwortung trifft ausschließlich denjenigen, der die Änderung vornimmt und das
> Ergebnis bereitstellt** – nicht den Urheber dieses Grundgerüsts.

Statische Sicherheits- und Nachschlagetexte sind unproblematisch, solange sie unabhängig von
den Eingaben immer gleich angezeigt werden. Sobald ein Text erscheint, *weil* jemand etwas
Bestimmtes eingetragen hat, ist die Grenze überschritten.

### Einordnung in eigener Sache

Das ist die begründete Einschätzung des Autors, keine behördliche Feststellung und keine
Rechtsberatung. Wer dieses Programm in größerem Rahmen verteilen oder mit eigenen Inhalten in
Verkehr bringen möchte, sollte die Zweckbestimmung des eigenen Ergebnisses selbst prüfen
lassen.

---

## Für Anwenderinnen und Anwender

**Eine bebilderte Schritt-für-Schritt-Anleitung – herunterladen, anpassen, in der Praxis
einsetzen – finden Sie auf [asklaion.de](https://www.asklaion.de).**

Wenn Sie es nur kurz ansehen möchten, genügt der Demo-Link oben. Für den eigenen
Einsatz laden Sie das Paket herunter:

1. Oben auf dieser Seite auf den grünen Knopf **`Code`** klicken.
2. **`Download ZIP`** wählen.
3. Das heruntergeladene Archiv entpacken.
4. Die Datei **`pcm-framework.html`** doppelklicken – sie öffnet sich im Browser.

Fertig. Es ist keine Installation nötig, und die Anwendung funktioniert auch ohne
Internetverbindung.

Was Sie anschließend typischerweise anpassen:

| Was | Wo |
|---|---|
| Praxisname, Farben, Logo, Fußzeile | `config/praxis.js` |
| Aufbau der Textbausteine (AN, BE, TH, LD …) | `config/pvs-template.js` |
| Welche SOPs geladen werden | `addons.js` |
| Die SOPs selbst | Dateien im Ordner `sops/` |

Diese Dateien lassen sich mit jedem Texteditor öffnen. **Wie das im Einzelnen geht,
steht ausführlich auf [asklaion.de](https://www.asklaion.de)** – dort wird auch erklärt,
worauf Sie bei eigenen Inhalten achten müssen.

### Was ist enthalten?

- **Startseite** – Kurzüberblick und Bildnachweise
- **PCM-Sprechstunde** – Strukturplatzhalter für Akutanlässe und Chroniker *(Inhalte folgen)*
- **Hitze-Medikation** *(Inhalt folgt)*
- **Patientenaufklärungen** – Deximed-Verweise
- **Dermatologie** – Effloreszenzen: strukturierte Beschreibung eines Hautbefundes
  (reines Beschreibungs- und Nachschlagemodul, keine Diagnosestellung)
- **Sonographie** – strukturierte Befunddokumentation Abdomen und Schilddrüse, mit
  Referenzbildern des Sonographie-Atlas (Immanuel Albertinen Diakonie)
- **Orthopädie** – Gelenkuntersuchung, Neutral-Null-Dokumentation, Funktionstests
- **EKG** – strukturierte Befunddokumentation: Rhythmus, Lagetyp, P/PQ/QRS/ST/T

Die mit *(Inhalt folgt)* markierten Bereiche sind bewusst leer: Für diese Inhalte liegen
die Einverständniserklärungen der Rechteinhaber noch nicht vor. Die Struktur bleibt
sichtbar, damit erkennbar ist, wo eigene Inhalte ergänzt werden.

> **Hinweis zum Funktionsumfang.** Alle bewertenden Funktionen wurden entfernt:
> Score-Rechner, Telefontriage und der dermatoskopische ABCD-Score sind **ganz
> entfallen**. Die Sonographie- und EKG-Module sind erhalten geblieben, aber auf
> **reine Befunddokumentation** zurückgebaut — ohne automatische Beurteilung, ohne
> Grenzwertprüfung, ohne abgeleitete Diagnosen, ICD-Codes oder Handlungsempfehlungen.
>
> Konkret heißt das: Sie halten fest, was Sie gesehen und gemessen haben, und erzeugen
> daraus einen Befundtext. Die Beurteilung formulieren Sie selbst; sie wird unverändert
> übernommen. Siehe [`ZWECKBESTIMMUNG.md`](ZWECKBESTIMMUNG.md).

---

## Für technisch Versierte

### Architektur

Eine Engine, beliebig viele Add-ons. `pcm-framework.html` enthält die komplette Engine
(Rendering, State, Textbaustein-Erzeugung) und wird **nicht pro Praxis angepasst**.
Die Engine besitzt **bewusst keine Auswertungsschnittstelle**: Ein Modul kann keine
Bewertung, keinen Score und keine Meldung an die Oberfläche zurückgeben. Jede SOP ist eine eigenständige JS-Datei, die sich beim Laden selbst
registriert:

```js
PCM.registerSOP({
  id: 'beispiel',
  titel: 'Beispiel-SOP',
  bereich: 'PCM-Sprechstunde',     // Spalte 1 der Navigation
  unterbereich: 'Akutanlaesse',    // Gruppierung
  kategorie: 'Infektiologie',      // Fachbereich
  schritte: [ /* Elemente: info, checkliste, auswahl, zahl, tabelle, icd, html … */ ],
  baustein:   function (state) { /* { AN, BE, TH, LD } für das PVS — gibt nur wieder,
                                   was eingetragen wurde; keine Bewertung */ }
});
```

Neue Datei in `sops/` ablegen, Pfad in `addons.js` unter `sops` eintragen – fertig.
Die vollständige Referenz aller Elementtypen, der Live-Auswertung und des Baustein-Formats
steht in **[`ANLEITUNG.md`](ANLEITUNG.md)**.

Add-ons werden bewusst als `.js` geladen und nicht als `.json`: Beim Öffnen per Doppelklick
(`file://`) blockieren Browser das Nachladen von Text- und JSON-Dateien per `fetch`,
selbstregistrierende Skripte sind davon nicht betroffen.

### Projektstruktur

```text
.
├── index.html                  # Weiterleitung auf die App (für GitHub Pages)
├── pcm-framework.html          # die Engine – enthält die komplette Anwendung
├── addons.js                   # Manifest: welche Module geladen werden
├── ANLEITUNG.md                # Referenz zum Schreiben eigener SOPs
├── ZWECKBESTIMMUNG.md          # wofür das Programm bestimmt ist – und wofür nicht
├── .nojekyll                   # schaltet die Jekyll-Verarbeitung auf Pages ab
├── config/
│   ├── praxis.js               # Branding: Name, Farben, Logo, Fußzeile
│   ├── pvs-template.js         # Aufbau der PVS-Textbausteine
│   └── logo.png                # Programmlogo
├── sops/
│   ├── startseite.js           # Startseite
│   └── sop-*.js                # je eine SOP pro Datei
├── assets/
│   ├── effloreszenzen/         # Beispielbilder Effloreszenzen
│   └── sonographie/            # Beispielbilder Sonographie
└── PVS/
    └── Pegamed.txt             # Beispiel für ein PVS-Baustein-Format
```

### Lokal starten

Doppelklick auf `pcm-framework.html` genügt – kein Build, kein Server. Wer lieber über
HTTP entwickelt:

```bash
python -m http.server 8765
```

Dann `http://localhost:8765/` aufrufen.

### Eigenes GitHub Pages aufsetzen

Das Repository ist so aufgebaut, dass es sich direkt als GitHub Page ausliefern lässt:

1. Repository forken oder klonen.
2. Unter **Settings → Pages** als Quelle *Deploy from a branch* wählen, Branch `main`,
   Ordner `/ (root)`.
3. Fertig – die Seite erscheint unter `https://<benutzername>.github.io/<repo>/`.

Zwei Details sind dafür entscheidend und bereits enthalten:

- **`.nojekyll`** im Wurzelverzeichnis. Ohne diese Datei schiebt GitHub Pages alles durch
  Jekyll, und Jekyll ignoriert sämtliche Dateien und Ordner, deren Name mit `_` oder `.`
  beginnt – die fehlen dann kommentarlos im Ergebnis. Die Datei ist leer; sie muss nur da
  sein. Beim Herunterladen als ZIP ist sie unsichtbar, aber vorhanden.
- **`index.html`** im Wurzelverzeichnis, das auf `pcm-framework.html` weiterleitet.
  GitHub Pages sucht beim Aufruf des Wurzelpfads nach `index.html`; ohne diese Datei
  erscheint eine 404-Seite.

Alle Pfade im Projekt sind relativ, das Repository funktioniert daher auch in einem
Unterverzeichnis wie `/SOP/` ohne Anpassung.

---

## Bildnachweise und Nutzungsbedingungen der Bilder

Alle verwendeten Bilder sind mit einer Quellenangabe direkt am Bild versehen. Die
vollständigen Nachweise stehen in den jeweiligen Bildordnern:

- [`assets/sonographie/BILDNACHWEIS.md`](assets/sonographie/BILDNACHWEIS.md)
- [`assets/effloreszenzen/BILDNACHWEIS.md`](assets/effloreszenzen/BILDNACHWEIS.md)

**Sonographiebilder.** Herzlichen Dank an das **Albertinen Krankenhaus**
(Immanuel Albertinen Diakonie gGmbH, Hamburg) für die Bereitstellung der
Sonographiebilder aus dem [Sonographie-Atlas](https://sonographiebilder.de/sonographie-atlas).

> ⚠️ **Diese Bilder sind von der MIT-Lizenz ausgenommen.** Sie dürfen ausschließlich
> **unentgeltlich und nichtkommerziell** genutzt werden. Wer dieses Projekt
> weiterverwendet, anpasst oder weitergibt, muss diesen Hinweis übernehmen. Andernfalls
> ist jede weitere Verwendung der Bilder erneut mit der Immanuel Albertinen Diakonie
> gGmbH abzustimmen.

**Effloreszenzen.** Die Bilder stammen von Wikimedia Commons und stehen unter freien
Lizenzen (Creative Commons bzw. Public Domain). Bei Weitergabe gelten die jeweiligen
Lizenzbedingungen – Namensnennung, bei CC BY-SA zusätzlich Weitergabe unter gleicher
Lizenz. Die Einzelnachweise stehen in der oben verlinkten Datei.

---

## Dank

Ein ausdrücklicher Dank geht an **Carsten** und **Wolfgang** für die Idee zu interaktiven
SOPs: SOPs nicht nur als statische Texte abzulegen, sondern als klickbare, strukturierte
und wiederverwendbare Arbeitsabläufe erlebbar zu machen.

## Lizenz

Der Programmcode steht unter der [MIT-Lizenz](LICENSE).

Die Bilder sind davon ausgenommen und unterliegen den oben genannten Bedingungen.

## Haftungsausschluss

Die enthaltenen Module und Textbausteine dienen der Demonstration und als Vorlage. Sie
ersetzen keine ärztliche Entscheidung. Wer sie produktiv einsetzt, muss sie zuvor
fachlich prüfen, an die eigenen Abläufe anpassen und ärztlich freigeben. Diagnosen und
Therapieentscheidungen erfolgen ausschließlich ärztlich.

Wer dem Programm bewertende Funktionen hinzufügt – Scores, Grenzwertprüfungen,
Verdachtsdiagnosen, Warnungen oder Handlungsempfehlungen – ändert dessen
Zweckbestimmung und trägt dafür die alleinige Verantwortung, einschließlich der
Pflichten eines Herstellers nach der MDR. Siehe [`ZWECKBESTIMMUNG.md`](ZWECKBESTIMMUNG.md).
