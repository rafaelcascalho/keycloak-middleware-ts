import test from 'japa'

import createKeycloakCtx from '../../src/index'
import { mockConfig, mockAxiosInstance } from '../setup'

test.group('createKeycloakCtx', () => {
  test('when the request lib instance is mocked it should return a new full ctx', (assert) => {
    const ctx = createKeycloakCtx(mockConfig, mockAxiosInstance)

    assert.hasAllKeys(ctx, ['jwt', 'users', 'accessToken'])
  })

  test('when the request lib instance is not mocked it should return a new full ctx', (assert) => {
    const ctx = createKeycloakCtx(mockConfig)

    assert.hasAllKeys(ctx, ['jwt', 'users', 'accessToken'])
  })
})
