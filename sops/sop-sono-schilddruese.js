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
    "gesamt__struma_diffus":          { file: "sd_struma_diffus.jpg",    cap: "Struma diffusa",                                               src: "https://sonographiebilder.de/struma-diffusa" },
    "gesamt__hashimoto":              { file: "sd_hashimoto.jpg",        cap: "Hashimoto-Thyreoiditis (echoarmes, inhomogenes Parenchym)",    src: "https://sonographiebilder.de/thyreoiditis" },
    "gesamt__basedow":                { file: "sd_basedow.jpg",          cap: "Morbus Basedow",                                               src: "https://sonographiebilder.de/thyreoiditis" },
    "lappen_re__knoten_solitaer":     { file: "sd_knoten_solitaer.jpg",  cap: "Schilddruesenknoten (Adenom)",                                 src: "https://sonographiebilder.de/sd-knoten" },
    "lappen_re__knoten_multipel":     { file: "sd_knoten_multipel.jpg",  cap: "Schilddruesenknoten",                                          src: "https://sonographiebilder.de/sd-knoten" },
    "lappen_re__zyste":               { file: "sd_zyste.jpg",            cap: "Schilddruesenzyste (mit Einblutung)",                          src: "https://sonographiebilder.de/sd-zysten" },
    "lappen_re__malignitaetsverdacht":{ file: "sd_malignitaet.jpg",      cap: "Schilddruesenkarzinom",                                        src: "https://sonographiebilder.de/sd-carcinom" },
    "lappen_li__knoten_solitaer":     { file: "sd_knoten_solitaer.jpg",  cap: "Schilddruesenknoten (Adenom)",                                 src: "https://sonographiebilder.de/sd-knoten" },
    "lappen_li__knoten_multipel":     { file: "sd_knoten_multipel.jpg",  cap: "Schilddruesenknoten",                                          src: "https://sonographiebilder.de/sd-knoten" },
    "lappen_li__zyste":               { file: "sd_zyste.jpg",            cap: "Schilddruesenzyste (mit Einblutung)",                          src: "https://sonographiebilder.de/sd-zysten" },
    "lappen_li__malignitaetsverdacht":{ file: "sd_malignitaet.jpg",      cap: "Schilddruesenkarzinom",                                        src: "https://sonographiebilder.de/sd-carcinom" },
    "isthmus__knoten":                { file: "sd_knoten_multipel.jpg",  cap: "Schilddruesenknoten",                                          src: "https://sonographiebilder.de/sd-knoten" }
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

  var KNOTEN_OPTIONEN = [
    { id: "knoten_solitaer", name: "Solitärknoten", beschreibung: "Echoarmer/echoreicher, glatt begrenzter Knoten, Durchmesser {wert}, regelrechte Randbegrenzung.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "E04.1G" },
    { id: "knoten_multipel", name: "Mehrere Knoten (Knotenstruma)", beschreibung: "Mehrere umschriebene Knoten, größter Knoten {wert}, Parenchym dazwischen unauffällig.", messfeld: { label: "Größter Knoten", einheit: "mm" }, icd: "E04.2G" },
    { id: "zyste", name: "Zyste", beschreibung: "Echofreie, glatt begrenzte, dorsal schallverstärkte Läsion, Durchmesser {wert}.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "E04.1G" },
    { id: "malignitaetsverdacht", name: "Malignitätsverdächtiger Knoten", beschreibung: "Echoarmer, unscharf begrenzter Knoten mit Mikrokalzifikationen und Hoch-größer-als-breit-Konfiguration, Durchmesser {wert} - fachärztliche Abklärung (Feinnadelpunktion) empfohlen.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "C73V", warn: true },
    { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
  ];

  var ORGANE = [
    {
      key: "gesamt", titel: "Parenchym / Gesamtbeurteilung",
      normal: "Schilddrüse orthotop, Parenchym homogen und normal echogen, keine diffuse Vergrößerung, keine fokale Läsion.",
      optionen: [
        { id: "struma_diffus", name: "Diffuse Struma", beschreibung: "Diffus vergrößerte Schilddrüse ohne umschriebene Knotenbildung, Echotextur homogen.", icd: "E04.0G" },
        { id: "hashimoto", name: "V. a. Autoimmunthyreoiditis (Hashimoto-Muster)", beschreibung: "Diffus echoarmes, landkartenartig-inhomogenes Parenchym, vereinbar mit Autoimmunthyreoiditis.", icd: "E06.3V" },
        { id: "basedow", name: "V. a. Morbus Basedow (Hypervaskularisation)", beschreibung: 'Diffus echoarmes Parenchym mit deutlich vermehrter Vaskularisation ("thyreoidales Inferno"), V. a. Morbus Basedow.', icd: "E05.0V", warn: true },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    },
    {
      key: "lappen_re", titel: "Rechter Lappen",
      normal: "Rechter Lappen normal groß, Echogenität und Echotextur homogen, kein Knotennachweis.",
      optionen: KNOTEN_OPTIONEN
    },
    {
      key: "lappen_li", titel: "Linker Lappen",
      normal: "Linker Lappen normal groß, Echogenität und Echotextur homogen, kein Knotennachweis.",
      optionen: KNOTEN_OPTIONEN
    },
    {
      key: "isthmus", titel: "Isthmus",
      normal: "Isthmus normal breit, homogenes Echomuster, kein Knotennachweis.",
      optionen: [
        { id: "knoten", name: "Knoten im Isthmus", beschreibung: "Umschriebener Knoten, Durchmesser {wert}.", messfeld: { label: "Durchmesser", einheit: "mm" }, icd: "E04.1G" },
        { id: "sonstiges", name: "Sonstiger/atypischer Befund", freitext: true }
      ]
    }
  ];

  function organById(key) { return ORGANE.filter(function (o) { return o.key === key; })[0] || null; }
  function optionById(o, id) { return (o.optionen || []).filter(function (opt) { return opt.id === id; })[0] || null; }

  function sonoState(s) {
    s.sonoSchild = s.sonoSchild || {};
    var d = s.sonoSchild;
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
      api.setState({ sonoSchild: d });
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

  function baustein(s) {
    var d = sonoState(s);
    var zeilen = [];
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
    var vol = s.volumen && s.volumen.wert;
    if (hasText(vol)) zeilen.push("Geschätztes Gesamtvolumen: " + vol + " ml.");
    if (hasText(s.zusatz)) zeilen.push("Zusätzlich: " + s.zusatz);

    var th = "";
    var malignitaet = Object.keys(d.organe).some(function (k) { return d.organe[k] && (d.organe[k].auswahl || []).indexOf("malignitaetsverdacht") !== -1; });
    if (malignitaet) th = "Fachärztliche/endokrinologische Vorstellung zur weiteren Abklärung (Feinnadelpunktion) empfehlen.";

    return {
      AN: "Sonographie der Schilddrüse, indikationsgerecht durchgeführt.",
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

    ORGANE.forEach(function (o) {
      var os = d.organe[o.key];
      var auswahl = (os && os.auswahl) || [];
      auswahl.forEach(function (id) {
        if (id === "__normal__") return;
        var opt = optionById(o, id);
        if (!opt || !opt.warn) return;
        if (opt.id === "malignitaetsverdacht") {
          redflag = true;
          meldungen.push({ stil: "rot", titel: "Malignitätsverdächtiger Knoten (" + o.titel + ")", text: "Fachärztliche/endokrinologische Abklärung (Feinnadelpunktion) zeitnah empfehlen." });
        } else {
          meldungen.push({ stil: "orange", titel: opt.name + " (" + o.titel + ")", text: "Weitere Einordnung (Labor/Klinik) empfohlen." });
        }
      });
    });

    var vol = parseFloat(s.volumen && s.volumen.wert);
    if (!isNaN(vol) && vol > 25) {
      meldungen.push({ stil: "orange", titel: "Vergrößertes Schätzvolumen", text: "Gesamtvolumen " + vol + " ml - Struma möglich, ggf. Funktionsdiagnostik ergänzen." });
    }

    return { redflag: redflag, bannerText: "Malignitätsverdächtiger Schilddrüsenknoten - zeitnahe fachärztliche Abklärung einleiten.", meldungen: meldungen };
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
    id: "sono-schilddruese",
    titel: "Sono Schilddrüse",
    untertitel: "Strukturierte Schilddrüsensonographie: Lappen, Isthmus, Volumetrie, SN-Dokumentation",
    icon: "🦋",
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
      sonoSchild: { tab: "gesamt", organe: {} },
      volumen: { wert: "", einheit: "ml" },
      zusatz: ""
    },
    schritte: [
      {
        nr: 1,
        titel: "Volumetrie",
        rolle: "Arzt",
        rolleStil: "blue",
        farbe: "#025669",
        offen: true,
        elemente: [
          { typ: "info", stil: "blau", titel: "Hinweis", text: "Für jeden Lappen sowie Isthmus und Gesamtbeurteilung Normalbefund oder passende Pathologie anklicken. Bei Knoten/Zysten wird die Größe abgefragt. Zu vielen Befunden lässt sich über „▸ Beispielbild“ ein sonographisches Referenzbild (Quelle: Sonographie-Atlas, Immanuel Albertinen Diakonie) einblenden." },
          { typ: "zahl", id: "volumen", label: "Geschätztes Gesamtvolumen", einheiten: ["ml"], min: 0, max: 200 }
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
          { typ: "sono", id: "sono-schild-organe", render: render, wire: wire }
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
