import { handleComicsRequest } from '../src/comics_endpoint'
import makeServiceWorkerEnv from 'service-worker-mock'

declare var global: any

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('handle GET', async () => {
    const result = await handleComicsRequest(
      new Request('/comics', { method: 'GET' }),
    )
    expect(result.status).toEqual(200)
  })
})
