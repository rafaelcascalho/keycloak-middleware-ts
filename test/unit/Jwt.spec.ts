import test from 'japa'

import Jwt from '../../src/Jwt'
import Token from '../../src/Token'
import { mockConfig, mockAxiosInstance } from '../setup'
import { invalidAccessToken, validAccessToken, notExpiredToken } from '../mock/tokens'
import { cert } from '../mock/cert'

test.group('Jwt.verifyOffline', () => {
  const jwt = new Jwt(mockConfig, mockAxiosInstance)

  test('when the access token is invalid it should throw an error', async (assert) => {
    const expectedErrorMessage = 'invalid algorithm'

    try {
      await jwt.verifyOffline(invalidAccessToken, cert)
    } catch ({ message }) {
      assert.equal(message, expectedErrorMessage)
    }
  })

  test('when the access token is valid it should return a new Token instance', async (assert) => {
    const result = await jwt.verifyOffline(notExpiredToken, cert, { algorithms: ['ES512'] })

    assert.instanceOf(result, Token)
  })
})

test.group('Jwt.verify', (group) => {
  const jwt = new Jwt(mockConfig, mockAxiosInstance)

  group.beforeEach(() => {
    mockAxiosInstance.refresh()
  })

  test('when the access token is invalid it should throw an error', async (assert) => {
    const expectedErrorMessage = 'invalid algorithm'

    try {
      await jwt.verify(invalidAccessToken)
    } catch ({ message }) {
      assert.equal(message, expectedErrorMessage)
    }

    assert.equal(mockAxiosInstance._getCalls, 1)
  })

  test('when the access token is valid it should return a new Token instance', async (assert) => {
    const result = await jwt.verify(validAccessToken)

    assert.instanceOf(result, Token)
    assert.equal(mockAxiosInstance._getCalls, 1)
  })
})
