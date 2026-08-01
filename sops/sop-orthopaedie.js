(function () {
  "use strict";

  /* ======================================================================
     ORTHOPÄDIE — Gelenkuntersuchung (Obermodul "Orthopädie")
     Je Gelenk/Region (2. Spalte): Untersuchungsgang, Neutral-Null-Methode
     (Normwerte) und spezifische Funktions-/Provokationstests mit
     aufklappbarer Durchführung, Untersuchungsvideo (Platzhalter, per
     Klick groß) und der klinischen Bedeutung eines positiven Tests.

     Kein Ersatz für die ärztliche Beurteilung. Bei Trauma-/Fraktur-/
     Infektzeichen keine Funktionsprüfung erzwingen — ärztlich abklären.

     Videos: eingebettete YouTube-Fachvideos (überwiegend AMBOSS DE und
     Physiotutors), siehe VIDEOS-Map. Geladen wird erst beim Klick.
     ====================================================================== */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ======================================================================
     VIDEOS — Untersuchungsvideos je Test (YouTube)
     ----------------------------------------------------------------------
     Ersetzt die frueheren SVG-Schemazeichnungen (Backup: _alt-svg-schemata.bak.js).
     Angezeigt wird zunaechst nur ein Platzhalter (YouTube-Vorschaubild);
     erst der Klick laedt den Player gross in der Lightbox des Frameworks
     (data-yt). Vorteil: keine Einbettung/kein YouTube-Kontakt beim
     Seitenaufbau, kein Cookie vor dem bewussten Abspielen.

     Quellen: bevorzugt deutschsprachig — AMBOSS DE (Playlist "Klinische
     Untersuchung: Orthopaedie") und Physiotutors; ergaenzend weitere
     Fachkanaele. Die Videos sind eingebettete Fremdinhalte; Rechte
     liegen beim jeweiligen Kanal.

     Pflege: Eintrag = Test-ID -> Liste von { id, titel, kanal }.
     Mehrere Eintraege sind moeglich (z. B. Steinmann I und II).
     Faellt ein Video weg, hier die 11-stellige YouTube-ID ersetzen.
     ====================================================================== */
  var VIDEOS = {
    /* --- HWS ---------------------------------------------------------- */
    hws_spurling:    [{ id: "3ZSNdv0o0yk", titel: "Spurling-Test (zervikale Radikulopathie)", kanal: "Physiotutors", en: true }],
    hws_distraktion: [{ id: "uLdzgd5snmw", titel: "Zervikaler Distraktionstest", kanal: "Physiotutors", en: true }],
    hws_lhermitte:   [{ id: "mDQ-UdK-PDs", titel: "Lhermitte-Zeichen", kanal: "Physiotutors", en: true }],

    /* --- BWS / LWS ---------------------------------------------------- */
    lws_schober:   [{ id: "eYOUA9asDu8", titel: "Schober-Test (Lumbalflexion)", kanal: "Physiotutors", en: true }],
    lws_lasegue:   [{ id: "LdAD9GNv8FI", titel: "Straight Leg Raise / Lasègue-Test", kanal: "Physiotutors", en: true }],
    lws_bragard:   [{ id: "1AFpCKbIWf8", titel: "Bragard-SLR-Test", kanal: "Basics of Ortho", en: true }],
    lws_umgekehrt: [{ id: "whb3Rknage0", titel: "Umgekehrter Lasègue (Prone Knee Bend)", kanal: "Physiotutors", en: true }],

    /* --- ISG ---------------------------------------------------------- */
    isg_faber:       [{ id: "89Qiht82zmg", titel: "Patrick / FABER / Vierer-Test", kanal: "Physiotutors", en: true }],
    isg_mennell:     [{ id: "QOM4fKkmurA", titel: "Mennell-Zeichen (3-Phasen-Test)", kanal: "Physiotutors", en: true }],
    isg_vorlauf:     [{ id: "HBapDoZZ_T8", titel: "Vorlaufphänomen (Standing Flexion Test)", kanal: "Physiotutors", en: true }],
    isg_kompression: [{ id: "pWjvrhWMR4w", titel: "ISG-Kompressionstest (Seitenlage)", kanal: "Physiotutors", en: true }],

    /* --- Schulter ----------------------------------------------------- */
    sch_neer:         [{ id: "IPLppPop2g8", titel: "Neer-Test (Impingement)", kanal: "AMBOSS DE" }],
    sch_hawkins:      [{ id: "6GkKB2oXi3o", titel: "Hawkins-Kennedy-Test", kanal: "Physiotutors", en: true }],
    sch_jobe:         [{ id: "QwUrNsvP2Bg", titel: "Jobe-Test (Rotatorenmanschette)", kanal: "AMBOSS DE" }],
    sch_painarc:      [{ id: "Jt3uykik-K0", titel: "Painful-Arc-Test", kanal: "AMBOSS DE" }],
    sch_droparm:      [{ id: "JXgRBeqToik", titel: "Drop-Arm-Test (Supraspinatus-Ruptur)", kanal: "Physiotutors", en: true }],
    sch_liftoff:      [{ id: "QQvvX-kAZKo", titel: "Lift-Off-Test", kanal: "AMBOSS DE" },
                       { id: "VV1C594xaeQ", titel: "Belly-Press-Test", kanal: "AMBOSS DE" }],
    sch_apprehension: [{ id: "jZ29dAXKA5M", titel: "Apprehension-Test (vordere Instabilität)", kanal: "Physiotutors", en: true }],

    /* --- Ellbogen ----------------------------------------------------- */
    ell_cozen:  [{ id: "vPCkCcvD7P8", titel: "Cozen-Test (Epicondylitis lateralis)", kanal: "Physiotutors", en: true }],
    ell_golfer: [{ id: "u5H9iG8QhYA", titel: "Test bei Epicondylitis medialis (Golferellenbogen)", kanal: "Physiotutors", en: true }],
    ell_valgus: [{ id: "gj2_TvZPV0A", titel: "Valgus-Stress-Test am Ellenbogen", kanal: "Gelenk-Klinik" }],

    /* --- Hand / Handgelenk -------------------------------------------- */
    han_finkelstein: [{ id: "8WBVXBx34W0", titel: "Finkelstein-Test (Tendovaginitis de Quervain)", kanal: "Physiotutors", en: true }],
    han_phalen:      [{ id: "uUlJSNp_LOE", titel: "Phalen-Test (Karpaltunnelsyndrom)", kanal: "Mein Physio" }],
    han_tinel:       [{ id: "U8cPjPeZgFw", titel: "Tinel-Zeichen am Handgelenk", kanal: "Physiotutors", en: true }],
    han_grind:       [{ id: "kEoyDmwFB_s", titel: "Grind-Test (Rhizarthrose, CMC 1)", kanal: "Physiotutors", en: true }],
    han_froment:     [{ id: "WnTVWnTFymA", titel: "Froment-Zeichen (Ulnarisparese)", kanal: "Dr. Nabil Ebraheim", en: true }],
    han_watson:      [{ id: "xBBUwsVi2-o", titel: "Watson-Test / Scaphoid-Shift", kanal: "Physiotutors", en: true }],

    /* --- Hüfte -------------------------------------------------------- */
    hue_thomas:        [{ id: "NMDd-4NspHs", titel: "Thomas-Test (Iliopsoas-Verkürzung)", kanal: "Physiotutors", en: true }],
    hue_trendelenburg: [{ id: "GPceA-f_Kck", titel: "Trendelenburg- und Duchenne-Hinken", kanal: "gomedis Physio Akademie" }],
    hue_fadir:         [{ id: "F6aiEu6KRzk", titel: "Hüftgelenk — Impingementtests (FADIR)", kanal: "Physio Schüler" }],
    hue_faber:         [{ id: "89Qiht82zmg", titel: "Patrick / FABER / Vierer-Test", kanal: "Physiotutors", en: true }],
    hue_drehmann:      [{ id: "UUHu8f36g4A", titel: "Klinische Untersuchung des Hüftgelenks (inkl. Drehmann)", kanal: "Uniklinikum Erlangen" }],

    /* --- Knie --------------------------------------------------------- */
    kni_erguss:     [{ id: "CNlaAQl7AR4", titel: "Tanzende Patella", kanal: "AMBOSS DE" }],
    kni_schubladeV: [{ id: "TfAEz0gT0aQ", titel: "Schubladen-Test (Kreuzbänder)", kanal: "AMBOSS DE" }],
    kni_lachman:    [{ id: "lBTSEB_5F2E", titel: "Lachman-Test (vorderes Kreuzband)", kanal: "AMBOSS DE" }],
    kni_schubladeH: [{ id: "TfAEz0gT0aQ", titel: "Schubladen-Test (Kreuzbänder)", kanal: "AMBOSS DE" },
                     { id: "R8KYd-mZSHM", titel: "Gravity-Sign (hinteres Kreuzband)", kanal: "AMBOSS DE" }],
    kni_valgus:     [{ id: "ozVz3wNs64g", titel: "Stabilitätstest — Valgusstress", kanal: "Physio Schüler" },
                     { id: "e6JwwnbGU48", titel: "Stabilitätstest — Varusstress", kanal: "Physio Schüler" }],
    kni_mcmurray:   [{ id: "lwDFPAyGGgI", titel: "McMurray-Test (Meniskusläsion)", kanal: "Physiotutors", en: true }],
    kni_steinmann:  [{ id: "80l5A-uEj9I", titel: "Steinmann-I-Zeichen", kanal: "AMBOSS DE" },
                     { id: "CCXh36ds_EU", titel: "Steinmann-II-Zeichen", kanal: "AMBOSS DE" }],
    kni_zohlen:     [{ id: "DA3Y9spJptg", titel: "Zohlen-Zeichen", kanal: "AMBOSS DE" }],

    /* --- OSG / Fuß ---------------------------------------------------- */
    osg_schublade:    [{ id: "vAcBEYZKcto", titel: "Vordere Schublade am Sprunggelenk", kanal: "Physiotutors", en: true }],
    osg_taluskippung: [{ id: "UHNbm6Z3XK4", titel: "Talar-Tilt-Test (Taluskippung)", kanal: "Physiotutors", en: true }],
    osg_thompson:     [{ id: "uGInNJ8hS5A", titel: "Thompson-Test (Achillessehne)", kanal: "AMBOSS DE" }],
    osg_squeeze:      [{ id: "ANgWSz0UoDg", titel: "Syndesmosen-Squeeze-Test", kanal: "Physiotutors", en: true }]
  };

  /* Video zum Neutral-Null-Prinzip (in jeder NNM-Sektion) */
  var VID_NNM = [{ id: "OMHw5V-Ylsc", titel: "Neutral-Null-Methode — Anwendung und Beispiele", kanal: "Einfach Medizin" }];

  /* ----------------------------------------------------------------------
     Rendert die Video-Platzhalter eines Tests.
     Es wird bewusst KEIN <iframe> in die Seite gesetzt: der Platzhalter
     zeigt nur das Vorschaubild; data-yt uebergibt die ID an die Lightbox
     des Frameworks, die den Player erst beim Klick erzeugt.
     ---------------------------------------------------------------------- */
  function vidFig(list, kontext) {
    if (!list || !list.length) return "";
    return list.map(function (v) {
      if (!v || !v.id) return "";
      var thumb = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
      var label = v.titel || kontext || "Untersuchungsvideo";
      /* Kommentar zur Sprache: viele Fachvideos sind englischsprachig —
         YouTube uebersetzt die Titel automatisch, der Ton bleibt Englisch. */
      var sprache = v.en ? " (engl.)" : "";
      var cap = (kontext ? kontext + " — " : "") + label + sprache;
      return '<figure class="orth-fig">' +
        '<div class="orth-vid" role="button" tabindex="0" ' +
        'data-yt="' + esc(v.id) + '" data-caption="' + esc(cap) + '" ' +
        'aria-label="Video abspielen: ' + esc(label + sprache) + '" ' +
        'style="background-image:url(' + thumb + ')">' +
        '<span class="orth-vid-play" aria-hidden="true"></span>' +
        '<span class="orth-vid-lbl">' + esc(label + sprache) + '</span>' +
        '</div>' +
        '<figcaption class="orth-figcap">Video: ' + esc(label + sprache) +
        ' · Kanal: ' + esc(v.kanal || "YouTube") +
        ' · <a href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener">auf YouTube ansehen</a>' +
        '</figcaption></figure>';
    }).join("");
  }

  /* Debug-/Vorschau-Export (wird vom Framework nicht genutzt) */
  try { if (typeof window !== "undefined") window.__orthVideos = VIDEOS; } catch (e) {}

  /* ======================================================================
     Gelenk-Daten (Reihenfolge = 2. Spalte, von kranial nach kaudal)
     Jeder Test: name, ablauf[], bedeutung (bei positiv), kurzBed (Baustein).
     Das zugehoerige Untersuchungsvideo haengt an der Test-ID (siehe VIDEOS).
     ====================================================================== */
  var JOINTS = [
    {
      id: "hws", name: "Halswirbelsäule (HWS)", kurz: "Neutral-Null · Spurling · Distraktion",
      icon: "HWS", farbe: "#2471A3",
      intro: "Systematik: Inspektion (Kopfhaltung, Schonhaltung) → Palpation (Dornfortsätze, paravertebrale Muskulatur, Facetten) → aktive/passive Beweglichkeit (Neutral-Null) → orientierende Neurologie (Kennmuskeln/Reflexe C5–C8) → spezifische Provokationstests.",
      nnm: [
        ["Flexion / Extension (Vor-/Rückneigung)", "45° – 0° – 45° (bis 65 / 40)"],
        ["Lateralflexion rechts / links", "45° – 0° – 45°"],
        ["Rotation rechts / links", "60–80° – 0° – 60–80°"],
        ["Kinn-Jugulum-Abstand (Flexion)", "0–2 cm"]
      ],
      tests: [
        { id: "hws_spurling", name: "Spurling-Test (Foramenkompressionstest)",
          ablauf: ["Kopf zur betroffenen Seite neigen und leicht reklinieren.", "Vorsichtiger axialer Druck von oben auf den Scheitel.", "Auf reproduzierbare, in den Arm ausstrahlende Schmerzen achten."],
          bedeutung: "In das Dermatom ausstrahlender Schmerz spricht für eine zervikale Nervenwurzelkompression (Zervikobrachialgie, z. B. Bandscheibenprotrusion, Neuroforamenstenose).",
          kurzBed: "V.a. zervikale Radikulopathie" },
        { id: "hws_distraktion", name: "Distraktionstest",
          ablauf: ["Kopf umfassen und manuellen Längszug nach kranial ausüben.", "Reaktion auf die Entlastung beobachten."],
          bedeutung: "Nachlassen radikulärer Beschwerden unter Zug bestätigt eine Wurzelkompression (Gegenstück zum Spurling).",
          kurzBed: "Entlastung spricht für Radikulopathie" },
        { id: "hws_lhermitte", name: "Lhermitte-Zeichen",
          ablauf: ["Kopf aktiv/passiv nach vorn beugen (Flexion).", "Auf elektrisierende, entlang der Wirbelsäule/in die Extremitäten schießende Missempfindung achten."],
          bedeutung: "Positiv bei zervikaler Myelopathie oder Läsionen des Rückenmarks (z. B. MS, zervikale Stenose) — ärztliche Abklärung.",
          kurzBed: "V.a. zervikale Myelopathie" }
      ]
    },
    {
      id: "bwslws", name: "Brust-/Lendenwirbelsäule (BWS/LWS)", kurz: "Schober · Ott · Lasègue",
      icon: "LWS", farbe: "#1F618D",
      intro: "Systematik: Inspektion (Lot, Becken-/Schulterstand, Muskelrelief) → Palpation/Klopfschmerz → Beweglichkeit (FBA, Schober, Ott, Seitneigung, Rotation) → Nervendehnungszeichen → orientierende Neurologie der Beine (Kennmuskeln L4–S1, Reflexe).",
      nnm: [
        ["Gesamt-Rumpfbeuge", "Finger-Boden-Abstand (FBA) in cm"],
        ["LWS-Extension", "ca. 30°"],
        ["Lateralflexion rechts / links", "35° – 0° – 35°"],
        ["Rotation (Sitz) rechts / links", "30° – 0° – 30°"],
        ["Schober-Zeichen (LWS)", "10 → ≥ 15 cm (+ ≥ 5 cm)"],
        ["Ott-Zeichen (BWS)", "30 → 32–34 cm (+ 2–4 cm)"]
      ],
      tests: [
        { id: "lws_schober", name: "Schober-/Ott-Zeichen",
          ablauf: ["Schober: von S1 10 cm nach kranial markieren; bei max. Rumpfbeuge messen.", "Ott: von C7 30 cm nach kaudal markieren; bei Rumpfbeuge messen."],
          bedeutung: "Verminderte Zunahme = eingeschränkte Entfaltbarkeit der LWS (Schober) bzw. BWS (Ott), z. B. bei Morbus Bechterew, degenerativ oder muskulär.",
          kurzBed: "eingeschränkte WS-Entfaltung" },
        { id: "lws_lasegue", name: "Lasègue-Test (Straight Leg Raise)",
          ablauf: ["Rückenlage, das gestreckte Bein langsam anheben.", "Winkel notieren, bei dem ein in das Bein ausstrahlender Schmerz auftritt."],
          bedeutung: "Radikulärer Schmerz bei < 60° spricht für eine Reizung der Wurzeln L5/S1 (z. B. lumbaler Bandscheibenvorfall). Rein lumbaler Rückenschmerz ist unspezifisch.",
          kurzBed: "V.a. Wurzelreizung L5/S1" },
        { id: "lws_bragard", name: "Bragard-Zeichen",
          ablauf: ["Bein bis zur Schmerzgrenze (Lasègue) anheben, dann etwas absenken.", "Fuß passiv dorsalextendieren."],
          bedeutung: "Erneuter/verstärkter radikulärer Schmerz bestätigt die Nervenwurzelreizung und grenzt sie von muskulären Ursachen ab.",
          kurzBed: "bestätigt radikuläre Reizung" },
        { id: "lws_umgekehrt", name: "Umgekehrter Lasègue (Femoralis-Dehnung)",
          ablauf: ["Bauchlage, Knie gebeugt, Oberschenkel im Hüftgelenk überstrecken."],
          bedeutung: "Schmerz an der Oberschenkelvorderseite spricht für eine Reizung höherer Lumbalwurzeln (L3/L4, N. femoralis).",
          kurzBed: "V.a. Wurzelreizung L3/L4" }
      ]
    },
    {
      id: "isg", name: "Iliosakralgelenk (ISG)", kurz: "Mennell · Patrick · Vorlauf",
      icon: "ISG", farbe: "#5B2C6F",
      intro: "Das ISG hat keinen eigenen messbaren Bewegungsumfang. Die Beurteilung erfolgt über Provokations- und Bewegungstests. Immer mehrere Tests kombinieren (Einzeltest wenig aussagekräftig).",
      nnm: null,
      nnmHinweis: "Kein eigenständiger Bewegungsumfang (Neutral-Null nicht anwendbar) — Beurteilung über Provokationstests und im Seitenvergleich.",
      tests: [
        { id: "isg_faber", name: "Patrick-/FABERE-Test („Vierer-Zeichen“)",
          ablauf: ["Rückenlage, Bein in Figur-4-Position (Fuß auf das Gegenknie).", "Knie der getesteten Seite nach außen-unten drücken, Becken gegenhalten."],
          bedeutung: "Schmerz dorsal/über dem ISG spricht für eine ISG-Pathologie; Leistenschmerz eher für eine Hüft-/Coxarthrose-Ursache.",
          kurzBed: "ISG- vs. Hüftpathologie" },
        { id: "isg_mennell", name: "Mennell-Zeichen",
          ablauf: ["Bauchlage; Becken/Kreuzbein mit einer Hand fixieren.", "Das gestreckte Bein mit der anderen Hand nach hinten überstrecken (Hyperextension)."],
          bedeutung: "Schmerz über dem ISG weist auf eine ISG-Blockade/-Reizung oder Sakroiliitis hin.",
          kurzBed: "V.a. ISG-Blockade/Sakroiliitis" },
        { id: "isg_vorlauf", name: "Vorlaufphänomen",
          ablauf: ["Im Stehen beide Daumen auf die Spinae iliacae posteriores superiores (SIPS).", "Patient beugt sich langsam nach vorn; Bewegung der SIPS vergleichen."],
          bedeutung: "„Vorlaufen“ einer SIPS = eingeschränkte ISG-Beweglichkeit dieser Seite (Blockadehinweis, seitendifferent).",
          kurzBed: "Seitenhinweis ISG-Blockade" },
        { id: "isg_kompression", name: "Kompressions-/Distraktionstest",
          ablauf: ["Rückenlage: beide Beckenschaufeln zusammendrücken (Kompression) bzw. nach außen drücken (Distraktion)."],
          bedeutung: "Reproduzierbarer ISG-/tiefer Gesäßschmerz spricht für eine ISG-Beteiligung (z. B. Sakroiliitis).",
          kurzBed: "V.a. ISG-Reizung" }
      ]
    },
    {
      id: "schulter", name: "Schulter", kurz: "Neer · Hawkins · Jobe · Instabilität",
      icon: "SCH", farbe: "#B9770E",
      intro: "Systematik: Inspektion (Kontur, Atrophie Delta/Supra-/Infraspinatus) → Palpation (AC-Gelenk, Tuberkulum, lange Bizepssehne) → aktive/passive Beweglichkeit (Neutral-Null) → Rotatorenmanschette und Impingement → Instabilitäts- und AC-Gelenk-Tests.",
      nnm: [
        ["Abduktion / Adduktion", "180° – 0° – 40°"],
        ["Anteversion / Retroversion", "170° – 0° – 40°"],
        ["Außen-/Innenrotation (Arm anliegend)", "60° – 0° – 95°"],
        ["Außen-/Innenrotation (90° Abduktion)", "90° – 0° – 70°"]
      ],
      tests: [
        { id: "sch_neer", name: "Neer-Impingement-Test",
          ablauf: ["Skapula mit einer Hand fixieren.", "Den innenrotierten Arm passiv nach vorn-oben eleviert führen."],
          bedeutung: "Schmerz bei forcierter Elevation = subakromiales Impingement (Enge zwischen Humeruskopf und Akromion, oft Supraspinatus).",
          kurzBed: "subakromiales Impingement" },
        { id: "sch_hawkins", name: "Hawkins-Kennedy-Test",
          ablauf: ["Arm 90° antevertiert, Ellbogen 90° gebeugt.", "Unterarm nach unten führen (forcierte Innenrotation)."],
          bedeutung: "Schmerz = subakromiales Impingement bzw. Reizung der Supraspinatussehne.",
          kurzBed: "Impingement (Supraspinatus)" },
        { id: "sch_jobe", name: "Jobe-Test („Empty Can“)",
          ablauf: ["Arme 90° in der Skapulaebene abduzieren, Daumen nach unten.", "Patient hält gegen Abwärtsdruck des Untersuchers."],
          bedeutung: "Schmerz/Kraftminderung spricht für eine Läsion oder Tendinopathie des M. supraspinatus.",
          kurzBed: "Supraspinatus-Läsion" },
        { id: "sch_painarc", name: "Painful Arc (schmerzhafter Bogen)",
          ablauf: ["Arm aktiv in der Frontalebene abduzieren.", "Schmerzhaften Winkelbereich bestimmen."],
          bedeutung: "Schmerz bei 60–120° = subakromiales Impingement; Schmerz bei 140–180° = AC-Gelenk-Pathologie.",
          kurzBed: "Impingement bzw. AC-Gelenk" },
        { id: "sch_droparm", name: "Drop-Arm-Test",
          ablauf: ["Arm passiv auf 90° Abduktion bringen.", "Patient soll den Arm langsam absenken/halten."],
          bedeutung: "Plötzliches Absinken/Nicht-Halten-Können = größere Rotatorenmanschettenruptur (v. a. Supraspinatus).",
          kurzBed: "V.a. RM-Ruptur" },
        { id: "sch_liftoff", name: "Lift-off / Belly-press (Subscapularis)",
          ablauf: ["Lift-off: Handrücken auf das Kreuz, Hand vom Rücken abheben lassen.", "Alternativ Belly-press: Hand auf Bauch drücken, Ellbogen vorn halten."],
          bedeutung: "Nicht möglich = Läsion/Insuffizienz des M. subscapularis (Innenrotator).",
          kurzBed: "Subscapularis-Läsion" },
        { id: "sch_apprehension", name: "Apprehension-/Relocation-Test",
          ablauf: ["Rückenlage, Arm 90° abduziert, langsam außenrotieren.", "Relocation: dorsalen Druck auf den Humeruskopf ausüben."],
          bedeutung: "Abwehr/Unbehagen bei Außenrotation, Besserung durch Relocation = vordere Schulterinstabilität.",
          kurzBed: "vordere Instabilität" }
      ]
    },
    {
      id: "ellbogen", name: "Ellbogen", kurz: "Cozen · Epicondylitis · Bandstabilität",
      icon: "ELL", farbe: "#A04000",
      intro: "Systematik: Inspektion (Achse, Schwellung Recessus radialis) → Palpation (Epikondylen, Olekranon, Radiusköpfchen) → Beweglichkeit (Ext/Flex, Pro-/Supination) → Epicondylitis-Tests → Bandstabilität.",
      nnm: [
        ["Extension / Flexion", "0° (–10°) – 0° – 150°"],
        ["Unterarm-Supination / -Pronation", "90° – 0° – 90°"]
      ],
      tests: [
        { id: "ell_cozen", name: "Cozen-Test (Tennisellbogen)",
          ablauf: ["Ellbogen leicht gebeugt, Unterarm proniert, Faust ballen.", "Patient streckt Handgelenk gegen Widerstand des Untersuchers."],
          bedeutung: "Schmerz am lateralen Epicondylus = Epicondylitis humeri radialis (lateralis, „Tennisellbogen“).",
          kurzBed: "Epicondylitis radialis" },
        { id: "ell_golfer", name: "Reverse-Cozen / Golferellbogen",
          ablauf: ["Unterarm supiniert, Patient beugt Handgelenk gegen Widerstand."],
          bedeutung: "Schmerz am medialen Epicondylus = Epicondylitis humeri ulnaris (medialis, „Golferellbogen“).",
          kurzBed: "Epicondylitis ulnaris" },
        { id: "ell_valgus", name: "Valgus-/Varusstress",
          ablauf: ["Ellbogen ~20–30° beugen, Valgus- bzw. Varusstress ausüben.", "Aufklappbarkeit im Seitenvergleich beurteilen."],
          bedeutung: "Vermehrte Aufklappbarkeit medial = ulnares Kollateralband; lateral = radiales Kollateralband.",
          kurzBed: "Kollateralband-Läsion" }
      ]
    },
    {
      id: "hand", name: "Hand / Handgelenk", kurz: "Finkelstein · Phalen · Rhizarthrose",
      icon: "HAN", farbe: "#117A65",
      intro: "Systematik: Inspektion (Schwellung, Fehlstellung, Atrophie Thenar) → Palpation (Tabatière, DRUG, Fingergrundgelenke) → Beweglichkeit → Nervenkompressions- und sehnenspezifische Tests.",
      nnm: [
        ["Dorsalextension / Palmarflexion", "60° – 0° – 60° (bis 70/80)"],
        ["Radial-/Ulnarabduktion", "25° – 0° – 40°"],
        ["Unterarm Supination / Pronation", "90° – 0° – 90°"]
      ],
      tests: [
        { id: "han_finkelstein", name: "Finkelstein-Test",
          ablauf: ["Daumen in die Faust einschließen.", "Handgelenk nach ulnar abknicken (Ulnarabduktion).", "Streng genommen ist diese Variante der Eichhoff-Test — im klinischen Alltag meist als Finkelstein-Test bezeichnet."],
          bedeutung: "Schmerz über dem 1. Strecksehnenfach (radial) = Tendovaginitis stenosans de Quervain.",
          kurzBed: "Tendovaginitis de Quervain" },
        { id: "han_phalen", name: "Phalen-Test",
          ablauf: ["Handrücken gegeneinander, Handgelenke max. 90° beugen.", "Position ca. 60 s halten."],
          bedeutung: "Kribbeln/Taubheit in Finger I–III = Karpaltunnelsyndrom (Kompression N. medianus).",
          kurzBed: "Karpaltunnelsyndrom (N. medianus)" },
        { id: "han_tinel", name: "Tinel-Hoffmann-Zeichen",
          ablauf: ["Über dem Karpaltunnel (Handgelenksbeugeseite) leicht beklopfen."],
          bedeutung: "In die Finger einschießende Parästhesien = Irritation des N. medianus (Karpaltunnelsyndrom).",
          kurzBed: "N.-medianus-Irritation (KTS)" },
        { id: "han_grind", name: "Grind-Test (Daumensattelgelenk)",
          ablauf: ["Ersten Mittelhandknochen axial komprimieren und dabei rotieren."],
          bedeutung: "Krepitation/Schmerz im Daumensattelgelenk = Rhizarthrose (CMC-I-Arthrose).",
          kurzBed: "Rhizarthrose" },
        { id: "han_froment", name: "Froment-Zeichen",
          ablauf: ["Ein Blatt Papier zwischen Daumen und Zeigefinger halten und wegziehen."],
          bedeutung: "Kompensatorische Beugung im Daumenendglied = Schwäche des M. adductor pollicis (N. ulnaris).",
          kurzBed: "N.-ulnaris-Läsion" },
        { id: "han_watson", name: "Watson-Test (Scaphoid-Shift)",
          ablauf: ["Druck auf den distalen Skaphoidpol, Handgelenk von ulnar nach radial führen."],
          bedeutung: "Schmerzhaftes Schnappen = skapholunäre (SL-)Bandinstabilität.",
          kurzBed: "SL-Bandinstabilität" }
      ]
    },
    {
      id: "huefte", name: "Hüfte", kurz: "Thomas · Trendelenburg · FADIR/FABER",
      icon: "HÜF", farbe: "#7D3C98",
      intro: "Systematik: Gangbild/Hinken → Inspektion (Beinlänge, Becken) → Beweglichkeit (Neutral-Null) → Kontraktur- und Impingement-Tests → Abduktorenfunktion (Trendelenburg).",
      nnm: [
        ["Flexion / Extension", "130° – 0° – 10° (bis 140)"],
        ["Abduktion / Adduktion", "45° – 0° – 30°"],
        ["Außen-/Innenrotation (90° Flexion)", "50° – 0° – 40°"],
        ["Außen-/Innenrotation (Streckung)", "40° – 0° – 30°"]
      ],
      tests: [
        { id: "hue_thomas", name: "Thomas-Handgriff",
          ablauf: ["Rückenlage; die kontralaterale Hüfte maximal beugen (Lordose ausgleichen).", "Beobachten, ob sich das getestete Bein von der Unterlage abhebt."],
          bedeutung: "Abheben/Beugung des gestreckten Beins = Hüftbeugekontraktur (Flexionskontraktur, z. B. Coxarthrose).",
          kurzBed: "Hüftbeugekontraktur" },
        { id: "hue_trendelenburg", name: "Trendelenburg-/Duchenne-Zeichen",
          ablauf: ["Einbeinstand auf der zu testenden Seite.", "Beckenstand der Spielbeinseite beobachten."],
          bedeutung: "Absinken des Beckens zur Spielbeinseite (bzw. Rumpfneigung zur Standbeinseite = Duchenne) = Insuffizienz der Hüftabduktoren (M. glutaeus medius).",
          kurzBed: "Glutealinsuffizienz" },
        { id: "hue_fadir", name: "FADIR-/Impingement-Test",
          ablauf: ["Hüfte und Knie 90° beugen; dann Flexion + Adduktion + Innenrotation."],
          bedeutung: "Reproduzierbarer Leistenschmerz = femoroacetabuläres Impingement (FAI) bzw. Labrumläsion.",
          kurzBed: "V.a. FAI / Labrumläsion" },
        { id: "hue_faber", name: "FABER-/Patrick-Test",
          ablauf: ["Bein in Figur-4-Position, Knie nach außen-unten drücken."],
          bedeutung: "Leistenschmerz spricht für eine Hüft-/Coxarthrose-Ursache; dorsaler Schmerz eher für das ISG.",
          kurzBed: "Coxarthrose vs. ISG" },
        { id: "hue_drehmann", name: "Drehmann-Zeichen",
          ablauf: ["Hüfte passiv beugen und dabei die Rotation beobachten."],
          bedeutung: "Zwangsläufige Außenrotation bei zunehmender Beugung = strukturelle Hüftpathologie (z. B. Epiphysiolysis capitis femoris, Coxarthrose).",
          kurzBed: "strukturelle Hüftpathologie" }
      ]
    },
    {
      id: "knie", name: "Knie", kurz: "Schublade · Lachman · McMurray · Stabilität",
      icon: "KNI", farbe: "#884EA0",
      intro: "Systematik: Inspektion (Achse, Schwellung, Atrophie Vastus medialis) → Erguss (tanzende Patella) → Beweglichkeit → Bandstabilität (Kreuz-/Kollateralbänder) → Meniskuszeichen → Patellofemoral.",
      nnm: [
        ["Extension / Flexion", "0° (–5°) – 0° – 140°"],
        ["Rotation (90° Flexion) außen/innen", "30° – 0° – 10°"]
      ],
      tests: [
        { id: "kni_erguss", name: "Tanzende Patella (Erguss)",
          ablauf: ["Recessus suprapatellaris ausstreichen, dann die Patella nach dorsal drücken."],
          bedeutung: "Federndes Anschlagen der Patella = intraartikulärer Kniegelenkerguss.",
          kurzBed: "Kniegelenkerguss" },
        { id: "kni_schubladeV", name: "Vordere Schublade",
          ablauf: ["Knie 90° beugen, Fuß fixieren; Tibia mit beiden Händen nach vorn ziehen."],
          bedeutung: "Vermehrte Ventralverschiebung der Tibia = Insuffizienz des vorderen Kreuzbands (VKB).",
          kurzBed: "V.a. VKB-Ruptur" },
        { id: "kni_lachman", name: "Lachman-Test",
          ablauf: ["Knie ca. 20–30° beugen; Femur fixieren, Tibia nach vorn ziehen.", "Ausmaß der Translation und Endpunkt („weich“) beurteilen."],
          bedeutung: "Vermehrte Translation mit weichem Anschlag = VKB-Insuffizienz (sensibelster Kreuzbandtest).",
          kurzBed: "V.a. VKB-Ruptur" },
        { id: "kni_schubladeH", name: "Hintere Schublade",
          ablauf: ["Knie 90° beugen; Tibia nach hinten drücken.", "Auf dorsales Absinken der Tibia achten (Rücklauf-/Sag-Zeichen)."],
          bedeutung: "Vermehrte Dorsalverschiebung = Insuffizienz des hinteren Kreuzbands (HKB).",
          kurzBed: "V.a. HKB-Ruptur" },
        { id: "kni_valgus", name: "Valgus-/Varusstress (0° und 30°)",
          ablauf: ["In Streckung und in 30° Beugung Valgus- bzw. Varusstress ausüben."],
          bedeutung: "Mediale Aufklappbarkeit = Innenband (MCL); laterale Aufklappbarkeit = Außenband (LCL). Aufklappbarkeit in Streckung spricht für zusätzliche Kreuzbandbeteiligung.",
          kurzBed: "Kollateralband-Läsion (MCL/LCL)" },
        { id: "kni_mcmurray", name: "McMurray-Test",
          ablauf: ["Knie maximal beugen; unter Außenrotation strecken (Innenmeniskus) bzw. unter Innenrotation (Außenmeniskus)."],
          bedeutung: "Schnappen/Schmerz am Gelenkspalt = Meniskusläsion.",
          kurzBed: "V.a. Meniskusläsion" },
        { id: "kni_steinmann", name: "Steinmann I / II",
          ablauf: ["Steinmann I: bei gebeugtem Knie Unterschenkel ruckartig rotieren.", "Steinmann II: Druckschmerz am Gelenkspalt wandert bei Beugung nach dorsal."],
          bedeutung: "Rotations-/Druckschmerz am Gelenkspalt = Meniskusläsion.",
          kurzBed: "V.a. Meniskusläsion" },
        { id: "kni_zohlen", name: "Zohlen-Zeichen / Patella-Anpresstest",
          ablauf: ["Patella nach distal drücken; Patient spannt den Quadrizeps an."],
          bedeutung: "Retropatellarer Schmerz = femoropatellares Schmerzsyndrom / retropatellare Chondropathie (Test wenig spezifisch).",
          kurzBed: "femoropatellares Schmerzsyndrom" }
      ]
    },
    {
      id: "osg", name: "Sprunggelenk / Fuß", kurz: "Schublade OSG · Thompson · Syndesmose",
      icon: "OSG", farbe: "#1A5276",
      intro: "Systematik: Inspektion (Schwellung, Hämatom, Fußform) → Palpation (Malleolen, Basis MT V, Achillessehne, Syndesmose) → Beweglichkeit OSG/USG → Bandstabilität → Achillessehne/Syndesmose. Bei akutem Trauma Ottawa-Ankle-Rules beachten.",
      nnm: [
        ["OSG Dorsalextension / Plantarflexion", "20° – 0° – 50° (bis 30/50)"],
        ["USG Eversion / Inversion (Rückfuß)", "15° – 0° – 35°"],
        ["Vorfuß Pronation / Supination", "orientierend im Seitenvergleich"]
      ],
      tests: [
        { id: "osg_schublade", name: "Vordere Schublade (OSG)",
          ablauf: ["Unterschenkel/Tibia fixieren; Ferse (Kalkaneus) nach vorn ziehen."],
          bedeutung: "Vermehrter Talusvorschub = Läsion des Lig. fibulotalare anterius (LFTA/ATFL, laterale Bandläsion).",
          kurzBed: "V.a. laterale Bandläsion (LFTA)" },
        { id: "osg_taluskippung", name: "Taluskippung (Inversionsstress)",
          ablauf: ["Rückfuß in Inversion/Supination kippen; Aufklappbarkeit im Seitenvergleich."],
          bedeutung: "Vermehrte laterale Aufklappbarkeit = Läsion der lateralen Bänder (LFTA + Lig. fibulocalcaneare).",
          kurzBed: "laterale Bandinstabilität" },
        { id: "osg_thompson", name: "Thompson-Test (Wadenkompression)",
          ablauf: ["Bauchlage, Fuß über die Kante hängen lassen; Wade kräftig zusammendrücken."],
          bedeutung: "Ausbleibende Plantarflexion des Fußes = komplette Achillessehnenruptur.",
          kurzBed: "V.a. Achillessehnenruptur" },
        { id: "osg_squeeze", name: "Squeeze-Test (Syndesmose)",
          ablauf: ["Tibia und Fibula auf Höhe der Wadenmitte zusammendrücken."],
          bedeutung: "Schmerz distal über der Syndesmose = Verdacht auf Syndesmosenverletzung („hohe“ OSG-Distorsion).",
          kurzBed: "V.a. Syndesmosenverletzung" }
      ]
    }
  ];

  /* ======================================================================
     Rendering
     ====================================================================== */
  // Kurzform des Bewegungslabels für den Baustein (Klammerzusätze entfernen)
  function shortLabel(s) {
    return String(s).replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  }

  function nnmHtml(joint) {
    var out = '<div class="box bx-blue"><div class="lbl">Neutral-Null-Methode</div>' +
      'Messung als <b>Bewegung&nbsp;A – 0° – Bewegung&nbsp;B</b> ausgehend von der anatomischen Neutralstellung (0°). ' +
      'Gemessene Werte rechts eintragen (Seitenvergleich) — sie werden in die PVS-Dokumentation übernommen.</div>';
    out += vidFig(VID_NNM, "Neutral-Null-Prinzip");
    if (joint.nnm) {
      out += '<table class="orth-nnm"><thead><tr><th>Bewegung</th><th>Normwert</th><th>Gemessen</th></tr></thead><tbody>';
      joint.nnm.forEach(function (r, idx) {
        var key = joint.id + "_n" + idx;
        out += '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td>' +
          '<td class="orth-nnm-in"><input type="text" data-orth-nnm="' + esc(key) + '" ' +
          'placeholder="' + esc(r[1]) + '" aria-label="Gemessen: ' + esc(shortLabel(r[0])) + '"></td></tr>';
      });
      out += '</tbody></table>';
      out += '<div class="note">Richtwerte für Erwachsene; altersabhängige Streubreite. Quelle: allgemeine orthopädische Untersuchungslehre (Neutral-0-Methode nach Debrunner).</div>';
    } else if (joint.nnmHinweis) {
      out += '<div class="box bx-gray"><div class="lbl">Hinweis</div>' + esc(joint.nnmHinweis) + '</div>';
    }
    return out;
  }

  function wireNnm(ctx) {
    var root = ctx.root, state = ctx.state;
    if (!state.nnm) state.nnm = {};
    root.querySelectorAll("[data-orth-nnm]").forEach(function (inp) {
      var key = inp.getAttribute("data-orth-nnm");
      if (state.nnm[key] != null && state.nnm[key] !== "") inp.value = state.nnm[key];
      inp.addEventListener("input", function () {
        state.nnm[key] = inp.value;
        ctx.refresh();
      });
    });
  }

  function testsHtml(joint) {
    return joint.tests.map(function (t) {
      var body = "";
      if (t.ablauf && t.ablauf.length) {
        body += '<div class="orth-sub">Durchführung</div><ul class="orth-ul">' +
          t.ablauf.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join("") + '</ul>';
      }
      body += vidFig(VIDEOS[t.id], t.name);
      return '<div class="orth-card">' +
        '<div class="orth-card-hd"><div class="orth-name">' + esc(t.name) + '</div>' +
        '<div class="orth-toggle" data-orth-test="' + esc(t.id) + '">' +
        '<button type="button" class="orth-tg neg" data-val="neg">negativ</button>' +
        '<button type="button" class="orth-tg pos" data-val="pos">positiv</button>' +
        '</div></div>' +
        '<div class="orth-mean"><b>Bei positiv:</b> ' + esc(t.bedeutung) + '</div>' +
        '<details class="orth-det"><summary>Durchführung &amp; Video anzeigen</summary>' +
        '<div class="orth-body">' + body + '</div></details>' +
        '</div>';
    }).join("");
  }

  function wireTests(ctx) {
    var root = ctx.root, state = ctx.state;
    if (!state.tests) state.tests = {};
    root.querySelectorAll("[data-orth-test]").forEach(function (row) {
      var key = row.getAttribute("data-orth-test");
      row.querySelectorAll("[data-val]").forEach(function (btn) {
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var val = btn.getAttribute("data-val");
          var next = state.tests[key] === val ? null : val;
          state.tests[key] = next;
          row.querySelectorAll("[data-val]").forEach(function (b) {
            b.classList.toggle("sel", b === btn && !!next);
          });
          ctx.refresh();
        });
      });
      // beim (Neu-)Rendern bestehende Auswahl spiegeln
      var cur = state.tests[key];
      if (cur) {
        var active = row.querySelector('[data-val="' + cur + '"]');
        if (active) active.classList.add("sel");
      }
    });
  }

  /* ======================================================================
     SOP-Definition je Gelenk aufbauen
     ====================================================================== */
  function buildJoint(joint) {
    var bemId = joint.id + "_bem";

    PCM.registerSOP({
      id: "orth-" + joint.id,
      titel: joint.name,
      untertitel: joint.kurz,
      icon: joint.icon,
      farbe: joint.farbe,
      version: "1.1",
      stand: "17.07.2026",
      bereich: "Orthopädie",
      kategorie: "Orthopädie",
      leitlinie: "Orthopädische Untersuchungslehre · Neutral-0-Methode",
      delegationshinweis: "Klinische Basisuntersuchung im Rahmen der Kompetenz/Delegation. Diagnosestellung, Bildgebung und Therapie erfolgen ärztlich. Bei Trauma-, Fraktur- oder Infektzeichen keine Funktionsprüfung erzwingen.",

      schritte: [
        {
          nr: 1, titel: "Untersuchungsgang & Sicherheit", rolle: "Hinweis", rolleStil: "blue", farbe: joint.farbe, offen: true,
          elemente: [
            { typ: "info", stil: "blau", titel: "Systematik", text: joint.intro },
            { typ: "info", stil: "rot", titel: "Vor der Funktionsprüfung ausschließen",
              text: "Frisches relevantes Trauma, Fehlstellung/Fraktur-Verdacht, Belastungsunfähigkeit, Infekt-/Entzündungszeichen (Rötung, Überwärmung, Fieber) oder neurovaskuläre Ausfälle → keine forcierte Funktionsprüfung, ärztlich abklären." }
          ]
        },
        {
          nr: 2, titel: "Neutral-Null-Methode (Beweglichkeit)", rolle: "Funktion", rolleStil: "blue", farbe: joint.farbe,
          elemente: [
            { typ: "orthnnm", id: joint.id + "_nnm", render: function () { return nnmHtml(joint); }, wire: wireNnm },
            { typ: "text", id: bemId, label: "Bemerkung (optional):",
              platzhalter: "z. B. endgradig schmerzhaft, links frei beweglich" }
          ]
        },
        {
          nr: 3, titel: "Spezifische Funktionstests", rolle: "Tests", rolleStil: "orange", farbe: joint.farbe,
          elemente: [
            { typ: "info", stil: "grau", text: "Test auf- und zuklappen für Durchführung und Untersuchungsvideo (Vorschaubild anklicken = Video groß abspielen). Ergebnis über „positiv“/„negativ“ markieren — fließt in die Dokumentation ein." },
            { typ: "orthtests", id: joint.id + "_tests", render: function () { return testsHtml(joint); }, wire: wireTests }
          ]
        }
      ],

      baustein: function (st) {
        var pos = [], neg = [];
        joint.tests.forEach(function (t) {
          var v = (st.tests || {})[t.id];
          if (v === "pos") pos.push(t.name + (t.kurzBed ? " (" + t.kurzBed + ")" : ""));
          else if (v === "neg") neg.push(t.name);
        });
        var be = "Klinische Untersuchung " + joint.name + ".";
        var romParts = [];
        if (joint.nnm) {
          joint.nnm.forEach(function (r, idx) {
            var v = String((st.nnm || {})[joint.id + "_n" + idx] || "").trim();
            if (v) romParts.push(shortLabel(r[0]) + " " + v);
          });
        }
        if (romParts.length) be += " Beweglichkeit (Neutral-Null): " + romParts.join("; ") + ".";
        var bem = String(st[bemId] || "").trim();
        if (bem) be += " " + bem + (/[.!?]$/.test(bem) ? "" : ".");
        if (pos.length) be += " Auffällige Tests: " + pos.join("; ") + ".";
        if (neg.length) be += " Unauffällig: " + neg.join(", ") + ".";
        if (!pos.length && !neg.length && !romParts.length && !bem) {
          be += " Orientierend ohne dokumentierte Auffälligkeit.";
        }
        return {
          AN: "Orthopädische Untersuchung " + joint.name + " durchgeführt.",
          BE: be
        };
      }
    });
  }

  JOINTS.forEach(buildJoint);
})();
