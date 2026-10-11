// The review on each car's page, by slug. Written by scripts/car-reviews.ts,
// and read in the pull request like any other change to the data: an entry
// can be edited by hand, and a run keeps it until its car's figures change.
// carReviews.test.ts fails while a car has none, or one out of date.

export interface CarReview {
  paragraphs: ReadonlyArray<string>
  /** The figures it was written from, as reviewFactsKey hashes them */
  facts: string
  /** The model that wrote it, and how hard it thought; none for one written by hand */
  model?: string
}

const carReviews: Readonly<Record<string, CarReview>> = {
  'audi-a6-e-tron-sportback-quattro': {
    paragraphs: [
      'Audi A6 e-tron Sportback quattro sameinar mikla drægni og fjórhjóladrif við sneggri hröðun og meira afl en gengur og gerist í þessum verðflokki. Fyrir þá sem aka reglulega milli landshluta á öllum árstímum þýðir þetta ríflegt öryggi í vetrarkulda án þess að fórna afli eða veggripi.',
      'Hann er meðal þeirra allra langdrægustu af rafbílum hér á landi og hleður hraðar en flestir í sínum verðflokki, sem heldur hleðslustoppum á langferðum í lágmarki. Þótt hann sé dýrari en flestir rafbílar er hann meðal þeirra ódýrustu á hvern kílómetra drægni miðað við verð, svo kaupandinn fær mikið fyrir peninginn.',
      'Á móti er þetta lágur fólksbíll frekar en hár jepplingur. Mercedes-Benz CLA 350 4MATIC er til að mynda 200.000 kr. ódýrari og hefur 58 km meiri drægni, ásamt um 5% styttri hleðslustoppum, en er talsvert aflminni. Ef hærri sætisstaða skiptir meira máli gæti Audi Q6 e-tron hentað betur, þótt sá sé 500.000 kr. dýrari og hafi 87 km minni drægni.',
      'Bíllinn hentar sérstaklega vel þeim sem vilja rennilegan og kraftmikinn ferðabíl með traustu fjórhjóladrifi sem ræður léttilega við krefjandi íslenskan vetrarakstur.',
    ],
    facts: '528cb113b364',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er stór og aflmikill rafknúinn langbakur með fjórhjóladrifi. Hann hentar einkum þeim sem aka mikið milli landshluta og þurfa mikið rými í krefjandi vetraraðstæðum án þess að velja hefðbundinn jeppling.',
      'Drægnin er meðal þeirra allra mestu hér á landi, sem veitir mikið öryggi í vetrarkulda og langkeyrslu. Hraðhleðslan er einnig meðal þeirra hröðustu af öllum rafbílum, sem styttir stopp á ferðalögum til muna. Þá er bíllinn sneggri en flestir í sínum verðflokki og býður upp á 2.100 kg dráttargetu og 502 lítra farangursrými.',
      'Hann er þó dýrari en flestir af rafbílum á markaðnum. Ef hámarksdrægni og hleðsla skipta öllu máli hefur Audi A6 e-tron Avant quattro 69 km minni drægni en Mercedes-Benz CLA Shooting Brake 350 4MATIC og er 6,4 km/mín hægari, þótt sá síðarnefndi sé 200.000 kr. dýrari. Þá hefur hann 35 kW minna afl en Volvo EX60 P10, sem er 100.000 kr. dýrari.',
      'Þetta eru góð kaup fyrir þá sem vilja öflugan langferðabíl með mikla dráttargetu og hraða hleðslu á ferðalögum. Fyrir þá sem vilja háa sætisstöðu eða leita að hagkvæmari kosti er skynsamlegra að líta annað.',
    ],
    facts: '5124bada378e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er lágur og kraftmikill lúxussportbíll með fjórhjóladrifi, hannaður fyrir þá sem leita að sportlegri akstursupplifun og glæsilegu yfirbragði frekar en miklu rými eða veghæð.',
      'Afl og hröðun eru hans helstu styrkleikar, enda er hann meðal allra sneggstu og aflmestu rafbíla sem fást hér á landi. Fjórhjóladrifið skilar þessum mikla krafti örugglega í göturnar í hálku og snjó, og á ferðalögum milli landshluta hleður hann hraðar en flestir rafbílar.',
      'Á móti kemur að hann er meðal þeirra dýrustu og drífur styttra en flestir í sínum verðflokki. Fyrir þá sem vilja meira hagnýtt pláss og færri stopp býður Audi SQ6 e-tron upp á 111 km meiri drægni á sama verði, á meðan Porsche Cayenne gefur 155 km meiri drægni og um 30% styttri hleðslustopp.',
      'Þetta er fyrst og fremst bíll sem maður velur með hjartanu fyrir hönnun og sportlega akstursgleði, frekar en sem hagnýtan ferðabíl fyrir fjölskylduna.',
    ],
    facts: '1a0ffdfe8771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro býður upp á klassíska lúxustilfinningu og þrautreynt quattro-fjórhjóladrif, sem hentar þeim sem setja vandaðan frágang og öruggt grip í snjó og hálku í fyrsta sæti.',
      'Í daglegum akstri er hann þægilegur og hljóðlátur ferðafélagi sem skilar sínu vel í vetrarfærð. Hann hefur líka forskot í hleðslu á Nissan Ariya e-4ORCE sem þarf um 40% lengri hleðslustopp, auk þess sem Toyota bZ4X Touring AWD er 200.000 kr. dýrari og með 7,3 kWh minni rafhlöðu.',
      'Á móti kemur að bíllinn er dýrari á hvern kílómetra drægni en flestir, drífur styttra og hleður hægar en flestir í sínum verðflokki. Smart #5 Brabus er til dæmis 100.000 kr. dýrari en býður upp á 52 km meiri drægni og um 40% styttri hleðslustopp, á meðan Nissan Ariya e-4ORCE er 500.000 kr. ódýrari kostur.',
      'Þetta er traustur og vandaður bíll fyrir þá sem meta Audi-gæði og fjórhjóladrif meira en tölur á blaði.',
    ],
    facts: '306c55238898',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er hár og veglegur lúxusjeppi sem hentar sérstaklega vel fjölskyldum sem vilja hefðbundna jeppastöðu, gott útsýni yfir umferðina og mikið öryggi í hversdagsakstri. Hann sker sig frá lágum skutbílum með hárri setstöðu og hinu þekkta quattro fjórhjóladrifi sem reynist afbragðsvel í snjó og krefjandi færð á íslenskum vegum.',
      'Drægnin er meðal þess allra besta sem gerist af rafbílum hér á landi og hann drífur lengra en flestir í sínum verðflokki. Það veitir mikið öryggi í langferðum milli landshluta yfir vetrarmánuðina. Á ferðalögum hleður hann hraðar en flestir bílar á markaðnum, þótt hleðsluhraðinn sé í meðallagi miðað við svipað dýra bíla.',
      'Á móti kemur að hann er dýrari en flestir rafbílar og snerpan er minni en hjá flestum keppinautum á svipuðu verði. Ef meiri hröðun og um 15% styttri hleðslustopp skipta máli er Volvo EX60 P10 athyglisverður kostur, eða Audi A6 e-tron Avant quattro ef lægri skutbíll með enn meiri drægni heillar.',
      'Fyrir þá sem leita að hábyggðum lúxusjeppa með mikla vetrardrægni og öruggt grip er Audi Q6 e-tron afar sannfærandi kostur.',
    ],
    facts: 'c719fcff91c1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er stór og sportlegur lúxusjepplingur með fjórhjóladrifi sem hentar vel fjölskyldum og ferðafólki sem þarf mikið pláss og örugga drægni við allar íslenskar aðstæður.',
      'Drægnin er meðal þeirra langdrægustu af rafbílum hér á landi og dugar vel í vetrarkulda milli landshluta, auk þess sem hann er meðal þeirra sem hlaða hraðast. Hann nýtist sérlega vel í langferðir með 2.400 kg dráttargetu, 511 lítra skotti og 64 lítra framskotti.',
      'Á móti kemur að bíllinn er dýrari en flestir rafbílar og hröðunin er hægari en flestir bjóða upp á í svipuðum verðflokki. Sá sem leitar að meiri snerpu og lægra verði ætti frekar að skoða Audi A6 e-tron Avant quattro, en Q6 er 800.000 kr. dýrari, með 37 km minni drægni og 1,4 s hægari upp í hundraðið.',
      'Hann eru góð kaup fyrir þá sem vilja hábyggðan ferðabíl sem ræður léttilega við þungan eftirvagn í vetrarfærð, en síður fyrir þá sem horfa í verðmiðann og vilja sem mesta hröðun fyrir peningana.',
    ],
    facts: 'a587638043c0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er kröftugur lúxusjepplingur sem er sniðinn að þeim sem leita að mikilli snerpu og sportlegum aksturseiginleikum í fjölskyldubíl. Hann er sneggri en flestir bílar í sínum verðflokki og fjórhjóladrifið tryggir öruggt og stöðugt grip í snjó, hálku og krefjandi vetrarfærð hér á landi.',
      'Af öllum rafbílum á landinu drífur hann lengra en flestir og hleður hraðar, sem gerir ferðalög milli landshluta þægileg og átakalaus. Jafnvel þegar íslenskur vetrarkuldi dregur eitthvað úr drægninni dugar rafhlaðan vel í flestar dagsferðir, og mikil hröðun gerir framúrakstur lipran og öruggan.',
      'Á móti kemur að drægnin er aðeins í meðallagi í þessum dýra flokki og bíllinn er dýrari á hvern kílómetra drægni en flestir jafnokar hans. Ef hámarksdrægni skiptir meira máli býður BMW iX xDrive 60 Sport upp á 103 km meiri drægni, þótt hleðslustoppin séu um 40% lengri. Porsche Cayenne er líka ódýrari kostur sem býður upp á 44 km meiri drægni og um 30% styttri hleðslustopp.',
      'Audi SQ6 e-tron hentar fyrst og fremst þeim sem setja mikil afköst, viðbragð og sportlegan akstur í öndvegi frekar en að fá sem flesta kílómetra fyrir peninginn.',
    ],
    facts: '6be7cb5413e8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'Ólíkt samkeppnisaðilunum í þessum verðflokki, sem eru allir hávaxnir jepplingar, er BMW i4 lágur fólksbíll. Hann hentar þeim sem vilja lipran og hefðbundinn akstursbíl frekar en stóran fjölskyldujeppa.',
      'Af öllum rafbílum hér á landi er hann sneggri og aflmeiri en flestir, sem veitir mikið öryggi við framúrakstur. Fjórhjóladrifið tryggir gott veggrip í snjó og hálku, auk þess sem 1.600 kg dráttargetan ræður vel við flestar kerrur á meðan Lexus RZ 350e má til dæmis aðeins draga 750 kg.',
      'Á móti kemur að í sínum verðflokki drífur hann styttra en flestir og hleður hægar. Fyrir þá sem ferðast mikið milli landshluta er Audi Q6 e-tron Sportback hagstæðari kostur sem býður upp á 91 km meiri drægni, um 35% styttri hleðslustopp og 511 lítra farangursrými á móti 470 lítrum í BMW.',
      'Bíllinn er góður kostur fyrir þá sem leita að snörpum og öflugum bíl með aldrifi fyrir daglegar ferðir, en síður fyrir þá sem þurfa mikið flutningsrými eða sem fæst hleðslustopp á lengri leiðum.',
    ],
    facts: 'c8b9a2c3cd23',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er meðal sneggstu og aflmestu bílanna á listanum, líka miðað við bíla á svipuðu verði. Hann er dýr og drífur styttra en flestir á sama verði, svo hann er fyrst og fremst fyrir þá sem vilja akstursánægju.',
    ],
    facts: '8890a1c90b99',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er afturhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi að afli og hröðun.',
    ],
    facts: '1c309ab62c34',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er meðal dýrustu, sneggstu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: 'eff3ad7deb4c',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og drífur lengra en flestir. Miðað við bíla á svipuðu verði er hann þó aflminni og hleður hægar en flestir.',
    ],
    facts: '882067b3bf42',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er meðal þeirra langdrægustu, með 701 km, og með einni af stærstu rafhlöðunum á listanum. Hann er dýr, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'd79d0f40d4d1',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er þéttur og vandaður jepplingur sem býður upp á þýska úrvalsstaðla á óvenju hagstæðu verði. Hann höfðar einkum til þeirra sem leita að fágaðri akstursupplifun og þægilegum ferðabíl án þess að greiða hefðbundið lúxusverð.',
      'Stærsti styrkleikinn er hve mikil drægni fæst fyrir peninginn, en bíllinn er ódýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Hann fer vel með rafmagnið og drægnin dugar hæglega milli landshluta þótt rafhlaðan sé minni en í flestum sambærilegum bílum. Hleðslustoppin á langferðum eru einnig mun styttri en hjá BYD Seal U.',
      'Aðrir bílar bjóða þó upp á meiri kraft, enda er hann aflminni og hægari en flestir á svipuðu verði. Hann er jafnframt framhjóladrifinn, þannig að ef snjóþungir vetrarvegir og öflugra grip ráða för er Subaru Uncharted með fjórhjóladrif og mun sneggri á nákvæmlega sama verði.',
      'Fyrir ökumenn sem leggja áherslu á vönduð vinnubrögð og mikla drægni fyrir hvern eyddan krónupening er iX1 hins vegar afar skynsamlegur kostur.',
    ],
    facts: '5170bc1d9003',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Rafhlaðan er með þeim minnstu miðað við bíla á svipuðu verði, sem kemur niður á langferðum.',
    ],
    facts: '7b462734f436',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er meðal þeirra langdrægustu, með 637 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '16731bcab88f',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er kraftmikill lúxusjepplingur með fjórhjóladrifi sem er sniðinn fyrir fólk sem gerir miklar kröfur um þægindi og aksturseiginleika. Hann hentar sérstaklega vel fyrir þá sem ferðast reglulega milli landshluta og vilja geta treyst á bílinn í hvers kyns vetraraðstæðum.',
      'Helsti styrkur hans felst í gríðarlegri drægni og einni stærstu rafhlöðu sem völ er á hér á landi. Jafnvel í nístingskulda á veturna dugar hún léttilega í langferðir án hleðslukvíða. Hann er líka meðal þeirra bíla sem hlaða hvað hraðast, sem þýðir sérstaklega stutt stopp á ferðalögum, og í sínum verðflokki er hann meðal þeirra ódýrustu á hvern kílómetra drægni.',
      'Hann er þó dýrari en flestir rafbílar og hröðunin er aðeins í meðallagi miðað við verðið. Sem dæmi er Volvo EX60 P12 100.000 kr. ódýrari, 1 s sneggri í hundraðið og með um 5% styttri hleðslustopp. Fyrir þá sem leggja áherslu á hefðbundin gæði BMW, framúrskarandi langdrægni og öruggt ferðafrelsi allan ársins hring er iX3 engu að síður mjög traustur kostur.',
    ],
    facts: 'fb86aa548d6e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er lipur og nettur fimm sæta hlaðbakur sem hentar sérstaklega vel í innanbæjarakstur og daglegan skutl. Hann er lipur í þröngum götum og auðveldur í stæði, en lág bygging og framhjóladrif gera hann fyrst og fremst að malbiks- og borgarbíl sem hentar síður í mikinn snjó eða á grófa vegi.',
      'Bíllinn er meðal þeirra ódýrustu af rafbílum hér á landi og gefur mikið fyrir peninginn. Í sínum verðflokki er hann ódýrari á hvern kílómetra drægni en flestir og skartar stærri rafhlöðu en gengur og gerist. Hann er jafnframt meðal þeirra sneggstu á svipuðu verði, sem gerir hann óvænt kvikan í daglegri umferð.',
      'Helsti gallinn er hraðhleðslan, en bíllinn er meðal þeirra sem hlaða hægast, bæði í sínum verðflokki og af öllum rafbílum. Á langferðum krefst hann því meiri þolinmæði en keppinautar á borð við Skoda Epiq 55, sem býður upp á um 45% styttri hleðslustopp. Ef fólk þarf meira pláss fyrir fjölskylduna er Leapmotor C10 Pro auk þess mun stærri kostur á sama verði.',
      'Sem lipur og snarpur hversdagsbíll á lágu verði kemur Dolphin engu að síður mjög vel út.',
    ],
    facts: 'a075d76dc9ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu á listanum, á verði í meðallagi. Drægnin er í meðallagi og hann hleður hægar en flestir, sem skiptir máli á langferðum.',
    ],
    facts: 'f4502aed1fcd',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er ódýrari en flestir og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og er meðal þeirra hægustu í hröðun. Hann hentar þeim sem vilja mikið fyrir peninginn og aka rólega.',
    ],
    facts: 'ee6e6b50363e',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er kraftmikill, fimm sæta sportjepplingur með fjórhjóladrifi sem höfðar sérstaklega til þeirra sem vilja mikið afl og snögga hröðun. Hann er meðal allra aflmestu bílanna hér á landi og sneggri en flestir, sem gerir framúrakstur áreynslulausan og gefur honum afgerandi sportlegan blæ.',
      'Rafhlaðan er með þeim stærstu í sínum verðflokki og bíllinn hleður hraðar en flestir rafbílar. Í lengri ferðum milli landshluta þýðir það mun styttri viðkomur við hraðhleðslustöðvar. Fjórhjóladrifið tryggir jafnframt traust grip í snjó, hálku og krefjandi vetrarfærð.',
      'Helsti ókosturinn er að bíllinn drífur styttra en flestir á svipuðu verði og er dýrari á hvern kílómetra drægni en gengur og gerist. Ef drægnin vegur þyngra en mikil hestöfl er Subaru e-Outback hagkvæmari kostur sem kemst lengra, en á móti tekur Nissan Ariya e-4ORCE um 70% lengri hleðslustopp.',
      'BYD Sealion 7 hentar því fyrst og fremst þeim sem setja mikla snerpu og hraða hleðslu á ferðalögum í forgang.',
    ],
    facts: 'e5798dfbadee',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum á listanum. Hann er dýrari en flestir og hleður með þeim hægustu, sem er galli á langferðum.',
    ],
    facts: 'e3108495b06c',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er hins vegar meðal þeirra hægustu og aflminnstu, drífur styttra og hleður hægar en flestir, svo hann hentar helst í daglegan akstur.',
    ],
    facts: '0f203bba0964',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst, með 305 km, og hleður með þeim hægustu. Hann er fjögurra sæta og hentar best sem innanbæjarbíll.',
    ],
    facts: 'ed1eed510bce',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er nettur borgarjepplingur með ítölskum svip sem hentar vel í daglegan snúning innanbæjar eða sem annar bíll á heimilið. Hann er lipur í þéttbýli og auðveldur í bílastæðum.',
      'Stærsti styrkleiki hans er verðið, en hann er ódýrari en flestir rafbílar hér á landi og ódýrari á hvern kílómetra drægni en gengur og gerist. Hraðhleðslan er í meðallagi í sínum verðflokki, sem gerir hefðbundinn hversdagsakstur áhyggjulausan, þótt hafa verði í huga að íslenskur vetrarkuldi sker töluvert af drægninni.',
      'Á móti kemur að bíllinn er meðal þeirra aflminnstu og hægustu, auk þess sem drægnin er meðal þeirra stystu í verðflokknum. Volkswagen ID. Cross býður upp á meiri kraft, er 100.000 kr. ódýrari og með um 15% styttri hleðslustopp. Fiat kemur þó betur út en Jeep Avenger, sem er 300.000 kr. dýrari og hefur um 70% lengri hleðslustopp.',
      'Þetta er snotur og lipur kostur fyrir þá sem vilja hagkvæman smábíl í bæinn og gera hóflegar kröfur um hraða og langdrægni.',
    ],
    facts: '5cb3f7454b4f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, sem gerir hann að sterkum kosti á langferðum.',
    ],
    facts: 'f3e474e1f35f',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er kantaður og traustvekjandi fjölskyldujepplingur með háa setustöðu og gott útsýni. Hann hentar vel fólki sem vill hefðbundið jeppalegt form, öruggt fjórhjóladrif í vetrarfærðinni og bíl sem ræður léttilega við daglega skutlið jafnt sem langferðir um landið.',
      'Með 566 km drægni samkvæmt WLTP kemst hann auðveldlega á milli landshluta, jafnvel að vetrarlagi þegar kuldinn bítur af drægninni. Hann er sneggri og aflmeiri en flestir bílar í sínum verðflokki, með 250 kW afl sem nýtist vel við framúrakstur og í snjó. Hann hleður hraðar en flestir rafbílar hér á landi og er ódýrari á hvern kílómetra drægni en gerist og gengur.',
      'Hins vegar nýta sumir keppinautar á sama verði tímann við hraðhleðslustöðvar enn betur. Ef hraði á langferðum skiptir öllu máli býður Hyundai IONIQ 5 Long Range AWD upp á um 35% styttri hleðslustopp. Fyrir þá sem vilja kreista sem flesta kílómetra út úr rafhlöðunni býður systurbíllinn Ford Capri upp á 26 km meiri drægni.',
      'Ford Explorer ER AWD stendur engu að síður upp úr sem vel heppnaður og öflugur jepplingur sem hentar íslenskum aðstæðum afar vel.',
    ],
    facts: '9eb36bb10329',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er sportlegur fjórhjóladrifinn jepplingur sem hentar vel þeim sem ferðast reglulega milli landshluta og leita að öruggum ferðabíl í íslenskum vetraraðstæðum.',
      'Stærsti kostur hans er rafhlaðan, en bíllinn er með einni af stærstu rafhlöðunum í sínum verðflokki og drífur lengra en flestir rafbílar hér á landi. Hann er jafnframt ódýrari á hvern km drægni og aflmeiri en flestir á svipuðu verði. Í daglegu lífi veitir þetta mikið öryggi í vetrarkulda, þar sem drægnin getur farið niður í 70–85% af uppgefnu gildi, auk þess sem fjórhjóladrifið kemur sér vel í snjó og hálku.',
      'Helsti ókosturinn er hins vegar hraðhleðslan, en bíllinn hleður hægar en flestir. Ef þú vilt eyða minni tíma á hleðslustöðvum í langferðum væri Smart #5 Pulse ákjósanlegri kostur, en hann er 100.000 kr. ódýrari og býður upp á um 50% styttri hleðslustopp. Skoda Elroq RS veitir sömuleiðis um 15% styttri hleðslustopp.',
      'Ford Mustang Mach-E LR AWD er traustur ferðabíll fyrir þá sem setja mikla rafhlöðu og drægni í fyrsta sæti, svo lengi sem lengri hleðslustopp á þjóðveginum eru ekki fyrirstaða.',
    ],
    facts: '01e9d7fa4b33',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '13dd726fc66c',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er fimm sæta rafjepplingur með fjórhjóladrifi sem einkennist af miklu afli og hröðun sem er meðal þess sneggsta sem gerist. Hann hentar sérstaklega vel ökumönnum sem vilja traustan gripbíl í íslenska vetrarfærð, en gera um leið kröfu um kraftmikinn bíl án þess að greiða lúxusverð.',
      'Bíllinn er ódýrari en flestir af rafbílum hér á landi og ódýrari á hvern km drægni en flestir í sínum verðflokki. Hann er með eina af stærstu rafhlöðunum á svipuðu verði og drífur lengra en flestir þeirra, sem nýtist vel í ferðalögum milli landshluta. Jafnframt er hann meðal þeirra sem hlaða hraðast í sínum verðflokki, svo lítið fer fyrir bið á hraðhleðslustöðvum.',
      'Á móti er Hongqi nýrra merki hérlendis en mörg hefðbundin bílamerki. Ef þekktara vörumerki vegur þungt gæti Peugeot e-3008 eða Volvo EX30 hentað betur, en báðir eru dýrari, eindrifnir og með um 80% og um 50% lengri hleðslustopp. Mazda CX-6e er 100.000 kr. ódýrari, en er afturhjóladrifinn með minni drægni.',
      'Hongqi EHS5 býður upp á óvenju mikið fyrir peninginn fyrir þá sem setja fjórhjóladrif, mikið afl og snögga hleðslu í forgang.',
    ],
    facts: 'c1ddd31fa032',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er fjórhjóladrifinn, meðal þeirra aflmestu og sneggstu, og með stærstu rafhlöðuna miðað við bíla á svipuðu verði. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir á sama verði.',
    ],
    facts: 'b1727237dbbf',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er lipur og kassalaga smábíll sem fellur vel að þéttbýlinu. Hann er auðveldur í þröng bílastæði og býður upp á upprétta setstöðu með sætum fyrir allt að fimm. Hann hentar sérlega vel sem sparneytinn skutlubíll fyrir þá sem aka langmest innanbæjar og vilja einfaldan, nýjan rafbíl.',
      'Stærsti kosturinn er verðið, enda er hann meðal þeirra ódýrustu af rafbílum hér á landi og sömuleiðis meðal þeirra ódýrustu á hvern kílómetra drægni. Í daglegu lífi dugar rafhlaðan prýðilega í hefðbundin innanbæjarerindi ef hlaðið er heima yfir nótt, án þess að binda mikið fjármagn í bílakaupum.',
      'Hins vegar gefur maður eftir í afli og langferðagetu. Hann er meðal þeirra aflminnstu og hægustu bíla á landinu, drífur styttra en flestir í sínum verðflokki og hleður hægar en flestir þeirra. Ef stefnan er sett á reglulegan þjóðvegaakstur gætu Leapmotor B10 eða Leapmotor B03X ProMax hentað betur, en þeir bjóða báðir meiri drægni, miklu sneggri hröðun og talsvert styttri hleðslustopp.',
      'Hyundai INSTER er því fyrst og fremst raunsær og lipur borgarbíll, sniðinn fyrir þá sem meta lágt kaupverð og þægindi í þéttbýli fram yfir ferðalög milli landshluta.',
    ],
    facts: '6832195fd771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Drægnin er samt með þeirri stystu og hann hleður hægt, svo hann er helst borgarbíll.',
    ],
    facts: '383ab1ec50e1',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er meðal ódýrustu bílanna en meðal þeirra sem drífa styst og hleður með þeim hægustu. Hann er væntanlegur í lok árs 2026 og hentar helst í innanbæjarakstur.',
    ],
    facts: '2796cf363a0d',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni, með 496 km. Hann er þó meðal þeirra hægustu og aflminnstu, og væntanlegur í lok árs 2026.',
    ],
    facts: 'cc6347a9b495',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er rúmgóður fjölskyldubíll með fjórhjóladrifi sem hentar sérlega vel í íslenskri vetrarfærð. Helsta sérkenni hans er hleðslugetan, en í sínum verðflokki hleður hann hraðast allra og er jafnframt meðal þeirra sem hlaða hraðast af rafbílum hér á landi.',
      'Í sínum verðflokki drífur bíllinn lengra en flestir og er með stærri rafhlöðu en flestir, auk þess að vera ódýrari á hvern kílómetra drægni en flestir á markaðnum. Í daglegu lífi þýðir þetta meira öryggi í ferðum milli landshluta í vetrarkulda. Hann er einnig sneggri í hundraðið en flestir bílar á svipuðu verði, sem auðveldar framúrakstur á þjóðveginum.',
      'Þeir sem vilja hámarka vegalengdina á einni hleðslu gætu frekar litið til Ford Explorer ER AWD, sem býður upp á 20 km meiri drægni. Í þeim bíl eru hleðslustoppin hins vegar um 60% lengri.',
      'Fyrir fólk sem ferðast mikið milli landshluta og vill eyða sem minnstum tíma við hleðslustöðvar er IONIQ 5 afar heppilegur kostur.',
    ],
    facts: 'ec32ba1494cf',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er dýrari en flestir og hægari en flestir í hröðun.',
    ],
    facts: '61ec7ef63fe4',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '3f4af478402e',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric er lipur og hagnýtur bíll sem hentar sérlega vel þeim sem vilja mikla drægni á viðráðanlegu verði. Hann er ódýrari en flestir rafbílar á Íslandi og drífur lengra en flestir í sínum verðflokki. Uppgefin 514 km drægni dugar vel milli landshluta, jafnvel í íslenskum vetrarkulda.',
      'Stærsti styrkleikinn er hvað maður fær mikið fyrir peningana, en hann er meðal þeirra ódýrustu á hvern kílómetra drægni af öllum rafbílum hér á landi. Hann er framhjóladrifinn og dugar vel í daglegan akstur, þótt hann sé aflminni og hægari en flestir.',
      'Helsti ókosturinn er hraðhleðslan, en bíllinn hleður hægar en flestir í sínum verðflokki og stopp á langferðum verða því lengri. Fyrir þá sem aka mikið langkeyrslu er Tesla Model Y Standard Range 280.000 kr. dýrari en býður upp á um 30% styttri hleðslustopp. Leapmotor C10 ProMax er líka 60.000 kr. ódýrari með um 25% styttri hleðslustopp.',
      'Hlaði maður hins vegar mest heima og vilji hámarksdrægni fyrir hverja krónu er Kona afar skynsamlegur kostur.',
    ],
    facts: 'd2efebe3c86d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric er sérstæður fjölnotabíll sem rúmar allt að níu manns í sæti. Hann er sniðinn fyrir stórfjölskyldur eða hópferðir þar sem hámarks sætafjöldi og ríflegt innanrými skipta öllu máli.',
      'Bíllinn er með stærri rafhlöðu en flestir í sínum verðflokki, sem gefur góðan forða fyrir þungan ferðabíl. Í daglegu lífi munar mest um að geta flutt stóran hóp ásamt farangri á rafmagni án þess að nokkrum þyki þröngt um sig.',
      'Á móti kemur að drægnin er meðal þeirra stystu í þessum verðflokki og verð á hvern km drægni meðal þeirra dýrustu. Í vetrarkulda rýrnar drægnin enn frekar, og framhjóladrifið krefst aðgátar í snjó og hálku. Ef sjö sæti duga gæti Kia PV5 hentað betur með 13 km meiri drægni.',
      'Fyrir þá sem þurfa níu sæti er STARIA hins vegar mun hagstæðari en Peugeot e-Traveller, sem er 1.300.000 kr. dýrari og krefst um 80% lengri hleðslustoppa. Hann hentar því einkar vel stórum hópum sem sætta sig við tíðari hleðslustopp á langferðum.',
    ],
    facts: '55454b8ff503',
    model: 'gemini-3.8-flash, thinking high',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er nettur og lipur borgarjepplingur sem ber hið svipmikla útlit merkisins en er þó eingöngu framhjóladrifinn. Hann hentar einkum þeim sem aka mest innanbæjar og vilja bíl með hárri setustöðu sem auðvelt er að leggja í þröng stæði.',
      'Stærsti styrkur hans er að hann er ódýrari en flestir rafbílar hér á landi. Hann er léttur og lipur í snúningum sem gerir hann að þægilegum kosti fyrir hefðbundinn innanbæjarakstur dagsdaglega.',
      'Á móti kemur að hann gefur töluvert eftir í langferðagetu. Rafhlaðan er lítil, drægnin er með því stysta í sínum verðflokki og hann hleður hægar en aðrir á svipuðu verði. Fyrir þá sem vilja meira grip í vetrarfærð er Suzuki e Vitara 4x4 AllGrip aðeins 50.000 kr. dýrari og býður upp á fjórhjóladrif. Fyrir sama verð færðu líka XPENG G6 RWD Standard Range, sem býður meiri drægni og um 55% styttri hleðslustopp.',
      'Avenger höfðar til þeirra sem heillast af útliti og nettleika, en í þessum verðflokki fæst einfaldlega meiri geta annars staðar.',
    ],
    facts: '44e951bb483e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er ódýrari en flestir og með stærri rafhlöðu en flestir. Hann hleður þó með þeim hægustu og er meðal þeirra hægustu í hröðun.',
    ],
    facts: 'efc224526415',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er fjórhjóladrifinn en meðal þeirra sem drífa styst og hlaða hægast. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'd66452b944fb',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er hár og kassalaga jepplingur með hrjúfu útliti sem höfðar til þeirra sem vilja hefðbundinn jeppasvip og gott pláss. Þótt útlitið bendi til torfærugetu er hann aðeins framhjóladrifinn og hentar því fyrst og fremst sem hagnýtur fjölskyldubíll í venjulegan daglegan akstur.',
      'Verðið er hans helsti styrkleiki, enda er hann ódýrari en flestir rafbílar og kemur með stærri rafhlöðu en flestir í sínum verðflokki. Drægnin er í meðallagi miðað við verð og dugar vel til hversdagsnota og ferða milli landshluta, þótt gera verði ráð fyrir að hún minnki í vetrarkulda.',
      'Á móti kemur að hann hleður hægar en flestir bílar og er aflminni en margir keppinautar. Ef fjórhjóladrif skiptir máli í vetrarfærðinni er Leapmotor C10 ProMax AWD aðeins 100.000 kr. dýrari, með talsvert meira afl og um 15% styttri hleðslustopp. Fyrir þá sem vilja liprari bíl með 32 km meiri drægni og um 35% styttri hleðslustopp er Volkswagen ID.3 Neo 58 kWh á sama verði.',
      'Torres EVX er hagstæður kostur fyrir þá sem leita að rúmgóðum jepplingi fyrir alla fjölskylduna, svo lengi sem fólk sættir sig við framhjóladrif og rólegri hleðslu á langferðum.',
    ],
    facts: '0f8f89fb8ee1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best sem innanbæjarbíll.',
    ],
    facts: 'bc2e14d9b951',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '2fdd5bf67da3',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '42dcd1988f27',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er lipur, nettur bíll sem hentar einkar vel fólki sem vill mikla drægni án þess að greiða hátt verð fyrir stóran jeppa. Hann sker sig úr með stórri rafhlöðu miðað við verð og er meðal þeirra langdrægustu í sínum verðflokki. Í daglegu lífi þýðir þetta að hann kemst auðveldlega á milli landshluta án fyrirhafnar, jafnvel í íslenskum vetrarkulda.',
      'Stærsti kosturinn er hversu mikið fæst fyrir peninginn, en bíllinn er meðal þeirra ódýrustu á hvern kílómetra drægni af öllum rafbílum hér á landi. Jafnframt hleður hann hraðar en flestir bílar á svipuðu verði, sem gerir nauðsynleg hleðslustopp á langferðum stutt og þægileg.',
      'Á móti kemur að hann er framhjóladrifinn og aflminni en flestir í sínum verðflokki, sem gæti skipt máli í þungri vetrarfærð. Ef afturhjóladrif og meira afl heilla frekar gæti Mazda 6e Long Range hentað betur, þótt drægnin sé þar 53 km minni og hleðslustoppin um 60% lengri.',
      'Fyrir þá sem vilja sem mesta drægni og stutt hleðslustopp á góðu verði er Kia EV3 einkar hagkvæmur og skynsamlegur kostur.',
    ],
    facts: '837adf7be9b3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er ódýrari á hvern km drægni en flestir og hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '52d51b19b573',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er fimm sæta hlaðbakur með framhjóladrif sem sker sig úr fyrir mikla drægni miðað við verðlag. Hann er ódýrari en flestir rafbílar á Íslandi en býður samt upp á drægni sem er meðal þeirra allra lengstu. Hann hentar einkum þeim sem ferðast reglulega milli landshluta og vilja geta reitt sig á góða drægni í vetrarkulda án mikils tilkostnaðar.',
      'Stærsti styrkleiki bílsins er hve mikið fæst fyrir peninginn, en hann er meðal þeirra ódýrustu á hvern kílómetra drægni. Rafhlaðan er stærri en á flestum bílum í svipuðum verðflokki og hann hleður hraðar en flestir, sem styttir viðkomur við hleðslustöðvar í langferðum.',
      'Hins vegar er bíllinn aflminni og hægari en flestir rafbílar hér á landi. Hann dregur aðeins á framhjólunum, svo fyrir þá sem vilja meira grip í snjó og hálku gæti Tesla Model 3 Long Range Fjórhjóladrif hentað betur, enda fjórhjóladrifin og með um 20% styttri hleðslustopp, þótt hún sé 300.000 kr. dýrari.',
      'Fyrir þá sem horfa fyrst og fremst í mikla drægni og lágan kaupverðskostnað er Kia EV4 afar hagkvæmur kostur í daglegum akstri.',
    ],
    facts: '7a4f0374acac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '1cdc5f54dd29',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er í meðallagi að verði, drægni og hleðslu. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann er fyrir þá sem aka rólega.',
    ],
    facts: '3df0d9f65455',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Hann er líka hægari og aflminni en flestir.',
    ],
    facts: '97e875731646',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 Long Range AWD er lágur og straumlínulagaður bíll sem sker sig úr með sportlegu yfirbragði og miklum krafti. Hann hentar vel þeim sem vilja snöggan fjölskyldubíl með fjórhjóladrifi sem tryggir öruggt grip í snjó og hálku.',
      'Helsti styrkur bílsins er hleðslutæknin, en hann er meðal þeirra sem hlaða hraðast hér á landi. Það þýðir sérstaklega stutt stopp við hraðhleðslustöðvar á langferðum. Hann er jafnframt sneggri og með stærri rafhlöðu en flestir bílar í sínum verðflokki.',
      'Drægnin er þó í meðallagi miðað við verð. Fyrir þá sem vilja meiri drægni gæti Hyundai IONIQ 5 Long Range AWD hentað betur, en hann býður upp á 24 km meiri drægni. Nissan Ariya gefur svipaða drægni, en þar eru hleðslustoppin um 135% lengri og bíllinn er aðeins með framhjóladrif.',
      'Kia EV6 er því mjög heppilegur kostur fyrir þá sem leita að kvikum og fjórhjóladrifnum bíl sem tefur mann sem allra minnst á langkeyrslu.',
    ],
    facts: 'f4b80134c57d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er stór og kassalaga jeppi með sæti fyrir allt að sjö manns, sem sker sig úr með grófu jeppalagi fremur en útliti fjölnotabíls. Hann hentar stórum fjölskyldum sem leita að rúmgóðum ferðabíl með alvöru fjórhjóladrifi, sem veitir gott veggrip og öryggi í snjó, hálku og á krefjandi malarvegum.',
      'Rafhlaðan er stærri en á flestum rafbílum hér á landi og bíllinn hleður hraðar en flestir þeirra. Það kemur sér vel á íslenskum þjóðvegum, þar sem hleðslustopp verða styttri og drægnin dugar vel á milli landshluta þótt vetrarkuldinn éti hluta af henni.',
      'Á móti er hann dýrari en flestir rafbílar og drífur styttra en flestir í sínum verðflokki. XPENG X9 AWD Performance er til dæmis 400.000 kr. ódýrari, býður upp á 58 km meiri drægni og um 50% styttri hleðslustopp, sem gerir hann að vænlegri kosti fyrir þá sem leggja mesta áherslu á langferðir.',
      'Fyrir þá sem vilja fullburða sjö sæta jeppa sem lætur íslenska vetrarfærð ekki stöðva sig er Kia EV9 engu að síður mjög álitlegur kostur.',
    ],
    facts: '17a8cbfdb49d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir. Hann er meðal dýrustu bílanna og drífur með þeim stystu miðað við bíla á svipuðu verði.',
    ],
    facts: '7db76de8dd00',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er sjö sæta og afturhjóladrifinn, á verði í meðallagi. Hann er meðal þeirra hægustu og aflminnstu og drífur styttra en flestir.',
    ],
    facts: 'afce84cfe36c',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er ódýrasti bíllinn á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann er fjögurra sæta, drífur með þeim stystu og hleður hægt, svo hann er eingöngu borgarbíll.',
    ],
    facts: 'f168cdfdc3ac',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst. Hann er væntanlegur í lok árs 2026 og hentar helst innanbæjar.',
    ],
    facts: 'dba3166a5d28',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er meðal ódýrustu bílanna og drífur lengra en flestir bílar á svipuðu verði. Miðað við þá hleður hann líka með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'e6210d4da47e',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra sneggstu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'db289d44bbc9',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er fimm sæta fólksbíll sem er meðal þeirra allra ódýrustu hér á landi. Hann hentar sérstaklega vel þeim sem leita að hagkvæmum bíl í daglegan akstur en vilja hvorki fórna afli né lipurð á vegi.',
      'Stærsti styrkur hans er hvað fæst mikið fyrir peninginn. Í sínum verðflokki drífur hann lengst, er með stærstu rafhlöðuna og hleður hraðast. Hann er jafnframt sneggstur í hröðun og ódýrastur á svipuðu verði á hvern kílómetra drægni. Í vetrarkulda má gera ráð fyrir um 70–85% af uppgefinni drægni, en stærri rafhlaðan veitir aukið öryggi á lengri ferðum milli landshluta.',
      'Á móti kemur að bíllinn er afturhjóladrifinn, sem krefst meiri aðgátar í snjó og hálku en framhjóladrif. MG MG4 Urban Long Range er 100.000 kr. ódýrari og framhjóladrifinn, en þar eru hleðslustoppin um 35% lengri og drægnin minni. Kia EV2 Standard Range gæti líka hentað betur þeim sem vilja rótgrónara merki, þótt drægnin sé talsvert styttri.',
      'Fyrir þá sem vilja sem mestan akstursradíus og snögg hleðslustopp fyrir sem minnstan pening er B05 ProMax afar fýsilegur kostur.',
    ],
    facts: '42f28bf1bbf3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur með þeim stystu á listanum en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '8cce705ff9bf',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 67.1 kWh er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '820b4bbc7942',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '77d2c83a4f96',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra aflmestu.',
    ],
    facts: 'b7ee9166431c',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu og aflmestu. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: 'de92b93809ad',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði er hann meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '88df29fca349',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er fjórhjóladrifinn og meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra og hleður með þeim hægustu.',
    ],
    facts: 'ec0d08614bb9',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði drífur hann styttra og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '0a87c0c60e7f',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og meðal þeirra dýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: 'f94441e54214',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og sneggri en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '4dd4a5df1719',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er dýrari en flestir en drífur styttra, hleður með þeim hægustu og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði gefur hann eftir í flestu sem tölurnar mæla.',
    ],
    facts: '758669913f52',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er ódýrari en flestir en drífur lengra en flestir, með 552 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu á listanum, sem lengir stoppin á langferðum.',
    ],
    facts: '7cc08e00859c',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e 78 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar en flestir, en er hægari en flestir; hann er væntanlegur haustið 2026.',
    ],
    facts: '4b812db57179',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er meðal þeirra langdrægustu á listanum, með 762 km, meðal þeirra sem hlaða hraðast og meðal þeirra sneggstu. Hann er dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '0def61a05830',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er á verði í meðallagi og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann er þó hægari og aflminni en flestir og með minni rafhlöðu.',
    ],
    facts: '710ed58430b1',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er lágur og rennilegur fólksbíll með fjórhjóladrifi sem höfðar sérstaklega til þeirra sem leita að fágaðri akstursupplifun og miklu langferðaþoli. Fjórhjóladrifið tryggir öruggt veggrip í snjó og hálku á íslenskum vegum.',
      'Stærsti styrkleiki bílsins er drægnin, en hann er meðal allra langdrægustu rafbíla hér á landi og ódýrastur á hvern kílómetra drægni í sínum verðflokki. Í vetrarkulda þýðir þetta að auðvelt er að aka milli landshluta án þess að hafa áhyggjur af hleðslu, auk þess sem hann er meðal þeirra bíla sem hlaða hraðast svo stopp á ferðalögum verða stutt.',
      'Í sínum verðflokki er hann hins vegar aflminni en flestir keppinautarnir, jafnvel þótt hröðunin sé í meðallagi. Ef meira afl skiptir miklu máli kemur Audi A6 e-tron Sportback quattro til greina með 80 kW meira afl, eða Volvo EX60 P10 sem býður upp á 115 kW meira afl.',
      'Fyrir kaupendur sem vilja lágmarka hleðslustopp og komast sem lengst á hverri hleðslu í vönduðum bíl er CLA 350 4MATIC afar skynsamlegt val í þessum verðflokki.',
    ],
    facts: '4cb076da8aba',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er meðal þeirra langdrægustu, með 743 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'ef0370bc5c2d',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu, en líka meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er fjögurra sæta og dýrari en flestir.',
    ],
    facts: 'fe5b7900b14e',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er nettur lúxusjepplingur sem leggur áherslu á fágaðan og hljóðlátan akstur fremur en mikil afköst. Hann hentar einkum þeim sem vilja gæðatilfinningu merkisins og þægilega sætisstöðu í borginni og nærsveitum, án þess að vera á of stórum bíl.',
      'Fjórhjóladrifið er hans helsti styrkur við íslenskar aðstæður. Það tryggir traust veggrip í snjó, hálku og vetrarbyljum, sem veitir aukið öryggi og stöðugleika í daglegum akstri. Mjúk fjöðrun og góð hljóðeinangrun gera hann auk þess að ljúfum bíl í daglegu vafstri.',
      'Á móti kemur að bíllinn drífur styttra en flestir í sínum verðflokki og er meðal þeirra sem hlaða hægast. Fyrir þá sem fara oft í langferðir er BMW iX1 xDrive 30 mun heppilegri kostur, með um 20% styttri hleðslustopp og talsvert meira afl fyrir 200.000 kr. meira. Ef fjórhjóladrif er ekki nauðsynlegt er Mini Countryman E 100.000 kr. ódýrari og með um 15% styttri hleðslustopp.',
      'Þetta er bíll sem kaupandi velur fyrir merkið, rósemi í akstri og traust grip í hálku, frekar en fyrir tölfræði á blaði eða hraðhleðslu á þjóðveginum.',
    ],
    facts: 'b69d33295c87',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er sjö sæta og fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og drífur lengra en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: 'd49336def5c3',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'bb72ff6499e0',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er meðal þeirra langdrægustu, með 715 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn, sneggri og aflmeiri en flestir og dýrari en flestir.',
    ],
    facts: '14347312b37b',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður með þeim hægustu og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '44caa0b259c8',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC drífur lengst allra bíla á listanum, 869 km, og hefur stærstu rafhlöðuna. Hann er meðal dýrustu bílanna en ódýrastur á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'ff4f09dbd41a',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er sjö sæta, meðal þeirra langdrægustu og meðal þeirra aflmestu á listanum. Miðað við bíla á svipuðu verði hleður hann þó með þeim hægustu.',
    ],
    facts: '380eceea0163',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru hægastir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '5a3138924309',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 tekur átta manns en er meðal dýrustu bílanna á listanum og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '7e1d59a12e8f',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er átta sæta og meðal þeirra langdrægustu, með 713 km, og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna og meðal þeirra hægustu, og væntanlegur árið 2027.',
    ],
    facts: '2ef409b18730',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er átta sæta og fjórhjóladrifinn, meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum og væntanlegur árið 2027.',
    ],
    facts: '8a6751d961e1',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er meðal dýrustu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '8335d9035eab',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin.',
    ],
    facts: '28e3aa2ba305',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta, fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður með þeim hægustu, svo hann er bíll fyrir aksturinn fremur en langferðir.',
    ],
    facts: '5aed9ed82d06',
  },
  'mg-mg4-urban-standard-range': {
    paragraphs: [
      'MG MG4 Urban Standard Range er fimm sæta hlaðbakur sem býður upp á hefðbundið innanrými á verði sem venjulega fylgir mun smærri smábílum. Hann hentar einkar vel sem fjölskyldubíll í bæinn og fyrir fólk sem ekur aðallega styttri vegalengdir dags daglega.',
      'Kaupverðið er hans helsti styrkur, enda er bíllinn meðal þeirra ódýrustu á landinu og meðal þeirra ódýrustu á hvern kílómetra drægni. Hann tryggir afar lágan aðgangsþröskuld að nýjum rafbíl fyrir þá sem geta hlaðið heima og vilja halda öllum kostnaði í lágmarki án þess að fórna sætaplássi.',
      'Á móti kemur að drægnin er meðal þeirra stystu sem fást og hann er meðal þeirra sem hlaða hægast á hraðhleðslustöðvum, sem krefst þolinmæði á ferðalögum, sérstaklega í íslenskum vetrarkulda. Á sama verði býður Leapmotor B03X Pro upp á um 15% styttri hleðslustopp, og ef horft er til lengri ferða fær maður Leapmotor B05 Pro með 76 km meiri drægni og um 35% styttri hleðslustoppum fyrir hóflegt aukagjald.',
      'Þessi útfærsla er skynsamlegt val fyrir bæjarbúa sem vilja fullgildan bíl fyrir sem minnstan pening, svo lengi sem ætlunin er ekki að leggja oft upp í langferðir.',
    ],
    facts: 'af97992b2a74',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er meðal ódýrustu bílanna og meðal þeirra langdrægustu miðað við bíla á svipuðu verði. Hann er þó meðal þeirra hægustu og aflminnstu á listanum.',
    ],
    facts: 'b9c1781d3300',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra, hleður hraðar og er sneggri en flestir.',
    ],
    facts: 'de0a607d37b7',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: 'f116badf00c6',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er ódýrari en flestir en meðal þeirra sem drífa styst og hlaða hægast, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: '7f8e2afc1767',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er þéttur og stílhreinn borgarjepplingur sem sker sig úr með miklum persónuleika og einkennandi hönnun Mini. Hann er hannaður fyrir þá sem vilja sérstætt útlit og gæði vörumerkisins, en þurfa á sama tíma meira innanrými og hærri setstöðu fyrir fjölskylduna en hefðbundinn smábíll býður upp á.',
      'Í daglegu lífi skilar hann liprum og þægilegum akstri. Uppgefin drægni dugar vel í alla hefðbundna vinnusókn og styttri ferðalög milli landshluta að sumri til, þótt reikna verði með að hún minnki í vetrarkulda.',
      'Þar sem bíllinn gefur eftir er fyrst og fremst tæknilegur styrkur miðað við verð. Hann er aðeins framhjóladrifinn, meðal þeirra aflminnstu í sínum verðflokki og hleður hægar en flestir. Fyrir nánast sama verð bjóða keppinautarnir meira fyrir peninginn. Volvo EX30 Cross Country Twin Motor Performance er aðeins 30.000 kr. dýrari, miklu aflmeiri og með fjórhjóladrif. BMW iX1 xDrive 30 býður sömuleiðis upp á meira afl og fjórhjóladrif gegn litlu viðbótargjaldi, sem munar um í snjó og hálku.',
      'Countryman E er því skemmtilegur lífsstílsbíll sem heillar með útliti og anda, en fyrir krefjandi íslenskar vetraraðstæður gefa keppinautarnir meiri vetrarhæfni á svipuðu verði.',
    ],
    facts: '007a7b244e00',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra og hleður hægar en flestir. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '81432d844745',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er þægilegur og yfirvegaður fjölskyldujepplingur sem leggur áherslu á afslappaðan akstur fremur en mikil afköst. Hann sker sig helst úr með því að vera með einni af stærstu rafhlöðunum í sínum verðflokki, sem höfðar til þeirra sem vilja geta farið í lengri ferðir án þess að hafa sífelldar áhyggjur af hleðslustöðunni.',
      'Stór rafhlaða veitir aukið öryggi í dæmigerðum íslenskum vetraraðstæðum þar sem kuldinn dregur jafnan úr drægninni. Hann reynist líka ódýrari á hvern kílómetra drægni en flestir rafbílar hér á landi, sem þýðir að maður fær mikið geymslurými fyrir orku miðað við kaupverð.',
      'Á móti kemur að þessi útgáfa er aðeins framhjóladrifin, aflminni og hleður hægar en flestir bílar á svipuðu verði. Fyrir sömu peninga bjóða keppinautarnir upp á fjórhjóladrif sem kemur sér vel í snjó og hálku. Til dæmis er Hyundai IONIQ 5 Long Range AWD með fjórhjóladrif og um 60% styttri hleðslustopp á ferðalögum. Fyrir þá sem aka mikið í krefjandi vetrarfærð eða vilja sem styst stopp við hraðhleðslur eru aðrir kostir því líklega heppilegri.',
    ],
    facts: 'ebf917d159a6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er fjórhjóladrifinn og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og drífur styttra en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '703df216d4ab',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf Standard Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er hægari en flestir.',
    ],
    facts: '0876a4925283',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er hagnýtur fólksbíll sem hentar vel þeim sem vilja rúmgóðan og traustan bíl í daglegan akstur og langferðir. Hann sker sig úr með mikilli drægni miðað við verð, sem gerir hann að kjörnum kosti fyrir fólk sem vill kveðja drægnikvíða án þess að kaupa dýran lúxusbíl.',
      'Stærsti styrkur bílsins er drægnin, en hann drífur lengra en flestir rafbílar og er meðal þeirra langdrægustu í sínum verðflokki. Jafnvel í íslenskum vetrarkulda ætti hún að duga léttilega á milli landshluta. Hann hleður jafnframt hraðar en flestir og er meðal þeirra ódýrustu á hvern kílómetra drægni af rafbílum hér á landi, svo hleðslustopp í langferðum verða bæði fá og stutt.',
      'Á móti kemur að bíllinn er framhjóladrifinn og aflið er í meðallagi í sínum verðflokki, sem gæti skipt máli í mikilli snjófærð. Ef afturhjóladrif og meira afl skipta sköpum er Mazda 6e Long Range á sama verði, en þar eru hleðslustoppin um 70% lengri og drægnin 70 km minni. Þá er Kia EV3 Long Range örlítið ódýrari kostur, eða um 99.000 kr. ódýrari.',
      'Fyrir þá sem forgangsraða langdrægni og góðum hleðsluhraða á hagstæðu verði er Leaf Extended Range eitt allra skynsamlegasta valið á markaðnum.',
    ],
    facts: 'd634205f4f90',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er sjö sæta og meðal ódýrustu bílanna á listanum. Hann er þó meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir.',
    ],
    facts: '6966a929a05b',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er látlaus og þægilegur fjölskyldujepplingur sem leggur áherslu á hefðbundin þægindi og lágstemmdan akstur frekar en mikinn sprettkraft. Hann hentar sérstaklega vel fólki sem leitar að yfirveguðum og hagnýtum ferðabíl sem kemst vel yfir án þess að kosta of mikið.',
      'Helsti styrkleiki bílsins er hversu mikið fæst fyrir peninginn, en hann er ódýrari á hvern kílómetra drægni en flestir rafbílar hér á landi. Drægnin er í meðallagi og dugar prýðilega í lengri ferðir milli landshluta, jafnvel þótt vetrarkuldinn taki sinn toll af rafhlöðunni.',
      'Á móti kemur að hann er aðeins framhjóladrifinn og er meðal þeirra hægustu í sínum verðflokki. Fyrir þá sem þurfa aukið grip í íslenskri vetrarfærð og vilja meiri kraft er Peugeot e-3008 Dual Motor aðeins 100.000 kr. dýrari, með fjórhjóladrifi og talsvert snarpari hröðun, þótt hleðslustoppin á langferðum verði þar um 20% lengri. Grandland kemur hins vegar mun betur út á hraðhleðslustöðvum en BYD Seal U, þar sem hleðslustoppin eru um 55% lengri.',
      'Opel Grandland er mjög skynsamlegur kostur fyrir þá sem vilja sem mesta drægni fyrir hverja krónu, svo lengi sem fjórhjóladrif er ekki nauðsyn.',
    ],
    facts: '10b4052276f8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er fjórhjóladrifinn og á verði í meðallagi. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi að afli og hröðun.',
    ],
    facts: '52c63660f039',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 48 kWh er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: 'a6c48a654251',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 54 kWh er meðal ódýrustu bílanna en drífur styttra og er meðal þeirra hægustu og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: 'ba54c05cafa1',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, og drífur lengra en flestir bílar á svipuðu verði. Hann hleður hægar og er aflminni en flestir.',
    ],
    facts: 'ce16f004dc74',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir bílar á svipuðu verði. Hann hleður þó hægar en flestir.',
    ],
    facts: '692bae7c8a08',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er rúmgóður sjö sæta fjölskyldubíll sem höfðar sérstaklega til stærri fjölskyldna sem vantar mörg sæti á viðráðanlegu verði. Hann er ódýrari en flestir rafbílar hér á landi og gerir sjö sæta rafbíl að raunhæfum kosti fyrir venjuleg heimili.',
      'Drægnin er í meðallagi og dugar vel í daglegan akstur og ferðalög milli landshluta, þótt reikna verði með að hún minnki í vetrarkulda. Verð á hvern kílómetra drægni er hagstæðara en hjá flestum rafbílum, svo maður fær mikið notagildi fyrir aurinn.',
      'Á móti kemur að bíllinn er aflminni en flestir, meðal þeirra hægustu og hleður hægar en flestir, sem þýðir lengri bið við hleðslustöðvar á hringferðum. Hann er einnig eingöngu framhjóladrifinn. Þeir sem vilja sjö sæti fá mun meiri drægni hér en í Kia PV5 eða Toyota Proace City Verso. Ef fjórhjóladrif og styttri hleðslustopp skipta hins vegar miklu máli í vetrarfærð er dýrari bíll eins og Skoda Peaq 90x betri kostur.',
      'Peugeot e-5008 er skynsamlegur kostur fyrir fjölskyldur sem þurfa mörg sæti á hagstæðu verði og geta sætt sig við rólegri hröðun og lengri hleðslustopp á langferðum.',
    ],
    facts: 'b47a6957b868',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er sjö sæta og fjórhjóladrifinn, á verði í meðallagi. Hann drífur styttra en flestir og hleður með þeim hægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '63f008fe944a',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er sjö sæta og ódýrari en flestir, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '1f5530953756',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '579ac6ea3486',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 Long Range Dual Motor er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og sneggri en flestir.',
    ],
    facts: 'ea9b46c810bb',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir, og drífur lengra og hleður hraðar en flestir. Hann er á verði í meðallagi.',
    ],
    facts: '5d18326da1a8',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er stór, rennilegur og öflugur sportjeppi með norrænu yfirbragði. Hann hentar vel þeim sem vilja rúmgóðan lúxusbíl með traustu fjórhjóladrifi sem ræður léttilega við krefjandi vetrarfærð og íslenska vegi.',
      'Rafhlaðan er með þeim allra stærstu hér á landi og drægnin meðal þeirra lengstu, sem þýðir að hægt er að aka á milli landshluta í vetrarkulda án þess að stoppa oft. Bíllinn er jafnframt aflmeiri en flestir í sínum verðflokki, sem veitir mikið öryggi við framúrakstur og lipra aksturseiginleika.',
      'Á móti er hann dýrari en flestir rafbílar og hleður hægar en flestir í sínum verðflokki. Ef hámarkshraði á ferðalögum skiptir öllu máli gæti fólksbíllinn Volvo ES90 Twin Motor hentað betur, en hann kostar það sama og býður upp á 51 km meiri drægni og um 35% styttri hleðslustopp.',
      'Fyrir kaupendur sem leita að kraftmiklum jeppa með ríflegt pláss, gott grip og mikla drægni er Polestar 3 mjög álitlegur kostur.',
    ],
    facts: '607b219a4925',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir og með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '60945870f6fe',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor sker sig úr meðal bíla á svipuðu verði með mikilli dráttargetu og stórri rafhlöðu í bland við mikið afl. Þetta hentar sérstaklega þeim sem vilja hraðskreiðan bíl sem getur dregið þungan ferðavagn.',
      'Hann er með einni stærstu rafhlöðunni í sínum verðflokki og drífur lengra en flestir rafbílar hér á landi, sem gefur aukið öryggi í vetrarakstri milli landshluta. Fjórhjóladrifið og aflið skila honum í hóp þeirra allra sneggstu á götunni, og 2.000 kg dráttargetan er meiri en hjá svipuðum bílum.',
      'Á móti er hraðhleðslan aðeins í meðallagi og hleðslustoppin eru til dæmis um 35% styttri hjá Smart #5 Brabus. Einnig er skottið 526 lítrar á meðan Tesla Model Y Performance býður upp á 854 lítra, auk þess að vera 160.000 kr. ódýrari.',
      'Hann er kjörinn fyrir þá sem þurfa mikla dráttargetu og vilja mikla drægni í snörpum fjórhjóladrifnum bíl. Ef markmiðið er hins vegar hámarks farangurspláss eða sem styst hlé við hleðslustöðvar reynast keppinautarnir heppilegri kostur.',
    ],
    facts: '4b106d0d549a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 SUV Long Range Dual Motor er meðal sneggstu og aflmestu bílanna, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: '625d0a4115d4',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'b4b49ee67080',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4s Electric er meðal sneggstu bílanna á listanum og hleður hraðar en flestir. Hann er meðal þeirra dýrustu.',
    ],
    facts: '64e6a92aa4e6',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er lágur og rennilegur lúxussportbíll sem leggur alla áherslu á akstursánægju, mikil þægindi og langferðir. Hann hentar þeim sem leita að fágaðri akstursupplifun og vilja komast áreynslulaust á milli landshluta á malbikuðum vegum.',
      'Hann er meðal allra langdrægustu rafbíla á Íslandi og drífur lengra en flestir í sínum verðflokki, sem þýðir að vetrarkuldi veldur sjaldan áhyggjum. Bíllinn er jafnframt meðal þeirra sem hlaða hraðast á landinu, þannig að hleðsluhlé á langferðum verða óvenju stutt og tefja för sáralítið.',
      'Stærsti gallinn við íslenskar aðstæður er að bíllinn er afturhjóladrifinn. Í snjó og hálku væru fjórhjóladrifnir bílar eins og Porsche Macan 4s Electric eða jeppinn BMW iX xDrive 45 Sport mun hentugri kostur, þótt hleðslustoppin séu um 45% lengri hjá Macan og um 140% lengri hjá iX. Mercedes-Benz CLA AMG 45 4MATIC+ býður einnig upp á fjórhjóladrif á lægra verði, en rúmar aðeins fjóra.',
      'Porsche Taycan Plus er heillandi langferðabíll sem hleður eldsnöggt, en krefst þess að eigandinn sætti sig við afturhjóladrif yfir erfiðustu vetrarmánuðina.',
    ],
    facts: 'a72a8541bd98',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'dda528e0d78f',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann hleður með þeim hröðustu, en drífur styttra en flestir á sama verði.',
    ],
    facts: '3f13c5d34759',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er fjórhjóladrifinn, drífur lengra en flestir og er meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '2c42b54ca231',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4s Cross Turismo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: '088728deac3c',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er meðal þeirra langdrægustu, með 642 km, meðal þeirra sem hlaða hraðast og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'f692ce51b5b3',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '89d7d6d210cb',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er meðal þeirra langdrægustu, sneggstu og aflmestu á listanum, og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna.',
    ],
    facts: '4eac3f04344a',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '7d546273af52',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: '809a7020da23',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '709a5fdc0857',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric EV450 er meðal dýrustu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður hægar og er meðal þeirra hægustu.',
    ],
    facts: '216b5c4c82e0',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er meðal dýrustu og aflmestu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '7d553bed6445',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er lipur smábíll með skemmtilegu retro-útliti sem sker sig úr í umferðinni. Hann er sniðinn að þeim sem aka langmest innanbæjar, vilja bíl sem auðvelt er að leggja í þröng stæði og hentar vel sem annar bíll heimilisins eða fyrir minni heimili.',
      'Stærsti kosturinn er kaupverðið, en hann er meðal þeirra ódýrustu af rafbílum hér á landi. Lítil rafhlaða gerir það að verkum að einfalt og ódýrt er að fullhlaða bílinn heima yfir nótt fyrir hefðbundið daglegt skutl.',
      'Á móti kemur að drægnin er meðal þeirra stystu og bíllinn hleður hægar en flestir í sínum verðflokki, sem kemur niður á honum á langferðum og í vetrarkulda. Ef ætlunin er að aka reglulega milli landshluta býður Hyundai INSTER Long Range til dæmis upp á 70 km meiri drægni og um 15% styttri hleðslustopp á sama verði. Þá er Kia EV2 Standard Range 500.000 kr. ódýrari.',
      'Renault R5 E-Tech er heillandi og lipur kostur í bæinn, en krefst málamiðlana ef ætlunin er að leggja oft í lengri ferðalög.',
    ],
    facts: 'd6b5c1746164',
    model: 'gemini-3.8-flash, thinking high',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, svo hann hentar best í daglegan akstur.',
    ],
    facts: 'd6f71b54b2fb',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er ódýrari en flestir en drífur styttra og hleður hægar en flestir, og er meðal þeirra hægustu og aflminnstu. Hann hentar þeim sem aka mest innanbæjar.',
    ],
    facts: 'f4f8925cd6d8',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech EV87 er ódýrari en flestir en drífur lengra en flestir, með 623 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: 'c6e8a1afda6a',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'a0c4aa967a45',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er hagnýtur og þægilegur fjölskyldubíll sem hentar þeim sem vilja mikla drægni án þess að sprengja kostnaðinn. Hann sker sig úr með því að vera ódýrari en flestir rafbílar á Íslandi og meðal þeirra allra ódýrustu á hvern kílómetra drægni.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu. Drægnin dugar auðveldlega á milli landshluta, jafnvel í vetrarkulda þar sem raunveruleg drægni dregst nokkuð saman. Hann hleður hraðar en flestir bílar á svipuðu verði, sem þýðir styttri hleðslustopp á langferðum, auk þess að vera aflmeiri en flestir þeirra í daglegum akstri.',
      'Helsti fyrirvarinn er að hann er afturhjóladrifinn. Fyrir þá sem vilja meira grip í vetrarfærð býður Hongqi EHS5 upp á fjórhjóladrif og um 25% styttri hleðslustopp fyrir 200.000 kr. meira, en gefur eftir í drægni.',
      'Fyrir þá sem leita að rúmgóðum og langdrægum jepplingi er Elroq 85 sérlega skynsamlegt val sem gefur mikið fyrir peningana.',
    ],
    facts: '854fd4da41e0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er meðal þeirra ódýrustu á hvern km drægni og hleður hraðar en flestir.',
    ],
    facts: 'b96e9d7e8c9a',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Í flestu öðru er hann í meðallagi, bæði á listanum og miðað við bíla á svipuðu verði.',
    ],
    facts: '7b62f0e932ac',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er fjórhjóladrifinn og ódýrari á hvern km drægni en flestir, á verði í meðallagi. Hann er hægari en flestir og í meðallagi í hleðslu.',
    ],
    facts: '736aa237e05e',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er fjórhjóladrifinn og dýrari en flestir, en í meðallagi í nánast öllu sem tölurnar mæla. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '134c04397a83',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er sjö sæta og fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '26b32d8a9473',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri og aflmeiri en flestir.',
    ],
    facts: '30c342608c6d',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu miðað við bíla á svipuðu verði. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: 'b81624188033',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '37b67d47d275',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '83bd9755cea2',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'b1fb76b375a2',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði er hann sneggri og aflmeiri en flestir.',
    ],
    facts: 'cf21101e07be',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er kraftmikill, fjórhjóladrifinn jepplingur sem skarar verulega fram úr í afli og snerpu miðað við verð. Hann hentar þeim sérstaklega vel sem leita að liprum og öruggum bíl með miklu afli og góðu gripi í hálku og snjó á íslenskum vegum.',
      'Á löngum leiðum nýtur hann stórrar rafhlöðu og drífur lengra en flestir bílar á svipuðu verði, sem veitir gott öryggi í vetrarkulda milli landshluta. Það sem munar þó mest um í daglegu lífi er að hann er meðal þeirra sem hlaða hraðast, sem styttir stopp við hraðhleðslustöðvar til muna.',
      'Ford Mustang Mach-E LR AWD býður upp á örlítið meiri drægni fyrir 100.000 kr. hærra verð, en hleðslustoppin í honum eru um 90% lengri. Viljir þú spara má nefna Kia EV5, sem er 99.000 kr. ódýrari en kemur aðeins með framhjóladrifi og talsvert minna afli.',
      'Fyrir þá sem meta mikil afköst, öruggt fjórhjóladrif og stutt hleðslustopp á ferðalögum er Smart #5 Pulse sérlega hagstæður kostur.',
    ],
    facts: '83e04f571366',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er aflmestur bíla á svipuðu verði og meðal þeirra sneggstu á listanum. Hann er dýrari en flestir og í meðallagi að drægni.',
    ],
    facts: '5c7dc93cc2ea',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er fjórhjóladrifinn, sneggri og aflmeiri en flestir, á verði í meðallagi. Drægni og hleðsla eru í meðallagi.',
    ],
    facts: 'edde5f48d3ad',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er fjórhjóladrifinn og sneggri en flestir, á verði í meðallagi. Í drægni og hleðslu er hann í meðallagi.',
    ],
    facts: '4ecb88ec078d',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er fjórhjóladrifinn, ódýrari en flestir og sneggri en flestir. Hann drífur styttra en flestir en er ódýrari á hvern km drægni en flestir.',
    ],
    facts: '83685783dc51',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar helst þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: 'd7c7e33a9fd8',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Afturhjóladrif er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu, sneggstu og þeirra sem hlaða hraðast.',
    ],
    facts: 'a9b5c98f3078',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range með afturhjóladrifi er lágur og rennilegur fólksbíll sem sker sig fyrst og fremst úr fyrir mikla drægni. Með 750 km uppgefna drægni kemst hann lengst allra bíla í sínum verðflokki og er meðal þeirra allra langdrægustu á landinu. Hann hentar sérstaklega vel þeim sem aka mikið milli landshluta og vilja geta treyst á mikla drægni í vetrarkulda án þess að hugsa stöðugt um hleðslu.',
      'Bíllinn er ódýrari en flestir rafbílar og er ódýrastur allra á hvern kílómetra drægni. Hann er einnig sneggri og aflmeiri en flestir bílar á svipuðu verði. Þá er hann meðal þeirra sem hlaða hraðast í sínum flokki, svo hleðslustopp á langferðum tefja lítið.',
      'Á móti kemur að lág bygging og afturhjóladrif henta síður þegar færð spillist í miklum snjó eða á grófum slóðum. Ef meiri veghæð skiptir máli væri jepplingur eins og Skoda Elroq 85 fýsilegri kostur, þótt hann bjóði upp á 171 km minni drægni og um 30% lengri hleðslustopp. Ef kaupverðið ræður mestu er Nissan Leaf Extended Range auk þess 300.000 kr. ódýrari.',
      'Fyrir þá sem vilja hámarksdrægni og lipran akstur fyrir peninginn er þessi Model 3 engu að síður eitt allra hagkvæmasta valið á markaðnum í dag.',
    ],
    facts: '2fb3560a683e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-long-range-fjorhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Fjórhjóladrif er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er meðal þeirra sneggstu miðað við bíla á svipuðu verði.',
    ],
    facts: '2e5f5056f3d9',
  },
  'tesla-model-3-performance': {
    paragraphs: [
      'Tesla Model 3 Performance er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir.',
    ],
    facts: 'e4eeae096e55',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er rúmgóður fjölskyldujepplingur þar sem mikið innanrými og ríkulegt farangurspláss eru í fyrirrúmi. Hann hentar sérlega vel fjölskyldum sem þurfa pláss fyrir barnastóla og mikinn farangur, og leita að hagkvæmum ferðabíl sem smellur inn í daglega rútínu.',
      'Í sínum verðflokki drífur bíllinn lengra en flestir og er aflmeiri en flestir aðrir. Hann er ódýrari á hvern kílómetra drægni en flestir rafbílar hér á landi og hleður hraðar en gengur og gerist á svipuðu verði. Hleðslustopp á langferðum eru til dæmis um 40% lengri á Hyundai Kona Electric.',
      'Á móti kemur að bíllinn er eingöngu afturhjóladrifinn, sem krefst meiri aðgátar í ófærð og snjó á íslenskum vetrardögum. Fyrir þá sem vilja mun stærri rafhlöðu er Leapmotor C10 ProMax fýsilegur kostur, en Volkswagen ID.3 Neo hentar betur þeim sem leita að minni og liprari borgarbíl með um 10% styttri hleðslustoppum.',
      'Fyrir kaupendur sem vilja mikið pláss og mikla drægni fyrir aurinn er Model Y Standard Range eitt heildstæðasta valið á markaðnum.',
    ],
    facts: 'cfe67b562377',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '20b24ee73012',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og aflmestu miðað við bíla á svipuðu verði.',
    ],
    facts: 'a556e4e8d671',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er meðal sneggstu og aflmestu bílanna á listanum, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: '36f58db16db2',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X er hár og þægilegur fjölskyldujepplingur sem hentar vel í daglega rútínu og ferðalög innanlands. Hann einkennist af traustri nálgun Toyota á notagildi og rólegum akstri, þar sem hversdagsleg þægindi sitja í fyrirrúmi fremur en mikill kraftur.',
      'Helsti styrkur bílsins er hversu vel hann nýtir orkuna. Hann drífur lengra en flestir bílar í sínum verðflokki, sem kemur sér vel í íslenskum vetrarkulda og á löngum ferðalögum milli landshluta. Að auki hleður hann hraðar en flestir á svipuðu verði, svo áningar á hraðhleðslustöðvum verða styttri. Þetta gerir hann ódýrari á hvern kílómetra drægni en flesta aðra rafbíla hér á landi.',
      'Helsti gallinn er að þessi gerð er framhjóladrifin, aflminni og hægari í hröðun en flestir sambærilegir bílar. Ef þú ekur mikið í ófærð eða vilt meiri snerpu eru bæði Skoda Elroq RS og Polestar 2 fjórhjóladrifnir og mun sneggri af stað fyrir svipað verð.',
      'Fyrir þá sem vilja rúmgóðan ferðabíl með mikla drægni og lipra hleðslu á skynsömu verði er bZ4X engu að síður traustur kostur.',
    ],
    facts: '0aad5d8e50a4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-awd': {
    paragraphs: [
      'Toyota bZ4X AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: '5d04bdbb296a',
  },
  'toyota-bz4x-touring-base': {
    paragraphs: [
      'Toyota bZ4X Touring drífur lengra en flestir og hleður hraðar en flestir bílar á svipuðu verði. Hann er dýrari en flestir og hægari og aflminni en flestir.',
    ],
    facts: '4430e8e0ec93',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er fjórhjóladrifinn, sneggri og aflmeiri en flestir, en dýrari en flestir. Hann hleður hægar en flestir og er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '18930aad052a',
  },
  'toyota-c-hr-base': {
    paragraphs: [
      'Toyota C-HR+ er ódýrari en flestir en drífur styttra en flestir, með einni af minnstu rafhlöðunum, og er meðal þeirra aflminnstu.',
    ],
    facts: '78eee388eeb9',
  },
  'toyota-c-hr-77-kwh': {
    paragraphs: [
      'Toyota C-HR+ er rennilegur og nettur jepplingur sem hentar vel þeim sem leita að hagnýtum og áreiðanlegum bíl til daglegra nota. Hann leggur meiri áherslu á áhyggjulausan akstur og nýtni en mikinn spyrnukraft, með framhjóladrifi sem dugar prýðilega í hefðbundinn akstur.',
      'Helsti styrkleiki bílsins er drægnin, en hann drífur lengra en flestir rafbílar og er meðal þeirra langdrægustu í sínum verðflokki. Íslenskur vetrarkuldi ætti því ekki að koma í veg fyrir ferðalög milli landshluta. Þar að auki hleður hann hraðar en flestir á langferðum og er meðal þeirra ódýrustu á hvern kílómetra drægni sem völ er á hér á landi.',
      'Á móti kemur að bíllinn er aflminni og hægari en flestir á svipuðu verði. Framhjóladrifið getur einnig látið undan í mikilli fannfergi eða á bröttum hálkuvegum. Fyrir þá sem þurfa meiri kraft og öryggi fjórhjóladrifs að vetrarlagi eru Polestar 2 eða Ford Capri álitlegri kostir.',
      'Á heildina litið er Toyota C-HR+ einkar skynsamlegur kostur fyrir þá sem setja mikla drægni og skjóta hleðslu í forgang án þess að greiða umframverð fyrir það.',
    ],
    facts: 'd421ea0aac8c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og hleður hægar en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '83cb018c4f63',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: 'f0d18eae8555',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '59379ced9043',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser Active FWD er ódýrari en flestir en drífur styttra en flestir, hleður með þeim hægustu og er meðal þeirra aflminnstu. Hann hentar helst innanbæjar.',
    ],
    facts: '64536f9dc71c',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: 'd9aeb0b9edaa',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '5385fed6e084',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '34da995b7888',
  },
  'volkswagen-id-cross-base': {
    paragraphs: [
      'Volkswagen ID. Cross er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann drífur styttra en flestir, en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '45f187817b79',
  },
  'volkswagen-id-3-pro': {
    paragraphs: [
      'Volkswagen ID.3 Pro er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'de4703c863af',
  },
  'volkswagen-id-3-neo-58-kwh': {
    paragraphs: [
      'Volkswagen ID.3 Neo 58 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '12a0c6f371ef',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er fjórhjóladrifinn og í meðallagi í öllu sem tölurnar mæla, bæði á listanum og miðað við bíla á svipuðu verði. Hann er jafn bíll án sérstakra styrkleika eða veikleika.',
    ],
    facts: '65b5193b7488',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION er fjölskylduvænn jepplingur sem höfðar sérstaklega til þeirra sem leita að hefðbundnum og öruggum vetrarbíl. Fjórhjóladrifið tryggir gott veggrip í snjó og hálku, og bíllinn fellur vel að daglegu lífi með góðu jafnvægi á milli þæginda og rýmis.',
      'Í sínum verðflokki drífur hann lengra en flestir og er ódýrari á hvern kílómetra drægni en gengur og gerist. Rafhlaðan er stærri en í flestum bílum á svipuðu verði, sem kemur sér vel á ferðum á milli landshluta þar sem drægnin dugar vel þótt vetrarkuldinn bíti á hana. Hann hleður jafnframt hraðar en flestir í sama verðflokki, sem styttir viðkomur við hleðslustöðvar úti á landi.',
      'Á móti kemur að hröðun og afl eru í meðallagi og hann gefur eftir í snerpu gagnvart keppinautunum. XPENG G6 AWD Performance er til dæmis talsvert sneggri og býður upp á um 25% styttri hleðslustopp, auk þess sem hleðslustoppin eru um 40% styttri á Hyundai IONIQ 5 Long Range AWD. Fyrir þá sem vilja mikla drægni á hagstæðu verði og yfirvegaðan vetrarbíl er ID.4 engu að síður traustur kostur.',
    ],
    facts: 'c4a184d802f3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er með stærri rafhlöðu en flestir. Hann er dýrari en flestir.',
    ],
    facts: '52858135416f',
  },
  'volvo-ec40-recharge-twin': {
    paragraphs: [
      'Volvo EC40 Recharge Twin er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er sneggri og aflmeiri en flestir. Hann er dýrari en flestir.',
    ],
    facts: '51b9529f9a54',
  },
  'volvo-es90-twin-motor': {
    paragraphs: [
      'Volvo ES90 Twin Motor er meðal þeirra langdrægustu, með 679 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: '0e40ddb119b7',
  },
  'volvo-es90-twin-motor-performance': {
    paragraphs: [
      'Volvo ES90 Twin Motor Performance er meðal þeirra langdrægustu, sneggstu og aflmestu, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: 'b3e42392fb8e',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er fjórhjóladrifinn, sneggri og aflmeiri en flestir. Hann er dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: '5c9dd30ae76d',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er nettur og lipur bíll sem hentar sérstaklega vel í daglegan innanbæjarakstur og styttri ferðir. Hann er afturhjóladrifinn og ódýrari en flestir rafbílar á landinu, sem gerir hann að tiltölulega aðgengilegum kosti inn í rafbílaúrval Volvo.',
      'Helsti styrkleiki hans er vélaraflið, því í sínum verðflokki er hann bæði sneggri og aflmeiri en flestir. Þetta skilar sér í mikilli lipurð í borgarumferð og snöggri svörun við framúrakstur.',
      'Á móti kemur að rafhlaðan og drægnin eru með því minnsta sem gerist í þessum verðflokki, sem reynir á í íslenskum vetrarkulda, auk þess sem hann hleður hægar en flestir. Fyrir þá sem vilja fjórhjóladrif í snjó og hálku býður Smart #1 Pulse upp á fjórhjóladrif, 56 km meiri drægni og um 15% styttri hleðslustopp fyrir aðeins 100.000 kr. meira, eða Suzuki e Vitara 4x4 AllGrip sem er einnig fjórhjóladrifinn og kemst 51 km lengra.',
      'EX30 er því lipur og skemmtilegur borgarbíll, en síður sniðinn fyrir þá sem aka reglulega langferðir milli landshluta yfir vetrarmánuðina.',
    ],
    facts: '1dbcafd62fbd',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex30-single-motor-extended-range': {
    paragraphs: [
      'Volvo EX30 Single Motor Extended Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir.',
    ],
    facts: 'a2ede041531a',
  },
  'volvo-ex30-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum, ódýrari en flestir. Hann drífur þó styttra en flestir.',
    ],
    facts: 'd369d9b20156',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '846a79cfbc8a',
  },
  'volvo-ex60-p10': {
    paragraphs: [
      'Það sem helst greinir Volvo EX60 P10 frá svipuðum bílum er að hann er hár jepplingur með 2.400 kg dráttargetu og 1.674 lítra hámarksrými, á meðan helstu keppinautar eru flestir lágir langbakar. Hann hentar einkar vel þeim sem vilja háa sætisstöðu og öflugan ferðabíl fyrir krefjandi íslenskar aðstæður.',
      'Drægnin er meðal þeirra langdrægustu af öllum rafbílum hér á landi og hann hleður hraðar en flestir í sínum verðflokki, sem gerir vetrarferðir milli landshluta áhyggjulausar. Hann er jafnframt aflmeiri og sneggri en flestir á svipuðu verði, sem tryggir mikið öryggi við framúrakstur og í erfiðri færð.',
      'Á móti kemur að hann er dýrari en flestir af rafbílum hér á landi. Ef drægnin ræður öllu gæti Mercedes-Benz CLA Shooting Brake 350 4MATIC hentað betur með um 15% styttri hleðslustopp, þótt hann dragi aðeins 1.800 kg og hafi minna skottrými. Einnig býður Audi Q6 e-tron upp á 64 lítra framskott á móti 52 lítrum í Volvo.',
      'Þetta eru góð kaup fyrir þá sem leita að hávöxnum ferðabíl með mikla dráttargetu og örugga drægni í vetrarkulda. Fyrir þá sem aka aðallega innanbæjar eða vilja frekar lágan og rennilegan bíl er óþarfi að borga fyrir allan þennan vöðvamassa.',
    ],
    facts: 'a5909cfd01ce',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex60-p12': {
    paragraphs: [
      'Volvo EX60 P12 drífur lengst bíla á svipuðu verði, 810 km, og hefur stærstu rafhlöðuna í þeim hópi. Hann er líka meðal þeirra sneggstu, aflmestu og þeirra sem hlaða hraðast.',
    ],
    facts: 'dfac4e58fd9b',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '198f43cf5f7f',
  },
  'volvo-ex90-twin-motor-performance': {
    paragraphs: [
      'Volvo EX90 Twin Motor Performance er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'a23ee4a76bae',
  },
  'xpeng-g6-rwd-standard-range': {
    paragraphs: [
      'XPENG G6 RWD Standard Range er ódýrari en flestir og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann drífur þó styttra en flestir.',
    ],
    facts: 'd19809f0083d',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 Long Range er rúmgóður jepplingur sem einkennist af mikilli orkugetu og snarpri hleðslutækni. Hann hentar sérlega vel þeim sem aka reglulega langar vegalengdir milli landshluta og vilja lágmarka biðtíma við hraðhleðslustöðvar.',
      'Bíllinn drífur lengra en flestir rafbílar hér á landi og er meðal þeirra ódýrustu á hvern kílómetra drægni. Í sínum verðflokki er hann með eina stærstu rafhlöðuna, sem veitir aukið öryggi í vetrarkulda þegar drægnin dregst saman. Á langferðum er hann jafnframt meðal þeirra sem hlaða hraðast, sem gerir hleðslustoppin óvenju stutt.',
      'Helsta fórnin er að bíllinn er eingöngu afturhjóladrifinn. Ef veggrip í snjó og vetrarfærð skiptir meira máli gæti Skoda Elroq 85x verið betri kostur með fjórhjóladrifi á svipuðu verði, þótt hleðslustoppin verði á móti um 35% lengri.',
      'Fyrir ökumenn sem treysta afturhjóladrifinu er þetta sérlega hagkvæmur langferðabíll sem kemst langt og tefur lítið.',
    ],
    facts: 'e1aec00acaa1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu á listanum. Hann drífur lengra og hleður hraðar en flestir, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: 'edf5bd30c2ba',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og sneggri og aflmeiri en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '21ec7198ea17',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er sjö sæta og hleður hraðast allra bíla á listanum, með einni af stærstu rafhlöðunum. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: 'ac75f896cbc6',
  },
}

export default carReviews
