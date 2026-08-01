(function () {
  "use strict";

  var ASSET = "sops/dermatoskopie-assets/";
  function img(n) { return ASSET + "derm-" + String(n).padStart(2, "0") + ".jpg"; }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function hasText(value) { return value != null && String(value).trim() !== ""; }

  var NON_MEL = [
    {
      id: "haemangiom", name: "Haemangiom",
      desc: "Rote bis roetlich-schwarze Lakunen, strukturlose Areale; auch weiss moeglich",
      hint: "Typische Merkmale: rote bis rot-schwarze Lakunen als scharf begrenzte Schollen, strukturlose rote oder blau-schwarze Areale, kein Pigmentnetz, keine atypischen Gefaesse.",
      images: [img(1), img(2), img(3)], captions: ["Dermoscopedia", "Dermoscopedia", "ISIC Archive"],
      recommendation: "Klinisch-dermatoskopisch vereinbar mit Haemangiom. Verlaufskontrolle nach klinischem Ermessen."
    },
    {
      id: "haemorrhagie", name: "Haemorrhagie",
      desc: "Scharf begrenzte homogene rote/schwarz-braune Flaeche, kein Pigmentnetz",
      hint: "Typische Merkmale: scharf begrenzte homogene rote oder schwarz-braune Flaeche, kein Pigmentnetz, haeufig traumatischer Blutungsartefakt; periphere Blutabbrueche moeglich.",
      images: [img(4), img(5), img(6)], captions: ["ISIC Archive", "ISIC Archive", "ISIC Archive"],
      recommendation: "Befund vereinbar mit Haemorrhagie/Einblutung. Klinische Verlaufskontrolle bzw. Trauma-Anamnese beachten."
    },
    {
      id: "solare-lentigo", name: "Solare Lentigo",
      desc: "Hellbraun, retikulaere/gebogene Linien, scharf begrenzt; braune Kreise",
      hint: "Typische Merkmale: hellbraun und eher homogen, Fingerprint-Muster mit feinen gebogenen Linien, scharfe Begrenzung, braune Kreise moeglich, kein atypisches Pigmentnetz.",
      images: [img(7), img(8), img(9), img(10)], captions: ["Dermoscopedia", "Dermoscopedia", "Dermoscopedia", "Dermoscopedia"],
      recommendation: "Befund vereinbar mit solarer Lentigo. Verlaufskontrolle nach klinischem Ermessen."
    },
    {
      id: "seborrhoische-keratose", name: "Seborrhoische Keratose",
      desc: "Pseudohornzysten, zerebriformes Muster, Haarnadelgefaesse",
      hint: "Typische Merkmale: milienaehnliche Pseudohornzysten, kammartige Oeffnungen, zerebriformes Furchenmuster, U-foermige Haarnadelgefaesse, scharf begrenzt und aufgeklebt wirkend.",
      images: [img(11), img(12), img(13), img(14)], captions: ["Dermoscopedia", "Dermoscopedia", "Dermoscopedia", "Dermoscopedia"],
      recommendation: "Befund vereinbar mit seborrhoischer Keratose. Keine sofortige Ueberweisung erforderlich, wenn klinisch eindeutig."
    },
    {
      id: "lichen-planus-keratose", name: "Lichen-Planus-Keratose",
      desc: "Grau-blaue Schollen, retikulaere Linien, regressives Muster",
      hint: "Typische Merkmale: grau-blaue Schollen durch Melanophagen, retikulaere Linien, haeufig regressiv veraenderte solare Lentigo, Pfeffer-und-Salz-Granularitaet moeglich.",
      images: [img(15), img(16)], captions: ["Dermoscopedia", "Dermoscopedia"],
      recommendation: "Befund vereinbar mit Lichen-Planus-Keratose. Verlaufskontrolle bzw. aerztliche Einordnung bei Unsicherheit."
    },
    {
      id: "dermatofibrom", name: "Dermatofibrom",
      desc: "Weisses strukturloses Zentrum, peripheres Retikulum, verzweigte Randlinien",
      hint: "Typische Merkmale: zentrales weissliches strukturloses Areal als Fibrosezeichen, peripheres Pigmentretikulum, dicke verzweigte radiale Linien am Rand, klinisch oft Dimple sign.",
      images: [img(17), img(18), img(19)], captions: ["Dermoscopedia", "Dermoscopedia", "ISIC Archive"],
      recommendation: "Befund vereinbar mit Dermatofibrom. Verlaufskontrolle nach klinischem Ermessen."
    },
    {
      id: "basaliom", name: "Basaliom",
      desc: "Blaue Schollen, arborisierende Gefaesse, radiale Linien; kein Pigmentnetz",
      hint: "Typische Merkmale: grosse ovale blau-graue Schollen, arborisierende Teleangiektasien, Speichenrad-Muster, fehlende Netzstruktur, Ulzerationen moeglich. Dermatologische Abklaerung empfohlen.",
      images: [img(20), img(21), img(22), img(23)], captions: ["Dermoscopedia", "ISIC Archive", "Dermoscopedia", "Dermoscopedia"],
      warn: true,
      recommendation: "Befund vereinbar mit Basaliom. Dermatologische Vorstellung zur histologischen Sicherung empfohlen."
    },
    {
      id: "aktinische-keratose", name: "Aktinische Keratose",
      desc: "Erdbeer-Muster, weisse Kreise, Rosettes, Erythem und Schuppung",
      hint: "Typische Merkmale: rotes Pseudonetz mit weissen Kreisen um Follikeloeffnungen, Schuppung, Rosettes bei polarisiertem Licht, erythematoser Hintergrund.",
      images: [img(24), img(25), img(26)], captions: ["Dermoscopedia", "Dermoscopedia", "Dermoscopedia"],
      warn: true,
      recommendation: "Befund vereinbar mit aktinischer Keratose. Aerztliche Therapieplanung bzw. dermatologische Mitbeurteilung nach Praxisstandard."
    }
  ];

  var MEL = [
    {
      id: "reednaevus", name: "Reednaevus", risk: "warn",
      desc: "Braune Schollen, peripher radiaere Linien/Pseudopodien, zentral strukturlos",
      hint: "Typische Merkmale: peripher radiaer angeordnete Linien oder Pseudopodien, zentral strukturlose Areale, dunkelbraun bis schwarz. Dermatoskopisch nicht sicher von Melanom abgrenzbar.",
      images: [img(27), img(28)], captions: ["ISIC Archive", "ISIC Archive"],
      recommendation: "Dermatologische Vorstellung empfohlen, da Reednaevus dermatoskopisch melanomaehnlich wirken kann."
    },
    {
      id: "spitznaevus", name: "Spitznaevus", risk: "warn",
      desc: "Schollen, strukturlose Areale, zentrale dicke retikulaere Linien",
      hint: "Typische Merkmale: Schollen und strukturlose Areale, teils Starburst-Muster mit regelmaessigen peripheren Streaks. Bei Erwachsenen dermatologische Abklaerung/Exzision empfohlen.",
      images: [img(29), img(30), img(31)], captions: ["ISIC Archive", "ISIC Archive", "ISIC Archive"],
      recommendation: "Dermatologische Abklaerung empfohlen, insbesondere bei Erwachsenen."
    },
    {
      id: "kongenital-retikulaer", name: "Kongenitaler Naevus, retikulaeres Muster", risk: "benign",
      desc: "Retikulaere und verzweigte Linien, hautfarben bis dunkelbraun, oft Haare",
      hint: "Typische Merkmale: retikulaere und verzweigte Linien, hautfarben bis dunkelbraun, haeufig Haare und weisse Punkte. Klassisch stabiles Muster eines kongenitalen melanozytaeren Naevus.",
      images: [img(32), img(33)], captions: ["Dermoscopedia", "Dermoscopedia"],
      recommendation: "Eindeutig benigne melanozytaere Laesion. Verlaufskontrolle nach klinischem Ermessen."
    },
    {
      id: "kongenital-schollen", name: "Kongenitaler Naevus, Schollenmuster", risk: "benign",
      desc: "Ausschliesslich Schollen, teils Punkte; braun/grau/schwarz/orange",
      hint: "Typische Merkmale: grosse polygonale Schollen, teils Punkte, Haare und weisse Punkte; stabiles seit Geburt bestehendes Muster.",
      images: [img(34), img(35)], captions: ["Dermoscopedia", "Dermoscopedia"],
      recommendation: "Eindeutig benigne melanozytaere Laesion. Keine sofortige Intervention erforderlich."
    },
    {
      id: "unna-naevus", name: "Papillomatoeser kongenitaler Naevus (Unna)", risk: "benign",
      desc: "Polygonale Schollen, dicke gebogene Gefaesse, Haare",
      hint: "Typische Merkmale: polygonale Schollen, orange/hautfarben bis braun, dicke gebogene Gefaesse innerhalb der Schollen, haeufig Haare und papillomatoeses Erscheinungsbild.",
      images: [img(36), img(37)], captions: ["ISIC Archive", "ISIC Archive"],
      recommendation: "Eindeutig benigne melanozytaere Laesion. Verlaufskontrolle nach klinischem Ermessen."
    },
    {
      id: "rezidiv-naevus", name: "Rezidivierender Naevus", risk: "warn",
      desc: "Radiaere Linien, strukturlose Areale, Pseudopodien/Schollen in Narbe",
      hint: "Typische Merkmale: radiaere Linien, strukturlose Areale, Pseudopodien und Schollen im Narbenbereich nach vorausgegangener Exzision. Von Melanomrezidiv nicht sicher abgrenzbar.",
      images: [img(38), img(39)], captions: ["Dermoscopedia", "Dermoscopedia"],
      recommendation: "Dermatologische Abklaerung empfohlen, insbesondere bei Wachstum oder Pigment ausserhalb der Narbe."
    },
    {
      id: "blauer-naevus", name: "Blauer Naevus", risk: "warn",
      desc: "Strukturlos, blau bis blauschwarz, randstaendig auch braun",
      hint: "Typische Merkmale: strukturlos blau bis blauschwarz, randstaendig auch braun, keine Gefaesse sichtbar. Bei Wachstum oder Unsicherheit Abklaerung wegen DD nodulaeres Melanom.",
      images: [img(40)], captions: ["Dermoscopedia"],
      recommendation: "Dermatologische Abklaerung empfohlen, wenn neu, wachsend oder nicht eindeutig stabil."
    }
  ];

  var COLORS = [
    ["weiss", "Weiss"], ["hellbraun", "Hellbraun"], ["dunkelbraun", "Dunkelbraun"],
    ["rot", "Rot"], ["blaugrau", "Blaugrau"], ["schwarz", "Schwarz"]
  ];
  var STRUCTURES = [
    ["netze", "Netze / retikulaere Linien"],
    ["verzweigte-streifen", "Verzweigte Streifen"],
    ["schollen", "Schollen"],
    ["punkte", "Punkte"],
    ["strukturlos", "> 10 Prozent strukturlose Areale"]
  ];

  var ICD_BY_PATTERN = {
    "haemangiom": "D18.0G",
    "haemorrhagie": "R23.3G",
    "solare-lentigo": "L81.4G",
    "seborrhoische-keratose": "L82G",
    "lichen-planus-keratose": "L98.9G",
    "dermatofibrom": "D23.9G",
    "basaliom": "C44.9V",
    "aktinische-keratose": "L57.0V",
    "reednaevus": "D22.9V",
    "spitznaevus": "D22.9V",
    "kongenital-retikulaer": "D22.9G",
    "kongenital-schollen": "D22.9G",
    "unna-naevus": "D22.9G",
    "rezidiv-naevus": "D22.9V",
    "blauer-naevus": "D22.9V"
  };

  function patternById(id) {
    return NON_MEL.concat(MEL).filter(function (p) { return p.id === id; })[0] || null;
  }

  function dermState(st) {
    st.derm = st.derm || {};
    var d = st.derm;
    if (!d.tab) d.tab = "lokalisation";
    if (!Array.isArray(d.colors)) d.colors = [];
    if (!Array.isArray(d.structures)) d.structures = [];
    if (d.border == null) d.border = 0;
    return d;
  }

  function locationText(d) {
    var out = [];
    if (d.zone) out.push(d.zone);
    if (hasText(d.precision)) out.push(String(d.precision).trim());
    if (hasText(d.length) || hasText(d.width)) out.push((d.length || "-") + " x " + (d.width || "-") + " mm");
    return out.length ? out.join(", ") : "Lokalisation/Groesse nicht angegeben";
  }

  function abcdScore(d) {
    if (d.asym == null) return null;
    var a = Number(d.asym) || 0;
    var b = Number(d.border) || 0;
    var c = (d.colors || []).length;
    var ds = (d.structures || []).length;
    return {
      value: a * 1.3 + b * 0.1 + c * 0.5 + ds * 0.5,
      a: a, b: b, c: c, d: ds
    };
  }

  function interpretation(score) {
    if (!score) return { cls: "", text: "ABCD noch nicht vollstaendig" };
    if (score.value < 4.75) return { cls: "green", text: "Benigne (DPW < 4,75)" };
    if (score.value <= 5.45) return { cls: "orange", text: "Grauzone (4,75-5,45)" };
    return { cls: "red", text: "V.a. Melanom (DPW > 5,45)" };
  }

  function result(d) {
    var p, s, i;
    if (d.nonMel && d.nonMel !== "keine") {
      p = patternById(d.nonMel);
      return { mode: "nonmel", pattern: p, level: p && p.warn ? "orange" : "green", title: p ? p.name : "Erstcheck", recommendation: p ? p.recommendation : "" };
    }
    if (d.mel && d.mel !== "keine") {
      p = patternById(d.mel);
      return { mode: "mel", pattern: p, level: p && p.risk === "warn" ? "orange" : "green", title: p ? p.name : "Melanozytaeres Muster", recommendation: p ? p.recommendation : "" };
    }
    s = abcdScore(d);
    i = interpretation(s);
    return { mode: "abcd", score: s, level: i.cls || "blau", title: s ? ("DPW " + s.value.toFixed(2) + " - " + i.text) : "ABCD-Regel offen", recommendation: abcdRecommendation(s), interp: i };
  }

  function abcdRecommendation(s) {
    if (!s) return "ABCD-Dokumentation noch nicht vollstaendig.";
    if (s.value < 4.75) return "Verlaufskontrolle nach klinischem Ermessen. Keine dringende dermatologische Ueberweisung aus ABCD-Score ableitbar.";
    if (s.value <= 5.45) return "Grauzone: zusaetzliche Kriterien und Verlauf pruefen. Dermatologische Vorstellung empfohlen.";
    return "V.a. malignes Melanom: dringende dermatologische Vorstellung zur histologischen Abklaerung.";
  }

  function cardHtml(p, group) {
    var cls = group === "mel" ? (p.risk === "warn" ? " warn" : " benign") : (p.warn ? " warn" : "");
    return '<div class="derm-card' + cls + '" data-derm-card="' + esc(group) + '" data-id="' + esc(p.id) + '">' +
      '<div class="derm-card-top"><div class="derm-card-title">' + esc(p.name) + '</div><div class="derm-card-desc">' + esc(p.desc) + '</div></div>' +
      '<button class="derm-help" type="button" data-derm-help="' + esc(group + "-" + p.id) + '">Beispielbilder und Merkmale</button>' +
      '<div class="derm-help-panel" data-derm-help-panel="' + esc(group + "-" + p.id) + '">' +
      '<div class="derm-hint">' + esc(p.hint) + '</div><div class="derm-imgs">' +
      p.images.map(function (src, idx) {
        return '<figure class="derm-fig"><img src="' + esc(src) + '" alt="' + esc(p.name) + '" data-derm-img="' + esc(src) + '" data-caption="' + esc((p.captions && p.captions[idx]) || "") + '"><figcaption>' + esc((p.captions && p.captions[idx]) || "") + '</figcaption></figure>';
      }).join("") + '</div></div></div>';
  }

  function bodyMapHtml(side) {
    var dorsal = side === "dorsal";
    var zones = dorsal ? [
      ["Kopfhaut dorsal", "ellipse", "44", "8", "12", "9"],
      ["Nacken", "rect", "37", "26", "14", "5"],
      ["Ruecken oben", "rect", "28", "31", "32", "20"],
      ["Ruecken unten / lumbal", "rect", "28", "51", "32", "20"],
      ["Arm links dorsal", "rect", "9", "28", "18", "40"],
      ["Arm rechts dorsal", "rect", "61", "28", "18", "40"],
      ["Oberschenkel links dorsal", "rect", "28", "71", "14", "54"],
      ["Oberschenkel rechts dorsal", "rect", "46", "71", "14", "54"],
      ["Unterschenkel links dorsal", "rect", "26", "125", "16", "44"],
      ["Unterschenkel rechts dorsal", "rect", "46", "125", "16", "44"]
    ] : [
      ["Kopf / Gesicht", "ellipse", "44", "8", "12", "9"],
      ["Hals", "rect", "37", "26", "14", "5"],
      ["Thorax ventral", "rect", "28", "31", "32", "20"],
      ["Abdomen", "rect", "28", "51", "32", "20"],
      ["Arm links ventral", "rect", "9", "28", "18", "40"],
      ["Arm rechts ventral", "rect", "61", "28", "18", "40"],
      ["Oberschenkel links", "rect", "28", "71", "14", "54"],
      ["Oberschenkel rechts", "rect", "46", "71", "14", "54"],
      ["Unterschenkel links", "rect", "26", "125", "16", "44"],
      ["Unterschenkel rechts", "rect", "46", "125", "16", "44"]
    ];
    var overlays = zones.map(function (z) {
      if (z[1] === "ellipse") return '<ellipse class="derm-zone" data-zone="' + esc(z[0]) + '" cx="' + z[2] + '" cy="' + z[3] + '" rx="' + z[4] + '" ry="' + z[5] + '" fill="transparent"/>';
      return '<rect class="derm-zone" data-zone="' + esc(z[0]) + '" x="' + z[2] + '" y="' + z[3] + '" width="' + z[4] + '" height="' + z[5] + '" rx="2" fill="transparent"/>';
    }).join("");
    return '<div class="derm-svgbox"><svg width="88" height="198" viewBox="0 0 88 198">' +
      '<ellipse cx="44" cy="14" rx="12" ry="13" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="28" y="27" width="32" height="44" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="9" y="28" width="18" height="40" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="61" y="28" width="18" height="40" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="28" y="71" width="14" height="54" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="46" y="71" width="14" height="54" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="26" y="125" width="16" height="44" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      '<rect x="46" y="125" width="16" height="44" rx="4" fill="#e8d5c0" stroke="#b0a090" stroke-width=".8"/>' +
      overlays + '</svg><div>' + (dorsal ? "Rueckseite" : "Vorderseite") + '</div></div>';
  }

  function choiceHtml(list, selected, kind) {
    return list.map(function (it) {
      return '<div class="derm-opt' + (selected && selected.indexOf(it[0]) !== -1 ? " sel" : "") + '" data-derm-toggle="' + esc(kind) + '" data-id="' + esc(it[0]) + '"><div class="derm-square"></div>' + esc(it[1]) + '</div>';
    }).join("");
  }

  function render(el) {
    var section = (el && (el.ansicht || el.panel)) || "lokalisation";
    return '<div class="derm-tool" data-derm-tool data-derm-section="' + esc(section) + '">' +
      panelHtml(section) +
      ((section === "nichtmel" || section === "mel") ? dermModalHtml() : "") +
      '</div>';
  }

  function panelHtml(section) {
    if (section === "lokalisation") return '<div class="derm-panel sel" data-derm-panel="lokalisation">' +
      '<div class="derm-location"><div class="derm-bodymaps">' + bodyMapHtml("ventral") + bodyMapHtml("dorsal") + '</div>' +
      '<div><div class="derm-zone-label" data-derm-zone-label>Bitte Region anklicken</div>' +
      '<div class="form-row" style="display:block"><label>Praezisierung</label><input type="text" data-derm-field="precision" placeholder="z. B. paravertebral rechts, 2 cm lateral" style="width:100%"></div>' +
      '<div class="derm-form-grid"><div class="form-row" style="display:block"><label>Laenge (mm)</label><input type="number" data-derm-field="length" min="1" placeholder="8" style="width:100%"></div>' +
      '<div class="form-row" style="display:block"><label>Breite (mm)</label><input type="number" data-derm-field="width" min="1" placeholder="6" style="width:100%"></div></div>' +
      '<div class="derm-actions"><button class="prim-btn" data-derm-go="nichtmel" type="button">Weiter</button></div></div></div></div>';

    if (section === "nichtmel") return '<div class="derm-panel sel" data-derm-panel="nichtmel"><div class="box bx-blue"><div class="lbl">Erstcheck</div>Passt die Laesion zu einem typischen nicht-melanozytaeren Muster? Bei keiner klaren Zuordnung weiter zum melanozytaeren Erstcheck.</div><div class="derm-grid">' +
      NON_MEL.map(function (p) { return cardHtml(p, "nonmel"); }).join("") +
      '<div class="derm-card" data-derm-card="nonmel" data-id="keine" style="grid-column:1/-1"><div class="derm-card-top"><div class="derm-card-title">Keine der vorgenannten</div><div class="derm-card-desc">Weiter mit melanozytaerem Erstcheck.</div></div></div></div><div class="derm-actions"><button class="derm-secondary" data-derm-go="lokalisation" type="button">Zurueck</button><button class="prim-btn" data-derm-next-pattern="nonmel" type="button">Weiter</button></div></div>';

    if (section === "mel") return '<div class="derm-panel sel" data-derm-panel="mel"><div class="box bx-blue"><div class="lbl">Melanozytaere Muster</div>Passt die Laesion zu einem dieser Muster? Bei keiner klaren Zuordnung ABCD-Regel anwenden.</div><div class="derm-grid">' +
      MEL.map(function (p) { return cardHtml(p, "mel"); }).join("") +
      '<div class="derm-card" data-derm-card="mel" data-id="keine" style="grid-column:1/-1"><div class="derm-card-top"><div class="derm-card-title">Keine der vorgenannten</div><div class="derm-card-desc">Weiter mit ABCD-Regel nach Stolz.</div></div></div></div><div class="derm-actions"><button class="derm-secondary" data-derm-go="nichtmel" type="button">Zurueck</button><button class="prim-btn" data-derm-next-pattern="mel" type="button">Weiter</button></div></div>';

    if (section === "abcd") return abcdHtml();

    if (section === "ergebnis") return '<div class="derm-panel sel" data-derm-panel="ergebnis"><div data-derm-result></div><div class="derm-actions"><button class="derm-secondary" data-derm-go="abcd" type="button">ABCD bearbeiten</button><button class="prim-btn" data-derm-scroll-pvs type="button">PVS-Dokumentation anzeigen</button></div></div>';

    return '<div class="box bx-orange"><div class="lbl">Dermatoskopie</div>Unbekannte Ansicht: ' + esc(section) + '</div>';
  }

  function dermModalHtml() {
    return '<div class="derm-modal" data-derm-modal><div class="derm-modal-inner"><button class="derm-modal-close" data-derm-modal-close type="button">x</button><img data-derm-modal-img alt=""><div class="derm-modal-caption" data-derm-modal-caption></div></div></div>';
  }

  function abcdHtml() {
    return '<div class="derm-panel sel" data-derm-panel="abcd">' +
      '<div class="derm-abcd-row"><div class="derm-letter">A</div><div><strong>Asymmetrie</strong><div class="derm-small">Laesion in zwei Achsen teilen; Kontur, Farbe und Struktur der Haelften vergleichen.</div><div class="derm-choice">' +
      [[0, "Symmetrisch in beiden Achsen"], [1, "Symmetrisch in einer Achse"], [2, "Keine Symmetrie"]].map(function (o) {
        return '<div class="derm-opt" data-derm-asym="' + o[0] + '"><div class="derm-dot"></div>' + esc(o[1]) + '</div>';
      }).join("") + '</div></div><div class="derm-score" data-derm-score-a>-</div></div>' +
      '<div class="derm-abcd-row"><div class="derm-letter">B</div><div><strong>Begrenzung</strong><div class="derm-small">Abrupter Musterabbruch in 0 bis 8 Segmenten.</div><input class="derm-slider" data-derm-border type="range" min="0" max="8" value="0" step="1"><div class="derm-small"><span data-derm-border-label>0 Segmente</span></div></div><div class="derm-score" data-derm-score-b>0.0</div></div>' +
      '<div class="derm-abcd-row"><div class="derm-letter">C</div><div><strong>Colorit</strong><div class="derm-small">Alle sichtbaren Farben ankreuzen.</div><div class="derm-choice">' + choiceHtml(COLORS, [], "colors") + '</div></div><div class="derm-score" data-derm-score-c>0.0</div></div>' +
      '<div class="derm-abcd-row"><div class="derm-letter">D</div><div><strong>Differenzialstruktur</strong><div class="derm-small">Alle erkennbaren Strukturtypen ankreuzen.</div><div class="derm-choice">' + choiceHtml(STRUCTURES, [], "structures") + '</div></div><div class="derm-score" data-derm-score-d>0.0</div></div>' +
      '<div class="derm-scorebox"><div><div class="derm-small" style="color:rgba(255,255,255,.75)">DPW = A x 1,3 + B x 0,1 + C x 0,5 + D x 0,5</div><strong data-derm-dpw>-</strong></div><div class="derm-pill" data-derm-interpretation>Asymmetrie auswaehlen</div></div>' +
      '<div class="derm-actions"><button class="derm-secondary" data-derm-go="mel" type="button">Zurueck</button><button class="prim-btn" data-derm-go="ergebnis" type="button">Ergebnis</button></div></div>';
  }

  function wire(api) {
    var root = api.root;
    if (!root) return;
    var tools = root.querySelectorAll("[data-derm-tool]");
    if (!tools.length || root.querySelector('[data-derm-tool][data-derm-wired="1"]')) return;
    tools.forEach(function (tool) { tool.setAttribute("data-derm-wired", "1"); });
    var d = dermState(api.state);

    function commit(fn) {
      fn(d);
      api.setState({ derm: d });
      paint();
    }
    function go(tab) {
      d.tab = tab;
      api.setState({ derm: d });
      paint();
      scrollToSection(tab);
    }
    function scrollToSection(tab) {
      var tool = root.querySelector('[data-derm-section="' + tab + '"]');
      if (!tool) return;
      var step = tool.closest(".step");
      if (step) {
        var body = step.querySelector(".step-body");
        var chev = step.querySelector(".chev");
        if (body) body.classList.add("open");
        if (chev) chev.classList.add("open");
      }
      tool.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    root.querySelectorAll("[data-derm-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () { go(btn.getAttribute("data-derm-tab")); });
    });
    root.querySelectorAll("[data-derm-go]").forEach(function (btn) {
      btn.addEventListener("click", function () { go(btn.getAttribute("data-derm-go")); });
    });
    root.querySelectorAll("[data-zone]").forEach(function (zone) {
      zone.addEventListener("click", function () { commit(function () { d.zone = zone.getAttribute("data-zone"); }); });
    });
    root.querySelectorAll("[data-derm-field]").forEach(function (field) {
      field.addEventListener("input", function () {
        var key = field.getAttribute("data-derm-field");
        commit(function () { d[key] = field.value; });
      });
    });
    root.querySelectorAll("[data-derm-card]").forEach(function (card) {
      card.addEventListener("click", function (ev) {
        if (ev.target.closest(".derm-help-panel") || ev.target.closest(".derm-help") || ev.target.tagName === "IMG") return;
        var group = card.getAttribute("data-derm-card");
        var id = card.getAttribute("data-id");
        commit(function () { if (group === "nonmel") d.nonMel = id; else d.mel = id; });
      });
    });
    root.querySelectorAll("[data-derm-help]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var panel = root.querySelector('[data-derm-help-panel="' + btn.getAttribute("data-derm-help") + '"]');
        if (panel) panel.classList.toggle("open");
      });
    });
    root.querySelectorAll("[data-derm-next-pattern]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = btn.getAttribute("data-derm-next-pattern");
        if (group === "nonmel") go(d.nonMel && d.nonMel !== "keine" ? "ergebnis" : "mel");
        else go(d.mel && d.mel !== "keine" ? "ergebnis" : "abcd");
      });
    });
    root.querySelectorAll("[data-derm-asym]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var val = Number(opt.getAttribute("data-derm-asym"));
        commit(function () { d.asym = d.asym === val ? null : val; });
      });
    });
    var borderInput = root.querySelector("[data-derm-border]");
    if (borderInput) borderInput.addEventListener("input", function (ev) {
      commit(function () { d.border = Number(ev.target.value) || 0; });
    });
    root.querySelectorAll("[data-derm-toggle]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var key = opt.getAttribute("data-derm-toggle");
        var id = opt.getAttribute("data-id");
        commit(function () {
          var list = d[key] || [];
          var idx = list.indexOf(id);
          if (idx >= 0) list.splice(idx, 1); else list.push(id);
          d[key] = list;
        });
      });
    });
    root.querySelectorAll("[data-derm-img]").forEach(function (image) {
      image.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var tool = image.closest("[data-derm-tool]");
        var modal = (tool && tool.querySelector("[data-derm-modal]")) || root.querySelector("[data-derm-modal]");
        if (!modal) return;
        modal.querySelector("[data-derm-modal-img]").src = image.getAttribute("data-derm-img");
        modal.querySelector("[data-derm-modal-caption]").textContent = image.getAttribute("data-caption") || "";
        modal.classList.add("open");
      });
    });
    root.querySelectorAll("[data-derm-modal]").forEach(function (modal) {
      modal.addEventListener("click", function (ev) {
        if (ev.target === modal) modal.classList.remove("open");
      });
    });
    root.querySelectorAll("[data-derm-modal-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var modal = btn.closest("[data-derm-modal]");
        if (modal) modal.classList.remove("open");
      });
    });
    var pvsBtn = root.querySelector("[data-derm-scroll-pvs]");
    if (pvsBtn) pvsBtn.addEventListener("click", function () {
      var out = document.getElementById("pcm-out");
      if (out) out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    paint();

    function paint() {
      var hasTabs = !!root.querySelector("[data-derm-tab]");
      if (hasTabs) {
        root.querySelectorAll("[data-derm-tab]").forEach(function (btn) {
          var tab = btn.getAttribute("data-derm-tab");
          btn.classList.toggle("sel", tab === d.tab);
          btn.classList.toggle("done", isDone(tab, d));
        });
        root.querySelectorAll("[data-derm-panel]").forEach(function (panel) {
          panel.classList.toggle("sel", panel.getAttribute("data-derm-panel") === d.tab);
        });
      }
      var zoneLabel = root.querySelector("[data-derm-zone-label]");
      if (zoneLabel) zoneLabel.textContent = d.zone ? "Lokalisation: " + d.zone : "Bitte Region anklicken";
      root.querySelectorAll("[data-zone]").forEach(function (z) { z.classList.toggle("sel", z.getAttribute("data-zone") === d.zone); });
      root.querySelectorAll("[data-derm-field]").forEach(function (f) {
        var key = f.getAttribute("data-derm-field");
        if (f.value !== String(d[key] || "")) f.value = d[key] || "";
      });
      root.querySelectorAll('[data-derm-card="nonmel"]').forEach(function (c) { c.classList.toggle("sel", c.getAttribute("data-id") === d.nonMel); });
      root.querySelectorAll('[data-derm-card="mel"]').forEach(function (c) { c.classList.toggle("sel", c.getAttribute("data-id") === d.mel); });
      root.querySelectorAll("[data-derm-asym]").forEach(function (o) { o.classList.toggle("sel", Number(o.getAttribute("data-derm-asym")) === d.asym); });
      if (root.querySelector("[data-derm-border]")) root.querySelector("[data-derm-border]").value = d.border || 0;
      if (root.querySelector("[data-derm-border-label]")) root.querySelector("[data-derm-border-label]").textContent = (d.border || 0) + " Segmente";
      root.querySelectorAll("[data-derm-toggle]").forEach(function (o) {
        var key = o.getAttribute("data-derm-toggle");
        o.classList.toggle("sel", (d[key] || []).indexOf(o.getAttribute("data-id")) !== -1);
      });
      paintScore();
      paintResult();
    }

    function paintScore() {
      var s = abcdScore(d);
      if (!root.querySelector("[data-derm-dpw]")) return;
      root.querySelector("[data-derm-score-a]").textContent = d.asym == null ? "-" : (d.asym * 1.3).toFixed(2);
      root.querySelector("[data-derm-score-b]").textContent = ((d.border || 0) * 0.1).toFixed(1);
      root.querySelector("[data-derm-score-c]").textContent = ((d.colors || []).length * 0.5).toFixed(1);
      root.querySelector("[data-derm-score-d]").textContent = ((d.structures || []).length * 0.5).toFixed(1);
      root.querySelector("[data-derm-dpw]").textContent = s ? s.value.toFixed(2) : "-";
      var ip = interpretation(s);
      var pill = root.querySelector("[data-derm-interpretation]");
      pill.className = "derm-pill" + (ip.cls ? " " + ip.cls : "");
      pill.textContent = ip.text;
    }

    function paintResult() {
      if (!root.querySelector("[data-derm-result]")) return;
      var r = result(d);
      var cls = r.level === "red" ? "bx-red" : r.level === "orange" ? "bx-orange" : r.level === "green" ? "bx-green" : "bx-blue";
      var detail = "";
      if (r.mode === "abcd" && r.score) {
        detail = "Asymmetrie: " + r.score.a + "; Begrenzung: " + r.score.b + "/8 Segmente; Colorit: " + labelList(COLORS, d.colors) + "; Strukturen: " + labelList(STRUCTURES, d.structures) + ".";
      } else if (r.pattern) {
        detail = r.pattern.hint;
      }
      root.querySelector("[data-derm-result]").innerHTML =
        '<div class="box ' + cls + '"><div class="lbl">Ergebnis</div><strong>' + esc(r.title) + '</strong><br>' +
        esc(locationText(d)) + '<br>' + esc(detail) + '</div>' +
        '<div class="box bx-blue"><div class="lbl">Procedere</div>' + esc(r.recommendation) + '</div>';
    }
  }

  function isDone(tab, d) {
    if (tab === "lokalisation") return !!d.zone || hasText(d.precision) || hasText(d.length) || hasText(d.width);
    if (tab === "nichtmel") return !!d.nonMel;
    if (tab === "mel") return !!d.mel || (d.nonMel && d.nonMel !== "keine");
    if (tab === "abcd") return !!abcdScore(d) || (d.nonMel && d.nonMel !== "keine") || (d.mel && d.mel !== "keine");
    if (tab === "ergebnis") return !!d.nonMel || !!d.mel || !!abcdScore(d);
    return false;
  }

  function labelList(source, selected) {
    selected = selected || [];
    var labels = selected.map(function (id) {
      var row = source.filter(function (x) { return x[0] === id; })[0];
      return row ? row[1] : id;
    });
    return labels.length ? labels.join(", ") : "keine";
  }

  function baustein(s) {
    var d = dermState(s);
    var r = result(d);
    var AN = "Dermatoskopische hausarztliche Hautbefund-Dokumentation. Lokalisation/Groesse: " + locationText(d) + ".";
    var BE = "";
    if (r.mode === "nonmel" && r.pattern) {
      BE = "Erstcheck nicht-melanozytaerer Laesionen: Befund vereinbar mit " + r.pattern.name + ". " + r.pattern.desc + ".";
    } else if (r.mode === "mel" && r.pattern) {
      BE = "Erstcheck melanozytaerer Laesionen: Befund vereinbar mit " + r.pattern.name + ". " + r.pattern.desc + ".";
    } else if (r.score) {
      BE = "Keine eindeutige Zuordnung im Erstcheck; ABCD-Regel nach Stolz angewendet. DPW-Score " + r.score.value.toFixed(2) + " (" + interpretation(r.score).text + "). Asymmetrie " + r.score.a + ", Begrenzung " + r.score.b + "/8 Segmente, Colorit " + labelList(COLORS, d.colors) + ", Differenzialstrukturen " + labelList(STRUCTURES, d.structures) + ".";
    } else {
      BE = "Dermatoskopische Beurteilung begonnen, noch keine abschliessende Einordnung dokumentiert.";
    }
    var TH = r.recommendation || "";
    var LD = "";
    if (d.nonMel && d.nonMel !== "keine") LD = ICD_BY_PATTERN[d.nonMel] || "";
    else if (d.mel && d.mel !== "keine") LD = ICD_BY_PATTERN[d.mel] || "";
    else if (r.score && r.score.value > 5.45) LD = "D48.5V";
    return { AN: AN, BE: BE, TH: TH, LD: LD };
  }

  function auswertung(s) {
    var d = dermState(s);
    var r = result(d);
    var meldungen = [];
    var redflag = false;
    if (r.mode === "abcd" && r.score) {
      if (r.score.value > 5.45) {
        redflag = true;
        meldungen.push({ stil: "rot", titel: "Melanomverdacht", text: "DPW > 5,45: dringende dermatologische Abklaerung einplanen." });
      } else if (r.score.value >= 4.75) {
        meldungen.push({ stil: "orange", titel: "ABCD-Grauzone", text: "DPW 4,75-5,45: zusaetzliche Kriterien und Verlauf pruefen; Dermatologie empfohlen." });
      }
    }
    if (d.nonMel === "basaliom") meldungen.push({ stil: "orange", titel: "Basaliom-Muster", text: "Histologische Sicherung/dermatologische Vorstellung empfohlen." });
    if (d.mel && d.mel !== "keine") {
      var p = patternById(d.mel);
      if (p && p.risk === "warn") meldungen.push({ stil: "orange", titel: p.name, text: "Melanozytaeres Warnmuster: dermatologische Abklaerung empfohlen." });
    }
    return { redflag: redflag, bannerText: "Dermatoskopie mit Melanomverdacht: zeitnah aerztlich/dermatologisch priorisieren.", meldungen: meldungen };
  }

  PCM.registerSOP({
    id: "dermatoskopie",
    titel: "Dermatoskopie",
    untertitel: "Hautbefund: Lokalisation, Muster-Erstcheck, ABCD-Regel und PVS-Dokumentation",
    icon: "DERM",
    farbe: "#6C3F2A",
    version: "1.0",
    stand: "14.06.2026",
    bereich: "Dermatologie",
    kategorie: "Dermatoskopie",
    leitlinie: "Dermatoskopisches Grundlagenwissen; ABCD-Regel nach Stolz 1994",
    delegationshinweis: "Das Modul unterstuetzt die strukturierte Dokumentation. Diagnose, Therapie, Exzision, Ueberweisung und Verlaufsvorgaben erfolgen aerztlich.",
    initialState: {
      derm: {
        tab: "lokalisation",
        zone: "",
        precision: "",
        length: "",
        width: "",
        nonMel: null,
        mel: null,
        asym: null,
        border: 0,
        colors: [],
        structures: []
      }
    },
    schritte: [
      {
        nr: 1,
        titel: "Lokalisation und Groesse",
        rolle: "Arzt/PCM",
        rolleStil: "blue",
        farbe: "#6C3F2A",
        offen: true,
        elemente: [
          { typ: "dermatoskopie", id: "dermatoskopie-lokalisation", ansicht: "lokalisation", render: render, wire: wire }
        ]
      },
      {
        nr: 2,
        titel: "Erstcheck nicht-melanozytaere Muster",
        rolle: "Arzt/PCM",
        rolleStil: "blue",
        farbe: "#6C3F2A",
        elemente: [
          { typ: "dermatoskopie", id: "dermatoskopie-nichtmel", ansicht: "nichtmel", render: render, wire: wire }
        ]
      },
      {
        nr: 3,
        titel: "Erstcheck melanozytaere Muster",
        rolle: "Arzt/PCM",
        rolleStil: "blue",
        farbe: "#6C3F2A",
        elemente: [
          { typ: "dermatoskopie", id: "dermatoskopie-mel", ansicht: "mel", render: render, wire: wire }
        ]
      },
      {
        nr: 4,
        titel: "ABCD-Regel nach Stolz",
        rolle: "Arzt/PCM",
        rolleStil: "orange",
        farbe: "#BB4E26",
        elemente: [
          { typ: "dermatoskopie", id: "dermatoskopie-abcd", ansicht: "abcd", render: render, wire: wire }
        ]
      },
      {
        nr: 5,
        titel: "Ergebnis und Procedere",
        rolle: "Dokumentation",
        rolleStil: "green",
        farbe: "#1E8449",
        elemente: [
          { typ: "dermatoskopie", id: "dermatoskopie-ergebnis", ansicht: "ergebnis", render: render, wire: wire }
        ]
      }
    ],
    auswertung: auswertung,
    baustein: baustein
  });
})();
