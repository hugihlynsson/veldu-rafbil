import { afterEach, describe, expect, it, vi } from 'vitest'

import { createRateLimit } from '@/modules/rateLimit'
import { deployment, readGuardedBody } from './publicEndpoint'

afterEach(() => {
  vi.unstubAllEnvs()
})

const post = (body: string) =>
  new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'x-forwarded-for': '10.2.0.1' },
    body,
  })

describe('deployment', () => {
  it('names a preview a preview, though NODE_ENV says production there', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', 'd791754')
    expect(deployment()).toEqual({
      environment: 'preview',
      commit: 'd791754',
    })
  })
})

describe('readGuardedBody', () => {
  it('reads the body of a caller within its allowance', async () => {
    const read = await readGuardedBody(post('{"a":1}'), createRateLimit(1))
    expect(read).toEqual({ body: { a: 1 } })
  })

  it('refuses a body that is not JSON', async () => {
    const read = await readGuardedBody(post('not json'), createRateLimit(1))
    expect(read instanceof Response && read.status).toBe(400)
  })

  it('refuses a caller past its allowance before reading the body', async () => {
    const limit = createRateLimit(1)
    await readGuardedBody(post('{}'), limit)
    const read = await readGuardedBody(post('{}'), limit)
    expect(read instanceof Response && read.status).toBe(429)
    expect(read instanceof Response && read.headers.get('Retry-After')).toBe(
      '60',
    )
  })
})
