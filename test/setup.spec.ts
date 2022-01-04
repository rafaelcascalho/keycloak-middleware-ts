import { KeycloakConfig } from '../src/interfaces'

export const mockConfig: KeycloakConfig = {
  realm: 'test',
  auth_server_url: 'https://localhost:8081',
  client_id: 'abc123',
  username: 'test_user',
  password: 'test_user_pass'
}

class MockAxios {
  _getCalls: number
  _postCalls: number

  constructor() {
    this._getCalls = 0
    this._postCalls = 0
  }

  async get() {
    this._getCalls++
    return Promise.resolve(null)
  }

  async post() {
    this._postCalls++
    return Promise.resolve(null)
  }
}

export const mockAxiosInstance = new MockAxios()
