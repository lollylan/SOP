(function () {
  "use strict";

  /* ======================================================================
     Effloreszenzenlehre — strukturierte dermatologische Befundbeschreibung
     Kein Diagnosemodul: es geht ausschliesslich um die BESCHREIBUNG eines
     Hautbefunds (Primaer-/Sekundaereffloreszenzen + Deskriptoren) samt
     kurzen Erklaerungen der Fachbegriffe. Aufbau/Optik orientiert am
     EKG-Atlas (aufklappbare "Merkmale"-Panels je Begriff).
     ====================================================================== */

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function hasText(v) { return v != null && String(v).trim() !== ""; }

  /* ----------------------------------------------------------------------
     Beispielbilder je Effloreszenz (lokal in assets/effloreszenzen/).
     Alle von Wikimedia Commons unter freier Lizenz (CC / Public Domain);
     Urheber + Lizenz werden je Bild als Bildnachweis eingeblendet.
     Vollstaendiger Nachweis: assets/effloreszenzen/BILDNACHWEIS.md
     ---------------------------------------------------------------------- */
  var IMG_BASE = "assets/effloreszenzen/";
  var IMAGES = {
    macula:          { file: "macula.jpg",          artist: "Klaus D. Peter, Wiehl",     license: "CC BY 3.0 DE",  src: "https://commons.wikimedia.org/wiki/File:Cafe_au_lait.jpg" },
    papel:           { file: "papel.jpg",           artist: "Mndno",                     license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Verruca_vulgaris_on_the_first_toe.jpg" },
    plaque:          { file: "plaque.jpg",          artist: "James Heilman, MD",         license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Psoriasis2010.JPG" },
    nodus:           { file: "nodus.jpg",           artist: "Biswarup Ganguly",          license: "CC BY 3.0",     src: "https://commons.wikimedia.org/wiki/File:Erythema_nodosum_-_Kolkata_2012-01-03_7753.JPG" },
    urtica:          { file: "urtica.jpg",          artist: "Allergyresearch",           license: "CC BY-SA 4.0",  src: "https://commons.wikimedia.org/wiki/File:Hives_Urticaria.jpg" },
    vesikel:         { file: "vesikel.jpg",         artist: "Inwe (Wikimedia Commons)",  license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Dyshidrosis.JPG" },
    bulla:           { file: "bulla.jpg",           artist: "Themidget17",               license: "CC BY-SA 4.0",  src: "https://commons.wikimedia.org/wiki/File:Second_degree_burn_after_2_days_(2).JPG" },
    pustel:          { file: "pustel.jpg",          artist: "Jmarchn",                   license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Isolated_folliculitis.jpg" },
    zyste:           { file: "zyste.jpg",           artist: "Ianchai",                   license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Sebaceous-Cyst-Calf.jpg" },
    squama:          { file: "squama.jpg",          artist: "Gzzz",                      license: "CC BY-SA 4.0",  src: "https://commons.wikimedia.org/wiki/File:Ichthyosis_(2).jpg" },
    crusta:          { file: "crusta.jpg",          artist: "Åsa Thörn",                 license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Impetigo-infected.jpg" },
    erosion:         { file: "erosion.jpg",         artist: "Masryyy",                   license: "CC BY-SA 4.0",  src: "https://commons.wikimedia.org/wiki/File:Pemphigus_new_photo_due_to_antihypertensive_drug.jpg" },
    exkoriation:     { file: "exkoriation.jpg",     artist: "Kairyu7",                   license: "CC BY 3.0",     src: "https://commons.wikimedia.org/wiki/File:Dermatillomania.jpg" },
    rhagade:         { file: "rhagade.jpg",         artist: "Matthew Ferguson",          license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Angular_cheilitis.jpg" },
    ulkus:           { file: "ulkus.jpg",           artist: "Jonathan Moore",            license: "CC BY 3.0",     src: "https://commons.wikimedia.org/wiki/File:Venous_ulcer_dorsal_leg.jpg" },
    cicatrix:        { file: "cicatrix.jpg",        artist: "Htirgan",                   license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Keloid,_Post_Surgical.JPG" },
    atrophie:        { file: "atrophie.jpg",        artist: "José Reynaldo da Fonseca",  license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:P%C3%BArpura_Senil_300413_REFON_1_WP.jpg" },
    lichenifikation: { file: "lichenifikation.jpg", artist: "kilbad",                    license: "CC BY 3.0",     src: "https://commons.wikimedia.org/wiki/File:Lichen_simplex_chronicus_1.jpg" },
    nekrose:         { file: "nekrose.jpg",         artist: "Wikimedia Commons",         license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Dry_gangrene_4th_toe.jpg" },
    erythem:         { file: "erythem.jpg",         artist: "CDC / James Gathany",       license: "Public Domain", src: "https://commons.wikimedia.org/wiki/File:Erythema_migrans_-_erythematous_rash_in_Lyme_disease_-_PHIL_9875.jpg" },
    ekzem:           { file: "ekzem.jpg",           artist: "Eisfelder (Wikimedia)",     license: "CC BY-SA 3.0",  src: "https://commons.wikimedia.org/wiki/File:Atopic_dermatitis_child.JPG" },
    exanthem:        { file: "exanthem.jpg",        artist: "CDC / NCIRD",               license: "Public Domain", src: "https://commons.wikimedia.org/wiki/File:Photo_of_childhood_rash_obtained_from_measles.jpg" }
  };

  function imgHtml(id, caption) {
    var m = IMAGES[id];
    if (!m) return "";
    var cap = (caption ? caption + " — " : "") + "Bild: " + m.artist + " (" + m.license + ")";
    return '<figure class="derm-figure">' +
      '<img class="derm-img" src="' + esc(IMG_BASE + m.file) + '" alt="Beispielbild: ' + esc(caption || id) + '" loading="lazy" data-lightbox data-caption="' + esc(cap) + '">' +
      '<figcaption class="derm-figcap">Bild: ' + esc(m.artist) +
      ' · <a href="' + esc(m.src) + '" target="_blank" rel="noopener noreferrer">' + esc(m.license) + '</a></figcaption>' +
      '</figure>';
  }

  /* -------- Primaereffloreszenzen (auf gesunder Haut entstehend) -------- */
  var PRIMAER = [
    {
      id: "macula", name: "Macula (Fleck)",
      kurz: "Umschriebene Farbveraenderung im Hautniveau — nicht tastbar.",
      detail: [
        "Weder erhaben noch eingesunken, nur an der Farbe erkennbar (nicht palpabel).",
        "Rot durch Gefaesserweiterung (Erythem, wegdrueckbar) oder durch Erythrozytenaustritt (Purpura, nicht wegdrueckbar).",
        "Braun = Hyperpigmentierung (z. B. Cafe-au-lait, Lentigo), weiss = Depigmentierung (z. B. Vitiligo).",
        "Ab ca. > 1 cm spricht man auch von einer Macula/Fleck grossflaechig; sehr grosse einheitliche Rotfaerbung > 90 % KOF = Erythrodermie."
      ]
    },
    {
      id: "papel", name: "Papel (Papula / Knoetchen)",
      kurz: "Tastbare, erhabene Substanzvermehrung < 0,5-1 cm.",
      detail: [
        "Ueber das Hautniveau erhaben und palpabel — das unterscheidet sie von der Macula.",
        "Ursprung epidermal, dermal oder gemischt; Oberflaeche glatt, verrukoes oder schuppend moeglich.",
        "Beispiele: Warze, melanozytaerer Naevus, Lichen ruber, Insektenstich."
      ]
    },
    {
      id: "plaque", name: "Plaque",
      kurz: "Flaechige, plateauartige Erhabenheit > 1 cm — Breite ueberwiegt die Hoehe.",
      detail: [
        "Meist durch Konfluenz (Zusammenfliessen) mehrerer Papeln entstanden.",
        "Klassisch scharf begrenzt und erhaben; Oberflaeche haeufig schuppend.",
        "Beispiel: Psoriasis-Plaque, Ekzemplaque."
      ]
    },
    {
      id: "nodus", name: "Nodus (Knoten)",
      kurz: "Tastbare, in die Tiefe reichende Erhabenheit > 0,5-1 cm.",
      detail: [
        "Groesser und tiefer als eine Papel — reicht bis in Dermis oder Subkutis.",
        "Oft besser tast- als sichtbar; Konsistenz und Verschieblichkeit mitbeschreiben.",
        "Beispiele: Erythema nodosum, Lipom, Furunkel, Atherom."
      ]
    },
    {
      id: "urtica", name: "Urtica (Quaddel)",
      kurz: "Fluechtige, erhabene, oedematoese Erhabenheit — meist juckend, < 24 h.",
      detail: [
        "Entsteht durch ein umschriebenes Oedem der oberen Dermis und vergeht rasch (< 24 h) ohne Residuen.",
        "Typisch: blass-rosa Zentrum mit rotem Randsaum (Reflexerythem), stark juckend.",
        "Beispiel: Urtikaria, Insektenstichreaktion."
      ]
    },
    {
      id: "vesikel", name: "Vesikel (Blaeschen)",
      kurz: "Mit klarer Fluessigkeit gefuellter Hohlraum < 0,5 cm.",
      detail: [
        "Intraepidermal oder subepidermal gelegener, praller Hohlraum.",
        "Bei Gruppierung auf erythematoesem Grund an eine virale Genese denken (herpetiform).",
        "Beispiele: Herpes simplex/zoster, dyshidrotisches Ekzem, akute Kontaktdermatitis."
      ]
    },
    {
      id: "bulla", name: "Bulla (Blase)",
      kurz: "Mit Fluessigkeit gefuellter Hohlraum > 0,5 cm.",
      detail: [
        "Wie das Vesikel, nur groesser; Inhalt klar, seroes oder haemorrhagisch.",
        "Spannung (prall/schlaff) und Nikolski-Phaenomen sind wichtige Zusatzmerkmale.",
        "Beispiele: bulloeses Pemphigoid, Verbrennung Grad II, bulloese Impetigo."
      ]
    },
    {
      id: "pustel", name: "Pustel (Pustula)",
      kurz: "Mit Eiter (truebe Fluessigkeit) gefuellter Hohlraum.",
      detail: [
        "Inhalt truebe/gelblich (Leukozyten) — im Gegensatz zum klaren Vesikel.",
        "Primaer und steril (z. B. Psoriasis pustulosa) oder sekundaer/follikulaer-bakteriell.",
        "Beispiele: Akne, Follikulitis, Impetigo."
      ]
    },
    {
      id: "zyste", name: "Zyste",
      kurz: "Abgekapselter, mit fluessigem oder halbfestem Inhalt gefuellter Hohlraum.",
      detail: [
        "Von einer Epithelwand ausgekleideter, prall-elastischer Hohlraum.",
        "Meist gut verschieblich, indolent; auf Druck teils entleerbar.",
        "Beispiele: Epidermalzyste (Atherom), Milie."
      ]
    }
  ];

  /* -------- Sekundaereffloreszenzen (aus Primaereffl. / durch Einfluss) -------- */
  var SEKUNDAER = [
    {
      id: "squama", name: "Squama (Schuppe)",
      kurz: "Sichtbare Ansammlung/Abschilferung von Hornzellen.",
      detail: [
        "Feinlamellaer (pityriasiform), grob-silbrig (psoriasiform) oder collerette-artig.",
        "Ausdruck einer gestoerten Verhornung; Menge und Haftung mitbeschreiben.",
        "Beispiele: Psoriasis, seborrhoisches/atopisches Ekzem, Tinea."
      ]
    },
    {
      id: "crusta", name: "Crusta (Kruste)",
      kurz: "Eingetrocknetes Sekret (Serum, Blut oder Eiter) auf der Oberflaeche.",
      detail: [
        "Serum = gelblich, Blut = braun-schwarz (haemorrhagisch), Eiter = honiggelb.",
        "Zeichen eines vorangegangenen naessenden oder erosiven Prozesses.",
        "Beispiel: honiggelbe Krusten bei Impetigo contagiosa."
      ]
    },
    {
      id: "erosion", name: "Erosion",
      kurz: "Oberflaechlicher Defekt, auf die Epidermis begrenzt — heilt narbenlos.",
      detail: [
        "Substanzverlust nur der Epidermis; naessend, aber ohne Narbe abheilend.",
        "Entsteht z. B. nach geplatztem Blaeschen/Blase.",
        "Abgrenzung: Exkoriation reicht tiefer, Ulkus deutlich tiefer."
      ]
    },
    {
      id: "exkoriation", name: "Exkoriation (Kratzeffekt)",
      kurz: "Bis in die Dermis reichender, meist strichfoermiger Defekt.",
      detail: [
        "Reicht tiefer als die Erosion (bis in die papillaere Dermis), oft punktfoermige Blutung.",
        "Meist mechanisch/durch Kratzen (Hinweis auf Pruritus).",
        "Kann narbig oder narbenlos abheilen."
      ]
    },
    {
      id: "rhagade", name: "Rhagade / Fissur",
      kurz: "Spaltfoermiger, schmerzhafter Einriss durch die Epidermis bis in die Dermis.",
      detail: [
        "Tritt an mechanisch beanspruchter oder verhornter/entzuendeter Haut auf.",
        "Praedilektion: Finger, Fersen, Mundwinkel (Perleche), anal.",
        "Schmerzhaft, da bis in die nervenreiche Dermis reichend."
      ]
    },
    {
      id: "ulkus", name: "Ulkus (Ulcus)",
      kurz: "Tiefer Substanzdefekt bis in Dermis/Subkutis — heilt mit Narbe.",
      detail: [
        "Reicht ueber die Basalmembran hinaus; Grund, Rand und Belag beschreiben.",
        "Heilt immer unter Narbenbildung ab.",
        "Beispiel: Ulcus cruris venosum/arteriosum, Dekubitus."
      ]
    },
    {
      id: "cicatrix", name: "Cicatrix (Narbe)",
      kurz: "Bindegewebiger Ersatz nach einem Defekt.",
      detail: [
        "Atroph (eingesunken), hypertroph (im Wundgebiet erhaben) oder Keloid (ueber Wundgrenze hinaus).",
        "Meist haar- und anhangsgebildefrei.",
        "Farbe (rot/livide vs. weisslich) gibt Hinweis auf Alter der Narbe."
      ]
    },
    {
      id: "atrophie", name: "Atrophie",
      kurz: "Verduennung von Epidermis und/oder Dermis mit Substanzverlust.",
      detail: [
        "Haut wirkt duenn, glaenzend, zigarettenpapierartig gefaeltelt; Gefaesse durchscheinend.",
        "Ursachen: Alter, Steroide (topisch/systemisch), Lichen sclerosus.",
        "Abgrenzung: Narbe entsteht nach Defekt, Atrophie ist Gewebsschwund ohne vorherigen Defekt."
      ]
    },
    {
      id: "lichenifikation", name: "Lichenifikation",
      kurz: "Vergroeberung des Hautreliefs mit verstaerkter Felderung.",
      detail: [
        "Folge chronischen Reibens/Kratzens — Haut erscheint verdickt und ledrig.",
        "Typisch bei chronischem (atopischem) Ekzem, Lichen simplex chronicus.",
        "Oft mit Hyperpigmentierung und Schuppung kombiniert."
      ]
    },
    {
      id: "nekrose", name: "Nekrose / Eschar",
      kurz: "Abgestorbenes, meist schwarzes/lederartiges Gewebe.",
      detail: [
        "Trockene (Mumifikation) oder feuchte Nekrose; scharf oder unscharf demarkiert.",
        "Hinweis auf Ischaemie, Infektion oder Druckschaedigung.",
        "Beispiel: nekrotischer Dekubitusgrund, akrale Nekrose bei pAVK."
      ]
    }
  ];

  /* -------- Reaktionsmuster & wichtige Begriffe (rein erklaerend) -------- */
  var GLOSSAR = [
    {
      id: "effloreszenz", name: "Effloreszenz",
      kurz: "Grundbaustein des Hautbefunds — ein einzelnes „Blueten“-Element.",
      detail: [
        "Primaereffloreszenz = direkt auf gesunder Haut entstanden (z. B. Macula, Papel, Blase).",
        "Sekundaereffloreszenz = aus einer Primaereffloreszenz oder durch aeussere Einfluesse entstanden (z. B. Schuppe, Kruste, Erosion).",
        "Ein Befund wird beschrieben als Summe seiner Effloreszenzen plus Deskriptoren."
      ]
    },
    {
      id: "erythem", name: "Erythem",
      kurz: "Wegdrueckbare (anaemisierbare) Hautroetung durch Gefaesserweiterung.",
      detail: [
        "Auf Glasspateldruck (Diaskopie) blasst das Erythem ab — Blut ist noch im Gefaess.",
        "Abgrenzung Purpura: bleibt auf Druck bestehen (Erythrozyten sind ins Gewebe ausgetreten).",
        "Erythem ist eine rote Macula, keine eigene Effloreszenzklasse."
      ]
    },
    {
      id: "ekzem", name: "Ekzem (Dermatitis)",
      kurz: "Nicht-infektioeses, juckendes Entzuendungsmuster mit polymorphem Bild.",
      detail: [
        "Kein einzelnes Element, sondern ein VERLAUFSMUSTER: Erythem → Papulovesikel → Naessen/Krusten → Schuppung → (chronisch) Lichenifikation.",
        "Akut: naessend, vesikuloes; chronisch: trocken, schuppend, lichenifiziert.",
        "„Polymorph“ = verschiedene Effloreszenzen nebeneinander (typisch fuers Ekzem)."
      ]
    },
    {
      id: "exanthem", name: "Exanthem / Enanthem",
      kurz: "Akuter, disseminierter Hautausschlag (Exanthem) bzw. Schleimhautausschlag (Enanthem).",
      detail: [
        "Exanthem: gleichzeitiges Auftreten vieler Effloreszenzen, oft symmetrisch (z. B. viral, medikamentoes).",
        "Morphologie beschreiben: makuloes, makulopapuloes, urtikariell, vesikuloes, pustuloes.",
        "Enanthem = analoges Bild an den Schleimhaeuten (z. B. enorales Enanthem)."
      ]
    },
    {
      id: "verteilungsbegriffe", name: "Mono- vs. Polymorphie, Disposition",
      kurz: "Begriffe zur Gesamtschau eines Ausschlags.",
      detail: [
        "Monomorph = alle Effloreszenzen gleichartig (z. B. Urtikaria); polymorph = verschiedenartig nebeneinander.",
        "Disseminiert = ueber das Areal verstreut; konfluierend = zusammenfliessend; herpetiform = in Gruppen.",
        "Anulaer = ringfoermig, kokardenfoermig = schiessscheibenartig (Target, z. B. Erythema multiforme)."
      ]
    }
  ];

  /* -------- Deskriptoren (Mehrfachauswahl-Chips) -------- */
  var DESKRIPTOREN = [
    { key: "farbe", label: "Farbe", items: [
      ["hautfarben", "hautfarben"], ["erythematoes", "erythematös (rot)"], ["livide", "livide/bläulich"],
      ["braeunlich", "bräunlich (hyperpigmentiert)"], ["depigmentiert", "depigmentiert (weiß)"],
      ["gelblich", "gelblich"], ["schwaerzlich", "schwärzlich"]
    ] },
    { key: "begrenzung", label: "Begrenzung", items: [
      ["scharf", "scharf begrenzt"], ["unscharf", "unscharf begrenzt"]
    ] },
    { key: "form", label: "Form (Einzelläsion)", items: [
      ["rund", "rund"], ["oval", "oval"], ["polygonal", "polygonal"], ["anulaer", "anulär (ringförmig)"],
      ["kokarde", "kokarden-/targetförmig"], ["linear", "linear"], ["unregelmaessig", "unregelmäßig"]
    ] },
    { key: "anordnung", label: "Anordnung / Konfiguration", items: [
      ["solitaer", "solitär"], ["multipel", "multipel"], ["gruppiert", "gruppiert (herpetiform)"],
      ["disseminiert", "disseminiert"], ["konfluierend", "konfluierend"], ["anulaer-konfig", "anulär angeordnet"],
      ["linear-koebner", "linear (Köbner)"], ["segmental", "segmental"]
    ] },
    { key: "verteilung", label: "Verteilung / Prädilektion", items: [
      ["lokalisiert", "lokalisiert"], ["generalisiert", "generalisiert"], ["symmetrisch", "symmetrisch"],
      ["lichtexponiert", "lichtexponierte Areale"], ["seborrhoisch", "seborrhoische Areale"],
      ["beugeseiten", "Beugeseiten"], ["streckseiten", "Streckseiten"], ["intertriginoes", "intertriginös"], ["akral", "akral"]
    ] },
    { key: "oberflaeche", label: "Oberfläche", items: [
      ["glatt", "glatt"], ["schuppend", "schuppend"], ["verkrustet", "verkrustet"], ["naessend", "nässend"],
      ["erosiv", "erosiv"], ["hyperkeratotisch", "hyperkeratotisch"], ["exulzeriert", "exulzeriert"]
    ] },
    { key: "palpation", label: "Palpation / Konsistenz", items: [
      ["weich", "weich"], ["derb", "derb"], ["prall-elastisch", "prall-elastisch"],
      ["indolent", "indolent"], ["druckdolent", "druckdolent"], ["verschieblich", "verschieblich"]
    ] }
  ];

  /* -------- Lookups fuer Label aus ID -------- */
  function nameById(list, id) {
    var hit = list.filter(function (x) { return x.id === id; })[0];
    return hit ? hit.name : id;
  }
  function deskLabel(key, id) {
    var grp = DESKRIPTOREN.filter(function (g) { return g.key === key; })[0];
    if (!grp) return id;
    var row = grp.items.filter(function (it) { return it[0] === id; })[0];
    return row ? row[1] : id;
  }
  function labelJoin(list, ids) {
    return (ids || []).map(function (id) { return nameById(list, id); }).join(", ");
  }
  function deskJoin(key, ids) {
    return (ids || []).map(function (id) { return deskLabel(key, id); }).join(", ");
  }

  /* -------- State -------- */
  function effState(st) {
    st.eff = st.eff || {};
    var e = st.eff;
    e.zone = e.zone || "";
    e.lok = e.lok || "";
    e.groesse = e.groesse || "";
    e.freitext = e.freitext || "";
    ["primaer", "sekundaer", "farbe", "begrenzung", "form", "anordnung", "verteilung", "oberflaeche", "palpation"].forEach(function (k) {
      if (!Array.isArray(e[k])) e[k] = [];
    });
    return e;
  }

  /* -------- Render -------- */
  function cardHtml(group, item, selectable) {
    var panelId = group + "-" + item.id;
    var sel = "";
    return '<div class="derm-card" data-eff-card="' + esc(group) + '" data-id="' + esc(item.id) + '"' +
      (selectable ? "" : ' data-eff-static="1"') + '>' +
      '<div class="derm-card-top"><div class="derm-card-title">' + esc(item.name) + '</div>' +
      '<div class="derm-card-desc">' + esc(item.kurz) + '</div></div>' +
      '<button class="derm-help" type="button" data-eff-help="' + esc(panelId) + '">▸ ' +
      (IMAGES[item.id] ? 'Erklärung &amp; Beispielbild' : 'Erklärung') + '</button>' +
      '<div class="derm-help-panel" data-eff-help-panel="' + esc(panelId) + '">' + imgHtml(item.id, item.name) +
      '<div class="derm-hint"><ul style="margin:0 0 0 16px;padding:0">' +
      item.detail.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") +
      '</ul></div></div>' + sel + '</div>';
  }

  function chipGroupHtml(grp) {
    return '<div class="sec">' + esc(grp.label) + '</div><div class="derm-choice" style="flex-direction:row;flex-wrap:wrap">' +
      grp.items.map(function (it) {
        return '<div class="derm-opt" data-eff-toggle="' + esc(grp.key) + '" data-id="' + esc(it[0]) + '" style="flex:0 1 auto">' +
          '<div class="derm-square"></div>' + esc(it[1]) + '</div>';
      }).join("") + '</div>';
  }

  /* -------- Koerperkarte (identisch zur Dermatoskopie) -------- */
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

  function render(el) {
    var s = (el && el.ansicht) || "anleitung";
    return '<div class="eff-tool" data-eff-tool data-eff-section="' + esc(s) + '">' + panelHtml(s) + '</div>';
  }

  function panelHtml(s) {
    if (s === "anleitung") {
      return '<div class="box bx-blue"><div class="lbl">So beschreibt man einen Hautbefund</div>' +
        'Systematisch in fester Reihenfolge — unabhängig von der Diagnose:</div>' +
        '<ol class="ul" style="padding-left:18px">' +
        '<li><strong>Lokalisation &amp; Größe</strong> — wo, wie viele, wie groß.</li>' +
        '<li><strong>Primäreffloreszenz</strong> — der Grundtyp (Macula, Papel, Plaque, Blase, Pustel …).</li>' +
        '<li><strong>Sekundäreffloreszenz</strong> — Veränderung darauf (Schuppe, Kruste, Erosion, Narbe …).</li>' +
        '<li><strong>Farbe · Begrenzung · Form</strong> der Einzelläsion.</li>' +
        '<li><strong>Anordnung · Verteilung</strong> — wie liegen die Läsionen zueinander und am Körper.</li>' +
        '<li><strong>Oberfläche · Palpation</strong> — tastbare Eigenschaften.</li>' +
        '</ol>' +
        '<div class="box bx-green"><div class="lbl">Merksatz</div>' +
        'Erst die Effloreszenz benennen, dann mit Deskriptoren präzisieren — aus „rotes Ding am Bein“ wird ' +
        '„scharf begrenzte, erythematöse, schuppende Plaque am Unterschenkel“.</div>' +
        '<div class="box bx-gray"><div class="lbl">Beispielbilder</div>' +
        'Bei den Primär-, Sekundäreffloreszenzen und im Glossar erscheint beim Aufklappen von ' +
        '„Erklärung &amp; Beispielbild“ jeweils ein typisches Beispielbild. ' +
        'Alle Bilder stammen von Wikimedia Commons und stehen unter freier Lizenz ' +
        '(Creative Commons bzw. Public Domain); Urheber und Lizenz sind unter jedem Bild genannt. ' +
        'Vollständiger Nachweis: <em>assets/effloreszenzen/BILDNACHWEIS.md</em>.</div>';
    }
    if (s === "lokalisation") {
      return '<div class="box bx-blue"><div class="lbl">Lokalisation und Größe</div>Region in der Körperkarte anklicken, dann ggf. präzisieren und Größe eintragen.</div>' +
        '<div class="derm-location"><div class="derm-bodymaps">' + bodyMapHtml("ventral") + bodyMapHtml("dorsal") + '</div>' +
        '<div><div class="derm-zone-label" data-eff-zone-label>Bitte Region anklicken</div>' +
        '<div class="form-row" style="display:block"><label>Präzisierung</label>' +
        '<input type="text" data-eff-field="lok" placeholder="z. B. Streckseite, paravertebral links, 2 cm lateral" style="width:100%"></div>' +
        '<div class="form-row" style="display:block"><label>Größe / Ausdehnung</label>' +
        '<input type="text" data-eff-field="groesse" placeholder="z. B. 2 x 1 cm, mehrere über 5 x 8 cm" style="width:100%"></div>' +
        '</div></div>';
    }
    if (s === "primaer") {
      return '<div class="box bx-blue"><div class="lbl">Primäreffloreszenz(en)</div>Grundtyp anklicken (Mehrfachauswahl möglich). „Erklärung“ zeigt Definition und Abgrenzung.</div>' +
        '<div class="derm-grid">' + PRIMAER.map(function (p) { return cardHtml("primaer", p, true); }).join("") + '</div>';
    }
    if (s === "sekundaer") {
      return '<div class="box bx-blue"><div class="lbl">Sekundäreffloreszenz(en)</div>Veränderungen auf/aus der Primäreffloreszenz (Mehrfachauswahl möglich).</div>' +
        '<div class="derm-grid">' + SEKUNDAER.map(function (p) { return cardHtml("sekundaer", p, true); }).join("") + '</div>';
    }
    if (s === "merkmale") {
      return '<div class="box bx-blue"><div class="lbl">Beschreibungsmerkmale</div>Zutreffende Deskriptoren ankreuzen — sie präzisieren die Effloreszenz.</div>' +
        DESKRIPTOREN.map(chipGroupHtml).join("");
    }
    if (s === "glossar") {
      return '<div class="box bx-blue"><div class="lbl">Reaktionsmuster &amp; Begriffe</div>Nachschlagewerk — keine Auswahl. „Erklärung“ aufklappen.</div>' +
        '<div class="derm-grid">' + GLOSSAR.map(function (g) { return cardHtml("glossar", g, false); }).join("") + '</div>';
    }
    if (s === "befund") {
      return '<div class="box bx-blue"><div class="lbl">Befundvorschau</div>Aus den Eingaben zusammengesetzter Beschreibungstext.</div>' +
        '<div data-eff-result></div>' +
        '<div class="derm-actions"><button class="prim-btn" data-eff-scroll-pvs type="button">PVS-Dokumentation anzeigen</button></div>';
    }
    return "";
  }

  /* -------- Befundtext -------- */
  function befundText(e) {
    var parts = [];
    var lokPart = [];
    if (hasText(e.zone)) lokPart.push(String(e.zone).trim());
    if (hasText(e.lok)) lokPart.push(String(e.lok).trim());
    if (hasText(e.groesse)) lokPart.push(String(e.groesse).trim());
    if (lokPart.length) parts.push("Lokalisation/Größe: " + lokPart.join(", ") + ".");

    if (e.primaer.length) parts.push("Primäreffloreszenz: " + labelJoin(PRIMAER, e.primaer) + ".");
    if (e.sekundaer.length) parts.push("Sekundäreffloreszenz: " + labelJoin(SEKUNDAER, e.sekundaer) + ".");

    var fbf = [];
    if (e.farbe.length) fbf.push("Farbe " + deskJoin("farbe", e.farbe));
    if (e.begrenzung.length) fbf.push(deskJoin("begrenzung", e.begrenzung));
    if (e.form.length) fbf.push("Form " + deskJoin("form", e.form));
    if (fbf.length) parts.push(fbf.join(", ") + ".");

    var av = [];
    if (e.anordnung.length) av.push("Anordnung " + deskJoin("anordnung", e.anordnung));
    if (e.verteilung.length) av.push("Verteilung " + deskJoin("verteilung", e.verteilung));
    if (av.length) parts.push(av.join(", ") + ".");

    var op = [];
    if (e.oberflaeche.length) op.push("Oberfläche " + deskJoin("oberflaeche", e.oberflaeche));
    if (e.palpation.length) op.push("Palpation " + deskJoin("palpation", e.palpation));
    if (op.length) parts.push(op.join(", ") + ".");

    if (hasText(e.freitext)) parts.push(String(e.freitext).trim());
    return parts.join(" ");
  }

  /* -------- Wire -------- */
  function wire(api) {
    var root = api.root;
    if (!root) return;
    var tools = root.querySelectorAll("[data-eff-tool]");
    if (!tools.length || root.querySelector('[data-eff-tool][data-eff-wired="1"]')) return;
    tools.forEach(function (t) { t.setAttribute("data-eff-wired", "1"); });
    var e = effState(api.state);

    function commit(fn) {
      fn(e);
      api.setState({ eff: e });
      paint();
    }

    root.querySelectorAll("[data-eff-field]").forEach(function (field) {
      field.addEventListener("input", function () {
        var key = field.getAttribute("data-eff-field");
        commit(function () { e[key] = field.value; });
      });
    });

    root.querySelectorAll("[data-zone]").forEach(function (zone) {
      zone.addEventListener("click", function () {
        commit(function () {
          var val = zone.getAttribute("data-zone");
          e.zone = e.zone === val ? "" : val;
        });
      });
    });

    root.querySelectorAll("[data-eff-help]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var panel = root.querySelector('[data-eff-help-panel="' + btn.getAttribute("data-eff-help") + '"]');
        if (panel) panel.classList.toggle("open");
      });
    });

    root.querySelectorAll('[data-eff-card]').forEach(function (card) {
      if (card.getAttribute("data-eff-static") === "1") return;
      card.addEventListener("click", function (ev) {
        if (ev.target.closest(".derm-help-panel") || ev.target.closest(".derm-help")) return;
        var group = card.getAttribute("data-eff-card");
        var id = card.getAttribute("data-id");
        commit(function () {
          var list = e[group] || [];
          var idx = list.indexOf(id);
          if (idx >= 0) list.splice(idx, 1); else list.push(id);
          e[group] = list;
        });
      });
    });

    root.querySelectorAll("[data-eff-toggle]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var key = opt.getAttribute("data-eff-toggle");
        var id = opt.getAttribute("data-id");
        commit(function () {
          var list = e[key] || [];
          var idx = list.indexOf(id);
          if (idx >= 0) list.splice(idx, 1); else list.push(id);
          e[key] = list;
        });
      });
    });

    var pvsBtn = root.querySelector("[data-eff-scroll-pvs]");
    if (pvsBtn) pvsBtn.addEventListener("click", function () {
      var out = document.getElementById("pcm-out");
      if (out) out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    paint();

    function paint() {
      root.querySelectorAll("[data-eff-field]").forEach(function (f) {
        var key = f.getAttribute("data-eff-field");
        if (f.value !== String(e[key] || "")) f.value = e[key] || "";
      });
      var zoneLabel = root.querySelector("[data-eff-zone-label]");
      if (zoneLabel) zoneLabel.textContent = e.zone ? "Lokalisation: " + e.zone : "Bitte Region anklicken";
      root.querySelectorAll("[data-zone]").forEach(function (z) {
        z.classList.toggle("sel", z.getAttribute("data-zone") === e.zone);
      });
      root.querySelectorAll('[data-eff-card]').forEach(function (card) {
        if (card.getAttribute("data-eff-static") === "1") return;
        var group = card.getAttribute("data-eff-card");
        card.classList.toggle("sel", (e[group] || []).indexOf(card.getAttribute("data-id")) !== -1);
      });
      root.querySelectorAll("[data-eff-toggle]").forEach(function (opt) {
        var key = opt.getAttribute("data-eff-toggle");
        opt.classList.toggle("sel", (e[key] || []).indexOf(opt.getAttribute("data-id")) !== -1);
      });
      var box = root.querySelector("[data-eff-result]");
      if (box) {
        var txt = befundText(e);
        box.innerHTML = hasText(txt)
          ? '<div class="box bx-green"><div class="lbl">Beschreibung</div>' + esc(txt) + '</div>'
          : '<div class="box bx-orange"><div class="lbl">Noch leer</div>Bitte oben Lokalisation, Effloreszenz(en) und Merkmale auswählen.</div>';
      }
    }
  }

  /* -------- PVS-Baustein -------- */
  function baustein(s) {
    var e = effState(s);
    var BE = befundText(e);
    return { AN: "", BE: BE, TH: "", LD: "" };
  }

  /* -------- Styles fuer Beispielbilder (einmalig injiziert) -------- */
  if (typeof document !== "undefined" && document.head && !document.getElementById("derm-eff-styles")) {
    var st = document.createElement("style");
    st.id = "derm-eff-styles";
    st.textContent =
      ".derm-figure{margin:8px 0 0;padding:0}" +
      ".derm-img{display:block;width:100%;height:168px;object-fit:contain;background:#f4efe9;" +
      "border:1px solid #e2d7ca;border-radius:6px;cursor:zoom-in}" +
      ".derm-figcap{font-size:10px;line-height:1.35;color:#8a7d70;margin-top:3px;word-break:break-word}" +
      ".derm-figcap a{color:#8a7d70;text-decoration:underline}";
    document.head.appendChild(st);
  }

  PCM.registerSOP({
    id: "effloreszenzen",
    titel: "Effloreszenzen & Befundbeschreibung",
    untertitel: "Wie man einen Hautbefund dermatologisch beschreibt — mit Erklärung der Fachbegriffe",
    icon: "EFFL",
    farbe: "#6C3F2A",
    version: "1.1",
    stand: "12.07.2026",
    bereich: "Dermatologie",
    kategorie: "Effloreszenzenlehre",
    leitlinie: "Dermatologische Grundlagen: Primär-/Sekundäreffloreszenzen und Deskriptoren",
    delegationshinweis: "Reines Beschreibungs- und Nachschlagemodul. Es dient der strukturierten Dokumentation der Morphologie — keine Diagnosestellung; die ärztliche Bewertung erfolgt gesondert.",
    initialState: {
      eff: {
        zone: "", lok: "", groesse: "", freitext: "",
        primaer: [], sekundaer: [], farbe: [], begrenzung: [],
        form: [], anordnung: [], verteilung: [], oberflaeche: [], palpation: []
      }
    },
    schritte: [
      { nr: 1, titel: "Grundlagen: Befund systematisch beschreiben", rolle: "Lernmodul", rolleStil: "blue", farbe: "#6C3F2A", offen: true,
        elemente: [{ typ: "effloreszenz", id: "eff-anleitung", ansicht: "anleitung", render: render, wire: wire }] },
      { nr: 2, titel: "Lokalisation und Größe", rolle: "Dokumentation", rolleStil: "blue", farbe: "#6C3F2A",
        elemente: [{ typ: "effloreszenz", id: "eff-lokalisation", ansicht: "lokalisation", render: render, wire: wire }] },
      { nr: 3, titel: "Primäreffloreszenzen", rolle: "Befund", rolleStil: "blue", farbe: "#6C3F2A",
        elemente: [{ typ: "effloreszenz", id: "eff-primaer", ansicht: "primaer", render: render, wire: wire }] },
      { nr: 4, titel: "Sekundäreffloreszenzen", rolle: "Befund", rolleStil: "blue", farbe: "#6C3F2A",
        elemente: [{ typ: "effloreszenz", id: "eff-sekundaer", ansicht: "sekundaer", render: render, wire: wire }] },
      { nr: 5, titel: "Beschreibungsmerkmale (Deskriptoren)", rolle: "Befund", rolleStil: "blue", farbe: "#6C3F2A",
        elemente: [{ typ: "effloreszenz", id: "eff-merkmale", ansicht: "merkmale", render: render, wire: wire }] },
      { nr: 6, titel: "Glossar: Reaktionsmuster & Begriffe", rolle: "Lernmodul", rolleStil: "blue", farbe: "#6C3F2A",
        elemente: [{ typ: "effloreszenz", id: "eff-glossar", ansicht: "glossar", render: render, wire: wire }] },
      { nr: 7, titel: "Befund und PVS-Dokumentation", rolle: "Dokumentation", rolleStil: "green", farbe: "#1E8449",
        elemente: [{ typ: "effloreszenz", id: "eff-befund", ansicht: "befund", render: render, wire: wire }] }
    ],
    baustein: baustein
  });
})();
