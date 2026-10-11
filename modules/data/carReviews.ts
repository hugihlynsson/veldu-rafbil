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
      'Audi SQ6 e-tron er meðal dýrustu bílanna á listanum, sneggri og aflmeiri en flestir og drífur lengra en flestir. Verð á hvern km drægni er þó meðal þess hæsta, svo hann er fyrir þá sem vilja afl og eru ekki að spara.',
    ],
    facts: '6be7cb5413e8',
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
      'BMW iX1 eDrive 20 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann hentar best í rólegan daglegan akstur.',
    ],
    facts: '5170bc1d9003',
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
      'BMW iX3 50 xDrive er meðal þeirra langdrægustu á listanum, með 805 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn og dýrari en flestir, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'fb86aa548d6e',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu, svo hann hentar best í innanbæjarakstur og styttri ferðir.',
    ],
    facts: 'a075d76dc9ac',
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
      'BYD Sealion 7 er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir.',
    ],
    facts: 'e5798dfbadee',
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
      'Fiat 600e er ódýrari en flestir en meðal þeirra sem drífa styst og meðal þeirra hægustu og aflminnstu. Hann hentar best í daglegan akstur innanbæjar.',
    ],
    facts: '5cb3f7454b4f',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, sem gerir hann að sterkum kosti á langferðum.',
    ],
    facts: 'f3e474e1f35f',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er ódýrari á hvern km drægni en flestir og traustur kostur fyrir íslenskar aðstæður.',
    ],
    facts: '9eb36bb10329',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er fjórhjóladrifinn og drífur lengra en flestir, með einni af stærstu rafhlöðunum miðað við bíla á svipuðu verði. Hann hleður þó hægar en flestir, sem lengir hleðslustoppin á langferðum.',
    ],
    facts: '01e9d7fa4b33',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '13dd726fc66c',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er ódýrari en flestir en fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: 'c1ddd31fa032',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er fjórhjóladrifinn, meðal þeirra aflmestu og sneggstu, og með stærstu rafhlöðuna miðað við bíla á svipuðu verði. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir á sama verði.',
    ],
    facts: 'b1727237dbbf',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu, hleður hægt og er aflminni en flestir, svo hann hentar best innanbæjar.',
    ],
    facts: '6832195fd771',
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
      'Hyundai IONIQ 5 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast á listanum, sá hraðasti miðað við bíla á svipuðu verði. Hann drífur lengra en flestir á sama verði og er ódýrari á hvern km drægni en flestir.',
    ],
    facts: 'ec32ba1494cf',
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
      'Hyundai Kona Electric 65 kWh er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en hleður hægar en flestir.',
    ],
    facts: 'd2efebe3c86d',
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
      'Jeep Avenger er ódýrari en flestir en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem bíll í daglegan akstur innanbæjar.',
    ],
    facts: '44e951bb483e',
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
      'KGM Torres EVX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er þó hægari, aflminni og hleður hægar en flestir.',
    ],
    facts: '0f8f89fb8ee1',
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
      'Kia EV4 er meðal þeirra langdrægustu, með 625 km, og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '7a4f0374acac',
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
      'Kia EV6 2025 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast, á verði í meðallagi. Hann er sneggri en flestir og ódýrari á hvern km drægni en flestir.',
    ],
    facts: 'f4b80134c57d',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '17a8cbfdb49d',
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
      'Mercedes-Benz CLA 350 4MATIC er meðal þeirra langdrægustu á listanum, með 770 km, og meðal þeirra sem hlaða hraðast. Hann er ódýrastur bíla á svipuðu verði á hvern km drægni, sem gerir hann að einum besta langferðabílnum í sínum verðflokki.',
    ],
    facts: '4cb076da8aba',
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
      'Mercedes-Benz EQA SUV 300 4MATIC er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra, hleður hægar og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði hleður hann með þeim hægustu.',
    ],
    facts: 'b69d33295c87',
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
      'Mini Countryman E er á verði í meðallagi en drífur styttra, hleður hægar og er meðal þeirra hægustu. Miðað við bíla á svipuðu verði er hann með einni af minnstu rafhlöðunum.',
    ],
    facts: '007a7b244e00',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra og hleður hægar en flestir. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '81432d844745',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er á verði í meðallagi, með stærri rafhlöðu en flestir og ódýrari á hvern km drægni en flestir. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: 'ebf917d159a6',
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
      'Nissan Leaf Extended Range er ódýrari en flestir en drífur lengra en flestir, með 622 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er sterkur langferðabíll fyrir verðið.',
    ],
    facts: 'd634205f4f90',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er sjö sæta og meðal ódýrustu bílanna á listanum. Hann er þó meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir.',
    ],
    facts: '6966a929a05b',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '10b4052276f8',
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
      'Peugeot e-5008 er sjö sæta og ódýrari en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: 'b47a6957b868',
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
      'Polestar 3 er meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er fjórhjóladrifinn og dýrari en flestir, og hleður hægar en flestir bílar á svipuðu verði.',
    ],
    facts: '607b219a4925',
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
      'Porsche Taycan Plus er meðal þeirra langdrægustu, með 678 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og meðal dýrustu bílanna á listanum.',
    ],
    facts: 'a72a8541bd98',
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
      'Renault R5 E-Tech er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: 'd6b5c1746164',
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
      'Skoda Elroq 85 er ódýrari en flestir en drífur lengra en flestir, með 579 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er í meðallagi að afli, sem gerir hann að jöfnum og hagkvæmum langferðabíl.',
    ],
    facts: '854fd4da41e0',
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
      'Smart #5 Pulse er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '83e04f571366',
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
      'Tesla Model 3 Long Range Afturhjóladrif er ódýrasti bíllinn á listanum á hvern km drægni og meðal þeirra langdrægustu, með 750 km. Hann hleður hraðar og er sneggri en flestir, svo fáir bílar gefa meira fyrir peninginn á langferðum.',
    ],
    facts: '2fb3560a683e',
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
      'Toyota bZ4X drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er framhjóladrifinn og hægari og aflminni en flestir.',
    ],
    facts: '0aad5d8e50a4',
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
      'Toyota C-HR+ 77 kWh drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu miðað við bíla á svipuðu verði, en hægari og aflminni en flestir.',
    ],
    facts: 'd421ea0aac8c',
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
      'Volvo EX30 Single Motor er ódýrari en flestir en meðal þeirra sem drífa styst, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: '1dbcafd62fbd',
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
      'XPENG G6 RWD Long Range er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er með stærri rafhlöðu en flestir.',
    ],
    facts: 'e1aec00acaa1',
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
