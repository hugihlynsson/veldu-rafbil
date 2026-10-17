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
      'Hann drífur mjög langt og lengra en flestir á svipuðu verði, og hleður hraðar en flestir þeirra, svo langferðir kalla á fá og stutt stopp, jafnvel í vetrarkulda. Hann er líka sneggri en flestir í sínum verðflokki og má draga 2.100 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að skottið er minna en hjá flestum á svipuðu verði og lág byggingin býður ekki upp á sömu veghæð og jepplingur. Audi Q6 e-tron er hærri jepplingur með sama drifbúnaði, má draga 300 kg meira og kostar 500.000 kr. meira, en drífur 87 km styttra.',
      'A6 e-tron Sportback er einn sterkasti langferðabíllinn í sínum verðflokki, og ódýrari en skutbílsútfærslan en drífur samt lengra.',
    ],
    facts: '528cb113b364',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er stór skutbíll með fjórhjóladrifi, nærri fimm metrar á lengd, ætlaður fjölskyldum sem aka mikið um landið og vilja fágaðan langferðabíl með hagnýtu farangursrými frekar en jeppa.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, svo hleðslustopp á langferðum verða fá og stutt. Hann er líka sneggri en flestir í sínum verðflokki og má draga 2.100 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að skottið er minna en hjá flestum á svipuðu verði, þótt skutbílslagið rúmi meira þegar sætin eru felld niður. Audi A6 e-tron Sportback quattro er 300.000 kr. ódýrari og drífur 38 km lengra, fyrir þá sem þurfa ekki skutbílslagið.',
      'A6 e-tron Avant er fyrir þá sem vilja langdrægan og snarpan skutbíl sem dregur hjólhýsi, í stað jeppa.',
    ],
    facts: '5124bada378e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er lágur og straumlínulagaður lúxussportbíll með fjórhjóladrifi, náskyldur Porsche Taycan, hannaður fyrir þá sem setja akstur, afl og áberandi hönnun ofar notagildi.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði, hleður fremur hratt og lágur þyngdarpunktur gerir hann stöðugan og skemmtilegan í akstri. Auk skottsins er 85 l framskott undir vélarhlífinni.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst á svipuðu verði, skottið er eitt það minnsta í sínum verðflokki og hann má ekki draga kerru. Porsche Taycan 4 Plus kostar nánast það sama en drífur mun lengra, fyrir þá sem vilja sams konar sportbíl sem hentar betur í langferðir.',
      'e-tron GT er draumabíll fyrir þá sem leita að hreinni akstursánægju, svo lengi sem þeir sætta sig við takmarkaða drægni og lítið pláss.',
    ],
    facts: '1a0ffdfe8771',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro er meðalstór jepplingur með fjórhjóladrifi, ætlaður þeim sem kunna að meta vandaða innréttingu, lágværan akstur og rótgróið úrvalsmerki í hversdagsbíl.',
      'Það sem hann býður umfram keppinautana er fyrst og fremst merkið, frágangurinn og akstursþægindin: góð hljóðvist og mjúk fjöðrun gera langferðir áreynslulausar. Í tölunum hefur hann fáa styrkleika.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, og hann má aðeins draga 1.200 kg. Smart #5 Brabus kostar 100.000 kr. meira en drífur 52 km lengra, hleður með um 40% styttri stoppum, er með 110 l stærra skott og má draga 400 kg meira.',
      'Q4 e-tron er fyrir þá sem setja fágun og Audi-merkið í öndvegi, en fyrir peninginn fæst meiri bíll annars staðar.',
    ],
    facts: '306c55238898',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er stór og vandaður lúxusjepplingur með fjórhjóladrifi, ætlaður fjölskyldum sem vilja þægilegan og öruggan ferðabíl með hárri setstöðu og góðu útsýni.',
      'Hann drífur lengra en flestir á svipuðu verði og hleður fremur hratt, svo langferðir milli landshluta verða áhyggjulausar, jafnvel í vetrarkulda. Hann má draga 2.400 kg, með því mesta á þessu verði, og auk skottsins er 64 l framskott.',
      'Á móti kemur að hann er hægari en flestir á svipuðu verði. Volvo EX60 P10 kostar 100.000 kr. minna, drífur 35 km lengra, hleður með um 15% styttri stoppum og er mun sneggri.',
      'Q6 e-tron er traustur kostur fyrir fjölskyldur sem ferðast um landið, með kerru eða hjólhýsi ef svo ber undir.',
    ],
    facts: 'c719fcff91c1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er stór lúxusjepplingur með fjórhjóladrifi og aflíðandi þaklínu, sem sameinar háa setstöðu og rennilegri baksvip en í hefðbundnum Q6 e-tron.',
      'Hann drífur lengra en flestir á svipuðu verði og hleður mjög hratt, svo hleðslustopp á þjóðveginum verða stutt. Hann má draga 2.400 kg, meira en flestir í sínum verðflokki, og auk skottsins er 64 l framskott.',
      'Á móti kemur að hann er hægari en flestir á svipuðu verði og skottið er minna en hjá flestum þeirra. Audi Q6 e-tron er 600.000 kr. ódýrari með nánast sömu drægni og 15 l stærra skott, og Volvo EX60 P10 er 700.000 kr. ódýrari, drífur 23 km lengra og er mun sneggri.',
      'Q6 Sportback er fyrir þá sem vilja sportlegra útlit og eru tilbúnir að borga talsvert fyrir formið.',
    ],
    facts: 'a587638043c0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er aflmesta útgáfan af Q6 e-tron, stór lúxusjepplingur með fjórhjóladrifi sem leggur áherslu á snerpu og sportlegan akstur án þess að fórna notagildinu.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði, og má draga 2.400 kg, meira en flestir í sínum verðflokki. Auk skottsins er 64 l framskott undir vélarhlífinni.',
      'Á móti kemur að hann er mjög dýr og drægnin og hraðhleðslan eru aðeins í meðallagi miðað við verðið. Porsche Cayenne kostar nánast það sama en drífur 44 km lengra, hleður með um 30% styttri stoppum, er með 267 l stærra skott og má draga 600 kg meira.',
      'SQ6 e-tron er fyrir þá sem vilja snarpan Audi-jeppling, en á þessu verði fæst meira í hverjum öðrum efnum.',
    ],
    facts: '6be7cb5413e8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'BMW i4 40 xDrive er lágur og rennilegur fólksbíll með afturhlera og fjórhjóladrifi, ætlaður þeim sem meta hefðbundna akstursánægju BMW og vilja sitja neðar en í jepplingi. Afturhlerinn gerir farangursrýmið aðgengilegt og innréttingin ber vott um vandaðan frágang.',
      'Hann liggur vel á vegi, er stöðugur í beygjum og má draga 1.600 kg. Hann drífur og hleður í meðallagi miðað við rafbíla almennt.',
      'Á móti kemur að hann drífur styttra og hleður hægar en flestir á svipuðu verði, og skottið er minna en hjá flestum þeirra. Mercedes-Benz GLC 300 4MATIC kostar það sama en drífur 67 km lengra, hleður með um 25% styttri stoppum, er með 100 l stærra skott og má draga 800 kg meira.',
      'i4 40 xDrive er fyrir þá sem kjósa akstursánægju og fólksbílalag fram yfir drægni og pláss.',
    ],
    facts: 'c8b9a2c3cd23',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er lágur og sportlegur fólksbíll með afturhlera og fjórhjóladrifi, sniðinn að þeim sem hafa unun af akstri. Hann er meðal sneggstu og aflmestu bíla á sínu verði.',
      'Afl og snerpa eru hans sterkasta hlið, og hann drífur fremur langt og hleður fremur hratt, svo hann ræður vel við ferðalög milli landshluta. Hann má líka draga 1.600 kg.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði og skottið er minna en hjá flestum þeirra. BMW i4 40 xDrive er 2.000.000 kr. ódýrari með sömu drægni og sama rými, og gefur aðeins eftir í snerpu.',
      'i4 M60 er fyrir þá sem setja afl og hraða ofar öllu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: '8890a1c90b99',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er stór lúxusfólksbíll með skottloki og afturhjóladrifi, rúmlega fimm metrar á lengd, þar sem lögð er áhersla á fágaðan akstur, hljóðlátt innanrými og þægindi á langferðum.',
      'Hann drífur fremur langt og kemst á milli landshluta án fyrirhafnar, og góð hljóðeinangrun og afturhjóladrifið gefa honum yfirvegaða og skemmtilega aksturseiginleika á greiðfærum vegum.',
      'Á móti kemur að hann hleður hægar, er aflminni og dregur minna en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og afturhjóladrifið krefst meiri aðgæslu í snjó og hálku. Polestar 3 Performance kostar 490.000 kr. meira en er fjórhjóladrifinn, mun sneggri og má draga 700 kg meira.',
      'i5 eDrive40 er fyrir þá sem vilja hljóðlátan og fágaðan langferðabíl í klassísku fólksbílasniði.',
    ],
    facts: '1c309ab62c34',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er stór lúxusfólksbíll með skottloki og fjórhjóladrifi, rúmlega fimm metrar á lengd, sem sameinar þægindi fimmu-línunnar og mikið afl M-deildarinnar. Hann hentar þeim sem vilja fágaðan og kraftmikinn fólksbíl frekar en jeppa.',
      'Hann er meðal aflmestu bíla á sínu verði og sneggri en flestir þeirra, og vönduð hljóðeinangrun gerir hann að notalegum langferðabíl á greiðfærum vegum. Hann má draga 2.000 kg.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast á svipuðu verði, og skottið er minna en hjá flestum þeirra. Porsche Taycan 4S Plus er 940.000 kr. ódýrari, álíka snöggur og hleður með um 50% styttri stoppum, en má ekki draga kerru. BMW i5 eDrive40 er 6.400.000 kr. ódýrari og drífur 42 km lengra, fyrir þá sem geta verið án aflsins.',
      'i5 M60 er fyrir þá sem vilja kraftmikinn BMW-fólksbíl og eru tilbúnir að borga mikið fyrir aflið umfram drægni og hleðslu.',
    ],
    facts: 'eff3ad7deb4c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er stór lúxusjeppi með fjórhjóladrifi sem leggur áherslu á hljóðlát þægindi og mjúkan akstur, með rúmgóðu farþegarými og sérstæðri, nútímalegri innréttingu. Hann hentar þeim sem vilja fágaðan ferðabíl frekar en sportlegan.',
      'Hann má draga 2.500 kg, meira en flestir á svipuðu verði, og drífur fremur langt, svo hann kemst vel milli landshluta og ræður við hjólhýsi. Aksturinn er yfirvegaður og traustur, sem gerir langkeyrslur afslappaðar.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði, er aflminni en flestir þeirra og skottið er minna en hjá flestum í hans verðflokki. Porsche Macan 4s Electric kostar 460.000 kr. meira en hleður með um 40% styttri stoppum og er sneggri, þótt hann sé minni bíll, og BMW iX xDrive 60 Sport drífur 99 km lengra fyrir 2.300.000 kr. meira.',
      'iX xDrive 45 er fyrir þá sem meta ró, þægindi og dráttargetu ofar snerpu og hraðri hleðslu.',
    ],
    facts: '882067b3bf42',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er stór lúxusjeppi með fjórhjóladrifi sem leggur áherslu á hljóðlát þægindi, rúmgott farþegarými og sérstæða, nútímalega innréttingu. Hann hentar þeim sem vilja fágaðan ferðabíl sem kemst langt á hverri hleðslu.',
      'Drægnin er hans sterkasta hlið: hann er meðal þeirra langdrægustu á svipuðu verði, svo langferðir milli landshluta kalla á fá stopp, jafnvel í vetrarkulda. Hann er aflmeiri en flestir í sínum verðflokki og má draga 2.500 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að hraðhleðslan er aðeins í meðallagi miðað við verðið og skottið er minna en hjá flestum á svipuðu verði. Porsche Cayenne Coupé kostar 160.000 kr. meira en hleður með um 50% styttri stoppum og má draga 1.000 kg meira, þótt hann drífi 58 km styttra.',
      'iX xDrive 60 er fyrir þá sem setja drægni og þægindi í öndvegi og vilja sem fæst hleðslustopp á leiðinni.',
    ],
    facts: 'd79d0f40d4d1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er minnsti rafjepplingur BMW, framhjóladrifinn og vandaður, ætlaður þeim sem vilja úrvalsmerki og góða hljóðvist í hversdagsbíl án þess að borga fyrir stærri gerðir.',
      'Hann nýtir orkuna vel og drægnin og hraðhleðslan eru í meðallagi á þessu verði, og frágangur og innrétting bera merki merkisins.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði og meðal þeirra sem draga minnst, aðeins 750 kg. Opel Grandland kostar 100.000 kr. meira, drífur álíka langt, er með 60 l stærra skott og má draga 450 kg meira. Fjórhjóladrifni BMW iX1 xDrive 30 fæst fyrir 1.000.000 kr. meira.',
      'iX1 eDrive 20 er fyrir þá sem vilja BMW á hagstæðu verði og þurfa hvorki fjórhjóladrif né mikla dráttargetu.',
    ],
    facts: '5170bc1d9003',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 xDrive 30 er lítill og vandaður lúxusjepplingur með fjórhjóladrifi, ætlaður þeim sem vilja BMW-gæði, góða hljóðvist og lipra stýringu í nettum bíl.',
      'Hann er snöggur og lipur í akstri, með góðri hljóðvist og vönduðu innanrými eins og merkið er þekkt fyrir. Í tölunum hefur hann fáa styrkleika umfram keppinautana á svipuðu verði.',
      'Á móti kemur að hann drífur styttra, hleður hægar og má draga minna en flestir á svipuðu verði. Kia EV5 AWD kostar nánast það sama en drífur 16 km lengra, er með 76 l stærra skott og má draga 600 kg meira, og BMW iX1 eDrive 20 er 1.000.000 kr. ódýrari og drífur 46 km lengra, fyrir þá sem þurfa ekki fjórhjóladrif.',
      'iX1 xDrive 30 er fyrir þá sem setja BMW-merkið og akstursánægju í öndvegi, en fyrir peninginn fæst meiri bíll annars staðar.',
    ],
    facts: '7b462734f436',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er stór og vandaður jepplingur með afturhjóladrifi, af nýrri kynslóð rafbíla BMW, sem leggur áherslu á langferðir, fágaðan akstur og þægindi.',
      'Hann er meðal þeirra langdrægustu og þeirra sem hlaða hraðast á svipuðu verði, svo langferðir um landið kalla á fá og stutt stopp. Hann má draga 2.000 kg, með því mesta á þessu verði, og auk skottsins er 58 l framskott.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði og aðeins afturhjóladrifinn, sem kallar á meiri varkárni í snjó og hálku. BMW iX3 50 xDrive fæst með fjórhjóladrifi og 168 km meiri drægni fyrir 2.500.000 kr. meira.',
      'iX3 40 er einn sterkasti langferðabíllinn í sínum verðflokki, fyrir þá sem þurfa ekki fjórhjóladrif.',
    ],
    facts: '16731bcab88f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er stór og vandaður jepplingur með fjórhjóladrifi, af nýrri kynslóð rafbíla BMW, smíðaður fyrir þá sem vilja leggja af stað í langferðir án þess að hugsa mikið um hleðslur.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og meðal þeirra sem hlaða hraðast, svo hringvegurinn kallar á fá og stutt stopp, jafnvel í vetrarkulda. Hann er aflmeiri en flestir í sínum verðflokki og auk skottsins er 58 l framskott.',
      'Á móti kemur að hann er fremur dýr. Volvo EX60 P12 kostar 100.000 kr. minna, drífur álíka langt, er sneggri og má draga 400 kg meira. BMW iX3 40 er 2.500.000 kr. ódýrari og drífur samt langt, fyrir þá sem þurfa ekki fjórhjóladrif.',
      'iX3 50 xDrive er fyrir þá sem vilja vandaðan ferðabíl með sem minnstu hleðslustússi.',
    ],
    facts: 'fb86aa548d6e',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er nettur fimm sæta hlaðbakur sem hentar vel í innanbæjarakstur og sem hagkvæmur heimilisbíll. Hann er lipur í þröngum stæðum og þéttbýli, og innanrýmið nýtist vel miðað við stærðina.',
      'Stærsti styrkur hans er verðið: hann er ódýrari á hvern kílómetra drægni en flestir í sínum verðflokki, með stærri rafhlöðu en gengur og gerist á þessu verði og meðal þeirra sneggstu af bílum sem kosta svipað.',
      'Á móti kemur að hann hleður mjög hægt, er með minna skott en flestir á svipuðu verði og má ekki draga kerru. Skoda Epiq 55 kostar það sama en hefur 130 l stærra skott, um 45% styttri hleðslustopp og má draga 1.200 kg.',
      'Fyrir þá sem hlaða heima, aka mest innanbæjar og þurfa hvorki kerru né mikið farangursrými er Dolphin hagkvæmur og skemmtilegur kostur.',
    ],
    facts: 'a075d76dc9ac',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er lágur og rennilegur fólksbíll með skottloki og fjórhjóladrifi, sem höfðar til þeirra sem vilja sportlegan akstur frekar en hefðbundinn jeppling. Hann er meðal sneggstu og aflmestu bíla á sínu verði.',
      'Afl og snerpa eru hans sterkasta hlið, og lágur þyngdarpunktur gerir hann stöðugan og skemmtilegan á malbiki. Auk skottsins er 53 l framskott undir vélarhlífinni, og hann má draga 1.500 kg.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði og skottið er eitt það minnsta í sínum verðflokki. Kia EV6 2025 Long Range AWD er 200.000 kr. ódýrari, hleður með um 55% styttri stoppum og er með 90 l stærra skott, en hann er mun aflminni.',
      'Seal á best við þá sem setja kraft og akstursánægju ofar hraðhleðslu og fjölskylduplássi.',
    ],
    facts: 'f4502aed1fcd',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er stór framhjóladrifinn jepplingur, tæpir 4,8 m á lengd, sem leggur áherslu á rými og rólegan akstur frekar en afköst. Hann hentar fjölskyldum sem vilja mikið pláss fyrir hóflegt verð.',
      'Skottið er stærra en hjá flestum á svipuðu verði og drægnin í meðallagi, sem dugar vel milli landshluta. Hann má draga 1.300 kg.',
      'Á móti kemur að hann er meðal þeirra hægustu og þeirra sem hlaða hægast á svipuðu verði. MG MGS6 Dual Motor er 100.000 kr. ódýrari, fjórhjóladrifinn, mun sneggri og hleður með um 15% styttri stoppum, en skottið er 59 l minna.',
      'Seal U hentar þeim sem vilja rúmgóðan og þægilegan fjölskyldubíl og hlaða mest heima.',
    ],
    facts: 'ee6e6b50363e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er stór og rennilegur jepplingur með fjórhjóladrifi, 4,83 m á lengd, sem einkennist öðru fremur af miklu afli og snöggri hröðun. Hann hentar þeim sem vilja kraftmikinn fjölskyldubíl á hóflegu verði.',
      'Hann er meðal aflmestu bíla á sínu verði, sneggri en flestir þeirra og hleður hraðar en flestir, svo hleðslustopp á langferðum verða stutt. Auk skottsins er 58 l framskott undir vélarhlífinni, og hann má draga 1.500 kg.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði. Subaru e-Outback kostar 100.000 kr. meira, drífur 21 km lengra og er með 113 l stærra skott, þótt hleðslustoppin séu um 15% lengri.',
      'Sealion 7 er fyrir þá sem vilja mikið afl og hraða hleðslu fyrir peninginn, frekar en hámarksdrægni.',
    ],
    facts: 'e5798dfbadee',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er stór sjö sæta jeppi með fjórhjóladrifi, ætlaður stórum fjölskyldum sem vilja hefðbundið jeppalag og ríflegt innanrými.',
      'Hann er með mjög stóra rafhlöðu og meðal þeirra aflmestu á svipuðu verði, og hröðunin er snörp fyrir jafn stóran bíl. Farangursrýmið er með því stærsta í sínum verðflokki þegar aftasta sætaröðin er felld niður.',
      'Stærsti veikleikinn kemur fram á langferðum: hann drífur styttra en flestir á svipuðu verði og er meðal þeirra sem hlaða hægast. Hyundai IONIQ 9 Long Range AWD kostar 290.000 kr. meira en drífur 75 km lengra, hleður með um 55% styttri stoppum og má draga 1.000 kg meira.',
      'Tang hentar best þeim sem hlaða heima og meta pláss og afl ofar langferðum.',
    ],
    facts: 'e3108495b06c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er hlaðbakur með jepplingsyfirbragði sem leggur áherslu á mýkt frekar en afköst. Hann er þekktur fyrir mjúka fjöðrun og þægileg sæti sem deyfa ójöfnur vel, og hentar þeim sem vilja lágværan og þægilegan hversdagsbíl.',
      'Hann er fremur ódýr og akstursþægindin eru það sem greinir hann frá keppinautunum. Í tölunum hefur hann fáa styrkleika.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má ekki draga kerru. Volkswagen ID. Cross er 100.000 kr. ódýrari, drífur 11 km lengra, hleður með um 20% styttri stoppum, er með 95 l stærra skott og má draga 1.200 kg.',
      'ë-C4 er ljúfur kostur fyrir þá sem setja mjúkan akstur ofar öllu, en fyrir sama verð fæst meira annars staðar.',
    ],
    facts: '0f203bba0964',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er lítill fjögurra sæta borgarbíll með ítölsku retro-útliti, aðeins 3,6 m á lengd, sniðinn að þröngum götum og stuttum ferðum. Hann hentar þeim sem vilja sjarmerandi innanbæjarbíl sem kemst í stæði sem stærri bílar ráða ekki við.',
      'Hann er mjög ódýr og mjög nettur, sem gerir hann að fýsilegum öðrum bíl á heimilið, og rafhlaðan fyllist auðveldlega heima yfir nótt.',
      'Á móti kemur að hann drífur mjög stutt, hleður hægar en flestir á svipuðu verði, skottið er eitt það minnsta og hann má ekki draga kerru. Hyundai IONIQ 3 Standard Range er 290.000 kr. ódýrari, drífur 39 km lengra, rúmar fimm, er með 256 l stærra skott og má draga 750 kg.',
      '500e er laglegur borgarbíll fyrir þá sem kaupa með hjartanu, en gefur mikið eftir í drægni og plássi.',
    ],
    facts: 'ed1eed510bce',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er lítill jepplingur með ítölsku retro-útliti, systurbíll Jeep Avenger, ætlaður þeim sem vilja stílhreinan bíl í dagleg erindi og styttri ferðir.',
      'Hann er fremur ódýr, lipur í þröngum götum og auðveldur í stæðum, og hraðhleðslan er í meðallagi á þessu verði.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði og er meðal þeirra hægustu, skottið er minna en hjá flestum þeirra og hann má ekki draga kerru. Volkswagen ID. Cross er 100.000 kr. ódýrari, drífur 27 km lengra, er með 115 l stærra skott og má draga 1.200 kg.',
      '600e höfðar til þeirra sem heillast af ítalska sjarmanum, en fyrir sama verð fæst hagnýtari bíll.',
    ],
    facts: '5cb3f7454b4f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er rennilegur jepplingur með aflíðandi þaklínu og fjórhjóladrifi, byggður á sama grunni og Volkswagen ID.5, fyrir þá sem vilja rúmgóðan bíl með meiri karakter en hefðbundnir kassalaga fjölskyldubílar.',
      'Hann er meðal þeirra langdrægustu og þeirra sem hlaða hraðast á svipuðu verði og sneggri en flestir þeirra, og skottið er stærra en hjá flestum í hans verðflokki þrátt fyrir þaklínuna.',
      'Á móti kemur að hann má aðeins draga 1.200 kg, minna en flestir á svipuðu verði. Tesla Model Y Premium Long Range kostar 40.000 kr. meira, er með 282 l stærra skott og má draga 400 kg meira, en hann er aðeins afturhjóladrifinn.',
      'Capri er einn sterkasti fjórhjóladrifni ferðabíllinn á sínu verði, ef ekki þarf að draga mikið.',
    ],
    facts: 'f3e474e1f35f',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer ER AWD er kassalaga meðalstór jepplingur með fjórhjóladrifi, byggður á sama grunni og Volkswagen ID.4, sem hentar fólki sem vill jeppalag, þægilega sætishæð og gott útsýni.',
      'Hann drífur lengra, hleður hraðar og er sneggri en flestir á svipuðu verði, svo hann hentar vel í ferðalög milli landshluta.',
      'Á móti kemur að hann má aðeins draga 1.200 kg, minna en flestir á svipuðu verði. Hyundai IONIQ 5 Long Range AWD kostar það sama en hleður með um 35% styttri stoppum og má draga 400 kg meira.',
      'Explorer er vel heppnaður og jarðbundinn fjölskyldubíll sem fer vel með íslenskan vetur, ef ekki þarf að draga mikið.',
    ],
    facts: '9eb36bb10329',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E LR AWD er rennilegur jepplingur með fjórhjóladrifi og sportlegum svip, sem sameinar rými fjölskyldubíls og líflega aksturseiginleika.',
      'Hann drífur lengra en flestir á svipuðu verði og er aflmeiri en flestir þeirra, og auk skottsins er 100 l framskott undir vélarhlífinni, með því stærsta sem gerist. Hann má draga 1.500 kg.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði. Smart #5 Pulse er 100.000 kr. ódýrari, hleður með um 50% styttri stoppum, er með 111 l stærra skott og mun aflmeiri, en drífur 10 km styttra.',
      'Mach-E hentar þeim sem vilja langdrægan og líflegan fjölskyldubíl, ef hægari hleðsla á ferðalögum er ekki fyrirstaða.',
    ],
    facts: '01e9d7fa4b33',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er lítill og nettur jepplingur, ætlaður sem hagkvæmur bæjarbíll með hærri setstöðu og lipra aksturseiginleika.',
      'Skottið er eitt það stærsta á svipuðu verði og 43 l framskott bætist við, og hann hleður hraðar en flestir í sínum verðflokki. Hann er líka mjög ódýr.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði. Leapmotor B10 67.1 kWh kostar 100.000 kr. meira en drífur 58 km lengra og hleður með um 10% styttri stoppum, þótt skottið sé 93 l minna.',
      'Puma er laglegur og hagnýtur hversdagsbíll á hagstæðu verði fyrir þá sem aka mest innanbæjar.',
    ],
    facts: '13dd726fc66c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er jepplingur með fjórhjóladrifi frá kínverska lúxusmerkinu Hongqi, sem einkennist af miklu afli og snarpri hröðun á hóflegu verði.',
      'Hann er meðal sneggstu og aflmestu bíla á sínu verði, drífur lengra en flestir þeirra og er meðal þeirra sem hlaða hraðast í sínum verðflokki.',
      'Á móti kemur að Hongqi er nýtt merki hér á landi og meiri óvissa er um endursöluverð og þjónustunet en hjá rótgrónum merkjum. Peugeot e-3008 kostar 180.000 kr. meira frá þekktara merki og drífur álíka langt, en er framhjóladrifinn og hleður með um 80% lengri stoppum.',
      'EHS5 gefur mikið fyrir peninginn, fyrir þá sem eru tilbúnir að veðja á nýtt merki.',
    ],
    facts: 'c1ddd31fa032',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er stór lúxusjepplingur með fjórhjóladrifi, tæpir fimm metrar á lengd, frá kínverska lúxusmerkinu Hongqi, og býður mikið afl og rými fyrir verð sem fáir ná.',
      'Hann er meðal sneggstu og aflmestu bíla á sínu verði, skottið er eitt það stærsta í sínum verðflokki og 62 l framskott bætist við. Hann drífur líka lengra en flestir á svipuðu verði og er meðal þeirra sem hlaða hraðast.',
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
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, og skottið er eitt það minnsta. Leapmotor B03X ProMax er 200.000 kr. ódýrari, drífur 55 km lengra, hleður með um 40% styttri stoppum og er með 127 l stærra skott.',
      'INSTER er lipur og hagkvæmur bæjarbíll frá þekktu merki, en síður til ferðalaga.',
    ],
    facts: '6832195fd771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er lítill og kassalaga jepplingur, aðeins 3,8 m á lengd, með hárri setstöðu og góðu útsýni, sniðinn að þéttbýli og þröngum stæðum.',
      'Hann er mjög ódýr og drífur 43 km lengra en grunnútfærslan, sem dugar í daglegan akstur og styttri ferðir milli bæja. Sætin má fella og færa á ýmsa vegu, svo innanrýmið nýtist vel miðað við stærð.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, og skottið er minna en hjá flestum þeirra. Ford Puma kostar 200.000 kr. meira en hleður með um 25% styttri stoppum, er mun sneggri og með 172 l stærra skott.',
      'INSTER Long Range er hreinræktaður borgarbíll sem hittir í mark í þéttbýli.',
    ],
    facts: '383ab1ec50e1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er lítill fimm sæta hlaðbakur, ætlaður sem hagkvæmur bæjarbíll í vinnuna, búðina og daglegt amstur.',
      'Helsti kostur hans er verðið, enda er hann mjög ódýr, og skottið er stærra en hjá flestum á svipuðu verði þó bíllinn sé nettur. Hann má líka draga 750 kg, sem sumir bílar í þessum verðflokki mega ekki.',
      'Á móti kemur að hann er með mjög litla rafhlöðu og drífur mjög stutt, sérstaklega í vetrarkulda, og hann hleður hægar en flestir á svipuðu verði. Renault R5 E-Tech 52 kWh er 110.000 kr. ódýrari en drífur 65 km lengra og hleður með um 15% styttri stoppum, þótt skottið sé 115 l minna.',
      'IONIQ 3 hentar best sem annar bíll heimilisins eða hreinn bæjarbíll, frekar en til reglulegra ferða milli landshluta.',
    ],
    facts: '2796cf363a0d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er lítill fimm sæta hlaðbakur sem leggur áherslu á drægni og hagkvæmni frekar en afl.',
      'Hann er mjög ódýr, drífur lengra og hleður hraðar en flestir á svipuðu verði, og skottið er stærra en hjá flestum þeirra, svo hann dugar vel í ferðalög milli landshluta.',
      'Á móti kemur að hann er meðal þeirra hægustu og aflminnstu á svipuðu verði og má aðeins draga 750 kg. Leapmotor C10 ProMax kostar 190.000 kr. meira, er stærri bíll, mun sneggri og má draga 750 kg meira.',
      'IONIQ 3 Long Range er skynsamlegt val fyrir þá sem vilja komast langt fyrir lítið og láta afl mæta afgangi.',
    ],
    facts: 'cc6347a9b495',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 Long Range AWD er jepplingur með fjórhjóladrifi, framúrstefnulegu útliti og óvenju opnu innanrými: langt hjólhaf skilar flötu gólfi og ríkulegu fótaplássi. Hann hentar fjölskyldum sem vilja þægilegan og rúmgóðan ferðabíl.',
      'Hann hleður hraðast allra bíla á svipuðu verði, drífur lengra en flestir þeirra og er sneggri en flestir í sínum verðflokki. Hann má draga 1.600 kg, meira en flestir á þessu verði.',
      'Veikleikarnir eru fáir: skottið og drægnin eru aðeins í meðallagi miðað við rafbíla almennt, og framskottið er lítið. Systurbíllinn Kia EV6 2025 Long Range AWD kostar það sama og má draga 200 kg meira, fyrir þá sem vilja sportlegri bíl.',
      'IONIQ 5 er einn sterkasti fjölskyldubíllinn á sínu verði, sérstaklega fyrir þá sem ferðast mikið um landið.',
    ],
    facts: 'ec32ba1494cf',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er stór sjö sæta jeppi, rúmlega fimm metrar á lengd, með fullgildri þriðju sætaröð. Hann leggur áherslu á þægindi og rými fyrir stórar fjölskyldur frekar en sportlega takta.',
      'Skottið er eitt það stærsta í sínum verðflokki og hann má draga 2.500 kg, meira en flestir á svipuðu verði, svo hjólhýsi eða hestakerra er ekkert mál. Hann drífur fremur langt og hraðhleðslan er í meðallagi í sínum verðflokki.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði, þótt það skipti minna máli í bíl af þessari gerð. XPENG X9 AWD Performance er 400.000 kr. dýrari en hleður með um 45% styttri stoppum og er aflmeiri, en drífur 35 km styttra.',
      'IONIQ 9 er einn sterkasti kosturinn fyrir stórar fjölskyldur sem ferðast um landið með fullan bíl eða kerru aftan í.',
    ],
    facts: '61ec7ef63fe4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er stór sjö sæta jeppi, rúmlega fimm metrar á lengd, með fullgildri þriðju sætaröð og öflugri útfærslu drifbúnaðarins. Hann hentar stórum fjölskyldum sem vilja mikið rými og þægilegan, hljóðlátan akstur.',
      'Skottið er eitt það stærsta á svipuðu verði og hann má draga 2.500 kg, meira en flestir í sínum verðflokki, svo hjólhýsi eða hestakerra er ekkert mál. Hann drífur fremur langt og hleður fremur hratt.',
      'Á móti kemur að hann er fremur dýr og drægni, hleðsla og snerpa eru aðeins í meðallagi miðað við verðið. Hyundai IONIQ 9 Long Range AWD er 1.500.000 kr. ódýrari með sama rými og álíka drægni, og munar þar aðeins um snerpuna.',
      'IONIQ 9 Performance er fyrir þá sem vilja stærsta Hyundai-jeppann með aukinni snerpu, en flestum dugar ódýrari útfærslan.',
    ],
    facts: '3f4af478402e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric er lipur og hagnýtur framhjóladrifinn jepplingur sem hentar vel sem sparneytinn fjölskyldubíll eða í daglegar ferðir til og frá vinnu. Hann fer létt með þröng bílastæði en veitir samt ágæta yfirsýn og þægilegt aðgengi.',
      'Hann drífur lengra en flestir á svipuðu verði og skottið er stærra en hjá flestum þeirra, með lítið framskott að auki. Í daglegu lífi þýðir það færri hleðslur í vikunni og nóg pláss fyrir innkaupin, jafnvel þegar vetrarkuldinn dregur úr drægninni.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði, er hægari en flestir þeirra og má aðeins draga 750 kg. Leapmotor C10 ProMax er 60.000 kr. ódýrari, hleður með um 25% styttri stoppum og má draga 750 kg meira, en hann er stærri bíll og ekki jafn lipur í þröngum stæðum.',
      'Ef markmiðið er að fá mikla drægni og pláss fyrir hverja krónu í þægilegum bíl, og lengri hleðslustopp á ferðalögum skipta ekki öllu, er Kona Electric einn hagkvæmasti kosturinn.',
    ],
    facts: 'd2efebe3c86d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric er stór fjölnotabíll með sætum fyrir allt að níu manns og framúrstefnulegu útliti. Hann hentar stórum fjölskyldum, ferðaþjónustu og hópum þar sem sætafjöldi og rými skipta öllu.',
      'Hann er lengstur bíla á svipuðu verði og með einu af stærstu skottunum, og hann má draga 2.000 kg, meira en flestir í sínum verðflokki. Rafhlaðan er stærri en hjá flestum á svipuðu verði, og hann hleður mun hraðar en aðrir stórir fjölnotabílar.',
      'Á móti kemur að hann drífur mjög stutt, og í vetrarkulda styttist drægnin enn frekar, svo langferðir kalla á fleiri hleðslustopp. Hann er líka aflminni en flestir á svipuðu verði.',
      'Fyrir þá sem þurfa níu sæti er STARIA hagstæður kostur: Peugeot e-Traveller er 1.300.000 kr. dýrari og Toyota Proace Verso 2.400.000 kr. dýrari, og báðir drífa styttra, hlaða hægar og mega draga minna.',
    ],
    facts: '55454b8ff503',
    model: 'gemini-3.8-flash, thinking high',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er lítill og kantaður jepplingur með svipmiklu Jeep-útliti, systurbíll Fiat 600e, þótt hann sé aðeins framhjóladrifinn. Hann hentar þeim sem vilja hærri setstöðu og vaskan svip í meðfærilegum bæjarbíl.',
      'Hann er fremur ódýr, lipur í þröngum götum og auðveldur í stæðum. Í tölunum hefur hann fáa styrkleika umfram keppinautana.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst, hlaða hægast og eru hægastir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má ekki draga kerru. XPENG G6 RWD Standard Range kostar það sama en drífur 35 km lengra, hleður með um 55% styttri stoppum, er með 216 l stærra skott og má draga 1.500 kg.',
      'Avenger er laglegur borgarbíll fyrir þá sem heillast af Jeep-svipnum, en gefur mikið eftir í drægni, hleðslu og plássi.',
    ],
    facts: '44e951bb483e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er stór rafdrifinn pallbíll, rúmlega fimm metrar á lengd, frá kóreska framleiðandanum sem áður hét SsangYong. Hann leggur áherslu á notagildi fremur en fágun og hentar þeim sem þurfa pall og dráttargetu í vinnu eða frístundum.',
      'Hann má draga 1.800 kg, meira en flestir á svipuðu verði, og pallurinn tekur það sem kemst ekki í skott. KGM ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir í sínum verðflokki.',
      'Á móti kemur að hann hleður mjög hægt, drífur styttra en flestir á svipuðu verði og er hægur í akstri. Þessi útfærsla er aðeins framhjóladrifin, en KGM Musso EV 4WD fæst með fjórhjóladrifi fyrir 1.300.000 kr. meira, þótt hann drífi 41 km styttra.',
      'Musso EV er eini rafdrifni pallbíllinn sem seldur er hér og hentar þeim sem þurfa vinnuþjark, ef þeir sætta sig við löng hleðslustopp.',
    ],
    facts: 'efc224526415',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV 4WD er stór rafdrifinn pallbíll með fjórhjóladrifi, rúmlega fimm metrar á lengd, frá kóreska framleiðandanum sem áður hét SsangYong. Hann hentar þeim sem þurfa pall, dráttargetu og grip í vinnu, á malarvegum og utan malbiks.',
      'Hann má draga 1.800 kg, meira en flestir á svipuðu verði, og fjórhjóladrifið nýtist vel í snjó og drullu. KGM ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir í sínum verðflokki.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast á svipuðu verði, svo langferðir kalla á þolinmæði. Framhjóladrifni KGM Musso EV er 1.300.000 kr. ódýrari og drífur 41 km lengra, fyrir þá sem þurfa pallinn en ekki fjórhjóladrifið.',
      'Musso EV 4WD er eini rafdrifni fjórhjóladrifni pallbíllinn sem seldur er hér, sniðinn að vinnu frekar en langferðum.',
    ],
    facts: 'd66452b944fb',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er stór og kantaður jepplingur, 4,7 m á lengd, með grófu útliti og framhjóladrifi, sem höfðar til þeirra sem vilja háa setstöðu og mikið pláss fyrir fjölskylduna á viðráðanlegu verði.',
      'Skottið er það stærsta á svipuðu verði, og KGM ábyrgist rafhlöðuna í allt að 10 ár eða 1.000.000 km, mun lengur en flestir í sínum verðflokki. Hann má líka draga 1.500 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að hann hleður hægar og er hægari en flestir á svipuðu verði, og drægnin er aðeins í meðallagi. Leapmotor C10 ProMax AWD kostar 100.000 kr. meira, er fjórhjóladrifinn, mun aflmeiri og hleður með um 15% styttri stoppum, en skottið er 404 l minna.',
      'Torres EVX er prýðilegur kostur fyrir fjölskyldur sem þurfa mikið pláss og vilja langa ábyrgð, og gera ekki kröfu um hraða hleðslu.',
    ],
    facts: '0f8f89fb8ee1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 Standard Range er lítill og nettur jepplingur, ætlaður sem hagkvæmur bæjarbíll fyrir þá sem aka mest innanbæjar og vilja bíl frá merki með gott orðspor.',
      'Stærsti kostur hans er verðið, enda er hann mjög ódýr, og hann má draga 750 kg, sem margir bílar á svipuðu verði mega ekki. Hann er lipur í þröngum stæðum og með lítið framskott fyrir hleðslusnúrurnar.',
      'Á móti kemur að hann drífur mjög stutt og hleður hægar en flestir á svipuðu verði, svo hann hentar illa til ferða milli landshluta. Leapmotor B10 kostar nánast það sama en er stærri bíll, drífur 44 km lengra, hleður með um 30% styttri stoppum og er með 68 l stærra skott.',
      'EV2 hentar best sem ódýr bæjarbíll eða annar bíll heimilisins, ekki sem eini bíllinn í langferðir.',
    ],
    facts: 'bc2e14d9b951',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er lítill og laglegur jepplingur, ætlaður sem hagkvæmur hversdagsbíll fyrir þá sem vilja komast á nýjan rafbíl frá merki með gott orðspor án þess að teygja budduna.',
      'Hann er mjög ódýr og drífur lengra en flestir á svipuðu verði, 136 km lengra en grunnútfærslan, svo hann dugar á milli landshluta þótt hann sé lítill.',
      'Á móti kemur að hann er meðal þeirra hægustu og aflminnstu á svipuðu verði og skottið er minna en hjá flestum þeirra. Skoda Epiq 55 kostar 99.000 kr. meira en er mun sneggri, hleður með um 20% styttri stoppum, er með 113 l stærra skott og má draga 450 kg meira.',
      'EV2 Long Range er skynsamlegt val fyrir þá sem vilja mikla drægni fyrir lítið og sætta sig við rólegan takt.',
    ],
    facts: '2fdd5bf67da3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 Standard Range er lítill og nútímalegur jepplingur, ætlaður sem hagkvæmur hversdagsbíll fyrir fjölskylduna eða í daglegan innanbæjarakstur.',
      'Hann er mjög ódýr, sneggri en flestir á svipuðu verði og skottið er stærra en hjá flestum þeirra, með lítið framskott að auki.',
      'Á móti kemur að hann má aðeins draga 500 kg og ábyrgðin á rafhlöðunni er með þeim stystu á svipuðu verði. Kia EV3 Long Range kostar 600.000 kr. meira en drífur 175 km lengra, hleður með um 25% styttri stoppum og má draga 1.000 kg.',
      'EV3 Standard Range er lipur og ódýr bæjarbíll, en flestum sem aka út á land borgar sig að fara í stærri rafhlöðuna.',
    ],
    facts: '42dcd1988f27',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er lítill og nútímalegur jepplingur sem drífur óvenju langt miðað við stærð og verð. Hann hentar þeim sem vilja hagkvæman og lipran bíl sem ræður líka við langferðir.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og hleður hraðar en flestir þeirra, svo hann dugar léttilega á milli landshluta, jafnvel í vetrarkulda. Skottið er stærra en hjá flestum á þessu verði.',
      'Á móti kemur að hann er aflminni en flestir á svipuðu verði, aðeins framhjóladrifinn og ábyrgðin á rafhlöðunni er með þeim stystu í sínum verðflokki. Kia EV3 Long Range AWD fæst með fjórhjóladrifi fyrir 1.100.000 kr. meira og má draga 500 kg meira.',
      'EV3 Long Range er eitt skynsamlegasta valið fyrir þá sem vilja mikla drægni og hraða hleðslu á hagstæðu verði.',
    ],
    facts: '837adf7be9b3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 Long Range AWD er lítill jepplingur með fjórhjóladrifi, ætlaður þeim sem vilja lipran bíl í þéttbýli sem ræður líka við vetrarfærð og langferðir.',
      'Hann drífur lengra og hleður hraðar en flestir á svipuðu verði, og má draga 1.500 kg, meira en flestir í sínum verðflokki.',
      'Á móti kemur að skottið er minna en hjá flestum á svipuðu verði. Skoda Elroq 85x er 200.000 kr. ódýrari, líka fjórhjóladrifinn og drífur álíka langt, en er með 57 l stærra skott og má draga 300 kg meira. Framhjóladrifni Kia EV3 Long Range sparar 1.100.000 kr. og drífur 33 km lengra.',
      'EV3 Long Range AWD er hagkvæmur kostur fyrir þá sem vilja nettan og langdrægan bíl með öruggu gripi allt árið.',
    ],
    facts: '52d51b19b573',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er fimm sæta hlaðbakur sem leggur áherslu á drægni og sparneytni frekar en jeppalag. Hann hentar þeim sem fara oft í langferðir og vilja hagkvæman bíl sem kemst langt á hverri hleðslu.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og hleður hraðar en flestir þeirra, svo hann dugar prýðilega milli landshluta, jafnvel í vetrarkulda.',
      'Á móti kemur að hann er hægari og aflminni en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má aðeins draga 1.000 kg. Kia EV4 Fastback er 200.000 kr. ódýrari með nánast sömu drægni og 55 l stærra skott, fyrir þá sem sætta sig við lengri bíl.',
      'EV4 er skynsamlegur ferðabíll fyrir þá sem setja drægni í öndvegi.',
    ],
    facts: '7a4f0374acac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er lágur og straumlínulagaður fólksbíll með skottloki, 4,7 m á lengd, sem leggur áherslu á drægni og sparneytni. Hann hentar þeim sem aka mikið milli landshluta og vilja fólksbíl frekar en jeppling.',
      'Hann er meðal þeirra langdrægustu á svipuðu verði og hleður hraðar en flestir þeirra, og skottið er stærra en hjá flestum í hans verðflokki. Hann er líka 200.000 kr. ódýrari en hlaðbakurinn Kia EV4.',
      'Á móti kemur að hann er hægari og aflminni en flestir á svipuðu verði og má aðeins draga 1.000 kg. Skoda Elroq 85 kostar það sama, er mun sneggri og jepplingur með hærri setstöðu, en drífur 33 km styttra.',
      'EV4 Fastback er hagkvæmur langferðabíll fyrir þá sem vilja komast langt fyrir peninginn.',
    ],
    facts: '1cdc5f54dd29',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev5-base': {
    paragraphs: [
      'Kia EV5 er kassalaga og hagnýtur fjölskyldujepplingur sem leggur mikla áherslu á gott útsýni, ríflegt innanrými og afslöppuð þægindi. Hann hentar einkum þeim sem leita að rólegum og notadrjúgum ferðabíl fyrir daglega fjölskyldulífið.',
      'Helsti kostur hans er að hann er með stærri rafhlöðu en flestir miðað við aðra á svipuðu verði. Það veitir traust öryggi í ferðum milli landshluta og dregur úr áhyggjum í íslenskum vetrarkulda. Bíllinn hleður í meðallagi og drægnin er í meðallagi, svo hefðbundin viðkoma á hleðslustöðvum dugar á langferðum.',
      'Á móti kemur að bíllinn er aðeins framhjóladrifinn, fremur aflítill og meðal þeirra hægustu miðað við aðra á svipuðu verði. Í snjó og hálku getur það skipt miklu máli. Skoda Enyaq 85X er 99.000 kr. dýrari en býður upp á fjórhjóladrif og 50 kW meira afl, og Smart #5 Pulse er sömuleiðis 99.000 kr. dýrari með fjórhjóladrif og um 40% styttri hleðslustopp.',
      'Kia EV5 er þægilegur ferðafélagi, en skortur á fjórhjóladrifi og takmarkað afl gera hann að erfiðari kosti í þessum verðflokki.',
    ],
    facts: '3df0d9f65455',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev5-awd': {
    paragraphs: [
      'Kia EV5 AWD er kassalaga og traustvekjandi fjölskyldujepplingur með fjórhjóladrifi sem sækir hönnun sína í stærri bíla merkisins. Hann höfðar einkum til þeirra sem leita að hagnýtum og rúmgóðum bíl með háa sætisstöðu og auðvelt aðgengi, þar sem róleg þægindi eru í fyrirrúmi frekar en sportlegir tilburðir.',
      'Fjórhjóladrifið kemur sér vel í íslenskri vetrarfærð, hvort sem er í snjóþyngslum í þéttbýli eða á hálum vegum. Stór rafhlaða veitir góða öryggistilfinningu í daglegum erindum og dugar vel til að sinna hefðbundnum ferðalögum milli landshluta án teljandi áhyggna.',
      'Miðað við aðra bíla á svipuðu verði drífur hann þó styttra en flestir og hleður hægar á ferðalögum. Hann er einnig aflminni og talsvert hægari upp á fullan hraða. Ef lengri drægni og sneggri hleðsla skipta mestu er Volkswagen ID.4 GTX heppilegri kostur, auk þess sem hann og BMW iX1 xDrive 30 bjóða báðir upp á talsvert meira afl fyrir sömu krónur. Fyrir kaupendur sem meta hagnýtt form og afslappaðan akstur er EV5 engu að síður þægilegur fjölskyldubíll.',
    ],
    facts: '97e875731646',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 Long Range AWD er straumlínulagaður og sportlegur crossover með öflugu fjórhjóladrifi. Hann hentar ökumönnum sem þurfa traustan gripbíl í snjó og hálku og meta lipran, kraftmikinn akstur jafnt í bænum sem á þjóðveginum.',
      'Helsti styrkleiki bílsins felst í hleðslugetunni, en miðað við aðra á svipuðu verði er hann meðal þeirra sem hlaða hraðast og stoppin á ferðalögum hringinn í kringum landið verða því óvenju stutt. Hann er jafnframt með stærri rafhlöðu og er sneggri en flestir í sínum verðflokki, sem veitir mikið öryggi við framúrakstur.',
      'Lágbyggðara og straumlínulagað formið þýðir þó að hann býður ekki upp á sömu uppréttu setstöðu og hefðbundnir jepplingar. Ef hærri sýn yfir veginn skiptir mestu máli gæti Nissan Ariya hentað betur, en sá bíll er aðeins framhjóladrifinn og krefst um 135% lengri hleðslustoppa. Ef leitað er eftir meiri drægni á svipuðu verði býður Hyundai IONIQ 5 Long Range AWD upp á örlítið meira af henni.',
      'Fyrir þá sem vilja snöggan og vel búinn fjórhjóladrifsbíl sem lágmarkar biðtíma á ferðalögum er EV6 afbragðs kostur.',
    ],
    facts: 'f4b80134c57d',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'kia-ev9-base': {
    paragraphs: [
      'Kia EV9 er stór og kassalaga sjö sæta fjölskyldujeppi með fjórhjóladrifi. Hann sker sig úr með háreistu jeppalagi og miklu innanrými, sem gerir hann að góðum kosti fyrir stórar fjölskyldur sem þurfa mörg sæti ásamt öruggri færni í vetrarfærð og á krefjandi vegum.',
      'Hann kemur með fremur stóra rafhlöðu og hleður fremur hratt, sem kemur sér vel á ferðalögum milli landshluta. Drægnin dugar vel í daglegan akstur, þótt gera megi ráð fyrir að hún minnki nokkuð í íslenskum vetrarkulda.',
      'Á móti er bíllinn dýrari og drífur styttra en flestir í sínum verðflokki. Sá sem vill meiri drægni og styttri hleðslutíma gæti skoðað XPENG X9 AWD Performance, sem er 400.000 kr. ódýrari, með 58 km meiri drægni og um 50% styttri hleðslustopp. Einnig er BYD Tang Flagship 1.100.000 kr. ódýrari, en þar eru hleðslustoppin um 110% lengri.',
      'Kia EV9 er sterkur kostur fyrir þá sem leita að rúmgóðum og traustum rafjeppa með öflugu vetrardrifi, en maður borgar talsvert fyrir stærðina og formið.',
    ],
    facts: '17a8cbfdb49d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev9-gt': {
    paragraphs: [
      'Kia EV9 GT er stór, sjö sæta jeppi sem sameinar mikið pláss og óvenju mikið afl. Hann hentar einkum stórum fjölskyldum sem þurfa mörg sæti en vilja jafnframt kröftugan og afgerandi bíl í daglegum akstri.',
      'Helsti styrkur hans er krafturinn, en bíllinn er sneggri og aflmeiri en flestir í sínum verðflokki. Fjórhjóladrifið veitir traust grip í snjó og hálku, og bíllinn hleður fremur hratt sem styttir viðkomur á hleðslustöðvum þegar ekið er milli landshluta.',
      'Á móti kemur að drægnin er aðeins í meðallagi, og miðað við aðra á svipuðu verði drífur hann meðal þeirra styst. Hann er einnig mjög dýr á hvern kílómetra drægni. Ef langdrægi skiptir meira máli býður Hyundai IONIQ 9 Long Range Performance AWD upp á 90 km meiri drægni og er 1.500.000 kr. ódýrari, á meðan Volvo EX90 Twin Motor nær 104 km lengra þótt hleðslustoppin séu þar um 20% lengri.',
      'EV9 GT er því kjörinn fyrir þá sem setja mikla rýmisþörf og mikla hröðun fram yfir hámarksdrægni á hleðslunni.',
    ],
    facts: '7db76de8dd00',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-pv5-base': {
    paragraphs: [
      'Kia PV5 er rúmgóður og kassalaga fjölnotabíll sem leggur megináherslu á hagnýtingu og gott aðgengi. Hann býður upp á allt að sjö sæti og hentar vel þeim sem þurfa að ferja marga farþega eða mikinn farangur daglega.',
      'Helsti styrkur bílsins liggur í því hve einfaldur og þægilegur hann er í umgengni fyrir stóran hóp, þar sem mikil lofthæð og opin rýmishönnun koma sér vel. Í hefðbundnum innanbæjarakstri og við daglegt skutl reynist hann því lipurt og þægilegt verkfæri fyrir stórar fjölskyldur.',
      'Á móti kemur að bíllinn er mjög aflítill og meðal þeirra hægustu miðað við verð. Hann drífur fremur stutt, hleður hægar en flestir í sínum verðflokki og er aðeins með afturhjóladrif. Fyrir íslenskar vetraraðstæður og langferðir er Peugeot e-5008 Dual Motor mun vænlegri kostur, en hann er 300.000 kr. ódýrari, með fjórhjóladrif og 61 km meiri drægni.',
      'Kia PV5 hentar því best þeim sem setja hagnýtt kassarými og sætafjölda ofar öllu, en síður þeim sem leita að öflugum bíl á krefjandi vetrarvegi.',
    ],
    facts: 'afce84cfe36c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-t03-base': {
    paragraphs: [
      'Leapmotor T03 er örsmár og lipur smábíll sem er sérsniðinn fyrir þröngar götur og innanbæjarkeyrslu. Hann rúmar aðeins fjóra í sæti og hentar einkar vel sem annar bíll á heimilinu eða hagkvæmur skutlubíll sem auðvelt er að smeygja í hvaða bílastæði sem er.',
      'Stærsti styrkur hans liggur í verðinu, enda er hann ódýrastur allra og mjög ódýr á hvern kílómetra drægni. Rafhlaðan er smá en dugar prýðilega í dagleg erindi innanbæjar, jafnvel í íslenskum vetrarkulda þar sem drægnin minnkar, og rekstrarkostnaðurinn helst í algjöru lágmarki.',
      'Á móti kemur að bíllinn drífur mjög stutt, er mjög aflítill og hleður mjög hægt. Á langferðum krefst hann mikillar þolinmæði. Ef ferðast er oft milli landshluta eða þörf er á fimm sætum er MG MG4 Urban Standard Range mun heppilegri kostur, með 60 km meiri drægni og um 55% styttri hleðslustopp fyrir 600.000 kr. meira.',
      'Fyrir þá sem vilja einfaldan og lipran fararskjóta til að sinna snatti í bænum er Leapmotor T03 hagkvæm og áhættulítil leið inn í rafbílaheiminn.',
    ],
    facts: 'f168cdfdc3ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b03x-pro': {
    paragraphs: [
      'Leapmotor B03X Pro er hagnýtur og nettlegur fimm sæta fólksbíll sem er sniðinn að daglegu amstri í þéttbýli og styttri ferðum. Hann hentar vel einstaklingum eða smærri fjölskyldum sem leita að nýjum og einföldum rafbíl í innanbæjarskutlið.',
      'Stærsti styrkur bílsins er verðið, enda er hann mjög ódýr, bæði í innkaupum og á hvern km drægni. Hann hleður fremur hægt, en hleðslustoppin eru þó styttri en hjá öðrum á svipuðu verði, auk þess sem hann reynist óvænt kvikur miðað við sína helstu keppinauta.',
      'Að sama skapi gefur maður eftir í langdrægni, því bíllinn er með mjög litla rafhlöðu og drífur mjög stutt. Í íslenskum vetrarkulda dugar það varla milli landshluta án tíðra hleðslna. Ef meiri drægni skiptir máli fæst MG MG4 Urban Standard Range á sama verði með 33 km meiri drægni, þótt hleðslustoppin séu um 20% lengri.',
      'Sem ódýr og handhægur bæjarbíll til að sinna hversdagslegum þörfum er Leapmotor B03X Pro fínn kostur sem vert er að skoða.',
    ],
    facts: 'dba3166a5d28',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er lítill og mjög ódýr jepplingur með framhjóladrifi, ætlaður sem hagkvæmur bæjarbíll fyrir þá sem vilja nýjan rafbíl án þess að borga mikið.',
      'Hann drífur stutt miðað við rafbíla almennt en lengra en flestir á svipuðu verði, og hann er meðal þeirra sem hlaða hraðast í sínum verðflokki, svo hleðslustopp á ferðalögum dragast síður á langinn. Hann er líka aflmeiri en flestir bílar á þessu verði.',
      'Á móti kemur að merkið er nýlegt í Evrópu, þar sem það er selt í samstarfi við Stellantis, og skottið er aðeins í meðallagi. MG MG4 Urban Long Range kostar 300.000 kr. meira en drífur 34 km lengra og er með 170 l stærra skott, þótt hleðslustoppin séu um 30% lengri, og ódýrari útfærslan, Leapmotor B03X Pro, sparar 600.000 kr. en drífur 90 km styttra.',
      'Fyrir þá sem vilja ódýran og sprækan hversdagsbíl sem hleður hratt er B03X ProMax hagkvæmur kostur.',
    ],
    facts: 'e6210d4da47e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b05-pro': {
    paragraphs: [
      'Leapmotor B05 Pro er lipur, fimm sæta rafbíll með afturhjóladrifi sem gerir hann óvenju kvikan og skemmtilegan í innanbæjarakstri. Hann hentar einkum fólki sem leitar að hagkvæmum bíl í daglegan snattakstur og styttri ferðalög milli landshluta.',
      'Stærsti kosturinn er hvað maður fær mikið fyrir peninginn. Miðað við aðra bíla á svipuðu verði drífur hann lengra en flestir og er meðal þeirra ódýrustu á hvern kílómetra drægni. Hann hleður jafnframt hraðar en flestir í sínum verðflokki og er meðal þeirra sneggstu, sem gerir framúrakstur á þjóðveginum liprari.',
      'Á móti kemur að hann drífur fremur stutt og rafhlaðan er lítil, þannig að í íslenskum vetrarkulda þarf að gera ráð fyrir tíðari hleðslustoppum á langferðum. Afturhjóladrifið getur líka kallað á meiri aðgát í mikilli hálku en framhjóladrif keppinautanna. Ef drægnin skiptir mestu máli gæti MG MG4 Urban Long Range hentað betur, þótt hann sé dýrari og hleðslustoppin um 25% lengri.',
      'Fyrir þá sem vilja sprækan og þægilegan bíl á einu allra lægsta verðinu á markaðnum er Leapmotor B05 Pro mjög hagkvæmur kostur.',
    ],
    facts: 'db289d44bbc9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b05-promax': {
    paragraphs: [
      'Leapmotor B05 ProMax er lipur, fimm sæta fólksbíll sem hentar vel þeim sem leita að ódýrum rafbíl sem er samt snarpur og skemmtilegur í akstri. Hann er mjög ódýr og afturhjóladrifinn, með meiri snerpu en búast mætti við á þessu verði.',
      'Helsti styrkur hans felst í því hvað fæst fyrir peninginn. Miðað við aðra á svipuðu verði drífur hann lengst, hleður hraðast og er ódýrastur á hvern kílómetra drægni. Í daglegu lífi þýðir þetta að hann dugar vel á milli landshluta jafnvel í vetrarkulda, og hleðslustoppin á langferðum eru styttri en hjá sambærilegum bílum.',
      'Aftur á móti krefst afturhjóladrifið meiri aðgátar í snjó og hálku en framhjóladrifið á bílum eins og Kia EV2 eða MG MG4 Urban Long Range. Þá er bíllinn fremur lágur, svo þeir sem vilja hærri setustöðu og jepplingasvip ættu fremur að skoða Leapmotor B10.',
      'Fyrir kaupendur sem vilja mikla drægni og góðan hleðsluhraða á lágu verði er B05 ProMax eitt allra hagkvæmasta valið á markaðnum.',
    ],
    facts: '42f28bf1bbf3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b10-base': {
    paragraphs: [
      'Leapmotor B10 er nettur fjölskyldujepplingur á sérlega lágu verði. Hann höfðar einkum til þeirra sem leita að liprum og hagnýtum bíl í daglegan akstur og innanbæjarstúss, en vilja sitja aðeins hærra og njóta meira rýmis en í hefðbundnum smábíl án þess að borga stórfé.',
      'Miðað við aðra í sínum verðflokki er hann sneggri og aflmeiri en flestir, auk þess að hlaða hraðar í ferðalögum. Hann er einnig ódýrari á hvern kílómetra drægni en flestir á svipuðu verði, sem gerir hann að vænlegum kosti fyrir þá sem vilja fá sem mest fyrir peninginn.',
      'Á móti kemur að hann drífur mjög stutt og í vetrarkulda dugar drægnin varla í langferðir án þess að skipuleggja hleðslustopp vel. Ef aðalatriðið er að komast sem lengst á milli hleðslna á lægra verði er MG MG4 Urban Long Range heppilegri kostur, en hann býður upp á 55 km meiri drægni og er 100.000 kr. ódýrari.',
      'Fyrir þá sem vilja rúmgóðan og sprækan jeppling á lágmarksverði býður Leapmotor B10 þó upp á mikið notagildi.',
    ],
    facts: '8cce705ff9bf',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'leapmotor-b10-67-1-kwh': {
    paragraphs: [
      'Leapmotor B10 er nettur jepplingur sem sker sig úr með afturhjóladrifi og 160 kW afli, sem gefur honum meiri snerpu og líflegri akstur en venja er í þessum verðflokki. Hann hentar vel þeim sem leita að hagkvæmum hversdagsbíl fyrir innanbæjarakstur og regluleg ferðalög.',
      'Helsti styrkur bílsins er hve mikið fæst fyrir verðið. Rafhlaðan er með þeim stærstu í þessum verðflokki og hleðslustopp á ferðalögum eru meðal þeirra stystu miðað við keppinautana. Drægnin dugar vel dagsdaglega, þótt reikna megi með að hún minnki í íslenskum vetrarkulda.',
      'Á móti kemur að afturhjóladrifið krefst góðra vetrardekkja í snjó og hálku miðað við framhjóladrifna keppinauta. Sé leitað að meiri drægni gæti Kia EV2 Long Range hentað betur, en þar eru hleðslustoppin um 20% lengri og aflið mun minna.',
      'Fyrir kaupendur sem vilja lipran og kraftmikinn jeppling á sérlega lágu verði er Leapmotor B10 afar vænlegur kostur.',
    ],
    facts: '820b4bbc7942',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-c10-pro': {
    paragraphs: [
      'Leapmotor C10 Pro er rúmgóður fjölskyldujepplingur með háa setstöðu og ríflegt innanrými fyrir fimm manns. Hann er hugsaður sem praktískur hversdagsbíll fyrir fjölskyldur sem vantar gott pláss fyrir fólk og farangur, en bíllinn er mjög ódýr.',
      'Í daglegum akstri nýtur hann góðs af því að vera aflmeiri og sneggri en flestir bílar á svipuðu verði, sem gerir framúrakstur og aðreinakeyrslu áreynslulausa. Hann er með stærri rafhlöðu en flestir í sínum verðflokki, og afturhjóladrifið gefur honum lipra og þægilega akstursupplifun á malbiki.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði og hleður fremur hægt. Ef fólk þarf ekki allt þetta pláss býður Skoda Epiq 55 upp á meiri drægni og um 25% styttri hleðslustopp. Afturhjóladrifið getur einnig krafist meiri aðgátar í hálku en framhjóladrif minni bílanna.',
      'Fyrir þá sem vilja stóran og þægilegan fjölskyldubíl á verði sem venjulega fylgir smábílum er C10 góður kostur, svo lengi sem drægnin og hleðslutíminn henta ferðalögunum.',
    ],
    facts: '77d2c83a4f96',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-c10-promax': {
    paragraphs: [
      'Leapmotor C10 ProMax er stór og rúmgóður fjölskyldujepplingur sem sker sig úr fyrir mikið rými á tiltölulega lágu verði. Hann hentar sérstaklega vel fyrir fjölskyldur sem þurfa gott pláss í hversdagsleikanum og vilja stóran bíl án þess að greiða verð stórra lúxusjepplinga.',
      'Helsti styrkur bílsins liggur í því hversu mikið fæst fyrir peningana, en hann er ódýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Hann er með einni af stærstu rafhlöðunum miðað við verð, drífur lengra en flestir sambærilegir bílar og er meðal þeirra aflmestu, sem veitir mikið öryggi í framúrakstri. Á langferðum munar einnig um að Hyundai Kona Electric 65 kWh þarf um 35% lengri hleðslustopp.',
      'Á móti kemur að bíllinn er aðeins með afturhjóladrif, sem getur verið galli í djúpum vetrarsnjó. Hann hleður líka fremur hægt á heildina litið, og ef hraði á hleðslustöðvum skiptir mestu hefur Volkswagen ID.3 Neo 58 kWh til að mynda um 10% styttri hleðslustopp. Fyrir þá sem vilja rúmgóðan jeppling með mikla drægni og lipurt afl á hagstæðu verði er C10 ProMax engu að síður afar vænn kostur.',
    ],
    facts: 'b7ee9166431c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er rúmgóður fjölskyldubíll sem sker sig rækilega úr með miklu afli og fjórhjóladrifi á verði þar sem kaupendur þurfa oftast að sætta sig við drif á tveimur hjólum. Hann hentar sérstaklega vel þeim sem leita að traustum bíl í snjó og vetrarfærð án þess að kosta miklu til.',
      'Bíllinn er mjög snöggur og aflmikill, sem gerir allan akstur léttan og viðbragðið öruggt. Hann er jafnframt með einni af stærstu rafhlöðunum miðað við aðra á svipuðu verði, sem gefur góðan orkuforða í íslenskum vetrarkulda þar sem rafbílar tapa alltaf hluta af drægni sinni.',
      'Á móti kemur að bíllinn drífur styttra en flestir miðað við aðra á svipuðu verði og hleður hægar en flestir í sínum verðflokki. Fyrir þá sem aka oft langar vegalengdir og vilja staldra stutt við á ferðinni gæti XPENG G6 RWD Standard Range hentað betur, en hann býður upp á um 30% styttri hleðslustopp.',
      'Fyrir þá sem leggja mesta áherslu á öruggt fjórhjóladrif, mikið vélarafl og gott rými í daglegu stappi er C10 engu að síður sérlega athyglisverður kostur.',
    ],
    facts: 'de92b93809ad',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-es-350e': {
    paragraphs: [
      'Lexus ES 350e er fágaður lúxusfólksbíll sem leggur megináherslu á þægindi, mýkt og hljóðláta ferð fram yfir krafta og snerpu. Hann hentar þeim sem leita að hvíldarlegum langferðabíl og kunna að meta hefðbundið handbragð og rótgróinn áreiðanleika merkisins.',
      'Bíllinn drífur fremur langt, sem nýtist vel í ferðalögum milli landshluta og veitir gott öryggi þótt vetrarkuldinn dragi eitthvað úr drægninni. Vönduð fjöðrun og lágvær gangur gera daglegar ferðir sérlega ljúfar.',
      'Á móti kemur að miðað við aðra á svipuðu verði er hann meðal þeirra aflminnstu og hægustu, auk þess sem hann hleður hægar en flestir. Hann er einungis framhjóladrifinn, sem gæti reynst ókostur í þungri vetrarfærð. Fyrir þá sem vilja meiri snerpu er BMW i5 eDrive40 90.000 kr. ódýrari og 2 s sneggri í 0-100 km/klst, og ef fjórhjóladrif skiptir sköpum í snjó er Polestar 3 Performance mun öflugri kostur.',
      'Fyrir kaupendur sem setja afslappaðan lúxus og vellíðan í öndvegi er Lexus ES 350e engu að síður ljúfur og traustur ferðafélagi.',
    ],
    facts: '88df29fca349',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-es-500e': {
    paragraphs: [
      'Lexus ES 500e er stór og fágaður lúxusfólksbíll sem höfðar til þeirra sem meta mikil þægindi, hljóðlátt umhverfi og rólyndi í akstri umfram allt annað. Hann leggur áherslu á hefðbundinn lúxus og vandaða smíði frekar en sportlega takta.',
      'Fjórhjóladrifið veitir öruggt og stöðugt grip í snjó og vetrarhálku. Aðalsmerki bílsins í daglegu lífi er góð hljóðeinangrun og mjúk fjöðrun, sem gerir bæði innanbæjarrúntinn og lengri ferðir sérlega afslappandi.',
      'Hins vegar gefur hann talsvert eftir miðað við aðra bíla á svipuðu verði. Hann er með einni af minnstu rafhlöðunum í sínum flokki, drífur styttra en flestir og er meðal þeirra sem hlaða hægast. Ef meiri afköst og skemmri stopp á ferðalögum skipta máli er BMW i4 M60 xDrive 600.000 kr. ódýrari, býður upp á 22 km meiri drægni og tekur um 10% styttri hleðslustopp.',
      'Lexus ES 500e er ljúfur og vandaður bíll fyrir þá sem setja þægindi og ró í forgang, en eru tilbúnir að sætta sig við hægari hleðslu og minni drægni en fást hjá keppinautunum.',
    ],
    facts: 'ec0d08614bb9',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-350e': {
    paragraphs: [
      'Lexus RZ 350e er lúxusjepplingur sem setur þægindi, fágað yfirbragð og hljóðlátan akstur í fyrirrúm. Hann hentar þeim sem leita að afslöppuðum og vönduðum ferðabíl í hversdagsleikann, en gera ekki kröfu um torfærutakta enda er hann framhjóladrifinn.',
      'Hann drífur fremur langt, sem dugar vel milli landshluta án mikils hleðslustresss, jafnvel í vetrarkulda. Há setstaða, lipur umgengni og vandaður frágangur Lexus gera hann afar notalegan í daglegum akstri.',
      'Miðað við aðra á svipuðu verði er hann hins vegar meðal þeirra aflminnstu og hægustu, auk þess að hlaða hægar en flestir. Ef krafist er öruggs vetrargrips býður Polestar 3 Performance upp á fjórhjóladrif, 215 kW meira afl og er 2,8 s sneggri í 0-100 km/klst fyrir 800.000 kr. meira. BMW i5 eDrive40 gefur sömuleiðis 23 km meiri drægni og meiri snerpu.',
      'RZ 350e heillar með hljóðlátum munaði og vönduðum vinnubrögðum, en í þessum verðflokki mun skortur á fjórhjóladrifi og hóflegt afl vega þungt hjá mörgum íslenskum kaupendum.',
    ],
    facts: '0a87c0c60e7f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-500e': {
    paragraphs: [
      'Lexus RZ 500e er fágaður og hljóðlátur lúxusjepplingur sem leggur áherslu á vönduð þægindi og afslappaðan akstur. Hann hentar sérstaklega kaupendum sem meta þekkt byggingargæði merkisins og vilja öruggan fjölskyldubíl þar sem rósemi í innanrými er í fyrirrúmi.',
      'Stærsti styrkur hans í daglegu lífi liggur í snörpu afli og öflugu fjórhjóladrifi. Hann er sneggri af stað en flestir bílar á svipuðu verði og drifið veitir mikið öryggi í snjó, bleytu og krefjandi vetraraðstæðum á íslenskum vegum.',
      'Hins vegar gefur maður eftir í drægni og hleðslu. Hann drífur meðal þeirra styst miðað við aðra í sínum verðflokki og hleður meðal þeirra hægast, sem getur lengt ferðalög milli landshluta í vetrarkulda. Fyrir þá sem aka reglulega langar vegalengdir væri Mercedes-Benz EQE SUV 350 4MATIC vænlegri kostur, með 94 km meiri drægni og styttri hleðslustopp.',
      'Fyrir innanbæjarakstur og daglega vellíðan er þetta afar ljúfur ferðafélagi, en hátt verð á hvern kílómetra drægni gerir hann að dýrum kosti fyrir langferðafólk.',
    ],
    facts: 'f94441e54214',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er kraftmikill lúxusjepplingur sem einkennist af fágun, hljóðlátum akstri og sportlegu yfirbragði. Fjórhjóladrifið veitir gott veggrip í hálku og snjó, og bíllinn hentar þeim sem leita að miklum þægindum og öruggri tilfinningu í daglegum akstri.',
      'Styrkleiki hans liggur í snerpunni, en hann er sneggri en flestir bílar á svipuðu verði. Aflið skilar sér samstundis og gerir hann lipran í umferðinni og öruggan við framúrakstur, á meðan fjöðrun og vönduð hljóðvist gera ferðina afslappaða.',
      'Á móti kemur að hann drífur fremur stutt og er með einni af minnstu rafhlöðunum í sínum verðflokki, sem reynir á í vetrarkulda. Þá hleður hann meðal þeirra hægustu miðað við verð. Fyrir þá sem fara oft í langferðir væri Audi SQ6 e-tron betri kostur, en hann býður upp á 136 km meiri drægni og um 45% styttri hleðslustopp fyrir lítið hærra verð.',
      'Þetta er fágaður og snöggur lúxusbíll, en kaupendur gefa talsvert eftir í drægni og hleðsluhraða miðað við það sem hann kostar.',
    ],
    facts: '4dd4a5df1719',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-ux-300e': {
    paragraphs: [
      'Lexus UX 300e er nettur lúxusbíll sem höfðar sérstaklega til þeirra sem leita eftir fáguðum vinnubrögðum, mikilli hljóðvist og liprum bíl í borgarumferðina. Hér færðu þekkt gæði og áreiðanleika Lexus í nettri stærð sem er sérlega þægileg í daglegu amstri og þröngum bílastæðum.',
      'Innanrýmið einkennist af vönduðum efnum og mikilli mýkt, sem gerir daglegan akstur áreynslulausan og notalegan. Fyrir hefðbundna notkun innanbæjar og styttri ferðir dugar rafhlaðan ágætlega til að leysa öll dagleg verkefni.',
      'Helsti gallinn er hins vegar hversu mikið maður gefur eftir miðað við háan verðmiðann. Bíllinn er aðeins framhjóladrifinn og hleður mjög hægt, auk þess sem hann drífur meðal þeirra styst miðað við aðra á svipuðu verði. Fyrir svipað verð fást stórir, fjórhjóladrifnir bílar á borð við Audi Q6 e-tron, sem býður upp á 175 km meiri drægni og um 80% styttri hleðslustopp, eða Volvo EX60 P10 sem býður upp á 210 km meiri drægni.',
      'Lexus UX 300e er ljúfur lúxusbíll fyrir borgina, en í þessum verðflokki fær maður mun meiri bíl og betri tækni annars staðar.',
    ],
    facts: '758669913f52',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mazda-6e-long-range': {
    paragraphs: [
      'Mazda 6e Long Range er lágur og rennilegur fólksbíll með afturhjóladrifi sem höfðar einkum til þeirra sem vilja hefðbundinn og þægilegan ferðabíl fremur en hærri jeppling. Hann einkennist af liprum aksturseiginleikum og ríflegri rafhlöðu miðað við verðmiðann.',
      'Styrkleiki bílsins er fyrst og fremst hversu mikið fæst fyrir peninginn. Hann er meðal þeirra ódýrustu á hvern km drægni og drífur lengra en flestir bílar á svipuðu verði. Það þýðir að auðvelt er að fara á milli landshluta án stöðugra áhyggna af rafhlöðunni, jafnvel í íslenskum vetrarkulda. Hann er auk þess aflmeiri en flestir í þessum verðflokki.',
      'Veiki hlekkurinn er hins vegar hraðhleðslan. Hann hleður töluvert hægar en flestir bílar á svipuðu verði, sem lengir hvíldarhléin á langferðum um landið. Nissan Leaf Extended Range býður til dæmis upp á 70 km meiri drægni og um 40% styttri hleðslustopp á sama verði, og í Volkswagen ID.3 Neo 58 kWh eru hleðslustoppin um 35% styttri.',
      'Mazda 6e Long Range hentar því best þeim sem hlaða daglega heima og vilja mikla drægni á hagstæðu verði, en geta sætt sig við að taka sér góðan tíma við hraðhleðslustöðvar í langkeyrslu.',
    ],
    facts: '7cc08e00859c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e er stór og stílhreinn jepplingur með afturhjóladrifi, 4,85 m á lengd, sem leggur áherslu á þægindi og yfirvegaðan akstur frekar en snerpu. Hann hentar fjölskyldum sem vilja stóran og vandaðan bíl á hóflegu verði.',
      'Hann hleður hraðar en flestir á svipuðu verði, auk skottsins er 80 l framskott undir vélarhlífinni og hann má draga 1.500 kg, meira en flestir í sínum verðflokki. Fyrir verðið fær maður óvenju stóran bíl.',
      'Á móti kemur að hann er hægari en flestir á svipuðu verði og aðeins afturhjóladrifinn, sem kallar á meiri varkárni í snjó og hálku. Hongqi EHS5 kostar 100.000 kr. meira en drífur 38 km lengra, hleður með um 25% styttri stoppum og er mun sneggri.',
      'CX-6e er heilsteyptur og fremur ódýr kostur fyrir þá sem vilja stóran og þægilegan fjölskyldubíl og þurfa ekki fjórhjóladrif.',
    ],
    facts: '4b812db57179',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-c-400-4matic': {
    paragraphs: [
      'Mercedes-Benz C 400 4MATIC er rennilegur og öflugur fólksbíll þar sem áherslan er á fágaðan lúxus, akstursánægju og mikil þægindi. Hann liggur lágt og stöðugt á veginum, sem gefur honum lipra og þægilega aksturseiginleika. Hann hentar sérstaklega þeim sem vilja hefðbundinn fólksbíl fremur en háan jeppling og gera miklar kröfur til gæða.',
      'Fjórhjóladrifið tryggir öruggt grip í snjó og hálku og drægnin er með því allra mesta sem gerist í þessum verðflokki. Bíllinn dugar því áhyggjulaust í langferðir milli landshluta, jafnvel í vetrarkulda. Hann hleður mjög hratt, sem lágmarkar stopp á hleðslustöðvum, auk þess sem mikil hröðun gerir framúrakstur á þjóðveginum áreynslulausan.',
      'Á móti kemur að sem lágur bíll býður hann ekki upp á sömu yfirsýn eða veghæð og jepplingar á svipuðu verði. Ef leitað er eftir hárri sætisstöðu og enn meiri drægni gæti Volvo EX60 P12 hentað betur, en hann er 100.000 kr. ódýrari, með 48 km meiri drægni og um 15% styttri hleðslustopp. Einnig býður BMW iX3 50 xDrive upp á meiri drægni á sama verði.',
      'Fyrir þá sem meta lágan, afar snöggan og langdrægan lúxusfólksbíl meira en jepplinga er C 400 afar sterkur kostur.',
    ],
    facts: '0def61a05830',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-200': {
    paragraphs: [
      'Mercedes-Benz CLA 200 er rennilegur og lágreistur stallbakur með sportlegu yfirbragði. Hann höfðar einkum til þeirra sem leita eftir fágun og akstursgæðum þýska merkisins fremur en hárri sætisstöðu hefðbundinna jepplinga.',
      'Stærsti styrkleiki bílsins liggur í mikilli orkunýtni, en hann drífur lengra en flestir í sínum verðflokki þrátt fyrir að vera með óvenju litla rafhlöðu. Hann er jafnframt meðal þeirra sem hlaða hraðast miðað við verð. Á langferðum milli landshluta þýðir þetta að hleðslustoppin verða afar stutt, jafnvel þótt vetrarkuldinn dragi eitthvað úr drægninni.',
      'Fórnarkostnaðurinn liggur hins vegar í aflinu og gripinu. Hann er bæði aflminni og hægari en flestir í þessum verðflokki, auk þess sem hann er aðeins með afturhjóladrif. Ef fjórhjóladrif í snjó og hálku eða mikil snerpa skipta meira máli gætu bílar eins og Polestar 2 Long Range Performance eða Subaru e-Outback hentað betur.',
      'Þetta er glæsilegur og sparneytinn ferðabíll fyrir þá sem vilja vandaðan lúxusbíl og þurfa ekki endilega á fjórhjóladrifi að halda í hversdagsleikanum.',
    ],
    facts: '710ed58430b1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA 350 4MATIC er rennilegur og fágaður fólksbíll sem leggur mikla áherslu á loftmótstöðu, orkunýtni og öruggan akstur með fjórhjóladrifi. Hann hentar sérstaklega vel þeim sem leggja oft í langferðir og vilja vandaðan lúxusbíl en kjósa lága línu fólksbíls fram yfir hábyggða jepplinga.',
      'Mesti styrkleiki bílsins er hversu langt hann kemst á einni hleðslu. Hann drífur mjög langt og er meðal þeirra langdrægustu miðað við aðra á svipuðu verði, sem léttir verulega á drægnikvíða í íslenskum vetrarkulda. Þegar kemur að ferðalögum milli landshluta er hann einnig meðal þeirra sem hlaða hraðast, og miðað við aðra í sínum verðflokki er hann ódýrastur á hvern kílómetra drægni.',
      'Það sem gefið er eftir er fyrst og fremst heildarafl, en hann er aflminni en flestir bílar á svipuðu verði þótt hann sé alls ekki seinn af stað. Ef þörf er á hærri sætisstöðu og meira plássi væri jeppinn Volvo EX60 P10 vænlegri kostur, eða Audi A6 e-tron Sportback quattro ef meira afl og hlaðbakur henta betur. Fyrir þá sem setja drægni og hleðsluhraða í öndvegi er CLA 350 4MATIC hins vegar einkar sterkur kostur.',
    ],
    facts: '4cb076da8aba',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-cla-shooting-brake-350-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA Shooting Brake 350 4MATIC er straumlínulagaður og sportlegur lúxuslangbakur sem leggur áherslu á mikið rennsli og skilvirkni. Hann er lægri en hefðbundnir jepplingar og höfðar sérstaklega til þeirra sem vilja fágaðan ferðabíl með hagnýtu skotti án þess að fórna aksturseiginleikum fólksbílsins.',
      'Stærsti kostur hans er hve mjög langt hann drífur, enda er hann meðal þeirra langdrægustu í sínum verðflokki. Hann hleður auk þess mjög hratt, sem styttir áningar á langferðum umtalsvert, og fjórhjóladrifið veitir nauðsynlegt öryggi og stöðugleika í íslenskri vetrarfærð og snjó.',
      'Á móti kemur að hann er aflminni en flestir bílar á svipuðu verði, þótt hann sé vissulega snöggur í daglegum akstri. Ef fólk vill meiri kraft og stærri langbak er Audi A6 e-tron Avant quattro til dæmis mun aflmeiri, en þar eru hleðslustoppin á móti um 30% lengri og drægnin töluvert minni.',
      'Þessi CLA hentar frábærlega þeim sem vilja glæsilegan langbak sem nýtir orkuna vel, lágmarkar tímann við hleðslustöðvar og kemst óvenju langt á hverri hleðslu.',
    ],
    facts: 'ef0370bc5c2d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-cla-amg-45-4matic': {
    paragraphs: [
      'Mercedes-Benz CLA AMG 45 4MATIC+ er lágur og rennilegur sportfólksbíll sem er fyrst og fremst hannaður fyrir fólk sem leitar að akstursánægju og miklum kröftum. Þetta er hreinræktaður afkastabíll með AMG-sniði og býður aðeins upp á fjögur sæti, sem gerir hann mun sérhæfðari en hefðbundna fólksbíla.',
      'Hann er sneggstur í sínum verðflokki og fjórhjóladrifið tryggir gott veggrip í snjó og hálku. Bíllinn drífur mjög langt, sem gerir langferðir áhyggjulausar jafnvel í vetrarkulda. Að auki hleður hann hraðar en flestir á svipuðu verði og nýtir orkuna vel, enda kemst hann lengra en flestir keppinautarnir þrátt fyrir minni rafhlöðu.',
      'Helsti ókosturinn er takmarkað notagildi. Hann tekur aðeins fjóra í sæti og er lágur til jarðar. Ef fimm sæti eru nauðsynleg er Volvo ES90 Twin Motor Performance 200.000 kr. ódýrari með sömu drægni, en Porsche Macan 4 Electric kemur sterkur inn ef óskað er eftir meiri veghæð í jepplingi.',
      'Bíllinn hentar þeim sem vilja mikið afl, snarpan akstur og langa drægni, svo lengi sem fjögur sæti duga til.',
    ],
    facts: 'fe5b7900b14e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqa-suv-300-4matic': {
    paragraphs: [
      'Mercedes-Benz EQA SUV 300 4MATIC er nettur lúxusjepplingur sem leggur fyrst og fremst áherslu á fágaðan, hljóðlátan og mjúkan akstur. Hann hentar einkar vel þeim sem vilja gæðatilfinningu og þægindi þýska merkisins í lipurri stærð sem fer vel með fólk í daglegu amstri.',
      'Fjórhjóladrifið kemur sér sérstaklega vel í íslenskri vetrarfærð og tryggir stöðugt grip í snjó og hálku. Vandaður frágangur í innréttingu og góð hljóðeinangrun skapa líka rólegt andrúmsloft sem gerir allan daglegan akstur afslappaðan.',
      'Hins vegar gefur bíllinn töluvert eftir í afköstum. Hann drífur fremur stutt og er bæði aflminni og meðal þeirra sem hlaða hægast miðað við aðra á svipuðu verði. Til dæmis er BMW iX1 xDrive 30 mun sneggri og býður upp á um 20% styttri hleðslustopp á ferðalögum.',
      'EQA höfðar því fyrst og fremst til þeirra sem setja þægindi og lúxusmerki í forgang frekar en hraða eða snögg hleðslustopp á langferðum.',
    ],
    facts: 'b69d33295c87',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-glb-350-4matic-eq': {
    paragraphs: [
      'Mercedes-Benz GLB 350 4MATIC EQ er kassalaga og hagnýtur jepplingur með fjórhjóladrifi sem býður upp á allt að sjö sæti. Hann sameinar lipra stærð í innanbæjarakstri, sveigjanlegt sætarými fyrir stórfjölskylduna og fágað yfirbragð þýskra úrvalsbíla. Hann hentar sérstaklega þeim sem vilja mikið notagildi og öruggt grip í vetrarfærð án þess að þurfa að aka um á tröllvöxnum bíl.',
      'Á langferðum nýtur bíllinn sín einstaklega vel. Miðað við aðra í sínum verðflokki er hann meðal þeirra langdrægustu og hleður hraðar en flestir, sem heldur stoppum á ferðalögum um landið í lágmarki. Hann er einnig ódýrari á hvern kílómetra drægni en flestir á svipuðu verði, enda sleppur hann undir verðþakið og fær fullan ríkisstyrk.',
      'Á móti kemur að kaupverðið er fremur hátt. Ef fjárhagurinn ræður för er Skoda Peaq 90x athyglisverður kostur sem er 800.000 kr. ódýrari og drífur nánast jafn langt, þótt hleðslustoppin verði um 55% lengri.',
      'Fyrir þá sem vilja sjö sæti, afbragðs drægni og lágmarks bið á hraðhleðslustöðvum er GLB 350 afar traustur ferðabíll.',
    ],
    facts: 'd49336def5c3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-glc-300-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 300 4MATIC er fágaður lúxusjepplingur með fjórhjóladrifi sem býður upp á mikla snerpu og mikil akstursþægindi. Hann hentar kröfuhörðum ökumönnum sem leita að rúmgóðum fjölskyldubíl með trausta vetrareiginleika og ríflegt afl við krefjandi aðstæður.',
      'Bíllinn drífur fremur langt, svo drægnin dugar vel á milli landshluta jafnvel í vetrarkulda. Miðað við aðra á svipuðu verði er hann sneggri en flestir og ódýrari á hvern kílómetra drægni. Hann hleður jafnframt fremur hratt á langferðum og fjórhjóladrifið veitir gott grip í snjó og hálku.',
      'Hins vegar er hann með minni rafhlöðu en flestir í sínum verðflokki. Fyrir þá sem horfa frekar í hraðari áfanga á hringveginum er Audi Q6 e-tron Sportback 400.000 kr. ódýrari og með um 10% styttri hleðslustopp, en gefur eftir í hröðun á móti.',
      'GLC 300 4MATIC hentar sérstaklega vel þeim sem vilja fágun og mikil þægindi þar sem snerpa og öruggt aldrif vega þyngst.',
    ],
    facts: 'bb72ff6499e0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-glc-400-4matic': {
    paragraphs: [
      'Mercedes-Benz GLC 400 4MATIC er aflmikill og veglegur lúxusjepplingur með fjórhjóladrifi sem höfðar til þeirra sem vilja háa setstöðu, mikil gæði og traustan akstur við krefjandi íslenskar aðstæður.',
      'Drægnin er með því allra besta miðað við aðra bíla á svipuðu verði og dugar ríkulega í langferðir milli landshluta, jafnvel í vetrarkulda. Að auki hleður hann hraðar en flestir í sínum verðflokki og er sneggri en flestir, sem gerir hann lipran og öruggan í daglegri umferð og á þjóðvegum.',
      'Á móti kemur að hann er í dýrari kantinum. Ef jepplingalag er ekki skilyrði fást fólksbílarnir Mercedes-Benz C 400 4MATIC og Volvo ES90 Twin Motor á svipuðu verði, þar sem C-Class bíllinn drífur aðeins lengra. Sé hins vegar horft til jepplinga býður keppinauturinn BMW iX3 50 xDrive upp á 90 km meiri drægni og um 15% styttri hleðslustopp fyrir lægra verð, þótt GLC sé sneggri í sprettinum.',
      'Fyrir þá sem vilja klassískan Mercedes-Benz lúxus, mikið afl og áhyggjulausa drægni í formi fjórhjóladrifins jepplings er GLC 400 4MATIC sérlega sterkur kostur.',
    ],
    facts: '14347312b37b',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-eqe-suv-350-4matic': {
    paragraphs: [
      'Mercedes-Benz EQE SUV 350 4MATIC er stór og veglegur lúxusjeppi sem leggur áherslu á fágaðan og hljóðlátan akstur, hámarksþægindi og vandað innanrými. Fjórhjóladrifið veitir mikið öryggi í íslenskri vetrarfærð og á hálum vegum. Hann hentar þeim sem leita að rúmgóðum fjölskyldubíl þar sem rósemi og mýkt við stýrið eru í algjörum forgangi.',
      'Drægnin dugar vel til að ferðast milli landshluta, jafnvel í vetrarkulda þegar drægnin dregst saman, og stór rafhlaðan sér til þess að daglegar ferðir ganga áhyggjulaust fyrir sig.',
      'Hins vegar gefur maður töluvert eftir í afköstum. Miðað við aðra í sínum verðflokki er hann meðal þeirra aflminnstu og meðal þeirra sem hlaða hægast. Sá sem vill meiri afköst og styttri ferðatíma fær til dæmis BMW iX xDrive 45 Sport á sama verði, en sá bíll hefur 51 km meiri drægni og er 1,5 s sneggri í 0-100 km/klst.',
      'EQE SUV höfðar fyrst og fremst til þeirra sem setja ómengaðan lúxus og vellíðan í akstri ofar snerpu og tölum á blaði.',
    ],
    facts: '44caa0b259c8',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-eqs-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS 580 4MATIC er lágur og rennilegur lúxusbíll sem hentar þeim sem ferðast mikið og vilja hámarksþægindi. Hann einkennist af mikilli hljóðvist, mýkt og lágri loftmótstöðu sem gerir hann sérsniðinn fyrir afslappaða langkeyrslu.',
      'Helsti kostur bílsins er að hann drífur lengst allra rafbíla og er með stærstu rafhlöðuna. Það þýðir að auðvelt er að aka á milli landshluta í íslenskum vetrarkulda án þess að velta hleðslustoppum fyrir sér. Hann hleður jafnframt mjög hratt, fjórhjóladrifið veitir gott grip í snjó og miðað við aðra á svipuðu verði færðu hér flesta kílómetra fyrir peninginn.',
      'Á móti kemur að bíllinn er lágur og býður ekki upp á veghæð eða yfirsýn hefðbundins jeppa. Ef færðin kallar á meiri hæð undir lægsta punkt væri Range Rover Electric EV450 heppilegri kostur. Ef sportlegur kraftur skiptir meira máli er Porsche Cayenne Turbo mun sneggri og með um 20% styttri hleðslustopp, en gefur þó eftir 246 km í drægni.',
      'EQS er ákjósanlegur fyrir þá sem leita að hágæða ferðabíl sem kemst einfaldlega lengra á íslenskum vegum en nokkur annar á einni hleðslu.',
    ],
    facts: 'ff4f09dbd41a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqs-suv-580-4matic': {
    paragraphs: [
      'Mercedes-Benz EQS SUV 580 4MATIC er risavaxinn og virðulegur lúxusjeppi sem býður upp á allt að sjö sæti og mikil þægindi í akstri. Hann er hannaður eins og fyrsta farrými á hjólum, þar sem hljóðvist og fágun eru í forgangi, og hentar stórfjölskyldum sem gera strangar kröfur um rými og munað.',
      'Bíllinn drífur mjög langt, sem þýðir að ferðalög milli landshluta eru áhyggjulaus jafnvel í vetrarkulda. Fjórhjóladrifið veitir jafnframt mikið öryggi og stöðugt grip í snjó og hálku á veturna.',
      'Á móti kemur að miðað við aðra á svipuðu verði er hann meðal þeirra sem hlaða hægast og jafnframt meðal þeirra aflminnstu. Til dæmis er Volvo EX90 Twin Motor Performance 8.200.000 kr. ódýrari, býður einnig upp á sjö sæti og er 0,5 s sneggri í 0-100 km/klst, þótt hann hafi 55 km minni drægni.',
      'EQS SUV 580 er fyrst og fremst val fyrir þá sem vilja fáguð ferðaþægindi og mikla drægni, og eru tilbúnir að greiða vel fyrir það.',
    ],
    facts: '380eceea0163',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqt-200': {
    paragraphs: [
      'Mercedes-Benz EQT 200 er fjölnotabíll byggður á sendibíl, með rennihurðum, sætum fyrir allt að sjö manns og vandaðri innréttingu en vanalega fylgir bílum af þessari gerð. Hann hentar stórum fjölskyldum í daglegt amstur og skólaakstur í þéttbýli.',
      'Skottið er stærra en hjá flestum á svipuðu verði og hann má draga 1.500 kg, tvöfalt á við Peugeot e-Rifter. Sveigjanlegt sætaskipulag og rennihurðir gera umgengni við aftursætin sérlega þægilega.',
      'Á móti kemur að hann drífur mjög stutt, sérstaklega í vetrarkulda, hleður mjög hægt og er meðal þeirra aflminnstu á svipuðu verði. Peugeot e-Rifter er 1.100.000 kr. ódýrari, drífur 61 km lengra og hleður með um 40% styttri stoppum, og Kia PV5 drífur 130 km lengra fyrir 700.000 kr. meira.',
      'EQT 200 er laglegur og hagnýtur fjölskyldubíll innanbæjar, en stutt drægni og hæg hleðsla gera hann erfiðan sem eina bíl heimilisins.',
    ],
    facts: '5a3138924309',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-eqv-300': {
    paragraphs: [
      'Mercedes-Benz EQV 300 er lúxusfjölnotabíll sem rúmar allt að átta manns og leggur megináherslu á mikil þægindi og veglegt rými. Hann hentar sérstaklega vel stórum fjölskyldum eða fyrirtækjum í fólksflutningum sem þurfa raunveruleg sæti fyrir fullorðna í öllum röðum ásamt fáguðu yfirbragði.',
      'Stærsti kosturinn er innanrýmið sjálft. Hér fær hver einasti farþegi afbragðs höfuð- og fótarými, og jafnvel með fullskipaðan bíl er enn gott pláss eftir fyrir farangur í daglegu lífi.',
      'Á móti kemur að bíllinn drífur mjög stutt og er meðal þeirra sem hlaða hægast í sínum verðflokki. Hann er auk þess framhjóladrifinn og fremur aflítill, sem getur reynst snúið í snjó og hálku. Ef sjö sæti duga er Kia EV9 GT til dæmis 100.000 kr. dýrari en býður upp á fjórhjóladrif, 147 km meiri drægni og um 65% styttri hleðslustopp.',
      'EQV 300 er því einstaklega rúmgóður ferðavagn fyrir stóra hópa í styttri ferðum, en krefst mikillar þolinmæði á langkeyrslu um landið.',
    ],
    facts: '7e1d59a12e8f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-vle-300': {
    paragraphs: [
      'Mercedes-Benz VLE 300 er rúmgóður og lúxusgerður fjölnotabíll sem rúmar allt að átta manns. Hann er sniðinn fyrir stórar fjölskyldur eða fólksflutninga þar sem sætafjöldi og rými skipta öllu. Bíllinn er með mjög stóra rafhlöðu og drífur mjög langt, sem gerir hann að einum langdrægasta bílnum miðað við aðra á svipuðu verði.',
      'Á langferðum skilar þetta sér í miklu öryggi, því drægnin dugar vel á milli landshluta í vetrarkulda. Hann er meðal þeirra ódýrustu á hvern kílómetra drægni í sínum verðflokki, og hleðslustoppin hjá Volvo EX90 Twin Motor eru til dæmis um 45% lengri.',
      'Helsti ókosturinn er að bíllinn er aðeins framhjóladrifinn, auk þess að vera meðal þeirra aflminnstu og hægustu á svipuðu verði. Í snjó, hálku og vetrarfærð gætu fjórhjóladrifnir valkostir eins og Volvo EX90 eða Kia EV9 GT hentað betur. Ef hámarks sætafjöldi og mikil drægni ráða hins vegar för stendur VLE 300 fyllilega fyrir sínu.',
    ],
    facts: '2ef409b18730',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-vle-400-4matic': {
    paragraphs: [
      'Mercedes-Benz VLE 400 4MATIC er gríðarstór lúxusfjölnotabíll sem býður upp á allt að átta sæti. Hann er sniðinn fyrir stórar fjölskyldur og hópferðir þar sem mikil þægindi og mikið innanrými skipta öllu máli.',
      'Hann er með mjög stóra rafhlöðu og drífur mjög langt, eða lengra en flestir miðað við aðra á svipuðu verði. Það veitir mikið öryggi í langferðum milli landshluta, einnig að vetrarlagi. Fjórhjóladrifið tryggir gott veggrip í snjó og hálku, og bíllinn hleður fremur hratt á ferðalögum.',
      'Bíllinn er hins vegar mjög dýr og miðað við aðra í þessum verðflokki er hann hægari en flestir. Ef sjö sæti nægja er Volvo EX90 Twin Motor Performance 2,3 s sneggri í 0-100 km/klst á svipuðu verði, en þar eru hleðslustoppin um 30% lengri. Hyundai IONIQ 9 Long Range Performance AWD býður einnig upp á rúmgott pláss en er 3.300.000 kr. ódýrari.',
      'Fyrir þá sem þurfa átta sæti og vilja mikinn lúxus á löngum leiðum er VLE 400 fágætur en dýr kostur.',
    ],
    facts: '8a6751d961e1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mercedes-benz-g-class-580-eq': {
    paragraphs: [
      'Mercedes-Benz G-class 580 EQ er goðsagnakenndur torfærujaxl sem heldur sínu kassalaga útliti í rafdrifinni útgáfu. Hann er búinn fjórum rafmótorum, einum við hvert hjól, sem veita honum fágætt grip og ótrúlega færni við erfiðustu aðstæður í snjó og á ótroðnum slóðum. Hann hentar þeim sem leita að ekta, grófum jeppa sem sker sig algjörlega úr hópnum og býður upp á ómældan persónuleika.',
      'Afl bílsins er gífurlegt, enda er hann aflmeiri en flestir bílar í sínum verðflokki. Fjórhjóladrifið stýrir átaki á hvert hjól fyrir sig af mikilli nákvæmni, sem kemur sér sérstaklega vel í hálku og vetrarfærð á Íslandi. Há sætisstaðan veitir jafnframt afbragðs útsýni yfir umferðina.',
      'Aftur á móti tekur hið kantaða form sinn toll í mikilli orkunotkun. Drægnin er með því stysta sem gerist á þessu verði og hann hleður hægar en aðrir bílar í sama flokki. Ef lagt er upp úr hefðbundnum lúxus og þægindum á langferðum býður Range Rover Electric EV450 til að mynda upp á 127 km meiri drægni og um 50% styttri hleðslustopp. Fyrir þá sem vilja meiri snerpu er Porsche Cayenne Turbo einnig 2,2 s sneggri í hundraðið.',
      'Þetta er bíll sem enginn velur út frá hagsýni eða tölfræði, heldur hreint lífsstílstæki með ríka sögu og óvenjulega nærveru á veginum.',
    ],
    facts: '8335d9035eab',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mercedes-benz-evito-tourer': {
    paragraphs: [
      'Mercedes-Benz eVito Tourer er rafdrifin smárúta með sæti fyrir allt að níu manns, ætluð þeim sem þurfa fyrst og fremst að flytja marga farþega í senn. Hann byggir á traustum grunni atvinnubíls og leggur áherslu á hagnýtt rými og einfaldleika frekar en fágaðan lúxus.',
      'Stærsti styrkleikinn er gríðarlegt innanrými og sveigjanleiki í sætaskipan, sem fáir aðrir rafbílar bjóða upp á. Rafhlaðan er stór og rafmótorinn gerir bílinn hljóðlátan og lipran í meðförum miðað við stærð, sem nýtist sérstaklega vel í skutlþjónustu eða daglegum innanbæjarakstri.',
      'Hins vegar drífur bíllinn mjög stutt miðað við verð, sérstaklega í íslenskum vetrarkulda, og hann hleður mjög hægt á langferðum. Þá getur framhjóladrif verið ókostur í hálku og snjó á fullhlaðinni smárútu. Fyrir þá sem leita að hagkvæmari kosti er Toyota Proace Verso 3.600.000 kr. ódýrari með svipaða drægni og um 20% styttri hleðslustopp. Ef óskað er eftir fágaðra farþegarými býður Mercedes-Benz EQV 300 meiri lúxus fyrir 900.000 kr. hærra verð.',
      'Bíllinn hentar vel sem vinnuþjarkur fyrir fyrirtæki í hópferðum og innanbæjarakstri, en sem ferðabíll um landið er hann fremur dýr og takmarkaður.',
    ],
    facts: '28e3aa2ba305',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-cyberster-gt': {
    paragraphs: [
      'MG Cyberster GT er tveggja sæta blæjusportbíll sem sker sig rækilega úr á rafbílamarkaðnum. Hann einkennist af lágri byggingu og vængjahurðum sem lyftast upp, og er smíðaður fyrir fólk sem leitar að hreinni skemmtun og akstursupplifun frekar en hversdagslegu flutningstæki.',
      'Hann er mjög snöggur og aflmeiri en flestir bílar á svipuðu verði, enda meðal þeirra allra sneggstu úr kyrrstöðu. Fjórhjóladrifið kemur aflinu niður í malbikið og lágur þyngdarpunktur gerir hann stöðugan og kvikan í beygjum.',
      'Á móti kemur að hann drífur fremur stutt og er meðal þeirra sem hlaða hægast á svipuðu verði, og skottið er eitt það minnsta í sínum verðflokki. Ef fjölskyldan þarf að komast fyrir og langferðir eru á dagskrá er Skoda Enyaq RS 200.000 kr. ódýrari, með fimm sæti, 99 km meiri drægni og um 40% styttri hleðslustopp.',
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
      'Fyrir hefðbundinn innanbæjarakstur fæst hins vegar varla meiri bíll fyrir peninginn.',
    ],
    facts: 'af97992b2a74',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mg4-urban-long-range': {
    paragraphs: [
      'MG MG4 Urban Long Range er framhjóladrifinn fimm sæta hlaðbakur, sniðinn að hagkvæmum daglegum akstri fyrir þá sem vilja komast á nýjan rafbíl fyrir sem minnst.',
      'Hann fær mikið fyrir peninginn: skottið er það stærsta á svipuðu verði, hann er meðal þeirra langdrægustu í sínum verðflokki og ódýrari á hvern kílómetra drægni en flestir. Hann hleður líka hraðar en flestir á svipuðu verði, sem gerir stöku ferðir út á land raunhæfari en á mörgum öðrum ódýrum bílum.',
      'Á móti kemur að hann er hægari en flestir á svipuðu verði og má aðeins draga 500 kg. Leapmotor B05 ProMax kostar 100.000 kr. meira en drífur 66 km lengra og er mun sneggri, þótt skottið sé 232 l minna.',
      'Fyrir þá sem vilja sem mest pláss og drægni fyrir sem minnst er MG4 Urban Long Range skynsamleg kaup.',
    ],
    facts: 'b9c1781d3300',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mg-mgs5-lux': {
    paragraphs: [
      'MG MGS5 LUX er lipur og hagkvæmur fjölskyldubíll sem sker sig úr í sínum verðflokki með afturhjóladrifi og óvænt miklu afli. Hann hentar vel þeim sem vilja þægilegan hversdagsbíl en kunna jafnframt að meta snörp viðbrögð og skemmtilega aksturseiginleika án þess að sprengja fjárhagsáætlunina.',
      'Miðað við aðra bíla á svipuðu verði drífur hann lengra en flestir og hleður hraðar í langferðum. Þá er hann sneggri upp á hundraðið en flestir í sama flokki, sem gerir innkomu á þjóðvegi og framúrakstur mjög áreynslulausan, auk þess að vera ódýrari á hvern kílómetra drægni en flestir sambærilegir bílar.',
      'Á móti kemur að hann er aðeins afturhjóladrifinn, svo gæta þarf að færðinni í verstu vetrartíð á Íslandi. Fyrir þá sem horfa fyrst og fremst í kílómetrafjölda gæti Hyundai IONIQ 3 Long Range hentað betur, en þá er fórnað töluverðu afli og snerpu á móti. Fyrir kaupendur sem leita að miklu afli og góðri drægni á hagstæðu verði reynist MG MGS5 LUX hins vegar afar fýsilegur kostur.',
    ],
    facts: 'de0a607d37b7',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'mg-mgs6-dual-motor': {
    paragraphs: [
      'MG MGS6 Dual Motor er meðalstór jepplingur, 4,7 m á lengd, sem býður fjórhjóladrif og mikið afl á verði sem fáir keppinautar ná. Hann hentar fjölskyldum sem vilja rúmgóðan og kraftmikinn bíl án þess að borga fyrir þekktara merki.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði, og auk 493 l skotts er 102 l framskott undir vélarhlífinni. Hann má draga 1.500 kg, meira en flestir í sínum verðflokki, svo hann ræður vel við kerru eða lítið hjólhýsi.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði, og ábyrgðin á rafhlöðunni er með þeim stystu. Subaru Uncharted býður um 25% styttri hleðslustopp og ári lengri ábyrgð fyrir 100.000 kr. meira, en hann er með 90 l minna skott og minna afl.',
      'Fyrir þá sem vilja mikið af bíl, afli og plássi fyrir peninginn og hlaða mest heima er MGS6 Dual Motor sterkur kostur.',
    ],
    facts: 'f116badf00c6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-aceman-e': {
    paragraphs: [
      'Mini Aceman E er lítill og nettur jepplingur með líflegri hönnun Mini, ætlaður þeim sem vilja persónulegan og lipran bæjarbíl með fimm sætum.',
      'Hann er auðveldur í þröngum stæðum og fremur ódýr, og vandaður frágangur og sérstæð innrétting gera hann eftirminnilegri en flesta smábíla. Hann má líka draga 750 kg, sem Fiat 500e og Fiat 600e á svipuðu verði mega ekki.',
      'Á móti kemur að hann drífur mjög stutt, sérstaklega í vetrarkulda, er meðal þeirra sem hlaða hægast í sínum verðflokki og skottið er eitt það minnsta. Fiat 600e er 100.000 kr. ódýrari, drífur 90 km lengra og hleður með um 30% styttri stoppum.',
      'Aceman E er heillandi bæjarbíll, en síður heppilegur ef ferðast er reglulega milli landshluta.',
    ],
    facts: '7f8e2afc1767',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-countryman-e': {
    paragraphs: [
      'Mini Countryman E er meðalstór jepplingur með framhjóladrifi, stærsti bíll Mini og sá sem hentar fjölskyldum best. Hann sker sig úr fyrir sjarma og vandaða, líflega hönnun merkisins, bæði að utan og innan.',
      'Það sem hann býður umfram keppinautana er fyrst og fremst stíllinn og frágangurinn: hringlaga skjárinn og vönduð efni gera innréttinguna eftirminnilegri en í flestum bílum á svipuðu verði. Í tölunum hefur hann fáa styrkleika.',
      'Á móti kemur að hann drífur styttra, hleður hægar og er hægari en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má aðeins draga 750 kg. Fjórhjóladrifna útfærslan, Mini Countryman SE 4x4, kostar 700.000 kr. meira, en Mercedes-Benz EQA SUV 300 4MATIC fæst með fjórhjóladrifi fyrir 100.000 kr. meira og má draga 1.050 kg meira.',
      'Countryman E höfðar til þeirra sem kaupa með hjartanu og vilja Mini-stílinn, en fyrir peninginn fæst meira annars staðar.',
    ],
    facts: '007a7b244e00',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mini-countryman-se-4x4': {
    paragraphs: [
      'Mini Countryman SE 4x4 er sérstæður og stílhreinn jepplingur með mikinn persónuleika, sem höfðar sérstaklega til þeirra sem vilja skera sig úr og meta frísklegan akstur. Hann heldur í kunnugleg, leikglöð einkenni Mini í hönnun en býður um leið upp á hærri setstöðu og lipurt aðgengi.',
      'Fjórhjóladrifið veitir gott veggrip og öryggi í hálku, snjó og á krefjandi vegum, sem gerir hann að öruggum og skemmtilegum bíl í daglegu amstri allan ársins hring.',
      'Fyrir verðið gefur maður hins vegar talsvert eftir í langdrægni. Hann drífur fremur stutt, hleður hægar en flestir í sínum verðflokki og er meðal þeirra dýrustu á hvern km drægni. Fyrir þá sem horfa í tíð ferðalög á milli landshluta býður BYD Sealion 7 til dæmis upp á 70 km meiri drægni og um 30% styttri hleðslustopp á sama verði. Frændi hans, BMW iX1 xDrive 30, er einnig 400.000 kr. ódýrari og með 36 km meiri drægni.',
      'Þetta er heillandi bíll fyrir þá sem kaupa með hjartanu og vilja sérstöðu og akstursgleði, en tölurnar um drægni og hleðslu vinna ekki með honum.',
    ],
    facts: '81432d844745',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-ariya-base': {
    paragraphs: [
      'Nissan Ariya í þessari útgáfu er rúmgóður fjölskyldujepplingur með framhjóladrifi, þar sem mýkt, hljóðlátur gangur og þægindi eru í fyrirrúmi frekar en sportlegir eiginleikar. Hann hentar einkum þeim sem leita að ljúfum og rólegum ferðabíl í daglegan akstur og hefðbundnar ferðir innan- sem utanbæjar.',
      'Helsti styrkur bílsins er rafhlaðan, sem telst með þeim stærstu í þessum verðflokki. Hún veitir trausta drægni sem dugar vel á milli landshluta án óþarfa áhyggna, jafnvel þegar vetrarkuldinn herðir að. Hann kemur einnig vel út þegar horft er til verðs á hvern kílómetra drægni.',
      'Á móti gefur Ariya mikið eftir í vetrarfærni og hleðsluhraða. Á meðan keppinautarnir á sama verði bjóða fjórhjóladrif er þessi útgáfa aðeins framhjóladrifin og aflminni en flestir í flokknum, sem munar um í snjó og hálku. Bíllinn hleður jafnframt hægar en flestir; hleðslustoppin eru til dæmis um 60% styttri á Hyundai IONIQ 5 og um 55% styttri á Kia EV6, sem báðir eru jafnframt fjórhjóladrifnir.',
      'Fyrir þá sem meta lúxuskennd þægindi og stóra rafhlöðu meira en fjórhjóladrif og hraðar hleðslur er Ariya engu að síður ljúfur ferðafélagi.',
    ],
    facts: 'ebf917d159a6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-ariya-e-4orce': {
    paragraphs: [
      'Nissan Ariya e-4ORCE er rúmgóður og vandaður fjölskyldujepplingur sem leggur áherslu á mýkt, góða hljóðvist og fágaða innréttingu. Hann hentar vel þeim sem leita að þægilegum ferðabíl með e-4ORCE fjórhjóladrifi, sem vinnur fumlaust í hálku og snjó og veitir mikið öryggi á íslenskum vetrarvegum.',
      'Bíllinn kemur með stærri rafhlöðu en flestir á svipuðu verði. Fjöðrunin tekur vel á ójöfnum og innanrýmið er sérlega notalegt, sem gerir daglegan akstur og langkeyrslu afar þægilega.',
      'Aftur á móti drífur hann styttra en flestir í sínum verðflokki og er meðal þeirra sem hlaða hægast. Á langferðum geta stopp við hraðhleðslur því orðið nokkuð langdregin. Hér er BYD Sealion 7 til dæmis mun sneggri með um 40% styttri hleðslustopp, og Subaru e-Outback kemst 30 km lengra á hleðslunni ásamt því að hlaða hraðar.',
      'Ariya er því fyrst og fremst kjörinn fyrir þá sem setja vönduð þægindi og traust vetrardrif ofar hleðsluhraða á ferðalögum milli landshluta.',
    ],
    facts: '703df216d4ab',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'nissan-leaf-standard-range': {
    paragraphs: [
      'Nissan Leaf er lágstemmdur og þrautreyndur hlaðbakur sem hentar einkar vel sem hversdagsbíll í daglegan akstur. Hann reynir ekki að vera hár jepplingur heldur leggur áherslu á einfaldleika og þægindi fyrir þá sem vilja þægilegan rafbíl án óþarfa tildurs.',
      'Helsti styrkur bílsins er hagkvæmnin. Hann er mjög ódýr og drífur lengra en flestir í sínum verðflokki, sem gerir hann sérstaklega ódýran á hvern kílómetra drægni. Í daglegu lífi þýðir þetta að drægnin dugar vandræðalaust í flestar ferðir, jafnvel yfir kaldasta vetrartímann.',
      'Á móti kemur að hann er hægari en flestir á svipuðu verði og hleður fremur hægt. Fyrir þá sem vilja meira afl og ferðast mikið milli landshluta eru bæði Skoda Epiq 55 og Volkswagen ID. Polo sneggri og bjóða upp á um 20% styttri hleðslustopp. Á hinn bóginn krefst BYD Dolphin um 45% lengri hleðslustoppa en Leaf.',
      'Fyrir þá sem vilja lipran og hagkvæman rafbíl í rútínuna, og setja lágt kaupverð og góða drægni ofar snerpu og hraðhleðslugetu, er Leaf áfram afar skynsamlegur kostur.',
    ],
    facts: '0876a4925283',
    model: 'gemini-3.8-flash, thinking high',
  },
  'nissan-leaf-extended-range': {
    paragraphs: [
      'Nissan Leaf Extended Range er lipur og þrautreyndur fjölskyldubíll sem leggur megináherslu á langdrægni og einfaldleika. Hann hentar sérlega vel þeim sem vilja geta sinnt öllum daglegum erindum og skotist milli landshluta án þess að hugsa stöðugt um hleðslustöðvar, jafnvel í íslenskum vetrarkulda.',
      'Stærsti kostur bílsins er hve mikið fæst fyrir peningana. Miðað við aðra á svipuðu verði er hann meðal þeirra langdrægustu og ódýrustu á hvern kílómetra drægni. Hann er einnig meðal þeirra sem hlaða hraðast í sínum verðflokki, sem þýðir styttri hlé þegar ekið er milli landshluta.',
      'Á móti kemur að bíllinn er framhjóladrifinn og í meðallagi hvað varðar afl og hröðun. Þeir sem vilja afturhjóladrif gætu frekar skoðað Mazda 6e Long Range á sama verði, en þá fórnast 70 km drægni og hleðslustoppin verða um 70% lengri.',
      'Fyrir þá sem vilja áreiðanlegan ferðabíl með mikla drægni á hagstæðu verði er Leaf Extended Range eitt skynsamlegasta valið í þessum flokki.',
    ],
    facts: 'd634205f4f90',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-frontera-base': {
    paragraphs: [
      'Opel Frontera er kassalaga og látlaus jepplingur sem sker sig sérstaklega úr með því að bjóða allt að sjö sæti á verði sem telst með því allra lægsta á rafbílamarkaðnum. Hann hentar fyrst og fremst stærri fjölskyldum sem leita að hagnýtum vagni í dagleg innanbæjarverkefni án þess að sprengja fjárhagsáætlunina.',
      'Stærsti styrkur hans felst í því hve mikið notagildi og sætapláss fæst fyrir peninginn. Sem skutlbíll leysir hann skólaakstur og innkaup lipurlega, og kassalaga lagið veitir gott höfuðrými og ágætt útsýni yfir umferðina.',
      'Á móti kemur að kaupandi þarf að sætta sig við miklar málamiðlanir. Frontera er mjög aflítill og hægfara, og rafhlaðan drífur mjög stutt, sérstaklega í íslenskum vetrarkulda. Hraðhleðsla er einnig mjög hæg. Ef fimm sæti duga reynist Kia EV2 Standard Range sneggri, ódýrari og með um 10% styttri hleðslustopp. Ef sjö sæti eru skilyrði kemur Peugeot e-Rifter til greina með meiri drægni, en sá kostar meira en tvær milljónir króna til viðbótar.',
      'Frontera er hagkvæmur og hagnýtur fjölskyldubíll í nærumhverfið, en hann er síður sniðinn fyrir langferðir milli landshluta.',
    ],
    facts: '6966a929a05b',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-grandland-base': {
    paragraphs: [
      'Opel Grandland er rúmgóður og jarðbundinn fjölskyldubíll sem einblínir á þægindi og notagildi frekar en áberandi hönnun eða mikil læti. Hann hentar einkar vel fyrir rólega ökumenn og fjölskyldur sem vilja gott rými í hversdagsleikann og áreiðanlegan ferðafélaga í lengri ferðir.',
      'Stærsti kostur bílsins er hversu vel hann nýtir peningana þegar kemur að drægni, en hann er ódýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Hleðslustoppin eru í meðallagi miðað við sambærilega bíla, sem gerir hefðbundin ferðalög milli landshluta tiltölulega átakalaus.',
      'Það sem maður gefur eftir er fyrst og fremst afl og snerpa, enda er bíllinn meðal þeirra hægustu í sínum verðflokki og aðeins framhjóladrifinn. Fyrir aðeins 100.000 kr. meira býður Peugeot e-3008 Dual Motor upp á fjórhjóladrif og mun snarpari hröðun, sem getur skipt miklu máli í snjó og hálku á íslenskum vegum.',
      'Grandland er skynsamlegur kostur ef hagkvæmni í kílómetrum ræður för, en í ljósi íslenskra vetraraðstæðna er erfitt að líta fram hjá fjórhjóladrifnum valkostum á nánast sama verði.',
    ],
    facts: '10b4052276f8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'opel-grandland-awd': {
    paragraphs: [
      'Opel Grandland AWD er hagnýtur og látlaus fjölskyldujepplingur sem leggur áherslu á hefðbundið notagildi og góð þægindi. Hann hentar einkum þeim sem leita að traustum og auðveldum ferðafélaga í daglegan akstur, án mikils tæknilegs flækjustigs.',
      'Fjórhjóladrifið og aflið eru helsti styrkur bílsins í íslenskum veruleika, enda veita þau öruggt grip í snjó og bleytu. Hröðunin er fyllilega næg til að gera framúrakstur og innkomu á þjóðvegi þægilega og örugga við krefjandi vetraraðstæður.',
      'Aftur á móti er hann með minni rafhlöðu og drífur styttra en flestir miðað við aðra í sínum verðflokki, auk þess sem hann hleður fremur hægt. Fyrir þá sem fara oft í lengri ferðir væri Kia EV6 2025 Long Range AWD mun hagkvæmari kostur, enda býður hann upp á 30 km meiri drægni og um 45% styttri hleðslustopp.',
      'Opel Grandland AWD er því prýðilegur kostur fyrir venjubundinn fjölskylduakstur í vetrarfærð, en krefst meiri þolinmæði þegar lagt er í langferðir.',
    ],
    facts: '52c63660f039',
    model: 'gemini-3.8-flash, thinking high',
  },
  'gwm-ora-3-48-kwh': {
    paragraphs: [
      'GWM Ora 3 er sérstæður smábíll með skemmtilegt retro-útlit sem sker sig vel úr í umferðinni. Hann er fyrst og fremst hannaður sem borgarbíll eða laglegur annar bíll á heimili, lipur í þröngum bílastæðum og þægilegur í allan daglegan skutl innanbæjar.',
      'Helsti styrkur hans er lágt kaupverð og sérstætt útlit, og í hröðun og afli er hann í meðallagi miðað við bíla á svipuðu verði.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst og hlaða hægast í sínum verðflokki, skottið er eitt það minnsta og hann má ekki draga kerru. Kia EV2 Standard Range er 500.000 kr. ódýrari, hleður með um 35% styttri stoppum, er með 134 l stærra skott og má draga 750 kg.',
      'Ora 3 er því skemmtilegur kostur fyrir þá sem leita að ódýrum og sérviskulegum bíl í bæjarakstur og hlaða heima, en síður sniðinn fyrir miklar langferðir.',
    ],
    facts: 'a6c48a654251',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'peugeot-e-2008-54-kwh': {
    paragraphs: [
      'Peugeot e-2008 er nettur borgarjepplingur með sérstakan franskan svip og hærri sætisstöðu sem veitir gott útsýni yfir umferðina. Hann hentar einkum þeim sem vilja lipran og þægilegan bíl í daglegt skutl og innanbæjarakstur, þar sem auðvelt er að athafna sig á þröngum götum og í bílastæðum.',
      'Þótt bíllinn hlaði fremur hægt, hleður hann hraðar en flestir miðað við aðra á svipuðu verði. Hleðslustoppin á ferðalögum eru því styttri en hjá helstu keppinautum, sem kemur sér vel þegar farið er á milli landshluta. Hann er líka mjög ódýr í innkaupum.',
      'Á móti kemur að hann drífur fremur stutt, og styttra en flestir í sínum verðflokki, sem reynir enn frekar á í íslenskum vetrarkulda. Hann er jafnframt mjög aflítill og meðal þeirra hægustu miðað við verð. Kia EV3 Standard Range býður til dæmis upp á 24 km meiri drægni fyrir svipað verð, og Leapmotor C10 Pro er 150.000 kr. ódýrari. Fyrir þá sem setja lipurð og styttri hleðslustopp ofar miklu afli og langdrægni er e-2008 fyllilega athugunarverður.',
    ],
    facts: 'ba54c05cafa1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-3008-base': {
    paragraphs: [
      'Peugeot e-3008 er rennilegur og þægilegur fjölskyldujepplingur með áberandi hönnun sem höfðar sérstaklega til þeirra sem vilja stílhreinan bíl í daglegan akstur. Hann er framhjóladrifinn og leggur meiri áherslu á ljúfa aksturseiginleika og þægindi en mikil afköst eða torfærutakta.',
      'Stærsti kostur bílsins er hversu vel hann nýtir verðið í drægni, en hann drífur lengra en flestir bílar í sínum verðflokki og er ódýrari á hvern kílómetra drægni en gengur og gerist. Íslenskur vetrarkuldi mun vissulega bíta af drægninni, en hún dugar samt prýðilega í lengri ferðalög milli landshluta án stöðugra áhyggna af hleðslu.',
      'Helsti gallinn er að hann hleður hægar en flestir miðað við verð og er fremur aflítill. Fyrir þá sem vilja fjórhjóladrif í snjó og hálku er Skoda Elroq 85x sterkur keppinautur á svipuðu verði, en hann býður auk þess upp á 45 km meiri drægni og um 30% styttri hleðslustopp á langferðum.',
      'Fyrir kaupendur sem meta hönnun og góða drægni á hagstæðu verði fram yfir fjórhjóladrif og hraðar hleðslur er Peugeot e-3008 afar fýsilegur kostur.',
    ],
    facts: 'ce16f004dc74',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-3008-dual-motor': {
    paragraphs: [
      'Peugeot e-3008 Dual Motor er meðalstór jepplingur með fjórhjóladrifi og djörfu útliti, með sérstæðu ökumannsrými, litlu stýri og bogadregnum skjá. Hann höfðar til þeirra sem vilja þægilegan og hljóðlátan fjölskyldubíl sem sker sig úr.',
      'Hann drífur lengra en flestir á svipuðu verði, er aflmeiri en flestir þeirra og skottið er stærra en hjá flestum í hans verðflokki.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði. XPENG G6 AWD Performance kostar það sama en hleður með um 45% styttri stoppum og er mun sneggri. Þurfi ekki fjórhjóladrif fæst framhjóladrifinn Peugeot e-3008 fyrir 520.000 kr. minna, með sömu drægni.',
      'e-3008 Dual Motor er álitlegur kostur fyrir þá sem meta drægni, rými og franska hönnun ofar hraðri hleðslu.',
    ],
    facts: '692bae7c8a08',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-5008-base': {
    paragraphs: [
      'Peugeot e-5008 er stór og rúmgóður sjö sæta fjölskyldujepplingur sem höfðar sérstaklega til þeirra sem þurfa mörg sæti á viðráðanlegu verði. Hann býður upp á klassískt jepplingasnið frekar en kassalaga sendibílalag, sem gerir hann að eigulegum kosti fyrir stærri fjölskyldur.',
      'Stærsti kostur bílsins er hve mikið pláss og notagildi fæst fyrir peninginn. Drægnin er í meðallagi en dugar vel í flestan daglegan akstur og hefðbundnar ferðir milli landshluta, og bíllinn er á hagstæðu verði miðað við aðra rafbíla sem rúma sjö manns.',
      'Á móti kemur að hann er aðeins framhjóladrifinn, er meðal þeirra hægustu í hröðun og hleður hægar en flestir bílar á svipuðu verði. Ef fjórhjóladrif í vetrarfærð og betri ferðaeiginleikar vega þyngra gæti Skoda Peaq 90x hentað betur, með um 35% styttri hleðslustopp og 111 km meiri drægni, þótt hann sé 1.400.000 kr. dýrari.',
      'Peugeot e-5008 er sérlega skynsamlegur kostur fyrir barnmargar fjölskyldur sem vilja hámarka sætafjölda og rými án þess að sprengja kostnaðaráætlunina.',
    ],
    facts: 'b47a6957b868',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-5008-dual-motor': {
    paragraphs: [
      'Peugeot e-5008 Dual Motor er rúmgóður sjö sæta fjölskyldujepplingur með fjórhjóladrifi. Hann höfðar sérstaklega til stærri fjölskyldna sem vilja fólksbílaþægindi og fágað jepplingaútlit frekar en sendibílalag, ásamt góðri yfirsýn og sveigjanlegu rými.',
      'Fjórhjóladrifið er helsti styrkur bílsins í daglegri notkun og tryggir öruggt grip í snjó, hálku og íslenskri vetrarfærð. Bíllinn ræður vel við fullan hóp af farþegum og reynist afar lipur í daglegu skutli innanbæjar.',
      'Á móti kemur að bíllinn hleður fremur hægt og drífur styttra en flestir á svipuðu verði, sérstaklega í vetrarkulda þar sem rafhlaðan er fremur lítil miðað við stærð hans. Fyrir þá sem aka reglulega langar vegalengdir milli landshluta gæti Skoda Peaq 90x hentað betur, enda býður hann upp á 140 km meiri drægni og um 40% styttri hleðslustopp.',
      'Peugeot e-5008 er því ákjósanlegur fyrir fjölskyldufólk sem þarf sjö sæti og gott grip í hversdagsleikanum, svo lengi sem bíllinn er ekki hugsaður sem langferðabíll hringinn í kringum landið.',
    ],
    facts: '63f008fe944a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-rifter-base': {
    paragraphs: [
      'Peugeot e-Rifter er hár og kassalaga fjölnotabíll, byggður á sendibíl, með rennihurðum og plássi fyrir allt að sjö manns. Hann leggur áherslu á rými og notagildi frekar en þægindi og hentar stórum fjölskyldum í daglegu amstri.',
      'Farangursrýmið er með því stærsta í sínum verðflokki og hann er fremur ódýr. Hann kostar 1.300.000 kr. minna en hinn nánast eins Toyota Proace City Verso, sem er byggður á sama grunni og drífur álíka langt.',
      'Á móti kemur að hann drífur mjög stutt, hleður mjög hægt og er mjög aflítill, svo hann hentar illa til langferða. Peugeot e-5008 er 980.000 kr. dýrari en drífur 159 km lengra, með 141 l stærra skott, og má draga 250 kg meira.',
      'Fyrir þá sem þurfa ódýran og rúmgóðan bíl fyrir marga í nærumhverfinu vinnur e-Rifter verkið vel.',
    ],
    facts: '1f5530953756',
    model: 'gemini-3.8-flash, thinking high',
  },
  'peugeot-e-traveller-base': {
    paragraphs: [
      'Peugeot e-Traveller er stór níu sæta rafdrifinn fjölnotabíll sem er sniðinn að stórum fjölskyldum, hópferðum eða skutli í þéttbýli. Hann leggur áherslu á mikið rými fyrir farþega og farangur fremur en snerpu, en er í grunninn byggður á sendibíl og ber þess merki í akstri.',
      'Helsti kostur bílsins er hversu mörgum hann kemur fyrir á hagstæðara verði en gengur og gerist með stóra rafbíla. Hann rennur hljóðlega um göturnar og hentar vel í daglegan akstur innanbæjar eða á milli nærliggjandi bæjarfélaga, þar sem auðvelt er að hlaða hann yfir nótt heima eða á starfsstöð.',
      'Á móti kemur að bíllinn er mjög aflítill og drífur mjög stutt, sérstaklega í íslenskum vetrarkulda með fullskipaðan bíl. Hann hleður mjög hægt og er aðeins framhjóladrifinn, sem getur reynt á í snjó og hálku. Fyrir þá sem vilja liðugri ferðir á þjóðveginum gæti Hyundai STARIA Electric hentað betur, enda er hann 1.300.000 kr. ódýrari og með um 45% styttri hleðslustopp.',
      'Peugeot e-Traveller leysir fólksflutninga í þéttbýli prýðilega, en krefst mikillar þolinmæði ef lagt er í langferðir á milli landshluta.',
    ],
    facts: '579ac6ea3486',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-2-long-range-dual-motor': {
    paragraphs: [
      'Polestar 2 er lágur og sportlegur fimm dyra bíll með skandinavískum gæðablæ sem hentar sérstaklega þeim sem vilja snerpu og góða aksturseiginleika frekar en hefðbundinn jeppling. Fjórhjóladrifið veitir mikið öryggi í hálku og snjó og bíllinn liggur mjög þétt á vegi í öllum aðstæðum.',
      'Hann drífur fremur langt og hleður fremur hratt, svo langferðir í vetrarkulda ganga vel. Miðað við aðra á svipuðu verði er hann sneggri og aflmeiri en flestir og hefur stærri rafhlöðu. Þetta skilar sér í liprum framúrakstri á þjóðvegum og bíllinn er ódýrari á hvern kílómetra drægni en flestir.',
      'Á móti kemur að farangursrýmið og aftursætin eru fremur þröng. Þeir sem þurfa meira pláss fyrir fjölskyldu og farangur gætu frekar horft til Tesla Model Y Premium Long Range, þótt hún sé 40.000 kr. dýrari og 1,1 s hægari í 0-100 km/klst.',
      'Þetta er heppilegur kostur fyrir þá sem setja akstursánægju, afl og öryggi í vetrarfærð fram yfir hámarks pláss.',
    ],
    facts: 'ea9b46c810bb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-2-long-range-performance': {
    paragraphs: [
      'Polestar 2 Long Range Performance er lágur, stallbakskenndur fólksbíll með stílhreina norræna hönnun, stinna fjöðrun og mikla áherslu á sportlega aksturseiginleika. Hann hentar sérstaklega vel ökumönnum sem vilja mikið afl, snögg viðbrögð og góða tilfinningu fyrir veginum frekar en hefðbundinn, hærri fjölskyldubíl.',
      'Fjórhjóladrifið kemur sér sérlega vel í íslenskri vetrarfærð og veitir mikið öryggi í hálku og snjó. Bíllinn drífur fremur langt, sem dugar prýðilega milli landshluta jafnvel í vetrarkulda, og miðað við aðra í sínum verðflokki hleður hann hraðar en flestir þegar komið er á hraðhleðslustöðvar.',
      'Á móti kemur að maður fórnar hárri setstöðu og því aukna rými sem jepplingar á borð við Toyota bZ4X bjóða upp á. Ef hleðslutími á langferðum vegur þyngst bjóða bæði Mercedes-Benz CLA 200 og Hongqi EHS7 Premium upp á um 25% styttri hleðslustopp.',
      'Fyrir þá sem vilja öflugan og akstursglaðan bíl með traustu aldrifi á þessu verði er þessi útgáfa af Polestar 2 engu að síður mjög álitlegur kostur.',
    ],
    facts: '5d18326da1a8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-3-base': {
    paragraphs: [
      'Polestar 3 er stór og sportlegur lúxusjepplingur með áberandi skandinavískt yfirbragð. Hann höfðar einkum til þeirra sem vilja kraftmikinn og stöðugan bíl sem sameinar fágaða hönnun og mikið öryggi í hvers kyns færð.',
      'Rafhlaðan er með þeim allra stærstu og tryggir að hann drífur lengra en flestir á svipuðu verði. Það munar miklu í íslenskum vetraraðstæðum og á löngum ferðalögum milli landshluta. Að auki er hann aflmeiri en flestir í sínum verðflokki, sem ásamt fjórhjóladrifinu veitir traustan akstur í snjó og hálku.',
      'Helsti ókosturinn er að hann hleður hægar en flestir bílar á þessu verði. Ef hraðari viðkoma á hleðslustöðvum skiptir mestu máli býður Volvo ES90 Twin Motor upp á um 35% styttri hleðslustopp og 51 km meiri drægni á sama verði. Á móti kemur að Polestar 3 býður fjórhjóladrif og talsvert meira afl en keppinautar á borð við BMW i5 eDrive40 og Lexus RZ 350e.',
      'Fyrir þá sem leita að kraftmiklum og langdrægum fjórhjóladrifsbíl með mikið sjálfstæði í útliti er Polestar 3 afar heillandi kostur.',
    ],
    facts: '607b219a4925',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-3-performance': {
    paragraphs: [
      'Polestar 3 Performance er stór og kraftmikill lúxusjeppi sem sameinar norræna fágun og áberandi sportlegan karakter. Hann er sniðinn að þeim sem leita að rúmgóðum fjölskyldubíl með háa sætisstöðu en vilja jafnframt framúrskarandi veggrip, mikið öryggi í hálku og snjó og aksturseiginleika sem minna meira á sportbíl en hefðbundinn jeppa.',
      'Helsti styrkur bílsins liggur í miklu afli og gríðarstórri rafhlöðu, sem er með þeim allra stærstu í þessum verðflokki. Fjórhjóladrifið og aflið gera hann sneggri en flestir aðrir á svipuðu verði, sem skilar sér í miklu öryggi við framúrakstur og áreynslulausum akstri við hvaða aðstæður sem er.',
      'Á móti kemur að hann er eyðslufrekur og drífur styttra en flestir bílar á svipuðu verði miðað við rafhlöðustærð. Hann hleður einnig hægar en keppinautarnir, svo hleðslustopp á langferðum verða lengri. Ef hröð hleðsla og meiri drægni skipta höfuðmáli væri Porsche Macan 4 Electric til dæmis vænlegri kostur, með um 40% styttri hleðslustoppum.',
      'Polestar 3 Performance hentar þeim fullkomlega sem vilja stóran, sérlega aflmikinn og hönnunardrifinn jeppa og eru tilbúnir að gefa aðeins eftir í hleðsluhraða á ferðalögum.',
    ],
    facts: '60945870f6fe',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'polestar-4-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 Long Range Dual Motor er lágur og sportlegur lúxusjepplingur með sérstæða hönnun, þar sem hefðbundinni afturrúðu er sleppt fyrir stafrænan bakspegil. Hann sameinar skandinavíska fágun og mikil afköst, og hentar ökumönnum sem leita að vönduðum bíl sem sker sig rækilega úr hópnum.',
      'Helsti styrkur hans felst í stórri rafhlöðu og drægni sem er með því lengsta í þessum verðflokki, sem kemur sér vel í langferðum og íslenskum vetrarkulda. Fjórhjóladrifið veitir öruggt grip í hálku og snjó, og bíllinn er meðal þeirra allra sneggstu og aflmestu á veginum.',
      'Á móti er hraðhleðslan aðeins í meðallagi, svo reikna má með lengri viðdvöl við hraðhleðslustöðvar til að fylla stóru rafhlöðuna. Ef snörp stopp skipta miklu máli er Smart #5 Brabus með um 35% styttri hleðslustopp, á meðan Tesla Model Y Performance er 160.000 kr. ódýrari með örlítið meira afl.',
      'Þetta er heillandi valkostur fyrir þá sem vilja mikla drægni, afl og sérkenni, svo lengi sem hóflegur hleðsluhraði kemur ekki að sök.',
    ],
    facts: '4b106d0d549a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'polestar-4-suv-long-range-dual-motor': {
    paragraphs: [
      'Polestar 4 er lágur og rennilegur jepplingur með sérstæða hönnun sem sker sig úr, ekki síst fyrir þær sakir að vera án hefðbundinnar afturrúðu. Hann hentar þeim sem leita að miklu afli, fáguðum skandinavískum stíl og sportlegri akstursupplifun frekar en hefðbundnu fjölskyldusniði.',
      'Bíllinn er mjög aflmikill og meðal þeirra sneggstu miðað við aðra á svipuðu verði, sem gerir allan framúrakstur áreynslulausan. Fjórhjóladrifið veitir traust grip í íslenskri vetrarfærð, og með einni af stærstu rafhlöðunum í sínum verðflokki drífur hann lengra en flestir. Það kemur sér vel í lengri ferðum milli landshluta.',
      'Þótt hann hlaði fremur hratt er hleðslan í meðallagi miðað við bíla á svipuðu verði. BMW iX3 40 býður til dæmis upp á um 35% styttri hleðslustopp, en sá er á móti aðeins með afturhjóladrif. Ef hefðbundið pláss skiptir meira máli gæti Volkswagen ID.7 GTX hentað betur.',
      'Polestar 4 er heillandi kostur fyrir þá sem setja akstursánægju, mikinn kraft og áberandi hönnun í fyrsta sæti.',
    ],
    facts: '625d0a4115d4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-macan-4-electric': {
    paragraphs: [
      'Porsche Macan 4 Electric er lúxussportjepplingur sem ber með sér rótgróna aksturseiginleika Porsche og lipra hegðun á vegi. Fjórhjóladrifið veitir mikið öryggi í snjó og hálku, og bíllinn hentar vel þeim sem vilja vandaðan og þægilegan bíl án þess að fórna akstursánægjunni.',
      'Bíllinn drífur fremur langt og dugar léttilega á milli landshluta. Helsti kostur hans kemur fram á langferðum, því miðað við aðra bíla á svipuðu verði hleður hann hraðar en flestir. Stoppin við hraðhleðslustöðvar verða því óvenju snörp í ferðalögum um landið.',
      'Það sem maður gefur eftir er að hröðun og afl eru aðeins í meðallagi miðað við verðflokkinn. Hér gæti BMW i4 M60 xDrive hentað betur þeim sem sækjast eftir sneggri hröðun og meiri krafti, þótt hleðslustoppin séu um 50% lengri hjá honum.',
      'Macan 4 er heildstæður og fágaður kostur sem leggur áherslu á lúxus og hraðvirka hleðslu fram yfir tæran spyrnukraft.',
    ],
    facts: 'b4b49ee67080',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-macan-4s-electric': {
    paragraphs: [
      'Porsche Macan 4S Electric er kraftmikill sportjepplingur sem færir skarpa aksturseiginleika merkisins yfir í rafmagnsform. Hann hentar þeim sem vilja nákvæma stýringu og mikið afl en sækjast jafnframt eftir hagnýtum jepplingi með hárri setustöðu.',
      'Fjórhjóladrifið veitir traust grip í vetrarfærð og bíllinn er meðal þeirra sneggstu í sínum verðflokki. Hann drífur fremur langt og hleður hraðar en flestir bílar á svipuðu verði, sem skilar sér í sérlega stuttum hleðslustoppum á lengri ferðalögum milli landshluta.',
      'Bíllinn er þó mjög dýr og drægnin aðeins í meðallagi miðað við verð. Sé leitað að meiri drægni fæst hún í Porsche Taycan Plus, sem býður auk þess upp á um 30% styttri hleðslustopp en er lágur fólksbíll með afturhjóladrifi. BMW iX xDrive 45 Sport er 460.000 kr. ódýrari og leggur meiri áherslu á hefðbundin mýktarþægindi, en tekur um 65% lengri hleðslustopp og er talsvert aflminni.',
      'Macan 4S stendur upp úr fyrir akstursánægju og lipra hleðslu á langferðum, svo lengi sem verðmiðinn fælir fólk ekki frá.',
    ],
    facts: '64e6a92aa4e6',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-plus': {
    paragraphs: [
      'Porsche Taycan Plus er lágreistur lúxussportbíll sem leggur áherslu á lipran akstur og rómuð gæði Porsche. Hann hentar ökumönnum sem vilja nákvæmt veggrip, mikil þægindi og lifandi tilfinningu í stýri frekar en háa sætisstöðu í hefðbundnum jepplingi.',
      'Helsti styrkur bílsins er ferðagetan. Hann drífur mjög langt og lengra en flestir á svipuðu verði, auk þess sem hann er meðal þeirra sem hlaða hraðast. Það gerir langferðir milli landshluta þægilegar þar sem hleðslustoppin verða afar stutt. Miðað við aðra í sínum verðflokki er hann líka ódýrari á hvern kílómetra drægni en flestir.',
      'Helsti gallinn við íslenskar aðstæður er að bíllinn er aðeins með afturhjóladrifi og liggur lágt. Fyrir fannfergi, ófærð og meira pláss væri fjórhjóladrifinn jepplingur eins og Porsche Macan 4s Electric eða BMW iX xDrive 45 Sport heppilegri kostur. Vanti meiri hröðun og aldrif á lægra verði kemur Mercedes-Benz CLA AMG 45 4MATIC+ einnig sterklega til greina.',
      'Taycan Plus hittir beint í mark hjá þeim sem leita að sportlegum langferðabíl með mikla drægni, svo lengi sem afturhjóladrifið dugar til í vetrarfærðinni.',
    ],
    facts: 'a72a8541bd98',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4-plus': {
    paragraphs: [
      'Porsche Taycan 4 Plus er lágur og rennilegur lúxusfólksbíll með fjórhjóladrifi, sem leggur áherslu á nákvæma stýringu og akstursánægju á malbiki. Hann hentar þeim sem vilja ekta Porsche í daglegum akstri og á langferðum.',
      'Hann drífur lengra en flestir á svipuðu verði og er meðal þeirra sem hlaða hraðast, svo hleðslustopp utan bæjarins verða sérlega stutt. Auk skottsins er 84 l framskott undir vélarhlífinni.',
      'Á móti kemur að skottið er eitt það minnsta í sínum verðflokki og hann má ekki draga kerru. Porsche Cayenne kostar það sama, drífur álíka langt og hleður jafn hratt, en er með 374 l stærra skott og má draga allt að 3.000 kg.',
      'Taycan 4 Plus er fyrir þá sem vilja sportbíl sem fer vel með langferðir, frekar en jepparými.',
    ],
    facts: 'dda528e0d78f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4s-plus': {
    paragraphs: [
      'Porsche Taycan 4S Plus er lágur sportlegur fólksbíll sem leggur áherslu á kraft, lipurð og vönduð vinnubrögð. Hann situr þétt við veginn og býður upp á mikla akstursánægju, sem höfðar fyrst og fremst til þeirra sem vilja ósvikinn sportbíl frekar en hefðbundinn hversdagsbíl.',
      'Afl er eitt helsta aðalsmerki hans en hann er sneggstur bíla í sínum verðflokki og fjórhjóladrifið kemur sér sérlega vel í vetrarfærð og hálku. Hann hleður mjög hratt á langferðum sem styttir ferðatímann milli landshluta, jafnvel þótt drægnin sé styttri en hjá flestum öðrum bílum á svipuðu verði.',
      'Á móti kemur að veghæðin er lítil og farangursrýmið takmarkaðra en í jeppum. Ef þörf er á hærri sætisstöðu, meira rými og lengri drægni gæti Porsche Cayenne S hentað betur með um 15% styttri hleðslustoppum, þótt hann kosti milljón krónum meira. Audi SQ6 e-tron býður einnig upp á meira hagnýtt pláss og meiri drægni á tveimur milljónum króna lægra verði.',
      'Porsche Taycan 4S Plus er fyrst og fremst bíll fyrir þá sem setja akstursupplifun og hraða í fyrsta sæti og geta sætt sig við minna pláss.',
    ],
    facts: '3f13c5d34759',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-taycan-4-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4 Cross Turismo er sportlegur og hlaðbakskenndur lúxusbíll sem sker sig verulega úr frá hefðbundnum jeppum með lágri línu og mikilli akstursánægju. Hann er búinn loftpúðafjöðrun og fjórhjóladrifi sem gefa honum aukna veghæð og getu á ójöfnum vegum, og hentar ökumönnum sem vilja nákvæmt veghald og stöðugleika í bland við hagnýtt skutbílsrými.',
      'Hann hleður mjög hratt og tekur við orku hraðar en flestir bílar í sínum verðflokki. Í daglegu lífi og sérstaklega á langferðum um landið þýðir þetta að hleðslustoppin verða sérlega stutt. Hann drífur fremur langt og dugar vel á milli landshluta, jafnvel þótt vetrarkuldinn taki sinn toll, og drifið vinnur vel í snjó og hálku.',
      'Á móti kemur að bíllinn er mjög dýr og miðað við aðra á svipuðu verði er hann aflminni en flestir. Ef meira farangursrými og hærri setstaða skipta máli er BMW iX xDrive 60 Sport 660.000 kr. ódýrari og býður upp á 88 km meiri drægni, þótt hleðslustoppin séu um 90% lengri. Audi SQ6 e-tron er sömuleiðis 960.000 kr. ódýrari og sneggri í hundraðið.',
      'Taycan 4 Cross Turismo er frábær kostur fyrir þá sem setja fágaðan sportbílaakstur og hraða hleðslu í forgang og vilja sneiða hjá hefðbundnum jeppum.',
    ],
    facts: '2c42b54ca231',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-taycan-4s-cross-turismo': {
    paragraphs: [
      'Porsche Taycan 4S Cross Turismo er lúxusskutbíll með ögn hækkaðri fjöðrun og fjórhjóladrifi, sem sameinar aksturseiginleika sportbíls og rými skutbíls. Hann hentar þeim sem vilja mikla akstursánægju allt árið án þess að fara yfir í jeppa.',
      'Hann er aflmeiri og sneggri en flestir á svipuðu verði og hleður hraðar en flestir í sínum verðflokki, svo hleðslustoppin á langferðum eru stutt. Auk skottsins er 84 l framskott undir vélarhlífinni.',
      'Á móti kemur að hann drífur styttra en flestir á svipuðu verði, skottið er minna en hjá flestum þeirra og hann má ekki draga kerru. Porsche Cayenne S kostar það sama en drífur 43 km lengra, er með 335 l stærra skott og má draga allt að 3.000 kg.',
      'Taycan 4S Cross Turismo er fyrir þá sem setja akstursupplifunina ofar plássi og dráttargetu.',
    ],
    facts: '088728deac3c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-cayenne-base': {
    paragraphs: [
      'Porsche Cayenne er stór lúxusjeppi með fjórhjóladrifi sem sameinar rými og notagildi fjölskyldujeppa og rómaða aksturseiginleika Porsche. Hann hentar þeim sem vilja ferðabíl í hæsta gæðaflokki sem ræður jafnt við langferðir og þungan drátt.',
      'Hann drífur lengra en flestir á svipuðu verði og er meðal þeirra sem hlaða hraðast, svo hleðslustopp á langferðum verða fá og stutt. Skottið er stærra en hjá flestum í hans verðflokki, 90 l framskott bætist við og hann má draga 3.000 kg, meira en flestir á svipuðu verði.',
      'Á móti kemur að hann er mjög dýr og hægari en flestir á svipuðu verði, þótt hann sé langt frá því að vera seinn. Sú snerpa fæst í Porsche Cayenne S fyrir 3.000.000 kr. meira, með sama skottinu og álíka drægni.',
      'Grunngerð Cayenne er sú hagnýtasta í línunni og fyrir flesta sú skynsamlegasta: hún gefur lítið eftir nema í snerpu.',
    ],
    facts: 'f692ce51b5b3',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'porsche-cayenne-coupe': {
    paragraphs: [
      'Porsche Cayenne Coupé er stór lúxusjeppi með rennilegri, aflíðandi þaklínu og sportlegum aksturseiginleikum Porsche. Hann hentar þeim sem vilja notagildi jeppa en sportlegra útlit en í hefðbundnum Cayenne.',
      'Hann má draga 3.500 kg, mest allra bíla á listanum, og drífur lengra og hleður hraðar en flestir á svipuðu verði, svo hleðslustoppin á langferðum eru fá og stutt. Skottið er stærra en hjá flestum í hans verðflokki og 90 l framskott bætist við.',
      'Á móti kemur að hann er mjög dýr og hægari en flestir á svipuðu verði. Porsche Cayenne er 500.000 kr. ódýrari, með 247 l stærra skott, en má draga 500 kg minna.',
      'Cayenne Coupé er fyrir þá sem vilja Cayenne með sportlegra lagi, og fá mestu dráttargetuna á listanum í kaupbæti.',
    ],
    facts: '89d7d6d210cb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-s': {
    paragraphs: [
      'Porsche Cayenne S er stór og kraftmikill lúxusjeppi sem sameinar hefðbundna sportbílaeiginleika Porsche og þægindi hárrar setustöðu. Hann hentar þeim sem leita að mikilli akstursánægju og afli í rúmgóðum bíl, en þurfa jafnframt traust fjórhjóladrif sem veitir mikið öryggi í krefjandi vetrarfærð á Íslandi.',
      'Bíllinn drífur mjög langt og kemst lengra en flestir í sínum verðflokki, sem kemur í veg fyrir drægnikvíða á milli landshluta í vetrarkulda. Þegar komið er að hraðhleðslustöð er hann meðal þeirra allra fljótustu að hlaða. Að auki er hann mjög aflmikill og sneggri í sprettinum en flestir jafndýrir bílar, sem skilar sér í ótrúlegu viðbragði og lipurð.',
      'Á móti kemur að bíllinn er mjög dýr og dýrari á hvern kílómetra drægni en flestir aðrir á svipuðu verði. Ef meiri drægni og hagstæðara verð skipta meira máli gæti BMW iX xDrive 60 Sport hentað betur, enda er hann 2.700.000 kr. ódýrari og drífur 48 km lengra, þótt hleðslustoppin verði þar um 105% lengri.',
      'Fyrir þá sem vilja ósvikinn lúxusjeppa með gríðarlegt afl og afar stutt hleðslustopp er Cayenne S áhrifamikill kostur ef pyngjan leyfir.',
    ],
    facts: '4eac3f04344a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-s-coupe': {
    paragraphs: [
      'Porsche Cayenne S Coupé er stór og kraftmikill lúxusjeppi með sportlegu coupé-lagi. Hann hentar þeim sem leita að akstursánægju Porsche en vilja jafnframt hærri sætisstöðu, gott útsýni og öflugt fjórhjóladrif sem ræður léttilega við krefjandi íslenskar vetraraðstæður.',
      'Bíllinn drífur mjög langt, sem gerir langkeyrslur milli landshluta áhyggjulausar á öllum árstíðum. Á ferðalögum hleður hann hraðast bíla í sínum verðflokki, þannig að viðkomur á hleðslustöðvum verða í algjöru lágmarki. Þá er hann sneggri en flestir miðað við aðra á svipuðu verði og meðal þeirra aflmestu, sem veitir mikið öryggi við framúrakstur.',
      'Á móti kemur að bíllinn er mjög dýr. Sá sem leitar að rúmgóðum jeppa gæti frekar horft til BMW iX xDrive 60 Sport, sem er 3.200.000 kr. ódýrari og býður upp á 31 km meiri drægni, þótt hleðslustoppin séu um 110% lengri. Fyrir þá sem vilja frekar lágan sportbíl er Porsche Taycan 4s Cross Turismo 500.000 kr. ódýrari kostur.',
      'Þetta er glæsilegur bíll fyrir kröfuharða ökumenn sem vilja mikinn kraft og stystu hleðslustoppin á langferðum, svo lengi sem verðmiðinn stendur ekki í vegi.',
    ],
    facts: '7d546273af52',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-turbo': {
    paragraphs: [
      'Porsche Cayenne Turbo er stór og geysilega aflmikill lúxusjeppi, meðal sneggstu bíla á listanum, sem sameinar sportbílaakstur og notagildi stórs fimm sæta jeppa.',
      'Hann er ekki bara snöggur: skottið er það stærsta á svipuðu verði, 90 l framskott bætist við og hann má draga 3.000 kg, meira en flestir í sínum verðflokki. Hann hleður líka hraðar en flestir á svipuðu verði, svo hleðslustoppin á langferðum eru stutt.',
      'Á móti kemur verðið, enda er hann mjög dýr, og drægnin er aðeins í meðallagi miðað við aðra á svipuðu verði. Ef langdrægni skiptir meira máli en afl drífur Mercedes-Benz EQS 580 4MATIC 246 km lengra og er 460.000 kr. ódýrari, en hann er fólksbíll og má draga 1.300 kg minna.',
      'Cayenne Turbo er fyrir þá sem vilja jeppa sem gerir allt vel, og eru tilbúnir að borga fyrir það.',
    ],
    facts: '809a7020da23',
    model: 'gemini-3.8-flash, thinking high',
  },
  'porsche-cayenne-turbo-coupe': {
    paragraphs: [
      'Porsche Cayenne Turbo Coupé er hreinræktaður afkastajeppi fyrir þá sem vilja óhemju akstursánægju án þess að fórna notagildi hversdagsins. Hann sameinar krafta sem jafnast á við hörðustu sportbíla og öflugt fjórhjóladrif sem tryggir stöðugleika í snjó og vetrarfærð. Bíllinn höfðar fyrst og fremst til ökumannsins sem leitar að sportlegri upplifun og mikilli nærveru.',
      'Hann nýtur sín sérstaklega vel á ferðalögum milli landshluta. Drægnin er mjög mikil og dugar léttilega í langferðir jafnvel í vetrarkulda. Þegar kemur að því að tengja bílinn við hraðhleðslu hleður hann hraðast af öllum bílum í sínum verðflokki, þannig að hleðslustoppin tefja lítið fyrir. Gríðarlegt aflið gerir auk þess alla framúrakstursgetu fumlausa og örugga.',
      'Verðið er hins vegar mjög hátt, og kúpt þaklínan tekur svolítið af lofthæð og farangursplássi miðað við kassalaga jeppa. Ef áherslan er fyrst og fremst á hefðbundinn lúxus og enn meira langferðaþol er Mercedes-Benz EQS 580 4MATIC til dæmis 960.000 kr. ódýrari og með 232 km meiri drægni, þótt hann jafnist ekki á við afköst og snerpu Cayenne.',
      'Fyrir þá sem vilja sjaldséða blöndu af ofursportbíl og vetrarhæfum lúxusjeppa er fátt sem kemst nálægt Cayenne Turbo Coupé.',
    ],
    facts: '709a5fdc0857',
    model: 'gemini-3.8-flash, thinking high',
  },
  'range-rover-electric-ev450': {
    paragraphs: [
      'Range Rover Electric er risavaxinn lúxusjeppi sem leggur höfuðáherslu á hljóðláta mýkt, tignarlega nærveru og vellíðan í akstri frekar en sportlegt æði. Hann hentar þeim sem leita að algjörum ferðaþægindum og fágaðri reisn í hversdagsleikanum.',
      'Rafhlaðan er mjög stór og fjórhjóladrifið tryggir örugga seiglu í snjó og á hálum vegum. Hann drífur fremur langt, sem kemur sér vel á milli landshluta í íslenskum vetrarkulda, og hleður fremur hratt á ferðalögum.',
      'Miðað við aðra bíla á svipuðu verði er hann aftur á móti meðal þeirra aflminnstu og hægustu, auk þess að hlaða hægar en flestir. Ef áherslan er á gríðarlegan kraft og um 30% styttri hleðslustopp er Porsche Cayenne Turbo mun sneggri valkostur, og Mercedes-Benz EQS 580 kemst miklu lengra á hleðslunni.',
      'Þetta er bíll fyrir þá sem vilja óblandaðan jeppalúxus, mikið útsýni og ró frekar en að eltast við tölulega yfirburði á blaði.',
    ],
    facts: '216b5c4c82e0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'range-rover-electric-ev550': {
    paragraphs: [
      'Range Rover Electric EV550 er fullkomin táknmynd bresks lúxus í formi hábyggðs og virðulegs jeppa. Hann er hannaður fyrir þá sem gera kröfu um fyrsta flokks þægindi, fágaða innréttingu og einstaka færni utan brautar, þar sem fjórhjóladrifið og loftpúðafjöðrunin láta íslenska vetrarfærð líta út eins og leik.',
      'Rafhlaðan er mjög stór og bíllinn drífur fremur langt, sem dugar vel í langferðir milli landshluta á öllum árstímum. Hann er líka fremur snöggur upp á ferð miðað við þyngd og stærð, og hleður hratt þegar komið er á hraðhleðslustöðvar.',
      'Á móti kemur að hann er mjög dýr, og miðað við aðra í sínum verðflokki drífur hann styttra, er aflminni og hleður hægar en flestir. Til dæmis er Porsche Cayenne Turbo Coupé 1.300.000 kr. ódýrari, mun aflmeiri og með um 30% styttri hleðslustopp. Fyrir þá sem vilja hámarksdrægni býður Mercedes-Benz EQS 580 4MATIC upp á 269 km meiri drægni fyrir lægra verð.',
      'Range Rover EV550 er óumdeilanlegur konungur þæginda og virðuleika á fjórum hjólum, en kaupendur borga töluvert fyrir merkið og stílinn fremur en tölulega yfirburði.',
    ],
    facts: '7d553bed6445',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'renault-r5-e-tech-base': {
    paragraphs: [
      'Renault R5 E-Tech er smár og lipur fimm sæta borgarbíll sem sækir innblástur í sögu merkisins með skemmtilegri retro-hönnun. Hann er sérsniðinn að daglegum innanbæjarakstri, erindum og skutli fremur en ferðalögum um landið.',
      'Helsti styrkur hans er hve lágt kaupverðið er og hversu lipur hann reynist í þéttbýli og þröngum bílastæðum. Rafhlaðan dugar ágætlega í venjulegt snatt allan ársins hring, þótt bíllinn sé meðal þeirra aflminnstu í sínum verðflokki. Aflið dugar engu að síður vel í borgarumferðinni.',
      'Á móti kemur að hann er meðal þeirra bíla sem drífa styst miðað við aðra á svipuðu verði og hleður mjög hægt. Ef farið er reglulega út fyrir bæjarmörkin býður Hyundai INSTER Long Range á sama verði upp á 70 km meiri drægni og um 15% styttri hleðslustopp, auk þess sem Kia EV2 Standard Range er 500.000 kr. ódýrari.',
      'Renault R5 E-Tech er sjarmerandi kostur sem annar bíll á heimilið eða fyrir þá sem aka nær eingöngu í bænum, en hentar síður sem eini bíll fyrir ferðalög milli landshluta.',
    ],
    facts: 'd6b5c1746164',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'renault-r5-e-tech-52-kwh': {
    paragraphs: [
      'Renault R5 E-Tech 52 kWh er nettur og sjarmerandi hlaðbakur í anda klassíska forvera síns. Hann er lipur í þröngum götum, leikandi léttur og afar auðveldur í bílastæði. Bíllinn hentar prýðilega þeim sem aka mest innanbæjar eða leita að persónulegum öðrum bíl fyrir heimilið.',
      'Kaupverðið er mjög lágt, sem gerir hann að einum ódýrasta nýja rafbílnum á markaðnum. Drægnin dugar vel í dagsins amstur og styttri ferðir milli landshluta, þótt gera verði ráð fyrir að hún minnki í íslenskum vetrarkulda.',
      'Á móti kemur að hann er með minni rafhlöðu en flestir á svipuðu verði og hleður hægar en aðrir, sem krefst lengri hleðslustoppa á langferðum. Þar að auki er hann aflminni en flestir sambærilegir bílar. Ef rými og kraftur skipta meira máli býður Leapmotor C10 Pro upp á mun stærri bíl með meira afli fyrir sömu peninga, og BYD Dolphin gefur rýmra farþegarými.',
      'Renault R5 er skemmtilegur og hagkvæmur kostur fyrir þá sem vilja nettan borgarbíl með mikinn karakter, en síður hentugur sem aðalbíll fyrir stórar fjölskyldur.',
    ],
    facts: 'd6f71b54b2fb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'renault-scenic-e-tech-ev60': {
    paragraphs: [
      'Renault Scenic E-Tech EV60 er notalegur og vel heppnaður fimm sæta fjölskyldubíll sem sameinar crossover-útlit og sniðugt innanrými. Hann sker sig úr fyrir lipran bæjarakstur, gott skottpláss og afar skilvirkt afþreyingarkerfi með innbyggðu Google. Hann hentar sérstaklega fjölskyldum sem leita að liprum og fáguðum bíl í daglegan akstur.',
      'Bíllinn er fremur ódýr og býður upp á góða hljóðvist og mýkt í akstri. Hann er með fremur litla rafhlöðu og drífur fremur stutt, en uppgefin drægni dugar flestum vel í dagleg erindi þótt búast megi við að hún skerðist í íslenskum vetrarkulda.',
      'Á móti kemur að hann er mjög aflítill og hleður hægar en flestir miðað við aðra á svipuðu verði. Fyrir þá sem vilja meira öryggi í snjó og hálku býður Leapmotor C10 ProMax AWD upp á fjórhjóladrif á sama verði. Ef farið er oft í langferðir býður XPENG G6 RWD Standard Range upp á um 35% styttri hleðslustopp.',
      'Scenic EV60 er heillandi og þægilegur evrópskur fjölskyldubíll, en kaupendur sem horfa í fjórhjóladrif eða hraðari hleðslu fá meira fyrir peninginn hjá keppinautunum.',
    ],
    facts: 'f4f8925cd6d8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'renault-scenic-e-tech-ev87': {
    paragraphs: [
      'Renault Scenic E-Tech er hagnýtur og þægilegur fjölskyldujepplingur sem leggur áherslu á gott innanrými, afslappaðan akstur og hagkvæmni. Hann hentar sérlega vel fjölskyldum sem ferðast mikið um landið og vilja komast langt á hverri hleðslu án þess að kosta of miklu til.',
      'Stærsti styrkur bílsins er stór rafhlaða sem skilar drægni sem er meðal þeirra lengstu í þessum verðflokki. Hann er jafnframt meðal þeirra ódýrustu á hvern kílómetra drægni, sem veitir aukið öryggi í ferðalögum milli landshluta og tryggir að drægnitap í íslenskum vetrarkulda kemur síður að sök.',
      'Á móti kemur að hann er aðeins framhjóladrifinn, aflminni en flestir í sínum verðflokki og hleður fremur hægt. Ef fjórhjóladrif skiptir sköpum í snjó og hálku er Kia EV3 Long Range AWD á nánast sama verði, á meðan Tesla Model 3 Long Range Fjórhjóladrif býður bæði fjórhjóladrif og um 35% styttri hleðslustopp.',
      'Fyrir þá sem setja gott rými og mikla drægni fyrir peninginn í fyrsta sæti er Scenic einkar hagkvæmur og traustur ferðafélagi.',
    ],
    facts: 'c6e8a1afda6a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-epiq-55': {
    paragraphs: [
      'Skoda Epiq 55 er nettur og lipur smájepplingur sem býður upp á hærri sætisstöðu og hagkvæma nýtingu á innanrými eins og merkið er þekkt fyrir. Hann hentar sérlega vel í daglegan innanbæjarakstur, sem hagnýtur fyrsti rafbíll eða fyrir minni fjölskyldur sem vilja þægilega umgengni í þéttbýli.',
      'Bíllinn er mjög ódýr og mjög ódýr á hvern km drægni. Í daglegum akstri nýtist lipurðin vel, enda er hann sneggri og aflmeiri en flestir bílar á svipuðu verði. Þá hleður hann hraðar en flestir í sínum verðflokki, sem flýtir fyrir á ferðalögum milli landshluta.',
      'Á móti kemur að hann er með mjög litla rafhlöðu, drífur fremur stutt og framhjóladrifið krefst meiri aðgátar í vetrarfærð. Ef meiri drægni skiptir mestu máli býður Volkswagen ID. Polo upp á 13 km meiri drægni, en Epiq stendur mun betur að vígi en BYD Dolphin þar sem hleðslustoppin eru um 75% lengri.',
      'Fyrir þá sem leita að snörpum borgarjepplingi með stuttum hleðslustoppum á góðu verði er hann sérlega álitlegur kostur.',
    ],
    facts: 'a0c4aa967a45',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-elroq-85': {
    paragraphs: [
      'Skoda Elroq 85 er nettur og hagnýtur fjölskyldujepplingur sem höfðar til þeirra sem leita að traustum og þægilegum bíl fyrir daglegt líf og ferðalög. Hann býður upp á hefðbundið notagildi Skoda, með góðu innanrými, hárri setustöðu og hagnýtum lausnum sem auðvelda hversdaginn.',
      'Stærsti styrkur hans felst í því hve mikið fæst fyrir peninginn. Miðað við aðra í sínum verðflokki er hann meðal þeirra allra langdrægustu og ódýrustu á hvern kílómetra drægni. Hann er jafnframt aflmeiri en flestir keppinautar, búinn stærri rafhlöðu og hleður hraðar á langferðum um landið en gerist og gengur á þessu verði.',
      'Helsti ókosturinn er að hann er aðeins afturhjóladrifinn, sem getur hentað verr í þungri vetrarfærð eða bröttum brekkum í hálku. Ef fjórhjóladrif og mikill kraftur skipta sköpum býður Hongqi EHS5 upp á mun meiri hröðun fyrir aðeins hærra verð, þótt hann fari styttra á hleðslunni. Ef fólk vill frekar lágan fólksbíl nær Kia EV4 Fastback örlítið meiri drægni.',
      'Fyrir þá sem vilja rúmgóðan og afar langdrægan jeppling á hagstæðu verði er Elroq 85 sérlega skynsamlegt val.',
    ],
    facts: '854fd4da41e0',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'skoda-elroq-85x': {
    paragraphs: [
      'Skoda Elroq 85x er lipur og hagnýtur jepplingur með öflugu fjórhjóladrifi sem fellur einkar vel að íslenskum aðstæðum. Hann höfðar sérstaklega til þeirra sem vilja traustan vetrarbíl fyrir fjölskylduna, jafnt til daglegra erinda sem ferðalaga um landið.',
      'Stærsti styrkur hans er hversu mikið fæst fyrir peninginn, en hann er meðal þeirra ódýrustu á hvern km drægni í sínum verðflokki. Hann drífur lengra en flestir á svipuðu verði og hleður hraðar en flestir þeirra, sem þýðir áhyggjulausari vetrarakstur og snurðulausari ferðir milli landshluta.',
      'Afl og hröðun eru aðeins í meðallagi, en fátt annað gefur hann eftir. Ef hámarkshraði í hleðslu skiptir öllu máli gæti XPENG G6 RWD Long Range hentað betur með um 25% styttri hleðslustopp, en hann er aðeins með afturhjóladrif.',
      'Fyrir íslenskar aðstæður er Elroq 85x afar hagkvæmur og heildstæður kostur sem hittir beint í mark hjá þeim sem vilja fjórhjóladrif og örugga drægni á góðu verði.',
    ],
    facts: 'b96e9d7e8c9a',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-elroq-rs': {
    paragraphs: [
      'Skoda Elroq RS er sportlegur og lipur jepplingur með fjórhjóladrifi sem hentar fólki sem vill auðveldan bíl í daglegum innanbæjarakstri en þarf um leið gott öryggi í misjöfnum vetraraðstæðum. Hann ber með sér hagnýt vinnubrögð Skoda en fær hér sneggri og ákveðnari svip í RS-útfærslunni.',
      'Stærsti styrkur hans felst í drægninni, en miðað við aðra á svipuðu verði drífur hann lengra en flestir. Það munar verulega um það í íslenskum vetrarkulda og gerir lengri ferðir milli landshluta áhyggjuminni. Fjórhjóladrifið veitir gott grip í snjó og hálku, þótt hraðhleðsla og hröðun séu fremur í meðallagi.',
      'Ef styttri viðdvöl við hleðslustöðvar skiptir miklu máli er Smart #5 Pulse 200.000 kr. ódýrari og býður upp á um 35% styttri hleðslustopp. Ford Mustang Mach-E LR AWD kemur sömuleiðis með 20 kWh stærri rafhlöðu, þótt hleðslustoppin séu um 20% lengri.',
      'Skoda Elroq RS er heilsteyptur og traustur kostur fyrir þá sem leita að liprum fjölskyldubíl þar sem drægni og öruggt veggrip mætast á góðu verði.',
    ],
    facts: '7b62f0e932ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-enyaq-85x': {
    paragraphs: [
      'Skoda Enyaq 85X er rúmgóður og hagnýtur fjölskyldujepplingur með fjórhjóladrifi sem hentar einkar vel fyrir íslenskar aðstæður. Hann einkennist af miklu innanrými, stóru farangursrými og yfirveguðum aksturseiginleikum þar sem þægindi og rólegheit eru í fyrirrúmi. Hann hentar sérstaklega fjölskyldum sem leita að traustum ferðabíl allan ársins hring sem lætur vetrarfærð ekki slá sig út af laginu.',
      'Hann nýtir orkuna mjög vel, enda drífur hann lengra en flestir bílar á svipuðu verði þótt hann sé með minni rafhlöðu en þeir. Það skilar sér í lágri eyðslu og góðu öryggi á ferðalögum milli landshluta. Hraðhleðslan er í meðallagi og dugar prýðilega í hefðbundið kaffistopp á langferðum.',
      'Á móti er hann bæði aflminni og hægari en flestir á svipuðu verði, þótt aflið dugi vissulega í allan daglegan akstur. Ef mikil snerpa og hraðari hleðsla skipta mestu máli býður Smart #5 Pulse upp á um 40% styttri hleðslustopp og mun sneggri hröðun á sama verði. Fyrir þá sem setja hagnýt heimilagæði og gott pláss í fyrsta sæti er Enyaq 85X engu að síður afskaplega traust og skynsamlegt val.',
    ],
    facts: '736aa237e05e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-enyaq-rs': {
    paragraphs: [
      'Skoda Enyaq RS er rúmgóður og sportlegur fjölskyldubíll með fjórhjóladrifi. Hann sameinar lipurt notagildi og gott innanrými með kröftugra útliti og stífari akstri, sem hentar vel fjölskyldum sem leita að öruggum vetrarbíl en kunna að meta sportlegan blæ.',
      'Fjórhjóladrifið tryggir stöðugt grip í hálku og snjó og bíllinn leysir alla hefðbundna innanbæjar- og helgarkeyrslu af öryggi. Drægnin og rafhlaðan eru þó í meðallagi, svo í hörðum vetrarkulda á ferðalögum milli landshluta þarf að huga vel að hleðslustoppum.',
      'Helsti gallinn er verðið miðað við afköst, en bíllinn er dýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Á sama verði býður Polestar 4 SUV Long Range Dual Motor upp á 57 km meiri drægni og er 1,5 s sneggri í hundraðið. Ef sóst er eftir meiri hraða á langferðum er Smart #5 Brabus bæði ódýrari og tekur um 40% styttri hleðslustopp.',
      'Skoda Enyaq RS er traustur og þægilegur kostur fyrir þá sem vilja klassíska notendavænni í sportlegum búningi, en keppinautarnir veita meiri drægni og snerpu fyrir peninginn.',
    ],
    facts: '134c04397a83',
    model: 'gemini-3.8-flash, thinking high',
  },
  'skoda-peaq-90x': {
    paragraphs: [
      'Skoda Peaq 90x er stór, fjölskylduvænn jeppi með allt að sjö sætum og fjórhjóladrifi sem hentar vel þeim sem þurfa mikið rými og traust grip í íslenskri vetrarfærð. Hann leggur áherslu á hagnýtt pláss og góða ferðagetu frekar en óþarfa prjál.',
      'Helsti styrkleiki hans er drægnin, en hann er meðal þeirra langdrægustu í sínum verðflokki og skartar einni af stærstu rafhlöðunum. Í vetrarkulda gefur það aukið öryggi á ferðalögum milli landshluta. Hann hleður hraðar en flestir bílar á svipuðu verði og er ódýrari á hvern km drægni en flestir, sem skilar sér í hagstæðum kaupum miðað við getu.',
      'Á móti kemur að hann er aflminni og hægari en flestir á svipuðu verði, þótt aflið dugi vel í daglegum akstri. Fyrir þá sem vilja meiri snerpu býður Mercedes-Benz GLB 350 4MATIC EQ upp á sneggri hröðun og um 35% styttri hleðslustopp, en kostar meira. Fyrir stórar fjölskyldur sem leita að mikilli drægni, fjórhjóladrifi og ríflegu plássi er Peaq 90x mjög skynsamlegt val.',
    ],
    facts: '26b32d8a9473',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-1-pro': {
    paragraphs: [
      'Smart #1 Pro+ er lipur og hár smájepplingur, hannaður í samstarfi Mercedes-Benz og Geely, sem hentar vel þeim sem vilja nettan og nútímalegan bíl í daglegan akstur. Hann sker sig úr með sérkennilegu útliti, hárri setstöðu og miklu afli miðað við stærð sína.',
      'Í daglegum akstri kemur sér vel hve sprækur bíllinn er, enda er hann sneggri og aflmeiri en flestir í sínum verðflokki. Hann er einnig með stærri rafhlöðu en flestir á svipuðu verði og hleður hraðar en þeir, sem skilar sér í styttri hleðslustoppum á ferðalögum. Drægnin dugar ágætlega í daglegar ferðir og styttri ferðalög, þótt reikna verði með að hún minnki í íslenskum vetrarkulda.',
      'Afturhjóladrifið krefst þó nokkurrar aðgæslu í vetrarhálku. Ef öruggara grip í snjó skiptir mestu máli gæti framhjóladrifinn Kia EV3 Standard Range hentað betur, auk þess sem hann er 200.000 kr. ódýrari, þótt hleðslustoppin í honum séu um 10% lengri. Ef meiri drægni ræður úrslitum býður MG MGS5 LUX upp á 25 km meiri drægni.',
      'Smart #1 Pro+ er kraftmikill og skemmtilegur kostur fyrir þá sem leita að vel búnum borgarjepplingi á mjög hagstæðu verði.',
    ],
    facts: '30c342608c6d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-1-pulse': {
    paragraphs: [
      'Smart #1 Pulse er sprækur og nettur rafjepplingur með fjórhjóladrifi sem sameinar lipra borgarstærð og mikil afköst. Hann er hannaður í samstarfi Mercedes-Benz og Geely og höfðar sérstaklega til þeirra sem vilja nútímalegan hönnunarbíl með öruggu gripi í vetrarfærð án þess að kaupa stóran fjölskyldujeppa.',
      'Stærsti styrkleikinn er aflið. Miðað við aðra bíla á svipuðu verði er hann meðal þeirra allra aflmestu og sneggstu, og tekur aðeins 4,5 sekúndur í hundraðið. Fjórhjóladrifið og mikill kraftur veita mikið öryggi í hálku, öruggt viðbragð í framúrakstri og skemmtilega aksturseiginleika í daglegu lífi.',
      'Á móti kemur að hann drífur mjög stutt og er með minni rafhlöðu en flestir á þessu verði. Ef meira flutningsrými og meiri drægni skipta máli væri KGM Musso EV betri kostur með mun stærri rafhlöðu, og Suzuki e Vitara 4x4 AllGrip býður upp á fjórhjóladrif á örlítið lægra verði en gefur verulega eftir í afli.',
      'Smart #1 Pulse er því fyrst og fremst bíll fyrir þá sem setja kraft, akstursgleði og fjórhjóladrif ofar langdrægni og miklu skottrými.',
    ],
    facts: 'b81624188033',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'smart-1-brabus': {
    paragraphs: [
      'Smart #1 Brabus er snaggaralegur og óhemju kraftmikill sportjepplingur sem leggur allt upp úr mikilli snerpu og líflegum akstri í þéttbýli. Hann hentar einkum þeim sem leita að miklum spyrnukrafti og upphækkaðri setstöðu í nettum bíl sem auðvelt er að athafna sig með í daglegu amstri.',
      'Fjórhjóladrifið og gríðarlegt aflið koma sér sérstaklega vel í vetrarfærð og snjó á Íslandi, enda er bíllinn meðal þeirra sneggstu miðað við aðra á svipuðu verði. Aflið skilar sér samstundis og tryggir öruggt grip við krefjandi aðstæður.',
      'Fórnarkostnaðurinn liggur hins vegar í drægninni. Hann drífur mjög stutt, er með minni rafhlöðu en flestir og hleður hægar en flestir á svipuðu verði. Fyrir þá sem ferðast mikið milli landshluta væri Volvo EX30 Twin Motor Performance heppilegri kostur, en hann er 100.000 kr. ódýrari, býður upp á 50 km meiri drægni og um 10% styttri hleðslustopp.',
      'Smart #1 Brabus er kjörinn fyrir þá sem vilja leikfang og hámarksakstursgleði á hverjum degi, en síður hentugur sem aðalbíll í langan vetrarakstur um landið.',
    ],
    facts: '37b67d47d275',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-3-pulse': {
    paragraphs: [
      'Smart #3 Pulse er sportlegur og rennilegur jepplingur með fjórhjóladrifi og miklum krafti. Hann er hannaður sem líflegur götubíll frekar en hefðbundinn hversdagsbíll og hentar einkum þeim sem vilja snöggan bíl með öruggu gripi í hálku og snjó, en horfa síður til mikils rýmis.',
      'Stærsti kostur hans felst í afköstunum, en miðað við aðra á svipuðu verði er hann aflmeiri en flestir og meðal þeirra sneggstu. Fjórhjóladrifið og aflið nýtast vel í íslenskum vetri, bæði í snjófærð innanbæjar og á krefjandi vegum úti á landi.',
      'Helsti ókosturinn er að hann drífur fremur stutt og hleður hægar en flestir í sínum verðflokki, sem gerir langferðir að meiri þolinmæðisvinnu. Ef langdrægni vegur þyngra gæti Toyota C-HR+ hentað betur með 41 km meiri drægni, en hann er á móti 3,6 s hægari í 0-100 km/klst og aðeins framhjóladrifinn.',
      'Smart #3 Pulse höfðar fyrst og fremst til þeirra sem setja akstursánægju, snör viðbrögð og fjórhjóladrif í forgang, og eru tilbúnir að fórna drægni á móti.',
    ],
    facts: '83bd9755cea2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-3-brabus': {
    paragraphs: [
      'Smart #3 Brabus er sportlegur og straumlínulagaður crossover sem leggur áherslu á kraft og akstursgleði fremur en hefðbundið notagildi. Hann hentar þeim sem leita að liprum og áberandi bíl með gríðarlegu afli og snörpum viðbrögðum í hversdagsakstri.',
      'Fjórhjóladrifið kemur sér sérstaklega vel í íslenskri vetrarfærð og veitir öryggi og gott veggrip í snjó og hálku. Að fá slíka hröðun og mikið afl í bíl á þessu verði gerir hann að ótrúlega snöggum bíl sem skilur flesta aðra eftir á ljósum.',
      'Á móti kemur að hann drífur styttra en flestir bílar í sínum verðflokki og hleður hægar en þeir á langferðum. Harður keppinautur á borð við Volvo EX30 Twin Motor Performance er 300.000 kr. ódýrari, býður upp á 35 km meiri drægni og um 10% styttri hleðslustopp. Ef hærri setustaða og kassalagaðra útlit heillar meira er Smart #1 Brabus einnig 200.000 kr. ódýrari kostur.',
      'Smart #3 Brabus er spennandi valkostur fyrir þá sem setja mikinn kraft og sportlegan svip í öndvegi en gera ekki kröfu um mikla langferðadrægni.',
    ],
    facts: 'b1fb76b375a2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-5-pro': {
    paragraphs: [
      'Smart #5 Pro er stór og kassalaga jepplingur, ný stefna hjá merki sem var þekkt fyrir smábíla. Hann hentar fjölskyldum sem vilja mikið pláss og áberandi útlit.',
      'Skottið er með þeim stærstu í sínum verðflokki og 72 l framskott bætist við, og hann má draga 1.600 kg, meira en flestir á svipuðu verði. Hann er líka sneggri og aflmeiri en flestir í sínum verðflokki, með stærri rafhlöðu en gengur og gerist.',
      'Á móti kemur að hann hleður fremur hægt á langferðum og er afturhjóladrifinn, sem krefst meiri varkárni í snjó og hálku. XPENG G6 RWD Standard Range er 100.000 kr. ódýrari með um 25% styttri hleðslustopp, en drífur 30 km styttra og skottið er 59 l minna.',
      'Fyrir þá sem leita að rúmgóðum og sprækum fjölskyldubíl sem getur dregið hjólhýsi er #5 Pro fýsilegur kostur, svo lengi sem hraðhleðslan er ekki í forgangi.',
    ],
    facts: 'cf21101e07be',
    model: 'gemini-3.8-flash, thinking high',
  },
  'smart-5-pulse': {
    paragraphs: [
      'Smart #5 Pulse er kraftmikill og rúmgóður fjölskyldujepplingur með fjórhjóladrifi sem markar nýja stefnu fyrir merkið með aukinni stærð og miklu afli. Hann hentar einkum þeim sem leita að traustum ferðabíl fyrir íslenskar aðstæður, þar sem aldrif og öflugir rafmótorar koma sér vel í vetrarfærð og snjó.',
      'Stærsti styrkur hans felst í tækninni undir yfirbyggingunni. Miðað við aðra bíla á svipuðu verði er hann með einni af stærstu rafhlöðunum og drífur lengra en flestir. Hann er jafnframt meðal þeirra aflmestu í sínum flokki, sneggri en flestir af stað og meðal þeirra sem hlaða hraðast. Á lengri ferðalögum um landið þýðir þetta óvenju stutt hleðslustopp.',
      'Á móti kemur að Smart á sér styttri sögu í stærri jepplingum en hefðbundnari framleiðendur. Kaupendur sem vilja rótgrónari fjölskyldubíl gætu frekar horft til Skoda Enyaq 85X, þótt hann hafi mun minna afl og um 60% lengri hleðslustopp. Ford Mustang Mach-E LR AWD býður upp á örlítið meiri drægni, en hleðslustoppin eru um 90% lengri og hann er 100.000 kr. dýrari.',
      'Fyrir þá sem vilja mikið afl, gott grip og skjótvirka hleðslu á þessu verði gefur Smart #5 Pulse mikið fyrir peningana.',
    ],
    facts: '83e04f571366',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'smart-5-brabus': {
    paragraphs: [
      'Smart #5 Brabus er stór og kassalaga jepplingur sem á lítið skylt við smábílana sem flestir tengja við vörumerkið. Með öflugu fjórhjóladrifi og miklu rými hentar hann fjölskyldum sem vilja rúmgóðan ferðabíl sem ræður léttilega við krefjandi vetrarfærð.',
      'Bíllinn er mjög snöggur og aflmestur bíla í sínum verðflokki, með afl sem skilar gríðarlegu viðbragði. Hann er með fremur stóra rafhlöðu og hleður hraðar en flestir bílar á svipuðu verði, sem styttir hleðsluhlé á ferðalögum um landið verulega.',
      'Á móti er drægnin aðeins í meðallagi og hann er dýrari á hvern kílómetra drægni en flestir á svipuðu verði. Ef lengra ferðasvið skiptir meira máli en aflið býður Polestar 4 Long Range Dual Motor til dæmis upp á 50 km meiri drægni á sama verði, þótt hleðslustoppin séu um 60% lengri.',
      'Smart #5 Brabus er spennandi valkostur fyrir þá sem vilja mikið afl, snögga hleðslu og rúmgóðan jeppling sem sker sig úr menginu.',
    ],
    facts: '5c7dc93cc2ea',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-e-outback-base': {
    paragraphs: [
      'Subaru e-Outback er harðgerður fjölskyldubíll með aldrifi sem er sniðinn fyrir fólk sem ferðast í hvers kyns veðrum og vill ekki láta snjó eða ófærð stoppa sig. Hann byggir á þekktri hefð Subaru fyrir vetrarhæfni og hagnýtri hönnun sem hentar íslenskum vegum prýðilega.',
      'Bíllinn er fremur snöggur og aflmikill, og í raun sneggri og aflmeiri en flestir bílar á svipuðu verði. Þetta mikla afl gefur aukið öryggi við framúrakstur og lipur viðbrögð í daglegum akstri. Drægnin er í meðallagi og dugar vel í daglega notkun og venjuleg ferðalög milli landshluta.',
      'Á móti kemur að hann er með fremur litla rafhlöðu og er dýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Hraðhleðslan er einnig í meðallagi, þannig að sá sem ferðast mikið og vill lágmarka bið á ferðalögum gæti skoðað Hongqi EHS7 Premium, sem býður upp á um 35% styttri hleðslustopp. Á hinn bóginn býður Subaru meira afl en hinn svipaði Toyota bZ4X AWD á örlítið lægra verði.',
      'Subaru e-Outback er því álitlegur kostur fyrir þá sem setja traust fjórhjóladrif og afköst í forgang í snjó og vetrarfærð, svo lengi sem meðalhraði við hleðslustaurinn nægir.',
    ],
    facts: 'edde5f48d3ad',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-solterra-base': {
    paragraphs: [
      'Subaru Solterra er meðalstór jepplingur með fjórhjóladrifi, systurbíll Toyota bZ4X, sem höfðar til þeirra sem treysta á gott grip og veghæð í vetrarfærð og á malarvegum, eins og Subaru er þekkt fyrir.',
      'Hann er sneggri og aflmeiri en flestir á svipuðu verði og má draga 1.500 kg. Drægnin og hraðhleðslan eru í meðallagi í sínum verðflokki.',
      'Á móti kemur að skottið er minna en hjá flestum á svipuðu verði. Kia EV6 2025 Long Range AWD kostar nánast það sama en hleður með um 40% styttri stoppum, er með 69 l stærra skott og má draga 300 kg meira.',
      'Solterra er traustur kostur fyrir þá sem setja fjórhjóladrif og veghæð í forgang, en keppinautarnir á sama verði hlaða hraðar og rúma meira.',
    ],
    facts: '4ecb88ec078d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'subaru-uncharted-base': {
    paragraphs: [
      'Subaru Uncharted er öflugur og lipur rafjepplingur með fjórhjóladrifi sem hæfir íslenskum aðstæðum sérlega vel. Hann byggir á traustri arfleifð Subaru í vetrarakstri með góðu veggripi, og hentar einkar vel ökumönnum sem vilja traustan bíl fyrir krefjandi vetrarveður og akstur milli landshluta.',
      'Helsti styrkleiki bílsins liggur í aflrásinni, en miðað við aðra á svipuðu verði er hann bæði sneggri og aflmeiri en flestir. Þetta veitir mikið öryggi við framúrakstur og þegar taka þarf af stað í snjó og hálku. Hraðhleðslan er í meðallagi, en á ferðalögum má búast við talsvert styttri hleðslustoppum en hjá mörgum keppinautum á svipuðu verði.',
      'Á móti kemur að hann drífur fremur stutt yfir heildina litið, þótt drægnin sé í meðallagi miðað við verð. BMW iX1 eDrive 20 býður upp á meiri drægni og fágaðra yfirbragð en er aðeins framhjóladrifinn og mun aflminni. BYD Seal U er með stærri rafhlöðu en tekur um 60% lengri hleðslustopp. Ef verðið ræður mestu er MG MGS6 Dual Motor 100.000 kr. ódýrari, en krefst um 30% lengri hleðslustoppa.',
      'Fyrir þá sem leita að snöggum fjórhjóladrifnum rafbíl á góðu verði sem lætur íslenskar aðstæður ekki stöðva sig er Subaru Uncharted mjög heilsteyptur kostur.',
    ],
    facts: '83685783dc51',
    model: 'gemini-3.8-flash, thinking high',
  },
  'suzuki-e-vitara-4x4-allgrip': {
    paragraphs: [
      'Suzuki e Vitara 4x4 AllGrip er nettur og hagnýtur jepplingur sem höfðar sérstaklega til þeirra sem vilja raunverulegt fjórhjóladrif á viðráðanlegu verði. Suzuki er þekkt fyrir trausta vetrarbíla og hér er sú hugmyndafræði færð í rafdrifið form. Hann hentar vel fyrir fólk sem þarf lipran hversdagsbíl sem ræður vel við krefjandi vetrarfærð eða malarvegi.',
      'Fjórhjóladrifið er hans helsti styrkur og kemur sér vel í snjó, krapi og hálku á íslenskum vegum. Bíllinn er lipur í þéttbýli og snerpan dugar vel í öllum venjulegum aðstæðum.',
      'Á móti kemur að drægnin er með því stysta sem gerist miðað við aðra á svipuðu verði, sem getur verið knappt í vetrarkulda á milli landshluta. Hleðslustoppin eru einnig með þeim lengstu. Fyrir þá sem aka mikið langferðir býður Smart #1 Pulse upp á um 40% styttri hleðslustopp og mun meira afl á svipuðu verði.',
      'Suzuki e Vitara er engu að síður kjörinn kostur fyrir þá sem leita að hagkvæmum fjórhjóladrifsbíl sem stendur fyrir sínu í íslenskum vetri.',
    ],
    facts: 'd7c7e33a9fd8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 er lágur og rennilegur fólksbíll sem einkennist af mikilli orkunýtni, liprum akstri og tækninýjungum. Hann hentar sérstaklega vel þeim sem ferðast mikið á bundnu slitlagi og vilja straumlínulagaðan fólksbíl frekar en hefðbundinn jeppling.',
      'Í daglegu lífi nýtist drægnin vel á milli landshluta, jafnvel í vetrarkulda. Hann hleður hraðar en flestir bílar í sínum verðflokki, sem styttir stopp á ferðalögum, auk þess að vera sneggri og aflmeiri en keppinautarnir. Hann er meðal þeirra allra ódýrustu á hvern kílómetra drægni og gefur því óvenju mikið fyrir peninginn.',
      'Afturhjóladrifið og lág veghæð henta hins vegar síður í djúpan snjó eða grófa slóða. Ef þú kýst meiri veghæð og hærri sætisstöðu gæti jepplingur eins og Leapmotor C10 ProMax eða Hyundai Kona Electric hentað betur, en þeir eru báðir dýrari og hafa um 30% til 80% lengri hleðslustopp.',
      'Fyrir þá sem vilja lágan, orkunýtinn og snöggan rafbíl á mjög hagstæðu verði er Model 3 einn álitlegasti kosturinn í dag.',
    ],
    facts: 'a9b5c98f3078',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-3-long-range-afturhjoladrif': {
    paragraphs: [
      'Tesla Model 3 Long Range með afturhjóladrifi er lágur og rennilegur fólksbíll þar sem einstök orkunýtni skilar mikilli veglengd. Hann hentar sérstaklega vel þeim sem aka reglulega milli landshluta og vilja geta treyst á drægnina í vetrarkulda án tíðra hleðslustoppa.',
      'Bíllinn drífur mjög langt, og miðað við aðra á svipuðu verði drífur hann lengst og er ódýrastur á hvern km drægni. Hann hleður fremur hratt og er sneggri en flestir í sínum verðflokki. Í daglegum akstri tryggir þetta snögg viðbrögð og stutt hlé við hraðhleðslustöðvar á lengri ferðalögum.',
      'Á móti kemur að bíllinn er lágur og aðeins með afturhjóladrifi. Ef meiri veghæð og há setstaða skipta meira máli í snjó og ófærð gæti jepplingur eins og Skoda Elroq 85 hentað betur, þótt hann bjóði upp á 171 km minni drægni og um 30% lengri hleðslustopp.',
      'Fyrir þá sem horfa fyrst og fremst í hagkvæmni á langferðum er þetta einn álitlegasti kosturinn.',
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
      'Tesla Model 3 Performance er lágur og hreinræktaður sportbíll í fólksbílagerð sem er ætlaður þeim sem leita að gríðarlegum afköstum og beittum aksturseiginleikum. Hann hentar ökumönnum sem setja akstursánægju í fyrsta sæti frekar en hátt sæti í jepplingi.',
      'Bíllinn er sneggstur allra á svipuðu verði og meðal þeirra aflmestu. Hann drífur lengra en flestir í sínum verðflokki, hleður hraðar en flestir þeirra á ferðalögum og fjórhjóladrifið veitir mikið öryggi í hálku og snjó. Þá er hann ódýrari á hvern kílómetra drægni en flestir samkeppnisaðilar og gefur óvenju mikið afl fyrir peninginn.',
      'Fórnarkostnaðurinn liggur í þægindum og hefðbundnu notagildi. Hann er lágur, fjöðrunin er stíf og lítið skottlok takmarkar aðgengi að farangri miðað við bíla með stóran hlaðbakhlera. Ef þörf er á meiri veghæð í snjó eða hærri sætisstöðu fyrir fjölskylduna væri Ford Explorer ER AWD eða Kia EV5 mun hagnýtari kostur.',
      'Fyrir þá sem vilja mikinn kraft og sportlegan akstur á hóflegu verði er Model 3 Performance hins vegar í sérflokki.',
    ],
    facts: 'e4eeae096e55',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-y-standard-range': {
    paragraphs: [
      'Tesla Model Y Standard Range er rúmgóður fjölskyldujepplingur með mikið skottpláss og gagnlegt framskott, sem hentar sérstaklega vel þeim sem þurfa ríflegt pláss í daglega lífinu. Bíllinn einkennist af snjöllum hugbúnaði og hnökralausu aðgengi að hleðsluneti sem gerir ferðalög milli landshluta afar einföld.',
      'Miðað við aðra í sínum verðflokki drífur hann lengra en flestir og er aflmeiri, sem skilar sér í góðu viðbragði. Hann er einnig ódýrari á hvern kílómetra drægni en flestir keppinautarnir. Þótt hann hlaði fremur hægt tekur hann styttri hleðslustopp á ferðalögum en flestir bílar á svipuðu verði.',
      'Á móti kemur að hann er með fremur litla rafhlöðu og aðeins afturhjóladrif, sem krefst meiri varkárni í íslenskri vetrarfærð. Sá sem vill meiri orkuforða fær mun stærri rafhlöðu í Leapmotor C10 ProMax fyrir lægra verð. Hyundai Kona Electric er einnig ódýrari kostur, en þar eru hleðslustoppin um 40% lengri og innanrýmið talsvert minna.',
      'Fyrir þá sem leita að hámarksrými og hagkvæmni á þessu verðbili er Model Y engu að síður mjög sterkt val.',
    ],
    facts: 'cfe67b562377',
    model: 'gemini-3.8-flash, thinking high',
  },
  'tesla-model-y-premium-long-range': {
    paragraphs: [
      'Tesla Model Y Premium Long Range er rúmgóður fjölskyldubíll sem sameinar mikla hagkvæmni, þekktan hugbúnað og mikið pláss fyrir bæði farþega og farangur. Hann hentar sérlega vel fólki sem ferðast mikið milli landshluta og vill þægilegan hversdagsbíl með góðu geymslurými.',
      'Drægnin er meðal þeirra allra bestu í þessum verðflokki, sem kemur sér vel í íslenskum vetrarkulda þar sem raunhæft er að komast langt án þess að hafa áhyggjur af hleðslu. Hann er einnig meðal þeirra ódýrustu á hvern kílómetra drægni miðað við bíla á svipuðu verði. Þá hleður hann hraðar en flestir aðrir í flokknum, sem gerir hleðslustopp á langferðum bæði fátíðari og styttri.',
      'Á móti kemur að þessi útfærsla er eingöngu með afturhjóladrif. Fyrir þá sem búa við mikinn snjó eða krefjandi vetrarfærð gætu Polestar 2 Long Range Dual Motor eða Ford Capri hentað betur, enda bjóða þeir báðir upp á fjórhjóladrif á nánast sama verði.',
      'Ef fjórhjóladrif er ekki skilyrði færðu vart meiri drægni og hagnýtara rými fyrir peninginn.',
    ],
    facts: '20b24ee73012',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'tesla-model-y-long-range-dual-motor': {
    paragraphs: [
      'Tesla Model Y Long Range Dual Motor er rúmgóður fjölskyldujepplingur með aldrifi sem sameinar hagnýtt rými og mikil afköst. Hann hentar sérstaklega vel fólki sem ferðast mikið á milli landshluta og vill öruggan vetrarbíl með miklu geymsluplássi.',
      'Bíllinn er meðal þeirra langdrægustu í sínum verðflokki og hleður hraðar en flestir, sem þýðir styttri hleðslustopp á langferðum um landið. Hann er jafnframt meðal þeirra aflmestu og sneggri en flestir á svipuðu verði, auk þess að vera ódýrari á hvern kílómetra drægni. Fjórhjóladrifið veitir mikið öryggi í snjó og hálku.',
      'Á móti kemur að öllum stillingum er stýrt í gegnum einn miðlægan snertiskjá og fjöðrunin er fremur stíf. Þeir sem kjósa hefðbundnari hnappa og mýkri akstur gætu frekar skoðað Skoda Elroq RS eða Ford Mustang Mach-E LR AWD, og ef fjórhjóladrif er óþarfi er Toyota C-HR+ 77 kWh töluvert ódýrari með svipaða drægni.',
      'Fyrir þá sem leita að mikilli drægni, miklu plássi og öflugu aldrifi fyrir peninginn er þessi bíll einn sá heilsteyptasti sem völ er á.',
    ],
    facts: 'a556e4e8d671',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'tesla-model-y-performance': {
    paragraphs: [
      'Tesla Model Y Performance er rúmgóður fjölskyldubíll með afli og hröðun sem hæfir ofurbíl. Hann einkennist af miklu innanrými, stórum farangursgeymslum að framan og aftan, og hentar sérstaklega þeim sem þurfa praktískan heimilissportbíl sem tekur vel við öllum farangri en veitir jafnframt mikla akstursánægju.',
      'Hann drífur lengra en flestir bílar í sínum verðflokki og hleður hraðar en flestir þeirra, sem þýðir að vetrarferðalög og langkeyrslur milli landshluta ganga snurðulaust fyrir sig. Fjórhjóladrifið sér um öruggt veggrip í hálku og snjó, og miðað við aðra á svipuðu verði er hann meðal þeirra aflmestu og sneggstu á götunum.',
      'Á móti kemur að stíf fjöðrun og stórar felgur gera hann óþýðari á grófum malarvegum og holóttu malbiki en margir hefðbundnir jepplingar eru. Ef mýkri akstur og örlítið meiri drægni skipta meira máli gæti Polestar 4 Long Range Dual Motor hentað betur þótt hann sé dýrari, en Volvo EC40 Recharge Twin er ódýrari kostur með hefðbundnari innréttingu.',
      'Þetta er mikill aflpúki sem fórnar engu af hagnýtu gildi fjölskyldubílsins.',
    ],
    facts: '36f58db16db2',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-base': {
    paragraphs: [
      'Toyota bZ4X er rúmgóður og þægilegur fjölskyldujepplingur með háa setstöðu og gott innanrými sem hentar prýðilega fyrir hversdagsleikann og fjölskylduferðir. Bíllinn leggur áherslu á þægindi og rólegan akstur, og höfðar sérstaklega til þeirra sem leita að hagnýtum og notendavænum ferðabíl.',
      'Í sínum verðflokki drífur hann lengra en flestir og er ódýrari á hvern kílómetra drægni en keppinautarnir. Hann hleður jafnframt hraðar en flestir bílar á svipuðu verði, sem gerir hleðslustopp í langferðum milli landshluta styttri og snurðulausari.',
      'Á móti kemur að bíllinn er aðeins með framhjóladrif og er aflminni og hægari en flestir á svipuðu verði. Ef öruggara grip í snjó og meiri kraftur skipta þig miklu máli væri fjórhjóladrifinn bíll eins og Skoda Elroq RS eða Polestar 2 Long Range Performance betri kostur, en báðir eru talsvert sneggri.',
      'Fyrir þá sem vilja mikla drægni og góð kaup á hvern kílómetra, en þurfa ekki fjórhjóladrif í vetrarfærðina, er bZ4X afar skynsamlegur kostur.',
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
      'Toyota bZ4X Touring er rúmgóður og þægilegur fjölskyldujepplingur með framhjóladrifi. Hann leggur áherslu á einfaldleika, mýkt í akstri og þekktan áreiðanleika merkisins fremur en mikinn kraft, og hentar fólki sem vill yfirvegaðan og áhyggjulausan bíl í daglega notkun.',
      'Stærsti kostur hans er drægnin, en hann drífur lengra en flestir bílar á svipuðu verði. Þótt rafhlaðan sé fremur lítil nýtir hann orkuna vel og hleður hraðar en flestir í sínum verðflokki. Í langferðum milli landshluta þýðir það færri og sneggri stopp við hleðslustöðvar.',
      'Aftur á móti gefur maður mikið eftir í afli og drifbúnaði. Á þessu verði bjóða keppinautarnir jafnan upp á öflugt fjórhjóladrif, eins og Volvo EX40 Recharge Twin eða Polestar 2 Long Range Performance sem er jafnframt ódýrari. Framhjóladrifið gerir Toyota síðri í þungri vetrarfærð og hálkubrekkum.',
      'Þetta er prýðilegur og traustur ferðabíll, en verðið er nokkuð hátt fyrir bíl sem er eingöngu knúinn á framhjólunum.',
    ],
    facts: '4430e8e0ec93',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-bz4x-touring-awd': {
    paragraphs: [
      'Toyota bZ4X Touring AWD er hár og lipur fjölskyldujepplingur sem sameinar kunnuglegt viðmót merkisins og óvænt mikinn kraft. Hann hentar sérstaklega vel þeim sem vilja hversdagsbíl með traustu fjórhjóladrifi og góðri veghæð fyrir íslenskan vetur, án þess að fórna snörpu viðbragði.',
      'Helsti kostur bílsins er að hann er sneggri og aflmeiri en flestir á svipuðu verði. Fjórhjóladrifið veitir mikið öryggi í snjó, hálku og á ójöfnum vegum, sem gerir daglegan akstur áreynslulausan í krefjandi vetrarfærð.',
      'Á móti kemur að miðað við aðra á svipuðu verði drífur hann styttra og hleður hægar en flestir, enda rafhlaðan í minna lagi. Ef farið er reglulega í langferðir um landið býður Smart #5 Brabus upp á 35 km meiri drægni og um 40% styttri hleðslustopp á lægra verði, auk þess sem Skoda Enyaq RS drífur einnig lengra.',
      'Þetta er snöggur og öruggur fjölskyldubíll sem smellpassar í daglegt amstur, svo framarlega sem tíðari og lengri hleðslustopp á hringveginum henti þínum ferðavenjum.',
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
      'Toyota C-HR+ er sérstæður og formfagur krossari sem höfðar til þeirra sem vilja rótgróinn áreiðanleika Toyota í djarfari umbúðum. Hann hentar einkum sem lipur og hagkvæmur bíll til daglegra nota þar sem fólk leitar að lágum rekstrarkostnaði frekar en miklu afli.',
      'Helsti styrkur bílsins er hversu langdrægur hann er miðað við verð, enda er hann meðal þeirra ódýrustu á hvern kílómetra drægni í sínum verðflokki. Hann hleður jafnframt hraðar en flestir sambærilegir bílar, sem gerir hleðslustopp á langferðum þægilega stutt.',
      'Helsti gallinn er að bíllinn er framhjóladrifinn, auk þess að vera aflminni og hægari en flestir aðrir á svipuðu verði. Fyrir þá sem aka mikið í vetrarfærð eða vilja meira afl bjóða bílar á borð við Polestar 2 Long Range Dual Motor og Ford Capri upp á fjórhjóladrif og mun snarpari hröðun fyrir nánast sömu krónutölu.',
      'Toyota C-HR+ er því góður kostur fyrir þá sem setja mikla drægni, hraða hleðslu og traust merki í fyrsta sæti en þurfa ekki á fjórhjóladrifi að halda.',
    ],
    facts: 'd421ea0aac8c',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'toyota-c-hr-awd': {
    paragraphs: [
      'Toyota C-HR+ AWD er sportlegur og rennilegur jepplingur með sérstæða hönnun sem höfðar til þeirra sem vilja lipran bíl í þéttbýli en jafnframt gott öryggi á veturna. Hann býður upp á gott veggrip í hálku og snjó með fjórhjóladrifinu, í þægilegri og þéttri stærð.',
      'Helsti kostur bílsins er aflið, en hann er sneggri en flestir bílar í sínum verðflokki og býr yfir góðu afli til að taka fram úr eða komast af stað við erfiðar aðstæður. Drægnin dugar ágætlega í daglegan akstur og styttri ferðir milli landshluta.',
      'Helsti gallinn er að hann drífur styttra en flestir á svipuðu verði og hleður hægar en keppinautarnir þegar farið er í lengri ferðalög. Fyrir sama verð færðu til að mynda stærri bíl í Toyota bZ4X AWD, og BYD Sealion 7 kostar 200.000 kr. minna, er sneggri og býður upp á um 15% styttri hleðslustopp.',
      'Toyota C-HR+ AWD er athyglisverður fyrir þá sem vilja sérstakt útlit og lipurð, en gefur eftir í plássi og hleðsluhraða miðað við aðra valkosti á svipuðu verði.',
    ],
    facts: '83cb018c4f63',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'toyota-proace-city-verso-base': {
    paragraphs: [
      'Toyota Proace City Verso er hagnýtur og kassalaga fjölskyldubíll sem býður upp á allt að sjö sæti og mikið innanrými. Með rennihurðum og mikilli lofthæð hentar hann einkar vel barnafjölskyldum sem þurfa gott aðgengi að barnastólum og nóg pláss fyrir daglegan búnað.',
      'Hönnunin miðast alfarið við notagildi í daglegu amstri. Rennihurðirnar gera lífið auðveldara á þröngum bílastæðum og há sætisstaðan veitir gott útsýni í innanbæjarakstri. Að auki nýtur hann góðs af traustu þjónustuneti Toyota hér á landi.',
      'Rafdrifna hliðin er hins vegar veikasti hlekkurinn. Bíllinn drífur mjög stutt, hleður mjög hægt og er mjög aflítill, svo vetrarferðalög milli landshluta krefjast mikillar þolinmæði. Systurbíllinn Peugeot e-Rifter býður upp á nánast sama rými og tækni en er heilum 1.300.000 kr. ódýrari. Fyrir þá sem vilja meira ferðafrelsi býður Kia PV5 upp á 67 km meiri drægni og um 15% styttri hleðslustopp.',
      'Proace City Verso er þægilegur vinnuhestur fyrir stórar fjölskyldur innanbæjar, en á langferðum gefur hann verulega eftir og verðmiðinn er nokkuð stífur.',
    ],
    facts: 'f0d18eae8555',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-proace-verso-base': {
    paragraphs: [
      'Toyota Proace Verso er rúmgóður fjölnotabíll, byggður á sendibílsgrunni, með sæti fyrir allt að 9 manns. Hann er sniðinn fyrir stórar fjölskyldur eða fyrirtæki í fólksflutningum sem þurfa mörg sæti og hagnýtt rými í daglegum erindum.',
      'Helsti styrkur bílsins liggur í fólksflutningsgetunni og miklu innanrými, auk þess sem þjónusta og orðspor Toyota veita mörgum kaupendum traust. Í innanbæjarakstri og á styttri leiðum sinnir hann sínu hlutverki lipurlega með lágum rekstrarkostnaði.',
      'Bíllinn drífur hins vegar mjög stutt, sem finnst enn frekar í íslenskum vetrarkulda með fullskipaðan bíl, og hann hleður mjög hægt á langferðum. Hann er líka aflítill og framhjóladrifið getur reynst takmarkandi í snjó. Aðrir bílar bjóða oft meira fyrir peninginn: Peugeot e-Traveller er 1.100.000 kr. ódýrari með um 10% styttri hleðslustopp, og Hyundai STARIA Electric er 2.400.000 kr. ódýrari með 48 km meiri drægni og um 50% styttri hleðslustopp.',
      'Proace Verso er prýðilegur kostur í fólksflutninga á höfuðborgarsvæðinu, en drægnin og verðið gera hann síðri valkost sem alhliða ferðabíl fyrir landið allt.',
    ],
    facts: '59379ced9043',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-urban-cruiser-active-fwd': {
    paragraphs: [
      'Toyota Urban Cruiser er lítill og þægilegur jepplingur sem hentar vel í daglegan snúning og innanbæjarakstur. Hann höfðar sérstaklega til þeirra sem vilja háa setstöðu, einfalt viðmót og rótgróið þjónustunet Toyota hér á landi án þess að kaupa of stóran bíl.',
      'Hann er fremur ódýr og rafhlaðan dugar vel til allra venjulegra hversdagsferða, þótt reikna megi með að drægnin minnki í íslenskum vetrarkulda. Fyrir þá sem hlaða heima á nóttunni og aka mest í nærumhverfinu sinnir hann sínu hlutverki áreynslulaust.',
      'Á móti kemur að hann er mjög aflítill og drífur styttra en flestir bílar á svipuðu verði. Stærsti agnúinn á langferðum er hleðslan, en hann er meðal þeirra sem hlaða hægast í sínum verðflokki. Til samanburðar býður XPENG G6 RWD Standard Range upp á talsvert meira afl og um 55% styttri hleðslustopp á lægra verði, auk þess sem Renault Scenic E-Tech EV60 hleður hraðar og kostar minna.',
      'Urban Cruiser er því heppilegur kostur sem traustur og látlaus hversdagsbíll, en síður sniðinn fyrir þá sem leggja oft í langferðir um landið.',
    ],
    facts: '64536f9dc71c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'toyota-urban-cruiser-active-awd': {
    paragraphs: [
      'Toyota Urban Cruiser Active AWD er lipur, hækkaður bíll sem höfðar til þeirra sem vilja öryggi fjórhjóladrifs í íslenskri færð ásamt traustu orðspori Toyota. Hann er látlaus og þægilegur hversdagsbíll, einkum sniðinn fyrir fólk sem ekur mest innanbæjar og í nærsveitum.',
      'Fjórhjóladrifið er helsti kosturinn og veitir aukið veggrip og hugarró í snjó, krapi og hálku. Hann er fremur ódýr miðað við að vera með drif á öllum fjórum, en aflið er mjög hóflegt og dugar fyrst og fremst til rólegs og afslappaðs aksturs.',
      'Helsti gallinn er að bíllinn hleður mjög hægt og drægnin er með því stysta sem gerist í þessum verðflokki, sem kallar á þolinmæði á ferðalögum milli landshluta í vetrarkulda. Ef fjórhjóladrifið er ekki nauðsynlegt býður Toyota C-HR+ á sama verði upp á 61 km meiri drægni og um 45% styttri hleðslustopp. Fyrir þá sem vilja fjórhjóladrif og mun snarpari hleðslu er Smart #3 Pulse 100.000 kr. ódýrari og með um 40% styttri hleðslustopp.',
      'Niðurstaðan er sú að Urban Cruiser hentar einkum þeim sem setja fjórhjóladrif og þekkt vörumerki í forgang fyrir daglega rútínu, en þurfa sjaldan að reiða sig á hraðhleðslustopp á langferðum.',
    ],
    facts: 'd9aeb0b9edaa',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-buzz-gtx': {
    paragraphs: [
      'Volkswagen ID. Buzz GTX er sérstæður fjölskyldubíll sem sameinar rúmgott smárútuform og nostalgískt útlit við kosti rafbíls. GTX-útfærslan færir honum fjórhjóladrif og allt að sjö sæti, sem gerir hann að sniðugum valkosti fyrir stærri fjölskyldur sem vilja gott sætapláss og öruggt grip í snjó og hálku.',
      'Fjórhjóladrifið kemur sér vel í íslenskum vetraraðstæðum. Rennihurðirnar og kassalaga byggingarlagið bjóða upp á þægilegt aðgengi og mikið innanrými, sem auðveldar alla umgengni við barnastóla og farangur í daglegu lífi.',
      'Á móti kemur að hann er meðal þeirra sem drífa styst miðað við bíla á svipuðu verði, auk þess sem hann hleður hægar en flestir þeirra. Ef langferðir milli landshluta vega þungt býður til dæmis Hyundai IONIQ 9 Long Range AWD upp á 132 km meiri drægni og um 30% styttri hleðslustopp, fyrir 200.000 kr. hærra verð.',
      'ID. Buzz GTX er heillandi og hagnýtur fólksflutningabíll, en kaupendur greiða fremur fyrir form og hönnun en rafhlöðustærð og langdrægni á þjóðvegum.',
    ],
    facts: '5385fed6e084',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volkswagen-id-polo-base': {
    paragraphs: [
      'Volkswagen ID. Polo er lipur smábíll sem hentar einkar vel í daglegan akstur og innanbæjarrúntinn. Hann einkennist af snörpu viðbragði og góðu afli sem gerir hann léttan í þéttbýli og öruggan inn á stofnbrautir.',
      'Hann er mjög ódýr og drífur fremur stutt, en miðað við aðra á svipuðu verði drífur hann lengra en flestir og er ódýrari á hvern kílómetra drægni. Hann er með mjög litla rafhlöðu en er meðal þeirra sem hlaða hraðast í sínum flokki. Það flýtir fyrir á langferðum, þótt búast megi við að drægnin minnki í vetrarkulda.',
      'Hann er aðeins framhjóladrifinn og rýmið tekur mið af smábílastærðinni, svo hann gefur eftir í djúpum snjó og miklum farangri. Ef meiri orkuforði skiptir mestu máli býður Kia EV2 Long Range upp á 9 kWh stærri rafhlöðu, en þar eru hleðslustoppin um 25% lengri og bíllinn mun aflminni.',
      'Fyrir þá sem leita að liprum og hagkvæmum bíl sem reynist kvikur í bænum og liðtækur milli landshluta er ID. Polo afar fýsilegur kostur.',
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
      'Volkswagen ID.3 Pro er lipur fimm sæta hlaðbakur sem hentar sérstaklega vel í bæjarakstur og daglega notkun. Afturhjóladrifið veitir honum lítinn beygjuradíus sem gerir hann liðlegan í þröngum götum og á bílastæðum, ásamt þeim traustu aksturseiginleikum sem einkenna Volkswagen.',
      'Hann er mjög ódýr og drægnin dugar flestum prýðilega í hversdagsakstri. Þótt íslenskur vetrarkuldi bíti af drægninni kemst maður áreynslulaust allra sinna ferða innanbæjar og í styttri ferðalög milli nærliggjandi byggða án hleðsluáhyggna.',
      'Á móti kemur að hann hleður hægar en flestir í sínum verðflokki, sem lengir stopp á þjóðveginum. Fyrir þá sem vilja meiri kraft og hraðari ferðalög býður Smart #1 Pro+ upp á um 15% styttri hleðslustopp og 50 kW meira afl fyrir 100.000 kr. hærra verð. Kia EV3 Standard Range er sömuleiðis 99.000 kr. ódýrari og með framhjóladrif, sem getur reynst þægilegra í vetrarhálku.',
      'Fyrir kaupendur sem leita að liprum, hagkvæmum og traustum hversdagsbíl er Volkswagen ID.3 Pro samt sem áður mjög raunhæfur kostur.',
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
    facts: '12a0c6f371ef',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-4-gtx': {
    paragraphs: [
      'Volkswagen ID.4 GTX er sportlegri og kraftmeiri útgáfa af hinum þekkta fjölskyldujepplingi, með fjórhjóladrifi sem hentar íslenskum vetraraðstæðum vel. Hann höfðar einkum til þeirra sem vilja þægilegan og rúmgóðan bíl en kunna að meta aukið viðbragð þegar tekið er af stað eða tekið fram úr.',
      'Í daglegum akstri er hann stöðugur og lipur. Drægnin og hleðslan eru í meðallagi, sem þýðir að hann dugar vel í hversdagsrúntinn og í hefðbundnar langferðir, þótt reikna megi með að vetrarkuldinn stytti ferðina nokkuð.',
      'Á móti kemur að bíllinn sker sig lítið úr miðað við aðra á svipuðu verði. Frændi hans, Skoda Enyaq 85X, er til dæmis 200.000 kr. ódýrari og kemst örlítið lengra, þótt hann sé nokkru rólegri af stað. Ford Mustang Mach-E LR AWD er einnig 100.000 kr. ódýrari með meiri drægni, en hleðslustoppin á ferðalögum eru um 20% lengri.',
      'Volkswagen ID.4 GTX er traustur og öruggur fjölskyldubíll sem gerir flest vel, en í þessum verðflokki er erfitt að horfa fram hjá hagstæðari kostum.',
    ],
    facts: '65b5193b7488',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-4-pro-4motion': {
    paragraphs: [
      'Volkswagen ID.4 Pro 4MOTION er rúmgóður og traustur fjölskyldubíll með fjórhjóladrifi sem hentar íslenskum aðstæðum afar vel. Hann býður upp á þægilegan og fyrirsjáanlegan akstur með öruggu veggripi í snjó og bleytu, og hentar jafnt í daglega skutlið innanbæjar sem og í lengri ferðir á milli landshluta.',
      'Miðað við aðra bíla á svipuðu verði drífur hann lengra en flestir og er ódýrari á hvern kílómetra drægni. Rafhlaðan er stærri en gerist og gengur í þessum flokki, sem kemur sér vel í íslenskum vetrarkulda og veitir aukið öryggi á löngum leiðum þar sem stöðvar eru strjálar.',
      'Afl og hröðun eru hins vegar aðeins í meðallagi, þótt snerpan dugi vel við allar venjulegar aðstæður. Ef meiri kraftur og leifturhröð hleðsla skipta mestu máli býður XPENG G6 AWD Performance upp á um 25% styttri hleðslustopp og Hyundai IONIQ 5 um 40% styttri hleðslustopp. Fyrir þá sem vilja hefðbundinn, hagnýtan og þrautreyndan rafbíl er ID.4 engu að síður eitt öruggasta valið.',
    ],
    facts: 'c4a184d802f3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volkswagen-id-7-gtx': {
    paragraphs: [
      'Volkswagen ID.7 GTX er stór, hljóðlátur og rúmgóður fjölskyldubíll með fjórhjóladrifi. Hann býður upp á eiginleika lágs og rennilegs langbaks með stöðugri aksturshegðun og ríflegu plássi, sem hentar einkar vel þeim sem ferðast mikið og vilja öruggt vetrargrip án þess að velja hefðbundinn jeppling.',
      'Helstu styrkleikar hans felast í drægninni og hleðslunni. Hann drífur lengra en flestir bílar á svipuðu verði og er með stærri rafhlöðu en gengur og gerist, sem veitir aukið öryggi í frosti og á löngum leiðum milli landshluta. Þá hleður hann hraðar en flestir í sama verðflokki, svo stoppin á þjóðveginum verða snörp.',
      'Á móti kemur að hann er fremur dýr, á meðan afl og hröðun eru aðeins í meðallagi miðað við verðið. Fyrir þá sem vilja meiri kraft er Polestar 4 SUV Long Range Dual Motor 200.000 kr. ódýrari og 1,6 s sneggri í 0-100 km/klst, þótt hleðslustoppin þar séu um 10% lengri. BMW iX3 40 býður upp á 53 km meiri drægni, en er aðeins afturhjóladrifinn á meðan ID.7 tryggir betra grip í hálku.',
      'Fyrir þá sem leita að rúmgóðum og þægilegum langferðabíl með fjórhjóladrifi er Volkswagen ID.7 GTX heilsteyptur og traustur kostur.',
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
      'Volvo ES90 Twin Motor Performance er stór og vandaður lúxusfólksbíll sem leggur áherslu á þægindi, öryggi og mikið afl. Hann hentar vel þeim sem ferðast mikið og vilja hljóðlátan og fágaðan langferðabíl með góðu plássi í stað hefðbundins jepplings.',
      'Stærsti styrkleikinn er hve langt bíllinn drífur, en hann kemst lengra en flestir í sínum verðflokki. Rafhlaðan er mjög stór og bíllinn hleður mjög hratt, svo vetrarferðir milli landshluta krefjast lítillar fyrirhafnar. Fjórhjóladrifið og mikið aflið veita auk þess mikið öryggi og snögg viðbrögð í hálku og snjó.',
      'Bíllinn er hins vegar fremur dýr og lágbyggðari en hefðbundinn jepplingur á borð við Porsche Macan 4 Electric, sem býður þó upp á 68 km minni drægni. Hinn sportlegi Mercedes-Benz CLA AMG 45 4MATIC+ er 1 s sneggri í hundraðið en hefur á móti aðeins pláss fyrir fjóra.',
      'Fyrir þá sem leita að rúmgóðum lúxusfólksbíl með mikla drægni og traust fjórhjóladrif er ES90 sérlega heilsteyptur kostur.',
    ],
    facts: 'b3e42392fb8e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex40-recharge-twin': {
    paragraphs: [
      'Volvo EX40 Recharge Twin er kraftmikill og hár fjölskyldujepplingur með klassísku, kassalaga lagi sem veitir gott útsýni. Hann hentar sérlega vel þeim sem vilja vandaðan jeppling með öruggu fjórhjóladrifi og miklu afli sem ræður áreynslulaust við snjóþunga vetrardaga.',
      'Bíllinn er fremur aflmikill og sneggri en flestir bílar á svipuðu verði, enda skila mótorarnir tveir frábæru veggripi í hálku. Hann er einnig með stærri rafhlöðu en flestir í sínum verðflokki, sem kemur sér vel í kulda, þótt heildardrægnin sé í meðallagi.',
      'Á móti kemur að hann er fremur dýr og hraðhleðslan í meðallagi á ferðalögum. Ef drægnin skiptir mestu máli býður Toyota bZ4X Touring upp á 23 km meiri drægni á sama verði, en er framhjóladrifinn og mun aflminni. Sé frekar leitað eftir rennilegra útliti býður systurbíllinn Volvo EC40 Recharge Twin upp á 14 km meiri drægni og um 5% styttri hleðslustopp.',
      'Fyrir þá sem vilja öruggan, háan og afar sprækan sænskan jeppling fyrir allar árstíðir er EX40 engu að síður traustur kostur.',
    ],
    facts: '5c9dd30ae76d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex30-single-motor': {
    paragraphs: [
      'Volvo EX30 Single Motor er nettur og lipur borgarjepplingur með látlausu skandinavísku yfirbragði. Hann hentar einkum þeim sem vilja vandaðan og stílhreinan hversdagsbíl fyrir innanbæjarakstur og styttri vinnuferðir, frekar en stórar fjölskyldur sem þurfa mikið farangurspláss.',
      'Þrátt fyrir að vera ódýrasta útgáfan er hann sneggri og aflmeiri en flestir bílar á svipuðu verði. Hröðunin er lipur og bíllinn finnst sérlega léttur og kvikur í daglegum akstri á götum borgarinnar.',
      'Mesta eftirgjöfin liggur í rafhlöðunni, en hún er með þeim minnstu í sínum verðflokki. Drægnin er meðal þess stysta sem gerist á þessu verði og dugar skammt í íslenskum vetrarkulda milli landshluta, auk þess sem hann hleður hægar en flestir keppinautarnir. Ef öruggara vetrargrip og lengri ferðir skipta máli býður Smart #1 Pulse til dæmis upp á fjórhjóladrif, meiri drægni og um 15% styttri hleðslustopp fyrir aðeins 100.000 kr. meira.',
      'Þetta er frábær og skemmtilegur borgarbíll, en hentar síður sem eini bíll fyrir fólk sem ferðast mikið um landið að vetrarlagi.',
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
      'Volvo EX30 Twin Motor Performance er lipur og hljóðlátur jepplingur þar sem skandinavísk fágun mætir miklu afli. Hann hentar sérstaklega vel ökumönnum sem vilja nettan bíl í daglegan innanbæjarakstur en kunna að meta fágaðan stíl og leiftursnögg viðbrögð.',
      'Helsti styrkur bílsins liggur í hröðuninni, en hann er meðal þeirra sneggstu í sínum verðflokki og mun aflmeiri en flestir á svipuðu verði. Fjórhjóladrifið tryggir gott veggrip í snjó og hálku, sem gerir vetrarakstur á íslenskum vegum bæði öruggan og áhyggjulausan.',
      'Á móti kemur að hann drífur fremur stutt, er með minni rafhlöðu en flestir á svipuðu verði og dýrari á hvern kílómetra drægni. Fyrir þá sem aka reglulega milli landshluta og vilja meiri drægni gæti Subaru Uncharted hentað betur, eða MG MGS6 Dual Motor, þótt hleðslustoppin á honum séu um 25% lengri.',
      'EX30 er sniðinn fyrir þá sem leita að kraftmiklum og vönduðum fjórhjóladrifsbíl, svo lengi sem hann þarf ekki fyrst og fremst að þjóna sem langferðabíll.',
    ],
    facts: 'd369d9b20156',
    model: 'gemini-3.8-flash, thinking high',
  },
  'volvo-ex30-cross-country-twin-motor-performance': {
    paragraphs: [
      'Volvo EX30 Cross Country Twin Motor Performance er nettur, hækkaður jepplingur sem sameinar lipra smábílastærð og hreint út sagt ótrúlegan kraft. Hann er sniðinn fyrir þá sem vilja grófara útlit, öruggt fjórhjóladrif í íslenskum vetraraðstæðum og eldsnögg viðbrögð, en þurfa ekki stóran fjölskyldubíl.',
      'Helsti styrkur bílsins liggur í afli hans, en hann er meðal þeirra sneggstu í sínum verðflokki. Fjórhjóladrifið grípur einstaklega vel í snjó og hálku og bíllinn er einkar lipur í hversdagslegum snúningum, þar sem auðvelt er að smeygja honum í þröng bílastæði.',
      'Á móti kemur að hann drífur styttra en flestir bílar á svipuðu verði og hleður hægar en flestir þeirra á ferðalögum milli landshluta. Hann er einnig meðal þeirra dýrustu á hvern kílómetra drægni og innanrýmið er nokkuð þröngt fyrir farþega og farangur. Ef meira hefðbundið pláss, mýkri akstur og örlítið meiri drægni henta betur gæti Mercedes-Benz EQA SUV 300 4MATIC verið vænlegri kostur.',
      'Bíllinn er fyrst og fremst spennandi val fyrir þá sem vilja leikgleði, mikinn kraft og traust grip í nettum pakka frekar en hámarks pláss eða drægni á langferðum.',
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
      'Volvo EX60 P12 er öflugur lúxusjepplingur með fjórhjóladrifi sem byggir á traustu orðspori merkisins fyrir öryggi og vandaðan frágang. Hann hentar einkum kröfuhörðum fjölskyldum sem þurfa bíl sem stendur af sér krefjandi vetrarfærð og kemst áreynslulaust milli landshluta í öllum veðrum án nokkurs drægnikvíða.',
      'Helsti styrkur bílsins liggur í gríðarlegri drægni og risastórri rafhlöðu, en hann drífur lengst allra bíla í sínum verðflokki. Hann er jafnframt mjög aflmikill og snöggur í viðbragði, auk þess sem hann hleður meðal þeirra allra hröðustu. Þetta þýðir sérstaklega stutt hleðslustopp á ferðalögum og mikið öryggi við framúrakstur.',
      'Hér er þó um fremur dýran bíl að ræða sem fær engan ríkisstyrk. Þótt hann bjóði meiri drægni og afl á hagstæðara verði en keppinautarnir, gætu þeir sem kjósa hefðbundinn fólksbíl fram yfir jeppling skoðað Mercedes-Benz C 400 4MATIC, eða horft til BMW iX3 50 xDrive ef sérstök áhersla er lögð á sportlega aksturseiginleika.',
      'Fyrir þá sem leita að rúmgóðum fjölskyldubíl með mesta mögulega langdrægi á íslenskum vegum býður Volvo EX60 P12 einfaldlega upp á ótrúlega mikla getu fyrir peninginn.',
    ],
    facts: 'dfac4e58fd9b',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'volvo-ex90-twin-motor': {
    paragraphs: [
      'Volvo EX90 Twin Motor er stór og veglegur lúxusjeppi sem býður upp á allt að sjö sæti og ríka áherslu á öryggi og fágaðan akstur, eins og merkið er þekkt fyrir. Hann hentar sérstaklega stórum fjölskyldum sem leita að hljóðlátum og vönduðum ferðabíl sem fer vel með hópinn í löngum ferðalögum hvernig sem viðrar.',
      'Stærsti styrkur hans felst í gríðarstórri rafhlöðu sem skilar ríflegri drægni, enda drífur hann lengra en flestir í sínum verðflokki. Fjórhjóladrifið tryggir öruggt grip í vetrarfærð og snjó, og drægnin dugar vel til að ferðast á milli landshluta án stöðugra hleðsluáhyggna, jafnvel í íslenskum kulda.',
      'Á móti kemur að hann hleður hægar en flestir á svipuðu verði, auk þess sem hann gefur eftir í hröðun og afli miðað við samkeppnina. Ef styttri hleðslustopp skipta máli er Hyundai IONIQ 9 Long Range Performance AWD mun ódýrari kostur með nær sömu drægni og um 25% styttri hleðslustopp.',
      'Fyrir þá sem vilja hámarksöryggi, mikla drægni og skandinavísk gæði er EX90 hins vegar afar heildstæður lúxusjeppi sem stendur vel undir sínu.',
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
      'XPENG G6 Standard Range er rúmgóður skutbaksjepplingur með rennilega línu, tæknivætt innanrými og lipran akstursmáta. Hann hentar fjölskyldum og ökumönnum sem leita að þægilegum og rúmgóðum bíl sem nýtist jafnt í daglegan innanbæjarakstur sem og lengri ferðir.',
      'Stærsti styrkleiki bílsins liggur í hleðslutækninni, en miðað við aðra á svipuðu verði er hann meðal þeirra sem hlaða hraðast. Hleðslustopp á langferðum eru merkjanlega styttri en hjá keppinautunum, sem skiptir miklu máli á íslenskum þjóðvegum. Hann er einnig aflmeiri og sneggri en flestir bílar í sínum verðflokki, sem skilar sér í fumlausum framúrakstri og skemmtilegri svörun.',
      'Helsti ókosturinn er að drægnin er styttri en hjá flestum á svipuðu verði, og í vetrarkulda má búast við að hún dragist enn frekar saman. Einnig er hann eingöngu afturhjóladrifinn. Ef traust vetrargrip í snjó og hálku skiptir öllu máli gæti fjórhjóladrifinn Leapmotor C10 ProMax AWD hentað betur fyrir svipað verð, þótt hleðslustoppin í honum séu umtalsvert lengri.',
      'XPENG G6 er á heildina litið afar fýsilegur kostur fyrir þá sem vilja rúmgóðan bíl og meta snögga hraðhleðslu meira en aldrif.',
    ],
    facts: 'd19809f0083d',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g6-rwd-long-range': {
    paragraphs: [
      'XPENG G6 er rúmgóður og tæknivæddur sportjepplingur sem hentar sérstaklega vel þeim sem aka mikið milli landshluta. Hann einkennist af nútímalegri hönnun og mikilli orkurýmd, sem gerir langferðir mun áhyggjulausari.',
      'Stærsti styrkur hans liggur í mikilli hagkvæmni, en bíllinn er ódýrari á hvern kílómetra drægni en flestir á svipuðu verði. Hann er með einni stærstu rafhlöðunni í sínum verðflokki, drífur lengra en flestir og er meðal þeirra sem hlaða hraðast. Í daglegu lífi og á lengri ferðalögum þýðir þetta færri og sérlega stutt hleðslustopp.',
      'Á móti kemur að þessi útgáfa er eingöngu afturhjóladrifin. Fyrir þá sem búa við krefjandi vetrarfærð og vilja meira grip í snjó gætu fjórhjóladrifnir valkostir á borð við Skoda Elroq 85x eða Kia EV3 Long Range AWD hentað betur, þótt hleðslustoppin verði umtalsvert lengri í þeim.',
      'Fyrir ökumenn sem setja langdrægni og skjóta hleðslu í forgang, og þurfa ekki nauðsynlega á fjórhjóladrifi að halda, býður XPENG G6 upp á afar mikið fyrir peninginn.',
    ],
    facts: 'e1aec00acaa1',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g6-awd-performance': {
    paragraphs: [
      'XPENG G6 AWD Performance er rennilegur og tæknivæddur jepplingur með coupe-lagi sem hentar vel þeim sem vilja mikið afl og snögg viðbrögð í daglegum akstri. Fjórhjóladrifið veitir traust grip í snjó og hálku á íslenskum vetrarvegum, og miðað við aðra bíla á svipuðu verði er hann bæði meðal þeirra sneggstu og aflmestu.',
      'Stærstu styrkleikar bílsins liggja í rafhlöðunni og hleðslutækninni. Hann er með einni af stærstu rafhlöðunum í sínum verðflokki og drífur lengra en flestir, sem kemur sér vel í langkeyrslu milli landshluta í misjöfnum veðrum. Þegar komið er að hraðhleðslustöð er hann jafnframt meðal þeirra sem hlaða hraðast á svipuðu verði, sem þýðir merkjanlega styttri hlé á ferðalögum.',
      'Á móti er XPENG tiltölulega nýtt merki hér á landi og flestum aðgerðum er stýrt í gegnum snertiskjá frekar en hefðbundna hnappa. Kaupendur sem kjósa rótgrónara evrópskt merki gætu frekar horft til Volkswagen ID.4 Pro 4MOTION, þótt hann hafi minna afl og um 35% lengri hleðslustopp. Fyrir þá sem vilja mikla drægni, snögga hleðslu og mikil afköst fyrir verðið er G6 sérlega áhugaverður kostur.',
    ],
    facts: 'edf5bd30c2ba',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-g9-awd-performance': {
    paragraphs: [
      'XPENG G9 AWD Performance er stór og veglegur lúxusjepplingur sem leggur mikla áherslu á þægindi, mikinn kraft og háþróaðan tæknibúnað. Hann hentar einkum fjölskyldum og þeim sem leita að rúmgóðum, hljóðlátum og öflugum ferðabíl sem fer létt með krefjandi íslenskar vetraraðstæður.',
      'Helsti styrkleiki bílsins er hraðhleðslan, en miðað við aðra í sínum verðflokki er hann meðal þeirra sem hlaða hraðast. Á ferðalögum um landið þýðir þetta óvenju stuttan viðkomutíma við hraðhleðslustöðvar. Fjórhjóladrifið og aflið gera hann jafnframt sneggri en flestir bílar á svipuðu verði, sem veitir mikið öryggi í hálku og snjó.',
      'Á móti kemur að miðað við aðra á svipuðu verði drífur hann styttra en flestir. Ef hámarksdrægni milli hleðslna skiptir meira máli en stutt hleðslustopp gæti Volvo EX60 P10 hentað betur með 120 km meiri drægni, eða Audi Q6 e-tron sem býður 85 km meiri drægni ásamt rótgrónu evrópsku vörumerki.',
      'Fyrir þá sem setja lúxus, mikinn snarleika og framúrskarandi hraðhleðslutækni á langferðum í fyrsta sæti er G9 engu að síður afar freistandi kostur.',
    ],
    facts: '21ec7198ea17',
    model: 'gemini-3.8-flash, thinking medium',
  },
  'xpeng-x9-awd-performance': {
    paragraphs: [
      'XPENG X9 AWD Performance er stór og lúxusmiðaður sjö sæta fjölnotabíll með framúrstefnulegu útliti, sniðinn fyrir stórar fjölskyldur eða fólksflutninga þar sem þægindi sitja í fyrirrúmi. Hann býður upp á mikið rými í öllum sætaröðum og fjórhjóladrifið veitir öruggt grip í íslenskri vetrarfærð.',
      'Stærsti styrkur bílsins er hleðslutæknin, en hann hleður hraðast allra rafbíla sem seldir eru hér á landi. Þrátt fyrir gríðarstóra 110 kWh rafhlöðu tekur afar lítinn tíma að hlaða á langferðum. Hann er einnig aflmeiri en flestir í sínum verðflokki, sem kemur sér vel í svo stórum bíl, þótt hann sé hægari af stað en flestir á svipuðu verði.',
      'Á móti kemur að hann er dýr og drífur styttra en flestir á svipuðu verði. Ef meiri drægni vegur þyngra er Hyundai IONIQ 9 Long Range AWD 400.000 kr. ódýrari og býður upp á 35 km meiri drægni, þótt hleðslustoppin verði um 90% lengri.',
      'X9 hentar þeim sem vilja rúmgóðan og lúxusfullan sjö sæta ferðabíl og meta hraðari hleðslu á langferðum meira en allt annað.',
    ],
    facts: 'ac75f896cbc6',
    model: 'gemini-3.8-flash, thinking medium',
  },
}

export default carReviews
