import test from 'japa'

import { mockConfig, mockAxiosInstance } from '../setup'
import { KEY_END, KEY_START } from '../../src/constants'
import createKeycloakCtx, { validKeyEnd, validKeyStart, secureKeyFormat } from '../../src/index'

test.group('createKeycloakCtx', () => {
  test('when the request lib instance is mocked it should return a new full ctx', (assert) => {
    const ctx = createKeycloakCtx(mockConfig, mockAxiosInstance)

    assert.hasAllKeys(ctx, ['jwt', 'users', 'accessToken'])
  })

  test('when the request lib instance is not mocked it should return a new full ctx', (assert) => {
    const ctx = createKeycloakCtx(mockConfig)

    assert.hasAllKeys(ctx, ['jwt', 'users', 'accessToken'])
  })

  test('when the config have a key to validate the JWTs it should return a new full ctx', (assert) => {
    const ctx = createKeycloakCtx({ ...mockConfig, jwtKey: 'abc' })

    assert.hasAllKeys(ctx, ['jwt', 'users', 'accessToken'])
  })
})

test.group('validKeyStart', () => {
  test('when the key start is incorrect it should return false', (assert) => {
    const incorrectKey = 'abc'

    const result = validKeyStart(incorrectKey)

    assert.isFalse(result)
  })

  test('when the key start is correct it should return true', (assert) => {
    const correctKey = `${KEY_START}\nabc`

    const result = validKeyStart(correctKey)

    assert.isTrue(result)
  })
})

test.group('validKeyEnd', () => {
  test('when the key start is incorrect it should return false', (assert) => {
    const incorrectKey = 'abc'

    const result = validKeyEnd(incorrectKey)

    assert.isFalse(result)
  })

  test('when the key start is correct it should return true', (assert) => {
    const correctKey = `abc\n${KEY_END}`

    const result = validKeyEnd(correctKey)

    assert.isTrue(result)
  })
})

test.group('validKeyEnd', () => {
  const correctKey = `${KEY_START}\nabc\n${KEY_END}`

  test('when the key has correct start and end it should return the same string', (assert) => {
    const result = secureKeyFormat(correctKey)

    assert.equal(result, correctKey)
  })

  test('when the key has incorrect start it should return the string with a different start', (assert) => {
    const incorrectKey = `abc\n${KEY_END}`

    const result = secureKeyFormat(incorrectKey)

    assert.equal(result, correctKey)
  })

  test('when the key has incorrect end it should return the string with a different end', (assert) => {
    const incorrectKey = `${KEY_START}\nabc`

    const result = secureKeyFormat(incorrectKey)

    assert.equal(result, correctKey)
  })

  test('when the key has incorrect start and end it should return the string in the middle of a new start and end', (assert) => {
    const incorrectKey = `abc`

    const result = secureKeyFormat(incorrectKey)

    assert.equal(result, correctKey)
  })
})
