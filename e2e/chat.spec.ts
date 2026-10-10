import { expect, test, type Page } from '@playwright/test'

import cars from '@/modules/data/cars'
import { stubChat } from './stubChat'

const question = 'Hvaða fjórhjóladrifni bíll er bestur?'
const followUp = 'Hvað fer hann langt?'
const awdCar = cars.find((car) => car.drive === 'AWD')!

const answer = {
  text: `${awdCar.label} er góður kostur.`,
  followUps: [followUp],
  cars: [awdCar.id],
}

const bar = (page: Page) => page.getByPlaceholder('Spurðu Veldu Rafbíl')
const chat = (page: Page) => page.getByRole('dialog', { name: 'Spjall' })

const ask = async (page: Page, text = question) => {
  await bar(page).click()
  await bar(page).fill(text)
  await bar(page).press('Enter')
  await expect(message(page, answer.text)).toBeVisible()
}

// A message as its bubble shows it, not as the live region announces it
const message = (page: Page, text: string) =>
  chat(page).getByRole('paragraph').filter({ hasText: text })

const scrollTo = async (page: Page, top: number) => {
  await page.evaluate((top) => window.scrollTo(0, top), top)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(top)
}

test.describe('the chat', () => {
  test('answers a question asked from the bar, once', async ({ page }) => {
    const requests = await stubChat(page, answer)
    await page.goto('/')

    await ask(page)

    expect(requests).toHaveLength(1)
    expect(requests[0].messages.map(({ role }) => role)).toEqual(['user'])
    await expect(
      chat(page).getByRole('button', { name: followUp }),
    ).toBeVisible()
    await expect(
      chat(page).getByRole('button', { name: awdCar.label }),
    ).toBeVisible()
  })

  test('holds the page still behind it, and hands focus back on Esc', async ({
    page,
  }) => {
    await stubChat(page, answer)
    await page.goto('/')
    await scrollTo(page, 2000)

    await ask(page)
    await page.keyboard.press('Escape')

    await expect(chat(page)).toBeHidden()
    await expect(bar(page)).toBeFocused()
    expect(await page.evaluate(() => window.scrollY)).toBe(2000)
  })

  test('shows a car the filters hide when it is picked', async ({ page }) => {
    await stubChat(page, answer)
    await page.goto('/?drif=FWD')
    await expect(page.locator(`#${awdCar.id}`)).toHaveCount(0)

    await ask(page)
    await chat(page).getByRole('button', { name: awdCar.label }).click()

    await expect(chat(page)).toBeHidden()
    const card = page.locator(`#${awdCar.id}`)
    await expect(card).toBeFocused()
    await expect(card).toBeInViewport()
    await expect(page).not.toHaveURL(/drif=FWD/)
  })

  test('sends a follow-up with the conversation before it', async ({
    page,
  }) => {
    const requests = await stubChat(page, answer)
    await page.goto('/')

    await ask(page)
    await chat(page).getByRole('button', { name: followUp }).click()

    await expect.poll(() => requests.length).toBe(2)
    expect(requests[1].messages.map(({ role }) => role)).toEqual([
      'user',
      'assistant',
      'user',
    ])
  })

  test('keeps the conversation across a reload, until it is cleared', async ({
    page,
  }) => {
    await stubChat(page, answer)
    await page.goto('/')
    await ask(page)

    await page.reload()
    await bar(page).click()
    await expect(message(page, question)).toBeVisible()

    await chat(page).getByRole('button', { name: 'Hreinsa spjall' }).click()
    await expect(chat(page)).toBeHidden()
    expect(
      await page.evaluate(() =>
        localStorage.getItem('veldu-rafbil-chat-messages'),
      ),
    ).toBeNull()
  })
})

test('the filter modal holds the page still and hands focus back', async ({
  page,
}) => {
  await page.goto('/')
  await scrollTo(page, 100)
  const open = page.getByRole('button', { name: 'Leita', exact: true })

  await open.click()
  const modal = page.getByRole('dialog', { name: 'Leita' })
  await expect(modal.getByLabel('Nafn')).toBeFocused()
  await page.keyboard.press('Escape')

  await expect(modal).toBeHidden()
  await expect(open).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(100)
})
