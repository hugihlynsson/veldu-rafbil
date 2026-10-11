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
      'Audi A6 e-tron Sportback quattro er rennilegur og lágur hlaðbakur sem höfðar sérstaklega til þeirra sem aka reglulega á milli landshluta og kjósa sportlega aksturseiginleika og lága loftmótstöðu fram yfir jepplingalag. Hann býður upp á mikil þægindi, fágaðan lúxus og mikinn stöðugleika á þjóðveginum.',
      'Bíllinn drífur mjög langt og dugar því prýðilega í langferðir, jafnvel í íslenskum vetrarkulda. Hann hleður mjög hratt, sem styttir stopp á hleðslustöðvum úti á landi til muna. Fjórhjóladrifið tryggir öruggt grip í snjó og hálku, og miðað við aðra í sínum verðflokki er hann bæði aflmeiri og sneggri en flestir, sem gerir framúrakstur lipran og áreynslulausan.',
      'Á móti kemur að lág byggingin býður ekki upp á sömu yfirsýn eða veghæð og hefðbundinn jepplingur. Fyrir þá sem þurfa meira pláss undir botninn í ófærð gæti Audi Q6 e-tron hentað betur, og ef hámarksdrægni fyrir aðeins lægra verð vegur þyngst kemst Mercedes-Benz CLA 350 4MATIC enn lengra á hleðslunni.',
      'Fyrir þá sem vilja fágaðan bíl sem sameinar mikla drægni, hraða hleðslu og aflmikið fjórhjóladrif á þjóðvegum er A6 e-tron heilsteyptur og traustur kostur.',
    ],
    facts: '528cb113b364',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-a6-e-tron-avant-quattro': {
    paragraphs: [
      'Audi A6 e-tron Avant quattro er stór og vandaður rafdrifinn langbakur sem hentar sérstaklega vel fyrir langferðir og fjölskyldulífið. Hann sker sig úr með lágri og rennilegri hönnun sem veitir mun betri loftmótstöðu en hefðbundnir jepplingar bjóða upp á, og fjórhjóladrifið tryggir öruggt grip í krefjandi vetrarfærð.',
      'Helsti styrkur hans er samspil mikillar drægni og hraðrar hleðslu. Rafhlaðan dugar vel á milli landshluta jafnvel í íslenskum vetrarkulda, og stopp við hraðhleðslustöðvar eru stutt þar sem hann hleður hraðar en flestir í sínum verðflokki. Hann er líka sneggri af stað og aflmeiri en keppinautarnir á svipuðu verði, sem gerir daglegan akstur áreynslulausan og skemmtilegan.',
      'Á móti kemur að lág byggingin býður ekki upp á sömu veghæð eða yfirsýn yfir umferðina og jepplingar. Ef hærri sætisstaða er forgangsatriði gæti Audi Q6 e-tron hentað betur, þótt hann komist skemur á hleðslunni. Viljirðu enn meiri drægni og um 20% styttri hleðslustopp kemur Mercedes-Benz CLA Shooting Brake 350 4MATIC einnig sterklega til greina, þótt sá sé nokkru aflminni.',
      'Fyrir þá sem vilja rúmgóðan og snöggan langferðabíl með mikla drægni án þess að fara jepplingaleiðina er A6 Avant ákaflega heillandi kostur.',
    ],
    facts: '5124bada378e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-e-tron-gt-quattro': {
    paragraphs: [
      'Audi e-tron GT quattro er lágur og straumlínulagaður sportbíll sem höfðar til þeirra sem leita að kraftmikilli akstursupplifun, mikilli vegfestu og glæsilegu útliti frekar en hefðbundnu notagildi. Hann rúmar allt að fimm manns en er fyrst og fremst hannaður í kringum ökumanninn og lága sætisstöðu.',
      'Bíllinn er mjög snöggur og aflmikill, sneggri og aflmeiri en flestir í sínum verðflokki. Fjórhjóladrifið tryggir öruggt grip í snjó og hálku, og hann hleður fremur hratt á ferðalögum milli landshluta.',
      'Á móti kemur að hann drífur fremur stutt og er meðal þeirra sem drífa styst miðað við aðra á svipuðu verði, sem þýðir að drægnin skerðist töluvert í vetrarkulda. Fyrir þá sem þurfa hærri bíl með meira rými og meiri drægni væri Audi SQ6 e-tron heppilegri kostur á sama verði, með 111 km meiri drægni.',
      'Þetta er dýr bíll sem kaupendur velja með hjartanu, sniðinn fyrir þá sem setja akstursánægju og hönnun fram yfir praktísk hversdagsnot.',
    ],
    facts: '1a0ffdfe8771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q4-e-tron-45-quattro': {
    paragraphs: [
      'Audi Q4 e-tron 45 quattro er vandaður og fágunarlegur fjölskyldujepplingur sem höfðar til þeirra sem kunna að meta þýsk smíðagæði, lágværan akstur og rótgróið úrvalsmerki. Hann hentar vel ökumönnum sem leita að þægilegum og stöðugum hversdagsbíl þar sem farið er vel með alla í bílnum.',
      'Helsti kostur hans er hið trausta quattro fjórhjóladrif og mikil akstursþægindi. Í íslenskri vetrarfærð, snjó og hálku veitir drifkerfið mikið öryggi og gott grip, á meðan góð hljóðvist og vönduð fjöðrun gera langferðir einkar áreynslulausar.',
      'Á móti kemur að miðað við aðra í sínum verðflokki drífur hann styttra en flestir og hleður hægar en flestir. Fyrir svipað verð býður Smart #5 Brabus til dæmis upp á mun sneggri hröðun og um 40% styttri hleðslustopp, auk þess sem Nissan Ariya e-4ORCE er 500.000 kr. ódýrari kostur.',
      'Fyrir þá sem setja fágun, innanrýmisgæði og hefðbundið yfirbragð Audi í öndvegi er þetta fínn kostur, en tæknilega séð færðu meiri afköst og drægni fyrir peninginn hjá samkeppnisaðilum.',
    ],
    facts: '306c55238898',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-base': {
    paragraphs: [
      'Audi Q6 e-tron er háreistur og rúmgóður lúxusjepplingur sem hentar fjölskyldum sem leita að þægilegum og öruggum ferðabíl. Hann einkennist af fágaðri gæðatilfinningu, góðu útsýni yfir veginn og traustu fjórhjóladrifi sem reynist sérlega vel í snjó og krefjandi vetrarfærð.',
      'Bíllinn drífur mjög langt og hleður fremur hratt. Í daglegu lífi þýðir þetta að hefðbundnar langferðir milli landshluta verða áhyggjulausar, jafnvel í vetrarkulda og mótvindi þar sem rafhlaðan veitir ríflegan varasjóð, og stopp við hleðslustöðvar taka skamman tíma.',
      'Miðað við aðra bíla á svipuðu verði er hann hins vegar hægari en flestir í hröðun. Ef þú vilt frekar lægri bíl með enn meiri drægni og um 10% styttri hleðslustoppum gæti Audi A6 e-tron Avant quattro hentað betur, en Volvo EX60 P10 býður upp á mun meira afl í svipuðu jepplingslagi.',
      'Fyrir þá sem vilja háan og vandaðan fjölskyldujeppling með mikla drægni og örugga vetrareiginleika er Q6 e-tron traustur kostur.',
    ],
    facts: 'c719fcff91c1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-q6-e-tron-sportback': {
    paragraphs: [
      'Audi Q6 e-tron Sportback er straumlínulagaður lúxusjepplingur sem sameinar hærri setstöðu og rennilegan baksvip. Hann hentar þeim sem leita að fáguðum og hljóðlátum ferðabíl með traustu fjórhjóladrifi sem ræður léttilega við krefjandi vetrarfærð.',
      'Stærsti kostur hans felst í langferðagetu. Hann drífur mjög langt og kemst lengra en flestir miðað við aðra á svipuðu verði. Hann hleður jafnframt mjög hratt, sem þýðir að hleðslustopp á þjóðveginum verða stutt og þægileg jafnvel þótt vetrarkuldinn bíti aðeins í rafhlöðuna.',
      'Hins vegar gefur hann eftir í snerpu, en miðað við bíla á svipuðu verði er hann hægari en flestir úr kyrrstöðu. Volvo EX60 P10 er til dæmis 700.000 kr. ódýrari, 1,3 sekúndum sneggri í hundraðið og með um 15% styttri hleðslustopp. Viljirðu frekar hefðbundinn skutbíl er Audi A6 e-tron Avant quattro einnig 800.000 kr. ódýrari og sneggri.',
      'Q6 Sportback er því einkum fyrir þá sem vilja háa sætisstöðu og sportlegt útlit, en maður borgar talsvert fyrir formið miðað við afköstin.',
    ],
    facts: 'a587638043c0',
    model: 'gemini-3.8-flash, thinking high',
  },
  'audi-sq6-e-tron-base': {
    paragraphs: [
      'Audi SQ6 e-tron er kraftmikill lúxusjepplingur sem leggur áherslu á sportlega frammistöðu og þægindi. Hann hentar einkum þeim sem vilja rúmgóðan fjölskyldubíl en gera um leið ríka kröfu um mikla snerpu og öruggt fjórhjóladrif í vetrarfærð.',
      'Helsti styrkur hans felst í hröðuninni, en hann er sneggri úr kyrrstöðu en flestir bílar á svipuðu verði. Fjórhjóladrifið tryggir gott grip í snjó og hálku, og bíllinn drífur fremur langt, sem veitir gott öryggi í langferðum milli landshluta.',
      'Á móti kemur að hann er dýrari á hvern kílómetra drægni en flestir í sínum verðflokki, og drægnin er í meðallagi miðað við verðið. Fyrir þá sem vilja hámarksdrægni býður BMW iX xDrive 60 Sport upp á 103 km meiri drægni, og Porsche Cayenne tekur um 30% styttri hleðslustopp.',
      'Fyrir kaupendur sem leita að snöggum og vönduðum jepplingi er SQ6 e-tron heillandi kostur, en fórnin felst í því að aðrir dýrir bílar komast lengra eða stoppa skemur á hleðslustöðvum.',
    ],
    facts: '6be7cb5413e8',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-40-xdrive': {
    paragraphs: [
      'BMW i4 40 xDrive er lágur og rennilegur fólksbíll sem leggur áherslu á sportlega akstursupplifun og vandaða smíði. Hann höfðar einkum til þeirra sem vilja lipran akstur á malbiki og fágun frekar en hefðbundinn jeppling.',
      'Fjórhjóladrifið veitir gott grip í snjó og hálku, og bíllinn er fremur snöggur og aflmikill sem nýtist vel við framúrakstur. Hann hleður fremur hratt og drægnin dugar vel í daglegu lífi sem og í flestar ferðir milli landshluta, jafnvel þótt íslenskur vetrarkuldi dragi nokkuð úr henni.',
      'Miðað við aðra á svipuðu verði drífur hann þó styttra en flestir og hleður hægar en flestir. Ef meira rými og lengri ferðir heilla er Audi Q6 e-tron Sportback til dæmis 400.000 kr. ódýrari, hefur 91 km meiri drægni og tekur um 35% styttri hleðslustopp. Á sama verði býður Mercedes-Benz GLC 300 4MATIC einnig upp á 67 km meiri drægni og um 25% styttri hleðslustopp.',
      'Hann hentar ökumönnum sem setja hefðbundna akstursánægju og lágreistan lúxus í forgang, en sem rúmgóður langferðabíll gefur hann eftir gagnvart stærri keppinautum.',
    ],
    facts: 'c8b9a2c3cd23',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i4-m60-xdrive': {
    paragraphs: [
      'BMW i4 M60 xDrive er lágur og sportlegur fólksbíll sem er sniðinn að þeim sem hafa unun af akstri. Hann sker sig úr með miklu afli og hröðun sem gerir hann að einum sneggsta bílnum á veginum, þar sem snerpa og kraftur eru í forgrunni frekar en hefðbundið jepplingasnið.',
      'Fjórhjóladrifið tryggir gott veggrip í vetrarfærð og hálku, svo allur þessi kraftur nýtist vel allan ársins hring. Hann drífur fremur langt og hleður fremur hratt, sem veitir gott öryggi þegar haldið er í ferðalög milli landshluta.',
      'Miðað við aðra á svipuðu verði drífur hann þó styttra en flestir og er með einni af minnstu rafhlöðunum. Ef þú vilt hærri sætisstöðu, meira rými og um 30% styttri hleðslustopp er Porsche Macan 4 Electric heppilegri kostur, rétt eins og hinn stærri Polestar 3 Performance.',
      'BMW i4 M60 xDrive er fyrst og fremst fyrir kaupandann sem setur aflið, leifturhraða og hefðbundið fólksbílalag fram yfir praktískt jepplingapláss.',
    ],
    facts: '8890a1c90b99',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-edrive40': {
    paragraphs: [
      'BMW i5 eDrive40 er stór lúxusfólksbíll í hefðbundnum stallbaksstíl, þar sem lögð er áhersla á fágaðan akstur, hljóðlátt innanrými og mikil þægindi á langferðum. Hann hentar þeim sem meta klassísk gæði og vilja hefðbundinn fólksbíl með lágri veghæð frekar en hábyggðan jeppling.',
      'Bíllinn drífur fremur langt og kemst á milli landshluta án fyrirhafnar, jafnvel í íslenskum vetrarkulda. Í daglegum akstri nýtur maður góðrar hljóðeinangrunar og lipurðar, enda gefur afturhjóladrifið honum einkennandi og skemmtilega aksturseiginleika á greiðfærum vegum.',
      'Á móti kemur að miðað við aðra bíla á svipuðu verði er hann aflminni og hleður hægar en flestir. Afturhjóladrifið krefst líka meiri aðgæslu í snjó og hálku en fjórhjóladrif. Fyrir þá sem vilja meira grip að vetrarlagi og snarpari hröðun er Polestar 3 Performance mun öflugri valkostur með fjórhjóladrifi.',
      'Fyrir kaupendur sem leita að hljóðlátum og fáguðum langferðabíl með sannaða akstursánægju er i5 engu að síður mjög álitlegur kostur.',
    ],
    facts: '1c309ab62c34',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-i5-m60-xdrive': {
    paragraphs: [
      'BMW i5 M60 xDrive er öflugur lúxusfólksbíll sem sameinar þægindi fimmtu línunnar og mikið afl M-deildarinnar. Hann hentar þeim sem leita að fáguðum stallbak með sportlega aksturseiginleika fremur en hábyggðum jepplingi.',
      'Bíllinn er sneggri en flestir í sínum verðflokki og fjórhjóladrifið veitir mikið öryggi og grip í snjó og hálku. Vönduð hljóðeinangrun og hefðbundin þægindi gera hann að liðugum og notalegum langferðabíl á greiðfærum vegum.',
      'Á móti kemur að bíllinn er meðal þeirra sem drífa styst miðað við aðra á svipuðu verði og hleður fremur hægt. Porsche Taycan 4S Plus er til dæmis ódýrari og býður upp á um 50% styttri hleðslustopp á langferðum. Fyrir þá sem vilja meira pláss og veghæð er Audi SQ6 e-tron einnig mun ódýrari kostur sem kemst lengra á hleðslunni.',
      'Bíllinn höfðar fyrst og fremst til þeirra sem vilja hefðbundinn og kraftmikinn akstursbíl frá BMW, en kaupendur greiða talsvert fyrir afköstin fremur en drægni og hleðslugetu.',
    ],
    facts: 'eff3ad7deb4c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-45-sport': {
    paragraphs: [
      'BMW iX xDrive 45 Sport er stór lúxusjeppi sem leggur mikla áherslu á hljóðlát þægindi og mjúkan akstur. Hann einkennist af rúmgóðu innanrými og hárri setustöðu, og hentar fólki sem leitar að fágaðri vellíðan og öruggu fjórhjóladrifi sem ræður vel við íslenskar vetraraðstæður.',
      'Bíllinn drífur fremur langt og kemst vel á milli landshluta, jafnvel í vetrarkulda þegar drægnin minnkar nokkuð. Fjórhjóladrifið veitir mikið öryggi á snævi þöktum vegum og aksturinn er yfirvegaður og traustur, sem gerir langkeyrslur afslappaðar í öllum veðrum.',
      'Miðað við aðra bíla á svipuðu verði hleður hann hægar en flestir og er aflminni. Ef styttri hleðslustopp og snerpa skipta mestu máli býður Porsche Macan 4s Electric upp á um 40% styttri hleðslustopp og meiri kraft, þótt hann sé minni bíll. Á móti hefur iX meira afl og meiri drægni en Mercedes-Benz EQE SUV 350 4MATIC á sama verði.',
      'Fyrir þá sem meta ríflegt rými og ljúfa akstursupplifun meira en mikinn kraft er BMW iX mjög notalegur ferðafélagi.',
    ],
    facts: '882067b3bf42',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix-xdrive-60-sport': {
    paragraphs: [
      'BMW iX xDrive 60 Sport er stór lúxusjeppi sem leggur mikla áherslu á fágað rými, góða hljóðvist og mikil þægindi í akstri. Hann hentar þeim sem leita að rúmgóðum ferðabíl þar sem mýkt og vellíðan eru í fyrirrúmi, með öflugu fjórhjóladrifi sem veitir mikið öryggi í snjó og hálku.',
      'Stærsti styrkur hans er drægnin, en hann er meðal þeirra langdrægustu í sínum verðflokki og búinn stærri rafhlöðu en flestir. Það tryggir áhyggjulausan akstur milli landshluta, jafnvel í vetrarkulda. Bíllinn er jafnframt aflmeiri en flestir á svipuðu verði og er meðal þeirra ódýrustu á hvern kílómetra drægni í þessum flokki.',
      'Þar sem hann gefur helst eftir er hraðhleðslan, sem er aðeins í meðallagi miðað við verð. Á Porsche Cayenne Coupé eru hleðslustoppin um 50% styttri og á Audi SQ6 e-tron um 30% styttri. Ef styttri bið á ferðalögum vegur þyngra en mikil drægni getur Cayenne Coupé því hentað betur.',
      'Fyrir þá sem setja langdrægni, mikið afl og friðsæl þægindi í öndvegi er iX 60 hins vegar afar traustur ferðafélagi á íslenskum vegum.',
    ],
    facts: 'd79d0f40d4d1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-edrive-20': {
    paragraphs: [
      'BMW iX1 eDrive 20 er minnsti rafjepplingur BMW, fágaður og vandaður bíll sem hentar einkum í daglegan innanbæjarakstur og hefðbundnar fjölskylduferðir. Hann er framhjóladrifinn og býður upp á góða hljóðvist og lipra aksturseiginleika, sniðinn að þeim sem vilja úrvalsmerki án þess að greiða verð fyrir stærri gerðir.',
      'Þótt bíllinn sé með fremur litla rafhlöðu nýtir hann orkuna vel og er ódýrari á hvern kílómetra drægni en flestir í sínum verðflokki. Hraðhleðslan er í meðallagi og dugar vel til að halda stoppum á ferðalögum hóflegum.',
      'Á móti kemur að hann er aflminni og hægari en flestir bílar á svipuðu verði. Fyrir þá sem þurfa öruggara grip í vetrarfærð og meiri kraft er Subaru Uncharted álitlegri kostur á sama verði, enda með fjórhjóladrif og mun snarpari. Sé leitað að stærri rafhlöðu kemur BYD Seal U til greina, þótt hleðslustoppin á honum séu um 60% lengri.',
      'Þetta er prýðilegur kostur fyrir þá sem vilja njóta gæða BMW á hagstæðu verði, svo lengi sem krafan er ekki um aldrif.',
    ],
    facts: '5170bc1d9003',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix1-xdrive-30': {
    paragraphs: [
      'BMW iX1 er lipur og vandaður lúxusjepplingur sem hentar sérstaklega vel í daglegan innanbæjarakstur og styttri ferðalög milli landshluta. Fjórhjóladrifið veitir mikið öryggi í snjó og hálku, og bíllinn höfðar til þeirra sem meta þægindi, traust veggrip og fágað yfirbragð fremur en hámarksrými.',
      'Helstu kostir bílsins liggja í hefðbundnum styrkleikum BMW, með góðri hljóðvist, lipurri stýringu og vönduðu innanrými. Fjórhjóladrifskerfið bregst hratt við erfiðum vetraraðstæðum, sem gerir daglegan akstur á íslenskum vegum öruggan og þægilegan.',
      'Á móti kemur að rafhlaðan er með einni af minnstu rafhlöðunum miðað við aðra á svipuðu verði. Hann drífur styttra en flestir í sínum verðflokki og hleður hægar en flestir, auk þess að vera dýrari á hvern km drægni en flestir. Fyrir þá sem ferðast mikið milli landshluta gæti Kia EV5 AWD hentað betur, en hann býður upp á 14,9 kWh stærri rafhlöðu á nánast sama verði, þótt hann sé 1,7 s hægari í 0-100 km/klst.',
      'BMW iX1 er því prýðilegur kostur fyrir þá sem setja gæði, akstursánægju og vetraröryggi í öndvegi en gera minni kröfur um drægni á langferðum.',
    ],
    facts: '7b462734f436',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix3-40': {
    paragraphs: [
      'BMW iX3 40 er fágaður jepplingur sem leggur mikla áherslu á langferðir og þægindi. Hann er afturhjóladrifinn og hentar einkum þeim sem aka mikið milli landshluta og vilja vandaðan ferðabíl sem kemst mjög langt á hverri hleðslu.',
      'Helsti styrkleiki bílsins er drægnin og hleðslan. Hann drífur mjög langt og er meðal þeirra langdrægustu í sínum verðflokki, sem veitir mikið öryggi í íslenskum vetrarkulda. Að auki hleður hann mjög hratt, svo stopp á hraðhleðslustöðvum verða stutt, og hann er ódýrari á hvern km drægni en flestir á svipuðu verði.',
      'Helsti ókosturinn er að bíllinn er afturhjóladrifinn og aflminni en flestir á svipuðu verði. Ef fjórhjóladrif og meiri kraftur í snjó og hálku skipta höfuðmáli er Polestar 4 SUV Long Range Dual Motor álitlegri kostur, en þar eru hleðslustoppin aftur á móti um 50% lengri.',
      'Fyrir þá sem aka mikið milli landshluta er BMW iX3 40 mjög þægilegur ferðabíll, svo lengi sem afturhjóladrifið dugar í vetrarfærðinni.',
    ],
    facts: '16731bcab88f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'bmw-ix3-50-xdrive': {
    paragraphs: [
      'BMW iX3 50 xDrive er veglegur lúxusjepplingur með fjórhjóladrifi sem hentar þeim sem gera miklar kröfur um akstursánægju, rými og öryggi í hálku og snjó. Hann er með mjög stóra rafhlöðu og drífur mjög langt, svo langferðir um landið krefjast lítillar fyrirhafnar, jafnvel í vetrarkulda.',
      'Bíllinn hleður mjög hratt og er meðal þeirra sem hlaða hraðast í sínum verðflokki. Hann er jafnframt meðal þeirra langdrægustu miðað við verð og meðal þeirra ódýrustu á hvern kílómetra drægni. Þetta þýðir fá og stutt stopp við hraðhleðslustöðvar og mikinn ávinning fyrir kaupverðið.',
      'Hér er þó ekki lögð sama áhersla á viðbragð og hjá sumum keppinautum. Hröðunin er í meðallagi miðað við verð, og Volvo EX60 P12 er til að mynda 100.000 kr. ódýrari og 1 s sneggri í 0-100 km/klst. Á móti stendur bíllinn vel gagnvart Mercedes-Benz GLC 400 4MATIC, sem er 400.000 kr. dýrari, með 90 km minni drægni og um 20% lengri hleðslustopp. Fyrir þá sem vilja traustan ferðabíl með mikla drægni er iX3 afar heilsteyptur kostur.',
    ],
    facts: 'fb86aa548d6e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-dolphin-base': {
    paragraphs: [
      'BYD Dolphin er lipur og nettur hlaðbakur sem hentar einkar vel í daglegan innanbæjarakstur eða sem hagkvæmur bíll fyrir smærri fjölskyldur. Hann er mjög ódýr og einkennist af léttleika sem gerir hann sérlega þægilegan við þröngar aðstæður og í þéttbýli.',
      'Miðað við aðra í sínum verðflokki er bíllinn með stærri rafhlöðu en flestir og ódýrari á hvern kílómetra drægni. Hann er einnig meðal þeirra sneggstu á þessu verði, sem gerir hann lipran og snöggan upp á stökkið þegar fella þarf sig inn í hraðari umferð. Drægnin dugar auk þess prýðilega í allan hefðbundinn hversdagsakstur.',
      'Helsti gallinn er sá að hann hleður mjög hægt og er meðal þeirra sem hlaða hægast í sínum verðflokki, sem lengir viðkomur á ferðalögum milli landshluta. Ef hleðslutími skiptir miklu máli býður Skoda Epiq 55 upp á um 45% styttri hleðslustopp, og sá sem þarf mun rýmri bíl fær Leapmotor C10 Pro á sama verði með um 25% styttri hleðslustoppum.',
      'BYD Dolphin reynist því prýðilegur kostur sem snöggur og ódýr hversdagsbíll, svo lengi sem ætlunin er ekki að eyða miklum tíma í hraðhleðslur á hringveginum.',
    ],
    facts: 'a075d76dc9ac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-seal-base': {
    paragraphs: [
      'BYD Seal er lágur og rennilegur fólksbíll sem höfðar sérstaklega til þeirra sem vilja sportlegan akstur frekar en hefðbundinn jeppling. Bíllinn er mjög aflmikill og hröðunin er meðal þeirra sneggstu í sínum verðflokki, enda tekur aðeins 3,8 sekúndur að ná hundraðinu úr kyrrstöðu.',
      'Fjórhjóladrifið kemur sér vel í hálku og vetrarfærð á Íslandi. Rafhlaðan er stærri en á flestum bílum á svipuðu verði, sem veitir trausta drægni í hversdagslegum akstri, auk þess sem lág byggingin tryggir stöðuga og þægilega veglímingu á malbiki.',
      'Helsti gallinn er að bíllinn hleður fremur hægt og hægar en flestir á svipuðu verði. Fyrir þá sem fara reglulega í langferðir og vilja eyða minni tíma við hleðslustöðvar býður Kia EV6 2025 Long Range AWD upp á um 55% styttri hleðslustopp. Ef hærri sætisstaða og meira farangursrými skipta meira máli er hefðbundnari jepplingur eins og Skoda Enyaq 85X einnig hentugri kostur.',
      'BYD Seal á því best við þá sem setja krafta, akstursánægju og sportlegt útlit fram yfir hraðhleðslu og hagnýtt fjölskyldupláss.',
    ],
    facts: 'f4502aed1fcd',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-seal-u-base': {
    paragraphs: [
      'BYD Seal U er rúmgóður og látlaus fjölskyldubíll sem leggur meiri áherslu á mýkt og rólegan akstur en mikil afköst. Hann er framhjóladrifinn og hentar einkum þeim sem leita að þægilegum ferðafélaga í daglegan akstur þar sem rými og þægindi skipta mestu máli.',
      'Helsti styrkleiki bílsins er rafhlaðan, en hún er með þeim allra stærstu sem fást á þessu verði. Þótt drægnin sé í meðallagi gefur stór rafhlaða aukið öryggi í íslenskum vetrarkulda, svo bíllinn dugar vel á milli landshluta án þess að maður þurfi stöðugt að horfa á mælinn.',
      'Á móti kemur að bíllinn er með þeim hægustu í sínum verðflokki og hleður mjög hægt á hraðhleðslustöðvum. Ef þú þarft öruggt grip í snjó og hálku eða ferðast mikið hringinn í kringum landið er Subaru Uncharted líklega betri kostur, en hann býður fjórhjóladrif, er mun sneggri og býður um 35% styttri hleðslustopp.',
      'Seal U hentar því best sem þægilegur fjölskyldubíll á malbiki fyrir þá sem vilja stóra rafhlöðu og afslappaðan akstur frekar en snerpu og torfærugetu.',
    ],
    facts: 'ee6e6b50363e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-sealion-7-base': {
    paragraphs: [
      'BYD Sealion 7 er rennilegur fimm sæta sportjeppi með fjórhjóladrifi sem einkennist öðru fremur af miklu afli og snöggri hröðun. Hann hentar vel þeim sem vilja kraftmikinn bíl fyrir íslenskar aðstæður, með öruggt grip í snjó og hálku og lipra svörun á þjóðvegum landsins.',
      'Bíllinn er með einni af stærstu rafhlöðunum miðað við aðra á svipuðu verði og hleður hraðar en flestir þeirra. Í daglegu lífi og á ferðalögum milli landshluta skilar það sér í sérlega stuttum hleðslustoppum, sem gerir langkeyrslur mun þægilegri.',
      'Á móti kemur að hann er nokkuð orkufrekur og drífur styttra en flestir í sínum verðflokki, auk þess að vera dýrari á hvern kílómetra drægni en flestir. Ef drægnin vegur þyngst væri Subaru e-Outback ákjósanlegri kostur með 21 km meiri drægni, þótt hleðslustoppin séu þar um 15% lengri. Á Nissan Ariya e-4ORCE eru hleðslustoppin hins vegar um 70% lengri.',
      'Fyrir ökumenn sem setja mikið afl, fjórhjóladrif og sneggri hleðslu í forgang fram yfir hámarksdrægni er Sealion 7 sannarlega þess virði að skoða nánar.',
    ],
    facts: 'e5798dfbadee',
    model: 'gemini-3.8-flash, thinking high',
  },
  'byd-tang-flagship': {
    paragraphs: [
      'BYD Tang Flagship er stór sjö sæta sportjeppi með fjórhjóladrifi sem sker sig úr fyrir mikið afl og snögg viðbrögð. Hann hentar vel stórum fjölskyldum sem vilja hefðbundinn jeppling frekar en fjölnotabíl og þurfa öruggt grip við íslenskar vetraraðstæður.',
      'Hann er með mjög stóra rafhlöðu og telst meðal þeirra aflmestu í sínum verðflokki, sem gerir framúrakstur á þjóðvegum áreynslulausan. Fjórhjóladrifið veitir traust grip í snjó og bleytu og sætin sjö gefa mikinn sveigjanleika í daglegu amstri eða hópferðum.',
      'Helsti ókostur bílsins er að hann hleður mjög hægt og er meðal þeirra sem hlaða hægast í sínum verðflokki. Einnig drífur hann styttra en flestir á svipuðu verði. Fyrir þá sem ferðast mikið milli landshluta er Hyundai IONIQ 9 Long Range AWD álitlegri kostur, með um 55% styttri hleðslustopp og 75 km meiri drægni.',
      'Tang hentar þeim sem vilja rúmgóðan og kraftmikinn fjölskyldubíl í daglegan akstur, svo lengi sem fólk gerir ráð fyrir meiri tíma við hraðhleðslustöðvar á lengri ferðalögum.',
    ],
    facts: 'e3108495b06c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'citroen-e-c4-base': {
    paragraphs: [
      'Citroën ë-C4 er lágreistur hlaðbakur með svolitlu jepplingsyfirbragði sem leggur megináherslu á mýkt og vellíðan frekar en kraftmikinn akstur. Bíllinn er þekktur fyrir mjúka fjöðrun og góð sæti sem deyfa ójöfnur í veginum vel. Hann hentar þeim sem leita að lágværum og þægilegum ferðafélaga í daglegan snattakstur.',
      'Hann er fremur ódýr bíll og býður upp á gott svigrúm fyrir fólksbíl á þessu verði. Fyrir þá sem aka aðallega innanbæjar eða á styttri vegalengdum nýtist hann vel sem lipur hversdagsbíll, þar sem akstursþægindi skipta meira máli en mikið vélarafl.',
      'Á móti kemur að bíllinn er mjög aflítill og með mjög litla rafhlöðu, svo hann drífur fremur stutt og hleður fremur hægt. Miðað við aðra á svipuðu verði drífur hann styttra en flestir og er meðal þeirra hægustu. Fyrir þá sem ferðast mikið milli landshluta væri Volkswagen ID. Cross heppilegri kostur, en hann er 100.000 kr. ódýrari og býður upp á um 20% styttri hleðslustopp.',
      'Citroën ë-C4 er því ljúfur kostur fyrir þægindamiðaðan hversdagsakstur, en síður ætlaður þeim sem leita að mikilli langferðagetu eða snarpri hröðun.',
    ],
    facts: '0f203bba0964',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-500e-base': {
    paragraphs: [
      'Fiat 500e er smár borgarbíll með ítalskt retro-yfirbragð, sniðinn fyrir þröngar götur og stuttar dagsferðir. Hann tekur aðeins fjóra í sæti og er sérstaklega lipur í þéttbýli, enda kemst hann fyrir í stæðum sem stærri bílar verða að láta eiga sig. Hann hentar þeim sem vilja sjarmerandi innanbæjarbíl sem auðvelt er að athafna sig á.',
      'Hann er mjög ódýr, sem gerir hann að fýsilegum kosti sem annan bíl á heimilið. Þótt rafhlaðan sé mjög lítil dugar hún ágætlega í daglegan akstur innanbæjar og einfalt er að fullhlaða bílinn heima yfir nótt.',
      'Á móti kemur að hann drífur mjög stutt, er mjög aflítill og hleður hægar en flestir í sínum verðflokki. Einnig er farangursrýmið lítið. Ef ætlunin er að fara reglulega milli landshluta er Smart #1 Pro+ á sama verði en býður upp á 135 km meiri drægni, fimm sæti og um 25% styttri hleðslustopp.',
      'Fiat 500e er laglegur og lipur borgarbíll sem nýtur sín best í þéttbýli, en gefur of mikið eftir ef hugurinn stendur til langferða.',
    ],
    facts: 'ed1eed510bce',
    model: 'gemini-3.8-flash, thinking high',
  },
  'fiat-600e-base': {
    paragraphs: [
      'Fiat 600e er lipur og nettur borgarjepplingur með skemmtilegu ítölsku retro-útliti sem sker sig úr hópnum. Hann er hannaður með þægilegan innanbæjarakstur í huga og hentar sérstaklega vel þeim sem vilja stílhreinan bíl til að sinna daglegum erindum og styttri ferðum.',
      'Bíllinn er fremur ódýr og gerir það að verkum að auðvelt er að komast á nýjan rafbíl án mikils tilkostnaðar. Hann reynist þjáll í þröngum götum og auðveldur í bílastæðum. Þótt hann hlaði fremur hægt eru hleðslustoppin í meðallagi miðað við aðra á svipuðu verði, og hann tekur til dæmis mun styttri hleðslustopp en Jeep Avenger á ferðalögum.',
      'Á móti kemur að hann drífur mjög stutt og er meðal þeirra aflminnstu og hægustu í sínum verðflokki. Íslenskur vetrarkuldi og framhjóladrifið setja ferðalögum milli landshluta nokkrar skorður. Ef meiri drægni og meira afl skipta máli er Volkswagen ID. Cross ódýrari kostur sem býður upp á sneggri hröðun og enn styttri hleðslustopp.',
      'Fiat 600e höfðar fyrst og fremst til þeirra sem heillast af ítalska sjarmanum og leita að laglegum borgarbíl, frekar en langdrægum ferðabíl fyrir alla fjölskylduna.',
    ],
    facts: '5cb3f7454b4f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-capri-base': {
    paragraphs: [
      'Ford Capri er rennilegur jepplingur með sportlega þaklínu og fjórhjóladrif, sem drífur fremur langt. Hann hentar sérstaklega vel þeim sem vilja rúmgóðan bíl með hárri setstöðu og traustu vetrargripi til að aka áhyggjulaust milli landshluta í krefjandi færð.',
      'Stærsti kostur bílsins er hve mikið fæst fyrir peningana. Miðað við aðra á svipuðu verði er hann meðal þeirra langdrægustu og ódýrari á hvern kílómetra drægni en flestir. Hann hleður fremur hratt og er meðal þeirra sem hlaða hraðast í sínum verðflokki, sem lágmarkar bið á ferðalögum. Þá er hann aflmeiri en flestir sambærilegir bílar, sem veitir mikið öryggi við framúrakstur á þjóðvegum.',
      'Sá sem sækist eftir meiri spyrnu og lægri fólksbíl fær 0,8 s sneggri hröðun í Polestar 2 Long Range Dual Motor, en þar eru hleðslustoppin um 5% lengri. Kjósi maður hefðbundnara jepplingalag er systurbíllinn Ford Explorer ER AWD á sama verði, en hefur 26 km minni drægni og um 10% lengri hleðslustopp.',
      'Ford Capri er heilsteyptur og öflugur ferðabíll sem sameinar mikla drægni, fjórhjóladrif og lipra hleðslu á mjög samkeppnishæfu verði.',
    ],
    facts: 'f3e474e1f35f',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-explorer-er-awd': {
    paragraphs: [
      'Ford Explorer er kassalaga og traustvekjandi jepplingur með fjórhjóladrifi sem hentar fólki sem vill hefðbundið jeppalag, þægilega sætishæð og gott útsýni. Hann er lipur í þéttbýli en nógu traustur til að takast á við ófærð og hversdagslíf fjölskyldunnar.',
      'Bíllinn drífur fremur langt og hleður fremur hratt. Miðað við aðra á svipuðu verði drífur hann lengra en flestir, er ódýrari á hvern km drægni og aflmeiri en flestir. Fjórhjóladrifið kemur sér sérstaklega vel í snjó og hálku, og drægnin dugar vel í ferðalög milli landshluta.',
      'Á hraðhleðslustöðvum gefur hann þó eftir á móti Hyundai IONIQ 5, sem býður upp á um 35% styttri hleðslustopp. Systurbíllinn Ford Capri býður sömuleiðis upp á 26 km meiri drægni á sama verði vegna rennilegra forms, og Polestar 2 er sneggri og aflmeiri fólksbíll.',
      'Ford Explorer er vel heppnaður og jarðbundinn kostur sem smellur sérlega vel inn í íslenskan vetur.',
    ],
    facts: '9eb36bb10329',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-mustang-mach-e-lr-awd': {
    paragraphs: [
      'Ford Mustang Mach-E er sportlegur og rennilegur jepplingur með mikinn karakter. Hann sameinar öruggt fjórhjóladrif og lipra aksturseiginleika, sem hentar vel fólki sem vill rúmgóðan bíl fyrir íslenskar vetraraðstæður án þess að fórna akstursánægju.',
      'Stærsti kosturinn er drægnin og rafhlaðan. Hann er með einni af stærstu rafhlöðunum í sínum verðflokki og drífur lengra en flestir, sem veitir gott öryggi í ferðum milli landshluta. Bíllinn er auk þess ódýrari á hvern kílómetra drægni en flestir sambærilegir bílar og býður upp á gott afl.',
      'Helsti ókosturinn er hraðhleðslan, en hann hleður hægar en flestir í þessum flokki. Ef styttri bið á stöðvum utan höfuðborgarsvæðisins skiptir þig mestu máli býður Smart #5 Pulse til dæmis upp á um 50% styttri hleðslustopp, ásamt talsvert meira afli.',
      'Mach-E hentar sérlega vel þeim sem vilja mikla drægni í vetrarfærð og sportlegan svip, svo lengi sem hægari hleðsla á ferðalögum sé ekki fyrirstaða.',
    ],
    facts: '01e9d7fa4b33',
    model: 'gemini-3.8-flash, thinking high',
  },
  'ford-puma-base': {
    paragraphs: [
      'Ford Puma er nettur smájepplingur með hárri sætisstöðu sem hentar sérlega vel í daglegan innanbæjarakstur og snatt. Hann er þekktur fyrir lipra og fjörlega aksturseiginleika sem gera hann þægilegan og lipran í þéttbýli.',
      'Stærsti kostur bílsins er að hann er mjög ódýr og hleður hraðar en flestir bílar á svipuðu verði, þótt hann hlaði fremur hægt á heildina litið. Hleðslustoppin eru til dæmis um 30% lengri hjá Hyundai INSTER Long Range og um 25% lengri hjá Renault R5 E-Tech, sem munar um þegar farið er út fyrir bæinn.',
      'Á móti kemur að Puma er með mjög litla rafhlöðu og drífur mjög stutt, og miðað við aðra á svipuðu verði drífur hann styttra en flestir. Í íslenskum vetrarkulda dregur enn frekar úr drægninni. Fyrir þá sem vilja meira öryggi á lengri ferðum býður Leapmotor B10 upp á 58 km meiri drægni og 24,1 kWh stærri rafhlöðu fyrir aðeins 100.000 kr. meira.',
      'Ford Puma hentar því best þeim sem leita að liprum og ódýrum jepplingi í daglegan akstur en reiða sig síður á bílinn í langferðum yfir vetrarmánuðina.',
    ],
    facts: '13dd726fc66c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hongqi-ehs5-base': {
    paragraphs: [
      'Hongqi EHS5 er aflmikill fjölskyldubíll sem einkennist af miklu afli og snarpri hröðun. Hann hentar sérstaklega vel ökumönnum sem vilja sportlega afkastagetu og öruggt fjórhjóladrif á viðráðanlegu verði.',
      'Fjórhjóladrifið kemur sér vel í íslenskum snjó og hálku. Hann er með einni af stærstu rafhlöðunum í sínum verðflokki og drífur lengra en flestir bílar á svipuðu verði, sem veitir aukið öryggi á langferðum í vetrarkulda. Að auki hleður hann fremur hratt og er meðal þeirra sneggstu við hleðslustöðvar miðað við verð.',
      'Á móti er Hongqi tiltölulega nýtt vörumerki hér á landi og meiri óvissa getur verið um endursöluverð eða þjónustunet. Ef þú vilt frekar rótgróið evrópskt merki gæti Volvo EX30 hentað betur, þótt hann sé afturhjóladrifinn og með um 50% lengri hleðslustopp. Peugeot e-3008 býður líka upp á þekkta evrópska nálgun, en hann er aðeins framhjóladrifinn og með um 80% lengri hleðslustopp.',
      'Fyrir þá sem setja aldrif, mikið afl og skjóta hleðslu í forgang er þessi bíll afar hagstæður kostur.',
    ],
    facts: 'c1ddd31fa032',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hongqi-ehs7-premium': {
    paragraphs: [
      'Hongqi EHS7 Premium er stór og kraftmikill lúxusjepplingur sem einkennist af miklu rými og fádæma afli. Hann hentar einkum þeim sem leita að rúmgóðum fjölskyldubíl með traustu fjórhjóladrifi sem lætur ekki deigan síga í íslenskri vetrarfærð.',
      'Helsti styrkur bílsins er mjög stór rafhlaða, sú stærsta miðað við aðra á svipuðu verði, ásamt afli sem gerir hann sneggri en flesta í sínum verðflokki. Í daglegu lífi þýðir þetta fágað öryggi við framúrakstur og mikið grip í snjó. Bíllinn hleður fremur hratt og er meðal þeirra sem hlaða hraðast miðað við aðra á svipuðu verði, sem tryggir stutt stopp á ferðalögum milli landshluta.',
      'Á móti kemur að drægnin er aðeins í meðallagi miðað við rafhlöðustærð og hann er dýrari á hvern km drægni en flestir á svipuðu verði. Fyrir þá sem vilja rennilegri fólksbíl með meiri skilvirkni gæti Polestar 2 Long Range Performance hentað betur, enda býður hann upp á 28 km meiri drægni þótt hleðslustoppin séu um 35% lengri.',
      'Hongqi EHS7 Premium er öflugur valkostur fyrir þá sem vilja hámarks rými, mikið afl og stutt hleðsluhlé, svo lengi sem meiri orkunotkun stendur ekki í vegi.',
    ],
    facts: 'b1727237dbbf',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-inster-base': {
    paragraphs: [
      'Hyundai INSTER er nettbyggður, kassalaga borgarjepplingur sem er sérsniðinn fyrir þéttbýlið. Hann er lipur í allri umgengni, afar auðveldur í þröngum bílastæðum og hentar vel sem léttur skutlubíll eða annar bíll heimilisins í daglegu amstri.',
      'Stærsti kosturinn er kaupverðið, en hann er á meðal allra ódýrustu rafbíla á markaðnum. Hyundai býr jafnframt yfir rótgrónu þjónustuneti og orðspori fyrir traustan frágang, sem veitir kaupendum ákveðið öryggi. Í stuttum ferðum innanbæjar og með reglulegri næturhleðslu heima vantar ekkert upp á notagildið.',
      'Á móti kemur að hann er mjög aflítill og meðal þeirra hægustu í hröðun. Hann drífur styttra en flestir í sínum verðflokki og hleður hægar en flestir, svo langferðir krefjast meiri þolinmæði. Ef drægni og hleðsluhraði skipta meira máli býður Leapmotor B03X ProMax til dæmis upp á 55 km meiri drægni og um 40% styttri hleðslustopp fyrir 200.000 kr. lægra verð.',
      'Fyrir þá sem vilja viðráðanlegan, vandaðan og þægilegan smábíl í bæjaraksturinn frá þekktu merki er INSTER engu að síður einkar lipur og hagkvæmur kostur.',
    ],
    facts: '6832195fd771',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-inster-long-range': {
    paragraphs: [
      'Hyundai INSTER Long Range er kassalaga og snaggaralegur smábíll í jepplingastíl sem er sniðinn fyrir þéttbýli og þröng stæði. Hann einkennist af hárri setustöðu, góðu útsýni og snjallri nýtingu á innanrými, og hentar fólki sem vill sérlega lipran bíl í daglegan snúning.',
      'Bíllinn er mjög ódýr og drægnin dugar prýðilega í daglegan akstur og styttri ferðir á milli bæja, þótt gera verði ráð fyrir að hún minnki í íslenskum vetrarkulda. Verð á hvern kílómetra drægni er einnig í meðallagi miðað við aðra á svipuðu verði.',
      'Helsti fórnarkostnaðurinn liggur í afli og hleðslu. Hann er mjög aflítill og meðal þeirra hægustu í sínum verðflokki, auk þess sem hann hleður hægar en flestir. Fyrir þá sem aka mikið á langferðum og vilja sneggri bíl með um 25% styttri hleðslustoppum væri Ford Puma fýsilegri kostur, þótt INSTER bjóði talsvert meiri drægni en Renault R5 E-Tech á sama verði.',
      'Sem sérstæður, hagkvæmur og hreinræktaður borgarbíll hittir hann hins vegar beint í mark.',
    ],
    facts: '383ab1ec50e1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-standard-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Standard Range er lipur og nettur fimm sæta borgarbíll sem hentar einkum til styttri ferða dags daglega. Hann miðar að því að bjóða upp á rafbílaeign á viðráðanlegu verði og hentar fólki sem þarf fyrst og fremst áreiðanlegan ferðamáta í vinnuna, búðina og hefðbundið innanbæjaramstur.',
      'Helsti kostur bílsins er kaupverðið sjálft, en hann er mjög ódýr. Í daglegu lífi fær maður fullgildan fimm sæta bíl sem er auðveldur í umgengni og ræður lipurlega við alla daglega bæjarkeyrslu, án þess að kosta mikið.',
      'Á móti gefur maður mikið eftir í langferðagetu. Bíllinn hefur mjög litla rafhlöðu og drífur mjög stutt, sérstaklega í vetrarkulda, og miðað við aðra á svipuðu verði hleður hann hægar en flestir. Renault R5 E-Tech er til dæmis 110.000 kr. ódýrari en býður upp á 65 km meiri drægni og um 15% styttri hleðslustopp. Ef leitað er eftir meiri drægni er Peugeot e-2008 aðeins 40.000 kr. dýrari en hefur 62 km meiri drægni.',
      'Fyrir vikið virkar IONIQ 3 best sem sparneytinn annar bíll á heimilinu eða hreinræktaður bæjarbíll, en reynist síður heppilegur í regluleg ferðalög milli landshluta.',
    ],
    facts: '2796cf363a0d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-3-long-range': {
    paragraphs: [
      'Hyundai IONIQ 3 Long Range er lipur og sparneytinn fólksbíll sem leggur áherslu á lágan rekstrarkostnað og nýtni frekar en mikið afl. Hann hentar vel þeim sem leita að hagkvæmum hversdagsbíl sem dugar örugglega í ferðalög milli landshluta án mikils tilkostnaðar.',
      'Stærsti styrkleiki bílsins er hve mikið fæst fyrir peninginn. Hann er mjög ódýr á hvern kílómetra drægni og drífur lengra en flestir bílar á svipuðu verði. Á ferðalögum hleður hann hraðar en flestir í sínum verðflokki, þótt hann hlaði fremur hægt.',
      'Mest gefur bíllinn eftir í snerpu, enda er hann mjög aflítill og meðal þeirra hægustu miðað við aðra á svipuðu verði. Ef kraftur og hröðun skipta miklu máli er Leapmotor C10 ProMax mun sprækari kostur, en hann er 2,9 s sneggri í 0-100 km/klst og með 115 kW meira afl.',
      'Fyrir þá sem vilja fyrst og fremst komast langar leiðir á hagkvæman hátt og láta hestöflin mæta afgangi er IONIQ 3 einkar skynsamlegt val.',
    ],
    facts: 'cc6347a9b495',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-5-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 5 er rúmgóður og sérstæður fjölskyldubíll með framúrstefnulegu útliti og mjög opnu innanrými. Langt hjólhaf skilar ríkulegu fótaplássi með flötu gólfi, og fjórhjóladrifið veitir mikið öryggi í snjó og vetrarfærð. Hann hentar sérlega vel fjölskyldum sem vilja þægilegan og rúmgóðan ferðabíl.',
      'Bíllinn hleður mjög hratt og á ferðalögum munar miklu um að miðað við aðra á svipuðu verði hleður hann hraðast allra. Hann er með fremur stóra rafhlöðu, drífur lengra en flestir í sínum verðflokki og er sneggri en flestir að taka við sér. Þá er hann fremur ódýr á hvern kílómetra drægni, sem gefur mikið fyrir peninginn.',
      'Kaupendur sem vilja hámarka drægnina gætu frekar skoðað Ford Explorer ER AWD, sem hefur 20 km meiri drægni en hefur á móti um 60% lengri hleðslustopp. Systurbíllinn Kia EV6 2025 Long Range AWD hleður álíka hratt en hefur 24 km minni drægni og höfðar frekar til þeirra sem vilja sportlegri akstur. Fyrir þá sem vilja rúmgóðan ferðabíl með stuttum hleðslustoppum er IONIQ 5 afar traustur kostur.',
    ],
    facts: 'ec32ba1494cf',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range AWD er stór og vandaður sjö sæta jeppi sem hentar einkar vel stórum fjölskyldum sem vilja fullgild sæti og ríflegt pláss á löngum ferðum. Hann leggur mikla áherslu á þægindi og yfirvegaðan akstur frekar en sportlega takta.',
      'Hann er með mjög stóra rafhlöðu og drífur fremur langt, sem veitir aukið öryggi í vetrarkulda á milli landshluta. Fjórhjóladrifið tryggir stöðugleika í snjó og hálku. Að auki hleður hann fremur hratt, sem styttir biðina við hraðhleðslustöðvar á lengri ferðalögum.',
      'Helsti ókosturinn er að hann er aflminni og hægari en flestir bílar á svipuðu verði. Fyrir þá sem vilja meiri kraft og enn hraðari ferðir býður XPENG X9 AWD Performance upp á um 45% styttri hleðslustopp, þótt hann sé dýrari. BYD Tang Flagship er sömuleiðis sneggri upp á lagið en þar eru hleðslustoppin um 130% lengri.',
      'Fyrir þá sem vilja rúmgóðan ferðabíl með traustu fjórhjóladrifi og góðri drægni er IONIQ 9 heppilegur kostur.',
    ],
    facts: '61ec7ef63fe4',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-ioniq-9-long-range-performance-awd': {
    paragraphs: [
      'Hyundai IONIQ 9 Long Range Performance AWD er risavaxinn og þægilegur sjö sæta fjölskyldubíll sem hentar vel stórum fjölskyldum sem þurfa mikið rými og öruggt fjórhjóladrif í íslenskum vetraraðstæðum. Hann státar af sérlega stórri rafhlöðu og býður upp á áreynslulausan og hljóðlátan akstur, hvort sem er innanbæjar eða á löngum leiðum.',
      'Stærsti styrkurinn er einmitt rafhlaðan, sem er stærri en hjá flestum bílum á svipuðu verði. Í daglegu lífi og sérstaklega í íslenskum vetrarkulda veitir það dýrmætt öryggi þegar farið er á milli landshluta. Bíllinn er fremur snöggur miðað við stærð og hleður fremur hratt.',
      'Á móti kemur að hann er fremur dýr, og drægnin er í meðallagi miðað við aðra í sínum verðflokki. Ef hleðslutími á ferðalögum skiptir mestu máli er XPENG X9 AWD Performance 1.100.000 kr. ódýrari og með um 45% styttri hleðslustopp. Kia EV9 er aftur á móti 700.000 kr. ódýrari en hefur 88 km minni drægni.',
      'Þetta er heilsteyptur og kraftmikill ferðabíll fyrir þá sem vilja hámarks rými og stóra rafhlöðu, svo lengi sem verðmiðinn hentar.',
    ],
    facts: '3f4af478402e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-kona-electric-65-kwh': {
    paragraphs: [
      'Hyundai Kona Electric er lipur og hagnýtur framhjóladrifinn jepplingur sem hentar vel sem sparneytinn fjölskyldubíll eða í daglegan pendil. Hann fer létt með þröng bílastæði en veitir samt ágæta yfirsýn og þægilegt aðgengi.',
      'Stærsti styrkur hans er hversu mikið fæst fyrir peninginn, en hann er mjög ódýr á hvern kílómetra drægni og drífur lengra en flestir í sínum verðflokki. Í daglegu lífi þýðir þetta færri hleðslustopp í vikunni og aukið öryggi í ferðum milli landshluta, jafnvel þegar íslenskur vetrarkuldi dregur úr rafhlöðunni.',
      'Á móti kemur að hann hleður fremur hægt og hleður hægar en flestir á svipuðu verði. Hleðslustoppin á ferðalögum verða því lengri en hjá bílum eins og Tesla Model Y eða Leapmotor C10 ProMax, sem bjóða jafnframt upp á meira pláss og sneggra viðbragð. Hann er líka aðeins framhjóladrifinn, sem getur reynt á í erfiðri vetrarfærð.',
      'Ef markmiðið er einfaldlega að fá mikla drægni fyrir hverja krónu í þægilegum og traustum bíl, og lengri hleðslutími á ferðalögum skiptir ekki öllu máli, er Kona Electric einn allra hagkvæmasti kosturinn.',
    ],
    facts: 'd2efebe3c86d',
    model: 'gemini-3.8-flash, thinking high',
  },
  'hyundai-staria-electric-base': {
    paragraphs: [
      'Hyundai STARIA Electric er sérlega rúmgóður fjölnotabíll sem tekur allt að níu manns í sæti. Hann vekur athygli fyrir framúrstefnulegt útlit og hentar vel stórum fjölskyldum eða hópferðum þar sem hámarksfarþegafjöldi og rými skipta öllu máli.',
      'Hann er með stærri rafhlöðu en flestir í sínum verðflokki og hraðhleðslan er í meðallagi, sem gerir ferðalög milli landshluta þægilegri en á eldri gerðum af sambærilegri stærð. Þótt hann sé aflminni en flestir á svipuðu verði dugar aflið prýðilega í daglegan akstur.',
      'Hins vegar drífur hann mjög stutt og er meðal þeirra sem drífa styst í sínum verðflokki. Í íslenskum vetrarkulda dregur enn frekar úr drægninni, og framhjóladrifið veitir ekki sama grip í mikilli ófærð og fjórhjóladrif. Ef sjö sæti duga gæti Kia PV5 hentað betur með 13 km meiri drægni, þótt hleðslustoppin séu um 40% lengri á honum.',
      'Fyrir þá sem þurfa níu sæti er STARIA hagstæður kostur, sérstaklega í samanburði við Peugeot e-Traveller sem er 1.300.000 kr. dýrari og Toyota Proace Verso sem er 2.400.000 kr. dýrari.',
    ],
    facts: '55454b8ff503',
    model: 'gemini-3.8-flash, thinking high',
  },
  'jeep-avenger-base': {
    paragraphs: [
      'Jeep Avenger er nettur og kantaður borgarjepplingur sem ber hið svipmikla Jeep-útlit, þótt hann sé eingöngu framhjóladrifinn. Hann er lipur í þröngum götum, auðveldur við að leggja og hentar vel þeim sem vilja hærri setustöðu og vaskan svip í meðfærilegum bíl til daglegra erinda.',
      'Hann er fremur ódýr í innkaupum og fer létt með daglegan innanbæjarakstur. Rafhlaðan er mjög lítil og bíllinn drífur mjög stutt, en það dugar ágætlega í styttri ferðir á sumrin. Drægnin dregst þó saman í íslenskum vetrarkulda og krefst þess að hugað sé vel að hleðslu ef farið er út fyrir höfuðborgarsvæðið.',
      'Á móti kemur að bíllinn hleður mjög hægt og er meðal þeirra aflminnstu og hægustu miðað við aðra á svipuðu verði. Fyrir nánast sömu peninga býður Suzuki e Vitara upp á fjórhjóladrif sem nýtist mun betur í snjó og hálku. Þá kostar XPENG G6 nákvæmlega það sama en býður upp á meiri drægni og um 55% styttri hleðslustopp.',
      'Avenger er laglegur og þægilegur kostur sem hreinn borgarbíll, en gefur of mikið eftir í hleðsluhraða, afli og vetrarhæfni til að henta vel á langferðum.',
    ],
    facts: '44e951bb483e',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-base': {
    paragraphs: [
      'KGM Musso EV er stór og hagnýtur bíll frá kóreska framleiðandanum sem áður hét SsangYong, þekktum fyrir grófa og jarðbundna bíla. Hann leggur áherslu á látlaust notagildi fremur en fágaðan lúxus og hentar þeim sem leita að rúmgóðum bíl til vinnu eða hversdagslegrar notkunar á hagstæðu verði.',
      'Helsti styrkur hans felst í rafhlöðunni, sem er með þeim stærstu í þessum verðflokki. Hún gefur traustan orkuforða í íslenskum vetrarkulda, jafnvel þótt bíllinn sé þungur í vöfum og orkunýtnin skari ekki fram úr.',
      'Aftur á móti hleður hann mjög hægt og er aðeins framhjóladrifinn, auk þess að vera fremur aflítill. Fyrir þá sem þurfa meira öryggi í hálku og snjó, eða vilja stytta biðina á ferðalögum milli landshluta, er Smart #1 Pulse mun heppilegri með fjórhjóladrifi og um 20% styttri hleðslustoppum.',
      'Musso EV er látlaus og ódýr vinnuþjarkur fyrir þá sem halda sig mest á malbiki í grennd við heimilið, en krefst mikillar þolinmæði á langferðum.',
    ],
    facts: 'efc224526415',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-musso-ev-4wd': {
    paragraphs: [
      'KGM Musso EV er stór og massífur fjórhjóladrifsbíll sem höfðar sérstaklega til þeirra sem leita að vinnusömum ferðafélaga í krefjandi aðstæður. Hann býður upp á fimm sæti og öruggt yfirbragð fyrir akstur í erfiðri færð eða utan hefðbundinna vega.',
      'Stærsti styrkur hans er rafhlaða sem er stærri en hjá flestum bílum á svipuðu verði, ásamt fjórhjóladrifi sem tryggir gott grip og öryggi í snjó og hálku. Hann er yfirvegaður í akstri og hentar vel sem rólegur og traustur félagi í daglegu stappi.',
      'Á móti kemur að hann drífur mjög stutt og er meðal þeirra sem drífa styst í sínum verðflokki, sem gerir íslenskan vetrarkulda enn krefjandi. Hann hleður jafnframt mjög hægt og er fremur dýr á hvern kílómetra drægni. Ef þörf er á bíl í tíðar langferðir býður Volvo EX30 Cross Country Twin Motor Performance upp á um 35% styttri hleðslustopp, og Mercedes-Benz EQA SUV 300 4MATIC hefur um 20% styttri hleðslustopp og kemst talsvert lengra á hleðslunni.',
      'Musso EV er ákjósanlegur kostur ef forgangsatriðið er vinnulegur fjórhjóladrifsbíll í sveitina eða snjóinn, en á þjóðveginum krefst hann mikillar þolinmæði.',
    ],
    facts: 'd66452b944fb',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kgm-torres-evx': {
    paragraphs: [
      'KGM Torres EVX er kantaður og rúmgóður jepplingur með gróft útlit sem höfðar til þeirra sem vilja háa setstöðu og mikið pláss fyrir fjölskylduna á viðráðanlegu verði. Þrátt fyrir jeppalegt yfirbragð er hann framhjóladrifinn og hannaður fyrir hefðbundna vegi.',
      'Stærsti styrkleikinn er hvað maður fær mikið fyrir peninginn. Hann státar af stærri rafhlöðu en flestir bílar á svipuðu verði, sem gefur trausta drægni í hversdagsakstri og nægan varasjóð þegar vetrarkuldinn dregur úr rafhlöðunni.',
      'Það sem gefið er eftir er fyrst og fremst hleðslutíminn, en bíllinn hleður hægar en flestir í sínum verðflokki og krefst því lengri viðkomu á hraðhleðslustöðvum í langferðum. Fyrir þá sem vilja meira öryggi í hálku býður Leapmotor C10 ProMax AWD upp á fjórhjóladrif, mun meira afl og um 15% styttri hleðslustopp fyrir aðeins 100.000 kr. meira.',
      'Torres EVX er prýðilegur kostur fyrir hagsýnar fjölskyldur sem þurfa gott rými en gera ekki kröfu um fjórhjóladrif eða hraðar ferðir milli landshluta.',
    ],
    facts: '0f8f89fb8ee1',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-standard-range': {
    paragraphs: [
      'Kia EV2 er nett og hagnýtt borgarfarartæki sem býður upp á aðgengilega leið inn í rafbílaheiminn án þess að kosta handlegg. Hann er sérsniðinn fyrir fólk sem ekur aðallega innanbæjar og kann að meta þægilegan frágang og áreiðanleika Kia í lipurri stærð sem hentar vel í þröng bílastæði og daglegt amstur.',
      'Stærsti kostur hans er verðið, enda er bíllinn mjög ódýr og fer vel með budduna. Framhjóladrifið veitir góðan stöðugleika í vetrarfærð og hálku innanbæjar, og lágur kaup- og rekstrarkostnaður gerir hann að álitlegum kosti sem fyrsta rafbíl eða sem annan bíl á heimilið.',
      'Á móti kemur að maður gefur töluvert eftir í langferðum. Hann drífur stutt, er með mjög litla rafhlöðu og hleður hægar en flestir á svipuðu verði. Fyrir þá sem aka mikið á milli landshluta væri Leapmotor B10 hagkvæmari kostur á nánast sama verði, enda býður hann upp á um 30% styttri hleðslustopp og 44 km meiri drægni.',
      'Kia EV2 hentar fyrst og fremst sem traustur og sparneytinn borgarbíll, svo lengi sem gerðar eru hóflegar kröfur til langkeyrslu.',
    ],
    facts: 'bc2e14d9b951',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev2-long-range': {
    paragraphs: [
      'Kia EV2 Long Range er lipur smábíll sem hentar vel í daglegan innanbæjarakstur og hversdagsleg erindi, en býr yfir óvenju stórri rafhlöðu miðað við verð. Hann hentar þeim sem vilja fyrirferðarlítinn bíl sem ræður samt vel við ferðalög milli landshluta án stöðugra hleðsluáhyggna.',
      'Stærsti styrkleiki hans er hvað maður fær mikið fyrir peninginn, enda er hann meðal þeirra ódýrustu á hvern kílómetra drægni miðað við aðra á svipuðu verði. Hann drífur lengra og er með stærri rafhlöðu en flestir í sínum verðflokki, sem kemur sér sérstaklega vel í íslenskum vetrarkulda. Hraðhleðslan er í meðallagi miðað við verð, þótt bíllinn hlaði fremur hægt á heildina litið.',
      'Á móti kemur að bíllinn er mjög aflítill og meðal þeirra hægustu í sínum verðflokki, auk þess sem framhjóladrifið krefst aðgátar í snjó og hálku. Ef snerpa og hraðari ferðalög skipta máli væru Volkswagen ID. Polo eða Skoda Epiq 55 heppilegri kostir, en báðir bjóða upp á mun meira afl og um 20% styttri hleðslustopp.',
      'Fyrir þá sem vilja sem mesta drægni fyrir sem minnstan pening og sætta sig við rólegan takt er Kia EV2 mjög hagstæður kostur.',
    ],
    facts: '2fdd5bf67da3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-standard-range': {
    paragraphs: [
      'Kia EV3 í Standard Range útgáfunni er nettari jepplingur sem hentar prýðilega sem hagkvæmur hversdagsbíll fyrir fjölskylduna eða í daglegan innanbæjarakstur. Hann er mjög ódýr í innkaupum og sameinar nútímalegt útlit og þægilega stærð sem fer vel í þröngum götum og stæðum.',
      'Í daglegum akstri er hann sneggri en flestir á svipuðu verði, sem gerir hann kvikan við innáakstur á stofnbrautir og skemmtilegan í umferðinni. Drægnin dugar leikandi í allt venjulegt skutl og styttri ferðir milli bæja, þótt reikna megi með að hún minnki í íslenskum vetrarkulda líkt og gengur og gerist.',
      'Framhjóladrifið krefst meiri aðgátar í miklum snjó og hálku, og hann hleður fremur hægt á langferðum. Ef afturhjóladrif heillar er Volkswagen ID.3 Pro 99.000 kr. dýrari, og BYD Dolphin er 200.000 kr. ódýrari en hefur um 45% lengri hleðslustopp. Fyrir þá sem leita að liprum og vel búnum rafbíl á viðráðanlegu verði er EV3 engu að síður mjög álitlegur kostur.',
    ],
    facts: '42dcd1988f27',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-long-range': {
    paragraphs: [
      'Kia EV3 Long Range er lipur jepplingur sem hentar sérstaklega vel þeim sem ferðast mikið en vilja halda verðinu niðri. Það sem einkennir hann helst er hve mikilli drægni er komið fyrir í tiltölulega nettum bíl, sem gerir hann að traustum ferðabíl milli landshluta jafnvel í íslenskum vetrarkulda.',
      'Hann er mjög ódýr á hvern kílómetra drægni og miðað við aðra í sínum verðflokki er hann meðal þeirra langdrægustu. Bíllinn hleður fremur hratt og hraðar en flestir á svipuðu verði, sem skilar sér í styttri hleðslustoppum í langferðum, auk þess að vera með stærri rafhlöðu en flestir í flokknum.',
      'Á móti kemur að bíllinn er aðeins framhjóladrifinn, fremur aflítill og aflminni en flestir á svipuðu verði. Ef meira grip eða meira afl skiptir sköpum í vetrarfærð gæti afturhjóladrifinn bíll eins og Mazda 6e Long Range hentað betur, þótt hleðslustoppin í honum séu um 60% lengri. Fyrir þá sem vilja mikla drægni og góðan hleðsluhraða á hagstæðu verði er Kia EV3 hins vegar afar skynsamlegt val.',
    ],
    facts: '837adf7be9b3',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev3-long-range-awd': {
    paragraphs: [
      'Kia EV3 í fjórhjóladrifsútgáfu er nettari sportjepplingur sem smellpassar í íslenskan raunveruleika. Hann sameinar lipurð í þéttbýli og öryggi fjórhjóladrifs í vetrarfærð, sem gerir hann að góðum kosti fyrir þá sem vilja traustan ferðabíl án þess að aka um á stórum vagni.',
      'Helsti styrkur bílsins er hve vel hann stendur sig í langferðum miðað við verðmiðann. Hann drífur lengra og er með stærri rafhlöðu en flestir í sínum verðflokki, sem kemur sér vel í vetrarkulda milli landshluta. Þá hleður hann hraðar en flestir á svipuðu verði, svo viðkomur á hleðslustöðvum tefja lítið fyrir.',
      'Á móti kemur að bíllinn er í smærri kantinum fyrir fólk sem þarf mikið pláss. Ef meira rými skiptir máli býður XPENG G6 upp á stærri bíl og um 30% styttri hleðslustopp, en er aftur á móti aðeins afturhjóladrifinn. Viljir þú halda fjórhjóladrifinu er Skoda Elroq 85x 200.000 kr. ódýrari með um 10% styttri hleðslustopp.',
      'Þetta er vel heppnaður og hagkvæmur kostur fyrir þá sem leita að liprum bíl með mikla drægni og öruggt grip allan ársins hring.',
    ],
    facts: '52d51b19b573',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-base': {
    paragraphs: [
      'Kia EV4 er rennilegur fimm sæta hlaðbakur sem leggur áherslu á sparneytni og mikla drægni frekar en jeppalegt snið. Hann hentar sérstaklega vel þeim sem fara oft í langferðir og leita að hagkvæmum fólksbíl sem kemst langan veg á hverri hleðslu.',
      'Helsti kostur bílsins er hve mikinn akstursradíus þú færð fyrir peninginn, en hann er meðal þeirra ódýrustu á hvern kílómetra drægni miðað við aðra í sínum verðflokki. Hann drífur mjög langt og dugar því prýðilega milli landshluta jafnvel í íslenskum vetrarkulda. Að auki hleður hann hraðar en flestir bílar á svipuðu verði, sem styttir áningar á ferðalögum.',
      'Á móti kemur að bíllinn er eingöngu með framhjóladrifi og er fremur aflítill og hægari en flestir miðað við verð. Ef öruggt veggrip í snjó og hálku skiptir miklu máli er Tesla Model 3 Long Range Fjórhjóladrif betri kostur, enda býður hann upp á fjórhjóladrif, mun meira afl og um 20% styttri hleðslustopp fyrir 300.000 kr. hærra verð.',
      'Fyrir þá sem setja drægni og rekstrarhagkvæmni í öndvegi er Kia EV4 engu að síður einkar skynsamlegur ferðabíll.',
    ],
    facts: '7a4f0374acac',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev4-fastback': {
    paragraphs: [
      'Kia EV4 Fastback er lágur og straumlínulagaður fólksbíll með rennilegt lag. Hann hentar einkar vel þeim sem aka mikið milli landshluta og kunna að meta lága loftmótstöðu og aksturseiginleika fólksbíls frekar en háa sætisstöðu.',
      'Helsti styrkur bílsins er drægnin, en hann er meðal þeirra langdrægustu í sínum verðflokki og mjög ódýr á hvern kílómetra drægni. Rafhlaðan dugar vel í vetrarkulda milli landshluta, og í ferðalögum hleður hann hraðar en flestir bílar á svipuðu verði.',
      'Aftur á móti er bíllinn aðeins framhjóladrifinn, fremur hægur og aflminni en flestir á svipuðu verði. Ef meiri kraftur skiptir máli er Skoda Elroq 85 með 58 kW meira afl og 1,1 s sneggri í 0-100 km/klst á nánast sama verði. Þá býður Kia EV3 Long Range upp á nánast sömu drægni en er 500.000 kr. ódýrari.',
      'Fyrir kaupendur sem vilja lágan fólksbíl sem kemst langt fyrir peninginn er EV4 Fastback sérlega hagkvæmur kostur.',
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
      'Kia EV5 er kassalaga og rúmgóður fjölskyldujepplingur með kantað og sérstætt útlit. Hönnunin er hagnýt með háu þaki og góðu útsýni til allra átta, sem gerir innanrýmið bjart og þægilegt. Hann hentar vel fjölskyldum sem vilja hefðbundið jepplingalag frekar en lágreistan hlaðbak.',
      'Helsti styrkur hans í daglegu lífi hérlendis er fjórhjóladrifið, sem tryggir öruggt grip í snjó, bleytu og hálku. Bíllinn leggur áherslu á ljúfa fjöðrun og rólegan akstur sem nýtist vel innanbæjar og í venjulegum hversdagsferðum.',
      'Á móti kemur að miðað við aðra á svipuðu verði drífur hann styttra en flestir og hleður hægar en flestir. Hann hleður fremur hægt á ferðalögum, svo ef farið er oft um landið er Volkswagen ID.4 GTX fýsilegri kostur með 45 km meiri drægni og um 15% styttri hleðslustopp.',
      'Kia EV5 er því ágætur kostur fyrir þá sem vilja sérstakt útlit og mikið pláss með fjórhjóladrifi, svo lengi sem fólk sættir sig við að keppinautarnir komist lengra og hlaði hraðar.',
    ],
    facts: '97e875731646',
    model: 'gemini-3.8-flash, thinking high',
  },
  'kia-ev6-2025-long-range-awd': {
    paragraphs: [
      'Kia EV6 er straumlínulagaður og sportlegur fjórhjóladrifsbíll sem liggur neðar en hefðbundnir jepplingar. Hann höfðar sérstaklega til þeirra sem vilja lipran og stöðugan bíl í vetrarfærð og meta akstursánægju og snerpu til jafns við hversdagslega notkun.',
      'Stærsti kostur bílsins er hraðhleðslan, en hann hleður mjög hratt og er meðal þeirra sem hlaða hraðast í sínum verðflokki. Í ferðalögum um landið þýðir það óvenju stutt stopp við hleðslustöðvar. Hann er einnig sneggri en flestir bílar á svipuðu verði og rafhlaðan er stærri en hjá flestum þeirra, sem nýtist vel í vetrarkulda samhliða drifinu.',
      'Drægnin er hins vegar í meðallagi miðað við verðflokkinn. Ef meiri drægni skiptir öllu máli býður Hyundai IONIQ 5 upp á 24 km meiri drægni og um 5% styttri hleðslustopp. Fyrir þá sem vilja hærri sætisstöðu og hefðbundið jepplingalag kemur Nissan Ariya til greina, en þar eru hleðslustoppin um 135% lengri og bíllinn aðeins framhjóladrifinn.',
      'Á heildina litið er EV6 kjörinn kostur fyrir þá sem leita að kvikum fjórhjóladrifsbíl þar sem fljótleg hleðslustopp á langferðum vega þyngra en mesta mögulega drægnin.',
    ],
    facts: 'f4b80134c57d',
    model: 'gemini-3.8-flash, thinking high',
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
      'Stærsti styrkur bílsins er verðið, enda er hann mjög ódýr og mjög ódýr á hvern km drægni. Hann hleður fremur hægt, en hleðslustoppin eru þó styttri en hjá öðrum á svipuðu verði, auk þess sem hann reynist óvænt kvikur miðað við sína helstu keppinauta.',
      'Að sama skapi gefur maður eftir í langdrægni, því bíllinn er með mjög litla rafhlöðu og drífur mjög stutt. Í íslenskum vetrarkulda dugar það varla milli landshluta án tíðra hleðslna. Ef meiri drægni skiptir máli fæst MG MG4 Urban Standard Range á sama verði með 33 km meiri drægni, þótt hleðslustoppin séu um 20% lengri.',
      'Sem ódýr og handhægur bæjarbíll til að sinna hversdagslegum þörfum er Leapmotor B03X Pro fínn kostur sem vert er að skoða.',
    ],
    facts: 'dba3166a5d28',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-b03x-promax': {
    paragraphs: [
      'Leapmotor B03X ProMax er nett og mjög ódýr fimm sæta fólksbifreið með framhjóladrifi. Hann einkennist af miklu afli miðað við smæð sína, sem gerir hann lipran og snaran í umferðinni. Hann hentar vel sem hagkvæmur borgarbíll fyrir þá sem vilja öruggt afl í daglegu stússi án þess að borga mikið fyrir bílinn.',
      'Í sínum verðflokki stendur hann vel að vígi, þar sem hann drífur lengra og er aflmeiri en flestir bílar á svipuðu verði. Hann er einnig meðal þeirra sem hlaða hraðast miðað við aðra í sama verðflokki. Í daglegu lífi veitir þetta áreynslulausari framúrakstur og þýðir að hleðslustopp á ferðalögum milli landshluta dragast síður á langinn.',
      'Á móti kemur að hann drífur mjög stutt og rafhlaðan er mjög lítil, svo í íslenskum vetrarkulda þarf að gera ráð fyrir tíðari hleðslum. Systurbíllinn Leapmotor B05 Pro er 100.000 kr. ódýrari og með 19 km meiri drægni, en tekur um 5% lengri hleðslustopp. Ef meiri drægni skiptir höfuðmáli býður MG MG4 Urban Long Range upp á 34 km meiri drægni, þótt hleðslustoppin séu um 30% lengri.',
      'Fyrir þá sem vilja snöggan og ódýran hversdagsbíl sem eyðir stuttum tíma við hraðhleðslustöðvar er B03X ProMax einkar heppilegur kostur.',
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
      'Leapmotor B10 er nettur jepplingur sem býður upp á óvenju mikið fyrir peninginn. Hann er afturhjóladrifinn og lipur í snúningum, en jafnframt rúmgóður og þægilegur fyrir daglegt fjölskyldulíf.',
      'Miðað við aðra bíla á svipuðu verði færðu hér meira afl og snarpari hröðun, sem kemur sér vel við framúrakstur og inn á stofnbrautir. Hann er líka með stærri rafhlöðu en flestir í sama verðflokki og hleður hraðar en þeir, þótt hann hlaði fremur hægt á heildina litið. Þar að auki er hann ódýrari á hvern kílómetra drægni en flestir þeirra.',
      'Drægnin er í meðallagi miðað við aðra á svipuðu verði, en hann drífur mjög stutt á heildina litið og í íslenskum vetrarkulda þarf að gera ráð fyrir tíðari stoppum milli landshluta. Ef drægnin skiptir mestu máli kemst MG MG4 Urban Long Range 55 km lengra, en býður þó upp á um 10% lengri hleðslustopp og minna afl.',
      'Fyrir þá sem vilja hagkvæman og snaggaralegan jeppling með góðum hleðsluhraða í sínum verðflokki er Leapmotor B10 virkilega áhugaverður kostur.',
    ],
    facts: '8cce705ff9bf',
    model: 'gemini-3.8-flash, thinking high',
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
      'Leapmotor C10 ProMax er rúmgóður fimm sæta jepplingur sem hentar sérlega vel fjölskyldum sem leita að hagnýtum ferðabíl. Hann sker sig úr með því að bjóða meira pláss og afl en vanalega fæst á þessu verði.',
      'Í sínum verðflokki er hann með einni af stærstu rafhlöðunum, drífur lengra og er sneggri og aflmeiri en flestir. Hann er jafnframt meðal þeirra allra ódýrustu á hvern kílómetra drægni af rafbílum hér á landi. Stóra rafhlaðan veitir gott öryggi í íslenskum vetrarkulda og langkeyrslu milli landshluta.',
      'Á móti er Leapmotor nýtt merki á markaðnum og bíllinn er aðeins afturhjóladrifinn. Af öllum rafbílum hleður hann hægar en flestir, þótt hann hlaði hraðar en keppinautarnir á svipuðu verði. Fyrir þá sem vilja þekktara vörumerki og um 10% styttri hleðslustopp gæti Volkswagen ID.3 Neo hentað betur, eða Hyundai Kona Electric ef fólk kýs liprari bíl.',
      'Fyrir kaupendur sem horfa fyrst og fremst í mikið pláss, kraft og mikla drægni á hagstæðu verði er þessi bíll afar vænlegur kostur.',
    ],
    facts: 'b7ee9166431c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'leapmotor-c10-promax-awd': {
    paragraphs: [
      'Leapmotor C10 ProMax AWD er aflmikill jepplingur með fjórhjóladrifi sem höfðar sérstaklega til þeirra sem leita að miklu afli og öruggu gripi á hagstæðu verði. Hann hentar vel fjölskyldum sem aka reglulega í snjó og hálku en vilja jafnframt snögga svörun í daglegum akstri.',
      'Bíllinn er ódýrari en flestir rafbílar á Íslandi og er með einni af stærstu rafhlöðunum í sínum verðflokki. Hröðunin og aflið skipa honum meðal þeirra allra sneggstu og aflmestu á markaðnum, sem gerir allan framúrakstur afar léttan og veitir mikið öryggi við krefjandi aðstæður.',
      'Á móti kemur að hann drífur styttra en flestir í sínum verðflokki, auk þess sem hann hleður hægar en flestir. Fyrir þá sem setja snörp ferðalög milli landshluta í forgang væri XPENG G6 RWD Standard Range heppilegri kostur, enda eru hleðslustopp hans um 30% styttri.',
      'Ef markmiðið er hins vegar að fá fjórhjóladrif og mikið vélarafl á innan við sex milljónir króna býður Leapmotor C10 upp á sérlega mikið fyrir peninginn.',
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
      'Lexus ES 500e er stór og fáguður lúxusfólksbíll sem höfðar til þeirra sem meta mikil þægindi, hljóðlátt umhverfi og rólyndi í akstri umfram allt annað. Hann leggur áherslu á hefðbundinn lúxus og vandaða smíði frekar en sportlega takta.',
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
      'Lexus RZ 500e er fágaður lúxusjepplingur þar sem áherslan er lögð á mikil þægindi, hljóðlátan akstur og vandað handbragð. Hann hentar þeim sem vilja háa setstöðu og áreynslulausa aksturseiginleika í daglegu amstri, frekar en lágbyggðan fólksbíl.',
      'Helsti styrkleiki hans er snerpan, en hann er sneggri en flestir í hröðun bæði af öllum rafbílum og í sínum verðflokki. Fjórhjóladrifið veitir mikið öryggi og fumlaust grip í snjó og vetrarfærð, og aflið gerir allar framúrakstursaðstæður léttar.',
      'Á móti kemur að hann gefur eftir í drægni og hleðslu. Í sínum verðflokki er hann meðal þeirra sem drífa styst og meðal þeirra sem hlaða hægast, auk þess að vera meðal þeirra dýrustu á hvern kílómetra drægni. Fyrir þá sem aka oft á milli landshluta væri Mercedes-Benz EQE SUV 350 4MATIC álitlegri kostur með 94 km meiri drægni, eða BMW i4 M60 xDrive sem er 500.000 kr. ódýrari og hefur um 20% styttri hleðslustopp.',
      'Bíllinn býður upp á ljúfan lúxus og mikið afl í nærumhverfinu, en drægnin og hleðslutíminn draga úr gildi hans á lengri ferðalögum miðað við verðið.',
    ],
    facts: 'f94441e54214',
    model: 'gemini-3.8-flash, thinking high',
  },
  'lexus-rz-550e-f-sport': {
    paragraphs: [
      'Lexus RZ 550e F SPORT er fágaður lúxusjepplingur með fjórhjóladrifi sem höfðar fyrst og fremst til þeirra sem leita að hljóðlátum þægindum, vönduðum frágangi og miklu afli. Hann sker sig úr með sportlegu yfirbragði og mjög snörpu viðbragði miðað við stærð, sem gerir innanbæjarakstur lipran og áreynslulausan.',
      'Helsti styrkur bílsins felst einmitt í hröðuninni, en hann er sneggri en flestir bílar í sínum verðflokki. Fjórhjóladrifið tryggir jafnframt traust grip og stöðugleika í snjó og hálku, sem kemur sér vel í krefjandi íslenskum vetraraðstæðum.',
      'Á móti kemur að bíllinn er meðal þeirra dýrustu hér á landi en drífur styst og hleður hægast í sínum verðflokki, sem gerir hann dýran á hvern kílómetra drægni. Fyrir þá sem fara oft í langferðir væri Audi SQ6 e-tron mun heppilegri kostur, en hann kostar 600.000 kr. meira og býður upp á 136 km meiri drægni ásamt um 45% styttri hleðslustoppum.',
      'Lexus RZ 550e F SPORT er því frekar sniðinn fyrir fágaðan kraft og þægindi í daglegu amstri en strjálar hraðhleðslustöðvar á löngum ferðalögum milli landshluta.',
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
      'Mazda 6e er lágur og rennilegur fólksbíll með afturhjóladrifi, sniðinn fyrir þá sem vilja þægilegan og hefðbundinn ferðabíl. Hann býður upp á rólega og stöðuga aksturseiginleika og hentar einkar vel ökumönnum sem aka mikið langakstur og kjósa hefðbundið fólksbílalag fram yfir hærri jepplinga.',
      'Stærsti kostur bílsins er hversu mikið fæst fyrir peninginn. Hann drífur lengra en flestir rafbílar hér á landi og er með stærri rafhlöðu en flestir í sínum verðflokki, sem gerir hann meðal þeirra ódýrustu á hvern km drægni. Fyrir vikið dugar drægnin vel í vetrarkulda og milli landshluta án stöðugra hleðsluáhyggna.',
      'Helsti ókosturinn er hraðhleðslan, en bíllinn hleður hægar en flestir í sínum verðflokki og er meðal þeirra sem hlaða hægast af öllum bílum á landinu. Á langferðum tekur töluvert lengri tíma að bæta á rafhlöðuna; sem dæmi býður Nissan Leaf Extended Range upp á um 40% styttri hleðslustopp og Volkswagen ID.3 Neo 58 kWh um 35% styttri hleðslustopp.',
      'Fyrir þá sem hlaða að mestu heima og leita að langdrægum fólksbíl á hagstæðu verði er Mazda 6e afar fýsilegur kostur, svo lengi sem fólk hefur þolinmæði í lengri viðkomur við hraðhleðslustöðvar úti á landi.',
    ],
    facts: '7cc08e00859c',
    model: 'gemini-3.8-flash, thinking high',
  },
  'mazda-cx-6e-78-kwh': {
    paragraphs: [
      'Mazda CX-6e er hagnýtur fjölskyldubíll sem hentar vel þeim sem leita að rúmgóðum ferðabíl á hagstæðu verði. Hann er ódýrari en flestir rafbílar hér á landi og býður upp á drægni sem dugar vel í daglegan akstur og venjuleg ferðalög milli landshluta, þótt búast megi við að hún minnki í íslenskum vetrarkulda.',
      'Í sínum verðflokki stendur bíllinn vel að vígi með stærri rafhlöðu en flestir og hleður hraðar en flestir bílar á svipuðu verði. Þetta þýðir styttri hleðslustopp á langferðum um landið, auk þess sem hann er ódýrari á hvern kílómetra drægni en flestir rafbílar á markaðnum.',
      'Á móti kemur að bíllinn er aðeins með afturhjóladrif og hröðunin er hægari en hjá flestum í þessum verðflokki. Fyrir þá sem vilja fjórhjóladrif í snjó og hálku, ásamt mun meiri krafti, gæti Hongqi EHS5 hentað betur, en hann er 100.000 kr. dýrari og 3,9 s sneggri í 0-100 km/klst.',
      'Mazda CX-6e er heilt yfir skynsamlegur kostur fyrir þá sem meta hagkvæmni og snögga hleðslu á langferðum meira en mikið spyrnuafl eða vetrardrif.',
    ],
    facts: '4b812db57179',
    model: 'gemini-3.8-flash, thinking high',
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
      'Skoda Elroq 85 er hagnýtur og nettari jepplingur þar sem áherslan er á einfaldleika, gott rými og mikla nýtni frekar en prjál. Hann hentar sérstaklega fjölskyldum sem leita að liprum hversdagsbíl sem er um leið tilbúinn í langferðir.',
      'Bíllinn drífur fremur langt og er meðal þeirra langdrægustu miðað við aðra í sínum verðflokki, auk þess að vera sérlega ódýr á hvern kílómetra drægni. Þetta þýðir að hann kemst léttilega milli landshluta, jafnvel í vetrarkulda. Hann hleður hraðar en flestir á svipuðu verði, sem styttir stopp á hleðslustöðvum, og er aflmeiri en flestir í sama flokki.',
      'Helsti ókosturinn er að hann er aðeins með afturhjóladrif. Fyrir þá sem þurfa meira grip í hálku og snjó býður Hongqi EHS5 upp á fjórhjóladrif og um 25% styttri hleðslustopp, en er 200.000 kr. dýrari og hefur 57 km minni drægni. XPENG G6 RWD Long Range býður sömuleiðis upp á um 25% styttri hleðslustopp en er 500.000 kr. dýrari.',
      'Fyrir þá sem vilja hámarksdrægni og mikla hagnýtingu fyrir aurinn er Elroq eitt skynsamlegasta valið á markaðnum.',
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
