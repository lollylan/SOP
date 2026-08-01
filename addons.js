/*
   addons.js - MANIFEST
   Diese Datei legt fest, welche Add-ons das Framework lädt.

   Neue SOP-Datei in den Ordner sops/ legen und unten in die Liste
   "sops" eine Zeile ergänzen. Reihenfolge hier = Reihenfolge in der
   zweiten Spalte innerhalb des jeweiligen Bereichs.
*/
window.PCM_ADDONS = {
  praxis: 'config/praxis.js',
  pvsTemplate: 'config/pvs-template.js',

  sops: [
    'sops/startseite.js',
    'sops/sop-telefontriage.js',
    'sops/sop-hitze-medikation.js',
    'sops/sop-ruecken.js',
    'sops/sop-ellbogen.js',
    'sops/sop-schulter.js',
    'sops/sop-huefte.js',
    'sops/sop-knie.js',
    'sops/sop-hwi.js',
    'sops/sop-kopfschmerz.js',
    'sops/sop-magenschmerz.js',
    'sops/sop-obere-atemwege.js',
    'sops/sop-otalgie.js',
    'sops/sop-gastroenteritis.js',
    'sops/sop-guertelrose.js',
    'sops/sop-onychomykose.js',
    'sops/sop-konjunktivitis.js',
    'sops/sop-urtikaria.js',
    'sops/sop-chroniker.js',
    'sops/patientenaufklaerungen-deximed.js',
    'sops/sop-effloreszenzen.js',
    'sops/sop-dermatoskopie.js',
    'sops/sop-sono-abdomen.js',
    'sops/sop-sono-schilddruese.js',
    'sops/sop-orthopaedie.js',
    'sops/sop-ekg.js',
    'sops/scores-infektiologie.js',
    'sops/scores-kardiologie.js',
    'sops/scores-schlafmedizin.js',
    'sops/scores-psychiatrie-sucht.js',
    'sops/scores-nephrologie.js',
    'sops/scores-neurologie.js',
    'sops/scores-hepatologie.js',
    'sops/scores-angiologie-pneumologie.js',
    'sops/scores-osteologie.js',
    'sops/scores-hno.js',
    'sops/scores-urologie.js',
    'sops/scores-unfallchirurgie.js'
  ]
};
