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
      'Audi A6 e-tron Sportback quattro er stór og rennilegur fólksbíll með afturhlera og fjórhjóladrifi, nærri fimm metrar á lengd, smíðaður fyrir þá sem aka mikið milli landshluta og vilja fágaðan og hljóðlátan langferðabíl frekar en jeppa.',
      'Í sínum verðflokki drífur hann lengra, hleður hraðar og er sneggri en flestir, svo langferðir kalla á fá og stutt stopp, jafnvel í vetrarkulda. Hann má líka draga 2.100 kg, meira en flestir keppinautar hans.',
      'Skottið er hins vegar minna en hjá flestum þeirra og lág byggingin býður ekki upp á sömu veghæð og jepplingur. Audi Q6 e-tron er hærri jepplingur með sama drifbúnaði, má draga 300 kg meira og kostar 500.000 kr. meira, en drífur 87 km styttra.',
      'A6 e-tron Sportback er einn sterkasti langferðabíllinn á sínu verði, og ódýrari en skutbílsútfærslan þótt hann drífi lengra.',
    ],
    facts: '528cb113b364',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er stór skutbíll með fjórhjóladrifi, nærri fimm metrar á lengd, ætlaður fjölskyldum sem aka mikið um landið og vilja fágaðan langferðabíl með hagnýtu farangursrými frekar en jeppa.',
      'Í sínum verðflokki drífur hann lengra, hleður hraðar og er sneggri en flestir, svo hleðslustopp á langferðum verða fá og stutt. Hann má líka draga 2.100 kg, meira en flestir keppinautar hans.',
      'Skottið er þó minna en hjá flestum þeirra, þótt skutbílslagið rúmi meira þegar sætin eru felld niður. Audi A6 e-tron Sportback quattro er 300.000 kr. ódýrari og drífur 38 km lengra, fyrir þá sem þurfa ekki skutbílslagið.',
      'A6 e-tron Avant er fyrir þá sem vilja langdrægan og snarpan skutbíl sem dregur hjólhýsi, í stað jeppa.',
    ],
    facts: '5124bada378e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er lágur og straumlínulagaður lúxussportbíll með fjórhjóladrifi, náskyldur Porsche Taycan, hannaður fyrir þá sem setja akstur, afl og áberandi hönnun ofar notagildi.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði, hleður fremur hratt og lágur þyngdarpunktur gerir hann stöðugan og skemmtilegan í akstri. Auk skottsins er 85 l framskott undir vélarhlífinni.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst í þessum verðflokki, skottið er eitt það minnsta og hann má ekki draga kerru. Porsche Taycan 4 Plus kostar nánast það sama en drífur mun lengra, fyrir þá sem vilja sams konar sportbíl sem hentar betur í langferðir.',
      'e-tron GT er draumabíll fyrir þá sem leita að hreinni akstursánægju og sætta sig við takmarkaða drægni og lítið pláss.',
    ],
    facts: '1a0ffdfe8771',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro er meðalstór jepplingur með fjórhjóladrifi, ætlaður þeim sem kunna að meta vandaða innréttingu, lágværan akstur og rótgróið úrvalsmerki í hversdagsbíl.',
      'Það sem hann býður umfram keppinautana er fyrst og fremst merkið, frágangurinn og akstursþægindin: góð hljóðvist og mjúk fjöðrun gera langferðir áreynslulausar. Í tölunum hefur hann fáa styrkleika.',
      'Hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, og má aðeins draga 1.200 kg. Smart #5 Brabus kostar 100.000 kr. meira en drífur 52 km lengra, hleður með um 40% styttri stoppum, er með 110 l stærra skott og má draga 400 kg meira.',
      'Q4 e-tron er fyrir þá sem setja fágun og Audi-merkið í öndvegi, en fyrir peninginn fæst meiri bíll annars staðar.',
    ],
    facts: '306c55238898',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er stór og vandaður lúxusjepplingur með fjórhjóladrifi, ætlaður fjölskyldum sem vilja þægilegan og öruggan ferðabíl með hárri setstöðu og góðu útsýni.',
      'Hann drífur lengra en flestir á svipuðu verði og hleður fremur hratt, svo langferðir milli landshluta verða áhyggjulausar, jafnvel í vetrarkulda. Hann má draga 2.400 kg, með því mesta í hans verðflokki, og auk skottsins er 64 l framskott.',
      'Helsti ókosturinn er að hann er hægari en flestir keppinautar hans. Volvo EX60 P10 kostar 100.000 kr. minna, drífur 35 km lengra, hleður með um 15% styttri stoppum og er mun sneggri.',
      'Q6 e-tron er traustur kostur fyrir fjölskyldur sem ferðast um landið, með kerru eða hjólhýsi ef svo ber undir.',
    ],
    facts: 'c719fcff91c1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er stór lúxusjepplingur með fjórhjóladrifi og aflíðandi þaklínu, sem sameinar háa setstöðu og rennilegri baksvip en í hefðbundnum Q6 e-tron.',
      'Í sínum verðflokki drífur hann lengra en flestir og hleður mjög hratt, svo hleðslustopp á þjóðveginum verða stutt. Hann má draga 2.400 kg, meira en flestir keppinautar hans, og auk skottsins er 64 l framskott.',
      'Hann er hins vegar hægari en flestir þeirra og skottið er minna. Audi Q6 e-tron er 600.000 kr. ódýrari með nánast sömu drægni og 15 l stærra skott, og Volvo EX60 P10 er 700.000 kr. ódýrari, drífur 23 km lengra og er mun sneggri.',
      'Q6 Sportback er fyrir þá sem vilja sportlegra útlit og eru tilbúnir að borga talsvert fyrir formið.',
    ],
    facts: 'a587638043c0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er aflmesta útgáfan af Q6 e-tron, stór lúxusjepplingur með fjórhjóladrifi sem leggur áherslu á snerpu og sportlegan akstur án þess að fórna notagildinu.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði og má draga 2.400 kg, meira en flestir keppinautar hans. Auk skottsins er 64 l framskott undir vélarhlífinni.',
      'Á móti kemur að hann er mjög dýr og drægnin og hraðhleðslan eru aðeins í meðallagi miðað við verðið. Porsche Cayenne kostar nánast það sama en drífur 44 km lengra, hleður með um 30% styttri stoppum, er með 267 l stærra skott og má draga 600 kg meira.',
      'SQ6 e-tron er fyrir þá sem vilja snarpan Audi-jeppling, en á þessu verði fæst meira í flestu öðru.',
    ],
    facts: '6be7cb5413e8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'BMW i4 40 xDrive er lágur og rennilegur fólksbíll með afturhlera og fjórhjóladrifi, ætlaður þeim sem meta hefðbundna akstursánægju BMW og vilja sitja neðar en í jepplingi. Afturhlerinn gerir farangursrýmið aðgengilegt og innréttingin ber vott um vandaðan frágang.',
      'Hann liggur vel á vegi, er stöðugur í beygjum og má draga 1.600 kg. Drægnin og hleðslan eru í meðallagi miðað við rafbíla almennt.',
      'Í sínum verðflokki drífur hann þó styttra og hleður hægar en flestir, og skottið er minna en hjá flestum keppinautunum. Mercedes-Benz GLC 300 4MATIC kostar það sama en drífur 67 km lengra, hleður með um 25% styttri stoppum, er með 100 l stærra skott og má draga 800 kg meira.',
      'i4 40 xDrive er fyrir þá sem kjósa akstursánægju og fólksbílalag fram yfir drægni og pláss.',
    ],
    facts: 'c8b9a2c3cd23',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er lágur og sportlegur fólksbíll með afturhlera og fjórhjóladrifi, sniðinn að þeim sem hafa unun af akstri. Hann er meðal sneggstu og aflmestu bíla á sínu verði.',
      'Afl og snerpa eru hans sterkasta hlið, en hann drífur líka fremur langt og hleður fremur hratt, svo hann ræður vel við ferðalög milli landshluta. Hann má draga 1.600 kg.',
      'Miðað við keppinautana drífur hann þó styttra og skottið er minna. BMW i4 40 xDrive er 2.000.000 kr. ódýrari með sömu drægni og sama rými, og gefur aðeins eftir í snerpu.',
      'i4 M60 er fyrir þá sem setja afl og hraða ofar öllu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: '8890a1c90b99',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er stór lúxusfólksbíll með skottloki og afturhjóladrifi, rúmlega fimm metrar á lengd, þar sem lögð er áhersla á fágaðan akstur, hljóðlátt innanrými og þægindi á langferðum.',
      'Hann drífur fremur langt og kemst á milli landshluta án fyrirhafnar, og góð hljóðeinangrun og afturhjóladrifið gefa honum yfirvegaða og skemmtilega aksturseiginleika á greiðfærum vegum.',
      'Í sínum verðflokki hleður hann hins vegar hægar, er aflminni og dregur minna en flestir, skottið er minna og afturhjóladrifið krefst meiri aðgæslu í snjó og hálku. Polestar 3 Performance kostar 490.000 kr. meira en er fjórhjóladrifinn, mun sneggri og má draga 700 kg meira.',
      'i5 eDrive40 er fyrir þá sem vilja hljóðlátan og fágaðan langferðabíl í klassísku fólksbílasniði.',
    ],
    facts: '1c309ab62c34',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er stór lúxusfólksbíll með skottloki og fjórhjóladrifi, rúmlega fimm metrar á lengd, sem sameinar þægindi fimmu-línunnar og mikið afl M-deildarinnar. Hann hentar þeim sem vilja fágaðan og kraftmikinn fólksbíl frekar en jeppa.',
      'Hann er meðal aflmestu bíla á sínu verði og sneggri en flestir keppinautar hans, og vönduð hljóðeinangrun gerir hann að notalegum langferðabíl á greiðfærum vegum. Hann má draga 2.000 kg.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst og hlaða hægast í þessum verðflokki, og skottið er minna en hjá flestum. Porsche Taycan 4S Plus er 940.000 kr. ódýrari, álíka snöggur og hleður með um 50% styttri stoppum, en má ekki draga kerru. BMW i5 eDrive40 er 6.400.000 kr. ódýrari og drífur 42 km lengra, fyrir þá sem geta verið án aflsins.',
      'i5 M60 er fyrir þá sem vilja kraftmikinn BMW-fólksbíl og eru tilbúnir að borga mikið fyrir aflið umfram drægni og hleðslu.',
    ],
    facts: 'eff3ad7deb4c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er stór lúxusjeppi með fjórhjóladrifi sem leggur áherslu á hljóðlát þægindi og mjúkan akstur, með rúmgóðu farþegarými og sérstæðri, nútímalegri innréttingu. Hann hentar þeim sem vilja fágaðan ferðabíl frekar en sportlegan.',
      'Hann má draga 2.500 kg, meira en flestir á svipuðu verði, og drífur fremur langt, svo hann kemst vel milli landshluta og ræður við hjólhýsi. Aksturinn er yfirvegaður og traustur, sem gerir langkeyrslur afslappaðar.',
      'Á móti kemur að hann hleður hægar og er aflminni en flestir keppinautar hans, og skottið er minna. Porsche Macan 4s Electric kostar 460.000 kr. meira en hleður með um 40% styttri stoppum og er sneggri, þótt hann sé minni bíll, og BMW iX xDrive 60 Sport drífur 99 km lengra fyrir 2.300.000 kr. meira.',
      'iX xDrive 45 er fyrir þá sem meta ró, þægindi og dráttargetu ofar snerpu og hraðri hleðslu.',
    ],
    facts: '882067b3bf42',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er stór lúxusjeppi með fjórhjóladrifi sem leggur áherslu á hljóðlát þægindi, rúmgott farþegarými og sérstæða, nútímalega innréttingu. Hann hentar þeim sem vilja fágaðan ferðabíl sem kemst langt á hverri hleðslu.',
      'Drægnin er hans sterkasta hlið: hann er meðal þeirra langdrægustu í sínum verðflokki, svo langferðir milli landshluta kalla á fá stopp, jafnvel í vetrarkulda. Hann er líka aflmeiri en flestir keppinautar hans og má draga 2.500 kg.',
      'Hraðhleðslan er hins vegar aðeins í meðallagi miðað við verðið og skottið er minna en hjá flestum. Porsche Cayenne Coupé kostar 160.000 kr. meira en hleður með um 50% styttri stoppum og má draga 1.000 kg meira, þótt hann drífi 58 km styttra.',
      'iX xDrive 60 er fyrir þá sem setja drægni og þægindi í öndvegi og vilja sem fæst hleðslustopp á leiðinni.',
    ],
    facts: 'd79d0f40d4d1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er minnsti rafjepplingur BMW, framhjóladrifinn og vandaður, ætlaður þeim sem vilja úrvalsmerki og góða hljóðvist í hversdagsbíl án þess að borga fyrir stærri gerðir.',
      'Hann nýtir orkuna vel, drægnin og hraðhleðslan eru í meðallagi á þessu verði, og frágangur og innrétting standast það sem búast má við af BMW.',
      'Á móti kemur að hann er aflminni og hægari en flestir keppinautar hans og meðal þeirra sem draga minnst, aðeins 750 kg. Opel Grandland kostar 100.000 kr. meira, drífur álíka langt, er með 60 l stærra skott og má draga 450 kg meira. Fjórhjóladrifni BMW iX1 xDrive 30 fæst fyrir 1.000.000 kr. meira.',
      'iX1 eDrive 20 er fyrir þá sem vilja BMW á hagstæðu verði og þurfa hvorki fjórhjóladrif né mikla dráttargetu.',
    ],
    facts: '5170bc1d9003',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er lítill og vandaður lúxusjepplingur með fjórhjóladrifi, ætlaður þeim sem vilja gæði BMW, góða hljóðvist og lipra stýringu í nettum bíl.',
      'Hann er snöggur og lipur í akstri, með vönduðu innanrými eins og merkið er þekkt fyrir. Í tölunum hefur hann þó fáa styrkleika umfram keppinautana.',
      'Hann drífur styttra, hleður hægar og má draga minna en flestir á svipuðu verði. Kia EV5 AWD kostar nánast það sama en drífur 16 km lengra, er með 76 l stærra skott og má draga 600 kg meira, og BMW iX1 eDrive 20 er 1.000.000 kr. ódýrari og drífur 46 km lengra, fyrir þá sem þurfa ekki fjórhjóladrif.',
      'iX1 xDrive 30 er fyrir þá sem setja BMW-merkið og akstursánægju í öndvegi, en fyrir peninginn fæst meiri bíll annars staðar.',
    ],
    facts: '7b462734f436',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er stór og vandaður jepplingur með afturhjóladrifi, af nýrri kynslóð rafbíla BMW, sem leggur áherslu á langferðir, fágaðan akstur og þægindi.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, svo langferðir um landið kalla á fá og stutt stopp. Hann má draga 2.000 kg, með því mesta á þessu verði, og auk skottsins er 58 l framskott.',
      'Hann er hins vegar aflminni og hægari en flestir keppinautar hans og aðeins afturhjóladrifinn, sem kallar á meiri varkárni í snjó og hálku. BMW iX3 50 xDrive fæst með fjórhjóladrifi og 168 km meiri drægni fyrir 2.500.000 kr. meira.',
      'iX3 40 er einn sterkasti langferðabíllinn á sínu verði, fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: '16731bcab88f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er stór og vandaður jepplingur með fjórhjóladrifi, af nýrri kynslóð rafbíla BMW, smíðaður fyrir þá sem vilja leggja af stað í langferðir án þess að hugsa mikið um hleðslur.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, svo hringvegurinn kallar á fá og stutt stopp, jafnvel í vetrarkulda. Hann er líka aflmeiri en flestir keppinautar hans og auk skottsins er 58 l framskott.',
      'Helsti ókosturinn er verðið. Volvo EX60 P12 kostar 100.000 kr. minna, drífur álíka langt, er sneggri og má draga 400 kg meira. BMW iX3 40 er 2.500.000 kr. ódýrari og drífur samt langt, fyrir þá sem þurfa ekki fjórhjóladrif.',
      'iX3 50 xDrive er fyrir þá sem vilja vandaðan ferðabíl með sem minnstu hleðslustússi.',
    ],
    facts: 'fb86aa548d6e',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er nettur fimm sæta hlaðbakur sem hentar vel í innanbæjarakstur og sem hagkvæmur heimilisbíll. Hann er lipur í þröngum stæðum og þéttbýli, og innanrýmið nýtist vel miðað við stærðina.',
      'Stærsti styrkur hans er verðið: í sínum verðflokki er hann ódýrari á hvern kílómetra drægni en flestir og meðal þeirra sneggstu, með stærri rafhlöðu en gengur og gerist.',
      'Á móti kemur að hann hleður mjög hægt, skottið er minna en hjá flestum keppinautunum og hann má ekki draga kerru. Skoda Epiq 55 kostar það sama en hefur 130 l stærra skott, um 45% styttri hleðslustopp og má draga 1.200 kg.',
      'Fyrir þá sem hlaða heima, aka mest innanbæjar og þurfa hvorki kerru né mikið farangursrými er Dolphin hagkvæmur og skemmtilegur kostur.',
    ],
    facts: 'a075d76dc9ac',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er lágur og rennilegur fólksbíll með skottloki og fjórhjóladrifi, sem höfðar til þeirra sem vilja sportlegan akstur frekar en hefðbundinn jeppling. Hann er meðal sneggstu og aflmestu bíla á sínu verði.',
      'Afl og snerpa eru hans sterkasta hlið, og lágur þyngdarpunktur gerir hann stöðugan og skemmtilegan á malbiki. Auk skottsins er 53 l framskott undir vélarhlífinni, og hann má draga 1.500 kg.',
      'Hann hleður hins vegar hægar en flestir keppinautar hans og skottið er eitt það minnsta í þessum verðflokki. Kia EV6 2025 Long Range AWD er 200.000 kr. ódýrari, hleður með um 55% styttri stoppum og er með 90 l stærra skott, en hann er mun aflminni.',
      'Seal á best við þá sem setja kraft og akstursánægju ofar hraðhleðslu og fjölskylduplássi.',
    ],
    facts: 'f4502aed1fcd',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er stór framhjóladrifinn jepplingur, tæpir 4,8 m á lengd, sem leggur áherslu á rými og rólegan akstur frekar en afköst. Hann hentar fjölskyldum sem vilja mikið pláss fyrir hóflegt verð.',
      'Skottið er stærra en hjá flestum á svipuðu verði og drægnin í meðallagi, sem dugar vel milli landshluta. Hann má draga 1.300 kg.',
      'Gallarnir eru að hann er meðal þeirra hægustu og þeirra sem hlaða hægast í þessum verðflokki. MG MGS6 Dual Motor er 100.000 kr. ódýrari, fjórhjóladrifinn, mun sneggri og hleður með um 15% styttri stoppum, en skottið er 59 l minna.',
      'Seal U hentar þeim sem vilja rúmgóðan og þægilegan fjölskyldubíl og hlaða mest heima.',
    ],
    facts: 'ee6e6b50363e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er stór og rennilegur jepplingur með fjórhjóladrifi, 4,83 m á lengd, sem einkennist öðru fremur af miklu afli og snöggri hröðun. Hann hentar þeim sem vilja kraftmikinn fjölskyldubíl á hóflegu verði.',
      'Í sínum verðflokki er hann meðal þeirra aflmestu og hleður hraðar og er sneggri en flestir, svo hleðslustopp á langferðum verða stutt. Auk skottsins er 58 l framskott undir vélarhlífinni, og hann má draga 1.500 kg.',
      'Helsti ókosturinn er að hann drífur styttra en flestir keppinautar hans. Subaru e-Outback kostar 100.000 kr. meira, drífur 21 km lengra og er með 113 l stærra skott, þótt hleðslustoppin séu um 15% lengri.',
      'Sealion 7 er fyrir þá sem vilja mikið afl og hraða hleðslu fyrir peninginn, frekar en hámarksdrægni.',
    ],
    facts: 'e5798dfbadee',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er stór sjö sæta jeppi með fjórhjóladrifi, ætlaður stórum fjölskyldum sem vilja hefðbundið jeppalag og ríflegt innanrými.',
      'Hann er meðal þeirra aflmestu á svipuðu verði og hröðunin er snörp fyrir jafn stóran bíl. Farangursrýmið er með því stærsta í hans verðflokki þegar aftasta sætaröðin er felld niður.',
      'Stærsti veikleikinn kemur fram á langferðum: hann drífur styttra en flestir keppinautar hans og er meðal þeirra sem hlaða hægast. Hyundai IONIQ 9 Long Range AWD kostar 290.000 kr. meira en drífur 75 km lengra, hleður með um 55% styttri stoppum og má draga 1.000 kg meira.',
      'Tang hentar best þeim sem hlaða heima og meta pláss og afl ofar langferðum.',
    ],
    facts: 'e3108495b06c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er hlaðbakur með jepplingsyfirbragði sem leggur áherslu á mýkt frekar en afköst. Hann er þekktur fyrir mjúka fjöðrun og þægileg sæti sem deyfa ójöfnur vel, og hentar þeim sem vilja lágværan og þægilegan hversdagsbíl.',
      'Hann er fremur ódýr og akstursþægindin eru það sem greinir hann frá keppinautunum. Í tölunum hefur hann fáa styrkleika.',
      'Hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, skottið er minna og hann má ekki draga kerru. Volkswagen ID. Cross er 100.000 kr. ódýrari, drífur 11 km lengra, hleður með um 20% styttri stoppum, er með 95 l stærra skott og má draga 1.200 kg.',
      'ë-C4 er ljúfur kostur fyrir þá sem setja mjúkan akstur ofar öllu, en fyrir sama verð fæst meira annars staðar.',
    ],
    facts: '0f203bba0964',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er lítill fjögurra sæta borgarbíll með ítölsku retro-útliti, aðeins 3,6 m á lengd, sniðinn að þröngum götum og stuttum ferðum. Hann hentar þeim sem vilja sjarmerandi innanbæjarbíl sem kemst í stæði sem stærri bílar ráða ekki við.',
      'Hann er mjög ódýr og nettur, sem gerir hann að fýsilegum öðrum bíl á heimilið, og rafhlaðan fyllist auðveldlega heima yfir nótt.',
      'Gallarnir eru að hann drífur mjög stutt, hleður hægar en flestir keppinautar hans, skottið er eitt það minnsta og hann má ekki draga kerru. Hyundai IONIQ 3 Standard Range er 290.000 kr. ódýrari, drífur 39 km lengra, rúmar fimm, er með 256 l stærra skott og má draga 750 kg.',
      '500e er laglegur borgarbíll fyrir þá sem kaupa með hjartanu, en gefur mikið eftir í drægni og plássi.',
    ],
    facts: 'ed1eed510bce',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er lítill jepplingur með ítölsku retro-útliti, systurbíll Jeep Avenger, ætlaður þeim sem vilja stílhreinan bíl í dagleg erindi og styttri ferðir.',
      'Hann er fremur ódýr, lipur í þröngum götum og auðveldur í stæðum, og hraðhleðslan er í meðallagi á þessu verði.',
      'Á móti kemur að hann drífur styttra en flestir keppinautar hans og er meðal þeirra hægustu, skottið er minna og hann má ekki draga kerru. Volkswagen ID. Cross er 100.000 kr. ódýrari, drífur 27 km lengra, er með 115 l stærra skott og má draga 1.200 kg.',
      '600e höfðar til þeirra sem heillast af ítalska sjarmanum, en fyrir sama verð fæst hagnýtari bíll.',
    ],
    facts: '5cb3f7454b4f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er rennilegur jepplingur með aflíðandi þaklínu og fjórhjóladrifi, byggður á sama grunni og Volkswagen ID.5, fyrir þá sem vilja rúmgóðan bíl með meiri karakter en hefðbundnir kassalaga fjölskyldubílar.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, sneggri en flestir og með stærra skott en flestir þrátt fyrir þaklínuna.',
      'Helsti ókosturinn er að hann má aðeins draga 1.200 kg, minna en flestir keppinautar hans. Tesla Model Y Premium Long Range kostar 40.000 kr. meira, er með 282 l stærra skott og má draga 400 kg meira, en hann er aðeins afturhjóladrifinn.',
      'Capri er einn sterkasti fjórhjóladrifni ferðabíllinn á sínu verði, ef ekki þarf að draga mikið.',
    ],
    facts: 'f3e474e1f35f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er kassalaga meðalstór jepplingur með fjórhjóladrifi, byggður á sama grunni og Volkswagen ID.4, sem hentar fólki sem vill jeppalag, þægilega sætishæð og gott útsýni.',
      'Hann drífur lengra, hleður hraðar og er sneggri en flestir á svipuðu verði, svo hann hentar vel í ferðalög milli landshluta.',
      'Helsti ókosturinn er að hann má aðeins draga 1.200 kg, minna en flestir keppinautar hans. Hyundai IONIQ 5 Long Range AWD kostar það sama en hleður með um 35% styttri stoppum og má draga 400 kg meira.',
      'Explorer er vel heppnaður og jarðbundinn fjölskyldubíll sem fer vel með íslenskan vetur, svo lengi sem ekki þarf að draga þungt.',
    ],
    facts: '9eb36bb10329',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er rennilegur jepplingur með fjórhjóladrifi og sportlegum svip, sem sameinar rými fjölskyldubíls og líflega aksturseiginleika.',
      'Hann drífur lengra og er aflmeiri en flestir á svipuðu verði, og auk skottsins er 100 l framskott undir vélarhlífinni, með því stærsta sem gerist. Hann má draga 1.500 kg.',
      'Gallinn er að hann hleður hægar en flestir keppinautar hans. Smart #5 Pulse er 100.000 kr. ódýrari, hleður með um 50% styttri stoppum, er með 111 l stærra skott og mun aflmeiri, en drífur 10 km styttra.',
      'Mach-E hentar þeim sem vilja langdrægan og líflegan fjölskyldubíl, ef hægari hleðsla á ferðalögum er ekki fyrirstaða.',
    ],
    facts: '01e9d7fa4b33',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er lítill og nettur jepplingur, ætlaður sem hagkvæmur bæjarbíll með hærri setstöðu og lipra aksturseiginleika.',
      'Hann er mjög ódýr, en skottið er samt eitt það stærsta á svipuðu verði og 43 l framskott bætist við. Hann hleður líka hraðar en flestir keppinautar hans.',
      'Á móti kemur að hann drífur styttra en flestir þeirra. Leapmotor B10 67.1 kWh kostar 100.000 kr. meira en drífur 58 km lengra og hleður með um 10% styttri stoppum, þótt skottið sé 93 l minna.',
      'Puma er laglegur og hagnýtur hversdagsbíll fyrir þá sem aka mest innanbæjar.',
    ],
    facts: '13dd726fc66c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er jepplingur með fjórhjóladrifi frá kínverska lúxusmerkinu Hongqi, sem einkennist af miklu afli og snarpri hröðun á hóflegu verði.',
      'Hann er meðal sneggstu og aflmestu bíla á sínu verði, drífur lengra en flestir keppinautar hans og er meðal þeirra sem hlaða hraðast.',
      'Hongqi er hins vegar nýtt merki hér á landi og meiri óvissa er um endursöluverð og þjónustunet en hjá rótgrónum merkjum. Peugeot e-3008 kostar 180.000 kr. meira frá þekktara merki og drífur álíka langt, en er framhjóladrifinn og hleður með um 80% lengri stoppum.',
      'EHS5 gefur mikið fyrir peninginn, fyrir þá sem eru tilbúnir að veðja á nýtt merki.',
    ],
    facts: 'c1ddd31fa032',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er stór lúxusjepplingur með fjórhjóladrifi, tæpir fimm metrar á lengd, frá kínverska lúxusmerkinu Hongqi, og býður mikið afl og rými fyrir verð sem fáir ná.',
      'Í sínum verðflokki er hann meðal sneggstu og aflmestu bílanna, skottið er eitt það stærsta og 62 l framskott bætist við. Hann drífur líka lengra en flestir keppinautar hans og er meðal þeirra sem hlaða hraðast.',
      'Á móti kemur að merkið er nýtt hér á landi og óvissa um endursöluverð og þjónustu meiri en hjá rótgrónum merkjum. Subaru e-Outback kostar 100.000 kr. meira frá traustu merki með álíka stórt skott, en hleður með um 50% lengri stoppum og er mun aflminni.',
      'EHS7 gefur gríðarlega mikið fyrir peninginn, fyrir þá sem treysta nýju merki.',
    ],
    facts: 'b1727237dbbf',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er lítill og kassalaga jepplingur, aðeins 3,8 m á lengd, sniðinn að þéttbýli og þröngum stæðum, og hentar vel sem annar bíll heimilisins.',
      'Stærsti kosturinn er verðið, enda er hann einn ódýrasti rafbíllinn á markaðnum, og hann kemur frá merki með rótgróið þjónustunet. Sætin má fella og færa á ýmsa vegu, svo innanrýmið nýtist vel miðað við stærð.',
      'Hann drífur hins vegar styttra, hleður hægar og er hægari en flestir á svipuðu verði, og skottið er eitt það minnsta. Leapmotor B03X ProMax er 200.000 kr. ódýrari, drífur 55 km lengra, hleður með um 40% styttri stoppum og er með 127 l stærra skott.',
      'INSTER er lipur og hagkvæmur bæjarbíll frá þekktu merki, en síður til ferðalaga.',
    ],
    facts: '6832195fd771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er lítill og kassalaga jepplingur, aðeins 3,8 m á lengd, með hárri setstöðu og góðu útsýni, sniðinn að þéttbýli og þröngum stæðum.',
      'Hann er mjög ódýr og drífur 43 km lengra en grunnútfærslan, sem dugar í daglegan akstur og styttri ferðir milli bæja. Sætin má fella og færa á ýmsa vegu, svo innanrýmið nýtist vel miðað við stærð.',
      'Miðað við keppinautana drífur hann samt styttra, hleður hægar og er hægari, og skottið er minna en hjá flestum. Ford Puma kostar 200.000 kr. meira en hleður með um 25% styttri stoppum, er mun sneggri og með 172 l stærra skott.',
      'INSTER Long Range er hreinræktaður borgarbíll sem hittir í mark í þéttbýli.',
    ],
    facts: '383ab1ec50e1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er lítill fimm sæta hlaðbakur, ætlaður sem hagkvæmur bæjarbíll í vinnuna, búðina og daglegt amstur.',
      'Helsti kostur hans er verðið, enda er hann mjög ódýr, og skottið er stærra en hjá flestum á svipuðu verði þó bíllinn sé nettur. Hann má líka draga 750 kg, sem sumir keppinautar hans mega ekki.',
      'Á móti kemur að hann drífur mjög stutt, sérstaklega í vetrarkulda, og hleður hægar en flestir í þessum verðflokki. Renault R5 E-Tech 52 kWh er 110.000 kr. ódýrari en drífur 65 km lengra og hleður með um 15% styttri stoppum, þótt skottið sé 115 l minna.',
      'IONIQ 3 hentar best sem annar bíll heimilisins eða hreinn bæjarbíll, frekar en til reglulegra ferða milli landshluta.',
    ],
    facts: '2796cf363a0d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er lítill fimm sæta hlaðbakur sem leggur áherslu á drægni og hagkvæmni frekar en afl.',
      'Hann er mjög ódýr, en drífur samt lengra, hleður hraðar og er með stærra skott en flestir á svipuðu verði, svo hann dugar vel í ferðalög milli landshluta.',
      'Hann er hins vegar meðal þeirra hægustu og aflminnstu í þessum verðflokki og má aðeins draga 750 kg. Leapmotor C10 ProMax kostar 190.000 kr. meira, er stærri bíll, mun sneggri og má draga 750 kg meira.',
      'IONIQ 3 Long Range er skynsamlegt val fyrir þá sem vilja komast langt fyrir lítið og láta afl mæta afgangi.',
    ],
    facts: 'cc6347a9b495',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er jepplingur með fjórhjóladrifi, framúrstefnulegu útliti og óvenju opnu innanrými: langt hjólhaf skilar flötu gólfi og ríkulegu fótaplássi. Hann hentar fjölskyldum sem vilja þægilegan og rúmgóðan ferðabíl.',
      'Hann hleður hraðast allra bíla á svipuðu verði, drífur lengra og er sneggri en flestir keppinautar hans, og má draga 1.600 kg, meira en flestir þeirra.',
      'Veikleikarnir eru fáir: skottið og drægnin eru aðeins í meðallagi miðað við rafbíla almennt, og framskottið er lítið. Systurbíllinn Kia EV6 2025 Long Range AWD kostar það sama og má draga 200 kg meira, fyrir þá sem vilja sportlegri bíl.',
      'IONIQ 5 er einn sterkasti fjölskyldubíllinn á sínu verði, sérstaklega fyrir þá sem ferðast mikið um landið.',
    ],
    facts: 'ec32ba1494cf',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er stór sjö sæta jeppi, rúmlega fimm metrar á lengd, með fullgildri þriðju sætaröð. Hann leggur áherslu á þægindi og rými fyrir stórar fjölskyldur frekar en sportlega takta.',
      'Skottið er eitt það stærsta í hans verðflokki og hann má draga 2.500 kg, meira en flestir keppinautar hans, svo hjólhýsi eða hestakerra er ekkert mál. Hann drífur fremur langt og hraðhleðslan er í meðallagi.',
      'Hann er aflminni og hægari en flestir á svipuðu verði, þótt það skipti minna máli í bíl af þessari gerð. XPENG X9 AWD Performance er 400.000 kr. dýrari en hleður með um 45% styttri stoppum og er aflmeiri, en drífur 35 km styttra.',
      'IONIQ 9 er einn sterkasti kosturinn fyrir stórar fjölskyldur sem ferðast um landið með fullan bíl eða kerru aftan í.',
    ],
    facts: '61ec7ef63fe4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er stór sjö sæta jeppi, rúmlega fimm metrar á lengd, með fullgildri þriðju sætaröð og öflugri útfærslu drifbúnaðarins. Hann hentar stórum fjölskyldum sem vilja mikið rými og þægilegan, hljóðlátan akstur.',
      'Skottið er eitt það stærsta á svipuðu verði og hann má draga 2.500 kg, meira en flestir keppinautar hans, svo hjólhýsi eða hestakerra er ekkert mál. Hann drífur fremur langt og hleður fremur hratt.',
      'Á móti kemur að hann er fremur dýr og drægni, hleðsla og snerpa eru aðeins í meðallagi miðað við verðið. Hyundai IONIQ 9 Long Range AWD er 1.500.000 kr. ódýrari með sama rými og álíka drægni, og munar þar aðeins um snerpuna.',
      'IONIQ 9 Performance er fyrir þá sem vilja stærsta Hyundai-jeppann með aukinni snerpu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: '3f4af478402e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric er lipur og hagnýtur framhjóladrifinn jepplingur sem hentar vel sem sparneytinn fjölskyldubíll eða í daglegar ferðir til og frá vinnu. Hann fer létt með þröng bílastæði en veitir samt ágæta yfirsýn og þægilegt aðgengi.',
      'Hann drífur lengra og er með stærra skott en flestir á svipuðu verði, með lítið framskott að auki. Í daglegu lífi þýðir það færri hleðslur í vikunni og nóg pláss fyrir innkaupin, jafnvel þegar vetrarkuldinn dregur úr drægninni.',
      'Hann hleður hins vegar hægar og er hægari en flestir keppinautar hans, og má aðeins draga 750 kg. Leapmotor C10 ProMax er 60.000 kr. ódýrari, hleður með um 25% styttri stoppum og má draga 750 kg meira, en hann er stærri bíll og ekki jafn lipur í þröngum stæðum.',
      'Fyrir þá sem vilja mikla drægni og pláss fyrir hverja krónu í þægilegum bíl, og geta sætt sig við lengri hleðslustopp, er Kona Electric einn hagkvæmasti kosturinn.',
    ],
    facts: '20908792bb67',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric er stór fjölnotabíll með sætum fyrir allt að níu manns og framúrstefnulegu útliti. Hann hentar stórum fjölskyldum, ferðaþjónustu og hópum þar sem sætafjöldi og rými skipta öllu.',
      'Hann er lengstur bíla á svipuðu verði og með einu af stærstu skottunum, og hann má draga 2.000 kg, meira en flestir keppinautar hans. Hann hleður líka mun hraðar en aðrir stórir fjölnotabílar.',
      'Gallinn er að hann drífur mjög stutt, og í vetrarkulda styttist drægnin enn frekar, svo langferðir kalla á fleiri hleðslustopp. Hann er líka aflminni en flestir í þessum verðflokki.',
      'Fyrir þá sem þurfa níu sæti er STARIA hagstæður kostur: Peugeot e-Traveller er 1.300.000 kr. dýrari og Toyota Proace Verso 2.400.000 kr. dýrari, og báðir drífa styttra, hlaða hægar og mega draga minna.',
    ],
    facts: '55454b8ff503',
    model: 'gemini-3.8-flash, thinking high',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er lítill og kantaður jepplingur með svipmiklu Jeep-útliti, systurbíll Fiat 600e, þótt hann sé aðeins framhjóladrifinn. Hann hentar þeim sem vilja hærri setstöðu og vaskan svip í meðfærilegum bæjarbíl.',
      'Hann er fremur ódýr, lipur í þröngum götum og auðveldur í stæðum. Í tölunum hefur hann þó fáa styrkleika umfram keppinautana.',
      'Í sínum verðflokki er hann meðal þeirra sem drífa styst, hlaða hægast og eru hægastir, skottið er minna en hjá flestum og hann má ekki draga kerru. XPENG G6 RWD Standard Range kostar það sama en drífur 35 km lengra, hleður með um 55% styttri stoppum, er með 216 l stærra skott og má draga 1.500 kg.',
      'Avenger er laglegur borgarbíll fyrir þá sem heillast af Jeep-svipnum, en gefur mikið eftir í drægni, hleðslu og plássi.',
    ],
    facts: '44e951bb483e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er stór rafdrifinn pallbíll, rúmlega fimm metrar á lengd, frá kóreska framleiðandanum sem áður hét SsangYong. Hann leggur áherslu á notagildi fremur en fágun og hentar þeim sem þurfa pall og dráttargetu í vinnu eða frístundum.',
      'Hann má draga 1.800 kg, meira en flestir á svipuðu verði, og pallurinn tekur það sem kemst ekki í skott. KGM ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir aðrir framleiðendur.',
      'Á móti kemur að hann hleður mjög hægt, drífur styttra en flestir keppinautar hans og er hægur í akstri. Þessi útfærsla er aðeins framhjóladrifin, en KGM Musso EV 4WD fæst með fjórhjóladrifi fyrir 1.300.000 kr. meira, þótt hann drífi 41 km styttra.',
      'Musso EV er eini rafdrifni pallbíllinn sem seldur er hér og hentar þeim sem þurfa vinnuþjark, ef þeir sætta sig við löng hleðslustopp.',
    ],
    facts: 'efc224526415',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er stór rafdrifinn pallbíll með fjórhjóladrifi, rúmlega fimm metrar á lengd, frá kóreska framleiðandanum sem áður hét SsangYong. Hann hentar þeim sem þurfa pall, dráttargetu og grip í vinnu, á malarvegum og utan malbiks.',
      'Hann má draga 1.800 kg, meira en flestir á svipuðu verði, og fjórhjóladrifið nýtist vel í snjó og drullu. KGM ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir aðrir framleiðendur.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst og hlaða hægast í þessum verðflokki, svo langferðir kalla á þolinmæði. Framhjóladrifni KGM Musso EV er 1.300.000 kr. ódýrari og drífur 41 km lengra, fyrir þá sem þurfa pallinn en ekki fjórhjóladrifið.',
      'Musso EV 4WD er eini rafdrifni fjórhjóladrifni pallbíllinn sem seldur er hér, sniðinn að vinnu frekar en langferðum.',
    ],
    facts: 'd66452b944fb',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er stór og kantaður jepplingur, 4,7 m á lengd, með grófu útliti og framhjóladrifi, sem höfðar til þeirra sem vilja háa setstöðu og mikið pláss fyrir fjölskylduna á viðráðanlegu verði.',
      'Skottið er það stærsta á svipuðu verði og hann má draga 1.500 kg, meira en flestir keppinautar hans. KGM ábyrgist auk þess rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir aðrir framleiðendur.',
      'Hann hleður hins vegar hægar og er hægari en flestir þeirra, og drægnin er aðeins í meðallagi. Leapmotor C10 ProMax AWD kostar 100.000 kr. meira, er fjórhjóladrifinn, mun aflmeiri og hleður með um 15% styttri stoppum, en skottið er 404 l minna.',
      'Torres EVX er prýðilegur kostur fyrir fjölskyldur sem þurfa mikið pláss og vilja langa ábyrgð, og gera ekki kröfu um hraða hleðslu.',
    ],
    facts: 'afa5bc47ed1b',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er lítill og nettur jepplingur, ætlaður sem hagkvæmur bæjarbíll fyrir þá sem aka mest innanbæjar og vilja bíl frá merki með gott orðspor.',
      'Stærsti kostur hans er verðið, enda er hann mjög ódýr, og hann má draga 750 kg, sem margir keppinautar hans mega ekki. Hann er lipur í þröngum stæðum og með lítið framskott fyrir hleðslusnúrurnar.',
      'Á móti kemur að hann drífur mjög stutt og hleður hægar en flestir á svipuðu verði, svo hann hentar illa til ferða milli landshluta. Leapmotor B10 kostar nánast það sama en er stærri bíll, drífur 44 km lengra, hleður með um 30% styttri stoppum og er með 68 l stærra skott.',
      'EV2 hentar best sem ódýr bæjarbíll eða annar bíll heimilisins, ekki sem eini bíllinn í langferðir.',
    ],
    facts: 'bc2e14d9b951',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er lítill og laglegur jepplingur, ætlaður sem hagkvæmur hversdagsbíll fyrir þá sem vilja komast á nýjan rafbíl frá merki með gott orðspor án þess að teygja budduna.',
      'Hann er mjög ódýr en drífur samt lengra en flestir á svipuðu verði, 136 km lengra en grunnútfærslan, svo hann dugar á milli landshluta þótt hann sé lítill.',
      'Hann er hins vegar meðal þeirra hægustu og aflminnstu í þessum verðflokki og skottið er minna en hjá flestum. Skoda Epiq 55 kostar 99.000 kr. meira en er mun sneggri, hleður með um 20% styttri stoppum, er með 113 l stærra skott og má draga 450 kg meira.',
      'EV2 Long Range er skynsamlegt val fyrir þá sem vilja mikla drægni fyrir lítið og sætta sig við rólegan takt.',
    ],
    facts: '2fdd5bf67da3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er lítill og nútímalegur jepplingur, ætlaður sem hagkvæmur hversdagsbíll fyrir fjölskylduna eða í daglegan innanbæjarakstur.',
      'Hann er mjög ódýr en samt sneggri en flestir á svipuðu verði, og skottið er stærra en hjá flestum keppinautum hans, með lítið framskott að auki.',
      'Gallarnir eru að hann má aðeins draga 500 kg og ábyrgðin á rafhlöðunni er með þeim stystu. Kia EV3 Long Range kostar 600.000 kr. meira en drífur 175 km lengra, hleður með um 25% styttri stoppum og má draga 1.000 kg.',
      'EV3 Standard Range er lipur og ódýr bæjarbíll, en flestum sem aka út á land borgar sig að fara í stærri rafhlöðuna.',
    ],
    facts: '42dcd1988f27',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er lítill og nútímalegur jepplingur sem drífur óvenju langt miðað við stærð og verð. Hann hentar þeim sem vilja hagkvæman og lipran bíl sem ræður líka við langferðir.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og hleður hraðar en flestir, svo hann dugar léttilega á milli landshluta, jafnvel í vetrarkulda. Skottið er líka stærra en hjá flestum keppinautum hans.',
      'Hann er hins vegar aflminni en flestir þeirra, aðeins framhjóladrifinn og ábyrgðin á rafhlöðunni er með þeim stystu. Kia EV3 Long Range AWD fæst með fjórhjóladrifi fyrir 1.100.000 kr. meira og má draga 500 kg meira.',
      'EV3 Long Range er eitt skynsamlegasta valið fyrir þá sem vilja mikla drægni og hraða hleðslu á hagstæðu verði.',
    ],
    facts: '837adf7be9b3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er lítill jepplingur með fjórhjóladrifi, ætlaður þeim sem vilja lipran bíl í þéttbýli sem ræður líka við vetrarfærð og langferðir.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, og má draga 1.500 kg, meira en flestir keppinautar hans.',
      'Helsti ókosturinn er að skottið er minna en hjá flestum þeirra. Skoda Elroq 85x er 200.000 kr. ódýrari, líka fjórhjóladrifinn og drífur álíka langt, en er með 57 l stærra skott og má draga 300 kg meira. Framhjóladrifni Kia EV3 Long Range sparar 1.100.000 kr. og drífur 33 km lengra.',
      'EV3 Long Range AWD er hagkvæmur kostur fyrir þá sem vilja nettan og langdrægan bíl með öruggu gripi allt árið.',
    ],
    facts: '52d51b19b573',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er fimm sæta hlaðbakur sem leggur áherslu á drægni og sparneytni frekar en jeppalag. Hann hentar þeim sem fara oft í langferðir og vilja hagkvæman bíl sem kemst langt á hverri hleðslu.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og hleður hraðar en flestir, svo hann dugar prýðilega milli landshluta, jafnvel í vetrarkulda.',
      'Hann er hins vegar hægari og aflminni en flestir keppinautar hans, skottið er minna og hann má aðeins draga 1.000 kg. Kia EV4 Fastback er 200.000 kr. ódýrari með nánast sömu drægni og 55 l stærra skott, fyrir þá sem sætta sig við lengri bíl.',
      'EV4 er skynsamlegur ferðabíll fyrir þá sem setja drægni í öndvegi.',
    ],
    facts: '7a4f0374acac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er lágur og straumlínulagaður fólksbíll með skottloki, 4,7 m á lengd, sem leggur áherslu á drægni og sparneytni. Hann hentar þeim sem aka mikið milli landshluta og vilja fólksbíl frekar en jeppling.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu, hleður hraðar en flestir og er með stærra skott en flestir. Hann er líka 200.000 kr. ódýrari en hlaðbakurinn Kia EV4.',
      'Gallarnir eru að hann er hægari og aflminni en flestir keppinautar hans og má aðeins draga 1.000 kg. Skoda Elroq 85 kostar það sama, er mun sneggri og jepplingur með hærri setstöðu, en drífur 33 km styttra.',
      'EV4 Fastback er hagkvæmur langferðabíll fyrir þá sem vilja komast langt fyrir peninginn.',
    ],
    facts: '1cdc5f54dd29',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er kassalaga og hagnýtur fjölskyldujepplingur með framhjóladrifi, sem leggur áherslu á gott útsýni, ríflegt innanrými og afslöppuð þægindi frekar en snerpu.',
      'Skottið er stærra en hjá flestum á svipuðu verði og 44 l framskott bætist við, og drægnin og hraðhleðslan eru í meðallagi.',
      'Hann er hins vegar meðal þeirra hægustu í þessum verðflokki og má aðeins draga 1.200 kg, minna en flestir keppinautar hans. Kia EV5 AWD fæst með fjórhjóladrifi fyrir 300.000 kr. meira og má draga 1.800 kg, og Smart #5 Pulse kostar 99.000 kr. meira, er fjórhjóladrifinn og hleður með um 40% styttri stoppum.',
      'EV5 er rúmgóður og þægilegur fjölskyldubíll fyrir þá sem þurfa hvorki snerpu né mikla dráttargetu.',
    ],
    facts: '3df0d9f65455',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er kassalaga og hagnýtur fjölskyldujepplingur með fjórhjóladrifi, sem sækir svip sinn í stærri jeppa merkisins og leggur áherslu á rými, háa setstöðu og þægindi.',
      'Skottið er stærra en hjá flestum á svipuðu verði og 44 l framskott bætist við, og hann má draga 1.800 kg, meira en flestir keppinautar hans.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir þeirra. Volkswagen ID.4 GTX kostar það sama, er fjórhjóladrifinn og drífur 45 km lengra, hleður með um 15% styttri stoppum og er mun sneggri. Framhjóladrifni Kia EV5 er 300.000 kr. ódýrari og drífur 46 km lengra.',
      'EV5 AWD hentar fjölskyldum sem vilja rými og dráttargetu ofar drægni og snerpu.',
    ],
    facts: '97e875731646',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 Long Range AWD er rennilegur jepplingur með fjórhjóladrifi og sportlegum svip, systurbíll Hyundai IONIQ 5, ætlaður þeim sem vilja líflegan akstur og hraða hleðslu á langferðum.',
      'Í sínum verðflokki er hann meðal þeirra sem hlaða hraðast og sneggri en flestir, og hann má draga 1.800 kg, með því mesta á þessu verði.',
      'Á móti kemur að ábyrgðin á rafhlöðunni er með þeim stystu og lágreistara lagið gefur ekki sömu setstöðu og hefðbundinn jepplingur. Hyundai IONIQ 5 Long Range AWD kostar það sama, drífur 24 km lengra, er með 30 l stærra skott og árinu lengri ábyrgð.',
      'EV6 er snöggur og vel búinn fjórhjóladrifsbíll fyrir þá sem vilja stutt hleðslustopp og geta dregið kerru.',
    ],
    facts: 'f4b80134c57d',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er stór og kassalaga sjö sæta jeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, með fullgildri þriðju sætaröð. Hann hentar stórum fjölskyldum sem þurfa mörg sæti og mikið pláss.',
      'Skottið er stærra en hjá flestum á svipuðu verði, 52 l framskott bætist við og hann má draga 2.500 kg, meira en flestir keppinautar hans. Hann hleður líka fremur hratt.',
      'Gallarnir eru að hann er fremur dýr, drífur styttra en flestir þeirra og ábyrgðin á rafhlöðunni er með þeim stystu. XPENG X9 AWD Performance er 400.000 kr. ódýrari, drífur 58 km lengra og hleður með um 50% styttri stoppum.',
      'EV9 er sterkur kostur fyrir stórar fjölskyldur sem draga hjólhýsi, en maður borgar fyrir stærðina.',
    ],
    facts: '17a8cbfdb49d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er stór sjö sæta jeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, sem sameinar mikið pláss og óvenju mikið afl fyrir svo stóran bíl.',
      'Í sínum verðflokki er hann sneggri og aflmeiri en flestir, skottið er eitt það stærsta og hann má draga 2.500 kg.',
      'Á móti kemur að hann er mjög dýr, meðal þeirra sem drífa styst og ábyrgðin á rafhlöðunni er með þeim stystu. Kia EV9 er 2.200.000 kr. ódýrari með sama rými og drægni, og munar aðeins um snerpuna.',
      'EV9 GT er fyrir þá sem vilja sjö sæti og mikla snerpu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: '7db76de8dd00',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er kassalaga fjölnotabíll byggður á sendibíl, með háu þaki, opnu innanrými og sætum fyrir allt að sjö. Hann hentar þeim sem þurfa að ferja marga farþega eða mikinn farangur daglega.',
      'Skottið er það stærsta á svipuðu verði og mikil lofthæð og einföld umgengni gera hann þægilegan fyrir stórar fjölskyldur. Hann má draga 1.500 kg.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst, hlaða hægast og eru hægastir í þessum verðflokki, og hann er aðeins afturhjóladrifinn. Peugeot e-5008 Dual Motor er 300.000 kr. ódýrari, fjórhjóladrifinn og drífur 61 km lengra, en skottið er 468 l minna.',
      'PV5 hentar þeim sem setja rými og sætafjölda ofar öllu og aka mest í nærumhverfinu.',
    ],
    facts: '6f35c55d5785',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er lítill fjögurra sæta borgarbíll, aðeins 3,6 m á lengd, og ódýrasti rafbíllinn sem seldur er hér. Hann hentar sem annar bíll heimilisins eða hagkvæmur skutlubíll sem kemst í hvaða stæði sem er.',
      'Verðið er hans eini stóri styrkleiki: hann er ódýrastur allra, og fyrir dagleg erindi innanbæjar dugar drægnin.',
      'Á móti kemur að hann drífur mjög stutt, hleður mjög hægt, er mjög aflítill, skottið er mjög lítið og hann má ekki draga kerru. MG MG4 Urban Standard Range kostar 600.000 kr. meira en drífur 60 km lengra, hleður með um 55% styttri stoppum og rúmar fimm, með 367 l stærra skott.',
      'T03 er einföld og ódýr leið inn í rafbílaheiminn fyrir þá sem aka eingöngu innanbæjar.',
    ],
    facts: 'f168cdfdc3ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er lítill og mjög ódýr jepplingur með framhjóladrifi, ætlaður sem einfaldur bæjarbíll fyrir þá sem vilja nýjan rafbíl fyrir sem minnst.',
      'Verðið er helsti kostur hans, og í innanbæjarakstri duga drægnin og snerpan vel.',
      'Á móti kemur að hann drífur mjög stutt og hleður fremur hægt, svo hann hentar illa til ferða milli landshluta, og merkið er nýlegt í Evrópu. Leapmotor B03X ProMax kostar 600.000 kr. meira en drífur 90 km lengra og hleður með um 25% styttri stoppum, og MG MG4 Urban Standard Range kostar það sama með 170 l stærra skott.',
      'B03X Pro er ódýr og handhægur bæjarbíll, en flestum borgar sig að fara í stærri rafhlöðuna.',
    ],
    facts: 'dba3166a5d28',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er lítill og mjög ódýr jepplingur með framhjóladrifi, ætlaður sem hagkvæmur bæjarbíll fyrir þá sem vilja nýjan rafbíl án þess að borga mikið.',
      'Hann drífur stutt miðað við rafbíla almennt en lengra en flestir á svipuðu verði, og er meðal þeirra sem hlaða hraðast, svo hleðslustopp á ferðalögum dragast síður á langinn. Hann er líka aflmeiri en flestir keppinautar hans.',
      'Gallarnir eru að merkið er nýlegt í Evrópu, þar sem það er selt í samstarfi við Stellantis, og skottið er aðeins í meðallagi. MG MG4 Urban Long Range kostar 300.000 kr. meira en drífur 34 km lengra og er með 170 l stærra skott, þótt hleðslustoppin séu um 30% lengri, og ódýrari útfærslan, Leapmotor B03X Pro, sparar 600.000 kr. en drífur 90 km styttra.',
      'Fyrir þá sem vilja ódýran og sprækan hversdagsbíl sem hleður hratt er B03X ProMax hagkvæmur kostur.',
    ],
    facts: 'e6210d4da47e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er fimm sæta hlaðbakur með afturhjóladrifi, ódýr en óvenju sprækur, ætlaður þeim sem vilja hagkvæman og skemmtilegan hversdagsbíl.',
      'Í sínum verðflokki drífur hann lengra og hleður hraðar en flestir, og er meðal þeirra sneggstu og aflmestu.',
      'Hann drífur samt fremur stutt miðað við rafbíla almennt, skottið er minna en hjá flestum keppinautum hans og afturhjóladrifið kallar á meiri aðgát í hálku. Leapmotor B05 ProMax kostar 500.000 kr. meira og drífur 81 km lengra, og MG MG4 Urban Long Range er með 232 l stærra skott fyrir 400.000 kr. meira.',
      'B05 Pro er sprækur og hagkvæmur bíll fyrir þá sem aka mest innanbæjar.',
    ],
    facts: 'db289d44bbc9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er fimm sæta hlaðbakur með afturhjóladrifi, ódýr en snarpur, sem drífur lengst, hleður hraðast og er sneggstur bíla á sínu verði.',
      'Hann dugar vel á milli landshluta, jafnvel í vetrarkulda, og hleðslustoppin á langferðum eru styttri en hjá öllum keppinautum hans.',
      'Gallarnir eru að skottið er minna en hjá flestum þeirra, afturhjóladrifið kallar á meiri aðgát í snjó og hálku og merkið er nýlegt í Evrópu. MG MG4 Urban Long Range er 100.000 kr. ódýrari með 232 l stærra skott, en drífur 66 km styttra og hleður hægar.',
      'B05 ProMax er eitt hagkvæmasta valið fyrir þá sem vilja mikla drægni og hraða hleðslu á lágu verði.',
    ],
    facts: '42f28bf1bbf3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er meðalstór jepplingur með afturhjóladrifi á sérlega lágu verði, ætlaður þeim sem vilja hærri setstöðu og meira rými en í smábíl án þess að borga mikið.',
      'Í sínum verðflokki er hann meðal þeirra aflmestu, sneggri en flestir og hleður hraðar, og skottið er stærra en hjá flestum. Hann má líka draga 750 kg, meira en flestir keppinautar hans.',
      'Á móti kemur að hann drífur mjög stutt miðað við rafbíla almennt, svo langferðir í vetrarkulda kalla á vel skipulögð stopp, og merkið er nýlegt í Evrópu. Leapmotor B10 67.1 kWh kostar 800.000 kr. meira og drífur 73 km lengra, og MG MG4 Urban Long Range er 100.000 kr. ódýrari og drífur 55 km lengra.',
      'B10 gefur mikið pláss og snerpu fyrir lítið, fyrir þá sem aka mest í nærumhverfinu.',
    ],
    facts: '8cce705ff9bf',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 67.1 kWh er meðalstór jepplingur með afturhjóladrifi og stærri rafhlöðu, ætlaður þeim sem vilja rúmgóðan og sprækan bíl á lágu verði sem ræður líka við ferðalög.',
      'Í sínum verðflokki drífur hann lengra en flestir, er meðal þeirra sem hlaða hraðast og aflmeiri en flestir.',
      'Skottið og dráttargetan eru hins vegar aðeins í meðallagi, afturhjóladrifið kallar á góð vetrardekk og merkið er nýlegt í Evrópu. Skoda Epiq 55 kostar 200.000 kr. meira, drífur álíka langt, er með 45 l stærra skott og má draga 450 kg meira.',
      'B10 67.1 kWh er hagkvæmur og sprækur jepplingur fyrir þá sem vilja komast um landið fyrir lítið.',
    ],
    facts: '820b4bbc7942',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er stór jepplingur með afturhjóladrifi, 4,7 m á lengd, sem býður stærð fjölskyldubíls á verði sem venjulega fylgir smábílum.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði og má draga 1.500 kg, með því mesta í hans verðflokki. Auk skottsins er 32 l framskott.',
      'Gallarnir eru að hann drífur styttra en flestir keppinautar hans, afturhjóladrifið kallar á meiri aðgát í hálku og merkið er nýlegt í Evrópu. Leapmotor C10 ProMax kostar 700.000 kr. meira og drífur 90 km lengra.',
      'C10 Pro er stór og þægilegur fjölskyldubíll fyrir lítið, ef drægnin hentar ferðalögunum.',
    ],
    facts: '77d2c83a4f96',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er stór jepplingur með afturhjóladrifi, 4,7 m á lengd, sem býður mikið rými og stóra rafhlöðu á hóflegu verði.',
      'Í sínum verðflokki drífur hann lengra og hleður hraðar en flestir, er meðal þeirra aflmestu og má draga 1.500 kg, meira en flestir keppinautar hans. Auk skottsins er 32 l framskott.',
      'Á móti kemur að hann er aðeins afturhjóladrifinn, skottið er aðeins í meðallagi og merkið er nýlegt í Evrópu. Leapmotor C10 ProMax AWD fæst með fjórhjóladrifi fyrir 300.000 kr. meira, en drífur 75 km styttra.',
      'C10 ProMax gefur mikinn bíl fyrir peninginn, fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: '530b13547a1f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er stór jepplingur með fjórhjóladrifi og gríðarlegu afli, sem býður bæði rými og snerpu fyrir hóflegt verð.',
      'Hann er meðal sneggstu og aflmestu bíla á svipuðu verði og má draga 1.500 kg, meira en flestir keppinautar hans. Auk skottsins er 32 l framskott.',
      'Hann drífur hins vegar styttra og hleður hægar en flestir þeirra, og merkið er nýlegt í Evrópu. Afturhjóladrifni Leapmotor C10 ProMax er 300.000 kr. ódýrari og drífur 75 km lengra, fyrir þá sem þurfa ekki fjórhjóladrifið.',
      'C10 ProMax AWD er fyrir þá sem vilja fjórhjóladrif og mikið afl fyrir lítið, frekar en hámarksdrægni.',
    ],
    facts: 'de92b93809ad',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er stór og fágaður lúxusfólksbíll með skottloki og framhjóladrifi, rúmlega fimm metrar á lengd, sem setur þægindi, mýkt og hljóðláta ferð ofar afli. Hann hentar þeim sem kunna að meta rótgróinn áreiðanleika Lexus og vilja afslappaðan langferðabíl.',
      'Lexus ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir aðrir framleiðendur, og vönduð fjöðrun og lágvær gangur gera ferðirnar ljúfar. Hann drífur líka fremur langt.',
      'Á móti kemur að hann er meðal þeirra aflminnstu og hægustu á svipuðu verði, hleður hægar en flestir keppinautar hans og má ekki draga kerru. BMW i5 eDrive40 er 90.000 kr. ódýrari, drífur álíka langt, er mun sneggri og má draga 1.500 kg.',
      'ES 350e er fyrir þá sem setja ró, þægindi og langa ábyrgð í öndvegi.',
    ],
    facts: '88df29fca349',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er stór og fágaður lúxusfólksbíll með skottloki og fjórhjóladrifi, rúmlega fimm metrar á lengd, sem leggur áherslu á hljóðlátan akstur og vandaða smíði frekar en sportlega takta.',
      'Lexus ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir aðrir framleiðendur, og góð hljóðeinangrun og mjúk fjöðrun gera bæði innanbæjarakstur og langferðir afslappandi.',
      'Í sínum verðflokki drífur hann þó styttra, hleður hægar og er aflminni en flestir, skottið er minna og hann má ekki draga kerru. Framhjóladrifni Lexus ES 350e er 1.000.000 kr. ódýrari og drífur 51 km lengra.',
      'ES 500e er fyrir þá sem vilja fjórhjóladrif með þægindum Lexus, en ES 350e gefur meira fyrir peninginn.',
    ],
    facts: 'ec0d08614bb9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er lúxusjepplingur með framhjóladrifi sem setur þægindi, fágað yfirbragð og hljóðlátan akstur í fyrirrúm. Hann hentar þeim sem vilja vandaðan og afslappaðan hversdagsbíl.',
      'Hann drífur fremur langt, og há setstaða og vandaður frágangur Lexus gera hann notalegan í daglegum akstri.',
      'Í sínum verðflokki drífur hann hins vegar styttra, hleður hægar og er meðal þeirra aflminnstu, og hann má aðeins draga 750 kg. BMW i5 eDrive40 kostar 310.000 kr. meira en drífur 23 km lengra, er mun sneggri og má draga 1.500 kg.',
      'RZ 350e heillar með hljóðlátum munaði, en fyrir verðið fæst meira afl og drægni annars staðar.',
    ],
    facts: '0a87c0c60e7f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er lúxusjepplingur með fjórhjóladrifi sem leggur áherslu á vönduð þægindi og hljóðlátan akstur, fyrir þá sem meta byggingargæði merkisins.',
      'Hann er sneggri en flestir á svipuðu verði, fjórhjóladrifið gefur honum traust grip og vandaður frágangur gerir hann notalegan í akstri.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst og hlaða hægast í þessum verðflokki. Framhjóladrifni Lexus RZ 350e er 1.300.000 kr. ódýrari og drífur 102 km lengra, og Mercedes-Benz EQE SUV 350 4MATIC kostar 500.000 kr. meira, er fjórhjóladrifinn og drífur 94 km lengra.',
      'RZ 500e er ljúfur bíll fyrir innanbæjarakstur, en dýr kostur fyrir þá sem aka mikið um landið.',
    ],
    facts: 'f94441e54214',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er öflugasta útfærsla RZ, lúxusjepplingur með fjórhjóladrifi og sportlegu yfirbragði, sem sameinar fágun og hljóðlátan akstur Lexus og aukna snerpu.',
      'Hann er sneggri en flestir á svipuðu verði, og fjöðrun og vönduð hljóðvist gera ferðina afslappaða.',
      'Á móti kemur að hann er mjög dýr og meðal þeirra sem drífa styst og hlaða hægast í sínum verðflokki. Lexus RZ 500e er 1.900.000 kr. ódýrari og nánast jafn snöggur, og Audi SQ6 e-tron kostar 600.000 kr. meira en drífur 136 km lengra og hleður með um 45% styttri stoppum.',
      'RZ 550e F SPORT er fyrir þá sem vilja sportlegasta Lexus-inn, en flestum dugar RZ 500e.',
    ],
    facts: '4dd4a5df1719',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er nettur lúxusjepplingur með framhjóladrifi, ætlaður þeim sem leita eftir fáguðum vinnubrögðum, góðri hljóðvist og liprum bíl í borgarumferðina. Hér fást þekkt gæði og áreiðanleiki Lexus í stærð sem er þægileg í daglegu amstri og þröngum stæðum.',
      'Innanrýmið einkennist af vönduðum efnum og mýkt, og Lexus ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir aðrir framleiðendur.',
      'Helsti gallinn er hve mikið maður gefur eftir miðað við verðið: hann er meðal þeirra sem drífa styst, hlaða hægast og eru hægastir í sínum verðflokki, skottið er eitt það minnsta og hann má ekki draga kerru. Audi Q6 e-tron kostar 100.000 kr. meira en er stór fjórhjóladrifinn jepplingur sem drífur 175 km lengra, hleður með um 80% styttri stoppum og má draga 2.400 kg.',
      'UX 300e er ljúfur lúxusbíll fyrir borgina, en fyrir sama verð fær maður mun meiri bíl annars staðar.',
    ],
    facts: '758669913f52',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er lágur og rennilegur fólksbíll með afturhlera og afturhjóladrifi, nærri fimm metrar á lengd, ætlaður þeim sem vilja þægilegan og stílhreinan ferðabíl frekar en jeppling.',
      'Hann drífur lengra en flestir á svipuðu verði, auk skottsins er 70 l framskott og hann má draga 1.500 kg, meira en flestir keppinautar hans.',
      'Hann hleður hins vegar hægar en flestir þeirra og skottið er minna. Nissan Leaf Extended Range kostar það sama, drífur 70 km lengra, hleður með um 40% styttri stoppum og er með 100 l stærra skott, þótt hann sé mun minni bíll.',
      '6e Long Range hentar þeim sem hlaða mest heima og vilja stóran og þægilegan fólksbíl á hagstæðu verði.',
    ],
    facts: '826ddf856106',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e er stór og stílhreinn jepplingur með afturhjóladrifi, 4,85 m á lengd, sem leggur áherslu á þægindi og yfirvegaðan akstur frekar en snerpu. Hann hentar fjölskyldum sem vilja stóran og vandaðan bíl á hóflegu verði.',
      'Hann hleður hraðar en flestir á svipuðu verði, auk skottsins er 80 l framskott undir vélarhlífinni og hann má draga 1.500 kg, meira en flestir keppinautar hans. Fyrir verðið fær maður óvenju stóran bíl.',
      'Gallarnir eru að hann er hægari en flestir þeirra og aðeins afturhjóladrifinn, sem kallar á meiri varkárni í snjó og hálku. Hongqi EHS5 kostar 100.000 kr. meira en drífur 38 km lengra, hleður með um 25% styttri stoppum og er mun sneggri.',
      'CX-6e er heilsteyptur og fremur ódýr kostur fyrir þá sem vilja stóran og þægilegan fjölskyldubíl og þurfa ekki fjórhjóladrif.',
    ],
    facts: '4b812db57179',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er rennilegur fólksbíll með skottloki og fjórhjóladrifi, þar sem áherslan er á fágaðan lúxus, akstursánægju og þægindi. Hann hentar þeim sem vilja hefðbundinn lúxusfólksbíl frekar en jeppling.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og sneggstu og hleður hraðar en flestir, svo langferðir um landið verða áhyggjulausar, jafnvel í vetrarkulda. Auk skottsins er 101 l framskott undir vélarhlífinni.',
      'Helsti ókosturinn er að skottið er minna en hjá flestum keppinautum hans. Volvo EX60 P12 er 100.000 kr. ódýrari, drífur 48 km lengra, hleður með um 15% styttri stoppum, er með 53 l stærra skott og má draga 600 kg meira, fyrir þá sem sætta sig við jeppalag.',
      'C 400 er sterkur kostur fyrir þá sem vilja snöggan og langdrægan lúxusfólksbíl.',
    ],
    facts: '0def61a05830',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er rennilegur fólksbíll með skottloki og afturhjóladrifi, ætlaður þeim sem vilja vandaðan þýskan fólksbíl sem fer sparlega með orkuna.',
      'Í sínum verðflokki drífur hann lengra en flestir og er meðal þeirra sem hlaða hraðast, svo hleðslustopp á langferðum verða stutt. Auk skottsins er 101 l framskott undir vélarhlífinni.',
      'Hann er hins vegar hægari og aflminni en flestir keppinautar hans og skottið er eitt það minnsta. Mercedes-Benz CLA 350 4MATIC fæst með fjórhjóladrifi og 229 km meiri drægni fyrir 1.900.000 kr. meira.',
      'CLA 200 er glæsilegur og sparneytinn ferðabíll fyrir þá sem þurfa hvorki fjórhjóladrif né mikið pláss.',
    ],
    facts: '710ed58430b1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er rennilegur fólksbíll með skottloki og fjórhjóladrifi, ætlaður þeim sem leggja oft í langferðir og vilja vandaðan lúxusbíl frekar en jeppling.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, svo langferðir um landið kalla á fá og stutt stopp, jafnvel í vetrarkulda. Auk skottsins er 101 l framskott, og hann má draga 1.800 kg.',
      'Helsti ókosturinn er að skottið er eitt það minnsta á þessu verði. Audi A6 e-tron Sportback quattro kostar 200.000 kr. meira, er með 97 l stærra skott og meira afl og má draga 300 kg meira, en drífur 58 km styttra.',
      'CLA 350 4MATIC er einn sterkasti langferðabíllinn á sínu verði.',
    ],
    facts: '4cb076da8aba',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er rennilegur skutbíll með fjórhjóladrifi, ætlaður þeim sem vilja fágaðan ferðabíl með hagnýtara skotti en fólksbíllinn án þess að fara í jeppa.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, og auk skottsins er 101 l framskott undir vélarhlífinni.',
      'Skottið er þó samt eitt það minnsta á þessu verði, og hann er aflminni og má draga minna en flestir keppinautar hans. Audi A6 e-tron Avant quattro er 200.000 kr. ódýrari, með 47 l stærra skott og meira afl og má draga 300 kg meira, en drífur 69 km styttra og hleður hægar.',
      'CLA Shooting Brake er fyrir þá sem vilja glæsilegan og langdrægan skutbíl sem lágmarkar tímann við hleðslustöðvar.',
    ],
    facts: 'ef0370bc5c2d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er lágur og rennilegur sportfólksbíll með fjórhjóladrifi og aðeins fjórum sætum, hreinræktaður afkastabíll fyrir þá sem leita að akstursánægju og miklu afli.',
      'Hann er sneggstur bíla á svipuðu verði og meðal þeirra aflmestu, en drífur samt lengra og hleður hraðar en flestir keppinautar hans. Auk skottsins er 101 l framskott undir vélarhlífinni.',
      'Gallarnir eru að hann tekur aðeins fjóra, skottið er eitt það minnsta og hann má ekki draga kerru. Mercedes-Benz CLA 350 4MATIC er 3.700.000 kr. ódýrari, rúmar fimm, drífur 91 km lengra og má draga 1.800 kg, og gefur aðeins eftir í snerpu.',
      'CLA AMG 45 er fyrir þá sem vilja mikið afl og langa drægni, svo lengi sem fjögur sæti duga.',
    ],
    facts: 'fe5b7900b14e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er nettur lúxusjepplingur með fjórhjóladrifi sem leggur áherslu á fágaðan, hljóðlátan og mjúkan akstur, fyrir þá sem vilja þægindi þýska merkisins í lipurri stærð.',
      'Hann má draga 1.800 kg, með því mesta á svipuðu verði, og vandaður frágangur og góð hljóðeinangrun skapa rólegt andrúmsloft.',
      'Á móti kemur að hann drífur styttra en flestir keppinautar hans, er meðal þeirra sem hlaða hægast og skottið er eitt það minnsta. BMW iX1 xDrive 30 kostar 200.000 kr. meira en hleður með um 20% styttri stoppum, er mun sneggri og með 150 l stærra skott.',
      'EQA höfðar til þeirra sem setja þægindi og merkið í forgang og þurfa að draga kerru, frekar en hraða eða pláss.',
    ],
    facts: 'b69d33295c87',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er kassalaga jepplingur með fjórhjóladrifi og allt að sjö sætum, sem sameinar meðfærilega stærð, sveigjanlegt sætarými og fágað yfirbragð merkisins.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, og má draga 2.000 kg, með því mesta á þessu verði. Auk skottsins er 127 l framskott undir vélarhlífinni, eitt það stærsta sem fæst.',
      'Gallarnir eru að hann er fremur dýr og þriðja sætaröðin hentar helst börnum. Skoda Peaq 90x er 800.000 kr. ódýrari, drífur nánast jafn langt og er með 395 l stærra skott, þótt hleðslustoppin séu um 55% lengri.',
      'GLB 350 er traustur ferðabíll fyrir þá sem vilja sjö sæti, mikla drægni og stutt hleðslustopp í meðfærilegri stærð.',
    ],
    facts: 'd49336def5c3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er stór lúxusjepplingur með fjórhjóladrifi, 4,84 m á lengd, sem býður snerpu, þægindi og vandaðan frágang merkisins.',
      'Skottið er stærra en hjá flestum á svipuðu verði og 128 l framskott bætist við, eitt það stærsta sem fæst. Hann má draga 2.400 kg, meira en flestir keppinautar hans, og er sneggri en flestir þeirra.',
      'Á móti kemur að drægnin og hraðhleðslan eru aðeins í meðallagi miðað við verðið. Mercedes-Benz GLC 400 4MATIC kostar 400.000 kr. meira en drífur 102 km lengra og hleður með um 20% styttri stoppum.',
      'GLC 300 er fyrir þá sem vilja rúmgóðan og vandaðan jeppling sem dregur hjólhýsi, en GLC 400 er peninganna virði fyrir þá sem aka mikið um landið.',
    ],
    facts: 'bb72ff6499e0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er stór lúxusjepplingur með fjórhjóladrifi, 4,84 m á lengd, sem býður mikið afl, mikla drægni og vandaðan frágang merkisins.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu, hleður hraðar og er sneggri en flestir, svo langferðir um landið kalla á fá og stutt stopp. Skottið er líka stærra en hjá flestum, 128 l framskott bætist við og hann má draga 2.400 kg.',
      'Veikleikarnir eru fáir, helst að hann er fremur dýr. BMW iX3 50 xDrive er 400.000 kr. ódýrari, drífur 90 km lengra og hleður með um 15% styttri stoppum, en er með minna skott og má draga 400 kg minna.',
      'GLC 400 er einn heildstæðasti lúxusjepplingurinn á sínu verði, jafnvígur á langferðir, pláss og drátt.',
    ],
    facts: '14347312b37b',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er stór lúxusjeppi með fjórhjóladrifi sem leggur áherslu á hljóðlátan og mjúkan akstur og vandað innanrými, fyrir þá sem setja þægindi ofar snerpu.',
      'Hann drífur fremur langt miðað við rafbíla almennt, má draga 1.800 kg, og góð hljóðvist og fjöðrun gera langferðir afslappaðar.',
      'Gallarnir eru að hann er mjög dýr, og í sínum verðflokki er hann meðal þeirra sem hlaða hægast og þeirra aflminnstu og drífur styttra en flestir. BMW iX xDrive 45 Sport kostar það sama en drífur 51 km lengra, er mun sneggri og má draga 700 kg meira.',
      'EQE SUV höfðar til þeirra sem vilja ró og lúxus Mercedes, en fyrir sama verð fæst meira annars staðar.',
    ],
    facts: '44caa0b259c8',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC er stór og rennilegur lúxusfólksbíll með fjórhjóladrifi, rúmlega fimm metrar á lengd, smíðaður fyrir afslappaðar langferðir í hámarksþægindum.',
      'Hann drífur lengst allra rafbíla á listanum, svo hringvegurinn kallar á fá stopp, jafnvel í vetrarkulda. Hann hleður líka hraðar en flestir á svipuðu verði og Mercedes ábyrgist rafhlöðuna í 10 ár, lengur en flestir aðrir framleiðendur.',
      'Á móti kemur að hann er mjög dýr, skottið og dráttargetan eru minni en hjá flestum keppinautum hans, og lágur fólksbíll býður ekki veghæð jeppa. Porsche Cayenne Turbo kostar 460.000 kr. meira, er mun sneggri og má draga 1.300 kg meira, en drífur 246 km styttra.',
      'EQS er fyrir þá sem vilja hágæða ferðabíl sem kemst lengra á einni hleðslu en nokkur annar.',
    ],
    facts: 'ff4f09dbd41a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er risavaxinn lúxusjeppi með fjórhjóladrifi og allt að sjö sætum, rúmlega fimm metrar á lengd, hannaður eins og fyrsta farrými á hjólum.',
      'Hann drífur lengra en flestir á svipuðu verði og Mercedes ábyrgist rafhlöðuna í 10 ár, lengur en flestir aðrir framleiðendur, og hljóðvist og fágun eru í algjörum forgangi.',
      'Gallarnir eru að hann er mjög dýr, meðal þeirra sem hlaða hægast og þeirra aflminnstu í sínum verðflokki, og dregur minna en flestir keppinautar hans. Volvo EX90 Twin Motor Performance er 8.200.000 kr. ódýrari, tekur líka sjö, er sneggri og má draga 400 kg meira, þótt hann drífi 55 km styttra.',
      'EQS SUV er fyrir þá sem vilja fáguðustu ferðaþægindin og eru tilbúnir að greiða vel fyrir þau.',
    ],
    facts: '380eceea0163',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er fjölnotabíll byggður á sendibíl, með rennihurðum, sætum fyrir allt að sjö manns og vandaðri innréttingu en vanalega fylgir bílum af þessari gerð. Hann hentar stórum fjölskyldum í daglegt amstur og skólaakstur í þéttbýli.',
      'Skottið er stærra en hjá flestum á svipuðu verði og hann má draga 1.500 kg, tvöfalt á við Peugeot e-Rifter. Sveigjanlegt sætaskipulag og rennihurðir gera umgengni við aftursætin sérlega þægilega.',
      'Á móti kemur að hann drífur mjög stutt, sérstaklega í vetrarkulda, hleður mjög hægt og er meðal þeirra aflminnstu í sínum verðflokki. Peugeot e-Rifter er 1.100.000 kr. ódýrari, drífur 61 km lengra og hleður með um 40% styttri stoppum, og Kia PV5 drífur 130 km lengra fyrir 700.000 kr. meira.',
      'EQT 200 er laglegur og hagnýtur fjölskyldubíll innanbæjar, en stutt drægni og hæg hleðsla gera hann erfiðan sem eina bíl heimilisins.',
    ],
    facts: '289224a0b57d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 er stór lúxusfjölnotabíll byggður á sendibíl, sem rúmar allt að átta manns með fullgildum sætum í öllum röðum. Hann hentar stórum fjölskyldum og fyrirtækjum í fólksflutningum sem vilja fágað yfirbragð.',
      'Skottið er það stærsta á svipuðu verði, svo jafnvel fullskipaður bíll rúmar farangur, og hver farþegi fær gott höfuð- og fótarými.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst, hlaða hægast og eru hægastir í sínum verðflokki, og hann má ekki draga kerru. Mercedes-Benz eVito Tourer er sami bíll með einfaldari innréttingu og 900.000 kr. ódýrari, og Kia EV9 GT kostar 100.000 kr. meira, tekur sjö, er fjórhjóladrifinn og drífur 147 km lengra.',
      'EQV 300 er rúmgóður ferðavagn fyrir stóra hópa í styttri ferðum, en krefst þolinmæði á langkeyrslu.',
    ],
    facts: '7e1d59a12e8f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er stór og lúxusbúinn fjölnotabíll með framhjóladrifi og allt að átta sætum, af nýrri kynslóð rafdrifinna fjölnotabíla Mercedes.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu, svo hann dugar vel á milli landshluta, jafnvel í vetrarkulda, og skottið er stærra en hjá flestum. Hann má draga 1.750 kg.',
      'Hann er hins vegar meðal þeirra hægustu og aflminnstu og aðeins framhjóladrifinn. Mercedes-Benz VLE 400 4MATIC fæst með fjórhjóladrifi og 2.500 kg dráttargetu fyrir 1.500.000 kr. meira.',
      'VLE 300 er fyrir þá sem þurfa átta sæti og mikla drægni, og geta verið án fjórhjóladrifs.',
    ],
    facts: '2ef409b18730',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er stór lúxusfjölnotabíll með fjórhjóladrifi og allt að átta sætum, sniðinn að stórum fjölskyldum og hópferðum þar sem þægindi og rými skipta öllu.',
      'Í sínum verðflokki drífur hann lengra en flestir, skottið er eitt það stærsta og hann má draga 2.500 kg, meira en flestir keppinautar hans.',
      'Á móti kemur að hann er mjög dýr og hægari en flestir þeirra. Framhjóladrifni Mercedes-Benz VLE 300 er 1.500.000 kr. ódýrari og drífur 59 km lengra, fyrir þá sem þurfa hvorki fjórhjóladrif né mikla dráttargetu.',
      'VLE 400 er fágætur en dýr kostur fyrir þá sem þurfa átta sæti, fjórhjóladrif og dráttargetu.',
    ],
    facts: '8a6751d961e1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er goðsagnakenndur torfærujeppi í rafdrifinni útgáfu, kassalaga og grófur, með fjórum rafmótorum, einum við hvert hjól, sem gefa honum fágæta færni í snjó og á ótroðnum slóðum.',
      'Hann er aflmeiri en flestir á svipuðu verði, og há setstaða og sérstæð nærvera gera hann einstakan; fáir aðrir rafbílar keppa við hann í torfærum.',
      'Kantað formið kostar hins vegar orku: hann er meðal þeirra sem drífa styst og hlaða hægast í sínum verðflokki, og skottið er minna en hjá flestum keppinautum hans. Range Rover Electric EV450 er 400.000 kr. ódýrari, líka torfærufær lúxusjeppi, en drífur 127 km lengra og hleður með um 50% styttri stoppum.',
      'G-class er lífsstílstæki sem enginn velur út frá tölunum, heldur sögunni og getunni utan vega.',
    ],
    facts: '8335d9035eab',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer er rafdrifin smárúta byggð á sendibíl, með sætum fyrir allt að níu manns, ætluð þeim sem þurfa fyrst og fremst að flytja marga í senn.',
      'Skottið er eitt það stærsta á svipuðu verði og sætaskipanin sveigjanleg, og bíllinn er hljóðlátur og lipur miðað við stærð.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst, hlaða hægast og eru hægastir í sínum verðflokki, og hann má ekki draga kerru. Toyota Proace Verso er 3.600.000 kr. ódýrari, drífur álíka langt, hleður með um 20% styttri stoppum og má draga 1.000 kg.',
      'eVito Tourer hentar sem vinnuþjarkur í fólksflutningum innanbæjar, en fyrir verðið fæst meira hjá keppinautunum.',
    ],
    facts: '28e3aa2ba305',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta blæjusportbíll sem sker sig rækilega úr á rafbílamarkaðnum. Hann einkennist af lágri byggingu og vængjahurðum sem lyftast upp, og er smíðaður fyrir fólk sem leitar að hreinni skemmtun og akstursupplifun frekar en hversdagslegu flutningstæki.',
      'Hann er aflmeiri en flestir á svipuðu verði og meðal þeirra allra sneggstu úr kyrrstöðu. Fjórhjóladrifið kemur aflinu niður í malbikið og lágur þyngdarpunktur gerir hann stöðugan og kvikan í beygjum.',
      'Á móti kemur að hann drífur fremur stutt, er meðal þeirra sem hlaða hægast í sínum verðflokki og skottið er eitt það minnsta. Ef fjölskyldan þarf að komast fyrir og langferðir eru á dagskrá er Skoda Enyaq RS 200.000 kr. ódýrari, með fimm sæti, 99 km meiri drægni og um 40% styttri hleðslustopp.',
      'Þetta er leikfang sem maður kaupir með hjartanu fremur en skynseminni.',
    ],
    facts: '5aed9ed82d06',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mg4-urban-standard-range': {
    paragraphs: [
      'MG MG4 Urban Standard Range er fimm sæta hlaðbakur í fullri stærð sem kostar svipað og mun smærri borgarbílar. Hann er hannaður sem lipur og hagkvæmur vinnuhestur til daglegra nota í þéttbýli og nærsveitum, og hentar sérstaklega vel sem ódýr fyrsti rafbíll eða annar bíll heimilisins.',
      'Helsti styrkur bílsins er kaupverðið, enda er hann mjög ódýr, og skottið er óvenju stórt fyrir svo ódýran bíl. Krafturinn dugar ágætlega í hefðbundinni umferð og drægnin í daglegu skutli, jafnvel þótt hún minnki í vetrarkulda.',
      'Á móti kemur að hann drífur mjög stutt, hleður mjög hægt og má aðeins draga 500 kg, svo langferðir milli landshluta krefjast þolinmæði. MG MG4 Urban Long Range drífur 91 km lengra fyrir 900.000 kr. meira, með sama stóra skottinu.',
      'Fyrir hefðbundinn innanbæjarakstur fæst varla meiri bíll fyrir peninginn.',
    ],
    facts: 'af97992b2a74',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er framhjóladrifinn fimm sæta hlaðbakur, sniðinn að hagkvæmum daglegum akstri fyrir þá sem vilja komast á nýjan rafbíl fyrir sem minnst.',
      'Kaupandinn fær mikið fyrir peninginn: skottið er það stærsta á svipuðu verði, hann er meðal þeirra langdrægustu og ódýrari á hvern kílómetra drægni en flestir keppinautar hans. Hann hleður líka hraðar en flestir þeirra, sem gerir stöku ferðir út á land raunhæfari en á mörgum öðrum ódýrum bílum.',
      'Gallarnir eru að hann er hægari en flestir þeirra og má aðeins draga 500 kg. Leapmotor B05 ProMax kostar 100.000 kr. meira en drífur 66 km lengra og er mun sneggri, þótt skottið sé 232 l minna.',
      'Fyrir þá sem vilja sem mest pláss og drægni fyrir sem minnst er MG4 Urban Long Range skynsamleg kaup.',
    ],
    facts: 'b9c1781d3300',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er meðalstór jepplingur með afturhjóladrifi, ætlaður þeim sem vilja hagkvæman fjölskyldubíl sem er líka sprækur í akstri.',
      'Hann drífur lengra, hleður hraðar og er sneggri en flestir á svipuðu verði, og skottið er stærra en hjá flestum keppinautum hans.',
      'Á móti kemur að hann má aðeins draga 750 kg og ábyrgðin á rafhlöðunni er með þeim stystu. Volkswagen ID. Cross kostar 100.000 kr. meira, má draga 450 kg meira og hefur árinu lengri ábyrgð, en drífur 38 km styttra.',
      'MGS5 er sprækur og hagkvæmur fjölskyldubíll fyrir þá sem þurfa ekki að draga mikið.',
    ],
    facts: 'de0a607d37b7',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er meðalstór jepplingur, 4,7 m á lengd, sem býður fjórhjóladrif og mikið afl á verði sem fáir keppinautar ná. Hann hentar fjölskyldum sem vilja rúmgóðan og kraftmikinn bíl án þess að borga fyrir þekktara merki.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði, og auk 493 l skotts er 102 l framskott undir vélarhlífinni. Hann má draga 1.500 kg, meira en flestir keppinautar hans, svo hann ræður vel við kerru eða lítið hjólhýsi.',
      'Gallarnir eru að hann hleður hægar en flestir þeirra og ábyrgðin á rafhlöðunni er með þeim stystu. Subaru Uncharted býður um 25% styttri hleðslustopp og ári lengri ábyrgð fyrir 100.000 kr. meira, en hann er með 90 l minna skott og minna afl.',
      'Fyrir þá sem vilja mikið af bíl, afli og plássi fyrir peninginn og hlaða mest heima er MGS6 Dual Motor sterkur kostur.',
    ],
    facts: 'f116badf00c6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er lítill og nettur jepplingur með líflegri hönnun Mini, ætlaður þeim sem vilja persónulegan og lipran bæjarbíl með fimm sætum.',
      'Hann er auðveldur í þröngum stæðum og fremur ódýr, og vandaður frágangur og sérstæð innrétting gera hann eftirminnilegri en flesta smábíla. Hann má líka draga 750 kg, sem Fiat 500e og Fiat 600e mega ekki.',
      'Á móti kemur að hann drífur mjög stutt, sérstaklega í vetrarkulda, er meðal þeirra sem hlaða hægast í sínum verðflokki og skottið er eitt það minnsta. Fiat 600e er 100.000 kr. ódýrari, drífur 90 km lengra og hleður með um 30% styttri stoppum.',
      'Aceman E er heillandi bæjarbíll, en síður heppilegur ef ferðast er reglulega milli landshluta.',
    ],
    facts: '7f8e2afc1767',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er meðalstór jepplingur með framhjóladrifi, stærsti bíll Mini og sá sem hentar fjölskyldum best. Hann sker sig úr fyrir sjarma og vandaða, líflega hönnun merkisins, bæði að utan og innan.',
      'Það sem hann býður umfram keppinautana er fyrst og fremst stíllinn og frágangurinn: hringlaga skjárinn og vönduð efni gera innréttinguna eftirminnilegri en í flestum bílum á sama verði. Í tölunum hefur hann fáa styrkleika.',
      'Hann drífur styttra, hleður hægar og er hægari en flestir keppinautar hans, skottið er minna og hann má aðeins draga 750 kg. Fjórhjóladrifna útfærslan, Mini Countryman SE 4x4, kostar 700.000 kr. meira, en Mercedes-Benz EQA SUV 300 4MATIC fæst með fjórhjóladrifi fyrir 100.000 kr. meira og má draga 1.050 kg meira.',
      'Countryman E höfðar til þeirra sem kaupa með hjartanu og vilja Mini-stílinn, en fyrir peninginn fæst meira annars staðar.',
    ],
    facts: '007a7b244e00',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er meðalstór jepplingur með fjórhjóladrifi og líflegri hönnun Mini, stærsti bíll merkisins og sá sem hentar fjölskyldum best, fyrir þá sem vilja skera sig úr.',
      'Hann er snöggur og skemmtilegur í akstri, og vandaður frágangur og hringlaga skjárinn gera innréttinguna eftirminnilegri en í flestum bílum á sama verði. Í tölunum hefur hann þó fáa styrkleika.',
      'Í sínum verðflokki er hann meðal þeirra sem drífa styst, hleður hægar og dregur minna en flestir, og skottið er minna en hjá flestum. BYD Sealion 7 kostar það sama en drífur 70 km lengra, hleður með um 30% styttri stoppum, er með 60 l stærra skott og má draga 300 kg meira.',
      'Countryman SE er fyrir þá sem kaupa með hjartanu og vilja Mini-stílinn með fjórhjóladrifi, en tölurnar vinna ekki með honum.',
    ],
    facts: '81432d844745',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya er meðalstór jepplingur með framhjóladrifi, þar sem mýkt, hljóðlátur gangur og vandað innanrými eru í fyrirrúmi frekar en snerpa.',
      'Drægnin er í meðallagi á þessu verði og dugar á milli landshluta, og innréttingin er notaleg og vel frágengin.',
      'Á móti kemur að hann hleður hægar og er hægari en flestir keppinautar hans, og hann er meðal þeirra sem draga minnst, aðeins 750 kg. Hyundai IONIQ 5 Long Range AWD kostar það sama, er fjórhjóladrifinn, drífur 21 km lengra, hleður með um 60% styttri stoppum og má draga 850 kg meira.',
      'Ariya er ljúfur ferðabíll, en fyrir sama verð fæst mun meira hjá keppinautunum.',
    ],
    facts: 'ebf917d159a6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er meðalstór jepplingur með fjórhjóladrifi, mýkt og góðri hljóðvist, ætlaður þeim sem vilja þægilegan og vandaðan fjölskyldubíl.',
      'Fjöðrunin tekur vel á ójöfnum og innanrýmið er notalegt, og hann má draga 1.500 kg.',
      'Gallarnir eru að hann drífur styttra en flestir á svipuðu verði, er meðal þeirra sem hlaða hægast og skottið er minna en hjá flestum keppinautum hans. BYD Sealion 7 er 100.000 kr. ódýrari, drífur álíka langt, hleður með um 40% styttri stoppum og er með 105 l stærra skott.',
      'Ariya e-4ORCE er fyrir þá sem setja þægindi ofar hleðsluhraða, en keppinautarnir gefa meira fyrir peninginn.',
    ],
    facts: '703df216d4ab',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf Standard Range er fimm sæta hlaðbakur, ný kynslóð þrautreynds rafbíls, ætlaður þeim sem vilja einfaldan og hagkvæman hversdagsbíl.',
      'Hann er mjög ódýr en drífur samt lengra en flestir á svipuðu verði, og má draga 975 kg, meira en flestir keppinautar hans.',
      'Hann er hins vegar hægari en flestir þeirra og hleðslan er í meðallagi. Volkswagen ID. Polo kostar það sama, drífur álíka langt, hleður með um 20% styttri stoppum, er sneggri og má draga 225 kg meira.',
      'Leaf er skynsamlegur kostur fyrir þá sem setja lágt verð og góða drægni ofar snerpu.',
    ],
    facts: '0876a4925283',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er fimm sæta hlaðbakur með stórri rafhlöðu, ný kynslóð þrautreynds rafbíls, ætlaður þeim sem vilja einfaldan bíl sem kemst langt.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, svo hann dugar léttilega á milli landshluta, jafnvel í vetrarkulda.',
      'Helsti ókosturinn er að hann dregur minna en flestir keppinautar hans og skottið er aðeins í meðallagi. Kia EV3 Long Range er 99.000 kr. ódýrari og drífur álíka langt, sem jepplingur með hærri setstöðu.',
      'Leaf Extended Range er eitt skynsamlegasta valið fyrir þá sem vilja mikla drægni á hagstæðu verði.',
    ],
    facts: 'd634205f4f90',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er kassalaga jepplingur sem býður allt að sjö sæti á verði sem er með því lægsta á listanum. Hann hentar stærri fjölskyldum sem vilja hagnýtan bíl í dagleg verkefni fyrir lítið.',
      'Fáir aðrir sjö sæta bílar komast nálægt verðinu, og skottið er stærra en hjá flestum á svipuðu verði. Kassalaga lagið gefur gott höfuðrými og útsýni.',
      'Gallarnir eru að í sínum verðflokki er hann meðal þeirra sem drífa styst, hlaða hægast, eru hægastir og draga minnst, svo hann hentar illa til ferða milli landshluta. Peugeot e-Rifter tekur líka sjö, drífur 38 km lengra og er með 315 l stærra skott, en kostar 2.100.000 kr. meira.',
      'Frontera er ódýrasta leiðin að sjö sætum, sniðin að nærumhverfinu frekar en langferðum.',
    ],
    facts: '6966a929a05b',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er meðalstór jepplingur með framhjóladrifi, 4,65 m á lengd, sem leggur áherslu á þægindi og notagildi frekar en snerpu.',
      'Skottið er stærra en hjá flestum á svipuðu verði, og drægnin og hleðslan eru í meðallagi, sem dugar fyrir ferðir milli landshluta.',
      'Á móti kemur að hann er meðal þeirra hægustu í sínum verðflokki og dregur minna en flestir keppinautar hans. Peugeot e-3008 Dual Motor, sem er byggður á sama grunni, kostar 100.000 kr. meira en er fjórhjóladrifinn, mun sneggri og með 38 l stærra skott.',
      'Grandland er jarðbundinn og rúmgóður fjölskyldubíll, en systurbíllinn frá Peugeot gefur meira fyrir litlu meira.',
    ],
    facts: '10b4052276f8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er meðalstór jepplingur með fjórhjóladrifi, 4,65 m á lengd, sem leggur áherslu á notagildi og þægindi.',
      'Hann er snöggur, skottið er í meðallagi á þessu verði og hann má draga 1.350 kg.',
      'Gallinn er að hann drífur styttra en flestir keppinautar hans og hleður aðeins í meðallagi. Kia EV6 2025 Long Range AWD kostar það sama en drífur 30 km lengra, hleður með um 45% styttri stoppum og má draga 450 kg meira. Framhjóladrifni Opel Grandland er 400.000 kr. ódýrari og drífur 29 km lengra.',
      'Grandland AWD er prýðilegur fyrir fjölskylduakstur í vetrarfærð, en keppinautarnir hlaða mun hraðar.',
    ],
    facts: '52c63660f039',
    model: 'gemini-3.8-flash, thinking high',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 er sérstæður smábíll með skemmtilegt retro-útlit sem sker sig vel úr í umferðinni. Hann er fyrst og fremst hannaður sem borgarbíll eða laglegur annar bíll heimilisins, lipur í þröngum bílastæðum og þægilegur í allt daglegt skutl innanbæjar.',
      'Helsti styrkur hans er lágt kaupverð og sérstætt útlit, og í hröðun og afli er hann í meðallagi á þessu verði.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast í sínum verðflokki, skottið er eitt það minnsta og hann má ekki draga kerru. Kia EV2 Standard Range er 500.000 kr. ódýrari, hleður með um 35% styttri stoppum, er með 134 l stærra skott og má draga 750 kg.',
      'Ora 3 er skemmtilegur kostur fyrir þá sem leita að ódýrum og sérviskulegum bíl í bæjarakstur og hlaða heima, en síður sniðinn fyrir miklar langferðir.',
    ],
    facts: 'a6c48a654251',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 er lítill jepplingur með sérstökum frönskum svip og hærri setstöðu, ætlaður þeim sem vilja lipran og þægilegan bíl í daglegt skutl.',
      'Hann er mjög ódýr og hleður hraðar en flestir á svipuðu verði, svo hleðslustoppin eru styttri en hjá helstu keppinautum hans.',
      'Hann drífur hins vegar styttra og er meðal þeirra hægustu í sínum verðflokki, og hann má ekki draga kerru. Kia EV3 Standard Range kostar 51.000 kr. meira, drífur 24 km lengra, er mun sneggri og má draga 500 kg.',
      'e-2008 er lipur bæjarbíll fyrir þá sem þurfa hvorki kerru né mikla drægni.',
    ],
    facts: 'ba54c05cafa1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er meðalstór jepplingur með framhjóladrifi og djörfu útliti, með sérstæðu ökumannsrými, litlu stýri og bogadregnum skjá, fyrir þá sem vilja stílhreinan og þægilegan fjölskyldubíl.',
      'Hann drífur lengra og er með stærra skott en flestir á svipuðu verði, svo hann dugar vel í ferðir milli landshluta með fulla fjölskyldu.',
      'Á móti kemur að hann hleður hægar og er aflminni en flestir keppinautar hans. Skoda Elroq 85x kostar 20.000 kr. meira, er fjórhjóladrifinn, drífur 45 km lengra og hleður með um 30% styttri stoppum, en skottið er 118 l minna.',
      'e-3008 er fýsilegur kostur fyrir þá sem meta hönnun, drægni og pláss ofar hraðri hleðslu.',
    ],
    facts: 'ce16f004dc74',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er meðalstór jepplingur með fjórhjóladrifi og djörfu útliti, með sérstæðu ökumannsrými, litlu stýri og bogadregnum skjá. Hann höfðar til þeirra sem vilja þægilegan og hljóðlátan fjölskyldubíl sem sker sig úr.',
      'Í sínum verðflokki drífur hann lengra og er aflmeiri en flestir, og skottið er stærra en hjá flestum.',
      'Gallinn er að hann hleður hægar en flestir keppinautar hans. XPENG G6 AWD Performance kostar það sama en hleður með um 45% styttri stoppum og er mun sneggri. Þurfi ekki fjórhjóladrif fæst framhjóladrifinn Peugeot e-3008 fyrir 520.000 kr. minna, með sömu drægni.',
      'e-3008 Dual Motor er álitlegur kostur fyrir þá sem meta drægni, rými og franska hönnun ofar hraðri hleðslu.',
    ],
    facts: '692bae7c8a08',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er stór sjö sæta jepplingur með framhjóladrifi, 4,8 m á lengd, sem býður jepplingalag frekar en sendibílalag fyrir stærri fjölskyldur á viðráðanlegu verði.',
      'Hann er einn ódýrasti rafbíllinn sem rúmar sjö, og skottið er eitt það stærsta á svipuðu verði. Drægnin er í meðallagi, sem dugar fyrir ferðir milli landshluta.',
      'Á móti kemur að hann er meðal þeirra hægustu í sínum verðflokki, hleður hægar og dregur minna en flestir keppinautar hans. Skoda Peaq 90x kostar 1.400.000 kr. meira en er fjórhjóladrifinn, drífur 111 km lengra, hleður með um 35% styttri stoppum og má draga 1.000 kg meira.',
      'e-5008 er skynsamlegur kostur fyrir barnmargar fjölskyldur sem vilja sjö sæti og mikið pláss fyrir hóflegt verð.',
    ],
    facts: 'a5a25913aff2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er stór sjö sæta jepplingur með fjórhjóladrifi, 4,8 m á lengd, fyrir stærri fjölskyldur sem vilja jepplingalag og grip í vetrarfærð.',
      'Skottið er eitt það stærsta á svipuðu verði og hann er mun sneggri en framhjóladrifna útfærslan.',
      'Gallarnir eru að hann drífur styttra, er meðal þeirra sem hlaða hægast og dregur minna en flestir keppinautar hans. Skoda Peaq 90x kostar 900.000 kr. meira en drífur 140 km lengra, hleður með um 40% styttri stoppum og má draga 1.000 kg meira. Framhjóladrifni Peugeot e-5008 er 520.000 kr. ódýrari og drífur 29 km lengra.',
      'e-5008 Dual Motor hentar fjölskyldum sem þurfa sjö sæti og fjórhjóladrif, en síður sem langferðabíll.',
    ],
    facts: '6b04476cfe4e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er hár og kassalaga fjölnotabíll, byggður á sendibíl, með rennihurðum og plássi fyrir allt að sjö manns. Hann leggur áherslu á rými og notagildi frekar en þægindi og hentar stórum fjölskyldum í daglegu amstri.',
      'Farangursrýmið er með því stærsta í sínum verðflokki og hann er fremur ódýr. Hann kostar 1.300.000 kr. minna en hinn nánast eins Toyota Proace City Verso, sem er byggður á sama grunni og drífur álíka langt.',
      'Á móti kemur að hann drífur mjög stutt, hleður mjög hægt og er mjög aflítill, svo hann hentar illa til langferða. Peugeot e-5008 er 980.000 kr. dýrari en drífur 159 km lengra, er með 141 l stærra skott og má draga 250 kg meira.',
      'Fyrir þá sem þurfa ódýran og rúmgóðan bíl fyrir marga í nærumhverfinu vinnur e-Rifter verkið vel.',
    ],
    facts: 'cfb65a98ef52',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller er stór fjölnotabíll byggður á sendibíl, með sætum fyrir allt að níu manns, sniðinn að stórum fjölskyldum, hópferðum og fólksflutningum í þéttbýli.',
      'Skottið er stærra en hjá flestum á svipuðu verði, hann tekur fleiri en flestir aðrir rafbílar og rennur hljóðlega um göturnar.',
      'Gallarnir eru að í sínum verðflokki er hann meðal þeirra sem drífa styst, hlaða hægast, eru hægastir og draga minnst. Hyundai STARIA Electric tekur líka níu, er 1.300.000 kr. ódýrari, drífur 49 km lengra, hleður með um 45% styttri stoppum og má draga 1.000 kg meira.',
      'e-Traveller leysir fólksflutninga í þéttbýli, en STARIA gefur meira fyrir minna.',
    ],
    facts: '579ac6ea3486',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 Long Range Dual Motor er lágur og sportlegur fólksbíll með afturhlera og fjórhjóladrifi, með skandinavískum gæðablæ, fyrir þá sem vilja snerpu og góða aksturseiginleika frekar en jeppling.',
      'Í sínum verðflokki er hann meðal þeirra langdrægustu og þeirra sem hlaða hraðast, og sneggri og aflmeiri en flestir. Hann má draga 1.500 kg og auk skottsins er lítið framskott.',
      'Á móti kemur að skottið er minna en hjá flestum keppinautum hans og aftursætin eru fremur þröng. Ford Capri kostar það sama, drífur álíka langt og hleður jafn hratt, en er með 165 l stærra skott.',
      'Polestar 2 er fyrir þá sem setja akstursánægju og drægni ofar plássi.',
    ],
    facts: 'ea9b46c810bb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er lágur og sportlegur fólksbíll með afturhlera og fjórhjóladrifi, með stinnri fjöðrun og áherslu á aksturseiginleika, fyrir þá sem vilja góða tilfinningu fyrir veginum.',
      'Hann drífur lengra, hleður hraðar og er sneggri en flestir á svipuðu verði, og hann má draga 1.500 kg.',
      'Gallarnir eru að skottið er minna en hjá flestum keppinautum hans og aftursætin eru fremur þröng. Polestar 2 Long Range Dual Motor er 900.000 kr. ódýrari, drífur 28 km lengra og munar aðeins sjónarmun í snerpu.',
      'Performance-útfærslan er fyrir þá sem vilja allra sportlegasta Polestar 2, en flestum dugar Dual Motor.',
    ],
    facts: '5d18326da1a8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er stór lúxusjepplingur með fjórhjóladrifi, 4,9 m á lengd, með áberandi skandinavískri hönnun, fyrir þá sem vilja kraftmikinn og stöðugan bíl með fágað yfirbragð.',
      'Í sínum verðflokki drífur hann lengra og er aflmeiri en flestir, og hann má draga 2.200 kg, meira en flestir keppinautar hans.',
      'Hann hleður hins vegar hægar en flestir þeirra og skottið er minna. Volvo ES90 Twin Motor, byggður á sama grunni, kostar það sama, drífur 51 km lengra og hleður með um 35% styttri stoppum, fyrir þá sem sætta sig við fólksbíl.',
      'Polestar 3 er fyrir þá sem vilja langdrægan og kraftmikinn jeppling með sterkan svip.',
    ],
    facts: '607b219a4925',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er stór lúxusjepplingur með fjórhjóladrifi, 4,9 m á lengd, sem sameinar norræna fágun og sportlega aksturseiginleika.',
      'Í sínum verðflokki er hann meðal þeirra aflmestu og sneggri en flestir, og hann má draga 2.200 kg, meira en flestir keppinautar hans.',
      'Gallarnir eru að hann drífur styttra og hleður hægar en flestir þeirra, og skottið er minna. Porsche Macan 4 Electric er 40.000 kr. ódýrari, drífur 51 km lengra, hleður með um 40% styttri stoppum og má draga 300 kg meira. Polestar 3 er 1.000.000 kr. ódýrari og drífur 68 km lengra.',
      'Polestar 3 Performance er fyrir þá sem vilja sportlegasta Polestar 3, en grunnútfærslan gefur meira fyrir peninginn.',
    ],
    facts: '60945870f6fe',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor er lágur og sportlegur fólksbíll með afturhlera og fjórhjóladrifi, með sérstæðri hönnun þar sem afturrúðunni er sleppt fyrir stafrænan bakspegil.',
      'Í sínum verðflokki er hann meðal sneggstu og aflmestu bílanna og drífur lengra en flestir, og hann má draga 2.000 kg, með því mesta á þessu verði.',
      'Hraðhleðslan og skottið eru hins vegar aðeins í meðallagi. Tesla Model Y Performance er 160.000 kr. ódýrari, álíka snöggur og með 328 l stærra skott, en má draga 400 kg minna.',
      'Polestar 4 er fyrir þá sem vilja mikla drægni, afl og sérkenni.',
    ],
    facts: '4b106d0d549a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 SUV Long Range Dual Motor er rennilegur jepplingur með fjórhjóladrifi og sérstæðri hönnun, án hefðbundinnar afturrúðu, fyrir þá sem vilja mikið afl og skandinavískan stíl.',
      'Í sínum verðflokki er hann meðal sneggstu og aflmestu bílanna og drífur lengra en flestir, og hann má draga 2.000 kg, með því mesta á þessu verði.',
      'Hraðhleðslan og skottið eru hins vegar aðeins í meðallagi. BMW iX3 40 kostar 200.000 kr. meira, drífur 37 km lengra og hleður með um 35% styttri stoppum, en er aðeins afturhjóladrifinn og mun hægari.',
      'Polestar 4 SUV er fyrir þá sem setja akstursánægju, kraft og áberandi hönnun í fyrsta sæti.',
    ],
    facts: '625d0a4115d4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er lúxussportjepplingur með fjórhjóladrifi og rótgrónum aksturseiginleikum Porsche, fyrir þá sem vilja vandaðan og þægilegan bíl án þess að fórna akstursánægjunni.',
      'Í sínum verðflokki drífur hann lengra, hleður hraðar og er með stærra skott en flestir, og 84 l framskott bætist við. Hann má draga 2.500 kg, með því mesta á þessu verði.',
      'Gallarnir eru að hann er fremur dýr og snerpan aðeins í meðallagi miðað við keppinautana. Porsche Macan 4s Electric fæst fyrir 1.500.000 kr. meira með mun meira afli og sömu drægni.',
      'Macan 4 er einn heildstæðasti lúxusjepplingurinn á sínu verði, jafnvígur á akstur, pláss og ferðalög.',
    ],
    facts: 'b4b49ee67080',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4S Electric er sportjepplingur með fjórhjóladrifi sem færir skarpa aksturseiginleika Porsche yfir í rafmagnið, fyrir þá sem vilja nákvæma stýringu og mikið afl í hagnýtum jepplingi.',
      'Í sínum verðflokki er hann meðal þeirra sneggstu, hleður hraðar og er með stærra skott en flestir, og 84 l framskott bætist við. Hann má draga 2.500 kg, meira en flestir keppinautar hans.',
      'Á móti kemur að hann er mjög dýr og drægnin aðeins í meðallagi miðað við verðið. Porsche Macan 4 Electric er 1.500.000 kr. ódýrari með sömu drægni, rými og dráttargetu, og gefur aðeins eftir í snerpu.',
      'Macan 4S er fyrir þá sem vilja sportlegasta Macan-inn, en Macan 4 gefur meira fyrir peninginn.',
    ],
    facts: '64e6a92aa4e6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er lágur lúxussportbíll með skottloki og afturhjóladrifi, ódýrasta útfærsla Taycan, fyrir þá sem vilja lifandi akstur Porsche og mikla drægni.',
      'Hann drífur lengra en allar aðrar útfærslur Taycan og flestir keppinautar hans, og er meðal þeirra sem hlaða hraðast, svo langferðir kalla á fá og stutt stopp. Auk skottsins er 84 l framskott.',
      'Gallarnir eru að skottið er eitt það minnsta í hans verðflokki, hann má ekki draga kerru og afturhjóladrifið kallar á aðgát í snjó og hálku. Porsche Taycan 4 Plus fæst með fjórhjóladrifi fyrir 1.500.000 kr. meira og drífur samt langt.',
      'Taycan Plus er sportlegur langferðabíll fyrir þá sem geta verið án fjórhjóladrifs.',
    ],
    facts: 'a72a8541bd98',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er lágur og rennilegur lúxusfólksbíll með fjórhjóladrifi, sem leggur áherslu á nákvæma stýringu og akstursánægju á malbiki. Hann hentar þeim sem vilja ekta Porsche í daglegum akstri og á langferðum.',
      'Í sínum verðflokki drífur hann lengra en flestir og er meðal þeirra sem hlaða hraðast, svo hleðslustopp utan bæjarins verða sérlega stutt. Auk skottsins er 84 l framskott undir vélarhlífinni.',
      'Hins vegar er skottið eitt það minnsta á þessu verði og hann má ekki draga kerru. Porsche Cayenne kostar það sama, drífur álíka langt og hleður jafn hratt, en er með 374 l stærra skott og má draga allt að 3.000 kg.',
      'Taycan 4 Plus er fyrir þá sem vilja sportbíl sem fer vel með langferðir, frekar en jepparými.',
    ],
    facts: 'dda528e0d78f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er lágur sportlegur fólksbíll með skottloki og fjórhjóladrifi, sneggstur bíla á sínu verði, fyrir þá sem vilja ósvikinn sportbíl í daglegri notkun.',
      'Hann hleður mjög hratt og er aflmeiri en flestir keppinautar hans, og auk skottsins er 84 l framskott undir vélarhlífinni.',
      'Gallarnir eru að hann drífur styttra en flestir þeirra, skottið er eitt það minnsta og hann má ekki draga kerru. Porsche Taycan 4 Plus er 2.000.000 kr. ódýrari, drífur 86 km lengra og gefur aðeins eftir í snerpu, og Porsche Cayenne S kostar 1.000.000 kr. meira, er álíka snöggur, drífur 96 km lengra og má draga 3.000 kg.',
      'Taycan 4S Plus er fyrir þá sem setja hraða og akstursupplifun í fyrsta sæti.',
    ],
    facts: '3f13c5d34759',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er lúxusskutbíll með fjórhjóladrifi og ögn hækkaðri loftfjöðrun, sem sameinar aksturseiginleika sportbíls og hagnýtara rými skutbíls.',
      'Hann hleður hraðar en flestir á svipuðu verði og drífur fremur langt, og auk skottsins er 84 l framskott.',
      'Á móti kemur að hann er mjög dýr, skottið er minna en hjá flestum keppinautum hans og hann má ekki draga kerru. Porsche Cayenne Coupé er 500.000 kr. ódýrari, drífur 30 km lengra, er með 88 l stærra skott og má draga 3.500 kg.',
      'Taycan 4 Cross Turismo er fyrir þá sem vilja sportbílaakstur með meira rými en í fólksbílnum, frekar en jeppa.',
    ],
    facts: '2c42b54ca231',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4S Cross Turismo er lúxusskutbíll með ögn hækkaðri fjöðrun og fjórhjóladrifi, sem sameinar aksturseiginleika sportbíls og rými skutbíls. Hann hentar þeim sem vilja mikla akstursánægju allt árið án þess að fara yfir í jeppa.',
      'Í sínum verðflokki er hann aflmeiri, sneggri og hleður hraðar en flestir, svo hleðslustoppin á langferðum eru stutt. Auk skottsins er 84 l framskott undir vélarhlífinni.',
      'Gallarnir eru að hann drífur styttra en flestir keppinautar hans, skottið er minna og hann má ekki draga kerru. Porsche Cayenne S kostar það sama en drífur 43 km lengra, er með 335 l stærra skott og má draga allt að 3.000 kg.',
      'Taycan 4S Cross Turismo er fyrir þá sem setja akstursupplifunina ofar plássi og dráttargetu.',
    ],
    facts: '088728deac3c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er stór lúxusjeppi með fjórhjóladrifi sem sameinar rými og notagildi fjölskyldujeppa og rómaða aksturseiginleika Porsche. Hann hentar þeim sem vilja ferðabíl í hæsta gæðaflokki sem ræður jafnt við langferðir og þungan drátt.',
      'Í sínum verðflokki drífur hann lengra en flestir og er meðal þeirra sem hlaða hraðast, svo hleðslustopp á langferðum verða fá og stutt. Skottið er líka stærra en hjá flestum, 90 l framskott bætist við og hann má draga 3.000 kg.',
      'Á móti kemur að hann er mjög dýr og hægari en flestir keppinautar hans, þótt hann sé langt frá því að vera seinn. Sú snerpa fæst í Porsche Cayenne S fyrir 3.000.000 kr. meira, með sama skottinu og álíka drægni.',
      'Grunngerð Cayenne er sú hagnýtasta í línunni og fyrir flesta sú skynsamlegasta: hún gefur lítið eftir nema í snerpu.',
    ],
    facts: 'f692ce51b5b3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er stór lúxusjeppi með rennilegri, aflíðandi þaklínu og sportlegum aksturseiginleikum Porsche. Hann hentar þeim sem vilja notagildi jeppa en sportlegra útlit en í hefðbundnum Cayenne.',
      'Hann má draga 3.500 kg, mest allra bíla á listanum, og drífur lengra og hleður hraðar en flestir á svipuðu verði, svo hleðslustoppin á langferðum eru fá og stutt. Skottið er stærra en hjá flestum keppinautum hans og 90 l framskott bætist við.',
      'Gallarnir eru að hann er mjög dýr og hægari en flestir þeirra. Porsche Cayenne er 500.000 kr. ódýrari, með 247 l stærra skott, en má draga 500 kg minna.',
      'Cayenne Coupé er fyrir þá sem vilja Cayenne með sportlegra lagi, og fá mestu dráttargetuna á listanum í kaupbæti.',
    ],
    facts: '89d7d6d210cb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er stór og kraftmikill lúxusjeppi með fjórhjóladrifi sem sameinar sportbílaeiginleika Porsche og notagildi stórs jeppa.',
      'Í sínum verðflokki drífur hann lengra en flestir og er meðal þeirra sem hlaða hraðast og aflmestu. Skottið er eitt það stærsta, 90 l framskott bætist við og hann má draga 3.000 kg.',
      'Helsti ókosturinn er verðið. Porsche Cayenne er 3.000.000 kr. ódýrari með sama rými, dráttargetu og drægni, og gefur aðeins eftir í snerpu.',
      'Cayenne S er fyrir þá sem vilja jeppa sem gefur ekkert eftir, en grunngerð Cayenne gefur meira fyrir peninginn.',
    ],
    facts: '4eac3f04344a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er stór og kraftmikill lúxusjeppi með fjórhjóladrifi og aflíðandi þaklínu, fyrir þá sem vilja sportlegasta lagið á Cayenne.',
      'Hann hleður hraðast bíla á svipuðu verði, er meðal þeirra langdrægustu og aflmestu, og skottið er stærra en hjá flestum keppinautum hans, með 90 l framskott að auki. Hann má draga 3.000 kg.',
      'Helsti ókosturinn er verðið. Porsche Cayenne S er 500.000 kr. ódýrari með 247 l stærra skott og nánast sömu drægni, fyrir þá sem geta verið án coupé-lagsins.',
      'Cayenne S Coupé er fyrir kröfuharða ökumenn sem vilja kraft, stutt hleðslustopp og sportlegt lag.',
    ],
    facts: '7d546273af52',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er stór og geysilega aflmikill lúxusjeppi, meðal sneggstu bíla á listanum, sem sameinar sportbílaakstur og notagildi stórs fimm sæta jeppa.',
      'Hann er ekki bara snöggur: skottið er það stærsta á svipuðu verði, 90 l framskott bætist við og hann má draga 3.000 kg, meira en flestir keppinautar hans. Hann hleður líka hraðar en flestir þeirra, svo hleðslustoppin á langferðum eru stutt.',
      'Á móti kemur verðið, enda er hann mjög dýr, og drægnin er aðeins í meðallagi í hans verðflokki. Ef langdrægni skiptir meira máli en afl drífur Mercedes-Benz EQS 580 4MATIC 246 km lengra og er 460.000 kr. ódýrari, en hann er fólksbíll og má draga 1.300 kg minna.',
      'Cayenne Turbo er fyrir þá sem vilja jeppa sem gerir allt vel, og eru tilbúnir að borga fyrir það.',
    ],
    facts: '809a7020da23',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er hreinræktaður afkastajeppi með fjórhjóladrifi og aflíðandi þaklínu, meðal sneggstu bíla á listanum, fyrir þá sem vilja ofursportbíl með notagildi jeppa.',
      'Hann hleður hraðast bíla á svipuðu verði og drífur lengra en flestir keppinautar hans, og hann má draga 3.000 kg. Auk skottsins er 90 l framskott undir vélarhlífinni.',
      'Gallarnir eru að hann er mjög dýr og skottið er eitt það minnsta í hans verðflokki. Porsche Cayenne Turbo er 500.000 kr. ódýrari, jafn snöggur og með 213 l stærra skott, fyrir þá sem geta verið án coupé-lagsins.',
      'Cayenne Turbo Coupé er sjaldséð blanda af ofursportbíl og vetrarhæfum lúxusjeppa.',
    ],
    facts: '709a5fdc0857',
    model: 'gemini-3.8-flash, thinking high',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric EV450 er stór lúxusjeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, sem leggur áherslu á hljóðláta mýkt, tignarlega nærveru og getu utan vega sem merkið er þekkt fyrir.',
      'Skottið er stærra en hjá flestum á svipuðu verði, hann má draga 2.500 kg og loftfjöðrunin gerir hann þægilegan á hvaða vegi sem er.',
      'Á móti kemur að hann drífur styttra og er meðal þeirra hægustu og aflminnstu í sínum verðflokki. Porsche Cayenne Turbo kostar 860.000 kr. meira, drífur 23 km lengra, hleður með um 30% styttri stoppum og má draga 500 kg meira.',
      'Range Rover EV450 er fyrir þá sem vilja jeppalúxus og ró frekar en að eltast við tölurnar.',
    ],
    facts: '216b5c4c82e0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er stór og virðulegur lúxusjeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, aflmeiri útfærsla rafdrifna Range Rover, með fyrsta flokks innréttingu og getu utan vega.',
      'Skottið er stærra en hjá flestum á svipuðu verði, hann má draga 2.500 kg og loftfjöðrunin gerir hann þægilegan í hvaða færð sem er.',
      'Gallarnir eru að hann er mjög dýr og drífur styttra en flestir keppinautar hans. Range Rover Electric EV450 er 2.700.000 kr. ódýrari með sömu drægni, rými og dráttargetu, og gefur aðeins eftir í snerpu.',
      'Range Rover EV550 er fyrir þá sem vilja þann aflmesta, en EV450 gefur sama lúxus fyrir minna.',
    ],
    facts: '7d553bed6445',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er lítill fimm sæta hlaðbakur, aðeins 3,9 m á lengd, með skemmtilegri retro-hönnun sem sækir innblástur í sögu merkisins, sniðinn að innanbæjarakstri.',
      'Hann er mjög ódýr, lipur í þéttbýli og þröngum stæðum, og útlitið gerir hann eftirtektarverðan.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast á svipuðu verði, skottið er eitt það minnsta og hann má aðeins draga 500 kg. Renault R5 E-Tech 52 kWh kostar 500.000 kr. meira og drífur 109 km lengra, og Kia EV2 Standard Range er 500.000 kr. ódýrari og drífur 17 km lengra.',
      'R5 er sjarmerandi bæjarbíll, en flestum borgar sig stærri rafhlaðan.',
    ],
    facts: 'd6b5c1746164',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er lítill fimm sæta hlaðbakur, aðeins 3,9 m á lengd, með retro-hönnun í anda klassíska forverans, lipur í þröngum götum og auðveldur í stæðum.',
      'Hann er mjög ódýr og drífur 109 km lengra en grunnútfærslan, sem dugar í dagleg erindi og styttri ferðir milli landshluta, og útlitið gerir hann eftirtektarverðan.',
      'Gallarnir eru að hann drífur styttra, hleður hægar og er aflminni en flestir á svipuðu verði, skottið er eitt það minnsta og hann má aðeins draga 500 kg. Leapmotor C10 Pro kostar það sama en er mun stærri bíll, drífur álíka langt, er með 109 l stærra skott og má draga 1.000 kg meira.',
      'R5 er skemmtilegur bæjarbíll með mikinn karakter, en síður heppilegur sem aðalbíll fjölskyldu.',
    ],
    facts: 'd6f71b54b2fb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er meðalstór jepplingur með framhjóladrifi og vel nýttu innanrými, með innbyggðu Google-kerfi og góðri hljóðvist, fyrir fjölskyldur sem vilja þægilegan hversdagsbíl.',
      'Hann er fremur ódýr og skottið er stærra en hjá flestum á svipuðu verði.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er aflminni en flestir keppinautar hans. Renault Scenic E-Tech EV87 kostar 900.000 kr. meira og drífur 193 km lengra, og XPENG G6 RWD Standard Range kostar 100.000 kr. meira, hleður með um 35% styttri stoppum og má draga 400 kg meira.',
      'Scenic EV60 er þægilegur fjölskyldubíll, en flestum borgar sig stærri rafhlaðan.',
    ],
    facts: 'f4f8925cd6d8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech EV87 er meðalstór jepplingur með framhjóladrifi og stórri rafhlöðu, með vel nýttu innanrými og þægilegum akstri, fyrir fjölskyldur sem ferðast mikið um landið.',
      'Hann er meðal þeirra langdrægustu í sínum verðflokki og skottið er stærra en hjá flestum keppinautum hans, svo hann dugar vel í ferðir milli landshluta með fulla fjölskyldu, jafnvel í vetrarkulda.',
      'Hann er hins vegar hægari og aflminni en flestir þeirra og má draga minna. Tesla Model 3 Long Range Fjórhjóladrif er 100.000 kr. ódýrari, drífur 37 km lengra og hleður með um 35% styttri stoppum, en er lægri fólksbíll.',
      'Scenic EV87 er hagkvæmur ferðafélagi fyrir þá sem setja pláss og drægni fyrir peninginn í fyrsta sæti.',
    ],
    facts: 'c6e8a1afda6a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er lítill jepplingur með framhjóladrifi og hærri setstöðu, með vel nýttu innanrými eins og Skoda er þekkt fyrir, ætlaður sem hagkvæmur fyrsti rafbíll eða fyrir minni fjölskyldur.',
      'Hann er mjög ódýr, skottið er eitt það stærsta á svipuðu verði og lítið framskott bætist við. Hann er líka sneggri og hleður hraðar en flestir keppinautar hans, og má draga 1.200 kg, meira en flestir þeirra.',
      'Veikleikarnir eru fáir, helst að drægnin er aðeins í meðallagi. Volkswagen ID. Polo, systurbíll á sama grunni, kostar það sama og drífur 13 km lengra, en skottið er 34 l minna.',
      'Epiq 55 er einn heildstæðasti ódýri rafbíllinn, fyrir þá sem vilja pláss og snerpu fyrir lítið.',
    ],
    facts: 'a0c4aa967a45',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er meðalstór jepplingur með afturhjóladrifi, með hagnýtu innanrými og hárri setstöðu Skoda, fyrir þá sem vilja traustan bíl fyrir daglegt líf og ferðalög.',
      'Hann er meðal þeirra langdrægustu í sínum verðflokki, hleður hraðar og er sneggri en flestir keppinautar hans, svo hann dugar léttilega milli landshluta.',
      'Gallarnir eru að hann má aðeins draga 1.000 kg, minna en flestir þeirra, og er aðeins afturhjóladrifinn. Skoda Elroq 85x fæst með fjórhjóladrifi og 1.800 kg dráttargetu fyrir 400.000 kr. meira, með nánast sömu drægni.',
      'Elroq 85 er skynsamlegt val fyrir þá sem vilja langdrægan jeppling á góðu verði og þurfa ekki að draga mikið.',
    ],
    facts: '854fd4da41e0',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er meðalstór jepplingur með fjórhjóladrifi, hagnýtu innanrými og hárri setstöðu, fyrir fjölskyldur sem vilja traustan bíl í vetrarfærð og á ferðalögum.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, og má draga 1.800 kg, meira en flestir þeirra.',
      'Veikleikarnir eru fáir: afl og snerpa eru aðeins í meðallagi, og skottið líka. XPENG G6 RWD Long Range kostar 100.000 kr. meira, hleður með um 25% styttri stoppum og er með 101 l stærra skott, en er aðeins afturhjóladrifinn.',
      'Elroq 85x er einn heildstæðasti fjórhjóladrifni bíllinn á sínu verði.',
    ],
    facts: 'b96e9d7e8c9a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er sportlegasta útfærsla Elroq, meðalstór jepplingur með fjórhjóladrifi og sneggri svip, sem sameinar hagnýtt innanrými Skoda og meira afl.',
      'Hann drífur lengra en flestir á svipuðu verði og má draga 1.800 kg, meira en flestir þeirra. Auk skottsins er lítið framskott.',
      'Skottið er hins vegar minna en hjá flestum keppinautum hans, og hleðsla og snerpa eru aðeins í meðallagi. Skoda Elroq 85x er 1.300.000 kr. ódýrari, drífur 20 km lengra og má draga jafn mikið, og gefur aðeins eftir í snerpu.',
      'Elroq RS er fyrir þá sem vilja sportlegasta Elroq-inn, en 85x gefur meira fyrir peninginn.',
    ],
    facts: '7b62f0e932ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er rúmgóður jepplingur með fjórhjóladrifi, 4,66 m á lengd, sem leggur áherslu á pláss og yfirvegaðan akstur, fyrir fjölskyldur sem vilja traustan ferðabíl allt árið.',
      'Hann drífur lengra en flestir á svipuðu verði, skottið er stærra en hjá flestum þeirra og hann nýtir orkuna vel.',
      'Gallarnir eru að hann er hægari en flestir keppinautar hans og má aðeins draga 1.200 kg. Smart #5 Pulse kostar það sama, drífur álíka langt, hleður með um 40% styttri stoppum, er með 45 l stærra skott og má draga 400 kg meira.',
      'Enyaq 85X er traust og skynsamlegt val fyrir þá sem setja pláss og hagnýti í fyrsta sæti.',
    ],
    facts: '736aa237e05e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er sportlegasta útfærsla Enyaq, rúmgóður jepplingur með fjórhjóladrifi og stífari akstri, sem sameinar hagnýtt innanrými og kraftmeira yfirbragð.',
      'Skottið er stærra en hjá flestum á svipuðu verði og hann má draga 2.200 kg, 1.000 kg meira en Enyaq 85X og með því mesta í hans verðflokki.',
      'Á móti kemur að hann er fremur dýr og drægni og hleðsla eru aðeins í meðallagi. Smart #5 Brabus er 200.000 kr. ódýrari, drífur álíka langt, hleður með um 40% styttri stoppum og er mun sneggri, en má draga 600 kg minna.',
      'Enyaq RS er fyrir þá sem vilja rúmgóðan jeppling sem dregur hjólhýsi, með sportlegum blæ.',
    ],
    facts: '134c04397a83',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er stór sjö sæta jeppi með fjórhjóladrifi, 4,87 m á lengd, sem leggur áherslu á hagnýtt pláss og ferðagetu fyrir stórar fjölskyldur.',
      'Hann er meðal þeirra langdrægustu í sínum verðflokki og hleður hraðar en flestir keppinautar hans. Skottið er eitt það stærsta og hann má draga 2.000 kg, meira en flestir þeirra.',
      'Gallarnir eru að hann er fremur dýr og hægari en flestir þeirra. Peugeot e-5008 Dual Motor er 900.000 kr. ódýrari og tekur líka sjö, en drífur 140 km styttra, hleður hægar og má draga 1.000 kg minna.',
      'Peaq 90x er einn sterkasti sjö sæta kosturinn fyrir stórar fjölskyldur sem ferðast um landið.',
    ],
    facts: '26b32d8a9473',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er lítill og hár jepplingur með afturhjóladrifi, hannaður í samstarfi Mercedes-Benz og Geely, með sérstæðu útliti og miklu afli miðað við stærð.',
      'Hann er sneggri, aflmeiri og hleður hraðar en flestir á svipuðu verði, og þrátt fyrir smæðina má hann draga 1.600 kg, meira en flestir þeirra.',
      'Skottið er hins vegar minna en hjá flestum keppinautum hans og drægnin aðeins í meðallagi. Kia EV3 Standard Range er 200.000 kr. ódýrari, drífur álíka langt og er með 137 l stærra skott, en má draga 1.100 kg minna.',
      'Smart #1 Pro+ er sprækur og vel búinn smájepplingur sem getur dregið kerru, á hagstæðu verði.',
    ],
    facts: '30c342608c6d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er lítill jepplingur með fjórhjóladrifi og miklu afli, hannaður í samstarfi Mercedes-Benz og Geely, fyrir þá sem vilja snöggan og nettan bíl með gott grip.',
      'Hann er meðal sneggstu og aflmestu bíla í sínum verðflokki og má draga 1.600 kg, meira en flestir keppinautar hans.',
      'Gallarnir eru að hann er meðal þeirra sem drífa styst, hleður hægar en flestir þeirra og skottið er eitt það minnsta. Afturhjóladrifni Smart #1 Pro+ er 900.000 kr. ódýrari og drífur 40 km lengra, fyrir þá sem þurfa ekki fjórhjóladrifið.',
      'Smart #1 Pulse er fyrir þá sem setja kraft og fjórhjóladrif ofar drægni og plássi.',
    ],
    facts: 'b81624188033',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er öflugasta útfærsla #1, lítill jepplingur með fjórhjóladrifi og óhemju afli, fyrir þá sem vilja mikla snerpu í nettum bíl.',
      'Hann er meðal sneggstu bíla á svipuðu verði og má draga 1.600 kg, meira en flestir þeirra.',
      'Hann er hins vegar meðal þeirra sem drífa styst, hleður hægar en flestir keppinautar hans og skottið er eitt það minnsta. Volvo EX30 Twin Motor Performance er 100.000 kr. ódýrari, álíka snöggur, drífur 50 km lengra og hleður hraðar, og Smart #1 Pulse er 700.000 kr. ódýrari og nánast jafn snöggur.',
      'Smart #1 Brabus er leikfang fyrir þá sem vilja hámarks akstursgleði, en flestum dugar #1 Pulse.',
    ],
    facts: '37b67d47d275',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er rennilegur jepplingur með fjórhjóladrifi og miklu afli, hannaður í samstarfi Mercedes-Benz og Geely, með sportlegra og lægra lagi en #1.',
      'Hann er meðal sneggstu og aflmestu bíla í sínum verðflokki, og fjórhjóladrifið kemur aflinu örugglega niður.',
      'Á móti kemur að hann drífur styttra og hleður hægar en flestir keppinautar hans. Toyota C-HR+ kostar 100.000 kr. meira og drífur 41 km lengra, þótt hann sé aðeins framhjóladrifinn og mun hægari.',
      'Smart #3 Pulse er fyrir þá sem setja akstursánægju og fjórhjóladrif ofar drægni.',
    ],
    facts: '83bd9755cea2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er öflugasta útfærsla #3, rennilegur jepplingur með fjórhjóladrifi og gríðarlegu afli, meðal sneggstu bíla á sínu verði.',
      'Hann er aflmeiri en flestir keppinautar hans og má draga 1.600 kg.',
      'Gallarnir eru að hann drífur styttra, hleður hægar og er með minna skott en flestir þeirra. Volvo EX30 Twin Motor Performance er 300.000 kr. ódýrari, álíka snöggur, drífur 35 km lengra og hleður með um 10% styttri stoppum. Smart #3 Pulse er 500.000 kr. ódýrari og aðeins sjónarmun hægari.',
      'Smart #3 Brabus er fyrir þá sem vilja mikinn kraft og sportlegan svip, en #3 Pulse gefur meira fyrir peninginn.',
    ],
    facts: 'b1fb76b375a2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er stór og kassalaga jepplingur, ný stefna hjá merki sem var þekkt fyrir smábíla. Hann hentar fjölskyldum sem vilja mikið pláss og áberandi útlit.',
      'Skottið er með þeim stærstu í sínum verðflokki, 72 l framskott bætist við og hann má draga 1.600 kg, meira en flestir keppinautar hans. Hann er líka sneggri og aflmeiri en flestir þeirra, með stærri rafhlöðu en gengur og gerist.',
      'Á móti kemur að hann hleður fremur hægt á langferðum og er afturhjóladrifinn, sem krefst meiri varkárni í snjó og hálku. XPENG G6 RWD Standard Range er 100.000 kr. ódýrari með um 25% styttri hleðslustopp, en drífur 30 km styttra og skottið er 59 l minna.',
      'Fyrir þá sem leita að rúmgóðum og sprækum fjölskyldubíl sem getur dregið hjólhýsi er #5 Pro fýsilegur kostur, svo lengi sem hraðhleðslan er ekki í forgangi.',
    ],
    facts: 'cf21101e07be',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er stór og kassalaga jepplingur með fjórhjóladrifi, 4,7 m á lengd, ný stefna hjá merki sem var þekkt fyrir smábíla, með miklu rými og afli.',
      'Hann er meðal þeirra sem hlaða hraðast og þeirra aflmestu á svipuðu verði, drífur lengra en flestir keppinautar hans og skottið er stærra en hjá flestum, með 47 l framskott að auki. Hann má draga 1.600 kg.',
      'Veikleikarnir eru fáir, helst að merkið á sér styttri sögu í stærri jepplingum en rótgrónari framleiðendur. Skoda Enyaq 85X kostar það sama frá þekktara merki, en hleður með um 60% lengri stoppum og er með minna skott.',
      'Smart #5 Pulse gefur mikið fyrir peninginn, fyrir þá sem vilja pláss, afl og hraða hleðslu.',
    ],
    facts: '83e04f571366',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er öflugasta útfærsla #5, stór og kassalaga jepplingur með fjórhjóladrifi, aflmestur bíla á sínu verði.',
      'Hann er meðal þeirra sneggstu og hleður hraðar en flestir keppinautar hans, og skottið er stærra en hjá flestum þeirra, með 47 l framskott að auki.',
      'Á móti kemur að hann er fremur dýr og drægnin aðeins í meðallagi. Smart #5 Pulse er 1.300.000 kr. ódýrari með sömu drægni, rými og hleðslu, og gefur aðeins eftir í snerpu.',
      'Smart #5 Brabus er fyrir þá sem vilja allra mest afl, en #5 Pulse gefur meira fyrir peninginn.',
    ],
    facts: '5c7dc93cc2ea',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er stór jepplingur með fjórhjóladrifi, 4,84 m á lengd, byggður á hefð Subaru fyrir vetrarhæfni og hagnýtri hönnun, fyrir þá sem ferðast í hvaða veðri sem er.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði, og skottið er stærra en hjá flestum þeirra.',
      'Drægni og hraðhleðsla eru hins vegar aðeins í meðallagi. Hongqi EHS7 Premium er 100.000 kr. ódýrari, drífur 17 km lengra, hleður með um 35% styttri stoppum og er mun aflmeiri, þótt merkið sé nýtt hér á landi.',
      'e-Outback er traustur kostur fyrir þá sem setja grip, pláss og Subaru-merkið í forgang.',
    ],
    facts: 'edde5f48d3ad',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er meðalstór jepplingur með fjórhjóladrifi, systurbíll Toyota bZ4X, sem höfðar til þeirra sem treysta á gott grip og veghæð í vetrarfærð og á malarvegum, eins og Subaru er þekkt fyrir.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði og má draga 1.500 kg, en drægnin og hraðhleðslan eru aðeins í meðallagi.',
      'Helsti ókosturinn er skottið, sem er minna en hjá flestum keppinautum hans. Kia EV6 2025 Long Range AWD kostar nánast það sama en hleður með um 40% styttri stoppum, er með 69 l stærra skott og má draga 300 kg meira.',
      'Solterra er traustur kostur fyrir þá sem setja fjórhjóladrif og veghæð í forgang, en keppinautarnir hlaða hraðar og rúma meira.',
    ],
    facts: '4ecb88ec078d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er meðalstór jepplingur með fjórhjóladrifi, systurbíll Toyota C-HR+ AWD, sem byggir á arfleifð Subaru í vetrarakstri.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði og má draga 1.500 kg, meira en flestir þeirra.',
      'Gallarnir eru að skottið er minna en hjá flestum keppinautum hans og drægnin aðeins í meðallagi. MG MGS6 Dual Motor er 100.000 kr. ódýrari, líka fjórhjóladrifinn og drífur álíka langt, með 90 l stærra skott, þótt hleðslustoppin séu um 30% lengri.',
      'Uncharted er heilsteyptur og snöggur fjórhjóladrifsbíll á góðu verði.',
    ],
    facts: '83685783dc51',
    model: 'gemini-3.8-flash, thinking high',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er lítill jepplingur með fjórhjóladrifi, frá merki sem er þekkt fyrir trausta og einfalda vetrarbíla, fyrir þá sem vilja fjórhjóladrif á viðráðanlegu verði.',
      'Suzuki ábyrgist rafhlöðuna í allt að 10 ár, lengur en flestir aðrir framleiðendur, og hann er lipur í þéttbýli.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast á svipuðu verði, skottið er eitt það minnsta og hann má aðeins draga 750 kg. Smart #1 Pulse kostar 150.000 kr. meira, líka fjórhjóladrifinn, en hleður með um 40% styttri stoppum, er með 75 l stærra skott og má draga 850 kg meira.',
      'e Vitara er hagkvæmur fjórhjóladrifsbíll með langa ábyrgð, fyrir þá sem aka mest í nærumhverfinu.',
    ],
    facts: 'd7c7e33a9fd8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Afturhjóladrif er lágur og rennilegur fólksbíll með skottloki, sparneytinn og lipur, fyrir þá sem vilja mikið fyrir peninginn í fólksbíl frekar en jeppling.',
      'Hann er meðal þeirra langdrægustu, sneggstu og þeirra sem hlaða hraðast á svipuðu verði, og hefur aðgang að hraðhleðslustöðvum Tesla við hringveginn. Skottið er eitt það stærsta á þessu verði, 88 l framskott bætist við og hann má draga 1.000 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að hann er lágur, með litla veghæð og aðeins afturhjóladrifinn, sem hentar síður í djúpum snjó og á malarvegum. Tesla Model 3 Long Range Afturhjóladrif kostar 900.000 kr. meira og drífur 216 km lengra.',
      'Model 3 er einn álitlegasti kosturinn á sínu verði fyrir þá sem aka mest á bundnu slitlagi.',
    ],
    facts: 'a9b5c98f3078',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range Afturhjóladrif er lágur og rennilegur fólksbíll með skottloki, sá langdrægasti á sínu verði, fyrir þá sem aka reglulega milli landshluta.',
      'Hann drífur lengst bíla á svipuðu verði, hleður hratt og hefur aðgang að hraðhleðslustöðvum Tesla við hringveginn. Skottið er eitt það stærsta í hans verðflokki og 88 l framskott bætist við.',
      'Á móti kemur að hann er lágur, með litla veghæð og aðeins afturhjóladrifinn, sem hentar síður í snjó og á malarvegum. Tesla Model 3 Long Range Fjórhjóladrif fæst fyrir 600.000 kr. meira, en drífur 90 km styttra.',
      'Fyrir þá sem horfa fyrst og fremst í drægni á langferðum er þetta einn álitlegasti kosturinn.',
    ],
    facts: '2fb3560a683e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-long-range-fjorhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range er lágur og rennilegur fólksbíll með fjórhjóladrifi, einn sá langdrægasti og sneggsti í sínum verðflokki. Hann hentar þeim sem aka mikið milli landshluta og vilja bíl sem er bæði sparneytinn og snarpur.',
      'Hann drífur mjög langt og hleður hratt, og á langferðum hefur hann aðgang að hraðhleðslustöðvum Tesla við hringveginn. Þó hann sé fólksbíll með skottloki frekar en hlaðbakur er farangursrýmið stærra en hjá flestum á svipuðu verði, og 88 l framskott bætist við.',
      'Á móti kemur að hann er lágur og með litla veghæð, sem hentar síður á malarvegum og í djúpum snjó, og hann má aðeins draga 1.000 kg, minna en flestir á svipuðu verði. Þeir sem vilja hærri setustöðu og meiri dráttargetu gætu frekar litið á XPENG G6 RWD Long Range, sem má draga 500 kg meira, en hann drífur 90 km styttra og er aðeins afturhjóladrifinn.',
      'Fyrir langferðir á góðum vegum er Model 3 einn sterkasti kosturinn í sínum verðflokki.',
    ],
    facts: '2e5f5056f3d9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-performance': {
    paragraphs: [
      'Tesla Model 3 Performance er lágur fólksbíll með skottloki og fjórhjóladrifi, sneggstur bíla á sínu verði, fyrir þá sem vilja sportbíl í fólksbílsgerð.',
      'Hann er meðal aflmestu bíla á svipuðu verði, drífur lengra og hleður hraðar en flestir þeirra, og skottið er stærra en hjá flestum, með 88 l framskott að auki.',
      'Á móti kemur að hann má ekki draga kerru, fjöðrunin er stíf og lág bygging hentar síður á malarvegum. Tesla Model 3 Long Range Fjórhjóladrif er 880.000 kr. ódýrari, drífur 89 km lengra og má draga 1.000 kg, og gefur aðeins eftir í snerpu.',
      'Model 3 Performance er fyrir þá sem vilja mikinn kraft, en Long Range Fjórhjóladrif er skynsamlegri fyrir flesta.',
    ],
    facts: 'e4eeae096e55',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er ódýrasta útfærsla Model Y, rúmgóður jepplingur með afturhjóladrifi, með stóru skotti og framskotti, snjöllum hugbúnaði og aðgangi að hleðsluneti Tesla.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, og hleðslustöðvar Tesla við hringveginn gera ferðalög um landið einföld.',
      'Á móti kemur að hann er aðeins afturhjóladrifinn og einfaldari búinn en dýrari útfærslurnar. Tesla Model Y Premium Long Range kostar 1.500.000 kr. meira og drífur 104 km lengra, og Tesla Model Y Long Range Dual Motor fæst með fjórhjóladrifi fyrir 1.900.000 kr. meira.',
      'Model Y Standard Range er sterkt val fyrir þá sem vilja mikið pláss og hleðslunet Tesla á hagstæðu verði.',
    ],
    facts: '47b1a9ade507',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range er stór og rúmgóður jepplingur með afturhjóladrifi, 4,8 m á lengd, með snjöllum hugbúnaði og aðgangi að hleðsluneti Tesla.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og hleður hraðar en flestir þeirra, skottið er eitt það stærsta í hans verðflokki og 117 l framskott bætist við. Hann má draga 1.600 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að hann er aðeins afturhjóladrifinn og hefur stífa fjöðrun. Tesla Model Y Long Range Dual Motor fæst með fjórhjóladrifi fyrir 400.000 kr. meira, með nánast sömu drægni og rými.',
      'Model Y Premium Long Range gefur vart meiri drægni og pláss fyrir peninginn, ef fjórhjóladrif er ekki skilyrði.',
    ],
    facts: '20b24ee73012',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er stór og rúmgóður jepplingur með fjórhjóladrifi, 4,8 m á lengd, sem sameinar mikið pláss, mikla drægni og aðgang að hleðsluneti Tesla.',
      'Hann er meðal þeirra langdrægustu og aflmestu á svipuðu verði og hleður hraðar en flestir þeirra, skottið er eitt það stærsta í hans verðflokki og 116 l framskott bætist við. Hann má draga 1.600 kg.',
      'Veikleikarnir eru fáir: flestu er stýrt í gegnum einn snertiskjá og fjöðrunin er fremur stíf. Ford Mustang Mach-E LR AWD kostar nánast það sama og er mýkri í akstri, en drífur 50 km styttra og hleður hægar.',
      'Model Y Long Range Dual Motor er einn heilsteyptasti fjölskyldubíllinn á sínu verði.',
    ],
    facts: 'a556e4e8d671',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er stór og rúmgóður jepplingur með fjórhjóladrifi og afli sem hæfir sportbíl, 4,8 m á lengd, fyrir þá sem vilja fjölskyldubíl og akstursánægju í einum.',
      'Hann er meðal sneggstu og aflmestu bíla á svipuðu verði, drífur lengra og hleður hraðar en flestir þeirra, og skottið er eitt það stærsta, með 117 l framskott að auki. Hann má draga 1.600 kg.',
      'Á móti kemur að stíf fjöðrun og stórar felgur gera hann óþýðari á malarvegum og holóttu malbiki. Tesla Model Y Long Range Dual Motor er 1.000.000 kr. ódýrari, drífur 20 km lengra og gefur aðeins eftir í snerpu.',
      'Model Y Performance er aflmikill fjölskyldubíll sem fórnar engu af notagildinu, en Long Range Dual Motor dugar flestum.',
    ],
    facts: '36f58db16db2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X er meðalstór jepplingur með framhjóladrifi, ætlaður þeim sem vilja þægilegan fjölskyldubíl frá merki sem er þekkt fyrir áreiðanleika.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, svo hann dugar vel í ferðir milli landshluta.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann er meðal þeirra sem draga minnst, aðeins 750 kg. Toyota bZ4X AWD fæst með fjórhjóladrifi og 1.500 kg dráttargetu fyrir 400.000 kr. meira.',
      'bZ4X er skynsamlegur kostur fyrir þá sem vilja mikla drægni og þurfa hvorki fjórhjóladrif né kerru.',
    ],
    facts: '0aad5d8e50a4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-awd': {
    paragraphs: [
      'Toyota bZ4X AWD er meðalstór jepplingur með fjórhjóladrifi frá merki sem er þekkt fyrir áreiðanleika, ætlaður fjölskyldum sem vilja traustan bíl í hvaða færð sem er frekar en sérstakt pláss eða lúxus.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði og má draga 1.500 kg. Drægnin og hraðhleðslan eru í meðallagi í sínum verðflokki, sem dugar fyrir flestar ferðir milli landshluta.',
      'Á móti kemur að skottið er minna en hjá flestum á svipuðu verði og hann er dýrari á hvern kílómetra drægni en flestir þeirra. Subaru e-Outback, sem er byggður á sama grunni, er 100.000 kr. ódýrari, sneggri og með 181 l stærra skott, og systurbíllinn Toyota C-HR+ AWD kostar það sama en hefur tveimur árum lengri ábyrgð á rafhlöðunni.',
      'bZ4X AWD er traustur kostur fyrir þá sem vilja Toyota með fjórhjóladrifi, en keppinautarnir á sama verði bjóða ýmist meira pláss eða lengri ábyrgð.',
    ],
    facts: '5d04bdbb296a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-touring-base': {
    paragraphs: [
      'Toyota bZ4X Touring er stór jepplingur með framhjóladrifi, 4,83 m á lengd, skutbílslegri og rúmbetri útgáfa bZ4X, ætlaður fjölskyldum sem vilja mikið pláss frá áreiðanlegu merki.',
      'Skottið er eitt það stærsta á svipuðu verði, og hann drífur lengra og hleður hraðar en flestir þeirra.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði og meðal þeirra sem draga minnst, aðeins 750 kg. Toyota bZ4X Touring AWD fæst með fjórhjóladrifi og 1.500 kg dráttargetu fyrir 500.000 kr. meira.',
      'bZ4X Touring er traustur fjölskyldubíll fyrir þá sem þurfa pláss fyrir farangur frekar en kerru.',
    ],
    facts: '4430e8e0ec93',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er stór jepplingur með fjórhjóladrifi, 4,83 m á lengd, sem sameinar mikið pláss og óvænt mikinn kraft frá áreiðanlegu merki.',
      'Skottið er eitt það stærsta á svipuðu verði, og hann er sneggri og aflmeiri en flestir þeirra. Hann má draga 1.500 kg.',
      'Á móti kemur að hann drífur styttra og hleður hægar en flestir á svipuðu verði. Smart #5 Brabus er 100.000 kr. ódýrari, drífur 35 km lengra og hleður með um 40% styttri stoppum, með álíka stórt skott.',
      'bZ4X Touring AWD er snöggur og rúmgóður fjölskyldubíll, ef tíðari hleðslustopp á hringveginum henta.',
    ],
    facts: '18930aad052a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-c-hr-base': {
    paragraphs: [
      'Toyota C-HR+ er meðalstór jepplingur með sérstæðu og hvössu útliti, ætlaður þeim sem vilja þægilegan bíl frá merki sem er þekkt fyrir áreiðanleika. Hann leggur áherslu á rólegan og hagkvæman akstur frekar en afl.',
      'Það sem sker hann helst úr er ábyrgðin: Toyota ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir á svipuðu verði. Það skiptir máli fyrir þá sem ætla að eiga bílinn lengi. Hann er fremur ódýr og hraðhleðslan er í meðallagi í sínum verðflokki.',
      'Á móti kemur að hann má ekki draga kerru, er með einni af minnstu rafhlöðunum og meðal þeirra aflminnstu á svipuðu verði, og hann er aðeins framhjóladrifinn. Fyrir 100.000 kr. meira býður MG MGS6 Dual Motor fjórhjóladrif, 77 l stærra skott og má draga 1.500 kg, en ábyrgðin á rafhlöðunni er þremur árum styttri.',
      'C-HR+ hentar þeim sem meta langa ábyrgð og traust merki ofar afli og plássi, og þurfa aldrei að draga neitt.',
    ],
    facts: '78eee388eeb9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-c-hr-77-kwh': {
    paragraphs: [
      'Toyota C-HR+ 77 kWh er meðalstór jepplingur með framhjóladrifi, sérstæðu og hvössu útliti og stærri rafhlöðu, fyrir þá sem vilja áreiðanleika Toyota í djarfari búningi.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og hleður hraðar en flestir þeirra, og Toyota ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir á þessu verði.',
      'Á móti kemur að hann er hægari og aflminni en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann er meðal þeirra sem draga minnst, aðeins 750 kg. Tesla Model Y Premium Long Range er 60.000 kr. ódýrari, drífur jafn langt, er með 438 l stærra skott og má draga 850 kg meira.',
      'C-HR+ 77 kWh er fyrir þá sem setja drægni, langa ábyrgð og traust merki ofar plássi og dráttargetu.',
    ],
    facts: 'd421ea0aac8c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er meðalstór jepplingur með fjórhjóladrifi og sérstæðu útliti, systurbíll Subaru Uncharted, fyrir þá sem vilja lipran bíl með gott grip og snerpu.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði, má draga 1.500 kg, og Toyota ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km með reglulegu eftirliti hjá umboðinu, mun lengur en flestir á þessu verði.',
      'Á móti kemur að hann drífur styttra og hleður hægar en flestir á svipuðu verði, og skottið er minna en hjá flestum þeirra. BYD Sealion 7 er 200.000 kr. ódýrari, sneggri, hleður með um 15% styttri stoppum og er með 104 l stærra skott.',
      'C-HR+ AWD er fyrir þá sem vilja Toyota með fjórhjóladrifi og langa ábyrgð, en gefur eftir í plássi og hleðslu.',
    ],
    facts: '83cb018c4f63',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er kassalaga fjölnotabíll byggður á sendibíl, með rennihurðum og allt að sjö sætum, fyrir barnafjölskyldur sem þurfa gott aðgengi og mikið pláss.',
      'Rennihurðirnar gera umgengni auðvelda í þröngum stæðum, há setstaðan gefur gott útsýni og hann nýtur þjónustunets Toyota hér á landi.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst, hlaða hægast og eru aflminnstir á svipuðu verði. Systurbíllinn Peugeot e-Rifter er nánast sami bíll en 1.300.000 kr. ódýrari.',
      'Proace City Verso er þægilegur fjölskyldubíll innanbæjar, en e-Rifter gefur það sama fyrir mun minna.',
    ],
    facts: 'ab8da93d30b2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso er stór fjölnotabíll byggður á sendibíl, með sætum fyrir allt að níu manns, fyrir stórar fjölskyldur eða fyrirtæki í fólksflutningum.',
      'Skottið er stærra en hjá flestum á svipuðu verði og Toyota ábyrgist rafhlöðuna í 10 ár, lengur en flestir á þessu verði, og hann nýtur þjónustunets Toyota hér á landi.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst, hlaða hægast, eru hægastir og draga minnst á svipuðu verði. Hyundai STARIA Electric tekur líka níu, er 2.400.000 kr. ódýrari, drífur 48 km lengra, hleður með um 50% styttri stoppum og má draga 1.000 kg meira.',
      'Proace Verso hentar í fólksflutninga innanbæjar, en STARIA gefur mun meira fyrir minna.',
    ],
    facts: '59379ced9043',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser Active FWD er lítill jepplingur með framhjóladrifi og hárri setstöðu, systurbíll Suzuki e Vitara, fyrir þá sem vilja einfaldan hversdagsbíl frá Toyota.',
      'Toyota ábyrgist rafhlöðuna í allt að 10 ár eða 300.000 km, mun lengur en flestir á svipuðu verði, og hann nýtur þjónustunets Toyota hér á landi.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, skottið er eitt það minnsta og hann má aðeins draga 750 kg. XPENG G6 RWD Standard Range er 100.000 kr. ódýrari, drífur álíka langt, hleður með um 55% styttri stoppum, er með 333 l stærra skott og má draga 750 kg meira.',
      'Urban Cruiser er látlaus bæjarbíll með langa ábyrgð, en fyrir sama verð fæst mun meira annars staðar.',
    ],
    facts: '64536f9dc71c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er lítill jepplingur með fjórhjóladrifi, systurbíll Suzuki e Vitara 4x4, fyrir þá sem vilja fjórhjóladrif og traust Toyota-merki í nettum bíl.',
      'Toyota ábyrgist rafhlöðuna í allt að 10 ár eða 300.000 km, mun lengur en flestir á svipuðu verði, og fjórhjóladrifið gefur grip í snjó og hálku.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst, hlaða hægast og draga minnst á svipuðu verði, og skottið er eitt það minnsta. Smart #3 Pulse er 100.000 kr. ódýrari, líka fjórhjóladrifinn, en drífur 20 km lengra og hleður með um 40% styttri stoppum.',
      'Urban Cruiser AWD hentar þeim sem setja fjórhjóladrif og langa ábyrgð í forgang og aka mest í nærumhverfinu.',
    ],
    facts: 'd9aeb0b9edaa',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er stór fjölnotabíll byggður á sendibíl, með nostalgísku útliti í anda gamla rúgbrauðsins, fjórhjóladrifi og allt að sjö sætum, fyrir stórar fjölskyldur.',
      'Skottið er það stærsta af öllum bílum á listanum, og rennihurðir og kassalaga lag gefa þægilegt aðgengi að barnastólum og farangri. Hann má draga 1.600 kg.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst á svipuðu verði og hleður hægar en flestir þeirra. Hyundai IONIQ 9 Long Range AWD kostar 200.000 kr. meira, tekur líka sjö, drífur 132 km lengra, hleður með um 30% styttri stoppum og má draga 900 kg meira.',
      'ID. Buzz GTX er heillandi og hagnýtur fjölskyldubíll fyrir þá sem þurfa mest pláss og ferðast mest í styttri ferðum.',
    ],
    facts: '5385fed6e084',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er lítill fimm sæta hlaðbakur, rafdrifinn arftaki hins klassíska Polo, fyrir þá sem vilja lipran og vandaðan smábíl frá þekktu merki.',
      'Hann er mjög ódýr, drífur lengra og er sneggri en flestir á svipuðu verði og meðal þeirra sem hlaða hraðast. Skottið er stærra en hjá flestum á þessu verði og hann má draga 1.200 kg, meira en flestir þeirra.',
      'Veikleikarnir eru fáir, helst að drægnin er samt fremur stutt miðað við rafbíla almennt. Skoda Epiq 55, systurbíll á sama grunni, kostar það sama með 34 l stærra skott og hærri setstöðu, en drífur 13 km styttra.',
      'ID. Polo er einn heildstæðasti ódýri rafbíllinn, kvikur í bænum og liðtækur milli landshluta.',
    ],
    facts: '34da995b7888',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-cross-base': {
    paragraphs: [
      'Volkswagen ID. Cross er lítill jepplingur með framhjóladrifi, aðeins hærri en hefðbundinn smábíll, sem auðveldar umgengni og útsýni en heldur þægilegri stærð í þröngum stæðum og götum.',
      'Miðað við aðra á svipuðu verði er hann sneggri og hleður hraðar en flestir, og skottið er stærra en hjá flestum þeirra, með lítið framskott að auki. Hann má líka draga 1.200 kg, sem Citroën ë-C4 og Fiat 600e á svipuðu verði mega ekki.',
      'Helsti gallinn er að hann drífur styttra en flestir á svipuðu verði, sem finnst fljótt í vetrarkulda. Renault Scenic E-Tech EV60 er stærri bíll með 70 l stærra skott fyrir 300.000 kr. meira, en drífur álíka langt og hleður hægar.',
      'ID. Cross hentar þeim sem vilja snarpan og hagnýtan smájeppling í daglegt amstur og meta hraða hleðslu ofar mikilli drægni.',
    ],
    facts: '45f187817b79',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-3-pro': {
    paragraphs: [
      'Volkswagen ID.3 Pro er fimm sæta hlaðbakur með afturhjóladrifi og litlum beygjuradíus, liðlegur í þröngum götum og stæðum, fyrir þá sem vilja einfaldan hversdagsbíl.',
      'Hann er mjög ódýr og drægnin og snerpan eru í meðallagi á þessu verði, sem dugar fyrir daglegan akstur og styttri ferðir.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má ekki draga kerru. Kia EV3 Standard Range er 99.000 kr. ódýrari, drífur jafn langt, hleður með um 10% styttri stoppum, er með 75 l stærra skott og má draga 500 kg.',
      'ID.3 Pro er raunhæfur hversdagsbíll, en keppinautarnir á sama verði gefa meira.',
    ],
    facts: 'de4703c863af',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-3-neo-58-kwh': {
    paragraphs: [
      'Volkswagen ID.3 Neo er þægilegur og nettur hlaðbakur sem hentar vel í daglegan akstur jafnt í þéttbýli sem milli landshluta. Hann býður upp á hefðbundin akstursgæði Volkswagen í lipurri fólksbílaútfærslu, þar sem afturhjóladrifið veitir honum lítinn beygjuradíus og liðlega hegðun í þröngum götum og bílastæðahúsum.',
      'Miðað við aðra bíla á svipuðu verði drífur hann lengra en flestir og reynist ódýrari á hvern kílómetra drægni. Þótt rafhlaðan sé fremur lítil nýtir hann orkuna vel og hleður hraðar en flestir í sínum verðflokki, sem þýðir styttri hlé við hraðhleðslustöðvar á ferðalögum um landið.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði. Ef pláss og kraftur skipta meira máli býður Tesla Model Y Standard Range upp á mun meira rými og afl fyrir 140.000 krónum meira, þótt hleðslustoppin séu þar um 10% lengri.',
      'Fyrir kaupendur sem leita að sparneytnum og liprum bíl með góða drægni á sanngjörnu verði er ID.3 mjög heppilegur kostur.',
    ],
    facts: '3ba989fdff90',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er sportlegasta útgáfa hins þekkta fjölskyldujepplings, með fjórhjóladrifi og meira afli, fyrir þá sem vilja rúmgóðan bíl með auknu viðbragði.',
      'Hann má draga 1.800 kg, meira en flestir á svipuðu verði, og drægnin og hleðslan eru í meðallagi á þessu verði.',
      'Á móti kemur að hann sker sig lítið úr miðað við aðra á svipuðu verði. Volkswagen ID.4 Pro 4MOTION er 700.000 kr. ódýrari, líka fjórhjóladrifinn og drífur álíka langt, en má draga 600 kg minna.',
      'ID.4 GTX er traustur fjölskyldubíll sem gerir flest vel, en ID.4 Pro 4MOTION gefur meira fyrir peninginn nema dráttargetan skipti máli.',
    ],
    facts: '65b5193b7488',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION er meðalstór jepplingur með fjórhjóladrifi, þrautreyndur og hagnýtur fjölskyldubíll með þægilegum og fyrirsjáanlegum akstri.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, og skottið er stærra en hjá flestum þeirra, svo hann hentar jafnt í daglegt skutl og ferðir milli landshluta.',
      'Á móti kemur að hann má aðeins draga 1.200 kg, minna en flestir á svipuðu verði, og snerpan er í meðallagi. XPENG G6 AWD Performance er 100.000 kr. ódýrari, drífur álíka langt, hleður með um 25% styttri stoppum, er mun sneggri og má draga 300 kg meira.',
      'ID.4 Pro 4MOTION er öruggt val fyrir þá sem vilja hefðbundinn og hagnýtan fjölskyldubíl með fjórhjóladrifi.',
    ],
    facts: 'c4a184d802f3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er stór skutbíll með fjórhjóladrifi, tæpir fimm metrar á lengd, hljóðlátur og rúmgóður, fyrir þá sem ferðast mikið og vilja ekki jeppling.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, skottið er stærra en hjá flestum þeirra og hann má draga 1.800 kg, meira en flestir á þessu verði.',
      'Á móti kemur að hann er fremur dýr og afl og snerpa eru aðeins í meðallagi miðað við verðið. Polestar 4 SUV Long Range Dual Motor er 200.000 kr. ódýrari og mun sneggri, en skottið er 75 l minna.',
      'ID.7 GTX er heilsteyptur langferðabíll fyrir fjölskyldur sem vilja pláss, drægni og dráttargetu.',
    ],
    facts: '52858135416f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ec40-recharge-twin': {
    paragraphs: [
      'Volvo EC40 Recharge Twin er meðalstór sportjepplingur með aflíðandi þaklínu, systurbíll EX40 með sama drifbúnaði undir rennilegri yfirbyggingu. Hann hentar þeim sem vilja fágaðan og snarpan fjórhjóladrifsbíl og setja útlitið ofar plássinu.',
      'Bíllinn drífur lengra og hleður hraðar en flestir á svipuðu verði, og með fjórhjóladrifi og miklu afli er hann sneggri en flestir í sínum verðflokki. Hann má líka draga 1.800 kg, meira en flestir á þessu verði, svo hjólhýsi eða þung kerra er ekkert mál.',
      'Á móti kemur að hann er nettur og með einu af minnstu skottunum í sínum verðflokki, og aftursætin gjalda fyrir lága þaklínuna. Volvo EX40 Recharge Twin kostar það sama með sama drifi og gefur meira höfuðrými aftur í, en þurfi meira pláss frekar en afl býður Toyota bZ4X Touring 265 l stærra skott, þótt hann sé mun hægari og megi aðeins draga 750 kg.',
      'EC40 er fyrir þá sem vilja Volvo með sportlegri svip og nóg af afli, og sætta sig við minna rými en í hefðbundnari jepplingi.',
    ],
    facts: '51b9529f9a54',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-es90-twin-motor': {
    paragraphs: [
      'Volvo ES90 Twin Motor er stór og fágaður fólksbíll með afturhlera, fimm metrar á lengd, þar sem skandinavískur lúxus, hljóðlátur akstur og þægindi eru í fyrirrúmi. Hann hentar þeim sem vilja vandaðan langferðabíl með klassísku fólksbílasniði frekar en jeppa.',
      'Stærsti kosturinn er hve vel hann hentar í langferðir: hann drífur lengra og hleður hraðar en flestir á svipuðu verði, sem kemur sér vel í vetrarakstri milli landshluta. Hann má líka draga 2.000 kg.',
      'Á móti kemur að skottið er eitt það minnsta í sínum verðflokki og hann er hægari en flestir á svipuðu verði. Mercedes-Benz GLC 400 4MATIC er 600.000 kr. ódýrari, drífur 36 km lengra og er með 124 l stærra skott og 128 l framskott, fyrir þá sem sætta sig við jeppalag.',
      'ES90 er sterkur kostur fyrir þá sem meta drægni, hraða hleðslu og fágun ofar plássi.',
    ],
    facts: '0e40ddb119b7',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-es90-twin-motor-performance': {
    paragraphs: [
      'Volvo ES90 Twin Motor Performance er stór lúxusfólksbíll með afturhlera og fjórhjóladrifi, fimm metrar á lengd, aflmeiri útgáfa ES90, sem sameinar langferðaþægindi og mikla snerpu.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði og er meðal þeirra sneggstu og aflmestu. Hann má draga 2.000 kg.',
      'Á móti kemur að skottið er eitt það minnsta á svipuðu verði. Volvo ES90 Twin Motor er 800.000 kr. ódýrari með sömu drægni og hleðslu, og gefur aðeins eftir í snerpu.',
      'ES90 Twin Motor Performance er fyrir þá sem vilja langdrægan lúxusfólksbíl með miklu afli, en flestum dugar ódýrari útfærslan.',
    ],
    facts: 'b3e42392fb8e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er nettur og kassalaga jepplingur með fjórhjóladrifi og miklu afli, fyrir þá sem vilja vandaðan Volvo með háa setstöðu og gott útsýni.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði, hleður hraðar en flestir þeirra og má draga 1.800 kg, meira en flestir á þessu verði. Auk skottsins er lítið framskott.',
      'Á móti kemur að hann er fremur dýr og skottið er minna en hjá flestum á svipuðu verði. Toyota bZ4X Touring kostar það sama, drífur 23 km lengra og er með 259 l stærra skott, en er framhjóladrifinn, mun aflminni og má aðeins draga 750 kg.',
      'EX40 er traustur og sprækur jepplingur fyrir þá sem draga kerru og þurfa ekki mest pláss.',
    ],
    facts: '5c9dd30ae76d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er lítill og nettur jepplingur með afturhjóladrifi og skandinavísku yfirbragði, ódýrasta útfærsla EX30, fyrir þá sem vilja vandaðan bæjarbíl.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði, léttur og kvikur í daglegum akstri.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst á svipuðu verði, hleður hægar en flestir þeirra og skottið er eitt það minnsta. Volvo EX30 Single Motor Extended Range kostar 400.000 kr. meira en drífur 136 km lengra, hleður hraðar og má draga 600 kg meira.',
      'EX30 Single Motor er skemmtilegur borgarbíll, en flestum borgar sig stærri rafhlaðan.',
    ],
    facts: '1dbcafd62fbd',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex30-single-motor-extended-range': {
    paragraphs: [
      'Volvo EX30 Single Motor Extended Range er lítill og nettur jepplingur með vandaðri skandinavískri hönnun, ætlaður þeim sem vilja gæðatilfinningu í lipurri stærð frekar en stóran fjölskyldubíl.',
      'Hann er sneggri en flestir á svipuðu verði og hleður hraðar en flestir í sínum verðflokki. Þrátt fyrir smæðina má hann draga 1.600 kg, sem er með því mesta á þessu verði.',
      'Á móti kemur að skottið er eitt það minnsta í sínum verðflokki og aftursætin eru þröng, og hann er aðeins afturhjóladrifinn. Mazda CX-6e 78 kWh er 200.000 kr. ódýrari, 62 cm lengri og með 150 l stærra skott og 80 l framskott, en mun hægari.',
      'EX30 hentar þeim sem vilja snarpan og vandaðan smábíl sem getur dregið kerru, en síður fjölskyldum sem þurfa pláss.',
    ],
    facts: 'a2ede041531a',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex30-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Twin Motor Performance er lítill jepplingur með fjórhjóladrifi og gríðarlegu afli, meðal sneggstu bíla á sínu verði, sem sameinar skandinavíska fágun og leiftursnögg viðbrögð.',
      'Hann er meðal þeirra sneggstu og aflmestu á svipuðu verði og má draga 1.600 kg, meira en flestir á þessu verði.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði og skottið er eitt það minnsta. Subaru Uncharted kostar 100.000 kr. meira, er líka fjórhjóladrifinn, drífur 40 km lengra og er með 85 l stærra skott.',
      'EX30 Twin Motor Performance er fyrir þá sem vilja kraftmikinn og vandaðan smábíl með fjórhjóladrifi.',
    ],
    facts: 'd369d9b20156',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er lítill jepplingur með fjórhjóladrifi, ögn hærri og grófari útgáfa EX30, sem sameinar smábílastærð og gríðarlegan kraft.',
      'Hann er meðal sneggstu bíla á svipuðu verði og má draga 1.600 kg, meira en flestir þeirra, og hann er lipur í þröngum stæðum.',
      'Á móti kemur að hann drífur styttra og hleður hægar en flestir á svipuðu verði, og skottið er eitt það minnsta. Volvo EX30 Twin Motor Performance er sami bíll án Cross Country-útlitsins, 830.000 kr. ódýrari og drífur 23 km lengra.',
      'EX30 Cross Country er fyrir þá sem vilja grófara útlit og mikinn kraft í nettum bíl.',
    ],
    facts: '846a79cfbc8a',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex60-p10': {
    paragraphs: [
      'Volvo EX60 P10 er stór og aflmikill lúxusjeppi með fjórhjóladrifi, sem sameinar látlausa skandinavíska hönnun, mikið öryggi og þægindi. Hann hentar fjölskyldum sem vilja vandaðan jeppa sem gefur lítið eftir á langferðum.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, svo langferðir um landið kalla á fá og stutt stopp, jafnvel í vetrarkulda. Hann má draga 2.400 kg, meira en flestir í sínum verðflokki, og er sneggri en flestir þeirra.',
      'Á móti kemur að hann er fremur dýr og skottið er aðeins í meðallagi miðað við aðra á sama verði. Þurfi enn meiri drægni fæst Volvo EX60 P12 fyrir 1.000.000 kr. meira, með 810 km drægni.',
      'EX60 P10 er heildstæður kostur fyrir þá sem vilja vandaðan fjölskyldujeppa til ferðalaga um landið, með kerru aftan í ef svo ber undir.',
    ],
    facts: 'a5909cfd01ce',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex60-p12': {
    paragraphs: [
      'Volvo EX60 P12 er stór lúxusjeppi með fjórhjóladrifi, aflmesta og langdrægasta útgáfa EX60, sem byggir á orðspori Volvo fyrir öryggi og vandaðan frágang.',
      'Hann drífur lengst bíla á svipuðu verði, er meðal þeirra sem hlaða hraðast og meðal þeirra sneggstu, og hann má draga 2.400 kg, meira en flestir í sínum verðflokki. Auk skottsins er 52 l framskott.',
      'Veikleikarnir eru fáir, helst að hann er fremur dýr og skottið aðeins í meðallagi á þessu verði. Volvo EX60 P10 er 1.000.000 kr. ódýrari og drífur samt mjög langt, fyrir þá sem þurfa ekki allra mestu drægnina.',
      'EX60 P12 er einn öflugasti ferðabíllinn á sínu verði, fyrir þá sem vilja komast sem lengst á hverri hleðslu.',
    ],
    facts: 'dfac4e58fd9b',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er stór sjö sæta lúxusjeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, með ríka áherslu á öryggi og fágaðan akstur eins og merkið er þekkt fyrir.',
      'Hann drífur lengra en flestir á svipuðu verði, skottið er stærra en hjá flestum þeirra og 34 l framskott bætist við. Hann má draga 2.200 kg, meira en flestir í sínum verðflokki.',
      'Á móti kemur að hann er mjög dýr, hleður hægar og er hægari en flestir á svipuðu verði. Hyundai IONIQ 9 Long Range Performance AWD er 2.500.000 kr. ódýrari, tekur líka sjö, drífur álíka langt, hleður með um 25% styttri stoppum og er með 239 l stærra skott.',
      'EX90 er heildstæður lúxusjeppi fyrir þá sem vilja sjö sæti og skandinavísk gæði.',
    ],
    facts: '198f43cf5f7f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex90-twin-motor-performance': {
    paragraphs: [
      'Volvo EX90 Twin Motor Performance er stór sjö sæta lúxusjeppi með fjórhjóladrifi, rúmlega fimm metrar á lengd, sem sameinar skandinavíska fágun, mikið öryggi og mikið afl. Hann hentar stórum fjölskyldum sem vilja rými og þægindi án þess að gefa eftir í snerpu.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði, skottið er stærra en hjá flestum þeirra og hann má draga 2.200 kg, meira en flestir í sínum verðflokki. Drægnin er í meðallagi miðað við verðið en dugar vel milli landshluta.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði. Volvo EX90 Twin Motor er 800.000 kr. ódýrari með álíka drægni, og munar þar aðeins um snerpuna, en Hyundai IONIQ 9 Long Range Performance AWD er 3.300.000 kr. ódýrari, hleður með um 25% styttri stoppum og er með 239 l stærra skott.',
      'EX90 Twin Motor Performance er fyrir þá sem vilja sjö sæta Volvo með aukinni snerpu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: 'a23ee4a76bae',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g6-rwd-standard-range': {
    paragraphs: [
      'XPENG G6 RWD Standard Range er stór jepplingur með afturhjóladrifi og rennilegri línu, 4,75 m á lengd, frá kínverska merkinu XPENG, með tæknivæddu innanrými og miklu plássi.',
      'Hann er meðal þeirra sem hlaða hraðast á svipuðu verði, sneggri en flestir þeirra og skottið er stærra en hjá flestum. Hann má draga 1.500 kg, meira en flestir á þessu verði.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði og er aðeins afturhjóladrifinn. XPENG G6 RWD Long Range kostar 700.000 kr. meira og drífur 135 km lengra, og XPENG G6 AWD Performance fæst með fjórhjóladrifi fyrir 1.100.000 kr. meira.',
      'G6 Standard Range er rúmgóður og hraðhlaðandi bíll fyrir þá sem aka mest í nærumhverfinu og meta pláss.',
    ],
    facts: 'd19809f0083d',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 RWD Long Range er stór jepplingur með afturhjóladrifi, rennilegri línu og stórri rafhlöðu, frá kínverska merkinu XPENG, fyrir þá sem aka mikið milli landshluta og vilja mikið pláss.',
      'Hann drífur lengra en flestir á svipuðu verði og er meðal þeirra sem hlaða hraðast, svo langferðir kalla á fá og stutt stopp. Skottið er stærra en hjá flestum á þessu verði og hann má draga 1.500 kg, meira en flestir þeirra.',
      'Á móti kemur að hann er aðeins afturhjóladrifinn og merkið er nýlegt hér á landi. XPENG G6 AWD Performance fæst með fjórhjóladrifi og mun meira afli fyrir 400.000 kr. meira, með nánast sömu drægni.',
      'G6 Long Range gefur mikið fyrir peninginn, fyrir þá sem setja drægni, hraða hleðslu og pláss í forgang.',
    ],
    facts: 'e1aec00acaa1',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er stór jepplingur með fjórhjóladrifi og rennilegu coupé-lagi, frá kínverska merkinu XPENG, sem sameinar mikið pláss, mikla drægni og mikið afl.',
      'Hann er meðal sneggstu og aflmestu bíla á svipuðu verði, drífur lengra en flestir þeirra og er meðal þeirra sem hlaða hraðast. Skottið er stærra en hjá flestum á þessu verði og hann má draga 1.500 kg.',
      'Veikleikarnir eru fáir: merkið er nýlegt hér á landi og flestu er stýrt í gegnum snertiskjá. Volkswagen ID.4 Pro 4MOTION kostar 100.000 kr. meira frá rótgrónara merki, en hleður með um 35% lengri stoppum og er mun aflminni.',
      'G6 AWD Performance er einn sterkasti fjórhjóladrifni kosturinn á sínu verði, fyrir þá sem treysta nýju merki.',
    ],
    facts: 'edf5bd30c2ba',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er stór lúxusjepplingur með fjórhjóladrifi, 4,9 m á lengd, frá kínverska merkinu XPENG, með áherslu á þægindi, tækni og afl.',
      'Hann hleður mjög hratt, meðal þeirra hröðustu á svipuðu verði, og er sneggri og aflmeiri en flestir þeirra. Skottið er stærra en hjá flestum í hans verðflokki og 71 l framskott bætist við.',
      'Á móti kemur að hann drífur styttra og dregur minna en flestir á svipuðu verði, og merkið er nýlegt hér á landi. Volvo EX60 P10 kostar 200.000 kr. meira, drífur 120 km lengra og má draga 900 kg meira, þótt hleðslustoppin séu um 30% lengri.',
      'G9 er fyrir þá sem vilja rúmgóðan og tæknivæddan jeppling sem hleður á mettíma.',
    ],
    facts: '21ec7198ea17',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er stór sjö sæta fjölnotabíll með fjórhjóladrifi, 5,3 m á lengd, með framúrstefnulegu útliti og fullgildu rými í öllum sætaröðum, fyrir stórar fjölskyldur.',
      'Hann hleður hraðast allra rafbíla á listanum, þrátt fyrir stóra rafhlöðu, svo hleðslustopp á langferðum verða óvenju stutt. Hann er líka aflmeiri en flestir á svipuðu verði.',
      'Á móti kemur að hann er dýr, drífur styttra og er hægari en flestir á svipuðu verði, og merkið er nýlegt hér á landi. Hyundai IONIQ 9 Long Range AWD er 400.000 kr. ódýrari, tekur líka sjö og drífur 35 km lengra, þótt hleðslustoppin séu um 90% lengri.',
      'X9 er fyrir stórar fjölskyldur sem ferðast um landið og vilja eyða sem minnstum tíma við hleðslustöðvar.',
    ],
    facts: 'ac75f896cbc6',
    model: 'gemini-3.8-flash, thinking medium',
  },
}

export default carReviews
