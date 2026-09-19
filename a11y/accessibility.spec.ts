import AxeBuilder from '@axe-core/playwright'
import { expect, Page, test } from '@playwright/test'

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

// Reported as ids rather than the raw nodes, so a failure names the rule
// instead of printing a wall of serialised DOM
const violations = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze()
  return violations.map(({ id, help }) => `${id}: ${help}`)
}

const searchButton = (page: Page) =>
  page.getByRole('button', { name: 'Leita' }).last()

const chatInput = (page: Page) => page.getByPlaceholder('Spurðu Veldu Rafbíl')

const openFilters = async (page: Page) => {
  await searchButton(page).click()
  await expect(page.getByRole('dialog', { name: 'Leita' })).toBeVisible()
}

// Tab lands on the first suggestion because the send button is disabled while
// the input is empty
const openChatFromSuggestion = async (page: Page) => {
  await chatInput(page).focus()
  await expect(suggestions(page).first()).toBeVisible()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog', { name: 'Spjall' })).toBeVisible()
}

const suggestions = (page: Page) =>
  page
    .getByRole('group', { name: 'Tillögur að spurningum' })
    .getByRole('button')

// An answer that exercises the paths a plain error state never reaches:
// markdown, a GFM table, a link, the mentioned-car tiles and a follow-up
const answer = [
  'Fyrir innanbæjarakstur er **Tesla Model 3** góður kostur.',
  '',
  '| Bíll | Drægni |',
  '| --- | --- |',
  '| Tesla Model 3 | 534 km |',
  '',
  'Sjá einnig [WLTP](http://wltpfacts.eu/).',
  '',
  '[q:Hvað með Kia EV6?]',
].join('\n')

const seedHistory = (page: Page) =>
  page.addInitScript((text) => {
    localStorage.setItem(
      'veldu-rafbil-chat-messages',
      JSON.stringify([
        {
          id: 'u1',
          role: 'user',
          parts: [{ type: 'text', text: 'Hvaða rafbíll hentar mér?' }],
        },
        { id: 'a1', role: 'assistant', parts: [{ type: 'text', text }] },
      ]),
    )
  }, answer)

test.beforeEach(async ({ page }) => {
  // Keep the suite off the network. The chat route needs an API key CI does
  // not have, and the failure it produces is a state worth scanning anyway.
  await page.route('**/api/chat', (route) =>
    route.fulfill({ status: 500, body: '' }),
  )
  await page.goto('/')
})

test.describe('axe', () => {
  test('the list page has no violations', async ({ page }) => {
    expect(await violations(page)).toEqual([])
  })

  // The bare list renders none of the hint text, so it would miss a contrast
  // regression in the pills or the no-match line
  test('the filtered list page has no violations', async ({ page }) => {
    await page.goto('/?nafn=Tesla&verd=12000000&draegni=400&drif=AWD')
    await expect(
      page.getByRole('button', { name: /^Fjarlægja nafnasíu/ }),
    ).toBeVisible()

    expect(await violations(page)).toEqual([])
  })

  test('the filter dialog has no violations', async ({ page }) => {
    await openFilters(page)
    expect(await violations(page)).toEqual([])
  })

  test('the chat dialog has no violations', async ({ page }) => {
    await openChatFromSuggestion(page)
    expect(await violations(page)).toEqual([])
  })

  test('a rendered answer has no violations', async ({ page }) => {
    await seedHistory(page)
    await page.reload()

    await chatInput(page).click()
    await expect(page.getByRole('dialog', { name: 'Spjall' })).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Hvað með Kia EV6?' }),
    ).toBeVisible()

    expect(await violations(page)).toEqual([])
  })
})

// Everything below is what axe did not catch when all of it was broken. A
// clean axe run is not the point of this suite; these are.
test.describe('what axe cannot see', () => {
  test('the page has one h1, so heading navigation means something', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toHaveCount(1)
    // Every car is a heading under it rather than a second h1
    expect(await page.locator('article h2').count()).toBe(
      await page.locator('article').count(),
    )
  })

  test('the filter dialog is modal, named, and keeps focus inside', async ({
    page,
  }) => {
    await openFilters(page)

    expect(
      await page.evaluate(() =>
        document.querySelector('dialog')?.matches(':modal'),
      ),
    ).toBe(true)
    // Focus starts on the field the reader opened the dialog for, not the
    // close button showModal would otherwise pick
    await expect(page.locator('#filter-name')).toBeFocused()

    for (let tab = 1; tab <= 25; tab++) {
      await page.keyboard.press('Tab')
      const leaked = await page.evaluate(() => {
        const active = document.activeElement
        // Chromium parks on <body> as it wraps through the browser chrome,
        // which is not the same as reaching the list behind the dialog
        if (!active || active === document.body) return false
        return !document.querySelector('dialog')?.contains(active)
      })
      expect(
        leaked,
        `focus reached the page behind the dialog on tab ${tab}`,
      ).toBe(false)
    }
  })

  test('Escape closes the filter dialog and gives focus back', async ({
    page,
  }) => {
    await openFilters(page)
    await page.keyboard.press('Escape')

    await expect(page.locator('dialog')).toHaveCount(0)
    await expect(searchButton(page)).toBeFocused()
  })

  test('a chat suggestion can be reached and sent with the keyboard', async ({
    page,
  }) => {
    await chatInput(page).focus()
    await expect(suggestions(page).first()).toBeVisible()

    await page.keyboard.press('Tab')
    await expect(suggestions(page).first()).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'Spjall' })).toBeVisible()
  })

  test('the chat input is not a keyboard trap once there is a history', async ({
    page,
  }) => {
    await openChatFromSuggestion(page)
    await page.keyboard.press('Escape')

    await expect(page.locator('dialog')).toHaveCount(0)
    await expect(chatInput(page)).toBeFocused()

    // With a history, focus alone used to reopen the chat, so the input could
    // never be tabbed past
    await page.keyboard.press('Tab')
    await page.waitForTimeout(500)
    await expect(page.locator('dialog')).toHaveCount(0)
    await expect(chatInput(page)).not.toBeFocused()
  })

  test('the count and the sorting are announced', async ({ page }) => {
    const region = page.locator('header [aria-live="polite"]')

    // The count is not pinned, because most commits here add a car
    await expect(region).toHaveText(
      /^\d+ bílar á listanum, raðað eftir nafni, hækkandi röð\.$/,
    )

    await page
      .getByRole('button', { name: /^Drægni/ })
      .first()
      .click()
    await expect(region).toHaveText(/raðað eftir drægni, lækkandi röð\.$/)

    await page
      .getByRole('button', { name: /^Drægni/ })
      .first()
      .click()
    await expect(region).toHaveText(/raðað eftir drægni, hækkandi röð\.$/)
  })
})
