import test from 'japa'

import Jwt from '../../src/Jwt'
import Token from '../../src/Token'
import { mockConfig, mockAxiosInstance } from '../setup'
import { invalidAccessToken, validAccessToken, notExpiredToken } from '../mock/tokens'

test.group('Jwt.verify - offline strategy', () => {
  const jwt = new Jwt(mockConfig, mockAxiosInstance)

  test('when the access token is invalid it should throw an error', async (assert) => {
    const expectedErrorMessage = '"ES512" signatures must be "132" bytes, saw "131"'

    try {
      await jwt.verify(invalidAccessToken)
    } catch ({ message }) {
      assert.equal(message, expectedErrorMessage)
    }
  })

  test('when the access token is valid it should return a new Token instance', async (assert) => {
    const result = await jwt.verify(notExpiredToken)

    assert.instanceOf(result, Token)
  })
})

test.group('Jwt.verify - verification via request strategy', (group) => {
  const jwt = new Jwt(mockConfig, mockAxiosInstance)

  group.beforeEach(() => {
    mockAxiosInstance.refresh()
  })

  test('when the access token is invalid it should throw an error', async (assert) => {
    const expectedErrorMessage = 'invalid algorithm'

    try {
      await jwt.verify(invalidAccessToken, false)
    } catch ({ message }) {
      assert.equal(message, expectedErrorMessage)
    }

    assert.equal(mockAxiosInstance._getCalls, 1)
  })

  test('when the access token is valid it should return a new Token instance', async (assert) => {
    const result = await jwt.verify(validAccessToken, false)

    assert.instanceOf(result, Token)
    assert.equal(mockAxiosInstance._getCalls, 1)
  })
})
