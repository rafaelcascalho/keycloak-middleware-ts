import test from 'japa'

import AccessToken from '../../src/AccessToken'
import { mockAccessToken } from '../mock/tokens'
import { mockConfig, mockAxiosInstance } from '../setup'

const accessToken = new AccessToken(mockConfig, mockAxiosInstance)

test.group('AccessToken.info', () => {
  test('should call the endpoint once', async (assert) => {
    await accessToken.info(mockAccessToken)

    assert.equal(mockAxiosInstance._getCalls, 1)
  })
})

mockAxiosInstance.refresh()

test.group('AccessToken.get', () => {
  test('should call the endpoint once', async (assert) => {
    await accessToken.get()

    assert.equal(mockAxiosInstance._postCalls, 1)
  })
})

mockAxiosInstance.refresh()

test.group('AccessToken.refresh', () => {
  test('should call the endpoint at least once', async (assert) => {
    await accessToken.refresh(mockAccessToken)

    assert.isAtLeast(mockAxiosInstance._postCalls, 1)
  })
})
