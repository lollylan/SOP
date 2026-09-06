/* ════════════════════════════════════════════════════════════════════
   startseite.js — STARTSEITE
   Erster Bereich im Dashboard: erklärt, was Asklaion SOP ist, wie eine
   Praxis die SOPs anpasst, und führt die Bildnachweise auf.
   Reine Info-Seite: keine Eingaben, kein PVS-Textbaustein.
   ════════════════════════════════════════════════════════════════════ */
PCM.registerSOP({
  id: 'startseite',
  titel: 'Startseite',
  untertitel: 'Über dieses Programm · Anpassung in der eigenen Praxis · Bildnachweise',
  icon: '🏠',
  farbe: '#025669',
  stand: '06.09.2026',
  bereich: 'Startseite',
  kategorie: 'Startseite',

  schritte: [
    {
      nr: '1', titel: 'Was ist Asklaion SOP?', rolle: 'Übersicht', rolleStil: 'blue', farbe: '#025669', offen: true,
      elemente: [
        { typ: 'html', html:
          '<div class="start-lead">Bei diesem Programm handelt es sich um ein ' +
          '<strong>Dokumentations- und Vorlagenwerkzeug</strong> für die hausärztliche Versorgung.</div>' +
          '<p class="start-p">Die Module führen strukturiert durch die Erfassung eines Behandlungsanlasses und ' +
          'überführen die eingetragenen Angaben am Ende in einen fertigen Textbaustein für die PVS-Dokumentation.</p>' },
        { typ: 'info', stil: 'orange', titel: 'Wichtig',
          text: 'Die hier hinterlegten Module sind Vorlagen und dienen der Präsentation. Sie sind von der jeweiligen Praxis ' +
            'anzupassen, fachlich zu validieren und vor dem Einsatz ärztlich freizugeben.' }
      ]
    },
    {
      nr: '2', titel: 'Zweckbestimmung', rolle: 'Verbindlich', rolleStil: 'red', farbe: '#C0392B', offen: true,
      elemente: [
        { typ: 'info', stil: 'rot', titel: 'Kein Medizinprodukt',
          text: 'Dieses Programm ist ein reines Dokumentations- und Vorlagenwerkzeug. Es trifft keine Aussage zu ' +
            'Diagnose, Therapie oder Dringlichkeit, berechnet keine medizinischen Scores und gibt keine ' +
            'Handlungsempfehlungen. Es ist kein Medizinprodukt im Sinne der Verordnung (EU) 2017/745 (MDR) und ' +
            'wird nicht als solches in Verkehr gebracht. Jede medizinische Bewertung erfolgt ausschließlich ärztlich.' },
        { typ: 'html', html:
          '<p class="start-p">Das Programm überträgt ausschließlich das in den Dokumentationstext, was die ' +
          'anwendende Person selbst eingetragen oder ausgewählt hat. Es ergänzt keine Einordnung, keine Bewertung ' +
          'und keinen Diagnosecode. Die Engine besitzt dafür bewusst keine Schnittstelle.</p>' },
        { typ: 'info', stil: 'orange', titel: 'Hinweis für alle, die das Programm anpassen',
          text: 'Wer bewertende Funktionen ergänzt — Scores, Grenzwertprüfungen, Verdachtsdiagnosen, Warnungen, ' +
            'Red Flags oder Dringlichkeitsempfehlungen — ändert die Zweckbestimmung. Das Ergebnis kann ein ' +
            'Medizinprodukt sein, mit den vollen Pflichten eines Herstellers. Diese Verantwortung trifft ' +
            'ausschließlich denjenigen, der die Änderung vornimmt. Einzelheiten in der Datei ZWECKBESTIMMUNG.md.' }
      ]
    },
    {
      nr: '3', titel: 'Module an die eigene Praxis anpassen', rolle: 'Anleitung', rolleStil: 'green', farbe: '#1E8449', offen: true,
      elemente: [
        { typ: 'html', html:
          '<p class="start-p">Jede Praxis passt die SOPs an ihre eigenen Abläufe, Delegationsregeln und ' +
          'Freigaben an. Eine Anleitung, wie das geht, finden Sie unter ' +
          '<a href="http://asklaion.de" target="_blank" rel="noopener noreferrer">asklaion.de</a>.</p>' }
      ]
    },
    {
      nr: '4', titel: 'Bildnachweise und Dank', rolle: 'Quellen', rolleStil: 'gray', farbe: '#566573', offen: true,
      elemente: [
        { typ: 'html', html:
          '<p class="start-p">Alle in diesem Programm verwendeten Bilder sind mit einer <strong>Quellenangabe</strong> ' +
          'direkt am Bild versehen. Für die Effloreszenzen- und Sonographiebilder liegt der vollständige Nachweis ' +
          'zusätzlich als Datei <code>BILDNACHWEIS.md</code> im jeweiligen Bildordner.</p>' },
        { typ: 'sec', text: 'Sonographie-Bilder' },
        { typ: 'html', html:
          '<p class="start-p">Ein besonderer Dank gilt dem <strong>Albertinen Krankenhaus</strong> ' +
          '(Immanuel Albertinen Diakonie gGmbH, Hamburg) für die Bereitstellung der Sonographiebilder. ' +
          'Die Bilder stammen aus dem Sonographie-Atlas unter ' +
          '<a href="https://sonographiebilder.de/sonographie-atlas" target="_blank" rel="noopener noreferrer">' +
          'sonographiebilder.de/sonographie-atlas</a>.</p>' },
        { typ: 'info', stil: 'blau', titel: 'Bedingung des Rechteinhabers',
          text: 'Die Sonographiebilder dürfen ausschließlich unentgeltlich und nichtkommerziell genutzt werden. ' +
            'Wird dieses Programm als Open Source zur Weiterverwendung oder Anpassung bereitgestellt, muss die ' +
            'Lizenz einen entsprechenden Hinweis auf diese Einschränkung enthalten. Andernfalls ist jede weitere ' +
            'Verwendung der Bilder erneut mit der Immanuel Albertinen Diakonie gGmbH abzustimmen.' }
      ]
    }
  ]
});
