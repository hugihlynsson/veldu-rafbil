import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages, stepCountIs, UIMessage } from 'ai'
import { Axiom } from '@axiomhq/js'
import { z } from 'zod'
import newCars from '../../../modules/newCars'
import getPriceWithGrant from '../../../modules/getPriceWithGrant'
import {
  grantAmountText,
  grantCeilingDativeText,
} from '../../../modules/grantCopy'
import { fetchCarDetailsTool } from './tools/fetchCarDetails'
import { clientKey, rateLimit } from './rateLimit'

// Picked on Icelandic performance, not general benchmarks: 3.7 scores above
// 3.8 there and spends ~30% fewer output tokens at the same price.
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
const modelName = 'gemini-3.7-flash'

const carsSummary = newCars
  .map(
    (car) =>
      `${car.make} ${car.model} ${car.subModel ? car.subModel : ''}: ${getPriceWithGrant(car.price).toLocaleString('is-IS')} kr, ${car.range} km drægni, ${car.acceleration}s hröðun, ${car.drive} drif, ${car.seats} sæti${car.expectedDelivery ? ` (væntanlegur ${car.expectedDelivery})` : ''}${car.evDatabaseURL ? ` (more info: ${car.evDatabaseURL})` : ''}`,
  )
  .join('\n')

const systemPrompt = `Þú ert hjálpsamur ráðgjafi fyrir Veldu Rafbíl, íslenskan vef sem hjálpar fólki að bera saman og velja alla 100% rafdrifna bíla sem eru í boði á Íslandi.

- Þú ert reiprennandi á íslensku og svarar alltaf á íslensku.

Þú hefur aðgang að upplýsingum um ${newCars.length} rafbíla sem eru fáanlegir á Íslandi:

${carsSummary}

Gott að hafa í huga:
- Notaðu upplýsingarnar hér að ofan til að gefa nákvæmar, sértækar upplýsingar
- Verðin hér að ofan eru EFTIR ${grantAmountText} ríkisstyrk (fyrir bíla undir ${grantCeilingDativeText} kr)
- Drægni byggir á WLTP mælingum
- Þegar spurt er um raunverulega drægni, útskýrðu að hún verði minni vegna þátta eins og aksturs og veðuraðstæðna á Íslandi
- Gerðu þitt besta til að meta raun-drægni (venjulega 70-85% af WLTP í köldu loftslagi eins og á Íslandi)
- Þú veist EINUNGIS um bílana sem eru taldir upp hér að ofan
- Þú veist EINUNGIS um rafbíla á Íslandi
- Sætafjöldinn að ofan er mesti fjöldi sæta sem bíllinn fæst með á Íslandi, þar með talið gegn aukagjaldi. Verðið er hins vegar fyrir ódýrustu útfærsluna, svo taktu fram að sætin geti kostað aukalega þegar það á við. Ekki giska út frá því sem bíllinn býður í öðrum löndum
- Veldu Rafbíl er búin til af Hugi Hlynssyni og er rekin sem óhagnaðardrifin samfélagsþjónusta. Upplýsingar svo sem verð og framboð geta verið úreltar
- Þú getur aðstoðað við ýmislegt tengt rafbílum og rafbílaumhverfi á Íslandi
- Ef spurt er um eitthvað sem tengist ekki rafbílum þá VERÐUR þú að svara vinalega að þú sért ekki viss og biddu þá að spyrja um rafbíla í staðinn
- Svaraðu alltaf í venjulegum texta, ALDREI í JSON sniði
- Notaðu markdown tölflur til að birta samanburð á bílum. Hafði samt í huga að það er ekki svo mikið pláss svo hafðu þær í mesta lagi 3 dálka (columns) breiðar

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

// Left unbuilt without a token, so a local or preview run stays quiet
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

// Loose on purpose — convertToModelMessages owns the real shape. This only
// bounds the body, so an oversized post is a 400 rather than a bill.
const requestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().optional(),
          role: z.enum(['user', 'assistant', 'system']),
          parts: z.array(z.object({ type: z.string() }).loose()).max(50),
        })
        .loose(),
    )
    .min(1)
    .max(100),
})

export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Aðeins of margar fyrirspurnir, reyndu aftur eftir augnablik' },
      {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfterSeconds) },
      },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const messages = parsed.data.messages as UIMessage[]

  const result = streamText({
    model: google(modelName),
    messages: await convertToModelMessages(messages),
    system: systemPrompt,
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: 'medium' } },
    },
    stopWhen: stepCountIs(10),
    tools: {
      fetchCarDetails: fetchCarDetailsTool,
    },
    onFinish: async ({ text, usage, toolCalls }) => {
      if (!axiom) return

      const lastUserMessage = messages[messages.length - 1]
      const firstPart = lastUserMessage?.parts?.[0]
      const userMessageText =
        firstPart && 'text' in firstPart ? firstPart.text : undefined

      try {
        await axiom.ingest('veldu-rafbil-assistant', [
          {
            type: 'chat_response_finished',
            timestamp: new Date().toISOString(),
            userMessage: userMessageText,
            assistantResponse: text,
            messageCount: messages.length,
            tokenUsage: usage,
            toolCalls: toolCalls,
            model: modelName,
            environment: process.env.NODE_ENV || 'development',
          },
        ])
        await axiom.flush()
      } catch (error) {
        console.error('Failed to log to Axiom:', error)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
