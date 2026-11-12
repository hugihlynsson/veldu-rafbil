import { describe, expect, it } from 'vitest'

import systemPrompt from './prompt'
import addDecimalSeparators from '@/modules/copy/addDecimalSeparators'
import cars from '@/modules/data/cars'
import { carRef, resolveCarRefs } from '@/modules/chat/cars'
import {
  grantAmountText,
  grantLostRangeText,
  grantStartText,
  previousGrantAmountText,
} from '@/modules/copy/grantCopy'
import { realRangeHighFactor, realRangeLowFactor } from '@/modules/data/globals'
import { allNews } from '@/modules/news/history'
import { recentChangesSection } from './recentChanges'

describe('the assistant system prompt', () => {
  const lines = systemPrompt.split('\n')
  const lineOf = (car: (typeof cars)[number]) =>
    lines.find((line) => line.startsWith(`${car.label}: `))

  it('lists every car by its label and the price a buyer pays', () => {
    for (const car of cars) {
      expect(systemPrompt, car.id).toContain(
        `${car.label}: ${addDecimalSeparators(car.priceWithGrant)} kr`,
      )
    }
  })

  // The card labels it, and an advisor quoting it bare would promise a price
  // the seller has not set
  it('marks the price of an expected car, and only that, as an estimate', () => {
    for (const car of cars) {
      const marked = lineOf(car)?.includes(
        `${addDecimalSeparators(car.priceWithGrant)} kr (áætlað verð)`,
      )
      expect(marked, car.id).toBe(car.availability === 'expected')
    }
    expect(systemPrompt).toContain('Segðu alltaf að verðið sé áætlað')
  })

  // Without them a question about charging was answered from the model's
  // memory, and could disagree with the card beside the chat
  it('gives every car the battery and fast-charge figures its card shows', () => {
    for (const car of cars) {
      const line = lineOf(car)
      expect(line, car.id).toContain(`${car.capacity} kWh`)
      expect(line, car.id).toContain(`${car.timeToCharge10To80} mín`)
      expect(line, car.id).toContain(`${car.kmPerMinuteCharged} km/mín`)
    }
  })

  // The prompt says so, and asked for a cheap car that is also good at
  // something, the model only read past the cars it knew once they were
  it('lists the cars cheapest first', () => {
    const prices = cars
      .toSorted((a, b) => lines.indexOf(lineOf(a)!) - lines.indexOf(lineOf(b)!))
      .map((car) => car.priceWithGrant)
    expect(prices).toEqual(prices.toSorted((a, b) => a - b))
  })

  it('counts the cars from the list', () => {
    expect(systemPrompt).toContain(`upplýsingum um ${cars.length} rafbíla`)
  })

  it('names the grant the prices actually use', () => {
    expect(systemPrompt).toContain(grantAmountText)
  })

  // Buyers still quote the old figures, and an application decided after the
  // change gets the new grant however early the car was registered
  it('explains what changed about the grant and what decides it', () => {
    expect(systemPrompt).toContain(
      `lækkaði ${grantStartText} úr ${previousGrantAmountText} og bílar sem kosta ${grantLostRangeText} fá hann ekki lengur`,
    )
    expect(systemPrompt).toContain('Dagsetning samþykktrar umsóknar ræður')
  })

  // /api/cars and llms.txt quote the same bounds; the prompt once had its own
  it('quotes the real-range bounds the published data uses', () => {
    const low = Math.round(realRangeLowFactor * 100)
    const high = Math.round(realRangeHighFactor * 100)
    expect(systemPrompt).toContain(`${low}%-${high}% af WLTP`)
  })

  // What changed and when, which the updates page and each car's page show
  // beside the chat; the advisor would otherwise guess
  it('tells what changed on the list, with the rules for reading it', () => {
    expect(systemPrompt).toContain(recentChangesSection(allNews))
    expect(systemPrompt).toContain('listaverð FYRIR ríkisstyrk')
    expect(systemPrompt).toContain('Þú veist ekki hvaða dagur er í dag')
    expect(systemPrompt).toContain('svo ekki giska')
  })

  // The changes go after the cars, whose lines carry the refs, and before the
  // rules that read them
  it('sets the changes between the car list and the rules', () => {
    const changes = systemPrompt.indexOf('Breytingar á listanum frá')
    const lastCar = Math.max(
      ...cars.map((car) => systemPrompt.indexOf(`${car.label}: `)),
    )
    expect(changes).toBeGreaterThan(lastCar)
    expect(changes).toBeLessThan(systemPrompt.indexOf('Gott að hafa í huga'))
  })

  // A marker the chat UI would render as text rather than a follow-up chip
  it('asks for follow-ups in the format the chat parses', () => {
    expect(systemPrompt).toMatch(/\[q:[^\]]+\]/)
  })

  // The ref is copied off this line into a [car:…] marker, and has to come
  // back as the car it sits beside
  it('gives every car the ref its marker resolves to', () => {
    for (const car of cars) {
      expect(lineOf(car), car.id).toContain(`(auðkenni: ${carRef(car)})`)
      expect(resolveCarRefs([carRef(car)])).toEqual([car.id])
    }
  })

  // An example naming a car no longer on the list teaches a ref that is dropped
  it('asks for car markers by an example of a real one', () => {
    const examples = [...systemPrompt.matchAll(/\[car:([^\]<]+)\]/g)].map(
      (match) => match[1] ?? '',
    )
    expect(examples.length).toBeGreaterThan(0)
    expect(resolveCarRefs(examples)).toHaveLength(examples.length)
  })

  // After the answer, where the order they come in is the ranking rather than
  // whichever car the text happened to name first
  it('shows the car markers after the answer, before the follow-ups', () => {
    const example = systemPrompt.slice(systemPrompt.indexOf('TIL DÆMIS'))
    expect(example.indexOf('[car:')).toBeLessThan(example.indexOf('[q:'))
  })
})
