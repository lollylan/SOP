# Asklaion SOP — Anleitung

Ein **serverloses** SOP-System für die Praxis. Die Engine ist eine einzige
HTML-Datei, die per Doppelklick im Browser läuft. Die eigentlichen SOPs und
das PVS-Format liegen als austauschbare **Add-on-Dateien** daneben — so kann
jede Praxis das System anpassen, ohne die Engine selbst zu verändern.

---

## 1. Schnellstart

1. **`pcm-framework.html` doppelklicken** — öffnet sich im Standardbrowser.
2. Eine SOP-Kachel anklicken → durchklicken → **„PVS-Textbaustein erzeugen"** → **„Alles kopieren"** → ins PVS einfügen.

Kein Server, kein Internet, keine Installation nötig. Läuft in **Chrome, Edge,
Firefox** — überall per Doppelklick.

> **Warum keine `.txt`/`.json`-Add-ons?** Beim Öffnen per Doppelklick (`file://`)
> blockieren Browser aus Sicherheitsgründen das Nachladen von Text-/JSON-Dateien
> (`fetch`). `.js`-Dateien, die sich selbst registrieren, sind davon **nicht**
> betroffen — deshalb sind die Add-ons `.js`-Dateien. Inhaltlich ist eine SOP
> trotzdem nur eine übersichtliche Liste, kein „Programmieren" nötig (siehe §4).

---

## 2. Ordnerstruktur

```
SOP PCM/
├─ pcm-framework.html     ← die Engine (NICHT anfassen) · hier starten
├─ addons.js              ← Manifest: welche Add-ons geladen werden
├─ config/
│  ├─ pvs-template.js     ← Format des PVS-Textbausteins (AN/BE/SN/TH/LD)
│  ├─ praxis.js           ← Praxisname, Logo, Farben (optional)
│  └─ logo.png            ← das Praxis-Logo
└─ sops/
   └─ sop-ruecken.js      ← Beispiel-SOP (Vorlage zum Kopieren)
```

Zum Weitergeben an eine andere Praxis: **den ganzen Ordner kopieren**, dann
`config/` und `sops/` anpassen.

---

## 3. Eine neue SOP hinzufügen — in 3 Schritten

1. **`sops/sop-ruecken.js` kopieren** und z. B. in `sops/sop-husten.js` umbenennen.
2. Inhalte ersetzen (`id`, `titel`, die `schritte`, `baustein`).
   → Das macht am schnellsten eine KI für dich (siehe §6).
3. In **`addons.js`** eine Zeile ergänzen:
   ```js
   sops: [
     'sops/sop-ruecken.js',
     'sops/sop-husten.js'      // ← neu
   ]
   ```
4. `pcm-framework.html` neu laden (F5) — die neue Kachel erscheint.

> Wichtig: Jede SOP braucht eine **eindeutige `id`**. Nach einem `,` darf in der
> Liste kein Komma fehlen oder zu viel sein.

---

## 4. Aufbau einer SOP-Datei

Eine SOP besteht aus zwei Teilen (alles in `PCM.registerSOP({ … })`):

| Teil | Zweck |
|------|-------|
| **`schritte[]`** | Die anklickbare Oberfläche: aufklappbare Schritte mit Elementen (Checklisten, Auswahlfelder, Tabellen …). |
| **`baustein(state)`** | Überträgt die Eingaben unverändert in die PVS-Abschnitte **AN / BE / TH / LD**. |

> ⚠️ **Es gibt bewusst keine Auswertungsfunktion.** Das Framework bewertet keine
> Eingaben, berechnet keine Scores und gibt keine Hinweise oder Warnungen aus.
> Wer solche Logik ergänzt, ändert die Zweckbestimmung und macht daraus
> möglicherweise ein Medizinprodukt — siehe [`ZWECKBESTIMMUNG.md`](ZWECKBESTIMMUNG.md).
> `baustein()` darf ausschließlich wiedergeben, was die anwendende Person
> eingetragen hat.

