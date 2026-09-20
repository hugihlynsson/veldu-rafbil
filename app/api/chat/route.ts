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

// Best score against cost and speed on Miðeind's Icelandic LLM leaderboard —
// the advisor only answers in Icelandic, so general benchmarks don't settle it.
// Check there before switching:
// https://huggingface.co/spaces/mideind/icelandic-llm-leaderboard
// 3.7 Flash scores above 3.8 there, and at the same price 3.8 spends ~30% more
// output tokens per task.
const modelName = 'gemini-3.7-flash'

const carsSummary = newCars
  .map(
    (car) =>
      `${car.make} ${car.model} ${car.subModel ? car.subModel : ''}: ${getPriceWithGrant(car.price).toLocaleString('is-IS')} kr, ${car.range} km drægni, ${car.acceleration}s hröðun, ${car.drive} drif${car.expectedDelivery ? ` (væntanlegur ${car.expectedDelivery})` : ''}${car.evDatabaseURL ? ` (more info: ${car.evDatabaseURL})` : ''}`,
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
- Audi Q6 og Aiways U5 eru EKKI fáanlegir sem 7 manna/sæta bíla á Íslandi. Ekki minnast á þá ef notandi spyr um 7-sæta bíla
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

// Only built when there is a token to build it with, so that a local or
// preview run without one stays quiet instead of announcing it on every call
const axiom = process.env.AXIOM_TOKEN
  ? new Axiom({ token: process.env.AXIOM_TOKEN })
  : undefined

// The shape the AI SDK's useChat sends. Loose on purpose — convertToModelMessages
// owns the real shape and it moves with the SDK. What this pins down is that the
// body is a bounded list of messages and not something arbitrary, so that a
// malformed or oversized post is a 400 here rather than a 500 somewhere deeper,
// or a very long prompt billed to us.
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

  // The schema checks the envelope; the parts inside are the SDK's own union,
  // which convertToModelMessages is the thing that actually understands.
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

      // Conversations go to Axiom, which is the telemetry this is for. They
      // used to also go to console, which put every question and answer in the
      // platform logs a second time, for nobody to read.
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
