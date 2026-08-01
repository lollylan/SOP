(function () {
  "use strict";

  /* Hinweis: Die Beispiel-EKGs sind in dieser Fassung nicht enthalten -
     die Nutzungsrechte an den Bildern sind noch nicht geklaert. Die
     Merkmalstexte bleiben unveraendert. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function hasText(v) { return v != null && String(v).trim() !== ""; }
  function capFirst(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : str; }
  function optsHtml(values, selected) {
    return values.map(function (v) {
      return '<option value="' + esc(v) + '"' + (v === selected ? " selected" : "") + ">" + esc(v) + "</option>";
    }).join("");
  }
  function labeledOptsHtml(pairs, selected) {
    return pairs.map(function (p) {
      return '<option value="' + esc(p[0]) + '"' + (p[0] === selected ? " selected" : "") + ">" + esc(p[1]) + "</option>";
    }).join("");
  }

  var LEADS_LIMB = ["I", "II", "III", "aVR", "aVL", "aVF"];
  var LEADS_PREC = ["V1", "V2", "V3", "V4", "V5", "V6"];
  var LEADS_ALL = LEADS_LIMB.concat(LEADS_PREC);

  /* ======================================================================
     DATENGRUNDLAGE (Inhalt/Konzept übernommen aus dem Praxis-EKG-Tool)
     ====================================================================== */
  var RHYTHMUS_OPTIONS = [
    { id: "normofrequenter-sinusrhythmus", label: "Normofrequenter Sinusrhythmus", hint: "Regelmäßiger Sinusrhythmus, Frequenz 60–100/min." },
    { id: "sinusarrhythmie", label: "Sinusarrhythmie mit wechselnden RR-Zeiten", hint: "Meist atemabhängige, physiologische Schwankung der RR-Abstände (respiratorische Sinusarrhythmie)." },
    { id: "sinustachykardie", label: "Sinustachykardie", hint: "Sinusrhythmus mit Frequenz > 100/min." },
    { id: "sinusbradykardie", label: "Sinusbradykardie", hint: "Sinusrhythmus mit Frequenz < 60/min." },
    { id: "absolute-arrhythmie", label: "Absolute Arrhythmie", warn: true, hint: "Komplett unregelmäßige RR-Abstände ohne erkennbare P-Wellen – typisch bei Vorhofflimmern; bei sägezahnartigen Flatterwellen und variabler Überleitung auch bei Vorhofflattern mit wechselnder Blockierung." },
    { id: "schrittmacherrhythmus", label: "Schrittmacherrhythmus (Stimulations-EKG)", hint: "Spikes vor QRS- und/oder P-Welle je nach Stimulationsort. ST-Strecke und T-Welle sind sekundär meist nicht regelrecht beurteilbar (schenkelblockartige, bei RV-apikaler Stimulation meist LSB-artige QRS-Konfiguration)." },
    { id: "sonstiges", label: "Sonstiges", hint: "Freitext, z. B. atrialer Ersatzrhythmus, junktionaler Rhythmus.", freitext: true }
  ];

  var LAGETYP_OPTIONS = [
    { id: "indifferenztyp", label: "Indifferenztyp", range: "+30° bis +60°", angleFrom: 30, angleTo: 60, hint: 'Physiologischer Lagetyp bei Erwachsenen ("Normaltyp"/"Mitteltyp"). R-Zacke am größten in Ableitung II.' },
    { id: "linkstyp", label: "Linkstyp", range: "−30° bis +30°", angleFrom: -30, angleTo: 30, hint: "Physiologisch, insb. bei älteren und adipösen Patient:innen (Herzachse verschiebt sich mit Alter/Gewicht nach links). R-Zacke am größten in Ableitung I." },
    { id: "ueberdrehter-linkstyp", label: "Überdrehter Linkstyp", range: "< −30° (−30° bis −90°)", angleFrom: -90, angleTo: -30, warn: true, hint: "In der Regel pathologisch: DD linksanteriorer Hemiblock, linksventrikuläre Hypertrophie, Vorhofseptumdefekt. Ableitung II negativ." },
    { id: "steiltyp", label: "Steiltyp", range: "+60° bis +90°", angleFrom: 60, angleTo: 90, hint: "Physiologisch v. a. bei jungen, schlanken/asthenischen Personen; auch bei Rechtsherzbelastung (z. B. COPD) möglich." },
    { id: "rechtstyp", label: "Rechtstyp", range: "+90° bis +120°", angleFrom: 90, angleTo: 120, warn: true, hint: "Bei Erwachsenen abklärungsbedürftig: DD Rechtsherzbelastung (z. B. Lungenembolie, Cor pulmonale), Kinder/Jugendliche physiologisch." },
    { id: "nordwesttyp", label: 'Unmöglicher Lagetyp ("Nordwest-Typ")', range: "> +120° bis ±180° / −90° bis −180°", angleFrom: 120, angleTo: 180, angleFromExtra: -180, angleToExtra: -90, warn: true, hint: 'Extreme (superiore) Achsenlage, Ableitung I und aVF beide negativ ("No man\'s land"). Immer pathologisch: DD kombinierter Hemiblock, Hyperkaliämie, ventrikulärer Ursprung, Zustand nach ausgedehntem Infarkt.' },
    { id: "nicht-festlegbar", label: "Durch die Ableitungen/Artefakte etc. nicht festlegbar", range: "", angleFrom: null, angleTo: null, hint: "Z. B. bei Extremitätenableitungs-Artefakten, liegender Vorderwandinfarktnarbe mit isoelektrischen QRS in mehreren Extremitätenableitungen, oder unzureichender Ableitungsqualität." }
  ];

  var P_FINDINGS = [
    { id: "p-doppelgipflig", label: "Doppelgipfliges P mit Verbreiterung (P-sinistrocardiale)", hint: "P-Dauer > 110–120 ms, doppelgipflig/biphasisch, am deutlichsten in Ableitung II und V1; Hinweis auf linksatriale Vergrößerung/Druck- oder Volumenbelastung, z. B. bei Mitralstenose." },
    { id: "p-dextrocardiale", label: "Überhöhtes, spitzes P (P-dextrocardiale/P-pulmonale)", hint: "P-Amplitude > 0,25 mV, am deutlichsten in Ableitung II und V1, ohne Verbreiterung; Hinweis auf rechtsatriale Druckbelastung, z. B. bei Cor pulmonale, pulmonaler Hypertonie oder Trikuspidalvitium." },
    { id: "p-biatrial", label: "Biatriale Vergrößerung (Amplitudenerhöhung UND Verbreiterung)", hint: "Kombination aus P-dextrocardiale- und P-sinistrocardiale-Kriterien – Hinweis auf kombinierte Vorhofbelastung." },
    { id: "p-variabel", label: "P-Wellen mit variabler Form (Hinweis auf ektope Vorhofaktivität)", hint: "Wechselnde P-Wellen-Morphologie von Schlag zu Schlag, z. B. bei wandering pacemaker oder multifokaler atrialer Tachykardie." },
    { id: "p-fehlend", label: "P-Welle fehlend, isoelektrische Grundlinie (ohne Flimmerwellen)", hint: "Keine erkennbare Vorhoferregung bei unauffälliger, glatter Grundlinie – z. B. bei Sinusarrest, AV-junktionalem Ersatzrhythmus oder schwerer Hyperkaliämie. PQ-Zeit dadurch nicht beurteilbar." },
    { id: "p-flimmerwellen", label: "Anstelle von P-Wellen: unregelmäßig undulierende Flimmerwellen", warn: true, hint: "Unregelmäßige, undulierende Grundlinie unterschiedlicher Amplitude und Frequenz (350–600/min) anstelle abgrenzbarer P-Wellen – klassisches Bild des Vorhofflimmerns, meist in Kombination mit absoluter Arrhythmie. PQ-Zeit dadurch nicht beurteilbar." },
    { id: "p-negativ", label: "Negative P-Wellen (retrograde Vorhoferregung)", hint: "P negativ in II, III, aVF – Hinweis auf AV-junktionalen Rhythmus oder retrograde Leitung." },
    { id: "p-av-dissoziation", label: "P-Wellen unabhängig von den QRS-Komplexen (AV-Dissoziation)", warn: true, hint: "Vorhof- und Kammererregung laufen unabhängig voneinander ab, z. B. bei AV-Block III° oder ventrikulärer Tachykardie." },
    { id: "p-vor-jedem-qrs-plus-extra", label: "P-Welle vor jedem QRS-Komplex, dazwischen zusätzliche (nicht übergeleitete) P-Wellen", hint: "Typisch für Vorhofflattern oder atriale Tachykardie mit fixierter Überleitung (z. B. 2:1- oder 3:1-Block) bzw. für gehäufte blockierte atriale Extrasystolen." },
    { id: "p-saegezahn", label: "Sägezahnartige P-Wellen mit positiver/negativer Amplitude", warn: true, hint: "Typisches Flatterwellen-Muster (v. a. in II, III, aVF), am ausgeprägtesten bei Vorhofflattern; Polarität abhängig von der Kreiserregungsrichtung (typisch gegen den Uhrzeigersinn: negativ inferior)." }
  ];

  var QRS_FINDINGS = [
    { id: "delta-welle", label: "Delta-Welle (verwaschener, träger Beginn des QRS-Komplexes)", hint: "Ausdruck einer ventrikulären Präexzitation über eine akzessorische Leitungsbahn (Kent-Bündel), typischerweise kombiniert mit verkürzter PQ-Zeit und leicht verbreitertem QRS-Komplex (WPW-Syndrom)." },
    { id: "rsb-verzoegert", label: "Verspätung des oberen Umschlagpunktes in V1–V3 (Hinweis auf Rechtsschenkelblock)", hint: "Oberer Umschlagpunkt (Zeit bis zum R-Gipfel) in V1/V2 > 30 ms spricht für eine rechtsventrikuläre Leitungsverzögerung." },
    { id: "lsb-verzoegert", label: "Verspätung des oberen Umschlagpunktes in V4–V6 (Hinweis auf Linksschenkelblock)", hint: "Oberer Umschlagpunkt in V5/V6 > 50 ms spricht für eine linksventrikuläre Leitungsverzögerung." },
    { id: "rsb-inkomplett", label: "Inkompletter Rechtsschenkelblock", hint: "Konfiguration wie kompletter RSB (rsR' in V1, breites S in I/V6), jedoch QRS-Breite < 120 ms." },
    { id: "lsb-inkomplett", label: "Inkompletter Linksschenkelblock", hint: "Konfiguration wie kompletter LSB, jedoch QRS-Breite < 120 ms." },
    { id: "niedervoltage", label: "Niedervoltage", hint: "Keine Amplitude (R oder S) in den Extremitätenableitungen > 0,5 mV bzw. in den Brustwandableitungen > 1,0 mV. DD Adipositas, Perikarderguss, Lungenemphysem, Hypothyreose, Amyloidose." },
    { id: "sokolow-rv", label: "Sokolow-Index für Rechtsherzhypertrophie pathologisch", hasValue: "rv", hint: "RV1 (bzw. RV2) + SV5 (bzw. SV6) ≥ 1,05 mV. Niedrige Sensitivität, hohe Spezifität; im Kontext mit Rechtstyp/P-dextrocardiale beurteilen." },
    { id: "sokolow-lv", label: "Sokolow-Lyon-Index für Linksherzhypertrophie pathologisch", hasValue: "lv", hint: "SV1 (bzw. SV2) + RV5 (bzw. RV6) ≥ 3,5 mV. Sensitivität gering (~20 %), Spezifität hoch (> 85 %); erst ab dem 30. Lebensjahr verwertbar, bei Adipositas oft falsch negativ." },
    { id: "avl-hypertrophie", label: "R in aVL > 11 mm (zusätzliches Hypertrophiezeichen)", hint: "Weiteres, von der Herzachse relativ unabhängiges Kriterium der linksventrikulären Hypertrophie." },
    { id: "strain-pattern", label: 'Sekundäre Erregungsrückbildungsstörung links-präkordial ("Strain-Pattern")', hint: "Deszendierende ST-Senkung mit asymmetrischer T-Negativierung in I, aVL, V5/V6 – typische Begleitveränderung bei ausgeprägter LV-Hypertrophie." }
  ];

  var ST_FINDINGS_BASIC = [
    { id: "st-nicht-signifikant", label: "ST-Strecke mit nicht signifikanter Senkung", leads: true, hint: "Senkung < 0,05 mV (< 0,5 mm) gegenüber der isoelektrischen Linie – in der Regel nicht als pathologisch zu werten." },
    { id: "st-signifikant-horizontal", label: "ST-Strecke mit signifikanter horizontaler Senkung", leads: true, hint: "Neue horizontale Senkung ≥ 0,05 mV (≥ 0,5 mm) in ≥ 2 benachbarten Ableitungen gilt als signifikant; hohe Ischämiespezifität." },
    { id: "st-signifikant-deszendierend", label: "ST-Strecke mit signifikanter deszendierender Senkung", leads: true, hint: 'Deszendierender Verlauf mit Senkung ≥ 0,05–0,1 mV, ischämietypisch, DD auch bei Hypertrophie ("Strain") und Digitalis-Effekt (muldenförmig).' },
    { id: "st-traege-aszendierend", label: "Träge aszendierende ST-Strecke", leads: true, hint: "ST-Segment noch 60–80 ms nach dem J-Punkt ≥ 0,1 mV unterhalb der Nulllinie – grenzwertiger, belastungsabhängig relevanter Befund." }
  ];
  var ST_FINDINGS_OMI = [
    { id: "st-hebung-signifikant", label: "Signifikante ST-Streckenhebung", leads: true, warn: true, hint: "In der Regel > 0,1 mV in Extremitäten-/lateralen Ableitungen; in V2/V3 alters- und geschlechtsabhängig höhere Schwellen. Klassisches STEMI-Kriterium." },
    { id: "sgarbossa-a", label: "Sgarbossa-Kriterium A: ST-Hebung > 1 mm konkordant in Ableitungen mit positivem QRS (V4–6, aVL, I) bei bestehendem LSB", warn: true, points: 5, hint: "5 Punkte im (modifizierten) Sgarbossa-Score." },
    { id: "sgarbossa-b", label: "Sgarbossa-Kriterium B: ST-Senkung > 1 mm konkordant in V1–V3", warn: true, points: 3, hint: "3 Punkte im Sgarbossa-Score." },
    { id: "sgarbossa-c", label: "Sgarbossa-Kriterium C: ST-Hebung > 25 % des vorangehenden S in Ableitungen mit diskordantem QRS-Komplex", warn: true, points: 2, hint: "2 Punkte im (modifizierten) Sgarbossa-Score (ursprünglich fix ≥ 5 mm)." },
    { id: "avr-hebung", label: 'Isolierte signifikante ST-Hebung > 1 mm in aVR bei gleichzeitiger ST-Senkung in ≥ 6 Ableitungen ("Sign-to-Heaven")', warn: true, hint: "Verdachtsmoment für eine Hauptstammstenose bzw. hochgradige proximale RIVA-/Mehrgefäßerkrankung – kardiologischer Notfall." },
    { id: "dewinter", label: "DeWinter-Zeichen: signifikante ST-Senkung in V1–V6 mit Übergang in überhöhtes, symmetrisches T", warn: true, hint: "STEMI-Äquivalent für eine akute proximale RIVA-Okklusion (Vorderwandischämie) – sofortige kardiologische Vorstellung." },
    { id: "wellens", label: "Wellens-Zeichen: leichtgradige ST-Hebung mit Übergang in terminal negatives/biphasisches T in V2–V3", warn: true, hint: "Hinweis auf eine kritische proximale LAD-Stenose im beschwerdefreien Intervall – zeitnahe Koronarangiographie empfohlen." }
  ];
  var ST_FINDINGS_DIFF = [
    { id: "perikarditis-muster", label: "Perikarditis-Muster: diffuse, konkavförmige ST-Streckenhebung in mehreren, nicht territorial begrenzten Ableitungsgruppen mit PR-Senkung (außer aVR/V1: PR-Hebung)", leads: true, hint: "Differentialdiagnose zur regionalen, meist konvexen ST-Hebung beim STEMI. Klinische Korrelation und Echokardiographie empfohlen." },
    { id: "early-repolarization", label: "Frühe Repolarisation (Early Repolarization): J-Punkt-Hebung mit Notching/Slurring am Ende des QRS-Komplexes und konkaver ST-Hebung", leads: true, hint: "Typisch: J-Punkt-Hebung ≥ 0,1 mV in ≥ 2 benachbarten Ableitungen (außer V1–V3), End-QRS-Notch (\"Fish-hook\") oder -Slur, schmaler QRS (< 120 ms), konkave ST-Hebung, oft hohe/spitze T-Wellen; häufig inferior/lateral, gelegentlich reziproke ST-Senkung in aVR. Meist junge, gesunde bzw. sportliche Patienten – benigne Normalvariante, bei Nachweis in inferioren/lateralen Ableitungen aber mit gering erhöhtem Risiko für ventrikuläre Arrhythmien assoziiert. Abgrenzung zu STEMI (keine regionale Konvexität, kein Terminal-T-Verlust) und Perikarditis (keine PR-Senkung, kein diffuses Muster über alle Ableitungsgruppen) wichtig." }
  ];
  var ST_FINDINGS = ST_FINDINGS_BASIC.concat(ST_FINDINGS_OMI).concat(ST_FINDINGS_DIFF);

  var T_FINDINGS = [
    { id: "t-abgeflacht", label: "Abgeflachte T-Wellen", hint: "Unspezifisch; möglicher Hinweis auf Hypokaliämie, auch bei KHK, Kardiomyopathie oder als Zufallsbefund." },
    { id: "t-ueberspitzt", label: "Überspitzte bis zeltförmige T-Wellen", hint: 'Möglicher Hinweis auf Hyperkaliämie (schmalbasig, hoch) oder Frühphase einer Ischämie ("hyperakutes T").' },
    { id: "t-praeterminal", label: "Präterminale T-Negativierung", leads: true, hint: "T-Welle biphasisch mit initial positiver, dann negativer Komponente – häufig bei Hypertrophie, KHK, Zustand nach NSTEMI." },
    { id: "t-terminal", label: "Terminale T-Negativierung ohne weitere Veränderungen", leads: true, hint: 'Isolierte, überwiegend negative T-Welle ohne begleitende ST-Veränderung – unspezifisch, ggf. Zustand nach Ischämie/Myokarditis oder zerebral ("cerebral T").' },
    { id: "t-u-welle", label: "Zusätzliche U-Welle bzw. T-U-Verschmelzungswelle", leads: true, hint: "Klassisch bei Hypokaliämie; auch bei Bradykardie physiologisch, insb. präkordial V2–V4." }
  ];

  var MERKMALE = {
    "absolute-arrhythmie": ["Absolut unregelmäßige RR-Abstände ohne erkennbares Muster", "Keine abgrenzbaren P-Wellen, ggf. feine/grobe Flimmerwellen als Grundlinienundulation", "Bei Vorhofflattern mit wechselnder Überleitung: sägezahnartige Flatterwellen mit variablem Block"],
    "p-doppelgipflig": ["Verbreiterte P-Welle > 120 ms, doppelgipflig/biphasisch (\"M-förmig\"), am deutlichsten in Ableitung II und V1", "Terminal negative, verbreiterte Komponente in V1 möglich", "Ausdruck einer Leitungsverzögerung/Vergrößerung des linken Vorhofs, klassisch z. B. bei Mitralstenose"],
    "p-dextrocardiale": ["P-Amplitude > 0,25 mV, am deutlichsten in Ableitung II und V1 (\"P-pulmonale\")", "Spitz-hohe, aber nicht verbreiterte P-Welle", "Hinweis auf rechtsatriale Druckbelastung, z. B. Cor pulmonale, pulmonale Hypertonie, Trikuspidalstenose"],
    "p-biatrial": ["Kombination aus Amplitudenerhöhung (> 0,25 mV) UND Verbreiterung (> 120 ms)", "Hinweis auf kombinierte rechts- und linksatriale Vergrößerung"],
    "p-flimmerwellen": ["Keine abgrenzbaren P-Wellen erkennbar", "Unregelmäßige, undulierende Grundlinie unterschiedlicher Amplitude und Frequenz (350–600/min)", "Absolut arrhythmische Kammerüberleitung als Begleitbefund typisch"],
    "p-saegezahn": ["Regelmäßige, sägezahnartige Vorhofwellen, am deutlichsten in II, III, aVF", "Frequenz meist um 300/min, feste oder wechselnde Überleitung (z. B. 2:1)", "Polarität abhängig von Kreiserregungsrichtung (typisch: negativ inferior)"],
    "p-av-dissoziation": ["P-Wellen und QRS-Komplexe treten unabhängig voneinander auf", "Wechselnder PQ-Abstand, gelegentlich \"wandernde\" P-Welle im QRS/ST-Bereich sichtbar", "Hinweis auf AV-Block III° oder AV-junktionalen/ventrikulären Ersatzrhythmus"],
    "delta-welle": ["Träger, verwaschener Beginn (\"Delta\") der R-Zacke", "Kombiniert mit verkürzter PQ-Zeit (< 120 ms) und leicht verbreitertem QRS", "Ausdruck der vorzeitigen Erregung über eine akzessorische Leitungsbahn"],
    "rsb-verzoegert": ["Oberer Umschlagpunkt in V1/V2 > 30 ms verzögert", "Bei komplettem Block: rSR'- bzw. M-Konfiguration in V1, breites, plumpes S in I und V6"],
    "lsb-verzoegert": ["Oberer Umschlagpunkt in V5/V6 > 50 ms verzögert", "Bei komplettem Block: breiter, plumper, oft gekerbter R-Verlust in V5/V6, tiefes S in V1"],
    "niedervoltage": ["Keine Amplitude (R oder S) > 0,5 mV in den Extremitätenableitungen", "Keine Amplitude > 1,0 mV in den Brustwandableitungen", "DD: Adipositas, Perikarderguss, Lungenemphysem, Hypothyreose, Amyloidose"],
    "sokolow-rv": ["RV1 (bzw. RV2) + SV5/6 ≥ 1,05 mV", "Häufig kombiniert mit Rechtstyp und P-dextrocardiale"],
    "sokolow-lv": ["SV1 (bzw. SV2) + RV5/6 ≥ 3,5 mV", "Erst ab dem 30. Lebensjahr verwertbar, bei Adipositas häufig falsch negativ"],
    "strain-pattern": ["Deszendierende ST-Senkung mit asymmetrischer T-Negativierung", "Typische Lokalisation: I, aVL, V5/V6", "Begleitbefund einer ausgeprägten linksventrikulären Hypertrophie"],
    "st-hebung-signifikant": ["Konvexbogige (\"Katzenbuckel\") oder horizontale ST-Hebung, regional begrenzt (Territorium)", "Meist begleitet von spiegelbildlichen ST-Senkungen (reziproke Veränderungen)"],
    "sgarbossa-a": ["ST-Hebung ≥ 1 mm konkordant zum positiven QRS-Hauptausschlag bei bestehendem LSB", "5 Punkte im (modifizierten) Sgarbossa-Score"],
    "sgarbossa-b": ["ST-Senkung ≥ 1 mm konkordant in V1–V3", "3 Punkte im Sgarbossa-Score"],
    "sgarbossa-c": ["Exzessiv diskordante ST-Hebung in Ableitungen mit negativem QRS-Hauptausschlag", "Modifiziert bewertet als Verhältnis ST-Hebung/vorangehendes S > 25 %"],
    "avr-hebung": ["Isolierte ST-Hebung > 1 mm in aVR", "Gleichzeitige ST-Senkung in ≥ 6 weiteren Ableitungen (\"Sign-to-Heaven\")"],
    "dewinter": ["Aufsteigende ST-Senkung in V1–V6 mit Übergang in hohe, symmetrische T-Wellen", "Keine klassische ST-Hebung, dennoch STEMI-Äquivalent"],
    "wellens": ["Typ A (~25 %): biphasische T-Welle in V2/V3", "Typ B (~75 %): tief-symmetrisch negative T-Welle in V2/V3", "Nur geringe oder keine ST-Hebung, im beschwerdefreien Intervall"],
    "perikarditis-muster": ["Diffuse, konkavförmige (\"lächelnde\") ST-Hebung ohne territoriale Zuordnung", "Begleitende PR-Streckensenkung (außer in aVR/V1: PR-Hebung)", "Keine reziproken ST-Senkungen wie beim STEMI"],
    "early-repolarization": ["J-Punkt-Hebung ≥ 0,1 mV in ≥ 2 benachbarten Ableitungen (außer V1–V3), oft mit End-QRS-Notch (\"Fish-hook\", klassisch in V4) oder -Slur", "Konkave ST-Hebung, schmaler QRS (< 120 ms) in nicht betroffenen Ableitungen, häufig hohe/spitze T-Wellen", "Bevorzugt inferior/lateral (II, III, aVF, I, aVL, V4–V6); bei isoliertem Vorkommen in V1–V3 eigenständige (meist benigne) Entität", "Meist junge, gesunde bzw. sportliche Patienten; bei inferior/lateraler Lokalisation gering erhöhtes Risiko für ventrikuläre Arrhythmien beschrieben", "Abgrenzung: keine regionale Konvexität/kein Terminal-T-Verlust wie beim STEMI, keine PR-Senkung/kein diffuses Muster wie bei Perikarditis"],
    "t-ueberspitzt": ["Schmalbasige, symmetrische, spitz-zeltförmige T-Wellen mit erhöhter Amplitude", "DD Hyperkaliämie vs. hyperakutes Ischämie-T (asymmetrisch, breitbasiger)"],
    "t-praeterminal": ["Biphasische T-Welle: initial positive, dann negative Komponente", "Typisch bei Hypertrophie oder nach NSTEMI"],
    "t-terminal": ["Isoliert negative, meist symmetrische T-Welle ohne begleitende ST-Streckenveränderung", "Unspezifisch – DD Zustand nach Ischämie/Myokarditis, zerebrale Genese, Zufallsbefund"],
    "t-u-welle": ["Zusätzliche, meist niedrig-amplitudige Welle nach der T-Welle, präkordial (V2–V4) am deutlichsten", "Klassisch bei Hypokaliämie, auch physiologisch bei Bradykardie"]
  };

  var LEAD_TERRITORIES = [
    { name: "anteroseptal", leads: ["V1", "V2", "V3"] },
    { name: "anterior (Vorderwand)", leads: ["V3", "V4"] },
    { name: "anterolateral", leads: ["V4", "V5", "V6"] },
    { name: "hochlateral", leads: ["I", "aVL"] },
    { name: "tieflateral", leads: ["V5", "V6"] },
    { name: "inferior (Hinterwand)", leads: ["II", "III", "aVF"] }
  ];
  function territoryMatches(leadsObj) {
    if (!leadsObj) return [];
    var out = [];
    LEAD_TERRITORIES.forEach(function (t) {
      var overlap = t.leads.filter(function (l) { return leadsObj[l]; }).length;
      if (overlap >= 2) out.push(t.name);
    });
    return out;
  }
  function territoryPhrase(leadsObj) {
    var m = territoryMatches(leadsObj);
    return m.length ? " (Verteilungsmuster passend zu " + m.join(" bzw. ") + ")" : "";
  }
  function leadsListText(leadsObj) {
    if (!leadsObj) return "";
    return LEADS_ALL.filter(function (l) { return leadsObj[l]; }).join(", ");
  }

  var ICD_BY_SUGGESTION = {
    "dd-vhf": "I48.9G",
    "dd-vhflattern": "I48.0G",
    "avblock1": "I44.0G",
    "rsb-komplett": "I45.1G",
    "lsb-komplett": "I44.7G",
    "wpw": "I45.6G"
  };
  var CRITICAL_SUGGESTIONS = ["st-hebung-s", "sgarbossa-pos", "hauptstamm", "dewinter-s", "wellens-s", "qtc-lang", "nordwest-s", "dd-avdissoz"];

  /* ======================================================================
     STATE
     ====================================================================== */
  function ekgState(s) {
    s.ekg = s.ekg || {};
    var d = s.ekg;
    if (!d.geschlecht) d.geschlecht = "unbekannt";
    if (d.freq === undefined) d.freq = "";
    if (!d.regelmaessig) d.regelmaessig = "regelmaessig";
    if (!d.rhythmus) d.rhythmus = "normofrequenter-sinusrhythmus";
    if (d.rhythmusSonstText === undefined) d.rhythmusSonstText = "";
    if (d.schrittmacherModus === undefined) d.schrittmacherModus = "";
    d.extra = d.extra || { svesChecked: false, svesHaeufigkeit: "vereinzelt", vesChecked: false, vesMorphologie: "monomorph", vesHaeufigkeit: "vereinzelt" };
    if (!d.lagetyp) d.lagetyp = "indifferenztyp";
    d.p = d.p || { dauerPath: false, dauerWert: "", amplPath: false, amplRichtung: "erhoeht", amplWert: "", findings: {}, sonstText: "" };
    if (d.pqWert === undefined) d.pqWert = "";
    d.qrs = d.qrs || { verbreitertWert: "", findings: {}, sokolowLvWert: "", sokolowRvWert: "", sonstText: "" };
    if (d.qtcWert === undefined) d.qtcWert = "";
    d.st = d.st || { isoelektrisch: true, findings: {}, sonstText: "" };
    d.t = d.t || { findings: {}, sonstText: "" };
    d.beurteilungChecked = d.beurteilungChecked || {};
    if (d.beurteilungFreitext === undefined) d.beurteilungFreitext = "";
    return d;
  }
  function isPNormal(d) {
    return !d.p.dauerPath && !d.p.amplPath && Object.keys(d.p.findings).every(function (k) { return !d.p.findings[k]; }) && !hasText(d.p.sonstText);
  }
  function isQrsNormal(d) {
    return !hasText(d.qrs.verbreitertWert) && Object.keys(d.qrs.findings).every(function (k) { return !d.qrs.findings[k]; }) && !hasText(d.qrs.sonstText);
  }
  function isTNormal(d) {
    return Object.keys(d.t.findings).every(function (k) { return !(d.t.findings[k] && d.t.findings[k].checked); }) && !hasText(d.t.sonstText);
  }
  function computeSgarbossaScore(d) {
    var score = 0;
    ["sgarbossa-a", "sgarbossa-b", "sgarbossa-c"].forEach(function (id) {
      var f = d.st.findings[id];
      if (f && f.checked) score += (ST_FINDINGS.filter(function (x) { return x.id === id; })[0] || {}).points || 0;
    });
    return score;
  }
  function qrsFlag(v) {
    if (!hasText(v)) return null;
    var n = parseInt(v, 10);
    if (isNaN(n)) return null;
    if (n >= 120) return { label: "pathologisch verbreitert", farbe: "var(--rot)" };
    if (n >= 110) return { label: "grenzwertig", farbe: "var(--orange)" };
    return { label: "im Normbereich", farbe: "var(--gruen)" };
  }
  function qtcThresholds(geschlecht) {
    if (geschlecht === "m") return { normal: 440 };
    if (geschlecht === "w") return { normal: 460 };
    return { normal: 450 };
  }
  function qtcFlag(v, geschlecht) {
    if (!hasText(v)) return null;
    var n = parseInt(v, 10);
    if (isNaN(n)) return null;
    var th = qtcThresholds(geschlecht);
    if (n < 350) return { label: "verkürzt – DD Short-QT-Syndrom, Hyperkalzämie, Digitalis-Effekt", farbe: "var(--rot)" };
    if (n >= 500) return { label: "deutlich verlängert – erhöhtes Risiko für Torsade-de-pointes-Tachykardien", farbe: "var(--rot)" };
    if (n > th.normal) return { label: "verlängert (Grenzwert " + (geschlecht === "m" ? "Männer" : geschlecht === "w" ? "Frauen" : "unbek. Geschlecht") + " > " + th.normal + " ms)", farbe: "var(--orange)" };
    return { label: "im Normbereich", farbe: "var(--gruen)" };
  }
  function qtcHasBbbContext(d) {
    var qrsBreite = parseInt(d.qrs.verbreitertWert || "0", 10);
    var qrsWide = hasText(d.qrs.verbreitertWert) && qrsBreite >= 120;
    return qrsWide || d.qrs.findings["rsb-verzoegert"] || d.qrs.findings["lsb-verzoegert"] || d.rhythmus === "schrittmacherrhythmus";
  }

  /* ======================================================================
     CABRERA-KREIS (SVG)
     ====================================================================== */
  function polar(cx, cy, r, deg) {
    var rad = deg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arcPath(cx, cy, r, a1, a2) {
    var p1 = polar(cx, cy, r, a1), p2 = polar(cx, cy, r, a2);
    var large = (a2 - a1) > 180 ? 1 : 0;
    return "M " + cx + " " + cy + " L " + p1.x.toFixed(1) + " " + p1.y.toFixed(1) + " A " + r + " " + r + " 0 " + large + " 1 " + p2.x.toFixed(1) + " " + p2.y.toFixed(1) + " Z";
  }
  function buildCabreraSVG() {
    var cx = 130, cy = 130, r = 100;
    var colors = { "ueberdrehter-linkstyp": "#f6c9c2", "linkstyp": "#cfe8dc", "indifferenztyp": "#a9d9c1", "steiltyp": "#cfe8dc", "rechtstyp": "#f6c9c2", "nordwesttyp": "#eeb6ac" };
    var sectors = "";
    LAGETYP_OPTIONS.forEach(function (opt) {
      if (opt.angleFrom === null || opt.angleFrom === undefined) return;
      sectors += '<path d="' + arcPath(cx, cy, r, opt.angleFrom, opt.angleTo) + '" fill="' + (colors[opt.id] || "#eee") + '" fill-opacity="0.5" data-ekg-sector="' + esc(opt.id) + '" stroke="#fff" stroke-width="1"></path>';
      if (opt.angleFromExtra != null) {
        sectors += '<path d="' + arcPath(cx, cy, r, opt.angleFromExtra, opt.angleToExtra) + '" fill="' + colors[opt.id] + '" fill-opacity="0.5" data-ekg-sector="' + esc(opt.id) + '" stroke="#fff" stroke-width="1"></path>';
      }
    });
    var leadDefs = [{ n: "I", d: 0 }, { n: "II", d: 60 }, { n: "III", d: 120 }, { n: "aVR", d: -150 }, { n: "aVL", d: -30 }, { n: "aVF", d: 90 }];
    var lines = "";
    leadDefs.forEach(function (l) {
      var p1 = polar(cx, cy, r + 2, l.d), p2 = polar(cx, cy, r + 2, l.d + 180), lbl = polar(cx, cy, r + 15, l.d);
      lines += '<line x1="' + p1.x.toFixed(1) + '" y1="' + p1.y.toFixed(1) + '" x2="' + p2.x.toFixed(1) + '" y2="' + p2.y.toFixed(1) + '" stroke="#025669" stroke-width="1" opacity="0.5"></line>';
      lines += '<text x="' + lbl.x.toFixed(1) + '" y="' + lbl.y.toFixed(1) + '" font-size="10" fill="#013D4B" text-anchor="middle" dominant-baseline="middle" font-weight="600">' + l.n + "</text>";
    });
    return '<svg width="260" height="260" viewBox="0 0 260 260" data-ekg-cabrera style="background:#fff;border-radius:10px;border:1px solid var(--linie);flex-shrink:0">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fbfbf9" stroke="#d8d3c6"></circle>' + sectors +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#d8d3c6"></circle>' + lines +
      '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="#013D4B"></circle></svg>';
  }

  /* ======================================================================
     GEMEINSAME BAUSTEINE (Karten, Merkmale-Panel, Bild-Modal)
     ====================================================================== */
  function merkmaleHtml(id) {
    var list = MERKMALE[id];
    if (!list) return "";
    var panelId = "mk_" + id;
    return '<button class="derm-help" type="button" data-ekg-help="' + esc(panelId) + '">▸ Merkmale</button>' +
      '<div class="derm-help-panel" data-ekg-help-panel="' + esc(panelId) + '"><div class="derm-hint"><ul style="margin:0 0 0 16px;padding:0">' +
      list.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul></div></div>";
  }
  function cardHtml(kind, id, title, hint, opts) {
    opts = opts || {};
    var badge = opts.points ? ' <span class="badge b-orange">' + opts.points + " Punkte</span>" : "";
    var rangeTxt = opts.range ? ' <span style="color:var(--grau);font-weight:400">(' + esc(opts.range) + ")</span>" : "";
    var extra = "";
    if (opts.hasValue) {
      extra += '<div class="form-row" data-ekg-extra="' + esc(id) + '" style="display:none;padding:0 0 8px">' +
        '<label>Summe (mV)</label><input type="number" min="0" max="10" step="0.01" data-ekg-sokolow="' + esc(opts.hasValue) + '" style="width:90px"><span class="unit">mV</span></div>';
    }
    if (opts.leads) {
      extra += '<div class="leads-box-ekg" data-ekg-extra="' + esc(id) + '" style="display:none;flex-direction:column;gap:6px;margin:0 0 8px;padding:9px 10px;background:var(--grau-h);border-radius:9px">' +
        '<div style="font-size:11px;color:var(--grau)">betroffene Ableitungen:</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px">' + LEADS_ALL.map(function (l) {
          return '<span class="unit-btn" data-ekg-lead-for="' + esc(id) + '" data-lead="' + esc(l) + '">' + esc(l) + "</span>";
        }).join("") + "</div></div>";
    }
    extra += merkmaleHtml(id);
    return '<div class="derm-card' + (opts.warn ? " warn" : "") + '" data-ekg-card="' + kind + '" data-id="' + esc(id) + '">' +
      '<div class="derm-card-top"><div class="derm-card-title">' + esc(title) + rangeTxt + badge + "</div>" +
      (hint ? '<div class="derm-card-desc">' + esc(hint) + "</div>" : "") + "</div>" + extra + "</div>";
  }
  /* ======================================================================
     RENDER — 8 Abschnitte
     ====================================================================== */
  function render(el) {
    switch (el.ansicht) {
      case "rhythmus": return renderRhythmus();
      case "lagetyp": return renderLagetyp();
      case "p": return renderP();
      case "pq": return renderPq();
      case "qrs": return renderQrs();
      case "st": return renderSt();
      case "t": return renderT();
      case "beurteilung": return renderBeurteilung();
      default: return "";
    }
  }

  function renderRhythmus() {
    var html = '<div class="box bx-blue"><div class="lbl">Hinweis</div>Rhythmus/Frequenz erfassen (Einfachauswahl) sowie ggf. Extrasystolie.</div>';
    html += '<div class="form-row"><label>Geschlecht</label><select data-ekg-geschlecht>' +
      labeledOptsHtml([["unbekannt", "unbekannt"], ["m", "männlich"], ["w", "weiblich"]], "unbekannt") + "</select>" +
      '<span class="hint" style="margin:0">für geschlechtsspezifische QTc-Grenzwerte, nicht Teil des PVS-Textes</span></div>';
    html += '<div class="form-row"><label>Herzfrequenz</label>' +
      '<input type="number" min="20" max="300" placeholder="z. B. 72" data-ekg-freq style="width:80px"><span class="unit">/min</span>' +
      '<label style="margin-left:14px">Kammerrhythmus</label><select data-ekg-regel>' +
      '<option value="regelmaessig">regelmäßig</option><option value="unregelmaessig">unregelmäßig</option></select></div>';
    html += RHYTHMUS_OPTIONS.map(function (o) { return cardHtml("rhythmus", o.id, o.label, o.hint, { warn: o.warn }); }).join("");
    html += '<div class="form-row" data-ekg-extra="rhythmus-freitext" style="display:none">' +
      '<input type="text" data-ekg-text="rhythmusSonstText" placeholder="Freitext Rhythmus …" style="flex:1;min-width:220px"></div>';
    html += '<div class="form-row" data-ekg-extra="rhythmus-schrittmacher" style="display:none"><select data-ekg-schrittmacher>' +
      '<option value="">Stimulationsmodus wählen …</option><option>VVI (Einkammer, ventrikulär)</option><option>AAI (Einkammer, atrial)</option>' +
      '<option>DDD (Zweikammer)</option><option>CRT (biventrikulär)</option><option>Modus unbekannt</option></select></div>';
    html += '<div class="sec">Extrasystolie</div>';
    html += cardHtml("extra", "sves", "Supraventrikuläre Extrasystolen (SVES)", "Vorzeitiger, meist normal konfigurierter QRS-Komplex mit vorausgehender, abweichend konfigurierter P-Welle.");
    html += '<div class="form-row" data-ekg-extra="sves" style="display:none;padding-left:8px"><label>Häufigkeit</label>' +
      '<select data-ekg-select="svesHaeufigkeit">' + optsHtml(["vereinzelt", "gehäuft", "bigeminusartig"], "vereinzelt") + "</select></div>";
    html += cardHtml("extra", "ves", "Ventrikuläre Extrasystolen (VES)", "Vorzeitiger, verbreiterter QRS-Komplex ohne vorausgehende P-Welle, meist gefolgt von kompensatorischer Pause.");
    html += '<div class="form-row" data-ekg-extra="ves" style="display:none;padding-left:8px">' +
      '<label>Morphologie</label><select data-ekg-select="vesMorphologie">' + optsHtml(["monomorph", "polymorph"], "monomorph") + "</select>" +
      '<label>Häufigkeit</label><select data-ekg-select="vesHaeufigkeit">' + optsHtml(["vereinzelt", "gehäuft", "bigeminusartig", "mit Couplets (Paare)", "mit Salven (≥3 konsekutiv, nsVT)"], "vereinzelt") + "</select></div>";
    return '<div data-ekg-tool="rhythmus">' + html + "</div>";
  }

  function renderLagetyp() {
    var html = '<div class="box bx-blue"><div class="lbl">Hinweis</div>Elektrische Herzachse in der Frontalebene, bestimmt anhand der Extremitätenableitungen. Cabrera-Kreis als Orientierungshilfe: farbig hervorgehoben = gewählter Sektor.</div>';
    html += '<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start;margin:10px 0">' + buildCabreraSVG() +
      '<div class="hint" style="max-width:260px;margin:0">0° entspricht Ableitung I, Winkel im Uhrzeigersinn zunehmend. Grüne Linien: relative Ableitungsvektoren (I, II, III, aVR, aVL, aVF).' +
      "</div></div>";
    html += LAGETYP_OPTIONS.map(function (o) { return cardHtml("lagetyp", o.id, o.label, o.hint, { warn: o.warn, range: o.range }); }).join("");
    return '<div data-ekg-tool="lagetyp">' + html + "</div>";
  }

  function renderP() {
    var html = '<div class="box bx-green" data-ekg-badge="p-normal"><div class="lbl">Standard</div>Regelrechte P-Welle ohne Auffälligkeiten.</div>';
    html += '<div class="sec">Messwerte bei pathologischem Befund</div>';
    html += '<div class="hint" style="margin-top:-4px">Beurteilung vorrangig anhand Ableitung II und V1.</div>';
    html += cardHtml("p-toggle", "p-dauer", "P-Dauer pathologisch verlängert", "Norm bis 120 ms (Ableitung II).");
    html += '<div class="form-row" data-ekg-extra="p-dauer" style="display:none;padding-left:8px">' +
      '<input type="number" min="0" max="300" data-ekg-num="p.dauerWert" style="width:80px"><span class="unit">ms</span></div>';
    html += cardHtml("p-toggle", "p-ampl", "P-Amplitude pathologisch", "Norm bis 0,25 mV (Ableitung II). Erhöhung spricht für P-dextrocardiale; Abflachung ist ein möglicher Hinweis auf Hyperkaliämie.");
    html += '<div class="form-row" data-ekg-extra="p-ampl" style="display:none;padding-left:8px">' +
      '<select data-ekg-select="pAmplRichtung">' +
      '<option value="erhoeht">erhöht (P-dextrocardiale)</option><option value="erniedrigt">abgeflacht (ggf. H. a. Hyperkaliämie)</option></select>' +
      '<input type="number" min="0" max="2" step="0.01" data-ekg-num="p.amplWert" style="width:70px"><span class="unit">mV</span></div>';
    html += '<div class="sec">P-Wellen-Morphologie und rhythmologische Auffälligkeiten (Mehrfachauswahl)</div>';
    html += P_FINDINGS.map(function (f) { return cardHtml("p", f.id, f.label, f.hint, { warn: f.warn }); }).join("");
    html += '<div class="form-row"><input type="text" data-ekg-text="p.sonstText" placeholder="Sonstiges – Freitext …" style="flex:1;min-width:220px"></div>';
    return '<div data-ekg-tool="p">' + html + "</div>";
  }

  function renderPqBody(d) {
    if (d.p.findings["p-fehlend"] || d.p.findings["p-flimmerwellen"]) {
      return '<div class="box bx-orange"><div class="lbl">Nicht beurteilbar</div>P-Wellen nicht vorhanden/darstellbar – PQ-Zeit nicht beurteilbar.</div>';
    }
    return '<div class="box bx-green" data-ekg-badge="pq-normal" style="' + (hasText(d.pqWert) ? "display:none" : "") + '"><div class="lbl">Standard</div>PQ-Zeit im Normbereich.</div>' +
      '<div class="form-row"><input type="number" min="0" max="400" placeholder="ms" data-ekg-num="pqWert" style="width:90px"><span class="unit">ms</span>' +
      '<span class="hint" style="margin:0">Norm: 120–200 ms. &lt; 120 ms: DD Präexzitation (WPW, LGL). &gt; 200 ms: AV-Block I°.</span></div>';
  }
  function renderPq() {
    return '<div data-ekg-tool="pq"><div data-ekg-pq-body>' + renderPqBody({ p: { findings: {} }, pqWert: "" }) + "</div></div>";
  }

  function renderQrs() {
    var html = '<div class="box bx-green" data-ekg-badge="qrs-normal"><div class="lbl">Standard</div>QRS mit normaler Länge.</div>';
    html += '<div class="form-row"><label>QRS-Breite</label><input type="number" min="0" max="400" placeholder="ms" data-ekg-num="qrs.verbreitertWert" style="width:90px">' +
      '<span class="unit">ms</span><span data-ekg-flag="qrs" style="font-size:.85rem;font-weight:600"></span>' +
      '<span class="hint" style="margin:0">110–120 ms grenzwertig, &gt; 120 ms pathologisch.</span></div>';
    html += QRS_FINDINGS.map(function (f) { return cardHtml("qrs", f.id, f.label, f.hint, { hasValue: f.hasValue }); }).join("");
    html += '<div class="form-row"><input type="text" data-ekg-text="qrs.sonstText" placeholder="Sonstiges – Freitext …" style="flex:1;min-width:220px"></div>';
    return '<div data-ekg-tool="qrs">' + html + "</div>";
  }

  function renderSt() {
    var html = cardHtml("st-iso", "iso", "Isoelektrische ST-Strecke, unauffällige Erregungsrückbildung", "");
    html += ST_FINDINGS_BASIC.map(function (f) { return cardHtml("st", f.id, f.label, f.hint, { leads: f.leads }); }).join("");
    html += '<div class="sec" style="color:var(--rot)">⚠ OMI-Kriterien / STEMI-Äquivalente (Hochrisikomuster für akuten Koronarverschluss)</div>';
    html += ST_FINDINGS_OMI.map(function (f) { return cardHtml("st", f.id, f.label, f.hint, { leads: f.leads, warn: f.warn, points: f.points }); }).join("");
    html += '<div class="sec" style="color:var(--blau)">Differentialdiagnose bei ST-Hebung</div>';
    html += ST_FINDINGS_DIFF.map(function (f) { return cardHtml("st", f.id, f.label, f.hint, { leads: f.leads }); }).join("");
    html += '<div class="form-row"><input type="text" data-ekg-text="st.sonstText" placeholder="Sonstiges – Freitext …" style="flex:1;min-width:220px"></div>';
    return '<div data-ekg-tool="st">' + html + "</div>";
  }

  function renderT() {
    var html = '<div class="box bx-green" data-ekg-badge="t-normal"><div class="lbl">Standard</div>Unauffällige T-Wellen.</div>';
    html += T_FINDINGS.map(function (f) { return cardHtml("t", f.id, f.label, f.hint, { leads: f.leads }); }).join("");
    html += '<div class="form-row"><input type="text" data-ekg-text="t.sonstText" placeholder="Sonstiges – Freitext …" style="flex:1;min-width:220px"></div>';
    html += '<div class="sec">QTc-Zeit</div>';
    html += '<div class="form-row"><label>QTc-Zeit</label><input type="number" min="200" max="800" placeholder="ms" data-ekg-num="qtcWert" style="width:90px">' +
      '<span class="unit">ms</span><span data-ekg-flag="qtc" style="font-size:.85rem;font-weight:600"></span></div>' +
      '<div class="hint">Direkt vom EKG übernehmen (bereits frequenzkorrigierter Gerätewert), sinnvollerweise anhand Ableitung II, V5 oder V6 überprüfen (klare T-Endpunkte, wenig Artefakte). Referenz: ca. 350–440/460 ms (m/w); ab ≥ 500 ms deutlich erhöhtes Risiko für Torsade-de-pointes-Tachykardien.</div>' +
      '<div data-ekg-qtc-warn></div>';
    return '<div data-ekg-tool="t">' + html + "</div>";
  }

  function renderBeurteilung() {
    var html = '<div class="box bx-blue"><div class="lbl">Hinweis</div>Automatische Vorschläge auf Basis der erfassten Befunde – per Klick abwählbar. Nur angehakte Vorschläge landen in der PVS-Dokumentation.</div>';
    html += '<div data-ekg-suggestions></div>';
    html += '<div class="form-row" style="display:block"><label style="display:block;margin-bottom:4px">Ergänzender Freitext</label>' +
      '<textarea data-ekg-text="beurteilungFreitext" placeholder="Eigene Ergänzungen zur Beurteilung …" style="width:100%;min-height:70px"></textarea></div>';
    return '<div data-ekg-tool="beurteilung">' + html + "</div>";
  }

  /* ======================================================================
     WIRE — Event-Delegation je Abschnitt (Karten sind an ihr eigenes
     data-ekg-tool gebunden, das bei jedem Neu-Mount frisch erzeugt wird –
     dadurch bleibt der Wired-Guard auch beim Wechseln zwischen SOPs sicher).
     ====================================================================== */
  function wire(api) {
    var root = api.root;
    if (!root) return;
    var d = ekgState(api.state);
    function commit() { api.setState({ ekg: d }); paintAll(root, d, commit); }

    ["rhythmus", "lagetyp", "p", "pq", "qrs", "st", "t", "beurteilung"].forEach(function (name) {
      wireTool(root, name, d, commit);
    });
    paintAll(root, d, commit);
  }

  function wireTool(root, name, d, commit) {
    var tool = root.querySelector('[data-ekg-tool="' + name + '"]');
    if (!tool || tool.getAttribute("data-ekg-wired") === "1") return;
    tool.setAttribute("data-ekg-wired", "1");
    tool.addEventListener("input", function (ev) { onInput(name, tool, root, ev.target, d, commit); });
    tool.addEventListener("change", function (ev) { onInput(name, tool, root, ev.target, d, commit); });
    tool.addEventListener("click", function (ev) {
      if (handleCommonClick(root, ev)) return;
      onClick(name, tool, root, ev, d, commit);
    });
  }

  function handleCommonClick(root, ev) {
    var help = ev.target.closest("[data-ekg-help]");
    if (help) {
      var panel = root.querySelector('[data-ekg-help-panel="' + help.getAttribute("data-ekg-help") + '"]');
      if (panel) panel.classList.toggle("open");
      return true;
    }
    return false;
  }

  function setNum(target, d, path) {
    var parts = path.split(".");
    var obj = d;
    while (parts.length > 1) { obj = obj[parts.shift()]; }
    obj[parts[0]] = target.value;
  }

  function onInput(name, tool, root, t, d, commit) {
    if (t.matches("[data-ekg-num]")) { setNum(t, d, t.getAttribute("data-ekg-num")); commit(); return; }
    if (t.matches("[data-ekg-text]")) { setNum(t, d, t.getAttribute("data-ekg-text")); commit(); return; }
    if (name === "rhythmus") {
      if (t.matches("[data-ekg-geschlecht]")) { d.geschlecht = t.value; commit(); return; }
      if (t.matches("[data-ekg-freq]")) { d.freq = t.value.slice(0, 3); commit(); return; }
      if (t.matches("[data-ekg-regel]")) { d.regelmaessig = t.value; commit(); return; }
      if (t.matches("[data-ekg-schrittmacher]")) { d.schrittmacherModus = t.value; commit(); return; }
      if (t.matches('[data-ekg-select="svesHaeufigkeit"]')) { d.extra.svesHaeufigkeit = t.value; commit(); return; }
      if (t.matches('[data-ekg-select="vesMorphologie"]')) { d.extra.vesMorphologie = t.value; commit(); return; }
      if (t.matches('[data-ekg-select="vesHaeufigkeit"]')) { d.extra.vesHaeufigkeit = t.value; commit(); return; }
    }
    if (name === "p" && t.matches('[data-ekg-select="pAmplRichtung"]')) { d.p.amplRichtung = t.value; commit(); return; }
    if (name === "qrs" && t.matches("[data-ekg-sokolow]")) {
      if (t.getAttribute("data-ekg-sokolow") === "lv") d.qrs.sokolowLvWert = t.value;
      else d.qrs.sokolowRvWert = t.value;
      commit(); return;
    }
  }

  function onClick(name, tool, root, ev, d, commit) {
    var lead = ev.target.closest("[data-ekg-lead-for]");
    if (lead) {
      var fid = lead.getAttribute("data-ekg-lead-for"), l = lead.getAttribute("data-lead");
      var store = name === "st" ? d.st.findings : d.t.findings;
      store[fid] = store[fid] || { checked: true, leads: {} };
      store[fid].leads[l] = !store[fid].leads[l];
      commit();
      return;
    }
    if (ev.target.closest("input") || ev.target.closest("select") || ev.target.closest("textarea")) return;
    var card = ev.target.closest("[data-ekg-card]");
    if (!card) return;
    var id = card.getAttribute("data-id");
    var kind = card.getAttribute("data-ekg-card");

    if (kind === "rhythmus") {
      d.rhythmus = id;
      if (id === "sinusarrhythmie" || id === "absolute-arrhythmie") d.regelmaessig = "unregelmaessig";
      commit(); return;
    }
    if (kind === "lagetyp") { d.lagetyp = id; commit(); return; }
    if (kind === "extra") {
      if (id === "sves") d.extra.svesChecked = !d.extra.svesChecked;
      if (id === "ves") d.extra.vesChecked = !d.extra.vesChecked;
      commit(); return;
    }
    if (kind === "p") { d.p.findings[id] = !d.p.findings[id]; commit(); return; }
    if (kind === "p-toggle") {
      if (id === "p-dauer") d.p.dauerPath = !d.p.dauerPath;
      if (id === "p-ampl") d.p.amplPath = !d.p.amplPath;
      commit(); return;
    }
    if (kind === "qrs") { d.qrs.findings[id] = !d.qrs.findings[id]; commit(); return; }
    if (kind === "st-iso") { d.st.isoelektrisch = true; Object.keys(d.st.findings).forEach(function (k) { d.st.findings[k].checked = false; }); commit(); return; }
    if (kind === "st") {
      d.st.findings[id] = d.st.findings[id] || { checked: false, leads: {} };
      d.st.findings[id].checked = !d.st.findings[id].checked;
      if (d.st.findings[id].checked) d.st.isoelektrisch = false;
      var anyChecked = Object.keys(d.st.findings).some(function (k) { return d.st.findings[k].checked; });
      if (!anyChecked) d.st.isoelektrisch = true;
      commit(); return;
    }
    if (kind === "t") {
      d.t.findings[id] = d.t.findings[id] || { checked: false, leads: {} };
      d.t.findings[id].checked = !d.t.findings[id].checked;
      commit(); return;
    }
  }

  /* ======================================================================
     PAINT — DOM mit aktuellem State synchronisieren
     ====================================================================== */
  function selectCards(tool, kind, isSelectedFn) {
    tool.querySelectorAll('[data-ekg-card="' + kind + '"]').forEach(function (card) {
      var id = card.getAttribute("data-id");
      var sel = isSelectedFn(id);
      card.classList.toggle("sel", sel);
      var extra = tool.querySelector('[data-ekg-extra="' + id + '"]');
      if (extra) extra.style.display = sel ? (extra.classList.contains("leads-box-ekg") ? "flex" : "") : "none";
    });
  }
  function setVal(input, val) { if (input && input.value !== String(val)) input.value = val; }

  function paintAll(root, d, commit) {
    paintRhythmus(root, d); paintLagetyp(root, d); paintP(root, d); paintPq(root, d);
    paintQrs(root, d); paintSt(root, d); paintT(root, d); paintBeurteilung(root, d, commit);
  }

  function paintRhythmus(root, d) {
    var tool = root.querySelector('[data-ekg-tool="rhythmus"]'); if (!tool) return;
    setVal(tool.querySelector("[data-ekg-geschlecht]"), d.geschlecht);
    setVal(tool.querySelector("[data-ekg-freq]"), d.freq);
    setVal(tool.querySelector("[data-ekg-regel]"), d.regelmaessig);
    selectCards(tool, "rhythmus", function (id) { return id === d.rhythmus; });
    var extraF = tool.querySelector('[data-ekg-extra="rhythmus-freitext"]'); if (extraF) extraF.style.display = d.rhythmus === "sonstiges" ? "flex" : "none";
    var extraS = tool.querySelector('[data-ekg-extra="rhythmus-schrittmacher"]'); if (extraS) extraS.style.display = d.rhythmus === "schrittmacherrhythmus" ? "flex" : "none";
    setVal(tool.querySelector("[data-ekg-schrittmacher]"), d.schrittmacherModus);
    selectCards(tool, "extra", function (id) { return (id === "sves" && d.extra.svesChecked) || (id === "ves" && d.extra.vesChecked); });
    var svesW = tool.querySelector('[data-ekg-extra="sves"]'); if (svesW) svesW.style.display = d.extra.svesChecked ? "flex" : "none";
    var vesW = tool.querySelector('[data-ekg-extra="ves"]'); if (vesW) vesW.style.display = d.extra.vesChecked ? "flex" : "none";
    setVal(tool.querySelector('[data-ekg-select="svesHaeufigkeit"]'), d.extra.svesHaeufigkeit);
    setVal(tool.querySelector('[data-ekg-select="vesMorphologie"]'), d.extra.vesMorphologie);
    setVal(tool.querySelector('[data-ekg-select="vesHaeufigkeit"]'), d.extra.vesHaeufigkeit);
  }
  function paintLagetyp(root, d) {
    var tool = root.querySelector('[data-ekg-tool="lagetyp"]'); if (!tool) return;
    selectCards(tool, "lagetyp", function (id) { return id === d.lagetyp; });
    tool.querySelectorAll("[data-ekg-sector]").forEach(function (p) {
      p.style.fillOpacity = p.getAttribute("data-ekg-sector") === d.lagetyp ? "0.95" : "0.28";
    });
  }
  function paintP(root, d) {
    var tool = root.querySelector('[data-ekg-tool="p"]'); if (!tool) return;
    var badge = tool.querySelector('[data-ekg-badge="p-normal"]'); if (badge) badge.style.display = isPNormal(d) ? "" : "none";
    selectCards(tool, "p-toggle", function (id) { return (id === "p-dauer" && d.p.dauerPath) || (id === "p-ampl" && d.p.amplPath); });
    var dW = tool.querySelector('[data-ekg-extra="p-dauer"]'); if (dW) dW.style.display = d.p.dauerPath ? "flex" : "none";
    var aW = tool.querySelector('[data-ekg-extra="p-ampl"]'); if (aW) aW.style.display = d.p.amplPath ? "flex" : "none";
    setVal(tool.querySelector('[data-ekg-num="p.dauerWert"]'), d.p.dauerWert);
    setVal(tool.querySelector('[data-ekg-num="p.amplWert"]'), d.p.amplWert);
    setVal(tool.querySelector('[data-ekg-select="pAmplRichtung"]'), d.p.amplRichtung);
    selectCards(tool, "p", function (id) { return !!d.p.findings[id]; });
    setVal(tool.querySelector('[data-ekg-text="p.sonstText"]'), d.p.sonstText);
  }
  function paintPq(root, d) {
    var tool = root.querySelector('[data-ekg-tool="pq"]'); if (!tool) return;
    var body = tool.querySelector("[data-ekg-pq-body]"); if (!body) return;
    var wantsMessage = !!(d.p.findings["p-fehlend"] || d.p.findings["p-flimmerwellen"]);
    var hasMessage = !!body.querySelector(".box.bx-orange");
    if (wantsMessage !== hasMessage) {
      body.innerHTML = renderPqBody(d);
    }
    var badge = body.querySelector('[data-ekg-badge="pq-normal"]'); if (badge) badge.style.display = hasText(d.pqWert) ? "none" : "";
    setVal(body.querySelector('[data-ekg-num="pqWert"]'), d.pqWert);
  }
  function paintQrs(root, d) {
    var tool = root.querySelector('[data-ekg-tool="qrs"]'); if (!tool) return;
    var badge = tool.querySelector('[data-ekg-badge="qrs-normal"]'); if (badge) badge.style.display = isQrsNormal(d) ? "" : "none";
    setVal(tool.querySelector('[data-ekg-num="qrs.verbreitertWert"]'), d.qrs.verbreitertWert);
    var flag = qrsFlag(d.qrs.verbreitertWert);
    var flagSpan = tool.querySelector('[data-ekg-flag="qrs"]');
    if (flagSpan) { flagSpan.textContent = flag ? flag.label : ""; flagSpan.style.color = flag ? flag.farbe : ""; }
    selectCards(tool, "qrs", function (id) { return !!d.qrs.findings[id]; });
    setVal(tool.querySelector('[data-ekg-sokolow="lv"]'), d.qrs.sokolowLvWert);
    setVal(tool.querySelector('[data-ekg-sokolow="rv"]'), d.qrs.sokolowRvWert);
    setVal(tool.querySelector('[data-ekg-text="qrs.sonstText"]'), d.qrs.sonstText);
  }
  function paintSt(root, d) {
    var tool = root.querySelector('[data-ekg-tool="st"]'); if (!tool) return;
    selectCards(tool, "st-iso", function () { return d.st.isoelektrisch; });
    selectCards(tool, "st", function (id) { return !!(d.st.findings[id] && d.st.findings[id].checked); });
    ST_FINDINGS.forEach(function (f) {
      if (!f.leads) return;
      var st = d.st.findings[f.id];
      tool.querySelectorAll('[data-ekg-lead-for="' + f.id + '"]').forEach(function (chip) {
        chip.classList.toggle("sel", !!(st && st.leads && st.leads[chip.getAttribute("data-lead")]));
      });
    });
    setVal(tool.querySelector('[data-ekg-text="st.sonstText"]'), d.st.sonstText);
  }
  function paintT(root, d) {
    var tool = root.querySelector('[data-ekg-tool="t"]'); if (!tool) return;
    var badge = tool.querySelector('[data-ekg-badge="t-normal"]'); if (badge) badge.style.display = isTNormal(d) ? "" : "none";
    selectCards(tool, "t", function (id) { return !!(d.t.findings[id] && d.t.findings[id].checked); });
    T_FINDINGS.forEach(function (f) {
      if (!f.leads) return;
      var st = d.t.findings[f.id];
      tool.querySelectorAll('[data-ekg-lead-for="' + f.id + '"]').forEach(function (chip) {
        chip.classList.toggle("sel", !!(st && st.leads && st.leads[chip.getAttribute("data-lead")]));
      });
    });
    setVal(tool.querySelector('[data-ekg-text="t.sonstText"]'), d.t.sonstText);
    setVal(tool.querySelector('[data-ekg-num="qtcWert"]'), d.qtcWert);
    var flag = qtcFlag(d.qtcWert, d.geschlecht);
    var flagSpan = tool.querySelector('[data-ekg-flag="qtc"]');
    if (flagSpan) { flagSpan.textContent = flag ? flag.label : ""; flagSpan.style.color = flag ? flag.farbe : ""; }
    var warnBox = tool.querySelector("[data-ekg-qtc-warn]");
    if (warnBox) {
      warnBox.innerHTML = qtcHasBbbContext(d) ? '<div class="box bx-orange" style="margin-top:8px"><div class="lbl">Achtung bei Schenkelblock/Schrittmacher</div>Die gemessene QTc-Zeit wird durch die verbreiterte Kammererregung überschätzt. Näherungsweise Korrektur: QTc(korrigiert) ≈ gemessene QTc − (QRS-Breite − 120 ms).</div>' : "";
    }
  }
  function paintBeurteilung(root, d, commit) {
    var tool = root.querySelector('[data-ekg-tool="beurteilung"]'); if (!tool) return;
    var box = tool.querySelector("[data-ekg-suggestions]"); if (!box) return;
    var sug = generateSuggestions(d);
    if (!sug.length) {
      box.innerHTML = '<div class="hint" style="font-style:italic">Noch keine Beurteilungsvorschläge – bitte Befund oben vervollständigen.</div>';
      setVal(tool.querySelector('[data-ekg-text="beurteilungFreitext"]'), d.beurteilungFreitext);
      return;
    }
    box.innerHTML = sug.map(function (s) {
      var checked = d.beurteilungChecked[s.id] !== undefined ? d.beurteilungChecked[s.id] : true;
      d.beurteilungChecked[s.id] = checked;
      var lvl = s.level === "hoch" ? "b-red" : s.level === "mittel" ? "b-orange" : "b-green";
      var lvlTxt = s.level === "hoch" ? "relevant" : s.level === "mittel" ? "möglich" : "unauffällig";
      return '<label class="chk chk-g" style="cursor:pointer" data-ekg-sugg="' + esc(s.id) + '"><div class="cb' + (checked ? " on" : "") + '"></div>' +
        "<span>" + esc(s.text) + ' <span class="badge ' + lvl + '">' + lvlTxt + "</span></span></label>";
    }).join("");
    box.querySelectorAll("[data-ekg-sugg]").forEach(function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-ekg-sugg");
        d.beurteilungChecked[id] = !(d.beurteilungChecked[id] !== false);
        commit();
      });
    });
    setVal(tool.querySelector('[data-ekg-text="beurteilungFreitext"]'), d.beurteilungFreitext);
  }

  /* ======================================================================
     TEXTGENERIERUNG (EK-Befundtext)
     ====================================================================== */
  function generateBefundText(d) {
    var parts = [];
    var rhy = RHYTHMUS_OPTIONS.filter(function (o) { return o.id === d.rhythmus; })[0];
    var rhyLabel = rhy.label;
    if (d.rhythmus === "sonstiges" && hasText(d.rhythmusSonstText)) rhyLabel = d.rhythmusSonstText;
    if (d.rhythmus === "schrittmacherrhythmus" && hasText(d.schrittmacherModus)) rhyLabel += " (" + d.schrittmacherModus + ")";
    var regelTxt = d.regelmaessig === "regelmaessig" ? "regelmäßig" : "unregelmäßig";
    parts.push(rhyLabel + ", Herzfrequenz " + (hasText(d.freq) ? d.freq + "/min" : "-/min") + ", " + regelTxt + ".");

    var esParts = [];
    if (d.extra.svesChecked) esParts.push(d.extra.svesHaeufigkeit + " supraventrikuläre Extrasystolen");
    if (d.extra.vesChecked) esParts.push(d.extra.vesHaeufigkeit + " " + d.extra.vesMorphologie + " ventrikuläre Extrasystolen");
    if (esParts.length) parts.push("Zusätzlich " + esParts.join(", ") + ".");

    var lag = LAGETYP_OPTIONS.filter(function (o) { return o.id === d.lagetyp; })[0];
    parts.push(lag.label + (lag.range ? " (" + lag.range + ")" : "") + ".");

    var pParts = [];
    if (isPNormal(d)) {
      pParts.push("regelrechte P-Wellen");
    } else {
      if (d.p.dauerPath) pParts.push("P-Dauer verlängert (" + (d.p.dauerWert || "?") + " ms, path.)");
      if (d.p.amplPath) {
        var richt = d.p.amplRichtung === "erhoeht" ? "erhöht (P-dextrocardiale)" : "abgeflacht (ggf. H. a. Hyperkaliämie)";
        pParts.push("P-Amplitude " + richt + (hasText(d.p.amplWert) ? " (" + d.p.amplWert + " mV)" : ""));
      }
      P_FINDINGS.forEach(function (f) { if (d.p.findings[f.id]) pParts.push(f.label); });
      if (hasText(d.p.sonstText)) pParts.push(d.p.sonstText);
    }
    parts.push(capFirst(pParts.join("; ")) + ".");

    if (d.p.findings["p-fehlend"] || d.p.findings["p-flimmerwellen"]) {
      parts.push("PQ-Zeit: P-Wellen nicht vorhanden/darstellbar, nicht beurteilbar.");
    } else if (hasText(d.pqWert)) {
      var v = parseInt(d.pqWert, 10);
      var flag = "im Normbereich";
      if (v > 200) flag = "verlängert (path., > 200 ms)";
      else if (v < 120) flag = "verkürzt (path., < 120 ms, DD Präexzitation)";
      parts.push("PQ-Zeit " + d.pqWert + " ms, " + flag + ".");
    } else {
      parts.push("PQ-Zeit im Normbereich.");
    }

    var qParts = [];
    if (hasText(d.qrs.verbreitertWert)) {
      var qf = qrsFlag(d.qrs.verbreitertWert);
      qParts.push("QRS-Breite " + d.qrs.verbreitertWert + " ms (" + (qf ? qf.label : "verbreitert") + ")");
    }
    QRS_FINDINGS.forEach(function (f) {
      if (!d.qrs.findings[f.id]) return;
      if (f.id === "sokolow-lv") qParts.push(f.label + (hasText(d.qrs.sokolowLvWert) ? " (Summe " + d.qrs.sokolowLvWert + " mV)" : ""));
      else if (f.id === "sokolow-rv") qParts.push(f.label + (hasText(d.qrs.sokolowRvWert) ? " (Summe " + d.qrs.sokolowRvWert + " mV)" : ""));
      else qParts.push(f.label);
    });
    if (hasText(d.qrs.sonstText)) qParts.push(d.qrs.sonstText);
    if (!qParts.length) qParts.push("unauffällige QRS-Breite und -Konfiguration");
    parts.push(capFirst(qParts.join("; ")) + ".");

    var sParts = [];
    if (d.st.isoelektrisch) {
      sParts.push("isoelektrische ST-Strecke, unauffällige Erregungsrückbildung");
    } else {
      ST_FINDINGS.forEach(function (f) {
        var st = d.st.findings[f.id];
        if (st && st.checked) {
          var lt = f.leads ? leadsListText(st.leads) : "";
          sParts.push(f.label + (lt ? " in " + lt : "") + (f.leads ? territoryPhrase(st.leads) : ""));
        }
      });
    }
    if (hasText(d.st.sonstText)) sParts.push(d.st.sonstText);
    parts.push(capFirst(sParts.join("; ")) + ".");

    var tParts = [];
    if (isTNormal(d)) {
      tParts.push("unauffällige T-Wellen");
    } else {
      T_FINDINGS.forEach(function (f) {
        var st = d.t.findings[f.id];
        if (st && st.checked) {
          var lt = f.leads ? leadsListText(st.leads) : "";
          tParts.push(f.label + (lt ? " in " + lt : "") + (f.leads ? territoryPhrase(st.leads) : ""));
        }
      });
      if (hasText(d.t.sonstText)) tParts.push(d.t.sonstText);
    }
    parts.push(capFirst(tParts.join("; ")) + ".");

    if (hasText(d.qtcWert)) {
      var qtf = qtcFlag(d.qtcWert, d.geschlecht);
      parts.push("QTc-Zeit " + d.qtcWert + " ms (" + (qtf ? qtf.label : "-") + ").");
    }
    return parts.join(" ");
  }

  /* ======================================================================
     BEURTEILUNGS-VORSCHLAGSMOTOR
     ====================================================================== */
  function generateSuggestions(d) {
    var sug = [];
    function add(id, text, level) { sug.push({ id: id, text: text, level: level }); }

    if (d.rhythmus === "absolute-arrhythmie") {
      if (d.p.findings["p-flimmerwellen"] || d.p.findings["p-fehlend"]) add("dd-vhf", "Vorhofflimmern", "hoch");
      else add("dd-arrhythmie", "Absolute Arrhythmie, DD Vorhofflimmern – klinische Korrelation empfohlen", "mittel");
    }
    if (d.p.findings["p-saegezahn"]) add("dd-vhflattern", "Vorhofflattern (sägezahnartige Flatterwellen)", "hoch");
    if (d.p.findings["p-vor-jedem-qrs-plus-extra"]) add("dd-vhflattern2", "V. a. Vorhofflattern bzw. atriale Tachykardie mit fixierter Überleitung – ggf. weiterführende Diagnostik", "mittel");
    if (d.p.findings["p-av-dissoziation"]) add("dd-avdissoz", "AV-Dissoziation – DD AV-Block III°, ventrikuläre Tachykardie (klinischer Kontext entscheidend)", "hoch");
    if (d.p.findings["p-negativ"]) add("dd-junktional", "Retrograde Vorhoferregung – DD AV-junktionaler Rhythmus", "mittel");
    if (d.p.findings["p-variabel"]) add("dd-wanderpm", "Wechselnde P-Wellen-Morphologie – DD Wandering Pacemaker / multifokale atriale Tachykardie", "mittel");

    if (d.p.amplPath && d.p.amplRichtung === "erhoeht") add("p-dextro", "P-dextrocardiale – Zeichen der rechtsatrialen Erregungsausbreitungsstörung", "mittel");
    if (d.p.amplPath && d.p.amplRichtung === "erniedrigt") add("p-hypok", "Abgeflachte P-Welle – ggf. Hinweis auf Hyperkaliämie, laborchemische Kontrolle empfohlen", "mittel");
    if (d.p.findings["p-doppelgipflig"]) add("p-sinistro", "P-sinistrocardiale – Zeichen der linksatrialen Erregungsausbreitungsstörung", "mittel");
    if (d.p.findings["p-dextrocardiale"]) add("p-dextro-chk", "P-dextrocardiale – Zeichen der rechtsatrialen Erregungsausbreitungsstörung", "mittel");
    if (d.p.findings["p-biatrial"]) add("p-biatrial-s", "Biatriale Vergrößerung", "mittel");

    if (hasText(d.pqWert)) {
      var pqV = parseInt(d.pqWert, 10);
      if (pqV > 200) add("avblock1", "AV-Block I. Grades", "mittel");
      if (pqV < 120 && pqV > 0) add("praeexz", "Verkürzte PQ-Zeit – DD Präexzitationssyndrom (WPW, LGL); bei begleitender Delta-Welle WPW-Syndrom wahrscheinlich", "mittel");
    }

    var qrsHasWert = hasText(d.qrs.verbreitertWert);
    var qrsBreite = parseInt(d.qrs.verbreitertWert || "0", 10);
    if (qrsHasWert && qrsBreite >= 120 && d.qrs.findings["rsb-verzoegert"]) add("rsb-komplett", "Kompletter Rechtsschenkelblock", "hoch");
    else if (d.qrs.findings["rsb-verzoegert"]) add("rsb-hinweis", "Hinweis auf Rechtsschenkelblock – QRS-Breite zur Abgrenzung komplett/inkomplett ergänzen", "mittel");
    if (qrsHasWert && qrsBreite >= 120 && d.qrs.findings["lsb-verzoegert"]) add("lsb-komplett", "Kompletter Linksschenkelblock", "hoch");
    else if (d.qrs.findings["lsb-verzoegert"]) add("lsb-hinweis", "Hinweis auf Linksschenkelblock – QRS-Breite zur Abgrenzung komplett/inkomplett ergänzen", "mittel");
    if (d.qrs.findings["rsb-inkomplett"]) add("irsb", "Inkompletter Rechtsschenkelblock", "mittel");
    if (d.qrs.findings["lsb-inkomplett"]) add("ilsb", "Inkompletter Linksschenkelblock", "mittel");
    if (qrsHasWert && qrsBreite >= 110 && qrsBreite < 120 && !d.qrs.findings["rsb-verzoegert"] && !d.qrs.findings["lsb-verzoegert"]) add("qrs-grenzwertig", "Grenzwertige QRS-Verbreiterung – Verlaufskontrolle empfohlen", "mittel");
    if (d.qrs.findings["niedervoltage"]) add("niedervolt", "Niedervoltage – DD Adipositas, Perikarderguss, Lungenemphysem, Hypothyreose, Amyloidose", "mittel");

    var lvhCriteria = d.qrs.findings["sokolow-lv"] || d.qrs.findings["avl-hypertrophie"];
    if (lvhCriteria) {
      var t = "Zeichen der linksventrikulären Hypertrophie (Sokolow-Lyon-Index positiv)";
      if (d.qrs.findings["strain-pattern"]) t += " mit sekundärer Erregungsrückbildungsstörung (Strain-Pattern)";
      add("lvh", t, "mittel");
    }
    if (d.qrs.findings["sokolow-rv"]) add("rvh", "Zeichen der rechtsventrikulären Hypertrophie (Sokolow-Index positiv)", "mittel");
    if ((d.lagetyp === "rechtstyp" || d.lagetyp === "nordwesttyp") && d.qrs.findings["sokolow-rv"]) add("rechtsherz", "In Zusammenschau mit dem Lagetyp Hinweis auf Rechtsherzbelastung", "mittel");
    if (d.lagetyp === "ueberdrehter-linkstyp") add("hemiblock", "Überdrehter Linkstyp – DD linksanteriorer Hemiblock, insb. bei begleitender leichter QRS-Verbreiterung", "mittel");
    if (d.lagetyp === "nordwesttyp") add("nordwest-s", 'Unmöglicher Lagetyp ("Nordwest-Typ") – immer abklärungsbedürftig, DD kombinierter Hemiblock, Hyperkaliämie, ventrikulärer Ursprung', "hoch");

    if (d.qrs.findings["delta-welle"]) {
      var pq = hasText(d.pqWert) ? parseInt(d.pqWert, 10) : null;
      if (pq !== null && pq < 120) add("wpw", "WPW-Syndrom wahrscheinlich (Delta-Welle mit verkürzter PQ-Zeit " + d.pqWert + " ms) – ggf. elektrophysiologische Abklärung; Cave bei Vorhofflimmern (Gefahr sehr schneller Überleitung über die akzessorische Bahn)", "hoch");
      else add("delta-s", "Delta-Welle – Hinweis auf ventrikuläre Präexzitation (WPW), PQ-Zeit und Klinik korrelieren", "mittel");
    }

    if (d.extra.svesChecked && (d.extra.svesHaeufigkeit === "gehäuft" || d.extra.svesHaeufigkeit === "bigeminusartig")) add("sves-s", "Gehäufte supraventrikuläre Extrasystolen (" + d.extra.svesHaeufigkeit + ") – ggf. Vorbote von Vorhofflimmern, Verlaufskontrolle empfehlenswert", "mittel");
    if (d.extra.vesChecked) {
      var vh = d.extra.vesHaeufigkeit;
      var complex = d.extra.vesMorphologie === "polymorph" || vh === "mit Couplets (Paare)" || vh === "mit Salven (≥3 konsekutiv, nsVT)" || vh === "gehäuft";
      if (complex) add("ves-komplex", "Gehäufte und/oder komplexe ventrikuläre Extrasystolen (" + d.extra.vesMorphologie + ", " + vh + ") – Langzeit-EKG und Echokardiographie zur weiteren Risikostratifizierung empfehlenswert", "hoch");
      else add("ves-einfach", "Vereinzelte monomorphe ventrikuläre Extrasystolen – in der Regel benigne, bei Beschwerdesymptomatik oder Häufung Verlaufskontrolle", "mittel");
    }

    var stKeys = Object.keys(d.st.findings).filter(function (k) { return d.st.findings[k].checked; });
    if (stKeys.indexOf("st-signifikant-horizontal") !== -1 || stKeys.indexOf("st-signifikant-deszendierend") !== -1) {
      var leadsUnion = {};
      ["st-signifikant-horizontal", "st-signifikant-deszendierend"].forEach(function (id) {
        var st = d.st.findings[id];
        if (st && st.checked) Object.keys(st.leads || {}).forEach(function (l) { if (st.leads[l]) leadsUnion[l] = true; });
      });
      add("st-ischaemie", "Signifikante ST-Streckensenkung" + territoryPhrase(leadsUnion) + " – Erregungsrückbildungsstörung, DD Myokardischämie; klinische Korrelation und ggf. weiterführende Diagnostik empfohlen", "hoch");
    }
    if (stKeys.indexOf("st-traege-aszendierend") !== -1) add("st-traege-s", "Träge aszendierende ST-Senkung – grenzwertiger Befund, im Kontext von Belastung/Herzfrequenz zu werten", "mittel");
    if (stKeys.indexOf("st-hebung-signifikant") !== -1) {
      var sthx = d.st.findings["st-hebung-signifikant"];
      add("st-hebung-s", "Signifikante ST-Streckenhebung" + territoryPhrase(sthx.leads) + " – bei akutem Beschwerdebild dringender V. a. ST-Hebungsinfarkt (STEMI), sofortige kardiologische Abklärung", "hoch");
    }
    var sgScore = computeSgarbossaScore(d);
    if (sgScore > 0) {
      if (sgScore >= 3) add("sgarbossa-pos", "Sgarbossa-Score " + sgScore + " Punkte (≥ 3) – bei bestehendem Linksschenkelblock hinweisend auf akute Myokardischämie", "hoch");
      else add("sgarbossa-neg", "Sgarbossa-Score " + sgScore + " Punkte (< 3) – Ischämiehinweis bei LSB nicht ausreichend gesichert, klinische Korrelation erforderlich", "mittel");
    }
    if (stKeys.indexOf("avr-hebung") !== -1) add("hauptstamm", "ST-Hebung in aVR mit ausgedehnter ST-Senkung – dringender V. a. Hauptstammstenose bzw. hochgradige Mehrgefäßerkrankung, sofortige kardiologische Vorstellung", "hoch");
    if (stKeys.indexOf("dewinter") !== -1) add("dewinter-s", "DeWinter-Zeichen – STEMI-Äquivalent bei V. a. akute proximale RIVA-Okklusion, sofortige kardiologische Vorstellung", "hoch");
    if (stKeys.indexOf("wellens") !== -1) add("wellens-s", "Wellens-Zeichen – V. a. kritische proximale LAD-Stenose, zeitnahe Koronarangiographie empfohlen", "hoch");
    if (stKeys.indexOf("perikarditis-muster") !== -1) add("perikarditis-s", "Perikarditis-Muster – DD Myokardischämie; klinische Korrelation und Echokardiographie empfohlen", "mittel");
    if (stKeys.indexOf("early-repolarization") !== -1) add("early-repol-s", "Frühe Repolarisation (J-Punkt-Hebung mit End-QRS-Notch/-Slur und konkaver ST-Hebung) – bei inferior/lateraler Lokalisation DD zu Myokardischämie und Perikarditis, im Zweifel klinische Korrelation und Vergleich mit Vor-EKG", "mittel");

    if (hasText(d.qtcWert)) {
      var qflag = qtcFlag(d.qtcWert, d.geschlecht);
      var qv = parseInt(d.qtcWert, 10);
      if (qflag && qflag.farbe === "var(--rot)" && qv >= 500) add("qtc-lang", "Deutlich verlängerte QTc-Zeit (" + d.qtcWert + " ms) – erhöhtes Risiko für Torsade-de-pointes-Tachykardien; Medikamentenanamnese und Elektrolyte umgehend überprüfen", "hoch");
      else if (qflag && qflag.farbe === "var(--rot)") add("qtc-kurz", "Verkürzte QTc-Zeit (" + d.qtcWert + " ms) – DD Short-QT-Syndrom, Hyperkalzämie, Digitalis-Effekt", "mittel");
      else if (qflag && qflag.farbe === "var(--orange)") add("qtc-grenz", "Verlängerte QTc-Zeit (" + d.qtcWert + " ms) – Medikamentenanamnese und Elektrolyte überprüfen" + (qtcHasBbbContext(d) ? "; Schenkelblock-/Schrittmacher-bedingte Überschätzung beachten" : ""), "mittel");
    }

    var tKeys = Object.keys(d.t.findings).filter(function (k) { return d.t.findings[k].checked; });
    if (tKeys.indexOf("t-ueberspitzt") !== -1) add("hyperk", "Überspitzte/zeltförmige T-Wellen – ggf. Hinweis auf Hyperkaliämie, laborchemische Kontrolle empfohlen", "mittel");
    if (tKeys.indexOf("t-abgeflacht") !== -1) add("hypok-t", "Abgeflachte T-Wellen – unspezifisch, ggf. Hinweis auf Hypokaliämie", "mittel");
    if (tKeys.indexOf("t-praeterminal") !== -1 || tKeys.indexOf("t-terminal") !== -1) {
      var tUnion = {};
      ["t-praeterminal", "t-terminal"].forEach(function (id) {
        var st = d.t.findings[id];
        if (st && st.checked) Object.keys(st.leads || {}).forEach(function (l) { if (st.leads[l]) tUnion[l] = true; });
      });
      add("t-neg", "T-Negativierung" + territoryPhrase(tUnion) + " – Erregungsrückbildungsstörung, DD KHK/Ischämie, Hypertrophie, Zustand nach Ischämie; klinische Korrelation empfohlen", "mittel");
    }
    if (tKeys.indexOf("t-u-welle") !== -1) add("u-welle", "Zusätzliche U-Welle bzw. T-U-Verschmelzungswelle – ggf. Hinweis auf Hypokaliämie", "mittel");

    var hasAnyPath = sug.length > 0 || ["rechtstyp", "ueberdrehter-linkstyp", "nordwesttyp", "nicht-festlegbar"].indexOf(d.lagetyp) !== -1 || d.rhythmus !== "normofrequenter-sinusrhythmus";
    if (!hasAnyPath) add("normalbefund", "Altersentsprechender Normalbefund, kein Anhalt für relevante Erregungsbildungs-, Erregungsleitungs- oder Erregungsrückbildungsstörung", "normal");
    return sug;
  }

  /* ======================================================================
     PVS-BAUSTEIN
     ====================================================================== */
  function baustein(s) {
    var d = ekgState(s);
    var befund = generateBefundText(d);
    var sug = generateSuggestions(d);
    var chosen = sug.filter(function (sgg) { return d.beurteilungChecked[sgg.id] !== false; });
    var beurteilungTexte = chosen.map(function (sgg) { return sgg.text; });
    if (hasText(d.beurteilungFreitext)) beurteilungTexte.push(d.beurteilungFreitext);
    var beurteilungTxt = beurteilungTexte.length ? beurteilungTexte.join("; ") + "." : "-";

    var ld = [];
    chosen.forEach(function (sgg) {
      var code = ICD_BY_SUGGESTION[sgg.id];
      if (code && ld.indexOf(code) === -1) ld.push(code);
    });

    var critical = sug.some(function (sgg) { return CRITICAL_SUGGESTIONS.indexOf(sgg.id) !== -1; });
    var th = critical ? "Bei den erhobenen EKG-Kriterien umgehende ärztliche Bewertung und ggf. sofortige kardiologische Vorstellung/Klinikeinweisung empfehlen." : "";

    return {
      AN: "Ruhe-EKG, indikationsgerecht abgeleitet und befundet.",
      BE: "",
      EK: befund + " Beurteilung: " + beurteilungTxt,
      TH: th,
      LD: ld.join("\n")
    };
  }

  function auswertung(s) {
    var d = ekgState(s);
    var sug = generateSuggestions(d);
    var critical = sug.filter(function (sgg) { return CRITICAL_SUGGESTIONS.indexOf(sgg.id) !== -1; });
    var meldungen = critical.map(function (sgg) { return { stil: "rot", titel: sgg.text.split(" – ")[0], text: sgg.text }; });
    return {
      redflag: critical.length > 0,
      bannerText: "Kritischer EKG-Befund (z. B. STEMI-Zeichen, hochgradige QTc-Verlängerung oder AV-Dissoziation) – sofort ärztlich handeln.",
      meldungen: meldungen
    };
  }

  PCM.registerSOP({
    id: "ekg",
    titel: "EKG-Befundung",
    untertitel: "Systematische EKG-Befundung: Rhythmus, Lagetyp, P/PQ/QRS/ST/T, Beurteilung – EK-Dokumentation",
    icon: "📈",
    farbe: "#025669",
    version: "1.1",
    stand: "05.07.2026",
    bereich: "EKG",
    kategorie: "EKG",
    leitlinie: "Systematische EKG-Interpretation; Sgarbossa-/modifizierte Sgarbossa-Kriterien; DeWinter-/Wellens-Zeichen",
    delegationshinweis: "Das Modul unterstützt die strukturierte Dokumentation des EKG-Befunds. Diagnose, Therapie und Procedere erfolgen ärztlich.",
    initialState: {
      ekg: {
        geschlecht: "unbekannt", freq: "", regelmaessig: "regelmaessig", rhythmus: "normofrequenter-sinusrhythmus",
        rhythmusSonstText: "", schrittmacherModus: "",
        extra: { svesChecked: false, svesHaeufigkeit: "vereinzelt", vesChecked: false, vesMorphologie: "monomorph", vesHaeufigkeit: "vereinzelt" },
        lagetyp: "indifferenztyp",
        p: { dauerPath: false, dauerWert: "", amplPath: false, amplRichtung: "erhoeht", amplWert: "", findings: {}, sonstText: "" },
        pqWert: "",
        qrs: { verbreitertWert: "", findings: {}, sokolowLvWert: "", sokolowRvWert: "", sonstText: "" },
        qtcWert: "",
        st: { isoelektrisch: true, findings: {}, sonstText: "" },
        t: { findings: {}, sonstText: "" },
        beurteilungChecked: {}, beurteilungFreitext: ""
      }
    },
    schritte: [
      { nr: 1, titel: "Rhythmusbild und Herzfrequenz", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", offen: true, elemente: [{ typ: "ekg", id: "ekg-rhythmus", ansicht: "rhythmus", render: render, wire: wire }] },
      { nr: 2, titel: "Lagetyp", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", elemente: [{ typ: "ekg", id: "ekg-lagetyp", ansicht: "lagetyp", render: render, wire: wire }] },
      { nr: 3, titel: "P-Wellen / Vorhoferregung", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", elemente: [{ typ: "ekg", id: "ekg-p", ansicht: "p", render: render, wire: wire }] },
      { nr: 4, titel: "PQ-Zeit", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", elemente: [{ typ: "ekg", id: "ekg-pq", ansicht: "pq", render: render, wire: wire }] },
      { nr: 5, titel: "QRS-Breite und Konfiguration", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", elemente: [{ typ: "ekg", id: "ekg-qrs", ansicht: "qrs", render: render, wire: wire }] },
      { nr: 6, titel: "ST-Strecke", rolle: "Arzt", rolleStil: "orange", farbe: "#BB4E26", elemente: [{ typ: "ekg", id: "ekg-st", ansicht: "st", render: render, wire: wire }] },
      { nr: 7, titel: "T-Wellen und QTc-Zeit", rolle: "Arzt", rolleStil: "blue", farbe: "#025669", elemente: [{ typ: "ekg", id: "ekg-t", ansicht: "t", render: render, wire: wire }] },
      { nr: 8, titel: "Beurteilung", rolle: "Dokumentation", rolleStil: "green", farbe: "#1E8449", elemente: [{ typ: "ekg", id: "ekg-beurteilung", ansicht: "beurteilung", render: render, wire: wire }] }
    ],
    auswertung: auswertung,
    baustein: baustein
  });
})();