`state` ist ein Objekt, das automatisch alle Eingaben sammelt — pro Element-`id`
ein Eintrag. Eine Checkliste liefert die Liste der angehakten Texte, ein
Auswahlfeld den gewählten Wert, usw.

### Verfügbare Element-Typen (in `schritte[].elemente[]`)

```js
{typ:'info',   stil:'rot|blau|gruen|orange|grau', titel:'…', text:'…'}
{typ:'sec',    text:'Zwischenüberschrift'}
{typ:'checkliste', id:'…', stil:'rot|gruen', items:['…','…']}   // state[id] = Array angehakter Texte
{typ:'auswahl',    id:'…', label:'…', optionen:[{wert:'a',text:'A'}]}  // state[id] = 'a'
{typ:'zahl',       id:'…', label:'…', einheiten:['Tage','Wochen'], min:1, max:180}  // state[id] = {wert, einheit}
{typ:'tabelle',    stil:'blau|gruen|rot', kopf:['…','…'], breiten:['40%',''], zeilen:[{zellen:['…','…'], stil:'gruen|grau'}]}
{typ:'liste',  items:['…','…']}
{typ:'split',  zellen:[{stil:'gruen',titel:'…',text:'…'}, {stil:'rot',titel:'…',text:'…'}]}
{typ:'icd',    id:'diagnosen', items:[{code:'M54.5G', text:'Kreuzschmerz'}]}   // state[id] = Array Codes
{typ:'html',   html:'…rohes HTML für Sonderfälle…'}
```

Der **„Baustein erzeugen"-Button** wird vom Framework automatisch bereitgestellt —
er muss in der SOP nicht angelegt werden.

---

## 5. Das PVS-Format anpassen (`config/pvs-template.js`)

Der fertige Textbaustein sieht von PVS zu PVS anders aus. Das steuert **nur**
diese eine Datei — die SOPs bleiben unverändert. Beispiel: Überschriften mit
Doppelpunkt statt der Kürzel AN/BE/SN/TH/LD (SN = Sonographie):

```js
abschnitte: [
  { key: 'AN', label: 'Anamnese:' },
  { key: 'BE', label: 'Befund:' },
  { key: 'TH', label: 'Therapie/Procedere:' },
  { key: 'LD', label: 'Diagnosen:' }
]
```

`leereWeglassen: true` lässt Abschnitte ohne Inhalt komplett weg.

---

## 6. KI-Prompt zum Erstellen einer neuen SOP

Kopiere den folgenden Text in eine KI (Claude, ChatGPT o. ä.) und hänge **deine
SOP-Quelle** an (Leitlinien-Text, bestehende Praxis-SOP, Stichpunkte). Du
bekommst eine fertige `.js`-Datei zurück, die du in `sops/` legst.

> ⚕️ **Medizinische Sorgfaltspflicht:** Eine KI-generierte SOP ist ein *Entwurf*.
> Vor dem Einsatz am Patienten **ärztlich prüfen** — besonders Dosierungen,
> ICD-Codes und die Texte des PVS-Bausteins.
>
> ⚠️ **Zweckbestimmung beachten:** Lass dir keine bewertende Logik erzeugen —
> keine Scores, keine Grenzwertprüfungen, keine Verdachtsdiagnosen, keine
> Warnungen oder Dringlichkeitsempfehlungen. Solche Funktionen machen aus dem
> Werkzeug möglicherweise ein Medizinprodukt, für das dann **du** als Hersteller
> einstehst. Siehe [`ZWECKBESTIMMUNG.md`](ZWECKBESTIMMUNG.md).

