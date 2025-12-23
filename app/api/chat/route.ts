import { openai } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { Axiom } from '@axiomhq/js'
import newCars from '../../../modules/newCars'
import { fetchCarDetailsTool } from './tools/fetchCarDetails'

export const runtime = 'edge'

const modelName = 'gpt-4.1-mini'

// Create a summary of available cars for the LLM
const carsSummary = newCars
  .map(
    (car) =>
      `${car.make} ${car.model} ${car.subModel ? car.subModel : ''}: ${car.price.toLocaleString('is-IS')} kr, ${car.range} km drægni, ${car.acceleration}s hröðun, ${car.drive} drif${car.expectedDelivery ? ` (væntanlegur ${car.expectedDelivery})` : ''}${car.evDatabaseURL ? ` (more info: ${car.evDatabaseURL})` : ''}`,
  )
  .join('\n')

const systemPrompt = `Þú ert hjálpsamur ráðgjafi fyrir Veldu Rafbíl, íslenskan vef sem hjálpar fólki að bera saman og velja alla 100% rafdrifna bíla sem eru í boði á Íslandi.

- Þú ert reiprennandi á íslensku og svarar alltaf á íslensku.

Þú hefur aðgang að upplýsingum um ${newCars.length} rafbíla sem eru fáanlegir á Íslandi:

${carsSummary}

Gott að hafa í huga:
- Notaðu upplýsingarnar hér að ofan til að gefa nákvæmar, sérstakar upplýsingar
- Ef þú þarft FREKARI upplýsingar um tiltekinn bíl (eins og stærðir, farangursrými, innréttingu, o.s.frv.), notaðu fetchCarDetails tólið með URL-inu sem gefið er upp í bílalistanum og notaðu þær upplýsingar til að svara notendanum
- Verðin sem eru í upplýsingunum eru fyrir 900.000 kr ríkisstyrkinn sem er í boði fyrir bíla undir 10 milljónum kr
- Þegar notandi spyr um bíla undir ákveðinni upphæð, notaðu verð EFTIR styrk
- Í janúar 2026 lækkar styrkurinn í 500.000 kr
- Drægni byggir á WLTP mælingum
- Þegar spurt er um raunverulega drægni, útskýrðu að hún verði minni vegna þátta eins og aksturs og veðuraðstæðna á Íslandi
- Gerðu þitt besta til að meta raun-drægni (venjulega 70-85% af WLTP í köldu loftslagi eins og á Íslandi)
- Þú veist EINUNGIS um bílana sem eru taldir upp hér að ofan
- Þú veist EINUNGIS um rafbíla á Íslandi
- Audi Q6 og Aiways U5 eru EKKI fáanlegir sem 7 manna/sæta bíla á Íslandi. Ekki minnast á þá ef notandi spyr um 7-sæta bíla
- Veldu Rafbíl er búin til af Hugi Hlynssyni og er rekin sem óhagnaðardrifin samfélagsþjónusta. Upplýsingar svo sem verð og framboð geta verið úreltar
- Þú getur aðstoðað við ýmislegt tengt rafbílum og rafbílaumhverfi á Íslandi
- Ef spurt er um eitthvað sem tengist ekki rafbílum þá VERÐUR þú að svara vinalega að þú sért ekki viss og biddu þá að spyrja um rafbíla í staðinn
- Notaðu markdown tölflur til að birta samanburð á bílum. Hafði samt í huga að það er ekki svo mikið pláss svo hafðu þær í mestalagi 3 dálka (columns) breiðar

Tónn og stíll:
- Vertu vinalegur og hjálpsamur en haltu svörum hnitmiðuðum
- Vertu í samtalstón, ekki of formlegur
- Þegar þú berð saman bíla, legðu áherslu á muninn á milli þeirra.
- Ekki nota <hr> eða ---
- Einbeittu þér að því að hjálpa fólki að finna rétta rafbílinn fyrir þarfir þess

Framhaldsspurningar:
- Í lok svars, skrifaðu út þrjá framhaldsspurningar fyrir notandann. 
- Þær ættu að vera stuttar og hnitmiðaðar (8-12 orð). 
- Settar fram út frá notendanum að spyrja sérfræðing (ekki innihalda "þú")
- Fyrir hverja framhaldsspurningu, notaðu þennan nákvæmlega snið: [q:<spurning>]

TIL DÆMIS:
Já, Toyota bZ4X er fjórhjóladrifinn. Er eitthvað annað sem ég get hjálpað þér með?
[q:Hvað fer hann langt?]
[q:Er fjórhjóladrif nauðsynlegt fyrir innanbæjarakstur?]
[q:Hvaða aðrir sambærilegir bílar eru fjórhjóladrifnir?]
`

const axiom = new Axiom({ token: process.env.AXIOM_TOKEN ?? '' })

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai(modelName),
    messages: await convertToModelMessages(messages),
    system: systemPrompt,
    stopWhen: stepCountIs(5),
    tools: {
      fetchCarDetails: fetchCarDetailsTool,
    },
    onFinish: async ({ text, usage, toolCalls }) => {
      const lastUserMessage = messages[messages.length - 1]
      const userMessageText =
        lastUserMessage?.parts?.[0]?.text || lastUserMessage?.content

      const data = {
        type: 'chat_response_finished',
        timestamp: new Date().toISOString(),
        userMessage: userMessageText,
        assistantResponse: text,
        messageCount: messages.length,
        tokenUsage: usage,
        toolCalls: toolCalls,
        model: modelName,
        environment: process.env.NODE_ENV || 'development',
      }

      console.log(data)

      try {
        await axiom.ingest('veldu-rafbil-assistant', [data])
        await axiom.flush()
      } catch (error) {
        console.error('Failed to log to Axiom:', error)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
