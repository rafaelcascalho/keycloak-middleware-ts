import { KeycloakConfig } from '../src/interfaces'
import { cert } from './mock/cert'

export const mockConfig: KeycloakConfig = {
  realm: 'test',
  authServerUrl: 'https://localhost:8081',
  clientId: 'abc123',
  username: 'test_user',
  password: 'test_user_pass',
  jwtKey: cert,
  jwtKeyAlgorithms: ['ES512']
}

class MockAxios {
  _getCalls = 0
  _putCalls = 0
  _postCalls = 0

  async get() {
    this._getCalls++
    return Promise.resolve(null)
  }

  async post(endpoint: string) {
    this._postCalls++

    if (endpoint.includes('token'))
      return Promise.resolve({ data: { refresh_token: '', access_token: '' } })

    return Promise.resolve({
      data: {
        sub: 0,
        email_verified: true,
        name: '',
        preferred_username: '',
        given_name: '',
        family_name: '',
        email: ''
      }, headers: { location: '/1' }
    })
  }

  async put() {
    this._putCalls++
    return Promise.resolve(null)
  }

  refresh() {
    this._getCalls = 0
    this._putCalls = 0
    this._postCalls = 0
  }
}

export const mockAxiosInstance = new MockAxios()
