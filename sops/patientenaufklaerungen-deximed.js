(function () {
  const BEREICH = 'Patientenaufklaerungen';
  const FARBE = '#1E8449';

  const links = [
    // Allergologie
    ['allergie', 'Allergie', 'Allergologie', 'https://deximed.de/home/klinische-themen/allergien/patienteninformationen/allergien-allgemeines/allergie'],
    ['allergische-rhinitis', 'Allergische Rhinitis (Heuschnupfen)', 'Allergologie', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/nase/allergische-rhinitis-heuschnupfen'],
    ['hyposensibilisierung', 'Allergie, Hyposensibilisierung', 'Allergologie', 'https://deximed.de/home/klinische-themen/allergien/patienteninformationen/allergien-allgemeines/allergie-hyposensibilisierung'],
    ['insektenstichallergie', 'Allergie gegen Insektenstiche', 'Allergologie', 'https://deximed.de/home/klinische-themen/allergien/patienteninformationen/verschiedene-allergien/allergie-gegen-insektenstiche'],

    // Augenheilkunde
    ['bindehaut-infektioes', 'Bindehautentzündung, infektiöse', 'Augenheilkunde', 'https://deximed.de/home/klinische-themen/augen/patienteninformationen/aeusseres-auge/bindehautentzuendung-konjunktivitis-infektioese'],
    ['bindehaut-allergisch', 'Bindehautentzündung, allergische', 'Augenheilkunde', 'https://deximed.de/home/klinische-themen/augen/patienteninformationen/aeusseres-auge/bindehautentzuendung-konjunktivitis-allergische'],
    ['augenroetung', 'Augenrötung', 'Augenheilkunde', 'https://deximed.de/home/klinische-themen/augen/patienteninformationen/was-kann-das-sein/augenroetung'],
    ['fremdkoerper-auge', 'Augenverletzung durch Fremdkörper', 'Augenheilkunde', 'https://deximed.de/home/klinische-themen/augen/patienteninformationen/augenverletzungen/augenverletzung-durch-fremdkoerper'],

    // Dermatologie
    ['neurodermitis', 'Atopisches Ekzem (Neurodermitis)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/ekzeme/atopisches-ekzem-neurodermitis'],
    ['psoriasis', 'Psoriasis (Schuppenflechte)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/schuppiger-ausschlag-z.b.-exzem-und-psoriasis/psoriasis-schuppenflechte'],
    ['urtikaria', 'Nesselsucht (Urtikaria)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/juckende-hauterkrankungen/nesselsucht-urtikaria'],
    ['guertelrose', 'Gürtelrose (Zoster)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/blasen-und-blaeschen/guertelrose-zoster'],
    ['rosazea', 'Rosazea', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/roter-ausschlag/rosazea'],
    ['akne', 'Akne', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/eitriger-ausschlag/akne'],
    ['skabies', 'Skabies (Krätze)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/juckende-hauterkrankungen/skabies-kraetze'],
    ['nagelpilz', 'Nagelpilz', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/nagelerkrankungen/nagelpilz'],
    ['fusspilz', 'Fußpilz', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/schuppiger-ausschlag-z.b.-exzem-und-psoriasis/fusspilz'],
    ['erysipel', 'Wundrose (Erysipel)', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/roter-ausschlag/wundrose-erysipel'],
    ['wunde-schlecht-heilend', 'Wunden, schlecht heilende', 'Dermatologie', 'https://deximed.de/home/klinische-themen/haut/patienteninformationen/was-kann-das-sein/wunde-schlecht-heilende'],

    // Gastroenterologie
    ['reflux', 'Refluxkrankheit (Sodbrennen)', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/speiseroehre/refluxkrankheit-sodbrennen'],
    ['gastritis', 'Magenschleimhautentzündung (Gastritis)', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/magen/magenschleimhautentzuendung-gastritis'],
    ['reizdarm', 'Reizdarmsyndrom', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/dickdarm/reizdarmsyndrom'],
    ['akute-diarrhoe', 'Diarrhö (Durchfall), akute', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/was-kann-das-sein/diarrhoe-durchfall-akute'],
    ['obstipation', 'Verstopfung (Obstipation)', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/was-kann-das-sein/verstopfung-obstipation'],
    ['uebelkeit-erbrechen', 'Übelkeit und Erbrechen', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/was-kann-das-sein/uebelkeit-erbrechen'],
    ['akutes-abdomen', 'Bauchschmerzen, akute', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/was-kann-das-sein/bauchschmerzen-akute-akutes-abdomen'],
    ['gallensteine', 'Gallensteine', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/gallenwege/gallensteine'],
    ['divertikulitis', 'Divertikulitis', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/dickdarm/divertikulitis'],
    ['nafld', 'Fettleber, nicht-alkoholische', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/leber/fettleber-nicht-alkoholische'],
    ['haemorrhoiden', 'Hämorrhoiden und Analvenenthrombose', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/enddarm/haemorrhoiden-und-analvenenthrombose'],
    ['laktoseintoleranz', 'Laktoseunverträglichkeit', 'Gastroenterologie', 'https://deximed.de/home/klinische-themen/magen-darm-trakt/patienteninformationen/duenndarm/laktoseunvertraeglichkeit'],

    // Geriatrie
    ['alzheimer', 'Alzheimer-Demenz', 'Geriatrie', 'https://deximed.de/home/klinische-themen/geriatrie/patienteninformationen/demenz/alzheimer-demenz'],
    ['demenz-angehoerige', 'Demenz, Hilfen für Angehörige', 'Geriatrie', 'https://deximed.de/home/klinische-themen/geriatrie/patienteninformationen/demenz/demenz-hilfen-und-unterstuetzung-fuer-angehoerige'],
    ['inkontinenz-alter', 'Harninkontinenz bei älteren Menschen', 'Geriatrie', 'https://deximed.de/home/klinische-themen/geriatrie/patienteninformationen/alterserkrankungen/inkontinenz-bei-aelteren-menschen'],

    // HNO
    ['halsschmerzen', 'Halsschmerzen', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/was-kann-das-sein/halsschmerzen'],
    ['tonsillitis', 'Mandelentzündung (Tonsillitis)', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/rachen/mandelentzuendung'],
    ['sinusitis-akut', 'Nasennebenhöhlenentzündung, akute', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/nebenhoehlen/nasennebenhoehlenentzuendung-sinusitis-akut'],
    ['ohrenschmerzen', 'Ohrenschmerzen', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/was-kann-das-sein/ohrenschmerzen'],
    ['otitis-media', 'Mittelohrentzündung, akute', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/mittelohr/mittelohrentzuendung-akute'],
    ['otitis-externa', 'Gehörgangsentzündung', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/aeusseres-ohr-und-gehoergang/gehoergangsentzuendung-otitis-externa'],
    ['nase-verstopft', 'Nase, verstopfte', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/was-kann-das-sein/nase-verstopfte'],
    ['schlafapnoe', 'Schlafapnoe-Syndrom', 'HNO', 'https://deximed.de/home/klinische-themen/hals-nase-ohren/patienteninformationen/verschiedene-krankheiten/schlafapnoe-syndrom'],

    // Infektiologie
    ['erkaeltung', 'Erkältung', 'Infektiologie', 'https://deximed.de/home/klinische-themen/infektionen/patienteninformationen/virusinfektionen/erkaeltung'],
    ['influenza', 'Grippe (Influenza)', 'Infektiologie', 'https://deximed.de/home/klinische-themen/infektionen/patienteninformationen/virusinfektionen/grippe-influenza'],
    ['fieber', 'Fieber', 'Infektiologie', 'https://deximed.de/home/symptome/patienteninformationen/fieber'],
    ['covid-19', 'COVID-19', 'Infektiologie', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/infektionen/coronavirus-sars-cov-2-covid-19-atemwegserkrankungen'],
    ['zeckenstich', 'Zeckenstich', 'Infektiologie', 'https://deximed.de/home/klinische-themen/infektionen/patienteninformationen/infektionen-allgemeines/zeckenstich'],
    ['borreliose', 'Borreliose nach Zeckenstich', 'Infektiologie', 'https://deximed.de/home/klinische-themen/infektionen/patienteninformationen/bakterielle-infektionen/lyme-borreliose-zeckenstich'],

    // Kardiologie / Gefäße
    ['hypertonie', 'Bluthochdruck (arterielle Hypertonie)', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/bluthochdruck-hypertonie/bluthochdruck-hyptertonie'],
    ['khk', 'Koronare Herzkrankheit, chronische', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/koronare-herzerkrankung/koronare-herzerkrankung-chronische'],
    ['herzinfarkt', 'Herzinfarkt', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/koronare-herzerkrankung/herzinfarkt'],
    ['herzinsuffizienz', 'Herzschwäche (Herzinsuffizienz)', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/verschiedene-erkrankungen/herzschwaeche-herzinsuffizienz'],
    ['vorhofflimmern', 'Vorhofflimmern', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/herzrhythmusstoerungen/vorhofflimmern'],
    ['brustschmerzen', 'Brustschmerzen', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/was-kann-das-sein/brustschmerzen'],
    ['herzrasen', 'Herzklopfen und Herzrasen', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/was-kann-das-sein/herzklopfen-und-herzrasen'],
    ['schlaganfall', 'Schlaganfall', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/schlaganfall/schlaganfall'],
    ['tia', 'Transitorische ischämische Attacke (TIA)', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/schlaganfall/transitorische-ischaemische-attacke-tia'],
    ['pavk', 'Periphere arterielle Verschlusskrankheit', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/gefaesserkrankungen/periphere-arterielle-verschlusskrankheit'],
    ['tvt', 'Venenthrombose, tiefe (TVT)', 'Kardiologie / Gefäße', 'https://deximed.de/home/klinische-themen/herz-gefaesse-kreislauf/patienteninformationen/gerinnungserkrankungen/Venenthrombose-tiefe-tvt'],

    // Lunge / Atemwege
    ['husten', 'Husten', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/was-kann-das-sein/husten'],
    ['akute-bronchitis', 'Bronchitis, akute', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/infektionen/bronchitis-akute'],
    ['pneumonie', 'Lungenentzündung (Pneumonie)', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/infektionen/lungenentzuendung-pneumonie'],
    ['asthma', 'Asthma', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/asthma/asthma'],
    ['asthmaanfall', 'Asthmaanfall bei Erwachsenen', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/asthma/asthmaanfall-bei-erwachsenen'],
    ['copd', 'COPD', 'Lunge / Atemwege', 'https://deximed.de/home/klinische-themen/lunge-atemwege/patienteninformationen/copd/copd'],

    // Neurologie
    ['kopfschmerzen', 'Kopfschmerzen', 'Neurologie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/was-kann-das-sein/kopfschmerzen'],
    ['migraene', 'Migräne', 'Neurologie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/kopfschmerzen/migraene'],
    ['spannungskopfschmerz', 'Spannungskopfschmerz', 'Neurologie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/kopfschmerzen/spannungskopfschmerz'],
    ['schwindel', 'Schwindel', 'Neurologie', 'https://deximed.de/home/symptome/patienteninformationen/schwindel'],
    ['lagerungsschwindel', 'Lagerungsschwindel, gutartiger', 'Neurologie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/verschiedene-krankheiten/gutartiger-lagerungsschwindel'],
    ['wadenkraempfe', 'Wadenkrämpfe, nächtliche', 'Neurologie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/kraempfe/wadenkraempfe-naechtliche'],

    // Niere / Harnwege
    ['hwi-frauen', 'Harnwegsinfekte bei Frauen', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/harnwegsinfektionen/harnwegsinfekte-bei-frauen'],
    ['hwi-maenner', 'Harnwegsinfekte bei Männern', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/harnwegsinfektionen/harnwegsinfekte-bei-maennern'],
    ['pyelonephritis', 'Nierenbeckenentzündung (Pyelonephritis)', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/harnwegsinfektionen/nierenbeckenentzuendung-pyelonephritis'],
    ['nierensteine', 'Harnsteine/Nierensteine', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/andere-nierenerkrankungen/harnsteine-nierensteine'],
    ['harninkontinenz-frauen', 'Harninkontinenz bei Frauen', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/harninkontinenz/harninkontinenz-bei-frauen'],
    ['ueberaktive-blase', 'Blase, überaktive', 'Niere / Harnwege', 'https://deximed.de/home/klinische-themen/niere-harnwege/patienteninformationen/harninkontinenz/ueberaktive-blase'],

    // Orthopädie
    ['rueckenschmerzen', 'Rückenschmerzen', 'Orthopädie', 'https://deximed.de/home/klinische-themen/physiotherapie-sportmedizin/patienteninformationen/was-kann-das-sein/rueckenschmerzen'],
    ['akute-rueckenschmerzen', 'Rückenschmerzen, akute', 'Orthopädie', 'https://deximed.de/home/klinische-themen/physiotherapie-sportmedizin/patienteninformationen/ruecken-nacken-und-brust/rueckenschmerzen-akute'],
    ['chronische-rueckenschmerzen', 'Rückenschmerzen, chronische', 'Orthopädie', 'https://deximed.de/home/klinische-themen/physiotherapie-sportmedizin/patienteninformationen/ruecken-nacken-und-brust/rueckenschmerzen-chronische'],
    ['nackenschmerzen', 'Nackenschmerzen', 'Orthopädie', 'https://deximed.de/home/klinische-themen/physiotherapie-sportmedizin/patienteninformationen/was-kann-das-sein/nackenschmerzen'],
    ['ischias', 'Bandscheibenvorfall, Ischiassyndrom', 'Orthopädie', 'https://deximed.de/home/klinische-themen/neurologie/patienteninformationen/wirbelsaeulen-und-rueckenmarksschaeden/bandscheibenvorfall-ischiassyndrom'],
    ['schulterschmerzen', 'Schulterschmerzen', 'Orthopädie', 'https://deximed.de/home/klinische-themen/physiotherapie-sportmedizin/patienteninformationen/was-kann-das-sein/schulterschmerzen'],
    ['knieschmerzen', 'Knieschmerzen', 'Orthopädie', 'https://deximed.de/home/klinische-themen/orthopaedie/patienteninformationen/knie/knieschmerzen'],
    ['kniearthrose', 'Kniegelenksarthrose', 'Orthopädie', 'https://deximed.de/home/klinische-themen/orthopaedie/patienteninformationen/knie/kniegelenksarthrose'],
    ['hueftarthrose', 'Hüftgelenksarthrose', 'Orthopädie', 'https://deximed.de/home/klinische-themen/orthopaedie/patienteninformationen/becken-huefte-und-oberschenkel/hueftgelenksarthrose'],
    ['gicht', 'Gicht', 'Orthopädie', 'https://deximed.de/home/klinische-themen/rheumatologie/patienteninformationen/verschiedene-krankheiten/gicht'],
    ['osteoporose', 'Osteoporose', 'Orthopädie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/knochenstoffwechsel/osteoporose-knochenschwund'],

    // Psychiatrie / Schlaf
    ['depression', 'Depression', 'Psychiatrie / Schlaf', 'https://deximed.de/home/klinische-themen/psychische-stoerungen/patienteninformationen/depression/depression'],
    ['angststoerung', 'Angststörung', 'Psychiatrie / Schlaf', 'https://deximed.de/home/klinische-themen/psychische-stoerungen/patienteninformationen/angststoerungen/angststoerung'],
    ['panikstoerung', 'Panikstörung', 'Psychiatrie / Schlaf', 'https://deximed.de/home/klinische-themen/psychische-stoerungen/patienteninformationen/angststoerungen/panikstoerung'],
    ['schlafstoerungen', 'Schlafstörungen', 'Psychiatrie / Schlaf', 'https://deximed.de/home/klinische-themen/psychische-stoerungen/patienteninformationen/schlafstoerungen/schlafstoerungen'],
    ['schlaf-ratschlaege', 'Schlaf, Ratschläge', 'Psychiatrie / Schlaf', 'https://deximed.de/home/klinische-themen/psychische-stoerungen/patienteninformationen/schlafstoerungen/schlaf-ratschlaege'],

    // Stoffwechsel / Endokrinologie
    ['diabetes-typ-2', 'Diabetes, Typ 2', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/diabetes/typ-2-diabetes'],
    ['hypoglykaemie', 'Hypoglykämie (Unterzuckerung)', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/diabetes/hypoglykaemie-unterzuckerung'],
    ['hyperglykaemie', 'Hyperglykämie (Überzuckerung)', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/diabetes/hyperglykaemie-ueberzuckerung'],
    ['diabetischer-fuss', 'Diabetischer Fuß, Charcot-Fuß', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/diabetes/diabetischer-fuss-charcot-fuss'],
    ['fettstoffwechsel', 'Blutfettwerte, hohe (Hyperlipidämie)', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/fettstoffwechselstoerungen/blutfettwerte-hohe-hyperlipidaemie'],
    ['schilddruesenunterfunktion', 'Schilddrüsenunterfunktion', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/schilddruese/schilddruesenunterfunktion-hypothyreose'],
    ['schilddruesenueberfunktion', 'Schilddrüsenüberfunktion', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/endokrinologie-stoffwechsel/patienteninformationen/schilddruese/schilddruesenueberfunktion-hyperthyreose'],
    ['eisenmangel', 'Eisenmangelanämie', 'Stoffwechsel / Endokrinologie', 'https://deximed.de/home/klinische-themen/blut/patienteninformationen/anaemien/eisenmangelanaemie'],

    // Suchtmedizin
    ['rauchen-schaeden', 'Rauchen, Gesundheitsschäden', 'Suchtmedizin', 'https://deximed.de/home/klinische-themen/suchtmedizin/patienteninformationen/tabak/rauchen-gesundheitsschaeden'],
    ['rauchentwoehnung', 'Raucherentwöhnung', 'Suchtmedizin', 'https://deximed.de/home/klinische-themen/suchtmedizin/patienteninformationen/tabak/rauchentwoehnung'],
    ['alkoholabhaengigkeit', 'Alkohol - Missbrauch oder Abhängigkeit?', 'Suchtmedizin', 'https://deximed.de/home/klinische-themen/suchtmedizin/patienteninformationen/alkohol/alkoholabhaengigkeit'],

    // Urologie / Männergesundheit
    ['bph', 'Prostatavergrößerung, gutartige', 'Urologie / Männergesundheit', 'https://deximed.de/home/klinische-themen/maennergesundheit/patienteninformationen/prostata/prostatavergroesserung-gutartige'],
    ['prostatitis', 'Prostatitis, akute', 'Urologie / Männergesundheit', 'https://deximed.de/home/klinische-themen/maennergesundheit/patienteninformationen/prostata/prostatitis-akute'],
    ['psa-erhoeht', 'PSA-Wert, erhöhter', 'Urologie / Männergesundheit', 'https://deximed.de/home/klinische-themen/maennergesundheit/patienteninformationen/prostata/psa-wert-erhoehter'],

    // Palliativmedizin
    ['palliativmedizin', 'Palliativmedizin', 'Palliativmedizin', 'https://deximed.de/home/klinische-themen/palliativmedizin/patienteninformationen/lindernde-behandlung/palliativmedizin'],
    ['palliative-schmerztherapie', 'Schmerztherapie, palliative', 'Palliativmedizin', 'https://deximed.de/home/klinische-themen/palliativmedizin/patienteninformationen/die-letzte-zeit-zu-hause/schmerztherapie-palliative'],
    ['palliativ-atemnot', 'Atembeschwerden bei Krebserkrankung', 'Palliativmedizin', 'https://deximed.de/home/klinische-themen/palliativmedizin/patienteninformationen/lindernde-behandlung/atembeschwerden-bei-krebserkrankung'],
    ['palliativ-obstipation', 'Verstopfung, Palliativmedizin', 'Palliativmedizin', 'https://deximed.de/home/klinische-themen/palliativmedizin/patienteninformationen/lindernde-behandlung/verstopfung-palliativmedizin']
  ];

  links.forEach(function (item) {
    PCM.registerSOP({
      id: 'pat-' + item[0],
      titel: item[1],
      untertitel: 'Deximed Patienteninformation',
      icon: 'Info',
      farbe: FARBE,
      version: '1.0',
      stand: '14.06.2026',
      bereich: BEREICH,
      fachbereich: item[2],
      kategorie: item[2],
      link: item[3]
    });
  });
})();
