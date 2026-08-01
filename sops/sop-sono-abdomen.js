(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function hasText(value) { return value != null && String(value).trim() !== ""; }

  /* ----------------------------------------------------------------------
     Beispielbilder je Befund (lokal in assets/sonographie/).
     Quelle: Sonographie-Atlas, sonographiebilder.de
     (c) Immanuel Albertinen Diakonie gGmbH - Nutzung mit freundlicher
     Genehmigung unter Angabe der Quelle. Schluessel = organKey__optId.
     ---------------------------------------------------------------------- */
  var IMG_BASE = "assets/sonographie/";
  var IMAGES = {
    "leber__steatose":              { file: "abd_leber_steatose.jpg",       cap: "Generalisierte Fettleber (Steatosis hepatis)",                  src: "https://sonographiebilder.de/leber/verfettungsstoerung" },
    "leber__hepatomegalie":         { file: "abd_leber_hepatomegalie.jpg",  cap: "Hepatomegalie",                                                  src: "https://sonographiebilder.de/hepatomegalie" },
    "leber__zyste":                 { file: "abd_leber_zyste.jpg",          cap: "Einfache (dysontogenetische) Leberzyste",                        src: "https://sonographiebilder.de/leber-zysten" },
    "leber__zirrhose":              { file: "abd_leber_zirrhose.jpg",       cap: "Hoeckerige Leberoberflaeche bei Zirrhose, Aszites",              src: "https://sonographiebilder.de/zirrhose" },
    "leber__raumforderung":         { file: "abd_leber_raumforderung.jpg",  cap: "Solitaeres hepatozellulaeres Karzinom (HCC)",                    src: "https://sonographiebilder.de/maligne-herde" },
    "gallenblase__steine":          { file: "abd_gallenblase_steine.jpg",   cap: "Gallenblasenkonkremente (Cholezystolithiasis)",                  src: "https://sonographiebilder.de/sonographie-bilder/gallenblase/cholezystolithiasis" },
    "gallenblase__cholezystitis":   { file: "abd_gallenblase_cholezystitis.jpg", cap: "Akute Cholezystitis mit Wandverdickung und Lamellierung",   src: "https://sonographiebilder.de/sonographie-bilder/gallenblase/cholezystitis" },
    "gallenblase__polyp":           { file: "abd_gallenblase_polyp.jpg",    cap: "Gallenblasenpolypen",                                            src: "https://sonographiebilder.de/gb-u-cholesterinpolypen" },
    "gallenblase__dhc":             { file: "abd_gallenblase_dhc.jpg",      cap: "Erweiterte Gallenwege (Cholestase)",                             src: "https://sonographiebilder.de/cholestase" },
    "pankreas__pankreatitis":       { file: "abd_pankreas_pankreatitis.jpg", cap: "Akute Pankreatitis mit peripankreatischer Fluessigkeit",        src: "https://sonographiebilder.de/akute-pankreatitis" },
    "pankreas__zyste":              { file: "abd_pankreas_zyste.jpg",       cap: "Pankreaspseudozyste",                                            src: "https://sonographiebilder.de/pankreas-zysten" },
    "pankreas__raumforderung":      { file: "abd_pankreas_raumforderung.jpg", cap: "Pankreaskarzinom",                                             src: "https://sonographiebilder.de/pankreas-carcinom" },
    "milz__splenomegalie":          { file: "abd_milz_splenomegalie.jpg",   cap: "Splenomegalie",                                                  src: "https://sonographiebilder.de/splenomegalie" },
    "milz__zyste":                  { file: "abd_milz_zyste.jpg",           cap: "Milzzyste",                                                      src: "https://sonographiebilder.de/milz-zysten" },
    "niere_re__zyste":              { file: "abd_niere_zyste.jpg",          cap: "Kortikale Nierenzyste (Bosniak I)",                              src: "https://sonographiebilder.de/zysten" },
    "niere_re__steine":             { file: "abd_niere_steine.jpg",         cap: "Nephrolithiasis mit Konkrement im Nierenkelch",                  src: "https://sonographiebilder.de/lithiasis" },
    "niere_re__harnstau":           { file: "abd_niere_harnstau.jpg",       cap: "Harnstauungsniere (Hydronephrose)",                              src: "https://sonographiebilder.de/hydronephrose" },
    "niere_re__raumforderung":      { file: "abd_niere_raumforderung.jpg",  cap: "Nierenzellkarzinom",                                             src: "https://sonographiebilder.de/nierentumore" },
    "niere_li__zyste":              { file: "abd_niere_zyste.jpg",          cap: "Kortikale Nierenzyste (Bosniak I)",                              src: "https://sonographiebilder.de/zysten" },
    "niere_li__steine":             { file: "abd_niere_steine.jpg",         cap: "Nephrolithiasis mit Konkrement im Nierenkelch",                  src: "https://sonographiebilder.de/lithiasis" },
    "niere_li__harnstau":           { file: "abd_niere_harnstau.jpg",       cap: "Harnstauungsniere (Hydronephrose)",                              src: "https://sonographiebilder.de/hydronephrose" },
    "niere_li__raumforderung":      { file: "abd_niere_raumforderung.jpg",  cap: "Nierenzellkarzinom",                                             src: "https://sonographiebilder.de/nierentumore" },
    "harnblase__steine":            { file: "abd_harnblase_steine.jpg",     cap: "Harnblasenstein mit Sedimentation",                              src: "https://sonographiebilder.de/blasenstein" },
    "harnblase__wandprozess":       { file: "abd_harnblase_wandprozess.jpg", cap: "Harnblasentumor (Wandprozess)",                                 src: "https://sonographiebilder.de/blasentumor" },
    "aorta__aneurysma":             { file: "abd_aorta_aneurysma.jpg",      cap: "Bauchaortenaneurysma (Laengsschnitt)",                           src: "https://sonographiebilder.de/gefaesse-lk/pathologien-bauchaorta" },
    "aorta__arteriosklerose":       { file: "abd_aorta_arteriosklerose.jpg", cap: "Arteriosklerotische Wandveraenderungen der Aorta",              src: "https://sonographiebilder.de/gefaesse-lk/pathologien-bauchaorta" },
    "peritoneum__aszites":          { file: "abd_peritoneum_aszites.jpg",   cap: "Aszites (freie Fluessigkeit) subhepatisch",                      src: "https://sonographiebilder.de/ascites" },
    "darm__ileus":                  { file: "abd_darm_ileus.jpg",           cap: "Duenndarmileus mit dilatierten, fluessigkeitsgefuellten Schlingen", src: "https://sonographiebilder.de/menue-links/sonographie-bilder/duenndarm/ileus" },
    "darm__divertikulitis":         { file: "abd_darm_divertikulitis.jpg",  cap: "Sigmadivertikulitis: wandverdicktes Divertikel mit Pannus",      src: "https://sonographiebilder.de/menue-links/sonographie-bilder/kolon/divertikel" }
  };

  function imgHtml(key) {
    var m = IMAGES[key];
    if (!m) return "";
    return '<figure class="sono-figure">' +
      '<img class="sono-img" src="' + esc(IMG_BASE + m.file) + '" alt="Beispielbild: ' + esc(m.cap) + '" loading="lazy" data-lightbox data-caption="' + esc(m.cap) + ' — Quelle: Sonographie-Atlas (Immanuel Albertinen Diakonie)">' +
      '<figcaption class="sono-figcap">' + esc(m.cap) +
      ' · <a href="' + esc(m.src) + '" target="_blank" rel="noopener noreferrer">Sonographie-Atlas (Immanuel Albertinen Diakonie)</a></figcaption>' +
      '</figure>';
  }

  var ORGANE = [
    {
      key: "leber", titel: "Leber",
      normal: "Leber normal groß, Organkontur glatt, Echotextur homogen, keine fokale Läsion, Lebervenen und Pfortader regelrecht.",
      optionen: [
        { id: "steatose", name: "Steatosis hepatis (Fettleber)", beschreibung: "Diffus echogenitätsangehobenes Leberparenchym mit Schallabschwächung nach dorsal, vereinbar mit Steatosis hepatis.", icd: "K76.0G" },
        { id: "hepatomegalie", name: "Hepatomegalie", beschreibung: "Vergrößerte Leber, kraniokaudaler Durchmesser (MCL) {wert}, Parenchym ansonsten unauffällig.", messfeld: { label: "Durchmesser MCL", einheit: "cm", platzhalter: "z. B. 16" }, icd: "R16.0G" },
        { id: "zyste", name: "Leberzyste", beschreibung: "Echofreie, glatt begrenzte, dorsal schallverstärkte Raumforderung, Durchmesser {wert}, vereinbar mit einfacher Leberzyste.", messfeld: { label: "Durchmesser", einheit: "mm", platzhalter: "z. B. 15" }, icd: "K76.8G" },
        { id: "zirrhose", name: "Zeichen einer Leberzirrhose", beschreibung: "Höckerige Leberoberfläche, inhomogenes, grobscholliges Parenchym, ggf. Splenomegalie und Aszites, vereinbar mit Leberzirrhose.", icd: "K74.60G", warn: true },
        { id: "raumforderung", name: "Unklare fokale Leberläsion (V. a. Malignität)", beschreibung: "Fokale, echoarme/inhomogene Raumforderung mit unregelmäßiger Begrenzung, Durchmesser {wert} - weitere Abklärung (KM-Sonographie/CT/MRT) empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "R93.2V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "gallenblase", titel: "Gallenblase / Gallenwege",
      normal: "Gallenblase regelrecht konfiguriert, wandschlank, kein Konkrementnachweis, Gallenwege nicht erweitert.",
      optionen: [
        { id: "steine", name: "Gallensteine (Cholezystolithiasis)", beschreibung: "Echodichte, schallschattengebende, lageveränderliche Konkremente in der Gallenblase, größtes Konkrement {wert}.", messfeld: { label: "Größe größtes Konkrement", einheit: "mm" }, icd: "K80.20G" },
        { id: "cholezystitis", name: "V. a. akute Cholezystitis", beschreibung: "Wandverdickung > 3 mm mit Dreischichtung, ggf. perivesikuläre Flüssigkeit, sonographisches Murphy-Zeichen positiv.", icd: "K81.0V", warn: true },
        { id: "polyp", name: "Gallenblasenpolyp", beschreibung: "Wandständige, nicht schallschattengebende, lagekonstante Raumforderung, Durchmesser {wert}, vereinbar mit Gallenblasenpolyp.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "K82.8G" },
        { id: "dhc", name: "Erweiterte Gallenwege (Cholestasezeichen)", beschreibung: "Ductus hepatocholedochus erweitert auf {wert} - V. a. Abflussbehinderung.", messfeld: { label: "DHC-Durchmesser", einheit: "mm" }, icd: "K83.1V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "pankreas", titel: "Pankreas",
      normal: "Pankreas, soweit einsehbar, unauffällig, keine Raumforderung, Gangweite nicht erweitert.",
      optionen: [
        { id: "pankreatitis", name: "V. a. akute Pankreatitis", beschreibung: "Diffus vergrößertes, echoarmes Pankreasparenchym mit unscharfer Kontur, ggf. peripankreatische Flüssigkeit.", icd: "K85.9V", warn: true },
        { id: "zyste", name: "Pankreaszyste", beschreibung: "Echofreie, glatt begrenzte Läsion im Pankreas, Durchmesser {wert}.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "K86.2G" },
        { id: "raumforderung", name: "Unklare Pankreasraumforderung", beschreibung: "Echoarme, unregelmäßig begrenzte Raumforderung, Durchmesser {wert} - weitere Abklärung (Endosonographie/CT) empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "R93.5V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "milz", titel: "Milz",
      normal: "Milz normal groß (Längsdurchmesser < 11 cm), homogenes Echomuster, keine fokale Läsion.",
      optionen: [
        { id: "splenomegalie", name: "Splenomegalie", beschreibung: "Vergrößerte Milz, Längsdurchmesser {wert}, Parenchym homogen.", messfeld: { label: "Längsdurchmesser", einheit: "cm" }, icd: "R16.1G" },
        { id: "zyste", name: "Milzzyste", beschreibung: "Echofreie, glatt begrenzte Läsion, Durchmesser {wert}.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "D73.4G" },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "niere_re", titel: "Niere rechts",
      normal: "Niere rechts regelrecht positioniert, normal groß, Parenchym-Pyelon-Differenzierung erhalten, kein Harnstau, keine Konkremente.",
      optionen: [
        { id: "zyste", name: "Nierenzyste", beschreibung: "Echofreie, glatt begrenzte kortikale Raumforderung, Durchmesser {wert} (Bosniak I).", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "N28.1G" },
        { id: "steine", name: "Nierensteine (Nephrolithiasis)", beschreibung: "Echodichte, schallschattengebende Konkremente im Nierenbecken-/Kelchsystem, größtes Konkrement {wert}.", messfeld: { label: "Größe größtes Konkrement", einheit: "mm" }, icd: "N20.0G" },
        { id: "harnstau", name: "Harnstauungsniere (Hydronephrose)", beschreibung: "Erweitertes Nierenbecken-/Kelchsystem, vereinbar mit Harnstauung.", icd: "N13.30G", warn: true },
        { id: "raumforderung", name: "Unklare Nierenraumforderung", beschreibung: "Solide, echoinhomogene Raumforderung, Durchmesser {wert} - weitere Abklärung empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "R93.4V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "niere_li", titel: "Niere links",
      normal: "Niere links regelrecht positioniert, normal groß, Parenchym-Pyelon-Differenzierung erhalten, kein Harnstau, keine Konkremente.",
      optionen: [
        { id: "zyste", name: "Nierenzyste", beschreibung: "Echofreie, glatt begrenzte kortikale Raumforderung, Durchmesser {wert} (Bosniak I).", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "N28.1G" },
        { id: "steine", name: "Nierensteine (Nephrolithiasis)", beschreibung: "Echodichte, schallschattengebende Konkremente im Nierenbecken-/Kelchsystem, größtes Konkrement {wert}.", messfeld: { label: "Größe größtes Konkrement", einheit: "mm" }, icd: "N20.0G" },
        { id: "harnstau", name: "Harnstauungsniere (Hydronephrose)", beschreibung: "Erweitertes Nierenbecken-/Kelchsystem, vereinbar mit Harnstauung.", icd: "N13.30G", warn: true },
        { id: "raumforderung", name: "Unklare Nierenraumforderung", beschreibung: "Solide, echoinhomogene Raumforderung, Durchmesser {wert} - weitere Abklärung empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "R93.4V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "harnblase", titel: "Harnblase",
      normal: "Harnblase mäßig gefüllt, wandschlank, kein relevanter Restharn, keine intraluminale Raumforderung.",
      optionen: [
        { id: "restharn", name: "Erhöhter Restharn", beschreibung: "Restharnvolumen nach Miktion ca. {wert}.", messfeld: { label: "Restharnvolumen", einheit: "ml" }, icd: "R39.8G" },
        { id: "steine", name: "Harnblasensteine", beschreibung: "Echodichte, schallschattengebende, lageveränderliche Konkremente in der Harnblase, Durchmesser {wert}.", messfeld: { label: "Größe", einheit: "mm" }, icd: "N21.0G" },
        { id: "wandprozess", name: "V. a. Harnblasenwandprozess", beschreibung: "Umschriebene Wandverdickung/polypoide Struktur, Durchmesser {wert} - weitere urologische Abklärung (Zystoskopie) empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "R93.4V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "aorta", titel: "Aorta / große Gefäße",
      normal: "Aorta abdominalis im Verlauf regelrecht, Durchmesser < 3 cm, keine Wandunregelmäßigkeiten, keine Thrombosierung.",
      optionen: [
        { id: "aneurysma", name: "Bauchaortenaneurysma", beschreibung: "Aorta abdominalis aneurysmatisch erweitert, maximaler Durchmesser {wert}.", messfeld: { label: "Durchmesser", einheit: "cm", platzhalter: "z. B. 4.2" }, icd: "I71.4G", warn: true },
        { id: "arteriosklerose", name: "Arteriosklerotische Wandveränderungen", beschreibung: "Wandunregelmäßigkeiten/Kalzifikationen im Aortenverlauf ohne relevante Erweiterung.", icd: "I70.0G" },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "peritoneum", titel: "Freie Flüssigkeit / Peritoneum",
      normal: "Kein Nachweis freier Flüssigkeit intraabdominell.",
      optionen: [
        { id: "aszites", name: "Aszites", beschreibung: "Nachweis freier Flüssigkeit intraabdominell, Ausmaß: {wert}.", messfeld: { label: "Ausmaß", typ: "text", platzhalter: "gering / mäßig / ausgeprägt" }, icd: "R18G" },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "darm", titel: "Darm (orientierend)",
      normal: "Darm orientierend ohne Nachweis dilatierter Schlingen, unauffällige Peristaltik, keine Kokarden.",
      optionen: [
        { id: "ileus", name: "V. a. mechanischen Ileus", beschreibung: "Dilatierte, flüssigkeitsgefüllte Dünndarmschlingen mit Pendelperistaltik.", icd: "K56.7V", warn: true },
        { id: "divertikulitis", name: "V. a. Sigmadivertikulitis", beschreibung: "Kokardenartige Wandverdickung im linken Unterbauch, Durchmesser {wert}, umgebende entzündliche Reaktion.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "K57.92V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    }
  ];

  function organById(key) { return ORGANE.filter(function (o) { return o.key === key; })[0] || null; }
  function optionById(o, id) { return (o.optionen || []).filter(function (opt) { return opt.id === id; })[0] || null; }

  function sonoState(s) {
    s.sonoAbdomen = s.sonoAbdomen || {};
    var d = s.sonoAbdomen;
    if (!d.tab) d.tab = ORGANE[0].key;
    if (!d.organe) d.organe = {};
    return d;
  }

  function isOrganDone(d, o) {
    var os = d.organe[o.key];
    return !!(os && os.auswahl && os.auswahl.length);
  }

  function optionCardHtml(o, opt) {
    var extra = "";
    var key = o.key + "__" + opt.id;
    if (opt.messfeld) {
      var mf = opt.messfeld;
      var inputType = mf.typ === "text" ? "text" : "number";
      extra = '<div class="form-row" data-sono-extra="' + esc(key) + '" style="display:none;padding:0 11px 10px">' +
        '<label>' + esc(mf.label) + '</label>' +
        '<input type="' + inputType + '" data-sono-mess="' + esc(key) + '" placeholder="' + esc(mf.platzhalter || "") + '" style="width:110px">' +
        (mf.einheit ? '<span class="unit-btn sel" style="cursor:default">' + esc(mf.einheit) + '</span>' : '') +
        '</div>';
    } else if (opt.freitext) {
      extra = '<div data-sono-extra="' + esc(key) + '" style="display:none;padding:0 11px 10px">' +
        '<textarea data-sono-freitext="' + esc(key) + '" placeholder="Freitext-Befund" style="width:100%;min-height:60px;border:1px solid var(--linie);border-radius:6px;padding:6px 8px;font:inherit"></textarea></div>';
    }
    var img = imgHtml(key);
    var help = img ? ('<button class="derm-help" type="button" data-sono-help="' + esc(key) + '">▸ Beispielbild</button>' +
      '<div class="derm-help-panel" data-sono-help-panel="' + esc(key) + '">' + img + '</div>') : "";
    var cls = opt.warn ? " warn" : "";
    return '<div class="derm-card' + cls + '" data-sono-card="' + esc(o.key) + '" data-id="' + esc(opt.id) + '">' +
      '<div class="derm-card-top"><div class="derm-card-title">' + esc(opt.name) + '</div>' +
      (opt.beschreibung ? '<div class="derm-card-desc">' + esc(opt.beschreibung.replace("{wert}", "…")) + '</div>' : '') +
      '</div>' + extra + help + '</div>';
  }

  function organPanelHtml(o) {
    var normalCard = '<div class="derm-card" data-sono-card="' + esc(o.key) + '" data-id="__normal__">' +
      '<div class="derm-card-top"><div class="derm-card-title">Normalbefund</div><div class="derm-card-desc">' + esc(o.normal) + '</div></div></div>';
    var cards = (o.optionen || []).map(function (opt) { return optionCardHtml(o, opt); }).join("");
    return '<div class="derm-panel" data-sono-panel="' + esc(o.key) + '"><div class="derm-grid">' + normalCard + cards + '</div></div>';
  }

  function render() {
    return '<div class="derm-tool" data-sono-tool>' +
      '<div class="derm-toolbar">' + ORGANE.map(function (o) {
        return '<button class="derm-tab" type="button" data-sono-tab="' + esc(o.key) + '">' + esc(o.titel) + '</button>';
      }).join("") + '</div>' +
      ORGANE.map(function (o) { return organPanelHtml(o); }).join("") +
      '</div>';
  }

  function wire(api) {
    var root = api.root;
    if (!root) return;
    var tool = root.querySelector("[data-sono-tool]");
    if (!tool || tool.getAttribute("data-sono-wired") === "1") return;
    tool.setAttribute("data-sono-wired", "1");
    var d = sonoState(api.state);

    function commit() {
      api.setState({ sonoAbdomen: d });
      paint();
    }

    root.querySelectorAll("[data-sono-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.tab = btn.getAttribute("data-sono-tab");
        commit();
      });
    });
    root.querySelectorAll("[data-sono-card]").forEach(function (card) {
      card.addEventListener("click", function (ev) {
        if (ev.target.closest("input") || ev.target.closest("textarea")) return;
        if (ev.target.closest("[data-sono-help]") || ev.target.closest(".derm-help-panel")) return;
        var organKey = card.getAttribute("data-sono-card");
        var id = card.getAttribute("data-id");
        d.organe[organKey] = d.organe[organKey] || {};
        var os = d.organe[organKey];
        if (!Array.isArray(os.auswahl)) os.auswahl = [];
        if (id === "__normal__") {
          os.auswahl = os.auswahl.indexOf("__normal__") !== -1 ? [] : ["__normal__"];
        } else {
          var idx = os.auswahl.indexOf(id);
          if (idx !== -1) {
            os.auswahl.splice(idx, 1);
          } else {
            var nIdx = os.auswahl.indexOf("__normal__");
            if (nIdx !== -1) os.auswahl.splice(nIdx, 1);
            os.auswahl.push(id);
          }
        }
        commit();
      });
    });
    root.querySelectorAll("[data-sono-help]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var panel = root.querySelector('[data-sono-help-panel="' + btn.getAttribute("data-sono-help") + '"]');
        if (panel) panel.classList.toggle("open");
      });
    });
    root.querySelectorAll("[data-sono-mess]").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var parts = inp.getAttribute("data-sono-mess").split("__");
        var organKey = parts[0], optId = parts[1];
        d.organe[organKey] = d.organe[organKey] || {};
        d.organe[organKey].messwerte = d.organe[organKey].messwerte || {};
        d.organe[organKey].messwerte[optId] = inp.value;
        commit();
      });
    });
    root.querySelectorAll("[data-sono-freitext]").forEach(function (ta) {
      ta.addEventListener("input", function () {
        var parts = ta.getAttribute("data-sono-freitext").split("__");
        var organKey = parts[0], optId = parts[1];
        d.organe[organKey] = d.organe[organKey] || {};
        d.organe[organKey].freitexte = d.organe[organKey].freitexte || {};
        d.organe[organKey].freitexte[optId] = ta.value;
        commit();
      });
    });

    paint();

    function paint() {
      root.querySelectorAll("[data-sono-tab]").forEach(function (btn) {
        var key = btn.getAttribute("data-sono-tab");
        var o = organById(key);
        btn.classList.toggle("sel", key === d.tab);
        btn.classList.toggle("done", !!(o && isOrganDone(d, o)));
      });
      root.querySelectorAll("[data-sono-panel]").forEach(function (panel) {
        panel.classList.toggle("sel", panel.getAttribute("data-sono-panel") === d.tab);
      });
      ORGANE.forEach(function (o) {
        var os = d.organe[o.key] || {};
        var auswahl = os.auswahl || [];
        root.querySelectorAll('[data-sono-card="' + o.key + '"]').forEach(function (card) {
          card.classList.toggle("sel", auswahl.indexOf(card.getAttribute("data-id")) !== -1);
        });
        (o.optionen || []).forEach(function (opt) {
          var key = o.key + "__" + opt.id;
          var isSel = auswahl.indexOf(opt.id) !== -1;
          var extra = root.querySelector('[data-sono-extra="' + key + '"]');
          if (extra) extra.style.display = isSel ? "" : "none";
          var inp = root.querySelector('[data-sono-mess="' + key + '"]');
          if (inp) {
            var val = (os.messwerte && os.messwerte[opt.id] != null) ? os.messwerte[opt.id] : "";
            if (inp.value !== String(val)) inp.value = val;
          }
          var ta = root.querySelector('[data-sono-freitext="' + key + '"]');
          if (ta) {
            var fv = (os.freitexte && os.freitexte[opt.id]) || "";
            if (ta.value !== fv) ta.value = fv;
          }
        });
      });
    }
  }

  function formatSatz(opt, val) {
    var satz = opt.beschreibung || opt.name;
    if (opt.messfeld) {
      var text = hasText(val) ? (val + (opt.messfeld.einheit ? " " + opt.messfeld.einheit : "")) : "(Maß nicht dokumentiert)";
      satz = satz.replace("{wert}", text);
    }
    return satz;
  }

  function aortaDurchmesser(d) {
    var os = d.organe.aorta;
    if (!os || (os.auswahl || []).indexOf("aneurysma") === -1) return NaN;
    return parseFloat(os.messwerte && os.messwerte.aneurysma);
  }

  function baustein(s) {
    var d = sonoState(s);
    var einschr = s.einschraenkungen || [];
    var zeilen = [];
    if (einschr.length) zeilen.push("Eingeschränkte Beurteilbarkeit durch " + einschr.join(", ") + ".");
    var ld = [];
    ORGANE.forEach(function (o) {
      var os = d.organe[o.key];
      var auswahl = (os && os.auswahl) || [];
      if (!auswahl.length) return;
      if (auswahl.indexOf("__normal__") !== -1) {
        zeilen.push(o.titel + ": " + o.normal);
        return;
      }
      var saetze = [];
      auswahl.forEach(function (id) {
        var opt = optionById(o, id);
        if (!opt) return;
        if (opt.freitext) {
          var txt = (os.freitexte && os.freitexte[opt.id]) || "";
          if (txt) saetze.push(txt);
          return;
        }
        var val = os.messwerte && os.messwerte[opt.id];
        saetze.push(formatSatz(opt, val));
        if (opt.icd && ld.indexOf(opt.icd) === -1) ld.push(opt.icd);
      });
      if (saetze.length) zeilen.push(o.titel + ": " + saetze.join(" "));
    });
    if (hasText(s.zusatz)) zeilen.push("Zusätzlich: " + s.zusatz);

    var th = "";
    var durchmesser = aortaDurchmesser(d);
    if (!isNaN(durchmesser) && durchmesser >= 5.5) {
      th = "Bei sonographischem V. a. rupturgefährdetes Bauchaortenaneurysma (≥ 5,5 cm) umgehende klinische Abklärung/Klinikeinweisung empfehlen.";
    }

    return {
      AN: "Abdominelle Sonographie, indikationsgerecht durchgeführt.",
      BE: "",
      SN: zeilen.join("\n"),
      TH: th,
      LD: ld.join("\n")
    };
  }

  function auswertung(s) {
    var d = sonoState(s);
    var meldungen = [];
    var redflag = false;

    var durchmesser = aortaDurchmesser(d);
    if (!isNaN(durchmesser) && durchmesser >= 5.5) {
      redflag = true;
      meldungen.push({ stil: "rot", titel: "V. a. rupturgefährdetes Bauchaortenaneurysma", text: "Durchmesser " + durchmesser + " cm (≥ 5,5 cm) - umgehende klinische Abklärung/Klinikeinweisung erwägen." });
    } else if (!isNaN(durchmesser) && durchmesser >= 3) {
      meldungen.push({ stil: "orange", titel: "Bauchaortenaneurysma", text: "Durchmesser " + durchmesser + " cm - Verlaufskontrolle nach Leitlinie einplanen." });
    }

    ORGANE.forEach(function (o) {
      var os = d.organe[o.key];
      var auswahl = (os && os.auswahl) || [];
      auswahl.forEach(function (id) {
        if (id === "__normal__") return;
        var opt = optionById(o, id);
        if (opt && opt.warn && !(o.key === "aorta" && opt.id === "aneurysma")) {
          meldungen.push({ stil: "orange", titel: opt.name + " (" + o.titel + ")", text: "Zeitnahe ärztliche Einordnung/weitere Abklärung empfohlen." });
        }
      });
    });

    return { redflag: redflag, bannerText: "Sonographischer Hinweis auf rupturgefährdetes Bauchaortenaneurysma - sofort ärztlich handeln.", meldungen: meldungen };
  }

  /* -------- Styles fuer Beispielbilder (einmalig injiziert) -------- */
  if (typeof document !== "undefined" && document.head && !document.getElementById("sono-img-styles")) {
    var st = document.createElement("style");
    st.id = "sono-img-styles";
    st.textContent =
      ".sono-figure{margin:0;padding:0}" +
      ".sono-img{display:block;width:100%;max-height:240px;object-fit:contain;background:#000;" +
      "border:1px solid var(--linie);border-radius:6px;cursor:zoom-in}" +
      ".sono-figcap{font-size:10px;line-height:1.35;color:#8a7d70;margin-top:4px;word-break:break-word}" +
      ".sono-figcap a{color:#8a7d70;text-decoration:underline}";
    document.head.appendChild(st);
  }

  PCM.registerSOP({
    id: "sono-abdomen",
    titel: "Sono Abdomen",
    untertitel: "Strukturierte Abdomensonographie: Organbefunde, Messwerte, SN-Dokumentation",
    icon: "🩻",
    farbe: "#025669",
    version: "1.0",
    stand: "04.07.2026",
    bereich: "Sonographie",
    kategorie: "Sonographie",
    delegationshinweis: "Das Modul unterstützt die strukturierte Dokumentation des Sonographiebefunds. Durchführung, Befundinterpretation und daraus abgeleitete Diagnosen/Procedere erfolgen ärztlich.",
    fussnote: 'Bildnachweis: Die sonographischen Referenzbilder stammen aus dem Sonographie-Atlas ' +
      '(<a href="https://sonographiebilder.de/sonographie-atlas" target="_blank" rel="noopener noreferrer">' +
      'sonographiebilder.de/sonographie-atlas</a>). Herzlichen Dank an das Albertinen Krankenhaus ' +
      '(Immanuel Albertinen Diakonie gGmbH, Hamburg) für die Bereitstellung. Nutzung ausschließlich ' +
      'unentgeltlich und nichtkommerziell; dieser Hinweis ist bei Weitergabe zu übernehmen.',
    initialState: {
      sonoAbdomen: { tab: "leber", organe: {} },
      einschraenkungen: [],
      zusatz: ""
    },
    schritte: [
      {
        nr: 1,
        titel: "Untersuchungsbedingungen",
        rolle: "Arzt",
        rolleStil: "blue",
        farbe: "#025669",
        offen: true,
        elemente: [
          { typ: "info", stil: "blau", titel: "Hinweis", text: "Für jedes Organ Normalbefund oder passende Pathologie anklicken. Messwerte (z. B. Zystengröße, Aortendurchmesser) werden bei Auswahl abgefragt. Zu vielen Befunden lässt sich über „▸ Beispielbild“ ein sonographisches Referenzbild (Quelle: Sonographie-Atlas, Immanuel Albertinen Diakonie) einblenden." },
          { typ: "checkliste", id: "einschraenkungen", stil: "gruen", items: ["Darmgasüberlagerung", "Adipositas", "Voroperation/Vernarbung", "Meteorismus", "Eingeschränkte Kooperationsfähigkeit"] }
        ]
      },
      {
        nr: 2,
        titel: "Organbefunde",
        rolle: "Arzt",
        rolleStil: "blue",
        farbe: "#025669",
        offen: true,
        elemente: [
          { typ: "sono", id: "sono-abdomen-organe", render: render, wire: wire }
        ]
      },
      {
        nr: 3,
        titel: "Zusätzliche Bemerkungen",
        rolle: "Arzt",
        rolleStil: "blue",
        farbe: "#025669",
        elemente: [
          { typ: "textarea", id: "zusatz", label: "Freitext (optional)", platzhalter: "weitere Auffälligkeiten...", hoehe: "70px" }
        ]
      }
    ],
    auswertung: auswertung,
    baustein: baustein
  });
})();
