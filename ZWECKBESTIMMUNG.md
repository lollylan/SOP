# Zweckbestimmung

Diese Erklärung legt fest, wofür dieses Programm bestimmt ist und wofür ausdrücklich
nicht. Sie ist Bestandteil der Auslieferung und darf bei Weitergabe nicht entfernt
oder verändert werden.

---

## 1. Bestimmungsgemäßer Zweck

Dieses Programm ist ein **Dokumentations- und Vorlagenwerkzeug** für Arztpraxen.
Sein einziger Zweck ist es,

- strukturierte Eingabemasken für die Verlaufsdokumentation bereitzustellen,
- die von der anwendenden Person **selbst eingetragenen** Angaben in einen
  formatierten Textbaustein zu überführen, der in ein Praxisverwaltungssystem
  kopiert werden kann,
- Nachschlage- und Schulungsinformationen sowie Verweise auf externe Quellen
  anzuzeigen.

Das Programm arbeitet ausschließlich lokal im Browser. Es besteht keine
Serververbindung, es werden keine Daten übertragen und keine Patientendaten
gespeichert.

## 2. Ausdrücklich nicht bestimmter Zweck

Das Programm ist **nicht** dafür bestimmt,

- Diagnosen zu stellen, vorzuschlagen oder zu bestätigen,
- Therapien vorzuschlagen, zu bewerten oder zu überwachen,
- Krankheiten zu erkennen, vorherzusagen oder zu prognostizieren,
- Dringlichkeiten einzustufen, zu triagieren oder Notfälle zu erkennen,
- medizinische Scores oder Risikowerte zu berechnen,
- Messwerte oder Befunde gegen Grenzwerte zu prüfen oder zu interpretieren,
- Warnungen, Red Flags oder Handlungsempfehlungen auszugeben,
- ärztliche oder pflegerische Entscheidungen zu unterstützen oder zu ersetzen.

**Das Programm ist kein Medizinprodukt** im Sinne der Verordnung (EU) 2017/745
(MDR) und wird nicht als solches in Verkehr gebracht.

## 3. Technische Umsetzung dieser Zweckbestimmung

Die Zweckbestimmung ist nicht nur eine Erklärung, sondern in der Software
durchgesetzt:

- Die Engine (`pcm-framework.html`) enthält **keine Auswertungsfunktion**. Ein
  Modul kann keine Bewertung, keinen Score und keine Meldung an die Oberfläche
  zurückgeben — die dafür nötige Schnittstelle existiert nicht.
- Es gibt **kein Red-Flag-Banner** und **kein Meldungs-Panel**.
- Der erzeugte Textbaustein enthält ausschließlich das, was die anwendende
  Person eingetragen oder ausgewählt hat. Das Programm ergänzt keine
  Einordnung, keine Bewertung und keinen Diagnosecode.
- Diese Zweckbestimmung wird bei jeder Ansicht in der Fußzeile angezeigt und
  ist über die Praxis-Konfiguration **nicht überschreibbar**.

## 4. Hinweis für alle, die dieses Programm anpassen oder weitergeben

Wer dem Programm Funktionen hinzufügt, die

- Eingaben bewerten, gewichten oder verrechnen,
- Scores, Indizes oder Risikowerte berechnen,
- Verdachtsdiagnosen, ICD-Codes oder Befundinterpretationen ableiten,
- Warnungen, Red Flags, Handlungs- oder Dringlichkeitsempfehlungen ausgeben,

verändert damit die Zweckbestimmung. Das so entstandene Produkt kann ein
Medizinprodukt im Sinne der MDR sein — mit den vollen Pflichten eines
Herstellers (Konformitätsbewertung, technische Dokumentation, CE-Kennzeichnung,
Marktüberwachung, Vigilanz).

**Diese Verantwortung trifft ausschließlich denjenigen, der die Änderung
vornimmt und das Ergebnis bereitstellt** — nicht den Urheber dieses
Grundgerüsts.

## 5. Verantwortung für Inhalte

Die mitgelieferten Module sind **Strukturvorlagen ohne fachliche Aussage**. Wer
sie mit medizinischen Inhalten füllt, ist für diese Inhalte fachlich und
rechtlich verantwortlich und muss sie vor dem Einsatz ärztlich prüfen und
freigeben.

---

Stand: 06.09.2026
