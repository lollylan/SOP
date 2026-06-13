/*
   addons.js - MANIFEST
   Diese Datei legt fest, welche Add-ons das Framework laedt.

   Neue SOP-Datei in den Ordner sops/ legen und unten in die Liste
   "sops" eine Zeile ergaenzen. Reihenfolge hier = Reihenfolge in der
   zweiten Spalte innerhalb des jeweiligen Bereichs.
*/
window.PCM_ADDONS = {
  praxis: 'config/praxis.js',
  pvsTemplate: 'config/pvs-template.js',

  sops: [
    'sops/sop-torwache.js',
    'sops/akut-schattenstaub-husten.js',
    'sops/akut-drachenrauch-reizung.js',
    'sops/akut-trollsplitter-prellung.js',
    'sops/akut-elbenlicht-ueberblendung.js',
    'sops/akut-nebelmoor-taumel.js',
    'sops/akut-runenbrand-hand.js',
    'sops/chronisch-alte-eichenmuedigkeit.js',
    'sops/chronisch-zwergenhammer-gelenkknarren.js',
    'sops/chronisch-mondphasen-schlafgang.js',
    'sops/chronisch-silberschuppen-hautglanz.js',
    'sops/score-schattenlast.js',
    'sops/score-drachenrauch.js',
    'sops/score-elbenlicht.js',
    'sops/score-zwergenhammer.js',
    'sops/score-nebelmoor.js',
    'sops/score-runenbrand.js',
    'sops/score-mondphase.js',
    'sops/score-silberschuppen.js',
    'sops/score-waldlaeufer.js',
    'sops/score-halblingsrast.js',
    'sops/score-seherkugel.js'
  ]
};
