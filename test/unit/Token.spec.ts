import test from 'japa'

import Token from '../../src/Token'
import { expiredToken, notExpiredToken, tokenWithRoles } from '../mock/tokens'

test.group('Token.isExpired', () => {
  test('when the token is expired should return true', (assert) => {
    const token = new Token(expiredToken)

    const result = token.isExpired()

    assert.isTrue(result)
  })

  test('when the token is not expired should return false', (assert) => {
    const token = new Token(notExpiredToken)

    const result = token.isExpired()

    assert.isFalse(result)
  })
})

test.group('Token.hasAppRole', () => {
  test('when the token does not have the expected app role should return true', (assert) => {
    const token = new Token(tokenWithRoles)

    const result = token.hasAppRole('realm-management', 'none')

    assert.isFalse(result)
  })

  test('when the token has the expected app role should return true', (assert) => {
    const token = new Token(tokenWithRoles)

    const result = token.hasAppRole('realm-management', 'query-users')

    assert.isTrue(result)
  })
})

test.group('Token.hasRealmRole', () => {
  test('when the token does not have the expected realm role should return true', (assert) => {
    const token = new Token(tokenWithRoles)

    const result = token.hasRealmRole('none')

    assert.isFalse(result)
  })

  test('when the token has the expected realm role should return true', (assert) => {
    const token = new Token(tokenWithRoles)

    const result = token.hasRealmRole('offline_access')

    assert.isTrue(result)
  })
})
