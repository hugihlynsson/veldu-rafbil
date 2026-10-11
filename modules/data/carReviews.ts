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
      'Audi A6 e-tron Sportback quattro er stór fólksbíll sem sameinar mikla drægni, mikið afl og fjórhjóladrif. Hann hentar þeim sem vilja lágvaxinn lúxusbíl fyrir langferðir frekar en hefðbundinn jeppling.',
      'Hann er meðal þeirra langdrægustu af rafbílum hér á landi og hleður hraðar en flestir í sínum verðflokki. Rafhlaðan er stærri en gengur og gerist, sem veitir gott öryggi í vetrarkulda og gerir hleðslustopp á langferðum sérlega stutt. Fjórhjóladrifið tryggir öruggt grip í snjó og hálku, auk þess sem bíllinn ræður við 2.100 kg drátt.',
      'Hins vegar er þetta lágur bíll sem hefur minni veghæð og minna heildarflutningsrými en jepplingar á borð við Volvo EX60 P10 eða Audi Q6 e-tron. Ef meiri drægni og lægra verð skipta mestu máli kemur Mercedes-Benz CLA 350 4MATIC til greina, en sá bíll er styttri og með talsvert minna farangursrými.',
      'Þetta eru góð kaup fyrir þá sem aka reglulega langar vegalengdir og vilja snöggan, rúmgóðan ferðabíl sem lágmarkar tímann við hleðslustöðvar. Hann hentar síður þeim sem þurfa háa setstöðu eða aukna veghæð fyrir óslétta vegi.',
    ],
    facts: 'c29b4a896da0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er stór og aflmikill rafknúinn langbakur með fjórhjóladrifi. Hann hentar einkum þeim sem aka mikið milli landshluta og þurfa mikið rými í krefjandi vetraraðstæðum án þess að velja hefðbundinn jeppling.',
      'Drægnin er meðal þeirra allra mestu hér á landi, sem veitir mikið öryggi í vetrarkulda og langkeyrslu. Hraðhleðslan er einnig meðal þeirra hröðustu af öllum rafbílum, sem styttir stopp á ferðalögum til muna. Þá er bíllinn sneggri en flestir í sínum verðflokki og býður upp á 2.100 kg dráttargetu og 502 lítra farangursrými.',
      'Hann er þó dýrari en flestir af rafbílum á markaðnum. Ef hámarksdrægni og hleðsla skipta öllu máli hefur Audi A6 e-tron Avant quattro 69 km minni drægni en Mercedes-Benz CLA Shooting Brake 350 4MATIC og er 6,4 km/mín hægari, þótt sá síðarnefndi sé 200.000 kr. dýrari. Þá hefur hann 35 kW minna afl en Volvo EX60 P10, sem er 100.000 kr. dýrari.',
      'Þetta eru góð kaup fyrir þá sem vilja öflugan langferðabíl með mikla dráttargetu og hraða hleðslu á ferðalögum. Fyrir þá sem vilja háa sætisstöðu eða leita að hagkvæmari kosti er skynsamlegra að líta annað.',
    ],
    facts: 'c6925ebfc30d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er lágvaxinn og hraðskreiður lúxussportbíll með fjórhjóladrifi, sem hentar einkum þeim sem setja akstursánægju og kraft í fyrsta sæti.',
      'Stærstu kostir bílsins felast í hröðun og afli, enda er hann bæði sneggri og aflmeiri en flestir bílar í sínum verðflokki. Fjórhjóladrifið veitir traust grip í snjó og hálku, og í langferðum hleður hann hraðar en flestir rafbílar hér á landi.',
      'Hins vegar er fórnað töluverðu notagildi; bíllinn hefur enga dráttargetu og farangursrýmið er 405 lítrar auk 85 lítra framskotts. Drægnin er jafnframt meðal þeirra sem drífa styst á svipuðu verði, en bíllinn er með 155 km minni drægni og er 8 km/mín hægari í hraðhleðslu en Porsche Cayenne.',
      'Þetta eru góð kaup fyrir ökumanninn sem leitar að sportlegum bíl með miklum afköstum. Fyrir þá sem þurfa meira pláss fyrir fjölskylduna, vilja geta dregið kerru eða þurfa hámarksdrægni yfir vetrarmánuðina er hins vegar betra að horfa annað.',
    ],
    facts: '3b8461221327',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro sker sig helst úr meðal svipaðra bíla með því að vera aflminni og hlaða hægar en flestir í sínum verðflokki, þótt hann bjóði gott pláss í lipru formi. Hann hentar best þeim sem setja öruggan hversdagsakstur ofar mikilli snerpu og hröðum langferðum.',
      'Fjórhjóladrifið veitir gott veggrip í snjó og hálku yfir vetrarmánuðina. Farangursrýmið er 520 lítrar og rúmar kerrur og ferðatöskur án fyrirhafnar, auk þess sem 590 kg burðargeta ræður vel við fimm farþega ásamt þungum farangri.',
      'Á móti kemur að í sínum verðflokki drífur hann styttra en flestir og dregur 1.200 kg, á meðan keppinautar eins og Smart #5 Brabus draga 1.600 kg. Fyrir þá sem vilja komast hratt milli landshluta býður Smart #5 Brabus upp á um 40% styttri hleðslustopp og er 2,8 s sneggri í 0-100 km/klst.',
      'Hann eru góð kaup fyrir fólk sem ekur mest í nærumhverfinu og vill traust aldrif ásamt góðu skotti. Fyrir þá sem aka oft á milli landshluta eða vilja sem mest afköst fyrir peninginn eru keppinautarnir mun hagkvæmari kostur.',
    ],
    facts: '1f82a21f16b4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er stór, fjórhjóladrifinn lúxusjeppi sem hentar vel þeim sem vilja rúmgóðan bíl sem ræður léttilega við krefjandi íslenskar vetraraðstæður.',
      'Drægnin er meðal þeirra allra bestu á landinu og dugar vel milli landshluta í frosti, auk þess sem hann hleður hraðar en flestir rafbílar. Skottið tekur 526 lítra, framskottið 64 lítra og 2.400 kg dráttargeta gerir hann mjög liðtækan fyrir tjaldvagna eða hestakerrur.',
      'Á móti kemur að hann er dýrari en flestir og snerpan er hægari en hjá flestum í þessum verðflokki. Til dæmis er Audi Q6 e-tron 200.000 kr. dýrari og 1,4 s hægari en Audi A6 e-tron Avant quattro, auk þess að vera með 118 km minni drægni en Mercedes-Benz CLA Shooting Brake 350 4MATIC.',
      'Þetta eru heppileg kaup fyrir þá sem vilja hábyggðan dráttarbíl með fjórhjóladrifi og öruggri vetrardrægni. Hafi fólk aftur á móti meiri áhuga á sem mestri drægni eða snarpari hröðun henta lægri fólksbílar betur.',
    ],
    facts: 'c79944bef426',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er stór og sportlegur lúxusjepplingur með fjórhjóladrifi sem hentar vel fjölskyldum og ferðafólki sem þarf mikið pláss og örugga drægni við allar íslenskar aðstæður.',
      'Drægnin er meðal þeirra langdrægustu af rafbílum hér á landi og dugar vel í vetrarkulda milli landshluta, auk þess sem hann er meðal þeirra sem hlaða hraðast. Hann nýtist sérlega vel í langferðir með 2.400 kg dráttargetu, 511 lítra skotti og 64 lítra framskotti.',
      'Á móti kemur að bíllinn er dýrari en flestir rafbílar og hröðunin er hægari en flestir bjóða upp á í svipuðum verðflokki. Sá sem leitar að meiri snerpu og lægra verði ætti frekar að skoða Audi A6 e-tron Avant quattro, en Q6 er 800.000 kr. dýrari, með 37 km minni drægni og 1,4 s hægari upp í hundraðið.',
      'Hann eru góð kaup fyrir þá sem vilja hábyggðan ferðabíl sem ræður léttilega við þungan eftirvagn í vetrarfærð, en síður fyrir þá sem horfa í verðmiðann og vilja sem mesta hröðun fyrir peningana.',
    ],
    facts: '790142142c8b',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er meðal dýrustu bílanna á listanum, sneggri og aflmeiri en flestir og drífur lengra en flestir. Verð á hvern km drægni er þó meðal þess hæsta, svo hann er fyrir þá sem vilja afl og eru ekki að spara.',
    ],
    facts: '4c80f639d199',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'Ólíkt samkeppnisaðilunum í þessum verðflokki, sem eru allir hávaxnir jepplingar, er BMW i4 lágur fólksbíll. Hann hentar þeim sem vilja lipran og hefðbundinn akstursbíl frekar en stóran fjölskyldujeppa.',
      'Af öllum rafbílum hér á landi er hann sneggri og aflmeiri en flestir, sem veitir mikið öryggi við framúrakstur. Fjórhjóladrifið tryggir gott veggrip í snjó og hálku, auk þess sem 1.600 kg dráttargetan ræður vel við flestar kerrur á meðan Lexus RZ 350e má til dæmis aðeins draga 750 kg.',
      'Á móti kemur að í sínum verðflokki drífur hann styttra en flestir og hleður hægar. Fyrir þá sem ferðast mikið milli landshluta er Audi Q6 e-tron Sportback hagstæðari kostur sem býður upp á 91 km meiri drægni, um 35% styttri hleðslustopp og 511 lítra farangursrými á móti 470 lítrum í BMW.',
      'Bíllinn er góður kostur fyrir þá sem leita að snörpum og öflugum bíl með aldrifi fyrir daglegar ferðir, en síður fyrir þá sem þurfa mikið flutningsrými eða sem fæst hleðslustopp á lengri leiðum.',
    ],
    facts: '8bdad30c27ea',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er meðal sneggstu og aflmestu bílanna á listanum, líka miðað við bíla á svipuðu verði. Hann er dýr og drífur styttra en flestir á sama verði, svo hann er fyrst og fremst fyrir þá sem vilja akstursánægju.',
    ],
    facts: 'e714f81b96e0',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er afturhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir og hleður hægar en flestir bílar á svipuðu verði. Hann er í meðallagi að afli og hröðun.',
    ],
    facts: 'cc44dc85b3dc',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er meðal dýrustu, sneggstu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '95d20dc5016d',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og drífur lengra en flestir. Miðað við bíla á svipuðu verði er hann þó aflminni og hleður hægar en flestir.',
    ],
    facts: '73a1a5b12ffa',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er meðal þeirra langdrægustu, með 701 km, og með einni af stærstu rafhlöðunum á listanum. Hann er dýr, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'a5cacafcd978',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann hentar best í rólegan daglegan akstur.',
    ],
    facts: '625703a681ad',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Rafhlaðan er með þeim minnstu miðað við bíla á svipuðu verði, sem kemur niður á langferðum.',
    ],
    facts: '9c5ee3149a46',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er meðal þeirra langdrægustu, með 637 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '33e76d23f8b2',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er meðal þeirra langdrægustu á listanum, með 805 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn og dýrari en flestir, en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'b4be9384bd2d',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu, svo hann hentar best í innanbæjarakstur og styttri ferðir.',
    ],
    facts: '582815a740fa',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu á listanum, á verði í meðallagi. Drægnin er í meðallagi og hann hleður hægar en flestir, sem skiptir máli á langferðum.',
    ],
    facts: 'ab7c66243eec',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er ódýrari en flestir og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og er meðal þeirra hægustu í hröðun. Hann hentar þeim sem vilja mikið fyrir peninginn og aka rólega.',
    ],
    facts: '8c133499e604',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir.',
    ],
    facts: 'f8b15ed13759',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum á listanum. Hann er dýrari en flestir og hleður með þeim hægustu, sem er galli á langferðum.',
    ],
    facts: 'e48281c47c56',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er hins vegar meðal þeirra hægustu og aflminnstu, drífur styttra og hleður hægar en flestir, svo hann hentar helst í daglegan akstur.',
    ],
    facts: '52caee7957cd',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst, með 305 km, og hleður með þeim hægustu. Hann er fjögurra sæta og hentar best sem innanbæjarbíll.',
    ],
    facts: 'c5fdae2800c4',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er ódýrari en flestir en meðal þeirra sem drífa styst og meðal þeirra hægustu og aflminnstu. Hann hentar best í daglegan akstur innanbæjar.',
    ],
    facts: '1b62212bea59',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, sem gerir hann að sterkum kosti á langferðum.',
    ],
    facts: '15e1722d903a',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er ódýrari á hvern km drægni en flestir og traustur kostur fyrir íslenskar aðstæður.',
    ],
    facts: '33eadee9a442',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er fjórhjóladrifinn og drífur lengra en flestir, með einni af stærstu rafhlöðunum miðað við bíla á svipuðu verði. Hann hleður þó hægar en flestir, sem lengir hleðslustoppin á langferðum.',
    ],
    facts: 'cc60afec523a',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: 'fba8950ca2cd',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er ódýrari en flestir en fjórhjóladrifinn og meðal þeirra sneggstu og aflmestu. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: '3a26ecb231e1',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er fjórhjóladrifinn, meðal þeirra aflmestu og sneggstu, og með stærstu rafhlöðuna miðað við bíla á svipuðu verði. Drægnin er þó í meðallagi og hann er dýrari á hvern km drægni en flestir á sama verði.',
    ],
    facts: '64de6486e836',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu, hleður hægt og er aflminni en flestir, svo hann hentar best innanbæjar.',
    ],
    facts: '0a8ae1df1e63',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Drægnin er samt með þeirri stystu og hann hleður hægt, svo hann er helst borgarbíll.',
    ],
    facts: 'abc8214a943a',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er meðal ódýrustu bílanna en meðal þeirra sem drífa styst og hleður með þeim hægustu. Hann er væntanlegur í lok árs 2026 og hentar helst í innanbæjarakstur.',
    ],
    facts: 'c411122aa227',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni, með 496 km. Hann er þó meðal þeirra hægustu og aflminnstu, og væntanlegur í lok árs 2026.',
    ],
    facts: '2a77a47e935b',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast á listanum, sá hraðasti miðað við bíla á svipuðu verði. Hann drífur lengra en flestir á sama verði og er ódýrari á hvern km drægni en flestir.',
    ],
    facts: 'aa760ed6e615',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er dýrari en flestir og hægari en flestir í hröðun.',
    ],
    facts: '5113d20e3bcc',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og meira afl en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '60dc77d9f67c',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric 65 kWh er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en hleður hægar en flestir.',
    ],
    facts: 'c53b4293866e',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric tekur níu manns, á verði í meðallagi. Hann er þó meðal þeirra sem drífa styst og meðal þeirra hægustu, og væntanlegur í lok árs 2026.',
    ],
    facts: '4f50768d94a3',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er ódýrari en flestir en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem bíll í daglegan akstur innanbæjar.',
    ],
    facts: '7824a95c9cc7',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er ódýrari en flestir og með stærri rafhlöðu en flestir. Hann hleður þó með þeim hægustu og er meðal þeirra hægustu í hröðun.',
    ],
    facts: '4a77071a3be2',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er fjórhjóladrifinn en meðal þeirra sem drífa styst og hlaða hægast. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'd583797f9309',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann er þó hægari, aflminni og hleður hægar en flestir.',
    ],
    facts: '998e308981fb',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best sem innanbæjarbíll.',
    ],
    facts: 'b85648cd0ad5',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '17da25dd934a',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'b5cd79173934',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er ódýrari en flestir en drífur lengra en flestir, með 605 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er aflminni en flestir, svo hann er hagkvæmur langferðabíll fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: '10d2aef3c37b',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er ódýrari á hvern km drægni en flestir og hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: '9f38deb941fd',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er meðal þeirra langdrægustu, með 625 km, og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '9b8d137b245e',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir en er hægari og aflminni en flestir.',
    ],
    facts: '420e3a001e1b',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er í meðallagi að verði, drægni og hleðslu. Hann er hægari og aflminni en flestir og framhjóladrifinn, svo hann er fyrir þá sem aka rólega.',
    ],
    facts: '96abe7d7af4b',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er fjórhjóladrifinn og í meðallagi að verði, en drífur styttra og hleður hægar en flestir. Hann er líka hægari og aflminni en flestir.',
    ],
    facts: '3727d302dba7',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 2025 Long Range AWD er fjórhjóladrifinn og meðal þeirra sem hlaða hraðast, á verði í meðallagi. Hann er sneggri en flestir og ódýrari á hvern km drægni en flestir.',
    ],
    facts: '248df424fd26',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '154983da12cd',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir. Hann er meðal dýrustu bílanna og drífur með þeim stystu miðað við bíla á svipuðu verði.',
    ],
    facts: 'a7e33d74b55e',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er sjö sæta og afturhjóladrifinn, á verði í meðallagi. Hann er meðal þeirra hægustu og aflminnstu og drífur styttra en flestir.',
    ],
    facts: '13a67fffbe1b',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er ódýrasti bíllinn á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann er fjögurra sæta, drífur með þeim stystu og hleður hægt, svo hann er eingöngu borgarbíll.',
    ],
    facts: '94b11c7549e3',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst. Hann er væntanlegur í lok árs 2026 og hentar helst innanbæjar.',
    ],
    facts: '4038c1b1673f',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er meðal ódýrustu bílanna og drífur lengra en flestir bílar á svipuðu verði. Miðað við þá hleður hann líka með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'c3254515af19',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra sneggstu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'f1cbfb733d25',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er meðal ódýrustu bílanna og drífur lengst, hleður hraðast og er sneggstur bíla á svipuðu verði. Hann er væntanlegur í lok árs 2026.',
    ],
    facts: '8dcc27772b20',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur með þeim stystu á listanum en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: 'df641aaf1fb0',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 67.1 kWh er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: 'e9da4d68ff7b',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'b98b60fae197',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er ódýrari en flestir og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og er meðal þeirra aflmestu.',
    ],
    facts: '1e02c1df30a4',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu og aflmestu. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: '8c3e92a6bf0e',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði er hann meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '3ddac7977a30',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er fjórhjóladrifinn og meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra og hleður með þeim hægustu.',
    ],
    facts: '842b06dde56e',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er framhjóladrifinn og drífur lengra en flestir, en er dýrari en flestir. Miðað við bíla á svipuðu verði drífur hann styttra og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: '6de7a028e586',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og meðal þeirra dýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '93867d285d12',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er meðal dýrustu bílanna á listanum, fjórhjóladrifinn og sneggri en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '482758ee4f38',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er dýrari en flestir en drífur styttra, hleður með þeim hægustu og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði gefur hann eftir í flestu sem tölurnar mæla.',
    ],
    facts: '4b317c1da02f',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er ódýrari en flestir en drífur lengra en flestir, með 552 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó með þeim hægustu á listanum, sem lengir stoppin á langferðum.',
    ],
    facts: '76205386e173',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e 78 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar en flestir, en er hægari en flestir; hann er væntanlegur haustið 2026.',
    ],
    facts: '60eaf8dfb751',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er meðal þeirra langdrægustu á listanum, með 762 km, meðal þeirra sem hlaða hraðast og meðal þeirra sneggstu. Hann er dýrari en flestir, en ódýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: 'b3dfa4da934b',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er á verði í meðallagi og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann er þó hægari og aflminni en flestir og með minni rafhlöðu.',
    ],
    facts: 'a5db5ffcfdee',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er meðal þeirra langdrægustu á listanum, með 770 km, og meðal þeirra sem hlaða hraðast. Hann er ódýrastur bíla á svipuðu verði á hvern km drægni, sem gerir hann að einum besta langferðabílnum í sínum verðflokki.',
    ],
    facts: '0c0c86edd313',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er meðal þeirra langdrægustu, með 743 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir en meðal þeirra ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '3af9d4e81689',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu, en líka meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er fjögurra sæta og dýrari en flestir.',
    ],
    facts: '73287027040a',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra, hleður hægar og er hægari og aflminni en flestir. Miðað við bíla á svipuðu verði hleður hann með þeim hægustu.',
    ],
    facts: '228cc8da8e7c',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er sjö sæta og fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og drífur lengra en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: 'f13814e31b6c',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: '39255b0620d9',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er meðal þeirra langdrægustu, með 715 km, og meðal þeirra sem hlaða hraðast. Hann er fjórhjóladrifinn, sneggri og aflmeiri en flestir og dýrari en flestir.',
    ],
    facts: '2224c5a2d518',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er meðal dýrustu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður með þeim hægustu og er meðal þeirra hægustu og aflminnstu.',
    ],
    facts: 'a6f6a962feaf',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC drífur lengst allra bíla á listanum, 869 km, og hefur stærstu rafhlöðuna. Hann er meðal dýrustu bílanna en ódýrastur á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '49b821c69644',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er sjö sæta, meðal þeirra langdrægustu og meðal þeirra aflmestu á listanum. Miðað við bíla á svipuðu verði hleður hann þó með þeim hægustu.',
    ],
    facts: '0300c498c53d',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru hægastir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: 'd08f81469184',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 tekur átta manns en er meðal dýrustu bílanna á listanum og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '8014c00c7829',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er átta sæta og meðal þeirra langdrægustu, með 713 km, og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna og meðal þeirra hægustu, og væntanlegur árið 2027.',
    ],
    facts: '8a04f33da265',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er átta sæta og fjórhjóladrifinn, meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum og væntanlegur árið 2027.',
    ],
    facts: 'b88dc0795b5e',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er meðal dýrustu og aflmestu bílanna á listanum. Miðað við bíla á svipuðu verði drífur hann með þeim stystu og hleður með þeim hægustu.',
    ],
    facts: '6fa6a57b6cb3',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin.',
    ],
    facts: 'f930ab5a47e8',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta, fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður með þeim hægustu, svo hann er bíll fyrir aksturinn fremur en langferðir.',
    ],
    facts: '1351c9884e14',
  },
  'mg-mg4-urban-standard-range': {
    paragraphs: [
      'MG MG4 Urban Standard Range er meðal ódýrustu bílanna á listanum og meðal þeirra ódýrustu á hvern km drægni. Hann drífur þó með þeim stystu og hleður hægt, svo hann hentar best innanbæjar.',
    ],
    facts: 'c0601cc9a5ed',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er meðal ódýrustu bílanna og meðal þeirra langdrægustu miðað við bíla á svipuðu verði. Hann er þó meðal þeirra hægustu og aflminnstu á listanum.',
    ],
    facts: '5e47804a6a7f',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra, hleður hraðar og er sneggri en flestir.',
    ],
    facts: '68dfd741fb2b',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur þó styttra og hleður hægar en flestir.',
    ],
    facts: '5c7e3581ce98',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er ódýrari en flestir en meðal þeirra sem drífa styst og hlaða hægast, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: '5230f302a483',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er á verði í meðallagi en drífur styttra, hleður hægar og er meðal þeirra hægustu. Miðað við bíla á svipuðu verði er hann með einni af minnstu rafhlöðunum.',
    ],
    facts: 'e4ad56dc398c',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er fjórhjóladrifinn og á verði í meðallagi, en drífur styttra og hleður hægar en flestir. Hann er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '555694177309',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er á verði í meðallagi, með stærri rafhlöðu en flestir og ódýrari á hvern km drægni en flestir. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: 'c0ef30c5f47c',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er fjórhjóladrifinn og með stærri rafhlöðu en flestir, en hleður með þeim hægustu og drífur styttra en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '9c0518ecbe52',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf Standard Range er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Hann drífur lengra en flestir bílar á svipuðu verði en er hægari en flestir.',
    ],
    facts: '6b765eb04f3c',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er ódýrari en flestir en drífur lengra en flestir, með 622 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er sterkur langferðabíll fyrir verðið.',
    ],
    facts: '533e5eb13a81',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er sjö sæta og meðal ódýrustu bílanna á listanum. Hann er þó meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir.',
    ],
    facts: '2538d8c8124d',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er ódýrari en flestir og ódýrari á hvern km drægni en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '870c096a5c0f',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er fjórhjóladrifinn og á verði í meðallagi. Hann drífur styttra og hleður hægar en flestir, en er í meðallagi að afli og hröðun.',
    ],
    facts: '1c7a6475028d',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 48 kWh er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: '2075b7193cc7',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 54 kWh er meðal ódýrustu bílanna en drífur styttra og er meðal þeirra hægustu og aflminnstu. Miðað við bíla á svipuðu verði hleður hann þó hraðar en flestir.',
    ],
    facts: '7e3ffdf9537b',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er ódýrari en flestir og ódýrari á hvern km drægni en flestir, og drífur lengra en flestir bílar á svipuðu verði. Hann hleður hægar og er aflminni en flestir.',
    ],
    facts: 'a9845af2dfc8',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir bílar á svipuðu verði. Hann hleður þó hægar en flestir.',
    ],
    facts: '5ef0c5ad10a4',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er sjö sæta og ódýrari en flestir, með drægni í meðallagi. Hann er meðal þeirra hægustu og hleður hægar en flestir.',
    ],
    facts: '2375197f2d49',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er sjö sæta og fjórhjóladrifinn, á verði í meðallagi. Hann drífur styttra en flestir og hleður með þeim hægustu miðað við bíla á svipuðu verði.',
    ],
    facts: '42465931972c',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er sjö sæta og ódýrari en flestir, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '42f373e18e8a',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: '445d8bc566c2',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 Long Range Dual Motor er fjórhjóladrifinn, drífur lengra en flestir og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu og sneggri en flestir.',
    ],
    facts: '386f20ec96ea',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir, og drífur lengra og hleður hraðar en flestir. Hann er á verði í meðallagi.',
    ],
    facts: '1d0fc466bdbf',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er meðal þeirra langdrægustu og með einni af stærstu rafhlöðunum. Hann er fjórhjóladrifinn og dýrari en flestir, og hleður hægar en flestir bílar á svipuðu verði.',
    ],
    facts: 'a520055511e0',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er fjórhjóladrifinn, sneggri og aflmeiri en flestir og með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '981e10303296',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor sker sig úr meðal bíla á svipuðu verði með mikilli dráttargetu og stórri rafhlöðu í bland við mikið afl. Þetta hentar sérstaklega þeim sem vilja hraðskreiðan bíl sem getur dregið þungan ferðavagn.',
      'Hann er með einni stærstu rafhlöðunni í sínum verðflokki og drífur lengra en flestir rafbílar hér á landi, sem gefur aukið öryggi í vetrarakstri milli landshluta. Fjórhjóladrifið og aflið skila honum í hóp þeirra allra sneggstu á götunni, og 2.000 kg dráttargetan er meiri en hjá svipuðum bílum.',
      'Á móti er hraðhleðslan aðeins í meðallagi og hleðslustoppin eru til dæmis um 35% styttri hjá Smart #5 Brabus. Einnig er skottið 526 lítrar á meðan Tesla Model Y Performance býður upp á 854 lítra, auk þess að vera 160.000 kr. ódýrari.',
      'Hann er kjörinn fyrir þá sem þurfa mikla dráttargetu og vilja mikla drægni í snörpum fjórhjóladrifnum bíl. Ef markmiðið er hins vegar hámarks farangurspláss eða sem styst hlé við hleðslustöðvar reynast keppinautarnir heppilegri kostur.',
    ],
    facts: '62bd7865151c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 SUV Long Range Dual Motor er meðal sneggstu og aflmestu bílanna, drífur lengra en flestir og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: '38dec40d92b9',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir og í meðallagi miðað við bíla á svipuðu verði.',
    ],
    facts: 'cfabfd4482b9',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4s Electric er meðal sneggstu bílanna á listanum og hleður hraðar en flestir. Hann er meðal þeirra dýrustu.',
    ],
    facts: '9befcce2ba84',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er meðal þeirra langdrægustu, með 678 km, og meðal þeirra sem hlaða hraðast. Hann er afturhjóladrifinn og meðal dýrustu bílanna á listanum.',
    ],
    facts: '949eed4cd0d6',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'ab619e4fa061',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann hleður með þeim hröðustu, en drífur styttra en flestir á sama verði.',
    ],
    facts: 'e7887fdc04d8',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er fjórhjóladrifinn, drífur lengra en flestir og er meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'e6a11ee9ca25',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4s Cross Turismo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: 'b8b6057d019d',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er meðal þeirra langdrægustu, með 642 km, meðal þeirra sem hlaða hraðast og með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '041a88db7827',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er meðal þeirra langdrægustu og meðal þeirra sem hlaða hraðast, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'bdf9ceda4421',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er meðal þeirra langdrægustu, sneggstu og aflmestu á listanum, og meðal þeirra sem hlaða hraðast. Hann er meðal dýrustu bílanna.',
    ],
    facts: '421234a19303',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '6d9f4dc47aaf',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er meðal sneggstu og aflmestu bílanna á listanum og meðal þeirra sem hlaða hraðast. Hann er meðal þeirra dýrustu.',
    ],
    facts: 'acd47fef5a1e',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er meðal þeirra langdrægustu, sneggstu og aflmestu, og hleður hraðast bíla á svipuðu verði. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '67c474928221',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric EV450 er meðal dýrustu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann styttra, hleður hægar og er meðal þeirra hægustu.',
    ],
    facts: 'dcc120171e9c',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er meðal dýrustu og aflmestu bílanna á listanum, með einni af stærstu rafhlöðunum. Miðað við bíla á svipuðu verði drífur hann þó styttra og hleður hægar.',
    ],
    facts: '027f1f9ed06c',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er meðal ódýrustu bílanna á listanum en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar best innanbæjar.',
    ],
    facts: 'a5c773df2d1b',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er meðal ódýrustu bílanna á listanum og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir, svo hann hentar best í daglegan akstur.',
    ],
    facts: '889f32fd0a8c',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er ódýrari en flestir en drífur styttra og hleður hægar en flestir, og er meðal þeirra hægustu og aflminnstu. Hann hentar þeim sem aka mest innanbæjar.',
    ],
    facts: 'a79241597b69',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech EV87 er ódýrari en flestir en drífur lengra en flestir, með 623 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður þó hægar og er hægari og aflminni en flestir.',
    ],
    facts: 'e42fe6767d8a',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '66316a5bdb5d',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er ódýrari en flestir en drífur lengra en flestir, með 579 km, og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er í meðallagi að afli, sem gerir hann að jöfnum og hagkvæmum langferðabíl.',
    ],
    facts: 'e32ccaa183a0',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er fjórhjóladrifinn, ódýrari en flestir og drífur lengra en flestir. Hann er meðal þeirra ódýrustu á hvern km drægni og hleður hraðar en flestir.',
    ],
    facts: 'c634c3612f37',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er fjórhjóladrifinn og drífur lengra en flestir, á verði í meðallagi. Í flestu öðru er hann í meðallagi, bæði á listanum og miðað við bíla á svipuðu verði.',
    ],
    facts: 'bc9c3689d4a2',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er fjórhjóladrifinn og ódýrari á hvern km drægni en flestir, á verði í meðallagi. Hann er hægari en flestir og í meðallagi í hleðslu.',
    ],
    facts: '63e13a0a5736',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er fjórhjóladrifinn og dýrari en flestir, en í meðallagi í nánast öllu sem tölurnar mæla. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '2519d0d22950',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er sjö sæta og fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir en meðal þeirra langdrægustu miðað við bíla á svipuðu verði.',
    ],
    facts: 'd047c327c553',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri og aflmeiri en flestir.',
    ],
    facts: 'bfaf076add28',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu miðað við bíla á svipuðu verði. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '2481230c2496',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: '78cbc98a80b9',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er fjórhjóladrifinn, ódýrari en flestir og sneggri og aflmeiri en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: 'a7d4f8e2f7b5',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: '2c9e08598e5b',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði er hann sneggri og aflmeiri en flestir.',
    ],
    facts: 'b08993e098d4',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er fjórhjóladrifinn, meðal þeirra aflmestu og hleður hraðar en flestir, á verði í meðallagi. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu.',
    ],
    facts: '0144ca93c0ed',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er aflmestur bíla á svipuðu verði og meðal þeirra sneggstu á listanum. Hann er dýrari en flestir og í meðallagi að drægni.',
    ],
    facts: '19334262b291',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er fjórhjóladrifinn, sneggri og aflmeiri en flestir, á verði í meðallagi. Drægni og hleðsla eru í meðallagi.',
    ],
    facts: '64364ba5845c',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er fjórhjóladrifinn og sneggri en flestir, á verði í meðallagi. Í drægni og hleðslu er hann í meðallagi.',
    ],
    facts: '79bf6f4b5d2c',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er fjórhjóladrifinn, ódýrari en flestir og sneggri en flestir. Hann drífur styttra en flestir en er ódýrari á hvern km drægni en flestir.',
    ],
    facts: 'f3b0461764e0',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar helst þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: 'be0c92bd1895',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Afturhjóladrif er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði er hann meðal þeirra langdrægustu, sneggstu og þeirra sem hlaða hraðast.',
    ],
    facts: 'd86fce9aa4f3',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Afturhjóladrif er ódýrasti bíllinn á listanum á hvern km drægni og meðal þeirra langdrægustu, með 750 km. Hann hleður hraðar og er sneggri en flestir, svo fáir bílar gefa meira fyrir peninginn á langferðum.',
    ],
    facts: 'e9bc03075b31',
  },
  'tesla-model-3-long-range-fjorhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Fjórhjóladrif er fjórhjóladrifinn, meðal þeirra langdrægustu og meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er meðal þeirra sneggstu miðað við bíla á svipuðu verði.',
    ],
    facts: '1bf72079f808',
  },
  'tesla-model-3-performance': {
    paragraphs: [
      'Tesla Model 3 Performance er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu á listanum. Hann er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir.',
    ],
    facts: '4db16bc51e5a',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar en flestir.',
    ],
    facts: 'bac55a7da91b',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og ódýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'e9c0262cc3ae',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu og aflmestu miðað við bíla á svipuðu verði.',
    ],
    facts: 'e6e0df41d426',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er meðal sneggstu og aflmestu bílanna á listanum, drífur lengra og hleður hraðar en flestir. Hann er dýrari en flestir.',
    ],
    facts: '9c77531395d2',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er framhjóladrifinn og hægari og aflminni en flestir.',
    ],
    facts: 'd66ebedc78b1',
  },
  'toyota-bz4x-awd': {
    paragraphs: [
      'Toyota bZ4X AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: 'dcc9c953645e',
  },
  'toyota-bz4x-touring-base': {
    paragraphs: [
      'Toyota bZ4X Touring drífur lengra en flestir og hleður hraðar en flestir bílar á svipuðu verði. Hann er dýrari en flestir og hægari og aflminni en flestir.',
    ],
    facts: '852f0629cdb8',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er fjórhjóladrifinn, sneggri og aflmeiri en flestir, en dýrari en flestir. Hann hleður hægar en flestir og er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '48a9c907b1e3',
  },
  'toyota-c-hr-base': {
    paragraphs: [
      'Toyota C-HR+ er ódýrari en flestir en drífur styttra en flestir, með einni af minnstu rafhlöðunum, og er meðal þeirra aflminnstu.',
    ],
    facts: '773f4873215f',
  },
  'toyota-c-hr-77-kwh': {
    paragraphs: [
      'Toyota C-HR+ 77 kWh drífur lengra og hleður hraðar en flestir, á verði í meðallagi. Hann er meðal þeirra langdrægustu miðað við bíla á svipuðu verði, en hægari og aflminni en flestir.',
    ],
    facts: 'cd4eb24eb913',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er fjórhjóladrifinn og sneggri en flestir, en dýrari en flestir og hleður hægar en flestir. Hann er dýrari á hvern km drægni en flestir bílar á svipuðu verði.',
    ],
    facts: '7017ce239d38',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er sjö sæta á verði í meðallagi, en meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir. Hann hentar helst sem rúmgóður bíll í styttri ferðir.',
    ],
    facts: '5c9a543fc97d',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso tekur níu manns en er dýrari en flestir og meðal þeirra sem drífa styst og hlaða hægast. Hann er fyrir þá sem þurfa sætin umfram allt.',
    ],
    facts: 'b4b120a0166b',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser Active FWD er ódýrari en flestir en drífur styttra en flestir, hleður með þeim hægustu og er meðal þeirra aflminnstu. Hann hentar helst innanbæjar.',
    ],
    facts: '13d70bb9ba64',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er fjórhjóladrifinn og ódýrari en flestir, en meðal þeirra sem drífa styst og hlaða hægast. Hann hentar þeim sem þurfa fjórhjóladrif í styttri ferðir.',
    ],
    facts: '78b20464dfef',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er sjö sæta og fjórhjóladrifinn, með stærri rafhlöðu en flestir. Miðað við bíla á svipuðu verði drífur hann þó með þeim stystu og hleður hægar en flestir.',
    ],
    facts: 'a2836976f4c5',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er meðal ódýrustu bílanna og meðal þeirra ódýrustu á hvern km drægni. Miðað við bíla á svipuðu verði drífur hann lengra og hleður með þeim hröðustu; hann er væntanlegur í lok árs 2026.',
    ],
    facts: 'a757321802fb',
  },
  'volkswagen-id-cross-base': {
    paragraphs: [
      'Volkswagen ID. Cross er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Hann drífur styttra en flestir, en hleður hraðar en flestir bílar á svipuðu verði.',
    ],
    facts: 'a64139bd6d4f',
  },
  'volkswagen-id-3-pro': {
    paragraphs: [
      'Volkswagen ID.3 Pro er meðal ódýrustu bílanna og ódýrari á hvern km drægni en flestir. Hann drífur styttra og hleður hægar en flestir.',
    ],
    facts: '044a69cc2546',
  },
  'volkswagen-id-3-neo-58-kwh': {
    paragraphs: [
      'Volkswagen ID.3 Neo 58 kWh er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði drífur hann lengra og hleður hraðar; hann er væntanlegur í lok árs 2026.',
    ],
    facts: '1e057b99cd51',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er fjórhjóladrifinn og í meðallagi í öllu sem tölurnar mæla, bæði á listanum og miðað við bíla á svipuðu verði. Hann er jafn bíll án sérstakra styrkleika eða veikleika.',
    ],
    facts: 'd8ee5dbc9df2',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION býður upp á gott jafnvægi á milli drægni og fjórhjóladrifs á hagstæðu verði, sem hentar fólki sem leitar að hagnýtum og rúmgóðum fjölskyldubíl í hversdagsleikann.',
      'Í sínum verðflokki drífur bíllinn lengra en flestir og er ódýrari á hvern kílómetra drægni en flestir af rafbílum hér á landi. Það þýðir að rafhlaðan dugar vel í ferðalög milli landshluta, jafnvel í vetrarkulda. Fjórhjóladrifið tryggir öryggi í snjó og hálku, og 543 lítra skottið tekur auðveldlega við farangri allrar fjölskyldunnar.',
      'Á móti kemur að dráttargetan er 1.200 kg, sem er minna en hjá keppinautunum, auk þess sem ekkert framskott er til staðar fyrir snúrur. Ef hraði á ferðalögum vegur þyngra býður Hyundai IONIQ 5 upp á um 40% styttri hleðslustopp, á meðan XPENG G6 kemur sterkari inn ef óskað er eftir meiri dráttargetu og sneggri hröðun.',
      'Hann er heppilegur kostur fyrir þá sem vilja öruggan vetrarbíl með mikla drægni miðað við verðmiðann. Hann hentar hins vegar síður þeim sem þurfa að draga þung hjólhýsi eða vilja klára hraðhleðsluna á sem stystum tíma.',
    ],
    facts: '448e2ff56a1f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er með stærri rafhlöðu en flestir. Hann er dýrari en flestir.',
    ],
    facts: 'c9d4894f60e7',
  },
  'volvo-ec40-recharge-twin': {
    paragraphs: [
      'Volvo EC40 Recharge Twin er fjórhjóladrifinn, drífur lengra og hleður hraðar en flestir, og er sneggri og aflmeiri en flestir. Hann er dýrari en flestir.',
    ],
    facts: '4c4768fc41ce',
  },
  'volvo-es90-twin-motor': {
    paragraphs: [
      'Volvo ES90 Twin Motor er meðal þeirra langdrægustu, með 679 km, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: 'db5181216ea0',
  },
  'volvo-es90-twin-motor-performance': {
    paragraphs: [
      'Volvo ES90 Twin Motor Performance er meðal þeirra langdrægustu, sneggstu og aflmestu, og meðal þeirra sem hlaða hraðast. Hann er dýrari en flestir og væntanlegur í október 2026.',
    ],
    facts: '044f950696c4',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er fjórhjóladrifinn, sneggri og aflmeiri en flestir. Hann er dýrari en flestir og í meðallagi að drægni og hleðslu.',
    ],
    facts: 'aaa2c2db9ee8',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er ódýrari en flestir en meðal þeirra sem drífa styst, og meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði. Hann hentar helst innanbæjar.',
    ],
    facts: 'caedef119a1a',
  },
  'volvo-ex30-single-motor-extended-range': {
    paragraphs: [
      'Volvo EX30 Single Motor Extended Range er ódýrari en flestir og ódýrari á hvern km drægni en flestir. Miðað við bíla á svipuðu verði hleður hann hraðar og er sneggri en flestir.',
    ],
    facts: 'a18faaf6c440',
  },
  'volvo-ex30-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum, ódýrari en flestir. Hann drífur þó styttra en flestir.',
    ],
    facts: '7b204ea221f5',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er fjórhjóladrifinn og meðal þeirra sneggstu á listanum. Hann drífur styttra og hleður hægar en flestir, og er meðal þeirra dýrustu á hvern km drægni miðað við bíla á svipuðu verði.',
    ],
    facts: 'dde1590cc819',
  },
  'volvo-ex60-p10': {
    paragraphs: [
      'Það sem helst greinir Volvo EX60 P10 frá svipuðum bílum er að hann er hár jepplingur með 2.400 kg dráttargetu og 1.674 lítra hámarksrými, á meðan helstu keppinautar eru flestir lágir langbakar. Hann hentar einkar vel þeim sem vilja háa sætisstöðu og öflugan ferðabíl fyrir krefjandi íslenskar aðstæður.',
      'Drægnin er meðal þeirra langdrægustu af öllum rafbílum hér á landi og hann hleður hraðar en flestir í sínum verðflokki, sem gerir vetrarferðir milli landshluta áhyggjulausar. Hann er jafnframt aflmeiri og sneggri en flestir á svipuðu verði, sem tryggir mikið öryggi við framúrakstur og í erfiðri færð.',
      'Á móti kemur að hann er dýrari en flestir af rafbílum hér á landi. Ef drægnin ræður öllu gæti Mercedes-Benz CLA Shooting Brake 350 4MATIC hentað betur með um 15% styttri hleðslustopp, þótt hann dragi aðeins 1.800 kg og hafi minna skottrými. Einnig býður Audi Q6 e-tron upp á 64 lítra framskott á móti 52 lítrum í Volvo.',
      'Þetta eru góð kaup fyrir þá sem leita að hávöxnum ferðabíl með mikla dráttargetu og örugga drægni í vetrarkulda. Fyrir þá sem aka aðallega innanbæjar eða vilja frekar lágan og rennilegan bíl er óþarfi að borga fyrir allan þennan vöðvamassa.',
    ],
    facts: 'd19e0e986d33',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex60-p12': {
    paragraphs: [
      'Volvo EX60 P12 drífur lengst bíla á svipuðu verði, 810 km, og hefur stærstu rafhlöðuna í þeim hópi. Hann er líka meðal þeirra sneggstu, aflmestu og þeirra sem hlaða hraðast.',
    ],
    facts: '06c85b047955',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er sjö sæta og fjórhjóladrifinn, með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: '751422d8f1fa',
  },
  'volvo-ex90-twin-motor-performance': {
    paragraphs: [
      'Volvo EX90 Twin Motor Performance er sjö sæta, fjórhjóladrifinn og sneggri og aflmeiri en flestir, með einni af stærstu rafhlöðunum. Hann er meðal dýrustu bílanna á listanum.',
    ],
    facts: 'ec0ea7799dcf',
  },
  'xpeng-g6-rwd-standard-range': {
    paragraphs: [
      'XPENG G6 RWD Standard Range er ódýrari en flestir og hleður hraðar en flestir, með þeim hröðustu miðað við bíla á svipuðu verði. Hann drífur þó styttra en flestir.',
    ],
    facts: 'aacc6d5cca23',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 RWD Long Range er ódýrari en flestir, drífur lengra en flestir og er meðal þeirra ódýrustu á hvern km drægni. Hann hleður hraðar en flestir og er með stærri rafhlöðu en flestir.',
    ],
    facts: 'eb0305ea9ef5',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er fjórhjóladrifinn, ódýrari en flestir og meðal þeirra sneggstu á listanum. Hann drífur lengra og hleður hraðar en flestir, sem gerir hann að miklum bíl fyrir peninginn.',
    ],
    facts: '099fff870bb2',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er fjórhjóladrifinn, meðal þeirra sem hlaða hraðast og sneggri og aflmeiri en flestir. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '5270e179ae3b',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er sjö sæta og hleður hraðast allra bíla á listanum, með einni af stærstu rafhlöðunum. Hann er dýrari en flestir og drífur styttra en flestir bílar á svipuðu verði.',
    ],
    facts: '7c16b8da16eb',
  },
}

export default carReviews
