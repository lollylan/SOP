# Asklaion SOP

Eine Sammlung **interaktiver Standard Operating Procedures (SOPs)** für die hausärztliche
Versorgung: klickbare Arbeitsabläufe, Checklisten, Score-Rechner, strukturierte Befundmodule
und kopierfertige Textbausteine für das Praxisverwaltungssystem.

Alles läuft als **statische Webseite** – ohne Server, ohne Datenbank, ohne Installation.
Es werden keine Daten gespeichert oder versendet; die Anwendung arbeitet vollständig
lokal im Browser.

**→ Zum Ausprobieren: https://lollylan.github.io/SOP/**

> **Die SOPs sind Vorlagen.** Jede Praxis muss sie an ihre eigenen Abläufe, Delegations-
> regeln und Freigaben anpassen, fachlich validieren und vor dem Einsatz ärztlich
> freigeben. Sie sind keine medizinische oder rechtliche Handlungsempfehlung.

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
- **Telefontriage** – Erstkontakt mit Red-Flag-Abfrage
- **PCM-Sprechstunde** – Akutanlässe und Chroniker *(Inhalte folgen)*
- **Hitze-Medikation (CALOR-Liste)** *(Inhalt folgt)*
- **Patientenaufklärungen** – Deximed-Verweise
- **Dermatologie** – Effloreszenzen-Bestimmung und Dermatoskopie mit ABCD-Score
- **Sonographie** – strukturierte Befundung Abdomen und Schilddrüse
- **Orthopädie** – Gelenkuntersuchung, Neutral-Null-Methode, Funktionstests
- **EKG** – schrittweise Befundung mit automatischer Beurteilung
- **Scores** – rund 30 Rechner von CHA₂DS₂-VASc bis PHQ-9

Die mit *(Inhalt folgt)* markierten Bereiche sind bewusst leer: Für diese Inhalte liegen
die Einverständniserklärungen der Rechteinhaber noch nicht vor. Struktur und Einordnung
bleiben sichtbar, damit erkennbar ist, was ergänzt wird.

---

## Für technisch Versierte

### Architektur

Eine Engine, beliebig viele Add-ons. `pcm-framework.html` enthält die komplette Engine
(Rendering, State, Red-Flag-Auswertung, Textbaustein-Erzeugung) und wird **nicht pro
Praxis angepasst**. Jede SOP ist eine eigenständige JS-Datei, die sich beim Laden selbst
registriert:

```js
PCM.registerSOP({
  id: 'beispiel',
  titel: 'Beispiel-SOP',
  bereich: 'PCM-Sprechstunde',     // Spalte 1 der Navigation
  unterbereich: 'Akutanlaesse',    // Gruppierung
  kategorie: 'Infektiologie',      // Fachbereich
  schritte: [ /* Elemente: info, checkliste, auswahl, zahl, tabelle, icd, html … */ ],
  auswertung: function (state) { /* Red Flags und Hinweise, läuft live */ },
  baustein:   function (state) { /* { AN, BE, TH, LD } für das PVS */ }
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
├── .nojekyll                   # schaltet die Jekyll-Verarbeitung auf Pages ab
├── config/
│   ├── praxis.js               # Branding: Name, Farben, Logo, Fußzeile
│   ├── pvs-template.js         # Aufbau der PVS-Textbausteine
│   └── logo.png                # Programmlogo
├── sops/
│   ├── startseite.js           # Startseite
│   ├── sop-*.js                # je eine SOP pro Datei
│   ├── scores-*.js             # Score-Rechner, nach Fachgebiet gebündelt
│   └── dermatoskopie-assets/   # Beispielbilder Dermatoskopie
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

**Dermatoskopie.** Die Quelle ist bei jedem Bild als Bildunterschrift angegeben
(Dermoscopedia bzw. ISIC Archive).

---

## Dank

Ein ausdrücklicher Dank geht an **Carsten** und **Wolfgang** für die Idee zu interaktiven
SOPs: SOPs nicht nur als statische Texte abzulegen, sondern als klickbare, strukturierte
und wiederverwendbare Arbeitsabläufe erlebbar zu machen.

## Lizenz

Der Programmcode steht unter der [MIT-Lizenz](LICENSE).

Die Bilder sind davon ausgenommen und unterliegen den oben genannten Bedingungen.

## Haftungsausschluss

Die enthaltenen SOPs, Scores, Grenzwerte und Textbausteine dienen der Demonstration und
als Vorlage. Sie ersetzen keine ärztliche Entscheidung. Wer sie produktiv einsetzt, muss
sie zuvor fachlich prüfen, an die eigenen Abläufe anpassen und ärztlich freigeben.
Diagnosen und Therapieentscheidungen erfolgen ausschließlich ärztlich.