```text
Du erstellst eine SOP-Add-on-Datei für ein bestehendes Praxis-SOP-Framework.

AUSGABE: genau eine JavaScript-Datei, beginnend mit PCM.registerSOP({ … }); —
kein Markdown, keine Erklärung. Halte dich exakt an das folgende Schema.

GRUNDGERÜST:
PCM.registerSOP({
  id: 'kurzname',                 // eindeutig, klein, ohne Leerzeichen
  titel: '…', untertitel: '…',
  icon: '🤧',                     // ein Emoji
  farbe: '#2471A3',               // Akzentfarbe der SOP
  version: '1.0', stand: 'TT.MM.JJJJ',
  kategorie: '…',                 // gruppiert die Kacheln im Dashboard
  leitlinie: '…',                 // optional, Quelle/Leitlinie
  delegationshinweis: '…',        // optional, rechtlicher Delegationshinweis
  schritte: [ … ],                // siehe Element-Typen
  baustein:   function (s) { return { AN: '…', BE: '…', TH: '…', LD: '…' }; }
});

ELEMENT-TYPEN (in schritte[].elemente[]):
{typ:'info', stil:'rot|blau|gruen|orange|grau', titel, text}
{typ:'sec', text}
{typ:'checkliste', id, stil:'rot|gruen', items:[…]}        // s[id] = Array angehakter Texte
{typ:'auswahl', id, label, optionen:[{wert,text}]}          // s[id] = wert
{typ:'zahl', id, label, einheiten:[…], min, max}            // s[id] = {wert, einheit}
{typ:'tabelle', stil:'blau|gruen|rot', kopf:[…], breiten:[…], zeilen:[{zellen:[…], stil:'gruen|grau'}]}
{typ:'liste', items:[…]}
{typ:'split', zellen:[{stil,titel,text}]}
{typ:'icd', id:'diagnosen', items:[{code,text}]}            // s[id] = Array ICD-Codes

REGELN:
- ABSOLUT VERBINDLICH: Erzeuge KEINE bewertende Logik. Keine auswertung()-Funktion,
  keine Scores, keine Punktwerte, keine Grenzwertprüfungen, keine Verdachtsdiagnosen,
  keine abgeleiteten ICD-Codes, keine Warnungen, Red Flags, Dringlichkeits- oder
  Handlungsempfehlungen. Das Werkzeug dokumentiert ausschliesslich und bewertet nie.
- Statische Sicherheits- und Nachschlagetexte als {typ:'info'} sind erlaubt, solange
  sie unabhängig von den Eingaben immer gleich angezeigt werden.
- baustein(s): formuliere ganze, dokumentationsreife Sätze aus den Eingaben.
  Gib ausschliesslich wieder, was die anwendende Person eingetragen hat — ergänze
  keine Einordnung, Bewertung oder Schlussfolgerung.
  AN = Anamnese, BE = Befund (leer lassen = ''), TH = Therapie/Procedere,
  LD = nur ICD-Codes: (s.diagnosen||[]).join('\n').
- Leere Abschnitte als '' zurückgeben (werden automatisch weggelassen).
- Verwende ausschließlich die oben genannten Element-Typen und Feldnamen.
- Komplett auf Deutsch.

Als Vorlage dient die Datei sop-ruecken.js (Rückenschmerz-SOP) aus diesem Framework.

MEINE SOP-QUELLE:
<<< hier deinen Leitlinien-/SOP-Text einfügen >>>
```

---

## 7. Fehlerbehebung

| Symptom | Ursache / Lösung |
|---------|------------------|
| Gelbe Warnbox „Hinweise beim Laden" | Eine Add-on-Datei fehlt oder hat einen Tippfehler. Dateiname in `addons.js` und im Ordner `sops/` prüfen. |
| Kachel fehlt | Eintrag in `addons.js` vergessen, oder `id` doppelt vergeben. |
| „konnte nicht starten" | `addons.js` fehlt oder liegt nicht neben `pcm-framework.html`. |
| Baustein bleibt leer | `baustein()` gibt für die Abschnitte leere Strings zurück — Eingaben gemacht? |
| Details ansehen | Im Browser **F12** drücken → Reiter „Konsole" zeigt die genaue Fehlermeldung. |

---

## 8. Datenschutz

Es werden **keine** Patientendaten gespeichert oder versendet. Alles läuft lokal
im Browser; beim Schließen oder „Zurücksetzen" sind die Eingaben weg. Der
erzeugte Baustein verlässt den Rechner erst, wenn er bewusst ins PVS kopiert wird.
