# Heilhaus zur Weissen Eiche – interaktives SOP-Framework

Ein leichtgewichtiges, modulares Framework für **interaktive SOPs (Standard Operating Procedures)**: klickbare Arbeitsabläufe, Checklisten, Score-Rechner und kopierbare Textbausteine – alles als statische Webseite, ganz ohne Server oder Datenbank.

> **Wichtig: Dies ist nur ein Framework mit Beispielinhalt.**
> Alle hier gezeigten Fälle, „Erkrankungen", Stoppzeichen, Scores, Werte und Codes sind **frei erfunden** (High-Fantasy-Demo) und dienen ausschließlich dazu, die Technik und die Modularität zu demonstrieren. Sie sind **keine** medizinische, rechtliche oder organisatorische Handlungsempfehlung.

## Idee

Statt SOPs als statische PDF- oder Textdokumente abzulegen, macht dieses Framework sie **erlebbar**: als klickbare, strukturierte und wiederverwendbare Arbeitsabläufe. Jede SOP und jeder Score ist ein eigenständiges Modul – einzeln ergänzbar, ersetzbar und versionierbar.

Der Beispielinhalt ist bewusst eine **Fantasy-Demo**, damit sofort klar ist: Es geht um das **Gerüst**, nicht um konkrete Inhalte. Den fachlichen Teil füllt jeder selbst.

## Für wen ist das gedacht?

Das Framework ist als **leeres, modulares Gerüst** konzipiert, das auf zwei Wegen mit echten, fachlich freigegebenen Inhalten befüllt werden kann:

- **Einzelne Praxen** ergänzen ihre eigenen, intern abgestimmten SOPs Modul für Modul.
- **Verbände, Fachgesellschaften oder Netzwerke** können das Framework mit **offiziellen, validierten SOPs** bestücken und gemeinsam pflegen.

Weil jede SOP in einer eigenen Datei liegt, lassen sich Module frei kombinieren, austauschen und weitergeben – ohne den Kern des Frameworks anzufassen.

## Live-Demo

Sobald GitHub Pages für dieses Repository aktiviert ist, läuft die Demo direkt im Browser:

**→ https://lollylan.github.io/SOP/**

Es werden keine Daten gespeichert oder versendet – die App läuft vollständig lokal im Browser.

## Dank

Ein ausdrücklicher Dank geht an **Carsten** und **Wolfgang** für die Idee zu interaktiven SOPs. Diese Demo greift ihre Grundidee auf: SOPs nicht nur als statische Texte abzulegen, sondern als klickbare, strukturierte und wiederverwendbare Arbeitsabläufe erlebbar zu machen.

## Was ist enthalten?

- **Torwache** – fiktiver Erstkontakt / Empfang mit Demo-Stoppzeichen
- **Heiler-Helfer-Sprechstunde** – akute und chronische Fantasy-Fälle, getrennt gelistet
- **Fantasy-Scores** – frei erfundene Score-Rechner
- **Textbaustein-Ausgabe** mit den Abschnitten AN, BE, TH und LD (frei konfigurierbar)
- **Modulares Add-on-System** – jede SOP und jeder Score liegt in einer eigenen JS-Datei

## Projektstruktur

```text
.
├── index.html              # Startseite (leitet auf die App weiter, für GitHub Pages)
├── pcm-framework.html      # die eigentliche App
├── addons.js               # Manifest: welche Module geladen werden
├── config/
│   ├── praxis.js           # Branding (Name, Farben, Logo, Footer)
│   ├── pvs-template.js     # Format der Textbausteine
│   └── logo.png            # Logo
└── sops/
    ├── sop-torwache.js     # Erstkontakt / Empfang
    ├── akut-*.js           # je eine akute SOP pro Datei
    ├── chronisch-*.js      # je eine chronische SOP pro Datei
    └── score-*.js          # je ein Score pro Datei
```

## Eigene SOPs einbauen

1. Eine vorhandene Datei aus `sops/` kopieren.
2. ID, Titel, Schritte, Auswertung und Textbaustein anpassen.
3. Die neue Datei in `addons.js` unter `sops` eintragen.
4. **Eigene Inhalte fachlich prüfen, validieren und vor einem echten Einsatz freigeben.**

Eine ausführliche Anleitung mit allen Elementtypen, der Live-Auswertung und dem
Textbaustein-Format steht in [`ANLEITUNG.md`](ANLEITUNG.md).

## Lokal starten

Einfach `pcm-framework.html` im Browser öffnen – oder `index.html` für die
Weiterleitung. Es ist kein Build-Schritt und kein Server nötig.

## Rechtlicher Hinweis

Dieses Repository enthält **keine echten medizinischen SOPs**, Triagefragen, Scores,
Grenzwerte oder ICD-Codes. Wer das Framework produktiv nutzen möchte, muss die fiktiven
Inhalte **vollständig** durch eigene, fachlich validierte und freigegebene Inhalte ersetzen.

Die verwendeten Fantasy-Begriffe sind eigenständig gewählt und nicht als Bezug zu
bestehenden Fantasy-Franchises gedacht.

## Lizenz

Veröffentlicht unter der [MIT-Lizenz](LICENSE).
